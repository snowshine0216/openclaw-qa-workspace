# PPT Agent Edit Enrichment Plan

> Design ID: `ppt-agent-edit-enrichment-2026-03-26`
> Date: 2026-03-26
> Status: Draft
> Scope: Make `ppt-agent` edit mode produce presentation-grade transcripts, richer added slides, and explicit image/layout plans when updating an existing `.pptx`.
> Constraint: Design artifact only. Do not implement until approved.

## Overview

The current `ppt-agent` edit path preserves deck structure, but it does not yet
behave like a presentation editor. It behaves like a scoped XML text replacer.

That gap shows up in the sample pair:

- source deck: `ppt/QA-Plan-Skill.pptx`
- edited deck: `ppt/QA-Plan-Skill.enriched.pptx`

Observed outcome:

- the enriched deck has better notes and five additional slides
- the added slides are still plain title-plus-text placeholder layouts
- the added slides do not introduce tables, charts, image panels, or comparison structures
- the transcript material is better than the source deck, but it is still not detailed enough to drive an actual presenter-ready deck

The engineering review changed the implementation direction in three ways:

1. stabilize the current Phase 2 preserve/finalize path before expanding behavior
2. lock one canonical per-slide semantic artifact instead of several peers
3. reuse the existing `pptx`/PptxGenJS structured render path for complex slides instead of building a second component engine directly in OOXML edit mode

## What Already Exists

The plan should reuse the presentation decisions already captured in
`.agents/skills/ppt-agent/references/ppt-agent-presentation-design-system.md`
instead of re-inventing them during implementation.

Existing design leverage:

- analytical-editorial visual direction for create and edit modes
- locked color tokens for warm surfaces, graphite text, orange emphasis, and blue evidence framing
- typography pairing of `Georgia` for hero/display and `Aptos` for operational content
- preferred slide families such as `evidence_panel`, `comparison_matrix`, `process_flow`, `table_summary`, and `qa_two_column`
- anti-slop rules that ban repeated placeholder bullet slides and decorative filler images
- notes strategy that keeps on-slide text short while allowing richer spoken explanation in notes

Existing code and workflow leverage:

- edit-mode planning artifacts and transcript artifacts already exist
- create mode already has a structured slide renderer through `build-pptx-from-handoff.js`
  and the shared `pptx` skill renderers
- preserve/refine/replace media contracts already exist in the update plan, handoff,
  and finalize audit paths
- current phase-2 tests already cover basic edit planning, application, and finalize

Important current-state constraint:

- the current phase-2 baseline is not fully green: preserve/refine finalize coverage
  is failing in `tests/workflow-edit-image-preservation.test.js`

This plan therefore treats stabilization as part of scope, not a separate cleanup.

## Design Scope And Default Classification

This plan has direct UI scope even though it is an agent workflow design,
because the output is a user-facing presentation artifact whose layout,
hierarchy, readability, and visual trust determine whether the feature feels
professional.

Default classification for design review:

- `title_hero` and `closing_statement` slides follow a brand-forward hero model
- analytic content slides follow an app-like information model: calm surfaces,
  strong hierarchy, dense but readable structure
- the overall deck is therefore `hybrid`, not a pure marketing page and not a
  generic dashboard

## Problem Statement

The fix must satisfy seven product rules:

1. Edit mode must generate a presentation-grade transcript, not just reuse slide text plus sparse notes.
2. Added slides must be layout-aware and component-aware, not simple placeholder text replacements.
3. Every added or materially revised slide must declare a primary visual anchor: existing media, generated image, table, chart, diagram, screenshot, or structured shape composition.
4. Image generation must be driven by a first-class meta prompt artifact instead of a short direct prompt string.
5. Speaker script detail must live in separate artifacts so deck copy can stay concise while notes stay rich.
6. Evaluation must fail when an added slide is text-only without an approved exception and without an available structured fallback.
7. Existing preserve/refine media guarantees must remain correct while the richer slide path is introduced.

## Differences Between `pptx` And `ppt-agent`

### `pptx` skill

The `pptx` skill is the structured presentation craft layer. It already knows
how to render non-trivial layouts and avoids plain repeated bullet slides.

Key differences:

- `pptx` owns structured slide composition
- `pptx` already renders tables/shapes/image regions and named layout families
- `pptx` is the right place for deterministic structured rebuilds

### `ppt-agent` skill

The `ppt-agent` skill is the orchestration layer. In create mode it already
routes content into structured layouts. In edit mode it currently preserves
slides well enough, but it does not yet synthesize a strong semantic brief and
route complex edits into the structured renderer.

Key differences:

- `ppt-agent` should decide intent, preservation policy, and fallback strategy
- `ppt-agent` should not grow a second full rendering system beside `pptx`
- `ppt-agent` edit mode should use seed-preserving OOXML edits only for low-risk
  text-tightening work and route complex slides to the structured builder

## Root Cause

### 1. Transcript artifacts are structurally complete but semantically shallow

Current transcript generation writes title, body lines, grounding labels,
source notes, and speaker notes, but the effective transcript content is still
too close to current slide text.

