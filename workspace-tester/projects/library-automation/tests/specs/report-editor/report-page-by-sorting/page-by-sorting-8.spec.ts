/**
 * Migrated from WDIO: ReportEditor_PageBySorting8.spec.js
 * Phase 2b: Page-by Sorting — Attribute Forms
 * spec: specs/report-editor/report-page-by-sorting/page-by-sorting-8.md
 * seed: tests/seed.spec.ts
 */
import { test, expect, reportPageBySortingData } from '../../../fixtures';

test.describe('Page-by Sorting — Attribute Forms', () => {
  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test(
    '[TC85430] X-Fun test on page by sorting (Attribute Forms)',
    { tag: ['@tc85430'], timeout: 360000 },
    async ({
      libraryPage,
      reportToolbar,
      reportDatasetPanel,
      reportPageBy,
      reportPageBySorting,
    }) => {
      const d = reportPageBySortingData.dossiers.ReportWS_PB_YearCategory2;
      // 1. Edit report by URL (dossier ReportWS_PB_YearCategory2)
      await libraryPage.editReportByUrl({ dossierId: d.id, projectId: d.projectId });

      // 2. Switch to design mode
      await reportToolbar.switchToDesignMode();
      await reportPageBy.waitForPageByArea(30000);

      // 3. Add Employee to Page By from Object Browser (Geography)
      // Schema Objects may be absent (tc85390); trySelectFirstExisting handles both structures
      const firstLevel = await reportDatasetPanel.trySelectFirstExisting(['Schema Objects', 'Attributes']);
      if (firstLevel === null) throw new Error('Neither Schema Objects nor Attributes found in object browser');
      if (firstLevel === 'Schema Objects') await reportDatasetPanel.selectItemInObjectList('Attributes');
      // Geography: may need scroll in some envs; trySelectFirstExisting for fallback names
      const geo = await reportDatasetPanel.trySelectFirstExisting(['Geography', '01. Geography', 'Locations']);
      if (geo === null) throw new Error('Geography folder not found. Object browser structure may differ.');
      await reportDatasetPanel.addObjectFromObjectBrowserToPageBy('Employee');

      // 4. Open Employee context menu → Sort
      await reportPageBy.openSelectorContextMenu('Employee');
      await reportPageBy.clickContextMenuOption('Sort');
      // 5. Verify Sort dialog visible, select Sort By: Employee
      await expect(reportPageBySorting.dialog).toBeVisible({ timeout: 10000 });
      await reportPageBySorting.openDropdown(1, 'Sort By');
      await reportPageBySorting.selectFromDropdown(1, 'Sort By', 'Employee');
      // 6. Open Criteria dropdown, verify Default item visible
      await reportPageBySorting.openDropdown(1, 'Criteria');
      const defaultItem = reportPageBySorting.getDropDownItem(1, 'Criteria', 'Default');
      await expect(defaultItem).toBeVisible({ timeout: 5000 });
      // 7. Click Cancel
      await reportPageBySorting.clickBtn('Cancel');

      // 8. Remove Employee from report, add Distribution Center to Page By
      await reportDatasetPanel.removeItemInReportTab('Employee');
      const firstLevel2 = await reportDatasetPanel.trySelectFirstExisting(['Schema Objects', 'Attributes']);
      if (firstLevel2 === null) throw new Error('Neither Schema Objects nor Attributes found in object browser');
      if (firstLevel2 === 'Schema Objects') await reportDatasetPanel.selectItemInObjectList('Attributes');
      const geo2 = await reportDatasetPanel.trySelectFirstExisting(['Geography', '01. Geography', 'Locations']);
      if (geo2 === null) throw new Error('Geography folder not found. Object browser structure may differ.');
      await reportDatasetPanel.addObjectFromObjectBrowserToPageBy('Distribution Center');

      // 9. Open Distribution Center context menu → Sort
      await reportPageBy.openSelectorContextMenu('Distribution Center');
      await reportPageBy.clickContextMenuOption('Sort');
      // 10. Verify Sort dialog visible, select Sort By: Distribution Center
      await expect(reportPageBySorting.dialog).toBeVisible({ timeout: 10000 });
      await reportPageBySorting.openDropdown(1, 'Sort By');
      await reportPageBySorting.selectFromDropdown(1, 'Sort By', 'Distribution Center');
      // 11. Click Cancel
      await reportPageBySorting.clickBtn('Cancel');
    }
  );
});
