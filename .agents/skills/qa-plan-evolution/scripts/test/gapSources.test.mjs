import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';

import {
  collectGapSourceResults,
  findBlockingGapSources,
} from '../lib/gapSources/index.mjs';
import { getProfileById } from '../lib/loadProfile.mjs';

async function writeJson(path, payload) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

const TARGET_SKILL_MD = `---
name: target-skill
description: Generic target skill fixture for qa-plan-evolution tests.
---

# Skill

REPORT_STATE
`;
const QA_PLAN_SKILL_MD = `---
name: qa-plan-orchestrator
description: Master orchestrator for script-driven feature QA planning. The orchestrator only calls phase scripts, interacts with the user, and spawns from phase manifests.
---

# Skill

REPORT_STATE
`;

test('findBlockingGapSources only blocks required source failures', () => {
  const sourceResults = [
    {
      source_type: 'contract_drift',
      required: true,
      status: 'missing_source',
      observations: [],
      errors: ['missing'],
    },
    {
      source_type: 'defects_cross_analysis',
      required: false,
      status: 'missing_source',
      observations: [],
      errors: ['optional missing'],
    },
    {
      source_type: 'smoke_regressions',
      required: true,
      status: 'no_findings',
      observations: [],
      errors: [],
    },
  ];

  assert.deepEqual(
    findBlockingGapSources(sourceResults).map((result) => result.source_type),
    ['contract_drift'],
  );
});

