import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, join, relative } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = join(fileURLToPath(new URL('../../../../../', import.meta.url)));
const PHASE3 = join(REPO_ROOT, '.agents/skills/qa-plan-evolution/scripts/phase3.sh');

async function writeJson(path, payload) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

async function createTargetSkill(repoRoot, name = 'target-skill') {
  const skillRoot = join(repoRoot, name);
  await mkdir(skillRoot, { recursive: true });
  await writeFile(
    join(skillRoot, 'SKILL.md'),
    `---
name: ${name}
description: Generic target skill fixture for qa-plan-evolution tests.
---

# Skill

REPORT_STATE
`,
    'utf8',
  );
  await writeFile(join(skillRoot, 'reference.md'), '# Reference\n', 'utf8');
  await writeJson(join(skillRoot, 'package.json'), {
    name,
    private: true,
    type: 'module',
    scripts: {
      test: 'node -e "process.exit(0)"',
    },
  });
  return relative(repoRoot, skillRoot);
}

test('phase3 selects one pending mutation and writes candidate artifacts', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-phase3-repo-'));
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase3-'));
  const runKey = 'phase3-select';

  try {
    const targetSkillPath = await createTargetSkill(repoRoot);
    await mkdir(join(runRoot, 'context'), { recursive: true });
    await writeJson(join(runRoot, 'task.json'), {
      run_key: runKey,
      current_iteration: 1,
      target_skill_path: targetSkillPath,
    });
    await writeJson(join(runRoot, 'context', `mutation_backlog_${runKey}.json`), {
      mutations: [
        {
          mutation_id: 'mut-1',
          root_cause_bucket: 'missing_scenario',
          target_files: ['target/evals/evals.json'],
          knowledge_pack_delta: 'none',
          status: 'pending',
        },
        {
          mutation_id: 'mut-2',
          root_cause_bucket: 'traceability_gap',
          target_files: ['target/README.md'],
          knowledge_pack_delta: 'doc sync',
          status: 'pending',
        },
      ],
    });

    const result = spawnSync('bash', [
      PHASE3,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', repoRoot,
      '--iteration', '1',
    ], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 0);
    assert.match(result.stdout, /SPAWN_MANIFEST:/);
    const candidateScope = JSON.parse(
      await readFile(join(runRoot, 'candidates', 'iteration-1', 'candidate_scope.json'), 'utf8'),
    );
    const candidatePlan = await readFile(
      join(runRoot, 'candidates', 'iteration-1', 'candidate_plan.md'),
      'utf8',
    );
    const patchTask = await readFile(
      join(runRoot, 'candidates', 'iteration-1', 'candidate_patch_task.md'),
      'utf8',
    );
    const workerVisibleSnapshotPath = relative(
      repoRoot,
      join(runRoot, 'candidates', 'iteration-1', 'candidate_snapshot'),
    );

    assert.equal(candidateScope.mutation.mutation_id, 'mut-1');
    assert.equal(candidateScope.candidate_snapshot_path, 'candidates/iteration-1/candidate_snapshot');
    assert.match(candidatePlan, /Selected mutation: mut-1/);
    assert.match(
      patchTask,
      new RegExp(`Only edit files under ${workerVisibleSnapshotPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`),
    );
    const task = JSON.parse(await readFile(join(runRoot, 'task.json'), 'utf8'));
    assert.equal(task.next_action, 'await_async_completion');
    assert.equal(task.next_action_reason, 'awaiting_async_prerequisite');
    assert.equal(task.blocking_reason, 'waiting_on_candidate_patch');
    assert.deepEqual(task.pending_job_ids, ['phase3-1']);
    const job = JSON.parse(
      await readFile(join(runRoot, 'jobs', 'phase3-1.json'), 'utf8'),
    );
    assert.equal(job.phase, 'phase3');
    assert.equal(job.status, 'queued');
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
    await rm(runRoot, { recursive: true, force: true });
  }
});

test('phase3 writes knowledge-pack delta for selected mutation', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-phase3-pack-repo-'));
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase3-pack-'));
  const runKey = 'phase3-pack';

  try {
    const targetSkillPath = await createTargetSkill(repoRoot);
    await mkdir(join(runRoot, 'context'), { recursive: true });
    await writeJson(join(runRoot, 'task.json'), {
      run_key: runKey,
      current_iteration: 1,
      target_skill_path: targetSkillPath,
    });
    await writeJson(join(runRoot, 'context', `mutation_backlog_${runKey}.json`), {
      mutations: [
        {
          mutation_id: 'mut-pack',
          root_cause_bucket: 'knowledge_pack_gap',
          target_files: ['target/references/phase4a-contract.md'],
          knowledge_pack_delta: 'Add dialog completeness gate',
          status: 'pending',
        },
      ],
    });

    const result = spawnSync('bash', [
      PHASE3,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', repoRoot,
      '--iteration', '1',
    ], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 0);
    const packDelta = await readFile(
      join(runRoot, 'candidates', 'iteration-1', 'knowledge_pack_delta.md'),
      'utf8',
    );
    assert.match(packDelta, /dialog completeness gate/i);
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
    await rm(runRoot, { recursive: true, force: true });
  }
});

