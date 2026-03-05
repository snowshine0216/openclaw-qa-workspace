# TC85390 - Progressive Scroll for Object Browser

**Date:** 2026-02-28 19:47 (updated 2026-03-01)  
**Status:** Progressive scroll confirmed; behavior varies by dossier

---

## Progressive Scroll Implementation

Updated `selectItemInObjectList()` to:
1. Scroll down in 250px increments (increased from 150px)
2. Check for item after each scroll
3. Stop when scrollTop stops changing (bottom reached)
4. Scroll back to top and do final check
5. maxAttempts increased to 80 for dossiers where Schema Objects is below fold

**Code:** `tests/page-objects/report/report-dataset-panel.ts`

---

## Dossier-Specific Behavior

| Dossier | Schema Objects | Notes |
|---------|----------------|-------|
| TC85390 acceptance | Absent | Flat structure; skip Schema Objects, navigate to Attributes → Time |
| ReportWS_PB_YearCategory2 (page-by-sorting-8) | Present, below fold | Scroll down to detect; increased scroll distance/attempts |

---

## TC85390 Original Result (2026-02-28)

```
[Dataset Panel] "Schema Objects" not visible, progressive scrolling...
[Dataset Panel] Reached bottom, "Schema Objects" not found
[Dataset Panel] "Schema Objects" count at top: 0
```

**Conclusion for that report:** "Schema Objects" folder does NOT exist; use Attributes → Time directly.

---

## page-by-sorting-8 (ReportWS_PB_YearCategory2)

**Schema Objects is in object browser** — scroll down to detect it. Scroll improvements (maxAttempts 80, 250px increment) applied so Schema Objects can be found when below the fold.

---

## reportObjectsContainer (page-by-sorting-7)

**Year in REPORT OBJECTS panel:** After removing Year from Page By, Year remains in `reportObjectsContainer` (REPORT OBJECTS list). Added `getItemInReportObjects()` fallback in `openObjectContextMenu()` — when object not found in object browser after scroll, search in report objects. DOM: `.object-item-container` with `aria-label` or `.object-item-text`.
