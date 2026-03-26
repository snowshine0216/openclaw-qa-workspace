"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { normalizeRawCaptions } = require("../scripts/caption-image.js");

function tmpPath(name) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ppt-agent-caption-"));
  return path.join(dir, name);
}

test("normalizeRawCaptions produces structured slide analysis with deck summary", () => {
  const raw = {
    slides: [
      {
        slide_number: 1,
        image_path: "renders/before/slide-01.png",
        role: "title",
        headline: "Q1 operating review",
        layout_summary: "Headline plus summary metrics",
        visual_assets: ["chart", "chart", "icon"],
        readability_risks: ["legend dense", "legend dense"],
        style_notes: ["Orange highlight", "Left aligned title"],
        preserve: ["headline position"],
        issues: ["Metrics are stale"]
      }
    ]
  };

  const analysis = normalizeRawCaptions(raw);
  assert.equal(analysis.deck_summary.slide_count, 1);
  assert.deepEqual(analysis.deck_summary.narrative_spine, ["title"]);
  assert.deepEqual(analysis.deck_summary.style_summary.accent_colors, ["#FA6611"]);
  assert.deepEqual(analysis.slides[0].visual_assets, ["chart", "icon"]);
  assert.deepEqual(analysis.slides[0].readability_risks, ["legend dense"]);
  assert.equal(analysis.slides[0].headline, "Q1 operating review");
});

test("caption-image CLI reads raw json and writes normalized output", () => {
  const rawPath = tmpPath("raw.json");
  const outputPath = tmpPath("slide_analysis.json");
  fs.writeFileSync(
    rawPath,
    JSON.stringify(
      {
        slides: [
          {
            slide_number: 2,
            image_path: "renders/before/slide-02.png",
            role: "content",
            headline: "Revenue slowed in March",
            layout_summary: "Chart right and commentary left",
            visual_assets: ["chart"],
            readability_risks: [],
            style_notes: ["Orange chart highlight", "Light background"],
            preserve: ["headline position"],
            issues: ["March values are stale"]
          }
        ]
      },
      null,
      2
    )
  );

  require("../scripts/caption-image.js").main([
    "--raw-json", rawPath,
    "--output", outputPath
  ]);

  const written = JSON.parse(fs.readFileSync(outputPath, "utf8"));
  assert.equal(written.slides[0].slide_number, 2);
  assert.equal(written.slides[0].layout_summary, "chart right and commentary left");
});

test("normalizeRawCaptions rejects malformed payloads", () => {
  assert.throws(() => normalizeRawCaptions({ slides: [{}] }), /slide_number/i);
});
