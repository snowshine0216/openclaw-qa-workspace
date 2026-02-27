import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';
import shareDossierToUsers from '../../../api/shareDossierToUsers.js';

const specConfiguration = { ...customCredentials('_urlapi') };

describe('Url API pass Filter', () => {
    const dossier = {
        id: '67E4981940D744140F009CACA43426D3',
        name: 'URL API Dossier-without prompt',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossier2 = {
        id: '1F9FA9FD420247B7BB494FAFED5AA477',
        name: "URL API Dossier-with prompt don't need answer",
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossier3 = {
        id: 'C17174134766EDEBEDFF16ABEB77FA0F',
        name: 'URL API Dossier-with prompt need answer',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossier4 = {
        id: 'C68D29F949F3D69C29137F84073130A6',
        name: 'crosstab dossier',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const { credentials } = specConfiguration;
    const userID = 'D1E7254E4CE80E9936E6AA9C5622C40A';

    let {
        loginPage,
        dossierPage,
        libraryPage,
        filterSummary,
        filterSummaryBar,
        filterPanel,
        checkboxFilter,
        infoWindow,
        promptEditor,
        grid,
        reset,
        toc,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
        await setWindowSize({
            width: 1000,
            height: 800,
        });
        await shareDossierToUsers({
            dossier: dossier,
            credentials: specConfiguration.credentials,
            targetUserIds: [userID],
            targetCredentialsList: [specConfiguration.credentials],
        });
        await shareDossierToUsers({
            dossier: dossier2,
            credentials: specConfiguration.credentials,
            targetUserIds: [userID],
            targetCredentialsList: [specConfiguration.credentials],
        });
        await shareDossierToUsers({
            dossier: dossier3,
            credentials: specConfiguration.credentials,
            targetUserIds: [userID],
            targetCredentialsList: [specConfiguration.credentials],
        });
    });

    afterEach(async () => {
        await browser.url(browser.options.baseUrl);
        await dossierPage.waitForDossierLoading();
    });

    it('[TC70060_01] Validate URL API pass filter in Dossier without prompt', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        const url = await browser.getUrl();
        const customUrl =
            url +
            '/9D8A49D54E04E0BE62C877ACC18A5A0A/67E4981940D744140F009CACA43426D3?dossier.filters=%5B%7B%22name%22%3A%22Region%22%2C%22selections%22%3A%5B%7B%22name%22%3A%22South%22%7D%5D%7D%5D';
        await libraryPage.openDossier(dossier.name);
        await since('Reset disabled is supposed to be #{expected} for dossier1, instead we have #{actual}')
            .expect(await reset.isResetDisabled())
            .toBe(true);
        await since('The page should be #{expected} for dossier1, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['URL API Dossier-without prompt', 'Chapter 1', 'Page 1']);
        //Apply filter[Region=South] of Chapter1 Page1 without pagekey in Chapter1 Page1
        await browser.url(customUrl);
        await dossierPage.waitForDossierLoading();
        //Validate page and filter
        await since('The page should be #{expected} after apply customUrl, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['URL API Dossier-without prompt', 'Chapter 1', 'Page 1']);
        await filterSummary.viewAllFilterItems();
        await since(
            'The displayed value for Region on filter summary should be #{expected} after apply customUrl, instead we have #{actual}'
        )
            .expect(await filterSummary.expandedFilterItems('Region'))
            .toBe('South');
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Region');
        await since('The South is selected should be #{expected} after apply customUrl, instead we have #{actual}')
            .expect(await checkboxFilter.isElementSelected('South'))
            .toBe(true);
        await filterPanel.closeFilterPanel();
        await since(
            'The first element of Region attribute should be #{expected} after apply customUrl, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Region' }))
            .toBe('South');
        //Apply filter[Region=South] of Chapter1 Page1 without pagekey in Chapter1 Page2
        await toc.openMenu();
        await toc.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        await browser.url(customUrl);
        await dossierPage.waitForDossierLoading();
        //Validate page and filter
        await since('The page should be #{expected} after switch page and apply customUrl, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['URL API Dossier-without prompt', 'Chapter 1', 'Page 2']);
        await filterSummary.viewAllFilterItems();
        await since(
            'The displayed value for Region on filter summary should be #{expected} after switch page and apply customUrl, instead we have #{actual}'
        )
            .expect(await filterSummary.expandedFilterItems('Region'))
            .toBe('South');
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Region');
        await since(
            'The South is selected should be #{expected} after switch page and apply customUrl, instead we have #{actual}'
        )
            .expect(await checkboxFilter.isElementSelected('South'))
            .toBe(true);
        await filterPanel.closeFilterPanel();
        await since(
            'The first element of Region attribute should be #{expected} after switch page and apply customUrl, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Region' }))
            .toBe('South');
        //Apply filter[Region=South] of Chapter1 Page1 without pagekey in Chapter2 Page1
        await toc.openMenu();
        await toc.goToPage({ chapterName: 'Chapter 2', pageName: 'Page 1' });
        await browser.url(customUrl);
        await dossierPage.waitForDossierLoading();
        await since(
            'Does the error dialog popup when apply url without pagekey in different chapter should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.isErrorPresent())
            .toBe(true);
        await dossierPage.dismissError();
        //Apply filter[Region=South] of Chapter1 Page1 with pagekey in Chapter2 Page1
        const customUrl2 =
            url +
            '/9D8A49D54E04E0BE62C877ACC18A5A0A/67E4981940D744140F009CACA43426D3/K53--K46?dossier.filters=%5B%7B%22name%22%3A%22Region%22%2C%22selections%22%3A%5B%7B%22name%22%3A%22South%22%7D%5D%7D%5D';
        await browser.url(customUrl2);
        await dossierPage.waitForDossierLoading();
        //Validate page and filter
        await since(
            'The page should be #{expected} after switch page and apply customUrl2 with pagekey, instead we have #{actual}'
        )
            .expect(await dossierPage.pageTitle())
            .toEqual(['URL API Dossier-without prompt', 'Chapter 1', 'Page 1']);
        await filterSummary.viewAllFilterItems();
        await since(
            'The displayed value for Region on filter summary should be #{expected} after switch page and apply customUrl2 with pagekey, instead we have #{actual}'
        )
            .expect(await filterSummary.expandedFilterItems('Region'))
            .toBe('South');
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Region');
        await since(
            'The South is selected should be #{expected} after switch page and apply customUrl2 with pagekey, instead we have #{actual}'
        )
            .expect(await checkboxFilter.isElementSelected('South'))
            .toBe(true);
        await filterPanel.closeFilterPanel();
        await since(
            'The first element of Region attribute should be #{expected} after switch page and apply customUrl2 with pagekey, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Region' }))
            .toBe('South');
        //Apply filter[Subcategory=Literature and Action, Discount Between 100 and 900] of Chapter2 Page2 with pagekey in Chapter1 Page1
        const customUrl3 =
            url +
            '/9D8A49D54E04E0BE62C877ACC18A5A0A/67E4981940D744140F009CACA43426D3/K7A9C2C9649DE211817BE6FA62781FAAF--K681047E64DB171DF2FBC89917DCADF3F?dossier.filters=%5B%7B%22name%22%3A%22Subcategory%22%2C%22selections%22%3A%5B%7B%22name%22%3A%22Literature%22%7D%2C%7B%22name%22%3A%22Action%22%7D%5D%7D%2C%7B%22name%22%3A%22Discount%22%2C%22qualifier%22%3A%22Between%22%2C%22constants%22%3A%5B%22100%22%2C%22900%22%5D%7D%5D';
        await browser.url(customUrl3);
        await dossierPage.waitForDossierLoading();
        //Validate page and filter
        await since('The page should be #{expected} after apply customUrl3 with pagekey, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['URL API Dossier-without prompt', 'Chapter 2', 'Page 2']);
        await filterSummary.viewAllFilterItems();
        await since(
            'The displayed value for Discount on filter summary should be #{expected} after apply customUrl3 with pagekey, instead we have #{actual}'
        )
            .expect(await filterSummary.expandedFilterItems('Discount'))
            .toBe('$ 100 - $ 900');
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Subcategory');
        await since(
            'The Literature is selected should be #{expected} after apply customUrl3 with pagekey, instead we have #{actual}'
        )
            .expect(await checkboxFilter.isElementSelected('Literature'))
            .toBe(true);
        await since(
            'The Action is selected should be #{expected} after apply customUrl3 with pagekey, instead we have #{actual}'
        )
            .expect(await checkboxFilter.isElementSelected('Action'))
            .toBe(true);
        await filterPanel.closeFilterPanel();
        await since(
            'The first element of Cost metric should be #{expected} after apply customUrl3 with pagekey, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$4,526');
        //Remove dossier from library
        await dossierPage.goToLibrary();
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        await infoWindow.selectRemove();
        await infoWindow.confirmRemove();
        //Apply filter[Year!=2015] of Chapter3 with pagekey
        const customUrl4 =
            url +
            '/9D8A49D54E04E0BE62C877ACC18A5A0A/67E4981940D744140F009CACA43426D3/K3B2425FD403EB4DFBFE3D28580DF0082--KF6C1DFED483D6C3250CB5BAF17280FAD?dossier.filters=%5B%7B%22name%22%3A%22Year%22%2C%22qualifier%22%3A%22NotIn%22%2C%22selections%22%3A%5B%7B%22name%22%3A%222015%22%7D%5D%7D%5D';
        await browser.url(customUrl4);
        await dossierPage.waitForDossierLoading();
        //Add to library
        await dossierPage.clickAddToLibraryButton();
        //Validate page and filter
        await since('The page should be #{expected} after remove and apply customUrl4, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['URL API Dossier-without prompt', 'Chapter 3', 'Page 1']);
        await filterSummary.viewAllFilterItems();
        await since(
            'The displayed value for Year on filter summary should be #{expected} after remove and apply customUrl4, instead we have #{actual}'
        )
            .expect(await filterSummary.expandedFilterItems('Year'))
            .toBe('2015');
        await since(
            'The Filter Excluded of Year should be #{expected} after remove and apply customUrl4, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.isFilterExcludedinExpandedView('Year'))
            .toBe(true);
        await filterPanel.openFilterPanel();
        await since(
            'CapsuleExcluded value for 2015 Year attribute is supposed to be #{expected} after remove and apply customUrl4, instead we have #{actual}'
        )
            .expect(await checkboxFilter.isCapsuleExcluded({ filterName: 'Year', capsuleName: '2015' }))
            .toBe(true);
        await filterPanel.closeFilterPanel();
        await grid.selectGridContextMenuOption({
            title: 'Visualization 1',
            headerName: 'Year',
            elementName: '2014',
            firstOption: 'Exclude',
        });
        await since(
            'The first element of Year attribute should be #{expected} after remove and apply customUrl4, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Year' }))
            .toBe('2016');
    });

    it("[TC70060_02] Validate URL API pass filter in Dossier with prompt don't need answer", async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier2,
        });
        const url = await browser.getUrl();
        const customUrl =
            url +
            '/9D8A49D54E04E0BE62C877ACC18A5A0A/1F9FA9FD420247B7BB494FAFED5AA477/K53--K46?dossier.filters=%5B%7B%22name%22%3A%22Region%22%2C%22selections%22%3A%5B%7B%22name%22%3A%22South%22%7D%5D%7D%5D';
        //Apply filter[Region=South] of Chapter1 Page1 with pagekey in Chapter3
        await browser.url(customUrl);
        await dossierPage.waitForDossierLoading();
        //Validate page and filter
        await since('The page should be #{expected} after apply customUrl with pagekey, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(["URL API Dossier-with prompt don't need answer", 'Chapter 1', 'Page 1']);
        await filterSummary.viewAllFilterItems();
        await since(
            'The displayed value for Region on filter summary should be #{expected} after apply customUrl with pagekey, instead we have #{actual}'
        )
            .expect(await filterSummary.expandedFilterItems('Region'))
            .toBe('South');
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Region');
        await since(
            'The South is selected should be #{expected} after apply customUrl with pagekey, instead we have #{actual}'
        )
            .expect(await checkboxFilter.isElementSelected('South'))
            .toBe(true);
        await filterPanel.closeFilterPanel();
        await since(
            'The first element of Region attribute should be #{expected} after apply customUrl with pagekey, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Region' }))
            .toBe('South');
        //Apply filter[Subcategory=Literature and Action, Discount Between 100 and 900] of Chapter2 Page2 with pagekey in Chapter1 Page1
        const customUrl2 =
            url +
            '/9D8A49D54E04E0BE62C877ACC18A5A0A/1F9FA9FD420247B7BB494FAFED5AA477/K7A9C2C9649DE211817BE6FA62781FAAF--K681047E64DB171DF2FBC89917DCADF3F?dossier.filters=%5B%7B%22name%22%3A%22Subcategory%22%2C%22selections%22%3A%5B%7B%22name%22%3A%22Literature%22%7D%2C%7B%22name%22%3A%22Action%22%7D%5D%7D%2C%7B%22name%22%3A%22Discount%22%2C%22qualifier%22%3A%22Between%22%2C%22constants%22%3A%5B%22100%22%2C%22900%22%5D%7D%5D';
        await browser.url(customUrl2);
        await dossierPage.waitForDossierLoading();
        //Validate page and filter
        await since('The page should be #{expected} after apply customUrl2 with pagekey, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(["URL API Dossier-with prompt don't need answer", 'Chapter 2', 'Page 2']);
        await filterSummary.viewAllFilterItems();
        await since(
            'The displayed value for Discount on filter summary should be #{expected} after apply customUrl2 with pagekey, instead we have #{actual}'
        )
            .expect(await filterSummary.expandedFilterItems('Discount'))
            .toBe('$ 100 - $ 900');
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Subcategory');
        await since(
            'The Literature is selected should be #{expected} after apply customUrl2 with pagekey, instead we have #{actual}'
        )
            .expect(await checkboxFilter.isElementSelected('Literature'))
            .toBe(true);
        await since(
            'The Action is selected should be #{expected} after apply customUrl2 with pagekey, instead we have #{actual}'
        )
            .expect(await checkboxFilter.isElementSelected('Action'))
            .toBe(true);
        await filterPanel.closeFilterPanel();
        await since(
            'The first element of Cost metric should be #{expected} after apply customUrl2 with pagekey, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$4,526');
        //Remove dossier from library
        await dossierPage.goToLibrary();
        await libraryPage.moveDossierIntoViewPort(dossier2.name);
        await libraryPage.openDossierInfoWindow(dossier2.name);
        await infoWindow.selectRemove();
        await infoWindow.confirmRemove();
        //Apply filter[Year!=2015] of Chapter3 with pagekey
        const customUrl3 =
            url +
            '/9D8A49D54E04E0BE62C877ACC18A5A0A/1F9FA9FD420247B7BB494FAFED5AA477/K3B2425FD403EB4DFBFE3D28580DF0082--KF6C1DFED483D6C3250CB5BAF17280FAD?dossier.filters=%5B%7B%22name%22%3A%22Year%22%2C%22qualifier%22%3A%22NotIn%22%2C%22selections%22%3A%5B%7B%22name%22%3A%222015%22%7D%5D%7D%5D';
        await browser.url(customUrl3);
        await dossierPage.waitForDossierLoading();
        await since(
            'Does the error dialog popup when apply url in dossier2 not in library should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.isErrorPresent())
            .toBe(false);
        await promptEditor.run();
        //Add to library
        await dossierPage.clickAddToLibraryButton();
        await browser.url(customUrl3);
        await dossierPage.waitForDossierLoading();
        //Validate page and filter
        await since(
            'The page should be #{expected} after remove and apply customUrl3 with pagekey, instead we have #{actual}'
        )
            .expect(await dossierPage.pageTitle())
            .toEqual(["URL API Dossier-with prompt don't need answer", 'Chapter 3', 'Page 1']);
        await filterSummary.viewAllFilterItems();
        await since(
            'The displayed value for Year on filter summary should be #{expected} after remove and apply customUrl3 with pagekey, instead we have #{actual}'
        )
            .expect(await filterSummary.expandedFilterItems('Year'))
            .toBe('2015');
        await since(
            'The Filter Excluded of Year should be #{expected} after remove and apply customUrl3 with pagekey, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.isFilterExcludedinExpandedView('Year'))
            .toBe(true);
        await filterPanel.openFilterPanel();
        await since(
            'CapsuleExcluded value for 2015 Year attribute is supposed to be #{expected} after remove and apply customUrl3 with pagekey, instead we have #{actual}'
        )
            .expect(await checkboxFilter.isCapsuleExcluded({ filterName: 'Year', capsuleName: '2015' }))
            .toBe(true);
        await filterPanel.closeFilterPanel();
        await grid.selectGridContextMenuOption({
            title: 'Visualization 1',
            headerName: 'Year',
            elementName: '2014',
            firstOption: 'Exclude',
        });
        await since(
            'The first element of Year attribute should be #{expected} after remove and apply customUrl3 with pagekey, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Year' }))
            .toBe('2016');
    });

    it('[TC70060_03] Validate URL API pass filter in Dossier with prompt need answer', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier3,
        });
        const url = await browser.getUrl();
        const customUrl =
            url +
            '/9D8A49D54E04E0BE62C877ACC18A5A0A/C17174134766EDEBEDFF16ABEB77FA0F/K53--K46?dossier.filters=%5B%7B%22name%22%3A%22Region%22%2C%22selections%22%3A%5B%7B%22name%22%3A%22South%22%7D%5D%7D%5D';
        const customUrl2 = url + '/9D8A49D54E04E0BE62C877ACC18A5A0A/C17174134766EDEBEDFF16ABEB77FA0F';
        //Apply filter[Region=South] of Chapter1 Page1 with pagekey in Chapter3
        await browser.url(customUrl);
        await dossierPage.waitForDossierLoading();
        await since(
            'Does the error dialog popup when apply url in dossier3 with prompt not answered should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.isErrorPresent())
            .toBe(false);
        await promptEditor.run();
        //await dossierPage.waitForDossierLoading();
        await browser.url(customUrl);
        await dossierPage.waitForDossierLoading();
        //Validate page and filter
        await since('The page should be #{expected} after answer prompt and apply customUrl, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['URL API Dossier-with prompt need answer', 'Chapter 1', 'Page 1']);
        await filterSummary.viewAllFilterItems();
        await since(
            'The displayed value for Region on filter summary should be #{expected} after answer prompt and apply customUrl, instead we have #{actual}'
        )
            .expect(await filterSummary.expandedFilterItems('Region'))
            .toBe('South');
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Region');
        await since(
            'The South is selected should be #{expected} after answer prompt and apply customUrl, instead we have #{actual}'
        )
            .expect(await checkboxFilter.isElementSelected('South'))
            .toBe(true);
        await filterPanel.closeFilterPanel();
        await since(
            'The first element of Region attribute should be #{expected} after answer prompt and apply customUrl, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Region' }))
            .toBe('South');
        //Apply filter[Subcategory=Literature and Action, Discount Between 100 and 900] of Chapter2 Page2 with pagekey in Chapter1 Page1
        const customUrl3 =
            url +
            '/9D8A49D54E04E0BE62C877ACC18A5A0A/C17174134766EDEBEDFF16ABEB77FA0F/K7A9C2C9649DE211817BE6FA62781FAAF--K681047E64DB171DF2FBC89917DCADF3F?dossier.filters=%5B%7B%22name%22%3A%22Subcategory%22%2C%22selections%22%3A%5B%7B%22name%22%3A%22Literature%22%7D%2C%7B%22name%22%3A%22Action%22%7D%5D%7D%2C%7B%22name%22%3A%22Discount%22%2C%22qualifier%22%3A%22Between%22%2C%22constants%22%3A%5B%22100%22%2C%22900%22%5D%7D%5D';
        await browser.url(customUrl3);
        await dossierPage.waitForDossierLoading();
        //Validate page and filter
        await since('The page should be #{expected} after apply customUrl3, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['URL API Dossier-with prompt need answer', 'Chapter 2', 'Page 2']);
        await filterSummary.viewAllFilterItems();
        await since(
            'The displayed value for Discount on filter summary should be #{expected} after apply customUrl3, instead we have #{actual}'
        )
            .expect(await filterSummary.expandedFilterItems('Discount'))
            .toBe('$ 100 - $ 900');
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Subcategory');
        await since(
            'The Literature is selected should be #{expected} after apply customUrl3, instead we have #{actual}'
        )
            .expect(await checkboxFilter.isElementSelected('Literature'))
            .toBe(true);
        await since('The Action is selected should be #{expected} after apply customUrl3, instead we have #{actual}')
            .expect(await checkboxFilter.isElementSelected('Action'))
            .toBe(true);
        await filterPanel.closeFilterPanel();
        await since(
            'The first element of Cost metric should be #{expected} after apply customUrl3, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$4,526');
        //Remove dossier from library
        await dossierPage.goToLibrary();
        await libraryPage.moveDossierIntoViewPort(dossier3.name);
        await libraryPage.openDossierInfoWindow(dossier3.name);
        await infoWindow.selectRemove();
        await infoWindow.confirmRemove();
        //Apply filter[Year!=2015] of Chapter3 with pagekey
        const customUrl4 =
            url +
            '/9D8A49D54E04E0BE62C877ACC18A5A0A/C17174134766EDEBEDFF16ABEB77FA0F/K3B2425FD403EB4DFBFE3D28580DF0082--KF6C1DFED483D6C3250CB5BAF17280FAD?dossier.filters=%5B%7B%22name%22%3A%22Year%22%2C%22qualifier%22%3A%22NotIn%22%2C%22selections%22%3A%5B%7B%22name%22%3A%222015%22%7D%5D%7D%5D';
        await browser.url(customUrl4);
        await dossierPage.waitForDossierLoading();
        await since(
            'Does the error dialog popup when apply url in dossier3 not in library should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.isErrorPresent())
            .toBe(false);
        await promptEditor.run();
        //Add to library
        await dossierPage.clickAddToLibraryButton();
        await browser.url(customUrl4);
        await dossierPage.waitForDossierLoading();
        //Validate page and filter
        await since('The page should be #{expected} apply customUrl4, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['URL API Dossier-with prompt need answer', 'Chapter 3', 'Page 1']);
        await filterSummary.viewAllFilterItems();
        await since(
            'The displayed value for Year on filter summary should be #{expected} apply customUrl4, instead we have #{actual}'
        )
            .expect(await filterSummary.expandedFilterItems('Year'))
            .toBe('2015');
        await since('The Filter Excluded of Year should be #{expected} apply customUrl4, instead we have #{actual}')
            .expect(await filterSummaryBar.isFilterExcludedinExpandedView('Year'))
            .toBe(true);
        await filterPanel.openFilterPanel();
        await since(
            'CapsuleExcluded value for 2015 Year attribute is supposed to be #{expected} apply customUrl4, instead we have #{actual}'
        )
            .expect(await checkboxFilter.isCapsuleExcluded({ filterName: 'Year', capsuleName: '2015' }))
            .toBe(true);
        await filterPanel.closeFilterPanel();
        await grid.selectGridContextMenuOption({
            title: 'Visualization 1',
            headerName: 'Year',
            elementName: '2014',
            firstOption: 'Exclude',
        });
        await since(
            'The first element of Year attribute should be #{expected} apply customUrl4, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Year' }))
            .toBe('2016');
    });

    it('[TC80298] Validate URL API can pass filter values to a specific page in a Dossier created from crosstab report in library web', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier4,
        });
        const url = await browser.getUrl();
        const customUrl =
            url +
            '/9D8A49D54E04E0BE62C877ACC18A5A0A/C68D29F949F3D69C29137F84073130A6/K53--K46?dossier.filters=%5B%7B%22name%22%3A%22Region%22%2C%22selections%22%3A%5B%7B%22name%22%3A%22South%22%7D%5D%7D%5D';
        //Apply filter[Region=South] of Chapter1 Page1 with pagekey in Chapter2
        await browser.url(customUrl);
        await dossierPage.waitForDossierLoading();
        //Validate page and filter
        await since('The page should be #{expected} after apply customUrl, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['crosstab dossier', 'Chapter 1', 'Page 1']);
        await filterSummary.viewAllFilterItems();
        await since(
            'The displayed value for Region on filter summary should be #{expected} after answer prompt and apply customUrl, instead we have #{actual}'
        )
            .expect(await filterSummary.expandedFilterItems('Region'))
            .toBe('South');
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Region');
        await since(
            'The South is selected should be #{expected} after answer prompt and apply customUrl, instead we have #{actual}'
        )
            .expect(await checkboxFilter.isElementSelected('South'))
            .toBe(true);
        await filterPanel.closeFilterPanel();
        await since(
            'The first element of Region attribute should be #{expected} after answer prompt and apply customUrl, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Region' }))
            .toBe('Revenue');
    });
});

export const config = specConfiguration;
