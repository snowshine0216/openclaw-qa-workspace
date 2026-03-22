import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = join(fileURLToPath(new URL('../../../../../', import.meta.url)));
const PHASE6 = join(REPO_ROOT, '.agents/skills/qa-plan-evolution/scripts/phase6.sh');
const FIXTURE = '.agents/skills/qa-plan-evolution/scripts/test/fixtures/minimal-target-skill';

async function writeJson(path, payload) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

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
    await readFile(join(runRoot, 'evolution_final.md'), 'utf8');
  } finally {
    await rm(runRoot, { recursive: true, force: true });
  }
});

test('phase6 refuses promotion when the accepted scorecard is synthetic', async () => {
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase6-synthetic-'));
  const runKey = 'phase6-synthetic';

  try {
    await mkdir(join(runRoot, 'candidates', 'iteration-1'), { recursive: true });
    await mkdir(join(runRoot, 'context'), { recursive: true });
    await writeJson(join(runRoot, 'task.json'), {
      run_key: runKey,
      target_skill_path: FIXTURE,
      benchmark_profile: 'qa-plan-defect-recall',
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
        benchmark_scorecard: {
          scoring_fidelity: 'synthetic',
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
      '--repo-root', REPO_ROOT,
      '--iteration', '1',
    ], {
      encoding: 'utf8',
    });

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /synthetic/i);
  } finally {
    await rm(runRoot, { recursive: true, force: true });
  }
});

test('phase6 publishes a qa-plan champion snapshot when an accepted iteration is finalized', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-phase6-qa-plan-repo-'));
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase6-qa-plan-run-'));
  const runKey = 'phase6-qa-plan-finalize';
  const targetRoot = join(repoRoot, 'workspace-planner', 'skills', 'qa-plan-orchestrator');
  const benchmarkRoot = join(targetRoot, 'benchmarks', 'qa-plan-v2');

  try {
    await mkdir(join(runRoot, 'candidates', 'iteration-1'), { recursive: true });
    await mkdir(join(runRoot, 'context'), { recursive: true });
    await mkdir(join(targetRoot, 'evals'), { recursive: true });
    await mkdir(join(benchmarkRoot, 'iteration-0', 'champion_snapshot'), { recursive: true });
    await mkdir(join(benchmarkRoot, 'iteration-1', 'candidate_snapshot'), { recursive: true });
    await writeFile(join(targetRoot, 'SKILL.md'), '# qa-plan live\n', 'utf8');
    await writeFile(join(targetRoot, 'reference.md'), '# reference\n', 'utf8');
    await writeFile(
      join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'SKILL.md'),
      '# iteration-0 champion\n',
      'utf8',
    );
    await writeFile(
      join(benchmarkRoot, 'iteration-1', 'candidate_snapshot', 'SKILL.md'),
      '# promoted candidate snapshot\n',
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
    assert.equal(publishedSnapshot, '# promoted candidate snapshot\n');
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
    await writeFile(join(targetRoot, 'SKILL.md'), '# skill\n', 'utf8');
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
      '# skill\n',
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
