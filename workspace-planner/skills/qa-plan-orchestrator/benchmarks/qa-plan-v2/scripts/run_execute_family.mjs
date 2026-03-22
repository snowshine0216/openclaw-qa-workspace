#!/usr/bin/env node

import { join } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { executeFamilyRuns, parseExecuteFamilyArgs } from './lib/executeFamilyV2.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const options = parseExecuteFamilyArgs(process.argv);
  const result = await executeFamilyRuns(options);

  console.log(`Executed family ${result.familyDefinition.feature_family}`);
  console.log(`Total runs: ${result.totalRuns}`);
  console.log(`Executed runs: ${result.executedRuns}`);
  console.log(`Skipped runs: ${result.skippedRuns}`);
  console.log(`Failures: ${result.failures.length}`);
  console.log(`Family manifest written to ${result.familyManifestPath}`);
  console.log(`Family checklist written to ${result.familyChecklistPath}`);

  if (result.failures.length > 0) {
    for (const failure of result.failures) {
      console.error(`${failure.run_dir}: ${failure.message}`);
    }
    process.exitCode = 1;
  }
}

main().catch((error) => {
  const scriptName = join(__dirname, 'run_execute_family.mjs');
  console.error(`[${scriptName}] ${error.message}`);
  process.exitCode = 1;
});
