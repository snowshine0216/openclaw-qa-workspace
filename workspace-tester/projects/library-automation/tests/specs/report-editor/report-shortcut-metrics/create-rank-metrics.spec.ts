/**
 * Migrated from WDIO: ReportEditor_createRankMetrics.spec.js
 * Phase 2a: Report Editor Shortcut Metrics - Rank
 */
import { test, expect, reportShortcutMetricsData } from '../../../fixtures';

test.describe('Report Editor Shortcut Metrics', () => {
  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test(
    '[TC85613_1] Creating rank metrics',
    { tag: ['@tc85613_1']},
    async ({ libraryPage, reportToolbar, reportEditorPanel, reportGridView }) => {
      const d = reportShortcutMetricsData.dossiers.ReportGridShortcutMx;
      await libraryPage.editReportByUrl({ dossierId: d.id, projectId: d.projectId });

      await reportEditorPanel.createRankForMetricInMetricsDropZone('Cost');
      const metrics = await reportEditorPanel.getMetricsObjects();
      expect(metrics.some((m) => m.includes('Rank')), 'Metrics should contain Rank (Cost)').toBe(true);

      await reportToolbar.switchToDesignMode();
      expect(await reportGridView.getGridCellTextByPos(0, 0), 'Grid cell (0,0)').toBe('Subcategory');

      await reportEditorPanel.createRankForMetricInMetricsDropZone('Cost', 'Descending');
      const metrics2 = await reportEditorPanel.getMetricsObjects();
      expect(metrics2.some((m) => m.includes('Rank')), 'Metrics should contain Rank Descending').toBe(true);
    }
  );
});
