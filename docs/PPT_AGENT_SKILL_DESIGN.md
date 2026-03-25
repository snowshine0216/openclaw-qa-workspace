# PPT Agent Skill Design

## Overview

### Goal

Build a `ppt-agent` skill that follows the product logic of PPTAgent and DeepPresenter while fitting a host-neutral IDE/CLI execution model.

The skill must support two user-facing workflows:

1. Create a new presentation from a prompt and optional attachments.
2. Update an existing PPTX while preserving the deck's existing style.

Implementation sequencing:

- Phase 1 implementation target: create workflow only
- Phase 2 implementation target: edit workflow after create workflow is stable and tested

### Design Direction

This design intentionally does **not** reproduce DeepPresenter's provider-centric runtime. Instead, it preserves the useful workflow shape and quality bar of PPTAgent while adapting reasoning work to a host-neutral reasoning contract that can run under Codex, OpenClaw, or another IDE/CLI host.

The core rule is:

- the active reasoning host performs research, summarization, slide analysis, design planning, and evaluation through a portable artifact contract;
- only `t2i_model` is externally configurable, and only for optional text-to-image generation.

### Prompt-Only Policy

Prompt-only deck generation is allowed in Phase 1, but only under a grounded-research policy:

- if the user provides only a prompt, the workflow must first determine whether the topic can be supported by verifiable research
- if the topic is supportable, the workflow may proceed only when it has inspectable provenance for the supporting material it used
- if the topic is too vague, private, or unsupported by reliable evidence, the workflow must stop at the insufficient-brief state rather than invent content
- prompt-only mode is a research-first path, not a hallucination-friendly shortcut

### Upstream Reference

- PPTAgent repository: `https://github.com/icip-cas/PPTAgent`
- PPTAgent two-phase workflow: analysis first, generation second
- DeepPresenter role pattern: research role, design role, per-slide production, iterative checking
- PPTEval: content, design, and coherence evaluation

### Non-Goals

- Do not make OpenRouter the default control plane.
- Do not introduce external configuration for research, vision, long-context, or evaluation models.
- Do not optimize for decorative marketing decks.
- Do not generate verbose, text-heavy slides by default.

## Product Positioning

`ppt-agent` is a high-level orchestration skill built on top of the existing `pptx` skill.

It is responsible for:

- understanding the presentation task;
- collecting and organizing source material;
- drafting a slide manuscript;
- defining a deck-wide design plan;
- guiding slide production;
- evaluating the finished deck against a PPTAgent-style quality bar.

It is not responsible for re-implementing low-level PPTX creation and editing primitives already owned by `pptx`.

## Architecture

### Core Architecture Decisions

1. **Host-neutral reasoning first**
   - Research, summarization, slide analysis, design planning, and evaluation are performed through a portable reasoning contract.
   - These steps are described in `SKILL.md`, `roles/research.md`, `roles/design.md`, and the evaluation prompts.

2. **Single external configuration boundary**
   - `config.yaml.example` contains only optional `t2i_model` configuration.
   - If `t2i_model` is absent, the workflow still functions by using user-provided images, extracted assets, diagrams built from shapes, charts, icons, and layout-driven visual design.

3. **PPTAgent-style workflow**
   - The workflow follows a reference-aware, manuscript-first, design-plan-first process.
   - Slide creation is done page by page, not as a single blind export step.

4. **Business deck default**
   - The output style is fixed to a business presentation direction unless the user explicitly overrides it.
   - The style contract is part of the design and evaluation criteria, not a soft suggestion.

5. **Reuse existing PPTX infrastructure**
   - PPTX creation, unpack/edit/pack operations, and file conversion reuse the existing `pptx` skill and its helper scripts.

6. **Scratch-generation first for Phase 1 create mode**
   - Phase 1 create mode always produces a new deck through the `pptx` generation path.
   - References and templates influence the design plan and slide family mapping, but they do not change Phase 1 into a template-editing workflow.

### Workflow Chart

```text
User Request
    │
    ├── Phase 1: Create Workflow
    │   ├── Intake and classify request
    │   ├── Collect source material and references
    │   ├── Research and draft manuscript.md
    │   ├── Produce design_plan.md
    │   ├── Generate slides page by page
    │   ├── Assemble PPTX through pptx skill
    │   ├── Run PPTEval-style review
    │   └── Iterate if required
    │
    └── Phase 2: Edit Workflow
        ├── Convert PPTX to slide images
        ├── Analyze current structure and style
        ├── Research new or changed content
        ├── Produce update_plan.md
        ├── Edit slides page by page
        ├── Repack PPTX through pptx skill
        ├── Compare before vs after quality
        └── Iterate if required
```

### Relationship to Existing `pptx` Skill

`ppt-agent` delegates low-level presentation operations to the existing `pptx` skill:

- PptxGenJS-based deck generation
- unpack/edit/pack editing
- soffice and slide-image conversion
- rendering, inspection, and export helpers

`ppt-agent` owns orchestration and quality. `pptx` owns presentation mechanics.

### Concrete Phase 1 Create-Mode Build Path

Phase 1 create mode is locked to this path:

```text
prompt + optional attachments
  -> intake result
  -> research pass
  -> manuscript.md
  -> design_plan.md
  -> slide build specification
  -> new deck generation through pptx
  -> render + evaluate
```

Rules:

- the output deck is a newly generated PPTX, not an edited copy of a reference deck
- reference decks and templates are advisory inputs to style, structure, and layout selection
- selecting a reference deck may influence:
  - slide family choices
  - layout-family mapping
  - palette constraints
  - component composition
- selecting a reference deck must not switch Phase 1 into XML-level template editing
- template-editing-first behavior is out of scope for Phase 1 and belongs to the deferred edit workflow unless explicitly re-planned later

### Reference Selection Contract

Reference selection may resolve to one of these strategies:

1. `none`
   - no usable reference exists
   - create mode uses the house business style and the authored design plan

2. `style`
   - a reference deck influences palette restraint, typographic mood, and composition discipline
   - it does not control slide-by-slide content structure

3. `structure`
   - a reference deck influences slide family sequencing and layout archetypes
   - it does not override the house style contract

4. `style_and_structure`
   - a reference deck influences both composition patterns and restrained stylistic cues
   - the final deck still remains a new deck built through the `pptx` generation path

## Folder Structure

