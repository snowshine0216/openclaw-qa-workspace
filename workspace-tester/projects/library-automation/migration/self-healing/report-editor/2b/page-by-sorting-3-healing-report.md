# page-by-sorting-3.spec.ts — Healing Report

**Date:** 2026-03-02
**Status:** ❌ Failed after 3 fix rounds
**Failure step:** Line 29 — `getPageBySelectorText('Seasons')` at report-page-by.ts:95

---

## Failure Summary

The test fails because the Seasons Page By selector is not visible. The dossier `DeveloperPBConsolidationSubcategory` either does not have "Seasons" as a Page By or uses a different label.

**Root cause:** Dossier / test data — DeveloperPBConsolidationSubcategory may not include Seasons in Page By in this environment, or the consolidation structure differs.

---

## URLs to Verify Manually

Edit URL format: `{reportTestUrl}/app/{projectId}/{dossierId}/edit`  
Dossier: DeveloperPBConsolidationSubcategory (id: C05D5E154F132DB25D5D58A14AF01F8D, projectId: B628A31F11E7BD953EAE0080EF0583BD)

---

## Fixes Attempted (Round 1–3)

1. **Round 1:** Added `waitForPageByArea(30000)` before `getPageBySelectorText('Seasons')` — still failed.
2. **Round 2:** Passed in one run (flaky) — no code change.
3. **Round 3:** Added `expect.poll` (45s) for Seasons visibility — failed; also observed `page.waitForURL` timeout (navigation/commit) in one run, suggesting environment instability.

---

## Recommendations

1. Manually verify the dossier has "Seasons" in Page By and that it shows values like "Winter", "Fall".
2. If the dossier uses a different consolidation attribute, update the test data or add a dossier fallback.
3. Consider using a different dossier with known Seasons/consolidation structure if DeveloperPBConsolidationSubcategory is unavailable.
