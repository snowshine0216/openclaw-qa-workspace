import * as reportConstants from '../../../../constants/report.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';

describe('Report Editor Lock Headers in Workstation', () => {
    let { loginPage, libraryPage, reportToolbar, reportTOC, reportFormatPanel, reportGridView, newFormatPanelForGrid } =
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

    it('[TC85742] Lock columns and rows headers', async () => {
        //  need to update the constant file
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.lock_headers_TC85742.id,
            projectId: reportConstants.lock_headers_TC85742.project.id,
        });
        await reportToolbar.switchToDesignMode();
        await reportTOC.switchToFormatPanel();
        await newFormatPanelForGrid.expandLayoutSection();
        //  Check Lock header for Columns headers and scroll vertically.
        await reportFormatPanel.clickCheckBoxForOption('Column headers', 'Lock headers');
        await reportGridView.scrollGridToBottom('Visualization 1');
        await since(
            'After Scroll to bottom, the grid cell 1 1 visible should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(1, 1).isDisplayed())
            .toBe(true);
        // # Check Lock header for Row headers and scroll horizontally.
        await reportFormatPanel.clickCheckBoxForOption('Row headers', 'Lock headers');
        //  to fix here scrollGridHorizontally can't scroll to rightmost
        await reportGridView.scrollGridHorizontally('Visualization 1', 4000);
        await reportGridView.scrollGridToBottom('Visualization 1');
        await since(
            'After Scroll to right, the grid cell 35 0 visible should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(35, 0).isDisplayed())
            .toBe(true);
        // // # Uncheck Lock header for Row and Column headers.
        // await reportFormatPanel.clickCheckBoxForOption('Column headers', 'Lock headers');
        // await reportFormatPanel.clickCheckBoxForOption('Row headers', 'Lock headers');
        // await reportGridView.scrollGridHorizontally('Visualization 1', 400);
        // await since(
        //     'After Scroll to right, the grid cell 35 0 visible should be #{expected}, instead we have #{actual}'
        // )
        //     .expect(await reportGridView.getGridCellByPos(35, 0).isDisplayed())
        //     .toBe(false);
        // await since('After Scroll to right, the grid cell 0 0 visible should be #{expected}, instead we have #{actual}')
        //     .expect(await reportGridView.getGridCellByPos(0, 0).isDisplayed())
        //     .toBe(false);
    });
});
