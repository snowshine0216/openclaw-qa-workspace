# GitHub Domain Review — BCIN-6709 v8

> Reviewer: GitHub Domain Sub-Agent
> v8 source: `drafts/test_key_points_xmind_v8.md`
> Evidence: `context/sub_test_cases_github_BCIN-6709.md`, `context/qa_plan_github_traceability_BCIN-6709.md`
> Date: 2026-03-07

---

## Coverage Gaps (items in sub_test_cases_github not in v8)

### GAP-1 · "Preserve valid report state across recovery" (P1) — no dedicated scenario

**GitHub sub test:** "Document Rerender After Recovery" → second sub-scenario:
> "Open a report with visible state such as current layout, template, or prompt-driven context → trigger recovery → Expected state that should survive recovery remains intact, and the report does not reopen in an obviously reset or inconsistent state."
Traced to: XR-05, GH-01, GH-02, GH-03.

**v8 coverage:** v8 "Document view refreshes correctly after crashed-instance recovery" (Integration, P1) tests visual grid correctness after recovery but does not explicitly test that report layout, template settings, or prompt-driven context are *preserved* (not reset). The EndToEnd scenarios mention "Previous design changes are still present" only in the row-limit path. There is no standalone P1 test validating across-the-board state preservation for all recovery paths.

**Required addition:** A P1 scenario explicitly validating that layout/template/prompt-context survives recovery across all primary error paths (row-limit, Cartesian-join, view-filter), tied to GH-01, GH-02, GH-03, XR-05.

---

### GAP-2 · "Remove outdated or irrelevant recovery actions from the error UI" (P2) — missing

**GitHub sub test:** "Prompt Recovery UI Presentation" → second sub-scenario:
> "Trigger a recovery-related error state that shows updated user actions → inspect available actions → Obsolete actions are not shown, and the remaining actions support the new recovery flow cleanly."
Traced to: XR-06, GH-10, GH-11.

**v8 coverage:** v8 "Recovery messages do not expose internal implementation details" (P2) tests that internal flag values are hidden. v8 "Updated Library and editor recovery strings appear correctly" (P2) tests string content. Neither scenario tests that *obsolete UI actions* (e.g. a legacy cancel-only button that was removed) are absent from the new error UI.

**Required addition:** A P2 scenario confirming that deprecated/obsolete actions no longer appear in the updated error/recovery UI, tied to XR-06, GH-10, GH-11.

---

### GAP-3 · "Present prompt recovery links and actions correctly" (P2) — partially missing

**GitHub sub test:** "Prompt Recovery UI Presentation" → first sub-scenario:
> "Trigger a prompt-answer failure → inspect the recovery actions presented → Use the visible recovery action to continue → Prompt recovery actions are present, usable, and aligned with the prompt recovery flow."
Traced to: XR-06, GH-08, GH-09, GH-10, GH-11.

**v8 coverage:** v8 "Cancel from prompt-related recovery returns to a safe authoring state" (Functional-Prompt, P1) covers the cancel path. v8 "Return to prompt with previous answers preserved" covers answer preservation. Neither scenario focuses on verifying that the prompt recovery *UI actions/links* (e.g. a "Return to Prompt" link in the error state) are present, correctly labeled, and clickable before any user action is taken.

**Required addition:** A P2 scenario verifying prompt-recovery UI affordances are present and functional in the error state, tied to XR-06, GH-08, GH-09, GH-11.

---

### GAP-4 · "Continue report usage after recovering from prompt-answer failure" (P0) — merged into a single scenario; risk of under-testing

**GitHub sub test:** "Prompt Error Recovery" → second sub-scenario:
> "Correct or resubmit the prompt answers → Let the report load again → The report opens successfully and remains interactive for subsequent report actions."
Traced to: XR-04, GH-08, GH-09 (P0).

