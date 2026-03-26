---
name: ppt-agent
description: "ppt-agent creates new business presentations in Phase 1 and updates existing decks in Phase 2. It uses a host-neutral reasoning contract for research and design planning, optional t2i_model image generation, shared pptx mechanics for deck editing/building, and PPTEval-style review."
---

# ppt-agent

Phase 1 creates a **new** deck. It does not edit an existing reference deck in place.

This skill is built on top of the existing `pptx` skill:

- `ppt-agent` owns orchestration, manuscript quality, design planning, slide analysis, update planning, and evaluation
- `pptx` owns deck generation and deck-edit mechanics

Default style contract:

- business deck
- minimal text on slides (detail belongs in speaker notes, not on-slide copy)
- analytical visuals first
- `#FA6611` as the primary accent

## Setup

```bash
cd .agents/skills/ppt-agent
npm install
```

Optional image generation:

```bash
cp .env.example .env
cp config.yaml.example config.yaml
```

Keep `.env` local only. Commit `.env.example`, not the real `.env`.

`markitdown` helpers run from the repository root and activate the repo-local virtualenv first:

```bash
cd /Users/xuyin/Documents/Repository/openclaw-qa-workspace
source .venv/bin/activate
python -m markitdown /absolute/path/to/input
```

If you do not configure `t2i_model`, create-mode still works. Generated imagery remains the default-first choice for visual-anchor slides when a model is configured, but the workflow may fall back to user assets, charts, diagrams, screenshots, shapes, and layout when the deck stays understandable without external generation.

## Phase 1 Create Workflow

### 1. Intake

- classify the request
- determine audience, objective, and target deck length
- decide whether the request is:
  - prompt-only and researchable
  - prompt plus source material
  - insufficiently grounded and should stop

Prompt-only requests are allowed only when they can be grounded in verifiable research with inspectable provenance.

For the CLI path, prompt-only auto-materialization requires explicit `--source-provenance` input unless the user is importing manual artifacts.

### 2. Research

Read [roles/research.md](roles/research.md).

Outputs:

- `manuscript.md`
- source provenance for researched claims when needed
- `source-provenance.json`
- `research-handoff.json`

### 3. Design Plan

Read [roles/design.md](roles/design.md).

Outputs:

- `design_plan.md`
- slide family mapping
- reference selection strategy: `none`, `style`, `structure`, or `style_and_structure`
- `slide-build-spec.json`
- `reference-analysis.json`
- `design-handoff.json`

### 4. Build Path

Phase 1 build path is fixed:

```text
prompt + optional attachments
  -> manuscript.md
  -> design_plan.md
  -> slide-build-spec.json
  -> new deck generation through pptx
  -> render + evaluate
```

References and templates may influence style or structure, but Phase 1 still produces a **new** deck through `pptx`.

## Phase 2 Edit Workflow

Phase 2 edits an existing deck in place.

### Edit Path

```text
existing deck + change request + attachments
  -> analyze source deck
  -> extract source theme tokens (artifacts/source-theme.json)
  -> classify slides into keep / light_edit / structured_rebuild
  -> for each non-keep slide:
       -> build canonical slide_brief with composition_family, component_list, primary_visual_anchor
       -> require primary_visual_anchor.relevance_rationale
       -> derive visual plan summary
       -> inherit source theme when parseable; otherwise fall back to local design reference
  -> execution routing (reuse-first: always attempt pptx structured renderer before parallel edit path)
       -> light_edit -> preserve seed + scoped OOXML text edits
       -> structured_rebuild -> reuse pptx structured renderer for chosen family
  -> write concise on-slide copy (minimal text; depth goes in speaker notes)
  -> write detailed speaker notes and image meta prompt artifacts for generated imagery
  -> render before/after
  -> evaluate
  -> emit edit-summary.md as canonical Phase 2 human-facing summary
```

### Key Artifacts

- `artifacts/slide-briefs/slide-XX.json` - canonical per-slide semantic source of truth (required for every non-keep slide)
- `artifacts/source-theme.json` - extracted theme tokens with per-token confidence scores
- `artifacts/visual-plan.json` - derived visual plan summary from slide briefs
- `artifacts/update_plan.json` - execution control plane derived from slide briefs
- `artifacts/image-prompts/slide-XX.md` - 9-section meta prompt artifact required before any image generation
- `artifacts/speaker-notes/slide-XX.md` - per-slide presenter notes (5 sections)
- `artifacts/presenter-script.md` - deck-level stitched presenter script
- `artifacts/edit-summary.md` - canonical Phase 2 human-facing summary

See [reference.md](reference.md) for the full run-state/resume contract and artifact vocabulary.

### Composition Planning

Every non-`keep` slide must declare:

- `composition_family` - slide layout family (evidence_panel, comparison_matrix, process_flow, etc.)
- `component_list` - structural components present on the slide
- `primary_visual_anchor` - the dominant visual element with:
  - `kind` - type of visual anchor
  - `source` - where it comes from
  - `asset_ref` - reference to the asset
  - `relevance_rationale` - why this anchor is valid for this slide
  - `fallback_order` - fallback strategy if primary anchor fails
