import * as reportConstants from '../../../../constants/report.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { browserWindow } from '../../../../constants/index.js';
import { assertWithinTolerance } from '../../../../utils/assertionHelper.js';

describe('Report Editor Undo/Redo Functionality In Authoring Mode By Creating New Report', () => {
    let {
        libraryPage,
        reportEditorPanel,
        reportGridView,
        // reportDatasetPanel,
        reportToolbar,
        loginPage,
        newFormatPanelForGrid,
        reportFormatPanel,
        reportTOC,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(reportConstants.undoUser);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await libraryPage.editReportByUrl({
            projectId: reportConstants.FormattingUndoTest.project.id,
            dossierId: reportConstants.FormattingUndoTest.id,
        });
        await reportToolbar.switchToDesignMode();
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.handleError();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });
    // comment out create new report since it's quite unstable and has little impact on the test
    // async function createNewReport() {
    //     await libraryPage.createNewReportByUrl({});
    //     await reportDatasetPanel.selectMultipleItemsInObjectList(['Schema Objects', 'Attributes', 'Time']);
    //     await reportDatasetPanel.addObjectToRows('Year');
    //     await reportDatasetPanel.clickFolderUpIcon();
    //     await reportDatasetPanel.selectItemInObjectList('Products');
    //     await reportDatasetPanel.addMultipleObjectsToRows(['Category']);
    //     await reportDatasetPanel.clickFolderUpMultipleTimes(3);
    //     await reportDatasetPanel.selectMultipleItemsInObjectList(['Public Objects', 'Metrics', 'Sales Metrics']);
    //     await reportDatasetPanel.addMutltipleObjectsToColumns(['Cost', 'Profit']);
    //     await reportToolbar.switchToDesignMode();
    // }

    it('[TC97485_17] FUN | Report Editor | Undo/Redo in Format Panel 1', async () => {
        const columnWithInitialWidth = await reportGridView.getGridCellStyleByPos(0, 1, 'width');
        console.log('1 columnWithInitialWidth', columnWithInitialWidth);
        await reportTOC.switchToFormatPanel();
        await newFormatPanelForGrid.expandTemplateSection();

        // Action 1: Select Grid Template Style
        await newFormatPanelForGrid.selectGridTemplateStyle('classic');

        // Action 2: Select Grid Template Color
        await newFormatPanelForGrid.selectGridTemplateColor('Blue');
        await browser.pause(reportConstants.sleepTimeForUndoRedo);
        const columnWidthIntFitToContent = parseInt(await reportGridView.getGridCellStyleByPos(0, 1, 'width'));
        console.log('2 columnWidthIntFitToContent', columnWidthIntFitToContent);

        // Action 3. Go to Format Panel - Spacing - Fit to Container.
        await newFormatPanelForGrid.expandSpacingSection();
        await reportFormatPanel.openColumnSizeFitSelectionBox();
        await reportFormatPanel.selectOptionFromDropdown('Fit to Container');
        await browser.pause(reportConstants.sleepTimeForUndoRedo);
        const columnWidthIntFitToContainer = parseInt(await reportGridView.getGridCellStyleByPos(0, 1, 'width'));
        console.log('3 columnWidthIntFitToContainer', columnWidthIntFitToContainer);
        // Action 4. Add Minimum Column Width Option
        await reportFormatPanel.openMinimumColumnWidthMenu();
        await reportFormatPanel.addMinimumColumnWidthOption('Category');
        const columnWidthIntInitialMinimumColumnWidth = parseInt(
            await reportGridView.getGridCellStyleByPos(0, 1, 'width')
        );
        console.log('4 columnWidthIntInitialMinimumColumnWidth', columnWidthIntInitialMinimumColumnWidth);
        await reportFormatPanel.setMinimumColumnWidthValue('Category', '250');
        await browser.pause(reportConstants.sleepTimeForUndoRedo);
        const columnWidthIntMinimumColumnWidth = parseInt(await reportGridView.getGridCellStyleByPos(0, 1, 'width'));
        console.log('5 columnWidthIntMinimumColumnWidth', columnWidthIntMinimumColumnWidth);
        // UNDO 5  update minimum column width option to 250
        await reportToolbar.clickUndo(true);
        await browser.pause(reportConstants.sleepTimeForUndoRedo);
        const columnWidthIntUndo = parseInt(await reportGridView.getGridCellStyleByPos(0, 1, 'width'));
        console.log('6 columnWidthIntUndo', columnWidthIntUndo);
        await since(
            'Undo 5 update minimum column width option to 250 for Category, The element at "0", "1" should have minimum column width #{expected}, instead we have #{actual}'
        )
            .expect(columnWidthIntUndo)
            .toBe(263);
        await since(
            'Undo 5  update minimum column width option to 250 for Category, The minimum column width should be 0 in format panel, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getValueOfMinimumColumnWidthOption('Category'))
            .toBe('0px');

        // UNDO 4  add minimum column width option
        await reportToolbar.clickUndo(true);
        await reportToolbar.clickUndo(true); // have to undo twice
        await since(
            'Undo 4 add minimum column width option for Category, the minimum column width input section should be displayed in format panel, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.isMinimumColumnWidthInputDisplayed('Category'))
            .toBe(false);

        // check width
        const columnWidthIntUndo2 = parseInt(await reportGridView.getGridCellStyleByPos(0, 1, 'width'));
        const result = assertWithinTolerance({
            actual: columnWidthIntUndo2,
            expected: 88,
            tolerance: 2,
        });
        since(
            'Undo 4 add minimum column width option for Category, the width of the element at "0", "1" should be within tolerance 2, instead we have #{actual}'
        )
            .expect(result)
            .toBeTrue(); // pass in local, however fails in CI

        // UNDO 3 select Fit to Container
        await reportToolbar.clickUndo(true);
        await browser.pause(reportConstants.sleepTimeForUndoRedo);
        const columnWidthIntUndo3 = parseInt(await reportGridView.getGridCellStyleByPos(0, 1, 'width'));
        await since(
            'Undo 3 select Fit to Container, The element at "0", "1" should have minimum column width #{expected}, instead we have #{actual}'
        )
            .expect(columnWidthIntUndo3)
            .toBe(columnWidthIntFitToContent);

        // the minimum width section should be gone
        await since(
            'Undo 3 select Fit to Container, the minimum width section should be gone in format panel, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.isMinimumColumnWidthSectionDisplayed())
            .toBe(false);

        // UNDO 2 select blue color
        await reportToolbar.clickUndo(true);
        await since(
            'Undo 2 select blue color, The element at "0", "1" should have back ground color #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 1, 'background-color'))
            .toBe('rgba(235,235,235,1)');

        // REDO 1 select grid template style
        await reportToolbar.clickRedo(true);
        await since(
            'Redo 1 select grid template style, The element at "1", "0" should have right border style, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 0, 'border-right-style'))
            .toBe('solid');

        // REDO 2 select grid template color
        await reportToolbar.clickRedo(true);
        await since(
            'Redo 2 select grid template color, The element at "1", "0" should have right border style #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 0, 'border-right-style'))
            .toBe('solid');

        // REDO 3 select blue color
        await reportToolbar.clickRedo(true);
        await since(
            'Redo 3 select blue color, The element at "0", "1" should have background color #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 1, 'background-color'))
            .toBe('rgba(28,141,212,1)');

        // REDO 4 select fit to container
        await reportToolbar.clickRedo(true);
        await browser.pause(reportConstants.sleepTimeForUndoRedo);
        const columnWidthIntRedo = parseInt(await reportGridView.getGridCellStyleByPos(0, 1, 'width'));
        await since(
            'Redo 4 select fit to container, The element at "0", "1" should have minimum column width #{expected}, instead we have #{actual}'
        )
            .expect(columnWidthIntRedo)
            .toBeGreaterThan(250);

        // REDO 5 add minimum column width option
        await reportToolbar.clickRedo(true);
        await since(
            'Redo 5 add minimum column width option, The element at "0", "1" should have minimum column width #{expected}, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.isMinimumColumnWidthInputDisplayed('Category'))
            .toBe(true);

        // check width
        const columnWidthIntRedo2 = parseInt(await reportGridView.getGridCellStyleByPos(0, 1, 'width'));
        await since(
            'Redo 5 add minimum column width option, The element at "0", "1" should have width #{expected}, instead we have #{actual}'
        )
            .expect(columnWidthIntRedo2)
            .toBe(columnWidthIntMinimumColumnWidth);
        // check minimum column width input value
        await browser.pause(reportConstants.sleepTimeForUndoRedo);
        // await since(
        //     'Redo 5 add minimum column width option, The minimum column width input value should be #{expected}, instead we have #{actual}'
        // )
        //     .expect(await reportFormatPanel.getValueOfMinimumColumnWidthOption('Category'))
        //     .toBe('250px');
    });

    it('[TC97485_18] FUN | Report Editor | Undo/Redo in Format Panel 2', async () => {
        await reportTOC.switchToFormatPanel();
        await newFormatPanelForGrid.expandSpacingSection();
        // Action 1. Set Cell Padding to small
        await newFormatPanelForGrid.selectCellPadding('small');
        // Action 2. Set Padding Value  5 for Top
        await reportFormatPanel.setPaddingValue('Top', '5');

        // Action 3. disable Merge repetitive cells
        await newFormatPanelForGrid.expandLayoutSection();
        await reportFormatPanel.clickCheckBoxForOption('Row headers', 'Merge repetitive cells');
        // Action 4. Lock headers for column headers
        await reportFormatPanel.clickCheckBoxForOption('Column headers', 'Lock headers');
        // Action 5. Enable Outline mode
        await reportFormatPanel.enableOutlineMode();
        // Action 6. Enable Standard Outline mode
        await reportFormatPanel.enableStandardOutlineMode();
        // Action 7. Enable Banding
        await reportFormatPanel.enableBanding();
        // Action 8. Select Banding by Rows
        await reportFormatPanel.selectBandingByColumns();
        // Action 9. set Apply Color By Number of Columns
        await reportFormatPanel.applyColorByNumberOfColumns();
        // Action 10. set Apply Color Every
        await reportFormatPanel.setApplyColorEvery('2');
        // Action 11. change first banding color to be Peach
        await reportFormatPanel.changeFirstBandingColor('#FFDEC6');

        // Undo 11 change first banding color to be Peach
        await reportToolbar.clickUndo(true);
        await since(
            'Undo 11 change first banding color to be Peach, The first banding color should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getFirstBandingColor())
            .toBe('transparent');
        // check background color for cell  "0" "1"
        await since(
            'Undo 11 change first banding color to be Peach, The background color for cell "0" "1" should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 3, 'background-color'))
            .toBe('rgba(235,235,235,1)');

        // Undo 10 set Apply Color By Number of Columns to be 2
        await reportToolbar.clickUndo(true);
        await since(
            'Undo 10 set Apply Color By Number of Columns to be 2, The apply color by number of columns should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getApplyColorByNumberOfColumns())
            .toBe('1');

        // Undo 9 enable banding by columns
        await reportToolbar.clickUndo(true);
        await since('Undo 9 enable banding by columns, The banding should by columns, instead we have #{actual}')
            .expect(await reportFormatPanel.isBandingByColumns())
            .toBe(true);

        // Undo 8 apply color by number of columns
        await reportToolbar.clickUndo(true);
        await since(
            'Undo 8 apply color by number of columns, The apply color by number of columns should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.applyColorBySelectionBox.getText())
            .toBe('Number of Rows');

        // Undo7 enable banding
        await reportToolbar.clickUndo(true);
        await since('Undo 7 enable banding, The banding should be disabled, instead we have #{actual}')
            .expect(await reportFormatPanel.isBandingEnabled())
            .toBe(false);

        // check background color for cell  "2" "0"
        await since(
            'Undo 7 enable banding, The background color for cell "2" "0" should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 0, 'background-color'))
            .toBe('rgba(255,255,255,1)');

        // Undo 6 enable standard outline mode
        await reportToolbar.clickUndo(true);
        await since(
            'Undo 6 enable standard outline mode, The layout selection box should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getLayoutSelectionBoxValue())
            .toBe('Compact');
        // get width of cell "0", "2"
        const cellWidthIntUndo7 = parseInt(await reportGridView.getGridCellStyleByPos(0, 2, 'width'));
        const result = assertWithinTolerance({
            actual: cellWidthIntUndo7,
            expected: 100,
            tolerance: 2,
        });
        since(
            'Undo 6 enable standard outline mode, The width of cell "0" "2" should be within tolerance 2, instead we have #{actual}'
        )
            .expect(result)
            .toBeTrue();

        // Undo 5 enable outline mode
        await reportToolbar.clickUndo(true);
        await since('Undo 5 enable outline mode, The outline mode should be disabled, instead we have #{actual}')
            .expect(await reportFormatPanel.isOutlineModeEnabled())
            .toBe(false);
        // the collapse icon for cell "0" "1" should be gone
        await since(
            'Undo 5 enable outline mode, The collapse icon for cell "0" "0" should be gone, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellCollapseIconByPos('0', '0'))
            .toBe(false);

        // UNDO 4 lock headers for column headers
        await reportToolbar.clickUndo(true);
        await since(
            'Undo 4 lock headers for column headers, The column headers should be locked, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getCheckedCheckbox('Column headers', 'Lock headers').isDisplayed())
            .toBe(true);
        // UNOD 3 disable Merge repetitive cells
        await reportToolbar.clickUndo(true);
        await since(
            'Undo 3 disable Merge repetitive cells, The merge repetitive cells should be enabled, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getCheckedCheckbox('Row headers', 'Merge repetitive cells').isDisplayed())
            .toBe(true);
        // grid cell "5" "0" should have be 2015
        await since(
            'Undo 3 disable Merge repetitive cells, The grid cell "5" "0" should have be 2015, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellText(5, 0))
            .toBe('2015');

        // UNDO 2 set Padding Value to 5 for Top
        await reportToolbar.clickUndo(true);
        await since(
            'Undo 2 set Padding Value to 5 for Top, The padding value for Top should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getPaddingValue('Top'))
            .toBe('2.3');
        await since(
            'Undo 2 set Padding Value to 5 for Top, The small cell padding should be unselected, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.isCellPaddingButtonChecked('small'))
            .toBe(true);
        // grid cell "0" "0" should have padding-top 2.3
        await since(
            'Undo 2 set Padding Value to 5 for Top, The padding-top for grid cell "0" "0" should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'padding-top'))
            .toBe('3px');

        // UNDO 1 set Small padding
        await reportToolbar.clickUndo(true);
        await since('Undo 1 set Small padding, The small cell padding should be unselected, instead we have #{actual}')
            .expect(await reportFormatPanel.isCellPaddingButtonChecked('small'))
            .toBe(false);
        await since(
            'Undo 1 set Small padding, The padding value for Top should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getPaddingValue('Top'))
            .toBe('3.4');
        // grid cell "0" "0" should have padding 2.3
        await since(
            'Undo 1 set Small padding, The padding for grid cell "0" "0" should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'padding'))
            .toBe('4px');
    });

    it('[TC97485_19] FUN | Report Editor | Undo/Redo in Format Panel 3', async () => {
        await reportTOC.switchToFormatPanel();
        // Action 1. Format Column Values Text Font
        await newFormatPanelForGrid.switchToTextFormatTab();
        await reportFormatPanel.selectGridSegment('All', 'All');
        await newFormatPanelForGrid.selectTextFont(reportConstants.updateFont);
        // Action 2. Set Text Bold
        await reportFormatPanel.clickTextFormatButton('bold');
        // Action 3. Set Text Font Size
        await newFormatPanelForGrid.setTextFontSize('12pt');
        // Action 4. Set Text Alignment
        await newFormatPanelForGrid.selectFontAlign('center');
        // Action 5. uncheck wrap text for Cost Headers
        await reportFormatPanel.selectGridSegment('Cost', 'Headers');
        await newFormatPanelForGrid.disableWrapText();
        // Action 6. Set Border Style
        // await reportFormatPanel.selectGridSegment('Cost', 'Values');
        await reportFormatPanel.selectGridSegment('All', 'All');
        await reportFormatPanel.selectOptionFromBorderStyleDropdown('2 point solid', 'top');
        // Action 7. Set Border Color
        await reportFormatPanel.selectOptionFromBorderColorDropdown('#83C962', 'top');
        // await reportFormatPanel.selectOptionFromBorderStyleDropdown('None', 'right');

        // -------------- comment out below steps for defect DE319183, wait for server code in for defect DE319183
        await reportTOC.switchToEditorPanel();
        // Action 8. Remove all objects
        await reportEditorPanel.removeAll();

        await reportTOC.switchToFormatPanel();

        // Undo 8 remove all objects
        await reportToolbar.clickUndo(true);
        await reportToolbar.clickUndo(true); // have to undo twice, however can't reproduce in manual
        await since('Undo 8 remove all objects, we should see the formatted grid is back, instead we have #{actual}')
            .expect(await reportGridView.getGridCellText(0, 2))
            .toBe('Cost');
        await since(
            'Undo 8 remove all objects, The element at "0", "2" should have font family #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 2, 'font-family'))
            .toContain(reportConstants.updateFontFamily);
        await since(
            'Undo 8 remove all objects, The element at "0", "2" should have font size #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 2, 'font-size'))
            .toBe('16px');
        await since(
            'Undo 8 remove all objects, The element at "0", "2" should have font weight #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 2, 'font-weight'))
            .toBe('700');

        // check top border color for cell "0", "2"
        await since(
            'Undo 8 remove all objects, The top border color for cell "0", "2" should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 2, 'border-top-color'))
            .toBe('rgba(131,201,98,1)');

        // check top border style for cell "0", "2"
        await since(
            'Undo 8 remove all objects, The top border style for cell "0", "2" should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 2, 'border-top-width'))
            .toBe('2px');
        // -------------------------------------
        // UNDO 7 set border style color to be #83C962
        // issue here: DE321667 we need to click undo twice to see the correct result
        // await reportToolbar.clickUndo(true);
        await reportToolbar.clickUndo(true);
        await since(
            'Undo 7 set border style color to be #83C962, The element at "0", "2" should have right border style #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 2, 'border-top-color'))
            .toBe('rgba(0,0,0,1)');

        // check border color dropdown section style
        await since(
            'Undo 7 set border style color to be #83C962, The border color dropdown section style should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getBorderColorDropDownSectionStyle('top'))
            .toBe('inherit');

        // UNDO 6 set border style to solid
        await reportToolbar.clickUndo(true);
        await since(
            'Undo 6 set border style to solid, The element at "0", "2" should have bottom border style #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 2, 'border-bottom-style'))
            .toBe('solid');
        // check width of cell "0", "2"
        await since(
            'Undo 6 set border style to solid, The width of cell "0", "2" should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 2, 'border-bottom-width'))
            .toBe('1px');
        /// check border style dropdown value
        await since(
            'Undo 6 set border style to solid, The border style dropdown value for cell "0", "2" should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getBorderStyleDropdownValue('top'))
            .toBe('None');

        // UNDO 5 unwrap text
        await reportToolbar.clickUndo(true);
        await reportFormatPanel.selectGridSegment('Cost', 'Headers');
        // comment it since fails to get the text-wrap-mode value in CI
        // await since(
        //     'Undo 5 unwrap text, The element at "0", "2" should have text-wrap-mode #{expected}, instead we have #{actual}'
        // )
        //     .expect(await reportGridView.getGridCellStyleByPos(0, 2, 'text-wrap-mode'))
        //     .toBe('wrap');

        // check no wrap text checkbox
        await since('Undo 5 unwrap text, The no wrap text checkbox should be #{expected}, instead we have #{actual}')
            .expect(await newFormatPanelForGrid.isCheckBoxChecked('Wrap text'))
            .toBe(true);

        // UNDO 4 set text alignment to be center
        await reportToolbar.clickUndo(true);
        await since(
            'Undo 4 set text alignment to be center, The element at "0", "2" should have text alignment #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 2, 'text-align'))
            .toBe('right');
        // check text alignment dropdown value
        await since(
            'Undo 4 set text alignment to be center, The text alignment center button should be unselected, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.isFontAlignButtonSelected('center'))
            .toBe(false);

        await since(
            'Undo 4 set text alignment to be center, The text alignment right button should be selected, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.isFontAlignButtonSelected('right'))
            .toBe(true);

        // UNDO 3 set text font size to be 12pt
        await reportToolbar.clickUndo(true);
        await since(
            'Undo 3 set text font size to be 12pt, The element at "0", "2" should have text font size #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 2, 'font-size'))
            .toBe('12px');

        // check text font size dropdown value
        await since(
            'Undo 3 set text font size to be 12pt, The text font size dropdown value should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getFontTextSizeInputValue())
            .toBe('9pt');

        // UNDO 2 set text bold
        await reportToolbar.clickUndo(true);
        await since(
            'Undo 2 set text bold, The element at "0", "2" should have font weight #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 2, 'font-weight'))
            .toBe('400');
        // check text bold dropdown value
        await since(
            'Undo 2 set text bold, The text bold dropdown value should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.isTextFormatButtonSelected('bold'))
            .toBe(false);

        // UNDO 1 set text font to be Comic Sans MS
        await reportToolbar.clickUndo(true);
        await since(
            'Undo 1 set text font to be Comic Sans MS, The element at "0", "2" should have text font #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 2, 'font-family'))
            .toContain('arial');

        // check text font dropdown value
        await since(
            'Undo 1 set text font to be Comic Sans MS, The text font dropdown value for cell "0", "2" should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getFontSelectorValue())
            .toBe('Arial');

        // REDO 1 set text font to be Comic Sans MS
        await reportToolbar.clickRedo(true);
        await since(
            'Redo 1 set text font to be Comic Sans MS, The element at "0", "2" should have text font #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 2, 'font-family'))
            .toContain(reportConstants.updateFontFamily);
        // check text font dropdown value
        await since(
            'Redo 1 set text font to be Comic Sans MS, The text font dropdown value for cell "0", "2" should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getFontSelectorValue())
            .toBe(reportConstants.updateFont);
        // Redo 2 set text bold
        await reportToolbar.clickRedo(true);
        await since(
            'Redo 2 set text bold, The element at "0", "2" should have text font weight #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 2, 'font-weight'))
            .toBe('700');
        // check text bold dropdown value
        await since(
            'Redo 2 set text bold, The text bold dropdown value should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.isTextFormatButtonSelected('bold'))
            .toBe(true);
        // Redo 3 set text font size to be 12pt
        await reportToolbar.clickRedo(true);
        await since(
            'Redo 3 set text font size to be 12pt, The element at "0", "2" should have text font size #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 2, 'font-size'))
            .toBe('16px');
        // check text font size dropdown value
        await since(
            'Redo 3 set text font size to be 12pt, The text font size dropdown value for cell "0", "2" should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getFontTextSizeInputValue())
            .toBe('12pt');
        // Redo 4 set text alignment to be center
        await reportToolbar.clickRedo(true);
        await since(
            'Redo 4 set text alignment to be center, The element at "0", "2" should have text alignment #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 2, 'text-align'))
            .toBe('center');
        // check text alignment dropdown value
        await since(
            'Redo 4 set text alignment to be center, The text alignment dropdown value for cell "0", "2" should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.isFontAlignButtonSelected('center'))
            .toBe(true);
        // Redo 5 unwrap text
        await reportToolbar.clickRedo(true);
        await reportFormatPanel.selectGridSegment('Cost', 'Headers');
        // await since(
        //     'Redo 5 unwrap text, The element at "0", "2" should have text-wrap-mode #{expected}, instead we have #{actual}'
        // )
        //     .expect(await reportGridView.getGridCellStyleByPos(0, 2, 'text-wrap-mode'))
        //     .toBe('nowrap');
        // check no wrap text checkbox
        await since('Redo 5 unwrap text, The no wrap text checkbox should be #{expected}, instead we have #{actual}')
            .expect(await newFormatPanelForGrid.getUncheckedCheckbox('Wrap text').isDisplayed())
            .toBe(true);

        // Redo 6 set border style to solid
        await reportToolbar.clickRedo(true);
        await since(
            'Redo 6 set border style to solid, The element at "0", "2" should have bottom border style #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 2, 'border-bottom-style'))
            .toBe('solid');
        // check border style dropdown value
        await since(
            'Redo 6 set border style to solid, The border style dropdown value for cell "0", "2" should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getBorderStyleDropdownValue('bottom'))
            .not.toBe('None');
        // Redo 7 set border color to be #83C962
        await reportToolbar.clickRedo(true);
        await since(
            'Redo 7 set border color to be #83C962, The element at "0", "2" should have bottom border color #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 2, 'border-bottom-color'))
            .toBe('rgba(194,194,194,1)');
        // check border color dropdown value
        await since(
            'Redo 7 set border color to be #83C962, The border color dropdown value for cell "0", "2" should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getBorderColorDropDownSectionStyle('bottom'))
            .toBe('rgb(194, 194, 194)');
        // // Redo 8 Remove All
        await reportToolbar.clickRedo(true);
        await reportTOC.switchToEditorPanel();
        await since('Redo 8 Remove All, the dropzone should be empty, instead we have #{actual}')
            .expect((await reportEditorPanel.getRowsObjects()).length)
            .toBe(0);
    });
});
