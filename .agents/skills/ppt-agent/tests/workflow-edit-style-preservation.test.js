"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { buildUpdatePlan } = require("../scripts/lib/edit-workflow");

function tmpRunRoot() {
  const runRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ppt-agent-style-preserve-"));
  fs.mkdirSync(path.join(runRoot, "artifacts"), { recursive: true });
  return runRoot;
}

test("update planning preserves structured style tokens for non-keep edits", () => {
  const runRoot = tmpRunRoot();
  fs.writeFileSync(
    path.join(runRoot, "artifacts", "slide_analysis.json"),
    JSON.stringify(
      {
        deck_summary: {
          slide_count: 1,
          narrative_spine: ["title"],
          style_summary: {
            hierarchy: { title_size_behavior: "large" },
            spacing_rhythm: { margin_behavior: "wide" },
            accent_usage: { accent_colors: ["#FA6611"] },
            alignment_behavior: { title_alignment: "left" },
            density: { level: "medium" },
            recurring_motifs: ["section divider underline"]
          }
        },
        slides: [
          {
            slide_number: 1,
            image_path: "renders/before/slide-01.svg",
            role: "title",
            visual_role: "hero",
            headline: "Q1 operating review",
            layout_summary: "headline with supporting content",
            visual_assets: ["chart"],
            has_existing_media: true,
            source_media_refs: [
              {
                relationship_id: "rId5",
                target: "ppt/media/image1.png",
                content_hash: "sha256:abc"
              }
            ],
            layout_anchor: {
              title_box: "shape:sp3"
            },
            readability_risks: [],
            style_notes: ["Orange highlight", "Left aligned title"],
            preserve: ["headline position"],
            issues: ["Refresh stale metrics"],
            style_tokens: {
              hierarchy: { title_size_behavior: "large" },
              spacing_rhythm: { margin_behavior: "wide" },
              accent_usage: { accent_colors: ["#FA6611"] },
              alignment_behavior: { title_alignment: "left" },
              density: { level: "medium" },
              recurring_motifs: ["section divider underline"]
            }
          }
        ]
      },
      null,
      2
    )
  );

  const result = buildUpdatePlan({
    runRoot,
    request: {
      change_request: "Refresh March revenue",
      restyle_mode: "none"
    }
  });

  const plan = JSON.parse(fs.readFileSync(result.updatePlanJsonPath, "utf8"));
  assert.ok(plan.slide_actions[0].preserve_tokens);
  assert.ok(plan.slide_actions[0].preserve_tokens.hierarchy);
  assert.ok(plan.slide_actions[0].preserve_tokens.spacing_rhythm);
  assert.equal(plan.slide_actions[0].image_strategy, "preserve");
  assert.equal(plan.slide_actions[0].transcript_path, "artifacts/slide-transcripts/slide-01.md");
});

test("update planning targets the requested later slide instead of the first generic issue", () => {
  const runRoot = tmpRunRoot();
  fs.writeFileSync(
    path.join(runRoot, "artifacts", "slide_analysis.json"),
    JSON.stringify(
      {
        deck_summary: {
          slide_count: 4,
          narrative_spine: ["title", "market", "delivery", "hiring"],
          style_summary: {
            hierarchy: { title_size_behavior: "large" }
          }
        },
        slides: [
          {
            slide_number: 1,
            image_path: "renders/before/slide-01.svg",
            role: "title",
            visual_role: "hero",
            headline: "Q1 operating review",
            layout_summary: "headline with supporting content",
            visual_assets: [],
            source_media_refs: [],
            layout_anchor: {
              title_box: "shape:sp1"
            },
            readability_risks: [],
            style_notes: ["Orange highlight"],
            preserve: ["headline position"],
            issues: []
          },
          {
            slide_number: 2,
            image_path: "renders/before/slide-02.svg",
            role: "content",
            visual_role: "evidence",
            headline: "Market Overview",
            layout_summary: "headline with supporting content",
            visual_assets: ["chart"],
            source_media_refs: [
              {
                relationship_id: "rId2",
                target: "ppt/media/chart1.png",
                content_hash: "sha256:def"
              }
            ],
            layout_anchor: {
              title_box: "shape:sp2",
              image_box: "shape:pic1"
            },
            readability_risks: [],
            style_notes: ["Orange highlight"],
            preserve: ["existing layout"],
            issues: ["Review factual freshness against requested change"]
          },
          {
            slide_number: 3,
            image_path: "renders/before/slide-03.svg",
            role: "content",
            visual_role: "explainer",
            headline: "Delivery Plan",
            layout_summary: "headline with supporting content",
            visual_assets: [],
            source_media_refs: [],
            layout_anchor: {
              title_box: "shape:sp3",
              body_box: "shape:sp4"
            },
            readability_risks: [],
            style_notes: ["Orange highlight"],
            preserve: ["existing layout"],
            issues: ["Review factual freshness against requested change"]
          },
          {
            slide_number: 4,
            image_path: "renders/before/slide-04.svg",
            role: "content",
            visual_role: "evidence",
            headline: "Hiring Plan",
            layout_summary: "headline with supporting content",
            visual_assets: ["chart"],
            source_media_refs: [
              {
                relationship_id: "rId4",
                target: "ppt/media/chart2.png",
                content_hash: "sha256:ghi"
              }
            ],
            layout_anchor: {
              title_box: "shape:sp5",
              image_box: "shape:pic2"
            },
            readability_risks: [],
            style_notes: ["Orange highlight"],
            preserve: ["existing layout"],
            issues: ["Review factual freshness against requested change"]
          }
        ]
      },
      null,
      2
    )
  );

  const result = buildUpdatePlan({
    runRoot,
    request: {
      change_request: "Revise the hiring plan slide and add a follow-up slide with the new recruiting timeline.",
      restyle_mode: "none"
    }
  });

  const plan = JSON.parse(fs.readFileSync(result.updatePlanJsonPath, "utf8"));
  const reviseAction = plan.slide_actions.find((action) => action.action === "revise");
  const addAfterAction = plan.slide_actions.find((action) => action.action === "add_after");

  assert.equal(reviseAction.slide_number, 4);
  assert.equal(addAfterAction.after_slide_number, 4);
  assert.equal(reviseAction.image_strategy, "preserve");
  assert.equal(addAfterAction.image_strategy, "preserve");
});