test('phase3 prioritizes higher severity, then bucket priority, then earlier phase', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-phase3-priority-repo-'));
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase3-priority-'));
  const runKey = 'phase3-priority';

  try {
    const targetSkillPath = await createTargetSkill(repoRoot);
    await mkdir(join(runRoot, 'context'), { recursive: true });
    await writeJson(join(runRoot, 'task.json'), {
      run_key: runKey,
      current_iteration: 1,
      target_skill_path: targetSkillPath,
    });
    await writeJson(join(runRoot, 'context', `mutation_backlog_${runKey}.json`), {
      mutations: [
        {
          mutation_id: 'mut-low-phase4',
          root_cause_bucket: 'missing_scenario',
          priority: { severity_rank: 2, bucket_rank: 5, phase_rank: 4 },
          source_observation_ids: ['gap-low'],
          target_files: ['target/references/phase4a-contract.md'],
          knowledge_pack_delta: 'none',
          status: 'pending',
        },
        {
          mutation_id: 'mut-high-phase7',
          root_cause_bucket: 'developer_artifact_missing',
          priority: { severity_rank: 0, bucket_rank: 1, phase_rank: 7 },
          source_observation_ids: ['gap-high'],
          target_files: ['target/scripts/lib/finalPlanSummary.mjs'],
          knowledge_pack_delta: 'none',
          status: 'pending',
        },
      ],
    });

    const result = spawnSync('bash', [
      PHASE3,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', repoRoot,
      '--iteration', '1',
    ], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 0);
    const candidateScope = JSON.parse(
      await readFile(join(runRoot, 'candidates', 'iteration-1', 'candidate_scope.json'), 'utf8'),
    );
    assert.equal(candidateScope.mutation.mutation_id, 'mut-high-phase7');
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
    await rm(runRoot, { recursive: true, force: true });
  }
});

test('phase3 skips mutations whose gap ids were already accepted', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-phase3-addressed-repo-'));
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase3-addressed-'));
  const runKey = 'phase3-addressed';

  try {
    const targetSkillPath = await createTargetSkill(repoRoot);
    await mkdir(join(runRoot, 'context'), { recursive: true });
    await writeJson(join(runRoot, 'task.json'), {
      run_key: runKey,
      current_iteration: 2,
      target_skill_path: targetSkillPath,
    });
    await writeJson(join(runRoot, 'context', `accepted_gap_ids_${runKey}.json`), {
      gap_ids: ['gap-accepted'],
    });
    await writeJson(join(runRoot, 'context', `mutation_backlog_${runKey}.json`), {
      mutations: [
        {
          mutation_id: 'mut-accepted',
          root_cause_bucket: 'missing_scenario',
          source_observation_ids: ['gap-accepted'],
          priority: { severity_rank: 0, bucket_rank: 5, phase_rank: 4 },
          target_files: ['target/references/phase4a-contract.md'],
          knowledge_pack_delta: 'none',
          status: 'pending',
        },
        {
          mutation_id: 'mut-next',
          root_cause_bucket: 'interaction_gap',
          source_observation_ids: ['gap-next'],
          priority: { severity_rank: 1, bucket_rank: 3, phase_rank: 5 },
          target_files: ['target/references/review-rubric-phase5a.md'],
          knowledge_pack_delta: 'none',
          status: 'pending',
        },
      ],
    });

    const result = spawnSync('bash', [
      PHASE3,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', repoRoot,
      '--iteration', '2',
    ], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 0);
    const candidateScope = JSON.parse(
      await readFile(join(runRoot, 'candidates', 'iteration-2', 'candidate_scope.json'), 'utf8'),
    );
    assert.equal(candidateScope.mutation.mutation_id, 'mut-next');
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
    await rm(runRoot, { recursive: true, force: true });
  }
});

