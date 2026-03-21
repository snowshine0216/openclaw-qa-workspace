import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import {
  buildCaseAssertions,
  buildCaseEvalMetadata,
  buildCasePrompt,
  listPreparedEvalDirs,
  prepareBenchmarkV2Baseline,
  validateCaseMatrix,
} from '../benchmarks/qa-plan-v2/scripts/lib/benchmarkV2.mjs';

function buildFixturesDocument() {
  return {
    benchmark_version: 'qa-plan-v2',
    fixtures: [
      {
        fixture_id: 'BLIND-DOCS-001',
        type: 'blind_pre_defect_bundle',
        feature_id: 'DOCS',
        feature_family: 'docs',
        cutoff_policy: 'all_customer_issues_only',
        issue_scope: {
          include_issue_classes: ['customer'],
          exclude_issue_classes: ['non_customer'],
        },
        materials: [
          {
            material_type: 'other',
            source_id_or_url: 'docs/README.md',
            included_in_blind: true,
          },
        ],
      },
      {
        fixture_id: 'BCIN-7289-defect-analysis-run',
        path: 'workspace-reporter/skills/defects-analysis/runs/BCIN-7289',
        type: 'defect_replay_source',
        status: 'active',
      },
    ],
  };
}

test('buildCasePrompt encodes feature, phase, kind, and focus', () => {
  const prompt = buildCasePrompt({
    case_id: 'P5B-ANALOG-GATE-001',
    feature_id: 'BCIN-7289',
    feature_family: 'report-editor',
    knowledge_pack_key: 'report-editor',
    primary_phase: 'phase5b',
    kind: 'checkpoint_enforcement',
    evidence_mode: 'retrospective_replay',
    blocking: true,
    fixture_refs: ['BCIN-7289-defect-analysis-run'],
    benchmark_profile: 'global-cross-feature-v1',
    focus: 'historical analogs become required-before-ship gates',
  });

  assert.match(prompt, /BCIN-7289/);
  assert.match(prompt, /report-editor/);
  assert.match(prompt, /phase5b/);
  assert.match(prompt, /checkpoint enforcement/);
  assert.match(prompt, /retrospective replay/);
  assert.match(prompt, /required-before-ship gates/);
});

test('buildCaseEvalMetadata keeps case identity and blocking semantics', () => {
  const metadata = buildCaseEvalMetadata({
    case_id: 'HOLDOUT-REGRESSION-001',
    feature_id: 'BCIN-6709',
    feature_family: 'report-editor',
    knowledge_pack_key: 'report-editor',
    primary_phase: 'holdout',
    kind: 'holdout_regression',
    evidence_mode: 'holdout_regression',
    blocking: true,
    fixture_refs: ['embedding-dashboard-editor-compare-result'],
    benchmark_profile: 'global-cross-feature-v1',
    focus: 'no regression on holdout feature',
  }, 11);

  assert.equal(metadata.eval_id, 11);
  assert.equal(metadata.case_id, 'HOLDOUT-REGRESSION-001');
  assert.equal(metadata.blocking, true);
  assert.equal(metadata.eval_group, 'holdout_regression');
  assert.equal(metadata.feature_family, 'report-editor');
  assert.equal(metadata.knowledge_pack_key, 'report-editor');
  assert.equal(metadata.evidence_mode, 'holdout_regression');
});

test('buildCasePrompt and metadata surface blind customer-only policy', () => {
  const caseDefinition = {
    case_id: 'DOC-SYNC-001',
    feature_id: 'DOCS',
    feature_family: 'docs',
    knowledge_pack_key: 'docs',
    primary_phase: 'docs',
    kind: 'phase_contract',
    evidence_mode: 'blind_pre_defect',
    blocking: false,
    fixture_refs: ['BLIND-DOCS-001'],
    benchmark_profile: 'global-cross-feature-v1',
    focus: 'docs stay aligned',
    blind_policy: {
      cutoff_policy: 'all_customer_issues_only',
      issue_scope: {
        include_issue_classes: ['customer'],
        exclude_issue_classes: ['non_customer'],
      },
    },
  };

  const prompt = buildCasePrompt(caseDefinition);
  const metadata = buildCaseEvalMetadata(caseDefinition, 2);

  assert.match(prompt, /customer issues only/i);
  assert.match(prompt, /exclude non-customer issues/i);
  assert.deepEqual(metadata.blind_policy, caseDefinition.blind_policy);
});

test('buildCaseAssertions prefixes kind and blocking labels', () => {
  const assertions = buildCaseAssertions({
    case_id: 'DOC-SYNC-001',
    feature_id: 'DOCS',
    feature_family: 'docs',
    knowledge_pack_key: 'docs',
    primary_phase: 'docs',
    kind: 'phase_contract',
    evidence_mode: 'blind_pre_defect',
    blocking: false,
    fixture_refs: [],
    benchmark_profile: 'global-cross-feature-v1',
    focus: 'docs stay aligned',
  });

  assert.equal(assertions.length, 2);
  assert.match(assertions[0], /\[phase_contract\]\[advisory\]/);
});

