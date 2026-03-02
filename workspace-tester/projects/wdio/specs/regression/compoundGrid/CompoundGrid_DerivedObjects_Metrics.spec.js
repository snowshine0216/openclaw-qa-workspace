import * as gridConstants from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';

describe('Compound Grid Derived Attribute', () => {
    let { loginPage, libraryPage, gridAuthoring, editorPanelForGrid, derivedMetricEditor } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridTestUser);
        await setWindowSize(browserWindow);
    });
    beforeEach(async () => {
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.CompoundGridDerivedObjects.id,
            projectId: gridConstants.CompoundGridDerivedObjects.project.id,
        });
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.handleError();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });
    it('[TC62631_05] Derived Metric Editor Test', async () => {
        await editorPanelForGrid.createMetric('Avg Delay (min)');
        const metricName = 'Max(Avg Delay (min))';
        await derivedMetricEditor.createDerivedMetricUsingFormula({
            metricName,
            metricDefinition: 'Max([Avg Delay (min)])',
        });
        const columnSetObjectTexts = await editorPanelForGrid.getColumnSetObjectTexts('Column Set 2');
        await since(
            `The editor panel should have derived metric named ${metricName} on Column Set 2 section, instead we have #{actual}`
        )
            .expect(columnSetObjectTexts.includes(metricName))
            .toBe(true);
        await since(
            'The editor panel should have metric named Avg Delay (min) on Column Set 2 section, instead we have #{actual}'
        )
            .expect(columnSetObjectTexts.includes('Avg Delay (min)'))
            .toBe(true);
        await gridAuthoring.gridCellOperations.moveScrollBar('right', 500, 'Visualization 1');
        await since(
            'The grid cell in visualization "Visualization 1" at "1", "18" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 18, 'Visualization 1'))
            .toBe('Max(Avg Delay (min))');
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "18" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 18, 'Visualization 1'))
            .toBe('103.00');
        await since(
            'The grid cell in visualization "Visualization 1" at "4", "17" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(4, 17, 'Visualization 1'))
            .toBe('396.00');
        await gridAuthoring.contextMenuOperations.selectContextMenuOptionFromElement({
            objectName: metricName,
            option: 'Sort All Values',
            visualizationName: 'Visualization 1',
        });
        await since(
            'Grid cell in visualization "Visualization 1" at "3", "18" should have #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 18, 'Visualization 1'))
            .toBe('1,027.00');
        await since(
            'Grid cell in visualization "Visualization 1" at "4", "18" should have #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(4, 18, 'Visualization 1'))
            .toBe('944.00');
        await gridAuthoring.contextMenuOperations.selectContextMenuOptionFromElement({
            objectName: metricName,
            option: 'Show Totals',
            visualizationName: 'Visualization 1',
        });

        await gridAuthoring.gridCellOperations.moveScrollBar('left', 500, 'Visualization 1');
        await since('Grid cell at (3, 1) in Visualization 1 should have "Total", instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Total');
        await since('Grid cell at (4, 2) in Visualization 1 should have "Total", instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(4, 2, 'Visualization 1'))
            .toBe('Total');
        await since('Grid cell at (6, 2) in Visualization 1 should have "Total", instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(4, 3, 'Visualization 1'))
            .toBe('145');
    });
});
