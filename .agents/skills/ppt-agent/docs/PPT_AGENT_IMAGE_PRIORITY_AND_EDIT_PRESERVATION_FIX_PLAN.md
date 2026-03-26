# PPT Agent Image Priority And Edit Preservation Fix Plan

> Design ID: `ppt-agent-image-priority-edit-preservation-2026-03-25`
> Date: 2026-03-25
> Status: Draft
> Scope: Fix the `ppt-agent` create and edit contracts so generated imagery has the right priority, edit mode preserves the existing deck instead of silently rebuilding it, all outputs live under `<skill-root>/runs`, per-slide transcripts are emitted from grounded inputs, and run evidence is never left empty.
>
> Constraint: This is a design artifact only. Do not implement until approved.

---

## Overview

The current `ppt-agent` implementation has the right high-level intent but the wrong enforcement points.

Observed from the failing edit run at [`.ppt-agent-runs/202603250912-fc331e/manifest.json`](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.ppt-agent-runs/202603250912-fc331e/manifest.json):

- the run stops in `status: "plan"`
- the run has plan artifacts but no `artifacts/edit_handoff.json`
- the run has no `artifacts/comparison_evals.json`
- the run has `renders/before/*` but no `renders/after/*`
- the run creates a destination deck outside the skill run root at [`ppt/qa-plan-orchestrator/QA-Plan-Skill.pptx`](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/ppt/qa-plan-orchestrator/QA-Plan-Skill.pptx)
- the plan knows some slides use images, but it does not lock what must happen to those images during editing

This is why the workflow can look logically complete while producing an ugly deck: the artifact model treats image decisions, slide preservation, and evidence completeness as optional side effects instead of required contract fields.

## Problem Statement

The fix must satisfy five product rules:

1. For new deck creation and deck editing, generated imagery should have the highest priority whenever a slide needs a visual anchor, except agenda/table-of-contents slides and similar navigation-only slides.
2. Edit mode must respect the current deck layout and current images by default. It must never rewrite the whole deck by discarding existing imagery. It may refine imagery, but replacement must be explicit and justified.
3. Future outputs must be stored under `<skill-root>/runs/<run-id>/...`, not under ad hoc repo-level output folders.
4. Each slide must have its own transcript markdown file, grounded on user requirements, deck content when present, and Tavily background search.
5. Logs, after-renders, summaries, and working evidence must be required outputs, not best-effort extras.

## Evidence From Current Implementation

### Current gaps

- [`edit-workflow.js`](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/scripts/lib/edit-workflow.js) marks `edit_scope.images: true` for image slides but does not define what image operation is allowed or required.
- [`edit-handoff.js`](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/scripts/lib/edit-handoff.js) applies `applyTextUpdateToSlide(...)` for revise/additive actions. The actual edit path is text-first, not asset-first.
- [`deck-analysis.js`](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/scripts/lib/deck-analysis.js) detects `visual_assets` and render paths, but it does not persist slide-level media identity, crop, or preservation anchors strongly enough for downstream enforcement.
- [`eval-presentation.js`](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/scripts/lib/eval-presentation.js) mainly checks requested-action coverage and render counts. It does not fail on image loss, layout drift, or slide-level preservation violations.
- [`run-manifest.js`](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/scripts/lib/run-manifest.js) creates `logs/` and `renders/after/`, but the workflow does not require them to be meaningfully populated before success.

### Root cause

The system currently models slide edits as generic content updates with optional image handling. That abstraction is wrong for presentation work.

For `ppt-agent`, image behavior is not a cosmetic detail. It is part of slide identity.

## Premises

1. A slide with a meaningful visual asset needs an explicit visual strategy, not a boolean `images: true`.
2. Edit mode is an anchored transformation of an existing deck, not a disguised create-mode rebuild.
3. A run cannot be considered complete unless it emits inspectable proof of what changed and what stayed stable.

## Approaches Considered

### Approach A: Minimal Patch

Summary: Tighten the prose in `SKILL.md` and `reference.md`, add a few tests, and keep the current edit/update structure.

Effort: M
Risk: High

Pros:

- smallest code diff
- fastest to start
- keeps the current pipeline shape

Cons:

- does not fix the contract bug
- still lets downstream steps ignore imagery and preservation intent
- likely produces the same failure with better documentation

Reuses:

- current Phase 2 artifact names
- current update-plan shape

### Approach B: Contract-First Preservation Pipeline

Summary: Keep the current Phase 1/Phase 2 split, but make image policy, layout anchoring, transcript emission, run output location, and evidence completeness first-class artifact contracts.

