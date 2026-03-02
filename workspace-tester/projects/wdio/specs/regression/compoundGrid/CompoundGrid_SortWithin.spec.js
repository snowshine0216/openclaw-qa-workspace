import * as gridConstants from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('Compound Grid Sort Within', () => {
    let { loginPage, libraryPage, gridAuthoring, ngmEditorPanel, datasetsPanel, editorPanelForGrid, vizPanelForGrid, contentsPanel, loadingDialog, toolbar, baseVisualization } = browsers.pageObj1;

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

    it('[TC6514_01] Validate Sort Within (Default) sorting on metrics in Drop Zone', async () => {
        const viz2 = 'Visualization 2';
        const flightsDelayed = 'Flights Delayed';
        const flightsCancelled = 'Flights Cancelled';
        const airlineName = 'Airline Name';
        const dayOfWeek = 'Day of Week';

        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.ACCompoundGridSort.id,
            projectId: gridConstants.ACCompoundGridSort.project.id,
        });
        await gridAuthoring.clickOnContainerTitle(viz2);
        await gridAuthoring.clickOnMaximizeRestoreButton(viz2);
        await editorPanelForGrid.showTotal(); //enable totals
        await browser.pause(1000);
        await gridAuthoring.sortOperations.sortWithinAttributeFromDropZone({
            objectName: flightsDelayed,
            sortAttr: airlineName,
        });
        await since(
            `The grid cell in visualization "${viz2}" at "2", "1" should have text #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 1, viz2))
            .toBe('Total');
        await since(
            `The grid cell in visualization "${viz2}" at "4", "2" should have text #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(4, 2, viz2))
            .toBe('July');
        await since(
            `The grid cell in visualization "${viz2}" at "7", "4" should have text #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(7, 4, viz2))
            .toBe('311');
        await since(
            `The grid cell in visualization "${viz2}" at "12", "5" should have text #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(12, 5, viz2))
            .toBe('611');
        await gridAuthoring.sortOperations.sortWithinAttributeFromDropZone({
            objectName: flightsDelayed,
            sortAttr: dayOfWeek,
        });

        await editorPanelForGrid.showTotal(); //disable totals
        await browser.pause(1000);
        await since(
            `The grid cell in visualization "${viz2}" at "2", "2" should have text #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 2, viz2))
            .toBe('Sunday');
        await since(
            `The grid cell in visualization "${viz2}" at "2", "3" should have text #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 3, viz2))
            .toBe('January');
        await since(
            `The grid cell in visualization "${viz2}" at "5", "3" should have text #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(5, 3, viz2))
            .toBe('227');
        await gridAuthoring.sortOperations.sortAscendingFromDropZone(flightsDelayed);
        await since(
            `The grid cell in visualization "${viz2}" at "10", "1" should have text #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(10, 1, viz2))
            .toBe('December');
        await since(
            `The grid cell in visualization "${viz2}" at "5", "4" should have text #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(5, 4, viz2))
            .toBe('578');
        await since(
            `The grid cell in visualization "${viz2}" at "5", "3" should have text #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(5, 3, viz2))
            .toBe('145');
        await gridAuthoring.sortOperations.clearSortFromDropZone(flightsDelayed);
        await browser.pause(2000);
        await since(
            `The grid cell in visualization "${viz2}" at "3", "1" should have text #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 1, viz2))
            .toBe('February');
        await since(
            `The grid cell in visualization "${viz2}" at "8", "4" should have text #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(8, 4, viz2))
            .toBe('539');
        await since(
            `The grid cell in visualization "${viz2}" at "5", "2" should have text #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(5, 2, viz2))
            .toBe('2');
        await editorPanelForGrid.showTotal(); //enable totals
        await browser.pause(1000);
        await gridAuthoring.sortOperations.sortWithinAttributeFromDropZone({
            objectName: flightsCancelled,
            sortAttr: airlineName,
        });
        await since(
            `Grid cell in visualization "${viz2}" at "3", "2" should have text #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 2, viz2))
            .toBe('Total');
        await since(
            `Grid cell in visualization "${viz2}" at "5", "2" should have text #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(5, 2, viz2))
            .toBe('February');
        await since(
            `Grid cell in visualization "${viz2}" at "6", "3" should have text #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(6, 3, viz2))
            .toBe('58');
        await since(
            `Grid cell in visualization "${viz2}" at "7", "5" should have text #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(7, 5, viz2))
            .toBe('450');
        await ngmEditorPanel.removeObjectFromDropZone(flightsCancelled, 'Column Set 1');
        await browser.pause(1000);
        await since(
            `Grid cell in visualization "${viz2}" at "3", "2" should have text #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 2, viz2))
            .toBe('Total');
        await since(
            `Grid cell in visualization "${viz2}" at "4", "4" should have text #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(4, 4, viz2))
            .toBe('117');
    });

    it('[TC6514_02] Validate Sort Within (Default) sorting on metrics in grid', async () => {
        const viz1 = 'Visualization 1';
        const avgDelay = 'Avg Delay (min)';
        const flightsCancelled = 'Flights Cancelled';
        const sortWithinDefault = 'Sort Within (Default)';
        const airlineName = 'Airline Name';
        const originAirport = 'Origin Airport';

        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.ACCompoundGridSort.id,
            projectId: gridConstants.ACCompoundGridSort.project.id,
        });

        await gridAuthoring.sortOperations.sortWithinAttributeFromDropZone({
            objectName: avgDelay,
            sortAttr: airlineName,
        });

        await since(
            `The grid cell in visualization "${viz1}" at "3", "1" should have text #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 1, viz1))
            .toBe('AirTran Airways Corporation');
        await since(
            `The grid cell in visualization "${viz1}" at "5", "1" should have text #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(5, 1, viz1))
            .toBe('Friday');
        await since(
            `The grid cell in visualization "${viz1}" at "5", "2" should have text #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(5, 2, viz1))
            .toBe('20,736.90');
        await since(
            `The grid cell in visualization "${viz1}" at "10", "5" should have text #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(10, 5, viz1))
            .toBe('1484');

        await datasetsPanel.addObjectToVizByDoubleClick(originAirport, 'attribute', 'Airline sample dataset');

        await gridAuthoring.sortOperations.sortWithinAttributeFromDropZone({
            objectName: avgDelay,
            sortAttr: originAirport,
        });

        await since(
            `Grid cell in visualization "${viz1}" at "3", "2" should have #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 2, viz1))
            .toBe('BWI');
        await since(
            `Grid cell in visualization "${viz1}" at "3", "3" should have #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 3, viz1))
            .toBe('Thursday');
        await since(
            `Grid cell in visualization "${viz1}" at "3", "4" should have #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 4, viz1))
            .toBe('12,029.99');

        await gridAuthoring.sortOperations.sortAscendingFromViz({
            objectName: avgDelay,
            visualizationName: viz1,
        });

        await since(
            `Grid cell in visualization "${viz1}" at "3", "2" should have #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 2, viz1))
            .toBe('BWI');
        await since(
            `Grid cell in visualization "${viz1}" at "3", "3" should have #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 3, viz1))
            .toBe('Saturday');
        await since(
            `Grid cell in visualization "${viz1}" at "3", "4" should have #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 4, viz1))
            .toBe('9,402.61');

        await gridAuthoring.contextMenuOperations.rightClickOnHeader(avgDelay, viz1);
        await gridAuthoring.contextMenuOperations.selectContextMenuOptionFromHeader({
            objectName: avgDelay,
            option: sortWithinDefault,
            visualizationName: viz1,
        });

        await since(
            `Grid cell in visualization "${viz1}" at "3", "2" should have #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 2, viz1))
            .toBe('BWI');
        await since(
            `Grid cell in visualization "${viz1}" at "3", "3" should have #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 3, viz1))
            .toBe('Saturday');
        await since(
            `Grid cell in visualization "${viz1}" at "3", "4" should have #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 4, viz1))
            .toBe('9,402.61');

        await editorPanelForGrid.showTotal();

        // await gridAuthoring.contextMenuOperations.selectContextSubMenuOptionFromHeader({
        //     visualizationName: viz1,
        //     objectName: flightsCancelled,
        //     menuOptions: ['Sort Within an Attribute', airlineName],
        // });

        await gridAuthoring.sortOperations.sortWithinAttributeFromDropZone({
            objectName: flightsCancelled,
            sortAttr: airlineName,
        });

        await since(
            `Grid cell in visualization "${viz1}" at "4", "2" should have #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(4, 2, viz1))
            .toBe('Total');
        await since(
            `Grid cell in visualization "${viz1}" at "8", "2" should have #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(8, 2, viz1))
            .toBe('Wednesday');
        await since(
            `Grid cell in visualization "${viz1}" at "10", "2" should have #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(10, 2, viz1))
            .toBe('11,742.54');
        await since(
            `Grid cell in visualization "${viz1}" at "10", "4" should have #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(10, 4, viz1))
            .toBe('1513');

        await editorPanelForGrid.removeObjectInColumnSet(flightsCancelled, 'Column Set 1');

        await since(
            `Grid cell in visualization "${viz1}" at "4", "4" should have #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(4, 4, viz1))
            .toBe('141,050.01');
        await since(
            `Grid cell in visualization "${viz1}" at "5", "2" should have #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(5, 2, viz1))
            .toBe('Total');
    });

    it('[TC41276_01] Compound Grid sort', async () => {
        //    #execute dossier AC_Compound Grid Sort
        //     #regular compound grid steps
        //     When I open dossier by its ID "245DBA5711EAF71100670080EF456284"
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.AGGridSort.id,
            projectId: gridConstants.AGGridSort.project.id,
        });
        //     Then the grid cell in visualization "Visualization 1" at "10", "1" has text "American Airlines Inc."
        await since(
                `The grid cell in visualization "Visualization 1" at "10", "1" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(10, 1, 'Visualization 1'))
            .toBe('American Airlines Inc.');
        //     And the grid cell in visualization "Visualization 1" at "3", "3" has text "20,500.02"
        await since(
                `The grid cell in visualization "Visualization 1" at "3", "3" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 3, 'Visualization 1'))
            .toBe('20,500.02');
        //        #step 2
        //     When I sort the attribute "Airline Name" in descending order from grid visualization "Visualization 1"
        await vizPanelForGrid.sortDescending('Airline Name', 'Visualization 1', 'desc');
        //     Then the grid cell in visualization "Visualization 1" at "3", "1" has text "US Airways Inc."
        await since(
                `The grid cell in visualization "Visualization 1" at "3", "1" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('US Airways Inc.');
        //     And the grid cell in visualization "Visualization 1" at "3", "3" has text "12,695.38"
        await since(
                `The grid cell in visualization "Visualization 1" at "3", "3" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 3, 'Visualization 1'))
            .toBe('12,695.38');
            
        //        #step3
        //     When I sort the attribute "Day of Week" in descending order from grid visualization "Visualization 1" 
        await vizPanelForGrid.sortDescending('Day of Week', 'Visualization 1', 'desc');
        //     Then the grid cell in visualization "Visualization 1" at "6", "3" has text "10,361.17"
        await since(
                `The grid cell in visualization "Visualization 1" at "6", "3" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(6, 3, 'Visualization 1'))
            .toBe('10,361.17');
        //     Then the grid cell in visualization "Visualization 1" at "3", "2" has text "Saturday"
        await since(
                `The grid cell in visualization "Visualization 1" at "3", "2" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('Saturday');
        //        #step4/5
        //     When I sort the "metric" named "Avg Delay (min)" in "Sort All Values" in Editor Panel
        await editorPanelForGrid.simpleSort('Avg Delay (min)','Sort All Values');
        //     Then the grid cell in visualization "Visualization 1" at "3", "3" has text "28,020.41"
        await since(
                `The grid cell in visualization "Visualization 1" at "3", "3" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 3, 'Visualization 1'))
            .toBe('28,020.41');
        //     When I sort the "metric" named "Flights Cancelled" in "Sort Within (Default)" in Editor Panel
        await editorPanelForGrid.simpleSort('Flights Cancelled', 'Sort Within (Default)');
        //     Then the grid cell in visualization "Visualization 1" at "3", "4" has text "160"
        await since(
                `The grid cell in visualization "Visualization 1" at "3", "4" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 4, 'Visualization 1'))
            .toBe('160');
        //     Then the grid cell in visualization "Visualization 1" at "3", "2" has text "Saturday"
        await since(
                `The grid cell in visualization "Visualization 1" at "3", "2" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('Saturday');
            
        //        #step 6/7
        //     When I sort the "attribute" named "Year" in "Sort Descending" in Editor Panel
        await editorPanelForGrid.simpleSort('Year', 'Sort Descending');
        //     Then the grid cell in visualization "Visualization 1" at "1", "5" has text "2011"
        await since(
                `The grid cell in visualization "Visualization 1" at "1", "5" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(1, 5, 'Visualization 1'))
            .toBe('2011');
        
        //        #step 8
        //     When I right click on element "On-Time" and select "Sort All Values" from visualization "Visualization 1"
        await vizPanelForGrid.selectContextMenuOptionFromElement('On-Time', 'Sort All Values', 'Visualization 1');
        //     Then the grid cell in visualization "Visualization 1" at "3", "1" has text "Southwest Airlines Co."
        await since(
                `The grid cell in visualization "Visualization 1" at "3", "1" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Southwest Airlines Co.');
        //     Then the grid cell in visualization "Visualization 1" at "3", "5" has text "413"
        await since(
                `The grid cell in visualization "Visualization 1" at "3", "5" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 5, 'Visualization 1'))
            .toBe('413');
        //         #step 9
        //     When I toggle Show Totals of metric "Avg Delay (min)" on grid visualization "Visualization 1"
        await vizPanelForGrid.toggleShowTotalsFromMetric('Avg Delay (min)', 'Visualization 1');
        //     Then the grid cell in visualization "Visualization 1" at "3", "1" has text "Total"
        await since(
                `The grid cell in visualization "Visualization 1" at "3", "1" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Total');
        //     Then the grid cell in visualization "Visualization 1" at "3", "3" has text "1,219,500.57"
        await since(
                `The grid cell in visualization "Visualization 1" at "3", "3" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 3, 'Visualization 1'))
            .toBe('1,219,500.57');
        //         #step 10
        //     When I right click on element "Flights Cancelled" and select "Sort Within (Default)" from visualization "Visualization 1"
        await vizPanelForGrid.selectContextMenuOptionFromElement('Flights Cancelled', 'Sort Within (Default)', 'Visualization 1');
        //     Then the grid cell in visualization "Visualization 1" at "12", "2" has text "Total"
        await since(
                `The grid cell in visualization "Visualization 1" at "12", "2" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(12, 2, 'Visualization 1'))
            .toBe('Total');
        //     Then the grid cell in visualization "Visualization 1" at "7", "3" has text "133"
        await since(
                `The grid cell in visualization "Visualization 1" at "7", "3" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(7, 3, 'Visualization 1'))
            .toBe('133');
        //     Then the grid cell in visualization "Visualization 1" at "4", "1" has text "AirTran Airways Corporation"
        await since(
                `The grid cell in visualization "Visualization 1" at "4", "1" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(4, 1, 'Visualization 1'))
            .toBe('AirTran Airways Corporation');

        //     #Metrics in rows compound grid
        //     #this section also covers most steps related to TC75310
        //     When I switch to page "Page 2" in chapter "Chapter 1" from contents panel
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        //     Then the grid cell in visualization "Visualization 1" at "4", "1" has text "Number of Flights"
        await since(
                `The grid cell in visualization "Visualization 1" at "4", "1" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(4, 1, 'Visualization 1'))
            .toBe('Number of Flights');
        //     And the grid cell in visualization "Visualization 1" at "1", "11" has text "Sunday"
        await since(
                `The grid cell in visualization "Visualization 1" at "1", "11" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(1, 11, 'Visualization 1'))
            .toBe('Sunday');
        //     And the grid cell in visualization "Visualization 1" at "3", "3" has text "1813"
        await since(
                `The grid cell in visualization "Visualization 1" at "3", "3" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 3, 'Visualization 1'))
            .toBe('1813');
        //         #step10
        //     When I sort the "metric" named "Flights Cancelled" in "Sort Within (Default)" in Editor Panel
        await editorPanelForGrid.simpleSort('Flights Cancelled', 'Sort Within (Default)');
        //     Then the grid cell in visualization "Visualization 1" at "4", "1" has text "Number of Flights"
        await since(
                `The grid cell in visualization "Visualization 1" at "4", "1" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(4, 1, 'Visualization 1'))
            .toBe('Number of Flights');
        //     And the grid cell in visualization "Visualization 1" at "1", "11" has text "Wednesday"
        await since(
                `The grid cell in visualization "Visualization 1" at "1", "11" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(1, 11, 'Visualization 1'))
            .toBe('Wednesday');
        //     And the grid cell in visualization "Visualization 1" at "3", "3" has text "1148"
        await since(
                `The grid cell in visualization "Visualization 1" at "3", "3" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 3, 'Visualization 1'))
            .toBe('1148');
        //         #step 11 
        //     When I sort the "metric" named "Number of Flights" in "Sort All Values" in Editor Panel
        await editorPanelForGrid.simpleSort('Number of Flights', 'Sort All Values');
        //     Then the grid cell in visualization "Visualization 1" at "4", "1" has text "Number of Flights"
        await since(
                `The grid cell in visualization "Visualization 1" at "4", "1" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(4, 1, 'Visualization 1'))
            .toBe('Number of Flights');
        //     And the grid cell in visualization "Visualization 1" at "1", "11" has text "Monday"
        await since(
                `The grid cell in visualization "Visualization 1" at "1", "11" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(1, 11, 'Visualization 1'))
            .toBe('Monday');
        //     And the grid cell in visualization "Visualization 1" at "3", "3" has text "991"
        await since(
                `The grid cell in visualization "Visualization 1" at "3", "3" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 3, 'Visualization 1'))
            .toBe('991');
        //     And the grid cell in visualization "Visualization 1" at "3", "11" has text "1551"
        await since(
                `The grid cell in visualization "Visualization 1" at "3", "11" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 11, 'Visualization 1'))
            .toBe('1551');
        //         #step 12
        //     When I sort the "attribute" named "Year" in "Sort Ascending" in Editor Panel
        await editorPanelForGrid.simpleSort('Year', 'Sort Ascending');
        //     Then the grid cell in visualization "Visualization 1" at "1", "2" has text "2009"
        await since(
                `The grid cell in visualization "Visualization 1" at "1", "2" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(1, 2, 'Visualization 1'))
            .toBe('2009');
        //     And the grid cell in visualization "Visualization 1" at "5", "2" has text "56464"
        await since(
                `The grid cell in visualization "Visualization 1" at "5", "2" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(5, 2, 'Visualization 1'))
            .toBe('56464');
        //     And the grid cell in visualization "Visualization 1" at "1", "11" has text "Monday"
        await since(
                `The grid cell in visualization "Visualization 1" at "1", "11" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(1, 11, 'Visualization 1'))
            .toBe('Monday');
        //         #step 13
        //     When I sort the "metric" named "On-Time" in "Sort All Values" in Editor Panel
        await editorPanelForGrid.simpleSort('On-Time', 'Sort All Values');
        //     Then the grid cell in visualization "Visualization 1" at "4", "1" has text "Number of Flights"
        await since(
                `The grid cell in visualization "Visualization 1" at "4", "1" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(4, 1, 'Visualization 1'))
            .toBe('Number of Flights');
        //     And the grid cell in visualization "Visualization 1" at "1", "11" has text "Tuesday"
        await since(
                `The grid cell in visualization "Visualization 1" at "1", "11" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(1, 11, 'Visualization 1'))
            .toBe('Tuesday');
        //     And the grid cell in visualization "Visualization 1" at "5", "2" has text "61219"
        await since(
                `The grid cell in visualization "Visualization 1" at "5", "2" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(5, 2, 'Visualization 1'))
            .toBe('61219');
        //     And the grid cell in visualization "Visualization 1" at "5", "17" has text "37982"
        await since(
                `The grid cell in visualization "Visualization 1" at "5", "17" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(5, 17, 'Visualization 1'))
            .toBe('37982');
        //         #step 14
        //     When I click on column set "Column Set 1" in Columns section    
        await vizPanelForGrid.clickOnColumnSet('Column Set 1');
        //     And I add a column set for the compound grid
        await vizPanelForGrid.addColumnSet();
        //     And I drag "attribute" named "Airline Name" from dataset "Airline sample dataset" to Column Set "Column Set 3" in compound grid
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ('Airline Name', 'attribute', 'Airline sample dataset', 'Column Set 3');
        //     Then the grid cell in visualization "Visualization 1" at "1", "11" has text "Tuesday"
        await since(
                `The grid cell in visualization "Visualization 1" at "1", "11" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(1, 11, 'Visualization 1'))
            .toBe('Tuesday');
        //     And the grid cell in visualization "Visualization 1" at "1", "27" has text "Comair Inc."
        await since(
                `The grid cell in visualization "Visualization 1" at "1", "27" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(1, 27, 'Visualization 1'))
            .toBe('Comair Inc.');
        //     And the grid cell in visualization "Visualization 1" at "5", "25" has text "15359"
        await since(
                `The grid cell in visualization "Visualization 1" at "5", "25" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(5, 25, 'Visualization 1'))
            .toBe('15359');
        //     And the grid cell in visualization "Visualization 1" at "5", "18" has text "71243"
        await since(
                `The grid cell in visualization "Visualization 1" at "5", "18" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(5, 18, 'Visualization 1'))
            .toBe('71243');
        //         #step 15
        //     When I right click on element "On-Time" and select "Show Totals" from visualization "Visualization 1"
        await vizPanelForGrid.toggleShowTotalsFromMetric('On-Time', 'Visualization 1');
        //     Then the grid cell in visualization "Visualization 1" at "1", "11" has text "Total"
        await since(
                `The grid cell in visualization "Visualization 1" at "1", "11" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(1, 11, 'Visualization 1'))
            .toBe('Total');
        //     And the grid cell in visualization "Visualization 1" at "3", "11" has text "11776"
        await since(
                `The grid cell in visualization "Visualization 1" at "3", "11" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 11, 'Visualization 1'))
            .toBe('11776');
        //     And the grid cell in visualization "Visualization 1" at "5", "2" has text "61219"
        await since(
                `The grid cell in visualization "Visualization 1" at "5", "2" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(5, 2, 'Visualization 1'))
            .toBe('61219');
        //         #step 16
        //     When I sort the "metric" named "Flights Cancelled" in "Sort Within (Default)" in Editor Panel
        await editorPanelForGrid.simpleSort('Flights Cancelled', 'Sort Within (Default)');
        //     Then the grid cell in visualization "Visualization 1" at "3", "27" has text "1110"
        await since(
                `The grid cell in visualization "Visualization 1" at "3", "27" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 27, 'Visualization 1'))
            .toBe('1110');
        //     And the grid cell in visualization "Visualization 1" at "1", "15" has text "Wednesday"
        await since(
                `The grid cell in visualization "Visualization 1" at "1", "15" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(1, 15, 'Visualization 1'))
            .toBe('Wednesday');
        //     And the grid cell in visualization "Visualization 1" at "3", "3" has text "1148"
        await since(
                `The grid cell in visualization "Visualization 1" at "3", "3" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 3, 'Visualization 1'))
            .toBe('1148');
        //         #step 17
            
        //     When I click the sort ascending icon for "Metric" named "On-Time" from Editor Panel
        await vizPanelForGrid.clickMetricSortAscending('Metric','On-Time');
        //     Then the grid cell in visualization "Visualization 1" at "3", "2" has text "1148"
        await since(
                `The grid cell in visualization "Visualization 1" at "3", "2" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('1148');
        //     And the grid cell in visualization "Visualization 1" at "1", "15" has text "Saturday"
        await since(
                `The grid cell in visualization "Visualization 1" at "1", "15" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(1, 15, 'Visualization 1'))
            .toBe('Saturday');
        //     And the grid cell in visualization "Visualization 1" at "3", "32" has text "1753"
        await since(
                `The grid cell in visualization "Visualization 1" at "3", "32" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 32, 'Visualization 1'))
            .toBe('1753');

        //     When I click the sort descending icon for "Metric" named "On-Time" from Editor Panel
        await vizPanelForGrid.clickMetricSortDescending('Metric','On-Time');
        //     Then the grid cell in visualization "Visualization 1" at "3", "2" has text "991"
        await since(
                `The grid cell in visualization "Visualization 1" at "3", "2" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('991');
        //     And the grid cell in visualization "Visualization 1" at "1", "15" has text "Tuesday"
        await since(
                `The grid cell in visualization "Visualization 1" at "1", "15" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(1, 15, 'Visualization 1'))
            .toBe('Tuesday');
        //     And the grid cell in visualization "Visualization 1" at "5", "4" has text "37821"
        await since(
                `The grid cell in visualization "Visualization 1" at "5", "4" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(5, 4, 'Visualization 1'))
            .toBe('37821');

        //     When I click the clear sort icon for "Metric" named "On-Time" from Editor Panel
        await vizPanelForGrid.clickMetricClearSort('Metric','On-Time');
        //     Then the grid cell in visualization "Visualization 1" at "1", "2" has text "2009"
        await since(
                `The grid cell in visualization "Visualization 1" at "1", "2" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(1, 2, 'Visualization 1'))
            .toBe('2009');
        //     And the grid cell in visualization "Visualization 1" at "1", "15" has text "Sunday"
        await since(
                `The grid cell in visualization "Visualization 1" at "1", "15" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(1, 15, 'Visualization 1'))
            .toBe('Sunday');
        //     And the grid cell in visualization "Visualization 1" at "3", "32" has text "1594"  
        await since(
                `The grid cell in visualization "Visualization 1" at "3", "32" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 32, 'Visualization 1'))
            .toBe('1594');
    });

    it('[TC41276_02] Sort multiple column set compound grid with metrics in rows', async () => {
        // When I open dossier by its ID "245DBA5711EAF71100670080EF456284"
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.AGGridSort.id,
            projectId: gridConstants.AGGridSort.project.id,
        });
        // When I select "Add Page" from toolbar
        await toolbar.clickButtonFromToolbar('Add Page');
        // Then A new page "Page 6" is inserted in "Chapter 1"
        // When I change visualization "Visualization 1" to "Compound Grid" from context menu
        await baseVisualization.changeVizType('Visualization 1', 'Grid', 'Compound Grid');
        // And I drag "attribute" named "Airline Name" from dataset "Airline sample dataset" to Column Set "Column Set 1" in compound grid
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ('Airline Name', 'attribute', 'Airline sample dataset', 'Column Set 1');
        // And I drag "metric" named "Flights Cancelled" from dataset "Airline sample dataset" to dropzone "Rows"
        await vizPanelForGrid.dragDSObjectToGridDZ('Flights Cancelled', 'metric', 'Airline sample dataset', 'Rows');
        // And I drag "metric" named "Flights Delayed" from dataset "Airline sample dataset" to dropzone "Rows" and drop it below "Flights Cancelled"
        await vizPanelForGrid.dragDSObjectToDZwithPosition('Flights Delayed', 'metric', 'Airline sample dataset', 'Rows', 'below', 'Flights Cancelled');
        // Then the editor panel should have the items "Flights Cancelled,Flights Delayed" in the "Rows" zone
        // And the editor panel should have the items "Airline Name" in the "Column Set 1" zone
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'The editor panel with Flights Cancelled and Flights Delayed in Rows and Airline Name in Column Set 1',
            'TC41276_02_01',
        );
        // When I sort the "metric" named "Flights Cancelled" in "Sort All Values" in Editor Panel
        await editorPanelForGrid.simpleSort('Flights Cancelled', 'Sort All Values');
        // Then the grid cell in visualization "Visualization 1" at "2", "2" has text "1753"
        await since(
                `The grid cell in visualization "Visualization 1" at "2", "2" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('1753');
       
        // #add new column set
        // When I add a column set for the compound grid
        await vizPanelForGrid.addColumnSet();
        // And I drag "attribute" named "Origin Airport" from dataset "Airline sample dataset" to Column Set "Column Set 2" in compound grid
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ('Origin Airport', 'attribute', 'Airline sample dataset', 'Column Set 2');
        // Then the editor panel should have the items "Origin Airport" in the "Column Set 2" zone
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'The editor panel with Origin Airport in Column Set 2',
            'TC41276_02_02',
        );
        
        // #sort metrics in rows and attributes after adding second column set
        // When I sort the "metric" named "Flights Delayed" in "Sort All Values" in Editor Panel
        await editorPanelForGrid.simpleSort('Flights Delayed', 'Sort All Values');
        // And I sort the "attribute" named "Origin Airport" in "Sort Ascending" in Editor Panel
        await editorPanelForGrid.simpleSort('Origin Airport', 'Sort Ascending');
        // And I drag "attribute" named "Year" from dataset "Airline sample dataset" to dropzone "Rows" and drop it below "Flights Delayed"
        await vizPanelForGrid.dragDSObjectToDZwithPosition('Year', 'attribute', 'Airline sample dataset', 'Rows', 'below', 'Flights Delayed');
        // When I sort the "attribute" named "Year" in "Sort Ascending" in Editor Panel
        await editorPanelForGrid.simpleSort('Year', 'Sort Ascending');
        // Then the grid cell in visualization "Visualization 1" at "1", "4" has text "American Airlines Inc."
        await since(
                `The grid cell in visualization "Visualization 1" at "1", "4" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(1, 4, 'Visualization 1'))
            .toBe('American Airlines Inc.');
        // And the grid cell in visualization "Visualization 1" at "4", "2" has text "2010"
        await since(
                `The grid cell in visualization "Visualization 1" at "4", "2" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(4, 2, 'Visualization 1'))
            .toBe('2010');
        // And the grid cell in visualization "Visualization 1" at "7", "1" has text "Flights Delayed"
        await since(
                `The grid cell in visualization "Visualization 1" at "7", "1" should have text #{expected}, instead we have #{actual}`
            )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(7, 1, 'Visualization 1'))
            .toBe('Flights Delayed');
    });
});

