import test from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';

import {
  EXCLUSION_PATTERNS,
  ALLOWLIST_PATTERNS,
  isExcludedPath,
  isAllowedPath,
  shouldIncludeInDiscovery,
  getSkillTreeRoots,
} from './artifactDiscoveryPolicy.mjs';

test('EXCLUSION_PATTERNS contains workspace-artifacts pattern', () => {
  assert.ok(EXCLUSION_PATTERNS.includes('workspace-artifacts/**'));
});

test('EXCLUSION_PATTERNS contains benchmarks archive pattern', () => {
  assert.ok(EXCLUSION_PATTERNS.some(p => p.includes('benchmarks') && p.includes('archive')));
});

test('ALLOWLIST_PATTERNS contains .agents/skills pattern', () => {
  assert.ok(ALLOWLIST_PATTERNS.some(p => p.includes('.agents/skills')));
});

test('ALLOWLIST_PATTERNS contains workspace-*/skills pattern', () => {
  assert.ok(ALLOWLIST_PATTERNS.some(p => p.includes('workspace-') && p.includes('skills')));
});

test('isExcludedPath excludes workspace-artifacts root', () => {
  assert.equal(isExcludedPath('workspace-artifacts'), true);
});

test('isExcludedPath excludes paths under workspace-artifacts/', () => {
  assert.equal(isExcludedPath('workspace-artifacts/skills/shared/qa-plan-evolution'), true);
  assert.equal(isExcludedPath('workspace-artifacts/skills/workspace-planner/qa-plan-orchestrator'), true);
  assert.equal(isExcludedPath('workspace-artifacts/runs/run-123'), true);
});

test('isExcludedPath excludes absolute paths under workspace-artifacts/', () => {
  assert.equal(isExcludedPath('/Users/dev/openclaw-qa-workspace/workspace-artifacts/skills/shared/qa-plan-evolution'), true);
});

test('isExcludedPath excludes benchmarks/*/archive/ paths', () => {
  assert.equal(isExcludedPath('.agents/skills/qa-plan-evolution/benchmarks/qa-plan-v1/archive'), true);
  assert.equal(isExcludedPath('.agents/skills/qa-plan-evolution/benchmarks/qa-plan-v1/archive/run-1'), true);
  assert.equal(isExcludedPath('workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/archive/iteration-0'), true);
});

test('isExcludedPath does not exclude benchmarks root', () => {
  assert.equal(isExcludedPath('.agents/skills/qa-plan-evolution/benchmarks'), false);
  assert.equal(isExcludedPath('workspace-planner/skills/qa-plan-orchestrator/benchmarks'), false);
});

test('isExcludedPath does not exclude benchmarks/*/iteration paths', () => {
  assert.equal(isExcludedPath('.agents/skills/qa-plan-evolution/benchmarks/qa-plan-v1/iteration-0'), false);
  assert.equal(isExcludedPath('workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/iteration-1'), false);
});

test('isExcludedPath does not exclude source-owned skill roots', () => {
  assert.equal(isExcludedPath('.agents/skills/qa-plan-evolution'), false);
  assert.equal(isExcludedPath('workspace-planner/skills/qa-plan-orchestrator'), false);
});

test('isExcludedPath handles Windows-style paths', () => {
  assert.equal(isExcludedPath('workspace-artifacts\\skills\\shared\\qa-plan-evolution'), true);
  assert.equal(isExcludedPath('.agents\\skills\\qa-plan-evolution\\benchmarks\\qa-plan-v1\\archive'), true);
});

test('isAllowedPath allows .agents/skills/* paths', () => {
  assert.equal(isAllowedPath('.agents/skills/qa-plan-evolution'), true);
  assert.equal(isAllowedPath('.agents/skills/brave-search'), true);
  assert.equal(isAllowedPath('/Users/dev/openclaw-qa-workspace/.agents/skills/qa-plan-evolution'), true);
});

test('isAllowedPath allows workspace-*/skills/* paths', () => {
  assert.equal(isAllowedPath('workspace-planner/skills/qa-plan-orchestrator'), true);
  assert.equal(isAllowedPath('workspace-reporter/skills/defects-analysis'), true);
  assert.equal(isAllowedPath('workspace-tester/skills/test-runner'), true);
});

