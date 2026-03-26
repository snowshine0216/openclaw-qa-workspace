"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const CREATE_STAGES = ["intake", "research", "design", "build", "evaluate", "needs_context", "complete", "failed"];
const EDIT_STAGES = [
  "intake",
  "analyze",
  "research",
  "plan",
  "edit",
  "awaiting_image_approval",
  "evaluate",
  "needs_context",
  "complete",
  "failed"
];
const STAGES = Array.from(new Set([...CREATE_STAGES, ...EDIT_STAGES]));

const CREATE_COMPATIBILITY_KEYS = [
  "phase",
  "normalized_brief_hash",
  "source_fingerprint_hash",
  "manual_artifact_hash",
  "reference_strategy",
  "style_contract_version"
];

const EDIT_COMPATIBILITY_KEYS = [
  "phase",
  "source_deck_hash",
  "change_fingerprint_hash",
  "style_preservation_mode",
  "restyle_mode",
  "style_contract_version"
];

function hashValue(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex");
}

function createRunId(input, now = new Date()) {
  const timestamp = now.toISOString().replace(/[-:TZ.]/g, "").slice(0, 12);
  const suffix = hashValue(input).slice(0, 6);
  return `${timestamp}-${suffix}`;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function normalizeRelativePath(filePath) {
  return String(filePath || "").replace(/\\/g, "/");
}

function assertArtifactPathInsideRun(runRoot, relativePath, fieldName) {
  const normalized = normalizeRelativePath(relativePath);
  if (!normalized || normalized.startsWith("/") || /^[A-Za-z]:\//.test(normalized)) {
    throw new Error(`Manifest artifact path "${fieldName}" must be relative to the run root`);
  }
  const resolved = path.resolve(runRoot, normalized);
  const relative = path.relative(runRoot, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Manifest artifact path "${fieldName}" points outside the run root`);
  }
}

function validateArtifactPaths(runRoot, artifactPaths) {
  Object.entries(artifactPaths || {}).forEach(([key, value]) => {
    if (typeof value !== "string") {
      throw new Error(`Manifest artifact path "${key}" must be a string`);
    }
    assertArtifactPathInsideRun(runRoot, value, key);
  });
}

function defaultArtifactPaths(phase = "create") {
  if (phase === "edit") {
    return {
      original_text: "artifacts/original-text.md",
      original_slide_index: "artifacts/original-slide-index.json",
      raw_slide_captions: "artifacts/raw-slide-captions.json",
      slide_analysis: "artifacts/slide_analysis.json",
      source_media_index: "artifacts/source-media-index.json",
      research_delta: "artifacts/research_delta.md",
      update_plan_md: "artifacts/update_plan.md",
      update_plan_json: "artifacts/update_plan.json",
      slide_transcripts_dir: "artifacts/slide-transcripts",
      transcript_index: "artifacts/transcript-index.json",
      pre_edit_checkpoint: "artifacts/pre_edit_checkpoint.md",
      manual_handoff: "artifacts/manual_handoff.md",
      edit_handoff: "artifacts/edit_handoff.json",
      output_pptx: "artifacts/output-updated.pptx",
      comparison_evals: "artifacts/comparison_evals.json",
      approval_request: "artifacts/approval-request.json",
      approval_decision: "artifacts/approval-decision.json",
      replacement_previews_dir: "artifacts/replacement-previews",
      run_summary_md: "artifacts/run_summary.md",
      operator_summary_json: "artifacts/operator-summary.json",
      event_log: "logs/events.jsonl",
      stage_status: "logs/stage-status.json"
    };
  }

  return {
    manuscript: "artifacts/manuscript.md",
    design_plan: "artifacts/design_plan.md",
    slide_build_spec: "artifacts/slide-build-spec.json",
    output_pptx: "artifacts/output.pptx",
    evals: "artifacts/evals.json",
    event_log: "logs/events.jsonl",
    stage_status: "logs/stage-status.json"
  };
}

function ensureRunDirs(runRoot, phase) {
  ensureDir(runRoot);
  ensureDir(path.join(runRoot, "input"));
  ensureDir(path.join(runRoot, "artifacts"));
  ensureDir(path.join(runRoot, "renders"));
  ensureDir(path.join(runRoot, "logs"));
  if (phase === "edit") {
    ensureDir(path.join(runRoot, "working"));
    ensureDir(path.join(runRoot, "renders", "before"));
    ensureDir(path.join(runRoot, "renders", "after"));
    ensureDir(path.join(runRoot, "artifacts", "slide-transcripts"));
    ensureDir(path.join(runRoot, "artifacts", "replacement-previews"));
  }
}

function initRunState({
  rootDir,
  phase = "create",
  normalizedBriefHash,
  sourceFingerprintHash,
  manualArtifactHash = null,
  referenceStrategy = "none",
  sourceDeckHash,
  changeFingerprintHash,
  stylePreservationMode = "preserve",
  restyleMode = "none",
  styleContractVersion = "v1",
  runId
}) {
  if (!rootDir) {
    throw new Error("rootDir is required");
  }

  const fingerprint =
    phase === "edit"
      ? `${sourceDeckHash}:${changeFingerprintHash}:${stylePreservationMode}:${restyleMode}`
      : `${normalizedBriefHash}:${sourceFingerprintHash}:${manualArtifactHash || "none"}:${referenceStrategy}`;
  const generatedRunId = runId || createRunId(`${phase}:${fingerprint}`);
  const runRoot = path.join(rootDir, generatedRunId);
  const manifest =
    phase === "edit"
      ? {
          run_id: generatedRunId,
          phase: "edit",
          status: "intake",
          source_deck_hash: sourceDeckHash,
          change_fingerprint_hash: changeFingerprintHash,
          style_preservation_mode: stylePreservationMode,
          restyle_mode: restyleMode,
          style_contract_version: styleContractVersion,
          artifact_paths: defaultArtifactPaths("edit")
        }
      : {
          run_id: generatedRunId,
          phase: "create",
          status: "intake",
          normalized_brief_hash: normalizedBriefHash,
          source_fingerprint_hash: sourceFingerprintHash,
          manual_artifact_hash: manualArtifactHash,
          reference_strategy: referenceStrategy,
          style_contract_version: styleContractVersion,
          artifact_paths: defaultArtifactPaths("create")
        };

  ensureRunDirs(runRoot, phase);
  validateArtifactPaths(runRoot, manifest.artifact_paths);
  fs.writeFileSync(path.join(runRoot, "manifest.json"), JSON.stringify(manifest, null, 2));

  return { runRoot, manifest };
}

function requiredManifestFields(phase) {
  if (phase === "edit") {
    return [
      "run_id",
      "phase",
      "status",
      "source_deck_hash",
      "change_fingerprint_hash",
      "style_preservation_mode",
      "restyle_mode",
      "style_contract_version",
      "artifact_paths"
    ];
  }

  return [
    "run_id",
    "phase",
    "status",
    "normalized_brief_hash",
    "source_fingerprint_hash",
    "manual_artifact_hash",
    "reference_strategy",
    "style_contract_version",
    "artifact_paths"
  ];
}

function readManifest(runRoot) {
  const manifestPath = path.join(runRoot, "manifest.json");
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (error) {
    throw new Error(`Invalid or unreadable manifest at ${manifestPath}`);
  }

  if (!parsed.phase || !["create", "edit"].includes(parsed.phase)) {
    throw new Error(`Manifest has unsupported phase "${parsed.phase}"`);
  }

  for (const key of requiredManifestFields(parsed.phase)) {
    if (!(key in parsed)) {
      throw new Error(`Manifest missing required field "${key}"`);
    }
  }
  validateArtifactPaths(runRoot, parsed.artifact_paths);

  const allowedStages = parsed.phase === "edit" ? EDIT_STAGES : CREATE_STAGES;
  if (!allowedStages.includes(parsed.status)) {
    throw new Error(`Manifest has unsupported status "${parsed.status}"`);
  }

  return parsed;
}

function updateManifest(runRoot, patch) {
  const manifestPath = path.join(runRoot, "manifest.json");
  const manifest = readManifest(runRoot);
  const nextManifest = {
    ...manifest,
    ...patch,
    artifact_paths: {
      ...manifest.artifact_paths,
      ...(patch.artifact_paths || {})
    }
  };
  validateArtifactPaths(runRoot, nextManifest.artifact_paths);
  fs.writeFileSync(manifestPath, JSON.stringify(nextManifest, null, 2));
  return nextManifest;
}

function compatibilityKeys(phase) {
  return phase === "edit" ? EDIT_COMPATIBILITY_KEYS : CREATE_COMPATIBILITY_KEYS;
}

function isCompatibleRun(manifest, desired) {
  if (manifest.phase !== desired.phase) {
    return false;
  }
  return compatibilityKeys(desired.phase).every((key) => manifest[key] === (desired[key] ?? null));
}

function findLatestCompatibleRun(rootDir, desired) {
  if (!fs.existsSync(rootDir)) {
    return null;
  }

  const candidates = fs
    .readdirSync(rootDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(rootDir, entry.name))
    .sort()
    .reverse();

  for (const runRoot of candidates) {
    try {
      const manifest = readManifest(runRoot);
      if (isCompatibleRun(manifest, desired)) {
        return { runRoot, manifest };
      }
    } catch {
      continue;
    }
  }
  return null;
}

function determineCreateResumeStage(previous, next) {
  if (previous.normalized_brief_hash !== next.normalized_brief_hash) {
    return "intake";
  }
  if (previous.source_fingerprint_hash !== next.source_fingerprint_hash) {
    return "research";
  }
  if (
    previous.manual_artifact_hash !== next.manual_artifact_hash ||
    previous.reference_strategy !== next.reference_strategy ||
    previous.style_contract_version !== next.style_contract_version
  ) {
    return previous.manual_artifact_hash !== next.manual_artifact_hash ? "research" : "design";
  }
  return "build";
}

function determineEditResumeStage(previous, next) {
  if (previous.source_deck_hash !== next.source_deck_hash) {
    return "analyze";
  }
  if (previous.change_fingerprint_hash !== next.change_fingerprint_hash) {
    return "research";
  }
  if (
    previous.style_preservation_mode !== next.style_preservation_mode ||
    previous.restyle_mode !== next.restyle_mode ||
    previous.style_contract_version !== next.style_contract_version
  ) {
    return "plan";
  }
  return "edit";
}

function determineResumeStage(previous, next) {
  const phase = next.phase || previous.phase || "create";
  return phase === "edit"
    ? determineEditResumeStage(previous, next)
    : determineCreateResumeStage(previous, next);
}

function detectCreateResumeStage(runRoot) {
  const required = [
    ["research", [path.join(runRoot, "artifacts", "manuscript.md")]],
    ["design", [path.join(runRoot, "artifacts", "design_plan.md")]],
    [
      "build",
      [
        path.join(runRoot, "artifacts", "slide-build-spec.json"),
        path.join(runRoot, "artifacts", "pptx-handoff.json"),
        path.join(runRoot, "artifacts", "output.pptx")
      ]
    ],
    ["evaluate", [path.join(runRoot, "artifacts", "evals.json")]]
  ];

  for (const [stage, files] of required) {
    if (files.some((filePath) => !fs.existsSync(filePath))) {
      return stage;
    }
  }

  return "complete";
}

function detectEditResumeStage(runRoot) {
  const approvalRequestPath = path.join(runRoot, "artifacts", "approval-request.json");
  const approvalDecisionPath = path.join(runRoot, "artifacts", "approval-decision.json");
  if (fs.existsSync(approvalRequestPath) && !fs.existsSync(approvalDecisionPath)) {
    return "awaiting_image_approval";
  }
  if (fs.existsSync(approvalDecisionPath)) {
    try {
      const decision = JSON.parse(fs.readFileSync(approvalDecisionPath, "utf8"));
      if (decision.status === "approved") {
        return "evaluate";
      }
      if (decision.status === "rejected") {
        return "edit";
      }
    } catch {
      return "awaiting_image_approval";
    }
  }

  const required = [
    [
      "analyze",
      [
        path.join(runRoot, "artifacts", "original-text.md"),
        path.join(runRoot, "artifacts", "original-slide-index.json"),
        path.join(runRoot, "artifacts", "raw-slide-captions.json"),
        path.join(runRoot, "artifacts", "slide_analysis.json"),
        path.join(runRoot, "artifacts", "source-media-index.json")
      ]
    ],
    ["research", [path.join(runRoot, "artifacts", "research_delta.md")]],
    [
      "plan",
      [
        path.join(runRoot, "artifacts", "update_plan.md"),
        path.join(runRoot, "artifacts", "update_plan.json"),
        path.join(runRoot, "artifacts", "transcript-index.json")
      ]
    ],
    ["edit", [path.join(runRoot, "artifacts", "edit_handoff.json")]],
    [
      "evaluate",
      [
        path.join(runRoot, "artifacts", "output-updated.pptx"),
        path.join(runRoot, "artifacts", "comparison_evals.json")
      ]
    ]
  ];

  for (const [stage, files] of required) {
    if (files.some((filePath) => !fs.existsSync(filePath))) {
      return stage;
    }
  }

  return "complete";
}

function detectResumeStage(runRoot) {
  const manifest = readManifest(runRoot);
  return manifest.phase === "edit" ? detectEditResumeStage(runRoot) : detectCreateResumeStage(runRoot);
}

module.exports = {
  CREATE_STAGES,
  EDIT_STAGES,
  STAGES,
  createRunId,
  initRunState,
  readManifest,
  updateManifest,
  findLatestCompatibleRun,
  determineResumeStage,
  detectResumeStage
};
