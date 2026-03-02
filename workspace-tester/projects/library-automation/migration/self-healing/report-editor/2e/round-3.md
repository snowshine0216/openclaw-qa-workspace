# Healer Round 3 Summary

**Timestamp:** 2026-03-01T10:43:00Z

## Inputs
- Family: `report-editor`
- Phase: `2e`
- WDIO source path: `../wdio/specs/regression/reportEditor/reportPageBy/`
- Spec MD path: `specs/report-editor/report-page-by/`
- Failing specs: `page-by-1.spec.ts`, `page-by-2.spec.ts`, `page-by-3.spec.ts`

## Fixes Applied
1. Added resilient `addObjectToPageBy` fallback search strategy in `tests/specs/report-editor/report-page-by/page-by-1.spec.ts`.
2. Fixed async locator usage for Drill option in `tests/specs/report-editor/report-page-by/page-by-2.spec.ts`.
3. Added row-position fallback for expected detail metric in `tests/specs/report-editor/report-page-by/page-by-3.spec.ts`.

## Rerun Result
- Command: `npm run test:report-page-by`
- Result: **0 passed, 3 failed**
- Remaining failures:
  - `page-by-1.spec.ts`: `Call Center` not found in object browser/report objects.
  - `page-by-2.spec.ts`: `Drill` option still not visible in context menu.
  - `page-by-3.spec.ts`: first detail row value differs from WDIO baseline.
