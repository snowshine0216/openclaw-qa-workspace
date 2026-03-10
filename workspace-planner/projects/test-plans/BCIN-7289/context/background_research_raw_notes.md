# BCIN-7289 — Background Research Raw Notes

Saved: 2026-03-10
Research mode: approved local/background research only (no browser, no web search)
Authoritative feature: **BCIN-7289 — report editor embedding/convergence for Workstation**

## Scope used for this note
Focused on:
1. Workstation report-editor functionality
2. gaps between Library and Workstation for report editor
3. report-editor-specific QA attention areas
4. lessons learned from BCED-2416 only as analogous background evidence

## Local evidence reviewed
### Direct BCIN-7289 design evidence
- `projects/test-plans/BCED-2416/context/confluence_source_notes_BCED-2416.md`
- `projects/test-plans/BCED-2416/context/confluence_normalized_summary_BCED-2416.md`
- `projects/test-plans/BCIN-7289/context/pivot_note.md`

### Prior local report-editor/domain evidence
- `projects/feature-plan/BCED-2416/context/research_ws_report_editor_functionality.md`
- `projects/feature-plan/BCED-2416/context/research_library_vs_ws_gap.md`
- `projects/test-plans/BCED-2416/context/background_research_raw_notes.md`

### Analogous lessons-learned evidence only
- `projects/test-plans/BCED-2416/context/jira_normalized_summary.md`
- `projects/test-plans/BCED-2416/context/qa_gap_risk_summary.md`
- `projects/feature-plan/BCIN-6709/context/jira_issue_BCIN-6709.md`
- `projects/feature-plan/BCIN-6709/context/design_doc_BCIN-6709_5901516841.md`
- `projects/feature-plan/BCIN-6709/context/jira_related_issues_BCIN-6709.md`
- `projects/feature-plan/BCIN-6709/context/github_diff_react-report-editor_compare_m2021_revertReport.md`

## What BCIN-7289 is trying to do
The BCIN-7289 design evidence consistently points to the same core product move:
- embed the **Library Report Authoring page** inside the Workstation plugin by iFrame/embedding architecture
- stop maintaining a separately evolving Workstation-native report editor path when conditions allow
- let Workstation inherit future Library Web report-editor improvements automatically
- preserve selected Workstation-native shell behaviors through plugin APIs instead of duplicating full editor logic

## Current / expected Workstation report-editor functionality
Combining the BCIN-7289 design with prior report-editor domain research, the expected report-authoring surface includes:
- create new report
- edit existing report
- create from template
- create cube report
- create MDX-source report
- new subset report from dataset/menu
- object insertion by drag/drop or double-click
- rows / columns / metrics template editing
- filters
- prompts / reprompt
- page-by
- formatting
- save / save as
- set as template / unset as template
- show user comments dialog
- open object editor / object properties
- convert to cube / datamart
- drill / link flows
- open report in Python / SQL editor
- pause / run / re-execute related state transitions
- close / go back / go home / exit edit mode / cancel

Important stateful nuance from prior report-editor evidence:
- report editing is not just CRUD on metadata; it has execution-state transitions (pause/running/reprompt/recovery) that change expected UI and data behavior
- save can interact with paused/running state, so save continuity must be validated together with execution state

## BCIN-7289 architecture and routing model
### Editor-selection gate
Workstation should choose between classic and embedded editor based on:
- Workstation preference for new editor
- Library/Web version compatibility
- explicit threshold noted in the design: **Web version >= 26.04**

Expected routing:
- if version >= 26.04 and preference selects new editor, load embedding script and do not mount classic React app
- otherwise remain on classic editor path

### Platform restriction
- embedding report authoring is intentionally **Workstation-only**
- design mentions `window.origin` enforcement and API errors outside allowed scope

### Native-shell integration retained by Workstation
The embedded path still depends on Workstation/plugin integration functions such as:
- `errorHandler`
- `getUserComments`
- `openObjectEditor`
- `openObjectProperties`
- `openSaveAsDialog`
- `closeWindow`
- `setWindowTitle`

### Lifecycle / service hooks explicitly called out
- `deleteDossierInstance`
- `_closeWorkstationReportAuthoring`
- `cancelLoadingAndShowErrorDialog`
- `_getAuthoringPageState`
- event: `onWorkstationDossierAuthoringClosed`

## Gaps between Library and Workstation that BCIN-7289 is trying to reduce
### Historical parity gaps the embedding approach is meant to reduce
- divergent feature rollout timing between Library and Workstation
- custom-font and component-level differences
- export behavior differences
- toolbar/icon/menu inconsistency
- prompt / cancel / reprompt behavior differences
- separate native implementation gaps caused by XML/COM/API-specific Workstation logic
- duplicated maintenance burden across Workstation and Library editors

