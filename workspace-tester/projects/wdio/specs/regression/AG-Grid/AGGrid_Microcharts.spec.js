import * as gridConstants from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { existingObjectsDialog } from '../../../pageObjects/dossierEditor/ExistingObjectsDialog.js';

describe('AG Grid - Microcharts', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        loginPage,
        grid,
        baseVisualization,
        vizPanelForGrid,
        datasetPanel,
        agGridVisualization,
        editorPanelForGrid,
        microchartConfigDialog,
        baseContainer,
        libraryPage,
        dossierAuthoringPage,
        vizGallery,
        contentsPanel,
        toolbar,
        editorPanel,
        datasetsPanel,
        dossierMojo,
        baseFormatPanel,
        baseFormatPanelReact,
        newFormatPanelForGrid,
        moreOptions,
        loadingDialog,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(gridConstants.gridUser);
    });

    afterEach(async () => {});

    it('[TC71125] Validating creating MicroCharts authoring - Acceptance', async () => {
        // Create a new dossier with dataset, not stable, change to edit an existing dossier
        // await libraryAuthoringPage.createDossierFromLibrary();
        // await dossierAuthoringPage.addNewSampleData(6); // The 7th file in the list 'retail-sample-data'

        // Edit dossier by its ID "755A8D3B614D64690297FB8DA4EAB5B9"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > MicroChart > AGGrid_MicroChart_TC71125
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridMicrochart.project.id,
            dossierId: gridConstants.AGGridMicrochart.id,
        });

        // Add objects to grid rows
        await baseVisualization.changeVizType('Visualization 1', 'Grid', 'Grid (Modern)');
        await datasetPanel.addObjectToVizByDoubleClick('Supplier', 'attribute', 'retail-sample-data.xls');

        // Add metrics to column set 1
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');

        // Add microchart - Sparkline
        await agGridVisualization.addMicrochartSet();
        await microchartConfigDialog.selectObject(1, 'Cost');
        await microchartConfigDialog.selectObject(2, 'Month');
        await browser.pause(1000);
        await takeScreenshotByElement(
            microchartConfigDialog.windowRoot,
            'TC71125_01',
            'Microchart Config Dialog with Cost, Month'
        );
        await microchartConfigDialog.confirmDialog();

        // Add microchart - trend bars
        await agGridVisualization.addMicrochartSet();
        await microchartConfigDialog.selectType('Trend Bars');
        await microchartConfigDialog.selectObject(1, 'Revenue');
        await microchartConfigDialog.selectObject(2, 'City');
        await browser.pause(1000);
        await takeScreenshotByElement(
            microchartConfigDialog.windowRoot,
            'TC71125_02',
            'Microchart Config Dialog with Revenue, City'
        );
        await microchartConfigDialog.confirmDialog();

        // Add microchart - Bullet
        await agGridVisualization.addMicrochartSet();
        await microchartConfigDialog.selectType('Bullet');
        await microchartConfigDialog.selectObject(1, 'Cost');
        await microchartConfigDialog.selectObject(2, 'Units Sold');
        await microchartConfigDialog.selectObject(3, 'Unit Price');
        await browser.pause(1000);
        await takeScreenshotByElement(
            microchartConfigDialog.windowRoot,
            'TC71125_03',
            'Microchart Config Dialog with Cost, Units Sold, Unit Price'
        );
        await microchartConfigDialog.confirmDialog();
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71125_04',
            'Editor Panel with Supplier in Rows, Revenue, Cost in Column Set 1, 3 Microcharts in order: "Sparkline" named "Cost Trend by Month", "Trend Bars" named "Revenue Comparison by City", "Bullet" named "Cost Performance" '
        );

        // Change MicroChart type from Bullet to Sparkline
        await vizPanelForGrid.editMicrochart('Cost Performance', 'Cost Performance');
        await microchartConfigDialog.selectType('Sparkline');
        await microchartConfigDialog.selectObject(2, 'Month');
        await browser.pause(1000);
        await takeScreenshotByElement(
            microchartConfigDialog.windowRoot,
            'TC71125_05',
            'Microchart Edit to Sparkline with Month'
        );
        await microchartConfigDialog.confirmDialog();
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71125_06',
            'Editor Panel with microchart with type "Sparkline" named "Cost Trend by Month"'
        );

        // Rename MicroChart
        await vizPanelForGrid.editMicrochart('Cost Trend by Month', 'Cost Trend by Month');
        await microchartConfigDialog.renameChart('Microchart Test');
        await takeScreenshotByElement(
            microchartConfigDialog.windowRoot,
            'TC71125_07',
            'Microchart Rename to "Microchart Test"'
        );
        await microchartConfigDialog.confirmDialog();
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71125_08',
            'Editor Panel with microchart with name "Microchart Test"'
        );

        // Insert new Modern Grid visualization
        await vizGallery.clickOnInsertVI();
        await vizGallery.changeVizType('Grid', 'Grid (Modern)');
        await since('Container "Visualization 2" should be selected')
            .expect(await grid.isContainerSelected('Visualization 2'))
            .toBe(true);
        // Double click on Attribute to add to grid
        await datasetPanel.addObjectToVizByDoubleClick('Month', 'attribute', 'retail-sample-data.xls');
        // Double Click on Metrics to add to grid
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');

        // Insert new Column Set and double click on metrics to add to grid
        await agGridVisualization.addColumnSet();
        await datasetPanel.addObjectToVizByDoubleClick('Unit Price', 'metric', 'retail-sample-data.xls');
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71125_09',
            'Editor Panel with Month on Row, Cost on Column Set 1, Unit Price on Column Set 2'
        );

        // Drag metric to space above column set 1
        await vizPanelForGrid.dragDSObjectBelowColumnsTitleBar('Units Sold', 'metric', 'retail-sample-data.xls');

        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71125_10',
            'Editor Panel with  Units Sold on Column Set 3, Cost on Column Set 1, Unit Price on Column Set 2 in order'
        );

        // Drag attribute to space below last column set
        await vizPanelForGrid.dragDSObjectToLastColumnSet('Units Available', 'metric', 'retail-sample-data.xls');
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71125_11',
            'Editor Panel with Units Available on Column Set 4, Units Sold on Column Set 3, Cost on Column Set 1, Unit Price on Column Set 2 in order'
        );

        // Reorder columns: drag Column Set named "Column Set 4" below Column Set "Column Set 1"
        await vizPanelForGrid.reorderColumnSet('Column Set 4', 'below', 'Column Set 1');
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71125_12',
            'Editor Panel with Units Sold on Column Set 3, Cost on Column Set 1, Units Available on Column Set 4, Unit Price on Column Set 2 in order'
        );

        // Replace items in column set
        await editorPanelForGrid.replaceObjectByNameInColumnSet('Cost', 'Column Set 1', 'Revenue');
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71125_13',
            'Editor Panel replace Cost with Revenue in Column Set 1'
        );

        // remove all objects from editor panel
        await editorPanelForGrid.removeAllObjects();
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71125_14',
            'Clear all objects from editor panel'
        );

        // Create simple grid with attributes and metrics and convert to Modern grid
        await vizGallery.clickOnInsertVI();
        await vizGallery.changeVizType('Grid', 'Grid');
        await since('Container "Visualization 3" should be selected')
            .expect(await grid.isContainerSelected('Visualization 3'))
            .toBe(true);
        await datasetPanel.addObjectToVizByDoubleClick('Month', 'attribute', 'retail-sample-data.xls');
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');
        await datasetPanel.addObjectToVizByDoubleClick('Revenue', 'metric', 'retail-sample-data.xls');
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71125_15',
            'The editor panel have "attribute" named "Month" on "Rows" section, "Metric Names" in the "Columns" zone,  "Cost" and "Revenue"  on "Metrics" section'
        );
        await baseVisualization.changeVizType('Visualization 3', 'Grid', 'Grid (Modern)');
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71125_16',
            'The editor panel have "attribute" named "Month" on "Rows" section, "metric" named "Cost", "Revenue"  on "Columns" section'
        );

        //Create new Compound grid with one column set and convert to Modern Grid
        await vizGallery.clickOnInsertVI();
        await vizGallery.changeVizType('Grid', 'Compound Grid');
        await since('Container "Visualization 4" should be selected')
            .expect(await grid.isContainerSelected('Visualization 4'))
            .toBe(true);
        await datasetPanel.addObjectToVizByDoubleClick('Month', 'attribute', 'retail-sample-data.xls');
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');
        await datasetPanel.addObjectToVizByDoubleClick('Revenue', 'metric', 'retail-sample-data.xls');
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71125_17',
            'The editor panel have "attribute" named "Month" on "Rows" section, "metric" named "Cost" and "Revenue" on "Column Set 1" section'
        );
        await baseVisualization.changeVizType('Visualization 4', 'Grid', 'Grid (Modern)');
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71125_18',
            'The editor panel have "attribute" named "Month" on "Rows" section, "metric" named "Cost", "Revenue"  on "Column Set 1" section'
        );
    });

    it('[TC71126_01] Validating creating MicroCharts authoring - Regression: create ag grid with microChart and convert to compound grid', async () => {
        // Edit dossier by its ID "755A8D3B614D64690297FB8DA4EAB5B9"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > MicroChart > AGGrid_MicroChart_TC71125
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridMicrochart.project.id,
            dossierId: gridConstants.AGGridMicrochart.id,
        });

        // Add objects to grid rows
        await baseVisualization.changeVizType('Visualization 1', 'Grid', 'Grid (Modern)');
        await datasetPanel.addObjectToVizByDoubleClick('Supplier', 'attribute', 'retail-sample-data.xls');

        // Add metrics to column set 1
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');

        // Drag metric to space above first metric
        await vizPanelForGrid.dragDSObjectBelowColumnsTitleBar('Revenue', 'metric', 'retail-sample-data.xls');

        // Drag metric to space below last metric
        await vizPanelForGrid.dragDSObjectToLastColumnSet('Units Available', 'metric', 'retail-sample-data.xls');

        // Add microchart - Sparkline
        await agGridVisualization.addMicrochartSet();
        await microchartConfigDialog.selectObject(1, 'Cost');
        await microchartConfigDialog.selectObject(2, 'Month');
        await browser.pause(1000);
        await microchartConfigDialog.confirmDialog();

        // Add microchart - trend bars
        await agGridVisualization.addMicrochartSet();
        await microchartConfigDialog.selectType('Trend Bars');
        await microchartConfigDialog.selectObject(1, 'Revenue');
        await microchartConfigDialog.selectObject(2, 'City');
        await browser.pause(1000);
        await microchartConfigDialog.confirmDialog();

        // Add microchart - Bullet
        await agGridVisualization.addMicrochartSet();
        await microchartConfigDialog.selectType('Bullet');
        await microchartConfigDialog.selectObject(1, 'Cost');
        await microchartConfigDialog.selectObject(2, 'Units Sold');
        await microchartConfigDialog.selectObject(3, 'Unit Price');
        await browser.pause(1000);
        await microchartConfigDialog.confirmDialog();
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71126_01_01',
            'Editor Panel with Supplier in Rows, Revenue, Cost, Units Available in Column Set 1, 3 Microcharts in order: "Sparkline" named "Cost Trend by Month", "Trend Bars" named "Revenue Comparison by City", "Bullet" named "Cost Performance" '
        );
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC71126_01_02',
            'AG Grid with Supplier in Rows, Revenue, Cost, Units Available in Column Set 1 and 3 Microcharts'
        );

        // Reorder column sets
        await vizPanelForGrid.reorderColumnSet('Cost Performance', 'above', 'Column Set 1');
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71126_01_03',
            'Editor Panel with Cost Performance above Column Set 1'
        );

        // Replace items in column set
        await editorPanelForGrid.replaceObjectByNameInColumnSet('Revenue', 'Column Set 1', 'Cost');
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71126_01_04',
            'Editor Panel replace Revenue with Cost in Column Set 1'
        );

        // Change MicroChart type from Bullet to Sparkline
        await vizPanelForGrid.editMicrochart('Cost Performance', 'Cost Performance');
        await microchartConfigDialog.selectType('Sparkline');
        await microchartConfigDialog.selectObject(2, 'Month');
        await browser.pause(1000);
        await microchartConfigDialog.confirmDialog();
        await since(
            'The editor panel should have microchart with type "Sparkline" named "Cost Trend by Month" on "Cost Trend by Month" section'
        )
            .expect(
                await editorPanel.getObjectFromSection('Cost Trend by Month', 'mc', 'Cost Trend by Month').isDisplayed()
            )
            .toBe(true);

        // Rename MicroChart
        await vizPanelForGrid.editMicrochart('Cost Trend by Month', 'Cost Trend by Month');
        await microchartConfigDialog.renameChart('Microchart Test');
        await microchartConfigDialog.confirmDialog();
        await since(
            'The editor panel should have microchart with type "Sparkline" named "Microchart Test" on "Microchart Test" section'
        )
            .expect(await editorPanel.getObjectFromSection('Microchart Test', 'mc', 'Microchart Test').isDisplayed())
            .toBe(true);

        // Rename attribute from grid and editor panel
        await editorPanelForGrid.renameObjectFromSection('Supplier', 'Rows', 'Supplier New Name');
        since('The editor panel should have "attribute" named "Supplier New Name" on "Rows" section').expect(
            await editorPanel.getObjectFromSection('Supplier New Name', 12, 'Rows').isDisplayed()
        );

        // Delete all objects from editor panel
        await editorPanelForGrid.removeAllObjects();
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71126_01_05',
            'Clear all objects from editor panel'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'TC71126_01_08',
            'Viz after clear all objects'
        );

        // Double Click on Metrics and attributes to add to grid
        await datasetPanel.addObjectToVizByDoubleClick('Supplier', 'attribute', 'retail-sample-data.xls');
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');

        // Add additional value sets and microcharts
        await agGridVisualization.addColumnSet();
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ(
            'Units Available',
            'metric',
            'retail-sample-data.xls',
            'Column Set 2'
        );
        await vizPanelForGrid.dragDSObjectToColumnSetDZwithPosition(
            'Revenue',
            'metric',
            'retail-sample-data.xls',
            'Column Set 2',
            'below',
            'Units Available'
        );
        await agGridVisualization.addMicrochartSet();
        await microchartConfigDialog.selectObject(1, 'Cost');
        await microchartConfigDialog.selectObject(2, 'Month');
        await browser.pause(1000);
        await microchartConfigDialog.confirmDialog();
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71126_01_06',
            'Editor Panel with Supplier on Rows, Cost on Column Set 1, Units Available, Revenue on Column Set 2,microchart with type "Sparkline" named "Cost Trend by Month"'
        );

        // Convert to Compound Grid
        await baseVisualization.changeVizType('Visualization 1', 'Grid', 'Compound Grid');
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71126_01_07',
            'Editor Panel with Supplier on Rows, Cost on Column Set 1, Units Available, Revenue on Column Set 2, Month, Cost on Cost Trend by Month'
        );
    });

    it('[TC71126_02] Validating MicroCharts authoring - Regression: Convert AG Grid to other viz type', async () => {
        // Edit dossier by its ID "755A8D3B614D64690297FB8DA4EAB5B9"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > MicroChart > AGGrid_MicroChart_TC71125
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridMicrochart.project.id,
            dossierId: gridConstants.AGGridMicrochart.id,
        });

        // Create new AG grid with attributes and metrics and one attribute in columns
        await vizGallery.clickOnInsertVI();
        await vizGallery.changeVizType('Grid', 'Grid (Modern)');
        await since('Container "Visualization 2" should be selected')
            .expect(await grid.isContainerSelected('Visualization 2'))
            .toBe(true);
        await datasetPanel.addObjectToVizByDoubleClick('Supplier', 'attribute', 'retail-sample-data.xls');
        await vizPanelForGrid.dragDSObjectToGridDZ('Month', 'attribute', 'retail-sample-data.xls', 'Columns');
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71126_02_01',
            'Editor Panel with Supplier on Rows, Month, Cost on Columns'
        );

        // Convert AG grid to other visualization types from context menu
        await vizPanelForGrid.changeViz('Vertical Bar Chart', 'Visualization 2');
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71126_02_02',
            'Vertical Bar Chart Editor Panel with Supplier on Horizontal, Month, Cost on Vertical'
        );
        await toolbar.clickButtonFromToolbar('Undo');
        await toolbar.waitForElementInvisible(dossierAuthoringPage.getMojoLoadingIndicator());
        await vizPanelForGrid.changeViz('Heat Map', 'Visualization 2');
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71126_02_03',
            'Heat Map Editor Panel with Supplier,Month on Grouping, Cost on Size By, Supplier on Color By'
        );
        await toolbar.clickButtonFromToolbar('Undo');
        await toolbar.waitForElementInvisible(dossierAuthoringPage.getMojoLoadingIndicator());
        await vizPanelForGrid.changeViz('Map', 'Visualization 2');
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71126_02_04',
            'Map Editor Panel with Supplier,Month on Tooltip, Cost on Color By'
        );
        await toolbar.clickButtonFromToolbar('Undo');
        await toolbar.waitForElementInvisible(dossierAuthoringPage.getMojoLoadingIndicator());
        await vizPanelForGrid.changeViz('D3 WordCloud', 'Visualization 2');
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71126_02_05',
            'D3 WordCloud Editor Panel with Supplier on Attribute, Cost on Metric'
        );

        // Delete visualization 2
        await baseContainer.deleteContainer('Visualization 2');
    });

    it('[TC71126_03] Validating MicroCharts authoring - Regression: Convert other viz type to AG Grid', async () => {
        // Edit dossier by its ID "755A8D3B614D64690297FB8DA4EAB5B9"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > MicroChart > AGGrid_MicroChart_TC71125
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridMicrochart.project.id,
            dossierId: gridConstants.AGGridMicrochart.id,
        });

        // Create graphs, maps, custom viz types and convert to AG Grid
        await vizGallery.clickOnInsertVI();
        await vizGallery.changeVizType('Bar', 'Vertical Bar Chart');
        await since('Container "Visualization 2" should be selected')
            .expect(await grid.isContainerSelected('Visualization 2'))
            .toBe(true);
        await datasetPanel.addObjectToVizByDoubleClick('Supplier', 'attribute', 'retail-sample-data.xls');
        await vizPanelForGrid.dragDSObjectToGridDZ('Month', 'attribute', 'retail-sample-data.xls', 'Vertical');
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71126_03_01',
            'Vertical Bar Chart Editor Panel with Supplier on Horizontal, Month, Cost on Vertical'
        );
        await baseVisualization.changeVizType('Visualization 2', 'Grid', 'Grid (Modern)');
        await agGridVisualization.addMicrochartSet();
        await microchartConfigDialog.selectObject(1, 'Cost');
        await microchartConfigDialog.selectObject(2, 'City');
        await browser.pause(1000);
        await microchartConfigDialog.confirmDialog();
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71126_03_02',
            'Editor Panel with Month, Supplier on Rows, Cost,microchart with type "Sparkline" named "Cost Trend by City" on Columns'
        );
        await baseContainer.deleteContainer('Visualization 2');

        await vizGallery.clickOnInsertVI();
        await vizGallery.changeVizType('More', 'Heat Map');
        await since('Container "Visualization 2" should be selected')
            .expect(await grid.isContainerSelected('Visualization 2'))
            .toBe(true);
        await datasetPanel.addObjectToVizByDoubleClick('Month', 'attribute', 'retail-sample-data.xls');
        await datasetPanel.addObjectToVizByDoubleClick('Supplier', 'attribute', 'retail-sample-data.xls');
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71126_03_03',
            'Heat Map Editor Panel with Month on Grouping and Color By, Supplier on Grouping, Cost on Size By'
        );
        await baseVisualization.changeVizType('Visualization 2', 'Grid', 'Grid (Modern)');
        await agGridVisualization.addMicrochartSet();
        await microchartConfigDialog.selectObject(1, 'Cost');
        await microchartConfigDialog.selectObject(2, 'City');
        await browser.pause(1000);
        await microchartConfigDialog.confirmDialog();
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71126_03_04',
            'Editor Panel with Month, Supplier on Rows, Cost and microchart with type "Sparkline" named "Cost Trend by City" on Columns'
        );
        await baseContainer.deleteContainer('Visualization 2');

        await vizGallery.clickOnInsertVI();
        await vizGallery.changeVizType('Map', 'Map');
        await since('Container "Visualization 2" should be selected')
            .expect(await grid.isContainerSelected('Visualization 2'))
            .toBe(true);
        await datasetPanel.addObjectToVizByDoubleClick('City', 'attribute', 'retail-sample-data.xls');
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');
        await datasetPanel.addObjectToVizByDoubleClick('Supplier', 'attribute', 'retail-sample-data.xls');
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71126_03_05',
            'Map Editor Panel with City on Geo Attribute, City@Latitude on Latitude, City@Longitude on Longitude, Cost on Color By, Supplier on Tooltip'
        );
        await baseVisualization.changeVizType('Visualization 2', 'Grid', 'Grid (Modern)');
        await agGridVisualization.addMicrochartSet();
        await microchartConfigDialog.selectObject(1, 'Cost');
        await microchartConfigDialog.selectObject(2, 'Month');
        await browser.pause(1000);
        await microchartConfigDialog.confirmDialog();
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71126_03_06',
            'Editor Panel with City,Supplier on Rows, Cost and microchart with type "Sparkline" named "Cost Trend by Month" on Columns'
        );
        await baseContainer.deleteContainer('Visualization 2');

        await vizGallery.clickOnInsertVI();
        await vizGallery.changeVizType('Custom', 'D3 WordCloud');
        await agGridVisualization.clickContainer('Visualization 2');
        await datasetPanel.addObjectToVizByDoubleClick('Month', 'attribute', 'retail-sample-data.xls');
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');
        await datasetPanel.addObjectToVizByDoubleClick('Revenue', 'metric', 'retail-sample-data.xls');
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71126_03_07',
            'D3 WordCloud Editor Panel with Month on Attribute, Cost on Metrics, Revenue on Tooltip'
        );
        await baseVisualization.changeVizType('Visualization 2', 'Grid', 'Grid (Modern)');
        await agGridVisualization.addMicrochartSet();
        await microchartConfigDialog.selectObject(1, 'Cost');
        await microchartConfigDialog.selectObject(2, 'City');
        await browser.pause(1000);
        await microchartConfigDialog.confirmDialog();
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71126_03_08',
            'Editor Panel with Month on Rows, Cost, Revenue and microchart with type "Sparkline" named "Cost Trend by City" on Columns'
        );
        await baseContainer.deleteContainer('Visualization 2');

        // Apply sort and subtotal manipulations
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await baseVisualization.changeVizType('Visualization 1', 'Grid', 'Grid (Modern)');
        await datasetPanel.addObjectToVizByDoubleClick('Supplier', 'attribute', 'retail-sample-data.xls');
        await vizPanelForGrid.dragDSObjectToGridDZ('Month', 'attribute', 'retail-sample-data.xls', 'Columns');
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');
        // enable show totals
        await agGridVisualization.toggleShowTotalsByContextMenu('Visualization 1');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 4, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 1, 'Visualization 1'))
            .toBe('20th Century Fox');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 4, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 2, 'Visualization 1'))
            .toBe('$398,708');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 3, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Total');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 3, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('$12,538,995');
        await editorPanelForGrid.simpleSort('Supplier', 'Sort Descending');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 4, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 1, 'Visualization 1'))
            .toBe('WEA');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 4, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 2, 'Visualization 1'))
            .toBe('$710,897');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 3, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('$12,538,995');
        await editorPanelForGrid.simpleSort('Month', 'Sort Descending');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 4, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 1, 'Visualization 1'))
            .toBe('WEA');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 4, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 2, 'Visualization 1'))
            .toBe('$533,815');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 3, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('$15,983,301');
        await editorPanelForGrid.createSubtotalsFromEditorPanel('Month', 'attribute', 'Average');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 4, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 1, 'Visualization 1'))
            .toBe('WEA');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 4, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 2, 'Visualization 1'))
            .toBe('$533,815');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 3, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('$15,983,301');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 4, col 14 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 14, 'Visualization 1'))
            .toBe('$782,068');
    });

    it('[TC71126_04] DE255130 AG Grid | The column set got removed when try to drag object from Editor Panel to dataset', async () => {
        // Edit dossier by its ID "138A05707F44A677FEF47588958777BB"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Defect > DE255130
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridDE255130.project.id,
            dossierId: gridConstants.AGGridDE255130.id,
        });
        await since('The editor panel should have "attribute" named "Category" on "Rows" section')
            .expect(await editorPanel.getObjectFromSection('Category', 12, 'Rows').isDisplayed())
            .toBe(true);
        await since('The editor panel should have "attribute" named "Subcategory" on "Rows" section')
            .expect(await editorPanel.getObjectFromSection('Subcategory', 12, 'Rows').isDisplayed())
            .toBe(true);
        await since(
            'The editor panel should have microchart with type "Sparkline" named "Cost Trend by Year" on "Cost Trend by Year" section'
        )
            .expect(
                await editorPanel
                    .getObjectFromSection('Cost Trend by Year', 'mc mc-sparkline', 'Cost Trend by Year')
                    .isDisplayed()
            )
            .toBe(true);
        await since(
            'The editor panel should have microchart with type "Trend Bars" named "Profit Comparison by Region" on "Profit Comparison by Region" section'
        )
            .expect(
                await editorPanel
                    .getObjectFromSection(
                        'Profit Comparison by Region',
                        'mc mc-trendBar',
                        'Profit Comparison by Region'
                    )
                    .isDisplayed()
            )
            .toBe(true);
        await since('The editor panel should have "metric" named "Revenue" on "Column Set 3" section')
            .expect(await editorPanel.getObjectFromSection('Revenue', 4, 'Column Set 3').isDisplayed())
            .toBe(true);
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'Visualization 1'))
            .toBe('Category');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'Visualization 1'))
            .toBe('Subcategory');

        // drag "attribute" named "Category" in dropzone "Rows" to the dataset panel to remove the object from Ag-Grid
        await editorPanelForGrid.dragObjectFromDZtoDS('Category', 'attribute', 'Rows');

        // should not have "attribute" named "Category" on "Rows" section
        await since('The editor panel should not have "attribute" named "Category" on "Rows" section')
            .expect(await editorPanel.getObjectFromSection('Category', 12, 'Rows').isDisplayed())
            .toBe(false);
        await since('The editor panel should have "attribute" named "Subcategory" on "Rows" section')
            .expect(await editorPanel.getObjectFromSection('Subcategory', 12, 'Rows').isDisplayed())
            .toBe(true);
        await since(
            'The editor panel should have microchart with type "Sparkline" named "Cost Trend by Year" on "Cost Trend by Year" section'
        )
            .expect(
                await editorPanel
                    .getObjectFromSection('Cost Trend by Year', 'mc mc-sparkline', 'Cost Trend by Year')
                    .isDisplayed()
            )
            .toBe(true);
        await since(
            'The editor panel should have microchart with type "Trend Bars" named "Profit Comparison by Region" on "Profit Comparison by Region" section'
        )
            .expect(
                await editorPanel
                    .getObjectFromSection(
                        'Profit Comparison by Region',
                        'mc mc-trendBar',
                        'Profit Comparison by Region'
                    )
                    .isDisplayed()
            )
            .toBe(true);
        await since('The editor panel should have "metric" named "Revenue" on "Column Set 3" section')
            .expect(await editorPanel.getObjectFromSection('Revenue', 4, 'Column Set 3').isDisplayed())
            .toBe(true);
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'Visualization 1'))
            .toBe('Subcategory');

        // drag "attribute" named "Subcategory" in dropzone "Rows" to the dataset panel to remove the object from Ag-Grid
        await editorPanelForGrid.dragObjectFromDZtoDS('Subcategory', 'attribute', 'Rows');
        // should not have "attribute" named "Subcategory" on "Rows" section
        await since('The editor panel should not have "attribute" named "Subcategory" on "Rows" section')
            .expect(await editorPanel.getObjectFromSection('Subcategory', 12, 'Rows').isDisplayed())
            .toBe(false);
        await since(
            'The editor panel should have microchart with type "Sparkline" named "Cost Trend by Year" on "Cost Trend by Year" section'
        )
            .expect(
                await editorPanel
                    .getObjectFromSection('Cost Trend by Year', 'mc mc-sparkline', 'Cost Trend by Year')
                    .isDisplayed()
            )
            .toBe(true);
        await since(
            'The editor panel should have microchart with type "Trend Bars" named "Profit Comparison by Region" on "Profit Comparison by Region" section'
        )
            .expect(
                await editorPanel
                    .getObjectFromSection(
                        'Profit Comparison by Region',
                        'mc mc-trendBar',
                        'Profit Comparison by Region'
                    )
                    .isDisplayed()
            )
            .toBe(true);
        await since('The editor panel should have "metric" named "Revenue" on "Column Set 3" section')
            .expect(await editorPanel.getObjectFromSection('Revenue', 4, 'Column Set 3').isDisplayed())
            .toBe(true);
    });

    it('[TC71099] Functional validation of Attribute Forms in Microcharts authoring and consumption modes', async () => {
        // Edit dossier by its ID "755A8D3B614D64690297FB8DA4EAB5B9"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > MicroChart > AGGrid_MicroChart_TC71125
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridMicrochart.project.id,
            dossierId: gridConstants.AGGridMicrochart.id,
        });
        await dossierAuthoringPage.addExistingObjects();

        // Then An editor shows up with title "Add Existing Objects"
        await since('An editor with title "Add Existing Objects" should be displayed')
            .expect(await dossierMojo.getMojoEditorWithTitle('Add Existing Objects').isDisplayed())
            .toBe(true);

        // When I expand the "Products" folder
        await existingObjectsDialog.expandFolder('Products');

        // And I double click on "Brand" from the object browse container
        await existingObjectsDialog.doubleClickOnObject('Brand');

        // Then Object "Brand" is added to the dataset container
        await since('Object "Brand" should be added to the dataset container')
            .expect(await existingObjectsDialog.getObjectFromDatasetContainer('Brand').isDisplayed())
            .toBe(true);

        // And I double click on "Category" from the object browse container
        await existingObjectsDialog.doubleClickOnObject('Category');

        // Then Object "Category" is added to the dataset container
        await since('Object "Category" should be added to the dataset container')
            .expect(await existingObjectsDialog.getObjectFromDatasetContainer('Category').isDisplayed())
            .toBe(true);

        // And I double click on "Item" from the object browse container
        await existingObjectsDialog.doubleClickOnObject('Item');

        // Then Object "Item" is added to the dataset container
        await since('Object "Item" should be added to the dataset container')
            .expect(await existingObjectsDialog.getObjectFromDatasetContainer('Item').isDisplayed())
            .toBe(true);

        // I select Metrics from the object explorer dropdown
        await existingObjectsDialog.selectMetricsFromDropdown();
        await existingObjectsDialog.expandFolder('Sales Metrics');
        // Then "Revenue" is present on the panel content of Existing Objects Dialog
        await since('Object "Revenue" should be present on the panel content of Existing Objects Dialog')
            .expect(await existingObjectsDialog.getObjectFromObjectBrowseContainer('Revenue').isDisplayed())
            .toBe(true);
        // And I double click on "Gross Revenue" from the object browse container
        await existingObjectsDialog.doubleClickOnObject('Gross Revenue');

        // Then Object "Gross Revenue" is added to the dataset container
        await since('Object "Item" should be added to the dataset container')
            .expect(await existingObjectsDialog.getObjectFromDatasetContainer('Gross Revenue').isDisplayed())
            .toBe(true);
        // And I double click on "Profit" from the object browse container
        await existingObjectsDialog.doubleClickOnObject('Profit');

        // Then Object "Profit" is added to the dataset container
        await since('Object "Profit" should be added to the dataset container')
            .expect(await existingObjectsDialog.getObjectFromDatasetContainer('Profit').isDisplayed())
            .toBe(true);

        // When I click button "Add" on the existing objects dialog
        await existingObjectsDialog.clickOnBtn('Add');
        await browser.pause(2000);
        // Then The editor with title "Add Existing Objects" is closed
        const res = await dossierMojo.getMojoEditorWithTitle('Add Existing Objects').isDisplayed();
        await since('The editor with title "Add Existing Objects" should be closed').expect(res).toBe(false);
        // And The datasets panel should have dataset "New Dataset 1" after 5 seconds
        await datasetsPanel.getDatasetByName('New Dataset 1').waitForDisplayed();
        await since('The datasets panel should have dataset "New Dataset 1"')
            .expect(await datasetsPanel.getDatasetByName('New Dataset 1').isDisplayed())
            .toBe(true);
        await datasetsPanel.addObjectToVizByDoubleClick('City', 'attribute', 'retail-sample-data.xls');
        await datasetsPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');
        await since('The editor panel should have "attribute" named "City" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSection('City', 'attribute', 'Rows').isDisplayed())
            .toBe(true);
        await since('The editor panel should have "metric" named "Cost" on "Metrics" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Cost', 'metric', 'Metrics').isDisplayed())
            .toBe(true);
        await since('the editor panel should have the items "Metric Names" in the "Columns" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Metric Names', 'Columns').isDisplayed())
            .toBe(true);

        // Convert viz to Modern visualization and perform the following
        await baseVisualization.changeVizType('Visualization 1', 'Grid', 'Grid (Modern)');
        // switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        await baseFormatPanelReact.switchToGeneralSettingsTab();
        await newFormatPanelForGrid.expandSpacingSection();
        await newFormatPanelForGrid.clickColumnSizeFitOption('Fit to Container');
        await newFormatPanelForGrid.switchToTextFormatTab();
        await editorPanel.switchToEditorPanel();

        // Enabling/Disabling attribute forms in rows
        await editorPanelForGrid.multiSelectDisplayFormsFromDropZone('Latitude,Longitude', 'City', 'Rows');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('Annapolis');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('38.9785');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 3, 'Visualization 1'))
            .toBe('-76.4922');
        await editorPanelForGrid.multiSelectDisplayFormsFromDropZone('Latitude,Longitude', 'City', 'Rows');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('Annapolis');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('$12,310,165');

        // Enabling/Disabling attribute forms in column sets
        await editorPanelForGrid.removeFromDropZone('City', 'attribute');
        // drag "attribute" named "Month" from dataset "retail-sample-data.xls" to dropzone "Rows"
        await vizPanelForGrid.dragDSObjectToGridDZ('Month', 'attribute', 'retail-sample-data.xls', 'Rows');
        // drag "attribute" named "City" from dataset "retail-sample-data.xls" to dropzone "Columns" and drop it above "Cost"
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'City',
            'attribute',
            'retail-sample-data.xls',
            'Columns',
            'above',
            'Cost'
        );
        await since('The editor panel should have "attribute" named "Month" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Month', 'attribute', 'Rows').isDisplayed())
            .toBe(true);
        await since('The editor panel should have "attribute" named "City" on "Columns" section')
            .expect(await editorPanelForGrid.getObjectFromSection('City', 'attribute', 'Columns').isDisplayed())
            .toBe(true);
        await editorPanelForGrid.multiSelectDisplayFormsFromDropZone('Latitude,Longitude', 'City', 'Columns');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'Visualization 1'))
            .toBe('Annapolis');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('38.9785');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 3, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('-76.4922');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 4, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 2, 'Visualization 1'))
            .toBe('Cost');
        await editorPanelForGrid.multiSelectDisplayFormsFromDropZone('Latitude,Longitude', 'City', 'Columns');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'Visualization 1'))
            .toBe('Annapolis');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('Cost');

        // Adding Microchart with multiform attribute (selecting within dialog)
        await agGridVisualization.addMicrochartSet();
        await microchartConfigDialog.selectObject(1, 'Gross Revenue');
        await microchartConfigDialog.selectObject(2, 'Category');
        await browser.pause(1000);
        await microchartConfigDialog.confirmDialog();
        // The editor panel should have microchart with type "Sparkline" named "Gross Revenue Trend by Category" on "Gross Revenue Trend by Category" section
        await since(
            'The editor panel should have microchart with type "Sparkline" named "Gross Revenue Trend by Category" on "Gross Revenue Trend by Category" section'
        )
            .expect(
                await editorPanel
                    .getObjectFromSection(
                        'Gross Revenue Trend by Category',
                        'mc mc-sparkline',
                        'Gross Revenue Trend by Category'
                    )
                    .isDisplayed()
            )
            .toBe(true);

        // Adding Multiform attribute to Microchart (adding after microchart is created)
        // delete the Column Set named "Gross Revenue Trend by Category" from ag-grid
        await vizPanelForGrid.deleteColumnSet('Gross Revenue Trend by Category');
        await agGridVisualization.addMicrochartSet();
        await microchartConfigDialog.selectObject(1, 'Profit');
        await microchartConfigDialog.selectObject(2, 'Brand');
        await browser.pause(1000);
        await microchartConfigDialog.confirmDialog();
        // The editor panel should have microchart with type "Sparkline" named "Profit Trend by Brand" on "Profit Trend by Brand" section
        await since(
            'The editor panel should have microchart with type "Sparkline" named "Profit Trend by Brand" on "Profit Trend by Brand" section'
        )
            .expect(
                await editorPanel
                    .getObjectFromSection('Profit Trend by Brand', 'mc mc-sparkline', 'Profit Trend by Brand')
                    .isDisplayed()
            )
            .toBe(true);
        // drag "attribute" named "Category" from dataset "New Dataset 1" to microchart "Profit Trend by Brand" in ag-grid
        await vizPanelForGrid.dragDSObjectToMicrochartDZwithPosition(
            'Category',
            'attribute',
            'New Dataset 1',
            'Profit Trend by Brand',
            'above',
            'Profit Trend by Brand'
        );
        await vizPanelForGrid.clickButtonInWarningDialog('Continue');
        // The editor panel should have "attribute" named "Category" on "Profit Trend by Brand" section
        await since('The editor panel should have "attribute" named "Category" on "Profit Trend by Brand" section')
            .expect(
                await editorPanelForGrid
                    .getObjectFromSection('Category', 'attribute', 'Profit Trend by Brand')
                    .isDisplayed()
            )
            .toBe(true);

        // Enabling/Disabling form names (Automatic, ON, OFF, Form Name Only, Show Attribute name once)
        // remove "attribute" named "Month" from the Grid Editor Panel
        await editorPanelForGrid.removeFromDropZone('Month', 'attribute');
        //remove the "attribute" named "City" in column set "Column Set 1" in Ag-Grid Editor Panel
        await editorPanelForGrid.removeObjectInColumnSet('City', 'Column Set 1');
        // drag "attribute" named "City" from dataset "retail-sample-data.xls" to dropzone "Rows"
        await vizPanelForGrid.dragDSObjectToGridDZ('City', 'attribute', 'retail-sample-data.xls', 'Rows');
        // drag "attribute" named "Month" from dataset "retail-sample-data.xls" to dropzone "Column Set 1" and drop it above "Cost" by offset "0" and "-5"
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Month',
            'attribute',
            'retail-sample-data.xls',
            'Column Set 1',
            'above',
            'Cost',
            0,
            -5
        );
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('City');
        // multiselect display forms "Latitude,Longitude" for object "City" in dropzone "Rows"
        await editorPanelForGrid.multiSelectDisplayFormsFromDropZone('Latitude,Longitude', 'City', 'Rows');
        // open the More Options dialog for the visualization "Visualization 1" through the visualization context menu
        await agGridVisualization.openContextMenu('Visualization 1');
        // click on the "More Options" menu item
        await agGridVisualization.selectContextMenuOption('More Options...');
        // select "On" from display attribute form mode pull down list in More Options dialog
        await moreOptions.selectDisplayAttributeFormMode('On');
        // save and close More Options dialog
        await moreOptions.saveAndCloseMoreOptionsDialog();
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('City ID');

        await agGridVisualization.openContextMenu('Visualization 1');
        await agGridVisualization.selectContextMenuOption('More Options...');
        // select "Form name only" from display attribute form mode pull down list in More Options dialog
        await moreOptions.selectDisplayAttributeFormMode('Form name only');
        await moreOptions.saveAndCloseMoreOptionsDialog();
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('ID');

        await agGridVisualization.openContextMenu('Visualization 1');
        await agGridVisualization.selectContextMenuOption('More Options...');
        // select "Show attribute name once" from display attribute form mode pull down list in More Options dialog
        await moreOptions.selectDisplayAttributeFormMode('Show attribute name once');
        await moreOptions.saveAndCloseMoreOptionsDialog();
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('City ID');

        await agGridVisualization.openContextMenu('Visualization 1');
        await agGridVisualization.selectContextMenuOption('More Options...');
        // select "Automatic" from display attribute form mode pull down list in More Options dialog
        await moreOptions.selectDisplayAttributeFormMode('Automatic');
        await moreOptions.saveAndCloseMoreOptionsDialog();
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('City ID');

        // Moving Forms in rows and column sets
        // right click on element "City ID" and select "Move Right" from ag-grid "Visualization 1"
        await agGridVisualization.openContextMenuItemForHeader('City ID', 'Move Right', 'Visualization 1');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('City Latitude');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('City ID');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 3, 'Visualization 1'))
            .toBe('City Longitude');
        await agGridVisualization.openContextMenuItemForHeader('City ID', 'Move Right', 'Visualization 1');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('City Latitude');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('City Longitude');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 3, 'Visualization 1'))
            .toBe('City ID');

        // right click on element "City Longitude" and select "Move Left" from ag-grid "Visualization 1"
        await agGridVisualization.openContextMenuItemForHeader('City Longitude', 'Move Left', 'Visualization 1');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('City Longitude');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('City Latitude');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 3, 'Visualization 1'))
            .toBe('City ID');

        // multiselect display forms "Latitude,Longitude" for object "City" in dropzone "Rows"
        await editorPanelForGrid.multiSelectDisplayFormsFromDropZone('Latitude,Longitude', 'City', 'Rows');

        // switch to pause mode
        await dossierAuthoringPage.actionOnToolbar('Pause Data Retrieval');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        // remove "attribute" named "City" from the Grid Editor Panel
        await editorPanelForGrid.removeFromDropZone('City', 'attribute');
        // remove the "attribute" named "Month" in column set "Column Set 1" in Ag-Grid Editor Panel
        await editorPanelForGrid.removeObjectInColumnSet('Month', 'Column Set 1');
        // drag "attribute" named "Month" from dataset "retail-sample-data.xls" to dropzone "Rows"
        await vizPanelForGrid.dragDSObjectToGridDZ('Month', 'attribute', 'retail-sample-data.xls', 'Rows');
        // drag "attribute" named "City" from dataset "retail-sample-data.xls" to dropzone "Column Set 1" and drop it above "Cost" by offset "0" and "-5"
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'City',
            'attribute',
            'retail-sample-data.xls',
            'Column Set 1',
            'above',
            'Cost',
            0,
            -5
        );

        // switch to design mode
        await dossierAuthoringPage.actionOnToolbar('Resume Data Retrieval');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        // the grid cell in ag-grid "Visualization 1" at "0", "1" has text "Annapolis"
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'Visualization 1'))
            .toBe('Annapolis');
        // multiselect display forms "Latitude,Longitude" for object "City" in dropzone "Column Set 1"
        await editorPanelForGrid.multiSelectDisplayFormsFromDropZone('Latitude,Longitude', 'City', 'Column Set 1');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('38.9785');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 3, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('-76.4922');
    });
});
