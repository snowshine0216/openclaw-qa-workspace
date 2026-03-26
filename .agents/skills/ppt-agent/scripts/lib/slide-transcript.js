"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const TAVILY_SEARCH_SCRIPT = path.resolve(
  __dirname,
  "..",
  "..",
  "..",
  "tavily-search",
  "scripts",
  "search.mjs"
);

const VISUAL_ROLES = new Set([
  "agenda",
  "section_divider",
  "hero",
  "explainer",
  "process",
  "comparison",
  "evidence",
  "qa",
  "appendix"
]);

const IMAGE_STRATEGIES = new Set([
  "forbid",
  "preserve",
  "refine",
  "replace",
  "generate_new",
  "optional"
]);

function isTextSafeVisualFallback({ visualRole, layout }) {
  if (["process", "evidence"].includes(visualRole)) {
    return false;
  }
  if (["process_flow", "data_panel"].includes(normalizeText(layout).toLowerCase())) {
    return false;
  }
  return true;
}

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function slugify(value) {
  return normalizeText(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function unique(values) {
  return Array.from(new Set((values || []).filter(Boolean)));
}

function loadJsonIfExists(filePath, fallback = null) {
  if (!filePath || !fs.existsSync(filePath)) {
    return fallback;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function determineVisualRole({ title, role, layout, visualAssets = [] }) {
  const normalizedTitle = normalizeText(title).toLowerCase();
  const normalizedRole = normalizeText(role).toLowerCase();
  const normalizedLayout = normalizeText(layout).toLowerCase();
  const assets = visualAssets.map((asset) => normalizeText(asset).toLowerCase());

  if (/\b(agenda|table of contents|contents|toc)\b/.test(normalizedTitle)) {
    return "agenda";
  }
  if (/\b(appendix|backup)\b/.test(normalizedTitle)) {
    return "appendix";
  }
  if (/\b(section|divider)\b/.test(normalizedTitle) || normalizedRole === "title") {
    return "section_divider";
  }
  if (normalizedRole === "process" || /process|workflow|timeline|rollout/.test(normalizedTitle) || normalizedLayout.includes("process")) {
    return "process";
  }
  if (normalizedRole === "comparison" || normalizedLayout.includes("comparison") || /compare|comparison|matrix/.test(normalizedTitle)) {
    return "comparison";
  }
  if (normalizedRole === "data" || assets.includes("chart") || /\b(metric|evidence|result|proof|performance|revenue)\b/.test(normalizedTitle)) {
    return "evidence";
  }
  if (/\b(q&a|qa|questions)\b/.test(normalizedTitle)) {
    return "qa";
  }
  if (normalizedLayout.includes("hero") || /\b(summary|overview|executive summary|hero)\b/.test(normalizedTitle)) {
    return "hero";
  }
  return "explainer";
}

function defaultImageStrategy({ mode, visualRole, hasExistingMedia, layoutSeed, layoutSeedHasMedia = false }) {
  if (["agenda", "section_divider", "appendix"].includes(visualRole)) {
    return "forbid";
  }
  if (mode === "edit") {
    if (hasExistingMedia) {
      return "preserve";
    }
    if (/^duplicate_slide:\d+$/.test(String(layoutSeed || "")) && layoutSeedHasMedia) {
      return "preserve";
    }
    return "generate_new";
  }
  return ["hero", "explainer", "process", "comparison", "evidence", "qa"].includes(visualRole)
    ? "generate_new"
    : "optional";
}

function defaultKeepImageStrategy(slide) {
  const visualRole = slide.visual_role || determineVisualRole({
    title: slide.headline,
    role: slide.role,
    visualAssets: slide.visual_assets
  });
  if (["agenda", "section_divider", "appendix"].includes(visualRole)) {
    return "forbid";
  }
  return (slide.source_media_refs || []).length > 0 ? "preserve" : "optional";
}

function validateVisualContract({ visualRole, imageStrategy, action }) {
  if (!VISUAL_ROLES.has(visualRole)) {
    throw new Error(`Unsupported visual_role "${visualRole}"`);
  }
  if (!IMAGE_STRATEGIES.has(imageStrategy)) {
    throw new Error(`Unsupported image_strategy "${imageStrategy}"`);
  }
  if (visualRole === "agenda" && imageStrategy === "generate_new") {
    throw new Error("Agenda slides cannot request generated imagery");
  }
  if (action === "keep" && imageStrategy !== "preserve" && imageStrategy !== "forbid" && imageStrategy !== "optional") {
    throw new Error("Keep actions must not request disruptive image changes");
  }
}

function buildDeckGroundingQuery({ request, slides }) {
  const base = normalizeText(
    request.change_request || request.prompt || request.objective || slides.map((slide) => slide.headline || slide.title).slice(0, 3).join(" ")
  );
  return base || "business presentation background context";
}

function parseTavilyMarkdown(markdown) {
  const text = String(markdown || "");
  const answerMatch = text.match(/## Answer\s+([\s\S]*?)\n---/);
  const answer = answerMatch ? normalizeText(answerMatch[1]) : "";
  const results = Array.from(text.matchAll(/- \*\*(.+?)\*\*(?:\s+\(relevance: (\d+)%\))?\n\s+(https?:\/\/\S+)/g)).map(
    (match) => ({
      title: normalizeText(match[1]),
      relevance: match[2] ? Number(match[2]) : null,
      url: normalizeText(match[3])
    })
  );
  return {
    status: results.length > 0 || answer ? "ok" : "empty",
    answer,
    results
  };
}

function runDeckGroundingSearch({ runRoot, request, slides }) {
  const cachePath = path.join(runRoot, "artifacts", "deck-grounding.json");
  const cached = loadJsonIfExists(cachePath);
  if (cached) {
    return cached;
  }

  const query = buildDeckGroundingQuery({ request, slides });
  if (!fs.existsSync(TAVILY_SEARCH_SCRIPT)) {
    return {
      query,
      status: "unavailable",
      answer: "",
      results: [],
      error: "Tavily search script is unavailable"
    };
  }

  try {
    const result = spawnSync("node", [TAVILY_SEARCH_SCRIPT, query, "-n", "5"], {
      encoding: "utf8",
      timeout: 20000
    });
    if (result.status !== 0) {
      return {
        query,
        status: "error",
        answer: "",
        results: [],
        error: normalizeText(result.stderr || result.stdout || "Tavily search failed")
      };
    }
    const parsed = {
      query,
      ...parseTavilyMarkdown(result.stdout)
    };
    fs.writeFileSync(cachePath, JSON.stringify(parsed, null, 2));
    return parsed;
  } catch (error) {
    return {
      query,
      status: "error",
      answer: "",
      results: [],
      error: error.message
    };
  }
}

function deriveSpeakerNotesLabel(slide) {
  if (slide.speaker_notes_text) {
    return slide.speaker_notes_text;
  }
  return "none present in source deck";
}

function deriveSourceNotes(slide) {
  if (slide.notes_text) {
    return slide.notes_text;
  }
  return "none present in source deck";
}

function summarizeGrounding({ request, slide, searchResult, attachmentSummary }) {
  const sources = ["user_request"];
  if (normalizeText(slide.headline) || (slide.body_lines || []).length > 0) {
    sources.push("source_deck");
  }
  if (normalizeText(attachmentSummary)) {
    sources.push("attachments");
  }
  if ((searchResult.results || []).length > 0 || normalizeText(searchResult.answer)) {
    sources.push("tavily");
  }
  return unique(sources);
}

function hasEnoughGrounding({ request, slide, searchResult, attachmentSummary }) {
  const hasRequest = Boolean(normalizeText(request.change_request || request.prompt || request.objective));
  const hasSource = Boolean(normalizeText(slide.headline) || (slide.body_lines || []).some((line) => normalizeText(line)));
  const hasAttachmentSummary = Boolean(normalizeText(attachmentSummary));
  const hasSearch = (searchResult.results || []).length > 0 || Boolean(normalizeText(searchResult.answer));
  return hasRequest && (hasSource || hasAttachmentSummary || hasSearch);
}

function buildTranscriptMarkdown(entry) {
  const facts = entry.background_facts_used.length > 0
    ? entry.background_facts_used.map((fact) => `- ${fact}`).join("\n")
    : "- none";

  return [
    `# Slide ${entry.transcript_number}: ${entry.title}`,
    "",
    `- Slide number: ${entry.transcript_number}`,
    `- Source slide number: ${entry.source_slide_number || "new"}`,
    `- Image policy: ${entry.image_strategy}`,
    `- Image asset path: ${entry.image_asset_path || "none"}`,
    `- Grounding sources: ${entry.grounding_sources.join(", ") || "none"}`,
    `- Action summary: ${entry.action_summary}`,
    `- Preservation summary: ${entry.preservation_summary}`,
    "",
    "## Body Text",
    entry.body_text || "No body text available.",
    "",
    "## Transcript Grounding Summary",
    entry.grounding_summary,
    "",
    "## Background Facts Used From Tavily Search",
    facts,
    "",
    "## Source Notes / Provenance",
    entry.source_notes,
    "",
    "## Speaker Notes",
    entry.speaker_notes,
    ""
  ].join("\n");
}

function buildFinalSlideEntries({ slideAnalysis, updatePlan }) {
  const slidesByNumber = new Map((slideAnalysis.slides || []).map((slide) => [slide.slide_number, slide]));
  const actionsByNumber = new Map((updatePlan.slide_actions || []).map((action) => [action.slide_number, action]));
  const additiveByAnchor = new Map();

  (updatePlan.slide_actions || []).forEach((action) => {
    if (!["add_after", "split"].includes(action.action)) {
      return;
    }
    const anchor = action.after_slide_number || action.source_slide_number || action.slide_number;
    const existing = additiveByAnchor.get(anchor) || [];
    existing.push(action);
    additiveByAnchor.set(anchor, existing);
  });

  const ordered = [];
  const slides = [...(slideAnalysis.slides || [])].sort((left, right) => left.slide_number - right.slide_number);
  slides.forEach((slide) => {
    const action = actionsByNumber.get(slide.slide_number) || {
      slide_number: slide.slide_number,
      action: "keep",
      reason: "slide remains unchanged",
      image_strategy: defaultKeepImageStrategy(slide)
    };

    if (!["remove", "merge"].includes(action.action)) {
      ordered.push({
        kind: "existing",
        action,
        slide
      });
    }

    const additive = additiveByAnchor.get(slide.slide_number) || [];
    additive.forEach((nextAction) => {
      ordered.push({
        kind: "synthetic",
        action: nextAction,
        slide: slidesByNumber.get(nextAction.source_slide_number || slide.slide_number) || slide
      });
    });
  });

  return ordered;
}

function ensureTranscriptArtifacts({
  runRoot,
  request,
  slideAnalysis,
  updatePlan,
  researchDeltaText = "",
  mode = "edit",
  searchProvider = runDeckGroundingSearch
}) {
  const transcriptsDir = path.join(runRoot, "artifacts", "slide-transcripts");
  fs.rmSync(transcriptsDir, { recursive: true, force: true });
  fs.mkdirSync(transcriptsDir, { recursive: true });

  const orderedEntries = buildFinalSlideEntries({ slideAnalysis, updatePlan });
  const searchResult = searchProvider({
    runRoot,
    request,
    slides: orderedEntries.map((entry) => entry.slide)
  });
  const attachmentSummary = normalizeText(researchDeltaText).slice(0, 400);
  const transcripts = [];
  const missingContext = [];

  orderedEntries.forEach((entry, index) => {
    const slide = entry.slide || {};
    const action = entry.action || {};
    const title = slide.headline || slide.title || `Slide ${index + 1}`;
    const visualRole = action.visual_role || slide.visual_role || determineVisualRole({
      title,
      role: slide.role,
      layout: action.layout_seed,
      visualAssets: slide.visual_assets
    });
    const sourceMediaRefs = action.source_media_refs || slide.source_media_refs || [];
    const imageStrategy = action.image_strategy || (action.action === "keep"
      ? defaultKeepImageStrategy(slide)
      : defaultImageStrategy({
          mode,
          visualRole,
          hasExistingMedia: sourceMediaRefs.length > 0,
          layoutSeed: action.layout_seed
        }));
    validateVisualContract({
      visualRole,
      imageStrategy,
      action: action.action || "keep"
    });

    if (!hasEnoughGrounding({ request, slide, searchResult, attachmentSummary })) {
      missingContext.push({
        slide_number: index + 1,
        title,
        missing: ["source detail or verifiable background context"]
      });
      return;
    }

    const transcriptNumber = index + 1;
    const transcriptRelativePath = `artifacts/slide-transcripts/slide-${String(transcriptNumber).padStart(2, "0")}.md`;
    const transcriptPath = path.join(runRoot, transcriptRelativePath);
    const backgroundFacts = (searchResult.results || []).slice(0, 3).map((item) => `${item.title} (${item.url})`);
    const groundingSources = summarizeGrounding({ request, slide, searchResult, attachmentSummary });
    const imageAssetPath =
      action.replacement_preview_path ||
      (sourceMediaRefs[0] ? sourceMediaRefs[0].target || sourceMediaRefs[0].relationship_id : "") ||
      slide.image_path ||
      "";

    const transcriptEntry = {
      transcript_number: transcriptNumber,
      source_slide_number: action.source_slide_number || slide.slide_number || null,
      title,
      body_text: [title, ...(slide.body_lines || [])].filter(Boolean).join("\n"),
      grounding_sources: groundingSources,
      grounding_summary: `Grounded from ${groundingSources.join(", ")}.`,
      background_facts_used: backgroundFacts,
      image_strategy: imageStrategy,
      image_asset_path: imageAssetPath,
      source_notes: deriveSourceNotes(slide),
      speaker_notes: deriveSpeakerNotesLabel(slide),
      action_summary: action.reason || "No action summary recorded",
      preservation_summary:
        mode === "edit"
          ? action.image_rationale || "Preservation behavior follows the slide contract."
          : "Create-mode visual contract applied.",
      transcript_path: transcriptRelativePath,
      visual_role: visualRole,
      tavily: {
        status: searchResult.status,
        query: searchResult.query || "",
        error: searchResult.error || ""
      }
    };

    fs.writeFileSync(transcriptPath, buildTranscriptMarkdown(transcriptEntry));
    transcripts.push(transcriptEntry);
  });

  const indexArtifact = {
    status: missingContext.length > 0 ? "needs_context" : "ready",
    mode,
    deck_grounding: searchResult,
    transcripts,
    missing_context: missingContext
  };
  const transcriptIndexPath = path.join(runRoot, "artifacts", "transcript-index.json");
  fs.writeFileSync(transcriptIndexPath, JSON.stringify(indexArtifact, null, 2));

  return {
    status: indexArtifact.status,
    transcriptIndexPath,
    transcriptsDir,
    transcripts,
    missingContext
  };
}

module.exports = {
  defaultImageStrategy,
  determineVisualRole,
  ensureTranscriptArtifacts,
  isTextSafeVisualFallback,
  runDeckGroundingSearch,
  validateVisualContract
};
