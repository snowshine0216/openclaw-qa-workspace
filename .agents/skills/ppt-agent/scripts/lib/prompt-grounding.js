"use strict";

const path = require("path");

const GENERIC_TOKENS = new Set([
  "about",
  "adoption",
  "analysis",
  "build",
  "current",
  "deck",
  "for",
  "from",
  "into",
  "landscape",
  "market",
  "presentation",
  "recommendation",
  "report",
  "risks",
  "slide",
  "slides",
  "summarize",
  "summary",
  "the",
  "with"
]);

function assessPromptOnlyGrounding({ prompt, objective, sourceProvenance = [] }) {
  if (sourceProvenance.length === 0) {
    return fail("Prompt-only request requires inspectable source provenance for Phase 1.");
  }

  const invalidEntries = sourceProvenance.filter((entry) => !isInspectableEntry(entry));
  if (invalidEntries.length > 0) {
    return fail("Prompt-only request requires inspectable source provenance entries.");
  }

  const topicTokens = extractTopicTokens(`${prompt || ""} ${objective || ""}`);
  if (topicTokens.length === 0) {
    return fail("Prompt-only request is not grounded enough for Phase 1.");
  }

  const supported = sourceProvenance.some((entry) => supportsTopic(entry, topicTokens));
  if (!supported) {
    return fail("Prompt-only request is not grounded in relevant supporting sources.");
  }

  return { ok: true };
}

function fail(reason) {
  return { ok: false, reason };
}

function isInspectableEntry(entry) {
  if (!entry || !isInspectableLocator(entry.locator || "")) {
    return false;
  }
  return String(entry.title || "").trim().length > 0 && String(entry.summary || "").trim().length >= 20;
}

function isInspectableLocator(locator) {
  if (/^https?:\/\//i.test(locator)) {
    return true;
  }
  if (path.isAbsolute(locator)) {
    return true;
  }
  return false;
}

function supportsTopic(entry, topicTokens) {
  const sourceTokens = new Set(extractTopicTokens(`${entry.title || ""} ${entry.summary || ""}`));
  let overlap = 0;
  for (const token of topicTokens) {
    if (sourceTokens.has(token)) {
      overlap += 1;
    }
  }
  return overlap >= Math.min(2, topicTokens.length);
}

function extractTopicTokens(text) {
  return Array.from(new Set(
    String(text)
      .toLowerCase()
      .match(/[a-z0-9]{4,}/g) || []
  )).filter((token) => !GENERIC_TOKENS.has(token));
}

module.exports = {
  assessPromptOnlyGrounding
};
