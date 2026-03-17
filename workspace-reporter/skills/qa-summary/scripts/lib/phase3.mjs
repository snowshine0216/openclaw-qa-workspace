#!/usr/bin/env node
/**
 * Phase 3: Build QA Summary draft from planner and defect context.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { generateSummaryDraftArtifacts } from './generateSummaryDraftArtifacts.mjs';

export async function runPhase3(featureKey, runDir) {
  try {
    await generateSummaryDraftArtifacts({ featureKey, runDir });
  } catch (error) {
    console.error(error.message);
    return 2;
  }

  const ts = new Date().toISOString();
  const taskPath = join(runDir, 'task.json');
  let task = {};
  try {
    const raw = await readFile(taskPath, 'utf8');
    task = JSON.parse(raw);
  } catch {
    /* ignore */
  }
  task.current_phase = 'phase3';
  task.overall_status = 'review_in_progress';
  task.updated_at = ts;
  await writeFile(taskPath, `${JSON.stringify(task, null, 2)}\n`, 'utf8');

  const runPath = join(runDir, 'run.json');
  let run = {};
  try {
    const raw = await readFile(runPath, 'utf8');
    run = JSON.parse(raw);
  } catch {
    /* ignore */
  }
  run.output_generated_at = ts;
  run.updated_at = ts;
  await writeFile(runPath, `${JSON.stringify(run, null, 2)}\n`, 'utf8');

  console.log('PHASE3_DONE');
  return 0;
}

async function main() {
  const featureKey = process.argv[2];
  const runDir = process.argv[3];
  if (!featureKey || !runDir) {
    console.error('Usage: phase3.mjs <feature-key> <run-dir>');
    process.exit(1);
  }
  const code = await runPhase3(featureKey, runDir);
  process.exit(code);
}

if (process.argv[1]?.includes('phase3.mjs')) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
