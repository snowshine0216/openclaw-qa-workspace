import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import createBookmarks from '../../../api/createBookmarks.js';
import shareDossierToUsers from '../../../api/shareDossierToUsers.js';
import { designer2Credentials } from '../../../constants/index.js';
import users from '../../../testData/users.json' assert { type: 'json' };
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import generateSharedLink from '../../../api/generateSharedLink.js';

const specConfiguration = { ...customCredentials('_sender') };
const specConfiguration_Recipient = { ...customCredentials('_recipient') };
const specConfiguration_RecipientNoPrivillege = { ...customCredentials('_recipient_noprivillege') };

describe('ShareBookmark_Recipient', () => {
    const dossier1 = {
        id: '5C25295441B44B6A104DE5B29795BF57',
        name: 'ShareBookmark_Recipient',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const dossier2 = {
        id: '5C74EECC47E62B20DFADED96C08A5A81',
        name: 'ShareBookmark with Multiple Prompts',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossier3 = {
        id: '1A7FE16C4AA22F25B55923BC91D013E3',
        name: 'ShareBookmark_Recipient_NoPrivillege',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const report = {
        id: '23A623A446ADA0B52958FC81270132A2',
        name: 'Report with thredhold',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const { credentials } = specConfiguration;
    const { credentials: recipientCredentials } = specConfiguration_Recipient;
    const { credentials: recipientCredentialsWithNoCollaborationPrivilege } = specConfiguration_RecipientNoPrivillege;

    const promptName = 'Category';
    //send and recipient ID to publish dossier
    const sendername = credentials.username;
    const senderID = users[sendername].id;
    const recipientname = recipientCredentials.username;
    const recipientID = users[recipientname].id;
    const recipientNoPrivillegename = recipientCredentialsWithNoCollaborationPrivilege.username;
    const recipientNoPrivillegeID = users[recipientNoPrivillegename].id;

    let {
        loginPage,
        bookmark,
        libraryPage,
        infoWindow,
        dossierPage,
        promptEditor,
        prompt,
        promptObject,
        share,
        shareDossier,
        email,
    } = browsers.pageObj1;
    let cart = promptObject.shoppingCart;

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
            targetUserIds: [senderID, recipientID, recipientNoPrivillegeID],
            targetCredentialsList: [
                credentials,
                recipientCredentials,
                recipientCredentialsWithNoCollaborationPrivilege,
            ],
        });

        //re-login to update short-cut
        await libraryPage.switchUser(credentials);
    });

    afterEach(async () => {
        await dossierPage.closeAllTabs();
        await libraryPage.switchUser(credentials);
        await dossierPage.goToLibrary();
    });

    it('[TC68552] Verify recipient apply shared dossier without bookmark via copied link', async () => {
        //from IW to share dossier with empty BM list
        await libraryPage.moveDossierIntoViewPort(dossier1.name);
        await libraryPage.openDossierInfoWindow(dossier1.name);
        //share dossier via IW for empty BM list
        await infoWindow.shareDossier();
        //get copied link
        const url = await shareDossier.getLink();
        await shareDossier.closeDialog();
        await infoWindow.close();

        //switch user to recipient
        await libraryPage.switchUser(recipientCredentials);

        //remove dossier in recipient library home
        await libraryPage.removeDossierFromLibrary(recipientCredentials, dossier1);

        //apply shared link
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForDossierLoading();

        //add to library
        since ('bookmark tooltip should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.getBookmarkTooltipText())
            .toBe('To use bookmarks, add this dashboard to your Library or Favorites.');
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

        // swipe pages and back to library
        await dossierPage.switchPageByKey('left', '5000');
        await dossierPage.goToLibrary();
        await dossierPage.closeTab(1);

        //apply the same link again to check
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForDossierLoading();

        //check it will load short-cut view and no add to library button displayed
        since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['ShareBookmark_Recipient', 'Chapter 1', 'Page 1']);
        since('add to library button display should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);

        await dossierPage.closeTab(1);
    });

    it('[TC68555] Verify recipient apply shared dossier with single bookmark via copied link', async () => {
        //create single BM first
        await libraryPage.openDossier(dossier1.name);
        await bookmark.openPanel();
        await bookmark.addNewBookmark('');

        //share dossier with current bookmark
        await bookmark.shareBookmark('Bookmark 1');
        const url = await shareDossier.getLink();
        await shareDossier.closeDialog();
        await bookmark.closePanel();

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
        await bookmark.dismissNotification();
        //check bookmark panel
        await bookmark.openPanel();
        since('Bookmark list is supposed to be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(1);
        await bookmark.hideBookmarkTimeStamp();
        await takeScreenshotByElement(
            bookmark.getPanel(),
            'TC68555',
            'BM Panel after apply shared link with single BM',
            { tolerance: 0.2 }
        );
        await bookmark.showBookmarkTimeStamp();
        await bookmark.closePanel();

        // swipe pages and back to library
        await dossierPage.switchPageByKey('left', '5000');
        await dossierPage.goToLibrary();
        await dossierPage.closeTab(1);

        //apply the same link again to check
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForItemLoading();

        //check it will load Bookmark and no add to library button displayed
        since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['ShareBookmark_Recipient', 'Chapter 1', 'Page 2']);
        since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe('Bookmark 1');
        since('add to library button display should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
        await bookmark.openPanel();
        since('Bookmark list is supposed to be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(1);
        await bookmark.closePanel();

        await dossierPage.closeTab(1);
    });

    it('[TC68556] Verify recipient apply shared dossier with multiple bookmark via copied link', async () => {
        //create multiple BM first
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
                'Bookmark 11',
            ],
            credentials: credentials,
            dossier: dossier1,
        });

        await libraryPage.openDossier(dossier1.name);

        //open share panel and share dossier with all bookmarks;
        await share.openSharePanel();
        await share.openShareDossierDialog();
        await shareDossier.includeBookmark();
        await shareDossier.openBMList();
        await shareDossier.selectSharedBookmark(['All']);
        await shareDossier.closeShareBookmarkDropDown();

        //copy link
        const url = await shareDossier.getLink();
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
            .toBe(11);
        await bookmark.hideBookmarkTimeStamp();
        await takeScreenshotByElement(
            bookmark.getPanel(),
            'TC68556',
            'BM Panel after apply shared link with multiple BM',
            { tolerance: 0.4 }
        );
        await bookmark.showBookmarkTimeStamp();
        await bookmark.closePanel();

        // swipe pages and back to library
        await dossierPage.switchPageByKey('left', '5000');
        await dossierPage.goToLibrary();
        await dossierPage.closeTab(1);

        //apply the same link again to check
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForItemLoading();

        //check it will load Bookmark and no add to library button displayed
        since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['ShareBookmark_Recipient', 'Chapter 1', 'Page 2']);
        since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe('Bookmark 1');
        since('add to library button display should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
        await bookmark.openPanel();
        since('Bookmark list is supposed to be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(11);
        await bookmark.closePanel();

        await dossierPage.closeTab(1);
    });

    it('[TC68558] Verify recipient apply shared dossier without bookmark of prompt', async () => {
        await shareDossierToUsers({
            dossier: dossier2,
            credentials: designer2Credentials,
            targetUserIds: [senderID],
            targetCredentialsList: [credentials],
        });

        //resolve prompt answer first then create bm by API
        await libraryPage.openDossier(dossier2.name);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await dossierPage.goToLibrary();

        const url = await generateSharedLink({
            credentials: credentials,
            dossier: dossier2,
        });

        //switch user to recipient
        await libraryPage.switchUser(recipientCredentials);

        //remove dossier in recipient library home
        await libraryPage.removeDossierFromLibrary(recipientCredentials, dossier2);

        await libraryPage.switchToNewWindowWithUrl(url);

        //add to library
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await dossierPage.addToLibrary();

        //check no BM applied and BM list is 0
        since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isBookmarkLabelPresent())
            .toBe(false);
        await bookmark.openPanel();
        since('Bookmark list is supposed to be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkCount())
            .toBe(0);
        await bookmark.closePanel();

        // re-prompt and go back to library
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(promptName);

        await cart.clickElmInSelectedList(prompt, 'Books');
        await cart.removeSingle(prompt);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await dossierPage.goToLibrary();
        await dossierPage.closeTab(1);

        //apply the link again to check
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForItemLoading();

        //check it will load short-cut view and no add to library button displayed
        since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isBookmarkLabelPresent())
            .toBe(false);
        await bookmark.openPanel();
        since('Bookmark list is supposed to be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkCount())
            .toBe(0);
        since('add to library button display should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
        await bookmark.closePanel();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since(
            'For Shared link without BM, the prompt answer for [Category] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('Electronics, Movies, Music');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();

        await dossierPage.closeTab(1);
    });

    it('[TC68563] Verify recipient apply shared dossier with bookmark of prompt', async () => {
        await shareDossierToUsers({
            dossier: dossier2,
            credentials: designer2Credentials,
            targetUserIds: [senderID],
            targetCredentialsList: [credentials],
        });

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

        const url = await generateSharedLink({
            credentials: credentials,
            dossier: dossier2,
        });

        //switch user to recipient
        await libraryPage.switchUser(recipientCredentials);

        //remove dossier in recipient library home
        await libraryPage.removeDossierFromLibrary(recipientCredentials, dossier2);

        await libraryPage.switchToNewWindowWithUrl(url);

        //add to library
        await dossierPage.addToLibrary();
        //await browser.sleep(3000);

        //check BM applied and BM list is 4
        since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe('Bookmark 1');
        await bookmark.openPanel();
        since('Bookmark list is supposed to be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(4);
        await bookmark.closePanel();

        // re-prompt and go back to library
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(promptName);
        await cart.clickElmInSelectedList(prompt, 'Books');
        await cart.removeSingle(prompt);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await dossierPage.goToLibrary();
        await dossierPage.closeTab(1);

        //apply the link again to check
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForItemLoading();

        //check it will load bookmark view and no add to library button displayed
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
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since(
            'For Shared link without BM, the prompt answer for [Category] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('Books, Electronics, Movies, Music');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await dossierPage.closeTab(1);
    });

    it('[TC69178] Verify apply shared dossier with bookmarks via email link when collaboration server is off', async () => {
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

        //check shared msg in email, when collaboration server is off, the email template won't contain recipient name instead of ''
        since('Current shared message in email should be #{expected}, instead we have #{actual}')
            .expect(await email.getSharedMsg(''))
            .toEqual('Message: share bookmarks to recipient');

        //go to recipient email box and open the text link
        await email.openViewInBrowserLink('');

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
        await email.openViewInBrowserLink('');
        await email.clearMsgBox();

        //check it will load shared bookmark1 view and no add to library button displayed
        since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['ShareBookmark_Recipient', 'Chapter 1', 'Page 2']);
        since('add to library button display should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
    });

    it('[TC69527] Verify apply shared dossier without collaboration privillege', async () => {
        await resetDossierState({
            credentials: recipientCredentialsWithNoCollaborationPrivilege,
            dossier: dossier3,
        });

        //swipe pages for sender
        await libraryPage.openDossier(dossier1.name);
        await dossierPage.switchPageByKey('left', '3000');
        await dossierPage.goToLibrary();

        //create bookmarks for sender
        await createBookmarks({
            bookmarkList: ['Bookmark 1', 'Bookmark 2', 'Bookmark 3'],
            credentials: credentials,
            dossier: dossier1,
        });

        //generate shared link for dossier 1
        let url = await generateSharedLink({
            credentials: credentials,
            dossier: dossier1,
        });

        //switch user to recipient
        await libraryPage.switchUser(recipientCredentialsWithNoCollaborationPrivilege);

        // apply shared link
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForItemLoading();

        //check load short-cut view other than shared bookmark
        since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isBookmarkLabelPresent())
            .toBe(true);
        since('Page title for load view should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['ShareBookmark_Recipient', 'Chapter 1', 'Page 1']);

        //Check no shared bookmarks applied
        await bookmark.openPanel();
        since(
            'Current tootip of view previous shared bookmark for user with no privillege should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(3);
        await bookmark.closePanel();
        await dossierPage.closeTab(1);

        //generate shared link for dossier 3
        url = await generateSharedLink({
            credentials: credentials,
            dossier: dossier3,
        });

        //apply shared link again
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForItemLoading();

        //check load short-cut view other than shared bookmark
        since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isBookmarkLabelPresent())
            .toBe(true);
        since('Page title for load view should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['ShareBookmark_Recipient_NoPrivillege', 'Chapter 1', 'Page 2']);
        

        //Check no shared bookmarks applied
        await bookmark.openPanel();
        await bookmark.hoverOnBookmark('Bookmark 2', 'SHARED WITH ME');
        since('Share shared bookmark for user with no privillege should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isSharedBMPresent('Bookmark 2', 'SHARED WITH ME'))
            .toBe(true);
        since('Delete shared bookmark for user with no privillege should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isDeleteBMPresent('Bookmark 2', 'SHARED WITH ME'))
            .toBe(true);
        await takeScreenshotByElement(bookmark.getPanel(), 'TC69527', 'BM panel for recipient with no privillege');
        await bookmark.shareBookmark('Bookmark 2', 'SHARED WITH ME');
        since('default secelted bookmark for shared dialog should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getCurrentSelection())
            .toBe('Bookmark 2');
        await shareDossier.closeDialog();
        await bookmark.closePanel();
        await dossierPage.closeTab(1);
    });

    it('[TC82219] Validate share report on Library Web', async () => {
        //open share dialog from IW panel
        await libraryPage.moveDossierIntoViewPort(report.name);
        await libraryPage.openDossierInfoWindow(report.name);
        await infoWindow.shareDossier();

        //check no share BM section on Report share dialog
        since('share button status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isShareButtonEnabled())
            .toBe(false);
        since('share bookmark section should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isIncludeBMPresent())
            .toBe(false);
        since('share dialog title should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getShareDialogTitle())
            .toBe('Share Report');
        since('shared url should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getLink())
            .toContain(browser.options.baseUrl);
        await shareDossier.hideSharedUrl();
        await takeScreenshotByElement(shareDossier.getShareDossierDialog(), 'TC82219', 'Share Dialog for Report', {
            tolerance: 0.21,
        });
        await shareDossier.showSharedUrl();

        await shareDossier.closeDialog();
        await infoWindow.close();

        //check share report inside report
        //open share panel and share dossier;
        await libraryPage.openDossier(report.name);
        await share.openSharePanel();
        //check BM list is hidden
        since('Share button text should be #{expected}, instead we have #{actual}')
            .expect(await share.getShareButtonText())
            .toBe('Share Report');
        await share.openShareDossierDialog();
        // check BM list is hidden
        since('share button status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isShareButtonEnabled())
            .toBe(false);
        since('share bookmark section should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isIncludeBMPresent())
            .toBe(false);

        // select recipient and generate copied link
        await shareDossier.searchRecipient('winky');
        await shareDossier.selectGroupRecipient("Winky's Group");
        since('share button status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isShareButtonEnabled())
            .toBe(true);
        const url = await shareDossier.getLink();
        await shareDossier.closeDialog();
        await share.closeSharePanel();

        //switch user to recipient
        await libraryPage.switchUser(recipientCredentials);

        //remove dossier in recipient library home
        await libraryPage.removeDossierFromLibrary(recipientCredentials, report, false);

        //apply shared link
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForItemLoading();

        //add to library
        await dossierPage.addToLibrary();
        await dossierPage.goToLibrary();
    });
});

export const config = specConfiguration;