Impact:

- transcript files are not strong enough to drive presenter notes
- transcript files are not strong enough to derive tables, diagrams, or image prompts

### 2. Edit-mode content generation is capped at a tiny text replacement surface

The edit engine currently pulls a few lines from `research_delta.md` and writes
very small text replacements.

Impact:

- added slides inherit placeholder layouts
- only text runs are changed
- no semantic mapping exists for table rows, chart series, card groups, or image slots

### 3. Artifact authority is ambiguous

The current direction introduced several rich artifacts, but did not define
which one is canonical.

Impact:

- transcript, notes, visual plan, and eval layers can drift
- implementation would need to reconcile multiple peer artifacts
- the evaluator could end up grading stale or inconsistent data

### 4. The plan was about to build a parallel renderer

The earlier version proposed new OOXML-side component renderers for edit mode.
That would duplicate responsibilities already handled by the shared `pptx`
structured builder.

Impact:

- unnecessary complexity and maintenance burden
- higher blast radius in the most fragile part of the workflow
- inconsistent visual behavior between create and edit modes

### 5. Existing preservation guarantees are not yet stable

Current phase-2 tests show preserve/refine finalize regressions.

Impact:

- richer edit behavior would pile onto an unstable baseline
- failures would be harder to diagnose because preservation and enrichment
  regressions would be mixed together

## Eng Review Resolution

This plan adopts the following engineering decisions:

- add an explicit **Functional Design 0** stabilization pass before enrichment work
- make `artifacts/slide-briefs/slide-XX.json` the canonical per-slide semantic source of truth
- keep `artifacts/visual-plan.json` as a derived summary, not a peer authority
- generate rich artifacts only for non-`keep` slides; `keep` slides get a cheap preservation stub
- keep seed-preserving OOXML edits for low-risk text-tightening work
- route complex `add_after` and complex `revise` actions to the existing structured `pptx` render path
- require every chosen visual anchor to declare relevance, not just existence
- preserve source-deck theme identity for inserted or rebuilt slides by default,
  using the local ppt-agent design system only as fallback when theme extraction
  fails or when the user explicitly requests restyling

## Architecture

### Workflow Chart

```text
existing deck + change request + attachments
  -> Phase 0: stabilize preserve/refine finalize path
  -> analyze source deck
  -> extract source theme tokens and master-slide cues
  -> classify slides into keep / light_edit / structured_rebuild
  -> for each non-keep slide:
       -> build canonical slide_brief
       -> derive visual plan summary
       -> inherit source theme when parseable; otherwise fall back to local design reference
       -> if generate_new image needed:
            -> generate image meta prompt artifact
  -> execution routing
       -> light_edit -> preserve seed + scoped OOXML text edits
       -> structured_rebuild -> reuse pptx structured renderer for chosen family
  -> write concise on-slide copy
  -> write detailed speaker notes
  -> render before/after
  -> evaluate transcript richness + anchor relevance + preservation + visual completeness
```

### Core Rule

Every non-`keep` slide must have one canonical `slide_brief`.

`slide_brief` answers:

- what the slide must say
- what the presenter should say
- what evidence supports it
- which visual anchor is primary
- why that anchor is relevant to this slide
- whether the slide should stay in light-edit mode or route to structured rebuild

Derived artifacts such as `visual-plan.json`, `speaker-notes/slide-XX.md`, and
`image-prompts/slide-XX.md` must be generated from `slide_brief`, not authored
independently.

### Authority Contract

Artifact authority is locked as follows:

- `slide-briefs/slide-XX.json` is the canonical semantic source of truth for every non-`keep` slide
- `update_plan.json` remains the canonical execution/control-plane artifact consumed by the current edit/apply/finalize path
- `update_plan.json` must be derived from the finalized slide briefs, not authored independently in parallel
- `update_plan.json` may contain execution-only fields that are not duplicated in the brief, such as:
  - source anchors
  - layout seed
  - preserve tokens
  - allowed layout/image delta
  - approval-state fields
- semantic fields that appear in both places must originate in `slide_brief` and be copied into `update_plan.json`
- `visual-plan.json`, `speaker-notes/`, `image-prompts/`, and `presenter-script.md` are all derived artifacts and cannot override either `slide_brief` or `update_plan.json`

This gives the workflow one semantic authority and one execution authority, with
one-way derivation between them instead of peer artifacts that can drift.

### Execution Routing

```text
slide action
  -> keep
     -> emit preservation stub only
  -> revise/add_after
     -> does the request stay within light-edit limits?
        -> yes: light_edit
        -> no: structured_rebuild
```

Routing heuristics are locked as follows:

