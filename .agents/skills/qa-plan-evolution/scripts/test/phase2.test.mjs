import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import {
  buildMutationBacklog,
  categoryLabel,
  categoryRank,
  seedGapTaxonomyAndBacklog,
} from '../lib/mutationBacklog.mjs';
import {
  normalizeObservationForPromotion,
  normalizeSourceResultsForPromotion,
} from '../lib/generalizationGuard.mjs';

const REPO_ROOT = join(fileURLToPath(new URL('../../../../../', import.meta.url)));
const PHASE2 = join(REPO_ROOT, '.agents/skills/qa-plan-evolution/scripts/phase2.sh');

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

test('phase2 generic profile stays empty on a clean baseline without prior failures', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-phase2-generic-'));
  try {
    const skillRoot = join(repoRoot, 'target-skill');
    await mkdir(join(skillRoot, 'evals'), { recursive: true });
    await writeFile(join(skillRoot, 'SKILL.md'), TARGET_SKILL_MD, 'utf8');
    await writeFile(join(skillRoot, 'reference.md'), '# Target Reference\n\nREPORT_STATE\n', 'utf8');
    await writeJson(join(skillRoot, 'evals', 'evals.json'), {
      eval_groups: [
        { id: 'core_contract', policy: 'blocking', prompt: 'keep contract coverage' },
      ],
    });

    const result = await seedGapTaxonomyAndBacklog({
      repoRoot,
      runRoot: join(repoRoot, 'runs', 'test'),
      task: {
        target_skill_path: 'target-skill',
        benchmark_profile: 'generic-skill-regression',
      },
    });

    assert.ok(result.source_results.length >= 2);
    assert.equal(result.mutations.length, 0);
    assert.ok(
      result.source_results.every((sourceResult) => sourceResult.source_type !== 'defects_cross_analysis'),
    );
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});

test('phase2 generic profile seeds mutations from fresh target eval failures', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-phase2-failing-evals-'));
  try {
    const skillRoot = join(repoRoot, 'target-skill');
    await mkdir(join(skillRoot, 'evals'), { recursive: true });
    await writeFile(join(skillRoot, 'SKILL.md'), TARGET_SKILL_MD, 'utf8');
    await writeFile(join(skillRoot, 'reference.md'), '# Target Reference\n\nREPORT_STATE\n', 'utf8');
    await writeJson(join(skillRoot, 'package.json'), {
      name: 'target-skill',
      private: true,
      type: 'module',
      scripts: {
        test: 'node -e "process.exit(0)"',
      },
    });
    await writeJson(join(skillRoot, 'evals', 'evals.json'), {
      eval_groups: [
        { id: 'core_contract', policy: 'blocking', prompt: 'keep contract coverage' },
      ],
    });
    await writeFile(
      join(skillRoot, 'evals', 'run_evals.mjs'),
      "console.error('failing eval group: core_contract'); process.exit(1);\n",
      'utf8',
    );

    const result = await seedGapTaxonomyAndBacklog({
      repoRoot,
      runRoot: join(repoRoot, 'runs', 'test'),
      task: {
        target_skill_path: 'target-skill',
        benchmark_profile: 'generic-skill-regression',
      },
    });

    const evalSource = result.source_results.find(
      (sourceResult) => sourceResult.source_type === 'target_eval_failures',
    );
    assert.equal(evalSource.status, 'ok');
    assert.ok(evalSource.observations.length > 0);
    assert.ok(result.mutations.length > 0);
    assert.ok(
      result.mutations.some((mutation) => mutation.evals_affected.includes('core_contract')),
    );
    assert.ok(
      result.mutations.some((mutation) =>
        mutation.target_files.includes('target-skill/evals/evals.json'),
      ),
    );
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});

