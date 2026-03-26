"use strict";

const fs = require("fs");
const path = require("path");

const { parseManuscriptSlides, stripBullet } = require("./manuscript");
const {
  attachSourceNotes,
  normalizeSourceProvenance,
  writeSourceProvenanceArtifact
} = require("./source-provenance");

const DEFAULT_TOKENS = {
  accent_color: "#FA6611",
  title_background: "253041",
  body_background: "FFF7F2",
  text_color: "1F1F1F"
};

function buildDeckTitle(objective, prompt) {
  const source = String(objective || prompt || "Business Review").trim();
  return source
    .replace(/[.?!]+$/g, "")
    .split(/\s+/)
    .slice(0, 6)
    .join(" ");
}

function readAttachmentLines(attachments = []) {
  const valid = [];
  const invalid = [];
  for (const attachment of attachments) {
    const filePath = attachment.path || attachment;
    try {
      const content = fs.readFileSync(filePath, "utf8");
      valid.push({
        path: filePath,
        lines: content
          .split("\n")
          .map(stripBullet)
          .filter(Boolean)
      });
    } catch (error) {
      invalid.push({ path: filePath, reason: error.message });
    }
  }
  return { valid, invalid };
}

function buildSourcePool(prompt, objective, attachmentData, sourceProvenance = []) {
  const promptLines = [objective, prompt].filter(Boolean).map(stripBullet);
  const attachmentLines = attachmentData.valid.flatMap((item) => item.lines);
  const provenanceLines = normalizeSourceProvenance(sourceProvenance)
    .flatMap((entry) => [entry.title, entry.summary])
    .filter(Boolean);
  const combined = [...attachmentLines, ...provenanceLines, ...promptLines];
  return dedupe(combined.filter((line) => line.length > 4));
}

