import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_selector') };
const { credentials } = specConfiguration;
const tolerance = 0.2;

const tutorialProject = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};

describe('Library Selector - Searchbox Selector', () => {
    const docProperty1 = {
        id: '909A440A42A74F4D59B479A18139245D',
        name: 'AUTO_show element count_search on server/client_exclude_Search Box',
        project: tutorialProject,
    };
    const docProperty2 = {
        id: '9F865C564EF838699F68A2952244A148',
        name: 'AUTO_use first_display form_not allow multiple_Search Box',
        project: tutorialProject,
    };
    const docFormat1 = {
        id: '1193142F43C8516D675FD1A576FCFC64',
        name: 'AUTO_Color and Gradient_Borde_Search Box',
        project: tutorialProject,
    };
    const docFormat2 = {
        id: '53F5643041466620DFF085BC7B908002',
        name: 'AUTO_Font_Search Box',
        project: tutorialProject,
    };
    const docsSourceAndTarget1 = {
        id: 'A498EADB4291F45EEE2BA3ADDA03E67C',
        name: 'AUTO_Searchbox_ no source_no target',
        project: tutorialProject,
    };
    const docsSourceAndTarget2 = {
        id: '288B91D54CAD54750604FF8329FDE0DC',
        name: 'AUTO_Searchbox_ target selector_target viz_select attribue element',
        project: tutorialProject,
    };

    let { loginPage, selector, libraryPage, dossierPage, rsdPage, toc, rsdGrid } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC80373] Library | Searchbox selector - Property', async () => {
        await resetDossierState({ credentials, dossier: docProperty1 });
        await libraryPage.openUrl(tutorialProject.id, docProperty1.id);
        const selector1 = rsdPage.findSelectorByName('SearchOnSearverSearchBox');
        const selector2 = rsdPage.findSelectorByName('SearchOnClientSearchBox');

        // show title + show element count
        const title1 = selector1.searchbox.getTitle();
        const title2 = selector2.searchbox.getTitle();
        await since(
            'show element count - include: The count displayed on title should be #{expected}, while we get #{actual}'
        )
            .expect(await title1.getTitleText())
            .toBe('Category_Search on Server (1 Selected)');
        await since(
            'Show element count - exclude: The count displayed on title should be #{expected}, while we get #{actual}'
        )
            .expect(await title2.getTitleText())
            .toBe('Subcategory_Search on Client (19 of 24)');
        await since('Show element count - exclude: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Books');

        // search on servere
        await selector1.searchbox.input('c');
        await since('Search on server: The search results count should be #{expected}, while we get #{actual} ')
            .expect((await selector1.searchbox.getSuggestionListItems()).length)
            .toBe(3);
        await selector1.searchbox.selectNthItem(2, 'Electronics:2');
        await since('Search on server: The selected element total count should be #{expected}, while we get #{actual} ')
            .expect((await selector1.searchbox.getSelectedItems()).length)
            .toBe(2);
        await takeScreenshotByElement(
            selector1.searchbox.getOuterContainer(),
            'TC80373',
            'SearchboxSelector_Property_SearchOnServer'
        );

        // search on client
        await selector2.searchbox.input('b');
        await since('Search on client: The search results count should be #{expected}, while we get #{actual} ')
            .expect((await selector2.searchbox.getSuggestionListItems()).length)
            .toBe(3);
        await selector2.searchbox.selectNthItem(2, 'Business');

        await since('Search on client: The selected element total count should be #{expected}, while we get #{actual} ')
            .expect((await selector2.searchbox.getSelectedItems()).length)
            .toBe(6);

        // exclude
        await takeScreenshotByElement(
            selector2.searchbox.getOuterContainer(),
            'TC80373',
            'SearchboxSelector_Property_SearchOnClient_Exclude'
        );

        await resetDossierState({ credentials, dossier: docProperty2 });
        await libraryPage.openUrl(tutorialProject.id, docProperty2.id);
        const selector3 = rsdPage.findSelectorByName('useFirst');
        const selector4 = rsdPage.findSelectorByName('NotAllowMulti');

        // Not allow multiple
        await since('Not allow multiple selections: The search should be diabled ')
            .expect(await selector4.searchbox.isSearchEnabled())
            .toBe(false);
        // use first
        await since('Use first 2: The selected element total count should be #{expected}, while we get #{actual} ')
            .expect((await selector3.searchbox.getSelectedItems()).length)
            .toBe(2);
        await since('Use first 2: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Music');

        // display form
        await selector3.searchbox.input('a');
        await since('Display form: The search results should be #{expected}, while we get #{actual} ')
            .expect(await selector3.searchbox.getSuggestionListText())
            .toEqual(['43;Music - Miscellaneous']);
        await selector3.searchbox.selectNthItem(1, '43;Music - Miscellaneous');
        await since('Display form: The selected element total count should be #{expected}, while we get #{actual} ')
            .expect((await selector3.searchbox.getSelectedItems()).length)
            .toBe(3);
    });

    it('[TC80374] Library | Searchbox selector - Foramt', async () => {
        // Color and lines
        await resetDossierState({ credentials, dossier: docFormat1 });
        await libraryPage.openUrl(tutorialProject.id, docFormat1.id);
        await selector.searchbox.input('f');
        await selector.searchbox.selectNthItem(2, 'Folks:Adrienne');

        await since('Color and lines: The selected element total count should be #{expected}, while we get #{actual} ')
            .expect((await selector.searchbox.getSelectedItems()).length)
            .toBe(2);
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80374',
            'SearchboxSelector_Format_ColorAndLines_selectElement',
            {
                tolerance: tolerance,
            }
        );

        // Font
        await resetDossierState({ credentials, dossier: docFormat2 });
        await libraryPage.openUrl(tutorialProject.id, docFormat2.id);
        await selector.searchbox.input('ult');
        await selector.searchbox.selectNthItem(1, '(All search results)');

        await since('Color and lines: The selected element total count should be #{expected}, while we get #{actual} ')
            .expect((await selector.searchbox.getSelectedItems()).length)
            .toBe(3);
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80374',
            'SearchboxSelector_Format_Font_selectElement',
            {
                tolerance: tolerance,
            }
        );
    });

    it('[TC80375] Library | Searchbox selector - Source and Target', async () => {
        // No source and target
        await resetDossierState({ credentials, dossier: docsSourceAndTarget1 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget1.id);
        await rsdPage.waitAllToBeLoaded();
        const selector1 = rsdPage.findSelectorByName('NoSource');
        await selector1.searchbox.input('a');
        await since('No source: There should be no search results window')
            .expect(await selector1.searchbox.isSearchResultPresent())
            .toBe(false);
        await since('No source: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Books');
        await takeScreenshotByElement(
            selector1.searchbox.getOuterContainer(),
            'TC80375',
            'SearchboxSelector_SourceAndTartet_noSource'
        );

        await resetDossierState({ credentials, dossier: docsSourceAndTarget2 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget2.id);
        await rsdPage.waitAllToBeLoaded();
        const selector2 = rsdPage.findSelectorByName('searchCategory');
        const selector3 = rsdPage.findSelectorByName('searchSubCategory');

        // With target - filtered by selector
        await selector3.searchbox.input('Action');
        await since('Filtered by selector: Search result should be #{expected}, while we get #{actual}')
            .expect(await selector3.searchbox.getSuggestionListText())
            .toEqual(['No elements match your search']);
        await takeScreenshotByElement(
            selector3.searchbox.getOuterContainer(),
            'TC80375',
            'SearchboxSelector_SourceAndTartet_filteredBySelector'
        );

        // With target - target to selector and viz
        await resetDossierState({ credentials, dossier: docsSourceAndTarget2 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget2.id);
        await rsdPage.waitAllToBeLoaded();
        await selector2.searchbox.input('m');
        await since('Target selector and viz : The search results count should be #{expected}, while we get #{actual} ')
            .expect((await selector2.searchbox.getSuggestionListItems()).length)
            .toBe(3);
        await selector2.searchbox.selectNthItem(2, 'Movies:3');
        await rsdPage.waitAllToBeLoaded();
        await since(
            'Target selector and viz: The selected element total count should be #{expected}, while we get #{actual} '
        )
            .expect((await selector2.searchbox.getSelectedItems()).length)
            .toBe(2);

        // With target - target to viz
        await selector3.searchbox.input('Action');
        await since('Target viz : The search results count should be #{expected}, while we get #{actual} ')
            .expect((await selector3.searchbox.getSuggestionListItems()).length)
            .toBe(1);
        await selector3.searchbox.selectNthItem(1, 'Action');
        await rsdPage.waitAllToBeLoaded();
        await since('Target viz: The selected element total count should be #{expected}, while we get #{actual} ')
            .expect((await selector3.searchbox.getSelectedItems()).length)
            .toBe(2);
    });

    it('[TC80376] Library | Searchbox selector - Manipulation', async () => {
        await resetDossierState({ credentials, dossier: docsSourceAndTarget2 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget2.id);
        const selector = rsdPage.findSelectorByName('searchCategory');

        // select
        await selector.searchbox.input(' ');
        await since('Select all : The search results count should be #{expected}, while we get #{actual} ')
            .expect((await selector.searchbox.getSuggestionListItems()).length)
            .toBe(4);
        await selector.searchbox.selectNthItem(1, '(All search results)');
        await rsdPage.waitAllToBeLoaded();
        await since('Select all : The selected element total count should be #{expected}, while we get #{actual} ')
            .expect((await selector.searchbox.getSelectedItems()).length)
            .toBe(4);

        // delete
        await selector.searchbox.deleteItemByText('Movies:3');
        await rsdPage.waitAllToBeLoaded();
        await since('Delete element : The selected element total count should be #{expected}, while we get #{actual} ')
            .expect((await selector.searchbox.getSelectedItems()).length)
            .toBe(3);
        await since('Delete element : Movies:3 display should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.isCellDisplayed('Movies:3'))
            .toBe(false);
    });

    it('[TC80377] Validate Search box selector - Different search keyword', async () => {
        await resetDossierState({ credentials, dossier: docsSourceAndTarget2 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget2.id);
        const selector1 = rsdPage.findSelectorByName('searchCategory');
        const selector2 = rsdPage.findSelectorByName('searchSubCategory');

        // search by special chars
        await selector2.searchbox.input('Science & Technology');
        await since('Search by special chars : The search results count should be #{expected}, while we get #{actual} ')
            .expect((await selector2.searchbox.getSuggestionListItems()).length)
            .toBe(1);
        await selector2.searchbox.selectNthItem(1, 'Science & Technology');
        await rsdPage.waitAllToBeLoaded();
        await since(
            'Search by special chars: Science & Technology display should be #{expected}, while we get #{actual}'
        )
            .expect(await rsdGrid.isCellDisplayed('Science & Technology'))
            .toBe(true);

        // search by number
        await selector1.searchbox.input('2');
        await since('Search by number : The search results count should be #{expected}, while we get #{actual} ')
            .expect((await selector1.searchbox.getSuggestionListItems()).length)
            .toBe(1);
        await selector1.searchbox.selectNthItem(1, 'Electronics:2');
        await rsdPage.waitAllToBeLoaded();
        await since('Search by special chars: Electronics:2 display should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.isCellDisplayed('Electronics:2'))
            .toBe(false);

        // search by long keyword & no results
        await selector2.searchbox.input('longKeyWord onSearchbox');
        await since('Search by long keyword : The search results should NOT be present')
            .expect(await selector2.searchbox.isSearchResultPresent())
            .toBe(true);
        await takeScreenshotByElement(
            selector2.searchbox.getOuterContainer(),
            'TC80377',
            'Searchbox_SearchKey_LongChars'
        );
    });

    it('[TC80378] Validate Search box selector - Delete and reset selection', async () => {
        await resetDossierState({ credentials, dossier: docsSourceAndTarget2 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget2.id);
        await rsdPage.waitAllToBeLoaded();
        const subcategorySelector = rsdPage.findSelectorByName('searchSubCategory');

        // Search all search results
        await subcategorySelector.searchbox.input(' ');
        await since(
            'Select all search results: The search results count should be #{expected}, while we get #{actual} '
        )
            .expect((await subcategorySelector.searchbox.getSuggestionListItems()).length)
            .toBe(6);
        await subcategorySelector.searchbox.selectNthItem(1, '(All search results)');
        await since(
            'Select all search results: The selected element count should be #{expected}, while we get #{actual} '
        )
            .expect((await subcategorySelector.searchbox.getSelectedItems()).length)
            .toBe(6);

        // Clear the selections
        await subcategorySelector.searchbox.clearAllSelections();
        await since('Clear all search results: The search box count should be empty, while we get #{actual}')
            .expect(await subcategorySelector.searchbox.isSearchboxEmpty())
            .toBe(true);
        await since('SClear all search results: Businessdisplay should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.isCellDisplayed('Business'))
            .toBe(true);
        await takeScreenshotByElement(
            subcategorySelector.searchbox.getOuterContainer(),
            'TC80378',
            'Searchbox_clearAll'
        );
    });
});
export const config = specConfiguration;
