import * as gridConstants from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('AGGrid_Create', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        loginPage,
        libraryPage,
        baseVisualization,
        vizPanelForGrid,
        contentsPanel,
        datasetPanel,
        agGridVisualization,
        editorPanelForGrid,
        editorPanel,
        microchartConfigDialog,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await browser.url(new URL('auth/ui/loginPage', browser.options.baseUrl).toString(), 100000);
        await loginPage.login(gridConstants.gridUser);
    });

    afterEach(async () => {});

    it('[TC71081] Creating AG grid with value sets and microcharts | Acceptance', async () => {
        // Edit dossier by its ID "755A8D3B614D64690297FB8DA4EAB5B9"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > AGGrid_CreateGrid_TC71081
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridCreate.project.id,
            dossierId: gridConstants.AGGridCreate.id,
        });
        await baseVisualization.changeVizType('Visualization 1', 'Grid', 'Grid (Modern)');

        // Add attribute and metrics to grid
        await datasetPanel.addObjectToVizByDoubleClick('Airline Name', 'attribute', 'Airline Data');
        await datasetPanel.addObjectToVizByDoubleClick('Flights Delayed', 'metric', 'Airline Data');
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Year',
            'attribute',
            'Airline Data',
            'Columns',
            'above',
            'Flights Delayed'
        );
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71081_01',
            'Datasets Panel with Airline Name, Flights Delayed, Year'
        );

        // Add microchart sparkline
        await agGridVisualization.addMicrochartSet();
        await microchartConfigDialog.selectObject(1, 'Number of Flights');
        await microchartConfigDialog.selectObject(2, 'Origin Airport');
        // wait for animation
        await browser.pause(1000);
        await takeScreenshotByElement(
            microchartConfigDialog.windowRoot,
            'TC71081_02',
            'Microchart Config Dialog with Number of Flights, Origin Airport'
        );
        await microchartConfigDialog.confirmDialog();
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 5 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 5, 'Visualization 1'))
            .toBe('Number of Flights Trend by Origin Airport');

        // Add microchart - trend bars
        await agGridVisualization.addMicrochartSet();
        await microchartConfigDialog.selectType('Trend Bars');
        await microchartConfigDialog.selectObject(1, 'On-Time');
        await microchartConfigDialog.selectObject(2, 'Month');
        // wait for animation
        await browser.pause(1000);
        await takeScreenshotByElement(
            microchartConfigDialog.windowRoot,
            'TC71081_03',
            'Microchart Config Dialog with On-Time, Month'
        );
        await microchartConfigDialog.confirmDialog();
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 6 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 6, 'Visualization 1'))
            .toBe('On-Time Comparison by Month');

        // Add microchart - bullet
        await agGridVisualization.addMicrochartSet();
        await microchartConfigDialog.selectType('Bullet');
        await microchartConfigDialog.selectObject(1, 'Flights Delayed');
        await microchartConfigDialog.selectObject(2, 'Flights Cancelled');
        await microchartConfigDialog.selectObject(3, 'Number of Flights');
        // wait for animation
        await browser.pause(1000);
        await takeScreenshotByElement(
            microchartConfigDialog.windowRoot,
            'TC71081_04',
            'Microchart Config Dialog with Flights Delayed, Flights Cancelled, Number of Flights'
        );
        await microchartConfigDialog.confirmDialog();
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 7 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 7, 'Visualization 1'))
            .toBe('Flights Delayed Performance');
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71081_05',
            'Datasets Panel with 3 microcharts'
        );

        // Reorder columns
        await vizPanelForGrid.reorderColumnSet('Flights Delayed Performance', 'above', 'Column Set 1');
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71081_06',
            'Columns dropzone with "Flights Delayed Performance, Column Set 1, Number of Flights Trend by Origin Airport, On-Time Comparison by Month" in-order'
        );
        await vizPanelForGrid.reorderColumnSet('Column Set 1', 'below', 'On-Time Comparison by Month');
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71081_07',
            'Columns dropzone with "Flights Delayed Performance, Number of Flights Trend by Origin Airport, On-Time Comparison by Month, Column Set 1" in-order'
        );

        // Sort grid
        await editorPanelForGrid.simpleSort('Airline Name', 'Sort Descending');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 3, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('US Airways Inc.');

        // Add column set
        await agGridVisualization.addColumnSet();
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ(
            'Number of Flights',
            'metric',
            'Airline Data',
            'Column Set 2'
        );
        await editorPanelForGrid.simpleSort('Number of Flights', 'Sort All Values (Default)');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 3, col 8 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 8, 'Visualization 1'))
            .toBe('126197');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 3, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Southwest Airlines Co.');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 5, col 5 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(5, 5, 'Visualization 1'))
            .toBe('10370');

        // delete column set
        await vizPanelForGrid.deleteColumnSet('Column Set 2');
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71081_08',
            'Columns dropzone without Column Set 2'
        );

        // enable show totals
        await agGridVisualization.toggleShowTotalsByContextMenu('Visualization 1');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 3, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Total');
    });

    it('[BCIN-5724] The dataset info should show in the tooltip in editor panel', async () => {
        // Edit dossier by its ID "B76F534F37495CBE36325EAC0E6BADFC"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Defects > BCIN-5724 Tooltip in Edit Panel
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.Tooltip.project.id,
            dossierId: gridConstants.Tooltip.id,
        });
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'AG' });
        await agGridVisualization.clickOnContainerTitle('Visualization 1');
        // Switch to editor panel
        await editorPanel.switchToEditorPanel();
        // hover over attribute object "Airline Name"
        await editorPanel.hoverMouseOnElement(await editorPanel.getObjectFromSection('Airline Name', 12, 'Rows'));
        await editorPanel.waitForElementVisible(await editorPanel.getTooltip());
        // take screenshot of tooltip
        await takeScreenshotByElement(
            await editorPanel.getTooltip(),
            'BCIN-5724_01',
            'Tooltip for Airline Name attribute in AG'
        );
        // hover over metric object "Cost"
        await editorPanel.hoverMouseOnElement(await editorPanel.getObjectFromSection('Cost', 4, 'Column Set 1'));
        await editorPanel.waitForElementVisible(await editorPanel.getTooltip());
        await takeScreenshotByElement(
            await editorPanel.getTooltip(),
            'BCIN-5724_02',
            'Tooltip for Cost metric in AG'
        );
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'NG' });
        await agGridVisualization.clickOnContainerTitle('Visualization 1');
        // Switch to editor panel
        await editorPanel.switchToEditorPanel();
        // hover over attribute object "Airline Name"
        await editorPanel.hoverMouseOnElement(await editorPanel.getObjectFromSection('Airline Name', 12, 'Rows'));
        await editorPanel.waitForElementVisible(await editorPanel.getTooltip());
        // take screenshot of tooltip
        await takeScreenshotByElement(
            await editorPanel.getTooltip(),
            'BCIN-5724_03',
            'Tooltip for Airline Name attribute in NG'
        );
        // hover over metric object "Cost"
        await editorPanel.hoverMouseOnElement(await editorPanel.getObjectFromSection('Cost', 4, 'Metrics'));
        await editorPanel.waitForElementVisible(await editorPanel.getTooltip());
        await takeScreenshotByElement(
            await editorPanel.getTooltip(),
            'BCIN-5724_04',
            'Tooltip for Cost metric in NG'
        );
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'CG' });
        await agGridVisualization.clickOnContainerTitle('Visualization 1');
        // Switch to editor panel
        await editorPanel.switchToEditorPanel();
        // hover over attribute object "Airline Name"
        await editorPanel.hoverMouseOnElement(await editorPanel.getObjectFromSection('Airline Name', 12, 'Rows'));
        await editorPanel.waitForElementVisible(await editorPanel.getTooltip());
        // take screenshot of tooltip
        await takeScreenshotByElement(
            await editorPanel.getTooltip(),
            'BCIN-5724_05',
            'Tooltip for Airline Name attribute in CG'
        );
        // hover over metric object "Cost"
        await editorPanel.hoverMouseOnElement(await editorPanel.getObjectFromSection('Cost', 4, 'Column Set 1'));
        await editorPanel.waitForElementVisible(await editorPanel.getTooltip());
        await takeScreenshotByElement(
            await editorPanel.getTooltip(),
            'BCIN-5724_06',
            'Tooltip for Cost metric in CG'
        );
    });

});
