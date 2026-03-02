/**
 * Migrated from WDIO: ReportEditor_createPageGrandPercentToTotalMetrics.spec.js
 * Phase 2a: Report Editor Shortcut Metrics - Page and Grand Percent to Total
 */
import { test, expect, reportShortcutMetricsData } from '../../../fixtures';

test.describe('Report Editor Shortcut Metrics', () => {
  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test(
    '[TC85613_2] Creating page and grand percent to total metrics',
    { tag: ['@tc85613_2']},
    async ({ libraryPage, reportToolbar, reportEditorPanel, reportGridView }) => {
      const d = reportShortcutMetricsData.dossiers.ReportGridShortcutMxAttrInCols;
      await libraryPage.editReportByUrl({ dossierId: d.id, projectId: d.projectId });

      await reportEditorPanel.expandSubmenuForPercentToTotalForMetricInMetricsDropZone('Cost');
      expect(await reportEditorPanel.isSubmenuItemDisplayed('Over Rows'), 'Over Rows').toBe(true);
      expect(await reportEditorPanel.isSubmenuItemDisplayed('Over Columns'), 'Over Columns').toBe(true);
      expect(await reportEditorPanel.isSubmenuItemDisplayed('Page Total'), 'Page Total').toBe(true);
      expect(await reportEditorPanel.isSubmenuItemDisplayed('Grand Total'), 'Grand Total').toBe(true);

      await reportToolbar.switchToDesignMode();
      expect(await reportGridView.getGridCellTextByPos(0, 0), 'Grid (0,0)').toBe('Year');

      await reportEditorPanel.createPercentToTotalForMetricInMetricsDropZone('Cost', 'Grand Total');
      // Grid cell position may vary; use resilient wait for grid to contain the metric text
      await reportGridView.waitForGridToContainText(/Percent to Grand Total.*Cost|Percent to Grand Total \(Cost\)/i, 20000);

      await reportEditorPanel.createPercentToTotalForMetricInMetricsDropZone('Cost', 'Page Total');
      await expect
        .poll(
          async () => {
            const metrics = await reportEditorPanel.getMetricsObjects();
            return metrics.some((m) => m.includes('Percent to Page Total'));
          },
          { timeout: 15000, message: 'Metrics should have Page Total' }
        )
        .toBe(true);
    }
  );
});
