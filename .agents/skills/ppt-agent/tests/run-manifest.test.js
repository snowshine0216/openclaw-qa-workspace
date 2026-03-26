"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const {
  createRunId,
  initRunState,
  readManifest,
  findLatestCompatibleRun,
  determineResumeStage,
  detectResumeStage
} = require("../scripts/lib/run-manifest");

function tmpRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "ppt-agent-runs-"));
}

test("initRunState creates a run directory and manifest", () => {
  const rootDir = tmpRoot();
  const { runRoot, manifest } = initRunState({
    rootDir,
    normalizedBriefHash: "brief-a",
    sourceFingerprintHash: "source-a",
    referenceStrategy: "style"
  });

  assert.ok(runRoot.endsWith(manifest.run_id));
  assert.ok(fs.existsSync(path.join(runRoot, "manifest.json")));
  assert.equal(manifest.phase, "create");
  assert.equal(manifest.reference_strategy, "style");
});

test("readManifest rejects corrupted manifests clearly", () => {
  const rootDir = tmpRoot();
  const runRoot = path.join(rootDir, "broken-run");
  fs.mkdirSync(runRoot, { recursive: true });
  fs.writeFileSync(path.join(runRoot, "manifest.json"), "{not-json");

  assert.throws(() => readManifest(runRoot), /Invalid or unreadable manifest/);
});

test("findLatestCompatibleRun discovers a matching manifest by metadata", () => {
  const rootDir = tmpRoot();
  const first = initRunState({
    rootDir,
    normalizedBriefHash: "brief-a",
    sourceFingerprintHash: "source-a",
    referenceStrategy: "style"
  });
  initRunState({
    rootDir,
    normalizedBriefHash: "brief-b",
    sourceFingerprintHash: "source-b",
    referenceStrategy: "none"
  });

  const found = findLatestCompatibleRun(rootDir, {
    phase: "create",
    normalized_brief_hash: "brief-a",
    source_fingerprint_hash: "source-a",
    reference_strategy: "style",
    style_contract_version: "v1"
  });

  assert.ok(found);
  assert.equal(found.manifest.run_id, first.manifest.run_id);
});

test("findLatestCompatibleRun does not reuse runs when manual artifact fingerprints differ", () => {
  const rootDir = tmpRoot();
  initRunState({
    rootDir,
    normalizedBriefHash: "brief-a",
    sourceFingerprintHash: "source-a",
    referenceStrategy: "style_and_structure",
    manualArtifactHash: "manual-a"
  });

  const found = findLatestCompatibleRun(rootDir, {
    phase: "create",
    normalized_brief_hash: "brief-a",
    source_fingerprint_hash: "source-a",
    reference_strategy: "style_and_structure",
    style_contract_version: "v1",
    manual_artifact_hash: "manual-b"
  });

  assert.equal(found, null);
});

test("determineResumeStage restarts from the earliest affected stage", () => {
  const previous = {
    normalized_brief_hash: "brief-a",
    source_fingerprint_hash: "source-a",
    reference_strategy: "style",
    style_contract_version: "v1"
  };

  assert.equal(determineResumeStage(previous, { ...previous }), "build");
  assert.equal(
    determineResumeStage(previous, { ...previous, style_contract_version: "v2" }),
    "design"
  );
  assert.equal(
    determineResumeStage(previous, { ...previous, source_fingerprint_hash: "source-b" }),
    "research"
  );
  assert.equal(
    determineResumeStage(previous, { ...previous, manual_artifact_hash: "manual-b" }),
    "research"
  );
  assert.equal(
    determineResumeStage(previous, { ...previous, normalized_brief_hash: "brief-b" }),
    "intake"
  );
});

test("createRunId is stable for the same input within the same timestamp", () => {
  const now = new Date("2026-03-25T12:00:00.000Z");
  assert.equal(createRunId("same", now), createRunId("same", now));
});

test("detectResumeStage reflects the earliest missing artifact in a compatible run", () => {
  const rootDir = tmpRoot();
  const { runRoot } = initRunState({
    rootDir,
    normalizedBriefHash: "brief-a",
    sourceFingerprintHash: "source-a",
    referenceStrategy: "style"
  });

  fs.writeFileSync(path.join(runRoot, "artifacts", "manuscript.md"), "# Deck");
  assert.equal(detectResumeStage(runRoot), "design");

  fs.writeFileSync(path.join(runRoot, "artifacts", "design_plan.md"), "# Design");
  fs.writeFileSync(path.join(runRoot, "artifacts", "slide-build-spec.json"), "{}");
  fs.writeFileSync(path.join(runRoot, "artifacts", "pptx-handoff.json"), "{}");
  fs.writeFileSync(path.join(runRoot, "artifacts", "output.pptx"), "pptx");
  assert.equal(detectResumeStage(runRoot), "evaluate");
});

