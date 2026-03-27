"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("node:child_process");

const {
  parseManuscriptSlides,
  buildDeckFromHandoff
} = require("../scripts/lib/build-pptx-from-handoff");

class FakeSlide {
  constructor() {
    this.background = null;
    this.textCalls = [];
    this.shapeCalls = [];
    this.imageCalls = [];
  }

  addText(text, options) {
    this.textCalls.push({ text, options });
  }

  addShape(shape, options) {
    this.shapeCalls.push({ shape, options });
  }

  addImage(options) {
    this.imageCalls.push(options);
  }
}

class FakePptx {
  constructor() {
    this.slides = [];
    this.shapes = { RECTANGLE: "RECTANGLE" };
  }

  addSlide() {
    const slide = new FakeSlide();
    this.slides.push(slide);
    return slide;
  }

  async writeFile() {}
}

function tmpRunRoot() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ppt-agent-build-"));
  fs.mkdirSync(path.join(dir, "artifacts"), { recursive: true });
  return dir;
}

test("parseManuscriptSlides extracts slide titles and body lines", () => {
  const model = parseManuscriptSlides([
    "# Q2 Review",
    "",
    "Slide title: Executive Summary",
    "- Revenue up 12%",
    "---",
    "Slide title: Risks",
    "- Supply chain delay"
  ].join("\n"));

  assert.equal(model.deckTitle, "Q2 Review");
  assert.equal(model.slides.length, 2);
  assert.equal(model.slides[0].title, "Executive Summary");
  assert.equal(model.slides[1].title, "Risks");
});

test("buildDeckFromHandoff writes a pptx file", async () => {
  const runRoot = tmpRunRoot();
  const manuscriptPath = path.join(runRoot, "artifacts", "manuscript.md");
  const handoffPath = path.join(runRoot, "artifacts", "pptx-handoff.json");
  const outputPath = path.join(runRoot, "artifacts", "output.pptx");

  fs.writeFileSync(
    manuscriptPath,
    [
      "# Q2 Review",
      "",
      "Slide title: Executive Summary",
      "- Revenue up 12%",
      "- Margin up 3 points",
      "---",
      "Slide title: Risks",
      "- Supply chain delay",
      "- Hiring slowdown"
    ].join("\n")
  );

  fs.writeFileSync(
    handoffPath,
    JSON.stringify(
      {
        handoff_type: "pptx_new_deck_generation",
        phase: "create",
        layout: "LAYOUT_16x9",
        build_path: "new_deck_generation",
        reference_strategy: "none",
        manuscript_path: "artifacts/manuscript.md",
        design_plan_path: "artifacts/design_plan.md",
        slide_build_spec_path: "artifacts/slide-build-spec.json",
        output_pptx_path: "artifacts/output.pptx"
      },
      null,
      2
    )
  );

  const result = await buildDeckFromHandoff({ handoffPath });
  assert.equal(result.outputPath, outputPath);
  assert.ok(fs.existsSync(outputPath));
  assert.ok(fs.statSync(outputPath).size > 0);
});

