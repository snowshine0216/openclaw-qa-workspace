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
      const addToPageByWithFallback = async (name: string): Promise<void> => {
        try {
          await reportDatasetPanel.addObjectToPageBy(name);
          return;
        } catch {
          const added =
            (await reportDatasetPanel.tryAddObjectToPageBy([name])) ||
            (await reportDatasetPanel.trySearchAndAddObjectToPageBy([name]));
          if (!added) {
            throw new Error(`Failed to add "${name}" to Page-by from Object Browser.`);
          }
        }
      };

      await libraryPage.createNewReportByUrl({});
      const selectedRoot = await reportDatasetPanel.trySelectFirstExisting(['Schema Objects', 'Public Objects']);
      if (selectedRoot) {
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Attributes', 'Geography']);
      } else {
        console.log('[page-by-1] Schema/Public Objects root not visible; using direct object lookup fallback.');
      }
      await addToPageByWithFallback('Region');
      await addToPageByWithFallback('Manager');
      await addToPageByWithFallback('Employee');
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
