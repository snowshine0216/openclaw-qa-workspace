// import setWindowSize from '../../../config/setWindowSize.js';
import users from '../../../testData/users.json' assert { type: 'json' };
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import deleteTabInChannel from '../../../api/teams/deleteTabInChannel.js';
import teamsLogin from '../../../api/teams/teamsLogin.js';
import teamsLogout from '../../../api/teams/teamsLogout.js';

describe('Session Time out - Teams Authentication', () => {
    const oidcUser = users['EMM_OKTA'];
    oidcUser.credentials.password = process.env.okta_password;
    const dossiers = {
        oidc: 'Blank Dossier',
        sso: 'Standard_dossier',
    };
    const newDossiers = {
        oidc: 'Tanzu_OIDC_dossier',
        sso: 'New Dossier',
    };
    const channels = {
        oidc: 'OIDC',
        sso: 'SSO',
    };

    let { loginPage, libraryPage, dossierPage, teamsDesktop, modalDialog, conversation, pinFromChannel } = browsers.pageObj1;
    beforeAll(async () => {
        await teamsDesktop.switchToActiveWindow();
    });
    beforeEach(async () => {
        await teamsDesktop.switchToAppInSidebar('Teams');
    });

    afterEach(async () => {
        await logoutFromCurrentBrowser();
        await teamsDesktop.switchToActiveWindow();
        if (await modalDialog.getCloseButton().isDisplayed()) {
            await modalDialog.closeModalDialog();
        }
    });

    afterAll(async () => {
        const accessToken = await teamsLogin({
            clientId: browsers.params.clientId,
            tenantId: browsers.params.tenantId,
            clientSecret: browsers.params.clientSecret,
        });
        for (const key in channels) {
            await deleteTabInChannel({
                accessToken: accessToken,
                teamId: browsers.params.teamId,
                channelName: channels[key],
                tabName: newDossiers[key],
            });
        }
        await teamsLogout({
            clientId: browsers.params.clientId,
            tenantId: browsers.params.tenantId,
            clientSecret: browsers.params.clientSecret,
            accessToken: accessToken,
        });
    });

    it('[TC93133] Verify Teams SSO session timeout in Teams Sidebar in Teams Desktop', async () => {
        if (!(await teamsDesktop.checkCurrentTeamsUser(browser.options.params.credentials.teamsUsername))) {
            await teamsDesktop.switchToTeamsUser('Lee Gu');
        }
        browser.options.baseUrl = browsers.params.ssoUrl;
        await teamsDesktop.switchToAppInSidebar('Teams SSO');
        console.log('Switched to Teams SSO App');
        await teamsDesktop.switchToLibraryIframe();
        await libraryPage.waitForLibraryLoading();
        await browser.pause(240000);
        await libraryPage.openDossierNoWait(dossiers.sso);
        await dossierPage.waitForDossierLoading();
        await dossierPage.waitForElementVisible(dossierPage.getPageTitle());
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual([dossiers.sso, 'Chapter 1', 'Page 1']);
    });
    it('[TC93135] Verify Teams session timeout when pin new dossier in Teams Desktop', async () => {
        if (!(await teamsDesktop.checkCurrentTeamsUser(browser.options.params.credentials.teamsUsername))) {
            await teamsDesktop.switchToTeamsUser('Lee Gu');
        }
        browser.options.baseUrl = browsers.params.oidcUrl;
        await teamsDesktop.switchToAppInSidebar('Teams');
        await teamsDesktop.switchToChannel(channels.sso);
        await pinFromChannel.pinNewDossierFromChannel('Teams SSO');
        console.log('Add dossier from Teams SSO');
        await teamsDesktop.switchToLibraryIframe();
        await libraryPage.waitForLibraryLoading();
        await modalDialog.waitForDossierList();
        await browser.pause(240000);
        await modalDialog.chooseDossierAndSave(newDossiers.sso, false);
        await browser.switchToFrame(null);
        await conversation.waitForTabAppear(newDossiers.sso);
        await conversation.chooseTab(newDossiers.sso);
        await teamsDesktop.switchToLibraryIframe();
        await dossierPage.waitForDossierLoading();
        await dossierPage.waitForElementVisible(dossierPage.getPageTitle());
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual([newDossiers.sso, 'Chapter 1', 'Page 1']);
    });
    it('[TC91312] Verify Library Authentication session timeout in Teams Sidebar in Teams Desktop', async () => {
        if (!(await teamsDesktop.checkCurrentTeamsUser(browser.options.params.credentials.teamsUsername))) {
            await teamsDesktop.switchToTeamsUser('Lee Gu');
        }
        browser.options.baseUrl = browsers.params.oidcUrl;
        await teamsDesktop.switchToAppInSidebar('Teams OIDC');
        console.log('Switched to Teams OIDC App');
        await teamsDesktop.waitForLandingPage();
        console.log('Waited for Landing Page');
        const windowNumber = (await teamsDesktop.getBrowserTabs()).length;
        await teamsDesktop.login();
        if (await teamsDesktop.isPopUpLoginPageExisting(windowNumber)) {
            await teamsDesktop.switchToNewWindow();
            await loginPage.basicOktaLogin(oidcUser.credentials);
            await teamsDesktop.switchToActiveWindow();
            await teamsDesktop.switchToLibraryIframe();
        }
        await libraryPage.waitForLibraryLoading();
        await browser.pause(240000);
        await libraryPage.openDossierNoWait(dossiers.oidc);
        await browser.switchToFrame(null);
        await teamsDesktop.waitForLandingPage();
        await takeScreenshotByElement(await teamsDesktop.getLandingPage(), 'TC91312', 'Session Timeout Landing Page');
        await teamsDesktop.login();
        await dossierPage.waitForDossierLoading();
        await dossierPage.waitForElementVisible(dossierPage.getPageTitle());
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual([dossiers.oidc, 'Chapter 1', 'Page 1']);
    });
    it('[TC93136] Verify Library Authentication session timeout when pin new dossier in Teams Desktop', async () => {
        if (!(await teamsDesktop.checkCurrentTeamsUser('diegos@nvy2.onmicrosoft.com'))) {
            await teamsDesktop.switchToTeamsUser('Diego Siciliani');
        }
        browser.options.baseUrl = browsers.params.oidcUrl;
        await teamsDesktop.switchToAppInSidebar('Teams');
        await teamsDesktop.switchToChannel(channels.oidc);
        await pinFromChannel.pinNewDossierFromChannel('Teams OIDC');
        console.log('Add dossier from Teams OIDC');
        await teamsDesktop.waitForLandingPage();
        console.log('Waited for Landing Page');
        const windowNumber = (await teamsDesktop.getBrowserTabs()).length;
        await teamsDesktop.login();
        if (await teamsDesktop.isPopUpLoginPageExisting(windowNumber)) {
            await teamsDesktop.switchToNewWindow();
            await loginPage.basicOktaLogin(oidcUser.credentials);
            await teamsDesktop.switchToActiveWindow();
            await teamsDesktop.switchToLibraryIframe();
        }
        await libraryPage.waitForLibraryLoading();
        await modalDialog.waitForDossierList();
        await browser.pause(240000);
        await modalDialog.chooseDossierAndSave(newDossiers.oidc, false);
        await browser.switchToFrame(null);
        await conversation.waitForTabAppear(newDossiers.oidc);
        await conversation.chooseTab(newDossiers.oidc);
        await teamsDesktop.waitForLandingPage();
    });
});