Effort: L
Risk: Medium

Pros:

- fixes the actual failure mode
- preserves existing architecture instead of inventing a new system
- makes create mode and edit mode consistent around slide-level evidence

Cons:

- requires artifact schema changes
- touches planning, handoff, finalize, evaluation, docs, and tests together

Reuses:

- existing run model
- existing `pptx` unpack/edit/pack primitives
- existing Phase 1/Phase 2 workflow split

### Approach C: Full Unified Slide Compiler

Summary: Replace both create and edit paths with a single slide compiler that always regenerates a canonical deck model and then emits PPTX.

Effort: XL
Risk: High

Pros:

- elegant on paper
- one pipeline for everything

Cons:

- violates the edit-preservation requirement
- too much churn for the current problem
- high risk of losing existing layout/image fidelity

Reuses:

- only low-level `pptx` mechanics

## Recommendation

Choose Approach B because it fixes the real contract bug without throwing away the current `ppt-agent` architecture.

## Architecture

### Workflow chart

```text
create request or edit request
  -> run initialization under <skill-root>/runs/<run-id>/
  -> source + deck evidence extraction
  -> per-slide transcript grounding
     -> user requirement
     -> ppt content / notes / source material
     -> Tavily background search
     -> insufficiency gate: ask user for more info when grounding is still weak
  -> per-slide transcript generation
  -> per-slide image policy planning
  -> build or anchored-edit handoff
  -> deck production
  -> before/after render proof
  -> preservation-aware evaluation
  -> summary + logs + transcript index
```

### New core rule: image-first slide policy

Every slide gets two explicit fields:

- `visual_role`
- `image_strategy`

`visual_role` enum:

- `agenda`
- `section_divider`
- `hero`
- `explainer`
- `process`
- `comparison`
- `evidence`
- `qa`
- `appendix`

`image_strategy` enum:

- `forbid`
- `preserve`
- `refine`
- `replace`
- `generate_new`
- `optional`

Required default policy:

- `agenda`, `section_divider`, `appendix index`:
  - default `image_strategy: forbid`
- create-mode `hero`, `explainer`, `process`, `comparison`, `evidence`, `qa`:
  - default `image_strategy: generate_new` unless a user-provided screenshot/chart/diagram already satisfies the visual role
- edit-mode slides with existing image/media:
  - default `image_strategy: preserve`
  - may become `refine` if the plan explicitly says the existing image is usable but needs cleanup, annotation, crop, or replacement with a derived variant
  - may become `replace` only when the update plan records a concrete reason and the workflow can show the replacement image to the user for approval before finalizing it
- edit-mode new slides created from an existing slide seed:
  - default `image_strategy: preserve` if the duplicated seed contains the relevant image
  - otherwise `generate_new`

### Non-negotiable edit-mode rule

Edit mode must be `anchor-preserving`, not `content-regenerating`.

For every non-new slide, the plan must record:

- `source_slide_number`
- `source_layout_anchor`
- `source_media_refs`
- `allowed_layout_delta`
- `allowed_image_delta`

If these anchors are missing, finalize must fail.

### Approval state machine

Image replacement approval must be a first-class run state, not a prose-only pause.

Required edit-mode states:

- `analyze`
- `research`
- `plan`
- `edit`
- `awaiting_image_approval`
- `evaluate`
- `complete`
- `failed`

Required approval artifacts:

- `artifacts/approval-request.json`
- `artifacts/approval-decision.json`
- `artifacts/replacement-previews/slide-XX.png`

State transitions:

```text
edit
  -> if no replacement approval is needed -> evaluate
  -> if replacement approval is needed -> awaiting_image_approval

awaiting_image_approval
  -> approved -> evaluate
  -> rejected -> edit
  -> no response / missing decision artifact -> remain awaiting_image_approval
```

Resume rule:

- if `approval-request.json` exists and `approval-decision.json` is absent, resume into `awaiting_image_approval`
- if `approval-decision.json` records approval, resume into `evaluate`
- if `approval-decision.json` records rejection, resume into `edit`

### Run root rule

All outputs must live under:

```text
.agents/skills/ppt-agent/runs/<run-id>/
```

This includes:

- input source deck copy
- working unpacked deck
- generated images
- rendered before/after slides
- transcripts
- final output deck
- logs
- summaries

Repo-level destination folders like `ppt/<name>/...` are forbidden for workflow-owned outputs.

### Transcript grounding rule

