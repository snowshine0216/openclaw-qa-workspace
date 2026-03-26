"use strict";

function normalizeLine(line) {
  return String(line || "").trim();
}

function stripBullet(line) {
  return normalizeLine(line).replace(/^[-*]\s+/, "");
}

function parseManuscriptSlides(markdown) {
  const rawSections = String(markdown)
    .split(/^---$/m)
    .map((section) => section.trim())
    .filter(Boolean);
  let deckTitle = "Presentation";
  const slides = [];

  for (let index = 0; index < rawSections.length; index++) {
    const section = rawSections[index];
    const lines = section.split("\n").map(normalizeLine).filter(Boolean);
    if (lines.length === 0) {
      continue;
    }

    const slide = parseSection(lines, index);
    if (index === 0) {
      deckTitle = slide.deckTitle;
    }
    slides.push({
      title: slide.title,
      bodyLines: slide.bodyLines,
      imagePaths: slide.imagePaths,
      provenanceNotes: slide.provenanceNotes
    });
  }

  return { deckTitle, slides };
}

function parseSection(lines, index) {
  let deckTitle = "Presentation";
  let slideTitle = "";
  const bodyLines = [];
  const imagePaths = [];
  const provenanceNotes = [];
  const hasExplicitSlideTitle = lines.some((line) => /^slide title:/i.test(line));

  for (const line of lines) {
    if (line.startsWith("# ") && index === 0) {
      deckTitle = line.replace(/^#\s+/, "");
      if (hasExplicitSlideTitle) {
        continue;
      }
    }
    if (!slideTitle && line.startsWith("# ")) {
      slideTitle = line.replace(/^#\s+/, "");
      continue;
    }
    if (!slideTitle && /^slide title:/i.test(line)) {
      slideTitle = line.replace(/^slide title:\s*/i, "");
      continue;
    }

    const imageMatch = line.match(/!\[[^\]]*\]\(([^)]+)\)/);
    if (imageMatch) {
      imagePaths.push(imageMatch[1]);
      continue;
    }
    if (/^Source note:/i.test(line)) {
      provenanceNotes.push(line.replace(/^Source note:\s*/i, ""));
      continue;
    }
    if (/^Source provenance notes:/i.test(line)) {
      continue;
    }
    bodyLines.push(stripBullet(line));
  }

  if (index === 0) {
    const titleCandidate = lines.find((line) => line.startsWith("# "));
    if (titleCandidate) {
      deckTitle = titleCandidate.replace(/^#\s+/, "");
    } else if (slideTitle) {
      deckTitle = slideTitle;
    }
  }

  if (!slideTitle) {
    slideTitle = bodyLines[0] || `Slide ${index + 1}`;
  }

  return { deckTitle, title: slideTitle, bodyLines, imagePaths, provenanceNotes };
}

module.exports = {
  normalizeLine,
  stripBullet,
  parseManuscriptSlides
};
