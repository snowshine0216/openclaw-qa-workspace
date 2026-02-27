// import setWindowSize from '../../../config/setWindowSize.js';
import users from '../../../testData/users.json' assert { type: 'json' };
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('Library Authentication - New Teams', () => {
    const standardUser_noPri = {
        credentials: {
            username: 'teams_noPri',
            password: 'newman1#',
        },
    };
    const samlUser = users['EMM_SAML_Azure'];
    samlUser.credentials.password = process.env.azure_password;
    const dossiers = {
        standard: 'Source Dossier',
        saml: 'Blank Dossier',
        secondDossier: 'Tanzu_SAML_dossier',
        locale: 'Teams Locale',
    };
    const channels = {
        standard: 'Standard',
        saml: 'SAML',
    };

    let { loginPage, libraryPage, dossierPage, teamsDesktop, azureLoginPage, conversation } =
        browsers.pageObj1;

    beforeAll(async () => {
        browser.options.baseUrl = browsers.params.standardUrl;
        await teamsDesktop.switchToActiveWindow();
        if (!(await teamsDesktop.checkCurrentTeamsUser(browser.options.params.credentials.teamsUsername))) {
            await teamsDesktop.switchToTeamsUser('Lee Gu');
        }
        await teamsDesktop.switchToAppInSidebar('Teams');
    });

    afterEach(async () => {
        await teamsDesktop.switchToActiveWindow();
        await teamsDesktop.switchToAppInSidebar('Teams');
    });

    it('[TC91310] Verify Library authentication - cancel login', async () => {
        await teamsDesktop.switchToAppInSidebar('Teams Standard');
        console.log('Switched to Teams Standard');
        await teamsDesktop.waitForLandingPage();
        console.log('Waited for Landing Page');
        await takeScreenshotByElement(await teamsDesktop.getLandingPage(), 'TC91310', 'Teams Landing Page for Login');
        const windowNumber = (await teamsDesktop.getBrowserTabs()).length;
        await teamsDesktop.login();
        await takeScreenshotByElement(await teamsDesktop.getLandingPage(), 'TC91310', 'Teams Landing Page click login');
        await since('Popup window should be #{expected}, instead we have #{actual}')
            .expect(await teamsDesktop.isPopUpLoginPageExisting(windowNumber))
            .toEqual(true);
        await teamsDesktop.closeNewPopupWindow();
        await teamsDesktop.switchToActiveWindow();
        await teamsDesktop.switchToLibraryIframe();
        await takeScreenshotByElement(
            await teamsDesktop.getLandingPage(),
            'TC91310',
            'Teams Landing Page cancel login'
        );
        await teamsDesktop.login();
        await teamsDesktop.closeNewPopupWindow();
    });
    it('[TC93034] Verify Library authentication - no use Application office Privilege user', async () => {
        if (!(await teamsDesktop.checkCurrentTeamsUser('diegos@nvy2.onmicrosoft.com'))) {
            await teamsDesktop.switchToTeamsUser('Diego Siciliani');
        }
        await teamsDesktop.switchToAppInSidebar('Teams Standard');
        console.log('Switched to Teams Standard');
        await teamsDesktop.waitForLandingPage();
        console.log('Waited for Landing Page');
        const windowNumber = (await teamsDesktop.getBrowserTabs()).length;
        await teamsDesktop.login();
        if (await teamsDesktop.isPopUpLoginPageExisting(windowNumber)) {
            await loginPage.switchToNewWindow();
            await loginPage.standardLogin(standardUser_noPri.credentials);
        }
        await teamsDesktop.switchToActiveWindow();
        await teamsDesktop.waitForNoPrivilegePage();
        await takeScreenshotByElement(await teamsDesktop.getErrorPage(), 'TC93034', 'No Privilege Page');
    });
    it('[TC91459] Verify Library authentication - Login in Sidebar, then switch pinned dossier', async () => {
        if (!(await teamsDesktop.checkCurrentTeamsUser('diegos@nvy2.onmicrosoft.com'))) {
            await teamsDesktop.switchToTeamsUser('Diego Siciliani');
        }
        await teamsDesktop.switchToAppInSidebar('Teams SAML');
        console.log('Switched to Teams SAML App');
        await teamsDesktop.waitForLandingPage();
        console.log('Waited for Landing Page');
        const windowNumber = (await teamsDesktop.getBrowserTabs()).length;
        await teamsDesktop.login();
        if (await teamsDesktop.isPopUpLoginPageExisting(windowNumber)) {
            await teamsDesktop.switchToNewWindow();
            await azureLoginPage.loginToAzure(samlUser.credentials.username);
            await azureLoginPage.loginWithPassword(samlUser.credentials.password);
            await azureLoginPage.safeContinueAzureLogin();
            await teamsDesktop.switchToActiveWindow();
            await teamsDesktop.switchToLibraryIframe();
        }
        await libraryPage.waitForLibraryLoading();
        await teamsDesktop.switchToAppInSidebar('Teams');
        await teamsDesktop.switchToChannel(channels.saml);
        await conversation.waitForTabAppear(dossiers.saml);
        await conversation.chooseTab(dossiers.saml);
        await teamsDesktop.switchToLibraryIframe();
        await dossierPage.waitForDossierLoading();
        await dossierPage.waitForElementVisible(dossierPage.getPageTitle());
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual([dossiers.saml, 'Chapter 1', 'Page 1']);
        await browser.switchToFrame(null);
        // switch between pinned dossier
        await conversation.chooseTab(dossiers.secondDossier);
        await teamsDesktop.switchToLibraryIframe();
        await dossierPage.waitForDossierLoading();
        await dossierPage.waitForElementVisible(dossierPage.getPageTitle());
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual([dossiers.secondDossier, 'Chapter 1', 'Page 1']);
    });
});