Every slide transcript must be built from these inputs in order:

1. the user requirement or change request
2. the source deck content, speaker notes, and attached source material when they exist
3. background search results gathered through Tavily search

If those three inputs still do not provide enough context to write a grounded transcript, the workflow must stop in `needs_context` and ask the user for more information. It must not invent background content to make the transcript look complete.

Performance rule:

- Tavily grounding must default to one cached deck-level search pass per run
- slide-specific follow-up search is allowed only when the deck-level grounding marks a concrete unresolved gap for that slide or slide family
- the workflow must reuse cached deck-level grounding results across transcript generation, not fan out into one search per slide by default

## Folder Structure

```text
.agents/skills/ppt-agent/
├── SKILL.md
├── reference.md
├── roles/
│   ├── research.md
│   └── design.md
├── docs/
│   └── PPT_AGENT_IMAGE_PRIORITY_AND_EDIT_PRESERVATION_FIX_PLAN.md
├── scripts/
│   ├── create-run.js
│   ├── edit-run.js
│   ├── apply-edit-run.js
│   ├── finalize-edit-run.js
│   └── lib/
│       ├── build-pptx-from-handoff.js
│       ├── deck-analysis.js
│       ├── edit-handoff.js
│       ├── edit-workflow.js
│       ├── eval-presentation.js
│       ├── run-manifest.js
│       ├── slide-transcript.js              # new
│       └── finalize-edit-run.js             # extend with internal preservation audit helpers
└── tests/
    ├── workflow-create-image-priority.test.js           # new
    ├── workflow-edit-image-preservation.test.js         # new
    ├── workflow-edit-run-artifacts.test.js              # new
    ├── slide-transcript.test.js                         # new
    ├── slide-image-policy.test.js                       # new
    └── slide-preservation-audit.test.js                 # new
```

## Data Models

### 1. `slide_analysis.json` additions

Every slide record must add:

```json
{
  "visual_role": "explainer",
  "has_existing_media": true,
  "source_media_refs": [
    {
      "relationship_id": "rId5",
      "target": "ppt/media/image3.png",
      "content_hash": "sha256:..."
    }
  ],
  "layout_anchor": {
    "title_box": "shape:sp3",
    "body_box": "shape:sp5",
    "image_box": "shape:pic2"
  },
  "speaker_notes_present": true
}
```

### 2. `update_plan.json` additions

Each non-keep action must include:

```json
{
  "visual_role": "explainer",
  "image_strategy": "preserve",
  "image_rationale": "Existing diagram is still correct and should remain the visual anchor.",
  "layout_strategy": "preserve",
  "allowed_layout_delta": "tighten_only",
  "allowed_image_delta": "annotation_or_crop_only",
  "transcript_path": "artifacts/slide-transcripts/slide-05.md"
}
```

Rules:

- `image_strategy` is mandatory for every `revise`, `split`, `merge`, and `add_after`
- `allowed_image_delta` is mandatory when `has_existing_media` is true
- `generate_new` is invalid on `agenda` slides
- `replace` in edit mode requires `replacement_reason`
- `replace` in edit mode also requires `replacement_preview_path` and `user_approval_status`

### 3. New artifact manifest entries

Add to `manifest.json` `artifact_paths`:

- `slide_transcripts_dir: "artifacts/slide-transcripts"`
- `transcript_index: "artifacts/transcript-index.json"`
- `source_media_index: "artifacts/source-media-index.json"`
- `run_summary_md: "artifacts/run_summary.md"`
- `operator_summary_json: "artifacts/operator-summary.json"`
- `event_log: "logs/events.jsonl"`
- `stage_status: "logs/stage-status.json"`

## Functional Design 1: Image Priority In Create Mode

### Goal

Generated images should be default-first for slides that need a visual anchor, except navigation-only slides.

### Required changes

#### `roles/design.md`

- define slide families that require visual anchors
- define the `agenda` exception explicitly
- define the decision order:
  - existing attachment or screenshot that already fits
  - otherwise configured generated image
  - otherwise structural fallback only when the slide remains understandable

#### `scripts/lib/build-pptx-from-handoff.js`

- promote image generation from `optional_image` to `required_visual` for eligible slide families
- treat `agenda` slides as `image_strategy: forbid`
- fail the slide build when a visual-required slide has neither a usable provided asset nor a generated asset, unless the slide family is explicitly marked `text-safe`
- record whether the configured model actually ran and what artifact it produced

### Validation expectation

- a create-mode run with explainer/process/evidence slides produces generated image artifacts or a documented user-asset substitution
- an agenda slide never generates an unnecessary decorative image

