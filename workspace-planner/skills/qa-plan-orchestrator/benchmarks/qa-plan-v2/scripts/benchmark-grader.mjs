#!/usr/bin/env node

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cp, readFile, rm, writeFile } from 'node:fs/promises';

import {
  DEFAULT_CODEX_MODEL,
  materializeRequestWorkspace,
  runCodexExec,
  writeRuntimeLogs,
  writeJson,
} from './lib/codexBenchmarkRuntime.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const GRADER_GUIDE = join(process.env.HOME || '', '.agents', 'skills', 'skill-creator', 'agents', 'grader.md');

function parseArgs(argv) {
  const args = argv.slice(2);
  const options = {
    requestPath: '',
    model: DEFAULT_CODEX_MODEL,
  };

  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (value === '--request' && args[index + 1]) {
      options.requestPath = args[index + 1];
      index += 1;
    } else if (value === '--model' && args[index + 1]) {
      options.model = args[index + 1];
      index += 1;
    }
  }

  if (!options.requestPath) {
    throw new Error('Missing required --request <path> argument.');
  }

  return options;
}

function buildPrompt(request) {
  return [
    'You are grading a qa-plan-orchestrator benchmark run.',
    'Read ./grader_guide.md for grading rules.',
    'Read ./benchmark_request.json and all files under ./outputs/.',
    'Evaluate every expectation using the output files.',
    'Return JSON only, matching the provided schema.',
    '',
    `Case: ${request.case_id}`,
    `Configuration: ${request.run.configuration_dir}`,
    'Expectations:',
    ...request.expectations.map((line) => `- ${line}`),
    '',
  ].join('\n');
}

async function writeSchema(path) {
  await writeJson(path, {
    type: 'object',
    additionalProperties: true,
    required: ['expectations', 'summary'],
    properties: {
      expectations: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: true,
          required: ['text', 'passed', 'evidence'],
          properties: {
            text: { type: 'string' },
            passed: { type: 'boolean' },
            evidence: { type: 'string' },
          },
        },
      },
      summary: {
        type: 'object',
        additionalProperties: true,
        required: ['passed', 'failed', 'total', 'pass_rate'],
        properties: {
          passed: { type: 'number' },
          failed: { type: 'number' },
          total: { type: 'number' },
          pass_rate: { type: 'number' },
        },
      },
    },
  });
}

async function main() {
  const options = parseArgs(process.argv);
  const request = JSON.parse(await readFile(options.requestPath, 'utf8'));
  const workspace = await materializeRequestWorkspace({
    request,
    requestPath: options.requestPath,
    workspacePrefix: 'qa-plan-benchmark-grader-',
    includeSkillSnapshot: false,
    extraFiles: [
      {
        source: GRADER_GUIDE,
        target: 'grader_guide.md',
      },
      {
        source: request.run.transcript_path,
        target: 'execution_transcript.log',
      },
    ],
  });

  await rm(workspace.outputsDir, { recursive: true, force: true });
  await cp(request.run.output_dir, workspace.outputsDir, { recursive: true });

  const schemaPath = join(workspace.workspaceDir, 'grading_schema.json');
  const lastMessagePath = join(workspace.workspaceDir, 'codex_grader_last_message.json');
  await writeSchema(schemaPath);
  const prompt = buildPrompt(request);
  const codexResult = await runCodexExec({
    workdir: workspace.workspaceDir,
    prompt,
    outputLastMessagePath: lastMessagePath,
    outputSchemaPath: schemaPath,
    model: options.model,
  });

  const debugDir = join(request.run.run_dir, 'codex_grader_debug');
  await writeRuntimeLogs({
    destinationDir: debugDir,
    prompt,
    stdout: codexResult.stdout,
    stderr: codexResult.stderr,
    lastMessagePath,
    extraFiles: [
      { source: schemaPath, target: 'grading_schema.json' },
    ],
  });

  if (codexResult.code !== 0) {
    throw new Error(`codex exec failed with exit code ${codexResult.code}`);
  }

  const grading = JSON.parse(await readFile(lastMessagePath, 'utf8'));
  await writeJson(request.run.grading_path, grading);
  await writeFile(join(request.run.output_dir, 'grading_summary.md'), JSON.stringify(grading.summary, null, 2), 'utf8');

  console.log(`GRADER_COMPLETE: ${request.run.grading_path}`);
}

main().catch((error) => {
  const scriptName = join(__dirname, 'benchmark-grader.mjs');
  console.error(`[${scriptName}] ${error.message}`);
  process.exitCode = 1;
});
