import setWindowSize from '../../../config/setWindowSize.js';
import { AGGridFormatPanel, gridUser, AGGrid_FitToContent, AGGrid_ColumnMissing } from '../../../constants/grid.js';
import { loadingDialog } from '../../../pageObjects/dossierEditor/components/LoadingDialog.js';
import { expectResult } from '../../../utils/ExpectUtils.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';

describe('AG Grid - Format panel for AG Grid', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const {
        loginPage,
        libraryPage,
        dossierPage,
        toc,
        contentsPanel,
        reportGridView,
        vizPanelForGrid,
        agGridVisualization,
        baseFormatPanel,
        baseFormatPanelReact,
        newFormatPanelForGrid,
        gridAuthoring,
        reportFormatPanel,
        datasetsPanel,
        editorPanelForGrid,
        microchartConfigDialog,
        textField,
        ngmEditorPanel,
        dossierAuthoringPage,
        reset,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {});

    it('[TC71086_1] Format panel (fill color) Column Headers', async () => {
        //    # Ensure we're on Column Headers in the Format panel
        //     # step 1 - initial grid with 2A in rows and 2 Col Sets (Sample_2A2CS)
        //     When I open dossier by its ID "5EA753573E43EA1595A697BF34A5033F"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Format Panel> Sample_2A2CS
        await libraryPage.editDossierByUrl({
            projectId: AGGridFormatPanel.project.id,
            dossierId: AGGridFormatPanel.id,
        });
        //     Then The Dossier Editor is displayed
        //     When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        //     And I switch to the "Text and Form" section on new format panel
        await baseFormatPanelReact.switchSection('Text and Form');
        //     Then The segment control dropdown should be "Entire Grid" in new format panel
        await since('Segment control dropdown should be Entire Grid')
            .expect(await baseFormatPanelReact.getSegmentControlDropDownByCurrentSelection('Entire Grid'))
            .toBeTruthy();
        //     And the cells fill color is "rgba(255, 255, 255, 1)" in the new format panel
        await since('The cells fill color is "rgba(255,255,255,1)" in the new format panel,while we get #{actual}')
            .expect((await newFormatPanelForGrid.fillColor.getCSSProperty('background-color')).value)
            .toContain('rgba(255,255,255,1)');
        //     When I change the segment dropdown from "Entire Grid" to "Column Headers" through the new format panel
        await baseFormatPanelReact.changeSegmentControl('Entire Grid', 'Column Headers');
        //     Then The segment control dropdown should be "Column Headers" in new format panel
        await since('Segment control dropdown should be Column Headers')
            .expect(await baseFormatPanelReact.getSegmentControlDropDownByCurrentSelection('Column Headers'))
            .toBeTruthy();
        //     When I change cell fill color to "#FAD47F" through new format panel
        await newFormatPanelForGrid.changeCellsFillColor('#FAD47F');
        await newFormatPanelForGrid.click({ elem: newFormatPanelForGrid.cellFillColorBtn });
        // pause 3 s
        await browser.pause(3000);
        //     Then the cells fill color is "rgba(250, 212, 127, 1)" in the new format panel
        await since('The cells fill color is "rgba(250, 212, 127, 1)" in the new format panel, while we get #{actual}')
            .expect((await newFormatPanelForGrid.fillColor.getCSSProperty('background-color')).value)
            .toContain('rgba(250,212,127,1)');
        //     # rows
        //     And the header cell "Airline Name" in ag-grid "Visualization 1" has style "background-color" with value "rgba(250, 212, 127, 1)"
        //     And the grid cell in ag-grid "Visualization 1" at "2", "0" has style "background-color" with value "rgba(255, 255, 255, 1)"
        //     # col set 1
        //     And the header cell "2009" in ag-grid "Visualization 1" has style "background-color" with value "rgba(250, 212, 127, 1)"
        //     And the header cell "Avg Delay (min)" in ag-grid "Visualization 1" has style "background-color" with value "rgba(250, 212, 127, 1)"
        //     And the grid cell in ag-grid "Visualization 1" at "2", "2" has style "background-color" with value "rgba(255, 255, 255, 1)"
        //     #col set 2
        //     And the header cell "Flights Delayed" in ag-grid "Visualization 1" has style "background-color" with value "rgba(250, 212, 127, 1)"
        //     And the header cell "Number of Flights" in ag-grid "Visualization 1" has style "background-color" with value "rgba(250, 212, 127, 1)"
        //     And the grid cell in ag-grid "Visualization 1" at "2", "5" has style "background-color" with value "rgba(255, 255, 255, 1)"
        // take screenshot to check the format in the grid
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Fill color rgba(250, 212, 127, 1) on column headers',
            'TC71086_1_1'
        );

        //     # test individual column sets
        //     When I change the segment dropdown from "All Sets" to "Column Set 1" through the new format panel
        await baseFormatPanelReact.changeSegmentControl('Column Headers', 'Column Set 1');
        await baseFormatPanelReact.changeSegmentControl('All', 'Headers');
        //     Then The segment control dropdown should be "Column Set 1" in new format panel
        await since('Segment control dropdown should be Column Set 1')
            .expect(await baseFormatPanelReact.getSegmentControlDropDownByCurrentSelection('Column Set 1'))
            .toBeTruthy();
        //     # color should be kept
        //     And the cells fill color is "rgba(250, 212, 127, 1)" in the new format panel
        await since('The cells fill color is "rgba(250, 212, 127, 1)" in the new format panel, while we get #{actual}')
            .expect((await newFormatPanelForGrid.fillColor.getCSSProperty('background-color')).value)
            .toContain('rgba(250,212,127,1)');
        //     When I change cell fill color to "#C1292F" through new format panel
        await newFormatPanelForGrid.changeCellsFillColor('#C1292F');
        // pause 3 s
        await browser.pause(3000);
        //     Then the cells fill color is "rgba(193, 41, 47, 1)" in the new format panel
        await since('The cells fill color is "rgba(193, 41, 47, 1)" in the new format panel')
            .expect((await newFormatPanelForGrid.fillColor.getCSSProperty('background-color')).value)
            .toContain('rgba(193,41,47,1)');
        //     # rows - part of cs 1, header will change
        //     And the header cell "Airline Name" in ag-grid "Visualization 1" has style "background-color" with value "rgba(193, 41, 47, 1)"
        //     And the grid cell in ag-grid "Visualization 1" at "2", "0" has style "background-color" with value "rgba(255, 255, 255, 1)"
        //     # col set 1
        //     And the header cell "2009" in ag-grid "Visualization 1" has style "background-color" with value "rgba(193, 41, 47, 1)"
        //     And the header cell "Avg Delay (
        //     # rows - part of cs 1, header will change
        //     And the header cell "Airline Name" in ag-grid "Visualization 1" has style "background-color" with value "rgba(193, 41, 47, 1)"
        //     And the grid cell in ag-grid "Visualization 1" at "2", "0" has style "background-color" with value "rgba(255, 255, 255, 1)"
        //     # col set 1
        //     And the header cell "2009" in ag-grid "Visualization 1" has style "background-color" with value "rgba(193, 41, 47, 1)"
        //     And the header cell "Avg Delay (min)" in ag-grid "Visualization 1" has style "background-color" with value "rgba(193, 41, 47, 1)"
        //     And the grid cell in ag-grid "Visualization 1" at "2", "2" has style "background-color" with value "rgba(255, 255, 255, 1)"
        //     # col set 2 - should stay the same
        //     And the header cell "Flights Delayed" in ag-grid "Visualization 1" has style "background-color" with value "rgba(250, 212, 127, 1)"
        //     And the header cell "Number of Flights" in ag-grid "Visualization 1" has style "background-color" with value "rgba(250, 212, 127, 1)"
        //     And the grid cell in ag-grid "Visualization 1" at "2", "5" has style "background-color" with value "rgba(255, 255, 255, 1)"
        //     take screenshot to check the format in the grid
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Fill color rgba(193, 41, 47, 1) on column headers for Column Set 1',
            'TC71086_1_2'
        );

        //     # test column set 2
        //     When I change the segment dropdown from "Column Set 1" to "Column Set 2" through the new format panel
        await baseFormatPanelReact.changeSegmentControl('Column Set 1', 'Column Set 2');
        //     Then The segment control dropdown should be "Column Set 2" in new format panel
        await since('Segment control dropdown should be Column Set 2')
            .expect(await baseFormatPanelReact.getSegmentControlDropDownByCurrentSelection('Column Set 2'))
            .toBeTruthy();
        //     # color should be kept from first change
        //     And the cells fill color is "rgba(250, 212, 127, 1)" in the new format panel
        await since('The cells fill color is "rgba(250, 212, 127, 1)" in the new format panel, while we get #{actual}')
            .expect((await newFormatPanelForGrid.fillColor.getCSSProperty('background-color')).value)
            .toContain('rgba(250,212,127,1)');
        //     When I change cell fill color to "#38AE6F" through new format panel
        await newFormatPanelForGrid.changeCellsFillColor('#38AE6F');
        // pause 3 s
        await browser.pause(3000);
        //     Then the cells fill color is "rgba(56, 174, 111, 1)" in the new format panel
        await since('The cells fill color is "rgba(56, 174, 111, 1)" in the new format panel')
            .expect((await newFormatPanelForGrid.fillColor.getCSSProperty('background-color')).value)
            .toContain('rgba(56,174,111,1)');
        //     # rows - will keep col set 2 color
        //     And the header cell "Airline Name" in ag-grid "Visualization 1" has style "background-color" with value "rgba(250, 212, 127, 1)"
        //     And the grid cell in ag-grid "Visualization 1" at "2", "0" has style "background-color" with value "rgba(255, 255, 255, 1)"
        //     # rows - will keep col set 1 color
        //     And the header cell "Airline Name" in ag-grid "Visualization 1" has style "background-color" with value "rgba(193, 41, 47, 1)"
        //     And the grid cell in ag-grid "Visualization 1" at "2", "0" has style "background-color" with value "rgba(255, 255, 255, 1)"
        //     # col set 1 - unchanged
        //     And the header cell "2009" in ag-grid "Visualization 1" has style "background-color" with value "rgba(193, 41, 47, 1)"
        //     And the header cell "Avg Delay (min)" in ag-grid "Visualization 1" has style "background-color" with value "rgba(193, 41, 47, 1)"
        //     And the grid cell in ag-grid "Visualization 1" at "2", "2" has style "background-color" with value "rgba(255, 255, 255, 1)"
        //     # col set 2
        //     And the header cell "Flights Delayed" in ag-grid "Visualization 1" has style "background-color" with value "rgba(56, 174, 111, 1)"
        //     And the header cell "Number of Flights" in ag-grid "Visualization 1" has style "background-color" with value "rgba(56, 174, 111, 1)"
        //     And the grid cell in ag-grid "Visualization 1" at "2", "5" has style "background-color" with value "rgba(255, 255, 255, 1)"
        //     take screenshot to check the format in the grid
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Fill color rgba(56, 174, 111, 1) on column headers for Column Set 2',
            'TC71086_1_3'
        );

        //     # check Fill color component
        //     When I change the segment dropdown from "Column Set 2" to "All Sets" through the new format panel
        await baseFormatPanelReact.changeSegmentControl('Column Set 2', 'Column Headers');
        //     # color should be ?
        //     Then the cells fill color is "?" in the new format panel
        await since('The cells fill color is "250,212,127,1" in the new format panel, while we get #{actual}')
            .expect((await newFormatPanelForGrid.fillColor.getCSSProperty('background-color')).value)
            .toContain('250,212,127,1');
        //     When I change the segment dropdown from "Column Headers" to "Entire Grid" through the new format panel
        await baseFormatPanelReact.changeSegmentControl('Column Headers', 'Entire Grid');
        //     # color should be ?
        //     Then the cells fill color is "?" in the new format panel
        // take screenshot of fill color component
        const fillColor = await newFormatPanelForGrid.fillColor;
        await takeScreenshotByElement(fillColor!, 'Fill color component should be "?"', 'TC71086_1_4');
    });

    it('[TC71086_2] Sanity test for Ag Grid Format Panel_General Setting, Title and Container, Row Headers.', async () => {
        // When I open dossier by its ID "5EA753573E43EA1595A697BF34A5033F"
        // Then The Dossier Editor is displayed
        await libraryPage.editDossierByUrl({
            projectId: AGGridFormatPanel.project.id,
            dossierId: AGGridFormatPanel.id,
        });
        // # 1. General Settings -- Layout
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I expand "Layout" section
        await newFormatPanelForGrid.expandLayoutSection();
        // # Enable Banding
        // When I click Enable Banding check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable banding');
        // Then the grid cell in ag-grid "Visualization 1" at "5", "1" has style "background-color" with value "rgba(248, 248, 248, 1)"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "5", "1" has style "background-color" with value "rgba(248, 248, 248, 1)"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(5, 1, 'Visualization 1'),
                'background-color'
            )
        ).toContain('rgba(248,248,248,1)');
        // # Disable Banding
        // When I click Enable Banding check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable banding');
        // # Enable Outline
        // Then the grid cell in ag-grid "Visualization 1" at "2", "1" has text "January"
        await since('The grid cell in ag-grid "Visualization 1" at "2", "1" has text "January"')
            .expect(await agGridVisualization.getGridCellByPos(2, 1, 'Visualization 1').getText())
            .toContain('January');
        // When I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
        // Then the grid cell in ag-grid "Visualization 1" at "2", "1" has text "Total"
        await since('The grid cell in ag-grid "Visualization 1" at "2", "1" has text "Total"')
            .expect(await agGridVisualization.getGridCellByPos(2, 1, 'Visualization 1').getText())
            .toContain('Total');
        // * the grid cell in ag-grid "Visualization 1" at "3", "0" has text "AirTran Airways Corporation"
        await since('The grid cell in ag-grid "Visualization 1" at "3", "0" has text "AirTran Airways Corporation"')
            .expect(await agGridVisualization.getGridCellByPos(3, 0, 'Visualization 1').getText())
            .toContain('AirTran Airways Corporation');
        // * the grid cell in ag-grid "Visualization 1" at "3", "2" has text "68,257.42"
        await since('The grid cell in ag-grid "Visualization 1" at "3", "2" has text "68,257.42"')
            .expect(await agGridVisualization.getGridCellByPos(3, 2, 'Visualization 1').getText())
            .toContain('68,257.42');
        // # Disable Outline
        // When I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
        // # 2. General Settings -- Template Color and Style
        // And I expand "Template" section
        await newFormatPanelForGrid.expandTemplateSection();
        // When I click the grid template color "Emerald" under Template section
        await newFormatPanelForGrid.selectGridTemplateColor('Emerald');
        // Then the grid cell in ag-grid "Visualization 1" at "0", "0" has style "border-bottom-color" with value "rgba(56, 174, 111, 1)"
        await since(
            'Grid cell in visualization "Visualization 1" at "0", "0" should have border-bottom-color with value #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    agGridVisualization.getGridCellByPos(0, 0, 'Visualization 1'),
                    'border-bottom-color'
                )
            )
            .toBe('rgba(56,174,111,1)');
        // When I click the grid style "classic" under Template section
        await newFormatPanelForGrid.selectGridTemplateStyle('classic');
        // Then the grid cell in ag-grid "Visualization 1" at "0", "0" has style "background-color" with value "rgba(56, 174, 111, 1)"
        await expectResult(
            'Grid cell in visualization "Visualization 1" at "0", "0" should have background-color with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(0, 0, 'Visualization 1'),
                'background-color'
            )
        ).toBe('rgba(56,174,111,1)');
        // # 3. Text and Format
        // #All Grid Font
        // When I switch to Text format tab in Format Panel
        await newFormatPanelForGrid.switchToTextFormatTab();
        // # to make the tooltip disappear
        // And I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // # Entire grid
        // Then the cells fill color is "?" in the new format panel
        await expectResult(
            'BaseFormatPanel.switchToFormatPanelByClickingOnIcon',
            await newFormatPanelForGrid.fillColor.$('.question-mark').isDisplayed()
        ).toBe(true);
        // When I change the font to "Noto Sans" from the font pull down list
        await newFormatPanelForGrid.selectTextFont('Noto Sans');
        // # header - 0
        // Then the grid cell in ag-grid "Visualization 1" at "0", "0" has style "font-family" with value "Noto Sans"
        await expectResult(
            'Grid cell in visualization "Visualization 1" at "0", "0" should have font-family with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(0, 0, 'Visualization 1'),
                'font-family'
            )
        ).toBe('noto sans');
        // # value cell - 3
        // And the grid cell in ag-grid "Visualization 1" at "3", "0" has style "font-family" with value "Noto Sans"
        await expectResult(
            'Grid cell in visualization "Visualization 1" at "0", "0" should have font-family with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(3, 0, 'Visualization 1'),
                'font-family'
            )
        ).toBe('noto sans');
        // When I select bold for the font style
        await newFormatPanelForGrid.selectFontStyle('bold');
        // Then the grid cell in ag-grid "Visualization 1" at "0", "0" has style "font-weight" with value "700"
        await expectResult(
            'Grid cell in visualization "Visualization 1" at "0", "0" should have font-weight with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(0, 0, 'Visualization 1'),
                'font-weight'
            )
        ).toBe(700);
        // And the grid cell in ag-grid "Visualization 1" at "3", "0" has style "font-weight" with value "700"
        await expectResult(
            'Grid cell in visualization "Visualization 1" at "3", "0" should have font-weight with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(3, 0, 'Visualization 1'),
                'font-weight'
            )
        ).toBe(700);
        // When I select underline for the font style
        await newFormatPanelForGrid.selectFontStyle('underline');
        // Then the grid cell in ag-grid "Visualization 1" at "0", "0" has style "text-decoration" with value "underline"
        await expectResult(
            'Grid cell in visualization "Visualization 1" at "0", "0" should have text-decoration with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(0, 0, 'Visualization 1'),
                'text-decoration'
            )
        ).toContain('underline');
        // Then the grid cell in ag-grid "Visualization 1" at "3", "0" has style "text-decoration" with value "underline"
        await expectResult(
            'Grid cell in visualization "Visualization 1" at "3", "0" should have text-decoration with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(3, 0, 'Visualization 1'),
                'text-decoration'
            )
        ).toContain('underline');
        // When I change the font size to "12" by typing in the font size input field
        await newFormatPanelForGrid.setTextFontSize('12');
        // Then I pause execution for 3 seconds
        await browser.pause(3000);
        // Then the grid cell in ag-grid "Visualization 1" at "0", "0" has style "font-size" with value "16px"
        await expectResult(
            'Grid cell in visualization "Visualization 1" at "0", "0" should have font-size with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(0, 0, 'Visualization 1'),
                'font-size'
            )
        ).toBe('16px');
        // Then the grid cell in ag-grid "Visualization 1" at "3", "0" has style "font-size" with value "16px"
        await expectResult(
            'Grid cell in visualization "Visualization 1" at "3", "0" should have font-size with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(3, 0, 'Visualization 1'),
                'font-size'
            )
        ).toBe('16px');
        // When I open the font color picker
        await newFormatPanelForGrid.clickFontColorBtn();
        // And I select the built-in color "#DB6657" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#DB6657');
        // And I click to close the color picker
        await baseFormatPanelReact.dismissColorPicker();
        // Then the grid cell in ag-grid "Visualization 1" at "0", "0" has style "color" with value "rgba(219, 102, 87, 1)"
        await expectResult(
            'Grid cell in visualization "Visualization 1" at "0", "0" should have color with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(agGridVisualization.getGridCellByPos(0, 0, 'Visualization 1'), 'color')
        ).toBe('rgba(219,102,87,1)');
        // And the grid cell in ag-grid "Visualization 1" at "3", "0" has style "color" with value "rgba(219, 102, 87, 1)"
        await expectResult(
            'Grid cell in visualization "Visualization 1" at "3", "0" should have color with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(agGridVisualization.getGridCellByPos(3, 0, 'Visualization 1'), 'color')
        ).toBe('rgba(219,102,87,1)');

        // # 4. General Setting -- Spacing: Grid Size
        // When I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
        // And I collapse "Layout" section
        await newFormatPanelForGrid.clickSectionTitle('Layout');
        // And I expand "Spacing" section
        await newFormatPanelForGrid.clickSectionTitle('Spacing');
        // When I select "small" cell padding under Spacing section
        await newFormatPanelForGrid.selectCellPadding('small');
        // Then the grid cell in ag-grid "Visualization 1" at "3", "0" has style "padding" with value "3.06667px 6px"
        await expectResult(
            'Grid cell in visualization "Visualization 1" at "3", "0" should have color with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(agGridVisualization.getGridCellByPos(3, 0, 'Visualization 1'), 'padding')
        ).toBe('3px 6px');
        // When I select "large" cell padding under Spacing section
        await newFormatPanelForGrid.selectCellPadding('large');
        // Then the grid cell in ag-grid "Visualization 1" at "3", "0" has style "padding" with value "8px 16px"
        await expectResult(
            'Grid cell in visualization "Visualization 1" at "3", "0" should have padding with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(agGridVisualization.getGridCellByPos(3, 0, 'Visualization 1'), 'padding')
        ).toBe('8px 16px');
        // When I select "medium" cell padding under Spacing section
        await newFormatPanelForGrid.selectCellPadding('medium');
        // Then the grid cell in ag-grid "Visualization 1" at "3", "0" has style "padding" with value "6.93333px 14px"
        await expectResult(
            'Grid cell in visualization "Visualization 1" at "3", "0" should have padding with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(agGridVisualization.getGridCellByPos(3, 0, 'Visualization 1'), 'padding')
        ).toBe('7px 14px');
        // When I change ag-grid column size fit to "Fit to Content" under Spacing section
        await newFormatPanelForGrid.clickColumnSizeFitOption('Fit to Content');
        // Then the grid cell in ag-grid "Visualization 1" at "5", "2" has style "width" with value "160px"
        await expectResult(
            'Grid cell in visualization "Visualization 1" at "5", "2" should have width with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(agGridVisualization.getGridCellByPos(5, 2, 'Visualization 1'), 'width')
        ).toBe('138px');
        // # When I change grid column size fit to "Fixed" under Spacing section
        // # And I change grid column size target to "All columns" under Spacing section
        // # And I change grid column size fixed inches to "2.5" under Spacing section
        // # Then the grid cell in ag-grid "Visualization 1" at "5", "2" has style "width" with value "240px"
        // When I change ag-grid column size fit to "Fit to Container" under Spacing section
        await newFormatPanelForGrid.clickColumnSizeFitOption('Fit to Container');
        // Then I pause execution for 2 seconds
        await browser.pause(2000);
        // #Then the grid cell in ag-grid "Visualization 1" at "5", "2" has style "width" with value "182px"
        // # When I change ag-grid row size fit to "Fixed" under Spacing section
        // # And I change grid row size fixed inches to "0.5" under Spacing section
        // # Then the grid cell in ag-grid "Visualization 1" at "5", "2" has style "height" with value "48px"

        // # 5. Title and Container
        // When I switch to Title and Container tab in Format Panel
        await newFormatPanelForGrid.switchToTab('title-container');
        // # to make the tooltip disappear
        // And I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // #Show Title Bar
        // When I toggle Title Bar
        await newFormatPanelForGrid.toggleTitleBar();
        // Then the titlebar in visualization "Visualization 1" is hidden
        await expectResult(
            'Title bar in visualization "Visualization 1" should be hidden',
            await gridAuthoring.getCSSProperty(vizPanelForGrid.getVisualizationViTitleBar('Visualization 1'), 'display')
        ).toBe('none');
        // When I toggle Title Bar
        await newFormatPanelForGrid.toggleTitleBar();
        // Then the titlebar in visualization "Visualization 1" is visible
        await expectResult(
            'Title bar in visualization "Visualization 1" should be visible',
            await gridAuthoring.getCSSProperty(vizPanelForGrid.getVisualizationViTitleBar('Visualization 1'), 'display')
        ).toBe('block');
        // #Title Font, Size, Color and Alignment
        // When I change the font to "Noto Sans JP" from the font pull down list
        await newFormatPanelForGrid.selectTextFont('Noto Sans JP');
        // Then the titlebar in visualization "Visualization 1" has style "font-family" with value "Noto Sans JP"
        await expectResult(
            'Title bar in visualization "Visualization 1" should have font-family with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                vizPanelForGrid.getVisualizationTitleBarRoot('Visualization 1'),
                'font-family'
            )
        ).toBe('noto sans jp');
        // When I select italic for the font style
        await newFormatPanelForGrid.selectFontStyle('italic');
        // Then the titlebar in visualization "Visualization 1" has style "font-style" with value "italic"
        await expectResult(
            'Title bar in visualization "Visualization 1" should have font-style with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                vizPanelForGrid.getVisualizationTitleBarRoot('Visualization 1'),
                'font-style'
            )
        ).toBe('italic');
        // When I select strikethrough for the font style
        await newFormatPanelForGrid.selectFontStyle('underscore');
        // Then the titlebar in visualization "Visualization 1" has style "text-decoration" with value "line-through"
        await expectResult(
            'Title bar in visualization "Visualization 1" should have text-decoration with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                vizPanelForGrid.getVisualizationTitleBarRoot('Visualization 1'),
                'text-decoration'
            )
        ).toContain('line-through');
        // When I change the font size to "28" by typing in the font size input field
        await newFormatPanelForGrid.setTextFontSize('28');
        // Then I pause execution for 3 seconds
        await browser.pause(3000);
        // Then the titlebar in visualization "Visualization 1" has style "font-size" with value "37.3333px"
        await expectResult(
            'Title bar in visualization "Visualization 1" should have font-size with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                vizPanelForGrid.getVisualizationTitleBarRoot('Visualization 1'),
                'font-size'
            )
        ).toBe('37.3333px');
        // When I open the font color picker
        await newFormatPanelForGrid.clickFontColorBtn();
        // And I select the built-in color "#C1292F" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#C1292F');
        // And I close the font color picker
        await baseFormatPanelReact.dismissColorPicker();
        // Then the titlebar in visualization "Visualization 1" has style "color" with value "rgba(193, 41, 47, 1)"
        await expectResult(
            'Title bar in visualization "Visualization 1" should have color with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(vizPanelForGrid.getVisualizationTitleBarRoot('Visualization 1'), 'color')
        ).toBe('rgba(193,41,47,1)');
        // When I set the text alignment to "left"
        await newFormatPanelForGrid.selectFontAlign('left');
        // Then the titlebar in visualization "Visualization 1" has style "text-align" with value "left"
        await expectResult(
            'Title bar in visualization "Visualization 1" should have text-align with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                vizPanelForGrid.getVisualizationTitleBarRoot('Visualization 1'),
                'text-align'
            )
        ).toBe('left');
        // When I set the text alignment to "center"
        await newFormatPanelForGrid.selectFontAlign('center');
        // Then the titlebar in visualization "Visualization 1" has style "text-align" with value "center"
        await expectResult(
            'Title bar in visualization "Visualization 1" should have text-align with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                vizPanelForGrid.getVisualizationTitleBarRoot('Visualization 1'),
                'text-align'
            )
        ).toBe('center');
        // When I open the title background color picker
        await newFormatPanelForGrid.clickTitleBackgroundColorBtn();
        // And I select the built-in color "#ABABAB" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#ABABAB');
        // And I close the title background color picker
        await baseFormatPanelReact.dismissColorPicker();
        // Then the titlebar in visualization "Visualization 1" has style "background-color" with value "rgba(171, 171, 171, 1)"
        await expectResult(
            'Title bar in visualization "Visualization 1" should have background-color with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                vizPanelForGrid.getVisualizationTitleBarRoot('Visualization 1'),
                'background-color'
            )
        ).toBe('rgba(171,171,171,1)');
        // # Container Color and Border
        // When I open the container fill color picker
        await newFormatPanelForGrid.clickContainerFillColorBtn();
        // And I select the built-in color "#7E0F16" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#7E0F16');
        // And I click to close the color picker
        await baseFormatPanelReact.dismissColorPicker();
        // Then the grid "Visualization 1" has style "background-color" with value "rgba(126, 15, 22, 1)"
        await expectResult(
            'Grid "Visualization 1" should have background-color with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(vizPanelForGrid.getContainer('Visualization 1'), 'background-color')
        ).toBe('rgba(126,15,22,1)');
        // When I open the container border style pulldown list
        await newFormatPanelForGrid.openContainerBorderPullDown();
        // And I select container border style "dash" from the pulldown
        await newFormatPanelForGrid.selectBorderStyle('dash');
        // Then the grid "Visualization 1" has style "border-style" with value "dashed"
        await expectResult(
            'Grid "Visualization 1" should have border-style with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(vizPanelForGrid.getContainer('Visualization 1'), 'border-style')
        ).toBe('dashed');
        // When I open the container border color picker
        await newFormatPanelForGrid.clickContainerBorderColorBtn();
        // And I select the built-in color "#F56E21" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#F56E21');
        // And I click to close the color picker
        await baseFormatPanelReact.dismissColorPicker();
        // Then the grid "Visualization 1" has style "border-color" with value "rgb(245, 110, 33)"
        await expectResult(
            'Grid "Visualization 1" should have border-color with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(vizPanelForGrid.getContainer('Visualization 1'), 'border-color')
        ).toBe('rgba(245,110,33,1)');

        // # 6 Text and Format -- Column Headers
        // When I switch to Text format tab in Format Panel
        await newFormatPanelForGrid.switchToTextFormatTab();
        // # to make the tooltip disappear
        // And I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I select the grid segment "Column Headers" from the pull down list
        await newFormatPanelForGrid.selectGridSegment('Column Headers');
        // Then I pause execution for 3 seconds
        await browser.pause(3000);
        // And I change the segment dropdown from "Column Headers" to "Column Set 1" through the new format panel
        await baseFormatPanelReact.changeSegmentControl('Column Headers', 'Column Set 1');
        // Then I pause execution for 3 seconds
        await browser.pause(3000);
        // Then The segment control dropdown should be "Column Set 1" in new format panel
        await expectResult(
            'The segment control dropdown should be "Column Set 1"',
            await baseFormatPanelReact.getSegmentControlDropDownByCurrentSelection('Column Set 1').isDisplayed()
        ).toBe(true);
        // #Column Header Font, Size, Color and Alignment
        // When I change the font to "Mulish" from the font pull down list
        await newFormatPanelForGrid.selectTextFont('Mulish');
        // Then the grid cell in ag-grid "Visualization 1" at "0", "3" has style "font-family" with value "Mulish"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "0", "3" should have font-family with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(0, 3, 'Visualization 1'),
                'font-family'
            )
        ).toBe('mulish');
        // And the grid cell in ag-grid "Visualization 1" at "0", "6" has style "font-family" with value "Noto Sans"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "0", "6" should have font-family with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(0, 6, 'Visualization 1'),
                'font-family'
            )
        ).toBe('noto sans');
        // When I open the font color picker
        await newFormatPanelForGrid.clickFontColorBtn();
        // And I switch the color picker to swatch mode
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');
        // And I select the built-in color "#1C8DD4" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#1C8DD4');
        // And I click to close the color picker
        await baseFormatPanelReact.dismissColorPicker();
        // Then the grid cell in ag-grid "Visualization 1" at "0", "3" has style "color" with value "rgba(28, 141, 212, 1)"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "0", "3" should have color with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(agGridVisualization.getGridCellByPos(0, 3, 'Visualization 1'), 'color')
        ).toBe('rgba(28,141,212,1)');
        // And the grid cell in ag-grid "Visualization 1" at "0", "6" has style "color" with value "rgba(219, 102, 87, 1)"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "0", "6" should have color with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(agGridVisualization.getGridCellByPos(0, 6, 'Visualization 1'), 'color')
        ).toBe('rgba(219,102,87,1)');
        // When I set the text alignment to "left"
        await newFormatPanelForGrid.selectFontAlign('left');
        // Then the grid cell in ag-grid "Visualization 1" at "0", "3" has style "text-align" with value "left"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "0", "3" should have text-align with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(0, 3, 'Visualization 1'),
                'text-align'
            )
        ).toBe('left');
        // And the grid cell in ag-grid "Visualization 1" at "0", "6" has style "text-align" with value "right"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "0", "6" should have text-align with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(0, 6, 'Visualization 1'),
                'text-align'
            )
        ).toBe('right');
        // When I set the text vertical alignment to "middle"
        await newFormatPanelForGrid.selectVerticalAlign('middle');
        // Then the grid cell in ag-grid "Visualization 1" at "0", "3" has style "vertical-align" with value "middle"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "0", "3" should have vertical-align with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(0, 3, 'Visualization 1'),
                'vertical-align'
            )
        ).toBe('middle');
        // And the grid cell in ag-grid "Visualization 1" at "0", "6" has style "vertical-align" with value "bottom"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "0", "6" should have vertical-align with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(0, 6, 'Visualization 1'),
                'vertical-align'
            )
        ).toBe('bottom');
        // When I open the cell fill color picker
        await newFormatPanelForGrid.clickCellFillColorBtn();
        // And I switch the color picker to swatch mode
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');
        // And I select the built-in color "#FFF3B3" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#FFF3B3');
        // And I click to close the color picker
        await baseFormatPanelReact.dismissColorPicker();
        // Then the grid cell in ag-grid "Visualization 1" at "0", "3" has style "background-color" with value "rgba(255, 243, 179, 1)"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "0", "3" should have background-color with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(0, 3, 'Visualization 1'),
                'background-color'
            )
        ).toBe('rgba(255,243,179,1)');

        // # 7. Text and Format -- Row Headers
        // When I switch to Text format tab in Format Panel
        await newFormatPanelForGrid.switchToTextFormatTab();
        // # to make the tooltip disappear
        // And I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I select the grid segment "Row Headers" from the pull down list
        await newFormatPanelForGrid.selectGridSegment('Row Headers');
        // # Row Header Font, Size, Color and Alignment
        // When I change the font to "Inter" from the font pull down list
        await newFormatPanelForGrid.selectTextFont('Inter');
        // Then the grid cell in ag-grid "Visualization 1" at "3", "0" has style "font-family" with value "Inter"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "3", "0" should have font-family with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(3, 0, 'Visualization 1'),
                'font-family'
            )
        ).toBe('inter');
        // When I select bold for the font style
        await newFormatPanelForGrid.selectFontStyle('bold');
        // Then the grid cell in ag-grid "Visualization 1" at "3", "0" has style "font-weight" with value "400"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "3", "0" should have font-weight with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(3, 0, 'Visualization 1'),
                'font-weight'
            )
        ).toBe(400);
        // When I change the font size to "12" by typing in the font size input field
        await newFormatPanelForGrid.setTextFontSize('12');
        // Then I pause execution for 3 seconds
        await browser.pause(3000);
        // Then the grid cell in ag-grid "Visualization 1" at "3", "0" has style "font-size" with value "16px"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "3", "0" should have font-size with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(3, 0, 'Visualization 1'),
                'font-size'
            )
        ).toBe('16px');
        // When I open the font color picker
        await newFormatPanelForGrid.clickFontColorBtn();
        // And I select the built-in color "#D76322" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#D76322');
        // And I click to close the color picker
        await baseFormatPanelReact.dismissColorPicker();
        // Then the grid cell in ag-grid "Visualization 1" at "3", "0" has style "color" with value "rgba(215, 99, 34, 1)"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "3", "0" should have color with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(agGridVisualization.getGridCellByPos(3, 0, 'Visualization 1'), 'color')
        ).toBe('rgba(215,99,34,1)');
        // When I set the text alignment to "right"
        await newFormatPanelForGrid.selectFontAlign('right');
        // Then the grid cell in ag-grid "Visualization 1" at "3", "0" has style "text-align" with value "right"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "3", "0" should have text-align with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(3, 0, 'Visualization 1'),
                'text-align'
            )
        ).toBe('right');
        // When I set the text vertical alignment to "bottom"
        await newFormatPanelForGrid.selectVerticalAlign('bottom');
        // Then the grid cell in ag-grid "Visualization 1" at "3", "0" has style "vertical-align" with value "bottom"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "3", "0" should have vertical-align with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(3, 0, 'Visualization 1'),
                'vertical-align'
            )
        ).toBe('bottom');

        // # 8. Cells
        // # Cell fill
        // When I open the cell fill color picker
        await newFormatPanelForGrid.clickCellFillColorBtn();
        // And I select the built-in color "#028F94" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#028F94');
        // And I click to close the color picker
        await baseFormatPanelReact.dismissColorPicker();
        // Then the grid cell in ag-grid "Visualization 1" at "3", "0" has style "background-color" with value "rgba(2, 143, 148, 1)"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "3", "0" should have background-color with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(3, 0, 'Visualization 1'),
                'background-color'
            )
        ).toBe('rgba(2,143,148,1)');
        // # Horizontal Line Style and Color
        // Then I pause execution for 3 seconds
        await browser.pause(3000);
        // When I open the grid cell "bottom" border style pulldown list
        await newFormatPanelForGrid.openCellBorderStyleDropDownByPos('bottom');
        // And I select cell border style "thick" from the pulldown
        await newFormatPanelForGrid.selectCellBorderStyle('thick');
        // Then the grid cell in ag-grid "Visualization 1" at "3", "0" has style "border-bottom-style" with value "solid"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "3", "0" should have border-bottom-style with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(3, 0, 'Visualization 1'),
                'border-bottom-style'
            )
        ).toBe('solid');
        // And the grid cell in ag-grid "Visualization 1" at "3", "0" has style "border-bottom-width" with value "2px"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "3", "0" should have border-bottom-width with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(3, 0, 'Visualization 1'),
                'border-bottom-width'
            )
        ).toBe('2px');
        // When I open the grid cell "bottom" border color picker
        await newFormatPanelForGrid.clickCellBorderColorBtnByPos('bottom');
        // And I select the built-in color "#9D9FE0" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#9D9FE0');
        // And I click to close the color picker
        await baseFormatPanelReact.dismissColorPicker();
        // Then the grid cell in ag-grid "Visualization 1" at "3", "0" has style "border-color" with value "rgba(157, 159, 224, 1)"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "3", "0" should have border-color with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(3, 0, 'Visualization 1'),
                'border-color'
            )
        ).toContain('rgba(157,159,224,1)');
        // When I open the grid cell "bottom" border style pulldown list
        await newFormatPanelForGrid.openCellBorderStyleDropDownByPos('bottom');
        // And I select cell border style "none" from the pulldown
        await newFormatPanelForGrid.selectCellBorderStyle('none');
        // Then the grid cell in ag-grid "Visualization 1" at "3", "0" has style "border-style" with value "none"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "3", "0" should have border-style with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(3, 0, 'Visualization 1'),
                'border-style'
            )
        ).toBe('none solid none none');
        // #Vertical Line Style and Color
        // When I open the grid cell "right" border style pulldown list
        await newFormatPanelForGrid.openCellBorderStyleDropDownByPos('right');
        // And I select cell border style "thick" from the pulldown
        await newFormatPanelForGrid.selectCellBorderStyle('thick');
        // Then the grid cell in ag-grid "Visualization 1" at "3", "0" has style "border-right-style" with value "solid"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "3", "0" should have border-right-style with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(3, 0, 'Visualization 1'),
                'border-right-style'
            )
        ).toBe('solid');
        // And the grid cell in ag-grid "Visualization 1" at "3", "0" has style "border-right-width" with value "2px"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "3", "0" should have border-right-width with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(3, 0, 'Visualization 1'),
                'border-right-width'
            )
        ).toBe('2px');
        // When I open the grid cell "right" border color picker
        await newFormatPanelForGrid.clickCellBorderColorBtnByPos('right');
        // And I select the built-in color "#A6CCDD" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#A6CCDD');
        // And I click to close the color picker
        await baseFormatPanelReact.dismissColorPicker();
        // Then the grid cell in ag-grid "Visualization 1" at "3", "0" has style "border-color" with value "rgba(166, 204, 221, 1)"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "3", "0" should have border-color with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(3, 0, 'Visualization 1'),
                'border-right-color'
            )
        ).toBe('rgba(166,204,221,1)');

        // # 9. Values
        // When I select the grid segment "Values" from the pull down list
        await newFormatPanelForGrid.selectGridSegment('Values');
        // When I change the segment dropdown from "Values" to "Column Set 2" through the new format panel
        await baseFormatPanelReact.changeSegmentControl('Values', 'Column Set 2');
        // Then The segment control dropdown should be "Column Set 2" in new format panel
        await expectResult(
            'The segment control dropdown should be "Column Set 2" in new format panel',
            await baseFormatPanelReact.getSegmentControlDropDownByCurrentSelection('Column Set 2').isDisplayed()
        ).toBe(true);
        // # Values Font, Size, Color and Alignment
        // When I change the font to "Monoton" from the font pull down list
        await newFormatPanelForGrid.selectTextFont('Monoton');
        // Then the grid cell in ag-grid "Visualization 1" at "4", "6" has style "font-family" with value "Monoton"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "4", "6" should have font-family with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(4, 6, 'Visualization 1'),
                'font-family'
            )
        ).toBe('monoton');
        // And the grid cell in ag-grid "Visualization 1" at "4", "3" has style "font-family" with value "fredoka"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "4", "3" should have font-family with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(4, 3, 'Visualization 1'),
                'font-family'
            )
        ).toBe('mulish');
        // When I select italic for the font style
        await newFormatPanelForGrid.selectFontStyle('italic');
        // Then the grid cell in ag-grid "Visualization 1" at "4", "6" has style "font-style" with value "italic"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "4", "6" should have font-style with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(4, 6, 'Visualization 1'),
                'font-style'
            )
        ).toBe('italic');
        // When I select bold for the font style
        await newFormatPanelForGrid.selectFontStyle('bold');
        // Then the grid cell in ag-grid "Visualization 1" at "4", "6" has style "font-weight" with value "400"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "4", "6" should have font-weight with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(4, 6, 'Visualization 1'),
                'font-weight'
            )
        ).toBe(400);
        // And the grid cell in ag-grid "Visualization 1" at "4", "3" has style "font-weight" with value "700"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "4", "3" should have font-weight with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(4, 3, 'Visualization 1'),
                'font-weight'
            )
        ).toBe(700);
        // When I change the font size to "10" by typing in the font size input field
        await newFormatPanelForGrid.setTextFontSize('10');
        // Then I pause execution for 3 seconds
        await browser.pause(3000);
        // Then the grid cell in ag-grid "Visualization 1" at "4", "6" has style "font-size" with value "13.3333px"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "4", "6" should have font-size with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(4, 6, 'Visualization 1'),
                'font-size'
            )
        ).toBe('13.33px');
        // And the grid cell in ag-grid "Visualization 1" at "4", "3" has style "font-size" with value "16px"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "4", "3" should have font-size with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(4, 3, 'Visualization 1'),
                'font-size'
            )
        ).toBe('16px');
        // When I open the font color picker
        await newFormatPanelForGrid.clickFontColorBtn();
        // And I switch the color picker to swatch mode
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');
        // And I select the built-in color "#38AE6F" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#38AE6F');
        // And I click to close the color picker
        await baseFormatPanelReact.dismissColorPicker();
        // Then the grid cell in ag-grid "Visualization 1" at "5", "6" has style "color" with value "rgba(56, 174, 111, 1)"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "5", "6" should have color with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(agGridVisualization.getGridCellByPos(5, 6, 'Visualization 1'), 'color')
        ).toBe('rgba(56,174,111,1)');
        // And the grid cell in ag-grid "Visualization 1" at "4", "3" has style "color" with value "rgba(219, 102, 87, 1)"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "3", "3" should have color with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(agGridVisualization.getGridCellByPos(3, 3, 'Visualization 1'), 'color')
        ).toBe('rgba(219,102,87,1)');
        // When I set the text alignment to "justify"
        await newFormatPanelForGrid.selectFontAlign('justify');
        // Then the grid cell in ag-grid "Visualization 1" at "4", "6" has style "text-align" with value "justify"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "5", "6" should have text-align with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(5, 6, 'Visualization 1'),
                'text-align'
            )
        ).toBe('justify');
        // When I set the text vertical alignment to "middle"
        await newFormatPanelForGrid.selectVerticalAlign('middle');
        // Then the grid cell in ag-grid "Visualization 1" at "4", "6" has style "vertical-align" with value "middle"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "5", "6" should have vertical-align with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(5, 6, 'Visualization 1'),
                'vertical-align'
            )
        ).toBe('middle');
        // When I open the cell fill color picker
        await newFormatPanelForGrid.clickCellFillColorBtn();
        // And I switch the color picker to palette mode
        await newFormatPanelForGrid.clickColorPickerModeBtn('palette');
        // And I set the hex color "5dcc49" in the color picker palette mode
        await newFormatPanelForGrid.setColorPaletteHex('5dcc49');
        // And I click to close the color picker
        // await baseFormatPanelReact.dismissColorPicker();
        // Then the grid cell in ag-grid "Visualization 1" at "4", "6" has style "background-color" with value "rgba(93, 204, 73, 1)"
        // await expectResult(
        //     'The grid cell in ag-grid "Visualization 1" at "5", "6" should have background-color with value #{expected} instead we have #{actual}',
        //     await gridAuthoring.getCSSProperty(
        //         agGridVisualization.getGridCellByPos(5, 6, 'Visualization 1'),
        //         'background-color'
        //     )
        // ).toBe('rgba(93,204,73,1)');

        // #Horizontal Line Style and Color
        // When I open the grid cell "bottom" border style pulldown list
        await newFormatPanelForGrid.openCellBorderStyleDropDownByPos('bottom');
        // And I select cell border style "dash" from the pulldown
        await newFormatPanelForGrid.selectCellBorderStyle('dash');
        // Then the grid cell in ag-grid "Visualization 1" at "4", "6" has style "border-bottom-style" with value "dashed"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "5", "6" should have border-bottom-style with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(5, 6, 'Visualization 1'),
                'border-bottom-style'
            )
        ).toBe('dashed');
        // When I open the grid cell "bottom" border color picker
        await newFormatPanelForGrid.clickCellBorderColorBtnByPos('bottom');
        // And I switch the color picker to palette mode
        await newFormatPanelForGrid.clickColorPickerModeBtn('palette');
        // And I set the hex color "2edb08" in the color picker palette mode
        await newFormatPanelForGrid.setColorPaletteHex('2edb08');
        // And I click to close the color picker
        await baseFormatPanelReact.dismissColorPicker();
        // Then the grid cell in ag-grid "Visualization 1" at "4", "6" has style "border-bottom-color" with value "rgba(46, 219, 8, 1)"
        // await expectResult(
        //     'The grid cell in ag-grid "Visualization 1" at "5", "6" should have border-bottom-color with value #{expected} instead we have #{actual}',
        //     await gridAuthoring.getCSSProperty(
        //         agGridVisualization.getGridCellByPos(5, 6, 'Visualization 1'),
        //         'border-bottom-color'
        //     )
        // ).toBe('rgba(46,219,8,1)');

        // #Vertical Line Style and Color
        // When I open the grid cell "right" border style pulldown list
        await newFormatPanelForGrid.openCellBorderStyleDropDownByPos('right');
        // And I select cell border style "thick" from the pulldown
        await newFormatPanelForGrid.selectCellBorderStyle('thick');
        // Then the grid cell in ag-grid "Visualization 1" at "4", "6" has style "border-right-style" with value "solid"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "5", "6" should have border-right-style with value #{expected} instead we have #{actual}',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(5, 6, 'Visualization 1'),
                'border-right-style'
            )
        ).toBe('solid');
        // When I open the grid cell "right" border color picker
        await newFormatPanelForGrid.clickCellBorderColorBtnByPos('right');
        // And I switch the color picker to palette mode
        await newFormatPanelForGrid.clickColorPickerModeBtn('palette');
        // And I set the hex color "2edb08" in the color picker palette mode
        await newFormatPanelForGrid.setColorPaletteHex('2edb08');
        // And I click to close the color picker
        await baseFormatPanelReact.dismissColorPicker();
        // Then the grid cell in ag-grid "Visualization 1" at "5", "6" has style "border-right-color" with value "rgba(46, 219, 8, 1)"
        // await expectResult(
        //     'The grid cell in ag-grid "Visualization 1" at "5", "6" should have border-right-color with value #{expected} instead we have #{actual}',
        //     await gridAuthoring.getCSSProperty(
        //         agGridVisualization.getGridCellByPos(5, 6, 'Visualization 1'),
        //         'border-right-color'
        //     )
        // ).toBe('rgba(46,219,8,1)');

        // # 10. MicroCharts formatting
        // #Still cannot locate a microchart due to the grid structure. Use screenshot comparison for microchart validation for now
        // When I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
        // And I collapse "Spacing" section
        await newFormatPanelForGrid.clickSectionTitle('Spacing');
        // And I expand "Microcharts" section
        await newFormatPanelForGrid.clickSectionTitle('Microcharts');
        // Then The dashboard's screenshot "TC71086_2_1" should match the baselines
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'The dashboard screenshot "TC71086_2_1" should match the baselines',
            'TC71086_2_1'
        );

        // # this drag and drop slider is not working well.
        // #Then I move the slider for Chart Height "30" pixels to the "right"
        // #Then The dashboard's screenshot "TC71086_2" should match the baselines

        // When I set the MicroChart vertical alignment to "top"
        await newFormatPanelForGrid.changeMicroChartAlign('top');
        // Then The dashboard's screenshot "TC71086_2_3" should match the baselines
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'The dashboard screenshot "TC71086_2_3" should match the baselines',
            'TC71086_2_3'
        );
        // When I toggle the MicroChart data point spots button
        await newFormatPanelForGrid.toggleDPSpots();
        // Then The dashboard's screenshot "TC71086_2_4" should match the baselines
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'The dashboard screenshot "TC71086_2_4" should match the baselines',
            'TC71086_2_4'
        );

        // When I toggle the MicroChart data point spots button
        await newFormatPanelForGrid.toggleDPSpots();
        // And I set the MicroChart data point display to "Key Data Points"
        await newFormatPanelForGrid.changeDPSelection('Key Data Points');
        // Then The dashboard's screenshot "TC71086_2_5" should match the baselines
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'The dashboard screenshot "TC71086_2_5" should match the baselines',
            'TC71086_2_5'
        );
        // When I select the MicroChart key data point to "max"
        await newFormatPanelForGrid.selectKeyDPOption('max');
        // Then The dashboard's screenshot "TC71086_2_6" should match the baselines
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'The dashboard screenshot "TC71086_2_6" should match the baselines',
            'TC71086_2_6'
        );
    });

    it('[TC71098_1] Functional validation of  Formatting in Modern (AG) Grid Microcharts authoring and consumption modes', async () => {
        // // When I create a new local dossier
        await libraryPage.createNewDashboardByUrl({});
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then The Dossier Editor is displayed
        // await since('The Dossier Editor should be displayed').expect(dossierMojoEditor.isDisplayed()).toBe(true);
        // When I click on the Add New Data button
        await datasetsPanel.clickNewDataBtn();
        await browser.pause(10000);
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then The datasets panel should have dataset "airline-sample-data.xls" after 15 seconds
        await datasetsPanel.clickDataSourceByIndex(5); // Using Sample Files as data source
        await datasetsPanel.importSampleFiles([0]); // The 7th file in the list 'retail-sample-data.xls'
        // await datasetsPanel.waitForDatasetToAppear('airline-sample-data.xls', 15);
        // // When I change visualization "Visualization 1" to "Grid (Modern)" from context menu
        await agGridVisualization.changeViz('Grid (Modern)', 'Visualization 1', false);
        // // And I add "attribute" named "Airline Name" from dataset "airline-sample-data.xls" to the current Viz by double click
        await datasetsPanel.addObjectToVizByDoubleClick('Airline Name', 'attribute', 'airline-sample-data.xls');
        // // Then The editor panel should have "attribute" named "Airline Name" on "Rows" section
        await expectResult(
            'The editor panel should have "attribute" named "Airline Name" on "Rows" section',
            await editorPanelForGrid.getObjectFromSection('Airline Name', 'attribute', 'Rows').isDisplayed()
        ).toBe(true);
        // // When I add a new column set to the ag-grid
        await agGridVisualization.addColumnSet();
        // // And I drag "attribute" named "Origin Airport" from dataset "airline-sample-data.xls" to Column Set "Column Set 1" in ag-grid
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ(
            'Origin Airport',
            'attribute',
            'airline-sample-data.xls',
            'Column Set 1'
        );
        // // And I drag "metric" named "Number of Flights" from dataset "airline-sample-data.xls" to Column Set "Column Set 1" and drop it below "Origin Airport" in ag-grid
        await vizPanelForGrid.dragDSObjectToColumnSetDZwithPosition(
            'Number of Flights',
            'metric',
            'airline-sample-data.xls',
            'Column Set 1',
            'below',
            'Origin Airport'
        );
        // // Then The editor panel should have "attribute" named "Origin Airport" on "Column Set 1" section
        await expectResult(
            'The editor panel should have "attribute" named "Origin Airport" on "Column Set 1" section',
            await editorPanelForGrid.getObjectFromSection('Origin Airport', 'attribute', 'Column Set 1').isDisplayed()
        ).toBe(true);
        // // And The editor panel should have "metric" named "Number of Flights" on "Column Set 1" section
        // await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await expectResult(
            'The editor panel should have "metric" named "Number of Flights" on "Column Set 1" section',
            await editorPanelForGrid.getObjectFromSection('Number of Flights', 'metric', 'Column Set 1').isDisplayed()
        ).toBe(true);
        // // When I add a new column set to the ag-grid
        await agGridVisualization.addColumnSet();
        // // And I drag "metric" named "Flights Cancelled" from dataset "airline-sample-data.xls" to Column Set "Column Set 2" in ag-grid
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ(
            'Flights Cancelled',
            'metric',
            'airline-sample-data.xls',
            'Column Set 2'
        );
        // // And I drag "metric" named "Flights Delayed" from dataset "airline-sample-data.xls" to Column Set "Column Set 2" and drop it below "Flights Cancelled" in ag-grid
        await vizPanelForGrid.dragDSObjectToColumnSetDZwithPosition(
            'Flights Delayed',
            'metric',
            'airline-sample-data.xls',
            'Column Set 2',
            'below',
            'Flights Cancelled'
        );
        // // Then The editor panel should have "metric" named "Flights Cancelled" on "Column Set 2" section
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await expectResult(
            'The editor panel should have "metric" named "Flights Cancelled" on "Column Set 2" section',
            await editorPanelForGrid.getObjectFromSection('Flights Cancelled', 'metric', 'Column Set 2').isDisplayed()
        ).toBe(true);
        // // And The editor panel should have "metric" named "Flights Delayed" on "Column Set 2" section
        // await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await expectResult(
            'The editor panel should have "metric" named "Flights Delayed" on "Column Set 2" section',
            await editorPanelForGrid.getObjectFromSection('Flights Delayed', 'metric', 'Column Set 2').isDisplayed()
        ).toBe(true);
        // // When I add a new microchart set to the ag-grid
        await agGridVisualization.addMicrochartSet();
        // // And I select the object named "On-Time" from pulldown at position "1" in the microchart config dialog
        await microchartConfigDialog.selectObject(1, 'On-Time');
        // // And I select the object named "Year" from pulldown at position "2" in the microchart config dialog
        await microchartConfigDialog.selectObject(2, 'Year');
        // // Then the object named "On-Time" is selected from pulldown at position "1" in the microchart config dialog
        await expectResult(
            'the object named "On-Time" is selected from pulldown at position "1" in the microchart config dialog',
            await microchartConfigDialog.getObjectPulldownSelection(1).getText()
        ).toBe('On-Time');
        // // And the object named "Year" is selected from pulldown at position "2" in the microchart config dialog
        await expectResult(
            'The object named "Year" should be selected from pulldown at position "2"',
            await microchartConfigDialog.getObjectPulldownSelection(2).getText()
        ).toBe('Year');
        // // Then the microchart is named "On-Time Trend by Year" in the microchart config dialog
        await microchartConfigDialog.getNameInputFieldWithText('On-Time Trend by Year').waitForDisplayed();
        // // When I confirm the microchart config dialog
        await microchartConfigDialog.confirmDialog();
        // // Then The editor panel should have microchart with type "Sparkline" named "On-Time Trend by Year" on "On-Time Trend by Year" section
        await editorPanelForGrid
            .getMCFromSection('On-Time Trend by Year', 'sparkline', 'On-Time Trend by Year')
            .waitForDisplayed();
        // // When I add a new microchart set to the ag-grid
        await agGridVisualization.addMicrochartSet();
        // // And I select the microchart type "Trend Bars" in the microchart config dialog
        await microchartConfigDialog.selectType('Trend Bars');
        // // And I select the object named "Avg Delay (min)" from pulldown at position "1" in the microchart config dialog
        await microchartConfigDialog.selectObject(1, 'Avg Delay (min)');
        // // Then the object named "Avg Delay (min)" is selected from pulldown at position "1" in the microchart config dialog
        await expectResult(
            'The object named "Avg Delay (min)" should be selected from pulldown at position "1"',
            await microchartConfigDialog.getObjectPulldownSelection(1).getText()
        ).toBe('Avg Delay (min)');
        // // When I select the object named "Year" from pulldown at position "2" in the microchart config dialog
        await microchartConfigDialog.selectObject(2, 'Year');
        // // Then the object named "Year" is selected from pulldown at position "2" in the microchart config dialog
        await expectResult(
            'The object named "Year" should be selected from pulldown at position "2"',
            await microchartConfigDialog.getObjectPulldownSelection(2).getText()
        ).toBe('Year');
        // // Then the microchart is named "Avg Delay (min) Comparison by Year" in the microchart config dialog
        await microchartConfigDialog.getNameInputFieldWithText('Avg Delay (min) Comparison by Year').waitForDisplayed();
        // // When I confirm the microchart config dialog
        await microchartConfigDialog.confirmDialog();
        // // Then The editor panel should have microchart with type "Trend Bars" named "Avg Delay (min) Comparison by Year" on "Avg Delay (min) Comparison by Year" section
        await editorPanelForGrid
            .getMCFromSection('Avg Delay (min) Comparison by Year', 'trendBar', 'Avg Delay (min) Comparison by Year')
            .waitForDisplayed();
        // // When I add a new microchart set to the ag-grid
        await agGridVisualization.addMicrochartSet();
        // // And I select the microchart type "Bullet" in the microchart config dialog
        await microchartConfigDialog.selectType('Bullet');
        // // And I select the object named "On-Time" from pulldown at position "1" in the microchart config dialog
        await microchartConfigDialog.selectObject(1, 'On-Time');
        // // And I select the object named "Number of Flights" from pulldown at position "2" in the microchart config dialog
        await microchartConfigDialog.selectObject(2, 'Number of Flights');
        // // And I select the object named "Avg Delay (min)" from pulldown at position "3" in the microchart config dialog
        await microchartConfigDialog.selectObject(3, 'Avg Delay (min)');
        // // Then the object named "On-Time" is selected from pulldown at position "1" in the microchart config dialog
        await expectResult(
            'Object named "On-Time" should be selected from pulldown at position "1"',
            await microchartConfigDialog.getObjectPulldownSelection(1).getText()
        ).toBe('On-Time');
        // // And the object named "Number of Flights" is selected from pulldown at position "2" in the microchart config dialog
        await expectResult(
            'Object named "Number of Flights" should be selected from pulldown at position "2"',
            await microchartConfigDialog.getObjectPulldownSelection(2).getText()
        ).toBe('Number of Flights');
        // // And the object named "Avg Delay (min)" is selected from pulldown at position "3" in the microchart config dialog
        await expectResult(
            'The object named "Avg Delay (min)" should be selected from pulldown at position "3"',
            await microchartConfigDialog.getObjectPulldownSelection(3).getText()
        ).toBe('Avg Delay (min)');
        // // Then the microchart is named "On-Time Performance" in the microchart config dialog
        await microchartConfigDialog.getNameInputFieldWithText('On-Time Performance').waitForDisplayed();
        // // When I confirm the microchart config dialog
        await microchartConfigDialog.confirmDialog();
        // // Then The editor panel should have microchart with type "Bullet" named "On-Time Performance" on "On-Time Performance" section
        await editorPanelForGrid
            .getMCFromSection('On-Time Performance', 'bullet', 'On-Time Performance')
            .waitForDisplayed();
        // // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // // And I switch to the "Text and Form" section on new format panel
        await baseFormatPanelReact.switchSection('Text and Form');
        // // When I change the font to "Noto Sans" from the font pull down list
        await newFormatPanelForGrid.selectTextFont('Noto Sans');
        // // Then the grid cell in ag-grid "Visualization 1" at "0", "1" has style "font-family" with value "Noto Sans"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "0", "1" should have style "font-family" with value "Noto Sans"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(0, 1, 'Visualization 1'),
                'font-family'
            )
        ).toBe('noto sans');
        // // And the grid cell in ag-grid "Visualization 1" at "4", "0" has style "font-family" with value "Noto Sans"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "4", "0" should have style "font-family" with value "Noto Sans"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(4, 0, 'Visualization 1'),
                'font-family'
            )
        ).toBe('noto sans');
        // // And the grid cell in ag-grid "Visualization 1" at "2", "1" has style "font-family" with value "Noto Sans"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "2", "1" should have style "font-family" with value "Noto Sans"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(2, 1, 'Visualization 1'),
                'font-family'
            )
        ).toBe('noto sans');
        // // When I open the cell fill color picker
        await newFormatPanelForGrid.clickCellFillColorBtn();
        // // And I select the built-in color "#C1292F" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#C1292F');
        // // And I close the cell fill color picker
        await newFormatPanelForGrid.clickCellFillColorBtn();
        // // Then the grid cell in ag-grid "Visualization 1" at "1", "1" has style "background-color" with value "rgba(193, 41, 47, 1)"
        await expectResult(
            'Grid cell at "1", "1" in "Visualization 1" should have background-color "rgba(193, 41, 47, 1)"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(1, 1, 'Visualization 1'),
                'background-color'
            )
        ).toBe('rgba(193,41,47,1)');
        // // When I change grid cell fill color opacity to "20" through new format panel
        await newFormatPanelForGrid.changeCellFillColorOpacity('20');
        // // Then the grid cell in ag-grid "Visualization 1" at "1", "1" has style "background-color" with value "rgba(193, 41, 47, 0.2)"
        await expectResult(
            'Grid cell at "1", "1" in "Visualization 1" should have background-color "rgba(193, 41, 47, 0.2)"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(1, 1, 'Visualization 1'),
                'background-color'
            )
        ).toBe('rgba(193,41,47,0.2)');
        // // When I switch to Editor Panel tab
        await vizPanelForGrid.switchToEditorPanel();
        // // And I add a new column set to the ag-grid
        await agGridVisualization.addColumnSet();
        // // And I drag "attribute" named "Day of Week" from dataset "airline-sample-data.xls" to Column Set "Column Set 3" in ag-grid
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ(
            'Day of Week',
            'attribute',
            'airline-sample-data.xls',
            'Column Set 3'
        );
        // // And I drag "metric" named "Avg Delay (min)" from dataset "airline-sample-data.xls" to Column Set "Column Set 3" and drop it below "Day of Week" in ag-grid
        await vizPanelForGrid.dragDSObjectToColumnSetDZwithPosition(
            'Avg Delay (min)',
            'metric',
            'airline-sample-data.xls',
            'Column Set 3',
            'below',
            'Day of Week'
        );
        // // Then The editor panel should have "attribute" named "Day of Week" on "Column Set 3" section
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await expectResult(
            'The editor panel should have "attribute" named "Day of Week" on "Column Set 3" section',
            await editorPanelForGrid.getObjectFromSection('Day of Week', 'attribute', 'Column Set 3').isDisplayed()
        ).toBe(true);
        // // And The editor panel should have "metric" named "Avg Delay (min)" on "Column Set 3" section
        await expectResult(
            'The editor panel should have "metric" named "Avg Delay (min)" on "Column Set 3" section',
            await editorPanelForGrid.getObjectFromSection('Avg Delay (min)', 'metric', 'Column Set 3').isDisplayed()
        ).toBe(true);
        // And the grid cell in ag-grid "Visualization 1" at "4", "15" has style "background-color" with value "rgba(255, 255, 255, 1)"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "4", "15" should have style "background-color" with value "rgba(255, 255, 255, 1)"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(4, 15, 'Visualization 1'),
                'background-color'
            )
        ).toBe('rgba(255,255,255,0.2)');
        // // And the grid cell in ag-grid "Visualization 1" at "4", "15" has style "font-family" with value "Open Sans"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "4", "15" should have style "font-family" with value "Open Sans"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(4, 15, 'Visualization 1'),
                'font-family'
            )
        ).toBe('open sans');
        // // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // // And I switch to the "Text and Form" section on new format panel
        await baseFormatPanelReact.switchSection('Text and Form');
        // // And I select the grid segment "Column Headers" from the pull down list
        await newFormatPanelForGrid.selectGridSegment('Column Headers');
        // // Then The segment control dropdown should be "All Sets" in new format panel
        await expectResult(
            'The segment control dropdown should be "Column Headers" in new format panel',
            await baseFormatPanelReact.getSegmentControlDropDownByCurrentSelection('Column Headers').isDisplayed()
        ).toBe(true);
        // // When I change the font to "Anton" from the font pull down list
        await newFormatPanelForGrid.selectTextFont('Anton');
        // // Then the grid cell in ag-grid "Visualization 1" at "1", "1" has style "font-family" with value "Anton"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "1", "1" should have style "font-family" with value "Anton"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(1, 1, 'Visualization 1'),
                'font-family'
            )
        ).toBe('anton');
        // // And the grid cell in ag-grid "Visualization 1" at "0", "16" has style "font-family" with value "Anton"
        await expectResult(
            'Grid cell in ag-grid "Visualization 1" at "0", "16" should have font-family "Anton"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(0, 16, 'Visualization 1'),
                'font-family'
            )
        ).toBe('anton');
        // // When I click on Italic button from the Format Panel
        await textField.ClickOnFontStyleButtonInPanel('italic');
        // // Then the grid cell in ag-grid "Visualization 1" at "1", "1" has style "font-style" with value "italic"
        await expectResult(
            'Grid cell in ag-grid "Visualization 1" at "1", "1" should have font-style "italic"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(1, 1, 'Visualization 1'),
                'font-style'
            )
        ).toBe('italic');
        // // And the grid cell in ag-grid "Visualization 1" at "0", "16" has style "font-style" with value "italic"
        await expectResult(
            'Grid cell in ag-grid "Visualization 1" at "0", "16" should have font-style "italic"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(0, 16, 'Visualization 1'),
                'font-style'
            )
        ).toBe('italic');
        // // When I click font size increase button "1" times for the textbox from the format panel
        await textField.ClickFontSizeIncreaseBtnForTimes(1);
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await browser.pause(2000);
        // // Then the grid cell in ag-grid "Visualization 1" at "1", "1" has style "font-size" with value "12px"
        await expectResult(
            'Grid cell in ag-grid "Visualization 1" at "1", "1" should have font-size "12px"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(1, 1, 'Visualization 1'),
                'font-size'
            )
        ).toBe('12px');
        // // And the grid cell in ag-grid "Visualization 1" at "0", "16" has style "font-size" with value "12px"
        await expectResult(
            'Grid cell in ag-grid "Visualization 1" at "0", "16" should have font-size "12px"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(0, 16, 'Visualization 1'),
                'font-size'
            )
        ).toBe('12px');
        // // When I open the font color picker
        await newFormatPanelForGrid.clickFontColorBtn();
        // // And I switch the color picker to swatch mode
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');
        // // And I select the built-in color "#1D6F31" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#1D6F31');
        // // And I click to close the color picker
        await baseFormatPanelReact.dismissColorPicker();
        // // Then the grid cell in ag-grid "Visualization 1" at "1", "1" has style "color" with value "rgba(29, 111, 49, 1)"
        await expectResult(
            'Grid cell at "1", "1" in "Visualization 1" should have color "rgba(29, 111, 49, 1)"',
            await gridAuthoring.getCSSProperty(agGridVisualization.getGridCellByPos(1, 1, 'Visualization 1'), 'color')
        ).toBe('rgba(29,111,49,1)');
        // // And the grid cell in ag-grid "Visualization 1" at "0", "16" has style "color" with value "rgba(29, 111, 49, 1)"
        await expectResult(
            'Grid cell at "0", "16" in "Visualization 1" should have color "rgba(29, 111, 49, 1)"',
            await gridAuthoring.getCSSProperty(agGridVisualization.getGridCellByPos(0, 16, 'Visualization 1'), 'color')
        ).toBe('rgba(29,111,49,1)');
        // // When I set the text vertical alignment to "middle"
        await newFormatPanelForGrid.selectVerticalAlign('middle');
        // // Then the grid cell in ag-grid "Visualization 1" at "1", "1" has style "vertical-align" with value "middle"
        await expectResult(
            'Grid cell at "1", "1" in "Visualization 1" should have vertical-align "middle"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(1, 1, 'Visualization 1'),
                'vertical-align'
            )
        ).toBe('middle');
        // // And the grid cell in ag-grid "Visualization 1" at "0", "16" has style "vertical-align" with value "middle"
        await expectResult(
            'Grid cell at "0", "16" in "Visualization 1" should have vertical-align "middle"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(0, 16, 'Visualization 1'),
                'vertical-align'
            )
        ).toBe('middle');
        // // And the grid cell in ag-grid "Visualization 1" at "4", "15" has style "vertical-align" with value "top"
        await expectResult(
            'Grid cell at "4", "15" in "Visualization 1" should have vertical-align "top"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(4, 15, 'Visualization 1'),
                'vertical-align'
            )
        ).toBe('top');
        // // When I select the grid segment "Row Headers" from the pull down list
        await newFormatPanelForGrid.selectGridSegment('Row Headers');
        // // And I click on Underline button from the Format Panel
        await textField.ClickOnFontStyleButtonInPanel('underline');
        // // Then the grid cell in ag-grid "Visualization 1" at "2", "0" has style "text-decoration" with value "underline"
        await expectResult(
            'Grid cell at "2", "0" in "Visualization 1" should have text-decoration "underline"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(2, 0, 'Visualization 1'),
                'text-decoration'
            )
        ).toContain('underline');
        // // And the grid cell in ag-grid "Visualization 1" at "7", "0" has style "text-decoration" with value "underline"
        await expectResult(
            'Grid cell at row 7, col 0 in "Visualization 1" should have text-decoration "underline"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(7, 0, 'Visualization 1'),
                'text-decoration'
            )
        ).toContain('underline');
        // // When I change the font size to "7" by typing in the font size input field
        await newFormatPanelForGrid.setTextFontSize('7');
        // // Then the grid cell in ag-grid "Visualization 1" at "2", "0" has style "font-size" with value "9px"
        await expectResult(
            'Grid cell at row 2, col 0 in "Visualization 1" should have font-size "9px"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(2, 0, 'Visualization 1'),
                'font-size'
            )
        ).toBe('9.33px');
        // // Then the grid cell in ag-grid "Visualization 1" at "7", "0" has style "font-size" with value "9px"
        await expectResult(
            'Grid cell at row 7, col 0 in "Visualization 1" should have font-size "9px"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(7, 0, 'Visualization 1'),
                'font-size'
            )
        ).toBe('9.33px');
        // // When I open the cell fill color picker
        await newFormatPanelForGrid.clickCellFillColorBtn();
        // // And I select the built-in color "#0F6095" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#0F6095');
        // // Then the grid cell in ag-grid "Visualization 1" at "2", "0" has style "background-color" with value "rgba(15, 96, 149, 0.2)"
        await expectResult(
            'Grid cell at row 2, col 0 in "Visualization 1" should have background-color "rgba(15, 96, 149, 0.2)"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(2, 0, 'Visualization 1'),
                'background-color'
            )
        ).toBe('rgba(15,96,149,0.2)');
        // // And the grid cell in ag-grid "Visualization 1" at "7", "0" has style "background-color" with value "rgba(15, 96, 149, 0.2)"
        await expectResult(
            'Grid cell at row 7, col 0 in "Visualization 1" should have background-color "rgba(15, 96, 149, 0.2)"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(7, 0, 'Visualization 1'),
                'background-color'
            )
        ).toBe('rgba(15,96,149,0.2)');
        // // When I set the text alignment to "right"
        await newFormatPanelForGrid.selectFontAlign('right');
        // // Then the grid cell in ag-grid "Visualization 1" at "2", "0" has style "text-align" with value "right"
        await expectResult(
            'Grid cell at row 2, col 0 in "Visualization 1" should have text-align "right"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(2, 0, 'Visualization 1'),
                'text-align'
            )
        ).toBe('right');
        // // And the grid cell in ag-grid "Visualization 1" at "7", "0" has style "text-align" with value "right"
        await expectResult(
            'Grid cell at row 7, col 0 in "Visualization 1" should have text-align "right"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(7, 0, 'Visualization 1'),
                'text-align'
            )
        ).toBe('right');
        // // When I select the grid segment "Values" from the pull down list
        await newFormatPanelForGrid.selectGridSegment('Values');
        // // Then The segment control dropdown should be "Column Headers" in new format panel
        await expectResult(
            'The segment control dropdown should be "Values" in new format panel',
            await baseFormatPanelReact.getSegmentControlDropDownByCurrentSelection('Values').isDisplayed()
        ).toBe(true);
        // // When I change the font to "Fredoka" from the font pull down list
        await newFormatPanelForGrid.selectTextFont('Fredoka');
        // // Then the grid cell in ag-grid "Visualization 1" at "1", "1" has style "font-family" with value "anton"
        await expectResult(
            'the grid cell in ag-grid "Visualization 1" at "1", "1" has style "font-family" with value "anton"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(1, 1, 'Visualization 1'),
                'font-family'
            )
        ).toBe('anton');
        // // And the grid cell in ag-grid "Visualization 1" at "4", "0" has style "font-family" with value "Noto Sans"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "4", "0" should have style "font-family" with value "Noto Sans"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(4, 0, 'Visualization 1'),
                'font-family'
            )
        ).toBe('noto sans');
        // // And the grid cell in ag-grid "Visualization 1" at "4", "2" has style "font-family" with value "Noto Serif KR"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "4", "2" should have style "font-family" with value "Fredoka"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(4, 2, 'Visualization 1'),
                'font-family'
            )
        ).toBe('fredoka');
        // // When I click on Strikeout button from the Format Panel
        await textField.ClickOnFontStyleButtonInPanel('underscore');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // // Then the grid cell in ag-grid "Visualization 1" at "4", "2" has style "text-decoration" with value "line-through"
        await expectResult(
            'Grid cell at "4", "2" in "Visualization 1" should have text-decoration "line-through"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(4, 2, 'Visualization 1'),
                'text-decoration'
            )
        ).toContain('line-through');
        // // When I open the font color picker
        await newFormatPanelForGrid.clickFontColorBtn();
        // // And I switch the color picker to swatch mode
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');
        // // And I select the built-in color "#C1292F" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#C1292F');
        // // And I click to close the color picker
        await baseFormatPanelReact.dismissColorPicker();
        // // Then the grid cell in ag-grid "Visualization 1" at "1", "1" has style "color" with value "rgba(29, 111, 49, 1)"
        await expectResult(
            'Grid cell at "1", "1" in "Visualization 1" should have color "rgba(29, 111, 49, 1)"',
            await gridAuthoring.getCSSProperty(agGridVisualization.getGridCellByPos(1, 1, 'Visualization 1'), 'color')
        ).toBe('rgba(29,111,49,1)');
        // // And the grid cell in ag-grid "Visualization 1" at "4", "2" has style "color" with value "rgba(193, 41, 47, 1)"
        await expectResult(
            'Grid cell at "4", "2" in "Visualization 1" should have color "rgba(193, 41, 47, 1)"',
            await gridAuthoring.getCSSProperty(agGridVisualization.getGridCellByPos(4, 2, 'Visualization 1'), 'color')
        ).toBe('rgba(193,41,47,1)');
        // // And the grid cell in ag-grid "Visualization 1" at "6", "16" has style "color" with value "rgba(193, 41, 47, 1)"
        await expectResult(
            'Grid cell at "6", "16" in "Visualization 1" should have color "rgba(193, 41, 47, 1)"',
            await gridAuthoring.getCSSProperty(agGridVisualization.getGridCellByPos(6, 16, 'Visualization 1'), 'color')
        ).toBe('rgba(193,41,47,1)');
        // // When I open the cell fill color picker
        await newFormatPanelForGrid.clickCellFillColorBtn();
        // // And I select the built-in color "#DEDEDE" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#DEDEDE');
        // // Then the grid cell in ag-grid "Visualization 1" at "2", "0" has style "background-color" with value "rgba(15, 96, 149, 0.2)"
        await expectResult(
            'Grid cell at "2", "0" in "Visualization 1" should have background-color "rgba(15, 96, 149, 0.2)"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(2, 0, 'Visualization 1'),
                'background-color'
            )
        ).toBe('rgba(15,96,149,0.2)');
        // // And the grid cell in ag-grid "Visualization 1" at "6", "2" has style "background-color" with value "rgba(222, 222, 222, 0.2)"
        await expectResult(
            'Grid cell at "6", "2" in "Visualization 1" should have background-color "rgba(222, 222, 222, 0.2)"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(6, 2, 'Visualization 1'),
                'background-color'
            )
        ).toBe('rgba(222,222,222,0.2)');
        // // And the grid cell in ag-grid "Visualization 1" at "2", "2" has style "background-color" with value "rgba(222, 222, 222, 0.2)"
        await expectResult(
            'Grid cell at "2", "2" in "Visualization 1" should have background-color "rgba(222, 222, 222, 0.2)"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(2, 2, 'Visualization 1'),
                'background-color'
            )
        ).toBe('rgba(222,222,222,0.2)');
        // // When I switch to Editor Panel tab
        await vizPanelForGrid.switchToEditorPanel();
        // // And I toggle totals from editor panel
        await ngmEditorPanel.editorPanelShortcutFunction('totals');
        // // Then the grid cell in ag-grid "Visualization 1" at "2", "0" has text "Total"
        await expectResult(
            'Grid cell in ag-grid "Visualization 1" at "2", "0" should have text "Total"',
            await agGridVisualization.getGridCellByPos(2, 0, 'Visualization 1').getText()
        ).toBe('Total');
        // // And the grid cell in ag-grid "Visualization 1" at "2", "1" has text "206398"
        await expectResult(
            'Grid cell in ag-grid "Visualization 1" at "2", "1" should have text "206398"',
            await agGridVisualization.getGridCellByPos(2, 1, 'Visualization 1').getText()
        ).toBe('206398');
        // // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // // And I select the grid segment "Subtotal Row Headers" from the pull down list
        await newFormatPanelForGrid.selectGridSegment('Subtotal Row Headers');
        // // When I change the font size to "12" by typing in the font size input field
        await newFormatPanelForGrid.setTextFontSize('12');
        // // Then the grid cell in ag-grid "Visualization 1" at "2", "0" has style "font-size" with value "16px"
        await expectResult(
            'Grid cell at "2", "0" in "Visualization 1" should have font-size "16px"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(2, 0, 'Visualization 1'),
                'font-size'
            )
        ).toBe('16px');
        // // When I click on Underline button from the Format Panel
        await textField.ClickOnFontStyleButtonInPanel('underline');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // // Then the grid cell in ag-grid "Visualization 1" at "2", "0" has style "text-decoration" with value "underline"
        await expectResult(
            'Grid cell at "2", "0" in "Visualization 1" should have text-decoration "underline"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(2, 0, 'Visualization 1'),
                'text-decoration'
            )
        ).toContain('underline');
        // // When I open the font color picker
        await newFormatPanelForGrid.clickFontColorBtn();
        // // And I switch the color picker to swatch mode
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');
        // // And I select the built-in color "#834FBD" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#834FBD');
        // // And I click to close the color picker
        await baseFormatPanelReact.dismissColorPicker();
        // // Then the grid cell in ag-grid "Visualization 1" at "2", "0" has style "color" with value "rgba(131, 79, 189, 1)"
        await expectResult(
            'Grid cell at "2", "0" in "Visualization 1" should have color "rgba(131, 79, 189, 1)"',
            await gridAuthoring.getCSSProperty(agGridVisualization.getGridCellByPos(2, 0, 'Visualization 1'), 'color')
        ).toBe('rgba(131,79,189,1)');
        // // When I set the text alignment to "right"
        await newFormatPanelForGrid.selectFontAlign('right');
        // // Then the grid cell in ag-grid "Visualization 1" at "2", "0" has style "text-align" with value "right"
        await expectResult(
            'Grid cell at "2", "0" in "Visualization 1" should have text-align "right"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(2, 0, 'Visualization 1'),
                'text-align'
            )
        ).toBe('right');
        // // When I select the grid segment "Subtotal Values" from the pull down list
        await newFormatPanelForGrid.selectGridSegment('Subtotal Values');
        // // And I change the font to "Monoton" from the font pull down list
        await newFormatPanelForGrid.selectTextFont('Monoton');
        // // Then the grid cell in ag-grid "Visualization 1" at "2", "1" has style "font-family" with value "Monoton"
        await expectResult(
            'Grid cell in ag-grid "Visualization 1" at "2", "1" should have font-family "Monoton"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(2, 1, 'Visualization 1'),
                'font-family'
            )
        ).toBe('monoton');
        // // And the grid cell in ag-grid "Visualization 1" at "2", "17" has style "font-family" with value "Monoton"
        await expectResult(
            'Grid cell in ag-grid "Visualization 1" at "2", "17" should have font-family "Monoton"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(2, 17, 'Visualization 1'),
                'font-family'
            )
        ).toBe('monoton');
        // // When I click on Italic button from the Format Panel
        await textField.ClickOnFontStyleButtonInPanel('italic');
        // // Then the grid cell in ag-grid "Visualization 1" at "2", "1" has style "font-style" with value "italic"
        await expectResult(
            'Grid cell at "2", "1" in "Visualization 1" should have font-style "italic"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(2, 1, 'Visualization 1'),
                'font-style'
            )
        ).toBe('italic');
        // // And the grid cell in ag-grid "Visualization 1" at "2", "17" has style "font-style" with value "italic"
        await expectResult(
            'Grid cell at "2", "17" in "Visualization 1" should have font-style "italic"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(2, 17, 'Visualization 1'),
                'font-style'
            )
        ).toBe('italic');
        // // When I set the text vertical alignment to "bottom"
        await newFormatPanelForGrid.selectVerticalAlign('bottom');
        // // Then the grid cell in ag-grid "Visualization 1" at "2", "1" has style "vertical-align" with value "bottom"
        await expectResult(
            'Grid cell at "2", "1" in "Visualization 1" should have vertical-align "bottom"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(2, 1, 'Visualization 1'),
                'vertical-align'
            )
        ).toBe('bottom');
        // // And the grid cell in ag-grid "Visualization 1" at "2", "17" has style "vertical-align" with value "bottom"
        await expectResult(
            'Grid cell at "2", "17" in "Visualization 1" should have vertical-align "bottom"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(2, 17, 'Visualization 1'),
                'vertical-align'
            )
        ).toBe('bottom');
    });

    it('[TC89552] Creating ag-grid with enabled banding | Regression', async () => {
        // # Open/create dossier with modern grid visualization
        // When I create a new local dossier
        // Then The Dossier Editor is displayed
        await libraryPage.createNewDashboardByUrl({});
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then The Dossier Editor is displayed
        // await since('The Dossier Editor should be displayed').expect(dossierMojoEditor.isDisplayed()).toBe(true);
        // When I click on the Add New Data button
        await datasetsPanel.clickNewDataBtn();
        await browser.pause(10000);
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then The datasets panel should have dataset "airline-sample-data.xls" after 15 seconds
        await datasetsPanel.clickDataSourceByIndex(5); // Using Sample Files as data source
        await datasetsPanel.importSampleFiles([0]); // The 7th file in the list 'retail-sample-data.xls'

        // When I change visualization "Visualization 1" to "Grid (Modern)" from context menu
        await agGridVisualization.changeViz('Grid (Modern)', 'Visualization 1');
        // And I add "attribute" named "Origin Airport" from dataset "airline-sample-data.xls" to the current Viz by double click
        await datasetsPanel.addObjectToVizByDoubleClick('Origin Airport', 'attribute', 'airline-sample-data.xls');
        // Then The editor panel should have "attribute" named "Origin Airport" on "Rows" section
        await expectResult(
            'The editor panel should have attribute named Origin Airport on Rows section',
            await editorPanelForGrid.getObjectFromSection('Origin Airport', 'attribute', 'Rows').isDisplayed()
        ).toBe(true);
        // And I add "attribute" named "Airline Name" from dataset "airline-sample-data.xls" to the current Viz by double click
        await datasetsPanel.addObjectToVizByDoubleClick('Airline Name', 'attribute', 'airline-sample-data.xls');
        // And The editor panel should have "attribute" named "Airline Name" on "Rows" section
        await expectResult(
            'The editor panel should have attribute named Airline Name on Rows section',
            await editorPanelForGrid.getObjectFromSection('Airline Name', 'attribute', 'Rows').isDisplayed()
        ).toBe(true);
        // When I add a new column set to the ag-grid
        await agGridVisualization.addColumnSet();
        // And I drag "metric" named "Number of Flights" from dataset "airline-sample-data.xls" to Column Set "Column Set 1" in ag-grid
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ(
            'Number of Flights',
            'metric',
            'airline-sample-data.xls',
            'Column Set 1'
        );
        // Then The editor panel should have "metric" named "Number of Flights" on "Column Set 1" section
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await expectResult(
            'The editor panel should have "metric" named "Number of Flights" on "Column Set 1" section',
            await editorPanelForGrid.getObjectFromSection('Number of Flights', 'metric', 'Column Set 1').isDisplayed()
        ).toBe(true);
        // When I add a new column set to the ag-grid
        await agGridVisualization.addColumnSet();
        // And I drag "metric" named "Flights Delayed" from dataset "airline-sample-data.xls" to Column Set "Column Set 2" in ag-grid
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ(
            'Flights Delayed',
            'metric',
            'airline-sample-data.xls',
            'Column Set 2'
        );
        // Then The editor panel should have "metric" named "Flights Delayed" on "Column Set 2" section
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await expectResult(
            'The editor panel should have "metric" named "Flights Delayed" on "Column Set 2" section',
            await editorPanelForGrid.getObjectFromSection('Flights Delayed', 'metric', 'Column Set 2').isDisplayed()
        ).toBe(true);
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
        // I expand "Layout" section
        await newFormatPanelForGrid.expandLayoutSection();
        // I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
        // I click Enable Banding check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable banding');
        // When I expand the element at "2", "0" in outline mode from ag-grid "Visualization 1"
        const cellToExpand = await agGridVisualization.getGridCellByPos(2, 0, 'Visualization 1');
        await agGridVisualization.expandGroupCell(cellToExpand);
        // Then the grid cell in ag-grid "Visualization 1" at "3", "1" has style "background-color" with value "rgba(255, 255, 255, 1)"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "3", "1" should have style "background-color" with value "rgba(255, 255, 255, 1)"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(3, 1, 'Visualization 1'),
                'background-color'
            )
        ).toBe('rgba(255,255,255,1)');
        // And the grid cell in ag-grid "Visualization 1" at "3", "2" has style "background-color" with value "rgba(255, 255, 255, 1)"
        await expectResult(
            'The grid cell in ag-grid "Visualization 1" at "3", "2" should have style "background-color" with value "rgba(255, 255, 255, 1)"',
            await gridAuthoring.getCSSProperty(
                agGridVisualization.getGridCellByPos(3, 2, 'Visualization 1'),
                'background-color'
            )
        ).toBe('rgba(255,255,255,1)');
    });

    it('[TC71098_2] DE318237 Library modern grids do not "Fit to Container" after one click upgrade', async () => {
        // # Create new dossier with Modern Grid visualization
        // When I create a new local dossier
        // Then The Dossier Editor is displayed
        // # Open/create dossier with modern grid visualization
        // When I create a new local dossier
        // Then The Dossier Editor is displayed
        await libraryPage.createNewDashboardByUrl({});
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then The Dossier Editor is displayed
        // await since('The Dossier Editor should be displayed').expect(dossierMojoEditor.isDisplayed()).toBe(true);
        // When I click on the Add New Data button
        await datasetsPanel.clickNewDataBtn();
        await browser.pause(10000);
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then The datasets panel should have dataset "airline-sample-data.xls" after 15 seconds
        await datasetsPanel.clickDataSourceByIndex(5); // Using Sample Files as data source
        await datasetsPanel.importSampleFiles([0]);

        // When I change visualization "Visualization 1" to "Grid (Modern)" from context menu
        await agGridVisualization.changeViz('Grid (Modern)', 'Visualization 1', false);
        // And I add "attribute" named "Year" from dataset "airline-sample-data.xls" to the current Viz by double click
        await datasetsPanel.addObjectToVizByDoubleClick('Year', 'attribute', 'airline-sample-data.xls');
        // Then The editor panel should have "attribute" named "Year" on "Rows" section
        await expectResult(
            'The editor panel should have "attribute" named "Year" on "Rows" section',
            await editorPanelForGrid.getObjectFromSection('Year', 'attribute', 'Rows').isDisplayed()
        ).toBe(true);
        // And I add "attribute" named "Month" from dataset "airline-sample-data.xls" to the current Viz by double click
        await datasetsPanel.addObjectToVizByDoubleClick('Month', 'attribute', 'airline-sample-data.xls');
        // Then The editor panel should have "attribute" named "Month" on "Rows" section
        await expectResult(
            'The editor panel should have "attribute" named "Month" on "Rows" section',
            await editorPanelForGrid.getObjectFromSection('Month', 'attribute', 'Rows').isDisplayed()
        ).toBe(true);
        // And I add "attribute" named "Airline Name" from dataset "airline-sample-data.xls" to the current Viz by double click
        await datasetsPanel.addObjectToVizByDoubleClick('Airline Name', 'attribute', 'airline-sample-data.xls');
        // Then The editor panel should have "attribute" named "Airline Name" on "Rows" section
        await expectResult(
            'The editor panel should have "attribute" named "Airline Name" on "Rows" section',
            await editorPanelForGrid.getObjectFromSection('Airline Name', 'attribute', 'Rows').isDisplayed()
        ).toBe(true);
        // And I add "attribute" named "Origin Airport" from dataset "airline-sample-data.xls" to the current Viz by double click
        await datasetsPanel.addObjectToVizByDoubleClick('Origin Airport', 'attribute', 'airline-sample-data.xls');
        // Then The editor panel should have "attribute" named "Origin Airport" on "Rows" section
        await expectResult(
            'The editor panel should have "attribute" named "Origin Airport" on "Rows" section',
            await editorPanelForGrid.getObjectFromSection('Origin Airport', 'attribute', 'Rows').isDisplayed()
        ).toBe(true);
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I switch to microcharts tab in Format Panel
        await newFormatPanelForGrid.switchToTab('microcharts');
        // And I expand "Layout" section
        await newFormatPanelForGrid.clickSectionTitle('Layout');
        // And I click Lock Row Headers checkbox under Layout section
        await reportFormatPanel.clickCheckBoxForOption('Row headers', 'Lock headers');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then The option "Lock headers" in "Row headers" section is checked in Format Panel
        await expectResult(
            'The option "Lock headers" in "Row headers" section is checked in Format Panel',
            await reportFormatPanel.getCheckedCheckbox('Row headers', 'Lock headers').isDisplayed()
        ).toBe(true);
        // take screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC71098_2_1',
            'Modern Grid Fit to Container column width distributed proportionally to content'
        );
    });

    it('[TC71098_3] BCIN-3848 Some values will be cropped when "Fit to Content"', async () => {
        await resetDossierState({
            credentials: gridUser,
            dossier: AGGrid_FitToContent,
        });
        // Open dashboard by id: 83B23EC0E24C323BBC84199940E31B48
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Format Panel > AGGrid_FitToContent
        await libraryPage.openDossierById({
            projectId: AGGrid_FitToContent.project.id,
            dossierId: AGGrid_FitToContent.id,
        });
        await dossierPage.waitForDossierLoading();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Destination Manager Wrap Column Header' });
        await dossierPage.hidePageIndicator();
        // take screenshot for consumption mode
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Select Metric 1'),
            'TC71098_3_1',
            'Fit to Content Wrap Column Header collapse outline in consumption mode'
        );
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(0, 2, 'Select Metric 1'));
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Select Metric 1'),
            'TC71098_3_2',
            'Fit to Content Wrap Column Header expand outline in consumption mode'
        );
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Destination Manager Unwrap Column Header' });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Select Metric 1'),
            'TC71098_3_3',
            'Fit to Content unwrap column header collapse outline in consumption mode'
        );
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(0, 2, 'Select Metric 1'));
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Select Metric 1'),
            'TC71098_3_4',
            'Fit to Content unwrap column header expand outline in consumption mode'
        );

        // go to edit mode
        await dossierPage.clickEditIcon();
        await dossierPage.waitForDossierLoading();
        // take screenshot for edit mode
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Select Metric 1'),
            'TC71098_3_5',
            'Fit to Content unwrap column header collapse outline in edit mode'
        );
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(0, 2, 'Select Metric 1'));
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Select Metric 1'),
            'TC71098_3_6',
            'Fit to Content unwrap column header expand outline in edit mode'
        );
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Destination Manager Wrap Column Header' });
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Select Metric 1'),
            'TC71098_3_7',
            'Fit to Content wrap column header collapse outline in edit mode'
        );
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(0, 2, 'Select Metric 1'));
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Select Metric 1'),
            'TC71098_3_8',
            'Fit to Content wrap column header expand outline in edit mode'
        );

   });

   it('[TC71098_4] BCSA-2417 Grid Columns Disappear When Adjusting Width of Other Columns', async () => {
        // Open dashboard by id: 83B23EC0E24C323BBC84199940E31B48
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Format Panel > BCSA-2417
        await libraryPage.openDossierById({
            projectId: AGGrid_ColumnMissing.project.id,
            dossierId: AGGrid_ColumnMissing.id,
        });
        await dossierPage.waitForDossierLoading();
        await dossierPage.hidePageIndicator();
        await reset.resetIfEnabled();
        await since('Reset disable is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetDisabled())
            .toBe(true);
        // Take screenshot of column headers for initial state
        await takeScreenshotByElement(
            agGridVisualization.agGridHeader('Visualization 1'),
            'TC71098_4_1',
            'Initial state of column headers'
        );
        // resize Column "Last Year's Profit" to the right by 50 pixels
        await reportGridView.resizeColumnByMovingBorder('2', 50, 'right');
        await takeScreenshotByElement(
            agGridVisualization.agGridHeader('Visualization 1'),
            'TC71098_4_2',
            'State of column headers after resize'
        );

    });
    
});