test("buildDeckFromHandoff delegates low-level deck creation to the shared pptx implementation", async () => {
  const runRoot = tmpRunRoot();
  const manuscriptPath = path.join(runRoot, "artifacts", "manuscript.md");
  const handoffPath = path.join(runRoot, "artifacts", "pptx-handoff.json");
  const specPath = path.join(runRoot, "artifacts", "slide-build-spec.json");
  const designPlanPath = path.join(runRoot, "artifacts", "design_plan.md");
  const outputPath = path.join(runRoot, "artifacts", "output.pptx");
  const delegatedCalls = [];

  fs.writeFileSync(
    manuscriptPath,
    [
      "# Q2 Review",
      "",
      "Slide title: Executive Summary",
      "- Revenue up 12%",
      "---",
      "Slide title: Risks",
      "- Supply chain delay"
    ].join("\n")
  );
  fs.writeFileSync(
    designPlanPath,
    [
      "# Design Plan: Q2 Review",
      "",
      "## Visual Identity",
      "- Accent color: #FA6611",
      "- Tone: restrained business deck"
    ].join("\n")
  );
  fs.writeFileSync(
    specPath,
    JSON.stringify(
      {
        phase: "create",
        build_path: "new_deck_generation",
        reference_strategy: "none",
        manuscript_path: "artifacts/manuscript.md",
        design_plan_path: "artifacts/design_plan.md",
        output_pptx_path: "artifacts/output.pptx",
        design_tokens: {
          accent_color: "#FA6611"
        },
        slides: [
          { slide_number: 1, title: "Executive Summary", layout: "title_hero", emphasis: "summary" },
          { slide_number: 2, title: "Risks", layout: "two_column", emphasis: "risk" }
        ]
      },
      null,
      2
    )
  );
  fs.writeFileSync(
    handoffPath,
    JSON.stringify(
      {
        handoff_type: "pptx_new_deck_generation",
        phase: "create",
        layout: "LAYOUT_16x9",
        build_path: "new_deck_generation",
        reference_strategy: "none",
        manuscript_path: "artifacts/manuscript.md",
        design_plan_path: "artifacts/design_plan.md",
        slide_build_spec_path: "artifacts/slide-build-spec.json",
        output_pptx_path: "artifacts/output.pptx"
      },
      null,
      2
    )
  );

  const result = await buildDeckFromHandoff({
    handoffPath,
    createDeck: async (payload) => {
      delegatedCalls.push(payload);
      fs.writeFileSync(payload.outputPath, "delegated-pptx");
      return {
        outputPath: payload.outputPath,
        slideCount: payload.slides.length,
        designSummary: {
          accentColor: payload.designTokens.accent_color,
          tone: "delegated"
        }
      };
    },
    renderSlides: async () => ({
      renderDir: path.join(runRoot, "renders"),
      renderCount: 2,
      mode: "stub"
    })
  });

  assert.equal(delegatedCalls.length, 1);
  assert.equal(delegatedCalls[0].outputPath, outputPath);
  assert.equal(delegatedCalls[0].slides.length, 2);
  assert.equal(result.outputPath, outputPath);
  assert.ok(fs.existsSync(outputPath));
});

test("buildDeckFromHandoff consumes slide-build-spec design tokens and layouts", async () => {
  const runRoot = tmpRunRoot();
  const manuscriptPath = path.join(runRoot, "artifacts", "manuscript.md");
  const handoffPath = path.join(runRoot, "artifacts", "pptx-handoff.json");
  const specPath = path.join(runRoot, "artifacts", "slide-build-spec.json");
  const designPlanPath = path.join(runRoot, "artifacts", "design_plan.md");

  fs.writeFileSync(
    manuscriptPath,
    [
      "# Q2 Review",
      "",
      "Slide title: Executive Summary",
      "- Revenue up 12%",
      "---",
      "Slide title: Risks",
      "- Supply chain delay",
      "---",
      "Slide title: Decisions",
      "- Confirm hiring pace"
    ].join("\n")
  );
  fs.writeFileSync(
    designPlanPath,
    [
      "# Design Plan: Q2 Review",
      "",
      "## Visual Identity",
      "- Accent color: #FA6611",
      "- Tone: restrained business deck"
    ].join("\n")
  );
  fs.writeFileSync(
    specPath,
    JSON.stringify(
      {
        phase: "create",
        build_path: "new_deck_generation",
        reference_strategy: "structure",
        manuscript_path: "artifacts/manuscript.md",
        design_plan_path: "artifacts/design_plan.md",
        output_pptx_path: "artifacts/output.pptx",
        design_tokens: {
          accent_color: "#FA6611",
          title_background: "253041",
          body_background: "FFF7F2"
        },
        slides: [
          { slide_number: 1, title: "Executive Summary", layout: "title_hero", emphasis: "summary" },
          { slide_number: 2, title: "Risks", layout: "two_column", emphasis: "risk" },
          { slide_number: 3, title: "Decisions", layout: "decision_grid", emphasis: "decision" }
        ]
      },
      null,
      2
    )
  );
  fs.writeFileSync(
    handoffPath,
    JSON.stringify(
      {
        handoff_type: "pptx_new_deck_generation",
        phase: "create",
        layout: "LAYOUT_16x9",
        build_path: "new_deck_generation",
        reference_strategy: "structure",
        manuscript_path: "artifacts/manuscript.md",
        design_plan_path: "artifacts/design_plan.md",
        slide_build_spec_path: "artifacts/slide-build-spec.json",
        output_pptx_path: "artifacts/output.pptx"
      },
      null,
      2
    )
  );

  const fake = new FakePptx();
  const result = await buildDeckFromHandoff({
    handoffPath,
    pptxFactory: class {
      constructor() {
        return fake;
      }
    }
  });

  assert.equal(result.slideCount, 3);
  assert.deepEqual(result.layoutsUsed, ["title_hero", "two_column", "decision_grid"]);
  assert.equal(result.designSummary.accentColor, "#FA6611");
  assert.equal(fake.slides[0].background.color, "253041");
  assert.equal(fake.slides[1].background.color, "FFF7F2");
  assert.ok(fake.slides[1].shapeCalls.some((call) => call.options.fill.color === "FA6611"));
});

