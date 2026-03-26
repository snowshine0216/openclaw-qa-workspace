"use strict";

const fs = require("fs");
const path = require("path");

function renderSlideFromSpec({
  pres,
  slide,
  slideModel,
  slideSpec,
  designTokens,
  manuscriptPath
}) {
  const layout = slideSpec.layout || "two_column";
  if (layout === "title_hero") {
    renderTitleHero({ pres, slide, slideModel, designTokens });
    return;
  }
  if (layout === "section_divider") {
    renderSectionDivider({ pres, slide, slideModel, designTokens });
    return;
  }
  if (layout === "comparison_matrix") {
    renderComparisonMatrix({ pres, slide, slideModel, designTokens });
    return;
  }
  if (layout === "process_flow") {
    renderProcessFlow({ pres, slide, slideModel, designTokens });
    return;
  }
  if (layout === "decision_grid") {
    renderDecisionGrid({ pres, slide, slideModel, designTokens });
    return;
  }
  if (layout === "closing_statement") {
    renderClosingStatement({ pres, slide, slideModel, designTokens });
    return;
  }
  if (layout === "data_panel") {
    renderDataPanel({ pres, slide, slideModel, designTokens });
    return;
  }
  renderTwoColumn({ pres, slide, slideModel, designTokens, manuscriptPath });
}

function renderTitleHero({ pres, slide, slideModel, designTokens }) {
  slide.background = { color: designTokens.title_background };
  slide.addText(slideModel.title, {
    x: 0.6, y: 1.0, w: 8.8, h: 1.0, fontFace: sansFont(designTokens), fontSize: 28, bold: true, color: "FFFFFF", margin: 0
  });
  slide.addText(slideModel.bodyLines.slice(0, 2).join("\n"), {
    x: 0.6, y: 2.1, w: 7.3, h: 1.3, fontFace: sansFont(designTokens), fontSize: 16, color: "EDEDED", margin: 0
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 4.9, w: 1.8, h: 0.12,
    line: { color: compactHex(designTokens.accent_color), transparency: 100 },
    fill: { color: compactHex(designTokens.accent_color) }
  });
}

function renderSectionDivider({ pres, slide, slideModel, designTokens }) {
  slide.background = { color: designTokens.body_background };
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 1.0, w: 0.12, h: 3.2,
    line: { color: compactHex(designTokens.accent_color), transparency: 100 },
    fill: { color: compactHex(designTokens.accent_color) }
  });
  slide.addText(slideModel.title, {
    x: 1.15, y: 1.3, w: 6.8, h: 0.8, fontFace: serifFont(designTokens), fontSize: 24, bold: true, color: "1F1F1F", margin: 0
  });
  slide.addText(slideModel.bodyLines.slice(0, 1).join("\n"), {
    x: 1.15, y: 2.25, w: 5.8, h: 0.45, fontFace: sansFont(designTokens), fontSize: 15, color: "555555", margin: 0
  });
}

function renderComparisonMatrix({ pres, slide, slideModel, designTokens }) {
  applyBodyFrame({ pres, slide, slideModel, designTokens });
  const left = slideModel.bodyLines.filter((_, index) => index % 2 === 0).slice(0, 3);
  const right = slideModel.bodyLines.filter((_, index) => index % 2 === 1).slice(0, 3);
  slide.addText("Comparison Axis A", textBox(0.95, 1.35, 3.5, 0.4, 14, true));
  slide.addText("Comparison Axis B", textBox(5.05, 1.35, 3.5, 0.4, 14, true));
  slide.addText(toBullets(left), textBox(0.95, 1.85, 3.5, 2.0, 15));
  slide.addText(toBullets(right.length > 0 ? right : left.slice(0, 2)), textBox(5.05, 1.85, 3.5, 2.0, 15));
}

function renderProcessFlow({ pres, slide, slideModel, designTokens }) {
  applyBodyFrame({ pres, slide, slideModel, designTokens });
  const steps = slideModel.bodyLines.slice(0, 3);
  steps.forEach((line, index) => {
    const x = 1 + index * 2.7;
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y: 1.8, w: 2.1, h: 1.0,
      line: { color: compactHex(designTokens.accent_color), width: 1.5 },
      fill: { color: "FFF7F2" }
    });
    slide.addText(line, textBox(x + 0.18, 2.05, 1.75, 0.5, 14, false));
    if (index < steps.length - 1) {
      slide.addShape(pres.shapes.CHEVRON, {
        x: x + 2.25, y: 2.12, w: 0.35, h: 0.3,
        line: { color: compactHex(designTokens.accent_color), transparency: 100 },
        fill: { color: compactHex(designTokens.accent_color) }
      });
    }
  });
}

