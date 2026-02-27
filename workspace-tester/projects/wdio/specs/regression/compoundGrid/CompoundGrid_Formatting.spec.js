import * as gridConstants from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { assertWithinTolerance } from '../../../utils/assertionHelper.js';

describe('Compound Grid Formatting Test', () => {
    let {
        loginPage,
        libraryPage,
        baseFormatPanel,
        newFormatPanelForGrid,
        gridAuthoring,
        baseFormatPanelReact,
        editorPanelForGrid,
        compoundGridVisualization,
        formatPanelForGridTitleCRV,
        vizPanelForGrid,
        contentsPanel,
        dossierAuthoringPage,
    } = browsers.pageObj1;
    const tolerance = 0.5;

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

    it('[TC62631_06] Format panel General Settings for Title and Container', async () => {
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.CompoundGridFormatting.id,
            projectId: gridConstants.CompoundGridFormatting.project.id,
        });

        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        await baseFormatPanelReact.switchToTitleAndContainerSection();
        await baseFormatPanelReact.changeContainerTitleFillColor({ color: '#C1292F' });

        await since('Title bar background should have #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getVisualizationTitleBarRoot('Visualization 1'),
                    'background-color'
                )
            )
            .toBe('rgba(193,41,47,1)');
        await baseFormatPanelReact.changeContainerFillColor({ color: '#5C388C' });
        await since('Grid background-color should have rgba(92, 56, 140, 1)')
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getGridContainer('Visualization 1'),
                    'background-color'
                )
            )
            .toBe('rgba(92,56,140,1)');
        await baseFormatPanelReact.changeContainerBorder('1 point solid');
        await since('Grid border should have #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getGridContainer('Visualization 1'),
                    'border-bottom-style'
                )
            )
            .toBe('solid');
        await baseFormatPanelReact.switchToGeneralSettingsTab();
        await newFormatPanelForGrid.expandSpacingSection();
        // await newFormatPanelForGrid.clickColumnSizeBtn(false);
        // await newFormatPanelForGrid.clickColumnSizeFitOption('Fit to Content');
        await newFormatPanelForGrid.clickColumnSizeFitOption('Fit to Content', false);
        // the width should be within 0.5 px difference
        const expectedWidth = 54;
        const actualWidth = await gridAuthoring.getCSSProperty(
            gridAuthoring.getGridCellByPosition(3, 3, 'Visualization 1'),
            'width'
        );
        await since(`Grid cell width within tolerance  ${tolerance} should be #{expected} instead we have #{actual}`)
            .expect(assertWithinTolerance({ actual: actualWidth, expected: expectedWidth, tolerance }))
            .toBe(true);
        await newFormatPanelForGrid.expandTemplateSection();
        await newFormatPanelForGrid.selectGridTemplateColor('Emerald');
        await since(
            'Grid cell at "1", "1" in "Visualization 1" should have border-bottom-color #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(1, 1, 'Visualization 1'),
                    'border-bottom-color'
                )
            )
            .toBe('rgba(56,174,111,1)');
        await newFormatPanelForGrid.switchToTextFormatTab();
        await newFormatPanelForGrid.changeGridElement('Column Headers');
        await newFormatPanelForGrid.selectTextFont('Noto Sans');
        await since(
            'Grid cell at "1", "1" in "Visualization 1" should have font-family #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(1, 1, 'Visualization 1'),
                    'font-family'
                )
            )
            .toBe('noto sans');
        await since(
            'Grid cell at "1", "5" in "Visualization 1" should have font-family #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(1, 5, 'Visualization 1'),
                    'font-family'
                )
            )
            .toBe('noto sans');
        await newFormatPanelForGrid.selectFontStyle('bold');
        await since(
            'Grid cell at "1", "1" in "Visualization 1" should have font-weight #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(1, 1, 'Visualization 1'),
                    'font-weight'
                )
            )
            .toBe(400);
        await newFormatPanelForGrid.selectGridColumns('Column Set 2');
        await newFormatPanelForGrid.selectTextFont('Monoton');
        await newFormatPanelForGrid.selectFontStyle('italic');
        await takeScreenshotByElement(
            gridAuthoring.getGridContainer('Visualization 1'),
            'TC62631_06',
            'selectFontStyle_Monoton_italic_ColumnSet2',
            {
                tolerance: 0.4,
            }
        );
        await newFormatPanelForGrid.changeGridElement('Row Headers');
        await newFormatPanelForGrid.selectTextFont('Monoton');
        await newFormatPanelForGrid.selectFontStyle('italic');
        await takeScreenshotByElement(
            gridAuthoring.getGridContainer('Visualization 1'),
            'TC62631_06',
            'selectFontStyle_Monoton_italic_RowHeaders',
            {
                tolerance: 0.4,
            }
        );
        await newFormatPanelForGrid.changeGridElement('Values');
        await newFormatPanelForGrid.selectTextFont('Noto Sans TC');
        await newFormatPanelForGrid.changeCellsFillColor('#1D6F31');
        await takeScreenshotByElement(
            gridAuthoring.getGridContainer('Visualization 1'),
            'TC62631_06',
            'changeCellsFillColor_ComicSansMS_#1D6F31_Values',
            {
                tolerance: 0.4,
            }
        );
        await newFormatPanelForGrid.selectGridColumns('Column Set 1');
        await newFormatPanelForGrid.selectTextFont('Inter');
        await newFormatPanelForGrid.selectFontStyle('underline');
        await takeScreenshotByElement(
            gridAuthoring.getGridContainer('Visualization 1'),
            'TC62631_06',
            'selectFontStyle_Inter_underline_ColumnSet1',
            {
                tolerance: 0.4,
            }
        );
        await gridAuthoring.switchToEditorPanel();
        await editorPanelForGrid.removeFromDropZone('Cost', 'metric');
        await gridAuthoring.dragDropOperations.dragMetricToDropZoneBelowObject({
            objectName: 'Units Available',
            datasetName: 'retail-sample-data.xls',
            dropZone: 'Column Set 1',
            belowObject: 'Revenue',
        });
        await since(
            'Grid cell in visualization "Visualization 1" at "2", "3" should have font-family #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(2, 3, 'Visualization 1'),
                    'font-family'
                )
            )
            .toBe('inter');
        await since(
            'Grid cell in visualization "Visualization 1" at "2", "3" should have text-decoration #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(2, 3, 'Visualization 1'),
                    'text-decoration-line'
                )
            )
            .toContain('underline');
        await gridAuthoring.deleteColumnSet('Column Set 1');
        await since(
            'Grid cell in visualization "Visualization 1" at "2", "2" should have font-family #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(2, 2, 'Visualization 1'),
                    'font-family'
                )
            )
            .toBe('monoton');
        await since(
            'Grid cell in visualization "Visualization 1" at "2", "3" should have font-family #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(2, 3, 'Visualization 1'),
                    'font-family'
                )
            )
            .toBe('noto sans tc');
        await since(
            'Grid cell in visualization "Visualization 1" at "2", "3" should have text-decoration #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(2, 3, 'Visualization 1'),
                    'text-decoration'
                )
            )
            .toContain('none');
    });

    it('[TC64389_01] Format panel (font) Column Headers', async () => {
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.CompoundGridFormatting2.id,
            projectId: gridConstants.CompoundGridFormatting2.project.id,
        });
        compoundGridVisualization.initializeRowAndColumnCount(1, 2);
        compoundGridVisualization.initializeColumnSets([1, 12]);
        // # Ensure we're on Column Headers in the Format panel
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        await newFormatPanelForGrid.switchToTextFormatTab();
        // When I select "Column Headers" from target pulldown
        await newFormatPanelForGrid.changeGridElement('Column Headers');
        // When I select "Column Set 1" from column set pulldown
        await newFormatPanelForGrid.selectGridColumns('Column Set 1');
        // Then column set "0" is selected
        compoundGridVisualization.columnSetIndex = parseInt(0, 10);;

    
        // # Test column header font
        // When I change the font to "MONOTON"
        await newFormatPanelForGrid.selectTextFont('Monoton');
        // Then the cell's "font-family" should include "MONOTON"
        await since('The cell font-family #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    compoundGridVisualization.titleCell,
                    'font-family'
                )
            )
            .toContain('monoton');
        // When I change the font size to "28"
        await newFormatPanelForGrid.setTextFontSize('28');
        // Then the cell's "font-size" should be "37.3333px"
        await since('The cell font-size #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    compoundGridVisualization.titleCell,
                    'font-size'
                )
            )
            .toBe('37.3333px');
        // When I select the font size "12"
        await newFormatPanelForGrid.setTextFontSize('12');
        // Then the cell's "font-size" should be "16px"
        await since('The cell font-size #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    compoundGridVisualization.titleCell,
                    'font-size'
                )
            )
            .toBe('16px');
        // When I select bold on the font
        await newFormatPanelForGrid.selectFontStyle('bold');
        // Then the cell's "font-weight" should be "400"
        await since('The cell font-weight #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    compoundGridVisualization.titleCell,
                    'font-weight'
                )
            )
            .toBe(400);
        // When I select italic on the font
        await newFormatPanelForGrid.selectFontStyle('italic');
        // Then the cell's "font-style" should be "italic"
        await since('The cell font-style #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    compoundGridVisualization.titleCell,
                    'font-style'
                )
            )
            .toBe('italic');
        // When I select underline on the font
        await newFormatPanelForGrid.selectFontStyle('underline');
        // Then the cell's "text-decoration-line" should include "underline"
        await since('The cell text-decoration-line #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    compoundGridVisualization.titleCell,
                    'text-decoration-line'
                )
            )
            .toBe('underline');
        // When I select strikethrough on the font
        await newFormatPanelForGrid.selectFontStyle('underscore');
        // Then the cell's "text-decoration-line" should include "line-through"
        await since('The cell text-decoration-line #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    compoundGridVisualization.titleCell,
                    'text-decoration-line'
                )
            )
            .toBe('underline line-through');
    
        // # Test changing the font color
        await newFormatPanelForGrid.clickFontColorBtn();
        await newFormatPanelForGrid.clickBuiltInColor('#83C962');
        await baseFormatPanelReact.dismissColorPicker();
        await since('The cell color #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    compoundGridVisualization.titleCell,
                    'color'
                )
            )
            .toBe('rgba(131,201,98,1)');
    
        // # Test second column set
        // When I select "Column Set 2" from column set pulldown
        await newFormatPanelForGrid.selectGridColumns('Column Set 2');
        // Then column set "1" is selected
        compoundGridVisualization.columnSetIndex = parseInt(1, 10);

        // # Test column header font
        // When I change the font to "Mulish"
        await newFormatPanelForGrid.selectTextFont('Mulish');
        // Then the cell's "font-family" should include "mulish"
        await since('The cell font-family #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    compoundGridVisualization.columnHeaderCell,
                    'font-family'
                )
            )
            .toContain('mulish');
    
        // When I select bold on the font
        await newFormatPanelForGrid.selectFontStyle('bold');
        // Then the cell's "font-weight" should be "400"
        await since('The cell font-weight #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    compoundGridVisualization.columnHeaderCell,
                    'font-weight'
                )
            )
            .toBe(400);
        // When I select bold on the font
        await newFormatPanelForGrid.selectFontStyle('bold');
        // Then the cell's "font-weight" should be "700"
        await since('The cell font-weight #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    compoundGridVisualization.columnHeaderCell,
                    'font-weight'
                )
            )
            .toBe(700);
        
        // # Test changing the font color
        // When I change the column header font color to a built-in color "Orange"
        await newFormatPanelForGrid.clickFontColorBtn();
        await newFormatPanelForGrid.clickBuiltInColor('#159B98');
        await baseFormatPanelReact.dismissColorPicker();
        await since('The cell color #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    compoundGridVisualization.columnHeaderCell,
                    'color'
                )
            )
            .toBe('rgba(21,155,152,1)');
    });

    it('[TC64389_02] Format panel (fill color) Column Headers', async () => {
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.CompoundGridFormatting2.id,
            projectId: gridConstants.CompoundGridFormatting2.project.id,
        });
        compoundGridVisualization.initializeRowAndColumnCount(1, 2);
        compoundGridVisualization.initializeColumnSets([1, 12]);
        // # Ensure we're on Column Headers in the Format panel
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        await newFormatPanelForGrid.switchToTextFormatTab();
        // When I select "Column Headers" from target pulldown
        await newFormatPanelForGrid.changeGridElement('Column Headers');
        // When I select "Column Set 1" from column set pulldown
        await newFormatPanelForGrid.selectGridColumns('Column Set 1');
        // Then column set "0" is selected
        compoundGridVisualization.columnSetIndex = parseInt(0, 10);

        // # Test fill colors on column headers
        // When I select built-in cell fill color "Yellow"
        await newFormatPanelForGrid.changeCellsFillColor('#159B98');
        await since('The cell background-color #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    compoundGridVisualization.titleCell,
                    'background-color'
                )
            )
            .toBe('rgba(21,155,152,1)');
        // # Test second column set
        // When I select "Column Set 2" from column set pulldown
        await newFormatPanelForGrid.selectGridColumns('Column Set 2');
        // Then column set "1" is selected
        compoundGridVisualization.columnSetIndex = parseInt(1, 10);

        await newFormatPanelForGrid.changeCellsFillColor('#83C962');
        await since('The cell background-color #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    compoundGridVisualization.columnHeaderCell,
                    'background-color'
                )
            )
            .toBe('rgba(131,201,98,1)');
    });

    it('[TC64389_03] Format panel (vertical and horizontal lines) Column Headers', async () => {
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.CompoundGridFormatting2.id,
            projectId: gridConstants.CompoundGridFormatting2.project.id,
        });
        compoundGridVisualization.initializeRowAndColumnCount(1, 2);
        compoundGridVisualization.initializeColumnSets([1, 12]);
        // # Ensure we're on Column Headers in the Format panel
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        await newFormatPanelForGrid.switchToTextFormatTab();
        // When I select "Column Headers" from target pulldown
        await newFormatPanelForGrid.changeGridElement('Column Headers');
        // When I select "Column Set 1" from column set pulldown
        await newFormatPanelForGrid.selectGridColumns('Column Set 1');
        // Then column set "0" is selected
        compoundGridVisualization.columnSetIndex = parseInt(0, 10);

        // # Test horizontal line styles on column headers
        // When I select the horizontal line style "Dashed"
        await formatPanelForGridTitleCRV.selectHorizontalLinesStyleButton();
        await formatPanelForGridTitleCRV.selectLineStyle('1 point dashed');
        // Then the cell's "border-bottom-style" should be "dashed"
        await since('The cell border-bottom-style #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    compoundGridVisualization.titleCell,
                    'border-bottom-style'
                )
            )
            .toBe('dashed');
        // When I select the horizontal line style "Dotted"
        await formatPanelForGridTitleCRV.selectHorizontalLinesStyleButton();
        await formatPanelForGridTitleCRV.selectLineStyle('1 point dotted');
        // Then the cell's "border-bottom-style" should be "dotted"
        await since('The cell border-bottom-style #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    compoundGridVisualization.titleCell,
                    'border-bottom-style'
                )
            )
            .toBe('dotted');
        // When I select the horizontal line style "Thin"
        await formatPanelForGridTitleCRV.selectHorizontalLinesStyleButton();
        await formatPanelForGridTitleCRV.selectLineStyle('1 point solid');
        // Then the cell's "border-bottom-style" should be "solid"
        await since('The cell border-bottom-style #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    compoundGridVisualization.titleCell,
                    'border-bottom-style'
                )
            )
            .toBe('solid');
        // When I select the horizontal line style "Thick"
        await formatPanelForGridTitleCRV.selectHorizontalLinesStyleButton();
        await formatPanelForGridTitleCRV.selectLineStyle('2 point solid');
        // Then the cell's "border-bottom-style" should be "solid"
        await since('The cell border-bottom-style #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    compoundGridVisualization.titleCell,
                    'border-bottom-style'
                )
            )
            .toBe('solid');
        // When I select built-in horizontal lines fill color "Violet"
        await formatPanelForGridTitleCRV.selectHorizontalLinesColorButton();
        await newFormatPanelForGrid.clickBuiltInColor('#159B98');
        await baseFormatPanelReact.dismissColorPicker();
        await since('The cell color #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    compoundGridVisualization.titleCell,
                    'border-bottom-color'
                )
            )
            .toBe('rgba(21,155,152,1)');
    
        // # Test vertical line styles on column headers
        await newFormatPanelForGrid.selectCellBorderOrientation('Vertical Lines');
        // When I select the vertical line style "Dashed"
        await formatPanelForGridTitleCRV.selectVerticalLinesStyleButton();
        await formatPanelForGridTitleCRV.selectLineStyle('1 point dashed');
        // Then the cell's "border-right-style" should be "dashed"
        await since('The cell border-right-style #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    compoundGridVisualization.titleCell,
                    'border-right-style'
                )
            )
            .toBe('dashed');

        // When I select the vertical line style "Dotted"
        await formatPanelForGridTitleCRV.selectVerticalLinesStyleButton();
        await formatPanelForGridTitleCRV.selectLineStyle('1 point dotted');
        // Then the cell's "border-right-style" should be "dotted"
        await since('The cell border-right-style #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    compoundGridVisualization.titleCell,
                    'border-right-style'
                )
            )
            .toBe('dotted');

        await formatPanelForGridTitleCRV.selectVerticalLinesStyleButton();
        await formatPanelForGridTitleCRV.selectLineStyle('1 point solid');
        // Then the cell's "border-right-style" should be "solid"
        await since('The cell border-right-style #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    compoundGridVisualization.titleCell,
                    'border-right-style'
                )
            )
            .toBe('solid');
        // When I select the vertical line style "Thick"
        await formatPanelForGridTitleCRV.selectVerticalLinesStyleButton();
        await formatPanelForGridTitleCRV.selectLineStyle('2 point solid');
        // Then the cell's "border-right-style" should be "solid"
        await since('The cell border-right-style #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    compoundGridVisualization.titleCell,
                    'border-right-style'
                )
            )
            .toBe('solid');
        await formatPanelForGridTitleCRV.selectVerticalLinesColorButton();
        await newFormatPanelForGrid.clickBuiltInColor('#83C962');
        await baseFormatPanelReact.dismissColorPicker();
        await since('The cell color #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    compoundGridVisualization.titleCell,
                    'border-right-color'
                )
            )
            .toBe('rgba(131,201,98,1)');
    });

    it('[TC64389_04] Format panel (alignment) Column Headers', async () => {
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.CompoundGridFormatting2.id,
            projectId: gridConstants.CompoundGridFormatting2.project.id,
        });
        compoundGridVisualization.initializeRowAndColumnCount(1, 2);
        compoundGridVisualization.initializeColumnSets([1, 12]);
        // # Ensure we're on Column Headers in the Format panel
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        await newFormatPanelForGrid.switchToTextFormatTab();
        // When I select "Column Headers" from target pulldown
        await newFormatPanelForGrid.changeGridElement('Column Headers');
        // When I select "Column Set 1" from column set pulldown
        await newFormatPanelForGrid.selectGridColumns('Column Set 1');
        // Then column set "0" is selected
        compoundGridVisualization.columnSetIndex = parseInt(0, 10);

        // # Test text alignment on column headers
        // When I select the text alignment "center"
        await formatPanelForGridTitleCRV.selectTextAlign('center');
        // Then the cell's "text-align" should be "center"
        await since('The cell text-align #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    compoundGridVisualization.titleCell,
                    'text-align'
                )
            )
            .toBe('center');
        // When I select the text alignment "right"
        await formatPanelForGridTitleCRV.selectTextAlign('right');
        // Then the cell's "text-align" should be "right"
        await since('The cell text-align #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    compoundGridVisualization.titleCell,
                    'text-align'
                )
            )
            .toBe('right');
        // When I select the text alignment "justify"
        await formatPanelForGridTitleCRV.selectTextAlign('justify');
        // Then the cell's "text-align" should be "justify"
        await since('The cell text-align #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    compoundGridVisualization.titleCell,
                    'text-align'
                )
            )
            .toBe('justify');
        // When I select the text alignment "left"
        await formatPanelForGridTitleCRV.selectTextAlign('left');
        // Then the cell's "text-align" should be "left"
        await since('The cell text-align #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    compoundGridVisualization.titleCell,
                    'text-align'
                )
            )
            .toBe('left');
    
        // # Test cell alignment on column headers
        // When I select the cell alignment "top"
        await formatPanelForGridTitleCRV.selectCellAlign('top');
        // Then the cell's "vertical-align" should be "top"
        await since('The cell vertical-align #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    compoundGridVisualization.titleCell,
                    'vertical-align'
                )
            )
            .toBe('top');
        
        // When I select the cell alignment "middle"
        await formatPanelForGridTitleCRV.selectCellAlign('middle');
        // Then the cell's "vertical-align" should be "middle"
        await since('The cell vertical-align #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    compoundGridVisualization.titleCell,
                    'vertical-align'
                )
            )
            .toBe('middle');
        // When I select the cell alignment "bottom"
        await formatPanelForGridTitleCRV.selectCellAlign('bottom');
        // Then the cell's "vertical-align" should be "bottom"
        await since('The cell vertical-align #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    compoundGridVisualization.titleCell,
                    'vertical-align'
                )
            )
            .toBe('bottom');
    });

    it('[TC64389_05] Format panel (text-wrap) Column Headers', async () => {
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.CompoundGridFormatting2.id,
            projectId: gridConstants.CompoundGridFormatting2.project.id,
        });
        compoundGridVisualization.initializeRowAndColumnCount(1, 2);
        compoundGridVisualization.initializeColumnSets([1, 12]);
        // # Ensure we're on Column Headers in the Format panel
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        await newFormatPanelForGrid.switchToTextFormatTab();
        // When I select "Column Headers" from target pulldown
        await newFormatPanelForGrid.changeGridElement('Column Headers');
        // When I select "Column Set 1" from column set pulldown
        await newFormatPanelForGrid.selectGridColumns('Column Set 1');
        // Then column set "0" is selected
        compoundGridVisualization.columnSetIndex = parseInt(0, 10);

        // # Test changing wrap text option on column headers
        // When I select the wrap text checkbox
        await formatPanelForGridTitleCRV.selectWrapTextCheckbox();
        // Then the cell's "text-wrap-mode" should be "nowrap"
        await since('The cell text-wrap-mode #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    compoundGridVisualization.titleCell,
                    'text-wrap-mode'
                )
            )
            .toBe('nowrap');
      
        // When I select the wrap text checkbox
        await formatPanelForGridTitleCRV.selectWrapTextCheckbox();
        // Then the cell's "text-wrap-mode" should be "normal"
        await since('The cell text-wrap-mode #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    compoundGridVisualization.titleCell,
                    'text-wrap-mode'
                )
            )
            .toBe('wrap');
    });

    it('[TC64389_06] Regression Test for Compound Grid Column Resize', async () => {
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.CompoundGridResize.id,
            projectId: gridConstants.CompoundGridResize.project.id,
        });
        // # Test Chapter 1: "Outline Mode with Merged Headers" for Column Resize by cursor and Format Panel
        // Then Page "Outline Mode with Merged Headers" in chapter "Chapter 1" is the current page
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Outline Mode with Merged Headers' });
        // When I resize column 3 in grid visualization "Visualization 1" 90 pixels to the "right"
        await vizPanelForGrid.resizeColumnByMovingBorder(3, 90, 'right', 'Visualization 1');

        let origColumnWidth = parseInt(await (vizPanelForGrid.getGridCellStyleByPosition(1, 3, 'Visualization 1', 'width')));
        await vizPanelForGrid.resizeColumnByMovingBorder(3, 90, 'right', 'Visualization 1');
        // Then Column 3 is 90 pixels "more" in grid visualization "Visualization 1"
        let actualColumnWidth = parseFloat((await (await vizPanelForGrid.getGridCellStyleByPosition(1, 3, 'Visualization 1', 'width'))).replace('px', ''));
        let expectedColumnWidth = origColumnWidth + 90;
        await since(`Then Column 3 is 90 pixels "more", should be ${expectedColumnWidth}, actual ${actualColumnWidth}`)
            .expect(assertWithinTolerance({ actual: actualColumnWidth, expected: expectedColumnWidth, tolerance: 1 }))
            .toBe(true);
        // When I resize column 3 in grid visualization "Visualization 1" 60 pixels to the "left"
        let origColumnWidth2 = parseInt(await (vizPanelForGrid.getGridCellStyleByPosition(1, 3, 'Visualization 1', 'width')));
        await vizPanelForGrid.resizeColumnByMovingBorder(3, 60, 'left', 'Visualization 1');
        // Then Column 3 is 60 pixels "less" in grid visualization "Visualization 1"
        let actualColumnWidth2 = parseFloat((await (await vizPanelForGrid.getGridCellStyleByPosition(1, 3, 'Visualization 1', 'width'))).replace('px', ''));
        let expectedColumnWidth2 = origColumnWidth2 - 60;
        await since(`Then Column 3 is 60 pixels "less", should be ${expectedColumnWidth2}, actual ${actualColumnWidth2}`)
            .expect(assertWithinTolerance({ actual: actualColumnWidth2, expected: expectedColumnWidth2, tolerance: 1 }))
            .toBe(true);

        // When I switch to the General Settings section on new format panel
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        await newFormatPanelForGrid.switchToGridTab();
        // And I expand "Spacing" section
        await newFormatPanelForGrid.expandSpacingSection();
        // And I select "small" cell padding under Spacing section
        await newFormatPanelForGrid.selectCellPadding('small');
        // Then the grid cell in visualization "Visualization 1" at "6", "1" has style "padding" with value "3.06667px 6px"
        await since(
            'The grid cell in visualization "Visualization 1" at "6", "1" has style "padding" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('6', '1', 'Visualization 1').getCSSProperty('padding'))
                    .value
            )
            .toContain('3.06667px 6px');
        // When I select "medium" cell padding under Spacing section
        await newFormatPanelForGrid.selectCellPadding('medium');
        // Then the grid cell in visualization "Visualization 1" at "6", "1" has style "padding" with value "6.93333px 14px"
        await since(
            'The grid cell in visualization "Visualization 1" at "6", "1" has style "padding" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('6', '1', 'Visualization 1').getCSSProperty('padding'))
                    .value
            )
            .toContain('6.93333px 14px');
        // When I select "large" cell padding under Spacing section
        await newFormatPanelForGrid.selectCellPadding('large');
        // Then the grid cell in visualization "Visualization 1" at "6", "1" has style "padding" with value "8px 16px"
        await since(
            'The grid cell in visualization "Visualization 1" at "6", "1" has style "padding" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('6', '1', 'Visualization 1').getCSSProperty('padding'))
                    .value
            )
            .toContain('8px 16px');
        // When I change grid column size fit to "Fit to Content" under Spacing section
        await newFormatPanelForGrid.clickColumnSizeFitOption('Fit to Content', false);
        // Then the grid cell in visualization "Visualization 1" at "6", "1" has style "width" with value "49.12px"
        await since(
            'The grid cell in visualization "Visualization 1" at "6", "1" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('6', '1', 'Visualization 1').getCSSProperty('width'))
                    .value
            )
            .toContain('49.');
        // When I change grid column size fit to "Fixed" under Spacing section
        await newFormatPanelForGrid.clickColumnSizeFitOption('Fixed', false);
        // And I change grid column size target to "All columns" under Spacing section
        await newFormatPanelForGrid.clickColumnSizeTargetBtn();
        await newFormatPanelForGrid.clickColumnSizeTargetOption('All columns');
        // And I change grid column size fixed inches to "2.5" under Spacing section
        await newFormatPanelForGrid.setColumnSizeFixedInches('2.5');
        // Then the grid cell in visualization "Visualization 1" at "6", "1" has style "width" with value "208px"   
        await since(
            'The grid cell in visualization "Visualization 1" at "6", "1" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('6', '1', 'Visualization 1').getCSSProperty('width'))
                    .value
            )
            .toBe('208px');
        // When I change grid column size fit to "Fit to Container" under Spacing section
        await newFormatPanelForGrid.clickColumnSizeFitOption('Fit to Container', false);
        // Then the grid cell in visualization "Visualization 1" at "6", "1" has style "width" with value "49.12px"
        await since(
            'The grid cell in visualization "Visualization 1" at "6", "1" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('6', '1', 'Visualization 1').getCSSProperty('width'))
                    .value
            )
            .toContain('49.');
        // When I change grid row size fit to "Fixed" under Spacing section
        await newFormatPanelForGrid.clickRowSizeBtn(false);
        await newFormatPanelForGrid.clickRowSizeFitOption('Fixed');
        // And I change grid row size fixed inches to "0.5" under Spacing section
        await newFormatPanelForGrid.setRowSizeFixedInches('0.5');
        // Then the grid cell in visualization "Visualization 1" at "6", "1" has style "height" with value "31px"
        await since(
            'The grid cell in visualization "Visualization 1" at "6", "1" has style "height" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('6', '1', 'Visualization 1').getCSSProperty('height'))
                    .value
            )
            .toBe('31px');
        // When I change grid row size fit to "Fit to Content" under Spacing section
        await newFormatPanelForGrid.clickRowSizeBtn(false);
        await newFormatPanelForGrid.clickRowSizeFitOption('Fit to Content');
        // Then the grid cell in visualization "Visualization 1" at "6", "1" has style "height" with value "27.72px"
        await since(
            'The grid cell in visualization "Visualization 1" at "6", "1" has style "height" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('6', '1', 'Visualization 1').getCSSProperty('height'))
                    .value
            )
            .toBe('27.7188px');

                // # Test Chapter 2: "Merged Headers" for Column Resize by cursor and Format Panel, also include Undo/Redo, Pause Mode.
        // When I switch to page "Merged Headers" in chapter "Chapter 2" from contents panel
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Merged Headers' });
        // When I resize column 1 in grid visualization "Visualization 1" 90 pixels to the "right"
        let origColumnWidth3 = parseInt(await (vizPanelForGrid.getGridCellStyleByPosition(1, 1, 'Visualization 1', 'width')));
        await vizPanelForGrid.resizeColumnByMovingBorder(1, 90, 'right', 'Visualization 1');
        // Then Column 1 is 90 pixels "more" in grid visualization "Visualization 1"
        let actualColumnWidth3 = parseFloat((await (await vizPanelForGrid.getGridCellStyleByPosition(1, 1, 'Visualization 1', 'width'))).replace('px', ''));
        let expectedColumnWidth3 = origColumnWidth3 + 90;
        await since(`Then Column 1 is 90 pixels "more", should be ${expectedColumnWidth3}, actual ${actualColumnWidth3}`)
            .expect(assertWithinTolerance({ actual: actualColumnWidth3, expected: expectedColumnWidth3, tolerance: 1 }))
            .toBe(true);
        // When I resize column 1 in grid visualization "Visualization 1" 60 pixels to the "left"
        let origColumnWidth4 = parseInt(await (vizPanelForGrid.getGridCellStyleByPosition(1, 1, 'Visualization 1', 'width')));
        await vizPanelForGrid.resizeColumnByMovingBorder(1, 60, 'left', 'Visualization 1');
        // Then Column 1 is 60 pixels "less" in grid visualization "Visualization 1"
        let actualColumnWidth4 = parseFloat((await (await vizPanelForGrid.getGridCellStyleByPosition(1, 1, 'Visualization 1', 'width'))).replace('px', ''));
        let expectedColumnWidth4 = origColumnWidth4 - 60;
        await since(`Then Column 1 is 60 pixels "less", should be ${expectedColumnWidth4}, actual ${actualColumnWidth4}`)
            .expect(assertWithinTolerance({ actual: actualColumnWidth4, expected: expectedColumnWidth4, tolerance: 1 }))
            .toBe(true);
        let origColumnWidth5 = parseInt(await (vizPanelForGrid.getGridCellStyleByPosition(1, 6, 'Visualization 1', 'width')));
        await vizPanelForGrid.resizeColumnByMovingBorder(6, 100, 'right', 'Visualization 1');
        let actualColumnWidth5 = parseFloat((await (await vizPanelForGrid.getGridCellStyleByPosition(1, 6, 'Visualization 1', 'width'))).replace('px', ''));
        let expectedColumnWidth5 = origColumnWidth5 + 100;
        // Then Column 6 is 100 pixels "more" in grid visualization "Visualization 1"
        await since(`Then Column 6 is 100 pixels "more", should be ${expectedColumnWidth5}, actual ${actualColumnWidth5}`)
            .expect(assertWithinTolerance({ actual: actualColumnWidth5, expected: expectedColumnWidth5, tolerance: 1 }))
            .toBe(true);
        // When I resize column 6 in grid visualization "Visualization 1" 80 pixels to the "left"
        let origColumnWidth6 = parseInt(await (vizPanelForGrid.getGridCellStyleByPosition(1, 6, 'Visualization 1', 'width')));
        // Then Column 6 is 80 pixels "less" in grid visualization "Visualization 1"
        await vizPanelForGrid.resizeColumnByMovingBorder(6, 80, 'left', 'Visualization 1');
        let actualColumnWidth6 = parseFloat((await (await vizPanelForGrid.getGridCellStyleByPosition(1, 6, 'Visualization 1', 'width'))).replace('px', ''));
        let expectedColumnWidth6 = origColumnWidth6 - 80;
        await since(`Then Column 6 is 80 pixels "less", should be ${expectedColumnWidth6}, actual ${actualColumnWidth6}`)
            .expect(assertWithinTolerance({ actual: actualColumnWidth6, expected: expectedColumnWidth6, tolerance: 1 }))
            .toBe(true);

        // When I switch to the General Settings section on new format panel
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        await newFormatPanelForGrid.switchToGridTab();
        // And I expand "Spacing" section
        await newFormatPanelForGrid.expandSpacingSection();
        // When I select "small" cell padding under Spacing section
        await newFormatPanelForGrid.selectCellPadding('small');
        // Then the grid cell in visualization "Visualization 1" at "4", "1" has style "padding" with value "3.06667px 6px"
        await since(
            'The grid cell in visualization "Visualization 1" at "4", "1" has style "padding" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('4', '1', 'Visualization 1').getCSSProperty('padding'))
                    .value
            )
            .toBe('3.06667px 6px');
        // When I select "medium" cell padding under Spacing section
        await newFormatPanelForGrid.selectCellPadding('medium');
        // Then the grid cell in visualization "Visualization 1" at "4", "1" has style "padding" with value "6.93333px 14px"
        await since(
            'The grid cell in visualization "Visualization 1" at "4", "1" has style "padding" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('4', '1', 'Visualization 1').getCSSProperty('padding'))
                    .value
            )
            .toBe('6.93333px 14px');
        // When I select "large" cell padding under Spacing section
        await newFormatPanelForGrid.selectCellPadding('large');
        // Then the grid cell in visualization "Visualization 1" at "4", "1" has style "padding" with value "8px 16px"
        await since(
            'The grid cell in visualization "Visualization 1" at "4", "1" has style "padding" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('4', '1', 'Visualization 1').getCSSProperty('padding'))
                    .value
            )
            .toBe('8px 16px');
        // When I select "Undo" from toolbar
        await dossierAuthoringPage.actionOnToolbar("Undo");
        // Then the grid cell in visualization "Visualization 1" at "4", "1" has style "padding" with value "6.93333px 14px"
        await since(
            'The grid cell in visualization "Visualization 1" at "4", "1" has style "padding" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('4', '1', 'Visualization 1').getCSSProperty('padding'))
                    .value
            )
            .toBe('6.93333px 14px');
        // When I select "Redo" from toolbar
        await dossierAuthoringPage.actionOnToolbar("Redo");
        // Then the grid cell in visualization "Visualization 1" at "4", "1" has style "padding" with value "8px 16px"  
        await since(
            'The grid cell in visualization "Visualization 1" at "4", "1" has style "padding" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('4', '1', 'Visualization 1').getCSSProperty('padding'))
                    .value
            )
            .toBe('8px 16px');
        // When I change grid column size fit to "Fit to Content" under Spacing section
        await newFormatPanelForGrid.clickColumnSizeFitOption('Fit to Content', false);
        // Then the grid cell in visualization "Visualization 1" at "4", "1" has style "width" with value "52.8984px"
        await since(
            'The grid cell in visualization "Visualization 1" at "4", "1" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('4', '1', 'Visualization 1').getCSSProperty('width'))
                    .value
            )
            .toContain('52.');
        // When I change grid column size fit to "Fixed" under Spacing section
        await newFormatPanelForGrid.clickColumnSizeFitOption('Fixed', false);
        // And I change grid column size target to "All columns" under Spacing section
        await newFormatPanelForGrid.clickColumnSizeTargetBtn();
        await newFormatPanelForGrid.clickColumnSizeTargetOption('All columns');
        // And I change grid column size fixed inches to "2.5" under Spacing section
        await newFormatPanelForGrid.setColumnSizeFixedInches('2.5');
        // Then the grid cell in visualization "Visualization 1" at "4", "1" has style "width" with value "208px"
        await since(
            'The grid cell in visualization "Visualization 1" at "4", "1" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('4', '1', 'Visualization 1').getCSSProperty('width'))
                    .value
            )
            .toBe('208px');
        // When I change grid column size fit to "Fit to Container" under Spacing section
        await newFormatPanelForGrid.clickColumnSizeFitOption('Fit to Container', false);
        // Then the grid cell in visualization "Visualization 1" at "4", "1" has style "width" with value "52.8984px"
        await since(
            'The grid cell in visualization "Visualization 1" at "4", "1" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('4', '1', 'Visualization 1').getCSSProperty('width'))
                    .value
            )
            .toContain('52.');
        // When I select "Undo" from toolbar
        await dossierAuthoringPage.actionOnToolbar("Undo");
        // Then the grid cell in visualization "Visualization 1" at "4", "1" has style "width" with value "208px"
        await since(
            'The grid cell in visualization "Visualization 1" at "4", "1" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('4', '1', 'Visualization 1').getCSSProperty('width'))
                    .value
            )
            .toBe('208px');
        // When I select "Redo" from toolbar
        await dossierAuthoringPage.actionOnToolbar("Redo");
        // Then the grid cell in visualization "Visualization 1" at "4", "1" has style "width" with value "52.8984px"    
        await since(
            'The grid cell in visualization "Visualization 1" at "4", "1" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('4', '1', 'Visualization 1').getCSSProperty('width'))
                    .value
            )
            .toContain('52.');    
        // When I change grid row size fit to "Fixed" under Spacing section
        await newFormatPanelForGrid.clickRowSizeBtn(false);
        await newFormatPanelForGrid.clickRowSizeFitOption('Fixed');
        // And I change grid row size fixed inches to "0.5" under Spacing section
        await newFormatPanelForGrid.setRowSizeFixedInches('0.5');
        // Then the grid cell in visualization "Visualization 1" at "4", "1" has style "height" with value "31px"
        await since(
            'The grid cell in visualization "Visualization 1" at "4", "1" has style "height" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('4', '1', 'Visualization 1').getCSSProperty('height'))
                    .value
            )
            .toBe('31px');
        // When I change grid row size fit to "Fit to Content" under Spacing section
        await newFormatPanelForGrid.clickRowSizeBtn(false);
        await newFormatPanelForGrid.clickRowSizeFitOption('Fit to Content');
        // Then the grid cell in visualization "Visualization 1" at "4", "1" has style "height" with value "27.7188px"
        await since(
            'The grid cell in visualization "Visualization 1" at "4", "1" has style "height" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('4', '1', 'Visualization 1').getCSSProperty('height'))
                    .value
            )
            .toBe('27.7188px');

        // # Test Chapter 3: "Metrics in Rows Only" for Column Resize by cursor and Format Panel
        // When I switch to page "Metrics in Rows Only" in chapter "Chapter 3" from contents panel
        await contentsPanel.goToPage({ chapterName: 'Chapter 3', pageName: 'Metrics in Rows Only' });
        let origColumnWidth7 = parseInt(await (vizPanelForGrid.getGridCellStyleByPosition(1, 1, 'Visualization 1', 'width')));
        await vizPanelForGrid.resizeColumnByMovingBorder(1, 90, 'right', 'Visualization 1');
        let actualColumnWidth7 = parseFloat((await (await vizPanelForGrid.getGridCellStyleByPosition(1, 1, 'Visualization 1', 'width'))).replace('px', ''));
        let expectedColumnWidth7 = origColumnWidth7 + 90;
        // Then Column 1 is 90 pixels "more" in grid visualization "Visualization 1"
        await since(`Then Column 1 is 90 pixels "more", should be ${expectedColumnWidth7}, actual ${actualColumnWidth7}`)
            .expect(assertWithinTolerance({ actual: actualColumnWidth7, expected: expectedColumnWidth7, tolerance: 1 }))
            .toBe(true);
        // When I resize column 1 in grid visualization "Visualization 1" 60 pixels to the "left"
        let origColumnWidth8 = parseInt(await (vizPanelForGrid.getGridCellStyleByPosition(1, 1, 'Visualization 1', 'width')));
        await vizPanelForGrid.resizeColumnByMovingBorder(1, 60, 'left', 'Visualization 1');
        let actualColumnWidth8 = parseFloat((await (await vizPanelForGrid.getGridCellStyleByPosition(1, 1, 'Visualization 1', 'width'))).replace('px', ''));
        let expectedColumnWidth8 = origColumnWidth8 - 60;
        // Then Column 1 is 60 pixels "less" in grid visualization "Visualization 1"
        await since(`Then Column 1 is 60 pixels "less", should be ${expectedColumnWidth8}, actual ${actualColumnWidth8}`)
            .expect(assertWithinTolerance({ actual: actualColumnWidth8, expected: expectedColumnWidth8, tolerance: 1 }))
            .toBe(true);

        // When I switch to the General Settings section on new format panel
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        await newFormatPanelForGrid.switchToGridTab();
        // And I expand "Spacing" section
        await newFormatPanelForGrid.expandSpacingSection();
        // When I select "small" cell padding under Spacing section
        await newFormatPanelForGrid.selectCellPadding('small');
        // Then the grid cell in visualization "Visualization 1" at "3", "2" has style "padding" with value "3.06667px 6px"
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "2" has style "padding" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('3', '2', 'Visualization 1').getCSSProperty('padding'))
                    .value
            )
            .toBe('3.06667px 6px');
        // When I select "medium" cell padding under Spacing section
        await newFormatPanelForGrid.selectCellPadding('medium');
        // Then the grid cell in visualization "Visualization 1" at "3", "2" has style "padding" with value "6.93333px 14px"
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "2" has style "padding" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('3', '2', 'Visualization 1').getCSSProperty('padding'))
                    .value
            )
            .toBe('6.93333px 14px');
        // When I select "large" cell padding under Spacing section
        await newFormatPanelForGrid.selectCellPadding('large');
        // Then the grid cell in visualization "Visualization 1" at "3", "2" has style "padding" with value "8px 16px"
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "2" has style "padding" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('3', '2', 'Visualization 1').getCSSProperty('padding'))
                    .value
            )
            .toBe('8px 16px');
        // When I change grid column size fit to "Fit to Content" under Spacing section
        await newFormatPanelForGrid.clickColumnSizeFitOption('Fit to Content', false);
        // Then the grid cell in visualization "Visualization 1" at "3", "2" has style "width" with value "62.0547px"
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "2" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('3', '2', 'Visualization 1').getCSSProperty('width'))
                    .value
            )
            .toContain('62');
        // When I change grid column size fit to "Fixed" under Spacing section
        await newFormatPanelForGrid.clickColumnSizeFitOption('Fixed', false);
        // And I change grid column size target to "All columns" under Spacing section
        await newFormatPanelForGrid.clickColumnSizeTargetBtn();
        await newFormatPanelForGrid.clickColumnSizeTargetOption('All columns');
        // And I change grid column size fixed inches to "2.5" under Spacing section
        await newFormatPanelForGrid.setColumnSizeFixedInches('2.5');
        // Then the grid cell in visualization "Visualization 1" at "3", "2" has style "width" with value "62.0547px"  
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "2" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('3', '2', 'Visualization 1').getCSSProperty('width'))
                    .value
            )
            .toContain('62'); 
        // When I change grid column size fit to "Fit to Container" under Spacing section
        await newFormatPanelForGrid.clickColumnSizeFitOption('Fit to Container', false);
        // Then the grid cell in visualization "Visualization 1" at "3", "2" has style "width" with value "62.0547px"
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "2" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('3', '2', 'Visualization 1').getCSSProperty('width'))
                    .value
            )
            .toContain('62');
        // When I change grid row size fit to "Fixed" under Spacing section
        await newFormatPanelForGrid.clickRowSizeBtn(false);
        await newFormatPanelForGrid.clickRowSizeFitOption('Fixed');
        // And I change grid row size fixed inches to "0.5" under Spacing section
        await newFormatPanelForGrid.setRowSizeFixedInches('0.5');
        // Then the grid cell in visualization "Visualization 1" at "3", "2" has style "height" with value "41.5781px"
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "2" has style "height" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('3', '2', 'Visualization 1').getCSSProperty('height'))
                    .value
            )
            .toBe('41.5781px');
        // When I change grid row size fit to "Fit to Content" under Spacing section
        await newFormatPanelForGrid.clickRowSizeBtn(false);
        await newFormatPanelForGrid.clickRowSizeFitOption('Fit to Content');
        // Then the grid cell in visualization "Visualization 1" at "3", "2" has style "height" with value "41.5781px"
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "2" has style "height" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('3', '2', 'Visualization 1').getCSSProperty('height'))
                    .value
            )
            .toBe('41.5781px');

        // # Test Chapter 4: "Metrics between Attributes in Rows" for Column Resize by cursor and Format Panel
        // When I switch to page "Metrics between Attributes in Rows" in chapter "Chapter 4" from contents panel
        await contentsPanel.goToPage({ chapterName: 'Chapter 4', pageName: 'Metrics between Attributes in Rows' });
        // Then Page "Metrics between Attributes in Rows" in chapter "Chapter 4" is the current page
        // When I hover over the border of column 2 in grid visualization "Visualization 1"
        // When I resize column 2 in grid visualization "Visualization 1" 90 pixels to the "right"
        let origColumnWidth9 = parseInt(await (vizPanelForGrid.getGridCellStyleByPosition(1, 2, 'Visualization 1', 'width')));
        await vizPanelForGrid.resizeColumnByMovingBorder(2, 90, 'right', 'Visualization 1');
        let actualColumnWidth9 = parseFloat((await (await vizPanelForGrid.getGridCellStyleByPosition(1, 2, 'Visualization 1', 'width'))).replace('px', ''));
        let expectedColumnWidth9 = origColumnWidth9 + 90;
        await since(`Then Column 2 is 90 pixels "more", should be ${expectedColumnWidth9}, actual ${actualColumnWidth9}`)
            .expect(assertWithinTolerance({ actual: actualColumnWidth9, expected: expectedColumnWidth9, tolerance: 1 }))
            .toBe(true);
        // Then Column 2 is 90 pixels "more" in grid visualization "Visualization 1"
        // When I resize column 2 in grid visualization "Visualization 1" 60 pixels to the "left"
        await vizPanelForGrid.resizeColumnByMovingBorder(2, 60, 'left', 'Visualization 1');
        let actualColumnWidth10 = parseFloat((await (await vizPanelForGrid.getGridCellStyleByPosition(1, 2, 'Visualization 1', 'width'))).replace('px', ''));
        let expectedColumnWidth10 = expectedColumnWidth9 - 60;
        await since(`Then Column 2 is 60 pixels "less", should be ${expectedColumnWidth10}, actual ${actualColumnWidth10}`)
            .expect(assertWithinTolerance({ actual: actualColumnWidth10, expected: expectedColumnWidth10, tolerance: 1 }))
            .toBe(true);
        // Then Column 2 is 60 pixels "less" in grid visualization "Visualization 1"

        // When I switch to the General Settings section on new format panel
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        await newFormatPanelForGrid.switchToGridTab();
        // And I expand "Spacing" section
        await newFormatPanelForGrid.expandSpacingSection();
        // When I select "small" cell padding under Spacing section
        await newFormatPanelForGrid.selectCellPadding('small');
        // Then the grid cell in visualization "Visualization 1" at "3", "1" has style "padding" with value "3.06667px 6px"
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "1" has style "padding" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('3', '1', 'Visualization 1').getCSSProperty('padding'))
                    .value
            )
            .toBe('3.06667px 6px');
        // When I select "medium" cell padding under Spacing section
        await newFormatPanelForGrid.selectCellPadding('medium');
        // Then the grid cell in visualization "Visualization 1" at "3", "1" has style "padding" with value "6.93333px 14px"
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "1" has style "padding" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('3', '1', 'Visualization 1').getCSSProperty('padding'))
                    .value
            )
            .toBe('6.93333px 14px');
        // When I select "large" cell padding under Spacing section
        await newFormatPanelForGrid.selectCellPadding('large');
        // Then the grid cell in visualization "Visualization 1" at "3", "1" has style "padding" with value "8px 16px"
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "1" has style "padding" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('3', '1', 'Visualization 1').getCSSProperty('padding'))
                    .value
            )
            .toBe('8px 16px');
        // When I change grid column size fit to "Fit to Content" under Spacing section
        await newFormatPanelForGrid.clickColumnSizeFitOption('Fit to Content', false);
        // Then the grid cell in visualization "Visualization 1" at "3", "1" has style "width" with value "54.9141px"
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "1" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('3', '1', 'Visualization 1').getCSSProperty('width'))
                    .value
            )
            .toContain('54.');
        // When I change grid column size fit to "Fixed" under Spacing section
        await newFormatPanelForGrid.clickColumnSizeFitOption('Fixed', false);
        // And I change grid column size target to "All columns" under Spacing section
        await newFormatPanelForGrid.clickColumnSizeTargetBtn();
        await newFormatPanelForGrid.clickColumnSizeTargetOption('All columns');
        // And I change grid column size fixed inches to "2.5" under Spacing section
        await newFormatPanelForGrid.setColumnSizeFixedInches('2.5');
        // Then the grid cell in visualization "Visualization 1" at "3", "1" has style "width" with value "208px"   
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "1" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('3', '1', 'Visualization 1').getCSSProperty('width'))
                    .value
            )
            .toBe('208px'); 
        // When I change grid column size fit to "Fit to Container" under Spacing section
        await newFormatPanelForGrid.clickColumnSizeFitOption('Fit to Container', false);
        // Then the grid cell in visualization "Visualization 1" at "3", "1" has style "width" with value "175.445px"
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "1" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('3', '1', 'Visualization 1').getCSSProperty('width'))
                    .value
            )
            .toContain('175.');
        // When I change grid row size fit to "Fixed" under Spacing section
        await newFormatPanelForGrid.clickRowSizeBtn(false);
        await newFormatPanelForGrid.clickRowSizeFitOption('Fixed');
        // And I change grid row size fixed inches to "0.5" under Spacing section
        await newFormatPanelForGrid.setRowSizeFixedInches('0.5');
        // Then the grid cell in visualization "Visualization 1" at "3", "1" has style "height" with value "31px"
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "1" has style "height" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('3', '1', 'Visualization 1').getCSSProperty('height'))
                    .value
            )
            .toBe('31px');
        // When I change grid row size fit to "Fit to Content" under Spacing section
        await newFormatPanelForGrid.clickRowSizeBtn(false);
        await newFormatPanelForGrid.clickRowSizeFitOption('Fit to Content');
        // Then the grid cell in visualization "Visualization 1" at "3", "1" has style "height" with value "13.8594px"
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "1" has style "height" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('3', '1', 'Visualization 1').getCSSProperty('height'))
                    .value
            )
            .toBe('13.8594px');


        // # Test Chapter 5: "Metrics below Attributes in Rows" for Column Resize by cursor and Format Panel
        // When I switch to page "Metrics below Attributes in Rows" in chapter "Chapter 5" from contents panel
        await contentsPanel.goToPage({ chapterName: 'Chapter 5', pageName: 'Metrics below Attributes in Rows' });
        // Then Page "Metrics below Attributes in Rows" in chapter "Chapter 5" is the current page
        // When I hover over the border of column 2 in grid visualization "Visualization 1"
        // When I resize column 2 in grid visualization "Visualization 1" 90 pixels to the "right"
        let origColumnWidth11 = parseInt(await (vizPanelForGrid.getGridCellStyleByPosition(1, 2, 'Visualization 1', 'width')));
        await vizPanelForGrid.resizeColumnByMovingBorder(2, 90, 'right', 'Visualization 1');
        let actualColumnWidth11 = parseFloat((await (await vizPanelForGrid.getGridCellStyleByPosition(1, 2, 'Visualization 1', 'width'))).replace('px', ''));
        let expectedColumnWidth11 = origColumnWidth11 + 90;
        await since(`Then Column 2 is 90 pixels "more", should be ${expectedColumnWidth11}, actual ${actualColumnWidth11}`)
            .expect(assertWithinTolerance({ actual: actualColumnWidth11, expected: expectedColumnWidth11, tolerance: 1 }))
            .toBe(true);
        // Then Column 2 is 90 pixels "more" in grid visualization "Visualization 1"
        // When I resize column 2 in grid visualization "Visualization 1" 60 pixels to the "left"
        let origColumnWidth12 = parseInt(await (vizPanelForGrid.getGridCellStyleByPosition(1, 2, 'Visualization 1', 'width')));
        await vizPanelForGrid.resizeColumnByMovingBorder(2, 60, 'left', 'Visualization 1');
        let actualColumnWidth12 = parseFloat((await (await vizPanelForGrid.getGridCellStyleByPosition(1, 2, 'Visualization 1', 'width'))).replace('px', ''));
        let expectedColumnWidth12 = origColumnWidth12 - 60;
        await since(`Then Column 2 is 60 pixels "less", should be ${expectedColumnWidth12}, actual ${actualColumnWidth12}`)
            .expect(assertWithinTolerance({ actual: actualColumnWidth12, expected: expectedColumnWidth12, tolerance: 1 }))
            .toBe(true);
        // Then Column 2 is 60 pixels "less" in grid visualization "Visualization 1"

        // When I switch to the General Settings section on new format panel
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        await newFormatPanelForGrid.switchToGridTab();
        // And I expand "Spacing" section
        await newFormatPanelForGrid.expandSpacingSection();
        // And I select "small" cell padding under Spacing section
        await newFormatPanelForGrid.selectCellPadding('small');
        // Then the grid cell in visualization "Visualization 1" at "3", "1" has style "padding" with value "3.06667px 6px"
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "1" has style "padding" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('3', '1', 'Visualization 1').getCSSProperty('padding'))
                    .value
            )
            .toBe('3.06667px 6px');
        // When I select "medium" cell padding under Spacing section
        await newFormatPanelForGrid.selectCellPadding('medium');
        // Then the grid cell in visualization "Visualization 1" at "3", "1" has style "padding" with value "6.93333px 14px"
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "1" has style "padding" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('3', '1', 'Visualization 1').getCSSProperty('padding'))
                    .value
            )
            .toBe('6.93333px 14px');
        // When I select "large" cell padding under Spacing section
        await newFormatPanelForGrid.selectCellPadding('large');
        // Then the grid cell in visualization "Visualization 1" at "3", "1" has style "padding" with value "8px 16px"
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "1" has style "padding" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('3', '1', 'Visualization 1').getCSSProperty('padding'))
                    .value
            )
            .toBe('8px 16px');

        // # Test Chapter 6: "Metrics above Attributes in Rows" for Column Resize by cursor and Format Panel
        // When I switch to page "Metrics above Attributes in Rows" in chapter "Chapter 6" from contents panel
        await contentsPanel.goToPage({ chapterName: 'Chapter 6', pageName: 'Metrics above Attributes in Rows' });
        // Then Page "Metrics above Attributes in Rows" in chapter "Chapter 6" is the current page
        // When I hover over the border of column 2 in grid visualization "Visualization 1"
        // When I resize column 2 in grid visualization "Visualization 1" 90 pixels to the "right"
        let origColumnWidth13 = parseInt(await (vizPanelForGrid.getGridCellStyleByPosition(1, 2, 'Visualization 1', 'width')));
        await vizPanelForGrid.resizeColumnByMovingBorder(2, 90, 'right', 'Visualization 1');
        let actualColumnWidth13 = parseFloat((await (await vizPanelForGrid.getGridCellStyleByPosition(1, 2, 'Visualization 1', 'width'))).replace('px', ''));
        let expectedColumnWidth13 = origColumnWidth13 + 90;
        await since(`Then Column 2 is 90 pixels "more", should be ${expectedColumnWidth13}, actual ${actualColumnWidth13}`)
            .expect(assertWithinTolerance({ actual: actualColumnWidth13, expected: expectedColumnWidth13, tolerance: 1 }))
            .toBe(true);
        // Then Column 2 is 90 pixels "more" in grid visualization "Visualization 1"
        // When I resize column 2 in grid visualization "Visualization 1" 60 pixels to the "left"
        await vizPanelForGrid.resizeColumnByMovingBorder(2, 60, 'left', 'Visualization 1');
        let actualColumnWidth14 = parseFloat((await (await vizPanelForGrid.getGridCellStyleByPosition(1, 2, 'Visualization 1', 'width'))).replace('px', ''));
        let expectedColumnWidth14 = expectedColumnWidth13 - 60;
        await since(`Then Column 2 is 60 pixels "less", should be ${expectedColumnWidth14}, actual ${actualColumnWidth14}`)
            .expect(assertWithinTolerance({ actual: actualColumnWidth14, expected: expectedColumnWidth14, tolerance: 1 }))
            .toBe(true);
        // Then Column 2 is 60 pixels "less" in grid visualization "Visualization 1"
    
        // When I switch to the General Settings section on new format panel
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        await newFormatPanelForGrid.switchToGridTab();
        // And I expand "Spacing" section
        await newFormatPanelForGrid.expandSpacingSection();
        // And I select "large" cell padding under Spacing section
        await newFormatPanelForGrid.selectCellPadding('large');
        // Then the grid cell in visualization "Visualization 1" at "3", "1" has style "padding" with value "8px 16px"
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "1" has style "padding" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('3', '1', 'Visualization 1').getCSSProperty('padding'))
                    .value
            )
            .toBe('8px 16px');
        // When I change grid column size fit to "Fit to Content" under Spacing section
        await newFormatPanelForGrid.clickColumnSizeFitOption('Fit to Content', false);
        // Then the grid cell in visualization "Visualization 1" at "3", "1" has style "width" with value "54.9141px"
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "1" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('3', '1', 'Visualization 1').getCSSProperty('width'))
                    .value
            )
            .toContain('54.');
        // When I change grid column size fit to "Fixed" under Spacing section
        await newFormatPanelForGrid.clickColumnSizeFitOption('Fixed', false);
        // And I change grid column size target to "All columns" under Spacing section
        await newFormatPanelForGrid.clickColumnSizeTargetBtn();
        await newFormatPanelForGrid.clickColumnSizeTargetOption('All columns');
        // And I change grid column size fixed inches to "2.5" under Spacing section
        await newFormatPanelForGrid.setColumnSizeFixedInches('2.5');
        // Then the grid cell in visualization "Visualization 1" at "3", "1" has style "width" with value "208px"   
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "1" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('3', '1', 'Visualization 1').getCSSProperty('width'))
                    .value
            )
            .toBe('208px');
        // When I change grid column size fit to "Fit to Container" under Spacing section
        await newFormatPanelForGrid.clickColumnSizeFitOption('Fit to Container', false);
        // Then the grid cell in visualization "Visualization 1" at "3", "1" has style "width" with value "181.195px"
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "1" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('3', '1', 'Visualization 1').getCSSProperty('width'))
                    .value
            )
            .toBe('178.219px');
        // When I change grid row size fit to "Fixed" under Spacing section
        await newFormatPanelForGrid.clickRowSizeBtn(false);
        await newFormatPanelForGrid.clickRowSizeFitOption('Fixed');
        // And I change grid row size fixed inches to "0.5" under Spacing section
        await newFormatPanelForGrid.setRowSizeFixedInches('0.5');
        // Then the grid cell in visualization "Visualization 1" at "3", "1" has style "height" with value "31px"
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "1" has style "height" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('3', '1', 'Visualization 1').getCSSProperty('height'))
                    .value
            )
            .toBe('31px');
        // When I change grid row size fit to "Fit to Content" under Spacing section
        await newFormatPanelForGrid.clickRowSizeBtn(false);
        await newFormatPanelForGrid.clickRowSizeFitOption('Fit to Content');
        // Then the grid cell in visualization "Visualization 1" at "3", "1" has style "height" with value "13.8594px"
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "1" has style "height" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('3', '1', 'Visualization 1').getCSSProperty('height'))
                    .value
            )
            .toBe('13.8594px');

        // # Test Chapter 7: "Metrics in Column Set Only" for Column Resize by cursor and Format Panel
        // When I switch to page "Metrics in Column Set Only" in chapter "Chapter 7" from contents panel
        await contentsPanel.goToPage({ chapterName: 'Chapter 7', pageName: 'Metrics in Column Set Only' });
        // Then Page "Metrics in Column Set Only" in chapter "Chapter 7" is the current page
        // When I switch to the General Settings section on new format panel
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        await newFormatPanelForGrid.switchToGridTab();
        // And I expand "Spacing" section
        await newFormatPanelForGrid.expandSpacingSection();
        // And I select "small" cell padding under Spacing section
        await newFormatPanelForGrid.selectCellPadding('small');
        // Then the grid cell in visualization "Visualization 1" at "2", "1" has style "padding" with value "3.06667px 6px"
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" has style "padding" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getCSSProperty('padding'))
                    .value
            )
            .toBe('3.06667px 6px');
        // When I select "medium" cell padding under Spacing section
        await newFormatPanelForGrid.selectCellPadding('medium');
        // Then the grid cell in visualization "Visualization 1" at "2", "1" has style "padding" with value "6.93333px 14px"
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" has style "padding" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getCSSProperty('padding'))
                    .value
            )
            .toBe('6.93333px 14px');
        // When I select "large" cell padding under Spacing section
        await newFormatPanelForGrid.selectCellPadding('large');
        // Then the grid cell in visualization "Visualization 1" at "2", "1" has style "padding" with value "8px 16px"
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" has style "padding" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getCSSProperty('padding'))
                    .value
            )
            .toBe('8px 16px');
        // When I change grid column size fit to "Fit to Content" under Spacing section
        await newFormatPanelForGrid.clickColumnSizeFitOption('Fit to Content', false);
        // Then the grid cell in visualization "Visualization 1" at "2", "1" has style "width" with value "79.7812px"
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getCSSProperty('width'))
                    .value
            )
            .toContain('79.');
        // When I change grid column size fit to "Fixed" under Spacing section
        await newFormatPanelForGrid.clickColumnSizeFitOption('Fixed', false);
        // And I change grid column size target to "All columns" under Spacing section
        await newFormatPanelForGrid.clickColumnSizeTargetBtn();
        await newFormatPanelForGrid.clickColumnSizeTargetOption('All columns');
        // And I change grid column size fixed inches to "2.5" under Spacing section
        await newFormatPanelForGrid.setColumnSizeFixedInches('2.5');
        // Then the grid cell in visualization "Visualization 1" at "2", "1" has style "width" with value "208px"   
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getCSSProperty('width'))
                    .value
            )
            .toBe('208px');
        // When I change grid column size fit to "Fit to Container" under Spacing section
        await newFormatPanelForGrid.clickColumnSizeFitOption('Fit to Container', false);
        // Then the grid cell in visualization "Visualization 1" at "2", "1" has style "width" with value "501.305px"
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getCSSProperty('width'))
                    .value
            )
            .toContain('501.');
        // When I change grid row size fit to "Fixed" under Spacing section
        await newFormatPanelForGrid.clickRowSizeBtn(false);
        await newFormatPanelForGrid.clickRowSizeFitOption('Fixed');
        // And I change grid row size fixed inches to "0.5" under Spacing section
        await newFormatPanelForGrid.setRowSizeFixedInches('0.5');
        // Then the grid cell in visualization "Visualization 1" at "2", "1" has style "height" with value "31px"
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" has style "height" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getCSSProperty('height'))
                    .value
            )
            .toBe('31px');
        // When I change grid row size fit to "Fit to Content" under Spacing section
        await newFormatPanelForGrid.clickRowSizeBtn(false);
        await newFormatPanelForGrid.clickRowSizeFitOption('Fit to Content');
        // Then the grid cell in visualization "Visualization 1" at "2", "1" has style "height" with value "13.8594px"
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" has style "height" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getCSSProperty('height'))
                    .value
            )
            .toBe('13.8594px');
    
        // # Test Chapter 8: "Metrics between Attributes in Column Set" for Column Resize by cursor and Format Panel
        // When I switch to page "Metrics between Attributes in Column Set" in chapter "Chapter 8" from contents panel
        await contentsPanel.goToPage({ chapterName: 'Chapter 8', pageName: 'Metrics between Attributes in Column Set' });
        // Then Page "Metrics between Attributes in Column Set" in chapter "Chapter 8" is the current page
        // When I switch to the General Settings section on new format panel
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        await newFormatPanelForGrid.switchToGridTab();
        // And I expand "Spacing" section
        await newFormatPanelForGrid.expandSpacingSection();
        // And I select "small" cell padding under Spacing section
        await newFormatPanelForGrid.selectCellPadding('small');
        // Then the grid cell in visualization "Visualization 1" at "4", "1" has style "padding" with value "3.06667px 6px"
        await since(
            'The grid cell in visualization "Visualization 1" at "4", "1" has style "padding" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('4', '1', 'Visualization 1').getCSSProperty('padding'))
                    .value
            )
            .toBe('3.06667px 6px');
        // When I select "medium" cell padding under Spacing section
        await newFormatPanelForGrid.selectCellPadding('medium');
        // Then the grid cell in visualization "Visualization 1" at "4", "1" has style "padding" with value "6.93333px 14px"
        await since(
            'The grid cell in visualization "Visualization 1" at "4", "1" has style "padding" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('4', '1', 'Visualization 1').getCSSProperty('padding'))
                    .value
            )
            .toBe('6.93333px 14px');
        // When I select "large" cell padding under Spacing section
        await newFormatPanelForGrid.selectCellPadding('large');
        // Then the grid cell in visualization "Visualization 1" at "4", "1" has style "padding" with value "8px 16px"
        await since(
            'The grid cell in visualization "Visualization 1" at "4", "1" has style "padding" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('4', '1', 'Visualization 1').getCSSProperty('padding'))
                    .value
            )
            .toBe('8px 16px');
    
        // # Test Chapter 9: "Metrics below Attributes in Column Set" for Column Resize by cursor and Format Panel
        // When I switch to page "Metrics below Attributes in Column Set" in chapter "Chapter 9" from contents panel
        await contentsPanel.goToPage({ chapterName: 'Chapter 9', pageName: 'Metrics below Attributes in Column Set' });
        // Then Page "Metrics below Attributes in Column Set" in chapter "Chapter 9" is the current page
        // When I switch to the General Settings section on new format panel
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        await newFormatPanelForGrid.switchToGridTab();
        // And I expand "Spacing" section
        await newFormatPanelForGrid.expandSpacingSection();
        // And I select "small" cell padding under Spacing section
        await newFormatPanelForGrid.selectCellPadding('small');
        // Then the grid cell in visualization "Visualization 1" at "3", "1" has style "padding" with value "3.06667px 6px"
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "1" has style "padding" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('3', '1', 'Visualization 1').getCSSProperty('padding'))
                    .value
            )
            .toBe('3.06667px 6px');
        // When I select "medium" cell padding under Spacing section
        await newFormatPanelForGrid.selectCellPadding('medium');
        // Then the grid cell in visualization "Visualization 1" at "3", "1" has style "padding" with value "6.93333px 14px"
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "1" has style "padding" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('3', '1', 'Visualization 1').getCSSProperty('padding'))
                    .value
            )
            .toBe('6.93333px 14px');
        // When I select "large" cell padding under Spacing section
        await newFormatPanelForGrid.selectCellPadding('large');
        // Then the grid cell in visualization "Visualization 1" at "3", "1" has style "padding" with value "8px 16px"
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "1" has style "padding" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('3', '1', 'Visualization 1').getCSSProperty('padding'))
                    .value
            )
            .toBe('8px 16px');
        
        // # Test Chapter 10: "Metrics above Attributes in Column Set" for Column Resize by cursor and Format Panel
        // When I switch to page "Metrics above Attributes in Column Set" in chapter "Chapter 10" from contents panel
        await contentsPanel.goToPage({ chapterName: 'Chapter 10', pageName: 'Metrics above Attributes in Column Set' });
        // Then Page "Metrics above Attributes in Column Set" in chapter "Chapter 10" is the current page
        // When I switch to the General Settings section on new format panel
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        await newFormatPanelForGrid.switchToGridTab();
        // And I expand "Spacing" section
        await newFormatPanelForGrid.expandSpacingSection();
        // And I select "small" cell padding under Spacing section
        await newFormatPanelForGrid.selectCellPadding('small');
        // Then the grid cell in visualization "Visualization 1" at "3", "1" has style "padding" with value "3.06667px 6px"
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "1" has style "padding" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('3', '1', 'Visualization 1').getCSSProperty('padding'))
                    .value
            )
            .toBe('3.06667px 6px');
        // When I select "medium" cell padding under Spacing section
        await newFormatPanelForGrid.selectCellPadding('medium');
        // Then the grid cell in visualization "Visualization 1" at "3", "1" has style "padding" with value "6.93333px 14px"
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "1" has style "padding" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('3', '1', 'Visualization 1').getCSSProperty('padding'))
                    .value
            )
            .toBe('6.93333px 14px');
        // When I select "large" cell padding under Spacing section
        await newFormatPanelForGrid.selectCellPadding('large');
        // Then the grid cell in visualization "Visualization 1" at "3", "1" has style "padding" with value "8px 16px"
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "1" has style "padding" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('3', '1', 'Visualization 1').getCSSProperty('padding'))
                    .value
            )
            .toBe('8px 16px');
    });
});
