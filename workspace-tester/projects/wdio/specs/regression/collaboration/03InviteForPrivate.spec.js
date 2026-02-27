import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import * as consts from '../../../constants/collaborationPrivate.js';

describe('Private Channel_03InviteUser', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    // let dossierPage, notification, libraryPage, email, commentsPage, groupDiscussion, collaborationDb;
    let { libraryPage, commentsPage, collaborationDb, notification, groupDiscussion, email } = browsers.pageObj1;

    let dbUrl = browsers.params.dbUrl;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    //[TC6764_01] invite user in about panel
    it('[TC67164_01] invite user in about panel', async () => {
        await collaborationDb.deleteAllTopics(
            dbUrl,
            consts.privateDossier1.project.id + ':' + consts.privateDossier1.id
        );
        await collaborationDb.deleteAllNotifications(dbUrl, consts.tc3user3.id);
        await email.clearMsgBox();
        // new discussion --- with private3
        await libraryPage.switchUser(consts.tc3user1.credentials);
        await libraryPage.openDossier(consts.privateDossier1.name);
        await groupDiscussion.openCommentsPanel();
        await groupDiscussion.openDiscussionTab();
        await groupDiscussion.createNewDiscussion(
            [consts.tc3user2.credentials.username],
            0,
            consts.discussionName1,
            consts.message8
        );
        await groupDiscussion.clickDiscussionInfoIcon();
        await groupDiscussion.invitePeopleByName(consts.tc3user3.credentials.username);
        await since('User should be successfully invited.')
            .expect(await groupDiscussion.getLastMemberLoginNameInAboutPanel())
            .toBe(consts.tc3user3.credentials.username);
        // go back check system msg
        await groupDiscussion.goBackToDetailPanel();
        await since('Invite user sys msg should be displayed.')
            .expect(await groupDiscussion.getSystemMessageByIndex(0).getText())
            .toBe(consts.tc3user3.credentials.username + consts.addedHistoryMsg);
        await groupDiscussion.goBackToSummaryPanel();
        await commentsPage.closeCommentsPanel();

        // check notification for invitaion
        await libraryPage.switchUser(consts.tc3user3.credentials);
        await notification.openPanel();
        await since('Invited notification should appear in notification panel')
            .expect(await notification.getInvitedDiscussionMsg().getText())
            .toMatch(
                consts.invitedDossierNotification +
                    consts.discussionName1 +
                    ' discussion in ' +
                    consts.privateDossier1.name +
                    '.'
            );
        await notification.openMsgByOption('invite');
        await groupDiscussion.hideTimeStampInDiscussionDetail();
        await takeScreenshotByElement(
            await groupDiscussion.getSystemMessageByIndex(0),
            'TC67164_01_01',
            'NotificationPanel - check notification in Panel',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessagePanel(0),
            'TC67164_01_02',
            'NotificationPanel - check notification in Panel',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessageInputBox(),
            'TC67164_01_03',
            'NotificationPanel - check notification in Panel',
            { tolerance: 0.1 }
        );
        //post msg
        await commentsPage.addComment(consts.message6);
        await commentsPage.postComment();
        await groupDiscussion.hideTimeStampInDiscussionDetail();
        await takeScreenshotByElement(
            await groupDiscussion.getSystemMessageByIndex(0),
            'TC67164_01_04',
            'post msg after invitation from about panel',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessagePanel(0),
            'TC67164_01_05',
            'post msg after invitation from about panel',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessageInputBox(),
            'TC67164_01_06',
            'post msg after invitation from about panel',
            { tolerance: 0.1 }
        );
        await groupDiscussion.goBackToSummaryPanel();
        await commentsPage.closeCommentsPanel();

        // check email
        await email.openViewInBrowserLink(consts.tc3user3.credentials.username);
        await groupDiscussion.hideTimeStampInDiscussionDetail();
        await takeScreenshotByElement(
            await groupDiscussion.getSystemMessageByIndex(0),
            'TC67164_01_07',
            'Check email with one user invitation',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessagePanel(0),
            'TC67164_01_08',
            'Check email with one user invitation',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessageInputBox(),
            'TC67164_01_09',
            'Check email with one user invitation',
            { tolerance: 0.1 }
        );
    });

    // invite users in discussion detail panenl
    it('[TC67164_02] invite users in discussion detail panenl', async () => {
        await collaborationDb.deleteAllTopics(
            dbUrl,
            consts.privateDossier1.project.id + ':' + consts.privateDossier1.id
        );
        await collaborationDb.deleteAllNotifications(dbUrl, consts.tc3user2.id);
        // new discussio with private3, invite private2
        await libraryPage.switchUser(consts.tc3user4.credentials);
        await libraryPage.openDossier(consts.privateDossier1.name);
        await groupDiscussion.openCommentsPanel();
        await groupDiscussion.openDiscussionTab();
        await groupDiscussion.createNewDiscussion(
            [consts.tc3user3.credentials.username],
            0,
            consts.discussionName2,
            'Test for invite user in detail panel'
        );
        await commentsPage.addCommentWithUserMention(consts.message5, consts.tc3user2.credentials.username);
        await commentsPage.postComment();
        await takeScreenshotByElement(
            await groupDiscussion.getSystemMessageByIndex(0),
            'TC67164_02_01',
            'invite user confirm msg in detail panel',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessagePanel(0),
            'TC67164_02_02',
            'invite user confirm msg in detail panel',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessageInputBox(),
            'TC67164_02_03',
            'invite user confirm msg in detail panel',
            { tolerance: 0.1 }
        );
        await groupDiscussion.clickHistoryInviteButton();
        await takeScreenshotByElement(
            await groupDiscussion.getSystemMessageByIndex(0),
            'TC67164_02_04',
            'user is invited msg should apppear.',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessagePanel(0),
            'TC67164_02_05',
            'user is invited msg should apppear.',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessageInputBox(),
            'TC67164_02_06',
            'user is invited msg should apppear.',
            { tolerance: 0.1 }
        );
        await groupDiscussion.goBackToSummaryPanel();
        await commentsPage.closeCommentsPanel();

        // [TC67164_05] check notification
        await libraryPage.switchUser(consts.tc3user2.credentials);
        await notification.openPanel();
        await since('Invited notification should appear in notification panel')
            .expect(await notification.getInvitedDiscussionMsg().getText())
            .toMatch(consts.invitedDossierNotification + consts.discussionName2 + ' discussion in a dossier');
        console.log(await notification.getInvitedDiscussionMsg().getText());
        await notification.openMsgByOption('invite'); //defects
        await groupDiscussion.hideTimeStampInDiscussionDetail();
        await takeScreenshotByElement(
            await groupDiscussion.getSystemMessageByIndex(0),
            'TC67164_02_07',
            'system message in group discussion',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessagePanel(0),
            'TC67164_02_08',
            'message panel in group discussion',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessageInputBox(),
            'TC67164_02_09',
            'message input box in group discussion',
            { tolerance: 0.1 }
        );
        //post msg
        await commentsPage.addComment(consts.message6);
        await commentsPage.postComment();
        //add check
        await groupDiscussion.hideTimeStampInDiscussionDetail();
        await takeScreenshotByElement(
            await groupDiscussion.getSystemMessageByIndex(0),
            'TC67164_02_10',
            'post msg after invitation from detail panel',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessagePanel(0),
            'TC67164_02_11',
            'post msg after invitation from detail panel',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessageInputBox(),
            'TC67164_02_12',
            'post msg after invitation from detail panel',
            { tolerance: 0.1 }
        );
        await groupDiscussion.goBackToSummaryPanel();
        await commentsPage.closeCommentsPanel();

        // check email for invitation
        await email.openViewInBrowserLink(consts.tc3user2.credentials.username);
        await groupDiscussion.hideTimeStampInDiscussionDetail();
        await takeScreenshotByElement(
            await groupDiscussion.getSystemMessageByIndex(0),
            'TC67164_02_13',
            'Check email with one user invitation',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessagePanel(0),
            'TC67164_02_14',
            'Check email with one user invitation',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessageInputBox(),
            'TC67164_02_15',
            'Check email with one user invitation',
            { tolerance: 0.1 }
        );
    });

    // re-invite users
    it('[TC67164_03] reinvite user in about panel', async () => {
        await collaborationDb.deleteAllTopics(
            dbUrl,
            consts.privateDossier1.project.id + ':' + consts.privateDossier1.id
        );
        // new discussion --- with private3
        await libraryPage.switchUser(consts.tc3user1.credentials);
        await libraryPage.openDossier(consts.privateDossier1.name);
        await groupDiscussion.openCommentsPanel();
        await groupDiscussion.openDiscussionTab();
        await groupDiscussion.createNewDiscussion(
            [consts.tc3user2.credentials.username, consts.tc3user3.credentials.username],
            0,
            consts.discussionName1,
            consts.message8
        );
        await groupDiscussion.clickDiscussionInfoIcon();
        await groupDiscussion.removeUser(1);
        await groupDiscussion.invitePeopleByName(consts.tc3user3.credentials.username);
        await groupDiscussion.goBackToDetailPanel();
        await groupDiscussion.goBackToSummaryPanel();
        await commentsPage.closeCommentsPanel();

        await libraryPage.switchUser(consts.tc3user3.credentials);
        await libraryPage.openDossier(consts.privateDossier1.name);
        await groupDiscussion.openCommentsPanel();
        await groupDiscussion.openDiscussionTab();
        await groupDiscussion.enterExistingDiscussion(0);
        await commentsPage.addComment(consts.message6);
        await commentsPage.postComment();
        await groupDiscussion.hideTimeStampInDiscussionDetail();
        await takeScreenshotByElement(
            await groupDiscussion.getSystemMessageByIndex(0),
            'TC67164_03_01',
            'post msg after invitation from about panel',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessagePanel(0),
            'TC67164_03_02',
            'post msg after invitation from about panel',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessageInputBox(),
            'TC67164_03_03',
            'post msg after invitation from about panel',
            { tolerance: 0.1 }
        );
        await groupDiscussion.goBackToSummaryPanel();
        await commentsPage.closeCommentsPanel();
    });

    // check user suggestion list when invite user
    it('[TC67164_04] invite user in about panel', async () => {
        await collaborationDb.deleteAllTopics(
            dbUrl,
            consts.privateDossier1.project.id + ':' + consts.privateDossier1.id
        );
        await collaborationDb.deleteAllNotifications(dbUrl, consts.tc3user3.id);
        await email.clearMsgBox();
        // new discussion --- with private3
        await libraryPage.switchUser(consts.tc3user1.credentials);
        await libraryPage.openDossier(consts.privateDossier1.name);
        await groupDiscussion.openCommentsPanel();
        await groupDiscussion.openDiscussionTab();
        await groupDiscussion.createNewDiscussion(
            [consts.tc3user2.credentials.username],
            0,
            consts.discussionName1,
            consts.message8
        );
        await groupDiscussion.clickDiscussionInfoIcon();
        await groupDiscussion.inputInInvite('1');
        await takeScreenshotByElement(
            await groupDiscussion.getSuggestionContainerInDiscussion(),
            'TC67164_04_01',
            'check user suggestion in about panel',
            { tolerance: 0.1 }
        );
        await (await groupDiscussion.getInvitePeopleInput()).setValue('');
        await groupDiscussion.cancelInvite();
        await groupDiscussion.goBackToDetailPanel();
        await commentsPage.addComment_test('@');
        await takeScreenshotByElement(
            await groupDiscussion.getSungestionInDetail(),
            'TC67164_04_02',
            'check user suggestionin discussion detail',
            { tolerance: 0.1 }
        );
    });
});
