import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parseArgs } from '../args.mjs';
import { getRepoRoot, getRunRoot } from '../paths.mjs';
import {
  ensureRunDirs,
  loadTask,
  loadRun,
  writeJson,
  isoNow,
} from '../workflowState.mjs';

export function parsePhaseArgs(argv) {
  return parseArgs(argv);
}

export function resolveRunContext(args) {
  const runKey = args.run_key;
  if (!runKey) {
    throw new Error('--run-key is required');
  }
  const repoRoot = args.repo_root ? resolve(args.repo_root) : getRepoRoot();
  const defaultRepoRoot = getRepoRoot();
  const canonicalRunRoot = getRunRoot(runKey);
  const requestedRunRoot = args.run_root ? resolve(args.run_root) : null;
  let runRoot = canonicalRunRoot;

  if (requestedRunRoot) {
    if (repoRoot !== resolve(defaultRepoRoot)) {
      runRoot = requestedRunRoot;
      return { runKey, repoRoot, runRoot, canonicalRunRoot: requestedRunRoot, requestedRunRoot };
    }
    const pointerPath = join(requestedRunRoot, '.canonical-run-root');
    if (existsSync(join(canonicalRunRoot, 'task.json'))) {
      runRoot = canonicalRunRoot;
    } else if (existsSync(join(requestedRunRoot, 'task.json'))) {
      runRoot = requestedRunRoot;
    } else if (existsSync(pointerPath)) {
      runRoot = resolve(readFileSync(pointerPath, 'utf8').trim());
    } else {
      runRoot = requestedRunRoot;
    }
  }

  return { runKey, repoRoot, runRoot, canonicalRunRoot, requestedRunRoot };
}

export function requireTask(runRoot) {
  const task = loadTask(runRoot);
  if (!task) throw new Error(`Missing task.json under ${runRoot}`);
  return task;
}

export function requireRun(runRoot) {
  const run = loadRun(runRoot);
  if (!run) throw new Error(`Missing run.json under ${runRoot}`);
  return run;
}

export function touchTask(runRoot, task, patch) {
  const next = {
    ...task,
    ...patch,
    updated_at: isoNow(),
  };
  writeJson(`${runRoot}/task.json`, next);
  return next;
}

export function touchRun(runRoot, run, patch) {
  const next = {
    ...run,
    ...patch,
    updated_at: isoNow(),
  };
  writeJson(`${runRoot}/run.json`, next);
  return next;
}

export { ensureRunDirs, loadTask, loadRun };
