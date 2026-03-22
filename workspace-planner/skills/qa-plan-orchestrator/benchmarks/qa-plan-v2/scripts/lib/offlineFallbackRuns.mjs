import { readdir, readFile, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';

/** Matches text written by offline codex fallback in benchmark-runner.mjs. */
export const OFFLINE_FALLBACK_MARKER = 'offline fallback executor';

const CONFIGS = ['with_skill', 'without_skill'];

/**
 * Scan iteration-0 style layout for runs whose execution_notes.md contains the offline marker.
 * @returns {Promise<Set<string>>} absolute run directory paths
 */
export async function collectOfflineFallbackRunDirs(iterationDir) {
  const set = new Set();
  let evalNames = [];
  try {
    evalNames = (await readdir(iterationDir, { withFileTypes: true }))
      .filter((d) => d.isDirectory() && d.name.startsWith('eval-'))
      .map((d) => d.name);
  } catch {
    return set;
  }

  for (const evalName of evalNames) {
    for (const conf of CONFIGS) {
      const confRoot = join(iterationDir, evalName, conf);
      let runDirs = [];
      try {
        runDirs = (await readdir(confRoot, { withFileTypes: true }))
          .filter((r) => r.isDirectory() && r.name.startsWith('run-'))
          .map((r) => r.name);
      } catch {
        continue;
      }
      for (const runName of runDirs) {
        const runDir = join(confRoot, runName);
        const notesPath = join(runDir, 'outputs', 'execution_notes.md');
        try {
          const text = await readFile(notesPath, 'utf8');
          if (text.includes(OFFLINE_FALLBACK_MARKER)) {
            set.add(resolve(runDir));
          }
        } catch {
          // missing or unreadable
        }
      }
    }
  }
  return set;
}

/**
 * Remove executor/grader outputs so benchmark-runner-ide-wait blocks until a fresh result.md exists.
 */
export async function clearRunArtifactsForIdeRerun(runDir) {
  const paths = [
    join(runDir, 'outputs', 'result.md'),
    join(runDir, 'outputs', 'execution_notes.md'),
    join(runDir, 'outputs', 'metrics.json'),
    join(runDir, 'grading.json'),
    join(runDir, 'timing.json'),
    join(runDir, 'execution_transcript.log'),
    join(runDir, 'benchmark_ide_wait_instructions.md'),
    join(runDir, 'local_grader_debug.json'),
  ];
  await Promise.all(paths.map((p) => rm(p, { force: true })));
}
