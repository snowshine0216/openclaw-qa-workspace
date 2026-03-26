# PPT Agent Phase 2 Edit Workflow Design

> **Design ID:** `ppt-agent-phase2-edit-workflow-2026-03-25`
> **Date:** 2026-03-25
> **Status:** Draft
> **Scope:** Turn the deferred `ppt-agent` edit workflow into an implementation-ready design that reuses the shipped Phase 1 run model and the existing shared `pptx` skill.
>
> **Constraint:** This is a design artifact. Do not implement until approved.

---

## Overview

Phase 1 proved the create-mode baseline: `ppt-agent` owns orchestration, manuscript quality, design planning, and evaluation, while the shared `pptx` skill owns deck mechanics. Phase 2 must preserve that same split instead of growing a second, unrelated editing system.

The concrete Phase 2 goal is:

1. accept an existing `.pptx` plus a change request and optional update materials;
2. analyze the source deck slide by slide before making changes;
3. isolate exactly what should be preserved, tightened, added, removed, or refreshed;
4. apply targeted edits through the shared `pptx` unpack/edit/pack flow;
5. compare the updated deck against the original and only return it when freshness, coherence, and style preservation meet the acceptance bar.

This design intentionally avoids a full automatic restyling engine. Default behavior is style-preserving update, not “rebuild the deck in the house style.” The business-style contract is still the quality backstop, but it is applied as selective tightening unless the user explicitly asks for a restyle.

### Engineering Rollout Shape

Phase 2 remains one coherent product feature, but implementation is intentionally staged to reduce engineering blast radius:

- **Phase 2A**
  - edit-run initialization
  - deck evidence extraction
  - raw slide caption generation + normalization
  - slide analysis
  - delta research
  - `update_plan.md` + `update_plan.json`
  - operator-reviewable pre-edit checkpoint
  - manual handoff output when automation should stop

- **Phase 2B**
  - structural edit scaffold
  - targeted XML/content edits
  - finalize/pack/render
  - before-vs-after comparison evaluation

Release rule:

- Phase 2A may ship independently if it produces a trustworthy analysis and manual handoff flow
- Phase 2B must reuse the Phase 2A artifacts and must not redefine the run-state or review surface

## Architecture

### Workflow Chart

```text
user request + source deck + optional attachments
  -> Phase 0: initialize edit run
  -> Phase 1: extract deck evidence
     -> markitdown text dump
     -> slide image render
     -> thumbnail grid
     -> unpacked XML workspace copy
  -> Phase 2: slide analysis
     -> per-slide structure/style/preserve constraints
  -> Phase 3: research delta
     -> summarize change sources
     -> identify stale claims, stale numbers, new sections, removals
  -> Phase 4: update planning
     -> update_plan.md
     -> update_plan.json
  -> Phase 5: edit scaffold
     -> create edit_handoff.json
     -> map slide jobs to XML files
     -> add/duplicate/reorder/remove slides when required
  -> Phase 6: targeted XML/content edits
     -> revise only impacted slides
  -> Phase 7: finalize + compare
     -> clean + pack updated deck
     -> render updated slides
     -> compare original vs updated deck
     -> emit comparison_evals.json
```

### Delivery Slices

```text
Phase 2A
  -> initialize run
  -> extract deck evidence
  -> analyze deck
  -> research delta
  -> produce update plan
  -> stop at reviewable handoff

Phase 2B
  -> consume Phase 2A artifacts
  -> scaffold edits
  -> apply targeted edits
  -> finalize + compare
```

### Slice Boundary Rule

Phase 2A produces immutable artifact contracts. Phase 2B consumes them.

Required boundary:

- Phase 2B may consume:
  - `artifacts/slide_analysis.json`
  - `artifacts/research_delta.md`
  - `artifacts/update_plan.json`
- Phase 2B must not call back into Phase 2A analysis or planning logic to recompute decisions on the fly
- if Phase 2B needs a new decision input, add it to a 2A artifact rather than coupling the modules directly

### Folder Structure

This design extends the existing `.agents/skills/ppt-agent/` package instead of creating a new skill.

```text
.agents/skills/ppt-agent/
├── SKILL.md                             # update with Phase 2 workflow
├── reference.md                         # update with edit-mode contract
├── roles/
│   ├── research.md                      # add edit-mode delta rules
│   └── design.md                        # add update-plan + preservation rules
├── scripts/
│   ├── edit-run.js                      # new: initialize Phase 2 run
│   ├── apply-edit-run.js                # new: scaffold structural edits + handoff
│   ├── finalize-edit-run.js             # new: clean/pack/render/evaluate
│   ├── caption-image.js                 # replace deferred stub
│   ├── summarize-doc.js                 # replace deferred stub
│   ├── eval-presentation.js             # replace deferred stub
│   └── lib/
│       ├── run-manifest.js              # extend for phase=edit and edit stages
│       ├── edit-workflow.js             # new: normalize edit request + resume logic
│       ├── deck-analysis.js             # new: extract deck evidence contract
│       ├── update-plan.js               # new: validate/update plan JSON contract
│       ├── edit-handoff.js              # new: structural edit handoff builder
│       └── finalize-edit-run.js         # new: finalize + compare helpers
└── tests/
    ├── edit-run.test.js
    ├── apply-edit-run.test.js
    ├── finalize-edit-run.test.js
    ├── deck-analysis.test.js
    ├── update-plan.test.js
    ├── workflow-edit-smoke.test.js
    ├── workflow-edit-resume.test.js
    ├── workflow-edit-style-preservation.test.js
    ├── workflow-edit-compare.test.js
    ├── caption-image.test.js
    ├── summarize-doc.test.js
    └── eval-presentation.test.js
```

### Phase Boundary

The dependency boundary is locked:

- `ppt-agent` owns request normalization, slide analysis, delta reasoning, update planning, preservation policy, comparison logic, and run-state orchestration.
- shared `pptx` owns text extraction, slide image rendering, unpacking, packing, cleanup, and slide-level XML manipulation primitives.
- Phase 2 must not fork or duplicate the shared `pptx` mechanics inside `ppt-agent`.

## Information Architecture

### Preservation Hierarchy

Phase 2 edits must preserve the deck in this order:

1. **Narrative spine**
   - preserve the argument the deck is making
   - preserve what the audience should understand first, second, and third
   - if a local slide layout blocks the argument, change the layout rather than keep a confusing story

2. **Section flow**
   - preserve section sequencing and transitions when they still support the updated argument
   - if the source deck has a local flow break, repair the sequence before polishing visuals

3. **Slide layout**
   - preserve familiar layouts when the updated content still fits clearly
   - if the content no longer fits, prefer `split` or `add_after` over overloading the slide

4. **Local styling**
   - preserve accent use, title alignment, spacing rhythm, and local motifs only after narrative and layout needs are satisfied
   - style preservation must not force stale, overloaded, or misleading content to remain in place

### Style Preservation Tokens

`Preserve style` must be interpreted as preserving concrete visual tokens, not a vague overall feel.

Required token categories:

- **Hierarchy**
  - title size behavior
  - headline-to-body contrast
  - section-divider emphasis
- **Spacing rhythm**
  - typical margin behavior
  - density pattern for text, charts, and callouts
- **Accent usage**
  - where accent color appears
  - whether accent is used for emphasis, structure, or data highlight
- **Alignment behavior**
  - title alignment
  - chart/text balance
  - left/right compositional bias
- **Density**
  - whether the deck is sparse, moderate, or dense
  - whether evidence is carried by charts, tables, screenshots, or prose
