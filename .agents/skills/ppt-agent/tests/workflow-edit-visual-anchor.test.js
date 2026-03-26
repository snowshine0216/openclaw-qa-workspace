"use strict";

// Integration tests: added slides are rejected when they have no visual anchor
// and no anchor relevance rationale.
//
// The contract: any slide with action != "keep" that has no primary_visual_anchor
// AND no text_only_exception must have enrichment issues flagged in compareDecks.
// These tests verify that evaluateEnrichmentQuality (via compareDecks) gates on that.

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { initRunState } = require("../scripts/lib/run-manifest");
const { compareDecks } = require("../scripts/lib/eval-presentation");

function tmpRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "ppt-agent-visual-anchor-"));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function buildBaseRunRoot() {
  const rootDir = tmpRoot();
  const { runRoot } = initRunState({
    rootDir,
    phase: "edit",
    sourceDeckHash: "deck-a",
    changeFingerprintHash: "change-a"
  });

  // Create before/after render directories
  fs.mkdirSync(path.join(runRoot, "renders", "before"), { recursive: true });
  fs.mkdirSync(path.join(runRoot, "renders", "after"), { recursive: true });
  fs.writeFileSync(path.join(runRoot, "renders", "before", "slide-01.png"), "before");
  fs.writeFileSync(path.join(runRoot, "renders", "after", "slide-01.png"), "after");
  fs.writeFileSync(path.join(runRoot, "renders", "after", "slide-02.png"), "after");

  writeJson(path.join(runRoot, "artifacts", "update_plan.json"), {
    slide_actions: [
      {
        slide_number: 1,
        action: "revise",
        reason: "Refresh metrics",
        source_slide_number: 1,
        source_layout_anchor: {},
        source_media_refs: []
      },
      {
        slide_number: 2,
        action: "add_after",
        after_slide_number: 1,
        reason: "Add hiring plan slide",
        source_slide_number: 1,
        source_layout_anchor: {},
        source_media_refs: []
      }
    ]
  });

  writeJson(path.join(runRoot, "artifacts", "edit_handoff.json"), {
    jobs: [
      { slide_number: 1, action: "revise", status: "applied" },
      { slide_number: 2, action: "add_after", status: "applied" }
    ]
  });

  return runRoot;
}

test("compareDecks reports enrichment_issues when add_after slide has no visual anchor and no exception", () => {
  const runRoot = buildBaseRunRoot();

  // Write a slide brief with no anchor and no exception
  const briefsDir = path.join(runRoot, "artifacts", "slide-briefs");
  fs.mkdirSync(briefsDir, { recursive: true });

  const badBrief = {
    slide_number: 2,
    source_slide_number: null,
    action: "add_after",
    title: "Hiring Plan",
    slide_goal: "Present Q2 hiring plan",
    audience_takeaway: "20 hires planned",
    takeaway_placement: "subtitle",
    on_slide_copy: "20 engineers in Q2",
    speaker_script: "We plan to hire 20 engineers in Q2 to support our growth targets.",
    evidence_points: ["20 engineer target"],
    provenance: ["source deck"],
    composition_family: "text_statement",
    component_list: ["title", "body_text"],
    primary_visual_anchor: null,   // No anchor
    render_strategy: "structured_rebuild",
    text_only_exception: null,     // No exception either
    theme_source: "source_theme",
    qa_flags: ["weak_anchor_relevance"]
  };

  fs.writeFileSync(path.join(briefsDir, "slide-02.json"), JSON.stringify(badBrief, null, 2));

  const result = compareDecks({
    beforeDir: path.join(runRoot, "renders", "before"),
    afterDir: path.join(runRoot, "renders", "after"),
    updatePlanPath: path.join(runRoot, "artifacts", "update_plan.json"),
    handoffPath: path.join(runRoot, "artifacts", "edit_handoff.json"),
    runRoot
  });

  assert.ok(Array.isArray(result.enrichment_issues), "enrichment_issues must be an array");
  assert.ok(
    result.enrichment_issues.some(issue => /missing.*visual anchor|visual anchor/i.test(issue)),
    `Expected visual anchor issue, got: ${JSON.stringify(result.enrichment_issues)}`
  );
});