- choose `light_edit` only when the slide keeps the same primary visual anchor, the same component type, and the same overall layout structure
- choose `structured_rebuild` when the primary visual anchor changes
- choose `structured_rebuild` when the slide needs a new component type such as table, chart, diagram, metric panel, comparison layout, or image panel
- choose `structured_rebuild` when the slide needs tabular, series-based, or multi-region content that the seeded layout does not already support
- choose `structured_rebuild` when text expansion would force layout reflow beyond the recorded `allowed_layout_delta`
- choose `structured_rebuild` for any `add_after` slide whose intended family is not already satisfied by the duplicated seed layout
- `update_plan.json` must record the exact heuristic that selected `light_edit` or `structured_rebuild` for each non-keep slide

### Structured-Rebuild Merge-Back Contract

`structured_rebuild` is a single-slide operation, not a second deck-authoring
workflow.

```text
slide_brief
  -> structured-slide-spec
  -> build one rebuilt slide through shared pptx renderer
  -> export slide package artifact
  -> replace or insert exactly one target slide in working/unpacked deck
  -> re-run preservation audit on neighboring untouched slides
```

Required merge-back rules:

- the rebuild unit is exactly one target slide per `structured_rebuild` action
- the structured renderer must emit a deterministic single-slide package artifact under the run root
- merge-back must declare:
  - target slide number
  - action kind: `replace_existing` or `insert_after`
  - source package path
  - preserved neighboring slide numbers
- merge-back must update the existing edit workspace, not create a second final deck and diff decks later
- untouched slides before and after the rebuilt slide must remain in the same order and retain their existing preservation expectations
- preservation audit runs after reinsertion so a rebuilt slide cannot silently disturb adjacent untouched slides
- if single-slide reinsertion cannot be completed deterministically, the run must fail closed instead of silently falling back to a deck-wide rebuild

### Result Artifact Hierarchy

When an edit run finishes, the default user-facing trust ladder is:

```text
1. artifacts/edit-summary.md
   -> plain-language summary of what changed, what stayed preserved, and why
2. artifacts/visual-plan.json
   -> quick machine-readable scan of slide families, anchors, and render strategies
3. renders/before/* and renders/after/*
   -> visual proof of what changed slide by slide
4. artifacts/comparison_evals.json
   -> detailed quality and preservation evidence
```

This order is mandatory for the default workflow presentation. The user should
see the human-readable summary before raw evaluation output so trust is built in
layers: explanation first, scan second, visual proof third, scoring last.

`edit-summary.md` must answer:

- run outcome: `success`, `partial`, or `failed`
- a prominent `Warnings / Fallbacks Applied` section near the top whenever the run is partial or degraded
- which rebuilt slides should be reviewed first and why
- what changed
- which slides were preserved unchanged
- which slides were lightly edited
- which slides were rebuilt
- which fallbacks or warnings were applied
- what the user should inspect next if the run is partial or degraded

`edit-summary.md` reading order is locked as:

1. run outcome badge or heading
2. `Warnings / Fallbacks Applied` when present
3. `Review First` section listing any `structured_rebuild` slides
4. change summary
5. links or pointers to `visual-plan.json`
6. links or pointers to before/after renders
7. links or pointers to eval artifacts

`Review First` rules:

- include every slide whose final `render_strategy` is `structured_rebuild`
- list slide number, short reason for rebuild, and the primary thing the user should verify
- appear before the normal change summary whenever at least one rebuilt slide exists
- be omitted only when the run contains no rebuilt slides

Fail-closed output rule:

- if the run outcome is `failed`, the workflow must not publish `artifacts/output-updated.pptx` as a usable success artifact
- fail-closed runs may keep working files or debug artifacts inside the run root for diagnosis, but the canonical updated-output slot must remain absent or explicitly marked unavailable
- the first artifact the user sees in a failed run is the summary explaining why no shippable updated deck was produced and what to inspect next

### Slide Hierarchy And Deck Narrative Flow

Default reading order for every non-exempt slide:

1. title
2. primary visual anchor
3. one supporting interpretation block
4. secondary evidence or labels
5. provenance or footnote detail

Title/takeaway role split is locked as follows:

- `title` owns the main header slot for every non-exempt slide
- `audience_takeaway` must never appear as a second stacked headline directly under the title
- `audience_takeaway` is rendered as a short subhead, side callout, takeaway box, or notes-only emphasis depending on `composition_family`
- if a slide family cannot place `audience_takeaway` cleanly on-slide without duplicating the title, it stays in the supporting interpretation block or speaker notes instead of becoming a competing header

Per-family default mapping:

- `title_hero`: `title` is the dominant hero line; `audience_takeaway` is an optional short subtitle
- `evidence_panel`: `title` is the insight header; `audience_takeaway` is a compact interpretation strip or side takeaway box
- `comparison_matrix`: `title` frames the comparison; `audience_takeaway` is the concluding callout, not a second header
- `process_flow`: `title` frames the process; `audience_takeaway` is a destination or implication line near the final step cluster
- `checklist_cards`: `title` frames the card set; `audience_takeaway` is a short summary chip or footer callout
- `qa_two_column`: `title` frames the topic; `audience_takeaway` is a concise answer summary above or beside the answer column
- `table_summary`: `title` frames the table; `audience_takeaway` is the adjacent takeaway box
- `text_statement`: `title` is the short framing line; `audience_takeaway` is the single emphasized statement, never a bullet list
- `closing_statement`: treated as a constrained `title_hero` variant; `title` is the close line and `audience_takeaway` is an optional single supporting line or notes-only emphasis

