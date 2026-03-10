# BCED-2416 Jira evidence summary

Source: Jira CLI (`jira me` validated before collection)
Feature: BCED-2416 — Enhance Workstation dashboard authoring experience with Library capability parity

## Scope selection note
BCED-2416 has no Jira `issuelinks`, but Jira hierarchy/search shows a large set of child stories/defects under the feature. For QA planning, I normalized the parent issue plus the subset of children that materially change test scope: implementation delivery tracks, test/automation tracks, feature-flag behavior, auth/OAuth compatibility, performance mitigation, and cancel/fallback behavior explicitly called out in the feature.

## Primary issue

### BCED-2416
- **Summary:** Enhance Workstation dashboard authoring experience with Library capability parity
- **Relationship:** Target feature
- **Key scope:** Replace/augment Workstation dashboard authoring with a WebView-based editor aligned to Library Web; cover create, edit, save/save as, presentation mode, dataset-based creation, local-mode behavior, and cancel execution.
- **QA impact:** Core regression surface is Workstation authoring parity with Library while preserving Workstation-native flows such as native save dialog, Help-menu enablement, context-menu entry points, and pause/edit-without-data behavior.
- **Risks:** Large mixed surface across create/open/edit/save, server-version fallback, session/auth handling, export/link behavior, and plugin/native shell interactions.
- **Parity / fallback / performance / security notes:**
  - **Parity:** Explicit goal is parity with Library Web authoring/ACL behavior.
  - **Fallback:** Pre-25.08/25.09 server connections must fall back to legacy editor; local mode legacy editor remains until retirement window.
  - **Performance:** QA summary reports 2s–4s open-time regression and larger first-time load regression in 25.09.
  - **Security:** Editing must honor privileges/ACL the same as Library Web.

## Parent hierarchy

### PRD-126
- **Summary:** Composable and Competitive Analytical Experiences with Dashboards
- **Relationship:** Parent initiative of BCED-2416
- **QA impact:** Confirms BCED-2416 is part of broader dashboard modernization/parity work, so QA should treat this feature as platform-level behavior alignment rather than an isolated UX tweak.
- **Risks:** Broader dashboard initiative context increases regression risk across dashboard authoring surfaces and releases.
- **Parity / fallback / performance / security notes:** No direct requirements captured here, but it reinforces parity and cross-surface consistency expectations.

## Material child / related issues affecting QA scope

### CGWI-1397
- **Summary:** [Parent Story] WS Dashboard Library Authoring | Workstation Native Enhancements
- **Relationship:** Related parent story under the feature
- **QA impact:** Captures Workstation-native enhancements, especially packaging dashboard-related bundles into Workstation to reduce remote fetching on initial load.
- **Risks:** Packaging/bundling changes can improve performance but also create version skew, stale asset, or first-load regressions.
- **Parity / fallback / performance / security notes:** Strong **performance** relevance; also affects parity because Workstation wraps Library-based authoring in native shell behavior.

### BCED-2470
- **Summary:** [Parent Story] Cross team evaluation
- **Relationship:** Related parent story under the feature
- **QA impact:** Signals cross-team dependencies and shared validation responsibility for this feature.
- **Risks:** Integration gaps can appear at boundaries with embedding/library/native-shell teams, especially around auth, navigation, and save flows.
- **Parity / fallback / performance / security notes:** Broad integration risk item; useful for explaining why QA must cover cross-team seams, not just editor basics.

### BCED-2497
- **Summary:** Delivery Work Item 1 | Dashboard | WS
- **Relationship:** Related delivery track
- **QA impact:** Early delivery work item with knowledge/design subtasks; indicates foundational implementation and architecture decisions feed test coverage.
- **Risks:** Foundational design mistakes can cascade into later workflow regressions.
- **Parity / fallback / performance / security notes:** No explicit requirement text beyond placeholder, but it materially supports end-to-end delivery staging.

### BCED-2505
- **Summary:** Delivery Work Item 2 ｜ Dashboard | WS
- **Relationship:** Related delivery track
- **QA impact:** Contains design and implementation subtasks; another core implementation track for the feature.
- **Risks:** Mid-stream implementation changes can affect authoring workflow completeness and release stability.
- **Parity / fallback / performance / security notes:** Supports parity rollout; no explicit security/perf wording in issue body.

### BCED-2614
- **Summary:** Delivery Work Item 4 ｜ Dashboard | WS
- **Relationship:** Related delivery track
- **QA impact:** Later delivery work item with implementation subtasks; likely where late-stage fixes/integration landed.
- **Risks:** Late delivery work tends to hide release-edge regressions and compatibility/final-polish gaps.
- **Parity / fallback / performance / security notes:** Relevant for release-readiness and regression completeness.

### BCED-2485
- **Summary:** Automation
- **Relationship:** Related automation planning story (referenced by BCED-2416 QA summary as Rally US614013)
- **QA impact:** Confirms automation was planned as a first-class deliverable for Workstation dashboard authoring.
- **Risks:** If automation scope trails functional scope, regressions in create/edit/save/fallback flows may escape.
- **Parity / fallback / performance / security notes:** Important for automation coverage expectations; does not define direct feature behavior.

