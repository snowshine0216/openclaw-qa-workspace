"use strict";

const fs = require("fs");
const path = require("path");

const { parseManuscriptSlides } = require("./manuscript");
const { DEFAULT_TOKENS } = require("./phase1-content");
const { STYLE_LAYOUT_MAP } = require("./reference-analysis");
const { buildRuntimeContract } = require("./runtime-contract");
const {
  defaultImageStrategy,
  determineVisualRole,
  isTextSafeVisualFallback
} = require("./slide-transcript");

const DESIGN_ROLE_PATH = path.resolve(__dirname, "..", "..", "roles", "design.md");

function runDesignPass({
  runRoot,
  prompt,
  objective,
  audience,
  manuscriptPath,
  referenceAnalysis = { strategy: "none", styleInfluence: {}, structureInfluence: {} },
  designPlanPath,
  reasoningMode = "scripted_local"
}) {
  const normalizedManuscriptPath = path.resolve(manuscriptPath);
  const normalizedDesignPlanPath = path.join(runRoot, "artifacts", "design_plan.md");
  const slideBuildSpecPath = path.join(runRoot, "artifacts", "slide-build-spec.json");
  const handoffPath = path.join(runRoot, "artifacts", "design-handoff.json");
  const manuscript = parseManuscriptSlides(fs.readFileSync(normalizedManuscriptPath, "utf8"));

  const handoff = buildDesignHandoff({
    prompt,
    objective,
    audience,
    manuscriptPath: normalizedManuscriptPath,
    referenceAnalysis,
    reasoningMode
  });
  fs.writeFileSync(handoffPath, JSON.stringify(handoff, null, 2));

  if (designPlanPath) {
    const manualDesignPlan = fs.readFileSync(path.resolve(designPlanPath), "utf8");
    fs.writeFileSync(
      normalizedDesignPlanPath,
      manualDesignPlan.endsWith("\n") ? manualDesignPlan : `${manualDesignPlan}\n`
    );
  } else {
    const designPlan = renderDesignPlan({
      prompt,
      objective,
      audience,
      manuscript,
      referenceAnalysis
    });
    fs.writeFileSync(normalizedDesignPlanPath, designPlan);
  }

  const slideBuildSpec = buildSlideBuildSpec({
    manuscript,
    manuscriptPath: normalizedManuscriptPath,
    designPlanPath: normalizedDesignPlanPath,
    referenceAnalysis,
    reasoningMode
  });
  fs.writeFileSync(slideBuildSpecPath, JSON.stringify(slideBuildSpec, null, 2));

  return {
    handoffPath,
    designPlanPath: normalizedDesignPlanPath,
    slideBuildSpecPath,
    slideBuildSpec
  };
}

function buildDesignHandoff({
  prompt,
  objective,
  audience,
  manuscriptPath,
  referenceAnalysis,
  reasoningMode
}) {
  return {
    ...buildRuntimeContract({ reasoningMode }),
    mode: "design",
    rolePath: DESIGN_ROLE_PATH,
    prompt,
    objective,
    audience: audience || "Leadership",
    manuscriptPath,
    buildPath: "new_deck_generation",
    templateEditingMode: false,
    referenceStrategy: referenceAnalysis.strategy || "none",
    referenceAnalysis,
    instructions:
      "Create design_plan.md and slide-build-spec.json for a new business deck with per-slide layout control."
  };
}

function renderDesignPlan({ objective, audience, manuscript, referenceAnalysis }) {
  const accentColor = getAccentColor(referenceAnalysis);
  const typographyDirection = getTypographyDirection(referenceAnalysis);
  const slidePlan = buildSlidePlan(manuscript, referenceAnalysis);
  return [
    `# Design Plan: ${manuscript.deckTitle}`,
    "",
    "## Brief",
    `- Audience: ${audience || "Leadership"}`,
    `- Objective: ${objective || manuscript.deckTitle}`,
    `- Reference strategy: ${referenceAnalysis.strategy || "none"}`,
    "",
    "## Color System",
    `- Accent color: ${accentColor}`,
    `- Primary text: #${DEFAULT_TOKENS.text_color}`,
    `- Body surface: #${DEFAULT_TOKENS.body_background}`,
    "",
    "## Typography Direction",
    `- ${typographyDirection}`,
    "- Body support text: disciplined sans-serif hierarchy",
    "",
    "## Visual Motif Rules",
    `- Tone: ${getTone(referenceAnalysis)}`,
    "- Minimal text: yes",
    `- Reference composition influence: ${getComposition(referenceAnalysis)}`,
    "- Visual anchors: charts, comparisons, process flows, and annotated evidence before decorative imagery",
    "",
    "## Slide Family Map",
    ...slidePlan.map((entry) => `- ${entry.title}: ${entry.layout}`),
    "",
    "## Page-by-Page Layout Plan",
    ...slidePlan.map(
      (entry, index) =>
        `- Slide ${index + 1}: ${entry.title} | Layout: ${entry.layout} | Role: ${entry.role}`
    ),
    "",
    "## Business Style Contract Confirmation",
    "- Business-oriented presentation: yes",
    "- Analytical visuals first: yes",
    `- Accent color locked to ${accentColor}: yes`,
    "- Minimal text discipline: yes"
  ].join("\n");
}

