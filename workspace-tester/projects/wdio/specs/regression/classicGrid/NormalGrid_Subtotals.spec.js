import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';
import * as gridConstants from '../../../constants/grid.js';

describe('Subtotals_Grid', () => {
    let {
        vizPanelForGrid,
        datasetPanel,
        libraryPage,
        loginPage,
        editorPanel,
        agGridVisualization,
        gridAuthoring,
        editorPanelForGrid,
        dossierAuthoringPage,
        loadingDialog,
        contentsPanel,
        visualizationContextMenu,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.handleError();
    });

    it('[TC2696] Subtotals for a grid: 3AttributesInRows_2MetricInColumns', async () => {
        // Background steps
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.Subtotals_Grid.id,
            projectId: gridConstants.Subtotals_Grid.project.id,
        });
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        // Step 2 - show subtotals
        await editorPanelForGrid.showTotal();
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC2696_1',
            'ShowTotalsForAllAttributes'
        );

        // Step 3 - remove subtotals from 1st attribute
        await editorPanelForGrid.createSubtotalsFromEditorPanel('Month', 'attribute', 'Total');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC2696_2',
            'RemoveTotalsForMonth'
        );

        // Step 4 - add other totals for 2nd attribute
        await editorPanelForGrid.createSubtotalsFromEditorPanel('Item Category', 'attribute', 'Average,Maximum,Minimum,Mode');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC2696_3',
            'ShowTotalsForItemCategory'
        );

        // Step 5 - Disable show total from metric context menu
        await vizPanelForGrid.toggleShowTotalsFromMetric('Cost', 'Visualization 1');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await takeScreenshotByElement(vizPanelForGrid.getContainer('Visualization 1'), 'TC2696_4', 'RemoveShowTotals');

        // Step 6 - click on show totals of Cost again
        await vizPanelForGrid.toggleShowTotalsFromMetric('Cost', 'Visualization 1');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await takeScreenshotByElement(vizPanelForGrid.getContainer('Visualization 1'), 'TC2696_5', 'EnableShowTotals');

        // Step 7 - move totals to bottom
        await vizPanelForGrid.changeSubtotalPosition('Total', 'Move to bottom', 'Visualization 1');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC2696_6',
            'MoveSubtotalsToBottom'
        );
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Page 1' });
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Step 8 - new viz
        await editorPanelForGrid.showTotal();
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await gridAuthoring.gridCellOperations.moveScrollBar('right', 1300, 'Visualization 1');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC2696_7',
            'Totals for Attribute in Columns'
        );
    });
    it('[TC2711_1] Subtotals for a grid with attribute forms: attributes in rows and column, xtab', async () => {
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.Subtotals_TC2711.id,
            projectId: gridConstants.Subtotals_TC2711.project.id,
        });
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 3' });
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await editorPanelForGrid.showTotal();
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        await since(
            'The grid cell in visualization "Visualization 1" at "3", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Total');

        await since(
            'The grid cell in visualization "Visualization 1" at "3", "3" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 3, 'Visualization 1'))
            .toBe('595,673.60');

        await since(
            'The grid cell in visualization "Visualization 1" at "4", "3" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(4, 3, 'Visualization 1'))
            .toBe('68,257.42');

        await since(
            'The grid cell in visualization "Visualization 1" at "12", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(12, 2, 'Visualization 1'))
            .toBe('Total');

        // Move subtotal to bottom
        await vizPanelForGrid.changeSubtotalPosition('Total', 'Move to bottom', 'Visualization 1');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        await since(
            'The grid cell in visualization "Visualization 1" at "10", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(10, 1, 'Visualization 1'))
            .toBe('Total');

        await since(
            'The grid cell in visualization "Visualization 1" at "10", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(10, 2, 'Visualization 1'))
            .toBe('68,257.42');

        await since(
            'The grid cell in visualization "Visualization 1" at "3", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('Sunday');

        // Enable subtotals for attribute on the row
        await editorPanelForGrid.createSubtotalsFromEditorPanel('Year', 'attribute', 'Total');

        await since(
            'The grid cell in visualization "Visualization 1" at "3", "9" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 9, 'Visualization 1'))
            .toBe('20,500.02');

        await since(
            'The grid cell in visualization "Visualization 1" at "1", "9" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 9, 'Visualization 1'))
            .toBe('Total');

        await since(
            'The grid cell in visualization "Visualization 1" at "1", "10" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 10, 'Visualization 1'))
            .toBe('Total');

        await since(
            'The grid cell in visualization "Visualization 1" at "5", "9" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(5, 9, 'Visualization 1'))
            .toBe('97');

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 4' });
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await editorPanelForGrid.createSubtotalsFromEditorPanel('Airline Name', 'attribute', 'Total');
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Total');

        await since(
            'The grid cell in visualization "Visualization 1" at "3", "4" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 4, 'Visualization 1'))
            .toBe('579,086.66');

        await since(
            'The grid cell in visualization "Visualization 1" at "4", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(4, 1, 'Visualization 1'))
            .toBe('AirTran Airways Corporation');

        await since(
            'The grid cell in visualization "Visualization 1" at "4", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(4, 2, 'Visualization 1'))
            .toBe('Sunday');

        await editorPanelForGrid.createSubtotalsFromEditorPanel('Day of Week', 'attribute', 'Average');
        await since(
            'The grid cell in visualization "Visualization 1" at "5", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(5, 1, 'Visualization 1'))
            .toBe('Sunday');

        await since(
            'The grid cell in visualization "Visualization 1" at "4", "3" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(4, 3, 'Visualization 1'))
            .toBe('9,751.06');

        await since(
            'The grid cell in visualization "Visualization 1" at "4", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(4, 2, 'Visualization 1'))
            .toBe('Average');

        // remove subtotals
        await editorPanelForGrid.showTotal();
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('AirTran Airways Corporation');

        await since(
            'The grid cell in visualization "Visualization 1" at "4", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(4, 1, 'Visualization 1'))
            .toBe('Monday');

        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('Day of Week');
    });

    it('[TC2711_2] Subtotals for a grid with attribute forms: attributes in column and metric in row', async () => {
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.Subtotals_TC2711.id,
            projectId: gridConstants.Subtotals_TC2711.project.id,
        });
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 5' });
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await vizPanelForGrid.openContextMenu('Visualization 1');
        await vizPanelForGrid.selectContextMenuOption('Show Totals');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        await since(
            'The grid cell in visualization "Visualization 1" at "3", "10" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 10, 'Visualization 1'))
            .toBe('68,257.42');

        await since(
            'The grid cell in visualization "Visualization 1" at "2", "9" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 9, 'Visualization 1'))
            .toBe('Total');

        await since(
            'The grid cell in visualization "Visualization 1" at "4", "9" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(4, 9, 'Visualization 1'))
            .toBe('200');

        // enable subtotals for the Year attribute
        await editorPanelForGrid.createSubtotalsFromEditorPanel('Year', 'attribute', 'Total,Average,Maximum,Minimum');

        await since(
            'The grid cell in visualization "Visualization 1" at "3", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Total');

        await since(
            'The grid cell in visualization "Visualization 1" at "3", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('Avg Delay (min)');

        await since(
            'The grid cell in visualization "Visualization 1" at "4", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(4, 1, 'Visualization 1'))
            .toBe('Average');

        await since(
            'The grid cell in visualization "Visualization 1" at "5", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(5, 1, 'Visualization 1'))
            .toBe('Maximum');

        await since(
            'The grid cell in visualization "Visualization 1" at "6", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(6, 1, 'Visualization 1'))
            .toBe('Minimum');

        await since(
            'The grid cell in visualization "Visualization 1" at "3", "3" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 3, 'Visualization 1'))
            .toBe('20,500.02');

        // remove attribute
        await editorPanelForGrid.removeFromDropZone('Day of Week', 'Attribute');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        await since(
            'The grid cell in visualization "Visualization 1" at "2", "9" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 9, 'Visualization 1'))
            .toBe('81,071.84');

        await since(
            'The grid cell in visualization "Visualization 1" at "3", "10" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 10, 'Visualization 1'))
            .toBe('32,543.32');

        await since(
            'The grid cell in visualization "Visualization 1" at "4", "9" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(4, 9, 'Visualization 1'))
            .toBe('48,757.75');

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 6' });
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        //enable subtotal for metric
        await vizPanelForGrid.toggleShowTotalsFromMetric('Avg Delay (min)', 'Visualization 1');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "9" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 9, 'Visualization 1'))
            .toBe('Total');

        await since(
            'The grid cell in visualization "Visualization 1" at "3", "10" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 10, 'Visualization 1'))
            .toBe('68,257.42');
        // remove subtotals from context menu
        await vizPanelForGrid.openContextMenu('Visualization 1');
        await vizPanelForGrid.selectContextMenuOption('Show Totals');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "9" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 9, 'Visualization 1'))
            .toBe('Sunday');

        await since(
            'The grid cell in visualization "Visualization 1" at "3", "10" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 10, 'Visualization 1'))
            .toBe('10,738.11');
    });

    it('[TC2711_3] Subtotals for a grid with attribute forms: replace attribute', async () => {
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.Subtotals_TC2711.id,
            projectId: gridConstants.Subtotals_TC2711.project.id,
        });
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 7' });
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await editorPanelForGrid.createSubtotalsFromEditorPanel('Airline Name', 'attribute', 'Average,Maximum');

        await since(
            'The grid cell in visualization "Visualization 1" at "3", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Maximum');

        await since(
            'The grid cell in visualization "Visualization 1" at "3", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('170,028.59');

        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('Average');

        await since(
            'The grid cell in visualization "Visualization 1" at "2", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('121,950.06');

        // replace attribute
        await datasetPanel.addObjectToVizByDoubleClick('Day of Week', 'attribute', 'airline-sample-data.xls');
        await editorPanelForGrid.removeFromDropZone('Airline Name', 'Attribute');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('Sunday');

        await since(
            'The grid cell in visualization "Visualization 1" at "2", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('171,215.85');

        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Airline Name',
            'attribute',
            'airline-sample-data.xls',
            'Rows',
            'above',
            'Day of Week'
        );

        await since(
            'The grid cell in visualization "Visualization 1" at "3", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Maximum');

        await since(
            'The grid cell in visualization "Visualization 1" at "3", "3" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 3, 'Visualization 1'))
            .toBe('28,020.41');

        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('Average');

        await since(
            'The grid cell in visualization "Visualization 1" at "2", "3" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 3, 'Visualization 1'))
            .toBe('17,421.44');

        await since(
            'The grid cell in visualization "Visualization 1" at "4", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(4, 1, 'Visualization 1'))
            .toBe('AirTran Airways Corporation');
    });

    it('[TC2711_4] Subtotals for a grid with attribute forms: swap', async () => {
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.Subtotals_TC2711.id,
            projectId: gridConstants.Subtotals_TC2711.project.id,
        });
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 8' });
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await editorPanelForGrid.showTotal();
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        await since(
            'The grid cell in visualization "Visualization 1" at "1", "12" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 12, 'Visualization 1'))
            .toBe('Total');

        await since(
            'The grid cell in visualization "Visualization 1" at "2", "12" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 12, 'Visualization 1'))
            .toBe('1,219,500.57');

        // swap
        await vizPanelForGrid.openContextMenu('Visualization 1');
        await vizPanelForGrid.selectContextMenuOption('Swap');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('Total');

        await since(
            'The grid cell in visualization "Visualization 1" at "2", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('1,219,500.57');

        await since(
            'The grid cell in visualization "Visualization 1" at "3", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('AirTran Airways Corporation');
        //add attribute and metric
        await datasetPanel.addObjectToVizByDoubleClick('Year', 'attribute', 'airline-sample-data.xls');
        await datasetPanel.addObjectToVizByDoubleClick('Number of Flights', 'metric', 'airline-sample-data.xls');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('Total');

        await since(
            'The grid cell in visualization "Visualization 1" at "2", "3" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 3, 'Visualization 1'))
            .toBe('1,219,500.57');

        await since(
            'The grid cell in visualization "Visualization 1" at "2", "4" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 4, 'Visualization 1'))
            .toBe('473435');

        await since(
            'The grid cell in visualization "Visualization 1" at "3", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('AirTran Airways Corporation');

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 9' });
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await editorPanelForGrid.showTotal();
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('Total');

        await since(
            'The grid cell in visualization "Visualization 1" at "2", "4" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 4, 'Visualization 1'))
            .toBe('1,219,500.57');

        await since(
            'The grid cell in visualization "Visualization 1" at "2", "5" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 5, 'Visualization 1'))
            .toBe('11776');

        await since(
            'The grid cell in visualization "Visualization 1" at "3", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('Total');

        await since(
            'The grid cell in visualization "Visualization 1" at "4", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(4, 2, 'Visualization 1'))
            .toBe('Total');

        await editorPanelForGrid.removeAllObjects();
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await datasetPanel.addObjectToVizByDoubleClick('Airline Name', 'attribute', 'airline-sample-data.xls');
        await datasetPanel.addObjectToVizByDoubleClick('Avg Delay (min)', 'metric', 'airline-sample-data.xls');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('Total');

        await since(
            'The grid cell in visualization "Visualization 1" at "2", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('1,219,500.57');
    });

   it('[TC2711_5] Subtotals for a grid with hidden headers', async () => {
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.Subtotals_TC2711.id,
            projectId: gridConstants.Subtotals_TC2711.project.id,
        });
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 11' });
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await editorPanelForGrid.createSubtotalsFromEditorPanel('Airline Name', 'attribute', 'Total');
        await editorPanelForGrid.createSubtotalsFromEditorPanel('Day of Week', 'attribute', 'Average');
        await since(
            'The grid cell in visualization "Visualization 1" at "1", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 1, 'Visualization 1'))
            .toBe('Total');

        await since(
            'The grid cell in visualization "Visualization 1" at "1", "3" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 3, 'Visualization 1'))
            .toBe('1,219,500.57');

        await since(
            'The grid cell in visualization "Visualization 1" at "1", "4" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 4, 'Visualization 1'))
            .toBe('11776');

        await since(
            'The grid cell in visualization "Visualization 1" at "2", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('Average');

        await since(
            'The grid cell in visualization "Visualization 1" at "2", "3" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 3, 'Visualization 1'))
            .toBe('20,150.00');

        // remove subtotals
        await vizPanelForGrid.openContextMenu('Visualization 1');
        await vizPanelForGrid.selectContextMenuOption('Show Totals');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await since(
            'The grid cell in visualization "Visualization 1" at "1", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 1, 'Visualization 1'))
            .toBe('AirTran Airways Corporation');

        await since(
            'The grid cell in visualization "Visualization 1" at "1", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 2, 'Visualization 1'))
            .toBe('Sunday');

        await since(
            'The grid cell in visualization "Visualization 1" at "1", "3" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 3, 'Visualization 1'))
            .toBe('20,500.02');

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 12' });
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await vizPanelForGrid.openContextMenu('Visualization 1');
        await vizPanelForGrid.selectContextMenuOption('Show Totals');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('1,219,500.57');

        await since(
            'The grid cell in visualization "Visualization 1" at "2", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('11776');

        await since(
            'The grid cell in visualization "Visualization 1" at "3", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('595,673.60');

        // remove subtotals
        await editorPanelForGrid.showTotal();
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('49,981.20');

        await since(
            'The grid cell in visualization "Visualization 1" at "2", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('495');

        await since(
            'The grid cell in visualization "Visualization 1" at "3", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('39,402.73');

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 13' });
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await editorPanelForGrid.createSubtotalsFromEditorPanel('Airline Name', 'attribute', 'Total,Average');
        await since(
            'The grid cell in visualization "Visualization 1" at "1", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 1, 'Visualization 1'))
            .toBe('1,219,500.57');

        await since(
            'The grid cell in visualization "Visualization 1" at "1", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 2, 'Visualization 1'))
            .toBe('11776');

        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('17,421.44');
        await editorPanelForGrid.createSubtotalsFromEditorPanel('Day of Week', 'attribute', 'Maximum');
        await since(
            'The grid cell in visualization "Visualization 1" at "1", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 1, 'Visualization 1'))
            .toBe('1,219,500.57');

        await since(
            'The grid cell in visualization "Visualization 1" at "1", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 2, 'Visualization 1'))
            .toBe('11776');

        await since(
            'The grid cell in visualization "Visualization 1" at "3", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('22,848.47');

        await since(
            'The grid cell in visualization "Visualization 1" at "3", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('160');
        // remove subtotals
        await editorPanelForGrid.showTotal();
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await since(
            'The grid cell in visualization "Visualization 1" at "1", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 1, 'Visualization 1'))
            .toBe('20,500.02');

        await since(
            'The grid cell in visualization "Visualization 1" at "1", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 2, 'Visualization 1'))
            .toBe('133');

        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('22,848.47');
    });
});