### BCED-2438
- **Summary:** [Parent Story] Test ｜ Dashboard | WS
- **Relationship:** Related test parent story
- **QA impact:** Establishes a dedicated test track for the feature, under which focused E2E/component coverage was organized.
- **Risks:** Placeholder body means test intent must be reconstructed from child issues and feature QA summary, not this issue alone.
- **Parity / fallback / performance / security notes:** Important structurally, but low direct requirement density.

### QAC-2
- **Summary:** End to end test
- **Relationship:** Child of the test track / related QA evidence
- **QA impact:** Confirms explicit end-to-end coverage existed for Workstation flows.
- **Risks:** E2E scope may focus on happy-paths unless paired with feature defects and compatibility scenarios.
- **Parity / fallback / performance / security notes:** Supports E2E parity validation across create/open/edit/save flows.

### BCED-2636
- **Summary:** Component level test
- **Relationship:** Child of the test track / related QA evidence
- **QA impact:** Confirms component-level coverage existed for workstation dashboard behavior in addition to E2E.
- **Risks:** Component tests alone may miss native-shell + webview integration defects.
- **Parity / fallback / performance / security notes:** Supports functional depth, but not sufficient for fallback/session/version compatibility by itself.

### CGWI-1544
- **Summary:** [workstation] add "Enable New Dashboard Editor" under Help menu
- **Relationship:** Related implementation story
- **QA impact:** Directly affects feature enablement, default-off behavior, plugin preference exposure (`new-dashboard-editor`), and release-specific branching.
- **Risks:** Toggle persistence/state leakage, wrong default, plugin-preference mismatch, or editor selection inconsistency.
- **Parity / fallback / performance / security notes:**
  - **Fallback:** Critical fallback/control point in 25.09 where feature is disabled by default and only enabled through Help menu.
  - **Parity:** Toggle decides whether users enter the new parity editor at all.

### BCED-2531
- **Summary:** OAuth/SDK/CC sources failed on Workstation Server based dashboard mode
- **Relationship:** Related high-risk compatibility story
- **QA impact:** Shows that OAuth/SDK/Community Connector data sources are a major compatibility seam in server-based dashboard mode.
- **Risks:** External login, consent, redirect, token propagation, and connector-specific failures can block create/edit/open workflows for real datasets.
- **Parity / fallback / performance / security notes:**
  - **Security:** Auth handoff and connector login behavior are security-sensitive and permission-dependent.
  - **Parity:** Data-source behavior must match expected Library-based flows closely enough for Workstation parity claims.

### BCED-2544
- **Summary:** [WorkStation] Performance degradation to open dashboard.
- **Relationship:** Related performance story referenced by feature QA summary
- **QA impact:** Establishes dashboard open-time regression as a known scope item with measurable delta versus prior Workstation.
- **Risks:** First-open and general-open latency can degrade user acceptance even if functionality is correct.
- **Parity / fallback / performance / security notes:** Strong **performance** driver; directly supports non-functional QA coverage.

### BCED-2552
- **Summary:** [WorkStation] Improve Performance via dashboard cache
- **Relationship:** Related performance mitigation story
- **QA impact:** Indicates caching was introduced/changed to reduce performance cost.
- **Risks:** Cache correctness, stale content, cache warm/cold variance, and environment-specific performance differences.
- **Parity / fallback / performance / security notes:** Strong **performance** relevance; QA should distinguish first-load vs repeat-load behavior.

### BCED-2528
- **Summary:** Enhance pre loading for dashboard editor in WS
- **Relationship:** Related performance mitigation story
- **QA impact:** Points to preloading as another mitigation for editor startup/open latency.
- **Risks:** Preloading can affect startup cost, memory footprint, race conditions, and timing-sensitive editor initialization bugs.
- **Parity / fallback / performance / security notes:** Strong **performance** relevance; can alter timing of auth/session and editor bootstrapping scenarios.

### BCED-2981
- **Summary:** [WorkStation] Cancel execution
- **Relationship:** Related defect directly tied to a stated BCED-2416 requirement
- **QA impact:** Confirms cancel-on-load/close behavior was defect-prone and must be explicitly validated.
- **Risks:** Orphaned sessions/instances, close failures, unexpected error messages, or navigation away from editor when canceling.
- **Parity / fallback / performance / security notes:**
  - **Fallback:** Cancel behavior interacts with close/return-to-editor paths.
  - **Performance:** Often triggered during slow-loading dashboards.
  - **Security:** Indirect only; mostly workflow robustness.

## Overall QA takeaways from Jira evidence
- Highest-risk areas are **editor-selection/fallback**, **server-version compatibility**, **auth/OAuth data-source flows**, **first-load/open performance**, and **cancel/close robustness**.
- The feature is not only a UI parity project; it is a **native-shell + Library-webview integration** project, so QA should expect cross-boundary regressions.
- Jira hierarchy shows explicit **test and automation tracks**, but several delivery/test parent stories contain placeholder bodies; therefore BCED-2416 itself plus the targeted child issues carry the most actionable QA evidence.
- The feature QA summary inside BCED-2416 is itself important evidence: it documents accepted residual performance degradation, legacy-editor fallback by server version/release, and ACL parity expectations.
