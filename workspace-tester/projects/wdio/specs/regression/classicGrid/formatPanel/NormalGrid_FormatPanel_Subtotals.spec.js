import * as gridConstants from '../../../../constants/grid.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { browserWindow } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';

describe('Grid Format Panel', () => {
    let { loginPage, libraryPage, baseFormatPanel, newFormatPanelForGrid, gridAuthoring, formatPanelForGridTitleCRV } =
        browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridTestUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.handleError();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC41277_05] Format panel subtotals', async () => {
        // When I open dossier by its ID "C55814F011E9F69603ED0080EF755ABB"
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.AutomationTest.id,
            projectId: gridConstants.AutomationTest.project.id,
        });

        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();

        // And I switch to Text format tab in Format Panel
        await newFormatPanelForGrid.switchToTextFormatTab();

        // And I select the grid segment "Subtotal Row Headers" from the pull down list
        await newFormatPanelForGrid.selectGridSegment('Subtotal Row Headers');

        // Then subtotal Same As checkbox is not checked
        await since('Subtotal Same As Row checkbox checked should be #{expected} instead we have #{actual}')
            .expect(await formatPanelForGridTitleCRV.isSubtotalSameAsCheckboxChecked())
            .toBe(false);

        // When I change the font to "Monoton" from the font pull down list
        await newFormatPanelForGrid.selectTextFont('Monoton');

        // Then the grid cell in visualization "Visualization 1" at "2", "1" has style "font-family" with value "Monoton"
        await since('Grid cell font-family should be #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(2, 1, 'Visualization 1'),
                    'font-family'
                )
            )
            .toBe('monoton');

        // When I select bold for the font style
        await newFormatPanelForGrid.selectFontStyle('bold');

        // Then the grid cell in visualization "Visualization 1" at "2", "1" has style "font-weight" with value "400"
        await since('Grid cell font-weight should be #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(2, 1, 'Visualization 1'),
                    'font-weight'
                )
            )
            .toBe(400);

        // When I select italic for the font style
        await newFormatPanelForGrid.selectFontStyle('italic');

        // Then the grid cell in visualization "Visualization 1" at "2", "1" has style "font-style" with value "italic"
        await since(
            'Grid cell in visualization "Visualization 1" at "2", "1" should have font-style with value #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(2, 1, 'Visualization 1'),
                    'font-style'
                )
            )
            .toBe('italic');

        // When I select underline for the font style
        await newFormatPanelForGrid.selectFontStyle('underline');

        // Then the grid cell in visualization "Visualization 1" at "2", "1" has style "text-decoration" with value "underline"
        await since(
            'Grid cell in visualization "Visualization 1" at "2", "1" should have text-decoration with value #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(2, 1, 'Visualization 1'),
                    'text-decoration-line'
                )
            )
            .toBe('underline');

        // When I select strikethrough for the font style
        await newFormatPanelForGrid.selectFontStyle('underscore');

        // Then the grid cell in visualization "Visualization 1" at "2", "1" has style "text-decoration" with value "line-through"
        await since(
            'Grid cell in visualization "Visualization 1" at "2", "1" should have text-decoration with value #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(2, 1, 'Visualization 1'),
                    'text-decoration-line'
                )
            )
            .toBe('underline line-through');

        // When I change the font size to "28" by typing in the font size input field
        await newFormatPanelForGrid.setTextFontSize('28');

        // Then the grid cell in visualization "Visualization 1" at "2", "1" has style "font-size" with value "37.3333px"
        await since(
            'Grid cell in visualization "Visualization 1" at "2", "1" should have font-size with value #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(2, 1, 'Visualization 1'),
                    'font-size'
                )
            )
            .toBe('37.3333px');

        // When I change the font size to "12" by typing in the font size input field
        await newFormatPanelForGrid.setTextFontSize('12');

        // Then the grid cell in visualization "Visualization 1" at "2", "1" has style "font-size" with value "16px"
        await since(
            'Grid cell in visualization "Visualization 1" at "2", "1" should have font-size with value #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(2, 1, 'Visualization 1'),
                    'font-size'
                )
            )
            .toBe('16px');

        // When I open the font color picker
        await newFormatPanelForGrid.clickFontColorBtn();

        // And I switch the color picker to swatch mode
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');

        // And I select the built-in color "#DDCAFF" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#DDCAFF');

        // And I close the font color picker
        await newFormatPanelForGrid.clickFontColorBtn();

        // Then the grid cell in visualization "Visualization 1" at "2", "1" has style "color" with value "rgba(221, 202, 255, 1)"
        await since('Grid cell color should be #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(2, 1, 'Visualization 1'),
                    'color'
                )
            )
            .toBe('rgba(221,202,255,1)');

        // When I set the text alignment to "center"
        await newFormatPanelForGrid.selectFontAlign('center');

        // Then the grid cell in visualization "Visualization 1" at "2", "1" has style "text-align" with value "center"
        await since('Grid cell text-align should be #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(2, 1, 'Visualization 1'),
                    'text-align'
                )
            )
            .toBe('center');

        // When I set the text alignment to "right"
        await newFormatPanelForGrid.selectFontAlign('right');

        // Then the grid cell in visualization "Visualization 1" at "2", "1" has style "text-align" with value "right"
        await since('Grid cell text-align should be #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(2, 1, 'Visualization 1'),
                    'text-align'
                )
            )
            .toBe('right');

        // When I set the text alignment to "justify"
        await newFormatPanelForGrid.selectFontAlign('justify');
        // Then the grid cell in visualization "Visualization 1" at "2", "1" has style "text-align" with value "justify"
        await since(
            'Grid cell in visualization "Visualization 1" at "2", "1" should have text-align #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(2, 1, 'Visualization 1'),
                    'text-align'
                )
            )
            .toBe('justify');

        // When I set the text alignment to "left"
        await newFormatPanelForGrid.selectFontAlign('left');

        // Then the grid cell in visualization "Visualization 1" at "2", "1" has style "text-align" with value "left"
        await since(
            'Grid cell in visualization "Visualization 1" at "2", "1" should have text-align #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(2, 1, 'Visualization 1'),
                    'text-align'
                )
            )
            .toBe('left');

        // When I set the text vertical alignment to "top"
        await newFormatPanelForGrid.selectVerticalAlign('top');

        // Then the grid cell in visualization "Visualization 1" at "2", "1" has style "vertical-align" with value "top"
        await since(
            'Grid cell in visualization "Visualization 1" at "2", "1" should have vertical-align #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(2, 1, 'Visualization 1'),
                    'vertical-align'
                )
            )
            .toBe('top');

        // When I set the text vertical alignment to "middle"
        await newFormatPanelForGrid.selectVerticalAlign('middle');

        // Then the grid cell in visualization "Visualization 1" at "2", "1" has style "vertical-align" with value "middle"
        await since(
            'Grid cell in visualization "Visualization 1" at "2", "1" should have vertical-align #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(2, 1, 'Visualization 1'),
                    'vertical-align'
                )
            )
            .toBe('middle');

        // When I set the text vertical alignment to "bottom"
        await newFormatPanelForGrid.selectVerticalAlign('bottom');

        // Then the grid cell in visualization "Visualization 1" at "2", "1" has style "vertical-align" with value "bottom"
        await since(
            'Grid cell in visualization "Visualization 1" at "2", "1" should have vertical-align #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(2, 1, 'Visualization 1'),
                    'vertical-align'
                )
            )
            .toBe('bottom');

        // When I open the cell fill color picker
        await newFormatPanelForGrid.clickCellFillColorBtn();
        // And I switch the color picker to swatch mode
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');

        // And I select the built-in color "#55BFC3" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#55BFC3');

        // And I close the cell fill color picker
        await newFormatPanelForGrid.clickCellFillColorBtn();

        // Then the grid cell in visualization "Visualization 1" at "2", "1" has style "background-color" with value "rgba(85, 191, 195, 1)"
        await since('Grid cell background-color should have #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(2, 1, 'Visualization 1'),
                    'background-color'
                )
            )
            .toBe('rgba(85,191,195,1)');

        // When I select the cell border orientation "Horizontal Lines" from the pull down list
        await newFormatPanelForGrid.selectCellBorderOrientation('Horizontal Lines');

        // And I open the grid cell border style pulldown list
        await newFormatPanelForGrid.openCellBorderStyleDropDown();

        // And I select cell border style "dash" from the pulldown
        await newFormatPanelForGrid.selectCellBorderStyle('dash');

        // Then the grid cell in visualization "Visualization 1" at "2", "1" has style "border-style" with value "dashed"
        await since('Grid cell border-style should have #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(2, 1, 'Visualization 1'),
                    'border-style'
                )
            )
            .toContain('none none dashed none');

        // And I open the grid cell border style pulldown list
        await newFormatPanelForGrid.openCellBorderStyleDropDown();

        // And I select cell border style "dot" from the pulldown
        await newFormatPanelForGrid.selectCellBorderStyle('dot');
        // Then the grid cell in visualization "Visualization 1" at "2", "1" has style "border-style" with value "dotted"
        await since(
            'Grid cell in visualization "Visualization 1" at "2", "1" should have border-style #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(2, 1, 'Visualization 1'),
                    'border-style'
                )
            )
            .toBe('none none dotted none');

        // And I open the grid cell border style pulldown list
        await newFormatPanelForGrid.openCellBorderStyleDropDown();

        // And I select cell border style "solid" from the pulldown
        await newFormatPanelForGrid.selectCellBorderStyle('solid');

        // Then the grid cell in visualization "Visualization 1" at "2", "1" has style "border-style" with value "solid"
        await since(
            'Grid cell in visualization "Visualization 1" at "2", "1" should have border-style #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(2, 1, 'Visualization 1'),
                    'border-style'
                )
            )
            .toBe('none none solid none');

        // And I open the grid cell border style pulldown list
        await newFormatPanelForGrid.openCellBorderStyleDropDown();

        // And I select cell border style "thick" from the pulldown
        await newFormatPanelForGrid.selectCellBorderStyle('thick');

        // Then the grid cell in visualization "Visualization 1" at "2", "1" has style "border-style" with value "solid"
        await since(
            'Grid cell in visualization "Visualization 1" at "2", "1" should have border-style #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(2, 1, 'Visualization 1'),
                    'border-style'
                )
            )
            .toBe('none none solid none');

        // When I open the grid cell border color picker
        await newFormatPanelForGrid.clickCellBorderColorBtn();

        // And I switch the color picker to swatch mode
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');

        // And I select the built-in color "#9D9FE0" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#9D9FE0');
        // And I close the grid cell border color picker
        await newFormatPanelForGrid.clickCellBorderColorBtn();

        // Then the grid cell in visualization "Visualization 1" at "2", "1" has style "border-color" with value "rgb(157, 159, 224)"
        await since('Grid cell border-color should have #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(2, 1, 'Visualization 1'),
                    'border-color'
                )
            )
            .toBe('rgba(235,235,235,1)rgba(235,235,235,1)rgba(157,159,224,1)rgba(235,235,235,1)');

        // When I click Wrap text check box
        await newFormatPanelForGrid.clickCheckBox('Wrap text');
        // And the grid cell in visualization "Visualization 1" at "2", "1" has style "white-space" with value "nowrap"
        await since('Grid cell white-space should have #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(2, 1, 'Visualization 1'),
                    'white-space'
                )
            )
            .toBe('normal');
    });
});
