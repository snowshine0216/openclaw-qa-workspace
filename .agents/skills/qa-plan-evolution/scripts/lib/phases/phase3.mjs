#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { selectNextMutation } from '../mutationPlanner.mjs';
import { copyChampionSnapshot, diffSnapshotDirs } from '../snapshot.mjs';
import {
  parsePhaseArgs,
  resolveRunContext,
  requireTask,
  loadRun,
  touchRun,
  touchTask,
} from './common.mjs';

function buildPlan(selected, iter) {
  return [
    `# Candidate plan (iteration ${iter})`,
    '',
    `## Selected mutation: ${selected.mutation_id}`,
    `- Root cause bucket: ${selected.root_cause_bucket}`,
    `- Target files: ${selected.target_files.join(', ')}`,
    `- Source observations: ${(selected.source_observation_ids ?? []).join(', ') || 'none'}`,
    `- Evidence paths: ${(selected.evidence_paths ?? []).join(', ') || 'none'}`,
    `- Priority: severity=${selected.priority?.severity_rank ?? 'n/a'}, bucket=${selected.priority?.bucket_rank ?? 'n/a'}, phase=${selected.priority?.phase_rank ?? 'n/a'}`,
    '',
    '## Steps',
    '1. Apply a minimal patch to the candidate snapshot only.',
    '2. Do not modify the original target skill tree.',
    '3. Re-run smoke and eval validation via phase4.',
    '',
    '## Knowledge pack delta',
    selected.knowledge_pack_delta,
  ].join('\n');
}

function buildTaskPrompt({ task, iter, selected, candidateSnapshotPath }) {
  const targetPrefix = `${task.target_skill_path}/`;
  const candidateFiles = selected.target_files.map((targetFile) => {
    const relativePath = targetFile.startsWith(targetPrefix)
      ? targetFile.slice(targetPrefix.length)
      : targetFile;
    return join(candidateSnapshotPath, relativePath);
  });

  return [
    `Apply the iteration ${iter} mutation for ${task.target_skill_path}.`,
    '',
    'Rules:',
    `- Only edit files under ${candidateSnapshotPath}.`,
    '- Do not touch the original target skill tree.',
    '- A no-op candidate is invalid; make concrete file changes.',
    '- Keep the patch minimal and limited to the selected mutation.',
    '',
    `Selected mutation: ${selected.mutation_id}`,
    `Root cause bucket: ${selected.root_cause_bucket}`,
    `Target snapshot files: ${candidateFiles.join(', ')}`,
    `Knowledge-pack delta: ${selected.knowledge_pack_delta || 'none'}`,
  ].join('\n');
}

