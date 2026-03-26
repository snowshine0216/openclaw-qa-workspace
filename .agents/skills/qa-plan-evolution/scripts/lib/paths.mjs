import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getRepoRoot as getRepoRootFromResolver,
  getRunRoot as getRunRootFromResolver,
} from '../../../lib/artifactRoots.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Skill root: .agents/skills/qa-plan-evolution */
export const SKILL_ROOT = resolve(__dirname, '..', '..');

/** Repository root (openclaw-qa-workspace) */
export function getRepoRoot() {
  return getRepoRootFromResolver();
}

export function resolveFromRepo(repoRoot, relativePath) {
  return resolve(repoRoot, relativePath);
}

export function getRunRoot(runKey) {
  return getRunRootFromResolver('shared', 'qa-plan-evolution', runKey);
}
