"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  validateUpdatePlanObject
} = require("../scripts/lib/update-plan");

function validPlan() {
  return {
    deck_strategy: {
      preserve_narrative_spine: true,
      restyle_mode: "none",
      global_tightening: []
    },
    slide_actions: [
      {
        slide_number: 3,
        action: "revise",
        reason: "refresh stale metrics",
        content_inputs: ["artifacts/research_delta.md#march-revenue"],
        preserve: ["orange highlight treatment"],
        visual_role: "evidence",
        image_strategy: "preserve",
        image_rationale: "Existing chart should remain the visual anchor.",
        layout_strategy: "preserve",
        allowed_layout_delta: "tighten_only",
        allowed_image_delta: "none",
        transcript_path: "artifacts/slide-transcripts/slide-03.md",
        source_slide_number: 3,
        source_layout_anchor: {
          title_box: "shape:sp3"
        },
        source_media_refs: [
          {
            relationship_id: "rId5",
            target: "ppt/media/image3.png",
            content_hash: "sha256:abc"
          }
        ],
        edit_scope: {
          text: true,
          chart: true,
          images: false,
          structure: false
        },
        drift_risk: "low"
      }
    ]
  };
}

test("validateUpdatePlanObject accepts a deterministic plan", () => {
  const result = validateUpdatePlanObject(validPlan());
  assert.equal(result.slide_actions[0].action, "revise");
});

test("validateUpdatePlanObject rejects add_after without layout seed", () => {
  const plan = validPlan();
  plan.slide_actions = [
    {
      slide_number: 4,
      action: "add_after",
      reason: "new hiring plan",
      preserve: ["title hierarchy"],
      visual_role: "explainer",
      image_strategy: "generate_new",
      image_rationale: "The new slide needs a fresh visual anchor.",
      layout_strategy: "preserve_seed",
      allowed_layout_delta: "duplicate_seed_adjustment_only",
      allowed_image_delta: "new_asset_only",
      transcript_path: "artifacts/slide-transcripts/slide-04.md",
      source_slide_number: 3,
      source_layout_anchor: {},
      source_media_refs: [],
      drift_risk: "medium"
    }
  ];

  assert.throws(() => validateUpdatePlanObject(plan), /layout_seed/i);
});

test("validateUpdatePlanObject rejects keep actions with edit scope", () => {
  const plan = validPlan();
  plan.slide_actions = [
    {
      slide_number: 2,
      action: "keep",
      reason: "no change needed",
      preserve: ["existing layout"],
      edit_scope: { text: true }
    }
  ];

  assert.throws(() => validateUpdatePlanObject(plan), /keep.*edit scope/i);
});

test("validateUpdatePlanObject rejects non-keep actions without preserve tokens", () => {
  const plan = validPlan();
  plan.slide_actions[0].preserve = [];

  assert.throws(() => validateUpdatePlanObject(plan), /preserve/i);
});

test("validateUpdatePlanObject rejects agenda slides that request generated imagery", () => {
  const plan = validPlan();
  plan.slide_actions[0].visual_role = "agenda";
  plan.slide_actions[0].image_strategy = "generate_new";

  assert.throws(() => validateUpdatePlanObject(plan), /agenda/i);
});

test("validateUpdatePlanObject rejects non-new actions without concrete source anchors", () => {
  const plan = validPlan();
  plan.slide_actions[0].source_layout_anchor = {};

  assert.throws(() => validateUpdatePlanObject(plan), /source_layout_anchor/i);
});
