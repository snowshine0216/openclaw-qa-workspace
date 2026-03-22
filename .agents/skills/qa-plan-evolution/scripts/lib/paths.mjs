import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Skill root: .agents/skills/qa-plan-evolution */
export const SKILL_ROOT = resolve(__dirname, '..', '..');

/** Repository root (openclaw-qa-workspace) */
export function getRepoRoot() {
  return resolve(SKILL_ROOT, '..', '..', '..');
}

export function resolveFromRepo(repoRoot, relativePath) {
  return resolve(repoRoot, relativePath);
}

export function getRunRoot(runKey) {
  return join(SKILL_ROOT, 'runs', runKey);
}
