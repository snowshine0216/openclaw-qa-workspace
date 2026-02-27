import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_TXN', 'newman1234') };

describe('TextField for TXN test', () => {
    const restoreTXN = {
        id: 'E175BBFC4A4A562858DB94AAA29306E1',
        name: 'Restore_Data',
    };

    const fieldTXN = {
        id: '3C9E7A6A49FAC0978400DAB89171DBD3',
        name: 'Text Field-Field-MinMaxValidation-Flagfields',
    };

    const gridTXN = {
        id: '15C388B54A40DB0B62893187F93DB9BC',
        name: 'Text Field-Grid-ValidationMinMax-Submitunchanged',
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };
    const { credentials } = specConfiguration;

    let grid, alert;

    let { loginPage, libraryPage, transactionPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        grid = transactionPage.grid;
        alert = transactionPage.alert;
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        // restore data first
        await libraryPage.openDossier(restoreTXN.name);
        await transactionPage.submitChanges();
        await transactionPage.goToLibrary();
    });

    afterEach(async () => {
        await transactionPage.goToLibrary();
    });

    it('[TC79855] Verify Control style - Text Field of TXN service on Library RSD -Field', async () => {
        // open transaction document
        await libraryPage.openDossier(fieldTXN.name);
        await transactionPage.waitDataLoaded();

        // check the validation on Float text filed
        await transactionPage.inputTextFieldByName('Float', '-1000');
        expect(await alert.getAlertMessage()).toBe('This field should be between -789 and 1000000.');
        await alert.clickOnButtonByName('OK');

        // input the same value to check
        await transactionPage.inputTextFieldByName('Float', '0', false);
        expect(await transactionPage.hasDirtyFlag(transactionPage.getEditableFieldByName('Float'))).toBe(false);
        await transactionPage.inputTextFieldByName('Float', '6');
        expect(await transactionPage.hasDirtyFlag(transactionPage.getEditableFieldByName('Float'))).toBe(true);

        // make changes and submit
        await transactionPage.sumbitChangesWithNoWait();
        await alert.clickOnButtonByName('Yes', 1000);
        await alert.clickOnButtonByName('OK');
        expect(await transactionPage.getTextFieldValue('Float')).toBe('6.00');
    });

    it('[TC80289] Verify  Control style - Text Field TXN service on Library RSD -Grid ', async () => {
        await libraryPage.openDossier(gridTXN.name);
        await transactionPage.waitDataLoaded();

        // click text field in grid cell
        await grid.clickCell('-123.46');
        await transactionPage.inputTextField('1000000');

        // check validation
        expect(await alert.getAlertMessage()).toBe('This field should be less than or equal to 70877.');
        await alert.clickOnButtonByName('OK');

        // make changes and submit to check result
        await transactionPage.inputTextField('188');
        await transactionPage.sumbitChangesWithNoWait();
        await alert.clickOnButtonByName('Yes');
        await alert.clickOnButtonByName('OK');
        await grid.clickCell('3/31/12 9:15 AM');
        await transactionPage.inputTextField('3/31/12 9:23 AM');
        await transactionPage.sumbitChangesWithNoWait();
        await alert.clickOnButtonByName('Yes');
        // add two wait here since there're two loading icon shows after submit here
        await transactionPage.waitDataLoaded();
        await transactionPage.waitForPageReload();
        expect(await grid.getOneRowData(3)).toEqual(['2', '188.00', '30', '3/31/12 9:23 AM']);
    });
});
export const config = specConfiguration;
