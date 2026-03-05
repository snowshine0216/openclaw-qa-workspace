# page-by-sorting-7.spec.ts — Healing Report

**Date:** 2026-03-01
**Status:** ✅ Fixed
**Failure step:** Step 9 — `addObjectToPageBy('Year')` at page-by-sorting-7.spec.ts:60 (openObjectContextMenu — Year not found in object browser)

---

## Summary

Test now passes after adding `reportObjectsContainer` fallback in `openObjectContextMenu()`. Year remains in the REPORT OBJECTS panel (reportObjectsContainer) after removal from Page By. DOM: `.object-item-container` with `aria-label="Year"` or `.object-item-text`.

**Root cause:** Selectors — `openObjectContextMenu` only searched `.objectBrowserContainer` (Schema Objects tree). Year is in `reportObjectsContainer` (REPORT OBJECTS list).

---

## URLs to Verify Manually

- **ReportWS_PB_YearCategory1:** `{reportTestUrl}/app/B628A31F11E7BD953EAE0080EF0583BD/5FE3EA2E9F41F5E587B8FB8C03C42809/edit`

---

## Fixes Applied

### report-dataset-panel.ts
- **getItemInReportObjects():** New method to find objects in REPORT OBJECTS panel (`.reportObjectsContainer`, `.object-item-container`, `.object-item-text`).
- **openObjectContextMenu():** Fallback to report objects when not found in object browser after progressive scroll. Added progressive scroll for report objects container when item may be below fold.