test('collectGapSourceResults preserves required flags from profile definitions', async () => {
  const profile = {
    id: 'test-profile',
    gap_sources: [
      { id: 'target_eval_failures', required: true },
      { id: 'defects_cross_analysis', required: false },
    ],
  };

  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-gap-sources-profile-'));
  try {
    const targetSkillRoot = join(repoRoot, 'target-skill');
    await mkdir(join(targetSkillRoot, 'evals'), { recursive: true });
    await writeFile(join(targetSkillRoot, 'SKILL.md'), TARGET_SKILL_MD, 'utf8');
    await writeFile(join(targetSkillRoot, 'reference.md'), '# Ref\nREPORT_STATE\n', 'utf8');
    await writeJson(join(targetSkillRoot, 'evals', 'evals.json'), {
      eval_groups: [{ id: 'contract_evals', policy: 'blocking', prompt: 'keep it' }],
    });

    const sourceResults = await collectGapSourceResults({
      repoRoot,
      runRoot: join(repoRoot, 'runs', 'test'),
      task: {
        target_skill_path: 'target-skill',
      },
      profile,
    });

    assert.equal(sourceResults[0].required, true);
    assert.equal(sourceResults[1].required, false);
    assert.equal(sourceResults[1].status, 'missing_source');
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});

test('qa-plan knowledge pack observations include sdk and interaction coverage gaps', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-gap-sources-pack-'));
  try {
    const qaPlanRoot = join(repoRoot, 'workspace-planner', 'skills', 'qa-plan-orchestrator');
    await mkdir(join(qaPlanRoot, 'references'), { recursive: true });
    await mkdir(join(qaPlanRoot, 'knowledge-packs', 'report-editor'), { recursive: true });

    await writeFile(join(qaPlanRoot, 'README.md'), '# qa-plan\n', 'utf8');
    await writeFile(join(qaPlanRoot, 'references', 'phase4a-contract.md'), 'template-based creation\n', 'utf8');
    await writeFile(join(qaPlanRoot, 'references', 'review-rubric-phase5a.md'), '# review 5a\n', 'utf8');
    await writeFile(join(qaPlanRoot, 'references', 'review-rubric-phase5b.md'), '# review 5b\n', 'utf8');
    await writeJson(join(qaPlanRoot, 'evals', 'evals.json'), {
      eval_groups: [{ id: 'knowledge_pack_coverage', policy: 'blocking', prompt: 'pack' }],
    });
    await writeJson(join(qaPlanRoot, 'knowledge-packs', 'report-editor', 'pack.json'), {
      version: '2026-03-21',
      required_capabilities: ['template-based creation'],
      required_outcomes: [
        {
          id: 'outcome-window-title',
          keywords: ['window title correctness', 'setWindowTitle'],
          observable_outcome: 'window title reflects report context',
        },
      ],
      state_transitions: [
        {
          id: 'transition-template-save',
          from: 'template-based creation',
          to: 'save override',
          trigger: 'save action',
          observable_outcome: 'folder visibility refresh after save',
        },
      ],
      analog_gates: [],
      sdk_visible_contracts: ['setWindowTitle'],
      interaction_pairs: [['template-based creation', 'pause-mode prompts']],
      interaction_matrices: [
        {
          id: 'matrix-1',
          pairs: [['close-confirmation', 'prompt editor open']],
        },
      ],
    });
    await writeFile(join(qaPlanRoot, 'knowledge-packs', 'report-editor', 'pack.md'), '# pack\n', 'utf8');

    const qaPlanProfile = getProfileById('qa-plan-knowledge-pack-coverage');
    const sourceResults = await collectGapSourceResults({
      repoRoot,
      runRoot: join(repoRoot, 'runs', 'test'),
      task: {
        target_skill_path: 'workspace-planner/skills/qa-plan-orchestrator',
        knowledge_pack_key: 'report-editor',
      },
      profile: qaPlanProfile,
    });

    const packSource = sourceResults.find((result) => result.source_type === 'knowledge_pack_coverage');
    assert.equal(packSource.status, 'ok');
    assert.ok(
      packSource.observations.some((observation) =>
        observation.summary.includes('SDK visible contract "setWindowTitle"'),
      ),
    );
    assert.ok(
      packSource.observations.some((observation) =>
        observation.summary.includes('Interaction pair "template-based creation + pause-mode prompts"'),
      ),
    );
    assert.ok(
      packSource.observations.some((observation) =>
        observation.summary.includes('Required outcome "window title reflects report context"'),
      ),
    );
    assert.ok(
      packSource.observations.some((observation) =>
        observation.summary.includes('State transition "transition-template-save"'),
      ),
    );
    assert.ok(
      packSource.observations.some((observation) =>
        observation.summary.includes('Interaction pair "close-confirmation + prompt editor open"'),
      ),
    );
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});

test('knowledge-pack coverage skips cleanly when no knowledge pack applies', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-gap-sources-pack-skip-'));
  try {
    const qaPlanRoot = join(repoRoot, 'workspace-planner', 'skills', 'qa-plan-orchestrator');
    const defectsRunRoot = join(
      repoRoot,
      'workspace-reporter',
      'skills',
      'defects-analysis',
      'runs',
      'BCIN-7289',
    );
    await mkdir(join(qaPlanRoot, 'evals'), { recursive: true });
    await mkdir(join(defectsRunRoot, 'context'), { recursive: true });
    await writeFile(join(qaPlanRoot, 'SKILL.md'), QA_PLAN_SKILL_MD, 'utf8');
    await writeFile(join(qaPlanRoot, 'reference.md'), '# Ref\nREPORT_STATE\n', 'utf8');
    await writeJson(join(qaPlanRoot, 'evals', 'evals.json'), {
      eval_groups: [{ id: 'defect_recall_replay', policy: 'blocking', prompt: 'replay' }],
    });
    await writeJson(join(defectsRunRoot, 'context', 'analysis_freshness_BCIN-7289.json'), {
      generated_at: '2026-03-22T00:00:00.000Z',
    });
    await writeJson(join(defectsRunRoot, 'context', 'gap_bundle_BCIN-7289.json'), {
      run_key: 'BCIN-7289',
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

    const qaPlanProfile = getProfileById('qa-plan-defect-recall');
    const sourceResults = await collectGapSourceResults({
      repoRoot,
      runRoot: join(repoRoot, 'runs', 'test'),
      task: {
        target_skill_path: 'workspace-planner/skills/qa-plan-orchestrator',
        feature_id: 'BCIN-7289',
      },
      profile: qaPlanProfile,
    });

    const packSource = sourceResults.find((result) => result.source_type === 'knowledge_pack_coverage');
    assert.equal(packSource.required, false);
    assert.equal(packSource.status, 'skipped');
    assert.deepEqual(packSource.observations, []);
    assert.ok(
      !findBlockingGapSources(sourceResults)
        .map((result) => result.source_type)
        .includes('knowledge_pack_coverage'),
    );
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});

test('target eval failures only report groups that actually failed in validation evidence', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-gap-sources-evals-'));
  const runRoot = join(repoRoot, 'runs', 'test');
  try {
    const targetSkillRoot = join(repoRoot, 'target-skill');
    await mkdir(join(targetSkillRoot, 'evals'), { recursive: true });
    await mkdir(join(runRoot, 'candidates', 'iteration-2'), { recursive: true });
    await writeFile(join(targetSkillRoot, 'SKILL.md'), TARGET_SKILL_MD, 'utf8');
    await writeFile(join(targetSkillRoot, 'reference.md'), '# Ref\nREPORT_STATE\n', 'utf8');
    await writeJson(join(targetSkillRoot, 'evals', 'evals.json'), {
      eval_groups: [
        { id: 'contract_a', policy: 'blocking', prompt: 'A' },
        { id: 'contract_b', policy: 'blocking', prompt: 'B' },
      ],
    });
    await writeJson(join(runRoot, 'candidates', 'iteration-2', 'validation_report.json'), {
      validation: {
        eval_ok: false,
        eval_log: 'failing eval group: contract_b',
      },
    });

    const profile = {
      id: 'test-profile',
      gap_sources: [{ id: 'target_eval_failures', required: true }],
    };
    const sourceResults = await collectGapSourceResults({
      repoRoot,
      runRoot,
      task: { target_skill_path: 'target-skill' },
      profile,
    });

    const evalSource = sourceResults[0];
    assert.equal(evalSource.status, 'ok');
    assert.equal(evalSource.observations.length, 1);
    assert.equal(evalSource.observations[0].evals_affected[0], 'contract_b');
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});
