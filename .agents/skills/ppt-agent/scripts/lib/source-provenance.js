"use strict";

const fs = require("fs");
const path = require("path");

function normalizeSourceProvenance(entries = []) {
  return entries
    .map((entry) => (typeof entry === "string" ? { title: entry } : entry || {}))
    .map((entry) => ({
      title: String(entry.title || "").trim(),
      locator: String(entry.locator || "").trim(),
      summary: String(entry.summary || "").trim(),
      source_type: normalizeSourceType(entry.source_type, entry.locator)
    }))
    .filter((entry) => entry.title || entry.locator || entry.summary);
}

function normalizeSourceType(value, locator = "") {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized) {
    return normalized;
  }
  if (/^https?:\/\//i.test(locator)) {
    return "external_web";
  }
  if (/^\//.test(locator)) {
    return "local_file";
  }
  return "unknown";
}

function hasSourceProvenance(entries = []) {
  return normalizeSourceProvenance(entries).length > 0;
}

function attachSourceNotes(slides, entries = []) {
  const normalized = normalizeSourceProvenance(entries);
  if (normalized.length === 0 || slides.length === 0) {
    return slides;
  }

  return slides.map((slide, index) =>
    index === 0
      ? {
          ...slide,
          sourceNotes: normalized.map(formatSourceNote)
        }
      : slide
  );
}

function formatSourceNote(entry, index) {
  const label = `[${index + 1}]`;
  const parts = [entry.title, entry.locator, entry.summary].filter(Boolean);
  return `${label} ${parts.join(" | ")}`;
}

function buildSourceProvenanceLines(entries = []) {
  const normalized = normalizeSourceProvenance(entries);
  if (normalized.length === 0) {
    return [];
  }

  return ["Source provenance notes:", ...normalized.map(formatSourceNote)];
}

function writeSourceProvenanceArtifact({
  runRoot,
  attachmentData,
  sourceProvenance = []
}) {
  const outputPath = path.join(runRoot, "artifacts", "source-provenance.json");
  const payload = {
    valid_sources: attachmentData.valid.map((item) => item.path),
    unreadable_sources: attachmentData.invalid,
    generated_from_prompt_only: attachmentData.valid.length === 0,
    entries: normalizeSourceProvenance(sourceProvenance)
  };
  fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2));
  return { outputPath, payload };
}

module.exports = {
  attachSourceNotes,
  buildSourceProvenanceLines,
  hasSourceProvenance,
  normalizeSourceProvenance,
  writeSourceProvenanceArtifact
};
