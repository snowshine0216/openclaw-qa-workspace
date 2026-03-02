# Healing Report — report-editor phase 2c (report-creator)

**Date:** 2026-03-02  
**Status:** ❌ Failed after 2 healer rounds (round 1: 2026-03-01)

## Summary

| Metric | Value |
|--------|-------|
| Total tests | 42 |
| Pass (Round 1) | 1 |
| Fail (Round 1) | 25 |
| Skip | 16 |
| Dominant failure | Page on login view when `createNewReport` called |

## Root Cause

**Auth/session:** Specs that call `libraryPage.logout()` in `beforeEach` (create-by-cube-privilege, create-by-cube) fail because the subsequent login does not complete before the test runs. The page remains on `https://.../auth/ui/loginPage` when `dossierCreator.createNewReport()` is invoked.

Specs that do **not** logout (report-creator, template, template-by-execution-mode) use the fixture’s authenticated session and can pass login, but may hit timeouts or other UI issues (e.g. `switchProjectByName` timeout, "Target page, context or browser has been closed").

## URLs to Verify Manually

- Base: `${reportTestUrl}` from `tests/config/.env.report`
- Example: `https://mci-pq2sm-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app`

## Fixes Attempted

### Round 1 (2026-03-01)
- Updated `dossier-creator.ts`: add-button selector, tooltip dismissal, project dropdown matching, loading wait.

### Round 2 (2026-03-02)
- **dossier-creator.ts:** Broader add-button selectors (WDIO `mstrd-CreateDossierNavItemContainer-ico`/`-icon`), project dropdown scoped to panel, nav bar wait before add button, template loading wait after modal open, stronger `tryRecoverToAppFromLogin`.
- **login-page.ts:** Wait for URL to leave login or app container visible after login click.
- **library-page.ts:** `openDefaultApp` waits for URL to leave login, throws if still on login; waits for app container.
- **Specs (create-by-cube, create-by-cube-privilege):** `waitForLoginView` after logout, longer `waitForURL` (25s), URL pattern `/\/(app|Home|Dashboard|Library)/i`.

## Failed Scripts (aggregate)

| # | Script | URL | Step | Why it fails |
|---|--------|-----|------|--------------|
| 1 | create-by-cube-privilege.spec.ts | `${reportTestUrl}` | createNewReport | Page on login view |
| 2 | create-by-cube.spec.ts | `${reportTestUrl}` | createNewReport | Page on login view |
| 3 | report-creator.spec.ts | `${reportTestUrl}` | switchProjectByName | Timeout or browser closed |
| 4 | report-template-security.spec.ts | `${reportTestUrl}` | createNewReport (after logout) | Page on login view |
| 5 | template.spec.ts | `${reportTestUrl}` | createNewReport / switchProjectByName | May pass or timeout |
| 6 | template-by-execution-mode.spec.ts | `${reportTestUrl}` | createNewReport / switchProjectByName | May pass or timeout |

## Recommendations

1. **Verify env:** Ensure `tests/config/.env.report` has valid `reportTestUrl`, `reportTestPassword`, and user credentials (`reportCubePrivUser`, `reportSubsetUser`, etc.). Users `re_nic`, `re_ss` require a password if the server enforces it.
2. **Manual login:** Run the app manually, log in with the same users, and confirm the Create Report flow works.
3. **Session handling:** If login is slow or redirects differ, consider increasing timeouts or adding a retry for login in specs that use `logout` + login.
4. **Selector check:** If login succeeds, add-button and project dropdown selectors in `dossier-creator.ts` were updated per WDIO; verify DOM matches if still failing.

## Original Step Alignment

For all specs, WDIO sources were verified against `ReportEditor_createByCube.spec.js`, `ReportEditor_createByCubePrivilege.spec.js`, etc. No steps were removed, skipped, or reordered; fixes preserve intent.