- **Recurring motifs**
  - repeated divider treatment
  - recurring callout style
  - repeated section-number or annotation pattern

Anti-pattern:

- do not treat `same vibe` as an acceptable preservation rule
- do not preserve decorative clutter when the real identity lives in hierarchy and composition

### Bounded Visual Tightening

Phase 2 may tighten weak slides without becoming a restyle.

Allowed tightening:

- reduce text overload
- improve contrast
- align inconsistent spacing
- clean chart labeling
- simplify weak decorative treatments
- improve scan order when the current reading path is unclear

Not allowed under default tightening:

- replacing the deck's core typography personality
- changing the dominant accent strategy
- replacing the deck's compositional language with a new one
- flattening the deck into a generic corporate template

Rule:

- improve clarity, not identity

### Comparison Summary Language

The final comparison summary must use concrete deck-edit language rather than generic quality-talk.

Required language pattern:

- what changed
- what stayed stable
- what needs inspection
- why the recommendation is safe or unsafe

Anti-patterns:

- `visual quality improved`
- `design consistency maintained`
- `overall enhancement successful`

These phrases are too generic on their own. The summary must instead name the actual editorial result, such as refreshed metrics, preserved section flow, clarified chart labeling, or flagged slide-level risk.

## Design System Alignment

No repo-level `DESIGN.md` currently exists, so this plan must define its own design-alignment rule for Phase 2.

### Precedence Rule

In edit mode, the source deck's design system wins by default.

That means the workflow should treat the source deck's hierarchy, spacing rhythm, accent usage, density, and recurring motifs as the primary design authority.

The Phase 1 `ppt-agent` business style contract is still relevant, but only as a bounded readability and professionalism backstop.

Allowed backstop uses:

- improve readability
- improve contrast
- reduce overload
- clean weak decorative clutter

Not allowed by default:

- forcing the source deck into the `ppt-agent` house style
- silently replacing the source deck's identity system

### Inconsistent Source Deck Rule

If the source deck is internally inconsistent, the workflow must follow the dominant design pattern rather than preserve every inconsistency slide by slide.

Dominant-pattern normalization may include:

- choosing the prevailing heading treatment
- choosing the prevailing spacing rhythm
- choosing the prevailing accent behavior
- removing obvious outlier formatting that weakens trust

This normalization must stay gentle. It should reduce inconsistency without turning the deck into a new visual system.

## Responsive And Accessibility

### Viewing-Context Priority

Phase 2 must optimize edited decks for presentation readability first.

Priority order:

1. projector and conference-room presentation
2. screen share in video meetings
3. exported PDF review

This means update decisions should preserve or improve readability at presentation distance before they optimize for close-reading density in static review.

Secondary requirement:

- the updated deck must still remain legible in exported PDF review
- a slide that only works when zoomed in on a laptop fails the Phase 2 acceptance bar

### Overflow And Minimum Readable Size Rule

Phase 2 must not shrink updated content below the readable size ranges already established for the deck system.

When updated content no longer fits:

- prefer `split`
- prefer `add_after`
- reduce redundant text

Do not:

- keep shrinking text until it technically fits
- preserve a crowded layout at the cost of presentation-distance readability
- rely on zoomed PDF inspection as a substitute for readable slides

### Status Signaling Accessibility Rule

Change, warning, and regression states must not rely on color alone.

Required signaling pattern:

- explicit label or wording first
- color as a supporting cue only

This applies to:

- before-vs-after comparison summaries
- slide-level review artifacts
- manual-review escalation summaries
- partial-success summaries

A result that is only understandable through accent color differences fails the Phase 2 accessibility bar.

## Human-Facing Review Format

### Default Review Output Shape

The operator-facing review output must default to a compact executive summary first, with detailed artifact paths and slide-level details below it.

Required reading order:

1. requested updates applied
2. regressions detected or not detected
3. overall recommendation
4. deck-level scores
5. paths to detailed artifacts
6. slide-level detail

This output should help a busy operator answer "is this deck safe to review?" before they read the full detail.

### Update Decision Rule

When two preservation goals conflict, the workflow must choose the higher item in the hierarchy above.

Examples:

- if keeping the exact layout would weaken the story, keep the story and adapt the layout
- if keeping a decorative motif would reduce readability, keep readability and simplify the motif
- if preserving section order would hide the updated recommendation, preserve the recommendation and repair the section flow

### New Slide Placement Rule

When the update requires a new slide, insert it immediately after the slide whose argument it extends, unless that placement would break the section flow.

Placement policy:

- default: attach the new slide to the argument it supports
- fallback: if immediate insertion creates a section-flow break, place it at the nearest point that preserves the section narrative
- anti-pattern: do not append new slides to the end of the deck or the end of the section by default unless the new content is genuinely closing material

## Interaction State Coverage

### Operator State Matrix

| Feature | Loading | Empty | Error | Success | Partial |
|--------|---------|-------|-------|---------|---------|
| Edit run intake | Show source deck name, requested change summary, and stage label `Initializing edit run` | Show `No change request provided` with guidance to supply the requested update | Show blocking error if the source deck is missing or unreadable | Confirm the deck and change request were accepted | Continue when attachments are missing but the change request and source deck are still usable |
| Deck evidence extraction | Show `Extracting text, images, and editable structure` with current sub-step | Show `No extractable slide content found` when the deck cannot be meaningfully analyzed | Show blocking error if markitdown, render, or unpack fails | Confirm deck evidence is ready for analysis | Continue when some slide renders fail but enough slides were extracted to proceed |
| Slide analysis | Show `Analyzing slide X of N` with progress | Show `No meaningful update opportunities detected` when the deck is already current and no real change was requested | Show blocking error if no valid slide analysis can be produced | Confirm analysis complete and ready for delta planning | Continue when some slides were analyzed cleanly and others were downgraded to low-confidence analysis |
| Delta research | Show `Summarizing new material` and `Checking stale claims` | Show `No usable new source material` when attachments add no real update value | Show blocking error if all update sources are unreadable | Confirm `research_delta.md` is ready | Continue when some sources were unusable but enough evidence remained to update the deck |
| Update planning | Show `Planning slide actions` and indicate keep/revise/add counts | Show `Nothing to update` when all slides remain current and no structural change is needed | Show blocking error if the plan cannot assign deterministic slide actions | Confirm `update_plan.md` and `update_plan.json` are ready | Continue when one or more slides are marked `manual_review_required` but the rest of the plan is deterministic |
| Edit scaffold and slide editing | Show current slide job and total remaining jobs | Show `No slides selected for edit` when the final plan resolves entirely to `keep` | Show blocking error if structural scaffold or XML targeting fails | Confirm updated deck has been produced | Show updated slides, skipped slides, fallback used, and recommendation: `safe to review` or `needs manual fix` |
| Final comparison | Show `Comparing original vs updated deck` with current pass | Show `No comparison available` when after-render output is missing | Show blocking error if comparison evaluation cannot determine update safety | Confirm requested changes landed and no unacceptable regressions were found | Show counts for applied updates and skipped updates, list regressions if any, and state whether the deck is still safe to review |

### Partial-Success Contract

When a run partially succeeds, the operator-facing summary must include:

1. how many slides were updated
2. which slides were skipped
3. what fallback was used for each skipped or downgraded slide
4. whether the deck is:
   - `safe to review`
   - `review with warnings`
   - `needs manual fix`

The workflow must not collapse these outcomes into a generic warning.

### Already-Current State

When the workflow determines that the deck is already current and no meaningful update is needed, the operator must see a calm success state rather than a warning.

