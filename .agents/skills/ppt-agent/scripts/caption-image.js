#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { normalizeRawCaptions } = require("./lib/caption-image");

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

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (!args["raw-json"] || !args.output) {
    process.stderr.write(
      "Usage: node caption-image.js --raw-json path/to/raw.json --output path/to/slide_analysis.json\n"
    );
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(path.resolve(args["raw-json"]), "utf8"));
  const normalized = normalizeRawCaptions(raw);
  fs.mkdirSync(path.dirname(path.resolve(args.output)), { recursive: true });
  fs.writeFileSync(path.resolve(args.output), JSON.stringify(normalized, null, 2));
  process.stdout.write(`${path.resolve(args.output)}\n`);
}

module.exports = {
  normalizeRawCaptions,
  main
};

if (require.main === module) {
  main();
}
