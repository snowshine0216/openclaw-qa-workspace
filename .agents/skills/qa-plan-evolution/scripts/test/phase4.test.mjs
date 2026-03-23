import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, join, relative } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

import { runTargetValidation } from '../lib/runTargetValidation.mjs';

const REPO_ROOT = join(fileURLToPath(new URL('../../../../../', import.meta.url)));
const PHASE4 = join(REPO_ROOT, '.agents/skills/qa-plan-evolution/scripts/phase4.sh');

async function writeJson(path, payload) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

async function createQaPlanSkill(repoRoot, name, {
  smokeScript,
  evalScript,
  publisherScript,
  runnerScript = null,
}) {
  const targetRoot = join(repoRoot, name);
  await mkdir(join(targetRoot, 'evals'), { recursive: true });
  await mkdir(join(targetRoot, 'references'), { recursive: true });
  await mkdir(join(targetRoot, 'scripts', 'lib'), { recursive: true });
  await mkdir(join(targetRoot, 'benchmarks', 'qa-plan-v2', 'scripts', 'lib'), { recursive: true });

  await writeFile(join(targetRoot, 'SKILL.md'), 'REPORT_STATE\n', 'utf8');
  await writeFile(join(targetRoot, 'reference.md'), 'REPORT_STATE\n', 'utf8');
  await writeFile(join(targetRoot, 'README.md'), 'developer_smoke_test_\n', 'utf8');
  await writeFile(join(targetRoot, 'references', 'phase4a-contract.md'), '[ANALOG-GATE]\n', 'utf8');
  await writeFile(join(targetRoot, 'references', 'review-rubric-phase5a.md'), 'review 5a\n', 'utf8');
  await writeFile(join(targetRoot, 'references', 'review-rubric-phase5b.md'), 'review 5b\n', 'utf8');
  await writeFile(join(targetRoot, 'scripts', 'lib', 'finalPlanSummary.mjs'), 'developer_smoke_test_\n', 'utf8');
  await writeJson(join(targetRoot, 'package.json'), {
    name,
    private: true,
    type: 'module',
    scripts: {
      test: smokeScript,
    },
  });
  await writeJson(join(targetRoot, 'evals', 'evals.json'), {
    eval_groups: [
      { id: 'defect_recall_replay', policy: 'blocking' },
      { id: 'self_test_gap_explanation', policy: 'blocking' },
      { id: 'interaction_matrix_coverage', policy: 'blocking' },
      { id: 'developer_smoke_generation', policy: 'blocking' },
    ],
  });
  await writeFile(join(targetRoot, 'evals', 'run_evals.mjs'), evalScript, 'utf8');
  await writeJson(join(targetRoot, 'benchmarks', 'qa-plan-v2', 'benchmark_manifest.json'), {
    benchmark_version: 'qa-plan-v2',
    runs_per_configuration: 1,
    acceptance_policy: {},
  });
  await writeJson(join(targetRoot, 'benchmarks', 'qa-plan-v2', 'cases.json'), {
    cases: [],
  });
  await writeJson(join(targetRoot, 'benchmarks', 'qa-plan-v2', 'history.json'), {
    current_champion_iteration: 0,
    iterations: [],
  });
  await writeFile(
    join(targetRoot, 'benchmarks', 'qa-plan-v2', 'scripts', 'lib', 'publishIterationComparison.mjs'),
    publisherScript,
    'utf8',
  );
  if (runnerScript) {
    await writeFile(
      join(targetRoot, 'benchmarks', 'qa-plan-v2', 'scripts', 'run_iteration_compare.mjs'),
      runnerScript,
      'utf8',
    );
  }

  return relative(repoRoot, targetRoot);
}

test('phase4 fails fast when smoke regresses and skips contract/replay validation', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-phase4-smoke-'));
  const targetSkillPath = await createQaPlanSkill(repoRoot, 'qa-plan-smoke-fail', {
    smokeScript: 'node -e "process.exit(1)"',
    evalScript: `
      import { writeFileSync } from 'node:fs';
      writeFileSync(new URL('../eval-ran.txt', import.meta.url), 'eval-ran');
    `,
    publisherScript: `
      import { writeFileSync } from 'node:fs';
      import { join } from 'node:path';
      export async function publishIterationComparison({ benchmarkRoot }) {
        writeFileSync(join(benchmarkRoot, 'publisher-ran.txt'), 'publisher-ran');
        return { benchmarkJsonPath: '', scorecardPath: '', iterationDir: '', candidateSnapshotDir: '' };
      }
    `,
  });

  try {
    const result = await runTargetValidation(repoRoot, targetSkillPath, {
      profileId: 'qa-plan-defect-recall',
      iteration: 1,
    });
    const targetRoot = join(repoRoot, targetSkillPath);

    assert.equal(result.smoke_ok, false);
    assert.deepEqual(result.execution_order, ['smoke']);
    await assert.rejects(() => readFile(join(targetRoot, 'eval-ran.txt'), 'utf8'));
    await assert.rejects(() => readFile(join(targetRoot, 'benchmarks', 'qa-plan-v2', 'publisher-ran.txt'), 'utf8'));
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});