- `render_strategy` - preserve_only, light_edit, or structured_rebuild
- `text_only_exception` - explicit reason if slide is text-only

### Theme Preservation

Source theme extraction provides:

- per-token confidence scores for fonts, colors, surfaces
- fallback policy when extraction confidence is low
- mixed mode when some tokens come from source, others from fallback reference

Slide briefs record whether typography, palette, and background came from source deck theme or fallback reference.

Operational commands:

```bash
node scripts/create-run.js \
  --root-dir .agents/skills/ppt-agent/runs \
  --prompt "Build a Q2 operating review for leadership" \
  --objective "Summarize Q2 performance and next-step decisions" \
  --attachments /absolute/path/to/source.md \
  --manuscript /absolute/path/to/manuscript.md \
  --design-plan /absolute/path/to/design_plan.md

node scripts/create-run.js \
  --root-dir .agents/skills/ppt-agent/runs \
  --prompt "Build a market landscape deck on enterprise browser automation adoption in 2026" \
  --objective "Summarize the market, risks, and recommendation" \
  --source-provenance /absolute/path/to/source-provenance.json

node scripts/build-pptx-from-handoff.js \
  --handoff .agents/skills/ppt-agent/runs/<run-id>/artifacts/pptx-handoff.json

node scripts/evaluate-run.js \
  --run-root .agents/skills/ppt-agent/runs/<run-id>
```

`create-run.js` now executes the full generated-artifact path by default:

- intake and reference analysis
- research handoff and `manuscript.md`
- design handoff and `design_plan.md`
- PPTX build
- evaluation
- bounded refinement loop when the quality threshold fails

If `--root-dir` is omitted, Phase 1 defaults to `.agents/skills/ppt-agent/runs`.

When both `--manuscript` and `--design-plan` are supplied, `create-run.js` stays in manual-artifact mode and emits the handoff/build artifacts without auto-building the deck.

Phase 1 runtime artifacts use a portable reasoning contract:

- `reasoning_host`
- `reasoning_mode`
- `execution_contract_version`

This keeps the workflow usable from Codex, OpenClaw, or another IDE/CLI host without hard-coding one runtime.

### 5. Optional Image Generation

Generated imagery is primary for create mode on `hero`, `explainer`, `process`, `comparison`, `evidence`, and `qa` slides unless a fitting user-provided asset already exists. Agenda, table-of-contents, section-divider, and appendix-index slides must not generate decorative imagery.

Use only when it materially improves a slide or when a slide contract marks the visual as required:

```bash
node scripts/generate-image.js \
  --prompt "Analytical process diagram for quarterly planning, restrained business look, orange accent #FA6611" \
  --output images/slide-03-process.png \
  --aspect "16:9"
```

If image generation fails but the deck remains understandable and on-style, return a partial-success result with an explicit warning.

### 6. Evaluation

Phase 1 ships a narrow evaluation command:

```bash
node scripts/evaluate-run.js --run-root .agents/skills/ppt-agent/runs/<run-id>
```

This scores the run against the Phase 1 content, design, and coherence rubric and emits:

- `artifacts/evals.json`
- `artifacts/phase1-eval.json`
- `summary.render_count`
- `summary.refinementTargets`
- `render_checks`

The evaluator is render-aware but still artifact-driven. It requires rendered slides from the build step, validates that the render images are actually inspectable, and returns a recoverable partial result when one evaluation dimension cannot complete reliably.

Phase 2 adds enrichment quality gates that check for:

- Text-only added slides without valid text_only_exception
- Missing primary visual anchor for non-text-only slides
- Irrelevant preserved primary visual anchor (lacking specific relevance rationale)
- Missing speaker notes for non-keep slides
- Missing image meta prompt for generated images
- Missing description metadata for generated images, charts, or diagrams
- Shallow transcripts (speaker script too close to slide copy)

Enrichment quality failures are separated from hard preservation failures. Text-only slides currently generate warnings (will become hard failures after structured fallback routing exists).

## Phase 2 Edit Workflow

Phase 2 updates an existing deck while preserving its narrative spine and visual identity unless the user explicitly asks for a restyle.

Default policy:

- preserve original deck style
- tighten only where readability, contrast, spacing, hierarchy, or factual freshness clearly improve
- do not silently convert the whole deck into the Phase 1 house style
- preserve existing imagery by default on slides that already have media
- do not regenerate the whole deck unless the user explicitly asks for a restyle rebuild

Operational path:

```text
existing deck
  -> edit-run initialization
  -> deck evidence extraction
  -> per-slide transcript grounding
  -> raw slide caption generation
  -> caption normalization into slide analysis
  -> research delta
  -> update_plan.md + update_plan.json
  -> transcript-index.json + slide-transcripts/
  -> pre-edit checkpoint + manual handoff
  -> edit_handoff.json
  -> targeted slide edits through pptx unpack/edit/pack workspace
  -> before-vs-after evaluation
  -> run_summary.md + operator-summary.json + non-empty logs
```

