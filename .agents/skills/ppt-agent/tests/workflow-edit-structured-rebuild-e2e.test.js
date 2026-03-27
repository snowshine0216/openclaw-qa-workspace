"use strict";

// E2E test: complete structured_rebuild workflow.
//
// Flow:
//   edit-run produces slide brief
//   → structured-slide-spec.js converts brief to structured spec
//   → renderer emits single-slide package at artifacts/rebuilt-slide-{N}.pptx
//   → merge-back inserts into working deck
//   → finalize produces output deck with rebuilt slide in correct position
//
// This test exercises the spec conversion and merge-back integration path using
// fake unpacked directories (no real PPTX build required).

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { buildStructuredSlideSpec } = require("../scripts/lib/structured-slide-spec");
const {
  extractSlidePackage,
  allocateNonConflictingIds,
  updatePresentationXml,
  updateContentTypes,
  copyMediaDependencies,
  validateNeighboringSlides
} = require("../scripts/lib/merge-back");
const { listPresentationSlides } = require("../scripts/lib/pptx-edit-ops");
const {
  COMPOSITION_FAMILY,
  RENDER_STRATEGY
} = require("../scripts/lib/shared-constants");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function tmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "ppt-e2e-"));
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

  fs.writeFileSync(path.join(pptDir, "presentation.xml"), [
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`,
    `<p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"`,
    `                xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">`,
    `  <p:sldIdLst>`,
    ...slideEntries.map(e => `    ${e}`),
    `  </p:sldIdLst>`,
    `</p:presentation>`
  ].join("\n"));

  fs.writeFileSync(path.join(pptRelsDir, "presentation.xml.rels"), [
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`,
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">`,
    ...relEntries.map(e => `  ${e}`),
    `</Relationships>`
  ].join("\n"));

  fs.writeFileSync(path.join(dir, "[Content_Types].xml"), [
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`,
    `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">`,
    ...ctEntries,
    `</Types>`
  ].join("\n"));
}

function buildSingleSlidePackage(dir, slideContent) {
  buildUnpacked(dir, 1);
  // Overwrite slide1 with the provided content to simulate a rebuilt slide
  fs.writeFileSync(
    path.join(dir, "ppt", "slides", "slide1.xml"),
    slideContent || `<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:sp><p:txBody><a:p><a:t>Rebuilt Slide</a:t></a:p></p:txBody></p:sp></p:spTree></p:cSld></p:sld>`
  );
}

// ---------------------------------------------------------------------------
// E2E: slide brief → structured spec conversion
// ---------------------------------------------------------------------------

test("E2E: buildStructuredSlideSpec converts edit-run slide brief to renderer-ready spec", () => {
  const slideBrief = {
    slide_number: 3,
    title: "Market Expansion Strategy",
    slide_goal: "Present geographic growth plan",
    composition_family: COMPOSITION_FAMILY.PROCESS_FLOW,
    on_slide_copy: ["EMEA: Q2", "APAC: Q3", "LATAM: Q4"],
    render_strategy: RENDER_STRATEGY.STRUCTURED_REBUILD
  };

  const spec = buildStructuredSlideSpec(slideBrief, null);

  assert.equal(spec.slide_number, 3);
  assert.equal(spec.layout, "process_flow");
  assert.deepEqual(spec.content.body_lines, ["EMEA: Q2", "APAC: Q3", "LATAM: Q4"]);
  assert.ok(spec.design_tokens, "design_tokens must be present");
});

test("E2E: theme tokens from source-theme-snapshot.json are applied to spec", () => {
  const slideBrief = {
    slide_number: 2,
    title: "Themed Slide",
    composition_family: COMPOSITION_FAMILY.COMPARISON_MATRIX,
    on_slide_copy: "Content"
  };

  const themeSnapshot = {
    font_tokens: { sans: "Calibri" },
    color_tokens: { accent: "#0070C0" },
    surface_tokens: {}
  };

  const spec = buildStructuredSlideSpec(slideBrief, themeSnapshot);

  assert.equal(spec.design_tokens.font_face_sans, "Calibri");
  assert.equal(spec.design_tokens.accent_color, "#0070C0");
});