test('validateCaseMatrix rejects missing case ids referenced by manifest', async () => {
  await assert.rejects(() => validateCaseMatrix({
    benchmarkManifest: {
      blocking_case_ids: ['MISSING-001'],
      advisory_case_ids: [],
    },
    casesDocument: {
      cases: [
        {
          case_id: 'PRESENT-001',
          feature_id: 'BCIN-1',
          feature_family: 'report-editor',
          knowledge_pack_key: 'report-editor',
          primary_phase: 'phase4a',
          kind: 'defect_replay',
          evidence_mode: 'retrospective_replay',
          blocking: true,
          fixture_refs: ['BCIN-7289-defect-analysis-run'],
          benchmark_profile: 'global-cross-feature-v1',
          focus: 'present case only',
        },
      ],
    },
    fixturesDocument: buildFixturesDocument(),
  }), /missing blocking case id/);
});

test('validateCaseMatrix rejects cases missing required multi-feature fields', async () => {
  await assert.rejects(() => validateCaseMatrix({
    benchmarkManifest: {
      blocking_case_ids: ['PRESENT-001'],
      advisory_case_ids: [],
    },
    casesDocument: {
      cases: [
        {
          case_id: 'PRESENT-001',
          feature_id: 'BCIN-1',
          primary_phase: 'phase4a',
          kind: 'defect_replay',
          blocking: true,
          focus: 'focus only',
        },
      ],
    },
    fixturesDocument: buildFixturesDocument(),
  }), /missing required field/);
});

test('validateCaseMatrix rejects blind cases without a customer-only blind bundle', async () => {
  await assert.rejects(() => validateCaseMatrix({
    benchmarkManifest: {
      blocking_case_ids: ['DOC-1'],
      advisory_case_ids: [],
    },
    casesDocument: {
      cases: [
        {
          case_id: 'DOC-1',
          feature_id: 'DOCS',
          feature_family: 'docs',
          knowledge_pack_key: 'docs',
          primary_phase: 'docs',
          kind: 'phase_contract',
          evidence_mode: 'blind_pre_defect',
          blocking: true,
          fixture_refs: ['BCIN-7289-defect-analysis-run'],
          benchmark_profile: 'global-cross-feature-v1',
          focus: 'docs only',
        },
      ],
    },
    fixturesDocument: buildFixturesDocument(),
  }), /must reference exactly one blind_pre_defect_bundle/);
});

test('validateCaseMatrix rejects blind bundles that include non-customer issues', async () => {
  await assert.rejects(() => validateCaseMatrix({
    benchmarkManifest: {
      blocking_case_ids: ['DOC-1'],
      advisory_case_ids: [],
    },
    casesDocument: {
      cases: [
        {
          case_id: 'DOC-1',
          feature_id: 'DOCS',
          feature_family: 'docs',
          knowledge_pack_key: 'docs',
          primary_phase: 'docs',
          kind: 'phase_contract',
          evidence_mode: 'blind_pre_defect',
          blocking: true,
          fixture_refs: ['BLIND-DOCS-001'],
          benchmark_profile: 'global-cross-feature-v1',
          focus: 'docs only',
        },
      ],
    },
    fixturesDocument: {
      benchmark_version: 'qa-plan-v2',
      fixtures: [
        {
          fixture_id: 'BLIND-DOCS-001',
          type: 'blind_pre_defect_bundle',
          feature_id: 'DOCS',
          feature_family: 'docs',
          cutoff_policy: 'all_customer_issues_only',
          issue_scope: {
            include_issue_classes: ['customer'],
            exclude_issue_classes: ['non_customer'],
          },
          materials: [
            {
              material_type: 'jira_non_customer_issue',
              source_id_or_url: 'INT-1',
              included_in_blind: true,
            },
          ],
        },
      ],
    },
  }), /must exclude non-customer issues/);
});