function renderDecisionGrid({ pres, slide, slideModel, designTokens }) {
  applyBodyFrame({ pres, slide, slideModel, designTokens });
  slideModel.bodyLines.slice(0, 4).forEach((line, index) => {
    const x = index % 2 === 0 ? 0.95 : 5.05;
    const y = index < 2 ? 1.45 : 3.0;
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y, w: 3.4, h: 1.05,
      line: { color: compactHex(designTokens.accent_color), width: 1.25 },
      fill: { color: "FFF7F2" }
    });
    slide.addText(line, textBox(x + 0.18, y + 0.22, 3.0, 0.55, 14));
  });
}

function renderClosingStatement({ pres, slide, slideModel, designTokens }) {
  slide.background = { color: designTokens.body_background };
  slide.addText(slideModel.title, {
    x: 0.7, y: 0.9, w: 8.1, h: 0.9, fontFace: sansFont(designTokens), fontSize: 26, bold: true, color: "1F1F1F", margin: 0
  });
  slide.addText(slideModel.bodyLines.slice(0, 3).join("\n"), {
    x: 0.7, y: 2.0, w: 6.8, h: 1.8, fontFace: sansFont(designTokens), fontSize: 18, color: "1F1F1F", margin: 0
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 7.9, y: 1.0, w: 0.14, h: 3.4,
    line: { color: compactHex(designTokens.accent_color), transparency: 100 },
    fill: { color: compactHex(designTokens.accent_color) }
  });
}

function renderDataPanel({ pres, slide, slideModel, designTokens }) {
  applyBodyFrame({ pres, slide, slideModel, designTokens });
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 5.1, y: 1.35, w: 3.3, h: 2.3,
    line: { color: compactHex(designTokens.accent_color), width: 1.1 },
    fill: { color: "FFFFFF" }
  });
  slide.addText("Key Metric Panel", textBox(5.35, 1.6, 2.8, 0.35, 13, true));
  slide.addText(slideModel.bodyLines.slice(0, 2).join("\n"), textBox(0.95, 1.45, 3.5, 2.0, 15));
  slide.addText(slideModel.bodyLines.slice(2, 4).join("\n"), textBox(5.35, 2.0, 2.7, 1.1, 16));
}

function renderTwoColumn({ pres, slide, slideModel, designTokens, manuscriptPath }) {
  applyBodyFrame({ pres, slide, slideModel, designTokens });
  const existingImage = (slideModel.imagePaths || [])
    .map((imagePath) => path.resolve(path.dirname(manuscriptPath), imagePath))
    .find((candidate) => fs.existsSync(candidate));
  if (existingImage) {
    slide.addText(toBullets(slideModel.bodyLines.slice(0, 4)), textBox(0.95, 1.35, 3.5, 2.4, 15));
    slide.addImage({
      path: existingImage, x: 5.0, y: 1.2, w: 4.2, h: 2.6,
      sizing: { type: "contain", w: 4.2, h: 2.6 }
    });
    return;
  }
  slide.addText(toBullets(slideModel.bodyLines.slice(0, 5)), textBox(0.95, 1.35, 7.8, 2.8, 16));
}

function applyBodyFrame({ pres, slide, slideModel, designTokens }) {
  slide.background = { color: designTokens.body_background };
  slide.addText(slideModel.title, {
    x: 0.6, y: 0.45, w: 8.2, h: 0.7, fontFace: sansFont(designTokens), fontSize: 22, bold: true, color: "1F1F1F", margin: 0
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 0.38, w: 0.1, h: 4.6,
    line: { color: compactHex(designTokens.accent_color), transparency: 100 },
    fill: { color: compactHex(designTokens.accent_color) }
  });
}

function textBox(x, y, w, h, fontSize, bold = false) {
  return { x, y, w, h, fontFace: "Aptos", fontSize, bold, color: "1F1F1F", margin: 0 };
}

function sansFont(designTokens) {
  return designTokens.font_face_sans || "Aptos";
}

function serifFont(designTokens) {
  return designTokens.font_face_serif || designTokens.font_face_sans || "Aptos";
}

function toBullets(lines) {
  return lines.map((line, index, arr) => ({
    text: line,
    options: { bullet: true, breakLine: index < arr.length - 1 }
  }));
}

function compactHex(value) {
  return String(value || "#FA6611").replace(/^#/, "").toUpperCase();
}

module.exports = {
  renderSlideFromSpec
};
