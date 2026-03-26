"use strict";

const fs = require("fs");
const path = require("path");

function ensureParent(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function writeStageStatus(runRoot, payload) {
  const filePath = path.join(runRoot, "logs", "stage-status.json");
  ensureParent(filePath);
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));
  return filePath;
}

function appendEvent(runRoot, event) {
  const filePath = path.join(runRoot, "logs", "events.jsonl");
  ensureParent(filePath);
  const record = {
    at: new Date().toISOString(),
    ...event
  };
  fs.appendFileSync(filePath, `${JSON.stringify(record)}\n`);
  return filePath;
}

function writeOperatorSummary(runRoot, payload) {
  const filePath = path.join(runRoot, "artifacts", "operator-summary.json");
  ensureParent(filePath);
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));
  return filePath;
}

function writeRunSummary(runRoot, markdown) {
  const filePath = path.join(runRoot, "artifacts", "run_summary.md");
  ensureParent(filePath);
  fs.writeFileSync(filePath, String(markdown || "").trimEnd() + "\n");
  return filePath;
}

module.exports = {
  appendEvent,
  writeOperatorSummary,
  writeRunSummary,
  writeStageStatus
};
