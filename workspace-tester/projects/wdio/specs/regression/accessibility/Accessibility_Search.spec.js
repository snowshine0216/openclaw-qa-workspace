import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { getAttributeValue, getAccAtributesOfElement } from '../../../utils/getAttributeValue.js';

const specConfiguration = { ...customCredentials('_acc') };

describe('Accessibility test of search', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const dossier = {
        id: '957A9C7B462A52FA24A07B8BA02F788F',
        name: 'Dossier sanity_General',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    let { loginPage, libraryPage, dossierPage, infoWindow, promptEditor, quickSearch, fullSearch } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(dossier.name);
        await fullSearch.waitForSearchLoading();
        await fullSearch.clickMyLibraryTab();
        await fullSearch.openDossierFromSearchResults(dossier.name);
        await promptEditor.run();
        await dossierPage.goToLibrary();
    });

    afterEach(async () => {
        await libraryPage.reload();
    });

    it('[TC83899_01] Validate accessibility of global search working as expected with JAWS and VoiceOver - quick search', async () => {
        await quickSearch.openSearchSlider();
        await libraryPage.moveToElement(libraryPage.getLibraryIcon());
        await quickSearch.waitForElementVisible(quickSearch.getQuickSearchView());
        const tabindex = ``;
        await since('tabindex for search suggestion is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAccAtributesOfElement(await quickSearch.getQuickSearchView(), ['tabIndex']))
            .toBe(tabindex);
        await since('Role for recentlySearched is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAttributeValue(await quickSearch.getRecentlySearchedKeywordsItems()[0], 'role'))
            .toBe('option');
        await since('Role for recentlyViewed is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAttributeValue(await quickSearch.getRecentlyViewedShortcutsItems()[0], 'role'))
            .toBe('option');
        await quickSearch.inputText(dossier.name);
        await quickSearch.waitForElementVisible(quickSearch.getQuickSearchView());

        await since('Role for searchSuggestion is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAttributeValue(await quickSearch.getSearchSuggestionTextItems()[0], 'role'))
            .toBe('option');
        await quickSearch.navigateDownWithArrow(3);
        await takeScreenshotByElement(quickSearch.getQuickSearchView(), 'TC83899', 'search suggestion');
        await quickSearch.navigateDownWithArrow(1);
        await quickSearch.enter();

        await quickSearch.waitForSearchResultsContainer();
        await fullSearch.tab();
        await fullSearch.shiftTab();
        await quickSearch.waitForElementVisible(quickSearch.getQuickSearchView());
        await since('Role for recentlyViewed in full screen is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAttributeValue(await quickSearch.getSearchSuggestionTextItems()[0], 'role'))
            .toBe('option');
        await since('Role for searchSuggestion in full screen is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAttributeValue(await quickSearch.getSearchSuggestionShortcutsItems()[0], 'role'))
            .toBe('option');
        await fullSearch.esc();
        await fullSearch.shiftTab();
        await fullSearch.tab();
        await quickSearch.waitForElementVisible(quickSearch.getQuickSearchView());
        await since('Role for recentlySearched in full screen is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAttributeValue(await quickSearch.getRecentlySearchedKeywordsItems()[0], 'role'))
            .toBe('option');
    });

    it('[TC83899_02] Validate accessibility of global search working as expected with JAWS and VoiceOver - My Library', async () => {
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch('Category');
        const navBar = `button,Go to your Library,0
combobox,Search box,0
button,Filter,0
button,Account,0`;
        await since('Role, arialabel, tabindex for NavBar is supposed to be #{expected}, instead we have #{actual}')
            .expect(
                await getAccAtributesOfElement(await libraryPage.getNavigationBar(), ['role', 'ariaLabel', 'tabIndex'])
            )
            .toBe(navBar);
        const resultHeader = `menuitemradio,null,0
menuitemradio,null,0
combobox,Sort By:,0`;
        await since(
            'Role, arialabel, tabindex for result header is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(
                await getAccAtributesOfElement(await fullSearch.getSearchResultsListContainerHead(), [
                    'role',
                    'ariaLabel',
                    'tabIndex',
                ])
            )
            .toBe(resultHeader);
        await fullSearch.tab();
        await fullSearch.tab();
        await fullSearch.tab();
        await fullSearch.tab();
        await fullSearch.tab();
        await fullSearch.enter();
        const sortByRelevance = `menuitemradio,null,0
menuitemradio,null,0
menuitemradio,null,0
menuitemradio,null,0
menuitemradio,null,0`;
        await since(
            'Role, arialabel, tabindex for sortByRelevance is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(
                await getAccAtributesOfElement(await fullSearch.getSearchSortDropdown(), [
                    'role',
                    'ariaLabel',
                    'tabIndex',
                ])
            )
            .toBe(sortByRelevance);
        await fullSearch.navigateDownWithArrow(2);
        await fullSearch.enter();
        await fullSearch.tab();
        await fullSearch.shiftTab();
        await fullSearch.enter();
        const sortByDateAdded = `menuitemradio,null,0
menuitemradio,null,0
menuitemradio,null,0
menuitemradio,null,0
menuitemradio,null,0
menuitemradio,null,0
menuitemradio,null,0`;
        await since(
            'Role, arialabel, tabindex for sortByDateAdded is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(
                await getAccAtributesOfElement(await fullSearch.getSearchSortDropdown(), [
                    'role',
                    'ariaLabel',
                    'tabIndex',
                ])
            )
            .toBe(sortByDateAdded);
        await fullSearch.esc();
        await fullSearch.tab();
        await fullSearch.tab();
        await fullSearch.tab();
        await fullSearch.enter();
        await fullSearch.setUpdateTime(dossier.name, 'Added 5d ago');
        const searchResultListItem = `null,Dossier sanity_General,0
button,Open recommendations Dossier sanity_General,0
button,Matched content (1),0
button,Category attribute,0`;
        await since(
            'Role, arialabel, tabindex for searchResultItem is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(
                await getAccAtributesOfElement(await fullSearch.getResultItemByName(dossier.name), [
                    'role',
                    'ariaLabel',
                    'tabIndex',
                ])
            )
            .toBe(searchResultListItem);
        await fullSearch.shiftTab();
        await fullSearch.enter();
        await fullSearch.waitForDynamicElementLoading();
        await fullSearch.waitForElementVisible(await infoWindow.getMainInfo());
        await fullSearch.tab();
        await fullSearch.tab();
        await infoWindow.waitForNoSubscriptionButton();
        const searchResultListItemInfoWindow = `null,Dossier sanity_General,0
button,Add to Favorites,0
button,Share Dashboard,0
button,Reset,0
button,Remove from Library,0`;
        await since(
            'Role, arialabel, tabindex for searchResultItem with info window is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await getAccAtributesOfElement(await infoWindow.getMainInfo(), ['role', 'ariaLabel', 'tabIndex']))
            .toBe(searchResultListItemInfoWindow);
    });

    it('[TC83899_03] Validate accessibility of global search working as expected with JAWS and VoiceOver - All', async () => {
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch('accessibilitygeneral');
        await fullSearch.tab();
        await fullSearch.tab();
        await fullSearch.tab();
        await fullSearch.enter();
        await fullSearch.waitForDynamicElementLoading();
        await fullSearch.setUpdateTime('AccessibilityGeneral', 'Updated 1 day ago');
        const searchResultListItemForAll = `null,AccessibilityGeneral,0
button,Open recommendations AccessibilityGeneral,0`;
        await since(
            'Role, arialabel, tabindex for searchResultItemForAll is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(
                await getAccAtributesOfElement(await fullSearch.getResultItemByName('AccessibilityGeneral'), [
                    'role',
                    'ariaLabel',
                    'tabIndex',
                ])
            )
            .toBe(searchResultListItemForAll);
        await fullSearch.tab();
        await fullSearch.enter();
        await fullSearch.waitForDynamicElementLoading();
        await fullSearch.waitForElementVisible(fullSearch.getSearchSortDropdown());
        // Content Name
        await fullSearch.navigateDownWithArrow(1);
        await fullSearch.enter();
        await fullSearch.enter();
        const sortByContentName = `menuitemradio,null,0
menuitemradio,null,0
menuitemradio,null,0
menuitemradio,A through Z,0
menuitemradio,Z through A,0`;
        await since(
            'Role, arialabel, tabindex for sortByContentName is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(
                await getAccAtributesOfElement(await fullSearch.getSearchSortDropdown(), [
                    'role',
                    'ariaLabel',
                    'tabIndex',
                ])
            )
            .toBe(sortByContentName);
        await fullSearch.esc();
        await fullSearch.tab();
        await fullSearch.tab();
        await fullSearch.enter();
        await fullSearch.waitForDynamicElementLoading();
        await fullSearch.waitForElementVisible(await infoWindow.getMainInfo());
        await infoWindow.waitForNoSubscriptionButton();
        const searchResultListItemInfoWindowForAll = `null,AccessibilityGeneral,0
button,Share Dashboard,0`;
        await since(
            'Role, arialabel, tabindex for searchResultItem with info window is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await getAccAtributesOfElement(await infoWindow.getMainInfo(), ['role', 'ariaLabel', 'tabIndex']))
            .toBe(searchResultListItemInfoWindowForAll);
    });

    it('[TC83899_04] Validate accessibility of global search working as expected with JAWS and VoiceOver - full search no result', async () => {
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch('noResult');
        const noResult = `null,null,0`;
        await since(
            'Role, arialabel, tabindex for searchResultContainer is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(
                await getAccAtributesOfElement(await fullSearch.getNoSearchResultContainer(), [
                    'role',
                    'ariaLabel',
                    'tabIndex',
                ])
            )
            .toBe(noResult);
        await fullSearch.tab();
        await fullSearch.tab();
        await fullSearch.tab();
        await fullSearch.tab();
        await takeScreenshotByElement(fullSearch.getNoSearchResultContainer(), 'TC83899', 'no result page');
        await fullSearch.enter();
    });
});

export const config = specConfiguration;
