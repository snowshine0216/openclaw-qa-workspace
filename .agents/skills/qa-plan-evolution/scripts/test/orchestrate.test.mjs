import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, join, relative } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = join(fileURLToPath(new URL('../../../../../', import.meta.url)));
const ORCHESTRATE = join(
  REPO_ROOT,
  '.agents/skills/qa-plan-evolution/scripts/orchestrate.sh',
);

async function writeJson(path, payload) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

const TARGET_SKILL_MD = `---
name: target-skill
description: Generic target skill fixture for qa-plan-evolution regression tests.
---

# Target Skill

REPORT_STATE
`;

test('orchestrate stops cleanly when phase2 produces no pending mutations', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-orchestrate-repo-'));
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-orchestrate-clean-'));
  const runKey = 'orchestrate-clean-stop';

  try {
    const targetRoot = join(repoRoot, 'target-skill');
    await mkdir(join(targetRoot, 'evals'), { recursive: true });
    await writeFile(join(targetRoot, 'SKILL.md'), TARGET_SKILL_MD, 'utf8');
    await writeFile(join(targetRoot, 'reference.md'), '# Target Reference\n\nREPORT_STATE\n', 'utf8');
    await writeJson(join(targetRoot, 'evals', 'evals.json'), {
      eval_groups: [
        { id: 'core_contract', policy: 'blocking', prompt: 'keep contract coverage' },
      ],
    });

    const result = spawnSync('bash', [
      ORCHESTRATE,
      '--with-phase0',
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', repoRoot,
      '--target-skill-path', relative(repoRoot, targetRoot),
      '--target-skill-name', 'target-skill',
      '--benchmark-profile', 'generic-skill-regression',
    ], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 0, result.stderr);
    assert.equal(
      existsSync(join(runRoot, 'candidates', 'iteration-1', 'validation_report.json')),
      false,
    );

    const task = JSON.parse(await readFile(join(runRoot, 'task.json'), 'utf8'));
    assert.equal(task.overall_status, 'completed');
    assert.equal(task.current_phase, 'phase3');

    const nextAction = JSON.parse(
      await readFile(join(runRoot, 'context', `next_action_${runKey}.json`), 'utf8'),
    );
    assert.equal(nextAction.next_action, 'stop_no_blocking_gaps');
    assert.equal(existsSync(join(runRoot, 'evolution_final.md')), true);
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
    await rm(runRoot, { recursive: true, force: true });
  }
});

