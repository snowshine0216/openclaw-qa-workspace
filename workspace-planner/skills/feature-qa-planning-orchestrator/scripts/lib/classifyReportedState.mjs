#!/usr/bin/env node
import { constants } from 'node:fs';
import { access } from 'node:fs/promises';
import { loadState, classifyReportState, saveState } from './workflowState.mjs';

const [projectDir] = process.argv.slice(2);

if (!projectDir) {
  console.error('Usage: classify_reported_state.sh <project-dir>');
  process.exit(1);
}

try {
  await access(projectDir, constants.F_OK);
} catch {
  console.error(`Invalid project directory: ${projectDir}`);
  process.exit(1);
}

const featureId = projectDir.split('/').at(-1);
const state = await loadState(featureId, projectDir);
state.task.report_state = await classifyReportState(projectDir);
await saveState(state);
console.log(`REPORT_STATE: ${state.task.report_state}`);
