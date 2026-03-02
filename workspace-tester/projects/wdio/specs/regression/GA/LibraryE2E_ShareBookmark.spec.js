/* eslint-disable @typescript-eslint/no-floating-promises */
import { customCredentials, designer2Credentials } from '../../../constants/index.js';
import createBookmarks from '../../../api/createBookmarks.js';
import shareDossierToUsers from '../../../api/shareDossierToUsers.js';
import users from '../../../testData/users.json' assert { type: 'json' };
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';
import Share from '../../../pageObjects/dossier/Share.js';

const specConfiguration = { ...customCredentials('_sender') };

describe('LibraryE2E_ShareBookmark', () => {
    const dossier1 = {
        id: '5C5D26034F97DB0D2922AF87CA1D1144',
        name: 'ShareBookmark_E2E',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const { credentials } = specConfiguration;

    const recipientCredentials = {
        username: 'tester_auto_recipient',
        password: '',
    };
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const sendername = credentials.username;
    const senderID = users[sendername].id;
    const recipientname = recipientCredentials.username;
    const recipientID = users[recipientname].id;

    let {
        loginPage,
        bookmark,
        libraryPage,
        infoWindow,
        dossierPage,
        filterPanel,
        checkboxFilter,
        share,
        shareDossier,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
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

        //re-login to update short-cut
        await libraryPage.switchUser(credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it(
        '[TC69896] End to End Test Case for share bookmark on Library Web',
        async () => {
            //from IW to share dossier with empty BM list
            await libraryPage.moveDossierIntoViewPort(dossier1.name);
            await libraryPage.openDossierInfoWindow(dossier1.name);
            await takeScreenshotByElement(infoWindow.getActionIcons(), 'TC69896', 'ShareButton in IW', {
                tolerance: 0.2,
            });

            //share dossier via IW for empty BM list
            await infoWindow.shareDossier();
            since('share button status should be #{expected}, instead we have #{actual}')
                .expect(await shareDossier.isShareButtonEnabled())
                .toBe(false);
            since('share bookmark section should be #{expected}, instead we have #{actual}')
                .expect(await shareDossier.isIncludeBMPresent())
                .toBe(false);

            //add msg and check share button status
            await shareDossier.addMessage('test msg');
            since('share button status should be #{expected}, instead we have #{actual}')
                .expect(await shareDossier.isShareButtonEnabled())
                .toBe(false);

            //add recipient and check share button status
            await shareDossier.searchRecipient('winky');
            await shareDossier.selectGroupRecipient("Winky's Group");
            since('share button status should be #{expected}, instead we have #{actual}')
                .expect(await shareDossier.isShareButtonEnabled())
                .toBe(true);

            //copy link
            await shareDossier.copyLink();

            //get copied link
            let url = await shareDossier.getLink();
            await shareDossier.closeDialog();
            await infoWindow.close();

            //switch user to recipient
            await libraryPage.switchUser(recipientCredentials);

            //remove dossier in recipient library home
            await libraryPage.removeDossierFromLibrary(recipientCredentials, dossier1);

            //apply shared link
            await libraryPage.switchToNewWindowWithUrl(url);
            await dossierPage.waitForItemLoading();

            //add to library
            await dossierPage.addToLibrary();

            //check no BM applied and BM list is empty
            since('No bookmark is applied currently')
                .expect(await bookmark.isBookmarkLabelPresent())
                .toBe(false);
            await bookmark.openPanel();
            since('Bookmark list is supposed to be 0')
                .expect(await bookmark.bookmarkCount())
                .toBe(0);
            await bookmark.closePanel();

            //back to library
            await dossierPage.goToLibrary();
            await dossierPage.closeTab(1);

            if (libraryPage.isSafari()) {
                // safari will get blank randomly when close tab
                await browser.url(browser.options.baseUrl);
            }

            //switch to sender
            await libraryPage.switchUser(credentials);

            //open dossier and share dossier via share panel for single list
            //create single BM first
            await libraryPage.openDossier(dossier1.name);
            await bookmark.openPanel();
            await bookmark.addNewBookmark('');
            await bookmark.closePanel();

            //open share panel and share dossier;
            await share.openSharePanel();
            await share.openShareDossierDialog();
            //check default selection should be current applied BM
            since('current selected shared BM should be #{expected}, instead we have #{actual}')
                .expect(await shareDossier.getCurrentSelectionText())
                .toBe('Bookmark 1');
            await shareDossier.openBMList();
            //check no all option for single BM list
            since('all selection should be #{expected}, instead we have #{actual}')
                .expect(await shareDossier.isAllOptionPresent())
                .toBe(false);
            await shareDossier.closeShareBookmarkDropDown();
    

            //get copied link
            url = await shareDossier.getLink();
            await shareDossier.closeDialog();
            await share.closeSharePanel();

            //switch user to recipient
            await dossierPage.goToLibrary();
            await libraryPage.switchUser(recipientCredentials);

            //remove dossier in recipient library home
            await libraryPage.removeDossierFromLibrary(recipientCredentials, dossier1);

            //apply shared link
            await libraryPage.switchToNewWindowWithUrl(url);
            await dossierPage.waitForItemLoading();

            //check BM applied and BM list is 1
            since('Current BM label on navigation bar should be #{expected}, instead we have #{actual} ')
                .expect(await bookmark.labelInTitle())
                .toBe('Bookmark 1');

            //check default bookmark selection for shared dialog is empty
            await share.openSharePanel();
            await share.openShareDossierDialog();
            since(
                'current selected shared BM before click add to library for load shared bookmarks should be #{expected}, instead we have #{actual}'
            )
                .expect(await shareDossier.isBMListPresent())
                .toBe(false);
            await shareDossier.closeDialog();
            await share.closeSharePanel();
            

            //add to library
            await dossierPage.addToLibrary();
            await dossierPage.waitForItemLoading();

            //check bookmark panel
            since('new bookmark icon display should be #{expected}, instead we have #{actual}')
                .expect(await bookmark.isNewBookmarkIconPresent())
                .toBe(false);
            //confirm bookmark tooltip
            await bookmark.confirmNotification();
            await bookmark.openPanel();
            since('Bookmark list is supposed to be #{expected}, instead we have #{actual}')
                .expect(await bookmark.bookmarkTotalCount())
                .toBe(1);
            await bookmark.hoverOnBookmark('Bookmark 1', 'SHARED WITH ME');
            since('Shared button for shared bookmark dislay is supposed to be #{expected}, instead we have #{actual}')
                .expect(await bookmark.isSharedBMPresent('Bookmark 1', 'SHARED WITH ME'))
                .toBe(true);
            since('Delete button for shared bookmark dislay is supposed to be #{expected}, instead we have #{actual}')
                .expect(await bookmark.isDeleteBMPresent('Bookmark 1', 'SHARED WITH ME'))
                .toBe(true);
            await bookmark.closePanel();

            // swipe pages and back to library
            await dossierPage.switchPageByKey('left', '5000');
            await dossierPage.goToLibrary();
            await dossierPage.closeTab(1);

            if (libraryPage.isSafari()) {
                // safari will get blank randomly when close tab
                await browser.url(browser.options.baseUrl);
            }

            //switch to sender
            await libraryPage.switchUser(credentials);

            //create multiple BM first
            await createBookmarks({
                bookmarkList: [
                    'Bookmark 2',
                    'Bookmark 3',
                    'Bookmark 4',
                    'Bookmark 5',
                    'Bookmark 6',
                    'Bookmark 7',
                    'Bookmark 8',
                    'Bookmark 9',
                    'Bookmark 10',
                    'Bookmark 11',
                    'Bookmark 12',
                    'Bookmark 13',
                    'Bookmark 14',
                    'Bookmark 15',
                    'Bookmark 16',
                    'Bookmark 17',
                    'Bookmark 18',
                ],
                credentials: credentials,
                dossier: dossier1,
            });

            //open dossier and open bookmark panel
            await libraryPage.openDossier(dossier1.name);

            //share dossier from BM panel
            await bookmark.openPanel();
            await bookmark.shareBookmark('Bookmark 2');
            //check default selection should be hovered one other than current applied BM
            since('current selected shared BM should be #{expected}, instead we have #{actual}')
                .expect(await shareDossier.getCurrentSelectionText())
                .toBe('Bookmark 2');

            // partially select 'all'
            await shareDossier.openBMList();
            await shareDossier.selectSharedBookmark(['Bookmark 1', 'Bookmark 10']);
            since('current selected count should be #{expected}, instead we have #{actual}')
                .expect(await shareDossier.getSelectedCount())
                .toBe(3);

            // deselect all for list more than 15 elements
            await shareDossier.selectSharedBookmark(['All']);
            since('current selected text should be #{expected}, instead we have #{actual}')
                .expect(await shareDossier.getCurrentSelectionText())
                .toBe('Please select a bookmark');
            since('current selected count should be #{expected}, instead we have #{actual}')
                .expect(await shareDossier.getSelectedCount())
                .toBe(0);

            // select all for list greater than 15 elements
            await shareDossier.selectSharedBookmark(['All']);
            since('current selected text should be #{expected}, instead we have #{actual}')
                .expect(await shareDossier.getCurrentSelectionText())
                .toBe('Bookmark 1 and 14 more');
            since('current selected count should be #{expected}, instead we have #{actual}')
                .expect(await shareDossier.getSelectedCount())
                .toBe(15);
            await shareDossier.selectSharedBookmark(['Bookmark 9']);
            since('current selected count should be #{expected}, instead we have #{actual}')
                .expect(await shareDossier.getSelectedCount())
                .toBe(15);
            await shareDossier.closeShareBookmarkDropDown();

            //get copied link
            url = await shareDossier.getLink();
            await shareDossier.closeDialog();
            await bookmark.closePanel();

            //switch user to recipient
            await dossierPage.goToLibrary();
            await libraryPage.switchUser(recipientCredentials);

            //apply shared link
            await libraryPage.switchToNewWindowWithUrl(url);
            await dossierPage.waitForItemLoading();

            //check it will load Bookmark and no add to library button displayed
            since('Page title should be #{expected}, instead we have #{actual}')
                .expect(await dossierPage.pageTitle())
                .toEqual(['ShareBookmark_E2E', 'Chapter 1', 'Page 2']);
            since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
                .expect(await bookmark.labelInTitle())
                .toBe('Bookmark 1');
            since('add to library button display should be #{expected}, instead we have #{actual}')
                .expect(await dossierPage.isAddToLibraryDisplayed())
                .toBe(false);
            since('new bookmark icon display should be #{expected}, instead we have #{actual}')
                .expect(await bookmark.isNewBookmarkIconPresent())
                .toBe(true);
            since(
                'Tooltip for shared bookmark applied partially successfully dislay is supposed to be #{expected}, instead we have #{actual}'
            )
                .expect(await bookmark.isNotificationPresent())
                .toBe(false);
            since(
                'Error msg for shared bookmark applied partially successfully dislay is supposed to be #{expected}, instead we have #{actual}'
            )
                .expect(await bookmark.isNotificationErrorPresent())
                .toBe(false);
            await bookmark.openPanel();
            since('Bookmark list is supposed to be #{expected}, instead we have #{actual}')
                .expect(await bookmark.bookmarkTotalCount())
                .toBe(15);

            //share shared bookmark
            await bookmark.shareBookmark('Bookmark 3', 'SHARED WITH ME');
            since('default secelted bookmark for shared dialog should be #{expected}, instead we have #{actual}')
                .expect(await shareDossier.getCurrentSelection())
                .toBe('Bookmark 3');
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

            //change filter on shared Bookmark 1 and check no update icon displayed
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
                'Current update icon display for shared Bookmark 1 after change filter  should be #{expected}, instead we have #{actual} '
            )
                .expect(await bookmark.isUpdateBMPresent('Bookmark 1', 'SHARED WITH ME'))
                .toBe(false);

            //switch bookmark and check no dialog pops up
            await bookmark.applyBookmark('Bookmark 2', 'SHARED WITH ME');

            //delete shared bookmark
            await bookmark.openPanel();
            await bookmark.deleteBookmark('Bookmark 1', 'SHARED WITH ME');

            //bulk delete all bookmarks
            await bookmark.editBulkDeleteBookmarks();
            await bookmark.selectAllToDelete();
            await bookmark.bulkDeleteBookmarks();
            since('Confirmation msg for bulk delete should be #{expected}, instead we have #{actual}')
                .expect(await bookmark.getDeleteConfirmMsg())
                .toBe('Are you sure you want to delete? Any associated subscriptions will also be deleted.');
            await bookmark.confirmDelete();
            await bookmark.closePanel();
            await dossierPage.closeTab(1);

            if (libraryPage.isSafari()) {
                // safari will get blank randomly when close tab
                await browser.url(browser.options.baseUrl);
            }
        },
        10 * 60 * 1000
    );
    // enlarge the timeout interval to 10 mins, the default timeout is less than 6 min, which causes :
    // 'Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL';
    // The duration of this TC on Safari is around 8mins.
});

export const config = specConfiguration;
