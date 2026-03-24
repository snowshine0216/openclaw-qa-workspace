#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { copyChampionSnapshot, copySnapshotDir, diffSnapshotDirs } from '../snapshot.mjs';
import { mutationSignature } from '../mutationPlanner.mjs';
import {
  parsePhaseArgs,
  resolveRunContext,
  requireTask,
  requireRun,
  touchTask,
  touchRun,
} from './common.mjs';

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function writeMutationSummary(path, title, mutations) {
  const lines = mutations.map((mutation) => `- ${mutation.mutation_id}: ${mutation.root_cause_bucket}`);
  writeFileSync(path, `# ${title}\n\n${lines.join('\n') || '- none'}\n`, 'utf8');
}

function runGit(repoRoot, args) {
  const command = ['git', '-C', repoRoot, ...args]
    .map((arg) => JSON.stringify(String(arg)))
    .join(' ');
  return execSync(command, { encoding: 'utf8', stdio: 'pipe' }).trim();
}

function updateAcceptedGapIds(runRoot, runKey, selectedGapIds) {
  const acceptedGapIdsPath = join(runRoot, 'context', `accepted_gap_ids_${runKey}.json`);
  const current = existsSync(acceptedGapIdsPath)
    ? readJson(acceptedGapIdsPath).gap_ids ?? []
    : [];
  const gapIds = [...new Set([...current, ...selectedGapIds])];
  writeFileSync(
    acceptedGapIdsPath,
    `${JSON.stringify({ gap_ids: gapIds }, null, 2)}\n`,
    'utf8',
  );
}

function updateRejectedMutationSignatures(runRoot, runKey, mutation) {
  if (!mutation) {
    return;
  }

  const rejectedMutationPath = join(runRoot, 'context', `rejected_mutation_signatures_${runKey}.json`);
  const current = existsSync(rejectedMutationPath)
    ? readJson(rejectedMutationPath)
    : { signatures: [], mutations: [] };

  const signature = mutationSignature(mutation);
  const signatures = [...new Set([...(current.signatures ?? []), signature])];
  const mutations = Array.isArray(current.mutations) ? [...current.mutations] : [];
  if (!mutations.some((entry) => entry.signature === signature)) {
    mutations.push({
      signature,
      mutation_id: mutation.mutation_id ?? null,
      root_cause_bucket: mutation.root_cause_bucket ?? null,
      target_files: mutation.target_files ?? [],
      source_observation_ids: mutation.source_observation_ids ?? [],
    });
  }

  writeFileSync(
    rejectedMutationPath,
    `${JSON.stringify({ signatures, mutations }, null, 2)}\n`,
    'utf8',
  );
}

function promoteScoreboardChampion(runRoot, runKey, scores) {
  const boardPath = join(runRoot, 'benchmarks', `scoreboard_${runKey}.json`);
  const scoreboard = existsSync(boardPath)
    ? readJson(boardPath)
    : {
        run_key: runKey,
        champion: {},
        iterations: [],
      };
  scoreboard.champion = { ...scores };
  mkdirSync(join(runRoot, 'benchmarks'), { recursive: true });
  writeFileSync(boardPath, `${JSON.stringify(scoreboard, null, 2)}\n`, 'utf8');
}

function qaPlanBenchmarkRoot(repoRoot, task) {
  return join(repoRoot, task.target_skill_path, 'benchmarks', 'qa-plan-v2');
}

function currentQaPlanChampionSnapshot(repoRoot, task) {
  const benchmarkRoot = qaPlanBenchmarkRoot(repoRoot, task);
  const historyPath = join(benchmarkRoot, 'history.json');
  if (!existsSync(historyPath)) {
    return null;
  }

  const history = readJson(historyPath);
  const iteration = history.current_champion_iteration ?? 0;
  return join(benchmarkRoot, `iteration-${iteration}`, 'champion_snapshot');
}

