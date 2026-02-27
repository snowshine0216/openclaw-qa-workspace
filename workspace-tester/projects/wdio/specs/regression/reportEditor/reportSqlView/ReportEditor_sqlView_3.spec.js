import * as reportConstants from '../../../../constants/report.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { browserWindow } from '../../../../constants/index.js';

describe('Report Editor sql view in Workstation', () => {
    let {
        loginPage,
        libraryPage,
        reportToolbar,
        reportDatasetPanel,
        reportGridView,
        reportPageBy,
        reportTOC,
        reportFilterPanel,
        reportSqlView,
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

    it('[TC81200_3] Report editor sql view in workstation_test2', async () => {
        // When I open report by its ID "4C4D064A2E4325D2372F2C89436AB7AC"
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.TC81200_Case4.id,
            projectId: reportConstants.TC81200_Case4.project.id,
        });

        // // When I switch to SQL view in Report Editor
        // await reportToolbar.switchToSqlView();

        // // When I switch to grid view in Report Editor
        // await reportToolbar.switchToGridView();

        // And I switch to SQL view in Report Editor
        await reportToolbar.switchToSqlView();

        // // Then Report is switched to SQL view
        // await since('Report should be switched to SQL view')
        //     .expect(await reportSqlView.isDisplayed())
        //     .toBe(true);

        const sqlText = await reportSqlView.sqlView.getText();
        // update sqlText to remove extra blanks
        const sqlTextWithoutBlanks = sqlText.replace(/\s+/g, ' ').trim();
        // Then The sql content should contain "select  `a13`.`CATEGORY_ID`  `CATEGORY_ID`,     max(`a14`.`CATEGORY_DESC`)  `CATEGORY_DESC0`,     sum((`a11`.`TOT_DOLLAR_SALES` - `a11`.`TOT_COST`))  `WJXBFS1`'
        await since('SQL content should contain the #{expected}, instead we have #{actual}')
            .expect(sqlTextWithoutBlanks)
            .toContain(
                'select  `a13`.`CATEGORY_ID`  `CATEGORY_ID`,     max(`a14`.`CATEGORY_DESC`)  `CATEGORY_DESC0`,     sum((`a11`.`TOT_DOLLAR_SALES` - `a11`.`TOT_COST`))  `WJXBFS1`'
            );

        // When I switch to design mode in Report Editor
        await reportToolbar.switchToDesignMode();

        // And The sql content should contain "Query Engine Execution Start Time:"
        await since('After switch to design mode, SQL content should contain #{expected}, instead we have #{actual}')
            .expect(sqlTextWithoutBlanks)
            .toContain('Query Engine Execution Start Time:');

        // // When I select folder "Public Objects" in object list in Report Editor
        // await reportDatasetPanel.selectItemInObjectList('Public Objects');

        // // And I select folder "Metrics" in object list in Report Editor
        // await reportDatasetPanel.selectItemInObjectList('Metrics');

        // // And I select folder "Sales Metrics" in object list in Report Editor
        // await reportDatasetPanel.selectItemInObjectList('Sales Metrics');
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Public Objects', 'Metrics', 'Sales Metrics']);

        // Then I add the object "Cost" to Columns from Object Browser in Report Editor
        await reportDatasetPanel.addObjectToColumns('Cost');

        // When I click the Update button in Report SQL view
        await reportSqlView.clickUpdateSqlView();

        const sqlTextUpdate = await reportSqlView.sqlView.getText();
        const sqlTextWithoutBlanksUpdate = sqlTextUpdate.replace(/\s+/g, ' ').trim();
        // Then The sql content should contain "Number of Columns Returned:     4"
        await since('After update sql view, The sql content should contain #{expected}, instead we have #{actual}')
            .expect(sqlTextWithoutBlanksUpdate)
            .toContain('Number of Columns Returned:     4');

        // // When I click folder up icon to go back to upper level folder in Report Editor
        // await reportDatasetPanel.clickFolderUpIcon();

        // // And I click folder up icon to go back to upper level folder in Report Editor
        // await reportDatasetPanel.clickFolderUpIcon();

        // // And I click folder up icon to go back to upper level folder in Report Editor
        // await reportDatasetPanel.clickFolderUpIcon();
        await reportDatasetPanel.clickFolderUpMultipleTimes(3);

        // // When I select folder "Schema Objects" in object list in Report Editor
        // await reportDatasetPanel.selectItemInObjectList('Schema Objects');

        // // Then I select folder "Attributes" in object list in Report Editor
        // await reportDatasetPanel.selectItemInObjectList('Attributes');

        // // When I select folder "Time" in object list in Report Editor
        // await reportDatasetPanel.selectItemInObjectList('Time');
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Schema Objects', 'Attributes', 'Time']);

        // // Then I add the object "Year" to Page-by from Object Browser in Report Editor
        // await reportDatasetPanel.openObjectContextMenu('Year');
        // await reportDatasetPanel.clickObjectContextMenuItem('Add to Page-by');
        await reportDatasetPanel.addObjectToPageBy('Year');

        // When I click the Update button in Report SQL view
        await reportSqlView.clickUpdateSqlView();

        // Then The sql content should contain "Number of Rows Returned:        12 Number of Columns Returned:     5"
        await since('After update sql view, The sql content should contain #{expected}, instead we have #{actual}')
            .expect(sqlTextWithoutBlanksUpdate)
            .toContain('Number of Rows Returned:        12 Number of Columns Returned:     5');
        // When I switch to grid view in Report Editor
        await reportToolbar.switchToGridView();

        // Then The current selection for page by selector "Year" should be "2014"
        await since(
            'After switch to grid view, The current selection for page by selector "Year" is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Year'))
            .toContain('2014');

        // And the grid cell at "0", "2" has text "Cost"
        await since(
            'After switch to grid view, The grid cell at "0", "2" is expected to have text #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Cost');

        // When I switch to SQL view in Report Editor
        await reportToolbar.switchToSqlView();

        // When I switch to "In Report" tab in dataset panel in Report Editor
        // await reportDatasetPanel.switchToInReportTab();

        // And I remove object "Cost" from Report in Report Editor
        await reportDatasetPanel.openObjectContextMenu('Cost');
        await reportDatasetPanel.clickObjectContextMenuItem('Remove from Report');

        // When I click the Update button in Report SQL view
        await reportSqlView.clickUpdateSqlView();

        const sqlTextUpdate2 = await reportSqlView.sqlView.getText();
        const sqlTextWithoutBlanksUpdate2 = sqlTextUpdate2.replace(/\s+/g, ' ').trim();
        // Then The sql content should contain "Number of Rows Returned:        12 Number of Columns Returned:     4"
        await since(
            'The sql content is expected to contain "Number of Rows Returned:        12 Number of Columns Returned:     4", instead we have #{actual}'
        )
            .expect(sqlTextWithoutBlanksUpdate2)
            .toContain('Number of Rows Returned:        12 Number of Columns Returned:     4');

        // When I switch to "All" tab in dataset panel in Report Editor
        // await reportDatasetPanel.switchToAllTab();
        // And I switch to "Filter" Panel in Report Editor
        await reportTOC.switchToFilterPanel();

        // And I click the plus button to open a new qualification editor in Filter panel at non-aggregation level in Report Editor
        await reportFilterPanel.openNewQualicationEditorAtNonAggregationLevel();

        // When I search "Attribute" "Quarter" in the based on search box and select the searched result
        // await reportFilterPanel.typeObjectInSearchbox('Quarter');
        // await reportFilterPanel.selectObjectFromSearchedResult('Attribute', 'Quarter');
        await reportFilterPanel.searchAttributeObjectInSearchbox('Quarter');

        // And I select "2014 Q1,2015 Q1" in the elements list
        await reportFilterPanel.selectElements(['2014 Q1', '2015 Q1']);

        // Then I click "Done" button to close the qualification editor
        await reportFilterPanel.saveAndCloseQualificationEditor();

        // And I click Apply button to submit the Filters
        await reportFilterPanel.clickFilterApplyButton();

        const sqlTextUpdate3 = await reportSqlView.sqlView.getText();
        const sqlTextWithoutBlanksUpdate3 = sqlTextUpdate3.replace(/\s+/g, ' ').trim();

        // And The sql content should contain "Number of Rows Returned:        8 Number of Columns Returned:     4"
        await since('After add report filter, The sql content should contain #{expected}, instead we have #{actual}')
            .expect(sqlTextWithoutBlanksUpdate3)
            .toContain('Number of Rows Returned:        8 Number of Columns Returned:     4');

        // When I switch to grid view in Report Editor
        await reportToolbar.switchToGridView();

        // Then the grid cell at "1", "1" has text "$29,756"
        await since(
            'After switch to grid view, The grid cell at "1", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('$29,756');
    });
});
