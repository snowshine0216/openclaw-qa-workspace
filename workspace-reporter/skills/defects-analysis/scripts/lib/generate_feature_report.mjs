#!/usr/bin/env node
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildFeatureSummaryData } from './build_feature_summary.mjs';
import { inferFunctionalArea } from './derive_functional_area.mjs';
import { parsePrImpactMd } from './parse_pr_impact_md.mjs';

const DONE_STATUSES = new Set(['Done', 'Resolved', 'Closed']);
const HIGH_RISK_PATTERN = /high|critical|blocker|p0|p1/i;

function formatDate(iso) {
  if (!iso) return '—';
  const parsed = new Date(iso);
  return Number.isNaN(parsed.valueOf()) ? String(iso) : parsed.toISOString().slice(0, 10);
}

function isOpen(defect) {
  return !DONE_STATUSES.has(defect.status);
}

function isHighRisk(defect) {
  return HIGH_RISK_PATTERN.test(String(defect.priority ?? ''));
}

function normalizeRiskLevel(level) {
  const normalized = String(level ?? 'MEDIUM').trim().toUpperCase();
  return normalized || 'MEDIUM';
}

function riskEmoji(level) {
  switch (normalizeRiskLevel(level)) {
    case 'HIGH':
    case 'CRITICAL':
      return '🔴';
    case 'LOW':
      return '🟢';
    case 'MEDIUM':
    default:
      return '🟡';
  }
}

function riskLabel(level) {
  const normalized = normalizeRiskLevel(level);
  return `${normalized.slice(0, 1)}${normalized.slice(1).toLowerCase()}`;
}

