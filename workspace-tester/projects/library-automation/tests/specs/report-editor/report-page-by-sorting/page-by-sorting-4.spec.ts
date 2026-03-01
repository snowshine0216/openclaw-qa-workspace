/**
 * Migrated from WDIO: ReportEditor_PageBySorting4.spec.js
 * Phase 2b: Page-by Sorting — Metrics in Page By (TC85430)
 * Dossier: DeveloperPBMetrics. Verifies Metrics contains Profit Margin before/after sort.
 */
import { test, expect, reportPageBySortingData } from '../../../fixtures';

test.describe('Page-by Sorting in report editor', () => {
  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test(
    '[TC85430] X-Fun test on page by sorting (Metrics in Page By)',
    { tag: ['@tc85430'], timeout: 360000 },
    async ({
      page,
      libraryPage,
      reportToolbar,
      reportPageBy,
      reportPageBySorting,
    }) => {
      const d = reportPageBySortingData.dossiers.DeveloperPBMetrics;
      await libraryPage.editReportByUrl({ dossierId: d.id, projectId: d.projectId });

      await reportToolbar.switchToDesignMode();
      await reportPageBy.waitForPageByArea(30000);

      // 3. Verify Metrics text contains "Profit Margin"
      const metricsText = await reportPageBy.getPageBySelectorText('Metrics');
      expect(metricsText, 'Page-by Metrics should contain Profit Margin').toContain('Profit Margin');

      // 4. Open Year dropdown and verify it is visible before selecting 2015
      await reportPageBy.openDropdownFromSelector('Year');
      await expect(reportPageBy.getVisiblePopupListLocator()).toBeVisible({ timeout: 10000 });
      await reportPageBy.changePageByElement('Year', '2015');

      // 5. Open Year context menu → Sort
      await reportPageBy.openSelectorContextMenu('Year');
      await page.waitForTimeout(1500);
      await reportPageBy.clickContextMenuOption('Sort');
      await expect(reportPageBySorting.dialog).toBeVisible({ timeout: 10000 });

      // 7. Verify Placeholder column contains "Select" or "object"
      const placeholder = reportPageBySorting.getSortingColumnByRowAndCol(1, 'Placeholder');
      await expect(placeholder).toContainText(/Select|object/i);

      // 8. Open Sort By dropdown, select Year
      await reportPageBySorting.openDropdown(1, 'Sort By');
      await reportPageBySorting.selectFromDropdown(1, 'Sort By', 'Year');
      // 9. Select Criteria: ID, Order: Descending (fallbacks for different dossier types)
      await reportPageBySorting.openDropdown(1, 'Criteria');
      await reportPageBySorting.selectFromDropdown(1, 'Criteria', 'ID', ['DESC', 'Description']);
      await reportPageBySorting.openDropdown(1, 'Order');
      await reportPageBySorting.selectFromDropdown(1, 'Order', 'Descending');

      // 10. Click Done
      await reportPageBySorting.clickBtn('Done');
      // 11. Verify Sort dialog closes
      await expect(reportPageBySorting.dialog).not.toBeVisible({ timeout: 5000 });

      // 12. Verify Metrics text still contains "Profit Margin"
      const metricsTextAfter = await reportPageBy.getPageBySelectorText('Metrics');
      expect(metricsTextAfter).toContain('Profit Margin');
    }
  );
});
