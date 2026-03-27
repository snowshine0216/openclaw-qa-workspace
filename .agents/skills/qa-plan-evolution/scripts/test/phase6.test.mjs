import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

import { getQaPlanBenchmarkRuntimeRoot } from '../lib/benchmarkPaths.mjs';

const REPO_ROOT = join(fileURLToPath(new URL('../../../../../', import.meta.url)));
const PHASE6 = join(REPO_ROOT, '.agents/skills/qa-plan-evolution/scripts/phase6.sh');
const FIXTURE = '.agents/skills/qa-plan-evolution/scripts/test/fixtures/minimal-target-skill';

async function writeJson(path, payload) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

const QA_PLAN_LIVE_SKILL_MD = `---
name: qa-plan-orchestrator
description: Master orchestrator for script-driven feature QA planning. The orchestrator only calls phase scripts, interacts with the user, and spawns from phase manifests.
---

# qa-plan live

REPORT_STATE
`;
const ITERATION_CHAMPION_SKILL_MD = `---
name: qa-plan-orchestrator
description: Archived champion snapshot fixture for qa-plan-evolution tests.
---

# iteration-0 champion

REPORT_STATE
`;
const PROMOTED_CANDIDATE_SKILL_MD = `---
name: qa-plan-orchestrator
description: Promoted candidate snapshot fixture for qa-plan-evolution tests.
---

# promoted candidate snapshot

REPORT_STATE
`;
const GIT_TARGET_SKILL_MD = `---
name: git-target
description: Generic target skill fixture for qa-plan-evolution git finalization tests.
---

# skill

REPORT_STATE
`;

