# PPT Agent Unified Design Contract

> Canonical file: `.agents/skills/ppt-agent/docs/README.md`  
> Last consolidated: 2026-03-26  
> Status: Draft design artifact (do not implement until approved)  
> Consolidated sources:
> - `.agents/skills/ppt-agent/docs/PPT_AGENT_EDIT_ENRICHMENT_PLAN.md` (`ppt-agent-edit-enrichment-2026-03-26`)
> - `.agents/skills/ppt-agent/references/ppt-agent-presentation-design-system.md` (`ppt-agent-presentation-design-system-2026-03-26`)
> - `.agents/skills/ppt-agent/docs/PPT_AGENT_IMAGE_PRIORITY_AND_EDIT_PRESERVATION_FIX_PLAN.md` (`ppt-agent-image-priority-edit-preservation-2026-03-25`)

## 1) Purpose And Scope

`ppt-agent` must produce presentation-grade decks in both modes:

1. Phase 1 create: generate a new deck from prompt/materials.
2. Phase 2 edit: update an existing `.pptx` while preserving source deck identity.

This file is the single concrete contract for:

- visual design direction
- slide composition policy
- image priority and preservation behavior
- transcript and speaker-note requirements
- run artifact completeness requirements
- implementation and test gates

## 2) Non-Negotiable Product Rules

1. Edit mode must generate presentation-grade transcripts, not title/body restatements.
2. Added and materially revised slides must be layout-aware and component-aware.
3. Every non-exempt slide must declare one primary visual anchor.
4. Generated images must be driven by meta-prompt artifacts, not one-line prompts.
5. Speaker depth belongs in per-slide note artifacts, while on-slide text stays concise.
6. Evaluation must fail if added slides are text-only without an approved exception.
7. In create/edit mode, image-first policy is default for slides needing visual anchors, except navigation-only slide types.
8. Edit mode is anchor-preserving by default; silent full-deck rebuild behavior is disallowed.
9. All workflow-owned outputs must live under `.agents/skills/ppt-agent/runs/<run-id>/`.
10. Each final slide must have a grounded transcript artifact.
11. Required run evidence (logs, after-renders, evals, summaries) is mandatory for success.

## 3) Presentation Design System Contract

### 3.1 Aesthetic direction

- Direction: analytical editorial
- Mood: clear, sharp, evidence-led, slightly premium
- Core thesis: slides must feel composed around a dominant visual idea, not exported bullet text

### 3.2 Safe choices

- Preserve source deck visual identity in edit mode unless restyle is requested.
- Use restrained business colors and simple geometry.
- Prefer data panels, process flows, comparison structures, and screenshots over decorative imagery.

### 3.3 Risks worth taking

- Allow asymmetry when it clarifies a visual anchor.
- Let one strong visual/table dominate where appropriate.
- Use warm off-white and graphite surfaces instead of generic white-only slides.

### 3.4 Color tokens

- Primary surface: `#F7F1EA`
- Secondary surface: `#FFFDFC`
- Primary text: `#1E2430`
- Muted text: `#5A6472`
- Primary accent: `#FA6611`
- Support accent: `#2E6A8E`
- Success: `#2F7D57`
- Warning: `#B97912`
- Error: `#B2433F`

Usage rules:

- Warm light surface should dominate most content slides.
- Use `#FA6611` for key emphasis, not all objects.
- Use `#2E6A8E` for evidence framing and secondary structure.

### 3.5 Typography

- Display/Hero: `Georgia`
- Body/UI/Data: `Aptos` (tabular numerals for tables when available)
- Code/paths: `Consolas`

Rules:

- Keep titles short and bold.
- Keep on-slide body concise; push detail to notes.
- Avoid dense paragraphs; use cards, rows, matrices, and labeled comparisons.

### 3.6 Spacing and layout

- Base unit: 8px equivalent
- Min margins: 0.5 inches
- Major-block gaps: 0.3 to 0.5 inches
- Core principle: one dominant visual anchor per non-navigation slide

### 3.7 Preferred slide families

