import * as gridConstants from '../../../../constants/grid.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { browserWindow } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';

describe('Classic Grid Number Format Date', () => {
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

    it('[TC2692_04] Date number format Test', async () => {
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.DateNumberFormatTest.id,
            projectId: gridConstants.DateNumberFormatTest.project.id,
        });
        await gridAuthoring.contextMenuOperations.updateAndSaveNumberFormat(
            'Coverage Start Date',
            '3AR_2MC',
            async () => {
                await gridAuthoring.numberFormatOperations.selectNumberFormatFromDropdown('Date');
                await gridAuthoring.numberFormatOperations.selectNfValueFormatFromDropdown('2020-04-16');
            }
        );

        // And the grid cell in visualization "3AR_2MC" at "2", "2" has text "2009-01-01"
        await since('Grid cell in "3AR_2MC" at "2", "2" should be #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 2, '3AR_2MC'))
            .toBe('2009-01-01');

        // When I select elements "2009-01-01, 12/31/2010" of object "" on grid visualization "3AR_2MC"
        await gridAuthoring.gridCellOperations.selectMultipleElements(['2009-01-01', '12/31/2010'], '3AR_2MC');
        await gridAuthoring.contextMenuOperations.updateAndSaveNumberFormat('12/31/2010', '3AR_2MC', async () => {
            await gridAuthoring.numberFormatOperations.selectNumberFormatFromDropdown('Date');
            await gridAuthoring.numberFormatOperations.selectNfValueFormatFromDropdown('4/16/20 15:41');
        });

        // And the grid cell in visualization "3AR_2MC" at "2", "3" has text "12/31/10 0:00"
        await since('Grid cell in "3AR_2MC" at "2", "3" should be #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 3, '3AR_2MC'))
            .toBe('12/31/10 0:00');

        // When I select elements "2009-01-01, 12/31/10 0:00" of object "" on grid visualization "3AR_2MC"
        await gridAuthoring.gridCellOperations.selectMultipleElements(['2009-01-01', '12/31/10 0:00'], '3AR_2MC');
        await gridAuthoring.contextMenuOperations.updateAndSaveNumberFormat('2009-01-01', '3AR_2MC', async () => {
            await gridAuthoring.numberFormatOperations.selectNfValueFormatFromDropdown('16-Apr');
            await gridAuthoring.numberFormatOperations.moveNfDecimalPlace('increase', 5);
        });

        // Then the grid cell in visualization "3AR_2MC" at "2", "2" has text "1-Jan"
        await since('Grid cell in "3AR_2MC" at "2", "2" should be #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 2, '3AR_2MC'))
            .toBe('1-Jan');
    });
});
