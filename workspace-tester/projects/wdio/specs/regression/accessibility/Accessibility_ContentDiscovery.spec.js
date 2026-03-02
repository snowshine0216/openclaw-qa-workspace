import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { getAttributeValue, getAccAtributesOfElement } from '../../../utils/getAttributeValue.js';

const specConfiguration = { ...customCredentials('_acc') };

describe('Accessibility for Content Discovery', () => {
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

    let { libraryPage, sidebar, contentDiscovery, loginPage, listView } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await libraryPage.openCustomAppById({ id: 'D055C3242F5D487E951F13006A350F55' });
    });

    afterEach(async () => {
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
        await libraryPage.executeScript('window.localStorage.clear();');
        await loginPage.login(specConfiguration.credentials);
    });

    it('[TC88672] Validate accessibility of Discover Content with VoiceOver and JAWS', async () => {
        // open content discovery
        await libraryPage.openSidebarOnly();
        await libraryPage.tabToElement(sidebar.getPredefinedSectionItem('Content Discovery'));
        await libraryPage.enter();
        await libraryPage.sleep(2000); // wait for animation
        await libraryPage.waitForDynamicElementLoading();
        await libraryPage.waitForElementVisible(contentDiscovery.getFolderItem('Shared Reports'));
        const folderPanelList = `button,Close,0
combobox,MicroStrategy Tutorial,0`;
        await since(
            'Role, arialabel, tabindex for folder panel is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(
                await getAccAtributesOfElement(await contentDiscovery.getFolderPanel(), [
                    'role',
                    'ariaLabel',
                    'tabIndex',
                ])
            )
            .toEqual(folderPanelList);
        await contentDiscovery.tab();
        await contentDiscovery.tab();
        await contentDiscovery.enter();
        await contentDiscovery.waitForElementStaleness(contentDiscovery.getLoadingSpinner());
        await contentDiscovery.waitForElementStaleness(contentDiscovery.getLoadingRow());
        await since('is Shared Reports folder opened in folder panel should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.isFolderExpanded('Shared Reports'))
            .toBe(true);
        await contentDiscovery.navigateDownWithArrow();
        await contentDiscovery.navigateRightWithArrow();
        await takeScreenshotByElement(contentDiscovery.getFolderItem('_Automation_'), 'TC88672', '_Automation_', {
            tolerance: 0.4,
        });
        await contentDiscovery.navigateUpWithArrow();
        await contentDiscovery.navigateLeftWithArrow();
        await since(
            'After press left arrow, is shared reports folder opened in folder panel should be #{expected}, instead we have #{actual}'
        )
            .expect(await contentDiscovery.isFolderExpanded('Shared Reports'))
            .toBe(false);
        await contentDiscovery.tab();
        const folderPathList = `button,null,0`;
        await since(
            'Role, arialabel, tabindex for foldern path is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(
                await getAccAtributesOfElement(await contentDiscovery.getFolderPath(), [
                    'role',
                    'ariaLabel',
                    'tabIndex',
                ])
            )
            .toEqual(folderPathList);
        await contentDiscovery.tab();
        await contentDiscovery.space();
        await since(
            'After press space, is AllSelectionCheckbox checked in content list should be #{expected}, instead we have #{actual}'
        )
            .expect(await listView.isAllSelectionCheckboxChecked())
            .toBe(true);
    });
});
