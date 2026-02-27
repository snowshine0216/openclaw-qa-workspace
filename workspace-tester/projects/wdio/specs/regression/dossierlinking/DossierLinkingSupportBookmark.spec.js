import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import deleteBookmarkByName from '../../../api/deleteBookmarkByName.js';
import resetBookmarksWithPrompt from '../../../api/resetBookmarksWithPrompt.js';

const specConfiguration = { ...customCredentials('_linking') };

describe('Dossier Linking - support bookmark', () => {
    const tutorialProject = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };

    const bookmarkState = {
        id: '8FC839F44BEEA5C30AFCFD975350EA97',
        name: '(AUTO) SupportBookmark_DossierLinking_Bookmark',
        project: tutorialProject,
    };
    const target_NotInLib = {
        id: 'D2B1A4E547A31386471CA594948CA970',
        name: '(AUTO) target_bookmarkLinking_notInLibrary',
        project: tutorialProject,
    };
    const target_NoBookmark = {
        id: '06EA2E014EC0CF6CAD091A89D4CED78A',
        name: '(AUTO) target_bookmarkLinking_NoBookmarks',
        project: tutorialProject,
    };
    const target_WithBookmark = {
        id: 'B72F59424912163CA89E4582015E4420',
        name: '(AUTO) target_bookmarkLinking_withBookmarks',
        project: tutorialProject,
    };
    const multiLink = {
        id: '38F4D09E46C7FB7A2D9D18AD0F9628FC',
        name: '(AUTO) SupportBookmark_DossierLinking_MultiLink',
        project: tutorialProject,
    };
    const target_WithPrompt = {
        id: 'F07E8EB54347832D4CDCFE983F574412',
        name: '(AUTO) target_bookmarkLinking_withPrompt',
        project: tutorialProject,
    };
    const target_WithPrompt_MultiLink = {
        id: '3235ABC94FF335F8B52CD4A9F35B1A8D',
        name: '(AUTO) target_bookmarkLinking_withPrompt_multiLink',
        project: tutorialProject,
    };
    const linkToOthers = {
        id: 'B197E33147D5142547E5659FD42030CB',
        name: '(AUTO) SuppportBookmark_DossierLinking_toRSDReport',
        project: tutorialProject,
    };
    const docLink = {
        id: '60F5AB1E4D729341A6AC0EB9C3231D4C',
        name: '(AUTO) SupportBookmark_DocumentLinking',
        project: tutorialProject,
    };
    const reportLink = {
        id: '04EA2FFA4ABDDC2F0B15E2B1B4C29FCB',
        name: '(AUTO) SupportBookmark_ReportLinking',
        project: tutorialProject,
    };
    const promptDossier = {
        id: '519EAC0845CE7B6F04597C91D2B3051C',
        name: '(AUTO) SupportBookmark_DossierLinking_Prompt',
        project: tutorialProject,
    };
    const target_Prompt2 = {
        id: '3295C8254BB297EC56430291FE7CADD9',
        name: '(AUTO) target_bookmarkLinking_withPrompt_2',
        project: tutorialProject,
    };
    const openInNewTab = {
        id: '1C7F1F814FC83D217977FB845C0AF8A8',
        name: '(AUTO) SupportBookmark_DossierLinking_OpenInNewTab',
        project: tutorialProject,
    };

    const { credentials } = specConfiguration;

    let {
        dossierPage,
        toc,
        libraryPage,
        grid,
        promptEditor,
        textbox,
        bookmark,
        filterSummaryBar,
        filterPanel,
        share,
        shareDossier,
        checkboxFilter,
        reportPage,
        reportGrid,
        promptObject,
        rsdGrid,
        loginPage,
    } = browsers.pageObj1;

    let cart = promptObject.shoppingCart;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);

        await libraryPage.removeDossierFromLibrary(specConfiguration.credentials, target_NotInLib);

        await resetDossierState({
            credentials: credentials,
            dossier: target_WithPrompt,
        });
        await libraryPage.openDossier(target_WithPrompt.name);
        await promptEditor.waitForEditor();
        await promptEditor.run();
        await dossierPage.goToLibrary();
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC88549] Dossier linking - Support bookmark - check bookmark when target dossier NOT in my library ', async () => {
        await libraryPage.removeDossierFromLibrary(specConfiguration.credentials, target_NotInLib);

        await resetDossierState({
            credentials: credentials,
            dossier: bookmarkState,
        });

        await libraryPage.openDossier(bookmarkState.name);

        // Link from TEXT
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'target dossier not in my lib' });
        await textbox.navigateLink(0);
        await since('Link to target dossier, bookmark icon present should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isBookmarkEnabled())
            .toBe(true);
        await since(
            'Link to target dossier, add to library button present should be #{expected}, instead we have #{actual}'
        )
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);

        // create first bookmark
        await bookmark.openPanel();
        await since(
            'open bookmark panel on target dossier, NoBookmarks panel present should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.getNoBookmarks().isDisplayed())
            .toBe(true);
        await bookmark.clickAddBtn();
        await since(
            'create first bookmark on target dossier, add to library msg present should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.isBookmarkAddtoLibraryMsgPresent())
            .toBe(true);
        await takeScreenshotByElement(await bookmark.getPanel(), 'TC88549', 'Linking_SupportBookmark_NotInLibrary');
        await bookmark.saveBookmark();
        await since(
            'create first bookmark on target dossier, bookmark count should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.bookmarkCount())
            .toBe(1);
        await bookmark.closePanel();
        await dossierPage.goBackFromDossierLink();

        // Link from GRID, Create second bookmark
        await grid.linkToTargetByGridContextMenu({
            title: 'Visualization 1',
            headerName: 'Category',
            elementName: 'Books',
        });
        await bookmark.openPanel();
        await bookmark.clickAddBtn();
        await since(
            'create first bookmark on target dossier, add to library msg present should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.isBookmarkAddtoLibraryMsgPresent())
            .toBe(false);
        await bookmark.saveBookmark();
        await since(
            'create second bookmark on target dossier, bookmark count should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.bookmarkCount())
            .toBe(2);
        await bookmark.closePanel();

        // check add to library status
        await dossierPage.goBackFromDossierLink();
        await dossierPage.goToLibrary();
        await since(
            'back to library page, target dossier in my library should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.isDossierInLibrary(target_NotInLib))
            .toBe(true);

        // remove dossier
        await libraryPage.removeDossierFromLibrary(specConfiguration.credentials, target_NotInLib);
    });

    it('[TC89232] Dossier linking - Support bookmark - check bookmark when target dossier in my library ', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: bookmarkState,
        });
        await resetBookmarks({
            credentials: credentials,
            dossier: target_NoBookmark,
        });
        await libraryPage.openDossier(bookmarkState.name);

        // LINK from TEXT
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'target dossier in my lib' });
        await textbox.navigateLink(0);
        await since(
            'Link to target dossier when it is in my library, bookmark icon present should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.isBookmarkEnabled())
            .toBe(true);
        await since(
            'Link to target dossier when it is in my library, add to library button present should be #{expected}, instead we have #{actual}'
        )
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
        await bookmark.openPanel();
        await since(
            'open bookmark panel when target dossier in my library, NoBookmarks panel present should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.getNoBookmarks().isDisplayed())
            .toBe(true);
        await bookmark.clickAddBtn();
        await since(
            'create first bookmark when target dossier in my library, add to library msg present should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.isBookmarkAddtoLibraryMsgPresent())
            .toBe(false);
        await takeScreenshotByElement(await bookmark.getPanel(), 'TC89232', 'Linking_SupportBookmark_InLibrary');
        await bookmark.saveBookmark();
        await since(
            'create first bookmark when target dossier in my library, bookmark count should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.bookmarkCount())
            .toBe(1);
        await bookmark.closePanel();
        await dossierPage.goBackFromDossierLink();

        // LINK from GRID
        await grid.linkToTargetByGridContextMenu({
            title: 'Visualization 1',
            headerName: 'Category',
            elementName: 'Books',
        });
        await bookmark.openPanel();
        await bookmark.clickAddBtn();
        await since('Link from grid, add to library msg present should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isBookmarkAddtoLibraryMsgPresent())
            .toBe(false);
        await bookmark.saveBookmark();
        await since('create bookmark again, bookmark count should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkCount())
            .toBe(2);
        await bookmark.closePanel();

        // check add to library status
        await dossierPage.goBackFromDossierLink();
        await dossierPage.goToLibrary();
    });

    it('[TC89233] Dossier linking - Support bookmark - bookmark manipulation on target dossier ', async () => {
        const bookmarkName = 'BookmarkTest';
        await resetDossierState({
            credentials: credentials,
            dossier: bookmarkState,
        });
        await deleteBookmarkByName({
            credentials: credentials,
            dossier: target_WithBookmark,
            name: bookmarkName,
        });
        await libraryPage.openDossier(bookmarkState.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'target dossier with bookmarks' });
        await grid.linkToTargetByGridContextMenu(
            { title: 'Visualization 1', headerName: 'Category', elementName: 'Books' },
            true
        );
        await promptEditor.waitForEditor();
        await promptEditor.run();

        // check bookmark
        await bookmark.openPanel();
        await since('bookmrk manipulation, by default, bookmark count should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(2);

        // add new bookmark
        await bookmark.addNewBookmark(bookmarkName);
        await since('bookmrk manipulation, add new, bookmark count should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(3);

        // swith bookmark
        await bookmark.applyBookmark('SharedBookmark1', 'SHARED WITH ME');
        await filterSummaryBar.viewAllFilterItems();
        await since('ShareBookmark1, filter summary supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterPanelItems('Quarter'))
            .toBe('2014 Q1');
        await bookmark.openPanel();
        await bookmark.applyBookmark(bookmarkName);
        await filterSummaryBar.viewAllFilterItems();
        await since('BookmarkTest, filter summary supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterPanelItems('Quarter'))
            .toBe('2014 Q2,2014 Q3');

        // save changes
        await filterPanel.openFilterPanel();
        await filterPanel.clearFilter();
        await filterPanel.apply();
        await dossierPage.goBackFromDossierLink();
        await since(
            'change bookmark, back to source, bookmark save changes dialogue present supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.isSaveChangesDialogPresent())
            .toBe(true);
        await bookmark.keepSaveReminder();

        // apply bookmark
        await bookmark.openPanel();
        await bookmark.updateBookmark(bookmarkName);
        await dossierPage.goBackFromDossierLink();
        await since(
            'apply updated bookmark, back to source, bookmark save changes dialogue present supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.isSaveChangesDialogPresent())
            .toBe(false);

        // delete bookmark
        await grid.linkToTargetByGridContextMenu(
            { title: 'Visualization 1', headerName: 'Category', elementName: 'Books' },
            true
        );
        await promptEditor.waitForEditor();
        await promptEditor.run();
        await filterSummaryBar.viewAllFilterItems();
        await since('link again, the filter summary text supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterPanelItems('Quarter'))
            .toBe('2014 Q2,2014 Q3');
        await bookmark.openPanel();
        await since('bookmrk manipulation, add new, bookmark count should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(3);
        await bookmark.applyBookmark(bookmarkName);
        await bookmark.ignoreSaveReminder();
        await since(
            'link again, switch bookmark, the filter summary text supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterSummaryBarText())
            .toBe('No filter selections');

        // back
        await dossierPage.goBackFromDossierLink();
        await dossierPage.goToLibrary();
    });

    it('[TC89234] Dossier linking - Support bookmark - share dossier and share bookmark on target dossier ', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: bookmarkState,
        });
        await libraryPage.openDossier(bookmarkState.name);

        // share dossier when target dossier not in my library
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'target dossier not in my lib' });
        await textbox.navigateLink(0);
        await since('On target dossier, bookmark icon present should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isBookmarkEnabled())
            .toBe(true);
        await share.openSharePanel();
        await share.openShareDossierDialog();
        await since(
            'share dosier, dossier not in library, bookmark list present should be #{expected}, instead we have #{actual}'
        )
            .expect(await shareDossier.isIncludeBMPresent())
            .toBe(false);
        await shareDossier.searchRecipient('xyi');
        await shareDossier.selectRecipients(['xyi']);
        await shareDossier.shareDossier();
        await since(
            'share dosier, dossier not in library,after share, share dialogue present should be #{expected}, instead we have #{actual}'
        )
            .expect(await shareDossier.getShareDossierDialog().isDisplayed())
            .toBe(false);
        await dossierPage.goBackFromDossierLink();

        // share dossier when target dossier in my library
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'target dossier with bookmarks' });
        await grid.linkToTargetByGridContextMenu(
            { title: 'Visualization 1', headerName: 'Category', elementName: 'Books' },
            true
        );
        await promptEditor.waitForEditor();
        await promptEditor.run();
        await share.openSharePanel();
        await share.openShareDossierDialog();
        await since(
            'share dosier, dossier in library, bookmark list present should be #{expected}, instead we have #{actual}'
        )
            .expect(await shareDossier.isIncludeBMPresent())
            .toBe(true);
        await shareDossier.includeBookmark();
        await shareDossier.openBMList();
        await shareDossier.selectSharedBookmark(['SharedBookmark1'], 'SHARED WITH ME');
        await shareDossier.closeShareBookmarkDropDown();
        await shareDossier.searchRecipient('xyi');
        await shareDossier.selectRecipients(['xyi']);
        await shareDossier.shareDossier();
        await since(
            'share dosier, dossier in library,after share, share dialogue present should be #{expected}, instead we have #{actual}'
        )
            .expect(await shareDossier.getShareDossierDialog().isDisplayed())
            .toBe(false);
        await dossierPage.goBackFromDossierLink();

        // back
        await dossierPage.goToLibrary();
    });

    it('[TC89248] Dossier linking - Support bookmark - check target dossier change will be temporarily kept and will not auto-saved ', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: multiLink,
        });
        await resetBookmarksWithPrompt({
            credentials: credentials,
            dossier: target_WithPrompt,
        });

        // link 1st time
        await libraryPage.openDossier(multiLink.name);
        await promptEditor.waitForEditor();
        await promptEditor.run();
        await toc.openPageFromTocMenu({ chapterName: 'target to dossier', pageName: 'grid/viz' });
        await grid.linkToTargetByGridContextMenu({ title: 'Link to other dossier', headerName: 'Category' });

        // check & change filter
        await filterSummaryBar.viewAllFilterItems();
        await since(
            'link from original source, the filter summary text supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterPanelItems('Subcategory'))
            .toBe('Literature,Cameras,Action');
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Subcategory');
        await checkboxFilter.selectElementByName('Business');
        await filterPanel.apply();

        // add bookmark
        await bookmark.openPanel();
        await bookmark.addNewBookmark('');
        await since('add bookmark, bookmark count should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(1);
        await bookmark.closePanel();

        // link 2nd time, check filter, prompt
        await grid.linkToTargetByGridContextMenu({
            title: 'Link to other dossier',
            headerName: 'Category',
            elementName: 'Books',
        });
        await filterSummaryBar.viewAllFilterItems();
        await since('link from 2nd time, the filter summary text supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterPanelItems('Subcategory'))
            .toBe('Business,Literature,Cameras,Action');
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Category');
        await since(
            'link from 2nd time, the category prompt is supposed to be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('Books, Electronics, Movies');
        await promptEditor.cancelEditor();

        // back 1st time to check filter,prompt
        await dossierPage.goBackFromDossierLink();
        await filterSummaryBar.viewAllFilterItems();
        await since(
            'back to mid dossier, the filter summary text supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterPanelItems('Subcategory'))
            .toBe('Business,Literature,Cameras,Action');
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Category');
        await since(
            'back to mid dossier, the category prompt is supposed to be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('Books, Electronics, Movies');
        await promptEditor.cancelEditor();
        await dossierPage.goToLibrary();

        // re-open dossier to check
        await libraryPage.openDossier(target_WithPrompt.name);
        await bookmark.openPanel();
        await since('open directly, bookmark count should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(1);
        await bookmark.closePanel();
        await filterSummaryBar.viewAllFilterItems();
        await since('open directly, the filter summary text supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterPanelItems('Subcategory'))
            .toBe(`Art & Architecture,Science & Technology,TV's,Horror`);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Category');
        await since('open directly, the category prompt is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('Movies, Books, Music, Electronics'); //wait for DE265203 to be fixed
        // .expect(await promptEditor.checkListSummary('Category')).toEqual('Books, Electronics, Movies');
        await promptEditor.cancelEditor();
        await dossierPage.goToLibrary();
    });

    it('[TC89295] Dossier linking - Support bookmark - mixed link (A- B Page1 - B Page2 - C) ', async () => {
        await resetBookmarksWithPrompt({
            credentials: credentials,
            dossier: target_WithPrompt,
        });
        await resetBookmarksWithPrompt({
            credentials: credentials,
            dossier: target_WithPrompt_MultiLink,
        });
        await resetDossierState({
            credentials: credentials,
            dossier: multiLink,
        });

        // link 1st time (A-B)
        await libraryPage.openDossier(multiLink.name);
        await promptEditor.waitForEditor();
        await promptEditor.run();
        await toc.openPageFromTocMenu({ chapterName: 'target to dossier', pageName: 'grid/viz' });
        await grid.linkToTargetByGridContextMenu({ title: 'Link to other dossier', headerName: 'Category' });

        // page linking
        await grid.linkToTargetByGridContextMenu({
            title: 'Page linking',
            headerName: 'Category',
            elementName: 'Books',
        });
        await bookmark.openPanel();
        await bookmark.addNewBookmark('PageLinkingBookmark');
        await bookmark.closePanel();
        await grid.openViewFilterContainer('Visualization 1');
        await since('page linking, view filter is supposed to be "#{expected}", instead we have "#{actual}')
            .expect(await grid.getViewFilterItemText())
            .toBe('Clear "Category = Books"');
        await grid.clearViewFilter('Clear All');
        await bookmark.openPanel();
        await bookmark.addNewBookmark('clearViewFilter');
        await bookmark.closePanel();

        // link 2nd time (B-C)
        await grid.linkToTargetByGridContextMenu({
            title: 'Visualization 1',
            headerName: 'Category',
            elementName: 'Books',
        });
        await bookmark.openPanel();
        await bookmark.addNewBookmark('3rd-Linking');
        await bookmark.closePanel();

        // back - check view filter and bookmark
        await dossierPage.goBackFromDossierLink();
        await since('Back, last viewed page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual([target_WithPrompt.name, 'pass context to dossier', 'pass context']);
        await since('Back, view filter container present should be #{expected}, instead we have #{actual}')
            .expect(await grid.isViewFilterPresent('Visualization 1'))
            .toBe(false);
        await bookmark.openPanel();
        await bookmark.applyBookmark('PageLinkingBookmark');
        await since(
            'Back, switch bookmark, view filter container present should be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.isViewFilterPresent('Visualization 1'))
            .toBe(true);
        await grid.openViewFilterContainer('Visualization 1');
        await since('Back, switch bookmark, view filter is supposed to be "#{expected}", instead we have "#{actual}')
            .expect(await grid.getViewFilterItemText())
            .toBe('Clear "Category = Books"');

        // re-open dossier to check
        await dossierPage.goBackFromDossierLink();
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(target_WithPrompt.name);
        await bookmark.openPanel();
        await since('mixted link, open directly, bookmark count should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(2);
        await bookmark.applyBookmark('PageLinkingBookmark');
        await since(
            'open bookmark PageLinkingBookmark, view filter container present should be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.isViewFilterPresent('Visualization 1'))
            .toBe(true);
        await bookmark.openPanel();
        await bookmark.applyBookmark('clearViewFilter');
        await since(
            'open bookmark clearViewFilter, view filter container present should be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.isViewFilterPresent('Visualization 1'))
            .toBe(false);

        await dossierPage.goToLibrary();
    });

    it('[TC89315] Dossier linking - Support bookmark - link to iteself ', async () => {
        await resetBookmarks({
            credentials: credentials,
            dossier: bookmarkState,
        });
        await resetDossierState({
            credentials: credentials,
            dossier: bookmarkState,
        });

        // link from grid
        await libraryPage.openDossier(bookmarkState.name);
        await toc.openPageFromTocMenu({ chapterName: 'target to dossier', pageName: 'grid/viz' });
        await grid.linkToTargetByGridContextMenu({
            title: 'Link to this dossier (contextual link)',
            headerName: 'Category',
            elementName: 'Books',
        });

        // create bookmark #1
        await bookmark.openPanel();
        await bookmark.addNewBookmark('');
        await since('link to itself, add bookmark, bookmark count should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(1);
        await bookmark.closePanel();

        // back to source
        await dossierPage.goBackFromDossierLink();
        await bookmark.openPanel();
        await bookmark.addNewBookmark('');
        await since('link back, add bookmark, bookmark count should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(2);
        await bookmark.closePanel();

        // link from text again
        await toc.openPageFromTocMenu({ chapterName: 'target to dossier', pageName: 'text/image' });
        await textbox.navigateLink(2);

        // create bookmark #2
        await bookmark.openPanel();
        await since(
            'link to itself again, add bookmark, bookmark count should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(2);
        await bookmark.closePanel();

        // back
        await dossierPage.goBackFromDossierLink();
        await dossierPage.goToLibrary();
    });

    it('[TC89297] Dossier linking - Support bookmark -  dossier linking with document in the journey', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: linkToOthers,
        });
        await resetBookmarksWithPrompt({
            credentials: credentials,
            dossier: target_WithPrompt_MultiLink,
        });

        // link from dossier to document
        await libraryPage.openDossier(linkToOthers.name);
        await promptEditor.waitForEditor();
        await promptEditor.run();
        await toc.openPageFromTocMenu({ chapterName: 'target to document', pageName: 'text/image' });
        await textbox.navigateLink(1);
        await promptEditor.waitForEditor(); // first prompt
        await promptEditor.run();
        await promptEditor.waitForEditor(); // second prompt
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('link to document, bookmark icon present should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isBookmarkEnabled())
            .toBe(false);

        //  document then link to another dossier, link from text

        await dossierPage.clickBtnByTitle('same from source');
        await dossierPage.waitForDossierLoading();
        await since(
            'link dossier from document, bookmark icon present should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.isBookmarkEnabled())
            .toBe(true);
        await bookmark.openPanel();
        await bookmark.addNewBookmark('fromDoc');
        await since('add bookmark first, bookmark count should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(1);
        await bookmark.closePanel();

        // back to document
        await dossierPage.goBackFromDossierLink();
        await promptEditor.waitForEditor(); // first prompt
        await promptEditor.run();
        await promptEditor.waitForEditor(); // second prompt
        await promptEditor.run();

        // link to dossier again -  from grid
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('K44');
        await grid.clickCell('Atlanta');
        await dossierPage.waitForDossierLoading();
        await bookmark.openPanel();
        await since('link again, bookmark count should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(1);
        await bookmark.closePanel();

        await dossierPage.goToLibrary();
    });

    it('[TC89311] Dossier linking - Support bookmark -  dossier linking with report in the journey', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: linkToOthers,
        });
        await resetBookmarksWithPrompt({
            credentials: credentials,
            dossier: target_WithPrompt_MultiLink,
        });

        // link from dossier to report
        await libraryPage.openDossier(linkToOthers.name);
        await promptEditor.waitForEditor();
        await promptEditor.run();
        await toc.openPageFromTocMenu({ chapterName: 'target to report', pageName: 'text/image' });
        await textbox.navigateLink(1);
        await reportPage.waitForReportLoading();
        await reportGrid.waitForGridRendring();

        //  report then to dossier
        await reportGrid.selectReportGridContextMenuOption({
            headerName: 'Category',
            elementName: 'Books',
            firstOption: 'Links',
            secondOption: 'EmptyAnswer',
        });
        await dossierPage.waitForDossierLoading();
        await since(
            'link dossier from document, bookmark icon present should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.isBookmarkEnabled())
            .toBe(true);
        await bookmark.openPanel();
        await bookmark.addNewBookmark('fromReport');
        await since('add bookmark first, bookmark count should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(1);
        await bookmark.closePanel();

        // back to report
        await dossierPage.goBackFromDossierLink();
        await reportPage.waitForReportLoading();
        await reportGrid.waitForGridRendring();
        await since('back to report, prompt editor present should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);

        // report link
        await reportGrid.selectReportGridContextMenuOption({
            headerName: 'Subcategory',
            elementName: 'Business',
            firstOption: 'Links',
            secondOption: 'AnswerDynamically',
        });
        await dossierPage.waitForDossierLoading();
        await bookmark.openPanel();
        await since('report, link again, bookmark count should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(1);
        await bookmark.closePanel();

        await dossierPage.goToLibrary();
    });

    it('[TC89313] Dossier linking - Support bookmark - check x-func between bookmark and prompt on target dossier ', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: promptDossier,
        });
        await resetBookmarks({
            credentials: credentials,
            dossier: target_Prompt2,
        });

        // link to prompt dossier
        await libraryPage.openDossier(promptDossier.name);
        await promptEditor.waitForEditor();
        await promptEditor.run();
        await toc.openPageFromTocMenu({ chapterName: 'target to dossier', pageName: 'grid/viz' });
        await grid.linkToTargetByGridContextMenu({ title: 'Link to other dossier', headerName: 'Category' });

        // add 1st bookmark
        await bookmark.openPanel();
        await bookmark.addNewBookmark('initalBM');
        await since('add bookmark, bookmark count should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(1);
        await bookmark.closePanel();

        // reprompt
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Category');
        await since('The default prompt answer after reprompt is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary('Category'))
            .toBe('Books, Electronics, Movies');
        await promptEditor.toggleViewSummary(); // un-toggle
        const prompt = await promptObject.getPromptByName('Category');
        await cart.addAll(prompt);
        await promptEditor.run();

        // add 2nd bookmark
        await bookmark.openPanel();
        await bookmark.addNewBookmark('repromptBM');
        await since('add bookmark, bookmark count should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(2);
        await bookmark.closePanel();

        // link 2nd time
        await grid.linkToTargetByGridContextMenu({
            title: 'Link to other dossier',
            headerName: 'Category',
            elementName: 'Books',
        });
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Category');
        await since(
            'link from 2nd time, the category prompt is supposed to be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('Books, Electronics, Movies, Music');
        await promptEditor.cancelEditor();

        // back 1st time to check prompt
        await dossierPage.goBackFromDossierLink();
        await bookmark.openPanel();
        await bookmark.applyBookmark('repromptBM');
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Category');
        await since(
            'back to mid dossier, the category prompt is supposed to be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('Books, Electronics, Movies, Music');
        await promptEditor.cancelEditor();
        await dossierPage.goToLibrary();

        // re-open dossier to check
        await libraryPage.openDossier(target_Prompt2.name);
        await bookmark.openPanel();
        await since('open directly, bookmark count should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(2);
        await bookmark.closePanel();

        await dossierPage.goToLibrary();
    });

    it('[TC89314] Dossier linking - Support bookmark - bookmark linking when open in new tab ', async () => {
        await libraryPage.removeDossierFromLibrary(specConfiguration.credentials, target_NotInLib);
        await resetDossierState({
            credentials: credentials,
            dossier: openInNewTab,
        });
        await resetBookmarks({
            credentials: credentials,
            dossier: target_NoBookmark,
        });
        await libraryPage.openDossier(openInNewTab.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'target dossier not in my lib' });

        // link to create 1st bookmark
        await grid.linkToTargetByGridContextMenu({
            title: 'Visualization 1',
            headerName: 'Category',
            elementName: 'Books',
        });
        await dossierPage.switchToTab(1);
        await dossierPage.waitForDossierLoading();
        await bookmark.openPanel();
        await since(
            'open in new tab, open bookmark panel, NoBookmarks panel present should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.getNoBookmarks().isDisplayed())
            .toBe(true);
        await bookmark.clickAddBtn();
        await since(
            'open in new tab, create first bookmark, add to library msg present should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.isBookmarkAddtoLibraryMsgPresent())
            .toBe(true);
        await bookmark.saveBookmark();
        await since(
            'open in new tab, create first bookmark, bookmark count should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.bookmarkCount())
            .toBe(1);
        await bookmark.closePanel();
        await dossierPage.closeTab(1);

        // link to create 2nd bookmark
        await textbox.navigateLink(0);
        await dossierPage.switchToTab(1);
        await dossierPage.waitForDossierLoading();
        await bookmark.openPanel();
        await since(
            'open in new tab again, open bookmark panel, NoBookmarks panel present should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.getNoBookmarks().isDisplayed())
            .toBe(false);
        await bookmark.clickAddBtn();
        await since(
            'open in new tab again , create first bookmark, add to library msg present should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.isBookmarkAddtoLibraryMsgPresent())
            .toBe(false);
        await bookmark.saveBookmark();
        await since(
            'open in new tab, create first bookmark, bookmark count should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.bookmarkCount())
            .toBe(2);
        await bookmark.closePanel();
        await dossierPage.closeTab(1);

        // back
        await dossierPage.goToLibrary();
    });
});
export const config = specConfiguration;
