import setWindowSize from '../../../config/setWindowSize.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import * as consts from '../../../constants/customApp/info.js';

describe('CustomApp_PinSideBar', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    const mobileWindow = {
        browserInstance: browsers.browser1,
        width: 840, // threshold is 850
        height: 650,
    };

    let customAppIdPinSideBar, customAppIdDisableToolbar;

    let { libraryPage, sidebar, loginPage } = browsers.pageObj1;

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
            customAppIdList: [customAppIdPinSideBar, customAppIdDisableToolbar],
        });
    });

    it('[TC90862_01] check pin sidebar', async () => {
        // create app
        customAppIdPinSideBar = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinSidebarBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdPinSideBar });
        // check side bar is by default opened
        await since(
            'when firstly open custom app, side bar shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await sidebar.getSidebarContainer().isDisplayed())
            .toBe(true);
        // click on sidebar icon, and sidebar is not closed
        await libraryPage.clickLibraryIcon();
        await since(
            'after click on library icon,side bar shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await sidebar.getSidebarContainer().isDisplayed())
            .toBe(true);
        // resize to mobile view
        await setWindowSize(mobileWindow);
        // check sidebar is gone
        await since(
            'after resize to mobile view ,side bar shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await sidebar.getMobileSidebarContainer().isDisplayed())
            .toBe(false);
        // // click on sidebar icon, and sidebar is closed
        // await libraryPage.clickLibraryIcon();
        // await since(
        //     'in moobile view, after click on library icon,side bar shows up is expected to be #{expected}, instead we have #{actual}'
        // )
        //     .expect(await sidebar.getMobileSidebarContainer().isDisplayed())
        //     .toBe(false);
        // resize to desktop view
        await setWindowSize(browserWindow);
        // check sidebar is back
        await since(
            'after resize window from mobile view to desktop view, side bar shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await sidebar.getSidebarContainer().isDisplayed())
            .toBe(true);
    });

    it('[TC90862_02] check pin sidebar and toolbar is disabled', async () => {
        // check when toolbar is disabled, side bar is shown
        // create app
        customAppIdDisableToolbar = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinSideBarDisableToolbarBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdDisableToolbar });
        await since(
            'when open disable tool bar app, side bar shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await sidebar.getSidebarContainer().isDisplayed())
            .toBe(true);
    });
});
