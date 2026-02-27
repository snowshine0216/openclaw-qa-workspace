import setWindowSize from '../../../config/setWindowSize.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import * as consts from '../../../constants/customApp/info.js';
import resetDossierState from '../../../api/resetDossierState.js';

describe('CustomApp_PinAIAssistant', () => {
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

    let customAppIdPinAIAssistant, customAppIdPinAIAssistantDisableToolbar, customAppIdPinAIAssistantNotAllowClose;

    let { libraryPage, dossierPage, toc, grid, loginPage, aiAssistant } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        customAppIdPinAIAssistant = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinAIAssistantBody,
        });
        await loginPage.login(consts.appUser.credentials);
        await resetDossierState({
            credentials: consts.appUser.credentials,
            dossier: consts.sourceDossier,
        });

        // may need to delete all comments, notificaitons and discussions
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await setWindowSize(browserWindow);
    });

    afterAll(async () => {
        await deleteCustomAppList({
            credentials: consts.mstrUser.credentials,
            customAppIdList: [
                customAppIdPinAIAssistant,
                customAppIdPinAIAssistantDisableToolbar,
                customAppIdPinAIAssistantNotAllowClose,
            ],
        });
    });

    it('[TC91540_01] check pin AIAssistant', async () => {
        await libraryPage.openCustomAppById({ id: customAppIdPinAIAssistant });
        await libraryPage.openDossier(consts.sourceDossier.name);
        // check AIAssistant panel is by default pinned, and no pin icon, close icon shows up
        await since(
            'when firstly open custom app, AIAssistant panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(true);

        await since('when firstly open custom app, pin icon is expected to be #{expected}, instead we have #{actual}')
            .expect(await aiAssistant.getUnPinBtn().isDisplayed())
            .toBe(false);

        await since(
            'when firstly open custom app, close button shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getCloseBtn().isDisplayed())
            .toBe(true);

        await aiAssistant.closePanel('icon'); // issue here DE276294, can't click on icon to close it
        await since(
            'after click on close button to close it, AIAssistant panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(false);

        // refresh page -> aiAssistant panel not show
        await dossierPage.reload();
        await dossierPage.waitForDossierLoading();
        await since(
            'after close AIAssistant panel and refresh page, AIAssistant panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(false);
        await aiAssistant.open();
        await since('after reopen AIAssistant panel, pin icon is expected to be #{expected}, instead we have #{actual}')
            .expect(await aiAssistant.getUnPinBtn().isDisplayed())
            .toBe(false);
        await aiAssistant.close();
        await since(
            'after click on AIAssistant icon to close it, AIAssistant panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(false);
        await aiAssistant.open();

        // resize to mobile view
        await setWindowSize(mobileWindow);
        // check aiAssistant panel is gone
        await since(
            'after resize window to mobile view, AIAssistant panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(false);

        // restore to desktop view
        await setWindowSize(browserWindow);
        await since(
            'after resize window to desktop view, AIAssistant panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(false);
    });

    it('[TC91540_02] check pin AIAssistant and not allow close', async () => {
        // create app
        customAppIdPinAIAssistantNotAllowClose = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinAIAssistantNotAllowCloseBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdPinAIAssistantNotAllowClose });
        await libraryPage.openDossier(consts.sourceDossier.name);
        // await aiAssistant.waitForAIAssistantPanelPresent();
        await since(
            'when firstly open custom app, AIAssistant panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(true);

        await since('when firstly open custom app, pin icon is expected to be #{expected}, instead we have #{actual}')
            .expect(await aiAssistant.getUnPinBtn().isDisplayed())
            .toBe(false);

        await since(
            'when firstly open custom app, close button is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getCloseBtn().isDisplayed())
            .toBe(false);

        await aiAssistant.closePanel('icon');
        await since(
            'after click on AIAssistant icon to close it, AIAssistant panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(true);

        // resize to mobile view
        await setWindowSize(mobileWindow);
        await dossierPage.waitForDossierLoading();
        await since(
            'after resize window to mobile view, AIAssistant panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(false);

        // restore to desktop view
        await setWindowSize(browserWindow);
        await dossierPage.waitForDossierLoading();
        await since(
            'after resize window to desktop view, AIAssistant panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(true);
    });

    it('[TC91540_03] check pin AIAssistant and toolbar is disabled', async () => {
        // create app
        customAppIdPinAIAssistantDisableToolbar = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinAIAssistantDisableToolbarBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdPinAIAssistantDisableToolbar });
        await libraryPage.openDossier(consts.sourceDossier.name);
        // await aiAssistant.waitForAIAssistantPanelPresent();
        await since(
            'when open disable tool bar app, AIAssistant shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(true);
        await since(
            'when firstly open custom app, close button is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getCloseBtn().isDisplayed())
            .toBe(false);
    });

    it('[TC91540_04] check linking when AIAssistant is pinned', async () => {
        await libraryPage.openCustomAppById({ id: customAppIdPinAIAssistant });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await toc.openPageFromTocMenu({
            chapterName: consts.sourceDossier.chapter,
            pageName: consts.sourceDossier.page1,
        });
        await grid.linkToDossier(consts.sourceDossier.grid1Info);
        await dossierPage.switchToTab(1);
        await dossierPage.waitForDossierLoading();
        await since(
            'when link to new tab, AIAssistant panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(true);
        // close current tab
        await dossierPage.closeTab(1);
        await dossierPage.switchToTab(0);
        // link to current tab and check AIAssistant is still pinned
        await grid.linkToDossier(consts.sourceDossier.grid2Info);
        await dossierPage.waitForDossierLoading();
        await since(
            'when link to current tab, AIAssistant panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(true);
        // click back button and check AIAssistant is still pinned
        await dossierPage.goBackFromDossierLink();
        await since(
            'when back from linked dossier, AIAssistant panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(true);

        // user close AIAssistant menu and do link again
        await aiAssistant.close();
        await grid.linkToDossier(consts.sourceDossier.grid1Info);
        await dossierPage.switchToTab(1);
        await dossierPage.waitForDossierLoading();
        // link dossier to new tab and check AIAssistant is still pinned
        await since(
            'after user close AIAssistant panel and then link to new tab, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(true);
        // close current tab
        await dossierPage.closeTab(1);
        await dossierPage.switchToTab(0);
        // link to current tab and check AIAssistant is not pinned
        await grid.linkToDossier(consts.sourceDossier.grid2Info);
        await dossierPage.waitForDossierLoading();
        await since(
            'after user close AIAssistant panel and then link to current tab, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(true);
        // click back button and check AIAssistant is not pinned
        await dossierPage.goBackFromDossierLink();
        await since(
            'when back from linked dossier,  AIAssistant panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(false);
    });
});
