import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_TXN', 'newman1234') };

describe('Toggle for TXN test', () => {
    const restoreTXN = {
        id: 'E175BBFC4A4A562858DB94AAA29306E1',
        name: 'Restore_Data',
    };

    const fieldTXN = {
        id: '622FACF442EEEACCF8185E86B8C0FC33',
        name: 'Toggle-Field-Icon-FlagAllowsubmission',
    };

    const gridTXN = {
        id: '513C7BEA41AA392D1F2C4BA16429D84F',
        name: 'Toggle-Grid-Icon-MrakrowFlagcell',
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

    beforeEach(async () => {
        // restore data first
        await libraryPage.openDossier(restoreTXN.name);
        await transactionPage.submitChanges();
        await transactionPage.goToLibrary();
    });

    afterEach(async () => {
        await transactionPage.goToLibrary();
    });

    it('[TC79862] Verify  Control style - Star Rating of TXN service on Library RSD -Field', async () => {
        // open transaction document
        await libraryPage.openDossier(fieldTXN.name);
        await transactionPage.waitDataLoaded();

        // check initial UI
        expect(await toggle.getCurrentValue()).toBe('0');
        await takeScreenshotByElement(toggle.getElement(), 'TC79862_01', 'Toggle_Initial');

        // make changes and submit
        await toggle.changeValue();
        expect(await transactionPage.hasDirtyFlag(transactionPage.getEditableField())).toBe(true);
        await transactionPage.submitChanges();
        expect(await toggle.getCurrentValue()).toBe('1');
        await takeScreenshotByElement(toggle.getElement(), 'TC79862_01', 'Toggle_Modify');
    });

    it('[TC80291] Verify  Control style - Star Rating of TXN service on Library RSD -Grid ', async () => {
        // open transaction document
        await libraryPage.openDossier(gridTXN.name);
        await transactionPage.waitDataLoaded();

        // click star rating in grid cell
        const cell = grid.findCellFromLocation(9, 2);
        await transactionPage.setToggleContainer(cell);
        expect(await toggle.getCurrentValue()).toBe('1');
        await takeScreenshotByElement(toggle.getElement(), 'TC79862_02', 'Toggle_Initial');
        await toggle.changeValue();

        // submit changes and check result
        await transactionPage.submitChanges();
        expect(await toggle.getCurrentValue()).toBe('2');
        await takeScreenshotByElement(toggle.getElement(), 'TC79862_02', 'Toggle_Modify');
    });
});
export const config = specConfiguration;
