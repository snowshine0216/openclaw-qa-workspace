// import setWindowSize from '../../../config/setWindowSize.js';
import users from '../../../testData/users.json' assert { type: 'json' };
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import libraryLogoutFromTeams from '../../../api/libraryLogoutFromTeams.js';

describe('Pinned Dossier in Channel - Teams Authentication', () => {
    const standardUser = users['teams_standard'];
    const samlUser = users['EMM_SAML_Azure'];
    samlUser.credentials.password = process.env.azure_password;
    const oidcUser = users['EMM_OKTA'];
    oidcUser.credentials.password = process.env.okta_password;
    const trustUser = users['EMM_trusted_pingFederate'];
    const dossiers = {
        standard: 'Source Dossier',
        saml: 'Blank Dossier',
        oidc: 'Blank Dossier',
        guest: 'Empty Dossier',
        trust: 'Empty Dossier',
        sso: 'Blank Dossier',
    };
    const channels = {
        standard: 'Standard',
        saml: 'SAML',
        oidc: 'OIDC',
        guest: 'Guest',
        trust: 'Trusted',
        sso: 'SSO',
    };

    let { loginPage, dossierPage, azureLoginPage, pingFederateLoginPage, teamsDesktop, conversation } =
        browsers.pageObj1;

    beforeAll(async () => {
        await teamsDesktop.switchToActiveWindow();
        if (!(await teamsDesktop.checkCurrentTeamsUser(browser.options.params.credentials.teamsUsername))) {
            await teamsDesktop.switchToTeamsUser('Lee Gu');
        }
        await teamsDesktop.switchToAppInSidebar('Teams');
    });

    afterEach(async () => {
        await libraryLogoutFromTeams();
        await browser.switchToFrame(null);
        await teamsDesktop.switchToChannel('General');
    });

    it('[TC91307] Verify Library authentication - standard login Pinned Dossier in Teams Browser', async () => {
        browser.options.baseUrl = browsers.params.standardUrl;
        await teamsDesktop.switchToChannel(channels.standard);
        await conversation.waitForTabAppear(dossiers.standard);
        await conversation.chooseTab(dossiers.standard);
        await teamsDesktop.waitForLandingPage();
        console.log('Waited for Landing Page');
        const windowNumber = (await teamsDesktop.getBrowserTabs()).length;
        await teamsDesktop.login();
        if (await teamsDesktop.isPopUpLoginPageExisting(windowNumber)) {
            await teamsDesktop.switchToNewWindow();
            await loginPage.standardLogin(standardUser.credentials);
            await teamsDesktop.switchToActiveWindow();
            await teamsDesktop.switchToLibraryIframe();
        }
        await dossierPage.waitForDossierLoading();
        await dossierPage.waitForElementVisible(dossierPage.getPageTitle());
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual([dossiers.standard, 'Chapter 1', 'Page 1']);
    });
    it('[TC91309] Verify Library authentication - SAML login Pinned Dossier in Teams Browser', async () => {
        browser.options.baseUrl = browsers.params.samlUrl;
        await teamsDesktop.switchToChannel(channels.saml);
        await conversation.waitForTabAppear(dossiers.saml);
        await conversation.chooseTab(dossiers.saml);
        await teamsDesktop.waitForLandingPage();
        console.log('Waited for Landing Page');
        const windowNumber = (await teamsDesktop.getBrowserTabs()).length;
        await teamsDesktop.login();
        if (await teamsDesktop.isPopUpLoginPageExisting(windowNumber)) {
            await teamsDesktop.switchToNewWindow();
            await azureLoginPage.loginAzureWithAnotherUser();
            await azureLoginPage.loginToAzure(samlUser.credentials.username);
            await azureLoginPage.loginWithPassword(samlUser.credentials.password);
            await azureLoginPage.safeContinueAzureLogin();
            await teamsDesktop.switchToActiveWindow();
            await teamsDesktop.switchToLibraryIframe();
        }
        await dossierPage.waitForDossierLoading();
        await dossierPage.waitForElementVisible(dossierPage.getPageTitle());
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual([dossiers.saml, 'Chapter 1', 'Page 1']);
    });
    it('[TC91306] Verify Library authentication - OIDC login Pinned Dossier in Teams Browser', async () => {
        browser.options.baseUrl = browsers.params.oidcUrl;
        await teamsDesktop.switchToChannel(channels.oidc);
        await conversation.waitForTabAppear(dossiers.oidc);
        await conversation.chooseTab(dossiers.oidc);
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
        await dossierPage.waitForDossierLoading();
        await dossierPage.waitForElementVisible(dossierPage.getPageTitle());
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual([dossiers.oidc, 'Chapter 1', 'Page 1']);
    });
    it('[TC93027] Verify Library authentication - Guest Pinned Dossier in Teams Browser', async () => {
        browser.options.baseUrl = browsers.params.guestUrl;
        await teamsDesktop.switchToChannel(channels.guest);
        await conversation.waitForTabAppear(dossiers.guest);
        await conversation.chooseTab(dossiers.guest);
        await teamsDesktop.switchToLibraryIframe();
        await dossierPage.waitForDossierLoading();
        await dossierPage.waitForElementVisible(dossierPage.getPageTitle());
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual([dossiers.guest, 'Chapter 1', 'Page 1']);
    });
    it('[TC93028] Verify Library authentication - Trust login Pinned Dossier in Teams Browser', async () => {
        browser.options.baseUrl = browsers.params.trustUrl;
        await teamsDesktop.switchToChannel(channels.trust);
        await conversation.waitForTabAppear(dossiers.trust);
        await conversation.chooseTab(dossiers.trust);
        await teamsDesktop.waitForLandingPage();
        console.log('Waited for Landing Page');
        const windowNumber = (await teamsDesktop.getBrowserTabs()).length;
        await teamsDesktop.login();
        if (await teamsDesktop.isPopUpLoginPageExisting(windowNumber)) {
            await teamsDesktop.switchToNewWindow();
            await pingFederateLoginPage.login(trustUser.credentials.username, trustUser.credentials.password);
            await teamsDesktop.switchToActiveWindow();
            await teamsDesktop.switchToLibraryIframe();
        }
        await dossierPage.waitForDossierLoading();
        await dossierPage.waitForElementVisible(dossierPage.getPageTitle());
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual([dossiers.trust, 'Chapter 1', 'Page 1']);
    });
    it('[TC91308] Verify Teams SSO - Pinned Dossier in Teams Browser', async () => {
        browser.options.baseUrl = browsers.params.ssoUrl;
        await teamsDesktop.switchToChannel(channels.sso);
        await conversation.waitForTabAppear(dossiers.sso);
        await conversation.chooseTab(dossiers.sso);
        await teamsDesktop.switchToLibraryIframe();
        await dossierPage.waitForDossierLoading();
        await dossierPage.waitForElementVisible(dossierPage.getPageTitle());
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual([dossiers.sso, 'Chapter 1', 'Page 1']);
        await takeScreenshotByElement(await teamsDesktop.getDossierViewContainer(), 'TC92175_01', 'Pinned Dossier');
    });
});
