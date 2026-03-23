import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const IDE_RUNNER = join(__dirname, '../benchmarks/qa-plan-v2/scripts/benchmark-runner-ide-wait.mjs');

function sleep(ms) {
  return new Promise((resolvePromise) => {
    setTimeout(resolvePromise, ms);
  });
}

async function runNode(args, env) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn('node', args, {
      cwd: process.cwd(),
      env: {
        ...process.env,
        ...env,
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    child.on('error', rejectPromise);
    child.on('exit', (code) => {
      resolvePromise({ code: code ?? 1, stdout, stderr });
    });
  });
}

test('benchmark-runner-ide-wait exits 0 after result.md appears', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'ide-wait-'));

  try {
    const runDir = join(tmp, 'run');
    const outputDir = join(runDir, 'outputs');
    const requestPath = join(runDir, 'execution_request.json');

    await mkdir(join(runDir, 'inputs', 'fixtures'), { recursive: true });
    await writeFile(
      requestPath,
      `${JSON.stringify(
        {
          case_id: 'IDE-1',
          eval_id: 'eval-ide',
          feature_id: 'FEAT-1',
          feature_family: 'report-editor',
          primary_phase: 'phase0',
          evidence_mode: 'blind_pre_defect',
          prompt: 'Manual benchmark prompt.',
          expectations: ['expect one'],
          run: {
            configuration_dir: 'without_skill',
            run_number: 1,
            run_dir: runDir,
            output_dir: outputDir,
            metrics_path: join(outputDir, 'metrics.json'),
          },
          skill_snapshot_path: null,
        },
        null,
        2,
      )}\n`,
      'utf8',
    );

    const resultPath = join(outputDir, 'result.md');
    const runPromise = runNode([IDE_RUNNER, '--request', requestPath], {
      BENCHMARK_IDE_POLL_MS: '20',
      BENCHMARK_IDE_WAIT_TIMEOUT_MS: '8000',
    });

    await sleep(80);
    await mkdir(outputDir, { recursive: true });
    await writeFile(resultPath, '# benchmark result\n', 'utf8');

    const result = await runPromise;
    assert.equal(result.code, 0, result.stderr);
    assert.match(result.stdout, /IDE \/ manual executor/);
    assert.equal(existsSync(join(runDir, 'benchmark_ide_wait_instructions.md')), true);

    const metrics = JSON.parse(await readFile(join(outputDir, 'metrics.json'), 'utf8'));
    assert.equal(metrics.executor, 'benchmark-runner-ide-wait');
    assert.equal(metrics.total_tokens, 0);
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
});

test('benchmark-runner-ide-wait times out when result.md never appears', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'ide-wait-timeout-'));

  try {
    const runDir = join(tmp, 'run');
    const outputDir = join(runDir, 'outputs');
    const requestPath = join(runDir, 'execution_request.json');

    await mkdir(runDir, { recursive: true });
    await writeFile(
      requestPath,
      `${JSON.stringify(
        {
          case_id: 'IDE-2',
          eval_id: 'eval-ide',
          feature_id: 'FEAT-1',
          feature_family: 'report-editor',
          primary_phase: 'phase0',
          evidence_mode: 'blind_pre_defect',
          prompt: 'x',
          expectations: [],
          run: {
            configuration_dir: 'without_skill',
            run_number: 1,
            run_dir: runDir,
            output_dir: outputDir,
            metrics_path: join(outputDir, 'metrics.json'),
          },
          skill_snapshot_path: null,
        },
        null,
        2,
      )}\n`,
      'utf8',
    );

    const result = await runNode([IDE_RUNNER, '--request', requestPath], {
      BENCHMARK_IDE_POLL_MS: '30',
      BENCHMARK_IDE_WAIT_TIMEOUT_MS: '120',
    });

    assert.equal(result.code, 1);
    assert.match(result.stderr, /Timed out/);
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
});
