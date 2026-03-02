import * as gridConstants from '../../../../constants/grid.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { browserWindow } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';

describe('Classic Grid Number Format Fixed', () => {
    let { loginPage, libraryPage, gridAuthoring, baseContainer } = browsers.pageObj1;

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

    it('[TC2692_01] Fixed number format Test', async () => {
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.FourGridsCampaignFinanceDataset.id,
            projectId: gridConstants.FourGridsCampaignFinanceDataset.project.id,
        });
        await gridAuthoring.contextMenuOperations.updateAndSaveNumberFormat(
            'Operating Expenditure',
            vizName,
            async () => {
                await gridAuthoring.clickNfShortcutIcon(',');
            }
        );

        // And the grid cell in visualization "2MR_1AC" at "2", "2" has text "8,661,346"
        await since(
            `The grid cell in visualization "${vizName}" at "3", "2" should have text #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 2, vizName))
            .toBe('3,889,420');

        await since(
            `The grid cell in visualization "${vizName}" at "4", "2" should have text #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(4, 2, vizName))
            .toBe('4,771,926');

        await gridAuthoring.contextMenuOperations.updateAndSaveNumberFormat('Total Contribution', vizName, async () => {
            // await gridAuthoring.numberFormatOperations.clickNumberFormatDropdownOption();
            await gridAuthoring.numberFormatOperations.selectNumberFormatFromDropdown('Fixed');
        });

        // And the grid cell in visualization "1AR_1A2MC" at "4", "3" has text "4597440.23"
        await since(
            'The grid cell in visualization "1AR_1A2MC" at "3", "3" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 3, vizName))
            .toBe('4,607,706');
        await since(
            'The grid cell in visualization "1AR_1A2MC" at "4", "3" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(4, 3, vizName))
            .toBe('4,597,440');

        await gridAuthoring.contextMenuOperations.updateAndSaveNumberFormat('4771926.08', '3AR_2MC', async () => {
            await gridAuthoring.clickNfShortcutIcon('fixed');
            await gridAuthoring.numberFormatOperations.selectNfNegativeForm('(1,234)', true);
        });

        // Then the grid cell in visualization "3AR_2MC" at "2", "4" has text "4,771,926"
        await since(
            'The grid cell in visualization "3AR_2MC" at "2", "4" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 4, '3AR_2MC'))
            .toBe('4,771,926');

        // And the grid cell in visualization "3AR_2MC" at "3", "3" has text "233,721"
        await since(
            'The grid cell in visualization "3AR_2MC" at "3", "3" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 3, '3AR_2MC'))
            .toBe('233,721');

        await gridAuthoring.contextMenuOperations.updateAndSaveNumberFormat('4,771,926', vizName, async () => {
            await gridAuthoring.numberFormatOperations.toggleNfThousandSeparator();
            await gridAuthoring.numberFormatOperations.selectNfNegativeForm('(1234)', 'black');
        });

        // Then the grid cell in visualization "1AR_1A2MC" at "3", "2" has text "3889420"
        await since(
            `The grid cell in visualization ${vizName} at "3", "2" should have text #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 2, vizName))
            .toBe('3889420');

        // And the grid cell in visualization "1AR_1A2MC" at "4", "2" has text "4771926"
        await since(
            `The grid cell in visualization ${vizName} at "4", "2" should have text #{expected}, instead we have #{actual}`
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(4, 2, vizName))
            .toBe('4771926');

        // select "2A2MR_1AC" 
        await baseContainer.clickContainerByScript('2A2MR_1AC');
        await gridAuthoring.contextMenuOperations.updateAndSaveNumberFormat(
            'Operating Expenditure',
            'Metrics',
            async () => {
                // await gridAuthoring.numberFormatOperations.clickNumberFormatDropdownOption();
                await gridAuthoring.numberFormatOperations.selectNumberFormatFromDropdown('Fixed');
                await gridAuthoring.numberFormatOperations.moveNfDecimalPlace('increase', 2);
                await gridAuthoring.numberFormatOperations.moveNfDecimalPlace('decrease', 1);
            }
        );

        // Then the grid cell in visualization "2A2MR_1AC" at "2", "4" has text "78,629.1"
        await since(
            'The grid cell in visualization "2A2MR_1AC" at "2", "4" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 4, '2A2MR_1AC'))
            .toBe('78,629.1');

        // select "2MR_1AC" 
        await baseContainer.clickContainerByScript('2MR_1AC');
        await gridAuthoring.contextMenuOperations.updateAndSaveNumberFormat(
            'Operating Expenditure',
            'metric',
            async () => {
                await gridAuthoring.clickNfShortcutIcon(',');
                await gridAuthoring.numberFormatOperations.moveNfDecimalPlace('increase', 4);
            },
            'campaign-finance-sample-data.xls'
        );

        // Then the grid cell in visualization "2MR_1AC" at "2", "2" has text "8,661,346"
        await since(
            'Grid cell in visualization "2MR_1AC" at "2", "2" should have text "8,661,346", instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 2, '2MR_1AC'))
            .toBe('8,661,345.780000');

        // And the grid cell in visualization "1AR_1A2MC" at "3", "2" has text "3889420"
        await since(
            'Grid cell in visualization "1AR_1A2MC" at "3", "2" should have text "3889420", instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 2, '1AR_1A2MC'))
            .toBe('3889420');

        // And the grid cell in visualization "3AR_2MC" at "2", "4" has text "4,771,926"
        await since(
            'Grid cell in visualization "3AR_2MC" at "2", "4" should have text "4,771,926", instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 4, '3AR_2MC'))
            .toBe('4,771,926');

        // And the grid cell in visualization "2A2MR_1AC" at "2", "4" has text "78,629.1"
        await since(
            'Grid cell in visualization "2A2MR_1AC" at "2", "4" should have text "78,629.1", instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 4, '2A2MR_1AC'))
            .toBe('78,629.1');
    });
});
