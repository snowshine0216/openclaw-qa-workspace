#!/usr/bin/env node
/**
 * Orchestrator-owned report generation for defects-analysis.
 * Reads context artifacts and produces <run-key>_REPORT_DRAFT.md per the 12-section format.
 *
 * Usage: node generate_report.mjs <run-dir> <run-key> <jira-base-url>
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

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

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toISOString().slice(0, 10);
}

function isOpenDefect(defect) {
  return !DONE_STATUSES.has(defect.status);
}

function normalizePriority(priority) {
  return String(priority ?? '')
    .trim()
    .toUpperCase();
}

function isHighRiskPriority(priority) {
  return HIGH_RISK_PRIORITIES.has(normalizePriority(priority));
}

function extractDefects(jiraRaw) {
  const issues = jiraRaw?.issues ?? [];
  return issues.map((issue) => {
    const f = issue.fields ?? {};
    const status = f.status?.name ?? 'Unknown';
    const priority = f.priority?.name ?? 'Medium';
    const assignee = f.assignee?.displayName ?? '—';
    const resolutiondate = f.resolutiondate ?? null;
    const summary = f.summary ?? issue.key ?? '—';
    return {
      key: issue.key,
      summary,
      status,
      priority,
      assignee,
      resolutiondate,
    };
  });
}

function groupByStatus(defects) {
  const done = defects.filter((d) => DONE_STATUSES.has(d.status));
  const inProgress = defects.filter((d) =>
    ['In Progress', 'In Development'].includes(d.status)
  );
  const toDo = defects.filter((d) =>
    ['To Do', 'Open', 'Backlog'].includes(d.status)
  );
  const other = defects.filter(
    (d) =>
      !done.includes(d) && !inProgress.includes(d) && !toDo.includes(d)
  );
  return { done, inProgress, toDo, other };
}

function buildReport(runDir, runKey, jiraBaseUrl) {
  const contextDir = join(runDir, 'context');
  const jiraRaw = safeReadJson(join(contextDir, 'jira_raw.json')) ?? {
    issues: [],
  };
  const defects = extractDefects(jiraRaw);
  const { done, inProgress, toDo, other } = groupByStatus(defects);
  const total = defects.length;
  const reportDate = new Date().toISOString().slice(0, 10);

  const base = jiraBaseUrl.replace(/\/$/, '');
  const link = (key) => `[${key}](${base}/browse/${key})`;

  let prSection = '';
  try {
    const prDir = join(contextDir, 'prs');
    const files = readdirSync(prDir, { withFileTypes: true }).filter((e) =>
      e.name.endsWith('_impact.md')
    );
    const prSummary = safeReadJson(join(contextDir, 'pr_impact_summary.json'));
    if (files.length > 0 || prSummary) {
      const prCount = prSummary?.pr_count ?? files.length;
      prSection = `PR analysis completed for ${prCount} linked PR(s). See context/prs/ for impact summaries.`;
    } else {
      prSection =
        'PR links were not found in the Jira issue comments, or PR analysis has not been run.';
    }
  } catch {
    prSection =
      'PR links were not found in the Jira issue comments, or PR analysis has not been run.';
  }

  const highOpen = defects.filter(
    (d) => isOpenDefect(d) && isHighRiskPriority(d.priority)
  );
  const riskLevel = highOpen.length > 0 ? 'HIGH' : total > 5 ? 'MEDIUM' : 'LOW';

  const donePct = total ? Math.round((done.length / total) * 100) : 0;
  const inProgressPct = total ? Math.round((inProgress.length / total) * 100) : 0;
  const toDoPct = total ? Math.round((toDo.length / total) * 100) : 0;

  const rows = (list, cols) =>
    list.length === 0
      ? '| — | — | — | — |'
      : list
          .map((d) => `| ${link(d.key)} | ${d.summary} | ${d.priority} | ${cols(d)} |`)
          .join('\n');

  const sections = [
    `## 1. Report Header

# QA Risk & Defect Analysis Report
## ${runKey}: Defect Analysis

**Report Date:** ${reportDate}
**Feature:** ${runKey}
**Total Defects Analyzed:** ${total}
`,

    `## 2. Executive Summary

| Metric | Count | Percentage |
|--------|-------|------------|
| **Total Defects** | ${total} | 100% |
| **Completed (Done)** | ${done.length} | ${donePct}% |
| **In Progress** | ${inProgress.length} | ${inProgressPct}% |
| **To Do** | ${toDo.length} | ${toDoPct}% |

### Risk Rating: **${riskLevel}**
`,

    `## 3. Defect Breakdown by Status

### ✅ Completed Defects (${done.length})

| ID | Summary | Priority | Fixed Date |
|----|---------|----------|------------|
${rows(done, (d) => formatDate(d.resolutiondate))}

### 🔄 In Progress Defects (${inProgress.length})

| ID | Summary | Priority | Assignee |
|----|---------|----------|----------|
${rows(inProgress, (d) => d.assignee)}

### 📋 To Do Defects (${toDo.length})

| ID | Summary | Priority | Assignee |
|----|---------|----------|----------|
${rows(toDo, (d) => d.assignee)}
${other.length > 0 ? `

### 📊 Additional Open Defects (${other.length})

| ID | Summary | Priority | Assignee |
|----|---------|----------|----------|
${rows(other, (d) => d.assignee)}` : ''}
`,

    `## 4. Risk Analysis by Functional Area

Defects are grouped by status and priority. High-risk open defects indicate elevated risk.
`,

    `## 5. Defect Analysis by Priority

High-risk open: ${highOpen.length}. Medium/Low: ${total - highOpen.length} total.
`,

    `## 6. Code Change Analysis

${prSection}
`,

    `## 7. Residual Risk Assessment

Overall Risk Level: **${riskLevel}**
`,

    `## 8. Recommended QA Focus Areas

Review open defects and prioritize testing by priority and functional area.
`,

    `## 9. Test Environment Recommendations

Verify test instances and feature flags per defect context.
`,

    `## 10. Verification Checklist for Release

Validate pre-release checks against open defects.
`,

    `## 11. Conclusion

Risk mitigation and recommended action based on defect status.
`,

    `## 12. Appendix: Defect Reference List

| ID | Jira URL |
|----|----------|
${defects.map((d) => `| ${d.key} | ${base}/browse/${d.key} |`).join('\n')}
`,
  ];

  return sections.join('\n---\n\n');
}

export function generateReport(runDir, runKey, jiraBaseUrl) {
  const report = buildReport(runDir, runKey, jiraBaseUrl);
  const outPath = join(runDir, `${runKey}_REPORT_DRAFT.md`);
  writeFileSync(outPath, report, 'utf8');
  return outPath;
}

function main() {
  const [runDir, runKey, jiraBaseUrl] = process.argv.slice(2);
  if (!runDir || !runKey || !jiraBaseUrl) {
    console.error('Usage: generate_report.mjs <run-dir> <run-key> <jira-base-url>');
    process.exit(1);
  }
  generateReport(runDir, runKey, jiraBaseUrl);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