Deck-level narrative flow for added or materially revised slides:

```text
title / section frame
  -> why this matters
  -> evidence or process explanation
  -> comparison / tradeoff / QA resolution
  -> close or transition
```

### Locked Design Decisions

The review locks these defaults so implementation does not invent them ad hoc:

- only `agenda`, `section_divider`, `thank_you`, and tightly constrained `text_statement` slides may ship without a primary visual anchor
- `title_hero` is the only base family that may use centered dominant text; `closing_statement` inherits that behavior only because it is a constrained `title_hero` variant
- `title` and `audience_takeaway` cannot both occupy the top-of-slide headline stack
- `text_statement` is allowed only for executive takeaway, quote, definition, or short decision slides; it cannot degrade into title-plus-bullets
- `text_statement` may contain at most one short framing line, one emphasized statement, and one optional supporting line
- `closing_statement` may contain one dominant close line, one optional supporting line, and no additional body block or bullet list
- if image generation is weak or unnecessary, fallback priority is table, chart,
  screenshot, process flow, then comparison layout; never decorative filler
- provenance belongs in notes, caption rows, or compact footers, not the main body
- every non-exempt slide must expose one 3-second takeaway that survives thumbnail or PDF viewing
- every primary visual anchor must include a `relevance_rationale`

## Data Models

### Canonical artifact: `artifacts/slide-briefs/slide-XX.json`

Required fields:

- `slide_number`
- `source_slide_number`
- `action`
- `title`
- `slide_goal`
- `audience_takeaway`
- `takeaway_placement`
- `on_slide_copy`
- `speaker_script`
- `evidence_points`
- `provenance`
- `composition_family`
- `component_list`
- `primary_visual_anchor`
- `render_strategy`
- `text_only_exception`
- `qa_flags`

`primary_visual_anchor` required fields:

- `kind`
- `source`
- `asset_ref`
- `relevance_rationale`
- `fallback_order`

`render_strategy` enum:

- `preserve_only`
- `light_edit`
- `structured_rebuild`

`takeaway_placement` enum:

- `subtitle`
- `takeaway_box`
- `side_callout`
- `footer_callout`
- `notes_only`

### Derived artifact: `artifacts/visual-plan.json`

This is a machine-readable summary of the per-slide briefs, not an independent
authoring surface.

Required fields per slide:

- `slide_number`
- `composition_family`
- `component_list`
- `primary_visual_anchor`
- `secondary_support`
- `layout_regions`
- `image_prompt_path`
- `render_strategy`
- `text_only_exception`

When `composition_family = text_statement`, the slide must additionally record:

- `statement_role`: `executive_takeaway | quote | definition | decision`
- `max_text_lines`
- `statement_emphasis_style`

### Derived artifact: `artifacts/image-prompts/slide-XX.md`

This is the meta prompt artifact for `generate_new` only.

Required sections:

- `Objective`
- `Business message`
- `Subject`
- `Composition`
- `Visual hierarchy`
- `Stylistic constraints`
- `Color direction`
- `What to avoid`
- `Fallback if generation fails`

### Derived artifact: `artifacts/speaker-notes/slide-XX.md`

This is the presenter-ready script.

Required sections:

- `Opening`
- `Main explanation`
- `Evidence callouts`
- `Transition line`
- `Questions to anticipate`

### Derived artifact: `artifacts/presenter-script.md`

Deck-level stitched presenter script built from the per-slide briefs.

### Execution artifact: `artifacts/update_plan.json`

`update_plan.json` remains the control-plane contract used by the current edit
workflow, but it is produced from the slide briefs after semantic planning is
complete.

Required fields for non-`keep` actions:

- `slide_number`
- `action`
- `reason`
- `source_slide_number`
- `transcript_path`
- `render_strategy`
- `composition_family`
- `primary_visual_anchor`
- `layout_seed`
- `source_layout_anchor`
- `source_media_refs`
- `layout_strategy`
- `allowed_layout_delta`
- `image_strategy`
- `allowed_image_delta`

Additional required fields for `structured_rebuild` actions:

- `rebuild_merge_mode`: `replace_existing | insert_after`
- `structured_slide_spec_path`
- `rebuilt_slide_package_path`
- `merge_target_slide_number`

`update_plan.json` must not introduce semantic values that contradict the source
slide brief. If both artifacts contain the same semantic field, the slide brief
wins and plan generation must be corrected before execution proceeds.

## Interaction State Coverage

This workflow does not render a web UI, so state coverage is defined as what the
operator sees in artifacts, review outputs, and generated slides.

