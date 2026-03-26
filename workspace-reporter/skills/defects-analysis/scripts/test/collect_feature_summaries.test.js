import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { collectFeatureSummaries } from '../lib/collect_feature_summaries.mjs';

test('collectFeatureSummaries preserves clean release version for scope-aware release run keys', async () => {
  const rootDir = await mkdtemp(join(tmpdir(), 'defects-analysis-collect-release-'));
  const releaseRunDir = join(rootDir, 'release_26.04__scope_deadbeef');
  const featureRunDir = join(rootDir, 'BCIN-5809');

  try {
    await mkdir(join(releaseRunDir, 'context'), { recursive: true });
    await mkdir(join(featureRunDir, 'context'), { recursive: true });
    await writeFile(
      join(releaseRunDir, 'context', 'route_decision.json'),
      JSON.stringify({
        run_key: 'release_26.04__scope_deadbeef',
        route_kind: 'reporter_scope_release',
        release_version: '26.04',
      }),
      'utf8',
    );
    await writeFile(
      join(featureRunDir, 'context', 'feature_summary.json'),
      JSON.stringify({
        feature_key: 'BCIN-5809',
        feature_title: 'Embed Library Report Editor',
      }),
      'utf8',
    );

    const payload = collectFeatureSummaries({
      releaseRunDir,
      features: [
        {
          feature_key: 'BCIN-5809',
          canonical_run_dir: featureRunDir,
        },
      ],
    });

    const persisted = JSON.parse(
      await readFile(join(releaseRunDir, 'context', 'release_summary_inputs.json'), 'utf8'),
    );
    assert.equal(payload.release_version, '26.04');
    assert.equal(persisted.release_version, '26.04');
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
});
