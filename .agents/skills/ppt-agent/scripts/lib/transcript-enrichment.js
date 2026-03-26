"use strict";

const fs = require("fs");
const path = require("path");

const {
  COMPOSITION_FAMILY,
  PRIMARY_VISUAL_ANCHOR_KIND,
  PRIMARY_VISUAL_ANCHOR_SOURCE,
  TEXT_ONLY_EXCEPTION_REASON,
  QA_FLAGS,
  RENDER_STRATEGY,
  TAKEAWAY_PLACEMENT,
  THEME_SOURCE,
  FALLBACK_ORDER,
  validateSlideBrief
} = require("./shared-constants");

const { determineVisualRole } = require("./slide-transcript");

/**
 * Infer composition family from slide analysis
 */
function inferCompositionFamily(slide, visualRole) {
  if (visualRole === "section_divider") {
    return COMPOSITION_FAMILY.SECTION_DIVIDER;
  }
  if (visualRole === "hero") {
    return COMPOSITION_FAMILY.TITLE_HERO;
  }
  if (visualRole === "evidence" || slide.visual_assets?.includes("chart")) {
    return COMPOSITION_FAMILY.EVIDENCE_PANEL;
  }
  if (visualRole === "comparison") {
    return COMPOSITION_FAMILY.COMPARISON_MATRIX;
  }
  if (visualRole === "process") {
    return COMPOSITION_FAMILY.PROCESS_FLOW;
  }
  if (visualRole === "qa") {
    return COMPOSITION_FAMILY.QA_TWO_COLUMN;
  }
  if (slide.visual_assets?.includes("table")) {
    return COMPOSITION_FAMILY.TABLE_SUMMARY;
  }
  return COMPOSITION_FAMILY.TEXT_STATEMENT;
}

/**
 * Infer component list from slide structure
 */
function inferComponentList(slide, compositionFamily) {
  const components = ["title"];

  if (slide.visual_assets?.includes("chart")) {
    components.push("chart");
  }
  if (slide.visual_assets?.includes("table")) {
    components.push("table");
  }
  if (slide.source_media_refs?.length > 0) {
    components.push("image");
  }
  if ((slide.body_lines || []).length > 0) {
    components.push("body_text");
  }
  if (compositionFamily === COMPOSITION_FAMILY.EVIDENCE_PANEL) {
    components.push("metric_panel");
  }
  if (slide.notes_text) {
    components.push("footnote");
  }

  return components;
}

/**
 * Determine text-only exception
 */
function determineTextOnlyException(visualRole, slide) {
  if (visualRole === "agenda") {
    return { reason: TEXT_ONLY_EXCEPTION_REASON.AGENDA };
  }
  if (visualRole === "section_divider") {
    return { reason: TEXT_ONLY_EXCEPTION_REASON.SECTION_DIVIDER };
  }
  const titleLower = (slide.headline || "").toLowerCase();
  if (/thank you|thanks/i.test(titleLower)) {
    return { reason: TEXT_ONLY_EXCEPTION_REASON.THANK_YOU };
  }
  return null;
}

/**
 * Check if a slide brief is too shallow (just title + body_lines pass-through)
 */
function isTranscriptTooShallow(brief, sourceSlide) {
  if (!brief.speaker_script || brief.action === "keep") {
    return false;
  }

  const titleAndBody = [
    sourceSlide.headline || "",
    ...(sourceSlide.body_lines || [])
  ].filter(Boolean).join(" ").toLowerCase().trim();

  const scriptNormalized = brief.speaker_script.toLowerCase().trim();

  // If speaker_script is essentially just the title + body concatenated, it's too shallow
  if (titleAndBody && scriptNormalized.includes(titleAndBody)) {
    const extraContent = scriptNormalized.replace(titleAndBody, "").trim();
    // Allow up to 50 chars of boilerplate (e.g., "Key points: ", "Context: ")
    return extraContent.length < 50;
  }

  return false;
}

/**
 * Synthesize speaker script from available sources
 */