This state must include:

- the message `Deck is already current`
- a short explanation of why no update was applied
- the evidence used to reach that conclusion, such as unchanged metrics, unchanged dates, or no net delta from the supplied materials
- links or paths to the analysis artifacts so the operator can review what was checked

This outcome is a successful verification result, not a degraded run.

### Manual-Review Escalation State

When a slide is too risky or ambiguous to update automatically, the workflow must produce a slide-specific handoff rather than a generic warning.

The operator-facing escalation must include:

- slide number
- why the slide was escalated
- what changed around the slide or why the requested update could not be applied safely
- what the operator should inspect manually
- whether the rest of the deck is still safe to review

This state should support partial success. It should not force a full run failure unless the unresolved slide breaks deck-level trust or coherence.

## User Journey

### Default Emotional Arc

Phase 2 edit mode is trust-first.

The operator should move through this sequence:

```text
Start:    "I understand what the tool plans to change."
Middle:   "I can see the tool is being careful with my deck."
Finish:   "I trust the result and I know what to inspect next."
```

This workflow is editing an existing presentation that may already have political, commercial, or executive importance. The design should therefore optimize for confidence, carefulness, and reviewability rather than surprise or speed theater.

### Journey Storyboard

| Step | User does | User feels | Plan requirement |
|------|-----------|------------|------------------|
| Intake | Submits source deck and change request | Oriented | The workflow must restate what it thinks the requested update is before major edits begin |
| Evidence extraction | Waits while the deck is unpacked and rendered | Reassured if progress is legible | Progress states must say what is being checked, not just that work is happening |
| Analysis and planning | Reviews what the tool thinks should change | Cautious but informed | The workflow must surface keep/revise/add/remove decisions before large edits are finalized |
| Editing | Lets the tool apply targeted changes | Trust builds only if scope stays controlled | The workflow must make it obvious that untouched slides are being preserved |
| Final comparison | Reviews before-vs-after result | Confident if the summary is clear | The workflow must answer whether requested updates landed and whether anything regressed before showing detailed scores |
| Manual review, if needed | Inspects escalated slides | Supported, not abandoned | Manual-review handoff must name the risky slide, why it was escalated, and what to inspect |

### Pre-Edit Trust Checkpoint

Before `apply-edit-run.js` performs any structural or XML edits, the workflow must produce an operator-reviewable checkpoint summary.

This checkpoint must show:

- the requested change summary
- how many slides are `keep`, `revise`, `split`, `merge`, `add_after`, and `remove`
- the highest-risk planned edits
- whether the workflow believes untouched slides will remain untouched

The purpose of this checkpoint is to confirm "the tool understood the assignment" before it edits the deck.

### Review-With-Warnings Ending Tone

When the run is usable for review but not ready for presentation, the workflow must end with cautious confidence.

Required recommendation tone:

- `safe to review`
- `not presentation-ready until flagged items are checked`

The workflow must not:

- overclaim that the deck is fully ready
- collapse into a generic warning with no recommendation
- frame the result as a failure if the deck remains trustworthy as a review draft

## Skills Content Specification

### 3.1 `.agents/skills/ppt-agent/SKILL.md` — full rewritten file content

~~~~markdown
---
name: ppt-agent
description: "ppt-agent creates new business presentations in Phase 1 and updates existing decks in Phase 2. It uses built-in-model research and design planning, optional t2i_model image generation, shared pptx mechanics for deck editing/building, and PPTEval-style review."
---

# ppt-agent

This skill is built on top of the existing `pptx` skill:

- `ppt-agent` owns orchestration, manuscript quality, slide analysis, design planning, update planning, and evaluation
- `pptx` owns deck generation, unpack/edit/pack, and render mechanics

Default style contract:

- business deck
- minimal text
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

If you do not configure `t2i_model`, both workflows must still work. They should rely on user assets, charts, diagrams, screenshots, shapes, layout, and style-preserving edits rather than external image generation.

## Phase 1 Create Workflow

Phase 1 creates a **new** deck. It does not edit an existing reference deck in place.

### 1. Intake

- classify the request
- determine audience, objective, and target deck length
- decide whether the request is:
  - prompt-only and researchable
  - prompt plus source material
  - insufficiently grounded and should stop

Prompt-only requests are allowed only when they can be grounded in verifiable research.

### 2. Research

Read [roles/research.md](roles/research.md).

Outputs:

- `manuscript.md`
- source provenance for researched claims when needed
- `source-provenance.json`

### 3. Design Plan

Read [roles/design.md](roles/design.md).

Outputs:

- `design_plan.md`
- slide family mapping
- reference selection strategy: `none`, `style`, `structure`, or `style_and_structure`
- `slide-build-spec.json`

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

Operational commands:

```bash
node scripts/create-run.js \
  --root-dir .ppt-agent-runs \
  --prompt "Build a Q2 operating review for leadership" \
  --objective "Summarize Q2 performance and next-step decisions" \
  --attachments /absolute/path/to/source.md \
  --manuscript /absolute/path/to/manuscript.md \
  --design-plan /absolute/path/to/design_plan.md

node scripts/build-pptx-from-handoff.js \
  --handoff .ppt-agent-runs/<run-id>/artifacts/pptx-handoff.json

node scripts/evaluate-run.js \
  --run-root .ppt-agent-runs/<run-id>
```

### 5. Optional Image Generation

Use only when it materially improves a slide:

```bash
node scripts/generate-image.js \
  --prompt "Analytical process diagram for quarterly planning, restrained business look, orange accent #FA6611" \
  --output images/slide-03-process.png \
  --aspect "16:9"
```

If image generation fails but the deck remains understandable and on-style, return a partial-success result with an explicit warning.

### 6. Evaluation

Phase 1 uses `node scripts/evaluate-run.js --run-root .ppt-agent-runs/<run-id>`.

It emits:

- `artifacts/evals.json`
- `artifacts/phase1-eval.json`

The evaluator is artifact-driven rather than multimodal. It enforces the Phase 1 quality thresholds without pretending to ship the deferred slide-image comparison flow.

## Phase 2 Edit Workflow

Phase 2 updates an existing deck while preserving its narrative spine and visual identity unless the user explicitly asks for a restyle.

Default policy:

- preserve original deck style
- tighten only where readability, contrast, spacing, hierarchy, or factual freshness clearly improve
- do not silently convert the whole deck into the Phase 1 house style

Operational path:

```text
existing deck
  -> edit-run initialization
  -> deck evidence extraction
  -> agent multimodal slide-caption pass
  -> caption-image normalization
  -> slide analysis
  -> research delta
  -> update_plan.md + update_plan.json
  -> edit_handoff.json
  -> targeted slide edits through pptx unpack/edit/pack
  -> before-vs-after evaluation
```

Required artifacts:

- `input/edit_brief.json`
- `artifacts/original-text.md`
- `artifacts/original-slide-index.json`
- `artifacts/raw-slide-captions.json`
- `artifacts/slide_analysis.json`
- `artifacts/research_delta.md`
- `artifacts/update_plan.md`
- `artifacts/update_plan.json`
- `artifacts/edit_handoff.json`
- `artifacts/output-updated.pptx`
- `artifacts/comparison_evals.json`

Operational commands:

