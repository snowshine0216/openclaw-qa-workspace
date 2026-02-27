import setWindowSize from '../../../config/setWindowSize.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import * as consts from '../../../constants/customApp/info.js';
import resetDossierState from '../../../api/resetDossierState.js';

describe('CustomApp_PinPanelOn2Sides', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    let customAppIdPinTocFilter,
        customAppIdPinTocComment,
        customAppIdPinTocAIAssistant,
        customAppIdPinFilterLeftComment,
        customAppIdPinFilterLeftAIAssistant;

    let { libraryPage, dossierPage, toc, loginPage, filterPanel, commentsPage, aiAssistant } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(consts.appUser.credentials);
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: consts.appUser.credentials,
            dossier: consts.sourceDossier,
        });
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await setWindowSize(browserWindow);
    });

    afterAll(async () => {
        await deleteCustomAppList({
            credentials: consts.mstrUser.credentials,
            customAppIdList: [
                customAppIdPinTocFilter,
                customAppIdPinTocComment,
                customAppIdPinTocAIAssistant,
                customAppIdPinFilterLeftComment,
                customAppIdPinFilterLeftAIAssistant,
            ],
        });
    });

    it('[TC91591_01] check pin Toc and pin Filter panel(right)', async () => {
        // create app
        customAppIdPinTocFilter = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinTocFilterBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdPinTocFilter });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await dossierPage.waitForDossierLoading();
        await since(
            'after pin toc and filter panel, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(true);

        await since(
            'after pin toc and filter panel, toc panel is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await (await toc.getMenuContainer()).isDisplayed())
            .toBe(true);

        await toc.goToPage({ chapterName: consts.sourceDossier.chapter, pageName: consts.sourceDossier.page2 });
        await since('after switch page, toc menu shows up is expected to be #{expected}, instead we have #{actual}')
            .expect(await (await toc.getMenuContainer()).isDisplayed())
            .toBe(true);

        await since('after switch page, filter panel shows up is expected to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(true);
    });

    it('[TC91591_02] check pin Toc and pin Comment panel', async () => {
        // create app
        customAppIdPinTocComment = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinTocCommentBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdPinTocComment });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await dossierPage.waitForDossierLoading();
        await since(
            'after pin toc and comment panel, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(true);

        await since(
            'after pin toc and comment panel, toc panel is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await (await toc.getMenuContainer()).isDisplayed())
            .toBe(true);

        await toc.goToPage({ chapterName: consts.sourceDossier.chapter, pageName: consts.sourceDossier.page2 });
        await since('after switch page, toc menu shows up is expected to be #{expected}, instead we have #{actual}')
            .expect(await (await toc.getMenuContainer()).isDisplayed())
            .toBe(true);

        await since(
            'after switch page, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(true);
    });

    it('[TC91591_03] check pin Toc and pin AIAssistant panel', async () => {
        // create app
        customAppIdPinTocAIAssistant = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinTocAIAssistantBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdPinTocAIAssistant });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await dossierPage.waitForDossierLoading();
        await since(
            'after pin toc and AIAssistant panel, AIAssistant panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(true);

        await since(
            'after pin toc and AIAssistant panel, toc panel is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await (await toc.getMenuContainer()).isDisplayed())
            .toBe(true);

        await toc.goToPage({ chapterName: consts.sourceDossier.chapter, pageName: consts.sourceDossier.page2 });
        await since('after switch page, toc menu shows up is expected to be #{expected}, instead we have #{actual}')
            .expect(await (await toc.getMenuContainer()).isDisplayed())
            .toBe(true);

        await since('after switch page, AIAssistant shows up is expected to be #{expected}, instead we have #{actual}')
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(true);
    });

    it('[TC91591_04] check pin Comment panel and pin Filter panel(left)', async () => {
        // create app
        customAppIdPinFilterLeftComment = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinFilterLeftCommentBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdPinFilterLeftComment });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await since(
            'after pin filter left and comment panel, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isLeftDocked())
            .toBe(true);

        await since(
            'after pin filter left and comment, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(true);
        await toc.openPageFromTocMenu({
            chapterName: consts.sourceDossier.chapter,
            pageName: consts.sourceDossier.page2,
        });
        await since(
            'after switch page, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(true);

        await since('after switch page, filter panel shows up is expected to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isLeftDocked())
            .toBe(true);
    });

    it('[TC91591_05] check pin AI Assistant Panel and Filter Panel(left)', async () => {
        // create app
        customAppIdPinFilterLeftAIAssistant = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinFilterLeftAIAssistantBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdPinFilterLeftAIAssistant });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await dossierPage.waitForDossierLoading();
        await since(
            'after pin filter left and AI Assistant, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isLeftDocked())
            .toBe(true);

        await since(
            'after pin filter left and AIAssinstant, AIAssinstant is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(true);
    });
});