```text
.agents/skills/ppt-agent/
├── SKILL.md
├── reference.md
├── .env.example
├── config.yaml.example
├── package.json
├── roles/
│   ├── research.md
│   └── design.md
├── prompts/
│   ├── eval-content.md
│   ├── eval-design.md
│   └── eval-coherence.md
├── scripts/
│   ├── build-pptx-from-handoff.js
│   ├── create-run.js
│   ├── generate-image.js
│   └── lib/
│       ├── build-pptx-from-handoff.js
│       ├── create-workflow.js
│       └── load-config.js
│       ├── pptx-handoff.js
│       └── run-manifest.js
├── tests/
│   ├── build-pptx-from-handoff.test.js
│   ├── create-run.test.js
│   ├── evaluation-failure-paths.test.js
│   ├── load-config.test.js
│   ├── phase1-e2e.test.js
│   ├── phase2-gating.test.js
│   ├── pptx-handoff.test.js
│   ├── run-manifest.test.js
│   ├── generate-image.test.js
│   ├── workflow-create-smoke.test.js
│   ├── workflow-create-build-path.test.js
│   ├── workflow-create-partial-success.test.js
│   ├── workflow-create-states.test.js
│   ├── style-contract.test.js
│   └── ppteval-rubric.test.js
└── fixtures/
    ├── sample-design-plan.md
    └── sample-manuscript.md
```

### File Ownership

- `SKILL.md`
  - entry point for both workflows
  - references the style contract and required process

- `reference.md`
  - setup instructions
  - optional `t2i_model` configuration
  - troubleshooting
  - test command reference

- `roles/research.md`
  - host-neutral research role
  - manuscript writing rules
  - source quality rules

- `roles/design.md`
  - host-neutral design role
  - business deck style contract
  - per-slide production instructions

- `prompts/eval-*.md`
  - PPTEval-style rubrics adapted to the portable runtime contract

- `scripts/lib/load-config.js`
  - loads only `t2i_model`

- `scripts/generate-image.js`
  - optional helper for text-to-image generation
  - the only script that depends on externally configured model credentials

## Configuration

### Configuration Principles

- External model configuration is optional.
- Only text-to-image generation may rely on externally configured model credentials.
- If no external image model is configured, the skill still operates correctly.

### `.env.example`

```bash
# Optional: only required when using text-to-image generation
T2I_API_KEY=
```

### `config.yaml.example`

```yaml
# Optional configuration for text-to-image generation only.
# Remove or leave empty if the workflow should avoid external image generation.

t2i_model:
  base_url: "https://example-provider.invalid/v1"
  model: "provider/image-model"
  api_key_env: "T2I_API_KEY"
  modalities: ["image"]
  image_config:
    aspect_ratio: "16:9"
    image_size: "1K"
```

### Configuration Rules

- `t2i_model` is optional.
- No `vision_model`, `long_context_model`, `eval_model`, `research_agent`, or `design_agent` slots are allowed in the skill config.
- The active reasoning host owns all non-image reasoning through the artifact contract.

### `load-config.js`

Responsibilities:

- locate `config.yaml` in the skill directory;
- parse YAML;
- validate only `t2i_model`;
- resolve `api_key_env`;
- return `null` when `t2i_model` is not configured;
- fail with a clear error when `t2i_model` exists but is malformed.

## Business Style Contract

This contract is mandatory for the default output of the skill.

### Visual Direction

- Presentation type: business, executive, boardroom-ready
- Accent color: `#FA6611`
- Default base palette: neutral white, charcoal, soft gray, with restrained use of `#FA6611`
- Visual tone: confident, clean, analytical, not playful

### Typography System

The default typography direction is a **two-font business system**:

- primary sans-serif: used for headlines, data labels, UI-like labels, tables, and chart annotation
- restrained serif accent: used sparingly for section-title moments, pull-quote moments, or occasional high-importance framing slides

Default role split:

```text
Headline / labels / data UI -> sans-serif
Section-title accent / strategic emphasis -> serif
Body support text -> sans-serif
```

Typography rules:

- the serif is an accent, not the dominant reading system
- the deck must remain mostly sans-led for clarity and business readability
- body text must never become editorial or literary in tone
- the sans and serif pairing must feel sharp and executive, not nostalgic or decorative
- if platform or export constraints make the serif accent unreliable, the fallback is a disciplined all-sans hierarchy rather than ad hoc substitutions

Preferred implementation direction:

- choose a crisp, modern sans with strong weight contrast
- choose a restrained serif with credible business tone
- avoid novelty, rounded, or playful font personalities

### Visual Anchor Strategy

The deck should not rely on generic decoration for visual interest. The default visual anchors are:

1. charts with clear takeaways
2. process diagrams
3. comparison structures
4. annotated screenshots
5. one restrained editorial-style section-title accent when needed

Decorative imagery is never the primary anchor in a business deck unless the deck topic is explicitly brand-led or image-led.

### Visual Priority Order

When the system chooses between multiple visual treatments, it must prefer them in this order:

1. analytical visuals that explain the business point
2. structural visuals that clarify sequence or comparison
3. real source visuals that add credibility
4. optional generated imagery that strengthens comprehension
5. decorative imagery only when it supports a clearly business-relevant message

This means charts, comparison layouts, process flows, tables, and annotated screenshots are the default backbone of the deck. Photography and generated imagery are supporting tools, not the dominant presentation mode.

### Content Density

- Minimal text per slide
- One idea per slide
- Prefer headlines, short labels, callouts, metrics, and structured comparisons
- If bullets are required, prefer 3 to 5 short bullets
- Avoid paragraphs whenever possible

### Slide Composition Rules

- Each slide must have a clear focal point
- Text and visual content must complement each other
- Prefer charts, process diagrams, comparison tables, annotated screenshots, and simple icon-supported layouts
- Use photography only when it supports a business message
- Avoid decorative images without informational value

### Anti-Patterns

- generic blue palette
- all-sans default template look with no hierarchy personality
- decorative gradients as the main visual system
- filler illustrations
- crowded bullet walls
- long narrative paragraphs
- poster-like marketing hero slides inside a business deck
- repeated decorative motifs with no informational purpose

### Text Budget Guidance

- Title slide: title, subtitle, presenter context
- Section slide: section title and one supporting line at most
- Content slide: one headline, one core message, and supporting visual evidence
- Closing slide: summary points, next steps, or call to action

### Temporary Design System Authority

Until a repo-level `DESIGN.md` exists, this plan is the authoritative design source for the `ppt-agent` skill.

