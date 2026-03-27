"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");

const skillPath = path.resolve(__dirname, "..", "SKILL.md");
const designRolePath = path.resolve(__dirname, "..", "roles", "design.md");
const planPath = path.resolve(__dirname, "..", "..", "..", "..", "docs", "archive", "ppt-agent", "PPT_AGENT_SKILL_DESIGN.md");

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

test("style contract uses #FA6611 and minimal text across plan and execution docs", () => {
  const skill = read(skillPath);
  const designRole = read(designRolePath);
  const plan = read(planPath);
  for (const content of [skill, designRole, plan]) {
    assert.match(content, /#FA6611/);
  }
  assert.match(skill, /minimal text/i);
  assert.match(designRole, /minimal text/i);
});

test("style contract rejects generic deck behavior", () => {
  const plan = read(planPath);
  assert.match(plan, /generic blue palette/);
  assert.match(plan, /analytical visuals that explain the business point/);
});