**v8 coverage:** v8 "Return to prompt with previous answers preserved after prompt apply fails" ends with "The report remains available after successful resubmission." This is a final assertion bullet in a single scenario primarily focused on answer preservation. The GitHub sub test treats this as a *distinct* P0 scenario — testing the full success path of resubmission (report loads, is interactive, accepts subsequent actions) independently of answer preservation. If the combined scenario fails early, the resubmission success path is never reached.

**Recommended fix:** Split out the resubmission continuation path into its own P0 scenario, or add explicit continuation-success steps as a required branch within the existing scenario, tied to XR-04.

---

## Traceability Gaps (P0/P1 scenarios with no GH/XR trace)

### TG-1 · "Error details are shown consistently when the product is supposed to expose them (BCIN-6574)" — P1 in v8, no P0/P1 GitHub trace

**v8 section:** Error Messaging, tagged **P1**.
**GitHub evidence:** The closest traces are GH-10 (`LIBRARY/Strings.fdb`) and GH-11 (`REACT_REPORT_EDITOR/Statuses.fdb`, `Strings.fdb`), both classified **P2** in the traceability file (copy/message/label category). Scenario XR-06 also sits at P2.

The scenario originates from Jira BCIN-6574 (referenced by name), not from GitHub code evidence. No GH or XR trace ID supports a P1 classification for error-detail messaging consistency. This scenario has no GitHub P0/P1 trace backing.

---

### TG-2 · "Recovery completes within reasonable editing-time expectation" — P1 in v8, no GH/XR trace

**v8 section:** Performance, tagged **P1**.
**GitHub evidence:** The traceability file (GH-01 through GH-11, XR-01 through XR-06) contains no performance-related trace. Performance testing is entirely absent from the GitHub evidence domain. There is no GH or XR trace ID that supports this scenario at any priority.

---

### TG-3 · "Workstation parity expectations from BCIN-6706" — P2 in v8, no GH/XR trace