function ensureArchivedChampion(repoRoot, runRoot, task, iter) {
  const archivePath = join(runRoot, 'archive', `champion-pre-iteration-${iter}`);
  if (existsSync(archivePath)) {
    return archivePath;
  }

  const qaPlanChampion = task.benchmark_profile?.startsWith('qa-plan')
    ? currentQaPlanChampionSnapshot(repoRoot, task)
    : null;
  if (qaPlanChampion && existsSync(qaPlanChampion)) {
    copySnapshotDir(qaPlanChampion, archivePath);
    return archivePath;
  }

  if (task.champion_snapshot_path) {
    const snapshotPath = join(runRoot, task.champion_snapshot_path);
    if (existsSync(snapshotPath)) {
      copySnapshotDir(snapshotPath, archivePath);
      return archivePath;
    }
  }

  return null;
}

function ensureArchivedCandidate(repoRoot, runRoot, task, iter) {
  const archivePath = join(runRoot, 'archive', `candidate-iteration-${iter}`);
  if (existsSync(archivePath)) {
    return archivePath;
  }

  const candidateScopePath = join(runRoot, 'candidates', `iteration-${iter}`, 'candidate_scope.json');
  if (existsSync(candidateScopePath)) {
    const candidateSnapshotPath = readJson(candidateScopePath).candidate_snapshot_path;
    if (candidateSnapshotPath) {
      const snapshotPath = join(runRoot, candidateSnapshotPath);
      if (existsSync(snapshotPath)) {
        copySnapshotDir(snapshotPath, archivePath);
        return archivePath;
      }
    }
  }

  copyChampionSnapshot(repoRoot, task.target_skill_path, archivePath);
  return archivePath;
}

function updateQaPlanChampionHistory(repoRoot, task, iter) {
  const benchmarkRoot = qaPlanBenchmarkRoot(repoRoot, task);
  const historyPath = join(benchmarkRoot, 'history.json');
  if (!existsSync(historyPath)) {
    return;
  }

  const championSnapshotPath = join(benchmarkRoot, `iteration-${iter}`, 'champion_snapshot');
  if (!existsSync(championSnapshotPath)) {
    const candidateSnapshotPath = join(benchmarkRoot, `iteration-${iter}`, 'candidate_snapshot');
    if (existsSync(candidateSnapshotPath)) {
      copySnapshotDir(candidateSnapshotPath, championSnapshotPath);
    } else {
      copyChampionSnapshot(repoRoot, task.target_skill_path, championSnapshotPath);
    }
  }

  const history = readJson(historyPath);
  const nextIterations = Array.isArray(history.iterations) ? [...history.iterations] : [];
  for (const iterationEntry of nextIterations) {
    iterationEntry.is_current_champion = false;
  }

  const existing = nextIterations.find((entry) => entry.iteration === iter);
  if (existing) {
    existing.role = 'champion_accepted';
    existing.skill_snapshot = `iteration-${iter}/champion_snapshot`;
    existing.grading_result = 'accepted';
    existing.is_current_champion = true;
  } else {
    nextIterations.push({
      iteration: iter,
      label: `iteration-${iter}`,
      role: 'champion_accepted',
      skill_snapshot: `iteration-${iter}/champion_snapshot`,
      grading_result: 'accepted',
      is_current_champion: true,
    });
  }

  history.current_champion_iteration = iter;
  history.iterations = nextIterations;
  writeFileSync(historyPath, `${JSON.stringify(history, null, 2)}\n`, 'utf8');
}

function upsertArchiveHistory(history, iter, championArchivePath, candidateArchivePath, accept, finalize) {
  if (!championArchivePath) {
    return history;
  }

  const nextHistory = Array.isArray(history) ? [...history] : [];
  const nextEntry = {
    iteration: iter,
    archive_path: `archive/champion-pre-iteration-${iter}`,
    candidate_path: candidateArchivePath
      ? `archive/candidate-iteration-${iter}`
      : null,
    accepted: accept,
    finalized: finalize,
    at: new Date().toISOString(),
  };
  const existingIndex = nextHistory.findIndex((entry) => entry.iteration === iter);
  if (existingIndex >= 0) {
    nextHistory[existingIndex] = {
      ...nextHistory[existingIndex],
      ...nextEntry,
    };
    return nextHistory;
  }

  nextHistory.push(nextEntry);
  return nextHistory;
}