test('phase4 bypasses snapshot-only smoke failures and continues validation', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-phase4-snapshot-bypass-'));
  const targetSkillPath = await createQaPlanSkill(repoRoot, 'candidate_snapshot/qa-plan-snapshot-bypass', {
    smokeScript: 'node -e "console.error(\'MARKXMIND_VALIDATOR_MISSING\'); console.error(\'resolveDefaultRunDir is repo-root stable regardless of caller cwd\'); process.exit(1)"',
    evalScript: `
      import { writeFileSync } from 'node:fs';
      writeFileSync(new URL('../eval-ran.txt', import.meta.url), 'eval-ran');
    `,
    publisherScript: `
      import { mkdirSync, writeFileSync } from 'node:fs';
      import { join } from 'node:path';
      export async function publishIterationComparison({ benchmarkRoot, iteration }) {
        const iterationDir = join(benchmarkRoot, 'iteration-' + iteration);
        mkdirSync(iterationDir, { recursive: true });
        const scorecardPath = join(iterationDir, 'scorecard.json');
        writeFileSync(scorecardPath, JSON.stringify({
          scoring_fidelity: 'executed',
          decision: { result: 'accept' },
          mode_scores: {
            primary: {
              blind_pre_defect: { mean_pass_rate: 1 },
              retrospective_replay: { mean_pass_rate: 1 },
              holdout_regression: { mean_pass_rate: 1 },
            },
          },
        }));
        return {
          benchmarkJsonPath: join(iterationDir, 'benchmark.json'),
          scorecardPath,
          iterationDir,
          candidateSnapshotDir: join(iterationDir, 'candidate_snapshot'),
        };
      }
    `,
  });

  try {
    const targetRoot = join(repoRoot, targetSkillPath);
    const result = await runTargetValidation(repoRoot, targetSkillPath, {
      profileId: 'qa-plan-defect-recall',
      iteration: 1,
      candidateRoot: targetRoot,
    });

    assert.equal(result.smoke_ok, true);
    assert.equal(result.eval_ok, true);
    assert.match(result.smoke_log, /SNAPSHOT_SMOKE_BYPASS/);
    assert.deepEqual(result.execution_order, ['smoke', 'contract_evals', 'defect_replay_evals']);
    assert.equal(await readFile(join(targetRoot, 'eval-ran.txt'), 'utf8'), 'eval-ran');
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});

test('phase4 stops after blocking contract eval failure and does not publish replay artifacts', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-phase4-eval-'));
  const targetSkillPath = await createQaPlanSkill(repoRoot, 'qa-plan-eval-fail', {
    smokeScript: 'node -e "process.exit(0)"',
    evalScript: `
      import { writeFileSync } from 'node:fs';
      writeFileSync(new URL('../eval-ran.txt', import.meta.url), 'eval-ran');
      process.exit(1);
    `,
    publisherScript: `
      import { writeFileSync } from 'node:fs';
      import { join } from 'node:path';
      export async function publishIterationComparison({ benchmarkRoot }) {
        writeFileSync(join(benchmarkRoot, 'publisher-ran.txt'), 'publisher-ran');
        return { benchmarkJsonPath: '', scorecardPath: '', iterationDir: '', candidateSnapshotDir: '' };
      }
    `,
  });

  try {
    const result = await runTargetValidation(repoRoot, targetSkillPath, {
      profileId: 'qa-plan-defect-recall',
      iteration: 1,
    });
    const targetRoot = join(repoRoot, targetSkillPath);

    assert.equal(result.smoke_ok, true);
    assert.equal(result.eval_ok, false);
    assert.deepEqual(result.execution_order, ['smoke', 'contract_evals']);
    assert.equal(await readFile(join(targetRoot, 'eval-ran.txt'), 'utf8'), 'eval-ran');
    await assert.rejects(() => readFile(join(targetRoot, 'benchmarks', 'qa-plan-v2', 'publisher-ran.txt'), 'utf8'));
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});

