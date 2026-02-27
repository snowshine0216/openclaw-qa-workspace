import setWindowSize from '../../../config/setWindowSize.js';
import * as consts from '../../../constants/customApp/info.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';

describe('Custom App - Custom Font', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    // const mobileWindow = {
    //     browserInstance: browsers.browser1,
    //     width: 599,
    //     height: 640,
    // };

    let { loginPage, libraryPage } = browsers.pageObj1;

    let customAppIdEnableCustomFont;
    const customFont = 'dangrek';

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(consts.appUser.credentials);
        customAppIdEnableCustomFont = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.customFontCustomAppObj,
        });
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await setWindowSize(browserWindow);
    });

    afterAll(async () => {
        await deleteCustomAppList({
            credentials: consts.mstrUser.credentials,
            customAppIdList: [customAppIdEnableCustomFont],
        });
    });

    it('[TC90088_11] Check Enable Custom Font And Open Library', async () => {
        await libraryPage.openCustomAppById({ id: customAppIdEnableCustomFont });
        await since(
            'After open custom app with custom font, the title font is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.titleFont())
            .toBe(customFont);
        await since(
            'After open custom app with custom font, the list container header font is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.getListContainerHeaderFont())
            .toBe(customFont);
        await since(
            'After open custom app with custom font, the sort option font is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.librarySort.getSortOptionFont())
            .toBe(customFont);
        await since(
            'After open custom app with custom font, the dossier name font is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.libraryItem.getDossierNameFont())
            .toBe(customFont);
        // open sidebar
        await libraryPage.openSidebar();
        await since(
            'After open custom app with custom font, the sidebar font is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.getFontFamily(libraryPage.sidebar.getPredefinedSectionItem('Subscriptions')))
            .toBe(customFont);
    });
});
