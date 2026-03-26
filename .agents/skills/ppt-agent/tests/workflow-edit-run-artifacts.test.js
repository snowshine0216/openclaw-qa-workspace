"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { initRunState } = require("../scripts/lib/run-manifest");
const { finalizeEditRun } = require("../scripts/lib/finalize-edit-run");

function tmpRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "ppt-agent-artifacts-"));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

test("finalizeEditRun fails when transcript evidence is missing", () => {
  const rootDir = tmpRoot();
  const { runRoot } = initRunState({
    rootDir,
    phase: "edit",
    sourceDeckHash: "deck-a",
    changeFingerprintHash: "change-a"
  });

  fs.writeFileSync(path.join(runRoot, "input", "original.pptx"), "pptx");
  fs.mkdirSync(path.join(runRoot, "working", "unpacked", "ppt", "slides", "_rels"), { recursive: true });
  fs.mkdirSync(path.join(runRoot, "working", "unpacked", "ppt", "_rels"), { recursive: true });
  fs.writeFileSync(path.join(runRoot, "working", "unpacked", "[Content_Types].xml"), "<Types></Types>");
  fs.writeFileSync(path.join(runRoot, "working", "unpacked", "ppt", "presentation.xml"), "<p:presentation xmlns:p=\"http://schemas.openxmlformats.org/presentationml/2006/main\"></p:presentation>");
  fs.writeFileSync(path.join(runRoot, "working", "unpacked", "ppt", "_rels", "presentation.xml.rels"), "<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\"></Relationships>");
  fs.writeFileSync(path.join(runRoot, "working", "unpacked", "ppt", "slides", "slide1.xml"), "<p:sld xmlns:p=\"http://schemas.openxmlformats.org/presentationml/2006/main\"></p:sld>");
  fs.writeFileSync(path.join(runRoot, "working", "unpacked", "ppt", "slides", "_rels", "slide1.xml.rels"), "<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\"></Relationships>");
  fs.writeFileSync(path.join(runRoot, "renders", "before", "slide-01.png"), "before");
  writeJson(path.join(runRoot, "artifacts", "original-slide-index.json"), [
    {
      slide_number: 1,
      xml_path: "working/unpacked/ppt/slides/slide1.xml",
      rels_path: "working/unpacked/ppt/slides/_rels/slide1.xml.rels"
    }
  ]);
  writeJson(path.join(runRoot, "artifacts", "update_plan.json"), {
    slide_actions: [
      {
        slide_number: 1,
        action: "revise",
        reason: "Refresh",
        preserve: ["existing layout"],
        visual_role: "explainer",
        image_strategy: "optional",
        image_rationale: "No visual change required.",
        layout_strategy: "preserve",
        allowed_layout_delta: "tighten_only",
        transcript_path: "artifacts/slide-transcripts/slide-01.md",
        source_slide_number: 1,
        source_layout_anchor: {},
        source_media_refs: []
      }
    ]
  });
  writeJson(path.join(runRoot, "artifacts", "edit_handoff.json"), {
    jobs: [
      {
        slide_number: 1,
        action: "revise",
        xml_path: "working/unpacked/ppt/slides/slide1.xml",
        rels_path: "working/unpacked/ppt/slides/_rels/slide1.xml.rels"
      }
    ]
  });

  const result = finalizeEditRun({ runRoot });
  assert.equal(result.status, "failed");
  assert.match(result.reason, /transcript|comparison|after renders/i);
});
