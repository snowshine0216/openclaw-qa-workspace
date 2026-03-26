"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { runPhase2A } = require("../scripts/lib/edit-workflow");

const fixtureDeck = path.resolve(
  __dirname,
  "..",
  "fixtures",
  "qa-plan-orchestrator-consulting.pptx"
);

function tmpRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "ppt-agent-edit-resume-"));
}

test("runPhase2A reuses a compatible run and reports the resume stage", async () => {
  const rootDir = tmpRoot();
  const attachmentPath = path.join(rootDir, "delta.md");
  fs.writeFileSync(attachmentPath, "# Delta\n- Refresh March revenue\n");

  const first = await runPhase2A({
    rootDir,
    deck: fixtureDeck,
    changeRequest: "Refresh March revenue",
    attachments: [attachmentPath]
  });
  const second = await runPhase2A({
    rootDir,
    deck: fixtureDeck,
    changeRequest: "Refresh March revenue",
    attachments: [attachmentPath]
  });

  assert.equal(second.runRoot, first.runRoot);
  assert.equal(second.resumed, true);
  assert.match(second.resumeStage, /edit|complete/);
});
