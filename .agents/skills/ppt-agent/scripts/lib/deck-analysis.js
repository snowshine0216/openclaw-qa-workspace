"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const { normalizeRawCaptions } = require("./caption-image");
const { convertDocumentToMarkdown } = require("./document-summary");
const { renderSlideSnapshots, renderSlides } = require("./render-slides");
const { determineVisualRole } = require("./slide-transcript");

const PPTX_SKILL_DIR = path.resolve(__dirname, "..", "..", "..", "pptx");
const UNPACK_SCRIPT = path.join(PPTX_SKILL_DIR, "scripts", "office", "unpack.py");

function runStep(command, args) {
  const result = spawnSync(command, args, { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || result.stdout.trim() || `${command} failed`);
  }
}

function unpackDeck(inputDeckPath, unpackedRoot) {
  try {
    runStep("python3", [UNPACK_SCRIPT, inputDeckPath, unpackedRoot]);
    return "pptx_skill_unpack";
  } catch {
    runStep("unzip", ["-qq", inputDeckPath, "-d", unpackedRoot]);
    return "zip_fallback_unpack";
  }
}

function listSlideFiles(unpackedRoot) {
  const slidesDir = path.join(unpackedRoot, "ppt", "slides");
  if (!fs.existsSync(slidesDir)) {
    return [];
  }
  return fs
    .readdirSync(slidesDir)
    .filter((name) => /^slide\d+\.xml$/i.test(name))
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));
}

function extractTextRuns(xml) {
  return Array.from(xml.matchAll(/<a:t[^>]*>(.*?)<\/a:t>/g))
    .map((match) => decodeXml(match[1]).trim())
    .filter(Boolean);
}

