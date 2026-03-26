import { basename, dirname, join, resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * Validates that a string parameter is non-empty and defined.
 *
 * @param {string} value - The value to validate.
 * @param {string} paramName - The parameter name used in the error message.
 * @throws {TypeError} If value is null, undefined, or an empty/whitespace-only string.
 */
function assertNonEmpty(value, paramName) {
  if (value == null || String(value).trim() === '') {
    throw new TypeError(
      `artifactRoots: "${paramName}" must be a non-empty string, got ${JSON.stringify(value)}`
    );
  }
}

/**
 * Returns the absolute path to the repository root.
 *
 * Resolution order:
 *   1. `REPO_ROOT` environment variable (if set and non-empty).
 *   2. Walk upward from this module's directory looking for a `.git` entry.
 *   3. Fall back to the hardcoded three-levels-up path relative to this file.
 *
 * @returns {string} Absolute path to the repository root.
 * @example
 * const root = getRepoRoot();
 * // '/Users/dev/openclaw-qa-workspace'
 */
function getRepoRoot() {
  // 1. Honour explicit override.
  const envRoot = String(process.env.REPO_ROOT || '').trim();
  if (envRoot) {
    return resolve(envRoot);
  }

  // 2. Walk upward from this file searching for a .git directory/file.
  const moduleDir = dirname(fileURLToPath(import.meta.url));
  let dir = moduleDir;
  for (let i = 0; i < 20; i++) {
    if (existsSync(join(dir, '.git'))) {
      return dir;
    }
    const parent = resolve(dir, '..');
    if (parent === dir) break; // reached filesystem root
    dir = parent;
  }

  // 3. Hardcoded fallback (lib/ -> skills/ -> .agents/ -> workspace root).
  return resolve(moduleDir, '..', '..', '..');
}

/**
 * Returns the absolute path to the workspace artifact root directory.
 *
 * Respects the `ARTIFACT_ROOT` environment variable override. When the
 * variable is set, its value is resolved to an absolute path and returned
 * directly, bypassing the default `<repoRoot>/workspace-artifacts` location.
 *
 * @returns {string} Absolute path to the workspace artifact root.
 * @example
 * // Default (no env override):
 * getWorkspaceArtifactRoot();
 * // '/Users/dev/openclaw-qa-workspace/workspace-artifacts'
 *
 * // With ARTIFACT_ROOT=/tmp/custom-artifacts:
 * getWorkspaceArtifactRoot();
 * // '/tmp/custom-artifacts'
 */
function getWorkspaceArtifactRoot() {
  const override = String(process.env.ARTIFACT_ROOT || '').trim();
  if (override) {
    return resolve(override);
  }
  return join(getRepoRoot(), 'workspace-artifacts');
}

/**
 * Resolves the canonical skill root path, honouring the
 * `FQPO_CANONICAL_SKILL_ROOT` environment variable for snapshot directories.
 *
 * When `FQPO_CANONICAL_SKILL_ROOT` is set and `skillRoot` ends with
 * `candidate_snapshot` or `champion_snapshot`, the env value is returned
 * instead so that orchestrators can redirect snapshot reads to a stable
 * canonical location.
 *
 * @param {string} skillRoot - The skill root path to potentially redirect.
 * @returns {string} The resolved canonical skill root path.
 * @example
 * // Without env override:
 * resolveCanonicalSkillRoot('/some/skill/root');
 * // '/some/skill/root'
 *
 * // With FQPO_CANONICAL_SKILL_ROOT=/canonical/root and a snapshot path:
 * resolveCanonicalSkillRoot('/benchmarks/iter-1/candidate_snapshot');
 * // '/canonical/root'
 */
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

/**
 * Returns the artifact root directory for a specific skill within a workspace.
 *
 * The path follows the convention:
 *   `<artifactRoot>/skills/<workspaceName>/<skillName>`
 *
 * @param {string} workspaceName - The workspace identifier (e.g. `"shared"`, `"workspace-planner"`).
 * @param {string} skillName - The skill identifier (e.g. `"qa-plan-evolution"`).
 * @returns {string} Absolute path to the skill artifact root.
 * @throws {TypeError} If `workspaceName` or `skillName` is empty, null, or undefined.
 * @example
 * getSkillArtifactRoot('shared', 'qa-plan-evolution');
 * // '<artifactRoot>/skills/shared/qa-plan-evolution'
 *
 * getSkillArtifactRoot('workspace-planner', 'qa-plan-orchestrator');
 * // '<artifactRoot>/skills/workspace-planner/qa-plan-orchestrator'
 */
function getSkillArtifactRoot(workspaceName, skillName) {
  assertNonEmpty(workspaceName, 'workspaceName');
  assertNonEmpty(skillName, 'skillName');
  return join(getWorkspaceArtifactRoot(), 'skills', workspaceName, skillName);
}

/**
 * Returns the artifact root directory for a specific skill run.
 *
 * The path follows the convention:
 *   `<skillArtifactRoot>/runs/<runKey>`
 *
 * @param {string} workspaceName - The workspace identifier.
 * @param {string} skillName - The skill identifier.
 * @param {string} runKey - The unique run key (e.g. `"run-abc123"`).
 * @returns {string} Absolute path to the run root directory.
 * @throws {TypeError} If any parameter is empty, null, or undefined.
 * @example
 * getRunRoot('shared', 'qa-plan-evolution', 'run-abc123');
 * // '<artifactRoot>/skills/shared/qa-plan-evolution/runs/run-abc123'
 */
function getRunRoot(workspaceName, skillName, runKey) {
  assertNonEmpty(workspaceName, 'workspaceName');
  assertNonEmpty(skillName, 'skillName');
  assertNonEmpty(runKey, 'runKey');
  return join(getSkillArtifactRoot(workspaceName, skillName), 'runs', runKey);
}

/**
 * Returns the artifact root directory for a benchmark family within a skill.
 *
 * The path follows the convention:
 *   `<skillArtifactRoot>/benchmarks/<benchmarkFamily>`
 *
 * @param {string} workspaceName - The workspace identifier.
 * @param {string} skillName - The skill identifier.
 * @param {string} benchmarkFamily - The benchmark family name (e.g. `"qa-plan-v2"`).
 * @returns {string} Absolute path to the benchmark runtime root directory.
 * @throws {TypeError} If any parameter is empty, null, or undefined.
 * @example
 * getBenchmarkRuntimeRoot('workspace-planner', 'qa-plan-orchestrator', 'qa-plan-v2');
 * // '<artifactRoot>/skills/workspace-planner/qa-plan-orchestrator/benchmarks/qa-plan-v2'
 */
function getBenchmarkRuntimeRoot(workspaceName, skillName, benchmarkFamily) {
  assertNonEmpty(workspaceName, 'workspaceName');
  assertNonEmpty(skillName, 'skillName');
  assertNonEmpty(benchmarkFamily, 'benchmarkFamily');
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
