"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const {
  initializeCreateWorkflow,
  createPhaseArtifacts
} = require("../scripts/lib/create-workflow");

function tmpRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "ppt-agent-create-"));
}

test("source-backed create workflow initializes a run and writes intake artifacts", () => {
  const rootDir = tmpRoot();
  const result = initializeCreateWorkflow({
    rootDir,
    prompt: "Build a Q2 operating review for leadership.",
    objective: "Summarize Q2 performance and next-step decisions.",
    audience: "Executive leadership",
    attachments: [{ path: "/tmp/q2-report.md" }]
  });

  assert.equal(result.status, "ready");
  assert.ok(fs.existsSync(path.join(result.runRoot, "input", "brief.json")));
  assert.ok(fs.existsSync(path.join(result.runRoot, "input", "source_fingerprint.json")));
  assert.ok(fs.existsSync(path.join(result.runRoot, "input", "reference_selection.json")));
});

test("compatible create workflow requests reuse the latest run and expose the resume stage", () => {
  const rootDir = tmpRoot();
  const first = initializeCreateWorkflow({
    rootDir,
    prompt: "Build a Q2 operating review for leadership.",
    objective: "Summarize Q2 performance and next-step decisions.",
    audience: "Executive leadership",
    attachments: [{ path: "/tmp/q2-report.md" }]
  });

  fs.writeFileSync(path.join(first.runRoot, "artifacts", "manuscript.md"), "# Deck");

  const second = initializeCreateWorkflow({
    rootDir,
    prompt: "Build a Q2 operating review for leadership.",
    objective: "Summarize Q2 performance and next-step decisions.",
    audience: "Executive leadership",
    attachments: [{ path: "/tmp/q2-report.md" }]
  });

  assert.equal(second.runRoot, first.runRoot);
  assert.equal(second.resumed, true);
  assert.equal(second.resumeStage, "design");
});

test("create workflow does not reuse a run when attachment contents change in place", () => {
  const rootDir = tmpRoot();
  const attachmentPath = path.join(rootDir, "q2-report.md");
  fs.writeFileSync(attachmentPath, "# Quarterly Metrics\n- Revenue up 12%\n");

  const first = initializeCreateWorkflow({
    rootDir,
    prompt: "Build a Q2 operating review for leadership.",
    objective: "Summarize Q2 performance and next-step decisions.",
    audience: "Executive leadership",
    attachments: [{ path: attachmentPath }]
  });

  fs.writeFileSync(attachmentPath, "# Quarterly Metrics\n- Revenue up 18%\n");

  const second = initializeCreateWorkflow({
    rootDir,
    prompt: "Build a Q2 operating review for leadership.",
    objective: "Summarize Q2 performance and next-step decisions.",
    audience: "Executive leadership",
    attachments: [{ path: attachmentPath }]
  });

  assert.notEqual(second.runRoot, first.runRoot);
  assert.equal(second.resumed, false);
});

test("create workflow materializes manuscript, design plan, and a structured slide-build spec", () => {
  const rootDir = tmpRoot();
  const result = initializeCreateWorkflow({
    rootDir,
    prompt: "Build a Q2 operating review for leadership.",
    objective: "Summarize Q2 performance and next-step decisions.",
    attachments: [{ path: "/tmp/q2-report.md" }]
  });

  const attachmentPath = path.join(rootDir, "q2-report.md");
  fs.writeFileSync(
    attachmentPath,
    [
      "# Quarterly Metrics",
      "",
      "- Revenue up 12%",
      "- Margin up 3 points",
      "- Supply chain delay remains the top risk"
    ].join("\n")
  );

  const artifacts = createPhaseArtifacts({
    runRoot: result.runRoot,
    prompt: "Build a Q2 operating review for leadership.",
    objective: "Summarize Q2 performance and next-step decisions.",
    audience: "Executive leadership",
    attachments: [{ path: attachmentPath }],
    references: [],
    referenceStrategy: result.manifest.reference_strategy
  });

  assert.equal(artifacts.status, "ready");
  assert.ok(fs.existsSync(artifacts.manuscriptPath));
  assert.ok(fs.existsSync(artifacts.designPlanPath));
  assert.ok(fs.existsSync(artifacts.slideBuildSpecPath));
  assert.equal(artifacts.slideBuildSpec.build_path, "new_deck_generation");
  assert.ok(Array.isArray(artifacts.slideBuildSpec.slides));
  assert.ok(artifacts.slideBuildSpec.slides.length >= 3);
  assert.equal(artifacts.slideBuildSpec.design_tokens.accent_color, "#FA6611");
});

