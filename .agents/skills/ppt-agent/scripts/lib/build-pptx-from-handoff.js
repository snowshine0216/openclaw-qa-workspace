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
const { generateImageMetaPrompt } = require("./image-meta-prompt");

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
      partialFailures,
      designTokens
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
  partialFailures,
  designTokens = {}
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

  // Generate image meta prompt if we have a slide brief with primary_visual_anchor
  let metaPromptPath = null;
  let finalPrompt = requiredVisual.prompt;

  if (slideSpec.slide_brief) {
    const metaPromptResult = generateImageMetaPrompt({
      runRoot,
      slideBrief: slideSpec.slide_brief,
      slideNumber,
      designTokens
    });
    if (metaPromptResult) {
      metaPromptPath = metaPromptResult.metaPromptPath;
      finalPrompt = metaPromptResult.finalPrompt;
    }
  }

  try {
    const generatedPath = await generateImage({
      prompt: finalPrompt,
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
        artifact_path: generatedPath,
        meta_prompt_path: metaPromptPath
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
      asset: finalPrompt,
      fallback: requiredVisual.fallback || "layout",
      reason: error.message
    });
  }

  return {
    slide_number: slideNumber,
    visual_role: visualRole,
    image_strategy: imageStrategy,
    generator_ran: true,
    artifact_path: null,
    meta_prompt_path: metaPromptPath
  };
}

/**
 * Build a single slide from a slide brief spec.
 * Used for structured_rebuild actions in edit mode.
 *
 * @param {Object} params
 * @param {Object} params.slideBrief - Slide brief with composition_family, content, etc.
 * @param {string} params.outputPath - Path for temporary single-slide deck
 * @param {Object} params.designTokens - Design tokens from source theme
 * @param {Function} params.pptxFactory - Optional PptxGenJS factory
 * @param {Function} params.generateImage - Optional image generator
 * @returns {Promise<Object>} Result with outputPath and slideCount
 */
async function buildSlideFromSpec({
  slideBrief,
  outputPath,
  designTokens,
  pptxFactory,
  generateImage
}) {
  if (!slideBrief) {
    throw new Error("slideBrief is required");
  }
  if (!outputPath) {
    throw new Error("outputPath is required");
  }

  const { COMPOSITION_FAMILY } = require("./shared-constants");

  // Convert slide brief to slideModel format
  const slideModel = {
    title: slideBrief.title || "",
    bodyLines: Array.isArray(slideBrief.on_slide_copy)
      ? slideBrief.on_slide_copy
      : [slideBrief.on_slide_copy || ""],
    imagePaths: slideBrief.primary_visual_anchor?.artifact_path
      ? [slideBrief.primary_visual_anchor.artifact_path]
      : []
  };

  // Map composition_family to layout
  const layoutMap = {
    [COMPOSITION_FAMILY.TITLE_HERO]: "title_hero",
    [COMPOSITION_FAMILY.SECTION_DIVIDER]: "section_divider",
    [COMPOSITION_FAMILY.EVIDENCE_PANEL]: "two_column",
    [COMPOSITION_FAMILY.COMPARISON_MATRIX]: "comparison_matrix",
    [COMPOSITION_FAMILY.PROCESS_FLOW]: "process_flow",
    [COMPOSITION_FAMILY.TABLE_SUMMARY]: "data_panel",
    [COMPOSITION_FAMILY.TEXT_STATEMENT]: "two_column",
    [COMPOSITION_FAMILY.CLOSING_STATEMENT]: "closing_statement"
  };

  const slideSpec = {
    layout: layoutMap[slideBrief.composition_family] || "two_column",
    title: slideBrief.title,
    role: slideBrief.slide_goal
  };

  const slideEntry = { slideModel, slideSpec };

  const result = await createDeckFromSpec({
    deckTitle: slideBrief.title || "Single Slide",
    layout: "LAYOUT_16x9",
    outputPath,
    designTokens: designTokens || {},
    slides: [slideEntry],
    manuscriptPath: null,
    pptxFactory
  });

  return result;
}

