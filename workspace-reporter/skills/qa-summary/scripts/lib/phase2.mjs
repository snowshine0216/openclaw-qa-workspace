#!/usr/bin/env node
/**
 * Phase 2: Defect-analysis coordination - inspect, reuse, or spawn.
 */

import { readFile, writeFile, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { buildDefectSummary } from './buildDefectSummary.mjs';
import { resolveQaSummaryRepoRoot } from './resolveQaSummaryRepoRoot.mjs';

async function safeReadJson(path) {
  try {
    const raw = await readFile(path, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function resolveRunRoot(path, runDir) {
  if (!path || path.startsWith('/')) return path;
  const repoRoot = resolveQaSummaryRepoRoot(runDir);
  return join(repoRoot, path);
}

function resolveDefaultDefectsRunRoot(runDir) {
  return join(
    resolveQaSummaryRepoRoot(runDir),
    'workspace-reporter',
    'skills',
    'defects-analysis',
    'runs'
  );
}

async function classifyDefectContext(defectsRunDir, defectFinalPath, featureKey) {
  const { existsSync } = await import('node:fs');
  if (existsSync(defectFinalPath)) {
    return {
      kind: 'defect_final_exists',
      defects_run_dir: defectsRunDir,
      defect_report_path: defectFinalPath,
      userChoice: null,
      updated_at: new Date().toISOString(),
    };
  }
  const draftPath = join(defectsRunDir, `${featureKey}_REPORT_DRAFT.md`);
  if (existsSync(draftPath)) {
    return {
      kind: 'defect_draft_exists',
      defects_run_dir: defectsRunDir,
      defect_report_path: draftPath,
      userChoice: null,
      updated_at: new Date().toISOString(),
    };
  }
  const contextDir = join(defectsRunDir, 'context');
  const jiraRawPath = join(contextDir, 'jira_raw.json');
  if (existsSync(jiraRawPath)) {
    const jiraRaw = await safeReadJson(jiraRawPath);
    if (Array.isArray(jiraRaw?.issues) && jiraRaw.issues.length === 0) {
      return {
        kind: 'no_defects_found',
        defects_run_dir: defectsRunDir,
        defect_report_path: null,
        userChoice: null,
        updated_at: new Date().toISOString(),
      };
    }
  }
  return {
    kind: 'no_defect_artifacts',
    defects_run_dir: defectsRunDir,
    defect_report_path: null,
    userChoice: null,
    updated_at: new Date().toISOString(),
  };
}

async function hasDefectArtifacts(defectsRunDir, featureKey) {
  const { existsSync } = await import('node:fs');
  return [
    join(defectsRunDir, `${featureKey}_REPORT_FINAL.md`),
    join(defectsRunDir, `${featureKey}_REPORT_DRAFT.md`),
    join(defectsRunDir, 'context', 'jira_raw.json'),
  ].some((path) => existsSync(path));
}

async function resolveDefectSummaryRunDir({
  configuredRunDir,
  defaultRunDir,
  featureKey,
  defectContextState = {},
}) {
  if (defectContextState.userChoice === 'reuse_existing_defects') return configuredRunDir;
  if (defectContextState.userChoice === 'regenerate_defects') {
    return (await hasDefectArtifacts(defaultRunDir, featureKey)) ? defaultRunDir : configuredRunDir;
  }
  if (configuredRunDir === defaultRunDir) return configuredRunDir;
  if (await hasDefectArtifacts(configuredRunDir, featureKey)) return configuredRunDir;
  if (await hasDefectArtifacts(defaultRunDir, featureKey)) return defaultRunDir;
  return configuredRunDir;
}

async function removeArtifact(path) {
  try {
    await unlink(path);
  } catch {
    /* ignore missing artifacts */
  }
}

async function writeDefectContextArtifacts(runDir, summary) {
  const defectSummaryPath = join(runDir, 'context', 'defect_summary.json');
  const noDefectsPath = join(runDir, 'context', 'no_defects.json');
  if (summary.totalDefects === 0) {
    await removeArtifact(defectSummaryPath);
    await writeFile(noDefectsPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
    return;
  }

  await removeArtifact(noDefectsPath);
  await writeFile(defectSummaryPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
}

export async function runPhase2(featureKey, runDir, mode = 'main') {
  const taskPath = join(runDir, 'task.json');
  let task = {};
  try {
    const raw = await readFile(taskPath, 'utf8');
    task = JSON.parse(raw);
  } catch {
    console.error('BLOCKED: Missing task.json.');
    return 2;
  }

  const defectsRunRoot = resolveRunRoot(task.defects_run_root, runDir);
  if (!defectsRunRoot) {
    console.error('BLOCKED: Missing config-resolved defects_run_root in task.json');
    return 2;
  }

  const defectsRunDir = join(defectsRunRoot, featureKey);
  const defaultDefectsRunDir = join(resolveDefaultDefectsRunRoot(runDir), featureKey);
  const defectFinal = join(defectsRunDir, `${featureKey}_REPORT_FINAL.md`);

  if (mode !== '--post') {
    const state = await classifyDefectContext(defectsRunDir, defectFinal, featureKey);
    await writeFile(
      join(runDir, 'context', 'defect_context_state.json'),
      `${JSON.stringify(state, null, 2)}\n`,
      'utf8'
    );

    const needsReuseChoice =
      (state.kind === 'defect_final_exists' || state.kind === 'defect_draft_exists') &&
      !state.userChoice;
    if (needsReuseChoice) {
      const userChoice = process.env.DEFECT_REUSE_CHOICE;
      if (userChoice === 'reuse_existing_defects' || userChoice === 'regenerate_defects') {
        state.userChoice = userChoice;
        await writeFile(
          join(runDir, 'context', 'defect_context_state.json'),
          `${JSON.stringify(state, null, 2)}\n`,
          'utf8'
        );
      } else {
        const hint =
          state.kind === 'defect_draft_exists'
            ? 'Draft exists. Set DEFECT_REUSE_CHOICE=reuse_existing_defects (draft-based) or DEFECT_REUSE_CHOICE=regenerate_defects and re-run.'
            : 'Set DEFECT_REUSE_CHOICE=reuse_existing_defects or DEFECT_REUSE_CHOICE=regenerate_defects and re-run.';
        console.error(`BLOCKED: ${hint}`);
        return 2;
      }
    }

    if (state.kind === 'no_defect_artifacts' || state.userChoice === 'regenerate_defects') {
      const manifest = {
        version: 1,
        phase: 'phase2',
        requests: [
          {
            kind: 'defects-analysis',
            feature_key: featureKey,
            openclaw: {
              args: ['--skill', 'defects-analysis', '--feature-key', featureKey],
            },
          },
        ],
      };
      const manifestPath = join(runDir, 'phase2_spawn_manifest.json');
      await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
      console.log(`SPAWN_MANIFEST: ${manifestPath}`);
      return 0;
    }
  }

  const state = await (async () => {
    try {
      const raw = await readFile(join(runDir, 'context', 'defect_context_state.json'), 'utf8');
      return JSON.parse(raw);
    } catch {
      return {};
    }
  })();
  const reportPathOverride =
    state.kind === 'defect_draft_exists' && state.userChoice === 'reuse_existing_defects'
      ? state.defect_report_path
      : null;
  const defectSummaryRunDir = await resolveDefectSummaryRunDir({
    configuredRunDir: defectsRunDir,
    defaultRunDir: defaultDefectsRunDir,
    featureKey,
    defectContextState: state,
  });

  let summary;
  try {
    summary = await buildDefectSummary({
      featureKey,
      defectsRunDir: defectSummaryRunDir,
      plannerLookupPath: join(runDir, 'context', 'planner_artifact_lookup.json'),
      plannerSeedPath: join(runDir, 'context', 'planner_summary_seed.md'),
      reportPathOverride,
    });
  } catch (error) {
    console.error(`BLOCKED: ${error.message}`);
    return 2;
  }

  await writeDefectContextArtifacts(runDir, summary);

  const ts = new Date().toISOString();
  task.current_phase = 'phase2';
  task.updated_at = ts;
  await writeFile(taskPath, `${JSON.stringify(task, null, 2)}\n`, 'utf8');

  const runPath = join(runDir, 'run.json');
  let run = {};
  try {
    const raw = await readFile(runPath, 'utf8');
    run = JSON.parse(raw);
  } catch {
    /* ignore */
  }
  run.defect_context_resolved_at = ts;
  run.subtask_timestamps = run.subtask_timestamps || {};
  run.subtask_timestamps.defects_analysis = ts;
  run.updated_at = ts;
  await writeFile(runPath, `${JSON.stringify(run, null, 2)}\n`, 'utf8');

  console.log('PHASE2_DONE');
  return 0;
}

async function main() {
  const featureKey = process.argv[2];
  const runDir = process.argv[3];
  const mode = process.argv[4] || 'main';
  if (!featureKey || !runDir) {
    console.error('Usage: phase2.mjs <feature-key> <run-dir> [--post]');
    process.exit(1);
  }
  const code = await runPhase2(featureKey, runDir, mode);
  process.exit(code);
}

if (process.argv[1]?.includes('phase2.mjs')) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