Implementation must treat the style rules below as binding defaults, not optional inspiration.

### Design Tokens

### Primary Canvas Target

The primary design target is **16:9 widescreen**.

Canvas policy:

- all default layout, spacing, hierarchy, and component decisions are authored for `16:9`
- other aspect ratios are secondary adaptations, not co-equal primary targets
- if a downstream workflow needs `4:3` or print-like export, it should adapt from the `16:9` system rather than redefining the design language
- a layout pattern is not considered canonical until it works well in `16:9`

## Responsive and Accessibility Standards

This skill produces presentation artifacts rather than live application screens, but the same principle applies: readability, clarity, and accessibility must be designed intentionally rather than assumed.

### Viewing Context Standard

Generated decks must remain legible in these common contexts:

- laptop presentation mode
- conference-room projector
- screen share in video meetings
- exported PDF review
- printed or zoomed review of individual slides

The plan optimizes for `16:9` widescreen first, but every canonical layout must still preserve hierarchy and readability when rendered smaller or exported.

### Text Readability Rules

- title text should normally remain within `30-40pt`
- section titles should normally remain within `24-32pt`
- body text should normally remain within `16-20pt`
- caption text should normally remain within `11-14pt`
- no business-critical text should be placed in caption-size treatment
- dense slides should be simplified before shrinking body text below the stated range

### Contrast Rules

- primary text on primary surface must meet strong presentation contrast
- accent orange must not be used as low-contrast body text on light backgrounds
- muted text may be used only for tertiary information
- chart colors must remain distinguishable without relying on hue alone

### Chart and Table Accessibility Rules

- every chart must have a clear takeaway headline
- charts must use direct labels or a legend strategy that does not force constant back-and-forth scanning
- critical comparisons must not rely on color alone
- tables must privilege scan order and grouping over density
- units, time ranges, and baselines must be explicit when omission would cause ambiguity

### Annotation and Source Rules

- annotations must be short and readable from presentation distance
- source markers may be visually quiet, but they must remain recoverable in PDF review
- footnotes must not compete with the slide message

### Layout Accessibility Rules

- visual anchors must not crowd the title or decision frame
- supporting text and evidence should align to predictable reading paths
- no layout should depend on tiny callouts or hairline separators to make sense
- decorative layers must never reduce text readability
- overloaded slides should be split by default rather than compressed into dense layouts
- dense-layout fallback is allowed only for mild overflow cases where clarity remains intact

### Export-Safe Rules

- a slide must remain understandable when exported to PDF
- a slide must remain understandable without animation
- if an animation is used in a presentation environment, the static exported state must still communicate the core message
- build order should enhance clarity, not carry the only explanation

### Accessibility Validation

- if a slide requires squinting, zooming, or presenter explanation to decode the core message, it fails
- if a chart loses meaning in grayscale or low-fidelity export, it fails
- if the audience cannot identify the primary message within a few seconds, it fails

#### Color Tokens

```text
--ppt-accent-primary: #FA6611
--ppt-text-primary: #1F1F1F
--ppt-text-secondary: #555555
--ppt-surface-primary: #FFFFFF
--ppt-surface-muted: #F5F3EF
--ppt-border-subtle: #D9D4CC
--ppt-data-positive: #2F7D4A
--ppt-data-warning: #B7791F
--ppt-data-critical: #B42318
```

Token rules:

- `#FA6611` is the only default accent token
- charts and data states may use semantic colors, but the deck must still feel anchored by the primary accent
- muted surfaces should stay warm-neutral rather than blue-gray

#### Typography Tokens

```text
--ppt-font-sans: primary sans business family
--ppt-font-serif: restrained editorial accent serif
--ppt-title-size: 30-40pt
--ppt-section-size: 24-32pt
--ppt-body-size: 16-20pt
--ppt-caption-size: 11-14pt
```

Token rules:

- body text should remain comfortably readable in presentation conditions
- caption text may be smaller, but never so small that it becomes annotation noise
- line lengths should stay tight enough for scanning, not document reading

#### Spacing Tokens

```text
--ppt-space-1: 8px
--ppt-space-2: 16px
--ppt-space-3: 24px
--ppt-space-4: 32px
--ppt-space-5: 48px
--ppt-space-6: 64px
```

Token rules:

- slide composition should use a disciplined spacing scale
- avoid ad hoc micro-spacing values unless needed for chart or table alignment

### Component Language

The plan defines these reusable component families:

- title block
- section divider
- insight headline
- evidence chart block
- comparison matrix
- process flow
- metric strip
- annotated screenshot
- recommendation block
- closing action block

Component rules:

- each component must have one clear informational job
- components should be composed into layouts rather than decorated into novelty
- cards are allowed only when they are the clearest way to separate distinct pieces of information
- thick borders, ornamental shadows, and decorative icon circles are not part of the component vocabulary

### Reuse Requirement

If implementation introduces a visual pattern that is not clearly one of the component families above, the pattern must either:

1. be folded back into an existing family, or
2. be documented in this plan as a new family before it becomes a default pattern

## Information Architecture

### Deck-Level Hierarchy

The deck must be understandable at three levels:

1. **First scan**
   - the audience should understand the topic, the point of view, and the business context within the first two slides

2. **Section scan**
   - section boundaries must make the narrative structure obvious without requiring the presenter to explain how the deck is organized

3. **Slide scan**
   - every slide must make its primary message visible before the audience reads any supporting detail

### Default Narrative Flow

For create workflow outputs, the default narrative flow is:

```text
Opening
  -> Context
  -> Key Insight or Problem
  -> Evidence / Analysis
  -> Recommendation / Decision
  -> Next Steps or Closing
```

For edit workflow outputs, the default narrative flow is:

```text
Preserve existing narrative spine
  -> detect stale or weak slides
  -> repair local flow gaps
  -> improve slide clarity
  -> preserve deck-level continuity
```

### Slide Family Hierarchy

Each slide family must define what the audience sees first, second, and third.

#### Title Slide

```text
1. Title
2. Subtitle or business framing
3. Presenter / date / context
```

Rules:

- the title must carry the dominant message
- the subtitle must clarify scope, not repeat the title
- supporting metadata must be visually present but clearly tertiary

#### Section Slide

```text
1. Section title
2. One-line orientation statement
3. Optional progress cue or section index
```

Rules:

- section slides exist to reset attention and orient the audience
- they must be visually quieter than title slides and clearer than content slides

#### Insight Slide

