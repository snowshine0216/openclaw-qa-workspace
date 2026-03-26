"use strict";

const fs = require("fs");
const path = require("path");

const {
  COMPOSITION_FAMILY,
  PRIMARY_VISUAL_ANCHOR_KIND,
  FALLBACK_ORDER,
  validateVisualPlan
} = require("./shared-constants");

/**
 * Derive visual-plan.json summary from finalized slide briefs.
 * This module does NOT mutate slide briefs in place.
 * It only reads finalized briefs and generates a derived summary.
 */

/**
 * Extract layout regions from composition family and component list
 */
function deriveLayoutRegions(compositionFamily, componentList) {
  const regions = [];

  switch (compositionFamily) {
    case COMPOSITION_FAMILY.TITLE_HERO:
      regions.push("hero_title", "subtitle");
      break;
    case COMPOSITION_FAMILY.SECTION_DIVIDER:
      regions.push("section_title");
      break;
    case COMPOSITION_FAMILY.EVIDENCE_PANEL:
      regions.push("title", "visual_anchor", "interpretation");
      break;
    case COMPOSITION_FAMILY.COMPARISON_MATRIX:
      regions.push("title", "column_left", "column_right", "conclusion");
      break;
    case COMPOSITION_FAMILY.PROCESS_FLOW:
      regions.push("title", "process_nodes", "detail");
      break;
    case COMPOSITION_FAMILY.CHECKLIST_CARDS:
      regions.push("title", "card_grid");
      break;
    case COMPOSITION_FAMILY.QA_TWO_COLUMN:
      regions.push("title", "question_column", "answer_column");
      break;
    case COMPOSITION_FAMILY.TABLE_SUMMARY:
      regions.push("title", "table", "takeaway_box");
      break;
    case COMPOSITION_FAMILY.TEXT_STATEMENT:
      regions.push("title", "statement");
      break;
    case COMPOSITION_FAMILY.CLOSING_STATEMENT:
      regions.push("close_title", "supporting_line");
      break;
    default:
      regions.push("title", "body");
  }

  return regions;
}

/**
 * Derive secondary support elements from component list
 */
function deriveSecondarySupport(componentList, primaryAnchorKind) {
  const support = [];

  if (componentList.includes("body_text")) {
    support.push("body_text");
  }
  if (componentList.includes("footnote")) {
    support.push("footnote");
  }
  if (componentList.includes("metric_panel") && primaryAnchorKind !== PRIMARY_VISUAL_ANCHOR_KIND.METRIC_PANEL) {
    support.push("metric_panel");
  }

  return support;
}

/**
 * Generate visual plan summary from finalized slide briefs
 */
function generateVisualPlanFromBriefs({ runRoot, slideBriefs }) {
  const visualPlan = slideBriefs.map((brief) => {
    const layoutRegions = deriveLayoutRegions(brief.composition_family, brief.component_list);
    const secondarySupport = deriveSecondarySupport(
      brief.component_list,
      brief.primary_visual_anchor?.kind
    );

    return {
      slide_number: brief.slide_number,
      composition_family: brief.composition_family,
      component_list: brief.component_list,
      primary_visual_anchor: brief.primary_visual_anchor,
      secondary_support: secondarySupport,
      layout_regions: layoutRegions,
      image_prompt_path: brief.primary_visual_anchor?.kind === PRIMARY_VISUAL_ANCHOR_KIND.GENERATED_IMAGE
        ? `artifacts/image-prompts/slide-${String(brief.slide_number).padStart(2, "0")}.md`
        : null,
      render_strategy: brief.render_strategy,
      text_only_exception: brief.text_only_exception
    };
  });

  validateVisualPlan(visualPlan);

  const outputPath = path.join(runRoot, "artifacts", "visual-plan.json");
  fs.writeFileSync(outputPath, JSON.stringify(visualPlan, null, 2));

  return {
    visualPlanPath: outputPath,
    slideCount: visualPlan.length
  };
}

module.exports = {
  generateVisualPlanFromBriefs,
  deriveLayoutRegions,
  deriveSecondarySupport
};
