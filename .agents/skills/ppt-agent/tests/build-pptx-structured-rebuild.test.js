"use strict";

// TDD tests for buildSlideFromStructuredSpec and executeStructuredRebuilds.
//
// These are NEW functions wiring the single-slide package path for
// structured_rebuild actions. Tests are written before implementation (Red phase).

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const {
  buildSlideFromStructuredSpec,
  executeStructuredRebuilds
} = require("../scripts/lib/build-pptx-from-handoff");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function tmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "ppt-rebuild-"));
}

function makeSpec(overrides = {}) {
  return {
    slide_number: 2,
    layout: "two_column",
    content: {
      title: "Test Slide",
      body_lines: ["Line one", "Line two"],
      image_paths: []
    },
    design_tokens: {
      accent_color: "#FA6611",
      body_background: "#FFFFFF",
      title_background: "#1F1F1F",
      font_face_sans: "Aptos",
      font_face_serif: "Aptos"
    },
    source_brief: { slide_number: 2, title: "Test Slide" },
    ...overrides
  };
}

function makePlannedJob(runRoot, overrides = {}) {
  return {
    slide_number: 2,
    action: "structured_rebuild",
    status: "planned",
    structured_spec: makeSpec(),
    artifact_path: path.join(runRoot, "artifacts", "rebuilt-slide-02.pptx"),
    image_strategy: "preserve",
    ...overrides
  };
}

// ---------------------------------------------------------------------------
// buildSlideFromStructuredSpec
// ---------------------------------------------------------------------------

test("buildSlideFromStructuredSpec maps spec content to slideModel and calls createDeckFromSpec", async () => {
  const spec = makeSpec();
  const outputPath = path.join(tmpDir(), "single-slide.pptx");

  let capturedArgs = null;
  const result = await buildSlideFromStructuredSpec({
    spec,
    outputPath,
    createDeckFromSpecImpl: async (args) => {
      capturedArgs = args;
      return { outputPath: args.outputPath, slideCount: 1 };
    }
  });

  assert.ok(capturedArgs, "createDeckFromSpecImpl must be called");
  assert.equal(capturedArgs.slides.length, 1);
  const { slideModel, slideSpec } = capturedArgs.slides[0];
  assert.equal(slideModel.title, "Test Slide");
  assert.deepEqual(slideModel.bodyLines, ["Line one", "Line two"]);
  assert.deepEqual(slideModel.imagePaths, []);
  assert.equal(slideSpec.layout, "two_column");
  assert.equal(capturedArgs.outputPath, outputPath);
  assert.deepEqual(capturedArgs.designTokens, spec.design_tokens);
  assert.equal(result.outputPath, outputPath);
  assert.equal(result.slideCount, 1);
});

test("buildSlideFromStructuredSpec passes image_paths into slideModel.imagePaths", async () => {
  const spec = makeSpec({
    content: {
      title: "Image Slide",
      body_lines: [],
      image_paths: ["/artifacts/image-02.png"]
    }
  });
  const outputPath = path.join(tmpDir(), "out.pptx");

  let capturedSlide = null;
  await buildSlideFromStructuredSpec({
    spec,
    outputPath,
    createDeckFromSpecImpl: async (args) => {
      capturedSlide = args.slides[0];
      return { outputPath, slideCount: 1 };
    }
  });

  assert.deepEqual(capturedSlide.slideModel.imagePaths, ["/artifacts/image-02.png"]);
});

test("buildSlideFromStructuredSpec throws when spec is missing", async () => {
  await assert.rejects(
    buildSlideFromStructuredSpec({ spec: null, outputPath: "/tmp/out.pptx" }),
    /spec is required/i
  );
});

test("buildSlideFromStructuredSpec throws when outputPath is missing", async () => {
  await assert.rejects(
    buildSlideFromStructuredSpec({ spec: makeSpec(), outputPath: null }),
    /outputPath is required/i
  );
});

// ---------------------------------------------------------------------------
// executeStructuredRebuilds
// ---------------------------------------------------------------------------

test("executeStructuredRebuilds returns updated jobs with status applied", async () => {
  const runRoot = tmpDir();
  fs.mkdirSync(path.join(runRoot, "artifacts"), { recursive: true });
  fs.mkdirSync(path.join(runRoot, "working", "unpacked"), { recursive: true });
  fs.writeFileSync(
    path.join(runRoot, "artifacts", "original-slide-index.json"),
    JSON.stringify([{ slide_number: 2, slide_file: "ppt/slides/slide2.xml" }])
  );

  const job = makePlannedJob(runRoot);
  let buildCalled = false;
  let mergeCalled = false;

  const result = await executeStructuredRebuilds({
    runRoot,
    jobs: [job],
    buildSlideImpl: async ({ spec, outputPath }) => {
      buildCalled = true;
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, "fake-pptx");
      return { outputPath, slideCount: 1 };
    },
    mergeRebuiltSlideImpl: (params) => {
      mergeCalled = true;
      assert.equal(params.actionKind, "replace_existing");
      assert.equal(params.targetSlideNumber, 2);
      return { status: "success" };
    }
  });

  assert.ok(buildCalled, "buildSlideImpl must be called");
  assert.ok(mergeCalled, "mergeRebuiltSlideImpl must be called");
  assert.equal(result.length, 1);
  assert.equal(result[0].status, "applied");
});

