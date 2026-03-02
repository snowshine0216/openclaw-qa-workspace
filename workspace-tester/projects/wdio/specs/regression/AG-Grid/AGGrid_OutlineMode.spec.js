import * as gridConstants from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { FilterPanel } from '../../../pageObjects/dossierEditor/FilterPanel.js';

describe('Outline mode in AG Grid', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };
    const filterPanel = new FilterPanel();
    let {
        moreOptions,
        dossierAuthoringPage,
        libraryPage,
        baseVisualization,
        vizPanelForGrid,
        agGridVisualization,
        datasetPanel,
        loadingDialog,
        baseFormatPanel,
        baseFormatPanelReact,
        editorPanel,
        editorPanelForGrid,
        reportGridView,
        showDataDialog,
        dossierMojo,
        loginPage,
        newFormatPanelForGrid,
        baseContainer,
        thresholdEditor,
        microchartConfigDialog,
        contentsPanel,
        grid,
        dossierPage,
        reportFormatPanel,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {});

    it('[TC75412_1] Creating AG grid with value sets and microcharts | Regression', async () => {
        // Edit dossier by its ID "49735FD53342110EB5FB46B71A84043F"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Create > AGGrid_DnD_TC89029
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridDnD.project.id,
            dossierId: gridConstants.AGGridDnD.id,
        });

        // And I drag "attribute" named "Month" from dataset "retail-sample-data.xls" to dropzone "Rows"
        await vizPanelForGrid.dragDSObjectToGridDZ('Month', 'attribute', 'retail-sample-data.xls', 'Rows');
        // And I drag "attribute" named "Supplier" from dataset "retail-sample-data.xls" to dropzone "Rows" and drop it below "Month"
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Supplier',
            'attribute',
            'retail-sample-data.xls',
            'Rows',
            'below',
            'Month'
        );
        // When I add "metric" named "Cost" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');

        // # Case 1. Create Modern grid with outline mode
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I switch to microcharts tab in Format Panel
        await newFormatPanelForGrid.switchToTab('microcharts');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // And I expand "Layout" section
        await newFormatPanelForGrid.clickSectionTitle('Layout');

        // # Case 8. Enable outline mode in Modern Grid
        // When I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
        // Then the grid cell in ag-grid "Visualization 1" at "39", "0" has text "Feb"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "39", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(39, 0, 'Visualization 1'))
            .toEqual('Feb');

        // # Case 2. Collapse/expand at main and sub levels
        // When I expand the element at "39", "0" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(39, 0, 'Visualization 1'));
        // Then the grid cell in ag-grid "Visualization 1" at "39", "0" has text "Feb"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "39", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(39, 0, 'Visualization 1'))
            .toEqual('Feb');
        // And the grid cell in ag-grid "Visualization 1" at "40", "1" has text "20th Century Fox"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "40", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(40, 1, 'Visualization 1'))
            .toEqual('20th Century Fox');
        // And the grid cell in ag-grid "Visualization 1" at "40", "2" has text "$516,735"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "40", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(40, 2, 'Visualization 1'))
            .toEqual('$516,735');

        // When I collapse the element at "39", "0" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.collapseGroupCell(
            await agGridVisualization.getGridCellByPos(39, 0, 'Visualization 1')
        );
        // Then the grid cell in ag-grid "Visualization 1" at "40", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "40", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(40, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // Then the grid cell in ag-grid "Visualization 1" at "40", "2" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "40", "2" is not present')
            .expect(await agGridVisualization.getGridCellByPos(40, 2, 'Visualization 1').isExisting())
            .toBe(false);

        // # Case 13. Show data for Modern grid with outline mode
        // When I click on show data of the context menu of the grid visualization "Visualization 1"
        await vizPanelForGrid.openShowDataDiagFromViz('Visualization 1');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then An editor shows up with title "Show Data"
        await since('An editor should show up with title "Show Data" 2')
            .expect(await dossierMojo.getMojoEditorWithTitle('Show Data').isDisplayed())
            .toBe(true);
        // And It shows there are "445" rows of data in the show data dialog
        await since('It should show there are "445" rows of data in the show data dialog')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(445);
        // Then I close the show data dialog
        await showDataDialog.closeShowDataDialog();

        // When I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // # Case 9. Disable subtotals in Modern Grid with outline mode
        // When I toggle totals from editor panel
        await editorPanelForGrid.showTotal();
        // Then the grid cell in ag-grid "Visualization 1" at "1", "0" has text "Jan"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 0, 'Visualization 1'))
            .toEqual('Jan');

        // # Case 9. Enable subtotals in Modern Grid with outline mode
        // When I toggle totals from editor panel
        await editorPanelForGrid.showTotal();
        // Then the grid cell in ag-grid "Visualization 1" at "1", "1" has text "Total"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 1, 'Visualization 1'))
            .toEqual('Total');
        // Then the grid cell in ag-grid "Visualization 1" at "1", "2" has text "$165,880,424"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 2, 'Visualization 1'))
            .toEqual('$165,880,424');

        // # Case 10. Move Subtotals (Rows and Columns) in Modern Grid with outline mode
        // When I change the position of all "Total" cells to "Move to bottom" on ag-grid "Visualization 1"
        await agGridVisualization.changeSubtotalPosition('Total', 'Move to bottom', 'Visualization 1', false);
        // Then the grid cell in ag-grid "Visualization 1" at "1", "0" has text "Jan"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 0, 'Visualization 1'))
            .toEqual('Jan');
        // # total of supplier
        // And the grid cell in ag-grid "Visualization 1" at "445", "1" has text "Total"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "445", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(445, 1, 'Visualization 1'))
            .toEqual('Total');
        // And the grid cell in ag-grid "Visualization 1" at "445", "2" has text "$165,880,424"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "445", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(445, 2, 'Visualization 1'))
            .toEqual('$165,880,424');

        // # Case 8. Disable outline mode in Modern Grid
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I switch to microcharts tab in Format Panel
        await newFormatPanelForGrid.switchToTab('microcharts');
        // And I expand "Layout" section
        await newFormatPanelForGrid.clickSectionTitle('Layout');

        // When I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
        // Then the grid cell in ag-grid "Visualization 1" at "1", "1" has text "20th Century Fox"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 1, 'Visualization 1'))
            .toEqual('20th Century Fox');
    });

    it('[TC75412_2] Converting normal grid with outline mode to Modern Grid', async () => {
        // Edit dossier by its ID "49735FD53342110EB5FB46B71A84043F"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Create > AGGrid_DnD_TC89029
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridDnD.project.id,
            dossierId: gridConstants.AGGridDnD.id,
        });

        await baseContainer.changeViz('Grid', 'Visualization 1', true);
        // # Create a basic Normal Grid
        // When I add "attribute" named "Month" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Month', 'attribute', 'retail-sample-data.xls');
        // And I add "attribute" named "Supplier" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Supplier', 'attribute', 'retail-sample-data.xls');
        // And I add "metric" named "Cost" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');

        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I switch to Grid tab in Format Panel
        await newFormatPanelForGrid.switchToTab('grid');
        // And I expand "Layout" section
        await newFormatPanelForGrid.clickSectionTitle('Layout');

        // And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');

        // # Case 3. Convert from Simple grid with outline mode to Modern Grid
        // When I change visualization "Visualization 1" to "Grid (Modern)" from context menu
        await baseVisualization.changeVizType('Visualization 1', 'Grid', 'Grid (Modern)');
        // And I click on container "Visualization 1" to select it
        // # There is a defect preserving the outline mode when switching from Grid to Morden Grid
        // # The assertion would fail right now, we should get back to this once the defect is fixed.
        // # Then the grid cell in ag-grid "Visualization 1" at "1", "1" has text "Total"
        // # Then the grid cell in ag-grid "Visualization 1" at "1", "2" has text "$165,880,424"
        // # Then the grid cell in ag-grid "Visualization 1" at "39", "0" has text "Feb"
    });

    it('[TC75412_3] Converting compound grid with outline mode to Modern Grid', async () => {
        // Edit dossier by its ID "49735FD53342110EB5FB46B71A84043F"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Create > AGGrid_DnD_TC89029
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridDnD.project.id,
            dossierId: gridConstants.AGGridDnD.id,
        });

        await baseContainer.changeViz('Compound Grid', 'Visualization 1', true);

        // # Create a basic Compound Grid
        // When I add "attribute" named "Supplier" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Supplier', 'attribute', 'retail-sample-data.xls');
        // When I add "attribute" named "City" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('City', 'attribute', 'retail-sample-data.xls');
        // When I add "metric" named "Cost" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');
        // When I add "metric" named "Revenue" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Revenue', 'metric', 'retail-sample-data.xls');
        // When I add a column set for the compound grid
        await vizPanelForGrid.addColumnSet();
        // And I drag "attribute" named "Month" from dataset "retail-sample-data.xls" to Column Set "Column Set 2" in compound grid
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ(
            'Month',
            'attribute',
            'retail-sample-data.xls',
            'Column Set 2'
        );
        // When I drag "metric" named "Units Available" from dataset "retail-sample-data.xls" to dropzone "Column Set 2" and drop it below "Month"
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Units Available',
            'metric',
            'retail-sample-data.xls',
            'Column Set 2',
            'below',
            'Month'
        );
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I switch to Grid tab in Format Panel
        await newFormatPanelForGrid.switchToTab('grid');
        // And I expand "Layout" section
        await newFormatPanelForGrid.clickSectionTitle('Layout');
        // And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
        // # Case 4. Convert from Compound Grid with outline mode to Modern Grid
        // When I change visualization "Visualization 1" to "Grid (Modern)" from context menu
        await baseVisualization.changeVizType('Visualization 1', 'Grid', 'Grid (Modern)');
        // And I click on container "Visualization 1" to select it

        // # There is a defect preserving the outline mode when switching from Grid to Morden Grid
        // # The assertion would fail right now, we should get back to this once the defect is fixed.
        // # Then the grid cell in ag-grid "Visualization 1" at "1", "1" has text "Total"
        // # Then the grid cell in ag-grid "Visualization 1" at "1", "2" has text "$165,880,424"
        // # Then the grid cell in ag-grid "Visualization 1" at "39", "0" has text "Feb"
    });

    it('[TC75412_4] Convert from Modern Grid with outline mode to Simple Grid', async () => {
        // Edit dossier by its ID "49735FD53342110EB5FB46B71A84043F"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Create > AGGrid_DnD_TC89029
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridDnD.project.id,
            dossierId: gridConstants.AGGridDnD.id,
        });
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I drag "attribute" named "Month" from dataset "retail-sample-data.xls" to dropzone "Rows"
        await vizPanelForGrid.dragDSObjectToGridDZ('Month', 'attribute', 'retail-sample-data.xls', 'Rows');
        // And I drag "attribute" named "Supplier" from dataset "retail-sample-data.xls" to dropzone "Rows" and drop it below "Month"
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Supplier',
            'attribute',
            'retail-sample-data.xls',
            'Rows',
            'below',
            'Month'
        );
        // When I add "metric" named "Cost" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I switch to microcharts tab in Format Panel
        await newFormatPanelForGrid.switchToTab('microcharts');
        // And I expand "Layout" section
        await newFormatPanelForGrid.clickSectionTitle('Layout');
        // And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');

        // # Case 5. Convert from Modern Grid with outline mode to Simple Grid
        // When I change visualization "Visualization 1" to "Grid" from context menu
        await baseContainer.changeViz('Grid', 'Visualization 1', true);
        // And I click on container "Visualization 1" to select it
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // Then The editor panel should have "attribute" named "Month" on "Rows" section
        await since('The editor panel should have "attribute" named "Month" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Month', 'attribute', 'Rows').isExisting())
            .toBe(true);
        // And The editor panel should have "attribute" named "Supplier" on "Rows" section
        await since('The editor panel should have "attribute" named "Supplier" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Supplier', 'attribute', 'Rows').isExisting())
            .toBe(true);
        // And The editor panel should have "metric" named "Cost" on "Metrics" section
        await since('The editor panel should have "metric" named "Cost" on "Metrics" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Cost', 'metric', 'Metrics').isExisting())
            .toBe(true);
    });

    it('[TC75412_5] Convert from Modern Grid with outline mode to Compound Grid', async () => {
        // Edit dossier by its ID "49735FD53342110EB5FB46B71A84043F"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Create > AGGrid_DnD_TC89029
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridDnD.project.id,
            dossierId: gridConstants.AGGridDnD.id,
        });
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I drag "attribute" named "Month" from dataset "retail-sample-data.xls" to dropzone "Rows"
        await vizPanelForGrid.dragDSObjectToGridDZ('Month', 'attribute', 'retail-sample-data.xls', 'Rows');
        // And I drag "attribute" named "Supplier" from dataset "retail-sample-data.xls" to dropzone "Rows" and drop it below "Month"
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Supplier',
            'attribute',
            'retail-sample-data.xls',
            'Rows',
            'below',
            'Month'
        );
        // When I add "metric" named "Cost" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');

        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I switch to microcharts tab in Format Panel
        await newFormatPanelForGrid.switchToTab('microcharts');
        // And I expand "Layout" section
        await newFormatPanelForGrid.clickSectionTitle('Layout');
        // And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');

        // # Case 6. Convert from Modern Grid with outline mode to Compound Grid
        // When I change visualization "Visualization 1" to "Compound Grid" from context menu
        await baseContainer.changeViz('Compound Grid', 'Visualization 1', true);
        // And I click on container "Visualization 1" to select it
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // Then The editor panel should have "attribute" named "Month" on "Rows" section
        await since('The editor panel should have "attribute" named "Month" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Month', 'attribute', 'Rows').isExisting())
            .toBe(true);
        // And The editor panel should have "attribute" named "Supplier" on "Rows" section
        await since('The editor panel should have "attribute" named "Supplier" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Supplier', 'attribute', 'Rows').isExisting())
            .toBe(true);
        // And The editor panel should have "metric" named "Cost" on "Columns" section
        await since('The editor panel should have "metric" named "Cost" on "Columns" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Cost', 'metric', 'Columns').isExisting())
            .toBe(true);
    });

    it('[TC75412_6] Convert from Modern Grid with outline mode to bar chart', async () => {
        // Edit dossier by its ID "49735FD53342110EB5FB46B71A84043F"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Create > AGGrid_DnD_TC89029
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridDnD.project.id,
            dossierId: gridConstants.AGGridDnD.id,
        });
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I drag "attribute" named "Month" from dataset "retail-sample-data.xls" to dropzone "Rows"
        await vizPanelForGrid.dragDSObjectToGridDZ('Month', 'attribute', 'retail-sample-data.xls', 'Rows');
        // And I drag "attribute" named "Supplier" from dataset "retail-sample-data.xls" to dropzone "Rows" and drop it below "Month"
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Supplier',
            'attribute',
            'retail-sample-data.xls',
            'Rows',
            'below',
            'Month'
        );
        // When I add "metric" named "Cost" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');

        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I switch to microcharts tab in Format Panel
        await newFormatPanelForGrid.switchToTab('microcharts');
        // And I expand "Layout" section
        await newFormatPanelForGrid.clickSectionTitle('Layout');
        // And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');

        // # Case 7. Convert from Modern Grid with outline mode to other Visualization types (graphs etc.)
        // When I change visualization "Visualization 1" to "Vertical Bar Chart" from context menu
        await baseContainer.changeViz('Vertical Bar Chart', 'Visualization 1', true);
        // And I click on container "Visualization 1" to select it
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // Then The editor panel should have "attribute" named "Month" on "Horizontal" section
        await since('The editor panel should have "attribute" named "Month" on "Horizontal" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Month', 'attribute', 'Horizontal').isExisting())
            .toBe(true);
        // And The editor panel should have "attribute" named "Supplier" on "Horizontal" section
        await since('The editor panel should have "attribute" named "Supplier" on "Horizontal" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Supplier', 'attribute', 'Horizontal').isExisting())
            .toBe(true);
        // And The editor panel should have "metric" named "Cost" on "Vertical" section
        await since('The editor panel should have "metric" named "Cost" on "Vertical" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Cost', 'metric', 'Vertical').isExisting())
            .toBe(true);
    });

    it('[TC75412_7] Multiple attribute forms in Modern Grid with outline mode', async () => {
        // Edit dossier by its ID "49735FD53342110EB5FB46B71A84043F"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Create > AGGrid_DnD_TC89029
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridDnD.project.id,
            dossierId: gridConstants.AGGridDnD.id,
        });
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I drag "attribute" named "City" from dataset "retail-sample-data.xls" to dropzone "Rows"
        await vizPanelForGrid.dragDSObjectToGridDZ('City', 'attribute', 'retail-sample-data.xls', 'Rows');
        // And I drag "attribute" named "Month" from dataset "retail-sample-data.xls" to dropzone "Rows" and drop it below "City"
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Month',
            'attribute',
            'retail-sample-data.xls',
            'Rows',
            'below',
            'City'
        );
        // When I add "metric" named "Cost" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');

        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I switch to microcharts tab in Format Panel
        await newFormatPanelForGrid.switchToTab('microcharts');
        // And I expand "Layout" section
        await newFormatPanelForGrid.clickSectionTitle('Layout');
        // And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
        // # Case 11. Enable/disable attribute forms in Rows and Column Sets for Modern Grid with outline mode
        // When I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // When I multiselect display forms "Latitude,Longitude" for object "City" in dropzone "Rows"
        await editorPanelForGrid.multiSelectDisplayFormsFromDropZone('Latitude,Longitude', 'City', 'Rows');
        // Then the grid cell in ag-grid "Visualization 1" at "2", "0" has text "Annapolis 38.9785 -76.4922"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1'))
            .toEqual('Annapolis 38.9785 -76.4922');
    });

    it('[TC75412_8] Modern Grid with outline mode in authoring mode', async () => {
        // Edit dossier by its ID "49735FD53342110EB5FB46B71A84043F"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Create > AGGrid_DnD_TC89029
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridDnD.project.id,
            dossierId: gridConstants.AGGridDnD.id,
        });
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I drag "attribute" named "Month" from dataset "retail-sample-data.xls" to dropzone "Rows"
        await vizPanelForGrid.dragDSObjectToGridDZ('Month', 'attribute', 'retail-sample-data.xls', 'Rows');
        // And I drag "attribute" named "Supplier" from dataset "retail-sample-data.xls" to dropzone "Rows" and drop it below "Month"
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Supplier',
            'attribute',
            'retail-sample-data.xls',
            'Rows',
            'below',
            'Month'
        );
        // When I add "metric" named "Cost" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I switch to microcharts tab in Format Panel
        await newFormatPanelForGrid.switchToTab('microcharts');
        // And I expand "Layout" section
        await newFormatPanelForGrid.clickSectionTitle('Layout');
        // And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
        // // When I select "Presentation Mode" from toolbar
        // await dossierAuthoringPage.actionOnToolbar('Presentation Mode');
        // # Case 15. Collapse/expand in presentation mode
        // When I expand the element at "39", "0" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(39, 0, 'Visualization 1'));
        // Then the grid cell in ag-grid "Visualization 1" at "39", "0" has text "Feb"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "39", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(39, 0, 'Visualization 1'))
            .toEqual('Feb');
        // And the grid cell in ag-grid "Visualization 1" at "40", "1" has text "20th Century Fox"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "40", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(40, 1, 'Visualization 1'))
            .toEqual('20th Century Fox');
        // And the grid cell in ag-grid "Visualization 1" at "40", "2" has text "$516,735"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "40", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(40, 2, 'Visualization 1'))
            .toEqual('$516,735');
        // When I collapse the element at "39", "0" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.collapseGroupCell(
            await agGridVisualization.getGridCellByPos(39, 0, 'Visualization 1')
        );
        // Then the grid cell in ag-grid "Visualization 1" at "40", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "40", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(40, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // Then the grid cell in ag-grid "Visualization 1" at "40", "2" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "40", "2" is not present')
            .expect(await agGridVisualization.getGridCellByPos(40, 2, 'Visualization 1').isExisting())
            .toBe(false);
        // # Case 14. Disable subtotals in presentation mode
        // When I toggle Show Totals of metric "Cost" on ag-grid "Visualization 1"
        await agGridVisualization.toggleShowTotalsFromMetric('Cost', 'Visualization 1');
        // Then the grid cell in ag-grid "Visualization 1" at "1", "0" has text "Jan"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 0, 'Visualization 1'))
            .toEqual('Jan');
        // And the grid cell in ag-grid "Visualization 1" at "1", "2" has text ""
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 2, 'Visualization 1'))
            .toEqual('');
        // # Case 14. Enable subtotals in presentation mode
        // When I toggle Show Totals of metric "Cost" on ag-grid "Visualization 1"
        await agGridVisualization.toggleShowTotalsFromMetric('Cost', 'Visualization 1');
        // And the grid cell in ag-grid "Visualization 1" at "1", "1" has text "Total"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 1, 'Visualization 1'))
            .toEqual('Total');
        // And the grid cell in ag-grid "Visualization 1" at "1", "2" has text "$165,880,424"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 2, 'Visualization 1'))
            .toEqual('$165,880,424');
    });

    it('[TC75412_9] Modern Grid with outline mode in freeform layout', async () => {
        // Edit dossier by its ID "49735FD53342110EB5FB46B71A84043F"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Create > AGGrid_DnD_TC89029
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridDnD.project.id,
            dossierId: gridConstants.AGGridDnD.id,
        });
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I drag "attribute" named "Month" from dataset "retail-sample-data.xls" to dropzone "Rows"
        await vizPanelForGrid.dragDSObjectToGridDZ('Month', 'attribute', 'retail-sample-data.xls', 'Rows');
        // And I drag "attribute" named "Supplier" from dataset "retail-sample-data.xls" to dropzone "Rows" and drop it below "Month"
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Supplier',
            'attribute',
            'retail-sample-data.xls',
            'Rows',
            'below',
            'Month'
        );
        // When I add "metric" named "Cost" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');

        // # Case 15. Attempt steps in Freeform layout
        // When I convert to Freeform Layout from toolbar
        await dossierAuthoringPage.actionOnToolbar(
            `<b>Convert to Free-form Layout</b><br >Objects on the page can be independently positioned, sized, and layered.`
        );

        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I switch to microcharts tab in Format Panel
        await newFormatPanelForGrid.switchToTab('microcharts');
        // And I expand "Layout" section
        await newFormatPanelForGrid.clickSectionTitle('Layout');
        // When I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
        // Then the grid cell in ag-grid "Visualization 1" at "39", "0" has text "Feb"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "39", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(39, 0, 'Visualization 1'))
            .toEqual('Feb');
    });

    it('[TC75412_10] Modern Grid with outline mode in pause mode', async () => {
        // Edit dossier by its ID "49735FD53342110EB5FB46B71A84043F"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Create > AGGrid_DnD_TC89029
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridDnD.project.id,
            dossierId: gridConstants.AGGridDnD.id,
        });
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I drag "attribute" named "Month" from dataset "retail-sample-data.xls" to dropzone "Rows"
        await vizPanelForGrid.dragDSObjectToGridDZ('Month', 'attribute', 'retail-sample-data.xls', 'Rows');
        // And I drag "attribute" named "Supplier" from dataset "retail-sample-data.xls" to dropzone "Rows" and drop it below "Month"
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Supplier',
            'attribute',
            'retail-sample-data.xls',
            'Rows',
            'below',
            'Month'
        );
        // When I add "metric" named "Cost" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');

        // # Case 15. Attempt steps in Pause Mode
        // When I switch to pause mode
        await dossierAuthoringPage.actionOnToolbar('Pause Data Retrieval');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I switch to microcharts tab in Format Panel
        await newFormatPanelForGrid.switchToTab('microcharts');
        // Then The tab content is empty
        await since('The tab content is empty')
            .expect(await newFormatPanelForGrid.emptyTabContent.isDisplayed())
            .toBe(true);
    });

    it('[TC75412_11] Validate Compact Outline mode in MicroCharts grid', async () => {
        // Edit dossier by its ID "49735FD53342110EB5FB46B71A84043F"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Create > AGGrid_DnD_TC89029
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridDnD.project.id,
            dossierId: gridConstants.AGGridDnD.id,
        });
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I drag "attribute" named "Month" from dataset "retail-sample-data.xls" to dropzone "Rows"
        await vizPanelForGrid.dragDSObjectToGridDZ('Month', 'attribute', 'retail-sample-data.xls', 'Rows');
        // And I drag "attribute" named "Supplier" from dataset "retail-sample-data.xls" to dropzone "Rows" and drop it below "Month"
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Supplier',
            'attribute',
            'retail-sample-data.xls',
            'Rows',
            'below',
            'Month'
        );
        // When I add "metric" named "Cost" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // # step 2: Enable Outline
        // And I expand "Layout" section
        await newFormatPanelForGrid.clickSectionTitle('Layout');
        // And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
        // # show total + hierachy, sublevel of Supplier is hidden
        // Then the grid cell in ag-grid "Visualization 1" at "1", "1" has text "Total"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 1, 'Visualization 1'))
            .toEqual('Total');
        // And the grid cell in ag-grid "Visualization 1" at "2", "0" has text "Jan"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1'))
            .toEqual('Jan');
        // Then the grid cell in ag-grid "Visualization 1" at "3", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "3", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(3, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // And the grid cell in ag-grid "Visualization 1" at "39", "0" has text "Feb"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "39", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(39, 0, 'Visualization 1'))
            .toEqual('Feb');

        // # step 3: Expand First Column
        // When I expand the element at "2", "0" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(2, 0, 'Visualization 1'));
        // # show Supplier
        // And the grid cell in ag-grid "Visualization 1" at "3", "1" has text "20th Century Fox"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "3", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(3, 1, 'Visualization 1'))
            .toEqual('20th Century Fox');

        // # step 4: Collapse first column
        // When I collapse the element at "2", "0" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.collapseGroupCell(
            await agGridVisualization.getGridCellByPos(2, 0, 'Visualization 1')
        );
        // Then the grid cell in ag-grid "Visualization 1" at "3", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "3", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(3, 1, 'Visualization 1').isExisting())
            .toBe(false);

        // # step 5: Add new microchart
        // # TO-DO: for now grid did not persist expansion
        // When I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I add a new microchart set to the ag-grid
        await agGridVisualization.addMicrochartSet();
        // And I select the object named "Cost" from pulldown at position "1" in the microchart config dialog
        await microchartConfigDialog.selectObject(1, 'Cost');
        // And I select the object named "Item Category" from pulldown at position "2" in the microchart config dialog
        await microchartConfigDialog.selectObject(2, 'Item Category');
        // Then the object named "Cost" is selected from pulldown at position "1" in the microchart config dialog
        await since('the object named "Cost" is selected from pulldown at position "1" in the microchart config dialog')
            .expect(await microchartConfigDialog.getObjectPulldownSelection(1).getText())
            .toBe('Cost');
        // And the object named "Item Category" is selected from pulldown at position "2" in the microchart config dialog
        await since(
            'the object named "Item Category" is selected from pulldown at position "2" in the microchart config dialog'
        )
            .expect(await microchartConfigDialog.getObjectPulldownSelection(2).getText())
            .toBe('Item Category');
        // # Pause to give the automatic naming a chance to update the input field
        // When I pause execution for 1 seconds
        await browser.pause(1000);
        // Then the microchart is named "Cost Trend by Item Category" in the microchart config dialog
        await microchartConfigDialog.getNameInputFieldWithText('Cost Trend by Item Category').waitForDisplayed();
        // When I confirm the microchart config dialog
        await microchartConfigDialog.confirmDialog();
        // Then The editor panel should have microchart with type "Sparkline" named "Cost Trend by Item Category" on "Cost Trend by Item Category" section
        await since(
            'The editor panel should have microchart with type "Sparkline" named "Cost Trend by Item Category" on "Cost Trend by Item Category" section'
        )
            .expect(
                await editorPanel
                    .getObjectFromSection(
                        'Cost Trend by Item Category',
                        'mc mc-sparkline',
                        'Cost Trend by Item Category'
                    )
                    .isDisplayed()
            )
            .toBe(true);
        // # validate microchart was added
        // And the header cell "Cost Trend by Item Category" in ag-grid "Visualization 1" is present
        await since('The header cell "Cost Trend by Item Category" in ag-grid "Visualization 1" is present')
            .expect(
                await agGridVisualization
                    .getGroupHeaderCell('Cost Trend by Item Category', 'Visualization 1')
                    .isExisting()
            )
            .toBe(true);
        // # step 6: Reorder Attributes & hierachy changed
        // # easiest way to reorder
        // When I remove "attribute" named "Supplier" from the Grid Editor Panel
        await editorPanelForGrid.removeFromDropZone('Supplier', 'Attribute');
        // And I drag "attribute" named "Supplier" from dataset "retail-sample-data.xls" to dropzone "Rows" and drop it above "Month"
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Supplier',
            'attribute',
            'retail-sample-data.xls',
            'Rows',
            'above',
            'Month'
        );
        // Then the grid cell in ag-grid "Visualization 1" at "2", "1" has text "Total"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 1, 'Visualization 1'))
            .toEqual('Total');
        // And the grid cell in ag-grid "Visualization 1" at "3", "0" has text "20th Century Fox"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "3", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(3, 0, 'Visualization 1'))
            .toEqual('20th Century Fox');
        // And the grid cell in ag-grid "Visualization 1" at "4", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "4", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(4, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // And the grid cell in ag-grid "Visualization 1" at "16", "0" has text "A&E Entertainment"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "16", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(16, 0, 'Visualization 1'))
            .toEqual('A&E Entertainment');

        // #step 8: Enable/Disable subtotals
        // When I toggle totals from editor panel
        await editorPanelForGrid.showTotal();
        // Then the grid cell in ag-grid "Visualization 1" at "2", "0" has text "20th Century Fox"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1'))
            .toEqual('20th Century Fox');
        // # no totals
        // Then the grid cell in ag-grid "Visualization 1" at "2", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "2", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(2, 1, 'Visualization 1').isExisting())
            .toBe(false);

        // When I toggle totals from editor panel
        await editorPanelForGrid.showTotal();
        // Then the grid cell in ag-grid "Visualization 1" at "2", "1" has text "Total"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 1, 'Visualization 1'))
            .toEqual('Total');
        // Then the grid cell in ag-grid "Visualization 1" at "2", "2" has text "$165,880,424"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 2, 'Visualization 1'))
            .toEqual('$165,880,424');

        // # step 9: Change the subtotals
        // # remove Totals, add Average
        // When I enable subtotals "Total,Average" of "attribute" named "Supplier" in the Grid Editor Panel
        await editorPanelForGrid.createSubtotalsFromEditorPanel('Supplier', 'attribute', 'Total,Average');
        // Then the grid cell in ag-grid "Visualization 1" at "2", "1" has text "Average"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 1, 'Visualization 1'))
            .toEqual('Average');
        // Then the grid cell in ag-grid "Visualization 1" at "2", "2" has text "$383,982"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 2, 'Visualization 1'))
            .toEqual('$383,982');

        // # Step 10: Apply thresholds
        // # outline failure
        // Then I pause execution for 3000 seconds
        await browser.pause(3000);
        // When I right click on element "Cost" and select "Thresholds..." from ag-grid "Visualization 1"
        await agGridVisualization.openMenuItem('Cost', 'Add Thresholds...', 'Visualization 1');
        // And I open the color band drop down menu
        await thresholdEditor.openSimpleThresholdColorBandDropDownMenu();
        // And I select the color band "Traffic Lights" in simple threshold editor
        await thresholdEditor.selectSimpleThresholdColorBand('Traffic Lights');
        // And I save and close Simple Thresholds Editor
        await thresholdEditor.saveAndCloseSimThresholdEditor();
        // # expand supplier to show threshold for value cells (thresholds not applied on subtotals)
        // # subtotals keep gray background color
        // And the grid cell in ag-grid "Visualization 1" at "2", "2" has style "background-color" with value "rgba(248, 248, 248, 1)"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "2" has style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 2, 'background-color'))
            .toEqual('rgba(248,248,248,1)');
        // When I expand the element at "3", "0" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(3, 0, 'Visualization 1'));
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC75412_11_1',
            'Compact Outline mode 1'
        );
        // Then the grid cell in ag-grid "Visualization 1" at "4", "1" has text "Jan"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "4", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(4, 1, 'Visualization 1'))
            .toEqual('Jan');
        // And the grid cell in ag-grid "Visualization 1" at "4", "2" has text "$398,708"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "4", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(4, 2, 'Visualization 1'))
            .toEqual('$398,708');
        // # yellow
        // And the grid cell in ag-grid "Visualization 1" at "4", "2" has style "background-color" with value "rgba(246, 219, 127, 1)"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "4", "2" has style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 2, 'background-color'))
            .toEqual('rgba(246,219,127,1)');
        // And the grid cell in ag-grid "Visualization 1" at "5", "1" has text "Feb"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "5", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(5, 1, 'Visualization 1'))
            .toEqual('Feb');
        // And the grid cell in ag-grid "Visualization 1" at "5", "2" has text "$516,735"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "5", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(5, 2, 'Visualization 1'))
            .toEqual('$516,735');
        // # green
        // And the grid cell in ag-grid "Visualization 1" at "5", "2" has style "background-color" with value "rgba(132, 200, 123, 1)"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "5", "2" has style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(5, 2, 'background-color'))
            .toEqual('rgba(132,200,123,1)');
        // # Step 11: Enable attribute Forms
        // # add City
        // When I remove "attribute" named "Month" from the Grid Editor Panel
        await editorPanelForGrid.removeFromDropZone('Month', 'Attribute');
        // And I add "attribute" named "City" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('City', 'attribute', 'retail-sample-data.xls');
        // # add subtotals to City so that row idx is expected
        // # (Annapolis should be 1 row after 20th Century Fox instead of having same idx)
        // And I enable subtotals "Average" of "attribute" named "City" in the Grid Editor Panel
        await editorPanelForGrid.createSubtotalsFromEditorPanel('City', 'attribute', 'Average');
        // And I expand the element at "3", "0" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(3, 0, 'Visualization 1'));
        // Then the grid cell in ag-grid "Visualization 1" at "4", "1" has text "Annapolis"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "4", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(4, 1, 'Visualization 1'))
            .toEqual('Annapolis');
        // And the grid cell in ag-grid "Visualization 1" at "4", "2" has text "$564,157"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "4", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(4, 2, 'Visualization 1'))
            .toEqual('$564,157');
        // When I multiselect display forms "Latitude,Longitude" for object "City" in dropzone "Rows"
        await editorPanelForGrid.multiSelectDisplayFormsFromDropZone('Latitude,Longitude', 'City', 'Rows');
        // Then the grid cell in ag-grid "Visualization 1" at "4", "1" has text "Annapolis 38.9785 -76.4922"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "4", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(4, 1, 'Visualization 1'))
            .toEqual('Annapolis 38.9785 -76.4922');
        // # adding multiform attributes changed col idx
        // And the grid cell in ag-grid "Visualization 1" at "4", "4" has text "$564,157"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "4", "4" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(4, 4, 'Visualization 1'))
            .toEqual('$564,157');
        // # green - threshold persisted
        // And the grid cell in ag-grid "Visualization 1" at "4", "4" has style "background-color" with value "rgba(132, 200, 123, 1)"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "4", "4" has style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 4, 'background-color'))
            .toEqual('rgba(132,200,123,1)');

        // # Step 12: Add Value set
        // When I add a new column set to the ag-grid
        await agGridVisualization.addColumnSet();
        // And I drag "metric" named "Cost" from dataset "retail-sample-data.xls" to Column Set "Column Set 2" in ag-grid
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ('Cost', 'metric', 'retail-sample-data.xls', 'Column Set 2');
        // # keep hierachy and need to expand Supplier again as expand/collapse state don't persist yet
        // Then the grid cell in ag-grid "Visualization 1" at "3", "0" has text "20th Century Fox (Average)"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "3", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(3, 0, 'Visualization 1'))
            .toEqual('20th Century Fox (Average)');
        // When I expand the element at "3", "0" in outline mode from ag-grid "Visualization 1"
        // await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(3, 0, 'Visualization 1'));
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC75412_11',
            'Compact Outline mode'
        );
        // Then the grid cell in ag-grid "Visualization 1" at "4", "1" has text "Annapolis 38.9785 -76.4922"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "4", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(4, 1, 'Visualization 1'))
            .toEqual('Annapolis 38.9785 -76.4922');
        // And the grid cell in ag-grid "Visualization 1" at "4", "4" has text "$564,157"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "4", "4" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(4, 4, 'Visualization 1'))
            .toEqual('$564,157');
        // # green - threshold persisted
        // And the grid cell in ag-grid "Visualization 1" at "4", "4" has style "background-color" with value "rgba(132, 200, 123, 1)"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "4", "4" has style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 4, 'background-color'))
            .toEqual('rgba(132,200,123,1)');
        // # new column set should be default background color
        // # col 27 bc of microchart in between col sets
        // And the grid cell in ag-grid "Visualization 1" at "4", "29" has text "$564,157"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "4", "29" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(4, 29, 'Visualization 1'))
            .toEqual('$564,157');
        // And the grid cell in ag-grid "Visualization 1" at "4", "29" has style "background-color" with value "rgba(255, 255, 255, 1)"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "4", "29" has style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 29, 'background-color'))
            .toEqual('rgba(255,255,255,1)');

        // # Step 13: Sort the grid on attribute
        // When I sort the "attribute" named "Supplier" in "Sort Descending" in Editor Panel
        await editorPanelForGrid.simpleSort('Supplier', 'Sort Descending');
        // Then the grid cell in ag-grid "Visualization 1" at "3", "0" has text "WEA (Average)"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "3", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(3, 0, 'Visualization 1'))
            .toEqual('WEA (Average)');
        // When I expand the element at "3", "0" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(3, 0, 'Visualization 1'));
        // Then the grid cell in ag-grid "Visualization 1" at "4", "1" has text "Annapolis 38.9785 -76.4922"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "4", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(4, 1, 'Visualization 1'))
            .toEqual('Annapolis 38.9785 -76.4922');
        // And the grid cell in ag-grid "Visualization 1" at "4", "4" has text "$486,680"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "4", "4" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(4, 4, 'Visualization 1'))
            .toEqual('$486,680');
    });

    it('[TC75412_12] Validate Compact Outline Mode Expand All/Collapse All', async () => {
        // Edit dossier by its ID "49735FD53342110EB5FB46B71A84043F"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Create > AGGrid_DnD_TC89029
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridDnD.project.id,
            dossierId: gridConstants.AGGridDnD.id,
        });
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I add "attribute" named "Month" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Month', 'attribute', 'retail-sample-data.xls');
        // And I add "attribute" named "Supplier" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Supplier', 'attribute', 'retail-sample-data.xls');
        // And I add "attribute" named "Item Category" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Item Category', 'attribute', 'retail-sample-data.xls');
        // And I add "metric" named "Cost" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');

        // # Add filter so expand all/collapse all is easily seen
        // And I right click on "attribute" named "Supplier" from dataset "retail-sample-data.xls" and select "Add to Filter"
        await datasetPanel.actionOnObjectFromDataset(
            'Supplier',
            'attribute',
            'retail-sample-data.xls',
            'Add to Filter'
        );
        // And I define Dynamic Selection for the selector "Supplier" to be "First N Elements" and have quantity 1
        await filterPanel.toggleSelectorMenu('Supplier');
        await filterPanel.openDynamicSelectionMenu();
        await filterPanel.configDynamicSelection('First N Elements', 1);

        // # step 2
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // # step 3: Enable Outline
        // And I expand "Layout" section
        await newFormatPanelForGrid.clickSectionTitle('Layout');
        // And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
        // Then the grid cell in ag-grid "Visualization 1" at "1", "2" has text "Total"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 2, 'Visualization 1'))
            .toEqual('Total');
        // And the grid cell in ag-grid "Visualization 1" at "2", "0" has text "Jan"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1'))
            .toEqual('Jan');
        // And the grid cell in ag-grid "Visualization 1" at "3", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "3", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(3, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // And the grid cell in ag-grid "Visualization 1" at "9", "0" has text "Feb"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "9", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(9, 0, 'Visualization 1'))
            .toEqual('Feb');

        // # Expand all
        // When I expand the element at "0", "0" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(0, 0, 'Visualization 1'));
        // Then the element at "0", "0" in outline mode from ag-grid "Visualization 1" should have "expanded" icon
        await since(
            'The element at "0", "0" in outline mode from ag-grid "Visualization 1" should have "expanded" icon'
        )
            .expect(await agGridVisualization.getGridCellExpandIconByPos(3, 1, 'Visualization 1'))
            .toBe(true);
        // # Jan
        // And the grid cell in ag-grid "Visualization 1" at "3", "1" has text "20th Century Fox"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "3", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(3, 1, 'Visualization 1'))
            .toEqual('20th Century Fox');
        // And the grid cell in ag-grid "Visualization 1" at "4", "2" has text "Action Movies"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "4", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(4, 2, 'Visualization 1'))
            .toEqual('Action Movies');
        // # Feb
        // And the grid cell in ag-grid "Visualization 1" at "10", "1" has text "20th Century Fox"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "10", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(10, 1, 'Visualization 1'))
            .toEqual('20th Century Fox');
        // And the grid cell in ag-grid "Visualization 1" at "11", "2" has text "Action Movies"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "11", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(11, 2, 'Visualization 1'))
            .toEqual('Action Movies');
        // # March
        // And the grid cell in ag-grid "Visualization 1" at "17", "1" has text "20th Century Fox"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "17", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(17, 1, 'Visualization 1'))
            .toEqual('20th Century Fox');
        // And the grid cell in ag-grid "Visualization 1" at "11", "2" has text "Action Movies"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "11", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(11, 2, 'Visualization 1'))
            .toEqual('Action Movies');
        // # Dec
        // When I scroll ag-grid "Visualization 1" down to the "bottom"
        await agGridVisualization.scrollVerticallyToBottom('Visualization 1');
        await browser.pause(5000);
        // Then the grid cell in ag-grid "Visualization 1" at "81", "2" has text "Action Movies"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "81", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(81, 2, 'Visualization 1'))
            .toEqual('Action Movies');
        // And the grid cell in ag-grid "Visualization 1" at "80", "1" has text "20th Century Fox"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "80", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(80, 1, 'Visualization 1'))
            .toEqual('20th Century Fox');

        //  # step 6: collapse all
        // When I collapse the element at "0", "0" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.collapseGroupCell(
            await agGridVisualization.getGridCellByPos(0, 0, 'Visualization 1')
        );
        // Then the element at "0", "0" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon
        await since(
            'The element at "0", "0" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon'
        )
            .expect(await agGridVisualization.getGridCellCollapseIconByPos(0, 0, 'Visualization 1'))
            .toBe(true);
        // # Supplier should be hidden
        // And the grid cell in ag-grid "Visualization 1" at "0", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "0", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(0, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // # Jan
        // And the grid cell in ag-grid "Visualization 1" at "3", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "3", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(3, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // And the grid cell in ag-grid "Visualization 1" at "4", "2" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "4", "2" is not present')
            .expect(await agGridVisualization.getGridCellByPos(4, 2, 'Visualization 1').isExisting())
            .toBe(false);
        // # Feb
        // And the grid cell in ag-grid "Visualization 1" at "10", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "10", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(10, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // # March
        // And the grid cell in ag-grid "Visualization 1" at "17", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "17", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(17, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // # Dec
        // When I scroll ag-grid "Visualization 1" down to the "bottom"
        await agGridVisualization.scrollVerticallyToBottom('Visualization 1');
        // Then the grid cell in ag-grid "Visualization 1" at "80", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "80", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(80, 1, 'Visualization 1').isExisting())
            .toBe(false);
    });

    it('[TC75412_13] Compact Outline mode (Other steps not covered by TC75411/regression above -- expand/collapse state dont persist yet', async () => {
        // Edit dossier by its ID "49735FD53342110EB5FB46B71A84043F"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Create > AGGrid_DnD_TC89029
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridDnD.project.id,
            dossierId: gridConstants.AGGridDnD.id,
        });
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I add "attribute" named "Month" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Month', 'attribute', 'retail-sample-data.xls');
        // And I add "attribute" named "Supplier" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Supplier', 'attribute', 'retail-sample-data.xls');
        // And I add "metric" named "Cost" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');

        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // # step 3: Enable Outline
        // And I expand "Layout" section
        await newFormatPanelForGrid.clickSectionTitle('Layout');
        // And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
        // Then the grid cell in ag-grid "Visualization 1" at "1", "1" has text "Total"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 1, 'Visualization 1'))
            .toEqual('Total');
        // And the grid cell in ag-grid "Visualization 1" at "2", "0" has text "Jan"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1'))
            .toEqual('Jan');
        // And the grid cell in ag-grid "Visualization 1" at "3", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "3", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(3, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // And the grid cell in ag-grid "Visualization 1" at "39", "0" has text "Feb"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "39", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(39, 0, 'Visualization 1'))
            .toEqual('Feb');
        // And the grid cell in ag-grid "Visualization 1" at "1", "2" has text "$165,880,424"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 2, 'Visualization 1'))
            .toEqual('$165,880,424');

        // # Step 14: Remove objects -- outline mode should be disabled
        // When I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I remove "attribute" named "Supplier" from the Grid Editor Panel
        await editorPanelForGrid.removeFromDropZone('Supplier', 'Attribute');
        // And the element at "2", "0" in outline mode from ag-grid "Visualization 1" should not have "collapsed" icon
        await since(
            'The element at "2", "0" in outline mode from ag-grid "Visualization 1" should not have "collapsed" icon'
        )
            .expect(await agGridVisualization.getGridCellCollapseIconByPos(2, 0, 'Visualization 1'))
            .toBe(false);

        // # Step 14: Add object back -- should be enabled again
        // And I add "attribute" named "Supplier" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Supplier', 'attribute', 'retail-sample-data.xls');
        // And the element at "2", "0" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon
        await since(
            'The element at "2", "0" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon'
        )
            .expect(await agGridVisualization.getGridCellCollapseIconByPos(2, 0, 'Visualization 1'))
            .toBe(true);

        // # Step 14: Add value set
        // When I add a new column set to the ag-grid
        await agGridVisualization.addColumnSet();
        // And I add "metric" named "Revenue" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Revenue', 'metric', 'retail-sample-data.xls');
        // Then the grid cell in ag-grid "Visualization 1" at "0", "3" has text "Revenue"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "0", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(0, 3, 'Visualization 1'))
            .toEqual('Revenue');
        // Then the grid cell in ag-grid "Visualization 1" at "1", "3" has text "$246,389,148"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 3, 'Visualization 1'))
            .toEqual('$246,389,148');

        // # change fill color of CS 2 only
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I switch to the "Text and Form" section on new format panel
        await baseFormatPanelReact.switchSection('Text and Form');
        // Then The segment control dropdown should be "Entire Grid" in new format panel
        // Then The segment control dropdown should be "Entire Grid" in new format panel
        await since('Segment control dropdown should be Entire Grid')
            .expect(await baseFormatPanelReact.getSegmentControlDropDownByCurrentSelection('Entire Grid'))
            .toBeTruthy();
        // # Replace these two steps due to DE317440 Subtotal Values not exposed for column set in this case. Need change back once defect is fixed
        // # When I change the segment dropdown from "Entire Grid" to "Column Set 2" through the new format panel
        // # And I change the segment dropdown from "All" to "Subtotal Values" through the new format panel
        // And I change the segment dropdown from "Entire Grid" to "Subtotal Values" through the new format panel
        await baseFormatPanelReact.changeSegmentControl('Entire Grid', 'Subtotal Values');
        // And I change cell fill color to "#FAD47F" through new format panel
        await newFormatPanelForGrid.changeCellsFillColor('#FAD47F');
        // Then the cells fill color is "rgba(250, 212, 127, 1)" in the new format panel
        await since('The cells fill color is "rgba(250,212,127,1)" in the new format panel, while we get "#{actual}"')
            .expect((await newFormatPanelForGrid.fillColor.getCSSProperty('background-color')).value)
            .toContain('rgba(250,212,127,1)');
        // # Grand total
        // And the grid cell in ag-grid "Visualization 1" at "1", "3" has style "background-color" with value "rgba(250, 212, 127, 1)"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "3" has style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellStyleByPos(1, 3, 'background-color'))
            .toEqual('rgba(250,212,127,1)');
        // # Feb subtotal
        // And the grid cell in ag-grid "Visualization 1" at "39", "3" has style "background-color" with value "rgba(250, 212, 127, 1)"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "39", "3" has style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellStyleByPos(39, 3, 'background-color'))
            .toEqual('rgba(250,212,127,1)');
        // # Cost subtotals stay the same
        // # Replace this step due to DE317440. Need change back once defect is fixed
        // # And the grid cell in ag-grid "Visualization 1" at "1", "2" has style "background-color" with value "rgba(248, 248, 248, 1)"
        // And the grid cell in ag-grid "Visualization 1" at "1", "2" has style "background-color" with value "rgba(250, 212, 127, 1)"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "2" has style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellStyleByPos(1, 2, 'background-color'))
            .toEqual('rgba(250,212,127,1)');

        // # Step 14: Delete value set
        // When I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I delete the Column Set named "Column Set 2" from ag-grid
        await vizPanelForGrid.deleteColumnSet('Column Set 2');
        // Then the grid cell in ag-grid "Visualization 1" at "0", "3" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "0", "3" is not present')
            .expect(await agGridVisualization.getGridCellByPos(0, 3, 'Visualization 1').isExisting())
            .toBe(false);

        // # Step 14: Create derived object
        // # Jan
        // When I expand the element at "2", "0" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(2, 0, 'Visualization 1'));
        // Then the grid cell in ag-grid "Visualization 1" at "3", "1" has text "20th Century Fox"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "3", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(3, 1, 'Visualization 1'))
            .toEqual('20th Century Fox');
        // And the grid cell in ag-grid "Visualization 1" at "4", "1" has text "A&E Entertainment"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "4", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(4, 1, 'Visualization 1'))
            .toEqual('A&E Entertainment');

        // When I select elements "20th Century Fox, A&E Entertainment" on ag-grid "Visualization 1" and select groupName ""
        await vizPanelForGrid.groupElementsHelper(
            await agGridVisualization.selectMultipleElements(
                '20th Century Fox, A&E Entertainment',
                'Visualization 1',
                false
            ),
            ''
        );
        // # selected cells are now Group 1
        // Then the grid cell in ag-grid "Visualization 1" at "3", "1" has text "Group 1"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "3", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(3, 1, 'Visualization 1'))
            .toEqual('Group 1');
        // And the grid cell in ag-grid "Visualization 1" at "4", "1" has text "ACS Innovations"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "4", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(4, 1, 'Visualization 1'))
            .toEqual('ACS Innovations');
        // # Feb
        // When I scroll ag-grid "Visualization 1" down 180 pixels
        await agGridVisualization.scrollVertically('down', 180, 'Visualization 1');
        // When I expand the element at "38", "0" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(38, 0, 'Visualization 1'));
        // Then the grid cell in ag-grid "Visualization 1" at "39", "1" has text "Group 1"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "39", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(39, 1, 'Visualization 1'))
            .toEqual('Group 1');
        // And the grid cell in ag-grid "Visualization 1" at "40", "1" has text "ACS Innovations"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "40", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(40, 1, 'Visualization 1'))
            .toEqual('ACS Innovations');

        // # Step 14: Filtering
        // When I right click on value "Feb" and select "Exclude" from ag-grid "Visualization 1"
        await agGridVisualization.openContextMenuItemForValue('Feb', 'Exclude', 'Visualization 1');
        await agGridVisualization.scrollVertically('down', 100, 'Visualization 1');
        // Then the grid cell in ag-grid "Visualization 1" at "38", "0" has text "Mar"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "38", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(38, 0, 'Visualization 1'))
            .toEqual('Mar');

        // When I right click on value "Jan" and select "Keep Only" from ag-grid "Visualization 1"
        await agGridVisualization.openContextMenuItemForValue('Jan', 'Keep Only', 'Visualization 1');
        // Then the grid cell in ag-grid "Visualization 1" at "38", "0" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "38", "0" is not present')
            .expect(await agGridVisualization.getGridCellByPos(38, 0, 'Visualization 1').isExisting())
            .toBe(false);

        // # Step 14: Duplicating
        // When I duplicate container "Visualization 1" through the context menu
        await agGridVisualization.duplicateContainer('Visualization 1');
        // #verify that no error occurs and filter and derived element was copied
        // Then The container "Visualization 1 copy" should be selected
        await since('The container "Visualization 1 copy" should be selected')
            .expect(await grid.isContainerSelected('Visualization 1 copy'))
            .toBe(true);
        // And the grid cell in ag-grid "Visualization 1" at "2", "0" has text "Jan"
        await since(
            'The grid cell in ag-grid "Visualization 1 copy" at "2", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1 copy'))
            .toEqual('Jan');
        // Then the grid cell in ag-grid "Visualization 1 copy" at "3", "1" has text "Group 1"
        await since(
            'The grid cell in ag-grid "Visualization 1 copy" at "3", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(3, 1, 'Visualization 1 copy'))
            .toEqual('Group 1');
        // And the grid cell in ag-grid "Visualization 1 copy" at "4", "1" has text "ACS Innovations"
        await since(
            'The grid cell in ag-grid "Visualization 1 copy" at "4", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(4, 1, 'Visualization 1 copy'))
            .toEqual('ACS Innovations');
    });

    it('[TC71090_01] Validate Standard Outline Mode - Acceptance', async () => {
        // Edit dossier by its ID "49735FD53342110EB5FB46B71A84043F"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Create > AGGrid_DnD_TC89029
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridDnD.project.id,
            dossierId: gridConstants.AGGridDnD.id,
        });
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I add "attribute" named "Month" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Month', 'attribute', 'retail-sample-data.xls');
        // And I add "attribute" named "Supplier" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Supplier', 'attribute', 'retail-sample-data.xls');
        // And I add "attribute" named "Item Category" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Item Category', 'attribute', 'retail-sample-data.xls');
        // And I add "metric" named "Cost" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');

        // # Add filter so expand all/collapse all is easily seen
        // And I right click on "attribute" named "Supplier" from dataset "retail-sample-data.xls" and select "Add to Filter"
        await datasetPanel.actionOnObjectFromDataset(
            'Supplier',
            'attribute',
            'retail-sample-data.xls',
            'Add to Filter'
        );
        // And I define Dynamic Selection for the selector "Supplier" to be "First N Elements" and have quantity 1
        await filterPanel.toggleSelectorMenu('Supplier');
        await filterPanel.openDynamicSelectionMenu();
        await filterPanel.configDynamicSelection('First N Elements', 1);

        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I expand "Layout" section
        await newFormatPanelForGrid.clickSectionTitle('Layout');
        // And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
        // Then the grid cell in ag-grid "Visualization 1" at "1", "2" has text "Total"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 2, 'Visualization 1'))
            .toEqual('Total');
        // And the grid cell in ag-grid "Visualization 1" at "2", "0" has text "Jan"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1'))
            .toEqual('Jan');
        // And the grid cell in ag-grid "Visualization 1" at "3", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "3", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(3, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // And the grid cell in ag-grid "Visualization 1" at "9", "0" has text "Feb"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "9", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(9, 0, 'Visualization 1'))
            .toEqual('Feb');

        // When I change the outline mode from "Compact" to "Standard" through the format panel
        await baseFormatPanelReact.changeDropdownReact('Compact', 'Standard');
        // # only first attribute should be visible
        // Then the grid cell in ag-grid "Visualization 1" at "1", "0" has text "Total"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 0, 'Visualization 1'))
            .toEqual('Total');
        // And the grid cell in ag-grid "Visualization 1" at "1", "3" has text "$6,766,511"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 3, 'Visualization 1'))
            .toEqual('$6,766,511');
        // And the grid cell in ag-grid "Visualization 1" at "2", "0" has text "Jan"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1'))
            .toEqual('Jan');
        // And the grid cell in ag-grid "Visualization 1" at "3", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "3", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(3, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // And the grid cell in ag-grid "Visualization 1" at "9", "0" has text "Feb"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "9", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(9, 0, 'Visualization 1'))
            .toEqual('Feb');

        // # step 4: expand first column header
        // When I expand the element at "0", "0" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(0, 0, 'Visualization 1'));
        // Then the element at "0", "0" in outline mode from ag-grid "Visualization 1" should have "expanded" icon
        await since(
            'The element at "0", "0" in outline mode from ag-grid "Visualization 1" should have "expanded" icon'
        )
            .expect(await agGridVisualization.getGridCellExpandIconByPos(0, 0, 'Visualization 1'))
            .toBe(true);

        // # next column is visible and has collapsed icon
        // And the grid cell in ag-grid "Visualization 1" at "0", "1" has text "Supplier"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "0", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(0, 1, 'Visualization 1'))
            .toEqual('Supplier');
        // And the element at "0", "1" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon
        await since(
            'The element at "0", "1" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon'
        )
            .expect(await agGridVisualization.getGridCellCollapseIconByPos(0, 1, 'Visualization 1'))
            .toBe(true);
        // # Jan
        // And the grid cell in ag-grid "Visualization 1" at "3", "1" has text "20th Century Fox"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "3", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(3, 1, 'Visualization 1'))
            .toEqual('20th Century Fox');
        // # Feb
        // And the grid cell in ag-grid "Visualization 1" at "10", "1" has text "20th Century Fox"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "10", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(10, 1, 'Visualization 1'))
            .toEqual('20th Century Fox');
        // # March
        // And the grid cell in ag-grid "Visualization 1" at "17", "1" has text "20th Century Fox"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "17", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(17, 1, 'Visualization 1'))
            .toEqual('20th Century Fox');
        // # Dec
        // And the grid cell in ag-grid "Visualization 1" at "80", "1" has text "20th Century Fox"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "80", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(80, 1, 'Visualization 1'))
            .toEqual('20th Century Fox');
        // # Item Category should be present
        // And the grid cell in ag-grid "Visualization 1" at "0", "2" is present
        await since('The grid cell in ag-grid "Visualization 1" at "0", "2" is present')
            .expect(await agGridVisualization.getGridCellByPos(0, 2, 'Visualization 1').isExisting())
            .toBe(true);

        // # step 5: expand the rest of column headers (Supplier)
        // When I expand the element at "0", "1" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(0, 1, 'Visualization 1'));
        // Then the element at "0", "1" in outline mode from ag-grid "Visualization 1" should have "expanded" icon
        await since(
            'The element at "0", "1" in outline mode from ag-grid "Visualization 1" should have "expanded" icon'
        )
            .expect(await agGridVisualization.getGridCellExpandIconByPos(0, 1, 'Visualization 1'))
            .toBe(true);
        // # Item Category column should be present and not have any icon (collapsed)
        // And the grid cell in ag-grid "Visualization 1" at "0", "2" has text "Item Category"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "0", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(0, 2, 'Visualization 1'))
            .toEqual('Item Category');
        // And the element at "0", "2" in outline mode from ag-grid "Visualization 1" should not have "collapsed" icon
        await since(
            'The element at "0", "2" in outline mode from ag-grid "Visualization 1" should not have "collapsed" icon'
        )
            .expect(await agGridVisualization.getGridCellCollapseIconByPos(0, 2, 'Visualization 1'))
            .toBe(false);
        // # Jan
        // And the grid cell in ag-grid "Visualization 1" at "4", "2" has text "Action Movies"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "4", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(4, 2, 'Visualization 1'))
            .toEqual('Action Movies');
        // # Feb
        // And the grid cell in ag-grid "Visualization 1" at "11", "2" has text "Action Movies"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "11", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(11, 2, 'Visualization 1'))
            .toEqual('Action Movies');
        // # March
        // And the grid cell in ag-grid "Visualization 1" at "18", "2" has text "Action Movies"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "18", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(18, 2, 'Visualization 1'))
            .toEqual('Action Movies');
        // # Dec
        // When I scroll ag-grid "Visualization 1" down to the "bottom"
        await agGridVisualization.scrollVerticallyToBottom('Visualization 1');
        // Then the grid cell in ag-grid "Visualization 1" at "81", "2" has text "Action Movies"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "81", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(81, 2, 'Visualization 1'))
            .toEqual('Action Movies');

        // # step 6: collapse all (first column header)
        // When I collapse the element at "0", "0" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.collapseGroupCell(
            await agGridVisualization.getGridCellByPos(0, 0, 'Visualization 1')
        );
        // Then the element at "0", "0" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon
        await since(
            'The element at "0", "0" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon'
        )
            .expect(await agGridVisualization.getGridCellCollapseIconByPos(0, 0, 'Visualization 1'))
            .toBe(true);
        // # Supplier should be hidden
        // And the grid cell in ag-grid "Visualization 1" at "0", "1" is present
        await since('The grid cell in ag-grid "Visualization 1" at "0", "1" is present')
            .expect(await agGridVisualization.getGridCellByPos(0, 1, 'Visualization 1').isExisting())
            .toBe(true);
        // # Jan
        // And the grid cell in ag-grid "Visualization 1" at "3", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "3", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(3, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // # Feb
        // And the grid cell in ag-grid "Visualization 1" at "10", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "10", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(10, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // # March
        // And the grid cell in ag-grid "Visualization 1" at "17", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "17", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(17, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // # Dec
        // And the grid cell in ag-grid "Visualization 1" at "80", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "80", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(80, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // # Item Category should be hidden
        // And the grid cell in ag-grid "Visualization 1" at "0", "2" is present
        await since('The grid cell in ag-grid "Visualization 1" at "0", "2" is present')
            .expect(await agGridVisualization.getGridCellByPos(0, 2, 'Visualization 1').isExisting())
            .toBe(true);

        // # step 7: expand only first row
        // When I expand the element at "2", "0" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(2, 0, 'Visualization 1'));
        // # show Supplier
        // Then the grid cell in ag-grid "Visualization 1" at "0", "1" has text "Supplier"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "0", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(0, 1, 'Visualization 1'))
            .toEqual('Supplier');
        // Then the grid cell in ag-grid "Visualization 1" at "3", "1" has text "20th Century Fox"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "3", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(3, 1, 'Visualization 1'))
            .toEqual('20th Century Fox');
        // # 20th Century for Feb is not present
        // And the grid cell in ag-grid "Visualization 1" at "10", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "10", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(10, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // # Item Category should not be present
        // And the grid cell in ag-grid "Visualization 1" at "0", "2" is present
        await since('The grid cell in ag-grid "Visualization 1" at "0", "2" is present')
            .expect(await agGridVisualization.getGridCellByPos(0, 2, 'Visualization 1').isExisting())
            .toBe(true);

        // # step 8 - sort
        // When I right click on element "Month" and select "Sort Descending" from ag-grid "Visualization 1"
        await agGridVisualization.openMenuItem('Month', 'Sort Descending', 'Visualization 1');
        // Wait for loading
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then the grid cell in ag-grid "Visualization 1" at "2", "0" has text "Dec"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1'))
            .toEqual('Dec');
        // # for now state is not persisted so supplier should be hidden (similar to step 15)
        // # Supplier should be hidden
        // And the grid cell in ag-grid "Visualization 1" at "0", "1" is present
        await since('The grid cell in ag-grid "Visualization 1" at "0", "1" is present')
            .expect(await agGridVisualization.getGridCellByPos(0, 1, 'Visualization 1').isExisting())
            .toBe(true);
        // # Dec
        // And the grid cell in ag-grid "Visualization 1" at "3", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "3", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(3, 1, 'Visualization 1').isExisting())
            .toBe(false);

        // # step 9 - move subtotal to bottom
        // When I change the position of all "Total" cells to "Move to bottom" on ag-grid "Visualization 1"
        await agGridVisualization.changeSubtotalPosition('Total', 'Move to bottom', 'Visualization 1', false);
        // Then the grid cell in ag-grid "Visualization 1" at "1", "0" has text "Dec"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 0, 'Visualization 1'))
            .toEqual('Dec');
        // And the grid cell in ag-grid "Visualization 1" at "85", "0" has text "Total"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "85", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(85, 0, 'Visualization 1'))
            .toEqual('Total');
        // And the grid cell in ag-grid "Visualization 1" at "85", "3" has text "$6,766,511"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "85", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(85, 3, 'Visualization 1'))
            .toEqual('$6,766,511');

        // # step 10 - change subtotal from "Total" to "Average
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I enable subtotals "Total,Average" of attribute "Month" on ag-grid "Visualization 1"
        await editorPanelForGrid.createSubtotalsFromEditorPanel('Month', 'attribute', 'Total,Average');
        // And the grid cell in ag-grid "Visualization 1" at "85", "0" has text "Average"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "85", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(85, 0, 'Visualization 1'))
            .toEqual('Average');
        // And the grid cell in ag-grid "Visualization 1" at "85", "3" has text "$112,775"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "85", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(85, 3, 'Visualization 1'))
            .toEqual('$112,775');

        // # step 11 - convert to compound grid (outline mode persisted)
        // When I change visualization "Visualization 1" to "Compound Grid" from context menu
        await baseContainer.changeViz('Compound Grid', 'Visualization 1', true);
        // And I click on container "Visualization 1" to select it
        await baseContainer.clickContainerByScript('Visualization 1');
        // Then The attribute "Month" should remain expanded in "Visualization 1"
        await since('The attribute "Month" should remain expanded in "Visualization 1"')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded('Month', 'Visualization 1'))
            .toBe(true);
        // And The attribute "Supplier" should remain expanded in "Visualization 1"
        await since('The attribute "Supplier" should remain expanded in "Visualization 1"')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded('Supplier', 'Visualization 1'))
            .toBe(true);
    });

    it('[TC71102_01] Validate Standard Outline Mode - Regression in Edit Mode (3 Attributes)', async () => {
        // Edit dossier by its ID "49735FD53342110EB5FB46B71A84043F"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Create > AGGrid_DnD_TC89029
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridDnD.project.id,
            dossierId: gridConstants.AGGridDnD.id,
        });
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I add "attribute" named "Month" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Month', 'attribute', 'retail-sample-data.xls');
        // And I add "attribute" named "Supplier" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Supplier', 'attribute', 'retail-sample-data.xls');
        // And I add "attribute" named "Item Category" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Item Category', 'attribute', 'retail-sample-data.xls');
        // And I add "metric" named "Cost" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');

        // # Add filter so expand all/collapse all is easily seen
        // And I right click on "attribute" named "Supplier" from dataset "retail-sample-data.xls" and select "Add to Filter"
        await datasetPanel.actionOnObjectFromDataset(
            'Supplier',
            'attribute',
            'retail-sample-data.xls',
            'Add to Filter'
        );
        // And I define Dynamic Selection for the selector "Supplier" to be "First N Elements" and have quantity 1
        // await filterPanel.resetSelectorMenuIcon('Supplier');
        await filterPanel.toggleSelectorMenu('Supplier');
        await filterPanel.openDynamicSelectionMenu();
        await filterPanel.configDynamicSelection('First N Elements', 1);
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I expand "Layout" section
        await newFormatPanelForGrid.clickSectionTitle('Layout');
        // And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
        // Then the grid cell in ag-grid "Visualization 1" at "1", "2" has text "Total"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 2, 'Visualization 1'))
            .toEqual('Total');
        // And the grid cell in ag-grid "Visualization 1" at "2", "0" has text "Jan"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1'))
            .toEqual('Jan');
        // And the grid cell in ag-grid "Visualization 1" at "3", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "3", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(3, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // And the grid cell in ag-grid "Visualization 1" at "9", "0" has text "Feb"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "9", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(9, 0, 'Visualization 1'))
            .toEqual('Feb');

        // When I change the outline mode from "Compact" to "Standard" through the format panel
        await baseFormatPanelReact.changeDropdownReact('Compact', 'Standard');
        // # only first attribute should be visible
        // Then the grid cell in ag-grid "Visualization 1" at "1", "0" has text "Total"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 0, 'Visualization 1'))
            .toEqual('Total');
        // And the grid cell in ag-grid "Visualization 1" at "1", "3" has text "$6,766,511"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 3, 'Visualization 1'))
            .toEqual('$6,766,511');
        // And the grid cell in ag-grid "Visualization 1" at "2", "0" has text "Jan"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1'))
            .toEqual('Jan');
        // And the grid cell in ag-grid "Visualization 1" at "3", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "3", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(3, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // And the grid cell in ag-grid "Visualization 1" at "9", "0" has text "Feb"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "9", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(9, 0, 'Visualization 1'))
            .toEqual('Feb');

        // # step 2: expand/collapse sub levels only (Jan and Feb)
        // When I expand the element at "2", "0" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(2, 0, 'Visualization 1'));
        // And I expand the element at "9", "0" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(9, 0, 'Visualization 1'));
        // # expand each Supplier per month
        // # Jan
        // When I expand the element at "3", "1" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(3, 1, 'Visualization 1'));
        // Then the element at "3", "1" in outline mode from ag-grid "Visualization 1" should have "expanded" icon
        await since(
            'The element at "3", "1" in outline mode from ag-grid "Visualization 1" should have "expanded" icon'
        )
            .expect(await agGridVisualization.getGridCellExpandIconByPos(3, 1, 'Visualization 1'))
            .toBe(true);
        // # next column is visible
        // And the grid cell in ag-grid "Visualization 1" at "0", "2" has text "Item Category"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "0", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(0, 2, 'Visualization 1'))
            .toEqual('Item Category');
        // And the element at "0", "2" in outline mode from ag-grid "Visualization 1" should not have "collapsed" icon
        await since(
            'The element at "0", "2" in outline mode from ag-grid "Visualization 1" should not have "collapsed" icon'
        )
            .expect(await agGridVisualization.getGridCellCollapseIconByPos(0, 2, 'Visualization 1'))
            .toBe(false);
        // And the grid cell in ag-grid "Visualization 1" at "4", "2" has text "Action Movies"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "4", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(4, 2, 'Visualization 1'))
            .toEqual('Action Movies');
        // # Supplier for Feb is not open
        // But the grid cell in ag-grid "Visualization 1" at "11", "2" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "11", "2" is not present')
            .expect(await agGridVisualization.getGridCellByPos(11, 2, 'Visualization 1').isExisting())
            .toBe(false);

        // # Feb
        // When I expand the element at "10", "1" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(10, 1, 'Visualization 1'));
        // Then the element at "10", "1" in outline mode from ag-grid "Visualization 1" should have "expanded" icon
        await since(
            'The element at "10", "1" in outline mode from ag-grid "Visualization 1" should have "expanded" icon'
        )
            .expect(await agGridVisualization.getGridCellExpandIconByPos(10, 1, 'Visualization 1'))
            .toBe(true);
        // And the grid cell in ag-grid "Visualization 1" at "11", "2" has text "Action Movies"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "11", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(11, 2, 'Visualization 1'))
            .toEqual('Action Movies');
        // # Supplier for March is not open
        // But the grid cell in ag-grid "Visualization 1" at "18", "2" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "18", "2" is not present')
            .expect(await agGridVisualization.getGridCellByPos(18, 2, 'Visualization 1').isExisting())
            .toBe(false);

        // # collapse Jan
        // When I collapse the element at "3", "1" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.collapseGroupCell(
            await agGridVisualization.getGridCellByPos(3, 1, 'Visualization 1')
        );
        // Then the element at "3", "1" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon
        await since(
            'The element at "3", "1" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon'
        )
            .expect(await agGridVisualization.getGridCellCollapseIconByPos(3, 1, 'Visualization 1'))
            .toBe(true);
        // # next column is still visible from Feb
        // And the grid cell in ag-grid "Visualization 1" at "0", "2" has text "Item Category"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "0", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(0, 2, 'Visualization 1'))
            .toEqual('Item Category');
        // And the grid cell in ag-grid "Visualization 1" at "4", "2" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "4", "2" is not present')
            .expect(await agGridVisualization.getGridCellByPos(4, 2, 'Visualization 1').isExisting())
            .toBe(false);
        // # Feb is still open
        // And the grid cell in ag-grid "Visualization 1" at "11", "2" has text "Action Movies"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "11", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(11, 2, 'Visualization 1'))
            .toEqual('Action Movies');
        // # collapse Feb
        // When I collapse the element at "10", "1" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.collapseGroupCell(
            await agGridVisualization.getGridCellByPos(10, 1, 'Visualization 1')
        );
        // And the grid cell in ag-grid "Visualization 1" at "0", "2" is present
        await since('The grid cell in ag-grid "Visualization 1" at "0", "2" is present')
            .expect(await agGridVisualization.getGridCellByPos(0, 2, 'Visualization 1').isExisting())
            .toBe(true);
        // Then the grid cell in ag-grid "Visualization 1" at "11", "2" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "11", "2" is not present')
            .expect(await agGridVisualization.getGridCellByPos(11, 2, 'Visualization 1').isExisting())
            .toBe(false);

        // # step 2 collapse/expand at main and sub levels
        // When I expand the element at "0", "0" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(0, 0, 'Visualization 1'));
        // Then the element at "0", "0" in outline mode from ag-grid "Visualization 1" should have "expanded" icon
        await since(
            'The element at "0", "0" in outline mode from ag-grid "Visualization 1" should have "expanded" icon'
        )
            .expect(await agGridVisualization.getGridCellExpandIconByPos(0, 0, 'Visualization 1'))
            .toBe(true);

        // # next column is visible and has collapsed icon
        // And the grid cell in ag-grid "Visualization 1" at "0", "1" has text "Supplier"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "0", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(0, 1, 'Visualization 1'))
            .toEqual('Supplier');
        // And the element at "0", "1" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon
        await since(
            'The element at "0", "1" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon'
        )
            .expect(await agGridVisualization.getGridCellCollapseIconByPos(0, 1, 'Visualization 1'))
            .toBe(true);
        // # Jan
        // And the grid cell in ag-grid "Visualization 1" at "3", "1" has text "20th Century Fox"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "3", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(3, 1, 'Visualization 1'))
            .toEqual('20th Century Fox');
        // # Feb
        // And the grid cell in ag-grid "Visualization 1" at "10", "1" has text "20th Century Fox"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "10", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(10, 1, 'Visualization 1'))
            .toEqual('20th Century Fox');
        // # March
        // And the grid cell in ag-grid "Visualization 1" at "17", "1" has text "20th Century Fox"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "17", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(17, 1, 'Visualization 1'))
            .toEqual('20th Century Fox');
        // # Dec
        // And the grid cell in ag-grid "Visualization 1" at "80", "1" has text "20th Century Fox"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "80", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(80, 1, 'Visualization 1'))
            .toEqual('20th Century Fox');
        // # Item Category should be present
        // And the grid cell in ag-grid "Visualization 1" at "0", "2" is present
        await since('The grid cell in ag-grid "Visualization 1" at "0", "2" is present')
            .expect(await agGridVisualization.getGridCellByPos(0, 2, 'Visualization 1').isExisting())
            .toBe(true);

        // Then the grid cell in ag-grid "Visualization 1" at "11", "2" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "11", "2" is not present')
            .expect(await agGridVisualization.getGridCellByPos(11, 2, 'Visualization 1').isExisting())
            .toBe(false);

        // # expand each Supplier per month
        // # Jan
        // When I expand the element at "3", "1" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(3, 1, 'Visualization 1'));
        // Then the element at "3", "1" in outline mode from ag-grid "Visualization 1" should have "expanded" icon
        await since(
            'The element at "3", "1" in outline mode from ag-grid "Visualization 1" should have "expanded" icon'
        )
            .expect(await agGridVisualization.getGridCellExpandIconByPos(3, 1, 'Visualization 1'))
            .toBe(true);
        // # next column is visible
        // And the grid cell in ag-grid "Visualization 1" at "0", "2" has text "Item Category"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "0", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(0, 2, 'Visualization 1'))
            .toEqual('Item Category');
        // And the element at "0", "2" in outline mode from ag-grid "Visualization 1" should not have "collapsed" icon
        await since(
            'The element at "0", "2" in outline mode from ag-grid "Visualization 1" should not have "collapsed" icon'
        )
            .expect(await agGridVisualization.getGridCellCollapseIconByPos(0, 2, 'Visualization 1'))
            .toBe(false);

        // And the grid cell in ag-grid "Visualization 1" at "4", "2" has text "Action Movies"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "4", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(4, 2, 'Visualization 1'))
            .toEqual('Action Movies');
        // # Supplier for Feb is not open
        // But the grid cell in ag-grid "Visualization 1" at "11", "2" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "11", "2" is not present')
            .expect(await agGridVisualization.getGridCellByPos(11, 2, 'Visualization 1').isExisting())
            .toBe(false);

        // # Feb
        // When I expand the element at "10", "1" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(10, 1, 'Visualization 1'));
        // Then the element at "10", "1" in outline mode from ag-grid "Visualization 1" should have "expanded" icon
        await since(
            'The element at "10", "1" in outline mode from ag-grid "Visualization 1" should have "expanded" icon'
        )
            .expect(await agGridVisualization.getGridCellExpandIconByPos(10, 1, 'Visualization 1'))
            .toBe(true);
        // And the grid cell in ag-grid "Visualization 1" at "11", "2" has text "Action Movies"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "11", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(11, 2, 'Visualization 1'))
            .toEqual('Action Movies');
        // # Supplier for March is not open
        // But the grid cell in ag-grid "Visualization 1" at "18", "2" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "18", "2" is not present')
            .expect(await agGridVisualization.getGridCellByPos(18, 2, 'Visualization 1').isExisting())
            .toBe(false);

        // # collapse Jan
        // When I collapse the element at "3", "1" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.collapseGroupCell(
            await agGridVisualization.getGridCellByPos(3, 1, 'Visualization 1')
        );
        // Then the element at "3", "1" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon
        await since(
            'The element at "3", "1" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon'
        )
            .expect(await agGridVisualization.getGridCellCollapseIconByPos(3, 1, 'Visualization 1'))
            .toBe(true);
        // # next column is still visible from Feb
        // And the grid cell in ag-grid "Visualization 1" at "0", "2" has text "Item Category"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "0", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(0, 2, 'Visualization 1'))
            .toEqual('Item Category');
        // And the grid cell in ag-grid "Visualization 1" at "4", "2" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "4", "2" is not present')
            .expect(await agGridVisualization.getGridCellByPos(4, 2, 'Visualization 1').isExisting())
            .toBe(false);
        // # Feb is still open
        // And the grid cell in ag-grid "Visualization 1" at "11", "2" has text "Action Movies"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "11", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(11, 2, 'Visualization 1'))
            .toEqual('Action Movies');

        // # collapse all Months
        // When I collapse the element at "0", "0" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.collapseGroupCell(
            await agGridVisualization.getGridCellByPos(0, 0, 'Visualization 1')
        );
        // Then the element at "0", "0" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon
        await since(
            'The element at "0", "0" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon'
        )
            .expect(await agGridVisualization.getGridCellCollapseIconByPos(0, 0, 'Visualization 1'))
            .toBe(true);
        // # Supplier is still visible
        // And the grid cell in ag-grid "Visualization 1" at "0", "1" is present
        await since('The grid cell in ag-grid "Visualization 1" at "0", "1" is present')
            .expect(await agGridVisualization.getGridCellByPos(0, 1, 'Visualization 1').isExisting())
            .toBe(true);
        // # Jan
        // And the grid cell in ag-grid "Visualization 1" at "3", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "3", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(3, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // # Feb
        // And the grid cell in ag-grid "Visualization 1" at "10", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "10", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(10, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // # March
        // And the grid cell in ag-grid "Visualization 1" at "17", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "17", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(17, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // # Dec
        // And the grid cell in ag-grid "Visualization 1" at "80", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "80", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(80, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // # Item Category is still present
        // And the grid cell in ag-grid "Visualization 1" at "0", "2" is present
        await since('The grid cell in ag-grid "Visualization 1" at "0", "2" is present')
            .expect(await agGridVisualization.getGridCellByPos(0, 2, 'Visualization 1').isExisting())
            .toBe(true);

        // # step 9: enable/disable subtotals
        // # disable subtotal
        // When I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I toggle totals from editor panel
        await editorPanelForGrid.showTotal();
        // Then the grid cell in ag-grid "Visualization 1" at "1", "0" has text "Jan"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 0, 'Visualization 1'))
            .toEqual('Jan');
        // And the grid cell in ag-grid "Visualization 1" at "1", "3" has text ""
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 3, 'Visualization 1'))
            .toEqual('');
        // # enable subtotal
        // When I toggle totals from editor panel
        await editorPanelForGrid.showTotal();
        // Then the grid cell in ag-grid "Visualization 1" at "1", "0" has text "Total"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 0, 'Visualization 1'))
            .toEqual('Total');
        // And the grid cell in ag-grid "Visualization 1" at "1", "3" has text "$6,766,511"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 3, 'Visualization 1'))
            .toEqual('$6,766,511');

        // # step 10: move row subtotals
        // When I change the position of all "Total" cells to "Move to bottom" on ag-grid "Visualization 1"
        await agGridVisualization.changeSubtotalPosition('Total', 'Move to bottom', 'Visualization 1', false);
        // Then the grid cell in ag-grid "Visualization 1" at "1", "0" has text "Jan"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 0, 'Visualization 1'))
            .toEqual('Jan');
        // And the grid cell in ag-grid "Visualization 1" at "85", "0" has text "Total"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "85", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(85, 0, 'Visualization 1'))
            .toEqual('Total');
        // And the grid cell in ag-grid "Visualization 1" at "85", "3" has text "$6,766,511"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "85", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(85, 3, 'Visualization 1'))
            .toEqual('$6,766,511');

        // When I change the position of all "Total" cells to "Move to top" on ag-grid "Visualization 1"
        await agGridVisualization.changeSubtotalPosition('Total', 'Move to top', 'Visualization 1', false);
        // Then the grid cell in ag-grid "Visualization 1" at "1", "0" has text "Total"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 0, 'Visualization 1'))
            .toEqual('Total');
        // And the grid cell in ag-grid "Visualization 1" at "1", "3" has text "$6,766,511"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 3, 'Visualization 1'))
            .toEqual('$6,766,511');
        // And the grid cell in ag-grid "Visualization 1" at "79", "0" has text "Dec"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "79", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(79, 0, 'Visualization 1'))
            .toEqual('Dec');

        // When I click on show data of the context menu of the grid visualization "Visualization 1"
        await vizPanelForGrid.openShowDataDiagFromViz('Visualization 1');
        // Then An editor shows up with title "Show Data"
        await since('An editor should show up with title "Show Data" 2')
            .expect(await dossierMojo.getMojoEditorWithTitle('Show Data').isDisplayed())
            .toBe(true);
        // And It shows there are "85" rows of data in the show data dialog
        await since('It should show there are "445" rows of data in the show data dialog')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(85);
        // Then I close the show data dialog
        await showDataDialog.closeShowDataDialog();
    });

    it('[TC71102_02] Validate Standard Outline Mode - Regression in Edit Mode (Freeform layout + 4 Attributes)', async () => {
        // Edit dossier by its ID "49735FD53342110EB5FB46B71A84043F"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Create > AGGrid_DnD_TC89029
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridDnD.project.id,
            dossierId: gridConstants.AGGridDnD.id,
        });
        // And I convert to Freeform Layout from toolbar
        await dossierAuthoringPage.actionOnToolbar(
            `<b>Convert to Free-form Layout</b><br >Objects on the page can be independently positioned, sized, and layered.`
        );
        // # step 1: Create modern grid with outline mode
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I add "attribute" named "Month" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Month', 'attribute', 'retail-sample-data.xls');
        // And I add "attribute" named "Supplier" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Supplier', 'attribute', 'retail-sample-data.xls');
        // And I add "attribute" named "Item Category" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Item Category', 'attribute', 'retail-sample-data.xls');
        // And I add "attribute" named "City" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('City', 'attribute', 'retail-sample-data.xls');
        // And I add "metric" named "Cost" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');

        // # Add filter so expand all/collapse all is easily seen
        // And I right click on "attribute" named "Supplier" from dataset "retail-sample-data.xls" and select "Add to Filter"
        await datasetPanel.actionOnObjectFromDataset(
            'Supplier',
            'attribute',
            'retail-sample-data.xls',
            'Add to Filter'
        );
        // And I define Dynamic Selection for the selector "Supplier" to be "First N Elements" and have quantity 2
        await filterPanel.toggleSelectorMenu('Supplier');
        await filterPanel.openDynamicSelectionMenu();
        await filterPanel.configDynamicSelection('First N Elements', 2);
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I expand "Layout" section
        await newFormatPanelForGrid.clickSectionTitle('Layout');
        // And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
        // Then the grid cell in ag-grid "Visualization 1" at "1", "3" has text "Total"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 3, 'Visualization 1'))
            .toEqual('Total');
        // And the grid cell in ag-grid "Visualization 1" at "2", "0" has text "Jan"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1'))
            .toEqual('Jan');
        // And the grid cell in ag-grid "Visualization 1" at "3", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "3", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(3, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // And the grid cell in ag-grid "Visualization 1" at "61", "0" has text "Feb"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "61", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(61, 0, 'Visualization 1'))
            .toEqual('Feb');

        // When I change the outline mode from "Compact" to "Standard" through the format panel
        await baseFormatPanelReact.changeDropdownReact('Compact', 'Standard');
        // # only first attribute should be visible
        // Then the grid cell in ag-grid "Visualization 1" at "1", "0" has text "Total"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 0, 'Visualization 1'))
            .toEqual('Total');
        // And the grid cell in ag-grid "Visualization 1" at "1", "4" has text "$9,207,977"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "4" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 4, 'Visualization 1'))
            .toEqual('$9,207,977');
        // And the grid cell in ag-grid "Visualization 1" at "2", "0" has text "Jan"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1'))
            .toEqual('Jan');
        // And the grid cell in ag-grid "Visualization 1" at "3", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "3", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(3, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // And the grid cell in ag-grid "Visualization 1" at "61", "0" has text "Feb"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "61", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(61, 0, 'Visualization 1'))
            .toEqual('Feb');

        // # step 2 collapse/expand at main and sub levels:
        // # test DE220462 (expand Jan -> 2 suppliers -> 1 item Category -> city, then collapse Jan should hide all child columns)
        // # expand first month only (Jan)
        // When I expand the element at "2", "0" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(2, 0, 'Visualization 1'));
        // Then the element at "2", "0" in outline mode from ag-grid "Visualization 1" should have "expanded" icon
        await since(
            'The element at "2", "0" in outline mode from ag-grid "Visualization 1" should have "expanded" icon'
        )
            .expect(await agGridVisualization.getGridCellExpandIconByPos(2, 0, 'Visualization 1'))
            .toBe(true);
        // # next column is visible and has collapsed icon
        // And the grid cell in ag-grid "Visualization 1" at "0", "1" has text "Supplier"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "0", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(0, 1, 'Visualization 1'))
            .toEqual('Supplier');
        // And the element at "0", "1" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon
        await since(
            'The element at "0", "1" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon'
        )
            .expect(await agGridVisualization.getGridCellCollapseIconByPos(0, 1, 'Visualization 1'))
            .toBe(true);
        // # Jan
        // And the grid cell in ag-grid "Visualization 1" at "3", "1" has text "20th Century Fox"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "3", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(3, 1, 'Visualization 1'))
            .toEqual('20th Century Fox');
        // And the grid cell in ag-grid "Visualization 1" at "46", "1" has text "A&E Entertainment"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "46", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(46, 1, 'Visualization 1'))
            .toEqual('A&E Entertainment');
        // # Feb
        // And the grid cell in ag-grid "Visualization 1" at "62", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "62", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(62, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // # Item Category should still be present
        // And the grid cell in ag-grid "Visualization 1" at "0", "2" is present
        await since('The grid cell in ag-grid "Visualization 1" at "0", "2" is present')
            .expect(await agGridVisualization.getGridCellByPos(0, 2, 'Visualization 1').isExisting())
            .toBe(true);

        // # expand each Supplier in Jan only
        // When I expand the element at "3", "1" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(3, 1, 'Visualization 1'));
        // Then the element at "3", "1" in outline mode from ag-grid "Visualization 1" should have "expanded" icon
        await since(
            'The element at "3", "1" in outline mode from ag-grid "Visualization 1" should have "expanded" icon'
        )
            .expect(await agGridVisualization.getGridCellExpandIconByPos(3, 1, 'Visualization 1'))
            .toBe(true);
        // # next column is visible
        // And the grid cell in ag-grid "Visualization 1" at "0", "2" has text "Item Category"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "0", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(0, 2, 'Visualization 1'))
            .toEqual('Item Category');
        // And the element at "0", "2" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon
        await since(
            'The element at "0", "2" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon'
        )
            .expect(await agGridVisualization.getGridCellCollapseIconByPos(0, 2, 'Visualization 1'))
            .toBe(true);
        // # City should still be present
        // And the grid cell in ag-grid "Visualization 1" at "0", "3" is present
        await since('The grid cell in ag-grid "Visualization 1" at "0", "3" is present')
            .expect(await agGridVisualization.getGridCellByPos(0, 3, 'Visualization 1').isExisting())
            .toBe(true);

        // And the grid cell in ag-grid "Visualization 1" at "4", "2" has text "Action Movies"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "4", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(4, 2, 'Visualization 1'))
            .toEqual('Action Movies');
        // # Supplier for Feb is not open
        // But the grid cell in ag-grid "Visualization 1" at "63", "2" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "63", "2" is not present')
            .expect(await agGridVisualization.getGridCellByPos(63, 2, 'Visualization 1').isExisting())
            .toBe(false);

        // # expand another supplier in Jan
        // When I expand the element at "46", "1" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(46, 1, 'Visualization 1'));
        // Then the element at "46", "1" in outline mode from ag-grid "Visualization 1" should have "expanded" icon
        await since(
            'The element at "46", "1" in outline mode from ag-grid "Visualization 1" should have "expanded" icon'
        )
            .expect(await agGridVisualization.getGridCellExpandIconByPos(46, 1, 'Visualization 1'))
            .toBe(true);
        // And the grid cell in ag-grid "Visualization 1" at "47", "2" has text "Special Interests"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "47", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(47, 2, 'Visualization 1'))
            .toEqual('Special Interests');
        // # Supplier for Feb is not open
        // But the grid cell in ag-grid "Visualization 1" at "108", "2" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "108", "2" is not present')
            .expect(await agGridVisualization.getGridCellByPos(108, 2, 'Visualization 1').isExisting())
            .toBe(false);

        // # expand 3rd level: City
        // # expand Action Movies
        // When I expand the element at "4", "2" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(4, 2, 'Visualization 1'));
        // Then the element at "4", "2" in outline mode from ag-grid "Visualization 1" should have "expanded" icon
        await since(
            'The element at "4", "2" in outline mode from ag-grid "Visualization 1" should have "expanded" icon'
        )
            .expect(await agGridVisualization.getGridCellExpandIconByPos(4, 2, 'Visualization 1'))
            .toBe(true);
        // # next column is visible
        // And the grid cell in ag-grid "Visualization 1" at "0", "3" has text "City"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "0", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(0, 3, 'Visualization 1'))
            .toEqual('City');
        // And the element at "0", "3" in outline mode from ag-grid "Visualization 1" should not have "collapsed" icon
        await since(
            'The element at "0", "3" in outline mode from ag-grid "Visualization 1" should not have "collapsed" icon'
        )
            .expect(await agGridVisualization.getGridCellCollapseIconByPos(0, 3, 'Visualization 1'))
            .toBe(false);
        // And the grid cell in ag-grid "Visualization 1" at "5", "3" has text "Annapolis"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "5", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(5, 3, 'Visualization 1'))
            .toEqual('Annapolis');
        // # City for Comedy Movies not opened
        // But the grid cell in ag-grid "Visualization 1" at "10", "3" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "10", "3" is not present')
            .expect(await agGridVisualization.getGridCellByPos(10, 3, 'Visualization 1').isExisting())
            .toBe(false);

        // # expand Special Interests
        // When I expand the element at "47", "2" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(47, 2, 'Visualization 1'));
        // Then the element at "47", "2" in outline mode from ag-grid "Visualization 1" should have "expanded" icon
        await since(
            'The element at "47", "2" in outline mode from ag-grid "Visualization 1" should have "expanded" icon'
        )
            .expect(await agGridVisualization.getGridCellExpandIconByPos(47, 2, 'Visualization 1'))
            .toBe(true);
        // And the grid cell in ag-grid "Visualization 1" at "48", "3" has text "Annapolis"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "48", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(48, 3, 'Visualization 1'))
            .toEqual('Annapolis');
        // # collapse Jan
        // When I collapse the element at "2", "0" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.collapseGroupCell(
            await agGridVisualization.getGridCellByPos(2, 0, 'Visualization 1')
        );
        // Then the element at "2", "0" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon
        await since(
            'The element at "2", "0" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon'
        )
            .expect(await agGridVisualization.getGridCellCollapseIconByPos(2, 0, 'Visualization 1'))
            .toBe(true);
        // # all child columns still visible
        // And the grid cell in ag-grid "Visualization 1" at "0", "1" is present
        await since('The grid cell in ag-grid "Visualization 1" at "0", "1" is present')
            .expect(await agGridVisualization.getGridCellByPos(0, 1, 'Visualization 1').isExisting())
            .toBe(true);
        // And the grid cell in ag-grid "Visualization 1" at "0", "2" is present
        await since('The grid cell in ag-grid "Visualization 1" at "0", "2" is present')
            .expect(await agGridVisualization.getGridCellByPos(0, 2, 'Visualization 1').isExisting())
            .toBe(true);
        // And the grid cell in ag-grid "Visualization 1" at "0", "3" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "0", "3" is present')
            .expect(await agGridVisualization.getGridCellByPos(0, 3, 'Visualization 1').isExisting())
            .toBe(true);
        // # Test another defect (expand Jan -> 1 supplier -> expand item Category in header, should expand all Months/Suppliers)
        // # expand first month only (Jan)
        // When I expand the element at "2", "0" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(2, 0, 'Visualization 1'));
        // Then the element at "2", "0" in outline mode from ag-grid "Visualization 1" should have "expanded" icon
        await since(
            'The element at "2", "0" in outline mode from ag-grid "Visualization 1" should have "expanded" icon'
        )
            .expect(await agGridVisualization.getGridCellExpandIconByPos(2, 0, 'Visualization 1'))
            .toBe(true);
        // # Jan
        // And the grid cell in ag-grid "Visualization 1" at "3", "1" has text "20th Century Fox"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "3", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(3, 1, 'Visualization 1'))
            .toEqual('20th Century Fox');
        // And the grid cell in ag-grid "Visualization 1" at "46", "1" has text "A&E Entertainment"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "46", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(46, 1, 'Visualization 1'))
            .toEqual('A&E Entertainment');
        // # Feb
        // And the grid cell in ag-grid "Visualization 1" at "62", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "62", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(62, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // # Item Category should still be present
        // And the grid cell in ag-grid "Visualization 1" at "0", "2" is present
        await since('The grid cell in ag-grid "Visualization 1" at "0", "2" is present')
            .expect(await agGridVisualization.getGridCellByPos(0, 2, 'Visualization 1').isExisting())
            .toBe(true);

        // # expand each Supplier in Jan only
        // When I expand the element at "3", "1" in outline mode from ag-grid "Visualization 1"
        // await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(3, 1, 'Visualization 1'));
        // Then the element at "3", "1" in outline mode from ag-grid "Visualization 1" should have "expanded" icon
        await since(
            'The element at "3", "1" in outline mode from ag-grid "Visualization 1" should have "expanded" icon'
        )
            .expect(await agGridVisualization.getGridCellExpandIconByPos(3, 1, 'Visualization 1'))
            .toBe(true);
        // # next column is visible
        // And the grid cell in ag-grid "Visualization 1" at "0", "2" has text "Item Category"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "0", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(0, 2, 'Visualization 1'))
            .toEqual('Item Category');
        // And the element at "0", "2" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon
        await since(
            'The element at "0", "2" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon'
        )
            .expect(await agGridVisualization.getGridCellCollapseIconByPos(0, 2, 'Visualization 1'))
            .toBe(true);
        // # City should be present
        // And the grid cell in ag-grid "Visualization 1" at "0", "3" is present
        await since('The grid cell in ag-grid "Visualization 1" at "0", "3" is present')
            .expect(await agGridVisualization.getGridCellByPos(0, 3, 'Visualization 1').isExisting())
            .toBe(true);

        // And the grid cell in ag-grid "Visualization 1" at "4", "2" has text "Action Movies"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "4", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(4, 2, 'Visualization 1'))
            .toEqual('Action Movies');
        // # Supplier for Feb is not open
        // But the grid cell in ag-grid "Visualization 1" at "63", "2" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "63", "2" is not present')
            .expect(await agGridVisualization.getGridCellByPos(63, 2, 'Visualization 1').isExisting())
            .toBe(false);

        // # expand ALL of Item Category in header
        // When I expand the element at "0", "2" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(0, 2, 'Visualization 1'));
        // Then the element at "0", "2" in outline mode from ag-grid "Visualization 1" should have "expanded" icon
        await since(
            'The element at "0", "2" in outline mode from ag-grid "Visualization 1" should have "expanded" icon'
        )
            .expect(await agGridVisualization.getGridCellExpandIconByPos(0, 2, 'Visualization 1'))
            .toBe(true);
        // # next column is visible
        // And the grid cell in ag-grid "Visualization 1" at "0", "3" has text "City"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "0", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(0, 3, 'Visualization 1'))
            .toEqual('City');
        // And the element at "0", "3" in outline mode from ag-grid "Visualization 1" should not have "collapsed" icon
        await since(
            'The element at "0", "3" in outline mode from ag-grid "Visualization 1" should not have "collapsed" icon'
        )
            .expect(await agGridVisualization.getGridCellCollapseIconByPos(0, 3, 'Visualization 1'))
            .toBe(false);

        // # All item category is opened as well (Action Movies, Comedy Movies, Special Interests)
        // And the grid cell in ag-grid "Visualization 1" at "5", "3" has text "Annapolis"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "5", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(5, 3, 'Visualization 1'))
            .toEqual('Annapolis');
        // And the grid cell in ag-grid "Visualization 1" at "10", "3" has text "Annapolis"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "10", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(10, 3, 'Visualization 1'))
            .toEqual('Annapolis');

        // # supplier for Feb is open
        // When I scroll ag-grid "Visualization 1" down 1000 pixels
        await agGridVisualization.scrollVertically('down', 1000, 'Visualization 1');
        await browser.pause(5000);
        // Then the grid cell in ag-grid "Visualization 1" at "62", "1" has text "20th Century Fox"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "62", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(62, 1, 'Visualization 1'))
            .toEqual('20th Century Fox');
        // # item category is open
        // And the grid cell in ag-grid "Visualization 1" at "63", "2" has text "Action Movies"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "63", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(63, 2, 'Visualization 1'))
            .toEqual('Action Movies');
        // # city is visible
        // And the grid cell in ag-grid "Visualization 1" at "64", "3" has text "Annapolis"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "64", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(64, 3, 'Visualization 1'))
            .toEqual('Annapolis');

        // # supplier for Dec is open
        // When I scroll ag-grid "Visualization 1" down to the "bottom"
        await agGridVisualization.scrollVerticallyToBottom('Visualization 1');
        await browser.pause(5000);
        // Then the grid cell in ag-grid "Visualization 1" at "774", "1" has text "A&E Entertainment"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "774", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(774, 1, 'Visualization 1'))
            .toEqual('A&E Entertainment');
        // # item category is open
        // And the grid cell in ag-grid "Visualization 1" at "775", "2" has text "Special Interests"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "775", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(775, 2, 'Visualization 1'))
            .toEqual('Special Interests');
        // # city is visible
        // And the grid cell in ag-grid "Visualization 1" at "776", "3" has text "Annapolis"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "776", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(776, 3, 'Visualization 1'))
            .toEqual('Annapolis');

        // # collapse all Months
        // When I collapse the element at "0", "0" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.collapseGroupCell(
            await agGridVisualization.getGridCellByPos(0, 0, 'Visualization 1')
        );
        // Then the element at "0", "0" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon
        // # Supplier should be hidden
        // And the grid cell in ag-grid "Visualization 1" at "0", "1" is present
        await since('The grid cell in ag-grid "Visualization 1" at "0", "1" is present')
            .expect(await agGridVisualization.getGridCellByPos(0, 1, 'Visualization 1').isExisting())
            .toBe(true);
        // # Jan
        // And the grid cell in ag-grid "Visualization 1" at "3", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "3", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(3, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // # Feb
        // And the grid cell in ag-grid "Visualization 1" at "62", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "62", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(62, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // # Dec
        // And the grid cell in ag-grid "Visualization 1" at "722", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "722", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(722, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // # all child columns header should be visible
        // And the grid cell in ag-grid "Visualization 1" at "0", "2" is present
        await since('The grid cell in ag-grid "Visualization 1" at "0", "2" is present')
            .expect(await agGridVisualization.getGridCellByPos(0, 2, 'Visualization 1').isExisting())
            .toBe(true);
        // And the grid cell in ag-grid "Visualization 1" at "0", "3" is present
        await since('The grid cell in ag-grid "Visualization 1" at "0", "3" is present')
            .expect(await agGridVisualization.getGridCellByPos(0, 3, 'Visualization 1').isExisting())
            .toBe(true);
    });

    it('[TC71102_03] Validate Standard Outline Mode - Regression in Presentation Mode', async () => {
        // Edit dossier by its ID "49735FD53342110EB5FB46B71A84043F"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Create > AGGrid_DnD_TC89029
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridDnD.project.id,
            dossierId: gridConstants.AGGridDnD.id,
        });
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I add "attribute" named "Month" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Month', 'attribute', 'retail-sample-data.xls');
        // And I add "attribute" named "Supplier" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Supplier', 'attribute', 'retail-sample-data.xls');
        // And I add "attribute" named "Item Category" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Item Category', 'attribute', 'retail-sample-data.xls');
        // And I add "metric" named "Cost" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');

        // # Add filter so expand all/collapse all is easily seen
        // And I right click on "attribute" named "Supplier" from dataset "retail-sample-data.xls" and select "Add to Filter"
        await datasetPanel.actionOnObjectFromDataset(
            'Supplier',
            'attribute',
            'retail-sample-data.xls',
            'Add to Filter'
        );
        // And I define Dynamic Selection for the selector "Supplier" to be "First N Elements" and have quantity 1
        await filterPanel.toggleSelectorMenu('Supplier');
        await filterPanel.openDynamicSelectionMenu();
        await filterPanel.configDynamicSelection('First N Elements', 1);

        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I expand "Layout" section
        await newFormatPanelForGrid.clickSectionTitle('Layout');
        // And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
        // Then the grid cell in ag-grid "Visualization 1" at "1", "2" has text "Total"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 2, 'Visualization 1'))
            .toEqual('Total');
        // And the grid cell in ag-grid "Visualization 1" at "2", "0" has text "Jan"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1'))
            .toEqual('Jan');
        // And the grid cell in ag-grid "Visualization 1" at "3", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "3", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(3, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // And the grid cell in ag-grid "Visualization 1" at "9", "0" has text "Feb"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "9", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(9, 0, 'Visualization 1'))
            .toEqual('Feb');

        // When I change the outline mode from "Compact" to "Standard" through the format panel
        await baseFormatPanelReact.changeDropdownReact('Compact', 'Standard');
        // # only first attribute should be visible
        // Then the grid cell in ag-grid "Visualization 1" at "1", "0" has text "Total"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 0, 'Visualization 1'))
            .toEqual('Total');
        // And the grid cell in ag-grid "Visualization 1" at "1", "3" has text "$6,766,511"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 3, 'Visualization 1'))
            .toEqual('$6,766,511');
        // And the grid cell in ag-grid "Visualization 1" at "2", "0" has text "Jan"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1'))
            .toEqual('Jan');
        // And the grid cell in ag-grid "Visualization 1" at "3", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "3", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(3, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // And the grid cell in ag-grid "Visualization 1" at "9", "0" has text "Feb"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "9", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(9, 0, 'Visualization 1'))
            .toEqual('Feb');

        // # switch to presentation mode
        // When I select "Presentation Mode" from toolbar

        // # step 13 collapse/expand at main and sub levels
        // When I expand the element at "0", "0" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(0, 0, 'Visualization 1'));
        // Then the element at "0", "0" in outline mode from ag-grid "Visualization 1" should have "expanded" icon
        await since(
            'The element at "0", "0" in outline mode from ag-grid "Visualization 1" should have "expanded" icon'
        )
            .expect(await agGridVisualization.getGridCellExpandIconByPos(0, 0, 'Visualization 1'))
            .toBe(true);

        // # next column is visible and has collapsed icon
        // And the grid cell in ag-grid "Visualization 1" at "0", "1" has text "Supplier"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "0", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(0, 1, 'Visualization 1'))
            .toEqual('Supplier');
        // And the element at "0", "1" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon
        await since(
            'The element at "0", "1" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon'
        )
            .expect(await agGridVisualization.getGridCellCollapseIconByPos(0, 1, 'Visualization 1'))
            .toBe(true);
        // # Jan
        // And the grid cell in ag-grid "Visualization 1" at "3", "1" has text "20th Century Fox"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "3", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(3, 1, 'Visualization 1'))
            .toEqual('20th Century Fox');
        // # Feb
        // And the grid cell in ag-grid "Visualization 1" at "10", "1" has text "20th Century Fox"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "10", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(10, 1, 'Visualization 1'))
            .toEqual('20th Century Fox');
        // # March
        // And the grid cell in ag-grid "Visualization 1" at "17", "1" has text "20th Century Fox"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "17", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(17, 1, 'Visualization 1'))
            .toEqual('20th Century Fox');
        // # Dec
        // And the grid cell in ag-grid "Visualization 1" at "80", "1" has text "20th Century Fox"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "80", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(80, 1, 'Visualization 1'))
            .toEqual('20th Century Fox');
        // # Item Category should not be present
        // And the grid cell in ag-grid "Visualization 1" at "0", "2" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "0", "2" is not present')
            .expect(await agGridVisualization.getGridCellByPos(0, 2, 'Visualization 1').isExisting())
            .toBe(true);

        // # expand each Supplier per month
        // # Jan
        // When I expand the element at "3", "1" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(3, 1, 'Visualization 1'));
        // Then the element at "3", "1" in outline mode from ag-grid "Visualization 1" should have "expanded" icon
        await since(
            'The element at "3", "1" in outline mode from ag-grid "Visualization 1" should have "expanded" icon'
        )
            .expect(await agGridVisualization.getGridCellExpandIconByPos(3, 1, 'Visualization 1'))
            .toBe(true);
        // # next column is visible
        // And the grid cell in ag-grid "Visualization 1" at "0", "2" has text "Item Category"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "0", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(0, 2, 'Visualization 1'))
            .toEqual('Item Category');
        // And the element at "0", "2" in outline mode from ag-grid "Visualization 1" should not have "collapsed" icon
        await since(
            'The element at "0", "2" in outline mode from ag-grid "Visualization 1" should not have "collapsed" icon'
        )
            .expect(await agGridVisualization.getGridCellCollapseIconByPos(0, 2, 'Visualization 1'))
            .toBe(false);

        // And the grid cell in ag-grid "Visualization 1" at "4", "2" has text "Action Movies"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "4", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(4, 2, 'Visualization 1'))
            .toEqual('Action Movies');
        // # Supplier for Feb is not open
        // But the grid cell in ag-grid "Visualization 1" at "11", "2" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "11", "2" is not present')
            .expect(await agGridVisualization.getGridCellByPos(11, 2, 'Visualization 1').isExisting())
            .toBe(false);

        // # Feb
        // When I expand the element at "10", "1" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(10, 1, 'Visualization 1'));
        // Then the element at "10", "1" in outline mode from ag-grid "Visualization 1" should have "expanded" icon
        await since(
            'The element at "10", "1" in outline mode from ag-grid "Visualization 1" should have "expanded" icon'
        )
            .expect(await agGridVisualization.getGridCellExpandIconByPos(10, 1, 'Visualization 1'))
            .toBe(true);
        // And the grid cell in ag-grid "Visualization 1" at "11", "2" has text "Action Movies"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "11", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(11, 2, 'Visualization 1'))
            .toEqual('Action Movies');
        // # Supplier for March is not open
        // But the grid cell in ag-grid "Visualization 1" at "18", "2" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "18", "2" is not present')
            .expect(await agGridVisualization.getGridCellByPos(18, 2, 'Visualization 1').isExisting())
            .toBe(false);

        // # collapse Jan
        // When I collapse the element at "3", "1" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.collapseGroupCell(
            await agGridVisualization.getGridCellByPos(3, 1, 'Visualization 1')
        );
        // Then the element at "3", "1" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon
        await since(
            'The element at "3", "1" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon'
        )
            .expect(await agGridVisualization.getGridCellCollapseIconByPos(3, 1, 'Visualization 1'))
            .toBe(true);
        // # next column is still visible from Feb
        // And the grid cell in ag-grid "Visualization 1" at "0", "2" has text "Item Category"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "0", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(0, 2, 'Visualization 1'))
            .toEqual('Item Category');
        // And the grid cell in ag-grid "Visualization 1" at "4", "2" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "4", "2" is not present')
            .expect(await agGridVisualization.getGridCellByPos(4, 2, 'Visualization 1').isExisting())
            .toBe(false);
        // # Feb is still open
        // And the grid cell in ag-grid "Visualization 1" at "11", "2" has text "Action Movies"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "11", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(11, 2, 'Visualization 1'))
            .toEqual('Action Movies');

        // # collapse all Months
        // When I collapse the element at "0", "0" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.collapseGroupCell(
            await agGridVisualization.getGridCellByPos(0, 0, 'Visualization 1')
        );
        // Then the element at "0", "0" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon
        await since(
            'The element at "0", "0" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon'
        )
            .expect(await agGridVisualization.getGridCellCollapseIconByPos(0, 0, 'Visualization 1'))
            .toBe(true);
        // # Supplier should be visible
        // And the grid cell in ag-grid "Visualization 1" at "0", "1" is present
        await since('The grid cell in ag-grid "Visualization 1" at "0", "1" is present')
            .expect(await agGridVisualization.getGridCellByPos(0, 1, 'Visualization 1').isExisting())
            .toBe(true);
        // # Jan
        // And the grid cell in ag-grid "Visualization 1" at "3", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "3", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(3, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // # Feb
        // And the grid cell in ag-grid "Visualization 1" at "10", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "10", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(10, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // # March
        // And the grid cell in ag-grid "Visualization 1" at "17", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "17", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(17, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // # Dec
        // And the grid cell in ag-grid "Visualization 1" at "80", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "80", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(80, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // # Item Category should be visible
        // And the grid cell in ag-grid "Visualization 1" at "0", "2" is present
        await since('The grid cell in ag-grid "Visualization 1" at "0", "2" is present')
            .expect(await agGridVisualization.getGridCellByPos(0, 2, 'Visualization 1').isExisting())
            .toBe(true);

        // # step 14: enable/disable subtotals
        // # disable subtotal
        // When I toggle Show Totals of metric "Cost" on ag-grid "Visualization 1"
        await agGridVisualization.toggleShowTotalsFromMetric('Cost', 'Visualization 1');
        // Then the grid cell in ag-grid "Visualization 1" at "1", "0" has text "Jan"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 0, 'Visualization 1'))
            .toEqual('Jan');
        // And the grid cell in ag-grid "Visualization 1" at "1", "3" has text ""
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 3, 'Visualization 1'))
            .toEqual('');
        // # enable subtotal
        // When I toggle Show Totals of metric "Cost" on ag-grid "Visualization 1"
        await agGridVisualization.toggleShowTotalsFromMetric('Cost', 'Visualization 1');
        // Then the grid cell in ag-grid "Visualization 1" at "1", "0" has text "Total"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 0, 'Visualization 1'))
            .toEqual('Total');
        // And the grid cell in ag-grid "Visualization 1" at "1", "3" has text "$6,766,511"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 3, 'Visualization 1'))
            .toEqual('$6,766,511');

        // # step 10: move row subtotals
        // When I change the position of all "Total" cells to "Move to bottom" on ag-grid "Visualization 1"
        await agGridVisualization.changeSubtotalPosition('Total', 'Move to bottom', 'Visualization 1', false);
        // Then the grid cell in ag-grid "Visualization 1" at "1", "0" has text "Jan"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 0, 'Visualization 1'))
            .toEqual('Jan');
        // And the grid cell in ag-grid "Visualization 1" at "85", "0" has text "Total"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "85", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(85, 0, 'Visualization 1'))
            .toEqual('Total');
        // And the grid cell in ag-grid "Visualization 1" at "85", "3" has text "$6,766,511"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "85", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(85, 3, 'Visualization 1'))
            .toEqual('$6,766,511');

        // When I change the position of all "Total" cells to "Move to top" on ag-grid "Visualization 1"
        await agGridVisualization.changeSubtotalPosition('Total', 'Move to top', 'Visualization 1', false);
        // Then the grid cell in ag-grid "Visualization 1" at "1", "0" has text "Total"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 0, 'Visualization 1'))
            .toEqual('Total');
        // And the grid cell in ag-grid "Visualization 1" at "1", "3" has text "$6,766,511"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 3, 'Visualization 1'))
            .toEqual('$6,766,511');
        // And the grid cell in ag-grid "Visualization 1" at "79", "0" has text "Dec"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "79", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(79, 0, 'Visualization 1'))
            .toEqual('Dec');
    });

    it('[TC71102_04] Validate Standard Outline Mode - Regression (Attribute forms in rows and Subtotal in Columns)', async () => {
        // Edit dossier by its ID "49735FD53342110EB5FB46B71A84043F"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Create > AGGrid_DnD_TC89029
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridDnD.project.id,
            dossierId: gridConstants.AGGridDnD.id,
        });
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I add "attribute" named "City" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('City', 'attribute', 'retail-sample-data.xls');
        // And I add "attribute" named "Supplier" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Supplier', 'attribute', 'retail-sample-data.xls');
        // And I add "attribute" named "Item Category" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Item Category', 'attribute', 'retail-sample-data.xls');
        // And I drag "attribute" named "Month" from dataset "retail-sample-data.xls" to dropzone "Columns"
        await vizPanelForGrid.dragDSObjectToGridDZ('Month', 'attribute', 'retail-sample-data.xls', 'Columns');
        // And I add "metric" named "Cost" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');

        // # Add filter so expand all/collapse all is easily seen
        // And I right click on "attribute" named "Supplier" from dataset "retail-sample-data.xls" and select "Add to Filter"
        await datasetPanel.actionOnObjectFromDataset(
            'Supplier',
            'attribute',
            'retail-sample-data.xls',
            'Add to Filter'
        );
        // And I define Dynamic Selection for the selector "Supplier" to be "First N Elements" and have quantity 1
        await filterPanel.toggleSelectorMenu('Supplier');
        await filterPanel.openDynamicSelectionMenu();
        await filterPanel.configDynamicSelection('First N Elements', 1);

        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I expand "Layout" section
        await newFormatPanelForGrid.clickSectionTitle('Layout');
        // And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
        // And I pause execution for 1 seconds
        await browser.pause(1000);
        // And I change the outline mode from "Compact" to "Standard" through the format panel
        await baseFormatPanelReact.changeDropdownReact('Compact', 'Standard');
        // Then the grid cell in ag-grid "Visualization 1" at "2", "0" has text "Total"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1'))
            .toEqual('Total');
        // And the grid cell in ag-grid "Visualization 1" at "3", "0" has text "Annapolis"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "3", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(3, 0, 'Visualization 1'))
            .toEqual('Annapolis');
        // # next column not visible
        // And the grid cell in ag-grid "Visualization 1" at "4", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "4", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(4, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // And the grid cell in ag-grid "Visualization 1" at "10", "0" has text "Baltimore"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "10", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(10, 0, 'Visualization 1'))
            .toEqual('Baltimore');

        // # step 9 : enable subtotals for attribute in column
        // When I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I enable subtotals "Total" of "attribute" named "Month" in the Grid Editor Panel
        await editorPanelForGrid.createSubtotalsFromEditorPanel('Month', 'attribute', 'Total');
        // Scroll to the right
        await agGridVisualization.scrollHorizontally('right', 500, 'Visualization 1');
        // Then the grid cell in ag-grid "Visualization 1" at "0", "15" has text "Total"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "0", "15" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(0, 15, 'Visualization 1'))
            .toEqual('Total');
        // And the grid cell in ag-grid "Visualization 1" at "1", "15" has text "Cost"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "15" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 15, 'Visualization 1'))
            .toEqual('Cost');
        // And the grid cell in ag-grid "Visualization 1" at "2", "15" has text "$6,766,511"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "15" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 15, 'Visualization 1'))
            .toEqual('$6,766,511');

        // # step 10: move positioning
        // When I change the position of all "Total" header cells to "Move to left" on ag-grid "Visualization 1"
        await agGridVisualization.changeSubtotalPosition('Total', 'Move to left', 'Visualization 1', true);
        // Then the grid cell in ag-grid "Visualization 1" at "0", "3" has text "Total"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "0", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(0, 3, 'Visualization 1'))
            .toEqual('Total');
        // And the grid cell in ag-grid "Visualization 1" at "1", "6" has text "Cost"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "6" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 6, 'Visualization 1'))
            .toEqual('Cost');
        // And the grid cell in ag-grid "Visualization 1" at "2", "3" has text "$6,766,511"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 3, 'Visualization 1'))
            .toEqual('$6,766,511');

        // When I change the position of all "Total" header cells to "Move to right" on ag-grid "Visualization 1"
        await agGridVisualization.changeSubtotalPosition('Total', 'Move to right', 'Visualization 1', true);
        await agGridVisualization.scrollHorizontally('right', 500, 'Visualization 1');
        // Then the grid cell in ag-grid "Visualization 1" at "0", "15" has text "Total"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "0", "15" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(0, 15, 'Visualization 1'))
            .toEqual('Total');
        // And the grid cell in ag-grid "Visualization 1" at "1", "15" has text "Cost"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "15" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 15, 'Visualization 1'))
            .toEqual('Cost');
        // And the grid cell in ag-grid "Visualization 1" at "2", "15" has text "$6,766,511"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "15" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 15, 'Visualization 1'))
            .toEqual('$6,766,511');

        // When I right click on element "Total" and select "Remove" from ag-grid "Visualization 1"
        await agGridVisualization.openMenuItem('Total', 'Remove', 'Visualization 1');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then the grid cell in ag-grid "Visualization 1" at "0", "15" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "0", "15" is not present')
            .expect(await agGridVisualization.getGridCellByPos(0, 15, 'Visualization 1').isExisting())
            .toBe(false);

        // # step 11 : enable / disable attribute forms
        // When I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I multiselect display forms "Latitude,Longitude" for object "City" in dropzone "Rows"
        await editorPanelForGrid.multiSelectDisplayFormsFromDropZone('Latitude,Longitude', 'City', 'Rows');
        // Then the grid cell in ag-grid "Visualization 1" at "3", "0" has text "Annapolis 38.9785 -76.4922"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "3", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(3, 0, 'Visualization 1'))
            .toEqual('Annapolis 38.9785 -76.4922');
        // And the grid cell in ag-grid "Visualization 1" at "10", "0" has text "Baltimore 39.2904 -76.6122"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "10", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(10, 0, 'Visualization 1'))
            .toEqual('Baltimore 39.2904 -76.6122');

        // When I open the More Options dialog for the visualization "Visualization 1" through the visualization context menu
        await agGridVisualization.openContextMenu('Visualization 1');
        // click on the "More Options" menu item
        await agGridVisualization.selectContextMenuOption('More Options...');
        // select "On" from display attribute form mode pull down list in More Options dialog
        await moreOptions.selectDisplayAttributeFormMode('On');
        // save and close More Options dialog
        await moreOptions.saveAndCloseMoreOptionsDialog();

        // Then the grid cell in ag-grid "Visualization 1" at "0", "0" has text "City ID | City Latitude | City Longitude"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "0", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(0, 0, 'Visualization 1'))
            .toEqual('City ID | City Latitude | City Longitude');

        // # Expand All City
        // When I expand the element at "0", "0" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(0, 0, 'Visualization 1'));
        // Then the element at "0", "0" in outline mode from ag-grid "Visualization 1" should have "expanded" icon
        await since(
            'The element at "0", "0" in outline mode from ag-grid "Visualization 1" should have "expanded" icon'
        )
            .expect(await agGridVisualization.getGridCellExpandIconByPos(0, 0, 'Visualization 1'))
            .toBe(true);

        // # next column is visible and has collapsed icon
        // And the grid cell in ag-grid "Visualization 1" at "0", "3" has text "Supplier ID"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "0", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(0, 3, 'Visualization 1'))
            .toEqual('Supplier ID');
        // And the element at "0", "3" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon
        await since(
            'The element at "0", "3" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon'
        )
            .expect(await agGridVisualization.getGridCellCollapseIconByPos(0, 3, 'Visualization 1'))
            .toBe(true);
        // # Annapolis
        // And the grid cell in ag-grid "Visualization 1" at "4", "3" has text "20th Century Fox"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "4", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(4, 3, 'Visualization 1'))
            .toEqual('20th Century Fox');
        // # Burlington
        // And the grid cell in ag-grid "Visualization 1" at "11", "3" has text "20th Century Fox"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "11", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(11, 3, 'Visualization 1'))
            .toEqual('20th Century Fox');
        // # Wilmington
        // And the grid cell in ag-grid "Visualization 1" at "102", "3" has text "20th Century Fox"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "102", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(102, 3, 'Visualization 1'))
            .toEqual('20th Century Fox');
        // # Item Category should be present
        // And the grid cell in ag-grid "Visualization 1" at "0", "4" is present
        await since('The grid cell in ag-grid "Visualization 1" at "0", "4" is present')
            .expect(await agGridVisualization.getGridCellByPos(0, 4, 'Visualization 1').isExisting())
            .toBe(true);

        // # expand each city
        // When I expand the element at "4", "3" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(4, 3, 'Visualization 1'));
        // Then the element at "4", "3" in outline mode from ag-grid "Visualization 1" should have "expanded" icon
        await since(
            'The element at "4", "3" in outline mode from ag-grid "Visualization 1" should have "expanded" icon'
        )
            .expect(await agGridVisualization.getGridCellExpandIconByPos(4, 3, 'Visualization 1'))
            .toBe(true);
        // # next column is visible
        // And the grid cell in ag-grid "Visualization 1" at "0", "4" has text "Item Category ID"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "0", "4" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(0, 4, 'Visualization 1'))
            .toEqual('Item Category ID');
        // And the element at "0", "4" in outline mode from ag-grid "Visualization 1" should not have "collapsed" icon
        await since(
            'The element at "0", "4" in outline mode from ag-grid "Visualization 1" should not have "collapsed" icon'
        )
            .expect(await agGridVisualization.getGridCellCollapseIconByPos(0, 4, 'Visualization 1'))
            .toBe(false);
        // And the grid cell in ag-grid "Visualization 1" at "5", "4" has text "Action Movies"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "5", "4" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(5, 4, 'Visualization 1'))
            .toEqual('Action Movies');
        // # Supplier for Baltimore is not open
        // But the grid cell in ag-grid "Visualization 1" at "12", "4" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "12", "4" is not present')
            .expect(await agGridVisualization.getGridCellByPos(12, 4, 'Visualization 1').isExisting())
            .toBe(false);

        // # Baltimore
        // When I expand the element at "11", "3" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(11, 3, 'Visualization 1'));
        // Then the element at "11", "3" in outline mode from ag-grid "Visualization 1" should have "expanded" icon
        await since(
            'The element at "11", "3" in outline mode from ag-grid "Visualization 1" should have "expanded" icon'
        )
            .expect(await agGridVisualization.getGridCellExpandIconByPos(11, 3, 'Visualization 1'))
            .toBe(true);
        // And the grid cell in ag-grid "Visualization 1" at "12", "4" has text "Action Movies"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "12", "4" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(12, 4, 'Visualization 1'))
            .toEqual('Action Movies');
        // # Supplier for Burlington is not open
        // But the grid cell in ag-grid "Visualization 1" at "19", "4" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "19", "4" is not present')
            .expect(await agGridVisualization.getGridCellByPos(19, 4, 'Visualization 1').isExisting())
            .toBe(false);

        // # collapse Annapolis
        // When I collapse the element at "4", "3" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.collapseGroupCell(
            await agGridVisualization.getGridCellByPos(4, 3, 'Visualization 1')
        );
        // Then the element at "4", "3" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon
        await since(
            'The element at "4", "3" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon'
        )
            .expect(await agGridVisualization.getGridCellCollapseIconByPos(4, 3, 'Visualization 1'))
            .toBe(true);
        // # next column is still visible from Feb
        // And the grid cell in ag-grid "Visualization 1" at "0", "4" has text "Item Category ID"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "0", "4" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(0, 4, 'Visualization 1'))
            .toEqual('Item Category ID');
        // And the grid cell in ag-grid "Visualization 1" at "5", "4" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "5", "4" is not present')
            .expect(await agGridVisualization.getGridCellByPos(5, 4, 'Visualization 1').isExisting())
            .toBe(false);
        // # Feb is still open
        // And the grid cell in ag-grid "Visualization 1" at "12", "4" has text "Action Movies"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "12", "4" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(12, 4, 'Visualization 1'))
            .toEqual('Action Movies');

        // # collapse all Months
        // When I collapse the element at "0", "0" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.collapseGroupCell(
            await agGridVisualization.getGridCellByPos(0, 0, 'Visualization 1')
        );
        // Then the element at "0", "0" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon
        await since(
            'The element at "0", "0" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon'
        )
            .expect(await agGridVisualization.getGridCellCollapseIconByPos(0, 0, 'Visualization 1'))
            .toBe(true);
        // # Supplier should be hidden
        // # Annapolis
        // And the grid cell in ag-grid "Visualization 1" at "4", "3" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "4", "3" is not present')
            .expect(await agGridVisualization.getGridCellByPos(4, 3, 'Visualization 1').isExisting())
            .toBe(false);
        // # Burlington
        // And the grid cell in ag-grid "Visualization 1" at "11", "3" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "11", "3" is not present')
            .expect(await agGridVisualization.getGridCellByPos(11, 3, 'Visualization 1').isExisting())
            .toBe(false);
        // # Wilmington
        // And the grid cell in ag-grid "Visualization 1" at "101", "3" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "101", "3" is not present')
            .expect(await agGridVisualization.getGridCellByPos(101, 3, 'Visualization 1').isExisting())
            .toBe(false);
        // # Item Category should be present
        // And the grid cell in ag-grid "Visualization 1" at "0", "4" is present
        await since('The grid cell in ag-grid "Visualization 1" at "0", "4" is present')
            .expect(await agGridVisualization.getGridCellByPos(0, 4, 'Visualization 1').isExisting())
            .toBe(true);

        // And I multiselect display forms "Latitude,Longitude" for object "City" in dropzone "Rows"
        await editorPanelForGrid.multiSelectDisplayFormsFromDropZone('Latitude,Longitude', 'City', 'Rows');
        // Then the grid cell in ag-grid "Visualization 1" at "3", "0" has text "Annapolis"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "3", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(3, 0, 'Visualization 1'))
            .toEqual('Annapolis');
        // And the grid cell in ag-grid "Visualization 1" at "10", "0" has text "Baltimore"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "10", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(10, 0, 'Visualization 1'))
            .toEqual('Baltimore');
        // And the grid cell in ag-grid "Visualization 1" at "0", "0" has text "City ID"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "0", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(0, 0, 'Visualization 1'))
            .toEqual('City ID');
    });

    it('[TC71102_05] Convert from Modern Grid with outline mode to Simple Grid', async () => {
        // Edit dossier by its ID "49735FD53342110EB5FB46B71A84043F"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Create > AGGrid_DnD_TC89029
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridDnD.project.id,
            dossierId: gridConstants.AGGridDnD.id,
        });
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I add "attribute" named "Month" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Month', 'attribute', 'retail-sample-data.xls');
        // And I add "attribute" named "Supplier" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Supplier', 'attribute', 'retail-sample-data.xls');
        // And I add "metric" named "Cost" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');

        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I expand "Layout" section
        await newFormatPanelForGrid.clickSectionTitle('Layout');
        // And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
        // And I change the outline mode from "Compact" to "Standard" through the format panel
        await baseFormatPanelReact.changeDropdownReact('Compact', 'Standard');

        // # Case 5. Convert from Modern Grid with outline mode to Simple Grid
        // When I change visualization "Visualization 1" to "Grid" from context menu
        await baseContainer.changeViz('Grid', 'Visualization 1', true);
        // And I click on container "Visualization 1" to select it
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // Then The editor panel should have "attribute" named "Month" on "Rows" section
        await since('The editor panel should have "attribute" named "Month" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Month', 'attribute', 'Rows').isExisting())
            .toBe(true);
        // And The editor panel should have "attribute" named "Supplier" on "Rows" section
        await since('The editor panel should have "attribute" named "Supplier" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Supplier', 'attribute', 'Rows').isExisting())
            .toBe(true);
        // And The editor panel should have "metric" named "Cost" on "Metrics" section
        await since('The editor panel should have "metric" named "Cost" on "Metrics" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Cost', 'metric', 'Metrics').isExisting())
            .toBe(true);
        // And The attribute "Month" should remain expanded in "Visualization 1"
        await since('The attribute "Month" should remain expanded in "Visualization 1"')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded('Month', 'Visualization 1'))
            .toBe(true);

        // When I change visualization "Visualization 1" to "Grid (Modern)" from context menu
        await baseContainer.changeViz('Grid (Modern)', 'Visualization 1', true);
        // And I click on container "Visualization 1" to select it
        // # existing defect, outline mode should have persisted
        // And I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I switch to microcharts tab in Format Panel
        await newFormatPanelForGrid.switchToTab('microcharts');
        // And I expand "Layout" section
        await newFormatPanelForGrid.clickSectionTitle('Layout');
        // And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
        // # Should preserve outline mode
        // Then The selected option in dropdown is "Standard" in new format panel
        await since('The selected option in dropdown is "Standard" in new format panel')
            .expect(await baseFormatPanelReact.getPullDownWithCurrentSelectionReact('Standard').getText())
            .toBe('Standard');
    });

    it('[TC71102_06] Convert from Modern Grid with outline mode to Compound Grid', async () => {
        // Edit dossier by its ID "49735FD53342110EB5FB46B71A84043F"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Create > AGGrid_DnD_TC89029
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridDnD.project.id,
            dossierId: gridConstants.AGGridDnD.id,
        });
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I add "attribute" named "Month" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Month', 'attribute', 'retail-sample-data.xls');
        // And I add "attribute" named "Supplier" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Supplier', 'attribute', 'retail-sample-data.xls');
        // And I add "metric" named "Cost" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');

        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I expand "Layout" section
        await newFormatPanelForGrid.clickSectionTitle('Layout');
        // And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
        // And I change the outline mode from "Compact" to "Standard" through the format panel
        await baseFormatPanelReact.changeDropdownReact('Compact', 'Standard');

        // # Case 5. Convert from Modern Grid with outline mode to Simple Grid
        // When I change visualization "Visualization 1" to "Compound Grid" from context menu
        await baseContainer.changeViz('Compound Grid', 'Visualization 1', true);
        // And I click on container "Visualization 1" to select it
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // Then The editor panel should have "attribute" named "Month" on "Rows" section
        await since('The editor panel should have "attribute" named "Month" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Month', 'attribute', 'Rows').isExisting())
            .toBe(true);
        // And The editor panel should have "attribute" named "Supplier" on "Rows" section
        await since('The editor panel should have "attribute" named "Supplier" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Supplier', 'attribute', 'Rows').isExisting())
            .toBe(true);
        // And The editor panel should have "metric" named "Cost" on "Columns" section
        await since('The editor panel should have "metric" named "Cost" on "Columns" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Cost', 'metric', 'Columns').isExisting())
            .toBe(true);
        // And The attribute "Month" should remain expanded in "Visualization 1"
        await since('The attribute "Month" should remain expanded in "Visualization 1"')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded('Month', 'Visualization 1'))
            .toBe(true);

        // When I change visualization "Visualization 1" to "Grid (Modern)" from context menu
        await baseContainer.changeViz('Grid (Modern)', 'Visualization 1', true);
        // And I click on container "Visualization 1" to select it
        // # existing defect, outline mode should have persisted
        // And I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I switch to microcharts tab in Format Panel
        await newFormatPanelForGrid.switchToTab('microcharts');
        // And I expand "Layout" section
        await newFormatPanelForGrid.clickSectionTitle('Layout');
        // And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
        // # Should preserve outline mode
        // Then The selected option in dropdown is "Standard" in new format panel
        await since('The selected option in dropdown is "Standard" in new format panel')
            .expect(await baseFormatPanelReact.getPullDownWithCurrentSelectionReact('Standard').getText())
            .toBe('Standard');
    });

    it('[TC71102_07] Convert from Modern Grid with outline mode to bar chart', async () => {
        // Edit dossier by its ID "49735FD53342110EB5FB46B71A84043F"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Create > AGGrid_DnD_TC89029
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridDnD.project.id,
            dossierId: gridConstants.AGGridDnD.id,
        });
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I add "attribute" named "Month" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Month', 'attribute', 'retail-sample-data.xls');
        // And I add "attribute" named "Supplier" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Supplier', 'attribute', 'retail-sample-data.xls');
        // And I add "metric" named "Cost" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');

        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I expand "Layout" section
        await newFormatPanelForGrid.clickSectionTitle('Layout');
        // And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
        // And I change the outline mode from "Compact" to "Standard" through the format panel
        await baseFormatPanelReact.changeDropdownReact('Compact', 'Standard');

        // # Case 5. Convert from Modern Grid with outline mode to Simple Grid
        // When I change visualization "Visualization 1" to "Compound Grid" from context menu
        await baseContainer.changeViz('Vertical Bar Chart', 'Visualization 1', true);
        // And I click on container "Visualization 1" to select it
        await baseContainer.clickContainerByScript('Visualization 1');
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // Then The editor panel should have "attribute" named "Month" on "Horizontal" section
        await since('The editor panel should have "attribute" named "Month" on "Horizontal" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Month', 'attribute', 'Horizontal').isExisting())
            .toBe(true);
        // And The editor panel should have "attribute" named "Supplier" on "Horizontal" section
        await since('The editor panel should have "attribute" named "Supplier" on "Horizontal" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Supplier', 'attribute', 'Horizontal').isExisting())
            .toBe(true);
        // And The editor panel should have "metric" named "Cost" on "Vertical" section
        await since('The editor panel should have "metric" named "Cost" on "Vertical" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Cost', 'metric', 'Vertical').isExisting())
            .toBe(true);

        // When I change visualization "Visualization 1" to "Grid (Modern)" from context menu
        await baseContainer.changeViz('Grid (Modern)', 'Visualization 1', true);
        // And I click on container "Visualization 1" to select it
        // # existing defect, outline mode should have persisted
        // And I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I switch to microcharts tab in Format Panel
        await newFormatPanelForGrid.switchToTab('microcharts');
        // And I expand "Layout" section
        await newFormatPanelForGrid.clickSectionTitle('Layout');
        // And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
        // # Should preserve outline mode
        // Then The selected option in dropdown is "Compact" in new format panel
        await since('The selected option in dropdown is "Compact" in new format panel')
            .expect(await baseFormatPanelReact.getPullDownWithCurrentSelectionReact('Compact').getText())
            .toBe('Compact');
    });

    it('[TC71102_08] AG grid with custom groups to outline mode | Regression', async () => {
        // Edit dossier by its ID "49735FD53342110EB5FB46B71A84043F"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Create > AGGrid_DnD_TC89029
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGrid_CustomGroup.project.id,
            dossierId: gridConstants.AGGrid_CustomGroup.id,
        });
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // Then The editor panel should have "custom group" named "Custom Categories" on "Rows" section
        await since('The editor panel should have "custom group" named "Custom Categories" on "Rows" section')
            .expect(
                await editorPanelForGrid.getObjectFromSection('Custom Categories', 'custom group', 'Rows').isExisting()
            )
            .toBe(true);
        // And The editor panel should have "metric" named "Cost" on "Column Set 1" section
        await since('The editor panel should have "metric" named "Cost" on "Column Set 1" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Cost', 'metric', 'Column Set 1').isExisting())
            .toBe(true);
        // And The editor panel should have "attribute" named "Category" on "Column Set 2" section
        await since('The editor panel should have "attribute" named "Category" on "Column Set 2" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Category', 'attribute', 'Column Set 2').isExisting())
            .toBe(true);
        // And the grid cell in ag-grid "Outline Mode" at "2", "1" has text ""
        await since('The grid cell in ag-grid "Outline Mode" at "2", "1" has text "#{expected}", but got "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPos(2, 1, 'Outline Mode'))
            .toEqual('');
        // And the grid cell in ag-grid "Outline Mode" at "0", "0" has text "Custom Categories"
        await since('The grid cell in ag-grid "Outline Mode" at "0", "0" has text "#{expected}", but got "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPos(0, 0, 'Outline Mode'))
            .toEqual('Custom Categories');
        // And the grid cell in ag-grid "Outline Mode" at "2", "2" has text "$29,730,085"
        await since('The grid cell in ag-grid "Outline Mode" at "2", "2" has text "#{expected}", but got "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPos(2, 2, 'Outline Mode'))
            .toEqual('$29,730,085');

        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I expand "Layout" section
        await newFormatPanelForGrid.clickSectionTitle('Layout');
        // And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
        // Then the grid cell in ag-grid "Outline Mode" at "0", "0" has text "Custom Categories"
        await since('The grid cell in ag-grid "Outline Mode" at "0", "0" has text "#{expected}", but got "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPos(0, 0, 'Outline Mode'))
            .toEqual('Custom Categories');
        // And the grid cell in ag-grid "Outline Mode" at "2", "0" has text "Total"
        await since('The grid cell in ag-grid "Outline Mode" at "2", "0" has text "#{expected}", but got "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Outline Mode'))
            .toEqual('Total');

        // When I expand the element at "3", "0" in outline mode from ag-grid "Outline Mode"
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(3, 0, 'Outline Mode'));
        // Then the element at "3", "0" in outline mode from ag-grid "Outline Mode" should have "expanded" icon
        await since('The element at "3", "0" in outline mode from ag-grid "Outline Mode" should have "expanded" icon')
            .expect(await agGridVisualization.getGridCellExpandIconByPos(3, 0, 'Outline Mode'))
            .toBe(true);
        // And the grid cell in ag-grid "Outline Mode" at "3", "0" has text "Category Sales"
        await since('The grid cell in ag-grid "Outline Mode" at "3", "0" has text "#{expected}", but got "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPos(3, 0, 'Outline Mode'))
            .toEqual('Category Sales');
        // And the grid cell in ag-grid "Outline Mode" at "3", "1" has text ""
        await since('The grid cell in ag-grid "Outline Mode" at "3", "1" has text "#{expected}", but got "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPos(3, 1, 'Outline Mode'))
            .toEqual('');
        // And the grid cell in ag-grid "Outline Mode" at "4", "1" has text "Books"
        await since('The grid cell in ag-grid "Outline Mode" at "4", "1" has text "#{expected}", but got "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPos(4, 1, 'Outline Mode'))
            .toEqual('Books');
        // And the grid cell in ag-grid "Outline Mode" at "4", "2" has text "$2,070,816"
        await since('The grid cell in ag-grid "Outline Mode" at "4", "2" has text "#{expected}", but got "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPos(4, 2, 'Outline Mode'))
            .toEqual('$2,070,816');

        // When I expand the element at "0", "0" in outline mode from ag-grid "Outline Mode"
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(0, 0, 'Outline Mode'));
        // Then I pause execution for 2 seconds
        // Then the grid cell in ag-grid "Outline Mode" at "2", "0" has text "Total"
        await since('The grid cell in ag-grid "Outline Mode" at "2", "0" has text "#{expected}", but got "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Outline Mode'))
            .toEqual('Total');
        // And the grid cell in ag-grid "Outline Mode" at "18", "1" has text "Walker:Robert"
        await since('The grid cell in ag-grid "Outline Mode" at "18", "1" has text "#{expected}", but got "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPos(18, 1, 'Outline Mode'))
            .toEqual('Walker:Robert');
        // And the grid cell in ag-grid "Outline Mode" at "17", "5" has text "$179,982"
        await since('The grid cell in ag-grid "Outline Mode" at "17", "5" has text "#{expected}", but got "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPos(17, 3, 'Outline Mode'))
            .toEqual('$179,982');

        // When I collapse the element at "0", "0" in outline mode from ag-grid "Outline Mode"
        await agGridVisualization.collapseGroupCell(await agGridVisualization.getGridCellByPos(0, 0, 'Outline Mode'));
        // Then the grid cell in ag-grid "Outline Mode" at "2", "0" has text "Total"
        await since('The grid cell in ag-grid "Outline Mode" at "2", "0" has text "#{expected}", but got "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Outline Mode'))
            .toEqual('Total');
        // And the grid cell in ag-grid "Outline Mode" at "40", "1" is not present
        await since('The grid cell in ag-grid "Outline Mode" at "40", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(40, 1, 'Outline Mode').isExisting())
            .toBe(false);
        // And the grid cell in ag-grid "Outline Mode" at "40", "2" is not present
        await since('The grid cell in ag-grid "Outline Mode" at "40", "2" is not present')
            .expect(await agGridVisualization.getGridCellByPos(40, 2, 'Outline Mode').isExisting())
            .toBe(false);

        // When I switch to page "Standard" in chapter "Chapter 1" from contents panel
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Standard' });
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // Then The editor panel should have "custom group" named "Custom Categories" on "Rows" section
        await since('The editor panel should have "custom group" named "Custom Categories" on "Rows" section')
            .expect(
                await editorPanelForGrid.getObjectFromSection('Custom Categories', 'custom group', 'Rows').isExisting()
            )
            .toBe(true);
        // And The editor panel should have "metric" named "Cost" on "Column Set 1" section
        await since('The editor panel should have "metric" named "Cost" on "Column Set 1" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Cost', 'metric', 'Column Set 1').isExisting())
            .toBe(true);
        // And The editor panel should have "attribute" named "Category" on "Column Set 2" section
        await since('The editor panel should have "attribute" named "Category" on "Column Set 2" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Category', 'attribute', 'Column Set 2').isExisting())
            .toBe(true);

        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // When I switch to microcharts tab in Format Panel
        await newFormatPanelForGrid.switchToTab('microcharts');
        // And I expand "Layout" section
        await newFormatPanelForGrid.clickSectionTitle('Layout');
        // And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
        // And I change the outline mode from "Compact" to "Standard" through the format panel
        await baseFormatPanelReact.changeDropdownReact('Compact', 'Standard');
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I drag "attribute" named "Brand" from dataset "New Dataset 1" to dropzone "Rows" and drop it below "Custom Categories"
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Brand',
            'attribute',
            'New Dataset 1',
            'Rows',
            'below',
            'Custom Categories'
        );
        // Then The editor panel should have "attribute" named "Brand" on "Rows" section
        await since('The editor panel should have "attribute" named "Brand" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Brand', 'attribute', 'Rows').isExisting())
            .toBe(true);
        // #this line is commented out because it doesn't work like this right now, but is expected to
        // #Then the grid cell in ag-grid "Outline Mode" at "2", "0" has text "Total"
        // And the grid cell in ag-grid "Outline Mode2" at "40", "1" is not present
        await since('The grid cell in ag-grid "Outline Mode2" at "40", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(40, 1, 'Outline Mode').isExisting())
            .toBe(false);
        // And the grid cell in ag-grid "Outline Mode2" at "40", "2" is not present
        await since('The grid cell in ag-grid "Outline Mode2" at "40", "2" is not present')
            .expect(await agGridVisualization.getGridCellByPos(40, 2, 'Outline Mode').isExisting())
            .toBe(false);

        // And I click on container "Outline Mode2" to select it
        await baseContainer.clickContainerByScript('Outline Mode2');
        // When I expand the element at "0", "0" in outline mode from ag-grid "Outline Mode2"
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(0, 0, 'Outline Mode2'));
        // Then the element at "0", "0" in outline mode from ag-grid "Outline Mode2" should have "expanded" icon
        await since('The element at "0", "0" in outline mode from ag-grid "Outline Mode2" should have "expanded" icon')
            .expect(await agGridVisualization.getGridCellExpandIconByPos(0, 0, 'Outline Mode2'))
            .toBe(true);
        // And the grid cell in ag-grid "Outline Mode2" at "3", "0" has text "Category Sales"
        await since('The grid cell in ag-grid "Outline Mode2" at "3", "0" has text "#{expected}", but got "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPos(3, 0, 'Outline Mode2'))
            .toEqual('Category Sales');
        // And the grid cell in ag-grid "Outline Mode2" at "3", "3" has text ""
        await since('The grid cell in ag-grid "Outline Mode2" at "3", "3" has text "#{expected}", but got "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPos(3, 3, 'Outline Mode2'))
            .toEqual('');
        // And the grid cell in ag-grid "Outline Mode2" at "5", "3" has text "$16,979"
        await since('The grid cell in ag-grid "Outline Mode2" at "5", "3" has text "#{expected}", but got "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPos(5, 3, 'Outline Mode2'))
            .toEqual('$16,979');

        // #partially covering DE203714
        // When I switch to page "Multi" in chapter "Chapter 1" from contents panel
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Multi' });
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // Then The editor panel should have "custom group" named "Custom Categories" on "Rows" section
        await since('The editor panel should have "custom group" named "Custom Categories" on "Rows" section')
            .expect(
                await editorPanelForGrid.getObjectFromSection('Custom Categories', 'custom group', 'Rows').isExisting()
            )
            .toBe(true);
        // And The editor panel should have "metric" named "Cost" on "Column Set 1" section
        await since('The editor panel should have "metric" named "Cost" on "Column Set 1" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Cost', 'metric', 'Column Set 1').isExisting())
            .toBe(true);
        // And the grid cell in ag-grid "CG" at "0", "0" has text "Custom Categories"
        await since('The grid cell in ag-grid "CG" at "0", "0" has text "#{expected}", but got "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPos(0, 0, 'CG'))
            .toEqual('Custom Categories');
        // And the grid cell in ag-grid "CG" at "1", "1" has text ""
        await since('The grid cell in ag-grid "CG" at "1", "1" has text "#{expected}", but got "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPos(1, 1, 'CG'))
            .toEqual('');
        // And the grid cell in ag-grid "CG" at "5", "1" has text "Books"
        await since('The grid cell in ag-grid "CG" at "5", "1" has text "#{expected}", but got "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPos(5, 1, 'CG'))
            .toEqual('Books');

        // # enable outline mode
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I switch to microcharts tab in Format Panel
        await newFormatPanelForGrid.switchToTab('microcharts');
        // And I expand "Layout" section
        await newFormatPanelForGrid.clickSectionTitle('Layout');
        // And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
        // #this line is commented out because it doesn't work like this right now, but is expected to
        // #Then the grid cell in ag-grid "CG" at "2", "0" has text "Total"
        // Then the element at "0", "0" in outline mode from ag-grid "CG" should have "collapsed" icon
        await since('The element at "0", "0" in outline mode from ag-grid "CG" should have "collapsed" icon')
            .expect(await agGridVisualization.getGridCellCollapseIconByPos(0, 0, 'CG'))
            .toBe(true);
        // Then the grid cell in ag-grid "CG" at "0", "0" has text "Custom Categories"
        await since('The grid cell in ag-grid "CG" at "0", "0" has text "#{expected}", but got "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPos(0, 0, 'CG'))
            .toEqual('Custom Categories');

        // When I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // Then The editor panel should have "custom group" named "Custom Categories" on "Rows" section
        await since('The editor panel should have "custom group" named "Custom Categories" on "Rows" section')
            .expect(
                await editorPanelForGrid.getObjectFromSection('Custom Categories', 'custom group', 'Rows').isExisting()
            )
            .toBe(true);
        // When I remove "attribute" named "Category" from the Grid Editor Panel
        await editorPanelForGrid.removeFromDropZone('Category', 'attribute');
        // And I drag "attribute" named "Category" from dataset "New Dataset 1" to dropzone "Rows" and drop it above "Custom Categories"
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Category',
            'attribute',
            'New Dataset 1',
            'Rows',
            'above',
            'Custom Categories'
        );
        // Then the grid cell in ag-grid "CG" at "1", "1" has text "Total"
        await since('The grid cell in ag-grid "CG" at "1", "1" has text "#{expected}", but got "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPos(1, 1, 'CG'))
            .toEqual('Total');
        // Then the grid cell in ag-grid "CG" at "2", "0" has text "Books"
        await since('The grid cell in ag-grid "CG" at "2", "0" has text "#{expected}", but got "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'CG'))
            .toEqual('Books');
        // And the grid cell in ag-grid "CG" at "2", "1" is not present
        await since('The grid cell in ag-grid "CG" at "2", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(2, 1, 'CG').isExisting())
            .toBe(false);
        // And the grid cell in ag-grid "CG" at "6", "3" is not present
        await since('The grid cell in ag-grid "CG" at "6", "3" is not present')
            .expect(await agGridVisualization.getGridCellByPos(6, 3, 'CG').isExisting())
            .toBe(false);

        // When I expand the element at "0", "0" in outline mode from ag-grid "CG"
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(0, 0, 'CG'));
        // Then the element at "0", "0" in outline mode from ag-grid "CG" should have "expanded" icon
        await since('The element at "0", "0" in outline mode from ag-grid "CG" should have "expanded" icon')
            .expect(await agGridVisualization.getGridCellExpandIconByPos(0, 0, 'CG'))
            .toBe(true);
        // Then the grid cell in ag-grid "CG" at "1", "1" has text "Total"
        await since('The grid cell in ag-grid "CG" at "1", "1" has text "#{expected}", but got "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPos(1, 1, 'CG'))
            .toEqual('Total');
        // Then the grid cell in ag-grid "CG" at "3", "1" has text "Category Sales"
        await since('The grid cell in ag-grid "CG" at "3", "1" has text "#{expected}", but got "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPos(3, 1, 'CG'))
            .toEqual('Category Sales');
        // And the grid cell in ag-grid "CG" at "2", "3" has text ""
        await since('The grid cell in ag-grid "CG" at "2", "3" has text "#{expected}", but got "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPos(2, 3, 'CG'))
            .toEqual('');
    });

    it('[TC71102_09] Validate Standard Outline Mode - Regression (Attribute forms in columns)', async () => {
        // Edit dossier by its ID "49735FD53342110EB5FB46B71A84043F"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Create > AGGrid_DnD_TC89029
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridDnD.project.id,
            dossierId: gridConstants.AGGridDnD.id,
        });
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();

        // And I add "attribute" named "Supplier" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Supplier', 'attribute', 'retail-sample-data.xls');
        // And I add "attribute" named "Item Category" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Item Category', 'attribute', 'retail-sample-data.xls');
        // And I add "attribute" named "City" from dataset "retail-sample-data.xls" to the current Viz by double click
        await vizPanelForGrid.dragDSObjectToGridDZ('City', 'attribute', 'retail-sample-data.xls', 'Columns');
        // And I add "metric" named "Cost" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');

        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I expand "Layout" section
        await newFormatPanelForGrid.clickSectionTitle('Layout');
        // And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
        // And I pause execution for 1 seconds
        await browser.pause(1000);
        // And I change the outline mode from "Compact" to "Standard" through the format panel
        await baseFormatPanelReact.changeDropdownReact('Compact', 'Standard');

        // Then the grid cell in ag-grid "Visualization 1" at "2", "0" has text "Total"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1'))
            .toEqual('Total');
        // And the grid cell in ag-grid "Visualization 1" at "3", "0" has text "20th Century Fox"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "3", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(3, 0, 'Visualization 1'))
            .toEqual('20th Century Fox');
        // And the grid cell in ag-grid "Visualization 1" at "1", "4" has text "Cost"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "1", "4" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 4, 'Visualization 1'))
            .toEqual('Cost');
        // # next column not visible
        // And the grid cell in ag-grid "Visualization 1" at "4", "1" is not present
        await since('The grid cell in ag-grid "Visualization 1" at "4", "1" is not present')
            .expect(await agGridVisualization.getGridCellByPos(4, 1, 'Visualization 1').isExisting())
            .toBe(false);
        // And the grid cell in ag-grid "Visualization 1" at "9", "0" has text "A&E Entertainment"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "9", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(9, 0, 'Visualization 1'))
            .toEqual('A&E Entertainment');

        // # step 11 : enable / disable attribute forms in column
        // When I switch to Editor Panel tab
        // await editorPanel.switchToEditorPanel();
        // // And I multiselect display forms "Latitude,Longitude" for object "City" in dropzone "Columns"
        // await editorPanelForGrid.multiSelectDisplayFormsFromDropZone('Latitude,Longitude', 'City', 'Columns');
        // Then the grid cell in ag-grid "Visualization 1" at "0", "2" has text "Annapolis"
        // await since(
        //     'The grid cell in ag-grid "Visualization 1" at "0", "2" has text "#{expected}", but got "#{actual}"'
        // )
        //     .expect(await agGridVisualization.getGridCellTextByPos(0, 2, 'Visualization 1'))
        //     .toEqual('Annapolis');
        // And the grid cell in ag-grid "Visualization 1" at "1", "4" has text "38.9785"
        // await since(
        //     'The grid cell in ag-grid "Visualization 1" at "1", "4" has text "#{expected}", but got "#{actual}"'
        // )
        //     .expect(await agGridVisualization.getGridCellTextByPos(1, 4, 'Visualization 1'))
        //     .toEqual('38.9785');
        // // And the grid cell in ag-grid "Visualization 1" at "2", "4" has text "-76.4922"
        // await since(
        //     'The grid cell in ag-grid "Visualization 1" at "2", "4" has text "#{expected}", but got "#{actual}"'
        // )
        //     .expect(await agGridVisualization.getGridCellTextByPos(2, 4, 'Visualization 1'))
        //     .toEqual('-76.4922');
        // // And the grid cell in ag-grid "Visualization 1" at "3", "4" has text "Cost"
        // await since(
        //     'The grid cell in ag-grid "Visualization 1" at "3", "4" has text "#{expected}", but got "#{actual}"'
        // )
        //     .expect(await agGridVisualization.getGridCellTextByPos(3, 4, 'Visualization 1'))
        //     .toEqual('Cost');

        // // # Expand all
        // // When I expand the element at "0", "0" in outline mode from ag-grid "Visualization 1"
        // await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(0, 0, 'Visualization 1'));
        // // Then the element at "0", "0" in outline mode from ag-grid "Visualization 1" should have "expanded" icon
        // await since(
        //     'The element at "0", "0" in outline mode from ag-grid "Visualization 1" should have "expanded" icon'
        // )
        //     .expect(await agGridVisualization.getGridCellExpandIconByPos(0, 0, 'Visualization 1'))
        //     .toBe(true);

        // // # next column is visible and has collapsed icon
        // // And the grid cell in ag-grid "Visualization 1" at "0", "1" has text "Item Category"
        // await since(
        //     'The grid cell in ag-grid "Visualization 1" at "0", "1" has text "#{expected}", but got "#{actual}"'
        // )
        //     .expect(await agGridVisualization.getGridCellTextByPos(0, 1, 'Visualization 1'))
        //     .toEqual('Item Category');
        // // And the element at "0", "1" in outline mode from ag-grid "Visualization 1" should not have "collapsed" icon
        // await since(
        //     'The element at "0", "1" in outline mode from ag-grid "Visualization 1" should not have "collapsed" icon'
        // )
        //     .expect(await agGridVisualization.getGridCellCollapseIconByPos(0, 1, 'Visualization 1'))
        //     .toBe(false);
        // // # 20th Century Fox
        // // And the grid cell in ag-grid "Visualization 1" at "6", "1" has text "Action Movies"
        // await since(
        //     'The grid cell in ag-grid "Visualization 1" at "6", "1" has text "#{expected}", but got "#{actual}"'
        // )
        //     .expect(await agGridVisualization.getGridCellTextByPos(6, 1, 'Visualization 1'))
        //     .toEqual('Action Movies');
        // // # A&E
        // // And the grid cell in ag-grid "Visualization 1" at "12", "1" has text "Special Interests"
        // await since(
        //     'The grid cell in ag-grid "Visualization 1" at "12", "1" has text "#{expected}", but got "#{actual}"'
        // )
        //     .expect(await agGridVisualization.getGridCellTextByPos(12, 1, 'Visualization 1'))
        //     .toEqual('Special Interests');
        // // When I scroll ag-grid "Visualization 1" down to the "bottom"
        // await agGridVisualization.scrollVerticallyToBottom('Visualization 1');
        // await browser.pause(5000);
        // // # WEA
        // // Then the grid cell in ag-grid "Visualization 1" at "135", "1" has text "Alternative Movies"
        // await since(
        //     'The grid cell in ag-grid "Visualization 1" at "135", "1" has text "#{expected}", but got "#{actual}"'
        // )
        //     .expect(await agGridVisualization.getGridCellTextByPos(135, 1, 'Visualization 1'))
        //     .toEqual('Alternative Movies');

        // // # collapse all Months
        // // When I collapse the element at "0", "0" in outline mode from ag-grid "Visualization 1"
        // await agGridVisualization.collapseGroupCell(
        //     await agGridVisualization.getGridCellByPos(0, 0, 'Visualization 1')
        // );
        // // Then the element at "0", "0" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon
        // await since(
        //     'The element at "0", "0" in outline mode from ag-grid "Visualization 1" should have "collapsed" icon'
        // )
        //     .expect(await agGridVisualization.getGridCellCollapseIconByPos(0, 0, 'Visualization 1'))
        //     .toBe(true);
        // // # 20th Century Fox
        // // And the grid cell in ag-grid "Visualization 1" at "6", "1" is not present
        // await since('The grid cell in ag-grid "Visualization 1" at "6", "1" is not present')
        //     .expect(await agGridVisualization.getGridCellByPos(6, 1, 'Visualization 1').isExisting())
        //     .toBe(false);
        // // # A&E
        // // And the grid cell in ag-grid "Visualization 1" at "12", "1" is not present
        // await since('The grid cell in ag-grid "Visualization 1" at "12", "1" is not present')
        //     .expect(await agGridVisualization.getGridCellByPos(12, 1, 'Visualization 1').isExisting())
        //     .toBe(false);
        // // # WEA
        // // And the grid cell in ag-grid "Visualization 1" at "135", "1" is not present
        // await since('The grid cell in ag-grid "Visualization 1" at "135", "1" is not present')
        //     .expect(await agGridVisualization.getGridCellByPos(135, 1, 'Visualization 1').isExisting())
        //     .toBe(false);

        // # disable attribute forms
        // // When I switch to Editor Panel tab
        // await editorPanel.switchToEditorPanel();
        // // And I multiselect display forms "Latitude,Longitude" for object "City" in dropzone "Columns"
        // await editorPanelForGrid.multiSelectDisplayFormsFromDropZone('Latitude,Longitude', 'City', 'Columns');
        // // Then the grid cell in ag-grid "Visualization 1" at "0", "2" has text "Annapolis"
        // await since(
        //     'The grid cell in ag-grid "Visualization 1" at "0", "2" has text "#{expected}", but got "#{actual}"'
        // )
        //     .expect(await agGridVisualization.getGridCellTextByPos(0, 2, 'Visualization 1'))
        //     .toEqual('Annapolis');
        // // And the grid cell in ag-grid "Visualization 1" at "1", "4" has text "Cost"
        // await since(
        //     'The grid cell in ag-grid "Visualization 1" at "1", "4" has text "#{expected}", but got "#{actual}"'
        // )
        //     .expect(await agGridVisualization.getGridCellTextByPos(1, 4, 'Visualization 1'))
        //     .toEqual('Cost');
    });

    it('[TC71102_10] DE332214 BF-314 Outline modern grid and set to fit to container in authoring and consumption mode', async () => {
        // Edit dossier by its ID "5C29A2C4BC421C87C95042AFDE5591D2"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Outline > Outline standard DE332214
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.DE332214_Outline_Container.project.id,
            dossierId: gridConstants.DE332214_Outline_Container.id,
        });
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Standard' });
        await agGridVisualization.clickOnContainerTitle('Visualization 1');
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // Expand the spacing section and set the column width to "Fit to Container"
        await newFormatPanelForGrid.clickSectionTitle('Spacing');
        await browser.pause(2000);
        await newFormatPanelForGrid.clickColumnSizeFitOption('Fit to Content');
        await browser.pause(2000);
        await newFormatPanelForGrid.clickColumnSizeFitOption('Fit to Container');
        await browser.pause(2000);
        // take screenshot for fit to container in authoring mode
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC71102_10_1',
            'Fit to container standard mode in authoring mode'
        );

        await newFormatPanelForGrid.clickColumnSizeFitOption('Fixed');
        await browser.pause(2000);
        let fixedColumnWidth = await newFormatPanelForGrid.columnSizeFixedInput.getValue();

        await newFormatPanelForGrid.clickColumnSizeFitOption('Fit to Container');
        await browser.pause(2000);

        await newFormatPanelForGrid.clickColumnSizeFitOption('Fixed');
        let fixedColumnWidth2 = await newFormatPanelForGrid.columnSizeFixedInput.getValue();
        await since('The fixed column width is not changed').expect(fixedColumnWidth2).toEqual(fixedColumnWidth);

        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC71102_10_2',
            'The fixed column width is not changed for customer issue BF-314'
        );

        await newFormatPanelForGrid.clickColumnSizeFitOption('Fit to Container');
        await browser.pause(2000);
        // save and open
        await dossierAuthoringPage.saveAndOpen();
        await dossierAuthoringPage.waitForElementVisible(dossierAuthoringPage.getDossierSavedSuccessfullyDialog());
        await dossierAuthoringPage.waitForElementInvisible(dossierAuthoringPage.getDossierSavedSuccessfullyDialog());
        await browser.pause(2000);
        await dossierPage.hidePageIndicator();
        // take screenshot for fit to container in consumption mode
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
            'TC71102_10_3',
            'Fit to container standard mode in consumption mode'
        );
        // Go back to authoring mode
        await dossierPage.clickEditIcon();
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Compact' });
        // take screenshot for compact mode in authoring mode
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC71102_10_4',
            'Fit to container compact mode in authoring mode'
        );
        // Save and open the dossier to test layout modes in consumption mode
        await dossierAuthoringPage.saveAndOpen();
        await dossierAuthoringPage.waitForElementVisible(dossierAuthoringPage.getDossierSavedSuccessfullyDialog());
        await dossierAuthoringPage.waitForElementInvisible(dossierAuthoringPage.getDossierSavedSuccessfullyDialog());
        await browser.pause(2000);
        await dossierPage.hidePageIndicator();
        // take screenshot for compact mode in consumption mode
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
            'TC71102_10_5',
            'Fit to container compact mode in consumption mode'
        );
    });

    it('[TC71102_11] DE332214 Outline modern grid and set to fit to content in authoring and consumption mode', async () => {
        // Edit dossier by its ID "5C29A2C4BC421C87C95042AFDE5591D2"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Outline > Outline standard DE332214
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.DE332214_Outline_Content.project.id,
            dossierId: gridConstants.DE332214_Outline_Content.id,
        });
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Standard' });
        await agGridVisualization.clickOnContainerTitle('Visualization 1');
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // Expand the spacing section and set the column width to "Fit to Content"
        await newFormatPanelForGrid.clickSectionTitle('Spacing');
        await newFormatPanelForGrid.clickColumnSizeFitOption('Fit to Content');
        await browser.pause(2000);
        // take screenshot for fit to content in authoring mode
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC71102_11_1',
            'Fit to content standard mode in authoring mode'
        );
        // save and open
        await dossierAuthoringPage.saveAndOpen();
        await dossierAuthoringPage.waitForElementVisible(dossierAuthoringPage.getDossierSavedSuccessfullyDialog());
        await dossierAuthoringPage.waitForElementInvisible(dossierAuthoringPage.getDossierSavedSuccessfullyDialog());
        await browser.pause(2000);
        await dossierPage.hidePageIndicator();
        // take screenshot for fit to content in consumption mode
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
            'TC71102_11_2',
            'Fit to content standard mode in consumption mode'
        );
        // Go back to authoring mode
        await dossierPage.clickEditIcon();
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Compact' });
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // Expand the spacing section and set the column width to "Fit to Content"
        await newFormatPanelForGrid.clickSectionTitle('Spacing');
        await newFormatPanelForGrid.clickColumnSizeFitOption('Fit to Content');
        // await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // await newFormatPanelForGrid.clickSectionTitle('Layout');
        // // Switch to compact mode
        // await baseFormatPanelReact.changeDropdownReact('Standard', 'Compact');
        // await browser.pause(2000);
        // take screenshot for compact mode in authoring mode
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC71102_11_3',
            'Fit to content compact mode in authoring mode'
        );
        // Save and open the dossier to test layout modes in consumption mode
        await dossierAuthoringPage.saveAndOpen();
        await dossierAuthoringPage.waitForElementVisible(dossierAuthoringPage.getDossierSavedSuccessfullyDialog());
        await dossierAuthoringPage.waitForElementInvisible(dossierAuthoringPage.getDossierSavedSuccessfullyDialog());
        await browser.pause(2000);
        await dossierPage.hidePageIndicator();
        // take screenshot for fit to content in consumption mode
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
            'TC71102_11_4',
            'Fit to content compact mode in consumption mode'
        );
    });

    it('[BCIN-5784] Outline mode "Merge repetitive cells" for row header should always be checked.', async () => {
        // Edit dossier by its ID "49735FD53342110EB5FB46B71A84043F"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Create > AGGrid_DnD_TC89029
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridDnD.project.id,
            dossierId: gridConstants.AGGridDnD.id,
        });

        await vizPanelForGrid.dragDSObjectToGridDZ('Month', 'attribute', 'retail-sample-data.xls', 'Rows');
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Supplier',
            'attribute',
            'retail-sample-data.xls',
            'Rows',
            'below',
            'Month'
        );
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');

        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        await newFormatPanelForGrid.switchToTab('microcharts');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await newFormatPanelForGrid.clickSectionTitle('Layout');
        // set 'Merge repetitive cells' for row header to checked
        await reportFormatPanel.clickCheckBoxForOption('Row headers', 'Merge repetitive cells', true);
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
        // verify 'Merge repetitive cells' for row header is checked and cannot be uncheck
        await takeScreenshotByElement(
            newFormatPanelForGrid.FormatPanel,
            'BCIN-5784_1',
            '"Merge repetitive cells" for row header is checked and cannot be unchecked'
        );
        // enable subtotal for 'Supplier'
        await editorPanel.switchToEditorPanel();
        await editorPanelForGrid.createSubtotalsFromEditorPanel('Supplier', 'attribute', 'Average,Maximum');
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(0, 0, 'Visualization 1'));
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'BCIN-5784_2',
            '"Average, Maximum" subtotal display for Supplier'
        );
    });

    it('[BCIN-7327] Column header is cut off in outline mode.', async () => {
        await libraryPage.openDossierById({
            projectId: gridConstants.AGGrid_OutlineHeader.project.id,
            dossierId: gridConstants.AGGrid_OutlineHeader.id,
        });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'BCIN-7327_1',
            'Column header is not cut off in consumption mode'
        );
        // go to edit mode
        await dossierPage.clickEditIcon();
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'BCIN-7327_2',
            'Column header is not cut off in authoring mode'
        );
    });
});
