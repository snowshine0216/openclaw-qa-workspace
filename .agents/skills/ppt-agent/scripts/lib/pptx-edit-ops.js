"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const PPTX_SKILL_DIR = path.resolve(__dirname, "..", "..", "..", "pptx");
const CLEAN_SCRIPT = path.join(PPTX_SKILL_DIR, "scripts", "clean.py");
const PACK_SCRIPT = path.join(PPTX_SKILL_DIR, "scripts", "office", "pack.py");

function runStep(command, args) {
  const result = spawnSync(command, args, { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || result.stdout.trim() || `${command} failed`);
  }
}

function runStepWithCwd(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || result.stdout.trim() || `${command} failed`);
  }
}

function escapeXmlText(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function basenameFromRelative(filePath) {
  return path.basename(String(filePath || ""));
}

function scanLooseSlides(unpackedRoot) {
  const slidesDir = path.join(unpackedRoot, "ppt", "slides");
  if (!fs.existsSync(slidesDir)) {
    return [];
  }
  return fs
    .readdirSync(slidesDir)
    .filter((name) => /^slide\d+\.xml$/i.test(name))
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }))
    .map((slideFile, index) => ({
      rid: null,
      slide_file: slideFile,
      slide_id: 256 + index
    }));
}

function listPresentationSlides(unpackedRoot) {
  const relsPath = path.join(unpackedRoot, "ppt", "_rels", "presentation.xml.rels");
  const presentationPath = path.join(unpackedRoot, "ppt", "presentation.xml");
  if (!fs.existsSync(relsPath) || !fs.existsSync(presentationPath)) {
    return scanLooseSlides(unpackedRoot);
  }
  const relsXml = fs.readFileSync(relsPath, "utf8");
  const presentationXml = fs.readFileSync(presentationPath, "utf8");
  const slideTargets = new Map();

  for (const match of relsXml.matchAll(/<Relationship[^>]*Id="([^"]+)"[^>]*Target="slides\/([^"]+)"[^>]*\/>/g)) {
    slideTargets.set(match[1], match[2]);
  }

  const ordered = [];
  for (const match of presentationXml.matchAll(/<p:sldId[^>]*id="(\d+)"[^>]*r:id="([^"]+)"[^>]*\/>/g)) {
    const slideFile = slideTargets.get(match[2]);
    if (!slideFile) {
      continue;
    }
    ordered.push({
      rid: match[2],
      slide_file: slideFile,
      slide_id: Number(match[1])
    });
  }

  return ordered;
}

function nextRelationshipId(relsXml) {
  const values = Array.from(relsXml.matchAll(/Id="rId(\d+)"/g)).map((match) => Number(match[1]));
  return `rId${values.length > 0 ? Math.max(...values) + 1 : 1}`;
}

function nextPresentationSlideId(presentationXml) {
  const values = Array.from(presentationXml.matchAll(/<p:sldId[^>]*id="(\d+)"/g)).map((match) => Number(match[1]));
  return values.length > 0 ? Math.max(...values) + 1 : 256;
}

function ensureContentTypeOverride(unpackedRoot, slideFile) {
  const contentTypesPath = path.join(unpackedRoot, "[Content_Types].xml");
  if (!fs.existsSync(contentTypesPath)) {
    return;
  }
  const contentTypes = fs.readFileSync(contentTypesPath, "utf8");
  const override = `/ppt/slides/${slideFile}`;
  if (contentTypes.includes(override)) {
    return;
  }

  const nextContentTypes = contentTypes.replace(
    "</Types>",
    `  <Override PartName="${override}" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>\n</Types>`
  );
  fs.writeFileSync(contentTypesPath, nextContentTypes);
}

function registerSlideInPresentation(unpackedRoot, slideFile, afterSlideFile) {
  const relsPath = path.join(unpackedRoot, "ppt", "_rels", "presentation.xml.rels");
  const presentationPath = path.join(unpackedRoot, "ppt", "presentation.xml");
  if (!fs.existsSync(relsPath) || !fs.existsSync(presentationPath)) {
    ensureContentTypeOverride(unpackedRoot, slideFile);
    return {
      rid: null,
      slideId: null
    };
  }
  let relsXml = fs.readFileSync(relsPath, "utf8");
  let presentationXml = fs.readFileSync(presentationPath, "utf8");
  const slides = listPresentationSlides(unpackedRoot);
  const anchor = slides.find((slide) => slide.slide_file === afterSlideFile) || slides[slides.length - 1];
  const rid = nextRelationshipId(relsXml);
  const slideId = nextPresentationSlideId(presentationXml);
  const relEntry = `<Relationship Id="${rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/${slideFile}"/>`;
  const slideEntry = `<p:sldId id="${slideId}" r:id="${rid}"/>`;

  relsXml = relsXml.replace("</Relationships>", `  ${relEntry}\n</Relationships>`);
  if (anchor) {
    const anchorPattern = new RegExp(`(<p:sldId[^>]*r:id="${anchor.rid}"[^>]*/>)`);
    presentationXml = presentationXml.replace(anchorPattern, `$1${slideEntry}`);
  } else {
    presentationXml = presentationXml.replace("</p:sldIdLst>", `${slideEntry}</p:sldIdLst>`);
  }

  fs.writeFileSync(relsPath, relsXml);
  fs.writeFileSync(presentationPath, presentationXml);
  ensureContentTypeOverride(unpackedRoot, slideFile);

  return {
    rid,
    slideId
  };
}

