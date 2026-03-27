"use strict";

const fs = require("fs");
const path = require("path");

const {
  applyTextUpdateToSlide,
  basenameFromRelative,
  listPresentationSlides,
  registerSlideInPresentation,
  removeSlideFromPresentation
} = require("./pptx-edit-ops");
const { appendEvent, writeStageStatus } = require("./run-logging");
const { readManifest, updateManifest } = require("./run-manifest");
const { validateUpdatePlan } = require("./update-plan");
const { buildStructuredSlideSpec } = require("./structured-slide-spec");

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function loadText(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
}

function loadEditBrief(runRoot, plan) {
  const editBriefPath = path.join(runRoot, "input", "edit_brief.json");
  if (fs.existsSync(editBriefPath)) {
    return loadJson(editBriefPath);
  }

  return {
    change_request:
      (plan.slide_actions || [])
        .filter((action) => action.action !== "keep")
        .map((action) => action.reason)
        .join("; ") || "Apply requested updates",
    attachments: []
  };
}

function nextSlideFileNumber(unpackedRoot) {
  const slidesDir = path.join(unpackedRoot, "ppt", "slides");
  const existing = fs.existsSync(slidesDir)
    ? fs
        .readdirSync(slidesDir)
        .filter((name) => /^slide\d+\.xml$/i.test(name))
        .map((name) => Number(name.match(/slide(\d+)\.xml/i)[1]))
    : [];
  return existing.length > 0 ? Math.max(...existing) + 1 : 1;
}

function resolveIndexedSlide(runRoot, slideIndex, slideNumber) {
  const record = slideIndex.find((item) => item.slide_number === slideNumber);
  if (!record) {
    throw new Error(`Could not resolve slide ${slideNumber} from original-slide-index.json`);
  }
  return {
    xmlPath: path.join(runRoot, record.xml_path),
    relsPath: path.join(runRoot, record.rels_path),
    xmlRelative: record.xml_path,
    relsRelative: record.rels_path,
    slideFile: basenameFromRelative(record.xml_path)
  };
}

function duplicateSeedSlide(runRoot, unpackedRoot, slideIndex, layoutSeed, afterSlideNumber) {
  const match = String(layoutSeed).match(/^duplicate_slide:(\d+)$/);
  if (!match) {
    throw new Error(`Unsupported layout_seed "${layoutSeed}"`);
  }

  const seedSlideNumber = Number(match[1]);
  const seed = resolveIndexedSlide(runRoot, slideIndex, seedSlideNumber);
  const nextFileNumber = nextSlideFileNumber(unpackedRoot);
  const slideFile = `slide${nextFileNumber}.xml`;
  const targetXmlRelative = `working/unpacked/ppt/slides/${slideFile}`;
  const targetRelsRelative = `working/unpacked/ppt/slides/_rels/${slideFile}.rels`;
  const targetXmlPath = path.join(runRoot, targetXmlRelative);
  const targetRelsPath = path.join(runRoot, targetRelsRelative);
  const anchorSlide = resolveIndexedSlide(runRoot, slideIndex, afterSlideNumber || seedSlideNumber);

  fs.mkdirSync(path.dirname(targetXmlPath), { recursive: true });
  fs.mkdirSync(path.dirname(targetRelsPath), { recursive: true });
  fs.copyFileSync(seed.xmlPath, targetXmlPath);
  if (fs.existsSync(seed.relsPath)) {
    fs.copyFileSync(seed.relsPath, targetRelsPath);
  } else {
    fs.writeFileSync(
      targetRelsPath,
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>'
    );
  }

  registerSlideInPresentation(unpackedRoot, slideFile, anchorSlide.slideFile);

  return {
    sourceSlideNumber: seedSlideNumber,
    xmlPath: targetXmlPath,
    xmlRelative: targetXmlRelative,
    relsRelative: targetRelsRelative
  };
}

