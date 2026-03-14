#!/usr/bin/env node
/**
 * Invocable entrypoint for report-quality-reviewer skill.
 * Reads draft and jira_raw from run-dir, validates per 12-section requirement,
 * writes <run-key>_REVIEW_SUMMARY.md. Returns pass/fail via stdout and exit code.
 *
 * Usage: node review.mjs <run-dir> <run-key>
 * Exit: 0 if pass, 1 if fail. Stdout: "pass" or "fail"
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REQUIRED_SECTIONS = [
  '## 1. Report Header',
  '## 2. Executive Summary',
  '## 3. Defect Breakdown by Status',
  '## 4. Risk Analysis by Functional Area',
  '## 5. Defect Analysis by Priority',
  '## 6. Code Change Analysis',
  '## 7. Residual Risk Assessment',
  '## 8. Recommended QA Focus Areas',
  '## 9. Test Environment Recommendations',
  '## 10. Verification Checklist for Release',
  '## 11. Conclusion',
  '## 12. Appendix: Defect Reference List',
];

export function reviewReport(runDir, runKey) {
  const draftPath = join(runDir, `${runKey}_REPORT_DRAFT.md`);
  const draft = readFileSync(draftPath, 'utf8');
  let raw;
  try {
    raw = JSON.parse(readFileSync(join(runDir, 'context', 'jira_raw.json'), 'utf8'));
  } catch {
    raw = { issues: [] };
  }
  const issues = raw.issues ?? [];
  const missing = REQUIRED_SECTIONS.filter((h) => !draft.includes(h));
  const status = missing.length === 0 ? 'pass' : 'fail';
  const focus = issues.length ? `- Primary human review area: ${issues[0].key}` : '- No defects found.';
  const fixes = missing.length ? `- Missing sections: ${missing.join(', ')}` : '- No objective fixes required.';
  const summary = `## Review Result: ${status}

### Focus Areas (20/80)
${focus}

### Actionable Fixes
${fixes}

### Recommendations for the Reviewer
- Confirm the overall risk rating matches the remaining open defects.
`;
  writeFileSync(join(runDir, `${runKey}_REVIEW_SUMMARY.md`), `${summary}\n`, 'utf8');
  return status;
}

function main() {
  const [runDir, runKey] = process.argv.slice(2);
  if (!runDir || !runKey) {
    console.error('Usage: review.mjs <run-dir> <run-key>');
    process.exit(1);
  }
  const status = reviewReport(runDir, runKey);
  process.stdout.write(status);
  process.exit(status === 'pass' ? 0 : 1);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
