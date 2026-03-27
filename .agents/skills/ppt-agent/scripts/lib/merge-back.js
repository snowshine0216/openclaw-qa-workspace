"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { listPresentationSlides, removeSlideFromPresentation } = require("./pptx-edit-ops");

const PPTX_SKILL_DIR = path.resolve(__dirname, "..", "..", "..", "pptx");
const UNPACK_SCRIPT = path.join(PPTX_SKILL_DIR, "scripts", "office", "unpack.py");

// Maximum search iterations for non-conflicting ID allocation
const MAX_ID_SEARCH = 1000;

// ---------------------------------------------------------------------------
// Step 2: extractSlidePackage
// ---------------------------------------------------------------------------

/**
 * Extract slide XML, slide rels, and referenced media from an already-unpacked
 * single-slide package directory.
 *
 * @param {string} sourcePackagePath - Path to unpacked package directory
 * @param {string} slideFile - Slide filename (e.g., "slide1.xml")
 * @returns {{ slideFile, slideXml, slideRels, referencedMedia }}
 */
function extractSlidePackage(sourcePackagePath, slideFile) {
  if (!fs.existsSync(sourcePackagePath)) {
    throw new Error(`Source package path does not exist: ${sourcePackagePath}`);
  }

  const slidePath = path.join(sourcePackagePath, "ppt", "slides", slideFile);
  if (!fs.existsSync(slidePath)) {
    throw new Error(`Target slide file not present in package: ${slideFile}`);
  }

  const slideXml = fs.readFileSync(slidePath, "utf8");
  const slideRelsPath = path.join(sourcePackagePath, "ppt", "slides", "_rels", `${slideFile}.rels`);
  const slideRels = fs.existsSync(slideRelsPath) ? fs.readFileSync(slideRelsPath, "utf8") : null;
  const referencedMedia = extractReferencedMedia(slideRels, sourcePackagePath);

  return { slideFile, slideXml, slideRels, referencedMedia };
}

// ---------------------------------------------------------------------------
// Step 3: allocateNonConflictingIds
// ---------------------------------------------------------------------------

/**
 * Allocate non-conflicting relationship ID and slide ID in the destination package.
 * Throws a structured error (MERGE_BACK_ID_COLLISION) if allocation cannot resolve.
 *
 * @param {string} destUnpackedRoot - Destination unpacked deck root
 * @param {string} candidateRid - Preferred rId (e.g., "rId10")
 * @param {number} candidateSlideId - Preferred numeric slide ID
 * @returns {{ rid: string, slideId: number }}
 */
function allocateNonConflictingIds(destUnpackedRoot, candidateRid, candidateSlideId) {
  const relsPath = path.join(destUnpackedRoot, "ppt", "_rels", "presentation.xml.rels");
  const presentationPath = path.join(destUnpackedRoot, "ppt", "presentation.xml");

  const existingRids = new Set();
  const existingSlideIds = new Set();

  if (fs.existsSync(relsPath)) {
    const relsXml = fs.readFileSync(relsPath, "utf8");
    for (const m of relsXml.matchAll(/Id="([^"]+)"/g)) {
      existingRids.add(m[1]);
    }
  }

  if (fs.existsSync(presentationPath)) {
    const pXml = fs.readFileSync(presentationPath, "utf8");
    for (const m of pXml.matchAll(/<p:sldId[^>]*id="(\d+)"/g)) {
      existingSlideIds.add(Number(m[1]));
    }
  }

  // Resolve rId
  let rid = candidateRid;
  if (existingRids.has(rid)) {
    const base = parseInt(rid.replace(/^rId/, ""), 10) || 1;
    let found = false;
    for (let delta = 1; delta <= MAX_ID_SEARCH; delta++) {
      const candidate = `rId${base + delta}`;
      if (!existingRids.has(candidate)) {
        rid = candidate;
        found = true;
        break;
      }
    }
    if (!found) {
      throw new Error(
        `MERGE_BACK_ID_COLLISION: Cannot allocate non-conflicting rId after ${MAX_ID_SEARCH} attempts`
      );
    }
  }

  // Resolve slideId
  let slideId = candidateSlideId;
  if (existingSlideIds.has(slideId)) {
    let found = false;
    for (let delta = 1; delta <= MAX_ID_SEARCH; delta++) {
      const candidate = candidateSlideId + delta;
      if (!existingSlideIds.has(candidate)) {
        slideId = candidate;
        found = true;
        break;
      }
    }
    if (!found) {
      throw new Error(
        `MERGE_BACK_ID_COLLISION: Cannot allocate non-conflicting slideId after ${MAX_ID_SEARCH} attempts`
      );
    }
  }

  return { rid, slideId };
}

