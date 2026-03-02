import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import libraryLogoutFromTeams from '../../../api/libraryLogoutFromTeams.js';

describe('Teams SSO - New Teams', () => {
    const dossiers = {
        standard: 'Source Dossier',
        secondDossier: 'Empty KPI',
        sso: 'Blank Dossier',
        locale: 'Teams Locale',
    };
    const channels = {
        standard: 'Standard',
        sso: 'SSO',
    };

    let { libraryPage, onboardingTutorial, userAccount, teamsDesktop, conversation } = browsers.pageObj1;

    beforeAll(async () => {
        browser.options.baseUrl = browsers.params.ssoUrl;
        await teamsDesktop.switchToActiveWindow();
        await teamsDesktop.switchToAppInSidebar('Teams');
    });

    afterEach(async () => {
        await teamsDesktop.switchToActiveWindow();
    });

    it('[TC91311] Verify Teams SSO - switch user', async () => {
        if (!(await teamsDesktop.checkCurrentTeamsUser(browser.options.params.credentials.teamsUsername))) {
            await teamsDesktop.switchToTeamsUser('Lee Gu');
        }
        await teamsDesktop.switchToAppInSidebar('Teams SSO');
        console.log('Switched to Teams SSO App');
        await teamsDesktop.switchToLibraryIframe();
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('Lee Gu');
        await libraryPage.closeUserAccountMenu();
        await browser.switchToFrame(null);
        await teamsDesktop.switchToTeamsUser('Diego Siciliani');
        await teamsDesktop.switchToAppInSidebar('Teams SSO');
        console.log('Switched to Teams SSO App');
        await teamsDesktop.switchToLibraryIframe();
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('Diego Siciliani');
        await libraryPage.closeUserAccountMenu();
        await libraryLogoutFromTeams();
    });
    it('[TC93032] Verify Guest env configured with Teams SSO, should login as Guest', async () => {
        if (!(await teamsDesktop.checkCurrentTeamsUser('diegos@nvy2.onmicrosoft.com'))) {
            await teamsDesktop.switchToTeamsUser('Diego Siciliani');
        }
        await teamsDesktop.switchToAppInSidebar('Teams SSO for Guest');
        console.log('Switched to Teams SSO for Guest App');
        await teamsDesktop.switchToLibraryIframe();
        await libraryPage.waitForLibraryLoading();
        await browser.pause(5000);
        if (await onboardingTutorial.hasLibraryIntroduction()) {
            await onboardingTutorial.clickIntroToLibrarySkip();
        }
        await libraryPage.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('Public / Guest');
        await libraryPage.closeUserAccountMenu();
    });
    it('[TC93033] Verify Teams SSO - no trust relationship', async () => {
        if (!(await teamsDesktop.checkCurrentTeamsUser('diegos@nvy2.onmicrosoft.com'))) {
            await teamsDesktop.switchToTeamsUser('Diego Siciliani');
        }
        await teamsDesktop.switchToAppInSidebar('Teams SSO NoTrustRelationship');
        console.log('Switched to Teams SSO NoTrustRelationship App');
        await teamsDesktop.waitForLandingPage();
        await teamsDesktop.login();
        await takeScreenshotByElement(await teamsDesktop.getErrorPage(), 'TC93033', 'Teams SSO no trust relationship');
        await libraryLogoutFromTeams();
    });
    it('[TC91317] Verify Teams SSO - no Privilege user', async () => {
        if (!(await teamsDesktop.checkCurrentTeamsUser('miriamg@nvy2.onmicrosoft.com'))) {
            await teamsDesktop.switchToTeamsUser('Miriam Graham');
        }
        await teamsDesktop.switchToAppInSidebar('Teams');
        await teamsDesktop.switchToChannel(channels.sso);
        await conversation.waitForTabAppear(dossiers.sso);
        await conversation.chooseTab(dossiers.sso);
        await teamsDesktop.waitForNoPrivilegePage();
        await takeScreenshotByElement(await teamsDesktop.getErrorPage(), 'TC91317', 'No Privilege Page');
        await libraryLogoutFromTeams();
    });
});
