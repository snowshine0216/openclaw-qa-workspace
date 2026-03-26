"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  validateSlideBrief
} = require("../scripts/lib/shared-constants");

const {
  COMPOSITION_FAMILY,
  PRIMARY_VISUAL_ANCHOR_KIND,
  PRIMARY_VISUAL_ANCHOR_SOURCE,
  RENDER_STRATEGY,
  TAKEAWAY_PLACEMENT,
  THEME_SOURCE,
  FALLBACK_ORDER
} = require("../scripts/lib/shared-constants");

test("validateSlideBrief verifies structured slide spec is derived from canonical slide brief", () => {
  const slideBrief = {
    slide_number: 3,
    source_slide_number: 2,
    action: "add_after",
    title: "Market Expansion Strategy",
    slide_goal: "Present geographic growth plan",
    audience_takeaway: "Three new markets launching Q2",
    takeaway_placement: TAKEAWAY_PLACEMENT.TAKEAWAY_BOX,
    on_slide_copy: "EMEA: Q2\nAPAC: Q3\nLATAM: Q4",
    speaker_script: "Our expansion strategy focuses on three high-growth regions. EMEA launches in Q2 with established partnerships. APAC follows in Q3 leveraging our Singapore hub. LATAM rounds out the year in Q4.",
    evidence_points: ["EMEA partnership signed", "Singapore hub operational", "LATAM regulatory approval pending"],
    provenance: ["research_delta.md", "user attachments"],
    composition_family: COMPOSITION_FAMILY.PROCESS_FLOW,
    component_list: ["title", "process_nodes", "body_text"],
    primary_visual_anchor: {
      kind: PRIMARY_VISUAL_ANCHOR_KIND.PROCESS_FLOW,
      source: PRIMARY_VISUAL_ANCHOR_SOURCE.STRUCTURED_RENDER,
      asset_ref: "three_stage_timeline",
      relevance_rationale: "Timeline visualizes sequential market entry strategy",
      fallback_order: [FALLBACK_ORDER.TABLE, FALLBACK_ORDER.COMPARISON_LAYOUT]
    },
    render_strategy: RENDER_STRATEGY.STRUCTURED_REBUILD,
    text_only_exception: null,
    theme_source: THEME_SOURCE.SOURCE_THEME,
    qa_flags: []
  };

  // Should not throw
  const validated = validateSlideBrief(slideBrief);

  assert.equal(validated.slide_number, 3);
  assert.equal(validated.composition_family, COMPOSITION_FAMILY.PROCESS_FLOW);
  assert.equal(validated.render_strategy, RENDER_STRATEGY.STRUCTURED_REBUILD);
  assert.ok(validated.speaker_script.length > 100);
  assert.ok(validated.evidence_points.length > 0);
});

test("validateSlideBrief rejects briefs missing required fields", () => {
  const incompleteBrief = {
    slide_number: 1,
    title: "Incomplete Slide",
    // Missing many required fields
  };

  assert.throws(
    () => validateSlideBrief(incompleteBrief),
    /Missing required field/
  );
});

test("validateSlideBrief accepts minimal keep action brief", () => {
  const keepBrief = {
    slide_number: 2,
    source_slide_number: 2,
    action: "keep",
    title: "Unchanged Slide",
    slide_goal: "Preserve existing content",
    audience_takeaway: "No changes",
    takeaway_placement: TAKEAWAY_PLACEMENT.NOTES_ONLY,
    on_slide_copy: "Existing body text",
    speaker_script: "",
    evidence_points: [],
    provenance: ["source deck"],
    composition_family: COMPOSITION_FAMILY.TEXT_STATEMENT,
    component_list: ["title", "body_text"],
    primary_visual_anchor: null,
    render_strategy: RENDER_STRATEGY.PRESERVE_ONLY,
    text_only_exception: null,
    theme_source: THEME_SOURCE.SOURCE_THEME,
    qa_flags: []
  };

  const validated = validateSlideBrief(keepBrief);
  assert.equal(validated.action, "keep");
  assert.equal(validated.render_strategy, RENDER_STRATEGY.PRESERVE_ONLY);
});
