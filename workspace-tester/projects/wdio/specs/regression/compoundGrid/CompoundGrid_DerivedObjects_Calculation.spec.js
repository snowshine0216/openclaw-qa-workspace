import * as gridConstants from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';

describe('Compound Grid Column Set', () => {
    let { loginPage, libraryPage, gridAuthoring } = browsers.pageObj1;

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

    it('[TC62631_01] Column Set Test', async () => {
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.Formatting.id,
            projectId: gridConstants.Formatting.project.id,
        });
        // When I change the selected visualization to "Compound Grid" from context menu
        await gridAuthoring.changeVizToCompoundGrid('Visualization 1');

        // And I switch to Editor Panel tab
        await gridAuthoring.switchToEditorPanel();

        // And I add a column set for the compound grid
        await gridAuthoring.addColumnSet();

        // And I drag "attribute" named "Month" from dataset "retail-sample-data.xls" to Column Set "Column Set 2" in compound grid
        await gridAuthoring.dragDropOperations.dragAttributeToGridColumnSetDZ({
            objectName: 'City',
            datasetName: 'retail-sample-data.xls',
            columnSetName: 'Column Set 2',
        });

        // When I drag "metric" named "Units Available" from dataset "retail-sample-data.xls" to dropzone "Column Set 2" and drop it below "Month"
        await gridAuthoring.dragDropOperations.dragMetricToDropZoneBelowObject({
            objectName: 'Units Available',
            datasetName: 'retail-sample-data.xls',
            dropZone: 'Column Set 2',
            belowObject: 'City',
        });

        const averageCalculation = 'AverageCalculation';

        // When I select elements "Baltimore, Burlington" of object "City" on grid visualization "Visualization 1" and select calculation "AverageCalculation" and then add "Average"
        await gridAuthoring.groupOperations.groupElementsToAverageCalculation({
            elements: ['20th Century Fox', 'A&E Entertainment'],
            visualizationName: 'Visualization 1',
            groupName: averageCalculation,
        });

        // Then The grid visualization "Visualization 1" has object "City" and its element "AverageCalculation"
        await since('The grid cell (3, 2) of "Visualization 1"  should have #{expected}, instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe(averageCalculation);

        await since('The grid cell (3, 3) of "Visualization 1"  should have #{expected}, instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 3, 'Visualization 1'))
            .toBe('$290,553');

        await since('The grid cell (3, 4) of "Visualization 1"  should have #{expected}, instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 4, 'Visualization 1'))
            .toBe('$431,121');

        await since('The grid cell (3, 5) of "Visualization 1"  should have #{expected}, instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 5, 'Visualization 1'))
            .toBe('1,726');

        // When I change the calculation type to "Least" of calculation group "AverageCalculation" in grid visualization "Visualization 1"
        await gridAuthoring.groupOperations.editCalculationGroup({
            newCalculation: 'Least',
            groupName: averageCalculation,
            visualizationName: 'Visualization 1',
        });

        // Then The grid visualization "Visualization 1" has object "City" and its element "AverageCalculation"
        await since('The grid cell (3, 2) of "Visualization 1"  should have #{expected}, instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe(averageCalculation);

        await since('The grid cell (3, 3) of "Visualization 1"  should have #{expected}, instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 3, 'Visualization 1'))
            .toBe('$182,398');

        await since('The grid cell (3, 4) of "Visualization 1"  should have #{expected}, instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 4, 'Visualization 1'))
            .toBe('$259,053');

        await since('The grid cell (3, 5) of "Visualization 1"  should have #{expected}, instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 5, 'Visualization 1'))
            .toBe('979');
    });
});