```bash
node scripts/edit-run.js \
  --root-dir .ppt-agent-runs \
  --deck /absolute/path/to/source.pptx \
  --change-request "Refresh Q1 metrics and add one slide on Q2 hiring plan" \
  --attachments /absolute/path/to/q1-metrics.md,/absolute/path/to/hiring-plan.md

node scripts/caption-image.js \
  --raw-json .ppt-agent-runs/<run-id>/artifacts/raw-slide-captions.json \
  --output .ppt-agent-runs/<run-id>/artifacts/slide_analysis.json

node scripts/apply-edit-run.js \
  --run-root .ppt-agent-runs/<run-id> \
  --update-plan .ppt-agent-runs/<run-id>/artifacts/update_plan.json

node scripts/finalize-edit-run.js \
  --run-root .ppt-agent-runs/<run-id>
```

Edit mode is complete only when:

- requested updates are reflected in the deck
- untouched slides remain visually consistent with the source deck
- comparison evaluation confirms factual freshness improved and coherence/design did not regress

## Files

- [reference.md](reference.md): setup, run-state contract, configuration, troubleshooting
- [roles/research.md](roles/research.md): research execution instructions for create and edit modes
- [roles/design.md](roles/design.md): design execution instructions for create and edit modes
- [scripts/create-run.js](scripts/create-run.js): Phase 1 run initialization entrypoint
- [scripts/build-pptx-from-handoff.js](scripts/build-pptx-from-handoff.js): Phase 1 narrow deck builder
- [scripts/evaluate-run.js](scripts/evaluate-run.js): Phase 1 contract-level evaluator
- `scripts/edit-run.js`: Phase 2 run initialization entrypoint
- `scripts/caption-image.js`: Phase 2 raw-caption normalization helper
- `scripts/apply-edit-run.js`: Phase 2 structural edit scaffold
- `scripts/finalize-edit-run.js`: Phase 2 pack/render/compare finalizer
- [prompts/eval-content.md](prompts/eval-content.md)
- [prompts/eval-design.md](prompts/eval-design.md)
- [prompts/eval-coherence.md](prompts/eval-coherence.md)

## Tests

```bash
npm test
```

Release-blocking coverage must include:

- `t2i_model` config handling
- image-generation request and failure paths
- create-workflow build path
- create-workflow states and partial-success behavior
- edit-workflow run initialization and resume logic
- raw-caption normalization into `slide_analysis.json`
- update-plan validation
- style-preserving edit behavior
- before-vs-after comparison evaluation
~~~~

### 3.2 `.agents/skills/ppt-agent/reference.md` — full rewritten file content

~~~~markdown
# ppt-agent Reference

## Scope

This reference documents both supported workflows:

- Phase 1: create a new deck
- Phase 2: edit an existing deck through a style-preserving update path

## Setup

```bash
cd .agents/skills/ppt-agent
npm install
```

Optional text-to-image configuration:

```bash
cp .env.example .env
cp config.yaml.example config.yaml
```

If `config.yaml` is missing, the skill should still run without external image generation.

## Configuration

### `.env`

```bash
T2I_API_KEY=
```

### `config.yaml`

Only `t2i_model` is supported:

```yaml
t2i_model:
  base_url: "https://example-provider.invalid/v1"
  model: "provider/image-model"
  api_key_env: "T2I_API_KEY"
  modalities: ["image"]
  image_config:
    aspect_ratio: "16:9"
    image_size: "1K"
```

Unsupported slots such as `vision_model`, `long_context_model`, `eval_model`, `research_agent`, and `design_agent` should fail validation.

## Prompt-Only Grounding Policy

Prompt-only create requests are allowed only when the workflow can ground them in verifiable research.

- if the topic is supportable, proceed and record provenance for researched claims
- if the topic is too vague, private, or unsupported, stop in the insufficient-brief state

## Create-Mode Build Contract

Phase 1 create mode always generates a **new** deck through `pptx`.

References may influence:

- style
- structure
- both

References do **not** switch Phase 1 into template-editing-first behavior.

## Edit-Mode Update Contract

Phase 2 edit mode always starts from an existing `.pptx` and updates it through the shared `pptx` unpack/edit/pack flow.

Edit mode:

- preserves the original deck style by default
- may tighten clarity, spacing, contrast, and hierarchy when that does not create visual drift
- requires explicit user intent for full restyling

## Run-State Contract

Each logical run should have a run root:

```text
.ppt-agent-runs/{run_id}/
├── manifest.json
├── input/
├── artifacts/
├── renders/
├── working/
└── logs/
```

### Phase 1 minimum artifacts

- `artifacts/manuscript.md`
- `artifacts/design_plan.md`
- `artifacts/slide-build-spec.json`
- `artifacts/output.pptx`
- `artifacts/evals.json`

### Phase 2 minimum artifacts

- `artifacts/original-text.md`
- `artifacts/original-slide-index.json`
- `artifacts/raw-slide-captions.json`
- `artifacts/slide_analysis.json`
- `artifacts/research_delta.md`
- `artifacts/update_plan.md`
- `artifacts/update_plan.json`
- `artifacts/edit_handoff.json`
- `artifacts/output-updated.pptx`
- `artifacts/comparison_evals.json`

### Minimum manifest fields

- `run_id`
- `phase`
- `status`
- `style_contract_version`
- phase-specific input fingerprint fields
- artifact paths

### Resume behavior

- reuse only compatible runs
- resume from the earliest invalidated stage
- fail clearly on corrupted manifests

For Phase 2 specifically:

- changing the source deck invalidates from `analyze`
- changing change-source material invalidates from `research`
- changing only the update plan invalidates from `plan`
- comparison-only changes invalidate from `evaluate`

### Before-Artifact Reuse Rule

The following Phase 2A artifacts are immutable and reusable across all Phase 2B retries unless the source deck hash changes:

- `renders/before/`
- `artifacts/original-text.md`
- `artifacts/raw-slide-captions.json`
- `artifacts/slide_analysis.json`

Phase 2B must consume these artifacts as cached inputs. It must not re-render, re-caption, or re-analyze the original deck unless the source deck itself changed.

## Shared `pptx` Dependency Boundary

Use the shared `pptx` skill for:

```bash
python -m markitdown source.pptx
python scripts/thumbnail.py source.pptx
python scripts/office/unpack.py source.pptx unpacked/
python scripts/clean.py unpacked/
python scripts/office/pack.py unpacked/ output-updated.pptx --original source.pptx
python scripts/office/soffice.py --headless --convert-to pdf output-updated.pptx
```

`ppt-agent` must not reimplement these mechanics locally.

## Multimodal Slide-Caption Contract

Phase 2 does not make `caption-image.js` a direct model-calling CLI.

Instead, the invocation path is fixed to:

1. the main agent performs the multimodal pass over `renders/before/slide-*.png`
2. the main agent writes raw per-slide caption output to `artifacts/raw-slide-captions.json`
3. `node scripts/caption-image.js --raw-json ... --output ...` validates and normalizes that raw payload into `artifacts/slide_analysis.json`

This keeps built-in-model use in the agent layer and keeps `caption-image.js` deterministic and testable.

## Script Reference

### `node scripts/create-run.js`

Initialize a Phase 1 create run:

```bash
node scripts/create-run.js \
  --root-dir .ppt-agent-runs \
  --prompt "Build a Q2 operating review for leadership" \
  --objective "Summarize Q2 performance and decisions" \
  --attachments /absolute/path/to/source.md \
  --manuscript /absolute/path/to/manuscript.md \
  --design-plan /absolute/path/to/design_plan.md
```

### `node scripts/build-pptx-from-handoff.js`

Build a starter PPTX from a handoff artifact:

```bash
node scripts/build-pptx-from-handoff.js \
  --handoff .ppt-agent-runs/<run-id>/artifacts/pptx-handoff.json
```

