"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const {
  defaultImageStrategy,
  ensureTranscriptArtifacts
} = require("../scripts/lib/slide-transcript");

function tmpRunRoot() {
  const runRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ppt-agent-transcripts-"));
  fs.mkdirSync(path.join(runRoot, "artifacts"), { recursive: true });
  return runRoot;
}

function baseSlideAnalysis() {
  return {
    slides: [
      {
        slide_number: 1,
        headline: "Executive Summary",
        body_lines: ["Revenue grew 12%", "Margin expanded by 3 points"],
        role: "content",
        visual_role: "hero",
        visual_assets: ["chart"],
        source_media_refs: [
          {
            relationship_id: "rId5",
            target: "ppt/media/chart1.png",
            content_hash: "sha256:abc"
          }
        ],
        speaker_notes_present: true,
        speaker_notes_text: "Open with the strongest metric first.",
        notes_text: "Revenue data came from the March board packet."
      },
      {
        slide_number: 2,
        headline: "Risks",
        body_lines: ["Hiring pace remains the main execution risk."],
        role: "content",
        visual_role: "explainer",
        visual_assets: [],
        source_media_refs: [],
        speaker_notes_present: false,
        speaker_notes_text: "",
        notes_text: ""
      }
    ]
  };
}

function basePlan() {
  return {
    slide_actions: [
      {
        slide_number: 1,
        action: "revise",
        reason: "Refresh metrics",
        visual_role: "hero",
        image_strategy: "preserve",
        image_rationale: "Keep the board-approved chart.",
        layout_strategy: "preserve",
        allowed_layout_delta: "tighten_only",
        allowed_image_delta: "none",
        transcript_path: "artifacts/slide-transcripts/slide-01.md",
        source_slide_number: 1,
        source_layout_anchor: { title_box: "shape:sp3" },
        source_media_refs: [
          {
            relationship_id: "rId5",
            target: "ppt/media/chart1.png",
            content_hash: "sha256:abc"
          }
        ],
        preserve: ["existing layout"]
      },
      {
        slide_number: 2,
        action: "keep",
        reason: "No change"
      },
      {
        slide_number: 3,
        action: "add_after",
        after_slide_number: 1,
        reason: "Add a hiring plan slide",
        visual_role: "explainer",
        image_strategy: "generate_new",
        image_rationale: "The new slide needs a fresh visual anchor.",
        layout_strategy: "preserve_seed",
        allowed_layout_delta: "duplicate_seed_adjustment_only",
        allowed_image_delta: "new_asset_only",
        transcript_path: "artifacts/slide-transcripts/slide-03.md",
        source_slide_number: 1,
        source_layout_anchor: { title_box: "shape:sp3" },
        source_media_refs: [],
        preserve: ["title hierarchy"]
      }
    ]
  };
}

test("ensureTranscriptArtifacts writes one transcript per final slide with grounding and speaker notes", () => {
  const runRoot = tmpRunRoot();
  const result = ensureTranscriptArtifacts({
    runRoot,
    request: {
      change_request: "Refresh Q1 metrics and add a hiring plan slide"
    },
    slideAnalysis: baseSlideAnalysis(),
    updatePlan: basePlan(),
    researchDeltaText: "# Research Delta\n- Hiring plan updated\n",
    searchProvider: () => ({
      query: "q1 metrics hiring plan",
      status: "ok",
      answer: "Hiring remains the key operational constraint.",
      results: [
        { title: "Hiring benchmarks", url: "https://example.com/hiring" }
      ]
    })
  });

  assert.equal(result.status, "ready");
  const transcriptIndex = JSON.parse(fs.readFileSync(result.transcriptIndexPath, "utf8"));
  assert.equal(transcriptIndex.transcripts.length, 3);
  assert.deepEqual(transcriptIndex.transcripts[0].grounding_sources, ["user_request", "source_deck", "attachments", "tavily"]);
  const markdown = fs.readFileSync(path.join(runRoot, "artifacts", "slide-transcripts", "slide-01.md"), "utf8");
  assert.match(markdown, /Speaker Notes/);
  assert.match(markdown, /Open with the strongest metric first/);
  assert.match(markdown, /Image policy: preserve/);
});

test("ensureTranscriptArtifacts returns needs_context when the request lacks enough grounding", () => {
  const runRoot = tmpRunRoot();
  const insufficientAnalysis = {
    slides: [
      {
        slide_number: 1,
        headline: "",
        body_lines: [],
        role: "content",
        visual_assets: [],
        source_media_refs: [],
        notes_text: "",
        speaker_notes_text: ""
      }
    ]
  };
  const insufficientPlan = {
    slide_actions: [
      {
        slide_number: 1,
        action: "revise",
        reason: "Revise slide",
        visual_role: "explainer",
        image_strategy: "optional",
        image_rationale: "No image change required.",
        layout_strategy: "preserve",
        allowed_layout_delta: "tighten_only",
        transcript_path: "artifacts/slide-transcripts/slide-01.md",
        source_slide_number: 1,
        source_layout_anchor: {},
        source_media_refs: [],
        preserve: ["existing layout"]
      }
    ]
  };

  const result = ensureTranscriptArtifacts({
    runRoot,
    request: {
      change_request: ""
    },
    slideAnalysis: insufficientAnalysis,
    updatePlan: insufficientPlan,
    researchDeltaText: "",
    searchProvider: () => ({
      query: "empty",
      status: "empty",
      answer: "",
      results: []
    })
  });

  assert.equal(result.status, "needs_context");
  const transcriptIndex = JSON.parse(fs.readFileSync(result.transcriptIndexPath, "utf8"));
  assert.equal(transcriptIndex.missing_context.length, 1);
});

test("ensureTranscriptArtifacts tolerates missing source notes and deterministic Tavily errors", () => {
  const runRoot = tmpRunRoot();
  const analysis = baseSlideAnalysis();
  analysis.slides[1].notes_text = "";
  analysis.slides[1].speaker_notes_text = "";

  const result = ensureTranscriptArtifacts({
    runRoot,
    request: {
      change_request: "Refresh Q1 metrics"
    },
    slideAnalysis: analysis,
    updatePlan: basePlan(),
    researchDeltaText: "# Research Delta\n- Use the latest margin numbers\n",
    searchProvider: () => ({
      query: "q1 metrics",
      status: "error",
      answer: "",
      results: [],
      error: "simulated tavily outage"
    })
  });

  assert.equal(result.status, "ready");
  const markdown = fs.readFileSync(path.join(runRoot, "artifacts", "slide-transcripts", "slide-03.md"), "utf8");
  assert.match(markdown, /none present in source deck/i);
  const transcriptIndex = JSON.parse(fs.readFileSync(result.transcriptIndexPath, "utf8"));
  assert.equal(transcriptIndex.deck_grounding.status, "error");
});

test("defaultImageStrategy only preserves duplicate-seed imagery when the seed actually has media", () => {
  assert.equal(
    defaultImageStrategy({
      mode: "edit",
      visualRole: "explainer",
      hasExistingMedia: false,
      layoutSeed: "duplicate_slide:2",
      layoutSeedHasMedia: false
    }),
    "generate_new"
  );

  assert.equal(
    defaultImageStrategy({
      mode: "edit",
      visualRole: "explainer",
      hasExistingMedia: false,
      layoutSeed: "duplicate_slide:2",
      layoutSeedHasMedia: true
    }),
    "preserve"
  );
});
