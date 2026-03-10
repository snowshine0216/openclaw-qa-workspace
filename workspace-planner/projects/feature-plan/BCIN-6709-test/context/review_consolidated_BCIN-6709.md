# Review Consolidated — BCIN-6709 v8 → v9 Refactor Action List

> **Date:** 2026-03-07
> **Sources:** review_jira, review_confluence, review_github
> **Output target:** drafts/test_key_points_xmind_v9.md

---

## Blocking Fixes (must apply before promotion)

| ID | Source | Action |
|---|---|---|
| B-1 | Jira GAP-1 | ADD P1 scenario: "MDX or analytical-engine error does not trap the author (BCEN-4129 / BCEN-4843)" |
| B-2 | Jira GAP-2 | ADD P1 scenario: "Error message guides the user toward fixing the failure" |
| B-3 | Jira ACT-2 | FIX "Cross-repo recovery handshake" — tie to row-limit path, specify observable confirmation |
| B-4 | GitHub GAP-1 | ADD P1 scenario: "Report state (layout / template / prompt context) is preserved across all recovery paths" (GH-01/02/03, XR-05) |
| B-5 | GitHub TG-1 + PI-1 | DOWNGRADE "Error details shown consistently (BCIN-6574)" from P1 → P2; add GH-10/GH-11/XR-06 citation |
| B-6 | GitHub AI-1 | FIX "Modeling-service request failure does NOT recreate" — replace Network-tab/reCreateInstance flag check with user-observable outcome; move API assertion to AUTO |
| B-7 | Confluence GAP-1 | ADD or PROMOTE P0: "Normal manipulation error transitions report to pause mode (grid-to-pause transition)" as standalone P0 scenario |

## Non-Blocking Fixes (apply in same pass)

| ID | Source | Action |
|---|---|---|
| N-1 | Jira GAP-3 | ANNOTATE row-limit, Cartesian-join, view-filter scenarios to explicitly validate edit preservation in each |
| N-2 | Jira PRI-1/PRI-2 | ADD comment on view-filter (P0 promoted from Jira P1) and repeated-recovery (P1 promoted from Jira P2) explaining intentional promotion |
| N-3 | Jira ACT-1 | FIX "Cancel from prompt-related recovery" expected result: specify "prompt closes, report grid visible in pause mode, author can re-trigger prompt or make design changes" |
| N-4 | Jira ACT-3 | FIX "Document view refreshes correctly" expected result: "grid is in pause mode (no data rows, no loading spinner), all authoring controls are enabled" |
| N-5 | GitHub GAP-2 | ADD P2 scenario: "Obsolete/deprecated recovery UI actions are removed from the updated error UI" (XR-06, GH-10, GH-11) |
| N-6 | GitHub GAP-3 | ADD P2 scenario: "Prompt recovery UI actions (Return to Prompt link) are present and operable in the error state" (XR-06, GH-08/09/11) |
| N-7 | GitHub GAP-4 | SPLIT "Return to prompt" scenario — add explicit P0 continuation branch for "report loads successfully and remains interactive after resubmission" |
| N-8 | GitHub PI-2 | DOWNGRADE "Recovery completes within reasonable time" from P1 → P2 (no GH trace; outside GitHub-evidence scope) |
| N-9 | GitHub AI-2 | MOVE source-file citations from inline step text into comment blocks only |
| N-10 | GitHub OC-5 | REMOVE "Cross-repo compatibility holds during recovery" (P2, upgrade section) — redundant with XR-01..XR-05; merge reference into XR citations |
| N-11 | Confluence GAP-2 | ADD P2 scenario: "Error dialog uses the mapped user-facing message for exceeded-row-limit recovery" |
| N-12 | Confluence GAP-3 | ADD P2 scenario: "Error confirmation dialog is operable and completes recovery" (dialog operability beyond keyboard nav) |
