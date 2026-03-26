"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("node:child_process");

const scriptPath = path.resolve(__dirname, "..", "scripts", "create-run.js");
const preloadPath = path.resolve(__dirname, "fixtures", "create-run-eval-fail-preload.js");
const { resolveRunRoot } = require("../scripts/create-run.js");

function tmpRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "ppt-agent-cli-"));
}

test("create-run initializes a Phase 1 run and prints JSON output", () => {
  const rootDir = tmpRoot();
  const attachmentPath = path.join(rootDir, "q2-report.md");
  fs.writeFileSync(
    attachmentPath,
    [
      "# Q2 Results",
      "",
      "- Revenue increased 12% quarter over quarter.",
      "- Operating margin improved by 3 points.",
      "- Hiring pace decision required before Q3 planning."
    ].join("\n")
  );
  const result = spawnSync(
    "node",
    [
      "--require", preloadPath,
      scriptPath,
      "--root-dir", rootDir,
      "--prompt", "Build a Q2 operating review for leadership with current metrics.",
      "--objective", "Summarize Q2 performance and next-step decisions.",
      "--audience", "Executive leadership",
      "--attachments", attachmentPath
    ],
    {
      encoding: "utf8",
      env: {
        ...process.env,
        PPT_AGENT_CREATE_RUN_EVAL_STATUS: "pass"
      }
    }
  );

  assert.equal(result.status, 0, result.stderr);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.status, "ready");
  assert.ok(parsed.runRoot);
  assert.ok(fs.existsSync(path.join(parsed.runRoot, "manifest.json")));
  assert.ok(fs.existsSync(path.join(parsed.runRoot, "logs", "stage-status.json")));
  assert.ok(fs.existsSync(path.join(parsed.runRoot, "artifacts", "manuscript.md")));
  assert.ok(fs.existsSync(path.join(parsed.runRoot, "artifacts", "design_plan.md")));
  assert.ok(fs.existsSync(path.join(parsed.runRoot, "artifacts", "slide-build-spec.json")));
  assert.ok(fs.existsSync(path.join(parsed.runRoot, "artifacts", "pptx-handoff.json")));
});

test("create-run can emit slide-build-spec when manuscript and design plan are provided", () => {
  const rootDir = tmpRoot();
  const manuscriptFixture = path.resolve(__dirname, "..", "fixtures", "sample-manuscript.md");
  const designPlanFixture = path.resolve(__dirname, "..", "fixtures", "sample-design-plan.md");
  const result = spawnSync(
    "node",
    [
      scriptPath,
      "--root-dir", rootDir,
      "--prompt", "Build a Q2 operating review for leadership with current metrics.",
      "--objective", "Summarize Q2 performance and next-step decisions.",
      "--attachments", "/tmp/q2-report.md",
      "--manuscript", manuscriptFixture,
      "--design-plan", designPlanFixture
    ],
    { encoding: "utf8" }
  );

  assert.equal(result.status, 0, result.stderr);
  const parsed = JSON.parse(result.stdout);
  assert.ok(parsed.slideBuildSpecPath);
  assert.ok(fs.existsSync(parsed.slideBuildSpecPath));
  assert.ok(parsed.pptxHandoffPath);
  assert.ok(fs.existsSync(parsed.pptxHandoffPath));
  assert.ok(fs.existsSync(path.join(parsed.runRoot, "artifacts", "manuscript.md")));
  assert.ok(fs.existsSync(path.join(parsed.runRoot, "artifacts", "design_plan.md")));
  const manuscriptFixtureContent = fs.readFileSync(manuscriptFixture, "utf8");
  assert.equal(
    fs.readFileSync(path.join(parsed.runRoot, "artifacts", "manuscript.md"), "utf8"),
    manuscriptFixtureContent.endsWith("\n\n")
      ? manuscriptFixtureContent
      : manuscriptFixtureContent.replace(/\n*$/, "\n\n")
  );
  assert.equal(
    fs.readFileSync(path.join(parsed.runRoot, "artifacts", "design_plan.md"), "utf8"),
    fs.readFileSync(designPlanFixture, "utf8")
  );
});

test("create-run returns insufficient_brief for an ungrounded prompt-only request", () => {
  const rootDir = tmpRoot();
  const result = spawnSync(
    "node",
    [
      scriptPath,
      "--root-dir", rootDir,
      "--prompt", "Internal confidential deck",
      "--objective", "Summarize the internal confidential plan."
    ],
    { encoding: "utf8" }
  );

  assert.notEqual(result.status, 0);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.status, "insufficient_brief");
});

test("create-run requires an explicit objective before auto-materializing a prompt-only request", () => {
  const rootDir = tmpRoot();
  const result = spawnSync(
    "node",
    [
      scriptPath,
      "--root-dir", rootDir,
      "--prompt", "Build a market landscape deck on enterprise browser automation adoption in 2026."
    ],
    { encoding: "utf8" }
  );

  assert.notEqual(result.status, 0);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.status, "insufficient_brief");
  assert.match(parsed.reason, /objective/i);
});

