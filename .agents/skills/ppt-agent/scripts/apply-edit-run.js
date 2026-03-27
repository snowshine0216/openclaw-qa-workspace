#!/usr/bin/env node
"use strict";

const path = require("path");
const fs = require("fs");

const { applyEditRun } = require("./lib/edit-handoff");
const { executeStructuredRebuilds } = require("./lib/build-pptx-from-handoff");

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

async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (!args["run-root"]) {
    throw new Error("Usage: node apply-edit-run.js --run-root path/to/run-root [--update-plan path/to/update_plan.json]");
  }

  const runRoot = path.resolve(args["run-root"]);
  const result = applyEditRun(
    runRoot,
    args["update-plan"] ? path.resolve(args["update-plan"]) : undefined
  );

  const hasPendingRebuilds = (result.jobs || []).some(
    (job) => job.action === "structured_rebuild" && job.status === "planned"
  );
  if (hasPendingRebuilds) {
    const updatedJobs = await executeStructuredRebuilds({ runRoot, jobs: result.jobs });
    result.jobs = updatedJobs;
    const handoffPath = path.join(runRoot, "artifacts", "edit_handoff.json");
    if (fs.existsSync(handoffPath)) {
      const handoff = JSON.parse(fs.readFileSync(handoffPath, "utf8"));
      handoff.jobs = updatedJobs;
      fs.writeFileSync(handoffPath, JSON.stringify(handoff, null, 2));
    }
  }

  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
}

if (require.main === module) {
  main().catch((error) => {
    process.stderr.write(`[apply-edit-run] Error: ${error.message}\n`);
    process.exit(1);
  });
}

module.exports = {
  main
};