/**
 * Build a single-slide PPTX package from a normalized structured spec
 * (output of buildStructuredSlideSpec()).
 *
 * @param {Object} params
 * @param {Object} params.spec - Normalized structured spec with layout, content, design_tokens
 * @param {string} params.outputPath - Path for the single-slide PPTX output
 * @param {Function} [params.pptxFactory] - Optional PptxGenJS factory for testing
 * @param {Function} [params.createDeckFromSpecImpl] - Optional override for testing
 * @returns {Promise<Object>} Result with outputPath and slideCount
 */
async function buildSlideFromStructuredSpec({
  spec,
  outputPath,
  pptxFactory,
  createDeckFromSpecImpl
}) {
  if (!spec) {
    throw new Error("spec is required");
  }
  if (!outputPath) {
    throw new Error("outputPath is required");
  }

  const slideModel = {
    title: spec.content.title,
    bodyLines: spec.content.body_lines,
    imagePaths: spec.content.image_paths
  };

  const slideSpec = {
    layout: spec.layout,
    title: spec.content.title,
    role: spec.source_brief?.slide_goal || null
  };

  const deckFn = createDeckFromSpecImpl || createDeckFromSpec;

  return deckFn({
    deckTitle: spec.content.title || "Single Slide",
    layout: "LAYOUT_16x9",
    outputPath,
    designTokens: spec.design_tokens || {},
    slides: [{ slideModel, slideSpec }],
    manuscriptPath: null,
    pptxFactory
  });
}

/**
 * Execute all structured_rebuild jobs that have status "planned".
 * For each job: renders the single-slide package then merges it into the working deck.
 * Returns an updated copy of the jobs array with status "applied".
 * Fail-closed: throws immediately if any rendering or merge fails.
 *
 * @param {Object} params
 * @param {string} params.runRoot - Run root directory
 * @param {Array} params.jobs - Array of edit jobs from edit_handoff.json
 * @param {Function} [params.buildSlideImpl] - Override for buildSlideFromStructuredSpec (testing)
 * @param {Function} [params.mergeRebuiltSlideImpl] - Override for mergeRebuiltSlide (testing)
 * @returns {Promise<Array>} Updated jobs array
 */
async function executeStructuredRebuilds({
  runRoot,
  jobs,
  buildSlideImpl,
  mergeRebuiltSlideImpl
}) {
  const { mergeRebuiltSlide } = require("./merge-back");
  const originalSlideIndexPath = path.join(runRoot, "artifacts", "original-slide-index.json");
  const originalSlideIndex = fs.existsSync(originalSlideIndexPath)
    ? JSON.parse(fs.readFileSync(originalSlideIndexPath, "utf8"))
    : [];

  const unpackedRoot = path.join(runRoot, "working", "unpacked");
  const buildFn = buildSlideImpl || buildSlideFromStructuredSpec;
  const mergeFn = mergeRebuiltSlideImpl || mergeRebuiltSlide;

  const updatedJobs = [];
  for (const job of jobs) {
    if (job.action !== "structured_rebuild" || job.status !== "planned") {
      updatedJobs.push(job);
      continue;
    }

    const spec = job.structured_spec;
    const outputPath = job.artifact_path;

    await buildFn({ spec, outputPath });

    const slideExists = originalSlideIndex.some(
      (entry) => entry.slide_number === job.slide_number
    );
    const actionKind = slideExists ? "replace_existing" : "insert_after";
    const replaceSlideFile = slideExists
      ? (originalSlideIndex.find((e) => e.slide_number === job.slide_number) || {}).slide_file
      : undefined;

    mergeFn({
      sourcePackagePath: outputPath,
      targetUnpackedRoot: unpackedRoot,
      targetSlideNumber: job.slide_number,
      actionKind,
      replaceSlideFile: replaceSlideFile ? path.basename(replaceSlideFile) : undefined,
      originalSlideIndex
    });

    updatedJobs.push({ ...job, status: "applied" });
  }

  return updatedJobs;
}

module.exports = {
  parseManuscriptSlides,
  buildDeckFromHandoff,
  buildSlideFromSpec,
  buildSlideFromStructuredSpec,
  executeStructuredRebuilds
};
