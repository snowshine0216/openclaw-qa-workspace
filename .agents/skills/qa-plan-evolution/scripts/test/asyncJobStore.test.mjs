import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';

import {
  loadJobs,
  refreshJobs,
  registerManifestJob,
} from '../lib/asyncJobStore.mjs';

async function writeJson(path, payload) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

function completedSpawnResults() {
  return {
    results: [
      {
        kind: 'local_command',
        status: 'completed',
        stderr: '',
      },
    ],
  };
}

test('registerManifestJob persists completion metadata and stale artifacts do not satisfy completion', async () => {
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-async-job-'));
  const manifestPath = join(runRoot, 'phase1_spawn_manifest.json');
  const expectedArtifact = join(runRoot, 'context', 'gap_bundle.json');
  const freshnessInput = join(runRoot, 'context', 'analysis_freshness.json');

  try {
    await writeJson(join(runRoot, 'task.json'), {
      run_key: 'async-job-stale',
      overall_status: 'in_progress',
      current_phase: 'phase1',
      current_iteration: 1,
      next_action: 'run_phase1',
      next_action_reason: 'phase0_complete',
      pending_job_ids: [],
      blocking_reason: null,
    });
    await writeJson(manifestPath, { requests: [] });

    registerManifestJob(runRoot, {
      phase: 'phase1',
      manifestPath,
      expectedArtifacts: [expectedArtifact],
      completionProbe: 'expected_artifacts_and_spawn_results',
      freshnessInputs: [freshnessInput],
      timeoutAt: '2099-01-01T00:00:00.000Z',
      retryPolicy: { owner: 'orchestrator', max_retries: 1 },
      nextAction: 'await_async_completion',
      nextActionReason: 'defects_analysis_refresh_pending',
      blockingReason: 'waiting_on_defects_analysis',
    });

    const [job] = loadJobs(runRoot);
    assert.deepEqual(job.expected_artifacts, [expectedArtifact]);
    assert.equal(job.completion_probe, 'expected_artifacts_and_spawn_results');
    assert.deepEqual(job.freshness_inputs, [freshnessInput]);
    assert.equal(job.timeout_at, '2099-01-01T00:00:00.000Z');
    assert.deepEqual(job.retry_policy, { owner: 'orchestrator', max_retries: 1 });

    await writeJson(expectedArtifact, { generated_at: '2026-03-25T00:00:00.000Z' });
    await new Promise((resolve) => setTimeout(resolve, 20));
    await writeJson(freshnessInput, { generated_at: '2026-03-25T00:00:01.000Z' });
    await writeJson(join(runRoot, 'spawn_results.json'), completedSpawnResults());

    const refreshedJobs = refreshJobs(runRoot, { phase: 'phase1' });
    const refreshed = refreshedJobs.find((entry) => entry.job_id === job.job_id);
    assert.notEqual(refreshed.status, 'completed');
  } finally {
    await rm(runRoot, { recursive: true, force: true });
  }
});

test('refreshJobs marks timed out jobs expired and surfaces operator action', async () => {
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-async-expired-'));
  const manifestPath = join(runRoot, 'phase4_spawn_manifest.json');

  try {
    await writeJson(join(runRoot, 'task.json'), {
      run_key: 'async-job-expired',
      overall_status: 'in_progress',
      current_phase: 'phase4',
      current_iteration: 1,
      next_action: 'await_async_completion',
      next_action_reason: 'benchmark_compare_pending',
      pending_job_ids: [],
      blocking_reason: null,
    });
    await writeJson(manifestPath, { requests: [] });

    registerManifestJob(runRoot, {
      phase: 'phase4',
      manifestPath,
      expectedArtifacts: [join(runRoot, 'benchmarks', 'compare.json')],
      completionProbe: 'expected_artifacts_and_spawn_results',
      freshnessInputs: [],
      timeoutAt: '2000-01-01T00:00:00.000Z',
      retryPolicy: { owner: 'operator', max_retries: 0 },
      nextAction: 'await_async_completion',
      nextActionReason: 'benchmark_compare_pending',
      blockingReason: 'waiting_on_benchmark_compare',
    });

    const refreshedJobs = refreshJobs(runRoot, { phase: 'phase4' });
    const refreshed = refreshedJobs.find((entry) => entry.phase === 'phase4');
    assert.equal(refreshed.status, 'expired');

    const task = JSON.parse(await readFile(join(runRoot, 'task.json'), 'utf8'));
    assert.equal(task.overall_status, 'blocked');
    assert.equal(task.next_action, 'operator_retry_required');
    assert.equal(task.blocking_reason, 'async_job_expired');
  } finally {
    await rm(runRoot, { recursive: true, force: true });
  }
});