```text
1. Headline insight
2. Primary evidence visual
3. Supporting labels or short annotations
```

Rules:

- the audience should understand the conclusion before reading the evidence labels
- the visual must prove or clarify the headline, not decorate it

#### Comparison Slide

```text
1. Comparison question or decision frame
2. Side-by-side or matrix comparison
3. Decision takeaway
```

Rules:

- the comparison frame must tell the audience what is being compared and why it matters
- the final takeaway must make the comparison actionable

#### Process Slide

```text
1. Process headline
2. Step flow or diagram
3. Outcome, owner, or timing note
```

Rules:

- process slides must privilege sequence clarity over stylistic decoration
- each step label should be scannable at a glance

#### Data-Heavy Slide

```text
1. Business takeaway
2. Chart or table
3. Footnotes, units, and source markers
```

Rules:

- the key business takeaway comes before the raw numbers
- labels, legends, and axes must support the chart without competing with it

#### Closing Slide

```text
1. Final takeaway or decision ask
2. Next steps or recommendation summary
3. Contact or discussion prompt
```

Rules:

- the closing slide must end the deck decisively
- it should not introduce a new analytical branch

### Deck Structure Constraints

- every deck must have an opening slide and a closing slide
- section slides are inserted only when the deck has two or more real sections or more than six slides
- a content slide must never ask the audience to discover the point by reading every detail
- supporting evidence must stay subordinate to the slide headline

### Information Architecture Validation

- a reviewer should be able to scan only slide titles and section titles and understand the narrative spine
- the first three slides must establish topic, context, and why the deck matters
- any slide that cannot name a primary message should be split, rewritten, or removed

## Interaction State Coverage

The plan must specify what the user sees in non-happy-path states. This skill is not only generating a deck; it is also guiding the user through a workflow that can be incomplete, partially successful, blocked by missing inputs, or degraded by missing assets.

### Workflow State Matrix

| Feature | Loading | Empty | Error | Success | Partial |
|--------|---------|-------|-------|---------|---------|
| Create workflow intake | Show progress summary while parsing prompt and attachments | Show "insufficient brief" guidance when no usable objective or source material is present | Show a blocking explanation when prompt parsing fails | Confirm objective, audience, and deck type were recognized | Accept prompt but flag ambiguous brief items that need refinement |
| Reference selection | Show that templates and reference decks are being evaluated | Show a no-reference path that explains the skill will use default business deck rules | Show a recoverable warning if a provided reference deck cannot be read | Confirm selected reference strategy: style, structure, or both | Continue without reference deck if references are unusable but the brief is otherwise sufficient |
| Research and manuscript drafting | Show stage-level progress: collecting, extracting, drafting, refining | Show no-evidence warning when the brief lacks enough supporting material | Show blocking error for unreadable attachments or unsupported sources | Confirm manuscript complete and ready for design | Continue with a reduced-confidence manuscript when only part of the source material was usable |
| Design planning | Show that a deck-wide design plan is being assembled | Show a fallback message when no strong visual references are available | Show blocking error if the plan cannot map slides to layout families | Confirm `design_plan.md` complete | Continue with a reduced visual range when references are weak but a coherent business deck can still be produced |
| Slide production | Show current slide count and active slide being generated | Show a no-slide outcome if the manuscript collapses to zero valid slides after quality checks | Show blocking error if PPTX assembly fails | Confirm deck generated successfully | Continue when some optional visuals are missing but slide content and structure remain valid |
| Edit workflow analysis | Show slide conversion and analysis progress | Show "nothing to update" when the source deck is already current or no requested changes were identified | Show blocking error if the PPTX cannot be converted or analyzed | Confirm update scope before edits begin | Continue when only a subset of slides can be analyzed cleanly |
| Evaluation | Show scoring progress by dimension | Show "evaluation unavailable" when there are no renderable slides | Show recoverable error if one evaluation pass fails | Confirm scores and acceptance result | Return deck with warnings if some checks ran and others were skipped |

### State Design Rules

- loading states must communicate stage and progress, not just say "working"
- empty states must explain why the workflow cannot continue and what the user should provide next
- error states must distinguish between blocking failures and recoverable failures
- success states must summarize what artifact was produced and what quality gate was passed
- partial states must clearly explain what succeeded, what degraded, and whether the output is still recommended for use

### Required Empty States

- missing objective
- missing source material
- unusable attachment set
- no valid reference deck
- no meaningful update requested in edit mode
- no renderable slides for evaluation

### Required Error States

- attachment read failure
- reference deck parse failure
- PPTX export failure
- slide conversion failure
- malformed `t2i_model` configuration
- provider failure during optional image generation

### Required Success States

- manuscript completed
- design plan completed
- deck generated
- deck updated
- evaluation passed

### Required Partial States

- reference deck missing but workflow still completed
- some attachments unusable but enough source material remained
- optional image generation failed but deck still passed quality threshold
- some edit-mode slides skipped but final deck remained coherent enough to review

### Partial-State Acceptance Policy

- optional image generation failure is non-blocking by default
- the workflow may still return a deck when:
  - the deck passes the defined content, design, and coherence thresholds;
  - the missing generated image does not break slide comprehension;
  - the fallback slide remains visually aligned with the business style contract
- the result must be explicitly labeled as partial whenever optional image generation failed
- the user-facing summary must say:
  - what asset failed;
  - what fallback was used instead;
  - whether the deck is still recommended for review or presentation
- optional image generation failure becomes blocking only when the affected slide cannot remain understandable without the missing asset

## User Journey and Emotional Arc

The plan must account for how the audience experiences the deck, not only how the deck is constructed.

### Audience Journey Goals

- the opening should create confidence and orientation
- the middle of the deck should create clarity, not fatigue
- the end of the deck should create decision readiness, not a soft fade-out

### Default Emotional Arc

```text
Opening:     "I understand what this is about."
Early body:  "I understand why it matters."
Mid deck:    "I trust the analysis."
Late deck:   "I see the recommendation."
Closing:     "I know what to do next."
```

### Default Narrative Bias

The default deck posture is **conclusion-first**:

```text
Opening context
  -> core takeaway
  -> supporting proof
  -> recommendation or decision
  -> next step
```

Use context-first only when the subject is genuinely unfamiliar, politically sensitive, or requires staged explanation before the recommendation will be credible.

### Storyboard Template

