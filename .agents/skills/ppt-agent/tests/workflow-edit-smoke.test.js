"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("node:child_process");

const editScriptPath = path.resolve(__dirname, "..", "scripts", "edit-run.js");
const applyScriptPath = path.resolve(__dirname, "..", "scripts", "apply-edit-run.js");
const finalizeScriptPath = path.resolve(__dirname, "..", "scripts", "finalize-edit-run.js");
const fixtureDeck = path.resolve(
  __dirname,
  "..",
  "fixtures",
  "qa-plan-orchestrator-consulting.pptx"
);

function tmpRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "ppt-agent-edit-smoke-"));
}

function countSlidesInDeck(deckPath) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ppt-agent-slide-count-"));
  try {
    const unzip = spawnSync("unzip", ["-qq", deckPath, "-d", tempDir], { encoding: "utf8" });
    assert.equal(unzip.status, 0, unzip.stderr);
    return fs
      .readdirSync(path.join(tempDir, "ppt", "slides"))
      .filter((name) => /^slide\d+\.xml$/i.test(name)).length;
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

test("documented Phase 2 CLI flow edits the deck and produces review artifacts", () => {
  const rootDir = tmpRoot();
  const attachmentPath = path.join(rootDir, "delta.md");
  fs.writeFileSync(
    attachmentPath,
    [
      "# Q2 Hiring Plan",
      "",
      "- Add a dedicated hiring slide",
      "- Refresh March revenue to $12.4M"
    ].join("\n")
  );

  const editResult = spawnSync(
    "node",
    [
      editScriptPath,
      "--root-dir", rootDir,
      "--deck", fixtureDeck,
      "--change-request", "Refresh March revenue and add one hiring plan slide",
      "--attachments", attachmentPath
    ],
    { encoding: "utf8" }
  );
  assert.equal(editResult.status, 0, editResult.stderr);
  const editPayload = JSON.parse(editResult.stdout);

  const applyResult = spawnSync(
    "node",
    [applyScriptPath, "--run-root", editPayload.runRoot],
    { encoding: "utf8" }
  );
  assert.equal(applyResult.status, 0, applyResult.stderr);

  const finalizeResult = spawnSync(
    "node",
    [finalizeScriptPath, "--run-root", editPayload.runRoot],
    { encoding: "utf8" }
  );
  assert.equal(finalizeResult.status, 0, finalizeResult.stderr);
  const finalizePayload = JSON.parse(finalizeResult.stdout);
  assert.equal(finalizePayload.status, "complete");

  const comparison = JSON.parse(
    fs.readFileSync(path.join(editPayload.runRoot, "artifacts", "comparison_evals.json"), "utf8")
  );
  assert.equal(comparison.result, "pass");
  assert.equal(comparison.recommendation, "safe to review");
  assert.ok(Array.isArray(comparison.executive_summary));
  assert.ok(comparison.executive_summary.length >= 4);
  assert.ok(Array.isArray(comparison.slide_results));

  const originalCount = countSlidesInDeck(fixtureDeck);
  const updatedCount = countSlidesInDeck(path.join(editPayload.runRoot, "artifacts", "output-updated.pptx"));
  assert.equal(updatedCount, originalCount + 1);
});