| Feature | Loading / In Progress | Empty / No Change | Error / Failure | Success | Partial / Degraded |
|--------|--------|--------|--------|--------|--------|
| Phase 0 stabilization | Visible finalize-audit repair stage. | No-op when baseline is already green. | Any preserve/refine regression blocks enrichment work. | Baseline preserve/refine tests are green. | N/A |
| Result summary | Summary file is being assembled after render/eval steps complete. | Summary explicitly says no content changes were required. | Fail-closed run writes a readable explanation plus next-step guidance and does not expose a shippable updated deck artifact. | Summary is the first artifact shown to the user and links to scan/render/eval evidence. | Summary shows a top-of-file `Warnings / Fallbacks Applied` section and a `Review First` list for rebuilt slides before the normal change summary. |
| Slide-brief generation | Visible per-slide enrichment stage. | `keep` slide brief says no new narration was required. | Brief marked `transcript_failed` with human-readable reason. | Brief contains goal, takeaway, script, family, anchor, and render strategy. | Brief exists but flags missing evidence or weak grounding. |
| Execution routing | Operator sees which slides are `light_edit` vs `structured_rebuild`. | `keep` slide is preserved with stub artifacts only. | Slide is blocked if no valid render strategy is selected. | Each non-keep slide resolves to one deterministic execution path. | Slide falls back from `light_edit` to `structured_rebuild` with a logged reason. |
| Visual-anchor selection | Artifact shows anchor selection in progress. | `text_only_exception` shown only for approved exempt slides. | Generated-image path fails closed and requires structured fallback. | Slide gets a concrete anchor with provenance and relevance rationale. | Slide keeps the best existing anchor but logs why a stronger new one was skipped. |
| Speaker notes output | Notes bundle shows generation progress slide by slide. | Minimal notes allowed for section divider or agenda. | Missing notes fail evaluation for explainer, QA, process, and evidence slides. | Notes are richer than the slide and include opening, evidence, and transition. | Notes ship with core script and explicit gap flags. |
| Final evaluation | Eval output shows which dimensions are still being scored. | Eval reports `no added slides to assess` when only preserved content remains. | Text-only added slide, irrelevant anchor, missing notes, or preserve drift cause hard fail. | Eval confirms transcript richness, anchor relevance, preservation quality, and visual completeness. | Eval passes with warnings only for explicit documented fallbacks. |

## User Journey And Emotional Arc

| Step | User Does | User Feels | Plan Must Specify |
|-----|-----|-----|-----|
| 1 | Provides an existing deck and asks for richer edits. | Skeptical that the tool will preserve the deck style. | Preservation-first default and explicit `keep` vs `light_edit` vs `structured_rebuild` reasoning. |
| 2 | Waits for the system to analyze the source deck. | Impatient but hopeful. | Visible progress and clear explanation of which slides are preserved, enriched, or rebuilt. |
| 3 | Reviews the proposed new slides or artifacts. | Looking for proof that the system understands the material. | Every changed slide gets a takeaway, evidence basis, chosen family, and anchor relevance rationale, and rebuilt slides are called out in `Review First`. |
| 4 | Inspects visuals on added slides. | Trust rises or falls immediately here. | No placeholder bullet slides; each slide needs a dominant anchor with a clear informational role. |
| 5 | Reads speaker notes before presenting. | Wants confidence and fluency, not generic filler. | Notes must be fuller than slide copy and include a transition line. |
| 6 | Exports or presents the deck. | Needs professional polish under time pressure. | Thumbnail-safe hierarchy, high-contrast text, and explicit failure for weak text-only regressions. |

## AI Slop Risk And Guardrails

Guardrails to enforce:

- do not let multiple families collapse into the same repeated two-column placeholder
- do not use generated illustration when a table, chart, screenshot, or process diagram would communicate faster
- do not center explanatory body copy outside `title_hero` and `closing_statement`
- do not let orange emphasis appear on every slide; reserve it for one focal move
- do not treat `minimal text` as permission to remove interpretation, takeaway, or notes
- require each slide family to justify why it is the right family for the content, not just the easiest family to synthesize
- treat preserved seed media as invalid if the plan cannot explain why it is still relevant to the new slide

## Design System Alignment

There is no repo-level `DESIGN.md`, so this plan is calibrated against
`.agents/skills/ppt-agent/references/ppt-agent-presentation-design-system.md`
as the feature-local source of truth.

Implementation should reuse that reference for slide families, typography,
color, text-only exceptions, image-direction rules, and anti-slop constraints
instead of restating those defaults in parallel across prompts, role docs, or
renderer helpers.

However, for edit mode the source deck remains the first visual authority.
Typography, color, background treatment, and master-slide framing should be
inherited from the source deck whenever they can be extracted reliably. The
local ppt-agent design reference is a fallback system for missing, broken, or
underspecified themes, not a forced visual override.

This plan does not attempt to define a repo-wide design system. The missing
root-level `DESIGN.md` remains a separate follow-up concern outside this
feature's implementation scope.

Alignment requirements:

