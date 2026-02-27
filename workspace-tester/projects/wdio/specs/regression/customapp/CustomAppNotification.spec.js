import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import * as consts from '../../../constants/customApp/info.js';
import * as collab from '../../../constants/collaborationPrivate.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import createBookmarks from '../../../api/createBookmarks.js';
import * as customApp from '../../../constants/customApp/customAppBody.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';

describe('Custom App test app level notification', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    let {
        loginPage,
        dossierPage,
        libraryPage,
        notification,
        commentsPage,
        groupDiscussion,
        share,
        shareDossier,
        collaborationDb,
        bookmark,
    } = browsers.pageObj1;

    let libraryHomeBody = customApp.getCustomAppBody({
        version: 'v1',
        name: 'autoLibraryHomeNotification',
    });
    let dossierHomeBody = customApp.getCustomAppBody({
        version: 'v1',
        name: 'autoDossierHomeNotification',
        dossierMode: 1,
        url: `/app/${consts.dossierAutoWeb2.project.id}/${consts.dossierAutoWeb2.id}`,
    });

    let dbUrl = browsers.params.dbUrl;

    let customAppIdLibraryHome, customAppIdDossierHome;

    beforeAll(async () => {
        await loginPage.login(consts.appUser.credentials);
        await setWindowSize(browserWindow);
        await resetBookmarks({
            credentials: consts.autoapp1.credentials,
            dossier: consts.dossierWithPSfilterLink,
        });

        await createBookmarks({
            bookmarkList: [consts.sharedBM],
            credentials: consts.autoapp1.credentials,
            dossier: consts.dossierWithPSfilterLink,
        });

        customAppIdLibraryHome = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: libraryHomeBody,
        });
        customAppIdDossierHome = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: dossierHomeBody,
        });
    });

    afterAll(async () => {
        await deleteCustomAppList({
            credentials: consts.mstrUser.credentials,
            customAppIdList: [customAppIdLibraryHome, customAppIdDossierHome],
        });
    });

    it('[TC80265_1] Test collaboration in home library', async () => {
        const shareBMMsg =
            consts.autoapp1.credentials.username +
            ' shared ' +
            consts.dossierWithPSfilterLink.name +
            ' and 1 bookmark with you.';
        const newMsg =
            collab.newMsgDossierNotification + consts.groupName1 + ' in ' + consts.dossierWithPSfilterLink.name + '.';
        const newDiscussion =
            consts.autoapp1.credentials.username +
            ' has started a discussion with you in ' +
            consts.dossierWithPSfilterLink.name +
            '.';
        const newMention =
            consts.autoapp1.credentials.username +
            ' mentioned you in ' +
            consts.dossierWithPSfilterLink.name +
            ' / ' +
            consts.dossierWithPSfilterLink.chapter;
        // clear db
        await collaborationDb.deleteAllTopics(
            dbUrl,
            consts.dossierWithPSfilterLink.project.id + ':' + consts.dossierWithPSfilterLink.id
        );
        await collaborationDb.deleteAllNotifications(dbUrl, consts.appWeb.id);
        await collaborationDb.deleteAllComments(
            dbUrl,
            consts.dossierWithPSfilterLink.project.id + ':' + consts.dossierWithPSfilterLink.id
        );

        // post comment & discussion
        await libraryPage.switchUser(consts.autoapp1.credentials);
        await dossierPage.openCustomAppById({ id: customAppIdLibraryHome });
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openDossier(consts.dossierWithPSfilterLink.name);
        await commentsPage.openCommentsPanel();
        await commentsPage.addCommentWithUserMention(consts.comment, consts.appWeb.credentials.username);
        await commentsPage.postComment();
        await groupDiscussion.openDiscussionTab();
        await groupDiscussion.createNewDiscussion(
            [consts.appWeb.credentials.username],
            0,
            consts.groupName1,
            consts.message1
        );
        await groupDiscussion.goBackToSummaryPanel();
        await commentsPage.closeCommentsPanel();

        // share bookmark
        await share.openSharePanel();
        await share.openShareDossierDialog();
        await shareDossier.includeBookmark();
        await shareDossier.openBMList();
        await shareDossier.selectSharedBookmark([consts.sharedBM]);
        await shareDossier.closeShareBookmarkDropDown();
        await shareDossier.searchRecipient(consts.appWeb.credentials.username);
        await shareDossier.selectRecipients([consts.appWeb.credentials.username]);
        await shareDossier.shareDossier();

        //check appWeb
        await libraryPage.switchUser(consts.appWeb.credentials);
        await libraryPage.waitForLibraryLoading();
        await takeScreenshotByElement(
            await libraryPage.getNavigationBar(),
            'TC80265_1_1',
            'there should be red dot besides notificatioin icon'
        );
        await libraryPage.openDossier(consts.dossierWithPSfilterLink.name);
        await takeScreenshotByElement(
            await dossierPage.getNavigationBar(),
            'TC80265_1_2',
            'there should be red dot besides collaboratioin icon'
        );
        await dossierPage.goToLibrary();
        await notification.openPanel();
        await since('Message should be "' + shareBMMsg + '", instead we have #{actual}')
            .expect(await notification.getNotificationMsgByIndex(0).getText())
            .toContain(shareBMMsg);
        await since('Message should be "' + newMsg + '", instead we have #{actual}')
            .expect(await notification.getNewMsg().getText())
            .toContain(newMsg);
        await since('Message should be "' + newDiscussion + '", instead we have #{actual}')
            .expect(await notification.getStartDiscussionMsgFromUser(consts.autoapp1.credentials.username).getText())
            .toContain(newDiscussion);
        await since('Message should be "' + newMention + '", instead we have #{actual}')
            .expect(
                await (await notification.getFirstMentionMsgFromUser(consts.autoapp1.credentials.username)).getText()
            )
            .toContain(newMention);
        await notification.openMsgByIndex(0);
        await since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isBookmarkLabelPresent())
            .toBe(true);
        await commentsPage.openCommentsPanel();
        await since('Comment should be "' + consts.comment + '", instead we have #{actual}')
            .expect(await (await commentsPage.getCommentByIndex(0)).getText())
            .toContain(consts.comment);
        await commentsPage.closeCommentsPanel();
    });

    it('[TC80265_2] Test collaboration in home dossier', async () => {
        const shareDossierMsg =
            consts.autoapp1.credentials.username + ' shared ' + consts.dossierAutoWeb2.name + ' with you.';
        const newMsg =
            collab.newMsgDossierNotification + consts.groupName1 + ' in ' + consts.dossierAutoWeb2.name + '.';
        const newDiscussion =
            consts.autoapp1.credentials.username +
            ' has started a discussion with you in ' +
            consts.dossierAutoWeb2.name +
            '.';
        const newMention =
            consts.autoapp1.credentials.username +
            ' mentioned you in ' +
            consts.dossierAutoWeb2.name +
            ' / ' +
            consts.dossierAutoWeb2.chapter;
        const msgDiscussion = '@' + consts.appWeb.credentials.username + ' ' + consts.message2;
        // clear db
        await collaborationDb.deleteAllTopics(
            dbUrl,
            consts.dossierAutoWeb2.project.id + ':' + consts.dossierAutoWeb2.id
        );
        await collaborationDb.deleteAllNotifications(dbUrl, consts.appWeb.id);
        await collaborationDb.deleteAllComments(
            dbUrl,
            consts.dossierAutoWeb2.project.id + ':' + consts.dossierAutoWeb2.id
        );

        // post comment & discussion
        await libraryPage.switchUser(consts.autoapp1.credentials);
        await dossierPage.openCustomAppById({ id: customAppIdDossierHome, dossier: true });
        await dossierPage.waitForDossierLoading();
        await commentsPage.openCommentsPanel();
        await commentsPage.addCommentWithUserMention(consts.comment, consts.appWeb.credentials.username);
        await commentsPage.postComment();
        await groupDiscussion.openDiscussionTab();
        await groupDiscussion.createNewDiscussion(
            [consts.appWeb.credentials.username],
            0,
            consts.groupName1,
            consts.message1
        );
        await groupDiscussion.goBackToSummaryPanel();
        await commentsPage.closeCommentsPanel();

        // share bookmark
        await share.openSharePanel();
        await share.openShareDossierDialog();
        await shareDossier.searchRecipient(consts.appWeb.credentials.username);
        await shareDossier.selectRecipients([consts.appWeb.credentials.username]);
        await shareDossier.shareDossier();

        //check appWeb todo: add take screenshot
        await libraryPage.switchUser(consts.appWeb.credentials);
        await dossierPage.waitForDossierLoading();
        // await dossierPage.openCustomAppById({ id: customAppIdDossierHome, dossier: true });
        await takeScreenshotByElement(
            await dossierPage.getNavigationBar(),
            'TC80265_2_1',
            'there should be red dot besides collaboratioin and notification icon'
        );
        await notification.openPanel();
        await since('Message should be "' + shareDossierMsg + '", instead we have #{actual}')
            .expect(await notification.getNotificationMsgByIndex(0).getText())
            .toContain(shareDossierMsg);
        await since('Message should be "' + newMsg + '", instead we have #{actual}')
            .expect(await notification.getNewMsg().getText())
            .toContain(newMsg);
        await since('Message should be "' + newDiscussion + '", instead we have #{actual}')
            .expect(await notification.getStartDiscussionMsgFromUser(consts.autoapp1.credentials.username).getText())
            .toContain(newDiscussion);
        await since('Message should be "' + newMention + '", instead we have #{actual}')
            .expect(
                await (await notification.getFirstMentionMsgFromUser(consts.autoapp1.credentials.username)).getText()
            )
            .toContain(newMention);
        await notification.openMsgByIndex(1);
        await since('Message should be "' + consts.message1 + '", instead we have #{actual}')
            .expect(await groupDiscussion.getDiscussionMsgByIndex(0).getText())
            .toContain(consts.message1);
        await commentsPage.addCommentWithUserMention(consts.message2, consts.appWeb.credentials.username);
        await commentsPage.postComment();
        await since('Message should be "' + msgDiscussion + '", instead we have #{actual}')
            .expect(await (await groupDiscussion.getDiscussionMsgByIndex(0)).getText())
            .toContain(msgDiscussion);
        await groupDiscussion.goBackToSummaryPanel();
        await commentsPage.closeCommentsPanel();
    });

    it('[TC80265_3] Test cross app notification', async () => {
        const shareDossierMsg =
            consts.autoapp1.credentials.username + ' shared ' + consts.dossierAutoCollabWeb.name + ' with you.';
        const newMsg =
            collab.newMsgDossierNotification + consts.groupName1 + ' in ' + consts.dossierAutoCollabWeb.name + '.';
        const newDiscussion =
            consts.autoapp1.credentials.username +
            ' has started a discussion with you in ' +
            consts.dossierAutoCollabWeb.name +
            '.';
        const newMention =
            consts.autoapp1.credentials.username +
            ' mentioned you in ' +
            consts.dossierAutoCollabWeb.name +
            ' / ' +
            consts.dossierAutoCollabWeb.chapter;
        // clear db
        await collaborationDb.deleteAllTopics(
            dbUrl,
            consts.dossierAutoCollabWeb.project.id + ':' + consts.dossierAutoCollabWeb.id
        );
        await collaborationDb.deleteAllNotifications(dbUrl, consts.appWeb.id);
        await collaborationDb.deleteAllComments(
            dbUrl,
            consts.dossierAutoCollabWeb.project.id + ':' + consts.dossierAutoCollabWeb.id
        );

        // post comment & discussion
        await libraryPage.switchUser(consts.autoapp1.credentials);
        await libraryPage.openDefaultApp();
        await libraryPage.openDossier(consts.dossierAutoCollabWeb.name);
        await commentsPage.openCommentsPanel();
        await commentsPage.addCommentWithUserMention(consts.comment, consts.appWeb.credentials.username);
        await commentsPage.postComment();
        await groupDiscussion.openDiscussionTab();
        await groupDiscussion.createNewDiscussion(
            [consts.appWeb.credentials.username],
            0,
            consts.groupName1,
            consts.message1
        );
        await groupDiscussion.goBackToSummaryPanel();
        await commentsPage.closeCommentsPanel();

        // share bookmark
        await share.openSharePanel();
        await share.openShareDossierDialog();
        await shareDossier.searchRecipient(consts.appWeb.credentials.username);
        await shareDossier.selectRecipients([consts.appWeb.credentials.username]);
        await shareDossier.shareDossier();

        //check appWeb
        await libraryPage.switchUser(consts.appWeb.credentials);
        await libraryPage.waitForLibraryLoading();
        await takeScreenshotByElement(
            await libraryPage.getNavigationBar(),
            'TC80265_3_1',
            'there should be red dot besides notificatioin icon'
        );
        await notification.openPanel();
        await since('Message should be "' + shareDossierMsg + '", instead we have #{actual}')
            .expect(await notification.getNotificationMsgByIndex(0).getText())
            .toContain(shareDossierMsg);
        await since('Message should be "' + newMsg + '", instead we have #{actual}')
            .expect(await notification.getNewMsg().getText())
            .toContain(newMsg);
        await since('Message should be "' + newDiscussion + '", instead we have #{actual}')
            .expect(await notification.getStartDiscussionMsgFromUser(consts.autoapp1.credentials.username).getText())
            .toContain(newDiscussion);
        await since('Message should be "' + newMention + '", instead we have #{actual}')
            .expect(
                await (await notification.getFirstMentionMsgFromUser(consts.autoapp1.credentials.username)).getText()
            )
            .toContain(newMention);
        await dossierPage.openCustomAppById({ id: customAppIdDossierHome, dossier: true });
        await dossierPage.waitForDossierLoading();
        await notification.openPanel();
        await since(
            ' In dossie home app, message in notification panel is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await notification.getEmptyTxt())
            .toBe(collab.emptyNotificationTxt);
        await dossierPage.openCustomAppById({ id: customAppIdLibraryHome });
        await libraryPage.waitForLibraryLoading();
        await notification.openPanel();
        await since(
            'In library home app, message in notfiication panel is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await notification.getEmptyTxt())
            .toBe(collab.emptyNotificationTxt);
    });
});
