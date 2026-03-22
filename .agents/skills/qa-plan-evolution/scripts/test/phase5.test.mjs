import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = join(fileURLToPath(new URL('../../../../../', import.meta.url)));
const PHASE5 = join(REPO_ROOT, '.agents/skills/qa-plan-evolution/scripts/phase5.sh');

async function writeJson(path, payload) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

test('phase5 uses benchmark scorecard for qa-plan decisions', async () => {
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase5-'));
  const runKey = 'phase5-scorecard';

  try {
    await mkdir(join(runRoot, 'candidates', 'iteration-1'), { recursive: true });
    await mkdir(join(runRoot, 'benchmarks'), { recursive: true });
    await writeJson(join(runRoot, 'task.json'), {
      run_key: runKey,
      benchmark_profile: 'qa-plan-defect-recall',
      current_iteration: 1,
    });
    await writeJson(join(runRoot, 'run.json'), {
      rejected_iterations: [],
      iteration_history: [],
      consecutive_rejections: 0,
    });
    await writeJson(join(runRoot, 'benchmarks', `scoreboard_${runKey}.json`), {
      champion: {
        defect_recall_score: 0.5,
        contract_compliance_score: 0.5,
        knowledge_pack_coverage_score: 0.5,
      },
      iterations: [],
    });
    await writeJson(join(runRoot, 'candidates', 'iteration-1', 'validation_report.json'), {
      validation: {
        smoke_ok: true,
        eval_ok: true,
        regression_count: 0,
        defect_recall_score: 0.1,
        contract_compliance_score: 0.1,
        knowledge_pack_coverage_score: 0.1,
        scorecard: {
          decision: { result: 'accept' },
          mode_scores: {
            primary: {
              blind_pre_defect: { mean_pass_rate: 1 },
              retrospective_replay: { mean_pass_rate: 0.9 },
              holdout_regression: { mean_pass_rate: 0.8 },
            },
          },
        },
      },
    });

    const result = spawnSync('bash', [
      PHASE5,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', REPO_ROOT,
      '--iteration', '1',
    ], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 0);
    const score = JSON.parse(
      await readFile(join(runRoot, 'candidates', 'iteration-1', 'score.json'), 'utf8'),
    );
    const scoreboard = JSON.parse(
      await readFile(join(runRoot, 'benchmarks', `scoreboard_${runKey}.json`), 'utf8'),
    );
    assert.equal(score.outcome.accept, true);
    assert.equal(score.outcome.scores.defect_recall_score, 0.9);
    assert.deepEqual(scoreboard.champion, {
      defect_recall_score: 0.5,
      contract_compliance_score: 0.5,
      knowledge_pack_coverage_score: 0.5,
    });
    assert.deepEqual(scoreboard.iterations, [
      {
        iteration: 1,
        accept: true,
        scores: {
          defect_recall_score: 0.9,
          contract_compliance_score: 1,
          knowledge_pack_coverage_score: 0.8,
          regression_count: 0,
        },
        meaningful_improvement: true,
      },
    ]);
  } finally {
    await rm(runRoot, { recursive: true, force: true });
  }
});

test('phase5 maps knowledge-pack coverage from emitted scorecard modes when replay is disabled', async () => {
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase5-pack-coverage-'));
  const runKey = 'phase5-pack-coverage';

  try {
    await mkdir(join(runRoot, 'candidates', 'iteration-1'), { recursive: true });
    await mkdir(join(runRoot, 'benchmarks'), { recursive: true });
    await writeJson(join(runRoot, 'task.json'), {
      run_key: runKey,
      benchmark_profile: 'qa-plan-knowledge-pack-coverage',
      current_iteration: 1,
    });
    await writeJson(join(runRoot, 'run.json'), {
      rejected_iterations: [],
      iteration_history: [],
      consecutive_rejections: 0,
    });
    await writeJson(join(runRoot, 'benchmarks', `scoreboard_${runKey}.json`), {
      champion: {
        defect_recall_score: 0.3,
        contract_compliance_score: 0.6,
        knowledge_pack_coverage_score: 0.4,
      },
      iterations: [],
    });
    await writeJson(join(runRoot, 'candidates', 'iteration-1', 'validation_report.json'), {
      validation: {
        smoke_ok: true,
        eval_ok: true,
        regression_count: 0,
        defect_recall_score: 0.3,
        contract_compliance_score: 0.3,
        knowledge_pack_coverage_score: 0.1,
        scorecard: {
          decision: { result: 'accept' },
          active_evidence_modes: ['blind_pre_defect', 'holdout_regression'],
          mode_scores: {
            primary: {
              blind_pre_defect: { mean_pass_rate: 0.9 },
              holdout_regression: { mean_pass_rate: 0.85 },
            },
          },
        },
      },
    });

    const result = spawnSync('bash', [
      PHASE5,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', REPO_ROOT,
      '--iteration', '1',
    ], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 0);
    const score = JSON.parse(
      await readFile(join(runRoot, 'candidates', 'iteration-1', 'score.json'), 'utf8'),
    );
    assert.equal(score.outcome.scores.knowledge_pack_coverage_score, 0.85);
  } finally {
    await rm(runRoot, { recursive: true, force: true });
  }
});

test('phase5 blocks synthetic benchmark scorecards from promotion', async () => {
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase5-synthetic-'));
  const runKey = 'phase5-synthetic';

  try {
    await mkdir(join(runRoot, 'candidates', 'iteration-1'), { recursive: true });
    await mkdir(join(runRoot, 'benchmarks'), { recursive: true });
    await writeJson(join(runRoot, 'task.json'), {
      run_key: runKey,
      benchmark_profile: 'qa-plan-defect-recall',
      current_iteration: 1,
    });
    await writeJson(join(runRoot, 'run.json'), {
      rejected_iterations: [],
      iteration_history: [],
      consecutive_rejections: 0,
    });
    await writeJson(join(runRoot, 'benchmarks', `scoreboard_${runKey}.json`), {
      champion: {},
      iterations: [],
    });
    await writeJson(join(runRoot, 'candidates', 'iteration-1', 'validation_report.json'), {
      validation: {
        smoke_ok: true,
        eval_ok: true,
        regression_count: 0,
        defect_recall_score: 0.1,
        contract_compliance_score: 0.1,
        knowledge_pack_coverage_score: 0.1,
        scorecard: {
          scoring_fidelity: 'synthetic',
          decision: { result: 'blocked_synthetic' },
          mode_scores: {
            primary: {
              blind_pre_defect: { mean_pass_rate: 1 },
              retrospective_replay: { mean_pass_rate: 1 },
              holdout_regression: { mean_pass_rate: 1 },
            },
          },
        },
      },
    });

    const result = spawnSync('bash', [
      PHASE5,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', REPO_ROOT,
      '--iteration', '1',
    ], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 0);
    const score = JSON.parse(
      await readFile(join(runRoot, 'candidates', 'iteration-1', 'score.json'), 'utf8'),
    );
    assert.equal(score.outcome.accept, false);
    assert.equal(score.outcome.blocking_regression, true);
  } finally {
    await rm(runRoot, { recursive: true, force: true });
  }
});