function jobBase(slideNumber, action) {
  return {
    job_id: `slide-${String(slideNumber).padStart(2, "0")}-${action.action}`,
    slide_number: slideNumber,
    action: action.action,
    preserve: action.preserve || [],
    preserve_tokens: action.preserve_tokens || {},
    content_inputs: action.content_inputs || []
  };
}

function ensureApprovalPreview(runRoot, action) {
  const previewPath = path.join(
    runRoot,
    action.replacement_preview_path || `artifacts/replacement-previews/slide-${String(action.slide_number).padStart(2, "0")}.png`
  );
  fs.mkdirSync(path.dirname(previewPath), { recursive: true });
  if (!fs.existsSync(previewPath)) {
    fs.writeFileSync(previewPath, `preview placeholder for slide ${action.slide_number}\n`);
  }
  return path.relative(runRoot, previewPath).replace(/\\/g, "/");
}

function loadApprovalDecision(runRoot) {
  const decisionPath = path.join(runRoot, "artifacts", "approval-decision.json");
  if (!fs.existsSync(decisionPath)) {
    return null;
  }
  return loadJson(decisionPath);
}

function buildImageOperation(action) {
  if (action.image_strategy === "preserve") {
    return "keep_media";
  }
  if (action.image_strategy === "refine") {
    return "refine_media";
  }
  if (action.image_strategy === "replace") {
    return "replace_media";
  }
  if (action.image_strategy === "generate_new") {
    return "generate_media";
  }
  return "keep_media";
}

function applyReviseAction({ runRoot, slideIndex, action, changeRequest, researchDeltaText }) {
  const resolved = resolveIndexedSlide(runRoot, slideIndex, action.slide_number);
  if ((action.source_media_refs || []).length > 0 && !["preserve", "refine", "replace"].includes(action.image_strategy)) {
    throw new Error(`Slide ${action.slide_number} cannot drop source media under image_strategy "${action.image_strategy}"`);
  }
  const update = applyTextUpdateToSlide({
    slidePath: resolved.xmlPath,
    action,
    changeRequest,
    researchDeltaText,
    slideNumber: action.slide_number
  });

  return {
    ...jobBase(action.slide_number, action),
    xml_path: resolved.xmlRelative,
    rels_path: resolved.relsRelative,
    layout_strategy: action.layout_strategy,
    image_strategy: action.image_strategy,
    image_action: buildImageOperation(action),
    source_media_refs: action.source_media_refs || [],
    destination_media_refs: action.source_media_refs || [],
    derived_from_media_ref: action.image_strategy === "refine" ? (action.source_media_refs || [])[0]?.relationship_id || null : null,
    transcript_path: action.transcript_path,
    ...update
  };
}

function applyAdditiveAction({ runRoot, unpackedRoot, slideIndex, action, changeRequest, researchDeltaText }) {
  const duplicated = duplicateSeedSlide(
    runRoot,
    unpackedRoot,
    slideIndex,
    action.layout_seed,
    action.after_slide_number
  );
  const update = applyTextUpdateToSlide({
    slidePath: duplicated.xmlPath,
    action,
    changeRequest,
    researchDeltaText,
    slideNumber: action.slide_number
  });

  return {
    ...jobBase(action.slide_number, action),
    after_slide_number: action.after_slide_number || duplicated.sourceSlideNumber,
    xml_path: duplicated.xmlRelative,
    rels_path: duplicated.relsRelative,
    layout_strategy: action.layout_strategy,
    image_strategy: action.image_strategy,
    image_action: buildImageOperation(action),
    source_media_refs: action.source_media_refs || [],
    destination_media_refs: action.source_media_refs || [],
    transcript_path: action.transcript_path,
    ...update
  };
}