## Functional Design 2: Layout And Image Preservation In Edit Mode

### Goal

Edit mode must preserve the source deck’s layout and images unless the plan explicitly permits a controlled change.

### Required changes

#### `scripts/lib/deck-analysis.js`

- index actual source media relationships, not just `visual_assets: ["image"]`
- persist `source_media_index.json`
- capture slide layout anchors for title/body/image placeholders
- detect speaker notes presence and notes part paths

#### `scripts/lib/edit-workflow.js`

- build image-preservation-aware update plans
- stop using bare `edit_scope.images: true` as the only image signal
- mark each changed slide with:
  - `layout_strategy`
  - `image_strategy`
  - `source_media_refs`
  - `allowed_layout_delta`
  - `allowed_image_delta`
- when a slide already contains image/media, default to `image_strategy: preserve`
- when a slide is duplicated with `layout_seed: duplicate_slide:<n>`, inherit the seed slide’s image contract unless the plan overrides it

#### `scripts/lib/edit-handoff.js`

- split text updates from image operations
- emit per-job image actions:
  - `keep_media`
  - `refine_media`
  - `replace_media`
  - `generate_media`
- forbid a revise job from dropping source media unless `image_strategy` allows it
- record source and destination media refs in the handoff output
- when `image_strategy: replace`, emit a preview artifact path and pause for user approval before the replacement is treated as final

#### `scripts/lib/run-manifest.js`

- add `awaiting_image_approval` to edit-mode statuses
- add approval artifact paths to the manifest
- make resume detection route approval-pending runs back into the approval state instead of falling through to `edit` or `evaluate`

#### `scripts/lib/finalize-edit-run.js`

- run a preservation audit before packing success
- fail if:
  - a preserved-media slide loses all media refs
  - a preserve-layout slide changes slide structure beyond allowed delta
  - after-renders are missing
  - comparison artifacts are missing

#### internal preservation audit inside `scripts/lib/finalize-edit-run.js`

- compare source anchors vs final anchors
- compare source media refs and hashes vs final media refs and hashes
- support explicit audit tiers so harmless refinement is not mistaken for unauthorized replacement
- label each changed slide:
  - `preserved`
  - `refined`
  - `replaced_with_approval`
  - `drifted_without_approval`

Audit tier rules:

- `preserve`
  - requires the same source media ref to remain in use, or the same binary hash when the PPTX tooling rewrites packaging but not the asset itself
- `refine`
  - allows a derived asset only when the job records `derived_from_media_ref`
  - the derived asset must still point back to the original source media identity in audit artifacts
  - allowed examples: annotation, crop, callout overlay, format conversion without semantic content change
- `replace`
  - requires an approved preview artifact
  - requires a new final media hash
  - requires `approval-decision.json` to record explicit approval

Required audit fields per changed slide:

- `source_media_ref`
- `source_media_hash`
- `final_media_ref`
- `final_media_hash`
- `derived_from_media_ref`
- `audit_tier`
- `audit_result`

### Validation expectation

- editing a source deck with images never silently returns a text-only rewrite
- image loss becomes a hard failure, not a warning

## Functional Design 3: Per-Slide Transcript Artifacts

### Goal

Every slide should have an inspectable transcript markdown file grounded in real inputs.

### Required changes

Create:

- [`scripts/lib/slide-transcript.js`](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/scripts/lib/slide-transcript.js)

The transcript generator must combine:

- user requirement / change request
- source PPT content and notes, when present
- attachment summaries and provenance
- Tavily background search results

The transcript generator must refuse to emit a final transcript when grounding is insufficient. In that case it must produce a `needs_context` result and list the missing background the user needs to provide.

Emit:

```text
artifacts/slide-transcripts/
├── slide-01.md
├── slide-02.md
└── ...
```

Each transcript must contain:

- slide number
- title
- body text
- transcript grounding summary
- background facts used from Tavily search
- image policy and image asset path
- source notes / provenance
- speaker notes
- action summary
- preservation summary for edit mode

If source notes are missing, transcript generation still proceeds. The transcript must emit an explicit marker such as `Source notes: none present in source deck` instead of treating missing notes as a blocker.

Also emit:

- `artifacts/transcript-index.json`

`artifacts/transcript-index.json` is the single machine-readable source of truth for transcript metadata and grounding metadata. Per-slide markdown transcripts are human-readable renderings derived from that JSON artifact.

### Validation expectation

