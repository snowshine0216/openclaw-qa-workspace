"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const { buildStructuredSlideSpec } = require("../scripts/lib/structured-slide-spec");

const {
  validateSlideBrief,
  COMPOSITION_FAMILY,
  PRIMARY_VISUAL_ANCHOR_KIND,
  PRIMARY_VISUAL_ANCHOR_SOURCE,
  RENDER_STRATEGY,
  TAKEAWAY_PLACEMENT,
  THEME_SOURCE,
  FALLBACK_ORDER
} = require("../scripts/lib/shared-constants");

// ---------------------------------------------------------------------------
// buildStructuredSlideSpec
// ---------------------------------------------------------------------------

test("buildStructuredSlideSpec converts canonical slide brief to normalized spec with layout, content, and design tokens", () => {
  const slideBrief = {
    slide_number: 3,
    title: "Market Expansion Strategy",
    composition_family: COMPOSITION_FAMILY.PROCESS_FLOW,
    on_slide_copy: ["EMEA: Q2", "APAC: Q3", "LATAM: Q4"]
  };

  const spec = buildStructuredSlideSpec(slideBrief, null);

  assert.equal(spec.slide_number, 3);
  assert.equal(spec.layout, "process_flow");
  assert.equal(spec.content.title, "Market Expansion Strategy");
  assert.deepEqual(spec.content.body_lines, ["EMEA: Q2", "APAC: Q3", "LATAM: Q4"]);
  assert.ok(spec.design_tokens, "design_tokens must be present");
  assert.deepEqual(spec.source_brief, slideBrief);
});

test("buildStructuredSlideSpec maps comparison_matrix family to comparison_matrix layout", () => {
  const spec = buildStructuredSlideSpec(
    { slide_number: 1, title: "Comparison", composition_family: COMPOSITION_FAMILY.COMPARISON_MATRIX },
    null
  );
  assert.equal(spec.layout, "comparison_matrix");
});

test("buildStructuredSlideSpec maps data_panel (table_summary) family", () => {
  const spec = buildStructuredSlideSpec(
    { slide_number: 1, title: "Data", composition_family: COMPOSITION_FAMILY.TABLE_SUMMARY },
    null
  );
  assert.equal(spec.layout, "data_panel");
});

test("buildStructuredSlideSpec maps two_column for evidence_panel", () => {
  const spec = buildStructuredSlideSpec(
    { slide_number: 1, title: "Evidence", composition_family: COMPOSITION_FAMILY.EVIDENCE_PANEL },
    null
  );
  assert.equal(spec.layout, "two_column");
});

test("buildStructuredSlideSpec maps title_hero family", () => {
  const spec = buildStructuredSlideSpec(
    { slide_number: 1, title: "Hero", composition_family: COMPOSITION_FAMILY.TITLE_HERO },
    null
  );
  assert.equal(spec.layout, "title_hero");
});

test("buildStructuredSlideSpec maps section_divider family", () => {
  const spec = buildStructuredSlideSpec(
    { slide_number: 1, title: "Section", composition_family: COMPOSITION_FAMILY.SECTION_DIVIDER },
    null
  );
  assert.equal(spec.layout, "section_divider");
});

test("buildStructuredSlideSpec maps decision_grid for checklist_cards", () => {
  const spec = buildStructuredSlideSpec(
    { slide_number: 1, title: "Checklist", composition_family: COMPOSITION_FAMILY.CHECKLIST_CARDS },
    null
  );
  assert.equal(spec.layout, "decision_grid");
});

test("buildStructuredSlideSpec falls back to two_column for unrecognized layout hints", () => {
  const spec = buildStructuredSlideSpec(
    { slide_number: 1, title: "Unknown", composition_family: "completely_unknown_family" },
    null
  );
  assert.equal(spec.layout, "two_column");
});

test("buildStructuredSlideSpec throws if slideBrief is missing slide_number", () => {
  assert.throws(
    () => buildStructuredSlideSpec({ title: "No Number" }, null),
    /slide_number/
  );
});

test("buildStructuredSlideSpec throws if slideBrief is missing title", () => {
  assert.throws(
    () => buildStructuredSlideSpec({ slide_number: 1 }, null),
    /title/
  );
});

test("buildStructuredSlideSpec applies theme tokens from themeSnapshot when present", () => {
  const themeSnapshot = {
    font_tokens: { sans: "Calibri", serif: "Times New Roman" },
    color_tokens: { accent: "#0070C0" },
    surface_tokens: { body_background: "F0F0F0", title_background: "002060" }
  };

  const spec = buildStructuredSlideSpec(
    { slide_number: 1, title: "Themed", composition_family: COMPOSITION_FAMILY.TEXT_STATEMENT },
    themeSnapshot
  );

  assert.equal(spec.design_tokens.font_face_sans, "Calibri");
  assert.equal(spec.design_tokens.font_face_serif, "Times New Roman");
  assert.equal(spec.design_tokens.accent_color, "#0070C0");
  assert.equal(spec.design_tokens.body_background, "F0F0F0");
});

test("buildStructuredSlideSpec falls back to default design tokens when themeSnapshot is null", () => {
  const spec = buildStructuredSlideSpec(
    { slide_number: 1, title: "Default Tokens", composition_family: COMPOSITION_FAMILY.TEXT_STATEMENT },
    null
  );

  assert.equal(spec.design_tokens.font_face_sans, "Aptos");
  assert.equal(spec.design_tokens.accent_color, "#FA6611");
});

test("buildStructuredSlideSpec falls back to default design tokens when themeSnapshot is unusable", () => {
  const badSnapshot = {}; // Empty snapshot — no font_tokens, color_tokens, etc.

  const spec = buildStructuredSlideSpec(
    { slide_number: 1, title: "Fallback Tokens", composition_family: COMPOSITION_FAMILY.TEXT_STATEMENT },
    badSnapshot
  );

  assert.equal(spec.design_tokens.font_face_sans, "Aptos");
  assert.equal(spec.design_tokens.accent_color, "#FA6611");
});

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
