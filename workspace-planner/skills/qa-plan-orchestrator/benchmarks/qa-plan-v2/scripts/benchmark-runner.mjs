#!/usr/bin/env node

import { runBenchmarkRunnerCli } from './benchmark-runner-llm.mjs';

runBenchmarkRunnerCli(process.argv).catch((error) => {
  console.error(`[benchmark-runner.mjs] ${error.message}`);
  process.exitCode = 1;
});
