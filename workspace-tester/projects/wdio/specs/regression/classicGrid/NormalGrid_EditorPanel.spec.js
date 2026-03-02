import setWindowSize from '../../../config/setWindowSize.js';
import * as gridConstants from '../../../constants/grid.js';

//npm run regression -- --baseUrl=https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --spec 'specs/regression/classicGrid/NormalGrid_EditorPanel.spec.js'
describe('Normal Grid Editor Panel', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {});

    let {
        libraryPage,
        vizPanelForGrid,
        editorPanelForGrid,
        loginPage,
        grid,
        editorPanel,
        ngmEditorPanel,
        datasetPanel,
    } = browsers.pageObj1;

    it('[TC383] Editor Panel Manipulations', async () => {
         // Edit dossier by its ID "F3A7FF0211EB06CE3CED0080EFD505B7"
         // New MicroStrategy Tutorials > Shared Reports > Automation Objects > Normal Grid > Grid Basics
         await libraryPage.editDossierByUrl({
             projectId: gridConstants.Grid_EditorPanel.project.id,
             dossierId: gridConstants.Grid_EditorPanel.id,
         });
         await editorPanel.switchToEditorPanel();
        //  When I add "attribute" named "Country" from dataset "Worldwide-CO2-Emissions.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Country', 'attribute', 'Worldwide-CO2-Emissions.xls');
        //  Then the editor panel should have the items "Country" in the "Rows" zone

        await since('The editor panel should have the items "Country" in the "Rows" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Country', 'Rows').isDisplayed())
            .toBe(true);
        //  When I remove "attribute" named "Country" from the Grid Editor Panel
        await editorPanelForGrid.removeFromDropZone('Country', 'attribute');
        //  Then the editor panel should not have the items "Country" in the "Rows" zone
        await since('The editor panel should not have the items "Country" in the "Rows" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Country', 'Rows').isExisting())
            .toBe(false);
        //  When I drag "attribute" named "Year" from dataset "Worldwide-CO2-Emissions.xls" to dropzone "Rows"
        await vizPanelForGrid.dragDSObjectToGridDZ('Year', 'attribute', 'Worldwide-CO2-Emissions.xls', 'Rows');
        //  Then the grid cell in visualization "Visualization 1" at "1", "1" has text "Year"
        await since('The grid cell at row 1, column 1 should have text "Year"')
        .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Visualization 1').getText())
        .toBe('Year');
        //  When I drag "metric" named "From Coal" from dataset "Worldwide-CO2-Emissions.xls" to grid visualization "Visualization 1"
        await vizPanelForGrid.dragDSObjectToGridContainer('From Coal', 'metric', 'Worldwide-CO2-Emissions.xls', 'Visualization 1');
        //  Then the editor panel should have the items "From Coal" in the "Metrics" zone
        await since('The editor panel should have the items "From Coal" in the "Metrics" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('From Coal', 'Metrics').isDisplayed())
            .toBe(true);
        //  When I move "Metric Names" from "Rows" to "Columns"
        await ngmEditorPanel.moveObjectToBlankDZ('Metric Names', 'Rows', 'Columns');
        //  Then the editor panel should have the items "Metric Names" in the "Columns" zone
        await since('The editor panel should have the items "Metric Names" in the "Columns" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Metric Names', 'Columns').isDisplayed())
            .toBe(true);
        //  When I add "metric" named "Population (m)" from dataset "Worldwide-CO2-Emissions.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Population (m)', 'metric', 'Worldwide-CO2-Emissions.xls');
        //  Then the editor panel should have the items "Population (m)" in the "Metrics" zone
        await since('The editor panel should have the items "Population (m)" in the "Metrics" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Population (m)', 'Metrics').isDisplayed())
            .toBe(true);
        //  When I drag "attribute" named "Region" from dataset "Worldwide-CO2-Emissions.xls" to grid visualization "Visualization 1"
        await vizPanelForGrid.dragDSObjectToGridContainer('Region', 'attribute', 'Worldwide-CO2-Emissions.xls', 'Visualization 1');
        //  Then the grid cell in visualization "Visualization 1" at "1", "1" has text "Year"
        await since('The grid cell at row 1, column 1 should have text "Year"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Visualization 1').getText())
            .toBe('Year');
        //  When I move "Year" from "Rows" to "Columns" and drop it above "Metric Names"
        await ngmEditorPanel.moveObject('Year', 'Rows', 'Columns', 'above', 'Metric Names');
        //  When I rename the "metric" from "From Coal" into "Test Metric" in the Editor Panel
        await editorPanelForGrid.renameObject('From Coal', 'metric', 'Test Metric');
        //  Then the editor panel should have the items "Test Metric" in the "Metrics" zone
        await since('The editor panel should have the items "Test Metric" in the "Metrics" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Test Metric', 'Metrics').isDisplayed())
            .toBe(true);
        //  When I open context menu for Editor Panel
        await editorPanelForGrid.openPanelContextMenu();
        //  And I choose "Rename" from menu
        await editorPanelForGrid.selectOptionFromContextMenu('Rename');
        //  And I change title to "Renamed Viz"
        await editorPanelForGrid.changeTitle('Renamed Viz');
        //  Then The container "Renamed Viz" should be selected
        await since('The container "Renamed Viz" should be selected')
            .expect(await grid.isContainerSelected('Renamed Viz'))
            .toBe(true);
        //  When I swap axis from editor panel
        await ngmEditorPanel.editorPanelShortcutFunction('swap');
        //  Then the editor panel should have the items "Metric Names" in the "Rows" zone
        await since('The editor panel should have the items "Metric Names" in the "Rows" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Metric Names', 'Rows').isDisplayed())
            .toBe(true);
        //  Then the editor panel should have the items "Year" in the "Rows" zone
        await since('The editor panel should have the items "Year" in the "Rows" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Year', 'Rows').isDisplayed())
            .toBe(true);
        //  Then the editor panel should have the items "Region" in the "Columns" zone
        await since('The editor panel should have the items "Region" in the "Columns" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Region', 'Columns').isDisplayed())
            .toBe(true);
   });
});