test('phase2 qa-plan profile consumes defects-analysis and knowledge-pack observations', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-phase2-qa-plan-'));
  try {
    const qaPlanRoot = join(repoRoot, 'workspace-planner', 'skills', 'qa-plan-orchestrator');
    const defectsRunRoot = join(repoRoot, 'workspace-reporter', 'skills', 'defects-analysis', 'runs', 'BCIN-7289');
    await mkdir(join(qaPlanRoot, 'evals'), { recursive: true });
    await mkdir(join(qaPlanRoot, 'references'), { recursive: true });
    await mkdir(join(qaPlanRoot, 'scripts', 'lib'), { recursive: true });
    await mkdir(join(qaPlanRoot, 'knowledge-packs', 'report-editor'), { recursive: true });
    await mkdir(join(defectsRunRoot, 'context'), { recursive: true });

    await writeFile(join(qaPlanRoot, 'SKILL.md'), QA_PLAN_SKILL_MD, 'utf8');
    await writeFile(join(qaPlanRoot, 'reference.md'), '# reference\n\nREPORT_STATE\n', 'utf8');
    await writeFile(join(qaPlanRoot, 'README.md'), 'developer_smoke_test_\n', 'utf8');
    await writeFile(join(qaPlanRoot, 'references', 'phase4a-contract.md'), 'template-based creation\n', 'utf8');
    await writeFile(join(qaPlanRoot, 'references', 'review-rubric-phase5a.md'), 'pause-mode prompts\n', 'utf8');
    await writeFile(join(qaPlanRoot, 'references', 'review-rubric-phase5b.md'), '[ANALOG-GATE] save dialog completeness and interactivity\n', 'utf8');
    await writeFile(join(qaPlanRoot, 'scripts', 'lib', 'finalPlanSummary.mjs'), 'developer_smoke_test_\n', 'utf8');
    await writeJson(join(qaPlanRoot, 'evals', 'evals.json'), {
      eval_groups: [
        { id: 'defect_recall_replay', policy: 'blocking', prompt: 'replay' },
        { id: 'knowledge_pack_coverage', policy: 'blocking', prompt: 'knowledge pack' },
      ],
    });
    await writeJson(join(qaPlanRoot, 'knowledge-packs', 'report-editor', 'pack.json'), {
      version: '2026-03-21',
      required_capabilities: ['template-based creation'],
      analog_gates: [{ behavior: 'save dialog completeness and interactivity', required_gate: true }],
      sdk_visible_contracts: [],
      interaction_pairs: [['template-based creation', 'pause-mode prompts']],
    });
    await writeFile(join(qaPlanRoot, 'knowledge-packs', 'report-editor', 'pack.md'), '# pack\n', 'utf8');

    await writeJson(join(defectsRunRoot, 'context', 'analysis_freshness_BCIN-7289.json'), {
      generated_at: '2026-03-22T00:00:00.000Z',
    });
    await writeJson(join(defectsRunRoot, 'context', 'gap_bundle_BCIN-7289.json'), {
      run_key: 'BCIN-7289',
      generated_at: '2026-03-22T00:00:00.000Z',
      feature_id: 'BCIN-7289',
      feature_family: 'report-editor',
      source_artifacts: ['BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md'],
      gaps: [
        {
          gap_id: 'gap-1',
          root_cause_bucket: 'developer_artifact_missing',
          severity: 'high',
          title: 'Developer smoke artifact missing',
          summary: 'Developer smoke checklist is missing from final output.',
          source_defects: ['BCIN-7667'],
          affected_phase: 'phase7',
          recommended_target_files: [
            'workspace-planner/skills/qa-plan-orchestrator/scripts/lib/finalPlanSummary.mjs',
          ],
          recommended_change_type: 'artifact_generation',
          generalization_scope: 'feature_family',
          feature_family: 'report-editor',
        },
      ],
    });
    await writeFile(
      join(defectsRunRoot, 'BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md'),
      '# Cross Analysis\n\n- missing scenario for save dialog completeness\n',
      'utf8',
    );
    await writeFile(
      join(defectsRunRoot, 'BCIN-7289_SELF_TEST_GAP_ANALYSIS.md'),
      '# Self-Test Gap Analysis\n\n- developer smoke gap for save dialog completeness\n',
      'utf8',
    );

    const result = await seedGapTaxonomyAndBacklog({
      repoRoot,
      runRoot: join(repoRoot, 'runs', 'test'),
      task: {
        target_skill_path: 'workspace-planner/skills/qa-plan-orchestrator',
        benchmark_profile: 'qa-plan-defect-recall',
        knowledge_pack_key: 'report-editor',
        feature_id: 'BCIN-7289',
      },
    });

    const sourceTypes = result.source_results.map((sourceResult) => sourceResult.source_type);
    assert.ok(sourceTypes.includes('defects_cross_analysis'));
    assert.ok(sourceTypes.includes('knowledge_pack_coverage'));
    assert.ok(result.taxonomy.gaps.some((gap) => gap.bucket === 'developer_artifact_missing'));
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});

