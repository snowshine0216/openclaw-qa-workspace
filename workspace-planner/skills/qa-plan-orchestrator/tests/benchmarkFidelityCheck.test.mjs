import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CHECK = join(__dirname, '../benchmarks/qa-plan-v2/scripts/check_benchmark_fidelity.mjs');

function runNode(args, env) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn('node', args, {
      env: { ...process.env, ...env },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (c) => {
      stdout += c.toString();
    });
    child.stderr.on('data', (c) => {
      stderr += c.toString();
    });
    child.on('error', rejectPromise);
    child.on('exit', (code) => {
      resolvePromise({ code: code ?? 1, stdout, stderr });
    });
  });
}

test('check_benchmark_fidelity exits 1 when placeholder notes exist and BENCHMARK_REQUIRE_EXECUTED=1', async () => {
  const root = await mkdtemp(join(tmpdir(), 'fidelity-'));
  try {
    const benchRoot = join(root, 'benchmarks', 'qa-plan-v2');
    const runDir = join(benchRoot, 'iteration-0', 'eval-1', 'without_skill', 'run-1', 'outputs');
    await mkdir(runDir, { recursive: true });
    await writeFile(
      join(runDir, 'execution_notes.md'),
      'offline fallback executor: generated deterministic placeholder output for local grading.\n',
      'utf8',
    );

    const result = await runNode([CHECK, '--benchmark-root', benchRoot], {
      BENCHMARK_REQUIRE_EXECUTED: '1',
    });

    assert.equal(result.code, 1, result.stderr + result.stdout);
    assert.match(result.stderr + result.stdout, /low-fidelity|offline_placeholder|Found/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('check_benchmark_fidelity exits 0 when clean and BENCHMARK_REQUIRE_EXECUTED=1', async () => {
  const root = await mkdtemp(join(tmpdir(), 'fidelity-clean-'));
  try {
    const benchRoot = join(root, 'benchmarks', 'qa-plan-v2');
    const outDir = join(benchRoot, 'iteration-0', 'eval-1', 'without_skill', 'run-1', 'outputs');
    await mkdir(outDir, { recursive: true });
    await writeFile(join(outDir, 'result.md'), '# ok\n', 'utf8');

    const result = await runNode([CHECK, '--benchmark-root', benchRoot], {
      BENCHMARK_REQUIRE_EXECUTED: '1',
    });

    assert.equal(result.code, 0, result.stderr + result.stdout);
    assert.match(result.stdout + result.stderr, /OK/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
