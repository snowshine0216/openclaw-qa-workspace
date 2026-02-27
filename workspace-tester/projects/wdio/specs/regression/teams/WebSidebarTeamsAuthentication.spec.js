import users from '../../../testData/users.json' assert { type: 'json' };
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';

describe('Pin in sidebar - Teams Authentication - Browser', () => {
    const standardUser = users['teams_standard'];
    const samlUser = users['EMM_SAML_Azure'];
    samlUser.credentials.password = process.env.azure_password;
    const oidcUser = users['EMM_OKTA'];
    oidcUser.credentials.password = process.env.okta_password;
    const trustUser = users['EMM_trusted_pingFederate'];
    const dossiers = {
        standard: 'Target Dossier',
        saml: 'Tanzu_SAML_dossier',
        oidc: 'Tanzu_OIDC_dossier',
        guest: 'New Dossier',
        trust: 'Blank Dossier',
        sso: 'Standard_dossier',
    };
    const browserWindow = {
        width: 1400,
        height: 1400,
    };

    let {
        loginPage,
        libraryPage,
        userAccount,
        dossierPage,
        azureLoginPage,
        onboardingTutorial,
        pingFederateLoginPage,
        mainTeams,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await mainTeams.switchToAppInSidebar('Teams');
        await mainTeams.waitForTeamsView();
    });

    it('[TC92134] Verify Library authentication - standard login in Teams Sidebar in Teams Browser', async () => {
        browser.options.baseUrl = browsers.params.standardUrl;
        await mainTeams.switchToAppInSidebar('Teams Standard');
        console.log('Switched to Teams Standard');
        await mainTeams.showAppAnyway();
        await mainTeams.waitForLandingPage();
        console.log('Waited for Landing Page');
        await takeScreenshotByElement(await mainTeams.getLandingPage(), 'TC92134', 'Teams Landing Page for Login');
        await mainTeams.login();
        await loginPage.switchToTab(1);
        await loginPage.standardLogin(standardUser.credentials);
        // wait until there is only 1 tab
        await mainTeams.waitForPopupWindowDisappear();
        await loginPage.switchToTab(0);
        await mainTeams.switchToLibraryIframe();
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();
        await takeScreenshotByElement(await userAccount.getAccountDropdown(), 'TC92134', 'Account Dropdown');
        await libraryPage.closeUserAccountMenu();
        await libraryPage.openDossier(dossiers.standard);
        await dossierPage.waitForDossierLoading();
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual([dossiers.standard, 'Chapter 1', 'Page 1']);
        await logoutFromCurrentBrowser();
    });
    it('[TC92163] Verify Library authentication - SAML login in Teams Sidebar in Teams Browser', async () => {
        browser.options.baseUrl = browsers.params.samlUrl;
        await mainTeams.switchToAppInSidebar('Teams SAML');
        console.log('Switched to Teams SAML');
        await mainTeams.showAppAnyway();
        await mainTeams.waitForLandingPage();
        console.log('Waited for Landing Page');
        await takeScreenshotByElement(await mainTeams.getLandingPage(), 'TC92163', 'Teams Landing Page for Login');
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
        await libraryPage.openUserAccountMenu();
        await takeScreenshotByElement(await userAccount.getAccountDropdown(), 'TC92163', 'Account Dropdown');
        await libraryPage.closeUserAccountMenu();
        await libraryPage.openDossier(dossiers.saml);
        await dossierPage.waitForDossierLoading();
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual([dossiers.saml, 'Chapter 1', 'Page 1']);
        await logoutFromCurrentBrowser();
    });
    it('[TC92164] Verify Library authentication - OIDC login in Teams Sidebar in Teams Browser', async () => {
        browser.options.baseUrl = browsers.params.oidcUrl;
        await mainTeams.switchToAppInSidebar('Teams OIDC');
        console.log('Switched to Teams OIDC');
        await mainTeams.showAppAnyway();
        await mainTeams.waitForLandingPage();
        console.log('Waited for Landing Page');
        await takeScreenshotByElement(await mainTeams.getLandingPage(), 'TC92164', 'Teams Landing Page for Login');
        await mainTeams.login();
        await loginPage.switchToTab(1);
        await loginPage.basicOktaLogin(oidcUser.credentials);
        await mainTeams.waitForPopupWindowDisappear();
        await loginPage.switchToTab(0);
        await mainTeams.switchToLibraryIframe();
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();
        await takeScreenshotByElement(await userAccount.getAccountDropdown(), 'TC92164', 'Account Dropdown');
        await libraryPage.closeUserAccountMenu();
        await libraryPage.openDossier(dossiers.oidc);
        await dossierPage.waitForDossierLoading();
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual([dossiers.oidc, 'Chapter 1', 'Page 1']);
        await logoutFromCurrentBrowser();
    });
    it('[TC92165] Verify Library authentication - Guest login in Teams Sidebar in Teams Browser', async () => {
        browser.options.baseUrl = browsers.params.guestUrl;
        await mainTeams.switchToAppInSidebar('Teams Guest');
        console.log('Switched to Teams Guest');
        await mainTeams.showAppAnyway();
        await mainTeams.switchToLibraryIframe();
        await libraryPage.waitForLibraryLoading();
        await libraryPage.sleep(5000); // wait for login
        await onboardingTutorial.clickIntroToLibrarySkip();
        await libraryPage.openUserAccountMenu();
        await takeScreenshotByElement(await userAccount.getAccountDropdown(), 'TC92165', 'Account Dropdown');
        await libraryPage.closeUserAccountMenu();
        await libraryPage.openDossier(dossiers.guest);
        await dossierPage.waitForDossierLoading();
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual([dossiers.guest, 'Chapter 1', 'Page 1']);
    });
    it('[TC92166] Verify Library authentication - Trust login in Teams Sidebar in Teams Browser', async () => {
        browser.options.baseUrl = browsers.params.trustUrl;
        await mainTeams.switchToAppInSidebar('Teams Trusted');
        console.log('Switched to Teams Trusted');
        await mainTeams.showAppAnyway();
        await mainTeams.waitForLandingPage();
        console.log('Waited for Landing Page');
        await takeScreenshotByElement(await mainTeams.getLandingPage(), 'TC92166', 'Teams Landing Page for Login');
        await mainTeams.login();
        await loginPage.switchToTab(1);
        await pingFederateLoginPage.login(trustUser.credentials.username, trustUser.credentials.password);
        await mainTeams.waitForPopupWindowDisappear();
        await loginPage.switchToTab(0);
        await mainTeams.switchToLibraryIframe();
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();
        await takeScreenshotByElement(await userAccount.getAccountDropdown(), 'TC92166', 'Account Dropdown');
        await libraryPage.closeUserAccountMenu();
        await libraryPage.openDossier(dossiers.trust);
        await dossierPage.waitForDossierLoading();
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual([dossiers.trust, 'Chapter 1', 'Page 1']);
        await logoutFromCurrentBrowser();
    });
    it('[TC92168] Verify Teams SSO login in Teams Sidebar in Teams Browser', async () => {
        browser.options.baseUrl = browsers.params.ssoUrl;
        await mainTeams.switchToAppInSidebar('Teams SSO');
        console.log('Switched to Teams SSO');
        await mainTeams.showAppAnyway();
        await mainTeams.switchToLibraryIframe();
        await libraryPage.sleep(5000); // wait for login
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();
        await takeScreenshotByElement(await userAccount.getAccountDropdown(), 'TC92168', 'Account Dropdown');
        await libraryPage.closeUserAccountMenu();
        await libraryPage.openDossier(dossiers.sso);
        await dossierPage.waitForDossierLoading();
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual([dossiers.sso, 'Chapter 1', 'Page 1']);
        await logoutFromCurrentBrowser();
    });
});
