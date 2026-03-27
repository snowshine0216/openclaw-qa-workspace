"use strict";

// Unit tests for each exported function in merge-back.js.
//
// Covers:
//   extractSlidePackage — extracts slide XML, rels, and media from unpacked dir
//   allocateNonConflictingIds — resolves non-conflicting rId and slideId
//   updatePresentationXml — inserts or replaces sldId entry, validates order
//   updateContentTypes — adds Override entry, idempotent, fail-closed
//   copyMediaDependencies — copies only referenced media, skips same-hash duplicates
//   validateNeighboringSlides — detects neighbor drift, fail-closed

const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");

const {
  extractSlidePackage,
  allocateNonConflictingIds,
  updatePresentationXml,
  updateContentTypes,
  copyMediaDependencies,
  validateNeighboringSlides
} = require("../scripts/lib/merge-back");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function tmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "ppt-merge-back-"));
}

function buildUnpacked(dir, slideCount) {
  const pptDir = path.join(dir, "ppt");
  const slidesDir = path.join(pptDir, "slides");
  const slidesRelsDir = path.join(slidesDir, "_rels");
  const pptRelsDir = path.join(pptDir, "_rels");
  fs.mkdirSync(slidesRelsDir, { recursive: true });
  fs.mkdirSync(pptRelsDir, { recursive: true });

  const slideEntries = [];
  const relEntries = [];
  const ctEntries = [];

  for (let i = 1; i <= slideCount; i++) {
    const slideFile = `slide${i}.xml`;
    const rid = `rId${i}`;
    const slideId = 255 + i;

    fs.writeFileSync(
      path.join(slidesDir, slideFile),
      `<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree/></p:cSld></p:sld>`
    );
    fs.writeFileSync(
      path.join(slidesRelsDir, `${slideFile}.rels`),
      `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>`
    );

    slideEntries.push(`<p:sldId id="${slideId}" r:id="${rid}"/>`);
    relEntries.push(
      `<Relationship Id="${rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/${slideFile}"/>`
    );
    ctEntries.push(
      `  <Override PartName="/ppt/slides/${slideFile}" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`
    );
  }

  const presentationXml = [
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`,
    `<p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"`,
    `                xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">`,
    `  <p:sldIdLst>`,
    ...slideEntries.map(e => `    ${e}`),
    `  </p:sldIdLst>`,
    `</p:presentation>`
  ].join("\n");

  const relsXml = [
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`,
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">`,
    ...relEntries.map(e => `  ${e}`),
    `</Relationships>`
  ].join("\n");

  const contentTypesXml = [
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`,
    `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">`,
    ...ctEntries,
    `</Types>`
  ].join("\n");

  fs.writeFileSync(path.join(pptDir, "presentation.xml"), presentationXml);
  fs.writeFileSync(path.join(pptRelsDir, "presentation.xml.rels"), relsXml);
  fs.writeFileSync(path.join(dir, "[Content_Types].xml"), contentTypesXml);

  return { slidesDir, pptDir, pptRelsDir };
}