- `title_hero`
- `evidence_panel`
- `comparison_matrix`
- `process_flow`
- `checklist_cards`
- `qa_two_column`
- `table_summary`
- `closing_statement`

### 3.8 Visual anchor rule and text-only exceptions

Allowed primary anchors:

- source image/screenshot
- generated illustration/diagram
- structured table
- metric panel
- comparison columns
- process flow
- callout card grid

Text-only allowed by exception:

- `agenda`
- `section_divider`
- `thank_you`

If a non-exempt slide ends up as title + bullets only, it fails design review.

### 3.9 Image direction

Use generated images when:

- hero/overview needs scene-setting
- explainer needs conceptual diagram
- process slide needs analytic illustration
- evidence slide needs visual anchor and no better source asset exists

Do not use generated images when:

- navigation/index slides
- table/chart/screenshot communicates better
- image would be decorative only

Meta prompts must include:

- objective and business message
- subject and composition
- visual hierarchy and style constraints
- color direction
- explicit exclusions
- fallback path

### 3.10 Notes strategy and anti-slop

- On-slide text is for scanability.
- Notes are for delivery and transitions.
- Explainer/process/evidence/QA slides must have richer notes than slide copy.

Do not:

- mass-produce title + bullet placeholders
- repeat one placeholder layout for added slides
- use decorative visuals with no informational role
- overuse accent orange
- center body text

## 4) Workflow Architecture

```text
request intake (create or edit)
  -> initialize run under .agents/skills/ppt-agent/runs/<run-id>/
  -> source/deck evidence extraction
  -> grounding (user requirement -> deck/source -> Tavily)
  -> per-slide transcript artifacts
  -> per-slide visual/composition planning
  -> create handoff or edit handoff
  -> build/edit deck via shared pptx mechanics
  -> render before/after evidence
  -> preservation-aware + quality-aware evaluation
  -> finalize with required artifacts/logs/summaries
```

## 5) Core Policy Contracts

### 5.1 Slide visual policy fields

Required per slide:

- `visual_role`: `agenda | section_divider | hero | explainer | process | comparison | evidence | qa | appendix`
- `image_strategy`: `forbid | preserve | refine | replace | generate_new | optional`

Default mapping:

- `agenda`, `section_divider`, navigation appendix -> `forbid`
- create-mode `hero/explainer/process/comparison/evidence/qa` -> `generate_new` unless a provided asset already satisfies role
- edit-mode slide with existing media -> `preserve` by default
- edit-mode duplicated slide inherits seed image contract unless explicitly overridden

### 5.2 Edit preservation contract

Every non-new slide must include:

- `source_slide_number`
- `source_layout_anchor`
- `source_media_refs`
- `allowed_layout_delta`
- `allowed_image_delta`

Finalize must fail when required anchors are missing.

### 5.3 Image replacement approval contract

Required edit statuses:

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

Transition rules:

- replacement requested -> enter `awaiting_image_approval`
- approved -> continue to `evaluate`
- rejected -> return to `edit`
- missing decision -> remain waiting

Resume rules follow the same artifact-driven state.

### 5.4 Run-root output contract

All workflow-owned outputs must stay under:

```text
.agents/skills/ppt-agent/runs/<run-id>/
```

Canonical final decks:

- create mode: `artifacts/output.pptx`
- edit mode: `artifacts/output-updated.pptx`

Repo-level workflow outputs under `.ppt-agent-runs/...` or `ppt/...` are forbidden.

## 6) Artifact And Data Model Contract

### 6.1 Required artifact groups

- `manifest.json`
- `logs/events.jsonl`
- `logs/stage-status.json`
- `artifacts/slide_analysis.json` (edit mode)
- `artifacts/source-media-index.json` (edit mode)
- `artifacts/update_plan.md` and `artifacts/update_plan.json` (edit mode)
- `artifacts/edit_handoff.json` (when edits apply)
- `artifacts/slide-transcripts/slide-XX.md`
- `artifacts/transcript-index.json`
- `artifacts/slide-briefs/slide-XX.json`
- `artifacts/visual-plan.json`
- `artifacts/speaker-notes/slide-XX.md`
- `artifacts/image-prompts/slide-XX.md` (for `generate_new`)
- `artifacts/comparison_evals.json` (edit mode)
- `artifacts/run_summary.md`
- `artifacts/operator-summary.json`
- `renders/before/*` and `renders/after/*` (edit mode)