test('phase2 prefers structured gap bundle over markdown fallback', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-phase2-gap-bundle-'));
  try {
    const qaPlanRoot = join(repoRoot, 'workspace-planner', 'skills', 'qa-plan-orchestrator');
    const defectsRunRoot = join(repoRoot, 'workspace-reporter', 'skills', 'defects-analysis', 'runs', 'BCIN-7289');
    await mkdir(join(qaPlanRoot, 'evals'), { recursive: true });
    await mkdir(join(qaPlanRoot, 'references'), { recursive: true });
    await mkdir(join(defectsRunRoot, 'context'), { recursive: true });

    await writeFile(join(qaPlanRoot, 'SKILL.md'), QA_PLAN_SKILL_MD, 'utf8');
    await writeFile(join(qaPlanRoot, 'reference.md'), '# reference\n\nREPORT_STATE\n', 'utf8');
    await writeFile(join(qaPlanRoot, 'references', 'phase4a-contract.md'), 'contract\n', 'utf8');
    await writeFile(join(qaPlanRoot, 'references', 'review-rubric-phase5a.md'), 'review5a\n', 'utf8');
    await writeFile(join(qaPlanRoot, 'references', 'review-rubric-phase5b.md'), 'review5b\n', 'utf8');
    await writeJson(join(qaPlanRoot, 'evals', 'evals.json'), {
      eval_groups: [{ id: 'defect_recall_replay', policy: 'blocking', prompt: 'replay' }],
    });

    await writeJson(join(defectsRunRoot, 'context', 'analysis_freshness_BCIN-7289.json'), {
      generated_at: '2026-03-22T00:00:00.000Z',
    });
    await writeJson(join(defectsRunRoot, 'context', 'gap_bundle_BCIN-7289.json'), {
      run_key: 'BCIN-7289',
      generated_at: '2026-03-22T00:00:00.000Z',
      feature_id: 'BCIN-7289',
      feature_family: 'report-editor',
      source_artifacts: ['BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md'],
      gaps: [
        {
          gap_id: 'gap-structured',
          root_cause_bucket: 'developer_artifact_missing',
          severity: 'high',
          title: 'Structured bundle gap',
          summary: 'Structured gap should win over markdown fallback.',
          source_defects: ['BCIN-7777'],
          affected_phase: 'phase7',
          recommended_target_files: [
            'workspace-planner/skills/qa-plan-orchestrator/scripts/lib/finalPlanSummary.mjs',
          ],
          recommended_change_type: 'artifact_generation',
          generalization_scope: 'feature_family',
          feature_family: 'report-editor',
        },
      ],
    });
    await writeFile(
      join(defectsRunRoot, 'BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md'),
      '# Cross Analysis\n\n- missing scenario from markdown fallback\n',
      'utf8',
    );
    await writeFile(
      join(defectsRunRoot, 'BCIN-7289_SELF_TEST_GAP_ANALYSIS.md'),
      '# Self-Test Gap Analysis\n\n- missing scenario from markdown fallback\n',
      'utf8',
    );

    const result = await seedGapTaxonomyAndBacklog({
      repoRoot,
      runRoot: join(repoRoot, 'runs', 'test'),
      task: {
        target_skill_path: 'workspace-planner/skills/qa-plan-orchestrator',
        benchmark_profile: 'qa-plan-defect-recall',
        feature_id: 'BCIN-7289',
      },
    });

    assert.ok(result.taxonomy.gaps.some((gap) => gap.bucket === 'developer_artifact_missing'));
    assert.ok(!result.taxonomy.gaps.some((gap) => gap.bucket === 'missing_scenario'));
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});

