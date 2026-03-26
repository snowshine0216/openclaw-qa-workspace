"use strict";

const fs = require("fs");
const path = require("path");
const { buildRuntimeContract } = require("./runtime-contract");

const PPTX_SKILL_DIR = path.resolve(__dirname, "..", "..", "..", "pptx");

function buildPptxHandoff({ slideBuildSpec, slideBuildSpecPath }) {
  if (!slideBuildSpec || !slideBuildSpecPath) {
    throw new Error("slideBuildSpec and slideBuildSpecPath are required");
  }

  return {
    handoff_type: "pptx_new_deck_generation",
    phase: "create",
    ...buildRuntimeContract(slideBuildSpec.reasoning_context),
    layout: "LAYOUT_16x9",
    build_path: slideBuildSpec.build_path,
    reference_strategy: slideBuildSpec.reference_strategy,
    template_editing_mode: false,
    manuscript_path: slideBuildSpec.manuscript_path,
    design_plan_path: slideBuildSpec.design_plan_path,
    slide_build_spec_path: slideBuildSpecPath,
    output_pptx_path: slideBuildSpec.output_pptx_path,
    pptx_skill: {
      skill_md: path.join(PPTX_SKILL_DIR, "SKILL.md"),
      pptxgenjs_guide: path.join(PPTX_SKILL_DIR, "pptxgenjs.md")
    },
    invariants: [
      "Generate a new deck through pptx rather than editing a reference deck in place.",
      "Use 16:9 as the default layout target.",
      "Keep the business style contract intact: minimal text, analytical visuals first, #FA6611 accent.",
      "Treat reference decks as advisory style/structure inputs only."
    ]
  };
}

function writePptxHandoff({ runRoot, slideBuildSpec, slideBuildSpecPath }) {
  if (!runRoot) {
    throw new Error("runRoot is required");
  }

  const handoff = buildPptxHandoff({ slideBuildSpec, slideBuildSpecPath });
  const handoffPath = path.join(runRoot, "artifacts", "pptx-handoff.json");
  fs.writeFileSync(handoffPath, JSON.stringify(handoff, null, 2));
  return { handoffPath, handoff };
}

module.exports = {
  buildPptxHandoff,
  writePptxHandoff
};
