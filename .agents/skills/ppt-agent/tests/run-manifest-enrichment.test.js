"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const {
  initRunState,
  determineResumeStage
} = require("../scripts/lib/run-manifest");

function tmpRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "ppt-agent-manifest-"));
}

test("initRunState creates enriched artifact-path manifest fields for edit runs", () => {
  const rootDir = tmpRoot();
  const { runRoot, manifest } = initRunState({
    rootDir,
    phase: "edit",
    sourceDeckHash: "deck-a",
    changeFingerprintHash: "change-a"
  });

  assert.equal(manifest.phase, "edit");
  assert.ok(fs.existsSync(path.join(runRoot, "artifacts")));
  assert.ok(fs.existsSync(path.join(runRoot, "working")));

  // Verify manifest has expected structure
  assert.ok(manifest.run_id);
  assert.equal(manifest.source_deck_hash, "deck-a");
  assert.equal(manifest.change_fingerprint_hash, "change-a");
});

test("determineResumeStage invalidates source-theme when source_deck_hash changes", () => {
  const previous = {
    phase: "edit",
    source_deck_hash: "deck-a",
    change_fingerprint_hash: "change-a",
    style_preservation_mode: "preserve",
    restyle_mode: "none",
    style_contract_version: "v1"
  };

  const updated = {
    ...previous,
    source_deck_hash: "deck-b"
  };

  const resumeStage = determineResumeStage(previous, updated);

  // Should restart from analyze stage (earliest stage that depends on source deck)
  assert.equal(resumeStage, "analyze");
});

test("determineResumeStage invalidates slide-brief when change_fingerprint_hash changes", () => {
  const previous = {
    phase: "edit",
    source_deck_hash: "deck-a",
    change_fingerprint_hash: "change-a",
    style_preservation_mode: "preserve",
    restyle_mode: "none",
    style_contract_version: "v1"
  };

  const updated = {
    ...previous,
    change_fingerprint_hash: "change-b"
  };

  const resumeStage = determineResumeStage(previous, updated);

  // Should restart from research stage (change request affects research delta)
  assert.equal(resumeStage, "research");
});

test("determineResumeStage invalidates image-prompt when restyle_mode changes", () => {
  const previous = {
    phase: "edit",
    source_deck_hash: "deck-a",
    change_fingerprint_hash: "change-a",
    style_preservation_mode: "preserve",
    restyle_mode: "none",
    style_contract_version: "v1"
  };

  const updated = {
    ...previous,
    restyle_mode: "tighten"
  };

  const resumeStage = determineResumeStage(previous, updated);

  // Should restart from plan stage (restyle affects planning)
  assert.equal(resumeStage, "plan");
});

test("determineResumeStage invalidates structured-slide-spec when style_contract_version changes", () => {
  const previous = {
    phase: "edit",
    source_deck_hash: "deck-a",
    change_fingerprint_hash: "change-a",
    style_preservation_mode: "preserve",
    restyle_mode: "none",
    style_contract_version: "v1"
  };

  const updated = {
    ...previous,
    style_contract_version: "v2"
  };

  const resumeStage = determineResumeStage(previous, updated);

  // Should restart from plan stage (style contract affects planning)
  assert.equal(resumeStage, "plan");
});

test("determineResumeStage allows resume from edit when no invalidation occurs", () => {
  const previous = {
    phase: "edit",
    source_deck_hash: "deck-a",
    change_fingerprint_hash: "change-a",
    style_preservation_mode: "preserve",
    restyle_mode: "none",
    style_contract_version: "v1"
  };

  const updated = { ...previous };

  const resumeStage = determineResumeStage(previous, updated);

  // Should resume from edit stage (no changes)
  assert.equal(resumeStage, "edit");
});

test("initRunState creates artifacts directory structure for enrichment", () => {
  const rootDir = tmpRoot();
  const { runRoot } = initRunState({
    rootDir,
    phase: "edit",
    sourceDeckHash: "deck-a",
    changeFingerprintHash: "change-a"
  });

  const artifactsDir = path.join(runRoot, "artifacts");
  assert.ok(fs.existsSync(artifactsDir));

  // Create enrichment subdirectories to verify structure
  fs.mkdirSync(path.join(artifactsDir, "slide-briefs"), { recursive: true });
  fs.mkdirSync(path.join(artifactsDir, "image-prompts"), { recursive: true });

  assert.ok(fs.existsSync(path.join(artifactsDir, "slide-briefs")));
  assert.ok(fs.existsSync(path.join(artifactsDir, "image-prompts")));
});
