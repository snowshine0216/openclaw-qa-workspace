import { join } from 'node:path';
import { getRepoRoot } from './artifactRoots.mjs';

/**
 * Canonical exclusion patterns for artifact discovery.
 *
 * These patterns prevent live runtime artifacts and archived benchmark
 * evidence from being treated as active skills during discovery scans.
 */
export const EXCLUSION_PATTERNS = [
  'workspace-artifacts/**',
  '**/benchmarks/*/archive/**',
];

/**
 * Canonical allowlist patterns for source-owned skill trees.
 *
 * Discovery systems should scan these explicit paths rather than
 * performing broad recursive repository scans.
 */
export const ALLOWLIST_PATTERNS = [
  '.agents/skills/*',
  'workspace-*/skills/*',
];

/**
 * Checks if a given path should be excluded from skill discovery.
 *
 * A path is excluded if it matches any of the canonical exclusion patterns.
 *
 * @param {string} pathToCheck - The path to check (absolute or relative to repo root).
 * @returns {boolean} True if the path should be excluded, false otherwise.
 */
export function isExcludedPath(pathToCheck) {
  const normalizedPath = pathToCheck.replace(/\\/g, '/');

  if (normalizedPath.includes('workspace-artifacts/') || normalizedPath === 'workspace-artifacts') {
    return true;
  }

  if (/benchmarks\/[^/]+\/archive(\/|$)/.test(normalizedPath)) {
    return true;
  }

  return false;
}

/**
 * Checks if a given path matches the source-owned skill tree allowlist.
 *
 * @param {string} pathToCheck - The path to check (absolute or relative to repo root).
 * @returns {boolean} True if the path is in the allowlist, false otherwise.
 */
export function isAllowedPath(pathToCheck) {
  const normalizedPath = pathToCheck.replace(/\\/g, '/');

  if (/(?:^|\/)\.agents\/skills\/[^/]+/.test(normalizedPath)) {
    return true;
  }

  if (/(?:^|\/)workspace-(?!artifacts)[^/]+\/skills\/[^/]+/.test(normalizedPath)) {
    return true;
  }

  return false;
}

/**
 * Checks if a path should be included in skill discovery.
 *
 * A path is included if it matches the allowlist AND does not match any exclusion.
 *
 * @param {string} pathToCheck - The path to check (absolute or relative to repo root).
 * @returns {boolean} True if the path should be included in discovery, false otherwise.
 */
export function shouldIncludeInDiscovery(pathToCheck) {
  return isAllowedPath(pathToCheck) && !isExcludedPath(pathToCheck);
}

/**
 * Returns the canonical source-owned skill tree roots as absolute paths.
 *
 * These are the explicit directories that should be scanned for active skills,
 * rather than performing a broad recursive repository scan.
 *
 * @returns {string[]} Array of absolute paths to skill tree roots.
 */
export function getSkillTreeRoots() {
  const repoRoot = getRepoRoot();
  return [
    join(repoRoot, '.agents', 'skills'),
    join(repoRoot, 'workspace-planner', 'skills'),
    join(repoRoot, 'workspace-reporter', 'skills'),
    join(repoRoot, 'workspace-tester', 'skills'),
  ];
}
