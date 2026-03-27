"use strict";

const fs = require("fs");
const path = require("path");

const ACTIONS = new Set(["keep", "revise", "split", "merge", "add_after", "remove", "structured_rebuild"]);
const RISK_LEVELS = new Set(["low", "medium", "high"]);
const IMAGE_STRATEGIES = new Set(["forbid", "preserve", "refine", "replace", "generate_new", "optional"]);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function hasConcreteLayoutAnchor(anchor) {
  if (!anchor || typeof anchor !== "object") {
    return false;
  }
  return ["title_box", "body_box", "image_box"].some((key) => typeof anchor[key] === "string" && anchor[key].trim().length > 0);
}

function validateSlideAction(action, seenSlides) {
  assert(Number.isInteger(action.slide_number) && action.slide_number > 0, "slide_number is required");
  assert(typeof action.action === "string" && ACTIONS.has(action.action), "action is required");
  assert(typeof action.reason === "string" && action.reason.trim().length > 0, "reason is required");
  assert(!seenSlides.has(action.slide_number), `slide ${action.slide_number} has more than one action`);
  seenSlides.add(action.slide_number);

  if (["add_after", "split"].includes(action.action)) {
    assert(action.layout_seed, `${action.action} requires layout_seed`);
  }
  if (action.action === "merge") {
    assert(action.merge_into || action.keeper_slide, "merge must declare merge_into or keeper_slide");
  }
  if (action.action === "keep") {
    assert(!action.edit_scope, "keep actions cannot declare edit scope");
  } else {
    assert(Array.isArray(action.preserve) && action.preserve.length > 0, "non-keep actions require preserve tokens");
    assert(typeof action.visual_role === "string" && action.visual_role.trim().length > 0, "non-keep actions require visual_role");
    assert(IMAGE_STRATEGIES.has(action.image_strategy), "non-keep actions require a supported image_strategy");
    assert(typeof action.image_rationale === "string" && action.image_rationale.trim().length > 0, "non-keep actions require image_rationale");
    assert(typeof action.layout_strategy === "string" && action.layout_strategy.trim().length > 0, "non-keep actions require layout_strategy");
    assert(typeof action.allowed_layout_delta === "string" && action.allowed_layout_delta.trim().length > 0, "non-keep actions require allowed_layout_delta");
    assert(typeof action.transcript_path === "string" && action.transcript_path.trim().length > 0, "non-keep actions require transcript_path");
    assert(Number.isInteger(action.source_slide_number) && action.source_slide_number > 0, "non-keep actions require source_slide_number");
    assert(action.source_layout_anchor && typeof action.source_layout_anchor === "object", "non-keep actions require source_layout_anchor");
    assert(Array.isArray(action.source_media_refs), "non-keep actions require source_media_refs");
    if (!["add_after"].includes(action.action)) {
      assert(hasConcreteLayoutAnchor(action.source_layout_anchor), "non-new actions require concrete source_layout_anchor values");
    }
  }
  if (action.action === "keep") {
    return;
  }
  if (action.visual_role === "agenda") {
    assert(action.image_strategy !== "generate_new", "generate_new is invalid on agenda slides");
  }
  if ((action.source_media_refs || []).length > 0 || action.has_existing_media) {
    assert(typeof action.allowed_image_delta === "string" && action.allowed_image_delta.trim().length > 0, "slides with existing media require allowed_image_delta");
  }
  if (action.image_strategy === "replace") {
    assert(typeof action.replacement_reason === "string" && action.replacement_reason.trim().length > 0, "replace requires replacement_reason");
    assert(typeof action.replacement_preview_path === "string" && action.replacement_preview_path.trim().length > 0, "replace requires replacement_preview_path");
    assert(typeof action.user_approval_status === "string" && action.user_approval_status.trim().length > 0, "replace requires user_approval_status");
  }
  if (action.drift_risk !== undefined) {
    assert(RISK_LEVELS.has(action.drift_risk), "drift_risk must be low, medium, or high");
  }
}

function validateUpdatePlanObject(plan) {
  assert(plan && typeof plan === "object", "update plan must be an object");
  assert(Array.isArray(plan.slide_actions), "slide_actions array is required");
  const seenSlides = new Set();
  plan.slide_actions.forEach((action) => validateSlideAction(action, seenSlides));
  return plan;
}

function validateUpdatePlan(updatePlanPath) {
  const resolvedPath = path.resolve(updatePlanPath);
  return validateUpdatePlanObject(JSON.parse(fs.readFileSync(resolvedPath, "utf8")));
}

module.exports = {
  validateUpdatePlan,
  validateUpdatePlanObject
};
