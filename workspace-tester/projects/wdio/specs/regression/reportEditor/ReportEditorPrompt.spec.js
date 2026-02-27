import * as reportConstants from '../../../constants/report.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';

describe('Prompt in Report Editor in Workstation', () => {
    let {
        loginPage,
        libraryPage,
        reportDatasetPanel,
        reportToolbar,
        reportEditorPanel,
        reportGridView,
        reportPageBy,
        reportTOC,
        reportPromptEditor,
        reportFilterPanel,
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

    it('[TC85101] Test object prompt in report editor in workstation', async () => {
        await libraryPage.createNewReportByUrl({});

        await reportDatasetPanel.selectMultipleItemsInObjectList(['Public Objects', 'Prompts']);

        // And I add the object "Choose from a list of attributes" to Rows from Object Browser in Report Editor
        await reportDatasetPanel.addObjectToRows('Choose from a list of attributes');

        // And I add the object "Choose from a list of metrics" to Columns from Object Browser in Report Editor
        await reportDatasetPanel.addObjectToColumns('Choose from a list of metrics');

        // When I switch to "In Report" tab in dataset panel in Report Editor
        // await reportDatasetPanel.switchToInReportTab();

        // Then I will see object "Choose from a list of attributes" in In Report tab in Report Editor
        await since('The object "Choose from a list of attributes" should be visible in In Report tab')
            .expect(await reportDatasetPanel.isObjectInReportTabDisplayed('Choose from a list of attributes'))
            .toBe(true);

        // And I will see object "Choose from a list of metrics" in In Report tab in Report Editor
        await since('The object "Choose from a list of metrics" should be visible in In Report tab')
            .expect(await reportDatasetPanel.isObjectInReportTabDisplayed('Choose from a list of metrics'))
            .toBe(true);

        // When I switch to design mode in Report Editor
        await reportToolbar.switchToDesignMode();

        // // When I double click available object "Year" in "Choose from a list of attributes." section with index "1." in prompt editor in Report Editor
        // await reportPromptEditor.chooseItemInAvailableCart(1, 'Choose from a list of attributes.', 'Year');

        // // And I double click available object "Region" in "Choose from a list of attributes." section with index "1." in prompt editor in Report Editor
        // await reportPromptEditor.chooseItemInAvailableCart(1, 'Choose from a list of attributes.', 'Region');
        // // And I double click available object "Category" in "Choose from a list of attributes." section with index "1." in prompt editor in Report Editor
        // await reportPromptEditor.chooseItemInAvailableCart(1, 'Choose from a list of attributes.', 'Category');

        await reportPromptEditor.chooseItemsInAvailableCart(1, 'Choose from a list of attributes.', [
            'Year',
            'Region',
            'Category',
        ]);
        // And I click Apply button in Report Prompt Editor
        await reportPromptEditor.clickApplyButtonInReportPromptEditor();

        // Then I will see Alert message "Some problems were found with one or more of your selections.  Please review your answers and follow the instructions marked by a red flag."
        await since('Alert message should be #{expected}, instead we have #{actual}')
            .expect(await reportPromptEditor.errorMsg())
            .toBe('Please review your answers and follow the instructions marked by a warning icon.');

        // Then I click OK button in Alert in Report Prompt Editor
        await reportPromptEditor.clickErrorActionButton('OK');

        // When I click button "Add All" in "Choose from a list of metrics." section with index "2." in prompt editor in Report Editor
        await reportPromptEditor.clickButtonInListCart(2, 'Choose from a list of metrics.', 'Add All');

        // And I double click selected object "Profit Margin" in "Choose from a list of metrics." section with index "2." in prompt editor in Report Editor
        await reportPromptEditor.doubleClickSelectedItem(2, 'Choose from a list of metrics.', 'Profit Margin');

        // And I double click selected object "Units Sold" in "Choose from a list of metrics." section with index "2." in prompt editor in Report Editor
        await reportPromptEditor.doubleClickSelectedItem(2, 'Choose from a list of metrics.', 'Units Sold');

        // When I toggle the button for View Summary in prompt editor in Report Editor
        await reportPromptEditor.toggleViewSummaryBtn();

        // Then The summary for "Choose from a list of attributes." section with index "1." contains text "Year, Region, Category" in prompt editor in Report Editor
        await since('Summary should contain Year, Region, Category, instead we have #{actual}')
            .expect(await reportPromptEditor.getSummaryText(1, 'Choose from a list of attributes.'))
            .toContain('Year, Region, Category');

        // And The summary for "Choose from a list of metrics." section with index "2." contains text "Revenue, Cost, Profit" in prompt editor in Report Editor
        await since('Summary should contain Revenue, Cost, Profit, instead we have #{actual}')
            .expect(await reportPromptEditor.getSummaryText(2, 'Choose from a list of metrics.'))
            .toContain('Revenue, Cost, Profit');
        // When I click Apply button in Report Prompt Editor
        await reportPromptEditor.clickApplyButtonInReportPromptEditor();

        await since('After answer prompt, the objects in report pane should be #{expected}, instead we have #{actual}')
            .expect(JSON.stringify(await reportDatasetPanel.getAllElementsInReportPane()))
            .toBe(JSON.stringify(['Category', 'Region', 'Year', 'Cost', 'Profit', 'Revenue']));

        // await takeScreenshotByElement(reportEditorPanel.metricsDropzone, 'TC85101', 'metrics dropzone');
        // await takeScreenshotByElement(reportEditorPanel.rowsDropzone, 'TC85101', 'rows dropzone');
        await since('After answer prompt, the metrics dropzone should have #{expected} instead we have #{actual}')
            .expect(JSON.stringify(await reportEditorPanel.getMetricsObjects()))
            .toBe(JSON.stringify(['Revenue', 'Cost', 'Profit']));
        await since('After answer prompt, the rows dropzone should have #{expected} instead we have #{actual}')
            .expect(JSON.stringify(await reportEditorPanel.getRowsObjects()))
            .toBe(JSON.stringify(['Year', 'Region', 'Category']));

        // Then the grid cell at "0", "0" has text "Year"
        await since('The grid cell at "0", "0" should have text "Year", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "0", "1" has text "Region"
        await since('The grid cell at "0", "1" should have text "Region", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Region');

        // And the grid cell at "0", "2" has text "Category"
        await since('The grid cell at "0", "2" should have text "Category", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Category');

        // And the grid cell at "0", "3" has text "Revenue"
        await since('The grid cell at "0", "3" should have text "Revenue", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Revenue');

        // And the grid cell at "0", "4" has text "Cost"
        await since('The grid cell at "0", "4" should have text "Cost", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('Cost');

        // And the grid cell at "0", "5" has text "Profit"
        await since('The grid cell at "0", "5" should have text "Profit", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 5))
            .toBe('Profit');

        // And the grid cell at "1", "0" has text "2014"
        await since('The grid cell at "1", "0" should have text "2014", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('2014');
        // And the grid cell at "5", "1" has text "Mid-Atlantic"
        await since('The grid cell at "5", "1" should have text "Mid-Atlantic", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(5, 1))
            .toBe('Mid-Atlantic');

        // And the grid cell at "6", "2" has text "Electronics"
        await since('The grid cell at "6", "2" should have text "Electronics", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(6, 2))
            .toBe('Electronics');

        // And the grid cell at "1", "3" has text "$98,202"
        await since('The grid cell at "1", "3" should have text "$98,202", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$98,202');

        // And the grid cell at "7", "4" has text "$125,621"
        await since('The grid cell at "7", "4" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(7, 4))
            .toBe('$125,621');

        // And the grid cell at "13", "5" has text "$7,301"
        await since('The grid cell at "13", "5" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(13, 5))
            .toBe('$7,301');

        // When I switch to "Filter" Panel in Report Editor
        await reportTOC.switchToFilterPanel();

        // And I click the plus button to open a new qualification editor in Filter panel at non-aggregation level in Report Editor
        await reportFilterPanel.openNewQualicationEditorAtNonAggregationLevel();

        // And I search "Attribute" "Year" in the based on search box and select the searched result
        await reportFilterPanel.searchAttributeObjectInSearchbox('Year');

        // And I select "2015:1/1/2015" in the elements list
        await reportFilterPanel.selectElements(['2015:1/1/2015']);

        // And I click "Done" button to close the qualification editor
        await reportFilterPanel.clickQualificationEditorBtn('Done');
        // And I click Apply button to submit the Filters
        await reportFilterPanel.clickFilterApplyButton();

        // Then the grid cell at "0", "0" has text "Year"
        await since('The grid cell at "0", "0" should have text "Year", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "0", "1" has text "Region"
        await since('The grid cell at "0", "1" should have text "Region", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Region');

        // And the grid cell at "0", "2" has text "Category"
        await since('The grid cell at "0", "2" should have text "Category", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Category');

        // And the grid cell at "0", "3" has text "Revenue"
        await since('The grid cell at "0", "3" should have text "Revenue", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Revenue');

        // And the grid cell at "0", "4" has text "Cost"
        await since('The grid cell at "0", "4" should have text "Cost", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('Cost');

        // And the grid cell at "0", "5" has text "Profit"
        await since('The grid cell at "0", "5" should have text "Profit", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 5))
            .toBe('Profit');

        // And the grid cell at "1", "0" has text "2015"
        await since('The grid cell at "1", "0" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('2015');

        // And the grid cell at "5", "1" has text "Mid-Atlantic"
        await since('The grid cell at "5", "1" should have text "Mid-Atlantic", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(5, 1))
            .toBe('Mid-Atlantic');

        // And the grid cell at "6", "2" has text "Electronics"
        await since('The grid cell at "6", "2" should have text "Electronics", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(6, 2))
            .toBe('Electronics');
        // And the grid cell at "1", "3" has text "$124,046"
        await since('The grid cell at "1", "3" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$124,046');

        // And the grid cell at "7", "4" has text "$164,567"
        await since('The grid cell at "7", "4" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(7, 4))
            .toBe('$164,567');

        // And the grid cell at "13", "5" has text "$9,962"
        await since('The grid cell at "13", "5" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(13, 5))
            .toBe('$9,962');

        // When I click the reprompt icon in Report Editor
        await browser.pause(2000);
        await reportToolbar.rePrompt();

        // And I double click selected object "Category" in "Choose from a list of attributes." section with index "1." in prompt editor in Report Editor
        await reportPromptEditor.doubleClickSelectedItem(1, 'Choose from a list of attributes.', 'Category');

        // And I double click available object "Subcategory" in "Choose from a list of attributes." section with index "1." in prompt editor in Report Editor
        await reportPromptEditor.chooseItemInAvailableCart(1, 'Choose from a list of attributes.', 'Subcategory');

        // And I single click selected object "Subcategory" in "Choose from a list of attributes." section with index "1." in prompt editor in Report Editor
        await reportPromptEditor.singleClickSelectedItem(1, 'Choose from a list of attributes.', 'Subcategory');

        // And I click button "Move down" in "Choose from a list of attributes." section with index "1." in prompt editor in Report Editor
        await reportPromptEditor.clickButtonInListCart(1, 'Choose from a list of attributes.', 'Move down');

        // And I double click selected object "Profit" in "Choose from a list of metrics." section with index "2." in prompt editor in Report Editor
        await reportPromptEditor.doubleClickSelectedItem(2, 'Choose from a list of metrics.', 'Profit');

        // And I double click available object "Profit Margin" in "Choose from a list of metrics." section with index "2." in prompt editor in Report Editor
        await reportPromptEditor.chooseItemInAvailableCart(2, 'Choose from a list of metrics.', 'Profit Margin');
        // And I single click selected object "Profit Margin" in "Choose from a list of metrics." section with index "2." in prompt editor in Report Editor
        await reportPromptEditor.singleClickSelectedItem(2, 'Choose from a list of metrics.', 'Profit Margin');

        // And I click button "Move down" in "Choose from a list of metrics." section with index "2." in prompt editor in Report Editor
        await reportPromptEditor.clickButtonInListCart(2, 'Choose from a list of metrics.', 'Move down');

        // When I click Apply button in Report Prompt Editor
        await reportPromptEditor.clickApplyButtonInReportPromptEditor();

        // Then the grid cell at "0", "0" has text "Year"
        await since('The grid cell at "0", "0" should have Year, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "0", "1" has text "Region"
        await since('The grid cell at "0", "1" should have Region, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Region');

        // And the grid cell at "0", "2" has text "Subcategory"
        await since('The grid cell at "0", "2" should have Subcategory, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Subcategory');

        // And the grid cell at "0", "3" has text "Revenue"
        await since('The grid cell at "0", "3" should have Revenue, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Revenue');

        // And the grid cell at "0", "4" has text "Cost"
        await since('The grid cell at "0", "4" should have Cost, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('Cost');

        // And the grid cell at "0", "5" has text "Profit Margin"
        await since('The grid cell at "0", "5" should have Profit, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 5))
            .toBe('Profit Margin');

        // And the grid cell at "1", "0" has text "2015"
        await since('The grid cell at "1", "0" should have 2015, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('2015');
        // And the grid cell at "1", "1" has text "Central"
        await since('The grid cell at "1", "1" should have text "Central", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Central');

        // And the grid cell at "6", "2" has text "Sports & Health"
        await since('The grid cell at "6", "2" should have text "Sports & Health", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(6, 2))
            .toBe('Sports & Health');

        // And the grid cell at "1", "3" has text "$22,372"
        await since('The grid cell at "1", "3" should have text "$22,372", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$22,372');

        // And the grid cell at "7", "4" has text "$151,043"
        await since('The grid cell at "7", "4" should have text "$151,043", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(7, 4))
            .toBe('$151,043');

        // And the grid cell at "13", "5" has text "6.23%"
        await since('The grid cell at "13", "5" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(13, 5))
            .toBe('6.23%');

        // When I switch to "Editor" Panel in Report Editor
        await reportTOC.switchToEditorPanel();

        // Then I remove the "attribute" "Subcategory" in "Rows" dropzone from Editor Panel in Report Editor
        await reportEditorPanel.removeObjectInDropzone('Rows', 'attribute', 'Subcategory');

        // And I add the object "Subcategory" to Page-by from Object Browser in Report Editor
        await reportDatasetPanel.addObjectToPageBy('Subcategory');

        // Then The current selection for page by selector "Subcategory" should be "Art & Architecture"
        await since(
            'The current selection for page by selector "Subcategory" should be "Art & Architecture", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Subcategory'))
            .toBe('Art & Architecture');

        // Then the grid cell at "0", "0" has text "Year"
        await since('The grid cell at "0", "0" should have text "Year", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');
        // And the grid cell at "0", "1" has text "Region"
        await since('The grid cell at "0", "1" should have text "Region", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Region');

        // And the grid cell at "0", "2" has text "Revenue"
        await since('The grid cell at "0", "2" should have text "Revenue", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Revenue');

        // And the grid cell at "0", "3" has text "Cost"
        await since('The grid cell at "0", "3" should have text "Cost", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Cost');

        // And the grid cell at "0", "4" has text "Profit Margin"
        await since('The grid cell at "0", "4" should have text "Profit Margin", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('Profit Margin');

        // And the grid cell at "1", "0" has text "2015"
        await since('The grid cell at "1", "0" should have text "2015", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('2015');

        // And the grid cell at "5", "1" has text "South"
        await since('The grid cell at "5", "1" should have text "South", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(5, 1))
            .toBe('South');

        // And the grid cell at "1", "2" has text "$22,372"
        await since('The grid cell at "1", "2" should have text "$22,372", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('$22,372');

        // And the grid cell at "2", "3" has text "$16,515"
        await since('The grid cell at "2", "3" should have text "$16,515", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('$16,515');

        // And the grid cell at "3", "4" has text "23.07%"
        await since('The grid cell at "3", "4" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(3, 4))
            .toBe('23.07%');

        // Then I select element "Literature" from Page by selector "Subcategory"
        await reportPageBy.changePageByElement('Subcategory', 'Literature');
        // Then the grid cell at "0", "0" has text "Year"
        await since('The grid cell at "0", "0" should have text "Year", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "0", "1" has text "Region"
        await since('The grid cell at "0", "1" should have text "Region", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Region');

        // And the grid cell at "0", "2" has text "Revenue"
        await since('The grid cell at "0", "2" should have text "Revenue", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Revenue');

        // And the grid cell at "0", "3" has text "Cost"
        await since('The grid cell at "0", "3" should have text "Cost", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Cost');

        // // And the grid cell at "0", "4" has text "Profit Margin"
        // await since('The grid cell at "0", "4" should have text "Profit Margin", instead we have #{actual}')
        //     .expect(await reportGridView.getGridCellTextByPos(0, 4))
        //     .toBe('Profit Margin');

        // And the grid cell at "1", "0" has text "2015"
        await since('The grid cell at "1", "0" should have text "2015", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('2015');

        // And the grid cell at "5", "1" has text "South"
        await since('The grid cell at "5", "1" should have text "South", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(5, 1))
            .toBe('South');

        // And the grid cell at "1", "2" has text "$14,699"
        await since('The grid cell at "1", "2" should have text "$14,699", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('$14,699');

        // And the grid cell at "2", "3" has text "$10,617"
        await since('The grid cell at "2", "3" should have text "$10,617", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('$10,617');

        // // And the grid cell at "3", "4" has text "19.56%"
        // await since('The grid cell at "3", "4" should have text "19.56%", instead we have #{actual}')
        //     .expect(await reportGridView.getGridCellTextByPos(3, 4))
        //     .toBe('19.56%');
        // // When I switch to "All" tab in dataset panel in Report Editor
        // await reportDatasetPanel.switchToAllTab();

        // And I add the object "Choose from a list of attributes for the page-by field" to Page-by from Object Browser in Report Editor
        await reportDatasetPanel.addObjectToPageBy('Choose from a list of attributes for the page-by field');

        // When I click check list check box for object "Call Center" in "Choose from a list of attributes for the page-by field." section with index "1." in prompt editor in Report Editor
        await reportPromptEditor.clickCheckListCheckBoxItem(
            1,
            'Choose from a list of attributes for the page-by field.',
            'Call Center'
        );

        // Then I click Apply button in Report Prompt Editor
        await reportPromptEditor.clickApplyButtonInReportPromptEditor();

        // Then The current selection for page by selector "Subcategory" should be "Literature"
        await since(
            'The current selection for page by selector "Subcategory" should be "Literature", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Subcategory'))
            .toBe('Literature');

        // And The current selection for page by selector "Call Center" should be "Atlanta"
        await since(
            'The current selection for page by selector "Call Center" should be "Atlanta", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Call Center'))
            .toBe('Atlanta');

        // And the grid cell at "0", "0" has text "Year"
        await since('The grid cell at "0", "0" should have text "Year", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "0", "1" has text "Region"
        await since('The grid cell at "0", "1" should have text "Region", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Region');

        // And the grid cell at "0", "2" has text "Revenue"
        await since('The grid cell at "0", "2" should have text "Revenue", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Revenue');

        // And the grid cell at "0", "3" has text "Cost"
        await since('The grid cell at "0", "3" should have text "Cost", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Cost');
        // // And the grid cell at "0", "4" has text "Profit Margin"
        // await since('The grid cell at "0", "4" should have text "Profit Margin", instead we have #{actual}')
        //     .expect(await reportGridView.getGridCellTextByPos(0, 4))
        //     .toBe('Profit Margin');

        // And the grid cell at "1", "0" has text "2015"
        await since('The grid cell at "1", "0" should have text "2015", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('2015');

        // And the grid cell at "1", "1" has text "Southeast"
        await since('The grid cell at "1", "1" should have text "Southeast", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Southeast');

        // And the grid cell at "1", "2" has text "$2,819"
        await since('The grid cell at "1", "2" should have text "$2,819", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('$2,819');

        // And the grid cell at "1", "3" has text "$2,265"
        await since('The grid cell at "1", "3" should have text "$2,265", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$2,265');

        // And the grid cell at "1", "4" has text "19.67%"
        await since('The grid cell at "1", "4" should have text "19.67%", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('19.67%');
    });
});
