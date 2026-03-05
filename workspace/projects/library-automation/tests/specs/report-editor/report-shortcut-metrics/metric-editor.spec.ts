/**
 * Migrated from WDIO: ReportEditor_MetricEditor.spec.js
 * Phase 2a: Report Editor - Metric Editor (Create/Edit derived metrics)
 */
import { test, expect, reportShortcutMetricsData } from '../../../fixtures';

test.describe('Report Editor Metric Editor', () => {
  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test(
    '[TC85613_6] Metric Editor - Create and edit derived metric',
    { tag: ['@tc85613_6']},
    async ({
      libraryPage,
      reportToolbar,
      reportEditorPanel,
      reportGridView,
      reportDatasetPanel,
      reportDerivedMetricEditor,
    }) => {
      const d = reportShortcutMetricsData.dossiers.ReportGridContextMenu;
      await libraryPage.editReportByUrl({ dossierId: d.id, projectId: d.projectId });

      await reportEditorPanel.openObjectContextMenu('metrics', 'metric', 'Cost');
      expect(
        await reportEditorPanel.isEditContextMenuItemDisplayed(),
        'Context menu should NOT contain Edit... for base metric Cost'
      ).toBe(false);

      await reportEditorPanel.clickContextMenuItem('Create Metric...');
      await reportDerivedMetricEditor.switchMode('Formula');
      expect(
        await reportDerivedMetricEditor.getTextInInputSection(),
        'Input should contain Sum(Cost)'
      ).toContain('Sum');

      await reportDerivedMetricEditor.saveMetric();

      await reportToolbar.switchToDesignMode();
      // Wait for metric to appear in report tab (dynamic content)
      await expect
        .poll(
          async () => {
            const count = await reportDatasetPanel.getObjectInReportTab('New Metric').count();
            return count > 0;
          },
          { timeout: 15000, message: 'New Metric should appear in report tab' }
        )
        .toBe(true);
      await expect(reportDatasetPanel.getObjectInReportTab('New Metric')).toBeVisible();

      const objInDropzone = reportEditorPanel.getObjectInDropzone('Metrics', 'metric', 'New Metric');
      await expect(objInDropzone).toBeVisible();

      expect(await reportGridView.getGridCellTextByPos(0, 0), 'Grid (0,0)').toBe('Year');
      // Grid column for New Metric may vary; use resilient match
      const newMetricCell = await reportGridView.getGridCellTextByPos(0, 4);
      expect(newMetricCell, 'Grid (0,4) New Metric').toMatch(/New Metric/i);

      await reportEditorPanel.openObjectContextMenu('metrics', 'metric', 'New Metric');
      await reportEditorPanel.clickContextMenuItem('Edit...');
      await reportDerivedMetricEditor.switchToFormulaMode();
      await reportDerivedMetricEditor.setMetricName('Test');
      await reportDerivedMetricEditor.saveFormulaMetric();

      await expect(reportDatasetPanel.getObjectInReportTab('Test')).toBeVisible();
      await expect(reportEditorPanel.getObjectInDropzone('Metrics', 'metric', 'Test')).toBeVisible();
    }
  );
});
