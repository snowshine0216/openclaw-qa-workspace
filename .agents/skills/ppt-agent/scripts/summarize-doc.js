#!/usr/bin/env node
"use strict";

const path = require("path");
const { summarizeDoc } = require("./lib/document-summary");

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

async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (!args.input || !args.output) {
    process.stderr.write(
      "Usage: node summarize-doc.js --input path/to/doc --output path/to/summary.md\n"
    );
    process.exit(1);
  }

  const result = await summarizeDoc(path.resolve(args.input), path.resolve(args.output));
  process.stdout.write(`${result.outputPath}\n`);
}

module.exports = {
  summarizeDoc,
  main
};

if (require.main === module) {
  main().catch((error) => {
    process.stderr.write(`[summarize-doc] ${error.message}\n`);
    process.exit(1);
  });
}
