"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");

const { getRuntimePaths } = require("../scripts/lib/runtime-paths");

test("getRuntimePaths resolves ppt-agent skill root and default runs dir via skill-path-registrar", async () => {
  const skillRoot = path.resolve(__dirname, "..");
  const repoRoot = path.resolve(__dirname, "..", "..", "..", "..");
  const runtimePaths = await getRuntimePaths({
    fromScriptPath: path.join(skillRoot, "scripts", "create-run.js")
  });

  assert.equal(runtimePaths.skillRoot, skillRoot);
  assert.equal(runtimePaths.repoRoot, repoRoot);
  assert.equal(runtimePaths.defaultRunsDir, path.join(skillRoot, "runs"));
  assert.equal(runtimePaths.venvActivatePath, path.join(repoRoot, ".venv", "bin", "activate"));
});
