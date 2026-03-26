#!/usr/bin/env node
"use strict";

const path = require("path");

const { finalizeEditRun } = require("./lib/finalize-edit-run");

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

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (!args["run-root"]) {
    throw new Error("Usage: node finalize-edit-run.js --run-root path/to/run-root");
  }

  const result = finalizeEditRun({ runRoot: path.resolve(args["run-root"]) });
  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
  if (result.status !== "complete") {
    process.exit(1);
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`[finalize-edit-run] Error: ${error.message}\n`);
    process.exit(1);
  }
}

module.exports = {
  main
};
