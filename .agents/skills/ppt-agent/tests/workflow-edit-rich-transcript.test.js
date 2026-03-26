"use strict";

// Integration tests: edit run emits rich slide briefs and speaker notes.
// Verifies that enrichSlideTranscripts writes per-slide JSON briefs and that
// generateSpeakerNotesArtifacts consumes those briefs to produce speaker notes
// and a deck-level presenter script.

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { initRunState } = require("../scripts/lib/run-manifest");
const { enrichSlideTranscripts } = require("../scripts/lib/transcript-enrichment");
const { generateSpeakerNotesArtifacts } = require("../scripts/lib/speaker-script");
const { RENDER_STRATEGY } = require("../scripts/lib/shared-constants");

function tmpRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "ppt-agent-rich-transcript-"));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function buildRunRoot({ slideActions, slides = [], researchDelta = "" }) {
  const rootDir = tmpRoot();
  const { runRoot } = initRunState({
    rootDir,
    phase: "edit",
    sourceDeckHash: "deck-hash-a",
    changeFingerprintHash: "change-hash-a"
  });

  writeJson(path.join(runRoot, "artifacts", "update_plan.json"), {
    slide_actions: slideActions
  });

  if (researchDelta) {
    fs.mkdirSync(path.join(runRoot, "artifacts"), { recursive: true });
    fs.writeFileSync(path.join(runRoot, "artifacts", "research_delta.md"), researchDelta);
  }

  return { runRoot, slides };
}

test("enrichSlideTranscripts writes a slide-brief JSON for each action", () => {
  const slideActions = [
    {
      slide_number: 1,
      action: "revise",
      reason: "Refresh revenue metrics",
      source_slide_number: 1,
      source_layout_anchor: {},
      source_media_refs: []
    },
    {
      slide_number: 2,
      action: "keep",
      reason: "No changes",
      source_slide_number: 2,
      source_layout_anchor: {},
      source_media_refs: []
    }
  ];

  const slides = [
    {
      slide_number: 1,
      headline: "Revenue Growth",
      body_lines: ["Q1 revenue $12.4M", "Margin up 3pts"],
      visual_assets: ["chart"],
      source_media_refs: []
    },
    {
      slide_number: 2,
      headline: "Team Update",
      body_lines: ["No changes needed"],
      visual_assets: [],
      source_media_refs: []
    }
  ];

  const { runRoot } = buildRunRoot({
    slideActions,
    slides,
    researchDelta: "## Findings\n\n- Q1 revenue reached $12.4M\n- Margin expanded by 3 percentage points"
  });

  const result = enrichSlideTranscripts({
    slideAnalysis: { slides },
    researchDelta: "Q1 revenue $12.4M",
    changeRequest: "Refresh revenue and keep team slide unchanged",
    runRoot
  });

  assert.equal(result.status === "ok" || result.status === "warnings", true);
  assert.equal(result.totalBriefs, 2);

  const brief1Path = path.join(result.briefsDir, "slide-01.json");
  const brief2Path = path.join(result.briefsDir, "slide-02.json");

  assert.ok(fs.existsSync(brief1Path), "slide-01.json must exist");
  assert.ok(fs.existsSync(brief2Path), "slide-02.json must exist");

  const brief1 = JSON.parse(fs.readFileSync(brief1Path, "utf8"));
  assert.equal(brief1.slide_number, 1);
  assert.equal(brief1.action, "revise");
  assert.ok(brief1.composition_family, "composition_family must be set");
  assert.ok(brief1.render_strategy, "render_strategy must be set");
  assert.ok(brief1.primary_visual_anchor, "primary_visual_anchor must be set for chart slide");

  const brief2 = JSON.parse(fs.readFileSync(brief2Path, "utf8"));
  assert.equal(brief2.action, "keep");
  assert.equal(brief2.render_strategy, RENDER_STRATEGY.PRESERVE_ONLY);
});

test("enrichSlideTranscripts emits non-empty speaker_script for revise and add_after actions", () => {
  const slideActions = [
    {
      slide_number: 3,
      action: "add_after",
      after_slide_number: 2,
      reason: "Add hiring plan slide",
      source_slide_number: 1,
      source_layout_anchor: {},
      source_media_refs: []
    }
  ];

  const slides = [
    {
      slide_number: 1,
      headline: "Executive Overview",
      body_lines: [],
      visual_assets: [],
      source_media_refs: []
    }
  ];

  const { runRoot } = buildRunRoot({
    slideActions,
    slides,
    researchDelta: "## Findings\n\n- We plan to hire 20 engineers in Q2"
  });

  const result = enrichSlideTranscripts({
    slideAnalysis: { slides },
    researchDelta: "We plan to hire 20 engineers in Q2",
    changeRequest: "Add hiring plan slide after slide 2",
    runRoot
  });

  const briefPath = path.join(result.briefsDir, "slide-03.json");
  assert.ok(fs.existsSync(briefPath), "slide-03.json must exist");

  const brief = JSON.parse(fs.readFileSync(briefPath, "utf8"));
  assert.equal(brief.action, "add_after");
  assert.ok(brief.speaker_script && brief.speaker_script.length > 0, "speaker_script must be non-empty");
});

