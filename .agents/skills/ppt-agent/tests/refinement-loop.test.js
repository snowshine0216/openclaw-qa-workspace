"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { runRefinementLoop } = require("../scripts/lib/refinement-loop");

function tmpRoot() {
  const runRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ppt-agent-refine-"));
  fs.mkdirSync(path.join(runRoot, "artifacts"), { recursive: true });
  fs.mkdirSync(path.join(runRoot, "logs"), { recursive: true });
  return runRoot;
}

test("runRefinementLoop reruns the smallest affected stage and converges within the max rounds", async () => {
  const runRoot = tmpRoot();
  const manuscriptPath = path.join(runRoot, "artifacts", "manuscript.md");
  const designPlanPath = path.join(runRoot, "artifacts", "design_plan.md");
  const slideBuildSpecPath = path.join(runRoot, "artifacts", "slide-build-spec.json");

  fs.writeFileSync(
    manuscriptPath,
    [
      "# Market Deck",
      "",
      "Slide title: Executive Summary",
      "- Long dense line one",
      "- Long dense line two",
      "---",
      "Slide title: Recommendation",
      "- Approve rollout"
    ].join("\n")
  );
  fs.writeFileSync(
    designPlanPath,
    [
      "# Design Plan: Market Deck",
      "",
      "## Brief",
      "- Reference strategy: none",
      "## Visual Motif Rules",
      "- Tone: generic blue deck",
      "- Minimal text: no"
    ].join("\n")
  );
  fs.writeFileSync(
    slideBuildSpecPath,
    JSON.stringify(
      {
        slides: [
          { slide_number: 1, title: "Executive Summary", layout: "basic", bullet_count: 8 },
          { slide_number: 2, title: "Recommendation", layout: "basic", bullet_count: 1 }
        ],
        design_tokens: { accent_color: "#0055FF" }
      },
      null,
      2
    )
  );

  const buildCalls = [];
  const evaluateCalls = [];
  const result = await runRefinementLoop({
    runRoot,
    maxRounds: 3,
    buildDeck: async ({ reason }) => {
      buildCalls.push(reason);
      return { outputPath: path.join(runRoot, "artifacts", "output.pptx") };
    },
    evaluate: async () => {
      evaluateCalls.push(true);
      return evaluateCalls.length === 1
        ? {
            summary: {
              status: "fail",
              reason: "quality_threshold_failed",
              refinementTargets: [
                { stage: "design", reason: "design average below threshold" }
              ]
            }
          }
        : {
            summary: {
              status: "pass",
              reason: "pass",
              refinementTargets: []
            }
          };
    }
  });

  const refinedDesignPlan = fs.readFileSync(designPlanPath, "utf8");
  const refinedSlideBuildSpec = JSON.parse(fs.readFileSync(slideBuildSpecPath, "utf8"));

  assert.equal(result.status, "pass");
  assert.equal(result.roundsUsed, 1);
  assert.deepEqual(buildCalls, ["design_refinement"]);
  assert.equal(evaluateCalls.length, 2);
  assert.match(refinedDesignPlan, /#FA6611/);
  assert.equal(refinedSlideBuildSpec.design_tokens.accent_color, "#FA6611");
  assert.notEqual(refinedSlideBuildSpec.slides[0].layout, "basic");
});
