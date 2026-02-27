import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import resetReportState from '../../../../api/reports/resetReportState.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import * as consts from '../../../../constants/customApp/info.js';
import { mockFeatureFlagOfViewFilter } from '../../../../api/mock/mock-response-utils.js';
import createCustomApp from '../../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../../api/customApp/deleteCustomApp.js';

describe('Report UI - Consumption View Filter', () => {
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
    let customAppId;

    beforeAll(async () => {
        await loginPage.login(testUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        customAppId &&
            (await deleteCustomAppList({
                credentials: consts.mstrUser.credentials,
                customAppIdList: [customAppId],
            }));
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
    });

    it('[BCIN-7298_01] Respect view filter feature flag when application setting is unset', async () => {
        await mockFeatureFlagOfViewFilter(false);
        await resetReportState({
            credentials: testUser,
            report: reportConstants.UIReportProductWithPageBy,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.UIReportProductWithPageBy.id,
            projectId: reportConstants.UIReportProductWithPageBy.project.id,
        });
        await reportGridView.waitForGridCellToBeExpectedValue(1, 4, '$201,164');
        await since('1. report view filter icon should not show, instead it is shown')
            .expect(await filterPanel.isFilterIconPresent())
            .toBe(false);
        await mockFeatureFlagOfViewFilter(true);
        await libraryPage.openReportByUrl({
            documentId: reportConstants.UIReportProductWithPageBy.id,
            projectId: reportConstants.UIReportProductWithPageBy.project.id,
        });
        await reportGridView.waitForGridCellToBeExpectedValue(1, 4, '$201,164');
        await since('2. report view filter icon should show, instead it is not shown')
            .expect(await filterPanel.isFilterIconPresent())
            .toBe(true);
    });

    it('[BCIN-7298_02] Report view filter should not show when application setting is off but feature flag is on', async () => {
        const customAppObj = consts.reportViewFilterOffCustomAppObj;
        await resetReportState({
            credentials: testUser,
            report: reportConstants.UIReportProductWithPageBy,
        });
        customAppId = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: customAppObj,
        });
        await mockFeatureFlagOfViewFilter(true);
        await libraryPage.openCustomAppById({ id: customAppId });
        await libraryPage.openDossier(reportConstants.UIReportProductWithPageBy.name);
        await reportGridView.waitForGridCellToBeExpectedValue(1, 4, '$201,164');
        await since('1. report view filter icon should not show, instead it is shown')
            .expect(await filterPanel.isFilterIconPresent())
            .toBe(false);
    });

    it('[BCIN-7298_03] Report view filter should show when application setting is on but feature flag is off', async () => {
        const customAppObj = consts.reportViewFilterOnCustomAppObj;
        customAppId = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: customAppObj,
        });
        await resetReportState({
            credentials: testUser,
            report: reportConstants.UIReportProductNoPageBy,
        });
        await mockFeatureFlagOfViewFilter(false);
        await libraryPage.openCustomAppById({ id: customAppId });
        await libraryPage.openDossier(reportConstants.UIReportProductNoPageBy.name);
        await reportGridView.waitForGridCellToBeExpectedValue(1, 4, '$158,651');
        await since('1. report view filter icon should show, instead it is not shown')
            .expect(await filterPanel.isFilterIconPresent())
            .toBe(true);
        await reportFilter.open();
        await reportFilter.waitForElementVisible(reportFilter.getApplyBtn());
        await attributeFilter.create();
        await attributeFilter.selectBasedOnObject('Category');
        await attributeFilter.selectAttributeElement(['Books']);
        await attributeFilter.done();
        await reportFilter.apply();
        await reportDatasetPanel.waitForStatusBarText('8 Rows');
        await since('2. total data rows should be #{expected}, instead it is #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('8 Rows, 3 Columns');
    });
});
