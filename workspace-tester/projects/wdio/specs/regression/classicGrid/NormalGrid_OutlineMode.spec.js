import * as gridConstants from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { FilterPanel } from '../../../pageObjects/dossierEditor/FilterPanel.js';

describe('NormalGrid_OutlineMode', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        loginPage,
        libraryPage,
        baseFormatPanel,
        baseFormatPanelReact,
        newFormatPanelForGrid,
        editorPanel,
        datasetPanel,
        gridAuthoring,
        contentsPanel,
        tocContentsPanel,
        thresholdEditor,
        toolbar,
        dossierMojo,
        dossierPage,
        vizPanelForGrid,
        editorPanelForGrid,
        loadingDialog,
        baseContainer,
    } = browsers.pageObj1;

    const filterPanel = new FilterPanel();

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    it('[TC60779] Acceptance test for outline mode in compound grid', async () => {
        // When I open dossier by its ID "B5B6D9F611EA07077A040080EFC51258"
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.Formatting.project.id,
            dossierId: gridConstants.Formatting.id,
        });
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
        // And I expand "Layout" section
        await newFormatPanelForGrid.expandLayoutSection();
        // And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
        // When I collapse the attribute "Month" in outline mode from grid visualization "Visualization 1"
        await vizPanelForGrid.collapseOutlineFromColumnHeader('Month', 'Visualization 1');
        // And the grid cell in visualization "Visualization 1" at "3", "3" has text "$18,572,183"
        await since(
            'the grid cell in visualization "Visualization 1" at "3", "3" has text "$18,572,183", while we got #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 3, 'Visualization 1'))
            .toBe('$18,572,183');
        // When I expand the element "Jan" in outline mode from grid visualization "Visualization 1"
        await vizPanelForGrid.expandOutlineFromColumnHeader('Jan', 'Visualization 1');
        // And the grid cell in visualization "Visualization 1" at "4", "2" has text "20th Century Fox"
        await since(
            'the grid cell in visualization "Visualization 1" at "4", "2" has text "20th Century Fox", while we got #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(4, 2, 'Visualization 1'))
            .toBe('20th Century Fox');
        // When I sort the attribute "Supplier" in descending order from grid visualization "Visualization 1"
        await vizPanelForGrid.sortDescending('Supplier', 'Visualization 1', 'desc');
        // Then The attribute "Month" should remain collapsed in "Visualization 1"
        await since('The attribute "Month" should remain collapsed in "Visualization 1", while we got #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridCollapsed('Month', 'Visualization 1'))
            .toBe(true);
        // When I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // When I remove "attribute" named "Supplier" from the Grid Editor Panel
        await editorPanelForGrid.removeFromDropZone('Supplier', 'Attribute');
        // When I drag "attribute" named "Item Category" from dataset "retail-sample-data.xls" to dropzone "Rows" and drop it below "Month"
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Item Category',
            'attribute',
            'retail-sample-data.xls',
            'Rows',
            'below',
            'Month'
        );
        // When I drag "metric" named "Unit Price" from dataset "retail-sample-data.xls" to dropzone "Metrics" and drop it below "Revenue"
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Unit Price',
            'metric',
            'retail-sample-data.xls',
            'Metrics',
            'below',
            'Revenue'
        );
        // Then The attribute "Month" should remain collapsed in "Visualization 1"
        await since('The attribute "Month" should remain collapsed in "Visualization 1", while we got #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridCollapsed('Month', 'Visualization 1'))
            .toBe(true);
        // And the grid cell in visualization "Visualization 1" at "3", "4" has text ""
        await since('the grid cell in visualization "Visualization 1" at "3", "4" has text "", while we got #{actual}')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 4, 'Visualization 1'))
            .toBe('');
        // When I expand the attribute "Month" in outline mode from grid visualization "Visualization 1"
        await vizPanelForGrid.expandOutlineFromColumnHeader('Month', 'Visualization 1');
        // Then the grid cell in visualization "Visualization 1" at "4", "2" has text "Action Movies"
        await since(
            'the grid cell in visualization "Visualization 1" at "4", "2" has text "Action Movies", while we got #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(4, 2, 'Visualization 1'))
            .toBe('Action Movies');
        // When I remove "attribute" named "Item Category" from the Grid Editor Panel
        await editorPanelForGrid.removeFromDropZone('Item Category', 'Attribute');
        // When I drag "attribute" named "Supplier" from dataset "retail-sample-data.xls" to dropzone "Rows" and drop it below "Month"
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Supplier',
            'attribute',
            'retail-sample-data.xls',
            'Rows',
            'below',
            'Month'
        );
        // Then The attribute "Month" should remain expanded in "Visualization 1"
        await since('The attribute "Month" should remain expanded in "Visualization 1", while we got #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded('Month', 'Visualization 1'))
            .toBe(true);
    });

    it('[TC41289_1] Converting simple grid with outline mode to compound grid', async () => {
        // When I open dossier by its ID "B5B6D9F611EA07077A040080EFC51258"
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.Formatting.project.id,
            dossierId: gridConstants.Formatting.id,
        });
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // Then I pause execution for 1 seconds
        // And I switch to Grid tab in Format Panel
        await newFormatPanelForGrid.switchToTab('grid');
        // And I expand "Layout" section
        await newFormatPanelForGrid.expandLayoutSection();
        // And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
        // When I collapse the attribute "Month" in outline mode from grid visualization "Visualization 1"
        await vizPanelForGrid.collapseOutlineFromColumnHeader('Month', 'Visualization 1');
        // Then the grid cell in visualization "Visualization 1" at "3", "2" has style "background-color" with value "rgba(248,248,248,1)"
        await since(
            'the grid cell in visualization "Visualization 1" at "3", "2" has style "background-color" with value "rgba(248,248,248,1)", while we got #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellStyleByPosition(3, 2, 'Visualization 1', 'background-color'))
            .toBe('rgba(248,248,248,1)');
        // When I expand the element "Feb" in outline mode from grid visualization "Visualization 1"
        await vizPanelForGrid.expandOutlineFromColumnHeader('Feb', 'Visualization 1');
        // When I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // When I remove "attribute" named "Supplier" from the Grid Editor Panel
        await editorPanelForGrid.removeFromDropZone('Supplier', 'Attribute');
        // When I drag "attribute" named "Item Category" from dataset "retail-sample-data.xls" to dropzone "Rows" and drop it below "Month"
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Item Category',
            'attribute',
            'retail-sample-data.xls',
            'Rows',
            'below',
            'Month'
        );
        // When I drag "metric" named "Unit Price" from dataset "retail-sample-data.xls" to dropzone "Metrics" and drop it below "Revenue"
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Unit Price',
            'metric',
            'retail-sample-data.xls',
            'Metrics',
            'below',
            'Revenue'
        );
        // Then The attribute "Month" should remain collapsed in "Visualization 1"
        await since('The attribute "Month" should remain collapsed in "Visualization 1", while we got #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridCollapsed('Month', 'Visualization 1'))
            .toBe(true);
        // When I change the selected visualization to "Compound Grid" from context menu
        await gridAuthoring.changeVizToCompoundGrid('Visualization 1');
        // # When I expand the attribute "Item Category" in outline mode from grid visualization "Visualization 1"
        // When I expand the attribute "Month" in outline mode from grid visualization "Visualization 1"
        await vizPanelForGrid.expandOutlineFromColumnHeader('Month', 'Visualization 1');
        // # When I collapse the element "Special Interests" in outline mode from grid visualization "Visualization 1"
        // When I collapse the element "Jan" in outline mode from grid visualization "Visualization 1"
        await vizPanelForGrid.collapseOutlineFromColumnHeader('Jan', 'Visualization 1');
        // Then The dossier's screenshot "CompoundGridOutlineMode1" should match the baselines
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'CompoundGridOutlineMode1',
            'TC41289_1_01'
        );
    });

    it('[TC41289_2] Outline mode manipulations in compound grid', async () => {
        // When I open dossier by its ID "B5B6D9F611EA07077A040080EFC51258"
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.Formatting.project.id,
            dossierId: gridConstants.Formatting.id,
        });
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // Then I pause execution for 1 seconds
        // When I insert page for chapter "Chapter 1"
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        // When I delete page "Page 1" in "Chapter 1"
        await tocContentsPanel.contextMenuOnPage('Page 1', 'Chapter 1', 'Delete');
        // #attr only in rows
        // When I add "attribute" named "Supplier" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Supplier', 'attribute', 'retail-sample-data.xls');
        // When I add "attribute" named "City" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('City', 'attribute', 'retail-sample-data.xls');
        // When I add "metric" named "Cost" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');
        // When I add "metric" named "Revenue" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Revenue', 'metric', 'retail-sample-data.xls');
        // When I add "metric" named "Unit Price" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Unit Price', 'metric', 'retail-sample-data.xls');
        // When I change the selected visualization to "Compound Grid" from context menu
        await gridAuthoring.changeVizToCompoundGrid('Visualization 1');
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I switch to Grid tab in Format Panel
        await newFormatPanelForGrid.switchToTab('grid');
        // And I expand "Layout" section
        await newFormatPanelForGrid.expandLayoutSection();
        // And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
        // When I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // #When I rename the "attribute" from "Item Category" into "Category" in the Editor Panel
        // #Then I pause execution for 2 seconds
        // When I collapse the attribute "Supplier" in outline mode from grid visualization "Visualization 1"
        await vizPanelForGrid.collapseOutlineFromColumnHeader('Supplier', 'Visualization 1');
        // Then the grid cell in visualization "Visualization 1" at "3", "2" has style "background-color" with value "rgba(248, 248, 248, 1)"
        await since(
            'the grid cell in visualization "Visualization 1" at "3", "2" has style "background-color" with value "rgba(248, 248, 248, 1)", while we got #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellStyleByPosition(3, 2, 'Visualization 1', 'background-color'))
            .toBe('rgba(248,248,248,1)');
        // #When I expand the attribute "Supplier" in outline mode from grid visualization "Visualization 1"
        // When I expand the element "BMG" in outline mode from grid visualization "Visualization 1"
        await vizPanelForGrid.expandOutlineFromColumnHeader('BMG', 'Visualization 1');
        // When I add a column set for the compound grid
        await vizPanelForGrid.addColumnSet();
        // And I drag "attribute" named "Month" from dataset "retail-sample-data.xls" to Column Set "Column Set 2" in compound grid
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ(
            'Month',
            'attribute',
            'retail-sample-data.xls',
            'Column Set 2'
        );
        // And I drag "metric" named "Units Available" from dataset "retail-sample-data.xls" to Column Set "Column Set 2" in compound grid
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ(
            'Units Available',
            'metric',
            'retail-sample-data.xls',
            'Column Set 2'
        );
        // When I expand the attribute "Supplier" in outline mode from grid visualization "Visualization 1"
        await vizPanelForGrid.expandOutlineFromColumnHeader('Supplier', 'Visualization 1');
        // When I delete the Column Set named "Column Set 1" from compound grid
        await vizPanelForGrid.deleteColumnSet('Column Set 1');
        // #Then I pause execution for 1 seconds
        // When I open the Thresholds editor for object "Units Available" from column set "Column Set 2" for compound grid visualization "Visualization 1"
        await thresholdEditor.openThresholdEditorFromCompoundGridDropzone('Units Available', 'Column Set 2');
        // And I open the color band drop down menu
        await thresholdEditor.openSimpleThresholdColorBandDropDownMenu();
        // And I select the color band "Traffic Lights" in simple threshold editor
        await thresholdEditor.selectSimpleThresholdColorBand('Traffic Lights');
        // When I save and close Simple Thresholds Editor
        await thresholdEditor.saveAndCloseSimThresholdEditor();
        // When I sort the attribute "Supplier" in descending order from grid visualization "Visualization 1"
        await vizPanelForGrid.sortDescending('Supplier', 'Visualization 1');
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I switch to the "Text and Form" section on new format panel
        await baseFormatPanelReact.switchSection('Text and Form');
        // And I change the segment dropdown from "Entire Grid" to "Column Headers" through the new format panel
        await baseFormatPanelReact.changeSegmentControl('Entire Grid', 'Column Headers');
        // When I open the cell fill color picker
        await newFormatPanelForGrid.clickCellFillColorBtn();
        // And I switch the color picker to swatch mode
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');
        // And I select the built-in color "#FFF3B3" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#FFF3B3');
        // And I click to close the color picker
        await baseFormatPanelReact.dismissColorPicker();
        // Then the cells fill color is "rgba(255, 243, 179, 1)" in the new format panel
        await since('the cells fill color is "rgba(255, 243, 179, 1)" in the new format panel, while we got #{actual}')
            .expect((await newFormatPanelForGrid.fillColor.getCSSProperty('background-color')).value)
            .toBe('rgba(255,243,179,1)');
        // And the grid cell in visualization "Visualization 1" at "1", "2" has style "background-color" with value "rgba(255, 243, 179, 1)"
        await since(
            'the grid cell in visualization "Visualization 1" at "1", "2" has style "background-color" with value "rgba(255, 243, 179, 1)", while we got #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellStyleByPosition(1, 2, 'Visualization 1', 'background-color'))
            .toBe('rgba(255,243,179,1)');

        // When I switch to Filter Panel tab
        await filterPanel.switchToFilterPanel();
        // When I add "Month" into Filter Panel from Add Filter menu
        await filterPanel.addFromAddFilters('Month');
        // # add one more click to dismiss the tooltips
        // And I switch to Filter Panel tab
        await filterPanel.switchToFilterPanel();
        // When I change selector "Month" style into "Drop-down" in the Filter Panel
        await filterPanel.changeDisplayStyle('Month', 'Drop-down');
        // When I select "Feb" from multiple drop-down selector "Month" in the Filter Panel
        await filterPanel.multipleDropdown('Month', 'Feb');
        // Then I pause execution for 2 seconds
        await browser.pause(2000);
        // Then The dossier's screenshot "CompoundGridOutlineMode2" should match the baselines
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'CompoundGridOutlineMode2',
            'TC41289_2_01'
        );
    });

    it('[TC61113] Testing Outline Mode in Grids | Regression', async () => {
        // When I open dossier by its ID "B5B6D9F611EA07077A040080EFC51258"
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.Formatting.project.id,
            dossierId: gridConstants.Formatting.id,
        });
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // Then I pause execution for 1 seconds
        // When I insert page for chapter "Chapter 1"
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        // When I delete page "Page 1" in "Chapter 1"
        await tocContentsPanel.contextMenuOnPage('Page 1', 'Chapter 1', 'Delete');
        // When I add "attribute" named "Month" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Month', 'attribute', 'retail-sample-data.xls');
        // Then The editor panel should have "attribute" named "Month" on "Rows" section
        //     When I add "attribute" named "Supplier" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Supplier', 'attribute', 'retail-sample-data.xls');
        //     Then The editor panel should have "attribute" named "Supplier" on "Rows" section

        //     When I add "metric" named "Cost" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');
        //     Then The editor panel should have "metric" named "Cost" on "Metrics" section
        //     When I add "metric" named "Revenue" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Revenue', 'metric', 'retail-sample-data.xls');
        //     Then The editor panel should have "metric" named "Revenue" on "Metrics" section

        //     Then the grid cell in visualization "Visualization 1" at "2", "2" has text "20th Century Fox"
        await since(
            'the grid cell in visualization "Visualization 1" at "2", "2" has text "20th Century Fox", while we got #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('20th Century Fox');
        //     And the grid cell in visualization "Visualization 1" at "3", "2" has text "$182,398"
        await since(
            'the grid cell in visualization "Visualization 1" at "3", "2" has text "$182,398", while we got #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('$182,398');

        //     # 3. Go to Format Panel > General Settings > Enable Outline
        //     When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        //     And I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
        //     And I expand "Layout" section
        await newFormatPanelForGrid.expandLayoutSection();
        //     And I click Enable Outline check box under Layout section
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
        //     Then the grid cell in visualization "Visualization 1" at "4", "2" has text "20th Century Fox"
        await since(
            'the grid cell in visualization "Visualization 1" at "4", "2" has text "20th Century Fox", while we got #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(4, 2, 'Visualization 1'))
            .toBe('20th Century Fox');
        //     And the grid cell in visualization "Visualization 1" at "5", "3" has text "$182,398"
        await since(
            'the grid cell in visualization "Visualization 1" at "5", "3" has text "$182,398", while we got #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(5, 3, 'Visualization 1'))
            .toBe('$182,398');
        //     And the grid cell in visualization "Visualization 1" at "45", "2" has text "Audiotronics Inc."
        await since(
            'the grid cell in visualization "Visualization 1" at "45", "2" has text "Audiotronics Inc.", while we got #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(45, 2, 'Visualization 1'))
            .toBe('Audiotronics Inc.');
        //     And the grid cell in visualization "Visualization 1" at "46", "3" has text "$407,369"
        await since(
            'the grid cell in visualization "Visualization 1" at "46", "3" has text "$407,369", while we got #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(46, 3, 'Visualization 1'))
            .toBe('$407,369');

        //     When I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();

        //     # 4. Collapse the grid at the column level (attribute column)
        //     When I collapse the attribute "Month" in outline mode from grid visualization "Visualization 1"
        await vizPanelForGrid.collapseOutlineFromColumnHeader('Month', 'Visualization 1');
        //     Then the grid cell in visualization "Visualization 1" at "4", "2" is not visible
        await since(
            'the grid cell in visualization "Visualization 1" at "4", "2" is not visible, while we got #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 2, 'Visualization 1').isDisplayed())
            .toBe(false);
        //     And the grid cell in visualization "Visualization 1" at "5", "3" is not visible
        await since(
            'the grid cell in visualization "Visualization 1" at "5", "3" is not visible, while we got #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 3, 'Visualization 1').isDisplayed())
            .toBe(false);
        //     And the grid cell in visualization "Visualization 1" at "45", "2" is not visible
        await since(
            'the grid cell in visualization "Visualization 1" at "45", "2" is not visible, while we got #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(45, 2, 'Visualization 1').isDisplayed())
            .toBe(false);
        //     And the grid cell in visualization "Visualization 1" at "46", "3" is not visible
        await since(
            'the grid cell in visualization "Visualization 1" at "46", "3" is not visible, while we got #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(46, 3, 'Visualization 1').isDisplayed())
            .toBe(false);
        // take screenshot of visualization "Visualization 1"
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'OutlineMode_CollapseColumnLevel',
            'TC61113_01'
        );

        //     # 5. Expand the grid at the row level

        //     When I expand the element "Jan" in outline mode from grid visualization "Visualization 1"
        await vizPanelForGrid.expandOutlineFromColumnHeader('Jan', 'Visualization 1');
        //     Then the grid cell in visualization "Visualization 1" at "4", "2" is visible
        //     And the grid cell in visualization "Visualization 1" at "5", "3" is visible
        //     And the grid cell in visualization "Visualization 1" at "45", "2" is not visible
        //     And the grid cell in visualization "Visualization 1" at "46", "3" is not visible
        // take screenshot of visualization "Visualization 1"
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'OutlineMode_ExpandRowLevel',
            'TC61113_02'
        );

        //     # 6. Sort the grid
        //     When I sort the "attribute" named "Month" in "Sort Descending" in Editor Panel
        await editorPanelForGrid.simpleSort('Month', 'Sort Descending');
        //     Then the grid cell in visualization "Visualization 1" at "4", "2" is not visible
        //     And the grid cell in visualization "Visualization 1" at "5", "3" is not visible
        //     And the grid cell in visualization "Visualization 1" at "45", "2" is not visible
        // take screenshot of visualization "Visualization 1"
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'OutlineMode_SortDescending',
            'TC61113_03'
        );

        //     # 7. Expand and collapse the grid at row and column level and perform some manipulations
        //     When I expand the attribute "Month" in outline mode from grid visualization "Visualization 1"
        await vizPanelForGrid.expandOutlineFromColumnHeader('Month', 'Visualization 1');
        //     And I collapse the element "Dec" in outline mode from grid visualization "Visualization 1"
        await vizPanelForGrid.collapseOutlineFromColumnHeader('Dec', 'Visualization 1');
        await browser.pause(2000);
        //     Then the grid cell in visualization "Visualization 1" at "4", "2" is not visible
        await since(
            'the grid cell in visualization "Visualization 1" at "4", "2" is not visible, while we got #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 2, 'Visualization 1').isDisplayed())
            .toBe(false);

        //     When I right click on the grid cell "$98,550" and select "Keep Only" from visualization "Visualization 1"
        await vizPanelForGrid.openContextMenuItemForGridCell('$98,550', 'Keep Only', 'Visualization 1');
        //     Then the grid cell in visualization "Visualization 1" at "45", "2" is not present
        await since(
            'the grid cell in visualization "Visualization 1" at "45", "2" is not present, while we got #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(45, 2, 'Visualization 1').isDisplayed())
            .toBe(false);

        //     # 8. Go to presentation mode and collapse/expand the grid
        //     When I clear all filters on visualization "Visualization 1"
        await toolbar.clickButtonFromToolbar('Undo');

        //     And I pause execution for 2 seconds
        //     And I select "Presentation Mode" from toolbar
        //     Then the grid cell in visualization "Visualization 1" at "45", "2" is present
        //     And the grid cell in visualization "Visualization 1" at "45", "2" is visible
        //     When I collapse the element "Dec" in outline mode from grid visualization "Visualization 1"
        await vizPanelForGrid.collapseOutlineFromColumnHeader('Dec', 'Visualization 1');
        //     Then the grid cell in visualization "Visualization 1" at "4", "2" is not visible
        await since(
            'the grid cell in visualization "Visualization 1" at "4", "2" is not visible, while we got #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 2, 'Visualization 1').isDisplayed())
            .toBe(false);

        //     When I expand the element "Dec" in outline mode from grid visualization "Visualization 1"
        await vizPanelForGrid.expandOutlineFromColumnHeader('Dec', 'Visualization 1');
        //     Then the grid cell in visualization "Visualization 1" at "4", "2" is visible
        await since('the grid cell in visualization "Visualization 1" at "4", "2" is visible, while we got #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 2, 'Visualization 1').isDisplayed())
            .toBe(true);
        //     # 9. Disable/enable subtotals
        //     When I select "Edit" from toolbar
        //     And I switch to Editor Panel tab
        //     Then the grid cell in visualization "Visualization 1" at "2", "2" has text "$165,880,424"
        await since(
            'the grid cell in visualization "Visualization 1" at "2", "2" has text "$165,880,424", while we got #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('$165,880,424');

        //     When I toggle totals from editor panel
        await editorPanelForGrid.showTotal();
        //     Then the grid cell in visualization "Visualization 1" at "3", "3" has text "$632,790"
        await since(
            'the grid cell in visualization "Visualization 1" at "3", "3" has text "$632,790", while we got #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 3, 'Visualization 1'))
            .toBe('$632,790');

        //     When I toggle totals from editor panel
        await editorPanelForGrid.showTotal();
        //     Then the grid cell in visualization "Visualization 1" at "2", "2" has text "$165,880,424"
        await since(
            'the grid cell in visualization "Visualization 1" at "2", "2" has text "$165,880,424", while we got #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('$165,880,424');

        //     # 10. Move objects around in the grid
        //     When I move "Revenue" from grid visualization "Visualization 1" to column 2 in grid visualization "Visualization 1"
        await vizPanelForGrid.moveObjectToGridByColumnBorder('Revenue', 'Visualization 1', 2, 'Visualization 1');
        //     And I complete drop action
        //     #DE257466 Not able to DnD metric header to reposition the metrics in grid
        //     Then the grid cell in visualization "Visualization 1" at "3", "2" has text "$23,545,674"
        await since(
            'the grid cell in visualization "Visualization 1" at "3", "2" has text "$23,545,674", while we got #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('$23,545,674');
        //     And the grid cell in visualization "Visualization 1" at "4", "3" has text "$960,361"
        await since(
            'the grid cell in visualization "Visualization 1" at "4", "3" has text "$960,361", while we got #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(4, 3, 'Visualization 1'))
            .toBe('$960,361');
        // take screenshot of visualization "Visualization 1"
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'OutlineMode_MoveObjects',
            'TC61113_04'
        );
    });
});
