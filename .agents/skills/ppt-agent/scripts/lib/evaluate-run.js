"use strict";

const fs = require("fs");
const path = require("path");

const { parseManuscriptSlides } = require("./manuscript");
const { parseDesignPlan } = require("./phase1-content");
const { inspectRenderedSlides } = require("./render-inspection");

const PROMPT_PATHS = [
  path.resolve(__dirname, "..", "..", "prompts", "eval-content.md"),
  path.resolve(__dirname, "..", "..", "prompts", "eval-design.md"),
  path.resolve(__dirname, "..", "..", "prompts", "eval-coherence.md")
];

function evaluateRun({ runRoot }) {
  if (!runRoot) {
    throw new Error("runRoot is required");
  }

  const manifestPath = path.join(runRoot, "manifest.json");
  const manuscriptPath = path.join(runRoot, "artifacts", "manuscript.md");
  const designPlanPath = path.join(runRoot, "artifacts", "design_plan.md");
  const handoffPath = path.join(runRoot, "artifacts", "pptx-handoff.json");
  const slideBuildSpecPath = path.join(runRoot, "artifacts", "slide-build-spec.json");
  const outputPptxPath = path.join(runRoot, "artifacts", "output.pptx");
  const rendersDir = path.join(runRoot, "renders");

  const checks = {
    manifest: fs.existsSync(manifestPath),
    manuscript: fs.existsSync(manuscriptPath),
    design_plan: fs.existsSync(designPlanPath),
    slide_build_spec: fs.existsSync(slideBuildSpecPath),
    pptx_handoff: fs.existsSync(handoffPath),
    output_pptx: fs.existsSync(outputPptxPath)
  };

  const missing = Object.entries(checks)
    .filter(([, ok]) => !ok)
    .map(([name]) => name);

  if (missing.length > 0) {
    return writeOutputs(runRoot, {
      status: "fail",
      checks,
      missing,
      reason: `Missing required Phase 1 artifacts: ${missing.join(", ")}`
    });
  }

  const manuscript = parseManuscriptSlides(fs.readFileSync(manuscriptPath, "utf8"));
  const designPlan = parseDesignPlan(fs.readFileSync(designPlanPath, "utf8"));
  const buildSpec = JSON.parse(fs.readFileSync(slideBuildSpecPath, "utf8"));
  const renderedSlides = listRenderedSlides(rendersDir);
  if (renderedSlides.length === 0) {
    return writeOutputs(runRoot, {
      status: "fail",
      checks,
      missing,
      reason: "evaluation_unavailable",
      render_count: 0
    });
  }
  const scores = evaluateDimensions({ manuscript, designPlan, buildSpec });
  const renderAlignment = buildRenderAlignment(buildSpec, renderedSlides);
  const renderChecks = inspectRenderedSlides(rendersDir, renderedSlides);
  const slideScores = buildSlideScores(buildSpec, renderAlignment, renderChecks);
  const overall = Number(
    ((scores.content.average + scores.design.average + scores.coherence.score) / 3).toFixed(2)
  );
  const passes =
    scores.content.average >= 4 &&
    scores.design.average >= 4 &&
    scores.coherence.score >= 4 &&
    overall >= 4 &&
    renderAlignment.coverage_ratio === 1 &&
    scores.errors.length === 0 &&
    renderChecks.invalid_count === 0;
  const refinementTargets = deriveRefinementTargets({ scores, slideScores });
  if (renderChecks.invalid_count > 0) {
    return writeOutputs(runRoot, {
      status: "partial",
      checks,
      missing,
      reason: "recoverable_evaluation_error",
      render_count: renderedSlides.length,
      render_checks: renderChecks,
      recoverable_errors: renderChecks.recoverable_errors,
      slides: slideScores,
      coherence: scores.coherence,
      refinementTargets: [],
      summary: {
        content_avg: scores.content.average,
        design_avg: scores.design.average,
        coherence: scores.coherence.score,
        overall,
        render_alignment: renderAlignment,
        refinementTargets: []
      },
      rubric: {
        prompts: PROMPT_PATHS.filter((filePath) => fs.existsSync(filePath))
      },
      scores
    });
  }

  return writeOutputs(runRoot, {
    status: passes ? "pass" : "fail",
    checks,
    missing,
    reason: passes ? "pass" : "quality_threshold_failed",
    render_count: renderedSlides.length,
    render_checks: renderChecks,
    slides: slideScores,
    coherence: scores.coherence,
    refinementTargets,
    summary: {
      content_avg: scores.content.average,
      design_avg: scores.design.average,
      coherence: scores.coherence.score,
      overall,
      render_alignment: renderAlignment,
      refinementTargets
    },
    rubric: {
      prompts: PROMPT_PATHS.filter((filePath) => fs.existsSync(filePath))
    },
    scores
  });
}

