import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runPhase4 } from '../lib/phase4.mjs';

test('emits review manifest before review post-processing', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase4-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await writeFile(join(runDir, 'drafts', 'BCIN-7289_QA_SUMMARY_DRAFT.md'), '# Draft');
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      overall_status: 'in_progress',
      current_phase: 'phase3',
    })
  );
  const code = await runPhase4('BCIN-7289', runDir);
  assert.equal(code, 0);
  const manifest = JSON.parse(
    await readFile(join(runDir, 'phase4_spawn_manifest.json'), 'utf8')
  );
  assert.equal(manifest.phase, 'phase4');
  assert.match(manifest.requests[0].openclaw.args.join(' '), /drafts\/BCIN-7289_QA_SUMMARY_DRAFT/);
});

test('re-renders draft and blocks without respawn when awaiting_approval', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase4-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await writeFile(join(runDir, 'drafts', 'BCIN-7289_QA_SUMMARY_DRAFT.md'), '# Reviewed Draft');
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      overall_status: 'awaiting_approval',
      current_phase: 'phase4',
    })
  );
  const code = await runPhase4('BCIN-7289', runDir);
  assert.equal(code, 2);
  const { existsSync } = await import('node:fs');
  assert.ok(!existsSync(join(runDir, 'phase4_spawn_manifest.json')));
});

test('accepts APPROVE input and advances task to approved without respawn', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase4-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await writeFile(join(runDir, 'drafts', 'BCIN-7289_QA_SUMMARY_DRAFT.md'), '# Reviewed Draft');
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      overall_status: 'awaiting_approval',
      current_phase: 'phase4',
    })
  );
  await writeFile(join(runDir, 'run.json'), JSON.stringify({ notification_pending: null }));

  process.env.QA_SUMMARY_APPROVAL_DECISION = 'APPROVE';
  try {
    const code = await runPhase4('BCIN-7289', runDir);
    assert.equal(code, 0);

    const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
    assert.equal(task.overall_status, 'approved');
    assert.equal(task.current_phase, 'phase4');

    const run = JSON.parse(await readFile(join(runDir, 'run.json'), 'utf8'));
    assert.ok(run.review_approved_at);

    const { existsSync } = await import('node:fs');
    assert.ok(!existsSync(join(runDir, 'phase4_spawn_manifest.json')));
  } finally {
    delete process.env.QA_SUMMARY_APPROVAL_DECISION;
  }
});

test('persists revision feedback and re-enters the phase4 review loop', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase4-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await writeFile(
    join(runDir, 'drafts', 'BCIN-7289_QA_SUMMARY_DRAFT.md'),
    '# Original reviewed draft'
  );
  await writeFile(
    join(runDir, 'context', 'planner_artifact_lookup.json'),
    JSON.stringify({})
  );
  await writeFile(join(runDir, 'context', 'planner_summary_seed.md'), '');
  await writeFile(
    join(runDir, 'context', 'feature_overview_table.md'),
    [
      '### 1. Feature Overview',
      '| Field | Value |',
      '| --- | --- |',
      '| Feature | BCIN-7289 |',
    ].join('\n')
  );
  await writeFile(
    join(runDir, 'context', 'no_defects.json'),
    JSON.stringify({
      totalDefects: 0,
      openDefects: 0,
      resolvedDefects: 0,
      noDefectsFound: true,
      defects: [],
      prs: [],
    })
  );
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      overall_status: 'awaiting_approval',
      current_phase: 'phase4',
    })
  );
  await writeFile(join(runDir, 'run.json'), JSON.stringify({}));
  await writeFile(
    join(runDir, 'context', 'review_result.json'),
    JSON.stringify({
      verdict: 'pass',
      requiresRefactor: false,
    })
  );

  process.env.QA_SUMMARY_APPROVAL_DECISION =
    'Add missing PR https://github.com/org/release/pull/88. Risk should be HIGH. Hold release until the rollout note is updated.';
  try {
    const code = await runPhase4('BCIN-7289', runDir);
    assert.equal(code, 0);

    const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
    assert.equal(task.overall_status, 'review_in_progress');
    assert.equal(task.review_status, 'changes_requested');

    const feedback = JSON.parse(
      await readFile(join(runDir, 'context', 'approval_feedback.json'), 'utf8')
    );
    assert.equal(
      feedback.feedback,
      'Add missing PR https://github.com/org/release/pull/88. Risk should be HIGH. Hold release until the rollout note is updated.'
    );

    const reviewResult = JSON.parse(
      await readFile(join(runDir, 'context', 'review_result.json'), 'utf8')
    );
    assert.equal(reviewResult.verdict, 'fail');
    assert.equal(reviewResult.requiresRefactor, true);

    const draft = await readFile(join(runDir, 'drafts', 'BCIN-7289_QA_SUMMARY_DRAFT.md'), 'utf8');
    assert.doesNotMatch(draft, /Original reviewed draft/);
    assert.match(draft, /\[#88\]\(https:\/\/github\.com\/org\/release\/pull\/88\)/);
    assert.match(draft, /Overall risk: HIGH/);
    assert.match(draft, /Approval feedback addressed:/);

    const manifest = JSON.parse(
      await readFile(join(runDir, 'phase4_spawn_manifest.json'), 'utf8')
    );
    assert.equal(manifest.phase, 'phase4');
    assert.match(manifest.requests[0].openclaw.args.join(' '), /--approval-feedback context\/approval_feedback\.json/);
  } finally {
    delete process.env.QA_SUMMARY_APPROVAL_DECISION;
  }
});

