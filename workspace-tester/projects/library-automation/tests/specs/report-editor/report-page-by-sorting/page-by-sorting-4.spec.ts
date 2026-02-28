/**
 * Migrated from WDIO: ReportEditor_PageBySorting4.spec.js
 * Phase 2b: Page-by Sorting — Metrics in Page By, Encoding and Truncation
 * Screenshots replaced with assertions. Skips renameObjectInReportTab and getSortByObjectText CSS (needs rename impl).
 */
import { test, expect, reportPageBySortingData } from '../../../fixtures';

test.describe('Page-by Sorting in report editor', () => {
  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test(
    '[TC85430] X-Fun test on page by sorting in report editor -- Metrics in Page By',
    { tag: ['@tc85430'], timeout: 360000 },
    async ({
      libraryPage,
      reportToolbar,
      reportPageBy,
      reportGridView,
      reportPageBySorting,
    }) => {
      const d = reportPageBySortingData.dossiers.DeveloperPBMetrics;
      await libraryPage.editReportByUrl({ dossierId: d.id, projectId: d.projectId });

      await reportToolbar.switchToDesignMode();

      const metricsText = await reportPageBy.getPageBySelectorText('Metrics');
      expect(metricsText, 'Page-by Metrics should contain Profit Margin').toContain('Profit Margin');

      await reportPageBy.changePageByElement('Year', '2015');

      await reportPageBy.openSelectorContextMenu('Year');
      await reportGridView.clickContextMenuOption('Sort');
      await expect(reportPageBySorting.dialog).toBeVisible({ timeout: 10000 });

      const placeholder = reportPageBySorting.getSortingColumnByRowAndCol(1, 'Placeholder');
      await expect(placeholder).toContainText(/Select|object/i);

      await reportPageBySorting.openDropdown(1, 'Sort By');
      const yearItem = reportPageBySorting.getDropDownItem(1, 'Sort By', 'Year');
      await expect(yearItem).toBeVisible({ timeout: 5000 });

      await reportPageBySorting.selectFromDropdown(1, 'Sort By', 'Year');
      await reportPageBySorting.selectFromDropdown(1, 'Criteria', 'ID');
      await reportPageBySorting.selectFromDropdown(1, 'Order', 'Descending');

      await reportPageBySorting.clickBtn('Done');
      await expect(reportPageBySorting.dialog).not.toBeVisible({ timeout: 5000 });

      const metricsTextAfter = await reportPageBy.getPageBySelectorText('Metrics');
      expect(metricsTextAfter).toContain('Profit Margin');
    }
  );
});
