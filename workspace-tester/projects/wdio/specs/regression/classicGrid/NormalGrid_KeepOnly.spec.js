import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import * as gridConstants from '../../../constants/grid.js';
import Common from '../../../pageObjects/authoring/Common.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';

const specConfiguration = { ...customCredentials('_sort') };
const { credentials } = specConfiguration;

//npm run regression -- --baseUrl=https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --spec 'specs/regression/classicGrid/NormalGrid_KeepOnly.spec.js'
describe('Keep only/exclude in Grid', () => {
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
        contentsPanel,
        newFormatPanelForGrid,
        baseFormatPanel,
        dossierAuthoringPage,
        libraryAuthoringPage,
        editorPanel,
        toolbar,
        editorPanelForGrid,
        agGridVisualization,
        loginPage,
        thresholdEditor,
        advancedFilter,
    } = browsers.pageObj1;

    it('[TC2270] View Filter (keep only/exclude) in Grid', async () => {
         // Edit dossier by its ID "3641794B414CE689C9B3E291BE003488"
         // New MicroStrategy Tutorials > Shared Reports > Automation Objects > Normal Grid > Normal Grid
         await libraryPage.editDossierByUrl({
             projectId: gridConstants.Grid_KeepOnly.project.id,
             dossierId: gridConstants.Grid_KeepOnly.id,
         });
        // When I keep only the elements "2010" in grid visualization "Normal Grid"
        await vizPanelForGrid.keepOnlyElements('2010', 'Normal Grid');
        await takeScreenshotByElement(vizPanelForGrid.getContainer('Normal Grid'), 'keep only 2010', 'TC2270_01');
        // Then The grid visualization "Normal Grid" should have 12 rows of data
        // And the grid cell in visualization "Normal Grid" at "3", "1" has text "2010"
        // And the grid cell in visualization "Normal Grid" at "1", "3" has text "BWI"

        // When I hover on "Normal Grid" container
        await vizPanelForGrid.hoverOnVisualizationContainer('Normal Grid');
        // And I click on the filter icon
        await advancedFilter.hoverAndClickFilterIcon();
        // Then The view filter indicator displays item 'Clear "Year = 2010"'
        await since('The view filter indicator should display item \'Clear "Year = 2010"\'')
            .expect(await advancedFilter.getVFItem('Clear "Year = 2010"').isExisting())
            .toBe(true);


        // When I right click on the grid cell "DCA, IAD" by off set and select "Keep Only" from visualization "Normal Grid"
        await vizPanelForGrid.openContextMenuItemForGridCellsByOffSet('DCA, IAD', 'Keep Only', 'Normal Grid');
        await takeScreenshotByElement(vizPanelForGrid.getContainer('Normal Grid'), 'keep only DCA IAD', 'TC2270_02');
        // Then The grid visualization "Normal Grid" should have 12 rows of data
        // And the grid cell in visualization "Normal Grid" at "3", "1" has text "2010"
        // And the grid cell in visualization "Normal Grid" at "1", "3" has text "DCA"
        // And the grid cell in visualization "Normal Grid" at "1", "5" has text "IAD"
        // And the grid cell in visualization "Normal Grid" at "6", "2" has text "28,959.84"
        // And the grid cell in visualization "Normal Grid" at "6", "4" has text "9,574.52"
        // And the grid cell in visualization "Normal Grid" at "7", "2" has text "42,043.32"
        // And the grid cell in visualization "Normal Grid" at "7", "4" has text "19,004.07"
        // And The grid visualization "Normal Grid" does not have element "BWI"

        // When I hover on "Normal Grid" container
        await vizPanelForGrid.hoverOnVisualizationContainer('Normal Grid');
        // And I click on the filter icon
        await advancedFilter.hoverAndClickFilterIcon();
        // Then The view filter indicator displays item 'Clear "Year = 2010"'
        await since('The view filter indicator should display item \'Clear "Year = 2010"\'')
            .expect(await advancedFilter.getVFItem('Clear "Year = 2010"').isExisting())
            .toBe(true);
        // And The view filter indicator displays item 'Clear "Origin Airport = DCA OR IAD"'
        await since('The view filter indicator should display item \'Clear "Origin Airport = DCA OR IAD"\'')
            .expect(await advancedFilter.getVFItem('Clear "Origin Airport = DCA OR IAD"').isExisting())
            .toBe(true);

        // When I exclude the elements "28,959.84, 19,004.07" in grid visualization "Normal Grid"
        await vizPanelForGrid.excludeElements('28,959.84, 19,004.07', 'Normal Grid');
        await takeScreenshotByElement(vizPanelForGrid.getContainer('Normal Grid'), 'exclude 28959.84 19004.07', 'TC2270_03');
        // Then The grid visualization "Normal Grid" should have 12 rows of data
        // And the grid cell in visualization "Normal Grid" at "3", "1" has text "2010"
        // And the grid cell in visualization "Normal Grid" at "1", "3" has text "DCA"
        // And the grid cell in visualization "Normal Grid" at "1", "5" has text "IAD"
        // And the grid cell in visualization "Normal Grid" at "6", "4" has text "9,574.52"
        // And the grid cell in visualization "Normal Grid" at "7", "2" has text "42,043.32"
        // And The grid visualization "Normal Grid" does not have element "28,959.84"
        // And The grid visualization "Normal Grid" does not have element "19,004.07"

        // When I hover on "Normal Grid" container
        await vizPanelForGrid.hoverOnVisualizationContainer('Normal Grid');
        // And I click on the filter icon
        await advancedFilter.hoverAndClickFilterIcon();
        // Then The view filter indicator displays item 'Clear "Year = 2010"'
        await since('The view filter indicator should display item \'Clear "Year = 2010"\'')
            .expect(await advancedFilter.getVFItem('Clear "Year = 2010"').isExisting())
            .toBe(true);
        // And The view filter indicator displays item 'Clear "Origin Airport = DCA OR IAD"'
        await since('The view filter indicator should display item \'Clear "Origin Airport = DCA OR IAD"\'')
            .expect(await advancedFilter.getVFItem('Clear "Origin Airport = DCA OR IAD"').isExisting())
            .toBe(true);
        // And The view filter indicator displays item 'Clear "Not Airline Name = Comair Inc. Year = 2010 Origin Airport = DCA OR Airline Name = Delta Air Lines Inc. Year = 2010 Origin Airport = IAD"'
        await since('The view filter indicator should display item \'Clear "Not Airline Name = Comair Inc. Year = 2010 Origin Airport = DCA OR Airline Name = Delta Air Lines Inc. Year = 2010 Origin Airport = IAD"\'')
            .expect(await advancedFilter.getVFItem('Clear "Not Airline Name = Comair Inc. Year = 2010 Origin Airport = DCA OR Airline Name = Delta Air Lines Inc. Year = 2010 Origin Airport = IAD"').isExisting())
            .toBe(true);

        // When I switch to page "Compound Grid" in chapter "Chapter 1" from contents panel
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Compound Grid' });
        // When I keep only the elements "2010" in grid visualization "Compound Grid"
        await vizPanelForGrid.keepOnlyElements('2010', 'Compound Grid');
        await takeScreenshotByElement(vizPanelForGrid.getContainer('Compound Grid'), 'keep only 2010', 'TC2270_04');
        // Then The grid visualization "Compound Grid" should have 12 rows of data
        // And the grid cell in visualization "Compound Grid" at "3", "1" has text "2010"
        // And the grid cell in visualization "Compound Grid" at "1", "4" has text "BWI"

        // When I hover on "Compound Grid" container
        await vizPanelForGrid.hoverOnVisualizationContainer('Compound Grid');
        // And I click on the filter icon
        await advancedFilter.hoverAndClickFilterIcon();
        // Then The view filter indicator displays item 'Clear "Year = 2010"'
        await since('The view filter indicator should display item \'Clear "Year = 2010"\'')
            .expect(await advancedFilter.getVFItem('Clear "Year = 2010"').isExisting())
            .toBe(true);
    
        // When I right click on the grid cell "DCA, IAD" by off set and select "Keep Only" from visualization "Compound Grid"
        await vizPanelForGrid.openContextMenuItemForGridCellsByOffSet('DCA, IAD', 'Keep Only', 'Compound Grid');
        await takeScreenshotByElement(vizPanelForGrid.getContainer('Compound Grid'), 'keep only DCA IAD', 'TC2270_05');
        // Then The grid visualization "Compound Grid" should have 12 rows of data
        // And the grid cell in visualization "Compound Grid" at "3", "1" has text "2010"
        // And the grid cell in visualization "Compound Grid" at "1", "4" has text "DCA"
        // And the grid cell in visualization "Compound Grid" at "1", "5" has text "IAD"
        // And the grid cell in visualization "Compound Grid" at "6", "2" has text "38,534.36"
        // And the grid cell in visualization "Compound Grid" at "6", "3" has text "407"
        // And the grid cell in visualization "Compound Grid" at "7", "2" has text "61,047.39"
        // And the grid cell in visualization "Compound Grid" at "7", "4" has text "116"
        // And The grid visualization "Compound Grid" does not have element "BWI"

        // When I hover on "Compound Grid" container
        await vizPanelForGrid.hoverOnVisualizationContainer('Compound Grid');
        // And I click on the filter icon
        await advancedFilter.hoverAndClickFilterIcon();
        // Then The view filter indicator displays item 'Clear "Year = 2010"'
        await since('The view filter indicator should display item \'Clear "Year = 2010"\'')
            .expect(await advancedFilter.getVFItem('Clear "Year = 2010"').isExisting())
            .toBe(true);
        // And The view filter indicator displays item 'Clear "Origin Airport = DCA OR IAD"'
        await since('The view filter indicator should display item \'Clear "Origin Airport = DCA OR IAD"\'')
            .expect(await advancedFilter.getVFItem('Clear "Origin Airport = DCA OR IAD"').isExisting())
            .toBe(true);

        // When I exclude the elements "407, 116" in grid visualization "Compound Grid"
        await vizPanelForGrid.excludeElements('407, 116', 'Compound Grid');
        await takeScreenshotByElement(vizPanelForGrid.getContainer('Compound Grid'), 'exclude 407 116', 'TC2270_06');
        // Then The grid visualization "Compound Grid" should have 12 rows of data
        // And the grid cell in visualization "Compound Grid" at "3", "1" has text "2010"
        // And the grid cell in visualization "Compound Grid" at "1", "4" has text "DCA"
        // And the grid cell in visualization "Compound Grid" at "1", "5" has text "IAD"
        // And the grid cell in visualization "Compound Grid" at "6", "2" has text "9,574.52"
        // And the grid cell in visualization "Compound Grid" at "7", "2" has text "42,043.32"
        // And The grid visualization "Compound Grid" does not have element "407"
        // And The grid visualization "Compound Grid" does not have element "116"

        // When I hover on "Compound Grid" container
        await vizPanelForGrid.hoverOnVisualizationContainer('Compound Grid');
        // And I click on the filter icon
        await advancedFilter.hoverAndClickFilterIcon();
        // Then The view filter indicator displays item 'Clear "Year = 2010"'
        await since('The view filter indicator should display item \'Clear "Year = 2010"\'')
            .expect(await advancedFilter.getVFItem('Clear "Year = 2010"').isExisting())
            .toBe(true);
        // And The view filter indicator displays item 'Clear "Origin Airport = DCA OR IAD"'
        await since('The view filter indicator should display item \'Clear "Origin Airport = DCA OR IAD"\'')
            .expect(await advancedFilter.getVFItem('Clear "Origin Airport = DCA OR IAD"').isExisting())
            .toBe(true);
        // And The view filter indicator displays item 'Clear "Not Airline Name = Comair Inc. Year = 2010 Origin Airport = DCA OR Airline Name = Delta Air Lines Inc. Year = 2010 Origin Airport = IAD"'
        await since('The view filter indicator should display item \'Clear "Not Airline Name = Comair Inc. Year = 2010 Origin Airport = DCA OR Airline Name = Delta Air Lines Inc. Year = 2010 Origin Airport = IAD"\'')
            .expect(await advancedFilter.getVFItem('Clear "Not Airline Name = Comair Inc. Year = 2010 Origin Airport = DCA OR Airline Name = Delta Air Lines Inc. Year = 2010 Origin Airport = IAD"').isExisting())
            .toBe(true);

        // When I switch to page "AG Grid" in chapter "Chapter 1" from contents panel
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'AG Grid' });
        // When I right click on value "2010" and select "Keep Only" from ag-grid "AG Grid"
        await agGridVisualization.openContextMenuItemForValue('2010', 'Keep Only', 'AG Grid');
        // Then the grid cell in ag-grid "AG Grid" at "2", "0" has text "2010"
        await since('the grid cell in ag-grid "AG Grid" at "2", "0" has text "2010"')
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'AG Grid'))
            .toBe('2010');
        // And the grid cell in ag-grid "AG Grid" at "0", "3" has text "BWI"
        await since('the grid cell in ag-grid "AG Grid" at "0", "3" has text "BWI"')
            .expect(await agGridVisualization.getGridCellTextByPos(0, 3, 'AG Grid'))
            .toBe('BWI');

        // When I hover on "AG Grid" container
        await agGridVisualization.hoverOnVisualizationContainer('AG Grid');
        // And I click on the filter icon
        await advancedFilter.hoverAndClickFilterIcon();
        // Then The view filter indicator displays item 'Clear "Year = 2010"'
        await since('The view filter indicator should display item \'Clear "Year = 2010"\'')
            .expect(await advancedFilter.getVFItem('Clear "Year = 2010"').isExisting())
            .toBe(true);
    
        // When I right click on elements "DCA, IAD" and select "Keep Only" from ag-grid "AG Grid"
        await agGridVisualization.openContextMenuItemForHeaders('DCA, IAD', 'Keep Only', 'AG Grid');  
        // Then the grid cell in ag-grid "AG Grid" at "2", "0" has text "2010"
        await since('the grid cell in ag-grid "AG Grid" at "2", "0" has text "2010"')
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'AG Grid'))
            .toBe('2010');
        // And the grid cell in ag-grid "AG Grid" at "0", "3" has text "DCA"
        await since('the grid cell in ag-grid "AG Grid" at "0", "3" has text "DCA"')
            .expect(await agGridVisualization.getGridCellTextByPos(0, 3, 'AG Grid'))
            .toBe('DCA');
        // And the grid cell in ag-grid "AG Grid" at "0", "4" has text "IAD"
        await since('the grid cell in ag-grid "AG Grid" at "0", "4" has text "IAD"')
            .expect(await agGridVisualization.getGridCellTextByPos(0, 4, 'AG Grid'))
            .toBe('IAD');
        // And the grid cell in ag-grid "AG Grid" at "5", "2" has text "38,534.36"
        await since('the grid cell in ag-grid "AG Grid" at "5", "2" has text "38,534.36"')
            .expect(await agGridVisualization.getGridCellTextByPos(5, 2, 'AG Grid'))
            .toBe('38,534.36');
        // And the grid cell in ag-grid "AG Grid" at "5", "3" has text "407"
        await since('the grid cell in ag-grid "AG Grid" at "5", "3" has text "407"')
            .expect(await agGridVisualization.getGridCellTextByPos(5, 3, 'AG Grid'))
            .toBe('407');
        // And the grid cell in ag-grid "AG Grid" at "6", "2" has text "61,047.39"
        await since('the grid cell in ag-grid "AG Grid" at "6", "2" has text "61,047.39"')
            .expect(await agGridVisualization.getGridCellTextByPos(6, 2, 'AG Grid'))
            .toBe('61,047.39');
        // And the grid cell in ag-grid "AG Grid" at "6", "4" has text "116"
        await since('the grid cell in ag-grid "AG Grid" at "6", "4" has text "116"')
            .expect(await agGridVisualization.getGridCellTextByPos(6, 4, 'AG Grid'))
            .toBe('116');

        // When I hover on "AG Grid" container
        await agGridVisualization.hoverOnVisualizationContainer('AG Grid');
        // And I click on the filter icon
        await advancedFilter.hoverAndClickFilterIcon();
        // Then The view filter indicator displays item 'Clear "Year = 2010"'
        await since('The view filter indicator should display item \'Clear "Year = 2010"\'')
            .expect(await advancedFilter.getVFItem('Clear "Year = 2010"').isExisting())
            .toBe(true);
        // And The view filter indicator displays item 'Clear "Origin Airport = DCA OR IAD"'
        await since('The view filter indicator should display item \'Clear "Origin Airport = DCA OR IAD"\'')
            .expect(await advancedFilter.getVFItem('Clear "Origin Airport = DCA OR IAD"').isExisting())
            .toBe(true);

        // When I right click on values "407, 116" and select "Exclude" from ag-grid "AG Grid"
        await agGridVisualization.openContextMenuItemForValues('407, 116', 'Exclude', 'AG Grid');
        // Then the grid cell in ag-grid "AG Grid" at "2", "0" has text "2010"
        await since('the grid cell in ag-grid "AG Grid" at "2", "0" has text "2010"')
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'AG Grid'))
            .toBe('2010');
        // And the grid cell in ag-grid "AG Grid" at "0", "3" has text "DCA"
        await since('the grid cell in ag-grid "AG Grid" at "0", "3" has text "DCA"')
            .expect(await agGridVisualization.getGridCellTextByPos(0, 3, 'AG Grid'))
            .toBe('DCA');
        // And the grid cell in ag-grid "AG Grid" at "0", "4" has text "IAD"
        await since('the grid cell in ag-grid "AG Grid" at "0", "4" has text "IAD"')
            .expect(await agGridVisualization.getGridCellTextByPos(0, 4, 'AG Grid'))
            .toBe('IAD');
        // And the grid cell in ag-grid "AG Grid" at "5", "2" has text "9,574.52"
        await since('the grid cell in ag-grid "AG Grid" at "5", "2" has text "9,574.52"')
            .expect(await agGridVisualization.getGridCellTextByPos(5, 2, 'AG Grid'))
            .toBe('9,574.52');
        // And the grid cell in ag-grid "AG Grid" at "6", "2" has text "42,043.32"
        await since('the grid cell in ag-grid "AG Grid" at "6", "2" has text "42,043.32"')
            .expect(await agGridVisualization.getGridCellTextByPos(6, 2, 'AG Grid'))
            .toBe('42,043.32');

        // When I hover on "AG Grid" container
        await agGridVisualization.hoverOnVisualizationContainer('AG Grid');
        // And I click on the filter icon
        await advancedFilter.hoverAndClickFilterIcon();
        // Then The view filter indicator displays item 'Clear "Year = 2010"'
        await since('The view filter indicator should display item \'Clear "Year = 2010"\'')
            .expect(await advancedFilter.getVFItem('Clear "Year = 2010"').isExisting())
            .toBe(true);
        // And The view filter indicator displays item 'Clear "Origin Airport = DCA OR IAD"'
        await since('The view filter indicator should display item \'Clear "Origin Airport = DCA OR IAD"\'')
            .expect(await advancedFilter.getVFItem('Clear "Origin Airport = DCA OR IAD"').isExisting())
            .toBe(true);
        // And The view filter indicator displays item 'Clear "Not Airline Name = Comair Inc. Year = 2010 Origin Airport = DCA OR Airline Name = Delta Air Lines Inc. Year = 2010 Origin Airport = IAD"'
        await since('The view filter indicator should display item \'Clear "Not Airline Name = Comair Inc. Year = 2010 Origin Airport = DCA OR Airline Name = Delta Air Lines Inc. Year = 2010 Origin Airport = IAD"\'')
            .expect(await advancedFilter.getVFItem('Clear "Not Airline Name = Comair Inc. Year = 2010 Origin Airport = DCA OR Airline Name = Delta Air Lines Inc. Year = 2010 Origin Airport = IAD"').isExisting())
            .toBe(true);

    });
});
