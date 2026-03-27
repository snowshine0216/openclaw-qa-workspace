"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("node:child_process");

const { initRunState } = require("../scripts/lib/run-manifest");
const { finalizeEditRun } = require("../scripts/lib/finalize-edit-run");
const scriptPath = path.resolve(__dirname, "..", "scripts", "finalize-edit-run.js");

function tmpRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "ppt-agent-finalize-"));
}

function writeRender(dir, number) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `slide-${String(number).padStart(2, "0")}.png`), `slide ${number}`);
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function writeUnpackedWorkspace(runRoot) {
  const unpackedRoot = path.join(runRoot, "working", "unpacked");
  const slidesDir = path.join(unpackedRoot, "ppt", "slides");
  const slidesRelsDir = path.join(slidesDir, "_rels");
  const presRelsDir = path.join(unpackedRoot, "ppt", "_rels");
  const mediaDir = path.join(unpackedRoot, "ppt", "media");
  fs.mkdirSync(slidesRelsDir, { recursive: true });
  fs.mkdirSync(presRelsDir, { recursive: true });
  fs.mkdirSync(mediaDir, { recursive: true });
  fs.writeFileSync(path.join(mediaDir, "image1.png"), "image-data");

  fs.writeFileSync(
    path.join(unpackedRoot, "[Content_Types].xml"),
    [
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
      '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">',
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>',
      '<Default Extension="xml" ContentType="application/xml"/>',
      '<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>',
      '<Override PartName="/ppt/slides/slide1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>',
      '<Override PartName="/ppt/slides/slide2.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>',
      "</Types>"
    ].join("")
  );
  fs.writeFileSync(
    path.join(unpackedRoot, "ppt", "presentation.xml"),
    [
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
      '<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">',
      '<p:sldIdLst>',
      '<p:sldId id="256" r:id="rId1"/>',
      '<p:sldId id="257" r:id="rId2"/>',
      '</p:sldIdLst>',
      '</p:presentation>'
    ].join("")
  );
  fs.writeFileSync(
    path.join(unpackedRoot, "ppt", "_rels", "presentation.xml.rels"),
    [
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide1.xml"/>',
      '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide2.xml"/>',
      '</Relationships>'
    ].join("")
  );
  fs.writeFileSync(
    path.join(slidesDir, "slide1.xml"),
    '<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:sp><p:txBody><a:p><a:r><a:t>Executive Summary</a:t></a:r></a:p><a:p><a:r><a:t>Revenue baseline</a:t></a:r></a:p></p:txBody></p:sp><p:pic/></p:spTree></p:cSld></p:sld>'
  );
  fs.writeFileSync(
    path.join(slidesDir, "slide2.xml"),
    '<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:sp><p:txBody><a:p><a:r><a:t>Risks</a:t></a:r></a:p><a:p><a:r><a:t>Hiring pace</a:t></a:r></a:p></p:txBody></p:sp></p:spTree></p:cSld></p:sld>'
  );
  fs.writeFileSync(
    path.join(slidesRelsDir, "slide1.xml.rels"),
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image1.png"/></Relationships>'
  );
  fs.writeFileSync(
    path.join(slidesRelsDir, "slide2.xml.rels"),
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>'
  );
}

