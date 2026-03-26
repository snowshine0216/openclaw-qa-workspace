"use strict";

// Regression test using the qa-plan-orchestrator-consulting.pptx fixture.
//
// This test exercises the enrichment pipeline (transcript enrichment + speaker
// notes + visual plan) against a representative update plan derived from the
// fixture deck.  It does NOT invoke the full edit-run CLI; instead it directly
// calls the pure library modules to keep the test hermetic and fast.
//
// Guard conditions verified:
//   1. enrichSlideTranscripts produces a valid slide-briefs/index.json
//   2. All non-keep briefs have a non-empty speaker_script
//   3. All non-keep briefs have a primary_visual_anchor or text_only_exception
//   4. generateSpeakerNotesArtifacts produces notes for every non-keep brief
//   5. generateVisualPlanFromBriefs produces a valid visual-plan.json
//   6. The presenter-script.md is at least 200 characters (non-trivial content)

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { initRunState } = require("../scripts/lib/run-manifest");
const { enrichSlideTranscripts } = require("../scripts/lib/transcript-enrichment");
const { generateSpeakerNotesArtifacts } = require("../scripts/lib/speaker-script");
const { generateVisualPlanFromBriefs } = require("../scripts/lib/visual-plan");
const {
  COMPOSITION_FAMILY,
  PRIMARY_VISUAL_ANCHOR_KIND,
  PRIMARY_VISUAL_ANCHOR_SOURCE,
  RENDER_STRATEGY,
  TAKEAWAY_PLACEMENT,
  THEME_SOURCE,
  FALLBACK_ORDER
} = require("../scripts/lib/shared-constants");

// ---------------------------------------------------------------------------
// Fixture: representative slide analysis mimicking the QA-Plan deck
// ---------------------------------------------------------------------------

const FIXTURE_SLIDES = [
  {
    slide_number: 1,
    headline: "QA Planning Framework",
    body_lines: [],
    visual_assets: [],
    source_media_refs: [],
    visual_role: "hero"
  },
  {
    slide_number: 2,
    headline: "Agenda",
    body_lines: ["Overview", "QA Skill Setup", "Test Scenarios", "Results"],
    visual_assets: [],
    source_media_refs: [],
    visual_role: "agenda"
  },
  {
    slide_number: 3,
    headline: "QA Plan Orchestrator Overview",
    body_lines: ["Automates test planning", "Integrates with CI/CD", "Produces coverage reports"],
    visual_assets: ["chart"],
    source_media_refs: [],
    visual_role: "evidence"
  },
  {
    slide_number: 4,
    headline: "Test Coverage by Module",
    body_lines: ["Unit: 82%", "Integration: 74%", "E2E: 61%"],
    visual_assets: ["table"],
    source_media_refs: [],
    visual_role: "evidence"
  },
  {
    slide_number: 5,
    headline: "Thank You",
    body_lines: ["Questions?"],
    visual_assets: [],
    source_media_refs: [],
    visual_role: "closing"
  }
];

const FIXTURE_SLIDE_ACTIONS = [
  {
    slide_number: 1,
    action: "keep",
    reason: "Title slide unchanged",
    source_slide_number: 1,
    source_layout_anchor: { title_box: "shape:title" },
    source_media_refs: []
  },
  {
    slide_number: 2,
    action: "keep",
    reason: "Agenda unchanged",
    source_slide_number: 2,
    source_layout_anchor: { title_box: "shape:title" },
    source_media_refs: []
  },
  {
    slide_number: 3,
    action: "revise",
    reason: "Update coverage metrics to reflect Q1 results",
    source_slide_number: 3,
    source_layout_anchor: { title_box: "shape:title" },
    source_media_refs: []
  },
  {
    slide_number: 4,
    action: "revise",
    reason: "Refresh module coverage numbers",
    source_slide_number: 4,
    source_layout_anchor: { title_box: "shape:title" },
    source_media_refs: []
  },
  {
    slide_number: 6,
    action: "add_after",
    after_slide_number: 4,
    reason: "Add new slide summarizing key improvements from Q1",
    source_slide_number: 3,
    source_layout_anchor: { title_box: "shape:title" },
    source_media_refs: []
  },
  {
    slide_number: 5,
    action: "keep",
    reason: "Closing slide unchanged",
    source_slide_number: 5,
    source_layout_anchor: { title_box: "shape:title" },
    source_media_refs: []
  }
];

