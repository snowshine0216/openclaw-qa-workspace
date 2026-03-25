import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { buildInitialChampionScoreboard } from '../lib/runTargetValidation.mjs';

const REPO_ROOT = join(fileURLToPath(new URL('../../../../../', import.meta.url)));
const PHASE0 = join(REPO_ROOT, '.agents/skills/qa-plan-evolution/scripts/phase0.sh');
const PHASE1 = join(REPO_ROOT, '.agents/skills/qa-plan-evolution/scripts/phase1.sh');
const QA_PLAN_SKILL_MD = `---
name: qa-plan-orchestrator
description: Master orchestrator for script-driven feature QA planning. The orchestrator only calls phase scripts, interacts with the user, and spawns from phase manifests.
---

# qa-plan-orchestrator

REPORT_STATE
`;
const GENERIC_TARGET_SKILL_MD = `---
name: generic-target
description: Generic target skill fixture for qa-plan-evolution tests.
---

# generic target

REPORT_STATE
`;

async function seedQaPlanTarget(repoRoot) {
  const targetRoot = join(repoRoot, 'workspace-planner', 'skills', 'qa-plan-orchestrator');
  await mkdir(join(targetRoot, 'evals'), { recursive: true });
  await mkdir(join(targetRoot, 'knowledge-packs', 'report-editor'), { recursive: true });
  await writeFile(join(targetRoot, 'SKILL.md'), QA_PLAN_SKILL_MD, 'utf8');
  await writeFile(join(targetRoot, 'reference.md'), '# reference\n\nREPORT_STATE\n', 'utf8');
  await writeFile(
    join(targetRoot, 'evals', 'evals.json'),
    JSON.stringify({
      eval_groups: [{ id: 'defect_recall_replay', policy: 'blocking', prompt: 'replay' }],
    }, null, 2),
    'utf8',
  );
  await writeFile(
    join(targetRoot, 'knowledge-packs', 'report-editor', 'pack.json'),
    JSON.stringify({
      version: '1.0.0',
      bootstrap_status: 'ready',
      required_capabilities: ['dialog completeness'],
      analog_gates: [{ behavior: 'prompt handling' }],
      sdk_visible_contracts: ['window title'],
      interaction_pairs: [['template', 'pause mode']],
    }, null, 2),
    'utf8',
  );
  await writeFile(
    join(targetRoot, 'knowledge-packs', 'report-editor', 'pack.md'),
    '# report-editor pack\n',
    'utf8',
  );
}

test('phase1 blocks qa-plan profile when the requested knowledge pack is missing', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-phase1-repo-'));
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase1-'));
  const runKey = 'qa-plan-phase1-block';

  try {
    await seedQaPlanTarget(repoRoot);
    const phase0 = spawnSync('bash', [
      PHASE0,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', repoRoot,
      '--target-skill-path', 'workspace-planner/skills/qa-plan-orchestrator',
      '--target-skill-name', 'qa-plan-orchestrator',
      '--benchmark-profile', 'qa-plan-knowledge-pack-coverage',
      '--knowledge-pack-key', 'missing-pack',
    ], {
      encoding: 'utf8',
    });
    assert.equal(phase0.status, 0);

    const phase1 = spawnSync('bash', [
      PHASE1,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', repoRoot,
    ], {
      encoding: 'utf8',
    });

    assert.equal(phase1.status, 2);
    assert.ok(
      !phase1.stdout.includes('SPAWN_MANIFEST:'),
      'no spawn when manifest has no requests (e.g. knowledge-pack-only block)',
    );
    const freshness = JSON.parse(
      await readFile(join(runRoot, 'context', `evidence_freshness_${runKey}.json`), 'utf8'),
    );
    assert.equal(freshness.phase2_allowed, false);
    assert.ok(
      ['missing', 'bootstrap_incomplete'].includes(freshness.knowledge_pack.status),
      `unexpected knowledge pack status: ${freshness.knowledge_pack.status}`,
    );
    const bootstrap = JSON.parse(
      await readFile(join(runRoot, 'context', `knowledge_pack_bootstrap_${runKey}.json`), 'utf8'),
    );
    assert.ok(
      ['bootstrap_created', 'bootstrap_incomplete'].includes(bootstrap.action),
      `unexpected bootstrap action: ${bootstrap.action}`,
    );
    assert.equal(bootstrap.pack_key, 'missing-pack');
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
    await rm(runRoot, { recursive: true, force: true });
  }
});

