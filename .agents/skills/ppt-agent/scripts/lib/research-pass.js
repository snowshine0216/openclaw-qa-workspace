"use strict";

const fs = require("fs");
const path = require("path");

const { stripBullet } = require("./manuscript");
const {
  attachSourceNotes,
  normalizeSourceProvenance,
  writeSourceProvenanceArtifact
} = require("./source-provenance");
const { buildRuntimeContract } = require("./runtime-contract");

const RESEARCH_ROLE_PATH = path.resolve(__dirname, "..", "..", "roles", "research.md");

function runResearchPass({
  runRoot,
  prompt,
  objective,
  audience,
  attachments = [],
  sourceProvenance = [],
  referenceAnalysis = { strategy: "none" },
  manuscriptPath,
  reasoningMode = "scripted_local"
}) {
  const attachmentData = readAttachmentLines(attachments);
  const normalizedProvenance = synthesizeSourceProvenance({
    prompt,
    objective,
    attachmentData,
    sourceProvenance,
    manuscriptPath
  });
  const handoff = buildResearchHandoff({
    prompt,
    objective,
    audience,
    attachmentData,
    sourceProvenance: normalizedProvenance,
    referenceAnalysis,
    reasoningMode
  });
  const handoffPath = path.join(runRoot, "artifacts", "research-handoff.json");
  fs.writeFileSync(handoffPath, JSON.stringify(handoff, null, 2));

  const outputPath = path.join(runRoot, "artifacts", "manuscript.md");
  if (manuscriptPath) {
    const manualManuscript = fs.readFileSync(path.resolve(manuscriptPath), "utf8");
    fs.writeFileSync(
      outputPath,
      manualManuscript.endsWith("\n\n")
        ? manualManuscript
        : manualManuscript.replace(/\n*$/, "\n\n")
    );
  } else {
    const evidenceLines = buildEvidencePool({
      attachmentData,
      sourceProvenance: normalizedProvenance
    });
    if (evidenceLines.length === 0) {
      writeSourceProvenanceArtifact({
        runRoot,
        attachmentData,
        sourceProvenance: normalizedProvenance
      });
      return {
        status: "no_slide",
        reason:
          "No usable source material remained after research intake, so the manuscript collapsed to zero valid slides.",
        handoffPath,
        manuscriptPath: null,
        attachmentData,
        referenceAnalysis
      };
    }
    const manuscript = buildManuscript({
      prompt,
      objective,
      audience,
      attachmentData,
      sourceProvenance: normalizedProvenance
    });
    fs.writeFileSync(outputPath, manuscript);
  }

  writeSourceProvenanceArtifact({
    runRoot,
    attachmentData,
    sourceProvenance: normalizedProvenance
  });

  return {
    status: "ready",
    handoffPath,
    manuscriptPath: outputPath,
    attachmentData,
    referenceAnalysis
  };
}

function buildResearchHandoff({
  prompt,
  objective,
  audience,
  attachmentData,
  sourceProvenance,
  referenceAnalysis,
  reasoningMode
}) {
  return {
    ...buildRuntimeContract({ reasoningMode }),
    mode: "research",
    rolePath: RESEARCH_ROLE_PATH,
    prompt,
    objective,
    audience: audience || "Leadership",
    referenceStrategy: referenceAnalysis.strategy || "none",
    attachmentSummaries: attachmentData.valid.map((entry) => ({
      path: entry.path,
      summary: entry.lines.slice(0, 6)
    })),
    unreadableAttachments: attachmentData.invalid,
    sourceProvenance,
    instructions:
      "Produce manuscript.md with concise business-ready slides and inspectable source provenance notes."
  };
}

function synthesizeSourceProvenance({
  prompt,
  objective,
  attachmentData,
  sourceProvenance,
  manuscriptPath
}) {
  const normalized = normalizeSourceProvenance(sourceProvenance);
  if (normalized.length > 0) {
    return normalized;
  }

  const attachmentEntries = attachmentData.valid.slice(0, 3).map((entry) => ({
    title: path.basename(entry.path),
    locator: entry.path,
    summary: entry.lines.slice(0, 3).join(" ").slice(0, 240)
  }));
  if (attachmentEntries.length > 0) {
    return attachmentEntries;
  }
  if ((attachmentData.requested_count || 0) > 0) {
    return [];
  }
  if (attachmentData.invalid.length > 0) {
    return [];
  }
  if (manuscriptPath) {
    return [];
  }

  throw new Error(
    `Prompt-only research requires inspectable source provenance for "${objective || prompt || "this request"}".`
  );
}