test('phase4 runs replay publication after smoke and contract evals succeed', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-phase4-order-'));
  const targetSkillPath = await createQaPlanSkill(repoRoot, 'qa-plan-replay', {
    smokeScript: 'node -e "process.exit(0)"',
    evalScript: `
      import { writeFileSync } from 'node:fs';
      writeFileSync(new URL('../eval-ran.txt', import.meta.url), 'eval-ran');
    `,
    publisherScript: `
      import { mkdirSync, writeFileSync } from 'node:fs';
      import { join } from 'node:path';
      export async function publishIterationComparison({ benchmarkRoot, iteration }) {
        const iterationDir = join(benchmarkRoot, 'iteration-' + iteration);
        mkdirSync(iterationDir, { recursive: true });
        const scorecardPath = join(iterationDir, 'scorecard.json');
        writeFileSync(join(benchmarkRoot, 'publisher-ran.txt'), 'publisher-ran');
        writeFileSync(scorecardPath, JSON.stringify({
          decision: { result: 'accept' },
          mode_scores: {
            primary: {
              blind_pre_defect: { mean_pass_rate: 1 },
              retrospective_replay: { mean_pass_rate: 1 },
              checkpoint_enforcement: { mean_pass_rate: 1 },
            },
          },
        }));
        return {
          benchmarkJsonPath: join(iterationDir, 'benchmark.json'),
          scorecardPath,
          iterationDir,
          candidateSnapshotDir: join(iterationDir, 'candidate_snapshot'),
        };
      }
    `,
  });

  try {
    const result = await runTargetValidation(repoRoot, targetSkillPath, {
      profileId: 'qa-plan-defect-recall',
      iteration: 1,
    });
    const targetRoot = join(repoRoot, targetSkillPath);

    assert.equal(result.smoke_ok, true);
    assert.equal(result.eval_ok, true);
    assert.deepEqual(result.execution_order, ['smoke', 'contract_evals', 'defect_replay_evals']);
    assert.equal(await readFile(join(targetRoot, 'benchmarks', 'qa-plan-v2', 'publisher-ran.txt'), 'utf8'), 'publisher-ran');
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});

test('phase4 passes defect analysis run key to the executed benchmark runner', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-phase4-runner-'));
  const targetSkillPath = await createQaPlanSkill(repoRoot, 'qa-plan-runner', {
    smokeScript: 'node -e "process.exit(0)"',
    evalScript: `
      import { writeFileSync } from 'node:fs';
      writeFileSync(new URL('../eval-ran.txt', import.meta.url), 'eval-ran');
    `,
    publisherScript: `
      export async function publishIterationComparison() {
        throw new Error('synthetic publisher should not run when executed runner exists');
      }
    `,
    runnerScript: `
      import { mkdirSync, writeFileSync } from 'node:fs';
      import { join } from 'node:path';

      export async function runIterationCompare({ benchmarkRoot, iteration, defectAnalysisRunKey }) {
        const iterationDir = join(benchmarkRoot, 'iteration-' + iteration);
        mkdirSync(iterationDir, { recursive: true });
        const scorecardPath = join(iterationDir, 'scorecard.json');
        writeFileSync(
          join(iterationDir, 'runner-args.json'),
          JSON.stringify({ defectAnalysisRunKey }, null, 2),
        );
        writeFileSync(scorecardPath, JSON.stringify({
          scoring_fidelity: 'executed',
          decision: { result: 'accept' },
          mode_scores: {
            primary: {
              blind_pre_defect: { mean_pass_rate: 1 },
              retrospective_replay: { mean_pass_rate: 1 },
              holdout_regression: { mean_pass_rate: 1 },
            },
          },
        }));
        return {
          benchmarkJsonPath: join(iterationDir, 'benchmark.json'),
          scorecardPath,
          iterationDir,
          candidateSnapshotDir: join(iterationDir, 'candidate_snapshot'),
        };
      }
    `,
  });

  try {
    const result = await runTargetValidation(repoRoot, targetSkillPath, {
      profileId: 'qa-plan-defect-recall',
      iteration: 1,
      defectAnalysisRunKey: 'BCIN-7289',
    });
    const targetRoot = join(repoRoot, targetSkillPath);
    const runnerArgs = JSON.parse(await readFile(
      join(targetRoot, 'benchmarks', 'qa-plan-v2', 'iteration-1', 'runner-args.json'),
      'utf8',
    ));

    assert.equal(result.smoke_ok, true);
    assert.equal(result.eval_ok, true);
    assert.equal(runnerArgs.defectAnalysisRunKey, 'BCIN-7289');
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});

