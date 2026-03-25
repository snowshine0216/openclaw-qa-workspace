#!/usr/bin/env node

import { runBenchmarkGraderCli } from './benchmark-grader-llm.mjs';

runBenchmarkGraderCli(process.argv).catch((error) => {
  console.error(`[benchmark-grader.mjs] ${error.message}`);
  process.exitCode = 1;
});
