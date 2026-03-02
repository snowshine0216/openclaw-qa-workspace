import * as reportConstants from '../../../../constants/report.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';

describe('Subset Report - Authoring', () => {
    let { loginPage, libraryPage, reportPage, reportGridView, reportToolbar, reportTOC, reportFilterPanel } =
        browsers.pageObj1;
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

    it('[BCIN-5389_01] Add attribute view filter to subset report', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.AirlineSubsetReport.id,
            projectId: reportConstants.AirlineSubsetReport.project.id,
        });
        await reportTOC.switchToFilterPanel();
        await reportToolbar.switchToDesignMode();
        await reportFilterPanel.switchToViewFilterTab();
        await reportFilterPanel.openNewViewFilterPanel();
        await reportFilterPanel.newQual.waitForObjectSearchDropdown();
        await reportFilterPanel.newQual.selectBasedOnObject('Year');
        await reportFilterPanel.selectElements(['2010', '2011']);
        await reportFilterPanel.saveAndCloseQualificationEditor();
        await reportFilterPanel.clickFilterApplyButton();
        // wait for number of flights of AirTran Airways Corporation to be 24221
        await reportGridView.waitForGridCellToBeExpectedValue(1, 3, '24221');
        await since('1. Report error popup should not display, instead error is shown')
            .expect(await reportPage.isReportErrorPopupPresent())
            .toBe(false);
    });

    it('[BCIN-5389_02] Add metric view filter to subset report', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.AirlineSubsetReport.id,
            projectId: reportConstants.AirlineSubsetReport.project.id,
        });
        await reportTOC.switchToFilterPanel();
        await reportToolbar.switchToDesignMode();
        await reportFilterPanel.switchToViewFilterTab();
        await reportFilterPanel.openNewViewFilterPanel();
        await reportFilterPanel.newQual.waitForObjectSearchDropdown();
        await reportFilterPanel.newQual.selectBasedOnObject('Number of Flights');
        await reportFilterPanel.newQual.enterValue('1797');
        await reportFilterPanel.saveAndCloseQualificationEditor();
        await reportFilterPanel.clickFilterApplyButton();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 3, '1797');
        await since('1. Report error popup should not display, instead error is shown')
            .expect(await reportPage.isReportErrorPopupPresent())
            .toBe(false);
    });
});