function decodeXml(value) {
  return String(value)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

function inferVisualAssets(xml, rels = "") {
  const assets = [];
  if (/<c:chart\b/.test(xml) || /chart/i.test(rels)) {
    assets.push("chart");
  }
  if (/<a:blip\b/.test(xml) || /media\//i.test(rels)) {
    assets.push("image");
  }
  return assets;
}

function inferRole(slideNumber, headline) {
  if (slideNumber === 1 || /review|summary|title/i.test(headline)) {
    return "title";
  }
  if (/decision|next step|recommendation/i.test(headline)) {
    return "recommendation";
  }
  return "content";
}

function contentHash(filePath) {
  if (!filePath || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return null;
  }
  const crypto = require("crypto");
  return `sha256:${crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex")}`;
}

function parseRelationshipTargets(rels, unpackedRoot) {
  return Array.from(rels.matchAll(/<Relationship[^>]+Id="([^"]+)"[^>]+Target="([^"]+)"[^>]+(?:Type="([^"]+)")?[^>]*\/?>/g)).map(
    (match) => {
      const target = match[2];
      const normalizedTarget = target.replace(/^\.\.\//, "ppt/");
      const absoluteTarget = path.resolve(unpackedRoot, "ppt", "slides", target);
      return {
        relationship_id: match[1],
        target: normalizedTarget,
        type: match[3] || "",
        content_hash: contentHash(absoluteTarget)
      };
    }
  );
}

function extractLayoutAnchor(xml) {
  const titleBox = xml.match(/<p:sp\b[\s\S]*?<a:t>([^<]+)<\/a:t>/i);
  const shapeIds = Array.from(xml.matchAll(/<(p:sp|p:pic)[^>]*>([\s\S]*?)<\/\1>/g));
  const titleShape = shapeIds.find((match) => /<a:t>/.test(match[2])) || null;
  const imageShape = shapeIds.find((match) => match[1] === "p:pic") || null;

  return {
    title_box: titleShape ? `shape:${titleShape[1]}1` : titleBox ? "shape:title" : null,
    body_box: shapeIds.length > 1 ? `shape:${shapeIds[1][1]}2` : null,
    image_box: imageShape ? `shape:${imageShape[1]}1` : null
  };
}

function extractSpeakerNotes(runRoot, unpackedRoot, relTargets) {
  const notesRel = relTargets.find((entry) => /notes/i.test(entry.target) || /notes/i.test(entry.type));
  if (!notesRel) {
    return {
      speaker_notes_present: false,
      speaker_notes_path: "",
      speaker_notes_text: ""
    };
  }

  const notesPath = path.resolve(unpackedRoot, "ppt", "slides", notesRel.target);
  if (!fs.existsSync(notesPath)) {
    return {
      speaker_notes_present: true,
      speaker_notes_path: path.relative(runRoot, notesPath).replace(/\\/g, "/"),
      speaker_notes_text: ""
    };
  }

  return {
    speaker_notes_present: true,
    speaker_notes_path: path.relative(runRoot, notesPath).replace(/\\/g, "/"),
    speaker_notes_text: extractTextRuns(fs.readFileSync(notesPath, "utf8")).join(" ")
  };
}

function buildSlideRecord(runRoot, unpackedRoot, slideFile, renderDir) {
  const slideNumber = Number(slideFile.match(/slide(\d+)\.xml/i)[1]);
  const slidePath = path.join(unpackedRoot, "ppt", "slides", slideFile);
  const relsPath = path.join(unpackedRoot, "ppt", "slides", "_rels", `${slideFile}.rels`);
  const xml = fs.readFileSync(slidePath, "utf8");
  const rels = fs.existsSync(relsPath) ? fs.readFileSync(relsPath, "utf8") : "";
  const texts = extractTextRuns(xml);
  const headline = texts[0] || `Slide ${slideNumber}`;
  const relationshipTargets = parseRelationshipTargets(rels, unpackedRoot);
  const notesReferenced = relationshipTargets.some((entry) => /notes/i.test(entry.target) || /notes/i.test(entry.type));
  const mediaReferenced = relationshipTargets.map((entry) => entry.target);
  const sourceMediaRefs = relationshipTargets.filter((entry) => /media\//i.test(entry.target));
  const layoutAnchor = extractLayoutAnchor(xml);
  const speakerNotes = extractSpeakerNotes(runRoot, unpackedRoot, relationshipTargets);
  const imagePath = path.join(renderDir, `slide-${String(slideNumber).padStart(2, "0")}.jpg`);
  const role = inferRole(slideNumber, headline);
  const visualAssets = inferVisualAssets(xml, rels);
  const visualRole = determineVisualRole({
    title: headline,
    role,
    visualAssets
  });

  return {
    slide_number: slideNumber,
    xml_path: path.relative(runRoot, slidePath).replace(/\\/g, "/"),
    rels_path: path.relative(runRoot, relsPath).replace(/\\/g, "/"),
    notes: notesReferenced,
    media: mediaReferenced,
    headline,
    body_lines: texts.slice(1),
    role,
    layout_summary: texts.length > 4 ? "headline with dense body content" : "headline with supporting content",
    visual_assets: visualAssets,
    visual_role: visualRole,
    has_existing_media: sourceMediaRefs.length > 0,
    source_media_refs: sourceMediaRefs,
    layout_anchor: layoutAnchor,
    notes_path: speakerNotes.speaker_notes_path,
    speaker_notes_present: speakerNotes.speaker_notes_present,
    speaker_notes_text: speakerNotes.speaker_notes_text,
    notes_text: speakerNotes.speaker_notes_text,
    style_notes: slideNumber === 1 ? ["Source deck title treatment", "Left aligned title"] : ["Source deck styling"],
    preserve: slideNumber === 1 ? ["headline position", "title hierarchy"] : ["existing layout"],
    issues: slideNumber === 1 ? [] : ["Review factual freshness against requested change"],
    image_path: imagePath
  };
}

function writePlaceholderRenders(renderDir, slides) {
  fs.mkdirSync(renderDir, { recursive: true });
  slides.forEach((slide) => {
    fs.writeFileSync(slide.image_path, `placeholder render for slide ${slide.slide_number}: ${slide.headline}\n`);
  });
}

function buildOriginalText(slides) {
  const lines = ["# Original Deck Text", ""];
  slides.forEach((slide) => {
    lines.push(`## Slide ${slide.slide_number}: ${slide.headline}`);
    slide.body_lines.forEach((line) => lines.push(`- ${line}`));
    lines.push("");
  });
  return lines.join("\n");
}

async function analyzeDeck({ runRoot, deckPath, documentToMarkdown = convertDocumentToMarkdown }) {
  const inputDeckPath = path.join(runRoot, "input", "original.pptx");
  const unpackedRoot = path.join(runRoot, "working", "unpacked");
  const renderDir = path.join(runRoot, "renders", "before");
  const originalTextPath = path.join(runRoot, "artifacts", "original-text.md");
  let markitdownError = null;

  fs.copyFileSync(deckPath, inputDeckPath);
  try {
    await documentToMarkdown(inputDeckPath, originalTextPath);
  } catch (error) {
    if (/PptxConverter|MissingDependencyException|dependencies needed to read \.pptx/i.test(error.message)) {
      markitdownError = error;
    } else {
      throw new Error(`markitdown extraction failed: ${error.message}`);
    }
  }
  fs.rmSync(unpackedRoot, { recursive: true, force: true });
  fs.mkdirSync(unpackedRoot, { recursive: true });
  const unpackMode = unpackDeck(inputDeckPath, unpackedRoot);
  const renderSummary = renderSlides({
    outputPath: inputDeckPath,
    renderDir
  });

  const slides = listSlideFiles(unpackedRoot).map((slideFile) =>
    buildSlideRecord(runRoot, unpackedRoot, slideFile, renderDir)
  );
  if (slides.length === 0) {
    throw new Error("No extractable slide content found");
  }
  const effectiveRender = renderSummary.renderCount === 0
    ? renderSlideSnapshots({ slides, renderDir })
    : renderSummary;

  const slideIndexPath = path.join(runRoot, "artifacts", "original-slide-index.json");
  const rawCaptionsPath = path.join(runRoot, "artifacts", "raw-slide-captions.json");
  const slideAnalysisPath = path.join(runRoot, "artifacts", "slide_analysis.json");
  const sourceMediaIndexPath = path.join(runRoot, "artifacts", "source-media-index.json");

  if (!fs.existsSync(originalTextPath)) {
    const fallbackText = markitdownError
      ? [
          "> markitdown could not extract PPTX text from the repo-local .venv; using structural fallback extraction.",
          "",
          buildOriginalText(slides)
        ].join("\n")
      : buildOriginalText(slides);
    fs.writeFileSync(originalTextPath, fallbackText);
  }

  fs.writeFileSync(
    slideIndexPath,
    JSON.stringify(
      slides.map((slide) => ({
        slide_number: slide.slide_number,
        xml_path: slide.xml_path,
        rels_path: slide.rels_path,
        notes: slide.notes,
        media: slide.media,
        source_media_refs: slide.source_media_refs,
        layout_anchor: slide.layout_anchor
      })),
      null,
      2
    )
  );
  fs.writeFileSync(
    sourceMediaIndexPath,
    JSON.stringify(
      slides.map((slide) => ({
        slide_number: slide.slide_number,
        source_media_refs: slide.source_media_refs,
        layout_anchor: slide.layout_anchor,
        speaker_notes_present: slide.speaker_notes_present,
        notes_path: slide.notes_path
      })),
      null,
      2
    )
  );

  const rawCaptions = {
    generated_by: "heuristic-slide-analysis",
    slides: slides.map((slide) => ({
      slide_number: slide.slide_number,
      image_path: slide.image_path,
      role: slide.role,
      visual_role: slide.visual_role,
      headline: slide.headline,
      layout_summary: slide.layout_summary,
      visual_assets: slide.visual_assets,
      has_existing_media: slide.has_existing_media,
      source_media_refs: slide.source_media_refs,
      layout_anchor: slide.layout_anchor,
      speaker_notes_present: slide.speaker_notes_present,
      speaker_notes_text: slide.speaker_notes_text,
      notes_path: slide.notes_path,
      readability_risks: slide.body_lines.length > 6 ? ["text density is high"] : [],
      style_notes: slide.style_notes,
      preserve: slide.preserve,
      issues: slide.issues
    }))
  };

  fs.writeFileSync(rawCaptionsPath, JSON.stringify(rawCaptions, null, 2));
  fs.writeFileSync(slideAnalysisPath, JSON.stringify(normalizeRawCaptions(rawCaptions), null, 2));

  return {
    originalTextPath,
    slideIndexPath,
    rawCaptionsPath,
    slideAnalysisPath,
    sourceMediaIndexPath,
    slideCount: slides.length,
    unpackMode,
    renderMode: effectiveRender.mode
  };
}

module.exports = {
  analyzeDeck,
  buildOriginalText
};