function runGit(repoRoot, args) {
  const result = spawnSync('git', ['-C', repoRoot, ...args], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}

test('phase6 archives accepted candidate and waits for explicit approval before finalizing', async () => {
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase6-approval-'));
  const runKey = 'phase6-approval';

  try {
    await mkdir(join(runRoot, 'candidates', 'iteration-1'), { recursive: true });
    await mkdir(join(runRoot, 'context'), { recursive: true });
    await mkdir(join(runRoot, 'benchmarks'), { recursive: true });
    await mkdir(join(runRoot, 'archive', 'champion-initial'), { recursive: true });
    await writeFile(join(runRoot, 'archive', 'champion-initial', 'snapshot.txt'), 'seed', 'utf8');
    await writeJson(join(runRoot, 'task.json'), {
      run_key: runKey,
      target_skill_path: FIXTURE,
      benchmark_profile: 'generic-skill-regression',
      current_iteration: 1,
      max_iterations: 10,
      champion_snapshot_path: 'archive/champion-initial',
    });
    await writeJson(join(runRoot, 'run.json'), {
      consecutive_rejections: 0,
      rejected_iterations: [],
      iteration_history: [],
      champion_archive_history: [],
      finalized_at: null,
      notification_pending: null,
    });
    await writeJson(join(runRoot, 'context', `mutation_backlog_${runKey}.json`), {
      mutations: [
        {
          mutation_id: 'mut-1',
          root_cause_bucket: 'missing_scenario',
        },
      ],
    });
    await writeJson(join(runRoot, 'benchmarks', `scoreboard_${runKey}.json`), {
      champion: {
        defect_recall_score: 0.4,
        contract_compliance_score: 0.5,
        knowledge_pack_coverage_score: 0.6,
      },
      iterations: [],
    });
    await writeJson(join(runRoot, 'candidates', 'iteration-1', 'candidate_scope.json'), {
      mutation: {
        source_observation_ids: ['gap-1', 'gap-2'],
      },
    });
    await writeJson(join(runRoot, 'candidates', 'iteration-1', 'score.json'), {
      outcome: {
        accept: true,
        scores: {
          defect_recall_score: 0.9,
          contract_compliance_score: 1,
          knowledge_pack_coverage_score: 0.8,
          regression_count: 0,
        },
      },
    });

    const result = spawnSync('bash', [
      PHASE6,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', REPO_ROOT,
      '--iteration', '1',
    ], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 0);
    const task = JSON.parse(await readFile(join(runRoot, 'task.json'), 'utf8'));
    const scoreboard = JSON.parse(
      await readFile(join(runRoot, 'benchmarks', `scoreboard_${runKey}.json`), 'utf8'),
    );
    assert.equal(task.overall_status, 'awaiting_approval');
    assert.equal(task.pending_finalization_iteration, 1);
    assert.deepEqual(scoreboard.champion, {
      defect_recall_score: 0.4,
      contract_compliance_score: 0.5,
      knowledge_pack_coverage_score: 0.6,
    });
    assert.equal(existsSync(join(runRoot, 'context', `accepted_gap_ids_${runKey}.json`)), false);
    await readFile(join(runRoot, 'archive', 'champion-pre-iteration-1', 'snapshot.txt'), 'utf8');
    await readFile(join(runRoot, 'archive', 'candidate-iteration-1', 'SKILL.md'), 'utf8');
  } finally {
    await rm(runRoot, { recursive: true, force: true });
  }
});

test('phase6 finalization promotes the accepted scoreboard champion and persists accepted gaps', async () => {
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase6-finalize-state-'));
  const runKey = 'phase6-finalize-state';

  try {
    await mkdir(join(runRoot, 'candidates', 'iteration-2'), { recursive: true });
    await mkdir(join(runRoot, 'context'), { recursive: true });
    await mkdir(join(runRoot, 'benchmarks'), { recursive: true });
    await mkdir(join(runRoot, 'archive', 'champion-initial'), { recursive: true });
    await writeFile(join(runRoot, 'archive', 'champion-initial', 'snapshot.txt'), 'seed', 'utf8');
    await writeJson(join(runRoot, 'task.json'), {
      run_key: runKey,
      target_skill_path: FIXTURE,
      benchmark_profile: 'generic-skill-regression',
      current_iteration: 2,
      max_iterations: 10,
      champion_snapshot_path: 'archive/champion-initial',
      accepted_iteration: 1,
      pending_finalization_iteration: 2,
    });
    await writeJson(join(runRoot, 'run.json'), {
      consecutive_rejections: 0,
      rejected_iterations: [],
      iteration_history: [],
      champion_archive_history: [],
      finalized_at: null,
      notification_pending: null,
    });
    await writeJson(join(runRoot, 'context', `mutation_backlog_${runKey}.json`), {
      mutations: [
        {
          mutation_id: 'mut-2',
          root_cause_bucket: 'missing_guardrail',
        },
      ],
    });
    await writeJson(join(runRoot, 'context', `accepted_gap_ids_${runKey}.json`), {
      gap_ids: ['gap-existing'],
    });
    await writeJson(join(runRoot, 'benchmarks', `scoreboard_${runKey}.json`), {
      champion: {
        defect_recall_score: 0.4,
        contract_compliance_score: 0.5,
        knowledge_pack_coverage_score: 0.6,
      },
      iterations: [],
    });
    await writeJson(join(runRoot, 'candidates', 'iteration-2', 'candidate_scope.json'), {
      mutation: {
        source_observation_ids: ['gap-1', 'gap-2'],
      },
    });
    await writeJson(join(runRoot, 'candidates', 'iteration-2', 'score.json'), {
      outcome: {
        accept: true,
        scores: {
          defect_recall_score: 0.9,
          contract_compliance_score: 1,
          knowledge_pack_coverage_score: 0.8,
          regression_count: 0,
        },
      },
    });

    const result = spawnSync('bash', [
      PHASE6,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', REPO_ROOT,
      '--iteration', '2',
      '--finalize',
    ], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 0, result.stderr);
    const scoreboard = JSON.parse(
      await readFile(join(runRoot, 'benchmarks', `scoreboard_${runKey}.json`), 'utf8'),
    );
    const acceptedGapIds = JSON.parse(
      await readFile(join(runRoot, 'context', `accepted_gap_ids_${runKey}.json`), 'utf8'),
    );
    assert.deepEqual(scoreboard.champion, {
      defect_recall_score: 0.9,
      contract_compliance_score: 1,
      knowledge_pack_coverage_score: 0.8,
      regression_count: 0,
    });
    assert.deepEqual(acceptedGapIds, {
      gap_ids: ['gap-existing', 'gap-1', 'gap-2'],
    });
  } finally {
    await rm(runRoot, { recursive: true, force: true });
  }
});

test('phase6 archives the mutated candidate snapshot instead of the unchanged target tree', async () => {
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase6-candidate-snapshot-'));
  const runKey = 'phase6-candidate-snapshot';

  try {
    await mkdir(join(runRoot, 'candidates', 'iteration-1', 'candidate_snapshot'), { recursive: true });
    await mkdir(join(runRoot, 'context'), { recursive: true });
    await writeFile(
      join(runRoot, 'candidates', 'iteration-1', 'candidate_snapshot', 'reference.md'),
      '# Mutated candidate reference\n',
      'utf8',
    );
    await writeJson(join(runRoot, 'candidates', 'iteration-1', 'candidate_scope.json'), {
      iteration: 1,
      candidate_snapshot_path: 'candidates/iteration-1/candidate_snapshot',
      changed_files: ['reference.md'],
      mutation: {
        mutation_id: 'mut-1',
      },
    });
    await writeJson(join(runRoot, 'task.json'), {
      run_key: runKey,
      target_skill_path: FIXTURE,
      benchmark_profile: 'generic-skill-regression',
      current_iteration: 1,
      max_iterations: 10,
    });
    await writeJson(join(runRoot, 'run.json'), {
      consecutive_rejections: 0,
      rejected_iterations: [],
      iteration_history: [],
      champion_archive_history: [],
      finalized_at: null,
      notification_pending: null,
    });
    await writeJson(join(runRoot, 'context', `mutation_backlog_${runKey}.json`), {
      mutations: [],
    });
    await writeJson(join(runRoot, 'candidates', 'iteration-1', 'score.json'), {
      outcome: {
        accept: true,
        scores: {
          contract_compliance_score: 1,
        },
      },
    });

    const result = spawnSync('bash', [
      PHASE6,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', REPO_ROOT,
      '--iteration', '1',
    ], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 0, result.stderr);
    const archivedReference = await readFile(
      join(runRoot, 'archive', 'candidate-iteration-1', 'reference.md'),
      'utf8',
    );
    assert.equal(archivedReference, '# Mutated candidate reference\n');
  } finally {
    await rm(runRoot, { recursive: true, force: true });
  }
});

test('phase6 finalizes rejected run after stop condition is reached', async () => {
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase6-stop-'));
  const runKey = 'phase6-stop';

  try {
    await mkdir(join(runRoot, 'candidates', 'iteration-3'), { recursive: true });
    await mkdir(join(runRoot, 'context'), { recursive: true });
    await writeJson(join(runRoot, 'task.json'), {
      run_key: runKey,
      target_skill_path: FIXTURE,
      benchmark_profile: 'generic-skill-regression',
      current_iteration: 3,
      max_iterations: 10,
    });
    await writeJson(join(runRoot, 'run.json'), {
      consecutive_rejections: 3,
      rejected_iterations: [1, 2],
      iteration_history: [],
      champion_archive_history: [],
      finalized_at: null,
      notification_pending: null,
    });
    await writeJson(join(runRoot, 'context', `mutation_backlog_${runKey}.json`), {
      mutations: [],
    });
    await writeJson(join(runRoot, 'candidates', 'iteration-3', 'score.json'), {
      outcome: {
        accept: false,
        scores: {
          regression_count: 1,
        },
      },
    });

    const result = spawnSync('bash', [
      PHASE6,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', REPO_ROOT,
      '--iteration', '3',
    ], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 0);
    const task = JSON.parse(await readFile(join(runRoot, 'task.json'), 'utf8'));
    assert.equal(task.overall_status, 'completed');
    assert.equal(task.next_action_reason, 'stop_three_consecutive_rejections');
    await readFile(join(runRoot, 'evolution_final.md'), 'utf8');
  } finally {
    await rm(runRoot, { recursive: true, force: true });
  }
});

test('phase6 persists a machine-readable rejected mutation signature for future iterations', async () => {
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase6-rejected-sig-'));
  const runKey = 'phase6-rejected-sig';

  try {
    await mkdir(join(runRoot, 'candidates', 'iteration-1', 'candidate_snapshot'), { recursive: true });
    await mkdir(join(runRoot, 'context'), { recursive: true });
    await writeFile(
      join(runRoot, 'candidates', 'iteration-1', 'candidate_snapshot', 'reference.md'),
      '# snapshot\n',
      'utf8',
    );
    await writeJson(join(runRoot, 'task.json'), {
      run_key: runKey,
      target_skill_path: FIXTURE,
      benchmark_profile: 'generic-skill-regression',
      current_iteration: 1,
      max_iterations: 10,
    });
    await writeJson(join(runRoot, 'run.json'), {
      consecutive_rejections: 0,
      rejected_iterations: [],
      iteration_history: [],
      champion_archive_history: [],
      finalized_at: null,
      notification_pending: null,
    });
    await writeJson(join(runRoot, 'context', `mutation_backlog_${runKey}.json`), {
      mutations: [],
    });
    await writeJson(join(runRoot, 'candidates', 'iteration-1', 'candidate_scope.json'), {
      iteration: 1,
      candidate_snapshot_path: 'candidates/iteration-1/candidate_snapshot',
      changed_files: ['reference.md'],
      mutation: {
        mutation_id: 'mut-repeat',
        root_cause_bucket: 'knowledge_pack_gap',
        source_observation_ids: ['gap-repeat'],
        evals_affected: ['knowledge_pack_coverage'],
        target_files: ['fixture/evals/evals.json'],
      },
    });
    await writeJson(join(runRoot, 'candidates', 'iteration-1', 'score.json'), {
      outcome: {
        accept: false,
        scores: {
          regression_count: 1,
        },
      },
    });

    const result = spawnSync('bash', [
      PHASE6,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', REPO_ROOT,
      '--iteration', '1',
    ], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 0, result.stderr);
    const rejected = JSON.parse(
      await readFile(join(runRoot, 'context', `rejected_mutation_signatures_${runKey}.json`), 'utf8'),
    );
    assert.deepEqual(rejected.signatures, [
      JSON.stringify({
        root_cause_bucket: 'knowledge_pack_gap',
        source_observation_ids: ['gap-repeat'],
        target_files: ['fixture/evals/evals.json'],
        evals_affected: ['knowledge_pack_coverage'],
      }),
    ]);
    assert.equal(rejected.mutations[0].mutation_id, 'mut-repeat');
  } finally {
    await rm(runRoot, { recursive: true, force: true });
  }
});

test('phase6 publishes a qa-plan champion snapshot when an accepted iteration is finalized', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-phase6-qa-plan-repo-'));
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase6-qa-plan-run-'));
  const runKey = 'phase6-qa-plan-finalize';
  const targetRoot = join(repoRoot, 'workspace-planner', 'skills', 'qa-plan-orchestrator');
  const benchmarkRoot = getQaPlanBenchmarkRuntimeRoot(repoRoot);

  try {
    await mkdir(join(runRoot, 'candidates', 'iteration-1'), { recursive: true });
    await mkdir(join(runRoot, 'context'), { recursive: true });
    await mkdir(join(targetRoot, 'evals'), { recursive: true });
    await mkdir(join(targetRoot, 'benchmarks', 'qa-plan-v2', 'scripts'), { recursive: true });
    await mkdir(join(benchmarkRoot, 'iteration-0', 'champion_snapshot'), { recursive: true });
    await mkdir(join(benchmarkRoot, 'iteration-1', 'candidate_snapshot'), { recursive: true });
    await writeFile(join(targetRoot, 'SKILL.md'), QA_PLAN_LIVE_SKILL_MD, 'utf8');
    await writeFile(join(targetRoot, 'reference.md'), '# reference\n', 'utf8');
    await writeFile(
      join(targetRoot, 'benchmarks', 'qa-plan-v2', 'scripts', 'check_benchmark_fidelity.mjs'),
      `#!/usr/bin/env node
console.log('fidelity ok');
`,
      'utf8',
    );
    await writeFile(
      join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'SKILL.md'),
      ITERATION_CHAMPION_SKILL_MD,
      'utf8',
    );
    await writeFile(
      join(benchmarkRoot, 'iteration-1', 'candidate_snapshot', 'SKILL.md'),
      PROMOTED_CANDIDATE_SKILL_MD,
      'utf8',
    );
    await writeJson(join(benchmarkRoot, 'history.json'), {
      current_champion_iteration: 0,
      iterations: [
        {
          iteration: 0,
          label: 'iteration-0',
          role: 'seed_champion',
          skill_snapshot: 'iteration-0/champion_snapshot',
          grading_result: 'accepted',
          is_current_champion: true,
        },
      ],
    });
    await writeJson(join(benchmarkRoot, 'iteration-1', 'scorecard.json'), {
      scoring_fidelity: 'executed',
      decision: { result: 'accept' },
      mode_scores: {
        primary: {
          blind_pre_defect: { mean_pass_rate: 1 },
          retrospective_replay: { mean_pass_rate: 1 },
          holdout_regression: { mean_pass_rate: 1 },
        },
      },
    });
    await writeJson(join(runRoot, 'task.json'), {
      run_key: runKey,
      target_skill_path: 'workspace-planner/skills/qa-plan-orchestrator',
      benchmark_profile: 'qa-plan-defect-recall',
      current_iteration: 1,
      max_iterations: 10,
      champion_snapshot_path: 'archive/champion-initial',
    });
    await writeJson(join(runRoot, 'run.json'), {
      consecutive_rejections: 0,
      rejected_iterations: [],
      iteration_history: [],
      champion_archive_history: [],
      finalized_at: null,
      notification_pending: null,
    });
    await writeJson(join(runRoot, 'context', `mutation_backlog_${runKey}.json`), {
      mutations: [],
    });
    await writeJson(join(runRoot, 'candidates', 'iteration-1', 'score.json'), {
      outcome: {
        accept: true,
        benchmark_scorecard: {
          scoring_fidelity: 'executed',
          decision: { result: 'accept' },
          mode_scores: {
            primary: {
              blind_pre_defect: { mean_pass_rate: 1 },
              retrospective_replay: { mean_pass_rate: 1 },
              holdout_regression: { mean_pass_rate: 1 },
            },
          },
        },
        scores: {
          contract_compliance_score: 1,
        },
      },
    });

    const result = spawnSync('bash', [
      PHASE6,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', repoRoot,
      '--iteration', '1',
      '--finalize',
    ], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 0, result.stderr);
    const history = JSON.parse(await readFile(join(benchmarkRoot, 'history.json'), 'utf8'));
    assert.equal(history.current_champion_iteration, 1);
    assert.equal(history.iterations[0].is_current_champion, false);
    assert.equal(history.iterations[1].skill_snapshot, 'iteration-1/champion_snapshot');
    assert.equal(history.iterations[1].is_current_champion, true);
    const publishedSnapshot = await readFile(
      join(benchmarkRoot, 'iteration-1', 'champion_snapshot', 'SKILL.md'),
      'utf8',
    );
    assert.equal(publishedSnapshot, PROMOTED_CANDIDATE_SKILL_MD);
  } finally {
    await rm(runRoot, { recursive: true, force: true });
    await rm(repoRoot, { recursive: true, force: true });
  }
});

