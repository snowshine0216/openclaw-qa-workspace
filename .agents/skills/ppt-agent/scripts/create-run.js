#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const {
  initializeCreateWorkflow,
  createPhaseArtifacts
} = require("./lib/create-workflow");
const { buildDeckFromHandoff } = require("./lib/build-pptx-from-handoff");
const { evaluateRun } = require("./lib/evaluate-run");
const { runRefinementLoop } = require("./lib/refinement-loop");
const { updateManifest } = require("./lib/run-manifest");
const { appendEvent, writeStageStatus } = require("./lib/run-logging");
const { getRuntimePaths } = require("./lib/runtime-paths");

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      continue;
    }
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    i++;
  }
  return args;
}

function parseList(value) {
  if (!value) {
    return [];
  }
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => ({ path: item }));
}

function parseSourceProvenance(value) {
  if (!value) {
    return [];
  }
  const filePath = path.resolve(value);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function loadJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileContentHash(filePath) {
  if (!filePath) {
    return null;
  }
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    return `missing:${resolved}`;
  }
  return crypto.createHash("sha256").update(fs.readFileSync(resolved)).digest("hex");
}

async function resolveRunRoot(rootDirArg) {
  const runtimePaths = rootDirArg ? null : await getRuntimePaths();
  return path.resolve(rootDirArg || runtimePaths.defaultRunsDir);
}

