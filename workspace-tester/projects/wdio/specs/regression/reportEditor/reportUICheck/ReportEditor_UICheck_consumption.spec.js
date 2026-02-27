import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import resetReportState from '../../../../api/reports/resetReportState.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { dossier } from '../../../../constants/teams.js';

describe('Report UI - Consumption', () => {
    let {
        loginPage,
        libraryPage,
        dossierPage,
        reportPageBy,
        reportGridView,
        reportFilter,
        filterPanel,
        attributeFilter,
        reportSummary,
        reportDatasetPanel,
    } = browsers.pageObj1;
    const testUser = reportConstants.reportUICheckUser;

    beforeAll(async () => {
        await loginPage.login(testUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
    });

    it('[TC99678_01] Report with page by UI check', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.UIReportProductWithPageBy,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.UIReportProductWithPageBy.id,
            projectId: reportConstants.UIReportProductWithPageBy.project.id,
        });
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('7 Rows, 3 Columns');
        await takeScreenshotByElement(
            dossierPage.getNavigationBar(),
            'TC99678_01_01',
            'report with page by - navigation bar'
        );
        await reportSummary.viewAll();
        await takeScreenshotByElement(
            reportSummary.getSummaryContainer(),
            'TC99678_01_02',
            'filter summary with filter set'
        );
        await reportSummary.viewLess();
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC99678_01_03', 'report content with page by');
    });

    it('[TC99678_02] Report change group by', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.UIReportProductWithPageBy,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.UIReportProductWithPageBy.id,
            projectId: reportConstants.UIReportProductWithPageBy.project.id,
        });
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('7 Rows, 3 Columns');
        await reportPageBy.changePageByElement('Year', '2022');
        await reportGridView.waitForGridCellToBeExpectedValue(1, 3, '$78,526');
        await since('2. The grid cell of revenue under Books should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('$345,119');
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
            'TC99678_02_01',
            'report with style and show total'
        );
    });

    it('[TC99678_03] Report with style and show total', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.UIReportProductNoPageBy,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.UIReportProductNoPageBy.id,
            projectId: reportConstants.UIReportProductNoPageBy.project.id,
        });
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('29 Rows, 3 Columns');
        await since('2. The total value of revenue should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(29, 4))
            .toBe('$11,517,606');
        await since('3. The total value of cost should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(29, 2))
            .toBe('$9,777,521');
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
            'TC99678_03_01',
            'report with style and show total'
        );
    });

    //DE324268 - Grid reports in Library do not display subtotals when collapsed in outline mode.
    it('[TC99678_04] Report with outline', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.UIReportOutline,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.UIReportOutline.id,
            projectId: reportConstants.UIReportOutline.project.id,
        });
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('29 Rows, 3 Columns');
        await since('2. The total value of revenue should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('$11,517,606');
        await since('3. The total value of cost should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('$9,777,521');
        await since('4. The total value of profit should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$1,740,085');
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC99678_04_01', 'report with outline show total');
    });

    //DE329972 - "cannot read properties of undefined 'getPageByAction'" error occurs in Library when running reports with page by attributes.
    it('[TC99678_05] Report change page by for multi-form attribute', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.UIReportMultiForm,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.UIReportMultiForm.id,
            projectId: reportConstants.UIReportMultiForm.project.id,
        });
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('3 Rows, 3 Columns');
        await since('2. The cost of year 2020 should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('$901,136');
        await since('3. The profit of year 2021 should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 2))
            .toBe('$209,937');
        await since('4. The revenue of year 2022 should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(3, 3))
            .toBe('$1,741,915');
        await reportPageBy.changePageByElement('Region', '1:Northeast');
        await reportGridView.waitForGridCellToBeExpectedValue(1, 3, '$406,902');
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
            'TC99678_05_01',
            'change page by for region = Northeast'
        );
        await reportPageBy.changePageByElement('Call Center', 'New York:12');
        await reportGridView.waitForGridCellToBeExpectedValue(1, 3, '$1,839,393');
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
            'TC99678_05_02',
            'change page by for Call Center = New York'
        );
    });
});