test('phase2 clusters related observations into one bounded mutation candidate', () => {
  const sourceResults = [
    {
      source_type: 'knowledge_pack_coverage',
      required: true,
      status: 'ok',
      errors: [],
      observations: [
        {
          id: 'obs-pack-1',
          source_type: 'knowledge_pack_coverage',
          source_path: 'pack.json',
          summary: 'Capability A missing coverage',
          details: 'Capability A needs a mapped scenario',
          taxonomy_candidates: ['knowledge_pack_gap'],
          target_files: ['skill/references/phase4a-contract.md', 'skill/evals/evals.json'],
          evals_affected: ['knowledge_pack_coverage'],
        },
        {
          id: 'obs-pack-2',
          source_type: 'knowledge_pack_coverage',
          source_path: 'pack.json',
          summary: 'Capability B missing coverage',
          details: 'Capability B needs a mapped scenario',
          taxonomy_candidates: ['knowledge_pack_gap'],
          target_files: ['skill/eferences/phase4a-contract.md'.replace('eferences', 'references'), 'skill/evals/evals.json'],
          evals_affected: ['knowledge_pack_coverage'],
        },
      ],
    },
  ];

  const result = buildMutationBacklog({
    taxonomy: {
      buckets: ['knowledge_pack_gap'],
      gaps: [
        {
          bucket: 'knowledge_pack_gap',
          hypothesis_key:
            'knowledge_pack_gap|evals:knowledge_pack_coverage|files:skill/evals/evals.json,skill/references/phase4a-contract.md|pack:',
          summary: '2 observations indicate knowledge_pack_gap',
          evidence: ['pack.json'],
          source_observation_ids: ['obs-pack-1', 'obs-pack-2'],
          target_files: ['skill/evals/evals.json', 'skill/references/phase4a-contract.md'],
          evals_affected: ['knowledge_pack_coverage'],
        },
      ],
    },
    sourceResults,
  });

  assert.equal(result.length, 1);
  assert.deepEqual(result[0].source_observation_ids, ['obs-pack-1', 'obs-pack-2']);
  assert.equal(result[0].mutation_category, 'rubric_update');
  assert.equal(result[0].priority.category_rank, 2);
});

test('categoryRank and categoryLabel map target files to mutation categories', () => {
  assert.equal(categoryRank(['skill/knowledge-packs/report-editor/pack.json']), 1);
  assert.equal(categoryRank(['skill/references/review-rubric-phase5a.md']), 2);
  assert.equal(categoryRank(['skill/SKILL.md']), 3);
  assert.equal(categoryRank(['skill/scripts/phase1.sh']), 4);
  assert.equal(categoryLabel(1), 'knowledge_pack_enrichment');
  assert.equal(categoryLabel(2), 'rubric_update');
  assert.equal(categoryLabel(3), 'template_update');
  assert.equal(categoryLabel(4), 'collection_stage');
});

test('phase2 rejects mutation candidates that mix hypotheses under one root-cause bucket', () => {
  const sourceResults = [
    {
      source_type: 'knowledge_pack_coverage',
      required: true,
      status: 'ok',
      errors: [],
      observations: [
        {
          id: 'obs-pack-capability',
          source_type: 'knowledge_pack_coverage',
          source_path: 'pack.json',
          summary: 'Capability missing coverage',
          details: 'Capability must map to a scenario',
          taxonomy_candidates: ['knowledge_pack_gap'],
          target_files: ['skill/references/phase4a-contract.md'],
          evals_affected: ['knowledge_pack_coverage'],
        },
        {
          id: 'obs-pack-analog',
          source_type: 'knowledge_pack_coverage',
          source_path: 'pack.json',
          summary: 'Analog gate missing coverage',
          details: 'Analog gate must map to release recommendation',
          taxonomy_candidates: ['knowledge_pack_gap', 'analog_risk_not_gated'],
          target_files: ['skill/references/review-rubric-phase5b.md'],
          evals_affected: ['developer_smoke_generation'],
        },
      ],
    },
  ];

  assert.throws(
    () =>
      buildMutationBacklog({
        taxonomy: {
          buckets: ['knowledge_pack_gap'],
          gaps: [
            {
              bucket: 'knowledge_pack_gap',
              hypothesis_key: 'knowledge_pack_gap|evals:developer_smoke_generation|files:skill/references/review-rubric-phase5b.md|pack:',
              summary: 'mixed cluster',
              evidence: ['pack.json'],
              source_observation_ids: ['obs-pack-capability', 'obs-pack-analog'],
              target_files: [
                'skill/references/phase4a-contract.md',
                'skill/references/review-rubric-phase5b.md',
              ],
              evals_affected: ['knowledge_pack_coverage', 'developer_smoke_generation'],
            },
          ],
        },
        sourceResults,
      }),
    /mixed root-cause hypotheses/i,
  );
});

test('markdown fallback defects observations are advisory-only for promotion', () => {
  const normalized = normalizeSourceResultsForPromotion(
    {
      target_skill_path: 'workspace-planner/skills/qa-plan-orchestrator',
      knowledge_pack_key: 'report-editor',
    },
    [
      {
        source_type: 'defects_cross_analysis',
        required: true,
        status: 'ok',
        errors: [],
        observations: [
          {
            id: 'obs-fallback',
            source_type: 'defects_cross_analysis',
            source_path: 'fallback.md',
            summary: 'Fix BCIN-7289 in shared rubric',
            details: 'Fix BCIN-7289 in shared rubric',
            taxonomy_candidates: ['missing_scenario'],
            target_files: [],
            evals_affected: ['defect_recall_replay'],
            advisory_only: true,
            promotion_eligible: false,
          },
        ],
      },
    ],
  );

  assert.equal(normalized[0].observations.length, 0);
});

