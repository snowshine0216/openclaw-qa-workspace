import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_cd_func') };
const specConfiguration_E2E = { ...customCredentials('_contentdiscovery') };

describe('Content Discovery', () => {
    const project = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };
    const dossier = {
        id: '22791C4648DEE1D48476899BD1C23D0A',
        name: '(Auto) Content - Dossier',
        project: project,
    };
    const report = {
        id: '300CECC44275368CFFEE6CA44896C5A9',
        name: '(Auto) Content - Report',
        project: project,
    };
    const document = {
        id: 'A615CADE45CE98D6493FDCA7F7D9E0BB',
        name: '(Auto) Content - RSD',
        project: project,
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };


    let { libraryPage, libraryFilter, sidebar, contentDiscovery, loginPage, listView } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
    });

    beforeEach(async () => {
        await setWindowSize(browserWindow);
        await libraryPage.openCustomAppById({ id: 'D055C3242F5D487E951F13006A350F55' });
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
        await libraryPage.executeScript('window.localStorage.clear();');
        await loginPage.login(specConfiguration.credentials);
    });

    it('[TC89173_01] Validate user last state can be remembered for Discover Content on Library Web - last status will be remembered - relogin', async () => {
        await libraryPage.openSidebarOnly();
        await sidebar.dragSidebarWidth(100);
        await since('After drag, Sidebar Width should be #{expected}, instead we have #{actual}')
            .expect(await sidebar.sidebarWidth())
            .toBe(340);
        await sidebar.openContentDiscovery();
        await contentDiscovery.dragFolderPanelWidth(260);
        await since('After drag, Folder Panel Width should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.folderPanelWidth())
            .toBe(600);
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject(project.name);
        await contentDiscovery.openFolderByPath(['Shared Reports', '_REGRESSION TEST_', 'Library - Content Discovery']);
        await contentDiscovery.expandFolderByPath(['Library - Content Group']);
        await libraryPage.openSortMenu();
        await libraryPage.selectSortOption('Date Updated');
        await libraryPage.clickFilterIcon();
        await libraryFilter.openFilterTypeDropdown();
        await libraryFilter.checkFilterType('Dashboard');
        await libraryFilter.clickApplyButton();

        // close folder panel and switch to other tab in sidebar
        await contentDiscovery.closeFolderPanel();
        await sidebar.openAllSectionList();
        await since('After switch, Folder Panel show should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.isFolderPanelOpened())
            .toBe(false);
        await contentDiscovery.openFolderPanel();
        await sidebar.openContentDiscovery();
        await since('After switch, Folder Panel Width should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.folderPanelWidth())
            .toBe(600);
        await since(
            'After switch and Close folder panel and re-open, selected folder should be #{expected}, instead we have #{actual}'
        )
            .expect(await contentDiscovery.selectedFolder())
            .toBe('Library - Content Discovery');
        // All folder status should be remembered
        await since(
            'After switch and Close folder panel and re-open, content discovery folder expanded should be #{expected}, instead we have #{actual}'
        )
            .expect(await contentDiscovery.isFolderExpanded('Library - Content Discovery'))
            .toBe(true);
        await since(
            'After switch and Close folder panel and re-open, content group folder expanded should be #{expected}, instead we have #{actual}'
        )
            .expect(await contentDiscovery.isFolderExpanded('Library - Content Group'))
            .toBe(true);

        //logout and re-login
        await libraryPage.switchUser(specConfiguration.credentials);
        await since('re-login, Sidebar Width should be #{expected}, instead we have #{actual}')
            .expect(await sidebar.sidebarWidth())
            .toBe(340);
        await since('re-login, Folder Panel Width should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.folderPanelWidth())
            .toBe(600);
        await since('re-login, sort option should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.currentSortOption())
            .toEqual('Date Updated');
        await since('re-login, libraryFilterCount should be #{expected}, instead we have #{actual}')
            .expect(await libraryFilter.filterApplyCount())
            .toEqual('1');
        await since('re-login, selected folder should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.selectedFolder())
            .toBe('Library - Content Discovery');
        const path = 'MicroStrategy Tutorial>Shared Reports>_REGRESSION TEST_>Library - Content Discovery';
        await since('re-login, folder path should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.folderPath())
            .toBe(path);
    });

    it('[TC89173_02] Validate user last state can be remembered for Discover Content on Library Web - last status will be remembered - switch user', async () => {
        // Last status: folder path, folder panel closed, sidebar selection, selected project, selected folder
        await libraryPage.openSidebarOnly();
        await sidebar.dragSidebarWidth(100);
        await sidebar.openContentDiscovery();
        await contentDiscovery.dragFolderPanelWidth(260);
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject('MicroStrategy Tutorial Timezone');
        await contentDiscovery.openFolderByPath(['Shared Reports', '_Automation']);
        await libraryPage.openSortMenu();
        await libraryPage.selectSortOption('Owner');
        await libraryPage.clickFilterIcon();
        await libraryFilter.selectCertifiedOnly();
        await libraryFilter.clickApplyButton();

        //switch user
        await libraryPage.switchUser(specConfiguration_E2E.credentials);
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await since('switch user, Sidebar Width should be #{expected}, instead we have #{actual}')
            .expect(await sidebar.sidebarWidth())
            .toBe(240);
        await since('switch user, Folder Panel Width should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.folderPanelWidth())
            .toBe(340);
        await since('switch user, sort option should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.librarySort.isSortDisplay())
            .toBe(false);
        await since('switch user, libraryFilterCount should be #{expected}, instead we have #{actual}')
            .expect(await libraryFilter.isLibraryFilterDisplay())
            .toBe(false);
        await since('switch user, selected Project should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.selectedProject())
            .toEqual(project.name);
        await since('After switch project, Public Objects folder should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.isFolderExpanded('Shared Reports'))
            .toBe(false);

        // switch back, sidebar status/folder panel should not be remembered
        await libraryPage.switchUser(specConfiguration.credentials);
        await since('switch back, Sidebar Width should be #{expected}, instead we have #{actual}')
            .expect(await sidebar.sidebarWidth())
            .toBe(340);
        await since('switch back, Folder Panel Width should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.folderPanelWidth())
            .toBe(600);
        await since('switch back, Public Objects folder should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.isFolderExpanded('Shared Reports'))
            .toBe(false);
    });

    it('[TC89173_03] Validate user last state can be remembered for Discover Content on Library Web - last status will not be remembered - switch app by update link', async () => {
        await libraryPage.openSidebarOnly();
        await sidebar.dragSidebarWidth(100);
        await since('After drag, Sidebar Width should be #{expected}, instead we have #{actual}')
            .expect(await sidebar.sidebarWidth())
            .toBe(340);
        await sidebar.openContentDiscovery();
        await contentDiscovery.dragFolderPanelWidth(260);
        await since('After drag, Folder Panel Width should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.folderPanelWidth())
            .toBe(600);
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject('MicroStrategy Tutorial Timezone');
        await contentDiscovery.openFolderByPath(['Shared Reports', '_Automation']);
        await libraryPage.openSortMenu();
        await libraryPage.selectSortOption('Date Created');
        await libraryPage.clickFilterIcon();
        await libraryFilter.openFilterTypeDropdown();
        await libraryFilter.checkFilterType('Report');
        await libraryFilter.clickApplyButton();

        //switch custom app
        await libraryPage.openCustomAppById({ id: '6068D82AC32B47219C6BA28846668D81' });
        await since('switch custom app, Sidebar opened should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isSidebarOpened())
            .toBe(false);
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await since('switch custom app, Sidebar Width should be #{expected}, instead we have #{actual}')
            .expect(await sidebar.sidebarWidth())
            .toBe(240);
        await since('switch custom app, Folder Panel Width should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.folderPanelWidth())
            .toBe(340);
        await since('switch user, sort option should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.librarySort.isSortDisplay())
            .toBe(false);
        await since('switch user, libraryFilterCount should be #{expected}, instead we have #{actual}')
            .expect(await libraryFilter.isLibraryFilterDisplay())
            .toBe(false);
        await since(
            'switch custom app, Public Objects folder expanded should be #{expected}, instead we have #{actual}'
        )
            .expect(await contentDiscovery.isFolderExpanded('Shared Reports'))
            .toBe(false);

        //switch back
        await libraryPage.openCustomAppById({ id: 'D055C3242F5D487E951F13006A350F55' });
        await since('switch back, Sidebar Width should be #{expected}, instead we have #{actual}')
            .expect(await sidebar.sidebarWidth())
            .toBe(340);
        await since('switch back, Folder Panel Width should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.folderPanelWidth())
            .toBe(600);
        await since('switch back, sort option should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.librarySort.isSortDisplay())
            .toBe(false);
        await since('switch back, libraryFilterCount should be #{expected}, instead we have #{actual}')
            .expect(await libraryFilter.isLibraryFilterDisplay())
            .toBe(false);
        await since('switch back, Public Objects folder expanded should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.isFolderExpanded('Shared Reports'))
            .toBe(false);
    });

    it('[TC89173_04] Validate user last state can be remembered for Discover Content on Library Web - last status will be remembered - switch app', async () => {
        await libraryPage.openSidebarOnly();
        await sidebar.dragSidebarWidth(100);
        await since('After drag, Sidebar Width should be #{expected}, instead we have #{actual}')
            .expect(await sidebar.sidebarWidth())
            .toBe(340);
        await sidebar.openContentDiscovery();
        await contentDiscovery.dragFolderPanelWidth(260);
        await since('After drag, Folder Panel Width should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.folderPanelWidth())
            .toBe(600);
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject(project.name);
        await contentDiscovery.openFolderByPath(['Shared Reports', '_REGRESSION TEST_', 'Library - Content Discovery']);
        await libraryPage.openSortMenu();
        await libraryPage.selectSortOption('Date Updated');
        await libraryPage.clickFilterIcon();
        await libraryFilter.openFilterTypeDropdown();
        await libraryFilter.checkFilterType('Document');
        await libraryFilter.clickApplyButton();

        //switch custom app
        await libraryPage.userAccount.openUserAccountMenu();
        await libraryPage.userAccount.openSwitchApplicationSubPanel();
        await libraryPage.userAccount.clickApplication('ColorTheme');
        await since('switch custom app, Sidebar opened should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isSidebarOpened())
            .toBe(false);
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await since('switch user, sort option should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.librarySort.isSortDisplay())
            .toBe(false);
        await since('switch user, libraryFilterCount should be #{expected}, instead we have #{actual}')
            .expect(await libraryFilter.isLibraryFilterDisplay())
            .toBe(false);
        await since('switch custom app, Sidebar Width should be #{expected}, instead we have #{actual}')
            .expect(await sidebar.sidebarWidth())
            .toBe(240);
        await since('switch custom app, Folder Panel Width should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.folderPanelWidth())
            .toBe(340);
        await since(
            'switch custom app, Public Objects folder expanded should be #{expected}, instead we have #{actual}'
        )
            .expect(await contentDiscovery.isFolderExpanded('Shared Reports'))
            .toBe(false);

        //switch back
        await libraryPage.userAccount.openUserAccountMenu();
        await libraryPage.userAccount.openSwitchApplicationSubPanel();
        await libraryPage.userAccount.clickApplication('Shuang_App');
        await since('switch back, Sidebar Width should be #{expected}, instead we have #{actual}')
            .expect(await sidebar.sidebarWidth())
            .toBe(340);
        await since('switch back, Folder Panel Width should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.folderPanelWidth())
            .toBe(600);
        await since('switch back, sort option should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.currentSortOption())
            .toEqual('Date Updated');
        await since('switch back, libraryFilterCount should be #{expected}, instead we have #{actual}')
            .expect(await libraryFilter.filterApplyCount())
            .toEqual('1');
        const path = 'MicroStrategy Tutorial>Shared Reports>_REGRESSION TEST_>Library - Content Discovery';
        await since('switch back, Public Objects folder should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.folderPath())
            .toBe(path);
    });

    it('[TC89173_05] Validate user last state can be remembered for Discover Content on Library Web - last status will not be remembered', async () => {
        await libraryPage.openSidebarOnly();
        await since('Sidebar Width should be #{expected}, instead we have #{actual}')
            .expect(await sidebar.sidebarWidth())
            .toBe(240);
        await sidebar.dragSidebarWidth(100);
        await since('After drag, Sidebar Width should be #{expected}, instead we have #{actual}')
            .expect(await sidebar.sidebarWidth())
            .toBe(340);
        await sidebar.openContentDiscovery();
        await since('Folder Panel Width should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.folderPanelWidth())
            .toBe(340);
        await contentDiscovery.dragFolderPanelWidth(-60);
        await since('After drag, Folder Panel Width should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.folderPanelWidth())
            .toBe(280);
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject(project.name);
        await contentDiscovery.openFolderByPath([
            'Shared Reports',
            '_REGRESSION TEST_',
            'Library - Content Discovery',
            'Blank Folder',
        ]);
        const path = 'MicroStrategy Tutorial>Shared Reports>_REGRESSION TEST_>Library - Content Discovery>Blank Folder';
        await since('folder path should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.folderPath())
            .toBe(path);
        await since('isEmptyContent should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.isEmptyContent())
            .toBe(true);

        // collapse folder and re-open, the status should be remembered
        await contentDiscovery.collapseFolder('Library - Content Discovery');
        await contentDiscovery.expandFolderByPath(['Library - Content Discovery']);
        await since('After switch project, Blank folder expanded should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.isFolderExpanded('Blank Folder'))
            .toBe(true);

        // switch project, the selected folders should not be remembered
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject('MicroStrategy Tutorial Timezone');
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject('MicroStrategy Tutorial');
        await since('After switch project, Public Objects folder should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.isFolderExpanded('Shared Reports'))
            .toBe(false);
    });

    it('[TC90368] Validate project list for Discover Content on Library Web', async () => {
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await since('isProjectGrayedOut should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.isProjectGrayedOut())
            .toBe(true);

        // search without result
        await contentDiscovery.searchProject('testnoresultf'); // test if f will trigger global search
        await since('Empty List Present should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.isEmptyListPresent())
            .toBe(true);
        // search with result
        await contentDiscovery.searchProject('tutorial');
        await contentDiscovery.selectProject(project.name);
        await contentDiscovery.openFolderByPath(['Shared Reports', '_REGRESSION TEST_', 'Library - Content Discovery']);
        const path = 'MicroStrategy Tutorial>Shared Reports>_REGRESSION TEST_>Library - Content Discovery';
        await since('folder path should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.folderPath())
            .toBe(path);
    });

    it('[TC89180] Validate folder path for Discover Content on Library Web', async () => {
        // open content discovery
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.searchProject('tutorial');
        await contentDiscovery.selectProject(project.name);
        await contentDiscovery.openFolderByPath([
            'Shared Reports',
            '_REGRESSION TEST_',
            'Library - Content Discovery',
            'Blank Folder',
        ]);
        await setWindowSize({
            width: 1200,
            height: 1200,
        });
        await contentDiscovery.hoverDotsInFolderPath();
        await contentDiscovery.clickFolderInDropdownList('_REGRESSION TEST_');
        const path = 'MicroStrategy Tutorial>Shared Reports>_REGRESSION TEST_';
        await since('Click folder name in folder path, folder path should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.folderPath())
            .toBe(path);
        await since(
            'Click folder name in folder path, selected folder in folder panel should be #{expected}, instead we have #{actual}'
        )
            .expect(await contentDiscovery.selectedFolder())
            .toBe('_REGRESSION TEST_');
        await since(
            'Click folder name in folder path, _REGRESSION TEST_ folder should expanded be #{expected}, instead we have #{actual}'
        )
            .expect(await contentDiscovery.isFolderExpanded('_REGRESSION TEST_'))
            .toBe(true);
    });

    it('[TC90013] Validate shortcut folder for Discover Content on Library Web', async () => {
        // open content discovery
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.searchProject('tutorial');
        await contentDiscovery.selectProject(project.name);
        await contentDiscovery.openFolderByPath([
            'Shared Reports',
            '_REGRESSION TEST_',
            'Library - Content Discovery',
            'Shortcut',
        ]);

        // need to add date updated time assertion
        const path = 'MicroStrategy Tutorial>Shared Reports>_REGRESSION TEST_>Library - Content Discovery>Shortcut';
        await since('Click folder name in folder path, folder path should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.folderPath())
            .toBe(path);
        await since('is Shortcut folder in folder panel should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.isShortcutFolder('New Folder 1'))
            .toBe(true);
        await since('Updated time for (Auto) Content - RSD shortcut should be #{expected}, instead we have #{actual}')
            .expect(await listView.contentUpdatedTime(document.name))
            .toBe('06/13/2023');
    });

    it('[TC89181] Validate UI of Discover Content on Library Web', async () => {
        await setWindowSize({
            browserInstance: browsers.browser1,
            width: 760,
            height: 1200,
        });
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.searchProject('tutorial');
        await contentDiscovery.selectProject(project.name);
        await contentDiscovery.openFolderByPath(['Shared Reports', '_REGRESSION TEST_', 'Library - Content Discovery']);
        await takeScreenshotByElement(
            libraryPage.getLibraryContentContainer(),
            'TC89181',
            'Content Panel in tablet view',
            { tolerance: 0.4 }
        );

        // phone view
        await setWindowSize({
            browserInstance: browsers.browser1,
            width: 360,
            height: 740,
        });
        await takeScreenshotByElement(
            libraryPage.getLibraryContentContainer(),
            'TC89181',
            'Content Panel in phone view',
            { tolerance: 0.4 }
        );
        await contentDiscovery.clickBackButtonInMobileView();
        await takeScreenshotByElement(libraryPage.getLibraryContentContainer(), 'TC89181', 'Sidebar in phone view', {
            tolerance: 0.4,
        });

        await setWindowSize({
            browserInstance: browsers.browser1,
            width: 1600,
            height: 1200,
        });
        await takeScreenshotByElement(
            libraryPage.getLibraryContentContainer(),
            'TC89181',
            'Content Panel in web view',
            { tolerance: 0.4 }
        );
    });

});
export const config = specConfiguration;
