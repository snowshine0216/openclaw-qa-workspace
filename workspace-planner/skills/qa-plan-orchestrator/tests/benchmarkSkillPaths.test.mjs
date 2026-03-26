import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildForbiddenSkillRoots,
  resolveCanonicalSkillRoot,
  validateCanonicalSkillRoot,
  validateSkillPathContract,
} from '../benchmarks/qa-plan-v2/scripts/lib/benchmarkSkillPaths.mjs';

test('resolveCanonicalSkillRoot derives the owning skill directory above the benchmark root', () => {
  assert.equal(
    resolveCanonicalSkillRoot('/tmp/repo/workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2'),
    '/tmp/repo/workspace-planner/skills/qa-plan-orchestrator',
  );
});

test('validateCanonicalSkillRoot rejects benchmark-owned skill roots', () => {
  assert.throws(
    () => validateCanonicalSkillRoot({
      benchmarkRoot: '/tmp/repo/workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2',
      canonicalSkillRoot: '/tmp/repo/workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/iteration-0/champion_snapshot',
    }),
    /Canonical skill root must not resolve inside benchmark-owned directories/,
  );
});

test('validateSkillPathContract rejects snapshot paths equal to the canonical skill root', () => {
  assert.throws(
    () => validateSkillPathContract({
      benchmarkRoot: '/tmp/repo/workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2',
      canonicalSkillRoot: '/tmp/repo/workspace-planner/skills/qa-plan-orchestrator',
      skillSnapshotPath: '/tmp/repo/workspace-planner/skills/qa-plan-orchestrator',
    }),
    /Skill snapshot path must differ from canonical skill root/,
  );
});

test('buildForbiddenSkillRoots returns benchmark root, copied inputs, and snapshot roots without duplicates', () => {
  const roots = buildForbiddenSkillRoots({
    benchmarkRoot: '/tmp/repo/workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2',
    runDir: '/tmp/repo/workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/iteration-0/eval-1/with_skill/run-1',
    skillSnapshotPath: '/tmp/repo/workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/iteration-0/champion_snapshot',
  });

  assert.deepEqual(roots, [
    '/tmp/repo/workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2',
    '/tmp/repo/workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/iteration-0/eval-1/with_skill/run-1/inputs',
    '/tmp/repo/workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/iteration-0/champion_snapshot',
  ]);
});
