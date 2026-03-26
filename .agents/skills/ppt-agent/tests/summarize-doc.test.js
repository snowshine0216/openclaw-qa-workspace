"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { summarizeDoc } = require("../scripts/summarize-doc.js");

function tmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "ppt-agent-summary-"));
}

test("summarizeDoc shells out through repo-root venv and writes markitdown output", async () => {
  const dir = tmpDir();
  const inputPath = path.join(dir, "metrics.md");
  const outputPath = path.join(dir, "metrics-summary.md");
  fs.writeFileSync(inputPath, "# Q1 Metrics\n");

  let invocation = null;
  const summary = await summarizeDoc(inputPath, outputPath, {
    runtimePaths: {
      repoRoot: "/repo/root",
      venvActivatePath: "/repo/root/.venv/bin/activate"
    },
    spawnSyncImpl(command, args, options) {
      invocation = { command, args, options };
      return {
        status: 0,
        stdout: "# Converted Markdown\n\n- Revenue: $12M\n",
        stderr: ""
      };
    }
  });

  assert.equal(summary.outputPath, outputPath);
  const written = fs.readFileSync(outputPath, "utf8");
  assert.match(written, /# Converted Markdown/);
  assert.match(written, /Revenue: \$12M/);
  assert.equal(invocation.command, "/bin/zsh");
  assert.deepEqual(invocation.args, [
    "-lc",
    "source '/repo/root/.venv/bin/activate' && python -m markitdown '" + inputPath + "'"
  ]);
  assert.equal(invocation.options.cwd, "/repo/root");
  assert.equal(invocation.options.encoding, "utf8");
});

test("summarizeDoc rejects empty markitdown output", async () => {
  const dir = tmpDir();
  const inputPath = path.join(dir, "empty.md");
  const outputPath = path.join(dir, "delta-summary.md");
  fs.writeFileSync(inputPath, "# Empty\n");

  await assert.rejects(
    summarizeDoc(inputPath, outputPath, {
      runtimePaths: {
        repoRoot: "/repo/root",
        venvActivatePath: "/repo/root/.venv/bin/activate"
      },
      spawnSyncImpl() {
        return {
          status: 0,
          stdout: " \n",
          stderr: ""
        };
      }
    }),
    /empty output/i
  );
});

test("summarizeDoc reports subprocess failures", async () => {
  const dir = tmpDir();
  const inputPath = path.join(dir, "broken.md");
  const outputPath = path.join(dir, "empty-summary.md");
  fs.writeFileSync(inputPath, "# Broken\n");

  await assert.rejects(
    summarizeDoc(inputPath, outputPath, {
      runtimePaths: {
        repoRoot: "/repo/root",
        venvActivatePath: "/repo/root/.venv/bin/activate"
      },
      spawnSyncImpl() {
        return {
          status: 1,
          stdout: "",
          stderr: "markitdown failed"
        };
      }
    }),
    /markitdown failed/i
  );
});
