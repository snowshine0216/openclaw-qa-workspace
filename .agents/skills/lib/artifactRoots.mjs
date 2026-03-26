import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

function getRepoRoot() {
  const moduleDir = dirname(fileURLToPath(import.meta.url));
  return resolve(moduleDir, '..', '..', '..');
}

function getWorkspaceArtifactRoot() {
  const override = String(process.env.ARTIFACT_ROOT || '').trim();
  if (override) {
    return resolve(override);
  }
  return join(getRepoRoot(), 'workspace-artifacts');
}

function resolveCanonicalSkillRoot(skillRoot) {
  const overridden = String(process.env.FQPO_CANONICAL_SKILL_ROOT || '').trim();
  if (!overridden) {
    return skillRoot;
  }
  const snapshotRootName = basename(skillRoot);
  if (snapshotRootName === 'candidate_snapshot' || snapshotRootName === 'champion_snapshot') {
    return overridden;
  }
  return skillRoot;
}

function getSkillArtifactRoot(workspaceName, skillName) {
  return join(getWorkspaceArtifactRoot(), 'skills', workspaceName, skillName);
}

function getRunRoot(workspaceName, skillName, runKey) {
  return join(getSkillArtifactRoot(workspaceName, skillName), 'runs', runKey);
}

function getBenchmarkRuntimeRoot(workspaceName, skillName, benchmarkFamily) {
  return join(getSkillArtifactRoot(workspaceName, skillName), 'benchmarks', benchmarkFamily);
}

export {
  getRepoRoot,
  getWorkspaceArtifactRoot,
  resolveCanonicalSkillRoot,
  getSkillArtifactRoot,
  getRunRoot,
  getBenchmarkRuntimeRoot,
};
