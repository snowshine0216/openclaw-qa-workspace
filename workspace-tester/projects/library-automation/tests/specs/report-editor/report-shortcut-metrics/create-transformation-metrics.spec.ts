/**
 * Migrated from WDIO: ReportEditor_createTransformationMetrics.spec.js
 * Phase 2a: Report Editor Shortcut Metrics - Transformation
 */
import { test, expect, reportShortcutMetricsData } from '../../../fixtures';

test.describe('Report Editor Shortcut Metrics', () => {
  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test(
    '[TC85613_5] Creating Transformation Metrics',
    { tag: ['@tc85613_5']},
    async ({ libraryPage, reportToolbar, reportEditorPanel, reportGridView }) => {
      const d = reportShortcutMetricsData.dossiers.ReportGridContextMenu;
      await libraryPage.editReportByUrl({ dossierId: d.id, projectId: d.projectId });
      await reportToolbar.switchToDesignMode();

      await reportEditorPanel.createTransformationForMetricInMetricsDropZone("Last Year's", 'Normal', 'Cost');
      await expect.poll(async () => reportGridView.getGridCellTextByPos(0, 3), 'Grid cell (0,3) should be Cost').toBe('Cost');
      expect(await reportGridView.getGridCellTextByPos(0, 0)).toBe('Year');

      await reportEditorPanel.createTransformationForMetricInMetricsDropZone("Last Year's", 'Variance', 'Cost');
      await expect.poll(async () => reportGridView.getGridCellTextByPos(0, 0), 'After Variance').toBe('Year');
    }
  );
});
