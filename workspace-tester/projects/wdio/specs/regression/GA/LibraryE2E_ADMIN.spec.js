import setWindowSize from '../../..//config/setWindowSize.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('E2E Library of Admin User', () => {
    const dossier = {
        id: '957A9C7B462A52FA24A07B8BA02F788F',
        name: 'Dossier sanity_General',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document = {
        id: 'E0A287A543C415BDE985778B5CFD7764',
        name: 'Sample RSD with selector and link drill',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let { adminPage, loginPage, infoWindow, libraryPage, librarySearch, fullSearch, dossierPage } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await adminPage.openAdminPage();
    });

    afterAll(async () => {
        await adminPage.openAdminPage();
        await adminPage.chooseTab('Library Server');
        await adminPage.chooseRelatedContentSettings('Limit Related Content to Certified Items');
        await adminPage.clickSaveButton();
    });

    it('[TC58943_001] Login admin page and check overview status', async () => {
        await takeScreenshot('TC000001', 'Admin Overview', { tolerance: 0.2 });
    });

    it('[TC77907] Verify Library Server URL in Library Admin Page', async () => {
        await adminPage.chooseTab('Library Server');
        await since('Library URL should Contain #{expected}, instead we have #{actual}')
            .expect(browser.options.baseUrl)
            .toContain(await adminPage.getLibraryUrlText());
        await adminPage.clickLibraryUrl();
        await loginPage.login(browsers.params.credentials);
        await adminPage.openAdminPage();
    });

    it('[TC58943_002] Select authentication mode', async () => {
        await adminPage.chooseTab('Library Server');
        await adminPage.chooseAuthenticationMode('LDAP');
        await takeScreenshotByElement(
            adminPage.getAdminSection('Authentication Modes'),
            'TC58943_002',
            'Authentication: Standard & LDAP'
        );
        await adminPage.chooseAuthenticationMode('Trusted');
        await adminPage.selectTrustedProvider('Ping');
        // await adminPage.clickCreateTrustedButton();
        // await adminPage.inputUsername('trusted');
        // await adminPage.clickLoginInLoginPopupDialog();
        await takeScreenshotByElement(
            adminPage.getAdminSection('Authentication Modes'),
            'TC58943_002',
            'Trusted relationship created'
        );
        await adminPage.chooseTab('Collaboration Server');
        await takeScreenshotByElement(adminPage.getErrorDialog(), 'TC58943_002', 'Error dialog: Save reminder');
        await adminPage.click({ elem: adminPage.getCancelButtonInErrorDialog() });
        await adminPage.clickSaveButton();
        await adminPage.clickOkButtonInErrorDialog();

        // initialize
        await adminPage.chooseAuthenticationMode('Standard');
        await adminPage.clickSaveButton();
        await adminPage.clickOkButtonInErrorDialog();
    });

    it('[TC58943_003] Insert MicroStrategy web URL and launch Library', async () => {
        await adminPage.chooseTab('Library Server');
        await adminPage.inputMicroStrategyWebLink(browsers.params.mstrWebUrl);
        await adminPage.clickSaveButton();
        await takeScreenshotByElement(
            adminPage.getAdminSection('Web'),
            'TC58943_003',
            'Add MSTR web link'
        );
        await adminPage.clickLaunchButton();
        await adminPage.switchToTab(1);

        if ((await browser.getUrl()).includes('auth/ui/loginPage')) {
            await loginPage.login(browsers.params.credentials);
        }
        await libraryPage.moveDossierIntoViewPort(document.name);
        await libraryPage.openDossierInfoWindow(document.name);
        await since('The presence of edit button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await infoWindow.isEditIconPresent())
            .toBe(true);
        await infoWindow.clickEditButton();
        await libraryPage.switchToTab(2);
        await since('Web Url should contain config id')
            .expect(await browser.getUrl())
            .toBe(browsers.params.mstrWebUrl);
        await adminPage.closeTab(2);
        await libraryPage.switchToTab(1);
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
        await adminPage.closeTab(1);

        // Clear web link to initialize
        await libraryPage.switchToTab(0);
        await adminPage.inputMicroStrategyWebLink('');
        await adminPage.clickSaveButton();
    });

    it('[TC58943_005] Check Intelligence server settings', async () => {
        await adminPage.chooseTab('Intelligence Server');
        await takeScreenshotByElement(
            adminPage.getAdminSection('Intelligence Server Connection Settings'),
            'TC58943_005',
            'iServer settings'
        );
        await adminPage.inputSetting('Initial Pool Size', '100');
        await adminPage.clickSaveButton();
        await since('Success massage show is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await adminPage.getSettingValue('Initial Pool Size'))
            .toBe('100');
        // Set to default
        await adminPage.inputSetting('Initial Pool Size', '10');
        await adminPage.clickSaveButton();
    });

    it('[TC58943_006] Check Collaboration server settings', async () => {
        await adminPage.chooseTab('Collaboration Server');
        await takeScreenshot('TC58943_006', 'Collaboration Server settings');
    });

    it('[TC58943_007] Launch Help page', async () => {
        await adminPage.clickHelpButton();
        await adminPage.switchToTab(1);
        const helplink =
            'https://www2.microstrategy.com/producthelp/Current/InstallConfig/en-us/Content/library_admin_control_panel.htm';
        await since('Help Url is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await browser.getUrl())
            .toBe(helplink);
        await adminPage.closeTab(1);
        await libraryPage.switchToTab(0);
    });

    it('[TC58943_008] Verify secret key warning message', async () => {
        await adminPage.chooseTab('Library Server');
        const key1 = "1234567890abcdefghijklmnopqrstuvwxABCDEFGHIJKLMNOPQRSTUVWX!@#$%^&*()-_=+[]{}|;:',.<>/?`";
        await adminPage.inputSecretKey(key1);
        await since('Warining message is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await adminPage.getWarningMessageText())
            .toBe('The secret key cannot be shorter than 88 characters');
        const key2 =
            "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()-_=+[]{}|;:',.<>/?`~ABCDEFGHIJKLMNOPQRSTUVWXYZa1234567890";
        await adminPage.inputSecretKey(key2);
        await since('Warining message is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await adminPage.getWarningMessageText())
            .toBe('The secret key cannot exceed the maximum length of 128');
        await adminPage.clickCancelButton();
    });

    //Add Keep users logged in

    it('[TC66358] Check Keep Users Logged in', async () => {
        await adminPage.chooseTab('Library Server');
        await adminPage.clickKeepUsersLoggedin();
        await adminPage.clickSaveButton();
        await adminPage.clickOkButtonInErrorDialog();
        await since('Keep users logged in check box checked is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await adminPage.isChecked(adminPage.getKeepUsersLoggedin()))
            .toBe(true);
        await takeScreenshotByElement(
            adminPage.getAdminSection('Security Settings'),
            'TC66358',
            'Check Keep Users Logged in'
        );
        await adminPage.clickKeepUsersLoggedin();
        await adminPage.clickSaveButton();
        await adminPage.clickOkButtonInErrorDialog();
        await since('Keep users logged in check box checked is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await adminPage.isChecked(adminPage.getKeepUsersLoggedin()))
            .toBe(false);
        await takeScreenshotByElement(
            adminPage.getAdminSection('Security Settings'),
            'TC66358',
            'Uncheck Keep Users Logged in'
        );
    });

    //Add Related Content

    it('[TC66357_001] Select Show Related Content', async () => {
        await adminPage.chooseTab('Library Server');
        await adminPage.chooseRelatedContentSettings('Show Related Content');
        await adminPage.clickSaveButton();
        await since(
            'Show Related Content radio button checked is supposed to be #{expected}, instead we have #{actual}.'
        )
            .expect(await adminPage.isChecked(adminPage.getRelatedContentSettings('Show Related Content')))
            .toBe(true);
        await takeScreenshotByElement(
            adminPage.getAdminSection('Related Content Settings'),
            'TC66357_001',
            'Select Show Related Content'
        );
    });

    it('[TC66357_002] Select Hide Related Content and launch Library', async () => {
        await adminPage.chooseTab('Library Server');
        await adminPage.chooseRelatedContentSettings('Hide Related Content');
        await adminPage.clickSaveButton();
        await since(
            'Hide Related Content radio button checked is supposed to be #{expected}, instead we have #{actual}.'
        )
            .expect(await adminPage.isChecked(adminPage.getRelatedContentSettings('Hide Related Content')))
            .toBe(true);
        await takeScreenshotByElement(
            adminPage.getAdminSection('Related Content Settings'),
            'TC66357_002',
            'Select Hide Related Content'
        );
        await adminPage.clickLaunchButton();
        await adminPage.switchToTab(1);
        if ((await browser.getUrl()).includes('auth/ui/loginPage')) {
            await loginPage.login(browsers.params.credentials);
        }
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossier(dossier.name);
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(dossier.name);
        await takeScreenshotByElement(
            infoWindow.getInfoWindow(),
            'TC66357_002',
            'Check Hide Related Content in Library info window',
            { tolerance: 0.2 }
        );
        await librarySearch.openSearchBox();
        await librarySearch.search('sanity');
        await librarySearch.pressEnter();
        await fullSearch.clickMyLibraryTab();
        await takeScreenshotByElement(
            infoWindow.getInfoWindow(),
            'TC66357_002',
            'Check Hide Related Content in searched info window',
            { tolerance: 0.2 }
        );
        await librarySearch.closeTab(1);
        await libraryPage.switchToTab(0);
    });

    it('[TC66357_003] Select Limit Related Content to Certified Items', async () => {
        await adminPage.chooseTab('Library Server');
        await adminPage.chooseRelatedContentSettings('Limit Related Content to Certified Items');
        await adminPage.clickSaveButton();
        await since(
            'Limit Related Content to Certified Items radio button checked is supposed to be #{expected}, instead we have #{actual}.'
        )
            .expect(
                await adminPage.isChecked(
                    adminPage.getRelatedContentSettings('Limit Related Content to Certified Items')
                )
            )
            .toBe(true);
        await takeScreenshotByElement(
            adminPage.getAdminSection('Related Content Settings'),
            'TC66357_003',
            'Select Limit Related Content to Certified Items'
        );
    });

    it('[TC68367] Verify Library version in admin page', async () => {
        await adminPage.openAbout();
        await since('Library Version title is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await adminPage.getAboutTitleText())
            .toBe('This is the Library application.');
    });

    it('[TC21137] Library Web Server - Revisit after review', async () => {
        await adminPage.chooseTab('Library Server');
        await adminPage.selectAllowEmbeddingRadioButton('All');
        await adminPage.chooseTab('Collaboration Server');
        await since('Error Dialog shows is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await adminPage.isErrorDialogShows())
            .toBe(true);
        await adminPage.clickCancelInErrorDialog();
        await adminPage.chooseTab('Library Server');
        await adminPage.selectAllowEmbeddingRadioButton('All');
        await adminPage.clickSaveButton();
        await adminPage.clickOkButtonInErrorDialog();
        await takeScreenshotByElement(adminPage.getAdminSection('Security Settings'), 'TC21137', 'Security Settings');
        //set to default
        await adminPage.selectAllowEmbeddingRadioButton('None');
        await adminPage.clickSaveButton();
        await adminPage.clickOkButtonInErrorDialog();
    });

    it('[TC90825] Validate Library Web health page', async () => {
        await adminPage.openHealthPage();
        await since('Health response is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await adminPage.healthPageResponse())
            .toBe('OK');
    });
});
