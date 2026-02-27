import * as gridConstants from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('AGGrid_Manipulation', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        loginPage,
        libraryPage,
        dossierPage,
        vizPanelForGrid,
        agGridVisualization,
        showDataDialog,
        dossierAuthoringPage,
        microchartConfigDialog,
        dossierEditorUtility,
        dossierMojo,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    it('[TC89029] Modern Grid and Show data dialog | Support rearranging columns by DnD columns headers and between Rows, Columns in the Grid', async () => {
        // Edit dossier by its ID "49735FD53342110EB5FB46B71A84043F"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Create > AGGrid_DnD_TC89029
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridDnD.project.id,
            dossierId: gridConstants.AGGridDnD.id,
        });
        await vizPanelForGrid.dragDSObjectToGridContainer(
            'Supplier',
            'attribute',
            'retail-sample-data.xls',
            'Visualization 1'
        );
        await agGridVisualization.dragDSObjectToAGGridWithPositionInColumnHeader(
            'Cost',
            'metric',
            'retail-sample-data.xls',
            'above',
            'Supplier',
            'Visualization 1'
        );

        // take screenshot of the modern grid visualization "Visualization 1"
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'TC89029_1',
            'Supplier and Cost added to the grid'
        );
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'Visualization 1'))
            .toBe('Supplier');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('20th Century Fox');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'Visualization 1'))
            .toBe('Cost');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('$6,766,511');

        // Drag "attribute" named "Month" from dataset "retail-sample-data.xls" to the row "above" "Cost" in modern grid visualization "Visualization 1"
        await agGridVisualization.dragDSObjectToAGGridWithPositionInColumnHeader(
            'Month',
            'attribute',
            'retail-sample-data.xls',
            'above',
            'Cost',
            'Visualization 1'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'TC89029_2',
            'Drag Month above Cost'
        );
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'Visualization 1'))
            .toBe('Month');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'Visualization 1'))
            .toBe('Jan');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 3, 'Visualization 1'))
            .toBe('Feb');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('Cost');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 3, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('20th Century Fox');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 3, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('$398,708');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 3, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, 'Visualization 1'))
            .toBe('$516,735');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 9, col 4 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(9, 4, 'Visualization 1'))
            .toBe('$990,522');

        //move "Jan" to the row "Below" "Cost" in modern grid visualization "Visualization 1"
        await agGridVisualization.moveObjectToAGGridWithPositionInRow('Jan', 'below', 'Cost', 'Visualization 1');
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'TC89029_3',
            'Drag Jan below Cost'
        );
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('Supplier');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'Visualization 1'))
            .toBe('Cost');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('Jan');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 3, 'Visualization 1'))
            .toBe('Feb');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 3, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('20th Century Fox');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 3, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('$398,708');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 3, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, 'Visualization 1'))
            .toBe('$516,735');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 9, col 4 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(9, 4, 'Visualization 1'))
            .toBe('$990,522');

        // drag group header cell "Jan" on grid to the "right" of "row" header "20th Century Fox"
        await agGridVisualization.dragHeaderCellToRow('Jan', 'right', '20th Century Fox');
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'TC89029_4',
            'Drag Jan right to 20th Century Fox'
        );
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'Visualization 1'))
            .toBe('Supplier');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'Visualization 1'))
            .toBe('Month');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 3, 'Visualization 1'))
            .toBe('Cost');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('20th Century Fox');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('Jan');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 3, 'Visualization 1'))
            .toBe('$398,708');

        // move "Month" to the row "Above" "Cost" in modern grid visualization "Visualization 1"
        await agGridVisualization.moveObjectToAGGridWithPositionInRow('Month', 'above', 'Cost', 'Visualization 1');
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'TC89029_5',
            'move Month to the row above Cost'
        );
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'Visualization 1'))
            .toBe('Month');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'Visualization 1'))
            .toBe('Jan');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 3, 'Visualization 1'))
            .toBe('Feb');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('Cost');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 3, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('20th Century Fox');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 3, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('$398,708');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 3, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, 'Visualization 1'))
            .toBe('$516,735');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 9, col 4 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(9, 4, 'Visualization 1'))
            .toBe('$990,522');

        // drag "attribute" named "Item Category" from dataset "retail-sample-data.xls" to the "right" of "row" header "20th Century Fox" in modern grid visualization "Visualization 1"
        await agGridVisualization.dragDSObjectToAGGridWithPositionInRow(
            'Item Category',
            'attribute',
            'retail-sample-data.xls',
            'right',
            '20th Century Fox',
            'Visualization 1'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'TC89029_6',
            'move Item Category to the right of 20th Century Fox'
        );
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('Supplier');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'Visualization 1'))
            .toBe('Month');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 3, 'Visualization 1'))
            .toBe('Jan');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 4 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 4, 'Visualization 1'))
            .toBe('Feb');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 3, 'Visualization 1'))
            .toBe('Cost');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 3, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('20th Century Fox');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 3, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('Action Movies');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 3, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, 'Visualization 1'))
            .toBe('$22,386');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 3, col 4 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 4, 'Visualization 1'))
            .toBe('$10,140');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 9, col 7 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(9, 7, 'Visualization 1'))
            .toBe('$145,696');

        //drag group header cell "Item Category" on grid to the "left" of "row" header "20th Century Fox"
        await agGridVisualization.dragHeaderCellToRow('Item Category', 'left', '20th Century Fox');
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'TC89029_7',
            'move Item Category to the left of 20th Century Fox'
        );
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('Item Category');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('Supplier');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 3, 'Visualization 1'))
            .toBe('Jan');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 4 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 4, 'Visualization 1'))
            .toBe('Feb');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 3, 'Visualization 1'))
            .toBe('Cost');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 3, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Action Movies');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 3, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('20th Century Fox');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 3, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, 'Visualization 1'))
            .toBe('$22,386');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 3, col 4 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 4, 'Visualization 1'))
            .toBe('$10,140');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 9, col 7 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(9, 7, 'Visualization 1'))
            .toBe('$121,454');

        //Dnd in show data dialog
        //click on show data of the context menu of the grid visualization "Visualization 1"
        await vizPanelForGrid.openShowDataDiagFromViz('Visualization 1');
        await takeScreenshotByElement(
            showDataDialog.getShowDataDialog(),
            'TC89029_8',
            'open show data dialog from visualization context menu'
        );
        await since('An editor should show up with title "Show Data"')
            .expect(await dossierMojo.getMojoEditorWithTitle('Show Data').isDisplayed())
            .toBe(true);

        await since('It should show there are "1200" rows of data in the show data dialog')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(1200);
        await since('Show data grid at row 0 and column 0 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(0, 0).getText())
            .toBe('Month');
        await since('Show data grid at row 1 and column 0 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(1, 0).getText())
            .toBe('Jan');
        await since('Show data grid at row 0 and column 1 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(0, 1).getText())
            .toBe('Item Category');
        await since('Show data grid at row 1 and column 1 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(1, 1).getText())
            .toBe('Action Movies');
        await since('Show data grid at row 0 and column 2 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(0, 2).getText())
            .toBe('Supplier');
        await since('Show data grid at row 1 and column 2 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(1, 2).getText())
            .toBe('20th Century Fox');
        await since('Show data grid at row 0 and column 3 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(0, 3).getText())
            .toBe('Cost');
        await since('Show data grid at row 1 and column 3 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(1, 3).getText())
            .toBe('$22,386');
        // move "Supplier" to column "1" in show data grid
        await showDataDialog.moveObjectByColumnBorder('Supplier', '1');
        await takeScreenshotByElement(
            showDataDialog.getShowDataDialog(),
            'TC89029_9',
            'move Supplier to column 1 in show data dialog'
        );
        await since('Show data grid at row 0 and column 0 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(0, 0).getText())
            .toBe('Month');
        await since('Show data grid at row 1 and column 0 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(1, 0).getText())
            .toBe('Jan');
        await since('Show data grid at row 0 and column 1 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(0, 1).getText())
            .toBe('Supplier');
        await since('Show data grid at row 1 and column 1 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(1, 1).getText())
            .toBe('20th Century Fox');
        await since('Show data grid at row 0 and column 2 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(0, 2).getText())
            .toBe('Item Category');
        await since('Show data grid at row 1 and column 2 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(1, 2).getText())
            .toBe('Action Movies');
        await since('Show data grid at row 0 and column 3 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(0, 3).getText())
            .toBe('Cost');
        await since('Show data grid at row 1 and column 3 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(1, 3).getText())
            .toBe('$22,386');
        // move "Month" to column "3" in show data grid
        await showDataDialog.moveObjectByColumnBorder('Month', '3');
        await takeScreenshotByElement(
            showDataDialog.getShowDataDialog(),
            'TC89029_10',
            'move Month to column 3 in show data dialog'
        );
        await since('Show data grid at row 0 and column 0 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(0, 0).getText())
            .toBe('Supplier');
        await since('Show data grid at row 1 and column 0 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(1, 0).getText())
            .toBe('20th Century Fox');
        await since('Show data grid at row 0 and column 1 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(0, 1).getText())
            .toBe('Item Category');
        await since('Show data grid at row 1 and column 1 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(1, 1).getText())
            .toBe('Action Movies');
        await since('Show data grid at row 0 and column 2 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(0, 2).getText())
            .toBe('Month');
        await since('Show data grid at row 1 and column 2 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(1, 2).getText())
            .toBe('Jan');
        await since('Show data grid at row 0 and column 3 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(0, 3).getText())
            .toBe('Cost');
        await since('Show data grid at row 1 and column 3 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(1, 3).getText())
            .toBe('$22,386');
        //move "Cost" to column "3" in show data grid
        await showDataDialog.moveObjectByColumnBorder('Cost', '3');
        await takeScreenshotByElement(
            showDataDialog.getShowDataDialog(),
            'TC89029_11',
            'move Cost to column 3 in show data dialog'
        );
        await since('Show data grid at row 0 and column 0 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(0, 0).getText())
            .toBe('Supplier');
        await since('Show data grid at row 1 and column 0 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(1, 0).getText())
            .toBe('20th Century Fox');
        await since('Show data grid at row 0 and column 1 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(0, 1).getText())
            .toBe('Item Category');
        await since('Show data grid at row 1 and column 1 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(1, 1).getText())
            .toBe('Action Movies');
        await since('Show data grid at row 0 and column 2 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(0, 2).getText())
            .toBe('Month');
        await since('Show data grid at row 1 and column 2 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(1, 2).getText())
            .toBe('Jan');
        await since('Show data grid at row 1 and column 3 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(1, 3).getText())
            .toBe('Cost');
        await since('Show data grid at row 1 and column 4 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(1, 4).getText())
            .toBe('$22,386');
        // move "Cost" to column "2" in show data grid
        await showDataDialog.moveObjectByColumnBorder('Cost', '2');
        await takeScreenshotByElement(
            showDataDialog.getShowDataDialog(),
            'TC89029_12',
            'move Cost to column 2 in show data dialog'
        );
        await since('Show data grid at row 0 and column 0 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(0, 0).getText())
            .toBe('Supplier');
        await since('Show data grid at row 1 and column 0 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(1, 0).getText())
            .toBe('20th Century Fox');
        await since('Show data grid at row 0 and column 1 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(0, 1).getText())
            .toBe('Item Category');
        await since('Show data grid at row 1 and column 1 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(1, 1).getText())
            .toBe('Action Movies');
        await since('Show data grid at row 1 and column 2 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(1, 2).getText())
            .toBe('Cost');
        await since('Show data grid at row 0 and column 3 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(0, 3).getText())
            .toBe('Month');
        await since('Show data grid at row 1 and column 3 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(1, 3).getText())
            .toBe('Jan');
        await since('Show data grid at row 1 and column 4 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(1, 4).getText())
            .toBe('$22,386');
        // drag "Cost" to the "top" of "column" header "Month" in show data grid
        await showDataDialog.dragCellToColHeader('Cost', 'top', 'Month');
        await takeScreenshotByElement(
            showDataDialog.getShowDataDialog(),
            'TC89029_13',
            'move Cost to the top of column header Month in show data dialog'
        );
        await since('Show data grid at row 0 and column 0 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(0, 0).getText())
            .toBe('Supplier');
        await since('Show data grid at row 1 and column 0 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(1, 0).getText())
            .toBe('20th Century Fox');
        await since('Show data grid at row 0 and column 1 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(0, 1).getText())
            .toBe('Item Category');
        await since('Show data grid at row 1 and column 1 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(1, 1).getText())
            .toBe('Action Movies');
        await since('Show data grid at row 0 and column 2 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(0, 2).getText())
            .toBe('Month');
        await since('Show data grid at row 1 and column 2 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(1, 2).getText())
            .toBe('Jan');
        await since('Show data grid at row 0 and column 3 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(0, 3).getText())
            .toBe('Cost');
        await since('Show data grid at row 1 and column 3 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(1, 3).getText())
            .toBe('$22,386');
    });

    it('[BCIN-5938] Cannot scroll horizontally to the far right in fit to content mode', async () => {
        // Edit dossier by its ID "BE53F23A6B4C6CF564D9D28586EE3903"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Defects > 202. CS0798627 Booking.com B.V
        await libraryPage.openDossierById({
            projectId: gridConstants.AGGrid_Horizontal_Scroll.project.id,
            dossierId: gridConstants.AGGrid_Horizontal_Scroll.id,
        });
        await agGridVisualization.scrollHorizontally('right', 1000, 'Visualization 1');
        await browser.pause(1000);
        await agGridVisualization.scrollHorizontallyToNextSlice(2, 'Visualization 1');
        await browser.pause(1000);
        await agGridVisualization.scrollHorizontallyToNextSlice(3, 'Visualization 1');
        await browser.pause(1000);
        // take screenshot of the right end of the page
        await takeScreenshotByElement(
            await agGridVisualization.getContainer('Visualization 1'),
            'BCIN-5938_01',
            'The right end of the page in AG grid with horizontal scroll'
        );
    });

    it('[BCIN-5929] The width of microchart get bigger and bigger during vertical scroll in fit to content mode', async () => {
        // Edit dossier by its ID "BE53F23A6B4C6CF564D9D28586EE3903"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Defects > BCIN-5929 Microchart AG Scroll
        await libraryPage.openDossierById({
            projectId: gridConstants.AGGrid_Microchart_Scroll.project.id,
            dossierId: gridConstants.AGGrid_Microchart_Scroll.id,
        });
        await agGridVisualization.scrollVertically('down', 1000, 'Visualization 1');
        await browser.pause(1000);
        await agGridVisualization.scrollVerticallyDownToNextSlice(2, 'Visualization 1');
        await browser.pause(1000);
        await agGridVisualization.scrollVerticallyDownToNextSlice(3, 'Visualization 1');
        await browser.pause(1000);
        await agGridVisualization.scrollVerticallyToBottom('Visualization 1');
        await browser.pause(1000);
        // take screenshot of the bottom of the page
        await takeScreenshotByElement(
            await agGridVisualization.getContainer('Visualization 1'),
            'BCIN-5929_01',
            'The bottom of the page in AG grid with microcharts'
        );
    });

    it('[BCIN-5812] The ag grid format is not correct (random)', async () => {
        // Edit dossier by its ID "BE53F23A6B4C6CF564D9D28586EE3903"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Defects > 202. CS0798627 Booking.com B.V
        await libraryPage.openDossierById({
            projectId: gridConstants.AGGrid_Render_Format.project.id,
            dossierId: gridConstants.AGGrid_Render_Format.id,
        });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            await dossierEditorUtility.getVIVizPanel(),
            'BCIN-5812_01',
            'The ag grid format in consumption mode'
        );
        // click edit button to go to edit mode
        await dossierPage.clickEditIcon();
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(
            await dossierEditorUtility.getVIVizPanel(),
            'BCIN-5812_02',
            'The ag grid format in edit mode'
        );
        // switch back to consumption mode
        await dossierAuthoringPage.clickCloseDossierButton();
        await dossierPage.waitForDossierLoading();
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            await dossierEditorUtility.getVIVizPanel(),
            'BCIN-5812_03',
            'The ag grid format in consumption mode back from edit mode'
        );
        // switch to edit mode again
        await dossierPage.clickEditIcon();
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(
            await dossierEditorUtility.getVIVizPanel(),
            'BCIN-5812_04',
            'The ag grid format in edit mode again'
        );
    });

    it('[BCIN-6326] The ag grid keep loading when there is no metric and uncheck row header', async () => {
        // Edit dossier by its ID "BE53F23A6B4C6CF564D9D28586EE3903"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Defects > 202. CS0798627 Booking.com B.V
        await libraryPage.openDossierById({
            projectId: gridConstants.AGGrid_Keep_Loading.project.id,
            dossierId: gridConstants.AGGrid_Keep_Loading.id,
        });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            await agGridVisualization.getContainer('Visualization 1'),
            'BCIN-6326_01',
            'The ag grid should be empty in consumption mode'
        );
        // click edit button to go to edit mode
        await dossierPage.clickEditIcon();
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(
            await agGridVisualization.getContainer('Visualization 1'),
            'BCIN-6326_02',
            'The ag grid should be empty in edit mode'
        );
    });
});
