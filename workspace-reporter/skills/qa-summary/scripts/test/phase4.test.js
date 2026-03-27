import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runPhase4 } from '../lib/phase4.mjs';

async function makeRunDir(extraTask = {}) {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase4-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await writeFile(join(runDir, 'drafts', 'BCIN-7289_QA_SUMMARY_DRAFT.md'), '## 📊 QA Summary\n');
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({ feature_key: 'BCIN-7289', ...extraTask })
  );
  await writeFile(join(runDir, 'run.json'), JSON.stringify({}));
  return runDir;
}

// --- Pre-spawn ---

test('pre-spawn emits phase4_spawn_manifest.json with LLM subagent task and returns 0', async () => {
  const runDir = await makeRunDir({ overall_status: 'in_progress' });
  const code = await runPhase4('BCIN-7289', runDir);
  assert.equal(code, 0);
  const manifest = JSON.parse(await readFile(join(runDir, 'phase4_spawn_manifest.json'), 'utf8'));
  assert.equal(manifest.version, 1);
  assert.equal(manifest.source_kind, 'qa-summary-review');
  assert.ok(manifest.requests[0].openclaw.args.task.includes('BCIN-7289_QA_SUMMARY_DRAFT'));
});

test('pre-spawn prompt includes review rubric reference', async () => {
  const runDir = await makeRunDir({ overall_status: 'in_progress' });
  await runPhase4('BCIN-7289', runDir);
  const manifest = JSON.parse(await readFile(join(runDir, 'phase4_spawn_manifest.json'), 'utf8'));
  assert.match(manifest.requests[0].openclaw.args.task, /summary-review-rubric/);
});

// --- Awaiting approval: no feedback ---

test('re-renders draft and blocks without respawn when awaiting_approval with no input', async () => {
  const runDir = await makeRunDir({ overall_status: 'awaiting_approval', current_phase: 'phase4' });
  const code = await runPhase4('BCIN-7289', runDir);
  assert.equal(code, 2);
  const { existsSync } = await import('node:fs');
  assert.ok(!existsSync(join(runDir, 'phase4_spawn_manifest.json')));
});

// --- Awaiting approval: APPROVE ---

test('APPROVE advances task to approved and returns 0', async () => {
  const runDir = await makeRunDir({ overall_status: 'awaiting_approval', current_phase: 'phase4' });
  process.env.QA_SUMMARY_APPROVAL_DECISION = 'APPROVE';
  try {
    const code = await runPhase4('BCIN-7289', runDir);
    assert.equal(code, 0);
    const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
    assert.equal(task.overall_status, 'approved');
    assert.equal(task.review_status, 'pass');
    const run = JSON.parse(await readFile(join(runDir, 'run.json'), 'utf8'));
    assert.ok(run.review_approved_at);
  } finally {
    delete process.env.QA_SUMMARY_APPROVAL_DECISION;
  }
});

// --- Awaiting approval: revision feedback ---

test('revision feedback writes approval_feedback.json and emits draft-regen manifest', async () => {
  const runDir = await makeRunDir({ overall_status: 'awaiting_approval', current_phase: 'phase4' });
  process.env.QA_SUMMARY_APPROVAL_DECISION = 'Fix section 3 — add release recommendation';
  try {
    const code = await runPhase4('BCIN-7289', runDir);
    assert.equal(code, 0);

    const feedback = JSON.parse(
      await readFile(join(runDir, 'context', 'approval_feedback.json'), 'utf8')
    );
    assert.equal(feedback.decision, 'REVISION_REQUESTED');
    assert.match(feedback.feedback, /Fix section 3/);

    const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
    assert.equal(task.overall_status, 'review_in_progress');
    assert.equal(task.review_status, 'changes_requested');

    // Should emit a draft-regen spawn manifest
    const { existsSync } = await import('node:fs');
    assert.ok(existsSync(join(runDir, 'phase4_draft_regen_manifest.json')));
    const manifest = JSON.parse(
      await readFile(join(runDir, 'phase4_draft_regen_manifest.json'), 'utf8')
    );
    assert.equal(manifest.version, 1);
    assert.match(manifest.requests[0].openclaw.args.task, /approval_feedback/);
  } finally {
    delete process.env.QA_SUMMARY_APPROVAL_DECISION;
  }
});

// --- --post accept verdict ---

test('--post with accept verdict advances to awaiting_approval and returns 2 (pending approval)', async () => {
  const runDir = await makeRunDir({ overall_status: 'review_in_progress', current_phase: 'phase4' });
  await writeFile(join(runDir, 'context', 'phase4_review_delta.md'), '## Verdict\n\n- accept\n');
  const code = await runPhase4('BCIN-7289', runDir, '--post');
  assert.equal(code, 2);
  const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
  assert.equal(task.overall_status, 'awaiting_approval');
  assert.equal(task.review_status, 'pass');
  assert.equal(task.return_to_phase, null);
});

// --- --post return verdict retry ---

test('--post with return verdict re-emits manifest and increments phase4_round', async () => {
  const runDir = await makeRunDir({
    overall_status: 'review_in_progress',
    current_phase: 'phase4',
    phase4_round: 0,
  });
  await writeFile(
    join(runDir, 'context', 'phase4_review_delta.md'),
    '## Verdict\n\n- return phase4\n'
  );
  const code = await runPhase4('BCIN-7289', runDir, '--post');
  assert.equal(code, 0);
  const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
  assert.equal(task.phase4_round, 1);
  assert.equal(task.return_to_phase, 'phase4');
  const manifest = JSON.parse(await readFile(join(runDir, 'phase4_spawn_manifest.json'), 'utf8'));
  assert.match(manifest.requests[0].openclaw.args.task, /Round 2/);
});

// --- --post max rounds ---

test('--post blocks when phase4_round reaches MAX_ROUNDS (3)', async () => {
  const runDir = await makeRunDir({
    overall_status: 'review_in_progress',
    current_phase: 'phase4',
    phase4_round: 3,
  });
  await writeFile(
    join(runDir, 'context', 'phase4_review_delta.md'),
    '## Verdict\n\n- return phase4\n'
  );
  const code = await runPhase4('BCIN-7289', runDir, '--post');
  assert.equal(code, 2);
});

// --- --post missing delta ---

test('--post blocks when phase4_review_delta.md is missing', async () => {
  const runDir = await makeRunDir({ overall_status: 'review_in_progress' });
  const code = await runPhase4('BCIN-7289', runDir, '--post');
  assert.equal(code, 2);
});

// --- --post after draft-regen (changes_requested path) ---

test('--post re-enters review when review_status is changes_requested', async () => {
  const runDir = await makeRunDir({
    overall_status: 'review_in_progress',
    current_phase: 'phase4',
    review_status: 'changes_requested',
    phase4_round: 1,
  });
  const code = await runPhase4('BCIN-7289', runDir, '--post');
  assert.equal(code, 0);
  const manifest = JSON.parse(await readFile(join(runDir, 'phase4_spawn_manifest.json'), 'utf8'));
  assert.equal(manifest.version, 1);
  // round is reset to 0 then + 1 = 1 in emitReviewSpawn
  assert.match(manifest.requests[0].openclaw.args.task, /Round 1/);
});
