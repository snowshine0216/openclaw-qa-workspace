import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';

import {
  buildMutationBacklog,
  seedGapTaxonomyAndBacklog,
} from '../lib/mutationBacklog.mjs';

async function writeJson(path, payload) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

test('phase2 generic profile stays empty on a clean baseline without prior failures', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-phase2-generic-'));
  try {
    const skillRoot = join(repoRoot, 'target-skill');
    await mkdir(join(skillRoot, 'evals'), { recursive: true });
    await writeFile(join(skillRoot, 'SKILL.md'), '# Target Skill\n\nREPORT_STATE\n', 'utf8');
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
    await writeFile(join(skillRoot, 'SKILL.md'), '# Target Skill\n\nREPORT_STATE\n', 'utf8');
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

    await writeFile(join(qaPlanRoot, 'SKILL.md'), '# qa-plan-orchestrator\n\nREPORT_STATE\n', 'utf8');
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

    await writeFile(join(qaPlanRoot, 'SKILL.md'), '# qa-plan-orchestrator\n\nREPORT_STATE\n', 'utf8');
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
