"use strict";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function normalizeList(values, mapper = (value) => value) {
  const seen = new Set();
  const result = [];
  for (const value of values || []) {
    const normalized = mapper(String(value || "").trim()).trim();
    if (!normalized || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    result.push(normalized);
  }
  return result;
}

function inferAccentColors(styleNotes) {
  const joined = styleNotes.join(" ").toLowerCase();
  const colors = [];
  if (joined.includes("orange")) {
    colors.push("#FA6611");
  }
  if (joined.includes("black")) {
    colors.push("#1F1F1F");
  }
  return colors;
}

function inferHierarchy(slide) {
  const headline = String(slide.headline || "");
  const titleBehavior = slide.role === "title" ? "large_title" : "standard_title";
  return {
    title_size_behavior: titleBehavior,
    headline_to_body_contrast: headline.length > 42 ? "moderate" : "strong",
    section_divider_emphasis: slide.role === "title" ? "high" : "medium"
  };
}

function inferSpacingRhythm(slide) {
  const dense = (slide.readability_risks || []).length > 0;
  return {
    margin_behavior: dense ? "tight" : "balanced",
    content_spacing: dense ? "compact" : "moderate",
    density_pattern: dense ? "stacked_content" : "headline_supporting_content"
  };
}

function inferAccentUsage(styleNotes, slide) {
  const accentColors = inferAccentColors(styleNotes);
  return {
    accent_colors: accentColors,
    accent_role: slide.visual_assets.includes("chart") ? "data_highlight" : "structure"
  };
}

function inferAlignmentBehavior(styleNotes, slide) {
  const joined = styleNotes.join(" ").toLowerCase();
  return {
    title_alignment: joined.includes("left aligned") ? "left" : "center",
    composition_bias: slide.visual_assets.includes("chart") ? "balanced" : "left",
    chart_text_balance: slide.visual_assets.includes("chart") ? "chart_with_supporting_text" : "text_led"
  };
}

function inferDensity(slide) {
  return {
    level: slide.readability_risks.length > 0 ? "dense" : "medium",
    evidence_modes: slide.visual_assets.length > 0 ? slide.visual_assets : ["prose"]
  };
}

function inferRecurringMotifs(styleNotes) {
  return styleNotes.length > 0 ? styleNotes.slice(0, 2) : ["source deck motif"];
}

function inferStyleTokens(slide) {
  const styleNotes = normalizeList(slide.style_notes, (value) => value);
  return {
    hierarchy: inferHierarchy(slide),
    spacing_rhythm: inferSpacingRhythm(slide),
    accent_usage: inferAccentUsage(styleNotes, slide),
    alignment_behavior: inferAlignmentBehavior(styleNotes, slide),
    density: inferDensity(slide),
    recurring_motifs: inferRecurringMotifs(styleNotes)
  };
}

function firstDefined(values, keyPath, fallback) {
  for (const value of values) {
    const candidate = keyPath.reduce((current, key) => (current ? current[key] : undefined), value);
    if (candidate !== undefined) {
      return candidate;
    }
  }
  return fallback;
}

function mergeStyleSummary(slides) {
  const tokens = slides.map((slide) => slide.style_tokens);
  const accentColors = Array.from(
    new Set(tokens.flatMap((token) => token.accent_usage?.accent_colors || []))
  );
  const recurringMotifs = Array.from(
    new Set(tokens.flatMap((token) => token.recurring_motifs || []))
  );
  return {
    hierarchy: {
      title_size_behavior: firstDefined(tokens, ["hierarchy", "title_size_behavior"], "standard_title"),
      headline_to_body_contrast: firstDefined(tokens, ["hierarchy", "headline_to_body_contrast"], "moderate"),
      section_divider_emphasis: firstDefined(tokens, ["hierarchy", "section_divider_emphasis"], "medium")
    },
    spacing_rhythm: {
      margin_behavior: firstDefined(tokens, ["spacing_rhythm", "margin_behavior"], "balanced"),
      content_spacing: firstDefined(tokens, ["spacing_rhythm", "content_spacing"], "moderate"),
      density_pattern: firstDefined(tokens, ["spacing_rhythm", "density_pattern"], "headline_supporting_content")
    },
    accent_usage: {
      accent_colors: accentColors,
      accent_role: firstDefined(tokens, ["accent_usage", "accent_role"], "structure")
    },
    alignment_behavior: {
      title_alignment: firstDefined(tokens, ["alignment_behavior", "title_alignment"], "left"),
      composition_bias: firstDefined(tokens, ["alignment_behavior", "composition_bias"], "balanced"),
      chart_text_balance: firstDefined(tokens, ["alignment_behavior", "chart_text_balance"], "text_led")
    },
    density: {
      level: firstDefined(tokens, ["density", "level"], "medium"),
      evidence_modes: Array.from(
        new Set(tokens.flatMap((token) => token.density?.evidence_modes || []))
      )
    },
    recurring_motifs: recurringMotifs,
    accent_colors: accentColors,
    font_behavior: "inferred from source deck",
    visual_motif: recurringMotifs[0] || "source deck motif"
  };
}

function summarizeDeck(slides) {
  const narrativeSpine = [];

  slides.forEach((slide) => {
    if (!narrativeSpine.includes(slide.role)) {
      narrativeSpine.push(slide.role);
    }
  });

  return {
    slide_count: slides.length,
    narrative_spine: narrativeSpine,
    style_summary: mergeStyleSummary(slides)
  };
}

function normalizeSlide(slide) {
  assert(Number.isInteger(slide.slide_number) && slide.slide_number > 0, "slide_number is required");
  const styleNotes = normalizeList(slide.style_notes, (value) => value);
  const sourceMediaRefs = Array.isArray(slide.source_media_refs)
    ? slide.source_media_refs.map((entry) => ({
        relationship_id: String(entry.relationship_id || "").trim(),
        target: String(entry.target || "").trim(),
        content_hash: String(entry.content_hash || "").trim()
      }))
    : [];
  const normalized = {
    slide_number: slide.slide_number,
    image_path: slide.image_path || "",
    role: String(slide.role || "content").trim().toLowerCase(),
    visual_role: String(slide.visual_role || "").trim().toLowerCase(),
    headline: String(slide.headline || "").trim(),
    layout_summary: String(slide.layout_summary || "").trim().toLowerCase(),
    visual_assets: normalizeList(slide.visual_assets, (value) => value.toLowerCase()),
    has_existing_media: Boolean(slide.has_existing_media || sourceMediaRefs.length > 0),
    source_media_refs: sourceMediaRefs,
    layout_anchor: slide.layout_anchor && typeof slide.layout_anchor === "object"
      ? slide.layout_anchor
      : {},
    speaker_notes_present: Boolean(slide.speaker_notes_present),
    speaker_notes_text: String(slide.speaker_notes_text || "").trim(),
    notes_text: String(slide.notes_text || "").trim(),
    readability_risks: normalizeList(slide.readability_risks, (value) => value.toLowerCase()),
    style_notes: styleNotes,
    preserve: normalizeList(slide.preserve, (value) => value),
    issues: normalizeList(slide.issues, (value) => value)
  };
  return {
    ...normalized,
    style_tokens: slide.style_tokens && typeof slide.style_tokens === "object"
      ? slide.style_tokens
      : inferStyleTokens(normalized)
  };
}

function normalizeRawCaptions(raw) {
  assert(raw && typeof raw === "object", "raw caption payload must be an object");
  assert(Array.isArray(raw.slides) && raw.slides.length > 0, "raw caption payload must include slides");
  const slides = raw.slides.map((slide) => normalizeSlide(slide));
  return {
    deck_summary: summarizeDeck(slides),
    slides
  };
}

module.exports = {
  normalizeRawCaptions
};
