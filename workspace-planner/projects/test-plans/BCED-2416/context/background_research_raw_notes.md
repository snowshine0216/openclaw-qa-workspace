# BCED-2416 — Background Research Raw Notes

Saved: 2026-03-10
Research mode: approved local/background research only (no browser, no web search)

## Scope used for this note
Focused on:
1. Workstation report-editor functionality
2. gaps between Library and Workstation for report-editor
3. areas needing special QA attention

Primary local evidence reviewed:
- `projects/feature-plan/BCED-2416/context/BCED-2416-summary.md`
- `projects/feature-plan/BCED-2416/context/research_ws_report_editor_functionality.md`
- `projects/feature-plan/BCED-2416/context/research_library_vs_ws_gap.md`
- `projects/feature-plan/BCED-2416/context/qa_plan_atlassian_BCED-2416.md`
- `projects/feature-plan/BCED-2416/context/jira_related_issues_BCED-2416.md`
- related prior parity artifact: `projects/feature-plan/BCIN-6709/...` for report-editor recovery behavior patterns

## Key architectural understanding
- Existing BCED-2416 local evidence is dashboard-centered, but it consistently documents the same parity pattern relevant to report-editor planning:
  - Workstation moves from separate native/classic editor behavior toward an embedded Library/Web editor.
  - Routing depends on server/web compatibility plus Workstation-side preference/toggle.
  - Workstation keeps some native-shell integrations even when Library authoring is embedded.
  - Old servers and some unsupported conditions fall back to the legacy editor.
- `BCED-2416-summary.md` explicitly points to a related report-authoring embedding design (`BCIN-7289`) and says it uses the same architecture.

## Workstation report-editor functionality findings
Derived from the local research note `research_ws_report_editor_functionality.md`:
- Current/expected report authoring capability set includes:
  - create new report
  - edit existing report
  - drag/drop and double-click object insertion
  - rows / columns / metrics template editing
  - report filters
  - pause and resume data retrieval
  - save / save as
  - undo / redo for supported actions
  - formatting
  - prompts
  - page-by
  - SQL view in paused/execution-related flows
  - drilling
  - advanced properties / report data properties
  - transformations / consolidations / custom groups / templates / themes
- Save behavior is stateful: after save, data retrieval may pause again. This makes save/edit workflow and execution-state transitions important QA targets.
- Cancel behavior is historically uneven and is a major parity area:
  - initial execution
  - re-execution
  - prompt apply / reprompt
  - manipulation-triggered execution
  - cancel while running
  - prompt-answer preservation after cancel

## Library vs Workstation gaps most relevant to report-editor
Derived from `research_library_vs_ws_gap.md` and BCED-2416 summary:

### Gaps historically closed or intended to close by embedding/parity
- custom fonts
- export behavior (Excel/PDF and Library-style export UX)
- cancel execution coverage
- prompt cancel / reprompt return behavior
- selector/apply style parity patterns
- toolbar/icon/menu consistency
- future Library features becoming automatically available in Workstation
- reduction of XML/COM/API-driven native implementation gaps

### Gaps that are still risky or not fully closed
- performance parity with legacy editor is not guaranteed
- first open / first create latency can be much worse than old editor
- scrolling smoothness is a known weak spot
- embedded/native handoff issues around dialogs, close behavior, and auth popups
- old server fallback remains by design
- local mode remains special / likely legacy-only in some paths

### Workstation-only behavior that should not be mistaken for parity gaps
These remain desktop-specific and may still differ from Library:
- Intelligent Cube conversion
- Data Import / local file workflows / local mode
- change journal
- window switching / multi-window desktop management
- plugin architecture
- admin console functions
- scripts / automation

