import { takeScreenshotByElement, takeScreenshot } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import resetUserLanguage from '../../../api/resetUserLanguage.js';
import resetOnboarding from '../../../api/resetOnboarding.js';

const specConfiguration = { ...customCredentials('_cd_xfunc') };

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

    let { libraryPage, sidebar, contentDiscovery, loginPage, userAccount, onboardingTutorial, userPreference } =
        browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(specConfiguration.credentials);
    });

    beforeEach(async () => {
        await resetOnboarding({
            credentials: specConfiguration.credentials,
            value: 0,
        });
        await libraryPage.openCustomAppById({ id: 'D055C3242F5D487E951F13006A350F55' });
        await resetUserLanguage({
            credentials: specConfiguration.credentials,
        });
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
        await libraryPage.executeScript('window.localStorage.clear();');
        await loginPage.login(specConfiguration.credentials);
    });

    it('[TC90671] Validate X-Func of Discover Content on Library Web - change language', async () => {
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.searchProject('tutorial');
        await contentDiscovery.selectProject(project.name);
        await contentDiscovery.openFolderByPath(['Shared Reports', '_REGRESSION TEST_', 'Library - Content Discovery']);

        // change language
        await libraryPage.openUserAccountMenu();
        await libraryPage.openPreferencePanel();
        await userPreference.openPreferenceList('My Language');
        await userPreference.changePreference('My Language', 'Chinese (Simplified)');
        await userPreference.savePreference();
        await libraryPage.logout();
        await loginPage.login(specConfiguration.credentials);

        // after changing language, the folder status should be lost
        await since('After change language, Folder Panel show should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.isFolderExpanded('共享报表'))
            .toBe(false);
    });

    it('[TC90672] Validate X-Func of Discover Content on Library Web - onboarding tutorial', async () => {
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.searchProject('tutorial');
        await contentDiscovery.selectProject(project.name);
        await contentDiscovery.openFolderByPath(['Shared Reports', '_REGRESSION TEST_', 'Library - Content Discovery']);

        await libraryPage.openUserAccountMenu();
        await userAccount.clickAccountOption('Take a Tour');
        await onboardingTutorial.clickDock('third');
        await onboardingTutorial.clickContinueTour();
        await onboardingTutorial.clickLibraryOnboardingButton('Sidebar', 'Next');
        // explore your library will not appear
        await onboardingTutorial.clickLibraryOnboardingButton('Right Corner', 'Got It');
    });

    it('[TC90673] Validate X-Func of Discover Content on Library Web - ColorTheme', async () => {
        await libraryPage.openCustomAppById({ id: '6068D82AC32B47219C6BA28846668D81' });
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.searchProject('tutorial');
        await contentDiscovery.selectProject(project.name);
        await contentDiscovery.openFolderByPath(['Shared Reports', '_REGRESSION TEST_', 'Library - Content Discovery']);
        await takeScreenshot('TC90673', 'Color Theme', { tolerance: 0.4 });
    });

    it('[TC92112] Validate toggle button when disable toolbar and refresh page when sidebar expanded', async () => {
        // CollapseToolbarByDefault
        await libraryPage.openCustomAppById({ id: '04323963EB8B49658A31F98B83810F4C' });
        await libraryPage.expandCollapsedNavBar();
        await libraryPage.openSidebarOnly();
        await libraryPage.reload();
        await since('After reload, Toolbar present should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isNavigationBarPresent())
            .toBe(true);
        await since('After reload, Navbar expand button present should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isNavBarExpandBtnPresent())
            .toBe(false);

        // DisableToolbarAndPinToc
        await libraryPage.openCustomAppById({ id: '67C752F62E744E81B3DBED0DD17C02B9' });
        await since('For DisableToolbarAndPinToc, Toolbar present should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isNavigationBarPresent())
            .toBe(false);
        await since(
            'For DisableToolbarAndPinToc, Navbar expand button present should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.isNavBarExpandBtnPresent())
            .toBe(false);
    });
});
export const config = specConfiguration;
