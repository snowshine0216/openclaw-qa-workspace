import { customCredentials } from '../../../constants/index.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import createBookmarks from '../../../api/createBookmarks.js';
import generateSharedLink from '../../../api/generateSharedLink.js';
import deleteBookmarkByName from '../../../api/deleteBookmarkByName.js';
import shareDossierToUsers from '../../../api/shareDossierToUsers.js';
import users from '../../../testData/users.json' assert { type: 'json' };
import { designer2Credentials } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_sender') };
const specConfiguration_Recipient = { ...customCredentials('_recipient') };

describe('ShareBookmark_X_Func', () => {
    const dossier1 = {
        id: '75B8693F4F24DF0494BD0FB818E5DAC8',
        name: 'ShareBookmark_Xfunc',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const { credentials } = specConfiguration;
    const { credentials: recipientCredentials } = specConfiguration_Recipient;

    //send and recipient ID to publish dossier
    const sendername = credentials.username;
    const senderID = users[sendername].id;
    const recipientname = recipientCredentials.username;
    const recipientID = users[recipientname].id;

    let { loginPage, bookmark, libraryPage, dossierPage, filterPanel, checkboxFilter, share, shareDossier } =
        browsers.pageObj1;

    //re-publish dossier to sender and recipient
    beforeAll(async () => {
        await loginPage.login(credentials);
    });

    beforeEach(async () => {
        await shareDossierToUsers({
            dossier: dossier1,
            credentials: designer2Credentials,
            targetUserIds: [senderID, recipientID],
            targetCredentialsList: [credentials, recipientCredentials],
        });
    });

    afterEach(async () => {
        await dossierPage.closeAllTabs();
        await libraryPage.switchUser(credentials);
        await dossierPage.goToLibrary();
    });

    it('[TC68610] Verify share/delete/switch/save as on shared bookmark', async () => {
        //create bookmarks for sender
        await createBookmarks({
            bookmarkList: ['Bookmark 1', 'Bookmark 2', 'Bookmark 3'],
            credentials: credentials,
            dossier: dossier1,
        });

        const url = await generateSharedLink({
            credentials: credentials,
            dossier: dossier1,
        });

        //switch user to recipient
        await libraryPage.switchUser(recipientCredentials);

        //apply shared link
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForItemLoading();

        //check notification panel
        since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.getNotificationMsg())
            .toBe('View your shared bookmarks here. Changes from the owner will be applied to the shared bookmark.');
        await takeScreenshotByElement(bookmark.getNotification(), 'TC68610', 'Bookmark Notification dialog');
        await bookmark.confirmNotification();

        //share shared BM
        await bookmark.openPanel();
        await bookmark.shareBookmark('Bookmark 1', 'SHARED WITH ME');
        since('default secelted bookmark for shared dialog should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getCurrentSelection())
            .toBe('Bookmark 1');
        await shareDossier.closeDialog();
        await bookmark.closePanel();

        //save as my bookmark and check default name is the shared BM name
        await bookmark.openPanel();
        await bookmark.addNewBookmark('');
        since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe('Bookmark 1');

        //swtich bookmark between my bookmark and shared bookmark
        await bookmark.applyBookmark('Bookmark 1', 'SHARED WITH ME');
        since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe('Bookmark 1');

        //delete shared bookmark
        await bookmark.openPanel();
        await bookmark.deleteBookmark('Bookmark 1', 'SHARED WITH ME');

        //bulk delete all bookmarks
        await bookmark.editBulkDeleteBookmarks();
        await bookmark.selectAllToDelete();
        await bookmark.bulkDeleteBookmarks();
        since('Confirmation msg for bulk delete should be')
            .expect(await bookmark.getDeleteConfirmMsg())
            .toBe('Are you sure you want to delete? Any associated subscriptions will also be deleted.');
        await bookmark.confirmDelete();
        await bookmark.closePanel();
        await dossierPage.closeTab(1);

        // apply the same link and check 'do not show again' for the tooltip dialog
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForItemLoading();
        await bookmark.ignoreNotification();
        await bookmark.confirmNotification();

        // delete all BMs
        await resetBookmarks({
            credentials: recipientCredentials,
            dossier: dossier1,
        });
        await dossierPage.closeTab(1);

        // apply the link again to check the setting works
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForItemLoading();
        since('Notification Dialog should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isNotificationPresent())
            .toBe(false);
        await bookmark.openPanel();
        await bookmark.closePanel();
        await dossierPage.closeTab(1);
    });

    it('[TC68632] Verify Bookmark panel UI with share/apply bms', async () => {
        //create bookmarks for sender
        await createBookmarks({
            bookmarkList: ['Bookmark 1', 'Bookmark 2', 'Bookmark 3'],
            credentials: credentials,
            dossier: dossier1,
        });

        const url = await generateSharedLink({
            credentials: credentials,
            dossier: dossier1,
        });

        //switch user to recipient
        await libraryPage.switchUser(recipientCredentials);

        //check BM panel for empty BM list
        await libraryPage.openDossier(dossier1.name);
        await bookmark.openPanel();
        since('Current BM count should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(0);

        //check BM panel for only my BM list
        await bookmark.addNewBookmark('');
        await bookmark.createBookmarksByDefault(3);
        since('Current BM count should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(4);
        await bookmark.closePanel();

        // delete all BMs
        await resetBookmarks({
            credentials: recipientCredentials,
            dossier: dossier1,
        });

        //apply shared link
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForItemLoading();

        //confirm notification dialog
        //await bookmark.confirmNotification();

        //check BM panel with only shared BM list
        await bookmark.openPanel();
        since('Current BM count should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(3);
        await bookmark.hideBookmarkTimeStamp();
        await takeScreenshotByElement(bookmark.getPanel(), 'TC68632', 'Bookmark panel with only shared BM list', {
            tolerance: 0.3,
        });
        await bookmark.showBookmarkTimeStamp();

        //add my BM
        await bookmark.createBookmarksByDefault(3);
        since('Current BM count should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(6);
        await bookmark.hideBookmarkTimeStamp();
        await takeScreenshotByElement(bookmark.getPanel(), 'TC68632', 'Bookmark panel with both shared&my BM list', {
            tolerance: 0.5,
        });
        await bookmark.showBookmarkTimeStamp();

        await bookmark.closePanel();
        await dossierPage.closeTab(1);
    });

    it('[TC68635] Verify Shared Bookmark status under recipient shared BM list', async () => {
        //create bookmarks for sender
        await createBookmarks({
            bookmarkList: ['Bookmark 1', 'Bookmark 2', 'Bookmark with long long long long long name'],
            credentials: credentials,
            dossier: dossier1,
        });

        const url = await generateSharedLink({
            credentials: credentials,
            dossier: dossier1,
        });

        //switch user to recipient
        await libraryPage.switchUser(recipientCredentials);

        //apply shared link
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForItemLoading();
        await bookmark.confirmNotification();
        //check shared BM status UI
        await bookmark.openPanel();
        since('Shared BM of Bookmark 1 status should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isSharedStatusIconPresent('Bookmark 1'))
            .toBe(false);
        since('Shared BM of Bookmark 2 status should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.getCapsureText('Bookmark 2'))
            .toBe('NEW');
        since('Shared BM of Bookmark with long name status should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.getCapsureText('Bookmark with long long long long long name'))
            .toBe('NEW');
        await bookmark.hideBookmarkTimeStamp();
        await takeScreenshotByElement(bookmark.getPanel(), 'TC68635', 'Initial Status after apply shared BM', {
            tolerance: 0.5,
        });
        await bookmark.showBookmarkTimeStamp();

        //view shared BM2 and check status
        await bookmark.applyBookmark('Bookmark 2', 'SHARED WITH ME');
        await bookmark.openPanel();
        since('Shared BM of Bookmark 2 status should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isSharedStatusIconPresent('Bookmark 2'))
            .toBe(false);
        await bookmark.closePanel();

        //go to sender and update shared BMs
        await dossierPage.goToLibrary();

        //switch user sender
        await libraryPage.switchUser(credentials);

        //check send icon for BM has been applied
        await libraryPage.openDossier(dossier1.name);
        await bookmark.openPanel();
        since('Bookmark 1 send icon display should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isSendIconPresent('Bookmark 1'))
            .toBe(true);
        since('Bookmark 2 send icon display should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isSendIconPresent('Bookmark 2'))
            .toBe(true);
        since(
            'Bookmark with long long long long long nam send icon display should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.isSendIconPresent('Bookmark with long long long long long nam'))
            .toBe(false);
        await bookmark.hideBookmarkTimeStamp();
        await takeScreenshotByElement(
            bookmark.getPanel(),
            'TC68635',
            'BM status after shared bm have been applied for sender',
            { tolerance: 0.4 }
        );
        await bookmark.showBookmarkTimeStamp();

        //update sender's BMs
        await bookmark.applyBookmark('Bookmark 1');
        await dossierPage.switchPageByKey('left', '3000');
        await bookmark.openPanel();
        await bookmark.updateBookmark('Bookmark 1');

        await bookmark.applyBookmark('Bookmark 2');
        await dossierPage.switchPageByKey('left', '3000');
        await bookmark.openPanel();
        await bookmark.updateBookmark('Bookmark 2');

        await bookmark.applyBookmark('Bookmark with long long long long long name');
        await dossierPage.switchPageByKey('left', '3000');
        await bookmark.openPanel();
        await bookmark.updateBookmark('Bookmark with long long long long long name');
        await bookmark.closePanel();
        await dossierPage.goToLibrary();

        //switch to recipient
        await libraryPage.switchUser(recipientCredentials);

        //check shared BM status to be updated
        await libraryPage.openDossier(dossier1.name);
        await bookmark.openPanel();
        since('Shared BM of Bookmark 1 status should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.getCapsureText('Bookmark 1'))
            .toBe('UPDATED');
        since('Shared BM of Bookmark 2 status should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.getCapsureText('Bookmark 2'))
            .toBe('UPDATED');
        since('Shared BM of Bookmark with long name status should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.getCapsureText('Bookmark with long long long long long name'))
            .toBe('NEW');
        await bookmark.hideBookmarkTimeStamp();
        await takeScreenshotByElement(bookmark.getPanel(), 'TC68635', 'Shared BM Status for updated one', {
            tolerance: 0.5,
        });
        await bookmark.showBookmarkTimeStamp();
        await bookmark.closePanel();
        await dossierPage.goToLibrary();

        //swith user to sender
        await libraryPage.switchUser(credentials);

        // check bulk delete string for sender with shared BM
        await libraryPage.openDossier(dossier1.name);
        await bookmark.openPanel();
        await bookmark.deleteBookmarkWithoutConfirm('Bookmark 1', 'MY BOOKMARKS');
        since('Confirmation msg for single delete should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.getDeleteConfirmMsg())
            .toBe('This bookmark is shared with other users. Are you sure you want to delete? Any associated subscriptions will also be deleted.');
        await bookmark.cancelDelete();
        await bookmark.editBulkDeleteBookmarks();
        await bookmark.selectAllToDelete();
        await bookmark.bulkDeleteBookmarks();
        since('Confirmation msg for bulk delete should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.getDeleteConfirmMsg())
            .toBe('Your selection includes shared bookmarks. Are you sure you want to delete? Any associated subscriptions will also be deleted.');
        await bookmark.confirmDelete();
        await bookmark.closePanel();
        await dossierPage.closeTab(1);
    });

    it('[TC68640] Verify default bookmark after apply shared bm link when bm has been deleted from sender', async () => {
        // reset bookmarks firstly
        await resetBookmarks({
            credentials: credentials,
            dossier: dossier1,
        });

        //create bookmarks for sender
        await createBookmarks({
            bookmarkList: ['Bookmark 1', 'Bookmark 2', 'Bookmark 3', 'Bookmark 4'],
            credentials: credentials,
            dossier: dossier1,
        });

        const url = await generateSharedLink({
            credentials: credentials,
            dossier: dossier1,
        });

        // delete Bookmark 1 for sender
        await deleteBookmarkByName({
            credentials: credentials,
            dossier: dossier1,
            name: 'Bookmark 1',
        });

        //switch user to recipient
        await libraryPage.switchUser(recipientCredentials);

        //apply shared link
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForItemLoading();

        //check default load view should be Bookmark 2
        since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe('Bookmark 2');
        await bookmark.openPanel();
        since('Current BM count should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(3);
        await bookmark.closePanel();

        //delete Bookmark 3 for sender
        await deleteBookmarkByName({
            credentials: credentials,
            dossier: dossier1,
            name: 'Bookmark 3',
        });

        //apply shared link and check default load view to be Boomark 2
        await dossierPage.closeTab(1);
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForItemLoading();
        since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe('Bookmark 2');
        await bookmark.openPanel();
        since('Current BM count should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(2);
        await bookmark.closePanel();

        //delete all BMs for sender
        await resetBookmarks({
            credentials: credentials,
            dossier: dossier1,
        });

        //apply shared link and check default load view to empty
        await dossierPage.closeTab(1);
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForItemLoading();
        since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isBookmarkLabelPresent())
            .toBe(false);
        await bookmark.openPanel();
        since('Current BM count should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(0);
        await bookmark.closePanel();
        await dossierPage.closeTab(1);
    });

    it('[TC68643] Verify apply shared bookmark when short-cut is deleted from sender', async () => {
        //create bookmarks for sender
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
        await libraryPage.switchUser(recipientCredentials);

        //delete short-cut for sender
        await libraryPage.removeDossierFromLibrary(credentials, dossier1);
        // delete short-cut for recipient
        await libraryPage.removeDossierFromLibrary(recipientCredentials, dossier1);

        //apply shared link
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForItemLoading();

        //add to library
        await dossierPage.addToLibrary();

        //check default load view should be base dossier without BM load
        since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isBookmarkLabelPresent())
            .toBe(false);
        await bookmark.openPanel();
        since('Current BM count should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(0);
        await bookmark.closePanel();

        //make changes for short-cut view
        await dossierPage.switchPageByKey('left', '5000');
        await dossierPage.goToLibrary();

        //apply shared link
        await dossierPage.closeTab(1);
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForItemLoading();

        //check it will load short-cut view without any bm applied
        since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['ShareBookmark_Xfunc', 'Chapter 1', 'Page 1']);
        since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isBookmarkLabelPresent())
            .toBe(false);
    });

    it('[TC68645] Verify apply shared bookmark from sender itself', async () => {
        //create bookmarks for sender
        await createBookmarks({
            bookmarkList: ['Bookmark 1', 'Bookmark 2', 'Bookmark 3', 'Bookmark 4'],
            credentials: credentials,
            dossier: dossier1,
        });

        const url = await generateSharedLink({
            credentials: credentials,
            dossier: dossier1,
        });

        //switch user to sender
        await libraryPage.switchUser(credentials);

        //apply shared link
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForItemLoading();

        //check no shared bm is added
        await bookmark.openPanel();
        since('Current shared BM count should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkCount('SHARED WITH ME'))
            .toBe(0);
        await bookmark.closePanel();
        await dossierPage.closeTab(1);
    });

    it('[TC68649] Verify share my&shared bookmarks in shared dialog', async () => {
        //create bookmarks for sender
        await createBookmarks({
            bookmarkList: [
                'Bookmark 1',
                'Bookmark 2',
                'Bookmark 3',
                'Bookmark 4',
                'Bookmark 5',
                'Bookmark 6',
                'Bookmark 7',
                'Bookmark 8',
                'Bookmark 9',
                'Bookmark 10',
            ],
            credentials: credentials,
            dossier: dossier1,
        });

        await createBookmarks({
            bookmarkList: ['Bookmark 1', 'Bookmark 2', 'Bookmark 3', 'Bookmark 4', 'Bookmark 5', 'Bookmark 6'],
            credentials: recipientCredentials,
            dossier: dossier1,
        });

        const url = await generateSharedLink({
            credentials: credentials,
            dossier: dossier1,
        });

        //switch user to recipient
        await libraryPage.switchUser(recipientCredentials);

        //apply shared link
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForItemLoading();

        //check total bookmark count
        await bookmark.confirmNotification();
        await bookmark.openPanel();
        since('Current shared BM count should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(16);
        await bookmark.closePanel();

        //open share panel and share dossier;
        await share.openSharePanel();
        await share.openShareDossierDialog();
        await shareDossier.openBMList();

        //check all selection is for my bookmark list
        await shareDossier.selectSharedBookmark(['All']);
        since('current selected count should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getSelectedCount())
            .toBe(7);

        //select shared bookmarks to trigger scroll on bm list
        await shareDossier.selectSharedBookmark(['Bookmark 2', 'Bookmark 3', 'Bookmark 4'], 'SHARED WITH ME');
        await shareDossier.hideBookmarkTimeStamp();
        await takeScreenshotByElement(
            shareDossier.getBMListDropDown(),
            'TC68649',
            'Share BM list for user has both my&shared BM on shared dialog',
            { tolerance: 0.2 }
        );
        await shareDossier.showBookmarkTimeStamp();

        //select more for shared bookmark list
        await shareDossier.selectSharedBookmark(
            ['Bookmark 5', 'Bookmark 6', 'Bookmark 7', 'Bookmark 8', 'Bookmark 9', 'Bookmark 10'],
            'SHARED WITH ME'
        );
        await shareDossier.waitForElementVisible(shareDossier.getBMErrorTooltip());
        since('current selected count should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getSelectedCount())
            .toBe(15);
        await shareDossier.selectSharedBookmark(['All']);
        since('current selected count should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getSelectedCount())
            .toBe(9);
        await shareDossier.closeShareBookmarkDropDown();
        await shareDossier.closeDialog();
        await share.closeSharePanel();
        await dossierPage.closeTab(1);
    });

    it('[TC68675] Verify manipulations on shared bookmarks', async () => {
        //create bookmarks for sender
        await createBookmarks({
            bookmarkList: ['Bookmark 1', 'Bookmark 2', 'Bookmark 3'],
            credentials: credentials,
            dossier: dossier1,
        });

        const url = await generateSharedLink({
            credentials: credentials,
            dossier: dossier1,
        });

        //switch user to recipient
        await libraryPage.switchUser(recipientCredentials);

        //apply shared link
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForItemLoading();

        //swipe pages on shared bookmark check bm label still applied
        //await bookmark.confirmNotification();
        await dossierPage.switchPageByKey('left', '3000');
        since('Current BM label on navigation bar should be #{expected}, instead we have #{actual} ')
            .expect(await bookmark.labelInTitle())
            .toBe('Bookmark 1');

        //hover on shared BM and check no update icon displayed
        await bookmark.openPanel();
        await bookmark.hoverOnBookmark('Bookmark 1', 'SHARED WITH ME');
        since(
            'Current update icon display for shared Bookmark 1 after swipe pages should be #{expected}, instead we have #{actual} '
        )
            .expect(await bookmark.isUpdateBMPresent('Bookmark 1', 'SHARED WITH ME'))
            .toBe(false);
        await bookmark.hideBookmarkTimeStamp();
        await takeScreenshotByElement(
            bookmark.getBookmark('Bookmark 1', 'SHARED WITH ME'),
            'TC68675',
            'Shared BM status after swipe pages',
            { tolerance: 0.41 }
        );
        await bookmark.showBookmarkTimeStamp();

        //change filter on shared Bookmark 1 and check no update icon displayed
        await bookmark.closePanel();
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Region');
        await checkboxFilter.selectElementByName('Central');
        await filterPanel.apply();
        since('Current BM label on navigation bar should be #{expected}, instead we have #{actual} ')
            .expect(await bookmark.isBookmarkLabelPresent())
            .toBe(false);
        await bookmark.openPanel();
        await bookmark.hoverOnBookmark('Bookmark 1', 'SHARED WITH ME');
        since(
            'Current update icon display for shared Bookmark 1 after swipe pages should be #{expected}, instead we have #{actual} '
        )
            .expect(await bookmark.isUpdateBMPresent('Bookmark 1', 'SHARED WITH ME'))
            .toBe(false);
        await bookmark.hideBookmarkTimeStamp();
        await takeScreenshotByElement(
            bookmark.getBookmark('Bookmark 1', 'SHARED WITH ME'),
            'TC68675',
            'Shared BM status after change filter',
            { tolerance: 0.41 }
        );
        await bookmark.showBookmarkTimeStamp();

        //switch bookmark and check no dialog pops up
        await bookmark.applyBookmark('Bookmark 2', 'SHARED WITH ME');
        await bookmark.openPanel();
        await bookmark.applyBookmark('Bookmark 1', 'SHARED WITH ME');

        //check data is not updated
        since('Page title for shared Bookmark 1should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['ShareBookmark_Xfunc', 'Chapter 1', 'Page 2']);
        await dossierPage.closeTab(1);
    });

    it('[TC69249] Verify new bookmark status on bookmark panel', async () => {
        //create bookmarks for sender
        await createBookmarks({
            bookmarkList: ['Bookmark 1', 'Bookmark 2', 'Bookmark 3'],
            credentials: credentials,
            dossier: dossier1,
        });

        const url = await generateSharedLink({
            credentials: credentials,
            dossier: dossier1,
        });

        //switch user to recipient
        await libraryPage.switchUser(recipientCredentials);

        //apply shared link
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForItemLoading();

        //check new bookmark icon and number
        await dossierPage.waitForElementVisible(bookmark.getNewBookmarkReminder());
        since('New bookmark number has not viewed should be #{expected}, instead we have #{actual} ')
            .expect(await bookmark.getNewBookmarkNumber())
            .toBe('2');

        //apply Bookmark2 and Bookmark3
        await bookmark.openPanel();
        await bookmark.applyBookmark('Bookmark 2', 'SHARED WITH ME');
        await bookmark.openPanel();
        await bookmark.applyBookmark('Bookmark 3', 'SHARED WITH ME');

        //check new bookmark icon
        since('New bookmark icon display should be #{expected}, instead we have #{actual} ')
            .expect(await bookmark.isNewBookmarkIconPresent())
            .toBe(false);

        //go to sender and update shared BMs
        await dossierPage.goToLibrary();

        //switch user sender
        await libraryPage.switchUser(credentials);

        //update sender's BMs
        await libraryPage.openDossier(dossier1.name);
        await bookmark.openPanel();
        await bookmark.applyBookmark('Bookmark 1');
        await dossierPage.switchPageByKey('left', '3000');
        await bookmark.openPanel();
        await bookmark.updateBookmark('Bookmark 1');
        await bookmark.closePanel();

        //back to library and switch to recipient
        await dossierPage.goToLibrary();
        await libraryPage.switchUser(recipientCredentials);

        //open dossier and check new bookmark icon
        await libraryPage.openDossier(dossier1.name);
        since('New bookmark icon display should be #{expected}, instead we have #{actual} ')
            .expect(await bookmark.isNewBookmarkIconPresent())
            .toBe(false);
        await libraryPage.closeTab(1);
    });
});

export const config = specConfiguration;
