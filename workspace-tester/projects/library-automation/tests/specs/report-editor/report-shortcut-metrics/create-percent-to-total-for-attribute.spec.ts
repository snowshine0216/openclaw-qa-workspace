/**
 * Migrated from WDIO: ReportEditor_createPercentToTotalForAttribute.spec.js
 * Phase 2a: Report Editor Shortcut Metrics - Percent to Total for Attribute
 */
import { test, expect, reportShortcutMetricsData } from '../../../fixtures';

test.describe('Report Editor Shortcut Metrics', () => {
  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test(
    '[TC85613_3] Creating percent to total for each attribute',
    { tag: ['@tc85613_3'], timeout: 360000 },
    async ({ libraryPage, reportToolbar, reportEditorPanel, reportGridView }) => {
      const d = reportShortcutMetricsData.dossiers.ReportGridShortcutMxAttrInCols;
      await libraryPage.editReportByUrl({ dossierId: d.id, projectId: d.projectId });

      await reportEditorPanel.expandSubmenuForPercentToTotalForMetricInMetricsDropZone('Cost');
      await reportEditorPanel.hoverSubMenuItem('Total for Each');
      expect(
        await reportEditorPanel.isSubmenuItemDisplayed('Subcategory'),
        'Submenu should contain Subcategory'
      ).toBe(true);

      await reportEditorPanel.clickSubMenuItem('Subcategory');
      const metrics = await reportEditorPanel.getMetricsObjects();
      expect(metrics.some((m) => m.includes('Percent to Total')), 'Metrics should have Percent to Total (Cost)').toBe(true);

      await reportToolbar.switchToDesignMode();
      expect(await reportGridView.getGridCellTextByPos(0, 0), 'Grid cell (0,0)').toBe('Year');
    }
  );
});
