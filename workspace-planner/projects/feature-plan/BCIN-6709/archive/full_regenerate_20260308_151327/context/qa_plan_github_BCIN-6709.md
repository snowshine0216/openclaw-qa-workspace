# QA Plan GitHub Context — BCIN-6709

## Scope
GitHub evidence only, limited to:
- biweb PR #33041
- web-dossier PR #22468
- mojojs PR #8873
- productstrings PR #15008
- productstrings PR #15012
- local compare artifact for `mstr-modules/react-report-editor` (`m2021...revertReport`)

## Feature intent inferred from code
This change set adds a **report error recovery path** for report execution/manipulation failures, especially when the report hits a recoverable execution problem during prompt-answer or report-editing flows. The experience is designed to:
- preserve or recreate the report instance instead of hard-failing,
- return the user to a recoverable state (not a dead-end error),
- show clearer product-specific error text,
- avoid losing undo/redo state unnecessarily.

## User-observable behavior
### 1) Error dialog behavior changes
Evidence across `web-dossier`, `productstrings`, and `react-report-editor` shows a new explicit report-execution error UX:
- Library/web error text changed to **“One or more datasets failed to load.”**
- Report Editor strings add:
  - **“Report Cannot Be Executed.”**
  - **“This report cannot be executed. See Show Details for more information. Click OK to return to Data Pause Mode.”**
- The error action model changes for report-specific failures:
  - when the failure is recognized as a report prompt-answer failure with maximum-rows suberror, the popup now routes the user back via a single OK-style action instead of showing the generic **Send Email** option.
  - separate handling exists for prompt vs reprompt return paths.

### 2) Recovery path after report manipulation/prompt failure
Evidence across `biweb`, `mojojs`, and `react-report-editor` indicates the stack now supports **recreating the report instance** during undo/recovery flows:
- `biweb` adds a new `reCreateInstance` manipulation path and emits server `<os>8` for that request.
- `mojojs` changes command-manager reset behavior so undo/redo is reset only when appropriate.
- `react-report-editor` compare artifact introduces dedicated recreate/recover components and recovery helpers, plus logic to avoid unnecessary document rerender in some modeling-service error paths.

### 3) Data Pause Mode / recoverable editing experience
The string changes and compare artifact strongly indicate a target flow where report authoring/editing errors return the user to **Data Pause Mode** rather than leaving the editor unusable. This is highly user-visible in authoring scenarios.

## Changed surfaces by repo
### biweb PR #33041
Primary backend/web-object plumbing for recovery:
- `RWManipulationBuilder`
- `RWManipulationImpl`
- `RWManipulation`

Observed behavior impact:
- undo/manipulation requests can request **recreate instance** (`reCreateInstance: true`, `stid: -1`)
- request payload now supports server OS flag **8**
- likely changes which server-side refresh/rebuild path executes after report error

### mojojs PR #8873
Runtime command-state handling:
- `RootController.js`
- `UICmdMgr.js`

Observed behavior impact:
- replaces simple `isReCreateReportInstance` flag with broader `shouldResetUndoRedo`
- command manager reset is now conditional and restored in `finally`
- likely preserves user undo/redo continuity during report recovery, while still resetting after non-recovery flows

### web-dossier PR #22468
Primary user-facing Library/web behavior:
- popup action links
- prompt action creators
- server error code mapping
- error transform logic
- unit tests

Observed behavior impact:
- identifies report prompt-answer failures more explicitly
- recognizes `DFC_QRYENG_RES_TRUNC` maximum-rows suberrors
- changes popup actions for recoverable report failures
- updates message copy to dataset-load failure text
- removes generic email/escalation action from the specific recoverable path

### productstrings PR #15008
Library string rollout:
- adds/translates **“One or more datasets failed to load.”**

### productstrings PR #15012
Report Editor string rollout:
- adds localized report-specific title/message for unrecoverable/blocked execution state
- explicitly mentions returning to **Data Pause Mode**

### react-report-editor compare artifact
Largest UI/editor-side implementation surface:
- new recreate error catcher components
- shared recover-from-error store logic
- document view, report editor, and multiple store slices updated
- utility changes for grid data and undo/redo behavior

Observed behavior impact:
- dedicated editor recovery UI/path exists, not just generic error handling
- document view rendering and shared recovery state were modified together, so this is not a text-only change
- report-definition, properties, and UI slices all changed, implying broad editor-state recovery risk

## Key regression risks for QA
### High-risk user flows
1. **Prompted report execution in authoring mode**
   - answer prompt -> server returns execution/data error -> user should see the new report-specific recovery behavior
2. **Reprompt flow**
   - same as above, but using reprompt state; action wiring is separate and should be validated independently
3. **Undo/redo after recovery**
   - report instance recreation may preserve or clear history incorrectly
4. **Data Pause Mode return path**
   - after clicking OK on the new error dialog, editor should land in the correct paused/recoverable state
5. **Maximum rows / truncation error handling**
   - special handling is gated on `DFC_QRYENG_RES_TRUNC` suberrors; similar server failures without that suberror intentionally behave differently

### Technical regression themes exposed by file changes
- incorrect mapping between server error code and popup UX
- wrong action button shown (generic email vs recovery OK)
- prompt vs reprompt routing mismatch
- report instance recreated but editor/store state not synchronized
- document view rerendering unexpectedly after recovery
- undo/redo list reset too aggressively or not reset when it should be
- localization mismatch between Library and Report Editor surfaces

## Recommended QA emphasis from GitHub evidence
- validate the feature in both **Library/web-dossier** and **React Report Editor** surfaces
- explicitly separate **prompt** and **reprompt** scenarios
- validate both **maximum-rows/truncation** and **non-truncation** report failures
- verify **button set**, **text copy**, **details panel messaging**, and **post-click landing state**
- regression-test **undo/redo**, **document rerender**, and **continued editing after recovery**
- verify localized string hookup at least for English and one non-English locale if available

## Evidence gaps / caveats
- No server PR was analyzed in this task, though referenced by the PR bodies.
- The local `react-report-editor` artifact is a compare JSON summary, not a checked-out diff review with full code context.
- PR/Jira numbering is inconsistent in places (`BCIN-6709`, `BCIN-7543`, `BCEN-4843`), but the linked design/problem space is clearly the same report error recovery stream.
