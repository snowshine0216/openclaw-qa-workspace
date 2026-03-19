#!/usr/bin/env node
/**
 * Resolve skill root from script path or run directory.
 */

import { access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';

const SKILL_MARKER = 'SKILL.md';

/**
 * Resolve skill root from a script file path by walking up to find SKILL.md.
 * @param {string} scriptPath - Absolute path to a script file
 * @returns {Promise<{ skillRoot: string; skillName: string } | null>}
 */
export async function resolveSkillRootFromScriptPath(scriptPath) {
  let current = resolve(dirname(scriptPath));

  while (current !== dirname(current)) {
    try {
      await access(join(current, SKILL_MARKER), constants.F_OK);
      const skillName = current.split(/[/\\]/).pop() || '';
      return { skillRoot: current, skillName };
    } catch {
      /* continue */
    }
    current = dirname(current);
  }

  return null;
}

/**
 * Resolve skill root from run directory path (e.g. .../skills/<name>/runs/<key>/).
 * @param {string} runDir - Absolute path to run directory
 * @param {string} [repoRoot] - Optional repo root to constrain search
 * @returns {{ skillRoot: string; skillName: string; repoRoot?: string } | null}
 */
export function resolveSkillRootFromRunDir(runDir, repoRoot) {
  const normalized = resolve(runDir);
  const runsDir = dirname(normalized);
  const parentOfRuns = dirname(runsDir);
  const parentName = basename(runsDir);
  const grandparentName = basename(parentOfRuns);

  if (parentName !== 'runs' || !normalized.includes('skills')) return null;

  const skillRoot = parentOfRuns;
  const skillName = grandparentName;
  const result = { skillRoot, skillName };
  if (repoRoot) result.repoRoot = resolve(repoRoot);
  return result;
}

/**
 * Resolve skill root from either script path or run dir.
 * @param {{ fromScriptPath?: string; fromRunDir?: string; repoRoot?: string }} options
 * @returns {Promise<{ skillRoot: string; skillName: string; repoRoot?: string } | null>}
 */
export async function resolveSkillRoot(options) {
  if (options.fromScriptPath) {
    const result = await resolveSkillRootFromScriptPath(options.fromScriptPath);
    if (result && options.repoRoot) {
      return { ...result, repoRoot: resolve(options.repoRoot) };
    }
    return result;
  }

  if (options.fromRunDir) {
    return resolveSkillRootFromRunDir(options.fromRunDir, options.repoRoot);
  }

  return null;
}
