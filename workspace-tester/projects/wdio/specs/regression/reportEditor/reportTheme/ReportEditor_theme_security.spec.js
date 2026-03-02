import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';

describe('Report privilege check', () => {
    let { loginPage, libraryPage, reportPage, reportToolbar, reportTOC, reportDatasetPanel, reportThemePanel } =
        browsers.pageObj1;
    const testUser = reportConstants.testUserWithoutUseFormattingEditorPrivilege;

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

    it('[BCIN-6493_01] apply theme with orange template and banding', async () => {
        const orangeThemeWithBanding = 't02. orange template with banding';
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductNoPageBy.id,
            projectId: reportConstants.UIReportProductNoPageBy.project.id,
        });
        await reportToolbar.switchToDesignMode();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportTOC.switchToThemePanel();
        await since('1. Theme panel should be displayed, instead it is not shown')
            .expect(await reportThemePanel.isThemePanelDisplayed())
            .toBe(true);
        await reportThemePanel.searchTheme(orangeThemeWithBanding);
        await reportThemePanel.applyTheme(orangeThemeWithBanding);
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6493_01_01',
            `After applying ${orangeThemeWithBanding} theme`
        );
    });
});
