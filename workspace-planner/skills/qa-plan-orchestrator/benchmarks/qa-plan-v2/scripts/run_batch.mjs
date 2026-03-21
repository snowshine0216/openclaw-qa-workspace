#!/usr/bin/env node

import { join } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseBatchArgs, writeBatchArtifacts } from './lib/batchRunnerV2.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const options = parseBatchArgs(process.argv);
  const written = await writeBatchArtifacts({
    benchmarkRoot: options.benchmarkRoot,
    iteration: options.iteration,
    batchNumber: options.batchNumber,
  });

  console.log(`Prepared batch ${written.batchDefinition.batch_number} at ${written.batchDir}`);
  console.log(`Batch manifest written to ${written.batchManifestPath}`);
  console.log(`Batch checklist written to ${written.batchChecklistPath}`);
  console.log(`Tasks: ${written.taskCount}`);
  console.log(`Runs: ${written.runCount}`);
  console.log(`Completed runs: ${written.completedRunCount}`);
  console.log(`Pending runs: ${written.runCount - written.completedRunCount}`);
}

main().catch((error) => {
  const scriptName = join(__dirname, 'run_batch.mjs');
  console.error(`[${scriptName}] ${error.message}`);
  process.exitCode = 1;
});
