import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const REPO_ROOT = join(fileURLToPath(new URL('../../../../../', import.meta.url)));
const CHECK_RESUME = join(
  REPO_ROOT,
  '.agents/skills/qa-plan-evolution/scripts/check_resume.sh',
);
const PHASE0 = join(
  REPO_ROOT,
  '.agents/skills/qa-plan-evolution/scripts/phase0.sh',
);
const PROGRESS = join(
  REPO_ROOT,
  '.agents/skills/qa-plan-evolution/scripts/progress.sh',
);
const FIXTURE = '.agents/skills/qa-plan-evolution/scripts/test/fixtures/minimal-target-skill';

async function writeJson(path, payload) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

test('check_resume renders the operator summary from canonical task state', async () => {
  const runKey = 'check-resume-summary';
  const canonicalRunRoot = join(
    REPO_ROOT,
    '.agents',
    'skills',
    'qa-plan-evolution',
    'runs',
    runKey,
  );

  try {
    await mkdir(canonicalRunRoot, { recursive: true });
    await writeJson(join(canonicalRunRoot, 'task.json'), {
      run_key: runKey,
      report_state: 'DRAFT_EXISTS',
      overall_status: 'blocked',
      current_phase: 'phase1',
      current_iteration: 2,
      next_action: 'await_async_completion',
      next_action_reason: 'awaiting_async_prerequisite',
      pending_job_ids: ['job-1'],
      blocking_reason: 'waiting_on_defects_analysis',
      canonical_run_root: canonicalRunRoot,
      scratch_run_root: null,
      runtime_root_mode: 'canonical_only',
    });

    const result = spawnSync('bash', [
      CHECK_RESUME,
      '--run-key', runKey,
    ], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /resume possible/i);
    assert.match(result.stdout, /last completed phase: phase0/);
    assert.match(
      result.stdout,
      /next required command: \.\/\.agents\/skills\/qa-plan-evolution\/scripts\/orchestrate\.sh --run-key "check-resume-summary"/,
    );
    assert.match(result.stdout, /"next_action": "await_async_completion"/);
    assert.match(result.stdout, /"pending_job_ids": \[/);
    assert.match(result.stdout, /"blocking_reason": "waiting_on_defects_analysis"/);
    assert.match(result.stdout, /"runtime_root_mode": "canonical_only"/);
  } finally {
    await rm(canonicalRunRoot, { recursive: true, force: true });
  }
});

test('check_resume and progress render the same operator summary contract', async () => {
  const runKey = 'check-resume-progress-contract';
  const canonicalRunRoot = join(
    REPO_ROOT,
    '.agents',
    'skills',
    'qa-plan-evolution',
    'runs',
    runKey,
  );

  function extractJson(text) {
    return JSON.parse(text.slice(text.indexOf('{')));
  }

  try {
    await mkdir(join(canonicalRunRoot, 'jobs'), { recursive: true });
    await writeJson(join(canonicalRunRoot, 'task.json'), {
      run_key: runKey,
      report_state: 'DRAFT_EXISTS',
      overall_status: 'blocked',
      current_phase: 'phase1',
      current_iteration: 2,
      next_action: 'await_async_completion',
      next_action_reason: 'awaiting_async_prerequisite',
      pending_job_ids: ['job-1'],
      blocking_reason: 'waiting_on_defects_analysis',
      canonical_run_root: canonicalRunRoot,
      scratch_run_root: null,
      runtime_root_mode: 'canonical_only',
    });
    await writeJson(join(canonicalRunRoot, 'jobs', 'job-1.json'), {
      job_id: 'job-1',
      phase: 'phase1',
      status: 'running',
      manifest_path: '/tmp/phase1.json',
      post_applied_at: null,
      failure_reason: null,
    });

    const resumeResult = spawnSync('bash', [
      CHECK_RESUME,
      '--run-key', runKey,
    ], {
      encoding: 'utf8',
    });
    const progressResult = spawnSync('bash', [
      PROGRESS,
      '--run-key', runKey,
    ], {
      encoding: 'utf8',
    });

    assert.equal(resumeResult.status, 0, resumeResult.stderr);
    assert.equal(progressResult.status, 0, progressResult.stderr);
    assert.deepEqual(extractJson(resumeResult.stdout), extractJson(progressResult.stdout));
  } finally {
    await rm(canonicalRunRoot, { recursive: true, force: true });
  }
});

test('check_resume refreshes pending jobs before rendering the summary', async () => {
  const runKey = 'check-resume-refresh';
  const canonicalRunRoot = join(
    REPO_ROOT,
    '.agents',
    'skills',
    'qa-plan-evolution',
    'runs',
    runKey,
  );

  try {
    await mkdir(join(canonicalRunRoot, 'jobs'), { recursive: true });
    await writeJson(join(canonicalRunRoot, 'task.json'), {
      run_key: runKey,
      report_state: 'DRAFT_EXISTS',
      overall_status: 'in_progress',
      current_phase: 'phase1',
      current_iteration: 1,
      next_action: 'await_async_completion',
      next_action_reason: 'awaiting_async_prerequisite',
      pending_job_ids: ['job-1'],
      blocking_reason: 'waiting_on_defects_analysis',
      canonical_run_root: canonicalRunRoot,
      scratch_run_root: null,
      runtime_root_mode: 'canonical_only',
    });
    await writeJson(join(canonicalRunRoot, 'jobs', 'job-1.json'), {
      job_id: 'job-1',
      phase: 'phase1',
      job_type: 'spawn_manifest',
      status: 'running',
      manifest_path: join(canonicalRunRoot, 'phase1_spawn_manifest.json'),
      spawn_results_path: join(canonicalRunRoot, 'spawn_results.json'),
      expected_artifacts: [join(canonicalRunRoot, 'context', 'gap_bundle.json')],
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
    await writeJson(join(canonicalRunRoot, 'spawn_results.json'), {
      results: [{ kind: 'local_command', status: 'completed', stderr: '' }],
    });
    await writeJson(join(canonicalRunRoot, 'context', 'gap_bundle.json'), { ok: true });

    const result = spawnSync('bash', [
      CHECK_RESUME,
      '--run-key', runKey,
    ], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /"status": "completed"/);
  } finally {
    await rm(canonicalRunRoot, { recursive: true, force: true });
  }
});

test('check_resume still resolves canonical state after scratch alias deletion', async () => {
  const runKey = 'check-resume-scratch-deleted';
  const overrideRunRoot = await mkdtemp(join(tmpdir(), 'seo-check-resume-scratch-'));
  const canonicalRunRoot = join(
    REPO_ROOT,
    '.agents',
    'skills',
    'qa-plan-evolution',
    'runs',
    runKey,
  );

  try {
    const phase0Result = spawnSync('bash', [
      PHASE0,
      '--run-key', runKey,
      '--run-root', overrideRunRoot,
      '--repo-root', REPO_ROOT,
      '--target-skill-path', FIXTURE,
      '--target-skill-name', 'minimal-fixture',
      '--benchmark-profile', 'generic-skill-regression',
    ], {
      encoding: 'utf8',
    });
    assert.equal(phase0Result.status, 0, phase0Result.stderr);

    await rm(overrideRunRoot, { recursive: true, force: true });

    const result = spawnSync('bash', [
      CHECK_RESUME,
      '--run-key', runKey,
    ], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /resume possible/i);
    assert.match(result.stdout, new RegExp(`"canonical_run_root": "${canonicalRunRoot.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`));
    assert.doesNotMatch(result.stdout, /no task\.json: fresh run/i);
  } finally {
    await rm(overrideRunRoot, { recursive: true, force: true });
    await rm(canonicalRunRoot, { recursive: true, force: true });
  }
});
