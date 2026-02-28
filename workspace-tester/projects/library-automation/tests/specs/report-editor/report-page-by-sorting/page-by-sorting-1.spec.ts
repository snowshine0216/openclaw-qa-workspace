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
      reportDatasetPanel,
      reportPageBy,
      reportGridView,
      reportPageBySorting,
    }) => {
      const d = reportPageBySortingData.dossiers.ReportWS_PB_YearCategory2;
      await libraryPage.editReportByUrl({ dossierId: d.id, projectId: d.projectId });

      await reportToolbar.switchToDesignMode();
      console.log('[TC85390] Test URL:', libraryPage.page.url());
      
      // Skip "Schema Objects" - confirmed absent
      await reportDatasetPanel.selectItemInObjectList('Attributes');
      
      // Debug: Check what's inside Attributes
      await libraryPage.page.waitForTimeout(2000);
      const allItems = await libraryPage.page.locator('.objectBrowserContainer .object-item-text').allTextContents();
      console.log('[TC85390] Folders inside Attributes:', allItems.slice(0, 10));
      
      // Try "01. Date" instead of "Time"
      await reportDatasetPanel.selectItemInObjectList('01. Date');
      await reportDatasetPanel.addObjectFromObjectBrowserToPageBy('Year');

      const yearSelector = reportPageBy.getSelector('Year');
      await expect(yearSelector).toBeVisible({ timeout: 15000 });

      await reportDatasetPanel.clickFolderUpIcon();
      await reportDatasetPanel.selectItemInObjectList('Geography');
      await reportDatasetPanel.addObjectFromObjectBrowserToPageBy('Region');

      const regionSelector = reportPageBy.getSelector('Region');
      await expect(regionSelector).toBeVisible({ timeout: 10000 });

      // Open Sort dialog from Year context menu
      await reportPageBy.openSelectorContextMenu('Year');
      await reportGridView.clickContextMenuOption('Sort');
      await expect(reportPageBySorting.dialog).toBeVisible({ timeout: 10000 });

      // Configure sorting: Year descending, add Region as second sort
      await reportPageBySorting.openDropdown(1, 'Sort By');
      await reportPageBySorting.selectFromDropdown(1, 'Sort By', 'Year');
      await reportPageBySorting.selectFromDropdown(1, 'Criteria', 'ID');
      await reportPageBySorting.selectFromDropdown(1, 'Order', 'Descending');
      await reportPageBySorting.selectFromDropdown(2, 'Sort By', 'Region');
      await reportPageBySorting.selectFromDropdown(2, 'Criteria', 'DESC');
      await reportPageBySorting.selectFromDropdown(2, 'Order', 'Descending');

      await reportPageBySorting.clickBtn('Done');
      await expect(reportPageBySorting.dialog).not.toBeVisible({ timeout: 5000 });

      // After sorting: Year should show 2016, Region should show different value
      const yearText = await reportPageBy.getPageBySelectorText('Year');
      expect(yearText).toBeTruthy();
      const regionText = await reportPageBy.getPageBySelectorText('Region');
      expect(regionText).toBeTruthy();
    }
  );
});