### `node scripts/evaluate-run.js`

Validate a Phase 1 run:

```bash
node scripts/evaluate-run.js \
  --run-root .ppt-agent-runs/<run-id>
```

### `node scripts/edit-run.js`

Initialize a Phase 2 edit run:

```bash
node scripts/edit-run.js \
  --root-dir .ppt-agent-runs \
  --deck /absolute/path/to/source.pptx \
  --change-request "Refresh Q1 metrics and add one slide on Q2 hiring plan" \
  --attachments /absolute/path/to/q1-metrics.md,/absolute/path/to/hiring-plan.md
```

### `node scripts/caption-image.js`

Normalize raw multimodal slide captions into structured slide-analysis data:

```bash
node scripts/caption-image.js \
  --raw-json .ppt-agent-runs/<run-id>/artifacts/raw-slide-captions.json \
  --output .ppt-agent-runs/<run-id>/artifacts/slide_analysis.json
```

### `node scripts/apply-edit-run.js`

Prepare the structural edit scaffold:

```bash
node scripts/apply-edit-run.js \
  --run-root .ppt-agent-runs/<run-id> \
  --update-plan .ppt-agent-runs/<run-id>/artifacts/update_plan.json
```

### `node scripts/finalize-edit-run.js`

Pack, render, and compare the updated deck:

```bash
node scripts/finalize-edit-run.js \
  --run-root .ppt-agent-runs/<run-id>
```

### `node scripts/generate-image.js`

Use only when optional external image generation is desired:

```bash
node scripts/generate-image.js \
  --prompt "Restrained business process diagram with orange accent #FA6611" \
  --output images/process.png \
  --aspect "16:9" \
  --size "1K"
```

## Test Commands

```bash
npm test
```

## Troubleshooting

**`t2i_model is not configured`**

This is expected when optional image generation is not set up. Both workflows may still proceed without external images.

**`Unsupported config slot`**

Remove non-supported config slots from `config.yaml`.

**`Missing API key for t2i_model`**

Set `T2I_API_KEY` in `.env`, or set `api_key` in `config.yaml`.

**`quality_threshold_failed`**

The create run produced the expected artifacts, but the rubric score fell below the acceptance threshold. Inspect `artifacts/evals.json`.

**`comparison_eval_failed`**

The edit run packed successfully, but the updated deck did not meet freshness, consistency, or coherence thresholds. Inspect `artifacts/comparison_evals.json`.
~~~~

### 3.3 `.agents/skills/ppt-agent/roles/research.md` — full rewritten file content

~~~~markdown
# Research Role

You are responsible for research passes in both `ppt-agent` workflows.

## Phase 1 Create Workflow

Your job is to produce a grounded `manuscript.md` for a new business deck.

### Responsibilities

1. Identify:
   - audience
   - objective
   - slide-count target
   - whether the request is prompt-only or source-backed
2. Decide whether the request is sufficiently grounded to proceed.
3. Gather verifiable material.
4. Produce a concise, business-ready manuscript.

### Prompt-Only Rule

Prompt-only requests are allowed only when they can be supported by verifiable research.

- proceed when the topic is researchable and the workflow can cite its supporting material
- stop when the request is too vague, private, or unsupported by reliable evidence

### Manuscript Rules

- one core business point per slide
- conclusion-first slide logic
- minimal text
- charts, comparisons, and process descriptions preferred over long prose
- every externally researched claim should have provenance available for downstream review
- use `---` for slide breaks

### Output

Write `manuscript.md`.

If the request is not grounded enough, do not fabricate content. Return the insufficient-brief state instead.

## Phase 2 Edit Workflow

Your job is to identify what changed, what is stale, and what must be updated without discarding the current deck structure.

### Responsibilities

1. Read:
   - `artifacts/original-text.md`
   - `artifacts/original-slide-index.json`
   - `artifacts/slide_analysis.json`
2. Summarize each new change source into reusable markdown evidence.
3. Produce `artifacts/research_delta.md`.
4. Identify:
   - stale numbers
   - stale dates
   - outdated claims
   - missing sections
   - removable sections
   - evidence that must be refreshed
5. Keep replacement content concise enough to fit the preserved layouts whenever possible.

### Edit-Mode Rules

- do not rewrite the entire deck objective unless the user explicitly asked for a restyle or restructure
- default to local repair of stale content, not whole-deck reinvention
- preserve the original narrative spine unless the update request requires a real structural change
- use the business-style contract as a tightening lens, not as a silent restyling trigger

### Output

Write `artifacts/research_delta.md`.
~~~~

### 3.4 `.agents/skills/ppt-agent/roles/design.md` — full rewritten file content

~~~~markdown
# Design Role

You are responsible for design passes in both `ppt-agent` workflows.

The actual PPTX mechanics are delegated to `pptx`.

## Phase 1 Create Workflow

Your job is to convert `manuscript.md` into:

- `design_plan.md`
- `slide-build-spec.json`

### Responsibilities

1. Lock the deck-wide design plan.
2. Choose the reference strategy:
   - `none`
   - `style`
   - `structure`
   - `style_and_structure`
3. Map manuscript slides to slide families and layouts.
4. Produce a slide-build spec for new-deck generation through `pptx`.

### Phase 1 Rules

- Phase 1 always generates a **new** deck
- references may influence style and structure, but do not turn the workflow into template editing
- the house style contract is binding:
  - business deck
  - minimal text
  - analytical visuals first
  - `#FA6611` as the primary accent

### Output Requirements

`design_plan.md` must include:

- audience and objective
- reference strategy
- color and typography direction
- slide family map
- page-by-page layout decisions

`slide-build-spec.json` must include enough structure for `pptx` generation to build the deck without guessing the layout intent.

## Phase 2 Edit Workflow

Your job is to turn deck analysis and delta research into a deterministic update contract.

### Responsibilities

1. Write `artifacts/update_plan.md` for human review.
2. Write `artifacts/update_plan.json` for deterministic edit scaffolding.
3. For every slide, choose exactly one action:
   - `keep`
   - `revise`
   - `split`
   - `merge`
   - `add_after`
   - `remove`
4. Record, for every non-`keep` action:
   - business reason for the change
   - content inputs to use
   - layout to preserve or adapt
   - style tokens to preserve
   - risk of visual drift (`low|medium|high`)

### Phase 2 Rules

- preserve existing visual identity by default
- tighten only where readability or professionalism clearly improve
- require explicit user intent for full-deck restyling
- if a requested change no longer fits the current slide, switch to `split` or `add_after` instead of overloading the slide
- keep untouched slides out of the edit scope

### Output Requirements

`update_plan.md` must explain:

- deck-level preservation strategy
- requested changes
- global tightening decisions
- slide-by-slide action rationale

`update_plan.json` must be deterministic enough for `apply-edit-run.js` to scaffold structural edits without guessing.
~~~~

## Data Models

### Run Manifest Extension

`scripts/lib/run-manifest.js` must be extended so `phase` is no longer hardcoded to `create`.

The manifest system stays unified. Do not split create and edit runs into separate manifest modules.

Implementation rule:

- keep one `run-manifest.js`
- make phase-specific schema validation explicit
- make phase-specific compatibility keys explicit
- make phase-specific resume-stage detection explicit
- reject reading an edit manifest through create-mode assumptions or vice versa

Allowed phases:

- `create`
- `edit`

Allowed edit-mode statuses:

- `intake`
- `analyze`
- `research`
- `plan`
- `edit`
- `evaluate`
- `complete`
- `failed`

