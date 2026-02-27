import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';

describe('Run MDX Report in Consumption', () => {
    let { loginPage, libraryPage, reportSummary, reportPage, reportPageBy, reportDatasetPanel, reportGridView } =
        browsers.pageObj1;
    const testUser = reportConstants.reportMDXTestUser;

    beforeAll(async () => {
        await loginPage.login(testUser);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
    });

    it('[BCIN-6531_01] Run MDX report without report filter', async () => {
        await libraryPage.openReportByUrl({
            documentId: reportConstants.mdxReportByCubeFinance.id,
            projectId: reportConstants.mdxReportByCubeFinance.project.id,
        });
        await reportGridView.waitForGridCellToBeExpectedValue(1, 0, 'Budget Variance %');
        await reportDatasetPanel.waitForStatusBarText('32 Rows, 2 Columns');
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6511_01', 'MDX report grid view');
    });

    it('[BCIN-6531_02] Run MDX report by SAP data source', async () => {
        await libraryPage.openReportByUrl({
            documentId: reportConstants.mdxReportBySAP.id,
            projectId: reportConstants.mdxReportBySAP.project.id,
        });
        await reportGridView.waitForGridCellToBeExpectedValue(1, 0, 'USA');
        await reportDatasetPanel.waitForStatusBarText('18 Rows, 1 Columns');
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6531_02', 'MDX report by SAP data source');
    });

    it('[BCIN-6531_03] Run MDX report with report filter', async () => {
        await libraryPage.openReportByUrl({
            documentId: reportConstants.mdxReportSAPWithFilter.id,
            projectId: reportConstants.mdxReportSAPWithFilter.project.id,
        });
        await reportGridView.waitForGridCellToBeExpectedValue(1, 0, 'USA');
        await reportDatasetPanel.waitForStatusBarText('17 Rows, 1 Columns');
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6531_03_01', 'MDX report with filter');
        await reportSummary.viewAll();
        await takeScreenshotByElement(reportSummary.getSummaryContainer(), 'BCIN-6531_03_02', 'filter summary details');
        await reportSummary.viewLess();
        await since('1. The first value under Revenue should be #{expected}, instead we got #{actual}')
            .expect(await reportGridView.getGridCellText(1, 3))
            .toBe('1,454');
        await reportGridView.sortByOption('Revenue', 'Sort All Values (Default)');
        await reportGridView.waitForGridCellToBeExpectedValue(1, 3, '169,547');
        await since('2. The first value under Revenue should be #{expected} after sort DESC, instead we got #{actual}')
            .expect(await reportGridView.getGridCellText(1, 3))
            .toBe('169,547');
    });

    it('[BCIN-6531_04] Run MDX report with hierarchy', async () => {
        await libraryPage.openReportByUrl({
            documentId: reportConstants.mdxReportWithHierarchy.id,
            projectId: reportConstants.mdxReportWithHierarchy.project.id,
        });
        await reportGridView.waitForGridCellToBeExpectedValue(1, 0, 'England');
        await reportDatasetPanel.waitForStatusBarText('4 Rows, 1 Columns');
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6531_04', 'MDX report with hierarchy');
        await reportPageBy.changePageByElement('Distribution Center', 'San Diego');
        await reportGridView.waitForGridCellToBeExpectedValue(1, 0, 'USA');
        await since('1. The first value under Revenue should be #{expected} after sort DESC, instead we got #{actual}')
            .expect(await reportGridView.getGridCellText(1, 2))
            .toBe('169,547');
        await since('2. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('1 Rows, 1 Columns');
    });
});
