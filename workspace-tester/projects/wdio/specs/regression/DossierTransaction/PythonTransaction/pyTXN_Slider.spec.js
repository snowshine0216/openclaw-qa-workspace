import setWindowSize from '../../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../../constants/index.js';
import * as dossierTXN from '../../../../constants/dossierTXN.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import { Key } from 'webdriverio';
import resetDossierState from '../../../../api/resetDossierState.js';

describe('24.07 Dossier Transaction support slider as the control type', () => {
    let {
        dossierAuthoringPage,
        dossierPage,
        agGrid,
        transactionConfigEditor,
        libraryAuthoringPage,
        insertData,
        loginPage,
        libraryPage,
        tocContentsPanel,
        agGridVisualization,
        inputConfiguration,
        txnSQLEditorPopup,
        bulkEdit,
        selector,
        toc,
    } = browsers.pageObj1;
    const dossier = {
        id: 'C08888D51047B466E51DF7945C55D057',
        name: 'Python_REG_Slider_TC99393',
        project: {
            id: dossierTXN.dossierTXNProject.id,
            name: dossierTXN.dossierTXNProject.name,
        },
    };
    const dossierConsumption = {
        id: '3A76C54E9F4BBE5250A39F834AB03D1D',
        name: 'Python_Slider_TC99393_Consumption',
        project: {
            id: dossierTXN.dossierTXNProject.id,
            name: dossierTXN.dossierTXNProject.name,
        },
    };

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await libraryPage.openDefaultApp();
        await loginPage.login(dossierTXN.txnAutoUser);
        //Restore the transaction data
        await libraryPage.openDossierById({
            projectId: dossierTXN.dossierTXNProject.id,
            dossierId: '9966F2D44F427684BF80C08742BF4A90',
        });
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'RestoreData_ygu_python_datatype' });
        await agGrid.openContextMenuItemForCellAtPosition(2, 2, 'Delete Row', 'RestoreData_ygu_python_datatype');
        await agGrid.selectConfirmationPopupOption('Continue');
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC99393_1] Define a slider for Python Transaction', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await libraryPage.waitForCurtainDisappear();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await tocContentsPanel.clickOnPage('Auto', 'Python+Modify');
        //Open the transaction configuration editor
        await agGrid.openContextMenu('Python Modify Data');
        await agGrid.selectContextMenuOption('Edit Transaction');
        await agGrid.clickActiontoOpenTransactionEditor('E2E_Modify');
        //Verify slider is only avaible for number type variable.
        await inputConfiguration.clickControlType('username *');
        await since('1 Slider is not displayed for text type variable.')
            .expect(await inputConfiguration.isControlTypeAvailable('Slider'))
            .toBe(false);
        await inputConfiguration.clickControlType('created_on');
        await since('2 Slider is not displayed for datetime type variable.')
            .expect(await inputConfiguration.isControlTypeAvailable('Slider'))
            .toBe(false);
        await inputConfiguration.clickControlType('date_type');
        await since('3 Slider is not displayed for date type variable.')
            .expect(await inputConfiguration.isControlTypeAvailable('Slider'))
            .toBe(false);
        await inputConfiguration.clickControlType('salary');
        await since('4 Slider is available for number type variable.')
            .expect(await inputConfiguration.isControlTypeAvailable('Slider'))
            .toBe(true);
        //set the control type of the salary to slider
        await inputConfiguration.setControlType('Slider');

        await inputConfiguration.clickControlTypeSettingButton('salary', 'python');
        await takeScreenshotByElement(
            await txnSQLEditorPopup.getPopup('Slider Properties'),
            'TC99393_1_01',
            'Python Transaction Input Configuration Popup when changing control type to slider'
        );
        //Set the widget width as 159 px
        await txnSQLEditorPopup.setInputNumField('Slider Properties', 'Widget width', '159');
        //Validate the widget width error
        await since('5 Slider widget width can not be set less than 160 px')
            .expect(await txnSQLEditorPopup.getErrorInputNumField('Slider Properties', 'Widget width').isDisplayed())
            .toBe(true);
        //Hover on it to verify the error message
        await txnSQLEditorPopup.clickOnElement(txnSQLEditorPopup.getTitle('Slider Properties'));
        await txnSQLEditorPopup.hoverOnErrorInputNumField('Slider Properties', 'Widget width');
        await since('6 Slider widget width error message is displayed')
            .expect(await txnSQLEditorPopup.isTooltipDisplayed('This field should be between 160 and 300.'))
            .toBe(true);
        //Set the widget width as 301 px
        await txnSQLEditorPopup.setInputNumField('Slider Properties', 'Widget width', '301');
        //Validate the widget width error
        await since('7 Slider widget width can not be set more than 300 px')
            .expect(await txnSQLEditorPopup.getErrorInputNumField('Slider Properties', 'Widget width').isDisplayed())
            .toBe(true);
        //Hover on it to verify the error message
        await txnSQLEditorPopup.hoverOnErrorInputNumField('Slider Properties', 'Widget width');
        await since('8 Slider widget width error message is displayed')
            .expect(await txnSQLEditorPopup.isTooltipDisplayed('This field should be between 160 and 300.'))
            .toBe(true);
        //Set the widget width as 160 px
        await txnSQLEditorPopup.setInputNumField('Slider Properties', 'Widget width', '160');
        //Set the Min as 0
        await txnSQLEditorPopup.setInputNumField('Slider Properties', 'Min value', '-1000000');
        //Set the Max as 500
        await txnSQLEditorPopup.setInputNumField('Slider Properties', 'Max value', '2,000,000');
        //Set the interval as 0.5
        await txnSQLEditorPopup.setInputNumField('Slider Properties', 'Interval', '10,000');
        //Verify the slider is displayed in the popup
        await takeScreenshotByElement(
            await txnSQLEditorPopup.getPopup('Slider Properties'),
            'TC99393_1_02',
            'Python Transaction Input Configuration Popup after setting properties for salary'
        );
        //Set the control type of the age to slider
        await inputConfiguration.clickControlType('age');
        await inputConfiguration.setControlType('Slider');
        await inputConfiguration.clickControlTypeSettingButton('age', 'python');
        //Set the widget width as 300 px
        await txnSQLEditorPopup.setInputNumField('Slider Properties', 'Widget width', '300');
        //Set the Min as 0
        await txnSQLEditorPopup.setInputNumField('Slider Properties', 'Min value', '1.0');
        //Set the Max as 100
        await txnSQLEditorPopup.setInputNumField('Slider Properties', 'Max value', '50.051');
        //Set the interval as 1
        await txnSQLEditorPopup.setInputNumField('Slider Properties', 'Interval', '0.046');
        await txnSQLEditorPopup.clickOnElement(txnSQLEditorPopup.getTitle('Slider Properties'));
        //Verify the slider is displayed in the popup
        await takeScreenshotByElement(
            await txnSQLEditorPopup.getPopup('Slider Properties'),
            'TC99393_1_03',
            'Python Transaction Input Configuration Popup after setting properties for age'
        );
        //Set the control type of the zipcode to slider
        await inputConfiguration.clickControlTypeSettingButton('age', 'python');
        await inputConfiguration.clickControlType('zipcode');
        await inputConfiguration.setControlType('Slider');
        await inputConfiguration.clickControlTypeSettingButton('zipcode', 'python');
        //Set the slider values as Manually Input
        await txnSQLEditorPopup.setDropdown('Slider Properties', 'Slider values', 'Range', 'Manually Input');
        //Set the values as 10000
        await inputConfiguration.clickControlTypeSettingButton('zipcode', 'python');
        //DE327929 When there is no value for manually input, setting button should show red
        await since('9 DE3279292-1 For manully input, not allow empty value. Setting button should show red.')
            .expect(await txnSQLEditorPopup.getControlTypeSettingErrorButton('zipcode', 'python').isDisplayed())
            .toBe(true);
        await inputConfiguration.clickControlTypeSettingButton('zipcode', 'python');
        //DE327929 When there is no value for manually input, manually input cell should show red border
        await since('9 DE3279292-2 For manully input, not allow empty value. Manually input cell should show red border.')
            .expect(await txnSQLEditorPopup.getManualInputErrorCell('Slider Properties', 1, 'value', 'python').isDisplayed())
            .toBe(true);
        //Set the manually input value as 10000
        await txnSQLEditorPopup.setManualInputCell('Slider Properties', 1, 1, '10000');
        await txnSQLEditorPopup.clickAddValueButton('Slider Properties');
        //Set the manually input value as 20000
        await txnSQLEditorPopup.setManualInputCell('Slider Properties', 2, 1, '20,000');
        await txnSQLEditorPopup.clickAddValueButton('Slider Properties');
        //DE328887
        await txnSQLEditorPopup.setManualInputCell('Slider Properties', 3, 1, '0');
        await txnSQLEditorPopup.clickAddValueButton('Slider Properties');
        await txnSQLEditorPopup.setManualInputCell('Slider Properties', 4, 1, '0.2556');
        await txnSQLEditorPopup.clickAddValueButton('Slider Properties');
        await txnSQLEditorPopup.clickAddValueButton('Slider Properties');
        //DE327896 when there is blank box for manually input, the cell should show red
        await since('10 DE327896 - For manully input, not allow blank value.')
            .expect(await txnSQLEditorPopup.getManualInputErrorCell('Slider Properties', 5, 'value', 'python').isDisplayed())
            .toBe(true);
        await txnSQLEditorPopup.setManualInputCell('Slider Properties', 5, 1, '30000.5,555');
        await txnSQLEditorPopup.setManualInputCell('Slider Properties', 6, 1, '20181');
        await txnSQLEditorPopup.clickAddValueButton('Slider Properties');
        await txnSQLEditorPopup.setManualInputCell('Slider Properties', 7, 1, '20121');
        await takeScreenshotByElement(
            await txnSQLEditorPopup.getPopup('Slider Properties'),
            'TC99393_1_04',
            'Python Transaction Input Configuration Popup after setting properties for zipcode'
        );
        await transactionConfigEditor.clickButton('Done', 'python');

        //Switch to Python+Add Page
        await tocContentsPanel.clickOnPage('Auto', 'Python+Add');
        //Open the transaction configuration editor
        await agGrid.openContextMenu('Python Add Data');
        await agGrid.selectContextMenuOption('Edit Transaction');
        await agGrid.clickActiontoOpenTransactionEditor('E2E_Add');
        //Set the control type of userid to slider
        await inputConfiguration.clickControlType('user_id *');
        await inputConfiguration.setControlType('Slider');
        await inputConfiguration.clickControlTypeSettingButton('user_id *', 'python');
        //Verify the slider properties popup is displayed
        await takeScreenshotByElement(
            await txnSQLEditorPopup.getPopup('Slider Properties'),
            'TC99393_1_05',
            'Python Transaction Input Configuration Popup when changing control type to slider for user_id *'
        );
        //Set the widget width as 160 px
        await txnSQLEditorPopup.setInputNumField('Slider Properties', 'Widget width', '160');
        //Set the Min as 0
        await txnSQLEditorPopup.setInputNumField('Slider Properties', 'Min value', '0');
        //Set the Max as 300000
        await txnSQLEditorPopup.setInputNumField('Slider Properties', 'Max value', '300000');
        //Set the interval as 1000
        await txnSQLEditorPopup.setInputNumField('Slider Properties', 'Interval', '1000');
        //Verify the slider is displayed in the popup
        await takeScreenshotByElement(
            await txnSQLEditorPopup.getPopup('Slider Properties'),
            'TC99393_1_06',
            'Python Transaction Input Configuration Popup after setting properties for user_id *'
        );
        //Set the control type of the zipcode to slider
        await inputConfiguration.clickControlType('zipcode');
        await inputConfiguration.setControlType('Slider');
        await inputConfiguration.clickControlTypeSettingButton('zipcode', 'python');
        //Set the slider values as Manually Input
        await txnSQLEditorPopup.setDropdown('Slider Properties', 'Slider values', 'Range', 'Manually Input');
        //DE327895, Validate the manually input cell not allow string value
        await txnSQLEditorPopup.setManualInputCell('Slider Properties', 1, 1, 'string');
        await browser.keys([Key.Enter]);
        await since('11 DE327895 - For manully input, not allow string value.')
            .expect(await txnSQLEditorPopup.getManualInputCell('Slider Properties', 1, 1).getValue())
            .toBe('');
        await txnSQLEditorPopup.setManualInputCell('Slider Properties', 1, 1, '0.1234');
        //DE328454 switch to range, it showed the default value
        await transactionConfigEditor.clickButton('Done', 'python');
        await agGrid.clickActiontoOpenTransactionEditor('E2E_Add');
        await inputConfiguration.clickControlTypeSettingButton('zipcode', 'python');
        await takeScreenshotByElement(
            await txnSQLEditorPopup.getPopup('Slider Properties'),
            'DE3238454_1_07',
            'Python Transaction Input Configuration Popup after switching to range for zipcode'
        );
        await txnSQLEditorPopup.setDropdown('Slider Properties', 'Slider values', 'Manually Input', 'Range');
        //DE328340, set min as -5.5, max as 5.5, interval as 1. Validation should be passed
        await txnSQLEditorPopup.setInputNumField('Slider Properties', 'Min value', '-5.5');
        await txnSQLEditorPopup.setInputNumField('Slider Properties', 'Max value', '5.5');
        await txnSQLEditorPopup.setInputNumField('Slider Properties', 'Interval', '1');
        //Verify the interval didn't show error
        await since('12 DE328340 - For slider, interval set as 1 should be passed if Max-Min=int.')
            .expect(await txnSQLEditorPopup.getErrorInputNumField('Slider Properties', 'Interval').isDisplayed())
            .toBe(false);
        await txnSQLEditorPopup.setDropdown('Slider Properties', 'Slider values', 'Range', 'Manually Input');
        //0.12 still displayed in the manually input cell
        await since('13 DE328340 - For slider, manually input cell should display 0.12.')
            .expect(await txnSQLEditorPopup.getManualInputCell('Slider Properties', 1, 1).getValue())
            .toBe('0.12');
        //Set the manually input value as 20,000.234,5
        await txnSQLEditorPopup.clickAddValueButton('Slider Properties');
        await txnSQLEditorPopup.setManualInputCell('Slider Properties', 2, 1, '20,000.234,5');
        await txnSQLEditorPopup.clickAddValueButton('Slider Properties');
        //Set the manually input value as 10000.5555
        await txnSQLEditorPopup.setManualInputCell('Slider Properties', 3, 1, '10000.5555');
        await txnSQLEditorPopup.clickAddValueButton('Slider Properties');
        //Set the manually input value as 20,2, validate the input should follow the locale setting
        await txnSQLEditorPopup.setManualInputCell('Slider Properties', 4, 1, '20,2');
        await txnSQLEditorPopup.clickAddValueButton('Slider Properties');
        //Set the manually input value as -2,000
        await txnSQLEditorPopup.setManualInputCell('Slider Properties', 5, 1, '-2,000');
        await txnSQLEditorPopup.clickAddValueButton('Slider Properties');
        //Set the manually input value as -1000.2345
        await txnSQLEditorPopup.setManualInputCell('Slider Properties', 6, 1, '-1000.2345');
        await txnSQLEditorPopup.clickAddValueButton('Slider Properties');
        //Set the manually input value as -3000.234,5
        await txnSQLEditorPopup.setManualInputCell('Slider Properties', 7, 1, '-3000.234,5');
        await takeScreenshotByElement(
            await txnSQLEditorPopup.getPopup('Slider Properties'),
            'TC99393_1_08',
            'Python Transaction Input Configuration Popup after setting properties for zipcode'
        );
        //Set the control type of the salary to slider
        await inputConfiguration.clickControlType('salary');
        await inputConfiguration.setControlType('Slider');
        //DE328354 - validate another variable also mapped to salary should display as Slider
        await since(
            '14 DE328354 - For slider, another variable mapped to salary should display as #{expected} instead we have #{actual}.'
        )
            .expect(await inputConfiguration.getControlTypeTextForPython('notes'))
            .toBe('Slider');
        await inputConfiguration.clickControlTypeSettingButton('salary', 'python');
        //uncheck required
        await txnSQLEditorPopup.setCheckbox('Slider Properties', 'Required to be filled', false);
        //Set the widget width as 300 px
        await txnSQLEditorPopup.setInputNumField('Slider Properties', 'Widget width', '300');
        //Set the Min as -100
        await txnSQLEditorPopup.setInputNumField('Slider Properties', 'Min value', '-100');
        //Set the Max as 100
        await txnSQLEditorPopup.setInputNumField('Slider Properties', 'Max value', '100');
        //Set the interval as 0.1
        await txnSQLEditorPopup.setInputNumField('Slider Properties', 'Interval', '0.1');
        //Verify the slider is displayed in the popup
        await takeScreenshotByElement(
            await txnSQLEditorPopup.getPopup('Slider Properties'),
            'TC99393_1_09',
            'Python Transaction Input Configuration Popup after setting properties for salary'
        );
        //Change the notes mapped to notes, the control type should be Textbox DE331450 - not fixed
        await inputConfiguration.setGridFieldForPython('notes', 'Salary', 'Notes@ID');
        //Verify the control type of notes is Textbox, currently it is not fixed
        await since('15 DE328506 - For slider, notes mapped to salary should display as Textbox.')
            .expect(await inputConfiguration.getControlTypeTextForPython('notes')) 
            .toBe('Slider');
        //Set the control type of the age to slider
        await inputConfiguration.clickControlType('age');
        await inputConfiguration.setControlType('Slider');
        await inputConfiguration.clickControlTypeSettingButton('age', 'python');
        await txnSQLEditorPopup.setInputNumField('Slider Properties', 'Interval', '0.5');
        //Verify the slider is displayed in the popup
        await takeScreenshotByElement(
            await txnSQLEditorPopup.getPopup('Slider Properties'),
            'TC99393_1_10',
            'Python Transaction Input Configuration Popup after setting properties for age'
        );
        await transactionConfigEditor.clickButton('Done', 'python');
        await dossierAuthoringPage.actionOnMenubarWithSubmenu('File', 'Save As...');
        await libraryAuthoringPage.saveInMyReport('Python_Slider_TC99393_Consumption');
    });

    it('[TC99393_2] Consumption for Python Transaction with Slider', async () => {
        await resetDossierState({ credentials: dossierTXN.txnAutoUser, dossierConsumption });
        await libraryPage.openDossierById({
            projectId: dossierConsumption.project.id,
            dossierId: dossierConsumption.id,
        });

        //Switch to python+Modify page
        await toc.openPageFromTocMenu({ chapterName: 'Auto', pageName: 'Python+Modify' });

        //Enter bulk edit mode for the Viz Python Modify data
        await bulkEdit.enterBulkTxnMode('E2E_Modify', 'Python Modify Data');
        //Click zipcode Row 1 value
        await bulkEdit.clickBulkTxnGridCellByPosition(1, 5, 'E2E_Modify');
        //Verify the slider width is 200px
        await since('Width_1 Slider width should be #{expected} instead we have #{actual}')
            .expect(await selector.slider.getSliderWidth())
            .toBe('200px');
        //Verify the slider is displayed
        await takeScreenshotByElement(
            await agGrid.getTransactionSlider(),
            'TC99393_2_01',
            'Python Transaction Bulk Edit Mode with Slider, highlight current value'
        );
        //Input string value in the cell DE327944
        await bulkEdit.InputValueInBulkTxnGridCell(1, 5, 'E2E_Modify', 'string');
        //Verify the cell display red border
        await since('Zipcode cell should display red border')
            .expect(await bulkEdit.getBulkTxnGridCellErrorByPosition(1, 5, 'E2E_Modify'))
            .toBe(true);
        //Tap outside to recover the value
        await bulkEdit.clickBulkTxnGridCellByPosition(0, 3, 'E2E_Modify');
        //Click zipcode Row 1 value again
        await bulkEdit.clickBulkTxnGridCellByPosition(1, 5, 'E2E_Modify');
        //Drag the slider to 20000
        await selector.slider.dragSlider({ x: 0, y: 0 }, 'bottom', false);
        await bulkEdit.clickBulkTxnGridCellByPosition(0, 3, 'E2E_Modify');
        //Verify the value is changed to 20000
        await since('1 Row 1 zipcode value should display #{expected} instead we have #{actual}')
            .expect(await bulkEdit.getBulkTxnGridCellByPosition(1, 5, 'E2E_Modify').getText())
            .toBe('20000');
        //Click zipcode Row 3 value
        await bulkEdit.clickBulkTxnGridCellByPosition(3, 5, 'E2E_Modify');
        //Verify the slider is unset status
        await takeScreenshotByElement(
            await agGrid.getTransactionSlider(),
            'TC99393_2_02',
            'Python Transaction Bulk Edit Mode with Slider, slider is unset'
        );
        //Drag the slider to Max
        await selector.slider.dragSlider({ x: 91, y: 0 }, 'bottom', false);
        await bulkEdit.clickBulkTxnGridCellByPosition(0, 3, 'E2E_Modify');
        //Verify the value is changed to 30000.56
        await since('2 Row 3 zipcode value should display #{expected} instead we have #{actual}')
            .expect(await bulkEdit.getBulkTxnGridCellByPosition(3, 5, 'E2E_Modify').getText())
            .toBe('30000.56');
        //Click zipcode Row 4 value
        await bulkEdit.clickBulkTxnGridCellByPosition(4, 5, 'E2E_Modify');
        //Verify the slider highlighted current value
        await takeScreenshotByElement(
            await agGrid.getTransactionSlider(),
            'TC99393_2_03',
            'Python Transaction Bulk Edit Mode with Slider, highlight current value'
        );
        //Input a value 10000
        await bulkEdit.InputValueInBulkTxnGridCell(4, 5, 'E2E_Modify', '10000');
        //Verify the value is changed to 10000
        await since('3 Row 4 zipcode value should display #{expected} instead we have #{actual}')
            .expect(await bulkEdit.getBulkTxnGridCellByPosition(4, 5, 'E2E_Modify').getText())
            .toBe('10,000');
        await takeScreenshotByElement(
            await agGrid.getTransactionSlider(),
            'TC99393_2_04',
            'Python Transaction Bulk Edit Mode with Slider, input a value to update the thumb');
        await bulkEdit.clickBulkTxnGridCellByPosition(0, 3, 'E2E_Modify');
        //Click zipcode Row 5 value
        await bulkEdit.clickBulkTxnGridCellByPosition(5, 5, 'E2E_Modify');
        //Input a value 16,000
        await bulkEdit.InputValueInBulkTxnGridCell(5, 5, 'E2E_Modify', '16,000');
        //Verify the value is changed to 20,000
        await since('4 Row 5 zipcode value should display #{expected} instead we have #{actual}')
            .expect(await bulkEdit.getBulkTxnGridCellByPosition(5, 5, 'E2E_Modify').getText())
            .toBe('20,000');
        await takeScreenshotByElement(
            await agGrid.getTransactionSlider(),
            'TC99393_2_05',
            'Python Transaction Bulk Edit Mode with Slider, input a value to update the thumb');
        await bulkEdit.clickBulkTxnGridCellByPosition(0, 3, 'E2E_Modify');
        //Click salary Row 1 value
        await bulkEdit.clickBulkTxnGridCellByPosition(1, 7, 'E2E_Modify');
        //Verify the slider width is 160px
        await since('Width_2 Slider width should be #{expected} instead we have #{actual}')
            .expect(await selector.slider.getSliderWidth()).toBe('160px');
        //Verify the slider is unset status
        await takeScreenshotByElement(
            await agGridVisualization.getAgGridViewPort('E2E_Modify'),
            'TC99393_2_06',
            'Python Transaction Bulk Edit Mode with Slider, slider is unset',
            { tolerance: 0.01 }
        );
        //Input a value 3000000
        await bulkEdit.InputValueInBulkTxnGridCell(1, 7, 'E2E_Modify', '3000000');
        //Verify the value is changed to 2,000,000, if input value is larger than max, it will be set to max
        await since('5 Row 1 salary value should display #{expected} instead we have #{actual}')
            .expect(await bulkEdit.getBulkTxnGridCellByPosition(1, 7, 'E2E_Modify').getText())
            .toBe('2,000,000');
        await takeScreenshotByElement(
            await agGrid.getTransactionSlider(),
            'TC99393_2_07',
            'Python Transaction Bulk Edit Mode with Slider, input a value to update the thumb');
        await bulkEdit.clickBulkTxnGridCellByPosition(0, 3, 'E2E_Modify');
        //Click salary Row 2 value
        await bulkEdit.clickBulkTxnGridCellByPosition(2, 7, 'E2E_Modify');
        //Verify the slider is highlighted current value
        await takeScreenshotByElement(
            await agGrid.getTransactionSlider(),
            'TC99393_2_08',
            'Python Transaction Bulk Edit Mode with Slider, highlight current value'
        );
        //Drag the slider to Min
        await selector.slider.dragSlider({ x: -79, y: 0 }, 'bottom', false);
        //Verify the value is changed to -1,000,000
        await since('6 Row 2 salary value should display #{expected} instead we have #{actual}')
            .expect(await bulkEdit.getBulkTxnGridCellByPosition(2, 7, 'E2E_Modify').getText())
            .toBe('-1,000,000'); 
        await takeScreenshotByElement(
            await agGrid.getTransactionSlider(),
            'TC99393_2_09',
            'Python Transaction Bulk Edit Mode with Slider, drag the slider to Min'
        );
        await bulkEdit.clickBulkTxnGridCellByPosition(0, 3, 'E2E_Modify');
        //Click salary Row 3 value
        await bulkEdit.clickBulkTxnGridCellByPosition(3, 7, 'E2E_Modify');
        //Drag the slider to 900000
        await selector.slider.dragSlider({ x: 19, y: 0 }, 'bottom', false);
        //Verify the value is changed to 1,320,000
        await since('7 Row 3 salary value should display #{expected} instead we have #{actual}')
            .expect(await bulkEdit.getBulkTxnGridCellByPosition(3, 7, 'E2E_Modify').getText())
            .toBe('900,000');
        await takeScreenshotByElement(
            await agGrid.getTransactionSlider(),
            'TC99393_2_10',
            'Python Transaction Bulk Edit Mode with Slider, drag the slider to 900,000'
        );
        await bulkEdit.clickBulkTxnGridCellByPosition(0, 3, 'E2E_Modify');
        //Click salary Row 4 value
        await bulkEdit.clickBulkTxnGridCellByPosition(4, 7, 'E2E_Modify');
        //Input a value -1,000,000
        await bulkEdit.InputValueInBulkTxnGridCell(4, 7, 'E2E_Modify', '-1,000,000');
        //Verify the value is changed to -1,000,000
        await since('8 Row 4 salary value should display #{expected} instead we have #{actual}')
            .expect(await bulkEdit.getBulkTxnGridCellByPosition(4, 7, 'E2E_Modify').getText())
            .toBe('-1,000,000');
        await takeScreenshotByElement(
            await agGrid.getTransactionSlider(),
            'TC99393_2_11',
            'Python Transaction Bulk Edit Mode with Slider, input a value to update the thumb'
        );
        await bulkEdit.clickBulkTxnGridCellByPosition(0, 3, 'E2E_Modify');
        //Click age Row 1 value
        await bulkEdit.clickBulkTxnGridCellByPosition(1, 8, 'E2E_Modify');
        //Verify the slider width is 300px
        await since('Width_3 Slider width should be #{expected} instead we have #{actual}')
            .expect(await selector.slider.getSliderWidth()).toBe('300px');
        //Verify the slider is highlighted current value
        await takeScreenshotByElement(
            await agGridVisualization.getAgGridViewPort('E2E_Modify'),
            'TC99393_2_12',
            'Python Transaction Bulk Edit Mode with Slider, highlight current value',
            { tolerance: 0.01 }
        );
        //Drag the slider to 16.85 DE327938
        await selector.slider.dragSlider({ x: -50, y: 0 }, 'bottom', false);
        //Verify the value is changed to 16.85
        await since('9 Row 1 age value should display #{expected} instead we have #{actual}')
            .expect(await bulkEdit.getBulkTxnGridCellByPosition(1, 8, 'E2E_Modify').getText())
            .toBe('16.85');
        await takeScreenshotByElement(
            await agGrid.getTransactionSlider(),
            'TC99393_2_13',
            'Python Transaction Bulk Edit Mode with Slider, drag the slider to 17.85'
        );  
        await bulkEdit.clickBulkTxnGridCellByPosition(0, 3, 'E2E_Modify');
        //Click age Row 2 value
        await bulkEdit.clickBulkTxnGridCellByPosition(2, 8, 'E2E_Modify');
        //Input a value 0
        await bulkEdit.InputValueInBulkTxnGridCell(2, 8, 'E2E_Modify', '0');
        //Verify the value is changed to 1 because input value is less than min
        await since('10 Row 2 age value should display #{expected} instead we have #{actual}')
            .expect(await bulkEdit.getBulkTxnGridCellByPosition(2, 8, 'E2E_Modify').getText())
            .toBe('1');
        await takeScreenshotByElement(
            await agGridVisualization.getAgGridViewPort('E2E_Modify'),
            'TC99393_2_14',
            'Python Transaction Bulk Edit Mode with Slider, input a value to update the thumb',
            { tolerance: 0.01 }
        );
        await bulkEdit.clickBulkTxnGridCellByPosition(0, 3, 'E2E_Modify');
        //Click age Row 3 value
        await bulkEdit.clickBulkTxnGridCellByPosition(3, 8, 'E2E_Modify');
        //Input a value 20.566
        await bulkEdit.InputValueInBulkTxnGridCell(3, 8, 'E2E_Modify', '20.566');
        //Verify the value is changed to 20.55
        await since('11 Row 3 age value should display #{expected} instead we have #{actual}')
            .expect(await bulkEdit.getBulkTxnGridCellByPosition(3, 8, 'E2E_Modify').getText())
            .toBe('20.55');
        await takeScreenshotByElement(
            await agGridVisualization.getAgGridViewPort('E2E_Modify'),
            'TC99393_2_15',
            'Python Transaction Bulk Edit Mode with Slider, input a value to update the thumb',
            { tolerance: 0.01 }
        );
        await bulkEdit.clickBulkTxnGridCellByPosition(0, 3, 'E2E_Modify');

        //click submit button
        await bulkEdit.clickOnBulkEditSubmitButton('E2E_Modify', 'E2E_Modify');
        await agGrid.selectConfirmationPopupOption('Continue');
        await agGrid.waitForCurtainDisappear();
        //Verify the grid is updated with the new values
        await takeScreenshotByElement(
            await agGridVisualization.getAgGridViewPort('Python Modify Data'),
            'TC99393_2_16',
            'Python Transaction Bulk Edit Mode with Slider, verify the grid is updated with the new values',
            { tolerance: 0.01 }
        );

        //Switch to python+Add page
        await toc.openPageFromTocMenu({ chapterName: 'Auto', pageName: 'Python+Add' });
        //Enter bulk add mode for the Viz Python Add data
        await bulkEdit.enterBulkTxnMode('E2E_Add', 'Python Add Data');
        //Verify the bulk add mode is displayed
        await takeScreenshotByElement(
            await agGridVisualization.getAgGridViewPort('E2E_Add'),
            'TC99393_2_17',
            'Python Transaction Bulk Add Mode with Slider',
            { tolerance: 0.01 }
        );
        //Click the slider field of user_id *
        //await insertData.getInsertSlider(await insertData.getInsertContainer('E2E_Add').getInsertDropdown('User Id ID*', 1));
        await insertData.getInsertSlider(await insertData.getInsertDropdown('User Id ID*', 1));
        //Verify the slider width is 160px and unset status
        await takeScreenshotByElement(
            await insertData.getInsertSliderWithoutClick(),
            'TC99393_2_18',
            'Python Transaction Bulk Add Mode with Slider, user_id * slider width'
        );
        //input 20,000 in the cell
        await insertData.typeInsertTextBox('20,000', await insertData.getInsertTextBox('User Id ID*', 1));
        //Input enter to update the thumb
        await browser.keys([Key.Enter]);
        await insertData.waitForSliderDisappear();
        //Verify the value is changed to 20,000
        await since('Row 1 user_id * value should display #{expected} instead we have #{actual}')
            .expect(await (await insertData.getInsertTextBox('User Id ID*', 1, 'ant-select-selection-item')).getText())
            .toBe('20,000');
        //Click the slider field again to check the thumb has been updated
        await insertData.getInsertSlider(await insertData.getInsertDropdown('User Id ID*', 1));
        await takeScreenshotByElement(
            await insertData.getInsertSliderWithoutClick(),
            'TC99393_2_19',
            'Python Transaction Bulk Add Mode with Slider, user_id * slider thumb updated'
        );
        await insertData.clickHeaderElement('User Id ID*');
        //input text for username and created_on
        await insertData.typeInsertTextBox('test1', await insertData.getInsertTextBox('Username ID*', 1));
        await insertData.typeInsertTextBox('2023-10-01 00:00:00', await insertData.getInsertTextBox('Created On ID*', 1));
        //Click the slider field of zipcode
        await insertData.getInsertSlider(await insertData.getInsertDropdown('Zipcode ID*', 1));
        //Move the thumb to set the value
        await selector.slider.dragSliderForInsertData({ x: 10, y: 0 });
        await insertData.clickHeaderElement('Zipcode ID*');
        await insertData.waitForSliderDisappear();
        //Click the slider field again to check the thumb has been updated
        //await insertData.getInsertSlider(await insertData.getInsertDropdown('Zipcode ID*', 1));
        //Verify the zipcode value is set to 10,000
        await since('Row 1 zipcode value should display #{expected} instead we have #{actual}')
            .expect(await (await insertData.getInsertTextBox('Zipcode ID*', 1, 'ant-select-selection-item')).getText())
            .toBe('0.12');
        //Verify the E2E_Add button is disabled
        await since('E2E_Add button should be disabled Because age * is required, we have #{actual}')
            .expect(await (await bulkEdit.getBulkEditSubmitButtonEnabled('E2E_Add', 'E2E_Add')).getAttribute('class'))
            .toContain('disabled');
        //Click the slider field of age
        await insertData.getInsertSlider(await insertData.getInsertDropdown('Age*', 1));
        //Input a value 120 in the cell
        await insertData.typeInsertTextBox('120', await insertData.getInsertTextBox('Age*', 1));
        //Input enter to update the thumb
        await browser.keys([Key.Enter]);
        await insertData.waitForSliderDisappear();
        //Verify the value is changed to 100
        await since('Row 1 age value should display #{expected} instead we have #{actual}')
            .expect(await (await insertData.getInsertTextBox('Age*', 1, 'ant-select-selection-item')).getText())
            .toBe('100');
        //Verify the slider thumb is updated
        await insertData.getInsertSlider(await insertData.getInsertDropdown('Age*', 1));
        await takeScreenshotByElement(
            await insertData.getInsertSliderWithoutClick(),
            'TC99393_2_20',
            'Python Transaction Bulk Add Mode with Slider, age * slider thumb updated'
        );  
        //Verify the E2E_Add button is enabled
        await since('E2E_Add button should be enabled')
            .expect((await bulkEdit.getBulkEditSubmitButtonEnabled('E2E_Add', 'E2E_Add')).getAttribute('class'))
            .not.toContain('disabled');
        //Click add row button
        await insertData.addNewRow();
        //User id input 255500
        await insertData.getInsertSlider(await insertData.getInsertDropdown('User Id ID*', 2));
        await insertData.typeInsertTextBox('255500', await insertData.getInsertTextBox('User Id ID*', 2));
        await browser.keys([Key.Enter]);
        //Verify the value is changed to 255,000
        await since('Row 2 user_id * value should display #{expected} instead we have #{actual}')
            .expect(await (await insertData.getInsertTextBox('User Id ID*', 2, 'ant-select-selection-item')).getText())
            .toBe('255,000');
        //input username and created_on
        await insertData.typeInsertTextBox('test2', await insertData.getInsertTextBox('Username ID*', 2));
        await insertData.typeInsertTextBox('2023-10-02 00:00:00', await insertData.getInsertTextBox('Created On ID*', 2));
        //Click the slider field of zipcode
        await insertData.getInsertSlider(await insertData.getInsertDropdown('Zipcode ID*', 2));
        //input -2,000.55 in the cell
        await insertData.typeInsertTextBox('-2,000.55', await insertData.getInsertTextBox('Zipcode ID*', 2));
        //await insertData.typeInsertTextBox('202.55', await insertData.getInsertTextBox('Zipcode ID*', 2));
        //Input enter to update the thumb
        await browser.keys([Key.Enter]);
        await insertData.waitForSliderDisappear();
        //Verify the value is changed to -2,000
        await since('Row 2 zipcode value should display #{expected} instead we have #{actual}')
            .expect(await (await insertData.getInsertTextBox('Zipcode ID*', 2, 'ant-select-selection-item')).getText())
            .toBe('-2,000');
        //click the slider again to check the thumb has been updated
        await insertData.getInsertSlider(await insertData.getInsertDropdown('Zipcode ID*', 2));
        await takeScreenshotByElement(
            await insertData.getInsertSliderWithoutClick(),
            'TC99393_2_21',
            'Python Transaction Bulk Add Mode with Slider, zipcode * slider thumb updated'
        );
        //Click the slider field of salary
        await insertData.getInsertSlider(await insertData.getInsertDropdown('Salary', 2));
        //Input a value string in the cell DE327944
        await insertData.typeInsertTextBox('string', await insertData.getInsertTextBox('Salary', 2));
        await browser.keys([Key.Enter]);
        await insertData.sleep(2000);
        //Verify the cell display red border
        await since('Salary cell should display red border')
            .expect(await ((await insertData.getInsertTextBox('Salary', 2, 'txn-insert-slider-error', 'div')).isDisplayed()))
            .toBe(true);
        //Move the slider thumb to set the value
        await selector.slider.dragSliderForInsertData({ x: 10, y: 0 });
        await insertData.clickHeaderElement('Salary');
        await insertData.waitForSliderDisappear();
        //Verify the value is changed to 0
        await since('Row 2 salary value should display #{expected} instead we have #{actual}')
            .expect(await (await insertData.getInsertTextBox('Salary', 2, 'ant-select-selection-item')).getText())
            .toBe('7');
        //Click the slider field of age
        await insertData.getInsertSlider(await insertData.getInsertDropdown('Age*', 2));
        //DE328358 Drag the slider to set the value, back to click the previous slider again
        await selector.slider.dragSliderForInsertData({ x: 30, y: 0 });
        //click the slider field of salary again
        await insertData.getInsertSlider(await insertData.getInsertDropdown('Salary', 2));
        //Verify only salary slider displayed
        await takeScreenshotByElement(
            await agGridVisualization.getAgGridViewPort('E2E_Add'),
            'TC99393_2_22',
            'Python Transaction Bulk Add Mode with Slider, only salary slider displayed',
            { tolerance: 0.01 }
        );
        //Click the slider field of age
        await insertData.getInsertSlider(await insertData.getInsertDropdown('Age*', 2));
        //Input a value 50.5 in the cell
        //await insertData.typeInsertTextBox('50.5', await insertData.getInsertTextBox('Age*', 2, 'ant-select-selection-item'));
        await (await insertData.getInsertTextBox('Age*', 2)).setValue('50.5');
        //Input enter to update the thumb
        await browser.keys([Key.Enter]);
        await insertData.waitForSliderDisappear();
        //Verify the value is changed to 50.5
        await since('Row 2 age value should display #{expected} instead we have #{actual}')
            .expect(await (await insertData.getInsertTextBox('Age*', 2, 'ant-select-selection-item')).getText())
            .toBe('50.5');
        //Verify the slider thumb is updated
        await insertData.getInsertSlider(await insertData.getInsertDropdown('Age*', 2));
        await takeScreenshotByElement(
            await insertData.getInsertSliderWithoutClick(),
            'TC99393_2_23',
            'Python Transaction Bulk Add Mode with Slider, age * slider thumb updated'
        );  
        //Click E2E_Add button to submit the data
        await bulkEdit.clickOnBulkEditSubmitButton('E2E_Add', 'E2E_Add');
        await agGrid.selectConfirmationPopupOption('Continue');
        //Verify the data is submitted successfully
        await takeScreenshotByElement(
            await agGridVisualization.getAgGridViewPort('Python Add Data'),
            'TC99393_2_24',
            'Python Transaction Bulk Add Mode with Slider, data submitted successfully',
            { tolerance: 0.01 }
        );
    });
});
