# RE-P5B-SHIP-GATE-001 — Phase 5b Checkpoint Enforcement (BCIN-7289)

## Benchmark intent (what Phase 5b must enforce)
This benchmark checks that the **Phase 5b shipment checkpoint gate** is explicitly applied for feature **BCIN-7289 (report-editor)** in **blind pre-defect** mode, with **blocking** priority.

The case focus that must be explicitly covered by the Phase 5b checkpoint review is:
- **Prompt lifecycle**
- **Template flow**
- **Builder loading**
- **Close or save decision safety**

The output must align to the **Phase 5b** model/contract:
- Produce (and validate) Phase 5b checkpoint artifacts:
  - `context/checkpoint_audit_<feature-id>.md`
  - `context/checkpoint_delta_<feature-id>.md`
  - `drafts/qa_plan_phase5b_r<round>.md`
- Ensure `checkpoint_delta` ends with an allowed explicit disposition:
  - `accept` / `return phase5a` / `return phase5b`
- Ensure shipment readiness checkpoints include the required checkpoint set and required sections, including `supporting_context_and_gap_readiness`.

## Evidence-based focus mapping (blind pre-defect)
Using only the provided fixture evidence for BCIN-7289:

### Feature scope signal (from BCIN-7289)
BCIN-7289 describes embedding the **Library report editor** into **Workstation report authoring**, motivated by prompt tech disparity (“old code tech” in Workstation vs Library prompt) and dev-efficiency goals.

### Concrete risk/coverage anchors from adjacent issues (defect list under BCIN-7289)
The adjacent defects explicitly enumerate the benchmark focus items:

1) **Prompt lifecycle**
- `BCIN-7730` — template + prompt + pause mode: does not prompt user
- `BCIN-7685` — cannot pass prompt answer in workstation new report editor
- `BCIN-7677` — save-as with prompt “do not prompt” still prompts
- `BCIN-7707` — save-as with prompt + discard current answer; prompt answers still kept
- `BCIN-7708` — confirm-to-close not shown when prompt editor is open
- `BCIN-7727` — prompt element loading fails after folder double click

2) **Template flow**
- `BCIN-7667` — create report by template: saving directly saves to template report rather than creating new
- `BCIN-7730` — template + prompt pause-mode prompt not shown

3) **Builder loading**
- `BCIN-7727` — report builder fails to load elements in prompt
- `BCIN-7668` — two loading icons when create/edit report
- `BCIN-7693` — session timeout leads to unknown error then infinite loading

4) **Close/save decision safety**
- `BCIN-7709` — clicking X multiple times opens multiple confirm-to-close popups
- `BCIN-7708` — confirm-to-close not shown when prompt editor is open
- `BCIN-7691` — after save-to-folder, clicking X still prompts confirm-to-save

These are exactly the “blind shipment checkpoint” focus areas and they are strongly indicated by the frozen adjacent issue set for BCIN-7289.

## Phase 5b checkpoint enforcement requirements (what the skill must output)
Per the authoritative skill snapshot (`references/review-rubric-phase5b.md` and `reference.md`), Phase 5b must:

1) Produce **checkpoint artifacts**
- `context/checkpoint_audit_BCIN-7289.md`
- `context/checkpoint_delta_BCIN-7289.md`
- `drafts/qa_plan_phase5b_r<round>.md`

2) In `checkpoint_audit_BCIN-7289.md`, include required sections:
- `## Checkpoint Summary`
  - includes an explicit `supporting_context_and_gap_readiness` row
- `## Blocking Checkpoints`
- `## Advisory Checkpoints`
- `## Release Recommendation`
  - enumerates any remaining blocking items as `[ANALOG-GATE]` when they are historical analogs still relevant

3) In `checkpoint_delta_BCIN-7289.md`, include required sections:
- `## Blocking Checkpoint Resolution`
- `## Advisory Checkpoint Resolution`
- `## Final Disposition`
  - ends with exactly one of: `accept` / `return phase5a` / `return phase5b`

4) Enforce the **checkpoint set** (must be evaluated, not implied)
- Checkpoint 1–15 plus `supporting_context_and_gap_readiness`.

5) **Explicitly cover the case focus** in the checkpoint review
To satisfy this benchmark, the checkpoint audit/delta (and any plan refactor) must explicitly address the four target areas:
- prompt lifecycle
- template flow
- builder loading
- close/save decision safety

## Benchmark evaluation (based on provided evidence only)
### Pass/Fail for checkpoint enforcement
**FAIL (blocking)** — The provided benchmark evidence does not include any Phase 5b run outputs (no checkpoint audit, checkpoint delta, or Phase 5b draft), therefore the benchmark cannot verify that:
- Phase 5b shipment checkpoints were executed,
- the checkpoint set was evaluated,
- the required Phase 5b artifacts exist with required sections,
- `checkpoint_delta` ends with an allowed disposition,
- the plan was refactored (or explicitly judged) to cover prompt lifecycle/template flow/builder loading/close-save safety.

### What *is* supported by evidence
Even though Phase 5b artifacts are missing from the evidence bundle, the fixture strongly supports that Phase 5b **must** treat the four focus areas as shipment-blocking checkpoints for this feature, because the adjacent issues list contains multiple defects in those exact domains.

## Required remediation to satisfy this benchmark
To pass RE-P5B-SHIP-GATE-001, the orchestrator/skill execution must produce Phase 5b artifacts for BCIN-7289 that:

1) Create:
- `context/checkpoint_audit_BCIN-7289.md`
- `context/checkpoint_delta_BCIN-7289.md`
- `drafts/qa_plan_phase5b_r1.md` (or next round)

2) In `checkpoint_audit_BCIN-7289.md`, explicitly document checkpoint results tied to the case focus, for example (minimum expectation):
- Prompt lifecycle coverage confirmed in the draft (prompt open/answer/pause/discard/close flows)
- Template-based creation flows validated (save behavior, template immutability)
- Builder loading resilience (prompt element loading, session timeout/infinite loading)
- Close/save safety controls (single confirm dialog, correct behavior when prompt editor open, no stale prompt answers)

3) In `checkpoint_delta_BCIN-7289.md`, end with a disposition:
- `return phase5b` if those gaps are fixable within Phase 5b refactor and require another checkpoint pass
- `return phase5a` if foundational coverage/refactor is needed before checkpointing
- `accept` only if checkpoint evidence supports readiness

4) Ensure `supporting_context_and_gap_readiness` is present in the checkpoint summary, and routes back to `phase5a` when report-editor gap coverage is not release-ready (per rubric).

---

# Short execution summary
- Phase under test: **Phase 5b** shipment checkpoint enforcement.
- Evidence indicates the benchmark’s four focus areas are highly relevant to BCIN-7289 (multiple adjacent defects match them).
- However, **no Phase 5b checkpoint artifacts were provided**, so enforcement cannot be demonstrated.
- Result: **FAIL (blocking)** due to missing required Phase 5b outputs in the evidence bundle.