test("E2E: spec falls back to default tokens when source-theme-snapshot is absent", () => {
  const slideBrief = {
    slide_number: 1,
    title: "No Theme",
    composition_family: COMPOSITION_FAMILY.EVIDENCE_PANEL,
    on_slide_copy: "Content"
  };

  const spec = buildStructuredSlideSpec(slideBrief, null);

  assert.equal(spec.design_tokens.font_face_sans, "Aptos");
  assert.equal(spec.design_tokens.accent_color, "#FA6611");
});

// ---------------------------------------------------------------------------
// E2E: single-slide package → merge-back into working deck
// ---------------------------------------------------------------------------

test("E2E: merge-back inserts rebuilt slide into working deck in correct position", () => {
  const workingDeck = tmpDir();
  buildUnpacked(workingDeck, 3); // slides 1, 2, 3

  const sourcePackage = tmpDir();
  buildSingleSlidePackage(sourcePackage);

  // Step 2: Extract slide from source package
  const extraction = extractSlidePackage(sourcePackage, "slide1.xml");
  assert.ok(extraction.slideXml, "slide XML must be extracted");

  // Step 3: Allocate non-conflicting IDs
  const { rid, slideId } = allocateNonConflictingIds(workingDeck, "rId99", 999);
  assert.ok(!["rId1", "rId2", "rId3"].includes(rid), "rid must not collide with existing");

  // Copy slide XML to destination
  const newSlideFile = "slide4.xml";
  fs.writeFileSync(
    path.join(workingDeck, "ppt", "slides", newSlideFile),
    extraction.slideXml
  );

  // Step 4: Update presentation
  const result = updatePresentationXml(
    workingDeck,
    newSlideFile,
    rid,
    slideId,
    "insert_after",
    "slide3.xml"
  );
  assert.equal(result.slidesAfter.length, 4, "deck must have 4 slides after insert");

  // Step 4c: Update content types
  updateContentTypes(workingDeck, newSlideFile);
  const ct = fs.readFileSync(path.join(workingDeck, "[Content_Types].xml"), "utf8");
  assert.ok(ct.includes(`/ppt/slides/${newSlideFile}`));

  // Step 5: Copy media (none in this test)
  const { copied } = copyMediaDependencies(sourcePackage, workingDeck, []);
  assert.equal(copied.length, 0);

  // Verify final deck order
  const slides = listPresentationSlides(workingDeck);
  assert.equal(slides.length, 4);
  assert.equal(slides[3].slide_file, newSlideFile, "rebuilt slide must be at position 4");
});

test("E2E: replace_existing keeps deck order stable while replacing only the target slide", () => {
  const workingDeck = tmpDir();
  buildUnpacked(workingDeck, 3); // slides 1, 2, 3

  const sourcePackage = tmpDir();
  buildSingleSlidePackage(sourcePackage, `<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree/></p:cSld></p:sld>`);

  const extraction = extractSlidePackage(sourcePackage, "slide1.xml");

  // Allocate new IDs
  const { rid, slideId } = allocateNonConflictingIds(workingDeck, "rId99", 999);

  // Overwrite the target slide XML
  fs.writeFileSync(
    path.join(workingDeck, "ppt", "slides", "slide2.xml"),
    extraction.slideXml
  );

  // replace_existing: replace slide2 in-place
  const result = updatePresentationXml(
    workingDeck,
    "slide2.xml",
    rid,
    slideId,
    "replace_existing",
    "slide2.xml"
  );

  assert.equal(result.slidesAfter.length, 3, "slide count must remain 3 after replace");
  assert.ok(result.slidesAfter.includes("slide1.xml"), "slide1 must be preserved");
  assert.ok(result.slidesAfter.includes("slide2.xml"), "slide2 must still be present");
  assert.ok(result.slidesAfter.includes("slide3.xml"), "slide3 must be preserved");
});