- source-deck font, accent, and surface tokens win by default for inserted and rebuilt slides
- `Georgia`, `Aptos`, and the warm-surface palette apply only when the source deck does not provide a reliable theme or when the user explicitly opts into restyling
- evidence framing uses the source deck's secondary accent when available; otherwise fall back to support accent `#2E6A8E`
- urgency or active emphasis uses the source deck's primary emphasis color when available; otherwise fall back to `#FA6611`
- generated-image prompts must reflect the design-system ban on stock-photo look, glossy 3D effects, and decorative filler
- evaluation treats any slide that violates anti-slop rules as a quality miss even if the XML is technically valid

## Accessibility And Output Contexts

For this feature, "responsive" means the same slide remains legible across
projected full-screen viewing, shared laptop windows, exported PDF, and
slide-thumbnail navigation.

Required output-context rules:

- preserve the source deck's native aspect ratio for the entire edit run whenever that ratio is known
- use 16:9 as the default only for create mode or when the source deck ratio cannot be determined reliably
- every non-exempt slide must keep its main point readable in thumbnail view
- titles should remain short enough that they do not wrap into three dense lines
- body copy should stay concise enough that speaker notes, not slide text, carry detail
- provenance, footnotes, and labels must not rely on color alone to communicate meaning
- generated images, charts, and diagrams must preserve reading order and write descriptive text into the PowerPoint shape description field when that field is available
- missing descriptive metadata for generated images, charts, or diagrams is an accessibility failure, not a best-effort warning
- do not depend on motion or animation for comprehension; the slide must work as a static export

## NOT in scope

The following design choices are intentionally deferred from this plan:

- full deck restyling when the source deck has an established brand identity
- custom animation choreography beyond static-layout composition
- real-time WYSIWYG editing UI for manual drag-and-drop correction
- automatic brand-font embedding across all output environments
- speaker-coaching features beyond structured presenter notes
- large-scale rewrite of the create-mode rendering system
- a brand-new OOXML-native component renderer for edit mode
- creating a repo-level `DESIGN.md` for non-ppt-agent features

## Functional Design 0: Preserve/Finalize Stabilization

### Goal

Make the current phase-2 baseline safe before richer edit behavior is added.

### Required changes

Files to change:

- `.agents/skills/ppt-agent/scripts/lib/finalize-edit-run.js`
- `.agents/skills/ppt-agent/tests/workflow-edit-image-preservation.test.js`
- `.agents/skills/ppt-agent/package.json`

Expected content changes:

- fix preserve/refine finalize behavior so current tests pass
- keep preserve/refine audit semantics explicit before enrichment expands media behavior
- ensure phase-2 test entrypoints continue to run the preservation regression suite

Validation expectations:

- current failing preserve/refine finalize tests pass
- no new enrichment implementation starts until this gate is green

## Functional Design 1: Canonical Slide Brief Enrichment

### Goal

Turn transcript generation into a semantic authoring step with one authoritative
per-slide artifact.

### Required changes

Files to change:

- `.agents/skills/ppt-agent/scripts/lib/slide-transcript.js`
- `.agents/skills/ppt-agent/scripts/lib/deck-analysis.js`
- `.agents/skills/ppt-agent/roles/research.md`
- `.agents/skills/ppt-agent/SKILL.md`

Files to create:

- `.agents/skills/ppt-agent/scripts/lib/transcript-enrichment.js`

Expected content changes:

- stop using `title + body_lines` as the effective transcript body
- synthesize `slide_goal`, `audience_takeaway`, `speaker_script`, and `render_strategy`
- merge source notes, speaker notes, change request, and research delta into a richer brief
- emit cheap preservation stubs for `keep` slides instead of rich briefs
- keep concise on-slide copy separate from detailed narration

Validation expectations:

- every revised or added slide has a non-empty `speaker_script`
- every non-keep brief contains at least one evidence/provenance entry unless explicitly informational
- transcript completeness test fails when only title plus body lines are present

## Functional Design 2: Composition Planning And Anchor Semantics

### Goal

Make edit mode decide what kind of slide to build and why that visual anchor is valid.

### Required changes

Files to change:

- `.agents/skills/ppt-agent/scripts/lib/edit-workflow.js`
- `.agents/skills/ppt-agent/roles/design.md`
- `.agents/skills/ppt-agent/SKILL.md`

Files to create:

- `.agents/skills/ppt-agent/scripts/lib/visual-plan.js`

Expected content changes:

- require `composition_family`, `component_list`, and `primary_visual_anchor`
- require `primary_visual_anchor.relevance_rationale`
- require `render_strategy` selection for every non-keep slide
- pull slide-family defaults and text-only exception policy from
  `.agents/skills/ppt-agent/references/ppt-agent-presentation-design-system.md`
  instead of re-specifying them in edit-mode implementation files
- require each non-keep slide brief to record whether its typography, palette,
  and background treatment came from the source deck theme or from the fallback
  local design reference
- require `update_plan.json` to persist the routing heuristic that justified
  `light_edit` or `structured_rebuild`
- derive `update_plan.json` from the finalized slide briefs instead of letting the
  semantic and execution artifacts diverge
- keep `visual-plan.json` as a derived summary generated from slide briefs
- add `text_only_exception` with explicit reason for allowed text-only slides such as `thank_you` or `agenda`
- add a constrained `text_statement` family so rare text-led slides stay intentional instead of collapsing into placeholder bullets

