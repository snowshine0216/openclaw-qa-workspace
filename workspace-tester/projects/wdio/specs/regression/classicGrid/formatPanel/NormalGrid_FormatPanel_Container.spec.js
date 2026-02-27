import * as gridConstants from '../../../../constants/grid.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { browserWindow } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { assertWithinTolerance } from '../../../../utils/assertionHelper.js';

describe('Grid Format Panel', () => {
    let { loginPage, libraryPage, baseFormatPanel, newFormatPanelForGrid, gridAuthoring, baseFormatPanelReact } =
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

    it('[TC41277_04] Format panel General Settings for Title and Container', async () => {
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.GridFontTest.id,
            projectId: gridConstants.GridFontTest.project.id,
        });

        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();

        // And I switch to Title and Container tab in Format Panel
        await newFormatPanelForGrid.switchToTitleContainerTab();
        // When I change the font to "Tinos" from the font pull down list
        await newFormatPanelForGrid.selectTextFont('Tinos');

        // Then the title bar in visualization "Visualization 1" has style "font-family" with value "Tinos"
        await since(
            'Title bar in visualization "Visualization 1" should have font-family #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getVisualizationTitleBarRoot('Visualization 1'),
                    'font-family'
                )
            )
            .toBe('tinos');

        await newFormatPanelForGrid.selectFontStyle('bold'); //default is bold

        // Then the title bar in visualization "Visualization 1" has style "font-weight" with value "700"
        await since(
            'Title bar in visualization "Visualization 1" should have font-weight #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getVisualizationTitleBarRoot('Visualization 1'),
                    'font-weight'
                )
            )
            .toBe(400);

        // When I select italic for the font style
        await newFormatPanelForGrid.selectFontStyle('italic');

        // Then the title bar in visualization "Visualization 1" has style "font-style" with value "italic"
        await since(
            'Title bar in visualization "Visualization 1" should have font-style #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getVisualizationTitleBarRoot('Visualization 1'),
                    'font-style'
                )
            )
            .toBe('italic');

        // When I select underline for the font style
        await newFormatPanelForGrid.selectFontStyle('underline');

        // Then the title bar in visualization "Visualization 1" has style "text-decoration" with value "underline"
        await since(
            'Title bar in visualization "Visualization 1" should have text-decoration #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getVisualizationTitleBarRoot('Visualization 1'),
                    'text-decoration-line'
                )
            )
            .toBe('underline');

        // When I select strikethrough for the font style
        await newFormatPanelForGrid.selectFontStyle('underscore');

        // Then the title bar in visualization "Visualization 1" has style "text-decoration" with value "line-through"
        await since(
            'Title bar in visualization "Visualization 1" should have text-decoration #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getVisualizationTitleBarRoot('Visualization 1'),
                    'text-decoration-line'
                )
            )
            .toBe('underline line-through');

        // When I change the font size to "28" by typing in the font size input field
        await newFormatPanelForGrid.setTextFontSize('28');

        // Then the title bar in visualization "Visualization 1" has style "font-size" with value "37.3333px"
        await since(
            'Title bar in visualization "Visualization 1" should have font-size #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getVisualizationTitleBarRoot('Visualization 1'),
                    'font-size'
                )
            )
            .toBe('37.3333px');

        // When I change the font size to "12" by typing in the font size input field
        await newFormatPanelForGrid.setTextFontSize('12');

        // Then the title bar in visualization "Visualization 1" has style "font-size" with value "12px"
        await since(
            'Title bar in visualization "Visualization 1" should have font-size #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getVisualizationTitleBarRoot('Visualization 1'),
                    'font-size'
                )
            )
            .toBe('16px'); // it's bold so actual font size is bigger than 12px

        // When I open the font color picker
        await newFormatPanelForGrid.clickFontColorBtn();

        // And I switch the color picker to swatch mode
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');

        // And I select the built-in color "#5C388C" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#5C388C');

        // And I click to close the color picker
        await baseFormatPanelReact.dismissColorPicker();

        // Then the title bar in visualization "Visualization 1" has style "color" with value "rgba(92, 56, 140, 1)"
        await since(
            'Title bar in visualization "Visualization 1" should have color #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getVisualizationTitleBarRoot('Visualization 1'),
                    'color'
                )
            )
            .toBe('rgba(92,56,140,1)');

        // When I set the text alignment to "left"
        await newFormatPanelForGrid.selectFontAlign('left');

        // Then the title bar in visualization "Visualization 1" has style "text-align" with value "left"
        await since(
            'Title bar in visualization "Visualization 1" should have text-align #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getVisualizationTitleBarRoot('Visualization 1'),
                    'text-align'
                )
            )
            .toBe('left');

        // When I set the text alignment to "center"
        await newFormatPanelForGrid.selectFontAlign('center');

        // Then the title bar in visualization "Visualization 1" has style "text-align" with value "center"
        await since(
            'Title bar in visualization "Visualization 1" should have text-align #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getVisualizationTitleBarRoot('Visualization 1'),
                    'text-align'
                )
            )
            .toBe('center');

        // When I set the text alignment to "right"
        await newFormatPanelForGrid.selectFontAlign('right');

        // Then the title bar in visualization "Visualization 1" has style "text-align" with value "right"
        await since(
            'Title bar in visualization "Visualization 1" should have text-align #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getVisualizationTitleBarRoot('Visualization 1'),
                    'text-align'
                )
            )
            .toBe('right');

        // When I open the title background color picker
        await newFormatPanelForGrid.clickTitleBackgroundColorBtn();

        // And I switch the color picker to swatch mode
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');

        // And I select the built-in color "#ABABAB" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#ABABAB');

        // And I close the title background color picker
        await newFormatPanelForGrid.clickTitleBackgroundColorBtn();
        await since(
            'Title bar in visualization "Visualization 1" should have background-color #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getVisualizationTitleBarRoot('Visualization 1'),
                    'background-color'
                )
            )
            .toBe('rgba(171,171,171,1)');

        // When I open the container fill color picker
        await newFormatPanelForGrid.clickContainerFillColorBtn();

        // And I switch the color picker to swatch mode
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');

        // And I select the built-in color "#C1292F" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#C1292F');

        // And I click to close the color picker
        await baseFormatPanelReact.dismissColorPicker();

        // Then the grid "Visualization 1" has style "background-color" with value "rgba(193, 41, 47, 1)"
        await since('Grid "Visualization 1" should have style "background-color" with value "rgba(193, 41, 47, 1)"')
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getGridContainer('Visualization 1'),
                    'background-color'
                )
            )
            .toBe('rgba(193,41,47,1)');

        // When I change container outer border to "1 point dashed" through new format panel
        await baseFormatPanelReact.changeContainerBorder('1 point dashed');

        // Then The container's outer border type should be "Dashed"
        await since("The container's outer border type should be #{expected} instead we have #{actual}")
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getGridContainer('Visualization 1'),
                    'border-style'
                )
            )
            .toBe('dashed');

        // When I change container outer border to "1 point dotted" through new format panel
        await baseFormatPanelReact.changeContainerBorder('1 point dotted');

        // Then The container's outer border type should be "Dotted"
        await since("The container's outer border type should be #{expected} instead we have #{actual}")
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getGridContainer('Visualization 1'),
                    'border-style'
                )
            )
            .toBe('dotted');

        // When I change container outer border to "1 point solid" through new format panel
        await baseFormatPanelReact.changeContainerBorder('1 point solid');

        // Then The container's outer border type should be "Thin"
        await since("The container's outer border type should be #{expected} instead we have #{actual}")
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getGridContainer('Visualization 1'),
                    'border-style'
                )
            )
            .toBe('solid');

        // When I change container outer border to "2 point solid" through new format panel
        await baseFormatPanelReact.changeContainerBorder('2 point solid');

        // Then The container's outer border type should be "Thick"
        const expectedBorderWidth = 2.5;
        const actualBorderWidth = await gridAuthoring.getCSSProperty(
            gridAuthoring.selectors.getGridContainer('Visualization 1'),
            'border-width'
        );
        await since("The container's outer border type difference should be #{expected} instead we have #{actual}")
            .expect(
                assertWithinTolerance({
                    actual: actualBorderWidth,
                    expected: expectedBorderWidth,
                })
            )
            .toBe(true);

        // When I open the container border color picker
        await newFormatPanelForGrid.clickContainerBorderColorBtn();

        // And I select the built-in color "#D76322" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#D76322');

        // And I click to close the color picker
        await baseFormatPanelReact.dismissColorPicker();

        // Then the grid "Visualization 1" has style "border-color" with value "rgb(215, 99, 34)"
        await since(
            'The grid "Visualization 1" should have border-color with value #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getGridContainer('Visualization 1'),
                    'border-color'
                )
            )
            .toBe('rgba(215,99,34,1)');

        // move toggling to last step as in CI the toggle doesn't show up in the format panel
        // When I toggle Title Bar
        await newFormatPanelForGrid.toggleTitleBar();

        // Then the title bar in visualization "Visualization 1" is hidden
        await since('Title bar in visualization "Visualization 1" should be #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getVisualizationTitleBarContainer('Visualization 1'),
                    'height'
                )
            )
            .toBe('0px');

        // When I toggle Title Bar
        await newFormatPanelForGrid.toggleTitleBar();

        // Then the title bar in visualization "Visualization 1" is visible
        await since('Title bar in visualization "Visualization 1" should be #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getVisualizationTitleBarRoot('Visualization 1'),
                    'display'
                )
            )
            .toBe('block');
    });
});
