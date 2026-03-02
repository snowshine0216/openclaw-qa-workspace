import { browserWindowCustom } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import * as consts from '../../../constants/visualizations.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('Limit Element Source', () => {
    const testObjectInfo = {
        project: {
            id: '235853DC4B79DABCE8C6FFB26B7D8DC3',
            name: 'MicroStrategy Tutorial Project',
        },
        allViz: {
            id: '33BB0E5F49D88DF3E583C2B3C6FBBF3A',
            name: 'AllViz_CSPCompliant_23.12_ABA',
        },
        testName: 'LibraryVisualizationSanity',
    };

    const datasetName = "airline-sample-data.xls";
    const itemNameMonth = "Month";
    const itemNameYear = "Year";
    const allCheckboxText = "(All)";

    let {
        authoringFilters,
        datasetsPanel,
        dossierAuthoringPage,
        dossierEditorUtility,
        dossierPage,
        filterPanel,
        grid,
        libraryAuthoringPage,
        libraryPage,
        limitElementSource,
        linkAttributes,
        loginPage,
        toc,
        tocMenu,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(consts.analystUser.credentials);
        await setWindowSize(browserWindowCustom);
        await browser.execute(() => {
            localStorage.setItem('dontShowAIAssistantTooltip', '{"ts":-1,"data":true}');
        });
    });

    afterAll(async () => {
        await dossierPage.goToLibrary();
        await browser.execute(() => {
            localStorage.removeItem('dontShowAIAssistantTooltip');
        });
    });

    it("[TC94204_0] Create Dashboard with two datasets", async () => {
        await libraryAuthoringPage.createDossierFromLibrary();
        await dossierAuthoringPage.addNewSampleData(0);
        await dossierAuthoringPage.addNewSampleData(6);
        await linkAttributes.linkToOtherDataset(datasetName, itemNameMonth, itemNameMonth);
    });

    it("fill grid and check Chapter 1", async () => {
        await datasetsPanel.addDatasetElementToVisualization(itemNameMonth);
        await datasetsPanel.addDatasetElementToVisualization('Avg Delay (min)');
        await datasetsPanel.addDatasetElementToVisualization('Revenue');
        await takeScreenshotByElement(await dossierEditorUtility.getVIVizPanel(), 'TC94204', 'Month linked, not filtered');
    });

    it("[TC94204_1] Add an attribute to the filter panel", async () => {
        await authoringFilters.addFilterToFilterPanel(itemNameMonth);
        await authoringFilters.selectFilterPanelFilterCheckboxOption(itemNameMonth, allCheckboxText);
        await authoringFilters.selectFilterPanelFilterCheckboxOption(itemNameMonth, 'January');
    });

    it("[TC94204_2] Set the filter's datasource as dataset 1", async () => {
        await limitElementSource.selectElementSource(itemNameMonth, datasetName);
        await authoringFilters.waitLoadingDataPopUpIsNotDisplayed();
        since("January checkbox should exist, instead it doesn't")
            .expect(await authoringFilters.getAttributeMetricFilterCheckbox("January").isDisplayed())
            .toBe(true);
        since("Jan checkbox shouldn't exist, instead it does")
            .expect(await authoringFilters.getAttributeMetricFilterCheckbox("Jan").isDisplayed())
            .toBe(false);
        await takeScreenshotByElement(await dossierEditorUtility.getVIVizPanel(), 'TC94204', 'Month linked, filtered, limited to "airline-sample-data.xls" source');
    });

    it("[TC94204_3] In the second chapter add a different attribute to the filter panel", async () => {
        await tocMenu.createNewChapter();
        await dossierAuthoringPage.addNewSampleData(7, [{ name: itemNameYear, type: 'Text' }]);
        await linkAttributes.linkToOtherDataset(datasetName, itemNameYear, itemNameYear);
        await authoringFilters.addFilterToFilterPanel(itemNameYear);
    });

    it("fill grid and check Chapter 2", async () => {
        await datasetsPanel.addDatasetElementToVisualization(itemNameYear);
        await datasetsPanel.addDatasetElementToVisualization('Avg Delay (min)');
        await datasetsPanel.addDatasetElementToVisualization('From Coal');
        await takeScreenshotByElement(await dossierEditorUtility.getVIVizPanel(), 'TC94204', 'Year linked');
    });

    it("[TC94204_4] Move the filter to the canvas", async () => {
        await authoringFilters.moveFilterToCanvas(itemNameYear, 'Visualization 1');
    });

    it("[TC94204_5] Set the filter's datasource as dataset 2", async () => {
        await limitElementSource.selectElementSourceInFilterInCanvas(itemNameYear, datasetName);
        await authoringFilters.selectFilterPanelFilterCheckboxOption(itemNameYear, allCheckboxText);
        await authoringFilters.selectFilterPanelFilterCheckboxOption(itemNameYear, '2009');
        since("2009 checkbox should exist, instead it doesn't")
            .expect(await authoringFilters.getAttributeMetricFilterCheckbox("2009").isDisplayed())
            .toBe(true);
        since("2000 checkbox shouldn't exist, instead it does")
            .expect(await authoringFilters.getAttributeMetricFilterCheckbox("2000").isDisplayed())
            .toBe(false);
        await takeScreenshotByElement(await dossierEditorUtility.getVIVizPanel(), 'TC94204', 'Year linked, filtered, limited to "airline-sample-data.xls" source');
    });

    it("[TC94204_6] Save the dashboard", async () => {
        await libraryAuthoringPage.saveDashboard('TC94204');
        await libraryAuthoringPage.goToHome();
    });

    it("[TC94204_7] Open saved dashboard in consumption mode and check that the data source is limited to the dataset 1 on Chapter 1", async () => {
        await libraryPage.openDossier('TC94204');
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1' });
        await toc.waitForCurtainDisappear();
        await takeScreenshotByElement(await grid.getContainerByTitleInCurrentPage('Visualization 1'), 'TC94204', 'Month linked, filtered, consumption');
        await filterPanel.openFilterPanel();
        await takeScreenshotByElement(await filterPanel.getFilterMainPanel(), 'TC94204', 'Filter Chapter 1 Consumption');
        await filterPanel.closeFilterPanel();
    });

    it("[TC94204_8] Check that the data source is limited to the dataset 2 on Chapter 2", async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2' });
        await toc.waitForCurtainDisappear();
        await takeScreenshotByElement(await grid.getContainerByTitleInCurrentPage('Visualization 1'), 'TC94204', 'Year linked, filtered, consumption');
        await takeScreenshotByElement(await authoringFilters.getInCanvasFilterContainer(itemNameYear), 'TC94204', 'Filter Chapter 2 Consumption');
    });
});
