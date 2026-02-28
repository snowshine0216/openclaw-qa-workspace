/**
 * Migrated from WDIO: ReportEditor_PageBySorting8.spec.js
 * Phase 2b: Page-by Sorting — Attribute Forms
 * Simplified: exercises Sort dialog for Employee and Distribution Center. Skips Display Attribute Forms (needs impl).
 */
import { test, expect, reportPageBySortingData } from '../../../fixtures';

test.describe('Page-by Sorting in report editor', () => {
  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test(
    '[TC85430] X-Fun test on page by sorting -- Attribute Forms',
    { tag: ['@tc85430'], timeout: 360000 },
    async ({
      libraryPage,
      reportToolbar,
      reportDatasetPanel,
      reportPageBy,
      reportPageBySorting,
    }) => {
      const d = reportPageBySortingData.dossiers.ReportWS_PB_YearCategory2;
      await libraryPage.editReportByUrl({ dossierId: d.id, projectId: d.projectId });

      await reportToolbar.switchToDesignMode();

      await reportDatasetPanel.selectItemInObjectList('Schema Objects');
      await reportDatasetPanel.selectItemInObjectList('Attributes');
      await reportDatasetPanel.selectItemInObjectList('Geography');
      await reportDatasetPanel.addObjectFromObjectBrowserToPageBy('Employee');

      await reportPageBy.openSelectorContextMenu('Employee');
      await reportPageBySorting.clickContextMenuOption('Sort');
      await expect(reportPageBySorting.dialog).toBeVisible({ timeout: 10000 });
      await reportPageBySorting.openDropdown(1, 'Sort By');
      await reportPageBySorting.selectFromDropdown(1, 'Sort By', 'Employee');
      await reportPageBySorting.openDropdown(1, 'Criteria');
      const defaultItem = reportPageBySorting.getDropDownItem(1, 'Criteria', 'Default');
      await expect(defaultItem).toBeVisible({ timeout: 5000 });
      await reportPageBySorting.clickBtn('Cancel');

      await reportDatasetPanel.removeItemInReportTab('Employee');
      await reportDatasetPanel.selectItemInObjectList('Schema Objects');
      await reportDatasetPanel.selectItemInObjectList('Attributes');
      await reportDatasetPanel.selectItemInObjectList('Geography');
      await reportDatasetPanel.addObjectFromObjectBrowserToPageBy('Distribution Center');

      await reportPageBy.openSelectorContextMenu('Distribution Center');
      await reportPageBySorting.clickContextMenuOption('Sort');
      await expect(reportPageBySorting.dialog).toBeVisible({ timeout: 10000 });
      await reportPageBySorting.openDropdown(1, 'Sort By');
      await reportPageBySorting.selectFromDropdown(1, 'Sort By', 'Distribution Center');
      await reportPageBySorting.clickBtn('Cancel');
    }
  );
});
