import setWindowSize from '../../../config/setWindowSize.js';
import * as consts from '../../../constants/customApp/info.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';

describe('Custom App - Granular Control - Accounts Panel', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    const mobileWindow = {
        browserInstance: browsers.browser1,
        width: 599,
        height: 640,
    };

    let { loginPage, libraryPage, userPreference } = browsers.pageObj1;

    let customAppIdDisableAccountUserName,
        customAppIdDisableMyApplications,
        customAppIdDisableManageLibrary,
        customAppIdDisableMyLanguage,
        customAppIdDisableMyTimeZone,
        customAppIdDisableSwitchWorkSpace,
        customAppIdDisableTakeATour,
        customAppIdDisableHelp,
        customAppIdDisableLogOut,
        customAppIdCustomizeHelpLink;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(consts.appUser.credentials);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await setWindowSize(browserWindow);
    });

    afterAll(async () => {
        await deleteCustomAppList({
            credentials: consts.mstrUser.credentials,
            customAppIdList: [
                customAppIdDisableAccountUserName,
                customAppIdDisableMyApplications,
                customAppIdDisableManageLibrary,
                customAppIdDisableMyLanguage,
                customAppIdDisableMyTimeZone,
                customAppIdDisableTakeATour,
                customAppIdDisableHelp,
                customAppIdDisableLogOut,
                customAppIdDisableSwitchWorkSpace,
                customAppIdCustomizeHelpLink,
            ],
        });
    });

    it('[TC90088_01] Check disable user name in account panel', async () => {
        // create app
        customAppIdDisableAccountUserName = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.disableAccountUserName,
        });
        await libraryPage.openCustomAppById({ id: customAppIdDisableAccountUserName });
        // in account panel, check user name is not displayed
        await libraryPage.openUserAccountMenu();
        await since('User name in account panel is expected to be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.userAccount.getUserAccountNameElement().isDisplayed())
            .toBe(false);

        // mobile view -> check user name in account panel
        // set windows size to be mobile view
        await setWindowSize(mobileWindow);
        await since(
            'User name in account panel in mobile view is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.hamburgerMenu.getUserNameInMobileView().isDisplayed())
            .toBe(false);
    });

    it('[TC90088_02] Check disable my applications', async () => {
        // create app
        customAppIdDisableMyApplications = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.disableMyApplications,
        });
        await libraryPage.openCustomAppById({ id: customAppIdDisableMyApplications });
        // in account panel, check my applications is not displayed
        await libraryPage.openUserAccountMenu();
        await since('My applications in account panel is expected to be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.userAccount.getSwitchApplicationBtn().isDisplayed())
            .toBe(false);

        // set windows size to be mobile view
        await setWindowSize(mobileWindow);
        // verify my applications is not displayed in mobile view
        await since(
            'My applications in hamburger menu in mobile view is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.hamburgerMenu.getOption('My Applications').isDisplayed())
            .toBe(false);
    });

    it('[TC90088_03] Check disable Manage Library', async () => {
        // create app
        customAppIdDisableManageLibrary = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.disableManageLibrary,
        });
        await libraryPage.openCustomAppById({ id: customAppIdDisableManageLibrary });
        // in account panel, check Manage Library is not displayed
        await libraryPage.openUserAccountMenu();
        await since('Manage Library in account panel is expected to be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.userAccount.getAccountMenuOption('Manage Library').isDisplayed())
            .toBe(false);

        // set windows size to be mobile view
        await setWindowSize(mobileWindow);
        // verify my applications is not displayed in mobile view
        await since(
            'Manage Library in hamburger menu in mobile view is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.hamburgerMenu.getOption('Manage Library').isDisplayed())
            .toBe(false);
    });

    it('[TC90088_04] Check disable My Language', async () => {
        // create app
        customAppIdDisableMyLanguage = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.disableMyLanguage,
        });
        await libraryPage.openCustomAppById({ id: customAppIdDisableMyLanguage });
        // in account panel, check My Language is not displayed in Preferences menu
        await libraryPage.openUserAccountMenu();
        await libraryPage.openPreferencePanel();
        await since('My Language in Preferences menu is expected to be #{expected}, instead we have #{actual}.')
            .expect(await userPreference.getPreferenceDropdown('My Language').isDisplayed())
            .toBe(false);

        // set windows size to be mobile view
        await setWindowSize(mobileWindow);
        // verify My Language is not displayed in mobile view
        await since(
            'My Language in hamburger menu in mobile view is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await userPreference.getPreferenceDropdown('My Language').isDisplayed())
            .toBe(false);
    });

    it('[TC90088_05] Check disable My TimeZone', async () => {
        // create app
        customAppIdDisableMyTimeZone = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.disableMyTimeZone,
        });
        await libraryPage.openCustomAppById({ id: customAppIdDisableMyTimeZone });
        // in account panel, check My Timezone is not displayed in Preferences menu
        await libraryPage.openUserAccountMenu();
        await libraryPage.openPreferencePanel();
        await since('My Time Zone in Preferences menu is expected to be #{expected}, instead we have #{actual}.')
            .expect(await userPreference.getPreferenceDropdown('My Time Zone').isDisplayed())
            .toBe(false);

        // set windows size to be mobile view
        await setWindowSize(mobileWindow);
        // verify My Time Zone is not displayed in mobile view
        await since(
            'My Time Zone in hamburger menu in mobile view is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await userPreference.getPreferenceDropdown('My Time Zone').isDisplayed())
            .toBe(false);
    });

    it('[TC90088_06] Check disable Switch Workspace', async () => {
        // create app
        customAppIdDisableSwitchWorkSpace = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.disableSwitchWorkSpace,
        });
        await libraryPage.openCustomAppById({ id: customAppIdDisableSwitchWorkSpace });
        // in account panel, check Switch Workspace is not displayed
        await libraryPage.openUserAccountMenu();
        await since('Switch Workspace in account panel is expected to be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.userAccount.getAccountMenuOption('Switch Workspace').isDisplayed())
            .toBe(false);

        // set windows size to be mobile view
        await setWindowSize(mobileWindow);
        // verify Switch Workspace is not displayed in mobile view
        await since(
            'Switch Workspace in hamburger menu in mobile view is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.hamburgerMenu.getOption('Switch Workspace').isDisplayed())
            .toBe(false);
    });

    it('[TC90088_07] Check disable Take A Tour', async () => {
        // create app
        customAppIdDisableTakeATour = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.disableTakeATour,
        });
        await libraryPage.openCustomAppById({ id: customAppIdDisableTakeATour });

        // in account panel, check Take A Tour is not displayed
        await libraryPage.openUserAccountMenu();
        await since('Take A Tour in account panel is expected to be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.userAccount.getAccountMenuOption('Take A Tour').isDisplayed())
            .toBe(false);

        // set windows size to be mobile view
        await setWindowSize(mobileWindow);
        await libraryPage.waitForItemLoading(); // await libraryPage.waitForLibraryLoading();
        // verify Take A Tour is not displayed in mobile view
        await since(
            'Take A Tour in hamburger menu in mobile view is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.hamburgerMenu.getOption('Take A Tour').isDisplayed())
            .toBe(false);
    });

    it('[TC90088_08] Check disable Help', async () => {
        // create app
        customAppIdDisableHelp = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.disableHelp,
        });
        await libraryPage.openCustomAppById({ id: customAppIdDisableHelp });
        // in account panel, check Help is not displayed
        await libraryPage.openUserAccountMenu();
        await since('Help in account panel is expected to be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.userAccount.getAccountMenuOption('Help').isDisplayed())
            .toBe(false);

        // set windows size to be mobile view
        await setWindowSize(mobileWindow);
        await libraryPage.waitForItemLoading();
        // verify Help is not displayed in mobile view
        await since('Help in hamburger menu in mobile view is expected to be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.hamburgerMenu.getOption('Help').isDisplayed())
            .toBe(false);
    });

    it('[TC90088_09] Check disable Logout', async () => {
        // create app
        customAppIdDisableLogOut = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.disableLogOut,
        });
        await libraryPage.openCustomAppById({ id: customAppIdDisableLogOut });
        // in account panel, check Logout is not displayed
        await libraryPage.openUserAccountMenu();
        await since('Logout in account panel is expected to be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.userAccount.getAccountMenuOption('Logout').isDisplayed())
            .toBe(false);

        // set windows size to be mobile view
        await setWindowSize(mobileWindow);
        await libraryPage.waitForItemLoading();
        // verify Logout is not displayed in mobile view
        await since('Logout in hamburger menu in mobile view is expected to be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.hamburgerMenu.getOption('Logout').isDisplayed())
            .toBe(false);
    });

    it('[TC90088_10] Check customize help link', async () => {
        // create app
        customAppIdCustomizeHelpLink = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.customizedHelpLinkBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdCustomizeHelpLink });
        // in account panel, check Help Link is customized
        await libraryPage.openUserAccountMenu();
        await since('Customized Help Link in account panel is expected to be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.userAccount.getAccountMenuOption(consts.linkName).isDisplayed())
            .toBe(true);
        await libraryPage.userAccount.clickAccountOption(consts.linkName);
        // switch to new tab
        await libraryPage.switchToTab(1);
        let currentUrl = await browser.getUrl();
        // verify the new tab is opened
        await since('Customized Help Link is expected to be opened in new tab #{expected}}, instead we have #{actual}.')
            .expect(currentUrl)
            .toContain(consts.linkAddress);
        // close the new tab
        await libraryPage.closeTab(1);
    });
});
