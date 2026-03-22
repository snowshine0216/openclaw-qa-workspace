import { cp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { basename, dirname, extname, join, resolve } from 'node:path';

import { loadJson, writeJson } from '../../../qa-plan-v1/scripts/lib/iteration0Benchmark.mjs';
import { DEFAULT_BENCHMARK_ROOT, DEFAULT_ITERATION, getIterationDir } from './benchmarkV2.mjs';
import { resolveIterationPath } from './selectionArtifactsV2.mjs';

function buildFixtureIndex(fixturesDocument) {
  return new Map((fixturesDocument.fixtures || []).map((fixture) => [fixture.fixture_id, fixture]));
}

function configurationRuns(task) {
  return [
    ...task.with_skill_runs.map((run) => ({ ...run, configuration_dir: 'with_skill' })),
    ...task.without_skill_runs.map((run) => ({ ...run, configuration_dir: 'without_skill' })),
  ];
}

function normalizeRunEntry(iterationDir, runEntry) {
  return {
    ...runEntry,
    run_dir: resolveIterationPath(iterationDir, runEntry.run_dir),
    output_dir: resolveIterationPath(iterationDir, runEntry.output_dir),
  };
}

async function pathExists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function resolveInputPath(benchmarkRoot, inputPath) {
  if (!inputPath) return '';
  if (inputPath.startsWith('/')) {
    return inputPath;
  }

  let current = resolve(benchmarkRoot);
  while (true) {
    const candidate = resolve(current, inputPath);
    if (await pathExists(candidate)) {
      return candidate;
    }
    const parent = dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }

  return resolve(process.cwd(), inputPath);
}

async function copyInto(sourcePath, destinationPath) {
  const sourceStats = await stat(sourcePath);
  if (sourceStats.isDirectory()) {
    await cp(sourcePath, destinationPath, { recursive: true });
    return;
  }
  await mkdir(destinationPath, { recursive: true });
  await cp(sourcePath, join(destinationPath, basename(sourcePath)));
}

async function materializeFixtureInputs(runDir, fixtureRefs, fixtureIndex, benchmarkRoot) {
  const fixtureRoot = join(runDir, 'inputs', 'fixtures');
  await rm(fixtureRoot, { recursive: true, force: true });
  await mkdir(fixtureRoot, { recursive: true });

  const resolvedFixtures = [];
  for (const fixtureRef of fixtureRefs) {
    const fixture = fixtureIndex.get(fixtureRef);
    if (!fixture) {
      throw new Error(`Missing fixture definition for ${fixtureRef}`);
    }

    const fixtureDir = join(fixtureRoot, fixture.fixture_id);
    await mkdir(fixtureDir, { recursive: true });

    let localFixturePath = null;
    if (fixture.path) {
      const sourcePath = await resolveInputPath(benchmarkRoot, fixture.path);
      localFixturePath = join(fixtureDir, 'source');
      await copyInto(sourcePath, localFixturePath);
    }

    const materials = [];
    for (const material of fixture.materials || []) {
      let localMaterialPath = null;
      if (material.snapshot_path) {
        const sourcePath = await resolveInputPath(benchmarkRoot, material.snapshot_path);
        const materialDir = join(fixtureDir, 'materials');
        await mkdir(materialDir, { recursive: true });
        await cp(sourcePath, join(materialDir, basename(sourcePath)));
        localMaterialPath = join(materialDir, basename(sourcePath));
      }
      materials.push({
        ...material,
        local_path: localMaterialPath,
      });
    }

    resolvedFixtures.push({
      ...fixture,
      local_path: localFixturePath,
      materials,
    });
  }

  return resolvedFixtures;
}

async function resolveSkillSnapshotPath(benchmarkRoot, iterationDir, runDir, configurationDir) {
  if (configurationDir !== 'with_skill') {
    return null;
  }
  const comparisonMetadataPath = join(runDir, 'comparison_metadata.json');
  if (await pathExists(comparisonMetadataPath)) {
    const comparisonMetadata = await loadJson(comparisonMetadataPath);
    const snapshotPath = comparisonMetadata.skill_snapshot_path;
    if (snapshotPath) {
      return resolve(benchmarkRoot, snapshotPath);
    }
  }
  return join(iterationDir, 'champion_snapshot');
}

async function buildExecutionRequest({
  benchmarkRoot,
  iterationDir,
  task,
  runEntry,
  fixtureIndex,
}) {
  const runDir = runEntry.run_dir;
  const resolvedFixtures = await materializeFixtureInputs(runDir, task.fixture_refs || [], fixtureIndex, benchmarkRoot);
  const skillSnapshotPath = await resolveSkillSnapshotPath(benchmarkRoot, iterationDir, runDir, runEntry.configuration_dir);
  const transcriptPath = join(runDir, 'execution_transcript.log');
  const requestPath = join(runDir, 'execution_request.json');

  const request = {
    benchmark_version: 'qa-plan-v2',
    iteration_dir: iterationDir,
    case_id: task.case_id,
    eval_id: task.eval_id,
    eval_name: task.eval_name,
    feature_id: task.feature_id,
    feature_family: task.feature_family,
    knowledge_pack_key: task.knowledge_pack_key,
    primary_phase: task.primary_phase,
    kind: task.kind,
    evidence_mode: task.evidence_mode,
    blocking: task.blocking,
    benchmark_profile: task.benchmark_profile,
    fixture_refs: task.fixture_refs || [],
    blind_fixture_id: task.blind_fixture_id || null,
    blind_policy: task.blind_policy || null,
    prompt: task.prompt,
    expectations: task.expectations || [],
    run: {
      configuration_dir: runEntry.configuration_dir,
      run_number: runEntry.run_number,
      run_dir: runEntry.run_dir,
      output_dir: runEntry.output_dir,
      transcript_path: transcriptPath,
      grading_path: join(runDir, 'grading.json'),
      timing_path: join(runDir, 'timing.json'),
      metrics_path: join(runEntry.output_dir, 'metrics.json'),
    },
    skill_snapshot_path: skillSnapshotPath,
    fixtures: resolvedFixtures,
  };

  await writeJson(requestPath, request);
  return { request, requestPath, transcriptPath };
}

function commandForScript(scriptPath) {
  const extension = extname(scriptPath);
  if (extension === '.mjs' || extension === '.js') {
    return { command: 'node', args: [scriptPath] };
  }
  if (extension === '.sh') {
    return { command: 'bash', args: [scriptPath] };
  }
  return { command: scriptPath, args: [] };
}

async function runScriptStage({ scriptPath, requestPath, transcriptPath, stageName }) {
  const { command, args } = commandForScript(scriptPath);
  const stageHeader = `\n=== ${stageName.toUpperCase()} ===\n`;
  const startedAt = Date.now();
  const transcriptBody = await new Promise((resolvePromise, rejectPromise) => {
    let stdout = '';
    let stderr = '';
    const child = spawn(command, [...args, '--request', requestPath], {
      cwd: process.cwd(),
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', rejectPromise);
    child.on('exit', (code) => {
      if (code === 0) {
        resolvePromise(`${stdout}${stderr}`);
        return;
      }
      rejectPromise(new Error(`${stageName} script exited with code ${code}`));
    });
  });
  await writeFile(transcriptPath, `${stageHeader}${transcriptBody}`, { encoding: 'utf8', flag: 'a' });
  return Date.now() - startedAt;
}

async function writeTiming(runDir, durationMs, metricsPath) {
  let totalTokens = 0;
  if (await pathExists(metricsPath)) {
    const metrics = await loadJson(metricsPath);
    totalTokens = Number(metrics.total_tokens || 0);
  }
  await writeJson(join(runDir, 'timing.json'), {
    total_tokens: totalTokens,
    duration_ms: durationMs,
    total_duration_seconds: Number((durationMs / 1000).toFixed(3)),
  });
}

async function validateRunArtifacts(runEntry) {
  const runDir = runEntry.run_dir;
  const outputExists = await pathExists(runEntry.output_dir);
  const gradingExists = await pathExists(join(runDir, 'grading.json'));
  const timingExists = await pathExists(join(runDir, 'timing.json'));

  if (!outputExists) {
    throw new Error(`Executor did not create outputs directory for ${runDir}`);
  }
  if (!gradingExists) {
    throw new Error(`Missing grading.json for ${runDir}`);
  }
  if (!timingExists) {
    throw new Error(`Missing timing.json for ${runDir}`);
  }
}

async function runEntryCompleted(runEntry) {
  return (
    await pathExists(runEntry.output_dir)
    && await pathExists(join(runEntry.run_dir, 'grading.json'))
    && await pathExists(join(runEntry.run_dir, 'timing.json'))
  );
}

async function runEntryHasReusableExecutorOutput(runEntry) {
  return (
    await pathExists(runEntry.output_dir)
    && await pathExists(join(runEntry.run_dir, 'timing.json'))
    && await pathExists(join(runEntry.run_dir, 'execution_transcript.log'))
  );
}

function countTaskRuns(tasks) {
  return tasks.reduce((sum, task) => sum + task.with_skill_runs.length + task.without_skill_runs.length, 0);
}

export async function executeSelectedRuns({
  benchmarkRoot = DEFAULT_BENCHMARK_ROOT,
  iteration = DEFAULT_ITERATION,
  selectedTasks,
  executorScript,
  graderScript = '',
  rerunCompleted = false,
  failFast = true,
  reuseExecutorOutput = false,
  refreshArtifacts,
  runFilter = null,
}) {
  const iterationDir = getIterationDir(benchmarkRoot, iteration);
  const fixturesDocument = await loadJson(join(benchmarkRoot, 'fixtures_manifest.json'));
  const fixtureIndex = buildFixtureIndex(fixturesDocument);

  let executedRuns = 0;
  let skippedRuns = 0;
  const failures = [];

  for (const task of selectedTasks) {
    for (const rawRunEntry of configurationRuns(task)) {
      const runEntry = normalizeRunEntry(iterationDir, rawRunEntry);
      if (runFilter) {
        const allow = await runFilter(runEntry);
        if (!allow) {
          skippedRuns += 1;
          continue;
        }
      }
      if (!rerunCompleted && await runEntryCompleted(runEntry)) {
        skippedRuns += 1;
        continue;
      }

      try {
        const { request, requestPath, transcriptPath } = await buildExecutionRequest({
          benchmarkRoot,
          iterationDir,
          task,
          runEntry,
          fixtureIndex,
        });

        const reuseExistingExecutor = reuseExecutorOutput && await runEntryHasReusableExecutorOutput(runEntry);
        if (!reuseExistingExecutor) {
          const durationMs = await runScriptStage({
            scriptPath: executorScript,
            requestPath,
            transcriptPath,
            stageName: 'executor',
          });
          await writeTiming(runEntry.run_dir, durationMs, request.run.metrics_path);
        }

        if (graderScript) {
          await runScriptStage({
            scriptPath: graderScript,
            requestPath,
            transcriptPath,
            stageName: 'grader',
          });
        }

        await validateRunArtifacts(runEntry);
        executedRuns += 1;
      } catch (error) {
        failures.push({
          run_dir: runEntry.run_dir,
          message: error.message,
        });
        if (failFast) {
          throw error;
        }
      }
    }
  }

  const refreshed = await refreshArtifacts();

  return {
    totalRuns: countTaskRuns(selectedTasks),
    executedRuns,
    skippedRuns,
    failures,
    ...refreshed,
  };
}
