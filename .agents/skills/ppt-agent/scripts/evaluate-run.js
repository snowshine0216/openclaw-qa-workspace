#!/usr/bin/env node
"use strict";

const path = require("path");
const { evaluateRun } = require("./lib/evaluate-run");

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      continue;
    }
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    i++;
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args["run-root"]) {
    process.stderr.write(
      "Usage: node evaluate-run.js --run-root path/to/run-root\n"
    );
    process.exit(1);
  }

  const result = evaluateRun({
    runRoot: path.resolve(args["run-root"])
  });

  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
  if (!result.summary || result.summary.status !== "pass") {
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((error) => {
    process.stderr.write(`[evaluate-run] Error: ${error.message}\n`);
    process.exit(1);
  });
}
