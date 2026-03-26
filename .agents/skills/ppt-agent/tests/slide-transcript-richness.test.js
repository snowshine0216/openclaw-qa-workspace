"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  isTranscriptTooShallow,
  synthesizeSpeakerScript
} = require("../scripts/lib/transcript-enrichment");

test("isTranscriptTooShallow fails when transcript body mirrors title + body_lines", () => {
  const sourceSlide = {
    headline: "Revenue Growth",
    body_lines: ["Q1 revenue grew 12%", "Margin expanded by 3 points"]
  };

  const brief = {
    action: "revise",
    speaker_script: "Revenue Growth Q1 revenue grew 12% Margin expanded by 3 points",
    audience_takeaway: "Strong growth"
  };

  assert.equal(isTranscriptTooShallow(brief, sourceSlide), true);
});

test("isTranscriptTooShallow passes when speaker_script and audience_takeaway exist with rich content", () => {
  const sourceSlide = {
    headline: "Revenue Growth",
    body_lines: ["Q1 revenue grew 12%"]
  };

  const brief = {
    action: "revise",
    speaker_script: "The Q1 results demonstrate strong momentum across all segments. Revenue growth of 12% exceeded our forecast by 3 percentage points, driven primarily by enterprise customer expansion. This positions us well for the full year target.",
    audience_takeaway: "Q1 exceeded forecast with enterprise-led growth"
  };

  assert.equal(isTranscriptTooShallow(brief, sourceSlide), false);
});