A run cannot succeed if required artifacts are missing or empty.

### 6.2 Required `slide-briefs` fields

- `slide_number`
- `source_slide_number`
- `title`
- `slide_goal`
- `audience_takeaway`
- `on_slide_copy`
- `speaker_script`
- `evidence_points`
- `provenance`
- `visual_requirements`
- `table_candidate`
- `chart_candidate`
- `image_candidate`
- `qa_flags`

### 6.3 Required `visual-plan` fields

- `slide_number`
- `composition_family`
- `component_list`
- `primary_visual_anchor`
- `secondary_support`
- `layout_regions`
- `table_spec`
- `chart_spec`
- `image_prompt_path`
- `text_only_exception`

### 6.4 Required update-plan extensions

For non-keep actions:

- `visual_role`
- `image_strategy`
- `image_rationale`
- `layout_strategy`
- `allowed_layout_delta`
- `allowed_image_delta` (mandatory if source media exists)
- `transcript_path`

Additional constraints:

- `generate_new` is invalid for `agenda`
- `replace` requires `replacement_reason`
- edit-mode `replace` additionally requires preview path and user approval status

### 6.5 Preservation audit tiers

Audit labels:

- `preserved`
- `refined`
- `replaced_with_approval`
- `drifted_without_approval`

Required per changed slide:

- `source_media_ref`
- `source_media_hash`
- `final_media_ref`
- `final_media_hash`
- `derived_from_media_ref`
- `audit_tier`
- `audit_result`

Hard failures include unauthorized image loss and unsupported layout drift.

## 7) Transcript Grounding Contract

Grounding order for every slide:

1. user requirement/change request
2. source deck content/notes/materials
3. Tavily background research

If grounding remains insufficient, workflow must stop with `needs_context`.  
It must not fabricate background content.

Transcript requirements per slide:

- slide number/title/body
- grounding summary
- Tavily facts used
- image policy and asset path
- provenance/source notes marker
- speaker notes
- action summary
- edit preservation summary (edit mode)

`transcript-index.json` is the machine-readable source of truth; per-slide markdown is human-readable rendering.

Performance rule:

- use one cached deck-level Tavily pass by default
- only use slide-specific follow-up search for explicit unresolved gaps

## 8) Functional Design Breakdown

### FD1: Transcript enrichment

- Expand transcript generation from bookkeeping to authoring.
- Split concise on-slide copy from rich speaker script.
- Add evidence/provenance requirements.

Primary files:

- update: `scripts/lib/slide-transcript.js`, `scripts/lib/deck-analysis.js`, `roles/research.md`, `SKILL.md`
- add: `scripts/lib/transcript-enrichment.js`

### FD2: Composition planning

- Add `composition_family` + `component_list` as required planning outputs.
- Enforce `text_only_exception` on allowed text-only slides.

Primary files:

- update: `scripts/lib/edit-workflow.js`, `roles/design.md`, `SKILL.md`
- add: `scripts/lib/visual-plan.js`

### FD3: Structured edit execution

- Move from text-only replacement to component-aware mutation.
- Support controlled single-slide rebuild when seed layout cannot satisfy requested composition.

Primary files:

- update: `scripts/lib/pptx-edit-ops.js`, `scripts/lib/edit-handoff.js`
- add: `scripts/lib/layout-synthesis.js`, `scripts/lib/component-renderers.js`

### FD4: Image meta-prompt pipeline

- Require `artifacts/image-prompts/slide-XX.md` before image generation.
- Link prompt artifacts to generated assets for auditability.

Primary files:

- update: `scripts/lib/design-pass.js`, `scripts/lib/build-pptx-from-handoff.js`, `scripts/generate-image.js`
- add: `scripts/lib/image-meta-prompt.js`