**v8 section:** Platform, tagged **P2**.
**GitHub evidence:** This scenario references only Jira BCIN-6706. The GitHub PRs (biweb #33041, mojojs #8873, server #10905, web-dossier #22468, productstrings #15008/#15012) contain no Workstation-specific code changes. No GH or XR trace ID covers Workstation behavior.

---

## Priority Issues

### PI-1 · "Error details are shown consistently (BCIN-6574)" — should be P2, not P1

**v8 assignment:** P1 (Error Messaging section).
**GitHub priority rule:** P1 = state consistency, re-render correctness, server/client contract robustness. P2 = copy, labels, presentation, low-risk regression.

Messaging correctness and consistency of error-detail text is copy/presentation behavior. The GitHub traceability assigns GH-10 and GH-11 (the only relevant traces) to P2. Per the priority rule, this scenario should be **P2**.

---

### PI-2 · "Recovery completes within reasonable editing-time expectation" — should not be P1

**v8 assignment:** P1 (Performance section).
**GitHub priority rule:** P1 = state consistency / re-render / robustness. Performance latency measurement does not map to any P0 or P1 definition in the GitHub priority taxonomy. Performance belongs at P2 at most, or should be flagged as outside the GitHub-evidence scope entirely.

---

### PI-3 · "Running mode: user can undo a crashed manipulation after recovery" — P1 assignment is correct, but ensure it is not conflated with P0 undo/redo scenarios

**v8 assignment:** P1 (Running Mode section).
**Note:** The GitHub traceability maps undo/redo *policy* (preserve vs. reset) to P0 (GH-04, GH-05, XR-03). v8 correctly keeps this specific undo-execution-after-recovery scenario at P1 (it tests the *action* of undoing, not the policy correctness). Assignment is acceptable but reviewers should confirm the P0 "Undo/Redo Preservation Policy" scenarios fully exercise the policy boundary before relying on this P1 scenario for undo correctness.

---

## Actionability Issues

### AI-1 · Internal flag reference in "Modeling-service request failure does NOT recreate the document instance"

**v8 step:** "No `reCreateInstance` API call is made (check Network tab — no POST with `reCreateInstance: true`)"

This step requires the tester to inspect the Network tab for an internal API flag name (`reCreateInstance: true`). While Network tab inspection is feasible for a QA engineer, the observable criterion is stated in implementation-level terms (internal flag name, POST body field). This is not a user-visible behavior.

**Recommended rewrite:** Replace with a user-observable outcome, e.g.:
> "The report remains in its current editing state — it does NOT reset to a blank pause-mode grid, and the current view is preserved without an unexpected page reload."

If Network-tab verification is required, move it to the AUTO section as an automation/API-level assertion.

---

### AI-2 · Option A/B/C sub-options in "Running mode: modeling-service manipulation clears undo and redo after recovery"

**v8 steps:** Lists three implementation-coded options with source file references in comments (`report-def-slice.ts`, `join-menu.tsx`). The comments are informative for developers but the test body itself references "confirmed from Confluence" and "confirmed from Confluence `join-menu.tsx`" inline with test steps.

These inline source-file references can confuse a QA tester into thinking the test requires code inspection. The test steps themselves (e.g. "set a low row limit", "change to Cross Join") are user-observable, but the surrounding framing mixes user actions with implementation evidence. **Minor issue** — recommend moving source-file citations to a comment block only, not inline with step phrasing.

---

## Overcoverage

### OC-1 · "Continue editing after a Cartesian-join execution error (BCIN-974)" — Jira-specific reproduction steps, not GitHub-evidenced

**v8 section:** EndToEnd, P0.
**GitHub evidence:** GH-01/XR-01 support general manipulation-failure recovery. The specific test setup ("attributes Object Category, Object Extended Type, Object Type, add Change Type as described in BCIN-974") comes entirely from Jira BCIN-974, not from any GitHub diff or PR. From a GitHub-only evidence lens, this scenario duplicates the general recovery scenario in `sub_test_cases_github` ("Report Recovery In Library Authoring") without adding GitHub-traceable coverage.

**Assessment:** Acceptable as a concrete instantiation of XR-01, but must be labeled as Jira-derived (not GitHub-evidenced) in the synthesis notes. If GitHub-only coverage is required, this scenario should be generalized or cross-referenced against Jira explicitly.

---

### OC-2 · "Workstation parity expectations from BCIN-6706" — pure Jira, no GitHub evidence

**v8 section:** Platform, P2.
**GitHub evidence:** None. No GitHub PR or diff touches Workstation-specific code paths. This scenario is fully Jira-derived (BCIN-6706). It should not appear in a GitHub-domain test plan without a GitHub evidence citation or explicit labeling as out-of-scope for GitHub domain.

---

### OC-3 · "Recovery feature does not introduce an obvious embedding-specific regression" — P3, no GitHub trace

**v8 section:** Embedding, P3.
**GitHub evidence:** None of the six GitHub PRs (biweb, mojojs, server, web-dossier, productstrings ×2) reference embedding-surface changes. No GH or XR trace exists. This is speculative regression coverage with no GitHub backing.

---

### OC-4 · "New recovery feature does not change how users enter report authoring" — P3, no GitHub trace

**v8 section:** Report Creator Dialog, P3.
**GitHub evidence:** The report-authoring entry flow is not touched in any GitHub PR diff in the evidence set. No GH or XR trace ID supports this scenario.

---

### OC-5 · "Cross-repo compatibility holds during recovery" (P2, upgrade/compatibility section) — redundant with XR-01..XR-05

**v8 section:** upgrade/compatibility, P2.
**GitHub evidence:** XR-01 through XR-05 already cover cross-repo recovery contracts at P0/P1. This P2 scenario restates XR-01..XR-05 at a lower priority without adding distinct test coverage. It is harmless but redundant from a GitHub-evidence perspective.

---

## Summary Table

| Issue ID | Category | Severity | v8 Scenario | Action Required |
|----------|----------|----------|-------------|-----------------|
| GAP-1 | Coverage Gap | High (P1 missing) | no standalone "preserve valid report state" scenario | Add P1 scenario tied to GH-01/GH-02/GH-03/XR-05 |
| GAP-2 | Coverage Gap | Medium (P2 missing) | no "remove obsolete UI actions" scenario | Add P2 scenario tied to XR-06/GH-10/GH-11 |
| GAP-3 | Coverage Gap | Medium (P2 partial) | "Cancel from prompt-related recovery" doesn't test action presence | Add/extend P2 scenario for prompt recovery link verification |
| GAP-4 | Coverage Gap | Medium (P0 risk) | resubmission success path merged into preservation scenario | Split or add explicit P0 branch for post-resubmission report interactivity |
| TG-1 | Traceability Gap | High | "Error details shown consistently (BCIN-6574)" — P1 no GH trace | Re-assign to P2; add GH-10/GH-11/XR-06 citation |
| TG-2 | Traceability Gap | Medium | "Recovery completes within reasonable time" — P1 no GH trace | Remove or re-assign to P2; note as outside GitHub domain |
| TG-3 | Traceability Gap | Low | "Workstation parity (BCIN-6706)" — no GH trace | Label as Jira-only; remove from GitHub domain or P2-clarify |
| PI-1 | Priority Issue | High | "Error details shown consistently" — P1 should be P2 | Correct to P2 per GH-10/GH-11 P2 classification |
| PI-2 | Priority Issue | Medium | "Recovery completes within reasonable time" — P1 should be P2/out-of-scope | Correct to P2 or mark out-of-scope |
| AI-1 | Actionability | High | `reCreateInstance` flag check in "modeling-service non-crash path" | Replace with user-observable criterion; move API assertion to AUTO |
| AI-2 | Actionability | Low | Source-file citations inline with user steps in running-mode undo scenarios | Move citations to comments only |
| OC-1 | Overcoverage | Low | Cartesian-join BCIN-974 specific setup | Label as Jira-derived; acceptable if XR-01 citation is added |
| OC-2 | Overcoverage | Medium | Workstation BCIN-6706 | Remove from GitHub domain or explicitly label Jira-only |
| OC-3 | Overcoverage | Low | Embedding regression (P3) | Label as speculative; no GitHub backing |
| OC-4 | Overcoverage | Low | Report Creator Dialog regression (P3) | Label as speculative; no GitHub backing |
| OC-5 | Overcoverage | Low | "Cross-repo compatibility holds" (P2) | Remove or merge with XR-01..XR-05 references |

---

## Verdict: NEEDS_FIXES

**Blocking issues (must fix before promotion):**
- GAP-1: Missing dedicated P1 scenario for "preserve valid report state across recovery" (GH-01/GH-02/GH-03/XR-05 coverage incomplete)
- TG-1 + PI-1: "Error details shown consistently (BCIN-6574)" is mis-prioritized at P1 with no GitHub trace — downgrade to P2 and cite XR-06/GH-10/GH-11
- AI-1: `reCreateInstance` network-flag assertion is implementation-level — replace with user-observable criterion

**Non-blocking (should fix):**
- GAP-2, GAP-3, GAP-4: Missing or incomplete P2/P0 prompt-recovery UI and resubmission-success scenarios
- TG-2, PI-2: Performance scenario ("Recovery completes within reasonable time") has no GitHub trace and is misclassified at P1
- OC-2: "Workstation parity" has no GitHub evidence and should be removed or explicitly labeled Jira-only

**Acceptable as-is:**
- OC-1 (Cartesian-join): Acceptable as XR-01 instantiation if Jira origin is noted
- OC-3, OC-4 (P3 scenarios): Low risk; acceptable if labeled as speculative/Jira-derived
- AI-2: Minor cosmetic issue with inline source-file citations
