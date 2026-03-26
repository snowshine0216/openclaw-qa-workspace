import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  generateFinalPlanSummary,
  generateFinalPlanSummaryFromRunDir,
} from '../lib/finalPlanSummary.mjs';


test('generateFinalPlanSummary produces report with metrics and table', async () => {
  const planContent = `Feature QA Plan (BCIN-7289)

- EndToEnd
    * Report creation
        - Create report from primary entry point <P1>
            - Open the create dialog
                - Draft report opens
- Core Functional Flows
    * Save
        - Save report <P1>
            - Click Save
                - Save banner appears
    * Save As
        - Save As stays available <P2>
            - Open file menu
                - Save As remains available
`;
  const tmp = await mkdtemp(join(tmpdir(), 'final-summary-'));
  const finalPath = join(tmp, 'qa_plan_final.md');
  const summaryPath = join(tmp, 'final_plan_summary_BCIN-7289.md');

  const result = await generateFinalPlanSummary({
    featureId: 'BCIN-7289',
    planContent,
    finalPath,
    summaryPath,
    generatedAt: '2026-03-11T12:00:00.000Z',
  });

  assert.equal(result, summaryPath);
  const report = await import('node:fs/promises').then((fs) => fs.readFile(summaryPath, 'utf8'));

  assert.match(report, /Final Plan Summary Complete/i);
  assert.match(report, /2026|UTC/i);
  assert.match(report, /Plans Processed.*1/);
  assert.match(report, /Total Scenarios.*3/);
  assert.match(report, /P1.*2/);
  assert.match(report, /P2.*1/);
  assert.match(report, /BCIN-7289/);
  assert.match(report, /Generated/);
  assert.match(report, /Generated 1 QA plan document/);
  assert.match(report, /Plan file saved to/);
  assert.match(report, /QA Plan Orchestrator/);

  await rm(tmp, { recursive: true, force: true });
});

test('generateFinalPlanSummaryFromRunDir reads from run dir and writes to context', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'final-summary-run-'));
  const runDir = join(tmp, 'runs', 'BCIN-100');
  const contextDir = join(runDir, 'context');
  await import('node:fs/promises').then((fs) => fs.mkdir(contextDir, { recursive: true }));

  const planContent = `Feature QA Plan (BCIN-100)

- EndToEnd
    * Auth
        - Sign in succeeds <P1>
            - Open login page
                - Dashboard loads
`;
  await writeFile(join(runDir, 'qa_plan_final.md'), planContent, 'utf8');

  const result = await generateFinalPlanSummaryFromRunDir('BCIN-100', runDir);

  assert.equal(result, join(contextDir, 'final_plan_summary_BCIN-100.md'));
  const report = await import('node:fs/promises').then((fs) =>
    fs.readFile(join(contextDir, 'final_plan_summary_BCIN-100.md'), 'utf8')
  );

  assert.match(report, /Final Plan Summary Complete/i);
  assert.match(report, /BCIN-100/);
  assert.match(report, /Total Scenarios.*1/);

  await rm(tmp, { recursive: true, force: true });
});
