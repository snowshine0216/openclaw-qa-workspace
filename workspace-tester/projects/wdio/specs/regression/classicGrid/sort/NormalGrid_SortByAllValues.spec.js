import * as gridConstants from '../../../../constants/grid.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { browserWindow } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';

describe('Classic Grid Sort By All Values', () => {
    let { loginPage, libraryPage, gridAuthoring, datasetsPanel, tocContentsPanel, agGridVisualization } =
        browsers.pageObj1;
    const gridContainer = 'Grid';
    const sortByAllValues = 'Sort All Values';
    const sortWithSubtotals = 'Sort with Subtotals';

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

    it('[TC6519] Validate metric Sort by All Values/Subtotals in grid', async () => {
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.TC6519Sort.id,
            projectId: gridConstants.TC6519Sort.project.id,
        });

        // await gridAuthoring.moveContainerByPosition(gridContainer, compoundGridContainer, 'top');
        await since(
            'The grid cell in visualization "Grid" at "2", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 1, gridContainer))
            .toBe('BWI');

        await agGridVisualization.toggleShowTotalsByContextMenu(gridContainer);
        await gridAuthoring.contextMenuOperations.selectContextMenuOptionFromHeader({
            objectName: 'Avg Delay (min)',
            option: sortWithSubtotals,
            visualizationName: gridContainer,
        });
        await since('Grid cell at (2, 1) should have #{expected}, instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 1, gridContainer))
            .toBe('Total');
        await gridAuthoring.contextMenuOperations.selectContextMenuOptionFromHeader({
            objectName: 'Avg Delay (min)',
            option: sortByAllValues,
            visualizationName: gridContainer,
        });
        await since(
            'The grid cell in visualization "Grid" at "2", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 1, gridContainer))
            .toBe('Total');
        await since(
            'The grid cell in visualization "Grid" at "3", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 1, gridContainer))
            .toBe('DCA');

        await gridAuthoring.sortOperations.clearSortFromViz({
            objectName: 'Avg Delay (min)',
            visualizationName: gridContainer,
        });
        await since('Grid cell at (2, 1) should have #{expected}, instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 1, gridContainer))
            .toBe('Total');
    });
});
