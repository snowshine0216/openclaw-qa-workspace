import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { getProfileById } from './loadProfile.mjs';
import { withRetry } from './retry.mjs';

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function readIfExists(path) {
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

function scoreRatio(passed, total) {
  if (total === 0) return 1;
  return Number((passed / total).toFixed(4));
}

export function computeProfileScores(targetRoot, { profileId, knowledgePackKey = null } = {}) {
  const evalPath = join(targetRoot, 'evals', 'evals.json');
  const skillPath = join(targetRoot, 'SKILL.md');
  const referencePath = join(targetRoot, 'reference.md');
  const readmePath = join(targetRoot, 'README.md');
  const phase4aPath = join(targetRoot, 'references', 'phase4a-contract.md');
  const phase5aPath = join(targetRoot, 'references', 'review-rubric-phase5a.md');
  const phase5bPath = join(targetRoot, 'references', 'review-rubric-phase5b.md');
  const phase7Path = join(targetRoot, 'scripts', 'phase7.sh');
  const finalPlanSummaryPath = join(targetRoot, 'scripts', 'lib', 'finalPlanSummary.mjs');
  const corpus = [
    readIfExists(skillPath),
    readIfExists(referencePath),
    readIfExists(readmePath),
    readIfExists(phase4aPath),
    readIfExists(phase5aPath),
    readIfExists(phase5bPath),
    readIfExists(phase7Path),
    readIfExists(finalPlanSummaryPath),
  ].join('\n');

  let evalGroups = [];
  if (existsSync(evalPath)) {
    try {
      evalGroups = readJson(evalPath).eval_groups ?? [];
    } catch {
      evalGroups = [];
    }
  }
  const evalGroupIds = new Set(evalGroups.map((group) => group.id));

  let defectRecallScore = 0;
  let knowledgePackCoverageScore = 0;
  let contractComplianceScore = 0;

  if (profileId?.startsWith('qa-plan')) {
    const defectReplayChecks = [
      evalGroupIds.has('defect_recall_replay'),
      evalGroupIds.has('self_test_gap_explanation'),
      evalGroupIds.has('interaction_matrix_coverage'),
      corpus.includes('[ANALOG-GATE]'),
      corpus.includes('developer_smoke_test_'),
    ];
    defectRecallScore = scoreRatio(
      defectReplayChecks.filter(Boolean).length,
      defectReplayChecks.length,
    );

    const contractChecks = [
      existsSync(skillPath),
      existsSync(referencePath),
      existsSync(phase4aPath),
      existsSync(phase5aPath),
      existsSync(phase5bPath),
      evalGroupIds.has('developer_smoke_generation'),
    ];
    contractComplianceScore = scoreRatio(
      contractChecks.filter(Boolean).length,
      contractChecks.length,
    );

    const packPath = knowledgePackKey
      ? join(targetRoot, 'knowledge-packs', knowledgePackKey, 'pack.json')
      : null;
    if (packPath && existsSync(packPath)) {
      const pack = readJson(packPath);
      const capabilityChecks = [
        ...(pack.required_capabilities ?? []).map((capability) =>
          corpus.toLowerCase().includes(String(capability).toLowerCase()),
        ),
        ...(pack.sdk_visible_contracts ?? []).map((contract) =>
          corpus.includes(String(contract)),
        ),
        ...(pack.analog_gates ?? []).map((gate) =>
          corpus.toLowerCase().includes(String(gate.behavior || '').toLowerCase()),
        ),
        ...(pack.interaction_pairs ?? []).map((pair) =>
          pair.every((term) => corpus.toLowerCase().includes(String(term).toLowerCase())),
        ),
      ];
      knowledgePackCoverageScore = scoreRatio(
        capabilityChecks.filter(Boolean).length,
        capabilityChecks.length,
      );
    }
  } else {
    const contractChecks = [
      existsSync(skillPath),
      existsSync(referencePath),
    ];
    contractComplianceScore = scoreRatio(
      contractChecks.filter(Boolean).length,
      contractChecks.length,
    );
  }

  return {
    defect_recall_score: defectRecallScore,
    knowledge_pack_coverage_score: knowledgePackCoverageScore,
    contract_compliance_score: contractComplianceScore,
  };
}

export function buildInitialChampionScoreboard(
  targetRoot,
  { profileId, knowledgePackKey = null } = {},
) {
  return {
    ...computeProfileScores(targetRoot, { profileId, knowledgePackKey }),
    regression_count: 0,
  };
}

function resolveQaPlanBenchmarkControls(profileId, defectAnalysisRunKey = null) {
  const profile = getProfileById(profileId);
  const hooks = profile.evidence_hooks ?? {};
  const enabledEvidenceModes = ['blind_pre_defect'];

  if (hooks.defect_replay_evals) {
    enabledEvidenceModes.push('retrospective_replay');
  }
  if (hooks.holdout_evals) {
    enabledEvidenceModes.push('holdout_regression');
  }

  return {
    enabledEvidenceModes,
    defectAnalysisRunKey: hooks.defect_replay_evals ? (defectAnalysisRunKey ?? null) : null,
  };
}

function createValidationResult() {
  return {
    smoke_ok: true,
    eval_ok: true,
    regression_count: 0,
    contract_compliance_score: 1,
    smoke_log: '',
    eval_log: '',
    commands: [],
    execution_order: [],
  };
}

function sliceErrorOutput(error) {
  return String(error.stdout || error.stderr || error.message).slice(0, 8000);
}

async function runSmoke(abs, result) {
  const pkg = join(abs, 'package.json');
  if (!existsSync(pkg)) {
    result.smoke_log = 'No package.json; smoke skipped.';
    return;
  }

  let hasTestScript = false;
  try {
    const pj = JSON.parse(readFileSync(pkg, 'utf8'));
    hasTestScript = Boolean(pj.scripts?.test);
  } catch {
    hasTestScript = false;
  }

  if (!hasTestScript) {
    result.smoke_log = 'No "test" script in package.json; smoke skipped.';
    return;
  }

  try {
    const log = await withRetry(
      () =>
        execSync('npm test', {
          cwd: abs,
          encoding: 'utf8',
          stdio: 'pipe',
          env: { ...process.env, CI: '1' },
        }),
      { retries: 1, delayMs: 200 },
    );
    result.smoke_log = log.slice(0, 8000);
    result.commands.push('npm test');
    result.execution_order.push('smoke');
  } catch (error) {
    result.smoke_ok = false;
    result.regression_count += 1;
    result.smoke_log = sliceErrorOutput(error);
    result.commands.push('npm test (failed)');
    result.execution_order.push('smoke');
  }
}

function runContractEvals(abs, result) {
  const runEvals = join(abs, 'evals', 'run_evals.mjs');
  if (!existsSync(runEvals)) {
    result.eval_log = 'No evals/run_evals.mjs; eval harness skipped.';
    return;
  }

  try {
    const log = execSync('node evals/run_evals.mjs --dry-run', {
      cwd: abs,
      encoding: 'utf8',
      stdio: 'pipe',
    });
    result.eval_log = log.slice(0, 8000);
    result.commands.push('node evals/run_evals.mjs --dry-run');
    result.execution_order.push('contract_evals');
  } catch (error) {
    result.eval_ok = false;
    result.regression_count += 1;
    result.eval_log = sliceErrorOutput(error);
    result.commands.push('node evals/run_evals.mjs --dry-run (failed)');
    result.execution_order.push('contract_evals');
  }
}

export function runContractEvalValidation(targetRoot) {
  const result = {
    eval_ok: true,
    eval_log: '',
    commands: [],
    execution_order: [],
  };
  runContractEvals(targetRoot, result);
  return result;
}

async function runQaPlanReplayValidation(repoRoot, targetSkillPath, abs, options, result) {
  const benchmarkRoot = join(repoRoot, targetSkillPath, 'benchmarks', 'qa-plan-v2');
  const executedRunnerPath = join(benchmarkRoot, 'scripts', 'run_iteration_compare.mjs');
  const syntheticPublisherPath = join(
    benchmarkRoot,
    'scripts',
    'lib',
    'publishIterationComparison.mjs',
  );
  const modulePath = existsSync(executedRunnerPath)
    ? executedRunnerPath
    : syntheticPublisherPath;
  if (!existsSync(modulePath)) {
    return;
  }

  result.execution_order.push('defect_replay_evals');
  const moduleUrl = pathToFileURL(modulePath).href;
  const module = await import(moduleUrl);
  const compare = module.runIterationCompare ?? module.publishIterationComparison;
  const published = await compare({
    benchmarkRoot,
    skillRoot: abs,
    iteration: options.iteration ?? 1,
    defectAnalysisRunKey: options.defectAnalysisRunKey ?? null,
    enabledEvidenceModes: options.enabledEvidenceModes ?? null,
    targetFeatureFamily: options.targetFeatureFamily ?? null,
  });
  result.benchmark_artifacts = published;
  result.scorecard = JSON.parse(readFileSync(published.scorecardPath, 'utf8'));
}

export async function runTargetValidation(repoRoot, targetSkillPath, options = {}) {
  const abs = options.candidateRoot ?? join(repoRoot, targetSkillPath);
  const result = createValidationResult();
  result.validated_target_root = abs;

  await runSmoke(abs, result);
  if (!result.smoke_ok) {
    return result;
  }

  const contractEval = runContractEvalValidation(abs);
  result.eval_ok = contractEval.eval_ok;
  result.eval_log = contractEval.eval_log;
  result.commands.push(...contractEval.commands);
  result.execution_order.push(...contractEval.execution_order);
  if (!result.eval_ok) {
    return result;
  }

  const scores = computeProfileScores(abs, {
    profileId: options.profileId,
    knowledgePackKey: options.knowledgePackKey,
  });
  result.defect_recall_score = scores.defect_recall_score;
  result.knowledge_pack_coverage_score = scores.knowledge_pack_coverage_score;
  result.contract_compliance_score = Math.min(
    result.contract_compliance_score,
    scores.contract_compliance_score,
  );
  if (options.profileId?.startsWith('qa-plan')) {
    const benchmarkControls = resolveQaPlanBenchmarkControls(
      options.profileId,
      options.defectAnalysisRunKey ?? null,
    );
    await runQaPlanReplayValidation(
      repoRoot,
      targetSkillPath,
      abs,
      {
        ...options,
        ...benchmarkControls,
        targetFeatureFamily: options.featureFamily ?? null,
      },
      result,
    );
  }

  return result;
}
