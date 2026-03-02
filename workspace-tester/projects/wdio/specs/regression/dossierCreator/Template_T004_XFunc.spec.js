import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import * as template from '../../../constants/template.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { mockSearchServiceNotReady } from '../../../api/mock/mock-response-utils.js';

describe('Test Template XFunc', () => {
    let {
        loginPage,
        libraryPage,
        dossierCreator,
        dossierAuthoringPage,
        visualizationPanel,
        toolbar,
        inCanvasSelector,
    } = browsers.pageObj1;

    const templateUser = template.templateUser;
    const tutorialProject = template.TutorialProject;
    const userTemplate = template.dashboard_UserTemplate.name;
    const defaultTemplate = template.dashboard_DefaultTemplate.name;
    const vizTitle = 'Visualization 1';

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(templateUser);
    });

    beforeEach(async () => {
        await dossierCreator.resetLocalStorage();
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await libraryPage.openDefaultApp();
        await logoutFromCurrentBrowser();
    });

    it('[TC82908_01] test page actions', async () => {
        await dossierCreator.createNewDossier();
        await dossierCreator.switchProjectByName(tutorialProject);
        await dossierCreator.switchTabViewer('Select Template');
        await dossierCreator.selectTemplate(userTemplate);
        await dossierCreator.clickCreateButton();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await dossierAuthoringPage.togglePanelBar.togglePanel('dataset');
        await visualizationPanel.selectCopyToOnVisualizationMenu({ vizTitle });
        await takeScreenshotByElement(dossierAuthoringPage.getTocPanel(), 'TC82908_01_01', 'copy to new page');
        await takeScreenshotByElement(visualizationPanel.getVIDoclayout(), 'TC82908_01_02', 'copy KPI to new page');
        await toolbar.clickButtonFromToolbar('Undo');
        await toolbar.waitForElementInvisible(dossierAuthoringPage.getMojoLoadingIndicator());
        await takeScreenshotByElement(dossierAuthoringPage.getTocPanel(), 'TC82908_01_03', 'undo copy to');
        await toolbar.clickButtonFromToolbar('Redo');
        await toolbar.waitForElementInvisible(dossierAuthoringPage.getMojoLoadingIndicator());
        await takeScreenshotByElement(dossierAuthoringPage.getTocPanel(), 'TC82908_01_04', 'redo copy to');
        await visualizationPanel.selectDeleteOnVisualizationMenu(vizTitle);
        await takeScreenshotByElement(visualizationPanel.getVIDoclayout(), 'TC82908_01_05', 'delete viz');
    });

    it('[TC82908_02] test selector when create from template', async () => {
        const checkboxSelectorKey = 'W96B00F8C7BE4495B875E9C4CC8DD1D66';
        await dossierCreator.createNewDossier();
        await dossierCreator.switchProjectByName(tutorialProject);
        await dossierCreator.switchTabViewer('Select Template');
        await dossierCreator.selectTemplate(template.dashboard_Template_FilterSelector.name);
        await dossierCreator.clickCreateButton();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await inCanvasSelector.waitForElementVisible(inCanvasSelector.getIncanvasSelectorByKey(checkboxSelectorKey));
        await inCanvasSelector.selectItemByKey(checkboxSelectorKey, 'Books');
        await inCanvasSelector.sleep(2000); // wait for KPI annimation finished
        await takeScreenshotByElement(visualizationPanel.getVIDoclayout(), 'TC82908_02', 'change selector');
    });

    // DE253090: create dossier when quick search not ready
    it('[TC82908_03] search service is not ready', async () => {
        await mockSearchServiceNotReady();
        await dossierCreator.createNewDossier();
        await dossierCreator.waitForElementVisible(dossierCreator.getErrorContainer());
        await takeScreenshotByElement(
            dossierCreator.getCreateNewDossierPanel(),
            'TC82908_03',
            'search service not ready'
        );
    });

    // DE262466 [Template] Check two dataset, switch tab, the first selection disappears
    it('[TC82908_04] select multiple dataset', async () => {
        await dossierCreator.createNewDossier();
        await dossierCreator.switchProjectByName(tutorialProject);
        await dossierCreator.clickDatasetCheckbox(['Airline Data', 'Articles Sample']);
        await dossierCreator.searchData('IC');
        await dossierCreator.clearSearchData();
        await dossierCreator.toggleCertifiedOnlyForData();
        await dossierCreator.sortDataByHeaderName('Date Created');
        await takeScreenshotByElement(
            dossierCreator.getCreateNewDossierPanel(),
            'TC82908_04_01',
            'select multiple datasets'
        );
        await dossierCreator.switchToReportTab();
        await dossierCreator.toggleCertifiedOnlyForData();
        await dossierCreator.clickDatasetCheckbox(['01 Basic Report', 'certify report']);
        await dossierCreator.searchData('Report');
        await dossierCreator.clearSearchData();
        await takeScreenshotByElement(
            dossierCreator.getCreateNewDossierPanel(),
            'TC82908_04_02',
            'select multiple reports'
        );
    });

    // DE258922 [Template] Open dossier creator breaks Library menu styling
    it('[TC82908_05] check library menu styling', async () => {
        await dossierCreator.createNewDossier();
        await dossierCreator.closeNewDossierPanel();
        await libraryPage.openDossierContextMenu(defaultTemplate);
        await libraryPage.hover({ elem: libraryPage.getDossierContextMenuItem('Open') });
        await takeScreenshotByElement(libraryPage.getDossierContextMenu(), 'TC82908_05', 'check library menu styling');
    });
});
