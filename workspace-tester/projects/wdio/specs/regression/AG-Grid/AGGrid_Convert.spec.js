import * as gridConstants from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('AGGrid_Convert', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        loginPage,
        libraryPage,
        baseVisualization,
        baseContainer,
        editorPanelForGrid,
        agGridVisualization,
        editorPanel,
        compoundGridVisualization,
        contentsPanel,
        reportGridView,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {});

    it('[TC71106] End to End Modern Grid validation - converting existing dossier visualizations to Modern (AG)Grid', async () => {
        // 1. Convert simple grid to Modern Grid, Dossier location: New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Convert > AGGrid_ConvertGrid_NG_TC71106
        // Edit dossier by its ID "CF5F62B411EA5D84D25F0080EFB54A05"
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridConvert1.project.id,
            dossierId: gridConstants.AGGridConvert1.id,
        });

        // 1.1 attribute on row, metric on column
        await baseVisualization.changeVizType('2AR_2MC', 'Grid', 'Grid (Modern)');
        await takeScreenshotByElement(editorPanelForGrid.editorPanel, 'TC71106_01', 'Datasets Panel for 2AR_2MC');

        await since('The grid cell in ag-grid "2AR_2MC" at row 2, col 1 should be #{expected}, instead it is #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, '2AR_2MC'))
            .toBe('2009');

        await since('The grid cell in ag-grid "2AR_2MC" at row 3, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, '2AR_2MC'))
            .toBe('Monday');

        // 1.2 attirbute on columns, metric on rows
        await baseVisualization.changeVizType('2MR_2AC', 'Grid', 'Grid (Modern)');

        await takeScreenshotByElement(editorPanelForGrid.editorPanel, 'TC71106_02', 'Datasets Panel for 2MR_2AC');

        await since('The grid cell in ag-grid "2MR_2AC" at row 2, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, '2MR_2AC'))
            .toBe('Sunday');

        await since('The grid cell in ag-grid "2MR_2AC" at row 3, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, '2MR_2AC'))
            .toBe('567');

        // 1.3 attirbute on rows and columns, metric on rows
        await baseVisualization.changeVizType('2A2MR_1AC', 'Grid', 'Grid (Modern)');

        await takeScreenshotByElement(editorPanelForGrid.editorPanel, 'TC71106_03', 'Datasets Panel for 2A2MR_1AC');

        await since(
            'The grid cell in ag-grid "2A2MR_1AC" at row 2, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, '2A2MR_1AC'))
            .toBe('2009');

        await since(
            'The grid cell in ag-grid "2A2MR_1AC" at row 2, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, '2A2MR_1AC'))
            .toBe('Flights Cancelled');

        await since(
            'The grid cell in ag-grid "2A2MR_1AC" at row 3, col 5 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 5, '2A2MR_1AC'))
            .toBe('44');

        // 1.4 attirbute on rows and columns, metric on columns
        await baseVisualization.changeVizType('1AR_2A2MC', 'Grid', 'Grid (Modern)');

        await takeScreenshotByElement(editorPanelForGrid.editorPanel, 'TC71106_04', 'Datasets Panel for 1AR_2A2MC');

        await since(
            'The grid cell in ag-grid "1AR_2A2MC" at row 4, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 1, '1AR_2A2MC'))
            .toBe('AirTran Airways Corporation');

        await since(
            'The grid cell in ag-grid "1AR_2A2MC" at row 3, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, '1AR_2A2MC'))
            .toBe('Monday');

        await since(
            'The grid cell in ag-grid "1AR_2A2MC" at row 4, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 3, '1AR_2A2MC'))
            .toBe('23');

        // 2. Convert compound grid to Modern Grid, Dossier location: New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Convert > AGGrid_ConvertGrid_CG_TC71106
        // Edit dossier by its ID "01833458F743D5192DB775AA9CB3A3F1"
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridConvert2.project.id,
            dossierId: gridConstants.AGGridConvert2.id,
        });

        // 2.1 simple compound grid
        await baseVisualization.changeVizType('Simple', 'Grid', 'Grid (Modern)');

        await takeScreenshotByElement(editorPanelForGrid.editorPanel, 'TC71106_05', 'Datasets Panel for Simple');

        await since('The grid cell in ag-grid "Simple" at row 3, col 1 should be #{expected}, instead it is #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'Simple'))
            .toBe('AirTran Airways Corporation');

        await since('The grid cell in ag-grid "Simple" at row 1, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 3, 'Simple'))
            .toBe('BWI');

        await since('The grid cell in ag-grid "Simple" at row 3, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, 'Simple'))
            .toBe('5301');

        // 2.2 complex compound grid
        //switch to page: Complex CG
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Complex CG' });
        await baseVisualization.changeVizType('Complex', 'Grid', 'Grid (Modern)');
        await takeScreenshotByElement(editorPanelForGrid.editorPanel, 'TC71106_06', 'Datasets Panel for Complex');

        await since('The grid cell in ag-grid "Complex" at row 1, col 1 should be #{expected}, instead it is #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'Complex'))
            .toBe('Airline Name(Group)');

        await since('The grid cell in ag-grid "Complex" at row 2, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 4, 'Complex'))
            .toBe('Cancelled + Delayed');

        await since('The grid cell in ag-grid "Complex" at row 5, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(5, 3, 'Complex'))
            .toBe('6266');

        // 3. Convert Modern Grid to compound grid, Dossier location: New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Convert > AGGrid_ConvertGrid_AG_TC71106
        // Edit dossier by its ID "E265BBDE50412453B1453880EF0C2BA7"
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridConvert3.project.id,
            dossierId: gridConstants.AGGridConvert3.id,
        });

        // 3.1 Modern grid with multiple column sets and microcharts
        await baseVisualization.changeVizType('Visualization 1', 'Grid', 'Compound Grid');

        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71106_07',
            'Datasets Panel for Compound Grid: Visualization 1'
        );

        await since(
            'The grid cell in Compound Grid "Visualization 1" at row 2, col 6 should be #{expected}, instead it is #{actual}'
        )
            .expect(await compoundGridVisualization.getGridCellTextByPosition(2, 6, 'Visualization 1'))
            .toBe('On-Time');

        await since(
            'The grid cell in Compound Grid "Visualization 1" at row 1, col 10 should be #{expected}, instead it is #{actual}'
        )
            .expect(await compoundGridVisualization.getGridCellTextByPosition(1, 10, 'Visualization 1'))
            .toBe('0:00-0:6:00');

        await since(
            'The grid cell in Compound Grid "Visualization 1" at row 3, col 5 should be #{expected}, instead it is #{actual}'
        )
            .expect(await compoundGridVisualization.getGridCellTextByPosition(3, 5, 'Visualization 1'))
            .toBe('24573');

        await baseVisualization.changeVizType('Visualization 1', 'Grid', 'Grid (Modern)');

        // 3.2 Modern grid with single microchart
        await baseVisualization.changeVizType('Visualization 2', 'Grid', 'Compound Grid');

        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71106_08',
            'Datasets Panel for Compound Grid: Visualization 2'
        );

        await since(
            'The grid cell in Compound Grid "Visualization 2" at row 2, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await compoundGridVisualization.getGridCellTextByPosition(2, 2, 'Visualization 2'))
            .toBe('BWI');

        await since(
            'The grid cell in Compound Grid "Visualization 2" at row 4, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await compoundGridVisualization.getGridCellTextByPosition(4, 2, 'Visualization 2'))
            .toBe('36,980.63');

        // 4. Convert Modern Grid to simple grid
        // Edit dossier by its ID "E265BBDE50412453B1453880EF0C2BA7"
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridConvert3.project.id,
            dossierId: gridConstants.AGGridConvert3.id,
        });

        await baseContainer.changeViz('Grid', 'Visualization 1', true);
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71106_09',
            'Datasets Panel for Normal Gird: Visualization 1'
        );

        await since(
            'The grid cell in Normal Grid "Visualization 1" at row 2, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await compoundGridVisualization.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('Avg Delay (min)');

        await since(
            'The grid cell in Normal Grid "Visualization 1" at row 3, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await compoundGridVisualization.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('68,257.42');

        await baseVisualization.changeVizType('Visualization 1', 'Grid', 'Grid (Modern)');

        await baseContainer.changeViz('Grid', 'Visualization 2', true);
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC71106_10',
            'Datasets Panel for Normal Gird: Visualization 2'
        );

        await since(
            'The grid cell in Normal Grid "Visualization 2" at row 2, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await compoundGridVisualization.getGridCellTextByPosition(2, 2, 'Visualization 2'))
            .toBe('BWI');

        await since(
            'The grid cell in Normal Grid "Visualization 2" at row 3, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await compoundGridVisualization.getGridCellTextByPosition(3, 2, 'Visualization 2'))
            .toBe('77,241.28');
    });

    it('[TC71122_01] Converting to/from Ag-grid - Bar chart', async () => {
        // #Dossier location: New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Convert > TC71122 Different Visualizations
        // When I open dossier by its ID "34E037239F4B7F00216F5B9DF487E3C4"
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridConvert4.project.id,
            dossierId: gridConstants.AGGridConvert4.id,
        });
        // Then The Dossier Editor is displayed

        // # Step 2: change graph to ag-grid
        // When I switch to page "Bar Chart" in chapter "Chapter 1" from contents panel
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Bar Chart',
        });
        // And I change visualization "Visualization 1" to "Grid (Modern)" from context menu
        await baseContainer.changeViz('Grid (Modern)', 'Visualization 1', true);
        // # should have no errors
        // Then the grid cell in ag-grid "Visualization 1" at "1", "0" has text "Jan"
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 0 should be #{expected}, instead it is #{actual}'
        )
            .expect(await reportGridView.getGridCellText(1, 0, 'Visualization 1'))
            .toBe('Jan');
        // And the grid cell in ag-grid "Visualization 1" at "1", "1" has text "20th Century Fox"
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await reportGridView.getGridCellText(1, 1, 'Visualization 1'))
            .toBe('20th Century Fox');
        // And the grid cell in ag-grid "Visualization 1" at "1", "2" has text "$398,708"
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await reportGridView.getGridCellText(1, 2, 'Visualization 1'))
            .toBe('$398,708');
        // And The editor panel should have "metric" named "Cost" on "Columns" section
        await since('The editor panel should have "metric" named "Cost" on "Columns" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Cost', 'metric', 'Columns').isExisting())
            .toBe(true);

        // # change back to bar chart
        // When I change visualization "Visualization 1" to "Vertical Bar Chart" from context menu
        await baseContainer.changeViz('Vertical Bar Chart', 'Visualization 1', true);
        // # should have no errors
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

    it('[TC71122_02] Converting to/from Ag-grid - Map', async () => {
        // #Dossier location: New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Convert > TC71122 Different Visualizations
        // When I open dossier by its ID "34E037239F4B7F00216F5B9DF487E3C4"
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridConvert4.project.id,
            dossierId: gridConstants.AGGridConvert4.id,
        });
        // Then The Dossier Editor is displayed

        // # Step 2: change graph to ag-grid
        // When I switch to page "Map" in chapter "Chapter 1" from contents panel
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Map',
        });
        // And I change visualization "Visualization 1" to "Grid (Modern)" from context menu
        await baseContainer.changeViz('Grid (Modern)', 'Visualization 1', true);
        // # should have no errors - includes Latitude & Longitude forms, but display forms turned off
        // Then the header cell "City" in ag-grid "Visualization 1" is present
        await since('The header cell "City" in ag-grid "Visualization 1" should be present')
            .expect(await agGridVisualization.getGroupHeaderCell('City', 'Visualization 1').isExisting())
            .toBe(true);
        // And the header cell "City Latitude" in ag-grid "Visualization 1" is not present
        await since('The header cell "City Latitude" in ag-grid "Visualization 1" should not be present')
            .expect(await agGridVisualization.getGroupHeaderCell('City@Latitude', 'Visualization 1').isExisting())
            .toBe(false);
        // And the header cell "City Longitude" in ag-grid "Visualization 1" is not present
        await since('The header cell "City Longitude" in ag-grid "Visualization 1" should not be present')
            .expect(await agGridVisualization.getGroupHeaderCell('City@Longitude', 'Visualization 1').isExisting())
            .toBe(false);
        // And the grid cell in ag-grid "Visualization 1" at "1", "0" has text "Annapolis"
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 0 should be #{expected}, instead it is #{actual}'
        )
            .expect(await reportGridView.getGridCellText(1, 0, 'Visualization 1'))
            .toBe('Annapolis');
        // And the grid cell in ag-grid "Visualization 1" at "1", "1" has text "38.9785"
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await reportGridView.getGridCellText(1, 1, 'Visualization 1'))
            .toBe('38.9785');
        // And the grid cell in ag-grid "Visualization 1" at "1", "2" has text "-76.4922"
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await reportGridView.getGridCellText(1, 2, 'Visualization 1'))
            .toBe('-76.4922');
        // And the grid cell in ag-grid "Visualization 1" at "1", "3" has text "$12,310,165"
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await reportGridView.getGridCellText(1, 3, 'Visualization 1'))
            .toBe('$12,310,165');
        // # kept color by from Maps
        // And the grid cell in ag-grid "Visualization 1" at "1", "3" has style "background-color" with value "rgba(34,75,143,1)"
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 3, 'background-color'))
            .toBe('rgba(34,75,143,1)');
        // And The editor panel should have "metric" named "Cost" on "Columns" section
        await since('The editor panel should have "metric" named "Cost" on "Columns" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Cost', 'metric', 'Columns').isExisting())
            .toBe(true);
        // And the grid cell in ag-grid "Visualization 1" at "2", "0" has text "Baltimore"
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 0 should be #{expected}, instead it is #{actual}'
        )
            .expect(await reportGridView.getGridCellText(2, 0, 'Visualization 1'))
            .toBe('Baltimore');
        // And the grid cell in ag-grid "Visualization 1" at "2", "1" has text "39.2904"
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await reportGridView.getGridCellText(2, 1, 'Visualization 1'))
            .toBe('39.2904');
        // And the grid cell in ag-grid "Visualization 1" at "2", "2" has text "-76.6122"
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await reportGridView.getGridCellText(2, 2, 'Visualization 1'))
            .toBe('-76.6122');
        // And the grid cell in ag-grid "Visualization 1" at "2", "3" has text "$20,328,157"
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await reportGridView.getGridCellText(2, 3, 'Visualization 1'))
            .toBe('$20,328,157');
        // # different threshold color
        // And the grid cell in ag-grid "Visualization 1" at "2", "3" has style "background-color" with value "rgba(14,50,112,1)"
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 3, 'background-color'))
            .toBe('rgba(14,50,112,1)');
        // # change back to map
        // When I change visualization "Visualization 1" to "Geospatial Service" from context menu
        await baseContainer.changeViz('Geospatial Service', 'Visualization 1', true);
        // # should have no errors
        // Then The editor panel should have "attribute" named "City" on "Geo Attribute" section
        await since('The editor panel should have "attribute" named "City" on "Geo Attribute" section')
            .expect(await editorPanelForGrid.getObjectFromSection('City', 'attribute', 'Geo Attribute').isExisting())
            .toBe(true);
        // And The editor panel should have "metric" named "Cost" on "Color By" section
        await since('The editor panel should have "metric" named "Cost" on "Color By" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Cost', 'metric', 'Color By').isExisting())
            .toBe(true);
    });

    it('[TC71122_03] Converting to/from Ag-grid - Custom viz Sankey', async () => {
        // #Dossier location: New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Convert > TC71122 Different Visualizations
        // When I open dossier by its ID "34E037239F4B7F00216F5B9DF487E3C4"
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridConvert4.project.id,
            dossierId: gridConstants.AGGridConvert4.id,
        });
        // # Step 2: change KPI to ag-grid
        // When I switch to page "Custom Viz" in chapter "Chapter 1" from contents panel
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Custom Viz',
        });
        // And I change visualization "Visualization 1" to "Grid (Modern)" from context menu
        await baseContainer.changeViz('Grid (Modern)', 'Visualization 1', true);
        // # should have no errors
        // Then the grid cell in ag-grid "Visualization 1" at "1", "0" has text "Jan"
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 0 should be #{expected}, instead it is #{actual}'
        )
            .expect(await reportGridView.getGridCellText(1, 0, 'Visualization 1'))
            .toBe('Jan');
        // And the grid cell in ag-grid "Visualization 1" at "1", "1" has text "20th Century Fox"
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await reportGridView.getGridCellText(1, 1, 'Visualization 1'))
            .toBe('20th Century Fox');
        // And the grid cell in ag-grid "Visualization 1" at "1", "2" has text "$398,708"
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await reportGridView.getGridCellText(1, 2, 'Visualization 1'))
            .toBe('$398,708');
        // And The editor panel should have "metric" named "Cost" on "Columns" section
        await since('The editor panel should have "metric" named "Cost" on "Columns" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Cost', 'metric', 'Columns').isExisting())
            .toBe(true);

        // # change back to Sankey
        // When I change visualization "Visualization 1" to "Sankey Diagram" from context menu
        await baseContainer.changeViz('Sankey Diagram', 'Visualization 1', true);
        // # should have no errors
        // Then The editor panel should have "attribute" named "Month" on "Levels" section
        await since('The editor panel should have "attribute" named "Month" on "Levels" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Month', 'attribute', 'Levels').isExisting())
            .toBe(true);
        // And The editor panel should have "attribute" named "Supplier" on "Levels" section
        await since('The editor panel should have "attribute" named "Supplier" on "Levels" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Supplier', 'attribute', 'Levels').isExisting())
            .toBe(true);
        // And The editor panel should have "metric" named "Cost" on "Metric" section
        await since('The editor panel should have "metric" named "Cost" on "Metric" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Cost', 'metric', 'Metric').isExisting())
            .toBe(true);
    });
});
