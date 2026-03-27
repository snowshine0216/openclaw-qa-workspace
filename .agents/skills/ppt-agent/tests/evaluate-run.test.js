"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const zlib = require("zlib");
const { spawnSync } = require("node:child_process");

const { evaluateRun } = require("../scripts/lib/evaluate-run");
const scriptPath = path.resolve(__dirname, "..", "scripts", "evaluate-run.js");

function tmpRunRoot() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ppt-agent-eval-"));
  fs.mkdirSync(path.join(dir, "artifacts"), { recursive: true });
  fs.mkdirSync(path.join(dir, "renders"), { recursive: true });
  return dir;
}

function writeGoodRun(runRoot) {
  fs.writeFileSync(
    path.join(runRoot, "manifest.json"),
    JSON.stringify(
      {
        run_id: "run-1",
        phase: "create",
        status: "build",
        normalized_brief_hash: "a",
        source_fingerprint_hash: "b",
        reference_strategy: "style",
        style_contract_version: "v1",
        artifact_paths: {}
      },
      null,
      2
    )
  );
  fs.writeFileSync(
    path.join(runRoot, "artifacts", "manuscript.md"),
    [
      "# Q2 Operating Review",
      "",
      "Slide title: Executive Summary",
      "- Revenue increased 12% quarter over quarter",
      "- Margin improved by 3 points",
      "---",
      "Slide title: Risks",
      "- Supply chain delay remains the top operational risk",
      "---",
      "Slide title: Decisions",
      "- Confirm hiring pace for Q3"
    ].join("\n")
  );
  fs.writeFileSync(
    path.join(runRoot, "artifacts", "design_plan.md"),
    [
      "# Design Plan: Q2 Operating Review",
      "",
      "## Visual Identity",
      "- Accent color: #FA6611",
      "- Tone: restrained business deck",
      "- Minimal text: yes"
    ].join("\n")
  );
  fs.writeFileSync(
    path.join(runRoot, "artifacts", "slide-build-spec.json"),
    JSON.stringify(
      {
        slides: [
          { slide_number: 1, title: "Executive Summary", layout: "title_hero", bullet_count: 2 },
          { slide_number: 2, title: "Risks", layout: "two_column", bullet_count: 1 },
          { slide_number: 3, title: "Decisions", layout: "decision_grid", bullet_count: 1 }
        ],
        design_tokens: { accent_color: "#FA6611" }
      },
      null,
      2
    )
  );
  fs.writeFileSync(path.join(runRoot, "artifacts", "pptx-handoff.json"), "{}");
  fs.writeFileSync(path.join(runRoot, "artifacts", "output.pptx"), "pptx");
  writeSolidPng(path.join(runRoot, "renders", "slide-01.png"), 1600, 900);
  writeSolidPng(path.join(runRoot, "renders", "slide-02.png"), 1600, 900);
  writeSolidPng(path.join(runRoot, "renders", "slide-03.png"), 1600, 900);
}

