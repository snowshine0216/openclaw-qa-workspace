import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import resetReportState from '../../../../api/reports/resetReportState.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';

describe('Report UI - Security Tests', () => {
    let {
        loginPage,
        libraryPage,
        reportMenubar,
        reportPage,
        reportGridView,
        reportToolbar,
        reportTOC,
        reportFilterPanel,
        setFilter,
        reportFilter,
        reportPromptEditor,
        reportEditorPanel,
        filterPanel,
        attributeFilter,
        metricFilter,
        reportDatasetPanel,
    } = browsers.pageObj1;
    const testUser = reportConstants.noReportVLDBPrivilegeUser;

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

    // BCIN-3675: [Report Editor] It will throw error "The request is reading or editing advanced properties,
    // but the caller does not hot have the 'Use VLDB property editor' privilege" when run report in authoring mode but
    // the user doesn't have use VLDB privilege
    it('[TC99125_01] Execute report by user without use VLDB property editor privilege in authoring mode', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductNoPageBy.id,
            projectId: reportConstants.UIReportProductNoPageBy.project.id,
        });
        await since('1. Report property menu item should be #{expected}, instead we have #{actual}')
            .expect(await reportMenubar.isSubMenuItemVisible('File', 'Report Properties'))
            .toBe(false);
        await reportMenubar.clickMenuItem('File');
        await reportToolbar.switchToDesignMode();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 4, '$158,651');
        await since('2. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('29 Rows, 3 Columns');
        await since('3. The total value of revenue should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(29, 4))
            .toBe('$11,517,606');
        await since('4. The total value of cost should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(29, 2))
            .toBe('$9,777,521');
        await reportToolbar.switchToPauseMode();
    });

    it('[TC99125_02] Execute report by user without use VLDB property editor privilege in consumption mode', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.UIReportProductNoPageBy,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.UIReportProductNoPageBy.id,
            projectId: reportConstants.UIReportProductNoPageBy.project.id,
        });
        await reportGridView.waitForGridCellToBeExpectedValue(1, 4, '$158,651');
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('29 Rows, 3 Columns');
        await since('2. The total value of revenue should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(29, 4))
            .toBe('$11,517,606');
        await since('3. The total value of cost should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(29, 2))
            .toBe('$9,777,521');
    });

    it('[BCIN-6707] Verify access child folder by shortcut when user has no access to parent folder', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductNoPageBy.id,
            projectId: reportConstants.UIReportProductNoPageBy.project.id,
        });
        await reportDatasetPanel.objectBrowser.searchObject('08. Defects');
        await reportDatasetPanel.objectBrowser.navigateInObjectBrowserFlatView(['08. Defects', 'BCIN-6707', 'child']);
        await since('1. The total objects in child folder should be #{expected}, instead it is #{actual}')
            .expect(await reportDatasetPanel.objectBrowser.getTotalObjectCount())
            .toBe(2);
        await since(
            '2. The object should be displayed in child folder in object browser, instead the object is not found'
        )
            .expect(await reportDatasetPanel.objectBrowser.isObjectPresentInFlatView('BCIN-6707'))
            .toBe(true);
        await reportPage.clickReportTitle();
        await takeScreenshotByElement(
            reportDatasetPanel.objectBrowser.getDatasetSelectContainer(),
            'BCIN-6707_01',
            'object browser after go to child folder'
        );
    });
});
