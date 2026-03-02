import * as gridConstants from '../../../../constants/grid.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { browserWindow } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';

describe('Classic Grid Number Format Time', () => {
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

    it('[TC2692_05] Time number format Test', async () => {
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.TimeNumberFormatTest.id,
            projectId: gridConstants.TimeNumberFormatTest.project.id,
        });
        await gridAuthoring.clickContainerByScript('2A2MR_1AC');

        // Then the grid cell in visualization "2A2MR_1AC" at "2", "1" has text "10/1/2007"
        await since('Grid cell in "2A2MR_1AC" at "2", "1" should be #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 1, '2A2MR_1AC'))
            .toBe('10/1/2007');

        // And the grid cell in visualization "2A2MR_1AC" at "4", "1" has text "3/5/2008"
        await since('Grid cell in "2A2MR_1AC" at "4", "1" should be #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(4, 1, '2A2MR_1AC'))
            .toBe('3/5/2008');
        await gridAuthoring.contextMenuOperations.updateAndSaveNumberFormat('Coverage Start Date', 'Rows', async () => {
            await gridAuthoring.numberFormatOperations.selectNumberFormatFromDropdown('Time');
            await gridAuthoring.numberFormatOperations.selectNfValueFormatFromDropdown('3:41 PM');
        });

        // And the grid cell in visualization "2A2MR_1AC" at "2", "1" has text "12:00 AM"
        await since('Grid cell in "2A2MR_1AC" at "2", "1" should be #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 1, '2A2MR_1AC'))
            .toBe('12:00 AM');

        // When I select elements "12:00 AM, 12/31/2010" of object "" on grid visualization "2A2MR_1AC"
        await gridAuthoring.gridCellOperations.selectMultipleElements(['12:00 AM', '12/31/2010'], '2A2MR_1AC');
        await gridAuthoring.contextMenuOperations.updateAndSaveNumberFormat('12/31/2010', '2A2MR_1AC', async () => {
            await gridAuthoring.numberFormatOperations.selectNumberFormatFromDropdown('Time');
            await gridAuthoring.numberFormatOperations.selectNfValueFormatFromDropdown('4/16/20 15:41');
        });

        // And the grid cell in visualization "2A2MR_1AC" at "2", "2" has text "12/31/10 0:00"
        await since('Grid cell in "2A2MR_1AC" at "2", "2" should be #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 2, '2A2MR_1AC'))
            .toBe('12/31/10 0:00');

        // When I select elements "12:00 AM, 12/31/10 0:00" of object "" on grid visualization "2A2MR_1AC"
        await gridAuthoring.gridCellOperations.selectMultipleElements(['12:00 AM', '12/31/10 0:00'], '2A2MR_1AC');
        await gridAuthoring.contextMenuOperations.updateAndSaveNumberFormat('12:00 AM', '2A2MR_1AC', async () => {
            await gridAuthoring.numberFormatOperations.selectNfValueFormatFromDropdown('15:41:46');
            await gridAuthoring.numberFormatOperations.moveNfDecimalPlace('increase', 5);
        });

        // Then the grid cell in visualization "2A2MR_1AC" at "2", "1" has text "0:00:00"
        await since('Grid cell in "2A2MR_1AC" at "2", "1" should be #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 1, '2A2MR_1AC'))
            .toBe('0:00:00');
    });
});