function buildEvidencePool({ attachmentData, sourceProvenance }) {
  return dedupe([
    ...attachmentData.valid.flatMap((entry) => entry.lines),
    ...sourceProvenance.flatMap((entry) => [entry.title, entry.summary])
  ]
    .filter(Boolean)
    .map((line) => String(line).trim())
    .filter((line) => line.length > 4));
}

function buildManuscript({ prompt, objective, audience, attachmentData, sourceProvenance }) {
  const sourceLines = buildSourcePool({
    prompt,
    objective,
    attachmentData,
    sourceProvenance
  });
  const slides = attachSourceNotes(
    createSlideOutline({ prompt, objective, audience, sourceLines }),
    sourceProvenance
  );
  return renderManuscript({
    deckTitle: buildDeckTitle(objective, prompt),
    slides
  });
}

function buildDeckTitle(objective, prompt) {
  return String(objective || prompt || "Business Presentation")
    .trim()
    .replace(/[.?!]+$/g, "");
}

function readAttachmentLines(attachments = []) {
  const valid = [];
  const invalid = [];
  for (const attachment of attachments) {
    const filePath = attachment.path || attachment;
    try {
      const content = fs.readFileSync(filePath, "utf8");
      valid.push({
        path: filePath,
        lines: content
          .split("\n")
          .map(stripBullet)
          .map((line) => line.trim())
          .filter(Boolean)
      });
    } catch (error) {
      invalid.push({ path: filePath, reason: error.message });
    }
  }
  return {
    requested_count: attachments.length,
    valid,
    invalid
  };
}

function buildSourcePool({ prompt, objective, attachmentData, sourceProvenance }) {
  const combined = [
    objective,
    prompt,
    ...attachmentData.valid.flatMap((entry) => entry.lines),
    ...sourceProvenance.flatMap((entry) => [entry.title, entry.summary])
  ]
    .filter(Boolean)
    .map((line) => String(line).trim())
    .filter((line) => line.length > 4);

  return dedupe(combined);
}

function createSlideOutline({ prompt, objective, audience, sourceLines }) {
  const marketLines = selectLines(sourceLines, /\b(market|adoption|trend|usage|demand|growth)\b/i);
  const riskLines = selectLines(sourceLines, /\b(risk|governance|constraint|issue|audit)\b/i);
  const processLines = selectLines(sourceLines, /\b(process|phase|rollout|pilot|workflow|plan)\b/i);
  const recommendationLines = selectLines(sourceLines, /\b(recommend|decision|approve|next step|leadership)\b/i);

  return [
    {
      title: "Executive Summary",
      bodyLines: boundedLines(marketLines, [
        objective || "Summarize the key market takeaway.",
        audience ? `Audience: ${audience}` : "Audience: leadership"
      ])
    },
    {
      title: "Market Comparison",
      bodyLines: boundedLines(marketLines, [
        prompt || "Frame the category shift.",
        "Compare the most relevant vendor or operating choices."
      ])
    },
    {
      title: "Delivery Process",
      bodyLines: boundedLines(processLines, [
        "Show the phased rollout from pilot to governed production.",
        "Keep the process business-readable and low-clutter."
      ])
    },
    {
      title: "Risks And Controls",
      bodyLines: boundedLines(riskLines, [
        "Clarify the main governance and delivery risks.",
        "Show which controls reduce executive risk."
      ])
    },
    {
      title: "Recommendation",
      bodyLines: boundedLines(recommendationLines, [
        "State the leadership decision or approval required.",
        "End with the next action and time horizon."
      ])
    }
  ];
}

function renderManuscript({ deckTitle, slides }) {
  const parts = [`# ${deckTitle}`];
  for (const slide of slides) {
    parts.push("");
    parts.push(`Slide title: ${slide.title}`);
    for (const bodyLine of slide.bodyLines) {
      parts.push(`- ${bodyLine}`);
    }
    if (slide.sourceNotes && slide.sourceNotes.length > 0) {
      parts.push("Source provenance notes:");
      for (const note of slide.sourceNotes) {
        parts.push(`Source note: ${note}`);
      }
    }
    parts.push("");
    parts.push("---");
  }
  return parts.join("\n").replace(/\n---$/, "");
}

function selectLines(lines, pattern) {
  const matches = lines.filter((line) => pattern.test(line));
  return matches.length > 0 ? matches : lines.slice(0, 2);
}

function boundedLines(primary, fallback) {
  return dedupe([...primary, ...fallback]).slice(0, 4);
}

function dedupe(lines) {
  const seen = new Set();
  return lines.filter((line) => {
    const key = line.toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

module.exports = {
  RESEARCH_ROLE_PATH,
  buildResearchHandoff,
  runResearchPass
};
