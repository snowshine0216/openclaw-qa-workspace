import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_search') };
const browserWindow = {
    
    width: 1600,
    height: 1200,
};

describe('GlobalSearch_FullScreenSearch', () => {
    let { dossierPage, quickSearch, fullSearch, filterOnSearch, userAccount, loginPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);

        await setWindowSize(browserWindow);
    });

    it('[TC70051] Global Search - NLP - Different search keyword on search results ', async () => {
        const keyword1 = 'globalSearch'; // normal word (start with)
        const keyword2 = 'global search'; // with space
        const keyword3 = '测试'; // chinese (contains)
        const keyword4 = 'global&search'; // with special chars

        // normal keyword: search results should be 'start with' keyword, not contain. full match 'globalSearch'
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword1);
        await fullSearch.clickMyLibraryTab();
        const myLibCount1 = await fullSearch.getMyLibraryCount();
        await since(
            `Search by ${keyword1}, search results count on My Library tab should be #{expected}, while we get #{actual}`
        )
            .expect(myLibCount1)
            .toBe(6);
        await since(
            `Search by ${keyword1}, search results count on All tab should be greater than #{expected}, while we get #{actual}`
        )
            .expect(await fullSearch.getAllTabCount())
            .toBeGreaterThan(myLibCount1);

        // with space: search keyword will be splitted by space, search by 'global' 'search' 'global search' respectively
        await quickSearch.inputTextAndSearch(keyword2);
        await fullSearch.clickMyLibraryTab();
        const myLibCount2 = await fullSearch.getMyLibraryCount();
        await since(
            `Search by ${keyword2}, search results count on My Library tab should be greater than #{expected}, while we get #{actual}`
        )
            .expect(myLibCount2)
            .toBeGreaterThan(5);
        await since(
            `Search by '${keyword2}, search results count on All tab should be greater than #{expected}, while we get #{actual}`
        )
            .expect(await fullSearch.getAllTabCount())
            .toBeGreaterThan(myLibCount2);

        // Chinese: search results should be 'contains' keyword for Chinese/Japansese/Korean
        await quickSearch.inputTextAndSearch(keyword3);
        await fullSearch.clickMyLibraryTab();
        const myLibCount3 = await fullSearch.getMyLibraryCount();
        await since(
            `Search by ${keyword3}, search results count on My Library tab should be #{expected}, while we get #{actual}`
        )
            .expect(myLibCount3)
            .toBe(2);
        await since(
            `Search by ${keyword3}, search results count on All tab should be greater than #{expected}, while we get #{actual}`
        )
            .expect(await fullSearch.getAllTabCount())
            .toBeGreaterThan(myLibCount3);

        // with special chars: special chars is separartor, keyword will be splited by special chars to 'global' 'search' 'global&search' respectively
        await quickSearch.inputTextAndSearch(keyword4);
        await fullSearch.clickMyLibraryTab();
        const myLibCount4 = await fullSearch.getMyLibraryCount();
        await since(
            `Search by ${keyword4}, search results count on My Library tab should be #{expected}, while we get #{actual}`
        )
            .expect(await myLibCount4)
            .toBe(7);
        await since(
            `Search by ${keyword4}, search results count on All tab should be greater than #{expected}, while we get #{actual}`
        )
            .expect(await fullSearch.getAllTabCount())
            .toBeGreaterThan(1);
    });

    it('[TC70058] Global Search - NLP - Highlight keyword on search results of My Library Tab ', async () => {
        const keyword1 = 'global search';
        const dossier1 = '(AUTO) Global Search_NLP';
        const keyword2 = '测试';
        const dossier2 = '(AUTO) 中文测试专用';

        //  highlight with english keyword
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword1);
        await fullSearch.clickMyLibraryTab();
        await since(
            `Search by ${keyword1}, before expand matched content, highlighted text count of specific dossier on My Library tab should be #{expected}, while we get #{actual}`
        )
            .expect(await fullSearch.getHightlightTexts(dossier1).length)
            .toBe(2);
        await fullSearch.clickMatchedContentIcon(dossier1);
        await since(
            `Search by ${keyword1}, aftere expand matched content, highlighted text count of specific dossier on My Library tab should be #{expected}, while we get #{actual}`
        )
            .expect(await fullSearch.getHightlightTexts(dossier1).length)
            .toBe(11);

        //  highlight with Chinese keyword
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword2);
        await fullSearch.clickMyLibraryTab();
        await since(
            `Search by ${keyword2}, before expand matched content, highlighted text count of specific dossier on My Library tab should be #{expected}, while we get #{actual}`
        )
            .expect(await fullSearch.getHightlightTexts(dossier2).length)
            .toBe(1);
        await fullSearch.clickMatchedContentIcon(dossier2);
        await since(
            `Search by ${keyword2}, aftere expand matched content, highlighted text count of specific dossier on My Library tab should be #{expected}, while we get #{actual}`
        )
            .expect(await fullSearch.getHightlightTexts(dossier2).length)
            .toBe(4);
    });

    it('[TC70059] Global Search - NLP - Highlight keyword on search results of All Tab ', async () => {
        const keyword1 = 'global search NLP';
        const dossier1 = '(AUTO) Global Search_NLP';
        const keyword2 = '测试专用';
        const dossier2 = '(AUTO) 中文测试专用';

        //  highlight with english keyword
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword1);
        await fullSearch.clickAllTab();
        await since(
            `Search by ${keyword1}, highlighted text count of specific dossier on My Library tab should be #{expected}, while we get #{actual}`
        )
            .expect(await fullSearch.getHightlightTexts(dossier1).length)
            .toBe(3);

        //  highlight with Chinese keyword
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword2);
        await fullSearch.clickAllTab();
        await since(
            `Search by ${keyword2}, before expand matched content, highlighted text count of specific dossier on My Library tab should be #{expected}, while we get #{actual}`
        )
            .expect(await fullSearch.getHightlightTexts(dossier2).length)
            .toBe(1);
    });

    it('[TC70103] Global Search - Matched content - Different matched content object (chapter/page/viz/attribute/metric)', async () => {
        const keyword1 = 'global search';
        const keyword2 = 'globalSearch quarter';
        const keyword3 = 'globalSearch cost';
        const dossier = '(AUTO) GlobalSearch_Keyword match';
        const chapter = 'global search chapter';
        const page = 'global page';
        const viz = 'search visulization';
        const attribute = 'Quarter';
        const metric = 'Cost';

        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword1);
        await fullSearch.clickMyLibraryTab();
        await fullSearch.clickMatchedContentIcon(dossier);
        await since('Search by' + keyword1 + ' Matched content count should be #{expected}, while we get #{actual}')
            .expect(await fullSearch.getMatchContentCount(dossier))
            .toBe(5);
        // matched content: chapter
        await since('Chapter:' + chapter + ' should be existed on matched content')
            .expect(await fullSearch.isMatchedContentExisted(dossier, chapter))
            .toBe(true);
        // matched content: page
        await since('Page:' + page + ' should be existed on matched content')
            .expect(await fullSearch.isMatchedContentExisted(dossier, page))
            .toBe(true);
        // matched content: visulization
        await since('visulization:' + viz + ' should be existed on matched content')
            .expect(await fullSearch.isMatchedContentExisted(dossier, viz))
            .toBe(true);
        await takeScreenshotByElement(
            fullSearch.getMatchContentInfo(dossier),
            'TC70103',
            'GlobalSearch_MatchedContent'
        );
        await fullSearch.backToLibrary();

        // matched content: attribute
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword2);
        await fullSearch.clickMyLibraryTab();
        await fullSearch.clickMatchedContentIcon(dossier);
        await since('Search by' + keyword2 + ' Matched content count should be #{expected}, while we get #{actual}')
            .expect(await fullSearch.getMatchContentCount(dossier))
            .toBe(1);
        await since('Attribute:' + attribute + ' should be existed on matched content')
            .expect(await fullSearch.isMatchedContentExisted(dossier, attribute))
            .toBe(true);
        await fullSearch.backToLibrary();

        // matched content: cost
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword3);
        await fullSearch.clickMyLibraryTab();
        await fullSearch.clickMatchedContentIcon(dossier);
        await since('Search by' + keyword3 + ' Matched content count should be #{expected}, while we get #{actual}')
            .expect(await fullSearch.getMatchContentCount(dossier))
            .toBe(1);
        await since('Metric:' + metric + ' should be existed on matched content')
            .expect(await fullSearch.isMatchedContentExisted(dossier, metric))
            .toBe(true);

        await fullSearch.backToLibrary();
    });

    it('[TC70108] Global Search - Matched content - Execute dossier from matched content link', async () => {
        const keyword1 = 'global search';
        const keyword2 = 'globalSearch quarter';
        const keyword3 = 'globalSearch cost';
        const dossier = '(AUTO) GlobalSearch_Keyword match';
        const chapter = 'global search chapter';
        const page = 'global page';
        const viz = 'search visulization';
        const attribute = 'Quarter';
        const metric = 'Cost';

        // open dossier from matched content - chapter
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword1);
        await fullSearch.clickMyLibraryTab();
        await fullSearch.clickMatchedContentIcon(dossier);
        await since('Search by' + keyword1 + ' Matched content count should be #{expected}, while we get #{actual}')
            .expect(await fullSearch.getMatchContentCount(dossier))
            .toBe(5);
        await fullSearch.clickMatchedContentTextInNewTab(dossier, chapter);
        await since(
            'Open dossier from matched content chapter, redirected page should be #{expected}, instead we have #{actual}'
        )
            .expect(await dossierPage.title())
            .toEqual([dossier, chapter, 'global page']);
        await fullSearch.closeAllTabs();
        await dossierPage.goToLibrary();

        // open dossier from matched content - page
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword1);
        await fullSearch.clickMyLibraryTab();
        await fullSearch.clickMatchedContentIcon(dossier);
        await fullSearch.clickMatchedContentTextInNewTab(dossier, page);
        await since(
            'Open dossier from matched content page, redirected page should be #{expected}, instead we have #{actual}'
        )
            .expect(await dossierPage.title())
            .toEqual([dossier, chapter, page]);
        await fullSearch.closeAllTabs();
        await dossierPage.goToLibrary();

        // open dossier from matched content - visulization
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword1);
        await fullSearch.clickMyLibraryTab();
        await fullSearch.clickMatchedContentIcon(dossier);
        await fullSearch.clickMatchedContentTextInNewTab(dossier, viz);
        await since(
            'Open dossier from matched content viz, redirected page should be #{expected}, instead we have #{actual}'
        )
            .expect(await dossierPage.title())
            .toEqual([dossier, 'Chapter 1', 'Grid page']);
        await fullSearch.closeAllTabs();
        await dossierPage.goToLibrary();

        // open dossier from matched content - attribute
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword2);
        await fullSearch.clickMyLibraryTab();
        await fullSearch.clickMatchedContentIcon(dossier);
        await fullSearch.clickMatchedContentTextInNewTab(dossier, attribute);
        await since(
            'Open dossier from matched content attribute, redirected page should be #{expected}, instead we have #{actual}'
        )
            .expect(await dossierPage.title())
            .toEqual([dossier, chapter, page]);
        await fullSearch.closeAllTabs();
        await dossierPage.goToLibrary();

        // open dossier from matched content - metric
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword3);
        await fullSearch.clickMyLibraryTab();
        await fullSearch.clickMatchedContentIcon(dossier);
        await fullSearch.clickMatchedContentTextInNewTab(dossier, metric);
        await since(
            'Open dossier from matched content attribute, redirected page should be #{expected}, instead we have #{actual}'
        )
            .expect(await dossierPage.title())
            .toEqual([dossier, chapter, page]);
        await fullSearch.closeAllTabs();
        await dossierPage.goToLibrary();
    });

    it('[TC70287] Global Search - Search status when no results returned ', async () => {
        const keyword = 'globalSearchAutoTest';

        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);

        // sort status
        await since('Search with no results returned, sort should be Disabled')
            .expect(await fullSearch.isSortDisplay())
            .toBe(false);

        // filter status
        await since('Search with no results returned, filter on My library tab should be Disabled')
            .expect(await filterOnSearch.isFilterDisabled())
            .toBe(true);

        // no results page
        await since('Search with no results returned, brower all dossier link should be present on My library tab ')
            .expect(await fullSearch.getBrowserAllDossierLink().isDisplayed())
            .toBe(true);
        await since('Search with no results returned, brower all dossier link should be present o All tab ')
            .expect(await fullSearch.getBrowserAllDossierLink().isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(fullSearch.getSearchResultsContainer(), 'TC70287', 'GlobalSearch_NoResults');

        // browser all dossier
        await fullSearch.browserAllDossiers();
        await since('Search with no results returned, browser all dossier will link to homepage')
            .expect(await dossierPage.getLibraryIcon().isDisplayed())
            .toBe(true);
    });

    it('[TC79821] Validate search hidden objects on Library Web ', async () => {
        const dossier1 = 'HideAfterAddToLibrary';
        const dossier2 = 'HideBeforeAddToLibrary';

        // check 'HideObjectAfterAddToLibrary'
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(dossier1);
        await fullSearch.clickMyLibraryTab();
        await since('Search hidden object HideObjectAfterAddToLibrary, object should be present on my library tab ')
            .expect(await fullSearch.getMyLibraryCount())
            .toBe(1);
        await since('Search hidden object HideObjectAfterAddToLibrary, object should NOT be present on all tab')
            .expect(await fullSearch.getAllTabCount())
            .toBe(0);

        // check 'HideObjectBeforeAddToLibrary'
        await quickSearch.inputTextAndSearch(dossier2);
        await since(
            'Search hidden object HideObjectBeforeAddToLibrary, no results returned and empty page shows on My library tab'
        )
            .expect(await fullSearch.getMyLibraryCount())
            .toBe(0);
        await since(
            'Search hidden object HideObjectBeforeAddToLibrary, no results returned and empty page shows on All tab'
        )
            .expect(await fullSearch.getAllTabCount())
            .toBe(0);
    });

    it('[TC86608] Validate search across multiple projects ', async () => {
        const keyword = 'operational';

        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickAllTab();
        // filter to only document
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('Type');
        await filterOnSearch.selectOptionInCheckbox('Document');
        await filterOnSearch.applyFilterChanged();
        // check results
        await since('Search X-project, the results should be greater than #{expected}, while we get #{actual}')
            .expect(await fullSearch.getAllTabCount())
            .toBeGreaterThan(2);
    });

    it('[TC86808] Validate different report types on global search ', async () => {
        const keyword = 'reportTypeSearch';

        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickAllTab();

        // check md search results
        await since('Search report type on md search, the results should be #{expected}, while we get #{actual}')
            .expect(await fullSearch.getAllTabCount())
            .toBe(7);
        await fullSearch.backToLibrary();
    });

    it('[TC86837] Global Search - Validate search results with two or more empty space ', async () => {
        const keyword1 = 'global search';
        const keyword2 = 'global  search';
        const keyword3 = 'global         search';

        // set baseline
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword1);
        await fullSearch.clickAllTab();
        const allCount = await fullSearch.getAllTabCount();
        const myLibraryCount = await fullSearch.getMyLibraryCount();

        // search  'global  search'
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword2);
        await fullSearch.clickAllTab();
        await since(
            'Search <global  search> on Chinese locale, the results on all tab should be #{expected}, while we get #{actual}'
        )
            .expect(await fullSearch.getAllTabCount())
            .toBe(allCount);
        await since(
            'Search <global  search> on Chinese locale, the results on my library tab should be #{expected}, while we get #{actual}'
        )
            .expect(await fullSearch.getMyLibraryCount())
            .toBe(myLibraryCount);

        // search  global       search'
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword3);
        await fullSearch.clickAllTab();
        await since(
            'Search <global      search> on Chinese locale, the results on all tab should be #{expected}, while we get #{actual}'
        )
            .expect(await fullSearch.getAllTabCount())
            .toBe(allCount);
        await since(
            'Search <global      search> on Chinese locale, the results on my library tab should be #{expected}, while we get #{actual}'
        )
            .expect(await fullSearch.getMyLibraryCount())
            .toBe(myLibraryCount);

        await fullSearch.backToLibrary();
    });

    it('[TC89466] Global Search - Validatte Relevance search order on My Libarary and All tab ', async () => {
        const keyword1 = '(AUTO) GlobalSearch _Test Document';
        const name = '(AUTO) GlobalSearch_Test Document';

        // search to check relevance order
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword1);
        await fullSearch.clickMyLibraryTab();
        await since('search, the results on my library tab should be #{expected}, while we get #{actual}')
            .expect(await fullSearch.getFirstResultItemTitle())
            .toBe(name);
        await fullSearch.clickAllTab();
        await since('search, the results on all tab should be #{expected}, while we get #{actual}')
            .expect(await fullSearch.getFirstResultItemTitle())
            .toBe(name);

        // to add other cases when other scenarios are fixed

        await fullSearch.backToLibrary();
    });

    it('[TC87727] Global Search - Validate search keyword with different language  ', async () => {
        const keyword1 = '测试   对象'; // Chinese
        const keyword2 = 'Testobjekt'; // German
        const keyword3 = `Objet d'essai`; // French
        const keyword4 = 'אובייקט בדיקה'; // Hebrew
        const keyword5 = 'Objekti i testimit'; //Albania

        // change login account
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        const credentials = customCredentials('_search_locale').credentials;
        await loginPage.login(credentials);

        // chinese
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword1);
        await fullSearch.clickMyLibraryTab();
        await since(
            'Search on Chinese, the results on my library tab should be greater than #{expected}, while we get #{actual}'
        )
            .expect(await fullSearch.getAllTabCount())
            .toBeGreaterThan(0);
        await since(
            'Search on Chinese, the results on all tab should be greater than #{expected}, while we get #{actual}'
        )
            .expect(await fullSearch.getMyLibraryCount())
            .toBeGreaterThan(0);

        // German
        await quickSearch.inputTextAndSearch(keyword2);
        await fullSearch.clickMyLibraryTab();
        await since(
            'Search on German, the results on my library tab should be greater than #{expected}, while we get #{actual}'
        )
            .expect(await fullSearch.getAllTabCount())
            .toBeGreaterThan(0);
        await since(
            'Search on German, the results on all tab should be greater than #{expected}, while we get #{actual}'
        )
            .expect(await fullSearch.getMyLibraryCount())
            .toBeGreaterThan(0);

        // French
        await quickSearch.inputTextAndSearch(keyword3);
        await fullSearch.clickMyLibraryTab();
        await since(
            'Search on French, the results on my library tab should be greater than #{expected}, while we get #{actual}'
        )
            .expect(await fullSearch.getAllTabCount())
            .toBeGreaterThan(0);
        await since(
            'Search on French, the results on all tab should be greater than #{expected}, while we get #{actual}'
        )
            .expect(await fullSearch.getMyLibraryCount())
            .toBeGreaterThan(0);

        // Hebrew
        await quickSearch.inputTextAndSearch(keyword4);
        await fullSearch.clickMyLibraryTab();
        await since(
            'Search on Hebrew, the results on my library tab should be greater than #{expected}, while we get #{actual}'
        )
            .expect(await fullSearch.getAllTabCount())
            .toBeGreaterThan(0);
        await since(
            'Search on Hebrew, the results on all tab should be greater than #{expected}, while we get #{actual}'
        )
            .expect(await fullSearch.getMyLibraryCount())
            .toBeGreaterThan(0);

        // Albania
        await quickSearch.inputTextAndSearch(keyword5);
        await fullSearch.clickMyLibraryTab();
        await since(
            'Search on Albania, the results on my library tab should be greater than #{expected}, while we get #{actual}'
        )
            .expect(await fullSearch.getAllTabCount())
            .toBeGreaterThan(0);
        await since(
            'Search on Albania, the results on all tab should be greater than #{expected}, while we get #{actual}'
        )
            .expect(await fullSearch.getMyLibraryCount())
            .toBeGreaterThan(0);

        await fullSearch.backToLibrary();
    });
});
export const config = specConfiguration;
