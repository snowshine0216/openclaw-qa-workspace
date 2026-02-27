import { customCredentials } from '../../../constants/index.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import createBookmarks from '../../../api/createBookmarks.js';
import generateSharedLink from '../../../api/generateSharedLink.js';
import { designer2Credentials } from '../../../constants/index.js';
import shareDossierToUsers from '../../../api/shareDossierToUsers.js';
import users from '../../../testData/users.json' assert { type: 'json' };
import deleteBookmarkByName from '../../../api/deleteBookmarkByName.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_sender') };
const specConfiguration_Recipient = { ...customCredentials('_recipient') };

describe('ShareBookmark_Collaboration_GuestMode', () => {
    const dossier1 = {
        id: '7B6B40D44BF8E1EF37CAF993B8C4A40E',
        name: 'ShareBookmark_Collaboration',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossier2 = {
        id: '8651F7384E9BC1A557EC39BBF9F641B0',
        name: 'ShareBookmark with Multiple Prompts_Collaboration',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossierReset = {
        id: 'D3B642B84B7C39002668F990DA49ADDE',
        name: 'Reset',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const { credentials } = specConfiguration;
    const { credentials: recipientCredentials } = specConfiguration_Recipient;

    const guestCredentials = {
        username: 'Guest',
        password: '',
    };

    //send and recipient ID to publish dossier
    const sendername = credentials.username;
    const senderID = users[sendername].id;
    const recipientname = recipientCredentials.username;
    const recipientID = users[recipientname].id;

    let {
        loginPage,
        bookmark,
        libraryPage,
        dossierPage,
        onboardingTutorial,
        infoWindow,
        promptEditor,
        share,
        shareDossier,
        notification,
        email,
        sidebar,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
    });

    beforeEach(async () => {
        //switch user to sender
        await libraryPage.switchUser(credentials);

        //re-publish dossier1 to sender and recipient
        await shareDossierToUsers({
            dossier: dossier1,
            credentials: designer2Credentials,
            targetUserIds: [senderID, recipientID],
            targetCredentialsList: [credentials, recipientCredentials],
        });

        //clear msg and close push notifiction panel
        await libraryPage.switchUser(recipientCredentials);
        await notification.openPanel();
        await notification.clearAllMsgs();
        await notification.closePanel();

        //re-login to update short-cut
        await libraryPage.switchUser(credentials);
    });

    afterEach(async () => {
        //await dossierPage.goToLibrary();
    });

    it('[TC69025] Verify share bookmark to guest user', async () => {
        //swipe pages and then create bookmarks
        await libraryPage.openDossier(dossier1.name);
        await dossierPage.switchPageByKey('left', '5000');
        await dossierPage.goToLibrary();

        await createBookmarks({
            bookmarkList: ['Bookmark 1', 'Bookmark 2', 'Bookmark 3', 'Bookmark 4'],
            credentials: credentials,
            dossier: dossier1,
        });

        const url = await generateSharedLink({
            credentials: credentials,
            dossier: dossier1,
        });

        //switch user to recipient
        await libraryPage.switchUser(guestCredentials);

        //skip onboarding tutorial
        await onboardingTutorial.clickIntroToLibrarySkip();

        // check bookmark blade
        await libraryPage.openSidebar();
        since('Bookmark section content display should be #{expected}, while we get #{actual}')
            .expect(await sidebar.isBookmarksSectionPresent())
            .toBe(false);

        // check share dossier UI for guest user
        await libraryPage.moveDossierIntoViewPort(dossierReset.name);
        await libraryPage.openDossierInfoWindow(dossierReset.name);

        //share dossier via IW for empty BM list
        await infoWindow.shareDossier();
        since('share button status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isShareButtonEnabled())
            .toBe(false);
        since('share bookmark section should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isIncludeBMPresent())
            .toBe(false);
        since('share add recipient section should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isRecipientSearchBoxDisabled())
            .toBe(true);
        since('shared add message section should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isAddMessageTextAreaDisabled())
            .toBe(true);
        await shareDossier.closeDialog();
        await infoWindow.close();
        // check share dossier UI for share panel
        await libraryPage.openDossier(dossierReset.name);

        //open share panel and share dossier;
        await share.openSharePanel();
        await share.openShareDossierDialog();
        since('share button status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isShareButtonEnabled())
            .toBe(false);
        since('share bookmark section should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isIncludeBMPresent())
            .toBe(false);
        since('share add recipient section should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isRecipientSearchBoxDisabled())
            .toBe(true);
        since('shared add message section should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isAddMessageTextAreaDisabled())
            .toBe(true);
        await shareDossier.closeDialog();

        // back to home

        await dossierPage.goToLibrary();

        //apply shared link
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForDossierLoading();

        //check it will base and no add to library button displayed
        since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['ShareBookmark_Collaboration', 'Chapter 1', 'Page 1']);
        since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isBookmarkLabelPresent())
            .toBe(true);
        await dossierPage.closeTab(1);
    });

    it('[TC69195] Verify apply shared bookmark without prompt via push notification', async () => {
        await createBookmarks({
            bookmarkList: ['Bookmark 1', 'Bookmark 2', 'Bookmark 3', 'Bookmark 4'],
            credentials: credentials,
            dossier: dossier1,
        });

        //remove dossier in recipient library home
        await libraryPage.removeDossierFromLibrary(recipientCredentials, dossier1);

        //share all bookmarks to recipient
        await shareDossier.shareAllBookmarksFromIWToUser(dossier1, recipientCredentials.username);

        //switch user to recipient
        await libraryPage.switchUser(recipientCredentials);

        //open notification panel and check msg
        await notification.openPanel();
        since('Current Action button for shared bookmark in push notification panel should be #{expected}, instead we have #{actual}')
            .expect(await notification.getActionBtnTextInsideMsg(0))
            .toBe('Add to Library');
        since('Current shared messsage for shared bookmark in push notification panel should be #{expected}, instead we have #{actual}')
            .expect(await notification.getSharedMessageText(0))
            .toBe('share bookmarks to recipient');
        await takeScreenshotByElement(notification.getPanel(),'TC69195','Shared bookmark msg in push notitication panel when dossier is not in library',{ tolerance: 0.21 });

        //add to library in notification panel
        await notification.applySharedDossier(0);
        await takeScreenshotByElement(notification.getPanel(),'TC69195','Shared bookmark msg in push notitication panel after add to library',{ tolerance: 0.21 });

        //click the link to check load view
        await notification.openMsgByIndex(0);
        await dossierPage.waitForDossierLoading();
        since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe('Bookmark 1');
        since('add to library button display should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
        //check error msg on BM notification
        since('Error msg for shared bookmarks with all have beed added should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isNotificationErrorPresent())
            .toBe(false);
        await bookmark.openPanel();
        since('Bookmark list is supposed to be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(4);
        await bookmark.closePanel();

        //back to library
        await dossierPage.goToLibrary();

        //clear msg and close push notifiction panel
        await notification.openPanel();
        await notification.clearAllMsgs();
        await notification.closePanel();

        //switch to sender again
        await libraryPage.switchUser(credentials);

        //share all bookmarks to recipient
        await shareDossier.shareAllBookmarksFromIWToUser(dossier1, recipientCredentials.username);

        //switch user to recipient
        await libraryPage.switchUser(recipientCredentials);

        //open notification panel and check msg
        await notification.openPanel();
        since('Current Action button for shared bookmark in push notification panel should be #{expected}, instead we have #{actual}')
            .expect(await notification.getActionBtnTextInsideMsg(0))
            .toBe('Accept');
        await takeScreenshotByElement(notification.getPanel(),'TC69195','Shared bookmark msg in push notitication panel when dossier is in library',{ tolerance: 0.21 });

        //accept shared bookmark
        await notification.applySharedDossier(0);
        await takeScreenshotByElement(
            notification.getPanel(),
            'TC69195',
            'Shared bookmark msg in push notitication panel after accept shared bookmark',
            { tolerance: 0.21 }
        );

        //click the link to check load view
        await notification.openMsgByIndex(0);
        await dossierPage.waitForDossierLoading();
        since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe('Bookmark 1');
        await bookmark.openPanel();
        since('Bookmark list is supposed to be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(4);
        await bookmark.closePanel();

        //back to library and clear all msg in push notification
        await dossierPage.goToLibrary();
        await notification.openPanel();
        await notification.clearAllMsgs();
        await notification.closePanel();

        //switch to sender
        await libraryPage.switchUser(credentials);

        //share all bookmarks to recipient
        await shareDossier.shareAllBookmarksFromIWToUser(dossier1, recipientCredentials.username);

        //switch user to recipient
        await libraryPage.switchUser(recipientCredentials);

        //click ignore and check the msg count
        await notification.openPanel();
        await notification.ignoreSharedDossier(0);
        since('Current msg count in push notification panel should be #{expected}, instead we have #{actual}')
            .expect(await notification.notificationMsgCount())
            .toBe(0);
        await notification.closePanel();
    });

    it('[TC69197] Verify apply shared bookmark with prompt via push notification', async () => {
        //re-publish dossier2 to sender and recipient
        await shareDossierToUsers({
            dossier: dossier2,
            credentials: designer2Credentials,
            targetUserIds: [senderID, recipientID],
            targetCredentialsList: [credentials, recipientCredentials],
        });

        await libraryPage.switchUser(credentials);

        //resolve prompt answer first then create bm by API
        await libraryPage.openDossier(dossier2.name);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await dossierPage.goToLibrary();

        await createBookmarks({
            bookmarkList: ['Bookmark 1', 'Bookmark 2', 'Bookmark 3', 'Bookmark 4'],
            credentials: credentials,
            dossier: dossier2,
        });

        //share all bookmarks to recipient
        await shareDossier.shareAllBookmarksFromIWToUser(dossier2, recipientCredentials.username);
        //switch user to recipient
        await libraryPage.switchUser(recipientCredentials);

        //resolve prompt answer first to prepare short-cut for remove dossier later on
        await libraryPage.openDossier(dossier2.name);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await dossierPage.goToLibrary();

        //remove dossier in recipient library home
        await libraryPage.removeDossierFromLibrary(recipientCredentials, dossier2);
        await libraryPage.refresh();

        //open notification panel and check msg
        await notification.openPanel();
        since(
            'Current Action button for shared bookmark in push notification panel should be #{expected}, instead we have #{actual}'
        )
            .expect(await notification.getActionBtnTextInsideMsg(0))
            .toBe('Add to Library');
        await takeScreenshotByElement(
            notification.getPanel(),
            'TC69197',
            'Shared bookmark msg in push notitication panel when dossier with prompt is not in library',
            { tolerance: 0.21 }
        );

        //add to library in notification panel
        await notification.applySharedDossier(0);
        await takeScreenshotByElement(
            notification.getPanel(),
            'TC69197',
            'Shared bookmark msg in push notitication panel after add to library',
            { tolerance: 0.21 }
        );

        //click the link to check load view
        await notification.openMsgByIndex(0);
        since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe('Bookmark 1');
        since('add to library button display should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
        await bookmark.openPanel();
        since('Bookmark list is supposed to be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(4);
        await bookmark.closePanel();

        //back to library
        await dossierPage.goToLibrary();

        //clear msg and close push notifiction panel
        await notification.openPanel();
        await notification.clearAllMsgs();
        await notification.closePanel();

        //switch to sender again
        await libraryPage.switchUser(credentials);

        //share all bookmarks to recipient
        await shareDossier.shareAllBookmarksFromIWToUser(dossier2, recipientCredentials.username);

        //switch user to recipient
        await libraryPage.switchUser(recipientCredentials);

        //open notification panel and check msg
        await notification.openPanel();
        since('Current Action button for shared bookmark in push notification panel should be #{expected}, instead we have #{actual}')
            .expect(await notification.getActionBtnTextInsideMsg(0))
            .toBe('Accept');
        await takeScreenshotByElement(
            notification.getPanel(),
            'TC69197',
            'Shared bookmark msg in push notitication panel when dossier with prompt is in library',
            { tolerance: 0.21 }
        );

        //accept shared bookmark
        await notification.applySharedDossier(0);
        await takeScreenshotByElement(
            notification.getPanel(),
            'TC69197',
            'Shared bookmark msg in push notitication panel after accept shared bookmark',
            { tolerance: 0.21 }
        );

        //click the link to check load view
        await notification.openMsgByIndex(0);
        since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe('Bookmark 1');
        await bookmark.openPanel();
        since('Bookmark list is supposed to be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(4);
        await bookmark.closePanel();

        //back to library and clear all msg in push notification
        await dossierPage.goToLibrary();
        await notification.openPanel();
        await notification.clearAllMsgs();
        await notification.closePanel();

        //switch to sender
        await libraryPage.switchUser(credentials);

        //share all bookmarks to recipient
        await shareDossier.shareAllBookmarksFromIWToUser(dossier2, recipientCredentials.username);

        //switch user to recipient
        await libraryPage.switchUser(recipientCredentials);

        //click ignore and check the msg count
        await notification.openPanel();
        await notification.ignoreSharedDossier(0);
        since('Current msg count in push notification panel should be #{expected}, instead we have #{actual}')
            .expect(await notification.notificationMsgCount())
            .toBe(0);
        await notification.closePanel();
    });

    it('[TC69200_01] Verify error handling for shared bookmark without prompt in push notification', async () => {
        await createBookmarks({
            bookmarkList: ['Bookmark 1', 'Bookmark 2', 'Bookmark 3', 'Bookmark 4', 'Bookmark 5'],
            credentials: credentials,
            dossier: dossier1,
        });

        //share bookmark to recipient
        await shareDossier.shareAllBookmarksFromIWToUser(dossier1, recipientCredentials.username);

        //switch user to recipient
        await libraryPage.switchUser(recipientCredentials);

        //click the link to check load view
        await notification.openPanel();
        await notification.openMsgByIndex(0);
        await dossierPage.waitForDossierLoading();
        since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe('Bookmark 1');
        await bookmark.confirmNotification();
        await bookmark.openPanel();
        since('Bookmark list is supposed to be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(5);
        await bookmark.closePanel();

        //clear msg and close push notifiction panel
        await dossierPage.goToLibrary();
        await notification.openPanel();
        await notification.clearAllMsgs();
        await notification.closePanel();

        //switch to sender and share bookmarks to recipient
        await dossierPage.goToLibrary();
        await libraryPage.switchUser(credentials);
        await shareDossier.shareAllBookmarksFromIWToUser(dossier1, recipientCredentials.username);

        //switch user to recipient
        await libraryPage.switchUser(recipientCredentials);

        //open push notification panel and click 'accept' button in push notification panel
        await notification.openPanel();
        await notification.applySharedDossier(0);

        //check error msg in push notification
        since('Error msg for shared bookmarks with all have beed added should be #{expected}, instead we have #{actual}')
            .expect(await notification.isErrorPresent(0))
            .toBe(false);

        //clear msg and close push notifiction panel
        await notification.clearAllMsgs();
        await notification.closePanel();

        //delete Bookmark 1 for recipient
        await deleteBookmarkByName({
            credentials: recipientCredentials,
            dossier: dossier1,
            name: 'Bookmark 1',
        });

        //switch to sender and share bookmarks to recipient
        await libraryPage.switchUser(credentials);
        await shareDossier.shareAllBookmarksFromIWToUser(dossier1, recipientCredentials.username);

        //switch to recipient and click 'accept' button in push notification panel
        await libraryPage.switchUser(recipientCredentials);
        await notification.openPanel();
        await notification.applySharedDossier(0);

        //check error msg on push notification
        since('Error msg for shared bookmarks with part of ones have beed added should be #{expected}, instead we have #{actual}')
            .expect(await notification.isErrorPresent(0))
            .toBe(false);

        //clear msg and close push notifiction panel
        await notification.clearAllMsgs();
        await notification.closePanel();
    });

    it('[TC69200_02] Verify error handling for shared bookmark without prompt in push notification', async () => {
        await createBookmarks({
            bookmarkList: ['Bookmark 1', 'Bookmark 2', 'Bookmark 3', 'Bookmark 4', 'Bookmark 5'],
            credentials: credentials,
            dossier: dossier1,
        });

        //share bookmarks to recipient
        await shareDossier.shareAllBookmarksFromIWToUser(dossier1, recipientCredentials.username);

        //delete Bookmark 1 for sender
        await deleteBookmarkByName({
            credentials: credentials,
            dossier: dossier1,
            name: 'Bookmark 1',
        });

        //switch to recipient and click 'accept' button in push notification panel
        await libraryPage.switchUser(recipientCredentials);
        await notification.openPanel();
        await notification.applySharedDossier(0);

        //check error msg on push notification
        since('Error msg for shared bookmarks with all have been added and part of ones have been deleted on sender should be #{expected}, instead we have #{actual}')
            .expect(await notification.getErrorMsg(0))
            .toBe('1 bookmark was deleted and is no longer available.');
        await takeScreenshotByElement(
            notification.getPanel(),
            'TC69200',
            'Error msg for shared bookmarks with all have been added and part of ones have been deleted in push notification',
            { tolerance: 0.21 }
        );
        //check error msg will disappear automatically after 3 seconds
        await notification.isErrorMsgDisappear(0);

        //clear msg and close push notifiction panel
        await notification.clearAllMsgs();
        await notification.closePanel();

        //reset recipient's bookmarks
        await resetBookmarks({
            credentials: recipientCredentials,
            dossier: dossier1,
        });

        //restore deleted bookmark 1 for sender
        await createBookmarks({
            bookmarkList: ['Bookmark 1'],
            credentials: credentials,
            dossier: dossier1,
        });

        //switch to sender and share bookmarks to recipient
        await libraryPage.switchUser(credentials);
        await shareDossier.shareAllBookmarksFromIWToUser(dossier1, recipientCredentials.username);

        //delete Bookmark 1 for sender
        await deleteBookmarkByName({
            credentials: credentials,
            dossier: dossier1,
            name: 'Bookmark 1',
        });

        //switch to recipient and click 'accept' button in push notification panel
        await libraryPage.switchUser(recipientCredentials);
        await notification.openPanel();
        await notification.applySharedDossier(0);

        //check error msg on BM notification
        since('Error msg for shared bookmarks with part of ones have been deleted on sender should be #{expected}, instead we have #{actual}')
            .expect(await notification.getErrorMsg(0))
            .toBe('1 bookmark was deleted and is no longer available.');
        await takeScreenshotByElement(
            notification.getPanel(),
            'TC69200',
            'Error msg for shared bookmarks with part of ones have been deleted in push notification',
            { tolerance: 0.21 }
        );
        //check error msg will disappear automatically after 3 seconds
        await notification.isErrorMsgDisappear(0);

        //clear msg and close push notifiction panel
        await notification.clearAllMsgs();
        await notification.closePanel();

        //delete bookmark2 and bookmark3 for recipient
        await deleteBookmarkByName({
            credentials: recipientCredentials,
            dossier: dossier1,
            name: 'Bookmark 2',
        });

        await deleteBookmarkByName({
            credentials: recipientCredentials,
            dossier: dossier1,
            name: 'Bookmark 3',
        });

        //switch to sender and share bookmarks to recipient
        await libraryPage.switchUser(credentials);
        await shareDossier.shareAllBookmarksFromIWToUser(dossier1, recipientCredentials.username);

        //delete bookmark4 for sender
        await deleteBookmarkByName({
            credentials: credentials,
            dossier: dossier1,
            name: 'Bookmark 4',
        });

        //switch to recipient and click 'accept' button in push notification panel
        await libraryPage.switchUser(recipientCredentials);
        await notification.openPanel();
        await notification.applySharedDossier(0);

        //check error msg on BM notification
        since('Error msg for shared bookmarks with part of ones have been deleted or added should be #{expected}, instead we have #{actual}')
            .expect(await notification.getErrorMsg(0))
            .toBe('1 bookmark was deleted and is no longer available.');
        await takeScreenshotByElement(
            notification.getPanel(),
            'TC69200',
            'Error msg for shared bookmarks with part of ones have been deleted or added in push notification',
            { tolerance: 0.21 }
        );
        //check error msg will disappear automatically after 3 seconds
        await notification.isErrorMsgDisappear(0);

        //clear msg and close push notifiction panel
        await notification.clearAllMsgs();
        await notification.closePanel();

        //reset recipient's bookmarks
        await resetBookmarks({
            credentials: recipientCredentials,
            dossier: dossier1,
        });

        //switch to sender and share bookmarks to recipient
        await libraryPage.switchUser(credentials);
        await shareDossier.shareAllBookmarksFromIWToUser(dossier1, recipientCredentials.username);

        //delete all bookmarks for sender
        await resetBookmarks({
            credentials: credentials,
            dossier: dossier1,
        });

        //switch to recipient and click 'accept' button in push notification panel
        await libraryPage.switchUser(recipientCredentials);
        await notification.openPanel();
        await notification.applySharedDossier(0);

        //check error msg on push notification
        since('Error msg for shared bookmarks with all have been deleted should be #{expected}, instead we have #{actual}')
            .expect(await notification.getErrorMsg(0))
            .toBe('3 bookmarks were deleted and are no longer available.');
        await takeScreenshotByElement(
            notification.getPanel(),
            'TC69200',
            'Error msg for shared bookmarks with all have been deleted in push notification',
            { tolerance: 0.21 }
        );
        //check error msg will disappear automatically after 3 seconds
        await notification.isErrorMsgDisappear(0);

        //clear msg and close push notifiction panel
        await notification.clearAllMsgs();
        await notification.closePanel();
    });

    it('[TC69248] Verify action button disappear after click link and back to notification panel', async () => {
        //create bookmarks for sender
        await createBookmarks({
            bookmarkList: ['Bookmark 1', 'Bookmark 2', 'Bookmark 3', 'Bookmark 4'],
            credentials: credentials,
            dossier: dossier1,
        });

        //share all bookmarks to recipient
        await shareDossier.shareAllBookmarksFromIWToUser(dossier1, recipientCredentials.username);
        //switch user to recipient
        await libraryPage.switchUser(recipientCredentials);
        //remove dossier in recipient library home
        await libraryPage.removeDossierFromLibrary(recipientCredentials, dossier1);
        await libraryPage.refresh();

        //open notification panel and click the link
        await notification.openPanel();
        since('Action button on notification panel display should be #{expected}, instead we have #{actual}')
            .expect(await notification.isActionButtonPresent(0))
            .toBe(true);
        await takeScreenshotByElement(
            notification.getPanel(),
            'TC69248',
            'Add to library button display in notitication panel before click link ',
            { tolerance: 0.21 }
        );
        await notification.openMsgByIndex(0);
        await dossierPage.waitForDossierLoading();

        //check load view
        since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe('Bookmark 1');
        since('add to library button display should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(true);

        //add to library
        await dossierPage.addToLibrary();

        //check bookmark panel
        await bookmark.confirmNotification();
        await bookmark.openPanel();
        since('Current bookmark list should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(4);
        await bookmark.closePanel();

        //back to library and check notification panel
        await dossierPage.goToLibrary();
        await notification.openPanel();
        since('Action button on notification panel display should be #{expected}, instead we have #{actual}')
            .expect(await notification.isActionButtonPresent(0))
            .toBe(false);
        await takeScreenshotByElement(
            notification.getPanel(),
            'TC69248',
            'Add to library button disappear in notitication panel after click link and back ',
            { tolerance: 0.21 }
        );

        //clear msg and close push notifiction panel
        await notification.clearAllMsgs();
        await notification.closePanel();

        //switch to sender again
        await libraryPage.switchUser(credentials);

        //share all bookmarks to recipient
        await shareDossier.shareAllBookmarksFromIWToUser(dossier1, recipientCredentials.username);

        //switch user to recipient
        await libraryPage.switchUser(recipientCredentials);

        //open notification panel and click the link
        await notification.openPanel();
        since('Action button on notification panel display should be #{expected}, instead we have #{actual}')
            .expect(await notification.isActionButtonPresent(0))
            .toBe(true);
        await takeScreenshotByElement(
            notification.getPanel(),
            'TC69248',
            'Accept button display in notitication panel before click link ',
            { tolerance: 0.21 }
        );
        await notification.openMsgByIndex(0);
        await dossierPage.waitForDossierLoading();

        //check load view
        since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe('Bookmark 1');
        since('add to library button display should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
        await bookmark.openPanel();
        since('Current bookmark list should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(4);
        await bookmark.closePanel();

        //back to library and check notification panel
        await dossierPage.goToLibrary();
        await notification.openPanel();
        since('Action button on notification panel display should be #{expected}, instead we have #{actual}')
            .expect(await notification.isActionButtonPresent(0))
            .toBe(false);
        await takeScreenshotByElement(
            notification.getPanel(),
            'TC69248',
            'Accept button disappear in notitication panel after click link and back ',
            { tolerance: 0.21 }
        );

        //clear msg and close push notifiction panel
        await notification.clearAllMsgs();
        await notification.closePanel();
    });

    it('[TC69250] Verify error handling for applied deleted bookmarks with prompt in notification panel', async () => {
        //re-publish dossier2 to sender and recipient
        await shareDossierToUsers({
            dossier: dossier2,
            credentials: designer2Credentials,
            targetUserIds: [senderID, recipientID],
            targetCredentialsList: [credentials, recipientCredentials],
        });

        await libraryPage.switchUser(credentials);

        //resolve prompt answer first then create bm by API
        await libraryPage.openDossier(dossier2.name);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await dossierPage.goToLibrary();

        await createBookmarks({
            bookmarkList: ['Bookmark 1', 'Bookmark 2', 'Bookmark 3', 'Bookmark 4'],
            credentials: credentials,
            dossier: dossier2,
        });

        //share all bookmarks to recipient
        await shareDossier.shareAllBookmarksFromIWToUser(dossier2, recipientCredentials.username);

        //delete all bookmarks for sender
        await resetBookmarks({
            credentials: credentials,
            dossier: dossier2,
        });

        //switch user to recipient
        await libraryPage.switchUser(recipientCredentials);

        //open notification panel and check action button should be accept
        await notification.openPanel();
        since('Current Action button for shared bookmark in push notification panel should be #{expected}, instead we have #{actual}')
            .expect(await notification.getActionBtnTextInsideMsg(0))
            .toBe('Accept');
        await notification.closePanel();

        //resolve prompt answer first to prepare short-cut for remove dossier later on
        await libraryPage.openDossier(dossier2.name);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await dossierPage.goToLibrary();

        //remove dossier in recipient library home
        await libraryPage.removeDossierFromLibrary(recipientCredentials, dossier2);
        await libraryPage.refresh();

        //open notification panel and check action button should be add to library
        await notification.openPanel();
        since('Current Action button for shared bookmark in push notification panel should be #{expected}, instead we have #{actual}')
            .expect(await notification.getActionBtnTextInsideMsg(0))
            .toBe('Add to Library');

        //open notification panel and click add to library button to check error msg
        await notification.applySharedDossier(0);

        //comment it since it has issue hasn't been fixed yet
        since('Error msg for add deleted bookmarks with prompt to library should be #{expected}, instead we have #{actual}')
            .expect(await notification.getErrorMsg(0))
            .toBe(
                'Failed to add it to Library because the bookmarks were deleted. Tap the message above to open and add it to your Library.'
            );
        await takeScreenshotByElement(
            notification.getPanel(),
            'TC69250',
            'Error msg for shared bookmarks with all have been deleted in push notification',
            { tolerance: 0.21 }
        );

        //check error msg will disappear automatically after 3 seconds
        await notification.isErrorMsgDisappear(0);

        //click the link and check it will run base
        await notification.openMsgByIndex(0);
        await promptEditor.cancelEditor();

        //clear all msg on notification panel
        await notification.openPanel();
        await notification.clearAllMsgs();
        await notification.closePanel();
    });

    it('[TC69367] Verify add recipient section in share dossier dialog when collaboration server is on', async () => {
        //open share dialog from IW panel
        await libraryPage.moveDossierIntoViewPort(dossier1.name);
        await libraryPage.openDossierInfoWindow(dossier1.name);
        await infoWindow.shareDossier();

        //check default hint for recipients searchbox
        since('Default hint for add recipients should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getRecipientDefaultHintText())
            .toBe('Add Recipients');

        //search group user
        await shareDossier.searchRecipient('winky');

        // //check group member has been fetched already
        // since('Default group member list without expand should be #{expected}, instead we have #{actual}')
        //     .expect(await shareDossier.getGroupMemberCount("Winky's Group"))
        //     .toBe('4');
        //add group user
        await shareDossier.selectGroupRecipient("Winky's Group");

        //deselect group member
        await shareDossier.searchRecipient('winky');
        await shareDossier.selectRecipients(['xinhu4', 'xinhu5'], "Winky's Group");
        await shareDossier.dismissRecipientSearchList();
        since('current selected recipient should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getRecipientNameList())
            .toEqual(['Copy of xinghu4', 'xinhu6']);

        //add group again by all selection
        await shareDossier.searchRecipient('winky');
        await shareDossier.expandGroup("Winky's Group");
        //check group selection status
        since('Current group selection status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getGroupCheckBoxStatus("Winky's Group"))
            .toBe('mixed');
        //await takeScreenshotByElement(shareDossier.getSearchUserList(),'TC69302','Partially check All selection for group user',{ tolerance: 0.21 });

        //deselect all
        await shareDossier.slelectAllForGroupRecipient("Winky's Group");
        //check group selection status
        since('Current group selection status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getGroupCheckBoxStatus("Winky's Group"))
            .toBe('false');
        await takeScreenshotByElement(shareDossier.getSearchUserList(),'TC69302','Uncheck All selection for group user', { tolerance: 0.21 });

        //select all
        await shareDossier.slelectAllForGroupRecipient("Winky's Group");
        //check group selection status
        since('Current group selection status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getGroupCheckBoxStatus("Winky's Group"))
            .toBe('true');
        await takeScreenshotByElement(shareDossier.getSearchUserList(),'TC69302','Check All selection for group user',{ tolerance: 0.21 });

        //dismiss search box
        await shareDossier.dismissRecipientSearchList();

        //add new group member
        await shareDossier.searchRecipient('Test1');
        await shareDossier.selectRecipients(['Copy of xinhu4', 'xinhu4'], 'Test1');
        await shareDossier.dismissRecipientSearchList();

        //search group with empty users
        await shareDossier.searchRecipient('web');
        // since('Web group list should be #{expected}, instead we have #{actual}')
        //     .expect(await shareDossier.getGroupMemberCount('Web'))
        //     .toBe('0');
        since('Web group list should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isGroupItemDisabled('Web'))
            .toBe(false);
        await shareDossier.dismissRecipientSearchList();

        //add single user with existing one
        await shareDossier.searchRecipient('xinhu4');
        await shareDossier.selectRecipients(['xinhu4']);

        //add new single user
        await shareDossier.searchRecipient('xinhu2');
        await shareDossier.selectRecipients(['xinhu2']);

        //check selection
        since('current selected recipient should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getRecipientNameList())
            .toEqual(["Winky's Group", 'Copy of xinghu4', 'xinghu4', 'xinhu2']);

        //delete current recipient list and check share button status
        await shareDossier.deleteRecipients(["Winky's Group", 'Copy of xinghu4', 'xinghu4', 'xinhu2']);
        since('share button status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isShareButtonEnabled())
            .toBe(false);

        //no empty search result
        await shareDossier.searchRecipient('nosuch');
        since('share button status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getSearchResultText())
            .toBe('No User found');
        await shareDossier.dismissRecipientSearchList();
        await shareDossier.closeDialog();
    });

    it('[TC69697] Verify apply shared dossier with bookmarks via email link when collaboration server is on', async () => {
        //create bookmarks for sender
        await createBookmarks({
            bookmarkList: ['Bookmark 1', 'Bookmark 2', 'Bookmark 3', 'Bookmark 4'],
            credentials: credentials,
            dossier: dossier1,
        });

        //share all bookmarks to recipient
        await shareDossier.shareAllBookmarksFromIWToUser(dossier1, recipientCredentials.username);

        //switch user to recipient
        await libraryPage.switchUser(recipientCredentials);

        //remove dossier in recipient library home
        await libraryPage.removeDossierFromLibrary(recipientCredentials, dossier1);

        //check shared msg in email
        since('Current shared message in email should be #{expected}, instead we have #{actual}')
            .expect(await email.getSharedMsg(recipientCredentials.username))
            .toEqual('Message: share bookmarks to recipient');

        //go to recipient email box and open the text link
        await email.openViewInBrowserLink(recipientCredentials.username);

        //add to library
        await dossierPage.addToLibrary();

        //check BM applied and BM list is 11
        since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe('Bookmark 1');
        await bookmark.confirmNotification();
        await bookmark.openPanel();
        since('Bookmark list is supposed to be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(4);
        await bookmark.closePanel();

        // swipe pages and back to library
        await dossierPage.switchPageByKey('left', '5000');
        await dossierPage.goToLibrary();

        //apply the same link again to check
        await email.openViewInBrowserLink(recipientCredentials.username);
        await email.clearMsgBox();

        //check it will load shared bookmark1 view and no add to library button displayed
        since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['ShareBookmark_Collaboration', 'Chapter 1', 'Page 2']);
        since('add to library button display should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);

        //back to library
        await dossierPage.goToLibrary();

        //clear msg and close push notifiction panel
        await notification.openPanel();
        await notification.clearAllMsgs();
        await notification.closePanel();
    });
});

export const config = specConfiguration;
