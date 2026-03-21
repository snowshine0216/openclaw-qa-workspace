import test from 'node:test';
import assert from 'node:assert/strict';
import { chmod, mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';

const RUNNER = join(
  process.cwd(),
  'workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/benchmark-runner.mjs',
);
const GRADER = join(
  process.cwd(),
  'workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/benchmark-grader.mjs',
);

async function writeJson(path, value) {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function runNode(command, args, env) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, {
      cwd: process.cwd(),
      env: {
        ...process.env,
        ...env,
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
    child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
    child.on('error', rejectPromise);
    child.on('exit', (code) => {
      resolvePromise({ code: code ?? 1, stdout, stderr });
    });
  });
}

async function createFakeCodexBinary(rootDir) {
  const fakeCodex = join(rootDir, 'fake-codex.mjs');
  await writeFile(fakeCodex, `#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const args = process.argv.slice(2);
const workdir = args[args.indexOf('-C') + 1];
const lastMessagePath = args[args.indexOf('--output-last-message') + 1];
const schemaIndex = args.indexOf('--output-schema');
const outputSchemaPath = schemaIndex === -1 ? '' : args[schemaIndex + 1];
const prompt = await new Promise((resolve) => {
  let text = '';
  process.stdin.on('data', (chunk) => { text += chunk.toString(); });
  process.stdin.on('end', () => resolve(text));
});
await mkdir(workdir, { recursive: true });
await writeFile(join(workdir, 'fake-codex-prompt.txt'), prompt, 'utf8');

if (outputSchemaPath) {
  const grading = {
    expectations: [
      { text: 'first expectation', passed: true, evidence: 'fake evidence 1' },
      { text: 'second expectation', passed: false, evidence: 'fake evidence 2' }
    ],
    summary: { passed: 1, failed: 1, total: 2, pass_rate: 0.5 }
  };
  await writeFile(lastMessagePath, JSON.stringify(grading), 'utf8');
  process.stdout.write(JSON.stringify({ type: 'turn.completed', usage: { total_tokens: 55 } }) + '\\n');
  process.exit(0);
}

await mkdir(join(workdir, 'outputs'), { recursive: true });
await writeFile(join(workdir, 'outputs', 'result.md'), '# fake runner output\\n', 'utf8');
await writeFile(join(workdir, 'outputs', 'execution_notes.md'), 'used copied fixtures\\n', 'utf8');
await writeFile(lastMessagePath, 'runner final message\\n', 'utf8');
process.stdout.write(JSON.stringify({ type: 'turn.completed', usage: { total_tokens: 37 } }) + '\\n');
`, 'utf8');
  await chmod(fakeCodex, 0o755);
  return fakeCodex;
}

test('benchmark-runner invokes codex exec and copies outputs plus metrics', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'benchmark-runner-'));

  try {
    const fakeCodex = await createFakeCodexBinary(tmp);
    const runDir = join(tmp, 'run');
    const outputDir = join(runDir, 'outputs');
    const inputFixtureDir = join(runDir, 'inputs', 'fixtures', 'BLIND-1', 'materials');
    const snapshotDir = join(tmp, 'champion_snapshot');
    const requestPath = join(runDir, 'execution_request.json');

    await mkdir(inputFixtureDir, { recursive: true });
    await mkdir(snapshotDir, { recursive: true });
    await writeFile(join(inputFixtureDir, 'fixture.json'), '{"ok":true}\n', 'utf8');
    await writeFile(join(snapshotDir, 'SKILL.md'), '# skill snapshot\n', 'utf8');

    await writeJson(requestPath, {
      case_id: 'CASE-1',
      feature_id: 'BCIN-976',
      feature_family: 'report-editor',
      primary_phase: 'phase0',
      evidence_mode: 'blind_pre_defect',
      prompt: 'Run the benchmark case.',
      expectations: ['first expectation', 'second expectation'],
      skill_snapshot_path: snapshotDir,
      run: {
        configuration_dir: 'with_skill',
        run_dir: runDir,
        output_dir: outputDir,
      },
    });

    const result = await runNode('node', [RUNNER, '--request', requestPath], {
      CODEX_BIN: fakeCodex,
    });

    assert.equal(result.code, 0, result.stderr);
    assert.equal(existsSync(join(outputDir, 'result.md')), true);
    assert.equal(existsSync(join(outputDir, 'execution_notes.md')), true);

    const metrics = JSON.parse(await readFile(join(outputDir, 'metrics.json'), 'utf8'));
    assert.equal(metrics.total_tokens, 37);

    const debugPrompt = await readFile(join(runDir, 'codex_runner_debug', 'codex_prompt.txt'), 'utf8');
    assert.match(debugPrompt, /Use the qa-plan-orchestrator skill snapshot under \.\/skill_snapshot/);
    assert.match(debugPrompt, /Use only copied benchmark evidence under \.\/inputs\/fixtures\//);
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
});

test('benchmark-grader invokes codex exec with schema and writes grading.json', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'benchmark-grader-'));

  try {
    const fakeCodex = await createFakeCodexBinary(tmp);
    const runDir = join(tmp, 'run');
    const outputDir = join(runDir, 'outputs');
    const inputFixtureDir = join(runDir, 'inputs', 'fixtures', 'BLIND-1', 'materials');
    const transcriptPath = join(runDir, 'execution_transcript.log');
    const requestPath = join(runDir, 'execution_request.json');

    await mkdir(inputFixtureDir, { recursive: true });
    await mkdir(outputDir, { recursive: true });
    await writeFile(join(inputFixtureDir, 'fixture.json'), '{"ok":true}\n', 'utf8');
    await writeFile(join(outputDir, 'result.md'), '# evaluated output\n', 'utf8');
    await writeFile(transcriptPath, 'runner transcript\n', 'utf8');

    await writeJson(requestPath, {
      case_id: 'CASE-1',
      expectations: ['first expectation', 'second expectation'],
      run: {
        configuration_dir: 'without_skill',
        run_dir: runDir,
        output_dir: outputDir,
        grading_path: join(runDir, 'grading.json'),
        transcript_path: transcriptPath,
      },
    });

    const result = await runNode('node', [GRADER, '--request', requestPath], {
      CODEX_BIN: fakeCodex,
    });

    assert.equal(result.code, 0, result.stderr);

    const grading = JSON.parse(await readFile(join(runDir, 'grading.json'), 'utf8'));
    assert.equal(grading.summary.pass_rate, 0.5);
    assert.equal(grading.expectations.length, 2);

    const debugPrompt = await readFile(join(runDir, 'codex_grader_debug', 'codex_prompt.txt'), 'utf8');
    assert.match(debugPrompt, /Read \.\/grader_guide\.md/);
    assert.match(debugPrompt, /Return JSON only, matching the provided schema/);

    assert.equal(existsSync(join(runDir, 'codex_grader_debug', 'grading_schema.json')), true);
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
});
