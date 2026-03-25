#!/usr/bin/env node
import { constants } from 'node:fs';
import { access } from 'node:fs/promises';
import { loadState, classifyReportState, saveState } from './workflowState.mjs';

const [runDir] = process.argv.slice(2);

if (!runDir) {
  console.error('Usage: classify_reported_state.sh <run-dir>');
  process.exit(1);
}

try {
  await access(runDir, constants.F_OK);
} catch {
  console.error(`Invalid project directory: ${runDir}`);
  process.exit(1);
}

const featureId = runDir.split('/').at(-1);
const state = await loadState(featureId, runDir);
state.task.report_state = await classifyReportState(runDir);
await saveState(state);
console.log(`REPORT_STATE: ${state.task.report_state}`);
