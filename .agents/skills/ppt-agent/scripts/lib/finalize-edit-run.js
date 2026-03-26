"use strict";

const fs = require("fs");
const path = require("path");

const { compareDecks } = require("./eval-presentation");
const { cleanUnpackedRoot, packDeck } = require("./pptx-edit-ops");
const { renderSlides, renderSnapshotsFromUnpacked } = require("./render-slides");
const { appendEvent, writeOperatorSummary, writeRunSummary, writeStageStatus } = require("./run-logging");
const { readManifest, updateManifest } = require("./run-manifest");

function listBeforeRenders(beforeDir) {
  if (!fs.existsSync(beforeDir)) {
    return [];
  }
  return fs
    .readdirSync(beforeDir)
    .filter((name) => /^slide-\d+\.(png|jpg|jpeg|svg)$/i.test(name))
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));
}

function listRenders(renderDir) {
  return listBeforeRenders(renderDir);
}

function expectedAfterCount(plan, beforeCount) {
  const actions = plan.slide_actions || [];
  const additions = actions.filter((action) => ["add_after", "split"].includes(action.action)).length;
  const removals = actions.filter((action) => ["remove", "merge"].includes(action.action)).length;
  return beforeCount + additions - removals;
}

function writePlaceholderAfterRenders(runRoot, plan) {
  const beforeDir = path.join(runRoot, "renders", "before");
  const afterDir = path.join(runRoot, "renders", "after");
  const afterCount = expectedAfterCount(plan, listBeforeRenders(beforeDir).length);

  fs.rmSync(afterDir, { recursive: true, force: true });
  fs.mkdirSync(afterDir, { recursive: true });
  for (let index = 1; index <= afterCount; index++) {
    fs.writeFileSync(
      path.join(afterDir, `slide-${String(index).padStart(2, "0")}.jpg`),
      `after render ${index}\n`
    );
  }
  return afterDir;
}

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function listMediaRefsForSlide(relsPath, unpackedRoot) {
  if (!fs.existsSync(relsPath) || !fs.statSync(relsPath).isFile()) {
    return [];
  }
  const rels = fs.readFileSync(relsPath, "utf8");
  const crypto = require("crypto");
  return Array.from(rels.matchAll(/<Relationship[^>]+Id="([^"]+)"[^>]+Target="([^"]+)"[^>]*\/?>/g))
    .map((match) => {
      const target = match[2];
      const absoluteTarget = path.resolve(path.dirname(relsPath), target);
      const normalizedTarget = target.replace(/^\.\.\//, "ppt/");
      const contentHash = fs.existsSync(absoluteTarget) && fs.statSync(absoluteTarget).isFile()
        ? `sha256:${crypto.createHash("sha256").update(fs.readFileSync(absoluteTarget)).digest("hex")}`
        : null;
      return {
        relationship_id: match[1],
        target: normalizedTarget,
        content_hash: contentHash
      };
    })
    .filter((entry) => /media\//i.test(entry.target));
}

function buildLayoutAnchor(xml) {
  return {
    title_box: /<a:t>/.test(xml) ? "shape:title" : null,
    body_box: /<p:sp>/.test(xml) ? "shape:body" : null,
    image_box: /<p:pic>/.test(xml) ? "shape:image" : null
  };
}

function hasAnchorLoss(sourceLayoutAnchor, finalLayoutAnchor) {
  return ["title_box", "body_box", "image_box"].some(
    (key) => sourceLayoutAnchor[key] && !finalLayoutAnchor[key]
  );
}

function auditSlidePreservation({ runRoot, job, planAction, originalSlideIndex, approvalDecision }) {
  const unpackedRoot = path.join(runRoot, "working", "unpacked");
  const sourceRecord = originalSlideIndex.find((entry) => entry.slide_number === planAction.source_slide_number);
  const finalXmlPath = path.join(runRoot, job.xml_path || "");
  const finalRelsPath = path.join(runRoot, job.rels_path || "");
  const finalXml = fs.existsSync(finalXmlPath) && fs.statSync(finalXmlPath).isFile()
    ? fs.readFileSync(finalXmlPath, "utf8")
    : "";
  const finalMediaRefs = listMediaRefsForSlide(finalRelsPath, unpackedRoot);
  const sourceMediaRefs = planAction.source_media_refs || [];
  const sourceMediaHash = sourceMediaRefs[0]?.content_hash || null;
  const finalMediaHash = finalMediaRefs[0]?.content_hash || null;
  const sameRef = sourceMediaRefs.some((sourceRef) =>
    finalMediaRefs.some((finalRef) => finalRef.relationship_id === sourceRef.relationship_id || finalRef.target === sourceRef.target)
  );
  const sameHash = Boolean(sourceMediaHash && finalMediaHash && sourceMediaHash === finalMediaHash);
  const auditTier = planAction.image_strategy === "replace"
    ? "replace"
    : planAction.image_strategy === "refine"
      ? "refine"
      : "preserve";
  let auditResult = "preserved";

  if (auditTier === "preserve" && sourceMediaRefs.length > 0 && !(sameRef || sameHash)) {
    auditResult = "drifted_without_approval";
  } else if (auditTier === "refine") {
    auditResult = sourceMediaRefs.length === 0 || sameRef || sameHash || job.derived_from_media_ref ? "refined" : "drifted_without_approval";
  } else if (auditTier === "replace") {
    auditResult =
      approvalDecision && approvalDecision.status === "approved" && sourceMediaHash !== finalMediaHash && fs.existsSync(path.join(runRoot, planAction.replacement_preview_path || ""))
        ? "replaced_with_approval"
        : "drifted_without_approval";
  }

  const finalLayoutAnchor = buildLayoutAnchor(finalXml);
  const sourceLayoutAnchor = planAction.source_layout_anchor || sourceRecord?.layout_anchor || {};
  const preserveLayout = ["preserve", "preserve_seed"].includes(planAction.layout_strategy);
  const layoutDrifted =
    preserveLayout &&
    ["tighten_only", "duplicate_seed_adjustment_only", "none"].includes(planAction.allowed_layout_delta || "tighten_only") &&
    hasAnchorLoss(sourceLayoutAnchor, finalLayoutAnchor);
  if (layoutDrifted) {
    auditResult = "drifted_without_approval";
  }

  return {
    slide_number: planAction.slide_number,
    source_slide_number: planAction.source_slide_number,
    source_media_ref: sourceMediaRefs[0]?.relationship_id || null,
    source_media_hash: sourceMediaHash,
    final_media_ref: finalMediaRefs[0]?.relationship_id || null,
    final_media_hash: finalMediaHash,
    derived_from_media_ref: job.derived_from_media_ref || null,
    audit_tier: auditTier,
    audit_result: auditResult,
    source_layout_anchor: sourceLayoutAnchor,
    final_layout_anchor: finalLayoutAnchor
  };
}

function buildPreservationAudit({ runRoot, plan, handoff }) {
  const originalSlideIndex = loadJson(path.join(runRoot, "artifacts", "original-slide-index.json"));
  const approvalDecisionPath = path.join(runRoot, "artifacts", "approval-decision.json");
  const approvalDecision = fs.existsSync(approvalDecisionPath) ? loadJson(approvalDecisionPath) : null;
  const changedActions = (plan.slide_actions || []).filter((action) => action.action !== "keep");
  const slides = changedActions.map((action) =>
    auditSlidePreservation({
      runRoot,
      job: (handoff.jobs || []).find((candidate) => candidate.slide_number === action.slide_number && candidate.action === action.action) || {},
      planAction: action,
      originalSlideIndex,
      approvalDecision
    })
  );

  return {
    slides,
    summary: {
      preserved: slides.filter((slide) => slide.audit_result === "preserved").length,
      refined: slides.filter((slide) => slide.audit_result === "refined").length,
      replaced_with_approval: slides.filter((slide) => slide.audit_result === "replaced_with_approval").length,
      drifted_without_approval: slides.filter((slide) => slide.audit_result === "drifted_without_approval").length
    }
  };
}

function materializeOutputDeck(runRoot) {
  const unpackedRoot = path.join(runRoot, "working", "unpacked");
  const outputDeck = path.join(runRoot, "artifacts", "output-updated.pptx");
  const presentationPath = path.join(unpackedRoot, "ppt", "presentation.xml");

  if (!fs.existsSync(presentationPath)) {
    return {
      outputPath: null,
      packMode: "missing_edit_workspace",
      error: "Edited workspace is missing and cannot be finalized"
    };
  }

  cleanUnpackedRoot(unpackedRoot);
  const packMode = packDeck({
    unpackedRoot,
    outputPath: outputDeck
  });
  return {
    outputPath: outputDeck,
    packMode
  };
}

function renderAfterDeck(runRoot, outputPath, plan, packMode) {
  if (packMode === "missing_edit_workspace") {
    return {
      afterDir: null,
      renderMode: "comparison_unavailable"
    };
  }

  const renderSummary = renderSlides({
    outputPath,
    renderDir: path.join(runRoot, "renders", "after")
  });
  if (renderSummary.renderCount > 0) {
    return {
      afterDir: renderSummary.renderDir,
      renderMode: renderSummary.mode
    };
  }
  return {
    afterDir: renderSnapshotsFromUnpacked({
      unpackedRoot: path.join(runRoot, "working", "unpacked"),
      renderDir: path.join(runRoot, "renders", "after")
    }).renderDir,
    renderMode: "svg_snapshot_render"
  };
}

function finalizeEditRun({ runRoot }) {
  const manifest = readManifest(runRoot);
  if (manifest.phase !== "edit") {
    throw new Error("finalizeEditRun requires an edit-phase run");
  }

  const planPath = path.join(runRoot, "artifacts", "update_plan.json");
  const handoffPath = path.join(runRoot, "artifacts", "edit_handoff.json");
  const comparisonPath = path.join(runRoot, "artifacts", "comparison_evals.json");
  const plan = JSON.parse(fs.readFileSync(planPath, "utf8"));
  const handoff = JSON.parse(fs.readFileSync(handoffPath, "utf8"));
  const transcriptIndexPath = path.join(runRoot, "artifacts", "transcript-index.json");
  const transcriptIndex = fs.existsSync(transcriptIndexPath) ? loadJson(transcriptIndexPath) : null;
  const outputDeck = materializeOutputDeck(runRoot);
  if (outputDeck.error) {
    const failure = {
      state: "failed",
      message: outputDeck.error,
      requested_updates: {
        total: (plan.slide_actions || []).filter((action) => action.action !== "keep").length,
        applied: 0,
        skipped: 0,
        missed: 0
      },
      skipped_slides: [],
      regressions: [outputDeck.error],
      slide_results: [],
      deck_scores: {
        freshness: 1,
        design_consistency: 1,
        coherence: 1,
        overall: 1
      },
      result: "fail",
      recommendation: "needs manual fix",
      executive_summary: [
        "Requested updates applied: 0 applied, 0 skipped.",
        `Regressions detected: ${outputDeck.error}.`,
        "Overall recommendation: needs manual fix.",
        "Deck-level scores: freshness 1, design consistency 1, coherence 1."
      ],
      artifact_paths: {
        update_plan: path.relative(runRoot, planPath),
        edit_handoff: path.relative(runRoot, handoffPath),
        comparison_evals: path.relative(runRoot, comparisonPath)
      },
      pack_mode: outputDeck.packMode,
      render_mode: "comparison_unavailable",
      operator_state: {
        stage: "evaluate",
        stage_label: "Comparing original vs updated deck",
        message: "No comparison available"
      }
    };
    fs.writeFileSync(comparisonPath, JSON.stringify(failure, null, 2));
    writeOperatorSummary(runRoot, failure.operator_state);
    writeRunSummary(
      runRoot,
      [
        "# Run Summary",
        "",
        "- what changed: finalize failed before packaging",
        "- which slides preserved source imagery: none",
        "- which slides refined imagery: none",
        "- which slides generated new imagery: none",
        "- which slides need manual review: all",
        "- where the final deck lives inside the run root: unavailable"
      ].join("\n")
    );
    updateManifest(runRoot, { status: "failed" });
    return {
      status: "failed",
      reason: outputDeck.error,
      comparisonPath
    };
  }
  const renderResult = renderAfterDeck(runRoot, outputDeck.outputPath, plan, outputDeck.packMode);
  const preservationAudit = buildPreservationAudit({ runRoot, plan, handoff });
  const requiredArtifacts = [
    path.join(runRoot, "artifacts", "comparison_evals.json"),
    path.join(runRoot, "artifacts", "run_summary.md"),
    path.join(runRoot, "artifacts", "operator-summary.json")
  ];
  const comparison = compareDecks({
    beforeDir: path.join(runRoot, "renders", "before"),
    afterDir: renderResult.afterDir,
    updatePlanPath: planPath,
    handoffPath,
    transcriptIndex,
    preservationAudit,
    runRoot,
    requiredArtifacts: [transcriptIndexPath]
  });

  comparison.artifact_paths = {
    update_plan: path.relative(runRoot, planPath),
    edit_handoff: path.relative(runRoot, handoffPath),
    output_deck: path.relative(runRoot, outputDeck.outputPath),
    comparison_evals: path.relative(runRoot, comparisonPath)
  };
  comparison.pack_mode = outputDeck.packMode;
  comparison.render_mode = renderResult.renderMode;
  comparison.operator_state = {
    stage: "evaluate",
    stage_label: "Comparing original vs updated deck",
    message: comparison.result === "fail" ? "Comparison evaluation could not determine update safety" : "Requested changes landed and no unacceptable regressions were found"
  };

  const afterRenders = listRenders(path.join(runRoot, "renders", "after"));
  if (afterRenders.length === 0) {
    comparison.result = "fail";
    comparison.message = "Missing after renders";
    comparison.regressions.push("Missing after renders");
  }

  const manualReviewSlides = (comparison.slide_results || [])
    .filter((slide) => slide.outcome !== "applied")
    .map((slide) => slide.slide_number);
  const imagerySummary = preservationAudit.summary;
  writeRunSummary(
    runRoot,
    [
      "# Run Summary",
      "",
      `- what changed: ${comparison.requested_updates.applied} slide updates applied out of ${comparison.requested_updates.total} requested`,
      `- which slides preserved source imagery: ${imagerySummary.preserved}`,
      `- which slides refined imagery: ${imagerySummary.refined}`,
      `- which slides generated new imagery: ${(handoff.jobs || []).filter((job) => job.image_action === "generate_media").length}`,
      `- which slides need manual review: ${manualReviewSlides.length > 0 ? manualReviewSlides.join(", ") : "none"}`,
      `- where the final deck lives inside the run root: ${path.relative(runRoot, outputDeck.outputPath)}`
    ].join("\n")
  );
  writeOperatorSummary(runRoot, {
    stage: "evaluate",
    result: comparison.result,
    requested_updates: comparison.requested_updates,
    preservation_audit: preservationAudit.summary,
    transcript_status: transcriptIndex ? transcriptIndex.status : "missing"
  });
  writeStageStatus(runRoot, {
    current_stage: comparison.result === "fail" ? "failed" : "complete",
    comparison_result: comparison.result,
    output_path: path.relative(runRoot, outputDeck.outputPath)
  });
  appendEvent(runRoot, {
    type: "stage_transition",
    stage: comparison.result === "fail" ? "failed" : "complete",
    comparison_result: comparison.result
  });

  fs.writeFileSync(comparisonPath, JSON.stringify(comparison, null, 2));
  updateManifest(runRoot, {
    status: comparison.result === "fail" ? "failed" : "complete"
  });

  if (comparison.result === "fail") {
    return {
      status: "failed",
      reason:
      comparison.requested_updates && comparison.requested_updates.missed > 0
          ? "Comparison evaluation reported missed updates"
          : comparison.message || comparison.regressions[0] || "comparison_eval_failed",
      comparisonPath
    };
  }

  return {
    status: "complete",
    outputPath: outputDeck.outputPath,
    comparisonPath
  };
}

module.exports = {
  finalizeEditRun
};
