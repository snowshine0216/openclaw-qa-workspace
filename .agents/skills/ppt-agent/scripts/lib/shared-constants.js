"use strict";

// Frozen enum objects to prevent mutation
const COMPOSITION_FAMILY = Object.freeze({
  TITLE_HERO: "title_hero",
  SECTION_DIVIDER: "section_divider",
  EVIDENCE_PANEL: "evidence_panel",
  COMPARISON_MATRIX: "comparison_matrix",
  PROCESS_FLOW: "process_flow",
  CHECKLIST_CARDS: "checklist_cards",
  QA_TWO_COLUMN: "qa_two_column",
  TABLE_SUMMARY: "table_summary",
  TEXT_STATEMENT: "text_statement",
  CLOSING_STATEMENT: "closing_statement"
});

const PRIMARY_VISUAL_ANCHOR_KIND = Object.freeze({
  EXISTING_MEDIA: "existing_media",
  GENERATED_IMAGE: "generated_image",
  TABLE: "table",
  CHART: "chart",
  DIAGRAM: "diagram",
  SCREENSHOT: "screenshot",
  SHAPE_COMPOSITION: "shape_composition",
  METRIC_PANEL: "metric_panel",
  COMPARISON_LAYOUT: "comparison_layout",
  PROCESS_FLOW: "process_flow"
});

const PRIMARY_VISUAL_ANCHOR_SOURCE = Object.freeze({
  SOURCE_DECK: "source_deck",
  USER_ATTACHMENT: "user_attachment",
  GENERATED: "generated",
  STRUCTURED_RENDER: "structured_render",
  FALLBACK_REFERENCE: "fallback_reference"
});

const TEXT_ONLY_EXCEPTION_REASON = Object.freeze({
  AGENDA: "agenda",
  SECTION_DIVIDER: "section_divider",
  THANK_YOU: "thank_you",
  EXECUTIVE_TAKEAWAY: "executive_takeaway",
  QUOTE: "quote",
  DEFINITION: "definition",
  DECISION: "decision"
});

const QA_FLAGS = Object.freeze({
  MISSING_GROUNDING: "missing_grounding",
  WEAK_ANCHOR_RELEVANCE: "weak_anchor_relevance",
  FALLBACK_USED: "fallback_used",
  THEME_FALLBACK_USED: "theme_fallback_used",
  REQUIRES_MANUAL_REVIEW: "requires_manual_review",
  ACCESSIBILITY_METADATA_MISSING: "accessibility_metadata_missing"
});

const RENDER_STRATEGY = Object.freeze({
  PRESERVE_ONLY: "preserve_only",
  LIGHT_EDIT: "light_edit",
  STRUCTURED_REBUILD: "structured_rebuild"
});

const TAKEAWAY_PLACEMENT = Object.freeze({
  SUBTITLE: "subtitle",
  TAKEAWAY_BOX: "takeaway_box",
  SIDE_CALLOUT: "side_callout",
  FOOTER_CALLOUT: "footer_callout",
  NOTES_ONLY: "notes_only"
});

const THEME_SOURCE = Object.freeze({
  SOURCE_THEME: "source_theme",
  FALLBACK_REFERENCE: "fallback_reference",
  MIXED: "mixed"
});

const FALLBACK_ORDER = Object.freeze({
  TABLE: "table",
  CHART: "chart",
  SCREENSHOT: "screenshot",
  PROCESS_FLOW: "process_flow",
  COMPARISON_LAYOUT: "comparison_layout"
});

// Validation helper
function validateEnum(value, enumObj, name) {
  if (!Object.values(enumObj).includes(value)) {
    throw new Error(`Invalid ${name}: "${value}"`);
  }
  return value;
}

// Individual enum validators
function validateCompositionFamily(value) {
  return validateEnum(value, COMPOSITION_FAMILY, "composition_family");
}

function validatePrimaryVisualAnchorKind(value) {
  return validateEnum(value, PRIMARY_VISUAL_ANCHOR_KIND, "primary_visual_anchor_kind");
}

function validatePrimaryVisualAnchorSource(value) {
  return validateEnum(value, PRIMARY_VISUAL_ANCHOR_SOURCE, "primary_visual_anchor_source");
}

function validateTextOnlyExceptionReason(value) {
  return validateEnum(value, TEXT_ONLY_EXCEPTION_REASON, "text_only_exception_reason");
}

function validateQaFlag(value) {
  return validateEnum(value, QA_FLAGS, "qa_flag");
}