| Step | Audience sees | Audience feels | Plan requirement |
|------|---------------|----------------|------------------|
| Opening slide | Topic, framing, authority | Oriented | Opening must establish topic and business context immediately |
| First content beat | First real argument or framing block | Engaged | The deck must move from framing to substance without delay |
| Evidence sequence | Charts, comparisons, process, supporting proof | Trust | Evidence slides must reduce ambiguity rather than pile on information |
| Recommendation sequence | Clear takeaway and decision frame | Ready to decide | The deck must state what the audience should believe or choose |
| Closing | Summary and next action | Aligned | The closing must end decisively with a recommendation, action, or discussion prompt |

### Journey Design Constraints

- no slide should feel like a detour with no narrative job
- the first three slides must reduce uncertainty, not increase it
- the first real content beat should reveal the deck's core conclusion or decision frame early
- the deck should alternate appropriately between claim and proof so the audience never feels buried in unsupported assertions
- the closing should resolve the deck's promise from the opening

## Data Artifacts

### Artifact Reuse Policy

The pipeline must reuse stable intermediate artifacts whenever possible so refinement loops do not recompute the entire deck from scratch.

Reuse boundaries:

- if the prompt interpretation and source material have not changed, reuse the existing intake result
- if the narrative content has not changed, reuse `manuscript.md`
- if the style and layout strategy have not changed, reuse `design_plan.md`
- if only a subset of slides changed, reuse unchanged slide outputs rather than regenerating the entire deck
- if the slide render set has not changed, reuse rendered slide images for evaluation
- if evaluation prompts and rendered slides have not changed, reuse prior evaluation inputs and compare only the changed outputs

Invalidation rules:

- changing the deck objective or source material invalidates manuscript and everything after it
- changing the style contract or slide family mapping invalidates design plan and everything after it
- changing one slide should invalidate that slide's production artifacts and any deck-level aggregate outputs that depend on it
- changing evaluation criteria invalidates evaluation outputs only

Performance goal:

- refinement loops should recompute the smallest affected stage, not restart the full pipeline by default

### Run-State And Manifest Contract

Artifact reuse is implemented through a concrete per-run manifest rather than best-effort file reuse.

Run root:

```text
.ppt-agent-runs/{run_id}/
├── manifest.json
├── input/
│   ├── brief.json
│   ├── source_fingerprint.json
│   └── reference_selection.json
├── artifacts/
│   ├── manuscript.md
│   ├── design_plan.md
│   ├── slide-build-spec.json
│   ├── output.pptx
│   └── evals.json
├── renders/
│   └── slide-*.png
└── logs/
    └── stage-status.json
```

`run_id` requirements:

- unique per logical run
- stable enough to support resume behavior
- derived from timestamp plus a short hash of normalized brief inputs

`manifest.json` minimum fields:

```json
{
  "run_id": "20260325-abc123",
  "phase": "create",
  "status": "intake|research|design|build|evaluate|complete|failed",
  "normalized_brief_hash": "…",
  "source_fingerprint_hash": "…",
  "reference_strategy": "none|style|structure|style_and_structure",
  "style_contract_version": "v1",
  "artifact_paths": {
    "manuscript": "artifacts/manuscript.md",
    "design_plan": "artifacts/design_plan.md",
    "slide_build_spec": "artifacts/slide-build-spec.json",
    "output_pptx": "artifacts/output.pptx",
    "evals": "artifacts/evals.json"
  }
}
```

Resume behavior:

- if a matching run manifest exists and its inputs are still valid, the workflow resumes from the earliest invalidated stage
- if no matching run exists, a new run directory is created
- if the manifest exists but is incomplete or corrupted, the workflow must fail clearly rather than silently reusing stale artifacts

Discovery behavior:

- the workflow must discover prior runs by manifest metadata rather than directory guessing
- the latest compatible run may be reused only when normalized brief, source fingerprint, and style contract version still match the current request

### `manuscript.md`

Purpose:

- the canonical slide-by-slide content source for a new deck

Rules:

- slide breaks use `---`
- each slide has one main message
- references to local images must use absolute paths
- each image reference must include a short usage description
- when the deck is prompt-only, the manuscript must include source provenance notes for externally researched claims in a form that downstream evaluation can inspect

### `design_plan.md`

Purpose:

- the canonical deck-wide style and layout plan

Required sections:

- audience and presentation purpose
- color system
- typography direction
- slide family map
- visual motif rules
- page-by-page layout plan
- business style contract confirmation

### `slide_analysis.json`

Purpose:

- structured analysis of an existing slide during edit mode

Suggested schema:

```json
{
  "slide_number": 1,
  "role": "title|section|content|closing|appendix",
  "layout_summary": "two-column comparison with chart on right",
  "text_density": "low|medium|high",
  "visual_assets": ["chart", "logo", "photo"],
  "style_notes": ["orange accent line", "dark title"],
  "preserve": ["title hierarchy", "footer style"],
  "update": ["revenue figures", "timeline"]
}
```

### `evals.json`

Purpose:

- structured PPTEval-style output for final quality review

Required schema:

```json
{
  "slides": {
    "slide-01": {
      "content": { "score": 4, "reason": "..." },
      "design": { "score": 4, "reason": "..." }
    }
  },
  "coherence": { "score": 4, "reason": "..." },
  "summary": {
    "content_avg": 4.0,
    "design_avg": 4.0,
    "coherence": 4.0,
    "overall": 4.0
  }
}
```

## Functional Design 1: Create Workflow

### Phase 1. Intake and Reference Selection

Goal:

- understand what kind of business deck is needed and what source material is available

Required changes:

- `SKILL.md` must define the create workflow entry path
- `roles/research.md` must instruct the agent to identify audience, objective, desired deck length, and available assets
- `reference.md` must document how user attachments and reference decks are handled

Expected behavior:

- classify request type: proposal, strategy deck, report, training deck, update deck, or summary deck
- gather source material from prompts, files, and user-provided references
- select a reference deck or template when available
- establish target slide count and presentation objective
- decide whether the request is:
  - prompt-only and researchable,
  - prompt plus source material,
  - insufficiently grounded and must stop
- write `reference_selection.json` as part of the run state
- lock one create-mode reference strategy before manuscript generation begins

Validation:

- create workflow cannot proceed without an explicit deck objective
- if a reference deck exists, the workflow must record whether it is used for style, structure, or both
- prompt-only requests may proceed only when the plan can ground them in verifiable research
- prompt-only requests that cannot be grounded must stop in the insufficient-brief state

### Phase 2. Research and Manuscript Drafting

