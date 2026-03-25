#!/usr/bin/env node
/**
 * Dispatcher for feature and release report generation.
 *
 * Usage: node generate_report.mjs <run-dir> <run-key> <jira-base-url>
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { generateFeatureReport } from './generate_feature_report.mjs';
import { generateReleaseReport } from './generate_release_report.mjs';

function safeReadJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

export function generateReport(runDir, runKey, jiraBaseUrl) {
  const task = safeReadJson(join(runDir, 'task.json')) ?? {};
  const routeDecision = safeReadJson(join(runDir, 'context', 'route_decision.json')) ?? {};
  const routeKind = task.route_kind ?? routeDecision.route_kind ?? '';
  const isReleaseRun =
    routeKind === 'reporter_scope_release' ||
    (runKey.startsWith('release_') && safeReadJson(join(runDir, 'context', 'release_summary_inputs.json')));

  return isReleaseRun
    ? generateReleaseReport(runDir, runKey)
    : generateFeatureReport(runDir, runKey, jiraBaseUrl.replace(/\/$/, ''));
}

function main() {
  const [runDir, runKey, jiraBaseUrl] = process.argv.slice(2);
  if (!runDir || !runKey || !jiraBaseUrl) {
    console.error('Usage: generate_report.mjs <run-dir> <run-key> <jira-base-url>');
    process.exit(1);
  }
  generateReport(runDir, runKey, jiraBaseUrl);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
