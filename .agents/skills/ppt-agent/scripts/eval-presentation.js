#!/usr/bin/env node
"use strict";

const path = require("path");

const { compareDecks } = require("./lib/eval-presentation");

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
  if (!args.before || !args.after || !args.plan) {
    throw new Error("Usage: node eval-presentation.js --before path/to/renders/before --after path/to/renders/after --plan path/to/update_plan.json [--handoff path/to/edit_handoff.json]");
  }

  const result = compareDecks({
    beforeDir: path.resolve(args.before),
    afterDir: path.resolve(args.after),
    updatePlanPath: path.resolve(args.plan),
    handoffPath: args.handoff ? path.resolve(args.handoff) : undefined
  });
  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`[eval-presentation] Error: ${error.message}\n`);
    process.exit(1);
  }
}

module.exports = {
  main
};
