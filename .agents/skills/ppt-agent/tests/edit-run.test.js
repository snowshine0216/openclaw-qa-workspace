"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("node:child_process");

const scriptPath = path.resolve(__dirname, "..", "scripts", "edit-run.js");
const { resolveRunRoot } = require("../scripts/edit-run.js");
const fixtureDeck = path.resolve(
  __dirname,
  "..",
  "fixtures",
  "qa-plan-orchestrator-consulting.pptx"
);

function tmpRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "ppt-agent-edit-"));
}

test("edit-run initializes a Phase 2A run and emits planning artifacts", () => {
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

  const result = spawnSync(
    "node",
    [
      scriptPath,
      "--root-dir", rootDir,
      "--deck", fixtureDeck,
      "--change-request", "Refresh March revenue and add one hiring plan slide",
      "--attachments", attachmentPath
    ],
    { encoding: "utf8" }
  );

  assert.equal(result.status, 0, result.stderr);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.status, "ready");
  assert.equal(payload.phase, "edit");
  assert.ok(fs.existsSync(path.join(payload.runRoot, "manifest.json")));
  assert.ok(fs.existsSync(path.join(payload.runRoot, "input", "edit_brief.json")));
  assert.ok(fs.existsSync(path.join(payload.runRoot, "artifacts", "original-text.md")));
  assert.ok(fs.existsSync(path.join(payload.runRoot, "artifacts", "original-slide-index.json")));
  assert.ok(fs.existsSync(path.join(payload.runRoot, "artifacts", "raw-slide-captions.json")));
  assert.ok(fs.existsSync(path.join(payload.runRoot, "artifacts", "slide_analysis.json")));
  assert.ok(fs.existsSync(path.join(payload.runRoot, "artifacts", "research_delta.md")));
  assert.ok(fs.existsSync(path.join(payload.runRoot, "artifacts", "update_plan.md")));
  assert.ok(fs.existsSync(path.join(payload.runRoot, "artifacts", "update_plan.json")));
  assert.ok(fs.existsSync(path.join(payload.runRoot, "artifacts", "transcript-index.json")));
  assert.ok(fs.existsSync(path.join(payload.runRoot, "artifacts", "operator-summary.json")));
  assert.ok(fs.existsSync(path.join(payload.runRoot, "artifacts", "pre_edit_checkpoint.md")));
  assert.ok(fs.existsSync(path.join(payload.runRoot, "artifacts", "manual_handoff.md")));
  assert.ok(fs.existsSync(path.join(payload.runRoot, "logs", "stage-status.json")));
  assert.ok(fs.existsSync(path.join(payload.runRoot, "logs", "events.jsonl")));
  assert.equal(payload.operator_state.stage_label, "Planning slide actions");
  assert.ok(payload.operator_state.completed.includes("Initializing edit run"));
  assert.ok(payload.operator_state.completed.includes("Extracting text, images, and editable structure"));
  assert.ok(payload.operator_state.completed.includes("Summarizing new material"));
  assert.ok(payload.operator_state.completed.includes("Checking stale claims"));

  const slideIndex = JSON.parse(
    fs.readFileSync(path.join(payload.runRoot, "artifacts", "original-slide-index.json"), "utf8")
  );
  assert.ok(slideIndex.length > 0);
  assert.match(slideIndex[0].xml_path, /working\/unpacked\/ppt\/slides\/slide\d+\.xml$/);
  assert.match(slideIndex[0].rels_path, /working\/unpacked\/ppt\/slides\/_rels\/slide\d+\.xml\.rels$/);
});

test("edit-run rejects missing change request", () => {
  const rootDir = tmpRoot();
  const result = spawnSync(
    "node",
    [
      scriptPath,
      "--root-dir", rootDir,
      "--deck", fixtureDeck
    ],
    { encoding: "utf8" }
  );

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /change request/i);
});

test("edit-run resolves omitted root-dir to the skill-local runs directory", async () => {
  assert.equal(
    await resolveRunRoot(),
    path.resolve(__dirname, "..", "runs")
  );
});
