# QA Summary Skill — Post-Run Blockers & Enhancement Backlog

**Date:** 2026-03-17  
**Source:** End-to-end run on BCIN-150  
**Status:** Open — Pending Implementation

---

## Issue 1 — `confluence create-child` not wired into `phase5.mjs`

**Severity:** High — blocks `create_new` publish without manual bypass  
**Observed:** `phase5.mjs` calls `run-confluence-publish.sh` which passes `--space` and `--title` to the confluence CLI. The correct command for creating a page under a parent is `confluence create-child <title> <parentId>`, not `confluence create --space`. The publish path had to be bypassed manually.

**Root Cause:** `publishMergedMarkdown()` in `phase5.mjs` constructs publish args as:
```
bash run-confluence-publish.sh --input <file> --space CQT --title "..."
```
The shared script does not handle `create-child` semantics or pass `--parent-id`.

**Fix Required:**
- In `phase5.mjs`, when `publishMode === 'create_new'` and `target.parent_page_id` is set, invoke:
  ```
  confluence create-child "<title>" <parent_page_id> --file <merged.md> --format markdown
  ```
- Update `run-confluence-publish.sh` to support a `--parent-id <id>` flag that switches to `create-child` mode.
- Add integration test: `phase5.test.js` — `create_new` with `parent_page_id` calls `create-child` not `create`.

---

## Issue 2 — Feishu notification script (`notify_feishu.sh`) fails silently

**Severity:** Medium — QA summary is published but team notification is dropped  
**Observed:** `notify_feishu.sh` delegates to the shared `feishu-notify` skill via the skill-path-registrar. The registrar returned not-found, so the notification was not sent. The error was logged as `FEISHU_NOTIFY_PENDING` without surfacing to the user. The pending payload was saved to `run.json.notification_pending`.

**Root Cause:** The `feishu-notify` shared skill is not installed in any of the registrar's search paths.

**Fix Required:**
- Add a direct fallback in `notify_feishu.sh`: if the skill-path-registrar fails to resolve `feishu-notify`, fall back to the `wacli` CLI or a direct Feishu webhook POST using `FEISHU_CHAT_ID` and `FEISHU_WEBHOOK_URL` env vars.
- Suggested fallback message format:
  ```
  📊 QA Summary published: <feature-key>
  Confluence: <page-url>
  ```
- After sending, write `notification_sent_at` to `run.json` and clear `notification_pending`.
- If both paths fail, print `FEISHU_NOTIFY_FAILED` and surface the pending payload to the user for manual action (current behavior is silent).

---

## Issue 3 — `phase5.mjs` does not read `parent_page_id` from `task.json` for `create_new` mode

**Severity:** High — structural gap causes `create_new` to require manual env var injection  
**Observed:** `task.json` had `confluence_target.parent_page_id = 5918294023` set from Phase 0 (user-provided parent URL). `phase5.mjs` reads `pageId`, `pageUrl`, `publishSpace`, and `publishTitle` from the target but ignores `parent_page_id`. The correct parent was not passed to the publish script.

**Root Cause:** `readPersistedTarget()` in `phase5.mjs` reconstructs only four fields. `parent_page_id` is stored but never forwarded to `publishMergedMarkdown`.

**Fix Required:**
- Add `parent_page_id` as a first-class field in `readPersistedTarget()`:
  ```js
  const parentPageId = input.parent_page_id || persistedTarget.parent_page_id || persistedTarget.parentPageId;
  ```
- Pass `parentPageId` through to `publishMergedMarkdown()` and into the publish script args.
- Update `phase0.mjs` to parse and persist `parent_page_id` from the user-supplied Confluence URL (e.g. `https://.../pages/5918294023/26.04` → `5918294023`).
- Add test: `phase5.test.js` — `task.json.confluence_target.parent_page_id` is forwarded when `publishMode === 'create_new'`.

---

## Issue 4 — `Overall Risk: MEDIUM` with 0 defects lacks explanation

**Severity:** Low — confusing for reviewers; not a workflow blocker  
**Observed:** Section 4 states `Overall risk: MEDIUM` while defect count is 0/0/0. Risk is elevated by planner-only evidence (QA testing not yet commenced; planner has P1 markers). This is correct business logic but reviewers reading the summary in isolation may be confused by the apparent contradiction.

**Fix Required:**
- In `buildOverallStatus()` inside `buildSummaryDraft.mjs`, when `totalDefects === 0` and the risk level is above LOW, append an explanation bullet:
  ```
  - Note: Risk elevated to MEDIUM due to incomplete QA coverage (QA testing not yet commenced), not open defects.
  ```
- Only append when risk > LOW AND `noDefectsFound === true`.
- Add test: `buildSummaryDraft.test.js` — zero defects with planner P1 markers renders explanation bullet.

---

## Issue 5 — `Release` and `QA Owner` fields remain `[PENDING]`

**Severity:** Medium — reduces summary completeness; stakeholders must look up Jira manually  
**Observed:** The Feature Overview table (Section 1) shows `[PENDING]` for both `Release` and `QA Owner`. These values exist in Jira as `Fix Version` and a custom `QA Owner` field but are not fetched during Phase 1.

**Root Cause:** Phase 1 only reads planner artifacts (QA plan markdown). Jira metadata is not queried.

**Fix Required:**
- In `phase1.mjs`, after resolving planner artifacts, fetch Jira issue metadata for `featureKey`:
  ```bash
  jira issue view <featureKey> --output json
  ```
- Extract:
  - `Release` from `fixVersions[0].name` or `fixVersions[0].releaseDate`
  - `QA Owner` from the custom field (field key TBD — check project config)
- Pass extracted values to `buildFeatureOverviewTable()` to override `[PENDING]` placeholders.
- If Jira fetch fails or fields are empty, keep the existing `[PENDING — <reason>]` placeholder.
- Persist fetched metadata to `context/jira_feature_meta.json`.
- Add test: `phase1.test.js` — when `jiraMetadata` is provided, `Release` and `QA Owner` rows are populated.

**Note:** Source `~/.agents/skills/jira-cli/.env` before running any `jira` CLI commands in this workspace (per `AGENTS.md` Mandatory Skills rule).

---

## Summary Table

| # | Issue | Severity | Files to Change | Blocked By |
|---|---|---|---|---|
| 1 | `create-child` not wired | High | `phase5.mjs`, `run-confluence-publish.sh` | Nothing |
| 2 | Feishu notify silent failure | Medium | `notify_feishu.sh`, `run.json` handler | Nothing |
| 3 | `parent_page_id` not forwarded | High | `phase5.mjs`, `phase0.mjs` | Nothing |
| 4 | Risk explanation missing | Low | `buildSummaryDraft.mjs` | Nothing |
| 5 | Release / QA Owner `[PENDING]` | Medium | `phase1.mjs`, `buildFeatureOverviewTable.mjs` | Jira field key lookup |

---

_Last updated: 2026-03-17_
