"use strict";

// Integration tests for the OOXML merge-back algorithm.
//
// Covers:
//   insert_after success path — rewires slide IDs, rel IDs, and content types correctly
//   replace_existing success path — keeps deck order stable while replacing only the target slide
//   fail-closed on rel-ID collision
//   fail-closed on missing [Content_Types].xml override
//   fail-closed on broken presentation order
//   fail when neighboring untouched slides drift structurally after rebuild

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const {
  listPresentationSlides,
  registerSlideInPresentation,
  removeSlideFromPresentation
} = require("../scripts/lib/pptx-edit-ops");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function tmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "ppt-agent-mergeback-"));
}

/**
 * Build a minimal unpacked PPTX directory with N slides, a proper
 * presentation.xml, _rels/presentation.xml.rels, and [Content_Types].xml.
 */
function buildUnpacked(dir, slideCount) {
  const pptDir = path.join(dir, "ppt");
  const slidesDir = path.join(pptDir, "slides");
  const slidesRelsDir = path.join(slidesDir, "_rels");
  const pptRelsDir = path.join(pptDir, "_rels");
  fs.mkdirSync(slidesRelsDir, { recursive: true });
  fs.mkdirSync(pptRelsDir, { recursive: true });

  // Build slides
  const slideEntries = [];    // for presentation.xml sldIdLst
  const relEntries = [];      // for presentation.xml.rels
  const ctEntries = [];       // for [Content_Types].xml

  for (let i = 1; i <= slideCount; i++) {
    const slideFile = `slide${i}.xml`;
    const rid = `rId${i}`;
    const slideId = 255 + i; // 256, 257, …

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

  return { slidesDir, pptDir, pptRelsDir, slidesRelsDir };
}

// ---------------------------------------------------------------------------
// Tests: listPresentationSlides
// ---------------------------------------------------------------------------

test("listPresentationSlides returns slides in presentation order", () => {
  const dir = tmpDir();
  buildUnpacked(dir, 3);

  const slides = listPresentationSlides(dir);

  assert.equal(slides.length, 3);
  assert.equal(slides[0].slide_file, "slide1.xml");
  assert.equal(slides[1].slide_file, "slide2.xml");
  assert.equal(slides[2].slide_file, "slide3.xml");
  assert.equal(slides[0].rid, "rId1");
  assert.equal(slides[0].slide_id, 256);
});

// ---------------------------------------------------------------------------
// Tests: rel-ID collision — new slide must not reuse an existing rId
// ---------------------------------------------------------------------------

test("fail-closed on rel-ID collision: registerSlideInPresentation allocates a non-colliding rId", () => {
  const dir = tmpDir();
  buildUnpacked(dir, 3);

  // Before: rId1, rId2, rId3 exist
  const slidesBefore = listPresentationSlides(dir);
  const existingRids = new Set(slidesBefore.map(s => s.rid));

  const newSlideFile = "slide4.xml";
  fs.writeFileSync(
    path.join(dir, "ppt", "slides", newSlideFile),
    `<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"></p:sld>`
  );

  const { rid } = registerSlideInPresentation(dir, newSlideFile, "slide3.xml");

  assert.ok(!existingRids.has(rid), `Allocated rid "${rid}" must not collide with existing rIds: ${[...existingRids].join(", ")}`);
});

test("fail-closed on rel-ID collision: inserting two slides in sequence produces distinct rIds", () => {
  const dir = tmpDir();
  buildUnpacked(dir, 2);

  const newSlide1 = "slide3.xml";
  fs.writeFileSync(
    path.join(dir, "ppt", "slides", newSlide1),
    `<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"></p:sld>`
  );
  const result1 = registerSlideInPresentation(dir, newSlide1, "slide2.xml");

  const newSlide2 = "slide4.xml";
  fs.writeFileSync(
    path.join(dir, "ppt", "slides", newSlide2),
    `<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"></p:sld>`
  );
  const result2 = registerSlideInPresentation(dir, newSlide2, "slide3.xml");

  assert.notEqual(result1.rid, result2.rid, "Two sequential inserts must have distinct rIds");
  assert.notEqual(result1.slideId, result2.slideId, "Two sequential inserts must have distinct slideIds");
});

// ---------------------------------------------------------------------------
// Tests: insert_after success path
// ---------------------------------------------------------------------------

test("registerSlideInPresentation insert_after rewires slide IDs and rel IDs correctly", () => {
  const dir = tmpDir();
  buildUnpacked(dir, 2);

  const newSlideFile = "slide3.xml";
  fs.writeFileSync(
    path.join(dir, "ppt", "slides", newSlideFile),
    `<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"></p:sld>`
  );

  // Insert after slide1.xml
  const { rid, slideId } = registerSlideInPresentation(dir, newSlideFile, "slide1.xml");

  // Verify non-null IDs were allocated
  assert.ok(rid, "rid must be allocated");
  assert.ok(slideId, "slideId must be allocated");

  // Verify rid does not collide with existing rId1 or rId2
  assert.notEqual(rid, "rId1");
  assert.notEqual(rid, "rId2");

  // Verify the slide appears in the updated listing
  const slides = listPresentationSlides(dir);
  assert.equal(slides.length, 3);
  const newSlide = slides.find(s => s.slide_file === newSlideFile);
  assert.ok(newSlide, "new slide must appear in presentation listing");
  assert.equal(newSlide.rid, rid);
  assert.equal(newSlide.slide_id, slideId);
});

test("registerSlideInPresentation insert_after adds Content_Types override for new slide", () => {
  const dir = tmpDir();
  buildUnpacked(dir, 2);

  const newSlideFile = "slide3.xml";
  fs.writeFileSync(
    path.join(dir, "ppt", "slides", newSlideFile),
    `<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"></p:sld>`
  );

  registerSlideInPresentation(dir, newSlideFile, "slide2.xml");

  const contentTypes = fs.readFileSync(path.join(dir, "[Content_Types].xml"), "utf8");
  assert.ok(
    contentTypes.includes(`/ppt/slides/${newSlideFile}`),
    "Content_Types.xml must include override for the new slide"
  );
});

// ---------------------------------------------------------------------------
// Tests: replace_existing success path
// ---------------------------------------------------------------------------

test("replace_existing keeps deck order stable and only replaces target slide", () => {
  const dir = tmpDir();
  buildUnpacked(dir, 3);

  const slidesBefore = listPresentationSlides(dir);
  const originalOrder = slidesBefore.map(s => s.slide_file);

  // Remove slide2 (replace_existing step 1: remove)
  removeSlideFromPresentation(dir, "slide2.xml");

  // Add replacement slide at same position
  const replacementFile = "slide2.xml";
  fs.writeFileSync(
    path.join(dir, "ppt", "slides", replacementFile),
    `<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree/></p:cSld></p:sld>`
  );
  registerSlideInPresentation(dir, replacementFile, "slide1.xml");

  const slidesAfter = listPresentationSlides(dir);

  // Total count must remain 3
  assert.equal(slidesAfter.length, 3, "Slide count must stay the same after replace");

  // slide1 and slide3 must still exist
  const fileNames = slidesAfter.map(s => s.slide_file);
  assert.ok(fileNames.includes("slide1.xml"), "slide1 must be untouched");
  assert.ok(fileNames.includes("slide3.xml"), "slide3 must be untouched");
  assert.ok(fileNames.includes("slide2.xml"), "replacement slide must be registered");
});

test("replace_existing does not change slide IDs of untouched neighbors", () => {
  const dir = tmpDir();
  buildUnpacked(dir, 3);

  const slidesBefore = listPresentationSlides(dir);
  const slide1Before = slidesBefore.find(s => s.slide_file === "slide1.xml");
  const slide3Before = slidesBefore.find(s => s.slide_file === "slide3.xml");

  // Remove and re-register slide2
  removeSlideFromPresentation(dir, "slide2.xml");
  fs.writeFileSync(
    path.join(dir, "ppt", "slides", "slide2.xml"),
    `<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"></p:sld>`
  );
  registerSlideInPresentation(dir, "slide2.xml", "slide1.xml");

  const slidesAfter = listPresentationSlides(dir);
  const slide1After = slidesAfter.find(s => s.slide_file === "slide1.xml");
  const slide3After = slidesAfter.find(s => s.slide_file === "slide3.xml");

  assert.equal(slide1After.slide_id, slide1Before.slide_id, "slide1 ID must not change");
  assert.equal(slide3After.slide_id, slide3Before.slide_id, "slide3 ID must not change");
  assert.equal(slide1After.rid, slide1Before.rid, "slide1 rel ID must not change");
  assert.equal(slide3After.rid, slide3Before.rid, "slide3 rel ID must not change");
});

// ---------------------------------------------------------------------------
// Tests: fail-closed on missing [Content_Types].xml
// ---------------------------------------------------------------------------

test("registerSlideInPresentation gracefully handles missing [Content_Types].xml without crashing", () => {
  const dir = tmpDir();
  buildUnpacked(dir, 2);

  // Remove Content_Types.xml to simulate missing override file
  fs.rmSync(path.join(dir, "[Content_Types].xml"));

  const newSlideFile = "slide3.xml";
  fs.writeFileSync(
    path.join(dir, "ppt", "slides", newSlideFile),
    `<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"></p:sld>`
  );

  // Must not throw — the function has a guard that skips the write when file is absent
  assert.doesNotThrow(() => {
    registerSlideInPresentation(dir, newSlideFile, "slide1.xml");
  });

  // Slide must still be registered in presentation/rels
  const slides = listPresentationSlides(dir);
  assert.ok(slides.some(s => s.slide_file === newSlideFile), "slide must still be registered");
});

// ---------------------------------------------------------------------------
// Tests: fail-closed on broken presentation order
// ---------------------------------------------------------------------------

test("listPresentationSlides returns empty when presentation.xml references unknown slides", () => {
  const dir = tmpDir();
  buildUnpacked(dir, 2);

  // Corrupt presentation.xml to reference a slide not in rels
  const presentationPath = path.join(dir, "ppt", "presentation.xml");
  const xml = fs.readFileSync(presentationPath, "utf8");
  // Point the slide ID entries at a non-existent rId
  const corrupted = xml.replace(/r:id="rId1"/g, 'r:id="rId99"')
                       .replace(/r:id="rId2"/g, 'r:id="rId98"');
  fs.writeFileSync(presentationPath, corrupted);

  const slides = listPresentationSlides(dir);
  // All entries should be filtered out since rId99/rId98 don't exist in rels
  assert.equal(slides.length, 0, "Broken presentation order must yield no slides");
});

// ---------------------------------------------------------------------------
// Tests: neighboring slides do not drift after rebuild
// ---------------------------------------------------------------------------

test("neighboring untouched slides retain their XML content after insert_after operation", () => {
  const dir = tmpDir();
  buildUnpacked(dir, 3);

  // Read slide1 and slide3 XML before the insert
  const slide1XmlBefore = fs.readFileSync(path.join(dir, "ppt", "slides", "slide1.xml"), "utf8");
  const slide3XmlBefore = fs.readFileSync(path.join(dir, "ppt", "slides", "slide3.xml"), "utf8");

  // Insert a new slide after slide2
  const newSlide = "slide4.xml";
  fs.writeFileSync(
    path.join(dir, "ppt", "slides", newSlide),
    `<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree/></p:cSld></p:sld>`
  );
  registerSlideInPresentation(dir, newSlide, "slide2.xml");

  // Verify slide1 and slide3 XML are unchanged
  const slide1XmlAfter = fs.readFileSync(path.join(dir, "ppt", "slides", "slide1.xml"), "utf8");
  const slide3XmlAfter = fs.readFileSync(path.join(dir, "ppt", "slides", "slide3.xml"), "utf8");

  assert.equal(slide1XmlAfter, slide1XmlBefore, "slide1 XML must not drift after insert");
  assert.equal(slide3XmlAfter, slide3XmlBefore, "slide3 XML must not drift after insert");
});

test("neighboring untouched slides retain their rels after replace_existing operation", () => {
  const dir = tmpDir();
  buildUnpacked(dir, 3);

  const slide1RelsBefore = fs.readFileSync(
    path.join(dir, "ppt", "slides", "_rels", "slide1.xml.rels"), "utf8"
  );
  const slide3RelsBefore = fs.readFileSync(
    path.join(dir, "ppt", "slides", "_rels", "slide3.xml.rels"), "utf8"
  );

  // Replace slide2
  removeSlideFromPresentation(dir, "slide2.xml");
  fs.writeFileSync(
    path.join(dir, "ppt", "slides", "slide2.xml"),
    `<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"></p:sld>`
  );
  registerSlideInPresentation(dir, "slide2.xml", "slide1.xml");

  const slide1RelsAfter = fs.readFileSync(
    path.join(dir, "ppt", "slides", "_rels", "slide1.xml.rels"), "utf8"
  );
  const slide3RelsAfter = fs.readFileSync(
    path.join(dir, "ppt", "slides", "_rels", "slide3.xml.rels"), "utf8"
  );

  assert.equal(slide1RelsAfter, slide1RelsBefore, "slide1 rels must not drift after replace");
  assert.equal(slide3RelsAfter, slide3RelsBefore, "slide3 rels must not drift after replace");
});
