"use strict";

// Integration tests: complex edit routes to structured rebuild instead of
// placeholder text replacement.
//
// The contract: determineRenderStrategy routes slides with complex composition
// families (evidence_panel, comparison_matrix, process_flow, table_summary,
// qa_two_column) or complex primary_visual_anchor kinds (chart, table, diagram,
// metric_panel) to STRUCTURED_REBUILD rather than LIGHT_EDIT.

const test = require("node:test");
const assert = require("node:assert/strict");

const { determineRenderStrategy } = require("../scripts/lib/pptx-edit-ops");
const {
  RENDER_STRATEGY,
  COMPOSITION_FAMILY,
  PRIMARY_VISUAL_ANCHOR_KIND
} = require("../scripts/lib/shared-constants");

// Helper to build a minimal slide brief
function makeBrief({ compositionFamily, anchorKind = null, onSlideCopy = "" }) {
  return {
    composition_family: compositionFamily,
    primary_visual_anchor: anchorKind ? { kind: anchorKind } : null,
    on_slide_copy: onSlideCopy
  };
}

test("determineRenderStrategy routes evidence_panel to structured_rebuild", () => {
  const result = determineRenderStrategy({
    action: "revise",
    slideBrief: makeBrief({ compositionFamily: COMPOSITION_FAMILY.EVIDENCE_PANEL }),
    seedLayout: null,
    allowedLayoutDelta: 9999
  });

  assert.equal(result.strategy, RENDER_STRATEGY.STRUCTURED_REBUILD);
  assert.ok(result.reason, "reason must be provided");
});

test("determineRenderStrategy routes comparison_matrix to structured_rebuild", () => {
  const result = determineRenderStrategy({
    action: "revise",
    slideBrief: makeBrief({ compositionFamily: COMPOSITION_FAMILY.COMPARISON_MATRIX }),
    seedLayout: null,
    allowedLayoutDelta: 9999
  });

  assert.equal(result.strategy, RENDER_STRATEGY.STRUCTURED_REBUILD);
});

test("determineRenderStrategy routes process_flow to structured_rebuild", () => {
  const result = determineRenderStrategy({
    action: "revise",
    slideBrief: makeBrief({ compositionFamily: COMPOSITION_FAMILY.PROCESS_FLOW }),
    seedLayout: null,
    allowedLayoutDelta: 9999
  });

  assert.equal(result.strategy, RENDER_STRATEGY.STRUCTURED_REBUILD);
});

test("determineRenderStrategy routes table_summary to structured_rebuild", () => {
  const result = determineRenderStrategy({
    action: "revise",
    slideBrief: makeBrief({ compositionFamily: COMPOSITION_FAMILY.TABLE_SUMMARY }),
    seedLayout: null,
    allowedLayoutDelta: 9999
  });

  assert.equal(result.strategy, RENDER_STRATEGY.STRUCTURED_REBUILD);
});

test("determineRenderStrategy routes qa_two_column to structured_rebuild", () => {
  const result = determineRenderStrategy({
    action: "revise",
    slideBrief: makeBrief({ compositionFamily: COMPOSITION_FAMILY.QA_TWO_COLUMN }),
    seedLayout: null,
    allowedLayoutDelta: 9999
  });

  assert.equal(result.strategy, RENDER_STRATEGY.STRUCTURED_REBUILD);
});

test("determineRenderStrategy routes chart anchor kind to structured_rebuild regardless of family", () => {
  const result = determineRenderStrategy({
    action: "revise",
    slideBrief: makeBrief({
      compositionFamily: COMPOSITION_FAMILY.TEXT_STATEMENT,
      anchorKind: PRIMARY_VISUAL_ANCHOR_KIND.CHART
    }),
    seedLayout: null,
    allowedLayoutDelta: 9999
  });

  assert.equal(result.strategy, RENDER_STRATEGY.STRUCTURED_REBUILD);
});

test("determineRenderStrategy routes table anchor kind to structured_rebuild", () => {
  const result = determineRenderStrategy({
    action: "revise",
    slideBrief: makeBrief({
      compositionFamily: COMPOSITION_FAMILY.TEXT_STATEMENT,
      anchorKind: PRIMARY_VISUAL_ANCHOR_KIND.TABLE
    }),
    seedLayout: null,
    allowedLayoutDelta: 9999
  });

  assert.equal(result.strategy, RENDER_STRATEGY.STRUCTURED_REBUILD);
});

test("determineRenderStrategy routes diagram anchor kind to structured_rebuild", () => {
  const result = determineRenderStrategy({
    action: "revise",
    slideBrief: makeBrief({
      compositionFamily: COMPOSITION_FAMILY.TEXT_STATEMENT,
      anchorKind: PRIMARY_VISUAL_ANCHOR_KIND.DIAGRAM
    }),
    seedLayout: null,
    allowedLayoutDelta: 9999
  });

  assert.equal(result.strategy, RENDER_STRATEGY.STRUCTURED_REBUILD);
});

