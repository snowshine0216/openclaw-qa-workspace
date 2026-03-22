#!/usr/bin/env node

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile, writeFile } from 'node:fs/promises';

import { buildLocalBenchmarkGrading, buildLocalGradingCorpus } from './lib/localBenchmarkGrader.mjs';
import { writeJson } from './lib/codexBenchmarkRuntime.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function parseArgs(argv) {
  const args = argv.slice(2);
  const options = {
    requestPath: '',
  };

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

async function main() {
  const options = parseArgs(process.argv);
  const request = JSON.parse(await readFile(options.requestPath, 'utf8'));
  const corpus = await buildLocalGradingCorpus(request.run.output_dir);
  const grading = buildLocalBenchmarkGrading(request, corpus);

  await writeJson(request.run.grading_path, grading);
  await writeFile(join(request.run.output_dir, 'grading_summary.md'), JSON.stringify(grading.summary, null, 2), 'utf8');
  await writeJson(join(request.run.run_dir, 'local_grader_debug.json'), {
    request_path: options.requestPath,
    output_files: corpus.files.map((file) => file.name),
    summary: grading.summary,
  });

  console.log(`LOCAL_GRADER_COMPLETE: ${request.run.grading_path}`);
}

main().catch((error) => {
  const scriptName = join(__dirname, 'benchmark-grader-local.mjs');
  console.error(`[${scriptName}] ${error.message}`);
  process.exitCode = 1;
});
