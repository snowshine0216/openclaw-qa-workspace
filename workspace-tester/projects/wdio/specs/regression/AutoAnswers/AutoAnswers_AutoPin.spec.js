import setWindowSize from '../../../config/setWindowSize.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import { autoPinCredentials } from '../../../constants/autoAnswer.js';
import { getCustomAppBody } from '../../../constants/customApp/customAppBody.js';

describe('Auto open and pin for Auto Answers', () => {
    const project = {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    };

    const dashboardWithAutoAnswers = {
        id: '1D2713AA3E4E67F0D43B019230D9D99B',
        name: 'Blank dashboard auto pin auto answers',
        project,
    };

    const dashboardNoAutoAnswers = {
        id: 'FDC4B5FBE7414CF780EEF19DA5125BA9',
        name: 'Blank dashboard auto answers disabled',
        project,
    };

    const browserWindowSize = {
        width: 1200,
        height: 1000,
    };

    const { loginPage, dossierPage, libraryPage, aiAssistant, commentsPage, filterPanel } = browsers.pageObj1;

    // create custom app with specific name and homeScreen, returns custom app id.
    const createCustomAppWithGivenBody = async (name, givenBody) => {
        const body = getCustomAppBody({
            version: 'v6',
            name,
            ...givenBody,
        });
        return await createCustomApp({
            credentials: autoPinCredentials,
            customAppInfo: body,
        });
    };

    const deleteCustomApp = async (customAppId) => {
        await deleteCustomAppList({
            credentials: autoPinCredentials,
            customAppIdList: [customAppId],
        });
    };

    beforeAll(async () => {
        await loginPage.login(autoPinCredentials);
        await setWindowSize(browserWindowSize);
    });

    it('[TC95410_1] Custom app pre-configure pin auto answer panel and allow close', async () => {
        const customAppId = await createCustomAppWithGivenBody('Auto_auto_pin_auto_answers', {
            customizedItems: {
                ai_assistant_unpin: false,
                ai_assistant_allow_close: true,
            },
        });

        // switch to custom app 'Auto_auto_pin_auto_answers'.
        await libraryPage.openCustomAppById({ id: customAppId });

        // open dossier
        await libraryPage.openDossier(dashboardWithAutoAnswers.name);
        await since('Due to custom app config, auto answers should be open and pinned')
            .expect((await aiAssistant.isAIAssistantPresent()) && (await aiAssistant.isAAPinned()))
            .toBe(true);
        await since('Close icon should be visible')
            .expect(await aiAssistant.isCloseIconPresented())
            .toBe(true);
        await since('Pin icon should be hidden')
            .expect(await aiAssistant.isPinIconPresented())
            .toBe(false);

        // close auto answers panel, open and pin comment panel
        await aiAssistant.close();
        await commentsPage.openCommentsPanel();
        await commentsPage.dockCommentPanel();
        // close dashboard and re-open it
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(dashboardWithAutoAnswers.name);

        await since('Comment panel should be open and pinned')
            .expect((await commentsPage.isPanelOpen()) && (await commentsPage.isDocked()))
            .toBe(true);

        // open auto answers panel
        await aiAssistant.open();
        await since('auto answers should be open and pinned')
            .expect((await aiAssistant.isAIAssistantPresent()) && (await aiAssistant.isAAPinned()))
            .toBe(true);

        // switch back to default custom app.
        await dossierPage.goToLibrary();
        await libraryPage.openDefaultApp();
        await deleteCustomApp(customAppId);
    });

    it('[TC95410_2] Custom app pre-configure pin auto answer panel and do not allow close', async () => {
        const customAppId = await createCustomAppWithGivenBody('Auto_auto_pin_auto_answers_no_close', {
            customizedItems: {
                ai_assistant_unpin: false,
                ai_assistant_allow_close: false,
            },
        });

        // switch to custom app 'Auto_auto_pin_auto_answers_no_close'.
        await libraryPage.openCustomAppById({ id: customAppId });

        // open dossier
        await libraryPage.openDossier(dashboardWithAutoAnswers.name);
        await since('Due to custom app config, auto answers should be open and pinned')
            .expect((await aiAssistant.isAIAssistantPresent()) && (await aiAssistant.isAAPinned()))
            .toBe(true);
        await since('Close icon should be hidden')
            .expect(await aiAssistant.isCloseIconPresented())
            .toBe(false);
        await since('Pin icon should be hidden')
            .expect(await aiAssistant.isPinIconPresented())
            .toBe(false);

        // open and pin filter panel
        await filterPanel.openFilterPanel();
        await filterPanel.dockFilterPanel();
        // close dashboard and re-open it
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(dashboardWithAutoAnswers.name);
        await since('Filter panel should be open and pinned')
            .expect((await filterPanel.isMainPanelOpen()) && (await filterPanel.isPanelDocked()))
            .toBe(true);

        // open auto answers panel
        await aiAssistant.open();
        await since('auto answers should be open and pinned')
            .expect((await aiAssistant.isAIAssistantPresent()) && (await aiAssistant.isAAPinned()))
            .toBe(true);

        // switch back to default custom app.
        await dossierPage.goToLibrary();
        await libraryPage.openDefaultApp();
        await deleteCustomApp(customAppId);
    });

    it('[TC95410_3] No pre-config,  open and pin auto answer panel, and re-execute dashboard', async () => {
        // switch back to default custom app.
        await libraryPage.openDefaultApp();

        // open dossier, then open auto answers
        await libraryPage.openDossier(dashboardWithAutoAnswers.name);
        await aiAssistant.open();
        await since('Auto answers should be pinned')
            .expect(await aiAssistant.isAAPinned())
            .toBe(true);

        // close dashboard and re-open it
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(dashboardWithAutoAnswers.name);
        await since("Due to previously it's open and pinned, auto answers should be open and pinned")
            .expect((await aiAssistant.isAIAssistantPresent()) && (await aiAssistant.isAAPinned()))
            .toBe(true);

        // close auto answers panel, then close dashboard and re-open it
        await aiAssistant.close();
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(dashboardWithAutoAnswers.name);
        await since('Auto answers should be not open')
            .expect(await aiAssistant.isAIAssistantPresent())
            .toBe(false);
        // but if we open the auto answers, it should be pinned
        await aiAssistant.open();
        await since('After open Auto answers, it should be pinned')
            .expect(await aiAssistant.isAAPinned())
            .toBe(true);

        // switch back to default custom app.
        await dossierPage.goToLibrary();
        await libraryPage.openDefaultApp();
    });

    it('[TC95411_1] Custom app configure pin filter(right) and auto answer panel', async () => {
        const customAppId = await createCustomAppWithGivenBody('Auto_auto_pin_fp_auto_answers', {
            customizedItems: {
                filter_panel_unpin: false,
                ai_assistant_unpin: false,
            },
        });

        // switch to custom app 'Auto_auto_pin_fp_auto_answers'.
        await libraryPage.openCustomAppById({ id: customAppId });

        // open dossier, filter panel should be open and pinned.
        await libraryPage.openDossier(dashboardWithAutoAnswers.name);
        await since('Filter panel should be open and pinned')
            .expect((await filterPanel.isMainPanelOpen()) && (await filterPanel.isPanelDocked()))
            .toBe(true);

        // then open auto answers, it should be open and pinned
        await aiAssistant.open();
        await since('Auto answers should be open and pinned')
            .expect((await aiAssistant.isAIAssistantPresent()) && (await aiAssistant.isAAPinned()))
            .toBe(true);

        // switch back to default custom app.
        await dossierPage.goToLibrary();
        await libraryPage.openDefaultApp();
        await deleteCustomApp(customAppId);
    });

    it('[TC95411_2] Custom app configure pin comment and auto answer panel', async () => {
        const customAppId = await createCustomAppWithGivenBody('Auto_auto_pin_comments_auto_answers', {
            customizedItems: {
                ai_assistant_unpin: false,
                comments_panel_unpin: false,
            },
        });

        // switch to custom app 'Auto_auto_pin_comments_auto_answers'.
        await libraryPage.openCustomAppById({ id: customAppId });

        // open dossier, auto answers panel should be open and pinned.
        await libraryPage.openDossier(dashboardWithAutoAnswers.name);
        await since('Auto answers should be open and pinned')
            .expect((await aiAssistant.isAIAssistantPresent()) && (await aiAssistant.isAAPinned()))
            .toBe(true);

        // switch back to default custom app.
        await dossierPage.goToLibrary();
        await libraryPage.openDefaultApp();
        await deleteCustomApp(customAppId);
    });

    it('[TC95411_3] Check auto answer pin status in different dashboards', async () => {
        const customAppId = await createCustomAppWithGivenBody('Auto_auto_pin_auto_answers', {
            customizedItems: {
                ai_assistant_unpin: false,
                ai_assistant_allow_close: true,
            },
        });

        // switch to custom app 'Auto_auto_pin_auto_answers'.
        await libraryPage.openCustomAppById({ id: customAppId });

        // open dossier which has auto answers disabled
        await libraryPage.openDossier(dashboardNoAutoAnswers.name);
        await since('Auto answers panel should be not open')
            .expect(await aiAssistant.isAIAssistantPresent())
            .toBe(false);

        // back to library and open dashboard with auto answers
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(dashboardWithAutoAnswers.name);
        await since('Auto answers panel should be open and pinned')
            .expect((await aiAssistant.isAIAssistantPresent()) && (await aiAssistant.isAAPinned()))
            .toBe(true);
        // close auto answers panel, then open and pin comments panel
        await aiAssistant.close();
        await commentsPage.openCommentsPanel();
        await commentsPage.dockCommentPanel();
        // close dashboard and open dossier which has auto answers disabled
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(dashboardNoAutoAnswers.name);
        await since('Auto answers panel should be not open')
            .expect(await aiAssistant.isAIAssistantPresent())
            .toBe(false);

        // back to library and open dashboard with auto answers
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(dashboardWithAutoAnswers.name);
        await since('Comments panel should be open and pinned')
            .expect((await commentsPage.isPanelOpen()) && (await commentsPage.isDocked()))
            .toBe(true);

        // switch back to default custom app.
        await dossierPage.goToLibrary();
        await libraryPage.openDefaultApp();
        await deleteCustomApp(customAppId);
    });

    it('[TC95412_1] Check auto answer pin status when switch custom app', async () => {
        const customAppId = await createCustomAppWithGivenBody('Auto_auto_pin_auto_answers', {
            customizedItems: {
                ai_assistant_unpin: false,
                ai_assistant_allow_close: true,
            },
        });
        // switch to custom app 'Auto_auto_pin_auto_answers'.
        await libraryPage.openCustomAppById({ id: customAppId });

        // open dossier, auto answers panel should be open and pinned.
        await libraryPage.openDossier(dashboardWithAutoAnswers.name);
        await since('Auto answers should be open and pinned')
            .expect((await aiAssistant.isAIAssistantPresent()) && (await aiAssistant.isAAPinned()))
            .toBe(true);

        // close dossier, switch back to default custom app, then open dossier.
        await dossierPage.goToLibrary();
        await libraryPage.openDefaultApp();
        await libraryPage.openDossier(dashboardWithAutoAnswers.name);
        await since('Auto answers should be not open')
            .expect(await aiAssistant.isAIAssistantPresent())
            .toBe(false);

        // close dossier, switch back to custom app 'Auto_auto_pin_auto_answers', then open dossier.
        await dossierPage.goToLibrary();
        await libraryPage.openCustomAppById({ id: customAppId });
        await libraryPage.openDossier(dashboardWithAutoAnswers.name);
        await since('Auto answers should be open and pinned')
            .expect((await aiAssistant.isAIAssistantPresent()) && (await aiAssistant.isAAPinned()))
            .toBe(true);

        // switch back to default custom app.
        await dossierPage.goToLibrary();
        await libraryPage.openDefaultApp();
        await deleteCustomApp(customAppId);
    });

    it('[TC95412_2] Check auto answer pin status in home dashboard', async () => {
        const customAppId = await createCustomAppWithGivenBody('Auto_auto_pin_AS_doc_home', {
            dossierMode: 1,
            url: 'app/B7CA92F04B9FAE8D941C3E9B7E0CD754/1D2713AA3E4E67F0D43B019230D9D99B',
            customizedItems: {
                ai_assistant_unpin: false,
            },
        });

        // switch to custom app 'Auto_auto_pin_AS_doc_home'.
        await libraryPage.openCustomAppById({ id: customAppId });

        await since('Auto answers panel should be open and pinned')
            .expect((await aiAssistant.isAIAssistantPresent()) && (await aiAssistant.isAAPinned()))
            .toBe(true);

        // switch back to default custom app.
        await libraryPage.openDefaultApp();
        await deleteCustomApp(customAppId);
    });
});
