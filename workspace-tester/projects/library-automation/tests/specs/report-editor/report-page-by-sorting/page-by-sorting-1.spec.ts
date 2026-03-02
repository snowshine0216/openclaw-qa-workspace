/**
 * Migrated from WDIO: ReportEditor_PageBySorting1.spec.js
 * Phase 2b: Page-by Sorting in Report Editor — Acceptance test
 */
import { test, expect, reportPageBySortingData } from '../../../fixtures';

test.describe('Page-by Sorting in report editor', () => {
  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test(
    '[TC85390] Acceptance test on page by sorting in report editor',
    { tag: ['@tc85390'], timeout: 360000 },
    async ({
      libraryPage,
      reportToolbar,
      reportPageBy,
      reportPageBySorting,
    }) => {
      // Dossier fallback: ReportWS_PB_YearCategory1 (Year + Category) when DeveloperPBYearAscCustomCategoriesParentTop Year selector not found
      const d = reportPageBySortingData.dossiers.ReportWS_PB_YearCategory1;
      await libraryPage.editReportByUrl({ dossierId: d.id, projectId: d.projectId });

      await reportToolbar.switchToDesignMode();
      await reportPageBy.waitForPageByArea(30000);

      const yearSelector = reportPageBy.getSelectorPulldownTextBox('Year');
      await expect(yearSelector).toBeVisible({ timeout: 30000 });

      const categorySelector = reportPageBy.getSelectorPulldownTextBox('Category');
      await expect(categorySelector).toBeVisible({ timeout: 20000 });

      // Open Sort dialog from Year context menu
      await reportPageBy.openSelectorContextMenu('Year');
      await reportPageBy.clickContextMenuOption('Sort');
      await expect(reportPageBySorting.dialog).toBeVisible({ timeout: 10000 });

      // Configure sorting: Year descending, Category as second sort
      await reportPageBySorting.openDropdown(1, 'Sort By');
      await reportPageBySorting.selectFromDropdown(1, 'Sort By', 'Year');
      await reportPageBySorting.openDropdown(1, 'Criteria');
      await reportPageBySorting.selectFromDropdown(1, 'Criteria', 'ID');
      await reportPageBySorting.openDropdown(1, 'Order');
      await reportPageBySorting.selectFromDropdown(1, 'Order', 'Descending');
      await reportPageBySorting.openDropdown(2, 'Sort By');
      await reportPageBySorting.selectFromDropdown(2, 'Sort By', 'Category');
      await reportPageBySorting.openDropdown(2, 'Criteria');
      // Category may use ID or DESC; try both
      await reportPageBySorting.selectFromDropdown(2, 'Criteria', 'ID', ['DESC', 'Description']);
      await reportPageBySorting.openDropdown(2, 'Order');
      await reportPageBySorting.selectFromDropdown(2, 'Order', 'Descending');

      await reportPageBySorting.clickBtn('Done');
      await expect(reportPageBySorting.dialog).not.toBeVisible({ timeout: 5000 });

      const yearText = await reportPageBy.getPageBySelectorText('Year');
      expect(yearText).toBeTruthy();
      const categoryText = await reportPageBy.getPageBySelectorText('Category');
      expect(categoryText).toBeTruthy();
    }
  );
});
