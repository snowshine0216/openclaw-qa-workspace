import setWindowSize from '../../../../config/setWindowSize.js';
import IframeEmbeddingPage from '../../../../pageObjects/embedding/IframeEmbeddingPage.js';
import * as embeddingConstants from '../../../../constants/embedding.js';

describe('Iframe Embedding SDK Test - Project Filter', () => {
    let embeddingPage: IframeEmbeddingPage;
    const serverUrl = browser.options.baseUrl;
    const embeddingPageUrl = 'http://10.23.32.59:9001/native-embedding.html';
    const loginConfig = embeddingConstants.projectFilterUser;
    const tutorialProject = {
        id: 'B19DEDCC11D4E0EFC000EB9495D0F44F',
        name: 'Tutorial Project',
    };
    const dashboardInTutorial = {
        id: '3CCC6C2B7048424908674FA7A7E68B8F',
        name: 'Dashboard in Tutorial',
        project: tutorialProject,
    };
    const dashboardNotInTutorial = {
        id: '0C9DD4E3CC46231B39CC5087A829E60B',
        name: 'Dashboard not in Tutorial',
    };
    const config = {
        serverUrl: serverUrl,
        containerHeight: '1000px',
        enableResponsive: true,
        settings: {
            filter: {
                projects: ['B19DEDCC11D4E0EFC000EB9495D0F44F'],
            },
        },
        customUi: {
            // Handle the UI in library home page
            library: {
                navigationBar: {
                    enabled: true,
                },
                sidebar: {
                    show: true, // Must be enabled by custom application
                },
            },
            // Handle the UI in dashboard consumption mode
            dossierConsumption: {
                navigationBar: {
                    enabled: true,
                    edit: true,
                },
            },
            // Handle the UI in dashboard authoring mode
            dossierAuthoring: {
                toolbar: {
                    tableOfContents: {
                        visible: true,
                    },
                },
            },
        },
        currentPage: {
            key: 'all',
        },
        errorHandler: function (error) {
            console.log('catching error', JSON.stringify(error));
        },
        sessionErrorHandler: (error) => {
            console.log('catching session error', JSON.stringify(error));
        },
    };

    const {
        loginPage,
        libraryPage,
        libraryFilter,
        librarySort,
        sidebar,
        contentDiscovery,
        search,
        filterPanel,
        fullSearch,
        filterOnSearch,
        dossierPage,
        libraryAuthoringPage,
        baseVisualization,
        reportMenubar,
        contextualLinkEditor,
        subscribe,
        dossierAuthoringPage,
    } = browsers.pageObj1;

    beforeAll(async () => {
        embeddingPage = new IframeEmbeddingPage(embeddingPageUrl, serverUrl, config);

        await browser.cdp('Network', 'setCacheDisabled', { cacheDisabled: true });
        const browserWindow = {
            width: 1600,
            height: 1200,
        };
        await setWindowSize(browserWindow);
    });

    afterAll(async () => {
        await browser.cdp('Network', 'setCacheDisabled', { cacheDisabled: false });
    });

    // npm run regression -- --baseUrl=https://mci-h7kzr-dev.hypernow.microstrategy.com/MicroStrategyLibrary --params.browserName=chrome --params.locale=en-EN --tcList=TC99119
    it('[TC99119] Embed Library Project Filter', async () => {
        await embeddingPage.navigateToPage();
        await embeddingPage.loadScripts();
        await embeddingPage.createEnvironment();
        await embeddingPage.waitForItemLoading();

        await loginPage.login(loginConfig);
        // Wait for the library page to load
        await loginPage.waitForLibraryLoading();

        //Check "Dashboard not in Tutorial" is not in library list
        await since(
            'dossier "Dashboard not in Tutorial" in my library should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.isDossierInLibrary(dashboardNotInTutorial))
            .toBe(false);

        // Check "Dashboard in Tutorial" is in library list
        await since(
            '1st dossier "Dashboard in Tutorial" in my library should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.isDossierInLibrary(dashboardInTutorial))
            .toBe(true);

        //Check no project option in filter panel
        await libraryPage.clickFilterIcon();
        await since('Filter dropdown options should be #{expected}, instead we have #{actual}')
            .expect(await libraryFilter.getFilterOptions())
            .toEqual(['Type', 'Owner', 'Status', 'Certified Only']);

        //Check no project option in sort by dropdown
        await librarySort.openSortMenu();
        await since('Project option exsit in sort by menu should be #{expected}, instead we have #{actual}')
            .expect(await librarySort.isSortOptionExist('Project'))
            .toBe(false);

        // Check "Dashboard in Tutorial" is in local search result
        await search.openSearchSlider();
        await search.inputTextAndSearch(dashboardInTutorial.name);
        await fullSearch.clickMyLibraryTab();
        await since(
            'isDisplay() of "Dashboard in Tutorial" in local search result is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await fullSearch.getResultItemByName(dashboardInTutorial.name).isDisplayed())
            .toBe(true);

        // Check no project in local search filter panel
        await filterOnSearch.openSearchFilterPanel();
        await since('The Project filter option present should be #{expected}, instead we have #{actual}')
            .expect(await filterOnSearch.isFilterPresent('Project'))
            .toEqual(false);
        await filterPanel.closeFilterPanel();
        // Check "Dashboard in Tutorial" is in global search result
        await fullSearch.clickAllTab();
        await since(
            'isDisplay() of "Dashboard in Tutorial" in global search result is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await fullSearch.getResultItemByName(dashboardInTutorial.name).isDisplayed())
            .toBe(true);

        // Check no project in local search filter panel
        await filterOnSearch.openSearchFilterPanel();
        await since('The Project filter option present should be #{expected}, instead we have #{actual}')
            .expect(await filterOnSearch.isFilterPresent('Project'))
            .toEqual(false);
        await filterPanel.closeFilterPanel();

        // Check "Dashboard not in Tutorial" is not in local search result
        await search.inputTextAndSearch(dashboardNotInTutorial.name);
        await fullSearch.clickMyLibraryTab();
        await since(
            'isDisplay() of "Dashboard not in Tutorial" in local search result is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await fullSearch.getResultItemByName(dashboardNotInTutorial.name).isDisplayed())
            .toBe(false);

        // Check "Dashboard not in Tutorial" is not in global search result
        await fullSearch.clickAllTab();
        await since(
            'isDisplay() of "Dashboard not in Tutorial" in global search result is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await fullSearch.getResultItemByName(dashboardNotInTutorial.name).isDisplayed())
            .toBe(false);
        await dossierPage.goToLibrary();

        // Check only one project when create new dashboard
        await libraryAuthoringPage.clickNewDossierIcon();
        // wait for loading icon disappear
        await libraryAuthoringPage.waitForElementInvisible(reportMenubar.getLoadingIcon());
        await libraryAuthoringPage.waitForElementInvisible(libraryAuthoringPage.getDatasetListLoadingSpinner());
        await libraryAuthoringPage.waitForElementVisible(libraryAuthoringPage.getChangeProject());
        await since('Change project button should be disabled')
            .expect(await libraryAuthoringPage.isProjectGrayedOut())
            .toBe(true);
        await libraryAuthoringPage.clickCloseButtonIfVisible();

        //Check only one project when create contextual link in dashboard
        await libraryPage.openDossier(dashboardInTutorial.name);
        await libraryAuthoringPage.editDossierFromLibrary();
        await baseVisualization.createContextualLink('Visualization 1');
        await contextualLinkEditor.clickOpenFolderButton();
        await since('Project Filter Selector should be disabled')
            .expect(await contextualLinkEditor.isProjectSlectorDisabled())
            .toBe(true);

        await contextualLinkEditor.cancelSelectObjectPanel();
        await contextualLinkEditor.cancelEditor();
        await dossierAuthoringPage.closeDossierWithoutSaving();
        await dossierPage.goToLibrary();

        // Check only 1 dashboard in my group
        await sidebar.openGroupSection('Project Filter Group');
        //Check "Dashboard in Tutorial" is in library list
        await since(
            '2nd dossier "Dashboard in Tutorial" in my library should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.isDossierInLibrary(dashboardInTutorial))
            .toBe(true);

        //Check "Dashboard not in Tutorial" is not in library list
        await since(
            'dossier "Dashboard not in Tutorial" in my library should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.isDossierInLibrary(dashboardNotInTutorial))
            .toBe(false);

        //Check only 1 dashboard in content group
        await sidebar.openGroupSection('Project Filter Content Group');
        //Check "Dashboard in Tutorial" is in library list
        await since(
            '3rd dossier "Dashboard in Tutorial" in my library should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.isDossierInLibrary(dashboardInTutorial))
            .toBe(true);

        //Check "Dashboard not in Tutorial" is not in library list
        await since(
            'dossier "Dashboard not in Tutorial" in my library should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.isDossierInLibrary(dashboardNotInTutorial))
            .toBe(false);

        // Check only 1 subscription in subscription tab
        await sidebar.openSubscriptions();
        await subscribe.clickSubscriptionFilter();
        await since('"Subscribe to Dashboard in Tutorial"should be existed')
            .expect(await subscribe.isSubscriptionExisted('Subscribe to Dashboard in Tutorial'))
            .toBe(true);
        await since('"Subscribe to Dashboard not in Tutorial" should not be existed')
            .expect(await subscribe.isSubscriptionExisted('Subscribe to Dashboard not in Tutorial'))
            .toBe(false);
        await since('Filter dropdown options should be #{expected}, instead we have #{actual}')
            .expect(await libraryFilter.getFilterOptions())
            .toEqual(['Content', 'Type']);
        await subscribe.clickSubscriptionFilter();

        // Check only one project in the content discovery
        await sidebar.openContentDiscovery();
        await since('Project gray out should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.isProjectGrayedOut())
            .toBe(true);

        await contentDiscovery.openFolderByPath(['Shared Reports', 'Embedding Automation', 'Project Filter']);
        //Check no project in content discovery filter
        await libraryPage.clickFilterIcon();
        await since('Filter dropdown options should be #{expected}, instead we have #{actual}')
            .expect(await libraryFilter.getFilterOptions())
            .toEqual(['Type', 'Certified Only']);

        //Check no project in content discovery sort by
        await librarySort.openSortMenu();
        await since('Project option exsit in sort by menu should be #{expected}, instead we have #{actual}')
            .expect(await librarySort.isSortOptionExist('Project'))
            .toBe(false);
    });
});
