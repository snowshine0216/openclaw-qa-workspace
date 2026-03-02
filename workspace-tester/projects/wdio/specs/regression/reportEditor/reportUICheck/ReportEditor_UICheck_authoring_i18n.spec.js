import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';

describe('Report UI - Authoring General', () => {
    let {
        loginPage,
        libraryPage,
        reportPage,
        reportGridView,
        reportToolbar,
        reportTOC,
        newFormatPanelForGrid,
        reportDatasetPanel,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
    });

    // BCIN-5296 レポートの書式設定が一部英語表記になっている/Parts of the text on formatting pain in the report are displayed in English randomly although language has been set to Japanese.
    it('[BCIN-5296] Verify report format panel under Japanese', async () => {
        await loginPage.login(reportConstants.testUserInJapanese);
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductWithPageBy.id,
            projectId: reportConstants.UIReportProductWithPageBy.project.id,
        });
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-5296_01',
            'report authoring view in pause mode under Japanese'
        );
        await reportTOC.switchToFormatPanel();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-5296_02',
            'collapsed format panel under Japanese'
        );
        await newFormatPanelForGrid.expandTemplateSection(reportConstants.Locales.Japanese);
        await newFormatPanelForGrid.expandLayoutSection(reportConstants.Locales.Japanese);
        await newFormatPanelForGrid.expandSpacingSection(reportConstants.Locales.Japanese);
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-5296_03', 'expand format panel under Japanese');
        await reportToolbar.switchToDesignMode();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        // wait for video equipment revenue to be $1,254,030
        await reportGridView.waitForGridCellToBeExpectedValue(7, 4, '$1,254,030');
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-5296_04',
            'report authoring view in design mode under Japanese'
        );
    });
});
