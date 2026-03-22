#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  detectReportStateSync,
  ensureRunDirs,
  clearRunArtifacts,
  createTaskSkeleton,
  createRunSkeleton,
  writeJson,
  loadTask,
} from '../workflowState.mjs';
import { copyChampionSnapshot } from '../snapshot.mjs';
import { parsePhaseArgs, resolveRunContext } from './common.mjs';
import { resolveKnowledgePackKey } from '../knowledgePackResolver.mjs';

function parseMax(v, fallback = 10) {
  const n = parseInt(String(v ?? fallback), 10);
  if (Number.isNaN(n)) return fallback;
  return n;
}

export async function main(argv = process.argv.slice(2)) {
  const args = parsePhaseArgs(argv);
  const { runKey, repoRoot, runRoot } = resolveRunContext(args);

  const rawMax = parseMax(args.max_iterations, 10);
  if (rawMax > 10) {
    throw new Error('max_iterations must be <= 10');
  }
  const maxIterations = rawMax;

  const targetSkillPath = args.target_skill_path;
  const targetSkillName = args.target_skill_name;
  const benchmarkProfile = args.benchmark_profile ?? 'generic-skill-regression';

  if (!targetSkillPath || !targetSkillName) {
    throw new Error('--target-skill-path and --target-skill-name are required');
  }

  const reportState = detectReportStateSync(runRoot);

  const choice = args.choice ?? process.env.EVOLUTION_USER_CHOICE;
  const existing = loadTask(runRoot);
  if (existing && choice === 'resume') {
    console.log(`phase0 ok: resume preserved task.json at ${runRoot}`);
    return;
  }

  if (
    (reportState === 'FINAL_EXISTS' ||
      reportState === 'DRAFT_EXISTS' ||
      reportState === 'CONTEXT_ONLY') &&
    !choice
  ) {
    const msg = {
      report_state: reportState,
      message:
        'Set --choice or EVOLUTION_USER_CHOICE to resume, use_existing, smart_refresh, full_regenerate, or generate_from_cache.',
    };
    console.error(JSON.stringify(msg));
    process.exitCode = 2;
    return;
  }

  if (choice === 'full_regenerate') {
    clearRunArtifacts(runRoot);
  }

  ensureRunDirs(runRoot);
  const resolvedKnowledgePack = resolveKnowledgePackKey({
    repoRoot,
    targetSkillPath,
    targetSkillName,
    benchmarkProfile,
    requestedKnowledgePackKey: args.knowledge_pack_key ?? null,
    featureFamily: args.feature_family ?? null,
    featureId: args.feature_id ?? null,
  });

  const task = createTaskSkeleton({
    requestedKnowledgePackKey: args.knowledge_pack_key ?? null,
    resolvedKnowledgePackKey: resolvedKnowledgePack.key,
    knowledgePackResolutionSource: resolvedKnowledgePack.source,
    runKey,
    targetSkillName,
    targetSkillPath,
    benchmarkProfile,
    featureId: args.feature_id ?? null,
    featureFamily: args.feature_family ?? null,
    knowledgePackKey: resolvedKnowledgePack.key,
    defectAnalysisRunKey: args.defect_analysis_run_key ?? null,
    maxIterations,
    reportState,
  });

  task.overall_status = 'in_progress';
  task.current_phase = 'phase1';
  task.report_state = reportState;
  if (reportState === 'FRESH' || choice === 'full_regenerate') {
    const champDir = join(runRoot, 'archive', 'champion-initial');
    copyChampionSnapshot(repoRoot, targetSkillPath, champDir);
    task.champion_snapshot_path = 'archive/champion-initial';
  }

  writeJson(join(runRoot, 'task.json'), task);
  writeJson(join(runRoot, 'run.json'), createRunSkeleton(runKey));

  const setupMd = [
    `# Runtime setup`,
    '',
    `- run_key: ${runKey}`,
    `- report_state: ${reportState}`,
    `- target: ${targetSkillPath}`,
    `- benchmark_profile: ${benchmarkProfile}`,
    `- knowledge_pack_key: ${task.knowledge_pack_key ?? 'none'}`,
    `- knowledge_pack_resolution_source: ${task.knowledge_pack_resolution_source ?? 'none'}`,
    `- max_iterations: ${maxIterations}`,
  ].join('\n');

  writeFileSync(join(runRoot, 'context', `runtime_setup_${runKey}.md`), setupMd, 'utf8');
  writeJson(join(runRoot, 'context', `runtime_setup_${runKey}.json`), {
    run_key: runKey,
    report_state: reportState,
    repo_root: repoRoot,
    target_skill_path: targetSkillPath,
    benchmark_profile: benchmarkProfile,
    requested_knowledge_pack_key: args.knowledge_pack_key ?? null,
    resolved_knowledge_pack_key: task.knowledge_pack_key ?? null,
    knowledge_pack_resolution_source: task.knowledge_pack_resolution_source ?? null,
    defect_analysis_run_key: args.defect_analysis_run_key ?? null,
    max_iterations: maxIterations,
  });

  console.log(`phase0 ok: run_root=${runRoot} report_state=${reportState}`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