test('phase6 refuses qa-plan finalization when the canonical benchmark scorecard is not executed', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-phase6-qa-plan-bad-fidelity-repo-'));
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase6-qa-plan-bad-fidelity-run-'));
  const runKey = 'phase6-qa-plan-bad-fidelity';
  const targetRoot = join(repoRoot, 'workspace-planner', 'skills', 'qa-plan-orchestrator');
  const benchmarkRoot = getQaPlanBenchmarkRuntimeRoot(repoRoot);

  try {
    await mkdir(join(runRoot, 'candidates', 'iteration-1'), { recursive: true });
    await mkdir(join(runRoot, 'context'), { recursive: true });
    await mkdir(join(targetRoot, 'benchmarks', 'qa-plan-v2', 'scripts'), { recursive: true });
    await mkdir(join(benchmarkRoot, 'iteration-0', 'champion_snapshot'), { recursive: true });
    await mkdir(join(benchmarkRoot, 'iteration-1', 'candidate_snapshot'), { recursive: true });
    await mkdir(join(benchmarkRoot, 'iteration-1', 'eval-1', 'with_skill', 'run-1', 'outputs'), { recursive: true });
    await writeFile(join(targetRoot, 'SKILL.md'), QA_PLAN_LIVE_SKILL_MD, 'utf8');
    await writeFile(join(targetRoot, 'reference.md'), '# reference\n', 'utf8');
    await writeFile(
      join(targetRoot, 'benchmarks', 'qa-plan-v2', 'scripts', 'check_benchmark_fidelity.mjs'),
      `#!/usr/bin/env node
process.exitCode = 1;
console.error('synthetic fidelity failure');
`,
      'utf8',
    );
    await writeFile(
      join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'SKILL.md'),
      ITERATION_CHAMPION_SKILL_MD,
      'utf8',
    );
    await writeFile(
      join(benchmarkRoot, 'iteration-1', 'candidate_snapshot', 'SKILL.md'),
      PROMOTED_CANDIDATE_SKILL_MD,
      'utf8',
    );
    await writeJson(join(benchmarkRoot, 'history.json'), {
      current_champion_iteration: 0,
      iterations: [
        {
          iteration: 0,
          label: 'iteration-0',
          role: 'seed_champion',
          skill_snapshot: 'iteration-0/champion_snapshot',
          grading_result: 'accepted',
          is_current_champion: true,
        },
      ],
    });
    await writeJson(join(benchmarkRoot, 'iteration-1', 'scorecard.json'), {
      scoring_fidelity: 'synthetic',
      decision: { result: 'accept' },
      mode_scores: {
        primary: {
          blind_pre_defect: { mean_pass_rate: 1 },
        },
      },
    });
    await writeJson(join(runRoot, 'task.json'), {
      run_key: runKey,
      target_skill_path: 'workspace-planner/skills/qa-plan-orchestrator',
      benchmark_profile: 'qa-plan-defect-recall',
      current_iteration: 1,
      max_iterations: 10,
      champion_snapshot_path: 'archive/champion-initial',
    });
    await writeJson(join(runRoot, 'run.json'), {
      consecutive_rejections: 0,
      rejected_iterations: [],
      iteration_history: [],
      champion_archive_history: [],
      finalized_at: null,
      notification_pending: null,
    });
    await writeJson(join(runRoot, 'context', `mutation_backlog_${runKey}.json`), {
      mutations: [],
    });
    await writeJson(join(runRoot, 'candidates', 'iteration-1', 'score.json'), {
      outcome: {
        accept: true,
        benchmark_scorecard: {
          scoring_fidelity: 'executed',
          decision: { result: 'accept' },
          mode_scores: {
            primary: {
              blind_pre_defect: { mean_pass_rate: 1 },
              retrospective_replay: { mean_pass_rate: 1 },
              holdout_regression: { mean_pass_rate: 1 },
            },
          },
        },
        scores: {
          contract_compliance_score: 1,
        },
      },
      validation_summary: {
        contract_compliance_score: 1,
        defect_recall_score: 1,
        knowledge_pack_coverage_score: 1,
        regression_count: 0,
      },
    });

    const result = spawnSync('bash', [
      PHASE6,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', repoRoot,
      '--iteration', '1',
      '--finalize',
    ], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 1);
    assert.match(result.stderr, /benchmark scorecard fidelity/i);
    const history = JSON.parse(await readFile(join(benchmarkRoot, 'history.json'), 'utf8'));
    assert.equal(history.current_champion_iteration, 0);
  } finally {
    await rm(runRoot, { recursive: true, force: true });
    await rm(repoRoot, { recursive: true, force: true });
  }
});

