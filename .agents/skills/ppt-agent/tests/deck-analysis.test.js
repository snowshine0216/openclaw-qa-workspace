"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { normalizeRawCaptions } = require("../scripts/caption-image.js");

test("deck analysis exposes the design-required style token families", () => {
  const analysis = normalizeRawCaptions({
    slides: [
      {
        slide_number: 1,
        image_path: "renders/before/slide-01.svg",
        role: "title",
        headline: "Q1 operating review",
        layout_summary: "headline plus summary metrics",
        visual_assets: ["chart", "icon"],
        readability_risks: [],
        style_notes: ["Orange highlight", "Left aligned title", "Moderate spacing rhythm"],
        preserve: ["headline position"],
        issues: []
      }
    ]
  });

  assert.ok(analysis.deck_summary.style_summary.hierarchy);
  assert.ok(analysis.deck_summary.style_summary.spacing_rhythm);
  assert.ok(analysis.deck_summary.style_summary.accent_usage);
  assert.ok(analysis.deck_summary.style_summary.alignment_behavior);
  assert.ok(analysis.deck_summary.style_summary.density);
  assert.ok(analysis.deck_summary.style_summary.recurring_motifs);
  assert.ok(analysis.slides[0].style_tokens);
  assert.ok(analysis.slides[0].style_tokens.hierarchy);
  assert.ok(analysis.slides[0].style_tokens.spacing_rhythm);
});