const FIXTURE_RESEARCH_DELTA = [
  "## Requested Change",
  "",
  "Update QA coverage metrics for Q1 and add improvement summary slide.",
  "",
  "## Findings",
  "",
  "- Unit test coverage improved to 87% in Q1 (up from 82%)",
  "- Integration test coverage reached 79% (up from 74%)",
  "- E2E coverage improved to 68% (up from 61%)",
  "- New snapshot testing module added in March",
  "- CI/CD pipeline now runs tests on every PR"
].join("\n");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function tmpRunRoot() {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "ppt-agent-qa-plan-"));
  const { runRoot } = initRunState({
    rootDir,
    phase: "edit",
    sourceDeckHash: "qa-plan-deck-hash",
    changeFingerprintHash: "qa-plan-change-hash"
  });
  return runRoot;
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test("QA-Plan fixture: enrichSlideTranscripts produces valid slide-briefs index", () => {
  const runRoot = tmpRunRoot();

  writeJson(path.join(runRoot, "artifacts", "update_plan.json"), {
    slide_actions: FIXTURE_SLIDE_ACTIONS
  });
  fs.writeFileSync(path.join(runRoot, "artifacts", "research_delta.md"), FIXTURE_RESEARCH_DELTA);

  const result = enrichSlideTranscripts({
    slideAnalysis: { slides: FIXTURE_SLIDES },
    researchDelta: FIXTURE_RESEARCH_DELTA,
    changeRequest: "Update QA coverage metrics and add improvement summary slide",
    runRoot
  });

  assert.equal(result.totalBriefs, FIXTURE_SLIDE_ACTIONS.length, "must produce one brief per slide action");
  assert.ok(fs.existsSync(result.indexPath), "slide-briefs/index.json must exist");

  const index = JSON.parse(fs.readFileSync(result.indexPath, "utf8"));
  assert.equal(index.total_slides, FIXTURE_SLIDE_ACTIONS.length);
  assert.ok(Array.isArray(index.briefs));
});

test("QA-Plan fixture: all non-keep briefs have non-empty speaker_script", () => {
  const runRoot = tmpRunRoot();

  writeJson(path.join(runRoot, "artifacts", "update_plan.json"), {
    slide_actions: FIXTURE_SLIDE_ACTIONS
  });
  fs.writeFileSync(path.join(runRoot, "artifacts", "research_delta.md"), FIXTURE_RESEARCH_DELTA);

  const result = enrichSlideTranscripts({
    slideAnalysis: { slides: FIXTURE_SLIDES },
    researchDelta: FIXTURE_RESEARCH_DELTA,
    changeRequest: "Update QA coverage metrics and add improvement summary slide",
    runRoot
  });

  const nonKeepActions = FIXTURE_SLIDE_ACTIONS.filter(a => a.action !== "keep");

  for (const action of nonKeepActions) {
    const briefFile = `slide-${String(action.slide_number).padStart(2, "0")}.json`;
    const briefPath = path.join(result.briefsDir, briefFile);
    assert.ok(fs.existsSync(briefPath), `${briefFile} must exist`);

    const brief = JSON.parse(fs.readFileSync(briefPath, "utf8"));
    assert.ok(
      brief.speaker_script && brief.speaker_script.trim().length > 0,
      `Slide ${action.slide_number}: speaker_script must be non-empty`
    );
  }
});

test("QA-Plan fixture: all non-keep briefs have primary_visual_anchor or text_only_exception", () => {
  const runRoot = tmpRunRoot();

  writeJson(path.join(runRoot, "artifacts", "update_plan.json"), {
    slide_actions: FIXTURE_SLIDE_ACTIONS
  });
  fs.writeFileSync(path.join(runRoot, "artifacts", "research_delta.md"), FIXTURE_RESEARCH_DELTA);

  const result = enrichSlideTranscripts({
    slideAnalysis: { slides: FIXTURE_SLIDES },
    researchDelta: FIXTURE_RESEARCH_DELTA,
    changeRequest: "Update QA coverage metrics and add improvement summary slide",
    runRoot
  });

  const nonKeepActions = FIXTURE_SLIDE_ACTIONS.filter(a => a.action !== "keep");

  for (const action of nonKeepActions) {
    const briefFile = `slide-${String(action.slide_number).padStart(2, "0")}.json`;
    const briefPath = path.join(result.briefsDir, briefFile);
    const brief = JSON.parse(fs.readFileSync(briefPath, "utf8"));

    const hasAnchor = brief.primary_visual_anchor && brief.primary_visual_anchor.kind;
    const hasException = brief.text_only_exception && brief.text_only_exception.reason;

    assert.ok(
      hasAnchor || hasException,
      `Slide ${action.slide_number}: must have primary_visual_anchor or text_only_exception`
    );
  }
});