Goal:

- produce a complete `manuscript.md` before slide production starts

Required changes:

- `roles/research.md` must define the host-neutral research process
- the role must instruct the agent to summarize attachments directly instead of calling provider-specific summarization APIs

Expected behavior:

- collect facts and supporting material
- extract business-relevant insights
- draft `manuscript.md`
- keep text concise and presentation-ready
- point to local visuals where needed
- record source provenance for researched claims when the deck is built from prompt-only or mixed-source input

Validation:

- every slide in the manuscript has a clear title or message
- text density matches the minimal-text rule
- unsupported filler slides are removed before design begins

### Phase 3. Design Plan

Goal:

- lock the deck-wide style before generating any slide

Required changes:

- `roles/design.md` must instruct the agent to create `design_plan.md`
- the role must include the business style contract and require explicit confirmation of accent color `#FA6611`

Expected behavior:

- define color system
- define typography direction
- define slide families: title, section, content, comparison, process, data-heavy, closing
- map each manuscript slide to a layout family

Validation:

- `design_plan.md` exists before any PPTX generation step
- the plan explicitly states that the deck is business-oriented and uses minimal text

### Phase 4. Slide Production

Goal:

- generate slides one page at a time with strong layout control

Required changes:

- `SKILL.md` must require per-slide generation
- `ppt-agent` must delegate actual slide creation to `pptx`
- optional image generation may be used only when it materially improves the slide

Expected behavior:

- create slides sequentially
- keep layout disciplined and low-clutter
- use charts, shapes, tables, and existing assets before resorting to generated imagery
- when external image generation is used, it must follow `t2i_model`
- build a `slide-build-spec.json` artifact before invoking `pptx`
- generate a new deck through the `pptx` generation path rather than editing a reference deck in place

Validation:

- no consecutive slides should feel visually identical unless repetition is intentional
- no slide should violate the minimal-text rule without explicit justification
- each slide must visibly align with the business style contract

### Phase 5. Assembly and Evaluation

Goal:

- export the final deck and evaluate it before returning it to the user

Required changes:

- `prompts/eval-content.md`, `prompts/eval-design.md`, and `prompts/eval-coherence.md` must define the evaluation logic
- `SKILL.md` must require a final evaluation pass

Expected behavior:

- export PPTX
- inspect rendered slides
- score content, design, and coherence
- iterate if quality is below threshold

Validation:

- final output includes `evals.json`
- design scoring must check business style compliance, not generic beauty alone

## Functional Design 2: Edit Workflow

This workflow is intentionally a second implementation phase. It remains in the design so architecture, tests, and interfaces can be planned coherently, but it is not part of the first delivery milestone.

Detailed Phase 2 implementation design:

- [docs/PPT_AGENT_PHASE2_EDIT_WORKFLOW_DESIGN.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/docs/PPT_AGENT_PHASE2_EDIT_WORKFLOW_DESIGN.md)
- [docs/PPT_AGENT_PHASE2_EDIT_WORKFLOW_DESIGN_REVIEW.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/docs/PPT_AGENT_PHASE2_EDIT_WORKFLOW_DESIGN_REVIEW.md)

### Phase 1. Existing Deck Analysis

Goal:

- understand what the current deck is doing before changing it

Required changes:

- `SKILL.md` must define the edit workflow separately
- `reference.md` must document how slide-image conversion is performed through the existing `pptx` skill

Expected behavior:

- convert the source PPTX into slide images
- inspect slides using the built-in multimodal capabilities of the agent
- produce one `slide_analysis.json` entry per slide

Validation:

- each slide records layout, text density, visuals, and preservation constraints

### Phase 2. Research Delta

Goal:

- isolate what content needs to change without discarding the current deck structure

Required changes:

- `roles/research.md` must include edit-specific behavior

Expected behavior:

- identify stale numbers, outdated claims, new sections, and required removals
- preserve the user's style when it is compatible with the business style target

Validation:

- update scope is explicit before editing starts

### Phase 3. Update Plan

Goal:

- create a slide-by-slide update plan that preserves house style

Required changes:

- `roles/design.md` must instruct the agent to write `update_plan.md` during edit mode

Expected behavior:

- decide which slides to keep, revise, split, merge, add, or remove
- record which style tokens must be preserved
- record where the business style contract should tighten the deck without causing visual drift

Validation:

- update plan exists before any edits are applied

### Phase 4. Slide-by-Slide Editing

Goal:

- apply targeted changes while preserving deck consistency

Required changes:

- `SKILL.md` must route editing through the `pptx` skill's unpack/edit/pack flow

Expected behavior:

- edit one slide or one tightly scoped group at a time
- preserve existing visual identity unless the user requested a restyle
- enforce concise text while keeping the deck internally consistent

Validation:

- no accidental full-deck redesign
- no regression in style consistency

### Edit-Mode Style Preservation Policy

- edit mode preserves the original deck style by default
- the system may tighten the deck toward the business style contract only when the change clearly improves readability, hierarchy, clarity, or professionalism
- targeted tightening may include:
  - reducing text overload
  - improving contrast
  - cleaning inconsistent spacing
  - clarifying chart labeling
  - simplifying weak decorative treatments
- targeted tightening must not silently convert the whole deck into a new house style
- full restyling requires explicit user intent

### Phase 5. Before-vs-After Evaluation

Goal:

- confirm the updated deck is better than the original

Required changes:

- evaluation prompts must support edit-mode comparison

Expected behavior:

- compare original and updated versions
- check factual freshness, design consistency, and coherence

Validation:

- the updated deck should maintain or improve design score and coherence

## Script Specifications

### `scripts/lib/load-config.js`

Purpose:

- load and validate only `t2i_model`

Inputs:

- optional `config.yaml`
- optional `T2I_API_KEY`

Outputs:

- validated `t2i_model` object or `null`

Failure modes:

- malformed YAML
- missing required fields when `t2i_model` is declared
- missing API key when a provider requires one

### `scripts/generate-image.js`

Purpose:

- generate optional imagery for slides

CLI arguments:

- `--prompt` required
- `--output` required
- `--aspect` optional, default `16:9`
- `--size` optional, default `1K`
- `--retries` optional, default `3`

Behavior:

- load `t2i_model` through `load-config.js`
- fail fast if no `t2i_model` is configured
- send the request to the configured provider
- decode the image response
- save the file locally
- print the output path

Constraints:

