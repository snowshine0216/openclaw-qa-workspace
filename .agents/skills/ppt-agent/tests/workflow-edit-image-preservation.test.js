"use strict";

// Preservation regression suite — phase-2 baseline guardrail.
//
// These tests lock the preserve/refine/replace audit contract in finalize-edit-run.
// The baseline is green on branch `evolve` as of 2026-03-26 and must remain green
// before any enrichment work expands media behavior.
//
// Audit tiers:
//   preserve — source media refs must survive unchanged; drift without approval fails finalize
//   refine   — source media may be annotated or cropped; job must record derived_from_media_ref
//   replace  — source media may be swapped; requires an approved replacement preview artifact
//
// Any regression here blocks enrichment implementation from proceeding.

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { initRunState } = require("../scripts/lib/run-manifest");
const { finalizeEditRun } = require("../scripts/lib/finalize-edit-run");

function tmpRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "ppt-agent-preserve-"));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function writeFixture({ removeSourceMedia = false, imageStrategy = "preserve", derived = false }) {
  const rootDir = tmpRoot();
  const { runRoot } = initRunState({
    rootDir,
    phase: "edit",
    sourceDeckHash: "deck-a",
    changeFingerprintHash: "change-a"
  });
  const unpackedRoot = path.join(runRoot, "working", "unpacked");
  fs.mkdirSync(path.join(unpackedRoot, "ppt", "slides", "_rels"), { recursive: true });
  fs.mkdirSync(path.join(unpackedRoot, "ppt", "_rels"), { recursive: true });
  fs.mkdirSync(path.join(unpackedRoot, "ppt", "media"), { recursive: true });
  fs.writeFileSync(path.join(unpackedRoot, "[Content_Types].xml"), "<Types></Types>");
  fs.writeFileSync(path.join(unpackedRoot, "ppt", "presentation.xml"), "<p:presentation xmlns:p=\"http://schemas.openxmlformats.org/presentationml/2006/main\"></p:presentation>");
  fs.writeFileSync(path.join(unpackedRoot, "ppt", "_rels", "presentation.xml.rels"), "<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\"></Relationships>");
  fs.writeFileSync(path.join(unpackedRoot, "ppt", "slides", "slide1.xml"), "<p:sld xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\" xmlns:p=\"http://schemas.openxmlformats.org/presentationml/2006/main\"><p:cSld><p:spTree><p:sp><p:txBody><a:p><a:r><a:t>Executive Summary</a:t></a:r></a:p></p:txBody></p:sp><p:pic/></p:spTree></p:cSld></p:sld>");
  fs.writeFileSync(path.join(unpackedRoot, "ppt", "media", "image1.png"), "image-data");
  fs.writeFileSync(
    path.join(unpackedRoot, "ppt", "slides", "_rels", "slide1.xml.rels"),
    removeSourceMedia
      ? "<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\"></Relationships>"
      : "<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\"><Relationship Id=\"rId5\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/image\" Target=\"../media/image1.png\"/></Relationships>"
  );
  fs.writeFileSync(path.join(runRoot, "renders", "before", "slide-01.png"), "before");
  writeJson(path.join(runRoot, "artifacts", "original-slide-index.json"), [
    {
      slide_number: 1,
      xml_path: "working/unpacked/ppt/slides/slide1.xml",
      rels_path: "working/unpacked/ppt/slides/_rels/slide1.xml.rels",
      layout_anchor: { title_box: "shape:title" }
    }
  ]);
  writeJson(path.join(runRoot, "artifacts", "transcript-index.json"), {
    status: "ready",
    transcripts: [{ transcript_number: 1 }]
  });
  writeJson(path.join(runRoot, "artifacts", "update_plan.json"), {
    slide_actions: [
      {
        slide_number: 1,
        action: "revise",
        reason: "Refresh metrics",
        preserve: ["existing layout"],
        visual_role: "evidence",
        image_strategy: imageStrategy,
        image_rationale: "Preserve the source chart unless refinement is allowed.",
        layout_strategy: "preserve",
        allowed_layout_delta: "tighten_only",
        allowed_image_delta: imageStrategy === "refine" ? "annotation_or_crop_only" : "none",
        transcript_path: "artifacts/slide-transcripts/slide-01.md",
        source_slide_number: 1,
        source_layout_anchor: { title_box: "shape:title" },
        source_media_refs: [
          {
            relationship_id: "rId5",
            target: "ppt/media/image1.png",
            content_hash: "sha256:2b700b7786d5a3f0cb487c3afaccb889fae829504a0ad1b70881e4643360f344"
          }
        ]
      }
    ]
  });
  writeJson(path.join(runRoot, "artifacts", "edit_handoff.json"), {
    jobs: [
      {
        slide_number: 1,
        action: "revise",
        xml_path: "working/unpacked/ppt/slides/slide1.xml",
        rels_path: "working/unpacked/ppt/slides/_rels/slide1.xml.rels",
        derived_from_media_ref: derived ? "rId5" : null
      }
    ]
  });
  return runRoot;
}

test("edit finalize fails when a preserved slide loses its source media", () => {
  const runRoot = writeFixture({ removeSourceMedia: true, imageStrategy: "preserve" });
  const result = finalizeEditRun({ runRoot });
  assert.equal(result.status, "failed");
});

test("edit finalize passes when preserved media refs remain intact", () => {
  const runRoot = writeFixture({ removeSourceMedia: false, imageStrategy: "preserve" });
  const result = finalizeEditRun({ runRoot });
  assert.equal(result.status, "complete");
});

test("edit finalize allows refine mode when the job records a derived media reference", () => {
  const runRoot = writeFixture({ removeSourceMedia: false, imageStrategy: "refine", derived: true });
  const result = finalizeEditRun({ runRoot });
  assert.equal(result.status, "complete");
});
