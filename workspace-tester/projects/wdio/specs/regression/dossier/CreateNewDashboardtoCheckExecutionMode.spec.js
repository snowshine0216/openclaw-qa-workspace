import setWindowSize from '../../../config/setWindowSize.js';
import { AGGridHideColumn, gridUser } from '../../../constants/grid.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';

describe('Create a New Dashboard to check execution mode', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let { loginPage, libraryPage, dossierCreator, dossierAuthoringPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridUser);
        await setWindowSize(browserWindow);
    });

    afterAll(async () => {
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
    });

    afterEach(async () => {
        await dossierAuthoringPage.goToLibrary();
    });

    it('[TC99388_1] Dashboard | Create a Blank Dashboard', async () => {
        await dossierCreator.createNewDossier();
        await dossierCreator.clickBlankDossierBtn();
        await dossierAuthoringPage.actionOnMenubarWithSubmenu('File', 'Dashboard Properties');
        since('The execution mode should be "Load pages on demand"')
            .expect(await (await dossierAuthoringPage.getDashboardExecutionMode()).getValue())
            .toBe('Load pages on demand');
        await dossierAuthoringPage.clickOnExecutionMode();
        await takeScreenshotByElement(
            await dossierAuthoringPage.getDashbaordExecutionModeDropdown(),
            'TC99388_1',
            'Check execution mode dropdown list for blank dashboard'
        );
        await dossierAuthoringPage.clickOnDashboardPropertiesEditorButton('Cancel');
    });

    it('[TC99388_2] Dashboard | Create a Dashboard with dataset', async () => {
        await dossierCreator.createNewDossier();
        await dossierCreator.searchData('city_ctr_sls_dda');
        await dossierCreator.clickDatasetCheckbox(['city_ctr_sls_dda']);
        await dossierCreator.clickCreateButton();
        await dossierAuthoringPage.actionOnMenubarWithSubmenu('File', 'Dashboard Properties');
        since('The execution mode should be "Load pages on demand"')
            .expect(await (await dossierAuthoringPage.getDashboardExecutionMode()).getValue())
            .toBe('Load pages on demand');
        await dossierAuthoringPage.clickOnExecutionMode();
        await takeScreenshotByElement(
            await dossierAuthoringPage.getDashbaordExecutionModeDropdown(),
            'TC99388_2',
            'Check execution mode dropdown list for dashboard with dataset'
        );
        await dossierAuthoringPage.clickOnDashboardPropertiesEditorButton('Cancel');
    });

    it('[TC99388_3] Dashboard | Create a Dashboard on Custom Template', async () => {
        await dossierCreator.createNewDossier();
        await dossierCreator.switchTabViewer('Select Template');
        await dossierCreator.searchTemplate('dashboardloadall');
        await dossierCreator.selectTemplate('dashboardloadall');
        await dossierCreator.clickCreateButton();
        await dossierAuthoringPage.actionOnMenubarWithSubmenu('File', 'Dashboard Properties');
        since('The execution mode should be "Load all chapters and pages"')
            .expect(await (await dossierAuthoringPage.getDashboardExecutionMode()).getValue())
            .toBe('Load all chapters and pages');
        await dossierAuthoringPage.clickOnExecutionMode();
        await takeScreenshotByElement(
            await dossierAuthoringPage.getDashbaordExecutionModeDropdown(),
            'TC99388_3',
            'Check execution mode dropdown list for dashboard on custom template'
        );
        await dossierAuthoringPage.clickOnDashboardPropertiesEditorButton('Cancel');
    });
});