test('feature-family scoped defects normalize to knowledge-pack mutation targets', () => {
  const normalized = normalizeObservationForPromotion(
    {
      target_skill_path: 'workspace-planner/skills/qa-plan-orchestrator',
      knowledge_pack_key: 'report-editor',
    },
    {
      id: 'obs-structured',
      source_type: 'defects_cross_analysis',
      source_path: 'gap_bundle.json',
      summary: 'Prompt handling gap needs reusable rule',
      details: 'Prompt handling gap needs reusable rule',
      taxonomy_candidates: ['interaction_gap'],
      target_files: [
        'workspace-planner/skills/qa-plan-orchestrator/references/review-rubric-phase5a.md',
      ],
      evals_affected: ['defect_recall_replay'],
      generalization_scope: 'feature_family',
      knowledge_pack_key: 'report-editor',
    },
  );

  assert.deepEqual(normalized.target_files, [
    'workspace-planner/skills/qa-plan-orchestrator/knowledge-packs/report-editor/pack.json',
    'workspace-planner/skills/qa-plan-orchestrator/knowledge-packs/report-editor/pack.md',
  ]);
});

test('shared-scope defects without explicit proof are rejected for promotion', () => {
  const normalized = normalizeObservationForPromotion(
    {
      target_skill_path: 'workspace-planner/skills/qa-plan-orchestrator',
      knowledge_pack_key: 'report-editor',
    },
    {
      id: 'obs-shared-without-proof',
      source_type: 'defects_cross_analysis',
      source_path: 'gap_bundle.json',
      summary: 'Require a reusable shared rubric rule for save dialog completeness.',
      details: 'Require a reusable shared rubric rule for save dialog completeness.',
      taxonomy_candidates: ['interaction_gap'],
      target_files: [
        'workspace-planner/skills/qa-plan-orchestrator/references/review-rubric-phase5a.md',
      ],
      evals_affected: ['defect_recall_replay'],
      generalization_scope: 'shared_rule',
      generalized_rule: 'Require save dialog completeness.',
      target_surface: 'review_rubric_phase5a',
      source_examples: ['save dialog completeness'],
      allowed_mutation_scope: ['rubric_update'],
      feature_family: 'report-editor',
    },
  );

  assert.equal(normalized, null);
});

test('shared-scope defects with explicit proof remain promotion-eligible', () => {
  const normalized = normalizeObservationForPromotion(
    {
      target_skill_path: 'workspace-planner/skills/qa-plan-orchestrator',
      knowledge_pack_key: 'report-editor',
    },
    {
      id: 'obs-shared-with-proof',
      source_type: 'defects_cross_analysis',
      source_path: 'gap_bundle.json',
      summary: 'Require interaction-pair completeness gates for save-dialog-class flows.',
      details: 'Require interaction-pair completeness gates for save-dialog-class flows.',
      taxonomy_candidates: ['interaction_gap'],
      target_files: [
        'workspace-planner/skills/qa-plan-orchestrator/references/review-rubric-phase5a.md',
      ],
      evals_affected: ['defect_recall_replay'],
      generalization_scope: 'shared_rule',
      generalized_rule: 'Require interaction-pair completeness gates for save-dialog-class flows.',
      target_surface: 'review_rubric_phase5a',
      source_examples: ['save dialog completeness'],
      allowed_mutation_scope: ['rubric_update'],
      supporting_feature_families: ['report-editor', 'report-builder'],
    },
  );

  assert.equal(normalized?.generalized_rule, 'Require interaction-pair completeness gates for save-dialog-class flows.');
});

