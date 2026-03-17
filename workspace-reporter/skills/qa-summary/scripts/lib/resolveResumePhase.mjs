#!/usr/bin/env node
/**
 * Resolve the correct resume phase from task.json and run state.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

function safeReadTask(runDir) {
  try {
    const raw = readFileSync(join(runDir, 'task.json'), 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function phaseNumberFromTask(currentPhase) {
  if (!currentPhase || typeof currentPhase !== 'string') return 0;
  const m = currentPhase.match(/^phase(\d+)$/);
  return m ? parseInt(m[1], 10) : 0;
}

export function resolveResumePhase(runDir) {
  const task = safeReadTask(runDir);
  if (!task) return 0;
  if (task.overall_status === 'awaiting_approval') return 4;
  if (task.overall_status === 'approved') return 5;
  if (task.overall_status === 'review_in_progress') return 4;
  if (task.overall_status === 'completed' && task.selected_mode === 'use_existing') return 0;
  return phaseNumberFromTask(task.current_phase || 'phase0');
}

function main() {
  const runDir = process.argv[2];
  if (!runDir) {
    console.error('Usage: resolveResumePhase.mjs <run-dir>');
    process.exit(1);
  }
  const phase = resolveResumePhase(runDir);
  console.log(phase);
}

const currentPath = new URL(import.meta.url).pathname;
const executedPath = process.argv[1] ?? '';
if (executedPath && (executedPath === currentPath || executedPath.endsWith('resolveResumePhase.mjs'))) {
  main();
}
