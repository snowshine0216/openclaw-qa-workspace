import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_TXN', 'newman1234') };

describe('TextArea control for TXN Test', () => {
    const restoreTXN = {
        id: 'E175BBFC4A4A562858DB94AAA29306E1',
        name: 'Restore_Data',
    };

    const fieldTXN = {
        id: '12C9BA894E67B13BF08C1583BD8184C2',
        name: 'Button/Link-Field-InputrequiredWidthMax-Allowsubmission',
    };

    const gridTXN = {
        id: 'E4DCA38C43A6087D4E5895A4E1E1338B',
        name: 'Link/Button-Grid-WidthMaxlength-AutoMarkFlagSubmit',
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

    it('[TC79843] Veirfy  Control style - Text Area of TXN service on Library RSD -Field', async () => {
        // open transaction document
        await libraryPage.openDossier(fieldTXN.name);
        await transactionPage.waitDataLoaded();

        // check the reqired validation on Float text area
        await transactionPage.sumbitChangesWithNoWait();
        await alert.clickOnButtonByName('OK');

        // make changes and submit
        await transactionPage.inputTextAreaByName('DateTime', '1/16/2009');
        await transactionPage.submitChanges();
        await transactionPage.waitForPageReload();
        expect(await transactionPage.getTextAreaValueByName('DateTime')).toBe('1/16/2009');
    });

    it('[TC80288] Veirfy  Control style - Text Area of TXN service on Library RSD -Grid', async () => {
        await libraryPage.openDossier(gridTXN.name);
        await transactionPage.waitDataLoaded();

        // click text field in grid cell
        const cell1 = grid.findCellFromLocation(2, 2);
        await transactionPage.click({ elem: cell1 });
        await transactionPage.inputTextArea('a\nb\nc');
        expect(await transactionPage.hasDirtyFlag(grid.getElement())).toBe(true);

        // check the break line when re-open text area
        await transactionPage.click({ elem: cell1 });
        expect(await transactionPage.getTextAreaValue()).toBe('a\nb\nc');

        // make changes and submit
        await transactionPage.sumbitChangesWithNoWait();
        await alert.clickOnButtonByName('OK');
        const cell2 = grid.findTextAreaButtonFromLocation(2, 4);
        await cell2.click();
        await transactionPage.inputTextArea('1/16/2010');
        await transactionPage.submitChanges();
        await alert.clickOnButtonByName('OK');
        expect(await grid.selectCellInOneRow(2, 2, 2)).toEqual(['a\nb\nc']);
        const cell3 = grid.findTextAreaButtonFromLocation(2, 4);
        await cell3.click();
        expect(await transactionPage.getTextAreaValue()).toBe('1/16/2010');
    });
});
export const config = specConfiguration;
