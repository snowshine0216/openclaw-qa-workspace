import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import * as consts from '../../../constants/collaborationPrivate.js';

describe('Private Channel_01NewDiscussion', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    let dbUrl = browsers.params.dbUrl;

    // let dossierPage, notification, libraryPage, email, commentsPage, groupDiscussion, collaborationDb;
    let { dossierPage, libraryPage, commentsPage, collaborationDb, notification, groupDiscussion, email } =
        browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    // [TC67152_01] Create discussion with one user
    it('[TC67161_01] Create discussion with one user', async () => {
        await collaborationDb.deleteAllTopics(
            dbUrl,
            consts.privateDossier1.project.id + ':' + consts.privateDossier1.id
        );
        await collaborationDb.deleteAllNotifications(dbUrl, consts.tc1user2.id);
        await email.clearMsgBox();
        await libraryPage.switchUser(consts.tc1user1.credentials);
        await libraryPage.openDossier(consts.privateDossier1.name);
        await groupDiscussion.openCommentsPanel();
        await groupDiscussion.openDiscussionTab();
        await groupDiscussion.createNewDiscussion(
            [consts.tc1user2.credentials.username],
            0,
            consts.groupName1,
            consts.message1,
            { tolerance: 0.1 }
        );
        await groupDiscussion.hideTimeStampInDiscussionDetail();
        await takeScreenshotByElement(
            await groupDiscussion.getSystemMessageByIndex(0),
            'TC67161_01_01',
            'CreateDiscussion with one user',
            { tolerance: 0.1 }
        );
        // replace with sinc
        await takeScreenshotByElement(
            await groupDiscussion.getMessagePanel(0),
            'TC67161_01_02',
            'CreateDiscussion with one user',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessageInputBox(),
            'TC67161_01_03',
            'CreateDiscussion with one user',
            { tolerance: 0.1 }
        );
        await groupDiscussion.goBackToSummaryPanel();
        await commentsPage.closeCommentsPanel();

        await libraryPage.switchUser(consts.tc1user2.credentials);
        await notification.openPanel();
        await since('start discussion notification should appear in notification panel')
            .expect(await notification.getStartDiscussionMsgFromUser(consts.tc1user1.credentials.username).getText())
            .toMatch(consts.tc1user1.credentials.username + ' has started a discussion with you in a dossier.');
        await since('You have 1 new msg notification should appear in notification panel')
            .expect(await notification.getNewMsg().getText())
            .toMatch(consts.newMsgDossierNotification + consts.groupName1 + ' in a dossier.');
        await notification.openMsgFromUser(consts.tc1user1.credentials.username, 'startdiscussion');
        await groupDiscussion.hideTimeStampInDiscussionDetail();
        await takeScreenshotByElement(
            await groupDiscussion.getSystemMessageByIndex(0),
            'TC67161_01_04',
            'Open Discussion',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(await groupDiscussion.getMessagePanel(0), 'TC67161_01_05', 'Open Discussion', {
            tolerance: 0.1,
        });
        await takeScreenshotByElement(await groupDiscussion.getMessageInputBox(), 'TC67161_01_06', 'Open Discussion', {
            tolerance: 0.1,
        });

        await email.openViewInBrowserLink(consts.tc1user2.credentials.username);
        await groupDiscussion.hideTimeStampInDiscussionDetail();
        await takeScreenshotByElement(
            await groupDiscussion.getSystemMessageByIndex(0),
            'TC67161_01_07',
            'open discussion from email',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessagePanel(0),
            'TC67161_01_08',
            'open discussion from email',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessageInputBox(),
            'TC67161_01_09',
            'open discussion from email',
            { tolerance: 0.1 }
        );

        await libraryPage.switchUser(consts.tc1user1.credentials);
        await libraryPage.openDossier(consts.privateDossier1.name);
        await groupDiscussion.openCommentsPanel();
        await groupDiscussion.openDiscussionTab();
        await groupDiscussion.selectExistingDiscussion(consts.tc1user2.credentials.username, 0);
        await groupDiscussion.hideTimeStampInDiscussionDetail();
        await takeScreenshotByElement(
            await groupDiscussion.getSystemMessageByIndex(0),
            'TC67161_01_10',
            'Open Discussion',
            {
                tolerance: 0.1,
            }
        );
        await takeScreenshotByElement(await groupDiscussion.getMessagePanel(0), 'TC67161_01_11', 'Open Discussion', {
            tolerance: 0.1,
        });
        await takeScreenshotByElement(await groupDiscussion.getMessageInputBox(), 'TC67161_01_12', 'Open Discussion', {
            tolerance: 0.1,
        });
        await groupDiscussion.clickDiscussionInfoIcon();
        await groupDiscussion.deleteDisccusion();
        await commentsPage.closeCommentsPanel();

        // check delete notification
        await libraryPage.switchUser(consts.tc1user2.credentials);
        await notification.openPanel();
        await since('You have 1 new msg notification should appear in notification panel')
            .expect(await notification.getNotificationMsgByIndex(0).getText())
            .toMatch(consts.groupName1 + consts.inNewDossiereDeletedNotification);
        await notification.openNotificationWithoutRedirection('0');
        await takeScreenshotByElement(
            await notification.getNotificationMsgByIndex(0),
            'TC67161_01_10',
            'the delete msg should be read.',
            { tolerance: 0.1 }
        );
    });

    // [TC67152_02] Create discussion with group
    it('[TC67161_02] create discussion with group', async () => {
        await collaborationDb.deleteAllTopics(
            dbUrl,
            consts.privateDossier1.project.id + ':' + consts.privateDossier1.id
        );
        await collaborationDb.deleteAllNotifications(dbUrl, consts.groupuser1.id);
        await libraryPage.switchUser(consts.tc1user3.credentials);
        await libraryPage.openDossier(consts.privateDossier1.name);
        await groupDiscussion.openCommentsPanel();
        await groupDiscussion.openDiscussionTab();
        await groupDiscussion.createNewDiscussion([consts.group], 0, '', consts.message2);
        await groupDiscussion.hideTimeStampInDiscussionDetail();
        await takeScreenshotByElement(
            await groupDiscussion.getSystemMessageByIndex(0),
            'TC67161_02_01',
            'CreateDiscussion with one user',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessagePanel(0),
            'TC67161_02_02',
            'CreateDiscussion with one user',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessageInputBox(),
            'TC67161_02_03',
            'CreateDiscussion with one user',
            { tolerance: 0.1 }
        );
        await groupDiscussion.goBackToSummaryPanel();
        await commentsPage.closeCommentsPanel();

        await libraryPage.switchUser(consts.groupuser1.credentials);
        await notification.openPanel();
        await since('invite discussion notification should appear in notification panel')
            .expect(await notification.getInvitedDiscussionMsg().getText())
            .toMatch(consts.invitedNotification + consts.privateDossier1.name + '.');
        await since('You have 1 new msg notification should appear in notification panel')
            .expect(await notification.getNewMsg().getText())
            .toMatch(consts.newMsgNotification + consts.privateDossier1.name + '.');
        await notification.openMsgByOption('invite');
        await groupDiscussion.hideTimeStampInDiscussionDetail();
        await takeScreenshotByElement(
            await groupDiscussion.getSystemMessageByIndex(0),
            'TC67161_02_04',
            'open start discussion msg',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessagePanel(0),
            'TC67161_02_05',
            'open start discussion msg',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessageInputBox(),
            'TC67161_02_06',
            'open start discussion msg',
            { tolerance: 0.1 }
        );

        await email.openViewInBrowserLink(consts.groupuser1.credentials.username);
        await groupDiscussion.hideTimeStampInDiscussionDetail();
        await takeScreenshotByElement(
            await groupDiscussion.getSystemMessageByIndex(0),
            'TC67161_02_07',
            'open start discussion msg from email',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessagePanel(0),
            'TC67161_02_08',
            'open start discussion msg from email',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessageInputBox(),
            'TC67161_02_09',
            'open start discussion msg from email',
            { tolerance: 0.1 }
        );
    });

    //rsd -new discussion
    it('[TC67161_03] test create new discussion in RSD', async () => {
        await collaborationDb.deleteAllTopics(dbUrl, consts.rsdTest.project.id + ':' + consts.rsdTest.id);
        await collaborationDb.deleteAllNotifications(dbUrl, consts.tc1user3.id);
        // new discussion
        await libraryPage.switchUser(consts.tc1user1.credentials);
        await libraryPage.openDossier(consts.rsdTest.name);
        await dossierPage.waitForDossierLoading();
        await groupDiscussion.openCommentsPanel();
        await groupDiscussion.openDiscussionTab();
        await groupDiscussion.createNewDiscussion(
            [consts.tc1user2.credentials.username, consts.tc1user3.credentials.username],
            0,
            'Test for rsd',
            'Test for rsd'
        );
        await commentsPage.addCommentWithUserMention('tag user in rsd', consts.tc1user2.credentials.username);
        await commentsPage.postComment();
        await groupDiscussion.hideTimeStampInDiscussionDetail();
        await takeScreenshotByElement(
            await groupDiscussion.getSystemMessageByIndex(0),
            'TC67161_03_01',
            'create new discussion in RSD',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessagePanel(0),
            'TC67161_03_02',
            'create new discussion in RSD',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessageInputBox(),
            'TC67161_03_03',
            'create new discussion in RSD',
            { tolerance: 0.1 }
        );
        await groupDiscussion.goBackToSummaryPanel();
        await commentsPage.closeCommentsPanel();

        await libraryPage.switchUser(consts.tc1user3.credentials);
        await libraryPage.openDossier(consts.rsdTest.name);
        await dossierPage.waitForDossierLoading();
        await groupDiscussion.openCommentsPanel();
        await groupDiscussion.openDiscussionTab();
        // check unread number
        await since('unread number should show correctly in Discussion tab')
            .expect(await groupDiscussion.getBadgeCounterInDiscussionTab())
            .toBe('2');
        await since('unread number should show correctly in Discussion icon')
            .expect(await groupDiscussion.getBadgeCounnterInDiscussionIcon())
            .toBe('2');
        await dossierPage.goToLibrary();
        await notification.openPanel();
        await since('invite discussion notification should appear in notification panel')
            .expect(await notification.getInvitedDiscussionMsg().getText())
            .toMatch(consts.invitedDossierNotification + 'Test for rsd discussion in ' + consts.rsdTest.name + '.');
        await since('You have 2 new msges notification should appear in notification panel')
            .expect(await notification.getNewMsg().getText())
            .toMatch(consts.newMsgsNotification + 'Test for rsd in ' + consts.rsdTest.name + '.');
        await notification.openMsgByOption('newmsg');
        await groupDiscussion.hideTimeStampInDiscussionDetail();
        await takeScreenshotByElement(
            await groupDiscussion.getSystemMessageByIndex(0),
            'TC67161_03_04',
            'open start discussion msg',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessagePanel(0),
            'TC67161_03_05',
            'open start discussion msg',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessageInputBox(),
            'TC67161_03_06',
            'open start discussion msg',
            { tolerance: 0.1 }
        );

        await email.openViewInBrowserLink(consts.tc1user3.credentials.username);
        await groupDiscussion.hideTimeStampInDiscussionDetail();
        await takeScreenshotByElement(
            await groupDiscussion.getSystemMessageByIndex(0),
            'TC67161_03_07',
            'open start discussion msg from email',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessagePanel(0),
            'TC67161_03_08',
            'open start discussion msg from email',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessageInputBox(),
            'TC67161_03_09',
            'open start discussion msg from email',
            { tolerance: 0.1 }
        );
    });

    // add no member group
    it('[TC67161_04] create discussion with no member group', async () => {
        await libraryPage.switchUser(consts.tc1user4.credentials);
        await libraryPage.openDossier(consts.privateDossier1.name);
        await groupDiscussion.openCommentsPanel();
        await groupDiscussion.openDiscussionTab();
        await groupDiscussion.createNewDiscussion([consts.noMemberGroup], 0, '', 'create with no member group');
        await groupDiscussion.hideTimeStampInDiscussionDetail();
        await takeScreenshotByElement(
            await groupDiscussion.getSystemMessageByIndex(0),
            'TC67161_04_01',
            'create discussion with no member',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessagePanel(0),
            'TC67161_04_02',
            'create discussion with no member',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessageInputBox(),
            'TC67161_04_03',
            'create discussion with no member',
            { tolerance: 0.1 }
        );
        await groupDiscussion.goBackToSummaryPanel();
        await commentsPage.closeCommentsPanel();
    });

    // verify tag user
    it('[TC67161_05] test user search box when create discussion ', async () => {
        await libraryPage.switchUser(consts.tc1user1.credentials);
        await libraryPage.openDossier(consts.privateDossier1.name);
        await groupDiscussion.openCommentsPanel();
        await groupDiscussion.openDiscussionTab();
        await groupDiscussion.clickNewDiscussion();
        await groupDiscussion.typeInGoToSection('@1');
        await takeScreenshotByElement(
            await groupDiscussion.getSuggestionContainerInDiscussion(),
            'TC67161_12',
            'check user suggestion drop down',
            { tolerance: 0.1 }
        );
        await commentsPage.closeCommentsPanel();
    });
});
