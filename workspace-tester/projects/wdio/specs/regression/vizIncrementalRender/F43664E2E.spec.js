import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import * as gridConstants from '../../../constants/grid.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('F43664E2E', () => {
    const dashboardIncrementalRender = {
        id: '6E6DF5451D4EAFF6B87296B3928E4FF7',
        name: 'F43664Auto',
        project: {
            id: '3FAB3265F7483C928678B6BF0564D92A',
            name: 'Platform Analytics',
        },
    };
    const dashboardLinking = {
        id: 'E679E6C3D240D2AF3D6EE38BFD2797DE',
        name: 'F43664_Auto_Linking',
        project: {
            id: '3FAB3265F7483C928678B6BF0564D92A',
            name: 'Platform Analytics',
        },
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let { dossierPage, loginPage, libraryPage, toc, userAccount, filterSummaryBar } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.dashboardUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC99547_1] Render dashboard - Enable parallel visualization rendering', async () => {
        await resetDossierState({
            credentials: gridConstants.dashboardUser,
            dossier: dashboardIncrementalRender,
        });
        await libraryPage.openDossier(dashboardIncrementalRender.name);
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['F43664Auto', 'Store Comparison', 'Details']);
        await since('Filter summary bar should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Profit'))
            .toBe('[≤497K]');
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC99547_1', 'Render dashboard');
        await dossierPage.openUserAccountMenu();
        await takeScreenshotByElement(userAccount.getAccountDropdown(), 'TC99547_2', 'Open user account menu');
        await userAccount.closeUserAccountMenu();
        await toc.openPageFromTocMenu({ chapterName: 'Store Comparison', pageName: 'Page2' });
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['F43664Auto', 'Store Comparison', 'Page2']);
        await dossierPage.resetDossier();
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC99547_3', 'Reset dashboard');
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(dashboardIncrementalRender.name);
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['F43664Auto', 'Store Comparison', 'Details']);
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC99547_4', 'Re-open dashboard');
    });
    it('[TC99547_2] Link to specific page', async () => {
        await resetDossierState({
            credentials: gridConstants.dashboardUser,
            dossier: dashboardIncrementalRender,
        });
        await libraryPage.openDossier(dashboardLinking.name);
        await dossierPage.clickTextfieldByTitle('Link with page key');
        await dossierPage.waitForPageLoading();
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['F43664Auto', 'Store Comparison', 'Page2']);
    });
    it('[TC99547_3] Link with filter', async () => {
        await resetDossierState({
            credentials: gridConstants.dashboardUser,
            dossier: dashboardIncrementalRender,
        });
        await libraryPage.openDossier(dashboardLinking.name);
        await dossierPage.clickTextfieldByTitle('Link with filter');
        await dossierPage.waitForPageLoading();
        await since('Filter summary bar should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Customer State'))
            .toBe('(California)');
    });
    it('[TC99547_4] Link with selection info', async () => {
        await resetDossierState({
            credentials: gridConstants.dashboardUser,
            dossier: dashboardIncrementalRender,
        });
        await libraryPage.openDossier(dashboardLinking.name);
        await dossierPage.clickTextfieldByTitle('Link with selector');
        await dossierPage.waitForPageLoading();
        await since(
            'The target dashboard is opened without error. Page title should be #{expected}, instead we have #{actual}'
        )
            .expect(await dossierPage.pageTitle())
            .toEqual(['F43664Auto', 'Store Comparison', 'Details']);
    });
});
