import test from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';

import {
  benchmarkDefinitionRoot,
  benchmarkArchiveRoot,
  benchmarkRuntimeRoot,
  resolveArchiveCompatiblePath,
  buildForbiddenSkillRoots,
  resolveCanonicalSkillRoot,
  validateCanonicalSkillRoot,
  validateSkillPathContract,
} from '../benchmarks/qa-plan-v2/scripts/lib/benchmarkSkillPaths.mjs';

test('benchmarkDefinitionRoot returns path in source tree', () => {
  const root = benchmarkDefinitionRoot('qa-plan-v2');
  assert.ok(root.endsWith('workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2'));
});

test('benchmarkDefinitionRoot throws on invalid family', () => {
  assert.throws(
    () => benchmarkDefinitionRoot(''),
    /family must be a non-empty string/,
  );
  assert.throws(
    () => benchmarkDefinitionRoot(null),
    /family must be a non-empty string/,
  );
});

test('benchmarkArchiveRoot returns archive subdirectory under definition root', () => {
  const root = benchmarkArchiveRoot('qa-plan-v2');
  assert.ok(root.endsWith('workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/archive'));
});

test('benchmarkRuntimeRoot returns path in workspace-artifacts', () => {
  const root = benchmarkRuntimeRoot('qa-plan-v2');
  assert.ok(root.includes('workspace-artifacts'));
  assert.ok(root.endsWith('skills/workspace-planner/qa-plan-orchestrator/benchmarks/qa-plan-v2'));
});

test('benchmarkRuntimeRoot throws on invalid family', () => {
  assert.throws(
    () => benchmarkRuntimeRoot(''),
    /family must be a non-empty string/,
  );
});

test('resolveArchiveCompatiblePath resolves archive paths to definition root', () => {
  const resolved = resolveArchiveCompatiblePath(
    'qa-plan-v2',
    'benchmarks/qa-plan-v2/archive/baseline-1/evidence.json'
  );
  assert.ok(resolved.includes('workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/archive'));
  assert.ok(resolved.endsWith('baseline-1/evidence.json'));
});

test('resolveArchiveCompatiblePath resolves non-archive paths to runtime root', () => {
  const resolved = resolveArchiveCompatiblePath(
    'qa-plan-v2',
    'iteration-0/eval-1/evidence.json'
  );
  assert.ok(resolved.includes('workspace-artifacts'));
  assert.ok(resolved.endsWith('iteration-0/eval-1/evidence.json'));
});

test('resolveArchiveCompatiblePath throws on invalid parameters', () => {
  assert.throws(
    () => resolveArchiveCompatiblePath('', 'path'),
    /family must be a non-empty string/,
  );
  assert.throws(
    () => resolveArchiveCompatiblePath('qa-plan-v2', ''),
    /relativePath must be a non-empty string/,
  );
});

test('resolveCanonicalSkillRoot derives the owning skill directory above the benchmark definition root', () => {
  assert.equal(
    resolveCanonicalSkillRoot('/tmp/repo/workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2'),
    '/tmp/repo/workspace-planner/skills/qa-plan-orchestrator',
  );
});

test('validateCanonicalSkillRoot rejects benchmark-owned skill roots', () => {
  assert.throws(
    () => validateCanonicalSkillRoot({
      benchmarkDefinitionRoot: '/tmp/repo/workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2',
      canonicalSkillRoot: '/tmp/repo/workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/iteration-0/champion_snapshot',
    }),
    /Canonical skill root must not resolve inside benchmark-owned directories/,
  );
});

test('validateSkillPathContract rejects snapshot paths equal to the canonical skill root', () => {
  assert.throws(
    () => validateSkillPathContract({
      benchmarkDefinitionRoot: '/tmp/repo/workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2',
      canonicalSkillRoot: '/tmp/repo/workspace-planner/skills/qa-plan-orchestrator',
      skillSnapshotPath: '/tmp/repo/workspace-planner/skills/qa-plan-orchestrator',
    }),
    /Skill snapshot path must differ from canonical skill root/,
  );
});

test('buildForbiddenSkillRoots returns benchmark definition root, copied inputs, and snapshot roots without duplicates', () => {
  const roots = buildForbiddenSkillRoots({
    benchmarkDefinitionRoot: '/tmp/repo/workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2',
    runDir: '/tmp/repo/workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/iteration-0/eval-1/with_skill/run-1',
    skillSnapshotPath: '/tmp/repo/workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/iteration-0/champion_snapshot',
  });

  assert.deepEqual(roots, [
    '/tmp/repo/workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2',
    '/tmp/repo/workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/iteration-0/eval-1/with_skill/run-1/inputs',
    '/tmp/repo/workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/iteration-0/champion_snapshot',
  ]);
});
