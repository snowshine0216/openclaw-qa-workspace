"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");

const planPath = path.resolve(__dirname, "..", "..", "..", "..", "docs", "archive", "ppt-agent", "PPT_AGENT_SKILL_DESIGN.md");

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

test("plan specifies evaluation-unavailable and recoverable evaluation failures", () => {
  const plan = read(planPath);
  assert.match(plan, /evaluation unavailable/);
  assert.match(plan, /recoverable error if one evaluation pass fails/);
});

test("plan defines refinement behavior when thresholds are missed", () => {
  const plan = read(planPath);
  assert.match(plan, /return to manuscript refinement, design-plan refinement, or slide refinement/);
});
