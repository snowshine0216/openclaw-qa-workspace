import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import * as consts from '../../../constants/collaborationPrivate.js';

describe('Private Channel_05Mute', () => {
    // let dossierPage, commentsPage, notification, libraryPage, groupDiscussion, collaborationDb;
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    let { dossierPage, commentsPage, notification, libraryPage, groupDiscussion, collaborationDb } = browsers.pageObj1;

    let dbUrl = browsers.params.dbUrl;

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

    // 【TC67166_01] private1 create new discussion and mute it. check the mute icon
    it('[TC67166_01] test mute discussion_icon', async () => {
        await collaborationDb.deleteAllTopics(
            dbUrl,
            consts.privateDossier1.project.id + ':' + consts.privateDossier1.id
        );
        await collaborationDb.deleteAllNotifications(dbUrl, consts.tc5user1.id);
        await collaborationDb.deleteAllNotifications(dbUrl, consts.tc5user2.id);
        await collaborationDb.deleteAllNotifications(dbUrl, consts.tc5user3.id);
        // new discussion
        await libraryPage.switchUser(consts.tc5user1.credentials);
        await libraryPage.openDossier(consts.privateDossier1.name);
        await groupDiscussion.openCommentsPanel();
        await groupDiscussion.openDiscussionTab();
        await groupDiscussion.createNewDiscussion(
            [consts.tc5user2.credentials.username, consts.tc5user3.credentials.username],
            0,
            consts.discussionName3,
            'Test for mute discussion'
        );
        // mute discussion
        await groupDiscussion.clickDiscussionInfoIcon();
        await groupDiscussion.switchMuteNotification();
        await groupDiscussion.goBackToDetailPanel();
        // check mute icon
        await since('mute icon should appear besides discussion title in Detail Panel')
            .expect(await groupDiscussion.getMuteIconInDetailPanel().isDisplayed())
            .toBe(true);
        await groupDiscussion.goBackToSummaryPanel();
        await since('mute icon should appear besides discussion title in Summary Panel')
            .expect(await groupDiscussion.getMuteIconInSummaryPanel().isDisplayed())
            .toBe(true);
        await commentsPage.closeCommentsPanel();

        // mute discussion
        await libraryPage.switchUser(consts.tc5user3.credentials);
        await libraryPage.openDossier(consts.privateDossier1.name);
        await groupDiscussion.openCommentsPanel();
        await groupDiscussion.openDiscussionTab();
        await groupDiscussion.enterExistingDiscussion(0);
        // mute discussion
        await groupDiscussion.clickDiscussionInfoIcon();
        await groupDiscussion.switchMuteNotification();
        await groupDiscussion.goBackToDetailPanel();
        await groupDiscussion.goBackToSummaryPanel();

        // test mute discussion_post msg
        await libraryPage.switchUser(consts.tc5user2.credentials);
        await libraryPage.openDossier(consts.privateDossier1.name);
        await groupDiscussion.openCommentsPanel();
        await groupDiscussion.openDiscussionTab();
        await groupDiscussion.enterExistingDiscussion(0);
        // post 2 msg, 1 not mention and 1 mention for private1
        await commentsPage.addCommentWithUserMention(
            '01mute notification post with tagginng user',
            consts.tc5user1.credentials.username
        );
        await commentsPage.postComment();
        await commentsPage.sleep(1000);
        await commentsPage.addComment('02mutenotification not tag user');
        await commentsPage.postComment();
        await commentsPage.sleep(1000);
        //post 2 mentions for private4
        await commentsPage.addCommentWithUserMention(
            '03mute notification post with tagging user',
            consts.tc5user3.credentials.username
        );
        await commentsPage.postComment();
        await commentsPage.sleep(1000);
        await commentsPage.addCommentWithUserMention(
            '04mute notification post with tagging user',
            consts.tc5user3.credentials.username
        );
        await commentsPage.postComment();
        await commentsPage.sleep(1000);
        await groupDiscussion.goBackToSummaryPanel();
        await commentsPage.closeCommentsPanel();

        // test mute discussion_check notification for merged mentions
        await libraryPage.switchUser(consts.tc5user3.credentials);
        await libraryPage.openDossier(consts.privateDossier1.name);
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
        await since('mentioned msg should appear in notification panel')
            .expect(await notification.getNewMsg().getText())
            .toMatch(
                consts.new2MentionsNotification + consts.discussionName3 + ' in ' + consts.privateDossier1.name + '.'
            );
        await notification.openMsgByOption('newmsg');
        await groupDiscussion.hideTimeStampInDiscussionDetail();
        await takeScreenshotByElement(
            await groupDiscussion.getSystemMessageByIndex(0),
            'TC67166_01_01',
            'open from notification',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessagePanel(0),
            'TC67166_01_02',
            'open from notification',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessageInputBox(),
            'TC67166_01_03',
            'open from notification',
            { tolerance: 0.1 }
        );

        // test mute discussion_check notification for unmerged metnion
        await libraryPage.switchUser(consts.tc5user1.credentials);
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
        await dossierPage.goToLibrary();
        await notification.openPanel();
        await since('Mentioned notification should appear in notification panel')
            .expect(await notification.getFirstMentionMsgFromUser(consts.tc5user2.credentials.username).getText())
            .toMatch(
                consts.tc5user2.credentials.username +
                    ' mentioned you in Test for mute discussion in ' +
                    consts.privateDossier1.name +
                    '.'
            );
        await notification.openMsgFromUser(consts.tc5user2.credentials.username, 'mention');
        await groupDiscussion.hideTimeStampInDiscussionDetail();
        await takeScreenshotByElement(
            await groupDiscussion.getSystemMessageByIndex(0),
            'TC67166_01_04',
            'open from notification',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessagePanel(0),
            'TC69679_01_05',
            'open from notification',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessageInputBox(),
            'TC69679_01_06',
            'open from notification',
            { tolerance: 0.1 }
        );
    });
});
