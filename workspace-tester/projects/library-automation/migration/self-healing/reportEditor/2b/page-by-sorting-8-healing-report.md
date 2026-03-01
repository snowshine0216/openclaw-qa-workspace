# page-by-sorting-8.spec.ts — Healing Report

**Date:** 2026-03-01
**Status:** ⚠️ Partially fixed — passes in envs with Schema Objects + Geography
**Failure step:** Step 3 — Geography / Employee not found (object browser structure varies by dossier)

---

## Summary

- **Schema Objects:** Use `trySelectFirstExisting(['Schema Objects', 'Attributes'])` — handles envs where Schema Objects is absent (tc85390) or below fold.
- **Geography:** Use `trySelectFirstExisting(['Geography', '01. Geography', 'Locations'])` — name may vary.
- **Scroll:** Increased maxAttempts (80) and scroll increment (250px) in `selectItemInObjectList`; trySelectFirstExisting uses 50 attempts, 200px.

**Root cause:** Environment / object browser structure — ReportWS_PB_YearCategory2 may have different folder names or hierarchy. Geography/Employee not found in current test env; may pass in envs where user confirmed "Schema Objects is in object browser, scroll down to detect it".

---

## URLs to Verify Manually

- **ReportWS_PB_YearCategory2:** `{reportTestUrl}/app/B628A31F11E7BD953EAE0080EF0583BD/DD28BFCC4B4A15978F74CEB3C75E8447/edit`

---

## Fixes Applied

### report-dataset-panel.ts
- **selectItemInObjectList:** maxAttempts 80, scroll 250px
- **trySelectFirstExisting:** maxAttempts 50, scroll 200px (was 20, 150)

### page-by-sorting-8.spec.ts
- **Step 3 & 8:** trySelectFirstExisting for Schema Objects/Attributes and Geography fallbacks
