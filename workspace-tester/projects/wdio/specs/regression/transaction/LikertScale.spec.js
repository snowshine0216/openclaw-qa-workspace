import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_TXN', 'newman1234') };

describe('LikertScale for TXN test', () => {
    const restoreTXN = {
        id: 'E175BBFC4A4A562858DB94AAA29306E1',
        name: 'Restore_Data',
    };

    const fieldTXN = {
        id: 'EA1A3BD74FA1E0EB4486AB8F6C266216',
        name: 'Link/Button-Field-InputRatingscaleLowestHighestDisagreeFlagField',
    };

    const gridTXN = {
        id: '3902984646714CA97359E3B0B96D6010',
        name: 'Likert Scale-Grid-RatingscaleLowestHighestDisagree-AutoMarkrows',
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };
    const { credentials } = specConfiguration;

    let likertScale, grid, alert;

    let { loginPage, libraryPage, transactionPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        likertScale = transactionPage.likertScale;
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

    it('[TC79807] Verify Control style - Likert-Scalel of TXN service on Library RSD -Field', async () => {
        // open transaction document
        await libraryPage.openDossier(fieldTXN.name);
        await transactionPage.waitDataLoaded();

        // check initial UI
        expect(await likertScale.getLowestRating()).toBe('Strongly Agree');
        expect(await likertScale.getHighestRating()).toBe('Strongly Disagree');
        await takeScreenshotByElement(likertScale.getElement(), 'TC79807_01', 'LikertScale_Initial');

        // make changes and submit
        await likertScale.chooseValue('3');
        expect(await transactionPage.hasDirtyFlag(transactionPage.getEditableField())).toBe(true);
        await transactionPage.submitChanges();
        expect(await transactionPage.hasDirtyFlag(transactionPage.getEditableField())).toBe(false);
        expect(await likertScale.getSelectedItem()).toBe('3');
        await takeScreenshotByElement(likertScale.getElement(), 'TC79807_01', 'LikertScale_Modify');
    });

    it('[TC80282] Verify Control style - Likert-Scalel of TXN service -Grid ', async () => {
        await libraryPage.openDossier(gridTXN.name);
        await transactionPage.waitDataLoaded();

        // click star rating in grid cell
        const cell = grid.findCellFromLocation(3, 2);
        await transactionPage.setToggleContainer(cell);
        expect(await likertScale.getLowestRating()).toBe('@*Strongly Agree');
        expect(await likertScale.getHighestRating()).toBe('@*Strongly Disagree');
        await takeScreenshotByElement(likertScale.getElement(), 'TC79807_02', 'LikertScale_Initial');
        await likertScale.chooseValue('6');
        expect(await transactionPage.hasDirtyFlag(grid.locator)).toBe(false);

        // submit changes and check result
        await transactionPage.sumbitChangesWithNoWait();
        await alert.clickOnButtonByName('Yes');
        await transactionPage.sleep(3000);
        await alert.clickOnButtonByName('OK');
        expect(await likertScale.getSelectedItem()).toBe('6');
        await takeScreenshotByElement(likertScale.getElement(), 'TC79807_02', 'LikertScale_Modify');
    });
});
export const config = specConfiguration;
