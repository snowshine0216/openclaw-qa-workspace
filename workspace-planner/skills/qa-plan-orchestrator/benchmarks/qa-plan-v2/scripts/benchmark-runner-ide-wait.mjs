#!/usr/bin/env node

/**
 * Executor for qa-plan-v2 that does not invoke Codex. It prints operator instructions,
 * then blocks until outputs/result.md exists under the run output directory (IDE/TUI/manual).
 *
 * Environment:
 * - BENCHMARK_IDE_POLL_MS — poll interval in ms (default: 1000)
 * - BENCHMARK_IDE_WAIT_TIMEOUT_MS — max wait in ms; 0 or unset = no timeout
 */

import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function parseArgs(argv) {
  const args = argv.slice(2);
  const options = { requestPath: '' };

  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (value === '--request' && args[index + 1]) {
      options.requestPath = args[index + 1];
      index += 1;
    }
  }

  if (!options.requestPath) {
    throw new Error('Missing required --request <path> argument.');
  }

  return options;
}

function sleep(ms) {
  return new Promise((resolvePromise) => {
    setTimeout(resolvePromise, ms);
  });
}

async function pathExists(path) {
  try {
    await access(path, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function parseTimeoutMs() {
  const raw = process.env.BENCHMARK_IDE_WAIT_TIMEOUT_MS;
  if (raw === undefined || raw === '') {
    return 0;
  }
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function parsePollMs() {
  const raw = process.env.BENCHMARK_IDE_POLL_MS;
  if (raw === undefined || raw === '') {
    return 1000;
  }
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : 1000;
}

function buildOperatorInstructions(request, resultPath, requestPath) {
  const lines = [
    '=== qa-plan-v2 IDE / manual executor (benchmark-runner-ide-wait) ===',
    '',
    `Case: ${request.case_id} | eval: ${request.eval_id} | ${request.run.configuration_dir} run ${request.run.run_number}`,
    `Run directory: ${request.run.run_dir}`,
    `Read request JSON: ${requestPath}`,
    `Write main deliverable to: ${resultPath}`,
    `Also create: ${join(request.run.output_dir, 'execution_notes.md')} (evidence, files produced, blockers).`,
    '',
    'Fixtures and inputs:',
    `- ${join(request.run.run_dir, 'inputs', 'fixtures')}`,
    '',
  ];

  if (request.run.configuration_dir === 'with_skill' && request.skill_snapshot_path) {
    lines.push('With-skill: use the skill snapshot at:', `  ${request.skill_snapshot_path}`, '');
  } else {
    lines.push('Without-skill: do not use qa-plan-orchestrator skill files.', '');
  }

  lines.push(
    'Prompt (summary):',
    request.prompt.slice(0, 2000) + (request.prompt.length > 2000 ? '\n... (truncated)' : ''),
    '',
    'Expectations:',
    ...request.expectations.map((line) => `- ${line}`),
    '',
    'When finished, ensure result.md exists at the path above. This process will exit successfully.',
    '',
  );

  return `${lines.join('\n')}\n`;
}

async function main() {
  const options = parseArgs(process.argv);
  const requestPath = options.requestPath;
  const request = JSON.parse(await readFile(requestPath, 'utf8'));

  const outputDir = request.run.output_dir;
  const resultPath = join(outputDir, 'result.md');

  await mkdir(outputDir, { recursive: true });

  const instructions = buildOperatorInstructions(request, resultPath, requestPath);
  process.stdout.write(instructions);

  const instructionDump = join(request.run.run_dir, 'benchmark_ide_wait_instructions.md');
  await writeFile(instructionDump, instructions, 'utf8');

  const pollMs = parsePollMs();
  const timeoutMs = parseTimeoutMs();
  const startedAt = Date.now();

  while (!(await pathExists(resultPath))) {
    if (timeoutMs > 0 && Date.now() - startedAt > timeoutMs) {
      throw new Error(
        `Timed out after ${timeoutMs}ms waiting for ${resultPath}. Set BENCHMARK_IDE_WAIT_TIMEOUT_MS or create the file.`,
      );
    }
    await sleep(pollMs);
  }

  const metricsPath = request.run.metrics_path || join(outputDir, 'metrics.json');
  if (!(await pathExists(metricsPath))) {
    const durationMs = Date.now() - startedAt;
    await writeFile(
      metricsPath,
      `${JSON.stringify(
        {
          total_tokens: 0,
          model: null,
          duration_ms: durationMs,
          executor: 'benchmark-runner-ide-wait',
        },
        null,
        2,
      )}\n`,
      'utf8',
    );
  }

  console.log(`RUNNER_IDE_WAIT_COMPLETE: ${outputDir}`);
}

main().catch((error) => {
  const scriptName = join(__dirname, 'benchmark-runner-ide-wait.mjs');
  console.error(`[${scriptName}] ${error.message}`);
  process.exitCode = 1;
});
