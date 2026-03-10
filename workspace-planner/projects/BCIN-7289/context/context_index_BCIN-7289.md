# Context Index — BCIN-7289

## Feature Summary
- **Plain-language summary:** Embed the Library Report Editor into Workstation report authoring so Workstation can use the same modern report-authoring experience and prompt stack as Library instead of maintaining a separate legacy Workstation-native report editor.
- **Affected user type:** Analyst / report authors using Workstation to create or edit reports against server-based environments.
- **Business intent:** Reduce duplicate engineering effort, remove dependency on old Workstation prompt technology, accelerate support for new report enhancements, and align Workstation report authoring with Library behavior.

## Feature Classification
- **Classification:** `user_facing`
- **Supporting source artifact:** `context/jira_issue_BCIN-7289.md`
- **E2E requirement note:** EndToEnd is mandatory because the feature changes user-facing report creation/editing flows inside Workstation.

## Source Inventory
- `context/jira_issue_BCIN-7289.md` — source family: Jira primary — why it matters: source-of-truth feature definition and sub-story — confidence: high
- `context/jira_issue_BCED-2416_summary.md` — source family: Jira supportive precedent — why it matters: known embedding regression patterns from dashboard precedent — confidence: high
- `context/research_workstation_library_report_editor_gap.md` — source family: product docs research — why it matters: current report-editor functionality and normalized parity gaps between Library and Workstation — confidence: medium-high

## Primary User Journeys
- **Journey:** Create a new report with the new embedded editor enabled
  - **Trigger/entry:** User creates a new report from Workstation
  - **User goal:** Author a report in Workstation using the embedded Library report editor
  - **Completion signal:** Report opens in embedded editor, user modifies report, saves successfully, and saved report is visible in expected location
- **Journey:** Open and edit an existing report in Workstation
  - **Trigger/entry:** User opens an existing report from Workstation
  - **User goal:** Modify the report with the embedded editor and save changes
  - **Completion signal:** Existing report opens correctly, edits persist, and reopening shows saved changes
- **Journey:** Recover or fall back when the embedded editor is unavailable or fails
  - **Trigger/entry:** New editor preference is enabled but embedded editor initialization fails
  - **User goal:** Continue authoring without a dead-end
  - **Completion signal:** Workstation falls back to next registered editor / legacy editor or displays actionable recovery path

## Entry Points
- Create report from Workstation Reports navigation / create flow
- Open existing report from Workstation Reports navigation
- Potential create-from-template flow if applicable to target server/product level
- Preference toggle to enable the new report editor in Workstation
- Fallback editor registration sequence when multiple editors are available

## Core Capability Families
- Embedded editor launch inside Workstation shell
- Preference / feature-flag gating for new report editor
- Existing report open/edit with embedded editor
- New report create flow with embedded editor
- Native Workstation save / save-as integration
- Prompt rendering and prompt answer handling using Library stack
- Filter / view-filter authoring and report object manipulation
- Pause/resume data retrieval and execution lifecycle
- Advanced Properties / SQL / report-details equivalence where applicable
- Legacy fallback behavior when new editor cannot load

## Error / Recovery Behaviors
- **Trigger:** Embedded editor initialization failure
  - **Recovery expectation:** Workstation falls back to next registered editor or clearly reports failure
  - **Evidence:** BCIN-7603 summary in `context/jira_issue_BCIN-7289.md`
  - **Trigger status:** known
- **Trigger:** Session timeout / auth expiry while embedded editor is open
  - **Recovery expectation:** User is not stranded in a Library login/home page; close/cancel/re-auth path remains workable in Workstation
  - **Evidence:** BCED-2416 lessons
  - **Trigger status:** known from precedent
- **Trigger:** Cancel or close during report execution / prompting
  - **Recovery expectation:** Report/editor can close or cancel cleanly without crash or redirect
  - **Evidence:** BCED-2416 lessons
  - **Trigger status:** known from precedent
- **Trigger:** Native save dialog integration failure / missing metadata fields
  - **Recovery expectation:** Save flow remains functional and complete
  - **Evidence:** BCED-2416 lessons
  - **Trigger status:** known from precedent

## Known Risks / Regressions
- Dashboard embedding precedent had high regression volume across auth, save, close, export, performance, and toolbar integration
- Old Workstation prompt technology differs from Library prompt engine; prompt-heavy reports are a core migration risk
- First-load performance degradation is likely due to WebView cold start / resource download
- Application-level settings from Library may incorrectly bleed into Workstation embedded mode
- Folder refresh / title update / save metadata sync may regress after save-as or new-save actions

## Permissions / Auth / Data Constraints
- Report authoring requires authoring privileges in Workstation / server environment
- ACL and report-edit privileges must match Library behavior
- Session/auth flows inside the embedded editor must still respect Workstation shell behavior
- Data-source / OAuth-backed report scenarios may expose embedded-auth bridging issues

