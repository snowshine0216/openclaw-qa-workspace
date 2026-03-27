#!/usr/bin/env node
/**
 * Phase 4: LLM-driven QA Summary review with structural refactor and approval gate.
 *
 * Pre-spawn: builds phase4_spawn_manifest.json with internal review subagent.
 * --post: validates verdict; retries up to MAX_ROUNDS; advances to awaiting_approval on accept.
 * Awaiting approval: reads APPROVE / revision feedback and handles both.
 *
 * Removed dependencies: qa-summary-review skill, applyReviewRefactor.mjs
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  buildSubagentPrompt,
  buildManifest,
} from './build_summary_review_spawn_manifest.mjs';
import { parseVerdict, updateTaskForRerun } from './validate_summary_review.mjs';
import {
  buildSubagentPrompt as buildDraftPrompt,
  buildManifest as buildDraftManifest,
} from './build_summary_draft_spawn_manifest.mjs';

const MAX_ROUNDS = 3;

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

async function emitReviewSpawn({ featureKey, runDir, task, taskPath }) {
  const round = (task.phase4_round ?? 0) + 1;

  const { join: pathJoin, dirname } = await import('node:path');
  const { fileURLToPath } = await import('node:url');
  const SKILL_ROOT = pathJoin(dirname(fileURLToPath(import.meta.url)), '..', '..');

  const rubricPaths = {
    formattingRef: pathJoin(SKILL_ROOT, 'references', 'summary-formatting.md'),
    reviewRubric: pathJoin(SKILL_ROOT, 'references', 'summary-review-rubric.md'),
  };
  const reviewNotesPath =
    round > 1 ? pathJoin(runDir, 'context', 'phase4_review_notes.md') : null;

  let approvalFeedbackPath = null;
  try {
    await readFile(join(runDir, 'context', 'approval_feedback.json'), 'utf8');
    approvalFeedbackPath = 'context/approval_feedback.json';
  } catch {
    /* no approval feedback */
  }

  const prompt = buildSubagentPrompt({
    runDir,
    featureKey,
    rubricPaths,
    reviewNotesPath,
    approvalFeedbackPath,
    round,
  });
  const manifest = buildManifest(prompt);

  const manifestPath = join(runDir, 'phase4_spawn_manifest.json');
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(`SPAWN_MANIFEST: ${manifestPath}`);
  return 0;
}

function feedbackLines(feedback) {
  return feedback
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => (line.startsWith('- ') ? line : `- ${line}`));
}

async function queueRevisionFeedback({ featureKey, runDir, taskPath, runPath, task, feedback }) {
  const ts = new Date().toISOString();
  const feedbackPath = join(runDir, `${featureKey}_QA_SUMMARY_APPROVAL_FEEDBACK.md`);

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

  // Regenerate the draft via Phase 3 spawn with approval feedback context
  const { join: pathJoin, dirname } = await import('node:path');
  const { fileURLToPath } = await import('node:url');
  const SKILL_ROOT = pathJoin(dirname(fileURLToPath(import.meta.url)), '..', '..');

  const rubricPaths = {
    formattingRef: pathJoin(SKILL_ROOT, 'references', 'summary-formatting.md'),
    generationRubric: pathJoin(SKILL_ROOT, 'references', 'summary-generation-rubric.md'),
    reviewRubric: pathJoin(SKILL_ROOT, 'references', 'summary-review-rubric.md'),
  };
  const round = (task.phase3_round ?? 0) + 1;
  const reviewNotesPath =
    round > 1 ? pathJoin(runDir, 'context', 'phase3_review_notes.md') : null;

  // Embed approval feedback instruction in the prompt
  const basePrompt = buildDraftPrompt({
    runDir,
    featureKey,
    rubricPaths,
    reviewNotesPath,
    round,
  });
  const promptWithFeedback = `${basePrompt}
## Approval Feedback to Address

The user requested the following changes before approving the draft. Read \`${runDir}/context/approval_feedback.json\` and address every required fix listed.
`;
  const draftManifest = buildDraftManifest(promptWithFeedback);
  const draftManifestPath = pathJoin(runDir, 'phase4_draft_regen_manifest.json');
  await writeFile(draftManifestPath, `${JSON.stringify(draftManifest, null, 2)}\n`, 'utf8');

  task.overall_status = 'review_in_progress';
  task.current_phase = 'phase4';
  task.review_status = 'changes_requested';
  task.phase3_round = round;
  task.updated_at = ts;
  await writeFile(taskPath, `${JSON.stringify(task, null, 2)}\n`, 'utf8');

  const run = (await readJson(runPath, {})) ?? {};
  run.approval_feedback_at = ts;
  run.subtask_timestamps = run.subtask_timestamps || {};
  run.subtask_timestamps.summary_approval_feedback = ts;
  run.updated_at = ts;
  await writeFile(runPath, `${JSON.stringify(run, null, 2)}\n`, 'utf8');

  console.log(`SPAWN_MANIFEST: ${draftManifestPath}`);
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

  // Awaiting approval: handle APPROVE or revision feedback
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

  // Pre-spawn: emit review manifest
  if (mode !== '--post') {
    // Reset phase4_round when entering fresh (not a retry)
    if (!task.phase4_round) {
      task.phase4_round = 0;
      await writeFile(taskPath, `${JSON.stringify(task, null, 2)}\n`, 'utf8');
    }
    return emitReviewSpawn({ featureKey, runDir, task, taskPath });
  }

  // --post after draft-regen (approval feedback path): re-enter review
  if (task.review_status === 'changes_requested') {
    // Clear approval-feedback state and start Phase 4 review fresh
    task.review_status = null;
    task.phase4_round = 0;
    await writeFile(taskPath, `${JSON.stringify(task, null, 2)}\n`, 'utf8');
    return emitReviewSpawn({ featureKey, runDir, task, taskPath });
  }

  // --post: validate review verdict
  const deltaPath = join(runDir, 'context', 'phase4_review_delta.md');
  let deltaContent;
  try {
    deltaContent = await readFile(deltaPath, 'utf8');
  } catch {
    console.error('BLOCKED: Missing context/phase4_review_delta.md. Run review subagent first.');
    return 2;
  }

  const { verdict } = parseVerdict(deltaContent, 'phase4');

  if (!verdict) {
    console.error(
      'BLOCKED: Invalid verdict in phase4_review_delta.md — expected "- accept" or "- return phase4".'
    );
    return 2;
  }

  if (verdict === 'accept') {
    const ts = new Date().toISOString();
    task.overall_status = 'awaiting_approval';
    task.current_phase = 'phase4';
    task.review_status = 'pass';
    task.return_to_phase = null;
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

  // verdict === 'return phase4'
  const currentRound = task.phase4_round ?? 0;
  if (currentRound >= MAX_ROUNDS) {
    console.error(
      `BLOCKED: Phase 4 failed to converge after ${MAX_ROUNDS} rounds — review context/phase4_review_delta.md for blocking criteria.`
    );
    return 2;
  }

  const newRound = currentRound + 1;
  const updatedTask = updateTaskForRerun(task, 'phase4', newRound);
  await writeFile(taskPath, `${JSON.stringify(updatedTask, null, 2)}\n`, 'utf8');

  return emitReviewSpawn({ featureKey, runDir, task: updatedTask, taskPath });
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
