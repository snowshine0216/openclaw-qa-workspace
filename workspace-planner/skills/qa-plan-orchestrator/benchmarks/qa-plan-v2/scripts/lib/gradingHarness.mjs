import { cp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DEFAULT_EXECUTOR_SCRIPT = join(__dirname, '..', 'benchmark-runner.mjs');
const DEFAULT_GRADER_SCRIPT = join(__dirname, '..', 'benchmark-grader.mjs');

function assertPath(path, description) {
  if (!existsSync(path)) {
    throw new Error(`Missing required ${description}: ${path}`);
  }
}

async function pathExists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

function loadJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function buildFixtureIndex(fixturesDocument) {
  return new Map((fixturesDocument.fixtures || []).map((fixture) => [fixture.fixture_id, fixture]));
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

async function materializeFixtureInputs(runDir, fixtureRefs, benchmarkRoot) {
  const fixtureManifestPath = join(benchmarkRoot, 'fixtures_manifest.json');
  const fixtureRoot = join(runDir, 'inputs', 'fixtures');
  await rm(fixtureRoot, { recursive: true, force: true });
  await mkdir(fixtureRoot, { recursive: true });

  if (!fixtureRefs?.length) {
    return [];
  }
  if (!existsSync(fixtureManifestPath)) {
    throw new Error(`Missing fixtures manifest: ${fixtureManifestPath}`);
  }

  const fixtureIndex = buildFixtureIndex(loadJson(fixtureManifestPath));
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

async function writeJson(path, value) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function buildExecutionRequest(runDefinition, benchmarkRoot) {
  const runDir = runDefinition.runDir;
  const outputDir = join(runDir, 'outputs');
  const requestPath = join(runDir, 'execution_request.json');
  const transcriptPath = join(runDir, 'execution_transcript.log');
  const fixtures = await materializeFixtureInputs(
    runDir,
    runDefinition.caseDefinition.fixture_refs || [],
    benchmarkRoot,
  );

  const request = {
    benchmark_version: 'qa-plan-v2',
    case_id: runDefinition.caseDefinition.case_id,
    eval_id: runDefinition.evalId,
    eval_name: runDefinition.evalMetadata.eval_name,
    feature_id: runDefinition.caseDefinition.feature_id,
    feature_family: runDefinition.caseDefinition.feature_family,
    knowledge_pack_key: runDefinition.caseDefinition.knowledge_pack_key,
    primary_phase: runDefinition.caseDefinition.primary_phase,
    kind: runDefinition.caseDefinition.kind,
    evidence_mode: runDefinition.caseDefinition.evidence_mode,
    blocking: runDefinition.caseDefinition.blocking,
    benchmark_profile: runDefinition.caseDefinition.benchmark_profile,
    fixture_refs: runDefinition.caseDefinition.fixture_refs || [],
    prompt: runDefinition.evalMetadata.prompt,
    expectations: runDefinition.evalMetadata.expectations
      || runDefinition.evalMetadata.assertions
      || [],
    run: {
      configuration_dir: runDefinition.configuration.configurationDir,
      uses_skill_snapshot: true,
      run_number: runDefinition.runNumber,
      run_dir: runDir,
      output_dir: outputDir,
      transcript_path: transcriptPath,
      grading_path: join(runDir, 'grading.json'),
      timing_path: join(runDir, 'timing.json'),
      metrics_path: join(outputDir, 'metrics.json'),
    },
    skill_snapshot_path: runDefinition.configuration.snapshotRoot,
    fixtures,
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
      rejectPromise(new Error(`${stageName} script exited with code ${code}: ${stderr || stdout}`));
    });
  });
  await writeFile(transcriptPath, `${stageHeader}${transcriptBody}`, { encoding: 'utf8', flag: 'a' });
  return Date.now() - startedAt;
}

async function writeTiming(runDir, durationMs, metricsPath) {
  let totalTokens = 0;
  if (await pathExists(metricsPath)) {
    const metrics = JSON.parse(await readFile(metricsPath, 'utf8'));
    totalTokens = Number(metrics.total_tokens || 0);
  }
  await writeJson(join(runDir, 'timing.json'), {
    total_tokens: totalTokens,
    duration_ms: durationMs,
    total_duration_seconds: Number((durationMs / 1000).toFixed(3)),
  });
}

