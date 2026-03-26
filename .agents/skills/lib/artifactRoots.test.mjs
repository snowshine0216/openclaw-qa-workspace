import test from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';

import {
  getRepoRoot,
  getWorkspaceArtifactRoot,
  resolveCanonicalSkillRoot,
  getSkillArtifactRoot,
  getRunRoot,
  getBenchmarkRuntimeRoot,
} from './artifactRoots.mjs';

test('getRepoRoot returns the workspace root', () => {
  const repoRoot = getRepoRoot();
  assert.ok(repoRoot.endsWith('openclaw-qa-workspace'));
});

test('getWorkspaceArtifactRoot returns workspace-artifacts by default', () => {
  const originalArtifactRoot = process.env.ARTIFACT_ROOT;
  delete process.env.ARTIFACT_ROOT;

  const artifactRoot = getWorkspaceArtifactRoot();
  assert.ok(artifactRoot.endsWith('workspace-artifacts'));

  if (originalArtifactRoot) {
    process.env.ARTIFACT_ROOT = originalArtifactRoot;
  }
});

test('getWorkspaceArtifactRoot respects ARTIFACT_ROOT override', () => {
  const originalArtifactRoot = process.env.ARTIFACT_ROOT;
  process.env.ARTIFACT_ROOT = '/tmp/custom-artifacts';

  const artifactRoot = getWorkspaceArtifactRoot();
  assert.equal(artifactRoot, '/tmp/custom-artifacts');

  if (originalArtifactRoot) {
    process.env.ARTIFACT_ROOT = originalArtifactRoot;
  } else {
    delete process.env.ARTIFACT_ROOT;
  }
});

test('getSkillArtifactRoot maps shared skills to workspace-artifacts/skills/shared/<skill-name>', () => {
  const originalArtifactRoot = process.env.ARTIFACT_ROOT;
  process.env.ARTIFACT_ROOT = '/tmp/test-artifacts';

  const skillRoot = getSkillArtifactRoot('shared', 'qa-plan-evolution');
  assert.equal(skillRoot, '/tmp/test-artifacts/skills/shared/qa-plan-evolution');

  if (originalArtifactRoot) {
    process.env.ARTIFACT_ROOT = originalArtifactRoot;
  } else {
    delete process.env.ARTIFACT_ROOT;
  }
});

test('getSkillArtifactRoot maps workspace-local skills to workspace-artifacts/skills/<workspace-name>/<skill-name>', () => {
  const originalArtifactRoot = process.env.ARTIFACT_ROOT;
  process.env.ARTIFACT_ROOT = '/tmp/test-artifacts';

  const skillRoot = getSkillArtifactRoot('workspace-planner', 'qa-plan-orchestrator');
  assert.equal(skillRoot, '/tmp/test-artifacts/skills/workspace-planner/qa-plan-orchestrator');

  if (originalArtifactRoot) {
    process.env.ARTIFACT_ROOT = originalArtifactRoot;
  } else {
    delete process.env.ARTIFACT_ROOT;
  }
});

test('getRunRoot returns run root under skill artifact root', () => {
  const originalArtifactRoot = process.env.ARTIFACT_ROOT;
  process.env.ARTIFACT_ROOT = '/tmp/test-artifacts';

  const runRoot = getRunRoot('shared', 'qa-plan-evolution', 'run-abc123');
  assert.equal(runRoot, '/tmp/test-artifacts/skills/shared/qa-plan-evolution/runs/run-abc123');

  if (originalArtifactRoot) {
    process.env.ARTIFACT_ROOT = originalArtifactRoot;
  } else {
    delete process.env.ARTIFACT_ROOT;
  }
});

test('getBenchmarkRuntimeRoot returns benchmark runtime root under skill artifact root', () => {
  const originalArtifactRoot = process.env.ARTIFACT_ROOT;
  process.env.ARTIFACT_ROOT = '/tmp/test-artifacts';

  const benchmarkRoot = getBenchmarkRuntimeRoot('workspace-planner', 'qa-plan-orchestrator', 'qa-plan-v2');
  assert.equal(benchmarkRoot, '/tmp/test-artifacts/skills/workspace-planner/qa-plan-orchestrator/benchmarks/qa-plan-v2');

  if (originalArtifactRoot) {
    process.env.ARTIFACT_ROOT = originalArtifactRoot;
  } else {
    delete process.env.ARTIFACT_ROOT;
  }
});