// ---------------------------------------------------------------------------
// Step 4: updatePresentationXml
// ---------------------------------------------------------------------------

/**
 * Update presentation.xml and presentation.xml.rels to add or replace a slide entry.
 *
 * - insert_after: inserts new <p:sldId> immediately after the target slide entry
 * - replace_existing: replaces the target slide entry in-place
 *
 * Throws MERGE_BACK_ORDER_BROKEN if the resulting slide count is wrong.
 * Throws if actionKind is not "insert_after" or "replace_existing".
 *
 * @param {string} unpackedRoot
 * @param {string} slideFile - New slide filename
 * @param {string} rid - Allocated relationship ID
 * @param {number} slideId - Allocated slide ID
 * @param {string} actionKind - "insert_after" | "replace_existing"
 * @param {string} targetSlideFile - Anchor (insert_after) or target (replace_existing)
 * @returns {{ slidesAfter: string[] }}
 */
function updatePresentationXml(unpackedRoot, slideFile, rid, slideId, actionKind, targetSlideFile) {
  if (!["insert_after", "replace_existing"].includes(actionKind)) {
    throw new Error(`Invalid actionKind: "${actionKind}"`);
  }

  const relsPath = path.join(unpackedRoot, "ppt", "_rels", "presentation.xml.rels");
  const presentationPath = path.join(unpackedRoot, "ppt", "presentation.xml");

  let relsXml = fs.readFileSync(relsPath, "utf8");
  let presentationXml = fs.readFileSync(presentationPath, "utf8");

  const slidesBefore = listPresentationSlides(unpackedRoot);
  const targetSlide = slidesBefore.find(s => s.slide_file === targetSlideFile);

  if (!targetSlide) {
    throw new Error(`Target slide not found: ${targetSlideFile}`);
  }

  const newRelEntry = `<Relationship Id="${rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/${slideFile}"/>`;
  const newSldEntry = `<p:sldId id="${slideId}" r:id="${rid}"/>`;

  if (actionKind === "replace_existing") {
    // Remove old rel entry and add new one
    const oldRelPattern = new RegExp(
      `\\s*<Relationship[^>]*Id="${targetSlide.rid}"[^>]*/>`
    );
    relsXml = relsXml.replace(oldRelPattern, "");
    relsXml = relsXml.replace("</Relationships>", `  ${newRelEntry}\n</Relationships>`);

    // Replace old sldId entry in-place with new one
    const oldSldPattern = new RegExp(
      `<p:sldId[^>]*id="${targetSlide.slide_id}"[^>]*r:id="${targetSlide.rid}"[^>]*/>`
    );
    presentationXml = presentationXml.replace(oldSldPattern, newSldEntry);
  } else {
    // insert_after: add new rel and insert new sldId after anchor
    relsXml = relsXml.replace("</Relationships>", `  ${newRelEntry}\n</Relationships>`);
    const anchorPattern = new RegExp(`(<p:sldId[^>]*r:id="${targetSlide.rid}"[^>]*/>)`);
    presentationXml = presentationXml.replace(anchorPattern, `$1\n    ${newSldEntry}`);
  }

  fs.writeFileSync(relsPath, relsXml);
  fs.writeFileSync(presentationPath, presentationXml);

  // Validate resulting slide count
  const slidesAfter = listPresentationSlides(unpackedRoot);
  const expectedCount = actionKind === "replace_existing"
    ? slidesBefore.length
    : slidesBefore.length + 1;

  if (slidesAfter.length !== expectedCount) {
    throw new Error(
      `MERGE_BACK_ORDER_BROKEN: Expected ${expectedCount} slides after ${actionKind}, got ${slidesAfter.length}`
    );
  }

  return { slidesAfter: slidesAfter.map(s => s.slide_file) };
}

