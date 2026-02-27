import * as gridConstants from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('Advanced Thresholds Editor for AG-grid', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        loginPage,
        libraryPage,
        editorPanelForGrid,
        thresholdEditor,
        advancedFilter,
        reportGridView,
        vizPanelForGrid,
        datasetPanel,
        baseVisualization,
        agGridVisualization,
        loadingDialog,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    it('[TC71084] Manipulation on thresholds editor in AG-grid', async () => {
        // Edit dossier by its ID "B9F6A25111EB238D4B550080EF95F2EA"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > AGGrid_IncrementalFetch
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridIncrementalFetch.project.id,
            dossierId: gridConstants.AGGridIncrementalFetch.id,
        });

        // When I change visualization "Visualization 1" to "Grid (Modern)" from context menu
        await baseVisualization.changeVizType('Visualization 1', 'Grid', 'Grid (Modern)');
        // And I add "attribute" named "City" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('City', 'attribute', 'retail-sample-data.xls');
        // And I add "attribute" named "Item Category" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Item Category', 'attribute', 'retail-sample-data.xls');
        // And I add "metric" named "Cost" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');
        // And I add "metric" named "Revenue" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Revenue', 'metric', 'retail-sample-data.xls');
        // #start test steps for DE153116
        // When I right click on element "Cost" and select "Add Thresholds..." from ag-grid "Visualization 1"
        await agGridVisualization.openMenuItem('Cost', 'Add Thresholds...', 'Visualization 1');

        // And I open the color band drop down menu
        await thresholdEditor.openSimpleThresholdColorBandDropDownMenu();
        // And I select the color band "Business Blue" in simple threshold editor
        await thresholdEditor.selectSimpleThresholdColorBand('Business Blue');
        // And I select the Based on metric "Cost" in simple threshold editor
        await thresholdEditor.selectSimpleThresholdBasedOnObject('Cost');

        // // And I add a handler in the middle area
        // await thresholdEditor.clickOnCheckMarkOnFormatPreviewPanel();
        // And I save and close Simple Thresholds Editor
        await thresholdEditor.saveAndCloseSimThresholdEditor();
        // # cost - threshold
        // Then the grid cell in ag-grid "Visualization 1" at "1", "2" has style "background-color" with value "rgba(46, 120, 187, 1)"
        await since(
            'Grid cell at row 1, col 2 in Visualization 1 should have style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 2, 'background-color'))
            .toEqual('rgba(46,120,187,1)');
        // And the grid cell in ag-grid "Visualization 1" at "3", "2" has style "background-color" with value "rgba(85, 141, 204, 1)"
        await since(
            'Grid cell at row 3, col 2 in Visualization 1 should have style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 2, 'background-color'))
            .toEqual('rgba(85,141,204,1)');
        // And the grid cell in ag-grid "Visualization 1" at "4", "2" has style "background-color" with value "rgba(210, 224, 232, 1)"
        await since(
            'Grid cell at row 4, col 2 in Visualization 1 should have style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 2, 'background-color'))
            .toEqual('rgba(210,224,232,1)');
        // And the grid cell in ag-grid "Visualization 1" at "1", "2" has text "$760,697"
        await since('Grid cell at row 1, col 2 in Visualization 1 should have text "#{expected}", but got "#{actual}"')
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toEqual('$760,697');
        // And the grid cell in ag-grid "Visualization 1" at "3", "2" has text "$647,747"
        await since('Grid cell at row 3, col 2 in Visualization 1 should have text "#{expected}", but got "#{actual}"')
            .expect(await reportGridView.getGridCellTextByPos(3, 2))
            .toEqual('$647,747');
        // And the grid cell in ag-grid "Visualization 1" at "4", "2" has text "$115,299"
        await since('Grid cell at row 4, col 2 in Visualization 1 should have text "#{expected}", but got "#{actual}"')
            .expect(await reportGridView.getGridCellTextByPos(4, 2))
            .toEqual('$115,299');
        // # revenue - no threshold
        // And the grid cell in ag-grid "Visualization 1" at "1", "3" has style "background-color" with value "rgba(255, 255, 255, 1)"
        await since(
            'Grid cell at row 1, col 3 in Visualization 1 should have style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 3, 'background-color'))
            .toEqual('rgba(255,255,255,1)');
        // take screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC71084_01',
            'Color based threshold on Cost'
        );
        // When I right click on element "Cost" and select "Edit Thresholds..." from ag-grid "Visualization 1"
        await agGridVisualization.openMenuItem('Cost', 'Edit Thresholds...', 'Visualization 1');
        // And I switch the simple threshold type from "Color-based" to "Image-based" in simple threshold editor
        await thresholdEditor.switchSimpleThresholdsTypeI18N('Image-based');
        // And I open the image band drop down menu
        await thresholdEditor.openSimpleThresholdImageBandDropDownMenu();
        // And I select the image band "Truck" in simple threshold editor
        await thresholdEditor.selectSimpleThresholdImageBand('Truck');
        // And I save and close Simple Thresholds Editor
        await thresholdEditor.saveAndCloseSimThresholdEditor();
        // # cost - switch to img based
        // Then the grid cell in ag-grid "Visualization 1" at "1", "2" has style "background-color" with value "rgba(255, 255, 255, 1)"
        await since(
            'Grid cell at row 1, col 2 in Visualization 1 should have style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 2, 'background-color'))
            .toEqual('rgba(255,255,255,1)');
        // And the grid cell in ag-grid "Visualization 1" at "3", "2" has style "background-color" with value "rgba(255, 255, 255, 1)"
        await since(
            'Grid cell at row 3, col 2 in Visualization 1 should have style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 2, 'background-color'))
            .toEqual('rgba(255,255,255,1)');
        // And the grid cell in ag-grid "Visualization 1" at "4", "2" has style "background-color" with value "rgba(255, 255, 255, 1)"
        await since(
            'Grid cell at row 4, col 2 in Visualization 1 should have style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 2, 'background-color'))
            .toEqual('rgba(255,255,255,1)');
        // And the grid cell in ag-grid "Visualization 1" at "1", "2" has image "/images/quickThresholdImgs/truck_green.png"
        await since('Grid cell at row 1, col 2 in Visualization 1 should have image "#{expected}", but got "#{actual}"')
            .expect(await reportGridView.getGridCellImgSrcByPos(1, 2))
            .toContain('/images/quickThresholdImgs/truck_green.png');
        // And the grid cell in ag-grid "Visualization 1" at "3", "2" has image "/images/quickThresholdImgs/truck_left.png"
        await since('Grid cell at row 3, col 2 in Visualization 1 should have image "#{expected}", but got "#{actual}"')
            .expect(await reportGridView.getGridCellImgSrcByPos(3, 2))
            .toContain('/images/quickThresholdImgs/truck_left.png');
        // And the grid cell in ag-grid "Visualization 1" at "4", "2" has image "/images/quickThresholdImgs/truck_red.png"
        await since('Grid cell at row 4, col 2 in Visualization 1 should have image "#{expected}", but got "#{actual}"')
            .expect(await reportGridView.getGridCellImgSrcByPos(4, 2))
            .toContain('/images/quickThresholdImgs/truck_red.png');

        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC71084_02',
            'Image based threshold on Cost'
        );

        // Remove Cost and re-add it to another column, the threshold should be kept
        // When I remove "metric" named "Cost" from the current Viz
        await editorPanelForGrid.removeFromDropZone('Cost', 'metric');
        // And I add "metric" named "Cost" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC71084_03',
            'Threshold should be kept after removing and re-adding Cost in another column'
        );

        // When I right click on element "Cost" and select "Clear Thresholds" from ag-grid "Visualization 1"
        await agGridVisualization.openMenuItem('Cost', 'Thresholds', 'Visualization 1');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC71084_04',
            'Clear threshold on Cost'
        );
    });

    it('[TC71096] Manipulation on thresholds format editor - metrics (simplified)', async () => {
        // Edit dossier by its ID "B9F6A25111EB238D4B550080EF95F2EA"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > AGGrid_IncrementalFetch
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridIncrementalFetch.project.id,
            dossierId: gridConstants.AGGridIncrementalFetch.id,
        });

        // When I change visualization "Visualization 1" to "Grid (Modern)" from context menu
        await baseVisualization.changeVizType('Visualization 1', 'Grid', 'Grid (Modern)');
        // And I add "attribute" named "City" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('City', 'attribute', 'retail-sample-data.xls');
        // And I add "metric" named "Cost" from dataset "retail-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');
        // And I drag "attribute" named "Month" from dataset "retail-sample-data.xls" to dropzone "Columns" and drop it above "Cost"
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Month',
            'attribute',
            'retail-sample-data.xls',
            'Columns',
            'above',
            'Cost'
        );
        // And I add a new column set to the ag-grid
        await agGridVisualization.addColumnSet();
        // And I drag "metric" named "Revenue" from dataset "retail-sample-data.xls" to Column Set "Column Set 2" in ag-grid
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ(
            'Revenue',
            'metric',
            'retail-sample-data.xls',
            'Column Set 2'
        );

        // Create threshold on "Month"
        // When I open Threshold Editor for the attribute named "Month" in the Grid Editor Panel
        await editorPanelForGrid.openAttributeThresholdsEditor('Month');
        await thresholdEditor.openNewThresholdCondition();
        // And I choose attribute "Month" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Month');
        // Then Choose Elements By dropdown should exist
        await advancedFilter.checkChooseElementsByDropdown();
        // When I select "Not In List" radio button for Qualification on in the Qualification editor
        await advancedFilter.selectInListOrNotInList('Not In List');
        // And I select elements "Jan,Feb,Mar" from the element list in the Advanced Threshold Editor
        await advancedFilter.doElementSelectionForAttributeFilter(['Jan', 'Feb', 'Mar']);
        // And I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();

        // When I select secondary option "New Condition" for threshold condition with index number "1"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('New Condition', '1');
        // And I choose metric "Cost" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Cost');
        // And I open Operator dropdown
        await advancedFilter.openOperatorDropDown();
        // And I select "By Value" from Operator dropdown
        await advancedFilter.doSelectionOnOperatorDropdown('By Value');
        // And I select "Greater than" as the attribute filter operator
        await advancedFilter.selectAttributeFilterOperator('Greater than');
        // When I type "260000" for Value input
        await advancedFilter.typeValueInput('260000');
        // Then I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();

        // When I select secondary option "Formatting" for threshold condition with index number "1"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Formatting', '1');
        // And I click Enable Data Replace option check box
        await thresholdEditor.clickOnEnableDataReplaceCheckBox();
        // And I select option "Quick Symbol" for Data Replace
        await thresholdEditor.selectOptionFromDataReplaceDropdownMenu('Quick Symbol');
        // And I open quick symbol drop down menu
        await thresholdEditor.openQuickSymbolDropDownMenu();
        // And I select quick symbol with index number "6"
        await thresholdEditor.selectQuickSymbolByIndexNumber('6');

        // When I open font color dropdown menu
        await thresholdEditor.openFontColorDropdownMenu();
        // And I select font color by color name "Orange"
        await thresholdEditor.selectFontColorByColorName('Orange');
        // And I click "italic" button in the format editor
        await thresholdEditor.clickOnOptionOnTheFontButtonBar('italic');
        // And I set fill color to "Bright Green" in the format preview panel
        await thresholdEditor.setFillColor('Bright Green');
        // When I click check mark on Format Preview panel
        await thresholdEditor.clickOnCheckMarkOnFormatPreviewPanel();
        // And I save and close Advanced Thresholds Editor
        await thresholdEditor.saveAndCloseAdvancedThresholdEditor();

        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC71096_01',
            'Threshold on Month'
        );

        // #5.2 Create threshold on "Cost"
        // When I open Threshold Editor for the metric named "Cost" in the Grid Editor Panel
        await editorPanelForGrid.openThresholdsEditor('Cost');
        // And I switch from simple threshold editor to advanced threshold editor and clear the thresholds in threshold editor
        await thresholdEditor.switchSimToAdvThresholdWithClear();
        // When I click New Threshold button to open the new threshold condition editor in advanced threshold editor
        await thresholdEditor.openNewThresholdCondition();
        // And I choose metric "Cost" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Cost');
        // And I open Operator dropdown
        await advancedFilter.openOperatorDropDown();
        // And I select "By Value" from Operator dropdown
        await advancedFilter.doSelectionOnOperatorDropdown('By Value');
        // And I select "Less than" as the attribute filter operator
        await advancedFilter.selectAttributeFilterOperator('Less than');
        // When I type "260000" for Value input
        await advancedFilter.typeValueInput('260000');
        // Then I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();

        // When I select secondary option "New Condition" for threshold condition with index number "1"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('New Condition', '1');
        // And I choose attribute "Month" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Month');
        // When I open Choose Elements By dropdown
        await advancedFilter.openChooseElementsByDropDown();
        // And I select "Selecting in list" from Choose Elements By dropdown
        await advancedFilter.doSelectionOnChooseElementsByDropdown('Selecting in list');
        // And I select elements "Apr,May,Jun" from the element list in the Advanced Threshold Editor
        await advancedFilter.doElementSelectionForAttributeFilter(['Apr', 'May', 'Jun']);
        // And I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();

        // When I select secondary option "Formatting" for threshold condition with index number "1"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Formatting', '1');
        // And I click Enable Data Replace option check box
        await thresholdEditor.clickOnEnableDataReplaceCheckBox();
        // And I select option "Quick Symbol" for Data Replace
        await thresholdEditor.selectOptionFromDataReplaceDropdownMenu('Quick Symbol');
        // And I open quick symbol drop down menu
        await thresholdEditor.openQuickSymbolDropDownMenu();
        // And I select quick symbol with index number "10"
        await thresholdEditor.selectQuickSymbolByIndexNumber('10');

        // When I open font color dropdown menu
        await thresholdEditor.openFontColorDropdownMenu();
        // And I select font color by color name "Bright Green"
        await thresholdEditor.selectFontColorByColorName('Bright Green');
        // And I set fill color to "Orange" in the format preview panel
        await thresholdEditor.setFillColor('Orange');
        // When I click check mark on Format Preview panel
        await thresholdEditor.clickOnCheckMarkOnFormatPreviewPanel();
        // And I save and close Advanced Thresholds Editor
        await thresholdEditor.saveAndCloseAdvancedThresholdEditor();

        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC71096_02',
            'Threshold on Cost'
        );
    });

    it('[TC80795] Validate Thresholds in Rows for Modern (AG) Grid authoring and consumption modes | Acceptance', async () => {
        // Edit dossier by its ID "960410B0454F8CA52FA052BA67006D5B"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Threshold > AGGrid_Threshold_TC80795
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridThreshold.project.id,
            dossierId: gridConstants.AGGridThreshold.id,
        });

        // When I open Threshold Editor for the attribute named "Year" in the Grid Editor Panel
        await editorPanelForGrid.openAttributeThresholdsEditor('Year');

        // And I click New Threshold button to open the new threshold condition editor in advanced threshold editor
        await thresholdEditor.openNewThresholdCondition();

        // And I select column set "Column Set 1" to apply threshold to
        await thresholdEditor.openColumnSetPullDown();
        await thresholdEditor.selectColumnSet('Column Set 1');

        // And I choose attribute "Year" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Year');

        // Then Choose Elements By dropdown should exist
        await advancedFilter.checkChooseElementsByDropdown();

        // When I select "In List" radio button for Qualification on in the Qualification editor
        await advancedFilter.selectInListOrNotInList('In List');

        // And I select elements "2009" from the element list in the Advanced Threshold Editor
        await advancedFilter.doElementSelectionForAttributeFilter(['2009']);

        // And I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
        // When I select secondary option "Formatting" for threshold condition with index number "1"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Formatting', '1');

        // And I click Enable Data Replace option check box
        await thresholdEditor.clickOnEnableDataReplaceCheckBox();

        // And I select option "Quick Symbol" for Data Replace
        await thresholdEditor.selectOptionFromDataReplaceDropdownMenu('Quick Symbol');

        // And I open quick symbol drop down menu
        await thresholdEditor.openQuickSymbolDropDownMenu();

        // And I select quick symbol with index number "6"
        await thresholdEditor.selectQuickSymbolByIndexNumber('6');

        // When I open font color dropdown menu
        await thresholdEditor.openFontColorDropdownMenu();

        // And I select font color by color name "Orange"
        await thresholdEditor.selectFontColorByColorName('Orange');

        // And I click "italic" button in the format editor
        await thresholdEditor.clickOnOptionOnTheFontButtonBar('italic');

        // And I set fill color to "Bright Green" in the format preview panel
        await thresholdEditor.setFillColor('Bright Green');

        // When I click check mark on Format Preview panel
        await thresholdEditor.clickOnCheckMarkOnFormatPreviewPanel();
        // And I save and close Advanced Thresholds Editor
        await thresholdEditor.saveAndCloseAdvancedThresholdEditor();

        // Then the grid cell in ag-grid "Visualization 1" at "2", "0" has style "background-color" with value "rgba(0,255,0,1)"
        await since(
            'Grid cell at row 2, col 0 in Visualization 1 should have style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 0, 'background-color'))
            .toEqual('rgba(0,255,0,1)');

        // And the grid cell in ag-grid "Visualization 1" at "2", "0" has style "color" with value "rgba(255,102,0,1)"
        await since(
            'Grid cell at row 2, col 0 in Visualization 1 should have style "color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 0, 'color'))
            .toEqual('rgba(255,102,0,1)');

        // And the grid cell in ag-grid "Visualization 1" at "2", "0" has style "font-style" with value "italic"
        await since(
            'Grid cell at row 2, col 0 in Visualization 1 should have style "font-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 0, 'font-style'))
            .toEqual('italic');

        // And the grid cell in ag-grid "Visualization 1" at "2", "0" has text "✿"
        await since('Grid cell at row 2, col 0 in Visualization 1 should have text "#{expected}", but got "#{actual}"')
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toEqual('✿');

        // And the grid cell in ag-grid "Visualization 1" at "3", "0" has style "background-color" with value "rgba(255,255,255,1)"
        await since(
            'Grid cell at row 3, col 0 in Visualization 1 should have style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 0, 'background-color'))
            .toEqual('rgba(255,255,255,1)');

        // And the grid cell in ag-grid "Visualization 1" at "3", "0" has style "color" with value "rgba(53,56,58,1)"
        await since(
            'Grid cell at row 3, col 0 in Visualization 1 should have style "color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 0, 'color'))
            .toEqual('rgba(53,56,58,1)');

        // And the grid cell in ag-grid "Visualization 1" at "4", "0" has style "background-color" with value "rgba(255,255,255,1)"
        await since(
            'Grid cell at row 4, col 0 in Visualization 1 should have style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 0, 'background-color'))
            .toEqual('rgba(255,255,255,1)');

        // And the grid cell in ag-grid "Visualization 1" at "4", "0" has style "color" with value "rgba(53,56,58,1)"
        await since(
            'Grid cell at row 4, col 0 in Visualization 1 should have style "color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 0, 'color'))
            .toEqual('rgba(53,56,58,1)');

        // And the grid cell in ag-grid "Visualization 1" at "4", "0" has style "font-style" with value "normal"
        await since(
            'Grid cell at row 4, col 0 in Visualization 1 should have style "font-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 0, 'font-style'))
            .toEqual('normal');

        // And the grid cell in ag-grid "Visualization 1" at "4", "0" has text "2011"
        await since('Grid cell at row 4, col 0 in Visualization 1 should have text "#{expected}", but got "#{actual}"')
            .expect(await reportGridView.getGridCellTextByPos(4, 0))
            .toEqual('2011');

        // When I open Threshold Editor for the attribute named "Year" in the Grid Editor Panel
        await editorPanelForGrid.openAttributeThresholdsEditor('Year');

        // And I click New Threshold button to open the new threshold condition editor in advanced threshold editor
        await thresholdEditor.openNewThresholdCondition();
        // And I select column set "Column Set 2" to apply threshold to
        await thresholdEditor.openColumnSetPullDown();
        await thresholdEditor.selectColumnSet('Column Set 2');

        // And I choose attribute "On-Time" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('On-Time');

        // And I open Operator dropdown
        await advancedFilter.openOperatorDropDown();

        // And I select "By Value" from Operator dropdown
        await advancedFilter.doSelectionOnOperatorDropdown('By Value');

        // And I select "Less than" as the attribute filter operator
        await advancedFilter.selectAttributeFilterOperator('Less than');

        // When I type "10000" for Value input
        await advancedFilter.typeValueInput('10000');

        // Then I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();

        // When I select secondary option "Formatting" for threshold condition with index number "2"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Formatting', '2');

        // And I set fill color to "Lime" in the format preview panel
        await thresholdEditor.setFillColor('Lime');

        // And I click check mark on Format Preview panel
        await thresholdEditor.clickOnCheckMarkOnFormatPreviewPanel();
        // And I save and close Advanced Thresholds Editor
        await thresholdEditor.saveAndCloseAdvancedThresholdEditor();

        // Then the grid cell in ag-grid "Visualization 1" at "2", "0" has style "background-color" with value "rgba(0,255,0,1)"
        await since(
            'Grid cell at row 2, col 0 in Visualization 1 should have style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 0, 'background-color'))
            .toEqual('rgba(0,255,0,1)');

        // And the grid cell in ag-grid "Visualization 1" at "2", "0" has style "color" with value "rgba(255,102,0,1)"
        await since(
            'Grid cell at row 2, col 0 in Visualization 1 should have style "color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 0, 'color'))
            .toEqual('rgba(255,102,0,1)');

        // And the grid cell in ag-grid "Visualization 1" at "2", "0" has style "font-style" with value "italic"
        await since(
            'Grid cell at row 2, col 0 in Visualization 1 should have style "font-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 0, 'font-style'))
            .toEqual('italic');

        // And the grid cell in ag-grid "Visualization 1" at "2", "0" has text "✿"
        await since('Grid cell at row 2, col 0 in Visualization 1 should have text "#{expected}", but got "#{actual}"')
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toEqual('✿');

        // And the grid cell in ag-grid "Visualization 1" at "4", "0" has style "background-color" with value "rgba(153,204,0,1)"
        await since(
            'Grid cell at row 4, col 0 in Visualization 1 should have style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 0, 'background-color'))
            .toEqual('rgba(153,204,0,1)');

        // And the grid cell in ag-grid "Visualization 1" at "4", "0" has style "color" with value "rgba(53,56,58,1)"
        await since(
            'Grid cell at row 4, col 0 in Visualization 1 should have style "color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 0, 'color'))
            .toEqual('rgba(53,56,58,1)');

        // And the grid cell in ag-grid "Visualization 1" at "4", "0" has style "font-style" with value "normal"
        await since(
            'Grid cell at row 4, col 0 in Visualization 1 should have style "font-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 0, 'font-style'))
            .toEqual('normal');

        // And the grid cell in ag-grid "Visualization 1" at "4", "0" has text "2011"
        await since('Grid cell at row 4, col 0 in Visualization 1 should have text "#{expected}", but got "#{actual}"')
            .expect(await reportGridView.getGridCellTextByPos(4, 0))
            .toEqual('2011');

        // And the grid cell in ag-grid "Visualization 1" at "3", "0" has style "background-color" with value "rgba(255,255,255,1)"
        await since(
            'Grid cell at row 3, col 0 in Visualization 1 should have style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 0, 'background-color'))
            .toEqual('rgba(255,255,255,1)');

        // And the grid cell in ag-grid "Visualization 1" at "3", "0" has style "color" with value "rgba(53,56,58,1))"
        await since(
            'Grid cell at row 3, col 0 in Visualization 1 should have style "color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 0, 'color'))
            .toEqual('rgba(53,56,58,1)');

        // When I open Threshold Editor for the attribute named "Year" in the Grid Editor Panel
        await editorPanelForGrid.openAttributeThresholdsEditor('Year');
        // And I click New Threshold button to open the new threshold condition editor in advanced threshold editor
        await thresholdEditor.openNewThresholdCondition();
        // And I select column set "Avg Delay (min) Trend by Month" to apply threshold to
        await thresholdEditor.openColumnSetPullDown();
        await thresholdEditor.selectColumnSet('Avg Delay (min) Trend by Month');
        // And I choose metric "Avg Delay (min)" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Avg Delay (min)');
        // And I select "Between" as the attribute filter operator
        await advancedFilter.selectAttributeFilterOperator('Between');
        // And I type "62500" for Value input
        await advancedFilter.typeValueInput('62500');
        // And I type "63000" for the second Value input
        await advancedFilter.typeAndInput('63000');
        // Then I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();

        // When I select secondary option "Formatting" for threshold condition with index number "3"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Formatting', '3');
        // And I click Enable Data Replace option check box
        await thresholdEditor.clickOnEnableDataReplaceCheckBox();
        // And I select option "Replace Text" for Data Replace
        await thresholdEditor.selectOptionFromDataReplaceDropdownMenu('Replace Text');
        // And I input "2010 Replace" in the text box for replace text or image
        await thresholdEditor.replaceInTextBox('2010 Replace');
        // When I open font family dropdown menu
        await thresholdEditor.openFontFamilyDropdownMenu();
        // And I select font by font name "Noto Sans"
        await thresholdEditor.selectFontByFontName('Noto Sans');
        // When I open font size dropdown menu
        await thresholdEditor.openFontSizeDropdownMenu();
        // And I select font size by size number "20"
        await thresholdEditor.selectFontSizeBySizeNumber('20');
        // When I open font color dropdown menu
        await thresholdEditor.openFontColorDropdownMenu();
        // And I select font color by color name "Pale Blue"
        await thresholdEditor.selectFontColorByColorName('Pale Blue');
        // And I click "bold" button in the format editor
        await thresholdEditor.clickOnOptionOnTheFontButtonBar('bold');
        // And I click check mark on Format Preview panel
        await thresholdEditor.clickOnCheckMarkOnFormatPreviewPanel();
        // And I save and close Advanced Thresholds Editor
        await thresholdEditor.saveAndCloseAdvancedThresholdEditor();

        // Then the grid cell in ag-grid "Visualization 1" at "2", "0" has style "background-color" with value "rgba(0, 255, 0, 1)"
        await since(
            'Grid cell at row 2, col 0 in Visualization 1 should have style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 0, 'background-color'))
            .toEqual('rgba(0,255,0,1)');
        // And the grid cell in ag-grid "Visualization 1" at "2", "0" has style "color" with value "rgba(255, 102, 0, 1)"
        await since(
            'Grid cell at row 2, col 0 in Visualization 1 should have style "color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 0, 'color'))
            .toEqual('rgba(255,102,0,1)');
        // And the grid cell in ag-grid "Visualization 1" at "2", "0" has style "font-style" with value "italic"
        await since(
            'Grid cell at row 2, col 0 in Visualization 1 should have style "font-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 0, 'font-style'))
            .toEqual('italic');
        // And the grid cell in ag-grid "Visualization 1" at "2", "0" has text "✿"
        await since('Grid cell at row 2, col 0 in Visualization 1 should have text "#{expected}", but got "#{actual}"')
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toEqual('✿');
        // And the grid cell in ag-grid "Visualization 1" at "4", "0" has style "background-color" with value "rgba(153, 204, 0, 1)"
        await since(
            'Grid cell at row 4, col 0 in Visualization 1 should have style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 0, 'background-color'))
            .toEqual('rgba(153,204,0,1)');
        // And the grid cell in ag-grid "Visualization 1" at "4", "0" has style "color" with value "rgba(53, 56, 58, 1)"
        await since(
            'Grid cell at row 4, col 0 in Visualization 1 should have style "color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 0, 'color'))
            .toEqual('rgba(53,56,58,1)');
        // And the grid cell in ag-grid "Visualization 1" at "4", "0" has style "font-style" with value "normal"
        await since(
            'Grid cell at row 4, col 0 in Visualization 1 should have style "font-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 0, 'font-style'))
            .toEqual('normal');
        // And the grid cell in ag-grid "Visualization 1" at "4", "0" has text "2011"
        await since('Grid cell at row 4, col 0 in Visualization 1 should have text "#{expected}", but got "#{actual}"')
            .expect(await reportGridView.getGridCellTextByPos(4, 0))
            .toEqual('2011');
        // And the grid cell in ag-grid "Visualization 1" at "3", "0" has style "background-color" with value "rgba(255, 255, 255, 1)"
        await since(
            'Grid cell at row 3, col 0 in Visualization 1 should have style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 0, 'background-color'))
            .toEqual('rgba(255,255,255,1)');
        // And the grid cell in ag-grid "Visualization 1" at "3", "0" has style "color" with value "rgba(153, 204, 255, 1)"
        await since(
            'Grid cell at row 3, col 0 in Visualization 1 should have style "color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 0, 'color'))
            .toEqual('rgba(153,204,255,1)');
        // And the grid cell in ag-grid "Visualization 1" at "3", "0" has style "font-family" with value "Noto Sans"
        await since(
            'Grid cell at row 3, col 0 in Visualization 1 should have style "font-family" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 0, 'font-family'))
            .toEqual('noto sans');
        // And the grid cell in ag-grid "Visualization 1" at "3", "0" has style "font-size" with value "26.6667px"
        await since(
            'Grid cell at row 3, col 0 in Visualization 1 should have style "font-size" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 0, 'font-size'))
            .toEqual('26.67px');
        // And the grid cell in ag-grid "Visualization 1" at "3", "0" has style "font-weight" with value "700"
        await since(
            'Grid cell at row 3, col 0 in Visualization 1 should have style "font-weight" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 0, 'font-weight'))
            .toEqual('700');
        // And the grid cell in ag-grid "Visualization 1" at "3", "0" has text "2010 Replace"
        await since('Grid cell at row 3, col 0 in Visualization 1 should have text "#{expected}", but got "#{actual}"')
            .expect(await reportGridView.getGridCellTextByPos(3, 0))
            .toEqual('2010 Replace');

        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC80795_01',
            '3 kinds threshold apply on Year'
        );

        // Create threshold on attribute in Column Set
        // When I open Threshold Editor for the attribute named "Origin Airport" in the Grid Editor Panel
        await editorPanelForGrid.openAttributeThresholdsEditor('Origin Airport');
        // And I click New Threshold button to open the new threshold condition editor in advanced threshold editor
        await thresholdEditor.openNewThresholdCondition();
        // And I choose attribute "Origin Airport" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Origin Airport');
        // Then Choose Elements By dropdown should exist
        await advancedFilter.checkChooseElementsByDropdown();
        // When I select "In List" radio button for Qualification on in the Qualification editor
        await advancedFilter.selectInListOrNotInList('In List');
        // And I select elements "DCA" from the element list in the Advanced Threshold Editor
        await advancedFilter.doElementSelectionForAttributeFilter(['DCA']);
        // And I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
        // When I select secondary option "Formatting" for threshold condition with index number "1"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Formatting', '1');
        // When I open font size dropdown menu
        await thresholdEditor.openFontSizeDropdownMenu();
        // And I select font size by size number "12"
        await thresholdEditor.selectFontSizeBySizeNumber('12');
        // When I open font color dropdown menu
        await thresholdEditor.openFontColorDropdownMenu();
        // And I select font color by color name "Violet"
        await thresholdEditor.selectFontColorByColorName('Violet');
        // And I click "underline" button in the format editor
        await thresholdEditor.clickOnOptionOnTheFontButtonBar('underline');
        // And I click check mark on Format Preview panel
        await thresholdEditor.clickOnCheckMarkOnFormatPreviewPanel();
        // And I save and close Advanced Thresholds Editor
        await thresholdEditor.saveAndCloseAdvancedThresholdEditor();

        // Then the grid cell in ag-grid "Visualization 1" at "2", "0" has style "background-color" with value "rgba(0, 255, 0, 1)"
        await since(
            'Grid cell at row 2, col 0 in Visualization 1 should have style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 0, 'background-color'))
            .toEqual('rgba(0,255,0,1)');
        // And the grid cell in ag-grid "Visualization 1" at "2", "0" has style "color" with value "rgba(255, 102, 0, 1)"
        await since(
            'Grid cell at row 2, col 0 in Visualization 1 should have style "color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 0, 'color'))
            .toEqual('rgba(255,102,0,1)');
        // And the grid cell in ag-grid "Visualization 1" at "2", "0" has style "font-style" with value "italic"
        await since(
            'Grid cell at row 2, col 0 in Visualization 1 should have style "font-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 0, 'font-style'))
            .toEqual('italic');
        // And the grid cell in ag-grid "Visualization 1" at "2", "0" has text "✿"
        await since('Grid cell at row 2, col 0 in Visualization 1 should have text "#{expected}", but got "#{actual}"')
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toEqual('✿');
        // And the grid cell in ag-grid "Visualization 1" at "4", "0" has style "background-color" with value "rgba(153, 204, 0, 1)"
        await since(
            'Grid cell at row 4, col 0 in Visualization 1 should have style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 0, 'background-color'))
            .toEqual('rgba(153,204,0,1)');
        // And the grid cell in ag-grid "Visualization 1" at "4", "0" has style "color" with value "rgba(53, 56, 58, 1)"
        await since(
            'Grid cell at row 4, col 0 in Visualization 1 should have style "color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 0, 'color'))
            .toEqual('rgba(53,56,58,1)');
        // And the grid cell in ag-grid "Visualization 1" at "4", "0" has style "font-style" with value "normal"
        await since(
            'Grid cell at row 4, col 0 in Visualization 1 should have style "font-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 0, 'font-style'))
            .toEqual('normal');
        // And the grid cell in ag-grid "Visualization 1" at "4", "0" has text "2011"
        await since('Grid cell at row 4, col 0 in Visualization 1 should have text "#{expected}", but got "#{actual}"')
            .expect(await reportGridView.getGridCellTextByPos(4, 0))
            .toEqual('2011');
        // And the grid cell in ag-grid "Visualization 1" at "3", "0" has style "background-color" with value "rgba(255, 255, 255, 1)"
        await since(
            'Grid cell at row 3, col 0 in Visualization 1 should have style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 0, 'background-color'))
            .toEqual('rgba(255,255,255,1)');
        // And the grid cell in ag-grid "Visualization 1" at "3", "0" has style "color" with value "rgba(153, 204, 255, 1)"
        await since(
            'Grid cell at row 3, col 0 in Visualization 1 should have style "color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 0, 'color'))
            .toEqual('rgba(153,204,255,1)');
        // And the grid cell in ag-grid "Visualization 1" at "3", "0" has style "font-family" with value "Noto Sans"
        await since(
            'Grid cell at row 3, col 0 in Visualization 1 should have style "font-family" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 0, 'font-family'))
            .toEqual('noto sans');
        // And the grid cell in ag-grid "Visualization 1" at "3", "0" has style "font-size" with value "26.6667px"
        await since(
            'Grid cell at row 3, col 0 in Visualization 1 should have style "font-size" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 0, 'font-size'))
            .toEqual('26.67px');
        // And the grid cell in ag-grid "Visualization 1" at "3", "0" has style "font-weight" with value "700"
        await since(
            'Grid cell at row 3, col 0 in Visualization 1 should have style "font-weight" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 0, 'font-weight'))
            .toEqual('700');
        // And the grid cell in ag-grid "Visualization 1" at "3", "0" has text "2010 Replace"
        await since('Grid cell at row 3, col 0 in Visualization 1 should have text "#{expected}", but got "#{actual}"')
            .expect(await reportGridView.getGridCellTextByPos(3, 0))
            .toEqual('2010 Replace');
        // And the grid cell in ag-grid "Visualization 1" at "0", "3" has style "background-color" with value "rgba(255, 255, 255, 1)"
        await since(
            'Grid cell at row 0, col 3 in Visualization 1 should have style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 3, 'background-color'))
            .toEqual('rgba(255,255,255,1)');
        // And the grid cell in ag-grid "Visualization 1" at "0", "3" has style "color" with value "rgba(128, 0, 128, 1)"
        await since(
            'Grid cell at row 0, col 3 in Visualization 1 should have style "color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 3, 'color'))
            .toEqual('rgba(128,0,128,1)');
        // And the grid cell in ag-grid "Visualization 1" at "0", "3" has style "font-size" with value "16px"
        await since(
            'Grid cell at row 0, col 3 in Visualization 1 should have style "font-size" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 3, 'font-size'))
            .toEqual('16px');
        // And the grid cell in ag-grid "Visualization 1" at "0", "3" has style "text-decoration" with value "underline"
        await since(
            'Grid cell at row 0, col 3 in Visualization 1 should have style "text-decoration" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 3, 'text-decoration'))
            .toContain('underline');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC80795_02',
            'Threshold apply on Origin Airport'
        );

        // Create threshold on attribute in MicroChart
        // When I open the Thresholds editor for microchart "Avg Delay (min) Trend by Month" from the Editor Panel
        await thresholdEditor.openThresholdEditorFromMicroChart('Avg Delay (min) Trend by Month');
        // And I open the color band drop down menu
        await thresholdEditor.openSimpleThresholdColorBandDropDownMenu();
        // And I select the color band "Tropical Jungle" in simple threshold editor
        await thresholdEditor.selectSimpleThresholdColorBand('Tropical Jungle');
        // And I save and close Simple Thresholds Editor
        await thresholdEditor.saveAndCloseSimThresholdEditor();

        // When I open the Thresholds editor for microchart "Number of Flights Comparison by Airline Name" from the Editor Panel
        await thresholdEditor.openThresholdEditorFromMicroChart('Number of Flights Comparison by Airline Name');
        // And I switch from simple threshold editor to advanced threshold editor and clear the thresholds in threshold editor
        await thresholdEditor.switchSimToAdvThresholdWithClear();
        // And I click New Threshold button to open the new threshold condition editor in advanced threshold editor
        await thresholdEditor.openNewThresholdCondition();
        // And I choose metric "Number of Flights" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Number of Flights');
        // And I open Operator dropdown
        await advancedFilter.openOperatorDropDown();
        // And I select "By Rank" from Operator dropdown
        await advancedFilter.doSelectionOnOperatorDropdown('By Rank');
        // And I type "3" for Value input
        await advancedFilter.typeValueInput('3');
        // Then I click OK Button on New Qualification
        await advancedFilter.clickOnNewQualificationEditorOkButton();
        // When I select secondary option "Formatting" for threshold condition with index number "1"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Formatting', '1');
        // And I set microchart fill color to "Blue" in the format preview panel
        await thresholdEditor.setMicrochartFillColor('Blue');
        // And I save and close Advanced Thresholds Editor
        await thresholdEditor.saveAndCloseAdvancedThresholdEditor();

        // Then the grid cell in ag-grid "Visualization 1" at "2", "0" has style "background-color" with value "rgba(0, 255, 0, 1)"
        await since(
            'Grid cell at row 2, col 0 in Visualization 1 should have style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 0, 'background-color'))
            .toEqual('rgba(0,255,0,1)');
        // And the grid cell in ag-grid "Visualization 1" at "2", "0" has style "color" with value "rgba(255, 102, 0, 1)"
        await since(
            'Grid cell at row 2, col 0 in Visualization 1 should have style "color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 0, 'color'))
            .toEqual('rgba(255,102,0,1)');
        // And the grid cell in ag-grid "Visualization 1" at "2", "0" has style "font-style" with value "italic"
        await since(
            'Grid cell at row 2, col 0 in Visualization 1 should have style "font-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 0, 'font-style'))
            .toEqual('italic');
        // And the grid cell in ag-grid "Visualization 1" at "2", "0" has text "✿"
        await since('Grid cell at row 2, col 0 in Visualization 1 should have text "#{expected}", but got "#{actual}"')
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toEqual('✿');
        // And the grid cell in ag-grid "Visualization 1" at "4", "0" has style "background-color" with value "rgba(153, 204, 0, 1)"
        await since(
            'Grid cell at row 4, col 0 in Visualization 1 should have style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 0, 'background-color'))
            .toEqual('rgba(153,204,0,1)');
        // And the grid cell in ag-grid "Visualization 1" at "4", "0" has style "color" with value "rgba(53, 56, 58, 1)"
        await since(
            'Grid cell at row 4, col 0 in Visualization 1 should have style "color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 0, 'color'))
            .toEqual('rgba(53,56,58,1)');
        // And the grid cell in ag-grid "Visualization 1" at "4", "0" has style "font-style" with value "normal"
        await since(
            'Grid cell at row 4, col 0 in Visualization 1 should have style "font-style" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 0, 'font-style'))
            .toEqual('normal');
        // And the grid cell in ag-grid "Visualization 1" at "4", "0" has text "2011"
        await since('Grid cell at row 4, col 0 in Visualization 1 should have text "#{expected}", but got "#{actual}"')
            .expect(await reportGridView.getGridCellTextByPos(4, 0))
            .toEqual('2011');
        // And the grid cell in ag-grid "Visualization 1" at "3", "0" has style "background-color" with value "rgba(255, 255, 255, 1)"
        await since(
            'Grid cell at row 3, col 0 in Visualization 1 should have style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 0, 'background-color'))
            .toEqual('rgba(255,255,255,1)');
        // And the grid cell in ag-grid "Visualization 1" at "3", "0" has style "color" with value "rgba(153, 204, 255, 1)"
        await since(
            'Grid cell at row 3, col 0 in Visualization 1 should have style "color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 0, 'color'))
            .toEqual('rgba(153,204,255,1)');
        // And the grid cell in ag-grid "Visualization 1" at "3", "0" has style "font-family" with value "Noto Sans"
        await since(
            'Grid cell at row 3, col 0 in Visualization 1 should have style "font-family" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 0, 'font-family'))
            .toEqual('noto sans');
        // And the grid cell in ag-grid "Visualization 1" at "3", "0" has style "font-size" with value "26.6667px"
        await since(
            'Grid cell at row 3, col 0 in Visualization 1 should have style "font-size" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 0, 'font-size'))
            .toEqual('26.67px');
        // And the grid cell in ag-grid "Visualization 1" at "3", "0" has style "font-weight" with value "700"
        await since(
            'Grid cell at row 3, col 0 in Visualization 1 should have style "font-weight" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 0, 'font-weight'))
            .toEqual('700');
        // And the grid cell in ag-grid "Visualization 1" at "3", "0" has text "2010 Replace"
        await since('Grid cell at row 3, col 0 in Visualization 1 should have text "#{expected}", but got "#{actual}"')
            .expect(await reportGridView.getGridCellTextByPos(3, 0))
            .toEqual('2010 Replace');
        // And the grid cell in ag-grid "Visualization 1" at "0", "3" has style "background-color" with value "rgba(255, 255, 255, 1)"
        await since(
            'Grid cell at row 0, col 3 in Visualization 1 should have style "background-color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 3, 'background-color'))
            .toEqual('rgba(255,255,255,1)');
        // And the grid cell in ag-grid "Visualization 1" at "0", "3" has style "color" with value "rgba(128, 0, 128, 1)"
        await since(
            'Grid cell at row 0, col 3 in Visualization 1 should have style "color" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 3, 'color'))
            .toEqual('rgba(128,0,128,1)');
        // And the grid cell in ag-grid "Visualization 1" at "0", "3" has style "font-size" with value "16px"
        await since(
            'Grid cell at row 0, col 3 in Visualization 1 should have style "font-size" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 3, 'font-size'))
            .toEqual('16px');
        // And the grid cell in ag-grid "Visualization 1" at "0", "3" has style "text-decoration" with value "underline"
        await since(
            'Grid cell at row 0, col 3 in Visualization 1 should have style "text-decoration" with value "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellStyleByPos(0, 3, 'text-decoration'))
            .toContain('underline');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC80795_03',
            'Threshold apply on MicroChart'
        );

        // Clear thresholds from attribute in Rows
        // When I clear Thresholds from object "Year" in the Grid Editor Panel
        await editorPanelForGrid.clearThreshold('Year');
        // take screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC80795_04',
            'Threshold on Year cleared'
        );

        // remove objects from template and re-add to template, threshold should be kept
        // When I remove "attribute" named "Origin Airport" from the Grid Editor Panel
        await editorPanelForGrid.removeFromDropZone('Origin Airport', 'attribute');
        // And I drag "attribute" named "Origin Airport" from dataset "Airline sample dataset" to Column Set "Column Set 2" and drop it above "On-Time" in ag-grid
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Origin Airport',
            'attribute',
            'Airline sample dataset',
            'Column Set 2',
            'above',
            'On-Time'
        );
        // take screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC80795_05',
            'Threshold should be kept after remove and re-add'
        );
    });

    it('[TC80795_02] Validate relative path image in Thresholds BCEM-3214 | Acceptance', async () => {
        // Edit dossier by its ID "8C49A443F64EE5936B0D21BB87E4D7AB"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Threshold > AGGrid_Threshold_TC80795_02
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridThreshold2.project.id,
            dossierId: gridConstants.AGGridThreshold2.id,
        });
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC80795_02_01',
            'Threshold apply year'
        );
        await editorPanelForGrid.openAttributeThresholdsEditor('Year');
        await takeScreenshotByElement(
            thresholdEditor.advancedThresholdEditor,
            'TC80795_02_02',
            'Thresholds editor opened for Year attribute'
        );
    });
});
