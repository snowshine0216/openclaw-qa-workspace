/**
 * Migrated from WDIO: ReportEditor_PageBySorting6.spec.js
 * Phase 2b: Page-by Sorting — Quick Sorting (Sort Ascending/Descending from context menu)
 * spec: specs/report-editor/report-page-by-sorting/page-by-sorting-6.md
 * seed: tests/seed.spec.ts
 */
import { test, expect, reportPageBySortingData } from '../../../fixtures';

test.describe('Page-by Sorting — Quick Sorting (Workstation)', () => {
  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test(
    '[TC85430] X-Fun test on page by sorting (Quick Sorting)',
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
      // 1. Edit report by URL (dossier ReportWS_PB_YearCategory1)
      await libraryPage.editReportByUrl({ dossierId: d.id, projectId: d.projectId });

      // 2. Switch to design mode
      await reportToolbar.switchToDesignMode();
      await reportPageBy.waitForPageByArea(30000);

      // 3. Open Year context menu → Sort
      await reportPageBy.openSelectorContextMenu('Year');
      await reportPageBy.clickContextMenuOption('Sort');
      // 4. Verify Sort dialog visible, click Cancel
      await expect(reportPageBySorting.dialog).toBeVisible({ timeout: 10000 });
      await reportPageBySorting.clickBtn('Cancel');
      // 5. Verify Sort dialog closes
      await expect(reportPageBySorting.dialog).not.toBeVisible({ timeout: 5000 });

      // 6. Open Page By → Year context menu → Sort Descending
      await reportEditorPanel.openObjectContextMenu('PageBy', 'attribute', 'Year');
      await reportDatasetPanel.clickObjectContextMenuItem('Sort Descending');
      // 7. Wait 2s, verify Year text is present
      await page.waitForTimeout(2000);
      const yearTextDesc = await reportPageBy.getPageBySelectorText('Year');
      expect(yearTextDesc).toBeTruthy();

      // 8. Open Year context menu → Sort, click Cancel
      await reportPageBy.openSelectorContextMenu('Year');
      await reportPageBy.clickContextMenuOption('Sort');
      await expect(reportPageBySorting.dialog).toBeVisible({ timeout: 10000 });
      await reportPageBySorting.clickBtn('Cancel');

      // 9. Open Page By → Year context menu → Sort Ascending
      await reportEditorPanel.openObjectContextMenu('PageBy', 'attribute', 'Year');
      await reportDatasetPanel.clickObjectContextMenuItem('Sort Ascending');
      // 10. Wait 2s, verify Year text is present
      await page.waitForTimeout(2000);
      const yearTextAsc = await reportPageBy.getPageBySelectorText('Year');
      expect(yearTextAsc).toBeTruthy();
    }
  );
});