async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const rootDir = await resolveRunRoot(args["root-dir"]);
  const manualArtifactHash = [args.manuscript, args["design-plan"]]
    .map((item) => fileContentHash(item))
    .filter(Boolean)
    .join(":") || null;

  const result = initializeCreateWorkflow({
    rootDir,
    prompt: args.prompt,
    objective: args.objective,
    audience: args.audience,
    slideCount: args.slides ? parseInt(args.slides, 10) : undefined,
    attachments: parseList(args.attachments),
    references: parseList(args.references),
    preferredReferenceMode: args["reference-mode"],
    sourceProvenance: parseSourceProvenance(args["source-provenance"]),
    manualArtifactHash
  });

  if (result.status !== "ready") {
    process.stdout.write(JSON.stringify(result, null, 2) + "\n");
    process.exit(1);
  }

  const stageStatusPath = writeStageStatus(result.runRoot, {
    current_stage: result.resumeStage || "build",
    next_expected_outputs: ["artifacts/slide-build-spec.json", "artifacts/pptx-handoff.json"],
    prompt_only: result.promptOnly
  });
  appendEvent(result.runRoot, {
    type: "stage_transition",
    stage: result.resumeStage || "build",
    message: "Create workflow initialized"
  });
  updateManifest(result.runRoot, { status: "design" });

  const needsArtifacts = ["research", "design", "build"].includes(result.resumeStage || "build");
  const artifacts = needsArtifacts
    ? createPhaseArtifacts({
        runRoot: result.runRoot,
        prompt: args.prompt,
        objective: result.normalizedBrief.objective,
        audience: args.audience,
        attachments: parseList(args.attachments),
        references: parseList(args.references),
        referenceStrategy: result.referenceAnalysis?.strategy || result.manifest.reference_strategy,
        manuscriptPath: args.manuscript,
        designPlanPath: args["design-plan"],
        sourceProvenance: parseSourceProvenance(args["source-provenance"])
      })
    : {
        status: "ready",
        manuscriptPath: path.join(result.runRoot, "artifacts", "manuscript.md"),
        designPlanPath: path.join(result.runRoot, "artifacts", "design_plan.md"),
        slideBuildSpecPath: path.join(result.runRoot, "artifacts", "slide-build-spec.json"),
        pptxHandoffPath: path.join(result.runRoot, "artifacts", "pptx-handoff.json"),
        referenceAnalysisPath: path.join(result.runRoot, "artifacts", "reference-analysis.json"),
        researchHandoffPath: path.join(result.runRoot, "artifacts", "research-handoff.json"),
        designHandoffPath: path.join(result.runRoot, "artifacts", "design-handoff.json")
      };
  if (artifacts.status !== "ready") {
    updateManifest(result.runRoot, { status: "failed" });
    writeStageStatus(result.runRoot, {
      current_stage: "failed",
      prompt_only: result.promptOnly,
      reason: artifacts.reason
    });
    appendEvent(result.runRoot, {
      type: "failure",
      stage: "design",
      reason: artifacts.reason
    });
    process.stdout.write(
      JSON.stringify(
        {
          status: artifacts.status,
          reason: artifacts.reason,
          runRoot: result.runRoot,
          resumed: result.resumed,
          resumeStage: result.resumeStage,
          manifestPath: path.join(result.runRoot, "manifest.json"),
          stageStatusPath,
          referenceAnalysisPath: artifacts.referenceAnalysisPath,
          researchHandoffPath: artifacts.researchHandoffPath,
          unreadableAttachments: artifacts.unreadableAttachments || []
        },
        null,
        2
      ) + "\n"
    );
    process.exit(1);
  }

  const outputPath = path.join(result.runRoot, "artifacts", "output.pptx");
  const phase1EvalPath = path.join(result.runRoot, "artifacts", "phase1-eval.json");
  const manualArtifactMode = Boolean(args.manuscript && args["design-plan"]);
  const shouldBuild = ["build", "research", "design"].includes(result.resumeStage || "build");
  const shouldEvaluate =
    shouldBuild || ["evaluate"].includes(result.resumeStage || "build") || !fs.existsSync(phase1EvalPath);

  let build = !manualArtifactMode && shouldBuild
    ? await buildDeckFromHandoff({
        handoffPath: artifacts.pptxHandoffPath
      })
    : {
        outputPath,
        reused: true,
        skipped: manualArtifactMode
      };
  if (!manualArtifactMode && shouldBuild) {
    updateManifest(result.runRoot, { status: "build" });
    writeStageStatus(result.runRoot, {
      current_stage: "build",
      output_path: build.outputPath,
      prompt_only: result.promptOnly
    });
    appendEvent(result.runRoot, {
      type: "stage_transition",
      stage: "build",
      output_path: build.outputPath
    });
  }

  let evaluation = !manualArtifactMode && shouldEvaluate
    ? evaluateRun({
        runRoot: result.runRoot
      })
    : {
        summary: loadJsonIfExists(phase1EvalPath)
      };
  if (!manualArtifactMode && shouldEvaluate) {
    updateManifest(result.runRoot, { status: "evaluate" });
    writeStageStatus(result.runRoot, {
      current_stage: "evaluate",
      output_path: build.outputPath,
      prompt_only: result.promptOnly
    });
    appendEvent(result.runRoot, {
      type: "stage_transition",
      stage: "evaluate",
      output_path: build.outputPath
    });
  }
  let refinement = null;
  if (!manualArtifactMode && evaluation.summary && evaluation.summary.reason === "quality_threshold_failed") {
    refinement = await runRefinementLoop({
      runRoot: result.runRoot,
      buildDeck: async ({ reason }) =>
        buildDeckFromHandoff({
          handoffPath: artifacts.pptxHandoffPath,
          reason
        }),
      evaluate: async () =>
        evaluateRun({
          runRoot: result.runRoot
        })
    });
    evaluation = { summary: refinement.evaluation };
  }
  const evaluationPassed = Boolean(evaluation.summary && evaluation.summary.status === "pass");
  const finalStage = manualArtifactMode
    ? "design"
    : evaluationPassed
      ? "complete"
      : "failed";
  const cliStatus = manualArtifactMode || evaluationPassed ? "ready" : "failed";
  updateManifest(result.runRoot, {
    status: finalStage
  });
  writeStageStatus(result.runRoot, {
    current_stage: finalStage,
    output_path: build.outputPath,
    prompt_only: result.promptOnly,
    refinement_rounds: refinement ? refinement.roundsUsed : 0
  });
  appendEvent(result.runRoot, {
    type: "stage_transition",
    stage: finalStage,
    output_path: build.outputPath,
    refinement_rounds: refinement ? refinement.roundsUsed : 0
  });

  process.stdout.write(
    JSON.stringify(
      {
        status: cliStatus,
        runRoot: result.runRoot,
        resumed: result.resumed,
        resumeStage: result.resumeStage,
        manifestPath: path.join(result.runRoot, "manifest.json"),
        stageStatusPath,
        manuscriptPath: artifacts.manuscriptPath,
        designPlanPath: artifacts.designPlanPath,
        slideBuildSpecPath: artifacts.slideBuildSpecPath,
        pptxHandoffPath: artifacts.pptxHandoffPath,
        referenceAnalysisPath: artifacts.referenceAnalysisPath,
        researchHandoffPath: artifacts.researchHandoffPath,
        designHandoffPath: artifacts.designHandoffPath,
        outputPath: build.outputPath,
        partial: build.partial || false,
        partialSummary: build.partialSummary || null,
        evaluation: evaluation.summary,
        refinement
      },
      null,
      2
    ) + "\n"
  );
  if (!manualArtifactMode && !evaluationPassed) {
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((error) => {
    process.stderr.write(`[create-run] Error: ${error.message}\n`);
    process.exit(1);
  });
}

module.exports = {
  main,
  resolveRunRoot
};
