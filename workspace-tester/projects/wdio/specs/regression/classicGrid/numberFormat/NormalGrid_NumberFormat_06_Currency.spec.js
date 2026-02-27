import * as gridConstants from '../../../../constants/grid.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { browserWindow } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';

describe('Classic Grid Number Format Currency', () => {
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

    it('[TC2692_06] Currency number format Test', async () => {
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.DateNumberFormatTest.id,
            projectId: gridConstants.DateNumberFormatTest.project.id,
        });
        await gridAuthoring.sleep(2000);
        await gridAuthoring.contextMenuOperations.updateAndSaveNumberFormat(
            'Operating Expenditure',
            vizName,
            async () => {
                await gridAuthoring.numberFormatOperations.clickNfShortcutIcon('$');
            }
        );
        await since('Grid cell at "2", "4" should have text #{expected} instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 4, vizName))
            .toBe('$4,771,926');
        await gridAuthoring.contextMenuOperations.updateAndSaveNumberFormat(
            'Operating Expenditure',
            vizName,
            async () => {
                await gridAuthoring.numberFormatOperations.selectNumberFormatFromDropdown('Currency');
                await gridAuthoring.numberFormatOperations.selectNfCurrencyPositionFromDropdown('Left with space');
            }
        );
        await since('Grid cell in  at "2", "4" should have #{expected}, instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 4, vizName))
            .toBe('$ 4,771,926');
        await gridAuthoring.contextMenuOperations.updateAndSaveNumberFormat('$ 4,771,926', vizName, async () => {
            await gridAuthoring.numberFormatOperations.clickNfShortcutIcon('currency');
            await gridAuthoring.numberFormatOperations.selectNfCurrencySymbolFromDropdown('€');
            // await gridAuthoring.numberFormatOperations.selectNfNegativeForm('(€1,234)', true);
        });
        await since('Grid cell at "2", "4" should have #{expected}, instead we have #{actual}')
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 4, vizName))
            .toBe('€ 4,771,926');
        await gridAuthoring.contextMenuOperations.updateAndSaveNumberFormat('€ 4,771,926', vizName, async () => {
            await gridAuthoring.numberFormatOperations.selectNfCurrencyPositionFromDropdown('Right');
            await gridAuthoring.numberFormatOperations.selectNfNegativeForm('(1,234€)', false);
        });
        await since(
            'Grid cell in visualization "3AR_2MC" at "2", "4" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 4, vizName))
            .toBe('4,771,926€');

        await gridAuthoring.contextMenuOperations.updateAndSaveNumberFormat(
            'Operating Expenditure',
            'Metrics',
            async () => {
                await gridAuthoring.numberFormatOperations.selectNumberFormatFromDropdown('Currency');
                await gridAuthoring.numberFormatOperations.moveNfDecimalPlace('increase', 2);
                await gridAuthoring.numberFormatOperations.moveNfDecimalPlace('decrease', 1);
                await gridAuthoring.numberFormatOperations.selectNfCurrencySymbolFromDropdown('€');
                await gridAuthoring.numberFormatOperations.selectNfCurrencyPositionFromDropdown('Right with space');
            }
        );
        await since(
            'Grid cell in visualization "2A2MR_1AC" at "2", "4" should have #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 4, vizName))
            .toBe('4,771,926.1 €');

        await gridAuthoring.contextMenuOperations.updateAndSaveNumberFormat(
            'Operating Expenditure',
            'metric',
            async () => {
                await gridAuthoring.numberFormatOperations.clickNfShortcutIcon('$');
                await gridAuthoring.numberFormatOperations.moveNfDecimalPlace('increase', 4);
            },
            'campaign-finance-sample-data.xls'
        );
        await since(
            'Grid cell in visualization "2MR_1AC" at "2", "4" should have #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 4, vizName))
            .toBe('4,771,926.1 €');
    });
});
