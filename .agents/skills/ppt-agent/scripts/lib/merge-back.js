"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const {
  listPresentationSlides,
  registerSlideInPresentation,
  removeSlideFromPresentation,
  nextRelationshipId,
  nextPresentationSlideId
} = require("./pptx-edit-ops");

const PPTX_SKILL_DIR = path.resolve(__dirname, "..", "..", "..", "pptx");
const UNPACK_SCRIPT = path.join(PPTX_SKILL_DIR, "scripts", "office", "unpack.py");

/**
 * 6-step OOXML merge-back algorithm for insert_after and replace_existing actions.
 *
 * @param {Object} params
 * @param {string} params.sourcePackagePath - Path to temporary single-slide deck
 * @param {string} params.targetUnpackedRoot - Destination unpacked deck root
 * @param {number} params.targetSlideNumber - Target slide number (1-indexed)
 * @param {string} params.actionKind - "insert_after" or "replace_existing"
 * @param {string} params.afterSlideFile - For insert_after, the slide file to insert after
 * @param {string} params.replaceSlideFile - For replace_existing, the slide file to replace
 * @returns {Object} Result with status and details
 */
async function mergeRebuiltSlide({
  sourcePackagePath,
  targetUnpackedRoot,
  targetSlideNumber,
  actionKind,
  afterSlideFile,
  replaceSlideFile
}) {
  if (!["insert_after", "replace_existing"].includes(actionKind)) {
    throw new Error(`Invalid actionKind: ${actionKind}`);
  }

  // Step 1: Unpack the temporary single-slide deck
  const tempUnpackDir = path.join(path.dirname(sourcePackagePath), "temp-unpack");
  fs.mkdirSync(tempUnpackDir, { recursive: true });

  try {
    unpackDeck(sourcePackagePath, tempUnpackDir);
  } catch (error) {
    throw new Error(`Failed to unpack source package: ${error.message}`);
  }

  // Step 2: Extract slide XML, rels, and media dependencies
  const extraction = extractSlideComponents(tempUnpackDir);

  // Step 3: Allocate non-conflicting IDs in destination
  const allocation = allocateNonConflictingIds({
    targetUnpackedRoot,
    actionKind,
    afterSlideFile,
    replaceSlideFile
  });

  // Step 4: Update presentation structure
  updatePresentationStructure({
    targetUnpackedRoot,
    actionKind,
    allocation,
    afterSlideFile,
    replaceSlideFile
  });

  // Step 5: Copy media and theme dependencies
  copyReferencedDependencies({
    tempUnpackDir,
    targetUnpackedRoot,
    extraction,
    allocation
  });

  // Step 6: Validate neighboring slides
  const validation = validateNeighboringSlides({
    targetUnpackedRoot,
    targetSlideNumber,
    actionKind
  });

  // Cleanup temp directory
  fs.rmSync(tempUnpackDir, { recursive: true, force: true });

  return {
    status: "success",
    slideFile: allocation.slideFile,
    slideId: allocation.slideId,
    rid: allocation.rid,
    validation
  };
}

/**
 * Unpack a PPTX file to a directory
 */
function unpackDeck(pptxPath, outputDir) {
  const result = spawnSync("python3", [UNPACK_SCRIPT, pptxPath, outputDir], {
    encoding: "utf8"
  });
  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || result.stdout.trim() || "Unpack failed");
  }
}

/**
 * Extract slide components from unpacked single-slide deck
 */
function extractSlideComponents(unpackedRoot) {
  const slidesDir = path.join(unpackedRoot, "ppt", "slides");
  const slideFiles = fs.readdirSync(slidesDir).filter(f => /^slide\d+\.xml$/i.test(f));

  if (slideFiles.length !== 1) {
    throw new Error(`Expected exactly 1 slide, found ${slideFiles.length}`);
  }

  const slideFile = slideFiles[0];
  const slidePath = path.join(slidesDir, slideFile);
  const slideXml = fs.readFileSync(slidePath, "utf8");

  // Extract slide rels
  const slideRelsPath = path.join(unpackedRoot, "ppt", "slides", "_rels", `${slideFile}.rels`);
  const slideRels = fs.existsSync(slideRelsPath) ? fs.readFileSync(slideRelsPath, "utf8") : null;

  // Extract referenced media
  const referencedMedia = extractReferencedMedia(slideRels, unpackedRoot);

  return {
    slideFile,
    slideXml,
    slideRels,
    referencedMedia
  };
}

/**
 * Extract referenced media from slide rels
 */