test('phase4 materializes executed artifacts when runner reports missing grading files', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-phase4-runner-fallback-'));
  const targetSkillPath = await createQaPlanSkill(repoRoot, 'qa-plan-runner-fallback', {
    smokeScript: 'node -e "process.exit(0)"',
    evalScript: `
      import { writeFileSync } from 'node:fs';
      writeFileSync(new URL('../eval-ran.txt', import.meta.url), 'eval-ran');
    `,
    publisherScript: `
      import { mkdirSync, writeFileSync } from 'node:fs';
      import { join } from 'node:path';
      export async function publishIterationComparison({ benchmarkRoot, iteration }) {
        const iterationDir = join(benchmarkRoot, 'iteration-' + iteration);
        mkdirSync(iterationDir, { recursive: true });
        const scorecardPath = join(iterationDir, 'scorecard.json');
        writeFileSync(join(iterationDir, 'fallback-used.txt'), 'synthetic');
        writeFileSync(scorecardPath, JSON.stringify({
          scoring_fidelity: 'synthetic',
          decision: { result: 'blocked_synthetic' },
          mode_scores: {
            primary: {
              blind_pre_defect: { mean_pass_rate: 1 },
              retrospective_replay: { mean_pass_rate: 1 },
              holdout_regression: { mean_pass_rate: 1 },
            },
          },
        }));
        return {
          benchmarkJsonPath: join(iterationDir, 'benchmark.json'),
          scorecardPath,
          iterationDir,
          candidateSnapshotDir: join(iterationDir, 'candidate_snapshot'),
        };
      }
    `,
    runnerScript: `
      import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
      import { join } from 'node:path';
      export async function runIterationCompare({ benchmarkRoot, iteration }) {
        const runDir = join(
          benchmarkRoot,
          'iteration-' + iteration,
          'eval-1',
          'new_skill',
          'run-1',
        );
        mkdirSync(join(runDir, 'outputs'), { recursive: true });
        const evalMetadataPath = join(runDir, 'eval_metadata.json');
        const comparisonMetadataPath = join(runDir, 'comparison_metadata.json');
        if (!existsSync(evalMetadataPath)) {
          writeFileSync(evalMetadataPath, JSON.stringify({ expectations: ['exp-1'] }));
        }
        if (!existsSync(comparisonMetadataPath)) {
          writeFileSync(comparisonMetadataPath, JSON.stringify({ case_id: 'CASE-1', configuration_dir: 'new_skill' }));
        }
        const gradingPath = join(
          runDir,
          'grading.json',
        );
        if (!existsSync(gradingPath)) {
          throw new Error('Missing required grading.json');
        }
        const iterationDir = join(benchmarkRoot, 'iteration-' + iteration);
        mkdirSync(iterationDir, { recursive: true });
        const scorecardPath = join(iterationDir, 'scorecard.json');
        writeFileSync(scorecardPath, JSON.stringify({
          scoring_fidelity: 'executed',
          decision: { result: 'accept' },
          mode_scores: {
            primary: {
              blind_pre_defect: { mean_pass_rate: 1 },
              retrospective_replay: { mean_pass_rate: 1 },
              holdout_regression: { mean_pass_rate: 1 },
            },
          },
        }));
        return {
          benchmarkJsonPath: join(iterationDir, 'benchmark.json'),
          scorecardPath,
          iterationDir,
          candidateSnapshotDir: join(iterationDir, 'candidate_snapshot'),
        };
      }
    `,
  });

  try {
    const result = await runTargetValidation(repoRoot, targetSkillPath, {
      profileId: 'qa-plan-defect-recall',
      iteration: 1,
      defectAnalysisRunKey: 'BCIN-7289',
    });
    const targetRoot = join(repoRoot, targetSkillPath);
    const grading = JSON.parse(await readFile(
      join(targetRoot, 'benchmarks', 'qa-plan-v2', 'iteration-1', 'eval-1', 'new_skill', 'run-1', 'grading.json'),
      'utf8',
    ));

    assert.equal(result.smoke_ok, true);
    assert.equal(result.eval_ok, true);
    assert.equal(result.scorecard.scoring_fidelity, 'executed');
    assert.equal(grading.summary.pass_rate, 1);
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});

