import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_TXN', 'newman1234') };

describe('Switch for TXN Test', () => {
    const restoreTXN = {
        id: 'E175BBFC4A4A562858DB94AAA29306E1',
        name: 'Restore_Data',
    };

    const fieldTXN = {
        id: '695E5B634FB93899C35186AB590A2991',
        name: 'Switch-Field-OffOnvalue-FlagfielsAllowsubmission',
    };

    const gridTXN = {
        id: 'A4C3261D42E641561D0250A912670EA5',
        name: 'Switch-Grid-OffOnValue-AutoFlagcellSubmit',
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };
    const { credentials } = specConfiguration;

    let switchDIC, grid, alert;

    let { loginPage, libraryPage, transactionPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        switchDIC = transactionPage.switch;
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

    it('[TC79842] Verify Control style - Switch of TXN service on Library RSD -Field', async () => {
        // open transaction document
        await libraryPage.openDossier(fieldTXN.name);
        await transactionPage.waitDataLoaded();

        expect(await switchDIC.isGrayed()).toBe(true);
        await switchDIC.clickCheckbox();
        expect(await transactionPage.hasDirtyFlag(transactionPage.getEditableField())).toBe(true);
        expect(await switchDIC.isChecked()).toBe(true);
        await switchDIC.clickCheckbox();
        expect(await switchDIC.isChecked()).toBe(false);
        expect(await transactionPage.hasDirtyFlag(transactionPage.getEditableField())).toBe(true);

        // submit changes and verify
        await transactionPage.sumbitChangesWithNoWait();
        expect(await alert.getAlertMessage()).toBe('Do you want to submit your changes?');
        await alert.clickOnButtonByName('Yes');
        // add two wait here since there're two loading icon shows after submit here
        await transactionPage.waitDataLoaded();
        await transactionPage.waitForPageReload();
        expect(await switchDIC.isChecked()).toBe(false);
    });

    it('[TC80287] Verify Control style - Switch of TXN service on Library RSD -Grid', async () => {
        // open transaction document
        await libraryPage.openDossier(gridTXN.name);
        await transactionPage.waitDataLoaded();

        // change the switch DIC located in row 2 and column 2
        const cell = grid.findCellFromLocation(3, 2);
        await transactionPage.setSwitchContainer(cell);
        expect(await switchDIC.isGrayed()).toBe(true);
        await switchDIC.clickCheckbox();
        await grid.waitForLoaddingDisappear();
        expect(await transactionPage.hasDirtyFlag(cell)).toBe(true);
        expect(await switchDIC.isChecked()).toBe(true);
        await switchDIC.clickCheckbox();
        await grid.waitForLoaddingDisappear();
        expect(await switchDIC.isChecked()).toBe(false);
        expect(await transactionPage.hasDirtyFlag(cell)).toBe(true);

        // submit changes and verify
        await transactionPage.sumbitChangesWithNoWait();
        expect(await alert.getAlertMessage()).toBe('Do you want to submit your changes?');
        await alert.clickOnButtonByName('Yes');
        // add two wait here since there're two loading icon shows after submit here
        await transactionPage.waitDataLoaded();
        await transactionPage.waitForPageReload();
        expect(await switchDIC.isChecked()).toBe(false);
    });
});
export const config = specConfiguration;
