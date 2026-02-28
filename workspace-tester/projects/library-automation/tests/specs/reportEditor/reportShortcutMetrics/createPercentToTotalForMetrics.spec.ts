/**
 * Migrated from WDIO: ReportEditor_createPercentToTotalForMetrics.spec.js
 * Phase 2a: Report Editor Shortcut Metrics - Percent to Total (rows/columns)
 */
import { test, expect, reportShortcutMetricsData } from '../../../fixtures';

test.describe('Report Editor Shortcut Metrics', () => {
  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test(
    '[TC85613_4] Creating percent to total metrics (rows and columns)',
    { tag: ['@tc85613_4'], timeout: 360000 },
    async ({ page, libraryPage, reportToolbar, reportEditorPanel, reportGridView, reportDerivedMetricEditor }) => {
      const d = reportShortcutMetricsData.dossiers.ReportGridShortcutMxAttrInCols;
      await libraryPage.editReportByUrl({ dossierId: d.id, projectId: d.projectId });
      await reportToolbar.switchToDesignMode();

      expect(
        await reportGridView.getGridCellTextByPos(0, 0),
        'After switch to Design Mode, grid cell (0,0) should have text Year'
      ).toBe('Year');

      await reportEditorPanel.createPercentToTotalForMetricInMetricsDropZone('Cost', 'Over Rows');
      await page.waitForTimeout(2000); // Wait for metric to appear in dropzone

      expect(
        await reportGridView.getGridCellTextByPos(1, 2),
        'After create percent to total Over Rows, grid should show Percent to Total By Rows (Cost)'
      ).toBe('Percent to Total By Rows (Cost)');

      await reportEditorPanel.createPercentToTotalForMetricInMetricsDropZone('Cost', 'Over Columns');
      await page.waitForTimeout(2000);

      await reportEditorPanel.openObjectContextMenu('metrics', 'metric', 'Percent to Total By Rows (Cost)');
      await reportEditorPanel.clickContextMenuItem('Edit...');
      await reportDerivedMetricEditor.saveFormulaMetric();

      await reportEditorPanel.openObjectContextMenu('metrics', 'metric', 'Percent to Total By Columns (Cost)');
      await reportEditorPanel.clickContextMenuItem('Edit...');
      await reportDerivedMetricEditor.saveFormulaMetric();
    }
  );
});
