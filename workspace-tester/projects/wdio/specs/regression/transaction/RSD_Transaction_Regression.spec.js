import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';

describe('Transaction Regression Test', () => {
    const txnProject = {
        id: 'FE11E3664DEA45E168D5639233FDD78A',
        name: 'Transactions(SingleGridSource=False)',
    };
    const restoreTXN = {
        id: '64470E444B4DD85411EEBA8B1B44512B',
        name: 'Restore_Data2',
    };

    const documentTXN = {
        id: '584A4DBC4C4C0EB0B1609CA7F12C6226',
        name: 'Acceptance_Test_RefreshAfterSubmit',
        project: txnProject,
    };

    const noActionTXN = {
        id: '0B6280234A53CE6C01BF49B13DBEFDE8',
        name: 'Acceptance_Test_NoActionAfterSubmit',
    };

    const displayMsgTXN = {
        id: 'A93EE7C2441275FA46CBC4BB9F4D71ED',
        name: 'Acceptance_Test_RefreshAfterSubmit_DisplayMsg',
    };

    const linkdrillTXN = {
        id: '0C2F9F30422AA2527490619B49461BE2',
        name: 'Acceptance_Test_Link DrillAfterSubmit',
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let calendar,
        list,
        slider,
        radioList,
        timePicker,
        toggle,
        likertScale,
        switchDIC,
        checkboxDIC,
        stepper,
        alert,
        starRating;

    let { loginPage, libraryPage, transactionPage, rsdGrid, reset } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(browsers.params.credentials);

        calendar = transactionPage.calendar;
        list = transactionPage.list;
        slider = transactionPage.slider;
        timePicker = transactionPage.timePicker;
        radioList = transactionPage.radioList;
        toggle = transactionPage.toggle;
        likertScale = transactionPage.likertScale;
        switchDIC = transactionPage.switch;
        checkboxDIC = transactionPage.switch;
        stepper = transactionPage.stepper;
        alert = transactionPage.alert;
        starRating = transactionPage.starRating;
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

    it('[TC18091] Verify Transaction DDIC on field group on Library RSD', async () => {
        // open transaction document
        await libraryPage.openDossier(documentTXN.name);
        await transactionPage.waitDataLoaded();

        // make changes for Calendar
        await transactionPage.click({ elem: transactionPage.getEditableFieldByName('Calendar') });
        await takeScreenshotByElement(calendar.getElement(), 'TC18091', 'Calendar');
        await calendar.chooseCalendar('2019', 'May', '10');

        // make changes for Time Picker
        await transactionPage.click({ elem: transactionPage.getEditableFieldByName('Time Picker') });
        await takeScreenshotByElement(timePicker.getElement(), 'TC18091', 'Time Picker');
        await timePicker.clickStepperUpBtn();
        await timePicker.clickApplyBtn();

        // make changes for DateTime Picker
        await transactionPage.click({ elem: transactionPage.getEditableFieldByName('Date Time Picker') });
        await takeScreenshotByElement(calendar.getElement(), 'TC18091', 'Date Time Picker');
        await calendar.chooseCalendar(2010, 'Feb', 1);
        await calendar.chooseTime(1, 'AM', 30, 30);
        await calendar.confirm();

        // make changes for Text Area
        await transactionPage.click({ elem: transactionPage.getEditableFieldByName('Text Area') });
        await transactionPage.inputTextArea('a\nb\nc');

        // make changes for Text Field
        await transactionPage.inputTextFieldByName('Text Field', 'text field test');

        //make changes for Toggle
        await transactionPage.setToggleContainer(transactionPage.getEditableFieldByName('Toggle'));
        await toggle.changeValue();

        // make changes for Slider
        await transactionPage.click({ elem: transactionPage.getEditableFieldByName('Slider') });
        await takeScreenshotByElement(slider.getElement(), 'TC18091', 'Slider');
        await slider.dragSlider({ x: 92, y: 0 });
        await slider.apply();

        // make changes for list
        await transactionPage.click({ elem: transactionPage.getEditableFieldByName('List') });
        await list.selectSearchableListItem('50');

        // make changes for stepper
        await transactionPage.setStepperContainer(transactionPage.getEditableFieldByName('Stepper'));
        await stepper.clickMinusBtn(3);

        // make changes for radio list
        await radioList.selectItem('40');

        // make changes for signature
        await transactionPage.click({ elem: transactionPage.getEditableFieldByName('Signature') });
        expect(await alert.getAlertMessage()).toBe('The control style has not been supported yet.');
        await alert.clickOnButtonByName('OK');

        // make changes for Barcode
        await transactionPage.inputTextFieldByName('Barcode', 'barcode test');
        await transactionPage.scrollOnPage(400);

        // make changes for LikertScale
        await transactionPage.setLikertScaleContainer(transactionPage.getEditableFieldByName('Likert Scale'));
        await likertScale.chooseValue('3');

        // make changes for StarRating
        await transactionPage.setStarRatingContainer(transactionPage.getEditableFieldByName('Star Rating'));
        await starRating.chooseValue('4');

        // make changes for Switch
        await transactionPage.setSwitchContainer(transactionPage.getEditableFieldByName('Switch'));
        await switchDIC.clickCheckbox();

        // make changes for checkbox
        await transactionPage.setSwitchContainer(transactionPage.getEditableFieldByName('Checkbox'));
        await takeScreenshotByElement(checkboxDIC.getElement(), 'TC18091', 'CheckBox');
        await checkboxDIC.clickCheckbox();

        // submit changes and check result
        await transactionPage.submitChangesWithPageFreshed();
        expect(await transactionPage.getTextFieldValue('Calendar')).toBe('43,595');
        await transactionPage.click({ elem: transactionPage.getEditableFieldByName('Time Picker') });
        await takeScreenshotByElement(timePicker.getElement(), 'TC18091', 'Time Picker After make changes');
        await timePicker.clickCancelBtn();
        expect(await transactionPage.getTextFieldValue('Date Time Picker')).toBe('40,210');
        expect(await transactionPage.getTextFieldValue('Text Area')).toBe('a\nb\nc');
        expect(await transactionPage.getTextFieldValue('Text Field')).toBe('text field test');
        expect(await transactionPage.getTextFieldValue('List')).toBe('50');
        expect(await transactionPage.getTextFieldValue('Slider')).toBe('100');
        expect(await stepper.getValue()).toBe('70');
        expect(await radioList.getSelectedItem()).toBe('40');
        expect(await transactionPage.getTextFieldValue('Barcode')).toBe('barcode test');
        expect(await likertScale.getSelectedItem()).toBe('3');
        await takeScreenshotByElement(starRating.getElement(), 'TC18091', 'StarRating_AfterSubmit');
        await transactionPage.setSwitchContainer(transactionPage.getEditableFieldByName('Switch'));
        expect(await switchDIC.isChecked()).toBe(true);
        await transactionPage.setSwitchContainer(transactionPage.getEditableFieldByName('Checkbox'));
        expect(await checkboxDIC.isChecked()).toBe(false);
        await takeScreenshotByElement(checkboxDIC.getElement(), 'TC18091', 'CheckBox_AfterSubmit');
    });

    it('[TC18090] Verify Transaction DDIC on grid on Library RSD', async () => {
        // open transaction document
        await libraryPage.openDossier(documentTXN.name);
        await transactionPage.waitDataLoaded();

        // make changes for Calendar
        let grid = rsdGrid.getRsdGridByKey('W44');
        let cell = grid.findCellFromLocation(2, 2);
        await transactionPage.click({ elem: cell });
        await takeScreenshotByElement(calendar.getElement(), 'TC18090', 'Calendar');
        await calendar.chooseCalendar('2019', 'May', '10');

        // make changes for Time Picker
        cell = grid.findCellFromLocation(2, 3);
        await transactionPage.click({ elem: cell });
        await takeScreenshotByElement(timePicker.getElement(), 'TC18090', 'Time Picker');
        await timePicker.clickStepperUpBtn();
        await timePicker.clickApplyBtn();

        // make changes for DateTime Picker
        cell = grid.findCellFromLocation(2, 4);
        await transactionPage.click({ elem: cell });
        await takeScreenshotByElement(calendar.getElement(), 'TC18091', 'Date Time Picker');
        await calendar.chooseCalendar(2010, 'Feb', 1);
        await calendar.chooseTime(1, 'AM', 30, 30);
        await calendar.confirm();

        // make changes for Text Area
        cell = grid.findCellFromLocation(2, 5);
        await transactionPage.click({ elem: cell });
        await transactionPage.inputTextArea('a\nb\nc');

        // make changes for Text Field
        cell = grid.findCellFromLocation(2, 6);
        await transactionPage.click({ elem: cell });
        await transactionPage.inputTextField('text field test');

        // make changes for Toggle
        cell = grid.findCellFromLocation(2, 7);
        await transactionPage.setToggleContainer(cell);
        await toggle.changeValue();

        // make changes for Switch
        cell = grid.findCellFromLocation(2, 8);
        await transactionPage.setSwitchContainer(cell);
        await switchDIC.clickCheckbox();

        // make changes for Slider
        cell = grid.findCellFromLocation(2, 9);
        await transactionPage.click({ elem: cell });
        await takeScreenshotByElement(slider.getElement(), 'TC18090', 'Slider');
        await slider.dragSlider({ x: 92, y: 0 });
        await slider.apply();

        // make changes for list
        cell = grid.findCellFromLocation(2, 10);
        await transactionPage.click({ elem: cell });
        await list.selectSearchableListItem('50');

        // make changes for checkbox
        grid = rsdGrid.getRsdGridByKey('W52');
        cell = grid.findCellFromLocation(2, 2);
        await transactionPage.setSwitchContainer(cell);
        await takeScreenshotByElement(checkboxDIC.getElement(), 'TC18090', 'CheckBox');
        await checkboxDIC.clickCheckbox();

        // make changes for stepper
        cell = grid.findCellFromLocation(2, 3);
        await transactionPage.setStepperContainer(cell);
        await stepper.clickMinusBtn(3);

        // make changes for StarRating
        cell = grid.findCellFromLocation(2, 4);
        await transactionPage.setStarRatingContainer(cell);
        await starRating.chooseValue('4');

        // make changes for radio list
        cell = grid.findCellFromLocation(2, 5);
        await transactionPage.click({ elem: cell });
        await list.selectSearchableListItem('50');

        // make changes for LikertScale
        cell = grid.findCellFromLocation(2, 6);
        await transactionPage.setLikertScaleContainer(cell);
        await likertScale.chooseValue('3');

        // submit changes and check result
        await transactionPage.submitChangesWithPageFreshed();
        let grid2 = rsdGrid.getRsdGridByKey('W52');
        await takeScreenshotByElement(grid2.getElement(), 'TC18090', 'Grid2_AfterSubmit');
    });

    it('[TC18088] Verify Submit transaction action selector button Subsequent actions on Library RSD', async () => {
        // open transaction document with refresh
        await libraryPage.openDossier(documentTXN.name);
        await transactionPage.waitDataLoaded();

        // do changes and submit TXN
        await radioList.selectItem('30');
        await transactionPage.sumbitChangesWithNoWait();
        // since('Page is refreshed should be for setting with refresh #{expected}, while we get #{actual}')
        //     .expect(await transactionPage.isPageRefreshed())
        //     .toBe(true);
        // submit again
        await radioList.selectItem('40');
        await transactionPage.sumbitChangesWithNoWait();
        // since('Page is refreshed should be for setting with refresh #{expected}, while we get #{actual}')
        //     .expect(await transactionPage.isPageRefreshed())
        //     .toBe(true);
        expect(await radioList.getSelectedItem()).toBe('40');
        await transactionPage.goToLibrary();

        // open transaction document with no action
        await libraryPage.openDossier(noActionTXN.name);
        await transactionPage.waitDataLoaded();

        // do changes and submit TXN
        await radioList.selectItem('50');
        await transactionPage.sumbitChangesWithNoWait();
        since('Page is refreshed should be for setting with no action #{expected}, while we get #{actual}')
            .expect(await transactionPage.isPageRefreshed())
            .toBe(false);
        expect(await radioList.getSelectedItem()).toBe('50');

        // do recalculate after submit
        await radioList.selectItem('60');
        await transactionPage.recalculateChanges();
        // since('Page is refreshed should be for setting with no action #{expected}, while we get #{actual}')
        //     .expect(await transactionPage.isPageRefreshed())
        //     .toBe(false);
        expect(await radioList.getSelectedItem()).toBe('60');
        await transactionPage.goToLibrary();

        // open transaction document with display message
        await libraryPage.openDossier(displayMsgTXN.name);
        await transactionPage.waitDataLoaded();

        // do changes and submit TXN
        await radioList.selectItem('70');
        await transactionPage.sumbitChangesWithNoWait();
        const alert = await transactionPage.alert;
        expect(await alert.getAlertMessage()).toBe('Success');
        await alert.clickOnButtonByName('OK');

        // discard changes again
        await radioList.selectItem('80');
        await transactionPage.discardChanges();
        expect(await radioList.getSelectedItem()).toBe('70');
        await transactionPage.goToLibrary();

        // open transaction document with linkdrill
        await libraryPage.openDossier(linkdrillTXN.name);
        await transactionPage.waitDataLoaded();

        // do changes and submit TXN
        await radioList.selectItem('80');
        await transactionPage.submitChangesWithPageFreshed();
        let grid = rsdGrid.getRsdGridByKey('K44');
        expect(await grid.getOneRowData(2)).toEqual(['2007', '2007 Q1', '$1,385,229']);

        // go back to do submit again
        await transactionPage.goBackFromDossierLink();
        await transactionPage.submitChangesWithPageFreshed();
        grid = rsdGrid.getRsdGridByKey('K44');
        expect(await grid.getOneRowData(2)).toEqual(['2007', '2007 Q1', '$1,385,229']);
    });

    it('[TC66368] Validate Data refreshed for submit after do reset and linkdrill in transaction on library RSD', async () => {
        // open transaction document with refresh
        await libraryPage.openDossier(documentTXN.name);
        await transactionPage.waitDataLoaded();

        // do changes and submit TXN
        await radioList.selectItem('30');
        await transactionPage.sumbitChangesWithNoWait();
        since('Page is refreshed should be for setting with refresh #{expected}, while we get #{actual}')
            .expect(await transactionPage.isPageRefreshed())
            .toBe(true);

        // submit again
        await radioList.selectItem('40');
        await transactionPage.sumbitChangesWithNoWait();
        since('Page is refreshed should be for setting with refresh #{expected}, while we get #{actual}')
            .expect(await transactionPage.isPageRefreshed())
            .toBe(true);
        expect(await radioList.getSelectedItem()).toBe('40');

        // change group-by
        await transactionPage.groupBy.changeGroupBy('47');
        await transactionPage.groupBy.changeGroupBy('32');
        expect(await radioList.getSelectedItem()).toBe('40');

        // do reset
        await reset.selectReset();
        await reset.confirmReset();
        expect(await radioList.getSelectedItem()).toBe('40');
    });
});