function synthesizeSpeakerScript({ slide, researchDelta, changeRequest, action }) {
  const parts = [];

  // Include existing speaker notes if available
  if (slide.notes_text || slide.speaker_notes_text) {
    parts.push(slide.notes_text || slide.speaker_notes_text);
  }

  // Add key points from slide body
  if ((slide.body_lines || []).length > 0) {
    const bodyText = slide.body_lines.join(" ").trim();
    if (bodyText) {
      parts.push(`Key points: ${bodyText}`);
    }
  }

  // Add relevant research delta content
  if (researchDelta && action.action !== "keep") {
    const deltaLines = researchDelta.split("\n").filter(line =>
      line.trim() && !line.startsWith("#") && line.length > 20
    ).slice(0, 3);
    if (deltaLines.length > 0) {
      parts.push(`Research findings: ${deltaLines.join(" ")}`);
    }
  }

  // Add change context for revised/added slides
  if (["revise", "add_after"].includes(action.action) && changeRequest) {
    parts.push(`Context: ${changeRequest}`);
  }

  return parts.filter(Boolean).join("\n\n") || "";
}

/**
 * Derive evidence points from slide and research
 */
function deriveEvidencePoints({ slide, researchDelta, action }) {
  const points = [];

  // Extract metrics from body text
  const bodyText = (slide.body_lines || []).join(" ");
  const metricMatches = bodyText.match(/\d+%|\$\d+[KMB]?|\d+x/gi);
  if (metricMatches) {
    metricMatches.slice(0, 2).forEach(metric => {
      points.push(`Metric: ${metric}`);
    });
  }

  // Extract evidence from research delta
  if (researchDelta && action.action !== "keep") {
    const deltaLines = researchDelta.split("\n")
      .filter(line => line.trim().startsWith("-") && line.length > 20)
      .slice(0, 2);
    points.push(...deltaLines.map(line => line.replace(/^-\s*/, "")));
  }

  return points.length > 0 ? points : ["Supporting evidence from source material"];
}

/**
 * Derive provenance from action and sources
 */
function deriveProvenance({ slide, action, hasResearchDelta, hasAttachments }) {
  const sources = [];

  if (slide.slide_number) {
    sources.push(`source deck slide ${slide.slide_number}`);
  }
  if (hasResearchDelta) {
    sources.push("research_delta.md");
  }
  if (hasAttachments) {
    sources.push("user attachments");
  }

  return sources.length > 0 ? sources : ["source deck"];
}

/**
 * Create enriched slide brief for a single slide
 */
function createSlideBrief({ slide, action, slideNumber, researchDelta, changeRequest, hasAttachments }) {
  const visualRole = slide.visual_role || determineVisualRole({
    title: slide.headline,
    role: slide.role,
    visualAssets: slide.visual_assets
  });

  const compositionFamily = inferCompositionFamily(slide, visualRole);
  const componentList = inferComponentList(slide, compositionFamily);
  const textOnlyException = determineTextOnlyException(visualRole, slide);
  const primaryVisualAnchor = inferPrimaryVisualAnchor(slide, action);

  // For "keep" slides, create minimal stubs
  if (action.action === "keep") {
    return {
      slide_number: slideNumber,
      source_slide_number: slide.slide_number || slideNumber,
      action: "keep",
      title: slide.headline || `Slide ${slideNumber}`,
      slide_goal: "Preserve existing content",
      audience_takeaway: "No changes",
      takeaway_placement: TAKEAWAY_PLACEMENT.NOTES_ONLY,
      on_slide_copy: (slide.body_lines || []).join("\n"),
      speaker_script: "",
      evidence_points: [],
      provenance: deriveProvenance({ slide, action, hasResearchDelta: false, hasAttachments }),
      composition_family: compositionFamily,
      component_list: componentList,
      primary_visual_anchor: primaryVisualAnchor,
      render_strategy: RENDER_STRATEGY.PRESERVE_ONLY,
      text_only_exception: textOnlyException,
      theme_source: THEME_SOURCE.SOURCE_THEME,
      qa_flags: []
    };
  }

  // For revised/added slides, create rich briefs
  const speakerScript = synthesizeSpeakerScript({ slide, researchDelta, changeRequest, action });
  const evidencePoints = deriveEvidencePoints({ slide, researchDelta, action });
  const provenance = deriveProvenance({ slide, action, hasResearchDelta: Boolean(researchDelta), hasAttachments });

  const qaFlags = [];
  if (!speakerScript) {
    qaFlags.push(QA_FLAGS.MISSING_GROUNDING);
  }
  if (!primaryVisualAnchor && !textOnlyException) {
    qaFlags.push(QA_FLAGS.WEAK_ANCHOR_RELEVANCE);
  }

  return {
    slide_number: slideNumber,
    source_slide_number: slide.slide_number || null,
    action: action.action,
    title: slide.headline || `Slide ${slideNumber}`,
    slide_goal: action.reason || "Update slide content",
    audience_takeaway: slide.headline || "Key information",
    takeaway_placement: TAKEAWAY_PLACEMENT.SUBTITLE,
    on_slide_copy: (slide.body_lines || []).join("\n"),
    speaker_script: speakerScript,
    evidence_points: evidencePoints,
    provenance,
    composition_family: compositionFamily,
    component_list: componentList,
    primary_visual_anchor: primaryVisualAnchor,
    render_strategy: action.action === "add_after" ? RENDER_STRATEGY.STRUCTURED_REBUILD : RENDER_STRATEGY.LIGHT_EDIT,
    text_only_exception: textOnlyException,
    theme_source: THEME_SOURCE.SOURCE_THEME,
    qa_flags: qaFlags
  };
}

