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
        inlineEdit,
        toc,
        loadingDialog,
    } = browsers.pageObj1;
    const dossier = {
        id: '937012DF164D507702BD768CACD69131',
        name: 'SQL_Slider_TC99393',
        project: {
            id: dossierTXN.dossierTXNProject.id,
            name: dossierTXN.dossierTXNProject.name,
        },
    };
    const dossierConsumption = {
        id: 'E1A3DD90764598A57F843F94ADFB7C25',
        name: 'SQL_Slider_TC99393_Consumption',
        project: {
            id: dossierTXN.dossierTXNProject.id,
            name: dossierTXN.dossierTXNProject.name,
        },
    };

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await libraryPage.openDefaultApp();
        await loginPage.login(dossierTXN.txnAutoUser);
        await libraryPage.openDossierById({
            projectId: dossierTXN.dossierTXNProject.id,
            dossierId: '9966F2D44F427684BF80C08742BF4A90',
        });
        await libraryPage.waitForCurtainDisappear();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'RestoreData_ygu_year_category_sls' });
        await agGrid.openContextMenuItemForCellAtPosition(2, 2, 'Delete Row', 'RestoreData_ygu_year_category_sls');
        await agGrid.selectConfirmationPopupOption('Continue');
    });

    beforeEach(async () => {
        //Restore the transaction data
        await libraryPage.openDossierById({
            projectId: dossierTXN.dossierTXNProject.id,
            dossierId: '9966F2D44F427684BF80C08742BF4A90',
        });
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'RestoreData_ygu_python_datatype' });
        await agGrid.openContextMenuItemForCellAtPosition(2, 2, 'Delete Row', 'RestoreData_ygu_python_datatype');
        await agGrid.selectConfirmationPopupOption('Continue');

        //Reset the dashboard
        await resetDossierState({ credentials: dossierTXN.txnAutoUser, dossierConsumption });
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC99393_3] Validate date type to define slider for SQL Transaction', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await libraryPage.waitForCurtainDisappear();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await tocContentsPanel.clickOnPage('E2E', 'DataTypeValidate');

        //Open the transaction configuration editor
        await agGrid.openContextMenu('SQL TXN Validate Data Type');
        await agGrid.selectContextMenuOption('Edit Transaction');
        //Expand input configuration
        await inputConfiguration.clickExpandIcon();
        //click on the control type dropdown for Bigint
        await inputConfiguration.clickDropdown('Control Type', 'Bigint Type@ID', 'Textbox');
        //Validate slider is displayed
        await since('1 Slider is displayed for BigInt type variable.')
            .expect(await inputConfiguration.isControlTypeAvailable('Slider'))
            .toBe(true);
        //click again to close the dropdown
        await inputConfiguration.clickDropdown('Control Type', 'Bigint Type@ID', 'Textbox');
        //click on the control type dropdown for Date
        await inputConfiguration.clickDropdown('Control Type', 'Date Type@ID', 'Textbox');
        //Validate slider is not displayed
        await since('2 Slider is not displayed for Date type variable.')
            .expect(await inputConfiguration.isControlTypeAvailable('Slider'))
            .toBe(false);
        //click again to close the dropdown
        await inputConfiguration.clickDropdown('Control Type', 'Date Type@ID', 'Textbox');
        //click on the control type dropdown for DateTime
        await inputConfiguration.clickDropdown('Control Type', 'Datetime Type@ID', 'Textbox');
        //Validate slider is not displayed
        await since('3 Slider is not displayed for DateTime type variable.')
            .expect(await inputConfiguration.isControlTypeAvailable('Slider'))
            .toBe(false);
        //click again to close the dropdown
        await inputConfiguration.clickDropdown('Control Type', 'Datetime Type@ID', 'Textbox');
        //click on the control type dropdown for Decimal
        await inputConfiguration.clickDropdown('Control Type', 'Decimal Type', 'Textbox');
        //Validate slider is displayed
        await since('4 Slider is displayed for Decimal type variable.')
            .expect(await inputConfiguration.isControlTypeAvailable('Slider'))
            .toBe(true);
        //click again to close the dropdown
        await inputConfiguration.clickDropdown('Control Type', 'Decimal Type', 'Textbox');
        //click on the control type dropdown for Double
        await inputConfiguration.clickDropdown('Control Type', 'Double Type', 'Textbox');
        //Validate slider is displayed
        await since('5 Slider is displayed for Double type variable.')
            .expect(await inputConfiguration.isControlTypeAvailable('Slider'))
            .toBe(true);
        //click again to close the dropdown
        await inputConfiguration.clickDropdown('Control Type', 'Double Type', 'Textbox');
        //click on the control type dropdown for Integer
        await inputConfiguration.clickDropdown('Control Type', 'Integer Type', 'Textbox');
        //Validate slider is displayed
        await since('6 Slider is displayed for Integer type variable.')
            .expect(await inputConfiguration.isControlTypeAvailable('Slider'))
            .toBe(true);
        //click again to close the dropdown
        await inputConfiguration.clickDropdown('Control Type', 'Integer Type', 'Textbox');
        //click on the control type dropdown for Nvarchar
        await inputConfiguration.clickDropdown('Control Type', 'Nvarchar Type@ID', 'Textbox');
        //Validate slider is not displayed
        await since('7 Slider is not displayed for Nvarchar type variable.')
            .expect(await inputConfiguration.isControlTypeAvailable('Slider'))
            .toBe(false);
        //click again to close the dropdown
        await inputConfiguration.clickDropdown('Control Type', 'Nvarchar Type@ID', 'Textbox');
        //click on the control type dropdown for Time
        await inputConfiguration.clickDropdown('Control Type', 'Time Type@ID', 'Textbox');
        //Validate slider is not displayed
        await since('8 Slider is not displayed for Time type variable.')
            .expect(await inputConfiguration.isControlTypeAvailable('Slider'))
            .toBe(false);
        //click again to close the dropdown
        await inputConfiguration.clickDropdown('Control Type', 'Time Type@ID', 'Textbox');
        //click on the control type dropdown for Varchar
        await inputConfiguration.clickDropdown('Control Type', 'Varchar Type@ID', 'Textbox');
        //Validate slider is not displayed
        await since('9 Slider is not displayed for Varchar type variable.')
            .expect(await inputConfiguration.isControlTypeAvailable('Slider'))
            .toBe(false);
        //click again to close the dropdown
        await inputConfiguration.clickDropdown('Control Type', 'Varchar Type@ID', 'Textbox');
        //click on the control type dropdown for BigDecimal(data type in DB is Float)
        await inputConfiguration.clickDropdown('Control Type', 'Float Type', 'Textbox');
        //Validate slider is displayed
        await since('10 Slider is displayed for BigDecimal type variable.')
            .expect(await inputConfiguration.isControlTypeAvailable('Slider'))
            .toBe(true);
        //click again to close the dropdown
        await inputConfiguration.clickDropdown('Control Type', 'Float Type', 'Textbox');
        //CClose the transaction configuration editor
        await transactionConfigEditor.clickButton('Cancel');
    });

    it('[TC99393_4] Define a slider for SQL Transaction', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await libraryPage.waitForCurtainDisappear();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await tocContentsPanel.clickOnPage('E2E', 'SQLUpdate');

        //Open the transaction configuration editor
        await agGrid.openContextMenu('SQLUpdate');
        await agGrid.selectContextMenuOption('Edit Transaction');
        //Expand input configuration
        await inputConfiguration.clickExpandIcon();
        //Set the control type dropdown for salary to slider
        await inputConfiguration.setDropdown('Control Type', 'Salary', 'Textbox', 'Slider');
        //click the control type setting button
        await inputConfiguration.clickControlTypeSettingButton('Salary');
        //Validate slider settings popup is displayed
        await takeScreenshotByElement(
            await txnSQLEditorPopup.getPopup('Slider Properties'),
            'TC99393_4_01',
            'SQL Transaction Input Configuration Popup when changing control type to slider'
        );
        //Set the widget width as 160 px
        await txnSQLEditorPopup.setInputNumField('Slider Properties', 'Widget width', '160');
        //Set the minimum value as -10000
        await txnSQLEditorPopup.setInputNumField('Slider Properties', 'Min value', '-10000');
        //Set the maximum value as 3,000,000
        await txnSQLEditorPopup.setInputNumField('Slider Properties', 'Max value', '3,000,000');
        //Set the interval as 1000
        await txnSQLEditorPopup.setInputNumField('Slider Properties', 'Interval', '1000');
        //Verify the slider is displayed in the popup
        await takeScreenshotByElement(
            await txnSQLEditorPopup.getPopup('Slider Properties'),
            'TC99393_4_02',
            'SQL Transaction Input Configuration Popup after setting properties for salary'
        );
        //Set the control type dropdown for age to Slider
        await inputConfiguration.setDropdown('Control Type', 'Age', 'Textbox', 'Slider');
        //click the control type setting button
        await inputConfiguration.clickControlTypeSettingButton('Age');
        //Set the max value as 100.545
        await txnSQLEditorPopup.setInputNumField('Slider Properties', 'Max value', '100.545');
        //Set the interval as 0.05
        await txnSQLEditorPopup.setInputNumField('Slider Properties', 'Interval', '0.05');
        //Verify the slider is displayed in the popup
        await takeScreenshotByElement(
            await txnSQLEditorPopup.getPopup('Slider Properties'),
            'TC99393_4_03',
            'SQL Transaction Input Configuration Popup after setting properties for age'
        );
        //Set the control type dropdown for zipcode to Slider
        await inputConfiguration.setDropdown('Control Type', 'Zipcode@ID', 'Textbox', 'Slider');
        //click the control type setting button
        await inputConfiguration.clickControlTypeSettingButton('Zipcode@ID');
        //Set the slider values as Manually Input
        await txnSQLEditorPopup.setDropdown('Slider Properties', 'Slider values', 'Range', 'Manually Input');
        //Set the widget width as 300 px
        await txnSQLEditorPopup.setInputNumField('Slider Properties', 'Widget width', '300');

        //Set the manually input value as 20121
        await txnSQLEditorPopup.setManualInputCell('Slider Properties', 1, 1, '20121');
        await since('Locale_1 Slider value should be #{expected} instead we have #{actual}')
            .expect(await txnSQLEditorPopup.getManualInputCell('Slider Properties', 1, 1).getValue())
            .toBe('20,121');
        //Set the manually input value as 20,181
        await txnSQLEditorPopup.clickAddValueButton('Slider Properties');
        await txnSQLEditorPopup.setManualInputCell('Slider Properties', 2, 1, '20,181');
        await since('Locale_2 Slider value should be #{expected} instead we have #{actual}')
            .expect(await txnSQLEditorPopup.getManualInputCell('Slider Properties', 2, 1).getValue())
            .toBe('20,181');
        //Set the manually input value as 30000.234
        await txnSQLEditorPopup.clickAddValueButton('Slider Properties');
        await txnSQLEditorPopup.setManualInputCell('Slider Properties', 3, 1, '30000.234');
        await since('Locale_3 Slider value should be #{expected} instead we have #{actual}')
            .expect(await txnSQLEditorPopup.getManualInputCell('Slider Properties', 3, 1).getValue())
            .toBe('30,000.23');
        //Set the manually input value as -1,000.2,345
        await txnSQLEditorPopup.clickAddValueButton('Slider Properties');
        await txnSQLEditorPopup.setManualInputCell('Slider Properties', 4, 1, '1,000.2,345');
        await since('Locale_4 Slider value should be #{expected} instead we have #{actual}')
            .expect(await txnSQLEditorPopup.getManualInputCell('Slider Properties', 4, 1).getValue())
            .toBe('1,000.23');
        //Set the manually input value as test
        await txnSQLEditorPopup.clickAddValueButton('Slider Properties');
        await txnSQLEditorPopup.setManualInputCell('Slider Properties', 5, 1, '()');
        //Verify non-numeric values are not allowed in the slider values
        await browser.keys([Key.Enter]);
        await since('1 DE327895 - For manully input, not allow non-numeric value.')
            .expect(await txnSQLEditorPopup.getManualInputCell('Slider Properties', 5, 1).getValue())
            .toBe('');
        await txnSQLEditorPopup.setManualInputCell('Slider Properties', 5, 1, '2000,2');
        await since('Locale_5 Slider value should be #{expected} instead we have #{actual}')
            .expect(await txnSQLEditorPopup.getManualInputCell('Slider Properties', 5, 1).getValue())
            .toBe('20,002');
        await txnSQLEditorPopup.setManualInputCell('Slider Properties', 5, 1, '0.0');
        await since('Locale_6 Slider value should be #{expected} instead we have #{actual}')
            .expect(await txnSQLEditorPopup.getManualInputCell('Slider Properties', 5, 1).getValue())
            .toBe('0');

        //Verify the slider is displayed in the popup
        await takeScreenshotByElement(
            await txnSQLEditorPopup.getPopup('Slider Properties'),
            'TC99393_4_04',
            'SQL Transaction Input Configuration Popup after setting properties for zipcode'
        );
        //click the control type setting button
        await inputConfiguration.clickControlTypeSettingButton('Zipcode@ID');
        //Save the transaction configuration
        await takeScreenshotByElement(
            await inputConfiguration.getInputConfig(),
            'TC99393_4_05',
            'SQL Transaction Input Configuration Editor after setting slider properties'
        );
        await transactionConfigEditor.clickButton('Done');
        await dossierAuthoringPage.actionOnMenubarWithSubmenu('File', 'Save As...');
        await libraryAuthoringPage.saveInMyReport('SQL_Slider_TC99393_Consumption');
        await libraryPage.waitForCurtainDisappear();
        await libraryPage.sleep(2000);
});

    it('[TC99393_5] Inline Edit Consumption for SQL Transaction with Slider', async () => {
        await libraryPage.openDossierById({
            projectId: dossierConsumption.project.id,
            dossierId: dossierConsumption.id,
        });

        //Switch to SQLUpdate page
        await toc.openPageFromTocMenu({ chapterName: 'E2E', pageName: 'SQLUpdate' });
        await libraryPage.waitForCurtainDisappear();
        await libraryPage.sleep(3000);
        //Trigger inline edit for first row of zipcode column
        await inlineEdit.doubleClickGridCellByPosition(2, 1, 'SQLUpdate');
        //DE327930 Verify the slider is displayed
        await takeScreenshotByElement(
            await agGridVisualization.getAgGridColsContainer('SQLUpdate'),
            'TC99393_5_01',
            'SQL Transaction Bulk Edit Mode with Slider, slider is highlighted current number and it is left aligned when right-alighted cannot be displayed',
            { tolerance: 0.01 }
        );
        //Verify the slider width as 300
        await since('Width_1 Slider width should be #{expected} instead we have #{actual}')
            .expect(await selector.slider.getSliderWidth()).toBe('300px');
        //Move the thumb
        await selector.slider.dragSlider({ x: -150, y: 0 }, 'bottom', false);
        //verify the value is updated in the grid cell
        await since('Value_1 Slider value should be #{expected} instead we have #{actual}')
            .expect(await (await inlineEdit.getInputField(1, 0, 'SQLUpdate')).getText()).toBe('0');
        //Click confirm button
        await inlineEdit.clickConfirmContainerIcon(1, 0, 'SQLUpdate', 'confirm');
        // And Dossier is refreshed in Library consumption mode
        await agGrid.waitForConsumptionModeToRefresh();
        await inlineEdit.sleep(3000);

        //Trigger inline edit for first row of Salary column
        await inlineEdit.doubleClickGridCellByPosition(2, 5, 'SQLUpdate');
        //DE328257 Verify the slider is displayed
        await takeScreenshotByElement(
            await agGridVisualization.getAgGridColsContainer('SQLUpdate'),
            'TC99393_5_02',
            'SQL Transaction Bulk Edit Mode with Slider, slider is highlighted current number and it is left aligned when right-alighted cannot be displayed',
            { tolerance: 0.01 }
        );
        //Verify the slider width as 160
        await since('Width_2 Slider width should be #{expected} instead we have #{actual}')
            .expect(await selector.slider.getSliderWidth()).toBe('160px');
        //Input string value in the cell
        await inlineEdit.replaceTextInGridCellAndEnter(1, 4, 'SQLUpdate', 'test');
        //Verify the red boarder is displayed
        await inlineEdit.getBadInput(1, 4, 'SQLUpdate').waitForDisplayed({ timeout: 5000 });
        await since('Border_2 Red border should be displayed when input string value in the slider')
            .expect(await (await inlineEdit.getBadInput(1, 4, 'SQLUpdate')).isDisplayed()).toBe(true);
        //Input numeric value in the cell 2000001
        await inlineEdit.replaceTextInGridCellAndEnter(1, 4, 'SQLUpdate', '2000001');
        //Verify the value is updated in the grid cell
        await since('Value_2 Slider value should be #{expected} instead we have #{actual}')
            .expect(await (await inlineEdit.getInputField(1, 4, 'SQLUpdate')).getText()).toBe('2,000,000');
        await takeScreenshotByElement(
            await agGrid.getTransactionSlider(),
            'TC99393_5_03',
            'SQL Transaction Bulk Edit Mode with Slider, after inputting numeric value in the cell'
        );
        //Click confirm button
        await inlineEdit.clickConfirmContainerIcon(1, 4, 'SQLUpdate', 'confirm');
        // And Dossier is refreshed in Library consumption mode
        await agGrid.waitForConsumptionModeToRefresh();
        await inlineEdit.sleep(5000);

        //Trigger inline edit for first row of Age column
        await inlineEdit.doubleClickGridCellByPosition(2, 6, 'SQLUpdate');
        await inlineEdit.waitForSliderForInlineEdit();
        //Verify the width of the slider is 200 px
        await since('Width_3 Slider width should be #{expected} instead we have #{actual}')
            .expect(await selector.slider.getSliderWidth()).toBe('200px');
        //Move the thumb
        await selector.slider.dragSlider({ x: 50, y: 0 }, 'bottom', false);
        //verify the value is updated in the grid cell
        await since('Value_3 Slider value should be #{expected} instead we have #{actual}')
            .expect(await (await inlineEdit.getInputField(1, 5, 'SQLUpdate')).getText()).toBe('77.9');
        //Click confirm button
        await inlineEdit.sleep(1000);
        await inlineEdit.clickConfirmContainerIcon(1, 5, 'SQLUpdate', 'confirm');
        // And Dossier is refreshed in Library consumption mode
        await agGrid.waitForConsumptionModeToRefresh();
        await inlineEdit.sleep(2000);
    
        //Trigger inline edit for third row of zipcode column
        await inlineEdit.doubleClickGridCellByPosition(4, 1, 'SQLUpdate');
        await inlineEdit.waitForSliderForInlineEdit();
        //Input a numeric value in the cell 2,000.345
        await inlineEdit.replaceTextInGridCellAndEnter(3, 0, 'SQLUpdate', '2,000.345');
        //Verify the value is updated in the grid cell
        await since('Value_4 Slider value should be #{expected} instead we have #{actual}')
            .expect(await (await inlineEdit.getInputField(3, 0, 'SQLUpdate')).getText()).toBe('1,000.23');
        await takeScreenshotByElement(
            await agGridVisualization.getAgGridColsContainer('SQLUpdate'),
            'TC99393_5_04',
            'SQL Transaction Bulk Edit Mode with Slider, after inputting numeric value in the cell',
            { tolerance: 0.01 }
        );
        await inlineEdit.clickConfirmContainerIcon(3, 0, 'SQLUpdate', 'confirm');
        // And Dossier is refreshed in Library consumption mode
        await agGrid.waitForConsumptionModeToRefresh();
        await inlineEdit.sleep(2000);

        //Trigger inline edit for third row of age column
        await inlineEdit.doubleClickGridCellByPosition(4, 6, 'SQLUpdate');
        await inlineEdit.waitForSliderForInlineEdit();
        //Input a numeric value in the cell 30.5
        await inlineEdit.replaceTextInGridCellAndEnter(3, 5, 'SQLUpdate', '30.5');
        //Verify the value is updated in the grid cell
        await since('Value_5 Slider value should be #{expected} instead we have #{actual}')
            .expect(await (await inlineEdit.getInputField(3, 5, 'SQLUpdate')).getText()).toBe('30.5');
        await takeScreenshotByElement(
            await agGridVisualization.getAgGridColsContainer('SQLUpdate'),
            'TC99393_5_05',
            'SQL Transaction Bulk Edit Mode with Slider, after inputting numeric value in the cell',
            { tolerance: 0.01 }
        );
        //tapoutside to dismiss the inline edit
        await inlineEdit.getGridCellByPosition(1, 6, 'SQLUpdate').click();
    });

    it('[TC99393_6] Bulk Edit Consumption for SQL Transaction with Slider', async () => {

        await libraryPage.openDossierById({
            projectId: dossierConsumption.project.id,
            dossierId: dossierConsumption.id,
        });

        //Switch to SQLUpdate page
        await toc.openPageFromTocMenu({ chapterName: 'E2E', pageName: 'SQLUpdate' });
        //Enter bulk edit mode for the Viz SQL Update Data
        await bulkEdit.enterBulkTxnMode('Update Data', 'SQLUpdate');
        //Click zipcode Row 4 value
        await bulkEdit.clickBulkTxnGridCellByPosition(4, 0, 'Update Data');
        //Verify the slider is displayed
        await takeScreenshotByElement(
            await agGridVisualization.getAgGridColsContainer('Update Data'),
            'TC99393_6_01',
            'SQL Transaction Bulk Edit Mode with Slider, slider is highlighted current number and it is left aligned when right-alighted cannot be displayed'
            ,{ tolerance: 0.01 }
        );
        //Drag the slider thumb to the right
        await selector.slider.dragSlider({ x: 200, y: 0 }, 'bottom', false);
        //Verify the value is changed to 30,000.23
        await since('1 Row 4 zipcode value should display #{expected} instead we have #{actual}')
            .expect(await bulkEdit.getBulkTxnGridCellByPosition(4, 0, 'Update Data').getText())
            .toBe('30,000.23');
        //Tap outside to dismiss the slider
        await bulkEdit.clickBulkTxnGridCellByPosition(0, 0, 'Update Data');
        //Verify the value is changed to 30000.23
        await since('1_update Row 4 zipcode value should display #{expected} instead we have #{actual}')
            .expect(await bulkEdit.getBulkTxnGridCellByPosition(4, 0, 'Update Data').getText())
            .toBe('30000.23'); 

        //click zipcode Row 8 value
        await bulkEdit.clickBulkTxnGridCellByPosition(8, 0, 'Update Data');
        //Verify the slider is displayed
        await takeScreenshotByElement(
            await agGridVisualization.getAgGridColsContainer('Update Data'),
            'TC99393_6_02',
            'SQL Transaction Bulk Edit Mode with Slider, it is unset status',
            { tolerance: 0.01 }
        );
        //Input 20000 in the cell
        await bulkEdit.InputValueInBulkTxnGridCell(8, 0, 'Update Data', '20000');
        //Verify the value is changed to 20,121
        await since('3 Row 8 zipcode value should display #{expected} instead we have #{actual}')
            .expect(await bulkEdit.getBulkTxnGridCellByPosition(8, 0, 'Update Data').getText())
            .toBe('20,121');
        await takeScreenshotByElement(
            await agGrid.getTransactionSlider(),
            'TC99393_6_03',
            'SQL Transaction Bulk Edit Mode with Slider, after inputting numeric value in the cell'
        );
        //Click outside to dismiss the slider
        await bulkEdit.clickBulkTxnGridCellByPosition(0, 0, 'Update Data');
        await since('3_update Row 8 zipcode value should display #{expected} instead we have #{actual}')
            .expect(await bulkEdit.getBulkTxnGridCellByPosition(8, 0, 'Update Data').getText())
            .toBe('20121');

        //Click zipcode row 12 value
        await bulkEdit.clickBulkTxnGridCellByPosition(12, 0, 'Update Data');
        //Verify the slider is displayed
        await takeScreenshotByElement(
            await agGrid.getTransactionSlider(),
            'TC99393_6_04',
            'SQL Transaction Bulk Edit Mode with Slider, Slider is unset status'
        );
        //Input 1,000.23 in the cell
        await bulkEdit.InputValueInBulkTxnGridCell(12, 0, 'Update Data', '1,000.23');
        //Verify the value is changed to 1,000.23
        await since('4 Row 12 zipcode value should display #{expected} instead we have #{actual}')
            .expect(await bulkEdit.getBulkTxnGridCellByPosition(12, 0, 'Update Data').getText())
            .toBe('1,000.23');
        await takeScreenshotByElement(
            await agGrid.getTransactionSlider(),
            'TC99393_6_05',
            'SQL Transaction Bulk Edit Mode with Slider, after inputting numeric value in the cell'
        );
        //Click outside to dismiss the slider
        await bulkEdit.clickBulkTxnGridCellByPosition(0, 0, 'Update Data');
        //Verify the value is changed to 1000.23
        await since('4_update Row 12 zipcode value should display #{expected} instead we have #{actual}')
            .expect(await bulkEdit.getBulkTxnGridCellByPosition(12, 0, 'Update Data').getText())
            .toBe('1000.23');

        //Click Salary Row 2 value
        await bulkEdit.clickBulkTxnGridCellByPosition(2, 4, 'Update Data');
        //Verify the slider is displayed
        await takeScreenshotByElement(
            await agGrid.getTransactionSlider(),
            'TC99393_6_06',
            'SQL Transaction Bulk Edit Mode with Slider, Slider is unset status'
        );
        //Drag the slider thumb
        await selector.slider.dragSlider({ x: 50, y: 0 }, 'bottom', false);
        //Verify the value is changed to 2,555,000
        await since('5 Row 2 Salary value should display #{expected} instead we have #{actual}')
            .expect(await bulkEdit.getBulkTxnGridCellByPosition(2, 4, 'Update Data').getText())
            .toBe('2,555,000');
        await takeScreenshotByElement(
            await agGrid.getTransactionSlider(),
            'TC99393_6_07',
            'SQL Transaction Bulk Edit Mode with Slider, after dragging the slider thumb'
        );
        //Click outside to dismiss the slider
        await bulkEdit.clickBulkTxnGridCellByPosition(0, 0, 'Update Data');
        //Verify the value is changed to 2555000
        await since('6 Update Row 2 Salary value should display #{expected} instead we have #{actual}')
            .expect(await bulkEdit.getBulkTxnGridCellByPosition(2, 4, 'Update Data').getText())
            .toBe('2555000');

        //Click Salary Row 4 value
        await bulkEdit.clickBulkTxnGridCellByPosition(4, 4, 'Update Data');
        //Verify the slider is displayed
        await takeScreenshotByElement(
            await agGridVisualization.getAgGridColsContainer('Update Data'),
            'TC99393_6_08',
            'SQL Transaction Bulk Edit Mode with Slider, highlighted current number and it is right-aligned'
            ,{ tolerance: 0.01 }
        );
        //Input -9,000 in the cell
        await bulkEdit.InputValueInBulkTxnGridCell(4, 4, 'Update Data', '-9,000');
        //Verify the value is changed to -9,000
        await since('7 Row 4 Salary value should display #{expected} instead we have #{actual}')
            .expect(await bulkEdit.getBulkTxnGridCellByPosition(4, 4, 'Update Data').getText())
            .toBe('-9,000');
        await takeScreenshotByElement(
            await agGrid.getTransactionSlider(),
            'TC99393_6_09',
            'SQL Transaction Bulk Edit Mode with Slider, after inputting negative value in the cell'
        );
        //Click outside to dismiss the slider
        await bulkEdit.clickBulkTxnGridCellByPosition(0, 0, 'Update Data');
        //Verify the value is changed to -9000
        await since('8 update Row 4 Salary value should display #{expected} instead we have #{actual}')
            .expect(await bulkEdit.getBulkTxnGridCellByPosition(4, 4, 'Update Data').getText())
            .toBe('-9000');

        //Click Salary Row 7 value
        await bulkEdit.clickBulkTxnGridCellByPosition(7, 4, 'Update Data');
        //Verify the slider is displayed
        await takeScreenshotByElement(
            await agGridVisualization.getAgGridColsContainer('Update Data'),
            'TC99393_6_10',
            'SQL Transaction Bulk Edit Mode with Slider, Slider is highlighted current number and it is right-aligned'
            ,{ tolerance: 0.02 }
        );
        //Input 1000000 in the cell
        await bulkEdit.InputValueInBulkTxnGridCell(7, 4, 'Update Data', '1000000');
        //Verify the value is changed to 1,000,000
        await since('9 Row 7 Salary value should display #{expected} instead we have #{actual}')
            .expect(await bulkEdit.getBulkTxnGridCellByPosition(7, 4, 'Update Data').getText())
            .toBe('1,000,000');
        await takeScreenshotByElement(
            await agGrid.getTransactionSlider(),
            'TC99393_6_11',
            'SQL Transaction Bulk Edit Mode with Slider, after inputting large value in the cell'
        );
        //Click outside to dismiss the slider
        await bulkEdit.clickBulkTxnGridCellByPosition(0, 0, 'Update Data');

        //Click Age Row 2 value
        await bulkEdit.clickBulkTxnGridCellByPosition(2, 5, 'Update Data');
        //Verify the slider is displayed
        await takeScreenshotByElement(
            await agGridVisualization.getAgGridColsContainer('Update Data'),
            'TC99393_6_12',
            'SQL Transaction Bulk Edit Mode with Slider, Slider is highlighted current number and it is right-aligned'
            ,{ tolerance: 0.02 }
        );
        //Drag the slider thumb
        await selector.slider.dragSlider({ x: 80, y: 0 }, 'bottom', false);
        //Verify the value is changed to 1,000,000
        await since('10 Row 2 Age value should display #{expected} instead we have #{actual}')
            .expect(await bulkEdit.getBulkTxnGridCellByPosition(2, 5, 'Update Data').getText())
            .toBe('94.45');
        await takeScreenshotByElement(
            await agGridVisualization.getAgGridColsContainer('Update Data'),
            'TC99393_6_13',
            'SQL Transaction Bulk Edit Mode with Slider, after dragging the slider thumb'
            ,{ tolerance: 0.02 }
        );
        //Click outside to dismiss the slider
        await bulkEdit.clickBulkTxnGridCellByPosition(0, 0, 'Update Data');
        //Verify the value is changed to 94.45
        await since('11 update Row 2 Age value should display #{expected} instead we have #{actual}')
            .expect(await bulkEdit.getBulkTxnGridCellByPosition(2, 5, 'Update Data').getText())
            .toBe('94.45'); 

        //Click Age Row 4 value
        await bulkEdit.clickBulkTxnGridCellByPosition(4, 5, 'Update Data');
        //Input 55.252 in the cell
        await bulkEdit.InputValueInBulkTxnGridCell(4, 5, 'Update Data', '55.252');
        //Verify the value is changed to 55.252
        await since('12 Row 4 Age value should display #{expected} instead we have #{actual}')
            .expect(await bulkEdit.getBulkTxnGridCellByPosition(4, 5, 'Update Data').getText())
            .toBe('55.25');
        await takeScreenshotByElement(
            await agGridVisualization.getAgGridColsContainer('Update Data'),
            'TC99393_6_14',
            'SQL Transaction Bulk Edit Mode with Slider, after inputting decimal value in the cell'
            ,{ tolerance: 0.02 }
        );
        //Click outside to dismiss the slider
        await bulkEdit.clickBulkTxnGridCellByPosition(0, 0, 'Update Data');
        //Verify the value is changed to 55.25
        await since('13 update Row 4 Age value should display #{expected} instead we have #{actual}')
            .expect(await bulkEdit.getBulkTxnGridCellByPosition(4, 5, 'Update Data').getText())
            .toBe('55.25');

        //Verify the result
        await takeScreenshotByElement(
            await agGridVisualization.getAgGridColsContainer('Update Data'),
            'TC99393_6_15',
            'SQL Transaction Bulk Edit Mode with Slider, after editing all the values',
            { tolerance: 0.02 }
        );
        //Click Update button
        await bulkEdit.clickOnBulkEditSubmitButton('Update Data', 'Apply');
        await agGrid.selectConfirmationPopupOption('Continue');
        await agGrid.sleep(2000);
        await agGrid.waitForConsumptionModeToRefresh();
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        //Verify the values are updated in the grid
        await takeScreenshotByElement(
            await agGridVisualization.getAgGridColsContainer('SQLUpdate'),
            'TC99393_6_16',
            'SQL Transaction Bulk Edit Mode with Slider, after updating all the values in the grid',
            { tolerance: 0.02 }
        );
    });
    it('[TC99393_7] Bulk Add Consumption for SQL Transaction with Slider', async () => {

        await libraryPage.openDossierById({
            projectId: dossierConsumption.project.id,
            dossierId: dossierConsumption.id,
        });

        //Switch to SQLUpdate page
        await toc.openPageFromTocMenu({ chapterName: 'E2E', pageName: 'SQLInsert' });

        //Enter bulk add mode for the Viz SQL Insert Data
        await bulkEdit.enterBulkTxnMode('Insert Data', 'SQLInsert');
        //Click user id
        await insertData.getInsertSlider(await insertData.getInsertDropdown('User Id ID*', 1));
        //Verify the slider is displayed
        await takeScreenshotByElement(
            await agGridVisualization.getAgGridColsContainer('Insert Data'),
            'TC99393_7_01',
            'SQL Transaction Bulk Add Mode with Slider, slider is unset status',
            { tolerance: 0.02 }
        );
        //Input 9000 in the cell
        await insertData.typeInsertTextBox('9000', await insertData.getInsertTextBox('User Id ID*', 1));
        //Input enter to update the thumb
        await browser.keys([Key.Enter]);
        await insertData.waitForSliderDisappear();
        //Verify the value is changed to 9,000
        await since('1 User Id value should display #{expected} instead we have #{actual}')
            .expect(await (await insertData.getInsertTextBox('User Id ID*', 1, 'ant-select-selection-item')).getText())
            .toBe('9,000')
        //Click slider again to verify the slider is updated
        await insertData.getInsertSlider(await insertData.getInsertDropdown('User Id ID*', 1));
        //Verify the slider is displayed
        await takeScreenshotByElement(
            await insertData.getInsertSliderWithoutClick(),
            'TC99393_7_02',
            'SQL Transaction Bulk Add Mode with Slider, slider is updated status'
        );
        await insertData.clickHeaderElement('User Id ID*');
        //input text for username
        await insertData.typeInsertTextBox('test11', await insertData.getInsertTextBox('Username ID*', 1));
        //Click the slider field of zipcode
        await insertData.getInsertSlider(await insertData.getInsertDropdown('Zipcode ID*', 1));
        //Input 20,000.234 in the cell
        await insertData.typeInsertTextBox('20,000.234', await insertData.getInsertTextBox('Zipcode ID*', 1));
        //Input enter to update the thumb
        await browser.keys([Key.Enter]);
        await insertData.waitForSliderDisappear();
        //Verify the value is changed to 20,000.23
        await since('2 Zipcode value should display #{expected} instead we have #{actual}')
            .expect(await (await insertData.getInsertTextBox('Zipcode ID*', 1, 'ant-select-selection-item')).getText())
            .toBe('20,000.23');
        //Click slider again to verify the slider is updated
        await insertData.getInsertSlider(await insertData.getInsertDropdown('Zipcode ID*', 1));
        //Verify the slider is displayed
        await takeScreenshotByElement(
            await agGridVisualization.getAgGridColsContainer('Insert Data'),
            'TC99393_7_03',
            'SQL Transaction Bulk Add Mode with Slider, slider is updated status',
            { tolerance: 0.01 }
        );
        await insertData.clickHeaderElement('Zipcode ID*');
        //Click the slider field of salary
        await insertData.getInsertSlider(await insertData.getInsertDropdown('Salary*', 1));
        //Input 1,000.5 in the cell
        await insertData.typeInsertTextBox('1,000.5', await insertData.getInsertTextBox('Salary*', 1));
        //Input enter to update the thumb
        await browser.keys([Key.Enter]);
        await insertData.waitForSliderDisappear();
        //Verify the value is changed to 1,000.5
        await since('3 Salary value should display #{expected} instead we have #{actual}')
            .expect(await (await insertData.getInsertTextBox('Salary*', 1, 'ant-select-selection-item')).getText())
            .toBe('1,000.5');
        //Click slider again to verify the slider is updated
        await insertData.getInsertSlider(await insertData.getInsertDropdown('Salary*', 1));
        //Verify the slider is displayed
        await takeScreenshotByElement(
            await insertData.getInsertSliderWithoutClick(),
            'TC99393_7_04',
            'SQL Transaction Bulk Add Mode with Slider, slider is updated status',
        );  
        await insertData.clickHeaderElement('Salary*');
        //Click the slider field of age
        await insertData.getInsertSlider(await insertData.getInsertDropdown('Age*', 1));
        //Input 50 in the cell
        await insertData.typeInsertTextBox('50', await insertData.getInsertTextBox('Age*', 1));
        //Input enter to update the thumb
        await browser.keys([Key.Enter]);
        await insertData.waitForSliderDisappear();
        //Verify the value is changed to 50
        await since('4 Age value should display #{expected} instead we have #{actual}')
            .expect(await (await insertData.getInsertTextBox('Age*', 1, 'ant-select-selection-item')).getText())
            .toBe('50');
        //Click slider again to verify the slider is updated
        await insertData.getInsertSlider(await insertData.getInsertDropdown('Age*', 1));
        //Verify the slider is displayed
        await takeScreenshotByElement(
            await insertData.getInsertSliderWithoutClick(),
            'TC99393_7_05',
            'SQL Transaction Bulk Add Mode with Slider, slider is updated status',
        );
        await insertData.clickHeaderElement('Age*');
        //Add a new row
        await insertData.addNewRow();
        await insertData.sleep(2000);
        //Click the slider field of user id
        await insertData.getInsertSlider(await insertData.getInsertDropdown('User Id ID*', 2));
        await insertData.waitForSliderDisappear(false);
        //Drag the slider thumb
        await selector.slider.dragSliderForInsertData({ x: 30, y: 0 });
        //Verify the value is changed to 71,000
        await since('5 Row 2 User Id value should display #{expected} instead we have #{actual}')
            .expect(await (await insertData.getInsertTextBox('User Id ID*', 2, 'ant-select-selection-item')).getText())
            .toBe('71,000');
        await insertData.clickHeaderElement('User Id ID*');
        //Input text for username
        await insertData.typeInsertTextBox('test12', await insertData.getInsertTextBox('Username ID*', 2));
        //Click the slider field of zipcode
        await insertData.getInsertSlider(await insertData.getInsertDropdown('Zipcode ID*', 2));
        //Drag the slider thumb
        await selector.slider.dragSliderForInsertData({ x: 30, y: 0 });
        //Verify the value is changed to 20,000.23
        await since('6 Row 2 Zipcode value should display #{expected} instead we have #{actual}')
            .expect(await (await insertData.getInsertTextBox('Zipcode ID*', 2, 'ant-select-selection-item')).getText())
            .toBe('20,000.23');
        await insertData.clickHeaderElement('Zipcode ID*');
        //Click the slider field of salary
        await insertData.getInsertSlider(await insertData.getInsertDropdown('Salary*', 2));
        //Drag the slider thumb
        await selector.slider.dragSliderForInsertData({ x: 30, y: 0 });
        //Verify the value is changed to 326.5
        await since('7 Row 2 Salary value should display #{expected} instead we have #{actual}')
            .expect(await (await insertData.getInsertTextBox('Salary*', 2, 'ant-select-selection-item')).getText())
            .toBe('326.5');
        await insertData.clickHeaderElement('Salary*');
        //Click the slider field of age
        await insertData.getInsertSlider(await insertData.getInsertDropdown('Age*', 2));
        //Drag the slider thumb
        await selector.slider.dragSliderForInsertData({ x: 30, y: 0 });
        //Verify the value is changed to 50
        await since('8 Row 2 Age value should display #{expected} instead we have #{actual}')
            .expect(await (await insertData.getInsertTextBox('Age*', 2, 'ant-select-selection-item')).getText())
            .toBe('50');
        await insertData.clickHeaderElement('Age*');
        //Verify the result
        await takeScreenshotByElement(
            await insertData.getInsertContainer('Insert Data'),
            'TC99393_7_06',
            'SQL Transaction Bulk Add Mode with Slider, after adding new row and editing all the values',
        );
        //submit the bulk add
        await bulkEdit.clickOnBulkEditSubmitButton('Insert Data', 'Apply');
        await agGrid.selectConfirmationPopupOption('Continue');
        await agGrid.waitForConsumptionModeToRefresh();
        await libraryPage.waitForCurtainDisappear();
        await agGrid.sleep(2000);
        //Verify the values are added in the grid
        await takeScreenshotByElement(
            await agGridVisualization.getAgGridColsContainer('SQLInsert'),
            'TC99393_7_07',
            'SQL Transaction Bulk Add Mode with Slider, after adding new row and editing all the values in the grid',
        );
    });

    it('[TC99393_8] TXN slider defects', async () => {

        await libraryPage.openDossierById({
            projectId: dossierConsumption.project.id,
            dossierId: dossierConsumption.id,
        });

        //Switch to DE328383 page
        await toc.openPageFromTocMenu({ chapterName: 'Defect', pageName: 'DE328383' });
        //Click the slider field of 2007
        await inlineEdit.doubleClickGridCellByPosition(2, 1, 'DE328383');
        //Verify the slider is displayed
        await takeScreenshotByElement(
            await agGridVisualization.getAgGridViewPort('DE328383'),
            'TC99393_8_01',
            'TXN slider defects - DE328383 Verify the confirm button is displayed when the slider is displayed',
            { tolerance: 0.02 }
        );
        await inlineEdit.getGridCellByPosition(1, 1, 'DE328383').click();

        //Switch to DE328382 page
        await toc.openPageFromTocMenu({ chapterName: 'Defect', pageName: 'DE328382' });
        //For the right viz, click 2007 to trigger inline edit
        await inlineEdit.doubleClickGridCellByPosition(2, 2, 'DE328382');
        //Verify the slider is displayed
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99393_8_02',
            'TXN slider defects - DE328382 Verify the slider can be displayed in the left side',
            { tolerance: 0.02 }
        );
        //scroll to the right
        await agGridVisualization.scrollHorizontally('right', 100, 'DE328382');
        //Verify the confirm button is displayed
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99393_8_03',
            'TXN slider defects - DE328382 Verify the confirm button is displayed when the slider is displayed',
            { tolerance: 0.02 }
        );

        //DE327941
        await agGridVisualization.scrollVerticallyToBottom('DE327941');
        await inlineEdit.doubleClickGridCellByPosition(240, 5, 'DE327941');
        //Verify the slider is displayed, when the below space is not enough to display the slider, display it in the above
        await takeScreenshotByElement(
            await agGridVisualization.getAgGridViewPort('DE327941'),
            'TC99393_8_04',
            'TXN slider defects - DE327941 Verify the slider is displayed when the below space is not enough',
            { tolerance: 0.02 }
        );

        //DE328301
        await toc.openPageFromTocMenu({ chapterName: 'Defect', pageName: 'DE328301' });
        //Pin the Year column
        await agGridVisualization.clickOnContainerTitle('DE328301');
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Year New',
            'Pin Column',
            'to the Left',
            'DE328301'
        );
        //Trigger inline edit for the first row of Year column
        await inlineEdit.doubleClickGridCellByPosition(2, 1, 'DE328301');
        //Verify the slider is displayed
        await takeScreenshotByElement(
            await agGridVisualization.getAgGridViewPort('DE328301'),
            'TC99393_8_05',
            'TXN slider defects - DE328301 Verify the slider is displayed when the column is pinned',
            { tolerance: 0.02 }
        );
    });

    it('[TC99393_9] Verify German User Experience for TXN Slider', async () => {

        //relogin with German user
        await libraryPage.switchUser(dossierTXN.txnGermanUser);

        //Validate input in authoring mode
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await libraryPage.waitForCurtainDisappear();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await tocContentsPanel.clickOnPage('E2E', 'SQLInsert');
        //Open the transaction configuration editor
        await agGrid.openContextMenu('SQLInsert');
        await agGrid.selectContextMenuOption('Transaktion bearbeiten');
        //Expand input configuration
        await inputConfiguration.clickExpandIcon();

        //Verify Slider is translated to German
        await since('TC99393_9_01 Slider label should be #{expected} instead we have #{actual}')
            .expect(await inputConfiguration.getCellByTypeAndInputValue('Control Type', 'User Id@ID').getText())
            .toBe('Schieberegler');

        //click the control type setting button of User Id
        await inputConfiguration.clickControlTypeSettingButton('User Id@ID');
        //Validate slider settings popup is displayed
        await takeScreenshotByElement(
            await txnSQLEditorPopup.getPopup('Schieberegler-Eigenschaften'),
            'TC99393_9_02',
            'SQL Transaction Input Configuration Popup for user id',
            { tolerance: 0.05 }
        );
        //Set the minimum value as -1000
        await txnSQLEditorPopup.setInputNumField('Schieberegler-Eigenschaften', 'Mindestwert', '-1000');
        //Set the maximum value as 3.000.000
        await txnSQLEditorPopup.setInputNumField('Schieberegler-Eigenschaften', 'Höchstwert', '3.000.000');
        //Set the interval as 0,5
        await txnSQLEditorPopup.setInputNumField('Schieberegler-Eigenschaften', 'Intervall', '0,5');
        //Verify the slider is displayed in the popup
        await since('TC99393_9_02.01 Slider min value should be #{expected} instead we have #{actual}')
            .expect(await txnSQLEditorPopup.getInputNumField('Schieberegler-Eigenschaften', 'Mindestwert').getValue())
            .toBe('-1.000');
        await since('TC99393_9_02.02 Slider max value should be #{expected} instead we have #{actual}')
            .expect(await txnSQLEditorPopup.getInputNumField('Schieberegler-Eigenschaften', 'Höchstwert').getValue())
            .toBe('3.000.000');
        await since('TC99393_9_02.03 Slider interval value should be #{expected} instead we have #{actual}')
            .expect(await txnSQLEditorPopup.getInputNumField('Schieberegler-Eigenschaften', 'Intervall').getValue())
            .toBe('0,5');
        //Click the control type setting button of Zipcode
        await inputConfiguration.clickControlTypeSettingButton('Zipcode@ID');
        //Validate slider settings popup is displayed
        await takeScreenshotByElement(
            await txnSQLEditorPopup.getPopup('Schieberegler-Eigenschaften'),
            'TC99393_9_03',
            'SQL Transaction Input Configuration Popup for zipcode',
            { tolerance: 0.02 }
        );

        await txnSQLEditorPopup.clickAddValueButton('Schieberegler-Eigenschaften');
        await txnSQLEditorPopup.setManualInputCell('Schieberegler-Eigenschaften', 6, 1, '1000,234');
        //Validate the manual input value
        await since('TC99393_9_04 Slider manual input value should be #{expected} instead we have #{actual}')
            .expect(await txnSQLEditorPopup.getManualInputCell('Schieberegler-Eigenschaften', 6, 1).getValue())
            .toBe('1.000,23');
        await txnSQLEditorPopup.clickAddValueButton('Schieberegler-Eigenschaften');
        await txnSQLEditorPopup.setManualInputCell('Schieberegler-Eigenschaften', 7, 1, '2.000,3');
        //Validate the manual input value
        await since('TC99393_9_05 Slider manual input value should be #{expected} instead we have #{actual}')
            .expect(await txnSQLEditorPopup.getManualInputCell('Schieberegler-Eigenschaften', 7, 1).getValue())
            .toBe('2.000,3');
        //Add a new row
        await txnSQLEditorPopup.clickAddValueButton('Schieberegler-Eigenschaften');
        await txnSQLEditorPopup.setManualInputCell('Schieberegler-Eigenschaften', 8, 1, '3000.2');
        //Validate the manual input value
        await since('TC99393_9_06 Slider manual input value should be #{expected} instead we have #{actual}')
            .expect(await txnSQLEditorPopup.getManualInputCell('Schieberegler-Eigenschaften', 8, 1).getValue())
            .toBe('30.002');
        //Verify the slider is displayed in the popup
        await takeScreenshotByElement(
            await txnSQLEditorPopup.getPopup('Schieberegler-Eigenschaften'),
            'TC99393_9_04',
            'SQL Transaction Input Configuration Popup after setting properties for zipcode'
        );
        //click the control type setting button
        await inputConfiguration.clickControlTypeSettingButton('Zipcode@ID');
        //Save the transaction configuration
        await transactionConfigEditor.clickButton('Erledigt');
        //Back to library page
        await dossierPage.goToLibrary();
        
        //Open the dossier in consumption mode
        await libraryPage.openDossierById({
            projectId: dossierConsumption.project.id,
            dossierId: dossierConsumption.id,
        });
        await libraryPage.waitForCurtainDisappear();
        //Switch to German page
        await toc.openPageFromTocMenu({ chapterName: 'Defect', pageName: 'German' });

        //Trigger inline edit for third row of revenue column
        await inlineEdit.doubleClickGridCellByPosition(4, 5, 'German');
        //Verify the slider is displayed
        await takeScreenshotByElement(
            await agGridVisualization.getAgGridColsContainer('German'),
            'TC99393_9_07',
            'SQL Transaction Bulk Edit Mode with Slider, slider is highlighted current number'
            ,{ tolerance: 0.01 }
        );
        //Verify the cell displayed as 3.212,5
        await since('TC99393_9_08 Row 3 Revenue value should display #{expected} instead we have #{actual}')
            .expect(await (await inlineEdit.getInputField(3, 4, 'German')).getText())
            .toBe('3.212,5');
        //Move the thumb
        await selector.slider.dragSlider({ x: -60, y: 0 }, 'bottom', false);
        //Verify the value is changed to -2.000,46
        await since('TC99393_9_09 Row 3 Revenue value should display #{expected} instead we have #{actual}')
            .expect(await (await inlineEdit.getInputField(3, 4, 'German')).getText())
            .toBe('-2.000,46');
        //Click confirm icon
        await inlineEdit.clickConfirmContainerIcon(3, 4, 'German', 'confirm');
        // And Dossier is refreshed in Library consumption mode
        await agGrid.waitForConsumptionModeToRefresh();
        await inlineEdit.sleep(3000);
        //Verify the value is changed to -2000,46
        await since('TC99393_9_10 Row 3 Revenue value should display #{expected} instead we have #{actual}')
            .expect(await inlineEdit.getGridCellByPosition(4, 5, 'German').getText())
            .toBe('-2000,46'); 
        
        //Trigger inline edit for 10 row of cost column
        await inlineEdit.doubleClickGridCellByPosition(11, 4, 'German');
        //Verify the slider is displayed
        await takeScreenshotByElement(
            await agGrid.getTransactionSlider(),
            'TC99393_9_11',
            'SQL Transaction Bulk Edit Mode with Slider, slider is highlighted current number'
        );
        //Verify the cell displayed as -1.000,2
        await since('TC99393_9_12 Row 10 Cost value should display #{expected} instead we have #{actual}')
            .expect(await inlineEdit.getGridCellByPosition(11, 4, 'German').getText())
            .toBe('-1.000,2');
        //Input value 1234,5 in the cell
        await inlineEdit.replaceTextInGridCellAndEnter(10, 3, 'German', '1234,5');
        //Verify the value is changed to 1.234,5
        await since('TC99393_9_13 Row 10 Cost value should display #{expected} instead we have #{actual}')
            .expect(await (await inlineEdit.getInputField(10, 3, 'German')).getText()).toBe('1.234,5');
        //Click confirm icon
        await inlineEdit.clickConfirmContainerIcon(10, 3, 'German', 'confirm');
        // And Dossier is refreshed in Library consumption mode
        await agGrid.waitForConsumptionModeToRefresh();
        await inlineEdit.sleep(3000);
        //Verify the value is changed to 1234,5
        await since('TC99393_9_14 Row 10 Cost value should display #{expected} instead we have #{actual}')
            .expect(await inlineEdit.getGridCellByPosition(11, 4, 'German').getText())
            .toBe('1234,5');
        
        //Trigger inline edit for 6 row of revenue column
        await inlineEdit.doubleClickGridCellByPosition(7, 5, 'German');
        await agGrid.waitForTransactionSliderDisplayed();
        //Verify the slider is displayed
        await takeScreenshotByElement(
            await agGrid.getTransactionSlider(),
            'TC99393_9_15',
            'SQL Transaction Bulk Edit Mode with Slider, slider is unset'
        );
        //Verify the cell displayed as empty
        await since('TC99393_9_16 Row 6 Revenue value should display #{expected} instead we have #{actual}')
            .expect(await inlineEdit.getInputField(6, 4, 'German').getText())
            .toBe('');
        //Input value -2,000.46 in the cell
        await inlineEdit.replaceTextInGridCellAndEnter(6, 4, 'German', '-2,000.46');
        //Verify display the red border
        await takeScreenshotByElement(
            await agGridVisualization.getAgGridColsContainer('German'),
            'TC99393_9_17',
            'SQL Transaction Bulk Edit Mode with Slider, after inputting invalid value in the cell',
            { tolerance: 0.02 }
        );
        //Verify the red boarder is displayed
        await inlineEdit.getBadInput(6, 4, 'German').waitForDisplayed({ timeout: 5000 });
        await since('Border_2 Red border should be displayed when input string value in the slider')
            .expect(await (await inlineEdit.getBadInput(6, 4, 'German')).isDisplayed()).toBe(true);
        //Input value -2.000,46 in the cell
        await inlineEdit.replaceTextInGridCellAndEnter(6, 4, 'German', '-2.000,46');
        //Verify the value is changed to -2.000,46
        await since('TC99393_9_18 Row 6 Revenue value should display #{expected} instead we have #{actual}')
            .expect(await inlineEdit.getInputField(6, 4, 'German').getText())
            .toBe('-2.000,46');
        //Click confirm icon
        await inlineEdit.clickConfirmContainerIcon(6, 4, 'German', 'confirm');
        // And Dossier is refreshed in Library consumption mode
        await agGrid.waitForConsumptionModeToRefresh();
        await inlineEdit.sleep(3000);
        //Verify the value is changed to -2000,46
        await since('TC99393_9_19 Row 6 Revenue value should display #{expected} instead we have #{actual}')
            .expect(await inlineEdit.getGridCellByPosition(7, 5, 'German').getText())
            .toBe('-2000,46');
        
        //Trigger bulk edit mode
        await bulkEdit.enterBulkTxnMode('Daten aktualisieren', 'German');
        //Click the slider field of Cost Row 3
        await bulkEdit.clickBulkTxnGridCellByPosition(3, 3, 'Daten aktualisieren');
        //Verify the slider is displayed
        await takeScreenshotByElement(
            await agGrid.getTransactionSlider(),
            'TC99393_9_20',
            'SQL Transaction Bulk Edit Mode with Slider, slider is displayed'
        );
        //Input 1234,5 in the cell
        await bulkEdit.InputValueInBulkTxnGridCell(3, 3, 'Daten aktualisieren', '1234,5');
        //Verify the value is changed to 1.234,5
        await since('TC99393_9_21 Row 3 Cost value should display #{expected} instead we have #{actual}')
            .expect(await bulkEdit.getBulkTxnGridCellByPosition(3, 3, 'Daten aktualisieren').getText())
            .toBe('1.234,5');
        //Click outside to dismiss the slider
        await bulkEdit.clickBulkTxnGridCellByPosition(0, 0, 'Daten aktualisieren');
        //Verify the value is changed to 1234,5
        await since('TC99393_9_22 Row 3 Cost value should display #{expected} instead we have #{actual}')
            .expect(await bulkEdit.getBulkTxnGridCellByPosition(3, 3, 'Daten aktualisieren').getText())
            .toBe('1234,5');
        
        //Click the slider field of Revenue Row 3
        await bulkEdit.clickBulkTxnGridCellByPosition(3, 4, 'Daten aktualisieren');
        //Verify the slider is displayed
        await takeScreenshotByElement(
            await agGrid.getTransactionSlider(),
            'TC99393_9_23',
            'SQL Transaction Bulk Edit Mode with Slider, slider is displayed'
        );
        //Input -2.222,22 in the cell
        await bulkEdit.InputValueInBulkTxnGridCell(3, 4, 'Daten aktualisieren', '-2.222,22');
        //Verify the value is changed to -2.222,22
        await since('TC99393_9_24 Row 3 Revenue value should display #{expected} instead we have #{actual}')
            .expect(await bulkEdit.getBulkTxnGridCellByPosition(3, 4, 'Daten aktualisieren').getText())
            .toBe('-2.222,22');
        //Click outside to dismiss the slider
        await bulkEdit.clickBulkTxnGridCellByPosition(0, 0, 'Daten aktualisieren');
        //Verify the value is changed to -2222,22
        await since('TC99393_9_25 Row 3 Revenue value should display #{expected} instead we have #{actual}')
            .expect(await bulkEdit.getBulkTxnGridCellByPosition(3, 4, 'Daten aktualisieren').getText())
            .toBe('-2222,22');
        //Cancel the bulk edit
        await bulkEdit.clickOnBulkEditSubmitButton('Daten aktualisieren', 'Abbrechen');
        await libraryPage.waitForCurtainDisappear();

        //Bulk add mode
        await bulkEdit.enterBulkTxnMode('Daten einfügen', 'German');
        //Click Cost New
        await insertData.getInsertSlider(await insertData.getInsertDropdown('Cost New*', 1));
        //Verify the slider is displayed
        await takeScreenshotByElement(
            await insertData.getInsertSliderWithoutClick(),
            'TC99393_9_26',
            'SQL Transaction Bulk Add Mode with Slider, slider is unset status',
        );
        //Input 1234,51 in the cell
        await insertData.typeInsertTextBox('1234,51', await insertData.getInsertTextBox('Cost New*', 1));
        //Input enter to update the thumb
        await browser.keys([Key.Enter]);
        await insertData.waitForSliderDisappear();
        //Verify the value is changed to 1.234,5
        await since('TC99393_9_27 Cost New value should display #{expected} instead we have #{actual}')
            .expect(await (await insertData.getInsertTextBox('Cost New*', 1, 'ant-select-selection-item')).getText())
            .toBe('1.234,5')
        //Click slider again to verify the slider is updated
        await insertData.getInsertSlider(await insertData.getInsertDropdown('Cost New*', 1));
        //Verify the slider is displayed
        await takeScreenshotByElement(
            await insertData.getInsertSliderWithoutClick(),
            'TC99393_9_28',
            'SQL Transaction Bulk Add Mode with Slider, slider is updated status',
        );
        await insertData.clickHeaderElement('Cost New*');
        //Click Revenue New
        await insertData.getInsertSlider(await insertData.getInsertDropdown('Revenue New*', 1));
        //Input 3.212,5 in the cell
        await insertData.typeInsertTextBox('3.212,5', await insertData.getInsertTextBox('Revenue New*', 1));
        //Input enter to update the thumb
        await browser.keys([Key.Enter]);
        await insertData.waitForSliderDisappear();
        //Verify the value is changed to 3.212,5
        await since('TC99393_9_29 Revenue New value should display #{expected} instead we have #{actual}')
            .expect(await (await insertData.getInsertTextBox('Revenue New*', 1, 'ant-select-selection-item')).getText())
            .toBe('3.212,5');
        //Click slider again to verify the slider is updated
        await insertData.getInsertSlider(await insertData.getInsertDropdown('Revenue New*', 1));
        //Verify the slider is displayed
        await takeScreenshotByElement(
            await insertData.getInsertSliderWithoutClick(),
            'TC99393_9_30',
            'SQL Transaction Bulk Add Mode with Slider, slider is updated status',
        );  
        await insertData.clickHeaderElement('Revenue New');
        //Cancel the bulk add
        await bulkEdit.clickOnBulkEditSubmitButton('Daten einfügen', 'Abbrechen');
    });
});