"use strict";

const fs = require("fs");
const path = require("path");

const { parseManuscriptSlides } = require("./manuscript");
const { inferLayoutFromTitle } = require("./design-pass");
const { buildDeckFromHandoff } = require("./build-pptx-from-handoff");
const { evaluateRun } = require("./evaluate-run");

async function runRefinementLoop({
  runRoot,
  maxRounds = 3,
  buildDeck,
  evaluate
}) {
  let roundsUsed = 0;
  const build = buildDeck || (() => defaultBuildDeck(runRoot));
  const score = evaluate || (() => defaultEvaluate(runRoot));
  let evaluation = await score();

  while (
    evaluation.summary &&
    evaluation.summary.status !== "pass" &&
    evaluation.summary.reason === "quality_threshold_failed" &&
    roundsUsed < maxRounds
  ) {
    const target = pickPrimaryTarget(evaluation.summary.refinementTargets || []);
    roundsUsed += 1;
    applyRefinement({ runRoot, target });
    writeRefinementLog({ runRoot, roundsUsed, target });
    await build({ reason: `${target.stage}_refinement` });
    evaluation = await score();
  }

  return {
    status: evaluation.summary ? evaluation.summary.status : "fail",
    roundsUsed,
    evaluation: evaluation.summary || evaluation
  };
}

function defaultBuildDeck(runRoot) {
  return buildDeckFromHandoff({
    handoffPath: path.join(runRoot, "artifacts", "pptx-handoff.json")
  });
}

function defaultEvaluate(runRoot) {
  return Promise.resolve(
    evaluateRun({
      runRoot
    })
  );
}

function pickPrimaryTarget(targets) {
  return targets[0] || { stage: "design", reason: "design average below threshold" };
}

function applyRefinement({ runRoot, target }) {
  if (target.stage === "manuscript") {
    refineManuscript(runRoot);
    return;
  }
  if (target.stage === "slide") {
    refineSlideBuildSpec(runRoot, target.slideNumbers || []);
    return;
  }
  refineDesignArtifacts(runRoot);
}

function refineManuscript(runRoot) {
  const manuscriptPath = path.join(runRoot, "artifacts", "manuscript.md");
  const parsed = parseManuscriptSlides(fs.readFileSync(manuscriptPath, "utf8"));
  const normalized = [`# ${parsed.deckTitle}`];
  parsed.slides.forEach((slide, index) => {
    normalized.push("");
    normalized.push(`Slide title: ${slide.title}`);
    const bodyLines = slide.bodyLines.slice(0, 4);
    bodyLines.forEach((line) => normalized.push(`- ${line}`));
    if (slide.provenanceNotes.length > 0) {
      normalized.push("Source provenance notes:");
      slide.provenanceNotes.forEach((note) => normalized.push(`Source note: ${note}`));
    }
    if (index < parsed.slides.length - 1) {
      normalized.push("");
      normalized.push("---");
    }
  });
  fs.writeFileSync(manuscriptPath, normalized.join("\n"));
}

function refineDesignArtifacts(runRoot) {
  const designPlanPath = path.join(runRoot, "artifacts", "design_plan.md");
  const slideBuildSpecPath = path.join(runRoot, "artifacts", "slide-build-spec.json");
  const designPlan = fs.existsSync(designPlanPath)
    ? fs.readFileSync(designPlanPath, "utf8")
    : "";
  const updatedDesignPlan = String(designPlan)
    .replace(/Accent color:\s*#[0-9A-Fa-f]{6}/i, "Accent color: #FA6611")
    .replace(/Tone:\s*.+/i, "Tone: restrained business deck")
    .replace(/Minimal text:\s*no/i, "Minimal text: yes");
  fs.writeFileSync(
    designPlanPath,
    updatedDesignPlan.includes("#FA6611")
      ? updatedDesignPlan
      : `${updatedDesignPlan}\n- Accent color: #FA6611`
  );

  if (!fs.existsSync(slideBuildSpecPath)) {
    return;
  }
  const buildSpec = JSON.parse(fs.readFileSync(slideBuildSpecPath, "utf8"));
  buildSpec.design_tokens = {
    ...(buildSpec.design_tokens || {}),
    accent_color: "#FA6611"
  };
  buildSpec.slides = (buildSpec.slides || []).map((slide, index, slides) => ({
    ...slide,
    layout:
      slide.layout === "basic"
        ? inferLayoutFromTitle(slide.title, index === slides.length - 1 ? "closing" : "content")
        : slide.layout
  }));
  fs.writeFileSync(slideBuildSpecPath, JSON.stringify(buildSpec, null, 2));
}

function refineSlideBuildSpec(runRoot, slideNumbers) {
  const slideBuildSpecPath = path.join(runRoot, "artifacts", "slide-build-spec.json");
  if (!fs.existsSync(slideBuildSpecPath)) {
    return;
  }
  const targetSet = new Set(slideNumbers);
  const buildSpec = JSON.parse(fs.readFileSync(slideBuildSpecPath, "utf8"));
  buildSpec.slides = (buildSpec.slides || []).map((slide) => {
    if (targetSet.size > 0 && !targetSet.has(slide.slide_number)) {
      return slide;
    }
    return {
      ...slide,
      layout: inferLayoutFromTitle(slide.title, slide.role || "content"),
      bullet_count: Math.min(slide.bullet_count || 0, 4)
    };
  });
  fs.writeFileSync(slideBuildSpecPath, JSON.stringify(buildSpec, null, 2));
}

function writeRefinementLog({ runRoot, roundsUsed, target }) {
  const logPath = path.join(runRoot, "logs", "refinement-log.json");
  const current = fs.existsSync(logPath)
    ? JSON.parse(fs.readFileSync(logPath, "utf8"))
    : [];
  current.push({
    round: roundsUsed,
    stage: target.stage,
    reason: target.reason || ""
  });
  fs.writeFileSync(logPath, JSON.stringify(current, null, 2));
}

module.exports = {
  runRefinementLoop
};
