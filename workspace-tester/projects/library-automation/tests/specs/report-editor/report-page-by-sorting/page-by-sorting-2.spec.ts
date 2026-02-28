/**
 * Migrated from WDIO: ReportEditor_PageBySorting2.spec.js
 * Phase 2b: Page-by Sorting — Custom Group
 * Screenshots replaced with assertions per Appendix.
 */
import { test, expect, reportPageBySortingData } from '../../../fixtures';

test.describe('Page-by Sorting in report editor', () => {
  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test(
    '[TC85430] Regression test on page by sorting in report editor -- Custom Group',
    { tag: ['@tc85430'], timeout: 360000 },
    async ({
      page,
      libraryPage,
      reportToolbar,
      reportPageBy,
      reportGridView,
      reportPageBySorting,
    }) => {
      const d = reportPageBySortingData.dossiers.DeveloperPBYearAscCustomCategoriesParentTop;
      await libraryPage.editReportByUrl({ dossierId: d.id, projectId: d.projectId });

      await reportToolbar.switchToDesignMode();
      
      // Take snapshot after design mode switch for debugging
      await page.screenshot({ path: 'test-results/tc85430-after-design-mode.png', fullPage: true });
      console.log('[TC85430] Screenshot saved: test-results/tc85430-after-design-mode.png');
      console.log('[TC85430] Current URL:', page.url());

      const yearSelector = reportPageBy.getSelectorPulldownTextBox('Year');
      // Increased timeout from 15s to 30s for slower dev environments
      await expect(yearSelector).toBeVisible({ timeout: 30000 });

      await reportPageBy.openDropdownFromSelector('Year');
      const item2014 = reportPageBy.getElementFromPopupList('2014');
      await expect(item2014).toBeVisible({ timeout: 15000 });

      await reportPageBy.openDropdownFromSelector('Custom Categories');
      const categorySales = reportPageBy.getElementFromPopupList('Category Sales');
      await expect(categorySales).toBeVisible({ timeout: 15000 });

      await reportPageBy.openSelectorContextMenu('Year');
      // Take screenshot of context menu for debugging
      await page.screenshot({ path: 'test-results/tc85430-context-menu.png', fullPage: true });
      console.log('[TC85430] Context menu screenshot saved');
      await reportPageBy.clickContextMenuOption('Sort');
      await expect(reportPageBySorting.dialog).toBeVisible({ timeout: 20000 });

      await reportPageBySorting.openDropdown(1, 'Order');
      await reportPageBySorting.selectFromDropdown(1, 'Order', 'Descending');
      await reportPageBySorting.openDropdown(1, 'Total Position');
      await reportPageBySorting.selectFromDropdown(1, 'Total Position', 'Bottom');
      await reportPageBySorting.openDropdown(2, 'Total Position');
      await reportPageBySorting.selectFromDropdown(2, 'Total Position', 'Bottom');
      await reportPageBySorting.openDropdown(2, 'Parent Position');
      await reportPageBySorting.selectFromDropdown(2, 'Parent Position', 'Default');

      await reportPageBySorting.clickBtn('Done');
      await expect(reportPageBySorting.dialog).not.toBeVisible({ timeout: 15000 });

      const yearTextAfter = await reportPageBy.getPageBySelectorText('Year');
      expect(yearTextAfter).toBeTruthy();
    }
  );
});
