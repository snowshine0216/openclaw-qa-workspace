#!/usr/bin/env node
/**
 * Invocable entrypoint for defect-analysis-reporter skill.
 * Reads jira_raw.json and pr_impact_summary.json from run-dir/context/,
 * produces <run-key>_REPORT_DRAFT.md per SKILL.md 12-section format.
 *
 * Usage: node generate.mjs <run-dir> <run-key> [jira-base-url]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

function loadPrSummary(runDir) {
  const path = join(runDir, 'context', 'pr_impact_summary.json');
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return { pr_count: 0, domains: [] };
  }
}

function loadJiraRaw(runDir) {
  const path = join(runDir, 'context', 'jira_raw.json');
  const raw = JSON.parse(readFileSync(path, 'utf8'));
  return raw.issues ?? [];
}

export function generateReport(runDir, runKey, jiraBaseUrl = 'https://jira.example.com') {
  const issues = loadJiraRaw(runDir);
  const prSummary = loadPrSummary(runDir);
  const total = issues.length;
  const completed = issues.filter((i) =>
    ['done', 'resolved', 'closed'].includes((i.fields?.status?.name ?? '').toLowerCase())
  ).length;
  const open = total - completed;
  const high = issues.filter((i) =>
    ['high', 'critical', 'highest', 'p1', 'p0'].includes((i.fields?.priority?.name ?? '').toLowerCase())
  ).length;
  const risk = open > 0 && high > 0 ? 'HIGH' : open > 0 ? 'MEDIUM' : 'LOW';

  const rows =
    issues
      .map((issue) => {
        const fields = issue.fields ?? {};
        return `| ${issue.key} | ${fields.summary ?? ''} | ${fields.priority?.name ?? 'Unknown'} | ${fields.resolutiondate ?? '—'} | ${prSummary.pr_count > 0 ? 'See code change analysis' : 'No PR linked'} |`;
      })
      .join('\n') || '| — | No defects found | — | — | — |';

  const appendix =
    issues
      .map((issue, index) => `| ${index + 1} | ${issue.key} | [${issue.key}](${jiraBaseUrl}/browse/${issue.key}) |`)
      .join('\n') || '| 1 | N/A | N/A |';

  const report = `# QA Risk & Defect Analysis Report
## ${runKey}: Reporter Defect Analysis

**Report Date:** ${new Date().toISOString().slice(0, 10)}
**Feature:** ${runKey}
**Total Defects Analyzed:** ${total}

## 1. Report Header
Summary generated for ${runKey}.

## 2. Executive Summary
- Total defects: ${total}
- Completed defects: ${completed}
- Open defects: ${open}
- Risk rating: ${risk}

## 3. Defect Breakdown by Status
| ID | Summary | Priority | Fixed Date | Fix Risk Analysis |
|---|---|---|---|---|
${rows}

## 4. Risk Analysis by Functional Area
- Primary risk focus: UI and API interactions inferred from defect summaries.

## 5. Defect Analysis by Priority
- High priority defects: ${high}
- Remaining open defects: ${open}

## 6. Code Change Analysis
- PR analyses completed: ${prSummary.pr_count}
- Affected domains: ${(prSummary.domains ?? []).join(', ') || 'none'}

## 7. Residual Risk Assessment
- Overall Risk Level: ${risk}
- Risk Factors: open defects, code-change breadth, feature volatility.

## 8. Recommended QA Focus Areas
- Priority: HIGH
- Focus on the reproduced defect paths and adjacent UI/API regressions.

## 9. Test Environment Recommendations
- Environment: reporter staging
- Test data: defect-linked fixtures or standard staging data

## 10. Verification Checklist for Release
- Confirm resolved defects are not reproducible
- Confirm no open high-priority blockers remain

## 11. Conclusion
- Recommended Action: ${risk === 'HIGH' ? 'DO NOT RELEASE' : 'READY FOR RELEASE'}

## 12. Appendix: Defect Reference List
| # | ID | Link |
|---|---|---|
${appendix}
`;

  const outPath = join(runDir, `${runKey}_REPORT_DRAFT.md`);
  writeFileSync(outPath, `${report}\n`, 'utf8');
  return outPath;
}

function main() {
  const [runDir, runKey, jiraBaseUrl] = process.argv.slice(2);
  if (!runDir || !runKey) {
    console.error('Usage: generate.mjs <run-dir> <run-key> [jira-base-url]');
    process.exit(1);
  }
  generateReport(runDir, runKey, jiraBaseUrl || 'https://jira.example.com');
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