- this script must not become a general-purpose provider abstraction layer
- it exists only to support optional image creation inside the skill

### `scripts/create-run.js`

Purpose:

- initialize a Phase 1 create run

Behavior:

- validate the brief
- enforce prompt-only grounding
- create run-state artifacts
- generate `manuscript.md` and `design_plan.md` when they are not supplied
- emit `slide-build-spec.json` and `pptx-handoff.json`
- record portable runtime metadata in handoff artifacts

### `scripts/build-pptx-from-handoff.js`

Purpose:

- build a starter Phase 1 deck from `pptx-handoff.json`

Behavior:

- read the handoff artifact
- parse the manuscript
- generate a new `output.pptx` through PptxGenJS
- preserve the Phase 1 house-style constraints at a starter level

### `scripts/evaluate-run.js`

Purpose:

- provide a minimal Phase 1 evaluation command for create runs

Behavior:

- read `manifest.json`, `slide-build-spec.json`, `pptx-handoff.json`, and `output.pptx`
- confirm the create run produced the expected artifacts
- inspect rendered slides for valid render artifacts and widescreen geometry
- score content, design, and coherence from the Phase 1 artifacts plus render-aware checks
- emit `artifacts/evals.json` and `artifacts/phase1-eval.json`
- return a recoverable partial result when one render-aware evaluation step cannot complete reliably
- do not attempt Phase 2 multimodal scoring

## Evaluation Framework

The skill uses a PPTEval-style rubric with three dimensions:

### Content

Checks:

- factual clarity
- relevance of supporting material
- slide-level message quality
- alignment between visual and verbal content

### Design

Checks:

- compliance with the business style contract
- effective use of `#FA6611`
- visual hierarchy
- density control
- layout discipline
- chart, table, and diagram readability

### Coherence

Checks:

- narrative flow
- section sequencing
- consistency across slides
- logical progression from opening to closing

### Acceptance Thresholds

- content average: `>= 4.0`
- design average: `>= 4.0`
- coherence: `>= 4.0`
- overall average: `>= 4.0`

If any dimension falls below threshold, the workflow must return to manuscript refinement, design-plan refinement, or slide refinement as appropriate.

## Tests

The design requires tests before implementation is considered complete.

### Test Strategy

- use `node:test`
- keep tests in a dedicated `tests/` folder
- prefer fixture-driven tests
- use minimal mocks
- use golden-file style fixtures for manuscript, design plan, and evaluation outputs

### Test Milestone Policy

- Phase 1 tests are release-blocking for the first implementation milestone
- Phase 2 tests remain specified in this plan but are not release-blocking until edit workflow implementation begins
- a test file that only validates Phase 2 edit behavior must not block Phase 1 delivery
- package-level test scripts must preserve that split:
  - `npm test` runs the Phase 1 release gate only
  - `npm run test:phase2` runs edit-workflow coverage
  - `npm run test:all` runs the complete package suite

### Phase 1 Required Test Files

#### `tests/load-config.test.js`

Validates:

- no config returns `null`
- valid `t2i_model` parses correctly
- malformed `t2i_model` fails clearly
- non-t2i external slots are rejected

#### `tests/generate-image.test.js`

Validates:

- request body construction
- API key resolution
- file output
- retry behavior
- provider error handling

#### `tests/workflow-create-smoke.test.js`

Validates:

- create workflow requires objective and source material
- manuscript is produced before design plan
- design plan is produced before slide generation
- style contract is propagated into the deck workflow
- slide build specification is produced before `pptx` generation
- Phase 1 create mode uses new-deck generation rather than template-editing

#### `tests/workflow-create-build-path.test.js`

Validates:

- reference selection resolves to `none`, `style`, `structure`, or `style_and_structure`
- all four strategies still produce a new deck through the `pptx` generation path
- Phase 1 rejects any path that would silently switch into template-editing-first mechanics

#### `tests/workflow-create-states.test.js`

Validates:

- missing objective produces the defined insufficient-brief state
- no valid reference deck falls back to the no-reference path
- unusable attachments still permit partial continuation when enough source material remains
- manuscript collapse to zero valid slides produces the defined no-slide outcome
- prompt-only but researchable requests proceed through the research-first path
- prompt-only but insufficiently grounded requests stop with the defined insufficient-brief state

#### `tests/workflow-create-partial-success.test.js`

Validates:

- optional image generation failure is non-blocking when slide comprehension remains intact
- partial-success summaries identify the failed asset and the fallback used
- partial-success output is rejected when the missing asset makes the slide no longer understandable

#### `tests/style-contract.test.js`

Validates:

- `#FA6611` is the default accent color
- minimal-text rules are documented
- anti-pattern list is present
- business deck defaults are present in both role and skill specifications

#### `tests/ppteval-rubric.test.js`

Validates:

- content prompt includes relevance and clarity checks
- design prompt includes business style checks
- coherence prompt includes narrative flow checks
- score aggregation schema matches `evals.json`

#### `tests/evaluation-failure-paths.test.js`

Validates:

- evaluation unavailable state when no renderable slides exist
- recoverable failure when one evaluation dimension errors and others complete
- quality-threshold failure returns the workflow to manuscript, design-plan, or slide refinement as specified

#### `tests/run-manifest.test.js`

Validates:

- a run directory and `manifest.json` are created for a new Phase 1 create run
- compatible runs are discovered through manifest metadata
- corrupted or incompatible manifests are rejected clearly
- stage invalidation rules restart only the earliest affected stage

#### `tests/create-run.test.js`

Validates:

- `create-run.js` initializes a Phase 1 run
- JSON output includes the expected run artifact paths
- prompt-only insufficient briefs fail cleanly

#### `tests/pptx-handoff.test.js`

Validates:

- `pptx-handoff.json` is written with the expected build contract

#### `tests/build-pptx-from-handoff.test.js`

Validates:

- manuscript parsing
- starter PPTX generation
- CLI usage failure on missing handoff path

#### `tests/phase1-e2e.test.js`

Validates:

- `create-run -> build-pptx-from-handoff` succeeds on a happy-path fixture

#### `tests/phase2-gating.test.js`

Validates:

- the package release gate keeps Phase 2-only coverage out of `npm test`
- the package exposes an explicit Phase 2 test suite without making it Phase 1 release-blocking

### Phase 2 Planned Test Files

These tests are designed now so the edit workflow can be implemented safely later, but they are not part of the Phase 1 release gate.

#### `tests/workflow-edit-smoke.test.js`