Validation expectations:

- all `add_after` actions resolve to a non-placeholder family or a blocked plan
- evaluator fails when `add_after` yields only title and body text without approved exception and without a structured fallback path

## Functional Design 3: Reuse-First Structured Execution

### Goal

Keep low-risk seed-preserving edits in OOXML, but route complex slides through the
existing structured `pptx` renderer instead of building a second component engine.

### Required changes

Files to change:

- `.agents/skills/ppt-agent/scripts/lib/pptx-edit-ops.js`
- `.agents/skills/ppt-agent/scripts/lib/edit-handoff.js`
- `.agents/skills/ppt-agent/scripts/lib/build-pptx-from-handoff.js`
- `.agents/skills/pptx/scripts/lib/render-slide-from-spec.js`

Files to create:

- `.agents/skills/ppt-agent/scripts/lib/structured-slide-spec.js`

Expected content changes:

- keep seed duplication for preservation-safe `light_edit`
- route complex `add_after` and complex `revise` actions to `structured_rebuild`
- generate a normalized structured slide spec from the canonical slide brief
- emit a deterministic single-slide package artifact for every `structured_rebuild`
- define how that single rebuilt slide is reinserted into the existing working deck
- preserve source-deck theme identity on rebuilt slides unless the run is in
  explicit restyle mode or the source theme is unusable
- reuse existing structured families first, adding only the minimum extra family support needed for edit-mode parity
- avoid creating a new OOXML-native `component-renderers.js` stack

Validation expectations:

- newly added complex slides can render through the structured builder with at least one of table, image panel, comparison columns, process flow, or metric panel
- edit mode preserves original media when `image_strategy=preserve`
- edit mode can add new non-text components without altering untouched slides
- structured rebuild fails closed if single-slide reinsertion is not deterministic

## Functional Design 4: Image Meta Prompt Pipeline

### Goal

Replace short prompt strings with reusable image direction artifacts derived from
the canonical slide brief.

### Required changes

Files to change:

- `.agents/skills/ppt-agent/scripts/lib/design-pass.js`
- `.agents/skills/ppt-agent/scripts/lib/build-pptx-from-handoff.js`
- `.agents/skills/ppt-agent/scripts/generate-image.js`

Files to create:

- `.agents/skills/ppt-agent/scripts/lib/image-meta-prompt.js`

Expected content changes:

- create `artifacts/image-prompts/slide-XX.md` before any `generate_new` image generation
- include composition, focal point, slide role, palette, exclusions, and fallback
- derive the prompt from `slide_brief.primary_visual_anchor`
- save the meta prompt next to the generated image for auditability

Validation expectations:

- every `generate_new` decision has a saved meta prompt artifact
- image generation report links prompt file to generated asset
- evaluator flags generated images without meta prompt provenance

## Functional Design 5: Presenter-Grade Notes

### Goal

Keep slide copy concise while making the transcript usable in a real talk.

### Required changes

Files to change:

- `.agents/skills/ppt-agent/scripts/lib/slide-transcript.js`
- `.agents/skills/ppt-agent/scripts/lib/finalize-edit-run.js`

Files to create:

- `.agents/skills/ppt-agent/scripts/lib/speaker-script.js`

Expected content changes:

- output one notes artifact per non-keep slide
- output a deck-level transcript bundle at `artifacts/presenter-script.md`
- output `artifacts/edit-summary.md` as the first human-readable review artifact
- ensure Q&A, process, explainer, and evidence slides have richer spoken context than the on-slide text

Validation expectations:

- notes files are longer and more detailed than on-slide copy for explanatory slides
- generated slides in `QA`, `process`, and `evidence` families have at least one paragraph of speaker script

## Functional Design 6: Evaluation And Quality Gates

### Goal

Make visual/plain-text regressions and semantic-anchor mistakes fail explicitly.

### Required changes

Files to change:

- `.agents/skills/ppt-agent/scripts/lib/eval-presentation.js`
- `.agents/skills/ppt-agent/scripts/lib/finalize-edit-run.js`
- `.agents/skills/ppt-agent/SKILL.md`

Expected content changes:

- add deck-level checks for:
  - text-only added slides
  - missing primary visual anchor
  - irrelevant preserved primary visual anchor
  - missing speaker notes
  - missing image meta prompt for generated images
  - missing description-field metadata for generated images, charts, or diagrams
  - transcript too close to slide copy
- keep hard preservation failures separate from enrichment-quality failures
- only hard-fail text-only plans after structured fallback routing exists

Validation expectations:

- the sample enriched deck fails current target quality until the added slides have visual anchors and richer notes
- irrelevant preserved seed imagery fails review even if media technically survives

## Tests

Stub tests only. No implementation in this artifact.

### Unit tests

- `tests/slide-transcript-richness.test.js`
  - fails when transcript body mirrors `title + body_lines`
  - passes when `speaker_script` and `audience_takeaway` exist