test('phase1 does not emit SPAWN_MANIFEST when defects refresh is required but task has no run key', async () => {
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase1-'));
  const runKey = `qa-plan-phase1-no-defect-key-${Date.now()}`;

  try {
    const phase0 = spawnSync('bash', [
      PHASE0,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', REPO_ROOT,
      '--target-skill-path', 'workspace-planner/skills/qa-plan-orchestrator',
      '--target-skill-name', 'qa-plan-orchestrator',
      '--benchmark-profile', 'qa-plan-defect-recall',
      '--feature-family', 'report-editor',
    ], {
      encoding: 'utf8',
    });
    assert.equal(phase0.status, 0);

    const phase1 = spawnSync('bash', [
      PHASE1,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', REPO_ROOT,
    ], {
      encoding: 'utf8',
    });

    assert.equal(phase1.status, 2);
    assert.ok(
      !phase1.stdout.includes('SPAWN_MANIFEST:'),
      'empty manifest must not trigger orchestrate manifestRunner',
    );
    assert.ok(
      phase1.stderr.includes('no automated spawn actions'),
      'stderr should explain missing spawn when requests array is empty',
    );
    const freshness = JSON.parse(
      await readFile(join(runRoot, 'context', `evidence_freshness_${runKey}.json`), 'utf8'),
    );
    assert.equal(freshness.defects_analysis.status, 'missing_source');
  } finally {
    await rm(runRoot, { recursive: true, force: true });
  }
});

test('phase1 emits defects-analysis refresh manifest when feature_id can derive the run key', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-phase1-repo-'));
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase1-feature-'));
  const runKey = 'qa-plan-phase1-feature-id';

  try {
    await seedQaPlanTarget(repoRoot);
    const phase0 = spawnSync('bash', [
      PHASE0,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', repoRoot,
      '--target-skill-path', 'workspace-planner/skills/qa-plan-orchestrator',
      '--target-skill-name', 'qa-plan-orchestrator',
      '--benchmark-profile', 'qa-plan-defect-recall',
      '--feature-id', 'BCIN-7289',
      '--feature-family', 'report-editor',
    ], {
      encoding: 'utf8',
    });
    assert.equal(phase0.status, 0);

    const phase1 = spawnSync('bash', [
      PHASE1,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', repoRoot,
    ], {
      encoding: 'utf8',
    });

    assert.equal(phase1.status, 2);
    assert.match(phase1.stdout, /SPAWN_MANIFEST:/);
    const manifest = JSON.parse(
      await readFile(join(runRoot, 'phase1_spawn_manifest.json'), 'utf8'),
    );
    assert.equal(manifest.requests.length, 1);
    assert.deepEqual(
      manifest.requests[0].local_command.argv.slice(-4),
      ['--feature-id', 'BCIN-7289', '--feature-family', 'report-editor'],
    );
    assert.equal(
      manifest.requests[0].local_command.argv[1],
      join(repoRoot, '.agents', 'skills', 'qa-plan-evolution', 'scripts', 'spawn_defects_analysis.sh'),
    );
    const jobs = await readFile(join(runRoot, 'jobs', 'phase1-1.json'), 'utf8').catch(() => null);
    assert.ok(jobs, 'phase1 should register a pending async job');
    const job = JSON.parse(jobs);
    assert.ok(Array.isArray(job.expected_artifacts));
    assert.ok(job.expected_artifacts.length > 0);
    assert.equal(job.completion_probe, 'expected_artifacts_and_spawn_results');
    assert.ok(Array.isArray(job.freshness_inputs));
    assert.equal(typeof job.timeout_at, 'string');
    assert.deepEqual(job.retry_policy, { owner: 'orchestrator', max_retries: 1 });
    assert.equal(job.blocking_reason, 'waiting_on_defects_analysis');
    const task = JSON.parse(await readFile(join(runRoot, 'task.json'), 'utf8'));
    assert.equal(task.next_action, 'await_async_completion');
    assert.equal(task.next_action_reason, 'awaiting_async_prerequisite');
    assert.equal(task.blocking_reason, 'waiting_on_defects_analysis');
    assert.deepEqual(task.pending_job_ids, ['phase1-1']);
  } finally {
    await rm(runRoot, { recursive: true, force: true });
    await rm(repoRoot, { recursive: true, force: true });
  }
});

