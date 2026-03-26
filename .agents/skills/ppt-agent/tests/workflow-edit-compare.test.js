"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { compareDecks } = require("../scripts/lib/eval-presentation");
const { initRunState } = require("../scripts/lib/run-manifest");
const { finalizeEditRun } = require("../scripts/lib/finalize-edit-run");

function tmpDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function writeRender(dir, number) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `slide-${String(number).padStart(2, "0")}.svg`), `<svg><text>${number}</text></svg>`);
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

test("comparison output includes operator-facing recommendation wording", () => {
  const root = tmpDir("ppt-agent-edit-compare-");
  const beforeDir = path.join(root, "before");
  const afterDir = path.join(root, "after");
  writeRender(beforeDir, 1);
  writeRender(afterDir, 1);

  const planPath = path.join(root, "update_plan.json");
  writeJson(planPath, {
    slide_actions: [{ slide_number: 1, action: "keep", reason: "already current" }]
  });

  const result = compareDecks({ beforeDir, afterDir, updatePlanPath: planPath });
  assert.match(result.message, /Deck is already current/i);
  assert.ok(Array.isArray(result.executive_summary));
});

test("finalizeEditRun fails when no real edited workspace exists to finalize", () => {
  const rootDir = tmpDir("ppt-agent-edit-finalize-");
  const { runRoot } = initRunState({
    rootDir,
    phase: "edit",
    sourceDeckHash: "deck-a",
    changeFingerprintHash: "change-a"
  });
  fs.writeFileSync(path.join(runRoot, "input", "original.pptx"), "pptx");
  writeJson(path.join(runRoot, "artifacts", "update_plan.json"), {
    slide_actions: [{ slide_number: 1, action: "revise", reason: "refresh", preserve: ["existing layout"], edit_scope: { text: true } }]
  });
  writeJson(path.join(runRoot, "artifacts", "edit_handoff.json"), {
    jobs: [{ slide_number: 1, action: "revise", status: "applied" }]
  });

  const result = finalizeEditRun({ runRoot });
  assert.equal(result.status, "failed");
  assert.match(result.reason, /finalize|workspace|comparison/i);
});
