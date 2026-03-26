"use strict";

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const STYLE_LAYOUT_MAP = {
  title: "title_hero",
  comparison: "comparison_matrix",
  process: "process_flow",
  closing: "closing_statement",
  decision: "decision_grid",
  data: "data_panel",
  section: "section_divider",
  content: "two_column"
};

function analyzeReferences({ references = [], preferredReferenceMode } = {}) {
  const readableReferences = [];
  const unreadableReferences = [];
  const styleSignals = [];
  const structureSignals = [];

  for (const reference of references) {
    const filePath = reference.path || reference;
    try {
      const extracted = extractReferenceContent(path.resolve(filePath));
      readableReferences.push({
        path: filePath,
        sourceFormat: extracted.sourceFormat,
        extractedLineCount: extracted.lines.length,
        extractionWarnings: extracted.warnings
      });
      styleSignals.push(extractStyleSignals(extracted.content));
      structureSignals.push(extractStructureSignals(extracted.content));
    } catch (error) {
      unreadableReferences.push({ path: filePath, reason: error.message });
    }
  }

  const styleInfluence = mergeStyleSignals(styleSignals);
  const structureInfluence = mergeStructureSignals(structureSignals);
  const strategy = resolveStrategy({
    preferredReferenceMode,
    hasStyle: hasStyleInfluence(styleInfluence),
    hasStructure: hasStructureInfluence(structureInfluence)
  });

  return {
    strategy,
    styleInfluence,
    structureInfluence,
    readableReferences,
    unreadableReferences,
    warnings: unreadableReferences.map((entry) => `Reference unreadable: ${entry.path}`)
  };
}

function writeReferenceAnalysisArtifact({ runRoot, analysis }) {
  const outputPath = path.join(runRoot, "artifacts", "reference-analysis.json");
  fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2));
  return { outputPath, analysis };
}

function extractReferenceContent(filePath) {
  const sourceFormat = path.extname(filePath).toLowerCase() === ".pptx" ? "pptx" : "text";
  return sourceFormat === "pptx"
    ? extractPptxReference(filePath)
    : extractTextReference(filePath);
}

function extractTextReference(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  return {
    sourceFormat: "text",
    content,
    lines: content.split("\n").map((line) => line.trim()).filter(Boolean),
    warnings: []
  };
}

function extractPptxReference(filePath) {
  const entries = listZipEntries(filePath);
  const slideEntries = entries
    .filter((entry) => /^ppt\/slides\/slide\d+\.xml$/i.test(entry))
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));
  const themeEntry = entries.find((entry) => /^ppt\/theme\/theme\d+\.xml$/i.test(entry));
  const slideLines = slideEntries.flatMap((entry) => extractSlideText(readZipEntry(filePath, entry)));
  const accentColor = themeEntry ? extractThemeAccentColor(readZipEntry(filePath, themeEntry)) : null;
  const prelude = accentColor ? [`Accent color: ${accentColor}`] : [];
  return {
    sourceFormat: "pptx",
    content: [...prelude, ...slideLines].join("\n"),
    lines: [...prelude, ...slideLines],
    warnings: slideLines.length === 0 ? ["No extractable slide text found in PPTX reference."] : []
  };
}