function buildSlideBuildSpec({
  manuscript,
  manuscriptPath,
  designPlanPath,
  referenceAnalysis,
  reasoningMode
}) {
  const slidePlan = buildSlidePlan(manuscript, referenceAnalysis);
  return {
    phase: "create",
    build_path: "new_deck_generation",
    reference_strategy: referenceAnalysis.strategy || "none",
    manuscript_path: manuscriptPath,
    design_plan_path: designPlanPath,
    output_pptx_path: "artifacts/output.pptx",
    reasoning_context: buildRuntimeContract({ reasoningMode }),
    deck_title: manuscript.deckTitle,
    design_tokens: {
      ...DEFAULT_TOKENS,
      accent_color: getAccentColor(referenceAnalysis),
      font_face_sans: "Aptos",
      font_face_serif: "Georgia"
    },
    design_summary: {
      tone: getTone(referenceAnalysis),
      minimal_text: true,
      layout_target: "LAYOUT_16x9"
    },
    slides: slidePlan.map((entry, index) => {
      const visualRole = determineVisualRole({
        title: entry.title,
        role: entry.role,
        layout: entry.layout
      });
      const textSafe = inferTextSafeFallback(entry, visualRole);
      return {
        visual_role: visualRole,
        image_strategy: defaultImageStrategy({
          mode: "create",
          visualRole,
          hasExistingMedia: false
        }),
        slide_number: index + 1,
        role: entry.role,
        title: entry.title,
        layout: entry.layout,
        emphasis: entry.emphasis,
        bullet_count: entry.bodyLines.length,
        body_lines: entry.bodyLines,
        provenance_note_count: entry.provenanceNotes.length,
        text_safe: textSafe,
        required_visual: buildRequiredVisualSpec(entry, { visualRole, textSafe })
      };
    })
  };
}

function buildRequiredVisualSpec(entry, { visualRole, textSafe } = {}) {
  const resolvedVisualRole = visualRole || determineVisualRole({
    title: entry.title,
    role: entry.role,
    layout: entry.layout
  });
  const strategy = defaultImageStrategy({
    mode: "create",
    visualRole: resolvedVisualRole,
    hasExistingMedia: false
  });
  if (strategy !== "generate_new") {
    return null;
  }
  return {
    prompt: `Analytical ${resolvedVisualRole} visual for ${entry.title}, restrained business look, orange accent #FA6611`,
    fallback: "shapes",
    required_for_comprehension: !textSafe
  };
}

function inferTextSafeFallback(entry, visualRole) {
  if (visualRole === "process" && entry.bodyLines.length >= 2) {
    return true;
  }
  return isTextSafeVisualFallback({
    visualRole,
    layout: entry.layout
  });
}

function buildSlidePlan(manuscript, referenceAnalysis) {
  const sequence = referenceAnalysis.structureInfluence?.slideFamilySequence || [];
  const layoutHints = referenceAnalysis.structureInfluence?.layoutArchetypes || [];
  return manuscript.slides.map((slide, index) => {
    const role = inferRole(slide.title, sequence[index], index, manuscript.slides.length);
    const hintedLayout = layoutHints[index] || STYLE_LAYOUT_MAP[sequence[index]];
    return {
      title: slide.title,
      role,
      layout: hintedLayout || inferLayoutFromTitle(slide.title, role),
      emphasis: inferEmphasis(role),
      bodyLines: slide.bodyLines,
      provenanceNotes: slide.provenanceNotes || []
    };
  });
}

function inferRole(title, sequenceHint, index, totalSlides) {
  if (sequenceHint) {
    return sequenceHint;
  }
  const normalized = String(title || "").toLowerCase();
  if (index === 0 || /summary|overview|context/.test(normalized)) return "title";
  if (index === totalSlides - 1 || /recommend|decision|closing|next step/.test(normalized)) return "closing";
  if (/compare|comparison|matrix/.test(normalized)) return "comparison";
  if (/process|workflow|timeline|rollout/.test(normalized)) return "process";
  if (/risk|issue|constraint/.test(normalized)) return "content";
  if (/data|metric|performance/.test(normalized)) return "data";
  return "content";
}

function inferLayoutFromTitle(title, role) {
  const normalized = String(title || "").toLowerCase();
  if (role === "title") return "title_hero";
  if (role === "comparison" || /comparison|matrix/.test(normalized)) return "comparison_matrix";
  if (role === "process" || /process|workflow|timeline/.test(normalized)) return "process_flow";
  if (role === "closing") return "closing_statement";
  if (role === "data") return "data_panel";
  if (/decision|recommend/.test(normalized)) return "decision_grid";
  return "two_column";
}

function inferEmphasis(role) {
  if (role === "comparison") return "comparison";
  if (role === "process") return "process";
  if (role === "closing") return "decision";
  if (role === "data") return "evidence";
  return "summary";
}

function getAccentColor(referenceAnalysis) {
  const strategy = referenceAnalysis.strategy || "none";
  if (strategy === "style" || strategy === "style_and_structure") {
    return referenceAnalysis.styleInfluence?.accentColor || DEFAULT_TOKENS.accent_color;
  }
  return DEFAULT_TOKENS.accent_color;
}

function getTypographyDirection(referenceAnalysis) {
  return (
    referenceAnalysis.styleInfluence?.typographyMood ||
    "Headline / labels: crisp business sans with restrained serif accents"
  );
}

function getTone(referenceAnalysis) {
  if (referenceAnalysis.strategy === "style" || referenceAnalysis.strategy === "style_and_structure") {
    return "restrained business deck influenced by reference composition";
  }
  return "restrained business deck";
}

function getComposition(referenceAnalysis) {
  return (
    referenceAnalysis.styleInfluence?.compositionDiscipline ||
    "comparison-led, process-readable, and low-clutter business layouts"
  );
}

module.exports = {
  DESIGN_ROLE_PATH,
  buildDesignHandoff,
  buildSlideBuildSpec,
  inferLayoutFromTitle,
  renderDesignPlan,
  runDesignPass
};