test('orchestrate reconciles a completed async phase3 job before continuing', async () => {
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-orchestrate-resume-'));
  const runKey = 'orchestrate-phase3-post';
  const fixturePath = '.agents/skills/qa-plan-evolution/scripts/test/fixtures/minimal-target-skill';
  const iterDir = join(runRoot, 'candidates', 'iteration-1');
  const snapshotDir = join(iterDir, 'candidate_snapshot');

  try {
    await mkdir(join(runRoot, 'jobs'), { recursive: true });
    await mkdir(join(runRoot, 'benchmarks'), { recursive: true });
    await mkdir(snapshotDir, { recursive: true });
    await writeFile(join(snapshotDir, 'SKILL.md'), TARGET_SKILL_MD, 'utf8');
    await writeFile(join(snapshotDir, 'reference.md'), '# Mutated\n', 'utf8');
    await writeJson(join(snapshotDir, 'package.json'), {
      name: 'minimal-evolution-target-fixture',
      private: true,
      type: 'module',
      scripts: {
        test: 'node -e "process.exit(0)"',
      },
    });
    await writeFile(join(iterDir, 'candidate_patch_summary.md'), '# pending\n', 'utf8');
    await writeJson(join(iterDir, 'candidate_scope.json'), {
      iteration: 1,
      candidate_snapshot_path: 'candidates/iteration-1/candidate_snapshot',
      changed_files: [],
      mutation: {
        mutation_id: 'mut-1',
        root_cause_bucket: 'knowledge_pack_gap',
        source_observation_ids: ['gap-1'],
        evals_affected: ['core_contract'],
        target_files: [`${fixturePath}/reference.md`],
      },
    });
    await writeJson(join(iterDir, 'phase3_spawn_manifest.json'), {
      requests: [],
    });
    await writeFile(join(iterDir, 'candidate_worker_output.md'), '# worker output\n', 'utf8');
    await writeJson(join(iterDir, 'spawn_results.json'), {
      results: [
        {
          kind: 'openclaw',
          status: 'completed',
          stderr: '',
        },
      ],
    });
    await writeJson(join(runRoot, 'task.json'), {
      run_key: runKey,
      target_skill_path: fixturePath,
      target_skill_name: 'minimal-target-skill',
      benchmark_profile: 'generic-skill-regression',
      current_phase: 'phase3',
      current_iteration: 1,
      overall_status: 'in_progress',
      next_action: 'await_async_completion',
      next_action_reason: 'awaiting_async_prerequisite',
      pending_job_ids: ['phase3-1'],
      blocking_reason: 'waiting_on_candidate_patch',
    });
    await writeJson(join(runRoot, 'run.json'), {
      run_key: runKey,
      started_at: '2026-03-25T00:00:00.000Z',
      updated_at: '2026-03-25T00:00:00.000Z',
      latest_validation_completed_at: null,
      latest_score_completed_at: null,
      rejected_iterations: [],
      iteration_history: [],
      champion_archive_history: [],
      consecutive_rejections: 0,
      notification_pending: null,
    });
    await writeJson(join(runRoot, 'benchmarks', `scoreboard_${runKey}.json`), {
      run_key: runKey,
      champion: {
        defect_recall_score: 0,
        contract_compliance_score: 1,
        knowledge_pack_coverage_score: 0,
        regression_count: 0,
      },
      iterations: [],
    });
    await writeJson(join(runRoot, 'jobs', 'phase3-1.json'), {
      job_id: 'phase3-1',
      phase: 'phase3',
      job_type: 'spawn_manifest',
      status: 'running',
      manifest_path: join(iterDir, 'phase3_spawn_manifest.json'),
      spawn_results_path: join(iterDir, 'spawn_results.json'),
      expected_artifacts: [join(iterDir, 'candidate_worker_output.md')],
      completion_probe: 'expected_artifacts_and_spawn_results',
      freshness_inputs: [join(iterDir, 'candidate_scope.json')],
      success_marker: 'spawn_results_all_completed',
      timeout_at: '2099-01-01T00:00:00.000Z',
      retry_count: 0,
      retry_policy: { owner: 'orchestrator', max_retries: 1 },
      blocking_reason: 'waiting_on_candidate_patch',
      created_at: '2026-03-25T00:00:00.000Z',
      started_at: '2026-03-25T00:00:00.000Z',
      completed_at: null,
      last_checked_at: null,
      post_applied_at: null,
      failure_reason: null,
    });

    const result = spawnSync('bash', [
      ORCHESTRATE,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', REPO_ROOT,
      '--iteration', '1',
    ], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /phase3 ok: iteration-1 candidate_patch_summary written/);
    assert.equal(existsSync(join(runRoot, 'candidates', 'iteration-1', 'validation_report.json')), true);
    const task = JSON.parse(await readFile(join(runRoot, 'task.json'), 'utf8'));
    assert.notEqual(task.next_action, 'await_async_completion');
  } finally {
    await rm(runRoot, { recursive: true, force: true });
  }
});