function applyRemoveAction({ runRoot, slideIndex, action, unpackedRoot }) {
  const resolved = resolveIndexedSlide(runRoot, slideIndex, action.slide_number);
  const removed = removeSlideFromPresentation(unpackedRoot, resolved.slideFile);

  return {
    ...jobBase(action.slide_number, action),
    xml_path: resolved.xmlRelative,
    rels_path: resolved.relsRelative,
    layout_strategy: action.layout_strategy,
    image_strategy: action.image_strategy || "preserve",
    image_action: buildImageOperation(action),
    source_media_refs: action.source_media_refs || [],
    destination_media_refs: [],
    transcript_path: action.transcript_path,
    status: removed ? "applied" : "skipped",
    fallback: removed ? undefined : "manual_review_required",
    reason: removed ? "Removed slide from presentation flow" : "Could not remove slide from presentation flow"
  };
}

function applyMergeAction({ runRoot, slideIndex, action, unpackedRoot, changeRequest, researchDeltaText }) {
  const keeperSlideNumber = action.merge_into || action.keeper_slide;
  if (!keeperSlideNumber) {
    throw new Error("merge action requires merge_into or keeper_slide");
  }

  const update = applyReviseAction({
    runRoot,
    slideIndex,
    action: {
      ...action,
      slide_number: keeperSlideNumber,
      action: "revise"
    },
    changeRequest,
    researchDeltaText
  });
  const removal = applyRemoveAction({ runRoot, slideIndex, action, unpackedRoot });

  return {
    ...jobBase(action.slide_number, action),
    merged_into: keeperSlideNumber,
    status: update.status === "applied" && removal.status === "applied" ? "applied" : "skipped",
    fallback: removal.fallback || update.fallback,
    reason: removal.reason,
    summary: update.summary
  };
}

function applyStructuredRebuildAction({ runRoot, slideIndex, action, unpackedRoot }) {
  const slideBriefPath = path.join(
    runRoot,
    "artifacts",
    "slide-briefs",
    `slide-${String(action.slide_number).padStart(2, "0")}.json`
  );
  let slideBrief;
  if (fs.existsSync(slideBriefPath)) {
    try {
      slideBrief = JSON.parse(fs.readFileSync(slideBriefPath, "utf8"));
    } catch (err) {
      throw new Error(`slide brief for slide ${action.slide_number} is not valid JSON: ${err.message}`);
    }
  } else {
    slideBrief = { slide_number: action.slide_number, title: action.reason || `Slide ${action.slide_number}`, composition_family: null, on_slide_copy: "" };
  }

  const themeSnapshotPath = path.join(runRoot, "artifacts", "source-theme-snapshot.json");
  let themeSnapshot = null;
  if (fs.existsSync(themeSnapshotPath)) {
    try {
      themeSnapshot = JSON.parse(fs.readFileSync(themeSnapshotPath, "utf8"));
    } catch {
      // Unusable snapshot — fall back to default tokens
    }
  }

  const spec = buildStructuredSlideSpec(slideBrief, themeSnapshot);

  const artifactPath = path.join(runRoot, "artifacts", `rebuilt-slide-${String(action.slide_number).padStart(2, "0")}.pptx`);

  return {
    ...jobBase(action.slide_number, action),
    layout_strategy: action.layout_strategy,
    image_strategy: action.image_strategy || "preserve",
    image_action: buildImageOperation(action),
    source_media_refs: action.source_media_refs || [],
    destination_media_refs: action.source_media_refs || [],
    transcript_path: action.transcript_path,
    structured_spec: spec,
    artifact_path: artifactPath,
    status: "planned",
    summary: `Structured rebuild planned for slide ${action.slide_number} (${spec.layout} layout)`
  };
}

function applyAction(params) {
  const { action } = params;
  if (action.action === "revise") {
    return applyReviseAction(params);
  }
  if (["add_after", "split"].includes(action.action)) {
    return applyAdditiveAction(params);
  }
  if (action.action === "remove") {
    return applyRemoveAction(params);
  }
  if (action.action === "merge") {
    return applyMergeAction(params);
  }
  if (action.action === "structured_rebuild") {
    return applyStructuredRebuildAction(params);
  }
  throw new Error(`Unsupported action "${action.action}"`);
}

