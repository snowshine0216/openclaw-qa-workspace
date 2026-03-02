import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_TXN', 'newman1234') };

describe('Stepper for TXN test', () => {
    const restoreTXN = {
        id: 'E175BBFC4A4A562858DB94AAA29306E1',
        name: 'Restore_Data',
    };

    const fieldTXN = {
        id: '2D74C697445B8470DF3B56B982B37B0B',
        name: 'Stepper-Field-InputRequired-FlagFields',
    };

    const gridTXN = {
        id: '12050D4F4F0C398BD4B7798306523C27',
        name: 'Stepper-Grid-AutorecalculateFlagcells',
    };

    const maxTXN = {
        id: 'DD137CC54C3927672CAD7282D1EBBB5B',
        name: 'Stepper-Field-inital>max',
    };

    const minTXN = {
        id: '66C2B08D4208516C80F0D8B978AB5C0F',
        name: 'Stepper-Field-initial<min',
    };

    const middleTXN = {
        id: '458287C349D5D6B495EC15B52B042C0E',
        name: 'Stepper-Field-min<initial<max',
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };
    const { credentials } = specConfiguration;

    let stepper, grid, alert;

    let { loginPage, libraryPage, transactionPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        stepper = transactionPage.stepper;
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

    it('[TC79836] Verify Control style - Stepper of TXN service on Library RSD -Field', async () => {
        // open transaction document
        await libraryPage.openDossier(fieldTXN.name);
        await transactionPage.waitDataLoaded();
        // check initial status for stepper buttons
        since('initial grey-out status for minus button should be #{expected}, instead we have #{actual}')
            .expect(await stepper.isBtnDisabled('-'))
            .toBe(true);
        since('initial grey-out status for plus button should be #{expected}, instead we have #{actual}')
            .expect(await stepper.isBtnDisabled('+'))
            .toBe(false);

        // do changes and check button status again
        await stepper.clickPlusBtn();
        since('value after click plus should be #{expected}, instead we have #{actual}')
            .expect(await stepper.getValue())
            .toBe('10');
        since('grey-out status for minus button after click plus should be #{expected}, instead we have #{actual}')
            .expect(await stepper.isBtnDisabled('-'))
            .toBe(false);
        since('grey-out status for plus button after click plus should be #{expected}, instead we have #{actual}')
            .expect(await stepper.isBtnDisabled('+'))
            .toBe(false);
        since('dirty flag display after click plus should be #{expected}, instead we have #{actual}')
            .expect(await transactionPage.hasDirtyFlag(transactionPage.getEditableField()))
            .toBe(true);

        // submit changes and check result
        await transactionPage.submitChanges();
        since('value after submit should be #{expected}, instead we have #{actual}')
            .expect(await stepper.getValue())
            .toBe('10');
        since('grey-out status for minus button after submit should be #{expected}, instead we have #{actual}')
            .expect(await stepper.isBtnDisabled('-'))
            .toBe(false);
        since('grey-out status for plus button after submit should be #{expected}, instead we have #{actual}')
            .expect(await stepper.isBtnDisabled('+'))
            .toBe(false);
        since('dirty flag display after submit should be #{expected}, instead we have #{actual}')
            .expect(await transactionPage.hasDirtyFlag(transactionPage.getEditableField()))
            .toBe(false);
    });

    it('[TC80286] Verify Control style - Stepper of TXN service on Library RSD -Grid', async () => {
        // open transaction document
        await libraryPage.openDossier(gridTXN.name);
        await transactionPage.waitDataLoaded();

        // do changes to check modification flag
        const grid1 = grid.getRsdGridByKey('K44');
        const cell = grid1.findCellFromLocation(2, 2);
        await transactionPage.setStepperContainer(cell);
        await stepper.clickMinusBtn();
        await grid1.waitForLoaddingDisappear();
        since('dirty flag display after click plus should be #{expected}, instead we have #{actual}')
            .expect(await transactionPage.hasDirtyFlag(grid1.getElement()))
            .toBe(true);

        // submit changes and check result
        await transactionPage.submitChanges();
        since('value after submit should be #{expected}, instead we have #{actual}')
            .expect(await stepper.getValue())
            .toBe('-10');
        since('dirty flag display after submit should be #{expected}, instead we have #{actual}')
            .expect(await transactionPage.hasDirtyFlag(grid1.getElement()))
            .toBe(false);
    });

    it('[TC79837] Verify Minus/Max buttons of stepper on Library RSD', async () => {
        // check stepper buttons when initial value > max
        await libraryPage.openDossier(maxTXN.name);
        await transactionPage.waitDataLoaded();
        const body = $('body');
        await transactionPage.setStepperContainer(body);

        // check initial status for stepper buttons
        since('initial grey-out status for minus button should be #{expected}, instead we have #{actual}')
            .expect(await stepper.isBtnDisabled('-'))
            .toBe(false);
        since('initial grey-out status for plus button should be #{expected}, instead we have #{actual}')
            .expect(await stepper.isBtnDisabled('+'))
            .toBe(true);

        // do changes and check button status again
        await stepper.clickMinusBtn();
        since('value after click plus should be #{expected}, instead we have #{actual}')
            .expect(await stepper.getValue())
            .toBe('-30');
        since('grey-out status for minus button after click plus should be #{expected}, instead we have #{actual}')
            .expect(await stepper.isBtnDisabled('-'))
            .toBe(false);
        since('grey-out status for plus button after click plus should be #{expected}, instead we have #{actual}')
            .expect(await stepper.isBtnDisabled('+'))
            .toBe(false);
       since('dirty flag display after click plus should be #{expected}, instead we have #{actual}')
            .expect(await transactionPage.hasDirtyFlag(transactionPage.getEditableField()))
            .toBe(true);

        // check stepper buttons when initial value < min
        await transactionPage.goToLibrary();
        await libraryPage.openDossier(minTXN.name);
        await transactionPage.waitDataLoaded();

        // check initial status for stepper buttons
        since('initial grey-out status for minus button should be #{expected}, instead we have #{actual}')
            .expect(await stepper.isBtnDisabled('-'))
            .toBe(true);
        since('initial grey-out status for plus button should be #{expected}, instead we have #{actual}')
            .expect(await stepper.isBtnDisabled('+'))
            .toBe(false);

        // do changes and check button status again
        await stepper.clickPlusBtn();
        since('value after click plus should be #{expected}, instead we have #{actual}')
            .expect(await stepper.getValue())
            .toBe('30');
        since('grey-out status for minus button after click plus should be #{expected}, instead we have #{actual}')
            .expect(await stepper.isBtnDisabled('-'))
            .toBe(false);
        since('grey-out status for plus button after click plus should be #{expected}, instead we have #{actual}')
            .expect(await stepper.isBtnDisabled('+'))
            .toBe(false);
        since('dirty flag display after click plus should be #{expected}, instead we have #{actual}')
            .expect(await transactionPage.hasDirtyFlag(transactionPage.getEditableField()))
            .toBe(true);

        // check stepper buttons when min< initial value < max
        await transactionPage.goToLibrary();
        await libraryPage.openDossier(middleTXN.name);
        await transactionPage.waitDataLoaded();

        // check initial status for stepper buttons
        since('initial grey-out status for minus button should be #{expected}, instead we have #{actual}')
            .expect(await stepper.isBtnDisabled('-'))
            .toBe(false);
        since('initial grey-out status for plus button should be #{expected}, instead we have #{actual}')
            .expect(await stepper.isBtnDisabled('+'))
            .toBe(false);

        // do changes and check button status again
        await stepper.clickPlusBtn();
        since('value after click plus should be #{expected}, instead we have #{actual}')
            .expect(await stepper.getValue())
            .toBe('10');
        since('grey-out status for minus button after click plus should be #{expected}, instead we have #{actual}')
            .expect(await stepper.isBtnDisabled('-'))
            .toBe(false);
        since('grey-out status for plus button after click plus should be #{expected}, instead we have #{actual}')
            .expect(await stepper.isBtnDisabled('+'))
            .toBe(false);
        since('dirty flag display after click plus should be #{expected}, instead we have #{actual}')
            .expect(await transactionPage.hasDirtyFlag(transactionPage.getEditableField()))
            .toBe(true);

        await stepper.clickMinusBtn();
        since('value after click plus should be #{expected}, instead we have #{actual}')
            .expect(await stepper.getValue())
            .toBe('0');
        since('grey-out status for minus button after click plus should be #{expected}, instead we have #{actual}')
            .expect(await stepper.isBtnDisabled('-'))
            .toBe(false);
        since('grey-out status for plus button after click plus should be #{expected}, instead we have #{actual}')
            .expect(await stepper.isBtnDisabled('+'))
            .toBe(false);
        since('dirty flag display after click plus should be #{expected}, instead we have #{actual}')
            .expect(await transactionPage.hasDirtyFlag(transactionPage.getEditableField()))
            .toBe(true);
    });
});
export const config = specConfiguration;