/**
 * Main enrichment function: generates JSON slide briefs for all slides
 */
function enrichSlideTranscripts({ slideAnalysis, researchDelta, changeRequest, runRoot }) {
  const slideBriefsDir = path.join(runRoot, "artifacts", "slide-briefs");
  fs.rmSync(slideBriefsDir, { recursive: true, force: true });
  fs.mkdirSync(slideBriefsDir, { recursive: true });

  const updatePlanPath = path.join(runRoot, "artifacts", "update_plan.json");
  if (!fs.existsSync(updatePlanPath)) {
    throw new Error("update_plan.json not found. Cannot enrich transcripts without an update plan.");
  }

  const updatePlan = JSON.parse(fs.readFileSync(updatePlanPath, "utf8"));
  const slideActions = updatePlan.slide_actions || [];
  const slidesByNumber = new Map((slideAnalysis.slides || []).map(slide => [slide.slide_number, slide]));

  const researchDeltaPath = path.join(runRoot, "artifacts", "research_delta.md");
  const researchDeltaText = fs.existsSync(researchDeltaPath)
    ? fs.readFileSync(researchDeltaPath, "utf8")
    : "";

  const hasAttachments = researchDeltaText.includes("## Source Summaries") &&
    !researchDeltaText.includes("No usable new source material");

  const enrichedBriefs = [];
  const validationErrors = [];

  slideActions.forEach((action) => {
    const slide = slidesByNumber.get(action.source_slide_number || action.slide_number) || {
      slide_number: action.slide_number,
      headline: `Slide ${action.slide_number}`,
      body_lines: [],
      visual_assets: [],
      source_media_refs: []
    };

    try {
      const brief = createSlideBrief({
        slide,
        action,
        slideNumber: action.slide_number,
        researchDelta: researchDeltaText,
        changeRequest: changeRequest.change_request || changeRequest,
        hasAttachments
      });

      // Validate the brief
      validateSlideBrief(brief);

      // Additional validation for non-keep slides
      if (action.action !== "keep") {
        if (!brief.speaker_script) {
          validationErrors.push(`Slide ${brief.slide_number}: speaker_script is empty for ${action.action} action`);
        }
        if (brief.evidence_points.length === 0 && !brief.text_only_exception) {
          validationErrors.push(`Slide ${brief.slide_number}: evidence_points is empty for non-informational slide`);
        }

        // Check for shallow transcript (just title + body_lines pass-through)
        if (isTranscriptTooShallow(brief, slide)) {
          validationErrors.push(`Slide ${brief.slide_number}: speaker_script is too shallow (just title + body_lines)`);
          if (!brief.qa_flags.includes(QA_FLAGS.MISSING_GROUNDING)) {
            brief.qa_flags.push(QA_FLAGS.MISSING_GROUNDING);
          }
        }
      }

      enrichedBriefs.push(brief);

      // Write individual slide brief
      const briefPath = path.join(slideBriefsDir, `slide-${String(action.slide_number).padStart(2, "0")}.json`);
      fs.writeFileSync(briefPath, JSON.stringify(brief, null, 2));
    } catch (error) {
      validationErrors.push(`Slide ${action.slide_number}: ${error.message}`);
    }
  });

  // Write index file
  const indexPath = path.join(slideBriefsDir, "index.json");
  fs.writeFileSync(indexPath, JSON.stringify({
    total_slides: enrichedBriefs.length,
    validation_errors: validationErrors,
    briefs: enrichedBriefs.map(b => ({
      slide_number: b.slide_number,
      action: b.action,
      title: b.title
    }))
  }, null, 2));

  if (validationErrors.length > 0) {
    console.warn("Validation warnings:", validationErrors);
  }

  return {
    status: validationErrors.length > 0 ? "warnings" : "ok",
    briefsDir: slideBriefsDir,
    indexPath,
    totalBriefs: enrichedBriefs.length,
    validationErrors
  };
}