test('resolveCanonicalSkillRoot returns skillRoot when FQPO_CANONICAL_SKILL_ROOT is not set', () => {
  const originalCanonicalRoot = process.env.FQPO_CANONICAL_SKILL_ROOT;
  delete process.env.FQPO_CANONICAL_SKILL_ROOT;

  const result = resolveCanonicalSkillRoot('/some/skill/root');
  assert.equal(result, '/some/skill/root');

  if (originalCanonicalRoot) {
    process.env.FQPO_CANONICAL_SKILL_ROOT = originalCanonicalRoot;
  }
});

test('resolveCanonicalSkillRoot returns FQPO_CANONICAL_SKILL_ROOT when skillRoot is a candidate_snapshot', () => {
  const originalCanonicalRoot = process.env.FQPO_CANONICAL_SKILL_ROOT;
  process.env.FQPO_CANONICAL_SKILL_ROOT = '/canonical/skill/root';

  const result = resolveCanonicalSkillRoot('/some/benchmark/iteration-1/candidate_snapshot');
  assert.equal(result, '/canonical/skill/root');

  if (originalCanonicalRoot) {
    process.env.FQPO_CANONICAL_SKILL_ROOT = originalCanonicalRoot;
  } else {
    delete process.env.FQPO_CANONICAL_SKILL_ROOT;
  }
});

test('resolveCanonicalSkillRoot returns FQPO_CANONICAL_SKILL_ROOT when skillRoot is a champion_snapshot', () => {
  const originalCanonicalRoot = process.env.FQPO_CANONICAL_SKILL_ROOT;
  process.env.FQPO_CANONICAL_SKILL_ROOT = '/canonical/skill/root';

  const result = resolveCanonicalSkillRoot('/some/benchmark/iteration-0/champion_snapshot');
  assert.equal(result, '/canonical/skill/root');

  if (originalCanonicalRoot) {
    process.env.FQPO_CANONICAL_SKILL_ROOT = originalCanonicalRoot;
  } else {
    delete process.env.FQPO_CANONICAL_SKILL_ROOT;
  }
});

test('resolveCanonicalSkillRoot ignores FQPO_CANONICAL_SKILL_ROOT when skillRoot is not a snapshot', () => {
  const originalCanonicalRoot = process.env.FQPO_CANONICAL_SKILL_ROOT;
  process.env.FQPO_CANONICAL_SKILL_ROOT = '/canonical/skill/root';

  const result = resolveCanonicalSkillRoot('/some/skill/root');
  assert.equal(result, '/some/skill/root');

  if (originalCanonicalRoot) {
    process.env.FQPO_CANONICAL_SKILL_ROOT = originalCanonicalRoot;
  } else {
    delete process.env.FQPO_CANONICAL_SKILL_ROOT;
  }
});

test('ARTIFACT_ROOT override redirects all artifact roots without changing source-owned definition roots', () => {
  const originalArtifactRoot = process.env.ARTIFACT_ROOT;
  process.env.ARTIFACT_ROOT = '/tmp/override-artifacts';

  const sharedSkillRoot = getSkillArtifactRoot('shared', 'qa-plan-evolution');
  const workspaceSkillRoot = getSkillArtifactRoot('workspace-planner', 'qa-plan-orchestrator');
  const runRoot = getRunRoot('workspace-reporter', 'defects-analysis', 'run-xyz');
  const benchmarkRoot = getBenchmarkRuntimeRoot('workspace-planner', 'qa-plan-orchestrator', 'qa-plan-v1');

  assert.ok(sharedSkillRoot.startsWith('/tmp/override-artifacts'));
  assert.ok(workspaceSkillRoot.startsWith('/tmp/override-artifacts'));
  assert.ok(runRoot.startsWith('/tmp/override-artifacts'));
  assert.ok(benchmarkRoot.startsWith('/tmp/override-artifacts'));

  if (originalArtifactRoot) {
    process.env.ARTIFACT_ROOT = originalArtifactRoot;
  } else {
    delete process.env.ARTIFACT_ROOT;
  }
});