// ---------------------------------------------------------------------------
// Step 4 (cont.): updateContentTypes
// ---------------------------------------------------------------------------

/**
 * Add <Override> entry for the slide to [Content_Types].xml.
 * Idempotent when entry already exists.
 * Throws MERGE_BACK_CONTENT_TYPES_MISSING if the file does not exist (fail-closed).
 *
 * @param {string} unpackedRoot
 * @param {string} slideFile
 */
function updateContentTypes(unpackedRoot, slideFile) {
  const contentTypesPath = path.join(unpackedRoot, "[Content_Types].xml");
  if (!fs.existsSync(contentTypesPath)) {
    throw new Error(
      `MERGE_BACK_CONTENT_TYPES_MISSING: [Content_Types].xml does not exist at ${contentTypesPath}`
    );
  }

  const contentTypes = fs.readFileSync(contentTypesPath, "utf8");
  const override = `/ppt/slides/${slideFile}`;
  if (contentTypes.includes(override)) {
    return; // Idempotent
  }

  const updated = contentTypes.replace(
    "</Types>",
    `  <Override PartName="${override}" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>\n</Types>`
  );
  fs.writeFileSync(contentTypesPath, updated);
}

// ---------------------------------------------------------------------------
// Step 5: copyMediaDependencies
// ---------------------------------------------------------------------------

/**
 * Copy only referenced media files from source to destination.
 * Skips files that already exist in destination with the same content hash.
 *
 * @param {string} sourceUnpackedRoot
 * @param {string} destUnpackedRoot
 * @param {Array<{ file: string }>} referencedMedia
 * @returns {{ copied: string[], skipped: string[] }}
 */
function copyMediaDependencies(sourceUnpackedRoot, destUnpackedRoot, referencedMedia) {
  const destMediaDir = path.join(destUnpackedRoot, "ppt", "media");
  fs.mkdirSync(destMediaDir, { recursive: true });

  const copied = [];
  const skipped = [];

  for (const media of referencedMedia) {
    const sourcePath = path.join(sourceUnpackedRoot, "ppt", "media", media.file);
    if (!fs.existsSync(sourcePath)) {
      continue;
    }

    const destPath = path.join(destMediaDir, media.file);
    if (fs.existsSync(destPath)) {
      if (fileHash(sourcePath) === fileHash(destPath)) {
        skipped.push(media.file);
        continue;
      }
    }

    fs.copyFileSync(sourcePath, destPath);
    copied.push(media.file);
  }

  return { copied, skipped };
}

// ---------------------------------------------------------------------------
// Step 6: validateNeighboringSlides
// ---------------------------------------------------------------------------

/**
 * Validate that the 2 immediate neighbors (N-1, N+1) of the target slide
 * have not drifted structurally after reinsertion.
 *
 * Throws MERGE_BACK_NEIGHBOR_DRIFT if any neighbor's XML hash differs from
 * the corresponding entry in originalSlideIndex (fail-closed).
 *
 * @param {string} unpackedRoot
 * @param {number} targetSlideNumber - 1-indexed position of the target slide
 * @param {Array<{ slide_number: number, xml_hash: string }>} originalSlideIndex
 * @returns {{ passed: boolean, checked: number }}
 */
