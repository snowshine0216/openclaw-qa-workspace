"use strict";

const fs = require("fs");
const path = require("path");
const { parseManuscriptSlides } = require("./manuscript");
const { DEFAULT_TOKENS, parseDesignPlan } = require("./phase1-content");
const { renderSlides: renderSlidesWithPptxSkill } = require("./render-slides");
const {
  defaultImageStrategy,
  determineVisualRole,
  isTextSafeVisualFallback
} = require("./slide-transcript");
const { createDeckFromSpec } = require("../../../pptx/scripts/lib/create-deck-from-spec");

function resolveRunRootFromHandoffPath(handoffPath) {
  return path.resolve(path.dirname(handoffPath), "..");
}

function assertPathInsideRun(runRoot, filePath, label) {
  const relative = path.relative(runRoot, filePath);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`${label} must stay inside the run root`);
  }
}

async function buildDeckFromHandoff({
  handoffPath,
  createDeck = createDeckFromSpec,
  pptxFactory,
  renderSlides = renderSlidesWithPptxSkill,
  generateImage
}) {
  if (!handoffPath) {
    throw new Error("handoffPath is required");
  }

  const handoff = JSON.parse(fs.readFileSync(handoffPath, "utf8"));
  const runRoot = resolveRunRootFromHandoffPath(handoffPath);
  const manuscriptPath = path.resolve(runRoot, handoff.manuscript_path);
  const outputPath = path.resolve(runRoot, handoff.output_pptx_path);
  const specPath = path.resolve(runRoot, handoff.slide_build_spec_path);
  const designPlanPath = path.resolve(runRoot, handoff.design_plan_path);
  assertPathInsideRun(runRoot, outputPath, "output_pptx_path");

  if (!fs.existsSync(manuscriptPath)) {
    throw new Error(`Manuscript not found at ${manuscriptPath}`);
  }

  const markdown = fs.readFileSync(manuscriptPath, "utf8");
  const model = parseManuscriptSlides(markdown);
  if (model.slides.length === 0) {
    throw new Error("No slides could be parsed from manuscript.");
  }
  const buildSpec = fs.existsSync(specPath)
    ? JSON.parse(fs.readFileSync(specPath, "utf8"))
    : { slides: [] };
  const designPlan = fs.existsSync(designPlanPath)
    ? parseDesignPlan(fs.readFileSync(designPlanPath, "utf8"))
    : {};
  const designTokens = {
    ...DEFAULT_TOKENS,
    ...(buildSpec.design_tokens || {}),
    ...(designPlan.accentColor ? { accent_color: designPlan.accentColor } : {})
  };
  const layoutSpecs = buildSpec.slides || [];
  const partialFailures = [];
  const slideEntries = [];
  const imageGenerationReport = [];

  for (let index = 0; index < model.slides.length; index++) {
    const slideModel = { ...model.slides[index] };
    const slideSpec = layoutSpecs[index] || {};
    const imageDecision = await ensureRequiredVisual({
      runRoot,
      slideModel,
      slideSpec,
      slideNumber: index + 1,
      generateImage,
      partialFailures
    });
    imageGenerationReport.push(imageDecision);
    slideEntries.push({ slideModel, slideSpec });
  }

  const deckResult = await createDeck({
    deckTitle: model.deckTitle,
    layout: handoff.layout || "LAYOUT_16x9",
    outputPath,
    designTokens,
    slides: slideEntries,
    manuscriptPath,
    pptxFactory
  });
  const renderSummary = await renderSlides({
    outputPath,
    renderDir: path.join(runRoot, "renders"),
    slideCount: model.slides.length
  });
  fs.mkdirSync(path.join(runRoot, "artifacts", "generated-images"), { recursive: true });
  fs.writeFileSync(
    path.join(runRoot, "artifacts", "generated-images", "image-generation-report.json"),
    JSON.stringify(imageGenerationReport, null, 2)
  );
  return {
    outputPath: deckResult.outputPath || outputPath,
    slideCount: deckResult.slideCount || model.slides.length,
    layoutsUsed: layoutSpecs.map((slide) => slide.layout),
    renderSummary,
    partial: partialFailures.length > 0,
    partialSummary: partialFailures.length > 0
      ? {
          failures: partialFailures
        }
      : null,
    designSummary: {
      accentColor: deckResult.designSummary?.accentColor || designTokens.accent_color,
      tone: deckResult.designSummary?.tone || buildSpec.design_summary?.tone || designPlan.tone || "restrained business deck"
    }
  };
}