- `tests/visual-plan.test.js`
  - fails when `add_after` lacks `composition_family`
  - fails when anchor relevance rationale is missing
  - fails when text-only slide has no exception reason
- `tests/image-meta-prompt.test.js`
  - verifies meta prompt sections and prompt-to-asset linkage
- `tests/structured-slide-spec.test.js`
  - verifies structured slide spec is derived from the canonical slide brief

### Integration tests

- `tests/workflow-edit-image-preservation.test.js`
  - regression test for Phase 0 preserve/refine finalize stability
- `tests/workflow-edit-rich-transcript.test.js`
  - edit run emits rich slide briefs and speaker notes
- `tests/workflow-edit-visual-anchor.test.js`
  - added slides are rejected if they have no visual anchor or anchor relevance rationale
- `tests/workflow-edit-structured-fallback.test.js`
  - complex edit routes to structured rebuild instead of placeholder text replacement
- `tests/workflow-edit-structured-mergeback.test.js`
  - rebuilt slide is reinserted at the correct position without changing untouched neighboring slides
- `tests/workflow-edit-sample-qa-plan.test.js`
  - regression test using `QA-Plan-Skill.pptx` as fixture

## Evals

- add a golden eval for `QA-Plan-Skill.pptx -> QA-Plan-Skill.enriched.pptx`
- scoring dimensions:
  - transcript richness
  - speaker note usefulness
  - visual anchor completeness
  - anchor relevance
  - preservation quality
  - absence of placeholder/plain-text slides

## Documentation Changes

### `.agents/skills/ppt-agent/SKILL.md`

- clarify that `minimal text` applies to on-slide copy, not transcript depth
- require canonical slide briefs for non-keep slides
- require reuse-first structured fallback instead of a parallel edit renderer
- require meta prompt artifacts for generated imagery

### `.agents/skills/ppt-agent/roles/design.md`

- expand Phase 2 output requirements to include `composition_family`, `component_list`, `primary_visual_anchor`, and `render_strategy`

### `.agents/skills/ppt-agent/roles/research.md`

- require presenter-note enrichment inputs, not just slide text grounding

### `.agents/skills/ppt-agent/references/ppt-agent-presentation-design-system.md`

- reference as the visual source of truth for both create and edit structured slide composition

## Implementation Checklist

- [ ] Fix preserve/refine finalize regressions before enrichment work starts
- [ ] Add canonical slide-brief enrichment module
- [ ] Add `render_strategy` and anchor relevance semantics
- [ ] Keep `visual-plan.json` derived from slide briefs
- [ ] Derive `update_plan.json` from finalized slide briefs
- [ ] Add meta prompt generator and image prompt artifacts
- [ ] Add speaker-notes and presenter-script artifacts
- [ ] Route complex slides to reused structured `pptx` rendering
- [ ] Add deterministic single-slide structured merge-back path
- [ ] Add eval failures for irrelevant anchors and text-only added slides
- [ ] Add sample-deck regression coverage
- [ ] Update skill docs and role contracts

## Recommendation

Implement this in three passes:

1. Phase 0 stabilization pass
   - fix current preserve/refine finalize regressions
   - keep the baseline green before enrichment expands scope
2. Semantic artifact pass
   - add canonical `slide-briefs`, derived `visual-plan`, `speaker-notes`, and meta prompt artifacts
   - add routing decisions and anchor relevance semantics
   - do not hard-fail text-only plans yet unless a valid structured fallback already exists
3. Structured fallback pass
   - route complex edits into the existing structured `pptx` builder
   - then turn on hard failure for placeholder text-only added slides

This order keeps the first pass low-risk, removes artifact ambiguity before
execution grows, and avoids building a second renderer.

## References

- `.agents/skills/ppt-agent/SKILL.md`
- `.agents/skills/ppt-agent/roles/design.md`
- `.agents/skills/ppt-agent/roles/research.md`
- `.agents/skills/ppt-agent/scripts/lib/edit-workflow.js`
- `.agents/skills/ppt-agent/scripts/lib/slide-transcript.js`
- `.agents/skills/ppt-agent/scripts/lib/pptx-edit-ops.js`
- `.agents/skills/ppt-agent/scripts/lib/edit-handoff.js`
- `.agents/skills/ppt-agent/scripts/lib/build-pptx-from-handoff.js`
- `.agents/skills/pptx/scripts/lib/render-slide-from-spec.js`
- `.agents/skills/ppt-agent/references/ppt-agent-presentation-design-system.md`
- `ppt/QA-Plan-Skill.pptx`
- `ppt/QA-Plan-Skill.enriched.pptx`

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 1 | CLEAR | mode: SELECTIVE_EXPANSION, 0 critical gaps |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | — | — |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 2 | OPEN | 11 issues, 2 critical gaps |
| Design Review | `/plan-design-review` | UI/UX gaps | 1 | CLEAR | score: 8/10 -> 10/10, 12 decisions |

**UNRESOLVED:** 0
**VERDICT:** DESIGN CLEARED — eng review required before implementation.
