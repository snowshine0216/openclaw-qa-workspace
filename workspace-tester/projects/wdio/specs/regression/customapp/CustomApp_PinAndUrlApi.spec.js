import setWindowSize from '../../../config/setWindowSize.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import * as consts from '../../../constants/customApp/info.js';
import resetDossierState from '../../../api/resetDossierState.js';

describe('CustomApp_PinAndUrlApi', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };
    // Filter can be open/close and can be undocked
    const pinFilterUrl =
        '?ui.filter=%7B%22dockedPosition%22%3A%22right%22%2C%22canClose%22%3A%20true%2C%22dockChangeable%22%3Afalse%2C%22isDocked%22%3A%20true%7D';
    // Filter can be open/close but cannot be docked
    const unPinFilterUrl =
        '?ui.filter=%7B%22dockedPosition%22%3A%22right%22%2C%22canClose%22%3A%20true%2C%22dockChangeable%22%3Afalse%2C%22isDocked%22%3A%20false%7D';
    // Filter docked and not allow close
    const pinFilterNotAllowCloseUrl =
        '?ui.filter=%7B%22dockedPosition%22%3A%22right%22%2C%22canClose%22%3A%20false%2C%22dockChangeable%22%3Afalse%2C%22isDocked%22%3A%20true%7D';
    // Filter works as usual but docked at left
    const positionLeftFilterUrl =
        '?ui.filter=%7B%22dockedPosition%22%3A%22left%22%2C%22canClose%22%3A%20true%2C%22dockChangeable%22%3Atrue%2C%22isDocked%22%3A%20false%7D';
    // const positionRightFilterUrl = '';

    let customAppIdPinFilterPanel, customAppIdPinFilterNotAllowClose, customAppIdLeftFilter;

    let { libraryPage, dossierPage, filterPanel, loginPage, toc } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        customAppIdPinFilterPanel = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinFilterDossierHome,
        });
        customAppIdLeftFilter = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.leftFilterDossierHomeBody,
        });
        await loginPage.login(consts.appUser.credentials);
        await resetDossierState({
            credentials: consts.appUser.credentials,
            dossier: consts.sourceDossier,
        });
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        // await setWindowSize(browserWindow);
    });

    afterAll(async () => {
        await deleteCustomAppList({
            credentials: consts.mstrUser.credentials,
            customAppIdList: [customAppIdPinFilterPanel, customAppIdPinFilterNotAllowClose, customAppIdLeftFilter],
        });
    });

    it('[TC91044_01] check pin Filter Panel combined with url Api', async () => {
        await libraryPage.openCustomAppById({ id: customAppIdPinFilterPanel, dossier: true });
        const currentUrl1 = await browser.getUrl();
        // check when url api unpin filter panel and custom app pin filter panel, filter panel is pinned
        const unpinUrl = currentUrl1 + unPinFilterUrl;
        await browser.url(unpinUrl);
        await dossierPage.waitForDossierLoading();
        await dossierPage.waitForItemLoading();
        // await toc.openPageFromTocMenu({ chapterName: consts.sourceDossier.chapter, pageName: consts.sourceDossier.page1 });
        // await filterPanel.openFilterPanel();
        await since(
            'when url api unpin filter panel and custom app pin filter panel, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(true);

        // check when url api pin filter panel and custom app unpin filter panel, filter panel is pinned
        await libraryPage.openCustomAppById({ id: customAppIdLeftFilter, dossier: true });
        await toc.openPageFromTocMenu({
            chapterName: consts.sourceDossier.chapter,
            pageName: consts.sourceDossier.page1,
        });
        const currentUrl2 = await browser.getUrl();
        const pinUrl = currentUrl2 + pinFilterUrl;
        await browser.url(pinUrl);
        await dossierPage.waitForDossierLoading();
        await dossierPage.waitForItemLoading();
        await filterPanel.openFilterPanel();
        await since(
            'when url api pin filter panel and custom app unpin filter panel, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isLeftDocked())
            .toBe(true);
    });

    it('[TC91044_02] check allow close combined with url Api', async () => {
        // create app
        customAppIdPinFilterNotAllowClose = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinFilterNotAllowCloseDossierHomeBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdPinFilterNotAllowClose, dossier: true });
        const currentUrl1 = await browser.getUrl();
        // check when url api allow close filter panel and custom app not allow close filter panel, filter panel is not allow close
        const allowcloseUrl = currentUrl1 + pinFilterUrl;
        await dossierPage.waitForDossierLoading();
        await browser.url(allowcloseUrl);
        await since(
            'when url api allow close filter panel and custom app not allow close filter panel, close icon shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getCloseIcon().isDisplayed())
            .toBe(false);

        // check when url api not allow close filter panel and custom app allow close filter panel, filter panel is not allow close
        await libraryPage.openCustomAppById({ id: customAppIdPinFilterPanel, dossier: true });
        const currentUrl2 = await browser.getUrl();
        const notallowcloseUrl = currentUrl2 + pinFilterNotAllowCloseUrl;
        await browser.url(notallowcloseUrl);
        await dossierPage.waitForDossierLoading();
        await since(
            'when url api not allow close filter panel and custom app allow close filter panel, close icon shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getCloseIcon().isDisplayed())
            .toBe(false);
    });

    it('[TC91044_03] check filter panel left combined with url Api', async () => {
        await libraryPage.openCustomAppById({ id: customAppIdLeftFilter, dossier: true });
        const currentUrl1 = await browser.getUrl();

        const rightfilterUrl = currentUrl1 + pinFilterUrl;
        await dossierPage.waitForDossierLoading();
        await browser.url(rightfilterUrl);
        await dossierPage.waitForDossierLoading();
        await toc.openPageFromTocMenu({
            chapterName: consts.sourceDossier.chapter,
            pageName: consts.sourceDossier.page2,
        });
        await since(
            'when filter panel is right position in url api and left position in custom app, filter panel shows up on left is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterIconOnLeft().isDisplayed())
            .toBe(true);

        await libraryPage.openCustomAppById({ id: customAppIdPinFilterPanel, dossier: true });
        const currentUrl2 = await browser.getUrl();
        const leftfilterUrl = currentUrl2 + positionLeftFilterUrl;
        await browser.url(leftfilterUrl);
        await dossierPage.waitForDossierLoading();
        await since(
            'when filter panel is left position in url api and right position in custom app, filter icon shows up on left is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getOpenedFilterIconOnLeft().isDisplayed())
            .toBe(false);
        await since(
            'when filter panel is left position in url api and right position in custom app, filter panel shows up on left is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isLeftDocked())
            .toBe(true);
    });
});