test("buildDeckFromHandoff renders slide images through the provided renderer", async () => {
  const runRoot = tmpRunRoot();
  const manuscriptPath = path.join(runRoot, "artifacts", "manuscript.md");
  const handoffPath = path.join(runRoot, "artifacts", "pptx-handoff.json");
  const specPath = path.join(runRoot, "artifacts", "slide-build-spec.json");
  const designPlanPath = path.join(runRoot, "artifacts", "design_plan.md");

  fs.writeFileSync(
    manuscriptPath,
    [
      "# Q2 Review",
      "",
      "Slide title: Executive Summary",
      "- Revenue up 12%",
      "---",
      "Slide title: Risks",
      "- Supply chain delay"
    ].join("\n")
  );
  fs.writeFileSync(
    designPlanPath,
    [
      "# Design Plan: Q2 Review",
      "",
      "## Visual Identity",
      "- Accent color: #FA6611",
      "- Tone: restrained business deck",
      "- Minimal text: yes"
    ].join("\n")
  );
  fs.writeFileSync(
    specPath,
    JSON.stringify(
      {
        phase: "create",
        build_path: "new_deck_generation",
        reference_strategy: "none",
        manuscript_path: "artifacts/manuscript.md",
        design_plan_path: "artifacts/design_plan.md",
        output_pptx_path: "artifacts/output.pptx",
        slides: [
          { slide_number: 1, title: "Executive Summary", layout: "title_hero", bullet_count: 1 },
          { slide_number: 2, title: "Risks", layout: "two_column", bullet_count: 1 }
        ]
      },
      null,
      2
    )
  );
  fs.writeFileSync(
    handoffPath,
    JSON.stringify(
      {
        handoff_type: "pptx_new_deck_generation",
        phase: "create",
        layout: "LAYOUT_16x9",
        build_path: "new_deck_generation",
        reference_strategy: "none",
        manuscript_path: "artifacts/manuscript.md",
        design_plan_path: "artifacts/design_plan.md",
        slide_build_spec_path: "artifacts/slide-build-spec.json",
        output_pptx_path: "artifacts/output.pptx"
      },
      null,
      2
    )
  );

  const result = await buildDeckFromHandoff({
    handoffPath,
    renderSlides: async ({ renderDir, slideCount }) => {
      fs.mkdirSync(renderDir, { recursive: true });
      for (let index = 1; index <= slideCount; index++) {
        fs.writeFileSync(path.join(renderDir, `slide-${String(index).padStart(2, "0")}.jpg`), "jpg");
      }
      return {
        renderDir,
        renderCount: slideCount
      };
    }
  });

  assert.equal(result.renderSummary.renderCount, 2);
  assert.ok(fs.existsSync(path.join(runRoot, "renders", "slide-01.jpg")));
  assert.ok(fs.existsSync(path.join(runRoot, "renders", "slide-02.jpg")));
});

