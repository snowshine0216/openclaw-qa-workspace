"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");

const contentPromptPath = path.resolve(__dirname, "..", "prompts", "eval-content.md");
const designPromptPath = path.resolve(__dirname, "..", "prompts", "eval-design.md");
const coherencePromptPath = path.resolve(__dirname, "..", "prompts", "eval-coherence.md");
const planPath = path.resolve(__dirname, "..", "..", "..", "..", "docs", "archive", "ppt-agent", "PPT_AGENT_SKILL_DESIGN.md");

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

test("evaluation prompts cover content, design, and coherence concerns from the plan", () => {
  const content = read(contentPromptPath);
  const design = read(designPromptPath);
  const coherence = read(coherencePromptPath);
  assert.match(content, /Message clarity/);
  assert.match(design, /Style contract compliance/);
  assert.match(coherence, /narrative spine/i);
});

test("plan and prompts agree on eval output shape expectations", () => {
  const plan = read(planPath);
  const design = read(designPromptPath);
  assert.match(plan, /design average: `>= 4\.0`/);
  assert.match(design, /\"score\": <integer 1-5>/);
});