test("compareDecks does not flag anchor issue when text_only_exception is present", () => {
  const runRoot = buildBaseRunRoot();

  const briefsDir = path.join(runRoot, "artifacts", "slide-briefs");
  fs.mkdirSync(briefsDir, { recursive: true });

  const exceptionBrief = {
    slide_number: 2,
    source_slide_number: null,
    action: "add_after",
    title: "Section Break",
    slide_goal: "Divide major sections",
    audience_takeaway: "Section break",
    takeaway_placement: "notes_only",
    on_slide_copy: "",
    speaker_script: "This section covers our go-to-market approach for the next quarter.",
    evidence_points: [],
    provenance: ["source deck"],
    composition_family: "section_divider",
    component_list: ["title"],
    primary_visual_anchor: null,
    render_strategy: "light_edit",
    text_only_exception: { reason: "section_divider" },  // Valid exception
    theme_source: "source_theme",
    qa_flags: []
  };

  fs.writeFileSync(path.join(briefsDir, "slide-02.json"), JSON.stringify(exceptionBrief, null, 2));

  const result = compareDecks({
    beforeDir: path.join(runRoot, "renders", "before"),
    afterDir: path.join(runRoot, "renders", "after"),
    updatePlanPath: path.join(runRoot, "artifacts", "update_plan.json"),
    handoffPath: path.join(runRoot, "artifacts", "edit_handoff.json"),
    runRoot
  });

  const anchorIssues = (result.enrichment_issues || []).filter(
    issue => /visual anchor/i.test(issue) && /slide 2/i.test(issue)
  );
  assert.equal(anchorIssues.length, 0, "No anchor issues expected when text_only_exception is provided");
});

test("compareDecks does not flag anchor issue when primary_visual_anchor is present with rationale", () => {
  const runRoot = buildBaseRunRoot();

  const briefsDir = path.join(runRoot, "artifacts", "slide-briefs");
  fs.mkdirSync(briefsDir, { recursive: true });

  const anchoredBrief = {
    slide_number: 2,
    source_slide_number: null,
    action: "add_after",
    title: "Hiring Plan",
    slide_goal: "Present Q2 hiring plan",
    audience_takeaway: "20 engineers planned for Q2",
    takeaway_placement: "subtitle",
    on_slide_copy: "20 engineers in Q2",
    speaker_script: "Our Q2 hiring plan targets 20 engineers to expand the platform team.",
    evidence_points: ["20 engineer target approved by board"],
    provenance: ["source deck"],
    composition_family: "evidence_panel",
    component_list: ["title", "chart", "body_text"],
    primary_visual_anchor: {
      kind: "chart",
      description: "A chart description",
      source: "source_deck",
      asset_ref: "hiring_chart.png",
      relevance_rationale: "Chart visualizes headcount growth trajectory supporting the hiring narrative",
      fallback_order: ["table", "screenshot"]
    },
    render_strategy: "structured_rebuild",
    text_only_exception: null,
    theme_source: "source_theme",
    qa_flags: []
  };

  fs.writeFileSync(path.join(briefsDir, "slide-02.json"), JSON.stringify(anchoredBrief, null, 2));

  const result = compareDecks({
    beforeDir: path.join(runRoot, "renders", "before"),
    afterDir: path.join(runRoot, "renders", "after"),
    updatePlanPath: path.join(runRoot, "artifacts", "update_plan.json"),
    handoffPath: path.join(runRoot, "artifacts", "edit_handoff.json"),
    runRoot
  });

  const anchorIssues = (result.enrichment_issues || []).filter(
    issue => /visual anchor/i.test(issue) && /slide 2/i.test(issue)
  );
  assert.equal(anchorIssues.length, 0, "No anchor issues expected when primary_visual_anchor is present");
  assert.equal(result.enrichment_issues.length, 0, "No enrichment issues expected for fully-enriched brief");
});

test("compareDecks flags enrichment_issues when slide has no speaker notes", () => {
  const runRoot = buildBaseRunRoot();

  const briefsDir = path.join(runRoot, "artifacts", "slide-briefs");
  fs.mkdirSync(briefsDir, { recursive: true });

  const noScriptBrief = {
    slide_number: 2,
    source_slide_number: null,
    action: "add_after",
    title: "Hiring Plan",
    slide_goal: "Add hiring context",
    audience_takeaway: "We are hiring",
    takeaway_placement: "subtitle",
    on_slide_copy: "20 hires",
    speaker_script: "",  // Empty speaker script
    evidence_points: ["20 hires planned"],
    provenance: ["source deck"],
    composition_family: "evidence_panel",
    component_list: ["title", "chart"],
    primary_visual_anchor: {
      kind: "chart",
      description: "A chart description",
      source: "source_deck",
      asset_ref: "chart.png",
      relevance_rationale: "Supports hiring narrative with visual data",
      fallback_order: ["table"]
    },
    render_strategy: "structured_rebuild",
    text_only_exception: null,
    theme_source: "source_theme",
    qa_flags: ["missing_grounding"]
  };

  fs.writeFileSync(path.join(briefsDir, "slide-02.json"), JSON.stringify(noScriptBrief, null, 2));

  const result = compareDecks({
    beforeDir: path.join(runRoot, "renders", "before"),
    afterDir: path.join(runRoot, "renders", "after"),
    updatePlanPath: path.join(runRoot, "artifacts", "update_plan.json"),
    handoffPath: path.join(runRoot, "artifacts", "edit_handoff.json"),
    runRoot
  });

  assert.ok(Array.isArray(result.enrichment_issues), "enrichment_issues must be an array");
  assert.ok(
    result.enrichment_issues.some(issue => /speaker|notes|missing/i.test(issue)),
    `Expected speaker notes issue, got: ${JSON.stringify(result.enrichment_issues)}`
  );
});
