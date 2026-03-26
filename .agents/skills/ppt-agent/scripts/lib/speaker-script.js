"use strict";

const fs = require("fs");
const path = require("path");

/**
 * Generate opening line for speaker notes
 */
function generateOpening(brief) {
  if (brief.action === "keep") {
    return "";
  }

  const title = brief.title || "";
  const takeaway = brief.audience_takeaway || "";

  if (takeaway && takeaway !== title && takeaway !== "No changes") {
    return `${takeaway}`;
  }

  return `This slide covers: ${title}`;
}

/**
 * Generate main explanation from speaker script
 */
function generateMainExplanation(brief) {
  if (brief.action === "keep") {
    return "";
  }

  const script = brief.speaker_script || "";
  const onSlideCopy = brief.on_slide_copy || "";

  // If speaker_script is richer than on_slide_copy, use it
  if (script && script.length > onSlideCopy.length + 50) {
    return script;
  }

  // Otherwise combine available content
  const parts = [];
  if (script) {
    parts.push(script);
  }
  if (onSlideCopy && !script.includes(onSlideCopy)) {
    parts.push(`Key points on slide: ${onSlideCopy}`);
  }

  return parts.join("\n\n") || "See slide content for details.";
}

/**
 * Generate evidence callouts section
 */
function generateEvidenceCallouts(brief) {
  if (brief.action === "keep" || !brief.evidence_points || brief.evidence_points.length === 0) {
    return "";
  }

  const points = brief.evidence_points.map(point => `- ${point}`).join("\n");
  return points;
}

/**
 * Generate transition line
 */
function generateTransitionLine(brief, nextBrief) {
  if (brief.action === "keep") {
    return "";
  }

  if (nextBrief && nextBrief.title) {
    return `This leads us to: ${nextBrief.title}`;
  }

  return "Let's move to the next topic.";
}

/**
 * Generate questions to anticipate
 */
function generateQuestionsToAnticipate(brief) {
  if (brief.action === "keep") {
    return "";
  }

  const questions = [];
  const compositionFamily = brief.composition_family || "";

  // Generate context-aware questions based on composition family
  if (compositionFamily === "qa_two_column") {
    questions.push("What are the most common questions about this topic?");
  } else if (compositionFamily === "evidence_panel") {
    questions.push("What's the source of this data?");
    questions.push("How recent is this information?");
  } else if (compositionFamily === "process_flow") {
    questions.push("How long does this process take?");
    questions.push("What are the key dependencies?");
  } else if (compositionFamily === "comparison_matrix") {
    questions.push("Which option is recommended?");
    questions.push("What are the tradeoffs?");
  } else {
    questions.push("Can you provide more detail on this?");
  }

  return questions.map(q => `- ${q}`).join("\n");
}

/**
 * Generate speaker notes for a single slide from its brief
 */
function generateSpeakerNotes(brief, nextBrief = null) {
  // Skip notes generation for "keep" slides
  if (brief.action === "keep") {
    return null;
  }

  const sections = [];

  // Opening
  const opening = generateOpening(brief);
  if (opening) {
    sections.push("## Opening\n\n" + opening);
  }

  // Main explanation
  const mainExplanation = generateMainExplanation(brief);
  if (mainExplanation) {
    sections.push("## Main explanation\n\n" + mainExplanation);
  }

  // Evidence callouts
  const evidenceCallouts = generateEvidenceCallouts(brief);
  if (evidenceCallouts) {
    sections.push("## Evidence callouts\n\n" + evidenceCallouts);
  }

  // Transition line
  const transitionLine = generateTransitionLine(brief, nextBrief);
  if (transitionLine) {
    sections.push("## Transition line\n\n" + transitionLine);
  }

  // Questions to anticipate
  const questions = generateQuestionsToAnticipate(brief);
  if (questions) {
    sections.push("## Questions to anticipate\n\n" + questions);
  }

  return sections.join("\n\n");
}

/**
 * Generate speaker notes artifacts from slide briefs
 */
function generateSpeakerNotesArtifacts({ runRoot }) {
  const slideBriefsDir = path.join(runRoot, "artifacts", "slide-briefs");
  const speakerNotesDir = path.join(runRoot, "artifacts", "speaker-notes");

  if (!fs.existsSync(slideBriefsDir)) {
    throw new Error("slide-briefs directory not found. Cannot generate speaker notes.");
  }

  // Clean and create speaker-notes directory
  fs.rmSync(speakerNotesDir, { recursive: true, force: true });
  fs.mkdirSync(speakerNotesDir, { recursive: true });

  // Read all slide briefs
  const briefFiles = fs.readdirSync(slideBriefsDir)
    .filter(name => /^slide-\d+\.json$/.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const briefs = briefFiles.map(file => {
    const briefPath = path.join(slideBriefsDir, file);
    return JSON.parse(fs.readFileSync(briefPath, "utf8"));
  });

  const presenterScriptSections = [];
  const generatedNotes = [];

  // Generate per-slide notes
  briefs.forEach((brief, index) => {
    const nextBrief = index < briefs.length - 1 ? briefs[index + 1] : null;
    const notes = generateSpeakerNotes(brief, nextBrief);

    if (notes) {
      const slideNumber = brief.slide_number;
      const notesPath = path.join(speakerNotesDir, `slide-${String(slideNumber).padStart(2, "0")}.md`);

      const fullNotes = [
        `# Slide ${slideNumber}: ${brief.title}`,
        "",
        notes
      ].join("\n");

      fs.writeFileSync(notesPath, fullNotes);
      generatedNotes.push({
        slide_number: slideNumber,
        notes_path: path.relative(runRoot, notesPath)
      });

      // Add to presenter script
      presenterScriptSections.push(fullNotes);
    }
  });

  // Generate presenter-script.md (deck-level stitched script)
  const presenterScriptPath = path.join(runRoot, "artifacts", "presenter-script.md");
  const presenterScript = [
    "# Presenter Script",
    "",
    "This document contains the complete speaker notes for all slides in the presentation.",
    "",
    "---",
    "",
    ...presenterScriptSections.map(section => section + "\n\n---\n")
  ].join("\n");

  fs.writeFileSync(presenterScriptPath, presenterScript);

  return {
    status: "ok",
    speakerNotesDir,
    presenterScriptPath: path.relative(runRoot, presenterScriptPath),
    totalNotes: generatedNotes.length,
    notes: generatedNotes
  };
}

module.exports = {
  generateSpeakerNotes,
  generateSpeakerNotesArtifacts,
  generateOpening,
  generateMainExplanation,
  generateEvidenceCallouts,
  generateTransitionLine,
  generateQuestionsToAnticipate
};
