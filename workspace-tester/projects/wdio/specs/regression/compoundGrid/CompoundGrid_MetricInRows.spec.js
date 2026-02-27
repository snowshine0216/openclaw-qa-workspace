import * as gridConstants from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';

describe('Compound Grid Metric in Rows Test', () => {
    let {
        loginPage,
        libraryPage,
        baseContainer,
        gridAuthoring,
        editorPanelForGrid,
        vizPanelForGrid,
        contentsPanel,
        toolbar,
        derivedMetricEditor,
        datasetPanel,
        thresholdEditor,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridTestUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.handleError();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC41275] Compound Grid - Simple Creation', async () => {
        // # 1. Load Dossier
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.CompoundGridMetricInRows.id,
            projectId: gridConstants.CompoundGridMetricInRows.project.id,
        });

        // # 2.
        // When I drag "attribute" named "Month" from dataset "retail-sample-data.xls" to dropzone "Rows"
        await vizPanelForGrid.dragDSObjectToGridDZ('Month', 'attribute', 'retail-sample-data.xls', 'Rows');
        // Then the editor panel should have the items "Month" in the "Rows" zone
        await since('The editor panel should have the items "Month" in the "Rows" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Month', 'Rows').isDisplayed())
            .toBe(true);
        // And I drag "attribute" named "Supplier" from dataset "retail-sample-data.xls" to dropzone "Rows" and drop it below "Month"
        await vizPanelForGrid.dragDSObjectToDZwithPosition('Supplier', 'attribute', 'retail-sample-data.xls', 'Rows', 'below', 'Month');
        // Then the editor panel should have the items "Month,Supplier" in the "Rows" zone
        await since('The editor panel should have the items "Month" in the "Rows" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Month', 'Rows').isDisplayed())
            .toBe(true);
        await since('The editor panel should have the items "Supplier" in the "Rows" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Supplier', 'Rows').isDisplayed())
            .toBe(true);

        // When I drag "metric" named "Cost" from dataset "retail-sample-data.xls" to dropzone "Metrics"
        await vizPanelForGrid.dragDSObjectToGridDZ('Cost', 'metric', 'retail-sample-data.xls', 'Metrics');
        // And I drag "metric" named "Revenue" from dataset "retail-sample-data.xls" to dropzone "Metrics" and drop it below "Cost"
        await vizPanelForGrid.dragDSObjectToDZwithPosition('Revenue', 'metric', 'retail-sample-data.xls', 'Metrics', 'below', 'Cost');
        // Then the editor panel should have the items "Cost,Revenue" in the "Metrics" zone
        await since('The editor panel should have the items "Cost" in the "Metrics" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Cost', 'Metrics').isDisplayed())
            .toBe(true);
        await since('The editor panel should have the items "Revenue" in the "Metrics" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Revenue', 'Metrics').isDisplayed())
            .toBe(true);
        // And the editor panel should have the items "Metric Names" in the "Columns" zone
        await since('The editor panel should have the items "Metric Names" in the "Columns" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Metric Names', 'Columns').isDisplayed())
            .toBe(true);

        // # 3.
        // When I change the selected visualization to "Compound Grid" from context menu
        await gridAuthoring.changeVizToCompoundGrid('Visualization 1');
        // Then the editor panel should have the items "Cost,Revenue" in the "Column Set 1" zone
        await since('The editor panel should have the items "Cost" in the "Column Set 1" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Cost', 'Column Set 1').isDisplayed())
            .toBe(true);
        await since('The editor panel should have the items "Revenue" in the "Column Set 1" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Revenue', 'Column Set 1').isDisplayed())
            .toBe(true);

        // # 4.
        // When I add a column set for the compound grid
        await gridAuthoring.addColumnSet();
        // # 5.
        // And I drag "metric" named "Unit Price" from dataset "retail-sample-data.xls" to Column Set "Column Set 2" in compound grid
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ('Unit Price', 'metric', 'retail-sample-data.xls', 'Column Set 2');
        // Then the editor panel should have the items "Unit Price" in the "Column Set 2" zone
        await since('The editor panel should have the items "Unit Price" in the "Column Set 2" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Unit Price', 'Column Set 2').isDisplayed())
            .toBe(true);

        // # 6.
        // When I add a column set for the compound grid
        await gridAuthoring.addColumnSet();
        // And I drag "attribute" named "Item Category" from dataset "retail-sample-data.xls" to Column Set "Column Set 3" in compound grid
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ('Item Category', 'attribute', 'retail-sample-data.xls', 'Column Set 3');
        // And I drag "metric" named "Units Available" from dataset "retail-sample-data.xls" to dropzone "Column Set 3" and drop it below "Item Category"
        await vizPanelForGrid.dragDSObjectToColumnSetDZwithPosition('Units Available', 'metric', 'retail-sample-data.xls', 'Column Set 3', 'below', 'Item Category');
        // Then the editor panel should have the items "Item Category,Units Available" in the "Column Set 3" zone
        await since('The editor panel should have the items "Item Category" in the "Column Set 3" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Item Category', 'Column Set 3').isDisplayed())
            .toBe(true);
        await since('The editor panel should have the items "Units Available" in the "Column Set 3" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Units Available', 'Column Set 3').isDisplayed())
            .toBe(true);

        // # 7.
        // When I remove "attribute" named "Month" from the Grid Editor Panel
        await editorPanelForGrid.removeFromDropZone('Month', 'Attribute');
        // Then the editor panel should have the items "Supplier" in the "Rows" zone
        await since('The editor panel should have the items "Supplier" in the "Rows" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Supplier', 'Rows').isDisplayed())
            .toBe(true);

        // # 8.
        // When I remove "metric" named "Revenue" from the Grid Editor Panel
        await editorPanelForGrid.removeFromDropZone('Revenue', 'Metric');
        // Then the editor panel should have the items "Cost" in the "Column Set 1" zone
        await since('The editor panel should have the items "Cost" in the "Column Set 1" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Cost', 'Column Set 1').isDisplayed())
            .toBe(true);
        
        // When I remove "attribute" named "Item Category" from the Grid Editor Panel
        await editorPanelForGrid.removeFromDropZone('Item Category', 'Attribute');
        // Then the editor panel should have the items "Units Available" in the "Column Set 3" zone
        await since('The editor panel should have the items "Units Available" in the "Column Set 3" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Units Available', 'Column Set 3').isDisplayed())
            .toBe(true);

        // # 9.
        // When I replace the "attribute" named "Supplier" with the "attribute" named "City" in the Grid Editor Panel
        await editorPanelForGrid.replaceObjectByName('Supplier', 'attribute', 'City', 'attribute');
        // Then the editor panel should have the items "City" in the "Rows" zone
        await since('The editor panel should have the items "City" in the "Rows" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('City', 'Rows').isDisplayed())
            .toBe(true);

        // When I replace the "metric" named "Unit Price" with the "metric" named "Revenue" in the Grid Editor Panel
        await editorPanelForGrid.replaceObjectByName('Unit Price', 'metric', 'Revenue', 'metric');
        // Then the editor panel should have the items "Revenue" in the "Column Set 2" zone
        await since('The editor panel should have the items "Revenue" in the "Column Set 2" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Revenue', 'Column Set 2').isDisplayed())
            .toBe(true);

        // # 10.
        // When I rename the Column Set at position "1" to "First Column Set" from compound grid
        await vizPanelForGrid.renameColumnSet('1', 'First Column Set');
        // Then the Column Set named "First Column Set" exists
        await since('The Column Set named "First Column Set" exists')
            .expect(await vizPanelForGrid.getColumnSetDropZone('First Column Set').isDisplayed())
            .toBe(true);

        // When I rename the Column Set at position "3" to "Last Column Set" from compound grid
        await vizPanelForGrid.renameColumnSet('3', 'Last Column Set');
        // Then the Column Set named "Last Column Set" exists
        await since('The Column Set named "Last Column Set" exists')
            .expect(await vizPanelForGrid.getColumnSetDropZone('Last Column Set').isDisplayed())
            .toBe(true);

        // # 11.
        // When I delete the Column Set named "Column Set 2" from compound grid
        await vizPanelForGrid.deleteColumnSet('Column Set 2');
        // Then the Column Set named "Column Set 2" does not exist
        await since('The Column Set named "Column Set 2" does not exist')
            .expect(await vizPanelForGrid.getColumnSetDropZone('Column Set 2').isDisplayed())
            .toBe(false);

        // # 12.
        // When I drag Column Set named "Last Column Set" above Column Set "First Column Set" in compound grid
        await vizPanelForGrid.reorderColumnSet('Last Column Set', 'above', 'First Column Set');
        // Then the Column Sets exist in this order "Last Column Set,First Column Set"
        // take screenshot of editor panel
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'The Column Sets exist in this order "Last Column Set,First Column Set"',
            'TC41275_01',
        );


        // When I drag Column Set named "First Column Set" above Column Set "Last Column Set" in compound grid
        await vizPanelForGrid.reorderColumnSet('First Column Set', 'above', 'Last Column Set');
        // Then the Column Sets exist in this order "First Column Set,Last Column Set"
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'The Column Sets exist in this order "First Column Set,Last Column Set"',
            'TC41275_02',
        );

        // # 13.
        // When I toggle the Column Set named "First Column Set" in compound grid
        await vizPanelForGrid.expandCollapseColumnSet('First Column Set');
        // Then the Column Set named "First Column Set" is collapsed in compound grid
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'The Column Set named "First Column Set" is collapsed in compound grid',
            'TC41275_03',
        );
        // When I toggle the Column Set named "First Column Set" in compound grid
        await vizPanelForGrid.expandCollapseColumnSet('First Column Set');
        // Then the Column Set named "First Column Set" is expanded in compound grid
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'The Column Set named "First Column Set" is expanded in compound grid',
            'TC41275_04',
        );

        // # 14. Not Applicable Yet
    
        // # 15.
        // When I switch page to "Steps 15-16"
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Steps 15-16' });
        // Then the editor panel should have the items "Month" in the "Rows" zone
        await since('The editor panel should have the items "Month" in the "Rows" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Month', 'Rows').isDisplayed())
            .toBe(true);
        // And the editor panel should have the items "Cost" in the "Metrics" zone
        await since('The editor panel should have the items "Cost" in the "Metrics" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Cost', 'Metrics').isDisplayed())
            .toBe(true);
        // When I change the selected visualization to "Compound Grid" from context menu
        await gridAuthoring.changeVizToCompoundGrid('Visualization 1');
        // Then the editor panel should have the items "Month" in the "Rows" zone
        await since('The editor panel should have the items "Month" in the "Rows" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Month', 'Rows').isDisplayed())
            .toBe(true);
        // And the editor panel should have the items "Cost" in the "Column Set 1" zone
        await since('The editor panel should have the items "Cost" in the "Column Set 1" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Cost', 'Column Set 1').isDisplayed())
            .toBe(true);

        // # 16.
        // When I change the selected visualization to "Grid" from context menu and prevent popup
        await baseContainer.changeViz('Grid', 'Visualization 1', true);
        // Then the editor panel should have the items "Month" in the "Rows" zone
        await since('The editor panel should have the items "Month" in the "Rows" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Month', 'Rows').isDisplayed())
            .toBe(true);
        // And the editor panel should have the items "Cost" in the "Metrics" zone
        await since('The editor panel should have the items "Cost" in the "Metrics" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Cost', 'Metrics').isDisplayed())
            .toBe(true);

        // # 17.
        // When I switch page to "Steps 17-18"
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Steps 17-18' });
        // Then The editor panel should have "attribute" named "Month" on "Horizontal" section
        await since('The editor panel should have "attribute" named "Month" on "Horizontal" section')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Month', 'Horizontal').isDisplayed())
            .toBe(true);
        // And The editor panel should have "metric" named "Cost" on "Vertical" section
        await since('The editor panel should have "metric" named "Cost" on "Vertical" section')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Cost', 'Vertical').isDisplayed())
            .toBe(true);

        // When I change the selected visualization to "Compound Grid" from context menu
        await gridAuthoring.changeVizToCompoundGrid('Visualization 1');
        // Then the editor panel should have the items "Month" in the "Rows" zone
        await since('The editor panel should have the items "Month" in the "Rows" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Month', 'Rows').isDisplayed())
            .toBe(true);
        // And the editor panel should have the items "Cost" in the "Column Set 1" zone
        await since('The editor panel should have the items "Cost" in the "Column Set 1" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Cost', 'Column Set 1').isDisplayed())
            .toBe(true);

        // # 18.
        // When I change the selected visualization to "Vertical Bar Chart" from context menu
        await baseContainer.changeViz('Vertical Bar Chart', 'Visualization 1', true);
        // Then the editor panel should have the items "Cost" in the "Vertical" zone
        await since('The editor panel should have the items "Cost" in the "Vertical" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Cost', 'Vertical').isDisplayed())
            .toBe(true);
        // And the editor panel should have the items "Month" in the "Horizontal" zone
        await since('The editor panel should have the items "Month" in the "Horizontal" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Month', 'Horizontal').isDisplayed())
            .toBe(true);

        // # 19. Undo/Redo Tests
        // When I switch page to "Step 19"
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Step 19' });

        // When I add a column set for the compound grid
        await gridAuthoring.addColumnSet();
        // And I drag "metric" named "Revenue" from dataset "retail-sample-data.xls" to Column Set "Column Set 2" in compound grid
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ('Revenue', 'metric', 'retail-sample-data.xls', 'Column Set 2');
        // Then the Column Set named "Column Set 2" exists
        await since('The Column Set named "Column Set 2" exists')
            .expect(await vizPanelForGrid.getColumnSetDropZone('Column Set 2').isDisplayed())
            .toBe(true);
        // And the editor panel should have the items "Revenue" in the "Column Set 2" zone
        await since('The editor panel should have the items "Revenue" in the "Column Set 2" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Revenue', 'Column Set 2').isDisplayed())
            .toBe(true);

        // When I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // Then the editor panel should not have the items "Revenue" in the "Column Set 2" zone
        await since('The editor panel should not have the items "Revenue" in the "Column Set 2" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Revenue', 'Column Set 2').isDisplayed())
            .toBe(false);
        // When I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // Then the Column Set named "Column Set 2" does not exist
        await since('The Column Set named "Column Set 2" does not exist')
            .expect(await vizPanelForGrid.getColumnSetDropZone('Column Set 2').isDisplayed())
            .toBe(false);

        // When I select "Redo" from toolbar
        await toolbar.clickButtonFromToolbar('Redo');
        // Then the Column Set named "Column Set 2" exists
        await since('The Column Set named "Column Set 2" exists')
            .expect(await vizPanelForGrid.getColumnSetDropZone('Column Set 2').isDisplayed())
            .toBe(true);
        // When I select "Redo" from toolbar
        await toolbar.clickButtonFromToolbar('Redo');
        // Then the editor panel should have the items "Revenue" in the "Column Set 2" zone
        await since('The editor panel should have the items "Revenue" in the "Column Set 2" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Revenue', 'Column Set 2').isDisplayed())
            .toBe(true);
    });

    it('[TC69866_01] Compound Grid - Metrics in Rows - Basic Manipulations', async () => {
        // # 1. Load Dossier
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.CompoundGridMetricInRowsManipulation.id,
            projectId: gridConstants.CompoundGridMetricInRowsManipulation.project.id,
        });

        // # Setup initial state
        // ## Rows
        // When I drag "attribute" named "Supplier" from dataset "retail-sample-data.xls" to dropzone "Rows"
        await vizPanelForGrid.dragDSObjectToGridDZ('Supplier', 'attribute', 'retail-sample-data.xls', 'Rows');
        // And I drag "metric" named "Cost" from dataset "retail-sample-data.xls" to dropzone "Rows" and drop it below "Supplier"
        await vizPanelForGrid.dragDSObjectToDZwithPosition('Cost', 'metric', 'retail-sample-data.xls', 'Rows', 'below', 'Supplier');
        // And I drag "metric" named "Revenue" from dataset "retail-sample-data.xls" to dropzone "Rows" and drop it below "Cost"
        await vizPanelForGrid.dragDSObjectToDZwithPosition('Revenue', 'metric', 'retail-sample-data.xls', 'Rows', 'below', 'Cost');
        // ## Column Set 1
        // And I drag "attribute" named "Month" from dataset "retail-sample-data.xls" to Column Set "Column Set 1" in compound grid
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ('Month', 'attribute', 'retail-sample-data.xls', 'Column Set 1');
        // # Verify state
        // Then the editor panel should have the items "Supplier,Cost,Revenue" in the "Rows" zone
        // And the editor panel should have the items "Month" in the "Column Set 1" zone
        // take screenshot of editor panel
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'Initial State with Metrics in Rows',
            'TC69866_01_01',
        );

        // # Remove the Cost metric, ensure the other items are preserverd
        // When I remove "metric" named "Cost" from the Grid Editor Panel
        await editorPanelForGrid.removeFromDropZone('Cost', 'Metric');
        // Then the editor panel should have the items "Supplier,Revenue" in the "Rows" zone
        // And the editor panel should not have the items "Cost" in the "Rows" zone
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'After removing Cost metric from Rows',
            'TC69866_01_02',
        );

        // When I replace the "attribute" named "Supplier" with the "attribute" named "Item Category" in the Grid Editor Panel
        await editorPanelForGrid.replaceObjectByName('Supplier', 'attribute', 'Item Category', 'attribute');
        // Then the editor panel should have the items "Item Category,Revenue" in the "Rows" zone
        // And the editor panel should not have the items "Supplier" in the "Rows" zone
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'After replacing Supplier with Item Category in Rows',
            'TC69866_01_03',
        );

        // When I drag "attribute" named "Supplier" from dataset "retail-sample-data.xls" to dropzone "Rows" and drop it below "Revenue"
        await vizPanelForGrid.dragDSObjectToDZwithPosition('Supplier', 'attribute', 'retail-sample-data.xls', 'Rows', 'below', 'Revenue');
        // Then the editor panel should have the items "Item Category,Revenue,Supplier" in the "Rows" zone
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'After re-adding Supplier to Rows',
            'TC69866_01_04',
        );

        // When I replace the "attribute" named "Supplier" with the "attribute" named "City" in the Grid Editor Panel
        await editorPanelForGrid.replaceObjectByName('Supplier', 'attribute', 'City', 'attribute');
        // Then the editor panel should have the items "Item Category,Revenue,City" in the "Rows" zone
        // And the editor panel should not have the items "Supplier" in the "Rows" zone
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'After replacing Supplier with City in Rows',
            'TC69866_01_05',
        );
    });

    it('[TC69866_02] Compound Grid - Metrics in Rows - Derived Metric', async () => {
        // # 1. Load Dossier
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.CompoundGridMetricInRowsManipulation.id,
            projectId: gridConstants.CompoundGridMetricInRowsManipulation.project.id,
        });

        // # Setup initial state
        // ## Rows
        // When I drag "metric" named "Cost" from dataset "retail-sample-data.xls" to dropzone "Rows"
        await vizPanelForGrid.dragDSObjectToGridDZ('Cost', 'metric', 'retail-sample-data.xls', 'Rows');
        // ## Column Set 1
        // When I drag "attribute" named "Month" from dataset "retail-sample-data.xls" to Column Set "Column Set 1" in compound grid
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ('Month', 'attribute', 'retail-sample-data.xls', 'Column Set 1');
        // ## Column Set 2
        // When I add a column set for the compound grid
        await gridAuthoring.addColumnSet();
        // And I drag "attribute" named "Supplier" from dataset "retail-sample-data.xls" to Column Set "Column Set 2" in compound grid
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ('Supplier', 'attribute', 'retail-sample-data.xls', 'Column Set 2'); 
        // # Verify state
        // Then the editor panel should have the items "Cost" in the "Rows" zone
        // And the editor panel should have the items "Month" in the "Column Set 1" zone
        // And the editor panel should have the items "Supplier" in the "Column Set 2" zone
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'Initial State for Derived Metric Creation',
            'TC69866_02_01',
        );

        // # Create derived metric from a metric in the Rows zone
        // When I open Derived Metric Editor for "metric" named "Cost" for "create" operation in the Editor Panel
        await editorPanelForGrid.openDerivedObjectEditor('Cost', 'metric', 'create');
        // Then The Metric Editor should be "displayed"
        // When I click on the Switch to "Formula" Editor button of DM Editor
        await derivedMetricEditor.switchMode('Formula');
        // And I set the Metric Name value to "Test"
        await derivedMetricEditor.setMetricName('Test');
        // And I click on the "Save" button of DM Editor
        await derivedMetricEditor.saveMetric();
        // Then The datasets panel should have "metric" named "Test" in dataset "retail-sample-data.xls"
        await since('The datasets panel should have "metric" named "Test" in dataset "retail-sample-data.xls"')
            .expect(
                await datasetPanel
                    .getObjectFromDataset('Test', 'metric', 'retail-sample-data.xls')
                    .isExisting()
            )
            .toBe(true);
        // And the editor panel should have the items "Cost,Test" in the "Rows" zone
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'After Derived Metric Creation',
            'TC69866_02_02',
        );
        // And the grid cell in visualization "Visualization 1" at "2", "1" has text "Cost"
        await since('the grid cell in visualization "Visualization 1" at "2", "1" has text "Cost"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('Cost');
        // And the grid cell in visualization "Visualization 1" at "3", "1" has text "Test"
        await since('the grid cell in visualization "Visualization 1" at "3", "1" has text "Test"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Test');
    });

    it('[TC69866_03] Compound Grid - Metrics in Rows - Remove Last Column Set', async () => {
        // # 1. Load Dossier
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.CompoundGridMetricInRowsManipulation.id,
            projectId: gridConstants.CompoundGridMetricInRowsManipulation.project.id,
        });

        // # Setup initial state
        // ## Rows
        // When I drag "metric" named "Cost" from dataset "retail-sample-data.xls" to dropzone "Rows"
        await vizPanelForGrid.dragDSObjectToGridDZ('Cost', 'metric', 'retail-sample-data.xls', 'Rows');
        // And I drag "metric" named "Revenue" from dataset "retail-sample-data.xls" to dropzone "Rows" and drop it below "Cost"
        await vizPanelForGrid.dragDSObjectToDZwithPosition('Revenue', 'metric', 'retail-sample-data.xls', 'Rows', 'below', 'Cost');
        // ## Column Set 1
        // When I drag "attribute" named "Month" from dataset "retail-sample-data.xls" to Column Set "Column Set 1" in compound grid
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ('Month', 'attribute', 'retail-sample-data.xls', 'Column Set 1');

        // # Verify
        // Then the editor panel should have the items "Cost,Revenue" in the "Rows" zone
        // And the editor panel should have the items "Month" in the "Column Set 1" zone
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'Initial State before Deleting Last Column Set',
            'TC69866_03_01',
        );

        // When I delete the Column Set named "Column Set 1" from compound grid
        await vizPanelForGrid.deleteColumnSet('Column Set 1');
        // # Ensure the Row level data wasn't removed
        // Then the editor panel should have the items "Cost,Revenue" in the "Rows" zone
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'After Deleting Last Column Set',
            'TC69866_03_02',
        );
        // # But the rest were removed
        // And the editor panel should not have the items "Month" in the "Column Set 1" zone
    });

    it('[TC69866_04] Compound Grid - Metrics in Rows - Thresholds', async () => {
        // # 1. Load Dossier
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.CompoundGridMetricInRowsManipulation.id,
            projectId: gridConstants.CompoundGridMetricInRowsManipulation.project.id,
        });

        // # Initial setup
        // When I drag "metric" named "Cost" from dataset "retail-sample-data.xls" to dropzone "Rows"
        await vizPanelForGrid.dragDSObjectToGridDZ('Cost', 'metric', 'retail-sample-data.xls', 'Rows');
        // And I drag "attribute" named "Month" from dataset "retail-sample-data.xls" to Column Set "Column Set 1" in compound grid
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ('Month', 'attribute', 'retail-sample-data.xls', 'Column Set 1');

        // # Apply a threshold
        // # When I open the Thresholds editor for object "Cost" from the grid visualization "Visualization 1"
        // When I open the Thresholds editor for object "Cost" from the Rows zone for compound grid
        await thresholdEditor.openThresholdEditorFromCompoundGridDropzone('Cost');
        // And I open the color band drop down menu
        await thresholdEditor.openSimpleThresholdColorBandDropDownMenu();
        // And I select the color band "Traffic Lights" in simple threshold editor
        await thresholdEditor.selectSimpleThresholdColorBand('Traffic Lights');
        // And I save and close Simple Thresholds Editor
        await thresholdEditor.saveAndCloseSimThresholdEditor();
        // # Verify the colors
        // Then the grid cell in visualization "Visualization 1" at "2", "2" has style "background-color" with value "rgba(236, 123, 117, 1)"
        // And the grid cell in visualization "Visualization 1" at "2", "5" has style "background-color" with value "rgba(246, 219, 127, 1)"
        // And the grid cell in visualization "Visualization 1" at "2", "9" has style "background-color" with value "rgba(132, 200, 123, 1)"
        // take screenshot of grid visualization
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Thresholds applied to Metric in Rows - Traffic Lights',
            'TC69866_04_01',
        );

        // # Add a column set
        // When I add a column set for the compound grid
        await gridAuthoring.addColumnSet();
        // And I drag "attribute" named "Supplier" from dataset "retail-sample-data.xls" to Column Set "Column Set 2" in compound grid
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ('Supplier', 'attribute', 'retail-sample-data.xls', 'Column Set 2');

        // # Apply a new threshold
        // # When I open the Thresholds editor for object "Cost" from the grid visualization "Visualization 1"
        // When I open the Thresholds editor for object "Cost" from the Rows zone for compound grid
        await thresholdEditor.openThresholdEditorFromCompoundGridDropzone('Cost');
        // And I open the color band drop down menu
        await thresholdEditor.openSimpleThresholdColorBandDropDownMenu();
        // And I select the color band "Business Blue" in simple threshold editor
        await thresholdEditor.selectSimpleThresholdColorBand('Business Blue');
        // Then I save and close Simple Thresholds Editor
        await thresholdEditor.saveAndCloseSimThresholdEditor();
        // # Verify the colors on both column sets
        // ## CS 1
        // Then the grid cell in visualization "Visualization 1" at "2", "2" has style "background-color" with value "rgba(164, 203, 230, 1)"
        // And the grid cell in visualization "Visualization 1" at "2", "3" has style "background-color" with value "rgba(210, 224, 232, 1)"
        // And the grid cell in visualization "Visualization 1" at "2", "5" has style "background-color" with value "rgba(128, 173, 217, 1)"
        // ## CS 2
        // And the grid cell in visualization "Visualization 1" at "2", "14" has style "background-color" with value "rgba(46, 120, 187, 1)"
        // And the grid cell in visualization "Visualization 1" at "2", "15" has style "background-color" with value "rgba(164, 203, 230, 1)"
        // And the grid cell in visualization "Visualization 1" at "2", "17" has style "background-color" with value "rgba(210, 224, 232, 1)"
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Thresholds applied to Metric in Rows - Business Blue on both Column Sets',
            'TC69866_04_02',
        );
    });
});