test('isAllowedPath rejects workspace-artifacts paths', () => {
  assert.equal(isAllowedPath('workspace-artifacts/skills/shared/qa-plan-evolution'), false);
  assert.equal(isAllowedPath('workspace-artifacts/runs/run-123'), false);
});

test('isAllowedPath rejects non-skill paths', () => {
  assert.equal(isAllowedPath('.agents/docs'), false);
  assert.equal(isAllowedPath('workspace-planner/projects'), false);
  assert.equal(isAllowedPath('random/path'), false);
});

test('shouldIncludeInDiscovery includes allowed non-excluded paths', () => {
  assert.equal(shouldIncludeInDiscovery('.agents/skills/qa-plan-evolution'), true);
  assert.equal(shouldIncludeInDiscovery('workspace-planner/skills/qa-plan-orchestrator'), true);
});

test('shouldIncludeInDiscovery excludes workspace-artifacts paths', () => {
  assert.equal(shouldIncludeInDiscovery('workspace-artifacts/skills/shared/qa-plan-evolution'), false);
});

test('shouldIncludeInDiscovery excludes benchmarks archive paths', () => {
  assert.equal(shouldIncludeInDiscovery('.agents/skills/qa-plan-evolution/benchmarks/qa-plan-v1/archive'), false);
  assert.equal(shouldIncludeInDiscovery('workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/archive/run-1'), false);
});

test('shouldIncludeInDiscovery excludes non-allowed paths', () => {
  assert.equal(shouldIncludeInDiscovery('random/path'), false);
  assert.equal(shouldIncludeInDiscovery('.agents/docs'), false);
});

test('getSkillTreeRoots returns canonical skill tree roots', () => {
  const roots = getSkillTreeRoots();
  assert.ok(Array.isArray(roots));
  assert.ok(roots.length > 0);
  assert.ok(roots.some(r => r.endsWith('.agents/skills')));
  assert.ok(roots.some(r => r.includes('workspace-planner/skills')));
});

test('getSkillTreeRoots returns absolute paths', () => {
  const roots = getSkillTreeRoots();
  roots.forEach(root => {
    assert.ok(root.startsWith('/') || /^[A-Z]:\\/.test(root), `Expected absolute path, got: ${root}`);
  });
});

test('exclusion policy prevents pollution from workspace-artifacts', () => {
  const pollutionPaths = [
    'workspace-artifacts/skills/shared/qa-plan-evolution',
    'workspace-artifacts/skills/workspace-planner/qa-plan-orchestrator',
    'workspace-artifacts/runs/run-abc123',
    'workspace-artifacts/benchmarks/qa-plan-v1',
  ];

  pollutionPaths.forEach(path => {
    assert.equal(isExcludedPath(path), true, `Expected ${path} to be excluded`);
    assert.equal(shouldIncludeInDiscovery(path), false, `Expected ${path} to not be included in discovery`);
  });
});

test('exclusion policy prevents pollution from benchmark archives', () => {
  const archivePaths = [
    '.agents/skills/qa-plan-evolution/benchmarks/qa-plan-v1/archive',
    '.agents/skills/qa-plan-evolution/benchmarks/qa-plan-v1/archive/run-1',
    'workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/archive/iteration-0',
  ];

  archivePaths.forEach(path => {
    assert.equal(isExcludedPath(path), true, `Expected ${path} to be excluded`);
  });
});

test('allowlist policy includes only source-owned skill trees', () => {
  const validSkillPaths = [
    '.agents/skills/qa-plan-evolution',
    '.agents/skills/brave-search',
    'workspace-planner/skills/qa-plan-orchestrator',
    'workspace-reporter/skills/defects-analysis',
  ];

  validSkillPaths.forEach(path => {
    assert.equal(isAllowedPath(path), true, `Expected ${path} to be allowed`);
    assert.equal(shouldIncludeInDiscovery(path), true, `Expected ${path} to be included in discovery`);
  });
});

