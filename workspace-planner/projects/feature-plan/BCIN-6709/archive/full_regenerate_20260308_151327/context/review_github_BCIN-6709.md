# GitHub Review Findings — BCIN-6709 Test Key Points Draft

Reviewed draft: `projects/feature-plan/BCIN-6709/drafts/test_key_points_xmind_v1.md`

Evidence used only:
- `projects/feature-plan/BCIN-6709/context/qa_plan_github_BCIN-6709.md`
- `projects/feature-plan/BCIN-6709/context/qa_plan_github_traceability_BCIN-6709.md`

## Findings

1. **Missing explicit split between truncation/max-rows and non-truncation failures in the main recovery flow**
   - The GitHub evidence makes this a primary behavior split: `web-dossier` adds explicit handling for `DFC_QRYENG_RES_TRUNC`, and the context recommends separately validating **maximum-rows/truncation** vs **non-truncation** failures.
   - The draft has only one clear non-truncation check (`P1 Non-truncation failures keep distinct handling`) and does not make the **truncation/max-rows** case explicit in the corresponding P0 recovery scenarios.
   - Impact: the highest-risk changed behavior can be tested without proving the special `DFC_QRYENG_RES_TRUNC` path actually triggered.

2. **Missing explicit Library/web prompt vs reprompt action-button verification**
   - GitHub evidence says prompt and reprompt have **separate handling/wiring** in `web-dossier`, and QA should validate them independently.
   - The draft separates prompt and reprompt continuity, but the expected results stay generic (`returns to a usable state`) and do not explicitly verify the **correct action/button set** for each path.
   - Missing check: for prompt and reprompt recoverable failures, confirm the modal uses the intended recovery action rather than stale generic actioning.

3. **Missing explicit check that recoverable truncation flow removes the generic Send Email action and shows the single return action**
   - Evidence from `web-dossier` is specific: for truncation-related prompt failures, the popup action becomes a **single return action rather than email/escalation**.
   - The draft has `P1 Send Email visibility rules`, but it does not explicitly require that the recoverable truncation flow shows the **single return action**; it only says Send Email should not appear.
   - This leaves a coverage gap where Send Email is absent but the intended replacement action is still wrong.

4. **Unsupported expectation: “Cancel a prompt answer and return to the prompt”**
   - The allowed GitHub evidence supports prompt failure handling, prompt/reprompt return paths, and recoverable error action routing.
   - It does **not** establish a user-facing requirement for a normal **cancel prompt answer** flow independent of the error path.
   - This testcase should be removed or rewritten to tie directly to the evidenced error-return path.

5. **Vague/non-actionable user steps across multiple P0/P1 scenarios**
   - Several triggers are not specific enough for QA to reliably reproduce the intended GitHub-backed path:
     - `Trigger a recoverable report error after making visible edits`
     - `Trigger a recoverable prompt execution failure`
     - `Trigger the same recoverable failure during reprompt`
     - `Show an Application Error modal for a report open/execute/type failure`
     - `Show a Server Error modal for dataset or prompt-report failure`
   - GitHub evidence is more specific than the draft: it distinguishes Library/web vs Report Editor, prompt vs reprompt, and truncation/max-rows vs non-truncation.
   - These rows should name the target surface and failure class explicitly, otherwise QA cannot tell whether the changed code path was actually exercised.

6. **Unsupported expectation: “the report session is not abandoned automatically” / “same session”**
   - GitHub evidence supports preserving or recreating the report instance and returning to a recoverable state.
   - It does not cleanly prove the stronger user-observable claim that the exact **same session** is preserved, rather than a recreated usable instance.
   - The wording should be softened to a source-grounded expectation such as returning to a usable recovered report state without manual reopen.

7. **Unsupported expectation: “Previously entered visible edits are not lost only because the error occurred”**
   - GitHub evidence indicates recovery is intended to preserve more state and avoid unnecessary reset/rerender, but it does not guarantee that all visible edits are retained after every recoverable failure.
   - This expectation is too strong unless narrowed to specific observable state called out by evidence.
   - A safer expectation would focus on recovery to a usable state plus coherence of the recovered report.

8. **Wrong priority: `P0 Document view visibility during errors` appears overstated from the GitHub evidence**
   - The compare artifact mentions avoiding unnecessary document rerender in **some modeling-service error paths**.
   - That is a narrower technical-regression theme than the draft’s broad P0 claim that the document view remains visible during errors.
   - This is important, but the evidence does not support elevating it above the more direct changed behaviors (truncation handling, prompt/reprompt routing, OK return path, Data Pause Mode, undo/redo recovery). It fits better as **P1** unless other evidence upgrades it.

9. **Wrong priority: `P0 Details toggle behavior in error dialogs` is not defended as core changed behavior**
   - The GitHub evidence mentions `Show Details` in the new Report Editor message text, but there is no strong change evidence for the expand/collapse interaction itself.
   - By contrast, the evidence directly supports priority on copy, action buttons, return routing, Data Pause Mode, and undo/redo recovery.
   - This scenario is reasonable regression coverage, but from GitHub-only evidence it should be **P1/P2**, not P0.

10. **Missing explicit localization hookup coverage**
   - GitHub context recommends verifying localized string hookup for English and at least one non-English locale if available, because `productstrings` changed both Library and Report Editor strings.
   - The draft checks English copy accuracy but does not include any locale-switch/localization verification scenario.

11. **Missing explicit validation that non-recovery manipulations still reset undo/redo correctly**
   - `mojojs` evidence is not only “preserve undo/redo on recovery”; it also says reset should still happen **when appropriate** for non-recovery flows.
   - The draft covers coherence after recoverable recreation and redo after recovery, but it misses the opposite-side regression check that non-recovery manipulations still reset correctly.

12. **Missing explicit verification of safe landing destination by surface**
   - GitHub evidence distinguishes recoverable landing behavior by surface:
     - Report Editor explicitly returns to **Data Pause Mode**.
     - Library/web prompt paths use dedicated return actions for prompt vs reprompt.
   - The draft often uses generic expectations like `returns to the intended safe recovery destination` or `usable state`.
   - Those expectations are too vague for the main changed behavior and should be made surface-specific.