function removeSlideFromPresentation(unpackedRoot, slideFile) {
  const relsPath = path.join(unpackedRoot, "ppt", "_rels", "presentation.xml.rels");
  const presentationPath = path.join(unpackedRoot, "ppt", "presentation.xml");
  if (!fs.existsSync(relsPath) || !fs.existsSync(presentationPath)) {
    return fs.existsSync(path.join(unpackedRoot, "ppt", "slides", slideFile));
  }
  const slide = listPresentationSlides(unpackedRoot).find((entry) => entry.slide_file === slideFile);
  if (!slide) {
    return false;
  }

  const relPattern = new RegExp(`\\s*<Relationship[^>]*Id="${slide.rid}"[^>]*Target="slides/${slideFile}"[^>]*/>`, "g");
  const slidePattern = new RegExp(`\\s*<p:sldId[^>]*id="${slide.slide_id}"[^>]*r:id="${slide.rid}"[^>]*/>`, "g");
  const relsXml = fs.readFileSync(relsPath, "utf8").replace(relPattern, "");
  const presentationXml = fs.readFileSync(presentationPath, "utf8").replace(slidePattern, "");

  fs.writeFileSync(relsPath, relsXml);
  fs.writeFileSync(presentationPath, presentationXml);
  return true;
}

function collectEditableText(xml) {
  return Array.from(xml.matchAll(/<a:t[^>]*>(.*?)<\/a:t>/g)).map((match) => ({
    start: match.index,
    end: match.index + match[0].length,
    raw: match[0],
    value: match[1]
  }));
}

function replaceTextNodes(xml, replacements) {
  const matches = collectEditableText(xml);
  if (matches.length === 0) {
    return xml;
  }

  let cursor = 0;
  let output = "";
  matches.forEach((match, index) => {
    output += xml.slice(cursor, match.start);
    if (Object.prototype.hasOwnProperty.call(replacements, index)) {
      output += match.raw.replace(match.value, escapeXmlText(replacements[index]));
    } else {
      output += match.raw;
    }
    cursor = match.end;
  });
  output += xml.slice(cursor);
  return output;
}

function conciseResearchLines(researchDeltaText) {
  return String(researchDeltaText || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.replace(/^[-*]\s+/, ""))
    .filter((line) => !/^Requested Change$/i.test(line) && !/^Findings$/i.test(line) && !/^Source Summaries$/i.test(line))
    .slice(0, 6);
}

function buildUpdateCopy({ action, changeRequest, researchDeltaText, slideNumber }) {
  const researchLines = conciseResearchLines(researchDeltaText);
  const titleBase = changeRequest.replace(/\.$/, "").trim();
  const title = action.action === "add_after" || action.action === "split"
    ? titleBase.length > 72 ? `${titleBase.slice(0, 69)}...` : titleBase
    : null;
  const detail = researchLines[0] || titleBase || `Requested update for slide ${slideNumber}`;
  const body = [`Updated: ${detail}`];

  if (researchLines[1]) {
    body.push(researchLines[1]);
  }

  return { title, body };
}

function applyTextUpdateToSlide({ slidePath, action, changeRequest, researchDeltaText, slideNumber }) {
  const xml = fs.readFileSync(slidePath, "utf8");
  const textNodes = collectEditableText(xml);
  if (textNodes.length === 0) {
    return {
      status: "skipped",
      fallback: "manual_review_required",
      reason: "Slide had no editable text runs"
    };
  }

  const update = buildUpdateCopy({ action, changeRequest, researchDeltaText, slideNumber });
  const replacements = {};
  if (update.title && textNodes.length > 1) {
    replacements[0] = update.title;
    replacements[1] = update.body[0];
    if (update.body[1] && textNodes.length > 2) {
      replacements[2] = update.body[1];
    }
  } else {
    const bodyIndex = textNodes.length > 1 ? 1 : 0;
    replacements[bodyIndex] = update.body[0];
    if (update.body[1] && textNodes.length > bodyIndex + 1) {
      replacements[bodyIndex + 1] = update.body[1];
    }
  }

  const nextXml = replaceTextNodes(xml, replacements);
  fs.writeFileSync(slidePath, nextXml);
  return {
    status: "applied",
    summary: update.title ? `${update.title}; ${update.body.join(" ")}` : update.body.join(" ")
  };
}

