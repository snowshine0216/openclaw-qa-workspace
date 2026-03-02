import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_TXN', 'newman1234') };

describe('StarRating for TXN test', () => {
    const restoreTXN = {
        id: 'E175BBFC4A4A562858DB94AAA29306E1',
        name: 'Restore_Data',
    };

    const fieldTXN = {
        id: '9EB0F2DD4B2AACC347AEAF9D3172D0EC',
        name: 'Star Rating-Field-InputrequiredMaxratingDisplaystyle',
    };

    const gridTXN = {
        id: '1188EB4648C21603D0F3E4BE13E65D4D',
        name: 'Star Rating-Grid-MaxratingDisplaystyle-AutoMarkSubmit',
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };
    const { credentials } = specConfiguration;

    let starRating, grid, alert;

    let { loginPage, libraryPage, transactionPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        starRating = transactionPage.starRating;
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

    it('[TC79832] Verify  Control style - Star Rating of TXN service on Library RSD -Field', async () => {
        // open transaction document
        await libraryPage.openDossier(fieldTXN.name);
        await transactionPage.waitDataLoaded();

        // check initial UI
        await takeScreenshotByElement(starRating.getElement(), 'TC798032_01', 'StarRating_Initial');

        // submit directly to check required validation
        await transactionPage.sumbitChangesWithNoWait();
        await alert.clickOnButtonByName('Yes');
        await transactionPage.sleep(3000);
        await alert.clickOnButtonByName('OK');

        // make changes and submit
        await starRating.chooseValue('5');
        expect(await transactionPage.hasDirtyFlag(transactionPage.getEditableField())).toBe(true);
        await transactionPage.sumbitChangesWithNoWait();
        await alert.clickOnButtonByName('Yes', 0);
        await transactionPage.waitPageRefresh();
        expect(await transactionPage.isDirtyFlagDisappear(transactionPage.getEditableField())).toBe(true);
        await takeScreenshotByElement(starRating.getElement(), 'TC798032_01', 'StarRating_Modify');
    });

    it('[TC80285] Verify  Control style - Star Rating of TXN service on Library RSD -Grid ', async () => {
        // open transaction document
        await libraryPage.openDossier(gridTXN.name);
        await transactionPage.waitDataLoaded();

        // click star rating in grid cell
        const grid1 = grid.getRsdGridByKey('K44');
        const cell1 = grid1.findCellFromLocation(3, 2);
        await transactionPage.setStarRatingContainer(cell1);
        await takeScreenshotByElement(starRating.getElement(), 'TC798032_02', 'StarRating_Initial');
        await starRating.chooseValue('2');
        expect(await transactionPage.hasDirtyFlag(grid.getElement())).toBe(false);

        // submit changes and check result
        await transactionPage.submitChanges();
        // const grid2 = await transactionPage.findGridByKey('K44');
        const cell2 = grid1.findCellFromLocation(3, 2);
        await transactionPage.setStarRatingContainer(cell2);
        await takeScreenshotByElement(starRating.getElement(), 'TC798032_02', 'StarRating_Modify');
    });
});
export const config = specConfiguration;
