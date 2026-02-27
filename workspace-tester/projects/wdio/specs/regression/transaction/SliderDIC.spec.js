import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_TXN', 'newman1234') };

describe('Slider control for TXN Test', () => {
    const restoreTXN = {
        id: 'E175BBFC4A4A562858DB94AAA29306E1',
        name: 'Restore_Data',
    };

    const fieldTXN = {
        id: 'B097244C404B15E4219B27B17C967C6B',
        name: 'Silder-Field-WidthInputstyleMinMaxInterval',
    };

    const gridTXN = {
        id: 'DB60B71C446D0B312C71B096B9ECBD1F',
        name: 'Slider-Grid-Labelwidth-Flagcells',
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };
    const { credentials } = specConfiguration;

    let slider, grid, alert;

    let { loginPage, libraryPage, transactionPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        slider = transactionPage.slider;
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

    it('[TC79820] Verify Control style - Slider of TXN service on Library RSD -Field', async () => {
        // open transaction document
        await libraryPage.openDossier(fieldTXN.name);
        await transactionPage.waitDataLoaded();

        const editableField = transactionPage.getEditableField();
        await transactionPage.click({ elem: editableField });

        // drap to max value
        await slider.dragSlider({ x: 140, y: 0 });
        await slider.apply();
        expect(await editableField.getText()).toBe('1000');

        // check 'Cancel' button
        await transactionPage.click({ elem: editableField });
        await slider.cancel();
        expect(await editableField.getText()).toBe('1000');

        // drag to the value between min and max
        await transactionPage.click({ elem: editableField });
        await slider.dragSlider({ x: 14, y: 0 });
        await slider.apply();
        expect(await editableField.getText()).toBe('500');

        // submit changes and verify
        await transactionPage.sumbitChangesWithNoWait();
        expect(await alert.getAlertMessage()).toBe('Do you want to submit your changes?');
        await alert.clickOnButtonByName('Yes');
        await transactionPage.waitDataLoaded();
        expect(await editableField.getText()).toBe('500');
    });

    it('[TC80284] Verify Control style - Slider of TXN service on Library RSD -Grid', async () => {
        // open transaction document
        await libraryPage.openDossier(gridTXN.name);
        await transactionPage.waitDataLoaded();
        // wait for gridIncrementalFetch finished
        await transactionPage.sleep(2000);

        const cell = grid.findCellFromLocation(13, 2);
        await transactionPage.setSliderContainer(cell);
        await slider.dragSlider({ x: 2, y: 0 });
        expect(await transactionPage.hasDirtyFlag(cell)).toBe(true);
        expect(await cell.getText()).toBe('2000');

        // submit changes and verify
        await transactionPage.submitChanges();
        expect(await alert.getAlertMessage()).toBe('Do you want to submit your changes?');
        await alert.clickOnButtonByName('Yes');

        // add two wait here since there're two loading icon shows after submit here
        await transactionPage.waitDataLoaded();
        await transactionPage.waitForPageReload();
        expect(await cell.getText()).toBe('2,000.00');
    });
});
export const config = specConfiguration;
