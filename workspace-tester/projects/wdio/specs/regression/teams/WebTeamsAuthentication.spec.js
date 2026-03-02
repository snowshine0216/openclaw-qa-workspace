// import setWindowSize from '../../../config/setWindowSize.js';
import users from '../../../testData/users.json' assert { type: 'json' };
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../config/setWindowSize.js';

describe('Teams Authentication - New Teams - Browser', () => {
    const standardUser = users['teams_standard'];
    const standardUser2 = {
        credentials: {
            username: 'teams2',
            password: 'newman1#',
        },
    };
    const browserWindow = {
        width: 1400,
        height: 1400,
    };

    let { loginPage, libraryPage, userAccount, mainTeams } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        browser.options.baseUrl = browsers.params.standardUrl;
    });

    afterEach(async () => {
        await logoutFromCurrentBrowser();
        await mainTeams.switchToAppInSidebar('Teams');
        await mainTeams.waitForTeamsView();
    });
    it('[TC93031] Verify Library authentication - Switch user', async () => {
        await mainTeams.switchToAppInSidebar('Teams Standard');
        console.log('Switched to Teams Standard');
        await mainTeams.showAppAnyway();
        await browser.pause(5000);
        await mainTeams.waitForLandingPage();
        console.log('Waited for Landing Page');
        await mainTeams.login();
        await loginPage.switchToTab(1);
        await loginPage.standardLogin(standardUser.credentials);
        await mainTeams.waitForPopupWindowDisappear();
        await loginPage.switchToTab(0);
        await mainTeams.switchToLibraryIframe();
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('teams');
        await libraryPage.closeUserAccountMenu();
        await logoutFromCurrentBrowser();
        await browser.switchToFrame(null);
        await mainTeams.switchToAppInSidebar('Teams');
        await mainTeams.switchToAppInSidebar('Teams Standard');
        await mainTeams.showAppAnyway();
        await mainTeams.waitForLandingPage();
        console.log('Waited for Landing Page');
        await mainTeams.login();
        await loginPage.switchToTab(1);
        await loginPage.standardLogin(standardUser2.credentials);
        await mainTeams.waitForPopupWindowDisappear();
        await loginPage.switchToTab(0);
        await mainTeams.switchToLibraryIframe();
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('teams2');
        await libraryPage.closeUserAccountMenu();
    });
    it('[TC93029] Verify Library authentication - login in teams, share session with library web', async () => {
        // due to F40832, only work for login in teams first, then share session with library web. Not work for login in library web first
        await mainTeams.switchToAppInSidebar('Teams Standard');
        console.log('Switched to Teams Standard');
        await mainTeams.showAppAnyway();
        await mainTeams.waitForLandingPage();
        console.log('Waited for Landing Page');
        await mainTeams.login();
        await loginPage.switchToTab(1);
        await loginPage.standardLogin(standardUser.credentials);
        await mainTeams.waitForPopupWindowDisappear();
        await loginPage.switchToTab(0);
        await mainTeams.switchToLibraryIframe();
        await libraryPage.waitForLibraryLoading();
        await libraryPage.switchToNewWindowWithUrl(browsers.params.standardUrl);
        let libraryUrl = await libraryPage.currentURL();
        await since('Library Web should already logged in').expect(libraryUrl.endsWith('/app')).toBe(true);
        await libraryPage.closeTab(1);
    });

    it('[TC93030] Verify Teams SSO - login in teams, not share session with library web', async () => {
        // due to F40832, for Teams SSO, session is not shared between Teams and Library Web
        await mainTeams.switchToAppInSidebar('Teams SSO');
        console.log('Switched to Teams SSO');
        await mainTeams.showAppAnyway();
        await mainTeams.switchToLibraryIframe();
        await libraryPage.sleep(5000);
        await libraryPage.waitForLibraryLoading();
        await libraryPage.switchToNewWindowWithLink(browsers.params.ssoUrl);
        let libraryUrl = await libraryPage.currentURL();
        await since('Library Web should already logged in')
            .expect(libraryUrl.startsWith(browsers.params.ssoUrl))
            .toBe(false);
        await libraryPage.closeTab(1);
    });
});
