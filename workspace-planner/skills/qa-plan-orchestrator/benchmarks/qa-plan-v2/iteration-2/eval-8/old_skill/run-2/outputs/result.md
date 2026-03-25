# Benchmark P5A-COVERAGE-PRESERVATION-001 — Phase 5a Checkpoint Enforcement (Advisory)

**Primary feature:** BCIN-7289  
**Feature family / knowledge pack:** report-editor  
**Primary phase under test:** Phase 5a  
**Evidence mode:** retrospective_replay  
**Priority:** advisory  
**Benchmark focus:** *Review loop does not silently drop evidence-backed nodes.*

## What Phase 5a is contractually required to do (evidence-backed)
Per the skill snapshot Phase 5a contract and rubric:

1. **Audit the real `context/` artifact set** (not just the draft).  
2. **Preserve coverage**: review/refactor rounds must be coverage-preserving or coverage-positive; **do not remove/defer/move to Out of Scope** unless **source evidence** or explicit user direction requires it.
3. Produce required Phase 5a artifacts:
   - `context/review_notes_<feature-id>.md` (must include `## Coverage Preservation Audit`)
   - `context/review_delta_<feature-id>.md` (must end with `accept` or `return phase5a`)
   - `drafts/qa_plan_phase5a_r<round>.md`
4. **Coverage Preservation Audit must enumerate each affected node** with:
   - rendered plan path
   - prior-round status
   - current-round status
   - evidence source
   - disposition (`pass` | `rewrite_required`)
   - reason
5. **Acceptance gate:** Phase 5a cannot `accept` while any coverage-preservation item remains `rewrite_required`/unresolved.

(Authoritative sources: `skill_snapshot/reference.md`, `skill_snapshot/references/review-rubric-phase5a.md`)

## Retrospective replay evidence used for this benchmark
The provided fixture shows known evidence-backed risk/coverage nodes that must not be silently dropped by the Phase 5a review loop:

- **Interaction-pair / cross-section stress + modal behavior** (explicitly cited as a Phase 5a miss):
  - *“Multiple Confirmation Dialogs”* and the missed interaction of **repeated fast actions** + **modal popups**, leading to skipped UI stress testing.  
  - Defect exemplar: **BCIN-7709** — *clicking X multiple times opens multiple “Confirm to close” popups*.

- Additional evidence-backed nodes present in the fixture (should be preserved through Phase 5a if present in the draft lineage):
  - Save-as overwrite crash **BCIN-7669** (state transition omission).
  - Session-timeout transition handling **BCIN-7693**.
  - Confirm-close not shown when prompt editor open **BCIN-7708**.
  - Prompt pause mode run transition **BCIN-7730**.
  - Observable outcomes like **single loading indicator** (BCIN-7668) and **window title correctness** (BCIN-7733).
  - i18n defects **BCIN-7720/7721/7722** (noted as a Phase 5b miss in the analysis, but still part of the overall evidence set).

(Authoritative sources: `fixture:BCIN-7289-defect-analysis-run/BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md`, `.../BCIN-7289_SELF_TEST_GAP_ANALYSIS.md`, `.../BCIN-7289_REPORT_DRAFT.md`)

## Benchmark evaluation: does the workflow contract prevent “silent dropping” in Phase 5a?
### Finding
**Pass (contract-level), advisory.**

### Why this satisfies the benchmark focus
The Phase 5a rubric/contract (as provided in the snapshot) includes explicit mechanisms that prevent silent dropping of evidence-backed nodes during the Phase 5a review loop:

- **Mandatory `## Coverage Preservation Audit` section** in `review_notes` that must enumerate affected nodes with **plan path + evidence source + disposition**. This makes a drop detectable and reportable rather than silent.
- **Coverage Preservation rule** in `reference.md`: review/refactor rounds are coverage-preserving/positive; scope shrink requires evidence or explicit user direction.
- **Acceptance gate** explicitly forbids `accept` while coverage-preservation issues remain unresolved (`rewrite_required`). This enforces a rerun (`return phase5a`) when coverage could have been dropped or weakened.

### Specific alignment to BCIN-7289’s known Phase 5a failure mode
The fixture explicitly calls out a Phase 5a miss:

- *“Multiple Confirmation Dialogs — Phase 5a”* due to cross-section interaction audit not enforcing **repeated fast actions** × **modal popups**.

Under the current Phase 5a rubric, this kind of evidence-backed interaction pair must be surfaced in:
- `## Cross-Section Interaction Audit` (required section)
- and if it existed in prior draft lineage, must be tracked in `## Coverage Preservation Audit` with a `rewrite_required` disposition rather than being removed.

So, even if a reviewer still *fails* to add the scenario, the **workflow contract** is designed to ensure it is **captured as an explicit rewrite request / preservation failure**, not silently dropped.

## Blockers / limitations of this retrospective replay
- The benchmark package does **not** include actual Phase 5a run artifacts for BCIN-7289 (no `context/review_notes_BCIN-7289.md`, `context/review_delta_BCIN-7289.md`, or `drafts/qa_plan_phase5a_r*.md`). Therefore, this benchmark can only assess **contract coverage and enforcement design**, not verify a specific run’s produced audit entries.

## Conclusion
For **P5A-COVERAGE-PRESERVATION-001**, the snapshot evidence indicates Phase 5a is explicitly designed to prevent silently dropping evidence-backed nodes via:
- required audits (including Coverage Preservation Audit), and
- an acceptance gate that blocks completion when preservation issues are unresolved.

This addresses the case focus at **Phase 5a** and is consistent with the orchestrator’s phase model.