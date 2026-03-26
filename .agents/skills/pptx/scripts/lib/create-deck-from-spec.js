"use strict";

const fs = require("fs");
const path = require("path");
const { renderSlideFromSpec } = require("./render-slide-from-spec");

async function createDeckFromSpec({
  deckTitle,
  layout = "LAYOUT_16x9",
  outputPath,
  designTokens,
  slides,
  manuscriptPath,
  pptxFactory
}) {
  if (!outputPath) {
    throw new Error("outputPath is required");
  }

  const PptxGenJS = pptxFactory || loadPptxGenJs();
  const pres = typeof PptxGenJS === "function" ? new PptxGenJS() : new PptxGenJS.default();
  pres.layout = layout;
  pres.author = "ppt-agent";
  pres.title = deckTitle;
  pres.subject = "ppt-agent create workflow";

  for (const slideEntry of slides) {
    const slide = pres.addSlide();
    renderSlideFromSpec({
      pres,
      slide,
      slideModel: slideEntry.slideModel,
      slideSpec: slideEntry.slideSpec,
      designTokens,
      manuscriptPath
    });
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  await pres.writeFile({ fileName: outputPath });
  return {
    outputPath,
    slideCount: slides.length
  };
}

function loadPptxGenJs() {
  const searchPaths = [
    path.resolve(__dirname, "..", ".."),
    path.resolve(__dirname, "..", "..", "..", "ppt-agent"),
    process.cwd()
  ];
  const resolved = require.resolve("pptxgenjs", { paths: searchPaths });
  return require(resolved);
}

module.exports = {
  createDeckFromSpec
};
