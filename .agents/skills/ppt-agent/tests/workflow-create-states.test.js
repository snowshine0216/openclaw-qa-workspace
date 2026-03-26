"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { initializeCreateWorkflow } = require("../scripts/lib/create-workflow");
const skillPath = path.resolve(__dirname, "..", "SKILL.md");
const researchRolePath = path.resolve(__dirname, "..", "roles", "research.md");

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function tmpRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "ppt-agent-states-"));
}

test("prompt-only but researchable requests are allowed", () => {
  const skill = read(skillPath);
  const research = read(researchRolePath);
  assert.match(skill, /Prompt-only requests are allowed only when they can be grounded in verifiable research/);
  assert.match(research, /Prompt-only requests are allowed only when they can be supported by verifiable research/);
});

test("insufficiently grounded prompt-only requests must stop", () => {
  const skill = read(skillPath);
  const research = read(researchRolePath);
  assert.match(skill, /insufficiently grounded and should stop/);
  assert.match(research, /do not fabricate content\. Return the insufficient-brief state instead/);
});

test("runtime returns insufficient_brief for an ungrounded prompt-only request", () => {
  const result = initializeCreateWorkflow({
    rootDir: tmpRoot(),
    prompt: "Help with my confidential internal deck",
    objective: "Summarize the internal confidential plan."
  });

  assert.equal(result.status, "insufficient_brief");
});

test("runtime requires an explicit objective before proceeding", () => {
  const result = initializeCreateWorkflow({
    rootDir: tmpRoot(),
    prompt: "Build a market landscape deck on enterprise browser automation adoption in 2026."
  });

  assert.equal(result.status, "insufficient_brief");
  assert.match(result.reason, /objective/i);
});

test("runtime requires inspectable provenance for prompt-only requests", () => {
  const result = initializeCreateWorkflow({
    rootDir: tmpRoot(),
    prompt: "Build a market landscape deck on enterprise browser automation adoption in 2026.",
    objective: "Summarize the market and leadership recommendation."
  });

  assert.equal(result.status, "insufficient_brief");
  assert.match(result.reason, /source provenance/i);
});

test("runtime allows a prompt-only request with inspectable provenance", () => {
  const result = initializeCreateWorkflow({
    rootDir: tmpRoot(),
    prompt: "Build a market landscape deck on enterprise browser automation adoption in 2026.",
    objective: "Summarize the market and leadership recommendation.",
    sourceProvenance: [
      {
        title: "Enterprise Browser Automation Outlook 2026",
        locator: "https://example.com/browser-automation-outlook-2026",
        summary: "Regulated support teams are increasing browser automation adoption with governance controls."
      }
    ]
  });

  assert.equal(result.status, "ready");
  assert.equal(result.promptOnly, true);
});

test("runtime rejects prompt-only provenance when sources are not inspectable", () => {
  const result = initializeCreateWorkflow({
    rootDir: tmpRoot(),
    prompt: "Build a market landscape deck on enterprise browser automation adoption in 2026.",
    objective: "Summarize the market and leadership recommendation.",
    sourceProvenance: [
      {
        title: "Browser Automation Market Note",
        locator: "prompt://generated-note",
        summary: "Enterprise browser automation adoption is increasing under governance controls."
      }
    ]
  });

  assert.equal(result.status, "insufficient_brief");
  assert.match(result.reason, /inspectable/i);
});

test("runtime rejects prompt-only provenance when the sources do not support the requested topic", () => {
  const result = initializeCreateWorkflow({
    rootDir: tmpRoot(),
    prompt: "Build a market landscape deck on enterprise browser automation adoption in 2026.",
    objective: "Summarize the market and leadership recommendation.",
    sourceProvenance: [
      {
        title: "Retail Store Foot Traffic Outlook",
        locator: "https://example.com/retail-foot-traffic",
        summary: "Foot traffic improved across suburban retail centers and mall operators."
      }
    ]
  });

  assert.equal(result.status, "insufficient_brief");
  assert.match(result.reason, /support|relevant|grounded/i);
});
