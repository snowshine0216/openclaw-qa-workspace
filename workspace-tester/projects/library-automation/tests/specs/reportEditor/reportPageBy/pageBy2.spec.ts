/**
 * Migrated from WDIO: ReportPageBy2.spec.js
 * Phase 2e: Report Page By - Part 2 (Other Context Menus) — TC85476
 */
import { test, expect } from '../../../fixtures';
import { reportPageByData } from '../../../test-data/reportPageBy';

test.describe('Report Page By - Part 2', () => {
  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test(
    '[TC85476] FUN | Report Editor | Page-by | Other Context Menus',
    { tag: ['@tc85476'], timeout: 360000 },
    async ({
      libraryPage,
      reportToolbar,
      reportDatasetPanel,
      reportGridView,
      reportPageBy,
      reportEditorPanel,
    }) => {
      const d = reportPageByData.dossiers.ReportPageByContextMenu;
      await libraryPage.editReportByUrl({ dossierId: d.id, projectId: d.projectId });
      await reportToolbar.switchToDesignMode();

      // Grid headers after switch to design mode
      expect(await reportGridView.getGridCellTextByPos(0, 0), 'Grid (0,0)').toBe('Year');
      expect(await reportGridView.getGridCellTextByPos(0, 1), 'Grid (0,1)').toBe('Region');
      expect(await reportGridView.getGridCellTextByPos(0, 2), 'Grid (0,2)').toBe('Category');
      expect(await reportGridView.getGridCellTextByPos(0, 3), 'Grid (0,3)').toBe('Cost');

      // Add Subcategory to Page-by
      await reportDatasetPanel.addObjectToPageBy('Subcategory');
      expect(await reportPageBy.getPageBySelectorText('Subcategory'), 'Subcategory selector').toBe('Art & Architecture');
      expect(await reportGridView.getGridCellTextByPos(0, 0), 'Grid (0,0) after add').toBe('Year');
      expect(await reportGridView.getGridCellTextByPos(1, 3), 'Grid (1,3)').toBe('$13,497');
      expect(await reportGridView.getGridCellTextByPos(18, 3), 'Grid (18,3)').toBe('$19,235');

      // Change Subcategory to Cameras
      await reportPageBy.changePageByElement('Subcategory', 'Cameras');
      expect(await reportPageBy.getPageBySelectorText('Subcategory'), 'Subcategory after change').toBe('Cameras');
      expect(await reportGridView.getGridCellTextByPos(1, 2), 'Grid (1,2) Cameras').toBe('Electronics');
      expect(await reportGridView.getGridCellTextByPos(1, 3), 'Grid (1,3) Cameras').toBe('$153,794');
      expect(await reportGridView.getGridCellTextByPos(18, 3), 'Grid (18,3) Cameras').toBe('$208,242');

      // Context menu: Move, Add Attributes, Sort, Drill
      await reportPageBy.openSelectorContextMenu('Subcategory');
      expect(await reportEditorPanel.contextMenuContainsOption('Move'), 'Move option').toBe(true);
      expect(await reportEditorPanel.contextMenuContainsOption('Add Attributes'), 'Add Attributes option').toBe(true);
      expect(await reportEditorPanel.contextMenuContainsOption('Sort'), 'Sort option').toBe(true);
      const drillOpt = reportGridView.getContextMenuOption('Drill');
      expect(await drillOpt.isVisible(), 'Drill option').toBe(true);

      // Add Attributes Before -> Country
      await reportGridView.clickContextMenuOption('Add Attributes');
      await reportGridView.clickContextMenuOption('Before');
      await reportPageBy.clickChecklistElementInContextMenu('Country');
      const countryChecked = await reportPageBy.getSelectedChecklistElementInContextMenu('Country').isDisplayed();
      expect(countryChecked, 'Country checkbox checked').toBe(true);
      await reportPageBy.saveAndCloseContextMenu();

      // Country dropdown: USA, Web
      await reportPageBy.openDropdownFromSelector('Country');
      expect(await reportPageBy.getElementFromPopupList('USA').isVisible(), 'USA in dropdown').toBe(true);
      expect(await reportPageBy.getElementFromPopupList('Web').isVisible(), 'Web in dropdown').toBe(true);

      // Select USA
      await reportPageBy.changePageByElement('Country', 'USA');
      expect(await reportGridView.getGridCellTextByPos(0, 0), 'Grid (0,0) USA').toBe('Year');
      expect(await reportGridView.getGridCellTextByPos(1, 1), 'Grid (1,1) USA').toBe('Central');
      expect(await reportGridView.getGridCellTextByPos(16, 3), 'Grid (16,3) USA').toBe('$208,242');

      // Add Attributes After -> Call Center
      await reportPageBy.openSelectorContextMenu('Country');
      await reportGridView.clickContextMenuOption('Add Attributes');
      await reportGridView.clickContextMenuOption('After');
      await reportPageBy.clickChecklistElementInContextMenu('Call Center');
      const callCenterChecked = await reportPageBy.getSelectedChecklistElementInContextMenu('Call Center').isDisplayed();
      expect(callCenterChecked, 'Call Center checkbox checked').toBe(true);
      await reportPageBy.saveAndCloseContextMenu();

      expect(await reportPageBy.getPageBySelectorText('Call Center'), 'Call Center selector').toBe('Atlanta');
      expect(await reportGridView.getGridCellTextByPos(1, 1), 'Grid (1,1) Atlanta').toBe('Southeast');
      expect(await reportGridView.getGridCellTextByPos(1, 3), 'Grid (1,3) Atlanta').toBe('$26,830');
      expect(await reportGridView.getGridCellTextByPos(3, 3), 'Grid (3,3) Atlanta').toBe('$41,619');

      // Move Cost to Page-by from grid
      await reportGridView.openGridColumnHeaderContextMenu('Cost');
      await reportGridView.clickContextMenuOption('Move');
      await reportGridView.clickContextMenuOption('To Page-by');

      expect(await reportPageBy.getPageBySelectorText('Metrics'), 'Metrics selector').toBe('Cost');
      expect(await reportPageBy.getPageBySelectorText('Country'), 'Country after move').toBe('USA');
      expect(await reportPageBy.getPageBySelectorText('Call Center'), 'Call Center after move').toBe('Atlanta');
      expect(await reportPageBy.getPageBySelectorText('Subcategory'), 'Subcategory after move').toBe('Cameras');

      // Add Profit to Page-by
      await reportDatasetPanel.addObjectToPageBy('Profit');
      await reportPageBy.openDropdownFromSelector('Metrics');
      expect(await reportPageBy.getElementFromPopupList('Cost').isVisible(), 'Cost in Metrics dropdown').toBe(true);
      expect(await reportPageBy.getElementFromPopupList('Profit').isVisible(), 'Profit in Metrics dropdown').toBe(true);

      // Selector indices
      expect(await reportPageBy.getSelectorByIdx(1).getText(), 'Selector idx 1').toBe('Country');
      expect(await reportPageBy.getSelectorByIdx(2).getText(), 'Selector idx 2').toBe('Call Center');
      expect(await reportPageBy.getSelectorByIdx(3).getText(), 'Selector idx 3').toBe('Subcategory');
      expect(await reportPageBy.getSelectorByIdx(4).getText(), 'Selector idx 4').toBe('Metrics');

      // Show Metrics: uncheck Cost
      await reportPageBy.openSelectorContextMenu('Metrics');
      await reportGridView.clickContextMenuOption('Show Metrics');
      await reportPageBy.clickChecklistElementInContextMenu('Cost');
      const costCheckedAfter = await reportPageBy.getSelectedChecklistElementInContextMenu('Cost').isDisplayed();
      expect(costCheckedAfter, 'Cost checkbox unchecked').toBe(false);
      await reportPageBy.saveAndCloseContextMenu();

      // Show Metrics: check Revenue
      await reportPageBy.openSelectorContextMenu('Metrics');
      await reportGridView.clickContextMenuOption('Show Metrics');
      await reportPageBy.clickChecklistElementInContextMenu('Revenue');
      const revenueChecked = await reportPageBy.getSelectedChecklistElementInContextMenu('Revenue').isDisplayed();
      expect(revenueChecked, 'Revenue checkbox checked').toBe(true);
      await reportPageBy.saveAndCloseContextMenu();

      expect(await reportPageBy.getPageBySelectorText('Metrics'), 'Metrics after Show Metrics').toBe('Profit');
      await reportPageBy.openDropdownFromSelector('Metrics');
      expect(await reportPageBy.getElementFromPopupList('Profit').isVisible(), 'Profit in dropdown').toBe(true);
      expect(await reportPageBy.getElementFromPopupList('Revenue').isVisible(), 'Revenue in dropdown').toBe(true);

      expect(await reportGridView.getGridCellTextByPos(0, 3), 'Grid (0,3) Profit').toBe('Profit');
      expect(await reportGridView.getGridCellTextByPos(1, 3), 'Grid (1,3) Profit').toBe('$5,450');
      expect(await reportGridView.getGridCellTextByPos(3, 3), 'Grid (3,3) Profit').toBe('$9,317');

      // Change Call Center to San Diego, Metrics to Revenue
      await reportPageBy.changePageByElement('Call Center', 'San Diego');
      await reportPageBy.changePageByElement('Metrics', 'Revenue');
      expect(await reportGridView.getGridCellTextByPos(0, 3), 'Grid (0,3) Revenue').toBe('Revenue');
      expect(await reportGridView.getGridCellTextByPos(1, 1), 'Grid (1,1) San Diego').toBe('Southwest');
      expect(await reportGridView.getGridCellTextByPos(1, 3), 'Grid (1,3) San Diego Revenue').toBe('$105,990');
      expect(await reportGridView.getGridCellTextByPos(3, 3), 'Grid (3,3) San Diego Revenue').toBe('$163,977');

      // Move Subcategory Left (first time)
      await reportPageBy.openSelectorContextMenu('Subcategory');
      await reportGridView.clickContextMenuOption('Move');
      await reportGridView.clickContextMenuOption('Left');

      await reportPageBy.openSelectorContextMenu('Subcategory');
      const addAttrDisabled = reportGridView.getDisabledContextMenuOption('Add Attributes');
      expect(await addAttrDisabled.isVisible(), 'Add Attributes disabled').toBe(true);
      await reportGridView.clickContextMenuOption('Move');
      expect(await reportEditorPanel.contextMenuContainsOption('To Rows'), 'To Rows option').toBe(true);
      expect(await reportGridView.getContextMenuOption('To Columns').isVisible(), 'To Columns option').toBe(true);
      expect(await reportGridView.getContextMenuOption('Left').isVisible(), 'Left option').toBe(true);
      expect(await reportGridView.getContextMenuOption('Right').isVisible(), 'Right option').toBe(true);
      expect(await reportPageBy.getSelectorByIdx(1).getText(), 'After first Left').toBe('Country');
      expect(await reportPageBy.getSelectorByIdx(2).getText(), 'Selector 2').toBe('Subcategory');
      expect(await reportPageBy.getSelectorByIdx(3).getText(), 'Selector 3').toBe('Call Center');
      expect(await reportPageBy.getSelectorByIdx(4).getText(), 'Selector 4').toBe('Metrics');

      // Move Subcategory Left (second time)
      await reportGridView.clickContextMenuOption('Move');
      await reportGridView.clickContextMenuOption('Left');

      await reportPageBy.openSelectorContextMenu('Subcategory');
      expect(await reportGridView.getDisabledContextMenuOption('Add Attributes').isVisible(), 'Add Attributes disabled 2').toBe(
        true
      );
      await reportGridView.clickContextMenuOption('Move');
      expect(await reportGridView.getContextMenuOption('To Rows').isVisible(), 'To Rows').toBe(true);
      expect(await reportGridView.getContextMenuOption('To Columns').isVisible(), 'To Columns').toBe(true);
      expect(await reportGridView.getContextMenuOption('Left').isVisible(), 'Left visible').toBe(false);
      expect(await reportGridView.getContextMenuOption('Right').isVisible(), 'Right').toBe(true);
      expect(await reportPageBy.getSelectorByIdx(1).getText(), 'Subcategory first').toBe('Subcategory');
      expect(await reportPageBy.getSelectorByIdx(2).getText(), 'Country second').toBe('Country');
      expect(await reportPageBy.getSelectorByIdx(3).getText(), 'Call Center third').toBe('Call Center');
      expect(await reportPageBy.getSelectorByIdx(4).getText(), 'Metrics fourth').toBe('Metrics');

      // Move Metrics Left
      await reportPageBy.openSelectorContextMenu('Metrics');
      await reportGridView.clickContextMenuOption('Move');
      expect(await reportGridView.getContextMenuOption('To Rows').isVisible(), 'Metrics To Rows').toBe(true);
      expect(await reportGridView.getContextMenuOption('To Columns').isVisible(), 'Metrics To Columns').toBe(true);
      expect(await reportGridView.getContextMenuOption('Left').isVisible(), 'Metrics Left').toBe(true);
      expect(await reportGridView.getContextMenuOption('Right').isVisible(), 'Metrics Right').toBe(false);

      await reportPageBy.openSelectorContextMenu('Metrics');
      await reportGridView.clickContextMenuOption('Move');
      await reportGridView.clickContextMenuOption('Left');

      expect(await reportPageBy.getSelectorByIdx(1).getText(), 'Subcategory idx 1').toBe('Subcategory');
      expect(await reportPageBy.getSelectorByIdx(2).getText(), 'Country idx 2').toBe('Country');
      expect(await reportPageBy.getSelectorByIdx(3).getText(), 'Metrics idx 3').toBe('Metrics');
      expect(await reportPageBy.getSelectorByIdx(4).getText(), 'Call Center idx 4').toBe('Call Center');

      // Select Subcategory Business, Country Web, Metrics Profit
      await reportPageBy.changePageByElement('Subcategory', 'Business');
      await reportPageBy.changePageByElement('Country', 'Web');
      await reportPageBy.changePageByElement('Metrics', 'Profit');
      expect(await reportGridView.getGridCellTextByPos(0, 3), 'Grid Profit').toBe('Profit');
      expect(await reportGridView.getGridCellTextByPos(1, 1), 'Grid Web').toBe('Web');
      expect(await reportGridView.getGridCellTextByPos(1, 2), 'Grid Books').toBe('Books');
      expect(await reportGridView.getGridCellTextByPos(1, 3), 'Grid $1,296').toBe('$1,296');
      expect(await reportGridView.getGridCellTextByPos(3, 3), 'Grid $5,680').toBe('$5,680');

      // Select Subcategory Pop
      await reportPageBy.changePageByElement('Subcategory', 'Pop');
      expect(await reportGridView.getGridCellTextByPos(0, 3), 'Grid Pop Profit').toBe('Profit');
      expect(await reportGridView.getGridCellTextByPos(1, 2), 'Grid Pop Music').toBe('Music');
      expect(await reportGridView.getGridCellTextByPos(1, 3), 'Grid Pop $277').toBe('$277');
      expect(await reportGridView.getGridCellTextByPos(3, 3), 'Grid Pop $1,306').toBe('$1,306');

      // Sort descending Subcategory in PageBy
      await reportEditorPanel.openObjectContextMenu('PageBy', 'attribute', 'Subcategory');
      await reportDatasetPanel.clickObjectContextMenuItem('Sort Descending');
      await reportPageBy.openDropdownFromSelector('Subcategory');
      const popIndex = await reportPageBy.getIndexForElementFromPopupList('Pop');
      expect(popIndex, 'Pop index in sorted list').toBe('7');

      // Sort descending Call Center, Move to Rows
      await reportEditorPanel.openObjectContextMenu('PageBy', 'attribute', 'Call Center');
      await reportDatasetPanel.clickObjectContextMenuItem('Sort Descending');
      await reportPageBy.openSelectorContextMenu('Call Center');
      await reportGridView.clickContextMenuOption('Move');
      await reportGridView.clickContextMenuOption('To Rows');

      expect(await reportPageBy.getPageBySelectorText('Subcategory'), 'Subcategory after To Rows').toBe('Pop');
      expect(await reportPageBy.getPageBySelectorText('Country'), 'Country after To Rows').toBe('Web');
      expect(await reportPageBy.getPageBySelectorText('Metrics'), 'Metrics after To Rows').toBe('Profit');
      expect(await reportGridView.getGridCellTextByPos(0, 0), 'Grid Call Center header').toBe('Call Center');
      expect(await reportGridView.getGridCellTextByPos(0, 2), 'Grid col 2').toBe('Region');
      expect(await reportGridView.getGridCellTextByPos(0, 4), 'Grid col 4').toBe('Profit');
      expect(await reportGridView.getGridCellTextByPos(1, 0), 'Grid row 1 col 0').toBe('Web');
      expect(await reportGridView.getGridCellTextByPos(1, 1), 'Grid row 1 col 1').toBe('2014');
      expect(await reportGridView.getGridCellTextByPos(1, 3), 'Grid row 1 col 3').toBe('Music');
      expect(await reportGridView.getGridCellTextByPos(1, 4), 'Grid row 1 col 4').toBe('$277');

      // Move Country to Columns
      await reportPageBy.openSelectorContextMenu('Country');
      await reportGridView.clickContextMenuOption('Move');
      await reportGridView.clickContextMenuOption('To Columns');

      expect(await reportPageBy.getPageBySelectorText('Subcategory'), 'Subcategory after To Columns').toBe('Pop');
      expect(await reportPageBy.getPageBySelectorText('Metrics'), 'Metrics after To Columns').toBe('Profit');
      expect(await reportGridView.getGridCellTextByPos(0, 0), 'Grid Call Center').toBe('Call Center');
      expect(await reportGridView.getGridCellTextByPos(0, 2), 'Grid Year').toBe('Region');
      expect(await reportGridView.getGridCellTextByPos(0, 3), 'Grid Region').toBe('Category');
      expect(await reportGridView.getGridCellTextByPos(0, 4), 'Grid Category').toBe('USA');
      expect(await reportGridView.getGridCellTextByPos(0, 5), 'Grid USA').toBe('Web');
    }
  );
});
