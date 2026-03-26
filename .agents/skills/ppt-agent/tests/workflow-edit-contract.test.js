"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { initRunState } = require("../scripts/lib/run-manifest");
const { applyEditRun } = require("../scripts/lib/edit-handoff");

function tmpRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "ppt-agent-contract-"));
}

function writeSlide(unpackedRoot, number) {
  const slidesDir = path.join(unpackedRoot, "ppt", "slides");
  const relsDir = path.join(slidesDir, "_rels");
  fs.mkdirSync(relsDir, { recursive: true });
  fs.writeFileSync(path.join(slidesDir, `slide${number}.xml`), `<a:t>Slide ${number}</a:t>`);
  fs.writeFileSync(
    path.join(relsDir, `slide${number}.xml.rels`),
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>'
  );
}

test("applyEditRun consumes Phase 2A artifacts without recomputing slide actions", () => {
  const rootDir = tmpRoot();
  const { runRoot } = initRunState({
    rootDir,
    phase: "edit",
    sourceDeckHash: "deck-a",
    changeFingerprintHash: "change-a"
  });
  const unpackedRoot = path.join(runRoot, "working", "unpacked");
  writeSlide(unpackedRoot, 1);
  writeSlide(unpackedRoot, 2);
  fs.writeFileSync(path.join(runRoot, "input", "original.pptx"), "pptx");
  fs.writeFileSync(
    path.join(runRoot, "artifacts", "original-slide-index.json"),
    JSON.stringify(
      [
        {
          slide_number: 1,
          xml_path: "working/unpacked/ppt/slides/slide1.xml",
          rels_path: "working/unpacked/ppt/slides/_rels/slide1.xml.rels"
        },
        {
          slide_number: 2,
          xml_path: "working/unpacked/ppt/slides/slide2.xml",
          rels_path: "working/unpacked/ppt/slides/_rels/slide2.xml.rels"
        }
      ],
      null,
      2
    )
  );
  fs.writeFileSync(
    path.join(runRoot, "artifacts", "update_plan.json"),
    JSON.stringify(
      {
        slide_actions: [
          {
            slide_number: 1,
            action: "revise",
            reason: "refresh metrics",
            preserve: ["existing layout"],
            visual_role: "evidence",
            image_strategy: "preserve",
            image_rationale: "Keep the source chart intact.",
            layout_strategy: "preserve",
            allowed_layout_delta: "tighten_only",
            allowed_image_delta: "none",
            transcript_path: "artifacts/slide-transcripts/slide-01.md",
            source_slide_number: 1,
            source_layout_anchor: { title_box: "shape:sp3" },
            source_media_refs: [
              {
                relationship_id: "rId5",
                target: "ppt/media/chart1.png",
                content_hash: "sha256:abc"
              }
            ],
            edit_scope: { text: true }
          },
          {
            slide_number: 3,
            action: "add_after",
            after_slide_number: 1,
            reason: "new hiring plan",
            layout_seed: "duplicate_slide:1",
            preserve: ["title hierarchy"],
            visual_role: "explainer",
            image_strategy: "preserve",
            image_rationale: "Reuse the seed slide's visual anchor.",
            layout_strategy: "preserve_seed",
            allowed_layout_delta: "duplicate_seed_adjustment_only",
            allowed_image_delta: "none",
            transcript_path: "artifacts/slide-transcripts/slide-03.md",
            source_slide_number: 1,
            source_layout_anchor: { title_box: "shape:sp3" },
            source_media_refs: [
              {
                relationship_id: "rId5",
                target: "ppt/media/chart1.png",
                content_hash: "sha256:abc"
              }
            ]
          }
        ]
      },
      null,
      2
    )
  );

  const result = applyEditRun(runRoot);
  const handoff = JSON.parse(fs.readFileSync(path.join(runRoot, "artifacts", "edit_handoff.json"), "utf8"));

  assert.equal(result.recomputed_actions, false);
  assert.deepEqual(
    handoff.jobs.map((job) => [job.slide_number, job.action]),
    [
      [1, "revise"],
      [3, "add_after"]
    ]
  );
});
