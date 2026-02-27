import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('_search') };

describe('GlobalSearch_QuickSearch', () => {
    let { dossierPage, quickSearch, fullSearch, promptEditor, loginPage,libraryPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
    });

    beforeEach(async () => {
        // clear recent history first
        await libraryPage.executeScript('window.localStorage.clear();');
        await libraryPage.switchUser(specConfiguration.credentials);

        await quickSearch.clearRencentlySearchedAndReviewed();
        await dossierPage.goToLibrary();
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC69970] Global Search - Search Suggestion - different search keyword on search suggestion', async () => {
        const keyword1 = 'a'; // single letter
        const keyword2 = '2'; // number
        const keyword3 = 'global'; // single word
        const keyword4 = 'search dossier'; // multi words
        const keyword5 = '*.&'; // special chars
        const keyword6 = `<script>alert('test')</script>`; // script
        const keyword7 = '1111'; // script
        const keyword8 = 'search    dossier'; // multi space

        await quickSearch.openSearchSlider();
        // single letter: a
        await quickSearch.inputText(keyword1);
        await since(
            `Search by ${keyword1}, search suggestion text items count should be #{expected}, while we get #{actual}`
        )
            .expect(await quickSearch.getSearchSuggestionTextItems().length)
            .toBe(5);
        await since(
            `Search by ${keyword1}, search suggestion shortcut items count should be #{expected}, while we get #{actual}`
        )
            .expect(await quickSearch.getSearchSuggestionShortcutsItems().length)
            .toBe(6);
        await quickSearch.clearInput();

        // number: 2
        await quickSearch.inputText(keyword2);
        await since(
            `Search by ${keyword2}, search suggestion text items count should be greater than #{expected}, while we get #{actual}`
        )
            .expect(await quickSearch.getSearchSuggestionTextItems().length)
            .toBeGreaterThan(0);
        // await since(
        //     `Search by ${keyword2}, search suggestion shortcut items count should be #{expected}, while we get #{actual}`
        // )
        //     .expect(await quickSearch.getSearchSuggestionShortcutsItems().length)
        //     .toBe(0);
        await quickSearch.clearInput();

        // single word: global
        await quickSearch.inputText(keyword3);
        await since(
            `Search by ${keyword3}, search suggestion text items count should be #{expected}, while we get #{actual}`
        )
            .expect(await quickSearch.getSearchSuggestionTextItems().length)
            .toBe(5);
        await since(
            `Search by ${keyword3}, search suggestion shortcut items count should be #{expected}, while we get #{actual}`
        )
            .expect(await quickSearch.getSearchSuggestionShortcutsItems().length)
            .toBe(6);
        await quickSearch.clearInput();

        // sentence with space: search dossier
        await quickSearch.inputText(keyword4);
        await since(
            `Search by ${keyword4}, search suggestion text items count should be greater than #{expected}, while we get #{actual}`
        )
            .expect(await quickSearch.getSearchSuggestionTextItems().length)
            .toBeGreaterThan(1);
        await since(
            `Search by ${keyword4}, search suggestion shortcut items count should be greater than #{expected}, while we get #{actual}`
        )
            .expect(await quickSearch.getSearchSuggestionShortcutsItems().length)
            .toBeGreaterThan(1);
        await quickSearch.clearInput();

        // special chars: [.*]?!@#$%^&*()_+-={}[]|\:";'<>,.?/"
        await quickSearch.inputText(keyword5);
        await since(
            'Search by special chars, search suggestion text items count should be #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.getSearchSuggestionTextItems().length)
            .toBe(1);
        await quickSearch.clearInput();

        // sript: ><script>alert('test')</script>
        await quickSearch.inputText(keyword6);
        await since(
            'Search by script, search suggestion text items count should be greater than #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.getSearchSuggestionTextItems().length)
            .toBeGreaterThan(0);
        await quickSearch.clearInput();

        // number: 1111
        await quickSearch.inputText(keyword7);
        await since(
            `Search by ${keyword7}, search suggestion text items count should be greater than #{expected}, while we get #{actual}`
        )
            .expect(await quickSearch.getSearchSuggestionTextItems().length)
            .toBeGreaterThan(0);
        await quickSearch.clearInput();

        // multiple space: search   dossier
        await quickSearch.inputText(keyword8);
        await since(
            `Search by ${keyword8}, search suggestion text items count should be greater than #{expected}, while we get #{actual}`
        )
            .expect(await quickSearch.getSearchSuggestionTextItems().length)
            .toBeGreaterThan(1);
        await quickSearch.clearInput();
    });

    it('[TC69971] Global Search - Search Suggestion - open search suggestion text on quick search and full screen search page', async () => {
        const keyword = 'global';
        await quickSearch.openSearchSlider();

        // open search suggestion on quick search
        await quickSearch.inputText(keyword);
        await since(
            'Search dossier on quick search, search suggestion text items count should be #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.getSearchSuggestionTextItems().length)
            .toBe(5);
        await since(
            'Search dossier on full search page, search suggestion shortcut items count should be #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.getSearchSuggestionShortcutsItems().length)
            .toBe(6);

        // click search suggestion text from quick search
        await quickSearch.clickSearchSuggestionText(2);
        await since('Click text from search suggestion, user should be redirected to full screen search page')
            .expect(await fullSearch.getSearchResultsContainer().isDisplayed())
            .toBe(true);

        // open search suggestion on quick search
        await quickSearch.openSearchSlider();
        await quickSearch.clearInput();
        await quickSearch.inputText(keyword);
        await since(
            'Search dossier on full search page, search suggestion text items count should be #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.getSearchSuggestionTextItems().length)
            .toBe(5);
        await since(
            'Search dossier on full search page, search suggestion shortcut items count should be #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.getSearchSuggestionShortcutsItems().length)
            .toBe(6);

        // click search suggestion text from full screen search page
        await quickSearch.clickSearchSuggestionText(2);
        await since('Click text from search suggestion, quick search dropdown should be closed automatically')
            .expect(await quickSearch.getQuickSearchView().isDisplayed())
            .toBe(false);

        await fullSearch.backToLibrary();
    });

    it('[TC69972] Global Search - Search Suggestion - open search suggestion document/dossier on quick search and full screen search page', async () => {
        const keyword = 'globalSearch';
        await quickSearch.openSearchSlider();

        // open search suggestion on quick search
        await quickSearch.inputText(keyword);
        await since(
            'Search dossier on quick search, search suggestion shortcut items count should be #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.getSearchSuggestionShortcutsItems().length)
            .toBe(6);

        // open search suggestion dossier on quick search
        await quickSearch.openDossierFromSearchSuggestion(2);
        await since(
            'Open dossier from search suggestion, dossier should be opened successfully and dossier page is presented'
        )
            .expect(await dossierPage.getDossierView().isDisplayed())
            .toBe(true);

        // back to homepage
        await dossierPage.goToLibrary();

        // open search suggestion on full screen page
        await quickSearch.openSearchSlider();
        await quickSearch.inputText(keyword);
        await quickSearch.clickViewAll();

        // open search suggestion dossier on full screen search page
        await quickSearch.clickSearchSlider();
        await quickSearch.openDossierFromSearchSuggestion(2);
        await quickSearch.switchToNewWindow();
        await since(
            'Open dossier from full sreen search page, dossier should be opened successfully and dossier page is presented'
        )
            .expect(await dossierPage.getDossierView().isDisplayed())
            .toBe(true);
        await quickSearch.closeAllTabs();
    });

    it('[TC69973] Global Search - Recently Searched - Recently searched history list on quick search and full screen search page', async () => {
        const keyword1 = 'globalSearch';
        const keyword2 = 'this is a long search keyword automation testing';
        await quickSearch.openSearchSlider();

        // 1st: normal keyword
        await quickSearch.inputTextAndSearch(keyword1);
        await quickSearch.openQuickSearchView();
        await quickSearch.clearInput(); // clear to open dropdown view
        // -- check on full screen search page
        await since(
            `Search 1st time - ${keyword1}, recently searched keywords count should be #{expected}, while we get #{actual}`
        )
            .expect(await quickSearch.getRecentlySearchedKeywordsCount())
            .toBe(1);
        await since(`Search 1st time - ${keyword1}, recently searched keywords should contains ${keyword1}`)
            .expect(await quickSearch.isKeywordExisted(keyword1))
            .toBe(true);
        // -- check on quick search page
        await fullSearch.backToLibrary();
        await quickSearch.openSearchSlider();
        await quickSearch.openQuickSearchView();
        await since(
            'Back to homepage quick search firstly, recently searched keywords count should be #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.getRecentlySearchedKeywordsCount())
            .toBe(1);
        await since(`Back to homepage quick search firstly, recently searched keywords should contains ${keyword1}`)
            .expect(await quickSearch.isKeywordExisted(keyword1))
            .toBe(true);

        // 2nd: long keyword
        await quickSearch.inputTextAndSearch(keyword2);
        await quickSearch.clearInput(); // clear to open dropdown view
        await since(
            `Search 2nd time - ${keyword2}, recently searched keywords count should be #{expected}, while we get #{actual}`
        )
            .expect(await quickSearch.getRecentlySearchedKeywordsCount())
            .toBe(2);
        await since(`Search 2nd time - ${keyword2}, recently searched keywords should contains ${keyword2}`)
            .expect(await quickSearch.isKeywordExisted(keyword2))
            .toBe(true);

        // 3rd: duplicated keyword
        await quickSearch.inputTextAndSearch(keyword1);
        await quickSearch.clearInput(); // clear to open dropdown view
        // -- check on full screen search page
        await since(
            `Search 3rd time - ${keyword1}, recently searched keywords count should be #{expected}, while we get #{actual}`
        )
            .expect(await quickSearch.getRecentlySearchedKeywordsCount())
            .toBe(2);
        await since(`Search 3rd time - ${keyword1}, recently searched keywords should contains ${keyword1}`)
            .expect(await quickSearch.isKeywordExisted(keyword1))
            .toBe(true);
        // -- check on quick search page
        await fullSearch.backToLibrary();
        await quickSearch.openSearchSlider();
        await quickSearch.openQuickSearchView();
        await since(
            'Back to homepage quick search, recently searched keywords count should be #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.getRecentlySearchedKeywordsCount())
            .toBe(2);
        await since(`Back to homepage quick search, recently searched keywords should contains ${keyword1}`)
            .expect(await quickSearch.isKeywordExisted(keyword1))
            .toBe(true);
        await takeScreenshotByElement(quickSearch.getRecentlySearchedView(), 'TC69973', 'RecentlySearched_history');
    });

    it('[TC70038] Global Search - Recently Searched - maximum recently searched history list', async () => {
        const keyword1 = 'global search';
        const keyword2 = 'automation testing';
        const keyword3 = '全局搜索测试';
        const keyword4 = 'maximum history list with long long long long name';
        const keyword5 = 'dossier&docuemnt with long long long long name';
        // search 1st
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword1);
        await fullSearch.backToLibrary();
        await quickSearch.openSearchSlider();
        await since('search 1st, recently searched keywords count should be #{expected}, while we get #{actual}')
            .expect(await quickSearch.getRecentlySearchedKeywordsCount())
            .toBe(1);

        // search 2nd
        await quickSearch.inputTextAndSearch(keyword2);
        await fullSearch.backToLibrary();
        await quickSearch.openSearchSlider();
        await since('search 2nd, recently searched keywords count should be #{expected}, while we get #{actual}')
            .expect(await quickSearch.getRecentlySearchedKeywordsCount())
            .toBe(2);

        // search 3rd
        await quickSearch.inputTextAndSearch(keyword3);
        await fullSearch.backToLibrary();
        await quickSearch.openSearchSlider();
        await since('search 3rd, recently searched keywords count should be #{expected}, while we get #{actual}')
            .expect(await quickSearch.getRecentlySearchedKeywordsCount())
            .toBe(3);

        // search 4th
        await quickSearch.inputTextAndSearch(keyword4);
        await fullSearch.backToLibrary();
        await quickSearch.openSearchSlider();
        await since('search 4nth, recently searched keywords count should be #{expected}, while we get #{actual}')
            .expect(await quickSearch.getRecentlySearchedKeywordsCount())
            .toBe(4);

        // search 5th
        await quickSearch.inputTextAndSearch(keyword5);
        await fullSearch.backToLibrary();
        await quickSearch.openSearchSlider();
        await since('search 5th, recently searched keywords count should be #{expected}, while we get #{actual}')
            .expect(await quickSearch.getRecentlySearchedKeywordsCount())
            .toBe(4);
        await since('search 5th, the first keyword should NOT be existed')
            .expect(await quickSearch.isKeywordExisted(keyword1))
            .toBe(false);
    });

    it('[TC70050] Global Search - Recently Viewed - Rencently viewed history list on quick search and full screen search page', async () => {
        const keyword = 'GlobalSearch certified';
        const dossier = '(AUTO) GlobalSearch_Certified dossier';
        const document = '(AUTO) GlobalSearch_Test Document';

        // open dossier
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickMyLibraryTab();
        await fullSearch.openDossierFromSearchResultsInNewTab(dossier);
        await dossierPage.goToLibrary();
        // -- check on quick search page
        await quickSearch.openSearchSlider();
        await since(
            'Open dossier, recently viewed shortcuts count on quick search page should be #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.getRencentlyViewedShortcutCount())
            .toBe(1);
        // -- check on full screen search page
        await quickSearch.inputTextAndSearch(keyword);
        await quickSearch.openSearchSlider();
        await quickSearch.clearInput();
        await since(
            'Open dossier, recently viewed shortcuts count on full screen search page should be #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.getRencentlyViewedShortcutCount())
            .toBe(1);
        await fullSearch.backToLibrary();

        // open document
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickMyLibraryTab();
        await fullSearch.openDossierFromSearchResultsInNewTab(document);
        await dossierPage.goToLibrary();
        // -- check on quick search page
        await quickSearch.openSearchSlider();
        await since(
            'Open document, recently viewed shortcuts count on quick search page should be #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.getRencentlyViewedShortcutCount())
            .toBe(2);
        // -- check on full screen search page
        await quickSearch.inputTextAndSearch(keyword);
        await quickSearch.openSearchSlider();
        await quickSearch.clearInput();
        await since(
            'Open document, recently viewed shortcuts count on full screen search page should be #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.getRencentlyViewedShortcutCount())
            .toBe(2);

        // open the same dossier again (recently view list should be unique)
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickAllTab();
        await fullSearch.openDossierFromSearchResultsInNewTab(dossier);
        await dossierPage.goToLibrary();
        await quickSearch.openSearchSlider();
        await since(
            'Open same dossier again, recently viewed shortcuts count on quick search page should be #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.getRencentlyViewedShortcutCount())
            .toBe(2);

        // open the same document again (recently view list should be unique)
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickAllTab();
        await fullSearch.openDossierFromSearchResultsInNewTab(document);
        await dossierPage.goToLibrary();
        await quickSearch.openSearchSlider();
        await since(
            'Open same document again, recently viewed shortcuts count on quick search page should be #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.getRencentlyViewedShortcutCount())
            .toBe(2);
    });

    it('[TC69974] Global Search - Recently Viewed - Different entries to refresh recently reviewed list ', async () => {
        const keyword1 = 'globalSearch certified';
        const keyword2 = 'global Search';
        const name1 = '(AUTO) GlobalSearch_Certified dossier';
        const name2 = '(AUTO) GlobalSearch_Certified document';
        const name3 = '(AUTO) GlobalSearch_Keyword match';
        const name4 = '(AUTO) GlobalSearch_Test Document';

        await quickSearch.openSearchSlider();

        // Entry 1: open dossier from My Library tab
        await quickSearch.inputText(keyword1);
        await quickSearch.clickViewAll();
        await fullSearch.clickMyLibraryTab();
        await fullSearch.openDossierFromSearchResultsInNewTab(name1);
        await dossierPage.goToLibrary();
        await quickSearch.openSearchSlider();
        await since(
            'Open dossier from My Library Tab , recently viewed shortcuts count should be #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.getRencentlyViewedShortcutCount())
            .toBe(1);

        // Entry 2: open dossier from ALL tab
        await quickSearch.inputText(keyword1);
        await quickSearch.clickViewAll();
        await fullSearch.clickAllTab();
        await fullSearch.openDossierFromSearchResultsInNewTab(name2);
        await dossierPage.goToLibrary();
        await quickSearch.openSearchSlider();
        await since(
            'Open dossier from ALL Tab, recently viewed shortcuts count should be #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.getRencentlyViewedShortcutCount())
            .toBe(2);

        // Entry 3: open dossier from Matched Cotent
        await quickSearch.inputText(keyword2);
        await quickSearch.clickViewAll();
        await fullSearch.clickMyLibraryTab();
        await fullSearch.clickMatchedContentIcon(name3);
        await fullSearch.openDossierFromMatchedContent(name3);
        await fullSearch.switchToNewWindow();
        await fullSearch.closeAllTabs();
        await dossierPage.goToLibrary();
        await quickSearch.openSearchSlider();
        await since(
            'Open dossier from Matched Content, recently viewed shortcuts count should be #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.getRencentlyViewedShortcutCount())
            .toBe(3);

        // Entry 4: open dossier from Search Suggestion shortcuts
        await quickSearch.inputText(keyword1);
        await quickSearch.openDossierFromSearchSuggestionByName(name4);
        await dossierPage.goToLibrary();
        await quickSearch.openSearchSlider();
        await since(
            'Open dossier from Search Suggestion, recently viewed shortcuts count should be #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.getRencentlyViewedShortcutCount())
            .toBe(4);

        // Entry 5: open dossier from Recently viewed list
        await quickSearch.openDossierFromRecentlyViewedByName(name1);
        await dossierPage.goToLibrary();
        await quickSearch.openSearchSlider();
        await since(
            'Open dossier from Recently Viewed, recently viewed shortcuts count should be #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.getRencentlyViewedShortcutCount())
            .toBe(4);
        await since(
            'Open dossier from Recently Viewed, the first item on recently viewed should be #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.getRecentlyViewedShortcutName(1))
            .toBe(name1);
        await takeScreenshotByElement(quickSearch.getQuickSearchView(), 'TC69974', 'RecentlyViewed_Entries');

        // TODO: open dossier from homepage directly (should NOT refresh recently view list)
        // TODO: open dossier from related content (should NOT refresh recently view list)
    });

    it('[TC70026] Global Search - Recently Viewed - Prompted dossier on recently viewed list', async () => {
        const keyword = 'GlobalSearch_prompted';
        const dossier1 = '(AUTO) GlobalSearch_Prompted Dossier_MyLibrary';
        const dossier2 = '(AUTO) GlobalSearch_Prompted Dossier';

        // open prompted dossier from My Library tab - dossier1
        await quickSearch.openSearchSlider();
        await quickSearch.inputText(keyword);
        await quickSearch.clickViewAll();
        await fullSearch.clickMyLibraryTab();
        await fullSearch.openDossierFromSearchResultsInNewTab(dossier1);
        await dossierPage.goToLibrary();
        await quickSearch.openSearchSlider();
        await since(
            'Open prompted dossier from My Library Tab , recently viewed shortcuts count should be #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.getRencentlyViewedShortcutCount())
            .toBe(1);

        // open MD prompted dossier from All Tab (which is not added to library) - dossier2
        await quickSearch.inputText(keyword);
        await quickSearch.clickViewAll();
        await fullSearch.clickAllTab();
        await fullSearch.openDossierFromSearchResults(dossier2);
        await fullSearch.switchToNewWindow();
        await promptEditor.waitForEditor();
        await promptEditor.run();
        await fullSearch.closeAllTabs();
        await dossierPage.goToLibrary();
        await quickSearch.openSearchSlider();
        await since(
            'Open prompted dossier from All Tab , recently viewed shortcuts count should be #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.getRencentlyViewedShortcutCount())
            .toBe(2);

        // open the same prompted dossier again from All tab - dossier1
        await quickSearch.inputText(keyword);
        await quickSearch.clickViewAll();
        await fullSearch.clickAllTab();
        await fullSearch.openDossierFromSearchResultsInNewTab(dossier1);
        await dossierPage.goToLibrary();
        await quickSearch.openSearchSlider();
        await since(
            'Open same prompted dossier again from All Tab , recently viewed shortcuts count should be #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.getRencentlyViewedShortcutCount())
            .toBe(2);
        await since(
            'Open same prompted dossier again from All Tab, the first item on recently viewed should be #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.getRecentlyViewedShortcutName(1))
            .toBe(dossier1);
    });

    it('[TC70027] Global Search - Recently Viewed - Prompted document on recently viewed list', async () => {
        const keyword = 'globalSearch_prompted';
        const document1 = '(AUTO) GlobalSearch_Prompted Document_MyLibrary';
        const document2 = '(AUTO) GlobalSearch_Prompted Document';

        // open prompted document from My Library Tab - document1
        await quickSearch.openSearchSlider();
        await quickSearch.inputText(keyword);
        await quickSearch.clickViewAll();
        await fullSearch.clickMyLibraryTab();
        await fullSearch.openDossierFromSearchResultsInNewTab(document1);
        await dossierPage.goToLibrary();
        await quickSearch.openSearchSlider();
        await since(
            'Open prompted document from My Library Tab , recently viewed shortcuts count should be #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.getRencentlyViewedShortcutCount())
            .toBe(1);

        // open MD propmted document from All Tab (which is not added to library) - document2
        await quickSearch.inputText(keyword);
        await quickSearch.clickViewAll();
        await fullSearch.clickAllTab();
        await fullSearch.openDossierFromSearchResultsInNewTab(document2);
        //await promptEditor.run();
        await dossierPage.goToLibrary();
        await quickSearch.openSearchSlider();
        await since(
            'Open prompted document from All Tab , recently viewed shortcuts count should be #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.getRencentlyViewedShortcutCount())
            .toBe(2);

        // open the same prompted document again from All Tab - document1
        await quickSearch.inputText(keyword);
        await quickSearch.clickViewAll();
        await fullSearch.clickAllTab();
        await fullSearch.openDossierFromSearchResultsInNewTab(document1);
        await dossierPage.goToLibrary();
        await quickSearch.openSearchSlider();
        await since(
            'Open same prompted document from All Tab , recently viewed shortcuts count should be #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.getRencentlyViewedShortcutCount())
            .toBe(2);
        await since(
            'Open same prompted document again from All Tab, the first item on recently viewed should be #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.getRecentlyViewedShortcutName(1))
            .toBe(document1);
    });

    it('[TC70030] Global Search - Recently Viewed - Cover image on recently viewed list', async () => {
        const keyword = 'globalSearch';
        const dossier1 = '(AUTO) GlobalSearch_Certified dossier';
        const dossier2 = '(AUTO) GlobalSearch_Keyword match';

        // default cover image
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickMyLibraryTab();
        await fullSearch.openDossierFromSearchResultsInNewTab(dossier1);
        await dossierPage.goToLibrary();
        await quickSearch.openSearchSlider();
        await since(
            'Open dossier with default image, recently viewed shortcuts count should be #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.getRencentlyViewedShortcutCount())
            .toBe(1);

        // customized cover image
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickMyLibraryTab();
        await fullSearch.openDossierFromSearchResultsInNewTab(dossier2);
        await dossierPage.goToLibrary();
        await quickSearch.openSearchSlider();
        await since(
            'Open dossier with default image, recently viewed shortcuts count should be #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.getRencentlyViewedShortcutCount())
            .toBe(2);
        await quickSearch.sleep(1000); // wait customized image to render
        await takeScreenshotByElement(quickSearch.getQuickSearchView(), 'TC70030', 'RecentlyViewed_CustomizedImage');
    });

    it('[TC70049] Global Search - Recently Viewed - maximum recently viewed history list', async () => {
        const keyword = 'GlobalSearch';
        const name1 = '(AUTO) GlobalSearch_Certified document';
        const name2 = '(AUTO) GlobalSearch_Certified dossier';
        const name3 = '(AUTO) GlobalSearch_Keyword match';
        const name4 = '(AUTO) GlobalSearch_Test Document';
        const name5 = '(AUTO) GlobalSearch_Test Dossier';
        const name6 = '(AUTO) GlobalSearch_Prompted Document_MyLibrary';
        const name7 = '(AUTO) GlobalSearch_Prompted Dossier_MyLibrary';

        await quickSearch.openSearchSlider();

        // 1st
        await quickSearch.inputTextAndSearch(name1);
        await fullSearch.clickAllTab();
        await fullSearch.openDossierFromSearchResultsInNewTab(name1);
        await dossierPage.goToLibrary();
        await quickSearch.openSearchSlider();
        await since('Open dossier 1st , recently viewed shortcuts count should be #{expected}, while we get #{actual}')
            .expect(await quickSearch.getRencentlyViewedShortcutCount())
            .toBe(1);

        // 2nd
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickMyLibraryTab();
        await fullSearch.openDossierFromSearchResultsInNewTab(name2);
        await dossierPage.goToLibrary();
        await quickSearch.openSearchSlider();
        await since('Open dossier 2nd , recently viewed shortcuts count should be #{expected}, while we get #{actual}')
            .expect(await quickSearch.getRencentlyViewedShortcutCount())
            .toBe(2);

        // 3rd
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickMyLibraryTab();
        await fullSearch.openDossierFromSearchResultsInNewTab(name3);
        await dossierPage.goToLibrary();
        await quickSearch.openSearchSlider();
        await since('Open dossier 3rd , recently viewed shortcuts count should be #{expected}, while we get #{actual}')
            .expect(await quickSearch.getRencentlyViewedShortcutCount())
            .toBe(3);

        // 4th
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickMyLibraryTab();
        await fullSearch.openDossierFromSearchResultsInNewTab(name4);
        await dossierPage.goToLibrary();
        await quickSearch.openSearchSlider();
        await since('Open dossier 4th , recently viewed shortcuts count should be #{expected}, while we get #{actual}')
            .expect(await quickSearch.getRencentlyViewedShortcutCount())
            .toBe(4);

        // 5th
        await quickSearch.inputTextAndSearch(name5);
        await fullSearch.clickAllTab();
        await fullSearch.openDossierFromSearchResultsInNewTab(name5);
        await dossierPage.goToLibrary();
        await quickSearch.openSearchSlider();
        await since('Open dossier 5th , recently viewed shortcuts count should be #{expected}, while we get #{actual}')
            .expect(await quickSearch.getRencentlyViewedShortcutCount())
            .toBe(5);

        // 6th
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickMyLibraryTab();
        await fullSearch.openDossierFromSearchResultsInNewTab(name6);
        await dossierPage.goToLibrary();
        await quickSearch.openSearchSlider();
        await since('Open dossier 6th , recently viewed shortcuts count should be #{expected}, while we get #{actual}')
            .expect(await quickSearch.getRencentlyViewedShortcutCount())
            .toBe(6);

        // 7th
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickMyLibraryTab();
        await fullSearch.openDossierFromSearchResultsInNewTab(name7);
        await dossierPage.goToLibrary();
        await quickSearch.openSearchSlider();
        await since('Open dossier 7th , recently viewed shortcuts count should be #{expected}, while we get #{actual}')
            .expect(await quickSearch.getRencentlyViewedShortcutCount())
            .toBe(6);
        await since(
            'Open dossier 7th , the first item on recently viewed should be #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.getRecentlyViewedShortcutName(1))
            .toBe(name7);
    });
});
export const config = specConfiguration;
