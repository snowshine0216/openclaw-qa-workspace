import * as gridConstants from '../../../../constants/grid.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { browserWindow } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';

describe('Classic Grid Number Format Percentage', () => {
    let { loginPage, libraryPage, gridAuthoring } = browsers.pageObj1;
    const vizName = '3AR_2MC';

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

    it('[TC2692_03] Percentage number format Test', async () => {
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.DateNumberFormatTest.id,
            projectId: gridConstants.DateNumberFormatTest.project.id,
        });

        await gridAuthoring.sleep(2000);

        await gridAuthoring.contextMenuOperations.updateAndSaveNumberFormat(
            'Operating Expenditure',
            vizName,
            async () => {
                await gridAuthoring.numberFormatOperations.clickNfShortcutIcon('%');
            }
        );

        // Then the grid cell in visualization "2MR_1AC" at "2", "2" has text "866134578%"
        await since('Grid cell at "2", "4" should be #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 4, vizName))
            .toBe('477192608%');

        await gridAuthoring.contextMenuOperations.updateAndSaveNumberFormat('477192608%', vizName, async () => {
            await gridAuthoring.numberFormatOperations.clickNfShortcutIcon('percentage');
            await gridAuthoring.numberFormatOperations.selectNfNegativeForm('(12%)', 'red');
        });

        // Then the grid cell in visualization "3AR_2MC" at "2", "4" has text "477192608%"
        await since('Grid cell in "3AR_2MC" at "2", "4" should be #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 4, vizName))
            .toBe('477192608%');

        // And the grid cell in visualization "3AR_2MC" at "3", "3" has text "23372143%"
        await since('Grid cell in "3AR_2MC" at "3", "3" should be #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 3, vizName))
            .toBe('23372143%');
        await gridAuthoring.contextMenuOperations.updateAndSaveNumberFormat('477192608%', vizName, async () => {
            await gridAuthoring.numberFormatOperations.selectNfNegativeForm('12%', 'black');
        });

        // Then the grid cell in visualization "3AR_2MC" at "2", "4" has text "477192608%"
        await since(
            'Grid cell in visualization "3AR_2MC" at "2", "4" should have 477192608%, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 4, vizName))
            .toBe('477192608%');

        // And the grid cell in visualization "3AR_2MC" at "3", "3" has text "23372143%"
        await since('Grid cell in visualization "3AR_2MC" at "3", "3" should have 23372143%, instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 3, vizName))
            .toBe('23372143%');
        await gridAuthoring.contextMenuOperations.updateAndSaveNumberFormat(
            'Operating Expenditure',
            'Metrics',
            async () => {
                await gridAuthoring.numberFormatOperations.selectNumberFormatFromDropdown('Percentage');
                await gridAuthoring.numberFormatOperations.moveNfDecimalPlace('increase', 2);
                await gridAuthoring.numberFormatOperations.moveNfDecimalPlace('decrease', 1);
            }
        );

        // Then the grid cell in visualization "2A2MR_1AC" at "2", "4" has text "7862909.0%"
        await since('Grid cell in "2A2MR_1AC" at "2", "4" should be #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 4, vizName))
            .toBe('477192608.0%');
        await gridAuthoring.contextMenuOperations.updateAndSaveNumberFormat(
            'Operating Expenditure',
            'metric',
            async () => {
                await gridAuthoring.numberFormatOperations.clickNfShortcutIcon('%');
                await gridAuthoring.numberFormatOperations.moveNfDecimalPlace('increase', 4);
            },
            'campaign-finance-sample-data.xls'
        );
        // And the grid cell in visualization "3AR_2MC" at "2", "4" has text "477192608%"
        await since('Grid cell in "3AR_2MC" at "2", "4" should be #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 4, vizName))
            .toBe('477192608.0%');
    });
});
