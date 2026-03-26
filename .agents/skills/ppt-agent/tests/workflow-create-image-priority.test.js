"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { buildDeckFromHandoff } = require("../scripts/lib/build-pptx-from-handoff");

function tmpRunRoot() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ppt-agent-create-visual-"));
  fs.mkdirSync(path.join(dir, "artifacts"), { recursive: true });
  return dir;
}

function writeContract(runRoot, slideSpec) {
  fs.writeFileSync(
    path.join(runRoot, "artifacts", "manuscript.md"),
    [
      "# Q2 Review",
      "",
      `Slide title: ${slideSpec.title}`,
      "- Support line one",
      "- Support line two"
    ].join("\n")
  );
  fs.writeFileSync(path.join(runRoot, "artifacts", "design_plan.md"), "# Design Plan\n");
  fs.writeFileSync(
    path.join(runRoot, "artifacts", "slide-build-spec.json"),
    JSON.stringify(
      {
        phase: "create",
        build_path: "new_deck_generation",
        manuscript_path: "artifacts/manuscript.md",
        design_plan_path: "artifacts/design_plan.md",
        output_pptx_path: "artifacts/output.pptx",
        slides: [slideSpec]
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

test("create-mode explainer slides fail without an approved visual path", async () => {
  const runRoot = tmpRunRoot();
  writeContract(runRoot, {
    slide_number: 1,
    title: "Hiring Plan",
    role: "content",
    layout: "process_flow",
    visual_role: "process",
    image_strategy: "generate_new",
    required_visual: {
      prompt: "Hiring process diagram",
      required_for_comprehension: true
    }
  });

  await assert.rejects(
    () => buildDeckFromHandoff({ handoffPath: path.join(runRoot, "artifacts", "pptx-handoff.json") }),
    /requires a visual path/i
  );
});

test("create-mode agenda slides do not require generated imagery", async () => {
  const runRoot = tmpRunRoot();
  writeContract(runRoot, {
    slide_number: 1,
    title: "Agenda",
    role: "content",
    layout: "title_hero",
    visual_role: "agenda",
    image_strategy: "forbid"
  });

  const result = await buildDeckFromHandoff({
    handoffPath: path.join(runRoot, "artifacts", "pptx-handoff.json"),
    createDeck: async (payload) => {
      fs.writeFileSync(payload.outputPath, "pptx");
      return { outputPath: payload.outputPath, slideCount: 1, designSummary: {} };
    },
    renderSlides: async () => ({
      renderDir: path.join(runRoot, "renders"),
      renderCount: 1,
      mode: "stub"
    })
  });

  assert.equal(result.outputPath, path.join(runRoot, "artifacts", "output.pptx"));
});

test("create-mode process slides block when the default visual contract is unmet", async () => {
  const runRoot = tmpRunRoot();
  writeContract(runRoot, {
    slide_number: 1,
    title: "Delivery Process",
    role: "content",
    layout: "process_flow",
    visual_role: "process",
    image_strategy: "generate_new"
  });

  await assert.rejects(
    () => buildDeckFromHandoff({ handoffPath: path.join(runRoot, "artifacts", "pptx-handoff.json") }),
    /requires a visual path|not understandable without required visual support/i
  );
});

test("create-mode text-safe slides can fall back without generator output", async () => {
  const runRoot = tmpRunRoot();
  writeContract(runRoot, {
    slide_number: 1,
    title: "Executive Summary",
    role: "content",
    layout: "title_hero",
    visual_role: "hero",
    image_strategy: "generate_new",
    text_safe: true
  });

  const result = await buildDeckFromHandoff({
    handoffPath: path.join(runRoot, "artifacts", "pptx-handoff.json"),
    createDeck: async (payload) => {
      fs.writeFileSync(payload.outputPath, "pptx");
      return { outputPath: payload.outputPath, slideCount: 1, designSummary: {} };
    },
    renderSlides: async () => ({
      renderDir: path.join(runRoot, "renders"),
      renderCount: 1,
      mode: "stub"
    })
  });

  assert.equal(result.outputPath, path.join(runRoot, "artifacts", "output.pptx"));
});