function listZipEntries(filePath) {
  return execFileSync("unzip", ["-Z1", filePath], { encoding: "utf8" })
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function readZipEntry(filePath, entry) {
  return execFileSync("unzip", ["-p", filePath, entry], { encoding: "utf8" });
}

function extractSlideText(xml) {
  return Array.from(String(xml).matchAll(/<a:t[^>]*>([\s\S]*?)<\/a:t>/g))
    .map((match) => unescapeXml(match[1]))
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function extractThemeAccentColor(xml) {
  const match = String(xml).match(/<a:accent1>\s*<a:srgbClr val="([0-9A-Fa-f]{6})"/i);
  return match ? `#${match[1].toUpperCase()}` : null;
}

function unescapeXml(value) {
  return String(value)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

function extractStyleSignals(content) {
  return {
    accentColor: matchValue(content, /Accent color:\s*(#[0-9A-Fa-f]{6})/i) || firstColor(content),
    typographyMood:
      matchValue(content, /Typography:\s*(.+)/i) || inferTypographyMood(content),
    compositionDiscipline: matchValue(content, /Composition:\s*(.+)/i) || ""
  };
}

function extractStructureSignals(content) {
  const sequence = [];
  for (const line of String(content).split("\n")) {
    const family = inferSlideFamily(line);
    if (family && !sequence.includes(family)) {
      sequence.push(family);
    }
  }
  return {
    slideFamilySequence: sequence,
    layoutArchetypes: sequence.map((family) => STYLE_LAYOUT_MAP[family] || "two_column")
  };
}

function mergeStyleSignals(signals) {
  const first = signals.find(Boolean) || {};
  return {
    accentColor: firstDefined(signals, "accentColor") || null,
    typographyMood: firstDefined(signals, "typographyMood") || "",
    compositionDiscipline: firstDefined(signals, "compositionDiscipline") || ""
  };
}

function mergeStructureSignals(signals) {
  const slideFamilySequence = [];
  const layoutArchetypes = [];
  for (const signal of signals) {
    for (const family of signal.slideFamilySequence || []) {
      if (!slideFamilySequence.includes(family)) {
        slideFamilySequence.push(family);
      }
    }
    for (const layout of signal.layoutArchetypes || []) {
      if (!layoutArchetypes.includes(layout)) {
        layoutArchetypes.push(layout);
      }
    }
  }
  return { slideFamilySequence, layoutArchetypes };
}

function resolveStrategy({ preferredReferenceMode, hasStyle, hasStructure }) {
  if (preferredReferenceMode) {
    return preferredReferenceMode;
  }
  if (hasStyle && hasStructure) {
    return "style_and_structure";
  }
  if (hasStyle) {
    return "style";
  }
  if (hasStructure) {
    return "structure";
  }
  return "none";
}

function hasStyleInfluence(styleInfluence) {
  return Boolean(
    styleInfluence.accentColor ||
      styleInfluence.typographyMood ||
      styleInfluence.compositionDiscipline
  );
}

function hasStructureInfluence(structureInfluence) {
  return (structureInfluence.slideFamilySequence || []).length > 0;
}

function inferSlideFamily(line) {
  const normalized = String(line || "").toLowerCase();
  if (/title|opening|summary|hero|context/.test(normalized)) return "title";
  if (/comparison|compare|matrix/.test(normalized)) return "comparison";
  if (/process|workflow|timeline|rollout/.test(normalized)) return "process";
  if (/decision|recommendation|closing|next step/.test(normalized)) return "closing";
  if (/data|metric|chart|table/.test(normalized)) return "data";
  if (/section/.test(normalized)) return "section";
  if (/content|analysis|evidence|market/.test(normalized)) return "content";
  return null;
}

function inferTypographyMood(content) {
  if (/serif/i.test(content) && /sans/i.test(content)) {
    return "crisp sans with restrained serif accents";
  }
  if (/serif/i.test(content)) {
    return "restrained serif accent";
  }
  return "";
}

function firstDefined(signals, key) {
  for (const signal of signals) {
    if (signal && signal[key]) {
      return signal[key];
    }
  }
  return null;
}

function firstColor(content) {
  const match = String(content).match(/#[0-9A-Fa-f]{6}/);
  return match ? match[0].toUpperCase() : null;
}

function matchValue(content, pattern) {
  const match = String(content).match(pattern);
  return match ? match[1].trim() : null;
}

module.exports = {
  STYLE_LAYOUT_MAP,
  analyzeReferences,
  inferSlideFamily,
  writeReferenceAnalysisArtifact
};
