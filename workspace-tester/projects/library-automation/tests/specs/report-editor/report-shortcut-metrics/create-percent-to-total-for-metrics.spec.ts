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
      // Wait for metric to appear in dropzone (resilient: match partial text for dynamic formatting)
      await expect
        .poll(
          async () => {
            const metrics = await reportEditorPanel.getMetricsObjects();
            return metrics.some((m) => /Percent to Total.*Rows.*Cost/i.test(m) || (m.includes('Percent to Total') && m.includes('Rows') && m.includes('Cost')));
          },
          { timeout: 20000, message: 'Metrics should include Percent to Total By Rows (Cost)' }
        )
        .toBe(true);

      // Grid cell position may vary; use resilient wait for grid to contain the metric text
      await reportGridView.waitForGridToContainText(/Percent to Total.*Rows.*Cost/i, 20000);

      await reportEditorPanel.createPercentToTotalForMetricInMetricsDropZone('Cost', 'Over Columns');
      await expect
        .poll(
          async () => {
            const metrics = await reportEditorPanel.getMetricsObjects();
            return metrics.some((m) => /Percent to Total.*Columns.*Cost/i.test(m) || (m.includes('Percent to Total') && m.includes('Columns') && m.includes('Cost')));
          },
          { timeout: 20000, message: 'Metrics should include Percent to Total By Columns (Cost)' }
        )
        .toBe(true);

      // Use resilient locator: match metric by partial name (format may vary)
      const rowsMetric = (await reportEditorPanel.getMetricsObjects()).find((m) => /Percent to Total.*Rows.*Cost/i.test(m) || (m.includes('Percent to Total') && m.includes('Rows')));
      await reportEditorPanel.openObjectContextMenu('Metrics', 'metric', rowsMetric || 'Percent to Total By Rows (Cost)');
      await reportEditorPanel.clickContextMenuItem('Edit...');
      await reportDerivedMetricEditor.saveFormulaMetric();

      const colsMetric = (await reportEditorPanel.getMetricsObjects()).find((m) => /Percent to Total.*Columns.*Cost/i.test(m) || (m.includes('Percent to Total') && m.includes('Columns')));
      await reportEditorPanel.openObjectContextMenu('Metrics', 'metric', colsMetric || 'Percent to Total By Columns (Cost)');
      await reportEditorPanel.clickContextMenuItem('Edit...');
      await reportDerivedMetricEditor.saveFormulaMetric();
    }
  );
});
