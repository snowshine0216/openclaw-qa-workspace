import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { tmpdir } from 'node:os';

import { buildEvidenceFreshness } from '../lib/evidenceFreshness.mjs';

async function writeJson(path, payload) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

const TARGET_SKILL_MD = `---
name: target-skill
description: Generic target skill fixture for qa-plan-evolution regression tests.
---

# Target Skill

REPORT_STATE
`;
const QA_PLAN_SKILL_MD = `---
name: qa-plan-orchestrator
description: Master orchestrator for script-driven feature QA planning. The orchestrator only calls phase scripts, interacts with the user, and spawns from phase manifests.
---

# qa-plan-orchestrator

REPORT_STATE
`;

test('evidenceFreshness blocks when a required knowledge pack is missing', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-freshness-'));
  const skillRoot = join(repoRoot, 'target-skill');

  try {
    await mkdir(join(skillRoot, 'evals'), { recursive: true });
    await writeFile(join(skillRoot, 'SKILL.md'), TARGET_SKILL_MD, 'utf8');
    await writeFile(join(skillRoot, 'reference.md'), 'REPORT_STATE\n', 'utf8');
    await writeJson(join(skillRoot, 'evals', 'evals.json'), { eval_groups: [] });

    const freshness = buildEvidenceFreshness({
      repoRoot,
      runRoot: join(repoRoot, 'runs', 'test'),
      task: {
        target_skill_path: relative(repoRoot, skillRoot),
        benchmark_profile: 'qa-plan-knowledge-pack-coverage',
        knowledge_pack_key: 'missing-pack',
      },
      profileId: 'qa-plan-knowledge-pack-coverage',
    });

    assert.equal(freshness.blocking, true);
    assert.equal(freshness.knowledge_pack.status, 'missing');
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});

test('evidenceFreshness blocks when qa-plan-knowledge-pack-coverage requires defects but no run key', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-freshness-required-defects-'));
  const skillRoot = join(repoRoot, 'workspace-planner', 'skills', 'qa-plan-orchestrator');

  try {
    await mkdir(join(skillRoot, 'evals'), { recursive: true });
    await writeFile(join(skillRoot, 'SKILL.md'), QA_PLAN_SKILL_MD, 'utf8');
    await writeFile(join(skillRoot, 'reference.md'), 'REPORT_STATE\n', 'utf8');
    await writeJson(join(skillRoot, 'evals', 'evals.json'), { eval_groups: [] });

    const freshness = buildEvidenceFreshness({
      repoRoot,
      runRoot: join(repoRoot, 'runs', 'test'),
      task: {
        target_skill_path: relative(repoRoot, skillRoot),
        benchmark_profile: 'qa-plan-knowledge-pack-coverage',
        knowledge_pack_key: null,
      },
      profileId: 'qa-plan-knowledge-pack-coverage',
    });

    assert.equal(freshness.blocking, true);
    assert.equal(freshness.defects_analysis.status, 'missing_source');
    assert.ok(
      freshness.blocking_issues.some((issue) => issue.source === 'defects_analysis'),
    );
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});

test('evidenceFreshness keeps missing eval harness non-blocking for generic targets', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-freshness-generic-'));
  const skillRoot = join(repoRoot, 'target-skill');

  try {
    await mkdir(skillRoot, { recursive: true });
    await writeFile(join(skillRoot, 'SKILL.md'), TARGET_SKILL_MD, 'utf8');
    await writeFile(join(skillRoot, 'reference.md'), 'REPORT_STATE\n', 'utf8');

    const freshness = buildEvidenceFreshness({
      repoRoot,
      runRoot: join(repoRoot, 'runs', 'test'),
      task: {
        target_skill_path: relative(repoRoot, skillRoot),
        benchmark_profile: 'generic-skill-regression',
      },
      profileId: 'generic-skill-regression',
    });

    assert.equal(freshness.blocking, false);
    assert.equal(freshness.phase2_allowed, true);
    assert.ok(
      !freshness.blocking_issues.some((issue) => issue.source.endsWith('evals/evals.json')),
    );
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});

test('evidenceFreshness marks knowledge-pack-backed evidence stale when the pack changes', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-freshness-pack-stale-'));
  const skillRoot = join(repoRoot, 'workspace-planner', 'skills', 'qa-plan-orchestrator');
  const defectsRunRoot = join(
    repoRoot,
    'workspace-reporter',
    'skills',
    'defects-analysis',
    'runs',
    'BCIN-7289',
  );

  try {
    await mkdir(join(skillRoot, 'evals'), { recursive: true });
    await mkdir(join(skillRoot, 'knowledge-packs', 'report-editor'), { recursive: true });
    await mkdir(join(defectsRunRoot, 'context'), { recursive: true });
    await writeFile(join(skillRoot, 'SKILL.md'), QA_PLAN_SKILL_MD, 'utf8');
    await writeFile(join(skillRoot, 'reference.md'), 'REPORT_STATE\n', 'utf8');
    await writeJson(join(skillRoot, 'evals', 'evals.json'), { eval_groups: [] });
    await writeJson(
      join(skillRoot, 'knowledge-packs', 'report-editor', 'pack.json'),
      { version: '2026-03-21' },
    );
    await writeFile(
      join(skillRoot, 'knowledge-packs', 'report-editor', 'pack.md'),
      '# report-editor\n',
      'utf8',
    );
    await writeJson(join(defectsRunRoot, 'context', 'analysis_freshness_BCIN-7289.json'), {
      generated_at: '2020-01-01T00:00:00.000Z',
    });
    await writeJson(join(defectsRunRoot, 'context', 'gap_bundle_BCIN-7289.json'), {
      run_key: 'BCIN-7289',
      generated_at: '2020-01-01T00:00:00.000Z',
      gaps: [],
    });
    await writeFile(
      join(defectsRunRoot, 'BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md'),
      '# Cross Analysis\n',
      'utf8',
    );
    await writeFile(
      join(defectsRunRoot, 'BCIN-7289_SELF_TEST_GAP_ANALYSIS.md'),
      '# Self-Test Gap Analysis\n',
      'utf8',
    );

    const freshness = buildEvidenceFreshness({
      repoRoot,
      runRoot: join(repoRoot, 'runs', 'test'),
      task: {
        target_skill_path: relative(repoRoot, skillRoot),
        benchmark_profile: 'qa-plan-knowledge-pack-coverage',
        knowledge_pack_key: 'report-editor',
        feature_id: 'BCIN-7289',
      },
      profileId: 'qa-plan-knowledge-pack-coverage',
    });

    assert.equal(freshness.blocking, true);
    assert.equal(freshness.knowledge_pack.status, 'stale');
    assert.equal(freshness.knowledge_pack.stale_against, 'defects_analysis');
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});