test('structured defects observations preserve generalized promotion metadata', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-phase2-generalization-'));
  try {
    const qaPlanRoot = join(repoRoot, 'workspace-planner', 'skills', 'qa-plan-orchestrator');
    const defectsRunRoot = join(repoRoot, 'workspace-reporter', 'skills', 'defects-analysis', 'runs', 'BCIN-7289');
    await mkdir(join(qaPlanRoot, 'evals'), { recursive: true });
    await mkdir(join(qaPlanRoot, 'knowledge-packs', 'report-editor'), { recursive: true });
    await mkdir(join(defectsRunRoot, 'context'), { recursive: true });
    await writeFile(join(qaPlanRoot, 'SKILL.md'), QA_PLAN_SKILL_MD, 'utf8');
    await writeFile(join(qaPlanRoot, 'reference.md'), '# reference\n', 'utf8');
    await writeJson(join(qaPlanRoot, 'evals', 'evals.json'), { eval_groups: [] });
    await writeJson(join(qaPlanRoot, 'knowledge-packs', 'report-editor', 'pack.json'), { version: '1', bootstrap_status: 'ready' });
    await writeFile(join(qaPlanRoot, 'knowledge-packs', 'report-editor', 'pack.md'), '# pack\n', 'utf8');
    await writeJson(join(defectsRunRoot, 'context', 'analysis_freshness_BCIN-7289.json'), {
      generated_at: '2026-03-25T00:00:00.000Z',
    });
    await writeJson(join(defectsRunRoot, 'context', 'gap_bundle_BCIN-7289.json'), {
      gaps: [
        {
          gap_id: 'gap-structured',
          root_cause_bucket: 'interaction_gap',
          severity: 'high',
          title: 'Gap title',
          summary: 'Use generalized rule text',
          affected_phase: 'phase5',
          recommended_target_files: ['workspace-planner/skills/qa-plan-orchestrator/references/review-rubric-phase5a.md'],
          generalization_scope: 'feature_family',
          generalized_rule: 'Audit interaction-pair completeness for save dialog flows.',
          target_surface: 'review_rubric_phase5a',
          source_examples: ['save dialog completeness'],
          allowed_mutation_scope: ['knowledge_pack_enrichment'],
          feature_family: 'report-editor',
        },
      ],
    });
    await writeFile(join(defectsRunRoot, 'BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md'), '# cross\n', 'utf8');
    await writeFile(join(defectsRunRoot, 'BCIN-7289_SELF_TEST_GAP_ANALYSIS.md'), '# self\n', 'utf8');

    const result = await seedGapTaxonomyAndBacklog({
      repoRoot,
      runRoot: join(repoRoot, 'runs', 'test'),
      task: {
        target_skill_path: 'workspace-planner/skills/qa-plan-orchestrator',
        benchmark_profile: 'qa-plan-defect-recall',
        knowledge_pack_key: 'report-editor',
        feature_id: 'BCIN-7289',
      },
    });

    const observation = result.source_results
      .find((sourceResult) => sourceResult.source_type === 'defects_cross_analysis')
      .observations[0];
    assert.equal(observation.generalized_rule, 'Audit interaction-pair completeness for save dialog flows.');
    assert.equal(observation.target_surface, 'review_rubric_phase5a');
    assert.deepEqual(observation.source_examples, ['save dialog completeness']);
    assert.deepEqual(observation.allowed_mutation_scope, ['knowledge_pack_enrichment']);
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});

test('phase2 reuses prior backlog receipt when inputs are unchanged', async () => {
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase2-reuse-'));
  const runKey = `phase2-reuse-${Date.now()}`;
  const fixturePath = '.agents/skills/qa-plan-evolution/scripts/test/fixtures/minimal-target-skill';

  try {
    await mkdir(join(runRoot, 'context'), { recursive: true });
    await writeJson(join(runRoot, 'task.json'), {
      run_key: runKey,
      target_skill_path: fixturePath,
      benchmark_profile: 'generic-skill-regression',
      current_iteration: 1,
    });
    await writeJson(join(runRoot, 'run.json'), {
      run_key: runKey,
      phase_receipts: {},
    });

    const first = spawnSync('bash', [
      PHASE2,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', REPO_ROOT,
    ], {
      encoding: 'utf8',
    });
    assert.equal(first.status, 0, first.stderr);

    const backlogPath = join(runRoot, 'context', `mutation_backlog_${runKey}.json`);
    const before = await stat(backlogPath);
    await new Promise((resolve) => setTimeout(resolve, 20));

    const second = spawnSync('bash', [
      PHASE2,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', REPO_ROOT,
    ], {
      encoding: 'utf8',
    });
    assert.equal(second.status, 0, second.stderr);
    assert.match(second.stdout, /reused/i);

    const after = await stat(backlogPath);
    assert.equal(after.mtimeMs, before.mtimeMs);
  } finally {
    await rm(runRoot, { recursive: true, force: true });
  }
});