test('phase4 falls back to synthetic comparison when executed runner errors for non-artifact reasons', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-phase4-runner-fallback-generic-'));
  const targetSkillPath = await createQaPlanSkill(repoRoot, 'qa-plan-runner-fallback-generic', {
    smokeScript: 'node -e "process.exit(0)"',
    evalScript: `
      import { writeFileSync } from 'node:fs';
      writeFileSync(new URL('../eval-ran.txt', import.meta.url), 'eval-ran');
    `,
    publisherScript: `
      import { mkdirSync, writeFileSync } from 'node:fs';
      import { join } from 'node:path';
      export async function publishIterationComparison({ benchmarkRoot, iteration }) {
        const iterationDir = join(benchmarkRoot, 'iteration-' + iteration);
        mkdirSync(iterationDir, { recursive: true });
        const scorecardPath = join(iterationDir, 'scorecard.json');
        writeFileSync(join(iterationDir, 'fallback-used.txt'), 'synthetic');
        writeFileSync(scorecardPath, JSON.stringify({
          scoring_fidelity: 'synthetic',
          decision: { result: 'blocked_synthetic' },
          mode_scores: {
            primary: {
              blind_pre_defect: { mean_pass_rate: 1 },
              retrospective_replay: { mean_pass_rate: 1 },
              holdout_regression: { mean_pass_rate: 1 },
            },
          },
        }));
        return {
          benchmarkJsonPath: join(iterationDir, 'benchmark.json'),
          scorecardPath,
          iterationDir,
          candidateSnapshotDir: join(iterationDir, 'candidate_snapshot'),
        };
      }
    `,
    runnerScript: `
      export async function runIterationCompare() {
        throw new Error('unexpected benchmark runner failure');
      }
    `,
  });

  try {
    const result = await runTargetValidation(repoRoot, targetSkillPath, {
      profileId: 'qa-plan-defect-recall',
      iteration: 1,
      defectAnalysisRunKey: 'BCIN-7289',
    });
    const targetRoot = join(repoRoot, targetSkillPath);
    const fallbackMarker = await readFile(
      join(targetRoot, 'benchmarks', 'qa-plan-v2', 'iteration-1', 'fallback-used.txt'),
      'utf8',
    );

    assert.equal(result.smoke_ok, true);
    assert.equal(result.eval_ok, true);
    assert.equal(result.scorecard.scoring_fidelity, 'synthetic');
    assert.equal(fallbackMarker, 'synthetic');
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});

test('phase4 respects profile-specific qa-plan evidence mode gates', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-phase4-profile-gates-'));
  const targetSkillPath = await createQaPlanSkill(repoRoot, 'qa-plan-profile-gates', {
    smokeScript: 'node -e "process.exit(0)"',
    evalScript: `
      import { writeFileSync } from 'node:fs';
      writeFileSync(new URL('../eval-ran.txt', import.meta.url), 'eval-ran');
    `,
    publisherScript: `
      export async function publishIterationComparison() {
        throw new Error('synthetic publisher should not run when executed runner exists');
      }
    `,
    runnerScript: `
      import { mkdirSync, writeFileSync } from 'node:fs';
      import { join } from 'node:path';

      export async function runIterationCompare({
        benchmarkRoot,
        iteration,
        defectAnalysisRunKey,
        enabledEvidenceModes,
      }) {
        const iterationDir = join(benchmarkRoot, 'iteration-' + iteration);
        mkdirSync(iterationDir, { recursive: true });
        const scorecardPath = join(iterationDir, 'scorecard.json');
        writeFileSync(
          join(iterationDir, 'runner-args.json'),
          JSON.stringify({ defectAnalysisRunKey, enabledEvidenceModes }, null, 2),
        );
        writeFileSync(scorecardPath, JSON.stringify({
          scoring_fidelity: 'executed',
          decision: { result: 'accept' },
          mode_scores: {
            primary: {
              blind_pre_defect: { mean_pass_rate: 1 },
              retrospective_replay: { mean_pass_rate: null },
              holdout_regression: { mean_pass_rate: null },
            },
          },
          acceptance_checks: {
            policy: {
              require_non_decreasing_replay_score: false,
              require_no_holdout_regression: false,
            },
          },
        }));
        return {
          benchmarkJsonPath: join(iterationDir, 'benchmark.json'),
          scorecardPath,
          iterationDir,
          candidateSnapshotDir: join(iterationDir, 'candidate_snapshot'),
        };
      }
    `,
  });

  try {
    const result = await runTargetValidation(repoRoot, targetSkillPath, {
      profileId: 'qa-plan-knowledge-pack-coverage',
      iteration: 1,
      defectAnalysisRunKey: 'BCIN-7289',
    });
    const targetRoot = join(repoRoot, targetSkillPath);
    const runnerArgs = JSON.parse(await readFile(
      join(targetRoot, 'benchmarks', 'qa-plan-v2', 'iteration-1', 'runner-args.json'),
      'utf8',
    ));

    assert.equal(result.smoke_ok, true);
    assert.equal(result.eval_ok, true);
    assert.equal(runnerArgs.defectAnalysisRunKey, null);
    assert.deepEqual(runnerArgs.enabledEvidenceModes, ['blind_pre_defect', 'holdout_regression']);
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});

