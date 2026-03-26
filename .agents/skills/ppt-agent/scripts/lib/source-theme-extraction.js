"use strict";

const fs = require("fs");
const path = require("path");

const { THEME_SOURCE, validateSourceTheme } = require("./shared-constants");

/**
 * Extract theme tokens from source deck with per-token confidence scores
 */

function extractFontTokens(slideAnalysis) {
  const fonts = new Set();
  const confidence = { overall: 0.7 };

  // Heuristic: extract font references from style notes
  slideAnalysis.slides.forEach((slide) => {
    if (slide.style_notes) {
      slide.style_notes.forEach((note) => {
        if (/font|typeface|typography/i.test(note)) {
          fonts.add(note);
        }
      });
    }
  });

  return {
    title_font: null,
    body_font: null,
    confidence
  };
}

function extractColorTokens(slideAnalysis) {
  return {
    primary_surface: null,
    secondary_surface: null,
    primary_text: null,
    muted_text: null,
    primary_accent: null,
    confidence: { overall: 0.5 }
  };
}

function extractSurfaceTokens(slideAnalysis) {
  return {
    background_treatment: "solid",
    confidence: { overall: 0.6 }
  };
}

function extractMasterSlideCues(slideAnalysis) {
  const cues = [];

  if (slideAnalysis.slides.length > 0) {
    const firstSlide = slideAnalysis.slides[0];
    if (firstSlide.layout_anchor) {
      cues.push({
        slide_number: 1,
        layout_type: "title",
        anchor: firstSlide.layout_anchor
      });
    }
  }

  return cues;
}

function extractLayoutCues(slideAnalysis) {
  const cues = [];

  slideAnalysis.slides.forEach((slide) => {
    if (slide.layout_anchor) {
      cues.push({
        slide_number: slide.slide_number,
        layout_summary: slide.layout_summary,
        anchor: slide.layout_anchor
      });
    }
  });

  return cues;
}

/**
 * Extract source theme from deck analysis
 */
function extractSourceTheme({ runRoot, slideAnalysis }) {
  const fontTokens = extractFontTokens(slideAnalysis);
  const colorTokens = extractColorTokens(slideAnalysis);
  const surfaceTokens = extractSurfaceTokens(slideAnalysis);
  const masterSlideCues = extractMasterSlideCues(slideAnalysis);
  const layoutCues = extractLayoutCues(slideAnalysis);

  const overallConfidence = (
    fontTokens.confidence.overall +
    colorTokens.confidence.overall +
    surfaceTokens.confidence.overall
  ) / 3;

  const themeSource = overallConfidence > 0.6
    ? THEME_SOURCE.SOURCE_THEME
    : THEME_SOURCE.FALLBACK_REFERENCE;

  const sourceTheme = {
    source_deck_aspect_ratio: "16:9",
    theme_confidence: overallConfidence,
    theme_source: themeSource,
    font_tokens: fontTokens,
    color_tokens: colorTokens,
    surface_tokens: surfaceTokens,
    master_slide_cues: masterSlideCues,
    layout_cues: layoutCues,
    fallback_policy: {
      font_fallback: overallConfidence < 0.7,
      color_fallback: overallConfidence < 0.6,
      surface_fallback: overallConfidence < 0.6,
      fallback_reference: "ppt-agent-presentation-design-system.md"
    }
  };

  validateSourceTheme(sourceTheme);

  const outputPath = path.join(runRoot, "artifacts", "source-theme.json");
  fs.writeFileSync(outputPath, JSON.stringify(sourceTheme, null, 2));

  return {
    sourceThemePath: outputPath,
    themeSource,
    confidence: overallConfidence
  };
}

module.exports = {
  extractSourceTheme,
  extractFontTokens,
  extractColorTokens,
  extractSurfaceTokens
};