## Environment / Platform Constraints
- Workstation desktop client with server-based environment
- Modeling service must be enabled for report editor functionality
- Server version compatibility may determine whether embedded editor is supported or legacy fallback is required
- Local/offline mode is not the target feature scope

## Setup / Fixtures Needed
- Server environment that supports target report-editor capability
- At least one editable existing report
- Permissions matrix: editable vs non-editable user
- Prompt-heavy report fixture
- Filter/view-filter fixture report
- Report needing save-as into folder
- Session-timeout or forced-auth-expiry test setup
- Environment or injected condition to simulate embedded-editor load failure for fallback validation

## Unsupported / Deferred / Ambiguous
- Exact release gating / server version threshold for report embedding is not explicitly stated in BCIN-7289
  - **Reason:** primary Jira text is brief
  - **Proposed treatment:** preserve as assumption; verify with dev/PO if needed
- Exact report entry points beyond standard create/open are not explicitly enumerated in BCIN-7289
  - **Reason:** supportive precedent is dashboard-specific
  - **Proposed treatment:** include standard report flows and mark additional entry-point expansion as follow-up if product confirms more paths
- Scope for Freeform SQL / cube-based / template-based reports under this embedding is not explicitly confirmed
  - **Reason:** product docs show capability exists broadly, but BCIN-7289 does not enumerate supported report types
  - **Proposed treatment:** cover as compatibility/risk-based scenarios, mark unsupported paths explicitly if product excludes them

## Mandatory Coverage Candidates
- `MC-01` — Create new report with embedded editor enabled — recommended coverage type: E2E — source artifacts: BCIN-7289, report-editor research
- `MC-02` — Open/edit existing report with embedded editor enabled — recommended coverage type: E2E — source artifacts: BCIN-7289, report-editor research
- `MC-03` — Preference disabled path uses legacy editor / old behavior — recommended coverage type: Functional/Regression — source artifacts: BCIN-7603, BCED-2416 lessons
- `MC-04` — Embedded editor initialization failure falls back to next registered editor — recommended coverage type: Error/Recovery — source artifacts: BCIN-7603
- `MC-05` — Prompt-heavy report flow works in embedded editor — recommended coverage type: Functional/E2E — source artifacts: BCIN-7289 description, research gap analysis
- `MC-06` — Native Workstation save/save-as integration remains correct — recommended coverage type: Functional/Regression — source artifacts: BCED-2416 lessons
- `MC-07` — Session timeout / re-auth handling does not trap user in Library UI — recommended coverage type: Error/Recovery/Regression — source artifacts: BCED-2416 lessons
- `MC-08` — Cancel / close during execution works cleanly — recommended coverage type: Error/Recovery/Regression — source artifacts: BCED-2416 lessons
- `MC-09` — Privilege / ACL parity blocks unauthorized edits — recommended coverage type: Security/Permissions — source artifacts: research + BCED-2416 lessons
- `MC-10` — Performance cold-start and subsequent-open behavior is acceptable / observable — recommended coverage type: Performance — source artifacts: BCED-2416 lessons
- `MC-11` — Toolbar / shell integration does not show dashboard-like UI defects or settings bleed — recommended coverage type: Regression/Compatibility — source artifacts: BCED-2416 lessons
- `MC-12` — Report-specific advanced capabilities (filters, advanced properties, SQL-related surfaces where applicable) remain accessible or are explicitly out-of-scope — recommended coverage type: Compatibility/Functional — source artifacts: product-doc research

## Traceability Map
- **F-01** — `context/jira_issue_BCIN-7289.md` — Workstation report editor uses old prompt tech and requires separate effort — normalized interpretation: prompt parity is a primary migration driver — planning consequence: prioritize prompt-heavy report coverage
- **F-02** — `context/jira_issue_BCIN-7289.md` — embed Library report editor into Workstation authoring similar to dashboard precedent — normalized interpretation: shell + embedded-web authoring architecture — planning consequence: cover shell-to-editor integration seams
- **F-03** — `context/jira_issue_BCIN-7289.md` — BCIN-7603 adds preference and fallback-editor sequencing — normalized interpretation: feature-gated rollout with resilience requirement — planning consequence: include enabled/disabled/failure-fallback coverage
- **F-04** — `context/jira_issue_BCED-2416_summary.md` — dashboard precedent regressed in save, auth, close, export, performance, UI integration — normalized interpretation: report embedding likely shares same integration risks — planning consequence: harden regression section around these seams
- **F-05** — `context/research_workstation_library_report_editor_gap.md` — Library and Workstation report editors share major authoring features but differ in hosting/integration and prompt stack — normalized interpretation: parity target is high, but integration seam is risky — planning consequence: focus both on parity behaviors and Workstation shell bridging