test('phase3 skips mutations whose signature was already rejected in the same run', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-phase3-rejected-repo-'));
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase3-rejected-'));
  const runKey = 'phase3-rejected';

  try {
    const targetSkillPath = await createTargetSkill(repoRoot);
    await mkdir(join(runRoot, 'context'), { recursive: true });
    await writeJson(join(runRoot, 'task.json'), {
      run_key: runKey,
      current_iteration: 3,
      target_skill_path: targetSkillPath,
    });
    await writeJson(join(runRoot, 'context', `rejected_mutation_signatures_${runKey}.json`), {
      signatures: [
        JSON.stringify({
          root_cause_bucket: 'knowledge_pack_gap',
          source_observation_ids: ['gap-repeat'],
          target_files: [`${targetSkillPath}/evals/evals.json`],
          evals_affected: ['knowledge_pack_coverage'],
        }),
      ],
      mutations: [],
    });
    await writeJson(join(runRoot, 'context', `mutation_backlog_${runKey}.json`), {
      mutations: [
        {
          mutation_id: 'mut-repeat',
          root_cause_bucket: 'knowledge_pack_gap',
          source_observation_ids: ['gap-repeat'],
          evals_affected: ['knowledge_pack_coverage'],
          priority: { severity_rank: 0, bucket_rank: 1, phase_rank: 4 },
          target_files: [`${targetSkillPath}/evals/evals.json`],
          knowledge_pack_delta: 'none',
          status: 'pending',
        },
        {
          mutation_id: 'mut-fresh',
          root_cause_bucket: 'interaction_gap',
          source_observation_ids: ['gap-fresh'],
          evals_affected: ['interaction_matrix_coverage'],
          priority: { severity_rank: 1, bucket_rank: 3, phase_rank: 5 },
          target_files: [`${targetSkillPath}/references/review-rubric-phase5a.md`],
          knowledge_pack_delta: 'none',
          status: 'pending',
        },
      ],
    });

    const result = spawnSync('bash', [
      PHASE3,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', repoRoot,
      '--iteration', '3',
    ], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 0);
    const candidateScope = JSON.parse(
      await readFile(join(runRoot, 'candidates', 'iteration-3', 'candidate_scope.json'), 'utf8'),
    );
    assert.equal(candidateScope.mutation.mutation_id, 'mut-fresh');
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
    await rm(runRoot, { recursive: true, force: true });
  }
});

test('phase3 post writes candidate patch summary after the candidate snapshot is mutated', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-phase3-post-repo-'));
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase3-post-'));
  const runKey = 'phase3-post';

  try {
    const targetSkillPath = await createTargetSkill(repoRoot);
    await mkdir(join(runRoot, 'context'), { recursive: true });
    await writeJson(join(runRoot, 'task.json'), {
      run_key: runKey,
      current_iteration: 1,
      target_skill_path: targetSkillPath,
    });
    await writeJson(join(runRoot, 'context', `mutation_backlog_${runKey}.json`), {
      mutations: [
        {
          mutation_id: 'mut-1',
          root_cause_bucket: 'traceability_gap',
          target_files: [`${targetSkillPath}/reference.md`],
          knowledge_pack_delta: 'none',
          status: 'pending',
        },
      ],
    });

    const pre = spawnSync('bash', [
      PHASE3,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', repoRoot,
      '--iteration', '1',
    ], {
      encoding: 'utf8',
    });

    assert.equal(pre.status, 0);
    await writeFile(
      join(runRoot, 'candidates', 'iteration-1', 'candidate_snapshot', 'reference.md'),
      '# Mutated reference\n',
      'utf8',
    );

    const post = spawnSync('bash', [
      PHASE3,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', repoRoot,
      '--iteration', '1',
      '--post',
    ], {
      encoding: 'utf8',
    });

    assert.equal(post.status, 0, post.stderr);
    const summary = await readFile(
      join(runRoot, 'candidates', 'iteration-1', 'candidate_patch_summary.md'),
      'utf8',
    );
    const scope = JSON.parse(
      await readFile(join(runRoot, 'candidates', 'iteration-1', 'candidate_scope.json'), 'utf8'),
    );

    assert.match(summary, /reference\.md/);
    assert.deepEqual(scope.changed_files, ['reference.md']);
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
    await rm(runRoot, { recursive: true, force: true });
  }
});

test('phase3 post rejects no-op candidate snapshots', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-phase3-noop-repo-'));
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase3-noop-'));
  const runKey = 'phase3-noop';

  try {
    const targetSkillPath = await createTargetSkill(repoRoot);
    await mkdir(join(runRoot, 'context'), { recursive: true });
    await writeJson(join(runRoot, 'task.json'), {
      run_key: runKey,
      current_iteration: 1,
      target_skill_path: targetSkillPath,
    });
    await writeJson(join(runRoot, 'context', `mutation_backlog_${runKey}.json`), {
      mutations: [
        {
          mutation_id: 'mut-1',
          root_cause_bucket: 'traceability_gap',
          target_files: [`${targetSkillPath}/reference.md`],
          knowledge_pack_delta: 'none',
          status: 'pending',
        },
      ],
    });

    const pre = spawnSync('bash', [
      PHASE3,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', repoRoot,
      '--iteration', '1',
    ], {
      encoding: 'utf8',
    });

    assert.equal(pre.status, 0);
    const post = spawnSync('bash', [
      PHASE3,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', repoRoot,
      '--iteration', '1',
      '--post',
    ], {
      encoding: 'utf8',
    });

    assert.notEqual(post.status, 0);
    assert.match(post.stderr, /no-op|no file changes/i);
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
    await rm(runRoot, { recursive: true, force: true });
  }
});
