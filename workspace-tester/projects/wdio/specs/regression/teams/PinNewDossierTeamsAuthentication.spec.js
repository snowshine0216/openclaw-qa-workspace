// import setWindowSize from '../../../config/setWindowSize.js';
import users from '../../../testData/users.json' assert { type: 'json' };
import libraryLogoutFromTeams from '../../../api/libraryLogoutFromTeams.js';

describe('Pin New Dossier in Channel - Teams Authentication', () => {
    const standardUser = users['teams_standard'];
    const samlUser = users['EMM_SAML_Azure'];
    samlUser.credentials.password = process.env.azure_password;
    const oidcUser = users['EMM_OKTA'];
    oidcUser.credentials.password = process.env.okta_password;
    const trustUser = users['EMM_trusted_pingFederate'];
    const channels = {
        standard: 'Standard',
        saml: 'SAML',
        oidc: 'OIDC',
        guest: 'Guest',
        trust: 'Trusted',
        sso: 'SSO',
    };

    let { loginPage, libraryPage, azureLoginPage, pingFederateLoginPage, teamsDesktop, modalDialog, pinFromChannel } =
        browsers.pageObj1;

    beforeAll(async () => {
        await teamsDesktop.switchToActiveWindow();
        if (!(await teamsDesktop.checkCurrentTeamsUser(browser.options.params.credentials.teamsUsername))) {
            await teamsDesktop.switchToTeamsUser('Lee Gu');
        }
        await teamsDesktop.switchToAppInSidebar('Teams');
    });

    afterEach(async () => {
        await modalDialog.closeModalDialog();
        await libraryLogoutFromTeams();
    });

    afterAll(async () => {
        await teamsDesktop.switchToAppInSidebar('Teams');
    });

    it('[TC92362] Verify Library authentication - standard login Pin New Dossier in Teams Desktop', async () => {
        browser.options.baseUrl = browsers.params.standardUrl;
        await teamsDesktop.switchToChannel(channels.standard);
        await pinFromChannel.pinNewDossierFromChannel('Teams Standard');
        console.log('Add dossier frome Teams Standard');
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
        await libraryPage.waitForLibraryLoading();
        await modalDialog.waitForDossierList();
    });
    it('[TC92363] Verify Library authentication - SAML login Pin New Dossier in Teams Desktop', async () => {
        browser.options.baseUrl = browsers.params.samlUrl;
        await teamsDesktop.switchToChannel(channels.saml);
        await pinFromChannel.pinNewDossierFromChannel('Teams SAML');
        console.log('Add dossier frome Teams SAML');
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
        await libraryPage.waitForLibraryLoading();
        await modalDialog.waitForDossierList();
    });
    it('[TC92364] Verify Library authentication - OIDC login Pin New Dossier in Teams Desktop', async () => {
        browser.options.baseUrl = browsers.params.oidcUrl;
        await teamsDesktop.switchToChannel(channels.oidc);
        await pinFromChannel.pinNewDossierFromChannel('Teams OIDC');
        console.log('Add dossier frome Teams OIDC');
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
    });
    it('[TC92365] Verify Library authentication - Guest Pin New Dossier in Teams Desktop', async () => {
        browser.options.baseUrl = browsers.params.guestUrl;
        await teamsDesktop.switchToChannel(channels.guest);
        await pinFromChannel.pinNewDossierFromChannel('Teams Guest');
        console.log('Add dossier frome Teams Guest');
        await teamsDesktop.switchToLibraryIframe();
        await libraryPage.waitForLibraryLoading();
        await modalDialog.waitForDossierList();
    });
    it('[TC92366] Verify Library authentication - Trust login Pin New Dossier in Teams Desktop', async () => {
        browser.options.baseUrl = browsers.params.trustUrl;
        await teamsDesktop.switchToChannel(channels.trust);
        await pinFromChannel.pinNewDossierFromChannel('Teams Trusted');
        console.log('Add dossier frome Teams Trusted');
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
        await libraryPage.waitForLibraryLoading();
        await modalDialog.waitForDossierList();
    });
    it('[TC92367] Verify Teams SSO - Pin New Dossier in Teams Desktop', async () => {
        browser.options.baseUrl = browsers.params.ssoUrl;
        await teamsDesktop.switchToChannel(channels.sso);
        await pinFromChannel.pinNewDossierFromChannel('Teams SSO');
        console.log('Add dossier frome Teams SSO');
        await teamsDesktop.switchToLibraryIframe();
        await libraryPage.waitForLibraryLoading();
        await modalDialog.waitForDossierList();
    });
});
