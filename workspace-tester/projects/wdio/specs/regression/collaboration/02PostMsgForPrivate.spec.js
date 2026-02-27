import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import * as consts from '../../../constants/collaborationPrivate.js';

describe('Private Channel_02PostMsg', () => {
    // let dossierPage, commentsPage, notification, libraryPage, email, groupDiscussion, collaborationDb;
    let { dossierPage, libraryPage, commentsPage, collaborationDb, notification, groupDiscussion, email } =
        browsers.pageObj1;

    let dbUrl = browsers.params.dbUrl;

    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    //create new discussion
    it('[TC69679_01] create discussion with group', async () => {
        await collaborationDb.deleteAllTopics(
            dbUrl,
            consts.privateDossier1.project.id + ':' + consts.privateDossier1.id
        );
        await collaborationDb.deleteAllNotifications(dbUrl, consts.tc2group1.id);
        await collaborationDb.deleteAllNotifications(dbUrl, consts.tc2group2.id);
        await collaborationDb.deleteAllNotifications(dbUrl, consts.tc2user1.id);
        await email.clearMsgBox();
        await libraryPage.switchUser(consts.tc2user1.credentials);
        await libraryPage.openDossier(consts.privateDossier1.name);
        await groupDiscussion.openCommentsPanel();
        await groupDiscussion.openDiscussionTab();
        await groupDiscussion.createNewDiscussion([consts.tc2group], 0, consts.groupName3, 'create group discussion');
        await groupDiscussion.goBackToSummaryPanel();
        await commentsPage.closeCommentsPanel();

        await libraryPage.switchUser(consts.tc2group1.credentials);
        await libraryPage.openDossier(consts.privateDossier1.name);
        await groupDiscussion.openCommentsPanel();
        await groupDiscussion.openDiscussionTab();
        // check unread number
        await since('unread number should show correctly in Discussion tab')
            .expect(await groupDiscussion.getBadgeCounterInDiscussionTab())
            .toBe('1');
        await since('unread number should show correctly in Discussion icon')
            .expect(await groupDiscussion.getBadgeCounnterInDiscussionIcon())
            .toBe('1');
        await groupDiscussion.enterExistingDiscussion(0);
        await commentsPage.addCommentWithUserMention(consts.message3, consts.tc2group2.credentials.username);
        await commentsPage.checkFilter();
        await commentsPage.postComment();
        await groupDiscussion.hideTimeStampInDiscussionDetail();
        await takeScreenshotByElement(
            await groupDiscussion.getSystemMessageByIndex(0),
            'TC69679_01_01',
            'post_msg with tagging user and add embedded filter',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessagePanel(0),
            'TC69679_01_02',
            'post_msg with tagging user and add embedded filter',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessageInputBox(),
            'TC69679_01_03',
            'post_msg with tagging user and add embedded filter',
            { tolerance: 0.1 }
        );
        await groupDiscussion.goBackToSummaryPanel();
        await commentsPage.closeCommentsPanel();

        // check email
        await libraryPage.switchUser(consts.tc2group2.credentials);
        await email.openViewInBrowserLink(consts.tc2group2.credentials.username);
        await groupDiscussion.hideTimeStampInDiscussionDetail();
        await takeScreenshotByElement(
            await groupDiscussion.getSystemMessageByIndex(0),
            'TC69679_01_04',
            'open email for user mention inside group discussion',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessagePanel(0),
            'TC69679_01_05',
            'open email for user mention inside group discussion',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessageInputBox(),
            'TC69679_01_06',
            'open email for user mention inside group discussion',
            { tolerance: 0.1 }
        );

        // check for merged notification and post msg
        await dossierPage.goToLibrary();
        await notification.openPanel();
        await since('invite discussion notification should appear in notification panel')
            .expect(await notification.getInvitedDiscussionMsg().getText())
            .toMatch(consts.invitedDossierNotification + consts.groupName3 + ' discussion in a dossier.');
        await since('You have 2 new msgs notification should appear in notification panel')
            .expect(await notification.getNewMsg().getText())
            .toMatch(consts.newMsgsNotification + consts.groupName3 + ' in a dossier.');
        await notification.openMsgByOption('newmsg');
        await groupDiscussion.hideTimeStampInDiscussionDetail();
        await takeScreenshotByElement(
            await groupDiscussion.getSystemMessageByIndex(0),
            'TC69679_01_07',
            'open new messages notification',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessagePanel(0),
            'TC69679_01_08',
            'open new messages notification',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessageInputBox(),
            'TC69679_01_09',
            'open new messages notification',
            { tolerance: 0.1 }
        );
        // click apply filter - defect, can't apply
        // post msg for dossier in library not merged, mention user  (groupuser1)
        await commentsPage.addCommentWithUserMention(consts.message4, consts.tc2group1.credentials.username, 0);
        await commentsPage.postComment();
        await groupDiscussion.goBackToSummaryPanel();
        await commentsPage.closeCommentsPanel();

        // check notification - dossier in library, not merged, mention user  (groupuser1)
        await libraryPage.switchUser(consts.tc2group1.credentials);
        await notification.openPanel();
        await since('mentioned notification should appear in notification panel')
            .expect(await notification.getFirstMentionMsgFromUser(consts.tc2group2.credentials.username).getText())
            .toMatch(
                consts.tc2group2.credentials.username +
                    ' mentioned you in ' +
                    consts.groupName3 +
                    ' in ' +
                    consts.privateDossier1.name +
                    '.'
            );
        console.log(await notification.getFirstMentionMsgFromUser(consts.tc2group2.credentials.username).getText());
        await notification.openMsgFromUser(consts.tc2group2.credentials.username, 'mention');
        await groupDiscussion.hideTimeStampInDiscussionDetail();
        await takeScreenshotByElement(
            await groupDiscussion.getSystemMessageByIndex(0),
            'TC69679_01_10',
            'open new messages notification',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessagePanel(0),
            'TC69679_01_11',
            'open new messages notification',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessageInputBox(),
            'TC69679_01_12',
            'open new messages notification',
            { tolerance: 0.1 }
        );

        //post msg - dossier in library, not merged, not mention user  (groupuser1)
        await commentsPage.addComment(consts.message6);
        await commentsPage.checkFilter();
        await commentsPage.postComment();
        await groupDiscussion.hideTimeStampInDiscussionDetail();
        await takeScreenshotByElement(
            await groupDiscussion.getSystemMessageByIndex(0),
            'TC69679_01_13',
            'post msg_dossier not in Library,merged,mention user',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessagePanel(0),
            'TC69679_01_14',
            'post msg_dossier not in Library,merged,mention user',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessageInputBox(),
            'TC69679_01_15',
            'post msg_dossier not in Library,merged,mention user',
            { tolerance: 0.1 }
        );
        await groupDiscussion.goBackToSummaryPanel();
        await commentsPage.closeCommentsPanel();

        // check notification - dossier not in library, not merged, not mention user  (groupuser2)
        await libraryPage.switchUser(consts.tc2group2.credentials);
        await notification.openPanel();
        await since('You have 1 new msg notification should appear in notification panel')
            .expect(await notification.getNewMsg().getText())
            .toMatch(consts.newMsgDossierNotification + consts.groupName3 + ' in a dossier.');
        await notification.openMsgByOption('newmsg');
        await groupDiscussion.hideTimeStampInDiscussionDetail();
        await takeScreenshotByElement(
            await groupDiscussion.getSystemMessageByIndex(0),
            'TC69679_01_16',
            'open new messages notification',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessagePanel(0),
            'TC69679_01_17',
            'open new messages notification',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessageInputBox(),
            'TC69679_01_18',
            'open new messages notification',
            { tolerance: 0.1 }
        );

        // check notification - dossier in Library, merged, not mention user (groupuser1)
        await libraryPage.switchUser(consts.tc2user1.credentials);
        await libraryPage.openDossier(consts.privateDossier1.name);
        await groupDiscussion.openCommentsPanel();
        await groupDiscussion.openDiscussionTab();
        // check unread number
        await since('unread number should show correctly in Discussion tab')
            .expect(await groupDiscussion.getBadgeCounterInDiscussionTab())
            .toBe('3');
        await since('unread number should show correctly in Discussion icon')
            .expect(await groupDiscussion.getBadgeCounnterInDiscussionIcon())
            .toBe('3');
        await dossierPage.goToLibrary();
        await notification.openPanel();
        await since('You have 3 new msgs notification should appear in notification panel')
            .expect(await notification.getNewMsg().getText())
            .toMatch(consts.new3MsgsNotification + consts.groupName3 + ' in ' + consts.privateDossier1.name + '.');
        await notification.openMsgByOption('newmsg');
        await groupDiscussion.hideTimeStampInDiscussionDetail();
        await takeScreenshotByElement(
            await groupDiscussion.getSystemMessageByIndex(0),
            'TC69679_01_19',
            'open new messages notification',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessagePanel(0),
            'TC69679_01_20',
            'open new messages notification',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessageInputBox(),
            'TC69679_01_21',
            'open new messages notification',
            { tolerance: 0.1 }
        );
        //delete discussion
        await groupDiscussion.clickDiscussionInfoIcon();
        await groupDiscussion.deleteDisccusion();
    });

    // [TC69679_02] delete comments - post one tag user and then delete it , check notification panel check email
    it('[TC69679_02] create discussion and delete comments', async () => {
        await collaborationDb.deleteAllTopics(
            dbUrl,
            consts.privateDossier1.project.id + ':' + consts.privateDossier1.id
        );
        await collaborationDb.deleteAllNotifications(dbUrl, consts.tc2user2.id);
        await libraryPage.switchUser(consts.tc2user1.credentials);
        await libraryPage.openDossier(consts.privateDossier1.name);
        await groupDiscussion.openCommentsPanel();
        await groupDiscussion.openDiscussionTab();
        await groupDiscussion.createNewDiscussion(
            [consts.tc2user2.credentials.username],
            0,
            consts.groupName4,
            'Test for Delete Comments'
        );
        //post msg
        await commentsPage.addCommentWithUserMention(consts.message3, consts.tc2user2.credentials.username);
        await commentsPage.postComment();
        //delete msg
        await groupDiscussion.hoverAndDeleteCommentByIndex(0);

        //check notification for user2
        await libraryPage.switchUser(consts.tc2user2.credentials);
        await notification.openPanel();
        await since('You have 2 new msgs notification should appear in notification panel')
            .expect(await notification.getNewMsg().getText())
            .toMatch(consts.newMsgsNotification + consts.groupName4 + ' in ' + consts.privateDossier1.name + '.');
        await notification.openMsgByOption('newmsg');
        await groupDiscussion.hideTimeStampInDiscussionDetail();
        await takeScreenshotByElement(
            await groupDiscussion.getSystemMessageByIndex(0),
            'TC69679_02_01',
            'TC69679_08_open new messages notification',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessagePanel(0),
            'TC69679_02_02',
            'TC69679_08_open new messages notification',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessageInputBox(),
            'TC69679_02_03',
            'TC69679_08_open new messages notification',
            { tolerance: 0.1 }
        );

        //check email for user2
        await email.openViewInBrowserLink(consts.tc2user2.credentials.username);
        await groupDiscussion.hideTimeStampInDiscussionDetail();
        await takeScreenshotByElement(
            await groupDiscussion.getSystemMessageByIndex(0),
            'TC69679_02_04',
            'open email for msg deletion',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessagePanel(0),
            'TC69679_02_05',
            'open email for msg deletion',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessageInputBox(),
            'TC69679_02_06',
            'open email for msg deletion',
            { tolerance: 0.1 }
        );
        await groupDiscussion.goBackToSummaryPanel();
        await commentsPage.closeCommentsPanel();
    });
});
