import * as reportConstants from '../../../constants/report.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';

describe('Report Editor Grid View Context Menu in Workstation', () => {
    let { loginPage, libraryPage, reportToolbar, reportPageBy, reportEditorPanel, reportGridView, baseContainer } =
        browsers.pageObj1;

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

    //  notes here: it should be re-formatted ! one it is toooooo long

    it('[TC81225] Report editor grid view context menu in workstation', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.ReportGridContextMenu.id,
            projectId: reportConstants.ReportGridContextMenu.project.id,
        });
        await reportToolbar.switchToDesignMode();

        // And the grid cell at "0", "0" has text "Year"
        await since(
            'After switch to design mode, The grid cell at "0", "0" should have text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "0", "1" has text "Region"
        await since(
            'After switch to design mode, The grid cell at "0", "1" should have text "Region", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Region');

        // And the grid cell at "0", "2" has text "Category"
        await since(
            'After switch to design mode, The grid cell at "0", "2" should have text "Category", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Category');

        // And the grid cell at "0", "3" has text "Cost"
        await since(
            'After switch to design mode, The grid cell at "0", "3" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Cost');

        await reportGridView.openGridCellContextMenu('2014');
        // Drill, Copy Cell, Copy Cell with Header should show up in context menu
        await since(
            `After opening context menu on cell '2014', the context menu should contain #{expected}, instead we have #{actual}`
        )
            .expect(await reportEditorPanel.contextMenuContainsOption('Drill'))
            .toBe(true);
        await since(
            `After opening context menu on cell '2014', the context menu should contain #{expected}, instead we have #{actual}`
        )
            .expect(await reportEditorPanel.contextMenuContainsOption('Copy Cell'))
            .toBe(true);
        await since(
            `After opening context menu on cell '2014', the context menu  should contain #{expected}, instead we have #{actual}`
        )
            .expect(await reportEditorPanel.contextMenuContainsOption('Copy Cell with Header'))
            .toBe(true);

        await reportGridView.openGridColumnHeaderContextMenu('Year');
        await reportGridView.clickContextMenuOption('Move');
        await since(
            `After opening context menu on cell 'Year', the context menu should contain #{expected}, instead we have #{actual}`
        )
            .expect(await reportEditorPanel.contextMenuContainsOption('To Columns'))
            .toBe(true);
        await since(
            `After opening context menu on cell 'Year', the context menu should contain #{expected}, instead we have #{actual}`
        )
            .expect(await reportEditorPanel.contextMenuContainsOption('To Page-by'))
            .toBe(true);
        await since(
            `After opening context menu on cell 'Year', the context menu should contain #{expected}, instead we have #{actual}`
        )
            .expect(await reportEditorPanel.contextMenuContainsOption('Right'))
            .toBe(true);
        await since(
            `After opening context menu on cell 'Year', the context menu should contain #{expected}, instead we have #{actual}`
        )
            .expect(await reportEditorPanel.contextMenuContainsOption('Left'))
            .toBe(false);

        await reportGridView.clickContextMenuOption('Right');
        // Then the grid cell at "0", "0" has text "Region"
        await since(
            'After moving column header "Year" to "Right", The grid cell at "0", "0" should have text "Region", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Region');

        // And the grid cell at "0", "1" has text "Year"
        await since(
            'After moving column header "Year" to "Right", The grid cell at "0", "1" should have text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Year');

        await reportGridView.openGridColumnHeaderContextMenu('Year');
        await reportGridView.clickContextMenuOption('Move');
        await since(
            `After opening context menu on cell 'Year', the context menu should contain #{expected}, instead we have #{actual}`
        )
            .expect(await reportEditorPanel.contextMenuContainsOption('To Columns'))
            .toBe(true);
        await since(
            `After opening context menu on cell 'Year', the context menu should contain #{expected}, instead we have #{actual}`
        )
            .expect(await reportEditorPanel.contextMenuContainsOption('To Page-by'))
            .toBe(true);
        await since(
            `After opening context menu on cell 'Year', the context menu should contain #{expected}, instead we have #{actual}`
        )
            .expect(await reportEditorPanel.contextMenuContainsOption('Right'))
            .toBe(true);

        await since(
            `After opening context menu on cell 'Year', the context menu should contain #{expected}, instead we have #{actual}`
        )
            .expect(await reportEditorPanel.contextMenuContainsOption('Left'))
            .toBe(true);

        // And I click "Left" option from grid view context menu in Report Editor
        await reportGridView.clickContextMenuOption('Left');

        // Then the grid cell at "0", "0" has text "Year"
        await since(
            'After moving column header "Year" to "Left", The grid cell at "0", "0" should have text "Year", instead we have #{actual} instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "0", "1" has text "Region"
        await since(
            'After moving column header "Year" to "Left", The grid cell at "0", "1" should have text "Region", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Region');

        // part 2
        // When I click on container "Visualization 1" to select it (need to add it)
        await baseContainer.clickContainerByScript('Visualization 1');
        await reportGridView.openGridColumnHeaderContextMenu('Category');
        await reportGridView.clickContextMenuOption('Move');
        await since(
            `After opening context menu on cell 'Category', the context menu should contain #{expected}, instead we have #{actual}`
        )
            .expect(await reportEditorPanel.contextMenuContainsOption('To Columns'))
            .toBe(true);
        await since(
            `After opening context menu on cell 'Category', the context menu should contain #{expected}, instead we have #{actual}`
        )
            .expect(await reportEditorPanel.contextMenuContainsOption('To Page-by'))
            .toBe(true);
        //  may need to add sleep here
        await since(
            `After opening context menu on cell 'Category', the context menu should contain #{expected}, instead we have #{actual}`
        )
            .expect(await reportEditorPanel.contextMenuContainsOption('Left'))
            .toBe(true);

        await since(
            `After opening context menu on cell 'Category', the context menu should contain #{expected}, instead we have #{actual}`
        )
            .expect(await reportEditorPanel.contextMenuContainsOption('Right'))
            .toBe(false);

        await reportGridView.clickContextMenuOption('Left');
        // Then the grid cell at "0", "0" has text "Year"
        await since(
            'After moving column header "Category" to "Left", The grid cell at "0", "0" should have text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "0", "1" has text "Category"
        await since(
            'After moving column header "Category" to "Left", The grid cell at "0", "1" should have text "Category", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Category');

        // And the grid cell at "0", "2" has text "Region"
        await since(
            'After moving column header "Category" to "Left", The grid cell at "0", "2" should have text "Region", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Region');

        // And the grid cell at "0", "3" has text "Cost"
        await since(
            'After moving column header "Category" to "Left", The grid cell at "0", "3" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Cost');
        // await reportGridView.openGridColumnHeaderContextMenu('Category');

        // part 3
        await reportGridView.openGridColumnHeaderContextMenu('Cost');
        await reportGridView.clickContextMenuOption('Move');
        // Then the context menu should contain "To Rows" from grid view in Report Editor
        await since(
            'After opening context menu on cell "Cost", The context menu should contain "To Rows", instead we have #{actual}'
        )
            .expect(await reportGridView.contextMenuContainsOption('To Rows'))
            .toBe(true);

        // And the context menu should contain "To Page-by" from grid view in Report Editor
        await since(
            'After opening context menu on cell "Cost", The context menu should contain "To Page-by", instead we have #{actual}'
        )
            .expect(await reportGridView.contextMenuContainsOption('To Page-by'))
            .toBe(true);
        // And the context menu should not contain "Left" from grid view in Report Editor
        await since(
            'After opening context menu on cell "Cost", The context menu should not contain "Left", instead we have #{actual}'
        )
            .expect(await reportEditorPanel.contextMenuContainsOption('Left'))
            .toBe(false);

        // And the context menu should not contain "Right" from grid view in Report Editor
        await since(
            'After opening context menu on cell "Cost", The context menu should not contain "Right", instead we have #{actual}'
        )
            .expect(await reportEditorPanel.contextMenuContainsOption('Right'))
            .toBe(false);

        // And I click "Add Metrics" option from grid view context menu in Report Editor
        await reportGridView.clickContextMenuOption('Add Metrics');

        // And I click "Before" option from grid view context menu in Report Editor
        await reportGridView.clickContextMenuOption('Before');

        // Then the context menu should contain object "Profit" from grid view context menu in Report Editor
        await since(
            'After clicking "Add Metrics" option, The context menu should contain object "Profit", instead we have #{actual}'
        )
            .expect(await reportGridView.getContextMenuOptionCheckBox('Profit').isDisplayed())
            .toBe(true);

        // Then the context menu should contain object "Revenue" from grid view context menu in Report Editor
        await since(
            'After clicking "Add Metrics" option, The context menu should contain object "Revenue", instead we have #{actual}'
        )
            .expect(await reportGridView.getContextMenuOptionCheckBox('Revenue').isDisplayed())
            .toBe(true);

        // And I select object "Profit" from grid view context menu in Report Editor
        await reportGridView.clickContextMenuOptionCheckBox('Profit');

        // And I click "OK" from grid view context menu in Report Editor
        await reportGridView.saveAndCloseContextMenu();

        // And the grid cell at "0", "3" has text "Profit"
        await since(
            'After adding "Profit" as a metric, The grid cell at "0", "3" should have text "Profit", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Profit');

        // And the grid cell at "0", "4" has text "Cost"
        await since(
            'After adding "Profit" as a metric, The grid cell at "0", "4" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('Cost');

        // part 4
        // / When I open context menu from the column header "Profit" from grid view in Report Editor
        await reportGridView.openGridColumnHeaderContextMenu('Profit');

        // And I click "Move" option from grid view context menu in Report Editor
        await reportGridView.clickContextMenuOption('Move');

        // Then the context menu should contain "To Rows" from grid view in Report Editor
        await since(
            'After opening context menu on cell "Profit", The context menu should contain "To Rows", instead we have #{actual}'
        )
            .expect(await reportGridView.getContextMenuOption('To Rows'))
            .toBeTruthy();

        // And the context menu should contain "To Page-by" from grid view in Report Editor
        await since(
            'After opening context menu on cell "Profit", The context menu should contain "To Page-by", instead we have #{actual}'
        )
            .expect(await reportGridView.getContextMenuOption('To Page-by'))
            .toBeTruthy();

        // And the context menu should contain "Right" from grid view in Report Editor
        await since(
            'After opening context menu on cell "Profit", After opening context menu on cell "Profit", The context menu should contain "Right", instead we have #{actual}'
        )
            .expect(await reportGridView.getContextMenuOption('Right'))
            .toBeTruthy();

        // And the context menu should not contain "Left" from grid view in Report Editor
        await since(
            'After opening context menu on cell "Profit", After opening context menu on cell "Profit", The context menu should not contain "Left", instead we have #{actual}'
        )
            .expect(await reportGridView.contextMenuContainsOption('Left'))
            .toBe(false);

        // And I click "Right" option from grid view context menu in Report Editor
        await reportGridView.clickContextMenuOption('Right'); // And the grid cell at "0", "4" has text "Profit"
        await since(
            'After moving column header "Profit" to "Right", After opening context menu on cell "Profit", The grid cell at "0", "3" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Cost');

        await since(
            'After moving column header "Profit" to "Right", After opening context menu on cell "Profit", The grid cell at "0", "4" should have text "Profit", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('Profit');

        // part 5
        // When I open context menu from the column header "Cost" from grid view in Report Editor
        await reportGridView.openGridColumnHeaderContextMenu('Cost');

        // And I click "Move" option from grid view context menu in Report Editor
        await reportGridView.clickContextMenuOption('Move');

        // And I click "To Rows" option from grid view context menu in Report Editor
        await reportGridView.clickContextMenuOption('To Rows');

        // Then the grid cell at "0", "0" has text ""
        await since(
            'After moving column header "Cost" to "To Rows", The grid cell at "0", "0" should have text "", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('');
        // And the grid cell at "1", "4" has text "$77,012"
        await since(
            'After moving column header "Cost" to "To Rows", The grid cell at "1", "4" should have text "$77,012", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('$77,012');

        // When I open blank cell context menu at "0", "0" from grid view context menu in Report Editor
        await reportGridView.openGridContextMenuByPos(0, 0);

        // And I click "Move" option from grid view context menu in Report Editor
        await reportGridView.clickContextMenuOption('Move');

        // Then the context menu should contain "To Columns" from grid view in Report Editor
        await since(
            'After opening blank cell context menu at "0", "0", The context menu should contain "To Columns", instead we have #{actual}'
        )
            .expect(await reportEditorPanel.contextMenuContainsOption('To Columns'))
            .toBe(true);

        // And the context menu should contain "To Page-by" from grid view in Report Editor
        await since(
            'After opening blank cell context menu at "0", "0", The context menu should contain "To Page-by", instead we have #{actual}'
        )
            .expect(await reportEditorPanel.contextMenuContainsOption('To Page-by'))
            .toBe(true);

        // And the context menu should contain "Right" from grid view in Report Editor
        await since(
            'After opening blank cell context menu at "0", "0", The context menu should contain "Right", instead we have #{actual}'
        )
            .expect(await reportEditorPanel.contextMenuContainsOption('Right'))
            .toBe(true);
        // And the context menu should not contain "Left" from grid view in Report Editor
        await since(
            'After opening blank cell context menu at "0", "0", The context menu should not contain "Left", instead we have #{actual}'
        )
            .expect(await reportEditorPanel.contextMenuContainsOption('Left'))
            .toBe(false);

        // And I click "Right" option from grid view context menu in Report Editor
        await reportGridView.clickContextMenuOption('Right');

        // When I open blank cell context menu at "0", "1" from grid view context menu in Report Editor
        await reportGridView.openGridContextMenuByPos(0, 1);

        // And I click "Move" option from grid view context menu in Report Editor
        await reportGridView.clickContextMenuOption('Move');

        // And I click "Right" option from grid view context menu in Report Editor
        await reportGridView.clickContextMenuOption('Right');

        // When I open blank cell context menu at "0", "2" from grid view context menu in Report Editor
        await reportGridView.openGridContextMenuByPos(0, 2);

        // And I click "Move" option from grid view context menu in Report Editor
        await reportGridView.clickContextMenuOption('Move');

        // And I click "Right" option from grid view context menu in Report Editor
        await reportGridView.clickContextMenuOption('Right');

        // Then the grid cell at "0", "0" has text "Year"
        await since(
            'After moving "0", "2" to "Right", The grid cell at "0", "0" should have text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');
        // And the grid cell at "1", "3" has text "Cost"
        await since(
            'After moving "0", "2" to "Right", The grid cell at "1", "3" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('Cost');

        // And the grid cell at "2", "3" has text "Profit"
        await since(
            'After moving "0", "2" to "Right", The grid cell at "2", "3" should have text "Profit", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('Profit');

        // When I open context menu from the column header "Year" from grid view in Report Editor
        await reportGridView.openGridColumnHeaderContextMenu('Year');

        // And I click "Move" option from grid view context menu in Report Editor
        await reportGridView.clickContextMenuOption('Move');

        // And I click "To Columns" option from grid view context menu in Report Editor
        await reportGridView.clickContextMenuOption('To Columns');

        // Then the grid cell at "0", "0" has text "Region"
        await since(
            'After moving "Year" to "To Columns", The grid cell at "0", "0" should have text "Category", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Category');

        // And the grid cell at "0", "1" has text "Category"
        await since(
            'After moving "Year" to "To Columns", The grid cell at "0", "1" should have text "Region", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Region');

        // And the grid cell at "0", "2" has text "Year"
        await since(
            'After moving "Year" to "To Columns", The grid cell at "0", "2" should have text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Year');

        // // When I open context menu from cell "Cost" from grid view in Report Editor
        // await reportGridView.openGridCellContextMenu('Cost');

        // // And I click "Move" option from grid view context menu in Report Editor
        // await reportGridView.clickContextMenuOption('Move');

        // // And I click "To Page-by" option from grid view context menu in Report Editor
        // await reportGridView.clickContextMenuOption('To Page-by');
        await reportGridView.moveGridCellToPageBy('Cost');

        // Then The current selection for page by selector "Metrics" should be "Cost"
        await since(
            'After moving "Cost" to "To Page-by", The current selection for page by selector "Metrics" should be "Cost", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Metrics'))
            .toBe('Cost');

        // When I open the dropdown list for page by selector "Metrics"
        await reportPageBy.openDropdownFromSelector('Metrics');

        // Then The index of element "Cost" is 0 in page by selector
        await since(
            'After moving "Cost" to "To Page-by", The index of element "Cost" should be 0 in page by selector, instead we have #{actual}'
        )
            .expect(await reportPageBy.getIndexForElementFromPopupList('Cost'))
            .toBe('0');
        // And The index of element "Profit" is 1 in page by selector
        await since(
            'After moving "Cost" to "To Page-by", The index of element "Profit" in page by selector should be 1, instead we have #{actual}'
        )
            .expect(await reportPageBy.getIndexForElementFromPopupList('Profit'))
            .toBe('1');

        // Then I click to close context menu
        await reportToolbar.dismissContextMenu();

        // Then the grid cell at "0", "0" has text "Region"
        await since(
            'After moving "Cost" to "To Page-by", The grid cell at "0", "0" should have text "Region", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Category');

        // And the grid cell at "0", "1" has text "Category"
        await since(
            'After moving "Cost" to "To Page-by", The grid cell at "0", "1" should have text "Category", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Region');

        // Then I select element "Revenue" from Page by selector "Metrics"
        await reportPageBy.changePageByElement('Metrics', 'Profit');

        // Then The current selection for page by selector "Metrics" should be "Revenue"
        await since(
            'After moving "Cost" to "To Page-by", The current selection for page by selector "Metrics" should be "Profit", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Metrics'))
            .toBe('Profit');

        // // / When I open context menu from the column header "Category" from grid view in Report Editor
        // await reportGridView.openGridColumnHeaderContextMenu('Category');

        // // And I click "Move" option from grid view context menu in Report Editor
        // await reportGridView.clickContextMenuOption('Move');

        // // And I click "To Page-by" option from grid view context menu in Report Editor
        // await reportGridView.clickContextMenuOption('To Page-by');
        await reportGridView.moveGridHeaderToPageBy('Category');

        // Then The current selection for page by selector "Metrics" should be "Revenue"
        await since(
            'After moving "Category" to "To Page-by", The current selection for page by selector "Metrics" should be "Profit", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Metrics'))
            .toBe('Profit');

        // When I open the dropdown list for page by selector "Metrics"
        await reportPageBy.openDropdownFromSelector('Metrics');

        // Then The index of element "Cost" is 0 in page by selector
        await since(
            'After moving "Category" to "To Page-by", The index of element "Cost" should be 0 in page by selector, instead we have #{actual}'
        )
            .expect(await reportPageBy.getIndexForElementFromPopupList('Cost'))
            .toBe('0');

        // And The index of element "Profit" is 1 in page by selector
        await since(
            'After moving "Category" to "To Page-by", The index of element "Profit" should be 1 in page by selector, instead we have #{actual}'
        )
            .expect(await reportPageBy.getIndexForElementFromPopupList('Profit'))
            .toBe('1');
        // Then The current selection for page by selector "Category" should be "Books"
        await since(
            'After moving "Category" to "To Page-by", The current selection for page by selector "Category" should be "Books", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Category'))
            .toBe('Books');

        // When I open the dropdown list for page by selector "Category"
        await reportPageBy.openDropdownFromSelector('Category');

        // // Then The index of element "Books" is 0 in page by selector
        // await since(
        //     'After moving "Category" to "To Page-by", The index of element "Books" should be 0, instead we have #{actual}'
        // )
        //     .expect(await reportPageBy.getIndexForElementFromPopupList('Books'))
        //     .toBe('0');

        // // And The index of element "Electronics" is 1 in page by selector
        // await since(
        //     'After moving "Category" to "To Page-by", The index of element "Electronics" should be 1, instead we have #{actual}'
        // )
        //     .expect(await reportPageBy.getIndexForElementFromPopupList('Electronics'))
        //     .toBe('1');

        // // And The index of element "Movies" is 2 in page by selector
        // await since(
        //     'After moving "Category" to "To Page-by", The index of element "Movies" should be 2, instead we have #{actual}'
        // )
        //     .expect(await reportPageBy.getIndexForElementFromPopupList('Movies'))
        //     .toBe('2');

        // // And The index of element "Music" is 3 in page by selector
        // await since(
        //     'After moving "Category" to "To Page-by", The index of element "Music" should be 3, instead we have #{actual}'
        // )
        //     .expect(await reportPageBy.getIndexForElementFromPopupList('Music'))
        //     .toBe('3');

        // Then I click to close context menu
        await reportToolbar.dismissContextMenu();

        // And the grid cell at "1", "1" has text "$98,202"
        await since(
            'After moving "Category" to "To Page-by", The grid cell at "1", "1" should have text "$98,202", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('$21,190');
        // And the grid cell at "2", "1" has text "$86,030"
        await since(
            'After moving "Category" to "To Page-by", The grid cell at "2", "1" should have text "$86,030", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 1))
            .toBe('$18,403');

        // And the grid cell at "3", "1" has text "$165,002"
        await since(
            'After moving "Category" to "To Page-by", The grid cell at "3", "1" should have text "$165,002", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 1))
            .toBe('$35,435');

        // And the grid cell at "4", "1" has text "$34,059"
        await since(
            'After moving "Category" to "To Page-by", The grid cell at "4", "1" should have text "$34,059", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(4, 1))
            .toBe('$7,301');

        // When I open context menu for page by selector "Category" in Report Editor
        await reportPageBy.openSelectorContextMenu('Category');

        // Then I click option "Move" in context menu for page by selector in Report Editor
        await reportGridView.clickContextMenuOption('Move');

        // Then I click option "Right" in context menu for page by selector in Report Editor
        await reportGridView.clickContextMenuOption('Right');

        // Then The current selection for page by selector "Metrics" should be "Revenue"
        await since(
            'After moving "Category" to "Right", The current selection for page by selector "Metrics" should be "Revenue", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Metrics'))
            .toBe('Profit');

        // Then The current selection for page by selector "Category" should be "Books"
        await since(
            'After moving "Category" to "Right", The current selection for page by selector "Category" should be "Books", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Category'))
            .toBe('Books');

        // Then the index of page by selector "Metrics" should be "1"
        await since(
            'After moving "Category" to "Right", The index of page by selector "Metrics" should be "1", instead we have #{actual}'
        )
            .expect(await reportPageBy.getSelectorByIdx(1).getText())
            .toBe('Metrics');

        // And the index of page by selector "Category" should be "2"
        await since(
            'After moving "Category" to "Right", The index of page by selector "Category" should be "2", instead we have #{actual}'
        )
            .expect(await reportPageBy.getSelectorByIdx(2).getText())
            .toBe('Category');
        // Then the grid cell at "0", "0" has text "Region"
        await since(
            'After moving "Category" to "Right", The grid cell at "0", "0" should have text "Region", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Region');

        // And the grid cell at "0", "1" has text "2014"
        await since(
            'After moving "Category" to "Right", The grid cell at "0", "1" should have text "2014", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('2014');

        // And the grid cell at "8", "3" has text "$174,191"
        await since(
            'After moving "Category" to "Right", The grid cell at "8", "3" should have text "$174,191", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(8, 3))
            .toBe('$37,501');

        // When I open context menu for page by selector "Metrics" in Report Editor
        await reportPageBy.openSelectorContextMenu('Metrics');

        // Then I click option "Move" in context menu for page by selector in Report Editor
        await reportGridView.clickContextMenuOption('Move');

        // Then I click option "To Rows" in context menu for page by selector in Report Editor
        await reportGridView.clickContextMenuOption('To Rows');

        // Then The current selection for page by selector "Category" should be "Books"
        await since(
            'The current selection for page by selector "Category" should be "Books", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Category'))
            .toBe('Books');
        // And The page by selector "Metrics" should not be available
        await since('The page by selector "Metrics" should not be available, instead we have #{actual}')
            .expect(await reportPageBy.getSelector('Metrics').isDisplayed())
            .toBe(false);

        // Then the grid cell at "0", "0" has text ""
        await since('The grid cell at "0", "0" should have text "", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('');

        // And the grid cell at "0", "1" has text "Region"
        await since('The grid cell at "0", "1" should have text "Region", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Region');

        // And the grid cell at "23", "4" has text "$111,301"
        await since('The grid cell at "8", "3" should have text "$111,301", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(8, 3))
            .toBe('$62,411');
        // And the grid cell at "24", "4" has text "$174,191"
        await since('The grid cell at "16", "3" should have text "$174,191", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(16, 3))
            .toBe('$17,120');

        // When I open blank cell context menu at "0", "0" from grid view context menu in Report Editor
        await reportGridView.openGridContextMenuByPos(0, 0);

        // And I click "Move" option from grid view context menu in Report Editor
        await reportGridView.clickContextMenuOption('Move');

        // And I click "To Page-by" option from grid view context menu in Report Editor
        await reportGridView.clickContextMenuOption('To Page-by');

        // Then The current selection for page by selector "Metrics" should be "Revenue"
        await since(
            'The current selection for page by selector "Metrics" should be "Revenue", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Metrics'))
            .toBe('Profit');

        // Then The current selection for page by selector "Category" should be "Books"
        await since(
            'After moving "0", "0" to "To Page-by", The current selection for page by selector "Category" should be "Books", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Category'))
            .toBe('Books');

        // Then the index of page by selector "Metrics" should be "1"
        await since(
            'After moving "0", "0" to "To Page-by", The index of page by selector "Metrics" should be "1", instead we have #{actual}'
        )
            .expect(await reportPageBy.getSelectorByIdx(1).getText())
            .toBe('Metrics');

        // And the index of page by selector "Category" should be "2"
        await since(
            'After moving "0", "0" to "To Page-by", The index of page by selector "Category" should be "2", instead we have #{actual}'
        )
            .expect(await reportPageBy.getSelectorByIdx(2).getText())
            .toBe('Category');

        // Then the grid cell at "0", "0" has text "Region"
        await since(
            'After moving "0", "0" to "To Page-by", The grid cell at "0", "0" should have text "Region", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Region');
    });
});
