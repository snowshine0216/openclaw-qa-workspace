import * as gridConstants from '../../../../constants/grid.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { browserWindow } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';

describe('Classic Grid Number Format Fraction', () => {
    let { loginPage, libraryPage, gridAuthoring } = browsers.pageObj1;

    const vizName = '1AR_1A2MC';

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

    it('[TC2692_02] Fraction and scientific number format Test', async () => {
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.FourGridsCampaignFinanceDataset.id,
            projectId: gridConstants.FourGridsCampaignFinanceDataset.project.id,
        });

        await gridAuthoring.contextMenuOperations.updateAndSaveNumberFormat(
            'Operating Expenditure',
            vizName,
            async () => {
                await gridAuthoring.numberFormatOperations.selectNumberFormatFromDropdown('Fraction');
            }
        );

        // Then the grid cell in visualization "2MR_1AC" at "3", "2" has text "8661345 7/9"
        await since(`Grid cell in "${vizName}" at "3", "2" should be #{expected} instead we have #{actual}`)
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 2, vizName))
            .toBe('3889419 5/7');

        await gridAuthoring.contextMenuOperations.updateAndSaveNumberFormat('3889419 5/7', vizName, async () => {
            await gridAuthoring.numberFormatOperations.selectNfValueFormatFromDropdown('998/81');
        });

        // Then the grid cell in visualization "2MR_1AC" at "2", "2" has text "433067289/50"
        await since(`Grid cell in "${vizName}" at "3", "2" should be #{expected} instead we have #{actual}`)
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 2, vizName))
            .toBe('38894197/10');
        await gridAuthoring.contextMenuOperations.updateAndSaveNumberFormat(
            'Operating Expenditure',
            vizName,
            async () => {
                await gridAuthoring.numberFormatOperations.selectNumberFormatFromDropdown('Fraction');
                await gridAuthoring.numberFormatOperations.selectNfValueFormatFromDropdown('12 26/81');
                await gridAuthoring.numberFormatOperations.moveNfDecimalPlace('increase', 4);
                await gridAuthoring.numberFormatOperations.moveNfDecimalPlace('decrease', 2);
            }
        );

        // Then the grid cell in visualization "1AR_1A2MC" at "3", "2" has text "3889419 7/10"
        await since(`Grid cell in "${vizName}" at "3", "2" should be #{expected} instead we have #{actual}`)
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 2, vizName))
            .toBe('3889419 7/10');

        // And the grid cell in visualization "1AR_1A2MC" at "4", "2" has text "4771926 2/25"
        await since(`Grid cell in "${vizName}" at "4", "2" should be #{expected} instead we have #{actual}`)
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(4, 2, vizName))
            .toBe('4771926 2/25');

        // And the grid cell in visualization "1AR_1A2MC" at "4", "3" has text "4597440.23"
        await since(`Grid cell in "${vizName}" at "4", "3" should be #{expected} instead we have #{actual}`)
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(4, 3, vizName))
            .toBe('4597440.23');
        await gridAuthoring.contextMenuOperations.updateAndSaveNumberFormat('4771926.08', '3AR_2MC', async () => {
            await gridAuthoring.numberFormatOperations.selectNumberFormatFromDropdown('Scientific');
        });

        // Then the grid cell in visualization "3AR_2MC" at "2", "4" has text "5E+06"
        await since('Grid cell in "3AR_2MC" at "2", "4" should be #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 4, '3AR_2MC'))
            .toBe('5E+06');

        // And the grid cell in visualization "3AR_2MC" at "3", "3" has text "2E+05"
        await since('Grid cell in "3AR_2MC" at "3", "3" should be #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 3, '3AR_2MC'))
            .toBe('2E+05');
        await gridAuthoring.contextMenuOperations.updateAndSaveNumberFormat('5E+06', '3AR_2MC', async () => {
            await gridAuthoring.numberFormatOperations.moveNfDecimalPlace('increase', 2);
        });

        // Then the grid cell in visualization "3AR_2MC" at "2", "4" has text "4.77E+06"
        await since('Grid cell in "3AR_2MC" at "2", "4" should be #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 4, '3AR_2MC'))
            .toBe('4.77E+06');

        // And the grid cell in visualization "3AR_2MC" at "3", "3" has text "2.34E+05"
        await since('Grid cell in "3AR_2MC" at "3", "3" should be #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 3, '3AR_2MC'))
            .toBe('2.34E+05');
    });
});
