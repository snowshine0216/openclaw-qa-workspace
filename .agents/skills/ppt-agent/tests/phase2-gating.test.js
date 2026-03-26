"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const packageJsonPath = path.resolve(__dirname, "..", "package.json");

test("package release gate keeps npm test aligned to the Phase 1 milestone", () => {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  assert.equal(pkg.scripts.test, "npm run test:phase1");
  assert.match(pkg.scripts["test:phase1"], /workflow-create-smoke\.test\.js/);
  assert.doesNotMatch(pkg.scripts["test:phase1"], /workflow-edit-smoke\.test\.js/);
  assert.doesNotMatch(pkg.scripts["test:phase1"], /edit-run\.test\.js/);
});

test("package scripts expose an explicit Phase 2 suite without making it release-blocking", () => {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  assert.match(pkg.scripts["test:phase2"], /workflow-edit-smoke\.test\.js/);
  assert.match(pkg.scripts["test:phase2"], /edit-run\.test\.js/);
  assert.match(pkg.scripts["test:all"], /tests\/\*\.test\.js/);
});
