import * as gridConstants from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { SelectTargetInLayersPanel } from '../../../pageObjects/authoring/SelectTargetInLayersPanel.js';

describe('Compound Grid Manipulation Test: Convert, undo/redo etc', () => {
    let {
        loginPage,
        libraryPage,
        editorPanel,
        baseContainer,
        datasetPanel,
        gridAuthoring,
        newFormatPanelForGrid,
        vizPanelForGrid,
        baseFormatPanelReact,
        baseFormatPanel,
        thresholdEditor,
        editorPanelForGrid,
        toolbar,
        loadingDialog,
        agGridVisualization,
        advancedFilter,
    } = browsers.pageObj1;
    const selectTargetInLayersPanel = new SelectTargetInLayersPanel();

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

    it('[TC41291_01] Compound grid to simple grid (Threshold manipulations)', async () => {
        // Edit dossier by its ID "B9F6A25111EB238D4B550080EF95F2EA"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > AGGrid_IncrementalFetch
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridIncrementalFetch.project.id,
            dossierId: gridConstants.AGGridIncrementalFetch.id,
        });
        // When I change visualization "Visualization 1" to "Compound Grid" from context menu
        await baseContainer.changeViz('Compound Grid', 'Visualization 1', true);
        // And I click on container "Visualization 1" to select it
        await baseContainer.clickContainerByScript('Visualization 1');

        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I add "attribute" named "Month" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Month', 'attribute', 'retail-sample-data.xls');
        // And I add "attribute" named "Supplier" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Supplier', 'attribute', 'retail-sample-data.xls');
        // And I add "attribute" named "Item Category" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Item Category', 'attribute', 'retail-sample-data.xls');
        // And I add "metric" named "Cost" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');
        // And I add a column set for the compound grid
        await gridAuthoring.addColumnSet();
        // And I drag "metric" named "Units Available" from dataset "retail-sample-data.xls" to Column Set "Column Set 2" in compound grid
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ(
            'Units Available',
            'metric',
            'retail-sample-data.xls',
            'Column Set 2'
        );

        // When I open the Thresholds editor for object "Cost" from the grid visualization "Visualization 1"
        await thresholdEditor.openThresholdEditorFromViz('Cost', 'Visualization 1');
        // And I open the color band drop down menu
        await thresholdEditor.openSimpleThresholdColorBandDropDownMenu();
        // And I select the color band "Traffic Lights" in simple threshold editor
        await thresholdEditor.selectSimpleThresholdColorBand('Traffic Lights');
        // And I save and close Simple Thresholds Editor
        await thresholdEditor.saveAndCloseSimThresholdEditor();
        // Then the grid cell in visualization "Visualization 1" at "2", "4" has style "background-color" with value "rgba(236, 123, 117, 1)"
        await since(
            'Then the grid cell in visualization "Visualization 1" at "2", "4" has style "background-color" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid
                        .getGridCellByPosition('2', '4', 'Visualization 1')
                        .getCSSProperty('background-color')
                ).value
            )
            .toContain('236,123,117,1');
        // And the grid cell in visualization "Visualization 1" at "3", "2" has style "background-color" with value "rgba(246, 219, 127, 1)"
        await since(
            'Then the grid cell in visualization "Visualization 1" at "3", "2" has style "background-color" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid
                        .getGridCellByPosition('3', '2', 'Visualization 1')
                        .getCSSProperty('background-color')
                ).value
            )
            .toContain('246,219,127,1');

        // When I open the Thresholds editor for object "Units Available" from the grid visualization "Visualization 1"
        await thresholdEditor.openThresholdEditorFromCompoundGridDropzone('Units Available', 'Column Set 2');
        // And I open the color band drop down menu
        await thresholdEditor.openSimpleThresholdColorBandDropDownMenu();
        // And I select the color band "Traffic Lights" in simple threshold editor
        await thresholdEditor.selectSimpleThresholdColorBand('Traffic Lights');
        // And I save and close Simple Thresholds Editor
        await thresholdEditor.saveAndCloseSimThresholdEditor();
        // Then the grid cell in visualization "Visualization 1" at "2", "5" has style "background-color" with value "rgba(236, 123, 117, 1)"
        await since(
            'Then the grid cell in visualization "Visualization 1" at "2", "5" has style "background-color" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid
                        .getGridCellByPosition('2', '5', 'Visualization 1')
                        .getCSSProperty('background-color')
                ).value
            )
            .toContain('236,123,117,1');
        // And the grid cell in visualization "Visualization 1" at "3", "3" has style "background-color" with value "rgba(132, 200, 123, 1)"
        await since(
            'Then the grid cell in visualization "Visualization 1" at "3", "3" has style "background-color" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid
                        .getGridCellByPosition('3', '3', 'Visualization 1')
                        .getCSSProperty('background-color')
                ).value
            )
            .toContain('132,200,123,1');
        // take screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'CompoundGrid with Thresholds',
            'TC41291_01_01'
        );

        // When I change visualization "Visualization 1" to "Grid" from context menu
        await baseContainer.changeViz('Grid', 'Visualization 1', true);
        // And I click on container "Visualization 1" to select it
        await baseContainer.clickContainerByScript('Visualization 1');
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // Then The editor panel should have "attribute" named "Month" on "Rows" section
        // And The editor panel should have "attribute" named "Supplier" on "Rows" section
        // And The editor panel should have "metric" named "Cost" on "Metrics" section
        // # removed second column set metric
        // And The editor panel should not have "metric" named "Units Available" on "Metrics" section
        // take screenshot of editor panel
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'Editor panel for Normal Grid converted from Compound Grid',
            'TC41291_01_02'
        );
        // # threshold persisted for Cost
        // And the grid cell in visualization "Visualization 1" at "2", "4" has style "background-color" with value "rgba(236, 123, 117, 1)"
        // And the grid cell in visualization "Visualization 1" at "3", "2" has style "background-color" with value "rgba(246, 219, 127, 1)"
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Threshold persisted for Cost for Normal Grid converted from Compound Grid',
            'TC41291_01_03'
        );
        // # when added same metric back, no threshold
        // When I add "metric" named "Units Available" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Units Available', 'metric', 'retail-sample-data.xls');
        // And the grid cell in visualization "Visualization 1" at "2", "5" has style "background-color" with value "rgba(255, 255, 255, 1)"
        // Then the grid cell in visualization "Visualization 1" at "3", "3" has style "background-color" with value "rgba(255, 255, 255, 1)"
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Added Units Available back, no threshold',
            'TC41291_01_04'
        );
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I switch to the "Text and Form" section on new format panel
        await baseFormatPanelReact.switchSection('Text and Form');
        // Then The segment control dropdown should be "Entire Grid" in new format panel
        await since('Segment control dropdown should be Entire Grid')
            .expect(await baseFormatPanelReact.getSegmentControlDropDownByCurrentSelection('Entire Grid'))
            .toBeTruthy();
        // When I change the segment dropdown from "Entire Grid" to "Column Headers" through the new format panel
        await baseFormatPanelReact.changeSegmentControl('Entire Grid', 'Column Headers');

        // # Test fill colors on column headers (All)
        // When I change cell fill color to "#FAD47F" through new format panel
        await newFormatPanelForGrid.changeCellsFillColor('#FAD47F');
        await newFormatPanelForGrid.click({ elem: newFormatPanelForGrid.cellFillColorBtn });
        // pause 3 s
        await browser.pause(3000);
        // Then the cells fill color is "rgba(250, 212, 127, 1)" in the new format panel
        await since('The cells fill color is "rgba(250,212,127,1)" in the new format panel, while we get "#{actual}"')
            .expect((await newFormatPanelForGrid.fillColor.getCSSProperty('background-color')).value)
            .toContain('rgba(250,212,127,1)');
        // # column header changed
        // And the grid cell in visualization "Visualization 1" at "1", "1" has style "background-color" with value "rgba(250, 212, 127, 1)"
        // # rows the same
        // And the grid cell in visualization "Visualization 1" at "2", "1" has style "background-color" with value "rgba(255, 255, 255, 1)"
        // # columns stil has threshold
        // And the grid cell in visualization "Visualization 1" at "2", "4" has style "background-color" with value "rgba(236, 123, 117, 1)"
        // And the grid cell in visualization "Visualization 1" at "2", "5" has style "background-color" with value "rgba(255, 255, 255, 1)"
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Column header changed to yellow',
            'TC41291_01_05'
        );

        // When I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // # column header back to white
        // Then the grid cell in visualization "Visualization 1" at "1", "1" has style "background-color" with value "rgba(255, 255, 255, 1)"
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Column header back to white',
            'TC41291_01_06'
        );

        // # Undo adding Units Available
        // When I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // # Undo switch to Grid
        // And I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // When I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // Then The editor panel should have "metric" named "Units Available" on "Column Set 2" section
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'Editor panel for Compound Grid after undo convert',
            'TC41291_01_07'
        );
        // # threshold for Units Available still there
        // Then the grid cell in visualization "Visualization 1" at "2", "5" has style "background-color" with value "rgba(236, 123, 117, 1)"
        // # same with Cost
        // And the grid cell in visualization "Visualization 1" at "2", "4" has style "background-color" with value "rgba(236, 123, 117, 1)"
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Thresholds for Cost and Units Available after undo convert',
            'TC41291_01_08'
        );

        // # Undo threshold on Units Available
        // And I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // Then the grid cell in visualization "Visualization 1" at "2", "5" has style "background-color" with value "rgba(255, 255, 255, 1)"
        await since(
            'Then the grid cell in visualization "Visualization 1" at "2", "5" has style "background-color" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid
                        .getGridCellByPosition('2', '5', 'Visualization 1')
                        .getCSSProperty('background-color')
                ).value
            )
            .toContain('255,255,255,1');

        // # Undo threshold on Cost
        // And I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // Then the grid cell in visualization "Visualization 1" at "2", "4" has style "background-color" with value "rgba(255, 255, 255, 1)"
        await since(
            'Then the grid cell in visualization "Visualization 1" at "2", "4" has style "background-color" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid
                        .getGridCellByPosition('2', '4', 'Visualization 1')
                        .getCSSProperty('background-color')
                ).value
            )
            .toContain('255,255,255,1');

        // # Redo threshold on Cost
        // And I select "Redo" from toolbar
        await toolbar.clickButtonFromToolbar('Redo');
        // And the grid cell in visualization "Visualization 1" at "2", "4" has style "background-color" with value "rgba(236, 123, 117, 1)"
        await since(
            'Then the grid cell in visualization "Visualization 1" at "2", "4" has style "background-color" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid
                        .getGridCellByPosition('2', '4', 'Visualization 1')
                        .getCSSProperty('background-color')
                ).value
            )
            .toContain('236,123,117,1');

        // # Redo threshold on Units Available
        // And I select "Redo" from toolbar
        await toolbar.clickButtonFromToolbar('Redo');
        // Then the grid cell in visualization "Visualization 1" at "2", "5" has style "background-color" with value "rgba(236, 123, 117, 1)"
        await since(
            'Then the grid cell in visualization "Visualization 1" at "2", "5" has style "background-color" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid
                        .getGridCellByPosition('2', '5', 'Visualization 1')
                        .getCSSProperty('background-color')
                ).value
            )
            .toContain('236,123,117,1');

        // # Redo switch to Grid
        // When I select "Redo" from toolbar
        await toolbar.clickButtonFromToolbar('Redo');
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // # removed second column set metric
        // Then The editor panel should not have "metric" named "Units Available" on "Metrics" section
        await since('The editor panel should not have "metric" named "Units Available" on "Metrics" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Units Available', 'metric', 'Metrics').isExisting())
            .toBe(false);
    });

    it('[TC41291_02] Simple grid to compound grid (Column set formatting manipulations)', async () => {
        // Edit dossier by its ID "B9F6A25111EB238D4B550080EF95F2EA"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > AGGrid_IncrementalFetch
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridIncrementalFetch.project.id,
            dossierId: gridConstants.AGGridIncrementalFetch.id,
        });

        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I add "attribute" named "Month" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Month', 'attribute', 'retail-sample-data.xls');
        // And I add "attribute" named "Supplier" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Supplier', 'attribute', 'retail-sample-data.xls');
        // And I add "attribute" named "Item Category" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Item Category', 'attribute', 'retail-sample-data.xls');
        // And I add "metric" named "Cost" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');

        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I switch to the "Text and Form" section on new format panel
        await baseFormatPanelReact.switchSection('Text and Form');
        // Then The segment control dropdown should be "Entire Grid" in new format panel
        await since('Segment control dropdown should be Entire Grid')
            .expect(await baseFormatPanelReact.getSegmentControlDropDownByCurrentSelection('Entire Grid'))
            .toBeTruthy();
        // # Test font colors on column headers (All)
        // When I open the font color picker
        await newFormatPanelForGrid.clickFontColorBtn();
        // And I select the built-in color "#83C962" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#83C962');
        // And I click to close the color picker
        await baseFormatPanelReact.dismissColorPicker();
        // take screenshot of viz
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Entire grid font color changed to rgba(131, 201, 98, 1)',
            'TC41291_02_01'
        );

        // When I change visualization "Visualization 1" to "Compound Grid" from context menu
        await baseContainer.changeViz('Compound Grid', 'Visualization 1', true);
        // And I click on container "Visualization 1" to select it
        await baseContainer.clickContainerByScript('Visualization 1');
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // Then The editor panel should have "attribute" named "Month" on "Rows" section
        await since('The editor panel should have "attribute" named "Month" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Month', 'attribute', 'Rows').isExisting())
            .toBe(true);
        // And The editor panel should have "attribute" named "Supplier" on "Rows" section
        await since('The editor panel should have "attribute" named "Supplier" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Supplier', 'attribute', 'Rows').isExisting())
            .toBe(true);
        // And The editor panel should have "metric" named "Cost" on "Column Set 1" section
        await since('The editor panel should have "metric" named "Cost" on "Column Set 1" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Cost', 'metric', 'Column Set 1').isExisting())
            .toBe(true);
        // When I add a column set for the compound grid
        await gridAuthoring.addColumnSet();
        // And I drag "metric" named "Units Available" from dataset "retail-sample-data.xls" to Column Set "Column Set 2" in compound grid
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ(
            'Units Available',
            'metric',
            'retail-sample-data.xls',
            'Column Set 2'
        );
        // # Existing defect: column set 2 has default formats
        // Then the grid cell in visualization "Visualization 1" at "1", "5" has text "Units Available"
        // And the grid cell in visualization "Visualization 1" at "1", "5" has style "color" with value "rgba(53, 56, 58, 1)"
        // # values
        // And the grid cell in visualization "Visualization 1" at "2", "5" has style "color" with value "rgba(53, 56, 58, 1)"

        // When I add a column set for the compound grid
        await gridAuthoring.addColumnSet();
        // And I drag "metric" named "Revenue" from dataset "retail-sample-data.xls" to Column Set "Column Set 3" in compound grid
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ(
            'Revenue',
            'metric',
            'retail-sample-data.xls',
            'Column Set 3'
        );
        // # Existing defect: column set 2 has default formats
        // Then the grid cell in visualization "Visualization 1" at "1", "6" has text "Revenue"
        // And the grid cell in visualization "Visualization 1" at "1", "6" has style "color" with value "rgba(53, 56, 58, 1)"
        // # values
        // And the grid cell in visualization "Visualization 1" at "2", "6" has style "color" with value "rgba(53, 56, 58, 1)"
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Compound Grid with new added column sets in default formats',
            'TC41291_02_02'
        );

        // # Test formatting manipulations on each column set
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I switch to the "Text and Form" section on new format panel
        await baseFormatPanelReact.switchSection('Text and Form');
        // Then The segment control dropdown should be "Entire Grid" in new format panel
        await since('Segment control dropdown should be Entire Grid')
            .expect(await baseFormatPanelReact.getSegmentControlDropDownByCurrentSelection('Entire Grid'))
            .toBeTruthy();
        // When I change the segment dropdown from "Entire Grid" to "Values" through the new format panel
        await baseFormatPanelReact.changeSegmentControl('Entire Grid', 'Values');
        // And I change the segment dropdown from "All columns" to "Column Set 2" through the new format panel
        await baseFormatPanelReact.changeSegmentControl('All columns', 'Column Set 2');
        // When I open the font color picker
        await newFormatPanelForGrid.clickFontColorBtn();
        // And I select the built-in color "#D76322" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#D76322');
        // And I click to close the color picker
        await baseFormatPanelReact.dismissColorPicker();
        // Then the grid cell in visualization "Visualization 1" at "2", "5" has style "color" with value "rgba(215, 99, 34, 1)"

        // When I change the segment dropdown from "Column Set 2" to "Column Set 3" through the new format panel
        await baseFormatPanelReact.changeSegmentControl('Column Set 2', 'Column Set 3');
        // And I open the font color picker
        await newFormatPanelForGrid.clickFontColorBtn();
        // And I select the built-in color "#4F60D6" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#4F60D6');
        // And I click to close the color picker
        await baseFormatPanelReact.dismissColorPicker();
        // Then the grid cell in visualization "Visualization 1" at "2", "6" has style "color" with value "rgba(79, 96, 214, 1)"
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Compound Grid with column sets formatting manipulations',
            'TC41291_02_03'
        );
        // # undo change to CS 3
        // When I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // Then the grid cell in visualization "Visualization 1" at "2", "6" has style "color" with value "rgba(53, 56, 58, 1)"
        await since(
            'Then the grid cell in visualization "Visualization 1" at "2", "6" has style "color" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('2', '6', 'Visualization 1').getCSSProperty('color')).value
            )
            .toContain('53,56,58,1');

        // # undo change to CS 2
        // When I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // Then the grid cell in visualization "Visualization 1" at "2", "5" has style "color" with value "rgba(53, 56, 58, 1)"
        await since(
            'Then the grid cell in visualization "Visualization 1" at "2", "5" has style "color" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('2', '5', 'Visualization 1').getCSSProperty('color')).value
            )
            .toContain('53,56,58,1');

        // # undo addition of Revenue
        // When I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // And I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // Then the grid cell in visualization "Visualization 1" at "2", "6" is not present
        await since('The grid cell in visualization "Visualization 1" at "2", "6" is not present')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '6', 'Visualization 1').isExisting())
            .toBe(false);

        // # undo addition of Units Available
        // When I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // And I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // Then the grid cell in visualization "Visualization 1" at "2", "5" is not present
        await since('The grid cell in visualization "Visualization 1" at "2", "5" is not present')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '5', 'Visualization 1').isExisting())
            .toBe(false);

        // # undo switch to compound grid
        // When I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // # removed second column set metric
        // Then The editor panel should not have "metric" named "Units Available" on "Metrics" section
        await since('The editor panel should not have "metric" named "Units Available" on "Metrics" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Units Available', 'metric', 'Metrics').isExisting())
            .toBe(false);

        // When I select "Redo" from toolbar
        await toolbar.clickButtonFromToolbar('Redo');
        // And I select "Redo" from toolbar
        await toolbar.clickButtonFromToolbar('Redo');
        // And I select "Redo" from toolbar
        await toolbar.clickButtonFromToolbar('Redo');
        // And I select "Redo" from toolbar
        await toolbar.clickButtonFromToolbar('Redo');
        // And I select "Redo" from toolbar
        await toolbar.clickButtonFromToolbar('Redo');
        // And I select "Redo" from toolbar
        await toolbar.clickButtonFromToolbar('Redo');
        // And I select "Redo" from toolbar
        await toolbar.clickButtonFromToolbar('Redo');
        // Then The editor panel should have "metric" named "Cost" on "Column Set 1" section
        await since('The editor panel should have "metric" named "Cost" on "Column Set 1" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Cost', 'metric', 'Column Set 1').isExisting())
            .toBe(true);
        // And The editor panel should have "metric" named "Units Available" on "Column Set 2" section
        await since('The editor panel should have "metric" named "Units Available" on "Column Set 2" section')
            .expect(
                await editorPanelForGrid.getObjectFromSection('Units Available', 'metric', 'Column Set 2').isExisting()
            )
            .toBe(true);
        // And The editor panel should have "metric" named "Revenue" on "Column Set 3" section
        await since('The editor panel should have "metric" named "Revenue" on "Column Set 3" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Revenue', 'metric', 'Column Set 3').isExisting())
            .toBe(true);
        // And the grid cell in visualization "Visualization 1" at "2", "4" has style "color" with value "rgba(131, 201, 98, 1)"
        await since(
            'Then the grid cell in visualization "Visualization 1" at "2", "4" has style "color" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('2', '4', 'Visualization 1').getCSSProperty('color')).value
            )
            .toContain('131,201,98,1');
        // And the grid cell in visualization "Visualization 1" at "2", "5" has style "color" with value "rgba(215, 99, 34, 1)"
        await since(
            'Then the grid cell in visualization "Visualization 1" at "2", "5" has style "color" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('2', '5', 'Visualization 1').getCSSProperty('color')).value
            )
            .toContain('215,99,34,1');
        // And the grid cell in visualization "Visualization 1" at "2", "6" has style "color" with value "rgba(79, 96, 214, 1)"
        await since(
            'Then the grid cell in visualization "Visualization 1" at "2", "6" has style "color" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('2', '6', 'Visualization 1').getCSSProperty('color')).value
            )
            .toContain('79,96,214,1');
    });

    it('[TC41291_03] Graph with attributes/metrics to Compound grid (Sorting manipulations)', async () => {
        // Edit dossier by its ID "B9F6A25111EB238D4B550080EF95F2EA"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > AGGrid_IncrementalFetch
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridIncrementalFetch.project.id,
            dossierId: gridConstants.AGGridIncrementalFetch.id,
        });
        // When I change visualization "Visualization 1" to "Vertical Bar Chart" from context menu
        await baseContainer.changeViz('Vertical Bar Chart', 'Visualization 1', true);
        // And I click on container "Visualization 1" to select it
        await baseContainer.clickContainerByScript('Visualization 1');

        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I add "attribute" named "Item Category" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Item Category', 'attribute', 'retail-sample-data.xls');
        // And I add "attribute" named "Month" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Month', 'attribute', 'retail-sample-data.xls');
        // And I add "attribute" named "Supplier" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Supplier', 'attribute', 'retail-sample-data.xls');
        // And I add "metric" named "Cost" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');
        // Then The editor panel should have "attribute" named "Month" on "Horizontal" section
        await since('The editor panel should have "attribute" named "Month" on "Horizontal" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Month', 'attribute', 'Horizontal').isExisting())
            .toBe(true);
        // And The editor panel should have "attribute" named "Supplier" on "Horizontal" section
        await since('The editor panel should have "attribute" named "Supplier" on "Horizontal" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Supplier', 'attribute', 'Horizontal').isExisting())
            .toBe(true);
        // And The editor panel should have "attribute" named "Item Category" on "Horizontal" section
        await since('The editor panel should have "attribute" named "Item Category" on "Horizontal" section')
            .expect(
                await editorPanelForGrid.getObjectFromSection('Item Category', 'attribute', 'Horizontal').isExisting()
            )
            .toBe(true);
        // And The editor panel should have "metric" named "Cost" on "Vertical" section
        await since('The editor panel should have "metric" named "Cost" on "Vertical" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Cost', 'metric', 'Vertical').isExisting())
            .toBe(true);
        // When I sort the "attribute" named "Month" in "Sort Descending" in Editor Panel
        await editorPanelForGrid.simpleSort('Month', 'Sort Descending');
        // And I sort the "attribute" named "Supplier" in "Sort Descending" in Editor Panel
        await editorPanelForGrid.simpleSort('Supplier', 'Sort Descending');
        // And I change visualization "Visualization 1" to "Compound Grid" from context menu
        await baseContainer.changeViz('Compound Grid', 'Visualization 1', true);
        // And I click on container "Visualization 1" to select it
        await baseContainer.clickContainerByScript('Visualization 1');
        // Then the grid cell in visualization "Visualization 1" at "2", "1" has text "Dec"
        await since('The grid cell in visualization "Visualization 1" at "2", "1" has text "Dec"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getText())
            .toBe('Dec');
        // And the grid cell in visualization "Visualization 1" at "2", "2" has text "WEA"
        await since('The grid cell in visualization "Visualization 1" at "2", "2" has text "WEA"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '2', 'Visualization 1').getText())
            .toBe('WEA');
        // And the grid cell in visualization "Visualization 1" at "2", "3" has text "Alternative Movies"
        await since('The grid cell in visualization "Visualization 1" at "2", "3" has text "Alternative Movies"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '3', 'Visualization 1').getText())
            .toBe('Alternative Movies');
        // And the grid cell in visualization "Visualization 1" at "2", "4" has text "$103,263"
        await since('The grid cell in visualization "Visualization 1" at "2", "4" has text "$103,263"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '4', 'Visualization 1').getText())
            .toBe('$103,263');

        // When I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // Then The editor panel should have "attribute" named "Month" on "Rows" section
        await since('The editor panel should have "attribute" named "Month" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Month', 'attribute', 'Rows').isExisting())
            .toBe(true);
        // And The editor panel should have "attribute" named "Supplier" on "Rows" section
        await since('The editor panel should have "attribute" named "Supplier" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Supplier', 'attribute', 'Rows').isExisting())
            .toBe(true);
        // And The editor panel should have "metric" named "Cost" on "Column Set 1" section
        await since('The editor panel should have "metric" named "Cost" on "Column Set 1" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Cost', 'metric', 'Column Set 1').isExisting())
            .toBe(true);
        // When I sort the "attribute" named "Supplier" in "Sort Ascending" in Editor Panel
        await editorPanelForGrid.simpleSort('Supplier', 'Sort Ascending');
        // # even sort on Month is removed
        // Then the grid cell in visualization "Visualization 1" at "2", "1" has text "Jan"
        await since('The grid cell in visualization "Visualization 1" at "2", "1" has text "Jan"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getText())
            .toBe('Jan');
        // And the grid cell in visualization "Visualization 1" at "2", "2" has text "20th Century Fox"
        await since('The grid cell in visualization "Visualization 1" at "2", "2" has text "20th Century Fox"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '2', 'Visualization 1').getText())
            .toBe('20th Century Fox');
        // And the grid cell in visualization "Visualization 1" at "2", "3" has text "Action Movies"
        await since('The grid cell in visualization "Visualization 1" at "2", "3" has text "Action Movies"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '3', 'Visualization 1').getText())
            .toBe('Action Movies');
        // And the grid cell in visualization "Visualization 1" at "2", "4" has text "$22,386"
        await since('The grid cell in visualization "Visualization 1" at "2", "4" has text "$22,386"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '4', 'Visualization 1').getText())
            .toBe('$22,386');

        // When I sort the "attribute" named "Month" in "Sort Descending" in Editor Panel
        await editorPanelForGrid.simpleSort('Month', 'Sort Descending');
        // # month is sorted
        // Then the grid cell in visualization "Visualization 1" at "2", "1" has text "Dec"
        await since('The grid cell in visualization "Visualization 1" at "2", "1" has text "Dec"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getText())
            .toBe('Dec');
        // And the grid cell in visualization "Visualization 1" at "2", "2" has text "20th Century Fox"
        await since('The grid cell in visualization "Visualization 1" at "2", "2" has text "20th Century Fox"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '2', 'Visualization 1').getText())
            .toBe('20th Century Fox');
        // And the grid cell in visualization "Visualization 1" at "2", "3" has text "Action Movies"
        await since('The grid cell in visualization "Visualization 1" at "2", "3" has text "Action Movies"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '3', 'Visualization 1').getText())
            .toBe('Action Movies');
        // And the grid cell in visualization "Visualization 1" at "2", "4" has text "$83,711"
        await since('The grid cell in visualization "Visualization 1" at "2", "4" has text "$83,711"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '4', 'Visualization 1').getText())
            .toBe('$83,711');

        // When I sort the "attribute" named "Supplier" in "Sort Descending" in Editor Panel
        await editorPanelForGrid.simpleSort('Supplier', 'Sort Descending');
        // # sort for Month is removed again -- is this a defect?
        // Then the grid cell in visualization "Visualization 1" at "2", "1" has text "Jan"
        await since('The grid cell in visualization "Visualization 1" at "2", "1" has text "Jan"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getText())
            .toBe('Jan');
        // And the grid cell in visualization "Visualization 1" at "2", "2" has text "WEA"
        await since('The grid cell in visualization "Visualization 1" at "2", "2" has text "WEA"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '2', 'Visualization 1').getText())
            .toBe('WEA');
        // And the grid cell in visualization "Visualization 1" at "2", "3" has text "Alternative Movies"
        await since('The grid cell in visualization "Visualization 1" at "2", "3" has text "Alternative Movies"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '3', 'Visualization 1').getText())
            .toBe('Alternative Movies');
        // And the grid cell in visualization "Visualization 1" at "2", "4" has text "$72,065"
        await since('The grid cell in visualization "Visualization 1" at "2", "4" has text "$72,065"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '4', 'Visualization 1').getText())
            .toBe('$72,065');

        // # undo sort descending on Supplier
        // When I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // Then the grid cell in visualization "Visualization 1" at "2", "2" has text "20th Century Fox"
        await since('The grid cell in visualization "Visualization 1" at "2", "2" has text "20th Century Fox"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '2', 'Visualization 1').getText())
            .toBe('20th Century Fox');
        // And the grid cell in visualization "Visualization 1" at "2", "1" has text "Dec"
        await since('The grid cell in visualization "Visualization 1" at "2", "1" has text "Dec"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getText())
            .toBe('Dec');

        // # undo sort descending on Month
        // When I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // Then the grid cell in visualization "Visualization 1" at "2", "1" has text "Jan"
        await since('The grid cell in visualization "Visualization 1" at "2", "1" has text "Jan"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getText())
            .toBe('Jan');
        // And the grid cell in visualization "Visualization 1" at "2", "2" has text "20th Century Fox"
        await since('The grid cell in visualization "Visualization 1" at "2", "2" has text "20th Century Fox"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '2', 'Visualization 1').getText())
            .toBe('20th Century Fox');

        // # undo sort ascending on Supplier
        // When I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // Then the grid cell in visualization "Visualization 1" at "2", "1" has text "Dec"
        await since('The grid cell in visualization "Visualization 1" at "2", "1" has text "Dec"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getText())
            .toBe('Dec');
        // And the grid cell in visualization "Visualization 1" at "2", "2" has text "WEA"
        await since('The grid cell in visualization "Visualization 1" at "2", "2" has text "WEA"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '2', 'Visualization 1').getText())
            .toBe('WEA');

        // # undo switch to Compound Grid
        // When I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // Then The editor panel should have "attribute" named "Month" on "Horizontal" section
        await since('The editor panel should have "attribute" named "Month" on "Horizontal" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Month', 'attribute', 'Horizontal').isExisting())
            .toBe(true);
        // And The editor panel should have "attribute" named "Supplier" on "Horizontal" section
        await since('The editor panel should have "attribute" named "Supplier" on "Horizontal" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Supplier', 'attribute', 'Horizontal').isExisting())
            .toBe(true);
        // And The editor panel should have "attribute" named "Item Category" on "Horizontal" section
        await since('The editor panel should have "attribute" named "Item Category" on "Horizontal" section')
            .expect(
                await editorPanelForGrid.getObjectFromSection('Item Category', 'attribute', 'Horizontal').isExisting()
            )
            .toBe(true);
        // And The editor panel should have "metric" named "Cost" on "Vertical" section
        await since('The editor panel should have "metric" named "Cost" on "Vertical" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Cost', 'metric', 'Vertical').isExisting())
            .toBe(true);

        // When I select "Redo" from toolbar
        await toolbar.clickButtonFromToolbar('Redo');
        // And I select "Redo" from toolbar
        await toolbar.clickButtonFromToolbar('Redo');
        // And I select "Redo" from toolbar
        await toolbar.clickButtonFromToolbar('Redo');
        // And I select "Redo" from toolbar
        await toolbar.clickButtonFromToolbar('Redo');
        // Then the grid cell in visualization "Visualization 1" at "2", "1" has text "Jan"
        await since('The grid cell in visualization "Visualization 1" at "2", "1" has text "Jan"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getText())
            .toBe('Jan');
        // And the grid cell in visualization "Visualization 1" at "2", "2" has text "WEA"
        await since('The grid cell in visualization "Visualization 1" at "2", "2" has text "WEA"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '2', 'Visualization 1').getText())
            .toBe('WEA');
        // And the grid cell in visualization "Visualization 1" at "2", "3" has text "Alternative Movies"
        await since('The grid cell in visualization "Visualization 1" at "2", "3" has text "Alternative Movies"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '3', 'Visualization 1').getText())
            .toBe('Alternative Movies');
        // And the grid cell in visualization "Visualization 1" at "2", "4" has text "$72,065"
        await since('The grid cell in visualization "Visualization 1" at "2", "4" has text "$72,065"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '4', 'Visualization 1').getText())
            .toBe('$72,065');
    });

    it('[TC41291_04] Compound grid with attributes/metrics to Graph', async () => {
        // Edit dossier by its ID "B9F6A25111EB238D4B550080EF95F2EA"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > AGGrid_IncrementalFetch
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridIncrementalFetch.project.id,
            dossierId: gridConstants.AGGridIncrementalFetch.id,
        });
        // And I change visualization "Visualization 1" to "Compound Grid" from context menu
        await baseContainer.changeViz('Compound Grid', 'Visualization 1', true);
        // And I click on container "Visualization 1" to select it
        await baseContainer.clickContainerByScript('Visualization 1');

        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I add "attribute" named "Month" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Month', 'attribute', 'retail-sample-data.xls');
        // And I add "attribute" named "Supplier" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Supplier', 'attribute', 'retail-sample-data.xls');
        // And I add "attribute" named "Item Category" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Item Category', 'attribute', 'retail-sample-data.xls');
        // And I add "metric" named "Cost" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');
        // And I add a column set for the compound grid
        await gridAuthoring.addColumnSet();
        // And I drag "metric" named "Units Available" from dataset "retail-sample-data.xls" to Column Set "Column Set 2" in compound grid
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ(
            'Units Available',
            'metric',
            'retail-sample-data.xls',
            'Column Set 2'
        );

        // When I sort the "attribute" named "Month" in "Sort Descending" in Editor Panel
        await editorPanelForGrid.simpleSort('Month', 'Sort Descending');
        // And I sort the "attribute" named "Supplier" in "Sort Descending" in Editor Panel
        await editorPanelForGrid.simpleSort('Supplier', 'Sort Descending');
        // # sort for month is removed
        // Then the grid cell in visualization "Visualization 1" at "2", "1" has text "Jan"
        await since('The grid cell in visualization "Visualization 1" at "2", "1" has text "Jan"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getText())
            .toBe('Jan');
        // And the grid cell in visualization "Visualization 1" at "2", "2" has text "WEA"
        await since('The grid cell in visualization "Visualization 1" at "2", "2" has text "WEA"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '2', 'Visualization 1').getText())
            .toBe('WEA');
        // And the grid cell in visualization "Visualization 1" at "2", "3" has text "Alternative Movies"
        await since('The grid cell in visualization "Visualization 1" at "2", "3" has text "Alternative Movies"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '3', 'Visualization 1').getText())
            .toBe('Alternative Movies');
        // And the grid cell in visualization "Visualization 1" at "2", "4" has text "$72,065"
        await since('The grid cell in visualization "Visualization 1" at "2", "4" has text "$72,065"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '4', 'Visualization 1').getText())
            .toBe('$72,065');
        // When I change visualization "Visualization 1" to "Vertical Clustered Bar Chart" from context menu
        await baseContainer.changeViz('Vertical Clustered Bar Chart', 'Visualization 1', true);
        // And I click on container "Visualization 1" to select it
        await baseContainer.clickContainerByScript('Visualization 1');
        // Then The editor panel should have "attribute" named "Month" on "Horizontal" section
        await since('The editor panel should have "attribute" named "Month" on "Horizontal" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Month', 'attribute', 'Horizontal').isExisting())
            .toBe(true);
        // And The editor panel should have "attribute" named "Supplier" on "Horizontal" section
        await since('The editor panel should have "attribute" named "Supplier" on "Horizontal" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Supplier', 'attribute', 'Horizontal').isExisting())
            .toBe(true);
        // And The editor panel should have "attribute" named "Item Category" on "Break By" section
        await since('The editor panel should have "attribute" named "Item Category" on "Break By" section')
            .expect(
                await editorPanelForGrid.getObjectFromSection('Item Category', 'attribute', 'Break By').isExisting()
            )
            .toBe(true);
        // And The editor panel should have "metric" named "Cost" on "Vertical" section
        await since('The editor panel should have "metric" named "Cost" on "Vertical" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Cost', 'metric', 'Vertical').isExisting())
            .toBe(true);
        // # metric in column set 2 dropped
        // And The editor panel should not have "metric" named "Units Available" on "Vertical" section
        await since('The editor panel should not have "metric" named "Units Available" on "Vertical" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Units Available', 'metric', 'Vertical').isExisting())
            .toBe(false);
        // # undo switch to Bar Chart
        // When I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // Then The editor panel should have "attribute" named "Month" on "Rows" section
        await since('The editor panel should have "attribute" named "Month" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Month', 'attribute', 'Rows').isExisting())
            .toBe(true);
        // And The editor panel should have "attribute" named "Supplier" on "Rows" section
        await since('The editor panel should have "attribute" named "Supplier" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Supplier', 'attribute', 'Rows').isExisting())
            .toBe(true);
        // And The editor panel should have "attribute" named "Item Category" on "Rows" section
        await since('The editor panel should have "attribute" named "Item Category" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Item Category', 'attribute', 'Rows').isExisting())
            .toBe(true);
        // And The editor panel should have "metric" named "Cost" on "Column Set 1" section
        await since('The editor panel should have "metric" named "Cost" on "Column Set 1" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Cost', 'metric', 'Column Set 1').isExisting())
            .toBe(true);
        // And The editor panel should have "metric" named "Units Available" on "Column Set 2" section
        await since('The editor panel should have "metric" named "Units Available" on "Column Set 2" section')
            .expect(
                await editorPanelForGrid.getObjectFromSection('Units Available', 'metric', 'Column Set 2').isExisting()
            )
            .toBe(true);
        // When I select "Redo" from toolbar
        await toolbar.clickButtonFromToolbar('Redo');
        // Then The editor panel should have "attribute" named "Month" on "Horizontal" section
        await since('The editor panel should have "attribute" named "Month" on "Horizontal" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Month', 'attribute', 'Horizontal').isExisting())
            .toBe(true);
        // And The editor panel should have "attribute" named "Supplier" on "Horizontal" section
        await since('The editor panel should have "attribute" named "Supplier" on "Horizontal" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Supplier', 'attribute', 'Horizontal').isExisting())
            .toBe(true);
        // And The editor panel should have "attribute" named "Item Category" on "Break By" section
        await since('The editor panel should have "attribute" named "Item Category" on "Break By" section')
            .expect(
                await editorPanelForGrid.getObjectFromSection('Item Category', 'attribute', 'Break By').isExisting()
            )
            .toBe(true);
        // And The editor panel should have "metric" named "Cost" on "Vertical" section
        await since('The editor panel should have "metric" named "Cost" on "Vertical" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Cost', 'metric', 'Vertical').isExisting())
            .toBe(true);
        //  # metric in column set 2 dropped
        // And The editor panel should not have "metric" named "Units Available" on "Vertical" section
        await since('The editor panel should not have "metric" named "Units Available" on "Vertical" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Units Available', 'metric', 'Vertical').isExisting())
            .toBe(false);
        // When I add "metric" named "Units Available" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Units Available', 'metric', 'retail-sample-data.xls');
        // Then The editor panel should have "metric" named "Units Available" on "Vertical" section
        await since('The editor panel should have "metric" named "Units Available" on "Vertical" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Units Available', 'metric', 'Vertical').isExisting())
            .toBe(true);

        // When I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // And I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // Then The editor panel should have "attribute" named "Month" on "Rows" section
        await since('The editor panel should have "attribute" named "Month" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Month', 'attribute', 'Rows').isExisting())
            .toBe(true);
        // And The editor panel should have "attribute" named "Supplier" on "Rows" section
        await since('The editor panel should have "attribute" named "Supplier" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Supplier', 'attribute', 'Rows').isExisting())
            .toBe(true);
        // And The editor panel should have "attribute" named "Item Category" on "Rows" section
        await since('The editor panel should have "attribute" named "Item Category" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Item Category', 'attribute', 'Rows').isExisting())
            .toBe(true);
        // And The editor panel should have "metric" named "Cost" on "Column Set 1" section
        await since('The editor panel should have "metric" named "Cost" on "Column Set 1" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Cost', 'metric', 'Column Set 1').isExisting())
            .toBe(true);
        // And The editor panel should have "metric" named "Units Available" on "Column Set 2" section
        await since('The editor panel should have "metric" named "Units Available" on "Column Set 2" section')
            .expect(
                await editorPanelForGrid.getObjectFromSection('Units Available', 'metric', 'Column Set 2').isExisting()
            )
            .toBe(true);
        // # last sort is kept
        // And the grid cell in visualization "Visualization 1" at "2", "1" has text "Jan"
        await since('The grid cell in visualization "Visualization 1" at "2", "1" has text "Jan"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getText())
            .toBe('Jan');
        // And the grid cell in visualization "Visualization 1" at "2", "2" has text "WEA"
        await since('The grid cell in visualization "Visualization 1" at "2", "2" has text "WEA"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '2', 'Visualization 1').getText())
            .toBe('WEA');
        // And the grid cell in visualization "Visualization 1" at "2", "3" has text "Alternative Movies"
        await since('The grid cell in visualization "Visualization 1" at "2", "3" has text "Alternative Movies"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '3', 'Visualization 1').getText())
            .toBe('Alternative Movies');
        // And the grid cell in visualization "Visualization 1" at "2", "4" has text "$72,065"
        await since('The grid cell in visualization "Visualization 1" at "2", "4" has text "$72,065"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '4', 'Visualization 1').getText())
            .toBe('$72,065');
    });

    it('[TC41291_05] Compound grid with metrics to Simple Grid (Number Formatting manipulations)', async () => {
        // Edit dossier by its ID "B9F6A25111EB238D4B550080EF95F2EA"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > AGGrid_IncrementalFetch
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridIncrementalFetch.project.id,
            dossierId: gridConstants.AGGridIncrementalFetch.id,
        });
        // And I change visualization "Visualization 1" to "Compound Grid" from context menu
        await baseContainer.changeViz('Compound Grid', 'Visualization 1', true);
        // And I click on container "Visualization 1" to select it
        await baseContainer.clickContainerByScript('Visualization 1');

        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I add "metric" named "Cost" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');
        // And I add "metric" named "Revenue" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Revenue', 'metric', 'retail-sample-data.xls');

        // And I add a column set for the compound grid
        await gridAuthoring.addColumnSet();
        // And I drag "metric" named "Units Available" from dataset "retail-sample-data.xls" to Column Set "Column Set 2" in compound grid
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ(
            'Units Available',
            'metric',
            'retail-sample-data.xls',
            'Column Set 2'
        );
        // Then the grid cell in visualization "Visualization 1" at "2", "1" has text "$165,880,424"
        await since('The grid cell in visualization "Visualization 1" at "2", "1" has text "$165,880,424"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getText())
            .toBe('$165,880,424');
        // And the grid cell in visualization "Visualization 1" at "2", "2" has text "$246,389,148"
        await since('The grid cell in visualization "Visualization 1" at "2", "2" has text "$246,389,148"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '2', 'Visualization 1').getText())
            .toBe('$246,389,148');
        // And the grid cell in visualization "Visualization 1" at "2", "3" has text "13,098,888"
        await since('The grid cell in visualization "Visualization 1" at "2", "3" has text "13,098,888"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '3', 'Visualization 1').getText())
            .toBe('13,098,888');

        // When I right click on object "Cost" from dropzone "Column Set 1" and select "Number Format"
        await vizPanelForGrid.selectContextMenuOptionFromObjectinDZ('Cost', 'Column Set 1', 'Number Format');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // And I select "Fixed" from the drop down in the Number Format context menu
        await vizPanelForGrid.selectNumberFormatFromDropdown('Fixed');
        // And I click the "OK" button in the context menu to close it
        await vizPanelForGrid.clickContextMenuButton('OK');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then the grid cell in visualization "Visualization 1" at "2", "1" has text "165,880,424"
        await since('The grid cell in visualization "Visualization 1" at "2", "1" has text "165,880,424"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getText())
            .toBe('165,880,424');
        // And the grid cell in visualization "Visualization 1" at "2", "2" has text "$246,389,148"
        await since('The grid cell in visualization "Visualization 1" at "2", "2" has text "$246,389,148"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '2', 'Visualization 1').getText())
            .toBe('$246,389,148');

        // When I right click on object "Units Available" from dropzone "Column Set 2" and select "Number Format"
        await vizPanelForGrid.selectContextMenuOptionFromObjectinDZ('Units Available', 'Column Set 2', 'Number Format');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then I pause execution for 3 seconds
        // And I select "Fixed" from the drop down in the Number Format context menu
        await vizPanelForGrid.selectNumberFormatFromDropdown('Fixed');
        // And I toggle the 1000 separator in the Number Format context menu
        await vizPanelForGrid.toggleNfThousandSeparator();
        // And I click the "OK" button in the context menu to close it
        await vizPanelForGrid.clickContextMenuButton('OK');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then the grid cell in visualization "Visualization 1" at "2", "3" has text "13098888"
        await since('The grid cell in visualization "Visualization 1" at "2", "3" has text "13098888"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '3', 'Visualization 1').getText())
            .toBe('13098888');

        // When I change visualization "Visualization 1" to "Grid" from context menu
        await baseContainer.changeViz('Grid', 'Visualization 1', true);
        // And I click on container "Visualization 1" to select it
        await baseContainer.clickContainerByScript('Visualization 1');
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // Then The editor panel should have "metric" named "Cost" on "Metrics" section
        await since('The editor panel should have "metric" named "Cost" on "Metrics" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Cost', 'metric', 'Metrics').isExisting())
            .toBe(true);
        // And The editor panel should have "metric" named "Revenue" on "Metrics" section
        await since('The editor panel should have "metric" named "Revenue" on "Metrics" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Revenue', 'metric', 'Metrics').isExisting())
            .toBe(true);
        // # removed second column set metric
        // And The editor panel should not have "metric" named "Units Available" on "Metrics" section
        await since('The editor panel should not have "metric" named "Units Available" on "Metrics" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Units Available', 'metric', 'Metrics').isExisting())
            .toBe(false);

        // # number formatting kept
        // Then the grid cell in visualization "Visualization 1" at "2", "1" has text "165,880,424"
        await since('The grid cell in visualization "Visualization 1" at "2", "1" has text "165,880,424"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getText())
            .toBe('165,880,424');
        // And the grid cell in visualization "Visualization 1" at "2", "2" has text "$246,389,148"
        await since('The grid cell in visualization "Visualization 1" at "2", "2" has text "$246,389,148"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '2', 'Visualization 1').getText())
            .toBe('$246,389,148');

        // When I add "metric" named "Units Available" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Units Available', 'metric', 'retail-sample-data.xls');
        // # number formatting is back to default for added metric
        // Then the grid cell in visualization "Visualization 1" at "2", "3" has text "13,098,888"
        await since('The grid cell in visualization "Visualization 1" at "2", "3" has text "13,098,888"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '3', 'Visualization 1').getText())
            .toBe('13,098,888');

        // When I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // And I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // Then The editor panel should have "metric" named "Units Available" on "Column Set 2" section
        await since('The editor panel should have "metric" named "Units Available" on "Column Set 2" section')
            .expect(
                await editorPanelForGrid.getObjectFromSection('Units Available', 'metric', 'Column Set 2').isExisting()
            )
            .toBe(true);
        // Then the grid cell in visualization "Visualization 1" at "2", "1" has text "165,880,424"
        await since('The grid cell in visualization "Visualization 1" at "2", "1" has text "165,880,424"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getText())
            .toBe('165,880,424');
        // And the grid cell in visualization "Visualization 1" at "2", "2" has text "$246,389,148"
        await since('The grid cell in visualization "Visualization 1" at "2", "2" has text "$246,389,148"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '2', 'Visualization 1').getText())
            .toBe('$246,389,148');
        // And the grid cell in visualization "Visualization 1" at "2", "3" has text "13098888"
        await since('The grid cell in visualization "Visualization 1" at "2", "3" has text "13098888"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '3', 'Visualization 1').getText())
            .toBe('13098888');
    });

    it('[TC41291_06] Compound grid with metrics to Graph (Number Formatting manipulations)', async () => {
        // Edit dossier by its ID "B9F6A25111EB238D4B550080EF95F2EA"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > AGGrid_IncrementalFetch
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridIncrementalFetch.project.id,
            dossierId: gridConstants.AGGridIncrementalFetch.id,
        });
        // And I change visualization "Visualization 1" to "Compound Grid" from context menu
        await baseContainer.changeViz('Compound Grid', 'Visualization 1', true);
        // And I click on container "Visualization 1" to select it
        await baseContainer.clickContainerByScript('Visualization 1');

        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I add "metric" named "Cost" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');
        // And I add "metric" named "Revenue" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Revenue', 'metric', 'retail-sample-data.xls');

        // And I add a column set for the compound grid
        await gridAuthoring.addColumnSet();
        // And I drag "metric" named "Units Available" from dataset "retail-sample-data.xls" to Column Set "Column Set 2" in compound grid
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ(
            'Units Available',
            'metric',
            'retail-sample-data.xls',
            'Column Set 2'
        );
        // Then the grid cell in visualization "Visualization 1" at "2", "1" has text "$165,880,424"
        await since('The grid cell in visualization "Visualization 1" at "2", "1" has text "$165,880,424"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getText())
            .toBe('$165,880,424');
        // And the grid cell in visualization "Visualization 1" at "2", "2" has text "$246,389,148"
        await since('The grid cell in visualization "Visualization 1" at "2", "2" has text "$246,389,148"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '2', 'Visualization 1').getText())
            .toBe('$246,389,148');
        // And the grid cell in visualization "Visualization 1" at "2", "3" has text "13,098,888"
        await since('The grid cell in visualization "Visualization 1" at "2", "3" has text "13,098,888"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '3', 'Visualization 1').getText())
            .toBe('13,098,888');

        // When I right click on object "Cost" from dropzone "Column Set 1" and select "Number Format"
        await vizPanelForGrid.selectContextMenuOptionFromObjectinDZ('Cost', 'Column Set 1', 'Number Format');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // And I select "Fixed" from the drop down in the Number Format context menu
        await vizPanelForGrid.selectNumberFormatFromDropdown('Fixed');
        // And I click the "OK" button in the context menu to close it
        await vizPanelForGrid.clickContextMenuButton('OK');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then the grid cell in visualization "Visualization 1" at "2", "1" has text "165,880,424"
        await since('The grid cell in visualization "Visualization 1" at "2", "1" has text "165,880,424"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getText())
            .toBe('165,880,424');
        // And the grid cell in visualization "Visualization 1" at "2", "2" has text "$246,389,148"
        await since('The grid cell in visualization "Visualization 1" at "2", "2" has text "$246,389,148"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '2', 'Visualization 1').getText())
            .toBe('$246,389,148');

        // When I right click on object "Units Available" from dropzone "Column Set 2" and select "Number Format"
        await vizPanelForGrid.selectContextMenuOptionFromObjectinDZ('Units Available', 'Column Set 2', 'Number Format');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then I pause execution for 3 seconds
        // And I select "Fixed" from the drop down in the Number Format context menu
        await vizPanelForGrid.selectNumberFormatFromDropdown('Fixed');
        // And I toggle the 1000 separator in the Number Format context menu
        await vizPanelForGrid.toggleNfThousandSeparator();
        // And I click the "OK" button in the context menu to close it
        await vizPanelForGrid.clickContextMenuButton('OK');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then the grid cell in visualization "Visualization 1" at "2", "3" has text "13098888"
        await since('The grid cell in visualization "Visualization 1" at "2", "3" has text "13098888"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '3', 'Visualization 1').getText())
            .toBe('13098888');

        // When I change visualization "Visualization 1" to "Bubble Chart" from context menu
        await baseContainer.changeViz('Bubble Chart', 'Visualization 1', true);
        // And I click on container "Visualization 1" to select it
        await baseContainer.clickContainerByScript('Visualization 1');
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // Then The editor panel should have "metric" named "Cost" on "Vertical" section
        await since('The editor panel should have "metric" named "Cost" on "Vertical" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Cost', 'metric', 'Vertical').isExisting())
            .toBe(true);
        // And The editor panel should have "metric" named "Revenue" on "Horizontal" section
        await since('The editor panel should have "metric" named "Revenue" on "Horizontal" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Revenue', 'metric', 'Horizontal').isExisting())
            .toBe(true);
        // # metric in column set 2 dropped
        // And The editor panel should not have "metric" named "Units Available" on "Vertical" section
        await since('The editor panel should not have "metric" named "Units Available" on "Vertical" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Units Available', 'metric', 'Vertical').isExisting())
            .toBe(false);
        // And The editor panel should not have "metric" named "Units Available" on "Horizontal" section
        await since('The editor panel should not have "metric" named "Units Available" on "Horizontal" section')
            .expect(
                await editorPanelForGrid.getObjectFromSection('Units Available', 'metric', 'Horizontal').isExisting()
            )
            .toBe(false);
        // And The editor panel should not have "metric" named "Units Available" on "Break By" section
        await since('The editor panel should not have "metric" named "Units Available" on "Break By" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Units Available', 'metric', 'Break By').isExisting())
            .toBe(false);
        // And The editor panel should not have "metric" named "Units Available" on "Color By" section
        await since('The editor panel should not have "metric" named "Units Available" on "Color By" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Units Available', 'metric', 'Color By').isExisting())
            .toBe(false);
        // When I right click on object "Revenue" from dropzone "Horizontal" and select "Number Format"
        await vizPanelForGrid.selectContextMenuOptionFromObjectinDZ('Revenue', 'Horizontal', 'Number Format');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then I pause execution for 3 seconds
        // And I select "Currency" from the drop down in the Number Format context menu
        await vizPanelForGrid.selectNumberFormatFromDropdown('Currency');
        // And I select currency position "Right" from the drop down in the Number Format context menu
        await vizPanelForGrid.selectNfCurrencyPositionFromDropdown('Right');
        // And I click the "OK" button in the context menu to close it
        await vizPanelForGrid.clickContextMenuButton('OK');
        // # undo formatting and switch to Bubble
        // And I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // And I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');

        // # number formatting kept
        // Then the grid cell in visualization "Visualization 1" at "2", "1" has text "165,880,424"
        await since('The grid cell in visualization "Visualization 1" at "2", "1" has text "165,880,424"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getText())
            .toBe('165,880,424');
        // And the grid cell in visualization "Visualization 1" at "2", "2" has text "$246,389,148"
        await since('The grid cell in visualization "Visualization 1" at "2", "2" has text "$246,389,148"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '2', 'Visualization 1').getText())
            .toBe('$246,389,148');
        // And the grid cell in visualization "Visualization 1" at "2", "3" has text "13098888"
        await since('The grid cell in visualization "Visualization 1" at "2", "3" has text "13098888"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '3', 'Visualization 1').getText())
            .toBe('13098888');
        // When I select "Redo" from toolbar
        await toolbar.clickButtonFromToolbar('Redo');
        // Then The editor panel should have "metric" named "Cost" on "Vertical" section
        await since('The editor panel should have "metric" named "Cost" on "Vertical" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Cost', 'metric', 'Vertical').isExisting())
            .toBe(true);
        // And The editor panel should have "metric" named "Revenue" on "Horizontal" section
        await since('The editor panel should have "metric" named "Revenue" on "Horizontal" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Revenue', 'metric', 'Horizontal').isExisting())
            .toBe(true);
        // # metric in column set 2 dropped
        // And The editor panel should not have "metric" named "Units Available" on "Vertical" section
        await since('The editor panel should not have "metric" named "Units Available" on "Vertical" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Units Available', 'metric', 'Vertical').isExisting())
            .toBe(false);
        // And The editor panel should not have "metric" named "Units Available" on "Horizontal" section
        await since('The editor panel should not have "metric" named "Units Available" on "Horizontal" section')
            .expect(
                await editorPanelForGrid.getObjectFromSection('Units Available', 'metric', 'Horizontal').isExisting()
            )
            .toBe(false);
        // And The editor panel should not have "metric" named "Units Available" on "Break By" section
        await since('The editor panel should not have "metric" named "Units Available" on "Break By" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Units Available', 'metric', 'Break By').isExisting())
            .toBe(false);
    });

    it('[TC41291_07] Simple grid with metrics to Compound Grid (Number Formatting manipulations)', async () => {
        // Edit dossier by its ID "B9F6A25111EB238D4B550080EF95F2EA"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > AGGrid_IncrementalFetch
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridIncrementalFetch.project.id,
            dossierId: gridConstants.AGGridIncrementalFetch.id,
        });

        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I add "metric" named "Cost" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');
        // And I add "metric" named "Revenue" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Revenue', 'metric', 'retail-sample-data.xls');

        // Then the grid cell in visualization "Visualization 1" at "2", "1" has text "$165,880,424"
        await since('The grid cell in visualization "Visualization 1" at "2", "1" has text "$165,880,424"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getText())
            .toBe('$165,880,424');
        // And the grid cell in visualization "Visualization 1" at "2", "2" has text "$246,389,148"
        await since('The grid cell in visualization "Visualization 1" at "2", "2" has text "$246,389,148"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '2', 'Visualization 1').getText())
            .toBe('$246,389,148');
        // And I change visualization "Visualization 1" to "Compound Grid" from context menu
        await baseContainer.changeViz('Compound Grid', 'Visualization 1', true);
        // And I click on container "Visualization 1" to select it
        await baseContainer.clickContainerByScript('Visualization 1');

        // And I add a column set for the compound grid
        await gridAuthoring.addColumnSet();
        // And I drag "metric" named "Units Available" from dataset "retail-sample-data.xls" to Column Set "Column Set 2" in compound grid
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ(
            'Units Available',
            'metric',
            'retail-sample-data.xls',
            'Column Set 2'
        );

        // And the grid cell in visualization "Visualization 1" at "2", "3" has text "13,098,888"
        await since('The grid cell in visualization "Visualization 1" at "2", "3" has text "13,098,888"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '3', 'Visualization 1').getText())
            .toBe('13,098,888');

        // When I right click on object "Cost" from dropzone "Column Set 1" and select "Number Format"
        await vizPanelForGrid.selectContextMenuOptionFromObjectinDZ('Cost', 'Column Set 1', 'Number Format');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // And I select "Fixed" from the drop down in the Number Format context menu
        await vizPanelForGrid.selectNumberFormatFromDropdown('Fixed');
        // And I click the "OK" button in the context menu to close it
        await vizPanelForGrid.clickContextMenuButton('OK');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then the grid cell in visualization "Visualization 1" at "2", "1" has text "165,880,424"
        await since('The grid cell in visualization "Visualization 1" at "2", "1" has text "165,880,424"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getText())
            .toBe('165,880,424');
        // And the grid cell in visualization "Visualization 1" at "2", "2" has text "$246,389,148"
        await since('The grid cell in visualization "Visualization 1" at "2", "2" has text "$246,389,148"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '2', 'Visualization 1').getText())
            .toBe('$246,389,148');

        // When I right click on object "Units Available" from dropzone "Column Set 2" and select "Number Format"
        await vizPanelForGrid.selectContextMenuOptionFromObjectinDZ('Units Available', 'Column Set 2', 'Number Format');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then I pause execution for 3 seconds
        // And I select "Fixed" from the drop down in the Number Format context menu
        await vizPanelForGrid.selectNumberFormatFromDropdown('Fixed');
        // And I toggle the 1000 separator in the Number Format context menu
        await vizPanelForGrid.toggleNfThousandSeparator();
        // And I click the "OK" button in the context menu to close it
        await vizPanelForGrid.clickContextMenuButton('OK');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then the grid cell in visualization "Visualization 1" at "2", "3" has text "13098888"
        await since('The grid cell in visualization "Visualization 1" at "2", "3" has text "13098888"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '3', 'Visualization 1').getText())
            .toBe('13098888');

        // And I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // And I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // And I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // And I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // And I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // Then The editor panel should not have "metric" named "Units Available" on "Metrics" section
        await since('The editor panel should not have "metric" named "Units Available" on "Metrics" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Units Available', 'metric', 'Metrics').isExisting())
            .toBe(false);

        // When I select "Redo" from toolbar
        await toolbar.clickButtonFromToolbar('Redo');
        // And I select "Redo" from toolbar
        await toolbar.clickButtonFromToolbar('Redo');
        // And I select "Redo" from toolbar
        await toolbar.clickButtonFromToolbar('Redo');
        // And I select "Redo" from toolbar
        await toolbar.clickButtonFromToolbar('Redo');
        // And I select "Redo" from toolbar
        await toolbar.clickButtonFromToolbar('Redo');
        // Then The editor panel should have "metric" named "Units Available" on "Column Set 2" section
        await since('The editor panel should have "metric" named "Units Available" on "Column Set 2" section')
            .expect(
                await editorPanelForGrid.getObjectFromSection('Units Available', 'metric', 'Column Set 2').isExisting()
            )
            .toBe(true);
        // And the grid cell in visualization "Visualization 1" at "2", "1" has text "165,880,424"
        await since('The grid cell in visualization "Visualization 1" at "2", "1" has text "165,880,424"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getText())
            .toBe('165,880,424');
        // And the grid cell in visualization "Visualization 1" at "2", "2" has text "$246,389,148"
        await since('The grid cell in visualization "Visualization 1" at "2", "2" has text "$246,389,148"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '2', 'Visualization 1').getText())
            .toBe('$246,389,148');
        // And the grid cell in visualization "Visualization 1" at "2", "3" has text "13098888"
        await since('The grid cell in visualization "Visualization 1" at "2", "3" has text "13098888"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '3', 'Visualization 1').getText())
            .toBe('13098888');
    });

    it('[TC41291_08] Graph with metrics to Compound Grid', async () => {
        // Edit dossier by its ID "B9F6A25111EB238D4B550080EF95F2EA"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > AGGrid_IncrementalFetch
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridIncrementalFetch.project.id,
            dossierId: gridConstants.AGGridIncrementalFetch.id,
        });

        // And I change visualization "Visualization 1" to "Bubble Chart" from context menu
        await baseContainer.changeViz('Bubble Chart', 'Visualization 1', true);
        // And I click on container "Visualization 1" to select it
        await baseContainer.clickContainerByScript('Visualization 1');

        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I add "metric" named "Cost" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');
        // And I add "metric" named "Revenue" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Revenue', 'metric', 'retail-sample-data.xls');
        // And I add "metric" named "Units Available" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Units Available', 'metric', 'retail-sample-data.xls');
        // Then The editor panel should have "metric" named "Cost" on "Vertical" section
        await since('The editor panel should have "metric" named "Cost" on "Vertical" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Cost', 'metric', 'Vertical').isExisting())
            .toBe(true);
        // And The editor panel should have "metric" named "Revenue" on "Horizontal" section
        await since('The editor panel should have "metric" named "Revenue" on "Horizontal" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Revenue', 'metric', 'Horizontal').isExisting())
            .toBe(true);
        // And The editor panel should have "metric" named "Units Available" on "Color By" section
        await since('The editor panel should have "metric" named "Units Available" on "Color By" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Units Available', 'metric', 'Color By').isExisting())
            .toBe(true);
        // When I change visualization "Visualization 1" to "Compound Grid" from context menu
        await baseContainer.changeViz('Compound Grid', 'Visualization 1', true);
        // And I click on container "Visualization 1" to select it
        await baseContainer.clickContainerByScript('Visualization 1');
        // Then The editor panel should have "metric" named "Cost" on "Column Set 1" section
        await since('The editor panel should have "metric" named "Cost" on "Column Set 1" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Cost', 'metric', 'Column Set 1').isExisting())
            .toBe(true);
        // And The editor panel should have "metric" named "Revenue" on "Column Set 1" section
        await since('The editor panel should have "metric" named "Revenue" on "Column Set 1" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Revenue', 'metric', 'Column Set 1').isExisting())
            .toBe(true);
        // And The editor panel should have "metric" named "Units Available" on "Column Set 1" section
        await since('The editor panel should have "metric" named "Units Available" on "Column Set 1" section')
            .expect(
                await editorPanelForGrid.getObjectFromSection('Units Available', 'metric', 'Column Set 1').isExisting()
            )
            .toBe(true);
        // And the grid cell in visualization "Visualization 1" at "2", "2" has text "$165,880,424"
        await since('The grid cell in visualization "Visualization 1" at "2", "2" has text "$165,880,424"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '2', 'Visualization 1').getText())
            .toBe('$165,880,424');
        // And the grid cell in visualization "Visualization 1" at "2", "1" has text "$246,389,148"
        await since('The grid cell in visualization "Visualization 1" at "2", "1" has text "$246,389,148"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getText())
            .toBe('$246,389,148');
        // And the grid cell in visualization "Visualization 1" at "2", "3" has text "13,098,888"
        await since('The grid cell in visualization "Visualization 1" at "2", "3" has text "13,098,888"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '3', 'Visualization 1').getText())
            .toBe('13,098,888');
        // # Color becomes the threshold
        // And the grid cell in visualization "Visualization 1" at "2", "3" has style "background-color" with value "rgba(26, 174, 107, 1)"
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "3" has style "background-color" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid
                        .getGridCellByPosition('2', '3', 'Visualization 1')
                        .getCSSProperty('background-color')
                ).value
            )
            .toContain('rgba(26,174,107,1)');
        // # instead of "Thresholds"
        // When I right click on element "Units Available" and select "Edit Thresholds..." from visualization "Visualization 1"
        await vizPanelForGrid.selectContextMenuOptionFromElement(
            'Units Available',
            'Edit Thresholds...',
            'Visualization 1'
        );
        // And I save and close Simple Thresholds Editor
        await thresholdEditor.saveAndCloseSimThresholdEditor();

        // # Undo switch to compound grid and adding Units Available
        // When I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // And I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // And I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // Then The editor panel should not have "metric" named "Units Available" on "Color By" section
        await since('The editor panel should not have "metric" named "Units Available" on "Color By" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Units Available', 'metric', 'Color By').isExisting())
            .toBe(false);
        // # clear redo stack
        // When I change visualization "Visualization 1" to "Compound Grid" from context menu
        await baseContainer.changeViz('Compound Grid', 'Visualization 1', true);
        // And I click on container "Visualization 1" to select it
        await baseContainer.clickContainerByScript('Visualization 1');
        // # nothing happens with this extra step since its cleared
        // And I select "Redo" from toolbar
        await toolbar.clickButtonFromToolbar('Redo');
        // Then The editor panel should have "metric" named "Cost" on "Column Set 1" section
        await since('The editor panel should have "metric" named "Cost" on "Column Set 1" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Cost', 'metric', 'Column Set 1').isExisting())
            .toBe(true);
        // And The editor panel should have "metric" named "Revenue" on "Column Set 1" section
        await since('The editor panel should have "metric" named "Revenue" on "Column Set 1" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Revenue', 'metric', 'Column Set 1').isExisting())
            .toBe(true);
        // And The editor panel should not have "metric" named "Units Available" on "Column Set 1" section
        await since('The editor panel should not have "metric" named "Units Available" on "Column Set 1" section')
            .expect(
                await editorPanelForGrid.getObjectFromSection('Units Available', 'metric', 'Column Set 1').isExisting()
            )
            .toBe(false);
        // When I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // And I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // And I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // Then I should see the "Ghost" image for "Visualization 1"
        // take sceenshot for visualization "Visualization 1"
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Empty bubble chart after undo',
            'TC41291_08_01'
        );

        // When I select "Redo" from toolbar
        await toolbar.clickButtonFromToolbar('Redo');
        // And I select "Redo" from toolbar
        await toolbar.clickButtonFromToolbar('Redo');
        // And I select "Redo" from toolbar
        await toolbar.clickButtonFromToolbar('Redo');
        // Then the grid cell in visualization "Visualization 1" at "2", "2" has text "$165,880,424"
        await since('The grid cell in visualization "Visualization 1" at "2", "2" has text "$165,880,424"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '2', 'Visualization 1').getText())
            .toBe('$165,880,424');
        // And the grid cell in visualization "Visualization 1" at "2", "1" has text "$246,389,148"
        await since('The grid cell in visualization "Visualization 1" at "2", "1" has text "$246,389,148"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getText())
            .toBe('$246,389,148');
        // # Units Available is not here
        // And the grid cell in visualization "Visualization 1" at "2", "3" is not present
        await since('The grid cell in visualization "Visualization 1" at "2", "3" is not present')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '3', 'Visualization 1').isExisting())
            .toBe(false);
    });

    it('[TC41291_09] Convert to/from Custom Viz', async () => {
        // Edit dossier by its ID "B9F6A25111EB238D4B550080EF95F2EA"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > AGGrid_IncrementalFetch
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridIncrementalFetch.project.id,
            dossierId: gridConstants.AGGridIncrementalFetch.id,
        });

        // And I change visualization "Visualization 1" to "Sankey Diagram" from context menu
        await baseContainer.changeViz('Sankey Diagram', 'Visualization 1', true);
        // And I click on container "Visualization 1" to select it
        await baseContainer.clickContainerByScript('Visualization 1');

        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I add "attribute" named "Month" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Month', 'attribute', 'retail-sample-data.xls');
        // And I add "attribute" named "Supplier" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Supplier', 'attribute', 'retail-sample-data.xls');
        // And I add "metric" named "Cost" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');
        // When I change visualization "Visualization 1" to "Compound Grid" from context menu
        await baseContainer.changeViz('Compound Grid', 'Visualization 1', true);
        // And I click on container "Visualization 1" to select it
        await baseContainer.clickContainerByScript('Visualization 1');
        // Then The editor panel should have "attribute" named "Month" on "Rows" section
        await since('The editor panel should have "attribute" named "Month" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Month', 'attribute', 'Rows').isExisting())
            .toBe(true);
        // And The editor panel should have "attribute" named "Supplier" on "Rows" section
        await since('The editor panel should have "attribute" named "Supplier" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Supplier', 'attribute', 'Rows').isExisting())
            .toBe(true);
        // And The editor panel should have "metric" named "Cost" on "Column Set 1" section
        await since('The editor panel should have "metric" named "Cost" on "Column Set 1" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Cost', 'metric', 'Column Set 1').isExisting())
            .toBe(true);
        // And the grid cell in visualization "Visualization 1" at "2", "1" has text "Jan"
        await since('The grid cell in visualization "Visualization 1" at "2", "1" has text "Jan"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getText())
            .toBe('Jan');
        // And the grid cell in visualization "Visualization 1" at "2", "2" has text "20th Century Fox"
        await since('The grid cell in visualization "Visualization 1" at "2", "2" has text "20th Century Fox"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '2', 'Visualization 1').getText())
            .toBe('20th Century Fox');
        // And the grid cell in visualization "Visualization 1" at "2", "3" has text "$398,708"
        await since('The grid cell in visualization "Visualization 1" at "2", "3" has text "$398,708"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '3', 'Visualization 1').getText())
            .toBe('$398,708');

        // When I change visualization "Visualization 1" to "Sankey Diagram" from context menu
        await baseContainer.changeViz('Sankey Diagram', 'Visualization 1', true);
        // And I click on container "Visualization 1" to select it
        await baseContainer.clickContainerByScript('Visualization 1');
        // # should have no errors
        // Then The editor panel should have "attribute" named "Month" on "Levels" section
        await since('The editor panel should have "attribute" named "Month" on "Levels" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Month', 'attribute', 'Levels').isExisting())
            .toBe(true);
        // And The editor panel should have "attribute" named "Supplier" on "Levels" section
        await since('The editor panel should have "attribute" named "Supplier" on "Levels" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Supplier', 'attribute', 'Levels').isExisting())
            .toBe(true);
        // And The editor panel should have "metric" named "Cost" on "Metric" section
        await since('The editor panel should have "metric" named "Cost" on "Metric" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Cost', 'metric', 'Metric').isExisting())
            .toBe(true);

        // # Undo switch to Sankey & Compound Grid
        // When I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // And I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // # should have no errors, still Sankey Diagram
        // Then The editor panel should have "attribute" named "Month" on "Levels" section
        await since('The editor panel should have "attribute" named "Month" on "Levels" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Month', 'attribute', 'Levels').isExisting())
            .toBe(true);
        // And The editor panel should have "attribute" named "Supplier" on "Levels" section
        await since('The editor panel should have "attribute" named "Supplier" on "Levels" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Supplier', 'attribute', 'Levels').isExisting())
            .toBe(true);
        // And The editor panel should have "metric" named "Cost" on "Metric" section
        await since('The editor panel should have "metric" named "Cost" on "Metric" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Cost', 'metric', 'Metric').isExisting())
            .toBe(true);

        // When I select "Redo" from toolbar
        await toolbar.clickButtonFromToolbar('Redo');
        // Then the grid cell in visualization "Visualization 1" at "2", "1" has text "Jan"
        await since('The grid cell in visualization "Visualization 1" at "2", "1" has text "Jan"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getText())
            .toBe('Jan');
        // And the grid cell in visualization "Visualization 1" at "2", "2" has text "20th Century Fox"
        await since('The grid cell in visualization "Visualization 1" at "2", "2" has text "20th Century Fox"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '2', 'Visualization 1').getText())
            .toBe('20th Century Fox');
        // And the grid cell in visualization "Visualization 1" at "2", "3" has text "$398,708"
        await since('The grid cell in visualization "Visualization 1" at "2", "3" has text "$398,708"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '3', 'Visualization 1').getText())
            .toBe('$398,708');

        // When I select "Redo" from toolbar
        await toolbar.clickButtonFromToolbar('Redo');
        // # should have no errors, back to Sankey Diagram
        // Then The editor panel should have "attribute" named "Month" on "Levels" section
        await since('The editor panel should have "attribute" named "Month" on "Levels" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Month', 'attribute', 'Levels').isExisting())
            .toBe(true);
        // And The editor panel should have "attribute" named "Supplier" on "Levels" section
        await since('The editor panel should have "attribute" named "Supplier" on "Levels" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Supplier', 'attribute', 'Levels').isExisting())
            .toBe(true);
        // And The editor panel should have "metric" named "Cost" on "Metric" section
        await since('The editor panel should have "metric" named "Cost" on "Metric" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Cost', 'metric', 'Metric').isExisting())
            .toBe(true);
    });

    it('[TC41295_01] Compound grid E2E with advanced formatting sorting filtering and responsive design', async () => {
        // Edit dossier by its ID "F2BF2F9D0342944D6900718C324A0E47"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > Compound Grid > TC41295_e2e
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.CompoundGrid_E2E.project.id,
            dossierId: gridConstants.CompoundGrid_E2E.id,
        });

        // When I click on container "Compound Grid Source" from layers panel
        await baseContainer.clickContainerByScript('Compound Grid Source');
        // Then The container "Compound Grid Source" should be selected

        // # add new column sets
        // When I add a column set for the compound grid
        await gridAuthoring.addColumnSet();
        // And I drag "attribute" named "Region" from dataset "Report Dataset" to Column Set "Column Set 2" in compound grid
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ('Region', 'attribute', 'Report Dataset', 'Column Set 2');
        // And I drag "metric" named "Revenue" from dataset "Report Dataset" to Column Set "Column Set 2" and drop it below "Region" in compound grid
        await vizPanelForGrid.dragDSObjectToColumnSetDZwithPosition(
            'Revenue',
            'metric',
            'Report Dataset',
            'Column Set 2',
            'below',
            'Region'
        );
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then the grid cell in visualization "Compound Grid Source" at "1", "4" has text "Central"
        await since('The grid cell in visualization "Compound Grid Source" at "1", "4" has text "Central"')
            .expect(await vizPanelForGrid.getGridCellByPosition('1', '4', 'Compound Grid Source').getText())
            .toBe('Central');
        // And the grid cell in visualization "Compound Grid Source" at "2", "4" has text "Revenue"
        await since('The grid cell in visualization "Compound Grid Source" at "2", "4" has text "Revenue"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '4', 'Compound Grid Source').getText())
            .toBe('Revenue');
        // And the grid cell in visualization "Compound Grid Source" at "3", "4" has text "$578"
        await since('The grid cell in visualization "Compound Grid Source" at "3", "4" has text "$578"')
            .expect(await vizPanelForGrid.getGridCellByPosition('3', '4', 'Compound Grid Source').getText())
            .toBe('$578');
        // # add attribute to the rows
        // When I drag "attribute" named "Call Center" from dataset "Report Dataset" to dropzone "Rows" and drop it below "Year"
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Call Center',
            'attribute',
            'Report Dataset',
            'Rows',
            'below',
            'Year'
        );
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then the grid cell in visualization "Compound Grid Source" at "3", "2" has text "Atlanta"
        await since('The grid cell in visualization "Compound Grid Source" at "3", "2" has text "Atlanta"')
            .expect(await vizPanelForGrid.getGridCellByPosition('3', '2', 'Compound Grid Source').getText())
            .toBe('Atlanta');
        // And the grid cell in visualization "Compound Grid Source" at "3", "3" has text "Books"
        await since('The grid cell in visualization "Compound Grid Source" at "3", "3" has text "Books"')
            .expect(await vizPanelForGrid.getGridCellByPosition('3', '3', 'Compound Grid Source').getText())
            .toBe('Books');
        // And the grid cell in visualization "Compound Grid Source" at "3", "4" has text "$23"
        await since('The grid cell in visualization "Compound Grid Source" at "3", "4" has text "$23"')
            .expect(await vizPanelForGrid.getGridCellByPosition('3', '4', 'Compound Grid Source').getText())
            .toBe('$23');

        // # add number formatting
        // When I right click on object "Profit" from dropzone "Column Set 1" and select "Number Format"
        await vizPanelForGrid.selectContextMenuOptionFromObjectinDZ('Profit', 'Column Set 1', 'Number Format');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then I pause execution for 3 seconds
        // And I select "Currency" from the drop down in the Number Format context menu
        await vizPanelForGrid.selectNumberFormatFromDropdown('Currency');
        // And I select currency position "Left with space" from the drop down in the Number Format context menu
        await vizPanelForGrid.selectNfCurrencyPositionFromDropdown('Left with space');
        // And I click the "OK" button in the context menu to close it
        await vizPanelForGrid.clickContextMenuButton('OK');
        // Then the grid cell in visualization "Compound Grid Source" at "3", "4" has text "$ 23"
        await since('The grid cell in visualization "Compound Grid Source" at "3", "4" has text "$ 23"')
            .expect(await vizPanelForGrid.getGridCellByPosition('3', '4', 'Compound Grid Source').getText())
            .toBe('$ 23');
        // # rename column sets
        // When I rename the Column Set at position "1" to "test 1" from compound grid
        await vizPanelForGrid.renameColumnSet('1', 'test 1');
        // Then The editor panel should have "metric" named "Profit" on "test 1" section
        await since('The editor panel should have "metric" named "Profit" on "test 1" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Profit', 'metric', 'test 1').isExisting())
            .toBe(true);
        // When I rename the Column Set at position "2" to "test 2" from compound grid
        await vizPanelForGrid.renameColumnSet('2', 'test 2');
        // Then The editor panel should have "attribute" named "Region" on "test 2" section
        await since('The editor panel should have "attribute" named "Region" on "test 2" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Region', 'attribute', 'test 2').isExisting())
            .toBe(true);
        // And The editor panel should have "metric" named "Revenue" on "test 2" section
        await since('The editor panel should have "metric" named "Revenue" on "test 2" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Revenue', 'metric', 'test 2').isExisting())
            .toBe(true);

        // # sort attribute + undo/redo
        // When I sort the "attribute" named "Call Center" in "Sort Ascending" in Editor Panel
        await editorPanelForGrid.simpleSort('Call Center', 'Sort Ascending');
        // Then the grid cell in visualization "Compound Grid Source" at "3", "2" has text "Atlanta"
        await since('The grid cell in visualization "Compound Grid Source" at "3", "2" has text "Atlanta"')
            .expect(await vizPanelForGrid.getGridCellByPosition('3', '2', 'Compound Grid Source').getText())
            .toBe('Atlanta');
        // And the grid cell in visualization "Compound Grid Source" at "7", "2" has text "Atlanta"
        await since('The grid cell in visualization "Compound Grid Source" at "7", "2" has text "Atlanta"')
            .expect(await vizPanelForGrid.getGridCellByPosition('7', '2', 'Compound Grid Source').getText())
            .toBe('Atlanta');
        // When I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // Then the grid cell in visualization "Compound Grid Source" at "3", "2" has text "Atlanta"
        await since('The grid cell in visualization "Compound Grid Source" at "3", "2" has text "Atlanta"')
            .expect(await vizPanelForGrid.getGridCellByPosition('3', '2', 'Compound Grid Source').getText())
            .toBe('Atlanta');
        // And the grid cell in visualization "Compound Grid Source" at "7", "1" has text "San Diego"
        await since('The grid cell in visualization "Compound Grid Source" at "7", "1" has text "San Diego"')
            .expect(await vizPanelForGrid.getGridCellByPosition('7', '1', 'Compound Grid Source').getText())
            .toBe('San Diego');
        // When I select "Redo" from toolbar
        await toolbar.clickButtonFromToolbar('Redo');
        // Then the grid cell in visualization "Compound Grid Source" at "3", "2" has text "Atlanta"
        await since('The grid cell in visualization "Compound Grid Source" at "3", "2" has text "Atlanta"')
            .expect(await vizPanelForGrid.getGridCellByPosition('3', '2', 'Compound Grid Source').getText())
            .toBe('Atlanta');
        // And the grid cell in visualization "Compound Grid Source" at "7", "2" has text "Atlanta"
        await since('The grid cell in visualization "Compound Grid Source" at "7", "2" has text "Atlanta"')
            .expect(await vizPanelForGrid.getGridCellByPosition('7', '2', 'Compound Grid Source').getText())
            .toBe('Atlanta');

        // # enable subtotal
        // When I toggle totals from editor panel
        await editorPanelForGrid.showTotal();
        // Then the grid cell in visualization "Compound Grid Source" at "3", "1" has text "Total"
        await since('The grid cell in visualization "Compound Grid Source" at "3", "1" has text "Total"')
            .expect(await vizPanelForGrid.getGridCellByPosition('3', '1', 'Compound Grid Source').getText())
            .toBe('Total');
        // And the grid cell in visualization "Compound Grid Source" at "3", "4" has text "$ 45,007"
        await since('The grid cell in visualization "Compound Grid Source" at "3", "4" has text "$ 45,007"')
            .expect(await vizPanelForGrid.getGridCellByPosition('3', '4', 'Compound Grid Source').getText())
            .toBe('$ 45,007');
        // And the grid cell in visualization "Compound Grid Source" at "4", "2" has text "Total"
        await since('The grid cell in visualization "Compound Grid Source" at "4", "2" has text "Total"')
            .expect(await vizPanelForGrid.getGridCellByPosition('4', '2', 'Compound Grid Source').getText())
            .toBe('Total');
        // And the grid cell in visualization "Compound Grid Source" at "4", "4" has text "$ 7,263"
        await since('The grid cell in visualization "Compound Grid Source" at "4", "4" has text "$ 7,263"')
            .expect(await vizPanelForGrid.getGridCellByPosition('4', '4', 'Compound Grid Source').getText())
            .toBe('$ 7,263');

        // # enable threshold
        // When I open the Thresholds editor for object "Profit" from the grid visualization "Compound Grid Source"
        await thresholdEditor.openThresholdEditorFromViz('Profit', 'Compound Grid Source');
        // And I open the color band drop down menu
        await thresholdEditor.openSimpleThresholdColorBandDropDownMenu();
        // And I select the color band "Traffic Lights" in simple threshold editor
        await thresholdEditor.selectSimpleThresholdColorBand('Traffic Lights');
        // And I save and close Simple Thresholds Editor
        await thresholdEditor.saveAndCloseSimThresholdEditor();
        // Then the grid cell in visualization "Compound Grid Source" at "8", "2" has style "background-color" with value "rgba(236, 123, 117, 1)"
        await since(
            'The grid cell in visualization "Compound Grid Source" at "8", "2" has style "background-color" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid
                        .getGridCellByPosition('8', '2', 'Compound Grid Source')
                        .getCSSProperty('background-color')
                ).value
            )
            .toContain('rgba(236,123,117,1)');
        // And the grid cell in visualization "Compound Grid Source" at "9", "2" has style "background-color" with value "rgba(132, 200, 123, 1)"
        await since(
            'The grid cell in visualization "Compound Grid Source" at "9", "2" has style "background-color" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid
                        .getGridCellByPosition('9', '2', 'Compound Grid Source')
                        .getCSSProperty('background-color')
                ).value
            )
            .toContain('rgba(132,200,123,1)');

        // # enable view filter
        // When I open advanced filter editor for "Compound Grid Source" by clicking visualization context menu and clicking Edit Filter
        await advancedFilter.openAdvancedFilterEditor('Compound Grid Source');
        // And I click New Qualification Button to open New Qualification editor
        await advancedFilter.openNewQualificationEditor();
        // And I choose metric "Profit" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Profit');
        // And I open Operator dropdown
        await advancedFilter.openOperatorDropDown();
        // And I select "By Rank" from Operator dropdown
        await advancedFilter.doSelectionOnOperatorDropdown('By Rank');
        // And I select by rank "Highest" as the metric filter operator
        await advancedFilter.selectMetricFilterOperatorByRank('Highest');
        // And I type "100" for Value input
        await advancedFilter.typeValueInput('100');
        // And I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
        // Then a new advanced filter by index "1" should be created
        await advancedFilter.checkAdvancedFilterByIndex(1);
        // When I click Save to save the change and close advanced filter editor
        await advancedFilter.clickSaveOnAdvancedFilterEditor();
        // Then the grid cell in visualization "Compound Grid Source" at "9", "2" has text "$ 280"
        await since('The grid cell in visualization "Compound Grid Source" at "9", "2" has text "$ 280"')
            .expect(await vizPanelForGrid.getGridCellByPosition('9', '2', 'Compound Grid Source').getText())
            .toBe('$ 280');
        // And the grid cell in visualization "Compound Grid Source" at "7", "4" has text "$ 280"
        await since('The grid cell in visualization "Compound Grid Source" at "7", "4" has text "$ 280"')
            .expect(await vizPanelForGrid.getGridCellByPosition('7', '4', 'Compound Grid Source').getText())
            .toBe('$ 280');

        // # target relationship
        // When I click on the context menu of "Compound Grid Source"
        await vizPanelForGrid.openContextMenu('Compound Grid Source');
        // And I select option "Edit Target Visualizations" from the context menu
        await vizPanelForGrid.selectContextMenuOption('Edit Target Visualizations');
        // Then A select source button appears on the Viz "Compound Grid Source"
        await selectTargetInLayersPanel.getSourceButton('Compound Grid Source').waitForDisplayed();
        // And A source icon appears on the viz "Compound Grid Source" in layers panel
        await since('A source icon appears on the viz "Compound Grid Source" in layers panel')
            .expect(await selectTargetInLayersPanel.getSourceIconInLayersPanel('Compound Grid Source').isDisplayed())
            .toBe(true);
        // And A target button appears on the viz "Compound Grid"
        await selectTargetInLayersPanel.getTargetButton('Compound Grid').waitForDisplayed();
        // And A target icon appears on the viz "Compound Grid" in layers panel
        await since('A target icon appears on the viz "Compound Grid" in layers panel')
            .expect(await selectTargetInLayersPanel.getTargetIconInLayersPanel('Compound Grid').isDisplayed())
            .toBe(true);
        // And I click on cancel button
        await selectTargetInLayersPanel.cancelButtonForSelectTarget();
        // When I select element "2014" from visualization "Compound Grid Source" to filter target visualizations
        await vizPanelForGrid.selectElementOnViz('2014', 'Compound Grid Source');
        // Then the grid cell in visualization "Compound Grid" at "2", "1" has text "Atlanta"
        await since('The grid cell in visualization "Compound Grid" at "2", "1" has text "Atlanta"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '1', 'Compound Grid').getText())
            .toBe('Atlanta');
        // And the grid cell in visualization "Compound Grid" at "2", "4" has text "$14"
        await since('The grid cell in visualization "Compound Grid" at "2", "4" has text "$14"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '4', 'Compound Grid').getText())
            .toBe('$14');
        // # reponsive view
        // When I select "Responsive Preview" from toolbar
        await toolbar.clickButtonFromToolbar('Responsive Preview');
        // Then Container "Compound Grid Source" should be on the "top" side of container "Visualization 1"
        await takeScreenshotByElement(
            await vizPanelForGrid.getContainer('Compound Grid Source'),
            'Responsive Preview mode for Compound Grid Source',
            'TC41295_01_01'
        );
        // When I select "Full View" from toolbar
        await toolbar.clickButtonFromToolbar('Full View');
        // And I select "Responsive View Editor" from toolbar
        await toolbar.clickButtonFromToolbar('Responsive View Editor');
        // Then The dossier is in "Edit Responsive" mode
        // take screenshot for "Edit Responsive" mode
        await takeScreenshotByElement(
            await vizPanelForGrid.getContainer('Compound Grid Source'),
            'Edit Responsive mode for Compound Grid Source',
            'TC41295_01_02'
        );
        // When I multi select "Compound Grid Source,Visualization 1" and select the "Group" button
        // Then The group "Group 1" is created
        // And Containers "Compound Grid Source,Visualization 1" are highlighted
        // When I click on "Save" Groups on the Grouping Editor toolbar
        // Then The dossier is not in "Edit Responsive" mode
        // Then I pause execution for 3 seconds
        // When I select "Responsive Preview" from toolbar
        // Then Container "Visualization 1" should be on the "right" side of container "Compound Grid Source"
        // And Container "Visualization 1" should be on the "top" side of container "Compound Grid"
        // And Container "Compound Grid Source" should be on the "top" side of container "Compound Grid"
    });

    it('[TC81400_01] Validate ability to change column setting in Compound Grid', async () => {
        await browser.setWindowSize(1600, 800);
        const newSize = await browser.getWindowSize();
        console.log(newSize);
        // Edit dossier by its ID "2E1A78C2644C416AFFA19F99357DC5B0"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > Compound Grid > TC81400
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.CompoundGrid_ColumnSize.project.id,
            dossierId: gridConstants.CompoundGrid_ColumnSize.id,
        });
        //    # 1. Compound Grid1
        //     # change column set size
        //     When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        //     And I expand "Spacing" section
        await newFormatPanelForGrid.expandSpacingSection();
        //     And I change grid column size fit to "Fixed" under Spacing section
        await newFormatPanelForGrid.clickColumnSizeFitOption('Fixed', false);
        //     And I change grid column size target to "All columns" under Spacing section
        await newFormatPanelForGrid.clickColumnSizeTargetBtn();
        await newFormatPanelForGrid.clickColumnSizeTargetOption('All columns');
        //     And I change grid column size fixed inches to "1.875" under Spacing section
        await newFormatPanelForGrid.setColumnSizeFixedInches('1.875');
        await browser.pause(2000); // give some time for the column to resize
        //     Then the grid cell in visualization "Compound Grid1" at "2", "1" has style "width" with value "152px"
        await since(
            'The grid cell in visualization "Compound Grid1" at "2", "1" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('2', '1', 'Compound Grid1').getCSSProperty('width')).value
            )
            .toContain('152');
        //     And the grid cell in visualization "Compound Grid1" at "2", "2" has style "width" with value "152px"
        await since(
            'The grid cell in visualization "Compound Grid1" at "2", "2" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('2', '2', 'Compound Grid1').getCSSProperty('width')).value
            )
            .toContain('152');
        //     And the grid cell in visualization "Compound Grid1" at "2", "3" has style "width" with value "152px"
        await since(
            'The grid cell in visualization "Compound Grid1" at "2", "3" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('2', '3', 'Compound Grid1').getCSSProperty('width')).value
            )
            .toContain('152');
        //     And the grid cell in visualization "Compound Grid1" at "2", "4" has style "width" with value "152px"
        await since(
            'The grid cell in visualization "Compound Grid1" at "2", "4" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('2', '4', 'Compound Grid1').getCSSProperty('width')).value
            )
            .toContain('152');
        //     And the grid cell in visualization "Compound Grid1" at "2", "5" has style "width" with value "152px"
        await since(
            'The grid cell in visualization "Compound Grid1" at "2", "5" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('2', '5', 'Compound Grid1').getCSSProperty('width')).value
            )
            .toContain('152');
        //     And the grid cell in visualization "Compound Grid1" at "2", "6" has style "width" with value "152px"
        await since(
            'The grid cell in visualization "Compound Grid1" at "2", "6" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('2', '6', 'Compound Grid1').getCSSProperty('width')).value
            )
            .toContain('152');
        //     And the grid cell in visualization "Compound Grid1" at "2", "7" has style "width" with value "152px"
        await since(
            'The grid cell in visualization "Compound Grid1" at "2", "7" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('2', '7', 'Compound Grid1').getCSSProperty('width')).value
            )
            .toContain('152');
        //     And I pause execution for 1 seconds
        //     # remove and add new objects
        //     When I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        //     And I right click on object "Year" from dropzone "Rows" and select "Remove"
        await vizPanelForGrid.selectContextMenuOptionFromObjectinDZ('Year', 'Rows', 'Remove');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await browser.pause(2000); // give some time for the column to resize
        //     Then the grid cell in visualization "Compound Grid1" at "2", "1" has style "width" with value "152px"
        await since(
            'The grid cell in visualization "Compound Grid1" at "2", "1" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('2', '1', 'Compound Grid1').getCSSProperty('width')).value
            )
            .toContain('152');
        //     And the grid cell in visualization "Compound Grid1" at "2", "2" has style "width" with value "152px"
        await since(
            'The grid cell in visualization "Compound Grid1" at "2", "2" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('2', '2', 'Compound Grid1').getCSSProperty('width')).value
            )
            .toContain('152');
        //     And the grid cell in visualization "Compound Grid1" at "2", "3" has style "width" with value "152px"
        await since(
            'The grid cell in visualization "Compound Grid1" at "2", "3" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('2', '3', 'Compound Grid1').getCSSProperty('width')).value
            )
            .toContain('152');
        //     And I pause execution for 1 seconds
        //     And I add "attribute" named "Category" from dataset "R02" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Category', 'attribute', 'R02');
        //     Then the grid cell in visualization "Compound Grid1" at "2", "2" has text "Books"
        await since('The grid cell in visualization "Compound Grid1" at "2", "2" has text "Books"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '2', 'Compound Grid1').getText())
            .toBe('Books');
        //     ## DE255861: The column size doesn't apply for the newly added objects/column sets
        //     # And the grid cell in visualization "Compound Grid1" at "2", "2" has style "width" with value "152px"
        //     # add new column set
        //     When I add a column set for the compound grid
        await vizPanelForGrid.addColumnSet();
        //     And I drag "metric" named "Profit per Employee" from dataset "R02" to Column Set "Column Set 3" in compound grid
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ('Profit per Employee', 'metric', 'R02', 'Column Set 3');
        //     Then the grid cell in visualization "Compound Grid1" at "2", "8" has text "$7,040"
        await since('The grid cell in visualization "Compound Grid1" at "2", "8" has text "$7,040"')
            .expect(await vizPanelForGrid.getGridCellByPosition('2', '8', 'Compound Grid1').getText())
            .toBe('$7,040');
        //     # And the grid cell in visualization "Compound Grid1" at "2", "8" has style "width" with value "152px"
        // await since('The grid cell in visualization "Compound Grid1" at "2", "8" has style "width" with value "152px"')
        //     .expect(
        //         (await vizPanelForGrid.getGridCellByPosition('2', '8', 'Compound Grid1').getCSSProperty('width')).value
        //     )
        //     .toContain('152');

        //     # 2. Compound Grid2
        //     When I click on container "Compound Grid2" to select it
        await baseContainer.clickContainerByScript('Compound Grid2');
        //     Then The container "Compound Grid2" should be selected
        //      # change column set size
        //     When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        //     And I expand "Spacing" section
        await newFormatPanelForGrid.expandSpacingSection();
        //     And I change grid column size fit to "Fixed" under Spacing section
        await newFormatPanelForGrid.clickColumnSizeFitOption('Fixed', false);
        //     And I change grid column size target to "All columns" under Spacing section
        await newFormatPanelForGrid.clickColumnSizeTargetBtn();
        await newFormatPanelForGrid.clickColumnSizeTargetOption('All columns');
        //     And I change grid column size fixed inches to "0.9375" under Spacing section
        await newFormatPanelForGrid.setColumnSizeFixedInches('0.9375');
        //     Then the grid cell in visualization "Compound Grid2" at "4", "1" has style "width" with value "62px"
        await since(
            'The grid cell in visualization "Compound Grid2" at "4", "1" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('4', '1', 'Compound Grid2').getCSSProperty('width')).value
            )
            .toContain('62px');
        //     And the grid cell in visualization "Compound Grid2" at "4", "2" has style "width" with value "62px"
        await since(
            'The grid cell in visualization "Compound Grid2" at "4", "2" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('4', '2', 'Compound Grid2').getCSSProperty('width')).value
            )
            .toContain('62px');
        //     And the grid cell in visualization "Compound Grid2" at "4", "3" has style "width" with value "62px"
        await since(
            'The grid cell in visualization "Compound Grid2" at "4", "3" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('4', '3', 'Compound Grid2').getCSSProperty('width')).value
            )
            .toContain('62px');
        //     And the grid cell in visualization "Compound Grid2" at "4", "4" has style "width" with value "62px"
        await since(
            'The grid cell in visualization "Compound Grid2" at "4", "4" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('4', '4', 'Compound Grid2').getCSSProperty('width')).value
            )
            .toContain('62px');
        //     And the grid cell in visualization "Compound Grid2" at "4", "5" has style "width" with value "62px"
        await since(
            'The grid cell in visualization "Compound Grid2" at "4", "5" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('4', '5', 'Compound Grid2').getCSSProperty('width')).value
            )
            .toContain('62px');
        //     And the grid cell in visualization "Compound Grid2" at "4", "6" has style "width" with value "62px"
        await since(
            'The grid cell in visualization "Compound Grid2" at "4", "6" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('4', '6', 'Compound Grid2').getCSSProperty('width')).value
            )
            .toContain('62px');
        //     And I pause execution for 1 seconds
        //     # remove and add new objects
        //     When I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        //     And I right click on object "Region" from dropzone "Rows" and select "Remove"
        await vizPanelForGrid.selectContextMenuOptionFromObjectinDZ('Region', 'Rows', 'Remove');
        //     Then the grid cell in visualization "Compound Grid2" at "4", "1" has style "width" with value "62px"
        await since(
            'The grid cell in visualization "Compound Grid2" at "4", "1" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('4', '1', 'Compound Grid2').getCSSProperty('width')).value
            )
            .toContain('62px');
        //     And the grid cell in visualization "Compound Grid2" at "4", "2" has style "width" with value "62px"
        await since(
            'The grid cell in visualization "Compound Grid2" at "4", "2" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('4', '2', 'Compound Grid2').getCSSProperty('width')).value
            )
            .toContain('62px');
        //     And the grid cell in visualization "Compound Grid2" at "4", "3" has style "width" with value "62px"
        await since(
            'The grid cell in visualization "Compound Grid2" at "4", "3" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('4', '3', 'Compound Grid2').getCSSProperty('width')).value
            )
            .toContain('62px');
        //     Then the grid cell in visualization "Compound Grid2" at "4", "2" has text "$261,080"
        await since('The grid cell in visualization "Compound Grid2" at "4", "2" has text "$261,080"')
            .expect(await vizPanelForGrid.getGridCellByPosition('4', '2', 'Compound Grid2').getText())
            .toBe('$261,080');
        //     And I pause execution for 1 seconds
        //     And I add "attribute" named "Employee" from dataset "R02" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Employee', 'attribute', 'R02');
        //     Then the grid cell in visualization "Compound Grid2" at "4", "2" has text "Bernstein"
        await since('The grid cell in visualization "Compound Grid2" at "4", "2" has text "Bernstein"')
            .expect(await vizPanelForGrid.getGridCellByPosition('4', '2', 'Compound Grid2').getText())
            .toBe('Bernstein');
        //     # And the grid cell in visualization "Compound Grid2" at "4", "2" has style "width" with value "62px"
        // await since(
        //     'The grid cell in visualization "Compound Grid2" at "4", "2" has style "width" with value #{expected}, instead it is #{actual}'
        // )
        //     .expect(
        //         (await vizPanelForGrid.getGridCellByPosition('4', '2', 'Compound Grid2').getCSSProperty('width')).value
        //     )
        //     .toContain('62px');
        //     # add new column set
        //     When I add a column set for the compound grid
        await vizPanelForGrid.addColumnSet();
        //     And I drag "metric" named "Profit" from dataset "R02" to Column Set "Column Set 3" in compound grid
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ('Profit', 'metric', 'R02', 'Column Set 3');
        //     Then the grid cell in visualization "Compound Grid2" at "4", "8" has text "$56,041"
        await since('The grid cell in visualization "Compound Grid2" at "4", "8" has text "$56,041"')
            .expect(await vizPanelForGrid.getGridCellByPosition('4', '8', 'Compound Grid2').getText())
            .toBe('$56,041');
        // # And the grid cell in visualization "Compound Grid2" at "4", "8" has style "width" with value "62px"
        // await since(
        //     'The grid cell in visualization "Compound Grid2" at "4", "8" has style "width" with value #{expected}, instead it is #{actual}'
        // )
        //     .expect(
        //         (await vizPanelForGrid.getGridCellByPosition('4', '8', 'Compound Grid2').getCSSProperty('width')).value
        //     )
        //     .toContain('62px');
    });
});
