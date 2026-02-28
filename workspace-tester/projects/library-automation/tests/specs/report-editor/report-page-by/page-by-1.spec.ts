/**
 * Migrated from WDIO: ReportPageBy1.spec.js
 * Phase 2e: Report Page By - Part 1
 * Simplified first scenario: create report, add objects, switch to design mode.
 */
import { test, expect } from '../../../fixtures';

test.describe('Report Page By - Part 1', () => {
  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test(
    '[TC81156_1] FUN | Report Editor | Editor Panel | Page-by',
    { tag: ['@tc81156_1'], timeout: 360000 },
    async ({
      libraryPage,
      reportDatasetPanel,
      reportToolbar,
      reportPageBy,
    }) => {
      await libraryPage.createNewReportByUrl({});
      await reportDatasetPanel.selectMultipleItemsInObjectList(['Schema Objects', 'Attributes', 'Geography']);
      await reportDatasetPanel.addMultipleObjectsToPageBy(['Region', 'Manager', 'Employee']);
      await reportDatasetPanel.addObjectToColumns('Call Center');
      await reportDatasetPanel.clickFolderUpIcon();
      await reportDatasetPanel.selectItemInObjectList('Products');
      await reportDatasetPanel.addObjectToRows('Category');

      await reportToolbar.switchToDesignMode();

      const regionText = await reportPageBy.getPageBySelectorText('Region');
      expect(regionText, 'Page-by Region should be Central').toBe('Central');

      const managerText = await reportPageBy.getPageBySelectorText('Manager');
      expect(managerText, 'Page-by Manager should be Lewandowski:Allister').toBe('Lewandowski:Allister');
    }
  );
});
