import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import createBookmarks from '../../../api/createBookmarks.js';
import generateSharedLink from '../../../api/generateSharedLink.js';
import deleteBookmarkByName from '../../../api/deleteBookmarkByName.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_sender') };
const specConfiguration_Recipient = { ...customCredentials('_recipient') };

describe('ShareBookmark_ErrorHandling', () => {
    const dossier1 = {
        id: '769138044549B18100693B8736A557FE',
        name: 'ShareBookmark_ErrorHandling',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const { credentials } = specConfiguration;
    const { credentials: recipientCredentials } = specConfiguration_Recipient;

    let { loginPage, bookmark, dossierPage, libraryPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC68670] Verify share bookmark error handling', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier1,
        });
        await resetBookmarks({
            credentials: credentials,
            dossier: dossier1,
        });

        await resetBookmarks({
            credentials: recipientCredentials,
            dossier: dossier1,
        });

        await createBookmarks({
            bookmarkList: ['Bookmark 1', 'Bookmark 2', 'Bookmark 3', 'Bookmark 4', 'Bookmark 5'],
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

        //apply shared link again
        await dossierPage.closeTab(1);
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForItemLoading();

        //check error msg on BM notification
        since('Error msg for shared bookmarks with all have beed added should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isNotificationErrorPresent())
            .toBe(false);

        //delete Bookmark 1 for recipient
        await deleteBookmarkByName({
            credentials: recipientCredentials,
            dossier: dossier1,
            name: 'Bookmark 1',
        });

        //apply shared link again
        await dossierPage.closeTab(1);
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForItemLoading();

        //check error msg on BM notification
        since('Error msg for shared bookmarks with part of ones have beed added should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isNotificationErrorPresent())
            .toBe(false);

        //delete Bookmark 1 for sender
        await deleteBookmarkByName({
            credentials: credentials,
            dossier: dossier1,
            name: 'Bookmark 1',
        });

        //apply shared link again
        await dossierPage.closeTab(1);
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForItemLoading();

        //check error msg on BM notification
        since('Error msg for shared bookmarks with all have been added and part of ones have been deleted on sender should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.getNotificationErrorMessage())
            .toBe('1 bookmark was deleted and is no longer available.');
        await takeScreenshotByElement(
            bookmark.getNotification(),
            'TC68670',
            'Error msg for shared bookmarks with all have been added and part of ones have been deleted'
        );

        //reset recipient's bookmarks
        await resetBookmarks({
            credentials: recipientCredentials,
            dossier: dossier1,
        });

        //apply shared link again
        await dossierPage.closeTab(1);
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForItemLoading();

        //check error msg on BM notification
        since('Error msg for shared bookmarks with part of ones have been deleted on sender should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.getNotificationErrorMessage())
            .toBe('1 bookmark was deleted and is no longer available.');
        await takeScreenshotByElement(
            bookmark.getNotification(),
            'TC68670',
            'Error msg for shared bookmarks with part of ones have been deleted'
        );

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

        //delete bookmark4 for sender
        await deleteBookmarkByName({
            credentials: credentials,
            dossier: dossier1,
            name: 'Bookmark 4',
        });

        //apply shared link again
        await dossierPage.closeTab(1);
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForItemLoading();

        //check error msg on BM notification
        since('Error msg for shared bookmarks with part of ones have been deleted or added should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.getNotificationErrorMessage())
            .toBe('2 bookmarks were deleted and are no longer available.');
        await takeScreenshotByElement(
            bookmark.getNotification(),
            'TC68670',
            'Error msg for shared bookmarks with part of ones have been deleted or added'
        );

        //reset recipient's bookmarks
        await resetBookmarks({
            credentials: recipientCredentials,
            dossier: dossier1,
        });

        //delete all bookmarks for sender
        await resetBookmarks({
            credentials: credentials,
            dossier: dossier1,
        });

        //apply shared link again
        await dossierPage.closeTab(1);
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForItemLoading();

        //check error msg on BM notification
        since('Error msg for shared bookmarks with all have been deleted should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.getNotificationErrorMessage())
            .toBe('5 bookmarks were deleted and are no longer available.');
        await takeScreenshotByElement(
            bookmark.getNotification(),
            'TC68670',
            'Error msg for shared bookmarks with all have been deleted'
        );
    });
});

export const config = specConfiguration;
