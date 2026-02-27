import {  customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import InCanvasSelector from '../../../pageObjects/selector/InCanvasSelector.js';



const specConfiguration = { ...customCredentials('_incanvas_selector') };
const { credentials } = specConfiguration;
const tutorialProject = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};
const tolerance = 0.3;

describe('Incanvas Selector - searchbox', () => {
    const dossier = {
        id: 'A89416524A229046D100658CBB1D33F0',
        name: '(AUTO) In-canvas selector - searchbox',
        project: tutorialProject,
    };

    const dossierWithPreload = {
        id: '7EBA2C244818997B38187C943E52DFB7',
        name: '(Auto) SearchBox ICS+ Filter_Parameter',
        project: tutorialProject,
    };

    const dossierWithNewElementSearch = {
        id: '53D817A93543319DFF8748889EC689E1',
        name: '(Auto) NewElementSearch',
        project: tutorialProject,
    };

    const dossierWithNewElementSearchParameter = {
        id: '845EAFE8AD4EEE5F74C223ADB0B152AE',
        name: '(Auto) NewElementSearch_Parameter',
        project: tutorialProject,
    };

    const rwdWithNewElementSearch = {
        id: 'E3542F0EDB4C2EDB4DA30B9C4C23C967',
        name: '(Auto) RSD_NewElementSearch',
        project: tutorialProject,
    };

    const browserWindow = {
        
        width: 1600,
        height: 1200,
    };

    let { 
        dossierPage, 
        toc, 
        libraryPage, 
        inCanvasSelector, 
        grid, 
        loginPage, 
        filterPanel, 
        searchBoxFilter, 
        radiobuttonFilter, 
        authoringFilters,
        contentsPanel,
        libraryAuthoringPage,
        rsdPage,
        dossierAuthoringPage,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC80660] Incanvas selector - searchbox - property, format and source & target', async () => {
        await libraryPage.openDossier(dossier.name);

        // format
        await toc.openPageFromTocMenu({ chapterName: 'Format', pageName: 'title and container' });
        await takeScreenshotByElement(inCanvasSelector.getInstance(), 'TC80660', 'title and container', {
            tolerance: tolerance,
        });

        await toc.openPageFromTocMenu({ chapterName: 'Format', pageName: 'text and form' });
        const forms1 = InCanvasSelector.createByTitle('font 5 pt');
        const forms2 = InCanvasSelector.createByTitle('font 8pt');
        const forms3 = InCanvasSelector.createByTitle('font 14 pt');
        await takeScreenshotByElement(forms1.getElement(), 'TC80660', 'text and form -1', { tolerance: tolerance });
        await takeScreenshotByElement(forms2.getElement(), 'TC80660', 'text and form -2', { tolerance: tolerance });
        await takeScreenshotByElement(forms3.getElement(), 'TC80660', 'text and form -3', { tolerance: tolerance });
        await since('Open text and form, the first element is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Books');

        // property
        await toc.openPageFromTocMenu({ chapterName: 'Property', pageName: 'include and exclude' });
        await takeScreenshotByElement(inCanvasSelector.getInstance(), 'TC80660', 'include and exclude', {
            tolerance: tolerance,
        });

        await toc.openPageFromTocMenu({ chapterName: 'Property', pageName: 'dynamic selection' });
        await inCanvasSelector.initial();
        await inCanvasSelector.searchSearchbox('e');
        await takeScreenshotByElement(inCanvasSelector.getSearchSuggest(), 'TC80660', 'dynamic selection', {
            tolerance: tolerance,
        });

        await toc.openPageFromTocMenu({ chapterName: 'Property', pageName: 'sort and multi-form' });
        await takeScreenshotByElement(inCanvasSelector.getInstance(), 'TC80660', 'sort and multi-form', {
            tolerance: tolerance,
        });
        await since('sort and multi-form, the first element is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Books');

        // source and target
        await toc.openPageFromTocMenu({ chapterName: 'Source and Target', pageName: 'targets' });
        await inCanvasSelector.initial();
        await since('Source and Target, selected item should be #{expected}, while we get #{actual}')
            .expect(await inCanvasSelector.getSelectedSearchboxItem().length)
            .toBe(2);
    });

    it('[TC80663] Incanvas selector - searchbox - manipulation ', async () => {
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Property', pageName: 'dynamic selection' });

        // search & select
        await inCanvasSelector.searchSearchbox('e');
        await inCanvasSelector.selectSearchBoxItem('Electronics');
        await since('Select item, selected item should be #{expected}, while we get #{actual}')
            .expect(await inCanvasSelector.getSelectedSearchboxItem().length)
            .toBe(3);
        await dossierPage.clickPageTitle();

        // reset to last 2
        await inCanvasSelector.openContextMenu();
        await inCanvasSelector.selectOptionInMenu('Reset to Last 2');
        await since('Unset filter, item selected should be #{expected}, while we get #{actual}')
            .expect(await inCanvasSelector.getSelectedSearchboxItem().length)
            .toBe(2);

        // clear all
        await dossierPage.clickPageTitle();
        await inCanvasSelector.openContextMenu();
        await inCanvasSelector.selectOptionInMenu('Clear All');
        await takeScreenshotByElement(inCanvasSelector.getInstance(), 'TC80663', 'Clear All');
    });

    it('[TC80663_01] Incanvas selector and filter - searchbox with preload - consumption ', async () => {
        // reset dossier state
        await resetDossierState({
            credentials: credentials,
            dossier: dossierWithPreload,
        });
        // open dossier
        await libraryPage.openDossier(dossierWithPreload.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Multiple Selection + Disable preload' });
        // kinds of selectors
        const categorySelector = InCanvasSelector.createByAriaLable('Category');
        const itemSelector = InCanvasSelector.createByAriaLable('Item');
        const customerSelector = InCanvasSelector.createByAriaLable('Customer');
        const customerParameterSelector = InCanvasSelector.createByAriaLable('Customer Parameter');

        // check ics with disabled preload + multiple selection
        await categorySelector.openContextMenu();
        await categorySelector.selectOptionInMenu('Unset Filter');
        await categorySelector.searchSearchbox('m');
        await categorySelector.selectSearchBoxItemsForPreload({ items: ['Music', 'Movies'], isPreloaded: false, isSingleSelection: false });
        since('Select item for search m, selected item should be #{expected}, while we get #{actual}')
            .expect(await categorySelector.getSelectedSearchboxItem().length)
            .toBe(2);
        await categorySelector.searchSearchbox('o', true);
        since('select item for search o, selected item in suggest list should be #{expected}, while we get #{actual}')
            .expect(await categorySelector.getSelectedSearchSuggestItemsText())
            .toEqual(['Movies']);
        await takeScreenshotByElement(categorySelector.getSearchSuggest(), 'TC80663_01', 'Category - searchbox - multiple selection + disabled preload');
        await categorySelector.selectSearchBoxItemsForPreload({ items: ['(All search results)'], isPreloaded: false, isSingleSelection: false });
        await since('Select item all search result, selected item should be #{expected}, while we get #{actual}')
            .expect(await categorySelector.getSelectedSearchboxItem().length)
            .toBe(4);
        await categorySelector.searchSearchbox('o', true);
        await since('search o again, selected item in suggest list should be #{expected}, while we get #{actual}')
            .expect(await categorySelector.getSelectedSearchSuggestItemsText())
            .toEqual(['Books', 'Electronics', 'Movies']);
        await categorySelector.selectSearchBoxItemsForPreload({ items: ['Books'], isPreloaded: false, isSingleSelection: false });

        // check filter with disabled preload + multi selection
        await filterPanel.openFilterPanel();
        await searchBoxFilter.openSecondaryPanel('Customer Parameter');
        await searchBoxFilter.search('a');
        await searchBoxFilter.selectElementsByNames(['Aaby:Alen', 'Aafedt:Wendy']);
        await searchBoxFilter.selectAll();
        await since(
            'Search "a" and select all for customer parameter searchbox filter, selection is supposed to be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await searchBoxFilter.filterSelectionInfo('Customer Parameter'))
            .toBe('(500 selected)'); 
        await searchBoxFilter.scrollFilterToBottom();
        await searchBoxFilter.selectAll();
        await since(
            'After scroll to the bottom and select all for customer parameter searchbox filter, selection is supposed to be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await searchBoxFilter.filterSelectionInfo('Customer Parameter'))
            .toBe('(1000 selected)');
        await searchBoxFilter.openSecondaryPanel('Item'); 
        await searchBoxFilter.search('Art As');
        since('Search "Art As" for item searchbox filter, suggested item index should be #{expected}, while we get #{actual}')
            .expect(await searchBoxFilter.getElementIndexInSearchResults('Art As Experience'))
            .toBe(0);

        // check ics with enabled preload + multi selection
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'Multiple Selection + Enable preload' });
        await customerSelector.openContextMenu();
        await customerSelector.selectOptionInMenu('Unset Filter');
        await customerSelector.searchSearchbox('Wend');
        await customerSelector.selectSearchBoxItemsForPreload({ items: ['Aafedt:Wendy', 'Bales:Wenda', 'Levens:Wendy'], isPreloaded: true, isSingleSelection: false });
        await customerSelector.searchSearchbox('wendy', true);
        since('Select item for item searchbox, selected item order should be #{expected}, while we get #{actual}')
            .expect(await customerSelector.getSelectedSearchSuggestItemsIndex())
            .toEqual(['1', '3']);
        since('Select item for item searchbox, selected item text should be #{expected}, while we get #{actual}')
            .expect(await customerSelector.getSelectedSearchSuggestItemsText())
            .toEqual(['Aafedt:Wendy', 'Levens:Wendy']);
        await customerSelector.selectSearchBoxItemsForPreload({ items: ['(All search results)'], isPreloaded: true, isSingleSelection: false });
        await customerSelector.dismissPreloadElementList();
        since ('the selected items in item ics should be #{expected}, while we get #{actual}')
            .expect(await customerSelector.getSelectedSearchboxItem().length)
            .toBe(6);
        
        // check filter with enabled preload + multi selection
        await filterPanel.openFilterPanel();
        await searchBoxFilter.openSecondaryPanel('Item');
        await searchBoxFilter.selectElementsByNames(['100 Places to Go While Still Young at Heart', 'Art As Experience', 'Hirschfeld on Line']);
        await searchBoxFilter.search('100');
        await searchBoxFilter.selectAll();
        since(
            'Search "100" and select all for item searchbox filter, selection is supposed to be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await searchBoxFilter.filterSelectionInfo('Item'))
            .toBe('(5 selected)');

        // check ics with single selection + disable preload
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 3', pageName: 'Single Selection + Disable preload' });
        await itemSelector.openContextMenu();
        await itemSelector.selectOptionInMenu('Unset Filter');
        await itemSelector.searchSearchbox('100');
        await itemSelector.selectSearchBoxItem('100 Places to Go While Still Young at Heart');
        await itemSelector.deleteSearchboxItems(['100 Places to Go While Still Young at Heart']);
        await itemSelector.searchSearchbox('50');
        await itemSelector.selectSearchBoxItem('50 Favorite Rooms');
        await itemSelector.deleteSearchboxItems(['50 Favorite Rooms']);
        await itemSelector.searchSearchbox('Art As ');
        since('Search "Art As " for item searchbox, suggested item index should be #{expected}, while we get #{actual}')
            .expect(await itemSelector.getSearchSuggestItemIndex('Art As Experience'))
            .toBe('0');
        await itemSelector.selectSearchBoxItem('Art As Experience');
        since('Select item for item searchbox, selected item order should be #{expected}, while we get #{actual}')
            .expect(await itemSelector.getSelectedItemsText(true))
            .toEqual(['Art As Experience']);
        // for filter with single selection + disable preload which has been covered in existing filter automation

        // check ics with single selection + enable preload
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 4', pageName: 'Single Selection + Enable preload' });
        await customerSelector.openContextMenu();
        await customerSelector.selectOptionInMenu('Unset Filter');
        await customerSelector.searchSearchbox('Wend');
        await customerSelector.selectSearchBoxItem('Aafedt:Wendy');
        await customerSelector.deleteSearchboxItems(['Aafedt:Wendy']);
        await customerSelector.searchSearchbox('wendy');
        await customerSelector.selectSearchBoxItem('Levens:Wendy');
        since('Select item for customer searchbox, selected item order should be #{expected}, while we get #{actual}')
            .expect(await customerSelector.getSelectedItemsText(true))
            .toEqual(['Levens:Wendy']);

        // check filter with single selection + enable preload
        await filterPanel.openFilterPanel();
        await searchBoxFilter.openSecondaryPanel('Customer');
        await radiobuttonFilter.selectElementByName('Aaby:Alen');
        await searchBoxFilter.search('Wend');
        await radiobuttonFilter.selectElementByName('Aafedt:Wendy');
        since(
            'Select item for customer searchbox filter, selected item order should be #{expected}, while we get #{actual}'
        )
            .expect(await searchBoxFilter.filterSelectionInfo('Customer'))
            .toBe('(1 selected)');
        
        // check mandatory ics with multiple selection + enable preload
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 6', pageName: 'Multiple Selection + Enable preload + required' });
        await categorySelector.searchSearchbox('m');
        await categorySelector.selectSearchBoxItemsForPreload({ items: ['(All search results)'], isPreloaded: true , isSingleSelection: false });
        await categorySelector.searchSearchbox('b', true);
        await categorySelector.selectSearchBoxItemsForPreload({ items: ['Books'], isPreloaded: true, isSingleSelection: false });
        since ('Search "m" and select all for category searchbox filter, selection is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await categorySelector.getSelectedItemsText(true))
            .toEqual(['Movies', 'Music', 'Books']);
        await categorySelector.dismissSuggestionList();
        await categorySelector.openContextMenu();
        await categorySelector.selectOptionInMenu('Reset');
        since ('After reset, the warning message in category searchbox should be #{expected}, while we get #{actual}')
            .expect(await categorySelector.getSearchBoxMandatoryWarningMessageText()).toBe("Make at least one selection.");

    });

    it('[TC80663_02] Incanvas selector and filter - searchbox with preload - authoring ', async () => {
        // open dossier
        await libraryPage.openDossier(dossierWithPreload.name);
        await libraryAuthoringPage.editDossierFromLibrary();
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Multiple Selection + Disable preload' });
        await authoringFilters.switchToFilterPanel();
        
        // check filter with multiple selection + disable preload
        await authoringFilters.setFilterToSelectorContainer('Customer');
        let searchbox = authoringFilters.selectorObject.searchbox;
        await searchbox.input('wendy');
        await searchbox.selectItemsByTextForPreload({ texts: ['Aafedt:Wendy', 'Levens:Wendy'], isPreloaded: false, isSingleSelection: false });
        since ('Search "wendy" and select items for customer searchbox filter, selection is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await searchbox.getSelectedItemsText())
            .toEqual(['Aafedt:Wendy', 'Levens:Wendy']);
        
        // check filter with multiple selection + enable preload
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Multiple Selection + Enable preload' });
        await authoringFilters.setFilterToSelectorContainer('Category');
        searchbox = authoringFilters.selectorObject.searchbox;
        // check error handling case
        await searchbox.input('yug');
        since ('Search "yug" for category searchbox filter, suggested items should be #{expected}, while we get #{actual}')
            .expect(await searchbox.getSuggestListItemsText())
            .toEqual(['No elements match your search']);
        since ('When there is no data in search result, the input value of searchbox should be #{expected}, while we get #{actual}')
            .expect(await searchbox.getSearchBoxInputValue())
            .toBe('yug');
        await searchbox.dismissSuggestionList();
        await searchbox.input('a&& c');
        since( 'Search "a&& c" for category searchbox filter, suggested items should be #{expected}, while we get #{actual}')
            .expect(await searchbox.getSuggestListItemsText())
            .toEqual(['Error loading']);
        since ('When there is error in search result, the input value of searchbox should be #{expected}, while we get #{actual}')
            .expect(await searchbox.getSearchBoxInputValue())
            .toBe('a&& c');
        await searchbox.dismissSuggestionList();
        // check preload element list
        await searchbox.input('m');
        await searchbox.selectItemsByTextForPreload({ texts: ['(All search results)'], isPreload: true, isSingleSelection: false });
        await searchbox.dismissSuggestionList();
        await searchbox.input('b');
        await searchbox.selectItemsByTextForPreload({ texts: ['Books'], isPreload: true, isSingleSelection: false });
        await searchbox.dismissSuggestionList();
        await searchbox.input('m');
        await searchbox.selectItemsByTextForPreload({ texts: ['(All search results)'], isPreload: true, isSingleSelection: false });
        since ('Search "m" and select all for category searchbox filter, selection is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await searchbox.getSelectedItemsText())
            .toEqual(['Movies', 'Music', 'Books']);

        // check filter with single selection + disable preload
        await contentsPanel.goToPage({ chapterName: 'Chapter 3', pageName: 'Single Selection + Disable preload' });
        await authoringFilters.setFilterToSelectorContainer('Item');
        searchbox = authoringFilters.selectorObject.searchbox;
        await searchbox.input('100');
        await searchbox.selectItemsByTextForPreload({ texts: ['100 Places to Go While Still Young at Heart'], isPreload: false, isSingleSelection: true });
        await searchbox.clearAllSelections();
        await searchbox.input('50');
        await searchbox.selectItemsByTextForPreload({ texts: ['50 Favorite Rooms'], isPreload: false, isSingleSelection: true });
        since ('Search "50" and select items for item searchbox filter, selection is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await searchbox.getSelectedItemsText())
            .toEqual(['50 Favorite Rooms']);
        await searchbox.clearAllSelections();
        await searchbox.input('Art As ');
        since ('Search "Art As " for item searchbox filter, suggested items should be #{expected}, while we get #{actual}')
            .expect(await searchbox.getSearchSuggestItemIndex('Art As Experience'))
            .toBe('0');

        // check fitler with single selection + enable preload
        await contentsPanel.goToPage({ chapterName: 'Chapter 4', pageName: 'Single Selection + Enable preload' });
        await authoringFilters.setFilterToSelectorContainer('Customer Parameter');
        searchbox = authoringFilters.selectorObject.searchbox;
        await searchbox.input('wend');
        await searchbox.selectItemsByTextForPreload({ texts: ['Aafedt:Wendy'], isPreload: true, isSingleSelection: true });
        await searchbox.clearAllSelections();
        await searchbox.input('wendy');
        await searchbox.selectItemsByTextForPreload({ texts: ['Levens:Wendy'], isPreload: true, isSingleSelection: true });
        since ('Search "wendy" and select items for customer searchbox filter, selection is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await searchbox.getSelectedItemsText())
            .toEqual(['Levens:Wendy']);   
        await dossierAuthoringPage.clickCloseDossierButton();
    });

     it('[TC80663_03] new element search - consumption && authoring', async () => {
        // new element search is only supported in tanzu env
        if (browser.options.baseUrl.includes('hypernow')) {
            //reset dossier state
            await resetDossierState({
                credentials: credentials,
                dossier: dossierWithNewElementSearch,
            });

            await libraryPage.openDossier(dossierWithNewElementSearch.name);
            await toc.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
            const attriSelector = InCanvasSelector.createByAriaLable('Atrri');
            const col2Selector = InCanvasSelector.createByAriaLable('col2');

            // check ics with new element search
            await attriSelector.searchSearchbox('A B C');
            since('suggested items should be #{expected}, while we get #{actual}')
                .expect(await attriSelector.getSearchSuggestItemsCount())
                .toBe(16);
            since('A B C index should be #{expected}, while we get #{actual}')
                .expect(await attriSelector.getSearchSuggestItemIndex('A B C'))
                .toBe('1');
            await attriSelector.dismissSuggestionList();;
            await attriSelector.searchSearchbox('Anna Smith -Jane +Evans');
            since('suggested items should be #{expected}, while we get #{actual}')
                .expect(await attriSelector.getSearchSuggestItemsText())
                .toEqual(['Anna Smith -Jane +Evans']);
            await attriSelector.dismissSuggestionList();
            await attriSelector.searchSearchbox('(Jan OR John) AND Evans');
            since('suggested items should be #{expected}, while we get #{actual}')
                .expect(await attriSelector.getSearchSuggestItemsText())
                .toEqual(['Anna Smith -Jane +Evans']);
            await attriSelector.dismissSuggestionList();
            await col2Selector.searchSearchbox('a30000');
            since('suggested items count should be #{expected}, while we get #{actual}')
                .expect(await col2Selector.getSearchSuggestItemsCount())
                .toBe(101);
            await col2Selector.dismissSuggestionList();
            await col2Selector.searchSearchbox('30000');
            since('suggested items list should be #{expected}, while we get #{actual}')
                .expect(await col2Selector.getSearchSuggestItemsText())
                .toEqual(['No elements match your search']);
            
            // check the same search in filter panel
            await searchBoxFilter.openSecondaryPanel('Atrri');
            await searchBoxFilter.search('Anna Smith -Jane +Evans');
            since('suggested items should be #{expected}, while we get #{actual}')
                .expect(await searchBoxFilter.getSearchResultsText(true))
                .toEqual(['Anna Smith -Jane +Evans']);
            await searchBoxFilter.selectElementsByNames(['Anna Smith -Jane +Evans']);
            await searchBoxFilter.toggleViewSelectedOptionOn();
            since ('Year filter selected options should be #{expected}, instead we have #{actual}')
                .expect(await searchBoxFilter.getSearchResultsText())
                .toEqual(['Anna Smith -Jane +Evans']);
            await searchBoxFilter.clearSearch();

            await searchBoxFilter.openSecondaryPanel('col2');
            await searchBoxFilter.search('a30000');
            since('suggested items count should be #{expected}, while we get #{actual}')
                .expect(await searchBoxFilter.searchResults(true))
                .toBe('100 results found');
            await searchBoxFilter.clearSearch();
            await searchBoxFilter.search('30000');
            since('suggested items count should be #{expected}, while we get #{actual}')
                .expect(await searchBoxFilter.searchResults(true))
                .toBe('0 results found');
            await searchBoxFilter.clearSearch();

            // check ics and filter on authoring mode
            await libraryAuthoringPage.editDossierFromLibrary();
            await authoringFilters.switchToFilterPanel();
        
            // check filter with new element search
            await authoringFilters.setFilterToSelectorContainer('Atrri');
            let searchbox = authoringFilters.selectorObject.searchbox;
            await searchbox.input('(Jan OR John) AND Evans');
            since ('Search "(Jan OR John) AND Evans" for atrri searchbox filter, suggested items should be #{expected}, while we get #{actual}')
                .expect(await searchbox.getSuggestListItemsText())
                .toEqual(['Anna Smith -Jane +Evans']);
            await searchbox.dismissSuggestionList();
            await searchbox.input('a && c');
            since( 'Search "a && c" for category searchbox filter, suggested items should be #{expected}, while we get #{actual}')
                .expect(await searchbox.getSuggestListItemsText())
                .toEqual(['(All search results)','A C','A B C']);
            await searchbox.dismissSuggestionList();

            // check ics with new element search
            await col2Selector.searchSearchbox('30000');
            since('suggested items list should be #{expected}, while we get #{actual}')
                .expect(await col2Selector.getSearchSuggestItemsText())
                .toEqual(['No elements match your search']);
            await col2Selector.dismissSuggestionList();
            await attriSelector.searchSearchbox('(Ann OR John) AND Evans');
            since('suggested items should be #{expected}, while we get #{actual}')
                .expect(await attriSelector.getSearchSuggestItemsText())
                .toEqual(['Anna Smith -Jane +Evans']);
            await attriSelector.dismissSuggestionList();
            await dossierAuthoringPage.clickCloseDossierButton();
        }
        
    });
    
    it('[TC80663_04] new element search with parameter - consumption && authoring', async () => {
        // new element search is only supported in tanzu env
        if (browser.options.baseUrl.includes('hypernow')) {
            //reset dossier state
            await resetDossierState({
                credentials: credentials,
                dossier: dossierWithNewElementSearchParameter,
            });

            await libraryPage.openDossier(dossierWithNewElementSearchParameter.name);
            await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
            const attriParameterSelector = InCanvasSelector.createByAriaLable('Atrri');
            const subcategoryParameterSelector = InCanvasSelector.createByAriaLable('Subcategory');
            const customerParameterSelector = InCanvasSelector.createByAriaLable('Customer');

            // check ics with new element search
            await attriParameterSelector.searchSearchbox('A B C');
            since('suggested items should be #{expected}, while we get #{actual}')
                .expect(await attriParameterSelector.getSearchSuggestItemsCount())
                .toEqual(16);
            since('A B C index should be #{expected}, while we get #{actual}')
                .expect(await attriParameterSelector.getSearchSuggestItemIndex('A B C'))
                .toBe('1');
            await attriParameterSelector.dismissSuggestionList();
            await attriParameterSelector.searchSearchbox('Anna Smith -Jane +Evans');
            since('suggested items should be #{expected}, while we get #{actual}')
                .expect(await attriParameterSelector.getSearchSuggestItemsText())
                .toEqual(['Anna Smith -Jane +Evans']);
            await attriParameterSelector.dismissSuggestionList();
            await attriParameterSelector.searchSearchbox('(Jan OR John) AND Evans');
            since('suggested items should be #{expected}, while we get #{actual}')
                .expect(await attriParameterSelector.getSearchSuggestItemsText())
                .toEqual(['Anna Smith -Jane +Evans']);
            await attriParameterSelector.dismissSuggestionList();
            await subcategoryParameterSelector.searchSearchbox('11 12');
            since('suggested items count should be #{expected}, while we get #{actual}')
                .expect(await subcategoryParameterSelector.getSearchSuggestItemsText())
                .toEqual(['(All search results)','11','12']);
            await subcategoryParameterSelector.dismissSuggestionList();

            // check the same search in filter panel
            await filterPanel.openFilterPanel();
            await searchBoxFilter.openSecondaryPanel('Atrri');
            await searchBoxFilter.search('Anna Smith -Jane +Evans');
            since('suggested items should be #{expected}, while we get #{actual}')
                .expect(await searchBoxFilter.getSearchResultsText(true))
                .toEqual(['Anna Smith -Jane +Evans']);
            await searchBoxFilter.selectElementsByNames(['Anna Smith -Jane +Evans']);
            await searchBoxFilter.toggleViewSelectedOptionOn();
            since ('Year filter selected options should be #{expected}, instead we have #{actual}')
                .expect(await searchBoxFilter.getSearchResultsText())
                .toEqual(['Anna Smith -Jane +Evans']);
            await searchBoxFilter.clearSearch();

            await searchBoxFilter.openSecondaryPanel('Customer');
            await searchBoxFilter.input('A && B');
            since('suggested items count should be #{expected}, while we get #{actual}')
                .expect(await searchBoxFilter.getSearchResultsText(true))
                .toEqual(['1210:Aba-Bulgu:Leslie','21:Alyea-Burkell:Xavier']);
            await searchBoxFilter.clearSearch();
            await searchBoxFilter.search('"Aaby"');
            since('suggested items count should be #{expected}, while we get #{actual}')
                .expect(await searchBoxFilter.getSearchResultsText(true))
                .toEqual(['7796:Aaby:Alen']);
            await searchBoxFilter.clearSearch();
            await searchBoxFilter.search('*');
            since('suggested items count should be #{expected}, while we get #{actual}')
                .expect(await searchBoxFilter.searchResults(true))
                .toBe('500 results found');
            await searchBoxFilter.clearSearch();
            await filterPanel.closeFilterPanel();

            // check ics and filter on authoring mode
            await libraryAuthoringPage.editDossierFromLibrary();
            await authoringFilters.switchToFilterPanel();
        
            // check filter with new element search
            await authoringFilters.setFilterToSelectorContainer('Atrri');
            let searchbox = authoringFilters.selectorObject.searchbox;
            await searchbox.input('(Jan OR John) AND Evans');
            since ('Search "(Jan OR John) AND Evans" for atrri searchbox filter, suggested items should be #{expected}, while we get #{actual}')
                .expect(await searchbox.getSuggestListItemsText())
                .toEqual(['Anna Smith -Jane +Evans']);
            await searchbox.dismissSuggestionList();
            await searchbox.input('a && c');
            since( 'Search "a && c" for category searchbox filter, suggested items should be #{expected}, while we get #{actual}')
                .expect(await searchbox.getSuggestListItemsText())
                .toEqual(['(All search results)','A C','A B C']);
            await searchbox.dismissSuggestionList();

            // check ics with new element search
            await customerParameterSelector.searchSearchbox('A AND B');
            since('suggested items list should be #{expected}, while we get #{actual}')
                .expect(await customerParameterSelector.getSearchSuggestItemsText())
                .toEqual(['(All search results)','1210:Aba-Bulgu:Leslie','21:Alyea-Burkell:Xavier']);
            await customerParameterSelector.dismissSuggestionList();
            await contentsPanel.dossierAuthoringPage.clickCloseDossierButton();
        }
        
    });

    it('[TC80663_05] new element search for RSD - consumption', async () => {
        // new element search is only supported in tanzu env
        if (browser.options.baseUrl.includes('hypernow')) {
            //reset dossier state
            await resetDossierState({
                credentials: credentials,
                dossier: rwdWithNewElementSearch,
            });

            await libraryPage.openDossier(rwdWithNewElementSearch.name);
            const subcategorySelector = rsdPage.findSelectorByKey('W9F95B985C7EF423DB323D56908642407');
            const atrriSelector = rsdPage.findSelectorByKey('W32A51E60043F4D8BAAF1C356F283C799');

            // check rsd selector with new element search
            await subcategorySelector.searchbox.input('a && b');
            await since('Search on client: The search results count should be #{expected}, while we get #{actual} ')
                .expect((await subcategorySelector.searchbox.getSuggestListItemsText()))
                .toEqual(['Unable to perform search with the operators provided']);
            await subcategorySelector.searchbox.dismissSuggestionList();
            await atrriSelector.searchbox.input('Anna Smith -Jane +Evans');
            await since('Search on client: The search results count should be #{expected}, while we get #{actual} ')
                .expect((await atrriSelector.searchbox.getSuggestListItemsText()))
                .toEqual(['Unable to perform search with the operators provided']);
            await atrriSelector.searchbox.dismissSuggestionList();
        }

        
    });
    
});
export const config = specConfiguration;