function dedupe(lines) {
  const seen = new Set();
  return lines.filter((line) => {
    const key = line.toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function selectByKeyword(lines, pattern, fallback = []) {
  const matches = lines.filter((line) => pattern.test(line));
  return matches.length > 0 ? matches : fallback;
}

function makeBodyLines(lines, fallback) {
  const chosen = dedupe([...lines, ...fallback]).slice(0, 4);
  return chosen.length > 0 ? chosen : fallback;
}

function buildSlideOutlines({ prompt, objective, audience, sourceLines }) {
  const metrics = selectByKeyword(sourceLines, /\b(revenue|margin|growth|cost|pipeline|usage|demand|quarter|q[1-4])\b/i, sourceLines.slice(0, 3));
  const risks = selectByKeyword(sourceLines, /\b(risk|delay|constraint|issue|slow|pressure|headwind)\b/i, sourceLines.slice(1, 3));
  const decisions = selectByKeyword(sourceLines, /\b(decision|decide|approve|action|next|plan|pace)\b/i, sourceLines.slice(2, 4));
  const summaryFallback = [
    objective || "Summarize the main operating outcomes and decision points.",
    audience ? `Audience: ${audience}` : "Audience: leadership team"
  ];

  return [
    {
      title: "Executive Summary",
      layout: "title_hero",
      emphasis: "summary",
      bodyLines: makeBodyLines(metrics.slice(0, 2), summaryFallback)
    },
    {
      title: "Performance Drivers",
      layout: "two_column",
      emphasis: "evidence",
      bodyLines: makeBodyLines(metrics, [
        prompt || "Summarize the business trend.",
        "Highlight the most relevant evidence available."
      ])
    },
    {
      title: "Risks",
      layout: "two_column",
      emphasis: "risk",
      bodyLines: makeBodyLines(risks, [
        "Call out the main risk to execution.",
        "Explain the likely impact on the business."
      ])
    },
    {
      title: "Decisions And Next Steps",
      layout: "decision_grid",
      emphasis: "decision",
      bodyLines: makeBodyLines(decisions, [
        "State the leadership decision required.",
        "Define the immediate next step."
      ])
    }
  ];
}

function renderManuscript({ deckTitle, slides }) {
  const sections = [`# ${deckTitle}`];
  for (const slide of slides) {
    sections.push("");
    sections.push(`Slide title: ${slide.title}`);
    for (const line of slide.bodyLines) {
      sections.push(`- ${line}`);
    }
    if ((slide.sourceNotes || []).length > 0) {
      sections.push("Source provenance notes:");
    }
    for (const note of slide.sourceNotes || []) {
      sections.push(`Source note: ${note}`);
    }
    sections.push("");
    sections.push("---");
  }
  return sections.join("\n").replace(/\n---$/, "");
}

function renderDesignPlan({ deckTitle, objective, audience, referenceStrategy, slides }) {
  const slideFamilyMap = slides.map((slide) => `- ${slide.title}: ${slide.layout}`).join("\n");
  const pagePlan = slides
    .map(
      (slide, index) =>
        `- Slide ${index + 1}: ${slide.title} | Layout: ${slide.layout} | Emphasis: ${slide.emphasis}`
    )
    .join("\n");
  return [
    `# Design Plan: ${deckTitle}`,
    "",
    "## Brief",
    `- Audience: ${audience || "Leadership"}`,
    `- Objective: ${objective || deckTitle}`,
    `- Reference strategy: ${referenceStrategy || "none"}`,
    "",
    "## Color System",
    `- Accent color: ${DEFAULT_TOKENS.accent_color}`,
    `- Primary text: #${DEFAULT_TOKENS.text_color}`,
    `- Body surface: #${DEFAULT_TOKENS.body_background}`,
    "",
    "## Typography Direction",
    "- Headline / labels: crisp business sans-serif",
    "- Accent moments: restrained serif accent only when needed",
    "- Body support text: disciplined sans-serif hierarchy",
    "",
    "## Visual Motif Rules",
    "- Tone: restrained business deck",
    "- Minimal text: yes",
    "- Layout target: LAYOUT_16x9",
    "- Visual anchors: charts, comparisons, process flows, and annotated evidence before decorative imagery",
    "",
    "## Slide Family Map",
    slideFamilyMap,
    "",
    "## Page-by-Page Layout Plan",
    pagePlan,
    "",
    "## Business Style Contract Confirmation",
    "- Business-oriented presentation: yes",
    "- Analytical visuals first: yes",
    "- Accent color locked to #FA6611: yes",
    "- Minimal text discipline: yes"
  ].join("\n");
}

function parseDesignPlan(markdown) {
  const content = String(markdown);
  return {
    accentColor: matchValue(content, /Accent color:\s*(#[0-9A-Fa-f]{6})/),
    tone: matchValue(content, /Tone:\s*(.+)/),
    minimalText: /Minimal text:\s*yes/i.test(content),
    layoutTarget: matchValue(content, /Layout target:\s*(.+)/)
  };
}

function matchValue(content, pattern) {
  const match = content.match(pattern);
  return match ? match[1].trim() : null;
}

function createStructuredSlideSpec({ manuscriptMarkdown, designPlanMarkdown, referenceStrategy }) {
  const manuscript = parseManuscriptSlides(manuscriptMarkdown);
  const designPlan = parseDesignPlan(designPlanMarkdown);
  const slides = manuscript.slides.map((slide, index) => ({
    slide_number: index + 1,
    title: slide.title,
    layout: inferLayout(slide.title, index),
    emphasis: inferEmphasis(slide.title),
    bullet_count: slide.bodyLines.length,
    body_lines: slide.bodyLines,
    provenanceNotes: slide.provenanceNotes || []
  }));

  return {
    deck_title: manuscript.deckTitle,
    build_path: "new_deck_generation",
    reference_strategy: referenceStrategy || "none",
    design_tokens: {
      ...DEFAULT_TOKENS,
      accent_color: designPlan.accentColor || DEFAULT_TOKENS.accent_color
    },
    design_summary: {
      tone: designPlan.tone || "restrained business deck",
      minimal_text: designPlan.minimalText !== false,
      layout_target: designPlan.layoutTarget || "LAYOUT_16x9"
    },
    slides: slides.map((slide) => ({
      ...slide,
      provenance_note_count: slide.provenanceNotes.length
    }))
  };
}

function inferLayout(title, index) {
  if (index === 0 || /summary/i.test(title)) {
    return "title_hero";
  }
  if (/risk/i.test(title)) {
    return "two_column";
  }
  if (/decision|next step/i.test(title)) {
    return "decision_grid";
  }
  return "two_column";
}

function inferEmphasis(title) {
  if (/risk/i.test(title)) {
    return "risk";
  }
  if (/decision|next step/i.test(title)) {
    return "decision";
  }
  if (/summary/i.test(title)) {
    return "summary";
  }
  return "evidence";
}

function writeGeneratedArtifacts({
  runRoot,
  prompt,
  objective,
  audience,
  attachments = [],
  referenceStrategy,
  sourceProvenance = []
}) {
  const attachmentData = readAttachmentLines(attachments);
  const sourceLines = buildSourcePool(prompt, objective, attachmentData, sourceProvenance);
  const deckTitle = buildDeckTitle(objective, prompt);
  const slides = attachSourceNotes(
    buildSlideOutlines({ prompt, objective, audience, sourceLines }),
    sourceProvenance
  );
  const manuscriptMarkdown = renderManuscript({ deckTitle, slides });
  const designPlanMarkdown = renderDesignPlan({
    deckTitle,
    objective,
    audience,
    referenceStrategy,
    slides
  });

  const manuscriptPath = path.join(runRoot, "artifacts", "manuscript.md");
  const designPlanPath = path.join(runRoot, "artifacts", "design_plan.md");
  fs.writeFileSync(manuscriptPath, manuscriptMarkdown);
  fs.writeFileSync(designPlanPath, designPlanMarkdown);
  writeSourceProvenanceArtifact({
    runRoot,
    attachmentData,
    sourceProvenance
  });

  return {
    manuscriptPath,
    designPlanPath,
    manuscriptMarkdown,
    designPlanMarkdown
  };
}

module.exports = {
  DEFAULT_TOKENS,
  parseDesignPlan,
  createStructuredSlideSpec,
  writeGeneratedArtifacts
};
