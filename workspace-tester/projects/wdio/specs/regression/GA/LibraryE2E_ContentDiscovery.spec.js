import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_contentdiscovery') };

describe('E2E test of content discovery', () => {
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

    let { libraryPage, sidebar, contentDiscovery, dossierPage, listView, loginPage } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await libraryPage.executeScript('window.localStorage.clear();');
        await loginPage.login(specConfiguration.credentials);
    });

    it('[TC88669] Validate E2E workflow of Discover Content on Library Web', async () => {
        await libraryPage.openCustomAppById({ id: 'D055C3242F5D487E951F13006A350F55' });
        // open content discovery
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();

        // open folder
        await contentDiscovery.openProjectList();
        await contentDiscovery.searchProject('Tutorial');
        await contentDiscovery.selectProject(project.name);
        await contentDiscovery.openFolderByPath(['Shared Reports', '_REGRESSION TEST_', 'Library - Content Discovery']);
        await takeScreenshotByElement(libraryPage.getLibraryContentContainer(), 'TC88669', 'E2E_Content_Discovery');

        // the last state should be remembered
        await listView.openDossier(dossier.name);
        await dossierPage.goToLibrary();
        const path = 'MicroStrategy Tutorial>Shared Reports>_REGRESSION TEST_>Library - Content Discovery';
        await since('Open dossier and click library icon, folder path should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.folderPath())
            .toBe(path);

        // open folder panel through folder path
        await contentDiscovery.openFolderFromFolderPath('_REGRESSION TEST_');
        const path2 = 'MicroStrategy Tutorial>Shared Reports>_REGRESSION TEST_';
        await since('Click folder name in folder path, folder path should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.folderPath())
            .toBe(path2);
        await since(
            'Click folder name in folder path, selected folder in folder panel should be #{expected}, instead we have #{actual}'
        )
            .expect(await contentDiscovery.selectedFolder())
            .toBe('_REGRESSION TEST_');
    });
});
export const config = specConfiguration;
