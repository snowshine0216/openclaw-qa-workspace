import * as reportConstants from '../../../../constants/report.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';

describe('Format panel changes', () => {
    let {
        loginPage,
        libraryPage,
        reportDatasetPanel,
        reportToolbar,
        reportGridView,
        reportTOC,
        reportFormatPanel,
        newFormatPanelForGrid,
        baseFormatPanelReact,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(reportConstants.reportUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.handleError();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC86198] Functional [Report Editor] Formatting]', async () => {
        await libraryPage.createNewReportByUrl({});
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Schema Objects', 'Attributes', 'Time']);
        await reportDatasetPanel.addObjectToRows('Year');
        await reportDatasetPanel.clickFolderUpIcon();
        await reportDatasetPanel.selectItemInObjectList('Products');
        await reportDatasetPanel.addMultipleObjectsToRows(['Category', 'Subcategory']);
        await reportDatasetPanel.clickFolderUpMultipleTimes(3);
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Public Objects', 'Metrics', 'Sales Metrics']);
        await reportDatasetPanel.addMultipleObjectsToColumns(['Cost', 'Profit']);
        await reportDatasetPanel.addObjectToColumns('Profit Margin');
        await reportToolbar.switchToDesignMode();
        await since(
            'After switch to design mode, The grid cell at "0", "0"  should has text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');
        await since(
            'After switch to design mode, The grid cell at "0", "0" should has style "background-color" with value "rgba(235,235,235,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'background-color'))
            .toBe('rgba(235,235,235,1)');
        await since(
            'After switch to design mode, The grid cell at "0", "3" should has text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Cost');
        await since(
            'After switch to design mode, The grid cell at "0", "3" should has style "background-color" with value "rgba(235,235,235,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 3, 'background-color'))
            .toBe('rgba(235,235,235,1)');
        await reportTOC.switchToFormatPanel();
        await newFormatPanelForGrid.expandTemplateSection();
        await newFormatPanelForGrid.selectGridTemplateStyle('classic');
        await newFormatPanelForGrid.selectGridTemplateColor('Blue');
        //  Then the grid cell at "0", "0" has style "background-color" with value "rgba(28,141,212,1)"
        // And the grid cell at "0", "3" has style "background-color" with value "rgba(28,141,212,1)"
        await since(
            'After update template color to Blue, The grid cell at "0", "0" should has style "background-color" with value "rgba(28,141,212,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'background-color'))
            .toBe('rgba(28,141,212,1)');
        await since(
            'After update template color to Blue, The grid cell at "0", "3" should has style "background-color" with value "rgba(28,141,212,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 3, 'background-color'))
            .toBe('rgba(28,141,212,1)');
        await newFormatPanelForGrid.switchToTextFormatTab();
        //  columns headers won't be affected by text format, change to Values
        await reportFormatPanel.selectGridSegment('Columns', 'Values');
        await newFormatPanelForGrid.selectTextFont(reportConstants.updateFont);
        await reportFormatPanel.clickTextFormatButton('bold');
        await newFormatPanelForGrid.setTextFontSize('12');
        await newFormatPanelForGrid.selectFontAlign('right');
        await since(
            'After update text format, The grid cell at "0", "0" should has style "background-color" with value "rgba(28,141,212,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'background-color'))
            .toBe('rgba(28,141,212,1)');
        await since(
            'After update text format, The grid cell at "0", "3" should has style "background-color" with value "rgba(28,141,212,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 3, 'background-color'))
            .toBe('rgba(28,141,212,1)');
        await since(
            'After update text format, The grid cell at "0", "3" should has style "background-color" with value "rgba(28,141,212,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 0, 'background-color'))
            .toBe('rgba(255,255,255,1)');
        await since(
            'After update text format, The grid cell at "0", "3" should has style "background-color" with value "rgba(28,141,212,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 3, 'background-color'))
            .toBe('rgba(255,255,255,1)');
        await since(
            'After update text format, The grid cell at "0", "3" should has style "font-weight" with value "400", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 3, 'font-weight'))
            .toBe('700');
        await since(
            'After update text format, The grid cell at "1", "0" should has style "background-color" with value "rgba(255,255,255,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 0, 'background-color'))
            .toBe('rgba(255,255,255,1)');
        await since(
            'After update text format, The grid cell at "1", "3" should has style "background-color" with value "rgba(255,255,255,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 3, 'background-color'))
            .toBe('rgba(255,255,255,1)');
        await reportFormatPanel.selectGridSegment('Cost', 'Headers');
        await reportFormatPanel.clickTextFormatButton('underline');
        // Then the grid cell at "0", "0" has style "background-color" with value "rgba(28,141,212,1)"
        // And the grid cell at "0", "3" has style "background-color" with value "rgba(28,141,212,1)"
        // And the grid cell at "0", "3" has style "text-decoration" with value "underline"
        // And the grid cell at "1", "0" has style "background-color" with value "rgba(255,255,255,1)"
        // And the grid cell at "1", "3" has style "background-color" with value "rgba(255,255,255,1)"
        await since(
            'After update text format to underline, The grid cell at "0", "0" should has style "background-color" with value "rgba(28,141,212,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'background-color'))
            .toBe('rgba(28,141,212,1)');
        await since(
            'After update text format to underline, The grid cell at "0", "3" should has style "background-color" with value "rgba(28,141,212,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 3, 'background-color'))
            .toBe('rgba(28,141,212,1)');
        await since(
            'After update text format to underline, The grid cell at "0", "3" should has style "text-decoration" with value "underline", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 3, 'text-decoration'))
            .toContain('underline');
        await since(
            'After update text format to underline, The grid cell at "1", "0" should has style "background-color" with value "rgba(255,255,255,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 0, 'background-color'))
            .toBe('rgba(255,255,255,1)');
        await since(
            'After update text format to underline, The grid cell at "1", "3" should has style "background-color" with value "rgba(255,255,255,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 3, 'background-color'))
            .toBe('rgba(255,255,255,1)');

        await reportFormatPanel.selectGridSegment('Year', 'Values');
        await reportFormatPanel.selectOptionFromBorderStyleDropdown('2 point solid', 'top');
        await reportFormatPanel.selectOptionFromBorderColorDropdown('#83C962', 'top');
        await reportFormatPanel.closeBorderColorDropdown('top');
        await reportFormatPanel.selectOptionFromBorderStyleDropdown('1 point solid', 'left');
        await reportFormatPanel.selectOptionFromBorderColorDropdown('#1C8DD4', 'left');
        await reportFormatPanel.closeBorderColorDropdown('left');
        await reportFormatPanel.selectOptionFromBorderStyleDropdown('None', 'bottom');
        await reportFormatPanel.selectOptionFromBorderStyleDropdown('None', 'right');
        await since(
            'After update border style, The grid cell at "1", "0" should has style "border-style" with value "solid none none solid", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 0, 'border-style'))
            .toBe('solid none none solid');
        await since(
            'After update border style, The grid cell at "1", "3" should has style "border-style" with value "none solid solid none", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 3, 'border-style'))
            .toBe('none solid solid none');

        await reportFormatPanel.selectGridSegment('Rows', 'Values');
        await reportFormatPanel.clickTextFormatButton('italic');
        //   Then the grid cell at "1", "0" has style "font-style" with value "italic"
        await since(
            'After update format for rows values to italic, The grid cell at "1", "0" should has style "font-style" with value "italic", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 0, 'font-style'))
            .toBe('italic');

        await reportFormatPanel.selectGridSegment('Profit', 'Headers');
        await reportFormatPanel.clickTextFormatButton('bold');
        // Then the grid cell at "0", "4" has style "font-weight" with value "700"
        await since(
            'After update text format for columns headers to bold, The grid cell at "0", "4" should has style "font-weight" with value "700", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 4, 'font-weight'))
            .toBe('400');
        await reportFormatPanel.selectGridSegment('Rows', 'Values');
        await reportFormatPanel.clickTextFormatButton('italic');
        await since(
            'After update text format for rows values to italic, The grid cell at "1", "0" should has style "font-style" with value "normal", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 0, 'font-style'))
            .toBe('normal');
        await reportFormatPanel.selectGridSegment('Profit', 'Headers');
        await reportFormatPanel.clickTextFormatButton('bold');
        await since(
            'After update text format for columns headers to bold, The grid cell at "0", "4" should has style "font-weight" with value "400", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 4, 'font-weight'))
            .toBe('700');
    });

    it('[TC86199] E2E [Report Editor] create report, apply formatting, save and reopen report', async () => {
        await libraryPage.createNewReportByUrl({});
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Schema Objects', 'Attributes', 'Time']);
        await reportDatasetPanel.addObjectToRows('Year');
        await reportDatasetPanel.clickFolderUpMultipleTimes(3);
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Public Objects', 'Metrics', 'Sales Metrics']);
        await reportDatasetPanel.addObjectToColumns('Cost');
        await reportToolbar.switchToDesignMode();
        // Then the grid cell at "0", "0" has text "Year"
        await since(
            'After switch to design mode, The grid cell at "0", "0" should have text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "0", "0" has style "background-color" with value "rgba(235,235,235,1)"
        await since(
            'After switch to design mode, The grid cell at "0", "0" should have style "background-color" with value "rgba(235,235,235,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'background-color'))
            .toBe('rgba(235,235,235,1)');

        // And the grid cell at "0", "1" has text "Cost"
        await since(
            'After switch to design mode, The grid cell at "0", "1" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Cost');

        // And the grid cell at "0", "1" has style "background-color" with value "rgba(235,235,235,1)"
        await since(
            'After switch to design mode, The grid cell at "0", "1" should have style "background-color" with value "rgba(235,235,235,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 1, 'background-color'))
            .toBe('rgba(235,235,235,1)');

        // When I switch to "Format" Panel in Report Editor
        await reportTOC.switchToFormatPanel();

        // And I switch to Text format tab in Format Panel in Report Editor
        await newFormatPanelForGrid.switchToTextFormatTab();
        await reportFormatPanel.selectGridSegment('Columns', 'Values');
        await reportFormatPanel.clickTextFormatButton('bold');
        await newFormatPanelForGrid.setTextFontSize('20');
        await newFormatPanelForGrid.clickFontColorBtn();
        await newFormatPanelForGrid.clickBuiltInColor('#AADED7');
        // And I click to close the color picker
        await baseFormatPanelReact.dismissColorPicker();
        // Then the grid cell at "0", "0" has style "background-color" with value "rgba(235,235,235,1)"
        await since(
            'After update text format, The grid cell at "0", "0" should have style "background-color" with value "rgba(235,235,235,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'background-color'))
            .toBe('rgba(235,235,235,1)');

        // And the grid cell at "0", "1" has style "background-color" with value "rgba(235,235,235,1)"
        await since(
            'After update text format, The grid cell at "0", "1" should have style "background-color" with value "rgba(235,235,235,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 1, 'background-color'))
            .toBe('rgba(235,235,235,1)');

        // And the grid cell at "0", "1" has style "color" with value "rgba(170,222,215,1)"
        await since(
            'After update text format, The grid cell at "0", "1" should have style "color" with value "rgba(170,222,215,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 1, 'color'))
            .toBe('rgba(170,222,215,1)');

        // And the grid cell at "0", "1" has style "font-size" with value "26.67px"
        await since(
            'After update text format, The grid cell at "0", "1" should have font-size with value "26.67px", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 1, 'font-size'))
            .toBe('26.67px');

        // And the grid cell at "1", "0" has style "font-weight" with value "400"
        await since(
            'After update text format, The grid cell at "1", "0" should have font-weight with value "400", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 0, 'font-weight'))
            .toBe('400');

        // And the grid cell at "1", "1" has style "font-weight" with value "400"
        await since(
            'After update text format, The grid cell at "1", "1" should have font-weight with value "400", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 1, 'font-weight'))
            .toBe('400');

        // And the grid cell at "1", "0" has style "background-color" with value "rgba(255,255,255,1)"
        await since(
            'After update text format, The grid cell at "1", "0" should have background-color with value "rgba(255,255,255,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 0, 'background-color'))
            .toBe('rgba(255,255,255,1)');

        // And the grid cell at "1", "1" has style "background-color" with value "rgba(255,255,255,1)"
        await since(
            'After update text format, The grid cell at "1", "1" should have background-color with value "rgba(255,255,255,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 1, 'background-color'))
            .toBe('rgba(255,255,255,1)');
        await reportFormatPanel.selectGridSegment('Rows', 'Headers');
        await reportFormatPanel.clickTextFormatButton('bold');
        await reportFormatPanel.clickTextFormatButton('italic');
        await newFormatPanelForGrid.setTextFontSize('20');
        // Then the grid cell at "0", "0" has style "background-color" with value "rgba(235,235,235,1)"
        await since(
            'After update text format with bold and italic, The grid cell at "0", "0" should have style "background-color" with value "rgba(235,235,235,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'background-color'))
            .toBe('rgba(235,235,235,1)');

        // And the grid cell at "0", "0" has style "font-style" with value "italic"
        await since(
            'After update text format with bold and italic, The grid cell at "0", "0" should have font-style with value "italic", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'font-style'))
            .toBe('italic');

        // And the grid cell at "0", "0" has style "font-weight" with value "700"
        await since(
            'After update text format with bold and italic, The grid cell at "0", "0" should have font-weight with value "700", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'font-weight'))
            .toBe('700');

        // And the grid cell at "0", "0" has style "font-size" with value "26.67px"
        await since(
            'After update text format with bold and italic, The grid cell at "0", "0" should have font-size with value "26.67px", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'font-size'))
            .toBe('26.67px');
        await reportFormatPanel.selectGridSegment('Year', 'All');
        await reportFormatPanel.clickTextFormatButton('bold');
        await reportFormatPanel.clickTextFormatButton('italic');
        await newFormatPanelForGrid.setTextFontSize('20');
        // Then the grid cell at "0", "0" has style "background-color" with value "rgba(235,235,235,1)"
        await since(
            'After update text format for year, The grid cell at "0", "0" should have style "background-color" with value "rgba(235,235,235,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'background-color'))
            .toBe('rgba(235,235,235,1)');

        // And the grid cell at "0", "0" has style "font-style" with value "italic"
        await since(
            'After update text format for year, The grid cell at "0", "0" should have style "font-style" with value "italic", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'font-style'))
            .toBe('italic');

        // And the grid cell at "0", "0" has style "font-weight" with value "700"
        await since(
            'After update text format for year, The grid cell at "0", "0" should have style "font-weight" with value "700", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'font-weight'))
            .toBe('700');

        // And the grid cell at "0", "0" has style "font-size" with value "26.67px"
        await since(
            'After update text format for year, The grid cell at "0", "0" should have style "font-size" with value "26.67px", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'font-size'))
            .toBe('26.67px');

        // And the grid cell at "1", "0" has style "background-color" with value "rgba(255,255,255,1)"
        await since(
            'After update text format for year, The grid cell at "1", "0" should have style "background-color" with value "rgba(255,255,255,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 0, 'background-color'))
            .toBe('rgba(255,255,255,1)');

        // And the grid cell at "1", "0" has style "font-style" with value "italic"
        await since(
            'After update text format for year, The grid cell at "1", "0" should have style "font-style" with value "italic", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 0, 'font-style'))
            .toBe('italic');

        // And the grid cell at "1", "0" has style "font-weight" with value "700"
        await since(
            'After update text format for year, The grid cell at "1", "0" should have font-weight 700, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 0, 'font-weight'))
            .toBe('700');

        // And the grid cell at "1", "0" has style "font-size" with value "26.67px"
        await since(
            'After update text format for year, The grid cell at "1", "0" should have font-size 26.67px, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 0, 'font-size'))
            .toBe('26.67px');
        await reportFormatPanel.selectGridSegment('Cost', 'All');
        await reportFormatPanel.clickTextFormatButton('bold');
        await reportFormatPanel.clickTextFormatButton('italic');
        await newFormatPanelForGrid.setTextFontSize('20');
        // Then the grid cell at "0", "1" has style "background-color" with value "rgba(235,235,235,1)"
        await since(
            'After update text format for cost, The grid cell at "0", "1" should have background-color rgba(235,235,235,1), instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 1, 'background-color'))
            .toBe('rgba(235,235,235,1)');

        // And the grid cell at "0", "1" has style "font-style" with value "italic"
        await since(
            'After update text format for cost, The grid cell at "0", "1" should have style "font-style" with value "italic", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 1, 'font-style'))
            .toBe('italic');

        // And the grid cell at "0", "1" has style "font-weight" with value "700"
        await since(
            'After update text format for cost, The grid cell at "0", "1" should have style "font-weight" with value "700", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 1, 'font-weight'))
            .toBe('700');

        // And the grid cell at "0", "1" has style "font-size" with value "26.67px"
        await since(
            'After update text format for cost, The grid cell at "0", "1" should have style "font-size" with value "26.67px", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 1, 'font-size'))
            .toBe('26.67px');
        // And the grid cell at "1", "1" has style "background-color" with value "rgba(255,255,255,1)"
        await since(
            'After update text format for cost, The grid cell at "1", "1" should have style "background-color" with value "rgba(255,255,255,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 1, 'background-color'))
            .toBe('rgba(255,255,255,1)');

        // And the grid cell at "1", "1" has style "font-style" with value "italic"
        await since(
            'After update text format for cost, The grid cell at "1", "1" should have style "font-style" with value "italic", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 1, 'font-style'))
            .toBe('italic');

        // And the grid cell at "1", "1" has style "font-weight" with value "700"
        await since(
            'After update text format for cost, The grid cell at "1", "1" should have style "font-weight" with value "700", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 1, 'font-weight'))
            .toBe('700');

        // And the grid cell at "1", "1" has style "font-size" with value "26.67px"
        await since(
            'After update text format for cost, The grid cell at "1", "1" should have style "font-size" with value "26.67px", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 1, 'font-size'))
            .toBe('26.67px');

        await reportFormatPanel.selectGridSegment('All', 'All');
        await reportFormatPanel.selectOptionFromBorderStyleDropdown('2 point solid', 'top');
        await reportFormatPanel.selectOptionFromBorderColorDropdown('#83C962', 'top');
        await reportFormatPanel.closeBorderColorDropdown('top');
        await reportFormatPanel.selectOptionFromBorderStyleDropdown('1 point solid', 'left');
        await reportFormatPanel.selectOptionFromBorderColorDropdown('#1C8DD4', 'left');
        await reportFormatPanel.closeBorderColorDropdown('left');
        await reportFormatPanel.selectOptionFromBorderStyleDropdown('None', 'bottom');
        await reportFormatPanel.selectOptionFromBorderStyleDropdown('None', 'right');
        // Then the grid cell at "1", "0" has style "border-style" with value "solid none none solid"
        await since(
            'After update border style, The grid cell at "1", "0" should have style "border-style"   with value "solid none none solid", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 0, 'border-style'))
            .toBe('solid none none solid');

        // And the grid cell at "1", "0" has style "border-style" with value "solid none none solid"
        await since(
            'After update border style, The grid cell at "1", "0" should have style "border-style" with value "solid none none solid", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 0, 'border-style'))
            .toBe('solid none none solid');

        await reportFormatPanel.clickTextFormatButton('bold');
        await newFormatPanelForGrid.setTextFontSize('30');
        await newFormatPanelForGrid.clickFontColorBtn();
        await newFormatPanelForGrid.clickBuiltInColor('#028F94');
        // And I click to close the color picker
        await baseFormatPanelReact.dismissColorPicker();
        // And I click on "italic" text format button
        await reportFormatPanel.clickTextFormatButton('italic');

        // Then the grid cell at "0", "0" has style "background-color" with value "rgba(235,235,235,1)"
        await since(
            'After update text format color, The grid cell at "0", "0" should have style "background-color" with value "rgba(235,235,235,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'background-color'))
            .toBe('rgba(235,235,235,1)');

        // And the grid cell at "0", "0" has style "font-style" with value "italic"
        await since(
            'After update text format color, The grid cell at "0", "0" should have font-style with value "italic", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'font-style'))
            .toBe('italic');

        // And the grid cell at "0", "0" has style "font-weight" with value "700"
        await since(
            'After update text format color, The grid cell at "0", "0" should have font-weight with value "700", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'font-weight'))
            .toBe('700');

        // And the grid cell at "0", "0" has style "font-size" with value "40px"
        await since(
            'After update text format color, The grid cell at "0", "0" should have font-size with value "40px", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'font-size'))
            .toBe('40px');

        // And the grid cell at "0", "1" has style "color" with value "rgba(2,143,148,1)"
        await since(
            'After update text format color, The grid cell at "0", "1" should have color with value "rgba(2,143,148,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 1, 'color'))
            .toBe('rgba(2,143,148,1)');

        // And the grid cell at "1", "0" has style "background-color" with value "rgba(255,255,255,1)"
        await since(
            'After update text format color, The grid cell at "1", "0" should have background-color with value "rgba(255,255,255,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 0, 'background-color'))
            .toBe('rgba(255,255,255,1)');

        // And the grid cell at "1", "0" has style "font-style" with value "italic"
        await since(
            'After update text format color, The grid cell at "1", "0" should have font-style with value "italic", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 0, 'font-style'))
            .toBe('italic');
        // And the grid cell at "1", "0" has style "font-weight" with value "700"
        await since(
            'After update text format color, The grid cell at "1", "0" should have font-weight with value "700", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 0, 'font-weight'))
            .toBe('700');

        // And the grid cell at "1", "0" has style "font-size" with value "40px"
        await since(
            'After update text format color, The grid cell at "1", "0" should have font-size with value "40px", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 0, 'font-size'))
            .toBe('40px');
        // And the grid cell at "0", "1" has style "color" with value "rgba(2,143,148,1)"
        await since(
            'After update text format color, The grid cell at "0", "1" should have style "color" with value "rgba(2,143,148,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 1, 'color'))
            .toBe('rgba(2,143,148,1)');

        // And the grid cell at "0", "1" has style "background-color" with value "rgba(235,235,235,1)"
        await since(
            'After update text format color, The grid cell at "0", "1" should have style "background-color" with value "rgba(235,235,235,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 1, 'background-color'))
            .toBe('rgba(235,235,235,1)');

        // And the grid cell at "0", "1" has style "font-style" with value "italic"
        await since(
            'After update text format color, The grid cell at "0", "1" should have style "font-style" with value "italic", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 1, 'font-style'))
            .toBe('italic');

        // And the grid cell at "0", "1" has style "font-weight" with value "700"
        await since(
            'After update text format color, The grid cell at "0", "1" should have style "font-weight" with value "700", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 1, 'font-weight'))
            .toBe('700');

        // And the grid cell at "0", "1" has style "font-size" with value "40px"
        await since(
            'After update text format color, The grid cell at "0", "1" should have style "font-size" with value "40px", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 1, 'font-size'))
            .toBe('40px');

        // And the grid cell at "0", "1" has style "color" with value "rgba(2,143,148,1)"
        await since(
            'After update text format color, The grid cell at "0", "1" should have style "color" with value "rgba(2,143,148,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 1, 'color'))
            .toBe('rgba(2,143,148,1)');
        // And the grid cell at "1", "1" has style "background-color" with value "rgba(255,255,255,1)"
        await since(
            'After update text format color, The grid cell at "1", "1" should have style "background-color" with value "rgba(255,255,255,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 1, 'background-color'))
            .toBe('rgba(255,255,255,1)');

        // And the grid cell at "1", "1" has style "font-style" with value "italic"
        await since(
            'After update text format color, The grid cell at "1", "1" should have style "font-style" with value "italic", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 1, 'font-style'))
            .toBe('italic');

        // And the grid cell at "1", "1" has style "font-weight" with value "700"
        await since(
            'After update text format color, The grid cell at "1", "1" should have style "font-weight" with value "700", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 1, 'font-weight'))
            .toBe('700');

        // And the grid cell at "1", "1" has style "font-size" with value "40px"
        await since(
            'After update text format color, The grid cell at "1", "1" should have style "font-size" with value "40px", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 1, 'font-size'))
            .toBe('40px');
        // And the grid cell at "0", "1" has style "color" with value "rgba(2,143,148,1)"
        await since(
            'After update text format color, The grid cell at "0", "1" should have style "color" with value "rgba(2,143,148,1)"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 1, 'color'))
            .toBe('rgba(2,143,148,1)');

        // When I select the grid segment "Cost" "Values" from the pull down list in Report Editor
        await reportFormatPanel.selectGridSegment('Cost', 'Values');

        // And I click on "bold" text format button
        await reportFormatPanel.clickTextFormatButton('bold');

        // And I click on "italic" text format button
        await reportFormatPanel.clickTextFormatButton('italic');

        // And I change the font size to "30" by typing in the font size input field
        await newFormatPanelForGrid.setTextFontSize('30');

        // And I click on "bold" text format button
        await reportFormatPanel.clickTextFormatButton('bold');

        // And I select the grid segment "Cost" "Headers" from the pull down list in Report Editor
        await reportFormatPanel.selectGridSegment('Cost', 'Headers');

        // And I change the font size to "1" by typing in the font size input field
        await newFormatPanelForGrid.setTextFontSize('1');

        // And I select the grid segment "Year" "Headers" from the pull down list in Report Editor
        await newFormatPanelForGrid.selectGridSegment('Year', 'Headers');

        // And I change the font size to "66" by typing in the font size input field
        await newFormatPanelForGrid.setTextFontSize('66');
        // And I click on "bold" text format button
        await reportFormatPanel.clickTextFormatButton('bold');

        // And I select the grid segment "Year" "Values" from the pull down list in Report Editor
        await reportFormatPanel.selectGridSegment('Year', 'Values');

        // And I open the font color picker
        await newFormatPanelForGrid.clickFontColorBtn();

        // And I select the built-in color "#AADED7" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#AADED7');

        // And I click to close the color picker
        await baseFormatPanelReact.dismissColorPicker();

        // Then the grid cell at "0", "0" has style "background-color" with value "rgba(235,235,235,1)"
        await since(
            'After update text format color2, The grid cell at "0", "0" should have background-color with value "rgba(235,235,235,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'background-color'))
            .toBe('rgba(235,235,235,1)');

        // And the grid cell at "0", "0" has style "font-style" with value "italic"
        await since(
            'After update text format color2, The grid cell at "0", "0" should have font-style with value "italic", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'font-style'))
            .toBe('italic');

        // And the grid cell at "0", "0" has style "font-weight" with value "400"
        await since(
            'After update text format color2, The grid cell at "0", "0" should have font-weight with value "400", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'font-weight'))
            .toBe('400');

        // And the grid cell at "0", "0" has style "font-size" with value "88px"
        await since(
            'After update text format color2, The grid cell at "0", "0" should have font-size with value "88px", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'font-size'))
            .toBe('88px');

        // And the grid cell at "0", "0" has style "color" with value "rgba(2,143,148,1)"
        await since(
            'After update text format color2, The grid cell at "0", "0" should have color with value "rgba(2,143,148,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'color'))
            .toBe('rgba(2,143,148,1)');
        // And the grid cell at "0", "1" has style "background-color" with value "rgba(235,235,235,1)"
        await since(
            'After update text format color2, The grid cell at "0", "1" should have background-color with value "rgba(235,235,235,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 1, 'background-color'))
            .toBe('rgba(235,235,235,1)');

        // And the grid cell at "0", "1" has style "font-style" with value "italic"
        await since(
            'After update text format color2, The grid cell at "0", "1" should have font-style with value "italic", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 1, 'font-style'))
            .toBe('italic');

        // And the grid cell at "0", "1" has style "font-weight" with value "700"
        await since(
            'After update text format color2, The grid cell at "0", "1" should have font-weight with value "700", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 1, 'font-weight'))
            .toBe('700');

        // And the grid cell at "0", "1" has style "font-size" with value "1.33px"
        await since(
            'After update text format color2, The grid cell at "0", "1" should have font-size with value "1.33px", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 1, 'font-size'))
            .toBe('1.33px');

        // And the grid cell at "0", "1" has style "color" with value "rgba(2,143,148,1)"
        await since(
            'After update text format color2, The grid cell at "0", "1" should have color with value "rgba(2,143,148,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 1, 'color'))
            .toBe('rgba(2,143,148,1)');

        // And the grid cell at "1", "0" has style "background-color" with value "rgba(255,255,255,1)"
        await since(
            'After update text format color2, The grid cell at "1", "0" should have background-color with value "rgba(255,255,255,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 0, 'background-color'))
            .toBe('rgba(255,255,255,1)');

        // And the grid cell at "1", "0" has style "font-style" with value "italic"
        await since(
            'After update text format color2, The grid cell at "1", "0" should have font-style with value "italic", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 0, 'font-style'))
            .toBe('italic');

        // And the grid cell at "1", "0" has style "font-weight" with value "700"
        await since(
            'After update text format color2, The grid cell at "1", "0" should have font-weight with value "700", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 0, 'font-weight'))
            .toBe('700');

        // And the grid cell at "1", "0" has style "font-size" with value "40px"
        await since(
            'After update text format color2, The grid cell at "1", "0" should have font-size with value "40px", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 0, 'font-size'))
            .toBe('40px');

        // And the grid cell at "1", "0" has style "color" with value "rgba(170,222,215,1)"
        await since(
            'After update text format color2, The grid cell at "1", "0" should have color with value "rgba(170,222,215,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 0, 'color'))
            .toBe('rgba(170,222,215,1)');
        // And the grid cell at "1", "1" has style "background-color" with value "rgba(255,255,255,1)"
        await since(
            'After update text format color2, The grid cell at "1", "1" should have background-color with value "rgba(255,255,255,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 1, 'background-color'))
            .toBe('rgba(255,255,255,1)');

        // And the grid cell at "1", "1" has style "font-style" with value "normal"
        await since(
            'After update text format color2, The grid cell at "1", "1" should have font-style with value "normal", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 1, 'font-style'))
            .toBe('normal');

        // And the grid cell at "1", "1" has style "font-weight" with value "700"
        await since(
            'After update text format color2, The grid cell at "1", "1" should have font-weight with value "700", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 1, 'font-weight'))
            .toBe('700');

        // And the grid cell at "1", "1" has style "font-size" with value "40px"
        await since(
            'After update text format color2, The grid cell at "1", "1" should have font-size with value "40px", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 1, 'font-size'))
            .toBe('40px');

        // And the grid cell at "1", "1" has style "color" with value "rgba(2,143,148,1)"
        await since(
            'After update text format color2, The grid cell at "1", "1" should have color with value "rgba(2,143,148,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 1, 'color'))
            .toBe('rgba(2,143,148,1)');
    });
});
