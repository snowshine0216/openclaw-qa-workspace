import users from '../../../../testData/users.json' assert { type: 'json' };
import setWindowSize from '../../../../config/setWindowSize.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import ERROR_MAP from '../../../../utils/ErrorMsg.js';

/*
Test environment: EMM team server
Base URL: npm run regression-CI -- --baseUrl=https://emm3.labs.microstrategy.com:6262/MicroStrategyLibrary/ --spec=specs/regression/authentication/standard/authentication_Standard.spec.js --params.credentials.webServerUsername=admin --params.credentials.webServerPassword="" --params.credentials.username=mstr
 */

describe('Authentication - Standard Mode', () => {
    const dossier = {
        id: 'ABDEB8CB463B4A1513DC23B77A6636D9',
        name: 'Test Dossier-origin',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const RSD = {
        name: 'WebDav Document',
    };

    const webAutomationUser = users['EMM_web_automation'];
    const standardUser = users['EMM_standard'];

    // let userAccount, libraryPage, loginPage, infoWindow, biwebRsdEditablePage, adminPage, dossierPage, rsdPage;

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let { userAccount, libraryPage, loginPage, infoWindow, biwebRsdEditablePage, adminPage, dossierPage } =
        browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    it('[TC74331] Standard Authentication testing - Verify error handling while login with invalid user credentials', async () => {
        await loginPage.login({ username: 'UserNotExisted', password: '' });
        await since(
            'The username is invalid, the error dialogue should display, instead the error dialog did not display'
        )
            .expect(await loginPage.isErrorPresent())
            .toBe(true);
        await since('The error title should be #{expected}, instead we have #{actual}')
            .expect(await loginPage.errorTitle())
            .toBe('Authentication Error');
        await since('The error message should be #{expected}, instead we have #{actual}')
            .expect(await loginPage.errorMsg())
            .toBe('Incorrect username and/or password. Please try again.');
        await takeScreenshot('TC74331', 'Invalid username: Authentication error');
        await loginPage.dismissError();
        await loginPage.clearCredentials();
        await loginPage.login({ username: browsers.params.credentials.username, password: 'WrongPassword' });
        await since(
            'The password is wrong, the error dialogue should display, instead the error dialog did not display'
        )
            .expect(await loginPage.isErrorPresent())
            .toBe(true);
        await since('The error title should be #{expected}, instead we have #{actual}')
            .expect(await loginPage.errorTitle())
            .toBe('Authentication Error');
        await since('The error message should be #{expected}, instead we have #{actual}')
            .expect(await loginPage.errorMsg())
            .toBe('Incorrect username and/or password. Please try again.');
        await takeScreenshot('TC74331', 'Wrong password: Authentication error');
        await loginPage.dismissError();
        await loginPage.clearCredentials();
        // add login with the user above to avoid user lockout
        await loginPage.login({ username: browsers.params.credentials.username, password: '' });
        await libraryPage.openUserAccountMenu();
        await takeScreenshotByElement(userAccount.getAccountDropdown(), 'TC74331_02', 'Account Dropdown');
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('MSTR User');
        await libraryPage.logout();
    });

    it('[TC65185] [TC74332] Standard mode login end-to-end workflow', async () => {
        await takeScreenshot('TC65185', 'Login Page', { tolerance: 0.1 });
        await loginPage.login(webAutomationUser.credentials);
        await libraryPage.openDossier(dossier.name);
        await libraryPage.openUserAccountMenu();
        await takeScreenshotByElement(userAccount.getAccountDropdown(), 'TC74332', 'Account Dropdown');
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('web automation');
        await libraryPage.logout();
    });

    // Responsive
    it('[TC74334] Standard Authentication testing - Verify responsiveness with end-to-end login workflow on Library web', async () => {
        // Check responsive for the UI
        await takeScreenshot('TC74334', 'Login Page: 1600 px', { tolerance: 0.1 });
        await loginPage.login(webAutomationUser.credentials);
        await libraryPage.openUserAccountMenu();
        await takeScreenshot('TC74334', 'User Account Menu: 1600 px', { tolerance: 0.1 });
        await libraryPage.logout();
        await loginPage.waitForLoginView();

        await setWindowSize({
            width: 800,
            height: 800,
        });
        await takeScreenshot('TC74334', 'Login Page: 800 px', { tolerance: 0.1 });
        await loginPage.login(webAutomationUser.credentials);
        await libraryPage.openUserAccountMenu();
        await takeScreenshot('TC74334', 'User Account Menu: 800 px', { tolerance: 0.1 });
        await libraryPage.logout();
        await loginPage.waitForLoginView();

        await setWindowSize({
            width: 400,
            height: 800,
        });
        await takeScreenshot('TC74334', 'Login Page: 400 px', { tolerance: 0.1 });
        await loginPage.login(webAutomationUser.credentials);
        await libraryPage.openHamburgerMenu();
        await libraryPage.hamburgerMenu.clickButton('Account');
        await takeScreenshot('TC74334', 'User Account Menu: 400 px', { tolerance: 0.1 });
        await libraryPage.logout({ mobileView: true });

        await setWindowSize({
            width: 1600,
            height: 1200,
        });
    });

    it('[TC24651] Standard mode - Seamless login - library to web', async () => {
        await loginPage.login(webAutomationUser.credentials);
        await libraryPage.openDossierInfoWindow(RSD.name);
        await since('The presence of edit button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await infoWindow.isEditIconPresent())
            .toBe(true);
        await infoWindow.clickEditButton();
        await libraryPage.switchToTab(1);
        await biwebRsdEditablePage.waitForRsdLoad(120000);
        let mstrUrl = await libraryPage.currentURL();
        await since('MSTR Web Url').expect(mstrUrl.endsWith('servlet/mstrWeb')).toBe(true);
        await since('Current RSD should be #{expected}, but we get #{actual}')
            .expect(await biwebRsdEditablePage.getDocName())
            .toBe(RSD.name);
        await since('Seamless account should be #{expected}, but we get #{actual}')
            .expect(await biwebRsdEditablePage.getAccountName())
            .toBe('web automation');
        await libraryPage.closeTab(1);
        await infoWindow.close();
    });

    it('[TC84708] ASP Seamless login - library to web', async () => {
        await loginPage.login(webAutomationUser.credentials);
        await libraryPage.openDossierInfoWindow(RSD.name);
        await since('The presence of edit button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await infoWindow.isEditIconPresent())
            .toBe(true);
        await infoWindow.clickEditButton();
        await libraryPage.switchToTab(1);
        await biwebRsdEditablePage.waitForRsdLoad();
        let mstrUrl = await libraryPage.currentURL();
        await since('MSTR Web Url').expect(mstrUrl).toEqual(browsers.params.mstrUrl);
        await since('Current RSD should be #{expected}, but we get #{actual}')
            .expect(await biwebRsdEditablePage.getDocName())
            .toBe(RSD.name);
        await since('Seamless account should be #{expected}, but we get #{actual}')
            .expect(await biwebRsdEditablePage.getAccountName())
            .toBe('web automation');
        await libraryPage.closeTab(1);
        await infoWindow.close();
    });

    it('[TC87661] Switch user after logging out and applying a new link with specified dossier', async () => {
        // Login as admin user
        try {
            await loginPage.login(webAutomationUser.credentials);
            await libraryPage.openDossier(dossier.name);
            await dossierPage.waitForDossierLoading();
            await libraryPage.openUserAccountMenu();
            await since('The user should be #{expected}, instead we have #{actual}')
                .expect(await userAccount.getUserName())
                .toBe('web automation');
            await libraryPage.logout();

            // Logout and apply a dossier link and login with another user
            const url = new URL(`app/${dossier.project.id}/${dossier.id}`, browser.options.baseUrl);
            await browser.url(url.toString(), loginPage.DEFAULT_LOADING_TIMEOUT);
            await loginPage.login(standardUser.credentials);
            await dossierPage.waitForDossierLoading();
            await since('Page title should be #{expected}, instead we have #{actual}')
                .expect(await dossierPage.pageTitle())
                .toEqual([dossier.name, 'Chapter 1', 'CustomViz']);
            await libraryPage.openUserAccountMenu();
            await since('The user should be #{expected}, instead we have #{actual}')
                .expect(await userAccount.getUserName())
                .toBe('automation');
            await libraryPage.closeUserAccountMenu();
        } catch (e) {
            if (
                e.message.includes(ERROR_MAP.ERR_001) ||
                e.message.includes(ERROR_MAP.ERR_002) ||
                e.message.includes(ERROR_MAP.ERR_003)
            ) {
                console.log('Low Pass for TC87661: ', e.message);
                return;
            }
            throw e;
        }
    });

    it('[TC87673] Return 403 forbidden for URL /admin.jsp', async () => {
        await adminPage.openAdminjspPage();
        await since('The response should be #{expected} but wet get #{actual}')
            .expect(await adminPage.getForbiddenMessage())
            .toContain('403 - Forbidden');
    });
});