async function resetRunArtifacts(runDefinition) {
  await rm(runDefinition.runDir, { recursive: false, force: false }).catch(() => {});
  await rm(join(runDefinition.runDir, 'grading.json'), { force: true });
  await rm(join(runDefinition.runDir, 'timing.json'), { force: true });
  await rm(join(runDefinition.runDir, 'execution_transcript.log'), { force: true });
  await rm(join(runDefinition.runDir, 'execution_request.json'), { force: true });
  await rm(join(runDefinition.runDir, 'inputs'), { recursive: true, force: true });
  await rm(join(runDefinition.runDir, 'outputs'), { recursive: true, force: true });
  await mkdir(runDefinition.runDir, { recursive: true });
}

async function runHarnessPair({
  runDefinition,
  benchmarkRoot,
  executorScript,
  graderScript,
  transcriptLabel = null,
}) {
  const { request, requestPath, transcriptPath } = await buildExecutionRequest(runDefinition, benchmarkRoot);
  if (transcriptLabel) {
    await writeFile(
      transcriptPath,
      `\n=== HARNESS MODE ===\n${transcriptLabel}\n`,
      { encoding: 'utf8', flag: 'a' },
    );
  }
  const durationMs = await runScriptStage({
    scriptPath: executorScript,
    requestPath,
    transcriptPath,
    stageName: 'executor',
  });
  await writeTiming(runDefinition.runDir, durationMs, request.run.metrics_path);
  await runScriptStage({
    scriptPath: graderScript,
    requestPath,
    transcriptPath,
    stageName: 'grader',
  });
}

export async function executeGradingHarness(runDefinition, options = {}) {
  const { gradingHarness = null, benchmarkRoot = '' } = options;
  if (typeof gradingHarness === 'function') {
    await gradingHarness(runDefinition);
    return;
  }

  const executorScript = process.env.QA_PLAN_BENCHMARK_EXECUTOR_SCRIPT || DEFAULT_EXECUTOR_SCRIPT;
  const graderScript = process.env.QA_PLAN_BENCHMARK_GRADER_SCRIPT || DEFAULT_GRADER_SCRIPT;

  await resetRunArtifacts(runDefinition);
  await runHarnessPair({
    runDefinition,
    benchmarkRoot,
    executorScript,
    graderScript,
    transcriptLabel: 'primary',
  });
}

export async function readRequiredRunArtifacts(runDir) {
  const outputsDir = join(runDir, 'outputs');
  const gradingPath = join(runDir, 'grading.json');
  const timingPath = join(runDir, 'timing.json');

  assertPath(outputsDir, 'outputs directory');
  assertPath(gradingPath, 'grading.json');
  assertPath(timingPath, 'timing.json');

  return {
    grading: JSON.parse(await readFile(gradingPath, 'utf8')),
    timing: JSON.parse(await readFile(timingPath, 'utf8')),
  };
}

export async function hasRequiredRunArtifacts(runDir, options = {}) {
  try {
    if (options.strict === true) {
      assertPath(join(runDir, 'execution_request.json'), 'execution_request.json');
      assertPath(join(runDir, 'execution_transcript.log'), 'execution_transcript.log');
      assertPath(join(runDir, 'outputs', 'result.md'), 'outputs/result.md');
    }
    await readRequiredRunArtifacts(runDir);
    return true;
  } catch {
    return false;
  }
}

export function buildBenchmarkRunFromArtifacts({
  evalId,
  configuration,
  runNumber,
  grading,
  timing,
}) {
  return {
    eval_id: evalId,
    configuration,
    run_number: runNumber,
    result: {
      pass_rate: grading.summary.pass_rate,
      passed: grading.summary.passed,
      failed: grading.summary.failed,
      total: grading.summary.total,
      time_seconds: timing.total_duration_seconds ?? grading.timing?.total_duration_seconds ?? 0,
      tokens: timing.total_tokens ?? 0,
      tool_calls: grading.execution_metrics?.total_tool_calls ?? 0,
      errors: grading.execution_metrics?.errors_encountered ?? 0,
    },
    expectations: grading.expectations ?? [],
    notes: grading.user_notes_summary?.needs_review ?? [],
  };
}