function cleanSentence(value) {
  return String(value ?? '')
    .replace(/\r/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function groupByStatus(defects) {
  return {
    done: defects.filter((defect) => DONE_STATUSES.has(defect.status)),
    inProgress: defects.filter((defect) => ['In Progress', 'In Development'].includes(defect.status)),
    toDo: defects.filter((defect) => ['To Do', 'Open', 'Backlog'].includes(defect.status)),
    other: defects.filter(
      (defect) =>
        !DONE_STATUSES.has(defect.status) &&
        !['In Progress', 'In Development', 'To Do', 'Open', 'Backlog'].includes(defect.status),
    ),
  };
}

function groupByArea(defects) {
  const areas = new Map();
  for (const defect of defects) {
    const area = inferFunctionalArea(defect);
    const entry =
      areas.get(area) ??
      { area, total: 0, open: 0, high: 0, keys: [], open_keys: [] };
    entry.total += 1;
    if (isOpen(defect)) {
      entry.open += 1;
      entry.open_keys.push(defect.key);
      if (isHighRisk(defect)) {
        entry.high += 1;
      }
    }
    entry.keys.push(defect.key);
    areas.set(area, entry);
  }
  const ranked = [...areas.values()].sort((left, right) => right.high - left.high || right.open - left.open);
  const nonGeneric = ranked.filter((entry) => entry.area !== 'General');
  return nonGeneric.length > 0 ? nonGeneric : ranked;
}

function readPrImpactReports(runDir) {
  const prDir = join(runDir, 'context', 'prs');
  try {
    return readdirSync(prDir)
      .filter((name) => name.endsWith('_impact.md'))
      .sort()
      .map((name) => {
        const content = readFileSync(join(prDir, name), 'utf8');
        return { name, content, parsed: parsePrImpactMd(content) };
      });
  } catch {
    return [];
  }
}

function defectRows(defects, jiraBaseUrl, columnValue) {
  if (defects.length === 0) {
    return '| — | — | — | — |';
  }
  return defects
    .map(
      (defect) =>
        `| [${defect.key}](${jiraBaseUrl}/browse/${defect.key}) | ${defect.summary} | ${defect.priority} | ${columnValue(defect)} |`,
    )
    .join('\n');
}

function functionalAreaTable(areaGroups) {
  if (areaGroups.length === 0) {
    return '| Area | Total | Open | High |\n|------|-------|------|------|\n| General | 0 | 0 | 0 |';
  }
  const rows = areaGroups
    .map((entry) => `| ${entry.area} | ${entry.total} | ${entry.open} | ${entry.high} |`)
    .join('\n');
  return `| Area | Total | Open | High |\n|------|-------|------|------|\n${rows}`;
}

function functionalAreaRiskNotes(areaGroups, defects, jiraBaseUrl) {
  const openDefectByKey = new Map(defects.filter(isOpen).map((defect) => [defect.key, defect]));
  const notes = areaGroups
    .filter((entry) => entry.open > 0)
    .slice(0, 4)
    .map((entry) => {
      const sample = entry.open_keys
        .map((key) => openDefectByKey.get(key))
        .filter(Boolean)
        .slice(0, 2)
        .map((defect) => `[${defect.key}](${jiraBaseUrl}/browse/${defect.key})`)
        .join(', ');
      return `- ${entry.area}: ${entry.open} open (${entry.high} high). Representative defects: ${sample || 'n/a'}.`;
    });
  return notes.length > 0 ? notes.join('\n') : '- No unresolved functional-area hotspots detected.';
}

function buildPriorityDistribution(defects) {
  const buckets = new Map();
  for (const defect of defects) {
    const priority = String(defect.priority ?? 'Unknown');
    const entry = buckets.get(priority) ?? { priority, total: 0, open: 0 };
    entry.total += 1;
    if (isOpen(defect)) {
      entry.open += 1;
    }
    buckets.set(priority, entry);
  }
  const rows = [...buckets.values()]
    .sort((left, right) => right.open - left.open || right.total - left.total)
    .map((entry) => `| ${entry.priority} | ${entry.total} | ${entry.open} |`)
    .join('\n');
  return `| Priority | Total | Open |\n|----------|-------|------|\n${rows || '| — | 0 | 0 |'}`;
}

function buildReleaseRecommendation(summary) {
  if (summary.blocking_defects.length > 0) {
    return 'hold release until blocking defects are resolved';
  }
  if (summary.open_defects > 0) {
    return 'proceed only with targeted regression verification on the top risk areas';
  }
  return 'ready for release verification';
}

function buildHeaderRows(metadata, summary, prSummary, reportDate) {
  const rows = [
    `| Feature | ${summary.feature_key} — ${metadata.feature_title} |`,
    `| Report Date | ${reportDate} |`,
    `| Total Defects | ${summary.total_defects} |`,
    `| Open Defects | ${summary.open_defects} |`,
    `| Linked PRs (all merged) | ${summary.pr_count} |`,
    `| Fix Version | ${metadata.release_version ?? '—'} |`,
    `| Overall Risk | ${riskEmoji(summary.risk_level)} ${summary.risk_level} |`,
  ];
  if (prSummary.repos_changed?.[0]) {
    rows.push(`| Repo | ${prSummary.repos_changed[0]} |`);
  }
  return `| Field | Value |\n|-------|-------|\n${rows.join('\n')}`;
}

function buildExecutiveNarrative(summary, metadata) {
  const topArea = summary.top_risk_areas[0] ?? 'core workflow changes';
  const resolved = Math.max(summary.total_defects - summary.open_defects, 0);
  const blockingText =
    summary.blocking_defects.length > 0
      ? ` **${summary.blocking_defects.length} high-priority blocking defect(s) remain open.** Release hold recommended.`
      : '';
  return `This feature ${metadata.feature_title ?? summary.feature_key} introduces ${topArea}. ${resolved} of ${summary.total_defects} defects are resolved.${blockingText}`;
}

function buildBlockingNarratives(blockingDefects, defects) {
  if (blockingDefects.length === 0) {
    return 'No blocking defects remain open.';
  }
  const entries = blockingDefects
    .map((key) => defects.find((defect) => defect.key === key))
    .filter(Boolean)
    .map(
      (defect) => `**${defect.key}** — *${defect.summary}*
- Status: ${defect.status} | Priority: ${defect.priority} | Assignee: ${defect.assignee ?? '—'}
- **Release hold recommended** until confirmed resolved.`,
    );
  return entries.join('\n\n');
}

function extractSummaryFallback(entry) {
  return parsePrImpactMd(String(entry?.summary ?? ''));
}

function extractPrNumber(entry, parsedFallback) {
  if (typeof entry?.number === 'number' && Number.isFinite(entry.number)) {
    return entry.number;
  }
  if (typeof parsedFallback?.number === 'number') {
    return parsedFallback.number;
  }
  return null;
}

function mergePrEntry(entry, report, index) {
  const summaryFallback = extractSummaryFallback(entry);
  const parsed = report?.parsed ?? {};
  const linkedJira = [
    ...(Array.isArray(entry?.linked_jira) ? entry.linked_jira : []),
    ...(parsed.linked_jira ?? []),
    ...(summaryFallback.linked_jira ?? []),
  ];
  const merged = {
    repository: entry?.repository ?? parsed.repository ?? summaryFallback.repository ?? null,
    number: extractPrNumber(entry, parsed.number ? parsed : summaryFallback),
    title:
      entry?.title ??
      parsed.title ??
      summaryFallback.title ??
      (extractPrNumber(entry, parsed.number ? parsed : summaryFallback)
        ? `PR #${extractPrNumber(entry, parsed.number ? parsed : summaryFallback)}`
        : `PR ${index + 1}`),
    linked_jira: [...new Set(linkedJira.filter(Boolean))],
    merged_at: parsed.merged_at ?? summaryFallback.merged_at ?? null,
    risk_note:
      parsed.risk_note ??
      (!String(entry?.summary ?? '').includes('| Field | Value |') ? cleanSentence(entry?.summary) : '') ??
      '',
    risk_level: normalizeRiskLevel(entry?.risk_level ?? parsed.risk_level ?? summaryFallback.risk_level),
    source_content: `${report?.content ?? ''}\n${entry?.summary ?? ''}`,
  };
  return merged;
}

function hasPrSignal(entry) {
  return Boolean(
    entry.number ||
      entry.repository ||
      entry.title ||
      entry.merged_at ||
      entry.risk_note ||
      entry.linked_jira?.length,
  );
}

function mergePrEntries(prSummary, prReports) {
  const summaryEntries = (prSummary.top_risky_prs ?? []).map((entry, index) =>
    mergePrEntry(entry, entry?.number == null ? prReports[index] : prReports.find((report) => report.parsed.number === entry.number), index),
  );
  const extraReports = prReports
    .slice(summaryEntries.length)
    .map((report, index) => mergePrEntry({}, report, summaryEntries.length + index));
  const merged = [...summaryEntries, ...extraReports].filter(hasPrSignal);
  const seen = new Set();
  return merged.filter((entry) => {
    const key = `${entry.repository ?? 'repo'}:${entry.number ?? 'n/a'}:${entry.title ?? 'title'}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function buildCodeChangeSectionFromImpactMd(prReports, prSummary) {
  const mergedPrs = mergePrEntries(prSummary, prReports);
  if ((prSummary.pr_count ?? 0) === 0 && mergedPrs.length === 0) {
    return 'No linked PR analysis was produced for this feature run.';
  }

  const repositories = [
    ...new Set([
      ...(prSummary.repos_changed ?? []),
      ...mergedPrs.map((entry) => entry.repository).filter(Boolean),
    ]),
  ];
  const rows = mergedPrs
    .map((entry) => {
      const jira = entry.linked_jira.length > 0 ? entry.linked_jira.join(', ') : '—';
      return `| PR #${entry.number ?? '—'} | ${entry.title ?? '—'} | ${jira} | ${riskEmoji(entry.risk_level)} ${entry.risk_level} | ${entry.merged_at ?? '—'} |`;
    })
    .join('\n');
  const narratives = mergedPrs
    .filter((entry) => entry.risk_note)
    .slice(0, 3)
    .map(
      (entry) => `**PR #${entry.number ?? '—'} — ${entry.title ?? 'Untitled PR'}** (${riskEmoji(entry.risk_level)} ${riskLabel(entry.risk_level)})
${entry.risk_note}`,
    )
    .join('\n\n');

  return `${repositories.length > 0 ? `Repositories analyzed: ${repositories.join(', ')}\n\n` : ''}| PR | Title | Jira | Risk | Merged |
|----|-------|------|------|--------|
${rows}

${narratives || 'No per-PR narrative risk notes were captured.'}`;
}

function buildRiskRows(summary, defects, prReports) {
  const openRate = summary.total_defects === 0 ? 0 : (summary.open_defects / summary.total_defects) * 100;
  const openRateLevel = openRate > 30 ? 'HIGH' : openRate > 10 ? 'MEDIUM' : 'LOW';
  const runPrefix = String(summary.feature_key).split('-')[0];
  const crossProjectKeys = defects
    .map((defect) => defect.key)
    .filter((key) => String(key).split('-')[0] !== runPrefix);
  const mitigationMentioned = prReports.some((report) => /(mitigation|hide|workaround)/i.test(report.content));
  const rows = [
    {
      category: 'Unresolved blocking defects',
      level: summary.blocking_defects.length > 0 ? 'HIGH' : 'LOW',
      detail: summary.blocking_defects.length > 0 ? `${summary.blocking_defects.join(', ')} open` : 'None open',
    },
    {
      category: 'Open defects rate',
      level: openRateLevel,
      detail: `${summary.open_defects}/${summary.total_defects} open (${Math.round(openRate)}%)`,
    },
    {
      category: 'Cross-project issues',
      level: crossProjectKeys.length > 0 ? 'MEDIUM' : 'LOW',
      detail:
        crossProjectKeys.length > 0
          ? `${[...new Set(crossProjectKeys)].join(', ')} extends beyond ${runPrefix}`
          : `All defect keys remain within ${runPrefix}`,
    },
    {
      category: 'UI mitigation vs root-cause',
      level: mitigationMentioned ? 'MEDIUM' : 'LOW',
      detail: mitigationMentioned ? 'PR analysis mentions mitigation/hide/workaround.' : 'No mitigation-only wording detected.',
    },
  ];
  return rows
    .map((row) => `| ${row.category} | ${riskEmoji(row.level)} ${riskLabel(row.level)} | ${row.detail} |`)
    .join('\n');
}

function buildQAFocusAreas(areaGroups, defects) {
  const openDefects = defects.filter(isOpen);
  const items = areaGroups
    .filter((entry) => entry.open > 0)
    .slice(0, 4)
    .map((entry, index) => {
      const examples = openDefects
        .filter((defect) => inferFunctionalArea(defect) === entry.area)
        .slice(0, 2)
        .map((defect) => `${defect.key} ${defect.summary}`)
        .join('; ');
      const highText = entry.high > 0 ? `, ${entry.high} high` : '';
      return `${index + 1}. **${entry.area}** (${entry.open} open${highText})
   - Verify: ${examples || 'Representative open scenarios were not captured.'}`;
    });
  if (items.length > 0) {
    return items.join('\n');
  }
  return '1. **Smoke Regression** (0 open)\n   - Verify: End-to-end feature flow and release-signoff path.';
}

function latestMergedAt(prEntries) {
  return prEntries
    .map((entry) => entry.merged_at)
    .filter(Boolean)
    .sort()
    .at(-1);
}

function buildEnvRecommendations(defects, metadata, prSummary, prReports) {
  const openDefects = defects.filter(isOpen);
  const mergedPrs = mergePrEntries(prSummary, prReports);
  const summaries = defects.map((defect) => cleanSentence(defect.summary)).join(' ');
  const lines = [
    `- Re-run top-risk flows for ${metadata.feature_key} (${metadata.feature_title}) in a production-like environment with feature flags matching defect repro steps.`,
    `- Validate changes in environments touched by linked PRs (see Section 6).`,
    `- Preserve repro fixtures for: ${openDefects.length > 0 ? [...new Set(openDefects.map(inferFunctionalArea))].slice(0, 4).join(', ') : 'all open defect areas'}.`,
    `- Confirm ${openDefects.length} still-open defect(s) are reproducible before sign-off for ${metadata.feature_key}.`,
  ];
  const latestMerged = latestMergedAt(mergedPrs);
  if (latestMerged) {
    lines.push(`- **Build required:** build containing PRs merged on/after ${latestMerged}`);
  }
  if (/workstation|library/i.test(summaries)) {
    lines.push('- Test on both **Library** and **Workstation** surfaces');
  }
  if (/privilege|permission/i.test(summaries)) {
    lines.push('- Include a user with **limited privileges**');
  }
  if (/loading|cancel/i.test(summaries)) {
    lines.push('- Use **throttled network** for timing-dependent cancel flows');
  }
  return lines.join('\n');
}

function buildVerificationChecklist(defects, summary) {
  const items = [];
  for (const key of summary.blocking_defects.slice(0, 6)) {
    items.push(`- [ ] ${key} — confirm resolved or explicitly deferred`);
  }
  const highOpen = defects
    .filter((defect) => isOpen(defect) && isHighRisk(defect))
    .filter((defect) => !summary.blocking_defects.includes(defect.key))
    .slice(0, 5);
  for (const defect of highOpen) {
    items.push(`- [ ] ${defect.key} — verify fix in target build (${defect.summary ?? ''})`);
  }
  if (summary.top_risk_areas.length > 0) {
    items.push(`- [ ] Regression coverage for: ${summary.top_risk_areas.join(', ')}`);
  }
  items.push('- [ ] All linked PR impact areas signed off before release');
  return items.length > 0 ? items.join('\n') : '- [ ] Smoke test feature flow; confirm no open defects remain.';
}

function buildAppendix(defects, jiraBaseUrl) {
  if (defects.length === 0) {
    return '| ID | Summary | Status | Priority | Jira URL |\n|----|---------|--------|----------|----------|\n| — | — | — | — | — |';
  }
  const rows = defects
    .map(
      (defect) =>
        `| ${defect.key} | ${defect.summary} | ${defect.status ?? '—'} | ${defect.priority ?? '—'} | ${jiraBaseUrl}/browse/${defect.key} |`,
    )
    .join('\n');
  return `| ID | Summary | Status | Priority | Jira URL |\n|----|---------|--------|----------|----------|\n${rows}`;
}

export function generateFeatureReport(runDir, runKey, jiraBaseUrl) {
  const { metadata, defects, prSummary, summary } = buildFeatureSummaryData(runDir, runKey);
  const statuses = groupByStatus(defects);
  const areaGroups = groupByArea(defects);
  const prReports = readPrImpactReports(runDir);
  const recommendation = buildReleaseRecommendation(summary);
  const reportDate = new Date().toISOString().slice(0, 10);
  const hasBlocking =
    statuses.toDo.some((defect) => summary.blocking_defects.includes(defect.key)) ||
    statuses.inProgress.some((defect) => summary.blocking_defects.includes(defect.key));

  const report = `# QA Risk & Defect Analysis Report

## 1. Report Header

${buildHeaderRows(metadata, summary, prSummary, reportDate)}

**Feature Title:** ${metadata.feature_title ?? summary.feature_key}

---

## 2. Executive Summary

| Metric | Count |
|--------|-------|
| Total Defects | ${summary.total_defects} |
| Open Defects | ${summary.open_defects} |
| Open High-Priority Defects | ${summary.open_high_defects} |
| Linked PRs | ${summary.pr_count} |

### Risk Rating: ${riskEmoji(summary.risk_level)} ${summary.risk_level}

${buildExecutiveNarrative(summary, metadata)}

---

## 3. Defect Breakdown by Status

### ✅ Closed / Done (${statuses.done.length})

| ID | Summary | Priority | Fixed Date |
|----|---------|----------|------------|
${defectRows(statuses.done, jiraBaseUrl, (defect) => formatDate(defect.resolutiondate))}

### 🔶 In Progress (${statuses.inProgress.length})

| ID | Summary | Priority | Assignee |
|----|---------|----------|----------|
${defectRows(statuses.inProgress, jiraBaseUrl, (defect) => defect.assignee ?? '—')}

### 🔲 To Do / Open (${statuses.toDo.length})${hasBlocking ? ' — ⚠️ BLOCKING' : ''}

| ID | Summary | Priority | Assignee |
|----|---------|----------|----------|
${defectRows(statuses.toDo, jiraBaseUrl, (defect) => defect.assignee ?? '—')}

${statuses.other.length > 0 ? `### 🟦 Other Open (${statuses.other.length})

| ID | Summary | Priority | Assignee |
|----|---------|----------|----------|
${defectRows(statuses.other, jiraBaseUrl, (defect) => defect.assignee ?? '—')}

` : ''}---

## 4. Risk Analysis by Functional Area

${functionalAreaTable(areaGroups)}

Key open-risk clusters:
${functionalAreaRiskNotes(areaGroups, defects, jiraBaseUrl)}

---

## 5. Defect Analysis by Priority

High-risk open: ${summary.open_high_defects}. Medium/Low: ${summary.total_defects - summary.open_high_defects} total.

${buildPriorityDistribution(defects)}

${buildBlockingNarratives(summary.blocking_defects, defects)}

---

## 6. Code Change Analysis

${buildCodeChangeSectionFromImpactMd(prReports, prSummary)}

---

## 7. Residual Risk Assessment

| Risk Category | Level | Detail |
|--------------|-------|--------|
${buildRiskRows(summary, defects, prReports)}

---

## 8. Recommended QA Focus Areas

${buildQAFocusAreas(areaGroups, defects)}

---

## 9. Test Environment Recommendations

${buildEnvRecommendations(defects, metadata, prSummary, prReports)}

---

## 10. Verification Checklist for Release

${buildVerificationChecklist(defects, summary)}

---

## 11. Conclusion

Release Recommendation: ${recommendation}.

---

## 12. Appendix: Defect Reference List

${buildAppendix(defects, jiraBaseUrl)}
`;

  const outPath = join(runDir, `${runKey}_REPORT_DRAFT.md`);
  writeFileSync(outPath, `${report}\n`, 'utf8');
  return outPath;
}

function main() {
  const [runDir, runKey, jiraBaseUrl] = process.argv.slice(2);
  if (!runDir || !runKey || !jiraBaseUrl) {
    console.error('Usage: generate_feature_report.mjs <run-dir> <run-key> <jira-base-url>');
    process.exit(1);
  }
  generateFeatureReport(runDir, runKey, jiraBaseUrl);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