function extractReferencedMedia(slideRels, unpackedRoot) {
  if (!slideRels) return [];

  const media = [];
  const mediaPattern = /<Relationship[^>]*Target="\.\.\/media\/([^"]+)"[^>]*\/>/g;

  for (const match of slideRels.matchAll(mediaPattern)) {
    const mediaFile = match[1];
    const mediaPath = path.join(unpackedRoot, "ppt", "media", mediaFile);
    if (fs.existsSync(mediaPath)) {
      media.push({
        file: mediaFile,
        path: mediaPath,
        rid: match[0].match(/Id="([^"]+)"/)?.[1]
      });
    }
  }

  return media;
}

/**
 * Allocate non-conflicting IDs in destination package
 */
function allocateNonConflictingIds({
  targetUnpackedRoot,
  actionKind,
  afterSlideFile,
  replaceSlideFile
}) {
  const slides = listPresentationSlides(targetUnpackedRoot);

  let slideFile, slideId, rid;

  if (actionKind === "replace_existing") {
    const existing = slides.find(s => s.slide_file === replaceSlideFile);
    if (!existing) {
      throw new Error(`Slide to replace not found: ${replaceSlideFile}`);
    }
    slideFile = replaceSlideFile;
    slideId = existing.slide_id;
    rid = existing.rid;
  } else {
    // insert_after: allocate new IDs
    const maxSlideNum = Math.max(...slides.map(s => {
      const match = s.slide_file.match(/slide(\d+)\.xml/i);
      return match ? parseInt(match[1], 10) : 0;
    }), 0);
    slideFile = `slide${maxSlideNum + 1}.xml`;

    const relsPath = path.join(targetUnpackedRoot, "ppt", "_rels", "presentation.xml.rels");
    const presentationPath = path.join(targetUnpackedRoot, "ppt", "presentation.xml");

    if (fs.existsSync(relsPath) && fs.existsSync(presentationPath)) {
      const relsXml = fs.readFileSync(relsPath, "utf8");
      const presentationXml = fs.readFileSync(presentationPath, "utf8");

      const rids = Array.from(relsXml.matchAll(/Id="rId(\d+)"/g)).map(m => parseInt(m[1], 10));
      rid = `rId${rids.length > 0 ? Math.max(...rids) + 1 : 1}`;

      const slideIds = Array.from(presentationXml.matchAll(/<p:sldId[^>]*id="(\d+)"/g))
        .map(m => parseInt(m[1], 10));
      slideId = slideIds.length > 0 ? Math.max(...slideIds) + 1 : 256;
    } else {
      rid = "rId1";
      slideId = 256;
    }
  }

  return { slideFile, slideId, rid };
}

/**
 * Update presentation structure (presentation.xml, rels, Content_Types)
 */
function updatePresentationStructure({
  targetUnpackedRoot,
  actionKind,
  allocation,
  afterSlideFile,
  replaceSlideFile
}) {
  if (actionKind === "replace_existing") {
    // Remove old slide first
    removeSlideFromPresentation(targetUnpackedRoot, replaceSlideFile);
  }

  // Register new/replacement slide
  registerSlideInPresentation(
    targetUnpackedRoot,
    allocation.slideFile,
    afterSlideFile || replaceSlideFile
  );
}

/**
 * Copy referenced dependencies from source to target
 */
function copyReferencedDependencies({
  tempUnpackDir,
  targetUnpackedRoot,
  extraction,
  allocation
}) {
  const targetSlidesDir = path.join(targetUnpackedRoot, "ppt", "slides");
  const targetMediaDir = path.join(targetUnpackedRoot, "ppt", "media");

  fs.mkdirSync(targetSlidesDir, { recursive: true });
  fs.mkdirSync(targetMediaDir, { recursive: true });

  // Copy slide XML
  const targetSlidePath = path.join(targetSlidesDir, allocation.slideFile);
  fs.writeFileSync(targetSlidePath, extraction.slideXml);

  // Copy slide rels if present
  if (extraction.slideRels) {
    const targetSlideRelsDir = path.join(targetSlidesDir, "_rels");
    fs.mkdirSync(targetSlideRelsDir, { recursive: true });
    const targetSlideRelsPath = path.join(targetSlideRelsDir, `${allocation.slideFile}.rels`);
    fs.writeFileSync(targetSlideRelsPath, extraction.slideRels);
  }

  // Copy referenced media
  for (const media of extraction.referencedMedia) {
    const targetMediaPath = path.join(targetMediaDir, media.file);
    if (!fs.existsSync(targetMediaPath)) {
      fs.copyFileSync(media.path, targetMediaPath);
    }
  }
}

/**
 * Validate neighboring slides remain unchanged
 */
function validateNeighboringSlides({
  targetUnpackedRoot,
  targetSlideNumber,
  actionKind
}) {
  const slides = listPresentationSlides(targetUnpackedRoot);

  return {
    totalSlides: slides.length,
    slideOrder: slides.map(s => s.slide_file),
    targetSlideNumber,
    actionKind
  };
}

module.exports = {
  mergeRebuiltSlide
};
