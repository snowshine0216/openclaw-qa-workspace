import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import * as consts from '../../../constants/collaborationPrivate.js';

describe('Private Channel_04ManageDiscussion', () => {
    // let commentsPage, notification, libraryPage, groupDiscussion, collaborationDb;
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    let { commentsPage, notification, libraryPage, groupDiscussion, collaborationDb } = browsers.pageObj1;

    let dbUrl = browsers.params.dbUrl;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    // [TC67167_01] remove user - groupuser1
    it('[TC67167_01] remove user in 2 user discussion', async () => {
        await collaborationDb.deleteAllTopics(
            dbUrl,
            consts.privateDossier1.project.id + ':' + consts.privateDossier1.id
        );
        await collaborationDb.deleteAllNotifications(dbUrl, consts.tc4user2.id);
        await collaborationDb.deleteAllNotifications(dbUrl, consts.tc4user7.id);
        // Add - new discussion with private3
        await libraryPage.switchUser(consts.tc4user1.credentials);
        await libraryPage.openDossier(consts.privateDossier1.name);
        await groupDiscussion.openCommentsPanel();
        await groupDiscussion.openDiscussionTab();
        await groupDiscussion.createNewDiscussion(
            [consts.tc4user2.credentials.username],
            0,
            consts.groupName2,
            consts.message7
        );
        await groupDiscussion.clickDiscussionInfoIcon();
        await groupDiscussion.removeUser(0);
        await since('Remove user should be successful.')
            .expect(await groupDiscussion.isUserExisted(consts.tc4user2.credentials.username, 0))
            .toBe(false);
        // go back check system msg
        await groupDiscussion.goBackToDetailPanel();
        console.log(await groupDiscussion.getSystemMessageByIndex(0).getText());
        await since('Remove user sys msg should be displayed.')
            .expect(await groupDiscussion.getSystemMessageByIndex(0).getText())
            .toBe(consts.tc4user2.credentials.username + consts.removedHistoryMsg);
        await groupDiscussion.goBackToSummaryPanel();
        await commentsPage.closeCommentsPanel();

        // check remove notification and discussion list
        await libraryPage.switchUser(consts.tc4user2.credentials);
        await notification.openPanel();
        await since('Removed notification should appear in notification panel')
            .expect(await notification.getRemovedMsg().getText())
            .toMatch('You have been removed from ' + consts.groupName2 + ' in ' + consts.privateDossier1.name + '.');
        await notification.openNotificationWithoutRedirection(0);
        await notification.openNotificationWithoutRedirection(1);
        await notification.openNotificationWithoutRedirection(2);
        //recheck
        await notification.hideNotificationTimeStamp();
        await takeScreenshotByElement(
            await notification.getPanelMainContent(),
            'TC67167_02',
            'notification msg should be read.',
            { tolerance: 0.1 }
        );
        await notification.closePanel();

        await libraryPage.openDossier(consts.privateDossier1.name);
        await groupDiscussion.openCommentsPanel();
        await groupDiscussion.openDiscussionTab();
        await since('Discussion should disappear for removed user')
            .expect(await groupDiscussion.isDiscussionExisted())
            .toBe(false);

        //[TC67169_01] leave discussion for only one user
        await libraryPage.switchUser(consts.tc4user1.credentials);
        await libraryPage.openDossier(consts.privateDossier1.name);
        await groupDiscussion.enterAboutPanel(0);
        await groupDiscussion.leaveDiscussion();
        // the last user left the discussion, the discussion is gone and user is redirected to discussion list panel
        await since('Discussion should disappear for left user')
            .expect(await groupDiscussion.isDiscussionExisted())
            .toBe(false);
    });

    // [TC67167_02] leave discussion, 2nd user becomes owner
    it('[TC67167_02] leave discussion, 2nd user becomes owner', async () => {
        // new discussion
        await libraryPage.switchUser(consts.tc4user3.credentials);
        await libraryPage.openDossier(consts.privateDossier1.name);
        await groupDiscussion.openCommentsPanel();
        await groupDiscussion.openDiscussionTab();
        await groupDiscussion.createNewDiscussion(
            [consts.tc4user7.credentials.username, consts.tc4user4.credentials.username],
            0,
            'Test for leave discussion',
            'Test for leave discussion'
        );
        await groupDiscussion.clickDiscussionInfoIcon();
        await groupDiscussion.leaveDiscussion();
        await since('Discussion should disappear for left user')
            .expect(await groupDiscussion.isDiscussionExisted())
            .toBe(false);

        // leave discussion - login as web1 to check system msg about leaving discussion showsup and whether he becomes owner
        await libraryPage.switchUser(consts.tc4user7.credentials);
        await notification.openPanel();
        // since the discussion becomes 2 people, the notification is updated to *new owner* starat a discussion with you
        await since('start discussion notification should appear in notification panel')
            .expect(await notification.getStartDiscussionMsgFromUser(consts.tc4user7.credentials.username).getText())
            .toMatch(
                consts.tc4user7.credentials.username +
                    ' has started a discussion with you in ' +
                    consts.privateDossier1.name
            );
        await notification.openMsgFromUser(consts.tc4user7.credentials.username, 'startdiscussion');
        await since('User leave discusion msg should appear.')
            .expect(await groupDiscussion.getSystemMessageByIndex(0).getText())
            .toBe(consts.tc4user3.credentials.username + ' has left this discussion.');
        await groupDiscussion.clickDiscussionInfoIcon();
        await since('owner leaves a discussion, 2nd user becomes owner')
            .expect(await (await groupDiscussion.getInvitePeopleButton()).isDisplayed())
            .toBe(true);
        // only ownner can delete discussion
        await groupDiscussion.deleteDisccusion();
    });

    // [TC67152] rename discussion
    it('[TC67152] rename discussion', async () => {
        await collaborationDb.deleteAllTopics(
            dbUrl,
            consts.privateDossier1.project.id + ':' + consts.privateDossier1.id
        );
        //new discussion rename
        await libraryPage.switchUser(consts.tc4user5.credentials);
        await libraryPage.openDossier(consts.privateDossier1.name);
        await groupDiscussion.openCommentsPanel();
        await groupDiscussion.openDiscussionTab();
        await groupDiscussion.createNewDiscussion([consts.tc4group], 0, '', 'Test for rename');
        await groupDiscussion.clickDiscussionInfoIcon();
        await groupDiscussion.renameDiscussion(consts.renameDiscussion);
        await groupDiscussion.goBackToDetailPanel();
        await since('Change Discussion Name History msg should display.')
            .expect(await groupDiscussion.getSystemMessageByIndex(0).getText())
            .toBe(
                consts.tc4user5.credentials.username +
                    ' has changed the discussion name to ' +
                    consts.renameDiscussion +
                    '.'
            );
    });

    // [TC67171] view member
    it('[TC67171] view member', async () => {
        await collaborationDb.deleteAllTopics(
            dbUrl,
            consts.privateDossier1.project.id + ':' + consts.privateDossier1.id
        );
        // new discussion - view member
        await libraryPage.switchUser(consts.tc4user6.credentials);
        await libraryPage.openDossier(consts.privateDossier1.name);
        await groupDiscussion.openCommentsPanel();
        await groupDiscussion.openDiscussionTab();
        await groupDiscussion.createNewDiscussion(
            [consts.groupManage],
            0,
            'Test for view member',
            'Test for viewmember'
        );
        await groupDiscussion.viewMember();
        await takeScreenshotByElement(
            await groupDiscussion.getDiscussionAboutPanel(),
            'TC67152_11',
            '01_ViewMember_ByDefault is expanded',
            { tolerance: 0.1 }
        );
        await groupDiscussion.collapseExpandMember();
        await takeScreenshotByElement(
            await groupDiscussion.getDiscussionAboutPanel(),
            'TC67152_11',
            '02_ViewMember_it will be collapsed',
            { tolerance: 0.1 }
        );
        await groupDiscussion.goBackToDetailPanel();
        await groupDiscussion.goBackToSummaryPanel();
        await commentsPage.closeCommentsPanel();
    });
});