test('prepareBenchmarkV2Baseline materializes the full multi-case iteration-0 workspace', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'benchmark-v2-'));
  const skillRoot = join(tmp, 'skill');
  const benchmarkRoot = join(skillRoot, 'benchmarks', 'qa-plan-v2');

  try {
    await mkdir(join(skillRoot, 'scripts'), { recursive: true });
    await writeFile(join(skillRoot, 'scripts', 'phase0.sh'), '#!/usr/bin/env bash\n', 'utf8');
    await mkdir(benchmarkRoot, { recursive: true });
    await writeFile(join(benchmarkRoot, 'benchmark_manifest.json'), JSON.stringify({
      benchmark_version: 'qa-plan-v2',
      skill_name: 'qa-plan-orchestrator',
      frozen_at: '2026-03-21T00:00:00Z',
      runs_per_configuration: 2,
      blocking_case_ids: ['CASE-1'],
      advisory_case_ids: ['CASE-2'],
    }, null, 2), 'utf8');
    await writeFile(join(benchmarkRoot, 'fixtures_manifest.json'), JSON.stringify({
      benchmark_version: 'qa-plan-v2',
      fixtures: [
        {
          fixture_id: 'BCIN-7289-defect-analysis-run',
          path: 'workspace-reporter/skills/defects-analysis/runs/BCIN-7289',
          type: 'defect_replay_source',
          status: 'active',
        },
        {
          fixture_id: 'BLIND-DOCS-001',
          type: 'blind_pre_defect_bundle',
          feature_id: 'DOCS',
          feature_family: 'docs',
          cutoff_policy: 'all_customer_issues_only',
          issue_scope: {
            include_issue_classes: ['customer'],
            exclude_issue_classes: ['non_customer'],
          },
          materials: [
            {
              material_type: 'other',
              source_id_or_url: 'docs/README.md',
              included_in_blind: true,
            },
          ],
        },
      ],
    }, null, 2), 'utf8');
    await writeFile(join(benchmarkRoot, 'cases.json'), JSON.stringify({
      benchmark_version: 'qa-plan-v2',
      cases: [
        {
          case_id: 'CASE-1',
          feature_id: 'BCIN-7289',
          feature_family: 'report-editor',
          knowledge_pack_key: 'report-editor',
          primary_phase: 'phase5b',
          kind: 'checkpoint_enforcement',
          evidence_mode: 'retrospective_replay',
          blocking: true,
          fixture_refs: ['BCIN-7289-defect-analysis-run'],
          benchmark_profile: 'global-cross-feature-v1',
          focus: 'analog gates are enforced',
        },
        {
          case_id: 'CASE-2',
          feature_id: 'DOCS',
          feature_family: 'docs',
          knowledge_pack_key: 'docs',
          primary_phase: 'docs',
          kind: 'phase_contract',
          evidence_mode: 'blind_pre_defect',
          blocking: false,
          fixture_refs: ['BLIND-DOCS-001'],
          benchmark_profile: 'global-cross-feature-v1',
          focus: 'docs remain aligned',
        },
      ],
    }, null, 2), 'utf8');

    const prepared = await prepareBenchmarkV2Baseline({
      skillRoot,
      benchmarkRoot,
      iteration: 0,
      executorModel: 'gpt-5.4',
      reasoningEffort: 'high',
    });

    assert.equal(prepared.caseCount, 2);

    const evalDirs = await listPreparedEvalDirs(join(benchmarkRoot, 'iteration-0'));
    assert.deepEqual(evalDirs, ['eval-1', 'eval-2']);

    const benchmarkContext = JSON.parse(await readFile(join(benchmarkRoot, 'iteration-0', 'benchmark_context.json'), 'utf8'));
    assert.equal(benchmarkContext.case_count, 2);
    assert.equal(benchmarkContext.executor_model, 'gpt-5.4');

    const spawnManifest = JSON.parse(await readFile(join(benchmarkRoot, 'iteration-0', 'spawn_manifest.json'), 'utf8'));
    assert.equal(spawnManifest.tasks.length, 2);
    assert.equal(spawnManifest.tasks[0].case_id, 'CASE-1');
    assert.equal(spawnManifest.tasks[0].with_skill_runs.length, 2);
    assert.equal(spawnManifest.tasks[0].without_skill_runs[1].run_number, 2);
    assert.equal(spawnManifest.tasks[0].feature_family, 'report-editor');
    assert.equal(spawnManifest.tasks[0].knowledge_pack_key, 'report-editor');
    assert.equal(spawnManifest.tasks[0].evidence_mode, 'retrospective_replay');
    assert.deepEqual(spawnManifest.tasks[0].fixture_refs, ['BCIN-7289-defect-analysis-run']);
    assert.equal(spawnManifest.tasks[1].blind_policy.cutoff_policy, 'all_customer_issues_only');
    assert.deepEqual(spawnManifest.tasks[1].blind_policy.issue_scope.include_issue_classes, ['customer']);
    assert.equal(spawnManifest.skill_path, skillRoot);
    assert.equal(spawnManifest.workspace, benchmarkRoot);
    assert.equal(spawnManifest.iteration_dir, join(benchmarkRoot, 'iteration-0'));

    const comparisonMetadata = JSON.parse(await readFile(
      join(benchmarkRoot, 'iteration-0', 'eval-1', 'with_skill', 'run-1', 'comparison_metadata.json'),
      'utf8',
    ));
    assert.equal(comparisonMetadata.case_id, 'CASE-1');
    assert.equal(comparisonMetadata.case_kind, 'checkpoint_enforcement');
    assert.equal(comparisonMetadata.feature_family, 'report-editor');
    assert.equal(comparisonMetadata.knowledge_pack_key, 'report-editor');
    assert.equal(comparisonMetadata.evidence_mode, 'retrospective_replay');

    const blindComparisonMetadata = JSON.parse(await readFile(
      join(benchmarkRoot, 'iteration-0', 'eval-2', 'with_skill', 'run-1', 'comparison_metadata.json'),
      'utf8',
    ));
    assert.equal(blindComparisonMetadata.blind_policy.cutoff_policy, 'all_customer_issues_only');
    assert.equal(
      JSON.stringify(spawnManifest).includes('/Users/vizcitest'),
      false,
    );
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
});
