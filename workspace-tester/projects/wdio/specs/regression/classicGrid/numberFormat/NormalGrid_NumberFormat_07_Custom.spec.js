import * as gridConstants from '../../../../constants/grid.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { browserWindow } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';

describe('Classic Grid Number Format Custom', () => {
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

    it('[TC2692_07] Custom Number Format Test', async () => {
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.FourGridsCampaignFinanceDataset.id,
            projectId: gridConstants.FourGridsCampaignFinanceDataset.project.id,
        });
        await gridAuthoring.contextMenuOperations.updateAndSaveNumberFormat(
            'Operating Expenditure',
            'metric',
            async () => {
                await gridAuthoring.numberFormatOperations.selectNumberFormatFromDropdown('Custom');
            },
            'campaign-finance-sample-data.xls'
        );

        // Then the grid cell in visualization "2MR_1AC" at "2", "2" has text "8661345.78"
        await since('Grid cell in "2MR_1AC" at "2", "2" should be #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 2, '2MR_1AC'))
            .toBe('8661345.78');

        // And the grid cell in visualization "1AR_1A2MC" at "3", "2" has text "3889419.7"
        await since('Grid cell in "1AR_1A2MC" at "3", "2" should be #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 2, '1AR_1A2MC'))
            .toBe('3889419.7');

        // And the grid cell in visualization "3AR_2MC" at "2", "4" has text "4771926.08"
        await since('Grid cell in "3AR_2MC" at "2", "4" should be #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 4, '3AR_2MC'))
            .toBe('4771926.08');

        // And the grid cell in visualization "2A2MR_1AC" at "2", "4" has text "78629.09"
        await since('Grid cell in "2A2MR_1AC" at "2", "4" should be #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 4, '2A2MR_1AC'))
            .toBe('78629.09');

        // And the grid cell in visualization "1AR_1A2MC" at "3", "3" has text "4607706.07"
        await since('Grid cell in "1AR_1A2MC" at "3", "3" should be #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 3, '1AR_1A2MC'))
            .toBe('4607706.07');
        await gridAuthoring.contextMenuOperations.updateAndSaveNumberFormat(
            'Operating Expenditure',
            'metric',
            async () => {
                await gridAuthoring.numberFormatOperations.selectNumberFormatFromDropdown('Custom');
                await gridAuthoring.numberFormatOperations.clickNfCondense();
            },
            'campaign-finance-sample-data.xls'
        );

        // Then the grid cell in visualization "2MR_1AC" at "2", "2" has text "9M"
        await since('Grid cell in "2MR_1AC" at "2", "2" should be #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 2, '2MR_1AC'))
            .toBe('9M');

        // And the grid cell in visualization "1AR_1A2MC" at "3", "2" has text "4M"
        await since('Grid cell in "1AR_1A2MC" at "3", "2" should be #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 2, '1AR_1A2MC'))
            .toBe('4M');

        // And the grid cell in visualization "3AR_2MC" at "2", "4" has text "5M"
        await since('Grid cell in "3AR_2MC" at "2", "4" should be #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 4, '3AR_2MC'))
            .toBe('5M');

        // And the grid cell in visualization "2A2MR_1AC" at "2", "4" has text "79K"
        await since('Grid cell in "2A2MR_1AC" at "2", "4" should be #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 4, '2A2MR_1AC'))
            .toBe('79K');

        // And the grid cell in visualization "1AR_1A2MC" at "3", "3" has text "4607706.07"
        await since('Grid cell in "1AR_1A2MC" at "3", "3" should be #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 3, '1AR_1A2MC'))
            .toBe('4607706.07');
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.CustomNumberFormattingTest.id,
            projectId: gridConstants.CustomNumberFormattingTest.project.id,
        });

        await gridAuthoring.sleep(5000);

        await gridAuthoring.contextMenuOperations.updateAndSaveNumberFormat(
            'Operating Expenditure',
            '1AR_1A2MC',
            async () => {
                await gridAuthoring.numberFormatOperations.selectNumberFormatFromDropdown('Custom');
                await gridAuthoring.numberFormatOperations.moveNfDecimalPlace('increase', 3);
                await gridAuthoring.numberFormatOperations.moveNfDecimalPlace('decrease', 1);
            }
        );

        // Then the grid cell in visualization "1AR_1A2MC" at "3", "2" has text "3889419.7"
        await since('Grid cell in "1AR_1A2MC" at "3", "2" should be #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 2, '1AR_1A2MC'))
            .toBe('3889419.7');

        // And the grid cell in visualization "1AR_1A2MC" at "4", "2" has text "4771926.08"
        await since('Grid cell in "1AR_1A2MC" at "4", "2" should be #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(4, 2, '1AR_1A2MC'))
            .toBe('4771926.08');

        // And the grid cell in visualization "1AR_1A2MC" at "4", "3" has text "4597440.23"
        await since('Grid cell in "1AR_1A2MC" at "4", "3" should be #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(4, 3, '1AR_1A2MC'))
            .toBe('4597440.23');
        await gridAuthoring.contextMenuOperations.updateAndSaveNumberFormat('3889419.7', '1AR_1A2MC', async () => {
            await gridAuthoring.numberFormatOperations.selectNumberFormatFromDropdown('Custom');
            await gridAuthoring.numberFormatOperations.clickNfCondense();
            await gridAuthoring.numberFormatOperations.moveNfDecimalPlace('increase', 3);
            await gridAuthoring.numberFormatOperations.moveNfDecimalPlace('decrease', 1);
        });

        // Then the grid cell in visualization "1AR_1A2MC" at "3", "2" has text "3.89M"
        await since('Grid cell in "1AR_1A2MC" at "3", "2" should be #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 2, '1AR_1A2MC'))
            .toBe('3.89M');

        // And the grid cell in visualization "1AR_1A2MC" at "4", "2" has text "4.77M"
        await since('Grid cell in "1AR_1A2MC" at "4", "2" should be #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(4, 2, '1AR_1A2MC'))
            .toBe('4.77M');

        // And the grid cell in visualization "1AR_1A2MC" at "4", "3" has text "4597440.23"
        await since('Grid cell in "1AR_1A2MC" at "4", "3" should be #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(4, 3, '1AR_1A2MC'))
            .toBe('4597440.23');
    });
});
