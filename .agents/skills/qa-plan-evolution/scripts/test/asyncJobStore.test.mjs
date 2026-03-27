import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';

import {
  defaultSpawnResultsPathForManifest,
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
    assert.equal(job.spawn_results_path, defaultSpawnResultsPathForManifest(manifestPath));

    await writeJson(expectedArtifact, { generated_at: '2026-03-25T00:00:00.000Z' });
    await new Promise((resolve) => setTimeout(resolve, 20));
    await writeJson(freshnessInput, { generated_at: '2026-03-25T00:00:01.000Z' });
    await writeJson(job.spawn_results_path, completedSpawnResults());

    const refreshedJobs = refreshJobs(runRoot, { phase: 'phase1' });
    const refreshed = refreshedJobs.find((entry) => entry.job_id === job.job_id);
    assert.notEqual(refreshed.status, 'completed');
  } finally {
    await rm(runRoot, { recursive: true, force: true });
  }
});

test('phase-scoped manifest jobs do not inherit sibling spawn result failures', async () => {
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-async-job-phase-scope-'));
  const iterDir = join(runRoot, 'candidates', 'iteration-1');
  const phase3ManifestPath = join(iterDir, 'phase3_spawn_manifest.json');
  const phase4ManifestPath = join(iterDir, 'phase4_spawn_manifest.json');
  const phase3Artifact = join(iterDir, 'candidate_worker_output.md');
  const phase4Artifact = join(iterDir, 'benchmark_compare_result.json');
  const phase4FreshnessInput = join(iterDir, 'validation_precheck.json');

  try {
    await writeJson(join(runRoot, 'task.json'), {
      run_key: 'async-job-phase-scope',
      overall_status: 'in_progress',
      current_phase: 'phase4',
      current_iteration: 1,
      next_action: 'await_async_completion',
      next_action_reason: 'benchmark_compare_pending',
      pending_job_ids: [],
      blocking_reason: null,
    });
    await writeJson(phase3ManifestPath, { requests: [] });
    await writeJson(phase4ManifestPath, { requests: [] });

    registerManifestJob(runRoot, {
      phase: 'phase3',
      manifestPath: phase3ManifestPath,
      expectedArtifacts: [phase3Artifact],
      completionProbe: 'expected_artifacts_and_spawn_results',
      freshnessInputs: [],
      timeoutAt: '2099-01-01T00:00:00.000Z',
      retryPolicy: { owner: 'orchestrator', max_retries: 1 },
      nextAction: 'await_async_completion',
      nextActionReason: 'candidate_patch_pending',
      blockingReason: 'waiting_on_candidate_patch',
    });
    registerManifestJob(runRoot, {
      phase: 'phase4',
      manifestPath: phase4ManifestPath,
      expectedArtifacts: [phase4Artifact],
      completionProbe: 'expected_artifacts_and_spawn_results',
      freshnessInputs: [phase4FreshnessInput],
      timeoutAt: '2099-01-01T00:00:00.000Z',
      retryPolicy: { owner: 'orchestrator', max_retries: 1 },
      nextAction: 'await_async_completion',
      nextActionReason: 'benchmark_compare_pending',
      blockingReason: 'waiting_on_benchmark_compare',
    });

    const jobs = loadJobs(runRoot);
    const phase3Job = jobs.find((entry) => entry.phase === 'phase3');
    const phase4Job = jobs.find((entry) => entry.phase === 'phase4');
    assert.equal(phase3Job.spawn_results_path, defaultSpawnResultsPathForManifest(phase3ManifestPath));
    assert.equal(phase4Job.spawn_results_path, defaultSpawnResultsPathForManifest(phase4ManifestPath));
    assert.notEqual(phase3Job.spawn_results_path, phase4Job.spawn_results_path);

    await writeJson(phase3Job.spawn_results_path, {
      results: [{ kind: 'openclaw', status: 'failed', stderr: 'phase3 failed' }],
    });

    const afterPhase4Refresh = refreshJobs(runRoot, { phase: 'phase4' });
    const refreshedPhase4 = afterPhase4Refresh.find((entry) => entry.phase === 'phase4');
    assert.equal(refreshedPhase4.status, 'queued');
    assert.equal(refreshedPhase4.failure_reason, null);

    await writeJson(phase4FreshnessInput, { ok: true });
    await new Promise((resolve) => setTimeout(resolve, 20));
    await writeJson(phase4Artifact, { ok: true });
    await writeJson(phase4Job.spawn_results_path, completedSpawnResults());

    const completedJobs = refreshJobs(runRoot, { phase: 'phase4' });
    const completedPhase4 = completedJobs.find((entry) => entry.phase === 'phase4');
    assert.equal(completedPhase4.status, 'completed');
    assert.match(completedPhase4.spawn_results_path, /phase4_spawn_results\.json$/);
  } finally {
    await rm(runRoot, { recursive: true, force: true });
  }
});

test('legacy jobs resume when the runner writes to the new manifest-derived results path', async () => {
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-async-job-legacy-resume-'));
  const manifestPath = join(runRoot, 'candidates', 'iteration-1', 'phase4_spawn_manifest.json');
  const legacyResultsPath = join(runRoot, 'candidates', 'iteration-1', 'spawn_results.json');
  const expectedArtifact = join(runRoot, 'candidates', 'iteration-1', 'benchmark_compare_result.json');
  const freshnessInput = join(runRoot, 'candidates', 'iteration-1', 'validation_precheck.json');

  try {
    await writeJson(join(runRoot, 'task.json'), {
      run_key: 'async-job-legacy-resume',
      overall_status: 'in_progress',
      current_phase: 'phase4',
      current_iteration: 1,
      next_action: 'await_async_completion',
      next_action_reason: 'benchmark_compare_pending',
      pending_job_ids: ['phase4-1'],
      blocking_reason: 'waiting_on_benchmark_compare',
    });
    await writeJson(manifestPath, { requests: [] });
    await writeJson(join(runRoot, 'jobs', 'phase4-1.json'), {
      job_id: 'phase4-1',
      phase: 'phase4',
      job_type: 'spawn_manifest',
      status: 'running',
      manifest_path: manifestPath,
      spawn_results_path: legacyResultsPath,
      expected_artifacts: [expectedArtifact],
      completion_probe: 'expected_artifacts_and_spawn_results',
      freshness_inputs: [freshnessInput],
      success_marker: 'spawn_results_all_completed',
      timeout_at: '2099-01-01T00:00:00.000Z',
      retry_count: 0,
      retry_policy: { owner: 'orchestrator', max_retries: 1 },
      blocking_reason: 'waiting_on_benchmark_compare',
      created_at: '2026-03-25T00:00:00.000Z',
      started_at: '2026-03-25T00:00:00.000Z',
      completed_at: null,
      last_checked_at: null,
      post_applied_at: null,
      failure_reason: null,
    });

    await writeJson(freshnessInput, { ok: true });
    await new Promise((resolve) => setTimeout(resolve, 20));
    await writeJson(defaultSpawnResultsPathForManifest(manifestPath), completedSpawnResults());
    await writeJson(expectedArtifact, { ok: true });

    const refreshedJobs = refreshJobs(runRoot, { phase: 'phase4' });
    const refreshed = refreshedJobs.find((entry) => entry.job_id === 'phase4-1');
    assert.equal(refreshed.status, 'completed');
    assert.equal(refreshed.spawn_results_path, defaultSpawnResultsPathForManifest(manifestPath));
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
