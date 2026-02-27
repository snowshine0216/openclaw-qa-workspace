import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import * as gridConstants from '../../../constants/grid.js';
import Common from '../../../pageObjects/authoring/Common.js';
import AgGridVisualization from '../../../pageObjects/agGrid/AgGridVisualization.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_sort') };
const { credentials } = specConfiguration;

//npm run regression -- --baseUrl=https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --spec 'specs/regression/classicGrid/NormalGrid_E2E.spec.js'
describe('Normal Grid Data Source E2E workflows', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    const common = new Common();

    afterEach(async () => {});

    let {
        libraryPage,
        microchartConfigDialog,
        vizPanelForGrid,
        datasetPanel,
        contentsPanel,
        editorPanel,
        editorPanelForGrid,
        agGridVisualization,
        loginPage,
    } = browsers.pageObj1;

    async function isDatasetSelectedforVisualization(datasetName, visualizationName) {
        const selectedSource = await vizPanelForGrid.getDataSourceOption(visualizationName, datasetName);
        const isSelected = await common.hasClass(selectedSource, 'on');
        await vizPanelForGrid.clickOnContainerTitle(visualizationName);
        return isSelected;
    }

    async function isDatasetSelectedforVisualizationColumnSet(visualizationName, columnSet, datasetName) {
        const selectedSource = await vizPanelForGrid.getDataSourceOptionForCompoundOrAg(
            visualizationName,
            columnSet,
            datasetName
        );
        const isSelected = await common.hasClass(selectedSource, 'on');
        await vizPanelForGrid.clickOnContainerTitle(visualizationName);
        return isSelected;
    }

    async function addObjectToVisualization(objectName, objectType, datasetName, section, columnSet) {
        await vizPanelForGrid.scrollToElementInDatasetPanel(objectName, objectType, datasetName);
        await datasetPanel.addObjectToVizByDoubleClick(objectName, objectType, datasetName);
        await since(`The editor panel should have "${objectType}" named "${objectName}" on "${section}" section`)
            .expect(await editorPanelForGrid.getObjectFromSectionSansType(objectName, section).isDisplayed())
            .toBe(true);
    }

    async function dragObjectToColumnSet(objectName, objectType, datasetName, columnSet) {
        await vizPanelForGrid.scrollToElementInDatasetPanel(objectName, objectType, datasetName);
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ(objectName, objectType, datasetName, columnSet);
    }

    async function dragObjectToColumnSetWithPosition(
        objectName,
        objectType,
        datasetName,
        columnSet,
        position,
        reference
    ) {
        await vizPanelForGrid.scrollToElementInDatasetPanel(objectName, objectType, datasetName);
        await vizPanelForGrid.dragDSObjectToColumnSetDZwithPosition(
            objectName,
            objectType,
            datasetName,
            columnSet,
            position,
            reference
        );
    }

    async function addMicrochartToVisualization(vizName, metricName, attributeName, microchartName) {
        await agGridVisualization.addMicrochartSet(vizName);
        await microchartConfigDialog.selectObject(1, metricName);
        await microchartConfigDialog.selectObject(2, attributeName);
        await browser.pause(1000);

        await microchartConfigDialog.confirmDialog();
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC64466_3',
            'Editor Panel with Microcharts in order: "Sparkline" named "' +
                metricName +
                ' Trend by ' +
                attributeName +
                '"'
        );
    }

    async function changeDataSourceForColumnSet(vizName, columnSet, datasetName) {
        await vizPanelForGrid.clickOnContainerTitle(vizName);
        await vizPanelForGrid.setDataSourceForCompoundOrAg(vizName, columnSet, datasetName);
    }

    it('[TC64466_1] Test Datasource with a normal grid', async () => {
        // Wait for the Dossier Editor to be fully loaded
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.Grid_Data_Source.project.id,
            dossierId: gridConstants.Grid_Data_Source.id,
        });

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });

        await vizPanelForGrid.clickOnContainerTitle('Visualization 1');

        await editorPanel.switchToEditorPanel();
        // 1. Simple grid
        await since('the Data Source "None" is selected for grid visualization "Visualization 1"')
            .expect(await isDatasetSelectedforVisualization('None', 'Visualization 1'))
            .toBe(true);

        // 1.1 Drag from dataset 1
        await datasetPanel.addObjectToVizByDoubleClick('Airline Name', 'attribute', 'Airline Sample Dataset');
        await since('The editor panel should have "attribute" named "Airline Name" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Airline Name', 'Rows').isDisplayed())
            .toBe(true);
        await since('the Data Source "Airline Sample Dataset" is selected for grid visualization "Visualization 1"')
            .expect(await isDatasetSelectedforVisualization('Airline Sample Dataset', 'Visualization 1'))
            .toBe(true);

        // 1.2 Drag from dataset 2
        await datasetPanel.addObjectToVizByDoubleClick('Month', 'attribute', 'Retail Sample Dataset');
        await since('The editor panel should have "attribute" named "Month" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Month', 'Rows').isDisplayed())
            .toBe(true);
        await since('the Data Source "Airline Sample Dataset" is selected for grid visualization "Visualization 1"')
            .expect(await isDatasetSelectedforVisualization('Airline Sample Dataset', 'Visualization 1'))
            .toBe(true);

        // 1.3 Drag from dataset 3
        await datasetPanel.addObjectToVizByDoubleClick('Category', 'attribute', 'Report_01_Simple');
        await since('The editor panel should have "attribute" named "Category" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Category', 'Rows').isDisplayed())
            .toBe(true);
        await since('the Data Source "Airline Sample Dataset" is selected for grid visualization "Visualization 1"')
            .expect(await isDatasetSelectedforVisualization('Airline Sample Dataset', 'Visualization 1'))
            .toBe(true);

        // Click on titlebar or drag icon for container
        await vizPanelForGrid.clickOnContainerTitle('Visualization 1');
        await browser.pause(3000);

        // 1.4 Change data source
        await vizPanelForGrid.openContextMenu('Visualization 1');
        await vizPanelForGrid.selectContextMenuOption('Data Source');
        await vizPanelForGrid.selectSecondaryContextMenuOption('Retail Sample Dataset');

        await since('the Data Source "Retail Sample Dataset" is selected for grid visualization "Visualization 1"')
            .expect(await isDatasetSelectedforVisualization('Retail Sample Dataset', 'Visualization 1'))
            .toBe(true);

        // 1.5 Drag metric from dataset 1
        await datasetPanel.addObjectToVizByDoubleClick('Number of Flights', 'metric', 'Airline Sample Dataset');
        await since('The editor panel should have "metric" named "Number of Flights" on "Metrics" section')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Number of Flights', 'Metrics').isDisplayed())
            .toBe(true);
        await since('the Data Source "Retail Sample Dataset" is selected for grid visualization "Visualization 1"')
            .expect(await isDatasetSelectedforVisualization('Retail Sample Dataset', 'Visualization 1'))
            .toBe(true);
    });

    it('[TC64466_2] Test Datasource with a Compound grid', async () => {
        // Wait for the Dossier Editor to be fully loaded
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.Grid_Data_Source.project.id,
            dossierId: gridConstants.Grid_Data_Source.id,
        });
        // 2. Compound grid
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 2' });

        await editorPanel.switchToEditorPanel();
        // 2.1 Drag from dataset 1
        await datasetPanel.addObjectToVizByDoubleClick('Airline Name', 'attribute', 'Airline Sample Dataset');
        await since('The editor panel should have "attribute" named "Airline Name" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Airline Name', 'Rows').isDisplayed())
            .toBe(true);

        await since(
            'the Data Source "Airline Sample Dataset" for column set "Column Set 1" is selected for complex grid visualization "Visualization 1"'
        )
            .expect(
                await isDatasetSelectedforVisualizationColumnSet(
                    'Visualization 1',
                    'Column Set 1',
                    'Airline Sample Dataset'
                )
            )
            .toBe(true);

        // 2.2 Drag from dataset 2
        await datasetPanel.addObjectToVizByDoubleClick('City', 'attribute', 'Retail Sample Dataset');
        await since('The editor panel should have "attribute" named "City" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('City', 'Rows').isDisplayed())
            .toBe(true);
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ(
            'Revenue',
            'metric',
            'Retail Sample Dataset',
            'Column Set 1'
        );
        await since(
            'the Data Source "Airline Sample Dataset" for column set "Column Set 1" is selected for complex grid visualization "Visualization 1"'
        )
            .expect(
                await isDatasetSelectedforVisualizationColumnSet(
                    'Visualization 1',
                    'Column Set 1',
                    'Airline Sample Dataset'
                )
            )
            .toBe(true);

        // 2.3 Drag from dataset 3
        await vizPanelForGrid.addColumnSet('Visualization 1');

        await vizPanelForGrid.scrollToElementInDatasetPanel('Year', 'attribute', 'Report_01_Simple');
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ('Year', 'attribute', 'Report_01_Simple', 'Column Set 2');
        await vizPanelForGrid.scrollToElementInDatasetPanel('Cost', 'metric', 'Report_01_Simple');
        await vizPanelForGrid.dragDSObjectToColumnSetDZwithPosition(
            'Cost',
            'metric',
            'Report_01_Simple',
            'Column Set 2',
            'below',
            'Year'
        );
        await since(
            'the Data Source "Airline Sample Dataset" for column set "Column Set 2" is selected for complex grid visualization "Visualization 1"'
        )
            .expect(
                await isDatasetSelectedforVisualizationColumnSet(
                    'Visualization 1',
                    'Column Set 2',
                    'Airline Sample Dataset'
                )
            )
            .toBe(true);

        // 2.4 Change data source for column sets
        await vizPanelForGrid.setDataSourceForCompoundOrAg('Visualization 1', 'Column Set 1', 'Retail Sample Dataset');

        await since(
            'the Data Source "Retail Sample Dataset" for column set "Column Set 1" is selected for complex grid visualization "Visualization 1"'
        )
            .expect(
                await isDatasetSelectedforVisualizationColumnSet(
                    'Visualization 1',
                    'Column Set 1',
                    'Retail Sample Dataset'
                )
            )
            .toBe(true);

        await vizPanelForGrid.scrollToElementInDatasetPanel('Profit', 'metric', 'Report_01_Simple');
        await vizPanelForGrid.dragDSObjectToColumnSetDZwithPosition(
            'Profit',
            'metric',
            'Report_01_Simple',
            'Column Set 1',
            'below',
            'Revenue'
        );
        await since(
            'the Data Source "Retail Sample Dataset" for column set "Column Set 1" is selected for complex grid visualization "Visualization 1"'
        )
            .expect(
                await isDatasetSelectedforVisualizationColumnSet(
                    'Visualization 1',
                    'Column Set 1',
                    'Retail Sample Dataset'
                )
            )
            .toBe(true);

        await vizPanelForGrid.setDataSourceForCompoundOrAg('Visualization 1', 'Column Set 2', 'Report_01_Simple');
        await since(
            'the Data Source "Report_01_Simple" for column set "Column Set 2" is selected for complex grid visualization "Visualization 1"'
        )
            .expect(
                await isDatasetSelectedforVisualizationColumnSet('Visualization 1', 'Column Set 2', 'Report_01_Simple')
            )
            .toBe(true);

        await vizPanelForGrid.scrollToElementInDatasetPanel('Unit Price', 'metric', 'Retail Sample Dataset');
        await vizPanelForGrid.dragDSObjectToColumnSetDZwithPosition(
            'Unit Price',
            'metric',
            'Retail Sample Dataset',
            'Column Set 2',
            'below',
            'Cost'
        );
        await since(
            'the Data Source "Report_01_Simple" for column set "Column Set 2" is selected for complex grid visualization "Visualization 1"'
        )
            .expect(
                await isDatasetSelectedforVisualizationColumnSet('Visualization 1', 'Column Set 2', 'Report_01_Simple')
            )
            .toBe(true);

        await vizPanelForGrid.clickOnContainerTitle('Visualization 1');
        await vizPanelForGrid.setDataSourceForCompoundOrAg('Visualization 1', 'Column Set 2', 'None');
        await since(
            'the Data Source "None" for column set "Column Set 2" is selected for complex grid visualization "Visualization 1"'
        )
            .expect(await isDatasetSelectedforVisualizationColumnSet('Visualization 1', 'Column Set 2', 'None'))
            .toBe(true);

        await vizPanelForGrid.scrollToElementInDatasetPanel('Origin Airport', 'attribute', 'Airline Sample Dataset');
        await vizPanelForGrid.dragDSObjectToColumnSetDZwithPosition(
            'Origin Airport',
            'attribute',
            'Airline Sample Dataset',
            'Column Set 2',
            'below',
            'Year'
        );
        await since(
            'the Data Source "None" for column set "Column Set 2" is selected for complex grid visualization "Visualization 1"'
        )
            .expect(await isDatasetSelectedforVisualizationColumnSet('Visualization 1', 'Column Set 2', 'None'))
            .toBe(true);
    });

    it('[TC64466_3] Test Datasource with an Ag Grid', async () => {
        // Wait for the Dossier Editor to be fully loaded
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.Grid_Data_Source.project.id,
            dossierId: gridConstants.Grid_Data_Source.id,
        });

        // Navigate to the target page
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 3' });

        await vizPanelForGrid.clickOnContainerTitle('Visualization 1');
        await editorPanel.switchToEditorPanel();

        await agGridVisualization.addColumnSet('Visualization 1');
        // Verify initial data source state
        await since(
            'the Data Source "None" for column set "Column Set 1" is selected for complex grid visualization "Visualization 1"'
        )
            .expect(await isDatasetSelectedforVisualizationColumnSet('Visualization 1', 'Column Set 1', 'None'))
            .toBe(true);

        // 3.1 Drag from dataset 1
        await addObjectToVisualization('Airline Name', 'attribute', 'Airline Sample Dataset', 'Rows', 'Column Set 1');
        await since(
            `the Data Source "Airline Sample Dataset" for column set "Column Set 1" is selected for complex grid visualization "Visualization 1"`
        )
            .expect(
                await isDatasetSelectedforVisualizationColumnSet(
                    'Visualization 1',
                    'Column Set 1',
                    'Airline Sample Dataset'
                )
            )
            .toBe(true);

        // 3.2 Drag from dataset 2
        await addObjectToVisualization('City', 'attribute', 'Retail Sample Dataset', 'Rows', 'Column Set 1');
        await dragObjectToColumnSet('Revenue', 'metric', 'Retail Sample Dataset', 'Column Set 1');
        await since(
            `the Data Source "Airline Sample Dataset" for column set "Column Set 1" is selected for complex grid visualization "Visualization 1"`
        )
            .expect(
                await isDatasetSelectedforVisualizationColumnSet(
                    'Visualization 1',
                    'Column Set 1',
                    'Airline Sample Dataset'
                )
            )
            .toBe(true);

        // 3.3 Drag from dataset 3
        await agGridVisualization.addColumnSet('Visualization 1');
        await dragObjectToColumnSet('Year', 'attribute', 'Report_01_Simple', 'Column Set 2');
        await dragObjectToColumnSetWithPosition('Cost', 'metric', 'Report_01_Simple', 'Column Set 2', 'below', 'Year');
        await since(
            `the Data Source "Airline Sample Dataset" for column set "Column Set 2" is selected for complex grid visualization "Visualization 1"`
        )
            .expect(
                await isDatasetSelectedforVisualizationColumnSet(
                    'Visualization 1',
                    'Column Set 2',
                    'Airline Sample Dataset'
                )
            )
            .toBe(true);

        // 3.4 Add microchart
        await addMicrochartToVisualization(
            'Visualization 1',
            'Number of Flights',
            'Origin Airport',
            'Number of Flights Trend by Origin Airport'
        );
        await since(
            `the Data Source "Airline Sample Dataset" for column set "Number of Flights Trend by Origin Airport" is selected for complex grid visualization "Visualization 1"`
        )
            .expect(
                await isDatasetSelectedforVisualizationColumnSet(
                    'Visualization 1',
                    'Number of Flights Trend by Origin Airport',
                    'Airline Sample Dataset'
                )
            )
            .toBe(true);

        // 3.5 Change data source for column sets
        await changeDataSourceForColumnSet('Visualization 1', 'Column Set 1', 'Retail Sample Dataset');
        await dragObjectToColumnSetWithPosition(
            'Profit',
            'metric',
            'Report_01_Simple',
            'Column Set 1',
            'below',
            'Revenue'
        );
        await since(
            `the Data Source "Retail Sample Dataset" for column set "Column Set 1" is selected for complex grid visualization "Visualization 1"`
        )
            .expect(
                await isDatasetSelectedforVisualizationColumnSet(
                    'Visualization 1',
                    'Column Set 1',
                    'Retail Sample Dataset'
                )
            )
            .toBe(true);

        await changeDataSourceForColumnSet('Visualization 1', 'Column Set 2', 'Report_01_Simple');
        await since(
            `the Data Source "Report_01_Simple" for column set "Column Set 2" is selected for complex grid visualization "Visualization 1"`
        )
            .expect(
                await isDatasetSelectedforVisualizationColumnSet('Visualization 1', 'Column Set 2', 'Report_01_Simple')
            )
            .toBe(true);

        await dragObjectToColumnSetWithPosition(
            'Unit Price',
            'metric',
            'Retail Sample Dataset',
            'Column Set 2',
            'below',
            'Cost'
        );

        await since(
            `the Data Source "Report_01_Simple" for column set "Column Set 2" is selected for complex grid visualization "Visualization 1"`
        )
            .expect(
                await isDatasetSelectedforVisualizationColumnSet('Visualization 1', 'Column Set 2', 'Report_01_Simple')
            )
            .toBe(true);

        await changeDataSourceForColumnSet('Visualization 1', 'Number of Flights Trend by Origin Airport', 'None');
        await dragObjectToColumnSetWithPosition(
            'Origin Airport',
            'attribute',
            'Airline Sample Dataset',
            'Column Set 2',
            'below',
            'Year'
        );

        await since(
            `the Data Source "None" for column set "Number of Flights Trend by Origin Airport" is selected for complex grid visualization "Visualization 1"`
        )
            .expect(
                await isDatasetSelectedforVisualizationColumnSet(
                    'Visualization 1',
                    'Number of Flights Trend by Origin Airport',
                    'None'
                )
            )
            .toBe(true);
    });
});
