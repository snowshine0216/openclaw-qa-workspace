import * as reportConstants from '../../../constants/report.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';

describe('Report Editor Display Attribute Form', () => {
    let {
        dossierPage,
        reportToolbar,
        reportEditorPanel,
        libraryPage,
        reportGridView,
        reportPageBy,
        loginPage,
        reportAttributeFormsDialog,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(reportConstants.reportUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.openDefaultApp();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC86138] Test display attribute form in report editor', async () => {
        await libraryPage.editReportByUrl({
            projectId: reportConstants.TC86138.project.id,
            dossierId: reportConstants.TC86138.id,
        });
        await reportToolbar.switchToDesignMode();
        await since(
            'The current selection for page by selector "Category" should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Category'))
            .toBe('Books');
        await since('The grid cell at "0", "0" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Subcategory');
        await since('The grid cell at "0", "1" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Region');
        await since('The grid cell at "0", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Manager');
        await since('The grid cell at "0", "4" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('2015 & 2016');
        await since('The grid cell at "0", "5" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 5))
            .toBe('Custom Categories');

        await reportEditorPanel.openMectricContextMenuInMetricsDropzone('Cost');
        await since('The context menu should not contain item "Display Attribute Forms"')
            .expect(await reportEditorPanel.contextMenuContainsOption('Display Attribute Forms'))
            .toBe(false);

        await reportEditorPanel.openAttributeFormsDialogInRows('Subcategory');
        await since('Current Attribute Display Form Mode should be #{expected}, instead we have #{actual}')
            .expect(await reportAttributeFormsDialog.getCurrentAttributeDisplayFormModeText())
            .toBe('Off');
        await reportAttributeFormsDialog.selectDisplayAttributeFormMode('On');
        await since('Current Attribute Display Form Mode should be "On"')
            .expect(await reportAttributeFormsDialog.getCurrentAttributeDisplayFormModeText())
            .toBe('On');
        await reportAttributeFormsDialog.saveAndCloseAttributeFormsDialog();
        await since(
            'The current selection for page by selector "Category DESC" should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Category DESC'))
            .toBe('Books');
        await since('The grid cell at "0", "0" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Subcategory DESC');
        await since('The grid cell at "0", "1" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Region DESC');
        await since('The grid cell at "0", "2" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Manager Last Name');
        await since('The grid cell at "0", "3" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Manager First Name');
        await since('The grid cell at "0", "4" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('2015 & 2016');
        await since('The grid cell at "0", "5" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 5))
            .toBe('Custom Categories');

        await reportEditorPanel.openAttributeFormsDialogInRows('Region');
        await since('Current Attribute Display Form Mode should be #{expected}, instead we have #{actual}')
            .expect(await reportAttributeFormsDialog.getCurrentAttributeDisplayFormModeText())
            .toBe('On');
        await reportAttributeFormsDialog.selectDisplayAttributeFormMode('Form name only');
        await since('Current Attribute Display Form Mode should be #{expected}, instead we have #{actual}')
            .expect(await reportAttributeFormsDialog.getCurrentAttributeDisplayFormModeText())
            .toBe('Form name only');
        await reportAttributeFormsDialog.saveAndCloseAttributeFormsDialog();
        await since(
            'The current selection for page by selector "DESC" should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('DESC'))
            .toBe('Books');
        await since('The grid cell at "0", "0" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('DESC');
        await since('The grid cell at "0", "1" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('DESC');
        await since('The grid cell at "0", "2" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Last Name');
        await since('The grid cell at "0", "3" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('First Name');
        await since('The grid cell at "0", "4" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('2015 & 2016');
        await since('The grid cell at "0", "5" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 5))
            .toBe('Custom Categories');

        await reportEditorPanel.openAttributeFormsDialogInRows('Manager');
        await since('Current Attribute Display Form Mode should be #{expected}, instead we have #{actual}')
            .expect(await reportAttributeFormsDialog.getCurrentAttributeDisplayFormModeText())
            .toBe('Form name only');
        await reportAttributeFormsDialog.selectDisplayAttributeFormMode('Show attribute name once');
        await since('Current Attribute Display Form Mode should be #{expected}, instead we have #{actual}')
            .expect(await reportAttributeFormsDialog.getCurrentAttributeDisplayFormModeText())
            .toBe('Show attribute name once');
        await reportAttributeFormsDialog.saveAndCloseAttributeFormsDialog();
        await since(
            'The current selection for page by selector "Category DESC" should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Category DESC'))
            .toBe('Books');
        await since('The grid cell at "0", "0" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Subcategory DESC');
        await since('The grid cell at "0", "1" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Region DESC');
        await since('The grid cell at "0", "2" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Manager Last Name');
        await since('The grid cell at "0", "3" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('First Name');
        await since('The grid cell at "0", "4" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('2015 & 2016');
        await since('The grid cell at "0", "5" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 5))
            .toBe('Custom Categories');

        await reportEditorPanel.openAttributeFormsDialogInRows('Manager');
        await since(
            'The checkbox before "Use the attribute\'s default list of forms" should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isDefaultFormsCheckboxChecked())
            .toBe(true);
        await reportAttributeFormsDialog.clickDefaultFormCheckBox();
        await since(
            'The checkbox before "Use the attribute\'s default list of forms" should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isDefaultFormsCheckboxChecked())
            .toBe(false);
        await since(
            'The attribute form "Email" in Report Objects Forms list should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isAttributeFormChecked('Email'))
            .toBe(false);
        await since(
            'The attribute form "Display Address" in Report Objects Forms list should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isAttributeFormChecked('Display Address'))
            .toBe(false);
        await since(
            'The attribute form "Device" in Report Objects Forms list should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isAttributeFormChecked('Device'))
            .toBe(false);
        await reportAttributeFormsDialog.enableDisplayAttributeForms(['Email', 'Display Address'], false);
        await since(
            'The attribute form "Email" in Report Objects Forms list should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isAttributeFormChecked('Email'))
            .toBe(true);
        await since(
            'The attribute form "Display Address" in Report Objects Forms list should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isAttributeFormChecked('Display Address'))
            .toBe(true);
        await reportAttributeFormsDialog.saveAndCloseAttributeFormsDialog();
        await since(
            'The current selection for page by selector "Category DESC" should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Category DESC'))
            .toBe('Books');
        await since('The grid cell at "0", "0" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Subcategory DESC');
        await since('The grid cell at "0", "1" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Region DESC');
        await since('The grid cell at "0", "2" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Manager Last Name');
        await since('The grid cell at "0", "3" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('First Name');
        await since('The grid cell at "0", "4" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('Email');
        // await since('The grid cell at "0", "5" should have text #{expected}, instead we have #{actual}')
        //     .expect(await reportGridView.getGridCellTextByPos(0, 5))
        //     .toBe('Display Address');
        // await since('The grid cell at "0", "6" should have text #{expected}, instead we have #{actual}')
        //     .expect(await reportGridView.getGridCellTextByPos(0, 6))
        //     .toBe('2015 & 2016');
        // await reportGridView.scrollGridHorizontally('Visualization 1', 250);
        // await since('The grid cell at "0", "7" should have text #{expected}, instead we have #{actual}')
        //     .expect(await reportGridView.getGridCellTextByPos(0, 7))
        //     .toBe('Custom Categories');

        await reportEditorPanel.openAttributeFormsDialogInRows('Manager');
        await since(
            'The checkbox before "Use the attribute\'s default list of forms" should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isDefaultFormsCheckboxChecked())
            .toBe(false);
        await since(
            'The attribute form "Last Name" in Report Objects Forms list should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isAttributeFormChecked('Last Name'))
            .toBe(true);
        await since(
            'The attribute form "First Name" in Report Objects Forms list should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isAttributeFormChecked('First Name'))
            .toBe(true);
        await since(
            'The attribute form "Email" in Report Objects Forms list should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isAttributeFormChecked('Email'))
            .toBe(true);
        await since(
            'The attribute form "Display Address" in Report Objects Forms list should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isAttributeFormChecked('Display Address'))
            .toBe(true);
        await since(
            'The attribute form "Device" in Report Objects Forms list should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isAttributeFormChecked('Device'))
            .toBe(false);
        await reportAttributeFormsDialog.cancelAndCloseAttributeFormsDialog();

        await reportEditorPanel.openAttributeFormsDialogInRows('Manager');
        await since(
            'The checkbox before "Use the attribute\'s default list of forms" should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isDefaultFormsCheckboxChecked())
            .toBe(false);
        await reportAttributeFormsDialog.enableDisplayAttributeForms(['Email', 'Device'], false);
        await since(
            'The attribute form "Last Name" in Report Objects Forms list should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isAttributeFormChecked('Last Name'))
            .toBe(true);
        await since(
            'The attribute form "First Name" in Report Objects Forms list should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isAttributeFormChecked('First Name'))
            .toBe(true);
        await since(
            'The attribute form "Email" in Report Objects Forms list should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isAttributeFormChecked('Email'))
            .toBe(false);
        await since(
            'The attribute form "Display Address" in Report Objects Forms list should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isAttributeFormChecked('Display Address'))
            .toBe(true);
        await since(
            'The attribute form "Device" in Report Objects Forms list should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isAttributeFormChecked('Device'))
            .toBe(true);
        await reportAttributeFormsDialog.saveAndCloseAttributeFormsDialog();
        await since(
            'The current selection for page by selector "Category DESC" should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Category DESC'))
            .toBe('Books');
        await since('The grid cell at "0", "0" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Subcategory DESC');
        await since('The grid cell at "0", "1" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Region DESC');
        await since('The grid cell at "0", "2" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Manager Last Name');
        await since('The grid cell at "0", "3" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('First Name');
        await since('The grid cell at "0", "4" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('Display Address');
        await since('The grid cell at "0", "5" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 5))
            .toBe('Device');
        await since('The grid cell at "0", "6" should have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 6))
            .toBe('2015 & 2016');
    });

    it('[TC86138_1] Test display attribute forms for Subset Report', async () => {
        await libraryPage.editReportByUrl({
            projectId: reportConstants.SubsetReportDefinedForms.project.id,
            dossierId: reportConstants.SubsetReportDefinedForms.id,
        });
        await reportToolbar.switchToDesignMode();

        await since('The grid cell at "0", "0" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Region');
        await since('The grid cell at "0", "1" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Manager');
        await since('The grid cell at "0", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('');
        await since('The grid cell at "0", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Employee');
        await since('The grid cell at "0", "4" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('');
        await since('The grid cell at "0", "5" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 5))
            .toBe('Cost');
        await since('The grid cell at "1", "0" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Northeast');
        await since('The grid cell at "1", "1" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('');
        await since('The grid cell at "1", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('');
        await since('The grid cell at "1", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('Kelly');
        await since('The grid cell at "1", "4" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('Laura');
        await since('The grid cell at "1", "5" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 5))
            .toBe('$778,125');

        await reportEditorPanel.openAttributeFormsDialogInRows('Manager');
        await since(
            "The checkbox before Use the attribute's default list of forms should be #{expected}, instead we have #{actual}"
        )
            .expect(await reportAttributeFormsDialog.isDefaultFormsCheckboxChecked())
            .toBe(true);
        await reportAttributeFormsDialog.clickDefaultFormCheckBox();
        await since(
            "The checkbox before Use the attribute's default list of forms should be #{expected}, instead we have #{actual}"
        )
            .expect(await reportAttributeFormsDialog.isDefaultFormsCheckboxChecked())
            .toBe(false);
        await since(
            'The attribute form "Last Name" in Display Attribute Forms list should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isAttributeFormChecked('Last Name'))
            .toBe(true);
        await since(
            'The attribute form "First Name" in Display Attribute Forms list should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isAttributeFormChecked('First Name'))
            .toBe(true);
        await since(
            'The attribute form "ID" in Display Attribute Forms list should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isAttributeFormChecked('ID'))
            .toBe(false);
        await since(
            'The attribute form "Email" in Display Attribute Forms list should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isAttributeFormChecked('Email'))
            .toBe(false);
        await since(
            'The attribute form "Device" in Display Attribute Forms list should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isAttributeFormChecked('Device'))
            .toBe(false);
        await reportAttributeFormsDialog.enableDisplayAttributeForms(['Device'], false);
        await since(
            'The attribute form "Device" in Display Attribute Forms list should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isAttributeFormChecked('Device'))
            .toBe(true);
        await reportAttributeFormsDialog.saveAndCloseAttributeFormsDialog();

        await since(
            'After enabled Device attribute form, the grid cell at "1", "3" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('66A69A9914AC11D5BE9B00C04F13C1B1');

        await reportEditorPanel.openAttributeFormsDialogInRows('Manager');

        await since(
            "The checkbox before Use the attribute's default list of forms should be #{expected}, instead we have #{actual}"
        )
            .expect(await reportAttributeFormsDialog.isDefaultFormsCheckboxChecked())
            .toBe(false);
        await since(
            'The attribute form "Last Name" in Display Attribute Forms list should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isAttributeFormChecked('Last Name'))
            .toBe(true);
        await since(
            'The attribute form "First Name" in Display Attribute Forms list should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isAttributeFormChecked('First Name'))
            .toBe(true);
        await since(
            'The attribute form "Device" in Display Attribute Forms list should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isAttributeFormChecked('Device'))
            .toBe(true);
        await since(
            'The attribute form "Email" in Display Attribute Forms list should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isAttributeFormChecked('Email'))
            .toBe(false);
        await since(
            'The attribute form "ID" in Display Attribute Forms list should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isAttributeFormChecked('ID'))
            .toBe(false);
        await reportAttributeFormsDialog.enableDisplayAttributeForms(['Last Name', 'First Name'], false);
        await since(
            'The attribute form "Last Name" in Display Attribute Forms list should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isAttributeFormPresent('Last Name'))
            .toBe(false);
        await since(
            'The attribute form "First Name" in Display Attribute Forms list should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isAttributeFormPresent('First Name'))
            .toBe(false);
        await since(
            'The attribute form "Device" in Display Attribute Forms list should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isAttributeFormChecked('Device'))
            .toBe(true);
        await reportAttributeFormsDialog.saveAndCloseAttributeFormsDialog();

        await since(
            'After uncheck Last Name and First Name attribute form, the grid cell at "1", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('66A69A9914AC11D5BE9B00C04F13C1B1');

        await reportEditorPanel.openAttributeFormsDialogInRows('Manager');
        await since(
            'The attribute form "Last Name" in Display Attribute Forms list should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isAttributeFormPresent('Last Name'))
            .toBe(false);
        await since(
            'The attribute form "First Name" in Display Attribute Forms list should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isAttributeFormPresent('First Name'))
            .toBe(false);
        await reportAttributeFormsDialog.cancelAndCloseAttributeFormsDialog();

        await reportEditorPanel.openAttributeFormsDialogInRows('Employee');
        await reportAttributeFormsDialog.clickDefaultFormCheckBox();
        await since(
            'The attribute form "SSN" in Display Attribute Forms list should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isAttributeFormPresent('SSN'))
            .toBe(false);
        await reportAttributeFormsDialog.enableDisplayAttributeForms(['Last Name', 'ID'], false);
        await since(
            'The attribute form "ID" in Display Attribute Forms list should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isAttributeFormChecked('ID'))
            .toBe(true);
        await since(
            'The attribute form "Last Name" in Display Attribute Forms list should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportAttributeFormsDialog.isAttributeFormChecked('Last Name'))
            .toBe(false);
        await reportAttributeFormsDialog.saveAndCloseAttributeFormsDialog();

        await since(
            'Fater enabled ID and uncheck Last Name and First Name attribute form, the grid cell at "1", "3" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('20');
    });
});
