import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_TXN', 'newman1234') };

describe('Calendar control for TXN Test', () => {
    const restoreTXN = {
        id: 'E175BBFC4A4A562858DB94AAA29306E1',
        name: 'Restore_Data',
    };

    const fieldTXN = {
        id: '91DE6E3F4DAA9CB4DF8F85845CBF1EB6',
        name: 'Calendar-Field-Min&Max-Not include time-Flag Fields',
    };

    const gridTXN = {
        id: 'AAD501DB425F4B13447F80A7DE04E50E',
        name: 'Calendar-Grid-AutoRecalculateValue-FlagCells-Input/IncludeTime',
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const { credentials } = specConfiguration;

    let calendar, grid;
    let { loginPage, libraryPage, transactionPage } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(credentials);
        calendar = transactionPage.calendar;
        grid = transactionPage.grid;
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

    it('[TC79802] Verify Control style - Calendar of TXN service on Library RSD - Field', async () => {
        // open transaction document
        await libraryPage.openDossier(fieldTXN.name);
        await transactionPage.waitDataLoaded();

        const editableField = transactionPage.getEditableField();
        await transactionPage.click({ elem: editableField });
        // add sleep here to wait for calendar loaded
        await transactionPage.sleep(2000);

        // check min date setting
        await calendar.chooseCalendar(2010, 'Feb', 1);
        expect(await editableField.getText()).toBe('1/1/2011');
        expect(await transactionPage.hasDirtyFlag(editableField)).toBe(true);

        // check max date setting
        await transactionPage.click({ elem: editableField });
        await calendar.chooseCalendar(2012, 'Feb', 1);
        expect(await editableField.getText()).toBe('12/31/2011');
        expect(await transactionPage.hasDirtyFlag(editableField)).toBe(true);

        // select a date between min and max
        await transactionPage.click({ elem: editableField });
        await calendar.chooseCalendar(2011, 'May', 1);
        expect(await editableField.getText()).toBe('5/1/2011');
        expect(await transactionPage.hasDirtyFlag(editableField)).toBe(true);

        // submit changes and verify
        await transactionPage.submitChanges();
        expect(await editableField.getText()).toBe('May 1, 2011');
    });

    it('[TC80281] Verify Control style - Calendar of TXN service on Library RSD -Grid', async () => {
        await libraryPage.openDossier(gridTXN.name);
        await transactionPage.waitDataLoaded();

        // choose date and time with Calendar
        await grid.clickCell('January 15, 2009');
        await calendar.chooseCalendar(2010, 'Feb', 1);
        await calendar.chooseTime(1, 'AM', 30, 30);
        await calendar.confirm();
        // click on DocLayoutViewer to close input box
        await transactionPage.clickOnDocLayout();
        // after recalculating, the value is 'February 1, 2010' and has a dirty flag
        expect(await transactionPage.hasDirtyFlag(grid.findCell('February 1, 2010'))).toBe(true);

        // input date and time with input box
        await grid.clickCell('March 31, 2012');
        await calendar.setTimeWithInput('4/3/2011 1:10:10 AM');

        // check Calendar will be shown by clicking date icon
        await calendar.showCalendarByDateIcon();
        // click on DocLayoutViewer to close input box
        await transactionPage.clickOnDocLayout();
        // after recalculating, the value is 'April 3, 2011' and has a dirty flag
        expect(await transactionPage.hasDirtyFlag(grid.findCell('April 3, 2011'))).toBe(true);

        // submit changes and verify
        await transactionPage.submitChanges();
        expect(await grid.findCell('April 3, 2011').isDisplayed()).toBe(true);
    });
});
export const config = specConfiguration;
