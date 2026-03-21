#!/usr/bin/env node

import { join } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { executeBatchRuns, parseExecuteBatchArgs } from './lib/executeBatchV2.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const options = parseExecuteBatchArgs(process.argv);
  const result = await executeBatchRuns(options);

  console.log(`Executed batch ${result.batchDefinition.batch_number}`);
  console.log(`Total runs: ${result.totalRuns}`);
  console.log(`Executed runs: ${result.executedRuns}`);
  console.log(`Skipped runs: ${result.skippedRuns}`);
  console.log(`Failures: ${result.failures.length}`);
  console.log(`Batch manifest written to ${result.batchManifestPath}`);
  console.log(`Batch checklist written to ${result.batchChecklistPath}`);

  if (result.failures.length > 0) {
    for (const failure of result.failures) {
      console.error(`${failure.run_dir}: ${failure.message}`);
    }
    process.exitCode = 1;
  }
}

main().catch((error) => {
  const scriptName = join(__dirname, 'run_execute_batch.mjs');
  console.error(`[${scriptName}] ${error.message}`);
  process.exitCode = 1;
});
