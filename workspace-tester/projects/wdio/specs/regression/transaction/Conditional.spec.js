import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_TXN', 'newman1234') };

describe('Conditional TXN test', () => {
    const conditionalTXN = {
        id: '168EAD8C49D07268F4C2F3B6B877C764',
        name: 'ConditionalTransaction',
    };

    const conditionalTXNWithListDIC = {
        id: '47A14A8D4C64F88A1830218AF97FE52D',
        name: 'List-Grid-Pulldow-AutoMarkFlag_ConditionalTXN',
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };
    const { credentials } = specConfiguration;

    let { loginPage, libraryPage, transactionPage } = browsers.pageObj1;
    let grid = transactionPage.grid;
    let calendar = transactionPage.calendar;
    let list = transactionPage.list;

    beforeAll(async () => {
        await loginPage.login(credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await transactionPage.goToLibrary();
    });

    it('[TC79864] Verify Conditional Logic on MSTR Web', async () => {
        // open transaction document
        await libraryPage.openDossier(conditionalTXN.name);
        await transactionPage.waitDataLoaded();
        // add sleep here to wait conditional loaded
        await transactionPage.sleep(3000);
        // check intial status for three action buttons
        since('Initial display of submit button should be #{expected}, instead we have #{actual}')
            .expect(await transactionPage.isActionButtonDisplayed('Submit'))
            .toBe(true);
        since('Initial display of recalculate button should be #{expected}, instead we have #{actual}')
            .expect(await transactionPage.isActionButtonDisplayed('Recalculate'))
            .toBe(true);
        since('Initial display of discard button should be #{expected}, instead we have #{actual}')
            .expect(await transactionPage.isActionButtonDisplayed('Discard Changes'))
            .toBe(true);

        // input disable for the text field to check conditioal result
        await transactionPage.inputTextFieldByValue('Disable', 'disable');
        // add sleep here to wait conditional loaded
        await transactionPage.sleep(3000);
        since('display of submit button after change text should be #{expected}, instead we have #{actual}')
            .expect(await transactionPage.isActionButtonDisplayed('Submit'))
            .toBe(false);
        since('display of recalculate button after change text should be #{expected}, instead we have #{actual}')
            .expect(await transactionPage.isActionButtonDisplayed('Recalculate'))
            .toBe(true);
        since('display of discard button after change text should be #{expected}, instead we have #{actual}')
            .expect(await transactionPage.isActionButtonDisplayed('Discard Changes'))
            .toBe(true);

        // change calendar value to check conditional result
        const editableField = transactionPage.getEditableFiledByValue('10/29/2014 12:00:00 AM');
        await transactionPage.click({ elem: editableField });
        await calendar.chooseCalendar(2015, 'Jan', 1);
        // add sleep here to wait conditional loaded
        await transactionPage.sleep(2000);
        since('display of submit button after change calendar should be #{expected}, instead we have #{actual}')
            .expect(await transactionPage.isActionButtonDisplayed('Submit'))
            .toBe(false);
        since(
            'display of recalculate button after change calendar should be #{expected}, instead we have #{actual}'
        )
            .expect(await transactionPage.isActionButtonDisplayed('Recalculate'))
            .toBe(false);
        since('display of discard button after change calendar should be #{expected}, instead we have #{actual}')
            .expect(await transactionPage.isActionButtonDisplayed('Discard Changes'))
            .toBe(true);

        // change value text field to check conditional result
        await transactionPage.inputTextFieldByValue('17', '123');
        // add sleep here to wait conditional loaded
        await transactionPage.sleep(2000);
        since('display of submit button after change value should be #{expected}, instead we have #{actual}')
            .expect(await transactionPage.isActionButtonDisplayed('Submit'))
            .toBe(false);
        since('display of recalculate button after change value should be #{expected}, instead we have #{actual}')
            .expect(await transactionPage.isActionButtonDisplayed('Recalculate'))
            .toBe(false);
        since('display of discard button after change value should be #{expected}, instead we have #{actual}')
            .expect(await transactionPage.isActionButtonDisplayed('Discard Changes'))
            .toBe(false);

        // back to library home and check DE255134
        await transactionPage.goToLibrary();
        await libraryPage.openDossier(conditionalTXNWithListDIC.name);
        await transactionPage.waitDataLoaded();

        // add sleep here to wait conditional loaded
        await transactionPage.sleep(3000);
        // make a selection in jinDateTime column
        const cell1 = grid.findCellFromLocation(12, 4);
        await transactionPage.click({ elem: cell1 });
        await transactionPage.setListContainer(cell1);
        since('grid cell of 12th row disabled status should be #{expected}, instead we have #{actual}')
            .expect(await list.isListDropdownPresent())
            .toBe(true);
        const cell2 = grid.findCellFromLocation(11, 4);
        await transactionPage.click({ elem: cell2 });
        await transactionPage.setListContainer(cell2);
        since('grid cell of 10th row disabled status should be #{expected}, instead we have #{actual}')
            .expect(await list.isListDropdownPresent())
            .toBe(false);
    });
});
export const config = specConfiguration;
