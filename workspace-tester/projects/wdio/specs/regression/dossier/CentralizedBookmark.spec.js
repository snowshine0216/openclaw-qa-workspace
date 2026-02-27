import { customCredentials, downloadDirectory } from '../../../constants/index.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import createBookmarks from '../../../api/createBookmarks.js';
import generateSharedLink from '../../../api/generateSharedLink.js';
import deleteAllBookmarkFavorites from '../../../api/deleteAllBookmarkFavorites.js';
import clearUserSnapshots from '../../../api/snapshot/clearUserSnapshots.js';
import deleteBookmarkByName from '../../../api/deleteBookmarkByName.js';
import changeDossierCoverImage from '../../../api/changeDossierCoverImage.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_bookmark') };
const specConfiguration_sender = { ...customCredentials('_sender') };

describe('Centralized Bookmark', () => {
    const project = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };
    const RWD = {
        id: 'A85A782F49A2DF897B37D6A3850BD488',
        name: 'RWD',
        project: project,
    };

    const report = {
        id: '1CAF4DE44BB9B38611E3988C27AF9FE6',
        name: 'Report',
        project: project,
    };

    const dossier = {
        id: 'EB02C509C24944B7ABF3EF9E7EF04F75',
        name: 'Bookmark',
        project: project,
    };

    const dossierFromSender = {
        id: '7FBD49B2486AEE15F146828D77139980',
        name: 'Bookmark_Shared',
        project: project,
    };

    let {
        libraryPage,
        bookmark,
        librarySearch,
        sidebar,
        dossierPage,
        loginPage,
        snapshotsPage,
        bookmarkBlade,
        shareDossier,
        coverImageDialog,
    } = browsers.pageObj1;

    const credentials = specConfiguration.credentials;
    const credentials_sender = specConfiguration_sender.credentials;

    beforeAll(async () => {
        await loginPage.login(credentials);
    });

    beforeEach(async () => {
        await libraryPage.executeScript('window.localStorage.clear();');
        await libraryPage.switchUser(credentials);
        // delete all bookmars
        await resetBookmarks({
            credentials: credentials,
            dossier: report,
            type: 'report',
        });
        
        await resetBookmarks({
            credentials: credentials,
            dossier: RWD,
        });

        await resetBookmarks({
            credentials: credentials,
            dossier: dossier,
        });

        await resetBookmarks({
            credentials: credentials_sender,
            dossier: dossierFromSender,
        });

        await resetBookmarks({
            credentials: credentials,
            dossier: dossierFromSender,
        });

        // delete all bookmark favorites
        await deleteAllBookmarkFavorites(credentials);

        // clear all user snapshots
        await clearUserSnapshots({
            credentials: [credentials],
        });

    });

    afterEach(async () => {
        //await libraryPage.resetToLibraryHome();
    });

    afterAll(async () => {
    });

    it('[TC56656_01] Bookmark Blade - create/sort/filter/search', async () => {
        // check the empty bookmark list
        await libraryPage.openSidebar();
        await sidebar.openBookmarkSectionList();
        await since('Bookmark section content display should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getEmptyLibraryMessage())
            .toBe('Your bookmarks will appear here.');
        // create kinds of bookmarks first by API
        await createBookmarks({
            bookmarkList: [
                'DossierBookmark',
            ],
            credentials: credentials,
            dossier: dossier,
        });

        await createBookmarks({
            bookmarkList: [
                'RWDBookmark',
            ],
            credentials: credentials,
            dossier: RWD,
        });

        await createBookmarks({
            bookmarkList: [
                'ReportBookmark',
            ],
            credentials: credentials,
            dossier: report,
            type: 'report',
        });

        // check bookmark blade list
        await libraryPage.refresh();
        since('bookmark number in sidebar should be #{expected}, while we get #{actual}')
            .expect(await bookmarkBlade.getTotalBookmarkNumber())
            .toBe(3);
        
        // check the sort-by and filter options in recent section
        since('The default sort option in recent tab should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.currentSortOption())
            .toEqual('Date Viewed');
        await libraryPage.openSortMenu();
        since ('Sort options in recent section should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.librarySort.getAllSortOptionsText())
            .toEqual(['Name', 'Content', 'Created By','Date Updated', 'Date Created', 'Date Viewed', 'Project', 'Oldest on Top', 'Newest on Top']);

        // change the sort-by option to be Sort by name
        await libraryPage.selectSortOption('Content');
        since('The current items sort-by name in recent tab should be #{expected}, instead we have #{actual}')
            .expect(await bookmarkBlade.getBookmarkListNames())
            .toEqual(['DossierBookmark', 'ReportBookmark', 'RWDBookmark']);
        // Click Filter Icon, Bookmark Type: My Bookmarks
        await libraryPage.clickFilterIcon();
        await libraryPage.libraryFilter.selectFilter(['Bookmark Type', 'My bookmarks']);
        await libraryPage.libraryFilter.clickApplyButton();
        await since('Bookmark list after filter Bookmark Type: My bookmarks should be #{expected}, instead we have #{actual}')
            .expect(await bookmarkBlade.getBookmarkListNames())
            .toEqual(['DossierBookmark', 'ReportBookmark', 'RWDBookmark']);
        await libraryPage.libraryFilter.clearAllFilters();

        // change filter Content Type: Report
        await libraryPage.libraryFilter.selectFilter(['Content Type', 'Report']);
        await libraryPage.libraryFilter.clickApplyButton();
        await since('Bookmark list after filter Content Type: Report should be #{expected}, instead we have #{actual}')
            .expect(await bookmarkBlade.getBookmarkListNames())
            .toEqual(['ReportBookmark']);
        await libraryPage.libraryFilter.clearAllFilters();

        // change filter Content: Bookmark
        await libraryPage.libraryFilter.selectFilter(['Content', 'Bookmark'], 1);
        await libraryPage.libraryFilter.clickApplyButton();
        await since('Bookmark list after filter Content: Bookmark should be #{expected}, instead we have #{actual}')
            .expect(await bookmarkBlade.getBookmarkListNames())
            .toEqual(['DossierBookmark']);
        await libraryPage.libraryFilter.clearAllFilters();

        // search Bookmark
        await librarySearch.localSearch('report');
        await since('Bookmark list after search should be #{expected}, instead we have #{actual}')
            .expect(await bookmarkBlade.getBookmarkListNames())
            .toEqual(['ReportBookmark']);

    });

    it('[TC56656_02] Bookmark Blade - share/favorite', async () => {
        await libraryPage.switchUser(credentials_sender);

        // create two bookmarks and share to this user
        await createBookmarks({
            bookmarkList: [
                'Shared Bookmark 1',
                'Shared Bookmark 2',
                'Shared Bookmark 3',
            ],
            credentials: credentials_sender,
            dossier: dossierFromSender,
        });

        // generate shared link
        let url = await generateSharedLink({
            credentials: credentials_sender,
            dossier: dossierFromSender,
        });


        // switch user to receiver
        await libraryPage.switchUser(credentials);
        // open shared link
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.switchToTab(1);
        await dossierPage.waitForItemLoading();
        await dossierPage.closeCurrentTab();
        await dossierPage.switchToTab(0);

        // create my bookmark
        await createBookmarks({
            bookmarkList: [
                'RWDBookmark',
            ],
            credentials: credentials,
            dossier: RWD,
        });

        // delete Bookmark 1 for sender
        await deleteBookmarkByName({
            credentials: credentials_sender,
            dossier: dossierFromSender,
            name: 'Shared Bookmark 3',
        });

        // check bookmark list in bookmark blade
        await libraryPage.openSidebar();
        await sidebar.openBookmarkSectionList();
        since('Bookmark list in bookmark blade after apply shared link should be #{expected}, instead we have #{actual}')
            .expect(await bookmarkBlade.getTotalBookmarkNumber())
            .toEqual(3);
        since('Shared Icon display for shared bookmark 1 should be #{expected}, instead we have #{actual}')
            .expect(await bookmarkBlade.isSharedBookmark('Shared Bookmark 1'))
            .toBe(true);
        since('Shared Icon display for shared bookmark 2 should be #{expected}, instead we have #{actual}')
            .expect(await bookmarkBlade.isSharedBookmark('Shared Bookmark 2'))
            .toBe(true);
        since('Shared Icon display for RWDBookmark should be #{expected}, instead we have #{actual}')
            .expect(await bookmarkBlade.isSharedBookmark('RWDBookmark'))
            .toBe(false);
        since('Edit button display for shared bookmark 1 should be #{expected}, instead we have #{actual}')
            .expect(await bookmarkBlade.isEditButtonVisible('Shared Bookmark 1'))
            .toBe(false);
        since('Edit button display for shared bookmark 2 should be #{expected}, instead we have #{actual}')
            .expect(await bookmarkBlade.isEditButtonVisible('Shared Bookmark 2'))
            .toBe(false);

        await bookmarkBlade.shareBookmark('Shared Bookmark 1');
        //check default selection should be hovered one other than current applied BM
        since('current selected shared BM should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getCurrentSelectionText())
            .toBe('Shared Bookmark 1');

        //select multiple ones and share to others
        await shareDossier.openBMList();
        await shareDossier.selectSharedBookmark(['Shared Bookmark 2'], 'SHARED WITH ME');
        await shareDossier.closeShareBookmarkDropDown();
        await shareDossier.searchRecipient('xinhu')
        await shareDossier.selectRecipients(['xinhu6']);
        await shareDossier.shareDossier();

        // favorite bookmarks
        since('Favorite group with default visibility should be #{expected}, instead we have #{actual}')
            .expect(await bookmarkBlade.isFavoriteGroupVisible())
            .toBe(false);
        await bookmarkBlade.favoriteBookmarks(['Shared Bookmark 1', 'Shared Bookmark 2', 'RWDBookmark']);
        // switch sidebar section to fetch latest data
        await sidebar.openAllSectionList();
        await sidebar.openBookmarkSectionList();

        since ('Favorite bookmarks after favoriting should be #{expected}, instead we have #{actual}')
            .expect(await bookmarkBlade.getFavoriteBookmarkNumberFromTitle())
            .toBe(3);
        since ('My bookmark after favoriting should be #{expected}, instead we have #{actual}')
            .expect(await bookmarkBlade.isBookmarksGroupVisible())
            .toBe(false);
        since ('Shared Icon display for RWDBookmark after favoriting should be #{expected}, instead we have #{actual}')
            .expect(await bookmarkBlade.isSharedBookmark('RWDBookmark'))
            .toBe(false);
        since ('Shared Icon display for Shared Bookmark 1 after favoriting should be #{expected}, instead we have #{actual}')
            .expect(await bookmarkBlade.isSharedBookmark('Shared Bookmark 1'))
            .toBe(true);
        since ('Shared Icon display for Shared Bookmark 2 after favoriting should be #{expected}, instead we have #{actual}')
            .expect(await bookmarkBlade.isSharedBookmark('Shared Bookmark 2'))
            .toBe(true);

        // unfavorite bookmarks
        await bookmarkBlade.unfavoriteBookmarks(['Shared Bookmark 1','RWDBookmark']);
        // switch sidebar section to fetch latest data
        await sidebar.openAllSectionList();
        await sidebar.openBookmarkSectionList();
        since ('Favorite bookmarks after unfavoriting should be #{expected}, instead we have #{actual}')
            .expect(await bookmarkBlade.getFavoriteBookmarkNumberFromTitle())
            .toBe(1);
        since ('My bookmark after unfavoriting should be #{expected}, instead we have #{actual}')
            .expect(await bookmarkBlade.getBookmarkListNumberFromTitle())
            .toBe(2);
        
        // delete shared bookmark 1 and check the bookmark panel inside
        await bookmarkBlade.deleteBookmark('Shared Bookmark 1');
        await bookmarkBlade.openBookmark('Shared Bookmark 2');
        await dossierPage.waitForDossierLoading();
        since('Current applied bookmark should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe('Shared Bookmark 2');
        await bookmark.openPanel();
        since('Bookmark count in bookmark panel should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(1);
        await bookmark.closePanel();
        await dossierPage.goToLibrary();

        // add snapshot
        await bookmarkBlade.createSnapshotOnBookmark('Shared Bookmark 2');
        await sidebar.openSnapshotsSectionList();
        since('After add snapshot in bookmark blade, the snapshot list should be #{expected}, instead we have #{actual}')
            .expect(await snapshotsPage.snapshotsGrid.getSnapshotNames()).toEqual(['Bookmark_Shared_Shared Bookmark 2']);

        // Click Filter Icon, Bookmark Type: My Bookmarks
        await sidebar.openBookmarkSectionList();
        await libraryPage.clickFilterIcon();
        await libraryPage.libraryFilter.selectFilter(['Bookmark Type', 'Shared with me']);
        await libraryPage.libraryFilter.clickApplyButton();
        await since('Bookmark list after filter Bookmark Type: Shared with me should be #{expected}, instead we have #{actual}')
            .expect(await bookmarkBlade.getBookmarkListNames())
            .toEqual(['Shared Bookmark 2']);
        await libraryPage.libraryFilter.clearAllFilters();


    });

    it('[TC56656_03] Bookmark Blade - rename/delete/add snapshot', async () => {
        // create kinds of bookmarks first by API
        await createBookmarks({
            bookmarkList: [
                'DossierBookmark 1',
                'DossierBookmark 2',
                'DossierBookmark 3',
            ],
            credentials: credentials,
            dossier: dossier,
        });

        // rename bookmark
        await libraryPage.openSidebar();
        await sidebar.openBookmarkSectionList();
        await bookmarkBlade.renameBookmarkWithoutEnter('DossierBookmark 1', 'DossierBookmark 1[');
        since('Inline error message after rename with keyword [ should be #{expected}, instead we have #{actual}')
            .expect(await bookmarkBlade.getInlineErrorMessage())
            .toBe('The name cannot contain the following characters " \\ [ ].');
        await bookmarkBlade.enter();
        await bookmarkBlade.renameBookmarkWithoutEnter('DossierBookmark 1', 'DossierBookmark 2');
        since('Inline error message after rename with dup name should be #{expected}, instead we have #{actual}')
            .expect(await bookmarkBlade.getInlineErrorMessage())
            .toBe('The name is already taken.');
        await bookmarkBlade.enter();
        await bookmarkBlade.renameBookmark('DossierBookmark 1', 'DossierBookmark 1_rename');

        // add snapshot
        await bookmarkBlade.createSnapshotOnBookmark('DossierBookmark 1_rename');
        await sidebar.openSnapshotsSectionList();
        since('After add snapshot in bookmark blade, the snapshot list should be #{expected}, instead we have #{actual}')
            .expect(await snapshotsPage.snapshotsGrid.getSnapshotNames())
            .toEqual([
                'Bookmark_DossierBookmark 1_rename',
            ]);
        await sidebar.openBookmarkSectionList();

        // open the bookmark
        await bookmarkBlade.openBookmark('DossierBookmark 1_rename');
        since('Current applied bookmark should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe('DossierBookmark 1_rename');
        await bookmark.openPanel();
        since('Bookmark count in bookmark panel after rename should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(3);
        await bookmark.renameBookmark('DossierBookmark 1_rename', 'DossierBookmark 1_rename_v2');
        await bookmark.deleteBookmark('DossierBookmark 2');
        await bookmark.closePanel();
        await dossierPage.goToLibrary();

        // check the bookmark blade
        since('Bookmark count in bookmark blade after rename/delete in bookmark panel should be #{expected}, instead we have #{actual}')
            .expect(await bookmarkBlade.getBookmarkListNames())
            .toEqual(['DossierBookmark 1_rename_v2', 'DossierBookmark 3']);
        await bookmarkBlade.deleteBookmark('DossierBookmark 1_rename_v2');
        await bookmarkBlade.deleteBookmark('DossierBookmark 3');

        // check the bookmark blade
        await sidebar.openAllSectionList();
        await sidebar.openBookmarkSectionList();
        await since('Bookmark section content display should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getEmptyLibraryMessage())
            .toBe('Your bookmarks will appear here.');
        
        // check the bookmark in dossier view
        await sidebar.openAllSectionList();
        await libraryPage.openDossier(dossier.name);
        await bookmark.openPanel();
        since('Bookmark count in bookmark panel after delete all should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(0);
        await bookmark.closePanel();
        await dossierPage.goToLibrary();

    });

    it('[TC56656_04] change cover image for rwd/report/dashboard', async () => {
        // reset cover image to default first
        const invalidImageUrl = 'https://demo.microstrategy.com/MicroStrategy/images/Coverpages/16-9/invalid.jpg';
        const absuluteImagePath = 'https://express-server.bj.bcebos.com/express-brand-card/head/rIcon/yunda.png';
        const relativeImagePath = './images/balloonpp_yellow.png';
        await changeDossierCoverImage({
            credentials: credentials,
            dossier: dossier,
            imageUrl: invalidImageUrl,
            type: 'Dashboard',
        });
        await changeDossierCoverImage({
            credentials: credentials,
            dossier: RWD,
            imageUrl: invalidImageUrl,
        });
        await changeDossierCoverImage({
            credentials: credentials,
            dossier: report,
            imageUrl: invalidImageUrl,
            type: 'Report',
        });
        await libraryPage.refresh();
        await takeScreenshotByElement(await libraryPage.getDossierImageContainer(dossier.name), 'TC56656_04_CoverImage_Dashboard_Default', { tolerance: 0.2 });
        await takeScreenshotByElement(await libraryPage.getDossierImageContainer(RWD.name), 'TC56656_04_CoverImage_RWD_Default', { tolerance: 0.2 });
        await takeScreenshotByElement(await libraryPage.getDossierImageContainer(report.name), 'TC56656_04_CoverImage_Report_Default', { tolerance: 0.2 });

        // change cover image for dashboard
        await libraryPage.openDossierContextMenu(dossier.name);
        await libraryPage.clickDossierContextMenuItem('Change Cover Image');
        await coverImageDialog.changeCoverImageByPath(absuluteImagePath);

        // change cover image for RWD
        await libraryPage.openDossierContextMenu(RWD.name);
        await libraryPage.clickDossierContextMenuItem('Change Cover Image');
        await coverImageDialog.changeCoverImageByDemoImageIndex(6);

        // change cover image for Report
        await libraryPage.openDossierContextMenu(report.name);
        await libraryPage.clickDossierContextMenuItem('Change Cover Image');
        await coverImageDialog.changeCoverImageByPath(relativeImagePath);

        await takeScreenshotByElement(await libraryPage.getDossierImageContainer(dossier.name), 'TC56656_04_CoverImage_Dashboard', { tolerance: 0.2 });
        await takeScreenshotByElement(await libraryPage.getDossierImageContainer(RWD.name), 'TC56656_04_CoverImage_RWD', { tolerance: 0.2 });
        await takeScreenshotByElement(await libraryPage.getDossierImageContainer(report.name), 'TC56656_04_CoverImage_Report', { tolerance: 0.2 });
    });

});
export const config = specConfiguration;