Operational commands:

```bash
node scripts/edit-run.js \
  --root-dir .agents/skills/ppt-agent/runs \
  --deck /absolute/path/to/source.pptx \
  --change-request "Refresh Q1 metrics and add one slide on Q2 hiring plan" \
  --attachments /absolute/path/to/q1-metrics.md,/absolute/path/to/hiring-plan.md

node scripts/apply-edit-run.js \
  --run-root .agents/skills/ppt-agent/runs/<run-id>

node scripts/finalize-edit-run.js \
  --run-root .agents/skills/ppt-agent/runs/<run-id>
```

If `--root-dir` is omitted, Phase 2 defaults to `.agents/skills/ppt-agent/runs`.

Phase 2 now produces canonical slide briefs at `artifacts/slide-briefs/slide-XX.json` via the transcript-enrichment module. These enriched JSON briefs supersede the markdown transcripts for semantic grounding and provide structured evidence points, speaker scripts, and composition metadata.

Phase 2 emits:

- `artifacts/original-text.md`
- `artifacts/original-slide-index.json`
- `artifacts/raw-slide-captions.json`
- `artifacts/slide_analysis.json`
- `artifacts/source-media-index.json`
- `artifacts/source-theme.json` (extracted theme tokens with per-token confidence scores)
- `artifacts/research_delta.md`
- `artifacts/update_plan.md`
- `artifacts/update_plan.json`
- `artifacts/slide-transcripts/slide-XX.md`
- `artifacts/transcript-index.json`
- `artifacts/slide-briefs/slide-XX.json` (canonical enriched briefs, required for every non-keep slide)
- `artifacts/slide-briefs/index.json`
- `artifacts/visual-plan.json`
- `artifacts/speaker-notes/slide-XX.md`
- `artifacts/presenter-script.md`
- `artifacts/image-prompts/slide-XX.md` (required before any image generation)
- `artifacts/edit-summary.md` (canonical Phase 2 human-facing summary)
- `artifacts/pre_edit_checkpoint.md`
- `artifacts/manual_handoff.md`
- `artifacts/edit_handoff.json`
- `artifacts/output-updated.pptx`
- `artifacts/comparison_evals.json`
- `artifacts/run_summary.md`
- `artifacts/operator-summary.json`
- `logs/stage-status.json`
- `logs/events.jsonl`

`artifacts/original-text.md` is produced through `markitdown` from the repo-local virtualenv. If the local `markitdown` install lacks PPTX support, the workflow falls back to structural extraction so edit-mode can still proceed offline.

If transcript grounding is still insufficient after using the user request, source deck/material, and cached Tavily background search, the workflow must stop in `needs_context` instead of fabricating content.

All workflow-owned outputs live under `.agents/skills/ppt-agent/runs/<run-id>/...`. Writing default outputs to repo-level folders like `ppt/...` or `.ppt-agent-runs/...` is not allowed.

## Files

- [reference.md](reference.md): setup, run-state contract, configuration, troubleshooting
- [roles/research.md](roles/research.md): research execution instructions
- [roles/design.md](roles/design.md): design execution instructions
- [scripts/create-run.js](scripts/create-run.js): Phase 1 run initialization entrypoint
- [scripts/edit-run.js](scripts/edit-run.js): Phase 2A edit-run initialization entrypoint
- [scripts/apply-edit-run.js](scripts/apply-edit-run.js): Phase 2B structural edit scaffold
- [scripts/build-pptx-from-handoff.js](scripts/build-pptx-from-handoff.js): Phase 1 narrow deck builder
- [scripts/evaluate-run.js](scripts/evaluate-run.js): Phase 1 contract-level evaluator
- [scripts/finalize-edit-run.js](scripts/finalize-edit-run.js): Phase 2B finalize + compare entrypoint
- [scripts/caption-image.js](scripts/caption-image.js): raw caption normalization helper
- [scripts/summarize-doc.js](scripts/summarize-doc.js): `markitdown`-backed update-source normalization helper
- [scripts/eval-presentation.js](scripts/eval-presentation.js): before-vs-after comparison evaluator
- [prompts/eval-content.md](prompts/eval-content.md)
- [prompts/eval-design.md](prompts/eval-design.md)
- [prompts/eval-coherence.md](prompts/eval-coherence.md)

## Tests

```bash
npm test
```

Release-blocking coverage focuses on:

- `t2i_model` config handling
- image-generation request and failure paths
- create-workflow build path
- create-workflow states and partial-success behavior
- edit-workflow run initialization and resume logic
- raw-caption normalization into `slide_analysis.json`
- update-plan validation
- edit-handoff generation without action recomputation
- before-vs-after comparison evaluation
