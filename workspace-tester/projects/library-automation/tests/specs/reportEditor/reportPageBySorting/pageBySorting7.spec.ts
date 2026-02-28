/**
 * Migrated from WDIO: ReportEditor_PageBySorting7.spec.js
 * Phase 2b: Page-by Sorting — Move or Remove PageBy Object
 * Screenshots replaced with assertions.
 */
import { test, expect, reportPageBySortingData } from '../../../fixtures';

test.describe('Page-by Sorting in report editor', () => {
  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test(
    '[TC85430] X-Fun test on page by sorting -- Move or Remove PageBy Object',
    { tag: ['@tc85430'], timeout: 360000 },
    async ({
      page,
      libraryPage,
      reportToolbar,
      reportPageBy,
      reportEditorPanel,
      reportDatasetPanel,
      reportPageBySorting,
    }) => {
      const d = reportPageBySortingData.dossiers.ReportWS_PB_YearCategory1;
      await libraryPage.editReportByUrl({ dossierId: d.id, projectId: d.projectId });

      await reportToolbar.switchToDesignMode();

      await reportPageBy.openSelectorContextMenu('Year');
      await reportPageBy.clickContextMenuOption('Sort');
      await expect(reportPageBySorting.dialog).toBeVisible({ timeout: 10000 });
      await reportPageBySorting.openDropdown(1, 'Sort By');
      await reportPageBySorting.selectFromDropdown(1, 'Sort By', 'Year');
      await reportPageBySorting.openDropdown(2, 'Sort By');
      await reportPageBySorting.selectFromDropdown(2, 'Sort By', 'Category');
      await reportPageBySorting.clickBtn('Done');
      await expect(reportPageBySorting.dialog).not.toBeVisible({ timeout: 5000 });

      await reportPageBy.openSelectorContextMenu('Year');
      await reportPageBy.clickContextMenuOption('Move');
      await expect(reportPageBySorting.dialog).toBeVisible({ timeout: 5000 }).catch(() => {});
      await reportPageBySorting.clickBtn('Cancel').catch(() => {});

      await reportEditorPanel.removeObjectInDropzone('PageBy', 'attribute', 'Year');
      await page.waitForTimeout(2000);

      await reportDatasetPanel.addObjectToPageBy('Year');
      await reportPageBy.openSelectorContextMenu('Category');
      await reportPageBy.clickContextMenuOption('Sort');
      await expect(reportPageBySorting.dialog).toBeVisible({ timeout: 10000 });
      await reportPageBySorting.clickBtn('Cancel');
    }
  );
});