### Gaps or differences that still remain risky even after embedding
- performance may still lag legacy/classic path, especially first open/create
- classic bundles still loading can create startup overhead
- scrolling smoothness and responsiveness remain watchpoints
- create/edit entry points may still route differently depending on context
- dialog behavior can still differ because Workstation owns some shell-native dialogs while Library owns more editor logic
- menu/category placement differs from legacy (for example Format/View structure)
- error handling differs depending on whether failure is caught in Mojo/report editor or in Library layer
- old-server fallback remains a real alternate path by design
- local mode and some desktop-only behaviors may stay outside parity scope

### Workstation-specific behaviors that should not be treated as parity failures by default
- desktop window management / multi-window behavior
- plugin-specific menu registration and visibility logic
- local file / local mode workflows
- admin-console or scripting surfaces
- any desktop shell affordance intentionally handled by plugin APIs rather than Library UI

## QA attention areas that are specific to report editor, not generic dashboard parity
### 1) Execution-state-sensitive editing
Report editor has higher state-machine risk than a simple embedded form. Validate:
- pause mode versus running mode
- re-execution after manipulations
- prompt / reprompt / nested prompt flows
- cancel during execution
- cancel during prompt answer apply
- return destination after cancel (stay in report/prompt vs navigate away)

### 2) Report recovery / continue-editing behavior
From BCIN-6709 analogous evidence, report editor defects often involve whether the user can stay in-context and continue editing after failures.
Relevant carryover lessons:
- recoverable errors should not force exit/reopen for normal editing flows
- some failures should return user to pause mode instead of leaving stale/broken document view
- prompt-answer failures should preserve previous prompt answers where intended
- recovery can require rerendering document view rather than only showing an error popup
- undo/redo expectations differ by manipulation type; some modeling-service manipulations should clear/reset history while ordinary manipulations should preserve it

### 3) Save and object-state continuity
Because Workstation still owns native save-related dialogs while Library owns more editor logic, validate:
- save / save as routing
- comments/template flows
- title refresh after save/save as
- reopen behavior after save
- object visibility / refresh after creation or save-as
- unsaved-change prompts on close after embedded edits

### 4) Window and close lifecycle
BCIN-7289 explicitly routes several Library navigation actions into closing the Workstation editor window. QA should watch:
- close button behavior
- go back / go home / exit edit mode
- whether modified state triggers confirmation correctly
- whether instance cleanup occurs after close
- whether cancellation/close leaves orphaned/stale editor instance

### 5) Embedded auth / privilege / session handling
Analogous BCED-2416 defects show embedded Workstation + Library flows are vulnerable to:
- OAuth / SDK / connector auth popup failures
- session timeout routing to wrong Library login/home page
- privilege mismatches between Library and Workstation shell actions
- blocked save destinations or read-only modes exposing wrong affordances

### 6) UI delta validation versus true bugs
The design already signals some differences may be intentional:
- Library-style components/fonts
- confirm dialog differences
- menu structure differences
- second-level placement for some items
QA should separate intentional deltas from regressions in function, discoverability, or state correctness.

## BCED-2416 lessons learned applied only as analogous evidence
BCED-2416 is dashboard-focused, not authoritative for BCIN-7289, but it provides useful defect-pattern warnings for the same embedded parity architecture:
- save dialog fields or controls can go missing in embedded mode
- newly created/saved objects may not appear until refresh
- scrolling can regress noticeably
- first-open / first-create performance can degrade substantially
- auth popups and external source flows can break in embedded desktop context
- duplicate or stale menu entries can appear when classic and embedded modes coexist
- close/cancel/session-timeout behavior can send user to wrong surface
- window title/menu state can become stale after save or edit-mode transitions
- export/link/navigation flows can corrupt state or route incorrectly

These should be reused as **risk heuristics**, not as BCIN-7289 requirements.

## BCIN-6709 lessons learned applied only as analogous report-editor evidence
BCIN-6709 is not the same feature, but it is highly relevant to report-editor state behavior:
- report-editor recovery needs explicit handling for maximum-row-limit and report-incomplete errors
- recovery may use recreate-instance logic and return to pause mode
- modeling-service manipulation errors and regular manipulations can require different undo/redo treatment
- document view can remain stale unless explicitly rerendered after recovery
- prompt and reprompt failure paths need separate expectations
- staying inside the current report context is part of the product promise, not just showing an error dialog

## Normalized takeaways for downstream planning
- The largest BCIN-7289 QA risk is **not** simple feature parity; it is whether embedded Library authoring and Workstation shell integrations keep the report in the correct state across create/edit/save/cancel/error/recovery transitions.
- The most important coverage axes appear to be:
  - editor-routing matrix (classic vs embedded)
  - create/edit entry-point parity
  - native dialog and window lifecycle integration
  - save/title/object-refresh continuity
  - auth/ACL/session correctness
  - performance and responsiveness
  - prompt/pause/recovery/undo-redo state integrity
- BCED-2416 should be treated only as analogous architecture evidence.
- BCIN-6709 should be treated only as analogous report-state/recovery evidence.
- Neither analogous source should override the direct BCIN-7289 design intent.