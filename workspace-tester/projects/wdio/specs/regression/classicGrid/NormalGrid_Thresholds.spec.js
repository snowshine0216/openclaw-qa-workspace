import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import * as gridConstants from '../../../constants/grid.js';
import Common from '../../../pageObjects/authoring/Common.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';

const specConfiguration = { ...customCredentials('_sort') };
const { credentials } = specConfiguration;

//npm run regression -- --baseUrl=https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --spec 'specs/regression/classicGrid/NormalGrid_Thresholds.spec.js'
describe('Normal Grid Advanced Thresholds Editor', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {});

    let {
        libraryPage,
        vizPanelForGrid,
        datasetPanel,
        dossierAuthoringPage,
        libraryAuthoringPage,
        editorPanel,
        toolbar,
        editorPanelForGrid,
        agGridVisualization,
        loginPage,
        thresholdEditor,
        advancedFilter,
    } = browsers.pageObj1;

    it('[TC385] Manipulation on metric thresholds editor', async () => {
         // Edit dossier by its ID "B9F6A25111EB238D4B550080EF95F2EA"
         // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > AGGrid_IncrementalFetch
         await libraryPage.editDossierByUrl({
             projectId: gridConstants.AGGridIncrementalFetch.project.id,
             dossierId: gridConstants.AGGridIncrementalFetch.id,
         });

         await datasetPanel.addObjectToVizByDoubleClick('City', 'attribute', 'retail-sample-data.xls');
         await datasetPanel.addObjectToVizByDoubleClick('Item Category', 'attribute', 'retail-sample-data.xls');
         await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');
         await datasetPanel.addObjectToVizByDoubleClick('Revenue', 'metric', 'retail-sample-data.xls');
         await thresholdEditor.openThresholdEditorFromViz('Cost', 'Visualization 1');
         // take screenshot of Simple Threshold Editor
         await takeScreenshotByElement(
            thresholdEditor.getSimpleThresholdEditor(),
            'TC385_01',
            'Simple Threshold Editor for normal grid'
         );
         // And I open the color band drop down menu
         await thresholdEditor.openSimpleThresholdColorBandDropDownMenu();
         await takeScreenshotByElement(
            thresholdEditor.getSimpleThresholdEditor(),
            'TC385_02',
            'Simple Threshold Editor with Color Band drop down opened'
         );
         // And I select the color band "Business Blue" in simple threshold editor
         await thresholdEditor.selectSimpleThresholdColorBand('Business Blue');
        //  When I select the Based on metric "Cost" in simple threshold editor
        await thresholdEditor.selectSimpleThresholdBasedOnObject('Cost');
        //  When I add a handler in the middle area
        await thresholdEditor.addHandlerInTheMiddleArea();
         // And I save and close Simple Thresholds Editor
         await thresholdEditor.saveAndCloseSimThresholdEditor();

        //  When I open the Thresholds editor for object "Cost" from the grid visualization "Visualization 1"
        await thresholdEditor.openThresholdEditorFromViz('Cost', 'Visualization 1');
        //  When I switch the simple threshold type from "Color-based" to "Image-based" in simple threshold editor
        await thresholdEditor.switchSimpleThresholdsTypeI18N('Image-based');
        //  Then The dossier's screenshot "Thresholds_TC385_Alignments1" should match the baselines
        await takeScreenshotByElement(
            thresholdEditor.getSimpleThresholdEditor(),
            'TC385_03',
            'Simple Threshold Editor after switching to Image-based'
        );
        //  When I open the image band drop down menu
        await thresholdEditor.openSimpleThresholdImageBandDropDownMenu();
        //  Then The dossier's screenshot "Thresholds_TC385_Alignments2" should match the baselines
        await takeScreenshotByElement(
            thresholdEditor.getSimpleThresholdEditor(),
            'TC385_04',
            'Simple Threshold Editor with Image Band drop down opened'
        );
        //  And I select the image band "Truck" in simple threshold editor
        await thresholdEditor.selectSimpleThresholdImageBand('Truck');
        //  When I save and close Simple Thresholds Editor
        await thresholdEditor.saveAndCloseSimThresholdEditor();
        // take screenshot of grid with applied image-based thresholds
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC385_05',
            'Grid with Image-based thresholds applied'
        );
        //  When I clear the thresholds for object "Cost" from the grid visualization "Visualization 1"
        await thresholdEditor.clearThresholdFromViz('Cost', 'Visualization 1');
        // take screenshot of grid after clearing thresholds
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC385_06',
            'Grid after clearing thresholds for Cost'
        );

        // When I open the Thresholds editor for object "Cost" from the grid visualization "Visualization 1"
        await thresholdEditor.openThresholdEditorFromViz('Cost', 'Visualization 1');
        // When I switch from simple threshold editor to advanced threshold editor and clear the thresholds in threshold editor
        await thresholdEditor.switchSimToAdvThresholdWithClear('Cost', 'Visualization 1');
    
        // When I click New Threshold button to open the new threshold condition editor in advanced threshold editor
        await thresholdEditor.openNewThresholdCondition();
        // And I choose attribute "Item Category" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Item Category');
        // Then Choose Elements By dropdown should exist
        await advancedFilter.checkChooseElementsByDropdown();
    
        // When I select elements "Action Movies,Alternative Movies" from the element list in the Advanced Threshold Editor
        await advancedFilter.doElementSelectionForAttributeFilter(['Action Movies', 'Alternative Movies']);
        // And I click OK Button on New Condition editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
        // Then A new threshold condition by index "1" should be created
        await takeScreenshotByElement(
            thresholdEditor.advancedThresholdEditor,
            'TC385_07',
            'New threshold condition created in Advanced Threshold Editor'
        );
    
        // When I open Format Preview panel with order number "1"
        await thresholdEditor.openFormatPreviewPanelByOrderNumber(1);
        // When I set fill color to "Lime" in the format preview panel
    
        await thresholdEditor.setFillColor('Lime');

        // When I click check mark on Format Preview panel
        await thresholdEditor.clickOnCheckMarkOnFormatPreviewPanel();
        // When I save and close Advanced Thresholds Editor
    
        await thresholdEditor.saveAndCloseAdvancedThresholdEditor();

        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC385_08',
            'Grid with Advanced Threshold applied'
        );
    });

    it('[TC10657] Manipulation on attribute thresholds editor', async () => {
        // Edit dossier by its ID "B9F6A25111EB238D4B550080EF95F2EA"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > AGGrid_IncrementalFetch
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridIncrementalFetch.project.id,
            dossierId: gridConstants.AGGridIncrementalFetch.id,
        });

        await datasetPanel.addObjectToVizByDoubleClick('City', 'attribute', 'retail-sample-data.xls');
        await datasetPanel.addObjectToVizByDoubleClick('Item Category', 'attribute', 'retail-sample-data.xls');
        await datasetPanel.addObjectToVizByDoubleClick('Month', 'attribute', 'retail-sample-data.xls');
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');
        await datasetPanel.addObjectToVizByDoubleClick('Revenue', 'metric', 'retail-sample-data.xls');
        await datasetPanel.addObjectToVizByDoubleClick('Unit Price', 'metric', 'retail-sample-data.xls');
        await thresholdEditor.openThresholdEditorFromViz('Item Category', 'Visualization 1');
        // When I click New Threshold button to open the new threshold condition editor in advanced threshold editor
        await thresholdEditor.openNewThresholdCondition();
        // And I choose attribute "Item Category" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Item Category');
        // Then Choose Elements By dropdown should exist
        await advancedFilter.checkChooseElementsByDropdown();
        // When I select elements "Action Movies" from the element list in the Advanced Threshold Editor
        await advancedFilter.doElementSelectionForAttributeFilter(['Action Movies']);
        // Then I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();

        // When I click New Threshold button to open the new threshold condition editor in advanced threshold editor
        await thresholdEditor.openNewThresholdCondition();
        // And I choose attribute "Item Category" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Item Category');
        // Then Choose Elements By dropdown should exist
        await advancedFilter.checkChooseElementsByDropdown();
        // When I select elements "Alternative Movies" from the element list in the Advanced Threshold Editor
        await advancedFilter.doElementSelectionForAttributeFilter(['Alternative Movies']);
        // Then I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();

        // When I click New Threshold button to open the new threshold condition editor in advanced threshold editor
        await thresholdEditor.openNewThresholdCondition();
        // And I choose attribute "Item Category" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Item Category');
        // Then Choose Elements By dropdown should exist
        await advancedFilter.checkChooseElementsByDropdown();
        // When I open Choose Elements By dropdown
        await advancedFilter.openChooseElementsByDropDown();
        // When I select "Qualification on" from Choose Elements By dropdown
        await advancedFilter.doSelectionOnChooseElementsByDropdown('Qualification on');
        // When I select "Equals" as the attribute filter operator
        await advancedFilter.selectAttributeFilterOperator('Equals');
        // When I open Attribute dropdown
        await advancedFilter.openAttributeDropdown();
        // When I select "Item Category" for Attribute dropdown
        await advancedFilter.doSelectionOnAttributeDropdown('Item Category');
        // When I select attribute form radio button "ID" in the right column
        await thresholdEditor.selectAttributeElementFromColumnContainer('ID');
        // Then I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();

        // When I select secondary option "Formatting" for threshold condition with index number "1"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Formatting', 1);
        // When I set fill color to "Violet" in the format preview panel
        await thresholdEditor.setFillColor('Violet');
        // When I open outer border line style dropdown menu
        await thresholdEditor.openOuterBorderDropdownMenu();
        // When I select outer border line style option by index number "1"
        await thresholdEditor.selectOuterBorderOptionByIndexNumber('1');
        // When I open outer border line color dropdown menu
        await thresholdEditor.openOuterBorderColorPickerDropdownMenu();
        // When I select outer border line color by color name "Yellow"
        await thresholdEditor.selectOuterBorderColorByColorName('Yellow');
        // When I click check mark on Format Preview panel
        await thresholdEditor.clickOnCheckMarkOnFormatPreviewPanel();

        // When I select secondary option "Formatting" for threshold condition with index number "2"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Formatting', 2);
        // When I click Enable Data Replace option check box
        await thresholdEditor.clickOnEnableDataReplaceCheckBox();
        // When I select option "Replace With Image" for Data Replace
        await thresholdEditor.selectOptionFromDataReplaceDropdownMenu('Replace With Image');
        // When I input "https://5b0988e595225.cdn.sohucs.com/images/20190822/71d96edfbd934e718b817d141bf4b144.jpeg" in the text box for replace text or image
        await thresholdEditor.inputInTextBox(
            'https://5b0988e595225.cdn.sohucs.com/images/20190822/71d96edfbd934e718b817d141bf4b144.jpeg'
        );
        // When I click check mark on Format Preview panel
        await thresholdEditor.clickOnCheckMarkOnFormatPreviewPanel();

        // When I select secondary option "Formatting" for threshold condition with index number "3"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Formatting', 3);
        // When I open font family dropdown menu
        await thresholdEditor.openFontFamilyDropdownMenu();
        // When I select font by font name "Oleo Script"
        await thresholdEditor.selectFontByFontName('Oleo Script');
        // When I open font size dropdown menu
        await thresholdEditor.openFontSizeDropdownMenu();
        // When I select font size by size number "12"
        await thresholdEditor.selectFontSizeBySizeNumber('12');
        // When I open font color dropdown menu
        await thresholdEditor.openFontColorDropdownMenu();
        // When I select font color by color name "Light Blue"
        await thresholdEditor.selectFontColorByColorName('Light Blue');
        // When I click "underline" button in the format editor
        await thresholdEditor.clickOnOptionOnTheFontButtonBar('underline');
        // When I click "bold" button in the format editor
        await thresholdEditor.clickOnOptionOnTheFontButtonBar('bold');
        // When I click "italic" button in the format editor
        await thresholdEditor.clickOnOptionOnTheFontButtonBar('italic');
        // When I click "strikeout" button in the format editor
        await thresholdEditor.clickOnOptionOnTheFontButtonBar('strikeout');
        // When I click check mark on Format Preview panel
        await thresholdEditor.clickOnCheckMarkOnFormatPreviewPanel();
        // When I save and close Advanced Thresholds Editor
        await thresholdEditor.saveAndCloseAdvancedThresholdEditor();
        
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC10657_01',
            'Grid with Advanced Thresholds applied'
        );
    });

    it('[TC2306] Edit, Clear and Undo/Redo Thresholds', async () => {
        // Edit dossier by its ID "755A8D3B614D64690297FB8DA4EAB5B9"
         // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > AGGrid_CreateGrid_TC71081
         await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridCreate.project.id,
            dossierId: gridConstants.AGGridCreate.id,
        });
        // When I add "attribute" named "Airline Name" from dataset "Airline Data" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Airline Name', 'attribute', 'Airline Data');
        // When I add "attribute" named "Day of Week" from dataset "Airline Data" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Day of Week', 'attribute', 'Airline Data');
        // When I add "metric" named "Flights Cancelled" from dataset "Airline Data" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Flights Cancelled', 'metric', 'Airline Data');
        // When I add "metric" named "Flights Delayed" from dataset "Airline Data" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Flights Delayed', 'metric', 'Airline Data');
        // When I add "metric" named "On-Time" from dataset "Airline Data" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('On-Time', 'metric', 'Airline Data');

        // When I toggle the Show Totals for the visualization "Visualization 1" through the visualization context menu
        await agGridVisualization.toggleShowTotalsByContextMenu('Visualization 1');
        // When I open the Thresholds editor for object "Flights Cancelled" from the grid visualization "Visualization 1"
        await thresholdEditor.openThresholdEditorFromViz('Flights Cancelled', 'Visualization 1');
        // When I open the color band drop down menu
        await thresholdEditor.openSimpleThresholdColorBandDropDownMenu();
        // And I select the color band "Honey" in simple threshold editor
        await thresholdEditor.selectSimpleThresholdImageBand('Honey');
        // And I revert the color band for the simple threshold
        await thresholdEditor.revertThresholdColorBand();
        // And I select the Based on metric "Flights Cancelled" in simple threshold editor
        await thresholdEditor.selectSimpleThresholdBasedOnObject('Flights Cancelled');
        // And I change the Based on option to "Lowest %" in simple threshold editor
        await thresholdEditor.selectSimpleThresholdBasedOnOption('Lowest %');
        // And I change the Break By object to "Airline Name" in simple threshold editor
        await thresholdEditor.selectSimpleThresholdBreakByObject('Airline Name');
        // When I select a marker by index number "2" and change value to "30"
        await thresholdEditor.getMarkerAndChangeValue('2', '30');
        // When I add a handler in the middle area
        await thresholdEditor.addHandlerInTheMiddleArea();
        // When I add color band by RMC color band by index number "1"
        await thresholdEditor.addColorBandByRMCColorBand(1);
        // When I change color to "Blue" for color band with index number "1"
        await thresholdEditor.changeColorForColorBand('Blue', 1);
        // When I delete color band by index number "2"
        await thresholdEditor.deletColorBandByIndexNumber(2);
        // Then I save and close Simple Thresholds Editor
        await thresholdEditor.saveAndCloseSimThresholdEditor();

        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC2306_01',
            'Grid with "Flights Cancelled" Threshold applied'
        );

        // When I open the Thresholds editor for object "Flights Delayed" from the grid visualization "Visualization 1"
        await thresholdEditor.openThresholdEditorFromViz('Flights Delayed', 'Visualization 1');
        // Then I switch from simple threshold editor to advanced threshold editor and clear the thresholds in threshold editor
        await thresholdEditor.switchSimToAdvThresholdWithClear();
        // When I click New Threshold button to open the new threshold condition editor in advanced threshold editor
        await thresholdEditor.openNewThresholdCondition();
        // And I choose attribute "Airline Name" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Airline Name');
        // Then Choose Elements By dropdown should exist
        await advancedFilter.checkChooseElementsByDropdown();
        // When I select elements "American Airlines Inc." from the element list in the Advanced Threshold Editor
        await advancedFilter.doElementSelectionForAttributeFilter(['American Airlines Inc.']);
        // Then I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
        // Then A new threshold condition by index "1" should be created
        await thresholdEditor.checkThresholdConditionByIndex(1);
        // When I open Format Preview panel with order number "1"
        await thresholdEditor.openFormatPreviewPanelByOrderNumber(1);
        // When I click "bold" button in the format editor
        await thresholdEditor.clickOnOptionOnTheFontButtonBar('bold');
        // When I click "underline" button in the format editor
        await thresholdEditor.clickOnOptionOnTheFontButtonBar('underline');
        await thresholdEditor.setFillColor('Lime');
        
        // When I click check mark on Format Preview panel
        await thresholdEditor.clickOnCheckMarkOnFormatPreviewPanel();
        // When I save and close Advanced Thresholds Editor
        await thresholdEditor.saveAndCloseAdvancedThresholdEditor();
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC2306_02',
            'Grid with "Flights Delayed" Threshold applied'
        );

        // When I open Threshold Editor for the metric named "On-Time" in the Grid Editor Panel
        await editorPanelForGrid.openMetricThresholdsEditor('On-Time');
        // When I open the color band drop down menu
        await thresholdEditor.openSimpleThresholdColorBandDropDownMenu();
        // And I select the color band "Sunflower" in simple threshold editor
        await thresholdEditor.selectSimpleThresholdImageBand('Sunflower');
        // And I revert the color band for the simple threshold
        await thresholdEditor.revertThresholdColorBand();
        // And I select the Based on metric "On-Time" in simple threshold editor
        await thresholdEditor.selectSimpleThresholdBasedOnObject('On-Time');
        // And I change the Based on option to "Highest %" in simple threshold editor
        await thresholdEditor.selectSimpleThresholdBasedOnOption('Highest %');
        // And I change the Break By object to "Day of Week" in simple threshold editor
        await thresholdEditor.selectSimpleThresholdBreakByObject('Day of Week');
        // Then I switch from simple threshold editor to advanced threshold editor and apply the thresholds in threshold editor
        await thresholdEditor.switchSimToAdvThresholdWithApply();
        // Then I save and close Advanced Thresholds Editor
        await thresholdEditor.saveAndCloseAdvancedThresholdEditor();
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC2306_03',
            'Grid with "On-Time" Threshold applied'
        );

        // When I open the Thresholds editor for object "On-Time" from the grid visualization "Visualization 1"
        await thresholdEditor.openThresholdEditorFromViz('On-Time', 'Visualization 1');
        // When I select option "Metric and Subtotals" for "Apply to" for threshold with order number "5"
        await thresholdEditor.selectApplyToOptionFromThreeDotsMenu('Metric and Subtotals', 5);
        // Then I save and close Advanced Thresholds Editor
        await thresholdEditor.saveAndCloseAdvancedThresholdEditor();
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC2306_04',
            'Grid after modifying "On-Time" Threshold'
        );


        // When I clear the thresholds for object "On-Time" from the grid visualization "Visualization 1"
        await thresholdEditor.clearThresholdFromViz('On-Time', 'Visualization 1');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC2306_05',
            'Grid after clearing "On-Time" Threshold'
        );

        // When I select "Undo" from toolbar 6 times
        await toolbar.actionOnToolbarLoop('Undo', 6);
        // When I select "Redo" from toolbar 5 times
        await toolbar.actionOnToolbarLoop('Redo', 5);

        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC2306_06',
            'Grid after Undo/Redo actions'
        );

    });

    it('[TC2223] Threshold Context Menu/Order', async () => {
        // Edit dossier by its ID "755A8D3B614D64690297FB8DA4EAB5B9"
         // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > AGGrid_CreateGrid_TC71081
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridCreate.project.id,
            dossierId: gridConstants.AGGridCreate.id,
        });
        // When I add "attribute" named "Airline Name" from dataset "Airline Data" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Airline Name', 'attribute', 'Airline Data');
        // When I add "attribute" named "Day of Week" from dataset "Airline Data" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Day of Week', 'attribute', 'Airline Data');
        // When I add "metric" named "Flights Cancelled" from dataset "Airline Data" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Flights Cancelled', 'metric', 'Airline Data');
        // When I add "metric" named "Flights Delayed" from dataset "Airline Data" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Flights Delayed', 'metric', 'Airline Data');

        // When I toggle the Show Totals for the visualization "Visualization 1" through the visualization context menu
        await agGridVisualization.toggleShowTotalsByContextMenu('Visualization 1');
        // When I open the Thresholds editor for object "Flights Cancelled" from the grid visualization "Visualization 1"
        await thresholdEditor.openThresholdEditorFromViz('Flights Cancelled', 'Visualization 1');
        // And I open the color band drop down menu
        await thresholdEditor.openSimpleThresholdColorBandDropDownMenu();
        // And I select the color band "Traffic Lights" in simple threshold editor
        await thresholdEditor.selectSimpleThresholdImageBand('Traffic Lights');
        // When I switch from simple threshold editor to advanced threshold editor and apply the thresholds in threshold editor
        await thresholdEditor.switchSimToAdvThresholdWithApply();

        // When I select option "Subtotals Only" for "Apply to" for threshold with order number "2"
        await thresholdEditor.selectApplyToOptionFromThreeDotsMenu('Subtotals Only', 2);
        // When I select option "Metric and Subtotals" for "Apply to" for threshold with order number "3"
        await thresholdEditor.selectApplyToOptionFromThreeDotsMenu('Metric and Subtotals', 3);
        // When I select secondary option "Formatting" for threshold condition with index number "1"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Formatting', 1);
        // When I click Enable Data Replace option check box
        await thresholdEditor.clickOnEnableDataReplaceCheckBox();
        // When I select option "Replace Text" for Data Replace
        await thresholdEditor.selectOptionFromDataReplaceDropdownMenu('Replace Text');
        // When I input "HAHAHA" in the text box for replace text or image
        await thresholdEditor.inputInTextBox('HAHAHA');
        // When I click check mark on Format Preview panel
        await thresholdEditor.clickOnCheckMarkOnFormatPreviewPanel();

        // When I select secondary option "Formatting" for threshold condition with index number "2"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Formatting', 2);
        // When I open font family dropdown menu
        await thresholdEditor.openFontFamilyDropdownMenu();
        // When I select font by font name "Oleo Script"
        await thresholdEditor.selectFontByFontName('Oleo Script');
        // When I open font size dropdown menu
        await thresholdEditor.openFontSizeDropdownMenu();
        // When I select font size by size number "20"
        await thresholdEditor.selectFontSizeBySizeNumber('20');
        // When I open font color dropdown menu
        await thresholdEditor.openFontColorDropdownMenu();
        // When I select font color by color name "Bright Green"
        await thresholdEditor.selectFontColorByColorName('Bright Green');
        // When I click check mark on Format Preview panel
        await thresholdEditor.clickOnCheckMarkOnFormatPreviewPanel();

        // When I select secondary option "Formatting" for threshold condition with index number "3"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Formatting', 3);
        // When I set fill color to "Sea Green" in the format preview panel
        await thresholdEditor.setFillColor('Sea Green');
        // When I open outer border line style dropdown menu
        await thresholdEditor.openOuterBorderDropdownMenu();
        // When I select outer border line style option by index number "4"
        await thresholdEditor.selectOuterBorderOptionByIndexNumber(4);
        // When I open outer border line color dropdown menu
        await thresholdEditor.openOuterBorderColorPickerDropdownMenu();
        // When I select outer border line color by color name "Yellow"
        await thresholdEditor.selectOuterBorderColorByColorName('Yellow');
        // When I click check mark on Format Preview panel
        await thresholdEditor.clickOnCheckMarkOnFormatPreviewPanel();

        // When I select secondary option "Duplicate" for threshold condition with index number "3"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Duplicate', 3);
        // When I select secondary option "Move Down" for threshold condition with index number "2"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Move Down', 2);
        // When I select secondary option "Move Up" for threshold condition with index number "2"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Move Up', 2);
        // When I delete one threshold condition by order number "1"
        await thresholdEditor.deleteThresholdConditionByOrderNumber(1);

        // When I save and close Advanced Thresholds Editor
        await thresholdEditor.saveAndCloseAdvancedThresholdEditor();

        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC2223_01',
            'Grid with Advanced Thresholds applied'
        );
    });

    it('[TC2163] Multi-Conditions in a Threshold', async () => {
        // Edit dossier by its ID "689641C411EAFEA695390080EFD5ACCD"
         // New MicroStrategy Tutorials > Shared Reports > Automation Objects > Normal Grid > Grid and Compound Grid_Thresholds
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.Grid_Numberformat_Threshold.project.id,
            dossierId: gridConstants.Grid_Numberformat_Threshold.id,
        });
        // When I click on container "Grid" from canvas
        await agGridVisualization.clickContainer('Grid');
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I clear Thresholds from object "Month" in the Grid Editor Panel
        await editorPanelForGrid.clearThreshold('Month');

        // When I click on container "Compound Grid" from canvas
        // And I switch to Editor Panel tab    
        // And I clear Thresholds from object "Month" in the Grid Editor Panel
        await agGridVisualization.clickContainer('Compound Grid');
        await editorPanel.switchToEditorPanel();
        await editorPanelForGrid.clearThreshold('Month');
        await editorPanelForGrid.clearThreshold('Cost');

        // When I click on container "Grid" from canvas
        await agGridVisualization.clickContainer('Grid');
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I open Threshold Editor for the attribute named "Month" in the Grid Editor Panel
        await editorPanelForGrid.openAttributeThresholdsEditor('Month');
    
        // When I click New Threshold button to open the new threshold condition editor in advanced threshold editor
        await thresholdEditor.openNewThresholdCondition();
        // And I choose attribute "Month" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Month');
        // Then Choose Elements By dropdown should exist
        await advancedFilter.checkChooseElementsByDropdown();
        // When I select elements "Jan,Feb,Mar" from the element list in the Advanced Threshold Editor
        await advancedFilter.doElementSelectionForAttributeFilter(['Jan', 'Feb', 'Mar']);
        // And I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();

        // When I select secondary option "New Condition" for threshold condition with index number "1"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('New Condition', 1);
        // And I choose metric "Cost" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Cost');
        // And I open Operator dropdown
        await advancedFilter.openOperatorDropDown();
        // And I select "By Value" from Operator dropdown
        await advancedFilter.doSelectionOnOperatorDropdown('By Value');
        // And I select "Less than or equal to" as the attribute filter operator
        await advancedFilter.selectAttributeFilterOperator('Less than or equal to');
        // When I type "880000" for Value input
        await advancedFilter.typeValueInput('880000');
        // Then I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();

        // When I select secondary option "Formatting" for threshold condition with index number "1"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Formatting', 1);
        // And I click Enable Data Replace option check box
        await thresholdEditor.clickOnEnableDataReplaceCheckBox();
        // And I select option "Replace Text" for Data Replace
        await thresholdEditor.selectOptionFromDataReplaceDropdownMenu('Replace Text');
        // And I input "Good Job!" in the text box for replace text or image
        await thresholdEditor.inputInTextBox('Good Job!');

        // When I open font color dropdown menu
        await thresholdEditor.openFontColorDropdownMenu();
        // And I select font color by color name "Red"
        await thresholdEditor.selectFontColorByColorName('Red');
        // And I click "bold" button in the format editor
    
        await thresholdEditor.clickOnOptionOnTheFontButtonBar('bold');

        // And I set fill color to "Yellow" in the format preview panel
        await thresholdEditor.setFillColor('Yellow');
        // And I set fill color opacity to "50" in the format preview panel
        await thresholdEditor.setFillColorOpacity(50);
        // And I open outer border line style dropdown menu
        await thresholdEditor.openOuterBorderDropdownMenu();
        // And I select outer border line style option by index number "2"
        await thresholdEditor.selectOuterBorderOptionByIndexNumber(2);
        // And I open outer border line color dropdown menu
        await thresholdEditor.openOuterBorderColorPickerDropdownMenu();
        // And I select outer border line color by color name "Green"
        await thresholdEditor.selectOuterBorderColorByColorName('Green');
    
        // When I click check mark on Format Preview panel
        await thresholdEditor.clickOnCheckMarkOnFormatPreviewPanel();
        // And I save and close Advanced Thresholds Editor
        await thresholdEditor.saveAndCloseAdvancedThresholdEditor();
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Grid'),
            'TC2163_01',
            '2 Conditions Threshold applied on Month in Grid'
        );

        // When I click on container "Compound Grid" from canvas
        await agGridVisualization.clickContainer('Compound Grid');
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I open Threshold Editor for the attribute named "Month" in the Grid Editor Panel
        await editorPanelForGrid.openAttributeThresholdsEditor('Month');

        // When I click New Threshold button to open the new threshold condition editor in advanced threshold editor
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
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('New Condition', 1);
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
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Formatting', 1);
        // And I click Enable Data Replace option check box
        await thresholdEditor.clickOnEnableDataReplaceCheckBox();
        // And I select option "Quick Symbol" for Data Replace
        await thresholdEditor.selectOptionFromDataReplaceDropdownMenu('Quick Symbol');
        // And I open quick symbol drop down menu
        await thresholdEditor.openQuickSymbolDropDownMenu();
        // And I select quick symbol with index number "6"
        await thresholdEditor.selectQuickSymbolByIndexNumber(6);

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
            vizPanelForGrid.getContainer('Compound Grid'),
            'TC2163_02',
            '2 Conditions Threshold applied on Month in Compound Grid'
        );

        // When I open Threshold Editor for the metric named "Cost" in the Grid Editor Panel
        await editorPanelForGrid.openMetricThresholdsEditor('Cost');
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
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('New Condition', 1);
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
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Formatting', 1);
        // And I click Enable Data Replace option check box
        await thresholdEditor.clickOnEnableDataReplaceCheckBox();
        // And I select option "Quick Symbol" for Data Replace
        await thresholdEditor.selectOptionFromDataReplaceDropdownMenu('Quick Symbol');
        // And I open quick symbol drop down menu
        await thresholdEditor.openQuickSymbolDropDownMenu();
        // And I select quick symbol with index number "10"
        await thresholdEditor.selectQuickSymbolByIndexNumber(10);
        
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
            vizPanelForGrid.getContainer('Compound Grid'),
            'TC2163_03',
            '2 Conditions Threshold applied on Cost in Compound Grid'
        );
        await dossierAuthoringPage.actionOnMenubarWithSubmenu('File', 'Save As...');
        await browser.pause(2000);
        await libraryAuthoringPage.saveInMyReport(gridConstants.Grid_Multi_Condition_Threshold_Consumption.name);

        await resetDossierState({
            credentials: gridConstants.gridUser,
            dossier: gridConstants.Grid_Multi_Condition_Threshold_Consumption,
        });
        await libraryPage.openDossierById({
            projectId: gridConstants.Grid_Multi_Condition_Threshold_Consumption.project.id,
            dossierId: gridConstants.Grid_Multi_Condition_Threshold_Consumption.id,
        });
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Grid'),
            'TC2163_04',
            'Grid with multi-condition thresholds applied in consumption mode'
        );
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Compound Grid'),
            'TC2163_05',
            'Compound Grid with multi-condition thresholds applied in consumption mode'
        );
    });

    it('[TC18239] Number Format in Threshold Editor', async () => {
        // Edit dossier by its ID "689641C411EAFEA695390080EFD5ACCD"
         // New MicroStrategy Tutorials > Shared Reports > Automation Objects > Normal Grid > Grid and Compound Grid_Thresholds
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.Grid_Numberformat_Threshold.project.id,
            dossierId: gridConstants.Grid_Numberformat_Threshold.id,
        });
        // take screenshot of grid before applying thresholds
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Grid'),
            'TC18239_01',
            'Grid before applying thresholds'
        );
        // When I click on container "Grid" from canvas
        await agGridVisualization.clickContainer('Grid');
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // When I open Threshold Editor for the metric named "Cost" in the Grid Editor Panel
        await editorPanelForGrid.openMetricThresholdsEditor('Cost');
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
        // When I type "770000" for Value input
        await advancedFilter.typeValueInput('770000');
        // Then I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();

        // When I select secondary option "Number Format" for threshold condition with index number "1"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Number Format', 1);
        // And I select "Fixed" from the drop down in the Number Format context menu
        await vizPanelForGrid.selectNumberFormatFromDropdown('Fixed');
        // And I click the "OK" button in the context menu to close it
        await vizPanelForGrid.clickContextMenuButton('OK');

        // When I select secondary option "Number Format" for threshold condition with index number "1"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Number Format', 1);
        // And I select "Fixed" from the drop down in the Number Format context menu
        await vizPanelForGrid.selectNumberFormatFromDropdown('Fixed');
        // And I click the "OK" button in the context menu to close it
        await vizPanelForGrid.clickContextMenuButton('OK');

        // When I select secondary option "Formatting" for threshold condition with index number "1"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Formatting', 1);
        // And I click "bold" button in the format editor
        await thresholdEditor.clickOnOptionOnTheFontButtonBar('bold');
        // And I open font color dropdown menu
        await thresholdEditor.openFontColorDropdownMenu();
        // And I select font color by color name "Red"
        await thresholdEditor.selectFontColorByColorName('Red');
        // And I click check mark on Format Preview panel
        await thresholdEditor.clickOnCheckMarkOnFormatPreviewPanel();
        // And I save and close Advanced Thresholds Editor
        await thresholdEditor.saveAndCloseAdvancedThresholdEditor();

        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Grid'),
            'TC18239_02',
            'Cost number format set to Fixed in thresholds'
        );

        // When I open Threshold Editor for the metric named "Cost" in the Grid Editor Panel
        await editorPanelForGrid.openAttributeThresholdsEditor('Cost');
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
        // When I type "880000" for Value input
        await advancedFilter.typeValueInput('880000');
        // Then I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();

        // When I select secondary option "Number Format" for threshold condition with index number "2"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Number Format', 2);
        // And I select "Currency" from the drop down in the Number Format context menu
        await vizPanelForGrid.selectNumberFormatFromDropdown('Currency');
        // And I select currency symbol "€" from the drop down in the Number Format context menu
        await vizPanelForGrid.selectNfCurrencySymbolFromDropdown('€');
        // And I click the "OK" button in the context menu to close it
        await vizPanelForGrid.clickContextMenuButton('OK');

        // When I select secondary option "Formatting" for threshold condition with index number "2"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Formatting', 2);
        // And I click "bold" button in the format editor
        await thresholdEditor.clickOnOptionOnTheFontButtonBar('bold');
        // And I open font color dropdown menu
        await thresholdEditor.openFontColorDropdownMenu();
        // And I select font color by color name "Green"
        await thresholdEditor.selectFontColorByColorName('Green');
        // And I click check mark on Format Preview panel
        await thresholdEditor.clickOnCheckMarkOnFormatPreviewPanel();
        // And I save and close Advanced Thresholds Editor
        await thresholdEditor.saveAndCloseAdvancedThresholdEditor();

        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Grid'),
            'TC18239_03',
            'Cost number format set to Currency in thresholds'
        );

        // When I open Threshold Editor for the metric named "Cost" in the Grid Editor Panel
        await editorPanelForGrid.openAttributeThresholdsEditor('Cost');
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
        // When I type "900000" for Value input
        await advancedFilter.typeValueInput('900000');
        // Then I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
    
        // When I select secondary option "Number Format" for threshold condition with index number "3"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Number Format', 3);
        // And I select "Date" from the drop down in the Number Format context menu
        await vizPanelForGrid.selectNumberFormatFromDropdown('Date');
        // And I click the "OK" button in the context menu to close it
        await vizPanelForGrid.clickContextMenuButton('OK');
        
        // When I select secondary option "Formatting" for threshold condition with index number "3"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Formatting', 3);
        // And I click "bold" button in the format editor
        await thresholdEditor.clickOnOptionOnTheFontButtonBar('bold');
        // And I open font color dropdown menu
        await thresholdEditor.openFontColorDropdownMenu();
        // And I select font color by color name "Orange"
        await thresholdEditor.selectFontColorByColorName('Orange');
        // And I click check mark on Format Preview panel
        await thresholdEditor.clickOnCheckMarkOnFormatPreviewPanel();
        // And I save and close Advanced Thresholds Editor
        await thresholdEditor.saveAndCloseAdvancedThresholdEditor();

        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Grid'),
            'TC18239_04',
            'Cost number format set to Date in thresholds'
        );

        // When I open Threshold Editor for the metric named "Cost" in the Grid Editor Panel
        await editorPanelForGrid.openAttributeThresholdsEditor('Cost');
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
        // When I type "920000" for Value input
        await advancedFilter.typeValueInput('920000');
        // Then I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
        // When I select secondary option "Number Format" for threshold condition with index number "4"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Number Format', 4);
        // And I select "Time" from the drop down in the Number Format context menu
        await vizPanelForGrid.selectNumberFormatFromDropdown('Time');
        // And I click the "OK" button in the context menu to close it
        await vizPanelForGrid.clickContextMenuButton('OK');

        // When I select secondary option "Formatting" for threshold condition with index number "4"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Formatting', 4);
        // And I click "bold" button in the format editor
        await thresholdEditor.clickOnOptionOnTheFontButtonBar('bold');
        // And I open font color dropdown menu
        await thresholdEditor.openFontColorDropdownMenu();
        // And I select font color by color name "Pink"
        await thresholdEditor.selectFontColorByColorName('Pink');
        // And I click check mark on Format Preview panel
        await thresholdEditor.clickOnCheckMarkOnFormatPreviewPanel();
        // And I save and close Advanced Thresholds Editor
        await thresholdEditor.saveAndCloseAdvancedThresholdEditor();
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Grid'),
            'TC18239_05',
            'Cost number format set to Time in thresholds'
        );

        // When I open Threshold Editor for the metric named "Cost" in the Grid Editor Panel
        await editorPanelForGrid.openAttributeThresholdsEditor('Cost');
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
        // When I type "970000" for Value input
        await advancedFilter.typeValueInput('970000');
        // Then I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
    
        // When I select secondary option "Number Format" for threshold condition with index number "5"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Number Format', 5);
        // And I select "Percentage" from the drop down in the Number Format context menu
        await vizPanelForGrid.selectNumberFormatFromDropdown('Percentage');
        // And I click the "OK" button in the context menu to close it
        await vizPanelForGrid.clickContextMenuButton('OK');
    
        // When I select secondary option "Formatting" for threshold condition with index number "5"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Formatting', 5);
        // And I click "bold" button in the format editor
        await thresholdEditor.clickOnOptionOnTheFontButtonBar('bold');
        // And I open font color dropdown menu
        await thresholdEditor.openFontColorDropdownMenu();
        // And I select font color by color name "Blue"
        await thresholdEditor.selectFontColorByColorName('Blue');
        // And I click check mark on Format Preview panel
        await thresholdEditor.clickOnCheckMarkOnFormatPreviewPanel();
        // And I save and close Advanced Thresholds Editor
        await thresholdEditor.saveAndCloseAdvancedThresholdEditor();

        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Grid'),
            'TC18239_06',
            'Cost number format set to Percentage in thresholds'
        );

        // When I open Threshold Editor for the metric named "Cost" in the Grid Editor Panel
        await editorPanelForGrid.openAttributeThresholdsEditor('Cost');
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
        // When I type "1000000" for Value input
        await advancedFilter.typeValueInput('1000000');
        // Then I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
    
        // When I select secondary option "Number Format" for threshold condition with index number "6"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Number Format', 6);
        // And I select "Fraction" from the drop down in the Number Format context menu
        await vizPanelForGrid.selectNumberFormatFromDropdown('Fraction');
        // And I click the "OK" button in the context menu to close it
        await vizPanelForGrid.clickContextMenuButton('OK');
    
        // When I select secondary option "Formatting" for threshold condition with index number "6"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Formatting', 6);
        // And I click "bold" button in the format editor
        await thresholdEditor.clickOnOptionOnTheFontButtonBar('bold');
        // And I open font color dropdown menu
        await thresholdEditor.openFontColorDropdownMenu();
        // And I select font color by color name "Bright Green"
        await thresholdEditor.selectFontColorByColorName('Bright Green');
        // And I click check mark on Format Preview panel
        await thresholdEditor.clickOnCheckMarkOnFormatPreviewPanel();
        // And I save and close Advanced Thresholds Editor
        await thresholdEditor.saveAndCloseAdvancedThresholdEditor();
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Grid'),
            'TC18239_07',
            'Cost number format set to Fraction in thresholds'
        );

        // When I open Threshold Editor for the metric named "Cost" in the Grid Editor Panel
        await editorPanelForGrid.openAttributeThresholdsEditor('Cost');
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
        // When I type "1070000" for Value input
        await advancedFilter.typeValueInput('1070000');
        // Then I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
    
        // When I select secondary option "Number Format" for threshold condition with index number "7"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Number Format', 7);
        // And I select "Scientific" from the drop down in the Number Format context menu
        await vizPanelForGrid.selectNumberFormatFromDropdown('Scientific');
        // And I click the "OK" button in the context menu to close it
        await vizPanelForGrid.clickContextMenuButton('OK');
    
        // When I select secondary option "Formatting" for threshold condition with index number "7"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Formatting', 7);
        // And I click "bold" button in the format editor
        await thresholdEditor.clickOnOptionOnTheFontButtonBar('bold');
        // And I open font color dropdown menu
        await thresholdEditor.openFontColorDropdownMenu();
        // And I select font color by color name "Sky Blue"
        await thresholdEditor.selectFontColorByColorName('Sky Blue');
        // And I click check mark on Format Preview panel
        await thresholdEditor.clickOnCheckMarkOnFormatPreviewPanel();
        // And I save and close Advanced Thresholds Editor
        await thresholdEditor.saveAndCloseAdvancedThresholdEditor();
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Grid'),
            'TC18239_08',
            'Cost number format set to Scientific in thresholds'
        );

        // When I open Threshold Editor for the metric named "Cost" in the Grid Editor Panel
        await editorPanelForGrid.openAttributeThresholdsEditor('Cost');
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
        // When I type "1100000" for Value input
        await advancedFilter.typeValueInput('1100000');
        // Then I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
    
        // When I select secondary option "Number Format" for threshold condition with index number "8"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Number Format', 8);
        // And I select "Custom" from the drop down in the Number Format context menu
        await vizPanelForGrid.selectNumberFormatFromDropdown('Custom');
        // And I click the Condense button in the Number Format context menu
        await vizPanelForGrid.clickNfCondense();
        // And I click the "OK" button in the context menu to close it
        await vizPanelForGrid.clickContextMenuButton('OK');
    
        // When I select secondary option "Formatting" for threshold condition with index number "8"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Formatting', 8);
        // And I click "bold" button in the format editor
        await thresholdEditor.clickOnOptionOnTheFontButtonBar('bold');
        // And I open font color dropdown menu
        await thresholdEditor.openFontColorDropdownMenu();
        // And I select font color by color name "Lavender"
        await thresholdEditor.selectFontColorByColorName('Lavender');
        // And I click check mark on Format Preview panel
        await thresholdEditor.clickOnCheckMarkOnFormatPreviewPanel();
        // And I save and close Advanced Thresholds Editor
        await thresholdEditor.saveAndCloseAdvancedThresholdEditor();
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Grid'),
            'TC18239_09',
            'Cost number format set to Custom in thresholds'
        );
        
        // When I click on container "Compound Grid" from canvas
        await agGridVisualization.clickContainer('Compound Grid');
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // When I clear Thresholds from object "Cost" in the Grid Editor Panel
        await editorPanelForGrid.clearThreshold('Cost');

        // When I open Threshold Editor for the metric named "Cost" in the Grid Editor Panel
        await editorPanelForGrid.openMetricThresholdsEditor('Cost');
        // And I open the color band drop down menu
        await thresholdEditor.openSimpleThresholdColorBandDropDownMenu();
        // And I select the color band "Traffic Lights" in simple threshold editor
        await thresholdEditor.selectSimpleThresholdImageBand('Traffic Lights');
        // And I switch from simple threshold editor to advanced threshold editor and apply the thresholds in threshold editor
        await thresholdEditor.switchSimToAdvThresholdWithApply();
        // When I select secondary option "Number Format" for threshold condition with index number "1"
        
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Number Format', 1);
        // And I select "Currency" from the drop down in the Number Format context menu
        await vizPanelForGrid.selectNumberFormatFromDropdown('Currency');
        // And I select currency symbol "¥" from the drop down in the Number Format context menu
        await vizPanelForGrid.selectNfCurrencySymbolFromDropdown('¥');
        // And I click the "OK" button in the context menu to close it
        await vizPanelForGrid.clickContextMenuButton('OK');
    
        // When I select secondary option "Number Format" for threshold condition with index number "2"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Number Format', 2);
        // And I select "Date" from the drop down in the Number Format context menu
        await vizPanelForGrid.selectNumberFormatFromDropdown('Date');
        // And I click the "OK" button in the context menu to close it
        await vizPanelForGrid.clickContextMenuButton('OK');
    
        // When I select secondary option "Number Format" for threshold condition with index number "3"
        await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Number Format', 3);
        // And I select "Percentage" from the drop down in the Number Format context menu
        await vizPanelForGrid.selectNumberFormatFromDropdown('Percentage');
        // And I click the "OK" button in the context menu to close it
        await vizPanelForGrid.clickContextMenuButton('OK');
        // And I save and close Advanced Thresholds Editor
        await thresholdEditor.saveAndCloseAdvancedThresholdEditor();

        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Compound Grid'),
            'TC18239_10',
            'Compound Grid with Advanced Thresholds applied with Number Formats'
        );
        await dossierAuthoringPage.actionOnMenubarWithSubmenu('File', 'Save As...');
        await browser.pause(2000);
        await libraryAuthoringPage.saveInMyReport(gridConstants.Grid_Numberformat_Threshold_Consumption.name);

        await resetDossierState({
            credentials: gridConstants.gridUser,
            dossier: gridConstants.Grid_Numberformat_Threshold_Consumption,
        });
        await libraryPage.openDossierById({
            projectId: gridConstants.Grid_Numberformat_Threshold_Consumption.project.id,
            dossierId: gridConstants.Grid_Numberformat_Threshold_Consumption.id,
        });
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Grid'),
            'TC18239_11',
            'Grid with Advanced Thresholds applied with Number Formats in consumption mode'
        );
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Compound Grid'),
            'TC18239_12',
            'Compound Grid with Advanced Thresholds applied with Number Formats in consumption mode'
        );
        
    });

    it('[TC7413] Dossier Converted by Threshold Report', async () => {
        // Edit dossier by its ID "63BDAA3A29466AF18E9FE18FF07DAD05"
         // New MicroStrategy Tutorials > Shared Reports > Automation Objects > Normal Grid > TC7413_R1_Threshold
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.Grid_Created_From_Threshold_Report.project.id,
            dossierId: gridConstants.Grid_Created_From_Threshold_Report.id,
        });
        // take screenshot of grid before applying thresholds
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC7413_01',
            'Dossier Converted by Threshold Report in authoring mode'
        );
        await libraryPage.openDossierById({
            projectId: gridConstants.Grid_Created_From_Threshold_Report.project.id,
            dossierId: gridConstants.Grid_Created_From_Threshold_Report.id,
        });
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'TC7413_02',
            'Dossier Converted by Threshold Report in consumption mode'
        );
        
    });
});
