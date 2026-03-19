#!/usr/bin/env node
/**
 * Resolve shared skill scripts via the canonical skill-path-registrar helpers.
 */

import { resolve } from 'node:path';
import { findRepoRootSync } from '../../../../../.agents/skills/skill-path-registrar/lib/findRepoRoot.mjs';
import { resolveSharedSkill } from '../../../../../.agents/skills/skill-path-registrar/lib/resolveSharedSkill.mjs';

export function resolveWorkspaceRootFromSkillRoot(skillRoot) {
  return resolve(skillRoot, '..', '..', '..');
}

function resolveRepoRoot(skillRoot, repoRoot) {
  if (repoRoot) return repoRoot;
  const workspaceRoot = resolveWorkspaceRootFromSkillRoot(skillRoot);
  return (
    findRepoRootSync(workspaceRoot) ||
    findRepoRootSync(skillRoot) ||
    null
  );
}

export async function resolveSharedSkillScript({
  skillRoot,
  skillName,
  scriptRelativePath,
  repoRoot,
  envOverrides,
  requireUserConfirm = false,
  configPath,
  fileExists,
}) {
  return resolveSharedSkill(skillName, scriptRelativePath, {
    repoRoot: resolveRepoRoot(skillRoot, repoRoot),
    envOverrides,
    requireUserConfirm,
    configPath,
    fileExists,
  });
}
