import * as gridConstants from '../../../../constants/grid.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { browserWindow } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';

describe('Classic Grid Sort Within', () => {
    let { loginPage, libraryPage, gridAuthoring, agGridVisualization } = browsers.pageObj1;
    const gridContainer = 'Grid';
    const sortWithinDefault = 'Sort Within (Default)';

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

    it('[TC6514] Validate Sort Within (Default) sorting on metrics in grid', async () => {
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.TC6519Sort.id,
            projectId: gridConstants.TC6519Sort.project.id,
        });

        // await gridAuthoring.moveContainerByPosition(gridContainer, compoundGridTitle, 'top');
        await agGridVisualization.toggleShowTotalsByContextMenu(gridContainer);
        await gridAuthoring.contextMenuOperations.selectContextMenuOptionFromHeader({
            objectName: 'Avg Delay (min)',
            option: sortWithinDefault,
            visualizationName: gridContainer,
        });
        await since(
            'The grid cell in visualization "Grid" at "3", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 1, gridContainer))
            .toBe('BWI');
        // When I sort the metric "Flights Cancelled" in ascending order from visualization "Grid"
        await gridAuthoring.sortOperations.sortAscendingFromViz({
            objectName: 'Avg Delay (min)',
            visualizationName: gridContainer,
        });

        // Then the grid cell in visualization "Grid" at "2", "1" has text "BWI"
        await since(
            'The grid cell in visualization "Grid" at "3", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 2, gridContainer))
            .toBe('Total');

        // When I sort the attribute "Origin Airport" in descending order from visualization "Grid"
        await gridAuthoring.sortOperations.sortDescendingFromViz({
            objectName: 'Avg Delay (min)',
            visualizationName: gridContainer,
        });
    });
});
