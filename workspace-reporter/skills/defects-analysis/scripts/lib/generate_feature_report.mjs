#!/usr/bin/env node
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildFeatureSummaryData } from './build_feature_summary.mjs';

const DONE_STATUSES = new Set(['Done', 'Resolved', 'Closed']);

function formatDate(iso) {
  if (!iso) return '—';
  const parsed = new Date(iso);
  return Number.isNaN(parsed.valueOf()) ? String(iso) : parsed.toISOString().slice(0, 10);
}

function isOpen(defect) {
  return !DONE_STATUSES.has(defect.status);
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
    const area = defect.area || defect.functional_area || 'General';
    const entry = areas.get(area) ?? { area, total: 0, open: 0, high: 0 };
    entry.total += 1;
    if (isOpen(defect)) {
      entry.open += 1;
    }
    if ((defect.priority ?? '').toString().match(/high|critical|blocker|p0|p1/i)) {
      entry.high += 1;
    }
    areas.set(area, entry);
  }
  return [...areas.values()].sort((left, right) => right.high - left.high || right.open - left.open);
}

function readPrImpactReports(runDir) {
  const prDir = join(runDir, 'context', 'prs');
  try {
    return readdirSync(prDir)
      .filter((name) => name.endsWith('_impact.md'))
      .map((name) => ({ name, content: readFileSync(join(prDir, name), 'utf8') }));
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

function buildHighPrioritySection(blockingDefects, defects, jiraBaseUrl) {
  if (blockingDefects.length === 0) {
    return 'Blocking defects: none. No open high-priority defects remain.\n';
  }
  const rows = blockingDefects
    .map((key) => defects.find((defect) => defect.key === key))
    .filter(Boolean)
    .map(
      (defect) =>
        `- [${defect.key}](${jiraBaseUrl}/browse/${defect.key}) — ${defect.summary} (${defect.status}, ${defect.priority})`,
    )
    .join('\n');
  return `Blocking defects:\n${rows}\n`;
}

function buildCodeChangeSection(prSummary, prReports) {
  const repos = prSummary.repos_changed ?? [];
  const riskyPrs = prSummary.top_risky_prs ?? [];
  const domains = prSummary.top_changed_domains ?? prSummary.domains ?? [];

  if ((prSummary.pr_count ?? 0) === 0 && prReports.length === 0) {
    return 'No linked PR analysis was produced for this feature run.';
  }

  const repoLine = repos.length > 0 ? `Repos changed: ${repos.join(', ')}.` : 'Repos changed: not captured.';
  const domainLine =
    domains.length > 0 ? `Top changed domains: ${domains.join(', ')}.` : 'Top changed domains: not captured.';
  const riskyLines =
    riskyPrs.length > 0
      ? riskyPrs
          .map(
            (entry) =>
              `- ${entry.repository ?? 'unknown-repo'} PR #${entry.number ?? 'n/a'} (${entry.risk_level ?? 'MEDIUM'}): ${entry.summary ?? 'Risk summary not captured.'}`,
          )
          .join('\n')
      : prReports.map((report) => `- ${report.name}: synthesized from PR impact markdown.`).join('\n');

  return `${repoLine}\n${domainLine}\nTop risky PRs:\n${riskyLines}`;
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

function buildAppendix(defects, jiraBaseUrl) {
  if (defects.length === 0) {
    return '| ID | Jira URL |\n|----|----------|\n| — | — |';
  }
  const rows = defects
    .map((defect) => `| ${defect.key} | ${jiraBaseUrl}/browse/${defect.key} |`)
    .join('\n');
  return `| ID | Jira URL |\n|----|----------|\n${rows}`;
}

export function generateFeatureReport(runDir, runKey, jiraBaseUrl) {
  const { metadata, defects, prSummary, summary } = buildFeatureSummaryData(runDir, runKey);
  const statuses = groupByStatus(defects);
  const areaGroups = groupByArea(defects);
  const prReports = readPrImpactReports(runDir);
  const recommendation = buildReleaseRecommendation(summary);
  const reportDate = new Date().toISOString().slice(0, 10);

  const report = `## 1. Report Header

# QA Risk & Defect Analysis Report
## ${runKey}: Defect Analysis

**Report Date:** ${reportDate}
**Feature Key:** ${metadata.feature_key}
**Feature Title:** ${metadata.feature_title}
**Total Defects Analyzed:** ${summary.total_defects}

---

## 2. Executive Summary

| Metric | Count |
|--------|-------|
| Total Defects | ${summary.total_defects} |
| Open Defects | ${summary.open_defects} |
| Open High-Priority Defects | ${summary.open_high_defects} |
| Linked PRs | ${summary.pr_count} |

### Risk Rating: **${summary.risk_level}**

Primary concerns: ${summary.top_risk_areas.length > 0 ? summary.top_risk_areas.join(', ') : 'No elevated functional hotspots detected'}.

---

## 3. Defect Breakdown by Status

### Completed Defects (${statuses.done.length})

| ID | Summary | Priority | Fixed Date |
|----|---------|----------|------------|
${defectRows(statuses.done, jiraBaseUrl, (defect) => formatDate(defect.resolutiondate))}

### In Progress Defects (${statuses.inProgress.length})

| ID | Summary | Priority | Assignee |
|----|---------|----------|----------|
${defectRows(statuses.inProgress, jiraBaseUrl, (defect) => defect.assignee ?? '—')}

### To Do Defects (${statuses.toDo.length})

| ID | Summary | Priority | Assignee |
|----|---------|----------|----------|
${defectRows(statuses.toDo, jiraBaseUrl, (defect) => defect.assignee ?? '—')}

${statuses.other.length > 0 ? `### Additional Open Defects (${statuses.other.length})

| ID | Summary | Priority | Assignee |
|----|---------|----------|----------|
${defectRows(statuses.other, jiraBaseUrl, (defect) => defect.assignee ?? '—')}
` : ''}
---

## 4. Risk Analysis by Functional Area

${functionalAreaTable(areaGroups)}

---

## 5. Defect Analysis by Priority

High-risk open: ${summary.open_high_defects}. Medium/Low: ${summary.total_defects - summary.open_high_defects} total.

${buildHighPrioritySection(summary.blocking_defects, defects, jiraBaseUrl)}

---

## 6. Code Change Analysis

${buildCodeChangeSection(prSummary, prReports)}

---

## 7. Residual Risk Assessment

Overall Risk Level: **${summary.risk_level}**

Residual risk is concentrated in: ${summary.top_risk_areas.length > 0 ? summary.top_risk_areas.join(', ') : 'no unresolved functional cluster'}.

---

## 8. Recommended QA Focus Areas

${summary.top_risk_areas.length > 0 ? summary.top_risk_areas.map((area) => `- ${area}`).join('\n') : '- Smoke test the feature flow and confirm no open defect clusters remain.'}

---

## 9. Test Environment Recommendations

- Re-run the top-risk flows with production-like feature flags.
- Validate repository-specific changes in the environments touched by the linked PRs.
- Preserve defect repro fixtures for ${metadata.feature_key}.

---

## 10. Verification Checklist for Release

- Confirm each blocking defect status in Jira matches reality.
- Verify the highest-risk areas: ${summary.top_risk_areas.length > 0 ? summary.top_risk_areas.join(', ') : 'baseline regression coverage'}.
- Recheck all linked PR impact areas before sign-off.

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
