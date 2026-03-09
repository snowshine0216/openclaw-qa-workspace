# BCIN-6709 — Improve the report error handling to allow and facilitate user to continue editing

- Type: Feature
- Status: To Do
- Due: 2026-03-06
- Assignee: Wei (Irene) Jiang
- Priority: Highest
- Labels: Library_Report, Library_and_Dashboards
- Jira: https://strategyagile.atlassian.net/browse/BCIN-6709

## Problem statement
When a report encounters errors, the user currently has to exit and reopen the report to continue working. This causes loss of in-progress edits and has already triggered customer complaints, including at least one escalation.

## Latest Jira evidence refreshed
- Jira reader comment (2026-03-02): new PR created for m2021
- PR: https://github.com/mstr-kiai/biweb/pull/33041

## QA-relevant implications
- Main user promise is edit continuity after report errors.
- Risk is not just error display; it includes preserving user work and allowing recovery without reopening.
- The feature-level issue is thin on acceptance detail, so implementation and supporting story evidence from BCIN-7543 is required for test planning context.
