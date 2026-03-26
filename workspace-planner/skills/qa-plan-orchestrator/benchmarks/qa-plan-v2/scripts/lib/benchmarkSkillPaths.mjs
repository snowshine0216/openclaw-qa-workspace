import { relative, resolve } from 'node:path';

function requirePath(path, label) {
  const value = String(path || '').trim();
  if (!value) {
    throw new Error(`Missing required ${label}`);
  }
  return resolve(value);
}

function isSubpath(parentPath, childPath) {
  const relation = relative(parentPath, childPath);
  return relation === '' || (!relation.startsWith('..') && relation !== '.');
}

export function validateCanonicalSkillRoot({ benchmarkRoot, canonicalSkillRoot }) {
  const resolvedBenchmarkRoot = requirePath(benchmarkRoot, 'benchmark root');
  const resolvedCanonicalSkillRoot = requirePath(canonicalSkillRoot, 'canonical skill root');

  if (isSubpath(resolvedBenchmarkRoot, resolvedCanonicalSkillRoot)) {
    throw new Error(
      `Canonical skill root must not resolve inside benchmark-owned directories: ${resolvedCanonicalSkillRoot}`,
    );
  }

  return resolvedCanonicalSkillRoot;
}

export function resolveCanonicalSkillRoot(benchmarkRoot) {
  const resolvedBenchmarkRoot = requirePath(benchmarkRoot, 'benchmark root');
  return validateCanonicalSkillRoot({
    benchmarkRoot: resolvedBenchmarkRoot,
    canonicalSkillRoot: resolve(resolvedBenchmarkRoot, '..', '..'),
  });
}

export function validateSkillPathContract({
  benchmarkRoot,
  canonicalSkillRoot,
  skillSnapshotPath = '',
}) {
  const resolvedCanonicalSkillRoot = validateCanonicalSkillRoot({
    benchmarkRoot,
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
  benchmarkRoot,
  runDir = '',
  skillSnapshotPath = '',
}) {
  const roots = [
    requirePath(benchmarkRoot, 'benchmark root'),
    String(runDir || '').trim() ? resolve(runDir, 'inputs') : '',
    String(skillSnapshotPath || '').trim() ? resolve(skillSnapshotPath) : '',
  ].filter(Boolean);

  return [...new Set(roots)];
}