test("initRunState supports edit runs with phase-specific fields", () => {
  const rootDir = tmpRoot();
  const { runRoot, manifest } = initRunState({
    rootDir,
    phase: "edit",
    sourceDeckHash: "deck-a",
    changeFingerprintHash: "change-a"
  });

  assert.ok(runRoot.endsWith(manifest.run_id));
  assert.equal(manifest.phase, "edit");
  assert.equal(manifest.source_deck_hash, "deck-a");
  assert.equal(manifest.change_fingerprint_hash, "change-a");
  assert.ok(fs.existsSync(path.join(runRoot, "working")));
});

test("determineResumeStage uses edit-phase invalidation rules", () => {
  const previous = {
    phase: "edit",
    source_deck_hash: "deck-a",
    change_fingerprint_hash: "change-a",
    style_preservation_mode: "preserve",
    restyle_mode: "none",
    style_contract_version: "v1"
  };

  assert.equal(determineResumeStage(previous, { ...previous }), "edit");
  assert.equal(
    determineResumeStage(previous, { ...previous, restyle_mode: "tighten" }),
    "plan"
  );
  assert.equal(
    determineResumeStage(previous, { ...previous, change_fingerprint_hash: "change-b" }),
    "research"
  );
  assert.equal(
    determineResumeStage(previous, { ...previous, source_deck_hash: "deck-b" }),
    "analyze"
  );
});

test("detectResumeStage reflects the earliest missing artifact in a compatible edit run", () => {
  const rootDir = tmpRoot();
  const { runRoot } = initRunState({
    rootDir,
    phase: "edit",
    sourceDeckHash: "deck-a",
    changeFingerprintHash: "change-a"
  });

  fs.writeFileSync(path.join(runRoot, "artifacts", "original-text.md"), "# Extracted");
  fs.writeFileSync(path.join(runRoot, "artifacts", "original-slide-index.json"), "[]");
  fs.writeFileSync(path.join(runRoot, "artifacts", "raw-slide-captions.json"), "{}");
  fs.writeFileSync(path.join(runRoot, "artifacts", "slide_analysis.json"), "{}");
  fs.writeFileSync(path.join(runRoot, "artifacts", "source-media-index.json"), "[]");
  assert.equal(detectResumeStage(runRoot), "research");

  fs.writeFileSync(path.join(runRoot, "artifacts", "research_delta.md"), "# Delta");
  assert.equal(detectResumeStage(runRoot), "plan");

  fs.writeFileSync(path.join(runRoot, "artifacts", "update_plan.md"), "# Plan");
  fs.writeFileSync(path.join(runRoot, "artifacts", "update_plan.json"), "{}");
  fs.writeFileSync(path.join(runRoot, "artifacts", "transcript-index.json"), "{}");
  assert.equal(detectResumeStage(runRoot), "edit");

  fs.writeFileSync(path.join(runRoot, "artifacts", "edit_handoff.json"), "{}");
  fs.writeFileSync(path.join(runRoot, "artifacts", "output-updated.pptx"), "pptx");
  assert.equal(detectResumeStage(runRoot), "evaluate");
});

test("detectResumeStage returns awaiting_image_approval when approval request exists without a decision", () => {
  const rootDir = tmpRoot();
  const { runRoot } = initRunState({
    rootDir,
    phase: "edit",
    sourceDeckHash: "deck-a",
    changeFingerprintHash: "change-a"
  });

  fs.writeFileSync(path.join(runRoot, "artifacts", "approval-request.json"), "{}");
  assert.equal(detectResumeStage(runRoot), "awaiting_image_approval");
});

test("detectResumeStage routes approved image replacements to evaluate and rejected ones back to edit", () => {
  const rootDir = tmpRoot();
  const { runRoot } = initRunState({
    rootDir,
    phase: "edit",
    sourceDeckHash: "deck-a",
    changeFingerprintHash: "change-a"
  });

  fs.writeFileSync(path.join(runRoot, "artifacts", "approval-request.json"), "{}");
  fs.writeFileSync(path.join(runRoot, "artifacts", "approval-decision.json"), JSON.stringify({ status: "approved" }));
  assert.equal(detectResumeStage(runRoot), "evaluate");

  fs.writeFileSync(path.join(runRoot, "artifacts", "approval-decision.json"), JSON.stringify({ status: "rejected" }));
  assert.equal(detectResumeStage(runRoot), "edit");
});