test("create-run rejects a prompt-only request without inspectable provenance", () => {
  const rootDir = tmpRoot();
  const result = spawnSync(
    "node",
    [
      scriptPath,
      "--root-dir", rootDir,
      "--prompt", "Build a market landscape deck on enterprise browser automation adoption in 2026.",
      "--objective", "Summarize the market, risks, and recommendation."
    ],
    { encoding: "utf8" }
  );

  assert.notEqual(result.status, 0);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.status, "insufficient_brief");
  assert.match(parsed.reason, /source provenance/i);
});

test("create-run returns no_slide when source-backed inputs collapse to zero usable evidence", () => {
  const rootDir = tmpRoot();
  const result = spawnSync(
    "node",
    [
      scriptPath,
      "--root-dir", rootDir,
      "--prompt", "Build a Q2 operating review for leadership with current metrics.",
      "--objective", "Summarize Q2 performance and next-step decisions.",
      "--attachments", path.join(rootDir, "missing-report.md")
    ],
    { encoding: "utf8" }
  );

  assert.notEqual(result.status, 0);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.status, "no_slide");
  assert.match(parsed.reason, /zero valid slides|usable source material/i);
  assert.equal(parsed.unreadableAttachments.length, 1);
});

test("create-run accepts a prompt-only request when inspectable provenance is supplied", () => {
  const rootDir = tmpRoot();
  const provenancePath = path.join(rootDir, "source-provenance.json");
  fs.writeFileSync(
    provenancePath,
    JSON.stringify(
      [
        {
          title: "Enterprise Browser Automation Outlook 2026",
          locator: "https://example.com/browser-automation-outlook-2026",
          summary: "Regulated support teams are increasing browser automation adoption with governance controls."
        }
      ],
      null,
      2
    )
  );
  const result = spawnSync(
    "node",
    [
      "--require", preloadPath,
      scriptPath,
      "--root-dir", rootDir,
      "--prompt", "Build a market landscape deck on enterprise browser automation adoption in 2026.",
      "--objective", "Summarize the market, risks, and recommendation.",
      "--source-provenance", provenancePath
    ],
    {
      encoding: "utf8",
      env: {
        ...process.env,
        PPT_AGENT_CREATE_RUN_EVAL_STATUS: "pass"
      }
    }
  );

  assert.equal(result.status, 0, result.stderr);
  const parsed = JSON.parse(result.stdout);
  const outputProvenancePath = path.join(parsed.runRoot, "artifacts", "source-provenance.json");
  assert.ok(fs.existsSync(outputProvenancePath));
  const provenance = JSON.parse(fs.readFileSync(outputProvenancePath, "utf8"));
  assert.ok(provenance.entries.length >= 1);
  assert.equal(/^prompt:\/\//i.test(provenance.entries[0].locator), false);
});

test("create-run resolves omitted root-dir to the skill-local runs directory", async () => {
  assert.equal(
    await resolveRunRoot(),
    path.resolve(__dirname, "..", "runs")
  );
});

test("create-run exits non-zero and reports failed status when Phase 1 evaluation does not pass", () => {
  const rootDir = tmpRoot();
  const result = spawnSync(
    "node",
    [
      "--require", preloadPath,
      scriptPath,
      "--root-dir", rootDir,
      "--prompt", "Build a Q2 operating review for leadership with current metrics.",
      "--objective", "Summarize Q2 performance and next-step decisions."
    ],
    { encoding: "utf8" }
  );

  assert.notEqual(result.status, 0);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.status, "failed");
  assert.equal(parsed.evaluation.status, "fail");
  assert.equal(parsed.evaluation.reason, "evaluation_unavailable");
});

test("create-run rejects prompt-only provenance that does not support the requested topic", () => {
  const rootDir = tmpRoot();
  const provenancePath = path.join(rootDir, "source-provenance.json");
  fs.writeFileSync(
    provenancePath,
    JSON.stringify(
      [
        {
          title: "Retail Store Foot Traffic Outlook",
          locator: "https://example.com/retail-foot-traffic",
          summary: "Foot traffic improved across suburban retail centers and mall operators."
        }
      ],
      null,
      2
    )
  );
  const result = spawnSync(
    "node",
    [
      scriptPath,
      "--root-dir", rootDir,
      "--prompt", "Build a market landscape deck on enterprise browser automation adoption in 2026.",
      "--objective", "Summarize the market, risks, and recommendation.",
      "--source-provenance", provenancePath
    ],
    { encoding: "utf8" }
  );

  assert.notEqual(result.status, 0);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.status, "insufficient_brief");
  assert.match(parsed.reason, /support|relevant|grounded/i);
});
