import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('_search') };

describe('GlobalSearch_SortOnSearch', () => {
    const customAppID_all = {
        id: '97030C49E72B4D7296A5FB9C4ACD00A7',
        name: 'AUTO_GlobalSearch_ProjectOwnerTime',
    };
    const customAppID_time = {
        id: 'FA0A94B7F4544CDEB9B2D64ED6FF5678',
        name: 'AUTO_GlobalSearch_Time',
    };

    let { quickSearch, fullSearch, libraryPage, filterOnSearch, userAccount, loginPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
    });

    beforeEach(async () => {
        await libraryPage.reload();
    });

    afterAll(async () => {
        // await libraryPage.openDefaultApp();
    });

    it('[TC70199] Global Search - Sort - Sort by Relevance on My Library and All tab ', async () => {
        const keyword = 'global search NLP';
        const dossier = '(AUTO) Global Search_NLP';

        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickMyLibraryTab();
        console.log('Step 1: Click My Library ');

        // initial sort
        await since('Sort on search, inital selected sort option should be #{expected}, instead we have #{actual}')
            .expect(await fullSearch.getSearchSortSelectedText())
            .toEqual('Relevance');
        await fullSearch.openSearchSortBox();
        console.log('Step 2: Open sort box ');
        await takeScreenshotByElement(fullSearch.getSearchSortDropdown(), 'TC70199', 'SortOnSearch_initial');

        // Sort by relevance
        await fullSearch.clickNthOptionInSortDropdown(1);
        await since('Sort by relevance, selected sort option should be #{expected}, instead we have #{actual}')
            .expect(await fullSearch.getSearchSortSelectedText())
            .toEqual('Relevance');
        // -- check My library tab
        await fullSearch.clickMyLibraryTab();
        console.log('Step 3: Re-click my library tab ');
        await since(
            'Sort by relevance, dossier shared sort text on My library tab should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getDossierSharedBySortText(dossier))
            .toContain('Updated');
        await since(
            'Sort by relevanc, the first result item on My Library tab should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getFirstResultItemTitle())
            .toEqual(dossier);
        // -- check All tab
        await fullSearch.clickAllTab();
        console.log('Step 4: Click All tab ');
        await since(
            'Sort by relevance, dossier shared sort text on All tab should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getDossierSharedBySortText(dossier))
            .toContain('Updated');
        // -- check sort dropdown
        await fullSearch.openSearchSortBox();
        console.log('Step 5: Open sort box ');
        await takeScreenshotByElement(
            fullSearch.getSearchSortDropdown(),
            'TC70199',
            'SortOnSearch_sortByRelevance_All'
        );
        await fullSearch.backToLibrary();
    });

    it('[TC70200] Global Search - Sort - Sort by Content Name on My Library and All tab ', async () => {
        const keyword = 'globalSearch';

        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickMyLibraryTab();

        // Sort by dossier name
        await fullSearch.openSearchSortBox();
        await fullSearch.clickNthOptionInSortDropdown(2);
        await since('Sort by dossier name, selected sort option should be #{expected}, instead we have #{actual}')
            .expect(await fullSearch.getSearchSortSelectedText())
            .toEqual('Name');
        // -- check My library tab
        await fullSearch.clickMyLibraryTab();
        const firstMyLibraryItem = await fullSearch.getFirstResultItemTitle();
        await since(
            'Sort by dossier name, dossier shared sort text on My library tab should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getDossierSharedBySortText(firstMyLibraryItem))
            .toContain('Updated');
        // -- check All tab
        await fullSearch.clickAllTab();
        const firstAllItem = await fullSearch.getFirstResultItemTitle();
        await since(
            'Sort by dossier name, dossier shared sort text on All tab should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getDossierSharedBySortText(firstAllItem))
            .toContain('Updated');
        // -- check sort dropdown
        await fullSearch.openSearchSortBox();
        await takeScreenshotByElement(fullSearch.getSearchSortDropdown(), 'TC70200', 'SortOnSearch_sortByName_All');

        // Changed to Z-A
        await fullSearch.clickNthOptionInSortDropdown(5);
        // -- check All tab
        const firstAllItemZtoA = await fullSearch.getFirstResultItemTitle();
        await since(
            'Sort by dossier name on Z-A, dossier shared sort text on All tab should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getDossierSharedBySortText(firstAllItemZtoA))
            .toContain('Updated');
        await since(
            'Sort by dossier name on Z-A, the first result item on All tab should NOT be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getFirstResultItemTitle())
            .not.toEqual(firstAllItem);
        // -- check My library tab
        await fullSearch.clickMyLibraryTab();
        await since(
            'Sort by dossier name on Z-A, the first result item on My Library tab should NOT be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getFirstResultItemTitle())
            .not.toEqual(firstMyLibraryItem);
        // -- check sort dropdown
        await fullSearch.openSearchSortBox();
        await takeScreenshotByElement(
            fullSearch.getSearchSortDropdown(),
            'TC70200',
            'SortOnSearch_sortByName_myLibrary'
        );

        // Back to A-Z
        await fullSearch.clickNthOptionInSortDropdown(6);
        // -- check My library tab
        await since(
            'Sort by dossier name on Z-A, the first result item on My Library tab should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getFirstResultItemTitle())
            .toEqual(firstMyLibraryItem);
        // -- check All tab
        await fullSearch.clickAllTab();
        await since(
            'Sort by dossier name on Z-A, the first result item on All tab should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getFirstResultItemTitle())
            .toEqual(firstAllItem);
        await fullSearch.backToLibrary();
    });

    it('[TC70201] Global Search - Sort - Sort by Date Updated on My Library and All tab ', async () => {
        const keyword = 'globalSearch';
        const dossier = '(AUTO) GlobalSearch_Certified dossier';

        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickMyLibraryTab();

        // Sort by date updated
        await fullSearch.openSearchSortBox();
        await fullSearch.clickNthOptionInSortDropdown(4);
        await since('Sort by date updated, selected sort option should be #{expected}, instead we have #{actual}')
            .expect(await fullSearch.getSearchSortSelectedText())
            .toEqual('Date Updated');
        // -- check My library tab
        await fullSearch.clickMyLibraryTab();
        const firstMyLibraryItem = await fullSearch.getFirstResultItemTitle();
        await since(
            'Sort by date updated, dossier shared sort text on My library tab should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getDossierSharedBySortText(dossier))
            .toContain('Updated');
        // -- check All tab
        await fullSearch.clickAllTab();
        const firstAllItem = await fullSearch.getFirstResultItemTitle();
        await since(
            'Sort by date updated, dossier shared sort text on All tab should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getDossierSharedBySortText(dossier))
            .toContain('Updated');
        // -- check sort dropdown
        await fullSearch.openSearchSortBox();
        await takeScreenshotByElement(
            fullSearch.getSearchSortDropdown(),
            'TC70201',
            'SortOnSearch_sortByDateUpdated_All'
        );

        // Changed to Oldest on Top
        await fullSearch.clickNthOptionInSortDropdown(4);
        // -- check All tab
        await since(
            'Sort by date updated on Oldest on Top, dossier shared sort text on All tab should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getDossierSharedBySortText(dossier))
            .toContain('Updated');
        await since(
            'Sort by date updated on Oldest on Top, the first result item on All tab should NOT be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getFirstResultItemTitle())
            .not.toEqual(firstAllItem);
        // -- check My library tab
        await fullSearch.clickMyLibraryTab();
        await since(
            'Sort by date updated on Oldest on Top, the first result item on My Library tab should NOT be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getFirstResultItemTitle())
            .not.toEqual(firstMyLibraryItem);
        // -- check sort dropdown
        await fullSearch.openSearchSortBox();
        await takeScreenshotByElement(
            fullSearch.getSearchSortDropdown(),
            'TC70201',
            'SortOnSearch_sortByDateUpdated_myLibrary'
        );

        // Back to Newest on Top
        await fullSearch.clickNthOptionInSortDropdown(7);
        // -- check My library tab
        await since(
            'Sort by date updated on Newest on Top, the first result item on My Library tab should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getFirstResultItemTitle())
            .toEqual(firstMyLibraryItem);
        // -- check All tab
        await fullSearch.clickAllTab();
        await since(
            'Sort by date updated on Newest on Top, the first result item on All tab should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getFirstResultItemTitle())
            .toEqual(firstAllItem);
        await fullSearch.backToLibrary();
    });

    it('[TC70202] Global Search - Sort - Sort by Date Added on My Library tab ', async () => {
        const keyword = 'globalSearch';
        const dossier = '(AUTO) GlobalSearch_Certified dossier';

        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickMyLibraryTab();

        // Sort by date added
        await fullSearch.openSearchSortBox();
        await fullSearch.clickNthOptionInSortDropdown(3);
        await since('Sort by date added, selected sort option should be #{expected}, instead we have #{actual}')
            .expect(await fullSearch.getSearchSortSelectedText())
            .toEqual('Date Added');
        // -- check My library tab
        await fullSearch.clickMyLibraryTab();
        const firstMyLibraryItem = await fullSearch.getFirstResultItemTitle();
        await since(
            'Sort by date added, dossier shared sort text on My library tab should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getDossierSharedBySortText(dossier))
            .toContain('Added');
        // -- check All tab
        await fullSearch.clickAllTab();
        const firstAllItem = await fullSearch.getFirstResultItemTitle();
        await since(
            'Sort by date added, dossier shared sort text on All tab should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getDossierSharedBySortText(dossier))
            .toContain('Updated');
        // -- check sort dropdown
        await fullSearch.openSearchSortBox();
        await takeScreenshotByElement(
            await fullSearch.getSearchSortDropdown(),
            'TC70202',
            'SortOnSearch_sortByDateAdded_All'
        );
        // await fullSearch.closeSearchSortBox(); // to close sort panel
        await fullSearch.clickNthOptionInSortDropdown(1); //close by click drodpown due to CI issue

        // Changed to Oldest on Top
        await fullSearch.clickMyLibraryTab();
        await fullSearch.openSearchSortBox();
        await fullSearch.clickNthOptionInSortDropdown(6);
        // -- check My library tab
        await since(
            'Sort by date added on Oldest on Top, the first result item on My Library tab should NOT be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getFirstResultItemTitle())
            .not.toEqual(firstMyLibraryItem);
        // -- check All tab
        await fullSearch.clickAllTab();
        await since(
            'Sort by date added on Oldest on Top, dossier shared sort text on All tab should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getDossierSharedBySortText(dossier))
            .toContain('Updated');
        await since(
            'Sort by date added on Oldest on Top, the first result item on All tab should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getFirstResultItemTitle())
            .toEqual(firstAllItem);

        // Back to Newest on Top
        await fullSearch.clickMyLibraryTab();
        await fullSearch.openSearchSortBox();
        await fullSearch.clickNthOptionInSortDropdown(7);
        // -- check My library tab
        await since(
            'Sort by date added on Newest on Top, the first result item on My Library tab should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getFirstResultItemTitle())
            .toEqual(firstMyLibraryItem);
        await fullSearch.backToLibrary();
    });

    it('[TC70203] Global Search - Sort - Sort by Date Viewed on My Library tab ', async () => {
        const keyword = 'globalSearch';
        const dossier = '(AUTO) GlobalSearch_Certified dossier';

        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickMyLibraryTab();

        // Sort by date added
        await fullSearch.openSearchSortBox();
        await fullSearch.clickNthOptionInSortDropdown(5);
        await since('Sort by date viewed, selected sort option should be #{expected}, instead we have #{actual}')
            .expect(await fullSearch.getSearchSortSelectedText())
            .toEqual('Date Viewed');
        // -- check My library tab
        await fullSearch.clickMyLibraryTab();
        const firstMyLibraryItem = await fullSearch.getFirstResultItemTitle();
        await since(
            'Sort by date viewed, dossier shared sort text on My library tab should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getDossierSharedBySortText(dossier))
            .toContain('Viewed');
        // -- check All tab
        await fullSearch.clickAllTab();
        const firstAllItem = await fullSearch.getFirstResultItemTitle();
        await since(
            'Sort by date viewed, dossier shared sort text on All tab should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getDossierSharedBySortText(dossier))
            .toContain('Updated');
        // Changed to Oldest on Top
        await fullSearch.clickMyLibraryTab();
        await fullSearch.openSearchSortBox();
        await fullSearch.clickNthOptionInSortDropdown(6);
        // -- check My library tab
        await since(
            'Sort by date viewed on Oldest on Top, the first result item on My Library tab should NOT be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getFirstResultItemTitle())
            .not.toEqual(firstMyLibraryItem);
        // -- check All tab
        await fullSearch.clickAllTab();
        await since(
            'Sort by date viewed on Oldest on Top, dossier shared sort text on All tab should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getDossierSharedBySortText(dossier))
            .toContain('Updated');
        await since(
            'Sort by date viewed on Oldest on Top, the first result item on All tab should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getFirstResultItemTitle())
            .toEqual(firstAllItem);

        // Back to Newest on Top
        await fullSearch.clickMyLibraryTab();
        await fullSearch.openSearchSortBox();
        await fullSearch.clickNthOptionInSortDropdown(7);
        // -- check My library tab
        await since(
            'Sort by date viewed on Newest on Top, the first result item on My Library tab should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getFirstResultItemTitle())
            .toEqual(firstMyLibraryItem);
        await fullSearch.backToLibrary();
    });

    it('[TC91547] Global Search - Issue - Sort while switch All tab and My Library tab ', async () => {
        const keyword = 'globalSearch';

        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickAllTab();

        // Sort by Name on All tab
        await fullSearch.openSearchSortBox();
        await fullSearch.clickNthOptionInSortDropdown(2);
        await since('Sort by name on All tab, selected sort option should be #{expected}, instead we have #{actual}')
            .expect(await fullSearch.getSearchSortSelectedText())
            .toEqual('Name');
        // -- check All tab
        const firstAllItem = await fullSearch.getFirstResultItemTitle();
        await since(
            'Sort by name on All tab, dossier shared sort text on My library tab should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getDossierSharedBySortText(firstAllItem))
            .toContain('Updated');

        // switch to My Library tab
        await fullSearch.clickMyLibraryTab();
        const firstMyLibraryItem1 = await fullSearch.getFirstResultItemTitle();
        await since(
            'Switch to My Library tab, dossier shared sort text on All tab should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getDossierSharedBySortText(firstMyLibraryItem1))
            .toContain('Updated');
        // -- change sort option: Data Added
        await fullSearch.openSearchSortBox();
        await fullSearch.clickNthOptionInSortDropdown(3);
        const firstMyLibraryItem2 = await fullSearch.getFirstResultItemTitle();
        await since(
            'Sort by date added on My LIbrary, dossier shared sort text on All tab should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getDossierSharedBySortText(firstMyLibraryItem2))
            .toContain('Added');
        // -- change sort option: Data Viewed
        await fullSearch.openSearchSortBox();
        await fullSearch.clickNthOptionInSortDropdown(5);
        const firstMyLibraryItem3 = await fullSearch.getFirstResultItemTitle();
        await since(
            'Sort by date viewed on My LIbrary, dossier shared sort text on All tab should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getDossierSharedBySortText(firstMyLibraryItem3))
            .toContain('Viewed');

        await fullSearch.backToLibrary();
    });

    it('[TC90644] Global Search - Custom App - Granual Control Timestamps for Filter and Sort', async () => {
        await libraryPage.openCustomAppById({ id: customAppID_time.id });
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch('search');

        // my library tab
        await fullSearch.clickMyLibraryTab();
        /// -- check dossier info
        await since(
            'Granual Control on Search, the timestamp on dosssier info present should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.isDossierTimePresent())
            .toEqual(false);
        /// -- check sort
        await fullSearch.openSearchSortBox();
        await since('Granual Control on Search, the sort option should be #{expected}, instead we have #{actual}')
            .expect(await fullSearch.getSortOptionCount())
            .toEqual(2);
        await since(
            'Granual Control on Search, the timestamp on filter present should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.isSortOptionPresent('Date Updated'))
            .toEqual(false);
        // await fullSearch.closeSearchSortBox(); // to close sort panel
        await fullSearch.clickNthOptionInSortDropdown(1); //close by click drodpown due to CI issue
        /// -- check filter
        await filterOnSearch.openSearchFilterPanel();
        await since('Granual Control on Filter, the filter option should be #{expected}, instead we have #{actual}')
            .expect(await filterOnSearch.getSearchFilterItemsCount())
            .toEqual(4);
        await since(
            'Granual Control on Filter, the Project filter option present should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterOnSearch.isFilterPresent('Last Updated'))
            .toEqual(false);
        await filterOnSearch.closeFilterPanel();

        // all tab
        await fullSearch.clickAllTab();
        /// -- check dossier info
        await since(
            'Granual Control on Search All, the owner on dosssier info present should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.isDossierOwnerPresent())
            .toEqual(false);
        /// -- check sort
        await fullSearch.openSearchSortBox();
        await since('Granual Control on Search All, the sort option should be #{expected}, instead we have #{actual}')
            .expect(await fullSearch.getSortOptionCount())
            .toEqual(2);
        await since(
            'Granual Control on Search All, the timestamp on Filter present should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.isSortOptionPresent('Date Updated'))
            .toEqual(false);
        // await fullSearch.closeSearchSortBox(); // to close sort panel
        await fullSearch.clickNthOptionInSortDropdown(1); //close by click drodpown due to CI issue
        /// -- check filter
        await filterOnSearch.openSearchFilterPanel();
        await since('Granual Control on Filter All, the filter option should be #{expected}, instead we have #{actual}')
            .expect(await filterOnSearch.getSearchFilterItemsCount())
            .toEqual(4);
        await since(
            'Granual Control on Filter All, the Project filter option present should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterOnSearch.isFilterPresent('Last Updated'))
            .toEqual(false);
        await filterOnSearch.closeFilterPanel();

        await fullSearch.backToLibrary();
    });

    it('[TC90645] Global Search - Custom App - Granual Control Project, Owner, Timestamps on Filter and Sort', async () => {
        await libraryPage.openCustomAppById({ id: customAppID_all.id });
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch('search');

        // sort
        await fullSearch.clickMyLibraryTab();
        await fullSearch.openSearchSortBox();
        await since('Granual Control on Sort, the sort option should be #{expected}, instead we have #{actual}')
            .expect(await fullSearch.getSortOptionCount())
            .toEqual(2);
        await since(
            'Granual Control on Filter, the timestamp option present should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.isSortOptionPresent('Date Updated'))
            .toEqual(false);
        await fullSearch.clickSortOption('Name');
        const firstDossier = await fullSearch.getFirstResultItemTitle();
        await fullSearch.openSearchSortBox();
        await fullSearch.clickSortOption('Z-A');
        await since(
            'Sort by Z-A, the first result item should not be the origional one, it is #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getFirstResultItemTitle())
            .not.toEqual(firstDossier);

        // filter
        await fullSearch.clickAllTab();
        await filterOnSearch.openSearchFilterPanel();
        await since('Granual Control on Filter, the filter option should be #{expected}, instead we have #{actual}')
            .expect(await filterOnSearch.getSearchFilterItemsCount())
            .toEqual(2);
        await since(
            'Granual Control on Filter, the Project filter option present should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterOnSearch.isFilterPresent('Project'))
            .toEqual(false);
        // filter
        const searchTotal = await fullSearch.getAllTabCount();
        await filterOnSearch.openFilterDetailPanel('Type');
        await filterOnSearch.selectOptionInCheckbox('Document');
        await filterOnSearch.applyFilterChanged();
        await since('Filter Document, Document counts should be less than #{expected}, while we get #{actual}')
            .expect(await fullSearch.getAllTabCount())
            .toBeLessThan(searchTotal);

        await fullSearch.backToLibrary();
    });

    it('[TC90646] Global Search - Custom App - Switch custom app from search results page', async () => {
        await libraryPage.openCustomAppById({ id: customAppID_all.id });
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch('search');

        // switch custom app
        await userAccount.switchCustomApp(customAppID_time.name);
        await since('Swith custom app, back button should not be present, it is #{expected}, while we get #{actual}')
            .expect(await fullSearch.isBackButtonPresent())
            .toBe(false);
        // search
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch('search');
        await fullSearch.clickMyLibraryTab();
        await fullSearch.openSearchSortBox();
        await since('Switch custom app, the sort option should be #{expected}, instead we have #{actual}')
            .expect(await fullSearch.getSortOptionCount())
            .toEqual(2);
        // await fullSearch.closeSearchSortBox();
        await fullSearch.clickNthOptionInSortDropdown(1); //close by click drodpown due to CI issue
        await filterOnSearch.openSearchFilterPanel();
        await since('Switch custom app, the filter option should be #{expected}, instead we have #{actual}')
            .expect(await filterOnSearch.getSearchFilterItemsCount())
            .toEqual(4);
        await filterOnSearch.closeFilterPanel();

        await fullSearch.backToLibrary();
    });
});
export const config = specConfiguration;
