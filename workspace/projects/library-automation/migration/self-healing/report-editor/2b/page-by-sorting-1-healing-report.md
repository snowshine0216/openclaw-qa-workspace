# page-by-sorting-1.spec.ts — Healing Report

**Date:** 2026-03-02
**Status:** ❌ Failed after 3 fix rounds
**Failure step:** Line 30 — `expect(yearSelector).toBeVisible({ timeout: 30000 })`

---

## Failure Summary

The test fails because the Year Page By selector pulldown is not visible within 30s. The dossier `DeveloperPBYearAscCustomCategoriesParentTop` loads, but the Year selector does not appear in the Page By area.

**Root cause:** Environment / dossier structure — the Year selector may not exist or may use different labels (e.g. "Fiscal Year") in this environment. The Page By area may render with a different structure or the dossier may not have Year in Page By.

---

## URLs to Verify Manually

Edit URL format: `{reportTestUrl}/app/{projectId}/{dossierId}/edit`  
Dossier: DeveloperPBYearAscCustomCategoriesParentTop (id: 71DF87284DDBAF9B3FD77E84073823EE, projectId: B628A31F11E7BD953EAE0080EF0583BD)

---

## Fixes Attempted (Round 1–3)

1. **Round 1:** No changes — baseline failure.
2. **Round 2:** Added `expect.poll` (45s) to wait for Year selector visibility — still failed (selector never appeared).
3. **Round 3:** Reverted poll; kept `waitForPageByArea(30000)` — failure persists.

---

## Recommendations

1. Manually open the dossier edit URL and verify whether Year and Custom Categories appear in the Page By area.
2. If the dossier structure differs, try fallback dossier `ReportWS_PB_YearCategory1` (Year + Category) and adjust selectors accordingly.
3. If labels differ (e.g. "Fiscal Year"), add partial-match support in `getSelector` or use `getSelectorByIdx` with flexible label matching.