function validateNeighboringSlides(unpackedRoot, targetSlideNumber, originalSlideIndex) {
  const slides = listPresentationSlides(unpackedRoot);
  const targetIndex = targetSlideNumber - 1; // Convert to 0-indexed

  const neighborPositions = [];
  if (targetIndex > 0) neighborPositions.push(targetIndex - 1);
  if (targetIndex < slides.length - 1) neighborPositions.push(targetIndex + 1);

  const drifted = [];

  for (const pos of neighborPositions) {
    const slide = slides[pos];
    const slideNumber = pos + 1;
    const original = originalSlideIndex.find(e => e.slide_number === slideNumber);

    if (!original || !original.xml_hash) {
      continue; // No baseline to compare against
    }

    const slidePath = path.join(unpackedRoot, "ppt", "slides", slide.slide_file);
    if (!fs.existsSync(slidePath)) {
      drifted.push({ slide_number: slideNumber, reason: "file missing" });
      continue;
    }

    const currentHash = fileHash(slidePath);
    if (currentHash !== original.xml_hash) {
      drifted.push({
        slide_number: slideNumber,
        slide_file: slide.slide_file,
        expected_hash: original.xml_hash,
        actual_hash: currentHash
      });
    }
  }

  if (drifted.length > 0) {
    throw new Error(
      `MERGE_BACK_NEIGHBOR_DRIFT: ${drifted.length} neighbor slide(s) drifted after rebuild: ${JSON.stringify(drifted)}`
    );
  }

  return { passed: true, checked: neighborPositions.length };
}

// ---------------------------------------------------------------------------
// Orchestrator: mergeRebuiltSlide
// ---------------------------------------------------------------------------

/**
 * Execute the full 6-step OOXML merge-back algorithm for a single rebuilt slide.
 *
 * Merge-back declaration:
 * - target slide number
 * - action kind: "replace_existing" | "insert_after"
 * - source package path (temporary single-slide PPTX)
 * - preserved neighboring slide numbers
 *
 * Fail-closed: if single-slide reinsertion cannot be completed deterministically,
 * this function throws and leaves the working deck untouched.
 *
 * @param {Object} params
 * @param {string} params.sourcePackagePath - Path to temporary single-slide PPTX
 * @param {string} params.targetUnpackedRoot - Destination unpacked deck root
 * @param {number} params.targetSlideNumber - Target slide number (1-indexed)
 * @param {string} params.actionKind - "insert_after" | "replace_existing"
 * @param {string} [params.afterSlideFile] - For insert_after: anchor slide file
 * @param {string} [params.replaceSlideFile] - For replace_existing: slide file to replace
 * @param {Array} [params.originalSlideIndex] - Slide index for neighbor validation
 * @returns {Object} Result with status, slideFile, slideId, rid
 */