function writeOutputs(runRoot, summary) {
  const evalsPath = path.join(runRoot, "artifacts", "evals.json");
  const outputPath = path.join(runRoot, "artifacts", "phase1-eval.json");
  fs.writeFileSync(evalsPath, JSON.stringify(summary, null, 2));
  fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2));
  return { outputPath, summary };
}

function scoreContent(manuscript, buildSpec) {
  const slides = buildSpec.slides || manuscript.slides.map((slide) => ({
    title: slide.title,
    bullet_count: slide.bodyLines.length
  }));
  const values = slides.map((slide) => {
    let score = 3;
    if (slide.title) score += 0.5;
    if (slide.bullet_count >= 1 && slide.bullet_count <= 4) score += 1;
    if (slide.bullet_count > 5) score -= 1.5;
    if (/summary|risk|decision|performance/i.test(slide.title || "")) score += 0.5;
    return clampScore(score);
  });
  return summarizeDimension(values, "Content favors clear slide messages with disciplined text.");
}

function scoreDesign(designPlan, buildSpec) {
  let score = 2.5;
  if ((buildSpec.design_tokens?.accent_color || designPlan.accentColor) === "#FA6611") score += 1;
  if (designPlan.minimalText) score += 1;
  if (/business|restrained/i.test(designPlan.tone || "")) score += 0.5;
  if (/generic blue/i.test(designPlan.tone || "")) score -= 2;
  const layouts = (buildSpec.slides || []).map((slide) => slide.layout).filter(Boolean);
  if (new Set(layouts).size >= 2) score += 0.5;
  if (layouts.every((layout) => layout === "basic")) score -= 1;
  const denseSlides = (buildSpec.slides || []).filter((slide) => slide.bullet_count > 5).length;
  if (denseSlides > 0) score -= 1;
  const average = clampScore(score);
  return { average, reason: "Design checks business style contract, accent color, and layout discipline." };
}

function scoreCoherence(manuscript, buildSpec) {
  let score = 3;
  const titles = manuscript.slides.map((slide) => slide.title);
  if (titles.length >= 3) score += 0.5;
  if (/summary/i.test(titles[0] || "")) score += 0.5;
  if (/decision|next/i.test(titles[titles.length - 1] || "")) score += 0.5;
  if (new Set(titles).size !== titles.length) score -= 1.5;
  if ((buildSpec.slides || []).length !== manuscript.slides.length) score -= 0.5;
  return {
    score: clampScore(score),
    reason: "Coherence checks narrative sequencing and closing discipline."
  };
}

function evaluateDimensions({ manuscript, designPlan, buildSpec }) {
  const errors = [];
  const content = safeDimension(() => scoreContent(manuscript, buildSpec), "content", errors);
  const design = safeDimension(() => scoreDesign(designPlan, buildSpec), "design", errors);
  const coherence = safeDimension(() => scoreCoherence(manuscript, buildSpec), "coherence", errors);
  return { content, design, coherence, errors };
}

