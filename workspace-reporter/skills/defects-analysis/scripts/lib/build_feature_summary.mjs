#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { extractFeatureMetadata } from './extract_feature_metadata.mjs';

const DONE_STATUSES = new Set(['Done', 'Resolved', 'Closed']);
const HIGH_RISK_PRIORITIES = new Set([
  'HIGH',
  'HIGHEST',
  'CRITICAL',
  'BLOCKER',
  'P0',
  'P1',
]);

function safeReadJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

function normalizePriority(priority) {
  return String(priority ?? '').trim().toUpperCase();
}

function isOpenDefect(defect) {
  return !DONE_STATUSES.has(defect.status);
}

function isHighRiskDefect(defect) {
  return HIGH_RISK_PRIORITIES.has(normalizePriority(defect.priority));
}

function deriveArea(defect) {
  return defect.area || defect.functional_area || 'General';
}

function loadDefects(runDir) {
  const index = safeReadJson(join(runDir, 'context', 'defect_index.json'));
  if (Array.isArray(index?.defects)) {
    return index.defects;
  }

  const jiraRaw = safeReadJson(join(runDir, 'context', 'jira_raw.json')) ?? { issues: [] };
  return (jiraRaw.issues ?? []).map((issue) => ({
    key: issue.key,
    summary: issue.fields?.summary ?? issue.key,
    status: issue.fields?.status?.name ?? 'Unknown',
    priority: issue.fields?.priority?.name ?? 'Medium',
    assignee: issue.fields?.assignee?.displayName ?? 'Unassigned',
    area:
      issue.fields?.components?.[0]?.name ??
      issue.fields?.labels?.[0] ??
      issue.fields?.issuetype?.name ??
      'General',
    pr_links: [],
  }));
}

function loadPrSummary(runDir) {
  return (
    safeReadJson(join(runDir, 'context', 'pr_impact_summary.json')) ?? {
      pr_count: 0,
      repos_changed: [],
      top_risky_prs: [],
      top_changed_domains: [],
    }
  );
}

function collectTopRiskAreas(defects) {
  const areas = new Map();
  for (const defect of defects.filter(isOpenDefect)) {
    const area = deriveArea(defect);
    const entry = areas.get(area) ?? { area, open_count: 0, high_count: 0 };
    entry.open_count += 1;
    if (isHighRiskDefect(defect)) {
      entry.high_count += 1;
    }
    areas.set(area, entry);
  }
  return [...areas.values()]
    .sort((left, right) => right.high_count - left.high_count || right.open_count - left.open_count)
    .slice(0, 3)
    .map((entry) => entry.area);
}

function deriveRiskLevel(openHighDefects, openDefects) {
  if (openHighDefects.length > 0) {
    return 'HIGH';
  }
  if (openDefects.length > 5) {
    return 'MEDIUM';
  }
  return 'LOW';
}

function collectReposChanged(prSummary) {
  if (Array.isArray(prSummary.repos_changed) && prSummary.repos_changed.length > 0) {
    return prSummary.repos_changed;
  }
  return (prSummary.top_risky_prs ?? [])
    .map((entry) => entry.repository)
    .filter(Boolean);
}

export function buildFeatureSummaryData(runDir, runKey) {
  const metadata = extractFeatureMetadata(runDir, runKey);
  const defects = loadDefects(runDir);
  const prSummary = loadPrSummary(runDir);
  const openDefects = defects.filter(isOpenDefect);
  const openHighDefects = openDefects.filter(isHighRiskDefect);

  return {
    metadata,
    defects,
    prSummary,
    summary: {
      feature_key: metadata.feature_key,
      feature_title: metadata.feature_title,
      report_final_path: join(runDir, `${runKey}_REPORT_FINAL.md`),
      risk_level: deriveRiskLevel(openHighDefects, openDefects),
      total_defects: defects.length,
      open_defects: openDefects.length,
      open_high_defects: openHighDefects.length,
      pr_count: prSummary.pr_count ?? 0,
      repos_changed: collectReposChanged(prSummary),
      top_risk_areas: collectTopRiskAreas(defects),
      blocking_defects: openHighDefects.map((defect) => defect.key),
      generated_at: new Date().toISOString(),
    },
  };
}

export function buildFeatureSummary(runDir, runKey) {
  const payload = buildFeatureSummaryData(runDir, runKey);
  const outPath = join(runDir, 'context', 'feature_summary.json');
  writeFileSync(outPath, `${JSON.stringify(payload.summary, null, 2)}\n`, 'utf8');
  return outPath;
}

function main() {
  const [runDir, runKey] = process.argv.slice(2);
  if (!runDir || !runKey) {
    console.error('Usage: build_feature_summary.mjs <run-dir> <run-key>');
    process.exit(1);
  }
  const outPath = buildFeatureSummary(runDir, runKey);
  process.stdout.write(`${outPath}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
