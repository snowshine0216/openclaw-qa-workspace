import { dashboardsAutoCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('25.09 radius', () => {
    const dossier = {
        id: 'EED0D836794A24C67AA5BAB9CC4081E3',
        name: 'Auto_Radius',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        width: 1920,
        height: 1080,
    };

    let { libraryPage, loginPage, contentsPanel, dossierAuthoringPage, baseVisualization, toolbar, formatPanel } =
        browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(dashboardsAutoCredentials);
        await setWindowSize(browserWindow);
    });

    it('[TC99538_1] radius text box default value and change', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });

        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await formatPanel.openVizFormatPanel();
        let input = await formatPanel.getRadiusTextboxValue();
        let value = await input.getValue();
        await expect(value).toBe('2');

        const radiusSection = await $(
            '//span[text()="Radius"]/ancestor::div[contains(@class,"container-radius-section")]'
        );
        await takeScreenshotByElement(radiusSection, 'TC99538_1', 'Radius componment defualt value');

        const sliderHandle = await $('//span[text()="Radius"]/ancestor::li//div[contains(@class,"ant-slider-handle")]');
        await sliderHandle.dragAndDrop({ x: 50, y: 0 });
        await browser.pause(1000);
        await takeScreenshotByElement(radiusSection, 'TC99538_1', 'Slide slider right');
        let allPanels = await dossierAuthoringPage.getAllPanels();
        let currentPanel = allPanels[allPanels.length - 1];
        await takeScreenshotByElement(currentPanel, 'TC99538_1', 'Grids with Radius 26');

        await sliderHandle.dragAndDrop({ x: -30, y: 0 });
        await browser.pause(1000);
        await takeScreenshotByElement(radiusSection, 'TC99538_1', 'Slide slider left');
        await takeScreenshotByElement(currentPanel, 'TC99538_1', 'Grids with Radius 12');

        await formatPanel.setRadiusValue(41);
        input = await formatPanel.getRadiusTextboxValue();
        value = await input.getValue();
        await expect(value).toBe('40');
        await takeScreenshotByElement(radiusSection, 'TC99538_1', 'Max 40');

        await formatPanel.setRadiusValue(-1);
        await takeScreenshotByElement(radiusSection, 'TC99538_1', 'Min 0');

        await toolbar.clickButtonFromToolbar('Undo');
        input = await formatPanel.getRadiusTextboxValue();
        value = await input.getValue();
        await expect(value).toBe('40');

        await toolbar.clickButtonFromToolbar('Redo');
        input = await formatPanel.getRadiusTextboxValue();
        value = await input.getValue();
        await expect(value).toBe('0');
    });

    it('[TC99538_2] Insight + grids', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Insight +' });
        await baseVisualization.clickVisualizationTitle('Linear Trend Line Chart');
        await formatPanel.openTitleContainerFormatPanel();
        let input = await formatPanel.getRadiusTextboxValue();
        let value = await input.getValue();
        await expect(value).toBe('33');

        await baseVisualization.clickVisualizationTitle('Forecast Line Chart');
        await formatPanel.openTitleContainerFormatPanel();
        input = await formatPanel.getRadiusTextboxValue();
        value = await input.getValue();
        await expect(value).toBe('10');

        await baseVisualization.clickVisualizationTitle('Key Driver');
        await formatPanel.openTitleContainerFormatPanel();
        input = await formatPanel.getRadiusTextboxValue();
        value = await input.getValue();
        await expect(value).toBe('11');
        let allPanels = await dossierAuthoringPage.getAllPanels();
        let currentPanel = allPanels[allPanels.length - 1];
        await takeScreenshotByElement(currentPanel, 'TC99538_2', 'Insights with Radius 33 10 11');

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Grid' });
        await baseVisualization.clickVisualizationTitle('Visualization 1');
        await formatPanel.openTitleContainerFormatPanel();
        input = await formatPanel.getRadiusTextboxValue();
        value = await input.getValue();
        await expect(value).toBe('40');

        await baseVisualization.clickVisualizationTitle('Visualization 2');
        await formatPanel.openTitleContainerFormatPanel();
        input = await formatPanel.getRadiusTextboxValue();
        value = await input.getValue();
        await expect(value).toBe('25');

        await baseVisualization.clickVisualizationTitle('Visualization 3');
        await formatPanel.openTitleContainerFormatPanel();
        input = await formatPanel.getRadiusTextboxValue();
        value = await input.getValue();
        await expect(value).toBe('0');
        allPanels = await dossierAuthoringPage.getAllPanels();
        currentPanel = allPanels[allPanels.length - 1];
        await takeScreenshotByElement(currentPanel, 'TC99538_2', 'Grids with Radius 0 25 40');
    });

    it('[TC99538_3] KPI Line Bar and Pie', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'KPI' });
        await baseVisualization.clickVisualizationTitle('Normal KPI');
        await formatPanel.openTitleContainerFormatPanel();
        let input = await formatPanel.getRadiusTextboxValue();
        let value = await input.getValue();
        await expect(value).toBe('34');

        await baseVisualization.clickVisualizationTitle('Comparison KPI');
        await formatPanel.openTitleContainerFormatPanel();
        input = await formatPanel.getRadiusTextboxValue();
        value = await input.getValue();
        await expect(value).toBe('40');

        await baseVisualization.clickVisualizationTitle('Mult-Metric KPI');
        await formatPanel.openTitleContainerFormatPanel();
        input = await formatPanel.getRadiusTextboxValue();
        value = await input.getValue();
        await expect(value).toBe('11');

        await baseVisualization.clickVisualizationTitle('Guage');
        await formatPanel.openTitleContainerFormatPanel();
        input = await formatPanel.getRadiusTextboxValue();
        value = await input.getValue();
        await expect(value).toBe('2');
        let allPanels = await dossierAuthoringPage.getAllPanels();
        let currentPanel = allPanels[allPanels.length - 1];
        await takeScreenshotByElement(currentPanel, 'TC99538_2', 'KPIs with Radius 34 40 11 2');

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Line and bar, Pie' });
        await baseVisualization.clickVisualizationTitle('Visualization 1');
        await formatPanel.openTitleContainerFormatPanel();
        input = await formatPanel.getRadiusTextboxValue();
        value = await input.getValue();
        await expect(value).toBe('31');

        await baseVisualization.clickVisualizationTitle('Visualization 2');
        await formatPanel.openTitleContainerFormatPanel();
        input = await formatPanel.getRadiusTextboxValue();
        value = await input.getValue();
        await expect(value).toBe('39');

        await baseVisualization.clickVisualizationTitle('Pie chart');
        await formatPanel.openTitleContainerFormatPanel();
        input = await formatPanel.getRadiusTextboxValue();
        value = await input.getValue();
        await expect(value).toBe('23');

        await baseVisualization.clickVisualizationTitle('Ring chart');
        await formatPanel.openTitleContainerFormatPanel();
        input = await formatPanel.getRadiusTextboxValue();
        value = await input.getValue();
        await expect(value).toBe('2');
        allPanels = await dossierAuthoringPage.getAllPanels();
        currentPanel = allPanels[allPanels.length - 1];
        await takeScreenshotByElement(currentPanel, 'TC99538_3', 'Line Bar and Pies with Radius 31 39 23 2');
    });

    it('[TC99538_4] Mapbox map and Auto layout Fields', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Mapbox and Map' });
        await baseVisualization.clickVisualizationTitle('Mapbox');
        await formatPanel.openTitleContainerFormatPanel();
        let input = await formatPanel.getRadiusTextboxValue();
        let value = await input.getValue();
        await expect(value).toBe('24');

        await baseVisualization.clickVisualizationTitle('Map2');
        await formatPanel.openTitleContainerFormatPanel();
        input = await formatPanel.getRadiusTextboxValue();
        value = await input.getValue();
        await expect(value).toBe('31');

        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Auto layout - Fields' });
        const filter = await $('[aria-label="Month"]');
        await filter.click();
        await formatPanel.openTitleContainerFormatPanel();
        input = await formatPanel.getRadiusTextboxValue();
        value = await input.getValue();
        await expect(value).toBe('20');
        let freeformLayoutPage = await dossierAuthoringPage.getFreeformLayoutPage();
        await takeScreenshotByElement(freeformLayoutPage, 'TC99538_4', 'Mapbox map and Auto layout Fields with radius');
    });

    it('[TC99538_5] Custom viz and more', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'More: Sankey and Time series' });
        await baseVisualization.clickVisualizationTitle('Time Series');
        await formatPanel.openTitleContainerFormatPanel();
        let input = await formatPanel.getRadiusTextboxValue();
        let value = await input.getValue();
        await expect(value).toBe('35');

        await baseVisualization.clickVisualizationTitle('Waterfall');
        await formatPanel.openTitleContainerFormatPanel();
        input = await formatPanel.getRadiusTextboxValue();
        value = await input.getValue();
        await expect(value).toBe('31');

        await baseVisualization.clickVisualizationTitle('Bubble chart');
        await formatPanel.openTitleContainerFormatPanel();
        input = await formatPanel.getRadiusTextboxValue();
        value = await input.getValue();
        await expect(value).toBe('27');

        await baseVisualization.clickVisualizationTitle('Box plot');
        await formatPanel.openTitleContainerFormatPanel();
        input = await formatPanel.getRadiusTextboxValue();
        value = await input.getValue();
        await expect(value).toBe('2');

        await baseVisualization.clickVisualizationTitle('Sankey Diagram');
        await formatPanel.openTitleContainerFormatPanel();
        input = await formatPanel.getRadiusTextboxValue();
        value = await input.getValue();
        await expect(value).toBe('34');

        await baseVisualization.clickVisualizationTitle('Heat Map');
        await formatPanel.openTitleContainerFormatPanel();
        input = await formatPanel.getRadiusTextboxValue();
        value = await input.getValue();
        await expect(value).toBe('28');

        await baseVisualization.clickVisualizationTitle('Network');
        await formatPanel.openTitleContainerFormatPanel();
        input = await formatPanel.getRadiusTextboxValue();
        value = await input.getValue();
        await expect(value).toBe('34');

        await baseVisualization.clickVisualizationTitle('Histogram');
        await formatPanel.openTitleContainerFormatPanel();
        input = await formatPanel.getRadiusTextboxValue();
        value = await input.getValue();
        await expect(value).toBe('0');
        let allPanels = await dossierAuthoringPage.getAllPanels();
        let currentPanel = allPanels[allPanels.length - 1];
        await takeScreenshotByElement(currentPanel, 'TC99538_5', 'Custom viz and more with radius');
    });
});