function applyEditRun(runRoot, updatePlanPath) {
  const manifest = readManifest(runRoot);
  if (manifest.phase !== "edit") {
    throw new Error("applyEditRun requires an edit-phase run");
  }

  const unpackedRoot = path.join(runRoot, "working", "unpacked");
  const slideIndex = loadJson(path.join(runRoot, "artifacts", "original-slide-index.json"));
  const plan = validateUpdatePlan(updatePlanPath || path.join(runRoot, "artifacts", "update_plan.json"));
  const editBrief = loadEditBrief(runRoot, plan);
  const researchDeltaText = loadText(path.join(runRoot, "artifacts", "research_delta.md"));
  const slideResults = [];
  const replaceActions = (plan.slide_actions || []).filter((action) => action.image_strategy === "replace");
  const approvalDecision = loadApprovalDecision(runRoot);

  if (replaceActions.length > 0 && approvalDecision && approvalDecision.status === "rejected") {
    updateManifest(runRoot, { status: "edit" });
    appendEvent(runRoot, {
      type: "image_approval_rejected",
      slides: replaceActions.map((action) => action.slide_number)
    });
    return {
      status: "edit_required",
      runRoot,
      reason: "Image replacement approval was rejected"
    };
  }

  if (replaceActions.length > 0 && (!approvalDecision || approvalDecision.status !== "approved")) {
    const requestPath = path.join(runRoot, "artifacts", "approval-request.json");
    const approvalRequest = {
      status: "pending",
      required_for: replaceActions.map((action) => ({
        slide_number: action.slide_number,
        replacement_reason: action.replacement_reason,
        preview_path: ensureApprovalPreview(runRoot, action)
      }))
    };
    fs.writeFileSync(requestPath, JSON.stringify(approvalRequest, null, 2));
    updateManifest(runRoot, { status: "awaiting_image_approval" });
    writeStageStatus(runRoot, {
      current_stage: "awaiting_image_approval",
      message: "Waiting for image replacement approval"
    });
    appendEvent(runRoot, {
      type: "awaiting_image_approval",
      slides: replaceActions.map((action) => action.slide_number)
    });
    return {
      status: "awaiting_image_approval",
      runRoot,
      approvalRequestPath: requestPath
    };
  }

  plan.slide_actions.forEach((action) => {
    if (action.action === "keep") {
      return;
    }
    const result = applyAction({
      runRoot,
      unpackedRoot,
      slideIndex,
      action,
      changeRequest: editBrief.change_request,
      researchDeltaText
    });
    slideResults.push(result);
    appendEvent(runRoot, {
      type: "edit_job_applied",
      slide_number: result.slide_number,
      action: result.action,
      image_action: result.image_action,
      status: result.status || "applied"
    });
    writeStageStatus(runRoot, {
      current_stage: "edit",
      last_job: {
        slide_number: result.slide_number,
        action: result.action
      }
    });
  });

  const handoff = {
    phase: "edit",
    run_root: runRoot,
    source_deck: "input/original.pptx",
    unpacked_root: "working/unpacked",
    jobs: slideResults,
    slide_order: listPresentationSlides(unpackedRoot).map((slide) => slide.slide_file)
  };

  const outputPath = path.join(runRoot, "artifacts", "edit_handoff.json");
  fs.writeFileSync(outputPath, JSON.stringify(handoff, null, 2));
  updateManifest(runRoot, { status: "edit" });
  appendEvent(runRoot, {
    type: "stage_transition",
    stage: "edit",
    message: "Edit handoff ready"
  });

  return {
    status: "edit_ready",
    recomputed_actions: false,
    handoffPath: outputPath,
    operator_state: {
      stage: "edit",
      stage_label: "Edit scaffold and slide editing",
      message: slideResults.length === 0 ? "No slides selected for edit" : `Updated slides: ${slideResults.filter((job) => job.status === "applied").length}; skipped slides: ${slideResults.filter((job) => job.status === "skipped").length}`
    }
  };
}

module.exports = {
  applyEditRun
};