test("determineRenderStrategy routes add_after with mismatched seed layout to structured_rebuild", () => {
  const result = determineRenderStrategy({
    action: "add_after",
    slideBrief: makeBrief({ compositionFamily: COMPOSITION_FAMILY.EVIDENCE_PANEL }),
    seedLayout: { family: COMPOSITION_FAMILY.TEXT_STATEMENT },  // Mismatched family
    allowedLayoutDelta: 9999
  });

  assert.equal(result.strategy, RENDER_STRATEGY.STRUCTURED_REBUILD);
});

test("determineRenderStrategy allows light_edit for simple text_statement with no complex anchor", () => {
  const result = determineRenderStrategy({
    action: "revise",
    slideBrief: makeBrief({
      compositionFamily: COMPOSITION_FAMILY.TEXT_STATEMENT,
      anchorKind: null,
      onSlideCopy: "Short text"
    }),
    seedLayout: null,
    allowedLayoutDelta: 9999
  });

  assert.equal(result.strategy, RENDER_STRATEGY.LIGHT_EDIT);
});

test("determineRenderStrategy routes to structured_rebuild when text exceeds allowed_layout_delta", () => {
  const longText = "A".repeat(200);

  const result = determineRenderStrategy({
    action: "revise",
    slideBrief: makeBrief({
      compositionFamily: COMPOSITION_FAMILY.TEXT_STATEMENT,
      anchorKind: null,
      onSlideCopy: longText
    }),
    seedLayout: null,
    allowedLayoutDelta: 100  // Text (200 chars) exceeds delta
  });

  assert.equal(result.strategy, RENDER_STRATEGY.STRUCTURED_REBUILD);
  assert.ok(/allowed_layout_delta|expansion/i.test(result.reason));
});

test("determineRenderStrategy allows light_edit for section_divider", () => {
  const result = determineRenderStrategy({
    action: "revise",
    slideBrief: makeBrief({ compositionFamily: COMPOSITION_FAMILY.SECTION_DIVIDER }),
    seedLayout: null,
    allowedLayoutDelta: 9999
  });

  assert.equal(result.strategy, RENDER_STRATEGY.LIGHT_EDIT);
});

test("determineRenderStrategy allows light_edit for closing_statement", () => {
  const result = determineRenderStrategy({
    action: "revise",
    slideBrief: makeBrief({ compositionFamily: COMPOSITION_FAMILY.CLOSING_STATEMENT }),
    seedLayout: null,
    allowedLayoutDelta: 9999
  });

  assert.equal(result.strategy, RENDER_STRATEGY.LIGHT_EDIT);
});

// Plain-text origin tests: source slide has no visual anchor (primary_visual_anchor: null).
// The intended composition_family in the brief determines routing directly.

test("plain-text source routes to structured_rebuild for checklist_cards", () => {
  const result = determineRenderStrategy({
    action: "revise",
    slideBrief: makeBrief({ compositionFamily: COMPOSITION_FAMILY.CHECKLIST_CARDS, anchorKind: null }),
    seedLayout: null,
    allowedLayoutDelta: 9999
  });

  assert.equal(result.strategy, RENDER_STRATEGY.STRUCTURED_REBUILD);
  assert.ok(result.reason, "reason must be provided");
});

test("plain-text source routes to structured_rebuild for title_hero", () => {
  const result = determineRenderStrategy({
    action: "revise",
    slideBrief: makeBrief({ compositionFamily: COMPOSITION_FAMILY.TITLE_HERO, anchorKind: null }),
    seedLayout: null,
    allowedLayoutDelta: 9999
  });

  assert.equal(result.strategy, RENDER_STRATEGY.STRUCTURED_REBUILD);
  assert.ok(result.reason, "reason must be provided");
});

test("plain-text source routes to structured_rebuild for evidence_panel (regression)", () => {
  const result = determineRenderStrategy({
    action: "revise",
    slideBrief: makeBrief({ compositionFamily: COMPOSITION_FAMILY.EVIDENCE_PANEL, anchorKind: null }),
    seedLayout: null,
    allowedLayoutDelta: 9999
  });

  assert.equal(result.strategy, RENDER_STRATEGY.STRUCTURED_REBUILD);
});

test("plain-text source stays light_edit for text_statement (must not over-route)", () => {
  const result = determineRenderStrategy({
    action: "revise",
    slideBrief: makeBrief({ compositionFamily: COMPOSITION_FAMILY.TEXT_STATEMENT, anchorKind: null }),
    seedLayout: null,
    allowedLayoutDelta: 9999
  });

  assert.equal(result.strategy, RENDER_STRATEGY.LIGHT_EDIT);
});