function restoreRejectedCandidateSnapshot({ repoRoot, runRoot, task, iter }) {
  const candidateScopePath = join(runRoot, 'candidates', `iteration-${iter}`, 'candidate_scope.json');
  if (!existsSync(candidateScopePath)) {
    return null;
  }

  const scope = readJson(candidateScopePath);
  const candidateSnapshotRel = scope.candidate_snapshot_path;
  if (!candidateSnapshotRel) {
    return null;
  }

  const candidateSnapshotPath = join(runRoot, candidateSnapshotRel);
  const qaPlanChampion = task.benchmark_profile?.startsWith('qa-plan')
    ? currentQaPlanChampionSnapshot(repoRoot, task)
    : null;
  const sourceSnapshotPath = qaPlanChampion && existsSync(qaPlanChampion)
    ? qaPlanChampion
    : task.champion_snapshot_path && existsSync(join(runRoot, task.champion_snapshot_path))
      ? join(runRoot, task.champion_snapshot_path)
      : join(repoRoot, task.target_skill_path);

  rmSync(candidateSnapshotPath, { recursive: true, force: true });
  copySnapshotDir(sourceSnapshotPath, candidateSnapshotPath);
  scope.changed_files = [];
  writeFileSync(candidateScopePath, `${JSON.stringify(scope, null, 2)}\n`, 'utf8');
  return {
    restored_from: sourceSnapshotPath,
    restored_to: candidateSnapshotPath,
    candidate_snapshot_path: candidateSnapshotRel,
  };
}

function applyAcceptedCandidateToTarget({ repoRoot, runRoot, task, iter }) {
  const candidateScopePath = join(runRoot, 'candidates', `iteration-${iter}`, 'candidate_scope.json');
  if (!existsSync(candidateScopePath)) {
    return [];
  }
  const scope = readJson(candidateScopePath);
  const candidateSnapshotRel = scope.candidate_snapshot_path;
  if (!candidateSnapshotRel) {
    return [];
  }
  const candidateSnapshotPath = join(runRoot, candidateSnapshotRel);
  if (!existsSync(candidateSnapshotPath)) {
    return [];
  }

  const targetRoot = join(repoRoot, task.target_skill_path);
  const changedFiles = Array.isArray(scope.changed_files) && scope.changed_files.length > 0
    ? scope.changed_files
    : diffSnapshotDirs(targetRoot, candidateSnapshotPath);

  for (const relativePath of changedFiles) {
    const sourcePath = join(candidateSnapshotPath, relativePath);
    const destPath = join(targetRoot, relativePath);
    if (existsSync(sourcePath)) {
      mkdirSync(dirname(destPath), { recursive: true });
      writeFileSync(destPath, readFileSync(sourcePath));
    } else if (existsSync(destPath)) {
      rmSync(destPath, { recursive: true, force: true });
    }
  }

  return changedFiles;
}

function promoteCandidateWithGit({
  repoRoot,
  runRoot,
  task,
  iter,
  changedFiles,
  autoPush,
  pushRemote,
  pushBranch,
}) {
  if (!Array.isArray(changedFiles) || changedFiles.length === 0) {
    return null;
  }
  const scopedPaths = changedFiles.map((relativePath) =>
    join(task.target_skill_path, relativePath),
  );
  const statusOutput = runGit(repoRoot, ['status', '--porcelain', '--', ...scopedPaths]);
  if (!statusOutput.trim()) {
    return null;
  }

  runGit(repoRoot, ['add', '--', ...scopedPaths]);
  const commitMessage = `qa-plan-evolution: promote ${task.run_key} iteration ${iter}`;
  runGit(repoRoot, ['commit', '-m', commitMessage, '--only', '--', ...scopedPaths]);
  const commitSha = runGit(repoRoot, ['rev-parse', 'HEAD']);

  const promotion = {
    commit_sha: commitSha,
    commit_message: commitMessage,
    changed_paths: scopedPaths,
    pushed: false,
    push_remote: null,
    push_branch: null,
  };

  if (autoPush) {
    const remote = pushRemote || 'origin';
    const branch = pushBranch || runGit(repoRoot, ['rev-parse', '--abbrev-ref', 'HEAD']);
    runGit(repoRoot, ['push', remote, branch]);
    promotion.pushed = true;
    promotion.push_remote = remote;
    promotion.push_branch = branch;
  }

  writeFileSync(
    join(runRoot, 'context', `git_promotion_${task.run_key}_i${iter}.json`),
    `${JSON.stringify(promotion, null, 2)}\n`,
    'utf8',
  );
  return promotion;
}

