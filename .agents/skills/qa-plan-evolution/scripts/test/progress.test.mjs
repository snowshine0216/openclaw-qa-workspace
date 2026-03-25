import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = join(fileURLToPath(new URL('../../../../../', import.meta.url)));
const PROGRESS = join(REPO_ROOT, '.agents/skills/qa-plan-evolution/scripts/progress.sh');

async function writeJson(path, payload) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

test('progress reports pending async jobs from the canonical operator summary', async () => {
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-progress-'));
  const runKey = 'progress-pending';

  try {
    await mkdir(join(runRoot, 'jobs'), { recursive: true });
    await writeJson(join(runRoot, 'task.json'), {
      run_key: runKey,
      overall_status: 'blocked',
      current_phase: 'phase1',
      current_iteration: 1,
      next_action: 'await_async_completion',
      next_action_reason: 'defects_analysis_refresh_pending',
      pending_job_ids: ['phase1-1'],
      blocking_reason: 'waiting_on_defects_analysis',
      runtime_root_mode: 'scratch_alias',
      canonical_run_root: '/canonical/run',
      scratch_run_root: '/scratch/run',
    });
    await writeJson(join(runRoot, 'jobs', 'phase1-1.json'), {
      job_id: 'phase1-1',
      phase: 'phase1',
      status: 'queued',
      manifest_path: '/tmp/phase1_spawn_manifest.json',
      post_applied_at: null,
      failure_reason: null,
    });

    const result = spawnSync('bash', [
      PROGRESS,
      '--run-key', runKey,
      '--run-root', runRoot,
    ], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /"next_action": "await_async_completion"/);
    assert.match(result.stdout, /"job_id": "phase1-1"/);
    assert.match(result.stdout, /"status": "queued"/);
  } finally {
    await rm(runRoot, { recursive: true, force: true });
  }
});

test('progress performs one bounded reconciliation pass before rendering summary', async () => {
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-progress-refresh-'));
  const runKey = 'progress-refresh';

  try {
    await mkdir(join(runRoot, 'jobs'), { recursive: true });
    await mkdir(join(runRoot, 'context'), { recursive: true });
    await writeJson(join(runRoot, 'task.json'), {
      run_key: runKey,
      overall_status: 'in_progress',
      current_phase: 'phase1',
      current_iteration: 1,
      next_action: 'await_async_completion',
      next_action_reason: 'awaiting_async_prerequisite',
      pending_job_ids: ['phase1-1'],
      blocking_reason: 'waiting_on_defects_analysis',
      runtime_root_mode: 'canonical_only',
      canonical_run_root: runRoot,
      scratch_run_root: null,
    });
    await writeJson(join(runRoot, 'jobs', 'phase1-1.json'), {
      job_id: 'phase1-1',
      phase: 'phase1',
      job_type: 'spawn_manifest',
      status: 'running',
      manifest_path: join(runRoot, 'phase1_spawn_manifest.json'),
      spawn_results_path: join(runRoot, 'spawn_results.json'),
      expected_artifacts: [join(runRoot, 'context', 'gap_bundle.json')],
      completion_probe: 'expected_artifacts_and_spawn_results',
      freshness_inputs: [],
      success_marker: 'spawn_results_all_completed',
      timeout_at: '2099-01-01T00:00:00.000Z',
      retry_count: 0,
      retry_policy: { owner: 'orchestrator', max_retries: 1 },
      blocking_reason: 'waiting_on_defects_analysis',
      created_at: '2026-03-25T00:00:00.000Z',
      started_at: '2026-03-25T00:00:00.000Z',
      completed_at: null,
      last_checked_at: null,
      post_applied_at: null,
      failure_reason: null,
    });
    await writeJson(join(runRoot, 'spawn_results.json'), {
      results: [{ kind: 'local_command', status: 'completed', stderr: '' }],
    });
    await writeJson(join(runRoot, 'context', 'gap_bundle.json'), { ok: true });

    const result = spawnSync('bash', [
      PROGRESS,
      '--run-key', runKey,
      '--run-root', runRoot,
    ], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /"status": "completed"/);
  } finally {
    await rm(runRoot, { recursive: true, force: true });
  }
});
