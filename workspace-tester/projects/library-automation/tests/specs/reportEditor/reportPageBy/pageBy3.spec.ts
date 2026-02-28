/**
 * Migrated from WDIO: ReportPageBy3.spec.js
 * Phase 2e: Report Page By - Part 3 (Show Totals)
 */
import { test, expect } from '../../../fixtures';
import { reportPageByData } from '../../../test-data/reportPageBy';

test.describe('Report Page By - Part 3', () => {
  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test(
    '[TC81156_6] FUN | Page by with show totals',
    { tag: ['@tc81156_6'], timeout: 360000 },
    async ({ libraryPage, reportGridView, reportPageBy }) => {
      const d = reportPageByData.dossiers.PageByMultiplePBShowTotal;
      await libraryPage.openReportByUrl({
        projectId: d.projectId,
        documentId: d.id,
      });

      await reportPageBy.changePageByElement('Category', 'Total');
      // Wait for report to refresh and Subcategory selector to update (data load delay)
      await expect
        .poll(
          async () => await reportPageBy.getPageBySelectorText('Subcategory'),
          { timeout: 15000 }
        )
        .toBe('Art & Architecture');

      await reportPageBy.changePageByElement('Subcategory', 'Business');

      const cell10 = await reportGridView.getGridCellTextByPos(1, 0);
      expect(cell10, 'Grid cell (1,0) should be Working With Emotional Intelligence').toBe(
        'Working With Emotional Intelligence'
      );

      const cell11 = await reportGridView.getGridCellTextByPos(1, 1);
      expect(cell11, 'Grid cell (1,1) should be $20,819').toBe('$20,819');

      const cell21 = await reportGridView.getGridCellTextByPos(2, 1);
      expect(cell21, 'Grid cell (2,1) should be $5,914').toBe('$5,914');
    }
  );
});