test("generateSpeakerNotesArtifacts produces per-slide notes and presenter-script.md", () => {
  const rootDir = tmpRoot();
  const { runRoot } = initRunState({
    rootDir,
    phase: "edit",
    sourceDeckHash: "deck-x",
    changeFingerprintHash: "change-x"
  });

  const briefsDir = path.join(runRoot, "artifacts", "slide-briefs");
  fs.mkdirSync(briefsDir, { recursive: true });

  const brief1 = {
    slide_number: 1,
    source_slide_number: 1,
    action: "revise",
    title: "Revenue Growth",
    slide_goal: "Update Q1 revenue numbers",
    audience_takeaway: "Q1 revenue up 15% YoY",
    takeaway_placement: "subtitle",
    on_slide_copy: "Revenue $12.4M",
    speaker_script: "Q1 results exceeded forecast. Revenue of $12.4M represents 15% YoY growth driven by enterprise customer expansion.",
    evidence_points: ["Revenue $12.4M", "15% YoY growth"],
    provenance: ["source deck slide 1"],
    composition_family: "evidence_panel",
    component_list: ["title", "chart", "body_text"],
    primary_visual_anchor: {
      kind: "chart",
      source: "source_deck",
      asset_ref: "chart1.png",
      relevance_rationale: "Chart visualizes quarterly revenue trend",
      fallback_order: ["table", "screenshot"]
    },
    render_strategy: "light_edit",
    text_only_exception: null,
    theme_source: "source_theme",
    qa_flags: []
  };

  fs.writeFileSync(path.join(briefsDir, "slide-01.json"), JSON.stringify(brief1, null, 2));

  const result = generateSpeakerNotesArtifacts({ runRoot });

  assert.equal(result.status, "ok");
  assert.equal(result.totalNotes, 1);

  const notesPath = path.join(runRoot, "artifacts", "speaker-notes", "slide-01.md");
  assert.ok(fs.existsSync(notesPath), "per-slide notes file must exist");

  const notesContent = fs.readFileSync(notesPath, "utf8");
  assert.ok(notesContent.includes("Revenue Growth"), "notes must reference slide title");
  assert.ok(notesContent.includes("## Opening") || notesContent.includes("## Main explanation"),
    "notes must have structured sections");

  const presenterScriptPath = path.join(runRoot, "artifacts", "presenter-script.md");
  assert.ok(fs.existsSync(presenterScriptPath), "presenter-script.md must be written");

  const presenterScript = fs.readFileSync(presenterScriptPath, "utf8");
  assert.ok(presenterScript.includes("# Presenter Script"), "presenter script must have title");
  assert.ok(presenterScript.includes("Revenue Growth"), "presenter script must include slide content");
});

test("generateSpeakerNotesArtifacts skips keep slides", () => {
  const rootDir = tmpRoot();
  const { runRoot } = initRunState({
    rootDir,
    phase: "edit",
    sourceDeckHash: "deck-y",
    changeFingerprintHash: "change-y"
  });

  const briefsDir = path.join(runRoot, "artifacts", "slide-briefs");
  fs.mkdirSync(briefsDir, { recursive: true });

  const keepBrief = {
    slide_number: 2,
    source_slide_number: 2,
    action: "keep",
    title: "Unchanged Slide",
    slide_goal: "Preserve existing content",
    audience_takeaway: "No changes",
    takeaway_placement: "notes_only",
    on_slide_copy: "Existing content",
    speaker_script: "",
    evidence_points: [],
    provenance: ["source deck"],
    composition_family: "text_statement",
    component_list: ["title", "body_text"],
    primary_visual_anchor: null,
    render_strategy: "preserve_only",
    text_only_exception: null,
    theme_source: "source_theme",
    qa_flags: []
  };

  fs.writeFileSync(path.join(briefsDir, "slide-02.json"), JSON.stringify(keepBrief, null, 2));

  const result = generateSpeakerNotesArtifacts({ runRoot });

  assert.equal(result.totalNotes, 0, "keep slides must not generate notes");

  const keepNotesPath = path.join(runRoot, "artifacts", "speaker-notes", "slide-02.md");
  assert.equal(fs.existsSync(keepNotesPath), false, "no notes file should be written for keep slides");
});
