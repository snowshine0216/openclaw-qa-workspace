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
        reportEditorPanel,
        reportAttributeFormsDialog,
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

    it('[TC81200_2] Report editor sql view in workstation_test2', async () => {
        // When I open report by its ID "8552603B7843173355808CB45B036A26"
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.TC81200_Case3.id,
            projectId: reportConstants.TC81200_Case3.project.id,
        });

        // // When I switch to SQL view in Report Editor
        // await reportToolbar.switchToSqlView();

        // // When I switch to grid view in Report Editor
        // await reportToolbar.switchToGridView();

        // And I switch to SQL view in Report Editor
        await reportToolbar.switchToSqlView();

        // Then Report is switched to SQL view
        await since('Report should be switched to SQL view, instead we have #{actual}')
            .expect(await reportSqlView.sqlView.isDisplayed())
            .toBe(true);

        // Then The sql content should contain "Report: TC81200_Case3"
        await since('The sql content should contain #{expected}, instead we have #{actual}')
            .expect(await reportSqlView.sqlView.getText())
            .toContain('Report: TC81200_Case3');

        // And The sql content should contain "Number of Columns Returned:     4"
        await since('The sql content should contain #{expected}, instead we have #{actual}')
            .expect(await reportSqlView.sqlView.getText())
            .toContain('Number of Columns Returned:     4');

        // And The sql content should contain "Tables Accessed: item_emp_sls lu_category lu_employee lu_item lu_subcateg"
        await since('The sql content should contain #{expected}, instead we have #{actual}')
            .expect(await reportSqlView.sqlView.getText())
            .toContain('Tables Accessed: item_emp_sls lu_category lu_employee lu_item lu_subcateg');

        // // When I select folder "Schema Objects" in object list in Report Editor
        // await reportDatasetPanel.selectItemInObjectList('Schema Objects');

        // // And I select folder "Attributes" in object list in Report Editor
        // await reportDatasetPanel.selectItemInObjectList('Attributes');

        // // And I select folder "Geography" in object list in Report Editor
        // await reportDatasetPanel.selectItemInObjectList('Geography');
        // await reportDatasetPanel.switchToAllTab();
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Schema Objects', 'Attributes', 'Geography']);

        // Then I add the object "Country" to Page-by from Object Browser in Report Editor
        // await reportDatasetPanel.openObjectContextMenu('Country');
        // await reportDatasetPanel.clickObjectContextMenuItem('Add to Page-by');
        await reportDatasetPanel.addObjectToPageBy('Country');

        // When I add the object "Region" to Rows from Object Browser in Report Editor
        await reportDatasetPanel.addObjectToRows('Region');

        // And I add the object "Manager" to Rows from Object Browser in Report Editor
        await reportDatasetPanel.addObjectToRows('Manager');

        // When I click folder up icon to go back to upper level folder in Report Editor
        await reportDatasetPanel.clickFolderUpIcon();

        // And I select folder "Products" in object list in Report Editor
        await reportDatasetPanel.selectItemInObjectList('Products');

        // Then I add the object "Category" to Columns from Object Browser in Report Editor
        await reportDatasetPanel.addObjectToColumns('Category');

        // When I switch to "In Report" tab in dataset panel in Report Editor
        // await reportDatasetPanel.switchToInReportTab();

        // // And I remove object "Custom Categories" from Report in Report Editor
        // await reportEditorPanel.removeObjectInDropzone('Rows', 'attribute', 'Custom Categories');

        // When I click the Update button in Report SQL view
        await reportSqlView.clickUpdateSqlView();

        const sqlText = await reportSqlView.sqlView.getText();
        // update sqlText to remove extra blanks
        const sqlTextWithoutBlanks = sqlText.replace(/\s+/g, ' ').trim();

        // Then The sql content should contain "Number of Columns Returned:     10"
        await since('After update sql view, The sql content should contain #{expected}, instead we have #{actual}')
            .expect(sqlTextWithoutBlanks)
            .toContain('Number of Columns Returned:     10');
        // And The sql content should contain "Tables Accessed: item_emp_sls lu_call_ctr lu_category lu_country lu_employee lu_item lu_manager lu_region lu_subcateg"
        await since('After update sql view, The sql content should contain #{expected}, instead we have #{actual}')
            .expect(sqlTextWithoutBlanks)
            .toContain(
                'Tables Accessed: item_emp_sls lu_call_ctr lu_category lu_country lu_employee lu_item lu_manager lu_region lu_subcateg'
            );
        // And The sql content should contain "select  `a14`.`COUNTRY_ID`  `COUNTRY_ID`,     max(`a19`.`COUNTRY_NAME`)  `COUNTRY_NAME0`,     `a15`.`REGION_ID`  `REGION_ID`,     max(`a18`.`REGION_NAME`)  `REGION_NAME0`,     `a14`.`MANAGER_ID`  `MANAGER_ID`,     max(`a17`.`MGR_LAST_NAME`)  `MGR_LAST_NAME`,     max(`a17`.`MGR_FIRST_NAME`)  `MGR_FIRST_NAME`,     `a13`.`CATEGORY_ID`  `CATEGORY_ID`,     max(`a16`.`CATEGORY_DESC`)  `CATEGORY_DESC0`,     sum(`a11`.`TOT_COST`)  `WJXBFS1`"
        await since('After update sql view, The sql content should contain #{expected}, instead we have #{actual}')
            .expect(sqlTextWithoutBlanks)
            .toContain(
                'select  `a14`.`COUNTRY_ID`  `COUNTRY_ID`,     max(`a19`.`COUNTRY_NAME`)  `COUNTRY_NAME0`,     `a15`.`REGION_ID`  `REGION_ID`,     max(`a18`.`REGION_NAME`)  `REGION_NAME0`,     `a14`.`MANAGER_ID`  `MANAGER_ID`,     max(`a17`.`MGR_LAST_NAME`)  `MGR_LAST_NAME`,     max(`a17`.`MGR_FIRST_NAME`)  `MGR_FIRST_NAME`,     `a13`.`CATEGORY_ID`  `CATEGORY_ID`,     max(`a16`.`CATEGORY_DESC`)  `CATEGORY_DESC0`,     sum(`a11`.`TOT_COST`)  `WJXBFS1`'
            );
        // await takeScreenshotByElement(await reportSqlView.sqlView, 'TC81200_Case3_sqlView', 'sqlView');

        // When I open attribute forms dialog from the "attribute" "Manager" in "Rows" dropzone in Report Editor
        await reportEditorPanel.openObjectContextMenu('Rows', 'attribute', 'Manager');
        await reportDatasetPanel.clickObjectContextMenuItem('Display Attribute Forms');
        // await reportDatasetPanel.openDisplayAttributeFormsDialogOnObject('Rows', 'attribute', 'Manager');

        // And I click the checkbox to use the default list of attribute forms
        await reportAttributeFormsDialog.clickDefaultFormCheckBox();

        // And I click attribute forms "Email" in Display Attribute Forms list
        await reportAttributeFormsDialog.enableDisplayAttributeForms(['Email']);

        // When I click the Update button in Report SQL view
        await reportSqlView.clickUpdateSqlView();

        const sqlTextUpdate = await reportSqlView.sqlView.getText();
        // update sqlText to remove extra blanks
        const sqlTextWithoutBlanksUpdate = sqlTextUpdate.replace(/\s+/g, ' ').trim();

        // Then The sql content should contain "Number of Columns Returned:     11"
        await since(
            'After update display attribute forms, The sql content should contain #{expected}, instead we have #{actual}'
        )
            .expect(sqlTextWithoutBlanksUpdate)
            .toContain('Number of Columns Returned:     11');

        // And The sql content should contain "max(`a17`.`EMAIL`)  `EMAIL`"
        await since(
            'After update display attribute forms, The sql content should contain #{expected}, instead we have #{actual}'
        )
            .expect(sqlTextWithoutBlanksUpdate)
            .toContain('max(`a17`.`EMAIL`)  `EMAIL`');

        // When I switch to "All" tab in dataset panel in Report Editor
        // await reportDatasetPanel.switchToAllTab();

        // And I switch to "Filter" Panel in Report Editor
        await reportTOC.switchToFilterPanel();
        // And I click the plus button to open a new qualification editor in Filter panel at non-aggregation level in Report Editor
        await reportFilterPanel.openNewQualicationEditorAtNonAggregationLevel();

        // And I search "Attribute" "Category" in the based on search box and select the searched result
        await reportFilterPanel.searchAttributeObjectInSearchbox('Category');

        // And I select "Electronics,Movies" in the elements list
        await reportFilterPanel.selectElements(['Electronics', 'Movies']);

        // Then I click "Done" button to close the qualification editor
        await reportFilterPanel.saveAndCloseQualificationEditor();

        // When I click the Update button in Report SQL view
        await reportSqlView.clickUpdateSqlView();

        // When I switch to grid view in Report Editor
        await reportToolbar.switchToGridView();

        // And I switch to design mode in Report Editor
        await reportToolbar.switchToDesignMode();

        // Then the grid cell at "0", "0" has text "Region"
        await since(
            'After add report filter, The grid cell at "0", "0" should have text "Region", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Region');

        // And the grid cell at "1", "1" has text "Manager"
        await since(
            'After add report filter, The grid cell at "1", "1" should have text "Manager", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Manager');

        // And the grid cell at "0", "4" has text "Cost"
        await since(
            'After add report filter, The grid cell at "0", "4" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('Cost');
        // And the grid cell at "2", "0" has text "Central"
        await since(
            'After add report filter, The grid cell at "2", "0" should have text "Central", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toBe('Central');

        // And the grid cell at "2", "1" has text "Lewandowski"
        await since(
            'After add report filter, The grid cell at "2", "1" should have text "Lewandowski", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 1))
            .toBe('Lewandowski');

        // And the grid cell at "2", "2" has text "Allister"
        await since(
            'After add report filter, The grid cell at "2", "2" should have text "Allister", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 2))
            .toBe('Allister');

        // And the grid cell at "2", "3" has text "alewandowski@microstrategy-tutorial.demo"
        await since(
            'After add report filter, The grid cell at "2", "3" should have text "alewandowski@microstrategy-tutorial.demo", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('alewandowski@microstrategy-tutorial.demo');

        // And the grid cell at "2", "4" has text "$2,399,751"
        await since(
            'After add report filter, The grid cell at "2", "4" should have text "$2,399,751", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 4))
            .toBe('$2,399,751');

        // And the grid cell at "2", "5" has text "$457,465"
        await since(
            'After add report filter, The grid cell at "2", "5" should have text "$457,465", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 5))
            .toBe('$457,465');

        // And The current selection for page by selector "Country" should be "USA"
        await since(
            'After add report filter, The current selection for page by selector "Country" should be "USA", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Country'))
            .toBe('USA');
    });
});
