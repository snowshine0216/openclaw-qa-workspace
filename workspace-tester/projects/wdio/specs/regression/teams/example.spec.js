import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('New Teams End to End', () => {
    let { loginPage, libraryPage, dossierPage, teamsDesktop, conversation, pinFromChannel } = browsers.pageObj1;

    beforeAll(async () => {
        await teamsDesktop.switchToActiveWindow();
        if (!(await teamsDesktop.checkCurrentTeamsUser(browser.options.params.credentials.teamsUsername))) {
            await teamsDesktop.switchToTeamsUser(browser.options.params.credentials.teamsUsername);
        }
    });

    beforeEach(async () => {
        //
    });

    afterEach(async () => {
        //
    });

    afterAll(async () => {
        //
    });

    it('[TC00000001] Test on new teams sidebar app', async () => {
        await teamsDesktop.switchToAppInSidebar('Teams SSO');
        await teamsDesktop.switchToLibraryIframe();
        await libraryPage.waitForLibraryLoading();
        // action inside library iframe
    });
    it('[TC00000002] Test on new teams pinned dossier', async () => {
        await teamsDesktop.switchToAppInSidebar('Teams');
        await teamsDesktop.switchToChannel('ChannelName');
        await conversation.waitForTabAppear('DossierName');
        await conversation.chooseTab('DossierName');
        await teamsDesktop.switchToLibraryIframe();
        await dossierPage.waitForDossierLoading();
        // action inside library iframe
    });
    it('[TC00000003] Test on new teams pin new dossier', async () => {
        await teamsDesktop.switchToAppInSidebar('Teams');
        await teamsDesktop.switchToChannel('ChannelName');
        await pinFromChannel.pinNewDossierFromChannel('AppName');
        await teamsDesktop.switchToLibraryIframe();
        await libraryPage.waitForLibraryLoading();
        // action inside library list, like choose dossier...
    });
});
