"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");

const skillPath = path.resolve(__dirname, "..", "SKILL.md");
const referencePath = path.resolve(__dirname, "..", "reference.md");

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

test("skill contract locks Phase 1 create mode to new-deck generation", () => {
  const skill = read(skillPath);
  assert.match(skill, /Phase 1 creates a \*\*new\*\* deck/);
  assert.match(skill, /new deck generation through pptx/);
  assert.doesNotMatch(skill, /template-editing-first/i);
});

test("reference contract preserves advisory reference strategies without switching mechanics", () => {
  const reference = read(referencePath);
  assert.match(reference, /References may influence:/);
  assert.match(reference, /do \*\*not\*\* switch Phase 1 into template-editing-first behavior/);
});