test('phase4 keeps generic contract compliance at 1 when no eval harness exists', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-phase4-generic-noeval-'));
  const targetRoot = join(repoRoot, 'generic-skill');

  try {
    await mkdir(targetRoot, { recursive: true });
    await writeFile(join(targetRoot, 'SKILL.md'), 'REPORT_STATE\n', 'utf8');
    await writeFile(join(targetRoot, 'reference.md'), 'Reference\n', 'utf8');
    await writeJson(join(targetRoot, 'package.json'), {
      name: 'generic-skill',
      private: true,
      type: 'module',
      scripts: {
        test: 'node -e "process.exit(0)"',
      },
    });

    const result = await runTargetValidation(repoRoot, 'generic-skill', {
      profileId: 'generic-skill-regression',
      iteration: 1,
    });

    assert.equal(result.eval_ok, true);
    assert.equal(result.contract_compliance_score, 1);
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});

test('phase4 validates the candidate snapshot instead of the unchanged target tree', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-phase4-candidate-repo-'));
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase4-candidate-run-'));
  const runKey = 'phase4-candidate';
  const targetRoot = join(repoRoot, 'target-skill');

  try {
    await mkdir(join(runRoot, 'candidates', 'iteration-1', 'candidate_snapshot'), { recursive: true });
    await mkdir(join(targetRoot), { recursive: true });
    await writeFile(join(targetRoot, 'SKILL.md'), 'REPORT_STATE\n', 'utf8');
    await writeFile(join(targetRoot, 'reference.md'), 'Reference\n', 'utf8');
    await writeJson(join(targetRoot, 'package.json'), {
      name: 'target-skill',
      private: true,
      type: 'module',
      scripts: {
        test: 'node -e "process.exit(1)"',
      },
    });

    const candidateRoot = join(runRoot, 'candidates', 'iteration-1', 'candidate_snapshot');
    await writeFile(join(candidateRoot, 'SKILL.md'), 'REPORT_STATE\n', 'utf8');
    await writeFile(join(candidateRoot, 'reference.md'), '# Mutated reference\n', 'utf8');
    await writeJson(join(candidateRoot, 'package.json'), {
      name: 'target-skill',
      private: true,
      type: 'module',
      scripts: {
        test: 'node -e "process.exit(0)"',
      },
    });
    await writeFile(
      join(runRoot, 'candidates', 'iteration-1', 'candidate_patch_summary.md'),
      '# Candidate patch summary\n\n- reference.md\n',
      'utf8',
    );
    await writeJson(join(runRoot, 'candidates', 'iteration-1', 'candidate_scope.json'), {
      iteration: 1,
      candidate_snapshot_path: 'candidates/iteration-1/candidate_snapshot',
      changed_files: ['reference.md'],
      mutation: {
        mutation_id: 'mut-1',
        target_files: ['target-skill/reference.md'],
      },
    });
    await writeJson(join(runRoot, 'task.json'), {
      run_key: runKey,
      target_skill_path: relative(repoRoot, targetRoot),
      benchmark_profile: 'generic-skill-regression',
      current_iteration: 1,
    });
    await writeJson(join(runRoot, 'run.json'), {
      run_key: runKey,
      latest_validation_completed_at: null,
    });

    const result = spawnSync('bash', [
      PHASE4,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', repoRoot,
      '--iteration', '1',
    ], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 0, result.stderr);
    const report = JSON.parse(
      await readFile(join(runRoot, 'candidates', 'iteration-1', 'validation_report.json'), 'utf8'),
    );
    assert.equal(report.validation.smoke_ok, true);
    assert.equal(report.validation.validated_target_root, candidateRoot);
  } finally {
    await rm(runRoot, { recursive: true, force: true });
    await rm(repoRoot, { recursive: true, force: true });
  }
});
