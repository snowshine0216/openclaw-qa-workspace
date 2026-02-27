import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';

describe('Folder Browser in Report Editor', () => {
    let { loginPage, libraryPage, reportDatasetPanel } = browsers.pageObj1;

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

    it('[TC99129_01] Navigate in folder browser dropdown', async () => {
        const folderToSelect = '0SurveyTestObjects';
        await libraryPage.createNewReportByUrl({});
        await reportDatasetPanel.folderBrowser.openFolderByPath(['Public Objects', 'Reports', folderToSelect]);
        await since('1. After expanding folder browser, the content should be loaded, instead we have #{actual}')
            .expect(await reportDatasetPanel.folderBrowser.getFolderItemByName('No Folders').isDisplayed())
            .toBe(true);
        await reportDatasetPanel.folderBrowser.chooseFolderByName(folderToSelect);
        await since('2. Current folder selection should be is #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.folderBrowser.getCurrentSelection().getText())
            .toBe(folderToSelect);
    });

    it('[TC99129_02] Re-open folder browser', async () => {
        const folderToSelect = '01. Date';
        await libraryPage.createNewReportByUrl({});
        await reportDatasetPanel.folderBrowser.openFolderByPath(['Public Objects', 'Filters', folderToSelect]);
        await reportDatasetPanel.folderBrowser.chooseFolderByName(folderToSelect);
        await since('1. Current folder selection should be is #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.folderBrowser.getCurrentSelection().getText())
            .toBe(folderToSelect);
        await reportDatasetPanel.folderBrowser.openObjectSelector();
        await reportDatasetPanel.sleep(1000); // wait for dropdown animation finished
        await takeScreenshotByElement(
            reportDatasetPanel.folderBrowser.getFolderBrowserDropdown(),
            'TC99129_02',
            'Re-open folder browser'
        );
    });
});