function fileHash(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

// ---------------------------------------------------------------------------
// extractSlidePackage
// ---------------------------------------------------------------------------

test("extractSlidePackage extracts slide XML, rels, and referenced media", () => {
  const dir = tmpDir();
  buildUnpacked(dir, 1);

  const result = extractSlidePackage(dir, "slide1.xml");

  assert.ok(result.slideXml.includes("<p:sld"), "slide XML must be extracted");
  assert.equal(result.slideFile, "slide1.xml");
  assert.ok(typeof result.slideRels === "string" || result.slideRels === null);
  assert.ok(Array.isArray(result.referencedMedia), "referencedMedia must be array");
});

test("extractSlidePackage throws if source package path does not exist", () => {
  assert.throws(
    () => extractSlidePackage("/nonexistent/path", "slide1.xml"),
    /does not exist/i
  );
});

test("extractSlidePackage throws if target slide file is not present in package", () => {
  const dir = tmpDir();
  buildUnpacked(dir, 1);

  assert.throws(
    () => extractSlidePackage(dir, "slide99.xml"),
    /not present in package/i
  );
});

// ---------------------------------------------------------------------------
// allocateNonConflictingIds
// ---------------------------------------------------------------------------

test("allocateNonConflictingIds returns candidate rId when not taken", () => {
  const dir = tmpDir();
  buildUnpacked(dir, 2); // rId1, rId2 exist

  const { rid } = allocateNonConflictingIds(dir, "rId99", 999);
  assert.equal(rid, "rId99");
});

test("allocateNonConflictingIds returns non-conflicting rId when candidate is already taken", () => {
  const dir = tmpDir();
  buildUnpacked(dir, 2); // rId1, rId2 exist

  const { rid } = allocateNonConflictingIds(dir, "rId1", 999);
  assert.notEqual(rid, "rId1");
  assert.notEqual(rid, "rId2");
  assert.match(rid, /^rId\d+$/);
});

test("allocateNonConflictingIds returns candidate slideId when not taken", () => {
  const dir = tmpDir();
  buildUnpacked(dir, 2); // slideIds 256, 257 exist

  const { slideId } = allocateNonConflictingIds(dir, "rId99", 999);
  assert.equal(slideId, 999);
});

test("allocateNonConflictingIds returns non-conflicting slideId when candidate is already taken", () => {
  const dir = tmpDir();
  buildUnpacked(dir, 2); // slideIds 256, 257 exist

  const { slideId } = allocateNonConflictingIds(dir, "rId99", 256);
  assert.notEqual(slideId, 256);
  assert.notEqual(slideId, 257);
});

test("[CRITICAL] allocateNonConflictingIds throws structured error if ID space exhausted", () => {
  // Build a deck with rId1 through rId1001 to exhaust the search space
  const dir = tmpDir();
  buildUnpacked(dir, 3);

  // Manually jam the rels file to contain rId1 through rId1001
  const relsPath = path.join(dir, "ppt", "_rels", "presentation.xml.rels");
  const existingIds = Array.from({ length: 1002 }, (_, i) => `rId${i + 1}`);
  const jammedRels = [
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`,
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">`,
    ...existingIds.map(id =>
      `  <Relationship Id="${id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide1.xml"/>`
    ),
    `</Relationships>`
  ].join("\n");
  fs.writeFileSync(relsPath, jammedRels);

  assert.throws(
    () => allocateNonConflictingIds(dir, "rId1", 999),
    /MERGE_BACK_ID_COLLISION/
  );
});

// ---------------------------------------------------------------------------
// updatePresentationXml
// ---------------------------------------------------------------------------

test("updatePresentationXml insert_after inserts new sldId entry after target", () => {
  const dir = tmpDir();
  buildUnpacked(dir, 2);

  // Write the new slide file
  fs.writeFileSync(
    path.join(dir, "ppt", "slides", "slide3.xml"),
    `<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"></p:sld>`
  );

  const result = updatePresentationXml(dir, "slide3.xml", "rId99", 999, "insert_after", "slide1.xml");

  assert.equal(result.slidesAfter.length, 3);
  const slide1Pos = result.slidesAfter.indexOf("slide1.xml");
  const slide3Pos = result.slidesAfter.indexOf("slide3.xml");
  assert.ok(slide3Pos === slide1Pos + 1, "new slide must be immediately after target");
});

test("updatePresentationXml replace_existing replaces target entry in-place", () => {
  const dir = tmpDir();
  buildUnpacked(dir, 3);

  // Write the replacement slide file
  fs.writeFileSync(
    path.join(dir, "ppt", "slides", "slide2.xml"),
    `<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld></p:cSld></p:sld>`
  );

  const result = updatePresentationXml(dir, "slide2.xml", "rId99", 999, "replace_existing", "slide2.xml");

  assert.equal(result.slidesAfter.length, 3, "slide count must remain 3 after replace");
  assert.ok(result.slidesAfter.includes("slide1.xml"), "slide1 must be preserved");
  assert.ok(result.slidesAfter.includes("slide3.xml"), "slide3 must be preserved");
});

test("[CRITICAL] updatePresentationXml throws if resulting slide order is broken after replace_existing", () => {
  const dir = tmpDir();
  buildUnpacked(dir, 2);

  // Pass a targetSlideFile that doesn't exist in the presentation to cause corruption
  assert.throws(
    () => updatePresentationXml(dir, "slide99.xml", "rId99", 999, "replace_existing", "slide99.xml"),
    /target slide not found/i
  );
});

test("updatePresentationXml throws if actionKind is not insert_after or replace_existing", () => {
  const dir = tmpDir();
  buildUnpacked(dir, 2);

  assert.throws(
    () => updatePresentationXml(dir, "slide3.xml", "rId99", 999, "invalid_action", "slide1.xml"),
    /invalid actionKind/i
  );
});

// ---------------------------------------------------------------------------
// updateContentTypes
// ---------------------------------------------------------------------------

test("updateContentTypes adds Override entry when missing", () => {
  const dir = tmpDir();
  buildUnpacked(dir, 2);

  // New slide not yet in content types
  updateContentTypes(dir, "slide99.xml");

  const ct = fs.readFileSync(path.join(dir, "[Content_Types].xml"), "utf8");
  assert.ok(ct.includes("/ppt/slides/slide99.xml"), "Override must be added");
});

test("updateContentTypes is idempotent when entry already exists", () => {
  const dir = tmpDir();
  buildUnpacked(dir, 2);

  updateContentTypes(dir, "slide1.xml");
  const ctAfterFirst = fs.readFileSync(path.join(dir, "[Content_Types].xml"), "utf8");

  updateContentTypes(dir, "slide1.xml");
  const ctAfterSecond = fs.readFileSync(path.join(dir, "[Content_Types].xml"), "utf8");

  assert.equal(ctAfterFirst, ctAfterSecond, "second call must not change the file");
});

test("[CRITICAL] updateContentTypes throws if [Content_Types].xml does not exist", () => {
  const dir = tmpDir();
  buildUnpacked(dir, 1);
  fs.rmSync(path.join(dir, "[Content_Types].xml"));

  assert.throws(
    () => updateContentTypes(dir, "slide1.xml"),
    /MERGE_BACK_CONTENT_TYPES_MISSING/
  );
});

// ---------------------------------------------------------------------------
// copyMediaDependencies
// ---------------------------------------------------------------------------

test("copyMediaDependencies copies only referenced media files", () => {
  const srcDir = tmpDir();
  const dstDir = tmpDir();

  // Create media in source
  const mediaDir = path.join(srcDir, "ppt", "media");
  fs.mkdirSync(mediaDir, { recursive: true });
  fs.writeFileSync(path.join(mediaDir, "image1.png"), Buffer.from([0x89, 0x50, 0x4e, 0x47]));
  fs.writeFileSync(path.join(mediaDir, "image2.png"), Buffer.from([0x89, 0x50, 0x4e, 0x48]));

  const referencedMedia = [{ file: "image1.png" }];
  copyMediaDependencies(srcDir, dstDir, referencedMedia);

  const dstMediaDir = path.join(dstDir, "ppt", "media");
  assert.ok(fs.existsSync(path.join(dstMediaDir, "image1.png")), "referenced media must be copied");
  assert.ok(!fs.existsSync(path.join(dstMediaDir, "image2.png")), "unreferenced media must not be copied");
});

test("copyMediaDependencies skips media files that already exist with same content hash", () => {
  const srcDir = tmpDir();
  const dstDir = tmpDir();

  const srcMediaDir = path.join(srcDir, "ppt", "media");
  const dstMediaDir = path.join(dstDir, "ppt", "media");
  fs.mkdirSync(srcMediaDir, { recursive: true });
  fs.mkdirSync(dstMediaDir, { recursive: true });

  const content = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
  fs.writeFileSync(path.join(srcMediaDir, "image1.png"), content);
  fs.writeFileSync(path.join(dstMediaDir, "image1.png"), content);

  const mtimeBefore = fs.statSync(path.join(dstMediaDir, "image1.png")).mtimeMs;

  const referencedMedia = [{ file: "image1.png" }];
  const { skipped } = copyMediaDependencies(srcDir, dstDir, referencedMedia);

  assert.ok(skipped.includes("image1.png"), "same-hash file must be skipped");
  // File must not be re-written (verify by comparing content)
  const dstContent = fs.readFileSync(path.join(dstMediaDir, "image1.png"));
  assert.deepEqual(dstContent, content);
});

test("copyMediaDependencies does not copy unreferenced media from source package", () => {
  const srcDir = tmpDir();
  const dstDir = tmpDir();

  const srcMediaDir = path.join(srcDir, "ppt", "media");
  fs.mkdirSync(srcMediaDir, { recursive: true });
  fs.writeFileSync(path.join(srcMediaDir, "referenced.png"), Buffer.from([0x01]));
  fs.writeFileSync(path.join(srcMediaDir, "unreferenced.png"), Buffer.from([0x02]));

  copyMediaDependencies(srcDir, dstDir, [{ file: "referenced.png" }]);

  const dstMediaDir = path.join(dstDir, "ppt", "media");
  assert.ok(!fs.existsSync(path.join(dstMediaDir, "unreferenced.png")));
});

// ---------------------------------------------------------------------------
// validateNeighboringSlides
// ---------------------------------------------------------------------------

test("validateNeighboringSlides passes when neighbors are structurally unchanged", () => {
  const dir = tmpDir();
  buildUnpacked(dir, 3);

  // Compute hashes of slide1 and slide3 (neighbors of slide2)
  const slide1Hash = fileHash(path.join(dir, "ppt", "slides", "slide1.xml"));
  const slide3Hash = fileHash(path.join(dir, "ppt", "slides", "slide3.xml"));

  const originalSlideIndex = [
    { slide_number: 1, xml_hash: slide1Hash },
    { slide_number: 3, xml_hash: slide3Hash }
  ];

  // Should not throw
  const result = validateNeighboringSlides(dir, 2, originalSlideIndex);
  assert.ok(result.passed);
});

test("[CRITICAL] validateNeighboringSlides throws structured error when neighbor XML hash differs", () => {
  const dir = tmpDir();
  buildUnpacked(dir, 3);

  // Use an incorrect hash for slide1 to simulate drift
  const originalSlideIndex = [
    { slide_number: 1, xml_hash: "incorrect-hash-value" },
    { slide_number: 3, xml_hash: "incorrect-hash-value" }
  ];

  assert.throws(
    () => validateNeighboringSlides(dir, 2, originalSlideIndex),
    /MERGE_BACK_NEIGHBOR_DRIFT/
  );
});

test("validateNeighboringSlides handles edge case: first slide (no N-1 neighbor)", () => {
  const dir = tmpDir();
  buildUnpacked(dir, 3);

  const slide2Hash = fileHash(path.join(dir, "ppt", "slides", "slide2.xml"));
  const originalSlideIndex = [
    { slide_number: 2, xml_hash: slide2Hash }
  ];

  // Slide 1 is target, no N-1 neighbor — should only check N+1 (slide2)
  const result = validateNeighboringSlides(dir, 1, originalSlideIndex);
  assert.ok(result.passed);
});

test("validateNeighboringSlides handles edge case: last slide (no N+1 neighbor)", () => {
  const dir = tmpDir();
  buildUnpacked(dir, 3);

  const slide2Hash = fileHash(path.join(dir, "ppt", "slides", "slide2.xml"));
  const originalSlideIndex = [
    { slide_number: 2, xml_hash: slide2Hash }
  ];

  // Slide 3 is target, no N+1 neighbor — should only check N-1 (slide2)
  const result = validateNeighboringSlides(dir, 3, originalSlideIndex);
  assert.ok(result.passed);
});
