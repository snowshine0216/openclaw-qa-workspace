"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { buildDeckFromHandoff } = require("../scripts/lib/build-pptx-from-handoff");

function tmpRunRoot() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ppt-agent-partial-"));
  fs.mkdirSync(path.join(dir, "artifacts"), { recursive: true });
  return dir;
}

function writeMinimalBuildContract(runRoot, optionalImage) {
  fs.writeFileSync(
    path.join(runRoot, "artifacts", "manuscript.md"),
    [
      "# Q2 Review",
      "",
      "Slide title: Delivery Process",
      "- Show phased rollout from pilot to governed production.",
      "- Keep the process business-readable and low-clutter."
    ].join("\n")
  );
  fs.writeFileSync(path.join(runRoot, "artifacts", "design_plan.md"), "# Design Plan: Q2 Review\n");
  fs.writeFileSync(
    path.join(runRoot, "artifacts", "slide-build-spec.json"),
    JSON.stringify(
      {
        phase: "create",
        build_path: "new_deck_generation",
        manuscript_path: "artifacts/manuscript.md",
        design_plan_path: "artifacts/design_plan.md",
        output_pptx_path: "artifacts/output.pptx",
        slides: [
          {
            slide_number: 1,
            title: "Delivery Process",
            layout: "process_flow",
            optional_image: optionalImage
          }
        ]
      },
      null,
      2
    )
  );
  fs.writeFileSync(
    path.join(runRoot, "artifacts", "pptx-handoff.json"),
    JSON.stringify(
      {
        handoff_type: "pptx_new_deck_generation",
        phase: "create",
        layout: "LAYOUT_16x9",
        build_path: "new_deck_generation",
        reference_strategy: "none",
        manuscript_path: "artifacts/manuscript.md",
        design_plan_path: "artifacts/design_plan.md",
        slide_build_spec_path: "artifacts/slide-build-spec.json",
        output_pptx_path: "artifacts/output.pptx"
      },
      null,
      2
    )
  );
}

test("optional image generation failure is non-blocking when the slide remains understandable", async () => {
  const runRoot = tmpRunRoot();
  writeMinimalBuildContract(runRoot, {
    prompt: "Restrained process diagram for Q2 rollout",
    fallback: "shapes",
    required_for_comprehension: false
  });

  const result = await buildDeckFromHandoff({
    handoffPath: path.join(runRoot, "artifacts", "pptx-handoff.json"),
    generateImage: async () => {
      throw new Error("provider failure");
    }
  });

  assert.equal(result.partial, true);
  assert.equal(result.partialSummary.failures[0].fallback, "shapes");
  assert.match(result.partialSummary.failures[0].reason, /provider failure/i);
});

test("image generation failure becomes blocking when the slide is not understandable without it", async () => {
  const runRoot = tmpRunRoot();
  writeMinimalBuildContract(runRoot, {
    prompt: "Annotated operating model graphic for Q2 rollout",
    fallback: "none",
    required_for_comprehension: true
  });

  await assert.rejects(
    () =>
      buildDeckFromHandoff({
        handoffPath: path.join(runRoot, "artifacts", "pptx-handoff.json"),
        generateImage: async () => {
          throw new Error("provider failure");
        }
      }),
    /not understandable without required visual support/i
  );
});
