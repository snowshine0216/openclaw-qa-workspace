# Figma Review Findings: BCIN-6709 Test Key Points Draft v1

## Scope
- **Evidence reviewed**: `projects/feature-plan/BCIN-6709/context/qa_plan_figma_BCIN-6709.md`
- **Draft reviewed**: `projects/feature-plan/BCIN-6709/drafts/test_key_points_xmind_v1.md`
- **Rule**: Findings below are limited to Figma-visible UI evidence only.

## Findings

### 1. Missing Figma-visible coverage: accessibility of the error modal
- **Missing from draft**: no test coverage for modal focus behavior or keyboard reachability.
- **Why this is source-grounded**: the Figma summary explicitly calls out:
  - focus should land inside the modal when it opens,
  - keyboard users should be able to reach **Show Details/Hide details**, **OK**, and any secondary action,
  - the default action should be visually clear.
- **Recommended addition**:
  - verify initial focus lands inside the modal,
  - verify keyboard navigation reaches toggle / OK / Send Email when present,
  - verify the primary/default action remains visually clear in both collapsed and expanded states.

### 2. Unsupported expectation: preserved edits / continue same session without reopen
- **Draft locations**:
  - `P0 Report error recovery without forced reopen`
  - `P0 Continue editing after recovery`
- **Issue**: these expectations go beyond Figma-visible evidence.
- **Why unsupported by source**: the Figma summary supports only that post-error recovery destination is important and that the user should not be dumped to an unrelated state. It does **not** show or confirm:
  - unsaved edit preservation,
  - same-session continuity,
  - no manual reopen requirement,
  - ability to continue editing after recovery.

### 3. Unsupported expectation: prompt cancel / reprompt continuity flows
- **Draft location**: `P0 Prompt-answer recovery and reprompt continuity`
- **Issue**: most of this section is not supported by the Figma evidence.
- **Why unsupported by source**: the Figma summary mentions a prompt-report max-row-limit error dialog, but it does not show or confirm:
  - canceling a prompt answer,
  - returning to a usable prompt state,
  - re-answering the prompt,
  - reprompt continuity behavior as a user flow.
- **What is supported**: prompt-report failure dialog presence, summary/detail disclosure, and recovery destination after **OK**.

### 4. Unsupported expectation: document view remains visible behind/around the popup
- **Draft location**: `P0 Document view visibility during errors`
- **Issue**: this is more specific than the Figma evidence supports.
- **Why unsupported by source**: the Figma summary supports that the error dialog appears as a blocking modal over report/document context, but does not explicitly confirm that the document view remains visible behind or around the popup, nor that it remains available after dismissal.

### 5. Unsupported expectation framed as fixed copy/destination for Data Pause Mode
- **Draft location**: `P0 Data Pause Mode recovery`
- **Issue**: this section overcommits to exact wording and destination.
- **Why unsupported by source**:
  - the Figma summary says annotation text raises concern that **OK** may return the user away from active report context, for example to **Pause Mode** or library home,
  - but it does not establish a single required destination,
  - and it does not confirm the exact message text telling the user to click OK to return to Data Pause Mode.
- **Safer Figma-grounded expectation**: verify whether **OK** closes the dialog and returns the user to the intended recovery state, without sending them to an unrelated page/state.

### 6. Unsupported expectation: undo/redo behavior after recovery
- **Draft locations**:
  - `P0 Undo/redo coherence after recoverable recreation`
  - `P2 Redo behavior after recovery`
- **Issue**: these are not supported by Figma-visible UI evidence.
- **Why unsupported by source**: the Figma summary contains no visible evidence about undo stack, redo stack, or history coherence.

### 7. Unsupported expectation: non-truncation failures and recovery-model routing
- **Draft location**: `P1 Non-truncation failures keep distinct handling`
- **Issue**: this is implementation/behavior-policy coverage not established by the visible designs.
- **Why unsupported by source**: the Figma summary shows multiple failure variants and warns against copy mismatch across failure modes, but does not show a specific product rule for truncation-only recovery routing versus unrelated failures.

### 8. Wrong priority from a Figma-only standpoint: Send Email visibility should not outrank accessibility/reachability checks
- **Draft location**: `P1 Send Email visibility rules`
- **Issue**: the draft spends priority budget on a narrow secondary-action visibility rule while omitting accessibility/reachability checks that are explicitly called out in the Figma summary.
- **Why source-grounded**: the Figma summary explicitly includes keyboard reachability and clear primary action behavior, while **Send Email** is described as appearing in one design variant only.
- **Priority suggestion**: retain Send Email checks if needed, but add modal accessibility/reachability coverage before or alongside them.

### 9. Unsupported expectation: old-vs-new copy enforcement in Library/web surface
- **Draft location**: `P1 Error copy accuracy`
- **Issue**: the first scenario asserts product-history comparison that is not established by the Figma summary.
- **Why unsupported by source**: the Figma summary captures visible variants such as:
  - "One or more datasets failed to load."
  - "One or more datasets are not loaded for this item."
  It does not establish which wording is old vs new, nor a required surface-specific replacement rule.

### 10. Unsupported expectation: pause/data-retrieval transition behavior
- **Draft location**: `P1 Pause/data-retrieval switching around recovery`
- **Issue**: this scenario is broader than the design evidence.
- **Why unsupported by source**: the Figma summary does not show a visible data-retrieval transition state or define expected switching behavior around pause/data retrieval.

### 11. Unsupported expectation: recovered report layout/settings coherence and reload flicker
- **Draft location**: `P1 Recovered report state coherence`
- **Issue**: these expectations are not supported by the Figma evidence.
- **Why unsupported by source**: the Figma summary focuses on error-state UX, details disclosure, copy accuracy, and recovery destination after dismissal. It does not provide visible evidence for:
  - preserved report settings/layout/panels,
  - coherent post-recovery report rendering,
  - repeated reload flicker / duplicate recovery screens.

### 12. Missing Figma-visible coverage: copy mismatch across shared dialog pattern
- **Draft gap**: the draft has copy checks, but it does not clearly test the specific Figma risk that a shared dialog structure may present misleading summary text for different failure causes.
- **Why this is source-grounded**: the Figma summary explicitly calls out:
  - multiple distinct failure causes using a shared dialog pattern,
  - risk of copy mismatch between actual failure cause and high-level dialog summary.
- **Recommended refinement**:
  - make one scenario explicitly validate that each failure type shows the correct title/summary for that cause, not just generally "clear" copy.

### 13. Missing Figma-visible coverage: primary action clarity in expanded details state
- **Draft gap**: the draft checks that **OK** remains visible and usable after expanding details, but does not explicitly check that the primary/default action remains visually clear.
- **Why this is source-grounded**: the Figma summary explicitly calls out that the default action should be visually clear.

### 14. Vague/non-actionable wording: "intended safe recovery destination" / "usable state"
- **Draft locations**:
  - `Click OK from a recoverable error dialog`
  - several recovery scenarios under P0/P1
- **Issue**: these expectations are too vague for execution from Figma evidence alone.
- **Why source-grounded**: the Figma summary narrows the visible concern to whether **OK** closes only the dialog and whether the user is returned to the previous safe state versus an unrelated state such as library home / pause mode. The draft repeatedly uses generic phrases like:
  - "intended safe recovery destination"
  - "usable state"
  - "recovery is recoverable rather than a dead-end failure"
- **Recommended rewrite direction**:
  - use observable outcomes such as whether the dialog closes,
  - whether the user remains in report/document context or is redirected elsewhere,
  - whether the destination matches the expected recovery state for that error variant.
