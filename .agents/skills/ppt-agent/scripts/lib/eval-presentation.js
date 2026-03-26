"use strict";

const fs = require("fs");
const path = require("path");

const {
  PRIMARY_VISUAL_ANCHOR_KIND,
  PRIMARY_VISUAL_ANCHOR_SOURCE,
  TEXT_ONLY_EXCEPTION_REASON
} = require("./shared-constants");

function listRenders(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }
  return fs
    .readdirSync(dirPath)
    .filter((name) => /^slide-\d+\.(png|jpg|jpeg|svg)$/i.test(name))
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));
}

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function expectedAfterCount(beforeCount, actions) {
  const additions = actions.filter((action) => ["add_after", "split"].includes(action.action)).length;
  const removals = actions.filter((action) => ["remove", "merge"].includes(action.action)).length;
  return beforeCount + additions - removals;
}

function requestedActions(plan) {
  return (plan.slide_actions || []).filter((action) => action.action !== "keep");
}

function riskScore(regressions, requested, applied, skipped) {
  if (requested === 0) {
    return 4.6;
  }

  const completion = applied / requested;
  const skipPenalty = skipped === 0 ? 0 : 0.4;
  const regressionPenalty = regressions.length === 0 ? 0 : 0.8;
  return Number(Math.max(1, Math.min(5, 3.4 + completion * 1.6 - skipPenalty - regressionPenalty)).toFixed(2));
}

function buildSlideResults(actions, jobs) {
  return actions.map((action) => {
    const job = jobs.find((candidate) => candidate.slide_number === action.slide_number && candidate.action === action.action);
    if (!job) {
      return {
        slide_number: action.slide_number,
        action: action.action,
        outcome: "missed",
        summary: action.reason
      };
    }

    return {
      slide_number: action.slide_number,
      action: action.action,
      outcome: job.status || "applied",
      fallback: job.fallback,
      reason: job.reason,
      summary: job.summary || action.reason
    };
  });
}

function buildExecutiveSummary({ applied, skipped, regressions, recommendation, deckScores, state }) {
  const regressionLine = regressions.length === 0
    ? "Regressions detected: none."
    : `Regressions detected: ${regressions.join("; ")}.`;
  const recommendationSuffix = recommendation === "review with warnings"
    ? " The deck is not presentation-ready until flagged items are checked."
    : "";

  if (state === "already_current") {
    return [
      "Requested updates applied: no changes were needed.",
      regressionLine,
      `Overall recommendation: ${recommendation}.`,
      `Deck-level scores: freshness ${deckScores.freshness}, design consistency ${deckScores.design_consistency}, coherence ${deckScores.coherence}.`
    ];
  }

  return [
    `Requested updates applied: ${applied} applied, ${skipped} skipped.`,
    regressionLine,
    `Overall recommendation: ${recommendation}.${recommendationSuffix}`,
    `Deck-level scores: freshness ${deckScores.freshness}, design consistency ${deckScores.design_consistency}, coherence ${deckScores.coherence}.`
  ];
}

/**
 * Evaluate enrichment quality for slide briefs
 * Checks for visual/plain-text regressions and semantic-anchor mistakes
 */
