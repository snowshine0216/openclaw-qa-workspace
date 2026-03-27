import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { resolvePlannerArtifact } from '../lib/resolvePlannerArtifact.mjs';

test('prefers plannerPlanPath when supplied', async () => {
  const overrideDir = await mkdtemp(join(tmpdir(), 'qa-summary-override-'));
  const overridePath = join(overrideDir, 'qa_plan.md');
  await writeFile(overridePath, '# Override plan');
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-run-'));
  const result = await resolvePlannerArtifact({
    featureKey: 'BCIN-7289',
    plannerRunRoot: '/tmp/planner',
    plannerPlanPath: overridePath,
    runDir,
  });
  assert.equal(result.planPath, overridePath);
});

test('uses default run-root path when plannerPlanPath not supplied', async () => {
  const plannerDir = await mkdtemp(join(tmpdir(), 'qa-summary-planner-'));
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-run-'));
  const featureDir = join(plannerDir, 'BCIN-7289');
  await mkdir(join(featureDir, 'context'), { recursive: true });
  const planPath = join(featureDir, 'qa_plan_final.md');
  await writeFile(planPath, '# Plan');
  const result = await resolvePlannerArtifact({
    featureKey: 'BCIN-7289',
    plannerRunRoot: plannerDir,
    plannerPlanPath: null,
    runDir,
  });
  assert.equal(result.planPath, planPath);
});

test('resolves absolute plannerPlanPath when supplied', async () => {
  const planDir = await mkdtemp(join(tmpdir(), 'qa-summary-plan-'));
  const planPath = join(planDir, 'qa_plan.md');
  await writeFile(planPath, '# Plan');
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-run-'));
  const result = await resolvePlannerArtifact({
    featureKey: 'BCIN-7289',
    plannerRunRoot: '/tmp/planner',
    plannerPlanPath: planPath,
    runDir,
  });
  assert.equal(result.planPath, planPath);
});

test('resolves relative planner root and plan path from repository root', async () => {
  const repoDir = await mkdtemp(join(tmpdir(), 'qa-summary-repo-'));
  const runDir = join(
    repoDir,
    'workspace-reporter',
    'skills',
    'qa-summary',
    'runs',
    'BCIN-7289'
  );
  const plannerFeatureDir = join(
    repoDir,
    'workspace-planner',
    'skills',
    'qa-plan-orchestrator',
    'runs',
    'BCIN-7289'
  );
  await mkdir(join(runDir, 'context'), { recursive: true });
  await mkdir(join(plannerFeatureDir, 'context'), { recursive: true });
  await writeFile(join(plannerFeatureDir, 'qa_plan_final.md'), '# Plan');
  await writeFile(
    join(plannerFeatureDir, 'context', 'final_plan_summary_BCIN-7289.md'),
    'Feature: BCIN-7289'
  );

  const result = await resolvePlannerArtifact({
    featureKey: 'BCIN-7289',
    plannerRunRoot: 'workspace-planner/skills/qa-plan-orchestrator/runs',
    plannerPlanPath: 'workspace-planner/skills/qa-plan-orchestrator/runs/BCIN-7289/qa_plan_final.md',
    runDir,
  });

  assert.equal(result.plannerRunRoot, join(repoDir, 'workspace-planner', 'skills', 'qa-plan-orchestrator', 'runs'));
  assert.equal(result.planPath, join(plannerFeatureDir, 'qa_plan_final.md'));
  assert.equal(
    result.summaryPath,
    join(plannerFeatureDir, 'context', 'final_plan_summary_BCIN-7289.md')
  );
});

