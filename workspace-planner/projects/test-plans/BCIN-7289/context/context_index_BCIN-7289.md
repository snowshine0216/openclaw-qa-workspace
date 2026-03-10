# Context Index — BCIN-7289

## System-of-record scope
- Authoritative feature: **BCIN-7289 — Embed Library Report Editor into the Workstation report authoring**
- Primary design source: `context/confluence_normalized_summary_BCIN-7289_report-editor.md`
- Supporting Jira scope source: `context/jira_normalized_summary_BCIN-7289_report-editor.md`
- Supporting risk model: `context/qa_gap_risk_summary.md`
- Supporting-only analogs:
  - **BCED-2416** = embedded parity architecture lessons learned
  - **BCIN-6709** = report-state / recovery / state-machine lessons learned

## Normalized context items

### R01 — Runtime editor selection by Web version + preference
- Source: Confluence + Jira
- Coverage type: Compatibility / Regression
- Why it matters: Core gate deciding whether embedded or classic editor is used.

### R02 — Fallback to classic/next editor when embedded path is unavailable or fails
- Source: Jira
- Coverage type: Compatibility / Error / Recovery
- Why it matters: Explicit Workstation enhancement requirement and high-risk transition seam.

### R03 — Edit existing report in embedded mode
- Source: Confluence + Jira
- Coverage type: EndToEnd / Functional
- Why it matters: Primary report-authoring regression surface.

### R04 — New report from file menu / plus icon / context entry
- Source: Confluence + Jira
- Coverage type: EndToEnd / Functional
- Why it matters: Main create workflows must preserve correct route/context.

### R05 — New subset / dataset-origin / MDX-origin / cube-origin report creation
- Source: Confluence
- Coverage type: Functional / Compatibility
- Why it matters: Parameter mapping is complex and error-prone.

### R06 — Python / FFSQL route handling
- Source: Confluence
- Coverage type: Functional / Regression
- Why it matters: Specialized report-entry flows are explicitly in scope.

### R07 — Link / drill flows and same-window behavior
- Source: Confluence
- Coverage type: Functional / Regression
- Why it matters: Route conversion and context carryover are fragile.

### R08 — Save / Save As / template-related flows
- Source: Confluence + risk summary
- Coverage type: Functional / Regression
- Why it matters: Native-shell dialog integration plus embedded state continuity are major risks.

### R09 — User comments / object editor / properties / native dialog bridging
- Source: Confluence
- Coverage type: Functional / Regression
- Why it matters: Embedded editor depends on Workstation-native APIs/events for these actions.

### R10 — Close / cancel / back / home / exit-edit-mode lifecycle
- Source: Confluence + risk summary
- Coverage type: Error / Recovery / Regression
- Why it matters: High-risk boundary for unsaved changes, instance cleanup, and wrong-surface navigation.

### R11 — Prompt / reprompt / pause-mode / running-state integrity
- Source: Jira + risk summary
- Coverage type: Error / Recovery / Functional
- Why it matters: Historically fragile report-editor hotspot.

### R12 — Recoverable error handling and continue-editing behavior
- Source: Confluence + risk summary
- Coverage type: Error / Recovery
- Why it matters: Failure ownership changes across editor vs host layers.

### R13 — Title/object refresh and shell synchronization after save/navigation
- Source: Confluence + risk summary
- Coverage type: Regression / Functional
- Why it matters: Saved-state visibility and shell metadata often drift.

### R14 — Feature flag / app-setting visibility permutations
- Source: Jira
- Coverage type: Compatibility / Regression / Security
- Why it matters: Report-editor capability visibility is setting-gated in precedent issues.

### R15 — Workstation-only support boundary and unsupported-origin behavior
- Source: Confluence
- Coverage type: Compatibility / Security
- Why it matters: Embedded authoring is intentionally restricted and should fail safely elsewhere.

### R16 — ACL / privilege / session-timeout correctness
- Source: Jira + risk summary
- Coverage type: Security / Compatibility
- Why it matters: Must preserve Library-equivalent authorization and safe timeout behavior.

### R17 — Intentional UI deltas vs true regressions
- Source: Confluence + Jira
- Coverage type: Functional / Regression / UX
- Why it matters: QA must distinguish expected menu/style differences from real defects.

### R18 — Performance: cold create/open, warm reopen, scroll/manipulation responsiveness
- Source: Jira + Confluence + risk summary
- Coverage type: Performance / UX
- Why it matters: Embedding and dual-bundle loading can degrade usability.

### R19 — Multi-environment customer behavior with old and new server versions
- Source: Confluence
- Coverage type: Compatibility
- Why it matters: Same Workstation may connect to mixed-version environments.

### R20 — Visual parity checks in report editor surface
- Source: Jira
- Coverage type: Regression / UX
- Why it matters: UI/icon/section inconsistencies already exist in this surface.

### R21 — BCED-2416 dashboard embedding lessons used only as heuristics
- Source: Jira supporting analog
- Coverage type: OutOfScope / Assumption / Heuristic
- Why it matters: Useful for risk patterns but not formal report-editor scope.

### R22 — BCIN-6709 recovery/state lessons used only as heuristics
- Source: Research supporting analog
- Coverage type: OutOfScope / Assumption / Heuristic
- Why it matters: Useful for report-state risk modeling but not formal feature scope.

### R23 — Incomplete NFRs in design
- Source: Confluence
- Coverage type: OutOfScope / Assumption
- Why it matters: Performance/accessibility/telemetry/security details are not fully specified.