function applyFixtureJobsToWorkspace(runRoot, handoff) {
  const unpackedRoot = path.join(runRoot, "working", "unpacked");
  const contentTypesPath = path.join(unpackedRoot, "[Content_Types].xml");
  const presentationPath = path.join(unpackedRoot, "ppt", "presentation.xml");
  const presentationRelsPath = path.join(unpackedRoot, "ppt", "_rels", "presentation.xml.rels");
  const slidesDir = path.join(unpackedRoot, "ppt", "slides");
  const slidesRelsDir = path.join(slidesDir, "_rels");

  const jobs = handoff.jobs || [];
  if (jobs.some((job) => job.slide_number === 3 && job.action === "add_after")) {
    fs.writeFileSync(
      path.join(slidesDir, "slide3.xml"),
      '<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:sp><p:txBody><a:p><a:r><a:t>Hiring Plan</a:t></a:r></a:p><a:p><a:r><a:t>Updated hiring plan slide</a:t></a:r></a:p></p:txBody></p:sp><p:pic/></p:spTree></p:cSld></p:sld>'
    );
    fs.writeFileSync(
      path.join(slidesRelsDir, "slide3.xml.rels"),
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image1.png"/></Relationships>'
    );
    fs.writeFileSync(
      contentTypesPath,
      fs.readFileSync(contentTypesPath, "utf8").replace(
        "</Types>",
        '<Override PartName="/ppt/slides/slide3.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/></Types>'
      )
    );
    fs.writeFileSync(
      presentationRelsPath,
      fs.readFileSync(presentationRelsPath, "utf8").replace(
        "</Relationships>",
        '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide3.xml"/></Relationships>'
      )
    );
    fs.writeFileSync(
      presentationPath,
      fs.readFileSync(presentationPath, "utf8").replace(
        "</p:sldIdLst>",
        '<p:sldId id="258" r:id="rId3"/></p:sldIdLst>'
      )
    );
  }
}

function setupFinalizeFixture({ plan, handoff }) {
  const rootDir = tmpRoot();
  const { runRoot } = initRunState({
    rootDir,
    phase: "edit",
    sourceDeckHash: "deck-a",
    changeFingerprintHash: "change-a"
  });
  fs.writeFileSync(path.join(runRoot, "input", "original.pptx"), "pptx");
  writeRender(path.join(runRoot, "renders", "before"), 1);
  writeRender(path.join(runRoot, "renders", "before"), 2);
  writeUnpackedWorkspace(runRoot);
  applyFixtureJobsToWorkspace(runRoot, handoff);
  writeJson(
    path.join(runRoot, "artifacts", "original-slide-index.json"),
    [
      {
        slide_number: 1,
        xml_path: "working/unpacked/ppt/slides/slide1.xml",
        rels_path: "working/unpacked/ppt/slides/_rels/slide1.xml.rels",
        layout_anchor: { title_box: "shape:sp3" }
      },
      {
        slide_number: 2,
        xml_path: "working/unpacked/ppt/slides/slide2.xml",
        rels_path: "working/unpacked/ppt/slides/_rels/slide2.xml.rels",
        layout_anchor: { title_box: "shape:sp3" }
      }
    ]
  );
  writeJson(path.join(runRoot, "artifacts", "update_plan.json"), plan);
  writeJson(path.join(runRoot, "artifacts", "edit_handoff.json"), handoff);
  writeJson(path.join(runRoot, "artifacts", "transcript-index.json"), {
    status: "ready",
    transcripts: [
      { transcript_number: 1 },
      { transcript_number: 2 },
      { transcript_number: 3 }
    ]
  });
  return runRoot;
}