## Defect patterns worth carrying into report-editor planning
From `BCED-2416-summary.md` and related issues:
- DE331555 / BCED-2956 / CGWI-1000: save dialog missing template/certify controls
- DE332260: new saved object not visible without refresh
- DE331633: unsmooth scrolling
- DE332080 / BCED-2989 / BCED-2544 / BCED-2552: major first-open performance degradation and follow-up mitigation work
- DE332662 / BCED-2531 / multiple OAuth defects: embedded auth popup/context failures
- BCED-2881 / BCED-3004: duplicate or inconsistent menu entries for edit-without-data
- BCED-2893 / BCED-2912 / BCED-2932 / BCED-2947 / BCED-2971 / BCED-3136: close/cancel/session-timeout lifecycle failures
- BCED-2942: cancel during execution routed user to embedded Library home page
- BCED-2945 / BCED-3022: session timeout showed Library login page instead of proper Workstation behavior
- BCED-3149 / BCED-2880: stale or incorrect title after save / edit-without-data
- BCED-2997 / BCED-2967 / BCED-2926: link navigation can corrupt editor state or trigger wrong workflow
- BCED-2879 / BCED-3035 / BCED-2980 / BCED-2931: export behavior regressions in embedded mode
- BCED-2889 / BCED-2891 / BCED-2928 / BCED-3145: prompt/dataset/replace/cancel errors cause empty dialogs or crashes

## Report-editor-specific QA implications inferred from prior report recovery evidence
Using the prior report-editor recovery feature-plan artifacts under `projects/feature-plan/BCIN-6709/` as related domain background:
- Report editor has distinct recovery-sensitive states not shared with generic dashboard authoring, especially:
  - pause mode versus running mode
  - recoverable execution failures
  - prompt and reprompt state preservation
  - staying inside current report instead of navigating away
  - rerendering document view after recoverable errors
  - undo/redo state reset versus preservation depending on manipulation type
- This makes parity planning for report-editor broader than simple UI parity; it must include state-machine parity.

## Areas needing special QA attention

### 1) Parity / fallback matrix
- supported server + toggle on => embedded/new path
- unsupported server => legacy fallback
- environment switching between supported and unsupported servers
- persistence of toggle/preference and effect after restart
- no mixed menus or stale routing when switching paths

### 2) Save/edit workflow differences
- save / save as / rename / reopen
- title update after save
- new object visibility in folder without refresh
- unsaved-change prompt on close
- edit without data / pause-mode save interactions
- save dialog parity for template/certify/comment fields where applicable

### 3) ACL / privilege / auth
- read-only open
- execute-but-not-save
- save to forbidden destination
- prompt/report open with restricted objects
- embedded auth flows for OAuth / SDK / connector sources
- session timeout, relogin, and embedded page recovery behavior
- no privilege escalation relative to Library Web

### 4) Performance
- cold first open
- cold first create
- warm reopen
- scroll smoothness
- manipulation latency after first load
- prompt submit / pause-resume / export latency
- Windows vs Mac host differences

### 5) Embedded shell integration
- close button and window lifecycle
- cancel execution on close
- navigation actions should not dump user into Library home unexpectedly
- object editor / properties / comments / native dialogs
- window title sync
- menu visibility / duplicate entries / toolbar consistency

### 6) Report-editor state handling
- pause mode
- running mode
- reprompt and nested prompt
- recoverable error handling
- document-view rerender behavior
- undo/redo reset or preservation after recovery
- follow-up edit after recovery

## Normalized takeaways to feed later coverage mapping
- The biggest QA risk is not pure feature availability; it is **state consistency across embedded Library logic and Workstation-native shell behaviors**.
- For report-editor parity, the highest-value dimensions are:
  - parity vs fallback
  - save/edit workflow continuity
  - ACL/auth correctness
  - performance and responsiveness
  - prompt/pause/recovery state handling
- Prior dashboard parity defects are a strong predictor of report-editor defect classes, especially for:
  - auth popup handling
  - save dialog gaps
  - close/cancel lifecycle
  - title/menu refresh bugs
  - performance regressions
  - navigation to wrong surface after cancel/error
