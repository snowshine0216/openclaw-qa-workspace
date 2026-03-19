#!/usr/bin/env node
/**
 * Resolve repository root for qa-summary relative-path configuration.
 */

import { dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_LIB_DIR = dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = resolve(SCRIPT_LIB_DIR, '..', '..', '..', '..', '..');
const QA_SUMMARY_PATH_MARKER = `${sep}workspace-reporter${sep}skills${sep}qa-summary`;

function resolveRepoRootFromRunDir(runDir) {
  if (!runDir) return null;

  const normalizedRunDir = resolve(runDir);
  const markerIndex = normalizedRunDir.lastIndexOf(QA_SUMMARY_PATH_MARKER);
  if (markerIndex < 0) return null;

  const repoRoot = normalizedRunDir.slice(0, markerIndex);
  return repoRoot || sep;
}

export function resolveQaSummaryRepoRoot(runDir) {
  return resolveRepoRootFromRunDir(runDir) ?? WORKSPACE_ROOT;
}