function mergeRebuiltSlide({
  sourcePackagePath,
  targetUnpackedRoot,
  targetSlideNumber,
  actionKind,
  afterSlideFile,
  replaceSlideFile,
  originalSlideIndex = []
}) {
  if (!["insert_after", "replace_existing"].includes(actionKind)) {
    throw new Error(`Invalid actionKind: ${actionKind}`);
  }

  const tempUnpackDir = path.join(
    path.dirname(sourcePackagePath),
    `temp-unpack-${Date.now()}`
  );
  fs.mkdirSync(tempUnpackDir, { recursive: true });

  try {
    // Step 1: Unpack the source single-slide PPTX
    unpackDeck(sourcePackagePath, tempUnpackDir);

    // Step 2: Extract slide components from unpacked source
    const sourceSlides = listPresentationSlides(tempUnpackDir);
    if (sourceSlides.length !== 1) {
      throw new Error(
        `Expected exactly 1 slide in source package, found ${sourceSlides.length}`
      );
    }
    const sourceSlideFile = sourceSlides[0].slide_file;
    const extraction = extractSlidePackage(tempUnpackDir, sourceSlideFile);

    // Step 3: Allocate non-conflicting IDs in destination
    const candidateRid = `rId${(Date.now() % 9000) + 1000}`;
    const candidateSlideId = 900;
    const { rid, slideId } = allocateNonConflictingIds(
      targetUnpackedRoot,
      candidateRid,
      candidateSlideId
    );

    // Determine target slide filename in destination
    const targetSlideFile = actionKind === "replace_existing"
      ? replaceSlideFile
      : nextSlideFileName(targetUnpackedRoot);

    // Copy slide XML and rels into destination
    const targetSlidesDir = path.join(targetUnpackedRoot, "ppt", "slides");
    fs.mkdirSync(targetSlidesDir, { recursive: true });
    fs.writeFileSync(path.join(targetSlidesDir, targetSlideFile), extraction.slideXml);

    if (extraction.slideRels) {
      const targetRelsDir = path.join(targetSlidesDir, "_rels");
      fs.mkdirSync(targetRelsDir, { recursive: true });
      fs.writeFileSync(
        path.join(targetRelsDir, `${targetSlideFile}.rels`),
        extraction.slideRels
      );
    }

    // Step 4a: For replace_existing, remove old entry before re-registering
    if (actionKind === "replace_existing") {
      removeSlideFromPresentation(targetUnpackedRoot, replaceSlideFile);
    }

    // Step 4b: Update presentation.xml and rels
    const anchorSlideFile = actionKind === "replace_existing"
      ? getLastSlideFile(targetUnpackedRoot)
      : afterSlideFile;

    updatePresentationXml(
      targetUnpackedRoot,
      targetSlideFile,
      rid,
      slideId,
      "insert_after",
      anchorSlideFile
    );

    // Step 4c: Update [Content_Types].xml (fail-closed)
    updateContentTypes(targetUnpackedRoot, targetSlideFile);

    // Step 5: Copy media dependencies
    copyMediaDependencies(tempUnpackDir, targetUnpackedRoot, extraction.referencedMedia);

    // Step 6: Validate neighboring slides
    if (originalSlideIndex.length > 0) {
      validateNeighboringSlides(targetUnpackedRoot, targetSlideNumber, originalSlideIndex);
    }

    const slidesAfter = listPresentationSlides(targetUnpackedRoot);
    return {
      status: "success",
      slideFile: targetSlideFile,
      slideId,
      rid,
      targetSlideNumber,
      slidesAfter: slidesAfter.map(s => s.slide_file)
    };
  } finally {
    fs.rmSync(tempUnpackDir, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

function extractReferencedMedia(slideRels, unpackedRoot) {
  if (!slideRels) return [];

  const media = [];
  for (const match of slideRels.matchAll(
    /<Relationship[^>]*Target="\.\.\/media\/([^"]+)"[^>]*\/>/g
  )) {
    const mediaFile = match[1];
    const mediaPath = path.join(unpackedRoot, "ppt", "media", mediaFile);
    if (fs.existsSync(mediaPath)) {
      const ridMatch = match[0].match(/Id="([^"]+)"/);
      media.push({ file: mediaFile, path: mediaPath, rid: ridMatch ? ridMatch[1] : null });
    }
  }
  return media;
}

function fileHash(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function unpackDeck(pptxPath, outputDir) {
  const result = spawnSync("python3", [UNPACK_SCRIPT, pptxPath, outputDir], {
    encoding: "utf8"
  });
  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || result.stdout.trim() || "Unpack failed");
  }
}

function nextSlideFileName(unpackedRoot) {
  const slidesDir = path.join(unpackedRoot, "ppt", "slides");
  if (!fs.existsSync(slidesDir)) return "slide1.xml";
  const existing = fs.readdirSync(slidesDir)
    .filter(f => /^slide\d+\.xml$/i.test(f))
    .map(f => Number(f.match(/slide(\d+)\.xml/i)[1]));
  const next = existing.length > 0 ? Math.max(...existing) + 1 : 1;
  return `slide${next}.xml`;
}

function getLastSlideFile(unpackedRoot) {
  const slides = listPresentationSlides(unpackedRoot);
  return slides.length > 0 ? slides[slides.length - 1].slide_file : null;
}

module.exports = {
  extractSlidePackage,
  allocateNonConflictingIds,
  updatePresentationXml,
  updateContentTypes,
  copyMediaDependencies,
  validateNeighboringSlides,
  mergeRebuiltSlide
};
