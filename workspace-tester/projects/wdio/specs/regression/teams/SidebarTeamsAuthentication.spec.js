// import setWindowSize from '../../../config/setWindowSize.js';
import users from '../../../testData/users.json' assert { type: 'json' };
import libraryLogoutFromTeams from '../../../api/libraryLogoutFromTeams.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import locales from '../../../testData/locales.json' assert { type: 'json' };
import setUserLanguage from '../../../api/setUserLanguage.js';

describe('Pin in sidebar - Teams Authentication', () => {
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
        sso: 'Teams Locale',
        locale: 'LocaleReportEnglish',
    };
    const admin = {
        credentials: {
            username: browser.options.params.credentials.webServerUsername,
            password: browser.options.params.credentials.webServerPassword,
        },
    };

    let {
        loginPage,
        libraryPage,
        userAccount,
        dossierPage,
        azureLoginPage,
        onboardingTutorial,
        pingFederateLoginPage,
        teamsDesktop,
    } = browsers.pageObj1;
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
    afterAll(async () => {
        await teamsDesktop.switchToAppInSidebar('Teams');
    });

    it('[TC92356] Verify Library authentication - standard login in Teams Sidebar in Teams Desktop', async () => {
        browser.options.baseUrl = browsers.params.standardUrl;
        await teamsDesktop.switchToAppInSidebar('Teams Standard');
        console.log('Switched to Teams Standard App');
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
        await libraryPage.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('teams');
        await libraryPage.closeUserAccountMenu();
        await libraryPage.openDossier(dossiers.standard);
        await dossierPage.waitForDossierLoading();
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual([dossiers.standard, 'Chapter 1', 'Page 1']);
    });
    it('[TC92357] Verify Library authentication - SAML login in Teams Sidebar in Teams Desktop', async () => {
        browser.options.baseUrl = browsers.params.samlUrl;
        await teamsDesktop.switchToAppInSidebar('Teams SAML');
        console.log('Switched to Teams SAML App');
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
        await libraryPage.openDossier(dossiers.saml);
        await dossierPage.waitForDossierLoading();
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual([dossiers.saml, 'Chapter 1', 'Page 1']);
    });
    it('[TC92358] Verify Library authentication - OIDC login in Teams Sidebar in Teams Desktop', async () => {
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
        await libraryPage.openDossier(dossiers.oidc);
        await dossierPage.waitForDossierLoading();
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual([dossiers.oidc, 'Chapter 1', 'Page 1']);
    });
    it('[TC92359] Verify Library authentication - Guest login in Teams Sidebar in Teams Desktop', async () => {
        browser.options.baseUrl = browsers.params.guestUrl;
        await teamsDesktop.switchToAppInSidebar('Teams Guest');
        console.log('Switched to Teams Guest App');
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
        await libraryPage.openDossier(dossiers.guest);
        await dossierPage.waitForDossierLoading();
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual([dossiers.guest, 'Chapter 1', 'Page 1']);
    });
    it('[TC92360] Verify Library authentication - Trust login in Teams Sidebar in Teams Desktop', async () => {
        browser.options.baseUrl = browsers.params.trustUrl;
        await teamsDesktop.switchToAppInSidebar('Teams Trusted');
        console.log('Switched to Teams Trusted App');
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
        await libraryPage.moveDossierIntoViewPort(dossiers.trust);
    });
    it('[TC92361][TC93049] Verify Teams SSO login in Teams Sidebar in Teams Desktop', async () => {
        browser.options.baseUrl = browsers.params.ssoUrl;
        await teamsDesktop.switchToAppInSidebar('Teams SSO');
        console.log('Switched to Teams SSO App');
        await teamsDesktop.switchToLibraryIframe();
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('Lee Gu');
        await libraryPage.closeUserAccountMenu();
        await libraryPage.openDossier(dossiers.sso);
        await dossierPage.waitForDossierLoading();
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual([dossiers.sso, 'Chapter 1', 'Page 1']);
        await takeScreenshotByElement(await teamsDesktop.getDossierViewContainer(), 'TC93049', 'Locale Dossier');
        await dossierPage.goToLibrary();
    });
    it('[TC93989] Verify Teams locale in Teams Desktop', async () => {
        if (!(await teamsDesktop.checkCurrentTeamsUser('LidiaH@3kttfg.onmicrosoft.com'))) {
            await teamsDesktop.switchToTeamsUser('Lidia Holloway');
        }
        browser.options.baseUrl = browsers.params.ssoUrl;
        await setUserLanguage({
            baseUrl: browser.options.baseUrl,
            adminCredentials: admin.credentials,
            userId: '54F3D26011D2896560009A8E67019608',
            localeId: locales['Chinese (Simplified)'],
        });
        await teamsDesktop.switchToAppInSidebar('Library_Teams(mcp_nanli)');
        console.log('Switched to Library_Teams(mcp_nanli) app');
        await teamsDesktop.switchToLibraryIframe();
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('Lidia Holloway');
        await libraryPage.closeUserAccountMenu();
        await libraryPage.openDossier(dossiers.locale);
        await dossierPage.waitForDossierLoading();
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual([dossiers.locale, 'Chapter 1', 'Page 1']);
        await takeScreenshotByElement(await teamsDesktop.getDossierViewContainer(), 'TC93989', 'ChineseLocaleName');
        await dossierPage.goToLibrary();
        await setUserLanguage({
            baseUrl: browser.options.baseUrl,
            adminCredentials: admin.credentials,
            userId: '54F3D26011D2896560009A8E67019608',
            localeId: locales.default,
        });
    });
    it('[TC91408] In Teams app Library, the i18n setting in perference works the same as in OOTB Library', async () => {
        if (!(await teamsDesktop.checkCurrentTeamsUser('LidiaH@3kttfg.onmicrosoft.com'))) {
            await teamsDesktop.switchToTeamsUser('Lidia Holloway');
        }
        browser.options.baseUrl = browsers.params.ssoUrl;
        await setUserLanguage({
            baseUrl: browser.options.baseUrl,
            adminCredentials: admin.credentials,
            userId: '54F3D26011D2896560009A8E67019608',
            localeId: locales['German (Switzerland)'],
        });
        await teamsDesktop.switchToAppInSidebar('Library_Teams(mcp_nanli)');
        console.log('Switched to Library_Teams(mcp_nanli) app');
        await teamsDesktop.switchToLibraryIframe();
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openDossier(dossiers.locale);
        await dossierPage.waitForDossierLoading();
        await since('the first cost should be #{expected}, instead we have #{actual}')
            .expect(await teamsDesktop.getGridCellValue(7))
            .toEqual(`$413'049.647`);
        await since('the first category should be #{expected}, instead we have #{actual}')
            .expect(await teamsDesktop.getGridCellValue(6))
            .toEqual('Bücher');
        await dossierPage.goToLibrary();
        await setUserLanguage({
            baseUrl: browser.options.baseUrl,
            adminCredentials: admin.credentials,
            userId: '54F3D26011D2896560009A8E67019608',
            localeId: locales.default,
        });
    });
});
