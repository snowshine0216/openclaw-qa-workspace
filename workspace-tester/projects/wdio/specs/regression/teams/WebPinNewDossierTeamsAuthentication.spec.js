import users from '../../../testData/users.json' assert { type: 'json' };
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';

describe('Pin New Dossier in Channel - Teams Authentication - Browser', () => {
    const standardUser = users['teams_standard'];
    const samlUser = users['EMM_SAML_Azure'];
    samlUser.credentials.password = process.env.azure_password;
    const oidcUser = users['EMM_OKTA'];
    oidcUser.credentials.password = process.env.okta_password;
    const trustUser = users['EMM_trusted_pingFederate'];
    const dossiers = {
        guest: 'New Dossier',
        sso: 'Standard_dossier',
    };
    const channels = {
        standard: 'Standard',
        saml: 'SAML',
        oidc: 'OIDC',
        guest: 'Guest',
        trust: 'Trusted',
        sso: 'SSO',
    };

    let { loginPage, libraryPage, azureLoginPage, pingFederateLoginPage, mainTeams, modalDialog, pinFromChannel } =
        browsers.pageObj1;

    afterEach(async () => {
        await modalDialog.closeModalDialog();
        await mainTeams.switchToChannel('General');
        await mainTeams.waitForTeamsView();
    });

    it('[TC92170] Verify Library authentication - standard login Pin New Dossier in Teams Browser', async () => {
        browser.options.baseUrl = browsers.params.standardUrl;
        await mainTeams.switchToChannel(channels.standard);
        await pinFromChannel.pinNewDossierFromChannel('Teams Standard');
        console.log('Add dossier from Teams Standard');
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
        await modalDialog.waitForDossierList();
        await logoutFromCurrentBrowser();
    });
    it('[TC92171] Verify Library authentication - SAML login Pin New Dossier in Teams Browser', async () => {
        browser.options.baseUrl = browsers.params.samlUrl;
        await mainTeams.switchToChannel(channels.saml);
        await pinFromChannel.pinNewDossierFromChannel('Teams SAML');
        console.log('Add dossier from Teams SAML');
        await mainTeams.showAppAnyway();
        await mainTeams.waitForLandingPage();
        console.log('Waited for Landing Page');
        const windowNumber = (await browser.getWindowHandles()).length;
        await mainTeams.login();
        if (await mainTeams.isPopUpLoginPageExisting(windowNumber)) {
            await loginPage.switchToTab(1);
            await azureLoginPage.loginAzureWithAnotherUser();
            await azureLoginPage.loginToAzure(samlUser.credentials.username);
            await azureLoginPage.loginWithPassword(samlUser.credentials.password);
            await mainTeams.waitForPopupWindowDisappear();
            await loginPage.switchToTab(0);
            await mainTeams.switchToLibraryIframe();
        }
        await libraryPage.waitForLibraryLoading();
        await modalDialog.waitForDossierList();
        await logoutFromCurrentBrowser();
    });
    it('[TC92172] Verify Library authentication - OIDC login Pin New Dossier in Teams Browser', async () => {
        browser.options.baseUrl = browsers.params.oidcUrl;
        await mainTeams.switchToChannel(channels.oidc);
        await pinFromChannel.pinNewDossierFromChannel('Teams OIDC');
        console.log('Add dossier from Teams OIDC');
        await mainTeams.showAppAnyway();
        await mainTeams.waitForLandingPage();
        console.log('Waited for Landing Page');
        await mainTeams.login();
        await loginPage.switchToTab(1);
        await loginPage.basicOktaLogin(oidcUser.credentials);
        await mainTeams.waitForPopupWindowDisappear();
        await loginPage.switchToTab(0);
        await mainTeams.switchToLibraryIframe();
        await libraryPage.waitForLibraryLoading();
        await modalDialog.waitForDossierList();
        await logoutFromCurrentBrowser();
    });
    it('[TC92173] Verify Library authentication - Guest Pin New Dossier in Teams Browser', async () => {
        browser.options.baseUrl = browsers.params.guestUrl;
        await mainTeams.switchToChannel(channels.guest);
        await pinFromChannel.pinNewDossierFromChannel('Teams Guest');
        console.log('Add dossier from Teams Guest');
        await mainTeams.showAppAnyway();
        await mainTeams.switchToLibraryIframe();
        await libraryPage.waitForLibraryLoading();
        await modalDialog.chooseDossier(dossiers.guest);
    });
    it('[TC92174] Verify Library authentication - Trust login Pin New Dossier in Teams Browser', async () => {
        browser.options.baseUrl = browsers.params.trustUrl;
        await mainTeams.switchToChannel(channels.trust);
        await pinFromChannel.pinNewDossierFromChannel('Teams Trusted');
        console.log('Add dossier from Teams Trusted');
        await mainTeams.showAppAnyway();
        await mainTeams.waitForLandingPage();
        console.log('Waited for Landing Page');
        await mainTeams.login();
        await loginPage.switchToTab(1);
        await pingFederateLoginPage.login(trustUser.credentials.username, trustUser.credentials.password);
        await mainTeams.waitForPopupWindowDisappear();
        await loginPage.switchToTab(0);
        await mainTeams.switchToLibraryIframe();
        await libraryPage.waitForLibraryLoading();
        await modalDialog.waitForDossierList();
        await logoutFromCurrentBrowser();
    });
    it('[TC92175] Verify Teams SSO - Pin New Dossier in Teams Browser', async () => {
        browser.options.baseUrl = browsers.params.ssoUrl;
        await mainTeams.switchToChannel(channels.sso);
        await pinFromChannel.pinNewDossierFromChannel('Teams SSO');
        console.log('Add dossier from Teams SSO');
        await mainTeams.showAppAnyway();
        await mainTeams.switchToLibraryIframe();
        await libraryPage.waitForLibraryLoading();
        await modalDialog.chooseDossier(dossiers.sso);
        await logoutFromCurrentBrowser();
    });
});
