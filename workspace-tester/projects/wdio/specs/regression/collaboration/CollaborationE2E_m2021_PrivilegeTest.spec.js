import setWindowSize from '../../../config/setWindowSize.js';
import * as consts from '../../../constants/collaborationPrivate.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('E2E for Collab Privilege Check', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    let {
        loginPage,
        dossierPage,
        libraryPage,
        commentsPage,
        collaborationDb,
        notification,
        groupDiscussion,
        email,
        onboardingTutorial,
    } = browsers.pageObj1;

    const dossier = {
        id: 'BDD72BE311EAA41CD7700080EFD5E527',
        name: 'Visual Vocabulary',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossier_pa = {
        id: 'DFDBFAF89E4F684E32AA879378B84161',
        name: 'PA analysis',
        project: {
            id: '61ABA574CA453CCCF398879AFE2E825F',
            name: 'Platform Analytics',
        },
    };

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

    // [TC20908_01] check guest user's privilege:
    //  1. Notification center: It will always be empty and Clear All will always be disabled.
    //  2. Post Comment:  User won't be able to post comments hence the post button will be disabled.
    //  3. Add new button: User won't be able to create private discussion so that add new button will be disabled.
    it('[TC20908_01] test guest login', async () => {
        // const url = await generateViewDossierLink(consts.privateDossier1);
        // check notification panel
        await loginPage.loginAsGuest();
        await libraryPage.waitForLibraryLoading();
        await onboardingTutorial.clickIntroToLibrarySkip();
        await notification.openPanel();
        await since('notification panel empty message is expected to be #{expected}, instead we have #{actual}}')
            .expect(await notification.getEmptyTxt())
            .toBe(consts.emptyNotificationTxt);
        await since('disabled clear all button shows up is expected to be #{expected}, instead we have #{actual}}')
            .expect(await notification.getClearAllStatus())
            .toBe(true);
        await notification.closePanel();
        // check post button in comment tab
        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();
        await groupDiscussion.openCommentsPanel();
        await commentsPage.getCommentBox().click();
        await since('add comment box enabled is expected to be #{expected}, instead we have #{actual}}')
            .expect(await commentsPage.getEditableInputBox().isDisplayed())
            .toBe(false);
        // check add new button for Private discussion
        await groupDiscussion.openDiscussionTab();
        // to do - verify add new button is disabled
        await commentsPage.closeCommentsPanel();
    });

    // [TC20908_02] test user with no collab privilege:
    // user with no collab privilege will NOT see notification icon and collaboration icon.
    // user with no collab privilege cllicks on the email notification would receive error message
    it('[TC20908_02] test user with no collab privilege', async () => {
        await collaborationDb.deleteAllTopics(dbUrl, dossier.project.id + ':' + dossier.id);
        await collaborationDb.deleteAllComments(dbUrl, dossier.project.id + ':' + dossier.id);
        await collaborationDb.deleteAllNotifications(dbUrl, consts.partaccess.id);
        await email.clearMsgBox();
        await loginPage.login(consts.test100.credentials);
        await libraryPage.openDossier(dossier.name);
        await commentsPage.openCommentsPanel();
        await commentsPage.addCommentWithUserMention(consts.message9, consts.nocollab.credentials.username);
        await commentsPage.postComment();
        await commentsPage.closeCommentsPanel();
        await dossierPage.goToLibrary();

        await browser.url(new URL('auth/ui/loginPage', browser.options.baseUrl).toString(), 100000);
        await loginPage.login(consts.nocollab.credentials);
        // await libraryPage.switchUser(consts.nocollab.credentials);
        await since(
            'notification icon shows up for user without collab privilege is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await notification.getNotificationIcon().isDisplayed())
            .toBe(false);
        await libraryPage.openDossier(dossier.name);
        await since('collaboration panel should not be shown for user without collab privilege')
            .expect(await commentsPage.getCommentsIcon().isDisplayed())
            .toBe(false);

        await email.openViewInBrowserLink(consts.nocollab.credentials.fullname);
        await since('After open link, error message is expected to be #{expected}, instead we have #{actual}}')
            .expect(await commentsPage.getErrorMsg())
            .toBe('You do not have the collaboration privilege to access these comments.');
        await commentsPage.clickErrorButton('OK');
    });

    // [TC20908_03] test user with part project collab privilege"
    // 1. user should see notification icon
    // 2. user should only receive the notification from collab enabled project
    // 3. user should only see collaboration panel for dossier in collab enabled project
    // 4. user should do all the collab manipulation for dossier in collab enabled project
    it('[TC20908_03] test user with part project collab privilege', async () => {
        await collaborationDb.deleteAllTopics(dbUrl, dossier.project.id + ':' + dossier.id);
        await collaborationDb.deleteAllComments(dbUrl, dossier.project.id + ':' + dossier.id);
        await collaborationDb.deleteAllComments(dbUrl, dossier_pa.project.id + ':' + dossier_pa.id);
        await collaborationDb.deleteAllNotifications(dbUrl, consts.partaccess.id);
        await email.clearMsgBox();
        // post msg check notification
        await loginPage.login(consts.test100.credentials);
        await libraryPage.openDossier(dossier_pa.name);
        await commentsPage.openCommentsPanel();
        await commentsPage.addCommentWithUserMention(consts.message9, consts.partaccess.credentials.username);
        await commentsPage.postComment();
        await commentsPage.closeCommentsPanel();
        await dossierPage.goToLibrary();

        await libraryPage.openDossier(dossier.name);
        await commentsPage.openCommentsPanel();
        await commentsPage.addCommentWithUserMention(consts.message9, consts.partaccess.credentials.username);
        await commentsPage.postComment();
        await commentsPage.closeCommentsPanel();
        await dossierPage.goToLibrary();

        await libraryPage.switchUser(consts.partaccess.credentials);
        await since(
            'notification panel shows up for user with part project collab privilege is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await notification.getNotificationIcon().isDisplayed())
            .toBe(true);
        await notification.openPanel();
        // await notification.mentionMsgFromUserCount(consts.test100.credentials.username);
        // await since(
        //     'partaccess user should only receive #{expected} notification from project has collab privilege, instead we have #{actual} notification'
        // )
        //     .expect(await notification.mentionMsgFromUserCount(consts.test100.credentials.username))
        //     .toBe(1);
        // // console.log(await notification.mentionMsgFromUserCount(consts.test100.credentials.username));
        await notification.hideNotificationTimeStamp();
        await takeScreenshotByElement(
            await notification.getPanelMainContent(),
            'TC20908_03',
            'partaccess user notification'
        );
        await notification.openMsgByIndex(0);
        await since(
            ' #{expected} should be displayed in comment after click on tag notification, instead we have #{actual} displayed'
        )
            .expect(await commentsPage.comment(0))
            .toContain('@' + consts.partaccess.credentials.username);
        await since('#{expected} dossier should be displayed, instead we have #{actual} dossier displayed')
            .expect(await dossierPage.getTxtTitle_Dossier())
            .toBe(dossier.name);
        console.log(await dossierPage.getTxtTitle_Dossier());
        await dossierPage.goToLibrary();

        await libraryPage.openDossier(dossier_pa.name);
        await since(
            'collaboration icon showsup for user with no collab privilege to the project is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await commentsPage.getCommentsIcon().isDisplayed())
            .toBe(false);
        await dossierPage.goToLibrary();

        // post public comments for dossier in MicroStrategy Tutorial Project
        await libraryPage.openDossier(dossier.name);
        await since(
            'collaboration panel shows up for user with collab privilege to the project is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await commentsPage.getCommentsIcon().isDisplayed())
            .toBe(true);
        await commentsPage.openCommentsPanel();
        await commentsPage.addCommentWithUserMention(consts.message9, consts.partaccess.credentials.username);
        await commentsPage.postComment();
        await since('#{expected} should be displayed in comment, instead we have #{actual} displayed')
            .expect(await commentsPage.comment(0))
            .toBe('@' + consts.partaccess.credentials.username + ' ' + consts.message9);
        console.log(await commentsPage.comment(0));
        console.log('@' + consts.partaccess.credentials.username + ' ' + consts.message9);

        // create private discussion and invite user
        await groupDiscussion.openDiscussionTab();
        await groupDiscussion.createNewDiscussion(
            [consts.tc1user2.credentials.username],
            0,
            consts.groupName1,
            consts.message1
        );
        await groupDiscussion.hideTimeStampInDiscussionDetail();
        await takeScreenshotByElement(
            await groupDiscussion.getSystemMessageByIndex(0),
            'TC20908_03_01',
            'post msg after invitation from about panel',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessagePanel(0),
            'TC20908_03_02',
            'post msg after invitation from about panel',
            { tolerance: 0.1 }
        );
        await takeScreenshotByElement(
            await groupDiscussion.getMessageInputBox(),
            'TC20908_03_03',
            'post msg after invitation from about panel',
            { tolerance: 0.1 }
        );
        await groupDiscussion.clickDiscussionInfoIcon();
        await groupDiscussion.renameDiscussion(consts.renameDiscussion);
        await groupDiscussion.invitePeopleByName(consts.tc3user3.credentials.username);
        await since('#{expected} should be displayed in comment, instead we have #{actual} displayed')
            .expect(await groupDiscussion.getLastMemberLoginNameInAboutPanel())
            .toBe(consts.tc3user3.credentials.username);
        await groupDiscussion.goBackToDetailPanel();
        await since('#{expected} should be displayed in comment, instead we have #{actual} displayed')
            .expect(await groupDiscussion.getSystemMessageByIndex(0).getText())
            .toBe(consts.tc3user3.credentials.username + consts.addedHistoryMsg);
        await groupDiscussion.goBackToSummaryPanel();
        await commentsPage.closeCommentsPanel();
    });

    // [TC20908_04] check email for part access
    it('[TC20908_04] check email for part access ', async () => {
        await loginPage.login(consts.partaccess.credentials);
        await email.openViewInBrowserLink(consts.partaccess.credentials.username);
        await since('After open link, it should bring you to the comment panel with dossier opened.')
            .expect(await commentsPage.comment(0))
            .toBe('@' + consts.partaccess.credentials.username + ' ' + consts.message9);
    });

    // [TC20908_05] check group discussion for part access user  in HM project
    it('[TC20908_05] check group discussion for part access user in HM project', async () => {
        await collaborationDb.deleteAllTopics(dbUrl, dossier.project.id + ':' + dossier.id);
        await collaborationDb.deleteAllTopics(dbUrl, dossier_pa.project.id + ':' + dossier_pa.id);
        await collaborationDb.deleteAllComments(dbUrl, dossier.project.id + ':' + dossier.id);
        await collaborationDb.deleteAllComments(dbUrl, dossier_pa.project.id + ':' + dossier_pa.id);
        await collaborationDb.deleteAllNotifications(dbUrl, consts.partaccess.id);
        // await email.clearMsgBox();

        // create discussion with part access user on dossier in HM project
        await loginPage.login(consts.test100.credentials);
        await libraryPage.openDossier(dossier_pa.name);
        await commentsPage.openCommentsPanel();
        await groupDiscussion.openDiscussionTab();
        await groupDiscussion.createNewDiscussion(
            [consts.partaccess.credentials.username],
            0,
            consts.groupName1,
            consts.message1
        );
        await groupDiscussion.goBackToSummaryPanel();
        await commentsPage.closeCommentsPanel();
        await dossierPage.goToLibrary();
        // login to check notification
        await libraryPage.switchUser(consts.partaccess.credentials);
        await notification.openPanel();
        // await since(
        //     'partaccess user should receive #{expected} notification from PA project instead we have #{actual} notification'
        // )
        //     .expect(await notification.inviteMsgFromUserCount(consts.test100.credentials.username))
        //     .toBe(0);
        await notification.hideNotificationTimeStamp();
        await takeScreenshotByElement(
            await notification.getPanelMainContent(),
            'TC20908_05',
            'partaccess user notification from PA project'
        );
    });

    // create discussion with part access user on dossier in Tutorial project
    it('[TC20908_06] check group discussion for part access user', async () => {
        await collaborationDb.deleteAllNotifications(dbUrl, consts.partaccess.id);
        await libraryPage.switchUser(consts.test100.credentials);
        await libraryPage.openDossier(dossier.name);
        await commentsPage.openCommentsPanel();
        await groupDiscussion.openDiscussionTab();
        await groupDiscussion.createNewDiscussion(
            [consts.partaccess.credentials.username],
            0,
            consts.groupName1,
            consts.message1
        );
        await groupDiscussion.goBackToSummaryPanel();
        await commentsPage.closeCommentsPanel();
        await dossierPage.goToLibrary();
        // login to check notification
        await libraryPage.switchUser(consts.partaccess.credentials);
        await notification.openPanel();
        await since(
            'partaccess user could receive #{expected} notification from MicroStrategy Tutorial Project instead we have #{actual} notification'
        )
            .expect(await notification.notificationMsgCount())
            .toBe(2);
        await notification.openMsgByIndex(0);
        // since('open mentioned notification should be successfull')
        //     .expect(await commentsPage.comment(0)).toContain('@' + consts.partaccess.credentials.username);

        await since('#{expected} dossier should be opened instead we have #{actual} dossier opened')
            .expect(await dossierPage.getTxtTitle_Dossier())
            .toBe(dossier.name);
        console.log(await dossierPage.getTxtTitle_Dossier());
        await dossierPage.goToLibrary();
    });
});