module.exports = {
  enrichSlideTranscripts,
  createSlideBrief,
  inferCompositionFamily,
  inferComponentList,
  determineTextOnlyException,
  inferPrimaryVisualAnchor,
  synthesizeSpeakerScript,
  deriveEvidencePoints,
  deriveProvenance,
  isTranscriptTooShallow
};
/**
 * Infer primary visual anchor from slide with relevance rationale
 */
function inferPrimaryVisualAnchor(slide, action) {
  if (slide.visual_assets?.includes("chart")) {
    return {
      kind: PRIMARY_VISUAL_ANCHOR_KIND.CHART,
      source: PRIMARY_VISUAL_ANCHOR_SOURCE.SOURCE_DECK,
      asset_ref: "source_chart",
      relevance_rationale: "Chart provides data visualization that supports the slide's analytical message",
      fallback_order: [FALLBACK_ORDER.TABLE, FALLBACK_ORDER.SCREENSHOT]
    };
  }
  if (slide.visual_assets?.includes("table")) {
    return {
      kind: PRIMARY_VISUAL_ANCHOR_KIND.TABLE,
      source: PRIMARY_VISUAL_ANCHOR_SOURCE.SOURCE_DECK,
      asset_ref: "source_table",
      relevance_rationale: "Table presents structured comparison or data that grounds the slide's claims",
      fallback_order: [FALLBACK_ORDER.CHART, FALLBACK_ORDER.COMPARISON_LAYOUT]
    };
  }
  if (slide.source_media_refs?.length > 0) {
    const mediaRef = slide.source_media_refs[0];
    return {
      kind: PRIMARY_VISUAL_ANCHOR_KIND.EXISTING_MEDIA,
      source: PRIMARY_VISUAL_ANCHOR_SOURCE.SOURCE_DECK,
      asset_ref: mediaRef.target || mediaRef.relationship_id || "",
      relevance_rationale: "Existing image serves as the established visual anchor for this slide's message",
      fallback_order: [FALLBACK_ORDER.SCREENSHOT, FALLBACK_ORDER.PROCESS_FLOW]
    };
  }
  if (action.action === "add_after") {
    return {
      kind: PRIMARY_VISUAL_ANCHOR_KIND.GENERATED_IMAGE,
      source: PRIMARY_VISUAL_ANCHOR_SOURCE.GENERATED,
      asset_ref: "",
      relevance_rationale: "New slide requires a visual anchor to support the presentation contract",
      fallback_order: [FALLBACK_ORDER.TABLE, FALLBACK_ORDER.CHART, FALLBACK_ORDER.PROCESS_FLOW]
    };
  }
  return null;
}
