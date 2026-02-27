import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_TXN', 'newman1234') };

describe('Time Picker control for TXN Test', () => {
    const restoreTXN = {
        id: 'E175BBFC4A4A562858DB94AAA29306E1',
        name: 'Restore_Data',
    };

    const fieldTXN = {
        id: 'E50D43BA4B1A3154C74A049F5F1E691C',
        name: 'Time Picker-Field-Interval 30-Allow submission',
    };

    const gridTXN = {
        id: '7EF070424C4D9E0B9D14A2BE3112F2CC',
        name: 'Time Picker-Grid-Input Required-Interval 1-AutorecalMarkrowFlagcell',
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };
    const { credentials } = specConfiguration;

    let grid, timePicker, alert;

    let { loginPage, libraryPage, transactionPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        timePicker = transactionPage.timePicker;
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

    it('[TC79856] Verify Control style - Time Picker of TXN service on Library RSD -Field', async () => {
        // open transaction document
        await libraryPage.openDossier(fieldTXN.name);
        await transactionPage.waitDataLoaded();

        const editableField = transactionPage.getEditableField();
        await transactionPage.click({ elem: editableField });

        // apply button is disabled before time changing
        expect(await timePicker.isApplyBtnsDisabled()).toBe(true);

        // click stepper up button and apply
        await timePicker.clickStepperUpBtn();
        await timePicker.clickApplyBtn();
        expect(await editableField.getText()).toBe('1/15/2009 4:05:00 PM');

        // click stepper down button and apply
        await transactionPage.click({ elem: editableField });
        await timePicker.clickStepperDownBtn();
        await timePicker.clickApplyBtn();
        const expected = '1/15/2009 3:35:00 PM';
        expect(await editableField.getText()).toBe(expected);

        // click cancel button
        await transactionPage.click({ elem: editableField });
        await timePicker.clickCancelBtn();
        expect(await editableField.getText()).toBe(expected);

        // submit changes and verify
        await transactionPage.sumbitChangesWithNoWait();
        expect(await alert.getAlertMessage()).toBe('Congratulations!');
        await alert.clickOnButtonByName('OK', '3000');
        // add two wait here since there're two loading icon shows after submit here
        await transactionPage.waitDataLoaded();
        await transactionPage.waitForPageReload();

        expect(await editableField.getText()).toBe('01/15/09 3:35 PM');
    });

    it('[TC80290] Verify Control style - Time Picker of TXN service on Library RSD -Grid', async () => {
        await libraryPage.openDossier(gridTXN.name);
        await transactionPage.waitDataLoaded();

        // click cell to show time picker
        await grid.clickCell('1/15/2009 3:35 PM');
        expect(await timePicker.isApplyBtnsDisabled()).toBe(true);

        // click stepper up button and apply
        await timePicker.clickStepperUpBtn();
        await timePicker.clickApplyBtn();
        await grid.waitForLoaddingDisappear();
        expect(await transactionPage.hasDirtyFlag(grid.findCell('1/15/2009 3:36 PM'))).toBe(true);

        await grid.clickCell('3/31/2012 9:15 AM');
        // click cancel button
        expect(await transactionPage.hasDirtyFlag(grid.findCell('3/31/2012 9:15 AM'))).toBe(false);
        // click stepper up button 3 times, stepper down button and apply
        await timePicker.clickStepperUpBtn(3);
        await timePicker.clickStepperDownBtn();
        await timePicker.clickApplyBtn();
        await grid.waitForLoaddingDisappear();
        expect(await transactionPage.hasDirtyFlag(grid.findCell('3/31/2012 9:17 AM'))).toBe(true);

        // submit changes and verify
        await transactionPage.sumbitChangesWithNoWait();
        expect(await alert.getAlertMessage()).toBe('Do you want to submit your changes?');
        await alert.clickOnButtonByName('Yes', '3000');
        // add two wait here since there're two loading icon shows after submit here
        await transactionPage.waitDataLoaded();
        await transactionPage.waitForPageReload();
        expect(await grid.findCell('1/15/2009 3:36 PM').isDisplayed()).toBe(true);
        expect(await grid.findCell('3/31/2012 9:17 AM').isDisplayed()).toBe(true);
    });
});
export const config = specConfiguration;
