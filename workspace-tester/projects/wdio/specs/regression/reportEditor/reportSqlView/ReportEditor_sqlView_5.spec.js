import * as reportConstants from '../../../../constants/report.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { browserWindow } from '../../../../constants/index.js';

describe('Report Editor sql view in Workstation', () => {
    let { loginPage, libraryPage, reportToolbar, reportGridView, reportSqlView } = browsers.pageObj1;

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

    it('[TC81200_5] Report editor sql view in workstation_test2', async () => {
        // When I open report by its ID "21317E834BC9835AD1D2FE967C433E78"
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.Top15ItemsbyCategory.id,
            projectId: reportConstants.Top15ItemsbyCategory.project.id,
        });

        // When I switch to SQL view in Report Editor
        await reportToolbar.switchToDesignMode('sql');

        // When I switch to grid view in Report Editor
        await reportToolbar.switchToDesignMode('grid');

        // And I switch to SQL view in Report Editor
        await reportToolbar.switchToDesignMode('sql');
        // When I open report by its ID "68C9C9764B2EFC3E753EABAE4AC9EF12"
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.RedundantSQLPasses.id,
            projectId: reportConstants.RedundantSQLPasses.project.id,
        });

        // When I switch to SQL view in Report Editor
        await reportToolbar.switchToSqlView();
        // And The sql content should contain "Total Number of Passes:     34 Number of SQL Passes:       32 Number of Analytical Passes:        2"
        await since('The SQL content should contain  #{expected}, instead we have #{actual}')
            .expect((await reportSqlView.sqlView.getText()).replace(/\s+/g, ' ').trim())
            .toContain(
                'Total Number of Passes:     34 Number of SQL Passes:       32 Number of Analytical Passes:        2'
            );

        // When I switch to design mode in Report Editor
        await reportToolbar.switchToDesignMode();

        // And The sql content should contain "Total Number of Passes:     35 Number of Datasource Query Passes:      33 Number of Analytical Query Passes:      2"
        await since('The SQL content should contain  #{expected}, instead we have #{actual}')
            .expect((await reportSqlView.sqlView.getText()).replace(/\s+/g, ' ').trim())
            .toContain(
                'Total Number of Passes:     35 Number of Datasource Query Passes:      33 Number of Analytical Query Passes:      2'
            );

        // And The sql content should contain "Number of Rows Returned:        36"
        await since('The SQL content should contain  #{expected}, instead we have #{actual}')
            .expect((await reportSqlView.sqlView.getText()).replace(/\s+/g, ' ').trim())
            .toContain('Number of Rows Returned:        36');

        // When I switch to grid view in Report Editor
        await reportToolbar.switchToGridView();

        // And I switch to SQL view in Report Editor
        await reportToolbar.switchToSqlView();
        // When I move the vertical scrollbar in Report by offset "100%" down
        await reportGridView.scrollGridToBottom('Visualization 1');

        // And The sql content should contain "group by    `a14`.`QUARTER_ID`"
        await since('The sql content should contain  #{expected}, instead we have #{actual}')
            .expect((await reportSqlView.sqlView.getText()).replace(/\s+/g, ' ').trim())
            .toContain('group by    `a14`.`QUARTER_ID`');

        // When I switch to design mode in Report Editor
        await reportToolbar.switchToDesignMode();

        // When I move the vertical scrollbar in Report by offset "100%" down
        await reportGridView.scrollGridToBottom('Visualization 1');

        // And The sql content should contain "group by    `a14`.`QUARTER_ID`"
        await since('The sql content should contain  #{expected}, instead we have #{actual}')
            .expect((await reportSqlView.sqlView.getText()).replace(/\s+/g, ' ').trim())
            .toContain('group by    `a14`.`QUARTER_ID`');

        // // When I open report by its ID "F8C2ED3146DC4B0755497B97A8FBDA44"
        // await reportEditorPanel.openReportByID({
        //     dossierId: reportConstants.TC81200_Case7.id,
        //     projectId: reportConstants.TC81200_Case7.project.id,
        // });

        // // When I switch to SQL view in Report Editor
        // await reportToolbar.switchToSqlView();

        // // When I switch to grid view in Report Editor
        // await reportToolbar.switchToGridView();

        // // And I switch to SQL view in Report Editor
        // await reportToolbar.switchToSqlView();

        // // Then Report is switched to SQL view
        // await since('Report is switched to SQL view')
        //     .expect(await reportSqlView.sqlView.isDisplayed())
        //     .toBe(true);
        // // And The sql content should contain "[BEGIN PARTITION SQL, all 3 branches are shown and only one will be executed] [1st BRANCH]"
        // await since(
        //     'The sql content should contain "[BEGIN PARTITION SQL, all 3 branches are shown and only one will be executed] [1st BRANCH]" is expected to be true, instead we have false'
        // )
        //     .expect(await reportSqlView.sqlView.getText())
        //     .toContain('[BEGIN PARTITION SQL, all 3 branches are shown and only one will be executed] [1st BRANCH]');

        // // And I switch to design mode in Report Editor
        // await reportToolbar.switchToDesignMode();
    });
});