function safeDimension(run, label, errors) {
  try {
    return run();
  } catch (error) {
    errors.push({ dimension: label, reason: error.message });
    return label === "coherence"
      ? { score: 1, reason: `Recoverable ${label} failure: ${error.message}` }
      : { average: 1, reason: `Recoverable ${label} failure: ${error.message}` };
  }
}

function summarizeDimension(values, reason) {
  const average = values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1);
  return { average: Number(average.toFixed(2)), reason };
}

function clampScore(value) {
  return Math.max(1, Math.min(5, Number(value.toFixed(2))));
}

function listRenderedSlides(rendersDir) {
  if (!fs.existsSync(rendersDir)) {
    return [];
  }
  return fs.readdirSync(rendersDir).filter((name) => /^slide-\d+\.(jpg|jpeg|png)$/i.test(name));
}

function buildSlideScores(buildSpec, renderAlignment, renderChecks = { recoverable_errors: [] }) {
  const missing = new Set(renderAlignment.missing_slides || []);
  const invalid = new Set(
    (renderChecks.recoverable_errors || [])
      .map((error) => error.slide)
      .filter((slide) => Number.isFinite(slide))
  );
  return (buildSpec.slides || []).reduce((acc, slide) => {
    const key = `slide-${String(slide.slide_number || Object.keys(acc).length + 1).padStart(2, "0")}`;
    const missingRender = missing.has(slide.slide_number);
    const invalidRender = invalid.has(slide.slide_number);
    const textDiscipline = slide.bullet_count >= 1 && slide.bullet_count <= 4 ? 4 : 3;
    acc[key] = {
      content: {
        score: missingRender || invalidRender ? 2 : textDiscipline,
        reason: missingRender
          ? "Slide is missing a rendered image, so content review is incomplete."
          : invalidRender
            ? "Slide render could not be inspected reliably."
          : "Slide title and text density fit the Phase 1 content rubric."
      },
      design: {
        score: missingRender || invalidRender ? 2 : slide.layout === "basic" ? 3 : 4,
        reason: missingRender
          ? "Slide is missing a rendered image, so design review is incomplete."
          : invalidRender
            ? "Slide render could not be inspected reliably."
          : "Layout choice and text discipline fit the Phase 1 design rubric."
      }
    };
    return acc;
  }, {});
}

function buildRenderAlignment(buildSpec, renderedSlides) {
  const expectedSlides = (buildSpec.slides || []).map((slide) => slide.slide_number);
  const renderedNumbers = renderedSlides
    .map((name) => Number(name.match(/slide-(\d+)/i)?.[1]))
    .filter((value) => Number.isFinite(value));
  const renderedSet = new Set(renderedNumbers);
  const missingSlides = expectedSlides.filter((slideNumber) => !renderedSet.has(slideNumber));
  const coverageRatio = expectedSlides.length === 0
    ? 0
    : Number((renderedNumbers.length / expectedSlides.length).toFixed(2));

  return {
    expected_count: expectedSlides.length,
    rendered_count: renderedNumbers.length,
    coverage_ratio: coverageRatio,
    missing_slides: missingSlides
  };
}

function deriveRefinementTargets({ scores, slideScores }) {
  const targets = [];
  if (scores.design.average < 4) {
    targets.push({ stage: "design", reason: "design average below threshold" });
  }
  if (scores.content.average < 4 || scores.coherence.score < 4) {
    targets.push({ stage: "manuscript", reason: "content or coherence below threshold" });
  }
  const slideNumbers = Object.entries(slideScores)
    .filter(([, score]) => score.content.score < 4 || score.design.score < 4)
    .map(([key]) => Number(key.replace("slide-", "")));
  if (slideNumbers.length > 0) {
    targets.push({
      stage: "slide",
      reason: "one or more slides failed local quality checks",
      slideNumbers
    });
  }
  return targets;
}

module.exports = {
  evaluateRun
};
