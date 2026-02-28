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
    { tag: ['@tc85613_5'], timeout: 360000 },
    async ({ libraryPage, reportToolbar, reportEditorPanel, reportGridView }) => {
      const d = reportShortcutMetricsData.dossiers.ReportGridContextMenu;
      await libraryPage.editReportByUrl({ dossierId: d.id, projectId: d.projectId });
      await reportToolbar.switchToDesignMode();

      await reportEditorPanel.createTransformationForMetricInMetricsDropZone("Last Year's", 'Normal', 'Cost');
      expect(await reportGridView.getGridCellTextByPos(0, 0), 'Grid cell (0,0)').toBe('Year');
      expect(await reportGridView.getGridCellTextByPos(0, 3), 'Grid cell (0,3) Cost').toBe('Cost');

      await reportEditorPanel.createTransformationForMetricInMetricsDropZone("Last Year's", 'Variance', 'Cost');
      expect(await reportGridView.getGridCellTextByPos(0, 0), 'After Variance').toBe('Year');
    }
  );
});