test('phase1 records resolved defect evidence when fresh gap bundle is present', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-phase1-repo-'));
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase1-evidence-'));
  const runKey = 'qa-plan-phase1-evidence';
  const defectsRunRoot = join(
    repoRoot,
    'workspace-reporter',
    'skills',
    'defects-analysis',
    'runs',
    'BCIN-7289',
  );

  try {
    await seedQaPlanTarget(repoRoot);
    await mkdir(join(defectsRunRoot, 'context'), { recursive: true });
    await writeFile(
      join(defectsRunRoot, 'context', 'analysis_freshness_BCIN-7289.json'),
      JSON.stringify({ generated_at: '2099-03-21T00:00:00.000Z' }, null, 2),
      'utf8',
    );
    await writeFile(join(defectsRunRoot, 'BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md'), '# cross\n', 'utf8');
    await writeFile(join(defectsRunRoot, 'BCIN-7289_SELF_TEST_GAP_ANALYSIS.md'), '# self\n', 'utf8');
    await writeFile(
      join(defectsRunRoot, 'context', 'gap_bundle_BCIN-7289.json'),
      JSON.stringify({
        run_key: 'BCIN-7289',
        generated_at: '2099-03-21T00:00:00.000Z',
        feature_id: 'BCIN-7289',
        feature_family: 'report-editor',
        source_artifacts: ['BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md'],
        gaps: [],
      }, null, 2),
      'utf8',
    );

    const phase0 = spawnSync('bash', [
      PHASE0,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', repoRoot,
      '--target-skill-path', 'workspace-planner/skills/qa-plan-orchestrator',
      '--target-skill-name', 'qa-plan-orchestrator',
      '--benchmark-profile', 'qa-plan-defect-recall',
      '--feature-id', 'BCIN-7289',
      '--feature-family', 'report-editor',
    ], {
      encoding: 'utf8',
    });
    assert.equal(phase0.status, 0);

    const phase1 = spawnSync('bash', [
      PHASE1,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', repoRoot,
    ], {
      encoding: 'utf8',
    });

    assert.equal(phase1.status, 0);
    const evidence = JSON.parse(
      await readFile(join(runRoot, 'context', `defect_evidence_${runKey}.json`), 'utf8'),
    );
    const task = JSON.parse(await readFile(join(runRoot, 'task.json'), 'utf8'));
    assert.equal(evidence.defects_analysis_run_key, 'BCIN-7289');
    assert.equal(evidence.replay_evidence_enabled, true);
    assert.equal(task.defect_analysis_run_key, 'BCIN-7289');
  } finally {
    await rm(runRoot, { recursive: true, force: true });
    await rm(repoRoot, { recursive: true, force: true });
  }
});

test('phase1 preserves an existing scoreboard when the run is resumed', async () => {
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase1-resume-'));
  const runKey = `qa-plan-phase1-resume-${Date.now()}`;
  const fixturePath = '.agents/skills/qa-plan-evolution/scripts/test/fixtures/minimal-target-skill';

  try {
    const phase0 = spawnSync('bash', [
      PHASE0,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', REPO_ROOT,
      '--target-skill-path', fixturePath,
      '--target-skill-name', 'minimal-target-skill',
      '--benchmark-profile', 'generic-skill-regression',
    ], {
      encoding: 'utf8',
    });
    assert.equal(phase0.status, 0);

    const preservedScoreboard = {
      run_key: runKey,
      champion: {
        defect_recall_score: 0.75,
        contract_compliance_score: 0.8,
        knowledge_pack_coverage_score: 0.9,
        regression_count: 0,
      },
      iterations: [
        {
          iteration: 1,
          accept: true,
          scores: {
            defect_recall_score: 0.75,
            contract_compliance_score: 0.8,
            knowledge_pack_coverage_score: 0.9,
            regression_count: 0,
          },
        },
      ],
    };
    await writeFile(
      join(runRoot, 'benchmarks', `scoreboard_${runKey}.json`),
      `${JSON.stringify(preservedScoreboard, null, 2)}\n`,
      'utf8',
    );

    const resumed = spawnSync('bash', [
      PHASE0,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', REPO_ROOT,
      '--choice', 'resume',
      '--target-skill-path', fixturePath,
      '--target-skill-name', 'minimal-target-skill',
      '--benchmark-profile', 'generic-skill-regression',
    ], {
      encoding: 'utf8',
    });
    assert.equal(resumed.status, 0);

    const phase1 = spawnSync('bash', [
      PHASE1,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', REPO_ROOT,
    ], {
      encoding: 'utf8',
    });

    assert.equal(phase1.status, 0);
    const scoreboard = JSON.parse(
      await readFile(join(runRoot, 'benchmarks', `scoreboard_${runKey}.json`), 'utf8'),
    );
    assert.deepEqual(scoreboard, preservedScoreboard);
  } finally {
    await rm(runRoot, { recursive: true, force: true });
  }
});

test('phase1 seeds the initial champion from the current generic target scores', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-phase1-generic-repo-'));
  const targetSkillPath = 'skills/generic-target';
  const targetRoot = join(repoRoot, targetSkillPath);

  try {
    await mkdir(targetRoot, { recursive: true });
    await writeFile(join(targetRoot, 'SKILL.md'), GENERIC_TARGET_SKILL_MD, 'utf8');
    await writeFile(
      join(targetRoot, 'package.json'),
      JSON.stringify({
        name: 'generic-target',
        private: true,
        type: 'module',
      }, null, 2),
      'utf8',
    );
    assert.deepEqual(
      buildInitialChampionScoreboard(targetRoot, {
        profileId: 'generic-skill-regression',
      }),
      {
      defect_recall_score: 0,
      contract_compliance_score: 0.5,
      knowledge_pack_coverage_score: 0,
      regression_count: 0,
      },
    );
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});
