import * as reportConstants from '../../../constants/report.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';

describe('Report Editor Sort in Workstation', () => {
    let {
        loginPage,
        libraryPage,
        reportToolbar,
        reportGridView,
        reportTOC,
        newFormatPanelForGrid,
        reportFormatPanel,
        reportEditorPanel,
        reportSubtotalsEditor,
        vizPanelForGrid,
        advancedSort,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(reportConstants.reportUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.handleError();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    //  to refine later
    it('[TC85322] Report editor sort TC85322', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.ReportForSort.id,
            projectId: reportConstants.ReportForSort.project.id,
        });
        // When I switch to design mode in Report Editor
        await reportToolbar.switchToDesignMode();

        // When I open the advanced sort editor for the object "Region" from grid view in Report Editor
        await reportGridView.openAdvancedSortEditorOnGridObject('Region');

        // Then the Advanced Sort Editor will show default settings with "Rows" selected
        await since(
            'After opening the advanced sort editor for the object "Region", the Advanced Sort Editor will show default settings with "Rows" selected, instead we have #{actual}'
        )
            .expect(await advancedSort.isRowsSelected())
            .toBe(true);

        // When I set row "1" to use object "Region (DESC)" sort "Descending" in the Advanced Sort Editor
        await vizPanelForGrid.addAdvancedSortParameter('1', 'Region (DESC)', 'Descending');

        // And I set row "2" to use object "Manager (Last Name)" sort "Ascending" in the Advanced Sort Editor
        await vizPanelForGrid.addAdvancedSortParameter('2', 'Manager (Last Name)', 'Ascending');

        // And I switch from "Rows" to "Columns" in the Advanced Sort Editor
        await vizPanelForGrid.switchRowColumnInSortEditor('Columns');

        // And I set row "1" to use object "Category (DESC)" sort "Descending" in the Advanced Sort Editor
        await vizPanelForGrid.addAdvancedSortParameter('1', 'Category (DESC)', 'Descending');

        // And I click "OK" button to save and close the Advanced Sort Editor
        await vizPanelForGrid.saveAndCloseSortEditor();

        // Then the grid cell at "2", "0" has text "Web"
        await since('The grid cell at "2", "0" should have text "Web", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toBe('Web');

        // And the grid cell at "3", "1" has text "Jackson"
        await since('The grid cell at "3", "1" should have text "Jackson", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(3, 1))
            .toBe('Jackson');

        // And the grid cell at "8", "0" has text "South"
        await since('The grid cell at "8", "0" should have text "South", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(8, 0))
            .toBe('South');

        // And the grid cell at "8", "3" has text "$353,580"
        await since('The grid cell at "8", "3" should have text "$353,580", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(8, 3))
            .toBe('$353,580');

        // And the grid cell at "9", "1" has text "Kelly"
        await since('The grid cell at "9", "1" should have text "Kelly", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(9, 1))
            .toBe('Kelly');

        // When I sort the metric "Cost" in Sort Within Default order from grid view in Report Editor
        // await reportGridView.openGridColumnHeaderContextMenu('Cost');
        // await reportGridView.clickContextMenuOption('Sort Within (Default)');
        await reportGridView.sortByOption('Cost', 'Sort Within');

        // Then the grid cell at "2", "3" has text "$441,905"
        await since('The grid cell at "2", "3" should have text "$441,905", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('$441,905');

        // And from the object "Cost" context menu the option sort "within" should be checked from grid view in Report Editor
        await reportGridView.openGridColumnHeaderContextMenu('Cost');
        await since('The sort "within" option should be checked, instead we have #{actual}')
            .expect(await reportGridView.getSortChecked('within').isDisplayed())
            .toBe(true);

        // And the context menu should have sort "desc" icon highlighted from grid view in Report Editor
        await since('The sort "desc" icon should be highlighted, instead we have #{actual}')
            .expect(await reportGridView.getSortChecked('desc').isDisplayed())
            .toBe(true);

        // And the context menu should contain clear sort icon from grid view in Report Editor
        await since('The context menu should contain clear sort icon, instead we have #{actual}')
            .expect(await reportGridView.getClearSortIcon().isDisplayed())
            .toBe(true);

        // And I click to close context menu
        await vizPanelForGrid.dismissContextMenu();

        // When I sort the metric "Profit" in Sort All Values order from grid view in Report Editor
        // await reportGridView.openGridColumnHeaderContextMenu('Profit');
        // await reportGridView.clickContextMenuOption('Sort All Values');
        await reportGridView.sortByOption('Profit', 'Sort All Values');

        // Then the grid cell at "2", "3" has text "$743,318"
        await since('The grid cell at "2", "3" should have $743,318, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('$743,318');

        // And the grid cell at "2", "4" has text "$36,594"
        await since('The grid cell at "2", "4" should have $36,594, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 4))
            .toBe('$36,594');

        // And from the object "Profit" context menu the option sort "all" should be checked from grid view in Report Editor
        await reportGridView.openGridColumnHeaderContextMenu('Profit');
        await since('The sort "all" option should be checked, instead we have #{actual}')
            .expect(await reportGridView.getSortChecked('all').isDisplayed())
            .toBe(true);

        // And the context menu should have sort "desc" icon highlighted from grid view in Report Editor
        await since('The sort "desc" icon should be highlighted, instead we have #{actual}')
            .expect(await reportGridView.getSortChecked('desc').isDisplayed())
            .toBe(true);

        // And the context menu should contain clear sort icon from grid view in Report Editor
        await since('The context menu should contain clear sort icon, instead we have #{actual}')
            .expect(await reportGridView.getClearSortIcon().isDisplayed())
            .toBe(true);

        // And I click to close context menu
        await vizPanelForGrid.dismissContextMenu();

        // When I click the sort ascending icon for metric "Profit" from grid view in Report Editor
        // await reportGridView.openGridColumnHeaderContextMenu('Profit');
        // await reportGridView.clickSortIcon('asc');
        await reportGridView.sortAscendingBySortIcon('Profit');

        // Then the grid cell at "2", "3" has text "$77,742"
        await since('The grid cell at "2", "3" should have $77,742, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('$77,742');

        // And the grid cell at "2", "4" has text "$3,625"
        await since('The grid cell at "2", "4" should have $3,625, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 4))
            .toBe('$3,625');

        // When I open context menu for "metric" "Cost" in "Metrics" dropzone from the Editor Panel in Report Editor
        await reportEditorPanel.openObjectContextMenu('Metrics', 'metric', 'Cost');

        // And I click context menu item "Show Totals" in Editor Panel
        await reportEditorPanel.clickContextMenuItem('Show Totals');

        // And I select "Total" type in subtotals editor
        await reportSubtotalsEditor.selectTypeCheckbox('Total');

        // And I click "Done" button in subtotals editor
        await reportSubtotalsEditor.saveAndCloseSubtotalsEditor();

        // Then the grid cell at "17", "3" has text "$3,713,323"
        await since('The grid cell at "17", "3" should have $3,713,323, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(17, 3))
            .toBe('$3,713,323');

        // And the grid cell at "16", "4" has text "$36,594"
        await since('The grid cell at "16", "4" should have $36,594, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(16, 4))
            .toBe('$36,594');

        // When I open the advanced sort editor for the object "Region" from grid view in Report Editor
        await reportGridView.openAdvancedSortEditorOnGridObject('Region');

        // When I set row "1" to use object "Region (DESC)" sort "Ascending" in the Advanced Sort Editor
        await vizPanelForGrid.addAdvancedSortParameter('1', 'Region (DESC)', 'Ascending');

        // And I set row "2" to use object "Movies; Cost" sort "Descending" in the Advanced Sort Editor
        await vizPanelForGrid.addAdvancedSortParameter('2', 'Movies; Cost', 'Descending');

        // And I switch from "Rows" to "Columns" in the Advanced Sort Editor
        await vizPanelForGrid.switchRowColumnInSortEditor('Columns');

        // And I set row "1" to use object "Category (ID)" sort "Ascending" in the Advanced Sort Editor
        await vizPanelForGrid.addAdvancedSortParameter('1', 'Category (ID)', 'Ascending');

        // And I click "OK" button to save and close the Advanced Sort Editor
        await vizPanelForGrid.saveAndCloseSortEditor();

        // Then the grid cell at "2", "3" has text "$245,475"
        await since('The grid cell at "2", "3" should have text "$245,475", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('$245,475');

        // And the grid cell at "25", "4" has text "$569,278"
        await since('The grid cell at "25", "4" should have text "$569,278", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(25, 4))
            .toBe('$569,278');

        // When I switch to "format" Panel in Report Editor
        await reportTOC.switchToFormatPanel();

        // And I expand "Layout" section in Report Editor
        await newFormatPanelForGrid.expandLayoutSection();

        // When I open the advanced sort editor for the object "Cost" from grid view in Report Editor
        await reportGridView.openAdvancedSortEditorOnGridObject('Cost');

        // When I set row "2" to use object "Movies; Cost" sort "Descending" in the Advanced Sort Editor
        await vizPanelForGrid.addAdvancedSortParameter('2', 'Movies; Cost', 'Descending');

        // And I switch from "Rows" to "Columns" in the Advanced Sort Editor
        await vizPanelForGrid.switchRowColumnInSortEditor('Columns');

        // When I set row "1" to use object "Category (DESC)" sort "Descending" in the Advanced Sort Editor
        await vizPanelForGrid.addAdvancedSortParameter('1', 'Category (DESC)', 'Descending');

        // And I click "OK" button to save and close the Advanced Sort Editor
        await vizPanelForGrid.saveAndCloseSortEditor();

        // When I toggle Enable Outline toggle button under Layout section in Report Editor
        await reportFormatPanel.enableOutlineMode();

        // When I expand the grid column header "Region" in outline mode from the grid view
        await reportGridView.clickOutlineIconFromCH('Region');

        // Then the grid cell at "13", "4" has text "$5,530" in outline mode from the grid view
        await since('The grid cell at "13", "4" should have text "$5,530", instead we have #{actual}')
            .expect(await reportGridView.getGridCellChildSpanByPos('13', '4', '$5,530'))
            .toBeTruthy();

        // And the grid cell at "5", "5" has text "$93,091" in outline mode from the grid view
        await since('The grid cell at "5", "5" should have text "$93,091", instead we have #{actual}')
            .expect(await reportGridView.getGridCellChildSpanByPos('5', '5', '$93,091'))
            .toBeTruthy();

        // And the grid cell at "4", "4" has text "$22,116" in outline mode from the grid view
        await since('The grid cell at "4", "4" should have text "$22,116", instead we have #{actual}')
            .expect(await reportGridView.getGridCellChildSpanByPos('4', '4', '$22,116'))
            .toBeTruthy();

        // And the grid cell at "13", "5" has text "$114,901" in outline mode from the grid view
        await since('The grid cell at "13", "5" should have text "$114,901", instead we have #{actual}')
            .expect(await reportGridView.getGridCellChildSpanByPos('13', '5', '$114,901'))
            .toBeTruthy();

        // And I sort ascending the object "Region" from grid view in Report Editor
        await reportGridView.sortAscending('Region');

        // When I expand the grid column header "Region" in outline mode from the grid view
        await reportGridView.clickOutlineIconFromCH('Region');

        // Then the grid cell at "4", "6" has text "$441,905" in outline mode from the grid view
        await since('The grid cell at "4", "6" should have text "$441,905", instead we have #{actual}')
            .expect(await reportGridView.getGridCellChildSpanByPos('4', '6', '$441,905'))
            .toBeTruthy();

        // And the grid cell at "4", "5" has text "$464,020" in outline mode from the grid view
        await since('The grid cell at "4", "5" should have text "$464,020", instead we have #{actual}')
            .expect(await reportGridView.getGridCellChildSpanByPos(4, 5, '$464,020').isDisplayed())
            .toBe(true);

        // And the grid cell at "8", "5" has text "$342,383" in outline mode from the grid view
        await since('The grid cell at "8", "5" should have text "$342,383", instead we have #{actual}')
            .expect(await reportGridView.getGridCellChildSpanByPos(8, 5, '$342,383').isDisplayed())
            .toBe(true);

        // And the grid cell at "14", "6" has text "$77,742" in outline mode from the grid view
        await since('The grid cell at "14", "6" should have text "$77,742", instead we have #{actual}')
            .expect(await reportGridView.getGridCellChildSpanByPos(14, 3, '$77,742').isDisplayed())
            .toBe(true);

        // And I click the sort ascending icon for metric "Revenue" from grid view in Report Editor
        // await reportGridView.openGridColumnHeaderContextMenu('Revenue');
        // await reportGridView.clickSortIcon('asc');
        await reportGridView.sortAscendingBySortIcon('Revenue');

        // When I expand the grid column header "Region" in outline mode from the grid view
        await reportGridView.clickOutlineIconFromCH('Region');

        // And the grid cell at "4", "6" has text "$88,938" in outline mode from the grid view
        await since('The grid cell at "4", "6" should have text "$88,938", instead we have #{actual}')
            .expect(await reportGridView.getGridCellChildSpanByPos(4, 3, '$88,938').isDisplayed())
            .toBe(true);

        // And the grid cell at "10", "5" has text "$163,812" in outline mode from the grid view
        await since('The grid cell at "10", "5" should have text "$163,812", instead we have #{actual}')
            .expect(await reportGridView.getGridCellChildSpanByPos(10, 5, '$163,812').isDisplayed())
            .toBe(true);

        // And the grid cell at "8", "4" has text "$15,383" in outline mode from the grid view
        await since('The grid cell at "8", "4" should have text "$15,383", instead we have #{actual}')
            .expect(await reportGridView.getGridCellChildSpanByPos(8, 4, '$15,383').isDisplayed())
            .toBe(true);

        // And the grid cell at "13", "5" has text "$81,368" in outline mode from the grid view
        await since('The grid cell at "13", "5" should have text "$81,368", instead we have #{actual}')
            .expect(await reportGridView.getGridCellChildSpanByPos(13, 5, '$81,368').isDisplayed())
            .toBe(true);

        // And I click the clear sort icon for metric "Revenue" from grid view in Report Editor
        // await reportGridView.openGridColumnHeaderContextMenu('Revenue');
        // await reportGridView.clickSortIcon('clear');
        await reportGridView.clearSortBySortIcon('Revenue');
        await reportGridView.clickOutlineIconFromCH('Region');
        // Then the grid cell at "5", "6" has text "$94,883" in outline mode from the grid view
        await since('The grid cell at "5", "6" should have $94,883, instead we have #{actual}')
            .expect(await reportGridView.getGridCellChildSpanByPos('5', '6', '$94,883'))
            .toBeTruthy();
        // And the grid cell at "11", "6" has text "$772,568" in outline mode from the grid view
        await since('The grid cell at "11", "6" should have $772,568, instead we have #{actual}')
            .expect(await reportGridView.getGridCellChildSpanByPos('11', '6', '$772,568'))
            .toBeTruthy();
        // And the grid cell at "8", "4" has text "$15,383" in outline mode from the grid view
        await since('The grid cell at "8", "4" should have $15,383, instead we have #{actual}')
            .expect(await reportGridView.getGridCellChildSpanByPos('8', '4', '$15,383'))
            .toBeTruthy();
        // And the grid cell at "13", "5" has text "$114,901" in outline mode from the grid view
        await since('The grid cell at "13", "5" should have $114,901, instead we have #{actual}')
            .expect(await reportGridView.getGridCellChildSpanByPos('13', '5', '$114,901'))
            .toBeTruthy();
    });
});
