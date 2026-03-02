import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import * as consts from '../../../constants/collaborationPublic.js';

describe('E2E Collaboration of Business User', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    const dossier = {
        id: '4480640B11EAF10334D90080EF950B74',
        name: 'Call Center Management',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    let dbUrl = browsers.params.dbUrl;

    let { loginPage, dossierPage, libraryPage, commentsPage, toc, collaborationDb, notification, email } =
        browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        if (await dossierPage.isAccountIconPresent()) {
            await dossierPage.openUserAccountMenu();
            await dossierPage.logout();
            await dossierPage.sleep(2000);
        } else {
            await browser.url(new URL('auth/ui/loginPage', browser.options.baseUrl).toString(), 100000);
        }
    });

    // [TC65479_01] Post comment with user mention
    // 1. Login with collab user1
    // 2. Open the Comments panel
    // 3. Type "@<username>"to trigger username mention
    // 4. Select one user name and then type some comment
    // 5. Post the comment with user mention
    // 6. Login with the recipient credential
    // 7. Click the notification panel in Library home page. Click the comment.
    // 8. Login to email box, click the link 'View in Browser' in email (gmail account:mstr.collab@gmail.com/mstr1234)

    it('[TC65479_01] Post comment with user mention', async () => {
        await collaborationDb.deleteAllComments(dbUrl, dossier.project.id + ':' + dossier.id);
        await collaborationDb.deleteAllNotifications(dbUrl, consts.collab2.id);
        await email.clearMsgBox();
        await loginPage.login(consts.collab1.credentials);
        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();
        await commentsPage.openCommentsPanel();
        await commentsPage.deleteAllComments();
        await commentsPage.addCommentWithUserMention(consts.comment1, consts.collab2.credentials.username);
        await commentsPage.postComment();
        const isMentioned = await commentsPage.isUserMentionedTxT(
            consts.collab2.credentials.username,
            consts.comment1,
            0
        );
        await since('Comment with user mention should be posted successfully.').expect(isMentioned).toBe(true);
    });

    it('[TC65479_02] Check notification with user mention', async () => {
        await loginPage.login(consts.collab2.credentials);
        await notification.openPanel();
        await takeScreenshotByElement(
            notification.getNotificationMsgByIndex(0),
            'TC65479_01',
            'NotificationPanel - check notification in Panel',
            { tolerance: 0.1 }
        );
        await notification.openNoitficationMsgByIndex(0);
        await since(
            'After click message from notificaiton panel, it should redirect to the dossier with comment panel opened.'
        )
            .expect(await commentsPage.isPanelOpen())
            .toBe(true);
        await commentsPage.hideTimeStampInComment();
        await takeScreenshotByElement(
            commentsPage.getCommentsPanel(),
            'TC65479_02',
            'CommentPanel - check tag user comment',
            { tolerance: 0.1 }
        );
    });

    it('[TC65479_02_01] Check email with user mention', async () => {
        await loginPage.login(consts.collab2.credentials);
        await email.openViewInBrowserLink(consts.collab2.credentials.username);
        await commentsPage.hideTimeStampInComment();
        await takeScreenshotByElement(
            commentsPage.getCommentsPanel(),
            'TC65479_02_01',
            'CommentPanel - check tag user comment',
            { tolerance: 0.1 }
        );
    });

    // [TC65479_03] Post comment with @filter
    // 1. login with collab user 3
    // 2. Open the Comments Panel and type @filter to trigger embedding filter
    // 3. Post the comment with embedded filter
    it('[TC65479_03] Post comment with @filter ', async () => {
        // await collaborationDb.deleteAllComments(consts.getDburl(), dossier.project.id + ':' + dossier.id);
        await loginPage.login(consts.collab3.credentials);
        await libraryPage.openDossier(dossier.name);
        await commentsPage.openCommentsPanel();
        // await commentsPage.deleteAllComments();
        await commentsPage.addComment(consts.comment2);
        await commentsPage.checkFilter();
        await commentsPage.postComment();
        await since('Comment with @filter should be posted successfully.')
            .expect(await commentsPage.isFilterAdded(0))
            .toBe(true);
        await commentsPage.applyEmbeddedFilter(0);
        await since('The embedded filter should be applied after clicked in the comment.')
            .expect(await dossierPage.isRevertFilterDisplayed())
            .toBe(true);
    });

    // [TC65479_04] Post comment with @filter and @user
    // 1. login as collab user 4
    // 2. Open the Comments panel
    // 2. Type "@filter" to trigger embedding filter
    // 3. Type "@<username>" to trigger username mention
    // 4. Select one user name
    // 5. Post the comment with user mention and embedded filter
    // 6. login as collab user 5
    // 7. Click the notification panel in Library home page. Click the comment.
    // 8. Login to email box, click the link 'View in Browser' in email -- (gmail account:mstr.collab@gmail.com/mstr1234 )

    it('[TC65479_04] Post comment with @filter and @user ', async () => {
        await collaborationDb.deleteAllComments(dbUrl, dossier.id + ':' + dossier.id);
        await collaborationDb.deleteAllNotifications(dbUrl, consts.collab5.id);
        await loginPage.login(consts.collab4.credentials);
        await libraryPage.openDossier(dossier.name);
        await commentsPage.openCommentsPanel();
        await commentsPage.addCommentWithUserMention(consts.comment3, consts.collab5.credentials.username);
        await commentsPage.checkFilter();
        await commentsPage.postComment();
        await since('Comment with @filter should be posted successfully.')
            .expect(await commentsPage.isFilterAdded(0))
            .toBe(true);
        await since('Comment with @user should be posted successfully.')
            .expect(await commentsPage.isUserMentioned(consts.collab5.credentials.username, 0))
            .toBe(true);
        await commentsPage.applyEmbeddedFilter(0);
        await since('The embedded filter should be applied after clicked in the comment.')
            .expect(await dossierPage.isRevertFilterDisplayed())
            .toBe(true);
    });

    it('[TC65479_05] check comment with @filter and @user ', async () => {
        await loginPage.login(consts.collab5.credentials);
        await notification.openPanel();
        await takeScreenshotByElement(
            notification.getFirstMentionMsgFromUser(consts.collab4.credentials.username),
            'TC65479_05',
            'NotificationPanel - check notification in Panel'
        );
        await notification.openMentionMsgFromUser(consts.collab4.credentials.username, 0);
        await since(
            'After click message from notificaiton panel, it should redirect to the dossier with comment panel opened.'
        )
            .expect(await commentsPage.isPanelOpen())
            .toBe(true);
        await since('Comment with user mention should be shown in comment panel.')
            .expect(await commentsPage.isUserMentioned(consts.collab5.credentials.username, 0))
            .toBe(true);

        // test 'clear all' for notificatition panel
        await commentsPage.closeCommentsPanel();
        await dossierPage.goToLibrary();
        await notification.openPanel();
        await notification.clearAllMsgs();
    });

    it('[TC65479_05_01] check email with @filter and @user ', async () => {
        await loginPage.login(consts.collab5.credentials);
        await email.openViewInBrowserLink(consts.collab5.credentials.username);
        await since('After open link from emmail, Comment with user mention should be shown in comment panel.')
            .expect(await commentsPage.isUserMentioned(consts.collab5.credentials.username, 0))
            .toBe(true);
    });

    // [TC65479_06] Check current page
    // 1. Login to the Library as collab user 6 and run the dossier
    // 2. Open the comment Panel
    // 3. post comment in Page1 and Page2
    // 4. click on 'Page 1' in Page 2's comment
    // 5. switch on 'current page' in Page1

    it('[TC65479_06] check current page', async () => {
        await collaborationDb.deleteAllComments(dbUrl, dossier.project.id + ':' + dossier.id);
        await loginPage.login(consts.collab6.credentials);
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Open Cases', pageName: 'Open Cases' });
        await commentsPage.openCommentsPanel();
        await commentsPage.addComment(consts.comment4);
        await commentsPage.postComment();
        await toc.openPageFromTocMenu({ chapterName: 'Open Cases', pageName: 'Dossier Details' });
        await commentsPage.openCommentsPanel();
        await commentsPage.addComment(consts.comment5);
        await commentsPage.postComment();
        await commentsPage.clickOnPageIconInComment(1);
        await since('After click on page icon in comment, it should direct to the corresponding page.')
            .expect(await dossierPage.getTitle_Page().getText())
            .toBe('Open Cases');
        await commentsPage.switchCurrentPage('on');
        console.log(await commentsPage.getMessageCount());
        await since('after check current page, user can only see 1 comments tips')
            .expect(await commentsPage.getMessageCount())
            .toBe('Total 1 comment');
        await since('after check current page, user can only see 1 comment')
            .expect((await commentsPage.getAllActiveComments()).length)
            .toBe(1);
        // await takeScreenshotByElement(commentsPage.getCommentList(), 'TC65479_06', 'Comments Panel - turn on current Page');
        await commentsPage.switchCurrentPage('off');
        // await takeScreenshotByElement(commentsPage.getCommentList(), 'TC65479_06', 'Comments Panel - turn off current Page');
        await since('after check current page, user can only see 2 comments tips')
            .expect(await commentsPage.getMessageCount())
            .toBe('Total 2 comments');
        console.log((await commentsPage.getAllActiveComments()).length);
        await since('after check current page, user can only see 2 comments')
            .expect((await commentsPage.getAllActiveComments()).length)
            .toBe(2);
    });
});
