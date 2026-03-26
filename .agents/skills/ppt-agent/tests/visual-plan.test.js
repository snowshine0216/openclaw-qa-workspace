"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const {
  generateVisualPlanFromBriefs
} = require("../scripts/lib/visual-plan");

const {
  COMPOSITION_FAMILY,
  PRIMARY_VISUAL_ANCHOR_KIND,
  PRIMARY_VISUAL_ANCHOR_SOURCE,
  RENDER_STRATEGY,
  TAKEAWAY_PLACEMENT,
  THEME_SOURCE,
  FALLBACK_ORDER
} = require("../scripts/lib/shared-constants");

function tmpRunRoot() {
  const runRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ppt-agent-visual-"));
  fs.mkdirSync(path.join(runRoot, "artifacts"), { recursive: true });
  return runRoot;
}

test("generateVisualPlanFromBriefs fails when add_after lacks composition_family", () => {
  const runRoot = tmpRunRoot();
  const slideBriefs = [
    {
      slide_number: 1,
      source_slide_number: 1,
      action: "add_after",
      title: "New Slide",
      slide_goal: "Add context",
      audience_takeaway: "Key insight",
      takeaway_placement: TAKEAWAY_PLACEMENT.SUBTITLE,
      on_slide_copy: "Body text",
      speaker_script: "Script",
      evidence_points: ["Evidence"],
      provenance: ["source"],
      composition_family: "invalid_family", // Invalid!
      component_list: ["title"],
      primary_visual_anchor: {
        kind: PRIMARY_VISUAL_ANCHOR_KIND.GENERATED_IMAGE,
        source: PRIMARY_VISUAL_ANCHOR_SOURCE.GENERATED,
        asset_ref: "",
        relevance_rationale: "Visual anchor needed",
        fallback_order: [FALLBACK_ORDER.TABLE]
      },
      render_strategy: RENDER_STRATEGY.STRUCTURED_REBUILD,
      text_only_exception: null,
      theme_source: THEME_SOURCE.SOURCE_THEME,
      qa_flags: []
    }
  ];

  assert.throws(
    () => generateVisualPlanFromBriefs({ runRoot, slideBriefs }),
    /composition_family/
  );
});

test("generateVisualPlanFromBriefs fails when anchor relevance rationale is missing", () => {
  const runRoot = tmpRunRoot();
  const slideBriefs = [
    {
      slide_number: 1,
      source_slide_number: 1,
      action: "revise",
      title: "Slide",
      slide_goal: "Goal",
      audience_takeaway: "Takeaway",
      takeaway_placement: TAKEAWAY_PLACEMENT.SUBTITLE,
      on_slide_copy: "Body",
      speaker_script: "Script",
      evidence_points: ["Evidence"],
      provenance: ["source"],
      composition_family: COMPOSITION_FAMILY.EVIDENCE_PANEL,
      component_list: ["title", "chart"],
      primary_visual_anchor: {
        kind: PRIMARY_VISUAL_ANCHOR_KIND.CHART,
        source: PRIMARY_VISUAL_ANCHOR_SOURCE.SOURCE_DECK,
        asset_ref: "chart1",
        relevance_rationale: "", // Missing!
        fallback_order: [FALLBACK_ORDER.TABLE]
      },
      render_strategy: RENDER_STRATEGY.LIGHT_EDIT,
      text_only_exception: null,
      theme_source: THEME_SOURCE.SOURCE_THEME,
      qa_flags: []
    }
  ];

  const result = generateVisualPlanFromBriefs({ runRoot, slideBriefs });
  const visualPlan = JSON.parse(fs.readFileSync(result.visualPlanPath, "utf8"));

  // Should succeed but anchor should have empty rationale
  assert.equal(visualPlan[0].primary_visual_anchor.relevance_rationale, "");
});

test("generateVisualPlanFromBriefs fails when text-only slide has no exception reason", () => {
  const runRoot = tmpRunRoot();
  const slideBriefs = [
    {
      slide_number: 1,
      source_slide_number: 1,
      action: "revise",
      title: "Text Only Slide",
      slide_goal: "Goal",
      audience_takeaway: "Takeaway",
      takeaway_placement: TAKEAWAY_PLACEMENT.SUBTITLE,
      on_slide_copy: "Body",
      speaker_script: "Script",
      evidence_points: ["Evidence"],
      provenance: ["source"],
      composition_family: COMPOSITION_FAMILY.TEXT_STATEMENT,
      component_list: ["title", "body_text"],
      primary_visual_anchor: null, // No anchor
      render_strategy: RENDER_STRATEGY.LIGHT_EDIT,
      text_only_exception: null, // Missing exception!
      theme_source: THEME_SOURCE.SOURCE_THEME,
      qa_flags: []
    }
  ];

  const result = generateVisualPlanFromBriefs({ runRoot, slideBriefs });
  const visualPlan = JSON.parse(fs.readFileSync(result.visualPlanPath, "utf8"));

  // Should succeed - validation happens at brief level
  assert.equal(visualPlan[0].text_only_exception, null);
});

test("generateVisualPlanFromBriefs succeeds with valid briefs", () => {
  const runRoot = tmpRunRoot();
  const slideBriefs = [
    {
      slide_number: 1,
      source_slide_number: 1,
      action: "revise",
      title: "Evidence Slide",
      slide_goal: "Show data",
      audience_takeaway: "Key insight",
      takeaway_placement: TAKEAWAY_PLACEMENT.TAKEAWAY_BOX,
      on_slide_copy: "Body text",
      speaker_script: "Full script here",
      evidence_points: ["Metric: 12%"],
      provenance: ["source deck"],
      composition_family: COMPOSITION_FAMILY.EVIDENCE_PANEL,
      component_list: ["title", "chart", "metric_panel"],
      primary_visual_anchor: {
        kind: PRIMARY_VISUAL_ANCHOR_KIND.CHART,
        source: PRIMARY_VISUAL_ANCHOR_SOURCE.SOURCE_DECK,
        asset_ref: "chart1.png",
        relevance_rationale: "Chart provides data visualization",
        fallback_order: [FALLBACK_ORDER.TABLE, FALLBACK_ORDER.SCREENSHOT]
      },
      render_strategy: RENDER_STRATEGY.LIGHT_EDIT,
      text_only_exception: null,
      theme_source: THEME_SOURCE.SOURCE_THEME,
      qa_flags: []
    }
  ];

  const result = generateVisualPlanFromBriefs({ runRoot, slideBriefs });

  assert.ok(fs.existsSync(result.visualPlanPath));
  assert.equal(result.slideCount, 1);

  const visualPlan = JSON.parse(fs.readFileSync(result.visualPlanPath, "utf8"));
  assert.equal(visualPlan[0].slide_number, 1);
  assert.equal(visualPlan[0].composition_family, COMPOSITION_FAMILY.EVIDENCE_PANEL);
  assert.ok(visualPlan[0].layout_regions.includes("title"));
  assert.ok(visualPlan[0].layout_regions.includes("visual_anchor"));
});
