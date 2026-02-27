import * as gridConstants from '../../../../constants/grid.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { browserWindow } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';

describe('Classic Grid Sort and Advanced Sort', () => {
    let { loginPage, libraryPage, gridAuthoring, editorPanelForGrid } = browsers.pageObj1;

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

    it('[TC2695] Sort and Advanced Sort in Normal Grid', async () => {
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.SortAndAdvancedSortInNormalGrid.id,
            projectId: gridConstants.SortAndAdvancedSortInNormalGrid.project.id,
        });
        await gridAuthoring.clickContainer('Visualization 1');

        // Then the grid cell in visualization "Visualization 1" at "3", "1" has text "Admin Services"
        await since(
            'Grid cell in visualization "Visualization 1" at "3", "1" should have #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Admin Services');

        // And the grid cell in visualization "Visualization 1" at "3", "2" has text "None"
        await since(
            'Grid cell in visualization "Visualization 1" at "3", "2" should have #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('None');

        // And the grid cell in visualization "Visualization 1" at "1", "3" has text "Need to fix in Main - Code Change"
        await since(
            'Grid cell in visualization "Visualization 1" at "1", "3" should have #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 3, 'Visualization 1'))
            .toBe('Need to fix in Main - Code Change');

        // And the grid cell in visualization "Visualization 2" at "2", "1" has text "Admin Services"
        await since(
            'Grid cell in visualization "Visualization 2" at "2", "1" should have #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 1, 'Visualization 2'))
            .toBe('Admin Services');

        // And the grid cell in visualization "Visualization 3" at "2", "1" has text "46"
        await since(
            'Grid cell in visualization "Visualization 3" at "2", "1" should have #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 1, 'Visualization 3'))
            .toBe('62');

        // When I sort the attribute "Area" in descending order from grid visualization "Visualization 1"
        await gridAuthoring.sortOperations.sortDescending({ objectName: 'Area' });

        // Then the grid cell in visualization "Visualization 1" at "3", "1" has text "Workstation"
        await since(
            'Grid cell in visualization "Visualization 1" at "3", "1" should have #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Workstation');

        // And the grid cell in visualization "Visualization 1" at "3", "2" has text "None"
        await since(
            'Grid cell in visualization "Visualization 1" at "3", "2" should have #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('None');

        // And the grid cell in visualization "Visualization 1" at "1", "3" has text "Need to fix in Main - Code Change"
        await since(
            'Grid cell in visualization "Visualization 1" at "1", "3" should have #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 3, 'Visualization 1'))
            .toBe('Need to fix in Main - Code Change');

        // When I sort the "attribute" named "Issue Category (Defect)" in "Sort Descending" in Editor Panel
        await editorPanelForGrid.simpleSort('Issue Category (Defect)', 'Sort Descending');

        // Then the grid cell in visualization "Visualization 1" at "3", "1" has text "Analytic Services"
        await since('Grid cell at "3", "1" in "Visualization 1" should have #{expected}, instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Analytic Services');

        // And the grid cell in visualization "Visualization 1" at "3", "2" has text "Stability"
        await since('Grid cell at "3", "2" in "Visualization 1" should have #{expected}, instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('Stability');

        // And the grid cell in visualization "Visualization 1" at "1", "3" has text "Need to fix in Main - Code Change"
        await since('Grid cell at "1", "3" in "Visualization 1" should have #{expected}, instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 3, 'Visualization 1'))
            .toBe('Need to fix in Main - Code Change');

        // When I open Advanced Sort for the "attribute" named "Issue Category (Defect)" in the Grid Editor Panel
        await editorPanelForGrid.openAdvancedSortEditor('Issue Category (Defect)');
        await gridAuthoring.sortOperations.createAndSaveAdvancedSort({
            rowOrders: [{ columnOrder: 2, objectName: 'Area', sortOrder: 'Descending' }],
            columnOrders: [{ columnOrder: 1, objectName: 'Resolution', sortOrder: 'Descending' }],
        });

        // Then the grid cell in visualization "Visualization 1" at "3", "1" has text "Data Preparation"
        await since('Grid cell at "3", "1" in "Visualization 1" should have #{expected}, instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Data Preparation');

        // And the grid cell in visualization "Visualization 1" at "3", "2" has text "Stability"
        await since(
            'Grid cell in visualization "Visualization 1" at "3", "2" should have #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('Stability');

        // And the grid cell in visualization "Visualization 1" at "1", "3" has text "Not an Issue - Not a Defect"
        await since(
            'Grid cell in visualization "Visualization 1" at "1", "3" should have #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 3, 'Visualization 1'))
            .toBe('Not an Issue - Not a Defect');

        // When I open the Advanced Sort editor for object "Area" from the grid visualization "Visualization 1"
        await gridAuthoring.sortOperations.openAdvancedSortEditor({
            objectName: 'Area',
        });
        await gridAuthoring.sortOperations.createAndSaveAdvancedSort({
            dragSortActions: [{ srcSortRow: 2, desPosition: 'above', desSortRow: 1 }],
        });

        // Then the grid cell in visualization "Visualization 1" at "3", "1" has text "Workstation"
        await since(
            'Grid cell in visualization "Visualization 1" at "3", "1" should have #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Workstation');

        // And the grid cell in visualization "Visualization 1" at "3", "2" has text "None"
        await since(
            'Grid cell in visualization "Visualization 1" at "3", "2" should have #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('None');

        // And the grid cell in visualization "Visualization 1" at "1", "3" has text "Not an Issue - Not a Defect"
        await since(
            'Grid cell in visualization "Visualization 1" at "1", "3" should have #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 3, 'Visualization 1'))
            .toBe('Not an Issue - Not a Defect');

        // When I sort the "attribute" named "Issue Category (Defect)" in "Sort Descending" in Editor Panel
        await editorPanelForGrid.simpleSort('Issue Category (Defect)', 'Sort Descending');

        // Then the grid cell in visualization "Visualization 2" at "2", "1" has text "Admin Services"
        await since(
            'Grid cell in visualization "Visualization 2" at "2", "1" should have #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 1, 'Visualization 2'))
            .toBe('Admin Services');

        // And the grid cell in visualization "Visualization 2" at "2", "2" has text "Stability"
        await since(
            'Grid cell in visualization "Visualization 2" at "2", "2" should have #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 2, 'Visualization 2'))
            .toBe('None');

        // And the grid cell in visualization "Visualization 2" at "2", "3" has text "None"
        await since(
            'Grid cell in visualization "Visualization 2" at "2", "3" should have #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 3, 'Visualization 2'))
            .toBe('None');

        // When I open Advanced Sort for the "attribute" named "Issue Category (Defect)" in the Grid Editor Panel
        await editorPanelForGrid.openAdvancedSortEditor('Issue Category (Defect)');
        await gridAuthoring.sortOperations.createAndSaveAdvancedSort({
            rowOrders: [
                { columnOrder: 2, objectName: 'Area', sortOrder: 'Descending' },
                // { columnOrder: 3, objectName: 'Resolution', sortOrder: 'Descending' },
            ],
            columnOrders: [{ columnOrder: 3, objectName: 'Resolution', sortOrder: 'Descending' }],
            dragSortActions: [{ srcSortRow: 2, desPosition: 'above', desSortRow: 1 }],
        });

        // Then the grid cell in visualization "Visualization 2" at "2", "1" has text "Workstation"
        await since(
            'Grid cell in visualization "Visualization 2" at "2", "1" should have #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 1, 'Visualization 2'))
            .toBe('Admin Services');

        // And the grid cell in visualization "Visualization 2" at "3", "3" has text "Not an Issue - Not a Defect"
        await since(
            'Grid cell in visualization "Visualization 2" at "3", "3" should have #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 3, 'Visualization 2'))
            .toBe('None');

        // And the grid cell in visualization "Visualization 2" at "4", "1" has text "None"
        await since(
            'Grid cell in visualization "Visualization 2" at "4", "1" should have #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(4, 1, 'Visualization 2'))
            .toBe('Performance');

        // When I click on container "Visualization 3" from canvas
        await gridAuthoring.clickContainer('Visualization 3');

        // And I click the sort descending icon for "metric" named "# Defects" from Editor Panel
        await gridAuthoring.sortOperations.sortDescendingFromDropZone('# Defects');

        // And the grid cell in visualization "Visualization 3" at "2", "1" has text "46"
        await since(
            'Grid cell in visualization "Visualization 3" at "2", "1" should have #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 1, 'Visualization 3'))
            .toBe('62');
    });
});