function writeSolidPng(filePath, width, height) {
  const rows = [];
  for (let y = 0; y < height; y++) {
    const row = Buffer.alloc(1 + width * 4);
    row[0] = 0;
    for (let x = 0; x < width; x++) {
      const offset = 1 + x * 4;
      row[offset] = 250;
      row[offset + 1] = 102;
      row[offset + 2] = 17;
      row[offset + 3] = 255;
    }
    rows.push(row);
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6;
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const idatData = zlib.deflateSync(Buffer.concat(rows));

  const png = Buffer.concat([
    signature,
    chunk("IHDR", ihdrData),
    chunk("IDAT", idatData),
    chunk("IEND", Buffer.alloc(0))
  ]);
  fs.writeFileSync(filePath, png);
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let index = 0; index < 8; index++) {
      crc = (crc & 1) === 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

test("evaluateRun passes when required Phase 1 artifacts and valid renders are present", () => {
  const runRoot = tmpRunRoot();
  writeGoodRun(runRoot);

  const { outputPath, summary } = evaluateRun({ runRoot });
  assert.equal(summary.status, "pass");
  assert.ok(fs.existsSync(outputPath));
  assert.ok(fs.existsSync(path.join(runRoot, "artifacts", "evals.json")));
  assert.ok(summary.scores.content.average >= 4);
  assert.ok(summary.scores.design.average >= 4);
  assert.ok(summary.scores.coherence.score >= 4);
  assert.equal(summary.summary.overall >= 4, true);
  assert.equal(summary.render_checks.valid_count, 3);
  assert.ok(Array.isArray(summary.rubric.prompts));
});

test("evaluateRun fails when required artifacts are missing", () => {
  const runRoot = tmpRunRoot();
  const { summary } = evaluateRun({ runRoot });
  assert.equal(summary.status, "fail");
  assert.ok(summary.missing.includes("manifest"));
});

test("evaluateRun returns evaluation_unavailable when the deck has no rendered slides", () => {
  const runRoot = tmpRunRoot();
  writeGoodRun(runRoot);
  fs.rmSync(path.join(runRoot, "renders"), { recursive: true, force: true });
  fs.mkdirSync(path.join(runRoot, "renders"), { recursive: true });

  const { summary } = evaluateRun({ runRoot });
  assert.equal(summary.status, "fail");
  assert.equal(summary.reason, "evaluation_unavailable");
});

test("evaluateRun reports a recoverable evaluation error when one rendered slide is invalid", () => {
  const runRoot = tmpRunRoot();
  writeGoodRun(runRoot);
  fs.writeFileSync(path.join(runRoot, "renders", "slide-02.png"), "not-a-real-png");

  const { summary } = evaluateRun({ runRoot });
  assert.equal(summary.status, "partial");
  assert.equal(summary.reason, "recoverable_evaluation_error");
  assert.ok(summary.recoverable_errors.length >= 1);
  assert.equal(summary.render_checks.valid_count, 2);
});

test("evaluateRun fails quality thresholds when style contract and structure are weak", () => {
  const runRoot = tmpRunRoot();
  writeGoodRun(runRoot);
  fs.writeFileSync(
    path.join(runRoot, "artifacts", "design_plan.md"),
    [
      "# Design Plan: Generic Update",
      "",
      "## Visual Identity",
      "- Accent color: #0055FF",
      "- Tone: generic blue deck",
      "- Minimal text: no"
    ].join("\n")
  );
  fs.writeFileSync(
    path.join(runRoot, "artifacts", "slide-build-spec.json"),
    JSON.stringify(
      {
        slides: [
          { slide_number: 1, title: "Executive Summary", layout: "basic", bullet_count: 8 },
          { slide_number: 2, title: "Executive Summary Again", layout: "basic", bullet_count: 8 }
        ],
        design_tokens: { accent_color: "#0055FF" }
      },
      null,
      2
    )
  );

  const { summary } = evaluateRun({ runRoot });
  assert.equal(summary.status, "fail");
  assert.equal(summary.reason, "quality_threshold_failed");
  assert.ok(summary.scores.design.average < 4);
});

test("evaluateRun fails when rendered slide coverage does not match the build spec", () => {
  const runRoot = tmpRunRoot();
  writeGoodRun(runRoot);
  fs.rmSync(path.join(runRoot, "renders", "slide-03.png"));

  const { summary } = evaluateRun({ runRoot });
  assert.equal(summary.status, "fail");
  assert.equal(summary.reason, "quality_threshold_failed");
  assert.ok(summary.summary.render_alignment.coverage_ratio < 1);
  assert.deepEqual(summary.summary.render_alignment.missing_slides, [3]);
  assert.ok(summary.refinementTargets.some((target) => target.stage === "slide"));
});

test("evaluate-run CLI requires run-root", () => {
  const result = spawnSync(process.execPath, [scriptPath], { encoding: "utf8" });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Usage: node evaluate-run\.js --run-root/);
});

test("evaluate-run CLI exits non-zero when evaluation status is fail", () => {
  const runRoot = tmpRunRoot();
  const result = spawnSync(process.execPath, [scriptPath, "--run-root", runRoot], { encoding: "utf8" });

  assert.notEqual(result.status, 0);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.summary.status, "fail");
});

test("evaluate-run CLI exits non-zero when evaluation status is partial", () => {
  const runRoot = tmpRunRoot();
  writeGoodRun(runRoot);
  fs.writeFileSync(path.join(runRoot, "renders", "slide-02.png"), "not-a-real-png");

  const result = spawnSync(process.execPath, [scriptPath, "--run-root", runRoot], { encoding: "utf8" });

  assert.notEqual(result.status, 0);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.summary.status, "partial");
  assert.equal(parsed.summary.reason, "recoverable_evaluation_error");
});