test("buildDeckFromHandoff supports section-divider layouts and typography tokens", async () => {
  const runRoot = tmpRunRoot();
  const manuscriptPath = path.join(runRoot, "artifacts", "manuscript.md");
  const handoffPath = path.join(runRoot, "artifacts", "pptx-handoff.json");
  const specPath = path.join(runRoot, "artifacts", "slide-build-spec.json");
  const designPlanPath = path.join(runRoot, "artifacts", "design_plan.md");

  fs.writeFileSync(
    manuscriptPath,
    [
      "# Q2 Review",
      "",
      "Slide title: Executive Summary",
      "- Revenue up 12%",
      "---",
      "Slide title: Section Reset",
      "- Performance Deep Dive",
      "---",
      "Slide title: Risks",
      "- Supply chain delay"
    ].join("\n")
  );
  fs.writeFileSync(
    designPlanPath,
    [
      "# Design Plan: Q2 Review",
      "",
      "## Typography Direction",
      "- Headline / labels: crisp business sans",
      "- Section-title accent / strategic emphasis: restrained serif accent"
    ].join("\n")
  );
  fs.writeFileSync(
    specPath,
    JSON.stringify(
      {
        phase: "create",
        build_path: "new_deck_generation",
        manuscript_path: "artifacts/manuscript.md",
        design_plan_path: "artifacts/design_plan.md",
        output_pptx_path: "artifacts/output.pptx",
        design_tokens: {
          accent_color: "#FA6611",
          title_background: "253041",
          body_background: "FFF7F2",
          font_face_sans: "Aptos",
          font_face_serif: "Georgia"
        },
        slides: [
          { slide_number: 1, title: "Executive Summary", layout: "title_hero" },
          { slide_number: 2, title: "Section Reset", layout: "section_divider" },
          { slide_number: 3, title: "Risks", layout: "two_column" }
        ]
      },
      null,
      2
    )
  );
  fs.writeFileSync(
    handoffPath,
    JSON.stringify(
      {
        handoff_type: "pptx_new_deck_generation",
        phase: "create",
        layout: "LAYOUT_16x9",
        build_path: "new_deck_generation",
        reference_strategy: "none",
        manuscript_path: "artifacts/manuscript.md",
        design_plan_path: "artifacts/design_plan.md",
        slide_build_spec_path: "artifacts/slide-build-spec.json",
        output_pptx_path: "artifacts/output.pptx"
      },
      null,
      2
    )
  );

  const fake = new FakePptx();
  await buildDeckFromHandoff({
    handoffPath,
    pptxFactory: class {
      constructor() {
        return fake;
      }
    }
  });

  assert.equal(fake.slides[1].textCalls[0].options.fontFace, "Georgia");
  assert.ok(fake.slides[1].shapeCalls.length > 0);
});

test("buildDeckFromHandoff returns partial success details when optional imagery fails and fallback is used", async () => {
  const runRoot = tmpRunRoot();
  const manuscriptPath = path.join(runRoot, "artifacts", "manuscript.md");
  const handoffPath = path.join(runRoot, "artifacts", "pptx-handoff.json");
  const specPath = path.join(runRoot, "artifacts", "slide-build-spec.json");
  const designPlanPath = path.join(runRoot, "artifacts", "design_plan.md");

  fs.writeFileSync(
    manuscriptPath,
    [
      "# Q2 Review",
      "",
      "Slide title: Delivery Process",
      "- Show phased rollout from pilot to governed production.",
      "- Keep the process business-readable and low-clutter."
    ].join("\n")
  );
  fs.writeFileSync(designPlanPath, "# Design Plan: Q2 Review\n");
  fs.writeFileSync(
    specPath,
    JSON.stringify(
      {
        phase: "create",
        build_path: "new_deck_generation",
        manuscript_path: "artifacts/manuscript.md",
        design_plan_path: "artifacts/design_plan.md",
        output_pptx_path: "artifacts/output.pptx",
        slides: [
          {
            slide_number: 1,
            title: "Delivery Process",
            layout: "process_flow",
            optional_image: {
              prompt: "Restrained process diagram for Q2 rollout",
              fallback: "shapes"
            }
          }
        ]
      },
      null,
      2
    )
  );
  fs.writeFileSync(
    handoffPath,
    JSON.stringify(
      {
        handoff_type: "pptx_new_deck_generation",
        phase: "create",
        layout: "LAYOUT_16x9",
        build_path: "new_deck_generation",
        reference_strategy: "none",
        manuscript_path: "artifacts/manuscript.md",
        design_plan_path: "artifacts/design_plan.md",
        slide_build_spec_path: "artifacts/slide-build-spec.json",
        output_pptx_path: "artifacts/output.pptx"
      },
      null,
      2
    )
  );

  const result = await buildDeckFromHandoff({
    handoffPath,
    generateImage: async () => {
      throw new Error("provider failure");
    }
  });

  assert.equal(result.partial, true);
  assert.equal(result.partialSummary.failures[0].fallback, "shapes");
  assert.match(result.partialSummary.failures[0].reason, /provider failure/i);
});

test("build-pptx-from-handoff CLI requires a handoff path", () => {
  const scriptPath = path.resolve(__dirname, "..", "scripts", "build-pptx-from-handoff.js");
  const result = spawnSync(process.execPath, [scriptPath], { encoding: "utf8" });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Usage: node build-pptx-from-handoff\.js --handoff/);
});
