"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const {
  detectResumeStage,
  findLatestCompatibleRun,
  initRunState
} = require("./run-manifest");
const { writePptxHandoff } = require("./pptx-handoff");
const {
  normalizeSourceProvenance
} = require("./source-provenance");
const {
  analyzeReferences,
  writeReferenceAnalysisArtifact
} = require("./reference-analysis");
const { assessPromptOnlyGrounding } = require("./prompt-grounding");
const { runResearchPass } = require("./research-pass");
const { runDesignPass } = require("./design-pass");

function hashJson(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function isPromptResearchable(prompt) {
  const normalized = normalizeText(prompt);
  if (normalized.length < 20) {
    return false;
  }
  if (/\b(my|our|internal|confidential|private|secret)\b/i.test(normalized)) {
    return false;
  }
  return true;
}

function deriveObjective({ prompt, objective }) {
  const explicit = normalizeText(objective);
  if (explicit) {
    return explicit;
  }
  const normalizedPrompt = normalizeText(prompt);
  if (!normalizedPrompt) {
    return "";
  }
  return normalizedPrompt.slice(0, 120);
}

function selectReferenceStrategy({ references = [], preferredReferenceMode } = {}) {
  if (preferredReferenceMode) {
    return preferredReferenceMode;
  }
  const analysis = analyzeReferences({ references });
  return analysis.strategy;
}

function hasUriScheme(value) {
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(String(value || ""));
}

function fingerprintSourceEntry(item, defaultKind) {
  const sourcePath = item?.path || item;
  const normalized = {
    path: sourcePath,
    kind: item?.kind || defaultKind
  };

  if (!sourcePath || hasUriScheme(sourcePath)) {
    return normalized;
  }

  const resolvedPath = path.resolve(String(sourcePath));
  if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isFile()) {
    return {
      ...normalized,
      content_hash: `missing:${resolvedPath}`
    };
  }

  return {
    ...normalized,
    content_hash: crypto.createHash("sha256").update(fs.readFileSync(resolvedPath)).digest("hex")
  };
}

function buildSourceFingerprint({ attachments = [], references = [], sourceProvenance = [] } = {}) {
  const normalized = {
    attachments: attachments.map((item) => fingerprintSourceEntry(item, "attachment")),
    references: references.map((item) => fingerprintSourceEntry(item, "reference")),
    source_provenance: normalizeSourceProvenance(sourceProvenance)
  };
  return hashJson(normalized);
}

function buildNormalizedBrief({ prompt, objective, audience, slideCount, referenceStrategy }) {
  return {
    prompt: normalizeText(prompt),
    objective: deriveObjective({ prompt, objective }),
    audience: normalizeText(audience),
    slide_count: slideCount || null,
    reference_strategy: referenceStrategy
  };
}

