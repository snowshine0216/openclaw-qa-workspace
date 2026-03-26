"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const PPTX_SKILL_DIR = path.resolve(__dirname, "..", "..", "..", "pptx");
const SOFFICE_SCRIPT = path.join(PPTX_SKILL_DIR, "scripts", "office", "soffice.py");

function resetRenderDir(renderDir) {
  fs.rmSync(renderDir, { recursive: true, force: true });
  fs.mkdirSync(renderDir, { recursive: true });
}

function renderSlides({ outputPath, renderDir }, deps = {}) {
  const runStepImpl = deps.runStep || runStep;
  resetRenderDir(renderDir);
  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), "ppt-agent-render-"));
  const pdfPath = path.join(workDir, `${path.basename(outputPath, ".pptx")}.pdf`);
  const prefix = path.join(workDir, "slide");

  try {
    runStepImpl("python3", [SOFFICE_SCRIPT, "--headless", "--convert-to", "pdf", "--outdir", workDir, outputPath]);
    runStepImpl("pdftoppm", ["-jpeg", "-r", "150", pdfPath, prefix]);
    const images = fs.readdirSync(workDir)
      .filter((name) => /^slide-\d+\.jpg$/i.test(name))
      .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));

    images.forEach((name, index) => {
      const target = path.join(renderDir, `slide-${String(index + 1).padStart(2, "0")}.jpg`);
      fs.copyFileSync(path.join(workDir, name), target);
    });

    return {
      renderDir,
      renderCount: images.length,
      mode: "pptx_skill_render"
    };
  } catch (error) {
    return {
      renderDir,
      renderCount: 0,
      mode: "pptx_skill_render",
      error: error.message
    };
  } finally {
    fs.rmSync(workDir, { recursive: true, force: true });
  }
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function extractSlideText(xml) {
  return Array.from(String(xml).matchAll(/<a:t[^>]*>(.*?)<\/a:t>/g))
    .map((match) => match[1]
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, "\"")
      .replace(/&#39;/g, "'")
      .trim())
    .filter(Boolean);
}

function wrapSvgText(text, width, x) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";

  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > width && current) {
      lines.push(current);
      current = word;
      return;
    }
    current = candidate;
  });
  if (current) {
    lines.push(current);
  }

  return lines.map((line, index) => ({
    text: line,
    x,
    y: 120 + index * 34
  }));
}

function buildSnapshotSvg({ title, bodyLines, slideNumber }) {
  const titleText = escapeXml(title || `Slide ${slideNumber}`);
  const wrappedBody = bodyLines.flatMap((line) => wrapSvgText(line, 54, 72));
  const bodyMarkup = wrappedBody
    .map((line) => `<text x="${line.x}" y="${line.y}" font-family="Arial, sans-serif" font-size="24" fill="#2C2C2C">${escapeXml(line.text)}</text>`)
    .join("");

  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">',
    '<rect width="1280" height="720" fill="#FFF8F3"/>',
    '<rect x="60" y="56" width="1160" height="608" rx="28" fill="#FFFFFF" stroke="#E9D7CC" stroke-width="4"/>',
    '<rect x="72" y="72" width="12" height="86" rx="6" fill="#FA6611"/>',
    `<text x="108" y="124" font-family="Arial, sans-serif" font-size="38" font-weight="700" fill="#1F1F1F">${titleText}</text>`,
    `<text x="1080" y="648" font-family="Arial, sans-serif" font-size="18" fill="#6B6B6B">slide ${slideNumber}</text>`,
    bodyMarkup || '<text x="72" y="170" font-family="Arial, sans-serif" font-size="24" fill="#4A4A4A">No extractable slide text</text>',
    "</svg>"
  ].join("");
}

function renderSlideSnapshots({ slides, renderDir }) {
  resetRenderDir(renderDir);

  slides.forEach((slide, index) => {
    const svg = buildSnapshotSvg({
      title: slide.headline,
      bodyLines: slide.body_lines || slide.bodyLines || [],
      slideNumber: slide.slide_number || index + 1
    });
    fs.writeFileSync(
      path.join(renderDir, `slide-${String(index + 1).padStart(2, "0")}.svg`),
      svg
    );
  });

  return {
    renderDir,
    renderCount: slides.length,
    mode: "svg_snapshot_render"
  };
}

function renderSnapshotsFromUnpacked({ unpackedRoot, renderDir }) {
  const slidesDir = path.join(unpackedRoot, "ppt", "slides");
  if (!fs.existsSync(slidesDir)) {
    return {
      renderDir,
      renderCount: 0,
      mode: "svg_snapshot_render"
    };
  }

  const slides = fs.readdirSync(slidesDir)
    .filter((name) => /^slide\d+\.xml$/i.test(name))
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }))
    .map((name, index) => {
      const xml = fs.readFileSync(path.join(slidesDir, name), "utf8");
      const lines = extractSlideText(xml);
      return {
        slide_number: index + 1,
        headline: lines[0] || `Slide ${index + 1}`,
        body_lines: lines.slice(1, 7)
      };
    });

  return renderSlideSnapshots({ slides, renderDir });
}

function runStep(command, args) {
  const result = spawnSync(command, args, { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || result.stdout.trim() || `${command} failed`);
  }
}

module.exports = {
  resetRenderDir,
  renderSlides,
  renderSlideSnapshots,
  renderSnapshotsFromUnpacked
};