test("QA-Plan fixture: generateSpeakerNotesArtifacts produces notes for every non-keep brief", () => {
  const runRoot = tmpRunRoot();

  writeJson(path.join(runRoot, "artifacts", "update_plan.json"), {
    slide_actions: FIXTURE_SLIDE_ACTIONS
  });
  fs.writeFileSync(path.join(runRoot, "artifacts", "research_delta.md"), FIXTURE_RESEARCH_DELTA);

  enrichSlideTranscripts({
    slideAnalysis: { slides: FIXTURE_SLIDES },
    researchDelta: FIXTURE_RESEARCH_DELTA,
    changeRequest: "Update QA coverage metrics and add improvement summary slide",
    runRoot
  });

  const notesResult = generateSpeakerNotesArtifacts({ runRoot });
  assert.equal(notesResult.status, "ok");

  const nonKeepCount = FIXTURE_SLIDE_ACTIONS.filter(a => a.action !== "keep").length;
  assert.equal(notesResult.totalNotes, nonKeepCount, "must generate notes for each non-keep slide");

  // Verify each non-keep slide has a notes file
  const nonKeepActions = FIXTURE_SLIDE_ACTIONS.filter(a => a.action !== "keep");
  for (const action of nonKeepActions) {
    const notesFile = `slide-${String(action.slide_number).padStart(2, "0")}.md`;
    const notesPath = path.join(runRoot, "artifacts", "speaker-notes", notesFile);
    assert.ok(fs.existsSync(notesPath), `${notesFile} must exist`);
  }
});

test("QA-Plan fixture: generateVisualPlanFromBriefs produces a valid visual-plan.json", () => {
  const runRoot = tmpRunRoot();

  writeJson(path.join(runRoot, "artifacts", "update_plan.json"), {
    slide_actions: FIXTURE_SLIDE_ACTIONS
  });
  fs.writeFileSync(path.join(runRoot, "artifacts", "research_delta.md"), FIXTURE_RESEARCH_DELTA);

  const enrichResult = enrichSlideTranscripts({
    slideAnalysis: { slides: FIXTURE_SLIDES },
    researchDelta: FIXTURE_RESEARCH_DELTA,
    changeRequest: "Update QA coverage metrics and add improvement summary slide",
    runRoot
  });

  // Read all briefs for visual plan generation
  const briefFiles = fs.readdirSync(enrichResult.briefsDir)
    .filter(name => /^slide-\d+\.json$/.test(name))
    .sort();

  const slideBriefs = briefFiles.map(file =>
    JSON.parse(fs.readFileSync(path.join(enrichResult.briefsDir, file), "utf8"))
  );

  const visualResult = generateVisualPlanFromBriefs({ runRoot, slideBriefs });

  assert.ok(fs.existsSync(visualResult.visualPlanPath), "visual-plan.json must exist");
  assert.equal(visualResult.slideCount, FIXTURE_SLIDE_ACTIONS.length);

  const visualPlan = JSON.parse(fs.readFileSync(visualResult.visualPlanPath, "utf8"));
  assert.ok(Array.isArray(visualPlan), "visual-plan must be an array");
  assert.ok(visualPlan.length > 0, "visual-plan must be non-empty");

  // Every entry must have the required fields
  for (const entry of visualPlan) {
    assert.ok(entry.slide_number, "slide_number required");
    assert.ok(entry.composition_family, "composition_family required");
    assert.ok(Array.isArray(entry.layout_regions), "layout_regions must be an array");
    assert.ok(entry.render_strategy, "render_strategy required");
  }
});

test("QA-Plan fixture: presenter-script.md has substantial content", () => {
  const runRoot = tmpRunRoot();

  writeJson(path.join(runRoot, "artifacts", "update_plan.json"), {
    slide_actions: FIXTURE_SLIDE_ACTIONS
  });
  fs.writeFileSync(path.join(runRoot, "artifacts", "research_delta.md"), FIXTURE_RESEARCH_DELTA);

  enrichSlideTranscripts({
    slideAnalysis: { slides: FIXTURE_SLIDES },
    researchDelta: FIXTURE_RESEARCH_DELTA,
    changeRequest: "Update QA coverage metrics and add improvement summary slide",
    runRoot
  });

  generateSpeakerNotesArtifacts({ runRoot });

  const presenterScriptPath = path.join(runRoot, "artifacts", "presenter-script.md");
  assert.ok(fs.existsSync(presenterScriptPath), "presenter-script.md must exist");

  const presenterScript = fs.readFileSync(presenterScriptPath, "utf8");
  assert.ok(
    presenterScript.length >= 200,
    `presenter-script.md must be at least 200 chars, got ${presenterScript.length}`
  );
  assert.ok(
    presenterScript.includes("# Presenter Script"),
    "presenter-script.md must have a top-level heading"
  );
});