function cleanUnpackedRoot(unpackedRoot) {
  try {
    runStep("python3", [CLEAN_SCRIPT, unpackedRoot]);
  } catch {
    return false;
  }
  return true;
}

function packDeck({ unpackedRoot, outputPath }) {
  try {
    runStep("python3", [PACK_SCRIPT, unpackedRoot, outputPath, "--validate", "false"]);
    return "pptx_skill_pack";
  } catch {
    fs.rmSync(outputPath, { force: true });
    runStepWithCwd("zip", ["-qr", outputPath, "."], unpackedRoot);
    return "zip_fallback_pack";
  }
}

/**
 * Determine render strategy for add_after or revise actions.
 * Routes to light_edit or structured_rebuild based on heuristics.
 *
 * @param {Object} params
 * @param {string} params.action - "add_after" or "revise"
 * @param {Object} params.slideBrief - Slide brief with composition_family, component_list, etc.
 * @param {Object} params.seedLayout - Layout info from duplicated/existing slide
 * @param {number} params.allowedLayoutDelta - Max allowed layout change threshold
 * @returns {Object} { strategy: "light_edit" | "structured_rebuild", reason: string }
 */
function determineRenderStrategy({
  action,
  slideBrief,
  seedLayout,
  allowedLayoutDelta
}) {
  const { RENDER_STRATEGY, COMPOSITION_FAMILY, PRIMARY_VISUAL_ANCHOR_KIND } = require("./shared-constants");

  // Text-only families that can use light_edit
  const textOnlyFamilies = [
    COMPOSITION_FAMILY.TEXT_STATEMENT,
    COMPOSITION_FAMILY.SECTION_DIVIDER,
    COMPOSITION_FAMILY.CLOSING_STATEMENT
  ];

  // Complex component types requiring structured_rebuild
  const complexComponents = [
    PRIMARY_VISUAL_ANCHOR_KIND.TABLE,
    PRIMARY_VISUAL_ANCHOR_KIND.CHART,
    PRIMARY_VISUAL_ANCHOR_KIND.DIAGRAM,
    PRIMARY_VISUAL_ANCHOR_KIND.METRIC_PANEL,
    PRIMARY_VISUAL_ANCHOR_KIND.COMPARISON_LAYOUT,
    PRIMARY_VISUAL_ANCHOR_KIND.PROCESS_FLOW
  ];

  const compositionFamily = slideBrief.composition_family;
  const primaryAnchorKind = slideBrief.primary_visual_anchor?.kind;

  // Check if slide needs complex components
  if (primaryAnchorKind && complexComponents.includes(primaryAnchorKind)) {
    return {
      strategy: RENDER_STRATEGY.STRUCTURED_REBUILD,
      reason: `Slide requires complex component: ${primaryAnchorKind}`
    };
  }

  // Check if composition family requires structured rendering
  if (compositionFamily && !textOnlyFamilies.includes(compositionFamily)) {
    const complexFamilies = [
      COMPOSITION_FAMILY.EVIDENCE_PANEL,
      COMPOSITION_FAMILY.COMPARISON_MATRIX,
      COMPOSITION_FAMILY.PROCESS_FLOW,
      COMPOSITION_FAMILY.TABLE_SUMMARY,
      COMPOSITION_FAMILY.QA_TWO_COLUMN
    ];

    if (complexFamilies.includes(compositionFamily)) {
      return {
        strategy: RENDER_STRATEGY.STRUCTURED_REBUILD,
        reason: `Composition family requires structured rendering: ${compositionFamily}`
      };
    }
  }

  // For add_after: check if intended family matches seed layout
  if (action === "add_after") {
    if (!seedLayout || seedLayout.family !== compositionFamily) {
      return {
        strategy: RENDER_STRATEGY.STRUCTURED_REBUILD,
        reason: "Intended family not satisfied by duplicated seed layout"
      };
    }
  }

  // Check for text expansion beyond allowed delta
  if (slideBrief.on_slide_copy && allowedLayoutDelta !== undefined) {
    const textLength = Array.isArray(slideBrief.on_slide_copy)
      ? slideBrief.on_slide_copy.join(" ").length
      : String(slideBrief.on_slide_copy).length;

    if (textLength > allowedLayoutDelta) {
      return {
        strategy: RENDER_STRATEGY.STRUCTURED_REBUILD,
        reason: "Text expansion exceeds allowed_layout_delta"
      };
    }
  }

  // Default to light_edit for simple text changes
  return {
    strategy: RENDER_STRATEGY.LIGHT_EDIT,
    reason: "Slide stays within light-edit limits"
  };
}

module.exports = {
  applyTextUpdateToSlide,
  basenameFromRelative,
  cleanUnpackedRoot,
  determineRenderStrategy,
  listPresentationSlides,
  packDeck,
  registerSlideInPresentation,
  removeSlideFromPresentation
};
