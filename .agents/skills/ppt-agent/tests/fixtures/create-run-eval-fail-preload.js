"use strict";

const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");

const originalLoad = Module._load;
const state = {
  runRoot: null
};
const evaluationStatus = process.env.PPT_AGENT_CREATE_RUN_EVAL_STATUS || "fail";
const evaluationReason = process.env.PPT_AGENT_CREATE_RUN_EVAL_REASON || "evaluation_unavailable";

function ensureFile(filePath, contents = "") {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents);
}

Module._load = function patchedLoad(request, parent, isMain) {
  const fromCreateRun =
    parent &&
    typeof parent.filename === "string" &&
    parent.filename.endsWith(path.join("scripts", "create-run.js"));

  if (fromCreateRun && request === "./lib/create-workflow") {
    return {
      initializeCreateWorkflow({ rootDir, objective }) {
        state.runRoot = path.join(rootDir, "stub-run");
        fs.mkdirSync(path.join(state.runRoot, "artifacts"), { recursive: true });
        fs.mkdirSync(path.join(state.runRoot, "logs"), { recursive: true });
        ensureFile(
          path.join(state.runRoot, "manifest.json"),
          JSON.stringify({ status: "design" }, null, 2)
        );
        return {
          status: "ready",
          runRoot: state.runRoot,
          resumed: false,
          resumeStage: "build",
          promptOnly: false,
          normalizedBrief: { objective },
          manifest: { reference_strategy: "style" }
        };
      },
      createPhaseArtifacts({ sourceProvenance = [] }) {
        const artifactsDir = path.join(state.runRoot, "artifacts");
        const manuscriptPath = path.join(artifactsDir, "manuscript.md");
        const designPlanPath = path.join(artifactsDir, "design_plan.md");
        const slideBuildSpecPath = path.join(artifactsDir, "slide-build-spec.json");
        const pptxHandoffPath = path.join(artifactsDir, "pptx-handoff.json");
        const referenceAnalysisPath = path.join(artifactsDir, "reference-analysis.json");
        const researchHandoffPath = path.join(artifactsDir, "research-handoff.json");
        const designHandoffPath = path.join(artifactsDir, "design-handoff.json");
        ensureFile(manuscriptPath, "# Manuscript\n");
        ensureFile(designPlanPath, "# Design Plan\n");
        ensureFile(slideBuildSpecPath, JSON.stringify({ slides: [] }, null, 2));
        ensureFile(pptxHandoffPath, JSON.stringify({ slides: [] }, null, 2));
        ensureFile(referenceAnalysisPath, JSON.stringify({ strategy: "style" }, null, 2));
        ensureFile(researchHandoffPath, JSON.stringify({ status: "ready" }, null, 2));
        ensureFile(designHandoffPath, JSON.stringify({ status: "ready" }, null, 2));
        ensureFile(
          path.join(artifactsDir, "source-provenance.json"),
          JSON.stringify({ entries: sourceProvenance }, null, 2)
        );
        return {
          status: "ready",
          manuscriptPath,
          designPlanPath,
          slideBuildSpecPath,
          pptxHandoffPath,
          referenceAnalysisPath,
          researchHandoffPath,
          designHandoffPath
        };
      }
    };
  }

  if (fromCreateRun && request === "./lib/build-pptx-from-handoff") {
    return {
      async buildDeckFromHandoff() {
        const outputPath = path.join(state.runRoot, "artifacts", "output.pptx");
        ensureFile(outputPath, "pptx");
        return { outputPath };
      }
    };
  }

  if (fromCreateRun && request === "./lib/evaluate-run") {
    return {
      evaluateRun() {
        return {
          summary: {
            status: evaluationStatus,
            reason: evaluationStatus === "pass" ? null : evaluationReason
          }
        };
      }
    };
  }

  if (fromCreateRun && request === "./lib/refinement-loop") {
    return {
      async runRefinementLoop() {
        throw new Error("runRefinementLoop should not be called in this fixture");
      }
    };
  }

  if (fromCreateRun && request === "./lib/run-manifest") {
    return {
      updateManifest() {}
    };
  }

  if (fromCreateRun && request === "./lib/run-logging") {
    return {
      appendEvent() {},
      writeStageStatus(runRoot, payload) {
        const stageStatusPath = path.join(runRoot, "logs", "stage-status.json");
        ensureFile(stageStatusPath, JSON.stringify(payload, null, 2));
        return stageStatusPath;
      }
    };
  }

  if (fromCreateRun && request === "./lib/runtime-paths") {
    return {
      async getRuntimePaths() {
        return { defaultRunsDir: process.cwd() };
      }
    };
  }

  return originalLoad.call(this, request, parent, isMain);
};
