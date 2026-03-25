#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function writeJson(path, payload) {
  writeFileSync(path, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

function isoNow() {
  return new Date().toISOString();
}

export function jobsRoot(runRoot) {
  return join(runRoot, 'jobs');
}

export function ensureJobsRoot(runRoot) {
  mkdirSync(jobsRoot(runRoot), { recursive: true });
}

export function taskPath(runRoot) {
  return join(runRoot, 'task.json');
}

export function loadTask(runRoot) {
  return existsSync(taskPath(runRoot)) ? readJson(taskPath(runRoot)) : null;
}

export function saveTask(runRoot, task) {
  writeJson(taskPath(runRoot), task);
}

export function jobPath(runRoot, jobId) {
  return join(jobsRoot(runRoot), `${jobId}.json`);
}

export function loadJobs(runRoot) {
  const root = jobsRoot(runRoot);
  if (!existsSync(root)) {
    return [];
  }
  return readdirSync(root)
    .filter((name) => name.endsWith('.json'))
    .map((name) => readJson(join(root, name)))
    .sort((left, right) => String(left.created_at || '').localeCompare(String(right.created_at || '')));
}

export function pendingJobIds(jobs) {
  return jobs
    .filter((job) => ['queued', 'running', 'completed'].includes(job.status))
    .filter((job) => !job.post_applied_at)
    .map((job) => job.job_id);
}

function syncTaskSummary(runRoot, patch = {}) {
  const task = loadTask(runRoot);
  if (!task) {
    return null;
  }
  const jobs = loadJobs(runRoot);
  const pending = pendingJobIds(jobs);
  const next = {
    ...task,
    ...patch,
    pending_job_ids: pending,
    updated_at: isoNow(),
  };
  saveTask(runRoot, next);
  return next;
}

function jobIdForPhase(runRoot, phase) {
  const count = loadJobs(runRoot).filter((job) => job.phase === phase).length + 1;
  return `${phase}-${count}`;
}

function existingJobForManifest(runRoot, manifestPath) {
  return loadJobs(runRoot).find(
    (job) => resolve(job.manifest_path || '') === resolve(manifestPath) && !job.post_applied_at,
  ) ?? null;
}

export function registerManifestJob(
  runRoot,
  {
    phase,
    manifestPath,
    expectedArtifacts = [],
    completionProbe = 'spawn_results_only',
    freshnessInputs = [],
    timeoutAt = null,
    retryPolicy = { owner: 'orchestrator', max_retries: 1 },
    nextAction = 'await_async_completion',
    nextActionReason = 'spawn_manifest_emitted',
    blockingReason = 'waiting_on_async_job',
  },
) {
  ensureJobsRoot(runRoot);
  const existing = existingJobForManifest(runRoot, manifestPath);
  const job = existing ?? {
    job_id: jobIdForPhase(runRoot, phase),
    phase,
    job_type: 'spawn_manifest',
    status: 'queued',
    manifest_path: resolve(manifestPath),
    spawn_results_path: join(dirname(resolve(manifestPath)), 'spawn_results.json'),
    expected_artifacts: expectedArtifacts.map((path) => resolve(path)),
    completion_probe: completionProbe,
    freshness_inputs: freshnessInputs.map((path) => resolve(path)),
    success_marker: 'spawn_results_all_completed',
    timeout_at: timeoutAt,
    created_at: isoNow(),
    started_at: null,
    completed_at: null,
    post_applied_at: null,
    last_checked_at: null,
    retry_count: 0,
    retry_policy: retryPolicy,
    blocking_reason: blockingReason,
    failure_reason: null,
  };

  writeJson(jobPath(runRoot, job.job_id), job);
  syncTaskSummary(runRoot, {
    next_action: nextAction,
    next_action_reason: nextActionReason,
    blocking_reason: blockingReason,
  });
  return job;
}

function summarizeResultFailure(results = []) {
  const failed = results.find((result) => result.status !== 'completed' && result.status !== 'skipped');
  return failed ? (failed.stderr || `${failed.kind || 'job'} failed`) : null;
}

function allResultsComplete(results = []) {
  return results.length > 0 && results.every((result) => ['completed', 'skipped'].includes(result.status));
}

function fileMtimeMs(path) {
  return existsSync(path) ? statSync(path).mtimeMs : 0;
}

function isoToMs(value) {
  return value ? Date.parse(value) : 0;
}

function expectedArtifactsFresh(job) {
  const expectedArtifacts = Array.isArray(job.expected_artifacts) ? job.expected_artifacts : [];
  if (expectedArtifacts.length === 0) {
    return true;
  }
  if (expectedArtifacts.some((path) => !existsSync(path))) {
    return false;
  }
  const thresholdMs = Math.max(
    isoToMs(job.started_at),
    isoToMs(job.created_at),
    ...(job.freshness_inputs ?? []).map((path) => fileMtimeMs(path)),
  );
  return expectedArtifacts.every((path) => fileMtimeMs(path) >= thresholdMs);
}

function completionProbeSatisfied(job, results) {
  if (!allResultsComplete(results)) {
    return false;
  }
  if (job.completion_probe === 'spawn_results_only') {
    return true;
  }
  if (job.completion_probe === 'expected_artifacts_and_spawn_results') {
    return expectedArtifactsFresh(job);
  }
  return false;
}

function summarizeTaskStateFromJobs(task, jobs) {
  const failedJob = jobs.find((job) => job.status === 'failed');
  if (failedJob) {
    return {
      ...task,
      overall_status: 'blocked',
      next_action: 'operator_retry_required',
      next_action_reason: 'async_job_failed',
      blocking_reason: failedJob.failure_reason ?? failedJob.blocking_reason ?? 'async_job_failed',
    };
  }

  const expiredJob = jobs.find((job) => job.status === 'expired');
  if (expiredJob) {
    return {
      ...task,
      overall_status: 'blocked',
      next_action: 'operator_retry_required',
      next_action_reason: 'async_job_expired',
      blocking_reason: 'async_job_expired',
    };
  }

  return task;
}

export function refreshJobs(runRoot, { phase = null } = {}) {
  ensureJobsRoot(runRoot);
  const jobs = loadJobs(runRoot).map((job) => {
    if (phase && job.phase !== phase) {
      return job;
    }
    if (!['queued', 'running', 'completed'].includes(job.status) || job.post_applied_at) {
      return job;
    }
    const next = { ...job, last_checked_at: isoNow() };
    const timeoutMs = isoToMs(next.timeout_at);
    if (timeoutMs && Date.now() > timeoutMs) {
      next.status = 'expired';
      next.failure_reason = next.failure_reason ?? 'async_job_expired';
      writeJson(jobPath(runRoot, next.job_id), next);
      return next;
    }
    if (existsSync(next.spawn_results_path)) {
      const results = readJson(next.spawn_results_path).results ?? [];
      const failureReason = summarizeResultFailure(results);
      if (failureReason) {
        next.status = 'failed';
        next.failure_reason = failureReason;
      } else if (completionProbeSatisfied(next, results)) {
        next.status = 'completed';
        next.completed_at = next.completed_at ?? isoNow();
      } else {
        next.status = 'running';
        next.started_at = next.started_at ?? isoNow();
      }
    }
    writeJson(jobPath(runRoot, next.job_id), next);
    return next;
  });

  const task = loadTask(runRoot);
  if (task) {
    const nextTask = summarizeTaskStateFromJobs(task, jobs);
    syncTaskSummary(runRoot, {
      overall_status: nextTask.overall_status,
      next_action: nextTask.next_action,
      next_action_reason: nextTask.next_action_reason,
      blocking_reason: nextTask.blocking_reason ?? null,
    });
  }
  return jobs;
}

export function markPhaseJobsPostApplied(runRoot, phase) {
  const jobs = loadJobs(runRoot);
  for (const job of jobs) {
    if (job.phase !== phase || job.status !== 'completed' || job.post_applied_at) {
      continue;
    }
    const next = { ...job, post_applied_at: isoNow() };
    writeJson(jobPath(runRoot, next.job_id), next);
  }
  syncTaskSummary(runRoot, {
    blocking_reason: null,
  });
}

export function renderSummary(runRoot) {
  const task = loadTask(runRoot);
  const jobs = loadJobs(runRoot);
  return {
    task: task
      ? {
          run_key: task.run_key,
          report_state: task.report_state ?? null,
          overall_status: task.overall_status,
          current_phase: task.current_phase,
          current_iteration: task.current_iteration,
          next_action: task.next_action,
          next_action_reason: task.next_action_reason,
          pending_job_ids: task.pending_job_ids ?? [],
          blocking_reason: task.blocking_reason ?? null,
          runtime_root_mode: task.runtime_root_mode ?? null,
          canonical_run_root: task.canonical_run_root ?? null,
          scratch_run_root: task.scratch_run_root ?? null,
        }
      : null,
    jobs: jobs.map((job) => ({
      job_id: job.job_id,
      phase: job.phase,
      status: job.status,
      manifest: basename(job.manifest_path || ''),
      expected_artifacts: job.expected_artifacts ?? [],
      post_applied_at: job.post_applied_at ?? null,
      failure_reason: job.failure_reason ?? null,
    })),
  };
}

export function nextPostPhase(runRoot, { phase = null } = {}) {
  const jobs = refreshJobs(runRoot, { phase });
  const completed = jobs.find(
    (job) =>
      (!phase || job.phase === phase)
      && job.status === 'completed'
      && !job.post_applied_at,
  );
  return completed ? { phase: completed.phase, job_id: completed.job_id } : { phase: null, job_id: null };
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) {
      continue;
    }
    const key = arg.slice(2).replace(/-/g, '_');
    const next = argv[i + 1];
    if (next == null || next.startsWith('--')) {
      out[key] = true;
    } else {
      out[key] = next;
      i += 1;
    }
  }
  return out;
}

function main(argv = process.argv.slice(2)) {
  const [command, ...rest] = argv;
  const args = parseArgs(rest);
  const runRoot = args.run_root ? resolve(args.run_root) : null;
  if (!command || !runRoot) {
    throw new Error('Usage: asyncJobStore.mjs <command> --run-root <path> [...]');
  }

  if (command === 'summary') {
    console.log(JSON.stringify(renderSummary(runRoot), null, 2));
    return;
  }

  if (command === 'refresh') {
    refreshJobs(runRoot, { phase: args.phase ?? null });
    console.log(JSON.stringify(renderSummary(runRoot), null, 2));
    return;
  }

  if (command === 'next-post') {
    console.log(JSON.stringify(nextPostPhase(runRoot, { phase: args.phase ?? null }), null, 2));
    return;
  }

  throw new Error(`Unsupported command: ${command}`);
}

const currentPath = fileURLToPath(import.meta.url);
const executedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (currentPath === executedPath) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
