import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getBenchmarkRuntimeRoot } from '../../../../../../../.agents/skills/lib/artifactRoots.mjs';

function requirePath(path, label) {
  const value = String(path || '').trim();
  if (!value) {
    throw new Error(`Missing required ${label}`);
  }
  return resolve(value);
}

/**
 * Returns the absolute path to the benchmark definition root in the source tree.
 * This directory contains versioned benchmark manifests, fixtures, and scripts.
 *
 * @param {string} family - The benchmark family name (e.g., 'qa-plan-v2').
 * @returns {string} Absolute path to the benchmark definition root.
 * @example
 * benchmarkDefinitionRoot('qa-plan-v2');
 * // '<repo>/workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2'
 */
export function benchmarkDefinitionRoot(family) {
  if (!family || typeof family !== 'string') {
    throw new TypeError('benchmarkDefinitionRoot: family must be a non-empty string');
  }
  const moduleDir = dirname(fileURLToPath(import.meta.url));
  // From lib/ -> scripts/ -> qa-plan-v2/ -> benchmarks/ -> qa-plan-orchestrator/
  const orchestratorRoot = resolve(moduleDir, '..', '..', '..', '..');
  return join(orchestratorRoot, 'benchmarks', family);
}

/**
 * Returns the absolute path to the benchmark archive root in the source tree.
 * This directory contains frozen baseline evidence that is intentionally preserved
 * and checked into version control.
 *
 * @param {string} family - The benchmark family name (e.g., 'qa-plan-v2').
 * @returns {string} Absolute path to the benchmark archive root.
 * @example
 * benchmarkArchiveRoot('qa-plan-v2');
 * // '<repo>/workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/archive'
 */
export function benchmarkArchiveRoot(family) {
  return join(benchmarkDefinitionRoot(family), 'archive');
}

/**
 * Returns the absolute path to the benchmark runtime root in workspace-artifacts.
 * This directory contains live iterations, snapshots, and history that are gitignored.
 *
 * @param {string} family - The benchmark family name (e.g., 'qa-plan-v2').
 * @returns {string} Absolute path to the benchmark runtime root.
 * @example
 * benchmarkRuntimeRoot('qa-plan-v2');
 * // '<artifactRoot>/skills/workspace-planner/qa-plan-orchestrator/benchmarks/qa-plan-v2'
 */
export function benchmarkRuntimeRoot(family) {
  if (!family || typeof family !== 'string') {
    throw new TypeError('benchmarkRuntimeRoot: family must be a non-empty string');
  }
  return getBenchmarkRuntimeRoot('workspace-planner', 'qa-plan-orchestrator', family);
}

/**
 * Resolves a path that may reference archived baseline evidence.
 * If the path starts with 'benchmarks/<family>/archive/', it is resolved
 * relative to the benchmark definition root. Otherwise, it is resolved
 * relative to the benchmark runtime root.
 *
 * @param {string} family - The benchmark family name.
 * @param {string} relativePath - The relative path to resolve.
 * @returns {string} Absolute path to the evidence.
 * @example
 * resolveArchiveCompatiblePath('qa-plan-v2', 'benchmarks/qa-plan-v2/archive/baseline-1/evidence.json');
 * // '<repo>/workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/archive/baseline-1/evidence.json'
 *
 * resolveArchiveCompatiblePath('qa-plan-v2', 'iteration-0/eval-1/evidence.json');
 * // '<artifactRoot>/skills/workspace-planner/qa-plan-orchestrator/benchmarks/qa-plan-v2/iteration-0/eval-1/evidence.json'
 */
export function resolveArchiveCompatiblePath(family, relativePath) {
  if (!family || typeof family !== 'string') {
    throw new TypeError('resolveArchiveCompatiblePath: family must be a non-empty string');
  }
  if (!relativePath || typeof relativePath !== 'string') {
    throw new TypeError('resolveArchiveCompatiblePath: relativePath must be a non-empty string');
  }

  const archivePrefix = `benchmarks/${family}/archive/`;
  if (relativePath.startsWith(archivePrefix)) {
    // Strip the prefix and resolve relative to definition root
    const pathWithinArchive = relativePath.slice(archivePrefix.length);
    return join(benchmarkArchiveRoot(family), pathWithinArchive);
  }

  // Default to runtime root
  return join(benchmarkRuntimeRoot(family), relativePath);
}

function isSubpath(parentPath, childPath) {
  const relation = relative(parentPath, childPath);
  return relation === '' || (!relation.startsWith('..') && relation !== '.');
}

export function validateCanonicalSkillRoot({ benchmarkDefinitionRoot, canonicalSkillRoot }) {
  const resolvedBenchmarkDefinitionRoot = requirePath(benchmarkDefinitionRoot, 'benchmark definition root');
  const resolvedCanonicalSkillRoot = requirePath(canonicalSkillRoot, 'canonical skill root');

  if (isSubpath(resolvedBenchmarkDefinitionRoot, resolvedCanonicalSkillRoot)) {
    throw new Error(
      `Canonical skill root must not resolve inside benchmark-owned directories: ${resolvedCanonicalSkillRoot}`,
    );
  }

  return resolvedCanonicalSkillRoot;
}

export function resolveCanonicalSkillRoot(benchmarkDefinitionRootPath) {
  const resolvedBenchmarkDefinitionRoot = requirePath(benchmarkDefinitionRootPath, 'benchmark definition root');
  return validateCanonicalSkillRoot({
    benchmarkDefinitionRoot: resolvedBenchmarkDefinitionRoot,
    canonicalSkillRoot: resolve(resolvedBenchmarkDefinitionRoot, '..', '..'),
  });
}

export function validateSkillPathContract({
  benchmarkDefinitionRoot,
  canonicalSkillRoot,
  skillSnapshotPath = '',
}) {
  const resolvedCanonicalSkillRoot = validateCanonicalSkillRoot({
    benchmarkDefinitionRoot,
    canonicalSkillRoot,
  });
  const resolvedSnapshotPath = String(skillSnapshotPath || '').trim()
    ? resolve(skillSnapshotPath)
    : '';

  if (resolvedSnapshotPath && resolvedSnapshotPath === resolvedCanonicalSkillRoot) {
    throw new Error('Skill snapshot path must differ from canonical skill root');
  }

  return {
    canonicalSkillRoot: resolvedCanonicalSkillRoot,
    skillSnapshotPath: resolvedSnapshotPath,
  };
}

export function buildForbiddenSkillRoots({
  benchmarkDefinitionRoot,
  runDir = '',
  skillSnapshotPath = '',
}) {
  const roots = [
    requirePath(benchmarkDefinitionRoot, 'benchmark definition root'),
    String(runDir || '').trim() ? resolve(runDir, 'inputs') : '',
    String(skillSnapshotPath || '').trim() ? resolve(skillSnapshotPath) : '',
  ].filter(Boolean);

  return [...new Set(roots)];
}
