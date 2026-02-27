import * as gridConstants from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('Grouping test for AG-grid', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        loginPage,
        libraryPage,
        editorPanelForGrid,
        microchartConfigDialog,
        editorPanel,
        reportGridView,
        vizPanelForGrid,
        datasetPanel,
        baseVisualization,
        agGridVisualization,
        loadingDialog,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    it('[TC89080] Grouping test in AG-grid', async () => {
        // Edit dossier by its ID "755A8D3B614D64690297FB8DA4EAB5B9"
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridCreate.project.id,
            dossierId: gridConstants.AGGridCreate.id,
        });

        // When I change visualization "Visualization 1" to "Grid (Modern)" from context menu
        await baseVisualization.changeVizType('Visualization 1', 'Grid', 'Grid (Modern)');
        // And I add "attribute" named "Airline Name" from dataset "Airline Data" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Airline Name', 'attribute', 'Airline Data');
        // Then The editor panel should have "attribute" named "Airline Name" on "Rows" section
        await since('The editor panel should have "attribute" named "Airline Name" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Airline Name', 'attribute', 'Rows').isExisting())
            .toBe(true);
        // And I add "attribute" named "Day of Week" from dataset "Airline Data" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Day of Week', 'attribute', 'Airline Data');
        // Then The editor panel should have "attribute" named "Day of Week" on "Rows" section
        await since('The editor panel should have "attribute" named "Day of Week" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Day of Week', 'attribute', 'Rows').isExisting())
            .toBe(true);

        // When I add a new microchart set to the ag-grid
        await agGridVisualization.addMicrochartSet();
        // And I pause execution for 1 seconds
        await browser.pause(1000);
        // And I select the object named "Flights Delayed" from pulldown at position "1" in the microchart config dialog
        await microchartConfigDialog.selectObject(1, 'Flights Delayed');
        // And I select the object named "Month" from pulldown at position "2" in the microchart config dialog
        await microchartConfigDialog.selectObject(2, 'Month');
        // wait for animation to finish
        await browser.pause(1000);
        // When I confirm the microchart config dialog
        await microchartConfigDialog.confirmDialog();
        // Then The editor panel should have microchart with type "Sparkline" named "Flights Delayed Trend by Month" on "Flights Delayed Trend by Month" section
        await since(
            'The editor panel should have microchart with type "Sparkline" named "Flights Delayed Trend by Month" on "Flights Delayed Trend by Month" section'
        )
            .expect(
                await editorPanel
                    .getObjectFromSection(
                        'Flights Delayed Trend by Month',
                        'mc mc-sparkline',
                        'Flights Delayed Trend by Month'
                    )
                    .isDisplayed()
            )
            .toBe(true);

        // When I add a new column set to the ag-grid
        await agGridVisualization.addColumnSet();
        // And I drag "attribute" named "Origin Airport" from dataset "Airline Data" to Column Set "Column Set 1" in ag-grid
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ(
            'Origin Airport',
            'attribute',
            'Airline Data',
            'Column Set 1'
        );
        // Then The editor panel should have "attribute" named "Origin Airport" on "Column Set 1" section
        await since('The editor panel should have "attribute" named "Origin Airport" on "Column Set 1" section')
            .expect(
                await editorPanelForGrid
                    .getObjectFromSection('Origin Airport', 'attribute', 'Column Set 1')
                    .isExisting()
            )
            .toBe(true);
        // When I drag "metric" named "Flights Delayed" from dataset "Airline Data" to Column Set "Column Set 1" and drop it below "Origin Airport" in ag-grid
        await vizPanelForGrid.dragDSObjectToColumnSetDZwithPosition(
            'Flights Delayed',
            'metric',
            'Airline Data',
            'Column Set 1',
            'below',
            'Origin Airport'
        );
        // Then The editor panel should have "metric" named "Flights Delayed" on "Column Set 1" section
        await since('The editor panel should have "metric" named "Flights Delayed" on "Column Set 1" section')
            .expect(
                await editorPanelForGrid.getObjectFromSection('Flights Delayed', 'metric', 'Column Set 1').isExisting()
            )
            .toBe(true);
        // When I right click on elements "BWI" and select "Group" from ag-grid "Visualization 1"
        await agGridVisualization.openMenuItem('BWI', 'Group', 'Visualization 1');
        // And I click on save button
        await agGridVisualization.clickSaveButtonOnGroup();
        // # Add another element to the existing group.
        // When I right click on element "DCA" and select context menu "Add to Group" and then select sub-menu "Group 1" from ag-grid "Visualization 1"
        await agGridVisualization.openContextSubMenuItemForHeader('DCA', 'Add to Group', 'Group 1', 'Visualization 1');
        // Then the grid cell in ag-grid "Visualization 1" at "0", "2" has text "Group 1"
        await since('the grid cell in ag-grid "Visualization 1" at "0", "2" has text "Group 1"')
            .expect(await agGridVisualization.getGridCellTextByPos(0, 2, 'Visualization 1'))
            .toEqual('Group 1');
        // # Ungroup.
        // When I right click on elements "Group 1" and select "Ungroup" from ag-grid "Visualization 1"
        await agGridVisualization.openMenuItem('Group 1', 'Ungroup', 'Visualization 1');

        // When I right click on grid cell at "2", "0" and select "Group" from ag-grid "Visualization 1"
        await agGridVisualization.openContextMenuItemForCellAtPosition(2, 0, 'Group', 'Visualization 1');
        await agGridVisualization.clickSaveButtonOnGroup();
        // When I right click on grid cell at "9", "0" and select "Add to Group" from ag-grid "Visualization 1"
        await agGridVisualization.openContextMenuItemForCellAtPosition(9, 0, 'Add to Group', 'Visualization 1');
        // And I select option "Group 1" from secondary context menu
        await agGridVisualization.clickOnSecondaryContextMenu('Group 1');
        // And I pause execution for 1 seconds
        // Then the grid cell in ag-grid "Visualization 1" at "2", "0" has text "Group 1"
        await since('the grid cell in ag-grid "Visualization 1" at "2", "0" has text "Group 1"')
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1'))
            .toEqual('Group 1');

        // And the grid cell in ag-grid "Visualization 1" at "9", "0" has text "American Eagle Airlines Inc."
        await since('the grid cell in ag-grid "Visualization 1" at "9", "0" has text "American Eagle Airlines Inc."')
            .expect(await agGridVisualization.getGridCellTextByPos(9, 0, 'Visualization 1'))
            .toEqual('American Eagle Airlines Inc.');
        // # Ungroup.
        // When I right click on grid cell at "2", "0" and select "Ungroup" from ag-grid "Visualization 1"
        await agGridVisualization.openContextMenuItemForCellAtPosition(2, 0, 'Ungroup', 'Visualization 1');

        // # Select several elements and add to a Group
        // When I select header elements from "BWI" to "IAD" and select menu option "Group" on grid visualization "Visualization 1"
        await agGridVisualization.selectGroupHeaderUsingShift('BWI', 'IAD', 'Group', 'Visualization 1');
        await agGridVisualization.clickSaveButtonOnGroup();
        // wait for animation to finish
        await browser.pause(2000);
        // And the grid cell in ag-grid "Visualization 1" at "0", "2" has text "Group 1"
        await since('the grid cell in ag-grid "Visualization 1" at "0", "2" has text "Group 1"')
            .expect(await agGridVisualization.getGridCellTextByPos(0, 2, 'Visualization 1'))
            .toEqual('Group 1');
    });
});
