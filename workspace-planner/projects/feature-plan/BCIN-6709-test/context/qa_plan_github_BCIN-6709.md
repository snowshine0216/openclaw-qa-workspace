# GitHub Domain Summary: BCIN-6709

## 📊 Refresh Status

| Field | Value |
|-------|-------|
| **Feature** | BCIN-6709 |
| **Date Generated** | 2026-03-07 |
| **Required GitHub URLs** | 10 valid + 1 malformed Jira comment URL |
| **Successfully fetched** | 7 / 10 |
| **Failed required fetches** | 3 compare URLs |
| **Status** | **FAIL CLOSED** |

## 🚫 Fail-Closed Gate

This GitHub context refresh is intentionally **not complete**.

The following required compare URLs from `inputs.json` returned `404` via `gh api`, so full compare evidence could not be rebuilt:

- `https://github.com/mstr-kiai/biweb/compare/m2021...revertReport`
- `https://github.com/mstr-kiai/mojojs/compare/m2021...revertReport`
- `https://github.com/mstr-kiai/web-dossier/compare/m2021...revertReport`

A malformed Jira-comment URL was also present and could not be treated as fetchable evidence:

- `https://github.com/mstr-`

Until those compare artifacts are recoverable, downstream synthesis should treat this GitHub domain as **partial evidence only**.

## ✅ Evidence Rebuilt

### User-provided compare URLs

| URL | Result | Persisted Evidence |
|-----|--------|--------------------|
| `https://github.com/mstr-modules/react-report-editor/compare/m2021...revertReport` | fetched | `context/github_diff_react-report-editor_compare.json`, `context/github_diff_react-report-editor.md` |
| `https://github.com/mstr-kiai/biweb/compare/m2021...revertReport` | **failed: 404** | none |
| `https://github.com/mstr-kiai/mojojs/compare/m2021...revertReport` | **failed: 404** | none |
| `https://github.com/mstr-kiai/web-dossier/compare/m2021...revertReport` | **failed: 404** | none |

### Jira-comment PR URLs

| URL | Result | Persisted Evidence |
|-----|--------|--------------------|
| `https://github.com/mstr-kiai/biweb/pull/33041` | fetched | `context/github_pr_biweb_33041.json` |
| `https://github.com/mstr-kiai/mojojs/pull/8873` | fetched | `context/github_pr_mojojs_8873.json` |
| `https://github.com/mstr-kiai/productstrings/pull/15008` | fetched | `context/github_pr_productstrings_15008.json` |
| `https://github.com/mstr-kiai/productstrings/pull/15012` | fetched | `context/github_pr_productstrings_15012.json` |
| `https://github.com/mstr-kiai/server/pull/10905` | fetched | `context/github_pr_server_10905.json` |
| `https://github.com/mstr-kiai/web-dossier/pull/22468` | fetched | `context/github_pr_web-dossier_22468.json` |

## 🧩 What The Accessible Evidence Shows

### 1. `react-report-editor` is the core recovery surface

The one accessible compare diff contains the largest behavioral change set:

- compare status: `diverged`
- commits ahead of `m2021`: `12`
- files changed: `17`

High-impact files from the compare:

- `production/src/components/error-catcher/error-catcher.tsx`
- `production/src/components/recreate-error-catcher/recreate-error-catcher.tsx`
- `production/src/components/recreate-error-catcher/recreate-report-error.ts`
- `production/src/store/shared/shared-recover-from-error.ts`
- `production/src/store/doc-view-slice/doc-view-slice.ts`
- `production/src/store/report-def-slice/report-def-slice.ts`
- `production/src/utils/undo-redo-util.ts`

Testing implications:

- recovery happens in the editor layer, not only in the server response layer
- state preservation versus reset is explicit and must be verified
- document re-render behavior after failure is a first-class risk area

### 2. `biweb` PR `#33041` adds server-side recovery support

- title: `BCIN-7543; support new <os>8 flag for reCreateReportInstance`
- base/head: `m2021` ← `revertReport`
- files changed: `3`

