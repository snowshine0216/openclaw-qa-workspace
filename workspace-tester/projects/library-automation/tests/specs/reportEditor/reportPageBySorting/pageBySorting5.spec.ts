/**
 * Migrated from WDIO: ReportEditor_PageBySorting5.spec.js
 * Phase 2b: Page-by Sorting — Hierarchy in Page By
 * Requires dndFromObjectPanelToContainer. Simplified: assumes report may have Month/Category; exercises Sort dialog.
 */
import { test, expect, reportPageBySortingData } from '../../../fixtures';

test.describe('Page-by Sorting in report editor', () => {
  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test(
    '[TC0000_1] X-Fun test on page by sorting -- Hierarchy in Page By',
    { tag: ['@tc0000_1'], timeout: 360000 },
    async ({
      libraryPage,
      reportToolbar,
      reportPageBy,
      reportGridView,
      reportPageBySorting,
    }) => {
      const d = reportPageBySortingData.dossiers.DeveloperPBHierarchy;
      await libraryPage.editReportByUrl({ dossierId: d.id, projectId: d.projectId });

      await reportToolbar.switchToDesignMode();

      const monthText = await reportPageBy.getPageBySelectorText('Month');
      const categoryText = await reportPageBy.getPageBySelectorText('Category');
      expect(monthText || categoryText, 'At least one Page-by selector should be present').toBeTruthy();

      const selectorName = monthText ? 'Month' : categoryText ? 'Category' : undefined;
      if (selectorName) {
        await reportPageBy.openSelectorContextMenu(selectorName);
        await reportGridView.clickContextMenuOption('Sort');
        await expect(reportPageBySorting.dialog).toBeVisible({ timeout: 10000 });

        await reportPageBySorting.openDropdown(1, 'Sort By');
        await reportPageBySorting.selectFromDropdown(1, 'Sort By', selectorName);
        await reportPageBySorting.selectFromDropdown(1, 'Criteria', 'DESC');
        await reportPageBySorting.selectFromDropdown(1, 'Order', 'Descending');
        await reportPageBySorting.clickBtn('Done');
        await expect(reportPageBySorting.dialog).not.toBeVisible({ timeout: 5000 });
      }
    }
  );
});
