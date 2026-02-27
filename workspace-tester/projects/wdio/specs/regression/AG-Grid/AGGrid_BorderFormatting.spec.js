import setWindowSize from '../../../config/setWindowSize.js';
import { AGGridBorderFormat1, AGGridBorderFormat2, gridUser } from '../../../constants/grid.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('AG Grid - borders formatting (from GDC)', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        loginPage,
        libraryPage,
        baseVisualization,
        tocContentsPanel,
        contentsPanel,
        vizPanelForGrid,
        thresholdEditor,
        agGridVisualization,
        editorPanelForGrid,
        editorPanel,
        reportGridView,
        dossierAuthoringPage,
        baseFormatPanel,
        baseFormatPanelReact,
        newFormatPanelForGrid,
        toolbar,
        grid,
        toc,
        baseContainer,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {});

    it('[TC88602] Ag grid Borders formatting, adding up, down, left and right; hair and double types', async () => {
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Border Format > AGGrid_BorderFormatting_TC88602
        await libraryPage.editDossierByUrl({
            projectId: AGGridBorderFormat1.project.id,
            dossierId: AGGridBorderFormat1.id,
        });
        // When I toggle totals from editor panel
        await editorPanelForGrid.showTotal('Number of Flights');
        // Then the grid cell in ag-grid "Visualization 1" at "2", "0" has text "Total"
        await since('Grid cell in ag-grid "Visualization 1" at "2", "0" should have text "Total"')
            .expect(await reportGridView.getGridCellText(2, 0))
            .toBe('Total');
        // And the grid cell in ag-grid "Visualization 1" at "2", "2" has text "222182"
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 2, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await reportGridView.getGridCellText(2, 2))
            .toBe('222182');
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();

        // And I switch to the "Text and Form" section on new format panel
        await baseFormatPanelReact.switchSection('Text and Form');

        // When I change the segment dropdown from "Entire Grid" to "Column Headers" through the new format panel
        await baseFormatPanelReact.changeSegmentControl('Entire Grid', 'Column Headers');

        // Then The segment control dropdown should be "Column Headers" in new format panel
        await since('The segment control dropdown should be Column Headers in new format panel')
            .expect(await baseFormatPanelReact.getSegmentControlDropDownByCurrentSelection('Column Headers'))
            .toBeTruthy();

        // When I change the segment dropdown from "Column Headers" to "Column Set 1" through the new format panel
        await baseFormatPanelReact.changeSegmentControl('Column Headers', 'Column Set 1');

        // Then The segment control dropdown should be "Column Set 1" in new format panel
        await since('The segment control dropdown should be Column Set 1 in new format panel')
            .expect(await baseFormatPanelReact.getSegmentControlDropDownByCurrentSelection('Column Set 1'))
            .toBeTruthy();

        // When I open the grid cell "top" border style pulldown list
        await newFormatPanelForGrid.openCellBorderStyleDropDownByPos('top');

        // And I select cell border style "hair" from the pulldown
        await newFormatPanelForGrid.selectCellBorderStyle('hair');

        // And I open the grid cell "top" border color picker
        await newFormatPanelForGrid.clickCellBorderColorBtnByPos('top');

        // And I select the built-in color "#83C962" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#83C962');
        // And I click to close the color picker
        await baseFormatPanelReact.dismissColorPicker();
        // wait for animation
        await browser.pause(2000);

        // Take screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC88602_01',
            'Top border style hair and color #83C962 for Column Headers'
        );
        // Then the grid cell in ag-grid "Visualization 1" at "1", "2" has style "border-top-style" with value "solid"
        await since(
            'Grid cell at row 1, col 2 in Visualization 1 should have style "border-top-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 2, 'border-top-style'))
            .toEqual('solid');
        // And the grid cell in ag-grid "Visualization 1" at "1", "2" has style "border-top-width" with value "1px"
        await since(
            'Grid cell at row 1, col 2 in Visualization 1 should have style "border-top-width" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 2, 'border-top-width'))
            .toEqual('1px');
        // the grid cell in ag-grid "Visualization 1" at "1", "2" has style "border-top-color" with value "rgba(131, 201, 98, 1)"
        await since(
            'Grid cell in ag-grid "Visualization 1" at "1", "2" should have style "border-top-color" with value "rgba(131,201,98,1)"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 2, 'border-top-color'))
            .toBe('rgba(131,201,98,1)');

        // Then the grid cell in ag-grid "Visualization 1" at "1", "3" has style "border-top-style" with value "solid"
        await since(
            'Grid cell at row 1, col 3 in Visualization 1 should have style "border-top-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 3, 'border-top-style'))
            .toEqual('solid');
        // And the grid cell in ag-grid "Visualization 1" at "1", "3" has style "border-top-width" with value "1px"
        await since(
            'Grid cell at row 1, col 3 in Visualization 1 should have style "border-top-width" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 3, 'border-top-width'))
            .toEqual('1px');
        // the grid cell in ag-grid "Visualization 1" at "1", "3" has style "border-top-color" with value "rgba(131, 201, 98, 1)"
        await since(
            'Grid cell in ag-grid "Visualization 1" at "1", "3" should have style "border-top-color" with value "rgba(131,201,98,1)"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 3, 'border-top-color'))
            .toBe('rgba(131,201,98,1)');

        // Then the grid cell in ag-grid "Visualization 1" at "1", "4" has style "border-top-style" with value "solid"
        await since(
            'Grid cell at row 1, col 4 in Visualization 1 should have style "border-top-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 4, 'border-top-style'))
            .toEqual('solid');
        // And the grid cell in ag-grid "Visualization 1" at "1", "4" has style "border-top-width" with value "1px"
        await since(
            'Grid cell at row 1, col 4 in Visualization 1 should have style "border-top-width" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 4, 'border-top-width'))
            .toEqual('1px');
        // the grid cell in ag-grid "Visualization 1" at "1", "4" has style "border-top-color" with value "rgba(131, 201, 98, 1)"
        await since(
            'Grid cell in ag-grid "Visualization 1" at "1", "4" should have style "border-top-color" with value "rgba(131,201,98,1)"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 4, 'border-top-color'))
            .toBe('rgba(131,201,98,1)');

        // Then the grid cell in ag-grid "Visualization 1" at "0", "0" has style "border-top-style" with value "none"
        await since(
            'Grid cell at row 0, col 0 in Visualization 1 should have style "border-top-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'border-top-style'))
            .toEqual('none');
        // And the grid cell in ag-grid "Visualization 1" at "0", "0" has style "border-top-width" with value "0px"
        await since(
            'Grid cell at row 0, col 0 in Visualization 1 should have style "border-top-width" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'border-top-width'))
            .toEqual('0px');

        // Then the grid cell in ag-grid "Visualization 1" at "0", "1" has style "border-top-style" with value "none"
        await since(
            'Grid cell at row 0, col 1 in Visualization 1 should have style "border-top-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 1, 'border-top-style'))
            .toEqual('none');
        // And the grid cell in ag-grid "Visualization 1" at "0", "1" has style "border-top-width" with value "0px"
        await since(
            'Grid cell at row 0, col 1 in Visualization 1 should have style "border-top-width" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 1, 'border-top-width'))
            .toEqual('0px');

        // When I change the segment dropdown from "Column Set 1" to "Subtotal Row Headers" through the new format panel
        await baseFormatPanelReact.changeSegmentControl('Column Set 1', 'Subtotal Row Headers');

        // Then The segment control dropdown should be "Subtotal Row Headers" in new format panel
        await since('The segment control dropdown should be Subtotal Row Headers in new format panel')
            .expect(await baseFormatPanelReact.getSegmentControlDropDownByCurrentSelection('Subtotal Row Headers'))
            .toBeTruthy();
        // When I open the grid cell "bottom" border style pulldown list
        await newFormatPanelForGrid.openCellBorderStyleDropDownByPos('bottom');

        // And I select cell border style "double" from the pulldown
        await newFormatPanelForGrid.selectCellBorderStyle('double');

        // And I open the grid cell "bottom" border color picker
        await newFormatPanelForGrid.clickCellBorderColorBtnByPos('bottom');

        // And I select the built-in color "#1C8DD4" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#1C8DD4');
        // And I click to close the color picker
        await baseFormatPanelReact.dismissColorPicker();

        // wait for animation
        await browser.pause(2000);
        // Take screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC88602_02',
            'Bottom border style double and color #1C8DD4 for Subtotal Row Headers'
        );
        // Then the grid cell in ag-grid "Visualization 1" at "2", "0" has style "border-bottom-style" with value "double"
        await since(
            'Grid cell at row 2, col 0 in Visualization 1 should have style "border-bottom-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 0, 'border-bottom-style'))
            .toEqual('double');
        // And the grid cell in ag-grid "Visualization 1" at "2", "0" has style "border-bottom-width" with value "3px"
        await since(
            'Grid cell at row 2, col 0 in Visualization 1 should have style "border-bottom-width" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 0, 'border-bottom-width'))
            .toEqual('3px');
        // the grid cell in ag-grid "Visualization 1" at "2", "0" has style "border-bottom-color" with value "rgba(28, 141, 212, 1)"
        await since(
            'Grid cell in ag-grid "Visualization 1" at "2", "0" should have style "border-bottom-color" with value "rgba(28,141,212,1)"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 0, 'border-bottom-color'))
            .toBe('rgba(28,141,212,1)');
        // the grid cell in ag-grid "Visualization 1" at "2", "1" has style "border-bottom-style" with value "double"
        await since(
            'Grid cell at row 2, col 1 in Visualization 1 should have style "border-bottom-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 1, 'border-bottom-style'))
            .toEqual('double');
        // the grid cell in ag-grid "Visualization 1" at "2", "1" has style "border-bottom-width" with value "3px"
        await since(
            'Grid cell at row 2, col 1 in Visualization 1 should have style "border-bottom-width" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 1, 'border-bottom-width'))
            .toEqual('3px');
        // the grid cell in ag-grid "Visualization 1" at "2", "1" has style "border-bottom-color" with value "rgba(28, 141, 212, 1)"
        await since(
            'Grid cell in ag-grid "Visualization 1" at "2", "1" should have style "border-bottom-color" with value "rgba(28,141,212,1)"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 1, 'border-bottom-color'))
            .toBe('rgba(28,141,212,1)');

        // the grid cell in ag-grid "Visualization 1" at "3", "1" has style "border-bottom-style" with value "double"
        await since(
            'Grid cell at row 3, col 1 in Visualization 1 should have style "border-bottom-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 1, 'border-bottom-style'))
            .toEqual('double');
        // the grid cell in ag-grid "Visualization 1" at "3", "1" has style "border-bottom-width" with value "3px"
        await since(
            'Grid cell at row 3, col 1 in Visualization 1 should have style "border-bottom-width" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 1, 'border-bottom-width'))
            .toEqual('3px');
        // the grid cell in ag-grid "Visualization 1" at "3", "1" has style "border-bottom-color" with value "rgba(28, 141, 212, 1)"
        await since(
            'Grid cell in ag-grid "Visualization 1" at "3", "1" should have style "border-bottom-color" with value "rgba(28,141,212,1)"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 1, 'border-bottom-color'))
            .toBe('rgba(28,141,212,1)');

        // When I change the segment dropdown from "Subtotal Row Headers" to "Number of Flights Trend by Year" through the new format panel
        await baseFormatPanelReact.changeSegmentControl('Subtotal Row Headers', 'Number of Flights Trend by Year');
        // Then The segment control dropdown should be "Number of Flights Trend by Year" in new format panel
        await since('Segment control dropdown should be Number of Flights Trend by Year')
            .expect(
                await baseFormatPanelReact.getSegmentControlDropDownByCurrentSelection(
                    'Number of Flights Trend by Year'
                )
            )
            .toBeTruthy();
        // When I change the segment dropdown from "All" to "Headers" through the new format panel
        await baseFormatPanelReact.changeSegmentControl('All', 'Headers');
        // Then The segment control dropdown should be "Headers" in new format panel
        await since('Segment control dropdown should be Headers')
            .expect(await baseFormatPanelReact.getSegmentControlDropDownByCurrentSelection('Headers'))
            .toBeTruthy();

        // Select LEFT border and select '0.5 point solid'(hair) type and change color for left border
        // When I open the grid cell "left" border style pulldown list
        await newFormatPanelForGrid.openCellBorderStyleDropDownByPos('left');
        // And I select cell border style "hair" from the pulldown
        await newFormatPanelForGrid.selectCellBorderStyle('hair');
        // And I open the grid cell "left" border color picker
        await newFormatPanelForGrid.clickCellBorderColorBtnByPos('left');
        // And I select the built-in color "#DB6657" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#DB6657');
        // And I click to close the color picker
        await baseFormatPanelReact.dismissColorPicker();
        // wait for animation
        await browser.pause(2000);
        // Take screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC88602_03',
            'Left border style hair and color #DB6657 for Number of Flights Trend by Year Headers'
        );
        // Then the grid cell in ag-grid "Visualization 1" at "0", "7" has style "border-left-style" with value "solid"
        await since(
            'Grid cell at row 0, col 7 in Visualization 1 should have style "border-left-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 7, 'border-left-style'))
            .toEqual('solid');
        // And the grid cell in ag-grid "Visualization 1" at "0", "7" has style "border-left-width" with value "1px"
        await since(
            'Grid cell at row 0, col 7 in Visualization 1 should have style "border-left-width" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 7, 'border-left-width'))
            .toEqual('1px');
        // the grid cell in ag-grid "Visualization 1" at "0", "7" has style "border-left-color" with value "rgba(219, 102, 87, 1)"
        await since(
            'Grid cell in ag-grid "Visualization 1" at "0", "7" should have style "border-left-color" with value "rgba(219,102,87,1)"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 7, 'border-left-color'))
            .toBe('rgba(219,102,87,1)');

        // Select Values All sets
        // When I change the segment dropdown from "Number of Flights Trend by Year" to "Values" through the new format panel
        await baseFormatPanelReact.changeSegmentControl('Number of Flights Trend by Year', 'Values');
        // Then The segment control dropdown should be "Values" in new format panel
        await since('Segment control dropdown should be Values')
            .expect(await baseFormatPanelReact.getSegmentControlDropDownByCurrentSelection('Values'))
            .toBeTruthy();

        // Select RIGHT border and select  '1 point double' type and change color for right border
        // When I open the grid cell "left" border style pulldown list
        await newFormatPanelForGrid.openCellBorderStyleDropDownByPos('left');
        // And I select cell border style "double" from the pulldown
        await newFormatPanelForGrid.selectCellBorderStyle('double');
        // And I open the grid cell "left" border color picker
        await newFormatPanelForGrid.clickCellBorderColorBtnByPos('left');
        // And I select the built-in color "#38AE6F" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#38AE6F');
        // And I click to close the color picker
        await baseFormatPanelReact.dismissColorPicker();
        // wait for animation
        await browser.pause(2000);
        // Take screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC88602_04',
            'Left border style double and color #38AE6F for Number of Flights Trend by Year Values'
        );
        // Then the grid cell in ag-grid "Visualization 1" at "4", "2" has style "border-left-style" with value "double"
        await since(
            'Grid cell at row 4, col 2 in Visualization 1 should have style "border-left-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 2, 'border-left-style'))
            .toEqual('double');
        // And the grid cell in ag-grid "Visualization 1" at "4", "2" has style "border-left-width" with value "3px"
        await since(
            'Grid cell at row 4, col 2 in Visualization 1 should have style "border-left-width" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 2, 'border-left-width'))
            .toEqual('3px');
        // * the grid cell in ag-grid "Visualization 1" at "4", "2" has style "border-left-color" with value "rgba(56, 174, 111, 1)"
        await since(
            'Grid cell in ag-grid "Visualization 1" at "4", "2" should have style "border-left-color" with value "rgba(56,174,111,1)"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 2, 'border-left-color'))
            .toBe('rgba(56,174,111,1)');

        // the grid cell in ag-grid "Visualization 1" at "4", "6" has style "border-left-style" with value "double"
        await since(
            'Grid cell at row 4, col 6 in Visualization 1 should have style "border-left-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 6, 'border-left-style'))
            .toEqual('double');
        // the grid cell in ag-grid "Visualization 1" at "4", "6" has style "border-left-width" with value "3px"
        await since(
            'Grid cell at row 4, col 6 in Visualization 1 should have style "border-left-width" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 6, 'border-left-width'))
            .toEqual('3px');
        // the grid cell in ag-grid "Visualization 1" at "4", "6" has style "border-left-color" with value "rgba(56, 174, 111, 1)"
        await since(
            'Grid cell in ag-grid "Visualization 1" at "4", "6" should have style "border-left-color" with value "rgba(56,174,111,1)"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 6, 'border-left-color'))
            .toBe('rgba(56,174,111,1)');

        // # Comment out following subtotal values steps since the option is not exposed DE317440 Column Level Formatting | Expose Subtotal Values for individual metric and column set
        // # Select subtotal values
        // # When I change the segment dropdown from "Values" to "Subtotal Values" through the new format panel
        // # Then The segment control dropdown should be "Subtotal Values" in new format panel
        // # When I change the segment dropdown from "All Sets" to "Column Set 2" through the new format panel
        // # Then The segment control dropdown should be "Column Set 2" in new format panel
        // # When I open the grid cell "top" border style pulldown list
        // # And I select cell border style "none" from the pulldown
        // # When I open the grid cell "bottom" border style pulldown list
        // # And I select cell border style "none" from the pulldown
        // # When I open the grid cell "right" border style pulldown list
        // # And I select cell border style "none" from the pulldown
        // # Then the grid cell in ag-grid "Visualization 1" at "2", "5" has style "border-top-style" with value "none"
        // # And the grid cell in ag-grid "Visualization 1" at "2", "5" has style "border-top-width" with value "0px"
        // # * the grid cell in ag-grid "Visualization 1" at "2", "5" has style "border-bottom-style" with value "none"
        // # * the grid cell in ag-grid "Visualization 1" at "2", "5" has style "border-bottom-width" with value "0px"
        // # * the grid cell in ag-grid "Visualization 1" at "2", "5" has style "border-left-style" with value "none"
        // # * the grid cell in ag-grid "Visualization 1" at "2", "5" has style "border-left-width" with value "0px"
        // # * the grid cell in ag-grid "Visualization 1" at "2", "5" has style "border-right-style" with value "none"
        // # * the grid cell in ag-grid "Visualization 1" at "2", "5" has style "border-right-width" with value "0px"

        // Remove metric and attribute and verify borders
        // When I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();

        // And I remove "Metric" named "Flights Delayed" from the Grid Editor Panel
        await editorPanelForGrid.removeFromDropZone('Flights Delayed', 'Metric');

        // Then the grid cell in ag-grid "Visualization 1" at "0", "5" has text "Flights Cancelled"
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 0, col 5 should be #{expected}, instead it is #{actual}'
        )
            .expect(await reportGridView.getGridCellText(0, 5))
            .toBe('Flights Cancelled');

        // And the grid cell in ag-grid "Visualization 1" at "0", "5" has style "border-bottom-style" with value "solid"
        await since(
            'Grid cell at row 0, col 5 in Visualization 1 should have style "border-bottom-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 5, 'border-bottom-style'))
            .toEqual('solid');

        // And the grid cell in ag-grid "Visualization 1" at "0", "5" has style "border-bottom-width" with value "1px"
        await since(
            'Grid cell at row 0, col 5 in Visualization 1 should have style "border-bottom-width" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 5, 'border-bottom-width'))
            .toEqual('1px');

        // When I remove "Attribute" named "Airline Name" from the Grid Editor Panel
        await editorPanelForGrid.removeFromDropZone('Airline Name', 'Attribute');
        // Then the grid cell in ag-grid "Visualization 1" at "1", "1" has text "Origin Airport"
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 0, col 0 should be #{expected}, instead it is #{actual}'
        )
            .expect(await reportGridView.getGridCellText(0, 0))
            .toBe('Origin Airport');

        // And the grid cell in ag-grid "Visualization 1" at "0", "0" has style "border-top-style" with value "none"
        await since(
            'Grid cell at row 0, col 0 in Visualization 1 should have style "border-top-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'border-top-style'))
            .toEqual('none');

        // And the grid cell in ag-grid "Visualization 1" at "0", "0" has style "border-top-width" with value "0px"
        await since(
            'Grid cell in ag-grid "Visualization 1" at "0", "0" should have style "border-top-width" with value "0px"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'border-top-width'))
            .toBe('0px');

        // When I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        await toolbar.waitForElementInvisible(dossierAuthoringPage.getMojoLoadingIndicator());

        // And I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        await toolbar.waitForElementInvisible(dossierAuthoringPage.getMojoLoadingIndicator());
        // Take screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC88602_05',
            'Border format should be kept afterremove and undo'
        );

        // Then the grid cell in ag-grid "Visualization 1" at "0", "5" has text "Flights Delayed"
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 0, col 5 should be #{expected}, instead it is #{actual}'
        )
            .expect(await reportGridView.getGridCellText(0, 5))
            .toBe('Flights Delayed');

        // And the grid cell in ag-grid "Visualization 1" at "0", "5" has style "border-bottom-style" with value "solid"
        await since(
            'Grid cell at row 0, col 0 in Visualization 1 should have style "border-bottom-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 5, 'border-bottom-style'))
            .toEqual('solid');
        // the grid cell in ag-grid "Visualization 1" at "0", "5" has style "border-bottom-width" with value "1px"
        await since(
            'Grid cell at row 0, col 0 in Visualization 1 should have style "border-bottom-width" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 5, 'border-bottom-width'))
            .toEqual('1px');
        // the grid cell in ag-grid "Visualization 1" at "0", "0" has text "Airline Name"
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 0, col 0 should be #{expected}, instead it is #{actual}'
        )
            .expect(await reportGridView.getGridCellText(0, 0))
            .toBe('Airline Name');
        // the grid cell in ag-grid "Visualization 1" at "0", "0" has style "border-top-style" with value "none"
        await since(
            'Grid cell at row 0, col 0 in Visualization 1 should have style "border-top-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'border-top-style'))
            .toEqual('none');
        // the grid cell in ag-grid "Visualization 1" at "0", "0" has style "border-top-width" with value "0px"
        await since(
            'Grid cell at row 0, col 0 in Visualization 1 should have style "border-top-width" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'border-top-width'))
            .toEqual('0px');
    });
    it('[TC88963_1] Verify Ag grid Borders formatting on consumption mode', async () => {
        // Open dossier by id 102A09FE5D4008AB9A46E4A75DE7359F in consumption mode
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Border Format > AGGrid_BorderFormatting_TC88963
        const url = new URL(`app/${AGGridBorderFormat2.project.id}/${AGGridBorderFormat2.id}`, browser.options.baseUrl);
        await libraryPage.openDossierByUrl(url.toString());
        // wait for animation
        await browser.pause(2000);
        // Take a screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC88963_01',
            'Border format on consumption mode'
        );
        // Then the grid cell in ag-grid "Visualization 1" at "1", "2" has style "border-top-style" with value "solid"
        await since(
            'Grid cell at row 1, col 2 in Visualization 1 should have style "border-top-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 2, 'border-top-style'))
            .toEqual('solid');
        // *  the grid cell in ag-grid "Visualization 1" at "1", "2" has style "border-top-width" with value "1px"
        await since(
            'Grid cell at row 1, col 2 in Visualization 1 should have style "border-top-width" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 2, 'border-top-width'))
            .toEqual('1px');
        // * the grid cell in ag-grid "Visualization 1" at "1", "2" has style "border-top-color" with value "rgba(131, 201, 98, 1)"
        await since(
            'Grid cell in ag-grid "Visualization 1" at "1", "2" should have style "border-top-color" with value "rgba(131,201,98,1)"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 2, 'border-top-color'))
            .toBe('rgba(131,201,98,1)');

        // * the grid cell in ag-grid "Visualization 1" at "1", "3" has style "border-top-style" with value "solid"
        await since(
            'Grid cell at row 1, col 3 in Visualization 1 should have style "border-top-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 3, 'border-top-style'))
            .toEqual('solid');
        // * the grid cell in ag-grid "Visualization 1" at "1", "3" has style "border-top-width" with value "1px"
        await since(
            'Grid cell at row 1, col 3 in Visualization 1 should have style "border-top-width" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 3, 'border-top-width'))
            .toEqual('1px');
        // * the grid cell in ag-grid "Visualization 1" at "1", "3" has style "border-top-color" with value "rgba(131, 201, 98, 1)"
        await since(
            'Grid cell in ag-grid "Visualization 1" at "1", "3" should have style "border-top-color" with value "rgba(131,201,98,1)"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 3, 'border-top-color'))
            .toBe('rgba(131,201,98,1)');

        // * the grid cell in ag-grid "Visualization 1" at "1", "4" has style "border-top-style" with value "solid"
        await since(
            'Grid cell at row 1, col 4 in Visualization 1 should have style "border-top-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 4, 'border-top-style'))
            .toEqual('solid');
        // * the grid cell in ag-grid "Visualization 1" at "1", "4" has style "border-top-width" with value "1px"
        await since(
            'Grid cell at row 1, col 4 in Visualization 1 should have style "border-top-width" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 4, 'border-top-width'))
            .toEqual('1px');
        // * the grid cell in ag-grid "Visualization 1" at "1", "4" has style "border-top-color" with value "rgba(131, 201, 98, 1)"
        await since(
            'Grid cell in ag-grid "Visualization 1" at "1", "4" should have style "border-top-color" with value "rgba(131,201,98,1)"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 4, 'border-top-color'))
            .toBe('rgba(131,201,98,1)');
        // * the grid cell in ag-grid "Visualization 1" at "0", "0" has style "border-top-style" with value "solid"
        await since(
            'Grid cell at row 0, col 0 in Visualization 1 should have style "border-top-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'border-top-style'))
            .toEqual('solid');
        // * the grid cell in ag-grid "Visualization 1" at "0", "0" has style "border-top-width" with value "1px"
        await since(
            'Grid cell at row 0, col 0 in Visualization 1 should have style "border-top-width" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'border-top-width'))
            .toEqual('1px');
        // * the grid cell in ag-grid "Visualization 1" at "0", "0" has style "border-top-color" with value "rgba(131, 201, 98, 1)"
        await since(
            'Grid cell in ag-grid "Visualization 1" at "0", "0" should have style "border-top-color" with value "rgba(131,201,98,1)"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'border-top-color'))
            .toBe('rgba(131,201,98,1)');
        // * the grid cell in ag-grid "Visualization 1" at "0", "1" has style "border-top-style" with value "solid"
        await since(
            'Grid cell at row 0, col 1 in Visualization 1 should have style "border-top-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 1, 'border-top-style'))
            .toEqual('solid');
        // * the grid cell in ag-grid "Visualization 1" at "0", "1" has style "border-top-width" with value "1px"
        await since(
            'Grid cell at row 0, col 1 in Visualization 1 should have style "border-top-width" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 1, 'border-top-width'))
            .toEqual('1px');
        // * the grid cell in ag-grid "Visualization 1" at "0", "1" has style "border-top-color" with value "rgba(131, 201, 98, 1)"
        await since(
            'Grid cell in ag-grid "Visualization 1" at "0", "1" should have style "border-top-color" with value "rgba(131,201,98,1)"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 1, 'border-top-color'))
            .toBe('rgba(131,201,98,1)');
        // * the grid cell in ag-grid "Visualization 1" at "2", "0" has style "border-bottom-style" with value "double"
        await since(
            'Grid cell at row 2, col 0 in Visualization 1 should have style "border-bottom-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 0, 'border-bottom-style'))
            .toEqual('double');
        // * the grid cell in ag-grid "Visualization 1" at "2", "0" has style "border-bottom-width" with value "3px"
        await since(
            'Grid cell at row 2, col 0 in Visualization 1 should have style "border-bottom-width" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 0, 'border-bottom-width'))
            .toEqual('3px');
        // * the grid cell in ag-grid "Visualization 1" at "2", "0" has style "border-bottom-color" with value "rgba(28, 141, 212, 1)"
        await since(
            'Grid cell in ag-grid "Visualization 1" at "2", "0" should have style "border-bottom-color" with value "rgba(28,141,212,1)"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 0, 'border-bottom-color'))
            .toBe('rgba(28,141,212,1)');
        // * the grid cell in ag-grid "Visualization 1" at "2", "1" has style "border-bottom-style" with value "double"
        await since(
            'Grid cell at row 2, col 1 in Visualization 1 should have style "border-bottom-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 1, 'border-bottom-style'))
            .toEqual('double');
        // * the grid cell in ag-grid "Visualization 1" at "2", "1" has style "border-bottom-width" with value "3px"
        await since(
            'Grid cell at row 2, col 1 in Visualization 1 should have style "border-bottom-width" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 1, 'border-bottom-width'))
            .toEqual('3px');
        // * the grid cell in ag-grid "Visualization 1" at "2", "1" has style "border-bottom-color" with value "rgba(28, 141, 212, 1)"
        await since(
            'Grid cell in ag-grid "Visualization 1" at "2", "1" should have style "border-bottom-color" with value "rgba(28,141,212,1)"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 1, 'border-bottom-color'))
            .toBe('rgba(28,141,212,1)');
        // * the grid cell in ag-grid "Visualization 1" at "3", "1" has style "border-bottom-style" with value "double"
        await since(
            'Grid cell at row 3, col 1 in Visualization 1 should have style "border-bottom-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 1, 'border-bottom-style'))
            .toEqual('double');
        // * the grid cell in ag-grid "Visualization 1" at "3", "1" has style "border-bottom-width" with value "3px"
        await since(
            'Grid cell at row 3, col 1 in Visualization 1 should have style "border-bottom-width" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 1, 'border-bottom-width'))
            .toEqual('3px');
        // * the grid cell in ag-grid "Visualization 1" at "3", "1" has style "border-bottom-color" with value "rgba(28, 141, 212, 1)"
        await since(
            'Grid cell in ag-grid "Visualization 1" at "3", "1" should have style "border-bottom-color" with value "rgba(28,141,212,1)"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 1, 'border-bottom-color'))
            .toBe('rgba(28,141,212,1)');
        // * the grid cell in ag-grid "Visualization 1" at "0", "7" has style "border-left-style" with value "solid"
        await since(
            'Grid cell at row 0, col 7 in Visualization 1 should have style "border-left-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 7, 'border-left-style'))
            .toEqual('solid');

        // * the grid cell in ag-grid "Visualization 1" at "0", "7" has style "border-left-width" with value "1px"
        await since(
            'Grid cell at row 0, col 7 in Visualization 1 should have style "border-left-width" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 7, 'border-left-width'))
            .toEqual('1px');

        // * the grid cell in ag-grid "Visualization 1" at "0", "7" has style "border-left-color" with value "rgba(219, 102, 87, 1)"
        await since(
            'Grid cell at row 0, col 7 in Visualization 1 should have style "border-left-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 7, 'border-left-color'))
            .toBe('rgba(219,102,87,1)');

        // * the grid cell in ag-grid "Visualization 1" at "4", "2" has style "border-left-style" with value "double"
        await since(
            'Grid cell at row 4, col 2 in Visualization 1 should have style "border-left-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 2, 'border-left-style'))
            .toEqual('double');

        // * the grid cell in ag-grid "Visualization 1" at "4", "2" has style "border-left-width" with value "3px"
        await since(
            'Grid cell at row 4, col 2 in Visualization 1 should have style "border-left-width" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 2, 'border-left-width'))
            .toEqual('3px');

        // * the grid cell in ag-grid "Visualization 1" at "4", "2" has style "border-left-color" with value "rgba(56, 174, 111, 1)"
        await since(
            'Grid cell at row 4, col 2 in Visualization 1 should have style "border-left-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 2, 'border-left-color'))
            .toBe('rgba(56,174,111,1)');

        // * the grid cell in ag-grid "Visualization 1" at "4", "6" has style "border-left-style" with value "double"
        await since(
            'Grid cell at row 4, col 6 in Visualization 1 should have style "border-left-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 6, 'border-left-style'))
            .toEqual('double');

        // * the grid cell in ag-grid "Visualization 1" at "4", "6" has style "border-left-width" with value "3px"
        await since(
            'Grid cell at row 4, col 6 in Visualization 1 should have style "border-left-width" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 6, 'border-left-width'))
            .toEqual('3px');

        // * the grid cell in ag-grid "Visualization 1" at "4", "6" has style "border-left-color" with value "rgba(56, 174, 111, 1)"
        await since(
            'Grid cell at row 4, col 6 in Visualization 1 should have style "border-left-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 6, 'border-left-color'))
            .toBe('rgba(56,174,111,1)');

        // * the grid cell in ag-grid "Visualization 1" at "2", "5" has style "border-top-style" with value "none"
        await since(
            'Grid cell at row 2, col 5 in Visualization 1 should have style "border-top-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 5, 'border-top-style'))
            .toEqual('none');

        // * the grid cell in ag-grid "Visualization 1" at "2", "5" has style "border-top-width" with value "0px"
        await since(
            'Grid cell at row 2, col 5 in Visualization 1 should have style "border-top-width" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 5, 'border-top-width'))
            .toEqual('0px');

        // * the grid cell in ag-grid "Visualization 1" at "2", "5" has style "border-bottom-style" with value "none"
        await since(
            'Grid cell at row 2, col 5 in Visualization 1 should have style "border-bottom-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 5, 'border-bottom-style'))
            .toEqual('none');

        // * the grid cell in ag-grid "Visualization 1" at "2", "5" has style "border-bottom-width" with value "0px"
        await since(
            'Grid cell at row 2, col 5 in Visualization 1 should have style "border-bottom-width" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 5, 'border-bottom-width'))
            .toEqual('0px');

        // * the grid cell in ag-grid "Visualization 1" at "2", "5" has style "border-right-style" with value "none"
        await since(
            'Grid cell at row 2, col 5 in Visualization 1 should have style "border-right-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 5, 'border-right-style'))
            .toEqual('none');

        // * the grid cell in ag-grid "Visualization 1" at "2", "5" has style "border-right-width" with value "0px"
        await since(
            'Grid cell at row 2, col 5 in Visualization 1 should have style "border-right-width" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 5, 'border-right-width'))
            .toEqual('0px');
    });
    it('[TC88963_2] Ag grid Borders formatting, xfun', async () => {
        // Open dossier in editr mode
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > AGGrid_CreateGrid_TC71081
        await libraryPage.editDossierByUrl({
            projectId: AGGridBorderFormat1.project.id,
            dossierId: AGGridBorderFormat1.id,
        });
        // # Switch to format panel -> text&form tab and apply borders
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I switch to the "Text and Form" section on new format panel
        await baseFormatPanelReact.switchSection('Text and Form');
        // Then The segment control dropdown should be "Entire Grid" in new format panel
        await since('Segment control dropdown should be Entire Grid')
            .expect(await baseFormatPanelReact.getSegmentControlDropDownByCurrentSelection('Entire Grid'))
            .toBeTruthy();

        // # Apply borders to Column Headers
        // When I change the segment dropdown from "Entire Grid" to "Column Headers" through the new format panel
        await baseFormatPanelReact.changeSegmentControl('Entire Grid', 'Column Headers');
        // Then The segment control dropdown should be "Column Headers" in new format panel
        await since('Segment control dropdown should be Column Headers')
            .expect(await baseFormatPanelReact.getSegmentControlDropDownByCurrentSelection('Column Headers'))
            .toBeTruthy();
        // When I open the grid cell "top" border style pulldown list
        await newFormatPanelForGrid.openCellBorderStyleDropDownByPos('top');
        // And I select cell border style "hair" from the pulldown
        await newFormatPanelForGrid.selectCellBorderStyle('hair');
        // And I open the grid cell "top" border color picker
        await newFormatPanelForGrid.clickCellBorderColorBtnByPos('top');
        // And I select the built-in color "#83C962" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#83C962');
        // And I click to close the color picker
        await baseFormatPanelReact.dismissColorPicker();

        // Then the grid cell in ag-grid "Visualization 1" at "1", "2" has style "border-top-style" with value "solid"
        // And the grid cell in ag-grid "Visualization 1" at "1", "2" has style "border-top-width" with value "0.5px"
        // * the grid cell in ag-grid "Visualization 1" at "1", "2" has style "border-top-color" with value "rgba(131, 201, 98, 1)"

        // * the grid cell in ag-grid "Visualization 1" at "0", "0" has style "border-top-style" with value "solid"
        // * the grid cell in ag-grid "Visualization 1" at "0", "0" has style "border-top-width" with value "0.5px"
        // * the grid cell in ag-grid "Visualization 1" at "0", "0" has style "border-top-color" with value "rgba(131, 201, 98, 1)"
        // take screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC88963_2_01',
            'Top hair border on column header'
        );

        // # Apply borders to Row Headers
        // When I change the segment dropdown from "Column Headers" to "Row Headers" through the new format panel
        await baseFormatPanelReact.changeSegmentControl('Column Headers', 'Row Headers');
        // Then The segment control dropdown should be "Row Headers" in new format panel
        await since('Segment control dropdown should be Row Headers')
            .expect(await baseFormatPanelReact.getSegmentControlDropDownByCurrentSelection('Row Headers'))
            .toBeTruthy();

        // When I open the grid cell "bottom" border style pulldown list
        await newFormatPanelForGrid.openCellBorderStyleDropDownByPos('bottom');
        // And I select cell border style "double" from the pulldown
        await newFormatPanelForGrid.selectCellBorderStyle('double');
        // And I open the grid cell "bottom" border color picker
        await newFormatPanelForGrid.clickCellBorderColorBtnByPos('bottom');
        // And I select the built-in color "#1C8DD4" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#1C8DD4');
        // And I click to close the color picker
        await baseFormatPanelReact.dismissColorPicker();

        // Then the grid cell in ag-grid "Visualization 1" at "2", "0" has style "border-bottom-style" with value "double"
        // And the grid cell in ag-grid "Visualization 1" at "2", "0" has style "border-bottom-width" with value "3px"
        // * the grid cell in ag-grid "Visualization 1" at "2", "0" has style "border-bottom-color" with value "rgba(28, 141, 212, 1)"

        // * the grid cell in ag-grid "Visualization 1" at "2", "1" has style "border-bottom-style" with value "double"
        // * the grid cell in ag-grid "Visualization 1" at "2", "1" has style "border-bottom-width" with value "3px"
        // * the grid cell in ag-grid "Visualization 1" at "2", "1" has style "border-bottom-color" with value "rgba(28, 141, 212, 1)"
        // take screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC88963_2_02',
            'Bottom double border on row header'
        );

        // # Apply borders to Values All sets
        // When I change the segment dropdown from "Row Headers" to "Values" through the new format panel
        await baseFormatPanelReact.changeSegmentControl('Row Headers', 'Values');
        // Then The segment control dropdown should be "Values" in new format panel
        await since('Segment control dropdown should be Values')
            .expect(await baseFormatPanelReact.getSegmentControlDropDownByCurrentSelection('Values'))
            .toBeTruthy();

        // When I open the grid cell "left" border style pulldown list
        await newFormatPanelForGrid.openCellBorderStyleDropDownByPos('left');
        // And I select cell border style "solid" from the pulldown
        await newFormatPanelForGrid.selectCellBorderStyle('solid');
        // And I open the grid cell "left" border color picker
        await newFormatPanelForGrid.clickCellBorderColorBtnByPos('left');
        // And I select the built-in color "#38AE6F" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#38AE6F');
        // And I click to close the color picker
        await baseFormatPanelReact.dismissColorPicker();

        // Then the grid cell in ag-grid "Visualization 1" at "4", "2" has style "border-left-style" with value "solid"
        // And the grid cell in ag-grid "Visualization 1" at "4", "2" has style "border-left-width" with value "0.5px"
        // * the grid cell in ag-grid "Visualization 1" at "4", "2" has style "border-left-color" with value "rgba(56, 174, 111, 1)"

        // * the grid cell in ag-grid "Visualization 1" at "4", "6" has style "border-left-style" with value "solid"
        // * the grid cell in ag-grid "Visualization 1" at "4", "6" has style "border-left-width" with value "0.5px"
        // * the grid cell in ag-grid "Visualization 1" at "4", "6" has style "border-left-color" with value "rgba(56, 174, 111, 1)"
        // take screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC88963_2_03',
            'Left solid border on Values'
        );

        // # Apply thresholds
        // When I right click on element "Number of Flights" and select "Add Thresholds..." from ag-grid "Visualization 1"
        await agGridVisualization.openMenuItem('Number of Flights', 'Add Thresholds...', 'Visualization 1');

        // And I open the color band drop down menu
        await thresholdEditor.openSimpleThresholdColorBandDropDownMenu();
        // And I select the color band "Business Blue" in simple threshold editor
        await thresholdEditor.selectSimpleThresholdColorBand('Business Blue');
        // And I select the Based on metric "Number of Flights" in simple threshold editor
        await thresholdEditor.selectSimpleThresholdBasedOnObject('Number of Flights');
        // * I save and close Simple Thresholds Editor
        await thresholdEditor.saveAndCloseSimThresholdEditor();

        // Then the grid cell in ag-grid "Visualization 1" at "4", "2" has style "border-left-style" with value "solid"
        // And the grid cell in ag-grid "Visualization 1" at "4", "2" has style "border-left-width" with value "0.5px"
        // * the grid cell in ag-grid "Visualization 1" at "4", "2" has style "border-left-color" with value "rgba(56, 174, 111, 1)"

        // * the grid cell in ag-grid "Visualization 1" at "4", "3" has style "border-left-style" with value "solid"
        // * the grid cell in ag-grid "Visualization 1" at "4", "3" has style "border-left-width" with value "0.5px"
        // * the grid cell in ag-grid "Visualization 1" at "4", "3" has style "border-left-color" with value "rgba(56, 174, 111, 1)"
        // take screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC88963_2_04',
            'Xfunc with thresholds'
        );

        // # Enable Outline mode
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
        // * I expand "Layout" section
        await newFormatPanelForGrid.expandLayoutSection();
        // * I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');

        // When I expand the element at "3", "0" in outline mode from ag-grid "Visualization 1"
        await agGridVisualization.expandGroupCell(
            await agGridVisualization.getGridCellByPosition(4, 1, 'Visualization 1')
        );
        // Then the grid cell in ag-grid "Visualization 1" at "4", "3" has text "18784"
        // And the grid cell in ag-grid "Visualization 1" at "4", "3" has style "border-left-style" with value "solid"
        // * the grid cell in ag-grid "Visualization 1" at "4", "3" has style "border-left-width" with value "0.5px"
        // * the grid cell in ag-grid "Visualization 1" at "4", "3" has style "border-left-color" with value "rgba(56,174,111,1)"
        // * the grid cell in ag-grid "Visualization 1" at "4", "4" has style "border-left-style" with value "solid"
        // * the grid cell in ag-grid "Visualization 1" at "4", "4" has style "border-left-width" with value "0.5px"
        // * the grid cell in ag-grid "Visualization 1" at "4", "4" has style "border-left-color" with value "rgba(56,174,111,1)"
        // take screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC88963_2_05',
            'Xfunc with outline mode'
        );

        // When I click Enable Banding check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable banding');
        // And I pause execution for 1 seconds
        // And I expand the element at "3", "0" in outline mode from ag-grid "Visualization 1"
        // await agGridVisualization.expandGroupCell(
        //     await agGridVisualization.getGridCellByPosition(4, 1, 'Visualization 1')
        // );
        // And I pause execution for 1 seconds

        // Then the grid cell in ag-grid "Visualization 1" at "5", "1" has style "background-color" with value "rgba(248,248,248,1)"
        // And the grid cell in ag-grid "Visualization 1" at "5", "1" has style "border-bottom-style" with value "double"
        // * the grid cell in ag-grid "Visualization 1" at "5", "1" has style "border-bottom-width" with value "3px"
        // * the grid cell in ag-grid "Visualization 1" at "5", "1" has style "border-bottom-color" with value "rgba(28,141,212,1)"

        // * the grid cell in ag-grid "Visualization 1" at "5", "3" has text "4063"
        // * the grid cell in ag-grid "Visualization 1" at "5", "3" has style "border-left-style" with value "solid"
        // * the grid cell in ag-grid "Visualization 1" at "5", "3" has style "border-left-width" with value "0.5px"
        // * the grid cell in ag-grid "Visualization 1" at "4", "4" has style "border-left-color" with value "rgba(56,174,111,1)"
        // take screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC88963_2_06',
            'Xfunc with banding'
        );

        // # Duplicate Modern Grid
        // When I duplicate container "Visualization 1" through the context menu
        await agGridVisualization.duplicateContainer('Visualization 1');
        // Then The container "Visualization 1 copy" should be selected
        // And Container "Visualization 1 copy" should be on the "right" side of container "Visualization 1"

        // * the grid cell in ag-grid "Visualization 1 copy" at "0", "2" has style "border-top-style" with value "solid"
        // * the grid cell in ag-grid "Visualization 1 copy" at "0", "2" has style "border-top-width" with value "0.5px"
        // * the grid cell in ag-grid "Visualization 1 copy" at "0", "2" has style "border-top-color" with value "rgba(131,201,98,1)"

        // * the grid cell in ag-grid "Visualization 1 copy" at "3", "0" has style "border-bottom-style" with value "double"
        // * the grid cell in ag-grid "Visualization 1 copy" at "3", "0" has style "border-bottom-width" with value "3px"
        // * the grid cell in ag-grid "Visualization 1 copy" at "3", "0" has style "border-bottom-color" with value "rgba(28,141,212,1)"
        // take screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1 copy'),
            'TC88963_2_07',
            'X-func with duplicate grid'
        );

        // # Duplicate chapter
        // When I duplicate chapter "Chapter 1"
        await tocContentsPanel.MenuOnChapter('Chapter 1', 'Duplicate Chapter');
        // And The container "Visualization 1" should be selected
        await since('The container "Visualization 1" should be selected')
            .expect(await grid.isContainerSelected('Visualization 1'))
            .toBe(true);
        // Then the grid cell in ag-grid "Visualization 1 copy" at "0", "2" has style "border-top-style" with value "solid"
        // And the grid cell in ag-grid "Visualization 1 copy" at "0", "2" has style "border-top-width" with value "0.5px"
        // * the grid cell in ag-grid "Visualization 1 copy" at "0", "2" has style "border-top-color" with value "rgba(131,201,98,1)"

        // * the grid cell in ag-grid "Visualization 1 copy" at "3", "0" has style "border-bottom-style" with value "double"
        // * the grid cell in ag-grid "Visualization 1 copy" at "3", "0" has style "border-bottom-width" with value "3px"
        // * the grid cell in ag-grid "Visualization 1 copy" at "3", "0" has style "border-bottom-color" with value "rgba(28,141,212,1)"
        // * I pause execution for 2 seconds
        // take screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1 copy'),
            'TC88963_2_08',
            'X-func with duplicate chapter'
        );

        // # Change modern grid to compound grid
        // When I switch to page "Page 1" in chapter "Chapter 1" from contents panel
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        // And Page "Page 1" in chapter "Chapter 1" is the current page
        // And I change visualization "Visualization 1" to "Compound Grid" from context menu
        await baseVisualization.changeVizType('Visualization 1 copy', 'Grid', 'Compound Grid');
        // And I pause execution for 3 seconds
        // And The container "Visualization 1" should be selected
        // And I pause execution for 3 seconds
        // Then the grid cell in visualization "Visualization 1" at "2", "1" has style "border-top-width" with value "0px"
        // And the grid cell in visualization "Visualization 1" at "2", "1" has style "border-top-style" with value "none"

        // * the grid cell in visualization "Visualization 1" at "4", "1" has style "border-bottom-style" with value "double"
        // * the grid cell in visualization "Visualization 1" at "4", "1" has style "border-bottom-width" with value "1px"
        // * the grid cell in visualization "Visualization 1" at "4", "1" has style "border-bottom-color" with value "rgba(28,141,212,1)"
        // take screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1 copy'),
            'TC88963_2_09',
            'Switch to compound grid'
        );

        // # Change Compound grid to Modern grid
        // When I pause execution for 3 seconds
        // And I change visualization "Visualization 1" to "Grid (Modern)" from context menu
        await baseContainer.changeViz('Grid (Modern)', 'Visualization 1 copy', true);
        // And I pause execution for 3 seconds
        // And The container "Visualization 1" should be selected
        // And I pause execution for 3 seconds
        // Then the grid cell in ag-grid "Visualization 1" at "3", "0" has style "border-bottom-style" with value "double"
        // And the grid cell in ag-grid "Visualization 1" at "3", "0" has style "border-bottom-width" with value "3px"
        // * the grid cell in ag-grid "Visualization 1" at "3", "0" has style "border-bottom-color" with value "rgba(28,141,212,1)"
        // take screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1 copy'),
            'TC88963_2_10',
            'Switch back to AG grid'
        );
    });
    it('[BCIN-6560] Ag grid focus border for keyboard navigation', async () => {
        await libraryPage.openDossierById({
            projectId: AGGridBorderFormat1.project.id,
            dossierId: AGGridBorderFormat1.id,
        });
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await agGridVisualization.clickOnAGGridCell('AirTran Airways Corporation', 'Visualization 1');
        await browser.keys('ArrowRight');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'BCIN-6560_01',
            'Focus border for keyboard navigation'
        );
    });
});