test('absolute plannerRunRoot with .. segments is normalized to canonical path', async () => {
  const plannerDir = await mkdtemp(join(tmpdir(), 'qa-summary-planner-'));
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-run-'));
  const featureDir = join(plannerDir, 'BCIN-7289');
  await mkdir(join(featureDir, 'context'), { recursive: true });
  await writeFile(join(featureDir, 'qa_plan_final.md'), '# Plan');
  // Inject .. segments that resolve() should normalize
  const dirtyRoot = join(plannerDir, 'subdir', '..'); // resolves to plannerDir
  const result = await resolvePlannerArtifact({
    featureKey: 'BCIN-7289',
    plannerRunRoot: dirtyRoot,
    plannerPlanPath: null,
    runDir,
  });
  // plannerRunRoot returned should not contain .. segments
  assert.ok(!result.plannerRunRoot.includes('..'), 'no .. in plannerRunRoot');
  assert.equal(result.planPath, join(plannerDir, 'BCIN-7289', 'qa_plan_final.md'));
});

test('relative plannerRunRoot resolves to canonical absolute path', async () => {
  const repoDir = await mkdtemp(join(tmpdir(), 'qa-summary-repo-'));
  const runDir = join(
    repoDir,
    'workspace-reporter',
    'skills',
    'qa-summary',
    'runs',
    'BCIN-7289'
  );
  const plannerFeatureDir = join(
    repoDir,
    'workspace-planner',
    'skills',
    'qa-plan-orchestrator',
    'runs',
    'BCIN-7289'
  );
  await mkdir(join(runDir, 'context'), { recursive: true });
  await mkdir(join(plannerFeatureDir, 'context'), { recursive: true });
  await writeFile(join(plannerFeatureDir, 'qa_plan_final.md'), '# Plan');

  const result = await resolvePlannerArtifact({
    featureKey: 'BCIN-7289',
    plannerRunRoot: 'workspace-planner/skills/qa-plan-orchestrator/runs',
    plannerPlanPath: null,
    runDir,
  });
  // plannerRunRoot must be absolute (no relative segments)
  assert.ok(result.plannerRunRoot.startsWith('/'), 'plannerRunRoot is absolute');
  assert.ok(!result.plannerRunRoot.includes('..'), 'no .. in plannerRunRoot');
});

test('planPath returned by resolvePlannerArtifact contains no .. segments', async () => {
  const plannerDir = await mkdtemp(join(tmpdir(), 'qa-summary-planner-'));
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-run-'));
  const featureDir = join(plannerDir, 'BCIN-7289');
  await mkdir(featureDir, { recursive: true });
  await writeFile(join(featureDir, 'qa_plan_final.md'), '# Plan');
  const result = await resolvePlannerArtifact({
    featureKey: 'BCIN-7289',
    plannerRunRoot: plannerDir,
    plannerPlanPath: null,
    runDir,
  });
  assert.ok(!result.planPath.includes('..'), 'planPath has no .. segments');
});

test('throws when plannerRunRoot is null', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-run-'));
  await assert.rejects(
    () => resolvePlannerArtifact({ featureKey: 'BCIN-7289', plannerRunRoot: null, runDir }),
    { message: /plannerRunRoot is required/ }
  );
});

test('merges planner summary markdown into seed markdown when both summary and plan exist', async () => {
  const plannerDir = await mkdtemp(join(tmpdir(), 'qa-summary-planner-'));
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-run-'));
  const featureDir = join(plannerDir, 'BCIN-7289');
  await mkdir(join(featureDir, 'context'), { recursive: true });
  await writeFile(
    join(featureDir, 'qa_plan_final.md'),
    [
      '# QA Plan',
      '',
      '## Core Functional Flows',
      '- Validate checkout.',
    ].join('\n')
  );
  await writeFile(
    join(featureDir, 'context', 'final_plan_summary_BCIN-7289.md'),
    'Planner summary references https://github.com/org/app/pull/321'
  );

  const result = await resolvePlannerArtifact({
    featureKey: 'BCIN-7289',
    plannerRunRoot: plannerDir,
    plannerPlanPath: null,
    runDir,
  });

  assert.match(result.seedMarkdown, /Planner summary references https:\/\/github\.com\/org\/app\/pull\/321/);
  assert.match(result.seedMarkdown, /## Core Functional Flows/);
});
