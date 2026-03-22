#!/usr/bin/env node

import { join } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseFamilyArgs, writeFamilyArtifacts } from './lib/familyRunnerV2.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const options = parseFamilyArgs(process.argv);
  const written = await writeFamilyArtifacts({
    benchmarkRoot: options.benchmarkRoot,
    iteration: options.iteration,
    familyName: options.familyName,
  });

  console.log(`Prepared family ${written.familyDefinition.feature_family} at ${written.familyDir}`);
  console.log(`Family manifest written to ${written.familyManifestPath}`);
  console.log(`Family checklist written to ${written.familyChecklistPath}`);
  console.log(`Tasks: ${written.taskCount}`);
  console.log(`Runs: ${written.runCount}`);
  console.log(`Completed runs: ${written.completedRunCount}`);
  console.log(`Pending runs: ${written.runCount - written.completedRunCount}`);
}

main().catch((error) => {
  const scriptName = join(__dirname, 'run_family.mjs');
  console.error(`[${scriptName}] ${error.message}`);
  process.exitCode = 1;
});