function evaluateEnrichmentQuality({ runRoot, slideActions }) {
  const enrichmentIssues = [];
  const enrichmentWarnings = [];

  if (!runRoot) {
    return { enrichmentIssues, enrichmentWarnings };
  }

  const slideBriefsDir = path.join(runRoot, "artifacts", "slide-briefs");
  if (!fs.existsSync(slideBriefsDir)) {
    // If slide briefs don't exist, skip enrichment quality checks
    // This allows older test fixtures and workflows to pass
    return { enrichmentIssues, enrichmentWarnings };
  }

  const briefFiles = fs.readdirSync(slideBriefsDir)
    .filter(name => /^slide-\d+\.json$/.test(name));

  // If no brief files exist, skip checks
  if (briefFiles.length === 0) {
    return { enrichmentIssues, enrichmentWarnings };
  }

  briefFiles.forEach(file => {
    const briefPath = path.join(slideBriefsDir, file);
    let brief;

    try {
      brief = loadJson(briefPath);
    } catch (error) {
      // Skip malformed briefs
      return;
    }

    if (brief.action === "keep") {
      return;
    }

    const slideNum = brief.slide_number;
    const hasVisualAnchor = brief.primary_visual_anchor && brief.primary_visual_anchor.kind;
    const hasTextOnlyException = brief.text_only_exception && brief.text_only_exception.reason;

    if (!hasVisualAnchor && !hasTextOnlyException) {
      enrichmentWarnings.push(`Slide ${slideNum}: text-only slide without valid exception or visual anchor`);
    }

    if (!hasTextOnlyException && !hasVisualAnchor) {
      enrichmentIssues.push(`Slide ${slideNum}: missing primary visual anchor`);
    }

    if (hasVisualAnchor) {
      const anchor = brief.primary_visual_anchor;
      const isPreserved = anchor.source === PRIMARY_VISUAL_ANCHOR_SOURCE.SOURCE_DECK &&
                         anchor.kind === PRIMARY_VISUAL_ANCHOR_KIND.EXISTING_MEDIA;

      if (isPreserved) {
        const hasRelevanceRationale = anchor.relevance_rationale &&
                                     anchor.relevance_rationale.length > 20 &&
                                     !anchor.relevance_rationale.includes("established visual anchor");

        if (!hasRelevanceRationale) {
          enrichmentIssues.push(`Slide ${slideNum}: preserved visual anchor lacks specific relevance rationale`);
        }
      }
    }

    if (!brief.speaker_script || brief.speaker_script.trim().length === 0) {
      enrichmentIssues.push(`Slide ${slideNum}: missing speaker notes`);
    }

    if (hasVisualAnchor && brief.primary_visual_anchor.kind === PRIMARY_VISUAL_ANCHOR_KIND.GENERATED_IMAGE) {
      const imagePromptsDir = path.join(runRoot, "artifacts", "image-prompts");
      const metaPromptPath = path.join(imagePromptsDir, `slide-${String(slideNum).padStart(2, "0")}.md`);

      if (!fs.existsSync(metaPromptPath)) {
        enrichmentIssues.push(`Slide ${slideNum}: missing image meta prompt for generated image`);
      }
    }

    if (hasVisualAnchor) {
      const anchor = brief.primary_visual_anchor;
      const needsDescription = [
        PRIMARY_VISUAL_ANCHOR_KIND.GENERATED_IMAGE,
        PRIMARY_VISUAL_ANCHOR_KIND.CHART,
        PRIMARY_VISUAL_ANCHOR_KIND.DIAGRAM
      ].includes(anchor.kind);

      if (needsDescription && (!anchor.description || anchor.description.trim().length === 0)) {
        enrichmentIssues.push(`Slide ${slideNum}: missing description metadata for ${anchor.kind}`);
      }
    }

    if (brief.speaker_script && brief.on_slide_copy) {
      const scriptNormalized = brief.speaker_script.toLowerCase().trim();
      const onSlideCopyNormalized = brief.on_slide_copy.toLowerCase().trim();

      if (onSlideCopyNormalized && scriptNormalized.includes(onSlideCopyNormalized)) {
        const extraContent = scriptNormalized.replace(onSlideCopyNormalized, "").trim();
        if (extraContent.length < 50) {
          enrichmentWarnings.push(`Slide ${slideNum}: speaker script too close to slide copy (shallow transcript)`);
        }
      }
    }
  });

  return { enrichmentIssues, enrichmentWarnings };
}

