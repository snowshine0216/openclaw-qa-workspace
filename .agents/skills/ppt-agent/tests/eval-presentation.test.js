"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { compareDecks } = require("../scripts/lib/eval-presentation");

function tmpDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function writeRender(dir, number) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `slide-${String(number).padStart(2, "0")}.png`), `slide ${number}`);
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

test("compareDecks passes when requested updates are applied and render counts line up", () => {
  const root = tmpDir("ppt-agent-compare-");
  const beforeDir = path.join(root, "before");
  const afterDir = path.join(root, "after");
  writeRender(beforeDir, 1);
  writeRender(beforeDir, 2);
  writeRender(afterDir, 1);
  writeRender(afterDir, 2);
  writeRender(afterDir, 3);

  const planPath = path.join(root, "update_plan.json");
  const handoffPath = path.join(root, "edit_handoff.json");
  writeJson(planPath, {
    slide_actions: [
      { slide_number: 1, action: "revise", reason: "refresh", preserve: ["existing layout"], edit_scope: { text: true } },
      { slide_number: 2, action: "keep", reason: "stable" },
      { slide_number: 3, action: "add_after", reason: "new slide", layout_seed: "duplicate_slide:1", preserve: ["title hierarchy"] }
    ]
  });
  writeJson(handoffPath, {
    jobs: [
      { slide_number: 1, action: "revise" },
      { slide_number: 3, action: "add_after" }
    ]
  });

  const result = compareDecks({ beforeDir, afterDir, updatePlanPath: planPath, handoffPath });
  assert.equal(result.result, "pass");
  assert.equal(result.requested_updates.missed, 0);
  assert.ok(result.deck_scores.design_consistency >= 4);
});

test("compareDecks fails when requested updates are missed", () => {
  const root = tmpDir("ppt-agent-compare-fail-");
  const beforeDir = path.join(root, "before");
  const afterDir = path.join(root, "after");
  writeRender(beforeDir, 1);
  writeRender(afterDir, 1);

  const planPath = path.join(root, "update_plan.json");
  const handoffPath = path.join(root, "edit_handoff.json");
  writeJson(planPath, {
    slide_actions: [
      { slide_number: 1, action: "revise", reason: "refresh", preserve: ["existing layout"], edit_scope: { text: true } },
      { slide_number: 2, action: "add_after", reason: "new slide", layout_seed: "duplicate_slide:1", preserve: ["title hierarchy"] }
    ]
  });
  writeJson(handoffPath, {
    jobs: [{ slide_number: 1, action: "revise" }]
  });

  const result = compareDecks({ beforeDir, afterDir, updatePlanPath: planPath, handoffPath });
  assert.equal(result.result, "fail");
  assert.equal(result.requested_updates.missed, 1);
});

test("compareDecks reports already-current success when no slide changes are needed", () => {
  const root = tmpDir("ppt-agent-compare-current-");
  const beforeDir = path.join(root, "before");
  const afterDir = path.join(root, "after");
  writeRender(beforeDir, 1);
  writeRender(afterDir, 1);

  const planPath = path.join(root, "update_plan.json");
  writeJson(planPath, {
    slide_actions: [{ slide_number: 1, action: "keep", reason: "already current" }]
  });

  const result = compareDecks({ beforeDir, afterDir, updatePlanPath: planPath });
  assert.equal(result.result, "pass");
  assert.equal(result.state, "already_current");
  assert.equal(result.recommendation, "safe to review");
  assert.match(result.message, /Deck is already current/i);
  assert.ok(Array.isArray(result.executive_summary));
});

test("compareDecks reports review-with-warnings when skipped slides retain a trustworthy review draft", () => {
  const root = tmpDir("ppt-agent-compare-warnings-");
  const beforeDir = path.join(root, "before");
  const afterDir = path.join(root, "after");
  writeRender(beforeDir, 1);
  writeRender(beforeDir, 2);
  writeRender(afterDir, 1);
  writeRender(afterDir, 2);

  const planPath = path.join(root, "update_plan.json");
  const handoffPath = path.join(root, "edit_handoff.json");
  writeJson(planPath, {
    slide_actions: [
      { slide_number: 1, action: "revise", reason: "refresh", preserve: ["existing layout"], edit_scope: { text: true } },
      { slide_number: 2, action: "revise", reason: "ambiguous", preserve: ["existing layout"], edit_scope: { text: true } }
    ]
  });
  writeJson(handoffPath, {
    jobs: [
      {
        slide_number: 1,
        action: "revise",
        status: "applied"
      },
      {
        slide_number: 2,
        action: "revise",
        status: "skipped",
        fallback: "manual_review_required",
        reason: "Requested source material was ambiguous"
      }
    ]
  });

  const result = compareDecks({ beforeDir, afterDir, updatePlanPath: planPath, handoffPath });
  assert.equal(result.result, "partial");
  assert.equal(result.recommendation, "review with warnings");
  assert.equal(result.requested_updates.applied, 1);
  assert.equal(result.requested_updates.skipped, 1);
  assert.deepEqual(result.skipped_slides, [2]);
  assert.match(result.executive_summary.join("\n"), /not presentation-ready until flagged items are checked/i);
});
