import * as reportConstants from '../../../../constants/report.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { browserWindow } from '../../../../constants/index.js';

describe('Report Page By - Part 2', () => {
    let { loginPage, libraryPage, reportDatasetPanel, reportToolbar, reportGridView, reportPageBy, reportEditorPanel } =
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
    it('[TC85476] FUN | Report Editor | Page-by | Other Context Menus', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.ReportPageByContextMenu.id,
            projectId: reportConstants.ReportPageByContextMenu.project.id,
        });
        await reportToolbar.switchToDesignMode();
        // // Then there should not be any page by selector available
        // await since('There should not be any page by selector available')
        //     .expect(await reportPageBy.getSelector(''))
        //     .toBe(null);

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

        // When I switch to "In Report" tab in dataset panel in Report Editor
        // await reportDatasetPanel.switchToInReportTab();

        // And I add the object "Subcategory" to Page-by from Object Browser in Report Editor
        await reportDatasetPanel.addObjectToPageBy('Subcategory');

        // Then The current selection for page by selector "Subcategory" should be "Art & Architecture"
        await since(
            'After add object "Subcategory" to Page-by, The current selection for page by selector "Subcategory" should be "Art & Architecture", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Subcategory'))
            .toBe('Art & Architecture');
        // And the grid cell at "0", "0" has text "Year"
        await since(
            'After add object "Subcategory" to Page-by, The grid cell at "0", "0" should have text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "0", "1" has text "Region"
        await since(
            'After add object "Subcategory" to Page-by, The grid cell at "0", "1" should have text "Region", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Region');

        // And the grid cell at "0", "2" has text "Category"
        await since(
            'After add object "Subcategory" to Page-by, The grid cell at "0", "2" should have text "Category", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Category');

        // And the grid cell at "0", "3" has text "Cost"
        await since(
            'After add object "Subcategory" to Page-by, The grid cell at "0", "3" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Cost');

        // And the grid cell at "1", "0" has text "2014"
        await since(
            'After add object "Subcategory" to Page-by, The grid cell at "1", "0" should have text "2014", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('2014');

        // And the grid cell at "1", "1" has text "Central"
        await since(
            'After add object "Subcategory" to Page-by, The grid cell at "1", "1" should have text "Central", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Central');

        // And the grid cell at "1", "2" has text "Books"
        await since(
            'After add object "Subcategory" to Page-by, The grid cell at "1", "2" should have text "Books", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Books');

        // And the grid cell at "1", "3" has text "$13,497"
        await since(
            'After add object "Subcategory" to Page-by, The grid cell at "1", "3" should have text "$13,497", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$13,497');

        // And the grid cell at "17", "0" has text "2016"
        await since(
            'After add object "Subcategory" to Page-by, The grid cell at "17", "0" should have text "2016", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(17, 0))
            .toBe('2016');

        // And the grid cell at "18", "1" has text "Mid-Atlantic"
        await since(
            'After add object "Subcategory" to Page-by, The grid cell at "18", "1" should have text "Mid-Atlantic", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(18, 1))
            .toBe('Mid-Atlantic');
        // And the grid cell at "18", "2" has text "Books"
        await since(
            'After add object "Subcategory" to Page-by, The grid cell at "18", "2" should have text "Books", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(18, 2))
            .toBe('Books');

        // And the grid cell at "18", "3" has text "$19,235"
        await since(
            'After add object "Subcategory" to Page-by, The grid cell at "18", "3" should have text "$19,235", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(18, 3))
            .toBe('$19,235');

        // Then I select element "Cameras" from Page by selector "Subcategory"
        await reportPageBy.changePageByElement('Subcategory', 'Cameras');

        // Then The current selection for page by selector "Subcategory" should be "Cameras"
        await since(
            'After select element "Cameras" from Page by selector "Subcategory", The current selection for page by selector "Subcategory" should be "Cameras", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Subcategory'))
            .toBe('Cameras');

        // And the grid cell at "0", "0" has text "Year"
        await since(
            'After select element "Cameras" from Page by selector "Subcategory", The grid cell at "0", "0" should have text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "0", "1" has text "Region"
        await since(
            'After select element "Cameras" from Page by selector "Subcategory", The grid cell at "0", "1" should have text "Region", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Region');

        // And the grid cell at "0", "2" has text "Category"
        await since(
            'After select element "Cameras" from Page by selector "Subcategory", The grid cell at "0", "2" should have text "Category", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Category');

        // And the grid cell at "0", "3" has text "Cost"
        await since(
            'After select element "Cameras" from Page by selector "Subcategory", The grid cell at "0", "3" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Cost');

        // And the grid cell at "1", "0" has text "2014"
        await since(
            'After select element "Cameras" from Page by selector "Subcategory", The grid cell at "1", "0" should have text "2014", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('2014');

        // And the grid cell at "1", "1" has text "Central"
        await since(
            'After select element "Cameras" from Page by selector "Subcategory", The grid cell at "1", "1" should have text "Central", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Central');
        // And the grid cell at "1", "2" has text "Electronics"
        await since(
            'After select element "Cameras" from Page by selector "Subcategory", The grid cell at "1", "2" should have text "Electronics", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Electronics');

        // And the grid cell at "1", "3" has text "$153,794"
        await since(
            'After select element "Cameras" from Page by selector "Subcategory", The grid cell at "1", "3" should have text "$153,794", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$153,794');

        // And the grid cell at "17", "0" has text "2016"
        await since(
            'After select element "Cameras" from Page by selector "Subcategory", The grid cell at "17", "0" should have text "2016", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(17, 0))
            .toBe('2016');

        // And the grid cell at "18", "1" has text "Mid-Atlantic"
        await since(
            'After select element "Cameras" from Page by selector "Subcategory", The grid cell at "18", "1" should have text "Mid-Atlantic", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(18, 1))
            .toBe('Mid-Atlantic');

        // And the grid cell at "18", "2" has text "Electronics"
        await since(
            'After select element "Cameras" from Page by selector "Subcategory", The grid cell at "18", "2" should have text "Electronics", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(18, 2))
            .toBe('Electronics');

        // And the grid cell at "18", "3" has text "$208,242"
        await since(
            'After select element "Cameras" from Page by selector "Subcategory", The grid cell at "18", "3" should have text "$208,242", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(18, 3))
            .toBe('$208,242');

        // When I open context menu for page by selector "Subcategory" in Report Editor
        await reportPageBy.openSelectorContextMenu('Subcategory');

        // Then the context menu in page by container in Report Editor should have option "Move"
        await since(
            'After open context menu for page by selector "Subcategory" in Report Editor, The context menu in page by container in Report Editor should have option "Move", instead we have #{actual}'
        )
            .expect(await reportEditorPanel.contextMenuContainsOption('Move'))
            .toBe(true);

        // And the context menu in page by container in Report Editor should have option "Add Attributes"
        await since(
            'After open context menu for page by selector "Subcategory" in Report Editor, The context menu in page by container in Report Editor should have option "Add Attributes", instead we have #{actual}'
        )
            .expect(await reportEditorPanel.contextMenuContainsOption('Add Attributes'))
            .toBe(true);

        // And the context menu in page by container in Report Editor should have option "Sort"
        await since(
            'After open context menu for page by selector "Subcategory" in Report Editor, The context menu in page by container in Report Editor should have option "Sort", instead we have #{actual}'
        )
            .expect(await reportEditorPanel.contextMenuContainsOption('Sort'))
            .toBe(true);
        // And the context menu in page by container in Report Editor should have option "Drill"
        await since(
            'After open context menu for page by selector "Subcategory" in Report Editor, The context menu in page by container in Report Editor should have option "Drill", instead we have #{actual}'
        )
            .expect(await reportGridView.getContextMenuOption('Drill'))
            .toBeTruthy();

        // When I open context menu of page by selector "Subcategory" to Add Attributes "Before" it and click attribute "Country"
        // await reportPageBy.openSelectorContextMenu('Subcategory');
        await reportGridView.clickContextMenuOption('Add Attributes');
        await reportGridView.clickContextMenuOption('Before');
        await reportPageBy.clickChecklistElementInContextMenu('Country');

        // Then the checkbox of "Country" should be checked in context menu of page by selector
        await since(
            'After open context menu of page by selector "Subcategory" to Add Attributes "Before" it and click attribute "Country", The checkbox of "Country" should be checked in context menu of page by selector, instead we have #{actual}'
        )
            .expect(await reportPageBy.getSelectedChecklistElementInContextMenu('Country'))
            .toBeTruthy();

        // Then I click "OK" button in context menu of page by selector
        await reportPageBy.saveAndCloseContextMenu();

        // When I open the dropdown list for page by selector "Country"
        await reportPageBy.openDropdownFromSelector('Country');

        // Then The page by selector "Country" dropdown list has element "USA"
        await since(
            'After open the dropdown list for page by selector "Country", The page by selector "Country" dropdown list has element "USA", instead we have #{actual}'
        )
            .expect(await reportPageBy.getElementFromPopupList('USA'))
            .toBeTruthy();

        // And The page by selector "Country" dropdown list has element "Web"
        await since(
            'After open the dropdown list for page by selector "Country", The page by selector "Country" dropdown list has element "Web", instead we have #{actual}'
        )
            .expect(await reportPageBy.getElementFromPopupList('Web'))
            .toBeTruthy();

        // When I select element "USA" from Page by selector "Country"
        await reportPageBy.changePageByElement('Country', 'USA');

        // And the grid cell at "0", "0" has text "Year"
        await since(
            'After select element "USA" from Page by selector "Country", The grid cell at "0", "0" should have text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "0", "1" has text "Region"
        await since(
            'After select element "USA" from Page by selector "Country", The grid cell at "0", "1" should have text "Region", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Region');
        // And the grid cell at "0", "2" has text "Category"
        await since(
            'After select element "USA" from Page by selector "Country", The grid cell at "0", "2" should have text "Category", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Category');

        // And the grid cell at "0", "3" has text "Cost"
        await since(
            'After select element "USA" from Page by selector "Country", The grid cell at "0", "3" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Cost');

        // And the grid cell at "1", "0" has text "2014"
        await since(
            'After select element "USA" from Page by selector "Country", The grid cell at "1", "0" should have text "2014", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('2014');

        // And the grid cell at "1", "1" has text "Central"
        await since(
            'After select element "USA" from Page by selector "Country", The grid cell at "1", "1" should have text "Central", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Central');

        // And the grid cell at "1", "2" has text "Electronics"
        await since(
            'After select element "USA" from Page by selector "Country", The grid cell at "1", "2" should have text "Electronics", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Electronics');

        // And the grid cell at "1", "3" has text "$153,794"
        await since(
            'After select element "USA" from Page by selector "Country", The grid cell at "1", "3" should have text "$153,794", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$153,794');

        // And the grid cell at "15", "0" has text "2016"
        await since(
            'After select element "USA" from Page by selector "Country", The grid cell at "15", "0" should have text "2016", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(15, 0))
            .toBe('2016');

        // And the grid cell at "16", "1" has text "Mid-Atlantic"
        await since(
            'After select element "USA" from Page by selector "Country", The grid cell at "16", "1" should have text "Mid-Atlantic", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(16, 1))
            .toBe('Mid-Atlantic');

        // And the grid cell at "16", "2" has text "Electronics"
        await since(
            'After select element "USA" from Page by selector "Country", The grid cell at "16", "2" should have text "Electronics", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(16, 2))
            .toBe('Electronics');

        // And the grid cell at "16", "3" has text "$208,242"
        await since(
            'After select element "USA" from Page by selector "Country", The grid cell at "16", "3" should have text "$208,242", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(16, 3))
            .toBe('$208,242');
        // When I open context menu of page by selector "Country" to Add Attributes "After" it and click attribute "Call Center"
        await reportPageBy.openSelectorContextMenu('Country');
        await reportGridView.clickContextMenuOption('Add Attributes');
        await reportGridView.clickContextMenuOption('After');
        await reportPageBy.clickChecklistElementInContextMenu('Call Center');

        // Then the checkbox of "Call Center" should be checked in context menu of page by selector
        await since(
            'After open context menu of page by selector "Country" to Add Attributes "After" it and click attribute "Call Center", The checkbox of "Call Center" should be checked in context menu of page by selector, instead we have #{actual}'
        )
            .expect(await reportPageBy.getSelectedChecklistElementInContextMenu('Call Center').isDisplayed())
            .toBe(true);

        // Then I click "OK" button in context menu of page by selector
        await reportPageBy.saveAndCloseContextMenu();

        // Then The current selection for page by selector "Call Center" should be "Atlanta"
        await since(
            'After select element "USA" from Page by selector "Country", The current selection for page by selector "Call Center" should be "Atlanta", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Call Center'))
            .toBe('Atlanta');

        // And the grid cell at "0", "0" has text "Year"
        await since(
            'After select element "USA" from Page by selector "Country", The grid cell at "0", "0" should have text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "0", "1" has text "Region"
        await since(
            'After select element "USA" from Page by selector "Country", The grid cell at "0", "1" should have text "Region", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Region');

        // And the grid cell at "0", "2" has text "Category"
        await since(
            'After select element "USA" from Page by selector "Country", The grid cell at "0", "2" should have text "Category", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Category');

        // And the grid cell at "0", "3" has text "Cost"
        await since(
            'After select element "USA" from Page by selector "Country", The grid cell at "0", "3" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Cost');

        // And the grid cell at "1", "0" has text "2014"
        await since(
            'After select element "USA" from Page by selector "Country", The grid cell at "1", "0" should have text "2014", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('2014');

        // And the grid cell at "1", "1" has text "Southeast"
        await since(
            'After select element "USA" from Page by selector "Country", The grid cell at "1", "1" should have text "Southeast", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Southeast');
        // And the grid cell at "1", "2" has text "Electronics"
        await since(
            'After select element "USA" from Page by selector "Country", The grid cell at "1", "2" should have text "Electronics", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Electronics');

        // And the grid cell at "1", "3" has text "$26,830"
        await since(
            'After select element "USA" from Page by selector "Country", The grid cell at "1", "3" should have text "$26,830", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$26,830');

        // And the grid cell at "3", "0" has text "2016"
        await since(
            'After select element "USA" from Page by selector "Country", The grid cell at "3", "0" should have text "2016", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 0))
            .toBe('2016');

        // And the grid cell at "3", "1" has text "Southeast"
        await since(
            'After select element "USA" from Page by selector "Country", The grid cell at "3", "1" should have text "Southeast", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 1))
            .toBe('Southeast');

        // And the grid cell at "3", "2" has text "Electronics"
        await since(
            'After select element "USA" from Page by selector "Country", The grid cell at "3", "2" should have text "Electronics", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 2))
            .toBe('Electronics');

        // And the grid cell at "3", "3" has text "$41,619"
        await since(
            'After select element "USA" from Page by selector "Country", The grid cell at "3", "3" should have text "$41,619", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 3))
            .toBe('$41,619');

        // When I move object "Cost" to "Page-By" in grid view
        await reportGridView.openGridColumnHeaderContextMenu('Cost');
        await reportGridView.clickContextMenuOption('Move');
        await reportGridView.clickContextMenuOption('To Page-by');

        // Then The current selection for page by selector "Metrics" should be "Cost"
        await since(
            'After move object "Cost" to "Page-By" in grid view, The current selection for page by selector "Metrics" should be "Cost", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Metrics'))
            .toBe('Cost');

        // Then The current selection for page by selector "Country" should be "USA"
        await since(
            'After move object "Cost" to "Page-By" in grid view, The current selection for page by selector "Country" should be "USA", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Country'))
            .toBe('USA');

        // Then The current selection for page by selector "Call Center" should be "Atlanta"
        await since(
            'After move object "Cost" to "Page-By" in grid view, The current selection for page by selector "Call Center" should be "Atlanta", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Call Center'))
            .toBe('Atlanta');
        // Then The current selection for page by selector "Subcategory" should be "Cameras"
        await since(
            'After move object "Cost" to "Page-By" in grid view, The current selection for page by selector "Subcategory" should be "Cameras", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Subcategory'))
            .toBe('Cameras');

        // When I add the object "Profit" to Page-by from In Report tab in Report Editor
        // await reportDatasetPanel.openObjectContextMenu('Profit');
        // await reportDatasetPanel.clickObjectContextMenuItem('Add to Page-by');
        await reportDatasetPanel.addObjectToPageBy('Profit');
        // When I open the dropdown list for page by selector "Metrics"
        await reportPageBy.openDropdownFromSelector('Metrics');

        // Then The page by selector "Metrics" dropdown list has element "Cost"
        await since(
            'After add the object "Profit" to Page-by from In Report tab in Report Editor, The page by selector "Metrics" dropdown list is expected to have element Cost, instead we have #{actual}'
        )
            .expect(await reportPageBy.getElementFromPopupList('Cost').isDisplayed())
            .toBe(true);

        // And The page by selector "Metrics" dropdown list has element "Profit"
        await since(
            'After add the object "Profit" to Page-by from In Report tab in Report Editor, The page by selector "Metrics" dropdown list is expected to have element Profit, instead we have #{actual}'
        )
            .expect(await reportPageBy.getElementFromPopupList('Profit').isDisplayed())
            .toBe(true);

        // Then the index of page by selector "Country" should be "1"
        await since(
            'After add the object "Profit" to Page-by from In Report tab in Report Editor, The index of page by selector "Country" is expected to be 1, instead we have #{actual}'
        )
            .expect(await reportPageBy.getSelectorByIdx(1).getText())
            .toBe('Country');

        // And the index of page by selector "Call Center" should be "2"
        await since(
            'After add the object "Profit" to Page-by from In Report tab in Report Editor, The index of page by selector "Call Center" is expected to be 2, instead we have #{actual}'
        )
            .expect(await reportPageBy.getSelectorByIdx(2).getText())
            .toBe('Call Center');

        // And the index of page by selector "Subcategory" should be "3"
        await since(
            'After add the object "Profit" to Page-by from In Report tab in Report Editor, The index of page by selector "Subcategory" is expected to be 3, instead we have #{actual}'
        )
            .expect(await reportPageBy.getSelectorByIdx(3).getText())
            .toBe('Subcategory');

        // And the index of page by selector "Metrics" should be "4"
        await since(
            'After add the object "Profit" to Page-by from In Report tab in Report Editor, The index of page by selector "Metrics" is expected to be 4, instead we have #{actual}'
        )
            .expect(await reportPageBy.getSelectorByIdx(4).getText())
            .toBe('Metrics');

        // When I open context menu of page by selector Metrics to Show Metrics and click metric "Cost"
        await reportPageBy.openSelectorContextMenu('Metrics');
        await reportGridView.clickContextMenuOption('Show Metrics');
        await reportPageBy.clickChecklistElementInContextMenu('Cost');
        // Then the checkbox of "Cost" should not be checked in context menu of page by selector
        await since(
            'After open context menu of page by selector Metrics to Show Metrics and click metric "Cost", The checkbox of "Cost" should not be checked in context menu of page by selector, instead we have #{actual}'
        )
            .expect(await reportPageBy.getSelectedChecklistElementInContextMenu('Cost').isDisplayed())
            .toBe(false);

        // Then I click "OK" button in context menu of page by selector
        await reportPageBy.saveAndCloseContextMenu();

        // When I open context menu of page by selector Metrics to Show Metrics and click metric "Revenue"
        await reportPageBy.openSelectorContextMenu('Metrics');
        await reportGridView.clickContextMenuOption('Show Metrics');
        await reportPageBy.clickChecklistElementInContextMenu('Revenue');

        // Then the checkbox of "Revenue" should be checked in context menu of page by selector
        await since(
            'After open context menu of page by selector Metrics to Show Metrics and click metric "Revenue", The checkbox of "Revenue" should be checked in context menu of page by selector, instead we have #{actual}'
        )
            .expect(await reportPageBy.getSelectedChecklistElementInContextMenu('Revenue').isDisplayed())
            .toBe(true);

        // Then I click "OK" button in context menu of page by selector
        await reportPageBy.saveAndCloseContextMenu();

        // Then The current selection for page by selector "Metrics" should be "Profit"
        await since(
            'After open context menu of page by selector Metrics to Show Metrics and click metric "Revenue", The current selection for page by selector "Metrics" should be "Profit", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Metrics'))
            .toBe('Profit');

        // When I open the dropdown list for page by selector "Metrics"
        await reportPageBy.openDropdownFromSelector('Metrics');

        // Then The page by selector "Metrics" dropdown list has element "Profit"
        await since(
            'After open the dropdown list for page by selector "Metrics", The page by selector "Metrics" dropdown list has element "Profit", instead we have #{actual}'
        )
            .expect(await reportPageBy.getElementFromPopupList('Profit').isDisplayed())
            .toBe(true);

        // And The page by selector "Metrics" dropdown list has element "Revenue"
        await since(
            'After open the dropdown list for page by selector "Metrics", The page by selector "Metrics" dropdown list has element "Revenue", instead we have #{actual}'
        )
            .expect(await reportPageBy.getElementFromPopupList('Revenue').isDisplayed())
            .toBe(true);

        // And the grid cell at "0", "0" has text "Year"
        await since(
            'After open the dropdown list for page by selector "Metrics", The grid cell at "0", "0" should have text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');
        // And the grid cell at "0", "1" has text "Region"
        await since(
            'After open the dropdown list for page by selector "Metrics", The grid cell at "0", "1" should have text "Region", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Region');

        // And the grid cell at "0", "2" has text "Category"
        await since(
            'After open the dropdown list for page by selector "Metrics", The grid cell at "0", "2" should have text "Category", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Category');

        // And the grid cell at "0", "3" has text "Profit"
        await since(
            'After open the dropdown list for page by selector "Metrics", The grid cell at "0", "3" should have text "Profit", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Profit');

        // And the grid cell at "1", "0" has text "2014"
        await since(
            'After open the dropdown list for page by selector "Metrics", The grid cell at "1", "0" should have text "2014", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('2014');

        // And the grid cell at "1", "1" has text "Southeast"
        await since(
            'After open the dropdown list for page by selector "Metrics", The grid cell at "1", "1" should have text "Southeast", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Southeast');

        // And the grid cell at "1", "2" has text "Electronics"
        await since(
            'After open the dropdown list for page by selector "Metrics", The grid cell at "1", "2" should have text "Electronics", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Electronics');

        // And the grid cell at "1", "3" has text "$5,450"
        await since(
            'After open the dropdown list for page by selector "Metrics", The grid cell at "1", "3" should have text "$5,450", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$5,450');

        // And the grid cell at "3", "0" has text "2016"
        await since(
            'After open the dropdown list for page by selector "Metrics", The grid cell at "3", "0" should have text "2016", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 0))
            .toBe('2016');

        // And the grid cell at "3", "1" has text "Southeast"
        await since(
            'After open the dropdown list for page by selector "Metrics", The grid cell at "3", "1" should have text "Southeast", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 1))
            .toBe('Southeast');

        // And the grid cell at "3", "2" has text "Electronics"
        await since(
            'After open the dropdown list for page by selector "Metrics", The grid cell at "3", "2" should have text "Electronics", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 2))
            .toBe('Electronics');
        // And the grid cell at "3", "3" has text "$9,317"
        await since(
            'After open the dropdown list for page by selector "Metrics", The grid cell at "3", "3" should have text "$9,317", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 3))
            .toBe('$9,317');

        // When I select element "San Diego" from Page by selector "Call Center"
        await reportPageBy.changePageByElement('Call Center', 'San Diego');

        // When I select element "Revenue" from Page by selector "Metrics"
        await reportPageBy.changePageByElement('Metrics', 'Revenue');

        // And the grid cell at "0", "0" has text "Year"
        await since(
            'After select element "San Diego" from Page by selector "Call Center" and select element "Revenue" from Page by selector "Metrics", The grid cell at "0", "0" should have text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "0", "1" has text "Region"
        await since(
            'After select element "San Diego" from Page by selector "Call Center" and select element "Revenue" from Page by selector "Metrics", The grid cell at "0", "1" should have text "Region", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Region');

        // And the grid cell at "0", "2" has text "Category"
        await since(
            'After select element "San Diego" from Page by selector "Call Center" and select element "Revenue" from Page by selector "Metrics", The grid cell at "0", "2" should have text "Category", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Category');

        // And the grid cell at "0", "3" has text "Revenue"
        await since(
            'After select element "San Diego" from Page by selector "Call Center" and select element "Revenue" from Page by selector "Metrics", The grid cell at "0", "3" should have text "Revenue", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Revenue');

        // And the grid cell at "1", "0" has text "2014"
        await since(
            'After select element "San Diego" from Page by selector "Call Center" and select element "Revenue" from Page by selector "Metrics", The grid cell at "1", "0" should have text "2014", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('2014');

        // And the grid cell at "1", "1" has text "Southwest"
        await since(
            'After select element "San Diego" from Page by selector "Call Center" and select element "Revenue" from Page by selector "Metrics", The grid cell at "1", "1" should have text "Southwest", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Southwest');

        // And the grid cell at "1", "2" has text "Electronics"
        await since(
            'After select element "San Diego" from Page by selector "Call Center" and select element "Revenue" from Page by selector "Metrics", The grid cell at "1", "2" should have text "Electronics", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Electronics');
        // And the grid cell at "1", "3" has text "$105,990"
        await since(
            'After select element "San Diego" from Page by selector "Call Center" and select element "Revenue" from Page by selector "Metrics", The grid cell at "1", "3" should have text "$105,990", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$105,990');

        // And the grid cell at "3", "0" has text "2016"
        await since(
            'After select element "San Diego" from Page by selector "Call Center" and select element "Revenue" from Page by selector "Metrics", The grid cell at "3", "0" should have text "2016", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 0))
            .toBe('2016');

        // And the grid cell at "3", "1" has text "Southwest"
        await since(
            'After select element "San Diego" from Page by selector "Call Center" and select element "Revenue" from Page by selector "Metrics", The grid cell at "3", "1" should have text "Southwest", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 1))
            .toBe('Southwest');

        // And the grid cell at "3", "2" has text "Electronics"
        await since(
            'After select element "San Diego" from Page by selector "Call Center" and select element "Revenue" from Page by selector "Metrics", The grid cell at "3", "2" should have text "Electronics", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 2))
            .toBe('Electronics');

        // And the grid cell at "3", "3" has text "$163,977"
        await since(
            'After select element "San Diego" from Page by selector "Call Center" and select element "Revenue" from Page by selector "Metrics", The grid cell at "3", "3" should have text "$163,977", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 3))
            .toBe('$163,977');

        // When I move page by selector "Subcategory" to "Left" in Report Editor
        await reportPageBy.openSelectorContextMenu('Subcategory');
        await reportGridView.clickContextMenuOption('Move');
        await reportGridView.clickContextMenuOption('Left');

        // When I open context menu for page by selector "Subcategory" in Report Editor
        await reportPageBy.openSelectorContextMenu('Subcategory');

        // And option "Add Attributes" in context menu for page by selector in Report Editor should be disabled
        await since(
            'After move page by selector "Subcategory" to "Left" in Report Editor, Option "Add Attributes" in context menu for page by selector should be disabled, instead we have #{actual}'
        )
            .expect(await reportGridView.getDisabledContextMenuOption('Add Attributes').isDisplayed())
            .toBe(true);

        // Then I click option "Move" in context menu for page by selector in Report Editor
        await reportGridView.clickContextMenuOption('Move');

        // And the context menu in page by container in Report Editor should have option "To Rows"
        await since(
            'After move page by selector "Subcategory" to "Left" in Report Editor, The context menu in page by container should have option "To Rows", instead we have #{actual}'
        )
            .expect(await reportEditorPanel.contextMenuContainsOption('To Rows'))
            .toBe(true);
        // And the context menu in page by container in Report Editor should have option "To Columns"
        await since(
            'After move page by selector "Subcategory" to "Left" in Report Editor, The context menu in page by container should have option "To Columns", instead we have #{actual}'
        )
            .expect(await reportGridView.getContextMenuOption('To Columns'))
            .toBeTruthy();

        // And the context menu in page by container in Report Editor should have option "Left"
        await since(
            'After move page by selector "Subcategory" to "Left" in Report Editor, The context menu in page by container should have option "Left", instead we have #{actual}'
        )
            .expect(await reportGridView.getContextMenuOption('Left'))
            .toBeTruthy();

        // And the context menu in page by container in Report Editor should have option "Right"
        await since(
            'After move page by selector "Subcategory" to "Left" in Report Editor, The context menu in page by container should have option "Right", instead we have #{actual}'
        )
            .expect(await reportGridView.getContextMenuOption('Right'))
            .toBeTruthy();

        // Then the index of page by selector "Country" should be "1"
        await since(
            'After move page by selector "Subcategory" to "Left" in Report Editor, The index of page by selector "Country" should be "1", instead we have #{actual}'
        )
            .expect(await reportPageBy.getSelectorByIdx(1).getText())
            .toBe('Country');

        // And the index of page by selector "Subcategory" should be "2"
        await since(
            'After move page by selector "Subcategory" to "Left" in Report Editor, The index of page by selector "Subcategory" should be "2", instead we have #{actual}'
        )
            .expect(await reportPageBy.getSelectorByIdx(2).getText())
            .toBe('Subcategory');

        // And the index of page by selector "Call Center" should be "3"
        await since(
            'After move page by selector "Subcategory" to "Left" in Report Editor, The index of page by selector "Call Center" should be "3", instead we have #{actual}'
        )
            .expect(await reportPageBy.getSelectorByIdx(3).getText())
            .toBe('Call Center');

        // And the index of page by selector "Metrics" should be "4"
        await since(
            'After move page by selector "Subcategory" to "Left" in Report Editor, The index of page by selector "Metrics" should be "4", instead we have #{actual}'
        )
            .expect(await reportPageBy.getSelectorByIdx(4).getText())
            .toBe('Metrics');

        // When I move page by selector "Subcategory" to "Left" in Report Editor
        // await reportPageBy.openSelectorContextMenu('Subcategory');
        await reportGridView.clickContextMenuOption('Move');
        await reportGridView.clickContextMenuOption('Left');

        // When I open context menu for page by selector "Subcategory" in Report Editor
        await reportPageBy.openSelectorContextMenu('Subcategory');

        // Then option "Add Attributes" in context menu for page by selector in Report Editor should be disabled
        await since(
            'After move page by selector "Subcategory" to "Left" in Report Editor, Option "Add Attributes" in context menu for page by selector should be disabled, instead we have #{actual}'
        )
            .expect(await reportGridView.getDisabledContextMenuOption('Add Attributes'))
            .toBeTruthy();
        // When I click option "Move" in context menu for page by selector in Report Editor
        await reportGridView.clickContextMenuOption('Move');

        // And the context menu in page by container in Report Editor should have option "To Rows"
        await since(
            'After move page by selector "Subcategory" to "Left" in Report Editor, The context menu in page by container should have option "To Rows", instead we have #{actual}'
        )
            .expect(await reportGridView.getContextMenuOption('To Rows'))
            .toBeTruthy();

        // And the context menu in page by container in Report Editor should have option "To Columns"
        await since(
            'After move page by selector "Subcategory" to "Left" in Report Editor, The context menu in page by container should have option "To Columns", instead we have #{actual}'
        )
            .expect(await reportGridView.getContextMenuOption('To Columns'))
            .toBeTruthy();

        // And the context menu in page by container in Report Editor should not have option "Left"
        await since(
            'After move page by selector "Subcategory" to "Left" in Report Editor, The context menu in page by container should not have option "Left", instead we have #{actual}'
        )
            .expect(await reportGridView.getContextMenuOption('Left').isDisplayed())
            .toBeFalsy();

        // And the context menu in page by container in Report Editor should have option "Right"
        await since(
            'After move page by selector "Subcategory" to "Left" in Report Editor, The context menu in page by container should have option "Right", instead we have #{actual}'
        )
            .expect(await reportGridView.getContextMenuOption('Right'))
            .toBeTruthy();

        // Then the index of page by selector "Subcategory" should be "1"
        await since(
            'After move page by selector "Subcategory" to "Left" in Report Editor, The index of page by selector "Subcategory" should be "1", instead we have #{actual}'
        )
            .expect(await reportPageBy.getSelectorByIdx(1).getText())
            .toBe('Subcategory');

        // And the index of page by selector "Country" should be "2"
        await since(
            'After move page by selector "Subcategory" to "Left" in Report Editor, The index of page by selector "Country" should be "2", instead we have #{actual}'
        )
            .expect(await reportPageBy.getSelectorByIdx(2).getText())
            .toBe('Country');

        // And the index of page by selector "Call Center" should be "3"
        await since(
            'After move page by selector "Subcategory" to "Left" in Report Editor, The index of page by selector "Call Center" should be "3", instead we have #{actual}'
        )
            .expect(await reportPageBy.getSelectorByIdx(3).getText())
            .toBe('Call Center');

        // And the index of page by selector "Metrics" should be "4"
        await since(
            'After move page by selector "Subcategory" to "Left" in Report Editor, The index of page by selector "Metrics" should be "4", instead we have #{actual}'
        )
            .expect(await reportPageBy.getSelectorByIdx(4).getText())
            .toBe('Metrics');

        // When I open context menu for page by selector "Metrics" in Report Editor
        await reportPageBy.openSelectorContextMenu('Metrics');
        // When I click option "Move" in context menu for page by selector in Report Editor
        await reportGridView.clickContextMenuOption('Move');

        // And the context menu in page by container in Report Editor should have option "To Rows"
        await since(
            'After move page by selector "Subcategory" to "Left" in Report Editor, The context menu in page by container should have option "To Rows", instead we have #{actual}'
        )
            .expect(await reportGridView.getContextMenuOption('To Rows'))
            .toBeTruthy();

        // And the context menu in page by container in Report Editor should have option "To Columns"
        await since(
            'After move page by selector "Subcategory" to "Left" in Report Editor, The context menu in page by container should have option "To Columns", instead we have #{actual}'
        )
            .expect(await reportGridView.getContextMenuOption('To Columns'))
            .toBeTruthy();

        // And the context menu in page by container in Report Editor should have option "Left"
        await since(
            'After move page by selector "Subcategory" to "Left" in Report Editor, The context menu in page by container should have option "Left", instead we have #{actual}'
        )
            .expect(await reportGridView.getContextMenuOption('Left'))
            .toBeTruthy();

        // And the context menu in page by container in Report Editor should not have option "Right"
        await since(
            'After move page by selector "Subcategory" to "Left" in Report Editor, The context menu in page by container should not have option "Right", instead we have #{actual}'
        )
            .expect(await reportGridView.getContextMenuOption('Right').isDisplayed())
            .toBeFalsy();

        // When I move page by selector "Metrics" to "Left" in Report Editor
        await reportPageBy.openSelectorContextMenu('Metrics');
        await reportGridView.clickContextMenuOption('Move');
        await reportGridView.clickContextMenuOption('Left');

        // When I open context menu for page by selector "Metrics" in Report Editor
        await reportPageBy.openSelectorContextMenu('Metrics');

        // Then the index of page by selector "Subcategory" should be "1"
        await since(
            'After move page by selector "Subcategory" to "Left" in Report Editor, The index of page by selector "Subcategory" should be "1", instead we have #{actual}'
        )
            .expect(await reportPageBy.getSelectorByIdx(1).getText())
            .toBe('Subcategory');

        // And the index of page by selector "Country" should be "2"
        await since(
            'After move page by selector "Subcategory" to "Left" in Report Editor, The index of page by selector "Country" should be "2", instead we have #{actual}'
        )
            .expect(await reportPageBy.getSelectorByIdx(2).getText())
            .toBe('Country');

        // And the index of page by selector "Metrics" should be "3"
        await since(
            'After move page by selector "Subcategory" to "Left" in Report Editor, The index of page by selector "Metrics" should be "3", instead we have #{actual}'
        )
            .expect(await reportPageBy.getSelectorByIdx(3).getText())
            .toBe('Metrics');
        // And the index of page by selector "Call Center" should be "4"
        await since(
            'After move page by selector "Subcategory" to "Left" in Report Editor, The index of page by selector "Call Center" should be "4", instead we have #{actual}'
        )
            .expect(await reportPageBy.getSelectorByIdx(4).getText())
            .toBe('Call Center');

        // When I select element "Business" from Page by selector "Subcategory"
        await reportPageBy.changePageByElement('Subcategory', 'Business');

        // When I select element "Web" from Page by selector "Country"
        await reportPageBy.changePageByElement('Country', 'Web');

        // When I select element "Profit" from Page by selector "Metrics"
        await reportPageBy.changePageByElement('Metrics', 'Profit');

        // And the grid cell at "0", "0" has text "Year"
        await since(
            'After select element "Business" from Page by selector "Subcategory" and select element "Web" from Page by selector "Country" and select element "Profit" from Page by selector "Metrics", The grid cell at "0", "0" should have text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "0", "1" has text "Region"
        await since(
            'After select element "Business" from Page by selector "Subcategory" and select element "Web" from Page by selector "Country" and select element "Profit" from Page by selector "Metrics", The grid cell at "0", "1" should have text "Region", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Region');

        // And the grid cell at "0", "2" has text "Category"
        await since(
            'After select element "Business" from Page by selector "Subcategory" and select element "Web" from Page by selector "Country" and select element "Profit" from Page by selector "Metrics", The grid cell at "0", "2" should have text "Category", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Category');

        // And the grid cell at "0", "3" has text "Profit"
        await since(
            'After select element "Business" from Page by selector "Subcategory" and select element "Web" from Page by selector "Country" and select element "Profit" from Page by selector "Metrics", The grid cell at "0", "3" should have text "Profit", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Profit');

        // And the grid cell at "1", "0" has text "2014"
        await since(
            'After select element "Business" from Page by selector "Subcategory" and select element "Web" from Page by selector "Country" and select element "Profit" from Page by selector "Metrics", The grid cell at "1", "0" should have text "2014", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('2014');

        // And the grid cell at "1", "1" has text "Web"
        await since(
            'After select element "Business" from Page by selector "Subcategory" and select element "Web" from Page by selector "Country" and select element "Profit" from Page by selector "Metrics", The grid cell at "1", "1" should have text "Web", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Web');
        // And the grid cell at "1", "2" has text "Books"
        await since(
            'After select element "Business" from Page by selector "Subcategory" and select element "Web" from Page by selector "Country" and select element "Profit" from Page by selector "Metrics", The grid cell at "1", "2" should have text "Books", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Books');

        // And the grid cell at "1", "3" has text "$1,296"
        await since(
            'After select element "Business" from Page by selector "Subcategory" and select element "Web" from Page by selector "Country" and select element "Profit" from Page by selector "Metrics", The grid cell at "1", "3" should have text "$1,296", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$1,296');

        // And the grid cell at "3", "0" has text "2016"
        await since(
            'After select element "Business" from Page by selector "Subcategory" and select element "Web" from Page by selector "Country" and select element "Profit" from Page by selector "Metrics", The grid cell at "3", "0" should have text "2016", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 0))
            .toBe('2016');

        // And the grid cell at "3", "1" has text "Web"
        await since(
            'After select element "Business" from Page by selector "Subcategory" and select element "Web" from Page by selector "Country" and select element "Profit" from Page by selector "Metrics", The grid cell at "3", "1" should have text "Web", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 1))
            .toBe('Web');

        // And the grid cell at "3", "2" has text "Books"
        await since(
            'After select element "Business" from Page by selector "Subcategory" and select element "Web" from Page by selector "Country" and select element "Profit" from Page by selector "Metrics", The grid cell at "3", "2" should have text "Books", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 2))
            .toBe('Books');

        // And the grid cell at "3", "3" has text "$5,680"
        await since(
            'After select element "Business" from Page by selector "Subcategory" and select element "Web" from Page by selector "Country" and select element "Profit" from Page by selector "Metrics", The grid cell at "3", "3" should have text "$5,680", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 3))
            .toBe('$5,680');

        // // When I search element "Po" from Page by selector "Subcategory"
        // await reportPageBy.searchElementfromSelector('Subcategory', 'po');
        // await since(
        //     'After search po in Subcategory, the dropdown list should have #{expected}, instead we have #{actual}'
        // )
        //     .expect(JSON.stringify(await reportPageBy.getAllElementsFromPopupList()))
        //     .toBe(JSON.stringify(['Sports & Health', 'Pop']));

        // Then I select element "p" from Page by selector "Subcategory"
        await reportPageBy.changePageByElement('Subcategory', 'Pop');
        // And the grid cell at "0", "0" has text "Year"
        await since(
            'After select element "Pop" from Page by selector "Subcategory", The grid cell at "0", "0" should have text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "0", "1" has text "Region"
        await since(
            'After select element "Pop" from Page by selector "Subcategory", The grid cell at "0", "1" should have text "Region", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Region');

        // And the grid cell at "0", "2" has text "Category"
        await since(
            'After select element "Pop" from Page by selector "Subcategory", The grid cell at "0", "2" should have text "Category", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Category');

        // And the grid cell at "0", "3" has text "Profit"
        await since(
            'After select element "Pop" from Page by selector "Subcategory", The grid cell at "0", "3" should have text "Profit", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Profit');

        // And the grid cell at "1", "0" has text "2014"
        await since(
            'After select element "Pop" from Page by selector "Subcategory", The grid cell at "1", "0" should have text "2014", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('2014');

        // And the grid cell at "1", "1" has text "Web"
        await since(
            'After select element "Pop" from Page by selector "Subcategory", The grid cell at "1", "1" should have text "Web", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Web');

        // And the grid cell at "1", "2" has text "Music"
        await since(
            'After select element "Pop" from Page by selector "Subcategory", The grid cell at "1", "2" should have text "Music", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Music');

        // And the grid cell at "1", "3" has text "$277"
        await since(
            'After select element "Pop" from Page by selector "Subcategory", The grid cell at "1", "3" should have text "$277", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$277');

        // And the grid cell at "3", "0" has text "2016"
        await since(
            'After select element "Pop" from Page by selector "Subcategory", The grid cell at "3", "0" should have text "2016", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 0))
            .toBe('2016');

        // And the grid cell at "3", "1" has text "Web"
        await since(
            'After select element "Pop" from Page by selector "Subcategory", The grid cell at "3", "1" should have text "Web", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 1))
            .toBe('Web');
        // And the grid cell at "3", "2" has text "Music"
        await since(
            'After select element "Pop" from Page by selector "Subcategory", The grid cell at "3", "2" should have text "Music", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 2))
            .toBe('Music');

        // And the grid cell at "3", "3" has text "$1,306"
        await since(
            'After select element "Pop" from Page by selector "Subcategory", The grid cell at "3", "3" should have text "$1,306", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 3))
            .toBe('$1,306');

        // When I sort descending the "attribute" "Subcategory" in "PageBy" dropzone in Editor Panel
        await reportEditorPanel.openObjectContextMenu('PageBy', 'attribute', 'Subcategory');
        await reportDatasetPanel.clickObjectContextMenuItem('Sort Descending');
        // When I open the dropdown list for page by selector "Subcategory"
        await reportPageBy.openDropdownFromSelector('Subcategory');

        // Then The index of element "Pop" is 7 in page by selector
        await since('The index of element "Pop" should be 7, instead we have #{actual}')
            .expect(await reportPageBy.getIndexForElementFromPopupList('Pop'))
            .toBe('7');

        // When I select element "USA" from Page by selector "Country"

        // When I sort descending the "attribute" "Call Center" in "PageBy" dropzone in Editor Panel
        await reportEditorPanel.openObjectContextMenu('PageBy', 'attribute', 'Call Center');
        await reportDatasetPanel.clickObjectContextMenuItem('Sort Descending');
        // When I move page by selector "Call Center" to "Rows" in Report Editor
        await reportPageBy.openSelectorContextMenu('Call Center');
        await reportGridView.clickContextMenuOption('Move');
        await reportGridView.clickContextMenuOption('To Rows');
        // Then The current selection for page by selector "Subcategory" should be "Pop"
        await since(
            'After move page by selector "Call Center" to "Rows" in Report Editor, The current selection for page by selector "Subcategory" should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Subcategory'))
            .toBe('Pop');

        // Then The current selection for page by selector "Country" should be "USA"
        await since(
            'After move page by selector "Call Center" to "Rows" in Report Editor, The current selection for page by selector "Country" should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Country'))
            .toBe('Web');

        // Then The current selection for page by selector "Metrics" should be "Revenue"
        await since(
            'After move page by selector "Call Center" to "Rows" in Report Editor, The current selection for page by selector "Metrics" should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Metrics'))
            .toBe('Profit');

        // And the grid cell at "0", "0" has text "Call Center"
        await since(
            'After move page by selector "Call Center" to "Rows" in Report Editor, The grid cell at "0", "0" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Call Center');

        // And the grid cell at "0", "2" has text "Year"
        await since(
            'After move page by selector "Call Center" to "Rows" in Report Editor, The grid cell at "0", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Region');

        // And the grid cell at "0", "3" has text "Region"
        await since(
            'After move page by selector "Call Center" to "Rows" in Report Editor, The grid cell at "0", "3" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Category');

        // And the grid cell at "0", "4" has text "Category"
        await since(
            'After move page by selector "Call Center" to "Rows" in Report Editor, The grid cell at "0", "4" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('Profit');
        // And the grid cell at "1", "0" has text "Washington, DC"
        await since(
            'After move page by selector "Call Center" to "Rows" in Report Editor, The grid cell at "1", "0" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Web');
        // And the grid cell at "1", "1" has text "5"
        await since(
            'After move page by selector "Call Center" to "Rows" in Report Editor, The grid cell at "1", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('2014');

        // And the grid cell at "1", "3" has text "Mid-Atlantic"
        await since(
            'After move page by selector "Call Center" to "Rows" in Report Editor, The grid cell at "1", "3" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('Music');

        // And the grid cell at "1", "4" has text "Music"
        await since(
            'After move page by selector "Call Center" to "Rows" in Report Editor, The grid cell at "1", "4" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('$277');

        // When I move page by selector "Country" to "Columns" in Report Editor
        await reportPageBy.openSelectorContextMenu('Country');
        await reportGridView.clickContextMenuOption('Move');
        await reportGridView.clickContextMenuOption('To Columns');

        // Then The current selection for page by selector "Subcategory" should be "Pop"
        await since(
            'After move page by selector "Country" to "Columns" in Report Editor, The current selection for page by selector "Subcategory" should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Subcategory'))
            .toBe('Pop');

        // Then The current selection for page by selector "Metrics" should be "Revenue"
        await since(
            'After move page by selector "Country" to "Columns" in Report Editor, The current selection for page by selector "Metrics" should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Metrics'))
            .toBe('Profit');

        // And the grid cell at "0", "0" has text "Call Center"
        await since(
            'After move page by selector "Country" to "Columns" in Report Editor, The grid cell at "0", "0" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Call Center');

        // And the grid cell at "0", "2" has text "Year"
        await since(
            'After move page by selector "Country" to "Columns" in Report Editor, The grid cell at "0", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Region');

        // And the grid cell at "0", "3" has text "Region"
        await since(
            'After move page by selector "Country" to "Columns" in Report Editor, The grid cell at "0", "3" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Category');

        // And the grid cell at "0", "4" has text "Category"
        await since(
            'After move page by selector "Country" to "Columns" in Report Editor, The grid cell at "0", "4" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('USA');

        // And the grid cell at "0", "5" has text "USA"
        await since(
            'After move page by selector "Country" to "Columns" in Report Editor, The grid cell at "0", "5" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 5))
            .toBe('Web');
    });
});
