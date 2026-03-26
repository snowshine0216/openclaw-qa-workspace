"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { analyzeReferences } = require("../scripts/lib/reference-analysis");
const { initializeCreateWorkflow } = require("../scripts/lib/create-workflow");
const { runDesignPass } = require("../scripts/lib/design-pass");

function tmpRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "ppt-agent-reference-"));
}

test("analyzeReferences infers advisory style and structure signals from readable references", () => {
  const rootDir = tmpRoot();
  const readableReference = path.join(rootDir, "reference-deck.md");
  fs.writeFileSync(
    readableReference,
    [
      "# Board Update Reference",
      "Accent color: #C75C1D",
      "Typography: crisp sans with restrained serif accents",
      "Layout archetypes:",
      "- title hero",
      "- comparison matrix",
      "- process flow",
      "- closing recommendation",
      "Narrative spine:",
      "- opening context",
      "- market comparison",
      "- operating process",
      "- decision ask"
    ].join("\n")
  );

  const analysis = analyzeReferences({
    references: [{ path: readableReference }]
  });

  assert.equal(analysis.strategy, "style_and_structure");
  assert.equal(analysis.styleInfluence.accentColor, "#C75C1D");
  assert.match(analysis.styleInfluence.typographyMood, /serif/i);
  assert.deepEqual(analysis.structureInfluence.slideFamilySequence.slice(0, 4), [
    "title",
    "comparison",
    "process",
    "closing"
  ]);
  assert.equal(analysis.unreadableReferences.length, 0);
});

test("analyzeReferences resolves style-only and structure-only strategies distinctly", () => {
  const rootDir = tmpRoot();
  const styleReference = path.join(rootDir, "style-reference.md");
  const structureReference = path.join(rootDir, "structure-reference.md");

  fs.writeFileSync(
    styleReference,
    [
      "# Style Reference",
      "Accent color: #C75C1D",
      "Typography: crisp sans with restrained serif accents",
      "Composition: comparison-led layouts with sparse supporting copy"
    ].join("\n")
  );
  fs.writeFileSync(
    structureReference,
    [
      "# Structure Reference",
      "opening context",
      "market comparison",
      "process flow",
      "closing recommendation"
    ].join("\n")
  );

  const styleOnly = analyzeReferences({
    references: [{ path: styleReference }],
    preferredReferenceMode: "style"
  });
  const structureOnly = analyzeReferences({
    references: [{ path: structureReference }]
  });

  assert.equal(styleOnly.strategy, "style");
  assert.equal(structureOnly.strategy, "structure");
});

test("analyzeReferences extracts advisory signals from a PPTX reference deck through deck-aware parsing", () => {
  const pptxReference = path.resolve(
    __dirname,
    "..",
    "fixtures",
    "qa-plan-orchestrator-consulting.pptx"
  );

  const analysis = analyzeReferences({
    references: [{ path: pptxReference }]
  });

  assert.equal(analysis.readableReferences[0].sourceFormat, "pptx");
  assert.ok(analysis.readableReferences[0].extractedLineCount > 0);
  assert.ok(analysis.structureInfluence.slideFamilySequence.length > 0);
  assert.equal(analysis.unreadableReferences.length, 0);
});

test("create workflow records inferred reference strategy during intake", () => {
  const rootDir = tmpRoot();
  const structureReference = path.join(rootDir, "structure-reference.md");
  fs.writeFileSync(
    structureReference,
    [
      "# Structure Reference",
      "opening context",
      "market comparison",
      "process flow",
      "closing recommendation"
    ].join("\n")
  );

  const result = initializeCreateWorkflow({
    rootDir,
    prompt: "Build a market landscape deck on enterprise browser automation adoption in 2026.",
    objective: "Summarize the market and leadership recommendation.",
    references: [{ path: structureReference }],
    sourceProvenance: [
      {
        title: "Enterprise Browser Automation Outlook 2026",
        locator: "https://example.com/browser-automation-outlook-2026",
        summary: "Regulated support teams are increasing browser automation adoption with governance controls."
      }
    ]
  });

  assert.equal(result.status, "ready");
  assert.equal(result.manifest.reference_strategy, "structure");
  const selection = JSON.parse(
    fs.readFileSync(path.join(result.runRoot, "input", "reference_selection.json"), "utf8")
  );
  assert.equal(selection.strategy, "structure");
});

test("runDesignPass applies reference-driven structure and style without switching to template editing", () => {
  const runRoot = tmpRoot();
  fs.mkdirSync(path.join(runRoot, "artifacts"), { recursive: true });

  const manuscriptPath = path.join(runRoot, "artifacts", "manuscript.md");
  fs.writeFileSync(
    manuscriptPath,
    [
      "# Enterprise Automation Review",
      "",
      "Slide title: Executive Summary",
      "- Adoption is accelerating in regulated support workflows.",
      "---",
      "Slide title: Market Comparison",
      "- Compare incumbent RPA tools with browser-native automation vendors.",
      "---",
      "Slide title: Delivery Process",
      "- Show phased rollout from pilot to governed production.",
      "---",
      "Slide title: Recommendation",
      "- Approve a two-quarter adoption plan."
    ].join("\n")
  );

  const { designPlanPath, slideBuildSpecPath, handoffPath } = runDesignPass({
    runRoot,
    objective: "Summarize the market, operating model, and recommendation.",
    audience: "Executive leadership",
    prompt: "Build a business deck on enterprise browser automation adoption in 2026.",
    manuscriptPath,
    referenceAnalysis: {
      strategy: "style_and_structure",
      styleInfluence: {
        accentColor: "#C75C1D",
        typographyMood: "crisp sans with restrained serif accents",
        compositionDiscipline: "comparison-led layouts with sparse supporting copy"
      },
      structureInfluence: {
        slideFamilySequence: ["title", "comparison", "process", "closing"],
        layoutArchetypes: ["title_hero", "comparison_matrix", "process_flow", "closing_statement"]
      },
      readableReferences: [{ path: "/tmp/reference.md" }],
      unreadableReferences: [],
      warnings: []
    }
  });

  const designPlan = fs.readFileSync(designPlanPath, "utf8");
  const slideBuildSpec = JSON.parse(fs.readFileSync(slideBuildSpecPath, "utf8"));
  const handoff = JSON.parse(fs.readFileSync(handoffPath, "utf8"));

  assert.match(designPlan, /Reference strategy: style_and_structure/);
  assert.match(designPlan, /Accent color: #C75C1D/);
  assert.match(designPlan, /comparison/i);
  assert.match(designPlan, /process/i);
  assert.deepEqual(
    slideBuildSpec.slides.map((slide) => slide.layout),
    ["title_hero", "comparison_matrix", "process_flow", "closing_statement"]
  );
  assert.equal(handoff.buildPath, "new_deck_generation");
  assert.equal(handoff.reasoning_host, "portable_cli");
  assert.equal(handoff.reasoning_mode, "scripted_local");
  assert.equal(handoff.execution_contract_version, "v2");
  assert.equal(handoff.templateEditingMode, false);
});
