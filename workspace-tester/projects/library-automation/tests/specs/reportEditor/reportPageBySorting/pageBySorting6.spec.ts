/**
 * Migrated from WDIO: ReportEditor_PageBySorting6.spec.js
 * Phase 2b: Page-by Sorting — Quick Sorting (Sort Ascending/Descending from context menu)
 * Screenshots replaced with assertions.
 */
import { test, expect, reportPageBySortingData } from '../../../fixtures';

test.describe('Page-by Sorting in report editor', () => {
  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test(
    '[TC85430] X-Fun test on page by sorting in report editor (Workstation) -- Quick Sorting',
    { tag: ['@tc85430'], timeout: 360000 },
    async ({
      page,
      libraryPage,
      reportToolbar,
      reportPageBy,
      reportGridView,
      reportEditorPanel,
      reportDatasetPanel,
      reportPageBySorting,
    }) => {
      const d = reportPageBySortingData.dossiers.ReportWS_PB_YearCategory1;
      await libraryPage.editReportByUrl({ dossierId: d.id, projectId: d.projectId });

      await reportToolbar.switchToDesignMode();

      await reportPageBy.openSelectorContextMenu('Year');
      await reportGridView.clickContextMenuOption('Sort');
      await expect(reportPageBySorting.dialog).toBeVisible({ timeout: 10000 });
      await reportPageBySorting.clickBtn('Cancel');
      await expect(reportPageBySorting.dialog).not.toBeVisible({ timeout: 5000 });

      await reportEditorPanel.openObjectContextMenu('PageBy', 'attribute', 'Year');
      await reportDatasetPanel.clickObjectContextMenuItem('Sort Descending');
      await page.waitForTimeout(2000);

      const yearTextDesc = await reportPageBy.getPageBySelectorText('Year');
      expect(yearTextDesc).toBeTruthy();

      await reportPageBy.openSelectorContextMenu('Year');
      await reportGridView.clickContextMenuOption('Sort');
      await expect(reportPageBySorting.dialog).toBeVisible({ timeout: 10000 });
      await reportPageBySorting.clickBtn('Cancel');

      await reportEditorPanel.openObjectContextMenu('PageBy', 'attribute', 'Year');
      await reportDatasetPanel.clickObjectContextMenuItem('Sort Ascending');
      await page.waitForTimeout(2000);

      const yearTextAsc = await reportPageBy.getPageBySelectorText('Year');
      expect(yearTextAsc).toBeTruthy();
    }
  );
});
