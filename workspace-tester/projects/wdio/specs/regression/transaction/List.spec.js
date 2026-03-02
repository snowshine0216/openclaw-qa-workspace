import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_TXN', 'newman1234') };

describe('List control for TXN test', () => {
    const restoreTXN = {
        id: 'E175BBFC4A4A562858DB94AAA29306E1',
        name: 'Restore_Data',
    };

    const fieldTXN = {
        id: '369B73B84E952FFEC3CC348B219A73F1',
        name: 'List-Field-PulldownRadioList-Allowsubmission',
    };

    const gridTXN = {
        id: '737C9FF2452C42F894277BAAF4703CD4',
        name: 'List-Grid-Pulldow-AutoMarkFlag',
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };
    const { credentials } = specConfiguration;
    let list, radioList, grid, alert;

    let { loginPage, libraryPage, transactionPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        list = transactionPage.list;
        radioList = transactionPage.radioList;
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

    it('[TC79809] Verify Control style - List of TXN service on Library RSD -Field', async () => {
        // open transaction document
        await libraryPage.openDossier(fieldTXN.name);
        await transactionPage.waitDataLoaded();

        await list.selectListItem('value is 10');
        await radioList.selectItem('40');
        expect(await radioList.isItemSelected('40')).toBe(true);
        // select maximum item
        await radioList.selectItem('100');
        expect(await radioList.isItemSelected('100')).toBe(true);

        // submit changes and verify
        await transactionPage.submitChanges();
        await transactionPage.waitForPageReload();
        expect(await list.getSelectedTxt()).toBe('value is 10');
        expect(await radioList.isItemSelected('100')).toBe(true);
    });

    it('[TC80283] Verify Control style - List of TXN service on MSTR Web -Grid ', async () => {
        // open transaction document
        await libraryPage.openDossier(gridTXN.name);
        await transactionPage.waitDataLoaded();
        // wait for gridIncrementalFetch finished
        await transactionPage.sleep(2000);

        // make a selection in jinVarChar column
        const cell1 = grid.findCellFromLocation(12, 3);
        await transactionPage.click({ elem: cell1 });
        await transactionPage.setListContainer();
        await list.selectSearchableListItem(50);
        // wait for loading icon disappear
        await grid.waitForLoaddingDisappear();
        // after recalculating, the value is '10' and has a dirty flag
        since('after recalculate, dirty flag display of 10 should be #{expected}, instead we have #{actual}')
            .expect(await transactionPage.hasDirtyFlag(cell1))
            .toBe(true);

        // make a selection in jinnDateTime column
        const cell2 = grid.findCellFromLocation(12, 4);
        await transactionPage.click({ elem: cell2 });
        await transactionPage.setListContainer(cell2);
        await list.selectSearchableListItem('2');
        // wait for loading icon disappear
        await grid.waitForLoaddingDisappear();
        // after recalculating, the value is '1/1/1900' and has a dirty flag
        since('after recalculate, dirty flag display of 1/1/1990 should be #{expected}, instead we have #{actual}')
            .expect(await transactionPage.hasDirtyFlag(cell2))
            .toBe(true);

        // show alert dialog after submit changes
        await transactionPage.sumbitChangesWithNoWait();
        since('error msg should be #{expected}, instead we have #{actual}')
            .expect(await alert.getAlertMessage())
            .toBe('One or more required inputs have not been modified.');
        await alert.clickOnButtonByName('OK');

        // make a selection in jinInt by searching
        const cell3 = grid.findCellFromLocation(12, 2);
        await transactionPage.click({ elem: cell3 });
        await transactionPage.setListContainer(cell3);
        await list.selectSearchableListItemBySearch('999999');
        // wait for loading icon disappear
        await grid.waitForLoaddingDisappear();
        // after recalculating, the value is '999999' and has a dirty flag
        since('after recalculate, dirty flag display of 99999 should be #{expected}, instead we have #{actual}')
            .expect(await transactionPage.hasDirtyFlag(cell3))
            .toBe(true);

        // submit changes and verify
        await transactionPage.sumbitChangesWithNoWait();
        expect(await alert.getAlertMessage()).toBe('success');
        await alert.clickOnButtonByName('OK');

        // refine grid due to page is refreshed after submit
        await transactionPage.waitPageRefresh();
        const grid2 = await grid.getRsdGridByKey('W45');
        await grid2.waitForGridLoaded();
        await transactionPage.sleep(2000);
        since('after submit, grid cell of 999999 should be #{expected}, instead we have #{actual}')
            .expect(await grid2.isCellDisplayed('999999'))
            .toBe(true);
        since('after submit, grid cell of 50 display should be #{expected}, instead we have #{actual}');
        expect(await grid2.isCellDisplayed('50')).toBe(true);
        since('after submit, grid cell of 1/1/1990 display should be #{expected}, instead we have #{actual}');
        expect(await grid2.isCellDisplayed('1/1/1900')).toBe(true);
    });
});
export const config = specConfiguration;
