import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { computeFeatureRunPlan } from '../lib/compute_feature_run_plan.mjs';

test('computeFeatureRunPlan maps canonical run states to release default actions', async () => {
  const root = await mkdtemp(join(tmpdir(), 'defects-analysis-plan-'));
  try {
    const runsRoot = join(root, 'runs');
    await mkdir(runsRoot, { recursive: true });

    await mkdir(join(runsRoot, 'BCIN-1', 'context'), { recursive: true });
    await writeFile(join(runsRoot, 'BCIN-1', 'BCIN-1_REPORT_FINAL.md'), 'final\n', 'utf8');

    await mkdir(join(runsRoot, 'BCIN-2', 'context'), { recursive: true });
    await writeFile(join(runsRoot, 'BCIN-2', 'BCIN-2_REPORT_DRAFT.md'), 'draft\n', 'utf8');

    await mkdir(join(runsRoot, 'BCIN-3', 'context'), { recursive: true });
    await writeFile(join(runsRoot, 'BCIN-3', 'context', 'jira_raw.json'), '{"issues":[]}\n', 'utf8');

    await mkdir(join(runsRoot, 'BCIN-4', 'context'), { recursive: true });
    await writeFile(
      join(runsRoot, 'BCIN-4', 'context', 'feature_summary.json'),
      '{"feature_key":"BCIN-4"}\n',
      'utf8',
    );

    const plan = await computeFeatureRunPlan({
      featureKeys: ['BCIN-1', 'BCIN-2', 'BCIN-3', 'BCIN-4', 'BCIN-5'],
      runsRoot,
      releaseRunDir: join(runsRoot, 'release_26.04'),
    });

    assert.deepEqual(
      plan.features.map((entry) => [entry.feature_key, entry.report_state, entry.default_action]),
      [
        ['BCIN-1', 'FINAL_EXISTS', 'use_existing'],
        ['BCIN-2', 'DRAFT_EXISTS', 'resume'],
        ['BCIN-3', 'CONTEXT_ONLY', 'generate_from_cache'],
        ['BCIN-4', 'FRESH', 'proceed'],
        ['BCIN-5', 'FRESH', 'proceed'],
      ],
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
