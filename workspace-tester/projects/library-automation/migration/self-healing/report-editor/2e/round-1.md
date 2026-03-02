# Healer Round 1 Summary

**Timestamp:** 2026-03-01T10:35:00Z

## Inputs
- Family: `report-editor`
- Phase: `2e`
- WDIO source path: `../wdio/specs/regression/reportEditor/reportPageBy/`
- Spec MD path: `specs/report-editor/report-page-by/`
- Failing specs: `page-by-1.spec.ts`, `page-by-2.spec.ts`, `page-by-3.spec.ts`

## Fixes Applied
1. Updated Page-by selector extraction logic in `tests/page-objects/report/report-page-by.ts` to reduce ambiguous text capture and normalize duplicated pulldown text.
2. Added object-browser root fallback (`Schema Objects`/`Public Objects`) in `tests/specs/report-editor/report-page-by/page-by-1.spec.ts`.

## Rerun Result
- Command: `npm run test:report-page-by`
- Result: **0 passed, 3 failed**
- Remaining failures:
  - `page-by-1.spec.ts`: neither `Schema Objects` nor `Public Objects` found.
  - `page-by-2.spec.ts`: `Move` option not detected in context menu.
  - `page-by-3.spec.ts`: Subcategory baseline expected `Art & Architecture`, received `Business`.
