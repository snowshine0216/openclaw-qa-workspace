"use strict";

const { COMPOSITION_FAMILY } = require("./shared-constants");

const DEFAULT_DESIGN_TOKENS = Object.freeze({
  accent_color: "#FA6611",
  body_background: "#FFFFFF",
  title_background: "#1F1F1F",
  font_face_sans: "Aptos",
  font_face_serif: "Aptos"
});

// Maps composition_family values to structured layout names understood by the renderer.
// Falls back to "two_column" for unrecognized families.
const LAYOUT_MAP = {
  [COMPOSITION_FAMILY.COMPARISON_MATRIX]: "comparison_matrix",
  [COMPOSITION_FAMILY.PROCESS_FLOW]: "process_flow",
  [COMPOSITION_FAMILY.TABLE_SUMMARY]: "data_panel",
  [COMPOSITION_FAMILY.EVIDENCE_PANEL]: "two_column",
  [COMPOSITION_FAMILY.TITLE_HERO]: "title_hero",
  [COMPOSITION_FAMILY.SECTION_DIVIDER]: "section_divider",
  [COMPOSITION_FAMILY.CHECKLIST_CARDS]: "decision_grid",
  [COMPOSITION_FAMILY.QA_TWO_COLUMN]: "two_column",
  [COMPOSITION_FAMILY.TEXT_STATEMENT]: "two_column",
  [COMPOSITION_FAMILY.CLOSING_STATEMENT]: "section_divider"
};

/**
 * Convert a canonical slide brief to a normalized structured slide spec
 * with layout, content, and design tokens.
 *
 * @param {Object} slideBrief - Canonical slide brief
 * @param {Object|null} themeSnapshot - Source theme snapshot or null for defaults
 * @returns {Object} Normalized structured slide spec
 */
function buildStructuredSlideSpec(slideBrief, themeSnapshot) {
  if (!slideBrief || !("slide_number" in slideBrief)) {
    throw new Error("slideBrief must include slide_number");
  }
  if (!slideBrief.title) {
    throw new Error("slideBrief must include title");
  }

  const layout = LAYOUT_MAP[slideBrief.composition_family] || "two_column";

  const bodyLines = Array.isArray(slideBrief.on_slide_copy)
    ? slideBrief.on_slide_copy
    : [slideBrief.on_slide_copy || ""].filter(Boolean);

  const imagePaths = slideBrief.primary_visual_anchor?.artifact_path
    ? [slideBrief.primary_visual_anchor.artifact_path]
    : [];

  return {
    slide_number: slideBrief.slide_number,
    layout,
    content: {
      title: slideBrief.title,
      body_lines: bodyLines,
      image_paths: imagePaths
    },
    design_tokens: resolveDesignTokens(themeSnapshot),
    source_brief: { ...slideBrief }
  };
}

function resolveDesignTokens(themeSnapshot) {
  if (!themeSnapshot) {
    return { ...DEFAULT_DESIGN_TOKENS };
  }

  const fontTokens = themeSnapshot.font_tokens || {};
  const colorTokens = themeSnapshot.color_tokens || {};
  const surfaceTokens = themeSnapshot.surface_tokens || {};

  return {
    accent_color: colorTokens.accent ?? DEFAULT_DESIGN_TOKENS.accent_color,
    body_background: surfaceTokens.body_background ?? DEFAULT_DESIGN_TOKENS.body_background,
    title_background: surfaceTokens.title_background ?? DEFAULT_DESIGN_TOKENS.title_background,
    font_face_sans: fontTokens.sans ?? DEFAULT_DESIGN_TOKENS.font_face_sans,
    font_face_serif: fontTokens.serif ?? fontTokens.sans ?? DEFAULT_DESIGN_TOKENS.font_face_serif
  };
}

module.exports = { buildStructuredSlideSpec };