Validates:

- edit workflow requires slide analysis before update planning
- update plan is produced before editing
- preservation constraints are recorded

## Documentation Changes

### Canonical Ownership Rule

This plan is the canonical source for:

- workflow sequencing
- business style contract
- design tokens
- component language
- accessibility rules
- acceptance thresholds

Downstream documentation must not restate these rules in full unless the local file needs a task-specific constraint that does not belong here.

Instead:

- `SKILL.md` should summarize operational behavior and link back to this plan for the full rule set
- `roles/research.md` should include only the research-specific instructions needed at execution time
- `roles/design.md` should include only the design-execution instructions needed at execution time
- `reference.md` should focus on setup, configuration, and troubleshooting
- `prompts/eval-*.md` should implement the evaluation logic without becoming a second full design spec

### `SKILL.md`

Must be updated to:

- describe both workflows in English only
- state host-neutral reasoning behavior clearly
- remove provider-specific assumptions for non-image steps
- require business style output with minimal text
- require final evaluation before completion

### `reference.md`

Must be updated to:

- document only optional `t2i_model` setup
- document test commands
- document fallback behavior when no external image model is configured
- document the run directory and manifest contract
- document the prompt-only grounding policy

### `config.yaml.example`

Must be updated to:

- contain only `t2i_model`
- remain valid when deleted or left unused

### `roles/research.md`

Must be updated to:

- use the built-in model workflow
- produce concise business-ready manuscript content
- treat images as supporting evidence, not filler

### `roles/design.md`

Must be updated to:

- enforce the business style contract
- enforce minimal text
- enforce `#FA6611`
- support both create and edit workflows

### `prompts/eval-*.md`

Must be updated to:

- evaluate business presentation quality instead of generic slide aesthetics

## Implementation Checklist

- [x] rewrite `SKILL.md` in English only
- [x] rewrite `reference.md` in English only
- [x] reduce `config.yaml.example` to optional `t2i_model`
- [x] rewrite `roles/research.md`
- [x] rewrite `roles/design.md`
- [x] implement `scripts/lib/load-config.js`
- [x] implement `scripts/generate-image.js`
- [x] implement `scripts/create-run.js`
- [x] implement `scripts/lib/create-workflow.js`
- [x] implement `scripts/lib/run-manifest.js`
- [x] implement `scripts/lib/pptx-handoff.js`
- [x] implement `scripts/build-pptx-from-handoff.js`
- [x] implement `scripts/evaluate-run.js`
- [x] add `tests/` directory and required test files
- [x] add Phase 1 fixtures for manuscript, design plan, and eval outputs
- [x] verify create workflow documentation
- [x] verify Phase 1 create workflow documentation
- [x] leave Phase 2 edit workflow specified but not implemented in the first pass
- [x] mark legacy provider-centric helper scripts as non-authoritative and out of scope for this implementation pass

## Implementation Progress

Current status:

- Phase 1 create workflow is implemented end to end for the narrowed first milestone
- Phase 1 has a real command surface:
  - `create-run.js`
  - `build-pptx-from-handoff.js`
  - `evaluate-run.js`
- `create-run.js` now materializes `manuscript.md`, `design_plan.md`, `slide-build-spec.json`, and `pptx-handoff.json` by default
- `build-pptx-from-handoff.js` now consumes the generated build spec and design tokens during deck generation
- `evaluate-run.js` now writes rubric-scored `evals.json` output, inspects render artifacts, and reports recoverable evaluation errors
- Phase 1 local tests are green
- `npm test` now matches the Phase 1 release gate, while `npm run test:phase2` and `npm run test:all` cover the broader package surface
- Phase 2 edit workflow has since been implemented beyond the original first-milestone scope, but it is still kept out of the Phase 1 release gate

Still open:

- future doc cleanup to split first-milestone Phase 1 notes from the now-implemented Phase 2 surface, if the design doc is later reorganized

## Acceptance Criteria

The design is ready for implementation only when all of the following are true:

- the document is fully in English;
- the architecture is host-neutral and artifact-contract first;
- only `t2i_model` is externally configurable;
- the workflow clearly follows the PPTAgent and DeepPresenter logic;
- the Phase 1 create-mode build path is explicitly locked to new-deck generation through `pptx`;
- prompt-only requests have a grounded-research policy and a clear stop condition when grounding fails;
- the run-state and artifact-manifest contract is concrete enough to implement and test;
- the default output style is a business deck with minimal text and accent color `#FA6611`;
- tests are specified in enough detail to implement before or alongside the code;
- the documentation clearly separates orchestration responsibilities from `pptx` responsibilities.

## What Already Exists

- an existing `pptx` skill already owns low-level presentation generation and editing mechanics
- upstream PPTAgent and DeepPresenter provide the reference workflow shape for analysis, generation, and evaluation
- this plan now contains a temporary design-system section that serves as the authoritative design source until a repo-level `DESIGN.md` exists
- the plan already defines a business style contract, data artifacts, workflow phases, evaluation thresholds, and test requirements

## NOT in Scope

- a repo-wide `DESIGN.md` for all projects in `openclaw-qa-workspace`
- a general multi-theme deck generator with interchangeable visual personalities
- a motion system for animated presentations beyond static export-safe clarity
- a print-first layout system treated as co-equal with the `16:9` widescreen canvas
- a full automatic restyling engine for existing decks without explicit user intent
- provider abstraction for all reasoning steps beyond optional `t2i_model`
- full cleanup or deletion of legacy provider-centric helper scripts in the existing `ppt-agent` folder during the first implementation pass

## Unresolved Design Decisions

None at the end of this review cycle.

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 0 | — | — |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | — | — |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 1 | ISSUES OPEN | 5 issues, 0 critical gaps, 3 follow-up TODOs |
| Design Review | `/plan-design-review` | UI/UX gaps | 1 | CLEAR | score: 7/10 -> 10/10, 7 decisions |

**UNRESOLVED:** 0

**OUTSIDE VOICE:** Claude subagent completed; Codex transport/runtime failed.

**VERDICT:** DESIGN REVIEW CLEARED — ENG REVIEW FOUND FOLLOW-UP ARCHITECTURAL WORK BEFORE IMPLEMENTATION.

## References

- PPTAgent repository: `https://github.com/icip-cas/PPTAgent`
- Local upstream checkout: `/Users/xuyin/Documents/Repository/PPTAgent`
- Existing dependent skill: `.agents/skills/pptx/`
