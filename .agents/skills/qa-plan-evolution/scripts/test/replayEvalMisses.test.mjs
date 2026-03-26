import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';

import { collectReplayEvalMissObservations } from '../lib/gapSources/replayEvalMisses.mjs';
import { getQaPlanBenchmarkRuntimeRoot } from '../lib/benchmarkPaths.mjs';

async function writeJson(path, payload) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

test('replay eval misses reads cases from source and history/scorecards from workspace-artifacts', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-replay-misses-'));
  const targetSkillPath = 'workspace-planner/skills/qa-plan-orchestrator';
  const definitionRoot = join(repoRoot, targetSkillPath, 'benchmarks', 'qa-plan-v2');
  const runtimeRoot = getQaPlanBenchmarkRuntimeRoot(repoRoot);

  try {
    await mkdir(definitionRoot, { recursive: true });
    await mkdir(join(runtimeRoot, 'iteration-2'), { recursive: true });
    await writeJson(join(definitionRoot, 'benchmark_manifest.json'), {
      benchmark_version: 'qa-plan-v2',
    });
    await writeJson(join(definitionRoot, 'cases.json'), {
      cases: [
        {
          case_id: 'CASE-1',
          focus: 'Preserve replay coverage',
          evidence_mode: 'retrospective_replay',
          primary_phase: 'phase5a',
          blocking: true,
          knowledge_pack_key: 'report-editor',
        },
      ],
    });
    await writeJson(join(runtimeRoot, 'history.json'), {
      current_champion_iteration: 2,
    });
    await writeJson(join(runtimeRoot, 'iteration-2', 'benchmark.json'), {
      runs: [],
    });
    await writeJson(join(runtimeRoot, 'iteration-2', 'scorecard.json'), {
      mode_scores: {
        primary: {
          retrospective_replay: { mean_pass_rate: 0.5 },
        },
      },
    });

    const result = await collectReplayEvalMissObservations({
      repoRoot,
      task: {
        target_skill_path: targetSkillPath,
        knowledge_pack_key: 'report-editor',
      },
    });

    assert.equal(result.status, 'ok');
    assert.equal(result.observations.length, 1);
    assert.equal(
      result.observations[0].source_path,
      join(runtimeRoot, 'iteration-2', 'scorecard.json'),
    );
    await assert.rejects(() =>
      readFile(join(definitionRoot, 'iteration-2', 'scorecard.json'), 'utf8'),
    );
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});
