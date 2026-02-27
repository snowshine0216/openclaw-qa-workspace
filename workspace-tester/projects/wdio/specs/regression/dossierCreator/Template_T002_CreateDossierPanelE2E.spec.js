import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import * as template from '../../../constants/template.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('Test Create Dashboard E2E', () => {
    let {
        loginPage,
        libraryPage,
        dossierCreator,
        share,
        dossierAuthoringPage,
        infoWindow,
        quickSearch,
        fullSearch,
        libraryItem,
        visualizationPanel,
    } = browsers.pageObj1;

    const templateUser = template.templateUser;
    const tutorialProject = template.dashboard_DefaultTemplate.project.name;
    const basicReport = '01 Basic Report';
    const airlineDataSet = 'Airline Data';
    const userTemplate = template.dashboard_UserTemplate.name;
    const noCoverImageTemplate = template.dashboard_Template_NoCoverImage.name;
    const checkTooltipTemplate = template.dashboard_Template_CheckTooltip.name;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(templateUser);
        await libraryPage.waitForLibraryLoading();
    });

    beforeEach(async () => {
        await dossierCreator.resetLocalStorage();
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await libraryPage.openDefaultApp();
        await logoutFromCurrentBrowser();
    });

    it('[TC99020_01] create blank dashboard and set as template', async () => {
        const blankDashboard = 'TC99020_01';
        await dossierCreator.createNewDossier();
        await dossierCreator.switchProjectByName(tutorialProject);
        await dossierCreator.clickBlankDossierBtn();
        await dossierAuthoringPage.saveAsNewObject(blankDashboard);
        await dossierAuthoringPage.dashboardMenuBar.toggleSetAsTemplate();
        await since(
            'After set as template, the template icon should be displayed in the title bar, instead we get #{actual}'
        )
            .expect(await dossierAuthoringPage.getDossierTemplateIconInTitle().isDisplayed())
            .toBe(true);
        await libraryPage.openDefaultApp();
        await libraryPage.openDossierInfoWindow(blankDashboard);
        // await infoWindow.hideCertifiedDetailsText();
        await since(
            'After set as template and open info window, template icon should be displayed in the info window, instead we get #{actual}'
        )
            .expect(await infoWindow.getTemplateIcon().isDisplayed())
            .toBe(true);
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(blankDashboard);
        await fullSearch.waitForSearchLoading();
        await since(
            'After set as template and search, template icon should be displayed in the search page instead we get #{actual}'
        )
            .expect(await fullSearch.getTemplateIcon(blankDashboard).isDisplayed())
            .toBe(true);
    });

    it('[TC99020_02] Create dossier based on blank template', async () => {
        const blankTemplateDashboard = 'BlankTemplateDossier';
        await dossierCreator.createNewDossier();
        await dossierCreator.switchProjectByName(tutorialProject);
        await dossierCreator.switchTabViewer('Select Template');
        await dossierCreator.selectTemplate('Blank');
        await dossierCreator.clickCreateButton();
        await dossierAuthoringPage.saveAsNewObject(blankTemplateDashboard);
        await dossierAuthoringPage.dashboardMenuBar.toggleCertify();
        await since('After certify, the certified icon should be displayed in the title bar, instead we get #{actual}')
            .expect(await dossierAuthoringPage.getDossierCertifiedIconInTitle().isDisplayed())
            .toBe(true);
        await libraryPage.openDefaultApp();
        await libraryPage.openDossierInfoWindow(blankTemplateDashboard);
        await infoWindow.hideCertifiedDetailsText();
        await since(
            'After certify and open info window, the certified icon should be displayed in the info window, instead we get #{actual}'
        )
            .expect(await infoWindow.getCertifiedIcon().isDisplayed())
            .toBe(true);
    });

    it('[TC99020_03] Create dossier based on default template', async () => {
        const defaultTemplateDashboard = 'DefaultTemplateDossier';
        await dossierCreator.createNewDossier();
        await dossierCreator.switchProjectByName(tutorialProject);
        await dossierCreator.switchTabViewer('Select Template');
        await dossierCreator.clickCreateButton();
        await dossierAuthoringPage.saveAsNewObject(defaultTemplateDashboard);
        await dossierAuthoringPage.dashboardMenuBar.clickSaveInMenuBar();
        await dossierAuthoringPage.dashboardMenuBar.toggleCertify();
        await since('After certify, the certified icon should be displayed in the title bar, instead we get #{actual}')
            .expect(await dossierAuthoringPage.getDossierCertifiedIconInTitle().isDisplayed())
            .toBe(true);
        await libraryPage.openDefaultApp();
        await libraryPage.openDossierInfoWindow(defaultTemplateDashboard);
        await infoWindow.hideCertifiedDetailsText();
        await since(
            'After certify and open info window, the certified icon should be displayed in the info window, instead we get #{actual}'
        )
            .expect(await infoWindow.getCertifiedIcon().isDisplayed())
            .toBe(true);
    });

    it('[TC99020_04] Create dashboard based on dataset', async () => {
        const datasetBasedDashboard = 'DatasetBasedDossier';
        await dossierCreator.createNewDossier();
        await dossierCreator.switchProjectByName(tutorialProject);
        await dossierCreator.searchData(airlineDataSet);
        await dossierCreator.clickDatasetCheckbox([airlineDataSet]);
        await dossierCreator.switchTabViewer('Select Template');
        await dossierCreator.selectTemplate('Blank');
        await dossierCreator.clickCreateButton();
        await dossierAuthoringPage.saveAsNewObject(datasetBasedDashboard);
        await dossierAuthoringPage.dashboardMenuBar.toggleSetAsTemplate();
        await since(
            'After set as template, the template icon should be displayed in the title bar, instead we get #{actual}'
        )
            .expect(await dossierAuthoringPage.dashboardMenuBar.isTemplateIconDisplayedInTitleBar())
            .toBe(true);
        await dossierAuthoringPage.dashboardMenuBar.toggleCertify();
        await since('After certify, the certified icon should be displayed in the title bar, instead we get #{actual}')
            .expect(await dossierAuthoringPage.getDossierCertifiedIconInTitle().isDisplayed())
            .toBe(true);
        await dossierAuthoringPage.dashboardMenuBar.clickSaveInMenuBar();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
    });

    it('[TC99020_05] Create dossier based on report', async () => {
        const reportBasedDashboard = 'ReportBasedDossier';
        await dossierCreator.createNewDossier();
        await dossierCreator.switchProjectByName(tutorialProject);
        await dossierCreator.switchToReportTab();
        await dossierCreator.searchData(basicReport);
        await dossierCreator.clickCreateButton();
        await dossierAuthoringPage.saveAsNewObject(reportBasedDashboard);
        await dossierAuthoringPage.dashboardMenuBar.toggleCertify();
        await dossierAuthoringPage.dashboardMenuBar.clickSaveInMenuBar();
        await dossierAuthoringPage.dashboardMenuBar.toggleSetAsTemplate();
        await dossierAuthoringPage.dashboardMenuBar.clickSaveInMenuBar();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await dossierAuthoringPage.waitForElementVisible(dossierAuthoringPage.getDossierTemplateIconInTitle());
        await since(
            'After set as template, the template icon should be displayed in the title bar, instead we get #{actual}'
        )
            .expect(await dossierAuthoringPage.getDossierTemplateIconInTitle().isDisplayed())
            .toBe(true);
        await since(
            'After set as template, the template icon should be displayed in the title bar, instead we get #{actual}'
        )
            .expect(await dossierAuthoringPage.getDossierCertifiedIconInTitle().isDisplayed())
            .toBe(true);
        await libraryPage.openDefaultApp();
        await libraryPage.openDossierInfoWindow(reportBasedDashboard);
        await since(
            'After set as template, the template icon should be displayed in the info window, instead we get #{actual}'
        )
            .expect(await infoWindow.getTemplateIcon().isDisplayed())
            .toBe(true);

        await since('After certify, the certified icon should be displayed in library card, instead we get #{actual}')
            .expect(await infoWindow.getCertifiedIcon().isDisplayed())
            .toBe(true);
    });

    it('[TC99020_06] Create dossier based on a user template', async () => {
        const userTemplateBasedDashboard = 'UserTemplateBasedDossier';
        await dossierCreator.createNewDossier();
        await dossierCreator.switchProjectByName(tutorialProject);
        await dossierCreator.switchTabViewer('Select Template');
        await dossierCreator.selectTemplate(userTemplate);
        await dossierCreator.clickCreateButton();
        await dossierAuthoringPage.saveAsNewObject(userTemplateBasedDashboard);
        await dossierAuthoringPage.dashboardMenuBar.toggleCertify();
        await dossierAuthoringPage.dashboardMenuBar.toggleSetAsTemplate();
        await since(
            'After use user template, the dataset panel should have #{expected} in dataset, instead we get #{actual}'
        )
            .expect(JSON.stringify(await dossierAuthoringPage.getDatasetNamesInDatasetsPanel()))
            .toBe(JSON.stringify(['Dashboard Parameters', 'baseReport_template']));
        await takeScreenshotByElement(visualizationPanel.getVIDoclayout(), 'TC99020_06_03', 'pre-defined heat maps');
        await dossierAuthoringPage.dashboardMenuBar.clickSaveInMenuBar();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await libraryPage.openDefaultApp();
        await libraryPage.moveDossierIntoViewPort(userTemplateBasedDashboard);
        await since(
            'After save template open library, the template icon should be displayed in the library card, instead we get #{actual}'
        )
            .expect(await libraryItem.getTemplateIcon(userTemplateBasedDashboard).isDisplayed())
            .toBe(true);
        await since(
            'After save and toggle certified, the certified icon should be displayed in the library card, instead we get #{actual}'
        )
            .expect(await libraryItem.getCertifiedIcon(userTemplateBasedDashboard).isDisplayed())
            .toBe(true);
    });

    it('[TC99020_07] Create dossier based on dataset + report + user template', async () => {
        const datasetReportUserTemplateDashboard = 'DatasetReportUserTemplateDossier';
        await dossierCreator.createNewDossier();
        await dossierCreator.switchProjectByName(tutorialProject);
        await dossierCreator.searchData(airlineDataSet);
        await dossierCreator.clickDatasetCheckbox([airlineDataSet]);
        await dossierCreator.switchToReportTab();
        await dossierCreator.searchData(basicReport);
        await dossierCreator.switchTabViewer('Select Template');
        await dossierCreator.selectTemplate(userTemplate);
        await dossierCreator.clickCreateButton();
        await dossierAuthoringPage.saveAsNewObject(datasetReportUserTemplateDashboard);
        await dossierAuthoringPage.dashboardMenuBar.toggleSetAsTemplate();
        await since(
            'After use user template, the dataset panel should have #{expected} in dataset, instead we get #{actual}'
        )
            .expect(JSON.stringify(await dossierAuthoringPage.getDatasetNamesInDatasetsPanel()))
            .toBe(JSON.stringify(['Dashboard Parameters', 'baseReport_template', 'Airline Data']));
        await takeScreenshotByElement(visualizationPanel.getVIDoclayout(), 'TC99020_07_03', 'pre-defined viz');
        await dossierAuthoringPage.dashboardMenuBar.clickSaveInMenuBar();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await libraryPage.openDefaultApp();
        await since(
            'After save template open library, the template icon should be displayed in the library card, instead we get #{actual}'
        )
            .expect(await libraryItem.getTemplateIcon(datasetReportUserTemplateDashboard).isDisplayed())
            .toBe(true);
    });

    it('[TC99020_08] Open a template dossier and unset the template', async () => {
        await libraryPage.editDossierByUrl({
            projectId: template.dashboard_UserTemplate.project.id,
            dossierId: template.dashboard_UserTemplate.id,
        });
        await takeScreenshotByElement(
            dossierAuthoringPage.getDossierTitleText(),
            'TC99020_08_01',
            'edit template dashboard'
        );
        await dossierAuthoringPage.dashboardMenuBar.toggleSetAsTemplate();
        await takeScreenshotByElement(dossierAuthoringPage.getDossierTitleText(), 'TC99020_08_02', 'unset template');
        await dossierAuthoringPage.dashboardMenuBar.toggleSetAsTemplate();
        await takeScreenshotByElement(dossierAuthoringPage.getDossierTitleText(), 'TC99020_08_03', 'set template');
        await libraryPage.openDefaultApp();
    });

    it('[TC99020_09] Create a dossier based on dataset to be republished', async () => {
        const unloadCube = 'unload_cube';
        await dossierCreator.createNewDossier();
        await dossierCreator.switchProjectByName(tutorialProject);
        await dossierCreator.switchTabViewer('Add Data');
        await dossierCreator.searchData(unloadCube);
        await dossierCreator.clickDatasetCheckbox([unloadCube]);
        await dossierCreator.switchTabViewer('Select Template');
        await dossierCreator.selectTemplate('Blank');
        await dossierCreator.clickCreateButton();
        await dossierAuthoringPage.waitForElementVisible(dossierAuthoringPage.getErrorDialogue());
        await dossierAuthoringPage.showDetails();
        await takeScreenshotByElement(
            dossierAuthoringPage.getErrorDialogMainContainer(),
            'TC99020_09_01',
            'cube not publish'
        );
    });

    it('[TC99020_10] Select more than 10 datasets to create dossier', async () => {
        await dossierCreator.createNewDossier();
        await dossierCreator.switchTabViewer('Add Data');
        await dossierCreator.switchProjectByName(tutorialProject);
        await dossierCreator.clickNameCheckbox();
        await dossierCreator.clickCreateButton();
        await dossierAuthoringPage.waitForElementVisible(dossierAuthoringPage.getErrorDialogMainContainer());
        await dossierAuthoringPage.showDetails();
        await takeScreenshotByElement(
            dossierAuthoringPage.getErrorDialogMainContainer(),
            'TC99020_10_01',
            'more than 10 datasets'
        );
    });

    // DE252716
    it('[TC99020_11] Update cover image in share menu', async () => {
        await libraryPage.openDossier(noCoverImageTemplate);
        await share.openSharePanel();
        await share.openShareDossierDialog();
        await share.hideOwnerAndTimestampInShareDashboardDialog();
        await since('In share dialog, the cover image should be blank, instead we get #{actual}')
            .expect(await share.isCoverImageBlank())
            .toBe(true);
    });

    // DE253433 and DE254334
    it('[TC99020_12] Check template info when DI triggered', async () => {
        await dossierCreator.createNewDossier();
        await dossierCreator.clickBlankDossierBtn();
        await dossierAuthoringPage.addNewSampleData(0);
        await libraryPage.openDefaultApp();
        await dossierCreator.createNewDossier();
        await dossierCreator.switchProjectByName(tutorialProject);
        await dossierCreator.switchTabViewer('Select Template');
        await dossierCreator.selectTemplate(checkTooltipTemplate);
        await dossierCreator.checkTemplateInfo(checkTooltipTemplate);
        await dossierCreator.fakeUpdateTimestamp();
        await takeScreenshotByElement(
            dossierCreator.getCreateNewDossierSelectTemplateInfoPanel(),
            'TC99020_12_01',
            `Check Template info`
        );
    });
});
