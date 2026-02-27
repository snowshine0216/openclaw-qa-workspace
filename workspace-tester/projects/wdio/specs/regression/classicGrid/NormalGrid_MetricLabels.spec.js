import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';
import * as gridConstants from '../../../constants/grid.js';

//npm run regression -- --baseUrl=https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --spec 'specs/regression/classicGrid/NormalGrid_MetricLabels.spec.js'
describe('NormalGrid_MetricLabels', () => {
    let {
        vizPanelForGrid,
        baseContainer,
        baseVisualization,
        dossierAuthoringPage,
        contentsPanel,
        libraryPage,
        loginPage,
        editorPanelForGrid,
        agGridVisualization,
        baseFormatPanel,
        baseFormatPanelReact,
        newFormatPanelForGrid,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.handleError();
    });

    it('[TC25565] Simple/compound grid show "Metrics" label feature', async () => {
    //  When I open dossier by its ID "2F193E0011EAB0FFF3240080EFD5342F"
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.MetricLabels_Dashboard.id,
            projectId: gridConstants.MetricLabels_Dashboard.project.id,
        });
    //  Then The grid visualization "Visualization 1" does not have object "Metrics" in its Header
        await since('The grid visualization "Visualization 1" does not have object "Metrics" in its Header')
            .expect(await vizPanelForGrid.getGridElement("Metrics", "Visualization 1").isDisplayed())
            .toBeFalse();
    
    //  # support metrics on columns
    //  When I right click on element "Cost" and select "Show "Metrics" Label" from visualization "Visualization 1"
        await vizPanelForGrid.openContextMenuItemForGridCells('Cost', 'Show "Metrics" Label', 'Visualization 1');
    //  Then The grid visualization "Visualization 1" has object "Metrics" in its Header
        await since('The grid visualization "Visualization 1" has object "Metrics" in its Header')
            .expect(await vizPanelForGrid.getGridElement("Metrics", "Visualization 1").isDisplayed())
            .toBeTrue();
    //  When I right click on element "Cost" and select "Hide "Metrics" Label" from visualization "Visualization 1"
        await vizPanelForGrid.openContextMenuItemForGridCells('Cost', 'Hide "Metrics" Label', 'Visualization 1');
    //  Then The grid visualization "Visualization 1" does not have object "Metrics" in its Header
        await since('The grid visualization "Visualization 1" does not have object "Metrics" in its Header')
            .expect(await vizPanelForGrid.getGridElement("Metrics", "Visualization 1").isDisplayed())
            .toBeFalse();

    //  # test entry point for "Metrics" label
    //  When I right click on element "Cost" and select "Show "Metrics" Label" from visualization "Visualization 1"
        await vizPanelForGrid.openContextMenuItemForGridCells('Cost', 'Show "Metrics" Label', 'Visualization 1');
    //  Then The grid visualization "Visualization 1" has object "Metrics" in its Header
        await since('The grid visualization "Visualization 1" has object "Metrics" in its Header')
            .expect(await vizPanelForGrid.getGridElement("Metrics", "Visualization 1").isDisplayed())
            .toBeTrue();
    //  When I right click on element "Metrics" and select "Hide "Metrics" Label" from visualization "Visualization 1"
        await vizPanelForGrid.openContextMenuItemForGridCells('Metrics', 'Hide "Metrics" Label', 'Visualization 1');
    //  Then The grid visualization "Visualization 1" does not have object "Metrics" in its Header
        await since('The grid visualization "Visualization 1" does not have object "Metrics" in its Header')
            .expect(await vizPanelForGrid.getGridElement("Metrics", "Visualization 1").isDisplayed())
            .toBeFalse();

    //  # support outline mode
    //  When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
    //  And I switch to Grid tab in Format Panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
    //  And I expand "Layout" section
        await newFormatPanelForGrid.expandLayoutSection();
    //  And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
    //  And I right click on element "Cost" and select "Show "Metrics" Label" from visualization "Visualization 1"
        await vizPanelForGrid.openContextMenuItemForGridCells('Cost', 'Show "Metrics" Label', 'Visualization 1');
    // Then The grid visualization "Visualization 1" has object "Metrics" in its Header
        await since('The grid visualization "Visualization 1" has object "Metrics" in its Header')
            .expect(await vizPanelForGrid.getGridElement("Metrics", "Visualization 1").isDisplayed())
            .toBeTrue();
    //  When I right click on element "Cost" and select "Hide "Metrics" Label" from visualization "Visualization 1"
        await vizPanelForGrid.openContextMenuItemForGridCells('Cost', 'Hide "Metrics" Label', 'Visualization 1');
    //  Then The grid visualization "Visualization 1" does not have object "Metrics" in its Header
        await since('The grid visualization "Visualization 1" has object "Metrics" in its Header')
            .expect(await vizPanelForGrid.getGridElement("Metrics", "Visualization 1").isDisplayed())
            .toBeFalse();
    //  And I click Enable Outline check box under Layout section
        await baseFormatPanelReact.switchToGeneralSettingsTab();
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
    //  And I select the Grid Editor panel section "Editor"
        await editorPanelForGrid.selectDropZonePanel("Editor");

    //  # support metrics on rows
    //  When I drag "attribute" named "Month" from dataset "retail-sample-data.xls" to dropzone "Rows" and drop it below "City"
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Month',
            'attribute',
            'retail-sample-data.xls',
            'Rows',
            'below',
            'City'
        );
    //  And I drag "Cost" out of grid visualization "Visualization 1" to datasets panel zone
        await vizPanelForGrid.openContextMenuItemForGridCells("Cost", "Remove", "Visualization 1");
    //  And I complete drop action
    //  And I drag "metric" named "Cost" from dataset "retail-sample-data.xls" to dropzone "Rows" and drop it below "City"
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
                'Cost',
                'metric',
                'retail-sample-data.xls',
                'Rows',
                'below',
                'City'
            );
    //  Then The grid visualization "Visualization 1" does not have object "Metrics" in its Header
        await since('The grid visualization "Visualization 1" has object "Metrics" in its Header')
            .expect(await vizPanelForGrid.getGridElement("Metrics", "Visualization 1").isDisplayed())
            .toBeFalse();
    //  When I right click on element "Cost" and select "Show "Metrics" Label" from visualization "Visualization 1"
        await vizPanelForGrid.openContextMenuItemForGridCells('Cost', 'Show "Metrics" Label', 'Visualization 1');
    //  Then The grid visualization "Visualization 1" has object "Metrics" in its Header
        await since('The grid visualization "Visualization 1" has object "Metrics" in its Header')
            .expect(await vizPanelForGrid.getGridElement("Metrics", "Visualization 1").isDisplayed())
            .toBeTrue();
    //  When I right click on element "Cost" and select "Hide "Metrics" Label" from visualization "Visualization 1"
        await vizPanelForGrid.openContextMenuItemForGridCells('Cost', 'Hide "Metrics" Label', 'Visualization 1');
    //  Then The grid visualization "Visualization 1" does not have object "Metrics" in its Header
        await since('The grid visualization "Visualization 1" has object "Metrics" in its Header')
            .expect(await vizPanelForGrid.getGridElement("Metrics", "Visualization 1").isDisplayed())
            .toBeFalse();

    //  # support compound grid
    //  When I change visualization "Visualization 1" to "Compound Grid" from context menu
        await baseContainer.changeViz('Compound Grid', 'Visualization 1', true);
    //  And The grid visualization "Visualization 1" does not have object "Metrics" in its Header
        await since('The grid visualization "Visualization 1" has object "Metrics" in its Header')
            .expect(await vizPanelForGrid.getGridElement("Metrics", "Visualization 1").isDisplayed())
            .toBeFalse();
    //  When I right click on element "Cost" and select "Show "Metrics" Label" from visualization "Visualization 1"
        await vizPanelForGrid.openContextMenuItemForGridCells('Cost', 'Show "Metrics" Label', 'Visualization 1');
    //  Then The grid visualization "Visualization 1" has object "Metrics" in its Header
        await since('The grid visualization "Visualization 1" has object "Metrics" in its Header')
            .expect(await vizPanelForGrid.getGridElement("Metrics", "Visualization 1").isDisplayed())
            .toBeTrue();
    //  When I right click on element "Cost" and select "Hide "Metrics" Label" from visualization "Visualization 1"
        await vizPanelForGrid.openContextMenuItemForGridCells('Cost', 'Hide "Metrics" Label', 'Visualization 1');
    //  Then The grid visualization "Visualization 1" does not have object "Metrics" in its Header
        await since('The grid visualization "Visualization 1" has object "Metrics" in its Header')
            .expect(await vizPanelForGrid.getGridElement("Metrics", "Visualization 1").isDisplayed())
            .toBeFalse();

    //  # support undo/redo
    //  When I select "Undo" from toolbar
        await dossierAuthoringPage.actionOnToolbar("Undo");
    //  Then The grid visualization "Visualization 1" has object "Metrics" in its Header
        await since('The grid visualization "Visualization 1" has object "Metrics" in its Header')
            .expect(await vizPanelForGrid.getGridElement("Metrics", "Visualization 1").isDisplayed())
            .toBeTrue();
    //  When I select "Redo" from toolbar
        await dossierAuthoringPage.actionOnToolbar("Redo");
    //  Then The grid visualization "Visualization 1" does not have object "Metrics" in its Header
        await since('The grid visualization "Visualization 1" has object "Metrics" in its Header')
            .expect(await vizPanelForGrid.getGridElement("Metrics", "Visualization 1").isDisplayed())
            .toBeFalse();
    });

    it('[TC25567_01] Regression Test Case 1 - Validate the ability to show or hide the "Metrics" label in Grid visualizations', async () => {
    //  When I open dossier by its ID "43EC3614674B85696C3D46BFF0DAB19F"
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.TC25567_MetricLabel.id,
            projectId: gridConstants.TC25567_MetricLabel.project.id,
        });

    //  # Case 1: Grid with attributes in rows & columns, "Metric Names" in rows above attributes
    //  When I switch to page "Case 1" in chapter "Chapter 1" from contents panel
    //  Then Page "Case 1" in chapter "Chapter 1" is the current page
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Case 1' });
    //  And the grid cell in visualization "Normal" at "1", "1" has text " "
        await since('The grid cell at row 1, column 1 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Normal').getText())
            .toBe(' ');
    //  And the grid cell in visualization "Compound" at "1", "1" has text " "
        await since('The grid cell at row 1, column 1 in visualization "Compound" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Compound').getText())
            .toBe(' ');
    //  And the grid cell in ag-grid "AG Grid" at "0", "0" has text ""
        await since('The grid cell at row 1, column 1 in ag-grid "AG Grid" should have text ""')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'AG Grid'))
            .toBe('');
    //  # Grid: Switch to Graph, enable Subtotal, enable outline mode , apply formatting, show 'Metrics' Label
    //  When I click on container "Normal" to select it 
    //  And I change visualization "Normal" to "Vertical Bar Chart" from context menu
        //await baseContainer.changeViz('Normal', 'Vertical Bar Chart', true);
        await baseVisualization.changeVizType('Normal', 'Bar', 'Vertical Bar Chart');
    //  And I select "Undo" from toolbar 
        await dossierAuthoringPage.actionOnToolbar("Undo");
    //  Then the grid cell in visualization "Normal" at "1", "1" has text " "
        await since('The grid cell at row 1, column 1 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Normal').getText())
            .toBe(' ');
    //  When I toggle the Show Totals for the visualization "Normal" through the visualization context menu
        await vizPanelForGrid.openContextMenu('Normal');
        await vizPanelForGrid.selectContextMenuOption('Show Totals');
    //  Then the grid cell in visualization "Normal" at "1", "1" has text " "
        await since('The grid cell at row 1, column 1 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Normal').getText())
            .toBe(' ');
    //  When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
    //  And I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
    //  And I expand "Layout" section
        await newFormatPanelForGrid.expandLayoutSection();
    //  And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
    //  Then the grid cell in visualization "Normal" at "1", "1" has text " "
        await since('The grid cell at row 1, column 1 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Normal').getText())
            .toBe(' ');
    //  When I switch to the "Text and Form" section on new format panel
        await baseFormatPanelReact.switchSection('Text and Form');
    //  And I change cell fill color to "#FAD47F" through new format panel
        await newFormatPanelForGrid.changeCellsFillColor('#FAD47F');
        await newFormatPanelForGrid.click({ elem: newFormatPanelForGrid.cellFillColorBtn });
    //  Then the grid cell in visualization "Normal" at "1", "1" has style "background-color" with value "rgba(250, 212, 127, 1)"
        await since('The grid cell in visualization "Normal" at "1", "1" has style "background-color" with value "rgba(250, 212, 127, 1)"')
            .expect(await vizPanelForGrid.getGridCellStyleByPosition(1, 1, "Normal",'background-color'))
            .toEqual('rgba(250,212,127,1)');
    //  And the grid cell in visualization "Normal" at "1", "1" has text " "
        await since('The grid cell at row 1, column 1 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Normal').getText())
            .toBe(' ');
    //  When I right click on element at "1", "1" and select 'Show "Metrics" Label' from visualization "Normal"
        await vizPanelForGrid.selectContextMenuOptionFromElementByIndex(1, 1, 'Show "Metrics" Label', 'Normal');
    //  Then the grid cell in visualization "Normal" at "1", "1" has text "Metrics"
        await since('The grid cell at row 1, column 1 in visualization "Normal" should have text "Metrics"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Normal').getText())
            .toBe('Metrics');
    //  # Compound Grid: Enable Subtotal, enable outline mode , apply formatting, show 'Metrics' Label
    //  When I click on container "Compound" to select it 
    //  And I toggle the Show Totals for the visualization "Compound" through the visualization context menu
        await vizPanelForGrid.openContextMenu('Compound');
        await vizPanelForGrid.selectContextMenuOption('Show Totals');
    //  Then the grid cell in visualization "Compound" at "1", "1" has text " "
        await since('The grid cell at row 1, column 1 in visualization "Compound" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Compound').getText())
            .toBe(' ');
    //  When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
    //  And I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
    //  And I expand "Layout" section
        await newFormatPanelForGrid.expandLayoutSection();
    //  And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
    //  Then the grid cell in visualization "Compound" at "1", "1" has text " "
        await since('The grid cell at row 1, column 1 in visualization "Compound" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Compound').getText())
            .toBe(' ');
    //  When I switch to the "Text and Form" section on new format panel
        await baseFormatPanelReact.switchSection('Text and Form');
    //  And I change cell fill color to "#FAD47F" through new format panel
        await newFormatPanelForGrid.changeCellsFillColor('#FAD47F');
        await newFormatPanelForGrid.click({ elem: newFormatPanelForGrid.cellFillColorBtn });
    //  Then the grid cell in visualization "Compound" at "1", "1" has style "background-color" with value "rgba(250, 212, 127, 1)"
        await since('The grid cell in visualization "Compound" at "1", "1" has style "background-color" with value "rgba(250, 212, 127, 1)"')
            .expect(await vizPanelForGrid.getGridCellStyleByPosition(1, 1, "Compound",'background-color'))
            .toEqual('rgba(250,212,127,1)');
    //  And the grid cell in visualization "Compound" at "1", "1" has text " "
        await since('The grid cell at row 1, column 1 in visualization "Compound" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Compound').getText())
            .toBe(' ');
    //  When I right click on element at "1", "1" and select 'Show "Metrics" Label' from visualization "Compound"
        await vizPanelForGrid.selectContextMenuOptionFromElementByIndex(1, 1, 'Show "Metrics" Label', 'Compound');
    //  Then the grid cell in visualization "Compound" at "1", "1" has text "Metrics"
        await since('The grid cell at row 1, column 1 in visualization "Compound" should have text "Metrics"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Compound').getText())
            .toBe('Metrics');

    //  # AG Grid: Enable Subtotal, enable outline mode , apply formatting, show 'Metrics' Label
    //  When I click on container "AG Grid" to select it 
    //  And I toggle the Show Totals for the visualization "AG Grid" through the visualization context menu
        await vizPanelForGrid.openContextMenu('AG Grid');
        await vizPanelForGrid.selectContextMenuOption('Show Totals');
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has text ""
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text ""')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'AG Grid'))
            .toBe('');
    //  And the grid cell in ag-grid "AG Grid" at "0", "1" has text "Region"
        await since('The grid cell at row 0, column 1 in ag-grid "AG Grid" should have text "Region"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'AG Grid'))
            .toBe('Region');
    //  When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
    //  And I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
    //  And I expand "Layout" section
        await newFormatPanelForGrid.expandLayoutSection();
    //  And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has text "Region"
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text "Region"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'AG Grid'))
            .toBe('Region');
    //  When I switch to the "Text and Form" section on new format panel
        await baseFormatPanelReact.switchSection('Text and Form');
    //  And I change cell fill color to "#FAD47F" through new format panel
        await newFormatPanelForGrid.changeCellsFillColor('#FAD47F');
        await newFormatPanelForGrid.click({ elem: newFormatPanelForGrid.cellFillColorBtn });
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has style "background-color" with value "rgba(250, 212, 127, 1)"
        await since('The grid cell in ag-grid "AG Grid" at "0", "0" has style "background-color" with value "rgba(250, 212, 127, 1)"')
            .expect(await agGridVisualization.getGridCellStyleByPos(0, 0, 'background-color'))
            .toEqual('rgba(250,212,127,1)');
    //  And the grid cell in ag-grid "AG Grid" at "0", "0" has text "Region"
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text "Region"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'AG Grid'))
            .toBe('Region');
    //  # Disable outline 
    //  When I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
    //  And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has text ""
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text ""')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'AG Grid'))
            .toBe('');
    //  And the grid cell in ag-grid "AG Grid" at "0", "1" has text "Region"
        await since('The grid cell at row 0, column 1 in ag-grid "AG Grid" should have text "Region"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'AG Grid'))
            .toBe('Region');
    //  When I right click on grid cell at "0", "0" and select 'Show "Metrics" Label' from ag-grid "AG Grid"
        await agGridVisualization.openRMCMenuForCellAtPositionAndSelectFromCM(1, 1, 'AG Grid','Show "Metrics" Label');
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has text "Metrics"
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text "Metrics"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'AG Grid'))
            .toBe('Metrics');
    });

    it('[TC25567_02] Regression Test Case 2 - Validate the ability to show or hide the "Metrics" label in Grid visualizations', async () => {
    //  When I open dossier by its ID "43EC3614674B85696C3D46BFF0DAB19F"
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.TC25567_MetricLabel.id,
            projectId: gridConstants.TC25567_MetricLabel.project.id,
        });
    
    //  # Case 2: Grid with attributes in rows & columns, "Metric Names" in rows between attributes
    //  When I switch to page "Case 3" in chapter "Chapter 1" from contents panel
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Case 3' });
    //  Then Page "Case 3" in chapter "Chapter 1" is the current page
    //  And the grid cell in visualization "Normal" at "1", "2" has text " "
        await since('The grid cell at row 1, column 2 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Normal').getText())
            .toBe(' ');
    //  And the grid cell in visualization "Compound" at "1", "2" has text " "
        await since('The grid cell at row 1, column 2 in visualization "Compound" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Compound').getText())
            .toBe(' ');
    //  And the grid cell in ag-grid "AG Grid" at "0", "1" has text ""
        await since('The grid cell at row 0, column 1 in ag-grid "AG Grid" should have text ""')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'AG Grid'))
            .toBe('');
    //  # Grid: Enable Subtotal, enable outline mode , apply formatting, show 'Metrics' Label
    //  When I click on container "Normal" to select it
    //  And I toggle the Show Totals for the visualization "Normal" through the visualization context menu
        await vizPanelForGrid.openContextMenu('Normal');
        await vizPanelForGrid.selectContextMenuOption('Show Totals');
    //  Then the grid cell in visualization "Normal" at "1", "2" has text " "
        await since('The grid cell at row 1, column 2 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Normal').getText())
            .toBe(' ');
    //  When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
    //  And I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
    //  And I expand "Layout" section
        await newFormatPanelForGrid.expandLayoutSection();
    //  And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
    //  Then the grid cell in visualization "Normal" at "1", "2" has text " "
        await since('The grid cell at row 1, column 2 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Normal').getText())
            .toBe(' ');
    //  When I switch to the "Text and Form" section on new format panel
        await baseFormatPanelReact.switchSection('Text and Form');
    //  And I change cell fill color to "#FAD47F" through new format panel
        await newFormatPanelForGrid.changeCellsFillColor('#FAD47F');
        await newFormatPanelForGrid.click({ elem: newFormatPanelForGrid.cellFillColorBtn });
    //  Then the grid cell in visualization "Normal" at "1", "2" has style "background-color" with value "rgba(250, 212, 127, 1)"
        await since('The grid cell in visualization "Normal" at "1", "2" has style "background-color" with value "rgba(250, 212, 127, 1)"')
            .expect(await vizPanelForGrid.getGridCellStyleByPosition(1, 2, "Normal",'background-color'))
            .toEqual('rgba(250,212,127,1)');
    //  And the grid cell in visualization "Normal" at "1", "2" has text " "
        await since('The grid cell at row 1, column 2 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Normal').getText())
            .toBe(' ');
    //  When I right click on element at "1", "2" and select 'Show "Metrics" Label' from visualization "Normal"
        await vizPanelForGrid.selectContextMenuOptionFromElementByIndex(1, 2, 'Show "Metrics" Label', 'Normal');
    //  Then the grid cell in visualization "Normal" at "1", "2" has text "Metrics"
        await since('The grid cell at row 1, column 2 in visualization "Normal" should have text "Metrics"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Normal').getText())
            .toBe('Metrics');

    //  # Compound Grid: Enable Subtotal, enable outline mode , apply formatting, show 'Metrics' Label
    //  When I click on container "Compound" to select it 
    //  And I toggle the Show Totals for the visualization "Compound" through the visualization context menu
        await vizPanelForGrid.openContextMenu('Compound');
        await vizPanelForGrid.selectContextMenuOption('Show Totals');
    //  Then the grid cell in visualization "Compound" at "1", "2" has text " "
        await since('The grid cell at row 1, column 2 in visualization "Compound" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Compound').getText())
            .toBe(' ');
    //  When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
    //  And I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
    //  And I expand "Layout" section
        await newFormatPanelForGrid.expandLayoutSection();
    //  And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
    //  Then the grid cell in visualization "Compound" at "1", "2" has text " "
        await since('The grid cell at row 1, column 2 in visualization "Compound" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Compound').getText())
            .toBe(' ');
    //  When I switch to the "Text and Form" section on new format panel
        await baseFormatPanelReact.switchSection('Text and Form');
    //  And I change cell fill color to "#FAD47F" through new format panel
        await newFormatPanelForGrid.changeCellsFillColor('#FAD47F');
        await newFormatPanelForGrid.click({ elem: newFormatPanelForGrid.cellFillColorBtn });
    //  Then the grid cell in visualization "Compound" at "1", "2" has style "background-color" with value "rgba(250, 212, 127, 1)"
        await since('The grid cell in visualization "Compound" at "1", "2" has style "background-color" with value "rgba(250, 212, 127, 1)"')
            .expect(await vizPanelForGrid.getGridCellStyleByPosition(1, 2, "Compound",'background-color'))
            .toEqual('rgba(250,212,127,1)');
    //  And the grid cell in visualization "Compound" at "1", "2" has text " "
        await since('The grid cell at row 1, column 2 in visualization "Compound" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Compound').getText())
            .toBe(' ');
    //  When I right click on element at "1", "2" and select 'Show "Metrics" Label' from visualization "Compound"
        await vizPanelForGrid.selectContextMenuOptionFromElementByIndex(1, 2, 'Show "Metrics" Label', 'Compound');
    //  Then the grid cell in visualization "Compound" at "1", "2" has text "Metrics"
        await since('The grid cell at row 1, column 2 in visualization "Compound" should have text "Metrics"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Compound').getText())
            .toBe('Metrics');

    //  # AG Grid: Enable Subtotal, enable outline mode , apply formatting, show 'Metrics' Label
    //  When I click on container "AG Grid" to select it 
    //  And I toggle the Show Totals for the visualization "AG Grid" through the visualization context menu
        await vizPanelForGrid.openContextMenu('AG Grid');
        await vizPanelForGrid.selectContextMenuOption('Show Totals');
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has text "Region"
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text "Region"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'AG Grid'))
            .toBe('Region');
    //  And the grid cell in ag-grid "AG Grid" at "0", "1" has text ""
        await since('The grid cell at row 0, column 1 in ag-grid "AG Grid" should have text ""')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'AG Grid'))
            .toBe('');
    //  When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
    //  And I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
    //  And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.expandLayoutSection();
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has text "Region"
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text "Region"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'AG Grid'))
            .toBe('Region');
    //  When I switch to the "Text and Form" section on new format panel
        await baseFormatPanelReact.switchSection('Text and Form');
    //  And I change cell fill color to "#FAD47F" through new format panel
        await newFormatPanelForGrid.changeCellsFillColor('#FAD47F');
        await newFormatPanelForGrid.click({ elem: newFormatPanelForGrid.cellFillColorBtn });
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has style "background-color" with value "rgba(250, 212, 127, 1)"
        await since('The grid cell in ag-grid "AG Grid" at "0", "0" has style "background-color" with value "rgba(250, 212, 127, 1)"')
            .expect(await agGridVisualization.getGridCellStyleByPos(0, 0, 'background-color'))
            .toEqual('rgba(250,212,127,1)');
    //  And the grid cell in ag-grid "AG Grid" at "0", "0" has text "Region"
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text "Region"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'AG Grid'))
            .toBe('Region');

    //  # Disable outline 
    //  When I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
    //  And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has text "Region"
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text "Region"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'AG Grid'))
            .toBe('Region');
    //  And the grid cell in ag-grid "AG Grid" at "0", "1" has text ""
        await since('The grid cell at row 0, column 1 in ag-grid "AG Grid" should have text ""')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'AG Grid'))
            .toBe('');
    //  When I right click on grid cell at "0", "1" and select 'Show "Metrics" Label' from ag-grid "AG Grid"
        await agGridVisualization.openRMCMenuForCellAtPositionAndSelectFromCM(1, 2, 'AG Grid', 'Show "Metrics" Label');
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has text "Region"
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text "Region"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'AG Grid'))
            .toBe('Region');
    //  And the grid cell in ag-grid "AG Grid" at "0", "1" has text "Metrics"
        await since('The grid cell at row 0, column 1 in ag-grid "AG Grid" should have text "Metrics"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'AG Grid'))
            .toBe('Metrics');
    });

    it('[TC25567_03] Regression Test Case 3 - Validate the ability to show or hide the "Metrics" label in Grid visualizations', async () => {
    //  When I open dossier by its ID "43EC3614674B85696C3D46BFF0DAB19F"
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.TC25567_MetricLabel.id,
            projectId: gridConstants.TC25567_MetricLabel.project.id,
        });
    
    //  # Case 3: Grid with attributes in rows & columns, "Metric Names" in rows below attributes
    //  When I switch to page "Case 2" in chapter "Chapter 1" from contents panel
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Case 2' });
    //  Then Page "Case 2" in chapter "Chapter 1" is the current page
    //  # Grid: show 'Metrics' Label
    //  When I click on container "Normal" to select it 
    //  Then the grid cell in visualization "Normal" at "1", "3" has text "Category"
        await since('The grid cell at row 1, column 3 in visualization "Normal" should have text "Category"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Normal').getText())
            .toBe('Category');
    //  And the grid cell in visualization "Normal" at "2", "4" has text "Cost"
        await since('The grid cell at row 2, column 4 in visualization "Normal" should have text "Cost"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 4, 'Normal').getText())
            .toBe('Cost');
    //  When I right click on element at "2", "4" and select 'Show "Metrics" Label' from visualization "Normal"
        await vizPanelForGrid.selectContextMenuOptionFromElementByIndex(2, 4, 'Show "Metrics" Label', 'Normal');
    //  Then the grid cell in visualization "Normal" at "1", "3" has text "Category"
        await since('The grid cell at row 1, column 3 in visualization "Normal" should have text "Category"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Normal').getText())
            .toBe('Category');
    //  And the grid cell in visualization "Normal" at "2", "4" has text "Cost"
        await since('The grid cell at row 2, column 4 in visualization "Normal" should have text "Cost"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 4, 'Normal').getText())
            .toBe('Cost');

    //  # Compound Grid: Enable Subtotal, enable outline mode , apply formatting, show 'Metrics' Label
    //  When I click on container "Compound" to select it
    //  Then the grid cell in visualization "Compound" at "1", "3" has text "Category"
        await since('The grid cell at row 1, column 3 in visualization "Compound" should have text "Category"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Compound').getText())
            .toBe('Category');
    // # Hide 'Metrics' Label
    //  When I right click on element at "2", "4" and select 'Hide "Metrics" Label' from visualization "Compound"
        await vizPanelForGrid.selectContextMenuOptionFromElementByIndex(2, 4, 'Hide "Metrics" Label', 'Compound');
    //  Then the grid cell in visualization "Compound" at "1", "3" has text "Category"
        await since('The grid cell at row 1, column 3 in visualization "Compound" should have text "Category"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Compound').getText())
            .toBe('Category');
    //  When I toggle the Show Totals for the visualization "Compound" through the visualization context menu
        await vizPanelForGrid.openContextMenu('Compound');
        await vizPanelForGrid.selectContextMenuOption('Show Totals');
    //  Then the grid cell in visualization "Compound" at "1", "6" has text "Total"
        await since('The grid cell at row 1, column 6 in visualization "Compound" should have text "Total"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 6, 'Compound').getText())
            .toBe('Total');
    //  When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
    //  And I expand "Layout" section
        await newFormatPanelForGrid.expandLayoutSection();
    //  Then I pause execution for 3 seconds
    //  And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
    //  Then the grid cell in visualization "Compound" at "1", "3" has text " "
        await since('The grid cell at row 1, column 3 in visualization "Compound" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Compound').getText())
            .toBe(' ');
    //  When I switch to the "Text and Form" section on new format panel
        await baseFormatPanelReact.switchSection('Text and Form');
    //  And I change cell fill color to "#FAD47F" through new format panel
        await newFormatPanelForGrid.changeCellsFillColor('#FAD47F');
        await newFormatPanelForGrid.click({ elem: newFormatPanelForGrid.cellFillColorBtn });
    //  Then the grid cell in visualization "Compound" at "1", "3" has style "background-color" with value "rgba(250, 212, 127, 1)"
        await since('The grid cell in visualization "Compound" at "1", "3" has style "background-color" with value "rgba(250, 212, 127, 1)"')
            .expect(await vizPanelForGrid.getGridCellStyleByPosition(1, 3, "Compound",'background-color'))
            .toEqual('rgba(250,212,127,1)');
    //  And the grid cell in visualization "Compound" at "1", "3" has text " "
        await since('The grid cell at row 1, column 3 in visualization "Compound" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Compound').getText())
            .toBe(' ');
    //  When I right click on element at "1", "3" and select 'Show "Metrics" Label' from visualization "Compound"
        await vizPanelForGrid.selectContextMenuOptionFromElementByIndex(1, 3, 'Show "Metrics" Label', 'Compound');
    //  Then the grid cell in visualization "Compound" at "1", "3" has text "Metrics"
        await since('The grid cell at row 1, column 3 in visualization "Compound" should have text "Metrics"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Compound').getText())
            .toBe('Metrics');

    //  # AG Grid: Enable Subtotal, enable outline mode , apply formatting, show 'Metrics' Label
    //  When I click on container "AG Grid" to select it 
    //  Then the grid cell in ag-grid "AG Grid" at "0", "3" has text "Category"
        await since('The grid cell at row 0, column 3 in ag-grid "AG Grid" should have text "Category"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 4, 'AG Grid'))
            .toBe('Category');
    //  # Hide 'Metrics' Labeel
    //  When I right click on grid cell at "1", "3" and select 'Hide "Metrics" Label' from ag-grid "AG Grid"
        await agGridVisualization.openRMCMenuForCellAtPositionAndSelectFromCM(2, 4, 'AG Grid', 'Hide "Metrics" Label');
    //  Then the grid cell in ag-grid "AG Grid" at "1", "3" has text "Cost"
        await since('The grid cell at row 1, column 3 in ag-grid "AG Grid" should have text "Cost"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 4, 'AG Grid'))
            .toBe('Cost');
    //  When I toggle the Show Totals for the visualization "AG Grid" through the visualization context menu
        await vizPanelForGrid.openContextMenu('AG Grid');
        await vizPanelForGrid.selectContextMenuOption('Show Totals');
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has text "Region"
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text "Region"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'AG Grid'))
            .toBe('Region');
    //  And the grid cell in ag-grid "AG Grid" at "0", "6" has text "Total"
        await since('The grid cell at row 0, column 6 in ag-grid "AG Grid" should have text "Total"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 7, 'AG Grid'))
            .toBe('Total');
    //  When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
    //  And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.expandLayoutSection();
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has text "Region"
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text "Region"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'AG Grid'))
            .toBe('Region');
    //  And the grid cell in ag-grid "AG Grid" at "0", "4" has text "Books"
        await since('The grid cell at row 0, column 4 in ag-grid "AG Grid" should have text "Books"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 5, 'AG Grid'))
            .toBe('Books');
    //  When I switch to the "Text and Form" section on new format panel
        await baseFormatPanelReact.switchSection('Text and Form');
    //  And I change cell fill color to "#FAD47F" through new format panel
        await newFormatPanelForGrid.changeCellsFillColor('#FAD47F');
        await newFormatPanelForGrid.click({ elem: newFormatPanelForGrid.cellFillColorBtn });
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has style "background-color" with value "rgba(250, 212, 127, 1)"
        await since('The grid cell in ag-grid "AG Grid" at "0", "0" has style "background-color" with value "rgba(250, 212, 127, 1)"')
            .expect(await agGridVisualization.getGridCellStyleByPos(0, 0, 'background-color'))
            .toEqual('rgba(250,212,127,1)');
    //  And the grid cell in ag-grid "AG Grid" at "0", "0" has text "Region"
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text "Region"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'AG Grid'))
            .toBe('Region');
    //  # Disable outline 
    //  When I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
    //  And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has text "Region"
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text "Region"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'AG Grid'))
            .toBe('Region');
    //  And the grid cell in ag-grid "AG Grid" at "0", "3" has text "Category"
        await since('The grid cell at row 0, column 3 in ag-grid "AG Grid" should have text "Category"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 4, 'AG Grid'))
            .toBe('Category');
    //  When I right click on grid cell at "1", "3" and select 'Show "Metrics" Label' from ag-grid "AG Grid"
        await agGridVisualization.openRMCMenuForCellAtPositionAndSelectFromCM(2, 4, 'AG Grid', 'Show "Metrics" Label');
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has text "Region"
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text "Region"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'AG Grid'))
            .toBe('Region');
    //  And the grid cell in ag-grid "AG Grid" at "0", "3" has text "Category"
        await since('The grid cell at row 0, column 3 in ag-grid "AG Grid" should have text "Category"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 4, 'AG Grid'))
            .toBe('Category');
    });

    it('[TC25567_04] Regression Test Case 4 - Validate the ability to show or hide the "Metrics" label in Grid visualizations', async () => {
    //  When I open dossier by its ID "43EC3614674B85696C3D46BFF0DAB19F"
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.TC25567_MetricLabel.id,
            projectId: gridConstants.TC25567_MetricLabel.project.id,
        });

    //  # Case 4: Grid with attributes in rows & columns, "Metric Names" in columns above attributes
    //  When I switch to page "Case 4" in chapter "Chapter 1" from contents panel
    //  Then Page "Case 4" in chapter "Chapter 1" is the current page
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Case 4' });
    //  # Grid: Enable Subtotal, enable outline mode , apply formatting, show 'Metrics' Label
    //  When I click on container "Normal" to select it
    //  Then the grid cell in visualization "Normal" at "1", "1" has text "Region"
        await since('The grid cell at row 1, column 1 in visualization "Normal" should have text "Region"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Normal').getText())
            .toBe('Region');
    //  And the grid cell in visualization "Normal" at "1", "2" has text " "
        await since('The grid cell at row 1, column 2 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Normal').getText())
            .toBe(' ');
    //  And the grid cell in visualization "Normal" at "1", "3" has text "Cost"
        await since('The grid cell at row 1, column 3 in visualization "Normal" should have text "Cost"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Normal').getText())
            .toBe('Cost');
    //  And the grid cell in visualization "Normal" at "2", "1" has text "Manager"
        await since('The grid cell at row 2, column 1 in visualization "Normal" should have text "Manager"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Normal').getText())
            .toBe('Manager');
    //  And the grid cell in visualization "Normal" at "2", "2" has text "2015"
        await since('The grid cell at row 2, column 2 in visualization "Normal" should have text "2015"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 2, 'Normal').getText())
            .toBe('2015');
    //  And I toggle the Show Totals for the visualization "Normal" through the visualization context menu
        await vizPanelForGrid.openContextMenu('Normal');
        await vizPanelForGrid.selectContextMenuOption('Show Totals');
    //  Then the grid cell in visualization "Normal" at "1", "2" has text " "
        await since('The grid cell at row 1, column 2 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Normal').getText())
            .toBe(' ');
    //  When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
    //  And I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
    //  And I expand "Layout" section
        await newFormatPanelForGrid.expandLayoutSection();
    //  And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
    //  Then the grid cell in visualization "Normal" at "1", "2" has text " "
        await since('The grid cell at row 1, column 2 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Normal').getText())
            .toBe(' ');
    //  When I switch to the "Text and Form" section on new format panel
        await baseFormatPanelReact.switchSection('Text and Form');
    //  And I change cell fill color to "#FAD47F" through new format panel
        await newFormatPanelForGrid.changeCellsFillColor('#FAD47F');
        await newFormatPanelForGrid.click({ elem: newFormatPanelForGrid.cellFillColorBtn });
    //  Then the grid cell in visualization "Normal" at "1", "2" has style "background-color" with value "rgba(250, 212, 127, 1)"
        await since('The grid cell in visualization "Normal" at "1", "2" has style "background-color" with value "rgba(250, 212, 127, 1)"')
            .expect(await vizPanelForGrid.getGridCellStyleByPosition(1, 2, "Normal",'background-color'))
            .toEqual('rgba(250,212,127,1)');
    //  And the grid cell in visualization "Normal" at "1", "2" has text " "
        await since('The grid cell at row 1, column 2 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Normal').getText())
            .toBe(' ');
    //  When I right click on element at "1", "2" and select 'Show "Metrics" Label' from visualization "Normal"
        await vizPanelForGrid.selectContextMenuOptionFromElementByIndex(1, 2, 'Show "Metrics" Label', 'Normal');
    //  Then the grid cell in visualization "Normal" at "1", "2" has text "Metrics"
        await since('The grid cell at row 1, column 2 in visualization "Normal" should have text "Metrics"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Normal').getText())
            .toBe('Metrics');
    //  # Compound Grid: Show/Hide 'Metrics' Label
    //  When I click on container "Compound" to select it 
    //  Then the grid cell in visualization "Compound" at "1", "1" has text "Region"
        await since('The grid cell at row 1, column 1 in visualization "Compound" should have text "Region"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Compound').getText())
            .toBe('Region');
    //  And the grid cell in visualization "Compound" at "1", "2" has text "Metrics"
        await since('The grid cell at row 1, column 2 in visualization "Compound" should have text "Metrics"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Compound').getText())
            .toBe('Metrics');
    //  And the grid cell in visualization "Compound" at "1", "3" has text "Cost"
        await since('The grid cell at row 1, column 3 in visualization "Compound" should have text "Cost"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Compound').getText())
            .toBe('Cost');
    //  And the grid cell in visualization "Compound" at "2", "1" has text "Manager"
        await since('The grid cell at row 2, column 1 in visualization "Compound" should have text "Manager"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Compound').getText())
            .toBe('Manager');
    //  When I right click on element at "1", "3" and select 'Hide "Metrics" Label' from visualization "Compound"
        await vizPanelForGrid.selectContextMenuOptionFromElementByIndex(1, 3, 'Hide "Metrics" Label', 'Compound');
    //  Then the grid cell in visualization "Compound" at "1", "1" has text "Region"
        await since('The grid cell at row 1, column 1 in visualization "Compound" should have text "Region"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Compound').getText())
            .toBe('Region');
    //  And the grid cell in visualization "Compound" at "1", "2" has text " "
        await since('The grid cell at row 1, column 2 in visualization "Compound" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Compound').getText())
            .toBe(' ');
    //  And the grid cell in visualization "Compound" at "1", "3" has text "Cost"
        await since('The grid cell at row 1, column 3 in visualization "Compound" should have text "Cost"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Compound').getText())
            .toBe('Cost');
    //  And the grid cell in visualization "Compound" at "2", "1" has text "Manager"
        await since('The grid cell at row 2, column 1 in visualization "Compound" should have text "Manager"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Compound').getText())
            .toBe('Manager');

    //  # AG Grid: Show/Hide 'Metrics' Label
    //  When I click on container "AG Grid" to select it 
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has text "Region"
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text "Region"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'AG Grid'))
            .toBe('Region');
    //  And the grid cell in ag-grid "AG Grid" at "1", "2" has text ""
        await since('The grid cell at row 0, column 1 in ag-grid "AG Grid" should have text "Metrics"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'AG Grid'))
            .toBe('Metrics');
    //  And the grid cell in ag-grid "AG Grid" at "0", "3" has text "Cost"
        await since('The grid cell at row 0, column 3 in ag-grid "AG Grid" should have text "Cost"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 4, 'AG Grid'))
            .toBe('Cost');
    //  And the grid cell in ag-grid "AG Grid" at "1", "3" has text "2015"
        await since('The grid cell at row 1, column 3 in ag-grid "AG Grid" should have text "2015"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 4, 'AG Grid'))
            .toBe('2015');
    //  When I right click on grid cell at "0", "1" and select 'Hide "Metrics" Label' from ag-grid "AG Grid"
        await agGridVisualization.openRMCMenuForCellAtPositionAndSelectFromCM(1, 2, 'AG Grid', 'Hide "Metrics" Label');
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has text "Region"
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text "Region"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'AG Grid'))
            .toBe('Region');
    //  And the grid cell in ag-grid "AG Grid" at "0", "1" has text ""
        await since('The grid cell at row 0, column 1 in ag-grid "AG Grid" should have text ""')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'AG Grid'))
            .toBe('');
    //  And the grid cell in ag-grid "AG Grid" at "0", "3" has text "Cost"
        await since('The grid cell at row 0, column 3 in ag-grid "AG Grid" should have text "Cost"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 4, 'AG Grid'))
            .toBe('Cost');
    //  And the grid cell in ag-grid "AG Grid" at "1", "3" has text "2015"
        await since('The grid cell at row 1, column 3 in ag-grid "AG Grid" should have text "2015"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 5, 'AG Grid'))
            .toBe('2015');
    });

    it('[TC25567_05] Regression Test Case 5 - Validate the ability to show or hide the "Metrics" label in Grid visualizations', async () => {
    //  When I open dossier by its ID "43EC3614674B85696C3D46BFF0DAB19F"
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.TC25567_MetricLabel.id,
            projectId: gridConstants.TC25567_MetricLabel.project.id,
        });

    //  # Case 5: Grid with attributes in rows & columns, "Metric Names" in columns below attributes
    //  When I switch to page "Case 5" in chapter "Chapter 1" from contents panel
    //  Then Page "Case 5" in chapter "Chapter 1" is the current page
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Case 5' });
    //  # Grid: Show/Hide 'Metrics' Label
    //  When I click on container "Normal" to select it 
    //  Then the grid cell in visualization "Normal" at "1", "1" has text "Region"
        await since('The grid cell at row 1, column 1 in visualization "Normal" should have text "Region"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Normal').getText())
            .toBe('Region');
    //  And the grid cell in visualization "Normal" at "1", "2" has text "Year"
        await since('The grid cell at row 1, column 2 in visualization "Normal" should have text "Year"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Normal').getText())
            .toBe('Year');
    //  And the grid cell in visualization "Normal" at "1", "3" has text "2015"
        await since('The grid cell at row 1, column 3 in visualization "Normal" should have text "2015"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Normal').getText())
            .toBe('2015');
    //  And the grid cell in visualization "Normal" at "2", "1" has text "Manager"
        await since('The grid cell at row 2, column 1 in visualization "Normal" should have text "Manager"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Normal').getText())
            .toBe('Manager');
    //  And the grid cell in visualization "Normal" at "2", "2" has text "Cost"
        await since('The grid cell at row 2, column 2 in visualization "Normal" should have text "Cost"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 2, 'Normal').getText())
            .toBe('Cost');
    //  The grid visualization "Normal" does not have object "Metrics"
        await since('The grid visualization "Normal" does not have object "Metrics"')
            .expect(await vizPanelForGrid.getGridObject("Metrics", "Normal").isDisplayed())
            .toBe(false);
    //  When I right click on element at "2", "2" and select 'Show "Metrics" Label' from visualization "Normal"
        await vizPanelForGrid.selectContextMenuOptionFromElementByIndex(2, 2, 'Show "Metrics" Label', 'Normal');
    //  Then the grid cell in visualization "Normal" at "1", "1" has text "Region"
        await since('The grid cell at row 1, column 1 in visualization "Normal" should have text "Region"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Normal').getText())
            .toBe('Region');
    //  And the grid cell in visualization "Normal" at "1", "2" has text "Year"
        await since('The grid cell at row 1, column 2 in visualization "Normal" should have text "Year"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Normal').getText())
            .toBe('Year');
    //  And the grid cell in visualization "Normal" at "1", "3" has text "2015"
        await since('The grid cell at row 1, column 3 in visualization "Normal" should have text "2015"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Normal').getText())
            .toBe('2015');
    //  And the grid cell in visualization "Normal" at "2", "1" has text "Manager"
        await since('The grid cell at row 2, column 1 in visualization "Normal" should have text "Manager"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Normal').getText())
            .toBe('Manager');
    //  And the grid cell in visualization "Normal" at "2", "2" has text "Cost"
        await since('The grid cell at row 2, column 2 in visualization "Normal" should have text "Cost"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 2, 'Normal').getText())
            .toBe('Cost');
    //  The grid visualization "Normal" does not have object "Metrics"
        await since('The grid visualization "Normal" does not have object "Metrics"')
            .expect(await vizPanelForGrid.getGridObject("Metrics", "Normal").isDisplayed())
            .toBe(false);

    //  # Compound Grid: Show/Hide 'Metrics' Label
    //  When I click on container "Compound" to select it 
    //  Then the grid cell in visualization "Compound" at "1", "1" has text "Region"
        await since('The grid cell at row 1, column 1 in visualization "Compound" should have text "Region"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Compound').getText())
            .toBe('Region');
    //  And the grid cell in visualization "Compound" at "1", "2" has text "Year"
        await since('The grid cell at row 1, column 2 in visualization "Compound" should have text "Year"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Compound').getText())
            .toBe('Year');
    //  And the grid cell in visualization "Compound" at "1", "3" has text "2015"
        await since('The grid cell at row 1, column 3 in visualization "Compound" should have text "2015"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Compound').getText())
            .toBe('2015');
    //  And the grid cell in visualization "Compound" at "2", "1" has text "Manager"
        await since('The grid cell at row 2, column 1 in visualization "Compound" should have text "Manager"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Compound').getText())
            .toBe('Manager');
    //  The grid visualization "Compound" does not have object "Metrics"
        await since('The grid visualization "Compound" does not have object "Metrics"')
            .expect(await vizPanelForGrid.getGridObject("Metrics", "Compound").isDisplayed())
            .toBe(false);
    //  When I right click on element at "2", "2" and select 'Hide "Metrics" Label' from visualization "Compound"
        await vizPanelForGrid.selectContextMenuOptionFromElementByIndex(2, 2, 'Hide "Metrics" Label', 'Compound');
    //  Then the grid cell in visualization "Compound" at "1", "1" has text "Region"
        await since('The grid cell at row 1, column 1 in visualization "Compound" should have text "Region"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Compound').getText())
            .toBe('Region');
    //  And the grid cell in visualization "Compound" at "1", "2" has text "Year"
        await since('The grid cell at row 1, column 2 in visualization "Compound" should have text "Year"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Compound').getText())
            .toBe('Year');
    //  And the grid cell in visualization "Compound" at "1", "3" has text "2015"
        await since('The grid cell at row 1, column 3 in visualization "Compound" should have text "2015"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Compound').getText())
            .toBe('2015');
    //  And the grid cell in visualization "Compound" at "2", "1" has text "Manager"
        await since('The grid cell at row 2, column 1 in visualization "Compound" should have text "Manager"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Compound').getText())
            .toBe('Manager');
    //  The grid visualization "Compound" does not have object "Metrics"
        await since('The grid visualization "Compound" does not have object "Metrics"')
            .expect(await vizPanelForGrid.getGridObject("Metrics", "Compound").isDisplayed())
            .toBe(false);

    //  # AG Grid: Show/Hide 'Metrics' Label
    //  When I click on container "AG Grid" to select it 
    //  Then the grid cell in ag-grid "AG Grid" at "1", "2" has text ""
        await since('The grid cell at row 1, column 2 in ag-grid "AG Grid" should have text ""')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 3, 'AG Grid'))
            .toBe('');
    //  And the grid cell in ag-grid "AG Grid" at "0", "3" has text "2015"
        await since('The grid cell at row 0, column 3 in ag-grid "AG Grid" should have text "2015"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 4, 'AG Grid'))
            .toBe('2015');
    //  And the grid cell in ag-grid "AG Grid" at "0", "0" has text "Region"
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text "Region"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'AG Grid'))
            .toBe('Region');
    //  And the grid cell in ag-grid "AG Grid" at "1", "1" has text "Manager"
        await since('The grid cell at row 1, column 1 in ag-grid "AG Grid" should have text "Manager"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'AG Grid'))
            .toBe('Manager');
    //  And the grid cell in ag-grid "AG Grid" at "1", "2" has text ""
        await since('The grid cell at row 1, column 2 in ag-grid "AG Grid" should have text ""')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 3, 'AG Grid'))
            .toBe('');
    //  And the grid cell in ag-grid "AG Grid" at "1", "3" has text "Cost"
        await since('The grid cell at row 1, column 3 in ag-grid "AG Grid" should have text "Cost"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 4, 'AG Grid'))
            .toBe('Cost');
    //  The grid visualization "AG Grid" does not have object "Metrics"
        await since('The grid visualization "AG Grid" does not have object "Metrics"')
            .expect(await agGridVisualization.getGridCell("Metrics", "AG Grid").isDisplayed())
            .toBe(false);
    //  When I right click on grid cell at "1", "3" and select 'Hide "Metrics" Label' from ag-grid "AG Grid"
        await agGridVisualization.openRMCMenuForCellAtPositionAndSelectFromCM(2, 4, 'AG Grid', 'Hide "Metrics" Label');
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has text "Region"
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text "Region"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'AG Grid'))
            .toBe('Region');
    //  And the grid cell in ag-grid "AG Grid" at "0", "1" has text "Year"
        await since('The grid cell at row 0, column 1 in ag-grid "AG Grid" should have text "Year"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'AG Grid'))
            .toBe('Year');
    //  And the grid cell in ag-grid "AG Grid" at "1", "2" has text ""
        await since('The grid cell at row 1, column 2 in ag-grid "AG Grid" should have text ""')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 3, 'AG Grid'))
            .toBe('');
    //  And the grid cell in ag-grid "AG Grid" at "0", "3" has text "2015"
        await since('The grid cell at row 0, column 3 in ag-grid "AG Grid" should have text "2015"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 4, 'AG Grid'))
            .toBe('2015');
    //  And the grid cell in ag-grid "AG Grid" at "1", "3" has text "Cost"
        await since('The grid cell at row 1, column 3 in ag-grid "AG Grid" should have text "Cost"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 4, 'AG Grid'))
            .toBe('Cost');
    //  The grid visualization "AG Grid" does not have object "Metrics"
        await since('The grid visualization "AG Grid" does not have object "Metrics"')
            .expect(await agGridVisualization.getGridCell("Metrics", "AG Grid").isDisplayed())
            .toBe(false);
    });
    
    it('[TC25567_06] Regression Test Case 6 - Grid with attributes in rows & columns, "Metric Names" in columns between attributes', async () => {
    //  When I open dossier by its ID "43EC3614674B85696C3D46BFF0DAB19F"
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.TC25567_MetricLabel.id,
            projectId: gridConstants.TC25567_MetricLabel.project.id,
        });

    //  When I switch to page "Case 6" in chapter "Chapter 1" from contents panel
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Case 6' });
    //  Then Page "Case 6" in chapter "Chapter 1" is the current page
    //  When I click on container "Normal" to select it 
    //  Then the grid cell in visualization "Normal" at "1", "1" has text "Region"
        await since('The grid cell at row 1, column 1 in visualization "Normal" should have text "Region"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Normal').getText())
            .toBe('Region');
    //  And the grid cell in visualization "Normal" at "1", "2" has text "Year"
        await since('The grid cell at row 1, column 2 in visualization "Normal" should have text "Year"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Normal').getText())
            .toBe('Year');
    //  And the grid cell in visualization "Normal" at "1", "3" has text "2015"
        await since('The grid cell at row 1, column 3 in visualization "Normal" should have text "2015"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Normal').getText())
            .toBe('2015');
    //  And the grid cell in visualization "Normal" at "2", "1" has text " "
        await since('The grid cell at row 2, column 1 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Normal').getText())
            .toBe(' ');
    //  And the grid cell in visualization "Normal" at "2", "2" has text "Cost"
        await since('The grid cell at row 2, column 2 in visualization "Normal" should have text "Cost"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 2, 'Normal').getText())
            .toBe('Cost');
    //  When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
    //  And I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
    //  And I expand "Layout" section
        await newFormatPanelForGrid.expandLayoutSection();
    //  And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
    //  Then the grid cell in visualization "Normal" at "1", "1" has text "Region"
        await since('The grid cell at row 1, column 1 in visualization "Normal" should have text "Region"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Normal').getText())
            .toBe('Region');
    //  And the grid cell in visualization "Normal" at "1", "2" has text "Year"
        await since('The grid cell at row 1, column 2 in visualization "Normal" should have text "Year"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Normal').getText())
            .toBe('Year');
    //  And the grid cell in visualization "Normal" at "1", "3" has text "2015"
        await since('The grid cell at row 1, column 3 in visualization "Normal" should have text "2015"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Normal').getText())
            .toBe('2015');
    //  And the grid cell in visualization "Normal" at "2", "1" has text " "
        await since('The grid cell at row 2, column 1 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Normal').getText())
            .toBe(' ');
    //  And the grid cell in visualization "Normal" at "2", "2" has text "Cost"
        await since('The grid cell at row 2, column 2 in visualization "Normal" should have text "Cost"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 2, 'Normal').getText())
            .toBe('Cost');
    //  When I switch to the "Text and Form" section on new format panel
        await baseFormatPanelReact.switchSection('Text and Form');
    //  And I change cell fill color to "#FAD47F" through new format panel
        await newFormatPanelForGrid.changeCellsFillColor('#FAD47F');
        await newFormatPanelForGrid.click({ elem: newFormatPanelForGrid.cellFillColorBtn });
    //  Then the grid cell in visualization "Normal" at "2", "1" has style "background-color" with value "rgba(250, 212, 127, 1)"
        await since('The grid cell in visualization "Normal" at "2", "1" has style "background-color" with value "rgba(250, 212, 127, 1)"')
            .expect(await vizPanelForGrid.getGridCellStyleByPosition(2, 1, "Normal",'background-color'))
            .toEqual('rgba(250,212,127,1)');
    //  And the grid cell in visualization "Normal" at "2", "1" has text " "
        await since('The grid cell at row 2, column 1 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Normal').getText())
            .toBe(' ');
    //  When I right click on element at "2", "1" and select 'Show "Metrics" Label' from visualization "Normal"
        await vizPanelForGrid.selectContextMenuOptionFromElementByIndex(2, 1, 'Show "Metrics" Label', 'Normal');
    //  Then the grid cell in visualization "Normal" at "2", "1" has text "Metrics"
        await since('The grid cell at row 2, column 1 in visualization "Normal" should have text "Metrics"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Normal').getText())
            .toBe('Metrics');

    //  # Compound Grid: Show/Hide 'Metrics' Label
    //  When I click on container "Compound" to select it 
    //  Then the grid cell in visualization "Compound" at "1", "1" has text "Region"
        await since('The grid cell at row 1, column 1 in visualization "Compound" should have text "Region"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Compound').getText())
            .toBe('Region');
    //  And the grid cell in visualization "Compound" at "1", "2" has text "Year"
        await since('The grid cell at row 1, column 2 in visualization "Compound" should have text "Year"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Compound').getText())
            .toBe('Year');
    //  And the grid cell in visualization "Compound" at "1", "3" has text "2015"
        await since('The grid cell at row 1, column 3 in visualization "Compound" should have text "2015"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Compound').getText())
            .toBe('2015');
    //  And the grid cell in visualization "Compound" at "2", "1" has text "Metrics"
        await since('The grid cell at row 2, column 1 in visualization "Compound" should have text "Metrics"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Compound').getText())
            .toBe('Metrics');
    //  When I right click on the grid cell "Metrics" by off set "-5" and "-1" and select 'Hide "Metrics" Label' from visualization "Compound"
        await vizPanelForGrid.openContextMenuItemForGridCellsByOffSet('Metrics', 'Hide "Metrics" Label', 'Compound', -5, -1);
    //  Then the grid cell in visualization "Compound" at "1", "1" has text "Region"
        await since('The grid cell at row 1, column 1 in visualization "Compound" should have text "Region"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Compound').getText())
            .toBe('Region');
    //  And the grid cell in visualization "Compound" at "1", "2" has text "Year"
        await since('The grid cell at row 1, column 2 in visualization "Compound" should have text "Year"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Compound').getText())
            .toBe('Year');
    //  And the grid cell in visualization "Compound" at "1", "3" has text "2015"
        await since('The grid cell at row 1, column 3 in visualization "Compound" should have text "2015"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Compound').getText())
            .toBe('2015');
    //  And the grid cell in visualization "Compound" at "2", "1" has text " "
        await since('The grid cell at row 2, column 1 in visualization "Compound" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Compound').getText())
            .toBe(' ');

    //  # AG Grid: Show/Hide 'Metrics' Label
    //  When I click on container "AG Grid" to select it 
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has text "Region"
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text "Region"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'AG Grid'))
            .toBe('Region');
    //  And the grid cell in ag-grid "AG Grid" at "2", "1" has text "Manager"
        await since('The grid cell at row 2, column 1 in ag-grid "AG Grid" should have text "Manager"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'AG Grid'))
            .toBe('Manager');
    //  And the grid cell in ag-grid "AG Grid" at "1", "1" has text "Metrics"
        await since('The grid cell at row 1, column 1 in ag-grid "AG Grid" should have text "Metrics"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'AG Grid'))
            .toBe('Metrics');
    //  And the grid cell in ag-grid "AG Grid" at "1", "3" has text "Cost"
        await since('The grid cell at row 1, column 3 in ag-grid "AG Grid" should have text "Cost"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 4, 'AG Grid'))
            .toBe('Cost');
    //  When I right click on grid cell at "1", "1" and select 'Hide "Metrics" Label' from ag-grid "AG Grid"
        await agGridVisualization.openRMCMenuForCellAtPositionAndSelectFromCM(2, 2, 'AG Grid', 'Hide "Metrics" Label');
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has text "Region"
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text "Region"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'AG Grid'))
            .toBe('Region');
    //  And the grid cell in ag-grid "AG Grid" at "1", "1" has text ""
        await since('The grid cell at row 1, column 1 in ag-grid "AG Grid" should have text ""')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'AG Grid'))
            .toBe('');
    //  And the grid cell in ag-grid "AG Grid" at "0", "3" has text "2015"
        await since('The grid cell at row 0, column 3 in ag-grid "AG Grid" should have text "2015"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 4, 'AG Grid'))
            .toBe('2015');
    //  And the grid cell in ag-grid "AG Grid" at "1", "3" has text "Cost"
        await since('The grid cell at row 1, column 3 in ag-grid "AG Grid" should have text "Cost"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 4, 'AG Grid'))
            .toBe('Cost');
    });

    it('[TC25567_07] Regression Test Case 7 - Grid with attributes and metrics in columns, "Metric Names" above attributes', async () => {
    //  When I open dossier by its ID "43EC3614674B85696C3D46BFF0DAB19F"
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.TC25567_MetricLabel.id,
            projectId: gridConstants.TC25567_MetricLabel.project.id,
        });

    //  When I switch to page "Case 7" in chapter "Chapter 1" from contents panel
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Case 7' });
    //  Then Page "Case 7" in chapter "Chapter 1" is the current page
    //  When I click on container "Normal" to select it 
    //  Then the grid cell in visualization "Normal" at "1", "1" has text " "
        await since('The grid cell at row 1, column 1 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Normal').getText())
            .toBe(' ');
    //  And the grid cell in visualization "Normal" at "1", "2" has text "Cost"
        await since('The grid cell at row 1, column 2 in visualization "Normal" should have text "Cost"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Normal').getText())
            .toBe('Cost');
    //  And the grid cell in visualization "Normal" at "2", "1" has text "Year"
        await since('The grid cell at row 2, column 1 in visualization "Normal" should have text "Year"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Normal').getText())
            .toBe('Year');
    //  And the grid cell in visualization "Normal" at "2", "2" has text "2015"
        await since('The grid cell at row 2, column 2 in visualization "Normal" should have text "2015"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 2, 'Normal').getText())
            .toBe('2015');
    //  And I toggle the Show Totals for the visualization "Normal" through the visualization context menu
        await vizPanelForGrid.openContextMenu('Normal');
        await vizPanelForGrid.selectContextMenuOption('Show Totals');
    //  Then the grid cell in visualization "Normal" at "1", "1" has text " "
        await since('The grid cell at row 1, column 1 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Normal').getText())
            .toBe(' ');
    //  When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
    //  And I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
    //  And I expand "Layout" section
        await newFormatPanelForGrid.expandLayoutSection();
    //  And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
    //  Then the grid cell in visualization "Normal" at "1", "1" has text " "
        await since('The grid cell at row 1, column 1 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Normal').getText())
            .toBe(' ');
    //  When I switch to the "Text and Form" section on new format panel
        await baseFormatPanelReact.switchSection('Text and Form');
    //  And I change cell fill color to "#FAD47F" through new format panel
        await newFormatPanelForGrid.changeCellsFillColor('#FAD47F');
        await newFormatPanelForGrid.click({ elem: newFormatPanelForGrid.cellFillColorBtn });
    //  Then the grid cell in visualization "Normal" at "1", "1" has style "background-color" with value "rgba(250, 212, 127, 1)"
        await since('The grid cell in visualization "Normal" at "1", "1" has style "background-color" with value "rgba(250, 212, 127, 1)"')
            .expect(await vizPanelForGrid.getGridCellStyleByPosition(1, 1, "Normal",'background-color'))
            .toEqual('rgba(250,212,127,1)');
    //  And the grid cell in visualization "Normal" at "1", "1" has text " "
        await since('The grid cell at row 1, column 1 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Normal').getText())
            .toBe(' ');
    //  When I right click on element at "1", "2" and select 'Show "Metrics" Label' from visualization "Normal"
        await vizPanelForGrid.selectContextMenuOptionFromElementByIndex(1, 2, 'Show "Metrics" Label', 'Normal');
    //  Then the grid cell in visualization "Normal" at "1", "1" has text "Metrics"
        await since('The grid cell at row 1, column 1 in visualization "Normal" should have text "Metrics"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Normal').getText())
            .toBe('Metrics');

    //  # Compound Grid: Show/Hide 'Metrics' Label
    //  When I click on container "Compound" to select it 
    //  Then the grid cell in visualization "Compound" at "1", "1" has text "Metrics"
        await since('The grid cell at row 1, column 1 in visualization "Compound" should have text "Metrics"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Compound').getText())
            .toBe('Metrics');
    //  And the grid cell in visualization "Compound" at "2", "1" has text "Year"
        await since('The grid cell at row 2, column 1 in visualization "Compound" should have text "Year"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Compound').getText())
            .toBe('Year');
    //  When I right click on element at "1", "1" and select 'Hide "Metrics" Label' from visualization "Compound"
        await vizPanelForGrid.selectContextMenuOptionFromElementByIndex(1, 1, 'Hide "Metrics" Label', 'Compound');
    //  Then the grid cell in visualization "Compound" at "1", "1" has text " "
        await since('The grid cell at row 1, column 1 in visualization "Compound" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Compound').getText())
            .toBe(' ');
    //  And the grid cell in visualization "Compound" at "2", "1" has text "Year"
        await since('The grid cell at row 2, column 1 in visualization "Compound" should have text "Year"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Compound').getText())
            .toBe('Year');

    //  # AG Grid: Show/Hide 'Metrics' Label
    //  When I click on container "AG Grid" to select it
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has text "Metrics"
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text "Metrics"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'AG Grid'))
            .toBe('Metrics');
    //  And the grid cell in ag-grid "AG Grid" at "1", "1" has text "2015"
        await since('The grid cell at row 1, column 1 in ag-grid "AG Grid" should have text "2015"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'AG Grid'))
            .toBe('2015');
    //  When I right click on grid cell at "0", "0" and select 'Hide "Metrics" Label' from ag-grid "AG Grid"
        await agGridVisualization.openRMCMenuForCellAtPositionAndSelectFromCM(1, 1, 'AG Grid', 'Hide "Metrics" Label');
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has text ""
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text ""')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'AG Grid'))
            .toBe('');
    //  And the grid cell in ag-grid "AG Grid" at "1", "1" has text "2015"
        await since('The grid cell at row 1, column 1 in ag-grid "AG Grid" should have text "2015"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'AG Grid'))
            .toBe('2015');
    });

    it('[TC25567_08] Regression Test Case 8 - Grid with attributes and metrics in columns, "Metric Names" below attributes', async () => {
    //  When I open dossier by its ID "43EC3614674B85696C3D46BFF0DAB19F"
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.TC25567_MetricLabel.id,
            projectId: gridConstants.TC25567_MetricLabel.project.id,
        });

    //  When I switch to page "Case 8" in chapter "Chapter 1" from contents panel
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Case 8' });
    //  Then Page "Case 8" in chapter "Chapter 1" is the current page
    //  # Grid: Enable Subtotal, enable outline mode , apply formatting, show 'Metrics' Label
    //  When I click on container "Normal" to select it 
    //  Then the grid cell in visualization "Normal" at "1", "1" has text "Year"
        await since('The grid cell at row 1, column 1 in visualization "Normal" should have text "Year"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Normal').getText())
            .toBe('Year');
    //  And the grid cell in visualization "Normal" at "1", "2" has text "2015"
        await since('The grid cell at row 1, column 2 in visualization "Normal" should have text "2015"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Normal').getText())
            .toBe('2015');
    //  And the grid cell in visualization "Normal" at "2", "1" has text " "
        await since('The grid cell at row 2, column 1 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Normal').getText())
            .toBe(' ');
    //  And the grid cell in visualization "Normal" at "2", "2" has text "Cost"
        await since('The grid cell at row 2, column 2 in visualization "Normal" should have text "Cost"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 2, 'Normal').getText())
            .toBe('Cost');
    //  And I toggle the Show Totals for the visualization "Normal" through the visualization context menu
        await vizPanelForGrid.openContextMenu('Normal');
        await vizPanelForGrid.selectContextMenuOption('Show Totals');
    //  Then the grid cell in visualization "Normal" at "2", "1" has text " "
        await since('The grid cell at row 2, column 1 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Normal').getText())
            .toBe(' ');
    //  When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
    //  And I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
    //  And I expand "Layout" section
        await newFormatPanelForGrid.expandLayoutSection();
    //  And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
    //  Then the grid cell in visualization "Normal" at "2", "1" has text " "
        await since('The grid cell at row 2, column 1 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Normal').getText())
            .toBe(' ');
    //  When I switch to the "Text and Form" section on new format panel
        await baseFormatPanelReact.switchSection('Text and Form');
    //  And I change cell fill color to "#FAD47F" through new format panel
        await newFormatPanelForGrid.changeCellsFillColor('#FAD47F');
        await newFormatPanelForGrid.click({ elem: newFormatPanelForGrid.cellFillColorBtn });
    //  Then the grid cell in visualization "Normal" at "2", "1" has style "background-color" with value "rgba(250, 212, 127, 1)"
        await since('The grid cell in visualization "Normal" at "2", "1" has style "background-color" with value "rgba(250, 212, 127, 1)"')
            .expect(await vizPanelForGrid.getGridCellStyleByPosition(2, 1, "Normal",'background-color'))
            .toEqual('rgba(250,212,127,1)');
    //  And the grid cell in visualization "Normal" at "2", "1" has text " "
        await since('The grid cell at row 2, column 1 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Normal').getText())
            .toBe(' ');
    //  When I right click on element at "2", "1" and select 'Show "Metrics" Label' from visualization "Normal"
        await vizPanelForGrid.selectContextMenuOptionFromElementByIndex(2, 1, 'Show "Metrics" Label', 'Normal');
    //  Then the grid cell in visualization "Normal" at "2", "1" has text "Metrics"
        await since('The grid cell at row 2, column 1 in visualization "Normal" should have text "Metrics"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Normal').getText())
            .toBe('Metrics');

    //  # Compound Grid: Show/Hide 'Metrics' Label
    //  When I click on container "Compound" to select it 
    //  Then the grid cell in visualization "Compound" at "1", "1" has text "Year"
        await since('The grid cell at row 1, column 1 in visualization "Compound" should have text "Year"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Compound').getText())
            .toBe('Year');
    //  And the grid cell in visualization "Compound" at "2", "1" has text "Metrics"
        await since('The grid cell at row 2, column 1 in visualization "Compound" should have text "Metrics"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Compound').getText())
            .toBe('Metrics');
    //  When I right click on element at "2", "1" and select 'Hide "Metrics" Label' from visualization "Compound"
        await vizPanelForGrid.selectContextMenuOptionFromElementByIndex(2, 1, 'Hide "Metrics" Label', 'Compound');
    //  Then the grid cell in visualization "Compound" at "1", "1" has text "Year"
        await since('The grid cell at row 1, column 1 in visualization "Compound" should have text "Year"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Compound').getText())
            .toBe('Year');
    //  And the grid cell in visualization "Compound" at "2", "1" has text " "
        await since('The grid cell at row 2, column 1 in visualization "Compound" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Compound').getText())
            .toBe(' ');

    //  # AG Grid: Show/Hide 'Metrics' Label
    //  When I click on container "AG Grid" to select it 
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has text "Year"
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text "Year"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'AG Grid'))
            .toBe('Year');
    //  And the grid cell in ag-grid "AG Grid" at "1", "0" has text "Metrics"
        await since('The grid cell at row 1, column 0 in ag-grid "AG Grid" should have text ""')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'AG Grid'))
            .toBe('Metrics');
    //  And the grid cell in ag-grid "AG Grid" at "1", "1" has text "Cost"
        await since('The grid cell at row 1, column 1 in ag-grid "AG Grid" should have text "Cost"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'AG Grid'))
            .toBe('Cost');
    //  When I right click on grid cell at "1", "1" and select 'Hide "Metrics" Label' from ag-grid "AG Grid"
        await agGridVisualization.openRMCMenuForCellAtPositionAndSelectFromCM(2, 2, 'AG Grid', 'Hide "Metrics" Label');
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has text "Year"
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text "Year"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'AG Grid'))
            .toBe('Year');
    //  And the grid cell in ag-grid "AG Grid" at "1", "0" has text ""
        await since('The grid cell at row 1, column 0 in ag-grid "AG Grid" should have text ""')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'AG Grid'))
            .toBe('');
    //  And the grid cell in ag-grid "AG Grid" at "1", "1" has text "Cost"
        await since('The grid cell at row 1, column 1 in ag-grid "AG Grid" should have text "Cost"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'AG Grid'))
            .toBe('Cost');
    });

    it('[TC25567_09] Regression Test Case 9 - Grid with attributes and metrics in columns, "Metric Names" between attributes', async () => {
    //  When I open dossier by its ID "43EC3614674B85696C3D46BFF0DAB19F"
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.TC25567_MetricLabel.id,
            projectId: gridConstants.TC25567_MetricLabel.project.id,
        });

    //  When I switch to page "Case 9" in chapter "Chapter 1" from contents panel
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Case 9' });
    //  Then Page "Case 9" in chapter "Chapter 1" is the current page
    //  # Grid: Enable Subtotal, enable outline mode , apply formatting, show 'Metrics' Label
    //  When I click on container "Normal" to select it 
    //  Then the grid cell in visualization "Normal" at "1", "1" has text "Year"
        await since('The grid cell at row 1, column 1 in visualization "Normal" should have text "Year"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Normal').getText())
            .toBe('Year');
    //  And the grid cell in visualization "Normal" at "1", "2" has text "2015"
        await since('The grid cell at row 1, column 2 in visualization "Normal" should have text "2015"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Normal').getText())
            .toBe('2015');
    //  And the grid cell in visualization "Normal" at "2", "1" has text " "
        await since('The grid cell at row 2, column 1 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Normal').getText())
            .toBe(' ');
    //  And the grid cell in visualization "Normal" at "2", "2" has text "Cost"
        await since('The grid cell at row 2, column 2 in visualization "Normal" should have text "Cost"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 2, 'Normal').getText())
            .toBe('Cost');
    //  And I toggle the Show Totals for the visualization "Normal" through the visualization context menu
        await vizPanelForGrid.openContextMenu('Normal');
        await vizPanelForGrid.selectContextMenuOption('Show Totals');
    //  Then the grid cell in visualization "Normal" at "2", "1" has text " "
        await since('The grid cell at row 2, column 1 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Normal').getText())
            .toBe(' ');
    //  When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
    //  And I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
    //  And I expand "Layout" section
        await newFormatPanelForGrid.expandLayoutSection();
    //  And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
    //  Then the grid cell in visualization "Normal" at "2", "1" has text " "
        await since('The grid cell at row 2, column 1 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Normal').getText())
            .toBe(' ');
    //  When I switch to the "Text and Form" section on new format panel
        await baseFormatPanelReact.switchSection('Text and Form');
    //  And I change cell fill color to "#FAD47F" through new format panel
        await newFormatPanelForGrid.changeCellsFillColor('#FAD47F');
        await newFormatPanelForGrid.click({ elem: newFormatPanelForGrid.cellFillColorBtn });
    //  Then the grid cell in visualization "Normal" at "2", "1" has style "background-color" with value "rgba(250, 212, 127, 1)"
        await since('The grid cell in visualization "Normal" at "2", "1" has style "background-color" with value "rgba(250, 212, 127, 1)"')
            .expect(await vizPanelForGrid.getGridCellStyleByPosition(2, 1, "Normal",'background-color'))
            .toEqual('rgba(250,212,127,1)');
    //  And the grid cell in visualization "Normal" at "2", "1" has text " "
        await since('The grid cell at row 2, column 1 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Normal').getText())
            .toBe(' ');
    //  When I right click on element at "2", "1" and select 'Show "Metrics" Label' from visualization "Normal"
        await vizPanelForGrid.selectContextMenuOptionFromElementByIndex(2, 1, 'Show "Metrics" Label', 'Normal');
    //  Then the grid cell in visualization "Normal" at "2", "1" has text "Metrics"
        await since('The grid cell at row 2, column 1 in visualization "Normal" should have text "Metrics"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Normal').getText())
            .toBe('Metrics');

    //  # Compound Grid: Show/Hide 'Metrics' Label
    //  When I click on container "Compound" from canvas
    //  Then the grid cell in visualization "Compound" at "1", "1" has text "Year"
        await since('The grid cell at row 1, column 1 in visualization "Compound" should have text "Year"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Compound').getText())
            .toBe('Year');
    //  And the grid cell in visualization "Compound" at "2", "1" has text "Metrics"
        await since('The grid cell at row 2, column 1 in visualization "Compound" should have text "Metrics"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Compound').getText())
            .toBe('Metrics');
    //  When I right click on element at "2", "1" and select 'Hide "Metrics" Label' from visualization "Compound"
        await vizPanelForGrid.selectContextMenuOptionFromElementByIndex(2, 1, 'Hide "Metrics" Label', 'Compound');
    //  Then the grid cell in visualization "Compound" at "1", "1" has text "Year"
        await since('The grid cell at row 1, column 1 in visualization "Compound" should have text "Year"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Compound').getText())
            .toBe('Year');
    //  And the grid cell in visualization "Compound" at "2", "1" has text " "
        await since('The grid cell at row 2, column 1 in visualization "Compound" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Compound').getText())
            .toBe(' ');

    //  # AG Grid: Show/Hide 'Metrics' Label
    //  When I click on container "AG Grid" to select it 
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has text "Year"
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text "Year"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'AG Grid'))
            .toBe('Year');
    //  And the grid cell in ag-grid "AG Grid" at "1", "0" has text "Metrics"
        await since('The grid cell at row 1, column 0 in ag-grid "AG Grid" should have text "Metrics"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'AG Grid'))
            .toBe('Metrics');
    //  When I right click on grid cell at "1", "0" and select 'Hide "Metrics" Label' from ag-grid "AG Grid"
        await agGridVisualization.openRMCMenuForCellAtPositionAndSelectFromCM(2, 1, 'AG Grid', 'Hide "Metrics" Label');
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has text "Year"
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text "Year"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'AG Grid'))
            .toBe('Year');
    //  And the grid cell in ag-grid "AG Grid" at "1", "0" has text ""
        await since('The grid cell at row 1, column 0 in ag-grid "AG Grid" should have text ""')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'AG Grid'))
            .toBe('');
    });

    it('[TC25567_10] Regression Test Case 10 - Grid with attributes and metrics in rows, "Metric Names" above attributes', async () => {
    //  When I open dossier by its ID "43EC3614674B85696C3D46BFF0DAB19F"
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.TC25567_MetricLabel.id,
            projectId: gridConstants.TC25567_MetricLabel.project.id,
        });
    //  When I switch to page "Case 10" in chapter "Chapter 1" from contents panel
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Case 10' });
    //  Then Page "Case 10" in chapter "Chapter 1" is the current page
    //  # Grid: Enable Subtotal, enable outline mode , apply formatting, show 'Metrics' Label
    //  When I click on container "Normal" to select it 
    //  Then the grid cell in visualization "Normal" at "1", "1" has text " "
        await since('The grid cell at row 1, column 1 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Normal').getText())
            .toBe(' ');
    //  And the grid cell in visualization "Normal" at "1", "2" has text "Region"
        await since('The grid cell at row 1, column 2 in visualization "Normal" should have text "Region"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Normal').getText())
            .toBe('Region');
    //  And the grid cell in visualization "Normal" at "2", "1" has text "Cost"
        await since('The grid cell at row 2, column 1 in visualization "Normal" should have text "Cost"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Normal').getText())
            .toBe('Cost');
    //  And I toggle the Show Totals for the visualization "Normal" through the visualization context menu
        await vizPanelForGrid.openContextMenu('Normal');
        await vizPanelForGrid.selectContextMenuOption('Show Totals');
    //  Then the grid cell in visualization "Normal" at "1", "1" has text " "
        await since('The grid cell at row 1, column 1 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Normal').getText())
            .toBe(' ');
    //  When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
    //  And I expand "Layout" section
        await newFormatPanelForGrid.expandLayoutSection();
    //  And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
    //  Then the grid cell in visualization "Normal" at "1", "1" has text " "
        await since('The grid cell at row 1, column 1 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Normal').getText())
            .toBe(' ');
    //  When I switch to the "Text and Form" section on new format panel
        await baseFormatPanelReact.switchSection('Text and Form');
    //  And I change cell fill color to "#FAD47F" through new format panel
        await newFormatPanelForGrid.changeCellsFillColor('#FAD47F');
        await newFormatPanelForGrid.click({ elem: newFormatPanelForGrid.cellFillColorBtn });
    //  Then the grid cell in visualization "Normal" at "1", "1" has style "background-color" with value "rgba(250, 212, 127, 1)"
        await since('The grid cell in visualization "Normal" at "1", "1" has style "background-color" with value "rgba(250, 212, 127, 1)"')
            .expect(await vizPanelForGrid.getGridCellStyleByPosition(1, 1, "Normal",'background-color'))
            .toEqual('rgba(250,212,127,1)');
    //  And the grid cell in visualization "Normal" at "1", "1" has text " "
        await since('The grid cell at row 1, column 1 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Normal').getText())
            .toBe(' ');
    //  When I right click on element at "1", "1" and select 'Show "Metrics" Label' from visualization "Normal"
        await vizPanelForGrid.selectContextMenuOptionFromElementByIndex(1, 1, 'Show "Metrics" Label', 'Normal');
    //  Then the grid cell in visualization "Normal" at "1", "1" has text "Metrics"
        await since('The grid cell at row 1, column 1 in visualization "Normal" should have text "Metrics"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Normal').getText())
            .toBe('Metrics');

    //  # Compound Grid: Enable Subtotal, enable outline mode , apply formatting, show 'Metrics' Label
    //  When I click on container "Compound" to select it 
    //  Then the grid cell in visualization "Compound" at "1", "1" has text " "
        await since('The grid cell at row 1, column 1 in visualization "Compound" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Compound').getText())
            .toBe(' ');
    //  And the grid cell in visualization "Compound" at "1", "2" has text "Region"
        await since('The grid cell at row 1, column 2 in visualization "Compound" should have text "Region"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Compound').getText())
            .toBe('Region');
    //  And the grid cell in visualization "Compound" at "2", "1" has text "Profit"
        await since('The grid cell at row 2, column 1 in visualization "Compound" should have text "Profit"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Compound').getText())
            .toBe('Profit');
    //  When I toggle the Show Totals for the visualization "Compound" through the visualization context menu
        await vizPanelForGrid.openContextMenu('Compound');
        await vizPanelForGrid.selectContextMenuOption('Show Totals');
    //  Then the grid cell in visualization "Compound" at "1", "1" has text " "
        await since('The grid cell at row 1, column 1 in visualization "Compound" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Compound').getText())
            .toBe(' ');
    //  When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
    //  And I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
    //  And I expand "Layout" section
        await newFormatPanelForGrid.expandLayoutSection();
    //  Then the grid cell in visualization "Compound" at "1", "1" has text " "
        await since('The grid cell at row 1, column 1 in visualization "Compound" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Compound').getText())
            .toBe(' ');
    //  When I switch to the "Text and Form" section on new format panel
        await baseFormatPanelReact.switchSection('Text and Form');
    //  And I change cell fill color to "#FAD47F" through new format panel
        await newFormatPanelForGrid.changeCellsFillColor('#FAD47F');
        await newFormatPanelForGrid.click({ elem: newFormatPanelForGrid.cellFillColorBtn });
    //  Then the grid cell in visualization "Compound" at "1", "1" has style "background-color" with value "rgba(250, 212, 127, 1)"
        await since('The grid cell in visualization "Compound" at "1", "1" has style "background-color" with value "rgba(250, 212, 127, 1)"')
            .expect(await vizPanelForGrid.getGridCellStyleByPosition(1, 1, "Compound",'background-color'))
            .toEqual('rgba(250,212,127,1)');
    //  And the grid cell in visualization "Compound" at "1", "1" has text " "
        await since('The grid cell at row 1, column 1 in visualization "Compound" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Compound').getText())
            .toBe(' ');
    //  When I right click on element at "1", "1" and select 'Show "Metrics" Label' from visualization "Compound"
        await vizPanelForGrid.selectContextMenuOptionFromElementByIndex(1, 1, 'Show "Metrics" Label', 'Compound');
    //  Then the grid cell in visualization "Compound" at "1", "1" has text "Metrics"
        await since('The grid cell at row 1, column 1 in visualization "Compound" should have text "Metrics"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Compound').getText())
            .toBe('Metrics');

    //  # AG Grid: Enable Subtotal, enable outline mode , apply formatting, show 'Metrics' Label
    //  When I click on container "AG Grid" to select it 
    //  And I toggle the Show Totals for the visualization "AG Grid" through the visualization context menu
        await vizPanelForGrid.openContextMenu('AG Grid');
        await vizPanelForGrid.selectContextMenuOption('Show Totals');
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has text ""
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text ""')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'AG Grid'))
            .toBe('');
    //  And the grid cell in ag-grid "AG Grid" at "0", "1" has text "Region"
        await since('The grid cell at row 0, column 1 in ag-grid "AG Grid" should have text "Region"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'AG Grid'))
            .toBe('Region');
    //  And the grid cell in ag-grid "AG Grid" at "1", "0" has text "Cost"
        await since('The grid cell at row 1, column 0 in ag-grid "AG Grid" should have text "Cost"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'AG Grid'))
            .toBe('Cost');
    //  When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
    //  And I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
    //  And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.expandLayoutSection();
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has text "Region"
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text "Region"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'AG Grid'))
            .toBe('Region');
    //  When I switch to the "Text and Form" section on new format panel
        await baseFormatPanelReact.switchSection('Text and Form');
    //  And I change cell fill color to "#FAD47F" through new format panel
        await newFormatPanelForGrid.changeCellsFillColor('#FAD47F');
        await newFormatPanelForGrid.click({ elem: newFormatPanelForGrid.cellFillColorBtn });
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has style "background-color" with value "rgba(250, 212, 127, 1)"
        await since('The grid cell in ag-grid "AG Grid" at "0", "0" has style "background-color" with value "rgba(250, 212, 127, 1)"')
            .expect(await agGridVisualization.getGridCellStyleByPos(0, 0, 'background-color'))
            .toEqual('rgba(250,212,127,1)');
    //  And  the grid cell in ag-grid "AG Grid" at "0", "0" has text "Region"
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text "Region"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'AG Grid'))
            .toBe('Region');
    //  # Disable outline 
    //  When I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
    //  And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has text ""
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text ""')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'AG Grid'))
            .toBe('');
    //  And the grid cell in ag-grid "AG Grid" at "0", "1" has text "Region"
        await since('The grid cell at row 0, column 1 in ag-grid "AG Grid" should have text "Region"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'AG Grid'))
            .toBe('Region');
    //  When I right click on grid cell at "0", "0" and select 'Show "Metrics" Label' from ag-grid "AG Grid"
        await agGridVisualization.openRMCMenuForCellAtPositionAndSelectFromCM(1, 1, 'AG Grid', 'Show "Metrics" Label');
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has text "Metrics"
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text "Metrics"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'AG Grid'))
            .toBe('Metrics');
    });

    it('[TC25567_11] Regression Test Case 11 - Grid with attributes and metrics in rows, "Metric Names" below attributes', async () => {
    //  When I open dossier by its ID "43EC3614674B85696C3D46BFF0DAB19F"
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.TC25567_MetricLabel.id,
            projectId: gridConstants.TC25567_MetricLabel.project.id,
        });

    //  When I switch to page "Case 11" in chapter "Chapter 1" from contents panel
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Case 11' });
    //  Then Page "Case 11" in chapter "Chapter 1" is the current page
    //  # Grid: Enable Subtotal, enable outline mode , apply formatting, show 'Metrics' Label
    //  When I click on container "Normal" to select it 
    //  Then the grid cell in visualization "Normal" at "1", "1" has text "Region"
        await since('The grid cell at row 1, column 1 in visualization "Normal" should have text "Region"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Normal').getText())
            .toBe('Region');
    //  And the grid cell in visualization "Normal" at "1", "2" has text "Manager"
        await since('The grid cell at row 1, column 2 in visualization "Normal" should have text "Manager"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Normal').getText())
            .toBe('Manager');
    //  And the grid cell in visualization "Normal" at "1", "3" has text " "
        await since('The grid cell at row 1, column 3 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Normal').getText())
            .toBe(' ');
    //  And the grid cell in visualization "Normal" at "1", "4" has text " "
        await since('The grid cell at row 1, column 4 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 4, 'Normal').getText())
            .toBe(' ');
    //  And I toggle the Show Totals for the visualization "Normal" through the visualization context menu
        await vizPanelForGrid.openContextMenu('Normal');
        await vizPanelForGrid.selectContextMenuOption('Show Totals');
    //  Then the grid cell in visualization "Normal" at "1", "3" has text " "
        await since('The grid cell at row 1, column 3 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Normal').getText())
            .toBe(' ');
    //  When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
    //  And I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
    //  And I expand "Layout" section
        await newFormatPanelForGrid.expandLayoutSection();
    //  And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
    //  Then the grid cell in visualization "Normal" at "1", "3" has text " "
        await since('The grid cell at row 1, column 3 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Normal').getText())
            .toBe(' ');
    //  When I switch to the "Text and Form" section on new format panel
        await baseFormatPanelReact.switchSection('Text and Form');
    //  And I change cell fill color to "#FAD47F" through new format panel
        await newFormatPanelForGrid.changeCellsFillColor('#FAD47F');
        await newFormatPanelForGrid.click({ elem: newFormatPanelForGrid.cellFillColorBtn });
    //  Then the grid cell in visualization "Normal" at "1", "1" has style "background-color" with value "rgba(250, 212, 127, 1)"
        await since('The grid cell in visualization "Normal" at "1", "1" has style "background-color" with value "rgba(250, 212, 127, 1)"')
            .expect(await vizPanelForGrid.getGridCellStyleByPosition(1, 1, "Normal",'background-color'))
            .toEqual('rgba(250,212,127,1)');
    //  And the grid cell in visualization "Normal" at "1", "3" has text " "
        await since('The grid cell at row 1, column 3 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Normal').getText())
            .toBe(' ');
    //  When I right click on element at "1", "3" and select 'Show "Metrics" Label' from visualization "Normal"
        await vizPanelForGrid.selectContextMenuOptionFromElementByIndex(1, 3, 'Show "Metrics" Label', 'Normal');
    //  Then the grid cell in visualization "Normal" at "1", "3" has text "Metrics"
        await since('The grid cell at row 1, column 3 in visualization "Normal" should have text "Metrics"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Normal').getText())
            .toBe('Metrics');

    //  # Compound Grid: Enable Subtotal, enable outline mode , apply formatting, show 'Metrics' Label
    //  When I click on container "Compound" to select it 
    //  Then the grid cell in visualization "Compound" at "1", "1" has text "Region"
        await since('The grid cell at row 1, column 1 in visualization "Compound" should have text "Region"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Compound').getText())
            .toBe('Region');
    //  And the grid cell in visualization "Compound" at "1", "2" has text "Manager"
        await since('The grid cell at row 1, column 2 in visualization "Compound" should have text "Manager"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Compound').getText())
            .toBe('Manager');
    //  And the grid cell in visualization "Compound" at "1", "3" has text "Metrics"
        await since('The grid cell at row 1, column 3 in visualization "Compound" should have text "Metrics"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Compound').getText())
            .toBe('Metrics');
    //  # Hide 'Metrics' Label 
    //  When I right click on element at "1", "3" and select 'Hide "Metrics" Label' from visualization "Compound"
        await vizPanelForGrid.selectContextMenuOptionFromElementByIndex(1, 3, 'Hide "Metrics" Label', 'Compound');
    //  Then the grid cell in visualization "Compound" at "1", "3" has text " "
        await since('The grid cell at row 1, column 3 in visualization "Compound" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Compound').getText())
            .toBe(' ');
    //  When I click on container "Compound" to select it
    //  Then The container "Compound" should be selected
    //  When I click on the Element "Northeast" from visualization "Compound"
        await vizPanelForGrid.clickOnGridElement('Northeast', 'Compound');
    //  And I pause execution for 2 seconds
        await browser.pause(2000);
    //  Then I toggle the Show Totals for the visualization "Compound" through the visualization context menu
        await vizPanelForGrid.openContextMenu('Compound');
        await vizPanelForGrid.selectContextMenuOption('Show Totals');
    //  Then the grid cell in visualization "Compound" at "1", "3" has text " "
        await since('The grid cell at row 1, column 3 in visualization "Compound" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Compound').getText())
            .toBe(' ');
    //  When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
    //  And I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
    //  And I expand "Layout" section
        await newFormatPanelForGrid.expandLayoutSection();
    //  And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
    //  Then the grid cell in visualization "Compound" at "1", "3" has text " "
        await since('The grid cell at row 1, column 3 in visualization "Compound" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Compound').getText())
            .toBe(' ');
    //  When I switch to the "Text and Form" section on new format panel
        await baseFormatPanelReact.switchSection('Text and Form');
    //  And I change cell fill color to "#FAD47F" through new format panel
        await newFormatPanelForGrid.changeCellsFillColor('#FAD47F');
        await newFormatPanelForGrid.click({ elem: newFormatPanelForGrid.cellFillColorBtn });
    //  Then the grid cell in visualization "Compound" at "1", "1" has style "background-color" with value "rgba(250, 212, 127, 1)"
        await since('The grid cell in visualization "Compound" at "1", "1" has style "background-color" with value "rgba(250, 212, 127, 1)"')
            .expect(await vizPanelForGrid.getGridCellStyleByPosition(1, 1, "Compound",'background-color'))
            .toEqual('rgba(250,212,127,1)');
    //  And the grid cell in visualization "Compound" at "1", "3" has text " "
        await since('The grid cell at row 1, column 3 in visualization "Compound" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Compound').getText())
            .toBe(' ');
    //  When I right click on element at "1", "3" and select 'Show "Metrics" Label' from visualization "Compound"
        await vizPanelForGrid.selectContextMenuOptionFromElementByIndex(1, 3, 'Show "Metrics" Label', 'Compound');
    //  Then the grid cell in visualization "Compound" at "1", "3" has text "Metrics"
        await since('The grid cell at row 1, column 3 in visualization "Compound" should have text "Metrics"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Compound').getText())
            .toBe('Metrics');

    //  # AG Grid: Enable Subtotal, enable outline mode , apply formatting, show 'Metrics' Label
    //  When I click on container "AG Grid" to select it 
    //  And I toggle the Show Totals for the visualization "AG Grid" through the visualization context menu
        await vizPanelForGrid.openContextMenu('AG Grid');
        await vizPanelForGrid.selectContextMenuOption('Show Totals');
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has text "Region"
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text "Region"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'AG Grid'))
            .toBe('Region');
    //  And the grid cell in ag-grid "AG Grid" at "0", "1" has text "Manager"
        await since('The grid cell at row 0, column 1 in ag-grid "AG Grid" should have text "Manager"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'AG Grid'))
            .toBe('Manager');
    //  And the grid cell in ag-grid "AG Grid" at "0", "2" has text ""
        await since('The grid cell at row 0, column 2 in ag-grid "AG Grid" should have text ""')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 3, 'AG Grid'))
            .toBe('');
    //  And the grid cell in ag-grid "AG Grid" at "0", "3" has text "Metrics"
        await since('The grid cell at row 0, column 3 in ag-grid "AG Grid" should have text "Metrics"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 4, 'AG Grid'))
            .toBe('Metrics');
    //  When I right click on grid cell at "0", "3" and select 'Hide "Metrics" Label' from ag-grid "AG Grid"
        await agGridVisualization.openRMCMenuForCellAtPositionAndSelectFromCM(1, 4, 'AG Grid', 'Hide "Metrics" Label');
    //  Then the grid cell in ag-grid "AG Grid" at "0", "3" has text ""
        await since('The grid cell at row 0, column 3 in ag-grid "AG Grid" should have text ""')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 4, 'AG Grid'))
            .toBe('');
    //  When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
    //  And I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
    //  And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.expandLayoutSection();
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has text "Region"
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text "Region"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'AG Grid'))
            .toBe('Region');
    //  When I switch to the "Text and Form" section on new format panel
        await baseFormatPanelReact.switchSection('Text and Form');
    //  And I change cell fill color to "#FAD47F" through new format panel
        await newFormatPanelForGrid.changeCellsFillColor('#FAD47F');
        await newFormatPanelForGrid.click({ elem: newFormatPanelForGrid.cellFillColorBtn });
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has style "background-color" with value "rgba(250, 212, 127, 1)"
        await since('The grid cell in ag-grid "AG Grid" at "0", "0" has style "background-color" with value "rgba(250, 212, 127, 1)"')
            .expect(await agGridVisualization.getGridCellStyleByPos(0, 0, 'background-color'))
            .toEqual('rgba(250,212,127,1)');
    //  And  the grid cell in ag-grid "AG Grid" at "0", "0" has text "Region"
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text "Region"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'AG Grid'))
            .toBe('Region');
    //  # Disable outline 
    //  When I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
    //  And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has text "Region"
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text "Region"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'AG Grid'))
            .toBe('Region');
    //  And the grid cell in ag-grid "AG Grid" at "0", "1" has text "Manager"
        await since('The grid cell at row 0, column 1 in ag-grid "AG Grid" should have text "Manager"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'AG Grid'))
            .toBe('Manager');
    //  And the grid cell in ag-grid "AG Grid" at "0", "2" has text ""
        await since('The grid cell at row 0, column 2 in ag-grid "AG Grid" should have text ""')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 3, 'AG Grid'))
            .toBe('');
    //  And the grid cell in ag-grid "AG Grid" at "0", "3" has text ""
        await since('The grid cell at row 0, column 3 in ag-grid "AG Grid" should have text ""')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 4, 'AG Grid'))
            .toBe('');
    //  When I right click on grid cell at "0", "3" and select 'Show "Metrics" Label' from ag-grid "AG Grid"
        await agGridVisualization.openRMCMenuForCellAtPositionAndSelectFromCM(1, 4, 'AG Grid', 'Show "Metrics" Label');
    //  Then the grid cell in ag-grid "AG Grid" at "0", "3" has text "Metrics"
        await since('The grid cell at row 0, column 3 in ag-grid "AG Grid" should have text "Metrics"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 4, 'AG Grid'))
            .toBe('Metrics');
    });

    it('[TC25567_12] Regression Test Case 12 - Grid with attributes and metrics in rows, "Metric Names" between attributes', async () => {
    //  When I open dossier by its ID "43EC3614674B85696C3D46BFF0DAB19F"
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.TC25567_MetricLabel.id,
            projectId: gridConstants.TC25567_MetricLabel.project.id,
        });

    //  When I switch to page "Case 12" in chapter "Chapter 1" from contents panel
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Case 12' });
    //  Then Page "Case 12" in chapter "Chapter 1" is the current page
    //  # Grid: Enable Subtotal, enable outline mode , apply formatting, show 'Metrics' Label
    //  When I click on container "Normal" to select it 
    //  Then the grid cell in visualization "Normal" at "1", "1" has text "Region"
        await since('The grid cell at row 1, column 1 in visualization "Normal" should have text "Region"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Normal').getText())
            .toBe('Region');
    //  And the grid cell in visualization "Normal" at "1", "2" has text " "
        await since('The grid cell at row 1, column 2 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Normal').getText())
            .toBe(' ');
    //  And the grid cell in visualization "Normal" at "1", "3" has text "Manager"
        await since('The grid cell at row 1, column 3 in visualization "Normal" should have text "Manager"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Normal').getText())
            .toBe('Manager');
    //  And the grid cell in visualization "Normal" at "2", "2" has text "Cost"
        await since('The grid cell at row 2, column 2 in visualization "Normal" should have text "Cost"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 2, 'Normal').getText())
            .toBe('Cost');
    //  When I toggle the Show Totals for the visualization "Normal" through the visualization context menu
        await vizPanelForGrid.openContextMenu('Normal');
        await vizPanelForGrid.selectContextMenuOption('Show Totals');
    //  Then the grid cell in visualization "Normal" at "1", "2" has text " "
        await since('The grid cell at row 1, column 2 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Normal').getText())
            .toBe(' ');
    //  When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
    //  And I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
    //  And I expand "Layout" section
        await newFormatPanelForGrid.expandLayoutSection();
    //  And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
    //  Then the grid cell in visualization "Normal" at "1", "2" has text " "
        await since('The grid cell at row 1, column 2 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Normal').getText())
            .toBe(' ');
    //  When I switch to the "Text and Form" section on new format panel
        await baseFormatPanelReact.switchSection('Text and Form');
    //  And I change cell fill color to "#FAD47F" through new format panel
        await newFormatPanelForGrid.changeCellsFillColor('#FAD47F');
        await newFormatPanelForGrid.click({ elem: newFormatPanelForGrid.cellFillColorBtn });
    //  Then the grid cell in visualization "Normal" at "1", "2" has style "background-color" with value "rgba(250, 212, 127, 1)"
        await since('The grid cell in visualization "Normal" at "1", "2" has style "background-color" with value "rgba(250, 212, 127, 1)"')
            .expect(await vizPanelForGrid.getGridCellStyleByPosition(1, 2, "Normal",'background-color'))
            .toEqual('rgba(250,212,127,1)');
    //  And the grid cell in visualization "Normal" at "1", "2" has text " "
        await since('The grid cell at row 1, column 2 in visualization "Normal" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Normal').getText())
            .toBe(' ');
    //  When I right click on element at "1", "2" and select 'Show "Metrics" Label' from visualization "Normal"
        await vizPanelForGrid.selectContextMenuOptionFromElementByIndex(1, 2, 'Show "Metrics" Label', 'Normal');
    //  Then the grid cell in visualization "Normal" at "1", "2" has text "Metrics"
        await since('The grid cell at row 1, column 2 in visualization "Normal" should have text "Metrics"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Normal').getText())
            .toBe('Metrics');

    //  # Compound Grid: Enable Subtotal, enable outline mode , apply formatting, show 'Metrics' Label
    //  When I click on container "Compound" to select it 
    //  Then the grid cell in visualization "Compound" at "1", "1" has text "Region"
        await since('The grid cell at row 1, column 1 in visualization "Compound" should have text "Region"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Compound').getText())
            .toBe('Region');
    //  And the grid cell in visualization "Compound" at "1", "2" has text " "
        await since('The grid cell at row 1, column 2 in visualization "Compound" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Compound').getText())
            .toBe(' ');
    //  And the grid cell in visualization "Compound" at "1", "3" has text "Manager"
        await since('The grid cell at row 1, column 3 in visualization "Compound" should have text "Manager"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Compound').getText())
            .toBe('Manager');
    //  And the grid cell in visualization "Compound" at "2", "2" has text "Cost"
        await since('The grid cell at row 2, column 2 in visualization "Compound" should have text "Cost"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 2, 'Compound').getText())
            .toBe('Cost');
    //  When I toggle the Show Totals for the visualization "Compound" through the visualization context menu
        await vizPanelForGrid.openContextMenu('Compound');
        await vizPanelForGrid.selectContextMenuOption('Show Totals');
    //  Then the grid cell in visualization "Compound" at "1", "2" has text " "
        await since('The grid cell at row 1, column 2 in visualization "Compound" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Compound').getText())
            .toBe(' ');
    //  When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
    //  And I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
    //  And I expand "Layout" section
        await newFormatPanelForGrid.expandLayoutSection();
    //  And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
    //  Then the grid cell in visualization "Compound" at "1", "2" has text " "
        await since('The grid cell at row 1, column 2 in visualization "Compound" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Compound').getText())
            .toBe(' ');
    //  When I switch to the "Text and Form" section on new format panel
        await baseFormatPanelReact.switchSection('Text and Form');
    //  And I change cell fill color to "#FAD47F" through new format panel
        await newFormatPanelForGrid.changeCellsFillColor('#FAD47F');
        await newFormatPanelForGrid.click({ elem: newFormatPanelForGrid.cellFillColorBtn });
    //  Then the grid cell in visualization "Compound" at "1", "2" has style "background-color" with value "rgba(250, 212, 127, 1)"
        await since('The grid cell in visualization "Compound" at "1", "2" has style "background-color" with value "rgba(250, 212, 127, 1)"')
            .expect(await vizPanelForGrid.getGridCellStyleByPosition(1, 2, "Compound",'background-color'))
            .toEqual('rgba(250,212,127,1)');
    //  And the grid cell in visualization "Compound" at "1", "2" has text " "
        await since('The grid cell at row 1, column 2 in visualization "Compound" should have text " "')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Compound').getText())
            .toBe(' ');
    //  When I right click on element at "1", "2" and select 'Show "Metrics" Label' from visualization "Compound"
        await vizPanelForGrid.selectContextMenuOptionFromElementByIndex(1, 2, 'Show "Metrics" Label', 'Compound');
    //  Then the grid cell in visualization "Compound" at "1", "2" has text "Metrics"
        await since('The grid cell at row 1, column 2 in visualization "Compound" should have text "Metrics"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Compound').getText())
            .toBe('Metrics');

    //  # AG Grid: Enable Subtotal, enable outline mode , apply formatting, show 'Metrics' Label
    //  When I click on container "AG Grid" to select it 
    //  And I toggle the Show Totals for the visualization "AG Grid" through the visualization context menu
        await vizPanelForGrid.openContextMenu('AG Grid');
        await vizPanelForGrid.selectContextMenuOption('Show Totals');
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has text "Region"
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text "Region"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'AG Grid'))
            .toBe('Region');
    //  And the grid cell in ag-grid "AG Grid" at "0", "1" has text ""
        await since('The grid cell at row 0, column 1 in ag-grid "AG Grid" should have text ""')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'AG Grid'))
            .toBe('');
    //  And the grid cell in ag-grid "AG Grid" at "0", "2" has text "Manager"
        await since('The grid cell at row 0, column 2 in ag-grid "AG Grid" should have text "Manager"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 3, 'AG Grid'))
            .toBe('Manager');
    //  When I toggle the Show Totals for the visualization "AG Grid" through the visualization context menu
        await vizPanelForGrid.openContextMenu('AG Grid');
        await vizPanelForGrid.selectContextMenuOption('Show Totals');
    //  Then the grid cell in ag-grid "AG Grid" at "0", "1" has text ""
        await since('The grid cell at row 0, column 1 in ag-grid "AG Grid" should have text ""')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'AG Grid'))
            .toBe('');
    //  When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
    //  And I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
    //  And I expand "Layout" section
        await newFormatPanelForGrid.expandLayoutSection();
    //  And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has text "Region"
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text "Region"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'AG Grid'))
            .toBe('Region');
    //  When I switch to the "Text and Form" section on new format panel
        await baseFormatPanelReact.switchSection('Text and Form');
    //  And I change cell fill color to "#FAD47F" through new format panel
        await newFormatPanelForGrid.changeCellsFillColor('#FAD47F');
        await newFormatPanelForGrid.click({ elem: newFormatPanelForGrid.cellFillColorBtn });
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has style "background-color" with value "rgba(250, 212, 127, 1)"
        await since('The grid cell in ag-grid "AG Grid" at "0", "0" has style "background-color" with value "rgba(250, 212, 127, 1)"')
            .expect(await agGridVisualization.getGridCellStyleByPos(0, 0, 'background-color'))
            .toEqual('rgba(250,212,127,1)');
    //  And  the grid cell in ag-grid "AG Grid" at "0", "0" has text "Region"
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text "Region"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'AG Grid'))
            .toBe('Region');
    // # Disable outline 
    //  When I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
    //  And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
    //  Then the grid cell in ag-grid "AG Grid" at "0", "0" has text "Region"
        await since('The grid cell at row 0, column 0 in ag-grid "AG Grid" should have text "Region"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'AG Grid'))
            .toBe('Region');
    //  And the grid cell in ag-grid "AG Grid" at "0", "1" has text ""
        await since('The grid cell at row 0, column 1 in ag-grid "AG Grid" should have text ""')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'AG Grid'))
            .toBe('');
    //  And the grid cell in ag-grid "AG Grid" at "0", "2" has text "Manager"
        await since('The grid cell at row 0, column 2 in ag-grid "AG Grid" should have text "Manager"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 3, 'AG Grid'))
            .toBe('Manager');
    //  When I right click on grid cell at "0", "1" and select 'Show "Metrics" Label' from ag-grid "AG Grid"
        await agGridVisualization.openRMCMenuForCellAtPositionAndSelectFromCM(1, 2, 'AG Grid', 'Show "Metrics" Label');
    //  Then the grid cell in ag-grid "AG Grid" at "0", "1" has text "Metrics"
        await since('The grid cell at row 0, column 1 in ag-grid "AG Grid" should have text "Metrics"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'AG Grid'))
            .toBe('Metrics');
    });

});