async function ensureRequiredVisual({
  runRoot,
  slideModel,
  slideSpec,
  slideNumber,
  generateImage,
  partialFailures
}) {
  const visualRole = slideSpec.visual_role || determineVisualRole({
    title: slideSpec.title || slideModel.title,
    role: slideSpec.role,
    layout: slideSpec.layout,
    visualAssets: slideSpec.visual_assets || []
  });
  const imageStrategy = slideSpec.image_strategy || defaultImageStrategy({
    mode: "create",
    visualRole,
    hasExistingMedia: Boolean((slideModel.imagePaths || []).length > 0)
  });
  const existingAssetPath = (slideModel.imagePaths || [])[0] || "";
  const textSafe =
    slideSpec.text_safe === true ||
    (slideSpec.text_safe !== false &&
      isTextSafeVisualFallback({
        visualRole,
        layout: slideSpec.layout
      }));
  const requiredVisual =
    slideSpec.required_visual ||
    slideSpec.optional_image ||
    (imageStrategy === "generate_new"
      ? {
          prompt: `Business-ready ${visualRole} visual for ${slideModel.title}`,
          fallback: "layout",
          required_for_comprehension: !textSafe
        }
      : null);

  if (imageStrategy === "forbid") {
    return {
      slide_number: slideNumber,
      visual_role: visualRole,
      image_strategy: imageStrategy,
      generator_ran: false,
      artifact_path: null
    };
  }

  if (existingAssetPath) {
    return {
      slide_number: slideNumber,
      visual_role: visualRole,
      image_strategy: imageStrategy,
      generator_ran: false,
      artifact_path: existingAssetPath
    };
  }

  if (!requiredVisual) {
    return {
      slide_number: slideNumber,
      visual_role: visualRole,
      image_strategy: imageStrategy,
      generator_ran: false,
      artifact_path: null
    };
  }

  if (typeof generateImage !== "function") {
    if (requiredVisual.required_for_comprehension) {
      throw new Error(
        `Slide ${slideNumber} requires a visual path for role "${visualRole}", but no image generator is configured.`
      );
    }
    return {
      slide_number: slideNumber,
      visual_role: visualRole,
      image_strategy: imageStrategy,
      generator_ran: false,
      artifact_path: null
    };
  }

  const outputPath = path.join(
    runRoot,
    "artifacts",
    "generated-images",
    `slide-${String(slideNumber).padStart(2, "0")}.png`
  );
  try {
    const generatedPath = await generateImage({
      prompt: requiredVisual.prompt,
      outputPath,
      slideNumber
    });
    if (generatedPath) {
      slideModel.imagePaths = [...(slideModel.imagePaths || []), generatedPath];
      return {
        slide_number: slideNumber,
        visual_role: visualRole,
        image_strategy: imageStrategy,
        generator_ran: true,
        artifact_path: generatedPath
      };
    }
    if (requiredVisual.required_for_comprehension) {
      throw new Error("image generator returned no artifact");
    }
  } catch (error) {
    if (requiredVisual.required_for_comprehension) {
      throw new Error(
        `Slide ${slideNumber} is not understandable without required visual support: ${error.message}`
      );
    }
    partialFailures.push({
      slide_number: slideNumber,
      asset: requiredVisual.prompt,
      fallback: requiredVisual.fallback || "layout",
      reason: error.message
    });
  }

  return {
    slide_number: slideNumber,
    visual_role: visualRole,
    image_strategy: imageStrategy,
    generator_ran: true,
    artifact_path: null
  };
}

module.exports = {
  parseManuscriptSlides,
  buildDeckFromHandoff
};
