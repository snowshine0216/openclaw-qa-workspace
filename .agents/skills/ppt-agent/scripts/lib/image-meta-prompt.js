"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const { PRIMARY_VISUAL_ANCHOR_KIND } = require("./shared-constants");

/**
 * Generate image meta prompt artifact from slide brief
 *
 * @param {Object} params
 * @param {string} params.runRoot - Run root directory
 * @param {Object} params.slideBrief - Canonical slide brief
 * @param {number} params.slideNumber - Slide number
 * @param {Object} params.designTokens - Design tokens (accent_color, etc.)
 * @returns {Object} { metaPromptPath, contentHash, finalPrompt }
 */
function generateImageMetaPrompt({ runRoot, slideBrief, slideNumber, designTokens = {} }) {
  if (!slideBrief.primary_visual_anchor ||
      slideBrief.primary_visual_anchor.kind !== PRIMARY_VISUAL_ANCHOR_KIND.GENERATED_IMAGE) {
    return null;
  }

  const anchor = slideBrief.primary_visual_anchor;
  const accentColor = designTokens.accent_color || "#FA6611";

  const metaPromptContent = buildMetaPromptContent({
    slideBrief,
    anchor,
    accentColor
  });

  const contentHash = computeContentHash(metaPromptContent);
  const metaPromptPath = path.join(
    runRoot,
    "artifacts",
    "image-prompts",
    `slide-${String(slideNumber).padStart(2, "0")}.md`
  );

  fs.mkdirSync(path.dirname(metaPromptPath), { recursive: true });
  fs.writeFileSync(metaPromptPath, metaPromptContent);

  const finalPrompt = extractFinalPrompt(metaPromptContent);

  return {
    metaPromptPath,
    contentHash,
    finalPrompt
  };
}

/**
 * Build meta prompt content from slide brief
 */
function buildMetaPromptContent({ slideBrief, anchor, accentColor }) {
  const sections = [];

  sections.push("# Image Meta Prompt");
  sections.push("");
  sections.push(`Slide ${slideBrief.slide_number}: ${slideBrief.title}`);
  sections.push("");

  sections.push("## Objective");
  sections.push(slideBrief.slide_goal || "Support the slide's business message with a relevant visual anchor.");
  sections.push("");

  sections.push("## Business message");
  sections.push(slideBrief.audience_takeaway || slideBrief.title);
  sections.push("");

  sections.push("## Subject");
  sections.push(anchor.asset_ref || anchor.relevance_rationale || "Business-appropriate visual");
  sections.push("");

  sections.push("## Composition");
  sections.push(deriveComposition(slideBrief, anchor));
  sections.push("");

  sections.push("## Visual hierarchy");
  sections.push(deriveVisualHierarchy(slideBrief));
  sections.push("");

  sections.push("## Stylistic constraints");
  sections.push(deriveStylisticConstraints());
  sections.push("");

  sections.push("## Color direction");
  sections.push(deriveColorDirection(accentColor));
  sections.push("");

  sections.push("## What to avoid");
  sections.push(deriveExclusions());
  sections.push("");

  sections.push("## Fallback if generation fails");
  sections.push(deriveFallback(anchor));
  sections.push("");

  return sections.join("\n");
}

/**
 * Derive composition guidance from slide brief
 */
function deriveComposition(slideBrief, anchor) {
  const family = slideBrief.composition_family;

  if (family === "evidence_panel") {
    return "Clear focal point with supporting context. Analytical, not decorative.";
  }
  if (family === "comparison_matrix") {
    return "Side-by-side or contrasting elements. Balanced visual weight.";
  }
  if (family === "process_flow") {
    return "Sequential or directional flow. Clear progression from left to right or top to bottom.";
  }
  if (family === "title_hero") {
    return "Hero-style composition with strong visual presence. Professional and confident.";
  }

  return "Clean, business-appropriate composition with clear focal point.";
}

/**
 * Derive visual hierarchy guidance
 */
function deriveVisualHierarchy(slideBrief) {
  return "Primary subject should be immediately recognizable. Supporting elements should not compete for attention.";
}

/**
 * Derive stylistic constraints
 */
function deriveStylisticConstraints() {
  return "Restrained business aesthetic. Analytical, not decorative. Avoid stock photo look, glossy 3D effects, and generic filler imagery.";
}

/**
 * Derive color direction
 */
function deriveColorDirection(accentColor) {
  return `Use ${accentColor} as the primary accent. Maintain professional color palette with warm surfaces and graphite text.`;
}

/**
 * Derive exclusions
 */
function deriveExclusions() {
  return "No stock photos, no decorative filler, no glossy 3D renders, no generic business people in suits, no clipart.";
}

/**
 * Derive fallback strategy
 */
function deriveFallback(anchor) {
  const fallbackOrder = anchor.fallback_order || [];
  if (fallbackOrder.length > 0) {
    return `Fallback to: ${fallbackOrder.join(", ")}`;
  }
  return "Fallback to structured layout with shapes or text-only composition.";
}

/**
 * Extract final prompt from meta prompt content
 */
function extractFinalPrompt(metaPromptContent) {
  const lines = metaPromptContent.split("\n");
  const sections = {
    subject: "",
    composition: "",
    stylistic: "",
    color: "",
    exclusions: ""
  };

  let currentSection = null;
  for (const line of lines) {
    if (line.startsWith("## Subject")) {
      currentSection = "subject";
      continue;
    }
    if (line.startsWith("## Composition")) {
      currentSection = "composition";
      continue;
    }
    if (line.startsWith("## Stylistic constraints")) {
      currentSection = "stylistic";
      continue;
    }
    if (line.startsWith("## Color direction")) {
      currentSection = "color";
      continue;
    }
    if (line.startsWith("## What to avoid")) {
      currentSection = "exclusions";
      continue;
    }
    if (line.startsWith("##")) {
      currentSection = null;
      continue;
    }

    if (currentSection && line.trim()) {
      sections[currentSection] += (sections[currentSection] ? " " : "") + line.trim();
    }
  }

  const parts = [
    sections.subject,
    sections.composition,
    sections.stylistic,
    sections.color
  ].filter(Boolean);

  return parts.join(". ");
}

/**
 * Compute content hash for deduplication
 */
function computeContentHash(content) {
  return crypto.createHash("sha256").update(content).digest("hex").slice(0, 16);
}

/**
 * Check if meta prompt already exists with same content hash
 */
function findExistingMetaPrompt({ runRoot, contentHash }) {
  const promptsDir = path.join(runRoot, "artifacts", "image-prompts");
  if (!fs.existsSync(promptsDir)) {
    return null;
  }

  const files = fs.readdirSync(promptsDir);
  for (const file of files) {
    if (!file.endsWith(".md")) continue;
    const filePath = path.join(promptsDir, file);
    const content = fs.readFileSync(filePath, "utf8");
    const hash = computeContentHash(content);
    if (hash === contentHash) {
      return filePath;
    }
  }

  return null;
}

module.exports = {
  generateImageMetaPrompt,
  buildMetaPromptContent,
  extractFinalPrompt,
  computeContentHash,
  findExistingMetaPrompt
};
