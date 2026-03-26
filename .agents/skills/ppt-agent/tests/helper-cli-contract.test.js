"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const path = require("node:path");

function runScript(scriptName) {
  return spawnSync("node", [path.resolve(__dirname, "..", "scripts", scriptName)], {
    encoding: "utf8"
  });
}

test("caption-image.js exposes a real CLI and reports usage when args are missing", () => {
  const result = runScript("caption-image.js");
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Usage: node caption-image\.js/i);
});

test("summarize-doc.js exposes a real CLI and reports usage when args are missing", () => {
  const result = runScript("summarize-doc.js");
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Usage: node summarize-doc\.js/i);
});

test("eval-presentation.js exposes a real CLI and reports usage when args are missing", () => {
  const result = runScript("eval-presentation.js");
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Usage: node eval-presentation\.js/i);
});