Concrete manifest shape for edit runs:

```json
{
  "run_id": "20260325-abc123",
  "phase": "edit",
  "status": "analyze",
  "source_deck_hash": "sha256:...",
  "change_fingerprint_hash": "sha256:...",
  "style_preservation_mode": "preserve",
  "restyle_mode": "none",
  "style_contract_version": "v1",
  "artifact_paths": {
    "original_text": "artifacts/original-text.md",
    "original_slide_index": "artifacts/original-slide-index.json",
    "raw_slide_captions": "artifacts/raw-slide-captions.json",
    "slide_analysis": "artifacts/slide_analysis.json",
    "research_delta": "artifacts/research_delta.md",
    "update_plan_md": "artifacts/update_plan.md",
    "update_plan_json": "artifacts/update_plan.json",
    "edit_handoff": "artifacts/edit_handoff.json",
    "output_pptx": "artifacts/output-updated.pptx",
    "comparison_evals": "artifacts/comparison_evals.json"
  }
}
```

The create and edit schemas may share helper functions, but they must not rely on implicit field overlap.

### `slide_analysis.json`

This is the canonical source-of-truth artifact for “what the current deck is doing.”

```json
{
  "deck_summary": {
    "slide_count": 8,
    "narrative_spine": ["title", "context", "performance", "risks", "recommendation", "closing"],
    "style_summary": {
      "accent_colors": ["#FA6611", "#1F1F1F"],
      "font_behavior": "sans-led with serif accent",
      "density": "medium",
      "visual_motif": "orange section numerals and clean comparison cards"
    }
  },
  "slides": [
    {
      "slide_number": 3,
      "role": "content",
      "headline": "Revenue growth slowed in March",
      "layout_summary": "headline + bar chart + three callouts",
      "text_density": "low",
      "visual_assets": ["chart"],
      "style_tokens": {
        "accent_usage": "orange chart highlight",
        "title_alignment": "left",
        "surface_mode": "light"
      },
      "preserve": [
        "headline position",
        "chart-right / commentary-left balance"
      ],
      "issues": [
        "March values are stale",
        "callout wording is too soft"
      ]
    }
  ]
}
```

### `update_plan.json`

This is the deterministic edit contract. `update_plan.md` mirrors it in prose, but `update_plan.json` is the file scripts consume.

```json
{
  "deck_strategy": {
    "preserve_narrative_spine": true,
    "restyle_mode": "none",
    "global_tightening": ["reduce text overload on slides 4 and 6"]
  },
  "slide_actions": [
    {
      "slide_number": 3,
      "action": "revise",
      "reason": "refresh stale metrics and sharpen conclusion",
      "content_inputs": [
        "artifacts/research_delta.md#march-revenue"
      ],
      "preserve": [
        "existing chart-first layout",
        "orange highlight treatment"
      ],
      "edit_scope": {
        "text": true,
        "chart": true,
        "images": false,
        "structure": false
      },
      "drift_risk": "low"
    },
    {
      "slide_number": 5,
      "action": "add_after",
      "reason": "new hiring plan requires its own decision slide",
      "new_role": "content",
      "layout_seed": "duplicate_slide:4",
      "preserve": [
        "section styling",
        "title hierarchy"
      ],
      "drift_risk": "medium"
    }
  ]
}
```

### `edit_handoff.json`

This artifact localizes editing to exact files and jobs after the structural scaffold is prepared.

```json
{
  "phase": "edit",
  "run_root": ".ppt-agent-runs/20260325-abc123",
  "source_deck": "input/original.pptx",
  "unpacked_root": "working/unpacked",
  "jobs": [
    {
      "job_id": "slide-03-revise",
      "slide_number": 3,
      "action": "revise",
      "xml_path": "working/unpacked/ppt/slides/slide3.xml",
      "rels_path": "working/unpacked/ppt/slides/_rels/slide3.xml.rels",
      "preserve": ["headline position", "orange chart highlight"],
      "content_inputs": ["artifacts/research_delta.md#march-revenue"]
    }
  ]
}
```

## Functional Design 1: Intake, Resume, And Deck Evidence Extraction

### Files To Change

- update [run-manifest.js](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/scripts/lib/run-manifest.js)
- create `scripts/edit-run.js`
- create `scripts/lib/edit-workflow.js`
- create `scripts/lib/deck-analysis.js`
- update `package.json`

### `scripts/edit-run.js`

**Script Path:** `.agents/skills/ppt-agent/scripts/edit-run.js`

**Script Purpose:** Initialize a Phase 2 edit run, validate inputs, apply idempotent resume rules, and write the edit-mode input contract.

**Script Inputs:**

- `--root-dir`
- `--deck` absolute path to source `.pptx`
- `--change-request`
- `--attachments` optional comma-separated paths
- `--restyle` optional `none|tighten|full`

**Script Outputs:**

- `input/edit_brief.json`
- `input/source_deck.json`
- `input/change_sources.json`
- `manifest.json`
- `logs/stage-status.json`

**Script User Interaction:** none. Fails clearly on missing deck or missing change request.

**Detailed Implementation:**

```javascript
function main() {
  const args = parseArgs(process.argv.slice(2));
  assertDeckExists(args.deck);
  assertNonEmpty(args.changeRequest);

  const request = normalizeEditRequest(args);
  const sourceDeckHash = hashFile(args.deck);
  const changeFingerprintHash = hashPaths(args.attachments, args.changeRequest);

  const resume = findLatestCompatibleRun(rootDir, {
    phase: 'edit',
    source_deck_hash: sourceDeckHash,
    change_fingerprint_hash: changeFingerprintHash,
    style_contract_version: 'v1'
  });

  const { runRoot, manifest, resumeStage } = initOrReuseEditRun({
    rootDir,
    request,
    sourceDeckHash,
    changeFingerprintHash,
    resume
  });

  writeEditInputs(runRoot, request, args.deck, args.attachments);
  writeStageStatus(runRoot, resumeStage || 'analyze');
  printJson({ status: 'ready', runRoot, manifestPath, resumeStage });
}
```

### `scripts/lib/deck-analysis.js`

**Script Purpose:** Produce deterministic “before” artifacts from the source deck using shared `pptx` tools.

**Detailed Implementation:**

1. copy source deck to `input/original.pptx`;
2. run `python -m markitdown input/original.pptx > artifacts/original-text.md`;
3. run `python scripts/thumbnail.py input/original.pptx renders/before/thumbnail`;
4. render full-size slide images into `renders/before/slide-*.png`;
5. unpack source deck to `working/unpacked`;
6. create `artifacts/original-slide-index.json` that maps slide number to XML path, rels path, and detected notes/media;
7. the main agent inspects `renders/before/slide-*.png` with the built-in multimodal model and writes `artifacts/raw-slide-captions.json`;
8. `scripts/caption-image.js` normalizes that raw payload into `artifacts/slide_analysis.json`.

This module is mechanical only. It does not decide what to change.

## Functional Design 2: Delta Research And Update Planning

### Files To Change

- update [research.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/roles/research.md)
- update [design.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/roles/design.md)
- replace deferred `.agents/skills/ppt-agent/scripts/summarize-doc.js`
- replace deferred `.agents/skills/ppt-agent/scripts/caption-image.js`
- create `scripts/lib/update-plan.js`

### `scripts/summarize-doc.js`

**Script Path:** `.agents/skills/ppt-agent/scripts/summarize-doc.js`

**Script Purpose:** Normalize a single update source into concise markdown the agent can cite in `research_delta.md`.

**Script Inputs:**

