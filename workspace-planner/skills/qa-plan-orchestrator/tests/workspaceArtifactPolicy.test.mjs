import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  EXCLUSION_PATTERNS,
  ALLOWLIST_PATTERNS,
  isExcludedPath,
  isAllowedPath,
  shouldIncludeInDiscovery,
  getSkillTreeRoots,
} from '../../../../.agents/skills/lib/artifactDiscoveryPolicy.mjs';
import { getRepoRoot } from '../../../../.agents/skills/lib/artifactRoots.mjs';

test('workspace-artifacts/ is listed in .gitignore', () => {
  const repoRoot = getRepoRoot();
  const gitignorePath = join(repoRoot, '.gitignore');
  const gitignoreContent = readFileSync(gitignorePath, 'utf-8');

  assert.match(
    gitignoreContent,
    /^workspace-artifacts\/$/m,
    'workspace-artifacts/ must be explicitly listed in .gitignore'
  );
});

test('isExcludedPath excludes workspace-artifacts/ paths', () => {
  assert.equal(isExcludedPath('workspace-artifacts'), true);
  assert.equal(isExcludedPath('workspace-artifacts/'), true);
  assert.equal(isExcludedPath('workspace-artifacts/skills'), true);
  assert.equal(isExcludedPath('workspace-artifacts/skills/shared/qa-plan-evolution'), true);
  assert.equal(isExcludedPath('/abs/path/workspace-artifacts/runs'), true);
});

test('isExcludedPath excludes benchmarks/*/archive/ paths', () => {
  assert.equal(isExcludedPath('benchmarks/qa-plan-v1/archive'), true);
  assert.equal(isExcludedPath('benchmarks/qa-plan-v1/archive/'), true);
  assert.equal(isExcludedPath('benchmarks/qa-plan-v1/archive/run-123'), true);
  assert.equal(
    isExcludedPath('workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/archive'),
    true
  );
  assert.equal(
    isExcludedPath('/abs/path/benchmarks/qa-plan-v1/archive/iteration-0'),
    true
  );
});

test('isExcludedPath does not exclude source-owned benchmark fixtures', () => {
  assert.equal(isExcludedPath('benchmarks/qa-plan-v1/iteration-0'), false);
  assert.equal(isExcludedPath('benchmarks/qa-plan-v2/iteration-0/champion_snapshot'), false);
  assert.equal(
    isExcludedPath('workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v1'),
    false
  );
});

test('isExcludedPath does not exclude source-owned skill trees', () => {
  assert.equal(isExcludedPath('.agents/skills/qa-plan-evolution'), false);
  assert.equal(isExcludedPath('workspace-planner/skills/qa-plan-orchestrator'), false);
  assert.equal(isExcludedPath('workspace-reporter/skills/defects-analysis'), false);
  assert.equal(isExcludedPath('workspace-tester/skills/test-runner'), false);
});

test('isAllowedPath matches .agents/skills/* paths', () => {
  assert.equal(isAllowedPath('.agents/skills/qa-plan-evolution'), true);
  assert.equal(isAllowedPath('.agents/skills/lib'), true);
  assert.equal(isAllowedPath('/abs/path/.agents/skills/some-skill'), true);
});

test('isAllowedPath matches workspace-*/skills/* paths', () => {
  assert.equal(isAllowedPath('workspace-planner/skills/qa-plan-orchestrator'), true);
  assert.equal(isAllowedPath('workspace-reporter/skills/defects-analysis'), true);
  assert.equal(isAllowedPath('workspace-tester/skills/test-runner'), true);
  assert.equal(isAllowedPath('/abs/workspace-planner/skills/qa-plan-orchestrator'), true);
});

test('isAllowedPath excludes workspace-artifacts paths', () => {
  assert.equal(isAllowedPath('workspace-artifacts/skills/shared/qa-plan-evolution'), false);
  assert.equal(isAllowedPath('workspace-artifacts'), false);
});

test('isAllowedPath excludes non-skill paths', () => {
  assert.equal(isAllowedPath('workspace-planner/projects/some-project'), false);
  assert.equal(isAllowedPath('.agents/config'), false);
  assert.equal(isAllowedPath('random/path'), false);
});

test('shouldIncludeInDiscovery combines allowlist and exclusion checks', () => {
  // Allowed and not excluded
  assert.equal(shouldIncludeInDiscovery('.agents/skills/qa-plan-evolution'), true);
  assert.equal(shouldIncludeInDiscovery('workspace-planner/skills/qa-plan-orchestrator'), true);

  // Excluded even if in allowlist pattern
  assert.equal(shouldIncludeInDiscovery('workspace-artifacts/skills/shared/qa-plan-evolution'), false);

  // Not in allowlist
  assert.equal(shouldIncludeInDiscovery('workspace-planner/projects/some-project'), false);
  assert.equal(shouldIncludeInDiscovery('benchmarks/qa-plan-v1/archive'), false);
});

test('getSkillTreeRoots returns explicit allowlist rooted in source-owned skill trees', () => {
  const roots = getSkillTreeRoots();
  const repoRoot = getRepoRoot();

  assert.equal(Array.isArray(roots), true);
  assert.equal(roots.length, 4);

  // Verify explicit paths, not broad recursive scan
  assert.equal(roots[0], join(repoRoot, '.agents', 'skills'));
  assert.equal(roots[1], join(repoRoot, 'workspace-planner', 'skills'));
  assert.equal(roots[2], join(repoRoot, 'workspace-reporter', 'skills'));
  assert.equal(roots[3], join(repoRoot, 'workspace-tester', 'skills'));

  // Verify no workspace-artifacts in the list
  assert.equal(roots.some(r => r.includes('workspace-artifacts')), false);
});

test('EXCLUSION_PATTERNS contains workspace-artifacts and benchmark archives', () => {
  assert.equal(Array.isArray(EXCLUSION_PATTERNS), true);
  assert.ok(EXCLUSION_PATTERNS.includes('workspace-artifacts/**'));
  assert.ok(EXCLUSION_PATTERNS.includes('**/benchmarks/*/archive/**'));
});

test('ALLOWLIST_PATTERNS contains source-owned skill tree patterns', () => {
  assert.equal(Array.isArray(ALLOWLIST_PATTERNS), true);
  assert.ok(ALLOWLIST_PATTERNS.includes('.agents/skills/*'));
  assert.ok(ALLOWLIST_PATTERNS.includes('workspace-*/skills/*'));
});
