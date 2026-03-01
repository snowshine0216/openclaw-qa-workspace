/**
 * Migrated from WDIO: ReportEditor_PageBySorting5.spec.js
 * Phase 2b: Page-by Sorting — Hierarchy in Page By
 * Dossier: DeveloperPBHierarchy (Month/Category). For hierarchies, Criteria may not have DESC; use fallbacks (ID, Description).
 */
import { test, expect, reportPageBySortingData } from '../../../fixtures';

test.describe('Page-by Sorting in report editor', () => {
  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test(
    '[TC0000_1] X-Fun test on page by sorting (Hierarchy in Page By)',
    { tag: ['@tc0000_1'], timeout: 360000 },
    async ({
      libraryPage,
      reportToolbar,
      reportPageBy,
      reportPageBySorting,
    }) => {
      const d = reportPageBySortingData.dossiers.DeveloperPBHierarchy;
      // 1. Edit report by URL (dossier DeveloperPBHierarchy)
      await libraryPage.editReportByUrl({ dossierId: d.id, projectId: d.projectId });

      // 2. Switch to design mode
      await reportToolbar.switchToDesignMode();
      await reportPageBy.waitForPageByArea(30000);

      // 3. Verify at least one Page-by selector (Month or Category) has display text
      const monthText = await reportPageBy.getPageBySelectorText('Month');
      const categoryText = await reportPageBy.getPageBySelectorText('Category');
      expect(monthText || categoryText, 'At least one Page-by selector should be present').toBeTruthy();

      const selectorName = monthText ? 'Month' : 'Category';
      // 4. Open selector context menu → Sort
      await reportPageBy.openSelectorContextMenu(selectorName);
      await reportPageBy.clickContextMenuOption('Sort');
      // 5. Verify Sort dialog is visible
      await expect(reportPageBySorting.dialog).toBeVisible({ timeout: 10000 });

      // 6. Select Sort By: Month/Category (use partial match for hierarchy labels like "Month (Attribute)"), Criteria: DESC (fallbacks for hierarchy), Order: Descending
      await reportPageBySorting.openDropdown(1, 'Sort By');
      await reportPageBySorting.selectFromDropdown(1, 'Sort By', selectorName, ['Month', 'Category'], true);
      await reportPageBySorting.openDropdown(1, 'Criteria');
      await reportPageBySorting.selectFromDropdown(1, 'Criteria', 'DESC', ['ID', 'Description']);
      await reportPageBySorting.openDropdown(1, 'Order');
      await reportPageBySorting.selectFromDropdown(1, 'Order', 'Descending');
      // 7. Click Done
      await reportPageBySorting.clickBtn('Done');
      // 8. Verify Sort dialog closes
      await expect(reportPageBySorting.dialog).not.toBeVisible({ timeout: 5000 });
    }
  );
});