- `--input` document path
- `--output` markdown path

**Script Outputs:** summary markdown file with source path, extracted title, key facts, and missing-data warnings.

**Detailed Implementation:**

```javascript
function summarizeDoc(inputPath, outputPath) {
  const text = extractTextByExtension(inputPath);
  if (!text.trim()) {
    throw new Error('Document contained no extractable text');
  }
  const summary = toSectionedMarkdown({
    source: inputPath,
    key_facts: firstNMeaningfulLines(text, 20),
    warnings: detectWeakEvidence(text)
  });
  fs.writeFileSync(outputPath, summary);
}
```

### `scripts/caption-image.js`

**Script Purpose:** Validate and normalize raw multimodal caption output from the main agent into structured slide-analysis records.

**Fixed invocation path:**

1. the main agent performs the multimodal pass over `renders/before/slide-*.png`
2. the main agent writes `artifacts/raw-slide-captions.json`
3. `caption-image.js` reads that raw file and emits `artifacts/slide_analysis.json`

`caption-image.js` is intentionally **not** a direct model-calling CLI. The built-in model stays in the agent layer; the script stays deterministic and testable.

**Script Inputs:**

- `--raw-json` path to `artifacts/raw-slide-captions.json`
- `--output` path to `artifacts/slide_analysis.json`

**Output shape:**

```json
{
  "image_path": "renders/before/slide-03.png",
  "layout_summary": "headline plus chart and three callouts",
  "visual_assets": ["chart"],
  "readability_risks": ["legend is dense"],
  "style_notes": ["orange highlight bar", "light background"]
}
```

**Detailed Implementation:**

```javascript
function captionImage(rawJsonPath, outputPath) {
  const raw = JSON.parse(fs.readFileSync(rawJsonPath, 'utf8'));
  assertValidRawCaptionPayload(raw);

  const normalized = {
    deck_summary: summarizeDeckStyle(raw.slides),
    slides: raw.slides.map((slide) => ({
      slide_number: slide.slide_number,
      layout_summary: normalizeLayout(slide.layout_summary),
      visual_assets: normalizeAssetList(slide.visual_assets),
      readability_risks: normalizeRiskList(slide.readability_risks),
      style_notes: normalizeStyleNotes(slide.style_notes)
    }))
  };

  fs.writeFileSync(outputPath, JSON.stringify(normalized, null, 2));
}
```

### `scripts/lib/update-plan.js`

**Script Purpose:** Validate `update_plan.json` before any structural edits occur.

**Validation Rules:**

- every slide must have at most one action;
- `add_after` and `split` require a `layout_seed`;
- `merge` must name the keeper slide;
- `keep` cannot include edit scope;
- every non-`keep` action must declare at least one `preserve` token.

## Functional Design 3: Structural Edit Scaffold And Slide-Level Editing

### Files To Change

- create `scripts/apply-edit-run.js`
- create `scripts/lib/edit-handoff.js`
- update [SKILL.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/SKILL.md)
- update [reference.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/reference.md)

### `scripts/apply-edit-run.js`

**Script Path:** `.agents/skills/ppt-agent/scripts/apply-edit-run.js`

**Script Purpose:** Turn a validated `update_plan.json` into a concrete editable workspace and emit `edit_handoff.json`.

**Script Inputs:**

- `--run-root`
- optional `--update-plan` override path

**Script Outputs:**

- `artifacts/edit_handoff.json`
- updated `working/unpacked/`
- updated `logs/stage-status.json`

**Detailed Implementation:**

```javascript
function applyEditRun(runRoot, updatePlanPath) {
  const plan = validateUpdatePlan(updatePlanPath);
  const manifest = readManifest(runRoot);
  assert.equal(manifest.phase, 'edit');

  ensureUnpackedWorkspace(runRoot);

  for (const action of plan.slide_actions) {
    switch (action.action) {
      case 'keep':
        recordKeepJob(action);
        break;
      case 'revise':
        recordReviseJob(action);
        break;
      case 'split':
        duplicateSourceSlide(action.layout_seed);
        recordSplitJobs(action);
        break;
      case 'add_after':
        duplicateSeedSlide(action.layout_seed);
        insertAfter(action.slide_number);
        recordAddJob(action);
        break;
      case 'merge':
        recordMergeJob(action);
        break;
      case 'remove':
        markSlideForRemoval(action.slide_number);
        break;
    }
  }

  writeEditHandoff(runRoot, jobs);
  writeStageStatus(runRoot, 'edit');
}
```

### Slide-Editing Contract

After `edit_handoff.json` is written, the agent edits only the XML files named there.

Rules:

- revise only listed slides;
- untouched slides are not rewritten;
- structural changes happen before text/media edits;
- every edited slide must preserve its declared tokens unless the action explicitly overrides them;
- if a requested change cannot fit the preserved layout, the plan must switch from `revise` to `split` or `add_after` instead of overloading the slide.

## Functional Design 4: Finalize, Render, And Compare

### Files To Change

- create `scripts/finalize-edit-run.js`
- create `scripts/lib/finalize-edit-run.js`
- replace deferred `.agents/skills/ppt-agent/scripts/eval-presentation.js`

### `scripts/finalize-edit-run.js`

**Script Purpose:** Clean, repack, render after-images, and run comparison evaluation.

**Detailed Implementation:**

1. run shared `pptx` cleanup on `working/unpacked`;
2. pack `working/unpacked` into `artifacts/output-updated.pptx`;
3. render updated slide images into `renders/after/`;
4. run `eval-presentation.js --before renders/before --after renders/after --plan artifacts/update_plan.json`;
5. write `artifacts/comparison_evals.json`;
6. set manifest status to `complete` only if thresholds pass.

### `scripts/eval-presentation.js`

**Script Purpose:** Compare original and updated decks at slide and deck level.

**Checks:**

- requested changes were actually applied;
- unchanged slides did not regress;
- design consistency remained flat or improved;
- coherence remained flat or improved;
- factual freshness improved for every requested delta.

**Comparison Review Hierarchy:**

The final comparison output must be ordered so the operator sees:

1. whether the requested updates were applied
2. whether any regressions were detected
3. the overall verdict: safe to review, review with warnings, or failed
4. deck-level scores
5. slide-level detail

The comparison result must answer "did the requested edit work?" before it answers "how good is the deck overall?"

**Output schema:**

```json
{
  "requested_updates": {
    "applied": 5,
    "missed": 0
  },
  "regressions": [],
  "deck_scores": {
    "freshness": 4.5,
    "design_consistency": 4.2,
    "coherence": 4.1,
    "overall": 4.3
  },
  "result": "pass"
}
```

## Tests

### Script-To-Test Coverage

| Script / Module | Test File |
|---|---|
| `scripts/edit-run.js` | `tests/edit-run.test.js` |
| `scripts/lib/edit-workflow.js` | `tests/workflow-edit-resume.test.js` |
| `scripts/lib/deck-analysis.js` | `tests/deck-analysis.test.js` |
| `scripts/summarize-doc.js` | `tests/summarize-doc.test.js` |
| `scripts/caption-image.js` | `tests/caption-image.test.js` |
| `scripts/lib/update-plan.js` | `tests/update-plan.test.js` |
| `scripts/apply-edit-run.js` | `tests/apply-edit-run.test.js` |
| `scripts/finalize-edit-run.js` | `tests/finalize-edit-run.test.js` |
| `scripts/eval-presentation.js` | `tests/eval-presentation.test.js` |
| full edit flow | `tests/workflow-edit-smoke.test.js` |
| preservation policy | `tests/workflow-edit-style-preservation.test.js` |
| before/after comparison | `tests/workflow-edit-compare.test.js` |
| Phase 2A artifacts consumed by Phase 2B without decision recomputation | `tests/workflow-edit-contract.test.js` |

