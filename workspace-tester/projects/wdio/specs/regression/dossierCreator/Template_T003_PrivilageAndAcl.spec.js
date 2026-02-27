import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import * as template from '../../../constants/template.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('Test Template by privilege and acl', () => {
    let { loginPage, libraryPage, dossierCreator, dossierAuthoringPage } = browsers.pageObj1;

    const templateUser = template.templateUser;
    const tutorialProject = template.TutorialProject;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(templateUser);
    });

    beforeEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await libraryPage.openDefaultApp();
        await logoutFromCurrentBrowser();
    });

    it('[TC99021_01] user without set template privilege', async () => {
        await libraryPage.switchUser(template.noSetTemplate);
        await libraryPage.editDossierByUrl({
            projectId: template.dashboard_Template_CheckTooltip.project.id,
            dossierId: template.dashboard_Template_CheckTooltip.id,
        });
        await dossierAuthoringPage.dashboardMenuBar.openFileMenu();
        await takeScreenshotByElement(
            dossierAuthoringPage.dashboardMenuBar.getSubMenuContainer(),
            'TC99021_01',
            'no set template privilege'
        );
    });

    it('[TC99021_02] user no read acl to default template', async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.switchUser(template.noAclToDefaultTemplate);
        await dossierCreator.createNewDossier();
        await dossierCreator.switchProjectByName(tutorialProject);
        await dossierCreator.switchTabViewer('Select Template');
        // await takeScreenshotByElement(
        //     dossierCreator.getCreateNewDossierPanel(),
        //     'TC99021_02',
        //     'fall back to blank template'
        // );
        await since(
            'For user without read acl to default template, the blank template should be selected, instead we have #{actual}.'
        )
            .expect(await dossierCreator.isBlankTemplateSelected())
            .toBe(true);
    });

    it('[TC99021_03] user no write acl to dashboard', async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.switchUser(template.noWriteTemplate);
        await libraryPage.editDossierByUrl({
            projectId: template.dashboard_DefaultTemplate.project.id,
            dossierId: template.dashboard_DefaultTemplate.id,
        });
        await dossierAuthoringPage.dashboardMenuBar.openFileMenu();
        await takeScreenshotByElement(
            dossierAuthoringPage.dashboardMenuBar.getSubMenuContainer(),
            'TC99021_03',
            'no write acl'
        );
    });

    it('[TC99021_04] Project level set template privilege check', async () => {
        const dashboardName = 'TC99021_04';
        await libraryPage.switchUser(template.templateProjectLevel);
        await dossierCreator.createNewDossier();
        // user has set template privilege for Tutorial project
        await dossierCreator.switchProjectByName(tutorialProject);
        await dossierCreator.clickBlankDossierBtn();
        await dossierAuthoringPage.saveAsNewObject(`${dashboardName} tutorial`);
        await dossierAuthoringPage.dashboardMenuBar.openFileMenu();
        await takeScreenshotByElement(
            dossierAuthoringPage.dashboardMenuBar.getSubMenuContainer(),
            'TC99021_04_01',
            'can set template'
        );
        // edit dashboard directly
        await libraryPage.editDossierByUrl({
            projectId: template.HierarchiesProject.id,
            dossierId: 'CB904D36214A635F0BB704A6DBFB0788',
        });
        await dossierAuthoringPage.dashboardMenuBar.openFileMenu();
        await takeScreenshotByElement(
            dossierAuthoringPage.dashboardMenuBar.getSubMenuContainer(),
            'TC99021_04_02',
            'can not set template'
        );
    });

    //DE276913: Inconsistent behavior of selecting dataset that has acl ('use' vs. 'use' and 'execute')
    it('[TC99021_05] use acl for datasets', async () => {
        await libraryPage.switchUser(template.templateProjectLevel);
        const dataSetOnlyUseAcl = 'TC99021_05_only_use';
        const dataSetExecuteAndUseAcl = 'TC99021_05_use_and_execute';
        await dossierCreator.createNewDossier();
        await dossierCreator.switchProjectByName(tutorialProject);
        await dossierCreator.searchData('TC99021_05');
        // TC99021_05_only_execute cannot be selected
        await takeScreenshotByElement(
            dossierCreator.getCreateNewDossierPanel(),
            'TC99021_05_01',
            'no execute cannot select'
        );
        await dossierCreator.searchSelectAndCreateDossier([dataSetOnlyUseAcl, dataSetExecuteAndUseAcl]);
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await dossierAuthoringPage.waitForElementVisible(dossierAuthoringPage.getDatasetPanel());
        await since(
            'After use user template, the dataset panel should have #{expected} in dataset, instead we get #{actual}'
        )
            .expect(JSON.stringify(await dossierAuthoringPage.getDatasetNamesInDatasetsPanel()))
            .toBe(JSON.stringify(['Parameters', 'baseReport_template', dataSetOnlyUseAcl, dataSetExecuteAndUseAcl]));
    });

    it('[TC99021_06] use and execute acl for report', async () => {
        await libraryPage.switchUser(template.templateProjectLevel);
        const reportExecuteAndUseAcl = 'TC99021_06_use_and_execute';
        await dossierCreator.createNewDossier();
        await dossierCreator.switchProjectByName(tutorialProject);
        await dossierCreator.switchToReportTab();
        await dossierCreator.searchData('TC99021_06');
        // TC99021_06_only_use and TC99021_06_only_execute cannot be selected
        await takeScreenshotByElement(
            dossierCreator.getCreateNewDossierPanel(),
            'TC99021_06_01',
            'no execute cannot select'
        );
        await dossierCreator.searchData(reportExecuteAndUseAcl);
        await dossierCreator.clickDatasetCheckbox([reportExecuteAndUseAcl]);
        await dossierCreator.clickCreateButton();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await dossierAuthoringPage.waitForElementVisible(dossierAuthoringPage.getDatasetPanel());
        // check unset as template shows up in file menu
        await since(
            'After use user template, the dataset panel should have #{expected} in dataset, instead we get #{actual}'
        )
            .expect(JSON.stringify(await dossierAuthoringPage.getDatasetNamesInDatasetsPanel()))
            .toBe(JSON.stringify(['Parameters', 'baseReport_template', 'TC99021_06_use_and_execute']));
    });
});
