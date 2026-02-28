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
    { tag: ['@tc85613_4']},
    async ({ page, libraryPage, reportToolbar, reportEditorPanel, reportGridView, reportDerivedMetricEditor }) => {
      const d = reportShortcutMetricsData.dossiers.ReportGridShortcutMxAttrInCols;
      await libraryPage.editReportByUrl({ dossierId: d.id, projectId: d.projectId });
      await reportToolbar.switchToDesignMode();

      await reportEditorPanel.createPercentToTotalForMetricInMetricsDropZone('Cost', 'Over Rows');
      // Wait for metric to appear in dropzone and grid (grid may update before dropzone)
      await expect
        .poll(async () => {
          const metrics = await reportEditorPanel.getMetricsObjects();
          return metrics.some((m) => m.includes('Percent to Total By Rows (Cost)'));
        }, { timeout: 15000 })
        .toBe(true);

      expect(
        await reportGridView.getGridCellTextByPos(1, 2),
        'After create percent to total Over Rows, grid should show Percent to Total By Rows (Cost)'
      ).toBe('Percent to Total By Rows (Cost)');

      await reportEditorPanel.createPercentToTotalForMetricInMetricsDropZone('Cost', 'Over Columns');
      await expect
        .poll(async () => {
          const metrics = await reportEditorPanel.getMetricsObjects();
          return metrics.some((m) => m.includes('Percent to Total By Columns (Cost)'));
        }, { timeout: 15000 })
        .toBe(true);

      await reportEditorPanel.openObjectContextMenu('metrics', 'metric', 'Percent to Total By Rows (Cost)');
      await reportEditorPanel.clickContextMenuItem('Edit...');
      await reportDerivedMetricEditor.saveFormulaMetric();

      await reportEditorPanel.openObjectContextMenu('metrics', 'metric', 'Percent to Total By Columns (Cost)');
      await reportEditorPanel.clickContextMenuItem('Edit...');
      await reportDerivedMetricEditor.saveFormulaMetric();
    }
  );
});
