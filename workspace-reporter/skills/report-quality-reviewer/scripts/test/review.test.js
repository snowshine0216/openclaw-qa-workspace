import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { reviewReport } from '../review.mjs';

const REQUIRED_HEADINGS = `## 1. Report Header
## 2. Executive Summary
## 3. Defect Breakdown by Status
## 4. Risk Analysis by Functional Area
## 5. Defect Analysis by Priority
## 6. Code Change Analysis
## 7. Residual Risk Assessment
## 8. Recommended QA Focus Areas
## 9. Test Environment Recommendations
## 10. Verification Checklist for Release
## 11. Conclusion
## 12. Appendix: Defect Reference List`;

test('reviewReport fails generic filler text even when all required headings exist', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'report-quality-reviewer-'));
  try {
    await mkdir(join(runDir, 'context'), { recursive: true });
    await writeFile(
      join(runDir, 'context', 'jira_raw.json'),
      JSON.stringify({
        issues: [
          {
            key: 'BUG-1',
            fields: {
              summary: 'Save fails',
              status: { name: 'Open' },
              priority: { name: 'High' },
            },
          },
        ],
      }),
      'utf8',
    );
    await writeFile(
      join(runDir, 'BUG-1_REPORT_DRAFT.md'),
      `${REQUIRED_HEADINGS}\n\nSee context/prs/ for details.\nReview open defects and prioritize testing by priority and functional area.\n`,
      'utf8',
    );

    const status = reviewReport(runDir, 'BUG-1');

    assert.equal(status, 'fail');
    const summary = await readFile(join(runDir, 'BUG-1_REVIEW_SUMMARY.md'), 'utf8');
    assert.match(summary, /generic/i);
  } finally {
    await rm(runDir, { recursive: true, force: true });
  }
});

test('reviewReport passes rich feature reports with explicit defect and PR synthesis', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'report-quality-reviewer-'));
  try {
    await mkdir(join(runDir, 'context'), { recursive: true });
    await writeFile(
      join(runDir, 'context', 'jira_raw.json'),
      JSON.stringify({
        issues: [
          {
            key: 'BCIN-7669',
            fields: {
              summary: 'Save fails on translated prompts',
              status: { name: 'Open' },
              priority: { name: 'High' },
            },
          },
        ],
      }),
      'utf8',
    );
    await writeFile(
      join(runDir, 'BCIN-7289_REPORT_DRAFT.md'),
      `## 1. Report Header
Feature Title: Embed Library Report Editor
## 2. Executive Summary
Feature Title: Embed Library Report Editor
## 3. Defect Breakdown by Status
BCIN-7669 Save fails on translated prompts
## 4. Risk Analysis by Functional Area
| Area | Open | High |
| Save Flow | 1 | 1 |
## 5. Defect Analysis by Priority
Blocking defects: BCIN-7669
## 6. Code Change Analysis
workstation-report-editor PR #12 changes prompt serialization.
## 7. Residual Risk Assessment
Overall Risk Level: **HIGH**
## 8. Recommended QA Focus Areas
Save flow and localization.
## 9. Test Environment Recommendations
Validate translated prompt fixtures.
## 10. Verification Checklist for Release
Confirm save and save-as flows.
## 11. Conclusion
Release Recommendation: hold pending BCIN-7669.
## 12. Appendix: Defect Reference List
BCIN-7669`,
      'utf8',
    );

    const status = reviewReport(runDir, 'BCIN-7289');

    assert.equal(status, 'pass');
  } finally {
    await rm(runDir, { recursive: true, force: true });
  }
});