### FD5: Presenter-grade notes

- Generate per-slide note artifacts plus deck-level presenter script.
- Ensure explainer/process/evidence/QA families have materially richer notes than on-slide text.

Primary files:

- update: `scripts/lib/slide-transcript.js`, `scripts/lib/finalize-edit-run.js`
- add: `scripts/lib/speaker-script.js`

### FD6: Evaluation and quality gates

- Fail on text-only added slides (without exception), missing visual anchors, shallow transcripts, missing notes, missing image prompt provenance, and missing required run evidence.

Primary files:

- update: `scripts/lib/eval-presentation.js`, `scripts/lib/finalize-edit-run.js`, `SKILL.md`

## 9) Testing And Eval Contract

Stub tests (design-only list):

- `tests/slide-transcript-richness.test.js`
- `tests/visual-plan.test.js`
- `tests/image-meta-prompt.test.js`
- `tests/component-renderers.test.js`
- `tests/workflow-edit-rich-transcript.test.js`
- `tests/workflow-edit-visual-anchor.test.js`
- `tests/workflow-edit-table-or-image-upgrade.test.js`
- `tests/workflow-edit-sample-qa-plan.test.js`
- `tests/workflow-create-image-priority.test.js`
- `tests/workflow-edit-image-preservation.test.js`
- `tests/workflow-edit-run-artifacts.test.js`

Existing coverage to update:

- `tests/workflow-edit-style-preservation.test.js`
- `tests/workflow-edit-resume.test.js`
- run-manifest/finalize/create partial-success tests
- approval-flow regression coverage (`awaiting_image_approval` and resume transitions)

Eval dimensions:

- transcript richness
- speaker-note usefulness
- visual-anchor completeness
- preservation quality (image retention + layout drift)
- evidence completeness

Hard failures:

- missing `renders/after`
- missing `comparison_evals.json`
- missing per-slide transcripts
- transcript generated without sufficient grounding and without `needs_context`
- unauthorized source-image loss
- output path outside run root

## 10) Implementation Plan

Recommended two-pass order:

1. Transcript + planning pass:
   - add `slide-briefs`, `speaker-notes`, `visual-plan`, `image-prompts`
   - keep renderer mostly stable
   - start failing text-only plans
2. Component render pass:
   - implement table/card/process/image-region rendering into duplicated seed slides
   - enforce preservation and approval-aware media operations

Checklist:

- [ ] Lock image-policy vocabulary in docs and JSON contracts
- [ ] Enforce run-root output paths
- [ ] Persist media refs/layout anchors/notes availability in deck analysis
- [ ] Emit slide-level image/layout strategies in update plans
- [ ] Split edit handoff into text and image operations
- [ ] Add preservation audit before finalize success
- [ ] Emit per-slide transcripts plus transcript index
- [ ] Implement grounding and `needs_context` stop
- [ ] Require non-empty logs/summaries/evals/after-renders
- [ ] Add/update tests and regression fixtures

## 11) Open Questions

1. Initial `refine` scope should include:
   - preserve as-is
   - preserve with annotation/crop
   - replacement only after explicit preview + user approval
2. Tavily strategy should default to one cached deck-level search pass; allow slide-level follow-up only for explicit unresolved gaps.

## 12) References

- `.agents/skills/ppt-agent/SKILL.md`
- `.agents/skills/ppt-agent/reference.md`
- `.agents/skills/ppt-agent/roles/design.md`
- `.agents/skills/ppt-agent/roles/research.md`
- `.agents/skills/ppt-agent/scripts/lib/edit-workflow.js`
- `.agents/skills/ppt-agent/scripts/lib/slide-transcript.js`
- `.agents/skills/ppt-agent/scripts/lib/edit-handoff.js`
- `.agents/skills/ppt-agent/scripts/lib/pptx-edit-ops.js`
- `.agents/skills/ppt-agent/scripts/lib/design-pass.js`
- `.agents/skills/ppt-agent/scripts/lib/eval-presentation.js`
- `.agents/skills/pptx/SKILL.md`
- `.agents/skills/pptx/editing.md`
