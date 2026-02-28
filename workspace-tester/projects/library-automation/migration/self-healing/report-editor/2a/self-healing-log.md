# Self-Healing Log: reportEditor Phase 2a

**Date:** 2026-02-28
**Phase:** 2a (reportShortcutMetrics)

## Fixes Applied

### 1. createPercentToTotalForMetrics (locator)

**Issue:** "Percent to Total By Rows (Cost)" in metrics dropzone not found after create.

**Fixes:**
- **ReportEditorPanel.openObjectContextMenu:** Broadened zone locator to include `[class*="template-editor-content-{zone}"]`; expanded object locator to include `.txt, [class*="object"]` for dynamically added metrics; increased timeout to 20s.
- **ReportEditorPanel.getMetricsObjects:** Added fallback `[class*="template-editor-content-metrics"]` for metrics zone.
- **createPercentToTotalForMetrics.spec.ts:** Replaced fixed 2s wait with `expect.poll` (15s) to wait until metric appears in `getMetricsObjects()` before `openObjectContextMenu`.

### 2. createRankMetrics (Rank submenu flow)

**Issue:** Rank submenu uses dropdown + OK, not direct list items.

**Fixes:**
- **ReportEditorPanel.createRankForMetricInMetricsDropZone:** Broadened rank submenu locator to include `[class*="RankSubmenu"]`; sorts dropdown to include `[class*="sorts"], [role="combobox"]`; option match uses regex `/ascending/i` or `/descending/i` for "Ascending Order" variants; OK button uses `[role="button"]:has-text("OK")`; increased waits and timeouts.

### 3. createTransformationMetrics / metricEditor

**Issue:** Timeout/network (ERR_ABORTED, ERR_NAME_NOT_RESOLVED). Environment/connectivity dependent — no code changes applied.
