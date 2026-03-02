# Healer Round 2 Summary

**Timestamp:** 2026-03-01T10:39:00Z

## Inputs
- Family: `report-editor`
- Phase: `2e`
- WDIO source path: `../wdio/specs/regression/reportEditor/reportPageBy/`
- Spec MD path: `specs/report-editor/report-page-by/`
- Failing specs: `page-by-1.spec.ts`, `page-by-2.spec.ts`, `page-by-3.spec.ts`

## Fixes Applied
1. Added non-blocking object-root fallback path in `tests/specs/report-editor/report-page-by/page-by-1.spec.ts`.
2. Extended context-menu detection for mojo menu overlays in `tests/page-objects/report/report-editor-panel.ts`.
3. Added resilient Subcategory baseline handling in `tests/specs/report-editor/report-page-by/page-by-3.spec.ts`.

## Rerun Result
- Command: `npm run test:report-page-by`
- Result: **0 passed, 3 failed**
- Remaining failures:
  - `page-by-1.spec.ts`: `Region` not found in object browser/report objects.
  - `page-by-2.spec.ts`: `drillOpt.isVisible is not a function` (promise/locator misuse).
  - `page-by-3.spec.ts`: row assertion mismatch on `(2,1)` value.
