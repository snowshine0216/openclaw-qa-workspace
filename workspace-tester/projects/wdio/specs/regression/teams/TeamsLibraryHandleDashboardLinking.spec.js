import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import libraryLogoutFromTeams from '../../../api/libraryLogoutFromTeams.js';
import users from '../../../testData/users.json' assert { type: 'json' };

describe('Teams Library app End to End', () => {
    let { libraryPage, dossierPage, teamsDesktop, botAuthoring, toc } = browsers.pageObj1;

    beforeAll(async () => {
        await teamsDesktop.switchToActiveWindow();
        if (!(await teamsDesktop.checkCurrentTeamsUser(browser.options.params.credentials.teamsUsername))) {
            await teamsDesktop.switchToTeamsUser('Lee Gu');
        }
    });

    beforeEach(async () => {
        await teamsDesktop.switchToAppInSidebar('Teams');
    });

    afterEach(async () => {
        await libraryLogoutFromTeams();
        await teamsDesktop.switchToActiveWindow();
    });

    afterAll(async () => {});

    it('[TC91401] linking should be handled properly in teams app', async () => {
        await teamsDesktop.switchToAppInSidebar('Teams Standard');
        await teamsDesktop.waitForLandingPage();
        await teamsDesktop.loginStandardUser(users['teams_standard_sub'].credentials);
        await libraryPage.openDossier('Sample Dossier Locale');
        await dossierPage.waitForDossierLoading();
        // go to thrid page
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'Dossier Link' });
        await dossierPage.clickTextfieldByTitle('Link to Dashboard in new tab'); // click the link to another dashboard and nothing should happen
        await takeScreenshotByElement(
            await teamsDesktop.getDossierViewContainer(),
            'TC91401',
            'Sample_Dossier_Linking'
        );
        await dossierPage.clickTextfieldByTitle('Link to Dashboard in current tab');
        await botAuthoring.waitForMessageBoxDisplay();
        await takeScreenshotByElement(
            await botAuthoring.getMessageBoxContainer(),
            'TC91401_1',
            'You do not have permission to perform this action'
        );
        await botAuthoring.dismissErrorMessageBoxByClickOkButton();
        await dossierPage.waitForDossierLoading();
        await dossierPage.resetDossier();
    });
});
