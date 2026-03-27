#!/usr/bin/env node
/**
 * Phase 3: LLM-driven QA Summary draft generation with self-review exit gate.
 *
 * Pre-spawn: builds phase3_spawn_manifest.json and emits SPAWN_MANIFEST.
 * --post: validates the self-review verdict; retries up to MAX_ROUNDS if verdict is
 *         "return phase3"; advances to review_in_progress on accept.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  buildSubagentPrompt,
  buildManifest,
} from './build_summary_draft_spawn_manifest.mjs';
import { parseVerdict, updateTaskForRerun } from './validate_summary_review.mjs';

const MAX_ROUNDS = 3;

async function readJson(path, fallback = null) {
  try {
    const raw = await readFile(path, 'utf8');
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

async function emitDraftSpawn({ featureKey, runDir, task, taskPath, manifestPath }) {
  const round = (task.phase3_round ?? 0) + 1;

  const { join: pathJoin, dirname } = await import('node:path');
  const { fileURLToPath } = await import('node:url');
  const SKILL_ROOT = pathJoin(dirname(fileURLToPath(import.meta.url)), '..', '..');

  const rubricPaths = {
    formattingRef: pathJoin(SKILL_ROOT, 'references', 'summary-formatting.md'),
    generationRubric: pathJoin(SKILL_ROOT, 'references', 'summary-generation-rubric.md'),
    reviewRubric: pathJoin(SKILL_ROOT, 'references', 'summary-review-rubric.md'),
  };
  const reviewNotesPath =
    round > 1 ? pathJoin(runDir, 'context', 'phase3_review_notes.md') : null;

  const prompt = buildSubagentPrompt({ runDir, featureKey, rubricPaths, reviewNotesPath, round });
  const manifest = buildManifest(prompt);

  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(`SPAWN_MANIFEST: ${manifestPath}`);
  return 0;
}

export async function runPhase3(featureKey, runDir, mode = 'main') {
  const taskPath = join(runDir, 'task.json');
  let task = await readJson(taskPath, {});

  const manifestPath = join(runDir, 'phase3_spawn_manifest.json');

  // Pre-spawn: emit manifest and exit
  if (mode !== '--post') {
    return emitDraftSpawn({ featureKey, runDir, task, taskPath, manifestPath });
  }

  // --post: validate verdict
  const deltaPath = join(runDir, 'context', 'phase3_review_delta.md');
  let deltaContent;
  try {
    deltaContent = await readFile(deltaPath, 'utf8');
  } catch {
    console.error('BLOCKED: Missing context/phase3_review_delta.md. Subagent did not write verdict.');
    return 2;
  }

  const { verdict } = parseVerdict(deltaContent, 'phase3');

  if (!verdict) {
    console.error(
      'BLOCKED: Invalid verdict in phase3_review_delta.md — expected "- accept" or "- return phase3".'
    );
    return 2;
  }

  if (verdict === 'accept') {
    const ts = new Date().toISOString();
    task.current_phase = 'phase3';
    task.overall_status = 'review_in_progress';
    task.return_to_phase = null;
    task.updated_at = ts;
    await writeFile(taskPath, `${JSON.stringify(task, null, 2)}\n`, 'utf8');

    const runPath = join(runDir, 'run.json');
    let run = (await readJson(runPath, {})) ?? {};
    run.output_generated_at = ts;
    run.updated_at = ts;
    await writeFile(runPath, `${JSON.stringify(run, null, 2)}\n`, 'utf8');

    console.log('PHASE3_DONE');
    return 0;
  }

  // verdict === 'return phase3'
  const currentRound = task.phase3_round ?? 0;
  if (currentRound >= MAX_ROUNDS) {
    console.error(
      `BLOCKED: Phase 3 failed to converge after ${MAX_ROUNDS} rounds — review context/phase3_review_delta.md for blocking criteria.`
    );
    return 2;
  }

  const newRound = currentRound + 1;
  const updatedTask = updateTaskForRerun(task, 'phase3', newRound);
  await writeFile(taskPath, `${JSON.stringify(updatedTask, null, 2)}\n`, 'utf8');

  return emitDraftSpawn({
    featureKey,
    runDir,
    task: updatedTask,
    taskPath,
    manifestPath,
  });
}

async function main() {
  const featureKey = process.argv[2];
  const runDir = process.argv[3];
  const mode = process.argv[4] || 'main';
  if (!featureKey || !runDir) {
    console.error('Usage: phase3.mjs <feature-key> <run-dir> [--post]');
    process.exit(1);
  }
  const code = await runPhase3(featureKey, runDir, mode);
  process.exit(code);
}

if (process.argv[1]?.includes('phase3.mjs')) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
