#!/usr/bin/env node
/**
 * Phase 4: qa-summary-review gate and approval.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join, normalize } from 'node:path';
import { applyReviewRefactor } from './applyReviewRefactor.mjs';
import { generateSummaryDraftArtifacts } from './generateSummaryDraftArtifacts.mjs';

async function readJson(path, fallback = null) {
  try {
    const raw = await readFile(path, 'utf8');
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function approvalInput() {
  const rawDecision = String(process.env.QA_SUMMARY_APPROVAL_DECISION || '').trim();
  const feedback = String(process.env.QA_SUMMARY_APPROVAL_FEEDBACK || '').trim();
  const normalizedDecision = rawDecision.toUpperCase();
  const defaultFeedback =
    ['REJECT', 'REVISE', 'CHANGES_REQUESTED', 'CHANGES REQUESTED'].includes(normalizedDecision)
      ? 'Reviewer requested revisions at the approval gate.'
      : rawDecision;
  return {
    decision: normalizedDecision,
    feedback: feedback || (rawDecision && normalizedDecision !== 'APPROVE' ? defaultFeedback : ''),
  };
}

async function renderDraft(featureKey, runDir) {
  const draftPath = join(runDir, 'drafts', `${featureKey}_QA_SUMMARY_DRAFT.md`);
  try {
    const content = await readFile(draftPath, 'utf8');
    console.log(content);
  } catch {
    /* ignore */
  }
}

function normalizeRunRelativePath(relativePath) {
  if (typeof relativePath !== 'string') return null;
  const trimmed = relativePath.trim();
  if (!trimmed || trimmed.startsWith('/')) return null;
  const normalized = normalize(trimmed);
  if (normalized === '..' || normalized.startsWith('../')) return null;
  return normalized;
}

function isReviewArtifactPath(featureKey, relativePath, reviewResult = {}) {
  const normalized = normalizeRunRelativePath(relativePath);
  const reviewOutputPath = normalizeRunRelativePath(reviewResult.reviewOutputPath);
  const defaultReviewPath = `${featureKey}_QA_SUMMARY_REVIEW.md`;
  return (
    normalized === reviewOutputPath ||
    normalized === defaultReviewPath ||
    normalized?.endsWith('_QA_SUMMARY_REVIEW.md')
  );
}

async function syncReviewedDraft(featureKey, runDir, reviewResult = {}) {
  const draftPath = join(runDir, 'drafts', `${featureKey}_QA_SUMMARY_DRAFT.md`);
  const updatedDraftPath = normalizeRunRelativePath(reviewResult.updatedDraftPath);

  if (reviewResult.updatedDraftPath && !updatedDraftPath) {
    return {
      ok: false,
      message: 'BLOCKED: review_result.json updatedDraftPath must be a safe run-dir-relative path.',
    };
  }

  if (isReviewArtifactPath(featureKey, updatedDraftPath, reviewResult)) {
    return {
      ok: false,
      message: 'BLOCKED: review_result.json updatedDraftPath points to the review report, not the reviewed draft.',
    };
  }

  if (updatedDraftPath) {
    try {
      const reviewedContent = await readFile(join(runDir, updatedDraftPath), 'utf8');
      await writeFile(draftPath, reviewedContent, 'utf8');
      return { ok: true };
    } catch {
      return {
        ok: false,
        message: `BLOCKED: Reviewed draft is not readable at ${updatedDraftPath}.`,
      };
    }
  }

  try {
    await readFile(draftPath, 'utf8');
    return { ok: true };
  } catch {
    return {
      ok: false,
      message: `BLOCKED: Missing reviewed draft at drafts/${featureKey}_QA_SUMMARY_DRAFT.md.`,
    };
  }
}

function resolveReviewPath(featureKey, runDir, reviewResult = {}) {
  const relativePath = normalizeRunRelativePath(reviewResult.reviewOutputPath);
  if (reviewResult.reviewOutputPath && !relativePath) {
    return {
      ok: false,
      message: 'BLOCKED: review_result.json reviewOutputPath must be a safe run-dir-relative path.',
    };
  }
  return {
    ok: true,
    path: join(runDir, relativePath || `${featureKey}_QA_SUMMARY_REVIEW.md`),
  };
}

async function markApproved(taskPath, runPath, task) {
  const ts = new Date().toISOString();
  task.overall_status = 'approved';
  task.current_phase = 'phase4';
  task.review_status = 'pass';
  task.updated_at = ts;
  await writeFile(taskPath, `${JSON.stringify(task, null, 2)}\n`, 'utf8');

  const run = (await readJson(runPath, {})) ?? {};
  run.review_approved_at = ts;
  run.updated_at = ts;
  await writeFile(runPath, `${JSON.stringify(run, null, 2)}\n`, 'utf8');
}

