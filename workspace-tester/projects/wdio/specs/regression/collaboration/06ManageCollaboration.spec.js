import setWindowSize from '../../../config/setWindowSize.js';

describe('Manage Collaboration Feature Test', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    const collab1 = {
        credentials: {
            username: 'collab1',
            password: '',
        },
    };

    const dossierName = 'Empty Dossier';

    let { collabAdminPage, libraryPage, dossierPage, notification, commentsPage, groupDiscussion, loginPage } =
        browsers.pageObj1;

    beforeAll(async () => {
        await collabAdminPage.openCollabAdminPage();
        await setWindowSize(browserWindow);
    });

    afterAll(async () => {
        await libraryPage.openDefaultApp();
    });

    // beforeEach(async () => {
    //     await libraryPage.switchUser(collab1.credentials);
    // });

    afterEach(async () => {
        await libraryPage.closeTab(1);
        await libraryPage.switchToTab(0);
        await collabAdminPage.turnOnComment();
        await collabAdminPage.turnOnDiscussion();
    });

    it('[TC70269_01] turn off comment and discussion', async () => {
        await collabAdminPage.openCollabAdminPage();
        await collabAdminPage.turnOffDiscussionComment();
        await collabAdminPage.clickLaunchButton();
        await libraryPage.switchToTab(1);
        await dossierPage.waitForItemLoading();
        let currentUrl = await libraryPage.currentURL();
        if (currentUrl.includes('auth/ui/loginPage')) {
            await loginPage.login(collab1.credentials);
            await libraryPage.waitForLibraryLoading();
        }
        await since('after trun off all features, no notification icon ')
            .expect(await notification.isNotificationEnabled())
            .toBe(false);
        await libraryPage.openDossier(dossierName);
        await dossierPage.waitForItemLoading();
        await since('after turn off all features, no collaboration icon')
            .expect(await commentsPage.isCommentIconPresent())
            .toBe(false);
    });

    it('[TC70269_02] enable discussion only', async () => {
        await collabAdminPage.turnOnDiscussion();
        await collabAdminPage.turnOffComment();
        await collabAdminPage.clickLaunchButton();
        await libraryPage.switchToTab(1);
        await dossierPage.waitForItemLoading();
        let currentUrl = await libraryPage.currentURL();
        if (currentUrl.includes('auth/ui/loginPage')) {
            await loginPage.login(collab1.credentials);
            await libraryPage.waitForLibraryLoading();
        }
        await since('after enable discussion only, have notification icon')
            .expect(await notification.isNotificationEnabled())
            .toBe(true);
        await libraryPage.openDossier(dossierName);
        await dossierPage.waitForItemLoading();
        await since('after enable discussion only, have collaboration icon')
            .expect(await commentsPage.isCommentIconPresent())
            .toBe(true);
        await commentsPage.openCommentsPanel();
        await since('after enable discussion only, have discussion icon')
            .expect(await groupDiscussion.isDiscussionTabPresent())
            .toBe(true);
        console.log(await groupDiscussion.isDiscussionTabPresent());
        await since('after enable discussion only, no comment icon')
            .expect(await commentsPage.isPublicCommentTabPresent())
            .toBe(false);
        console.log(await commentsPage.isPublicCommentTabPresent());
    });

    it('[TC70269_03] enable comment only', async () => {
        await collabAdminPage.turnOnComment();
        await collabAdminPage.turnOffDiscussion();
        await collabAdminPage.clickLaunchButton();
        await libraryPage.switchToTab(1);
        await dossierPage.waitForItemLoading();
        let currentUrl = await libraryPage.currentURL();
        if (currentUrl.includes('auth/ui/loginPage')) {
            await loginPage.login(collab1.credentials);
            await libraryPage.waitForLibraryLoading();
        }
        //check have notification icon, have colloboration icon, have comment icon, no discussion icon
        await since('after enable comment only, have notification icon')
            .expect(await notification.isNotificationEnabled())
            .toBe(true);
        await libraryPage.openDossier(dossierName);
        await dossierPage.waitForItemLoading();
        await since('after enable comment only, have colloboration icon')
            .expect(await commentsPage.isCommentIconPresent())
            .toBe(true);
        await commentsPage.openCommentsPanel();
        await since('after enable comment only, no discussion icon')
            .expect(await groupDiscussion.isDiscussionTabPresent())
            .toBe(false);
        await since('after enable comment only, have comment icon')
            .expect(await commentsPage.isPublicCommentTabPresent())
            .toBe(true);
    });

    it('[TC70269_04] turn on comment and discussion', async () => {
        await collabAdminPage.turnOnComment();
        await collabAdminPage.turnOnDiscussion();
        await collabAdminPage.clickLaunchButton();
        await libraryPage.switchToTab(1);
        await dossierPage.waitForItemLoading();
        let currentUrl = await libraryPage.currentURL();
        if (currentUrl.includes('auth/ui/loginPage')) {
            await loginPage.login(collab1.credentials);
            await libraryPage.waitForLibraryLoading();
        }
        //check have notification icon, have colloboration icon, have comment and discussion icon
        await since('after trun on all features, notification icon shows')
            .expect(await notification.isNotificationEnabled())
            .toBe(true);
        await libraryPage.openDossier(dossierName);
        await dossierPage.waitForItemLoading();
        await since('after turn on all features, collaboration icon shows')
            .expect(await commentsPage.isCommentIconPresent())
            .toBe(true);
        await commentsPage.openCommentsPanel();
        await since('after turn on all features, discussion icon shows')
            .expect(await groupDiscussion.isDiscussionTabPresent())
            .toBe(true);
        await since('after turn on features, comment icon shows')
            .expect(await commentsPage.isPublicCommentTabPresent())
            .toBe(true);
    });
});
