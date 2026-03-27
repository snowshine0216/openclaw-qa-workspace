#!/usr/bin/env node
import { existsSync, readFileSync, readlinkSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  markPhaseJobsPostApplied,
  refreshJobs,
  registerManifestJob,
} from '../asyncJobStore.mjs';
import {
  runQaPlanBenchmarkCompare,
  runTargetValidation,
} from '../runTargetValidation.mjs';
import { createHash } from 'node:crypto';
import { getQaPlanBenchmarkRuntimeRoot } from '../benchmarkPaths.mjs';
import {
  parsePhaseArgs,
  resolveRunContext,
  requireTask,
  requireRun,
  touchTask,
  touchRun,
} from './common.mjs';

function fingerprintDir(root) {
  const hash = createHash('sha256');
  const visit = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true }).sort((left, right) => left.name.localeCompare(right.name))) {
      const path = join(dir, entry.name);
      hash.update(entry.name);
      if (entry.isSymbolicLink()) {
        hash.update('symlink');
        hash.update(readlinkSync(path));
        continue;
      }
      if (entry.isDirectory()) {
        visit(path);
        continue;
      }
      hash.update(readFileSync(path));
    }
  };
  visit(root);
  return hash.digest('hex');
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function writeJson(path, payload) {
  writeFileSync(path, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

function buildValidationSummary(validation, iter) {
  return {
    iteration: iter,
    smoke_ok: validation.smoke_ok,
    eval_ok: validation.eval_ok,
    regression_count: validation.regression_count,
    contract_compliance_score: validation.contract_compliance_score,
    defect_recall_score: validation.defect_recall_score ?? 0,
    knowledge_pack_coverage_score: validation.knowledge_pack_coverage_score ?? 0,
    execution_order: validation.execution_order ?? [],
    benchmark_artifacts: validation.benchmark_artifacts ?? null,
  };
}

function mergeBenchmarkCompareValidation(precheck, compare) {
  const validation = {
    ...precheck,
    benchmark_artifacts: compare.benchmark_artifacts ?? null,
    scorecard: compare.scorecard ?? null,
    execution_order: [
      ...(precheck.execution_order ?? []),
      ...(compare.execution_order ?? []),
    ],
  };
  if (compare.ok === false) {
    validation.eval_ok = false;
    validation.regression_count = (validation.regression_count ?? 0) + 1;
    validation.eval_log = [validation.eval_log, compare.error?.message]
      .filter(Boolean)
      .join('\n\n');
  }
  return validation;
}

function writeValidationArtifacts(iterDir, validation, summary) {
  const report = [
    `# Validation report (iteration ${summary.iteration})`,
    '',
    '## Summary',
    '```json',
    JSON.stringify(summary, null, 2),
    '```',
    '',
    '## Smoke',
    '```',
    validation.smoke_log,
    '```',
    '',
    '## Eval harness',
    '```',
    validation.eval_log,
    '```',
  ].join('\n');

  writeFileSync(join(iterDir, 'validation_report.md'), `${report}\n`, 'utf8');
  writeJson(join(iterDir, 'validation_report.json'), { summary, validation });
  writeJson(join(iterDir, 'smoke_results.json'), {
    ok: validation.smoke_ok,
    log: validation.smoke_log,
  });
  writeJson(join(iterDir, 'eval_results.json'), {
    ok: validation.eval_ok,
    log: validation.eval_log,
  });
}

function benchmarkArtifactPaths(repoRoot, task, runRoot, iter) {
  const benchmarkRoot = getQaPlanBenchmarkRuntimeRoot(repoRoot);
  const iterationDir = join(benchmarkRoot, `iteration-${iter}`);
  return {
    compareResultPath: join(runRoot, 'candidates', `iteration-${iter}`, 'benchmark_compare_result.json'),
    benchmarkJsonPath: join(iterationDir, 'benchmark.json'),
    scorecardPath: join(iterationDir, 'scorecard.json'),
  };
}

function writePhase4Receipt(runRoot, run, iter, validationFingerprint, validationReportPath) {
  touchRun(runRoot, run, {
    latest_validation_completed_at: new Date().toISOString(),
    phase_receipts: {
      ...(run.phase_receipts ?? {}),
      phase4: {
        iteration: iter,
        fingerprint: validationFingerprint,
        completed_at: new Date().toISOString(),
        reusable: true,
        invalidated: false,
        output_artifacts: {
          validation_report_json: validationReportPath,
        },
      },
    },
  });
}

function buildBenchmarkManifest({ repoRoot, runKey, runRoot, iter }) {
  const phase4ModulePath = fileURLToPath(import.meta.url);
  return {
    reason: 'benchmark_compare',
    action: 'run_phase4_benchmark_compare',
    run_key: runKey,
    requests: [
      {
        local_command: {
          argv: [
            'node',
            phase4ModulePath,
            '--run-key',
            runKey,
            '--run-root',
            runRoot,
            '--repo-root',
            repoRoot,
            '--iteration',
            String(iter),
            '--benchmark-worker',
          ],
          cwd: repoRoot,
        },
      },
    ],
  };
}

export async function main(argv = process.argv.slice(2)) {
  const args = parsePhaseArgs(argv);
  const { runKey, repoRoot, runRoot } = resolveRunContext(args);
  const task = requireTask(runRoot);
  const run = requireRun(runRoot);
  if (!args.benchmark_worker) {
    refreshJobs(runRoot, { phase: 'phase4' });
  }

  const iter = parseInt(String(args.iteration ?? task.current_iteration ?? 1), 10) || 1;
  const iterDir = join(runRoot, 'candidates', `iteration-${iter}`);
  mkdirSync(iterDir, { recursive: true });
  const candidateScopePath = join(iterDir, 'candidate_scope.json');
  const candidatePatchSummaryPath = join(iterDir, 'candidate_patch_summary.md');
  if (!existsSync(candidateScopePath) || !existsSync(candidatePatchSummaryPath)) {
    throw new Error(`Missing candidate patch artifacts for iteration ${iter}; run phase3 first`);
  }
  const candidateScope = JSON.parse(readFileSync(candidateScopePath, 'utf8'));
  const candidateRoot = join(runRoot, candidateScope.candidate_snapshot_path);
  if (!existsSync(candidateRoot)) {
    throw new Error(`Missing candidate snapshot for iteration ${iter}: ${candidateRoot}`);
  }
  const validationFingerprint = fingerprintDir(candidateRoot);
  const validationReportPath = join(iterDir, 'validation_report.json');
  const phase4Receipt = run.phase_receipts?.phase4 ?? null;
  if (
    phase4Receipt?.iteration === iter
    && phase4Receipt?.fingerprint === validationFingerprint
    && phase4Receipt?.output_artifacts?.validation_report_json === validationReportPath
    && existsSync(validationReportPath)
  ) {
    console.log(`phase4 reused: iteration-${iter}`);
    return;
  }

  const isQaPlanProfile = String(task.benchmark_profile || '').startsWith('qa-plan');
  const precheckPath = join(iterDir, 'validation_precheck.json');
  const benchmarkPaths = benchmarkArtifactPaths(repoRoot, task, runRoot, iter);

  if (args.benchmark_worker) {
    const compare = await runQaPlanBenchmarkCompare(repoRoot, task.target_skill_path, {
      candidateRoot,
      profileId: task.benchmark_profile,
      knowledgePackKey: task.knowledge_pack_key ?? null,
      featureFamily: task.feature_family ?? null,
      iteration: iter,
      defectAnalysisRunKey: task.defect_analysis_run_key ?? null,
    });
    writeJson(benchmarkPaths.compareResultPath, compare);
    console.log(`phase4 benchmark worker ok: iteration-${iter}`);
    return;
  }

  if (args.post) {
    const precheck = readJson(precheckPath).validation ?? null;
    const compare = readJson(benchmarkPaths.compareResultPath);
    if (!precheck) {
      throw new Error(`Missing phase4 precheck artifacts for iteration ${iter}: ${precheckPath}`);
    }
    const validation = mergeBenchmarkCompareValidation(precheck, compare);
    const summary = buildValidationSummary(validation, iter);
    writeValidationArtifacts(iterDir, validation, summary);
    writePhase4Receipt(runRoot, run, iter, validationFingerprint, validationReportPath);
    if (!validation.smoke_ok || !validation.eval_ok) {
      console.error('phase4: validation reported failures (see validation_report.md)');
      process.exitCode = 1;
      return;
    }
    touchTask(runRoot, task, {
      current_phase: 'phase5',
      next_action: 'run_phase5',
      next_action_reason: 'ready_for_phase5',
      pending_job_ids: [],
      blocking_reason: null,
    });
    markPhaseJobsPostApplied(runRoot, 'phase4');
    console.log(`phase4 ok: iteration-${iter}`);
    return;
  }

  const validation = await runTargetValidation(repoRoot, task.target_skill_path, {
    candidateRoot,
    profileId: task.benchmark_profile,
    knowledgePackKey: task.knowledge_pack_key ?? null,
    featureFamily: task.feature_family ?? null,
    iteration: iter,
    defectAnalysisRunKey: task.defect_analysis_run_key ?? null,
    skipQaPlanReplayValidation: isQaPlanProfile,
  });
  if (!validation.smoke_ok || !validation.eval_ok) {
    const summary = buildValidationSummary(validation, iter);
    writeValidationArtifacts(iterDir, validation, summary);
    writePhase4Receipt(runRoot, run, iter, validationFingerprint, validationReportPath);
    console.error('phase4: validation reported failures (see validation_report.md)');
    process.exitCode = 1;
    return;
  }

  if (isQaPlanProfile) {
    writeJson(precheckPath, { validation });
    const manifestPath = join(iterDir, 'phase4_spawn_manifest.json');
    writeJson(manifestPath, buildBenchmarkManifest({
      repoRoot,
      runKey,
      runRoot,
      iter,
    }));
    registerManifestJob(runRoot, {
      phase: 'phase4',
      manifestPath,
      expectedArtifacts: [
        benchmarkPaths.compareResultPath,
        benchmarkPaths.benchmarkJsonPath,
        benchmarkPaths.scorecardPath,
      ],
      completionProbe: 'expected_artifacts_and_spawn_results',
      freshnessInputs: [precheckPath],
      timeoutAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      retryPolicy: { owner: 'orchestrator', max_retries: 1 },
      nextAction: 'await_async_completion',
      nextActionReason: 'awaiting_async_prerequisite',
      blockingReason: 'waiting_on_benchmark_compare',
    });
    console.log(`SPAWN_MANIFEST: ${manifestPath}`);
    process.exitCode = 2;
    return;
  }

  const summary = buildValidationSummary(validation, iter);
  writeValidationArtifacts(iterDir, validation, summary);
  writePhase4Receipt(runRoot, run, iter, validationFingerprint, validationReportPath);
  touchTask(runRoot, task, {
    current_phase: 'phase5',
    next_action: 'run_phase5',
    next_action_reason: 'ready_for_phase5',
    pending_job_ids: [],
    blocking_reason: null,
  });
  console.log(`phase4 ok: iteration-${iter}`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
