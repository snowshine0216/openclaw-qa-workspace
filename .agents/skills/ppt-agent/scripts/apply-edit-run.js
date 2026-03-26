#!/usr/bin/env node
"use strict";

const path = require("path");

const { applyEditRun } = require("./lib/edit-handoff");

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
    throw new Error("Usage: node apply-edit-run.js --run-root path/to/run-root [--update-plan path/to/update_plan.json]");
  }

  const result = applyEditRun(
    path.resolve(args["run-root"]),
    args["update-plan"] ? path.resolve(args["update-plan"]) : undefined
  );
  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`[apply-edit-run] Error: ${error.message}\n`);
    process.exit(1);
  }
}

module.exports = {
  main
};
