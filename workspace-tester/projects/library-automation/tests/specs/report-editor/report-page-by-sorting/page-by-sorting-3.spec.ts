/**
 * Migrated from WDIO: ReportEditor_PageBySorting3.spec.js
 * Phase 2b: Page-by Sorting — Consolidation
 * No screenshot replacements (WDIO used since/expect assertions).
 */
import { test, expect, reportPageBySortingData } from '../../../fixtures';

test.describe('Page-by Sorting in report editor', () => {
  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test(
    '[TC85430] Regression test on page by sorting in report editor -- Consolidation',
    { tag: ['@tc85430'], timeout: 360000 },
    async ({
      libraryPage,
      reportToolbar,
      reportPageBy,
      reportPageBySorting,
    }) => {
      const d = reportPageBySortingData.dossiers.DeveloperPBConsolidationSubcategory;
      await libraryPage.editReportByUrl({ dossierId: d.id, projectId: d.projectId });

      await reportToolbar.switchToDesignMode();

      const seasonsText = await reportPageBy.getPageBySelectorText('Seasons');
      expect(seasonsText, 'Page-by Seasons should contain Winter').toContain('Winter');

      await reportPageBy.openSelectorContextMenu('Seasons');
      await reportPageBy.clickContextMenuOption('Sort');
      await reportPageBySorting.openDropdown(1, 'Sort By');
      await reportPageBySorting.selectFromDropdown(1, 'Sort By', 'Seasons');
      const sortBySeasons = reportPageBySorting.getCurrentSelectionOnSortingColumnByRowAndCol(1, 'Sort By', 'Seasons');
      await expect(sortBySeasons).toBeVisible({ timeout: 10000 });

      await reportPageBySorting.clickBtn('Done');
      await reportPageBy.openDropdownFromSelector('Seasons');
      const winterItem = reportPageBy.getElementFromPopupList('Winter');
      await expect(winterItem).toBeVisible();

      await reportPageBy.openSelectorContextMenu('Seasons');
      await reportPageBy.clickContextMenuOption('Sort');
      await reportPageBySorting.openDropdown(1, 'Order');
      await reportPageBySorting.selectFromDropdown(1, 'Order', 'Descending');
      const orderDesc = reportPageBySorting.getCurrentSelectionOnSortingColumnByRowAndCol(1, 'Order', 'Descending');
      await expect(orderDesc).toBeVisible({ timeout: 10000 });

      await reportPageBySorting.clickBtn('Done');
      await reportPageBy.openDropdownFromSelector('Seasons');
      const fallItem = reportPageBy.getElementFromPopupList('Fall');
      await expect(fallItem).toBeVisible();
    }
  );
});