- transcript count equals final slide count
- add/remove/split operations update transcript numbering consistently
- each transcript cites whether its content came from the user request, source deck, Tavily background search, or a combination
- when the workflow lacks enough grounding, it exits with an explicit user-information request instead of guessing
- missing source notes do not block transcript generation
- transcript grounding metadata lives only in `transcript-index.json`, not a second parallel JSON artifact
- transcript grounding does not perform redundant per-slide Tavily searches unless a slide-specific gap is explicitly detected

## Functional Design 4: Required Run Evidence And Logs

### Goal

A run must not finish with empty logs or empty after-state evidence.

### Required changes

#### `scripts/create-run.js`

- write `logs/stage-status.json` consistently, matching what Phase 1 already partially does
- write `logs/events.jsonl` with stage transitions and warnings

#### `scripts/edit-run.js`

- write `logs/stage-status.json` during analyze/research/plan
- write `artifacts/operator-summary.json`

#### `scripts/apply-edit-run.js`

- write job-level results to `logs/events.jsonl`
- update `logs/stage-status.json` after each applied job

#### `scripts/finalize-edit-run.js`

- always produce:
  - `renders/after/*`
  - `artifacts/comparison_evals.json`
  - `artifacts/run_summary.md`
  - `artifacts/operator-summary.json`
- if any of these are missing, return `failed`

### `run_summary.md` structure

The summary must say:

- what changed
- which slides preserved source imagery
- which slides refined imagery
- which slides generated new imagery
- which slides need manual review
- where the final deck lives inside the run root

## Functional Design 5: Output Location Contract

### Goal

The workflow-owned final deck must live inside the skill run root.

### Required changes

#### `scripts/lib/run-manifest.js`

- make run-root output paths canonical
- forbid manifest output paths pointing outside `runRoot`

#### runtime path handling

- Phase 1 and Phase 2 default roots stay:

```text
.agents/skills/ppt-agent/runs
```

- final decks must be:
  - create mode: `artifacts/output.pptx`
  - edit mode: `artifacts/output-updated.pptx`

- any optional export/copy step must be explicit user follow-up behavior, not the workflow default

### Validation expectation

- no new workflow result is written to `.ppt-agent-runs/...`
- no new workflow result is written to `ppt/...`

## Skills Content Specification

### `SKILL.md`

Update the skill contract to say:

- generated imagery is primary for create mode except agenda-like slides
- edit mode is source-preserving by default
- full-deck regeneration is disallowed unless the user explicitly requests a restyle rebuild
- per-slide transcripts and non-empty evidence artifacts are required deliverables
- run outputs live under `.agents/skills/ppt-agent/runs/<run-id>/...`

### `reference.md`

Update reference docs to include:

- image policy decision table
- edit preservation contract
- transcript artifact paths
- required logs and summaries
- run-root output location guarantee

### `roles/design.md`

Add:

- slide family to image strategy mapping
- agenda exception
- edit-mode `preserve/refine/replace/generate_new` rules

### `roles/research.md`

Add:

- transcript expectations
- transcript grounding order: user requirement -> deck/source material -> Tavily search
- explicit `needs_context` rule when grounding is insufficient
- explicit fallback rule: missing source notes do not block transcript generation
- speaker-notes and provenance formatting requirements

## Tests

Stub tests only:

1. `workflow-create-image-priority.test.js`
   - fails when an explainer/process/evidence slide has no approved visual path
   - passes when an agenda slide has no generated image

2. `workflow-edit-image-preservation.test.js`
   - fails when a revised source-image slide loses its image without approval
   - passes when a revised slide preserves media refs
   - passes when a revised slide refines media under `image_strategy: refine`

3. `workflow-edit-run-artifacts.test.js`
   - fails if `comparison_evals.json`, `run_summary.md`, `operator-summary.json`, or `renders/after/*` are missing

4. `slide-transcript.test.js`
   - transcript count equals final slide count
   - transcript includes speaker notes and image policy
   - transcript records grounding inputs from user requirement, deck content, and Tavily search
   - transcript succeeds when Tavily returns usable background results
   - transcript handles Tavily empty results deterministically
   - transcript handles Tavily search errors deterministically
   - transcript generation fails into `needs_context` when those inputs are still insufficient
   - transcript generation still succeeds when source notes are absent and emits an explicit `none present in source deck` marker
   - transcript tests use mocked Tavily responses rather than live search

5. `slide-image-policy.test.js`
   - move these assertions into existing create/edit workflow tests instead of creating a dedicated policy helper test file