### Detailed Test Stubs

```javascript
test('edit-run initializes an edit manifest and copies source deck metadata', () => {
  const tmpDir = makeTmpDir();
  const deckPath = fixturePath('source-quarterly-review.pptx');
  const result = runNode('scripts/edit-run.js', [
    '--root-dir', tmpDir,
    '--deck', deckPath,
    '--change-request', 'Refresh Q1 metrics'
  ]);

  assert.equal(result.status, 0);
  const payload = JSON.parse(result.stdout);
  const manifest = readJson(path.join(payload.runRoot, 'manifest.json'));
  assert.equal(manifest.phase, 'edit');
  assert.equal(manifest.status, 'analyze');
});

test('edit-run rejects missing change request', () => {
  const result = runNode('scripts/edit-run.js', [
    '--deck', fixturePath('source-quarterly-review.pptx')
  ]);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /change request/i);
});

test('update-plan validation rejects add_after without layout seed', () => {
  const plan = {
    slide_actions: [{ slide_number: 4, action: 'add_after', reason: 'new slide' }]
  };

  assert.throws(() => validateUpdatePlanObject(plan), /layout_seed/);
});

test('apply-edit-run emits handoff jobs only for touched slides', () => {
  const runRoot = setupEditRunFixture();
  writeJson(path.join(runRoot, 'artifacts', 'update_plan.json'), validPlanFixture());

  const result = applyEditRun(runRoot);
  const handoff = readJson(path.join(runRoot, 'artifacts', 'edit_handoff.json'));

  assert.equal(result.status, 'edit_ready');
  assert.deepEqual(
    handoff.jobs.map((job) => job.slide_number),
    [3, 5]
  );
});

test('workflow-edit-style-preservation keeps untouched slides out of handoff', () => {
  const runRoot = setupEditRunFixture();
  writeJson(path.join(runRoot, 'artifacts', 'update_plan.json'), reviseSingleSlidePlan());

  applyEditRun(runRoot);
  const handoff = readJson(path.join(runRoot, 'artifacts', 'edit_handoff.json'));

  assert.equal(handoff.jobs.length, 1);
  assert.equal(handoff.jobs[0].slide_number, 3);
});

test('finalize-edit-run fails when comparison evaluation reports missed updates', () => {
  const runRoot = setupFinalizedWorkspaceFixture({
    comparisonEval: { requested_updates: { applied: 4, missed: 1 }, result: 'fail' }
  });

  const result = finalizeEditRun(runRoot);
  assert.equal(result.status, 'failed');
  assert.match(result.reason, /missed updates/i);
});

test('workflow-edit-compare passes when freshness improves without style regression', () => {
  const evalResult = compareDecks({
    before: beforeFixture(),
    after: afterFixture(),
    requestedChanges: requestedChangesFixture()
  });

  assert.equal(evalResult.result, 'pass');
  assert.ok(evalResult.deck_scores.design_consistency >= 4.0);
  assert.ok(evalResult.deck_scores.coherence >= 4.0);
});

test('workflow-edit-contract consumes Phase 2A artifacts without recomputing slide actions', () => {
  const runRoot = setupPhase2AArtifactFixture({
    updatePlan: {
      slide_actions: [
        { slide_number: 3, action: 'revise', reason: 'refresh metrics' },
        { slide_number: 5, action: 'add_after', reason: 'new hiring plan', layout_seed: 'duplicate_slide:4' }
      ]
    }
  });

  const result = applyEditRun(runRoot);
  const handoff = readJson(path.join(runRoot, 'artifacts', 'edit_handoff.json'));

  assert.equal(result.status, 'edit_ready');
  assert.deepEqual(
    handoff.jobs.map((job) => [job.slide_number, job.action]),
    [
      [3, 'revise'],
      [5, 'add_after']
    ]
  );
  assert.equal(result.recomputed_actions, false);
});
```

## Evals

Phase 2 uses a comparison-first eval, not the narrower Phase 1 contract check.

Acceptance thresholds:

- requested update application rate: `100%`
- freshness: `>= 4.0`
- design consistency: `>= 4.0`
- coherence: `>= 4.0`
- overall: `>= 4.0`
- no untouched slide may regress by more than `0.3` on design consistency

Blocking failures:

- a requested change is missing;
- a preserved slide drifts into a different visual system;
- comparison eval detects narrative breakage after insert/remove/reorder actions;
- final deck packs successfully but the after-render cannot be produced.

## Documentation Changes

### AGENTS.md

No root `AGENTS.md` change is required. This design fits the existing “designer + reviewer gate” contract and keeps the work inside the existing shared/local skill placement.

### README.md

No repo-root `README.md` change is required. The operator-facing updates belong in the skill-local docs.

### Docs To Update

- update [TODOS.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/TODOS.md) so the Phase 2 TODO points to this design
- optionally add one cross-reference from [docs/PPT_AGENT_SKILL_DESIGN.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/docs/PPT_AGENT_SKILL_DESIGN.md) to this doc under Functional Design 2

## What Already Exists

- a Phase 1 `ppt-agent` design and implementation direction already exist
- the shared `pptx` skill already owns unpack, pack, render, cleanup, and text extraction mechanics
- the Phase 1 plan already defines the business style contract, readability ranges, and evaluation posture
- the Phase 2 design now inherits those existing constraints rather than inventing a separate presentation language

## NOT in Scope

- full-deck restyling by default
- converting every edited deck into the Phase 1 house style
- preserving every local inconsistency in a messy source deck
- shrinking text below readable presentation ranges just to keep the original layout
- generic score-only review output with no editorial summary
- repo-wide design-system creation for all skills in this repository

## Unresolved Design Decisions

None after this review cycle.

## Implementation Checklist

- [ ] extend `run-manifest.js` for `phase=edit`
- [ ] add `scripts/edit-run.js`
- [ ] add `scripts/lib/edit-workflow.js`
- [ ] add `scripts/lib/deck-analysis.js`
- [ ] implement `scripts/summarize-doc.js`
- [ ] implement `scripts/caption-image.js`
- [ ] add `scripts/lib/update-plan.js`
- [ ] add `scripts/apply-edit-run.js`
- [ ] add `scripts/lib/edit-handoff.js`
- [ ] add `scripts/finalize-edit-run.js`
- [ ] implement `scripts/eval-presentation.js`
- [ ] update `SKILL.md` with Phase 2 workflow text
- [ ] update `reference.md` with edit-mode contract
- [ ] update `roles/research.md` and `roles/design.md`
- [ ] add edit-mode tests
- [ ] validate before/after render path with shared `pptx` commands

## References

- [docs/PPT_AGENT_SKILL_DESIGN.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/docs/PPT_AGENT_SKILL_DESIGN.md)
- [TODOS.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/TODOS.md)
- [SKILL.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/SKILL.md)
- [reference.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/reference.md)
- [pptx SKILL.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/pptx/SKILL.md)
- [pptx editing.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/pptx/editing.md)

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 0 | — | — |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | — | — |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 1 | CLEAR | 4 issues, 0 critical gaps |
| Design Review | `/plan-design-review` | UI/UX gaps | 1 | CLEAR | score: 6/10 -> 10/10, 11 decisions |

**UNRESOLVED:** 0
**VERDICT:** DESIGN + ENG CLEARED — ready to implement.