test('orchestrate blocks failed async phase3 jobs and does not apply post re-entry', async () => {
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-orchestrate-failed-'));
  const runKey = 'orchestrate-phase3-failed';
  const fixturePath = '.agents/skills/qa-plan-evolution/scripts/test/fixtures/minimal-target-skill';
  const iterDir = join(runRoot, 'candidates', 'iteration-1');
  const snapshotDir = join(iterDir, 'candidate_snapshot');

  try {
    await mkdir(join(runRoot, 'jobs'), { recursive: true });
    await mkdir(join(runRoot, 'benchmarks'), { recursive: true });
    await mkdir(snapshotDir, { recursive: true });
    await writeFile(join(snapshotDir, 'SKILL.md'), TARGET_SKILL_MD, 'utf8');
    await writeFile(join(snapshotDir, 'reference.md'), '# Mutated\n', 'utf8');
    await writeJson(join(snapshotDir, 'package.json'), {
      name: 'minimal-evolution-target-fixture',
      private: true,
      type: 'module',
      scripts: {
        test: 'node -e "process.exit(0)"',
      },
    });
    await writeFile(join(iterDir, 'candidate_patch_summary.md'), '# pending\n', 'utf8');
    await writeJson(join(iterDir, 'candidate_scope.json'), {
      iteration: 1,
      candidate_snapshot_path: 'candidates/iteration-1/candidate_snapshot',
      changed_files: [],
      mutation: {
        mutation_id: 'mut-1',
        root_cause_bucket: 'knowledge_pack_gap',
        source_observation_ids: ['gap-1'],
        evals_affected: ['core_contract'],
        target_files: [`${fixturePath}/reference.md`],
      },
    });
    await writeJson(join(iterDir, 'phase3_spawn_manifest.json'), {
      requests: [],
    });
    await writeJson(join(iterDir, 'spawn_results.json'), {
      results: [
        {
          kind: 'openclaw',
          status: 'failed',
          stderr: 'candidate patch worker failed',
        },
      ],
    });
    await writeJson(join(runRoot, 'task.json'), {
      run_key: runKey,
      target_skill_path: fixturePath,
      target_skill_name: 'minimal-target-skill',
      benchmark_profile: 'generic-skill-regression',
      current_phase: 'phase3',
      current_iteration: 1,
      overall_status: 'in_progress',
      next_action: 'await_async_completion',
      next_action_reason: 'awaiting_async_prerequisite',
      pending_job_ids: ['phase3-1'],
      blocking_reason: 'waiting_on_candidate_patch',
    });
    await writeJson(join(runRoot, 'run.json'), {
      run_key: runKey,
      started_at: '2026-03-25T00:00:00.000Z',
      updated_at: '2026-03-25T00:00:00.000Z',
      latest_validation_completed_at: null,
      latest_score_completed_at: null,
      rejected_iterations: [],
      iteration_history: [],
      champion_archive_history: [],
      consecutive_rejections: 0,
      notification_pending: null,
    });
    await writeJson(join(runRoot, 'benchmarks', `scoreboard_${runKey}.json`), {
      run_key: runKey,
      champion: {
        defect_recall_score: 0,
        contract_compliance_score: 1,
        knowledge_pack_coverage_score: 0,
        regression_count: 0,
      },
      iterations: [],
    });
    await writeJson(join(runRoot, 'jobs', 'phase3-1.json'), {
      job_id: 'phase3-1',
      phase: 'phase3',
      job_type: 'spawn_manifest',
      status: 'running',
      manifest_path: join(iterDir, 'phase3_spawn_manifest.json'),
      spawn_results_path: join(iterDir, 'spawn_results.json'),
      expected_artifacts: [join(iterDir, 'candidate_worker_output.md')],
      completion_probe: 'expected_artifacts_and_spawn_results',
      freshness_inputs: [join(iterDir, 'candidate_scope.json')],
      success_marker: 'spawn_results_all_completed',
      timeout_at: '2099-01-01T00:00:00.000Z',
      retry_count: 0,
      retry_policy: { owner: 'orchestrator', max_retries: 1 },
      blocking_reason: 'waiting_on_candidate_patch',
      created_at: '2026-03-25T00:00:00.000Z',
      started_at: '2026-03-25T00:00:00.000Z',
      completed_at: null,
      last_checked_at: null,
      post_applied_at: null,
      failure_reason: null,
    });

    const result = spawnSync('bash', [
      ORCHESTRATE,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', REPO_ROOT,
      '--iteration', '1',
    ], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 0, result.stderr);
    assert.equal(
      existsSync(join(runRoot, 'candidates', 'iteration-1', 'validation_report.json')),
      false,
    );
    const task = JSON.parse(await readFile(join(runRoot, 'task.json'), 'utf8'));
    assert.equal(task.overall_status, 'blocked');
    assert.equal(task.next_action, 'operator_retry_required');
    assert.match(task.blocking_reason, /candidate patch worker failed/i);
  } finally {
    await rm(runRoot, { recursive: true, force: true });
  }
});