function writeJson(path, payload) {
  writeFileSync(path, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

function buildStopSummary(runKey, task, iter) {
  return [
    `# Evolution summary (${runKey})`,
    '',
    `- target: ${task.target_skill_path}`,
    `- benchmark_profile: ${task.benchmark_profile ?? 'unknown'}`,
    `- iteration_evaluated: ${iter}`,
    `- next_action: stop_no_blocking_gaps`,
    '',
    'No pending mutations remain. The run is complete without creating a challenger.',
    '',
  ].join('\n');
}

function stopForEmptyBacklog({ runRoot, runKey, task, iter }) {
  const run = loadRun(runRoot);
  writeJson(join(runRoot, 'context', `next_action_${runKey}.json`), {
    next_action: 'stop_no_blocking_gaps',
    overall_status: 'completed',
    iteration: iter,
    reason: 'no_pending_mutations',
  });
  writeFileSync(
    join(runRoot, 'evolution_final.md'),
    buildStopSummary(runKey, task, iter),
    'utf8',
  );
  touchTask(runRoot, task, {
    current_phase: 'phase3',
    current_iteration: iter,
    overall_status: 'completed',
    pending_finalization_iteration: null,
  });
  if (run) {
    touchRun(runRoot, run, {
      finalized_at: new Date().toISOString(),
    });
  }
}

function finalizeCandidatePatch({ repoRoot, runRoot, task, iter }) {
  const iterDir = join(runRoot, 'candidates', `iteration-${iter}`);
  const candidateSnapshotPath = join(iterDir, 'candidate_snapshot');
  const changedFiles = diffSnapshotDirs(
    join(repoRoot, task.target_skill_path),
    candidateSnapshotPath,
  );
  if (changedFiles.length === 0) {
    throw new Error('Candidate mutation produced no file changes in candidate snapshot.');
  }

  const scopePath = join(iterDir, 'candidate_scope.json');
  const scope = JSON.parse(readFileSync(scopePath, 'utf8'));
  scope.changed_files = changedFiles;
  writeJson(scopePath, scope);

  const summary = [
    `# Candidate patch summary (iteration ${iter})`,
    '',
    `- mutation_id: ${scope.mutation?.mutation_id ?? 'unknown'}`,
    `- changed_files_count: ${changedFiles.length}`,
    '',
    '## Changed files',
    ...changedFiles.map((changedFile) => `- ${changedFile}`),
  ].join('\n');
  writeFileSync(join(iterDir, 'candidate_patch_summary.md'), `${summary}\n`, 'utf8');
}

export async function main(argv = process.argv.slice(2)) {
  const args = parsePhaseArgs(argv);
  const { runKey, repoRoot, runRoot } = resolveRunContext(args);
  const task = requireTask(runRoot);

  const iter = parseInt(String(args.iteration ?? task.current_iteration ?? 1), 10) || 1;
  const backlogPath = join(runRoot, 'context', `mutation_backlog_${runKey}.json`);
  const raw = JSON.parse(readFileSync(backlogPath, 'utf8'));
  const mutations = raw.mutations ?? [];
  const acceptedGapIdsPath = join(runRoot, 'context', `accepted_gap_ids_${runKey}.json`);
  const acceptedGapIds = existsSync(acceptedGapIdsPath)
    ? JSON.parse(readFileSync(acceptedGapIdsPath, 'utf8')).gap_ids ?? []
    : [];
  const selected = selectNextMutation({
    mutations,
    addressedGapIds: acceptedGapIds,
  }) ?? mutations[0] ?? null;

  if (!selected) {
    stopForEmptyBacklog({ runRoot, runKey, task, iter });
    console.log(`phase3 ok: no pending mutations remain for iteration-${iter}`);
    console.log('STOP_RUN: no blocking gaps remain');
    return;
  }

  const iterDir = join(runRoot, 'candidates', `iteration-${iter}`);
  mkdirSync(iterDir, { recursive: true });
  const candidateSnapshotPath = join(iterDir, 'candidate_snapshot');

  if (args.post) {
    finalizeCandidatePatch({
      repoRoot,
      runRoot,
      task,
      iter,
    });
    console.log(`phase3 ok: iteration-${iter} candidate_patch_summary written`);
    return;
  }

  if (!existsSync(candidateSnapshotPath)) {
    copyChampionSnapshot(repoRoot, task.target_skill_path, candidateSnapshotPath);
  }

  const plan = buildPlan(selected, iter);
  const candidateSnapshotRel = relative(runRoot, candidateSnapshotPath);
  const candidateSnapshotWorkerPath = relative(repoRoot, candidateSnapshotPath);
  const patchTaskPath = join(iterDir, 'candidate_patch_task.md');
  const prompt = buildTaskPrompt({
    task,
    iter,
    selected,
    candidateSnapshotPath: candidateSnapshotWorkerPath,
  });
  writeFileSync(patchTaskPath, `${prompt}\n`, 'utf8');
  const manifestPath = join(iterDir, 'phase3_spawn_manifest.json');
  writeJson(manifestPath, {
    reason: 'candidate_mutation',
    action: 'apply_candidate_patch',
    run_key: runKey,
    requests: [
      {
        openclaw: {
          args: {
            task: prompt,
            label: `skill-evolution-phase3-${runKey}-i${iter}`,
            mode: 'run',
            runtime: 'subagent',
            output_file: 'candidate_worker_output.md',
          },
        },
      },
    ],
  });

  writeFileSync(join(iterDir, 'candidate_plan.md'), `${plan}\n`, 'utf8');
  writeJson(join(iterDir, 'candidate_scope.json'), {
    iteration: iter,
    mutation: selected,
    candidate_snapshot_path: candidateSnapshotRel,
    changed_files: [],
  });
  writeFileSync(
    join(iterDir, 'knowledge_pack_delta.md'),
    `${String(selected.knowledge_pack_delta)}\n`,
    'utf8',
  );

  console.log(`SPAWN_MANIFEST: ${manifestPath}`);
  console.log(`phase3 ready: iteration-${iter} candidate_plan written`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