6. `slide-preservation-audit.test.js`
   - keep these assertions under `finalize-edit-run.test.js` or a narrowly named finalize-focused test file instead of introducing a separate audit module test

7. Update existing tests:
   - [`workflow-edit-style-preservation.test.js`](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/tests/workflow-edit-style-preservation.test.js)
   - [`workflow-edit-resume.test.js`](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/tests/workflow-edit-resume.test.js)
   - create-mode partial-success tests
   - run-manifest tests
   - finalize/edit comparison tests
   - add workflow-level approval regression coverage for:
     - `awaiting_image_approval`
     - `approved -> evaluate`
     - `rejected -> edit`
     - resume detection when approval artifacts are present or missing

## Evals

Add preservation-aware eval checks:

- image retention score
- layout drift score
- transcript completeness score
- transcript grounding score
- evidence completeness score

Hard failure conditions:

- missing `renders/after`
- missing `comparison_evals.json`
- missing per-slide transcripts
- transcript emitted without enough grounding and without a `needs_context` stop
- unauthorized loss of source imagery
- output path outside `runRoot`

## Documentation Changes

### Files to change

- [`SKILL.md`](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/SKILL.md)
- [`reference.md`](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/reference.md)
- [`roles/design.md`](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/roles/design.md)
- [`roles/research.md`](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/roles/research.md)

### Files to create

- [`docs/PPT_AGENT_IMAGE_PRIORITY_AND_EDIT_PRESERVATION_FIX_PLAN.md`](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/docs/PPT_AGENT_IMAGE_PRIORITY_AND_EDIT_PRESERVATION_FIX_PLAN.md)
- [`scripts/lib/slide-transcript.js`](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/ppt-agent/scripts/lib/slide-transcript.js)
- new tests listed above

## Implementation Checklist

1. Lock the image-policy vocabulary and add it to docs and JSON contracts.
2. Move all workflow-owned outputs under `.agents/skills/ppt-agent/runs/<run-id>/...`.
3. Extend deck analysis to persist media refs, layout anchors, and note availability.
4. Extend update planning to emit slide-level image and layout strategies.
5. Split edit handoff into text ops and image ops.
6. Add preservation audit before finalize success.
7. Emit per-slide transcripts and transcript index.
8. Add transcript grounding through user requirement, source deck content, and Tavily search with a `needs_context` stop when insufficient.
9. Make logs, summaries, comparison evals, and after-renders required outputs.
10. Update tests and add artifact-completeness coverage.
11. Re-run against the failing QA Plan Skill example and verify:
   - final deck is inside the run root
   - preserved slides keep their imagery
   - new slides use approved visuals
   - replacement images are previewed and approved before final replacement
   - transcripts show grounded inputs instead of fabricated background
   - after-renders and summaries are populated

## Open Questions

1. `refine` should initially support:
   - preserve as-is
   - preserve plus annotation/crop
   - replace only after showing the proposed replacement image to the user and receiving explicit approval
2. Tavily grounding should default to one reusable deck-level search pass. Slide-family-specific search is allowed only when a slide clearly needs additional background that the deck-level search did not cover.

## References

- [`docs/PPT_AGENT_SKILL_DESIGN.md`](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/docs/PPT_AGENT_SKILL_DESIGN.md)
- [`docs/PPT_AGENT_PHASE2_EDIT_WORKFLOW_DESIGN.md`](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/docs/PPT_AGENT_PHASE2_EDIT_WORKFLOW_DESIGN.md)
- [`.ppt-agent-runs/202603250912-fc331e/artifacts/update_plan.json`](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.ppt-agent-runs/202603250912-fc331e/artifacts/update_plan.json)
- [`.ppt-agent-runs/202603250912-fc331e/artifacts/slide_analysis.json`](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.ppt-agent-runs/202603250912-fc331e/artifacts/slide_analysis.json)
- [`ppt/qa-plan-orchestrator/QA-Plan-Skill.pptx`](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/ppt/qa-plan-orchestrator/QA-Plan-Skill.pptx)

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 1 | CLEAR | mode: SELECTIVE_EXPANSION, 0 critical gaps |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | — | — |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 2 | CLEAR | 8 issues reviewed in the latest pass, 0 critical gaps |
| Design Review | `/plan-design-review` | UI/UX gaps | 0 | — | — |

**UNRESOLVED:** 0
**VERDICT:** CEO + ENG CLEARED — ready to implement. Outside voice was attempted, but Codex failed on stream/network errors and the Claude fallback timed out before returning findings.
