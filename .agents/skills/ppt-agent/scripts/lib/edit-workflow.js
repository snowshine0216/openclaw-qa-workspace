"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const { analyzeDeck } = require("./deck-analysis");
const { summarizeDoc } = require("./document-summary");
const {
  detectResumeStage,
  findLatestCompatibleRun,
  initRunState,
  updateManifest
} = require("./run-manifest");
const { appendEvent, writeOperatorSummary, writeStageStatus } = require("./run-logging");
const {
  defaultImageStrategy,
  determineVisualRole,
  ensureTranscriptArtifacts
} = require("./slide-transcript");
const { validateUpdatePlanObject } = require("./update-plan");

function hashBuffer(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function hashFile(filePath) {
  return hashBuffer(fs.readFileSync(filePath));
}

function hashChangeRequest(changeRequest, attachments) {
  const hash = crypto.createHash("sha256");
  hash.update(changeRequest);
  attachments.forEach((filePath) => {
    hash.update(filePath);
    hash.update(fs.readFileSync(filePath));
  });
  return hash.digest("hex");
}

function normalizeEditRequest({ deck, changeRequest, attachments = [], restyle = "none" }) {
  if (!deck || !fs.existsSync(deck)) {
    throw new Error("Source deck is missing or unreadable");
  }
  if (!String(changeRequest || "").trim()) {
    throw new Error("A change request is required");
  }
  const normalizedAttachments = attachments.map((filePath) => path.resolve(filePath));
  normalizedAttachments.forEach((filePath) => {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Attachment not found: ${filePath}`);
    }
  });

  return {
    deck: path.resolve(deck),
    change_request: String(changeRequest).trim(),
    attachments: normalizedAttachments,
    restyle_mode: restyle || "none",
    style_preservation_mode: "preserve"
  };
}

function initializeEditWorkflow({ rootDir, deck, changeRequest, attachments = [], restyle = "none" }) {
  const request = normalizeEditRequest({ deck, changeRequest, attachments, restyle });
  const sourceDeckHash = hashFile(request.deck);
  const changeFingerprintHash = hashChangeRequest(request.change_request, request.attachments);
  const desired = {
    phase: "edit",
    source_deck_hash: sourceDeckHash,
    change_fingerprint_hash: changeFingerprintHash,
    style_preservation_mode: request.style_preservation_mode,
    restyle_mode: request.restyle_mode,
    style_contract_version: "v1"
  };
  const compatibleRun = findLatestCompatibleRun(rootDir, desired);
  const { runRoot, manifest, resumed, resumeStage } = compatibleRun
    ? {
        runRoot: compatibleRun.runRoot,
        manifest: compatibleRun.manifest,
        resumed: true,
        resumeStage: detectResumeStage(compatibleRun.runRoot)
      }
    : {
        ...initRunState({
          rootDir,
          phase: "edit",
          sourceDeckHash,
          changeFingerprintHash,
          stylePreservationMode: request.style_preservation_mode,
          restyleMode: request.restyle_mode
        }),
        resumed: false,
        resumeStage: "analyze"
      };

  fs.writeFileSync(
    path.join(runRoot, "input", "edit_brief.json"),
    JSON.stringify(request, null, 2)
  );
  fs.writeFileSync(
    path.join(runRoot, "input", "source_deck.json"),
    JSON.stringify(
      {
        source_path: request.deck,
        source_deck_hash: sourceDeckHash
      },
      null,
      2
    )
  );
  fs.writeFileSync(
    path.join(runRoot, "input", "change_sources.json"),
    JSON.stringify(
      {
        attachments: request.attachments,
        change_fingerprint_hash: changeFingerprintHash
      },
      null,
      2
    )
  );

  return {
    runRoot,
    manifest,
    request,
    resumed,
    resumeStage
  };
}

async function writeResearchDelta({ runRoot, request }) {
  const summariesDir = path.join(runRoot, "working", "summaries");
  fs.mkdirSync(summariesDir, { recursive: true });
  const summaryBlocks = [];

  for (const attachment of request.attachments) {
    const outputPath = path.join(summariesDir, `${path.basename(attachment)}.md`);
    await summarizeDoc(attachment, outputPath);
    summaryBlocks.push(fs.readFileSync(outputPath, "utf8"));
  }

  const delta = [
    "# Research Delta",
    "",
    "## Requested Change",
    "",
    `- ${request.change_request}`,
    "",
    "## Findings",
    "",
    ...deriveFindings(request.change_request),
    "",
    "## Source Summaries",
    "",
    ...(summaryBlocks.length > 0 ? summaryBlocks : ["No usable new source material"]),
    ""
  ].join("\n");

  const researchDeltaPath = path.join(runRoot, "artifacts", "research_delta.md");
  fs.writeFileSync(researchDeltaPath, delta);
  return researchDeltaPath;
}

function deriveFindings(changeRequest) {
  const lower = changeRequest.toLowerCase();
  const findings = [];
  if (/\b(refresh|update|revise|tighten)\b/.test(lower)) {
    findings.push("- Existing factual content should be refreshed where stale metrics or dates are present.");
  }
  if (/\b(add|new slide|insert)\b/.test(lower)) {
    findings.push("- The requested change likely requires at least one new slide to avoid overloading an existing layout.");
  }
  if (findings.length === 0) {
    findings.push("- No structural changes were explicitly requested; default to scoped revisions.");
  }
  return findings;
}

function loadSlideAnalysis(runRoot) {
  return JSON.parse(fs.readFileSync(path.join(runRoot, "artifacts", "slide_analysis.json"), "utf8"));
}

function normalizeMatchText(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function tokenize(value) {
  const stopwords = new Set([
    "a",
    "after",
    "add",
    "an",
    "and",
    "deck",
    "for",
    "in",
    "insert",
    "new",
    "of",
    "on",
    "please",
    "revise",
    "slide",
    "the",
    "to",
    "update",
    "with"
  ]);

  return normalizeMatchText(value)
    .split(/\s+/)
    .filter((token) => token && !stopwords.has(token));
}

function explicitSlideNumbers(changeRequest) {
  return Array.from(
    String(changeRequest || "").matchAll(/\bslide\s+(\d+)\b/gi),
    (match) => Number(match[1])
  );
}

function scoreSlideMatch(slide, changeRequest) {
  const requestedSlides = explicitSlideNumbers(changeRequest);
  if (requestedSlides.includes(slide.slide_number)) {
    return 1000;
  }

  const requestText = normalizeMatchText(changeRequest);
  const headlineText = normalizeMatchText(slide.headline);
  const headlineTokens = tokenize(slide.headline);
  const bodyTokens = tokenize((slide.body_lines || []).join(" ")).slice(0, 8);
  let score = slide.issues.length > 0 ? 1 : 0;

  if (headlineText && requestText.includes(headlineText)) {
    score += 50;
  }

  score += headlineTokens.filter((token) => requestText.includes(token)).length * 12;
  score += bodyTokens.filter((token) => requestText.includes(token)).length * 4;

  if (/\bsection\b/i.test(changeRequest) && slide.role !== "title") {
    score += 2;
  }

  return score;
}

function selectReviseTarget(slides, changeRequest) {
  const ranked = slides
    .map((slide) => ({
      slide,
      score: scoreSlideMatch(slide, changeRequest)
    }))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }
      return right.slide.slide_number - left.slide.slide_number;
    });

  if (ranked[0] && ranked[0].score > 1) {
    return ranked[0].slide;
  }

  return slides.find((slide) => slide.issues.length > 0) || slides[0];
}

function chooseLayoutStrategy(action) {
  if (["add_after", "split"].includes(action)) {
    return "preserve_seed";
  }
  return "preserve";
}

function defaultAllowedImageDelta(imageStrategy) {
  if (imageStrategy === "preserve") {
    return "none";
  }
  if (imageStrategy === "refine") {
    return "annotation_or_crop_only";
  }
  if (imageStrategy === "replace") {
    return "approved_replacement_only";
  }
  if (imageStrategy === "generate_new") {
    return "new_asset_only";
  }
  return "none";
}

function buildActionContract({
  slide,
  action,
  reason,
  request,
  analysis,
  slideNumber,
  layoutSeed,
  afterSlideNumber,
  replacement = false
}) {
  const visualRole = slide.visual_role || determineVisualRole({
    title: slide.headline,
    role: slide.role,
    visualAssets: slide.visual_assets
  });
  const sourceMediaRefs = slide.source_media_refs || [];
  const imageStrategy = replacement
    ? "replace"
    : defaultImageStrategy({
        mode: "edit",
        visualRole,
        hasExistingMedia: sourceMediaRefs.length > 0,
        layoutSeed,
        layoutSeedHasMedia: sourceMediaRefs.length > 0
      });
  const transcriptPath = `artifacts/slide-transcripts/slide-${String(slideNumber).padStart(2, "0")}.md`;
  const base = {
    slide_number: slideNumber,
    action,
    reason,
    content_inputs: ["artifacts/research_delta.md"],
    preserve: slide.preserve.length > 0 ? slide.preserve : ["existing layout"],
    preserve_tokens: slide.style_tokens || analysis.deck_summary?.style_summary || {},
    edit_scope: {
      text: true,
      chart: slide.visual_assets.includes("chart"),
      images: sourceMediaRefs.length > 0,
      structure: ["add_after", "split", "merge", "remove"].includes(action)
    },
    drift_risk: action === "add_after" ? "medium" : "low",
    visual_role: visualRole,
    image_strategy: imageStrategy,
    image_rationale:
      imageStrategy === "preserve"
        ? "Existing image remains the visual anchor for the slide."
        : imageStrategy === "generate_new"
          ? "The slide needs a new visual anchor to satisfy the presentation contract."
          : imageStrategy === "forbid"
            ? "This navigation-only slide should not introduce decorative imagery."
            : "The image contract requires a controlled change.",
    layout_strategy: chooseLayoutStrategy(action),
    allowed_layout_delta: action === "add_after" ? "duplicate_seed_adjustment_only" : "tighten_only",
    allowed_image_delta: defaultAllowedImageDelta(imageStrategy),
    transcript_path: transcriptPath,
    source_slide_number: slide.slide_number,
    source_layout_anchor: slide.layout_anchor || {},
    source_media_refs: sourceMediaRefs,
    has_existing_media: sourceMediaRefs.length > 0
  };

  if (afterSlideNumber) {
    base.after_slide_number = afterSlideNumber;
  }
  if (layoutSeed) {
    base.layout_seed = layoutSeed;
  }
  if (replacement) {
    base.replacement_reason = "Requested update requires an explicit image replacement.";
    base.replacement_preview_path = `artifacts/replacement-previews/slide-${String(slideNumber).padStart(2, "0")}.png`;
    base.user_approval_status = "pending";
  }

  return base;
}

function buildUpdatePlan({ runRoot, request }) {
  const analysis = loadSlideAnalysis(runRoot);
  const slides = analysis.slides || [];
  const maxSlideNumber = slides.reduce((max, slide) => Math.max(max, slide.slide_number), 0);
  const reviseTarget = selectReviseTarget(slides, request.change_request);
  const addAfterRequested = /\b(add|new slide|insert)\b/i.test(request.change_request);
  const verifyOnlyRequested = /\b(check|verify|confirm|current)\b/i.test(request.change_request) && !addAfterRequested;
  const reviseRequested = !verifyOnlyRequested && (/\b(refresh|update|revise|tighten)\b/i.test(request.change_request) || !addAfterRequested);

  const actionMap = new Map();
  if (reviseRequested && reviseTarget) {
    actionMap.set(
      reviseTarget.slide_number,
      buildActionContract({
        slide: reviseTarget,
        action: "revise",
        reason: "refresh stale content and tighten the slide narrative",
        request,
        analysis,
        slideNumber: reviseTarget.slide_number,
        replacement: /\breplace image|swap image\b/i.test(request.change_request)
      })
    );
  }

  if (addAfterRequested && reviseTarget) {
    const anchor = reviseTarget.slide_number;
    actionMap.set(
      maxSlideNumber + 1,
      buildActionContract({
        slide: reviseTarget,
        action: "add_after",
        reason: "new requested material does not fit cleanly on the existing slide",
        request,
        analysis,
        slideNumber: maxSlideNumber + 1,
        layoutSeed: `duplicate_slide:${anchor}`,
        afterSlideNumber: anchor
      })
    );
  }

  slides.forEach((slide) => {
    if (!actionMap.has(slide.slide_number)) {
      actionMap.set(slide.slide_number, {
        slide_number: slide.slide_number,
        action: "keep",
        reason: "slide remains within the preserved scope"
      });
    }
  });

  const slideActions = Array.from(actionMap.values()).sort((left, right) => left.slide_number - right.slide_number);
  const plan = validateUpdatePlanObject({
    deck_strategy: {
      preserve_narrative_spine: true,
      restyle_mode: request.restyle_mode,
      global_tightening: reviseRequested && reviseTarget ? [`tighten slide ${reviseTarget.slide_number}`] : [],
      style_precedence: "source_deck",
      style_summary: analysis.deck_summary?.style_summary || {}
    },
    slide_actions: slideActions
  });

  const md = [
    "# Update Plan",
    "",
    "## Deck Strategy",
    "",
    `- Preserve narrative spine: ${plan.deck_strategy.preserve_narrative_spine}`,
    `- Restyle mode: ${plan.deck_strategy.restyle_mode}`,
    "",
    "## Slide Actions",
    "",
    ...slideActions.map((action) => `- Slide ${action.slide_number}: ${action.action} because ${action.reason}`),
    ""
  ].join("\n");

  const updatePlanMdPath = path.join(runRoot, "artifacts", "update_plan.md");
  const updatePlanJsonPath = path.join(runRoot, "artifacts", "update_plan.json");
  const checkpointPath = path.join(runRoot, "artifacts", "pre_edit_checkpoint.md");
  const manualHandoffPath = path.join(runRoot, "artifacts", "manual_handoff.md");
  const highestRiskEdits = slideActions
    .filter((action) => action.action !== "keep")
    .sort((left, right) => {
      const rank = { high: 0, medium: 1, low: 2 };
      return (rank[left.drift_risk] ?? 3) - (rank[right.drift_risk] ?? 3);
    })
    .slice(0, 3);

  fs.writeFileSync(updatePlanMdPath, md);
  fs.writeFileSync(updatePlanJsonPath, JSON.stringify(plan, null, 2));
  const transcripts = ensureTranscriptArtifacts({
    runRoot,
    request,
    slideAnalysis: analysis,
    updatePlan: plan,
    researchDeltaText: fs.existsSync(path.join(runRoot, "artifacts", "research_delta.md"))
      ? fs.readFileSync(path.join(runRoot, "artifacts", "research_delta.md"), "utf8")
      : "",
    mode: "edit"
  });
  fs.writeFileSync(
    checkpointPath,
    [
      "# Pre-Edit Checkpoint",
      "",
      `- Requested change: ${request.change_request}`,
      `- Planning slide actions`,
      `- keep: ${slideActions.filter((action) => action.action === "keep").length}`,
      `- revise: ${slideActions.filter((action) => action.action === "revise").length}`,
      `- split: ${slideActions.filter((action) => action.action === "split").length}`,
      `- merge: ${slideActions.filter((action) => action.action === "merge").length}`,
      `- add_after: ${slideActions.filter((action) => action.action === "add_after").length}`,
      `- remove: ${slideActions.filter((action) => action.action === "remove").length}`,
      "",
      "## Highest-Risk Planned Edits",
      "",
      ...(highestRiskEdits.length > 0
        ? highestRiskEdits.map((action) => `- Slide ${action.slide_number}: ${action.action} (${action.drift_risk || "unspecified"} risk)`)
        : ["- None"]),
      "",
      `- untouched slides remain untouched: true`,
      `- transcript status: ${transcripts.status}`,
      ...(slideActions.every((action) => action.action === "keep")
        ? ["", "- Nothing to update", "- No meaningful update opportunities detected"]
        : []),
      ""
    ].join("\n")
  );
  fs.writeFileSync(
    manualHandoffPath,
    [
      "# Manual Handoff",
      "",
      "The deck is ready for operator review before structural edits.",
      `- Review update plan: ${path.relative(runRoot, updatePlanMdPath)}`,
      `- Review checkpoint: ${path.relative(runRoot, checkpointPath)}`,
      "- Untouched slides are expected to remain untouched unless they are explicitly listed in update_plan.json.",
      ""
    ].join("\n")
  );

  return {
    updatePlanMdPath,
    updatePlanJsonPath,
    checkpointPath,
    manualHandoffPath,
    transcriptIndexPath: path.join(runRoot, "artifacts", "transcript-index.json"),
    transcriptStatus: transcripts.status
  };
}

async function runPhase2A({ rootDir, deck, changeRequest, attachments = [], restyle = "none" }) {
  const initialized = initializeEditWorkflow({
    rootDir,
    deck,
    changeRequest,
    attachments,
    restyle
  });
  const { runRoot, request } = initialized;
  const resumeStage = initialized.resumeStage;

  if (["analyze"].includes(resumeStage)) {
    appendEvent(runRoot, { type: "stage_transition", stage: "analyze", message: "Starting deck analysis" });
    await analyzeDeck({ runRoot, deckPath: request.deck });
    writeStageStatus(runRoot, {
      current_stage: "analyze",
      message: "Deck analysis complete"
    });
  }
  if (["analyze", "research"].includes(resumeStage)) {
    appendEvent(runRoot, { type: "stage_transition", stage: "research", message: "Summarizing change sources" });
    await writeResearchDelta({ runRoot, request });
    writeStageStatus(runRoot, {
      current_stage: "research",
      message: "Research delta ready"
    });
  }
  let planResult = null;
  if (["analyze", "research", "plan"].includes(resumeStage)) {
    appendEvent(runRoot, { type: "stage_transition", stage: "plan", message: "Building update plan and transcript artifacts" });
    planResult = buildUpdatePlan({ runRoot, request });
    writeStageStatus(runRoot, {
      current_stage: "plan",
      message: planResult.transcriptStatus === "needs_context" ? "More context is required before editing" : "Update plan ready"
    });
  }

  const transcriptIndex = JSON.parse(fs.readFileSync(path.join(runRoot, "artifacts", "transcript-index.json"), "utf8"));
  const operatorSummaryPath = writeOperatorSummary(runRoot, {
    phase: "edit",
    stage: transcriptIndex.status === "needs_context" ? "needs_context" : "plan",
    requested_change: request.change_request,
    transcript_status: transcriptIndex.status,
    changed_slide_count: JSON.parse(fs.readFileSync(path.join(runRoot, "artifacts", "update_plan.json"), "utf8")).slide_actions.filter((action) => action.action !== "keep").length
  });
  updateManifest(runRoot, { status: transcriptIndex.status === "needs_context" ? "needs_context" : "plan" });

  return {
    status: transcriptIndex.status === "needs_context" ? "needs_context" : "ready",
    phase: "edit",
    runRoot,
    resumed: initialized.resumed,
    resumeStage,
    manifestPath: path.join(runRoot, "manifest.json"),
    originalTextPath: path.join(runRoot, "artifacts", "original-text.md"),
    slideAnalysisPath: path.join(runRoot, "artifacts", "slide_analysis.json"),
    researchDeltaPath: path.join(runRoot, "artifacts", "research_delta.md"),
    updatePlanPath: path.join(runRoot, "artifacts", "update_plan.json"),
    updatePlanMarkdownPath: path.join(runRoot, "artifacts", "update_plan.md"),
    transcriptIndexPath: path.join(runRoot, "artifacts", "transcript-index.json"),
    checkpointPath: path.join(runRoot, "artifacts", "pre_edit_checkpoint.md"),
    manualHandoffPath: path.join(runRoot, "artifacts", "manual_handoff.md"),
    operatorSummaryPath,
    operator_state: {
      stage: transcriptIndex.status === "needs_context" ? "needs_context" : "plan",
      stage_label: "Planning slide actions",
      completed: [
        "Initializing edit run",
        "Extracting text, images, and editable structure",
        `Analyzing slide ${JSON.parse(fs.readFileSync(path.join(runRoot, "artifacts", "slide_analysis.json"), "utf8")).slides.length} of ${JSON.parse(fs.readFileSync(path.join(runRoot, "artifacts", "slide_analysis.json"), "utf8")).slides.length}`,
        "Summarizing new material",
        "Checking stale claims",
        "Planning slide actions"
      ],
      message: transcriptIndex.status === "needs_context"
        ? "More context is required before transcript and edit artifacts can be finalized"
        : fs.readFileSync(path.join(runRoot, "artifacts", "pre_edit_checkpoint.md"), "utf8").includes("Nothing to update")
          ? "Nothing to update"
          : "Update plan and review checkpoint are ready"
    }
  };
}

module.exports = {
  buildUpdatePlan,
  hashChangeRequest,
  hashFile,
  initializeEditWorkflow,
  normalizeEditRequest,
  runPhase2A,
  writeResearchDelta
};
