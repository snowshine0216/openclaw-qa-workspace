import * as reportConstants from '../../../../constants/report.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { browserWindow } from '../../../../constants/index.js';

describe('Report Editor sql view in Workstation', () => {
    let { loginPage, libraryPage, reportToolbar, reportDatasetPanel, reportGridView, reportSqlView } =
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

    it('[TC81200_1] Report editor sql view in workstation', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.SavedinSQLView.id,
            projectId: reportConstants.SavedinSQLView.project.id,
        });
        // And The "sql" icon is enabled
        await since('After edit report, the "sql" icon should be enabled, instead we have #{actual}')
            .expect(await reportToolbar.getEnabledButtonFromToolbar('sql').isDisplayed())
            .toBe(true);

        // When I switch to design mode in Report Editor
        await reportToolbar.switchToDesignMode();

        // Then the grid cell at "0", "0" has text "Year"
        await since(
            'After switch to design mode, The grid cell at "0", "0" should have text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "0", "1" has text "2015 & 2016"
        await since(
            'After switch to design mode, The grid cell at "0", "1" should have text "2015 & 2016", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('2015 & 2016');

        // And the grid cell at "0", "2" has text "Custom Categories"
        await since(
            'After switch to design mode, The grid cell at "0", "2" should have text "Custom Categories", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Custom Categories');

        // And the grid cell at "0", "4" has text "Cost"
        await since(
            'After switch to design mode, The grid cell at "0", "4" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('Cost');

        // // And the grid cell at "0", "5" has text "Profit Margin"
        // await since(
        //     'After switch to design mode, The grid cell at "0", "5" should have text "Profit Margin", instead we have #{actual}'
        // )
        //     .expect(await reportGridView.getGridCellTextByPos(0, 5))
        //     .toBe('Profit Margin');

        // // And the grid cell at "0", "6" has text "Profit"
        // await since(
        //     'After switch to design mode, The grid cell at "0", "6" should have text "Profit", instead we have #{actual}'
        // )
        //     .expect(await reportGridView.getGridCellTextByPos(0, 6))
        //     .toBe('Profit');

        // And the grid cell at "1", "1" has text "2016 - 2015"
        await since(
            'After switch to design mode, The grid cell at "1", "1" should have text "2016 - 2015", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('2016 - 2015');

        // And the grid cell at "1", "2" has text "Category Sales"
        await since(
            'After switch to design mode, The grid cell at "1", "2" should have text "Category Sales", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Category Sales');

        // And the grid cell at "1", "4" has text "-$9,777,521"
        await since(
            'After switch to design mode, The grid cell at "1", "4" should have text "-$9,777,521", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('-$9,777,521');

        // And the grid cell at "1", "5" has text "15.11%"
        await since(
            'After switch to design mode, The grid cell at "1", "5" should have text "15.11%", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 5))
            .toBe('15.11%');

        // And the grid cell at "1", "6" has text "($1,740,085)"
        await since(
            'After switch to design mode, The grid cell at "1", "6" should have text "($1,740,085)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 6))
            .toBe('($1,740,085)');

        // And The "sql" icon is disabled
        await since('After switch to design mode, The "sql" icon should be enabled, instead we have #{actual}')
            .expect(await reportToolbar.getEnabledButtonFromToolbar('sql').isDisplayed())
            .toBe(true);

        await reportDatasetPanel.selectMultipleItemsInObjectList(['Schema Objects', 'Attributes', 'Products']);

        // // And I add the object "Year" to Rows from Object Browser in Report Editor
        // await reportDatasetPanel.addObjectToRows('Year');

        // // When I click folder up icon to go back to upper level folder in Report Editor
        // await reportDatasetPanel.clickFolderUpIcon();

        // // And I select folder "Products" in object list in Report Editor
        // await reportDatasetPanel.selectItemInObjectList('Products');

        // Then I add the object "Category" to Rows from Object Browser in Report Editor
        await reportDatasetPanel.addObjectToRows('Category');

        await reportDatasetPanel.clickFolderUpMultipleTimes(3);
        await reportDatasetPanel.selectMultipleItemsInObjectList([
            'Public Objects',
            'Metrics',
            'Sales Metrics',
            'Transformation Sales Metrics',
        ]);
        await reportDatasetPanel.addMultipleObjectsToColumns(["Last Year's Revenue", "Last Year's Profit"]);

        // When I switch to SQL view in Report Editor
        await reportToolbar.switchToSqlView();

        // Then Report is switched to SQL view
        await since('Report should be switched to SQL view, instead we have #{actual}')
            .expect(await reportSqlView.sqlView.isDisplayed())
            .toBe(true);

        // And The search box exists in Report SQL view
        await since('The search box should exist in Report SQL view, instead we have #{actual}')
            .expect(await reportSqlView.sqlViewSearchBox.isDisplayed())
            .toBe(true);

        // And The copy to clipboard button is enabled in Report SQL view
        await since('The copy to clipboard button should be enabled in Report SQL view, instead we have #{actual}')
            .expect(await reportSqlView.sqlViewCopyIcon.isEnabled())
            .toBe(true);

        // And The Update button is disabled in Report SQL view
        await since('The Update button should be disabled in Report SQL view, instead we have #{actual}')
            .expect(await reportSqlView.sqlViewUpdateBtn.getAttribute('class'))
            .toContain('disabled');

        // When I switch to grid view in Report Editor
        await reportToolbar.switchToGridView();

        // And I switch to SQL view in Report Editor
        await reportToolbar.switchToSqlView();

        // Then Report is switched to SQL view
        await since('Report should be switched to SQL view, instead we have #{actual}')
            .expect(await reportSqlView.sqlView.isDisplayed())
            .toBe(true);

        const sqlText = await reportSqlView.sqlView.getText();
        // update sqlText to remove extra blanks
        const sqlTextWithoutBlanks = sqlText.replace(/\s+/g, ' ').trim();
        // Then The sql content should contain "Report: Blank Report"
        await since('The sql content should contain #{expected}, instead we have #{actual}')
            .expect(sqlTextWithoutBlanks)
            .toContain('Update Report: SavedinSQLView');

        // And The sql content should contain "Number of Columns Returned:     5"
        await since('The sql content should contain #{expected}, instead we have #{actual}')
            .expect(sqlTextWithoutBlanks)
            .toContain('Data Rows: 128 Data Columns: 3');

        // And The sql content should contain "Tables Accessed: lu_category lu_quarter lu_year qtr_category_sls"
        await since(
            'The sql content should contain "Tables Accessed: lu_category lu_quarter lu_year qtr_category_sls", instead we have #{actual}'
        )
            .expect(sqlTextWithoutBlanks)
            .toContain('Tables Accessed: lu_day lu_category lu_employee lu_item lu_month lu_subcateg order_detail');

        // // And The sql content should contain "select  `a13`.`YEAR_ID`  `YEAR_ID`,     `a11`.`CATEGORY_ID`  `CATEGORY_ID`,     max(`a14`.`CATEGORY_DESC`)  `CATEGORY_DESC0`,     sum(`a11`.`TOT_DOLLAR_SALES`)  `WJXBFS1`,     sum((`a11`.`TOT_DOLLAR_SALES` - `a11`.`TOT_COST`))  `WJXBFS2`"
        // await since(
        //     'The sql content should contain "select  `a13`.`YEAR_ID`  `YEAR_ID`,     `a11`.`CATEGORY_ID`  `CATEGORY_ID`,     max(`a14`.`CATEGORY_DESC`)  `CATEGORY_DESC0`,     sum(`a11`.`TOT_DOLLAR_SALES`)  `WJXBFS1`,     sum((`a11`.`TOT_DOLLAR_SALES` - `a11`.`TOT_COST`))  `WJXBFS2`"'
        // )
        //     .expect(await reportSqlView.sqlView.getText())
        //     .toContain(
        //         'select  `a13`.`YEAR_ID`  `YEAR_ID`,     `a11`.`CATEGORY_ID`  `CATEGORY_ID`,     max(`a14`.`CATEGORY_DESC`)  `CATEGORY_DESC0`,     sum(`a11`.`TOT_DOLLAR_SALES`)  `WJXBFS1`,     sum((`a11`.`TOT_DOLLAR_SALES` - `a11`.`TOT_COST`))  `WJXBFS2`'
        //     );

        // When I switch to grid view in Report Editor
        await reportToolbar.switchToGridView();

        // // And I switch to design mode in Report Editor
        // await reportToolbar.switchToDesignMode();

        // Then the grid cell at "0", "0" has text "Year"
        await since('The grid cell at "0", "0" should have text "Year", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // // And the grid cell at "0", "1" has text "Category"
        // await since('The grid cell at "0", "1" should have text "Category", instead we have #{actual}')
        //     .expect(await reportGridView.getGridCellTextByPos(0, 1))
        //     .toBe('Category');

        // // And the grid cell at "0", "2" has text "Last Year's Revenue"
        // await since('The grid cell at "0", "2" should have text "Last Year\'s Revenue", instead we have #{actual}')
        //     .expect(await reportGridView.getGridCellTextByPos(0, 2))
        //     .toBe("Last Year's Revenue");

        // // And the grid cell at "0", "3" has text "Last Year's Profit"
        // await since('The grid cell at "0", "3" should have text "Last Year\'s Profit", instead we have #{actual}')
        //     .expect(await reportGridView.getGridCellTextByPos(0, 3))
        //     .toBe("Last Year's Profit");

        // And the grid cell at "1", "0" has text "2015"
        await since('The grid cell at "1", "0" should have text "2015", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('2015');

        // // And the grid cell at "1", "1" has text "Books"
        // await since('The grid cell at "1", "1" should have text "Books", instead we have #{actual}')
        //     .expect(await reportGridView.getGridCellTextByPos(1, 1))
        //     .toBe('Books');

        // // And the grid cell at "1", "2" has text "$650,192"
        // await since('The grid cell at "1", "2" should have text "$650,192", instead we have #{actual}')
        //     .expect(await reportGridView.getGridCellTextByPos(1, 2))
        //     .toBe('$650,192');

        // // And the grid cell at "1", "3" has text "$139,952"
        // await since('The grid cell at "1", "3" should have text "$139,952", instead we have #{actual}')
        //     .expect(await reportGridView.getGridCellTextByPos(1, 3))
        //     .toBe('$139,952');

        // // When I switch to SQL view in Report Editor
        // await reportToolbar.switchToSqlView();

        // // Then Report is switched to SQL view
        // await since('Report should be switched to SQL view, instead we have #{actual}')
        //     .expect(await reportSqlView.sqlView.isDisplayed())
        //     .toBe(true);

        // // Then The sql content should contain "Query Engine Execution Start Time:"
        // await since('The SQL content should contain "Query Engine Execution Start Time:", instead we have #{actual}')
        //     .expect(await reportSqlView.sqlView.getText())
        //     .toContain('Query Engine Execution Start Time:');

        // // And The sql content should contain "Query Engine Execution Finish Time:"
        // await since('The SQL content should contain "Query Engine Execution Finish Time:", instead we have #{actual}')
        //     .expect(await reportSqlView.sqlView.getText())
        //     .toContain('Query Engine Execution Finish Time:');

        // // And The sql content should contain "Number of Rows Returned:        12 Number of Columns Returned:     5"
        // await since(
        //     'The SQL content should contain "Number of Rows Returned:        12 Number of Columns Returned:     5", instead we have #{actual}'
        // )
        //     .expect(await reportSqlView.sqlView.getText())
        //     .toContain('Number of Rows Returned:        12 Number of Columns Returned:     5');
    });
});
