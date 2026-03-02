import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_TXN', 'newman1234') };

describe('Validation TXN test', () => {
    const validationTXN = {
        id: '0E9D2A9B44875DA8B64C5D99F2A7F846',
        name: 'TextField-Required-MinMax-TelephoneValidations',
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };
    const { credentials } = specConfiguration;

    let toggle, grid, alert;

    let { loginPage, libraryPage, transactionPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        toggle = transactionPage.toggle;
        grid = transactionPage.grid;
        alert = transactionPage.alert;
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await transactionPage.goToLibrary();
    });

    it('[TC79863] Verify transaction validations on MSTR Web', async () => {
        // open transaction document
        await libraryPage.openDossier(validationTXN.name);
        await transactionPage.waitDataLoaded();

        // check the validation on Float text filed
        await transactionPage.inputTextFieldByName('Float', '3');
        expect(await alert.getAlertMessage()).toBe('This field should be greater than or equal to 4.');
        await alert.clickOnButtonByName('OK');
        await transactionPage.inputTextFieldByName('Float', '6', false);
        expect(await transactionPage.hasDirtyFlag(transactionPage.getEditableField())).toBe(false);

        // check the validation on phone
        await transactionPage.inputTextFieldByName('Phone', '3');
        expect(await alert.getAlertMessage()).toBe('This field should be between 2 and 256 characters.');
        await alert.clickOnButtonByName('Cancel');
    });
});
export const config = specConfiguration;
