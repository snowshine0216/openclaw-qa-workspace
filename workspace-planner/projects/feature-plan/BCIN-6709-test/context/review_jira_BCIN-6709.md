# Jira Domain Review — BCIN-6709 v8

**Reviewer scope:** Jira evidence only (`sub_test_cases_jira_BCIN-6709.md`, `qa_plan_atlassian_BCIN-6709.md`, and all individual Jira issue files).
**Draft reviewed:** `drafts/test_key_points_xmind_v8.md`
**Date:** 2026-03-07

---

## Coverage Gaps (items in sub_test_cases_jira not covered in v8)

### GAP-1 — "MDX or engine error does not cause unavoidable loss of authoring progress" (Jira P1)
- **Jira source:** `sub_test_cases_jira` section "MDX or engine error does not cause unavoidable loss of authoring progress - P1"; backed by `BCEN-4129` and `BCEN-4843`.
- **v8 status:** v8 covers the Cartesian-join scenario (BCIN-974) explicitly, but does NOT have a dedicated scenario for MDX or general engine-side errors. The Cartesian-join test is a specific reproduction path and does not substitute for the broader BCEN-4129/BCEN-4843 MDX error family.
- **Recommendation:** Add a P1 scenario titled "MDX or analytical-engine error does not trap the author (BCEN-4129 / BCEN-4843)" covering the engine-side failure path from those two issues.

### GAP-2 — "Error message helps the user avoid or fix the failure" (Jira P1)
- **Jira source:** `sub_test_cases_jira` section "Error message helps the user avoid or fix the failure - P1".
- **v8 status:** v8 has "Error details are shown consistently when the product is supposed to expose them (BCIN-6574) - P1" (covers intermittent omission) and "Recovery messages do not expose internal implementation details - P2" (covers internal leakage). Neither scenario validates that the error message content is actionable — i.e., that it explains the cause in understandable terms and guides the author toward corrective action (e.g., "reduce rows or revise design").
- **Recommendation:** Add a P1 scenario that checks the *guidance quality* of error messages, not just their presence or cleanliness.

### GAP-3 — "Previously applied report edits are preserved after an execution failure" — no standalone cross-path scenario (Jira P0)
- **Jira source:** `sub_test_cases_jira` section "Previously applied report edits are preserved after an execution failure - P0" — scoped broadly across failure types, not only row-limit.
- **v8 status:** Edit preservation is verified within "Continue editing after row-limit error - P0" (bullet: "Previous design changes are still present in the report") but is not tested as a standalone scenario across all primary failure types (row-limit, Cartesian-join, view-filter removal). If only the row-limit path is exercised and the others are skipped, this P0 requirement would be under-covered.
- **Recommendation:** Either add an explicit cross-path edit-preservation check, or annotate the three individual recovery scenarios to note they each validate edit preservation.

---

## Priority Issues

### PRI-1 — "View-filter removal failure does not freeze the editor" — Jira P1, v8 P0
- **v8 scenario:** "View-filter removal failure does not freeze the editor - P0"
- **Jira source:** `sub_test_cases_jira` "View-filter validation error does not freeze the report editor - P1"; backed by `BCIN-6485`.
- **Assessment:** v8 *upgraded* this to P0. This is conservative and not harmful for test coverage, but it misaligns with Jira priority signal. If test-run triage uses priority strictly, this can distort scheduling. Acceptable if the team intentionally promotes it; otherwise align back to P1 or document the reason for promotion.

### PRI-2 — "Repeated recovery cycles remain stable" — Jira P2, v8 P1
- **v8 scenario:** "Repeated recovery cycles remain stable - P1"
- **Jira source:** `sub_test_cases_jira` "Report remains editable after repeated execution failures in the same session - P2".
- **Assessment:** v8 upgraded from P2 to P1. Again not harmful, but is a priority deviation from Jira. Should be intentional or aligned.

---

## Actionability Issues

### ACT-1 — "Cancel from prompt-related recovery returns to a safe authoring state - P1" — vague expected result
- **v8 scenario:** "Cancel from prompt-related recovery returns to a safe authoring state - P1"
- **Issue:** The expected result states "The report stays available in a usable authoring state" but does not define what "usable" means: can the author re-trigger the prompt, perform other edits, or only navigate away? Jira (`BCEN-4843`, `BCIN-6709` description) calls out that previously entered prompt answers must not be lost, but the cancel path expected result does not distinguish report-still-open vs. author-can-re-prompt vs. data preserved.
- **Recommendation:** Specify the expected report state after cancel — e.g., "prompt dialog closed, report grid visible in pause mode, author can re-trigger prompt or make design changes."