test("E2E: neighboring untouched slides are byte-identical to originals after replace_existing", () => {
  const workingDeck = tmpDir();
  buildUnpacked(workingDeck, 3);

  const slide1XmlBefore = fs.readFileSync(
    path.join(workingDeck, "ppt", "slides", "slide1.xml"), "utf8"
  );
  const slide3XmlBefore = fs.readFileSync(
    path.join(workingDeck, "ppt", "slides", "slide3.xml"), "utf8"
  );

  const sourcePackage = tmpDir();
  buildSingleSlidePackage(sourcePackage);
  const extraction = extractSlidePackage(sourcePackage, "slide1.xml");

  const { rid, slideId } = allocateNonConflictingIds(workingDeck, "rId99", 999);
  fs.writeFileSync(
    path.join(workingDeck, "ppt", "slides", "slide2.xml"),
    extraction.slideXml
  );

  updatePresentationXml(workingDeck, "slide2.xml", rid, slideId, "replace_existing", "slide2.xml");

  const slide1XmlAfter = fs.readFileSync(
    path.join(workingDeck, "ppt", "slides", "slide1.xml"), "utf8"
  );
  const slide3XmlAfter = fs.readFileSync(
    path.join(workingDeck, "ppt", "slides", "slide3.xml"), "utf8"
  );

  assert.equal(slide1XmlAfter, slide1XmlBefore, "slide1 must be byte-identical after replace");
  assert.equal(slide3XmlAfter, slide3XmlBefore, "slide3 must be byte-identical after replace");
});

// ---------------------------------------------------------------------------
// E2E: fail-closed paths
// ---------------------------------------------------------------------------

test("[CRITICAL] E2E: fail-closed on rel-ID collision — structured error thrown, deck untouched", () => {
  const workingDeck = tmpDir();
  buildUnpacked(workingDeck, 2);

  // Jam rId1..rId1001 to exhaust the search space
  const relsPath = path.join(workingDeck, "ppt", "_rels", "presentation.xml.rels");
  const jammedRels = [
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`,
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">`,
    ...Array.from({ length: 1002 }, (_, i) =>
      `  <Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide1.xml"/>`
    ),
    `</Relationships>`
  ].join("\n");
  fs.writeFileSync(relsPath, jammedRels);

  assert.throws(
    () => allocateNonConflictingIds(workingDeck, "rId1", 256),
    /MERGE_BACK_ID_COLLISION/
  );

  // Working deck presentation.xml must be untouched
  const slides = listPresentationSlides(workingDeck);
  assert.equal(slides.length, 2, "deck must remain unchanged after failed allocation");
});

test("[CRITICAL] E2E: fail-closed on missing [Content_Types].xml — structured error thrown", () => {
  const workingDeck = tmpDir();
  buildUnpacked(workingDeck, 2);
  fs.rmSync(path.join(workingDeck, "[Content_Types].xml"));

  assert.throws(
    () => updateContentTypes(workingDeck, "slide3.xml"),
    /MERGE_BACK_CONTENT_TYPES_MISSING/
  );
});

test("[CRITICAL] E2E: fail when neighboring slides drift after rebuild", () => {
  const workingDeck = tmpDir();
  buildUnpacked(workingDeck, 3);

  // Use wrong hashes to simulate drift
  const originalSlideIndex = [
    { slide_number: 1, xml_hash: "wrong-hash-for-slide1" },
    { slide_number: 3, xml_hash: "wrong-hash-for-slide3" }
  ];

  assert.throws(
    () => validateNeighboringSlides(workingDeck, 2, originalSlideIndex),
    /MERGE_BACK_NEIGHBOR_DRIFT/
  );
});

// ---------------------------------------------------------------------------
// E2E: performance guard — merge-back completes in under 2000ms
// ---------------------------------------------------------------------------

test("E2E: merge-back for a single slide completes well under 2000ms", () => {
  const workingDeck = tmpDir();
  buildUnpacked(workingDeck, 3);

  const sourcePackage = tmpDir();
  buildSingleSlidePackage(sourcePackage);

  const start = Date.now();

  // Run all merge-back steps except the full unpack (which requires python)
  const extraction = extractSlidePackage(sourcePackage, "slide1.xml");
  const { rid, slideId } = allocateNonConflictingIds(workingDeck, "rId99", 999);

  const newSlideFile = "slide4.xml";
  fs.writeFileSync(
    path.join(workingDeck, "ppt", "slides", newSlideFile),
    extraction.slideXml
  );

  updatePresentationXml(workingDeck, newSlideFile, rid, slideId, "insert_after", "slide3.xml");
  updateContentTypes(workingDeck, newSlideFile);
  copyMediaDependencies(sourcePackage, workingDeck, extraction.referencedMedia);

  const elapsed = Date.now() - start;
  assert.ok(elapsed < 2000, `Merge-back must complete in under 2000ms, took ${elapsed}ms`);
});
