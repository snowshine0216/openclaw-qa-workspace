"use strict";

const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const { getRuntimePaths } = require("./runtime-paths");

function shellQuote(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

function buildMarkitdownCommand({ inputPath, venvActivatePath }) {
  return `source ${shellQuote(venvActivatePath)} && python -m markitdown ${shellQuote(inputPath)}`;
}

function runMarkitdown({ inputPath, runtimePaths, spawnSyncImpl }) {
  const command = buildMarkitdownCommand({
    inputPath,
    venvActivatePath: runtimePaths.venvActivatePath
  });
  return spawnSyncImpl("/bin/zsh", ["-lc", command], {
    cwd: runtimePaths.repoRoot,
    encoding: "utf8"
  });
}

function validateMarkitdownResult(result, inputPath) {
  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(
      `[ppt-agent] markitdown failed for ${inputPath}: ${result.stderr || result.stdout || `exit ${result.status}`}`.trim()
    );
  }

  if (!String(result.stdout || "").trim()) {
    throw new Error(`[ppt-agent] markitdown returned empty output for ${inputPath}`);
  }
}

async function convertDocumentToMarkdown(inputPath, outputPath, options = {}) {
  const resolvedInput = path.resolve(inputPath);
  const resolvedOutput = path.resolve(outputPath);
  const runtimePaths = options.runtimePaths || await getRuntimePaths();
  const spawnSyncImpl = options.spawnSyncImpl || spawnSync;

  if (!fs.existsSync(resolvedInput)) {
    throw new Error(`[ppt-agent] Input document is missing: ${resolvedInput}`);
  }

  const result = runMarkitdown({
    inputPath: resolvedInput,
    runtimePaths,
    spawnSyncImpl
  });
  validateMarkitdownResult(result, resolvedInput);

  fs.mkdirSync(path.dirname(resolvedOutput), { recursive: true });
  fs.writeFileSync(resolvedOutput, result.stdout);
  return {
    outputPath: resolvedOutput
  };
}

async function summarizeDoc(inputPath, outputPath, options = {}) {
  return convertDocumentToMarkdown(inputPath, outputPath, options);
}

module.exports = {
  buildMarkitdownCommand,
  convertDocumentToMarkdown,
  runMarkitdown,
  shellQuote,
  summarizeDoc
};