test("finalizeEditRun writes output deck and comparison evals on success", () => {
  const runRoot = setupFinalizeFixture({
    plan: {
      slide_actions: [
        { slide_number: 1, action: "revise", reason: "refresh", preserve: ["existing layout"], visual_role: "evidence", image_strategy: "preserve", image_rationale: "Keep chart", layout_strategy: "preserve", allowed_layout_delta: "tighten_only", allowed_image_delta: "none", transcript_path: "artifacts/slide-transcripts/slide-01.md", source_slide_number: 1, source_layout_anchor: { title_box: "shape:sp3" }, source_media_refs: [{ relationship_id: "rId5", target: "ppt/media/image1.png", content_hash: "sha256:2b700b7786d5a3f0cb487c3afaccb889fae829504a0ad1b70881e4643360f344" }] },
        { slide_number: 2, action: "keep", reason: "stable" },
        { slide_number: 3, action: "add_after", reason: "new slide", layout_seed: "duplicate_slide:1", preserve: ["title hierarchy"], visual_role: "explainer", image_strategy: "preserve", image_rationale: "Keep seed image", layout_strategy: "preserve_seed", allowed_layout_delta: "duplicate_seed_adjustment_only", allowed_image_delta: "none", transcript_path: "artifacts/slide-transcripts/slide-03.md", source_slide_number: 1, source_layout_anchor: { title_box: "shape:sp3" }, source_media_refs: [{ relationship_id: "rId5", target: "ppt/media/image1.png", content_hash: "sha256:2b700b7786d5a3f0cb487c3afaccb889fae829504a0ad1b70881e4643360f344" }] }
      ]
    },
    handoff: {
      jobs: [
        { slide_number: 1, action: "revise", xml_path: "working/unpacked/ppt/slides/slide1.xml", rels_path: "working/unpacked/ppt/slides/_rels/slide1.xml.rels", image_action: "keep_media" },
        { slide_number: 3, action: "add_after", xml_path: "working/unpacked/ppt/slides/slide3.xml", rels_path: "working/unpacked/ppt/slides/_rels/slide3.xml.rels", image_action: "keep_media" }
      ]
    }
  });

  const result = finalizeEditRun({ runRoot });
  assert.equal(result.status, "complete");
  assert.ok(fs.existsSync(path.join(runRoot, "artifacts", "output-updated.pptx")));
  assert.ok(fs.existsSync(path.join(runRoot, "artifacts", "comparison_evals.json")));
  assert.ok(fs.existsSync(path.join(runRoot, "artifacts", "run_summary.md")));
  assert.ok(fs.existsSync(path.join(runRoot, "artifacts", "operator-summary.json")));
  const comparison = JSON.parse(fs.readFileSync(path.join(runRoot, "artifacts", "comparison_evals.json"), "utf8"));
  assert.equal(comparison.operator_state.stage_label, "Comparing original vs updated deck");
});

test("finalizeEditRun fails when comparison evaluation reports missed updates", () => {
  const runRoot = setupFinalizeFixture({
    plan: {
      slide_actions: [
        { slide_number: 1, action: "revise", reason: "refresh", preserve: ["existing layout"], visual_role: "evidence", image_strategy: "preserve", image_rationale: "Keep chart", layout_strategy: "preserve", allowed_layout_delta: "tighten_only", allowed_image_delta: "none", transcript_path: "artifacts/slide-transcripts/slide-01.md", source_slide_number: 1, source_layout_anchor: { title_box: "shape:sp3" }, source_media_refs: [{ relationship_id: "rId5", target: "ppt/media/image1.png", content_hash: "sha256:2b700b7786d5a3f0cb487c3afaccb889fae829504a0ad1b70881e4643360f344" }] },
        { slide_number: 3, action: "add_after", reason: "new slide", layout_seed: "duplicate_slide:1", preserve: ["title hierarchy"], visual_role: "explainer", image_strategy: "preserve", image_rationale: "Keep seed image", layout_strategy: "preserve_seed", allowed_layout_delta: "duplicate_seed_adjustment_only", allowed_image_delta: "none", transcript_path: "artifacts/slide-transcripts/slide-03.md", source_slide_number: 1, source_layout_anchor: { title_box: "shape:sp3" }, source_media_refs: [{ relationship_id: "rId5", target: "ppt/media/image1.png", content_hash: "sha256:2b700b7786d5a3f0cb487c3afaccb889fae829504a0ad1b70881e4643360f344" }] }
      ]
    },
    handoff: {
      jobs: [{ slide_number: 1, action: "revise", xml_path: "working/unpacked/ppt/slides/slide1.xml", rels_path: "working/unpacked/ppt/slides/_rels/slide1.xml.rels", image_action: "keep_media" }]
    }
  });

  const result = finalizeEditRun({ runRoot });
  assert.equal(result.status, "failed");
  assert.match(result.reason, /missed updates/i);
});