function buildPhase4Manifest(featureKey, approvalFeedbackPath = null) {
  const args = [
    '--skill',
    'qa-summary-review',
    '--feature-key',
    featureKey,
    '--draft',
    `drafts/${featureKey}_QA_SUMMARY_DRAFT.md`,
  ];
  if (approvalFeedbackPath) {
    args.push('--approval-feedback', approvalFeedbackPath);
  }

  return {
    version: 1,
    phase: 'phase4',
    requests: [
      {
        kind: 'qa-summary-review',
        feature_key: featureKey,
        openclaw: {
          args,
        },
      },
    ],
  };
}

function feedbackLines(feedback) {
  return feedback
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => (line.startsWith('- ') ? line : `- ${line}`));
}

async function persistApprovalFeedbackArtifacts({ featureKey, runDir, feedback, feedbackPath, ts }) {
  const approvalFeedback = {
    decision: 'REVISION_REQUESTED',
    feedback,
    recorded_at: ts,
  };

  await writeFile(
    join(runDir, 'context', 'approval_feedback.json'),
    `${JSON.stringify(approvalFeedback, null, 2)}\n`,
    'utf8'
  );
  await writeFile(
    join(runDir, 'context', 'review_result.json'),
    `${JSON.stringify({
      verdict: 'fail',
      requiresRefactor: true,
      source: 'approval_feedback',
      reviewOutputPath: `${featureKey}_QA_SUMMARY_APPROVAL_FEEDBACK.md`,
      updatedDraftPath: `drafts/${featureKey}_QA_SUMMARY_DRAFT.md`,
    }, null, 2)}\n`,
    'utf8'
  );
  await writeFile(
    feedbackPath,
    [
      `# QA Summary Approval Feedback — ${featureKey}`,
      '',
      '**Verdict:** FAIL',
      '',
      '## Required Fixes',
      ...feedbackLines(feedback),
      '',
    ].join('\n'),
    'utf8'
  );
}

async function regenerateDraftFromApprovalFeedback({ featureKey, runDir, feedback }) {
  try {
    await generateSummaryDraftArtifacts({
      featureKey,
      runDir,
      approvalFeedback: feedback,
    });
  } catch (error) {
    throw new Error(`BLOCKED: Failed to regenerate approval feedback draft: ${error.message}`);
  }
}

async function updateRevisionState({ featureKey, runDir, taskPath, runPath, task, ts }) {
  task.overall_status = 'review_in_progress';
  task.current_phase = 'phase4';
  task.review_status = 'changes_requested';
  task.updated_at = ts;
  await writeFile(taskPath, `${JSON.stringify(task, null, 2)}\n`, 'utf8');

  const run = (await readJson(runPath, {})) ?? {};
  run.approval_feedback_at = ts;
  run.subtask_timestamps = run.subtask_timestamps || {};
  run.subtask_timestamps.summary_approval_feedback = ts;
  run.updated_at = ts;
  await writeFile(runPath, `${JSON.stringify(run, null, 2)}\n`, 'utf8');

  const manifestPath = join(runDir, 'phase4_spawn_manifest.json');
  await writeFile(
    manifestPath,
    `${JSON.stringify(buildPhase4Manifest(featureKey, 'context/approval_feedback.json'), null, 2)}\n`,
    'utf8'
  );
  console.log(`SPAWN_MANIFEST: ${manifestPath}`);
}

async function approvalFeedbackArg(runDir) {
  const relativePath = 'context/approval_feedback.json';
  const feedback = await readJson(join(runDir, relativePath));
  return feedback ? relativePath : null;
}

async function queueRevisionFeedback({ featureKey, runDir, taskPath, runPath, task, feedback }) {
  const ts = new Date().toISOString();
  const feedbackPath = join(runDir, `${featureKey}_QA_SUMMARY_APPROVAL_FEEDBACK.md`);

  try {
    await persistApprovalFeedbackArtifacts({
      featureKey,
      runDir,
      feedback,
      feedbackPath,
      ts,
    });
    await regenerateDraftFromApprovalFeedback({ featureKey, runDir, feedback });
  } catch (error) {
    console.error(error.message);
    return 2;
  }

  await updateRevisionState({ featureKey, runDir, taskPath, runPath, task, ts });
  return 0;
}

