"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("node:child_process");

const createRunScript = path.resolve(__dirname, "..", "scripts", "create-run.js");
const buildScript = path.resolve(__dirname, "..", "scripts", "build-pptx-from-handoff.js");
const manuscriptFixture = path.resolve(__dirname, "..", "fixtures", "sample-manuscript.md");
const designPlanFixture = path.resolve(__dirname, "..", "fixtures", "sample-design-plan.md");

function tmpRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "ppt-agent-e2e-"));
}

test("Phase 1 happy path builds a pptx from create-run output", () => {
  const rootDir = tmpRoot();

  const createResult = spawnSync(
    "node",
    [
      createRunScript,
      "--root-dir", rootDir,
      "--prompt", "Build a Q2 operating review for leadership with current metrics and risks.",
      "--objective", "Summarize Q2 performance and decisions.",
      "--audience", "Executive leadership",
      "--attachments", "/tmp/q2-report.md",
      "--manuscript", manuscriptFixture,
      "--design-plan", designPlanFixture
    ],
    { encoding: "utf8" }
  );

  assert.equal(createResult.status, 0, createResult.stderr);
  const createPayload = JSON.parse(createResult.stdout);
  assert.ok(createPayload.pptxHandoffPath);
  assert.ok(fs.existsSync(createPayload.pptxHandoffPath));

  const buildResult = spawnSync(
    "node",
    [
      buildScript,
      "--handoff", createPayload.pptxHandoffPath
    ],
    { encoding: "utf8" }
  );

  assert.equal(buildResult.status, 0, buildResult.stderr);
  const buildPayload = JSON.parse(buildResult.stdout);
  assert.ok(fs.existsSync(buildPayload.outputPath));
  assert.ok(fs.statSync(buildPayload.outputPath).size > 0);
});