test('blocks post-processing until qa-summary-review overwrites approval feedback result', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase4-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await writeFile(join(runDir, 'drafts', 'BCIN-7289_QA_SUMMARY_DRAFT.md'), '# Reviewed Draft');
  await writeFile(
    join(runDir, 'context', 'review_result.json'),
    JSON.stringify({
      verdict: 'fail',
      requiresRefactor: true,
      source: 'approval_feedback',
      reviewOutputPath: 'BCIN-7289_QA_SUMMARY_APPROVAL_FEEDBACK.md',
    })
  );
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      overall_status: 'review_in_progress',
      current_phase: 'phase4',
    })
  );

  const code = await runPhase4('BCIN-7289', runDir, '--post');
  assert.equal(code, 2);
});

test('applies reviewer updatedDraftPath before awaiting approval on pass', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase4-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await writeFile(join(runDir, 'drafts', 'BCIN-7289_QA_SUMMARY_DRAFT.md'), '# Original Draft');
  await writeFile(join(runDir, 'context', 'review_result.json'), JSON.stringify({
    verdict: 'pass',
    updatedDraftPath: 'context/reviewed_draft.md',
  }));
  await writeFile(join(runDir, 'context', 'reviewed_draft.md'), '# Reviewed Draft');
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      overall_status: 'review_in_progress',
      current_phase: 'phase4',
    })
  );
  await writeFile(join(runDir, 'run.json'), JSON.stringify({}));

  const code = await runPhase4('BCIN-7289', runDir, '--post');
  assert.equal(code, 2);

  const draft = await readFile(join(runDir, 'drafts', 'BCIN-7289_QA_SUMMARY_DRAFT.md'), 'utf8');
  assert.equal(draft, '# Reviewed Draft');

  const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
  assert.equal(task.overall_status, 'awaiting_approval');
  assert.equal(task.review_status, 'pass');
});

test('does not overwrite draft with review report when updatedDraftPath is missing', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase4-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await writeFile(join(runDir, 'drafts', 'BCIN-7289_QA_SUMMARY_DRAFT.md'), '# Reviewed Draft');
  await writeFile(
    join(runDir, 'context', 'review_result.json'),
    JSON.stringify({
      verdict: 'pass',
      reviewOutputPath: 'BCIN-7289_QA_SUMMARY_REVIEW.md',
    })
  );
  await writeFile(join(runDir, 'BCIN-7289_QA_SUMMARY_REVIEW.md'), '# Review Checklist');
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      overall_status: 'review_in_progress',
      current_phase: 'phase4',
    })
  );
  await writeFile(join(runDir, 'run.json'), JSON.stringify({}));

  const code = await runPhase4('BCIN-7289', runDir, '--post');
  assert.equal(code, 2);

  const draft = await readFile(join(runDir, 'drafts', 'BCIN-7289_QA_SUMMARY_DRAFT.md'), 'utf8');
  assert.equal(draft, '# Reviewed Draft');
});

test('applies a refactor pass before re-queueing review when requiresRefactor is true', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase4-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await writeFile(
    join(runDir, 'drafts', 'BCIN-7289_QA_SUMMARY_DRAFT.md'),
    [
      '## 📊 QA Summary',
      '',
      '### 1. Feature Overview',
      '- Missing required table',
      '',
      '### 2. Code Changes Summary',
      '| Repository | PR | Type | Defects Fixed | Risk Level | Notes |',
      '| --- | --- | --- | --- | --- | --- |',
      '| repo | #1 | Feature PR | — | LOW | ok |',
      '',
      '### 3. Overall QA Status',
      '- Overall risk: LOW',
    ].join('\n')
  );
  await writeFile(
    join(runDir, 'context', 'review_result.json'),
    JSON.stringify({
      verdict: 'fail',
      requiresRefactor: true,
      reviewOutputPath: 'BCIN-7289_QA_SUMMARY_REVIEW.md',
    })
  );
  await writeFile(
    join(runDir, 'BCIN-7289_QA_SUMMARY_REVIEW.md'),
    [
      '# QA Summary Review — BCIN-7289',
      '',
      '**Verdict:** FAIL',
      '',
      '## Formatting Checklist',
      '- [ ] F3 — Table usage compliant',
      '',
      '## Required Fixes',
      '- ⚠️ Section 1 is missing the required table.',
    ].join('\n')
  );
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      overall_status: 'review_in_progress',
      current_phase: 'phase4',
    })
  );

  const code = await runPhase4('BCIN-7289', runDir, '--post');
  assert.equal(code, 0);

  const draft = await readFile(join(runDir, 'drafts', 'BCIN-7289_QA_SUMMARY_DRAFT.md'), 'utf8');
  assert.match(draft, /### 1\. Feature Overview\n\| Field \| Value \|/);

  const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
  assert.equal(task.overall_status, 'review_in_progress');
  assert.equal(task.current_phase, 'phase4');

  const manifest = JSON.parse(
    await readFile(join(runDir, 'phase4_spawn_manifest.json'), 'utf8')
  );
  assert.equal(manifest.phase, 'phase4');
});
