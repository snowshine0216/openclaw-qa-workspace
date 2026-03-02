import { dashboardsAutoCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('25.07 panel stack padding', () => {
    const dossier = {
        id: '7D168D07074AEE3ABC30039BE5F8475D', //'A4609720DE47CFA13445708B961FD269',
        name: 'Panel stack padding',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        libraryPage,
        loginPage,
        contentsPanel,
        dossierAuthoringPage,
        dossierPage,
        toc,
        grid,
        toolbar,
        formatPanel,
        layerPanel,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(dashboardsAutoCredentials);
        await setWindowSize(browserWindow);
    });

    it('[TC99181_1] panel stack padding', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        await toolbar.createPanelStack();
        let panelStacks = await dossierAuthoringPage.getPanelStackBoxes();
        let lastPanel = panelStacks[panelStacks.length - 1];
        await takeScreenshotByElement(lastPanel, 'TC99181_1', 'Panel Stack Padding default 0');

        await layerPanel.clickOnContainerFromLayersPanel('Panel Stack 1');
        await dossierAuthoringPage.openPanelStackTitleContainerFormatPanel();
        let input = await formatPanel.getPanelStackPadding();
        let value = await input.getValue();
        await expect(value).toBe('0');

        await formatPanel.setPanelStackPaddingValue(101);
        input = await formatPanel.getPanelStackPadding();
        value = await input.getValue();
        await expect(value).toBe('100');
        panelStacks = await dossierAuthoringPage.getPanelStackBoxes();
        lastPanel = panelStacks[panelStacks.length - 1];
        await takeScreenshotByElement(lastPanel, 'TC99181_1', 'Panel Stack Padding 100');

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Padding 50' });
        await dossierAuthoringPage.hoverOnPanelStack();
        panelStacks = await dossierAuthoringPage.getPanelStackBoxes();
        lastPanel = panelStacks[panelStacks.length - 1];
        await takeScreenshotByElement(lastPanel, 'TC99181_1', 'Panel Stack Padding 50');

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Padding 0 no panel selector' });
        await dossierAuthoringPage.hoverOnPanelStack();
        panelStacks = await dossierAuthoringPage.getPanelStackBoxes();
        lastPanel = panelStacks[panelStacks.length - 1];
        await takeScreenshotByElement(lastPanel, 'TC99181_1', 'Panel Stack Padding 0 no panel selector');

        // once click viz, the context menu for panel stack should not be displayed
        await lastPanel.click();
        const PanelStackLeftArrowExisted = await dossierAuthoringPage.getPanelStackLeftArrow().isExisting();
        await expect(PanelStackLeftArrowExisted).toBe(false);
        panelStacks = await dossierAuthoringPage.getPanelStackBoxes();
        lastPanel = panelStacks[panelStacks.length - 1];
        await takeScreenshotByElement(lastPanel, 'TC99181_1', 'Click on viz to dismiss panel stack context menu');

        // maximize
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Padding 0 no panel selector 2 viz',
        });
        await dossierAuthoringPage.hoverOnVisualizationByLabel();
        panelStacks = await dossierAuthoringPage.getPanelStackBoxes();
        lastPanel = panelStacks[panelStacks.length - 1];
        await takeScreenshotByElement(lastPanel, 'TC99181_1', '2 context menu showed');

        await dossierAuthoringPage.clickVisualizationByLabel();
        await expect(PanelStackLeftArrowExisted).toBe(false);
        await dossierAuthoringPage.clickMaxRestoreBtn();
        await takeScreenshotByElement(lastPanel, 'TC99181_1', 'Maximized Panel Stack Padding 0');

        await dossierAuthoringPage.hoverOnVisualizationByLabel('Visualization 3');
        await dossierAuthoringPage.hoverOnVisualizationByLabel('Visualization 1 copy');
        await takeScreenshotByElement(lastPanel, 'TC99181_1', 'Hover on Panel Stack viz context menu');
        await dossierAuthoringPage.goToLibrary();
        await dossierAuthoringPage.notSaveDossier();
    });

    it('[TC99181_2] info window padding', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        await toolbar.createInfoWindow();
        let panelStacks = await dossierAuthoringPage.getPanelStackBoxes();
        let lastPanel = panelStacks[panelStacks.length - 1];
        await takeScreenshotByElement(lastPanel, 'TC99181_2', 'Info window padding default 10');

        await dossierAuthoringPage.openInfoWindowContainerFormatPanel();
        let input = await formatPanel.getPanelStackPadding();
        let value = await input.getValue();
        await expect(value).toBe('10');

        await formatPanel.setPanelStackPaddingValue(101);
        input = await formatPanel.getPanelStackPadding();
        value = await input.getValue();
        await expect(value).toBe('100');
        panelStacks = await dossierAuthoringPage.getPanelStackBoxes();
        lastPanel = panelStacks[panelStacks.length - 1];
        await takeScreenshotByElement(lastPanel, 'TC99181_2', 'Info window Padding 100');

        await formatPanel.setPanelStackPaddingValue(-1);
        input = await formatPanel.getPanelStackPadding();
        value = await input.getValue();
        await expect(value).toBe('0');
        panelStacks = await dossierAuthoringPage.getPanelStackBoxes();
        lastPanel = panelStacks[panelStacks.length - 1];
        await takeScreenshotByElement(lastPanel, 'TC99181_2', 'Info window Padding 0');
        await dossierAuthoringPage.goToLibrary();
        await dossierAuthoringPage.notSaveDossier();
    });

    it('[TC99181_3] panel stack padding consumption', async () => {
        await resetDossierState({
            credentials: dashboardsAutoCredentials,
            dossier,
        });
        await libraryPage.openDossier(dossier.name);

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Padding 50' });
        await dossierAuthoringPage.hoverOnPanelStack();
        let panelStacks = await dossierAuthoringPage.getPanelStackBoxes();
        let lastPanel = panelStacks[panelStacks.length - 1];
        await takeScreenshotByElement(lastPanel, 'TC99181_3', 'Panel Stack Padding 50');

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Padding 0 no panel selector' });
        await dossierAuthoringPage.hoverOnPanelStack();
        panelStacks = await dossierAuthoringPage.getPanelStackBoxes();
        lastPanel = panelStacks[panelStacks.length - 1];
        await takeScreenshotByElement(lastPanel, 'TC99181_3', 'Panel Stack Padding 0 no panel selector');

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Info window Padding 50' });
        await grid.selectGridElement({
            title: 'Info window',
            headerName: 'Airline Name',
            elementName: 'Comair Inc.',
        });
        await dossierPage.waitForInfoWindowLoading();
        panelStacks = await dossierAuthoringPage.getPanelStackBoxes();
        lastPanel = panelStacks[panelStacks.length - 1];
        await takeScreenshotByElement(lastPanel, 'TC99181_3', 'Info window padding 50');
    });
});
