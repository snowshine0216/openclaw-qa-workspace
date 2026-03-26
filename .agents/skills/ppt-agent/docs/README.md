# PPT Agent Canonical Design And Implementation Contract

> Canonical owner: `.agents/skills/ppt-agent/docs/README.md`
> Last consolidated: 2026-03-26
> Consolidates:
> - `.agents/skills/ppt-agent/docs/PPT_AGENT_IMAGE_PRIORITY_AND_EDIT_PRESERVATION_FIX_PLAN.md`
> - `docs/PPT_AGENT_PHASE2_EDIT_WORKFLOW_DESIGN.md`
> - `docs/PPT_AGENT_SKILL_DESIGN.md`

## Overview

`ppt-agent` is a high-level orchestration skill for business presentations. It must:

1. Create a new deck from prompt + optional materials (Phase 1).
2. Edit an existing `.pptx` with anchored, style-preserving updates (Phase 2).

The architecture is fixed:

- `ppt-agent` owns reasoning, planning, orchestration, preservation policy, and evaluation.
- shared `pptx` skill owns unpack/edit/pack, rendering, and PPTX mechanics.

## Product Rules (Non-Negotiable)

1. Image priority first:
   - For slides that need a visual anchor, generated or selected imagery is first-class output.
   - Exceptions: agenda, section divider, TOC/navigation-only slides.
2. Edit mode is anchor-preserving:
   - Existing layout and images are preserved by default.
   - Full rebuild behavior is not allowed.
3. Run-root enforcement:
   - All outputs must be inside `.agents/skills/ppt-agent/runs/<run-id>/`.
4. Per-slide transcript requirement:
   - Every slide emits a grounded transcript markdown artifact.
5. Evidence completeness gate:
   - No success state unless required artifacts, logs, and before/after evidence exist.

## End-to-End Workflow

```text
request intake
  -> run initialization
  -> source + deck evidence extraction
  -> grounding and research
  -> per-slide transcript generation
  -> plan generation (create_plan or update_plan)
  -> handoff generation
  -> build/edit via shared pptx mechanics
  -> render + evaluation
  -> completion summary and run manifest finalization
```

## Mode Contracts

### Phase 1: Create Workflow

Input:

- prompt
- optional attachments and references

Output contract:

- newly generated deck (not template-editing)
- `manuscript.md`
- `design_plan.md`
- slide build handoff
- rendered slides
- PPTEval-style evaluation artifacts

Rules:

- Prompt-only generation is allowed only when evidence is sufficient and inspectable.
- If evidence is weak or unverifiable, stop in insufficient-brief state.
- Reference decks may influence style/structure but do not switch create mode into XML template editing.

### Phase 2: Edit Workflow

Input:

- source `.pptx`
- requested changes
- optional new materials

Output contract:

- updated deck with preserved narrative/style anchors
- deck analysis and update planning artifacts
- edit handoff and slide operation map
- before/after render sets
- comparison evaluation artifacts

Default behavior:

- selective tightening and freshness update
- not full restyling unless explicitly requested

## Slide Visual Contract

Each slide must record:

- `visual_role`: `agenda | section_divider | hero | explainer | process | comparison | evidence | qa | appendix`
- `image_strategy`: `forbid | preserve | refine | replace | generate_new | optional`

Default policy:

- `agenda`, `section_divider`, navigation appendix -> `forbid`
- create-mode content slides (`hero`, `explainer`, `process`, `comparison`, `evidence`, `qa`) -> `generate_new` unless existing provided asset already satisfies role
- edit-mode slides with existing image/media -> `preserve`
- `replace` is allowed only with explicit reason + approval flow

## Edit Preservation Contract

For every non-new slide, plan artifacts must include:

- `source_slide_number`
- `source_layout_anchor`
- `source_media_refs`
- `allowed_layout_delta`
- `allowed_image_delta`

If any required anchor is missing, finalize must fail.

## Approval State Machine (Image Replacement)

Required states:

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

Resume logic:

- request exists + decision missing -> resume at `awaiting_image_approval`
- approved -> resume at `evaluate`
- rejected -> resume at `edit`

## Artifact Contract

Minimum required under `.agents/skills/ppt-agent/runs/<run-id>/`:

