import * as reportConstants from '../../../../constants/report.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';

describe('Create Report by Cube Security', () => {
    let { loginPage, libraryPage, dossierCreator } = browsers.pageObj1;
    const testUser = reportConstants.reportTestUserWithoutDefineCubePrivilege;
    const tutorialProject = reportConstants.tutorialProject;
    const hierarchiesProject = reportConstants.hierarchiesProject;

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

    it('[BCIN-6915_01] No define intelligent cube report privilege for some of the projects', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await since('1. Current selected tab should be #{expected}, instead it is #{actual}.')
            .expect(await dossierCreator.getActiveTabHeaderText())
            .toBe('Select Template');
        await dossierCreator.switchToCubesTab();
        await since('2. Current selected tab should be #{expected}, instead it is #{actual}.')
            .expect(await dossierCreator.getActiveTabHeaderText())
            .toBe('Cubes');
        await dossierCreator.switchProjectByName(hierarchiesProject.name);
        await since('3. Current selected tab should be #{expected}, instead it is #{actual}.')
            .expect(await dossierCreator.getActiveTabHeaderText())
            .toBe('Select Template');
        await since('4. Create button should be enabled after selecting a cube, instead it is still disabled')
            .expect(await dossierCreator.isCreateButtonEnabled())
            .toBe(true);
        await dossierCreator.closeNewDossierPanel();
    });

    it('[BCIN-6915_02] No use ACL dataset cannot be selected', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.switchToCubesTab();
        await dossierCreator.searchData('TC99021');
        await dossierCreator.sortDataByHeaderName('Date Created');
        await dossierCreator.selectReportCube({ name: 'TC99021_05_only_execute', isWait: false });
        await dossierCreator.sleep(2000);
        await since(
            '1. Create button should be disabled after selecting a cube without use ACL, instead it is still enabled'
        )
            .expect(await dossierCreator.isCreateButtonEnabled())
            .toBe(false);
        await dossierCreator.selectReportCube({ name: 'TC99021_05_only_use' });
        await since(
            '2. Create button should be enabled after selecting a cube with use ACL, instead it is still disabled'
        )
            .expect(await dossierCreator.isCreateButtonEnabled())
            .toBe(true);
        await dossierCreator.closeNewDossierPanel();
    });
});
