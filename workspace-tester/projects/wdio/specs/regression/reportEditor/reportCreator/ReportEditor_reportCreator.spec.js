import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';

describe('Report Creator Test', () => {
    let { loginPage, libraryPage, dossierCreator, reportPage, reportGridView, reportDatasetPanel } = browsers.pageObj1;
    const testUser = reportConstants.reportTemplateTestUser;
    const tutorialProject = reportConstants.tutorialProject;
    const hierarchiesProject = reportConstants.hierarchiesProject;
    const subscriptionProject = reportConstants.subscriptionProject;
    const templateWithPageBy = 'report template with page by';
    const certifiedTemplate = 'report template certified';

    beforeAll(async () => {
        await loginPage.login(testUser);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await dossierCreator.resetLocalStorage();
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
    });

    it('[BCIN-3809_01] Report creator UI check', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(hierarchiesProject.name);
        await takeScreenshotByElement(
            dossierCreator.getCreateNewDossierPanel(),
            'BCIN-3809_01_01',
            'blank template as default'
        );
        await dossierCreator.selectTemplate('Report Builder');
        await takeScreenshotByElement(
            dossierCreator.getCreateNewDossierPanel(),
            'BCIN-3809_01_02',
            'select report builder template'
        );
        await dossierCreator.switchToListView();
        await dossierCreator.sleep(2000); // wait for animation complete
        await takeScreenshotByElement(
            dossierCreator.getCreateNewDossierAddDataBody(),
            'BCIN-3809_01_03',
            'switch to list view'
        );
    });

    it('[BCIN-3809_02] Switch project after select template', async () => {
        const report = 'report template with prompt';
        await dossierCreator.createNewReport();
        await dossierCreator.selectTemplate('Report Builder');
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.searchTemplate(report);
        await dossierCreator.selectTemplate(report);
        await takeScreenshotByElement(
            dossierCreator.getCreateNewDossierPanel(),
            'BCIN-3809_02_01',
            'select template in tutorial'
        );
        await dossierCreator.switchProjectByName(hierarchiesProject.name);
        await takeScreenshotByElement(dossierCreator.getCreateNewDossierPanel(), 'BCIN-3809_02_02', 'switch project');
    });

    it('[BCIN-3809_03] Disable blank template', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(subscriptionProject.name);
        await takeScreenshotByElement(
            dossierCreator.getCreateNewDossierPanel(),
            'BCIN-3809_03_01',
            'disable blank template'
        );
    });

    it('[BCIN-3809_04] Open info window in report creator', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.searchTemplate(templateWithPageBy);
        await dossierCreator.selectTemplate(templateWithPageBy);
        await dossierCreator.checkTemplateInfo(templateWithPageBy);
        await dossierCreator.fakeUpdateTimestamp();
        await takeScreenshotByElement(
            dossierCreator.getCreateNewDossierSelectTemplateInfoPanel(),
            'BCIN-3809_04_01',
            `Check Template ${templateWithPageBy} info`
        );
        await dossierCreator.clearSearchData();
        await dossierCreator.searchTemplate(certifiedTemplate);
        await dossierCreator.selectTemplate(certifiedTemplate);
        await dossierCreator.checkTemplateInfo(certifiedTemplate);
        await dossierCreator.fakeUpdateTimestamp();
        await takeScreenshotByElement(
            dossierCreator.getCreateNewDossierSelectTemplateInfoPanel(),
            'BCIN-3809_04_02',
            `Check Template ${certifiedTemplate} info`
        );
    });

    it('[BCIN-3809_05] select template in list view', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.selectExecutionMode();
        await dossierCreator.switchToListView();
        await dossierCreator.searchTemplate(templateWithPageBy);
        await dossierCreator.selectTemplate(templateWithPageBy);
        await dossierCreator.clickCreateButton();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 4, '$1,304,141');
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('29 Rows, 3 Columns');
        await libraryPage.openDefaultApp();
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.switchToListView();
        await dossierCreator.searchTemplate(certifiedTemplate);
        await dossierCreator.selectTemplate(certifiedTemplate);
        await dossierCreator.clickCreateButton();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 3, '$196,301');
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('24 Rows, 2 Columns');
    });
});
