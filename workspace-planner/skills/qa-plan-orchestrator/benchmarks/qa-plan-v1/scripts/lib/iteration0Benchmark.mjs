import { access, cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import {
  benchmarkDefinitionRoot,
  benchmarkRuntimeRoot,
} from './benchmarkSkillPaths.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const BENCHMARK_FAMILY = 'qa-plan-v1';
export const DEFAULT_BENCHMARK_DEFINITION_ROOT = benchmarkDefinitionRoot(BENCHMARK_FAMILY);
export const DEFAULT_BENCHMARK_ROOT = benchmarkRuntimeRoot(BENCHMARK_FAMILY);
export const DEFAULT_SKILL_ROOT = resolve(__dirname, '../../../..');
export const DEFAULT_ITERATION = 0;
export const DEFAULT_RUNS_PER_CONFIGURATION = 3;
export const BASELINE_CONFIGS = ['with_skill', 'without_skill'];
const EXCLUDED_SNAPSHOT_ENTRIES = new Set(['benchmarks', 'node_modules']);

async function pathExists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Fail-fast guard: if benchmark runtime state is found inside the source tree,
 * the operator must run the migration script before proceeding.
 */
export async function assertNoLegacyRuntimeState() {
  const legacyIterationDir = join(DEFAULT_BENCHMARK_DEFINITION_ROOT, 'iteration-0');
  if (await pathExists(legacyIterationDir)) {
    throw new Error(
      'benchmark runtime state found in source tree — run the migration script first\n' +
      `  Legacy path: ${legacyIterationDir}\n` +
      `  Expected runtime root: ${DEFAULT_BENCHMARK_ROOT}`,
    );
  }
}

/**
 * Fail-fast guard: if both legacy and canonical benchmark runtime roots exist,
 * the operator must resolve the conflict manually.
 */
export async function assertNoDualRuntimeRoots(runtimeRoot = DEFAULT_BENCHMARK_ROOT) {
  const legacyIterationDir = join(DEFAULT_BENCHMARK_DEFINITION_ROOT, 'iteration-0');
  const canonicalIterationDir = join(runtimeRoot, 'iteration-0');
  const legacyExists = await pathExists(legacyIterationDir);
  const canonicalExists = await pathExists(canonicalIterationDir);
  if (legacyExists && canonicalExists) {
    throw new Error(
      'Both legacy and canonical benchmark runtime roots exist — operator must resolve conflict\n' +
      `  Legacy: ${legacyIterationDir}\n` +
      `  Canonical: ${canonicalIterationDir}`,
    );
  }
}

export function shouldIncludeSnapshotEntry(entryName) {
  return !EXCLUDED_SNAPSHOT_ENTRIES.has(entryName);
}

export function getIterationDir(benchmarkRoot = DEFAULT_BENCHMARK_ROOT, iteration = DEFAULT_ITERATION) {
  return join(benchmarkRoot, `iteration-${iteration}`);
}

export function buildComparisonMetadata({
  benchmarkVersion,
  iteration,
  configurationDir,
  evalId,
  runNumber,
  snapshotPath,
  executorModel = null,
  reasoningEffort = null,
}) {
  const semanticRole = configurationDir === 'with_skill'
    ? 'champion_seed'
    : 'no_skill_baseline';

  return {
    semantic_role: semanticRole,
    comparison_mode: 'baseline_value',
    configuration_dir: configurationDir,
    skill_name: 'qa-plan-orchestrator',
    skill_snapshot_path: configurationDir === 'with_skill' ? snapshotPath : null,
    skill_snapshot_label: configurationDir === 'with_skill' ? 'champion-v0' : 'no-skill-baseline',
    model_name: executorModel,
    reasoning_effort: reasoningEffort,
    knowledge_pack_version: null,
    benchmark_version: benchmarkVersion,
    eval_id: evalId,
    run_number: runNumber,
  };
}

export async function loadJson(jsonPath) {
  return JSON.parse(await readFile(jsonPath, 'utf8'));
}

export async function writeJson(jsonPath, payload) {
  await mkdir(dirname(jsonPath), { recursive: true });
  await writeFile(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

export async function seedChampionSnapshot(sourceSkillRoot, snapshotDir) {
  await rm(snapshotDir, { recursive: true, force: true });
  await mkdir(snapshotDir, { recursive: true });

  const entries = await readdir(sourceSkillRoot, { withFileTypes: true });
  for (const entry of entries) {
    if (!shouldIncludeSnapshotEntry(entry.name)) {
      continue;
    }
    const fromPath = join(sourceSkillRoot, entry.name);
    const toPath = join(snapshotDir, entry.name);
    await cp(fromPath, toPath, { recursive: true });
  }
}

export async function seedIterationWorkspace({
  skillRoot = DEFAULT_SKILL_ROOT,
  benchmarkRoot = DEFAULT_BENCHMARK_ROOT,
  iteration = DEFAULT_ITERATION,
  runsPerConfiguration = DEFAULT_RUNS_PER_CONFIGURATION,
  executorModel = null,
  reasoningEffort = null,
}) {
  await assertNoLegacyRuntimeState();
  await assertNoDualRuntimeRoots(benchmarkRoot);

  const iterationDir = getIterationDir(benchmarkRoot, iteration);
  const snapshotDir = join(iterationDir, 'champion_snapshot');
  const evalsPath = join(skillRoot, 'evals', 'evals.json');
  const benchmarkContextPath = join(iterationDir, 'benchmark_context.json');
  const manifestPath = join(DEFAULT_BENCHMARK_DEFINITION_ROOT, 'benchmark_manifest.json');
  const evalCatalog = await loadJson(evalsPath);
  const benchmarkManifest = await loadJson(manifestPath);

  await seedChampionSnapshot(skillRoot, snapshotDir);

  const benchmarkContext = await loadJson(benchmarkContextPath);
  benchmarkContext.status = 'prepared_pending_execution';
  benchmarkContext.executor_model = executorModel;
  benchmarkContext.reasoning_effort = reasoningEffort;
  benchmarkContext.prepared_at = new Date().toISOString();
  benchmarkContext.runs_per_configuration = runsPerConfiguration;
  await writeJson(benchmarkContextPath, benchmarkContext);

  const manifest = {
    skill_name: benchmarkManifest.skill_name,
    skill_path: skillRoot,
    workspace: benchmarkRoot,
    iteration,
    iteration_dir: iterationDir,
    tasks: [],
  };

  for (const evaluation of evalCatalog.evals) {
    const evalDir = join(iterationDir, `eval-${evaluation.id}`);
    const metadata = {
      eval_id: evaluation.id,
      eval_name: `eval-${evaluation.id}`,
      prompt: evaluation.prompt,
      assertions: evaluation.expectations || [],
      eval_group: 'core_regression',
    };

    await writeJson(join(evalDir, 'eval_metadata.json'), metadata);

    for (const configurationDir of BASELINE_CONFIGS) {
      for (let runNumber = 1; runNumber <= runsPerConfiguration; runNumber += 1) {
        const runDir = join(evalDir, configurationDir, `run-${runNumber}`);
        await mkdir(join(runDir, 'outputs'), { recursive: true });
        await writeJson(join(runDir, 'eval_metadata.json'), metadata);
        await writeJson(
          join(runDir, 'comparison_metadata.json'),
          buildComparisonMetadata({
            benchmarkVersion: benchmarkManifest.benchmark_version,
            iteration,
            configurationDir,
            evalId: evaluation.id,
            runNumber,
            snapshotPath: relative(benchmarkRoot, snapshotDir),
            executorModel,
            reasoningEffort,
          }),
        );
      }
    }

    manifest.tasks.push({
      eval_id: evaluation.id,
      eval_name: `eval-${evaluation.id}`,
      prompt: evaluation.prompt,
      expectations: evaluation.expectations || [],
      with_skill: {
        output_dir: join(evalDir, 'with_skill', 'run-1', 'outputs'),
        run_dir: join(evalDir, 'with_skill', 'run-1'),
      },
      without_skill: {
        output_dir: join(evalDir, 'without_skill', 'run-1', 'outputs'),
        run_dir: join(evalDir, 'without_skill', 'run-1'),
      },
    });
  }

  await writeJson(join(iterationDir, 'spawn_manifest.json'), manifest);

  return {
    iterationDir,
    snapshotDir,
    spawnManifestPath: join(iterationDir, 'spawn_manifest.json'),
    evalCount: evalCatalog.evals.length,
  };
}

export async function collectGradingStatus(iterationDir) {
  const evalDirs = (await readdir(iterationDir, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('eval-'))
    .map((entry) => join(iterationDir, entry.name));

  let expectedRuns = 0;
  let gradedRuns = 0;

  for (const evalDir of evalDirs) {
    for (const configurationDir of BASELINE_CONFIGS) {
      const configRoot = join(evalDir, configurationDir);
      let runEntries = [];
      try {
        runEntries = (await readdir(configRoot, { withFileTypes: true }))
          .filter((entry) => entry.isDirectory() && entry.name.startsWith('run-'));
      } catch {
        continue;
      }

      for (const runEntry of runEntries) {
        expectedRuns += 1;
        const gradingPath = join(configRoot, runEntry.name, 'grading.json');
        try {
          await access(gradingPath, constants.F_OK);
          gradedRuns += 1;
        } catch {
          // Missing grading is expected before execution completes.
        }
      }
    }
  }

  return {
    expectedRuns,
    gradedRuns,
    missingRuns: Math.max(expectedRuns - gradedRuns, 0),
    ready: expectedRuns > 0 && expectedRuns === gradedRuns,
  };
}

export function buildSyntheticRunResult({
  configurationDir,
  runNumber,
  assertions,
}) {
  const isPrimary = configurationDir === 'with_skill';
  const expectations = assertions.map((assertion, assertionIndex) => {
    const passed = isPrimary
      ? true
      : ((assertionIndex + runNumber) % 3 !== 0);

    return {
      text: assertion,
      passed,
      evidence: passed
        ? `Synthetic seed validation evidence for ${configurationDir} run ${runNumber}`
        : `Synthetic seed validation miss for ${configurationDir} run ${runNumber}`,
    };
  });

  const passedCount = expectations.filter((expectation) => expectation.passed).length;
  const failedCount = expectations.length - passedCount;

  return {
    expectations,
    summary: {
      passed: passedCount,
      failed: failedCount,
      total: expectations.length,
      pass_rate: expectations.length === 0 ? 1 : Number((passedCount / expectations.length).toFixed(4)),
    },
    execution_metrics: {
      tool_calls: {
        Read: isPrimary ? 12 + runNumber : 6 + runNumber,
        Write: isPrimary ? 4 : 2,
        Bash: isPrimary ? 5 : 3,
      },
      total_tool_calls: isPrimary ? 21 + runNumber : 11 + runNumber,
      total_steps: isPrimary ? 7 : 4,
      errors_encountered: 0,
      output_chars: isPrimary ? 14000 + runNumber * 200 : 7000 + runNumber * 150,
      transcript_chars: isPrimary ? 4000 + runNumber * 100 : 2000 + runNumber * 80,
    },
    timing: {
      total_duration_seconds: isPrimary ? 180 + runNumber * 7 : 95 + runNumber * 5,
    },
    user_notes_summary: {
      uncertainties: [],
      needs_review: [],
      workarounds: [
        `Synthetic seed validation run for ${configurationDir}`,
      ],
    },
  };
}

export async function seedSyntheticGrading(iterationDir) {
  const evalDirs = (await readdir(iterationDir, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('eval-'))
    .map((entry) => join(iterationDir, entry.name));

  let writtenRuns = 0;

  for (const evalDir of evalDirs) {
    const evalMetadata = await loadJson(join(evalDir, 'eval_metadata.json'));
    const assertions = evalMetadata.assertions || [];

    for (const configurationDir of BASELINE_CONFIGS) {
      const configRoot = join(evalDir, configurationDir);
      const runEntries = (await readdir(configRoot, { withFileTypes: true }))
        .filter((entry) => entry.isDirectory() && entry.name.startsWith('run-'));

      for (const runEntry of runEntries) {
        const runNumber = Number(runEntry.name.replace('run-', ''));
        const runDir = join(configRoot, runEntry.name);
        const grading = buildSyntheticRunResult({
          configurationDir,
          runNumber,
          assertions,
        });

        await writeJson(join(runDir, 'grading.json'), grading);
        await writeJson(join(runDir, 'timing.json'), {
          total_tokens: configurationDir === 'with_skill' ? 42000 + runNumber * 500 : 18000 + runNumber * 400,
          duration_ms: Math.round(grading.timing.total_duration_seconds * 1000),
          total_duration_seconds: grading.timing.total_duration_seconds,
        });
        await writeFile(
          join(runDir, 'outputs', 'result.md'),
          `# Synthetic Seed Validation Output\n\n- eval: ${evalMetadata.eval_id}\n- config: ${configurationDir}\n- run: ${runNumber}\n`,
          'utf8',
        );
        writtenRuns += 1;
      }
    }
  }

  return { writtenRuns };
}

export async function runBenchmarkAggregation({
  skillRoot = DEFAULT_SKILL_ROOT,
  iterationDir,
  skillCreatorRoot = join(homedir(), '.agents', 'skills', 'skill-creator'),
}) {
  const aggregateScript = join(skillCreatorRoot, 'scripts', 'aggregate_benchmark.py');

  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn('python3', [
      aggregateScript,
      iterationDir,
      '--skill-name',
      'qa-plan-orchestrator',
      '--skill-path',
      skillRoot,
    ], {
      stdio: 'inherit',
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolvePromise({
          benchmarkJsonPath: join(iterationDir, 'benchmark.json'),
          benchmarkMarkdownPath: join(iterationDir, 'benchmark.md'),
        });
        return;
      }
      rejectPromise(new Error(`aggregate_benchmark.py exited with code ${code}`));
    });
    child.on('error', rejectPromise);
  });
}
