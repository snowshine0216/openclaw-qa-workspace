/**
 * Migrated from WDIO: ReportEditor_PageBySorting7.spec.js
 * Phase 2b: Page-by Sorting — Move or Remove PageBy Object
 * spec: specs/report-editor/report-page-by-sorting/page-by-sorting-7.md
 * seed: tests/seed.spec.ts
 */
import { test, expect, reportPageBySortingData } from '../../../fixtures';

test.describe('Page-by Sorting — Move or Remove PageBy Object', () => {
  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test(
    '[TC85430] X-Fun test on page by sorting (Move or Remove PageBy Object)',
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
      // 4. Verify Sort dialog visible, configure Year + Category as sort rows
      await expect(reportPageBySorting.dialog).toBeVisible({ timeout: 10000 });
      await reportPageBySorting.openDropdown(1, 'Sort By');
      await reportPageBySorting.selectFromDropdown(1, 'Sort By', 'Year');
      await reportPageBySorting.openDropdown(2, 'Sort By');
      await reportPageBySorting.selectFromDropdown(2, 'Sort By', 'Category');
      // 5. Click Done, verify dialog closes
      await reportPageBySorting.clickBtn('Done');
      await expect(reportPageBySorting.dialog).not.toBeVisible({ timeout: 5000 });

      // 6. Open Year context menu → Move (may show dialog), Cancel
      await reportPageBy.openSelectorContextMenu('Year');
      await reportPageBy.clickContextMenuOption('Move');
      await expect(reportPageBySorting.dialog).toBeVisible({ timeout: 5000 }).catch(() => {});
      await reportPageBySorting.clickBtn('Cancel').catch(() => {});

      // 7. Remove Year from Page By dropzone
      await reportEditorPanel.removeObjectInDropzone('PageBy', 'attribute', 'Year');
      // 8. Wait 2s
      await page.waitForTimeout(2000);

      // 9. Add Year back to Page By from Object Browser
      await reportDatasetPanel.addObjectToPageBy('Year');
      // 10. Open Category context menu → Sort, verify dialog, Cancel
      await reportPageBy.openSelectorContextMenu('Category');
      await reportPageBy.clickContextMenuOption('Sort');
      await expect(reportPageBySorting.dialog).toBeVisible({ timeout: 10000 });
      await reportPageBySorting.clickBtn('Cancel');
    }
  );
});
