"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const {
  generateImageMetaPrompt,
  extractFinalPrompt
} = require("../scripts/lib/image-meta-prompt");

const {
  PRIMARY_VISUAL_ANCHOR_KIND,
  PRIMARY_VISUAL_ANCHOR_SOURCE,
  COMPOSITION_FAMILY,
  RENDER_STRATEGY,
  TAKEAWAY_PLACEMENT,
  THEME_SOURCE,
  FALLBACK_ORDER
} = require("../scripts/lib/shared-constants");

function tmpRunRoot() {
  const runRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ppt-agent-meta-"));
  fs.mkdirSync(path.join(runRoot, "artifacts"), { recursive: true });
  return runRoot;
}

test("generateImageMetaPrompt verifies meta prompt sections", () => {
  const runRoot = tmpRunRoot();
  const slideBrief = {
    slide_number: 3,
    title: "Market Expansion",
    slide_goal: "Show geographic growth strategy",
    audience_takeaway: "Three new markets launching Q2",
    composition_family: COMPOSITION_FAMILY.EVIDENCE_PANEL,
    primary_visual_anchor: {
      kind: PRIMARY_VISUAL_ANCHOR_KIND.GENERATED_IMAGE,
      source: PRIMARY_VISUAL_ANCHOR_SOURCE.GENERATED,
      asset_ref: "world map with highlighted regions",
      relevance_rationale: "Geographic visualization supports expansion narrative",
      fallback_order: [FALLBACK_ORDER.TABLE, FALLBACK_ORDER.CHART]
    }
  };

  const result = generateImageMetaPrompt({
    runRoot,
    slideBrief,
    slideNumber: 3,
    designTokens: { accent_color: "#FA6611" }
  });

  assert.ok(result);
  assert.ok(fs.existsSync(result.metaPromptPath));

  const content = fs.readFileSync(result.metaPromptPath, "utf8");

  // Verify all required sections exist
  assert.match(content, /# Image Meta Prompt/);
  assert.match(content, /## Objective/);
  assert.match(content, /## Business message/);
  assert.match(content, /## Subject/);
  assert.match(content, /## Composition/);
  assert.match(content, /## Visual hierarchy/);
  assert.match(content, /## Stylistic constraints/);
  assert.match(content, /## Color direction/);
  assert.match(content, /## What to avoid/);
  assert.match(content, /## Fallback if generation fails/);
});

test("generateImageMetaPrompt verifies prompt-to-asset linkage", () => {
  const runRoot = tmpRunRoot();
  const slideBrief = {
    slide_number: 5,
    title: "Revenue Trends",
    slide_goal: "Visualize quarterly performance",
    audience_takeaway: "Consistent growth trajectory",
    composition_family: COMPOSITION_FAMILY.EVIDENCE_PANEL,
    primary_visual_anchor: {
      kind: PRIMARY_VISUAL_ANCHOR_KIND.GENERATED_IMAGE,
      source: PRIMARY_VISUAL_ANCHOR_SOURCE.GENERATED,
      asset_ref: "line chart showing upward trend",
      relevance_rationale: "Chart demonstrates revenue momentum",
      fallback_order: [FALLBACK_ORDER.CHART, FALLBACK_ORDER.TABLE]
    }
  };

  const result = generateImageMetaPrompt({
    runRoot,
    slideBrief,
    slideNumber: 5
  });

  assert.ok(result.finalPrompt);
  assert.ok(result.finalPrompt.length > 50);
  assert.match(result.finalPrompt, /line chart showing upward trend/);
  assert.ok(result.contentHash);
  assert.equal(result.contentHash.length, 16);
});

test("generateImageMetaPrompt returns null for non-generated-image anchors", () => {
  const runRoot = tmpRunRoot();
  const slideBrief = {
    slide_number: 2,
    title: "Existing Chart",
    primary_visual_anchor: {
      kind: PRIMARY_VISUAL_ANCHOR_KIND.CHART,
      source: PRIMARY_VISUAL_ANCHOR_SOURCE.SOURCE_DECK,
      asset_ref: "chart1.png",
      relevance_rationale: "Existing chart",
      fallback_order: []
    }
  };

  const result = generateImageMetaPrompt({
    runRoot,
    slideBrief,
    slideNumber: 2
  });

  assert.equal(result, null);
});

test("extractFinalPrompt combines key sections correctly", () => {
  const metaPromptContent = `# Image Meta Prompt

Slide 3: Market Expansion

## Objective
Show geographic growth strategy

## Business message
Three new markets launching Q2

## Subject
world map with highlighted regions

## Composition
Clear focal point with supporting context. Analytical, not decorative.

## Visual hierarchy
Primary subject should be immediately recognizable.

## Stylistic constraints
Restrained business aesthetic. Analytical, not decorative.

## Color direction
Use #FA6611 as the primary accent.

## What to avoid
No stock photos, no decorative filler.

## Fallback if generation fails
Fallback to: table, chart`;

  const finalPrompt = extractFinalPrompt(metaPromptContent);

  assert.ok(finalPrompt.includes("world map with highlighted regions"));
  assert.ok(finalPrompt.includes("Clear focal point"));
  assert.ok(finalPrompt.includes("Restrained business aesthetic"));
  assert.ok(finalPrompt.includes("#FA6611"));
});