function validateRenderStrategy(value) {
  return validateEnum(value, RENDER_STRATEGY, "render_strategy");
}

function validateTakeawayPlacement(value) {
  return validateEnum(value, TAKEAWAY_PLACEMENT, "takeaway_placement");
}

function validateThemeSource(value) {
  return validateEnum(value, THEME_SOURCE, "theme_source");
}

function validateFallbackOrder(value) {
  return validateEnum(value, FALLBACK_ORDER, "fallback_order");
}

// Schema validators
function validateSlideBrief(brief) {
  const required = [
    "slide_number", "source_slide_number", "action", "title", "slide_goal",
    "audience_takeaway", "takeaway_placement", "on_slide_copy", "speaker_script",
    "evidence_points", "provenance", "composition_family", "component_list",
    "primary_visual_anchor", "render_strategy", "text_only_exception",
    "theme_source", "qa_flags"
  ];

  for (const field of required) {
    if (!(field in brief)) {
      throw new Error(`Missing required field in slide_brief: ${field}`);
    }
  }

  if (brief.composition_family) {
    validateCompositionFamily(brief.composition_family);
  }
  if (brief.takeaway_placement) {
    validateTakeawayPlacement(brief.takeaway_placement);
  }
  if (brief.render_strategy) {
    validateRenderStrategy(brief.render_strategy);
  }
  if (brief.theme_source) {
    validateThemeSource(brief.theme_source);
  }
  if (brief.text_only_exception?.reason) {
    validateTextOnlyExceptionReason(brief.text_only_exception.reason);
  }
  if (brief.primary_visual_anchor?.kind) {
    validatePrimaryVisualAnchorKind(brief.primary_visual_anchor.kind);
  }
  if (brief.primary_visual_anchor?.source) {
    validatePrimaryVisualAnchorSource(brief.primary_visual_anchor.source);
  }
  if (Array.isArray(brief.qa_flags)) {
    brief.qa_flags.forEach(validateQaFlag);
  }

  return brief;
}

function validateSourceTheme(theme) {
  const required = [
    "source_deck_aspect_ratio", "theme_confidence", "theme_source",
    "font_tokens", "color_tokens", "surface_tokens", "master_slide_cues",
    "layout_cues", "fallback_policy"
  ];

  for (const field of required) {
    if (!(field in theme)) {
      throw new Error(`Missing required field in source_theme: ${field}`);
    }
  }

  if (theme.theme_source) {
    validateThemeSource(theme.theme_source);
  }

  return theme;
}

function validateVisualPlan(plan) {
  if (!Array.isArray(plan)) {
    throw new Error("visual_plan must be an array");
  }

  plan.forEach((slide, index) => {
    const required = [
      "slide_number", "composition_family", "component_list",
      "primary_visual_anchor", "secondary_support", "layout_regions",
      "image_prompt_path", "render_strategy", "text_only_exception"
    ];

    for (const field of required) {
      if (!(field in slide)) {
        throw new Error(`Missing required field in visual_plan[${index}]: ${field}`);
      }
    }

    if (slide.composition_family) {
      validateCompositionFamily(slide.composition_family);
    }
    if (slide.render_strategy) {
      validateRenderStrategy(slide.render_strategy);
    }
    if (slide.text_only_exception?.reason) {
      validateTextOnlyExceptionReason(slide.text_only_exception.reason);
    }
    if (slide.primary_visual_anchor?.kind) {
      validatePrimaryVisualAnchorKind(slide.primary_visual_anchor.kind);
    }
    if (slide.primary_visual_anchor?.source) {
      validatePrimaryVisualAnchorSource(slide.primary_visual_anchor.source);
    }
  });

  return plan;
}

module.exports = {
  COMPOSITION_FAMILY,
  PRIMARY_VISUAL_ANCHOR_KIND,
  PRIMARY_VISUAL_ANCHOR_SOURCE,
  TEXT_ONLY_EXCEPTION_REASON,
  QA_FLAGS,
  RENDER_STRATEGY,
  TAKEAWAY_PLACEMENT,
  THEME_SOURCE,
  FALLBACK_ORDER,
  validateEnum,
  validateCompositionFamily,
  validatePrimaryVisualAnchorKind,
  validatePrimaryVisualAnchorSource,
  validateTextOnlyExceptionReason,
  validateQaFlag,
  validateRenderStrategy,
  validateTakeawayPlacement,
  validateThemeSource,
  validateFallbackOrder,
  validateSlideBrief,
  validateSourceTheme,
  validateVisualPlan
};