test('phase6 finalize commits accepted candidate changes and records git promotion metadata', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-phase6-git-repo-'));
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase6-git-run-'));
  const runKey = 'phase6-git-finalize';
  const targetSkillPath = 'skills/git-target';
  const targetRoot = join(repoRoot, targetSkillPath);

  try {
    await mkdir(targetRoot, { recursive: true });
    await writeFile(join(targetRoot, 'SKILL.md'), GIT_TARGET_SKILL_MD, 'utf8');
    await writeFile(join(targetRoot, 'reference.md'), '# baseline\n', 'utf8');
    runGit(repoRoot, ['init']);
    runGit(repoRoot, ['config', 'user.email', 'qa@example.com']);
    runGit(repoRoot, ['config', 'user.name', 'qa-bot']);
    runGit(repoRoot, ['add', '.']);
    runGit(repoRoot, ['commit', '-m', 'seed']);

    await mkdir(join(runRoot, 'candidates', 'iteration-1', 'candidate_snapshot'), { recursive: true });
    await mkdir(join(runRoot, 'context'), { recursive: true });
    await mkdir(join(runRoot, 'benchmarks'), { recursive: true });
    await writeFile(
      join(runRoot, 'candidates', 'iteration-1', 'candidate_snapshot', 'reference.md'),
      '# mutated by candidate\n',
      'utf8',
    );
    await writeFile(
      join(runRoot, 'candidates', 'iteration-1', 'candidate_snapshot', 'SKILL.md'),
      GIT_TARGET_SKILL_MD,
      'utf8',
    );
    await writeJson(join(runRoot, 'task.json'), {
      run_key: runKey,
      target_skill_path: targetSkillPath,
      benchmark_profile: 'generic-skill-regression',
      current_iteration: 1,
      max_iterations: 10,
    });
    await writeJson(join(runRoot, 'run.json'), {
      consecutive_rejections: 0,
      rejected_iterations: [],
      iteration_history: [],
      champion_archive_history: [],
      finalized_at: null,
      notification_pending: null,
    });
    await writeJson(join(runRoot, 'context', `mutation_backlog_${runKey}.json`), {
      mutations: [
        { mutation_id: 'mut-1', root_cause_bucket: 'missing_scenario' },
      ],
    });
    await writeJson(join(runRoot, 'candidates', 'iteration-1', 'candidate_scope.json'), {
      candidate_snapshot_path: 'candidates/iteration-1/candidate_snapshot',
      changed_files: ['reference.md'],
      mutation: { source_observation_ids: ['gap-1'] },
    });
    await writeJson(join(runRoot, 'candidates', 'iteration-1', 'score.json'), {
      outcome: {
        accept: true,
        scores: {
          contract_compliance_score: 1,
          regression_count: 0,
        },
      },
    });

    const result = spawnSync('bash', [
      PHASE6,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', repoRoot,
      '--iteration', '1',
      '--finalize',
    ], { encoding: 'utf8' });

    assert.equal(result.status, 0, result.stderr);
    const promotion = JSON.parse(
      await readFile(join(runRoot, 'context', `git_promotion_${runKey}_i1.json`), 'utf8'),
    );
    assert.ok(promotion.commit_sha);
    assert.equal(promotion.pushed, false);
    const targetReference = await readFile(join(targetRoot, 'reference.md'), 'utf8');
    assert.equal(targetReference, '# mutated by candidate\n');
  } finally {
    await rm(runRoot, { recursive: true, force: true });
    await rm(repoRoot, { recursive: true, force: true });
  }
});

