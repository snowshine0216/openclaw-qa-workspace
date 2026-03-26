# PPT Agent Phase 2 Edit Workflow Design Review

Date: 2026-03-25
Design ID: `ppt-agent-phase2-edit-workflow-2026-03-25`

## Reviewed Artifacts

- [docs/PPT_AGENT_PHASE2_EDIT_WORKFLOW_DESIGN.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/docs/PPT_AGENT_PHASE2_EDIT_WORKFLOW_DESIGN.md)

## Verdict

Status: `pass_with_advisories`

The design is concrete enough to implement. It locks the edit-run entrypoint, run-state contract, shared `pptx` boundary, structured artifacts, script inventory, and comparison-based evaluation. It also preserves the Phase 1 architecture instead of creating a separate edit subsystem.

## Findings

### A1. Skills Content spec is concrete but section-scoped rather than full-file

Severity: advisory

Evidence:

- The design includes exact replacement sections for `SKILL.md`, `reference.md`, `roles/research.md`, and `roles/design.md`, but it does not inline the full contents of those files.

Why this matters:

- The OpenClaw design rubric prefers exact full-file content for materially redesigned skills.
- This is not blocking here because the update is scoped to Phase 2 additions rather than a full package rewrite, but implementers should treat the section text as authoritative and avoid freestyle edits.

Recommended follow-up:

- When implementation starts, convert the section-scoped content specs into full-file edits in the implementation PR or an immediate prep commit.

### A2. `caption-image.js` still depends on a built-in-model execution path that is specified contractually, not mechanically

Severity: advisory

Evidence:

- The design locks the output schema and purpose of `caption-image.js`, but it intentionally leaves the exact model-invocation path abstract so the implementation can follow the repo’s current built-in-agent execution pattern.

Why this matters:

- This is the right architecture decision, but the implementation should resolve it early to avoid building the surrounding workflow around a placeholder helper again.

Recommended follow-up:

- In the implementation plan, explicitly state whether `caption-image.js` is a pure schema-normalization helper around agent-produced output or a CLI that directly invokes an approved multimodal runtime.

## Gate Summary

- Canonical template present: `pass`
- Shared-vs-local placement clear: `pass`
- Phase 1 architecture preservation: `pass`
- `pptx` reuse instead of duplicate mechanics: `pass`
- Run-state and artifacts concrete: `pass`
- Script inventory concrete: `pass`
- Test coverage specified with detailed stubs: `pass`
- Reviewer artifacts produced: `pass`

## Final Status

`pass_with_advisories`
