#!/usr/bin/env node
/**
 * Extract and normalize Section 1 Feature Overview table from planner artifacts.
 */

import { readFile } from 'node:fs/promises';

const REQUIRED_ROWS = [
  { label: 'Feature', key: 'feature' },
  { label: 'Release', key: 'release' },
  { label: 'QA Owner', key: 'qa_owner' },
  { label: 'SE Design', key: 'se_design' },
  { label: 'UX Design', key: 'ux_design' },
];

const SUMMARY_KEY_ALIASES = {
  feature: 'feature',
  feature_id: 'feature',
  release: 'release',
  release_version: 'release',
  qa_owner: 'qa_owner',
  se_design: 'se_design',
  ux_design: 'ux_design',
};

function normalizeRowKey(label) {
  return String(label || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function extractHeadingSection(markdown, heading) {
  if (!markdown || !heading) return null;
  const lines = markdown.split('\n');
  let inSection = false;
  const collected = [];
  for (const line of lines) {
    if (line.trim().startsWith(heading)) {
      inSection = true;
      collected.push(line);
      continue;
    }
    if (inSection) {
      if (line.match(/^###\s+\d+\./)) break;
      if (line.match(/^##\s/)) break;
      collected.push(line);
    }
  }
  return collected.length ? collected.join('\n') : null;
}

function parseFeatureOverviewTable(section) {
  const rows = [];
  const lines = section.split('\n').filter((l) => l.includes('|'));
  const headerIdx = lines.findIndex((l) => l.includes('Feature') || l.includes('Field'));
  if (headerIdx < 0) return null;
  const header = lines[headerIdx];
  const sepIdx = lines.findIndex((l) => /^\|[\s\-:]+\|/.test(l));
  const dataStart = sepIdx >= 0 ? sepIdx + 1 : headerIdx + 1;
  for (let i = dataStart; i < lines.length; i++) {
    const cells = lines[i].split('|').map((c) => c.trim()).filter(Boolean);
    if (cells.length >= 2) {
      rows.push({ label: cells[0], value: cells[1] });
    }
  }
  return rows.length ? rows : null;
}

function parseSummaryMetadataRows(summaryMarkdown) {
  if (!summaryMarkdown) return [];
  const rows = [];
  const seen = new Set();
  const addRow = (label, value) => {
    const key = SUMMARY_KEY_ALIASES[normalizeRowKey(label)];
    if (!key || seen.has(key) || !value) return;
    const requiredRow = REQUIRED_ROWS.find((row) => row.key === key);
    rows.push({ label: requiredRow?.label ?? label, value: value.trim() });
    seen.add(key);
  };

  for (const line of summaryMarkdown.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const tableMatch = trimmed.match(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|?$/);
    if (tableMatch && !/^[-: ]+$/.test(tableMatch[1].trim())) {
      addRow(tableMatch[1].trim(), tableMatch[2].trim());
      continue;
    }

    const keyValueMatch = trimmed.match(/^(?:\*\*)?([^:*]+?)(?:\*\*)?\s*:\s*(.+)$/);
    if (keyValueMatch) {
      addRow(keyValueMatch[1].trim(), keyValueMatch[2].trim());
    }
  }

  return rows;
}

function buildRowLookup(rows) {
  const byLabel = {};
  for (const row of rows ?? []) {
    const key = normalizeRowKey(row.label);
    if (!key || byLabel[key]) continue;
    byLabel[key] = { label: row.label, value: row.value, usedPending: false };
  }
  return byLabel;
}

function normalizeFeatureOverviewRows({ featureKey, parsedRows, summaryMarkdown, jiraMetadata }) {
  const planRowsByKey = buildRowLookup(parsedRows);
  const summaryRowsByKey = buildRowLookup(parseSummaryMetadataRows(summaryMarkdown));
  const result = [];
  for (const { label, key } of REQUIRED_ROWS) {
    const existing = planRowsByKey[key] ?? summaryRowsByKey[key];
    const jiraValue = jiraMetadata?.[key] ?? null;
    if (existing && existing.value && !existing.value.includes('[PENDING]')) {
      result.push({ ...existing, usedPending: false });
    } else if (jiraValue) {
      result.push({ label, value: String(jiraValue), usedPending: false });
    } else if (key === 'feature') {
      result.push({ label, value: featureKey, usedPending: false });
    } else {
      const pendingMsg = key === 'se_design' || key === 'ux_design'
        ? '[PENDING — No SE Design or UX Design available.]'
        : `[PENDING — ${label} not provided in planner artifact.]`;
      result.push({ label, value: pendingMsg, usedPending: true });
    }
  }
  if (result.length === 0) {
    result.push({ label: 'Feature', value: featureKey, usedPending: false });
  }
  const first = result[0];
  if (!first || first.label !== 'Feature') {
    const featRow = result.find((r) => r.label === 'Feature') ?? { label: 'Feature', value: featureKey, usedPending: false };
    const others = result.filter((r) => r.label !== 'Feature');
    return [featRow, ...others];
  }
  return result;
}

function renderFeatureOverviewSection(rows) {
  const header = '### 1. Feature Overview';
  const tableHeader = '| Field | Value |';
  const tableSep = '| --- | --- |';
  const tableRows = rows.map((r) => `| ${r.label} | ${r.value} |`).join('\n');
  return `${header}\n\n${tableHeader}\n${tableSep}\n${tableRows}\n`;
}

export async function buildFeatureOverviewTable({ featureKey, planPath, summaryPath, jiraMetadata }) {
  let planMarkdown = '';
  let summaryMarkdown = '';
  if (planPath) {
    try {
      planMarkdown = await readFile(planPath, 'utf8');
    } catch {
      /* ignore */
    }
  }
  if (summaryPath) {
    try {
      summaryMarkdown = await readFile(summaryPath, 'utf8');
    } catch {
      /* ignore */
    }
  }

  const section = extractHeadingSection(planMarkdown, '### 1. Feature Overview');
  const parsedRows = section ? parseFeatureOverviewTable(section) : null;
  const metadataRows = parseSummaryMetadataRows(summaryMarkdown);
  const normalizedRows = normalizeFeatureOverviewRows({
    featureKey,
    parsedRows,
    summaryMarkdown,
    jiraMetadata,
  });

  const usedSection = !!section;
  const source = section
    ? 'planner_section'
    : metadataRows.length > 0
      ? 'planner_metadata'
      : 'fallback_default';

  return {
    markdown: renderFeatureOverviewSection(normalizedRows),
    metadata: {
      source,
      table_path: `runs/${featureKey}/context/feature_overview_table.md`,
      fallback_used: !section,
      missing_fields: normalizedRows.filter((r) => r.usedPending).map((r) => r.label),
      updated_at: new Date().toISOString(),
    },
  };
}
