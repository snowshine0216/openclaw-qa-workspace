/* eslint-disable @typescript-eslint/no-floating-promises */
import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import createBookmarks from '../../../api/createBookmarks.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_sender') };
const specConfiguration_NoPrivillege = { ...customCredentials('_NoPrivillege') };

describe('ShareBookmark_Sender', () => {
    const dossier1 = {
        id: '77E076E34A7527077088FFB9F2A5A6C9',
        name: 'ShareBookmark',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document = {
        id: 'B12060C34620C772BE6648892B329D1E',
        name: 'RWD_ShareBookmark',
        project: {
            id: 'B12060C34620C772BE6648892B329D1E',
            name: 'MicroStrategy Tutorial',
        },
    };

    const { credentials } = specConfiguration;
    const { credentials: senderWithNoCollaborationPrivilege } = specConfiguration_NoPrivillege;

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
        await loginPage.login(credentials);
    });

    beforeEach(async () => {
        //login to sender
        await libraryPage.switchUser(credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC63557] Verify share dossier dialog through share panel, bookmark panel and info window', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier1,
        });
        await resetBookmarks({
            credentials: credentials,
            dossier: dossier1,
        });

        //from IW to share dossier with empty BM list
        await libraryPage.moveDossierIntoViewPort(dossier1.name);
        await libraryPage.openDossierInfoWindow(dossier1.name);

        //share dossier via IW for empty BM list
        await infoWindow.shareDossier();
        since('share button status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isShareButtonEnabled())
            .toBe(false);
        since('share bookmark section should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isIncludeBMPresent())
            .toBe(false);
        since('share dialog title should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getShareDialogTitle())
            .toBe('Share Dashboard');
        since('shared url should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getLink())
            .toContain(browser.options.baseUrl);
        await shareDossier.hideSharedUrl();
        await takeScreenshotByElement(
            shareDossier.getShareDossierDialog(),
            'TC65337',
            'Share dialog with empty bookmark',
            { tolerance: 0.2 }
        );
        await shareDossier.showSharedUrl();

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
        await takeScreenshotByElement(shareDossier.getCopiedTooltip(), 'TC63557', 'Tooltip of copied link');
        await shareDossier.closeDialog();
        await infoWindow.close();

        //open dossier and share dossier via share panel for single list

        //create single BM first
        await libraryPage.openDossier(dossier1.name);
        await bookmark.openPanel();
        await bookmark.addNewBookmark('');
        await bookmark.closePanel();

        //open share panel and share dossier;
        await share.openSharePanel();
        since('Share button text should be #{expected}, instead we have #{actual}')
            .expect(await share.getShareButtonText())
            .toBe('Share Dashboard');
        await share.openShareDossierDialog();
        // DE322299
        await takeScreenshotByElement(
            shareDossier.getDossierCoverImage(),
            'TC63557',
            'Cover image of dossier for share dialog inside share panel',
            { tolerance: 0.2 }
        );
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
        await shareDossier.closeDialog();
        await share.closeSharePanel();

        //create multiple BMs and share multiple one
        await bookmark.openPanel();
        await bookmark.createBookmarksByDefault(3);
        await bookmark.closePanel();

        //share dossier from BM panel
        await bookmark.openPanel();
        await bookmark.shareBookmark('Bookmark 2');
        //check default selection should be hovered one other than current applied BM
        since('current selected shared BM should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getCurrentSelectionText())
            .toBe('Bookmark 2');

        //select multiple ones
        await shareDossier.openBMList();
        await shareDossier.selectSharedBookmark(['Bookmark 1', 'Bookmark 2', 'Bookmark 3']);
        since('Included bookmark list should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getSelectedList())
            .toEqual(['Bookmark 1', 'Bookmark 3']);
        await shareDossier.closeShareBookmarkDropDown();
        await shareDossier.closeDialog();
        await bookmark.closePanel();
    });

    it('[TC63558] Verify share bookmark section in share dossier dialog', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier1,
        });

        await resetBookmarks({
            credentials: credentials,
            dossier: dossier1,
        });

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
                'bookmark with long long long long long long long long long long long name',
            ],
            credentials: credentials,
            dossier: dossier1,
        });

        //open share panel and share dossier;
        await libraryPage.openDossier(dossier1.name);
        await share.openSharePanel();
        await share.openShareDossierDialog();
        //check BM list is hidden
        since('BM list should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isBMListPresent())
            .toBe(false);
        await shareDossier.includeBookmark();
        await shareDossier.openBMList();
        await shareDossier.selectSharedBookmark([
            'bookmark with long long long long long long long long long long long name',
        ]);
        await shareDossier.hideBookmarkTimeStamp();
        await shareDossier.hideSharedUrl();
        await takeScreenshotByElement(shareDossier.getShareDossierDialog(), 'TC65338', 'Share BM with long name', {
            tolerance: 0.2,
        });
        await shareDossier.showSharedUrl();

        // deselect all for list less than 15 elements
        await shareDossier.selectSharedBookmark(['All']);
        since('current selected text should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getCurrentSelectionText())
            .toBe('Please select a bookmark');
        since('current selected count should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getSelectedCount())
            .toBe(0);

        //select all for list less than 15 elements
        await shareDossier.selectSharedBookmark(['All']);
        since('current selected text should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getCurrentSelectionText())
            .toBe('Bookmark 1 and 10 more');
        since('current selected count should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getSelectedCount())
            .toBe(11);
        await takeScreenshotByElement(
            shareDossier.getBMListDropDown(),
            'TC65338',
            'Select All BM with list less than 15',
            { tolerance: 0.4 }
        );
        await shareDossier.showBookmarkTimeStamp();

        // partially select 'all'
        await shareDossier.selectSharedBookmark(['Bookmark 1', 'Bookmark 10']);
        since('current selected count should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getSelectedCount())
            .toBe(9);

        // close bookmark dropdown
        await shareDossier.closeShareBookmarkDropDown();
        await shareDossier.closeDialog();
        await share.closeSharePanel();

        //create more bookmarks
        await createBookmarks({
            bookmarkList: [
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

        // select all for list greater than 15 elements
        await share.openSharePanel();
        await share.openShareDossierDialog();
        await shareDossier.includeBookmark();
        await shareDossier.openBMList();
        await shareDossier.selectSharedBookmark(['All']);
        since('current selected text should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getCurrentSelectionText())
            .toBe('Bookmark 1 and 14 more');
        since('current selected count should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getSelectedCount())
            .toBe(15);
        await shareDossier.hideBookmarkTimeStamp();
        await takeScreenshotByElement(
            shareDossier.getBMListDropDown(),
            'TC65338',
            'Select All BM with list greater than 15',
            { tolerance: 0.4 }
        );
        await shareDossier.selectSharedBookmark(['Bookmark 8']);
        await takeScreenshotByElement(
            shareDossier.getBMListDropDown(),
            'TC65338',
            'Select One More BM with selection greater than 15',
            { tolerance: 0.45 }
        );
        await shareDossier.showBookmarkTimeStamp();
        since('current selected count should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getSelectedCount())
            .toBe(15);

        //close BM drop-down and share dossier dialog
        await shareDossier.closeShareBookmarkDropDown();
        await shareDossier.closeDialog();
        await share.closeSharePanel();
    });

    it('[TC68462] Verify add recipient section in share dossier dialog', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier1,
        });

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

        //expand group to check remove duplicated users in search result
        since('Default group member list with no expand should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isGroupMemberPresent("Winky's Group"))
            .toBe(false);

        await shareDossier.expandGroup("Winky's Group");

        //xinhu4 and copy of xinhu4 has been added both under child group but only appear once for search result
        since('Winky group list should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getGroupMemberCount("Winky's Group"))
            .toBe('4');

        //add group user
        await shareDossier.selectGroupRecipient("Winky's Group");

        //deselect group member
        await shareDossier.dismissRecipientSearchList();
        await shareDossier.searchRecipient('winky');

        //check group member has been cached already
        since('Default group member list with expand should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getGroupMemberCount("Winky's Group"))
            .toBe('4');
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
        await takeScreenshotByElement(
            shareDossier.getSearchUserList(),
            'TC68462',
            'Partially check All selection for group user'
        );

        //deselect all
        await shareDossier.slelectAllForGroupRecipient("Winky's Group");
        //check group selection status
        since('Current group selection status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getGroupCheckBoxStatus("Winky's Group"))
            .toBe('false');
        await takeScreenshotByElement(
            shareDossier.getSearchUserList(),
            'TC68462',
            'Uncheck All selection for group user'
        );

        //select all
        await shareDossier.slelectAllForGroupRecipient("Winky's Group");
        //check group selection status
        since('Current group selection status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getGroupCheckBoxStatus("Winky's Group"))
            .toBe('true');
        await takeScreenshotByElement(
            shareDossier.getSearchUserList(),
            'TC68462',
            'Check All selection for group user'
        );

        //dismiss search box
        await shareDossier.dismissRecipientSearchList();

        //add new group member
        await shareDossier.searchRecipient('Test1');
        await shareDossier.selectRecipients(['Copy of xinhu4', 'xinhu4'], 'Test1');
        await shareDossier.dismissRecipientSearchList();

        //search group with empty users
        await shareDossier.searchRecipient('web');
        await shareDossier.expandGroup('Web');
        since('Web group list should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getGroupMemberCount('Web'))
            .toBe('0');
        since('Web group list should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isGroupItemDisabled('Web'))
            .toBe(true);
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
        await infoWindow.close();
    });

    it('[TC68551] Verify share dialog for RWD', async () => {
        //open share dialog from IW panel
        await libraryPage.moveDossierIntoViewPort(document.name);
        await libraryPage.openDossierInfoWindow(document.name);
        await infoWindow.shareDossier();

        //check no share BM section on RWD share dialog
        since('share button status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isShareButtonEnabled())
            .toBe(false);
        since('share bookmark section should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isIncludeBMPresent())
            .toBe(false);
        since('share dialog title should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getShareDialogTitle())
            .toBe('Share Document');
        since('shared url should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getLink())
            .toContain(browser.options.baseUrl);
        await shareDossier.hideSharedUrl();
        await takeScreenshotByElement(shareDossier.getShareDossierDialog(), 'TC68551', 'Share Dialog for RWD', {
            tolerance: 0.2,
        });
        await shareDossier.showSharedUrl();

        await shareDossier.closeDialog();
        await infoWindow.close();

        //check share RWD inside RWD
        //open share panel and share dossier;
        await libraryPage.openDossier(document.name);
        await share.openSharePanel();
        //check BM list is hidden
        since('Share button text should be #{expected}, instead we have #{actual}')
            .expect(await share.getShareButtonText())
            .toBe('Share Document');
        await share.openShareDossierDialog();
        //check BM list is hidden
        since('share button status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isShareButtonEnabled())
            .toBe(false);
        since('share bookmark section should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isIncludeBMPresent())
            .toBe(false);
        await shareDossier.closeDialog();
        await share.closeSharePanel();
    });

    it('[TC68568] Verify share dossier for sender without use collaboration privilege', async () => {
        //switch to user without use collaboration privilege

        await libraryPage.switchUser(senderWithNoCollaborationPrivilege);

        await resetDossierState({
            credentials: senderWithNoCollaborationPrivilege,
            dossier: dossier1,
        });
        await resetBookmarks({
            credentials: senderWithNoCollaborationPrivilege,
            dossier: dossier1,
        });

        //create BM first
        await libraryPage.openDossier(dossier1.name);
        await bookmark.openPanel();
        await bookmark.addNewBookmark('');

        //check no shared icon inside BM item
        await bookmark.hoverOnBookmark('Bookmark 1');
        since('share icon for bookmark item should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isSharedIconPresent('Bookmark 1'))
            .toBe(true);
        await bookmark.closePanel();

        //open share dialog and check no include bookmark section
        await share.openSharePanel();
        await share.openShareDossierDialog();
        //check no share BM section on RWD share dialog
        since('share button status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isShareButtonEnabled())
            .toBe(false);
        since('share bookmark section should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isIncludeBMPresent())
            .toBe(true);
        await shareDossier.closeDialog();
        await share.closeSharePanel();
    });

    it('[TC69557] Verify default bookmark selection in shared dialog after manipulation on current applied bookmark', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier1,
        });
        await resetBookmarks({
            credentials: credentials,
            dossier: dossier1,
        });

        //create BM first
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

        //close share dialog and swipe pages on current applied bookmark
        await shareDossier.closeDialog();
        await share.closeSharePanel();
        await dossierPage.switchPageByKey('left', '3000');

        //check default selection should be current applied BM
        await share.openSharePanel();
        await share.openShareDossierDialog();
        since(
            'current selected shared BM after swipe page on current applied BM should be #{expected}, instead we have #{actual}'
        )
            .expect(await shareDossier.getCurrentSelectionText())
            .toBe('Bookmark 1');

        //close share dialog and change filter on current applied bookmark
        await shareDossier.closeDialog();
        await share.closeSharePanel();
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Region');
        await checkboxFilter.selectElementByName('Central');
        await filterPanel.apply();

        //check no BM selection
        await share.openSharePanel();
        await share.openShareDossierDialog();
        since(
            'current selected shared BM after change filter on current applied BM should be #{expected}, instead we have #{actual}'
        )
            .expect(await shareDossier.isBMListPresent())
            .toBe(false);
        await shareDossier.closeDialog();
        await bookmark.closePanel();
        await bookmark.openPanel();
        await bookmark.updateBookmark('Bookmark 1');
        await bookmark.closePanel();
    });
});

export const config = specConfiguration;