test("executeStructuredRebuilds uses insert_after when slide not in original index", async () => {
  const runRoot = tmpDir();
  fs.mkdirSync(path.join(runRoot, "artifacts"), { recursive: true });
  fs.mkdirSync(path.join(runRoot, "working", "unpacked"), { recursive: true });
  fs.writeFileSync(
    path.join(runRoot, "artifacts", "original-slide-index.json"),
    JSON.stringify([{ slide_number: 1, slide_file: "ppt/slides/slide1.xml" }])
  );

  const job = makePlannedJob(runRoot, {
    slide_number: 3,
    structured_spec: makeSpec({ slide_number: 3 }),
    artifact_path: path.join(runRoot, "artifacts", "rebuilt-slide-03.pptx")
  });

  let capturedActionKind = null;
  await executeStructuredRebuilds({
    runRoot,
    jobs: [job],
    buildSlideImpl: async ({ spec, outputPath }) => {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, "fake-pptx");
      return { outputPath, slideCount: 1 };
    },
    mergeRebuiltSlideImpl: (params) => {
      capturedActionKind = params.actionKind;
      return { status: "success" };
    }
  });

  assert.equal(capturedActionKind, "insert_after");
});

test("executeStructuredRebuilds skips non-structured-rebuild jobs silently", async () => {
  const runRoot = tmpDir();
  fs.mkdirSync(path.join(runRoot, "artifacts"), { recursive: true });
  fs.writeFileSync(
    path.join(runRoot, "artifacts", "original-slide-index.json"),
    JSON.stringify([])
  );

  const keepJob = { slide_number: 1, action: "keep", status: "applied" };
  const reviseJob = { slide_number: 2, action: "revise", status: "applied" };
  let buildCalled = false;

  const result = await executeStructuredRebuilds({
    runRoot,
    jobs: [keepJob, reviseJob],
    buildSlideImpl: async () => { buildCalled = true; return {}; },
    mergeRebuiltSlideImpl: () => ({})
  });

  assert.ok(!buildCalled, "buildSlideImpl must not be called for non-rebuild jobs");
  assert.deepEqual(result, [keepJob, reviseJob]);
});

test("executeStructuredRebuilds skips planned jobs with action other than structured_rebuild", async () => {
  const runRoot = tmpDir();
  fs.mkdirSync(path.join(runRoot, "artifacts"), { recursive: true });
  fs.writeFileSync(
    path.join(runRoot, "artifacts", "original-slide-index.json"),
    JSON.stringify([])
  );

  const addJob = { slide_number: 3, action: "add_after", status: "planned" };
  let buildCalled = false;

  const result = await executeStructuredRebuilds({
    runRoot,
    jobs: [addJob],
    buildSlideImpl: async () => { buildCalled = true; return {}; },
    mergeRebuiltSlideImpl: () => ({})
  });

  assert.ok(!buildCalled);
  assert.deepEqual(result, [addJob]);
});

test("executeStructuredRebuilds is fail-closed when rendering throws", async () => {
  const runRoot = tmpDir();
  fs.mkdirSync(path.join(runRoot, "artifacts"), { recursive: true });
  fs.writeFileSync(
    path.join(runRoot, "artifacts", "original-slide-index.json"),
    JSON.stringify([{ slide_number: 2, slide_file: "ppt/slides/slide2.xml" }])
  );

  const job = makePlannedJob(runRoot);

  await assert.rejects(
    executeStructuredRebuilds({
      runRoot,
      jobs: [job],
      buildSlideImpl: async () => { throw new Error("renderer failure"); },
      mergeRebuiltSlideImpl: () => ({})
    }),
    /renderer failure/
  );
});

test("executeStructuredRebuilds processes multiple planned jobs in order", async () => {
  const runRoot = tmpDir();
  fs.mkdirSync(path.join(runRoot, "artifacts"), { recursive: true });
  fs.mkdirSync(path.join(runRoot, "working", "unpacked"), { recursive: true });
  fs.writeFileSync(
    path.join(runRoot, "artifacts", "original-slide-index.json"),
    JSON.stringify([
      { slide_number: 2, slide_file: "ppt/slides/slide2.xml" },
      { slide_number: 4, slide_file: "ppt/slides/slide4.xml" }
    ])
  );

  const job2 = makePlannedJob(runRoot, {
    slide_number: 2,
    structured_spec: makeSpec({ slide_number: 2 }),
    artifact_path: path.join(runRoot, "artifacts", "rebuilt-slide-02.pptx")
  });
  const job4 = makePlannedJob(runRoot, {
    slide_number: 4,
    structured_spec: makeSpec({ slide_number: 4 }),
    artifact_path: path.join(runRoot, "artifacts", "rebuilt-slide-04.pptx")
  });

  const mergedSlides = [];
  const result = await executeStructuredRebuilds({
    runRoot,
    jobs: [job2, job4],
    buildSlideImpl: async ({ spec, outputPath }) => {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, "fake-pptx");
      return { outputPath, slideCount: 1 };
    },
    mergeRebuiltSlideImpl: (params) => {
      mergedSlides.push(params.targetSlideNumber);
      return { status: "success" };
    }
  });

  assert.deepEqual(mergedSlides, [2, 4]);
  assert.equal(result.filter((j) => j.status === "applied").length, 2);
});