export async function runPhase4(featureKey, runDir, mode = 'main') {
  const taskPath = join(runDir, 'task.json');
  const runPath = join(runDir, 'run.json');
  const task = await readJson(taskPath);
  if (!task) {
    console.error('BLOCKED: Missing task.json.');
    return 2;
  }

  if (mode !== '--post' && task.overall_status === 'awaiting_approval') {
    const approval = approvalInput();
    if (approval.decision === 'APPROVE') {
      await markApproved(taskPath, runPath, task);
      console.log('PHASE4_APPROVED');
      return 0;
    }
    if (approval.feedback) {
      return queueRevisionFeedback({
        featureKey,
        runDir,
        taskPath,
        runPath,
        task,
        feedback: approval.feedback,
      });
    }
    await renderDraft(featureKey, runDir);
    console.error('Awaiting APPROVE or revision feedback');
    return 2;
  }

  if (mode !== '--post') {
    const approvalFeedbackPath = await approvalFeedbackArg(runDir);
    const manifestPath = join(runDir, 'phase4_spawn_manifest.json');
    await writeFile(
      manifestPath,
      `${JSON.stringify(buildPhase4Manifest(featureKey, approvalFeedbackPath), null, 2)}\n`,
      'utf8'
    );
    console.log(`SPAWN_MANIFEST: ${manifestPath}`);
    return 0;
  }

  let reviewResult = {};
  try {
    const raw = await readFile(join(runDir, 'context', 'review_result.json'), 'utf8');
    reviewResult = JSON.parse(raw);
  } catch {
    console.error('BLOCKED: Missing review_result.json. Run qa-summary-review first.');
    return 2;
  }

  if (reviewResult.source === 'approval_feedback') {
    console.error('BLOCKED: Approval feedback is queued. Run qa-summary-review before Phase 4 post-processing.');
    return 2;
  }

  if (reviewResult.verdict !== 'pass') {
    if (reviewResult.requiresRefactor) {
      const syncResult = await syncReviewedDraft(featureKey, runDir, reviewResult);
      if (!syncResult.ok) {
        console.error(syncResult.message);
        return 2;
      }
      const reviewPathResult = resolveReviewPath(featureKey, runDir, reviewResult);
      if (!reviewPathResult.ok) {
        console.error(reviewPathResult.message);
        return 2;
      }
      try {
        await applyReviewRefactor({
          draftPath: join(runDir, 'drafts', `${featureKey}_QA_SUMMARY_DRAFT.md`),
          reviewPath: reviewPathResult.path,
        });
      } catch (error) {
        console.error(`BLOCKED: Failed to apply Phase 4 review refactor: ${error.message}`);
        return 2;
      }
      task.overall_status = 'review_in_progress';
      task.current_phase = 'phase4';
      task.updated_at = new Date().toISOString();
      await writeFile(taskPath, `${JSON.stringify(task, null, 2)}\n`, 'utf8');
      const manifestPath = join(runDir, 'phase4_spawn_manifest.json');
      const approvalFeedbackPath = await approvalFeedbackArg(runDir);
      await writeFile(
        manifestPath,
        `${JSON.stringify(buildPhase4Manifest(featureKey, approvalFeedbackPath), null, 2)}\n`,
        'utf8'
      );
      console.log(`SPAWN_MANIFEST: ${manifestPath}`);
      return 0;
    }
    console.error('BLOCKED: Review verdict is fail and requiresRefactor is false.');
    return 2;
  }

  const syncResult = await syncReviewedDraft(featureKey, runDir, reviewResult);
  if (!syncResult.ok) {
    console.error(syncResult.message);
    return 2;
  }

  const ts = new Date().toISOString();
  task.overall_status = 'awaiting_approval';
  task.current_phase = 'phase4';
  task.review_status = 'pass';
  task.updated_at = ts;
  await writeFile(taskPath, `${JSON.stringify(task, null, 2)}\n`, 'utf8');

  const run = (await readJson(runPath, {})) ?? {};
  run.review_completed_at = ts;
  run.subtask_timestamps = run.subtask_timestamps || {};
  run.subtask_timestamps.summary_review = ts;
  run.updated_at = ts;
  await writeFile(runPath, `${JSON.stringify(run, null, 2)}\n`, 'utf8');

  await renderDraft(featureKey, runDir);
  console.error('Awaiting APPROVE or revision feedback');
  return 2;
}

async function main() {
  const featureKey = process.argv[2];
  const runDir = process.argv[3];
  const mode = process.argv[4] || 'main';
  if (!featureKey || !runDir) {
    console.error('Usage: phase4.mjs <feature-key> <run-dir> [--post]');
    process.exit(1);
  }
  const code = await runPhase4(featureKey, runDir, mode);
  process.exit(code);
}

if (process.argv[1]?.includes('phase4.mjs')) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