### ACT-2 — "Cross-repo recovery handshake completes end to end - P0" — no concrete failure type or verification step
- **v8 scenario:** "Cross-repo recovery handshake completes end to end - P0"
- **Issue:** The scenario says "trigger a recoverable report error" and "perform a follow-up report operation" without specifying which error type or which follow-up action confirms the cross-repo contract. A tester cannot determine pass/fail without knowing what "the server/client recovery contract" looks like in observable terms.
- **Recommendation:** Tie this to a specific, already-covered failure path (e.g., row-limit or Cartesian-join) and specify the observable confirmation (e.g., a successful subsequent manipulation API call with no error, or a successful "Resume Data Retrieval" after recovery).

### ACT-3 — "Document view refreshes correctly after crashed-instance recovery - P1" — "stable and interactive" is ambiguous
- **v8 scenario:** "Document view refreshes correctly after crashed-instance recovery - P1"
- **Issue:** "The report UI is stable and interactive" does not specify what stable means. The Jira evidence (BCEN-4843, BCIN-974) expects the grid to be in pause mode (empty, no spinner) and immediately accept edits. The expected result should say "grid is in pause mode (no data rows, no loading spinner), all authoring controls are enabled."
- **Recommendation:** Replace "stable and interactive" with the explicit post-recovery UI state derived from Jira requirements.

---

## Overcoverage (v8 items not backed by Jira)

The following v8 scenarios are driven primarily by the Confluence design doc or GitHub implementation details, not by any Jira issue evidence in the Jira domain evidence set. They may be valid tests, but they exceed Jira-backed requirements for this review.

| v8 Scenario | Issue |
|---|---|
| "Pause mode: normal manipulation history is preserved after crashed-instance recovery - P1" | Undo/redo history distinction by manipulation type is a Confluence design detail; no Jira issue specifies undo preservation in pause mode |
| "Running mode: modeling-service manipulation clears undo and redo after recovery - P1" | Same — undo/redo reset policy per manipulation class is Confluence-only |
| "Running mode: normal manipulation preserves undo and redo after recovery - P1" | Same |
| "Running mode: user can undo a crashed manipulation after recovery - P1" | Same |
| "Modeling-service request failure does NOT recreate the document instance - P1" | No Jira issue calls out `reCreateInstance` suppression for non-crashed modeling-service failures as a user-facing requirement |
| "Cross-repo recovery handshake completes end to end - P0" | No Jira issue frames this as a standalone cross-repo contract test; this is an implementation verification |
| "AUTO: Unit / Integration Coverage - P0" (full section) | Automation-only subtasks (e.g., `recreate-report-error.ts`, `isReCreateReportInstance` flag, `RWManipulationBuilder.java`) are code-level implementation artifacts, not Jira user-facing requirements |
| "Updated Library and editor recovery strings appear correctly (productstrings PRs) - P2" | Tied to specific GitHub PRs (`productstrings/pull/15008`, `15012`), not to any Jira acceptance criterion |
| "Workstation parity expectations from BCIN-6706 - P2" | `BCIN-6706` is about Workstation parity and is Jira-linked, but the expected result ("document any gap") is not a testable acceptance criterion from Jira — it is an exploratory documentation task. This is borderline but closer to gap-documentation than a pass/fail test case. |

> **Note:** Overcoverage items are not errors — they likely belong in the overall test plan. The concern is that they are mixed into the Jira-priority hierarchy (some at P1/P0), which may over-inflate the coverage signal against Jira requirements.

---

## Verdict: NEEDS_FIXES

**Blocking gaps (must fix before sign-off):**
- GAP-1: Missing MDX/engine-error scenario (Jira P1, BCEN-4129/BCEN-4843 backed)
- GAP-2: Missing actionable-message-content scenario (Jira P1)
- ACT-2: "Cross-repo handshake" scenario is not actionable — no verifiable pass/fail criteria

**Non-blocking but recommended:**
- GAP-3: Annotate or add standalone edit-preservation cross-path check (Jira P0 completeness)
- PRI-1, PRI-2: Document intentional priority promotions for view-filter and repeated-recovery scenarios
- ACT-1, ACT-3: Tighten expected results for prompt-cancel and document-view scenarios

**Overcoverage note:** The AUTO section and several undo/redo scenarios are implementation-verification tests, not Jira user requirements. These are fine to keep but should be labeled clearly (e.g., as "impl-verification" or moved to a separate section) so they do not inflate Jira coverage metrics.
