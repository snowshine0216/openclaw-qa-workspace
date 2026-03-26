#!/usr/bin/env node
"use strict";

const path = require("path");

const { runPhase2A } = require("./lib/edit-workflow");
const { getRuntimePaths } = require("./lib/runtime-paths");

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index++) {
    const token = argv[index];
    if (!token.startsWith("--")) {
      continue;
    }
    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    index += 1;
  }
  return args;
}

function parseList(value) {
  if (!value) {
    return [];
  }
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => path.resolve(item));
}

async function resolveRunRoot(rootDirArg) {
  const runtimePaths = rootDirArg ? null : await getRuntimePaths();
  return path.resolve(rootDirArg || runtimePaths.defaultRunsDir);
}

async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (!args.deck) {
    throw new Error("deck is required");
  }
  if (!args["change-request"]) {
    throw new Error("change request is required");
  }

  const result = await runPhase2A({
    rootDir: await resolveRunRoot(args["root-dir"]),
    deck: path.resolve(args.deck),
    changeRequest: args["change-request"],
    attachments: parseList(args.attachments),
    restyle: args.restyle || "none"
  });

  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
}

if (require.main === module) {
  main().catch((error) => {
    process.stderr.write(`[edit-run] ${error.message}\n`);
    process.exit(1);
  });
}

module.exports = {
  main,
  resolveRunRoot
};
