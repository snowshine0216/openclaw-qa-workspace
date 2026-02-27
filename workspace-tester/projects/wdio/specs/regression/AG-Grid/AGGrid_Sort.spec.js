import * as gridConstants from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('[AG Grid Sort]', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        loginPage,
        libraryPage,
        loadingDialog,
        contentsPanel,
        agGridVisualization,
        dossierAuthoringPage,
        editorPanelForGrid,
        reportGridView,
        vizPanelForGrid,
        advancedSort,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {});

    it('[TC71082_1] should handle sorting in AG Grid', async () => {
        // Open the dossier
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridSort.project.id,
            dossierId: gridConstants.AGGridSort.id,
        });

        // Switch to "Page 1" in "Chapter 2"
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Page 1' });

        // Verify initial grid cell values
        await since('The grid cell at row 3, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('AirTran Airways Corporation');

        await since('The grid cell at row 3, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, 'Visualization 1'))
            .toBe('5,677.85');

        // Sort "Day of Week" in descending order

        await editorPanelForGrid.simpleSort('Day of Week', 'Sort Descending');
        await since('The grid cell at row 4, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 4, 'Visualization 1'))
            .toBe('76');

        await since('The grid cell at row 4, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 1, 'Visualization 1'))
            .toBe('American Airlines Inc.');

        await since('The grid cell at row 5, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(5, 3, 'Visualization 1'))
            .toBe('4,889.43');

        // Sort "Flights Cancelled" in ascending order
        await reportGridView.sortAscendingBySortIcon('Flights Cancelled');
        await since('The grid cell at row 4, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 4, 'Visualization 1'))
            .toBe('32');

        await since('The grid cell at row 3, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Comair Inc.');

        await since('The grid cell at row 3, column 6 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 6, 'Visualization 1'))
            .toBe('217');

        // Clear sort on "Flights Cancelled"
        await reportGridView.clearSortBySortIcon('Flights Cancelled');
        await since('The grid cell at row 10, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(10, 1, 'Visualization 1'))
            .toBe('American Airlines Inc.');

        await since('The grid cell at row 1, column 5 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 5, 'Visualization 1'))
            .toBe('2009');

        await since('The grid cell at row 3, column 5 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 5, 'Visualization 1'))
            .toBe('423');

        // Sort "Year" in descending order
        await editorPanelForGrid.simpleSort('Year', 'Sort Descending');
        await since('The grid cell at row 1, column 7 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 7, 'Visualization 1'))
            .toBe('2009');

        await since('The grid cell at row 3, column 7 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 7, 'Visualization 1'))
            .toBe('423');

        // Sort "Flights Delayed" in "Sort Within"
        await editorPanelForGrid.simpleSort('Flights Delayed', 'Sort Within');
        await since('The grid cell at row 3, column 10 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 10, 'Visualization 1'))
            .toBe('765');

        await since('The grid cell at row 3, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('Monday');

        await since('The grid cell at row 4, column 10 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 10, 'Visualization 1'))
            .toBe('733');

        // Right-click and sort "On-Time" in "Sort Within"
        await agGridVisualization.openContextSubMenuItemForHeader(
            'On-Time',
            'Sort Within',
            null,
            'Visualization 1'
        );
        await since('The grid cell at row 3, column 10 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 10, 'Visualization 1'))
            .toBe('733');

        await since('The grid cell at row 4, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 2, 'Visualization 1'))
            .toBe('Saturday');

        await since('The grid cell at row 3, column 5 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 5, 'Visualization 1'))
            .toBe('223');

        await since('The grid cell at row 4, column 5 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 5, 'Visualization 1'))
            .toBe('215');

        // Sort "Flights Delayed" in "Sort All Values (Default)"
        // await editorPanel.sortMetric('Flights Delayed', 'Sort All Values (Default)');
        await editorPanelForGrid.simpleSort('Flights Delayed', 'Sort All Values (Default)');
        await since('The grid cell at row 3, column 10 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 10, 'Visualization 1'))
            .toBe('2112');

        await since('The grid cell at row 3, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Southwest Airlines Co.');

        await since('The grid cell at row 4, column 10 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 10, 'Visualization 1'))
            .toBe('2016');

        // Right-click and sort "On-Time" in "Sort All Values (Default)"
        await agGridVisualization.openContextSubMenuItemForHeader(
            'On-Time',
            'Sort All Values (Default)',
            null,
            'Visualization 1'
        );
        await since('The grid cell at row 4, column 10 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 10, 'Visualization 1'))
            .toBe('1785');

        await since('The grid cell at row 5, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(5, 1, 'Visualization 1'))
            .toBe('United Air Lines Inc.');

        await since('The grid cell at row 3, column 5 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 5, 'Visualization 1'))
            .toBe('413');

        await since('The grid cell at row 4, column 5 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 5, 'Visualization 1'))
            .toBe('392');

        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Month',
            'attribute',
            'Airline sample dataset',
            'Rows',
            'above',
            'Airline Name'
        );

        await reportGridView.sortMetricWithinAttribute('Flights Delayed', 'Airline Name');
        await browser.pause(3000);
        await since('The grid cell at row 3, column 11 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 11, 'Visualization 1'))
            .toBe('334');

        await since('The grid cell at row 2, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('Month');

        await since('The grid cell at row 5, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(5, 3, 'Visualization 1'))
            .toBe('Friday');

        await since('The grid cell at row 4, column 11 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 11, 'Visualization 1'))
            .toBe('310');

        // Remove "Month" attribute and clear sort
        await editorPanelForGrid.removeFromDropZone('Month', 'attribute');
        await reportGridView.clearSortBySortIcon('Flights Delayed');
        await since('The grid cell at row 10, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(10, 1, 'Visualization 1'))
            .toBe('American Airlines Inc.');

        // Toggle totals and sort "Flights Delayed" in "Sort with Subtotals"
        await agGridVisualization.toggleShowTotalsByContextMenu();
        await editorPanelForGrid.simpleSort('Flights Delayed', 'Sort with Subtotals');
        await since('The grid cell at row 3, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Total');

        await since('The grid cell at row 4, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 1, 'Visualization 1'))
            .toBe('AirTran Airways Corporation');

        await since('The grid cell at row 5, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(5, 1, 'Visualization 1'))
            .toBe('American Airlines Inc.');

        await since('The grid cell at row 3, column 10 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 10, 'Visualization 1'))
            .toBe('43800');

        await since('The grid cell at row 4, column 10 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 10, 'Visualization 1'))
            .toBe('4462');
    });

    it('[TC71082_2] should handle sorting in AG Grid with Freeform Layout', async () => {
        //       if (!tcList.includes('TC71082_2')) return; // Skip this test if not in tcList
        // Open the dossier by its ID
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridSort.project.id,
            dossierId: gridConstants.AGGridSort.id,
        });

        // Switch to "Page 1" in "Chapter 2"
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Page 1' });

        // Convert to Freeform Layout
        await dossierAuthoringPage.actionOnToolbar(
            `<b>Convert to Free-form Layout</b><br >Objects on the page can be independently positioned, sized, and layered.`
        );
        await since('The grid cell at row 3, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('AirTran Airways Corporation');
        await since('The grid cell at row 3, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, 'Visualization 1'))
            .toBe('5,677.85');

        // Sort "Day of Week" in descending order
        await editorPanelForGrid.simpleSort('Day of Week', 'Sort Descending');
        await since('The grid cell at row 4, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 4, 'Visualization 1'))
            .toBe('76');
        await since('The grid cell at row 4, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 1, 'Visualization 1'))
            .toBe('American Airlines Inc.');
        await since('The grid cell at row 5, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(5, 3, 'Visualization 1'))
            .toBe('4,889.43');

        // Sort "Flights Cancelled" in ascending order
        await reportGridView.sortAscendingBySortIcon('Flights Cancelled');
        await since('The grid cell at row 4, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 4, 'Visualization 1'))
            .toBe('32');
        await since('The grid cell at row 3, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Comair Inc.');
        await since('The grid cell at row 3, column 6 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 6, 'Visualization 1'))
            .toBe('217');

        // Clear sort on "Flights Cancelled"
        await reportGridView.clearSortBySortIcon('Flights Cancelled');
        await since('The grid cell at row 10, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(10, 1, 'Visualization 1'))
            .toBe('American Airlines Inc.');
        await since('The grid cell at row 1, column 5 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 5, 'Visualization 1'))
            .toBe('2009');
        await since('The grid cell at row 3, column 5 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 5, 'Visualization 1'))
            .toBe('423');

        // Sort "Year" in descending order
        await editorPanelForGrid.simpleSort('Year', 'Sort Descending');
        await since('The grid cell at row 1, column 7 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 7, 'Visualization 1'))
            .toBe('2009');
        await since('The grid cell at row 3, column 7 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 7, 'Visualization 1'))
            .toBe('423');

        // Sort "Flights Delayed" in "Sort Within"
        await editorPanelForGrid.simpleSort('Flights Delayed', 'Sort Within');
        await since('The grid cell at row 3, column 10 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 10, 'Visualization 1'))
            .toBe('765');
        await since('The grid cell at row 3, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('Monday');
        await since('The grid cell at row 4, column 10 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 10, 'Visualization 1'))
            .toBe('733');

        // Right-click and sort "On-Time" in "Sort Within"
        await agGridVisualization.openContextSubMenuItemForHeader(
            'On-Time',
            'Sort Within',
            null,
            'Visualization 1'
        );
        await since('The grid cell at row 3, column 10 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 10, 'Visualization 1'))
            .toBe('733');
        await since('The grid cell at row 4, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 2, 'Visualization 1'))
            .toBe('Saturday');
        await since('The grid cell at row 3, column 5 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 5, 'Visualization 1'))
            .toBe('223');
        await since('The grid cell at row 4, column 5 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 5, 'Visualization 1'))
            .toBe('215');

        // Sort "Flights Delayed" in "Sort All Values (Default)"
        await editorPanelForGrid.simpleSort('Flights Delayed', 'Sort All Values (Default)');
        await since('The grid cell at row 3, column 10 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 10, 'Visualization 1'))
            .toBe('2112');
        await since('The grid cell at row 3, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Southwest Airlines Co.');
        await since('The grid cell at row 4, column 10 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 10, 'Visualization 1'))
            .toBe('2016');

        // Right-click and sort "On-Time" in "Sort All Values (Default)"
        await agGridVisualization.openContextSubMenuItemForHeader(
            'On-Time',
            'Sort All Values (Default)',
            null,
            'Visualization 1'
        );
        await since('The grid cell at row 4, column 10 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 10, 'Visualization 1'))
            .toBe('1785');
        await since('The grid cell at row 5, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(5, 1, 'Visualization 1'))
            .toBe('United Air Lines Inc.');
        await since('The grid cell at row 3, column 5 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 5, 'Visualization 1'))
            .toBe('413');
        await since('The grid cell at row 4, column 5 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 5, 'Visualization 1'))
            .toBe('392');

        // Add "Month" attribute to the current visualization
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Month',
            'attribute',
            'Airline sample dataset',
            'Rows',
            'below',
            'Airline Name'
        );
        await since('The grid cell at row 3, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Southwest Airlines Co.');

        // Sort "Flights Delayed" in "Sort Within an Attribute" using "Airline Name"
        await reportGridView.sortMetricWithinAttribute('Flights Delayed', 'Airline Name');
        await browser.pause(2000);
        await since('The grid cell at row 3, column 11 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 11, 'Visualization 1'))
            .toBe('334');
        await since('The grid cell at row 2, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('Month');
        await since('The grid cell at row 5, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(5, 3, 'Visualization 1'))
            .toBe('Friday');
        await since('The grid cell at row 4, column 11 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 11, 'Visualization 1'))
            .toBe('310');

        // Right-click and sort "On-Time" in "Sort Within an Attribute" using "Airline Name"
        await agGridVisualization.openContextSubMenuItemForHeader(
            'On-Time',
            'Sort Within an Attribute',
            'Airline Name',
            'Visualization 1'
        );
        await since('The grid cell at row 10, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(10, 2, 'Visualization 1'))
            .toBe('February');
        await since('The grid cell at row 4, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 3, 'Visualization 1'))
            .toBe('Saturday');
        await since('The grid cell at row 3, column 6 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 6, 'Visualization 1'))
            .toBe('223');
        await since('The grid cell at row 4, column 6 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 6, 'Visualization 1'))
            .toBe('215');

        // Remove "Month" attribute and clear sort
        await editorPanelForGrid.removeFromDropZone('Month', 'attribute');
        await reportGridView.clearSortBySortIcon('Flights Delayed');
        await since('The grid cell at row 10, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(10, 1, 'Visualization 1'))
            .toBe('American Airlines Inc.');

        // Toggle totals and sort "Flights Delayed" in "Sort with Subtotals"
        await agGridVisualization.toggleShowTotalsByContextMenu();
        await editorPanelForGrid.simpleSort('Flights Delayed', 'Sort with Subtotals');
        await since('The grid cell at row 3, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Total');
        await since('The grid cell at row 4, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 1, 'Visualization 1'))
            .toBe('AirTran Airways Corporation');
        await since('The grid cell at row 5, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(5, 1, 'Visualization 1'))
            .toBe('American Airlines Inc.');
        await since('The grid cell at row 3, column 10 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 10, 'Visualization 1'))
            .toBe('43800');
        await since('The grid cell at row 4, column 10 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 10, 'Visualization 1'))
            .toBe('4462');

        // Right-click and sort "On-Time" in "Sort with Subtotals"
        await agGridVisualization.openContextSubMenuItemForHeader(
            'On-Time',
            'Sort with Subtotals',
            null,
            'Visualization 1'
        );
        await since('The grid cell at row 4, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 1, 'Visualization 1'))
            .toBe('Southwest Airlines Co.');
        await since('The grid cell at row 4, column 10 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 10, 'Visualization 1'))
            .toBe('12902');
        await since('The grid cell at row 5, column 10 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(5, 10, 'Visualization 1'))
            .toBe('2112');

        // Replace "Year" attribute with "Origin Airport" in column set
        await editorPanelForGrid.replaceObjectByNameInColumnSet('Year', 'Column Set 2', 'Origin Airport');
        await since('The grid cell at row 1, column 5 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 5, 'Visualization 1'))
            .toBe('BWI');
        await since('The grid cell at row 1, column 6 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 6, 'Visualization 1'))
            .toBe('DCA');
        await since('The grid cell at row 1, column 7 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 7, 'Visualization 1'))
            .toBe('IAD');

        // Replace "On-Time" metric with "Number of Flights" in column set
        await editorPanelForGrid.replaceObjectByNameInColumnSet('On-Time', 'Column Set 2', 'Number of Flights');
        await since('The grid cell at row 5, column 5 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(5, 5, 'Visualization 1'))
            .toBe('1415');
        await since('The grid cell at row 6, column 5 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(6, 5, 'Visualization 1'))
            .toBe('1471');
        await since('The grid cell at row 7, column 5 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(7, 5, 'Visualization 1'))
            .toBe('1267');
    });

    it('[TC2710_1] should handle Advanced Sort in AG Grid', async () => {
        //    if (!tcList.includes('TC2710_1')) return; // Skip this test if not in tcList
        // Open the dossier by its ID
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridAdvancedSort.project.id,
            dossierId: gridConstants.AGGridAdvancedSort.id,
        });

        // Open Advanced Sort for "Area"
        await agGridVisualization.openContextSubMenuItemForHeader('Area', 'Advanced Sort ...', null, 'Visualization 1');

        // Set row 1 to use "Issue Category (Defect)" with "Descending" sort
        await advancedSort.openAndselectSortByAndOrder(1, 'Issue Category (Defect)', 'Descending');

        // Set row 2 to use "Area" with "Descending" sort
        await advancedSort.openAndselectSortByAndOrder(2, 'Area', 'Descending');

        // Switch from "Rows" to "Columns" in the Advanced Sort Editor
        await advancedSort.switchToColumns();

        // Set row 1 to use "Resolution" with "Descending" sort
        await advancedSort.openAndselectSortByAndOrder(1, 'Resolution', 'Descending');

        // Click "OK" to save and close the Advanced Sort Editor
        await advancedSort.save();
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        // Verify grid cell values after applying Advanced Sort
        await since('The grid cell at row 3, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Data Preparation');
        await since('The grid cell at row 3, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('Stability');
        await since('The grid cell at row 1, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 3, 'Visualization 1'))
            .toBe('Not an Issue - Not a Defect');

        // Open Advanced Sort for "Issue Category (Defect)" in the Grid Editor Panel
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Issue Category (Defect)',
            'Advanced Sort ...',
            null,
            'Visualization 1'
        );

        // Drag row 2 and drop it above row 1 in the Advanced Sort Editor
        await vizPanelForGrid.dragSortRowwithPositionInAdvancedSortEditor(2, 'above', 1);

        // Click "OK" to save and close the Advanced Sort Editor
        await advancedSort.save();
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        // Verify grid cell values after switching conditions in Advanced Sort Editor
        await since('The grid cell at row 3, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Workstation');
        await since('The grid cell at row 3, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('None');
        await since('The grid cell at row 1, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 3, 'Visualization 1'))
            .toBe('Not an Issue - Not a Defect');
    });

    it('[TC2710_2] should handle Advanced Sort in AG Grid (step 13)', async () => {
        // Step 1: Open the dossier by its ID
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridAdvancedSort.project.id,
            dossierId: gridConstants.AGGridAdvancedSort.id,
        });

        // Verify initial grid cell values in "Visualization 2"
        await since('The grid cell at row 2, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'Visualization 2'))
            .toBe('Admin Services');
        await since('The grid cell at row 2, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'Visualization 2'))
            .toBe('None');

        // Step 2: Open Advanced Sort for "Area"
        await agGridVisualization.openContextSubMenuItemForHeader('Area', 'Advanced Sort ...', null, 'Visualization 2');

        // Verify the Advanced Sort Editor shows default settings with "Rows" selected
        await since('The Advanced Sort Editor should show default settings with "Rows" selected')
            .expect(await advancedSort.isRowsSelected())
            .toBeTrue();

        // Step 3: Set sorting conditions in the Advanced Sort Editor
        await advancedSort.openAndselectSortByAndOrder(1, 'Area', 'Descending');
        await advancedSort.openAndselectSortByAndOrder(2, 'Issue Category (Defect)', 'Descending');
        await advancedSort.openAndselectSortByAndOrder(3, 'Resolution', 'Ascending');

        await advancedSort.delete(3);

        await since('Row 3 in the Advanced Sort Editor should be blank')
            .expect(await advancedSort.getSortBySelectedText(3))
            .toBe('');

        await advancedSort.openAndselectSortByAndOrder(3, 'Resolution', 'Ascending');

        // Verify row 4 is blank in the Advanced Sort Editor
        await since('Row 4 in the Advanced Sort Editor should be blank')
            .expect(await advancedSort.getSortBySelectedText(4))
            .toBe('');

        // Step 4: Save and close the Advanced Sort Editor
        await advancedSort.save();
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        // Verify grid cell values after applying Advanced Sort
        await since('The grid cell at row 2, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'Visualization 2'))
            .toBe('Workstation');
        await since('The grid cell at row 2, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'Visualization 2'))
            .toBe('None');
        await since('The grid cell at row 7, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(7, 1, 'Visualization 2'))
            .toBe('Data Preparation');
        await since('The grid cell at row 7, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(7, 2, 'Visualization 2'))
            .toBe('Stability');
        await since('The grid cell at row 8, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(8, 2, 'Visualization 2'))
            .toBe('None');

        // Step 5: Verify initial grid cell values in "Visualization 1"
        await since('The grid cell at row 1, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('Area');
        await since('The grid cell at row 1, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'Visualization 1'))
            .toBe('Resolution');

        // Step 7: Open Advanced Sort for "Area" in "Visualization 1"
        await agGridVisualization.openContextSubMenuItemForHeader('Area', 'Advanced Sort ...', null, 'Visualization 1');

        // Step 8: Set sorting conditions in the Advanced Sort Editor
        await advancedSort.openAndselectSortByAndOrder(1, 'Area', 'Descending');
        await advancedSort.openAndselectSortByAndOrder(2, 'Issue Category (Defect)', 'Descending');
        await advancedSort.openAndselectSortByAndOrder(3, 'Issue Category (Defect)', 'Ascending');

        // Verify row 4 is blank in the Advanced Sort Editor
        await since('Row 4 in the Advanced Sort Editor should be blank')
            .expect(await advancedSort.getSortBySelectedText(4))
            .toBe('');

        // Step 9: Save and close the Advanced Sort Editor
        await advancedSort.save();
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        // Verify grid cell values after applying Advanced Sort
        await since('The grid cell at row 3, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Workstation');
        await since('The grid cell at row 5, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(5, 2, 'Visualization 1'))
            .toBe('Functionality defect');

        // Step 10: Verify no vertical scroll bar in the Advanced Sort Editor
        await agGridVisualization.openContextSubMenuItemForHeader('Area', 'Advanced Sort ...', null, 'Visualization 1');

        // Step 11: Add more rows to trigger the vertical scroll bar
        for (let i = 4; i <= 8; i++) {
            await advancedSort.openAndselectSortByAndOrder(i, 'Issue Category (Defect)', 'Ascending');
        }
        await advancedSort.scrollListToBottom();
        await takeScreenshotByElement(advancedSort.getSortEditor(), 'TC2710_2_1', 'Long list in Advanced Sort Editor in Rows');
        await since('Row 9 in the Advanced Sort Editor should be blank')
            .expect(await advancedSort.getSortBySelectedText(9))
            .toBe('');

        // Step 12: Switch to "Columns" and verify no vertical scroll bar
        await advancedSort.switchToColumns();

        // Add rows in "Columns" and verify the vertical scroll bar
        for (let i = 1; i <= 8; i++) {
            await advancedSort.openAndselectSortByAndOrder(i, 'Resolution', 'Ascending');
        }
        await advancedSort.scrollListToBottom();
        await takeScreenshotByElement(advancedSort.getSortEditor(), 'TC2710_2_2', 'Long list in Advanced Sort Editor in Columns');
    });

    it('[TC65149_1] Validate metric Sort by All Values/Subtotals in AG Grid', async () => {
        // Step 1: Open the dossier by its ID
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGrid_Metric_Sort.project.id,
            dossierId: gridConstants.AGGrid_Metric_Sort.id,
        });

        // Step 3: Toggle the Show Totals for the visualization "AG Grid"
        await agGridVisualization.clickOnMaximizeRestoreButton('AG Grid');
        await agGridVisualization.toggleShowTotalsByContextMenu('AG Grid');

        // Step 4: Verify initial grid cell values
        await since('The grid cell at row 2, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 2, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'AG Grid'))
            .toBe('AirTran Airways Corporation');
        await since('The grid cell at row 2, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 3, 'AG Grid'))
            .toBe('Sunday');
        await since('The grid cell at row 3, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, 'AG Grid'))
            .toBe('Monday');
        await since('The grid cell at row 9, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(9, 2, 'AG Grid'))
            .toBe('American Airlines Inc.');
        await since('The grid cell at row 9, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(9, 3, 'AG Grid'))
            .toBe('Sunday');

        // Step 5: Sort All Values (Default) for "Avg Delay (min)"
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Avg Delay (min)',
            'Sort All Values (Default)',
            null,
            'AG Grid'
        );

        // Verify grid cell values after sorting all values
        await since('The grid cell at row 2, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'AG Grid'))
            .toBe('DCA');
        await since('The grid cell at row 2, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'AG Grid'))
            .toBe('American Eagle Airlines Inc.');
        await since('The grid cell at row 2, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 3, 'AG Grid'))
            .toBe('Thursday');
        await since('The grid cell at row 3, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'AG Grid'))
            .toBe('IAD');
        await since('The grid cell at row 3, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'AG Grid'))
            .toBe('Mesa Airlines Inc.');
        await since('The grid cell at row 3, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, 'AG Grid'))
            .toBe('Thursday');

        // Step 6: Sort "Avg Delay (min)" in ascending order
        await reportGridView.sortAscendingBySortIcon('Avg Delay (min)');

        // Verify grid cell values after sorting in ascending order
        await since('The grid cell at row 2, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 2, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'AG Grid'))
            .toBe('Mesa Airlines Inc.');
        await since('The grid cell at row 2, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 3, 'AG Grid'))
            .toBe('Thursday');
        await since('The grid cell at row 3, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, 'AG Grid'))
            .toBe('Friday');
        await since('The grid cell at row 6, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(6, 1, 'AG Grid'))
            .toBe('IAD');
        await since('The grid cell at row 6, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(6, 2, 'AG Grid'))
            .toBe('US Airways Inc.');
        await since('The grid cell at row 6, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(6, 3, 'AG Grid'))
            .toBe('Sunday');

        // Step 7: Clear sorting on "Avg Delay (min)"
        await reportGridView.clearSortBySortIcon('Avg Delay (min)');

        // Verify grid cell values after clearing sort
        await since('The grid cell at row 2, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 2, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'AG Grid'))
            .toBe('AirTran Airways Corporation');
        await since('The grid cell at row 2, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 3, 'AG Grid'))
            .toBe('Sunday');
        await since('The grid cell at row 3, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, 'AG Grid'))
            .toBe('Monday');
        await since('The grid cell at row 9, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(9, 2, 'AG Grid'))
            .toBe('American Airlines Inc.');
        await since('The grid cell at row 9, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(9, 3, 'AG Grid'))
            .toBe('Sunday');
    });

    it('[TC65149_2] Validate metric Sort by All Values/Subtotals in AG Grid', async () => {
        // Step 1: Switch to Page 2 in Chapter 1
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGrid_Metric_Sort.project.id,
            dossierId: gridConstants.AGGrid_Metric_Sort.id,
        });

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 2' });

        // Step 3: Toggle the Show Totals for the visualization "AG Grid"
        await agGridVisualization.clickOnMaximizeRestoreButton('AG Grid');
        await agGridVisualization.toggleShowTotalsByContextMenu('AG Grid');

        await since('The grid cell at row 1, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'AG Grid'))
            .toBe('January');
        await since('The grid cell at row 2, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 3, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'AG Grid'))
            .toBe('AirTran Airways Corporation');
        await since('The grid cell at row 4, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 2, 'AG Grid'))
            .toBe('9,034.60');
        await since('The grid cell at row 4, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 3, 'AG Grid'))
            .toBe('4,717.17');

        // await editorPanel.switchToEditorPanel();
        // await formatPanel.switchToFormatPanel();
        // await newFormatPanelForGrid.expandSpacingSection();
        // await newFormatPanelForGrid.clickColumnSizeFitOption('Fit to Content');

        // Step 5: Sort Within for "Avg Delay (min)"
        await agGridVisualization.openContextMenuItemForValue(
            'Avg Delay (min)',
            'Sort Within',
            null,
            'AG Grid'
        );

        // Verify grid cell values after sorting within (default)
        await since('The grid cell at row 1, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'AG Grid'))
            .toBe('January');
        await since('The grid cell at row 2, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 3, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'AG Grid'))
            .toBe('AirTran Airways Corporation');
        await since('The grid cell at row 4, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 2, 'AG Grid'))
            .toBe('9,034.60');
        await since('The grid cell at row 4, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 3, 'AG Grid'))
            .toBe('8,120.05');

        // Step 6: Sort "Flights Cancelled" in ascending order
        await reportGridView.sortCellAscendingBySortIcon('Flights Cancelled');

        // Verify grid cell values after sorting in ascending order
        await since('The grid cell at row 1, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'AG Grid'))
            .toBe('January');
        await since('The grid cell at row 2, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 3, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'AG Grid'))
            .toBe('Mesa Airlines Inc.');
        await since('The grid cell at row 4, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 2, 'AG Grid'))
            .toBe('297.00');
        await since('The grid cell at row 4, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 3, 'AG Grid'))
            .toBe('56.50');

        // Step 7: Clear sorting on "Flights Cancelled"
        await reportGridView.clearCellSortBySortIcon('Flights Cancelled');

        // Verify grid cell values after clearing sort
        await since('The grid cell at row 1, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'AG Grid'))
            .toBe('January');
        await since('The grid cell at row 2, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 3, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'AG Grid'))
            .toBe('AirTran Airways Corporation');
        await since('The grid cell at row 4, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 2, 'AG Grid'))
            .toBe('9,034.60');
        await since('The grid cell at row 4, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 3, 'AG Grid'))
            .toBe('4,717.17');

        // Step 8: Sort "Month" attribute in descending order
        await editorPanelForGrid.simpleSort('Month', 'Sort Descending');

        // Verify grid cell values after sorting "Month" in descending order
        await since('The grid cell at row 1, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'AG Grid'))
            .toBe('December');
        await since('The grid cell at row 2, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 3, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'AG Grid'))
            .toBe('AirTran Airways Corporation');
        await since('The grid cell at row 4, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 2, 'AG Grid'))
            .toBe('5,922.51');
        await since('The grid cell at row 4, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 3, 'AG Grid'))
            .toBe('4,223.23');

        // Step 1: Sort Within for "Avg Delay (min)"
        await agGridVisualization.openContextMenuItemForValue(
            'Avg Delay (min)',
            'Sort Within',
            null,
            'AG Grid'
        );

        // Step 2: Verify grid cell values after sorting within (default)
        await since('The grid cell at row 1, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'AG Grid'))
            .toBe('January');
        await since('The grid cell at row 2, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 3, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'AG Grid'))
            .toBe('AirTran Airways Corporation');
        await since('The grid cell at row 4, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 2, 'AG Grid'))
            .toBe('9,034.60');
        await since('The grid cell at row 4, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 3, 'AG Grid'))
            .toBe('8,120.05');

        // Step 3: Clear sorting on "Avg Delay (min)"
        await reportGridView.clearCellSortBySortIcon('Avg Delay (min)');

        // Step 4: Verify grid cell values after clearing sort
        await since('The grid cell at row 1, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'AG Grid'))
            .toBe('January');
        await since('The grid cell at row 2, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 3, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'AG Grid'))
            .toBe('AirTran Airways Corporation');
        await since('The grid cell at row 4, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 2, 'AG Grid'))
            .toBe('9,034.60');
        await since('The grid cell at row 4, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 3, 'AG Grid'))
            .toBe('4,717.17');

        // Step 5: Toggle the Show Totals for the visualization "AG Grid"
        await agGridVisualization.toggleShowTotalsByContextMenu('AG Grid');

        // Step 6: Verify grid cell values with subtotals
        await since('The grid cell at row 4, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 2, 'AG Grid'))
            .toBe('9,034.60');
        await since('The grid cell at row 4, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 3, 'AG Grid'))
            .toBe('4,717.17');

        // Step 7: Sort Within for "Avg Delay (min)" with subtotals
        await agGridVisualization.openContextMenuItemForValue(
            'Avg Delay (min)',
            'Sort Within',
            null,
            'AG Grid'
        );

        // Step 8: Verify grid cell values after sorting within (default) with subtotals
        await since('The grid cell at row 1, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'AG Grid'))
            .toBe('January');
        await since('The grid cell at row 2, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 3, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'AG Grid'))
            .toBe('AirTran Airways Corporation');
        await since('The grid cell at row 4, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 2, 'AG Grid'))
            .toBe('9,034.60');
        await since('The grid cell at row 4, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 3, 'AG Grid'))
            .toBe('8,120.05');
    });

    it('[TC65149_3] Validate sorting and subtotals in AG Grid', async () => {
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGrid_Metric_Sort.project.id,
            dossierId: gridConstants.AGGrid_Metric_Sort.id,
        });

        await browser.pause(5000);
        // Step 1: Switch to Page 3 in Chapter 1
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 3' });

        await agGridVisualization.clickOnMaximizeRestoreButton('AG Grid');
        // Step 4: Remove the Show Totals for the visualization "AG Grid"
        await agGridVisualization.toggleShowTotalsByContextMenu('AG Grid');

        // Step 5: Verify grid cell values without subtotals
        await since('The grid cell at row 3, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 3, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'AG Grid'))
            .toBe('AirTran Airways Corporation');
        await since('The grid cell at row 3, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, 'AG Grid'))
            .toBe('January');
        await since('The grid cell at row 3, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 4, 'AG Grid'))
            .toBe('2,738.02');
        await since('The grid cell at row 4, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 4, 'AG Grid'))
            .toBe('2,406.32');

        // Step 6: Sort All Values (Default) for "Avg Delay (min)"
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Avg Delay (min)',
            'Sort All Values (Default)',
            null,
            'AG Grid'
        );

        // Verify grid cell values after sorting all values
        await since('The grid cell at row 3, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'AG Grid'))
            .toBe('IAD');
        await since('The grid cell at row 3, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'AG Grid'))
            .toBe('Mesa Airlines Inc.');
        await since('The grid cell at row 3, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, 'AG Grid'))
            .toBe('June');
        await since('The grid cell at row 3, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 4, 'AG Grid'))
            .toBe('5,262.17');
        await since('The grid cell at row 4, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 4, 'AG Grid'))
            .toBe('5,215.70');

        // Step 7: Sort "Avg Delay (min)" in ascending order
        await agGridVisualization.sortAscendingBySortIcon('Avg Delay (min)', 'AG Grid');

        // Verify grid cell values after sorting in ascending order
        await since('The grid cell at row 3, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 3, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'AG Grid'))
            .toBe('Mesa Airlines Inc.');
        await since('The grid cell at row 3, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, 'AG Grid'))
            .toBe('February');
        await since('The grid cell at row 3, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 4, 'AG Grid'))
            .toBe('10.00');
        await since('The grid cell at row 4, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 4, 'AG Grid'))
            .toBe('10.50');

        // Step 8: Clear sorting on "Avg Delay (min)"
        await agGridVisualization.clearSortBySortIcon('Avg Delay (min)', 'AG Grid');

        // Verify grid cell values after clearing sort
        await since('The grid cell at row 3, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 3, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'AG Grid'))
            .toBe('AirTran Airways Corporation');
        await since('The grid cell at row 3, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, 'AG Grid'))
            .toBe('January');
        await since('The grid cell at row 3, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 4, 'AG Grid'))
            .toBe('2,738.02');
        await since('The grid cell at row 4, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 4, 'AG Grid'))
            .toBe('2,406.32');

        // Step 2: Enable subtotals for "Origin Airport"
        await agGridVisualization.toggleShowTotalsFromAttribute('Origin Airport', 'AG Grid', 'Total');

        // Step 3: Verify grid cell values with subtotals
        await since('The grid cell at row 3, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'AG Grid'))
            .toBe('Total');
        await since('The grid cell at row 3, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 4, 'AG Grid'))
            .toBe('595,673.60');
        await since('The grid cell at row 3, column 10 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 10, 'AG Grid'))
            .toBe('473435');
        await since('The grid cell at row 4, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 1, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 4, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 2, 'AG Grid'))
            .toBe('Total');
        await since('The grid cell at row 4, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 4, 'AG Grid'))
            .toBe('191,968.02');
        await since('The grid cell at row 4, column 10 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 10, 'AG Grid'))
            .toBe('206398');

        await since('The grid cell at row 5, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(5, 2, 'AG Grid'))
            .toBe('AirTran Airways Corporation');

        // Step 4: Sort All Values (Default) for "Avg Delay (min)"
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Avg Delay (min)',
            'Sort All Values (Default)',
            null,
            'AG Grid'
        );

        // Verify grid cell values after sorting all values
        await since('The grid cell at row 3, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'AG Grid'))
            .toBe('Total');
        await since('The grid cell at row 3, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 4, 'AG Grid'))
            .toBe('595,673.60');
        await since('The grid cell at row 4, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 1, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 4, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 2, 'AG Grid'))
            .toBe('Total');
        // await since('The grid cell at row 35, column 1 should have text "#{expected}", instead we have "#{actual}"')
        //     .expect(await agGridVisualization.getGridCellTextByPosition(35, 1, 'AG Grid'))
        //     .toBe('DCA');
        // await since('The grid cell at row 35, column 2 should have text "#{expected}", instead we have "#{actual}"')
        //     .expect(await agGridVisualization.getGridCellTextByPosition(35, 2, 'AG Grid'))
        //     .toBe('American Eagle Airlines Inc.');
        // await since('The grid cell at row 35, column 3 should have text "#{expected}", instead we have "#{actual}"')
        //     .expect(await agGridVisualization.getGridCellTextByPosition(35, 3, 'AG Grid'))
        //     .toBe('August');

        // Step 5: Sort with Subtotals for "Flights Cancelled"
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Flights Cancelled',
            'Sort with Subtotals',
            null,
            'AG Grid'
        );

        // Verify grid cell values after sorting with subtotals
        await since('The grid cell at row 3, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'AG Grid'))
            .toBe('Total');
        await since('The grid cell at row 3, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 4, 'AG Grid'))
            .toBe('595,673.60');
        await since('The grid cell at row 4, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 1, 'AG Grid'))
            .toBe('DCA');
        await since('The grid cell at row 4, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 2, 'AG Grid'))
            .toBe('Total');
        await since('The grid cell at row 4, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 4, 'AG Grid'))
            .toBe('232,332.02');
        await since('The grid cell at row 5, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(5, 2, 'AG Grid'))
            .toBe('US Airways Inc.');
        await since('The grid cell at row 5, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(5, 3, 'AG Grid'))
            .toBe('Total');
        await since('The grid cell at row 5, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(5, 4, 'AG Grid'))
            .toBe('31,566.26');
        await since('The grid cell at row 6, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(6, 3, 'AG Grid'))
            .toBe('December');
    });

    it('[TC65147_1] Validate Sort Within and Subtotals in AG Grid', async () => {
        // Step 1: Open the dossier by its ID
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGrid_Metric_Sort.project.id,
            dossierId: gridConstants.AGGrid_Metric_Sort.id,
        });

        await browser.pause(5000);
        // Step 1: Switch to Page 3 in Chapter 1
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        // Step 2: Maximize the visualization "AG Grid"
        await agGridVisualization.clickOnMaximizeRestoreButton('AG Grid');

        // Step 4: Toggle the Show Totals for the visualization "AG Grid"
        await agGridVisualization.toggleShowTotalsByContextMenu('AG Grid');

        // Step 5: Verify grid cell values without subtotals
        await since('The grid cell at row 2, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 2, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'AG Grid'))
            .toBe('AirTran Airways Corporation');
        await since('The grid cell at row 2, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 3, 'AG Grid'))
            .toBe('Sunday');
        await since('The grid cell at row 3, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, 'AG Grid'))
            .toBe('Monday');
        await since('The grid cell at row 9, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(9, 2, 'AG Grid'))
            .toBe('American Airlines Inc.');
        await since('The grid cell at row 9, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(9, 3, 'AG Grid'))
            .toBe('Sunday');

        // Step 6: Sort Within for "Avg Delay (min)"
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Avg Delay (min)',
            'Sort Within',
            null,
            'AG Grid'
        );

        // Verify grid cell values after sorting within (default)
        await since('The grid cell at row 2, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 2, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'AG Grid'))
            .toBe('AirTran Airways Corporation');
        await since('The grid cell at row 2, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 3, 'AG Grid'))
            .toBe('Thursday');
        await since('The grid cell at row 3, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, 'AG Grid'))
            .toBe('Sunday');
        await since('The grid cell at row 9, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(9, 2, 'AG Grid'))
            .toBe('American Airlines Inc.');
        await since('The grid cell at row 9, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(9, 3, 'AG Grid'))
            .toBe('Wednesday');

        // Step 7: Sort "Flights Cancelled" in ascending order
        await reportGridView.sortAscendingBySortIcon('Flights Cancelled');

        // Verify grid cell values after sorting in ascending order
        await since('The grid cell at row 2, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 2, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'AG Grid'))
            .toBe('Mesa Airlines Inc.');
        await since('The grid cell at row 2, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 3, 'AG Grid'))
            .toBe('Sunday');
        await since('The grid cell at row 3, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, 'AG Grid'))
            .toBe('Monday');
        await since('The grid cell at row 9, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(9, 2, 'AG Grid'))
            .toBe('Mesa Airlines Inc.');
        await since('The grid cell at row 9, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(9, 3, 'AG Grid'))
            .toBe('Thursday');

        // Step 8: Clear sorting on "Flights Cancelled"
        await reportGridView.clearSortBySortIcon('Flights Cancelled');

        // Verify grid cell values after clearing sort
        await since('The grid cell at row 2, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 2, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'AG Grid'))
            .toBe('AirTran Airways Corporation');
        await since('The grid cell at row 2, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 3, 'AG Grid'))
            .toBe('Sunday');
        await since('The grid cell at row 3, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, 'AG Grid'))
            .toBe('Monday');
        await since('The grid cell at row 9, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(9, 2, 'AG Grid'))
            .toBe('American Airlines Inc.');
        await since('The grid cell at row 9, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(9, 3, 'AG Grid'))
            .toBe('Sunday');

        // Step 9: Sort "Origin Airport" in descending order
        await agGridVisualization.openContextSubMenuItemForHeader('Origin Airport', 'Sort Descending', null, 'AG Grid');

        // Verify grid cell values after sorting "Origin Airport" in descending order
        await since('The grid cell at row 2, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'AG Grid'))
            .toBe('IAD');
        await since('The grid cell at row 2, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'AG Grid'))
            .toBe('AirTran Airways Corporation');
        await since('The grid cell at row 2, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 3, 'AG Grid'))
            .toBe('Sunday');
        await since('The grid cell at row 3, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, 'AG Grid'))
            .toBe('Monday');
        await since('The grid cell at row 9, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(9, 2, 'AG Grid'))
            .toBe('American Airlines Inc.');
        await since('The grid cell at row 9, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(9, 3, 'AG Grid'))
            .toBe('Sunday');

        // Step 10: Enable subtotals for "Origin Airport"
        await agGridVisualization.toggleShowTotalsFromAttribute('Origin Airport', 'AG Grid', 'Total');

        // Step 9: Sort "Origin Airport" in ascending order
        await agGridVisualization.openContextSubMenuItemForHeader('Origin Airport', 'Sort Ascending', null, 'AG Grid');

        // Verify grid cell values with subtotals
        await since('The grid cell at row 2, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'AG Grid'))
            .toBe('Total');
        await since('The grid cell at row 2, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'AG Grid'))
            .toBe('');
        await since('The grid cell at row 2, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 4, 'AG Grid'))
            .toBe('1,219,500.57');
        await since('The grid cell at row 3, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 3, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'AG Grid'))
            .toBe('Total');
        await since('The grid cell at row 3, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 4, 'AG Grid'))
            .toBe('395,207.98');
        await since('The grid cell at row 4, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 2, 'AG Grid'))
            .toBe('AirTran Airways Corporation');
        await since('The grid cell at row 4, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 3, 'AG Grid'))
            .toBe('Total');
        await since('The grid cell at row 4, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 4, 'AG Grid'))
            .toBe('77,241.28');
        await since('The grid cell at row 5, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(5, 3, 'AG Grid'))
            .toBe('Sunday');

        // Step 11: Sort Within for "Avg Delay (min)" with subtotals
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Avg Delay (min)',
            'Sort Within',
            null,
            'AG Grid'
        );

        // Verify grid cell values after sorting within (default) with subtotals
        await since('The grid cell at row 2, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'AG Grid'))
            .toBe('Total');
        await since('The grid cell at row 2, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'AG Grid'))
            .toBe('');
        await since('The grid cell at row 2, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 4, 'AG Grid'))
            .toBe('1,219,500.57');
        await since('The grid cell at row 3, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 3, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'AG Grid'))
            .toBe('Total');
        await since('The grid cell at row 3, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 4, 'AG Grid'))
            .toBe('395,207.98');
        await since('The grid cell at row 4, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 2, 'AG Grid'))
            .toBe('AirTran Airways Corporation');
        await since('The grid cell at row 4, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 3, 'AG Grid'))
            .toBe('Total');
        await since('The grid cell at row 4, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 4, 'AG Grid'))
            .toBe('77,241.28');
        await since('The grid cell at row 5, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(5, 3, 'AG Grid'))
            .toBe('Thursday');
    });

    it('[TC65147_2] Validate Sort Within and Subtotals in AG Grid', async () => {
        // Step 1: Open the dossier by its ID
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGrid_Metric_Sort.project.id,
            dossierId: gridConstants.AGGrid_Metric_Sort.id,
        });

        await browser.pause(3000);
        // Step 1: Switch to Page 3 in Chapter 1
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        // Step 2: Maximize the visualization "AG Grid"
        await agGridVisualization.clickOnMaximizeRestoreButton('AG Grid');

        // Step 5: Verify initial grid cell values
        await since('The grid cell at row 1, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'AG Grid'))
            .toBe('January');
        await since('The grid cell at row 2, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 3, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'AG Grid'))
            .toBe('AirTran Airways Corporation');
        await since('The grid cell at row 4, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 2, 'AG Grid'))
            .toBe('9,034.60');
        await since('The grid cell at row 4, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 3, 'AG Grid'))
            .toBe('4,717.17');

        // Step 6: Sort Within for "Avg Delay (min)"
        await agGridVisualization.openContextMenuItemForValue(
            'Avg Delay (min)',
            'Sort Within',
            null,
            'AG Grid'
        );

        // Verify grid cell values after sorting within (default)
        await since('The grid cell at row 1, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'AG Grid'))
            .toBe('January');
        await since('The grid cell at row 2, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 3, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'AG Grid'))
            .toBe('AirTran Airways Corporation');
        await since('The grid cell at row 4, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 2, 'AG Grid'))
            .toBe('9,034.60');
        await since('The grid cell at row 4, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 3, 'AG Grid'))
            .toBe('8,120.05');

        // Step 7: Sort "Flights Cancelled" in ascending order
        await reportGridView.sortCellAscendingBySortIcon('Flights Cancelled');

        // Verify grid cell values after sorting in ascending order
        await since('The grid cell at row 1, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'AG Grid'))
            .toBe('January');
        await since('The grid cell at row 2, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 3, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'AG Grid'))
            .toBe('Mesa Airlines Inc.');
        await since('The grid cell at row 4, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 2, 'AG Grid'))
            .toBe('297.00');
        await since('The grid cell at row 4, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 3, 'AG Grid'))
            .toBe('56.50');

        // Step 8: Clear sorting on "Flights Cancelled"
        await reportGridView.clearCellSortBySortIcon('Flights Cancelled');

        // Verify grid cell values after clearing sort
        await since('The grid cell at row 1, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'AG Grid'))
            .toBe('January');
        await since('The grid cell at row 2, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 3, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'AG Grid'))
            .toBe('AirTran Airways Corporation');
        await since('The grid cell at row 4, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 2, 'AG Grid'))
            .toBe('9,034.60');
        await since('The grid cell at row 4, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 3, 'AG Grid'))
            .toBe('4,717.17');

        // Step 9: Sort "Month" attribute in descending order
        await editorPanelForGrid.simpleSort('Month', 'Sort Descending');

        // Verify grid cell values after sorting "Month" in descending order
        await since('The grid cell at row 1, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'AG Grid'))
            .toBe('December');
        await since('The grid cell at row 2, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 3, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'AG Grid'))
            .toBe('AirTran Airways Corporation');
        await since('The grid cell at row 4, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 2, 'AG Grid'))
            .toBe('5,922.51');
        await since('The grid cell at row 4, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 3, 'AG Grid'))
            .toBe('4,223.23');

        // Step 10: Sort Within for "Avg Delay (min)"
        await agGridVisualization.openContextMenuItemForValue(
            'Avg Delay (min)',
            'Sort Within',
            null,
            'AG Grid'
        );

        // Verify grid cell values after sorting within (default)
        await since('The grid cell at row 1, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'AG Grid'))
            .toBe('January');
        await since('The grid cell at row 2, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 3, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'AG Grid'))
            .toBe('AirTran Airways Corporation');
        await since('The grid cell at row 4, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 2, 'AG Grid'))
            .toBe('9,034.60');
        await since('The grid cell at row 4, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 3, 'AG Grid'))
            .toBe('8,120.05');

        // Step 11: Clear sorting on "Avg Delay (min)"
        await reportGridView.clearCellSortBySortIcon('Avg Delay (min)');

        // Verify grid cell values after clearing sort
        await since('The grid cell at row 1, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'AG Grid'))
            .toBe('January');
        await since('The grid cell at row 2, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 3, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'AG Grid'))
            .toBe('AirTran Airways Corporation');
        await since('The grid cell at row 4, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 2, 'AG Grid'))
            .toBe('9,034.60');
        await since('The grid cell at row 4, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 3, 'AG Grid'))
            .toBe('4,717.17');

        // Step 12: Toggle the Show Totals for the visualization "AG Grid"
        await agGridVisualization.toggleShowTotalsByContextMenu('AG Grid');

        // Verify grid cell values with subtotals
        await since('The grid cell at row 3, column 12 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 12, 'AG Grid'))
            .toBe('Total');
        await since('The grid cell at row 4, column 12 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 12, 'AG Grid'))
            .toBe('49,030.43');
        await since('The grid cell at row 4, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 2, 'AG Grid'))
            .toBe('9,034.60');
        await since('The grid cell at row 4, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 3, 'AG Grid'))
            .toBe('4,717.17');

        // Step 13: Sort Within for "Avg Delay (min)" with subtotals
        await agGridVisualization.openContextMenuItemForValue(
            'Avg Delay (min)',
            'Sort Within',
            null,
            'AG Grid'
        );

        // Verify grid cell values after sorting within (default) with subtotals
        await since('The grid cell at row 1, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'AG Grid'))
            .toBe('January');
        await since('The grid cell at row 2, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 3, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'AG Grid'))
            .toBe('AirTran Airways Corporation');
        await since('The grid cell at row 4, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 2, 'AG Grid'))
            .toBe('9,034.60');
        await since('The grid cell at row 4, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 3, 'AG Grid'))
            .toBe('8,120.05');
        await since('The grid cell at row 3, column 12 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 12, 'AG Grid'))
            .toBe('Total');
        await since('The grid cell at row 4, column 12 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 12, 'AG Grid'))
            .toBe('49,030.43');
    });

    it('[TC65147_3] Validate Sort Within and Subtotals in AG Grid on Page 3', async () => {
        // Step 1: Open the dossier by its ID
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGrid_Metric_Sort.project.id,
            dossierId: gridConstants.AGGrid_Metric_Sort.id,
        });

        await browser.pause(3000);
        // Step 1: Switch to Page 3 in Chapter 1
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 3' });
        // Step 2: Maximize the visualization "AG Grid"
        await agGridVisualization.clickOnMaximizeRestoreButton('AG Grid');
        // Step 5: Toggle the Show Totals for the visualization "AG Grid"
        await agGridVisualization.toggleShowTotalsByContextMenu('AG Grid');

        // Step 6: Verify initial grid cell values without subtotals
        await since('The grid cell at row 1, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 4, 'AG Grid'))
            .toBe('2009');
        await since('The grid cell at row 3, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 3, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'AG Grid'))
            .toBe('AirTran Airways Corporation');
        await since('The grid cell at row 3, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, 'AG Grid'))
            .toBe('January');
        await since('The grid cell at row 3, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 4, 'AG Grid'))
            .toBe('2,738.02');
        await since('The grid cell at row 4, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 4, 'AG Grid'))
            .toBe('2,406.32');

        // Step 7: Sort Within for "Avg Delay (min)"
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Avg Delay (min)',
            'Sort Within',
            null,
            'AG Grid'
        );

        // Verify grid cell values after sorting within (default)
        await since('The grid cell at row 1, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 4, 'AG Grid'))
            .toBe('2009');
        await since('The grid cell at row 3, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 3, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'AG Grid'))
            .toBe('AirTran Airways Corporation');
        await since('The grid cell at row 3, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, 'AG Grid'))
            .toBe('June');
        await since('The grid cell at row 3, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 4, 'AG Grid'))
            .toBe('4,596.27');
        await since('The grid cell at row 4, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 3, 'AG Grid'))
            .toBe('July');

        // Step 8: Sort "Flights Cancelled" in ascending order
        await agGridVisualization.sortAscendingBySortIcon('Flights Cancelled', 'AG Grid');
        // Verify grid cell values after sorting in ascending order
        await since('The grid cell at row 1, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 4, 'AG Grid'))
            .toBe('2009');
        await since('The grid cell at row 3, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 3, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'AG Grid'))
            .toBe('American Airlines Inc.');
        await since('The grid cell at row 3, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, 'AG Grid'))
            .toBe('November');
        await since('The grid cell at row 3, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 4, 'AG Grid'))
            .toBe('787.83');
        await since('The grid cell at row 4, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 3, 'AG Grid'))
            .toBe('October');

        // Step 9: Clear sorting on "Flights Cancelled"
        await agGridVisualization.clearSortBySortIcon('Flights Cancelled', 'AG Grid');

        // Verify grid cell values after clearing sort
        await since('The grid cell at row 1, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 4, 'AG Grid'))
            .toBe('2009');
        await since('The grid cell at row 3, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 3, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'AG Grid'))
            .toBe('AirTran Airways Corporation');
        await since('The grid cell at row 3, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, 'AG Grid'))
            .toBe('January');
        await since('The grid cell at row 3, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 4, 'AG Grid'))
            .toBe('2,738.02');
        await since('The grid cell at row 4, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 3, 'AG Grid'))
            .toBe('February');
        await since('The grid cell at row 4, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 4, 'AG Grid'))
            .toBe('2,406.32');

        // Step 10: Sort "Origin Airport" in descending order
        await agGridVisualization.openContextSubMenuItemForHeader('Origin Airport', 'Sort Descending', null, 'AG Grid');

        // Verify grid cell values after sorting "Origin Airport" in descending order
        await since('The grid cell at row 1, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 4, 'AG Grid'))
            .toBe('2009');
        await since('The grid cell at row 3, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'AG Grid'))
            .toBe('IAD');
        await since('The grid cell at row 3, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'AG Grid'))
            .toBe('AirTran Airways Corporation');
        await since('The grid cell at row 3, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, 'AG Grid'))
            .toBe('January');
        await since('The grid cell at row 3, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 4, 'AG Grid'))
            .toBe('773.75');
        await since('The grid cell at row 4, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 3, 'AG Grid'))
            .toBe('February');

        // Step 11: Sort Within for "Avg Delay (min)"
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Avg Delay (min)',
            'Sort Within',
            null,
            'AG Grid'
        );

        // Verify grid cell values after sorting within (default)
        await since('The grid cell at row 1, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 4, 'AG Grid'))
            .toBe('2009');
        await since('The grid cell at row 3, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 3, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'AG Grid'))
            .toBe('AirTran Airways Corporation');
        await since('The grid cell at row 3, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, 'AG Grid'))
            .toBe('June');
        await since('The grid cell at row 3, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 4, 'AG Grid'))
            .toBe('4,596.27');
        await since('The grid cell at row 4, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 3, 'AG Grid'))
            .toBe('July');

        // Step 12: Clear sorting on "Avg Delay (min)"
        await agGridVisualization.clearSortBySortIcon('Avg Delay (min)', 'AG Grid');

        // Verify grid cell values after clearing sort
        await since('The grid cell at row 1, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 4, 'AG Grid'))
            .toBe('2009');
        await since('The grid cell at row 3, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 3, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'AG Grid'))
            .toBe('AirTran Airways Corporation');
        await since('The grid cell at row 3, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, 'AG Grid'))
            .toBe('January');
        await since('The grid cell at row 3, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 4, 'AG Grid'))
            .toBe('2,738.02');
        await since('The grid cell at row 4, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 3, 'AG Grid'))
            .toBe('February');
        await since('The grid cell at row 4, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 4, 'AG Grid'))
            .toBe('2,406.32');

        // Step 13: Toggle the Show Totals for the visualization "AG Grid"
        await agGridVisualization.toggleShowTotalsByContextMenu('AG Grid');

        // Step 14: Enable subtotals for "Origin Airport"
        await agGridVisualization.toggleShowTotalsFromAttribute('Origin Airport', 'AG Grid', 'Total');

        // Verify grid cell values with subtotals
        await since('The grid cell at row 3, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'AG Grid'))
            .toBe('Total');
        await since('The grid cell at row 3, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 4, 'AG Grid'))
            .toBe('595,673.60');
        await since('The grid cell at row 3, column 10 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 10, 'AG Grid'))
            .toBe('473435');
        await since('The grid cell at row 4, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 1, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 4, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 2, 'AG Grid'))
            .toBe('Total');
        await since('The grid cell at row 4, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 4, 'AG Grid'))
            .toBe('191,968.02');
        await since('The grid cell at row 4, column 10 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 10, 'AG Grid'))
            .toBe('206398');
        await since('The grid cell at row 5, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(5, 2, 'AG Grid'))
            .toBe('AirTran Airways Corporation');
        await since('The grid cell at row 5, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(5, 3, 'AG Grid'))
            .toBe('Total');
        await since('The grid cell at row 5, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(5, 4, 'AG Grid'))
            .toBe('37,769.13');
        await since('The grid cell at row 6, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(6, 3, 'AG Grid'))
            .toBe('January');

        // Step 15: Sort Within for "Avg Delay (min)" with subtotals
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Avg Delay (min)',
            'Sort Within',
            null,
            'AG Grid'
        );

        // Verify grid cell values after sorting within (default) with subtotals
        await since('The grid cell at row 3, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'AG Grid'))
            .toBe('Total');
        await since('The grid cell at row 3, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 4, 'AG Grid'))
            .toBe('595,673.60');
        await since('The grid cell at row 3, column 10 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 10, 'AG Grid'))
            .toBe('473435');
        await since('The grid cell at row 4, column 1 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 1, 'AG Grid'))
            .toBe('BWI');
        await since('The grid cell at row 4, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 2, 'AG Grid'))
            .toBe('Total');
        await since('The grid cell at row 4, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 4, 'AG Grid'))
            .toBe('191,968.02');
        await since('The grid cell at row 4, column 10 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 10, 'AG Grid'))
            .toBe('206398');
        await since('The grid cell at row 5, column 2 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(5, 2, 'AG Grid'))
            .toBe('AirTran Airways Corporation');
        await since('The grid cell at row 5, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(5, 3, 'AG Grid'))
            .toBe('Total');
        await since('The grid cell at row 5, column 4 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(5, 4, 'AG Grid'))
            .toBe('37,769.13');
        await since('The grid cell at row 6, column 3 should have text "#{expected}", instead we have "#{actual}"')
            .expect(await agGridVisualization.getGridCellTextByPosition(6, 3, 'AG Grid'))
            .toBe('June');
    });
});