export async function main(argv = process.argv.slice(2)) {
  const args = parsePhaseArgs(argv);
  const { runKey, runRoot, repoRoot } = resolveRunContext(args);
  const task = requireTask(runRoot);
  const run = requireRun(runRoot);

  const iter = parseInt(String(args.iteration ?? task.current_iteration ?? 1), 10) || 1;
  const scorePath = join(runRoot, 'candidates', `iteration-${iter}`, 'score.json');
  if (!existsSync(scorePath)) {
    throw new Error(`Missing ${scorePath}; run phase5 first`);
  }

  const scoreData = JSON.parse(readFileSync(scorePath, 'utf8'));
  const benchmarkScorecard = scoreData.outcome?.benchmark_scorecard ?? null;
  if (scoreData.outcome?.accept === true && benchmarkScorecard?.scoring_fidelity === 'synthetic') {
    throw new Error('Cannot promote a challenger from a synthetic benchmark scorecard.');
  }
  const accept = scoreData.outcome?.accept === true;

  const max = task.max_iterations ?? 10;
  const consecutive = run.consecutive_rejections ?? 0;

  const finalizeRequested = Boolean(args.finalize);
  const stopAfterReject = !accept && (consecutive >= 3 || iter >= max);
  const approvalRequired = accept && !finalizeRequested;
  const finalize = finalizeRequested || stopAfterReject;
  const skipGitPromotion = Boolean(args.skip_git_promotion);
  const autoPush = Boolean(args.auto_push);
  const pushRemote = typeof args.push_remote === 'string' ? args.push_remote : null;
  const pushBranch = typeof args.push_branch === 'string' ? args.push_branch : null;

  const nextAction = approvalRequired
    ? 'await_final_approval'
    : finalize
      ? 'finalize'
      : 'iterate_phase2';
  const overall = approvalRequired
    ? 'awaiting_approval'
    : finalize
      ? 'completed'
      : 'in_progress';

  const acceptedIteration = accept ? iter : task.accepted_iteration ?? null;
  const acceptedMutationsPath = join(runRoot, 'context', `accepted_mutations_${runKey}.md`);
  const rejectedMutationsPath = join(runRoot, 'context', `rejected_mutations_${runKey}.md`);

  const mutationBacklogPath = join(runRoot, 'context', `mutation_backlog_${runKey}.json`);
  const selectedMutations = existsSync(mutationBacklogPath)
    ? readJson(mutationBacklogPath).mutations ?? []
    : [];
  const candidateScopePath = join(runRoot, 'candidates', `iteration-${iter}`, 'candidate_scope.json');
  const acceptedGapIds = existsSync(candidateScopePath)
    ? readJson(candidateScopePath).mutation?.source_observation_ids ?? []
    : [];
  const selectedMutation = existsSync(candidateScopePath)
    ? readJson(candidateScopePath).mutation ?? null
    : null;

  if (accept) {
    writeMutationSummary(
      acceptedMutationsPath,
      'Accepted Mutations',
      selectedMutation ? [selectedMutation] : selectedMutations,
    );
  } else {
    writeMutationSummary(
      rejectedMutationsPath,
      'Rejected Mutations',
      selectedMutation ? [selectedMutation] : selectedMutations,
    );
    updateRejectedMutationSignatures(runRoot, runKey, selectedMutation);
  }

  let rejectionRestore = null;
  if (!accept) {
    rejectionRestore = restoreRejectedCandidateSnapshot({
      repoRoot,
      runRoot,
      task,
      iter,
    });
    if (rejectionRestore) {
      writeFileSync(
        join(runRoot, 'context', `rejection_restore_${runKey}_i${iter}.json`),
        `${JSON.stringify({ iteration: iter, ...rejectionRestore }, null, 2)}\n`,
        'utf8',
      );
    }
  }

  let championArchivePath = task.champion_archive_path ?? null;
  let candidateArchivePath = null;
  if (accept) {
    championArchivePath = ensureArchivedChampion(repoRoot, runRoot, task, iter);
    candidateArchivePath = ensureArchivedCandidate(repoRoot, runRoot, task, iter);
  }

  if (accept && finalize) {
    promoteScoreboardChampion(runRoot, runKey, scoreData.outcome?.scores ?? {});
    updateAcceptedGapIds(runRoot, runKey, acceptedGapIds);
  }

  if (accept && finalize && task.benchmark_profile?.startsWith('qa-plan')) {
    updateQaPlanChampionHistory(repoRoot, task, iter);
  }
  let gitPromotion = null;
  if (accept && finalize && !skipGitPromotion) {
    const changedFiles = applyAcceptedCandidateToTarget({
      repoRoot,
      runRoot,
      task,
      iter,
    });
    gitPromotion = promoteCandidateWithGit({
      repoRoot,
      runRoot,
      task,
      iter,
      changedFiles,
      autoPush,
      pushRemote,
      pushBranch,
    });
  }

  touchTask(runRoot, task, {
    accepted_iteration: acceptedIteration,
    current_iteration: approvalRequired || finalize ? iter : iter + 1,
    current_phase: approvalRequired || finalize ? 'phase6' : 'phase2',
    overall_status: overall,
    pending_finalization_iteration: approvalRequired ? iter : null,
    champion_snapshot_path: finalize && candidateArchivePath
      ? `archive/candidate-iteration-${iter}`
      : task.champion_snapshot_path,
    champion_archive_path: championArchivePath
      ? `archive/champion-pre-iteration-${iter}`
      : task.champion_archive_path,
    finalization_approved_at: finalizeRequested ? new Date().toISOString() : task.finalization_approved_at,
  });

  const finalBody = [
    `# Evolution summary (${runKey})`,
    '',
    `- target: ${task.target_skill_path}`,
    `- benchmark_profile: ${task.benchmark_profile}`,
    `- iteration_evaluated: ${iter}`,
    `- accept: ${accept}`,
    `- next_action: ${nextAction}`,
    `- consecutive_rejections: ${consecutive}`,
    '',
    '## Score snapshot',
    '```json',
    JSON.stringify(scoreData.outcome?.scores ?? {}, null, 2),
    '```',
    '',
    '## Next steps',
    approvalRequired
      ? '- Accepted iteration is archived and awaiting explicit final approval. Re-run phase6 with --finalize to complete promotion.'
      : finalize
        ? '- Run is finalized. Optionally notify Feishu; publish to canonical benchmark tree if required.'
        : '- Re-enter phase2 for the next bounded mutation iteration.',
  ].join('\n');

  if (finalize) {
    writeFileSync(join(runRoot, 'evolution_final.md'), `${finalBody}\n`, 'utf8');
  } else {
    writeFileSync(
      join(runRoot, 'context', `phase6_summary_${runKey}_i${iter}.md`),
      `${finalBody}\n`,
      'utf8',
    );
  }

  writeFileSync(
    join(runRoot, 'context', `next_action_${runKey}.json`),
    `${JSON.stringify(
      {
        next_action: nextAction,
        overall_status: overall,
        iteration: iter,
      },
      null,
      2,
    )}\n`,
    'utf8',
  );

  touchRun(runRoot, run, {
    finalized_at: finalize ? new Date().toISOString() : run.finalized_at,
    accepted_iteration: acceptedIteration,
    latest_promotion_commit: gitPromotion?.commit_sha ?? run.latest_promotion_commit ?? null,
    champion_archive_history: upsertArchiveHistory(
      run.champion_archive_history,
      iter,
      championArchivePath,
      candidateArchivePath,
      accept,
      finalize,
    ),
    notification_pending: finalize
      ? {
          skill: 'feishu-notify',
          evolution_final: `runs/${runKey}/evolution_final.md`,
        }
      : run.notification_pending,
  });

  console.log(`phase6 ok: next_action=${nextAction} overall=${overall}`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
