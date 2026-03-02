import * as reportConstants from '../../../../constants/report.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { browserWindow } from '../../../../constants/index.js';

describe('Report Editor sql view in Workstation', () => {
    let { loginPage, libraryPage, reportToolbar, reportGridView, reportPageBy, reportSqlView, reportPromptEditor } =
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

    it('[TC81200_4] Report editor sql view in workstation_test2', async () => {
        // When I open report by its ID "B17BFD3B5E4F0C45F19FD7B7A786362F"
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.TC81200_Case5.id,
            projectId: reportConstants.TC81200_Case5.project.id,
        });
        // When I switch to SQL view in Report Editor
        await reportToolbar.switchToSqlView();

        // And I double click available object "Mid-Atlantic" in "Select Region" section with index "1." in prompt editor in Report Editor
        await reportPromptEditor.chooseItemInAvailableCart(1, 'Select Region', 'Mid-Atlantic');

        // And I double click available object "Northeast" in "Select Region" section with index "1." in prompt editor in Report Editor
        await reportPromptEditor.chooseItemInAvailableCart(1, 'Select Region', 'Northeast');

        // And I click Apply button in Report Prompt Editor
        await reportPromptEditor.clickApplyButtonInReportPromptEditor();

        // When I switch to grid view in Report Editor
        await reportToolbar.switchToGridView();

        // And I switch to SQL view in Report Editor
        await reportToolbar.switchToSqlView();

        const sqlText = await reportSqlView.sqlView.getText();
        // update sqlText to remove extra blanks
        const sqlTextWithoutBlanks = sqlText.replace(/\s+/g, ' ').trim();

        // And The sql content should contain "Number of Columns Returned:     9"
        await since('After switch to sql view, The sql content should contain #{expected}, instead we have #{actual}')
            .expect(sqlTextWithoutBlanks)
            .toContain('Number of Columns Returned:     9');

        // When I switch to design mode in Report Editor
        await reportToolbar.switchToDesignMode();

        // And I switch to grid view in Report Editor
        await reportToolbar.switchToGridView();

        // Then The current selection for page by selector "Year" should be "2015"
        await since(
            'After switch to grid view, The current selection for page by selector "Year" should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Year'))
            .toBe('2015');
        // And the grid cell at "1", "0" has text "Mid-Atlantic"
        await since(
            'After switch to grid view, The grid cell at "1", "0" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Mid-Atlantic');

        // And the grid cell at "5", "0" has text "Northeast"
        await since(
            'After switch to grid view, The grid cell at "5", "0" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(5, 0))
            .toBe('Northeast');

        // And the grid cell at "1", "2" has text "33.46%"
        await since(
            'After switch to grid view, The grid cell at "1", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('33.46%');

        // And the grid cell at "1", "3" has text "35.0%"
        await since(
            'After switch to grid view, The grid cell at "1", "3" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('35.0%');

        // When I open report by its ID "F89EC0D24A922C2979050ABFD41205B9"
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.RevenueTopCustomers.id,
            projectId: reportConstants.RevenueTopCustomers.project.id,
        });

        // When I switch to SQL view in Report Editor
        await reportToolbar.switchToSqlView();

        // When I switch to grid view in Report Editor
        await reportToolbar.switchToGridView();

        // And I switch to SQL view in Report Editor
        await reportToolbar.switchToSqlView();
        // When I move the vertical scrollbar in Report by offset "100%" down
        await reportSqlView.dndVerticalScrollbar('100%');
        // Then The sql content should contain "[Analytical engine calculation steps:"
        await since('After switch to sql view, The sql content should contain #{expected}, instead we have #{actual}')
            .expect((await reportSqlView.sqlView.getText()).replace(/\s+/g, ' ').trim())
            .toContain('Analytical engine calculation steps:');

        // When I switch to design mode in Report Editor
        await reportToolbar.switchToDesignMode();

        // When I move the vertical scrollbar in Report by offset "100%" down
        await reportSqlView.dndVerticalScrollbar('100%');

        // Then The sql content should contain "select  [Quarter]@[QUARTER_ID]"
        await since(
            'After switch to design mode, The sql content should contain #{expected}, instead we have #{actual}'
        )
            .expect((await reportSqlView.sqlView.getText()).replace(/\s+/g, ' ').trim())
            .toContain('select  [Quarter]@[QUARTER_ID]');

        // When I open report by its ID "E3FD448D46B0476755C7778D158EF0C0"
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.WebvsNonWebSales.id,
            projectId: reportConstants.WebvsNonWebSales.project.id,
        });

        // When I switch to SQL view in Report Editor
        await reportToolbar.switchToSqlView();

        // When I switch to grid view in Report Editor
        await reportToolbar.switchToGridView();

        // And I switch to SQL view in Report Editor
        await reportToolbar.switchToSqlView();

        // And The sql content should contain "Tables Accessed: Table2  [L_CATEGORY]:   Category,       LOOKUP_TABLE"
        await since('After switch to sql view, The sql content should contain #{expected}, instead we have #{actual}')
            .expect((await reportSqlView.sqlView.getText()).replace(/\s+/g, ' ').trim())
            .toContain('Tables Accessed: Table2  [L_CATEGORY]:   Category,       LOOKUP_TABLE');
        // When I switch to design mode in Report Editor
        await reportToolbar.switchToDesignMode();

        // When I move the vertical scrollbar in Report by offset "100%" down
        await reportSqlView.dndVerticalScrollbar('100%');

        // Then The sql content should contain "[Analytical engine calculation steps:"
        await since(
            'After switch to design mode, The sql content should contain #{expected}, instead we have #{actual}'
        )
            .expect((await reportSqlView.sqlView.getText()).replace(/\s+/g, ' ').trim())
            .toContain('[Analytical engine calculation steps:');

        // When I open report by its ID "C93415834B32525E91B4518384DFA2DE"
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.OLAPfunctionsOLAPSum.id,
            projectId: reportConstants.OLAPfunctionsOLAPSum.project.id,
        });

        // When I switch to SQL view in Report Editor
        await reportToolbar.switchToSqlView();

        // When I switch to grid view in Report Editor
        await reportToolbar.switchToGridView();

        // And I switch to SQL view in Report Editor
        await reportToolbar.switchToSqlView();

        // And The sql content should contain "[Analytical SQL calculated by the Analytical Engine:     select  MONTH_ID,         MONTH_DESC0,         `Revenue`,         OLAPSum<SortBy= ([MONTH_ID]), Rows Between unbounded preceding and current row>(`Revenue`),"
        await since(
            'The sql content should contain "[Analytical SQL calculated by the Analytical Engine:     select  MONTH_ID,         MONTH_DESC0,         `Revenue`,         OLAPSum<SortBy= ([MONTH_ID]), Rows Between unbounded preceding and current row>(`Revenue`),"'
        )
            .expect((await reportSqlView.sqlView.getText()).replace(/\s+/g, ' ').trim())
            .toContain(
                '[Analytical SQL calculated by the Analytical Engine:     select  MONTH_ID,         MONTH_DESC0,         `Revenue`,         OLAPSum<SortBy= ([MONTH_ID]), Rows Between unbounded preceding and current row>(`Revenue`),'
            );
        // And The sql content should contain "Number of Columns Returned:     3"
        await since('After switch to sql view, The sql content should contain #{expected}, instead we have #{actual}')
            .expect((await reportSqlView.sqlView.getText()).replace(/\s+/g, ' ').trim())
            .toContain('Number of Columns Returned:     3');

        // When I switch to design mode in Report Editor
        await reportToolbar.switchToDesignMode();

        const sqlTextDesignMode = await reportSqlView.sqlView.getText();
        // update sqlText to remove extra blanks
        const sqlTextWithoutBlanksDesignMode = sqlTextDesignMode.replace(/\s+/g, ' ').trim();

        // And The sql content should contain "Query Engine Execution Start Time:"
        await since(
            'After switch to design mode, The sql content should contain #{expected}, instead we have #{actual}'
        )
            .expect(sqlTextWithoutBlanksDesignMode)
            .toContain('Query Engine Execution Start Time:');

        // And The sql content should contain "Number of Rows Returned:        36"
        await since(
            'After switch to design mode, The sql content should contain #{expected}, instead we have #{actual}'
        )
            .expect(sqlTextWithoutBlanksDesignMode)
            .toContain('Number of Rows Returned:        36');

        // When I move the vertical scrollbar in Report by offset "100%" down
        await reportSqlView.dndVerticalScrollbar('100%');

        // Then The sql content should contain "[Analytical SQL calculated by the Analytical Engine:     select  MONTH_ID,         MONTH_DESC0,         `Revenue`,         OLAPSum<SortBy= ([MONTH_ID]), Rows Between unbounded preceding and current row>(`Revenue`),"
        await since('After switch to sql view, The sql content should contain #{expected}, instead we have #{actual}')
            .expect(sqlTextWithoutBlanksDesignMode)
            .toContain(
                '[Analytical SQL calculated by the Analytical Engine:     select  MONTH_ID,         MONTH_DESC0,         `Revenue`,         OLAPSum<SortBy= ([MONTH_ID]), Rows Between unbounded preceding and current row>(`Revenue`),'
            );
    });
});