test('reviewReport fails release reports that omit feature packet evidence', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'report-quality-reviewer-release-'));
  try {
    await mkdir(join(runDir, 'context'), { recursive: true });
    await writeFile(
      join(runDir, 'task.json'),
      JSON.stringify({
        run_key: 'release_26.04',
        route_kind: 'reporter_scope_release',
      }),
      'utf8',
    );
    await writeFile(
      join(runDir, 'release_26.04_REPORT_DRAFT.md'),
      `${REQUIRED_HEADINGS}\n\nNo feature packet links are referenced here.\n`,
      'utf8',
    );

    const status = reviewReport(runDir, 'release_26.04');

    assert.equal(status, 'fail');
    const summary = await readFile(join(runDir, 'release_26.04_REVIEW_SUMMARY.md'), 'utf8');
    assert.match(summary, /feature packets were produced/i);
    assert.match(summary, /feature packet directories/i);
  } finally {
    await rm(runDir, { recursive: true, force: true });
  }
});

test('reviewReport fails release reports that mention only a generic features path without per-feature packet references', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'report-quality-reviewer-release-generic-'));
  try {
    await mkdir(join(runDir, 'context'), { recursive: true });
    await mkdir(join(runDir, 'features', 'BCIN-7289'), { recursive: true });
    await writeFile(
      join(runDir, 'task.json'),
      JSON.stringify({
        run_key: 'release_26.04',
        route_kind: 'reporter_scope_release',
      }),
      'utf8',
    );
    await writeFile(
      join(runDir, 'context', 'release_summary_inputs.json'),
      JSON.stringify({
        release_version: '26.04',
        features: [
          {
            feature_key: 'BCIN-7289',
            release_packet_dir: 'runs/release_26.04/features/BCIN-7289',
          },
        ],
      }),
      'utf8',
    );
    await writeFile(
      join(runDir, 'release_26.04_REPORT_DRAFT.md'),
      `${REQUIRED_HEADINGS}\n\nConfirm packet directories exist under runs/release_26.04/features/ before approval.\n`,
      'utf8',
    );

    const status = reviewReport(runDir, 'release_26.04');

    assert.equal(status, 'fail');
    const summary = await readFile(join(runDir, 'release_26.04_REVIEW_SUMMARY.md'), 'utf8');
    assert.match(summary, /per-feature packet references/i);
    assert.match(summary, /BCIN-7289/);
  } finally {
    await rm(runDir, { recursive: true, force: true });
  }
});

test('reviewReport fails when functional-area analysis only contains an empty header despite defects', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'report-quality-reviewer-empty-area-'));
  try {
    await mkdir(join(runDir, 'context'), { recursive: true });
    await writeFile(
      join(runDir, 'context', 'jira_raw.json'),
      JSON.stringify({
        issues: [
          {
            key: 'BUG-2',
            fields: {
              summary: 'Functional-area regression',
              status: { name: 'Open' },
              priority: { name: 'High' },
            },
          },
        ],
      }),
      'utf8',
    );
    await writeFile(
      join(runDir, 'context', 'feature_metadata.json'),
      JSON.stringify({
        feature_key: 'BCIN-9999',
        feature_title: 'Functional area coverage',
      }),
      'utf8',
    );
    await writeFile(
      join(runDir, 'BUG-2_REPORT_DRAFT.md'),
      `## 1. Report Header
**Feature Title:** Functional area coverage
## 2. Executive Summary
x
## 3. Defect Breakdown by Status
BUG-2
## 4. Risk Analysis by Functional Area
| Area |
|------|
## 5. Defect Analysis by Priority
Blocking defects: BUG-2
## 6. Code Change Analysis
x
## 7. Residual Risk Assessment
x
## 8. Recommended QA Focus Areas
x
## 9. Test Environment Recommendations
x
## 10. Verification Checklist for Release
x
## 11. Conclusion
x
## 12. Appendix: Defect Reference List
BUG-2`,
      'utf8',
    );

    const status = reviewReport(runDir, 'BUG-2');

    assert.equal(status, 'fail');
    const summary = await readFile(join(runDir, 'BUG-2_REVIEW_SUMMARY.md'), 'utf8');
    assert.match(summary, /Functional-area section is empty/i);
  } finally {
    await rm(runDir, { recursive: true, force: true });
  }
});
