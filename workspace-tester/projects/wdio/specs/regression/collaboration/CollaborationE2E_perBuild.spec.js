import setWindowSize from '../../../config/setWindowSize.js';
import * as privateConst from '../../../constants/collaborationPrivate.js';

describe('E2E Collaboration for Tanzu', () => {
    const dossierAsHomeDisableUndoRedo = '32D634C087B44071B75ECD62AA37C401';
    const collaborationTest = {
        id: 'EAF770F9CD46F277F7B36588C3425B94',
        name: 'Campaign Overview',
        chapter1: 'Campaign Overview',
        chapter2: 'Articles',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const collabUser = {
        credentials: {
            username: 'collab',
            password: 'newman1#',
        },
    };

    const mstrUser = {
        username: 'mstr1',
        fullname: 'mstr1',
    };

    const adminUser = {
        abbr: 'admin',
        username: 'Administrator',
    };

    const comment3 = "it's an automation test with both tagging user and filter comment";
    const comment4 = "it's an automation test on page1";
    const comment5 = "it's an automation test on page2";
    const comment1 = 'invite user from discussion detail panel';
    const renameDiscussion = 'rename discussion';

    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    let { loginPage, dossierPage, commentsPage, notification, libraryPage, toc, groupDiscussion } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(collabUser.credentials);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    // TC75812:public ; TC77613:private
    // [TC75812_01] Post comment with @filter and @user
    // 1. run dossier "Campaign Overview"
    // 2. Open the Comments panel
    // 2. Type "@filter" to trigger embedding filter
    // 3. Type "@<username>" to trigger username mention
    // 4. Select one user name
    // 5. Post the comment with user mention and embedded filter
    // 6. Click the notification panel in Library home page. Click the comment.

    it('[TC75812_01] Collaboration - Library Web - Public comment with @filter and @user ', async () => {
        await libraryPage.openDossier(collaborationTest.name);
        await toc.openPageFromTocMenu({ chapterName: collaborationTest.chapter2 });
        await commentsPage.openCommentsPanel();
        await commentsPage.deleteAllComments();
        await commentsPage.addCommentWithUserMention(comment3, collabUser.credentials.username);
        await commentsPage.checkFilter();
        await commentsPage.postComment();
        await since('Comment with @filter should be posted successfully.')
            .expect(await commentsPage.isFilterAdded(0))
            .toBe(true);
        await since('Comment with @user should be posted successfully.')
            .expect(await commentsPage.isUserMentioned(collabUser.credentials.username, 0))
            .toBe(true);
        await commentsPage.applyEmbeddedFilter(0);
        await since('The embedded filter should be applied after clicked in the comment.')
            .expect(await dossierPage.isRevertFilterDisplayed())
            .toBe(true);
        await commentsPage.closeCommentsPanel();
        await dossierPage.goToLibrary();
        await notification.openPanel();
        await notification.openNoitficationMsgByIndex(0);
        await since(
            'After click message from notificaiton panel, it should redirect to the dossier with comment panel opened.'
        )
            .expect(await commentsPage.isPanelOpen())
            .toBe(true);
        await since('Comment with user mention should be shown in comment panel.')
            .expect(await commentsPage.isUserMentioned(collabUser.credentials.username, 0))
            .toBe(true);
        // verify  all notification doesn't appear in cross app
        await libraryPage.openCustomAppById({ id: dossierAsHomeDisableUndoRedo });
        await notification.openPanel();
        await since('no notificaiton should appear in another applicaiton')
            .expect(await notification.isNotificationNotEmpty())
            .toBe(false);

        // //clear all notifications
        await libraryPage.openDefaultApp();
        await notification.openPanel();
        await notification.clearAllMsgs();
        await notification.closePanel();
    });

    // [TC75812_02] Check current page
    // 1. run the dossier
    // 2. Open the comment Panel
    // 3. post comment in Overview and Advertisements
    // 4. click on chapter name in Overview's comment
    // 5. switch on 'current page' in Overview
    it('[TC75812_02] Collaboration - Library Web - Public comment with page icon', async () => {
        await libraryPage.openDossier(collaborationTest.name);
        await toc.openPageFromTocMenu({ chapterName: collaborationTest.chapter1 });
        await commentsPage.openCommentsPanel();
        await commentsPage.deleteAllComments();
        await commentsPage.addComment(comment4);
        await commentsPage.postComment();
        await toc.openPageFromTocMenu({ chapterName: collaborationTest.chapter2 });
        await commentsPage.openCommentsPanel();
        await commentsPage.addComment(comment5);
        await commentsPage.postComment();
        await commentsPage.clickOnPageIconInComment(1);
        console.log(await dossierPage.getTitle_Chapter().getText());
        await since('After click on page icon in comment, it should direct to the corresponding page.')
            .expect(await dossierPage.getTitle_Chapter().getText())
            .toBe(collaborationTest.chapter1);
        await commentsPage.switchCurrentPage('on');
        await since('after check current page, user can only see 1 comment')
            .expect((await commentsPage.getAllActiveComments()).length)
            .toBe(1);
        await commentsPage.switchCurrentPage('off');
        await since('after check current page, user can only see 2 comments')
            .expect(await commentsPage.getMessageCount())
            .toBe('Total 2 comments');
        await commentsPage.closeCommentsPanel();
    });

    // group discussion check
    it('[TC65479] Collaboration - Library Web - Private Discussion with multiple users', async () => {
        await libraryPage.openDossier(collaborationTest.name);
        await groupDiscussion.openCommentsPanel();
        await groupDiscussion.openDiscussionTab();
        await groupDiscussion.deleteAllDiscussions();
        await groupDiscussion.createNewDiscussion([mstrUser.fullname], 0, '', 'create new discussion');
        await groupDiscussion.addComment('Post msg after discussion is created');
        await commentsPage.postComment();
        // add verification
        // change name
        await groupDiscussion.clickDiscussionInfoIcon();
        await groupDiscussion.renameDiscussion(renameDiscussion);
        await groupDiscussion.goBackToDetailPanel();
        console.log(await groupDiscussion.getSystemMessageByIndex(0).getText());
        console.log(collabUser.name + ' has changed the discussion name to ' + renameDiscussion + '.');
        await since('Change Discussion Name History msg should display.')
            .expect(await groupDiscussion.getSystemMessageByIndex(0).getText())
            .toBe(collabUser.credentials.username + ' has changed the discussion name to ' + renameDiscussion + '.');
        // delete user
        await groupDiscussion.clickDiscussionInfoIcon();
        await groupDiscussion.removeUser(0);
        await since('Remove user should be successful.')
            .expect(await groupDiscussion.isUserExisted(mstrUser.username, 0))
            .toBe(false);
        // go back check system msg
        await groupDiscussion.goBackToDetailPanel();
        await since('Remove user sys msg should be displayed.')
            .expect(await groupDiscussion.getSystemMessageByIndex(0).getText())
            .toBe(mstrUser.fullname + privateConst.removedHistoryMsg);
        // invite user from comment
        await commentsPage.addCommentWithUserMention(comment1, mstrUser.username);
        await commentsPage.postComment();
        await groupDiscussion.clickHistoryInviteButton();
        console.log(await groupDiscussion.getSystemMessageByIndex(0).getText());
        console.log(mstrUser.fullname + privateConst.addedHistoryMsg);
        await since('Invite user from comment sys msg should be displayed.')
            .expect(await groupDiscussion.getSystemMessageByIndex(0).getText())
            .toBe(mstrUser.fullname + privateConst.addedHistoryMsg);
        // invite user from manage discussion panel
        await groupDiscussion.clickDiscussionInfoIcon();
        await groupDiscussion.invitePeople(adminUser.abbr, 0);
        console.log(await groupDiscussion.getLastMemberLoginNameInAboutPanel());
        await since('User should be successfully invited.')
            .expect(await groupDiscussion.getLastMemberLoginNameInAboutPanel())
            .toBe(adminUser.username);
        await groupDiscussion.goBackToDetailPanel();
        console.log(await groupDiscussion.getSystemMessageByIndex(0).getText());
        console.log(adminUser.username + privateConst.addedHistoryMsg);
        await since('Invite user from manage discussion panel sys msg should be displayed.')
            .expect(await groupDiscussion.getSystemMessageByIndex(0).getText())
            .toBe(adminUser.username + privateConst.addedHistoryMsg);
        // mute notification
        await groupDiscussion.clickDiscussionInfoIcon();
        await groupDiscussion.switchMuteNotification();
        await groupDiscussion.goBackToDetailPanel();
        await since('mute icon should appear besides discussion title in Detail Panel')
            .expect(await groupDiscussion.getMuteIconInDetailPanel().isDisplayed())
            .toBe(true);
        await groupDiscussion.goBackToSummaryPanel();
        await since('mute icon should appear besides discussion title in Summary Panel')
            .expect(await (await groupDiscussion.getMuteIconInSummaryPanel()).isDisplayed())
            .toBe(true);
        // leave discussion
        await groupDiscussion.enterExistingDiscussion(0);
        await groupDiscussion.clickDiscussionInfoIcon();
        await groupDiscussion.leaveDiscussion();
        await since('Discussion should disappear for left user')
            .expect(await groupDiscussion.isDiscussionExisted())
            .toBe(false);
        await commentsPage.closeCommentsPanel();
    });
});