test("finalizeEditRun fails when preserve-layout slides lose anchored image structure", () => {
  const runRoot = setupFinalizeFixture({
    plan: {
      slide_actions: [
        {
          slide_number: 1,
          action: "revise",
          reason: "refresh",
          preserve: ["existing layout"],
          visual_role: "evidence",
          image_strategy: "preserve",
          image_rationale: "Keep chart",
          layout_strategy: "preserve",
          allowed_layout_delta: "tighten_only",
          allowed_image_delta: "none",
          transcript_path: "artifacts/slide-transcripts/slide-01.md",
          source_slide_number: 1,
          source_layout_anchor: { title_box: "shape:sp3", body_box: "shape:sp4", image_box: "shape:pic2" },
          source_media_refs: [
            {
              relationship_id: "rId5",
              target: "ppt/media/image1.png",
              content_hash: "sha256:2b700b7786d5a3f0cb487c3afaccb889fae829504a0ad1b70881e4643360f344"
            }
          ]
        }
      ]
    },
    handoff: {
      jobs: [
        {
          slide_number: 1,
          action: "revise",
          xml_path: "working/unpacked/ppt/slides/slide1.xml",
          rels_path: "working/unpacked/ppt/slides/_rels/slide1.xml.rels",
          image_action: "keep_media"
        }
      ]
    }
  });
  fs.writeFileSync(
    path.join(runRoot, "working", "unpacked", "ppt", "slides", "slide1.xml"),
    '<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:sp><p:txBody><a:p><a:r><a:t>Executive Summary</a:t></a:r></a:p></p:txBody></p:sp></p:spTree></p:cSld></p:sld>'
  );

  const result = finalizeEditRun({ runRoot });
  assert.equal(result.status, "failed");
  assert.match(result.reason, /comparison|regression|drift/i);
});

test("finalize-edit-run CLI exits non-zero when finalize returns a failed compare", () => {
  const runRoot = setupFinalizeFixture({
    plan: {
      slide_actions: [
        { slide_number: 1, action: "revise", reason: "refresh", preserve: ["existing layout"], visual_role: "evidence", image_strategy: "preserve", image_rationale: "Keep chart", layout_strategy: "preserve", allowed_layout_delta: "tighten_only", allowed_image_delta: "none", transcript_path: "artifacts/slide-transcripts/slide-01.md", source_slide_number: 1, source_layout_anchor: { title_box: "shape:sp3" }, source_media_refs: [{ relationship_id: "rId5", target: "ppt/media/image1.png", content_hash: "sha256:2b700b7786d5a3f0cb487c3afaccb889fae829504a0ad1b70881e4643360f344" }] },
        { slide_number: 3, action: "add_after", reason: "new slide", layout_seed: "duplicate_slide:1", preserve: ["title hierarchy"], visual_role: "explainer", image_strategy: "preserve", image_rationale: "Keep seed image", layout_strategy: "preserve_seed", allowed_layout_delta: "duplicate_seed_adjustment_only", allowed_image_delta: "none", transcript_path: "artifacts/slide-transcripts/slide-03.md", source_slide_number: 1, source_layout_anchor: { title_box: "shape:sp3" }, source_media_refs: [{ relationship_id: "rId5", target: "ppt/media/image1.png", content_hash: "sha256:2b700b7786d5a3f0cb487c3afaccb889fae829504a0ad1b70881e4643360f344" }] }
      ]
    },
    handoff: {
      jobs: [{ slide_number: 1, action: "revise", xml_path: "working/unpacked/ppt/slides/slide1.xml", rels_path: "working/unpacked/ppt/slides/_rels/slide1.xml.rels", image_action: "keep_media" }]
    }
  });

  const result = spawnSync(process.execPath, [scriptPath, "--run-root", runRoot], { encoding: "utf8" });

  assert.notEqual(result.status, 0);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.status, "failed");
  assert.match(parsed.reason, /missed updates/i);
});
