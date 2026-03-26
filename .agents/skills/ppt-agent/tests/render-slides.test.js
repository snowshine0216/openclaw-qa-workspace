"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { renderSlides } = require("../scripts/lib/render-slides");

function tmpDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

test("renderSlides clears stale renders before copying a shorter rerender pass", () => {
  const root = tmpDir("ppt-agent-render-");
  const renderDir = path.join(root, "renders");
  fs.mkdirSync(renderDir, { recursive: true });
  fs.writeFileSync(path.join(renderDir, "slide-01.jpg"), "old-1");
  fs.writeFileSync(path.join(renderDir, "slide-02.jpg"), "old-2");
  fs.writeFileSync(path.join(renderDir, "slide-03.jpg"), "stale");

  const result = renderSlides(
    {
      outputPath: path.join(root, "deck.pptx"),
      renderDir
    },
    {
      runStep(command, args) {
        if (command !== "pdftoppm") {
          return;
        }
        const prefix = args[args.length - 1];
        fs.writeFileSync(`${prefix}-1.jpg`, "new-1");
        fs.writeFileSync(`${prefix}-2.jpg`, "new-2");
      }
    }
  );

  assert.equal(result.renderCount, 2);
  assert.deepEqual(fs.readdirSync(renderDir).sort(), ["slide-01.jpg", "slide-02.jpg"]);
  assert.equal(fs.readFileSync(path.join(renderDir, "slide-01.jpg"), "utf8"), "new-1");
  assert.equal(fs.existsSync(path.join(renderDir, "slide-03.jpg")), false);
});