- `manifest.json`
- `logs/` (non-empty for executed phases)
- `artifacts/slide_analysis.json` (edit mode)
- `artifacts/research_delta.md` (edit mode when freshness updates required)
- `artifacts/update_plan.md` and `artifacts/update_plan.json` (edit mode)
- `artifacts/edit_handoff.json` (when edits are to be applied)
- `artifacts/comparison_evals.json` (post-edit evaluation)
- `renders/before/` and `renders/after/` for edit mode
- `transcripts/slide-XX.md` for all included slides
- `summary.md`

A run cannot end in success if required artifacts are missing.

## Repository Changes Required

### Skill Docs

- Update `.agents/skills/ppt-agent/SKILL.md`:
  - both workflows, state contracts, image/preservation rules, run-root enforcement
- Update `.agents/skills/ppt-agent/reference.md`:
  - setup, artifact expectations, troubleshooting, resume semantics
- Update `.agents/skills/ppt-agent/roles/research.md`:
  - grounding policy and transcript requirements
- Update `.agents/skills/ppt-agent/roles/design.md`:
  - visual role/image strategy and preservation hierarchy

### Scripts

- Add/extend:
  - `.agents/skills/ppt-agent/scripts/edit-run.js`
  - `.agents/skills/ppt-agent/scripts/apply-edit-run.js`
  - `.agents/skills/ppt-agent/scripts/finalize-edit-run.js`
  - `.agents/skills/ppt-agent/scripts/lib/edit-workflow.js`
  - `.agents/skills/ppt-agent/scripts/lib/deck-analysis.js`
  - `.agents/skills/ppt-agent/scripts/lib/update-plan.js`
  - `.agents/skills/ppt-agent/scripts/lib/edit-handoff.js`
  - `.agents/skills/ppt-agent/scripts/lib/run-manifest.js`
  - `.agents/skills/ppt-agent/scripts/lib/finalize-edit-run.js`
  - `.agents/skills/ppt-agent/scripts/eval-presentation.js`
  - `.agents/skills/ppt-agent/scripts/caption-image.js`
  - `.agents/skills/ppt-agent/scripts/summarize-doc.js`

### Tests

- Add/maintain:
  - `.agents/skills/ppt-agent/tests/edit-run.test.js`
  - `.agents/skills/ppt-agent/tests/apply-edit-run.test.js`
  - `.agents/skills/ppt-agent/tests/finalize-edit-run.test.js`
  - `.agents/skills/ppt-agent/tests/deck-analysis.test.js`
  - `.agents/skills/ppt-agent/tests/update-plan.test.js`
  - `.agents/skills/ppt-agent/tests/workflow-edit-smoke.test.js`
  - `.agents/skills/ppt-agent/tests/workflow-edit-resume.test.js`
  - `.agents/skills/ppt-agent/tests/workflow-edit-style-preservation.test.js`
  - `.agents/skills/ppt-agent/tests/workflow-edit-compare.test.js`
  - `.agents/skills/ppt-agent/tests/caption-image.test.js`
  - `.agents/skills/ppt-agent/tests/summarize-doc.test.js`
  - `.agents/skills/ppt-agent/tests/eval-presentation.test.js`

## Validation Expectations

1. Create-mode acceptance:
   - output deck is newly generated
   - manuscript + design plan + eval artifacts exist
2. Edit-mode acceptance:
   - preservation anchors exist for all non-new slides
   - image strategy policy is present and enforced per slide
   - before/after renders and comparison eval exist
3. Approval-path acceptance:
   - replacement flow halts at `awaiting_image_approval` until decision artifact arrives
4. Resume acceptance:
   - interrupted runs resume from manifest + approval artifacts without losing state
5. Run-root acceptance:
   - no output is emitted outside `.agents/skills/ppt-agent/runs/<run-id>/`

## Implementation Checklist

- [ ] Update skill docs and role contracts
- [ ] Enforce visual role + image strategy in plan schema
- [ ] Enforce preservation anchors in edit schema
- [ ] Implement approval-request/decision state transitions
- [ ] Ensure run artifact completeness gates in finalize path
- [ ] Add/refresh tests for create, edit, approval, resume, and comparison
- [ ] Verify no duplicate active docs claim canonical ownership

## Legacy Source Notes

This README is now the canonical design contract. The three source design docs are retained as historical references until explicitly archived.
