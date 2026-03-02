import * as gridConstants from '../../../../constants/grid.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { browserWindow } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { assertWithinTolerance } from '../../../../utils/assertionHelper.js';

describe('Grid Format Panel', () => {
    let { loginPage, libraryPage, baseFormatPanel, newFormatPanelForGrid, gridAuthoring } = browsers.pageObj1;

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

    it('[TC41277_01] Format panel Grid Template Formatting', async () => {
        // When I open dossier by its ID "B5B6D9F611EA07077A040080EFC51258"
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.Formatting.id,
            projectId: gridConstants.Formatting.project.id,
        });

        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();

        // And I switch to Grid tab in Format Panel
        await newFormatPanelForGrid.switchToGridTab();

        // And I expand "Layout" section
        await newFormatPanelForGrid.expandLayoutSection();

        // And I click Enable Banding check box under Layout section
        await newFormatPanelForGrid.enableBanding();

        // Then the grid cell in visualization "Visualization 1" at "3", "2" has style "background-color" with value "rgba(249, 249, 249, 1)"
        await since(
            'Grid cell in visualization "Visualization 1" at "3", "2" should have background-color #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(3, 2, 'Visualization 1'),
                    'background-color'
                )
            )
            .toBe('rgba(249,249,249,1)');

        // And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.enableOutline();

        // Then the grid visualization "Visualization 1" has object "Month" with outline mode toggle
        await since('Grid visualization "Visualization 1" should have object "Month" with outline mode toggle')
            .expect(await gridAuthoring.validators.isOutlinePresentForGridObject('Month', 'Visualization 1'))
            .toBe(true);

        // When I expand "Template" section
        await newFormatPanelForGrid.expandTemplateSection();

        // And I click the grid template color "Blue" under Template section
        await newFormatPanelForGrid.selectGridTemplateColor('Blue');
        await since(
            'Grid cell in visualization "Visualization 1" at "1", "1" should have border-bottom-color with value #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(1, 1, 'Visualization 1'),
                    'border-bottom-color'
                )
            )
            .toBe('rgba(28,141,212,1)');

        // And I click the grid template color "Dark Blue" under Template section
        await newFormatPanelForGrid.selectGridTemplateColor('Dark Blue');

        // Then the grid cell in visualization "Visualization 1" at "1", "1" has style "border-bottom-color" with value "rgba(25, 59, 103, 1)"
        await since(
            'Grid cell in visualization "Visualization 1" at "1", "1" should have border-bottom-color with value #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(1, 1, 'Visualization 1'),
                    'border-bottom-color'
                )
            )
            .toBe('rgba(25,59,103,1)');

        // And I click the grid template color "Emerald" under Template section
        await newFormatPanelForGrid.selectGridTemplateColor('Emerald');

        // Then the grid cell in visualization "Visualization 1" at "1", "1" has style "border-bottom-color" with value "rgba(56, 174, 111, 1)"
        await since(
            'Grid cell in visualization "Visualization 1" at "1", "1" should have border-bottom-color with value #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(1, 1, 'Visualization 1'),
                    'border-bottom-color'
                )
            )
            .toBe('rgba(56,174,111,1)');

        // And I click the grid template color "Orange" under Template section
        await newFormatPanelForGrid.selectGridTemplateColor('Orange');

        // Then the grid cell in visualization "Visualization 1" at "1", "1" has style "border-bottom-color" with value "rgba(230, 153, 18, 1)"
        await since(
            'Grid cell in visualization "Visualization 1" at "1", "1" should have border-bottom-color with value #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(1, 1, 'Visualization 1'),
                    'border-bottom-color'
                )
            )
            .toBe('rgba(230,153,18,1)');

        // And I click the grid template color "Gray" under Template section
        await newFormatPanelForGrid.selectGridTemplateColor('Gray');

        // Then the grid cell in visualization "Visualization 1" at "1", "1" has style "border-bottom-color" with value "rgba(171, 171, 171, 1)"
        await since(
            'Grid cell in visualization "Visualization 1" at "1", "1" should have border-bottom-color with value #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(1, 1, 'Visualization 1'),
                    'border-bottom-color'
                )
            )
            .toBe('rgba(171,171,171,1)');

        // When I click the grid style "classic" under Template section
        await newFormatPanelForGrid.selectGridTemplateStyle('classic');
        // Then the grid cell in visualization "Visualization 1" at "1", "1" has style "background-color" with value "rgba(245, 245, 245, 1)"
        await since(
            'Grid cell at "1", "1" in "Visualization 1" should have background-color #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(1, 1, 'Visualization 1'),
                    'background-color'
                )
            )
            .toBe('rgba(245,245,245,1)');

        // And I click the grid style "flat" under Template section
        await newFormatPanelForGrid.selectGridTemplateStyle('flat');

        // Then the grid cell in visualization "Visualization 1" at "1", "1" has style "background-color" with value "rgba(255, 255, 255, 1)"
        await since(
            'Grid cell at "1", "1" in "Visualization 1" should have background-color #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(1, 1, 'Visualization 1'),
                    'background-color'
                )
            )
            .toBe('rgba(255,255,255,1)');
    });

    it('[TC41277_02] Format panel Text Formatting', async () => {
        // When I open dossier by its ID "7E8E705A124A3FE2D6BA5E8A03D02FCE"
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.GridFontTest.id,
            projectId: gridConstants.GridFontTest.project.id,
        });

        // And I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();

        // When I switch to Text format tab in Format Panel
        await newFormatPanelForGrid.switchToTextFormatTab();

        // And I change the font to "Oleo Script" from the font pull down list
        await newFormatPanelForGrid.selectTextFont('Oleo Script');

        // Then the grid cell in visualization "Visualization 1" at "1", "1" has style "font-family" with value "Oleo Script"
        await since(
            'Grid cell at "1", "1" in "Visualization 1" should have font-family #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(1, 1, 'Visualization 1'),
                    'font-family'
                )
            )
            .toBe('oleo script');

        // When I select bold for the font style
        await newFormatPanelForGrid.selectFontStyle('bold');

        // Then the grid cell in visualization "Visualization 1" at "1", "1" has style "font-weight" with value "700"
        await since(
            'Grid cell at "1", "1" in "Visualization 1" should have font-weight #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(1, 1, 'Visualization 1'),
                    'font-weight'
                )
            )
            .toBe(700);

        // When I select italic for the font style
        await newFormatPanelForGrid.selectFontStyle('italic');
        await since(
            'Grid cell in visualization "Visualization 1" at "1", "1" should have font-style #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(1, 1, 'Visualization 1'),
                    'font-style'
                )
            )
            .toBe('italic');

        // When I select underline for the font style
        await newFormatPanelForGrid.selectFontStyle('underline');

        // Then the grid cell in visualization "Visualization 1" at "1", "1" has style "text-decoration" with value "underline"
        await since(
            'Grid cell in visualization "Visualization 1" at "1", "1" should have text-decoration-line #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(1, 1, 'Visualization 1'),
                    'text-decoration-line'
                )
            )
            .toBe('underline');

        // When I select strikethrough for the font style
        await newFormatPanelForGrid.selectFontStyle('underscore');

        // Then the grid cell in visualization "Visualization 1" at "1", "1" has style "text-decoration" with value "line-through"
        await since(
            'Grid cell in visualization "Visualization 1" at "1", "1" should have text-decoration-line #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(1, 1, 'Visualization 1'),
                    'text-decoration-line'
                )
            )
            .toContain('line-through');

        // When I change the font size to "12" by typing in the font size input field
        await newFormatPanelForGrid.setTextFontSize('12');

        // Then the grid cell in visualization "Visualization 1" at "1", "1" has style "font-size" with value "16px"
        await since(
            'Grid cell in visualization "Visualization 1" at "1", "1" should have font-size #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(1, 1, 'Visualization 1'),
                    'font-size'
                )
            )
            .toBe('16px');

        // When I open the font color picker
        await newFormatPanelForGrid.clickFontColorBtn();

        // And I switch the color picker to swatch mode
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');

        // And I select the built-in color "#AADED7" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#AADED7');

        // And I close the font color picker
        await newFormatPanelForGrid.clickFontColorBtn();

        await since(
            'Grid cell in visualization "Visualization 1" at "1", "1" should have color #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(1, 1, 'Visualization 1'),
                    'color'
                )
            )
            .toBe('rgba(170,222,215,1)');
        // skip this as input value is not working in automation. Value is set but not effective.
        // // When I open the font color picker
        // await newFormatPanelForGrid.clickFontColorBtn();

        // // And I switch the color picker to palette mode
        // await newFormatPanelForGrid.clickColorPickerModeBtn('palette');

        // // And I set the hex color "5dcc49" in the color picker palette mode
        // await newFormatPanelForGrid.setColorPaletteRGB(93, 204, 73);

        // // Then the grid cell in visualization "Visualization 1" at "1", "1" has style "color" with value "rgba(93, 204, 73, 1)"
        // await since(
        //     'Grid cell in visualization "Visualization 1" at "1", "1" should have color #{expected} instead we have #{actual}'
        // )
        //     .expect(
        //         await gridAuthoring.getCSSProperty(
        //             gridAuthoring.getGridCellByPosition(1, 1, 'Visualization 1'),
        //             'color'
        //         )
        //     )
        //     .toBe('rgba(93,204,73,1)');
    });

    it('[TC41277_03] Format panel Spacing', async () => {
        await browser.setWindowSize(1600, 800);
        const newSize = await browser.getWindowSize();
        console.log(newSize);
        // When I open dossier by its ID "7E8E705A124A3FE2D6BA5E8A03D02FCE"
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.GridFontTest.id,
            projectId: gridConstants.GridFontTest.project.id,
        });

        // And I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();

        // When I switch to Grid tab in Format Panel
        await newFormatPanelForGrid.switchToGridTab();

        // And I expand "Spacing" section
        await newFormatPanelForGrid.expandSpacingSection();

        // And I select "small" cell padding under Spacing section
        await newFormatPanelForGrid.selectCellPadding('small');

        // Then the grid cell in visualization "Visualization 1" at "1", "1" has style "color" with value "rgba(170, 222, 215, 1)"
        await since(
            'Grid cell in visualization "Visualization 1" at "1", "1" should have color #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(1, 1, 'Visualization 1'),
                    'color'
                )
            )
            .toBe('rgba(68,70,73,1)');
        // Then the grid cell in visualization "Visualization 1" at "1", "1" has style "padding" with value "3.06667px 6px"
        await since(
            'Grid cell in visualization "Visualization 1" at "1", "1" should have padding #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(1, 1, 'Visualization 1'),
                    'padding'
                )
            )
            .toBe('3.33333px 6.66667px');

        // And I select "medium" cell padding under Spacing section
        await newFormatPanelForGrid.selectCellPadding('medium');

        await since(
            'Grid cell in visualization "Visualization 1" at "1", "1" should have padding #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(1, 1, 'Visualization 1'),
                    'padding'
                )
            )
            .toBe('6.66667px 13.3333px');

        // And I select "large" cell padding under Spacing section
        await newFormatPanelForGrid.selectCellPadding('large');

        // Then the grid cell in visualization "Visualization 1" at "1", "1" has style "padding" with value "8px 16px"
        await since(
            'Grid cell in visualization "Visualization 1" at "1", "1" should have padding #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(1, 1, 'Visualization 1'),
                    'padding'
                )
            )
            .toBe('10px 20px');

        // When I change grid column size fit to "Fit to Content" under Spacing section
        await newFormatPanelForGrid.clickColumnSizeFitOption('Fit to Content', false);

        const expectedWidth = 23.5;
        const actualWidth = await gridAuthoring.getCSSProperty(
            gridAuthoring.getGridCellByPosition(3, 1, 'Visualization 1'),
            'width'
        );
        // Then the grid cell in visualization "Visualization 1" at "3", "1" has style "width" with value "292.922px"
        await since(
            `Grid cell in visualization "Visualization 1" at "3", "1" should have width ${expectedWidth} instead we have ${actualWidth}`
        )
            .expect(
                assertWithinTolerance({
                    actual: actualWidth,
                    expected: expectedWidth,
                })
            )
            .toBe(true);
        // When I change grid column size fit to "Fixed" under Spacing section
        await newFormatPanelForGrid.clickColumnSizeFitOption('Fixed', false);

        // And I change grid column size target to "All columns" under Spacing section
        await newFormatPanelForGrid.clickColumnSizeTargetBtn();
        await newFormatPanelForGrid.clickColumnSizeTargetOption('All columns');

        // And I change grid column size fixed inches to "1.79" under Spacing section
        await newFormatPanelForGrid.setColumnSizeFixedInches('1.79');
        // Then the grid cell in visualization "Visualization 1" at "3", "1" has style "width" with value "312px"
        await since(
            'Grid cell in visualization "Visualization 1" at "3", "1" should have width #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(3, 1, 'Visualization 1'),
                    'width'
                )
            )
            .toBe('131px');

        // When I change grid column size fit to "Fit to Container" under Spacing section
        await newFormatPanelForGrid.clickColumnSizeFitOption('Fit to Container', false);
        const expectedWidth2 = 419.344;
        const actualWidth2 = await gridAuthoring.getCSSProperty(
            gridAuthoring.getGridCellByPosition(3, 1, 'Visualization 1'),
            'width'
        );

        // Then the grid cell in visualization "Visualization 1" at "3", "1" has style "width" with value "499.414px"
        await since(
            `Grid cell in visualization "Visualization 1" at "3", "1" should have width ${expectedWidth2} instead we have ${actualWidth2}`
        )
            .expect(
                assertWithinTolerance({
                    actual: actualWidth2,
                    expected: expectedWidth2,
                })
            )
            .toBe(true);

        // When I change grid row size fit to "Fixed" under Spacing section
        await newFormatPanelForGrid.clickRowSizeBtn(false);
        await newFormatPanelForGrid.clickRowSizeFitOption('Fixed');

        // And I change grid row size fixed inches to "0.52" under Spacing section
        await newFormatPanelForGrid.setRowSizeFixedInches('0.52');

        // Then the grid cell in visualization "Visualization 1" at "3", "1" has style "height" with value "33px"
        const expectedHeight = 29;
        const actualHeight = await gridAuthoring.getCSSProperty(
            gridAuthoring.getGridCellByPosition(3, 1, 'Visualization 1'),
            'height'
        );
        await since(
            `Grid cell in visualization "Visualization 1" at "3", "1" should have height ${expectedHeight} instead we have ${actualHeight}`
        )
            .expect(
                assertWithinTolerance({
                    actual: actualHeight,
                    expected: expectedHeight,
                })
            )
            .toBe(true);

        // When I change grid row size fit to "Fit to Content" under Spacing section
        await newFormatPanelForGrid.clickRowSizeBtn(false);
        await newFormatPanelForGrid.clickRowSizeFitOption('Fit to Content');

        const expectedHeight2 = 10.6641;
        const actualHeight2 = await gridAuthoring.getCSSProperty(
            gridAuthoring.getGridCellByPosition(3, 1, 'Visualization 1'),
            'height'
        );

        // Then the grid cell in visualization "Visualization 1" at "3", "1" has style "height" with value "20.7969px"
        await since(
            `Grid cell in visualization "Visualization 1" at "3", "1" should have height ${expectedHeight2} instead we have ${actualHeight2}`
        )
            .expect(
                assertWithinTolerance({
                    actual: actualHeight2,
                    expected: expectedHeight2,
                })
            )
            .toBe(true);
    });
});
