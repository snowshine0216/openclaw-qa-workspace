#!/usr/bin/env node
"use strict";

const path = require("path");
const { buildDeckFromHandoff } = require("./lib/build-pptx-from-handoff");

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
  if (!args.handoff) {
    process.stderr.write(
      "Usage: node build-pptx-from-handoff.js --handoff path/to/pptx-handoff.json\n"
    );
    process.exit(1);
  }

  const result = await buildDeckFromHandoff({
    handoffPath: path.resolve(args.handoff)
  });

  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
}

if (require.main === module) {
  main().catch((error) => {
    process.stderr.write(`[build-pptx-from-handoff] Error: ${error.message}\n`);
    process.exit(1);
  });
}