function initializeCreateWorkflow({
  rootDir,
  prompt,
  objective,
  audience,
  slideCount,
  attachments = [],
  references = [],
  preferredReferenceMode,
  sourceProvenance = [],
  manualArtifactHash = null
}) {
  const normalizedPrompt = normalizeText(prompt);
  const normalizedObjective = normalizeText(objective);
  if (!normalizedPrompt || !normalizedObjective) {
    return {
      status: "insufficient_brief",
      reason: "Missing explicit objective or prompt."
    };
  }

  const referenceAnalysis = analyzeReferences({
    references,
    preferredReferenceMode
  });
  const referenceStrategy = referenceAnalysis.strategy;

  const normalizedBrief = buildNormalizedBrief({
    prompt: normalizedPrompt,
    objective: normalizedObjective,
    audience,
    slideCount,
    referenceStrategy
  });

  const promptOnly = attachments.length === 0;
  const normalizedProvenance = normalizeSourceProvenance(sourceProvenance);
  if (promptOnly && !isPromptResearchable(normalizedPrompt)) {
    return {
      status: "insufficient_brief",
      reason: "Prompt-only request is not grounded enough for Phase 1."
    };
  }
  if (promptOnly && !manualArtifactHash) {
    const grounding = assessPromptOnlyGrounding({
      prompt: normalizedPrompt,
      objective: normalizedObjective,
      sourceProvenance: normalizedProvenance
    });
    if (!grounding.ok) {
      return {
        status: "insufficient_brief",
        reason: grounding.reason
      };
    }
  }
  const normalizedBriefHash = hashJson(normalizedBrief);
  const sourceFingerprintHash = buildSourceFingerprint({
    attachments,
    references,
    sourceProvenance: normalizedProvenance
  });
  const desired = {
    phase: "create",
    normalized_brief_hash: normalizedBriefHash,
    source_fingerprint_hash: sourceFingerprintHash,
    reference_strategy: referenceStrategy,
    style_contract_version: "v1",
    manual_artifact_hash: manualArtifactHash
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
          normalizedBriefHash,
          sourceFingerprintHash,
          referenceStrategy,
          manualArtifactHash
        }),
        resumed: false,
        resumeStage: "research"
      };

  const briefPath = path.join(runRoot, "input", "brief.json");
  const sourceFingerprintPath = path.join(runRoot, "input", "source_fingerprint.json");
  const referenceSelectionPath = path.join(runRoot, "input", "reference_selection.json");

  fs.writeFileSync(briefPath, JSON.stringify(normalizedBrief, null, 2));
  fs.writeFileSync(
    sourceFingerprintPath,
    JSON.stringify(
      {
        attachments,
        references,
        source_provenance: normalizedProvenance,
        source_fingerprint_hash: sourceFingerprintHash
      },
      null,
      2
    )
  );
  fs.writeFileSync(
    referenceSelectionPath,
    JSON.stringify(
      {
        strategy: referenceStrategy,
        references,
        analysis: referenceAnalysis
      },
      null,
      2
    )
  );

  return {
    status: "ready",
    runRoot,
    manifest,
    normalizedBrief,
    promptOnly,
    referenceAnalysis,
    resumed,
    resumeStage
  };
}

function createPhaseArtifacts({
  runRoot,
  prompt,
  objective,
  audience,
  attachments = [],
  references = [],
  referenceStrategy,
  manuscriptPath,
  designPlanPath,
  sourceProvenance = []
}) {
  const referenceAnalysis = analyzeReferences({
    references,
    preferredReferenceMode: referenceStrategy
  });
  const referenceAnalysisArtifact = writeReferenceAnalysisArtifact({
    runRoot,
    analysis: referenceAnalysis
  });
  const research = runResearchPass({
    runRoot,
    prompt,
    objective,
    audience,
    attachments,
    sourceProvenance,
    referenceAnalysis,
    manuscriptPath,
    reasoningMode: manuscriptPath ? "manual_artifact" : "scripted_local"
  });
  if (research.status !== "ready") {
    return {
      status: research.status,
      reason: research.reason,
      referenceAnalysisPath: referenceAnalysisArtifact.outputPath,
      researchHandoffPath: research.handoffPath,
      unreadableAttachments: research.attachmentData.invalid
    };
  }
  const design = runDesignPass({
    runRoot,
    prompt,
    objective,
    audience,
    manuscriptPath: research.manuscriptPath,
    referenceAnalysis,
    designPlanPath,
    reasoningMode: designPlanPath ? "manual_artifact" : "scripted_local"
  });
  const handoff = writePptxHandoff({
    runRoot,
    slideBuildSpec: design.slideBuildSpec,
    slideBuildSpecPath: design.slideBuildSpecPath
  });

  return {
    status: "ready",
    manuscriptPath: research.manuscriptPath,
    designPlanPath: design.designPlanPath,
    slideBuildSpecPath: design.slideBuildSpecPath,
    slideBuildSpec: design.slideBuildSpec,
    referenceAnalysisPath: referenceAnalysisArtifact.outputPath,
    researchHandoffPath: research.handoffPath,
    designHandoffPath: design.handoffPath,
    pptxHandoffPath: handoff.handoffPath
  };
}

module.exports = {
  isPromptResearchable,
  selectReferenceStrategy,
  initializeCreateWorkflow,
  createPhaseArtifacts
};