test('phase6 restores rejected candidate snapshot to champion baseline', async () => {
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase6-reject-restore-'));
  const runKey = 'phase6-reject-restore';

  try {
    await mkdir(join(runRoot, 'candidates', 'iteration-1', 'candidate_snapshot'), { recursive: true });
    await mkdir(join(runRoot, 'archive', 'champion-initial'), { recursive: true });
    await mkdir(join(runRoot, 'context'), { recursive: true });
    await writeFile(
      join(runRoot, 'archive', 'champion-initial', 'reference.md'),
      '# champion reference\n',
      'utf8',
    );
    await writeFile(
      join(runRoot, 'candidates', 'iteration-1', 'candidate_snapshot', 'reference.md'),
      '# rejected candidate reference\n',
      'utf8',
    );
    await writeJson(join(runRoot, 'task.json'), {
      run_key: runKey,
      target_skill_path: FIXTURE,
      benchmark_profile: 'generic-skill-regression',
      current_iteration: 1,
      max_iterations: 10,
      champion_snapshot_path: 'archive/champion-initial',
    });
    await writeJson(join(runRoot, 'run.json'), {
      consecutive_rejections: 0,
      rejected_iterations: [],
      iteration_history: [],
      champion_archive_history: [],
      finalized_at: null,
      notification_pending: null,
    });
    await writeJson(join(runRoot, 'context', `mutation_backlog_${runKey}.json`), { mutations: [] });
    await writeJson(join(runRoot, 'candidates', 'iteration-1', 'candidate_scope.json'), {
      candidate_snapshot_path: 'candidates/iteration-1/candidate_snapshot',
      changed_files: ['reference.md'],
      mutation: { source_observation_ids: ['gap-1'] },
    });
    await writeJson(join(runRoot, 'candidates', 'iteration-1', 'score.json'), {
      outcome: {
        accept: false,
        scores: {
          regression_count: 1,
        },
      },
    });

    const result = spawnSync('bash', [
      PHASE6,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', REPO_ROOT,
      '--iteration', '1',
    ], { encoding: 'utf8' });

    assert.equal(result.status, 0, result.stderr);
    const restoredReference = await readFile(
      join(runRoot, 'candidates', 'iteration-1', 'candidate_snapshot', 'reference.md'),
      'utf8',
    );
    assert.equal(restoredReference, '# champion reference\n');
    assert.equal(
      existsSync(join(runRoot, 'context', `rejection_restore_${runKey}_i1.json`)),
      true,
    );
  } finally {
    await rm(runRoot, { recursive: true, force: true });
  }
});
