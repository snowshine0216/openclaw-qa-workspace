import { customCredentials, browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import setProjectAlias from '../../../api/mock/mock-response-utils.js';

const specConfiguration = { ...customCredentials('_alias') };

describe('Project Alias', () => {
    const { credentials } = specConfiguration;

    const tutorialDossier = {
        id: '957A9C7B462A52FA24A07B8BA02F788F',
        name: 'Dossier sanity_General',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const timezoneDossier = {
        id: '287A10B94E938AB604F2C9A02BEA9130',
        name: 'Auto_Timezone_E2E',
        project: {
            id: '9A7E738747DFAE62B4458A8B96EBA314',
            name: 'MicroStrategy Tutorial Timezone',
        },
    };

    let {
        loginPage,
        libraryPage,
        libraryFilter,
        infoWindow,
        listView,
        listViewAGGrid,
        contentDiscovery,
        sidebar,
        quickSearch,
        fullSearch,
        filterOnSearch,
        libraryAuthoringPage,
    } = browsers.pageObj1;

    const projectAlias = 'Alias MicroStrategy Tutorial';
    const projectAliasTimezone = `'><img src=x onerror=alert(234234) onclick=a><script>`;

    const projects = [
        { projectId: tutorialDossier.project.id, alias: projectAlias },
        { projectId: timezoneDossier.project.id, alias: projectAliasTimezone },
    ];

    beforeAll(async () => {
        await loginPage.login(credentials);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await libraryPage.openCustomAppById({ id: 'A55BF2E39B37499BBAB1140F7A64751F' });
        await setProjectAlias(projects, credentials);
        await libraryPage.refresh();
    });

    it('[TC97830_01] Verify Functionality for Project Alias - Grid View and List View', async () => {
        // grid view path
        await libraryPage.openDossierInfoWindow(timezoneDossier.name);
        await since('Path for grid view should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.pathInInfoWindow())
            .toBe(`${projectAliasTimezone}\n>\nShared Reports\n>\n_Automation`);
        await libraryPage.openDossierInfoWindow(tutorialDossier.name);
        await since('Path for grid view should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.pathInInfoWindow())
            .toBe(`${projectAlias}\n>\nShared Reports\n>\n_REGRESSION TEST_\n>\nLibrary - Sanity`);

        // list view path
        await listView.selectListViewMode();
        await listViewAGGrid.clickColumnsButton();
        await listViewAGGrid.addColumnByNameList(['Project', 'Path']);
        await since('Project column for list view should be #{expected}, instead we have #{actual}')
            .expect(await listView.contentProject(tutorialDossier.name))
            .toBe(`${projectAlias}`);
        await since('Path for list view should be #{expected}, instead we have #{actual}')
            .expect(await listView.contentPath(tutorialDossier.name))
            .toBe(`${projectAlias} > Shared Reports > _REGRESSION TEST_ > Library - Sanity`);
        await since('Path for list view info window should be #{expected}, instead we have #{actual}')
            .expect(await listView.pathInListViewInfoWindow())
            .toBe(`${projectAlias} > Shared Reports > _REGRESSION TEST_ > Library - Sanity`);
        await listView.clickCloseIcon();
        await listViewAGGrid.clickSortBarColumn('Project', 'ascending');
        await since('Last dossier should be #{expected}, instead we have #{actual}')
            .expect(await (await listViewAGGrid.getLastDossierName()).getText())
            .toBe(tutorialDossier.name);
        await listViewAGGrid.clickSortBarColumn('Path', 'descending');
        await since('Last dossier should be #{expected}, instead we have #{actual}')
            .expect(await (await listViewAGGrid.getLastDossierName()).getText())
            .toBe(timezoneDossier.name);
        await listViewAGGrid.deselectListViewMode();
    });

    it('[TC97830_02] Verify Functionality for Project Alias - library filter', async () => {
        await since('The items count should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.getDossierCount())
            .toBe(2);
        await libraryPage.clickFilterIcon();
        await libraryFilter.openFilterDetailPanel('Project');
        await libraryFilter.searchFilterItem(projectAlias);
        await libraryFilter.selectOptionInCheckbox(projectAlias);
        await libraryFilter.clickApplyButton();
        await since('After filter, The items count should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.getDossierCount())
            .toBe(1);
        await libraryPage.clickFilterIcon();
        await libraryPage.clickFilterClearAll();
        await libraryFilter.clickApplyButton();
    });

    it('[TC97830_03] Verify Functionality for Project Alias - content discovery', async () => {
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.searchProject(projectAlias);
        await contentDiscovery.selectProject(projectAlias);
        await contentDiscovery.openFolderByPath(['Shared Reports', '_REGRESSION TEST_', 'Library - Sanity']);
        await since('Path for content discovery should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.folderPath())
            .toBe(`${projectAlias}>Shared Reports>_REGRESSION TEST_>Library - Sanity`);
        await listViewAGGrid.clickColumnsButton();
        await listViewAGGrid.addColumnByNameList(['Path']);
        await since('Path Column should be #{expected} items, instead we have #{actual}')
            .expect(await listView.contentPath(tutorialDossier.name))
            .toContain(`${projectAlias} > Shared Reports > _REGRESSION TEST_ > Library - Sanity`);
        await sidebar.clickAllSection();
    });

    it('[TC97830_04] Verify Functionality for Project Alias - search page', async () => {
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(tutorialDossier.name);
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('Project');
        await filterOnSearch.searchOnFilter(projectAlias);
        await filterOnSearch.selectOptionInCheckbox(projectAlias);
        await filterOnSearch.applyFilterChanged();
        await fullSearch.openInfoWindow(tutorialDossier.name);
        await since('Path for global should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.pathInInfoWindow())
            .toBe(`${projectAlias}\n>\nShared Reports\n>\n_REGRESSION TEST_\n>\nLibrary - Sanity`);
    });

    it('[TC97830_05] Verify Functionality for Project Alias - dashboard creation', async () => {
        await libraryAuthoringPage.clickNewDossierIcon();
        await libraryAuthoringPage.clickNewDossierButton(false);
        await libraryAuthoringPage.changeProjectTo(projectAlias);
        await libraryAuthoringPage.switchToBrowsingMode();
        await since('Browsing folder exists should be #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.isBrowsingFolderPresent(projectAlias))
            .toBe(true);
        await libraryAuthoringPage.clickCloseButtonIfVisible();
    });

    // it('[TC97830_06] Verify Functionality for Project Alias - dashboard creation', async () => {
    //     await libraryAuthoringPage.clickNewDossierIcon();
    //     await libraryAuthoringPage.clickNewReportButton();
    //     await libraryAuthoringPage.searchForProject(projectAlias);
    //     await libraryAuthoringPage.selectProject(projectAlias);
    //     await libraryAuthoringPage.saveProjectSelection();
    // });
});
