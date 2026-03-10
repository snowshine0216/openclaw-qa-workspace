# Context Index — BCED-2416

## Traceability and scope note
- Primary Jira feature: **BCED-2416 — Enhance Workstation dashboard authoring experience with Library capability parity**
- Confluence page provided by user: **BCIN-7289; Use Embedding report in Workstation Plugin**
- Interpretation used for planning: BCED-2416 is the authoritative feature key; the Confluence page is treated as upstream design evidence for the same embedded parity architecture pattern, but with a **traceability mismatch** that must remain visible in the plan assumptions.

## Source artifacts
- Jira: `context/jira_normalized_summary.md`
- Confluence: `context/confluence_normalized_summary_BCED-2416.md`
- Background research: `context/qa_gap_risk_summary.md`

## Normalized context items

### C01 — Primary user journey: create dashboard in new embedded editor
- Source: Jira
- Coverage type: E2E
- Why it matters: Core feature promise is new/create flow entering the Library-parity authoring path from Workstation.

### C02 — Edit existing dashboard directly from Workstation
- Source: Jira
- Coverage type: E2E / Functional
- Why it matters: Existing-object edit is a primary regression surface.

### C03 — Dataset-based creation entry points
- Source: Jira
- Coverage type: Functional
- Why it matters: Create-from-dataset is explicitly called out and is sensitive to context carryover.

### C04 — Save / Save As via native Workstation shell flow
- Source: Jira + Confluence
- Coverage type: Functional / Regression
- Why it matters: Hybrid native-shell + embedded-editor interaction is high-risk.

### C05 — Presentation mode ↔ authoring mode transition
- Source: Jira
- Coverage type: Functional / Regression
- Why it matters: Mode transitions often lose context or leave stale state.

### C06 — Edit without data / pause mode behavior
- Source: Jira + research
- Coverage type: Error / Recovery / Functional
- Why it matters: State continuity and recovery are central predicted risks.

### C07 — Cancel execution / close editor lifecycle
- Source: Jira + research + Confluence
- Coverage type: Error / Recovery / Regression
- Why it matters: Known defect-prone area and explicit requirement.

### C08 — Editor selection / enablement / fallback logic
- Source: Jira + Confluence
- Coverage type: Compatibility / Regression
- Why it matters: Feature toggle, version gate, and classic-vs-embedded routing determine whether users reach the right editor safely.

### C09 — Server-version compatibility
- Source: Jira + Confluence
- Coverage type: Compatibility
- Why it matters: Older server versions must fall back cleanly; supported versions must use the new path when enabled.

### C10 — Local mode legacy behavior window
- Source: Jira
- Coverage type: Compatibility / Out-of-scope-boundary
- Why it matters: Local mode behavior differs and should not be silently forced into parity assumptions.

### C11 — ACL / privilege parity with Library Web
- Source: Jira + research
- Coverage type: Security
- Why it matters: Prevents edit/save access mismatches and privilege escalation.

### C12 — OAuth / connector / external-auth flows
- Source: Jira
- Coverage type: Security / Compatibility / Regression
- Why it matters: Embedded auth handoff is a high-risk compatibility seam.

### C13 — Workstation-native dialog / window / title integration
- Source: Confluence + research
- Coverage type: Functional / Regression
- Why it matters: Save dialog, title refresh, window close, comments, and shell sync can fail across the shell-editor boundary.

### C14 — Menu / command visibility and gating differences
- Source: Jira + Confluence
- Coverage type: Functional / Regression
- Why it matters: Intentional UI differences must not break capability access.

### C15 — Error handling location differences (editor vs Library host)
- Source: Confluence
- Coverage type: Error / Recovery
- Why it matters: User-facing error and recovery outcomes may vary by failure point.

### C16 — Performance: first open, first create, warm reopen, manipulation responsiveness
- Source: Jira + research + Confluence
- Coverage type: Performance
- Why it matters: Known open-time and scroll regressions are already documented.

### C17 — Folder/object-tree/title refresh after save
- Source: Jira + research
- Coverage type: Regression
- Why it matters: Known stale-shell-state risk after save/save as.

### C18 — Cross-surface parity versus Library Web intent
- Source: Jira + research
- Coverage type: Functional / Regression
- Why it matters: Success is defined as safe parity of user intent, not identical chrome.

### C19 — Traceability mismatch between BCED-2416 and BCIN-7289 design
- Source: Confluence
- Coverage type: OutOfScope / Assumption / Blocker note
- Why it matters: Planning can proceed, but final signoff should acknowledge the design-key mismatch.

### C20 — Incomplete NFRs in design
- Source: Confluence
- Coverage type: OutOfScope / Assumption
- Why it matters: Performance/security/accessibility/telemetry details are incomplete and cannot be assumed closed.
