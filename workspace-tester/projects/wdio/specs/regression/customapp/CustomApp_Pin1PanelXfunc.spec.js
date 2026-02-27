import setWindowSize from '../../../config/setWindowSize.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import * as consts from '../../../constants/customApp/info.js';

describe('CustomApp_Pin1PanelXfunc', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    let customAppIdPinToc, customAppIdPinComment, customAppIdPinAIAssistant;

    let { libraryPage, dossierPage, toc, loginPage, filterPanel, commentsPage, aiAssistant } = browsers.pageObj1;

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
            customAppIdList: [customAppIdPinToc, customAppIdPinComment, customAppIdPinAIAssistant],
        });
    });

    it('[TC90866_01] check pin Toc and manual pin Filter panel', async () => {
        // create app
        customAppIdPinToc = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinTocLeftFilterBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdPinToc });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await dossierPage.waitForDossierLoading();
        // open filter panel and pin it
        await toc.goToPage({
            chapterName: consts.sourceDossier.chapter,
            pageName: consts.sourceDossier.page1,
        });
        await filterPanel.openFilterPanel();
        await filterPanel.dockFilterPanel();
        // check filter panel is docked
        await since(
            'after pin filter panel, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(true);

        await since('after pin filter panel, pin icon is expected to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getUndockIcon().isDisplayed())
            .toBe(true);

        // click on toc icon and switch page
        await toc.openMenu();
        await toc.goToPage({ chapterName: consts.sourceDossier.chapter, pageName: consts.sourceDossier.page2 });
        // toc panel is still pinned
        await since(
            'after click on toc icon, toc menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await (await toc.getMenuContainer()).isDisplayed())
            .toBe(true);

        await since('after click on toc icon, pin icon is expected to be #{expected}, instead we have #{actual}')
            .expect(await (await toc.getTOCPin()).isDisplayed())
            .toBe(false);
    });

    it('[TC90866_02] check pin Comment panel and manual pin Filter panel', async () => {
        // create app
        customAppIdPinComment = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinCommentBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdPinComment });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await dossierPage.waitForDossierLoading();
        // manual pin filter panel
        await toc.openPageFromTocMenu({
            chapterName: consts.sourceDossier.chapter,
            pageName: consts.sourceDossier.page1,
        });
        await filterPanel.openFilterPanel();
        await filterPanel.dockFilterPanel();
        // check filter panel is docked
        await since(
            'after pin filter panel, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(true);

        await since('after pin filter panel, pin icon is expected to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getUndockIcon().isDisplayed())
            .toBe(true);
        // click on comment icon
        await commentsPage.openCommentsPanel();
        await since(
            'after click on comment icon, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(true);
        await since('after click on comment icon, pin icon is expected to be #{expected}, instead we have #{actual}')
            .expect(await commentsPage.getUndockIcon().isDisplayed())
            .toBe(false);
    });

    it('[TC90866_03] check pin AI Assistant Panel and manual pin Comment Panel', async () => {
        // create app
        customAppIdPinAIAssistant = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinAIAssistantNotAllowCloseBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdPinAIAssistant });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await dossierPage.waitForDossierLoading();
        await commentsPage.openCommentsPanel();
        await commentsPage.dockCommentPanel();
        await since(
            'after click on comment icon, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(true);

        await since('after click on comment icon, pin icon is expected to be #{expected}, instead we have #{actual}')
            .expect(await commentsPage.getUndockIcon().isDisplayed())
            .toBe(true);
        await since(
            'after click on comment icon, aiAssistant panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(false);

        await aiAssistant.open();
        await since(
            'after click on AIAssistant icon, AIAssistant panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(true);

        await since(
            'after click on AIAssistant icon, pin icon is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getUnPinBtn().isDisplayed())
            .toBe(false);
    });
});