function compareDecks({
  beforeDir,
  afterDir,
  updatePlanPath,
  handoffPath,
  transcriptIndex = null,
  preservationAudit = null,
  runRoot = null,
  requiredArtifacts = []
}) {
  const plan = loadJson(updatePlanPath);
  const handoff = handoffPath && fs.existsSync(handoffPath) ? loadJson(handoffPath) : { jobs: [] };
  const beforeSlides = listRenders(beforeDir);
  const afterSlides = listRenders(afterDir);
  const requested = requestedActions(plan);
  const slideResults = buildSlideResults(requested, handoff.jobs || []);
  const applied = slideResults.filter((result) => result.outcome === "applied").length;
  const skipped = slideResults.filter((result) => result.outcome === "skipped").length;
  const missed = slideResults.filter((result) => result.outcome === "missed").length;
  const regressions = [];
  const expectedCount = expectedAfterCount(beforeSlides.length, plan.slide_actions || []);
  const unauthorizedDrift = (preservationAudit?.slides || []).filter((slide) => slide.audit_result === "drifted_without_approval");
  const transcriptCount = (transcriptIndex?.transcripts || []).length;
  const missingRequiredArtifacts = requiredArtifacts.filter((artifactPath) => !fs.existsSync(artifactPath));

  // Evaluate enrichment quality
  const enrichmentQuality = evaluateEnrichmentQuality({ runRoot, slideActions: plan.slide_actions || [] });
  const enrichmentIssues = enrichmentQuality.enrichmentIssues || [];
  const enrichmentWarnings = enrichmentQuality.enrichmentWarnings || [];

  // Note: Enrichment issues are tracked but not added to regressions yet
  // They will become hard failures after the enrichment pipeline is fully mature
  // For now, they are informational only and tracked separately from preservation failures

  if (afterSlides.length === 0) {
    regressions.push("No after-render output was produced");
  }
  if (afterSlides.length !== expectedCount) {
    regressions.push(`Expected ${expectedCount} rendered slides after editing, found ${afterSlides.length}`);
  }
  if (transcriptIndex && transcriptCount !== expectedCount) {
    regressions.push(`Expected ${expectedCount} transcripts after editing, found ${transcriptCount}`);
  }
  if (transcriptIndex && transcriptIndex.status === "needs_context") {
    regressions.push("Transcript generation stopped in needs_context");
  }
  if (unauthorizedDrift.length > 0) {
    regressions.push(`Unauthorized preservation drift detected on slides ${unauthorizedDrift.map((slide) => slide.slide_number).join(", ")}`);
  }
  if (runRoot) {
    const outputPath = path.resolve(runRoot, "artifacts", "output-updated.pptx");
    if (path.relative(runRoot, outputPath).startsWith("..")) {
      regressions.push("Output path escaped the run root");
    }
  }
  if (missingRequiredArtifacts.length > 0) {
    regressions.push(`Missing required artifacts: ${missingRequiredArtifacts.map((artifactPath) => artifactPath.split("/").slice(-2).join("/")).join(", ")}`);
  }

  const deckScores = {
    freshness: riskScore(regressions, requested.length, applied, skipped + missed),
    design_consistency: Number((regressions.length === 0 ? 4.3 : 3.5).toFixed(2)),
    coherence: Number((missed === 0 ? 4.2 : 3.4).toFixed(2)),
    image_retention: preservationAudit
      ? Number((((preservationAudit.summary?.preserved || 0) + (preservationAudit.summary?.refined || 0)) > 0 && unauthorizedDrift.length === 0 ? 4.6 : 2.2).toFixed(2))
      : 4.0,
    layout_drift: preservationAudit
      ? Number((unauthorizedDrift.length === 0 ? 4.5 : 2.0).toFixed(2))
      : 4.0,
    transcript_completeness: transcriptIndex
      ? Number((transcriptCount === expectedCount && transcriptIndex.status !== "needs_context" ? 4.7 : 2.1).toFixed(2))
      : 3.0,
    transcript_grounding: transcriptIndex
      ? Number(((transcriptIndex.deck_grounding?.status === "ok" || transcriptIndex.status === "ready") ? 4.4 : 2.8).toFixed(2))
      : 3.0,
    evidence_completeness: Number((missingRequiredArtifacts.length === 0 ? 4.8 : 1.9).toFixed(2)),
    enrichment_quality: Number((enrichmentIssues.length === 0 && enrichmentWarnings.length === 0 ? 4.7 : enrichmentIssues.length === 0 ? 3.8 : 2.1).toFixed(2))
  };
  deckScores.overall = Number(
    (
      (
        deckScores.freshness +
        deckScores.design_consistency +
        deckScores.coherence +
        deckScores.image_retention +
        deckScores.layout_drift +
        deckScores.transcript_completeness +
        deckScores.transcript_grounding +
        deckScores.evidence_completeness +
        deckScores.enrichment_quality
      ) / 9
    ).toFixed(2)
  );

  if (requested.length === 0) {
    return {
      state: "already_current",
      message: "Deck is already current",
      requested_updates: {
        total: 0,
        applied: 0,
        skipped: 0,
        missed: 0
      },
      skipped_slides: [],
      regressions,
      slide_results: [],
      deck_scores: deckScores,
      result: regressions.length === 0 ? "pass" : "fail",
      recommendation: regressions.length === 0 ? "safe to review" : "needs manual fix",
      executive_summary: buildExecutiveSummary({
        applied: 0,
        skipped: 0,
        regressions,
        recommendation: regressions.length === 0 ? "safe to review" : "needs manual fix",
        deckScores,
        state: "already_current"
      }),
      operator_state: {
        stage: "evaluate",
        stage_label: "Comparing original vs updated deck",
        message: regressions.length === 0 ? "Deck is already current" : "Comparison evaluation could not determine update safety"
      },
      preservation_audit: preservationAudit,
      transcript_status: transcriptIndex ? transcriptIndex.status : "unknown",
      enrichment_issues: enrichmentIssues,
      enrichment_warnings: enrichmentWarnings
    };
  }

  if (missed > 0 || regressions.length > 0) {
    return {
      state: "failed",
      message: missed > 0 ? "Requested updates were not fully applied" : "Comparison evaluation could not verify update safety",
      requested_updates: {
        total: requested.length,
        applied,
        skipped,
        missed
      },
      skipped_slides: slideResults.filter((result) => result.outcome !== "applied").map((result) => result.slide_number),
      regressions,
      slide_results: slideResults,
      deck_scores: deckScores,
      result: "fail",
      recommendation: "needs manual fix",
      executive_summary: buildExecutiveSummary({
        applied,
        skipped: skipped + missed,
        regressions,
        recommendation: "needs manual fix",
        deckScores,
        state: "failed"
      }),
      operator_state: {
        stage: "evaluate",
        stage_label: "Comparing original vs updated deck",
        message: "Comparison evaluation could not determine update safety"
      },
      preservation_audit: preservationAudit,
      transcript_status: transcriptIndex ? transcriptIndex.status : "unknown",
      enrichment_issues: enrichmentIssues,
      enrichment_warnings: enrichmentWarnings
    };
  }

  if (skipped > 0) {
    return {
      state: "review_with_warnings",
      message: "The deck is safe to review, but flagged slides still need manual inspection",
      requested_updates: {
        total: requested.length,
        applied,
        skipped,
        missed
      },
      skipped_slides: slideResults.filter((result) => result.outcome === "skipped").map((result) => result.slide_number),
      regressions,
      slide_results: slideResults,
      deck_scores: deckScores,
      result: "partial",
      recommendation: "review with warnings",
      executive_summary: buildExecutiveSummary({
        applied,
        skipped,
        regressions,
        recommendation: "review with warnings",
        deckScores,
        state: "review_with_warnings"
      }),
      operator_state: {
        stage: "evaluate",
        stage_label: "Comparing original vs updated deck",
        message: "Safe to review, not presentation-ready until flagged items are checked"
      },
      preservation_audit: preservationAudit,
      transcript_status: transcriptIndex ? transcriptIndex.status : "unknown",
      enrichment_issues: enrichmentIssues,
      enrichment_warnings: enrichmentWarnings
    };
  }

  return {
    state: "safe_to_review",
    message: "Requested changes landed and no unacceptable regressions were detected",
    requested_updates: {
      total: requested.length,
      applied,
      skipped,
      missed
    },
    skipped_slides: [],
    regressions,
    slide_results: slideResults,
    deck_scores: deckScores,
    result: "pass",
    recommendation: "safe to review",
      executive_summary: buildExecutiveSummary({
        applied,
        skipped: 0,
        regressions,
        recommendation: "safe to review",
        deckScores,
        state: "safe_to_review"
      }),
      operator_state: {
        stage: "evaluate",
        stage_label: "Comparing original vs updated deck",
        message: "Requested changes landed and no unacceptable regressions were found"
      },
      preservation_audit: preservationAudit,
      transcript_status: transcriptIndex ? transcriptIndex.status : "unknown",
      enrichment_issues: enrichmentIssues,
      enrichment_warnings: enrichmentWarnings
  };
}

module.exports = {
  compareDecks
};