Changed files:

- `BIWebSDK/code/java/src/com/microstrategy/web/objects/RWManipulationBuilder.java`
- `BIWebSDK/code/java/src/com/microstrategy/web/objects/RWManipulationImpl.java`
- `BIWebSDK/code/java/src/com/microstrategy/web/objects/rw/RWManipulation.java`

Testing implications:

- client recovery depends on server support for `reCreateReportInstance`
- refresh / blocking-error handling needs API-level validation, not just UI validation

### 3. `mojojs` PR `#8873` changes controller behavior around report errors

- title: `BCIN-7543; Improve the report error handling`
- files changed: `2`

Changed files:

- `production/code/mojo/js/source/vi/controllers/RootController.js`
- `production/code/mojo/js/source/vi/controllers/UICmdMgr.js`

Testing implications:

- command manager reset behavior is coordinated with the editor recovery flag
- undo/redo preservation is cross-repo and regression-prone

### 4. `web-dossier` PR `#22468` covers prompt-error recovery

- title: `BCIN-7543; Improve the report error handling`
- files changed: `6`

Changed files include:

- `production/src/react/src/components/popup/ActionLinkContainer/index.js`
- `production/src/react/src/constants/ActionLinks.js`
- `production/src/react/src/modules/prompt/promptActionCreators.js`
- `production/src/react/src/server/ServerAPIErrorCodes.js`
- `production/src/react/src/services/transforms/ErrorObjectTransform.js`
- `production/src/react/src/services/transforms/__tests__/ErrorObjectTransform.test.js`

Testing implications:

- prompt flows have bespoke error mapping and recovery links
- prompt answer preservation must be tested separately from generic report recovery

### 5. Supporting repos extend the end-to-end UX

`productstrings` PRs:

- `#15008` adds Library-facing strings
- `#15012` adds React Report Editor strings / statuses

`server` PR `#10905` adds backend support for blocking-error refresh behavior.

Testing implications:

- user-facing copy and status messaging changed alongside behavior
- blocking-error refresh handling spans backend + client + strings

## 🎯 Testing Priorities From GitHub Evidence

### P0

- manipulation failure keeps the user in Library and allows continued report operations after recovery
- blocking errors invoke recreate/report-refresh flow instead of forcing navigation loss
- normal error versus modeling-style error applies the correct undo/redo preservation policy
- prompt-answer failure returns the user to prompt flow with prior answers preserved
- recovered report remains interactive for the next manipulation, refresh, and prompt actions

### P1

- repeated failure / recovery cycles do not leave stale requests or inconsistent command state
- document view re-renders cleanly after recreation with no empty grid or frozen UI
- user-visible messages / statuses align with the new recovery paths
- refresh on blocking errors enters the expected no-action mode handshake between server and client

### P2

- styling and action-link presentation remain correct during recovery banners / prompt recovery UI
- regression coverage for unchanged report operations around the new recovery hooks

## ⚠️ GitHub-Derived Risks

| Risk | Why It Matters |
|------|----------------|
| Missing compare evidence for 3 repos | Full file-level drift vs `m2021` is not currently provable |
| Cross-repo recovery contract | Recovery spans server, BIWeb SDK, mojo controllers, editor state, and dossier prompt UX |
| Undo/redo policy split | Error classification changes whether history is reset or preserved |
| Prompt-specific recovery path | Prompt failure path differs from generic report error recovery |
| Blocking-error refresh | Server and client must agree on a no-action / recreate contract |

## 📎 Raw Evidence Inventory

- `context/github_diff_react-report-editor_compare.json`
- `context/github_diff_react-report-editor.md`
- `context/github_pr_biweb_33041.json`
- `context/github_pr_mojojs_8873.json`
- `context/github_pr_productstrings_15008.json`
- `context/github_pr_productstrings_15012.json`
- `context/github_pr_server_10905.json`
- `context/github_pr_web-dossier_22468.json`
- `context/github_fetch_status_BCIN-6709.json`