test("generated design plan includes the required Phase 1 sections", () => {
  const rootDir = tmpRoot();
  const attachmentPath = path.join(rootDir, "q2-report.md");
  fs.writeFileSync(
    attachmentPath,
    [
      "# Quarterly Metrics",
      "",
      "- Revenue up 12%",
      "- Margin up 3 points",
      "- Supply chain delay remains the top risk"
    ].join("\n")
  );

  const result = initializeCreateWorkflow({
    rootDir,
    prompt: "Build a Q2 operating review for leadership.",
    objective: "Summarize Q2 performance and next-step decisions.",
    audience: "Executive leadership",
    attachments: [{ path: attachmentPath }]
  });

  const artifacts = createPhaseArtifacts({
    runRoot: result.runRoot,
    prompt: "Build a Q2 operating review for leadership.",
    objective: "Summarize Q2 performance and next-step decisions.",
    audience: "Executive leadership",
    attachments: [{ path: attachmentPath }],
    references: [],
    referenceStrategy: result.manifest.reference_strategy
  });

  assert.equal(artifacts.status, "ready");
  const designPlan = fs.readFileSync(artifacts.designPlanPath, "utf8");
  assert.match(designPlan, /## Brief/);
  assert.match(designPlan, /## Color System/);
  assert.match(designPlan, /## Typography Direction/);
  assert.match(designPlan, /## Visual Motif Rules/);
  assert.match(designPlan, /## Slide Family Map/);
  assert.match(designPlan, /## Page-by-Page Layout Plan/);
  assert.match(designPlan, /## Business Style Contract Confirmation/);
});

test("prompt-only workflow requires inspectable provenance artifacts before research outputs are materialized", () => {
  const rootDir = tmpRoot();
  const sourceProvenance = [
    {
      title: "Enterprise Browser Automation Outlook 2026",
      locator: "https://example.com/browser-automation-outlook-2026",
      summary: "Regulated support teams are increasing browser automation adoption with governance controls."
    }
  ];
  const result = initializeCreateWorkflow({
    rootDir,
    prompt: "Build a market landscape deck on enterprise browser automation adoption in 2026.",
    objective: "Summarize the market, risks, and recommendation.",
    sourceProvenance
  });

  assert.equal(result.status, "ready");

  const artifacts = createPhaseArtifacts({
    runRoot: result.runRoot,
    prompt: "Build a market landscape deck on enterprise browser automation adoption in 2026.",
    objective: "Summarize the market, risks, and recommendation.",
    audience: "Executive leadership",
    attachments: [],
    references: [],
    referenceStrategy: result.manifest.reference_strategy,
    sourceProvenance
  });

  assert.equal(artifacts.status, "ready");
  const manuscript = fs.readFileSync(artifacts.manuscriptPath, "utf8");
  const provenance = JSON.parse(
    fs.readFileSync(path.join(result.runRoot, "artifacts", "source-provenance.json"), "utf8")
  );

  assert.match(manuscript, /Source provenance notes/i);
  assert.equal(provenance.generated_from_prompt_only, true);
  assert.ok(provenance.entries.length >= 1);
  assert.match(provenance.entries[0].summary, /browser automation|governance/i);
  assert.equal(/^prompt:\/\//i.test(provenance.entries[0].locator), false);
});

test("source-backed create workflow stops with no_slide when no usable source material remains", () => {
  const rootDir = tmpRoot();
  const result = initializeCreateWorkflow({
    rootDir,
    prompt: "Build a Q2 operating review for leadership.",
    objective: "Summarize Q2 performance and next-step decisions.",
    attachments: [{ path: path.join(rootDir, "missing-report.md") }]
  });

  const artifacts = createPhaseArtifacts({
    runRoot: result.runRoot,
    prompt: "Build a Q2 operating review for leadership.",
    objective: "Summarize Q2 performance and next-step decisions.",
    audience: "Executive leadership",
    attachments: [{ path: path.join(rootDir, "missing-report.md") }],
    references: [],
    referenceStrategy: result.manifest.reference_strategy
  });

  assert.equal(artifacts.status, "no_slide");
  assert.match(artifacts.reason, /zero valid slides|usable source material/i);
  assert.ok(Array.isArray(artifacts.unreadableAttachments));
  assert.equal(artifacts.unreadableAttachments.length, 1);
});
