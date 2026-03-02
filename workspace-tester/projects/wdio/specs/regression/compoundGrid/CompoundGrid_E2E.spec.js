import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import * as consts from '../../../constants/visualizations.js';
import { SelectTargetInLayersPanel } from '../../../pageObjects/authoring/SelectTargetInLayersPanel.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_sort') };
const { credentials } = specConfiguration;

//npm run regression -- --baseUrl=https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --spec 'specs/regression/compoundGrid/CompoundGrid_E2E.spec.js'
describe('Compound Grid E2E workflows', () => {
    const tutorialProject = {
        id: 'B628A31F11E7BD953EAE0080EF0583BD',
        name: 'New MicroStrategy Tutorials',
    };
    
    const CompoundGridE2E = {
        id: '6B4F30F63A4ACE35B9B924BFACBAE021', //'FD7603874B05B508B50C1FA1173A70DE',
        name: 'Compound Grid E2E',
        project: tutorialProject,
    };

    const CompoundGridE2ESaveAs = {
        id: 'BD06F42C4D4E6DFC1D2F1F82352B2E67', //'750E7FD743912AE5ECC671AC45B7FA57',
        name: 'Compound Grid E2E Save As',
        project: tutorialProject,
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const selectTargetInLayersPanel = new SelectTargetInLayersPanel();

    let { libraryAuthoringPage, libraryPage, dossierPage, advancedFilter, baseFormatPanel, baseFormatPanelReact, baseContainer, editorPanelForGrid, dossierAuthoringPage, showDataDialog, vizPanelForGrid, dossierMojo, datasetPanel, loginPage, tocMenu, derivedAttributeEditor, derivedMetricEditor, newFormatPanelForGrid, thresholdEditor, newGalleryPanel, toc, tocContentsPanel} = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(consts.tqmsUser.credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC99178] Create a compound grid', async () => { 
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${CompoundGridE2E.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());

        await baseContainer.changeViz('Compound Grid', 'Visualization 1', false);
        await vizPanelForGrid.dragDSObjectToGridDZ("Category", "attribute", "New Dataset 1", "Rows");
        await vizPanelForGrid.dragDSObjectToDZwithPosition("Subcategory", "attribute", "New Dataset 1", "Rows", "below", "Category");
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ("Cost", "metric", "New Dataset 1", "Column Set 1");
        await vizPanelForGrid.addColumnSet();
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ("Profit", "metric", "New Dataset 1", "Column Set 2");
        await vizPanelForGrid.addColumnSet();
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ("Call Center", "attribute", "New Dataset 1", "Column Set 3");
        await vizPanelForGrid.dragDSObjectToColumnSetDZwithPosition("Revenue", "metric", "New Dataset 1", "Column Set 3", "below", "Call Center");

        await since('The editor panel should have the items "Category" in the "Rows" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType("Category", "Rows").isDisplayed())
            .toBe(true);
        await since('The editor panel should have the items "Subcategory" in the "Rows" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType("Subcategory", "Rows").isDisplayed())
            .toBe(true);
        await since('The editor panel should have the items "Cost" in the "Column Set 1" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType("Cost", "Column Set 1").isDisplayed())
            .toBe(true);
        await since('The editor panel should have the items "Profit" in the "Column Set 2" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType("Profit", "Column Set 2").isDisplayed())
            .toBe(true);
        await since('The editor panel should have the items "Call Center" in the "Column Set 3" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType("Call Center", "Column Set 3").isDisplayed())
            .toBe(true);

        await since('The grid cell in compound grid "Visualization 1" at row 1, col 1 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Visualization 1').getText())
            .toBe('Category');
        await since('The grid cell in compound grid "Visualization 1" at row 1, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Visualization 1').getText())
            .toBe('Subcategory');
        await since('The grid cell in compound grid "Visualization 1" at row 1, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Visualization 1').getText())
            .toBe('Cost');
        await since('The grid cell in compound grid "Visualization 1" at row 1, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 4, 'Visualization 1').getText())
            .toBe('Profit');
        await since('The grid cell in compound grid "Visualization 1" at row 1, col 5 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 5, 'Visualization 1').getText())
            .toBe('Atlanta');
        await since('The grid cell in compound grid "Visualization 1" at row 2, col 1 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Visualization 1').getText())
            .toBe('Revenue');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 1 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 1, 'Visualization 1').getText())
            .toBe('Books');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 2, 'Visualization 1').getText())
            .toBe('Art & Architecture');        
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 3, 'Visualization 1').getText())
            .toBe('$370,161');  
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 4, 'Visualization 1').getText())
            .toBe('$110,012');      
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 5 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 5, 'Visualization 1').getText())
            .toBe('$14,436');
        await since('The grid cell in compound grid "Visualization 1" at row 1, col 6 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 6, 'Visualization 1').getText())
            .toBe('San Diego');  
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 6 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 6, 'Visualization 1').getText())
            .toBe('$40,789');         
           
        await dossierAuthoringPage.actionOnMenubarWithSubmenu('File', 'Save As...');
        await browser.pause(3000);
        await libraryAuthoringPage.saveInMyReport("Compound Grid E2E Save As");
    });

    it('[TC99178_01] Create derived objects', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${CompoundGridE2ESaveAs.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());
        // Create DA
        await vizPanelForGrid.selectContextMenuOptionFromElement("Subcategory", "Create Attribute...", "Visualization 1");
        await browser.pause(3000);
        await since('The derived attribute editor is displayed, should be #{expected}, instead we have #{actual}')
            .expect(await (await derivedAttributeEditor.derivedAttributeEditor).isDisplayed())
            .toBe(true);
        await derivedAttributeEditor.setAttributeFormDefinition('Concat(Category@DESC, ": ", Subcategory@DESC)');
        await since('The derived attribute definition in "Input" section should be #{expected}, instead we have #{actual}')
            .expect(await derivedAttributeEditor.getAttributeFormDefinition())
            .toBe('Concat(Category@DESC,  ": ",  Subcategory@DESC)');
        await derivedAttributeEditor.validateForm();
        await since('The string displayed in "Validation" section should be #{expected}, instead we have #{actual}')
            .expect(await derivedAttributeEditor.validationStatusText)
            .toBe("Valid Formula.");
        await derivedAttributeEditor.setAttributeName("New_Attribute");
        await derivedAttributeEditor.saveAttribute();
        await since('The derived attribute editor is displayed, should be #{expected}, instead we have #{actual}')
            .expect(await (await derivedAttributeEditor.derivedAttributeEditor).isDisplayed())
            .toBe(false);
        await since('Derived attribute "New_Attribute" displays on dataset panel under "New Dataset 1", should be #{expected}, instead we have #{actual}')
            .expect(await datasetPanel.isObjectFromDSdisplayed("New_Attribute", "derived attribute", "New Dataset 1"))
            .toBe(true);
        await since('The editor panel should have the items "Category" in the "Rows" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType("Category", "Rows").isDisplayed())
            .toBe(true);
        await since('The editor panel should have the items "Subcategory" in the "Rows" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType("Subcategory", "Rows").isDisplayed())
            .toBe(true);
        await since('The editor panel should have the items "New_Attribute" in the "Rows" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType("New_Attribute", "Rows").isDisplayed())
            .toBe(true);
        await since('The grid cell in compound grid "Visualization 1" at row 1, col 1 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Visualization 1').getText())
            .toBe('Category');
        await since('The grid cell in compound grid "Visualization 1" at row 1, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Visualization 1').getText())
            .toBe('Subcategory');
        await since('The grid cell in compound grid "Visualization 1" at row 1, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Visualization 1').getText())
            .toBe('New_Attribute');
        await since('The grid cell in compound grid "Visualization 1" at row 1, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 4, 'Visualization 1').getText())
            .toBe('Cost');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 1 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 1, 'Visualization 1').getText())
            .toBe('Books');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 2, 'Visualization 1').getText())
            .toBe('Art & Architecture');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 3, 'Visualization 1').getText())
            .toBe('Books: Art & Architecture');           
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 4, 'Visualization 1').getText())
            .toBe('$370,161');  
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 5 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 5, 'Visualization 1').getText())
            .toBe('$110,012');      
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 6 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 6, 'Visualization 1').getText())
            .toBe('$14,436');

        // Create DM
        await editorPanelForGrid.openDerivedObjectEditor("Revenue", "metric", "Create Metric...");
        await since('The derived metric editor is displayed, should be #{expected}, instead we have #{actual}')
            .expect(await (await derivedMetricEditor.derivedMetricEditor).isDisplayed())
            .toBe(true);
        await derivedMetricEditor.clickOnElement(await derivedMetricEditor.functionsSelectionPullDown);
        await derivedMetricEditor.clickOnElement(await derivedMetricEditor.getFunctionSelectioninPopupList("Avg"));
        await derivedMetricEditor.setMetricName("AvgRevenue")
        await derivedMetricEditor.saveMetric();
        await since('The derived metric editor is displayed, should be #{expected}, instead we have #{actual}')
            .expect(await (await derivedMetricEditor.derivedMetricEditor).isDisplayed())
            .toBe(false);
        await since('Derived metric "AvgRevenue" displays on dataset panel under "New Dataset 1", should be #{expected}, instead we have #{actual}')
            .expect(await datasetPanel.isObjectFromDSdisplayed("AvgRevenue", "derived metric", "New Dataset 1"))
            .toBe(true);
        await since('The editor panel should have the items "AvgRevenue" in the "Column Set 3" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType("AvgRevenue", "Column Set 3").isDisplayed())
            .toBe(true);
        await since('The grid cell in compound grid "Visualization 1" at row 1, col 1 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Visualization 1').getText())
            .toBe('Category');
        await since('The grid cell in compound grid "Visualization 1" at row 1, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Visualization 1').getText())
            .toBe('Subcategory');
        await since('The grid cell in compound grid "Visualization 1" at row 1, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Visualization 1').getText())
            .toBe('New_Attribute');
        await since('The grid cell in compound grid "Visualization 1" at row 1, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 4, 'Visualization 1').getText())
            .toBe('Cost');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 1 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 1, 'Visualization 1').getText())
            .toBe('Books');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 2, 'Visualization 1').getText())
            .toBe('Art & Architecture');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 3, 'Visualization 1').getText())
            .toBe('Books: Art & Architecture');           
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 4, 'Visualization 1').getText())
            .toBe('$370,161');  
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 5 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 5, 'Visualization 1').getText())
            .toBe('$110,012');      
        await since('The grid cell in compound grid "Visualization 1" at row 2, col 1 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Visualization 1').getText())
            .toBe('Revenue');
        await since('The grid cell in compound grid "Visualization 1" at row 2, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 2, 'Visualization 1').getText())
            .toBe('AvgRevenue');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 6 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 6, 'Visualization 1').getText())
            .toBe('$14,436');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 7 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 7, 'Visualization 1').getText())
            .toBe('$241');
        
        await libraryAuthoringPage.simpleSaveDashboard();
    });

    it('[TC99178_02] Create thresholds in the compound grid', async () => { 
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${CompoundGridE2ESaveAs.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());

        await thresholdEditor.openThresholdEditorFromCompoundGridDropzone("Cost", "Column Set 1");
        await thresholdEditor.openSimpleThresholdColorBandDropDownMenu();
        await thresholdEditor.selectSimpleThresholdColorBand("Tropical Jungle");
        await thresholdEditor.selectSimpleThresholdBasedOnOption("Highest %");
        await thresholdEditor.selectSimpleThresholdBreakByObject("Category");
        await thresholdEditor.saveAndCloseSimThresholdEditor();
        await since('The grid cell in visualization "Visualization 1" at "3", "4" has style "background-color" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("3", "4", "Visualization 1").getCSSProperty("background-color")).value)
            .toContain('243,132,75');  
        await since('The grid cell in visualization "Visualization 1" at "4", "3" has style "background-color" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("4", "3", "Visualization 1").getCSSProperty("background-color")).value)
            .toContain('249,207,105');  
        await since('The grid cell in visualization "Visualization 1" at "9", "4" has style "background-color" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("9", "4", "Visualization 1").getCSSProperty("background-color")).value)
            .toContain('130,188,88');  
        await since('The grid cell in visualization "Visualization 1" at "10", "3" has style "background-color" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("10", "3", "Visualization 1").getCSSProperty("background-color")).value)
            .toContain('43,132,75');  

        await vizPanelForGrid.openThresholdEditor("Subcategory", "Visualization 1");
        await thresholdEditor.openNewThresholdCondition();
        await thresholdEditor.openColumnSetPullDown();
        await thresholdEditor.selectColumnSet("Column Set 2");
        await advancedFilter.selectObjectFromBasedOnDropdown("Profit");
        await browser.pause(2000);
        await advancedFilter.openOperatorDropDown();
        await advancedFilter.openOperatorDropDown(); //click one more time to open the dropdown
        await advancedFilter.doSelectionOnOperatorDropdown("By Rank");
        await advancedFilter.selectMetricFilterOperatorByRank("Lowest%");
        await advancedFilter.typeValueInput("30");
        await thresholdEditor.clickOnNewConditionEditorOkButton();
        await since('A new threshold condition by index "1" is created, should be #{expected}, instead it is #{actual}')
            .expect(await thresholdEditor.checkThresholdConditionByIndex("1"))
            .toBe(true);  
        await thresholdEditor.openFormatPreviewPanelByOrderNumber("1");
        await thresholdEditor.setFillColor("Lime");
        await thresholdEditor.clickOnCheckMarkOnFormatPreviewPanel();
        await thresholdEditor.saveAndCloseAdvancedThresholdEditor();
        await since('The grid cell in visualization "Visualization 1" at "15", "2" has style "background-color" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("15", "2", "Visualization 1").getCSSProperty("background-color")).value)
            .toContain('153,204,0');  
        await since('The grid cell in visualization "Visualization 1" at "16", "1" has style "background-color" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("16", "1", "Visualization 1").getCSSProperty("background-color")).value)
            .toContain('153,204,0');  
        await since('The grid cell in visualization "Visualization 1" at "21", "2" has style "background-color" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("21", "2", "Visualization 1").getCSSProperty("background-color")).value)
            .toContain('153,204,0');  
    
        await thresholdEditor.openThresholdEditorFromCompoundGridDropzone("Call Center", "Column Set 3");
        await thresholdEditor.openNewThresholdCondition();
        await advancedFilter.selectObjectFromBasedOnDropdown("Call Center");
        await browser.pause(2000);
        await advancedFilter.openChooseElementsByDropDown();
        await advancedFilter.doSelectionOnChooseElementsByDropdown("Selecting in list");
        await advancedFilter.doElementSelectionForAttributeFilter("Atlanta,San Francisco,Salt Lake City".split(","));
        await thresholdEditor.clickOnNewConditionEditorOkButton();
        await since('A new threshold condition by index "1" is created, should be #{expected}, instead it is #{actual}')
            .expect(await thresholdEditor.checkThresholdConditionByIndex("1"))
            .toBe(true);  
        await thresholdEditor.openFormatPreviewPanelByOrderNumber("1");
        await thresholdEditor.openFontSizeDropdownMenu();
        await thresholdEditor.selectFontSizeBySizeNumber("10");
        await thresholdEditor.openFontColorDropdownMenu();
        await thresholdEditor.selectFontColorByColorName("Lavender");
        await thresholdEditor.clickOnCheckMarkOnFormatPreviewPanel();
        await thresholdEditor.saveAndCloseAdvancedThresholdEditor();
        await since('The grid cell in visualization "Visualization 1" at "1", "6" has style "color" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("1", "6", "Visualization 1").getCSSProperty("color")).value)
            .toContain('204,153,255');  
        await since('The grid cell in visualization "Visualization 1" at "1", "6" has style "font-size" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("1", "6", "Visualization 1").getCSSProperty("font-size")).value)
            .toContain('13.3333px');  
        await since('The grid cell in visualization "Visualization 1" at "1", "8" has style "color" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("1", "8", "Visualization 1").getCSSProperty("color")).value)
            .toContain('53,56,58');  
        await since('The grid cell in visualization "Visualization 1" at "1", "8" has style "font-size" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("1", "8", "Visualization 1").getCSSProperty("font-size")).value)
            .toContain('10.6667px');  
        await since('The grid cell in visualization "Visualization 1" at "1", "10" has style "color" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("1", "10", "Visualization 1").getCSSProperty("color")).value)
            .toContain('204,153,255');  
        await since('The grid cell in visualization "Visualization 1" at "1", "10" has style "font-size" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("1", "10", "Visualization 1").getCSSProperty("font-size")).value)
            .toContain('13.3333px');  
        await since('The grid cell in visualization "Visualization 1" at "1", "14" has style "color" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("1", "14", "Visualization 1").getCSSProperty("color")).value)
            .toContain('204,153,255');  
        await since('The grid cell in visualization "Visualization 1" at "1", "14" has style "font-size" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("1", "14", "Visualization 1").getCSSProperty("font-size")).value)
            .toContain('13.3333px'); 
        
        await vizPanelForGrid.openThresholdEditor("Revenue", "Visualization 1");
        await thresholdEditor.openSimpleThresholdColorBandDropDownMenu();
        await thresholdEditor.selectSimpleThresholdColorBand("Wild Berry");
        await thresholdEditor.selectSimpleThresholdBasedOnOption("Lowest %");
        await thresholdEditor.selectSimpleThresholdBreakByObject("Category");
        await thresholdEditor.saveAndCloseSimThresholdEditor();
        await since('The grid cell in visualization "Visualization 1" at "3", "6" has style "background-color" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("3", "6", "Visualization 1").getCSSProperty("background-color")).value)
            .toContain('237,148,121');
        await since('The grid cell in visualization "Visualization 1" at "3", "7" has style "background-color" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("3", "7", "Visualization 1").getCSSProperty("background-color")).value)
            .toContain('255,255,255');   
        await since('The grid cell in visualization "Visualization 1" at "3", "8" has style "background-color" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("3", "8", "Visualization 1").getCSSProperty("background-color")).value)
            .toContain('138,91,159');  
        await since('The grid cell in visualization "Visualization 1" at "3", "12" has style "background-color" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("3", "12", "Visualization 1").getCSSProperty("background-color")).value)
            .toContain('99,74,157');
            
        await libraryAuthoringPage.simpleSaveDashboard();
    });

    it('[TC99178_03] Create advanced filter in the compound grid', async () => { 
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${CompoundGridE2ESaveAs.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());

        await baseContainer.openAdvancedFilterEditor("Visualization 1");
        await advancedFilter.changeToAnotherColumnSetAdvancedFilterEditor("Column Set 3");
        await advancedFilter.openNewQualificationEditor();
        await advancedFilter.selectObjectFromBasedOnDropdown("Region");
        await browser.pause(2000);
        await advancedFilter.openChooseElementsByDropDown();
        await advancedFilter.doSelectionOnChooseElementsByDropdown("Selecting in list");
        await advancedFilter.doElementSelectionForAttributeFilter("Southeast,Southwest,South".split(","));
        await advancedFilter.clickOnNewQualificationEditorOkButton();
        await advancedFilter.clickSaveOnAdvancedFilterEditor();

        await since('The grid cell in compound grid "Visualization 1" at row 1, col 6 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 6, 'Visualization 1').getText())
            .toBe('Atlanta');
        await since('The grid cell in compound grid "Visualization 1" at row 1, col 10 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 10, 'Visualization 1').getText())
            .toBe('Salt Lake City');
        await since('The grid cell in compound grid "Visualization 1" at row 1, col 15 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 14, 'Visualization 1').getText())
            .toBe('New Orleans');

        await libraryAuthoringPage.simpleSaveDashboard();
    });

    it('[TC99178_04] Formatting in the compound grid', async () => {  
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${CompoundGridE2ESaveAs.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());

        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        await baseFormatPanelReact.switchSection("Text and Form");
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon(); // to dismiss the tooltips

        // Row Headers
        await newFormatPanelForGrid.selectGridSegment("Row Headers");
        await newFormatPanelForGrid.selectTextFont("Oleo Script");
        await newFormatPanelForGrid.selectFontStyle("bold");
        await newFormatPanelForGrid.setTextFontSize("10");
        // Column Headers
        await newFormatPanelForGrid.selectGridSegment("Column Headers");
        await baseFormatPanelReact.changeSegmentControl("All columns", "Column Set 3");
        await newFormatPanelForGrid.selectTextFont("Noto Sans");
        await newFormatPanelForGrid.clickFontColorBtn();
        await newFormatPanelForGrid.clickColorPickerModeBtn("grid");
        await newFormatPanelForGrid.clickBuiltInColor("#028F94");
        await newFormatPanelForGrid.clickFontColorBtn();
        // Values
        await newFormatPanelForGrid.selectGridSegment("Values");
        await baseFormatPanelReact.changeSegmentControl("All columns", "Column Set 2");
        await newFormatPanelForGrid.clickCellFillColorBtn();
        await newFormatPanelForGrid.clickColorPickerModeBtn("grid");
        await newFormatPanelForGrid.clickBuiltInColor("#B3CDEF");
        await newFormatPanelForGrid.clickCellFillColorBtn();

        await since('The grid cell in visualization "Visualization 1" at "3", "1" has style "font-size" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("3", "1", "Visualization 1").getCSSProperty("font-size")).value)
            .toContain('13.3333px');
        await since('The grid cell in visualization "Visualization 1" at "3", "2" has style "font-family" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("3", "2", "Visualization 1").getCSSProperty("font-family")).value)
            .toContain('oleo script');   
        await since('The grid cell in visualization "Visualization 1" at "3", "3" has style "font-weight" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("3", "3", "Visualization 1").getCSSProperty("font-weight")).value.toString())
            .toContain('700');  
        await since('The grid cell in visualization "Visualization 1" at "1", "6" has style "color" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("1", "6", "Visualization 1").getCSSProperty("color")).value)
            .toContain('204,153,255');  
        await since('The grid cell in visualization "Visualization 1" at "1", "8" has style "color" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("1", "8", "Visualization 1").getCSSProperty("color")).value)
            .toContain('2,143,148');  
        await since('The grid cell in visualization "Visualization 1" at "2", "1" has style "color" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("2", "1", "Visualization 1").getCSSProperty("color")).value)
            .toContain('2,143,148'); 
        await since('The grid cell in visualization "Visualization 1" at "1", "10" has style "color" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("1", "10", "Visualization 1").getCSSProperty("color")).value)
            .toContain('204,153,255');  
        await since('The grid cell in visualization "Visualization 1" at "3", "5" has style "background-color" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("3", "5", "Visualization 1").getCSSProperty("background-color")).value)
            .toContain('179,205,239'); 
        await since('The grid cell in visualization "Visualization 1" at "3", "4" has style "background-color" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("3", "4", "Visualization 1").getCSSProperty("background-color")).value)
            .toContain('243,132,75');  
        await since('The grid cell in visualization "Visualization 1" at "3", "6" has style "background-color" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("3", "6", "Visualization 1").getCSSProperty("background-color")).value)
            .toContain('237,148,121'); 

        await libraryAuthoringPage.simpleSaveDashboard();
    });

    it('[TC99178_05] Enable Outline Mode in the compound grid', async () => { 
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${CompoundGridE2ESaveAs.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());

        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        await baseFormatPanelReact.switchToGeneralSettingsTab();
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon(); // to dismiss the tooltips

        await newFormatPanelForGrid.clickSectionTitle("Layout");
        await newFormatPanelForGrid.clickCheckBox("Enable outline");
        await since('The grid visualization "Visualization 1" has object "Category" with outline mode enabled, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridObjectOutline("Category", "Visualization 1").isDisplayed())
            .toBe(true);
        await since('The grid visualization "Visualization 1" has object "Subcategory" with outline mode enabled, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridObjectOutline("Subcategory", "Visualization 1").isDisplayed())
            .toBe(true);
        await since('The attribute "Books" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Books", "Visualization 1"))
            .toBe(true);
        await since('The attribute "Business" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Business", "Visualization 1"))
            .toBe(true);
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 1 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 1, 'Visualization 1').getText())
            .toBe('Total');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 2, 'Visualization 1').getText())
            .toBe('$29,730,085');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 3, 'Visualization 1').getText())
            .toBe('$5,293,624');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 4, 'Visualization 1').getText())
            .toBe('$1,052,108');
        await since('The grid cell in compound grid "Visualization 1" at row 4, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 2, 'Visualization 1').getText())
            .toBe('$2,070,816');
        await since('The grid cell in compound grid "Visualization 1" at row 6, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 4, 'Visualization 1').getText())
            .toBe('$370,161');
        await since('The grid cell in compound grid "Visualization 1" at row 7, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(7, 3, 'Visualization 1').getText())
            .toBe('$311,597');
        await since('The grid cell in compound grid "Visualization 1" at row 8, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(8, 4, 'Visualization 1').getText())
            .toBe('$311,597');       
        await since('The grid cell in compound grid "Visualization 1" at row 10, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(10, 4, 'Visualization 1').getText())
            .toBe('$238,242');
        
        // Collapse from certain element
        await vizPanelForGrid.collapseOutlineFromElement("Business", "Visualization 1");
        await since('The grid visualization "Visualization 1" has object "Category" with outline mode enabled, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridObjectOutline("Category", "Visualization 1").isDisplayed())
            .toBe(true);
        await since('The grid visualization "Visualization 1" has object "Subcategory" with outline mode enabled, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridObjectOutline("Subcategory", "Visualization 1").isDisplayed())
            .toBe(true);
        await since('The attribute "Books" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Books", "Visualization 1"))
            .toBe(true);
        await since('The attribute "Business" is collapsed, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridCollapsed("Business", "Visualization 1"))
            .toBe(true);
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 1 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 1, 'Visualization 1').getText())
            .toBe('Total');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 2, 'Visualization 1').getText())
            .toBe('$29,730,085');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 3, 'Visualization 1').getText())
            .toBe('$5,293,624');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 4, 'Visualization 1').getText())
            .toBe('$1,052,108');
        await since('The grid cell in compound grid "Visualization 1" at row 4, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 2, 'Visualization 1').getText())
            .toBe('$2,070,816');
        await since('The grid cell in compound grid "Visualization 1" at row 6, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 4, 'Visualization 1').getText())
            .toBe('$370,161');
        await since('The grid cell in compound grid "Visualization 1" at row 7, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(7, 3, 'Visualization 1').getText())
            .toBe('$311,597');
        await since('The grid cell in compound grid "Visualization 1" at row 8, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(8, 4, 'Visualization 1').getText())
            .toBe('');       
        await since('The grid cell in compound grid "Visualization 1" at row 10, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(10, 4, 'Visualization 1').getText())
            .toBe('$238,242');

        // Collapse from column header
        await vizPanelForGrid.collapseOutlineFromColumnHeader("Category", "Visualization 1");
        await since('The attribute "Category" is collapsed, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridCollapsed("Category", "Visualization 1"))
            .toBe(true);
        await since('The attribute "Sucategory" is collapsed, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridCollapsed("Subcategory", "Visualization 1"))
            .toBe(true);
        await since('The element "Books" is collapsed, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridCollapsed("Books", "Visualization 1"))
            .toBe(true);
        await since('The element "Electronics" is collapsed, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridCollapsed("Electronics", "Visualization 1"))
            .toBe(true);
        await since('The element "Movies" is collapsed, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridCollapsed("Movies", "Visualization 1"))
            .toBe(true);
        await since('The element "Music" is collapsed, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridCollapsed("Music", "Visualization 1"))
            .toBe(true);
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 1 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 1, 'Visualization 1').getText())
            .toBe('Total');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 2, 'Visualization 1').getText())
            .toBe('$29,730,085');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 3, 'Visualization 1').getText())
            .toBe('$5,293,624');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 4, 'Visualization 1').getText())
            .toBe('$1,052,108');
        await since('The grid cell in compound grid "Visualization 1" at row 4, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 2, 'Visualization 1').getText())
            .toBe('$2,070,816');
        await since('The grid cell in compound grid "Visualization 1" at row 6, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 4, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 7, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(7, 3, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 8, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(8, 4, 'Visualization 1').getText())
            .toBe('');       
        await since('The grid cell in compound grid "Visualization 1" at row 10, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(10, 4, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 17, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(17, 2, 'Visualization 1').getText())
            .toBe('$20,101,700');
        await since('The grid cell in compound grid "Visualization 1" at row 18, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(18, 3, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 21, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(21, 4, 'Visualization 1').getText())
            .toBe('');

        // Expand from certain element
        await vizPanelForGrid.expandOutlineFromElement("Books", "Visualization 1");
        await since('The attribute "Category" is collapsed, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridCollapsed("Category", "Visualization 1"))
            .toBe(true);
        await since('The attribute "Sucategory" is collapsed, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridCollapsed("Subcategory", "Visualization 1"))
            .toBe(true);
        await since('The element "Books" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Books", "Visualization 1"))
            .toBe(true);
        await since('The element "Electronics" is collapsed, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridCollapsed("Electronics", "Visualization 1"))
            .toBe(true);
        await since('The element "Movies" is collapsed, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridCollapsed("Movies", "Visualization 1"))
            .toBe(true);
        await since('The element "Music" is collapsed, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridCollapsed("Music", "Visualization 1"))
            .toBe(true);
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 1 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 1, 'Visualization 1').getText())
            .toBe('Total');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 2, 'Visualization 1').getText())
            .toBe('$29,730,085');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 3, 'Visualization 1').getText())
            .toBe('$5,293,624');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 4, 'Visualization 1').getText())
            .toBe('$1,052,108');
        await since('The grid cell in compound grid "Visualization 1" at row 4, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 2, 'Visualization 1').getText())
            .toBe('$2,070,816');
        await since('The grid cell in compound grid "Visualization 1" at row 5, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 2, 'Visualization 1').getText())
            .toBe('Art & Architecture');
        await since('The grid cell in compound grid "Visualization 1" at row 5, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 3, 'Visualization 1').getText())
            .toBe('$370,161');
        await since('The grid cell in compound grid "Visualization 1" at row 6, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 4, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 7, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(7, 2, 'Visualization 1').getText())
            .toBe('Business');
        await since('The grid cell in compound grid "Visualization 1" at row 7, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(7, 3, 'Visualization 1').getText())
            .toBe('$311,597');
        await since('The grid cell in compound grid "Visualization 1" at row 8, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(8, 4, 'Visualization 1').getText())
            .toBe('');       
        await since('The grid cell in compound grid "Visualization 1" at row 10, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(10, 4, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 17, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(17, 2, 'Visualization 1').getText())
            .toBe('$20,101,700');
        await since('The grid cell in compound grid "Visualization 1" at row 18, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(18, 3, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 21, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(21, 4, 'Visualization 1').getText())
            .toBe('');

        // Expand from column header
        await vizPanelForGrid.expandOutlineFromColumnHeader("Subcategory", "Visualization 1");
        await since('The attribute "Category" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Category", "Visualization 1"))
            .toBe(true);
        await since('The attribute "Sucategory" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Subcategory", "Visualization 1"))
            .toBe(true);
        await since('The element "Books" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Books", "Visualization 1"))
            .toBe(true);
        await since('The element "Electronics" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Electronics", "Visualization 1"))
            .toBe(true);
        await since('The element "Movies" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Movies", "Visualization 1"))
            .toBe(true);
        await since('The element "Music" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Music", "Visualization 1"))
            .toBe(true);
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 1 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 1, 'Visualization 1').getText())
            .toBe('Total');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 2, 'Visualization 1').getText())
            .toBe('$29,730,085');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 3, 'Visualization 1').getText())
            .toBe('$5,293,624');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 4, 'Visualization 1').getText())
            .toBe('$1,052,108');
        await since('The grid cell in compound grid "Visualization 1" at row 4, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 2, 'Visualization 1').getText())
            .toBe('$2,070,816');
        await since('The grid cell in compound grid "Visualization 1" at row 5, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 2, 'Visualization 1').getText())
            .toBe('Art & Architecture');
        await since('The grid cell in compound grid "Visualization 1" at row 5, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 3, 'Visualization 1').getText())
            .toBe('$370,161');
        await since('The grid cell in compound grid "Visualization 1" at row 6, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 4, 'Visualization 1').getText())
            .toBe('$370,161');
        await since('The grid cell in compound grid "Visualization 1" at row 7, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(7, 2, 'Visualization 1').getText())
            .toBe('Business');
        await since('The grid cell in compound grid "Visualization 1" at row 7, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(7, 3, 'Visualization 1').getText())
            .toBe('$311,597');
        await since('The grid cell in compound grid "Visualization 1" at row 8, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(8, 4, 'Visualization 1').getText())
            .toBe('$311,597');       
        await since('The grid cell in compound grid "Visualization 1" at row 10, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(10, 4, 'Visualization 1').getText())
            .toBe('$238,242');
        await since('The grid cell in compound grid "Visualization 1" at row 17, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(17, 2, 'Visualization 1').getText())
            .toBe('$20,101,700');
        await since('The grid cell in compound grid "Visualization 1" at row 21, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(21, 4, 'Visualization 1').getText())
            .toBe('$4,160,318');
        
        await libraryAuthoringPage.simpleSaveDashboard();
    });

    it('[TC99178_06] Configure cross-chapter linking for the compound grid', async () => {  
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${CompoundGridE2ESaveAs.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());

        await dossierAuthoringPage.actionOnToolbar("Add Chapter");
        await browser.pause(2000);
        await baseContainer.changeViz("Compound Grid", "Visualization 1", false);
        await vizPanelForGrid.switchToEditorPanel();
        await vizPanelForGrid.dragDSObjectToGridDZ("Cost", "metric", "New Dataset 1", "Rows");
        await vizPanelForGrid.dragDSObjectToDZwithPosition("Profit", "metric", "New Dataset 1", "Rows", "below", "Cost");
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ("Year", "attribute", "New Dataset 1", "Column Set 1");
        await vizPanelForGrid.dragDSObjectToColumnSetDZwithPosition("Region", "attribute", "New Dataset 1", "Column Set 1", "below", "Year");

        await dossierAuthoringPage.actionOnToolbar("Visualization");
        await newGalleryPanel.selectViz("Compound Grid")
        await vizPanelForGrid.switchToEditorPanel();
        await datasetPanel.addObjectToVizByDoubleClick("Year", "attribute", "New Dataset 1");
        await vizPanelForGrid.dragDSObjectToDZwithPosition("Region", "attribute", "New Dataset 1", "Rows", "below", "Year");
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ("Cost", "metric", "New Dataset 1", "Column Set 1");
        await vizPanelForGrid.addColumnSet();
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ("Category", "attribute", "New Dataset 1", "Column Set 2");
        await vizPanelForGrid.dragDSObjectToColumnSetDZwithPosition("Profit", "metric", "New Dataset 1", "Column Set 2", "below", "Category");

        await tocContentsPanel.clickOnChapter("Chapter 1");
        await baseContainer.selectTargetVisualizations("Visualization 1");
        await tocContentsPanel.clickOnChapter("Chapter 2");
        await baseContainer.clickContainer('Visualization 1');
        await baseContainer.clickContainer('Visualization 2');
        await selectTargetInLayersPanel.applyButtonForSelectTarget();

        await libraryAuthoringPage.simpleSaveDashboard();
    });

    it('[TC99178_07] Use the compound grid in library consumption', async () => {  
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${CompoundGridE2ESaveAs.id}`;
        await libraryPage.openDossierByUrl(url.toString());
        await dossierPage.resetDossierIfPossible();

        // Expand/Collapse outline mode
        await vizPanelForGrid.collapseOutlineFromColumnHeader("Category", "Visualization 1");
        await since('The attribute "Category" is collapsed, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridCollapsed("Category", "Visualization 1"))
            .toBe(true);
        await since('The attribute "Sucategory" is collapsed, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridCollapsed("Subcategory", "Visualization 1"))
            .toBe(true);
        await since('The element "Books" is collapsed, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridCollapsed("Books", "Visualization 1"))
            .toBe(true);
        await since('The element "Electronics" is collapsed, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridCollapsed("Electronics", "Visualization 1"))
            .toBe(true);
        await since('The element "Movies" is collapsed, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridCollapsed("Movies", "Visualization 1"))
            .toBe(true);
        await since('The element "Music" is collapsed, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridCollapsed("Music", "Visualization 1"))
            .toBe(true);
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 1 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 1, 'Visualization 1').getText())
            .toBe('Total');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 2, 'Visualization 1').getText())
            .toBe('$29,730,085');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 3, 'Visualization 1').getText())
            .toBe('$5,293,624');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 4, 'Visualization 1').getText())
            .toBe('$1,052,108');
        await since('The grid cell in compound grid "Visualization 1" at row 4, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 2, 'Visualization 1').getText())
            .toBe('$2,070,816');
        await since('The grid cell in compound grid "Visualization 1" at row 6, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 4, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 7, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(7, 3, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 8, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(8, 4, 'Visualization 1').getText())
            .toBe('');       
        await since('The grid cell in compound grid "Visualization 1" at row 10, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(10, 4, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 17, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(17, 2, 'Visualization 1').getText())
            .toBe('$20,101,700');
        await since('The grid cell in compound grid "Visualization 1" at row 18, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(18, 3, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 21, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(21, 4, 'Visualization 1').getText())
            .toBe('');

        await vizPanelForGrid.expandOutlineFromColumnHeader("Subcategory", "Visualization 1");
        await since('The attribute "Category" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Category", "Visualization 1"))
            .toBe(true);
        await since('The attribute "Sucategory" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Subcategory", "Visualization 1"))
            .toBe(true);
        await since('The element "Books" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Books", "Visualization 1"))
            .toBe(true);
        await since('The element "Electronics" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Electronics", "Visualization 1"))
            .toBe(true);
        await since('The element "Movies" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Movies", "Visualization 1"))
            .toBe(true);
        await since('The element "Music" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Music", "Visualization 1"))
            .toBe(true);
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 1 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 1, 'Visualization 1').getText())
            .toBe('Total');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 2, 'Visualization 1').getText())
            .toBe('$29,730,085');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 3, 'Visualization 1').getText())
            .toBe('$5,293,624');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 4, 'Visualization 1').getText())
            .toBe('$1,052,108');
        await since('The grid cell in compound grid "Visualization 1" at row 4, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 2, 'Visualization 1').getText())
            .toBe('$2,070,816');
        await since('The grid cell in compound grid "Visualization 1" at row 5, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 2, 'Visualization 1').getText())
            .toBe('Art & Architecture');
        await since('The grid cell in compound grid "Visualization 1" at row 5, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 3, 'Visualization 1').getText())
            .toBe('$370,161');
        await since('The grid cell in compound grid "Visualization 1" at row 6, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 4, 'Visualization 1').getText())
            .toBe('$370,161');
        await since('The grid cell in compound grid "Visualization 1" at row 7, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(7, 2, 'Visualization 1').getText())
            .toBe('Business');
        await since('The grid cell in compound grid "Visualization 1" at row 7, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(7, 3, 'Visualization 1').getText())
            .toBe('$311,597');
        await since('The grid cell in compound grid "Visualization 1" at row 8, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(8, 4, 'Visualization 1').getText())
            .toBe('$311,597');       
        await since('The grid cell in compound grid "Visualization 1" at row 10, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(10, 4, 'Visualization 1').getText())
            .toBe('$238,242');
        await since('The grid cell in compound grid "Visualization 1" at row 17, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(17, 2, 'Visualization 1').getText())
            .toBe('$20,101,700');
        await since('The grid cell in compound grid "Visualization 1" at row 21, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(21, 4, 'Visualization 1').getText())
            .toBe('$4,160,318');

        // Turn off Total
        await vizPanelForGrid.toggleShowTotalsFromMetric("Cost", "Visualization 1", true);
        await since('The attribute "Category" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Category", "Visualization 1"))
            .toBe(true);
        await since('The attribute "Sucategory" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Subcategory", "Visualization 1"))
            .toBe(true);
        await since('The element "Books" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Books", "Visualization 1"))
            .toBe(true);
        await since('The element "Electronics" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Electronics", "Visualization 1"))
            .toBe(true);
        await since('The element "Movies" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Movies", "Visualization 1"))
            .toBe(true);
        await since('The element "Music" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Music", "Visualization 1"))
            .toBe(true);
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 1 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 1, 'Visualization 1').getText())
            .toBe('Books');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 2, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 3, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 4, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 4, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 2, 'Visualization 1').getText())
            .toBe('Art & Architecture');
        await since('The grid cell in compound grid "Visualization 1" at row 4, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 3, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 5, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 3, 'Visualization 1').getText())
            .toBe('Books: Art & Architecture');
        await since('The grid cell in compound grid "Visualization 1" at row 5, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 4, 'Visualization 1').getText())
            .toBe('$370,161');
        await since('The grid cell in compound grid "Visualization 1" at row 6, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 2, 'Visualization 1').getText())
            .toBe('Business');
        await since('The grid cell in compound grid "Visualization 1" at row 6, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 3, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 7, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(7, 4, 'Visualization 1').getText())
            .toBe('$311,597');       
        await since('The grid cell in compound grid "Visualization 1" at row 9, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(9, 4, 'Visualization 1').getText())
            .toBe('$238,242');
        await since('The grid cell in compound grid "Visualization 1" at row 16, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(16, 2, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 20, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(20, 4, 'Visualization 1').getText())
            .toBe('$4,160,318');

        // Sort
        await vizPanelForGrid.selectContextMenuOptionFromElement("Subcategory", "Sort Ascending", "Visualization 1");
        await since('The attribute "Category" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Category", "Visualization 1"))
            .toBe(true);
        await since('The attribute "Sucategory" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Subcategory", "Visualization 1"))
            .toBe(true);
        await since('The element "Books" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Books", "Visualization 1"))
            .toBe(true);
        await since('The element "Electronics" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Electronics", "Visualization 1"))
            .toBe(true);
        await since('The element "Movies" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Movies", "Visualization 1"))
            .toBe(true);
        await since('The element "Music" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Music", "Visualization 1"))
            .toBe(true);
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 1 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 1, 'Visualization 1').getText())
            .toBe('Movies');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 2, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 3, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 4, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 4, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 2, 'Visualization 1').getText())
            .toBe('Action');
        await since('The grid cell in compound grid "Visualization 1" at row 4, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 3, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 5, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 3, 'Visualization 1').getText())
            .toBe('Movies: Action');
        await since('The grid cell in compound grid "Visualization 1" at row 5, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 4, 'Visualization 1').getText())
            .toBe('$579,819');
        await since('The grid cell in compound grid "Visualization 1" at row 6, col 1 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 1, 'Visualization 1').getText())
            .toBe('Music');
        await since('The grid cell in compound grid "Visualization 1" at row 6, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 2, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 7, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(7, 2, 'Visualization 1').getText())
            .toBe('Alternative');       
        await since('The grid cell in compound grid "Visualization 1" at row 8, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(8, 4, 'Visualization 1').getText())
            .toBe('$696,977');
        await since('The grid cell in compound grid "Visualization 1" at row 16, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(16, 2, 'Visualization 1').getText())
            .toBe('Books - Miscellaneous');
        await since('The grid cell in compound grid "Visualization 1" at row 19, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(19, 4, 'Visualization 1').getText())
            .toBe('$311,597');

        await vizPanelForGrid.selectContextMenuOptionFromElement("Cost", "Sort All Values", "Visualization 1");
        await since('The attribute "Category" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Category", "Visualization 1"))
            .toBe(true);
        await since('The attribute "Sucategory" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Subcategory", "Visualization 1"))
            .toBe(true);
        await since('The element "Books" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Books", "Visualization 1"))
            .toBe(true);
        await since('The element "Electronics" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Electronics", "Visualization 1"))
            .toBe(true);
        await since('The element "Movies" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Movies", "Visualization 1"))
            .toBe(true);
        await since('The element "Music" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Music", "Visualization 1"))
            .toBe(true);
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 1 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 1, 'Visualization 1').getText())
            .toBe('Electronics');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 2, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 3, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 4, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 4, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 2, 'Visualization 1').getText())
            .toBe('Video Equipment');
        await since('The grid cell in compound grid "Visualization 1" at row 4, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 3, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 5, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 3, 'Visualization 1').getText())
            .toBe('Electronics: Video Equipment');
        await since('The grid cell in compound grid "Visualization 1" at row 5, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 4, 'Visualization 1').getText())
            .toBe('$4,181,261');
        await since('The grid cell in compound grid "Visualization 1" at row 6, col 1 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 1, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 6, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 2, 'Visualization 1').getText())
            .toBe('Cameras');
        await since('The grid cell in compound grid "Visualization 1" at row 7, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(7, 4, 'Visualization 1').getText())
            .toBe('$4,160,318');       
        await since('The grid cell in compound grid "Visualization 1" at row 8, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(8, 2, 'Visualization 1').getText())
            .toBe('Electronics - Miscellaneous');
        await since('The grid cell in compound grid "Visualization 1" at row 16, col 1 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(16, 1, 'Visualization 1').getText())
            .toBe('Movies');
        await since('The grid cell in compound grid "Visualization 1" at row 18, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(18, 4, 'Visualization 1').getText())
            .toBe('$751,775');        

        // Dossier Linking
        await vizPanelForGrid.selectContextMenuOptionFromElement("$4,181,261", "Go to Page: Page 1", "Visualization 1");
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 2, 'Visualization 1').getText())
            .toBe('$159,260');
        await since('The grid cell in compound grid "Visualization 1" at row 4, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 2, 'Visualization 1').getText())
            .toBe('$34,893');
        await since('The grid cell in compound grid "Visualization 2" at row 1, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 4, 'Visualization 2').getText())
            .toBe('Electronics');
        await since('The grid cell in compound grid "Visualization 2" at row 3, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 3, 'Visualization 2').getText())
            .toBe('$159,260');    
        await since('The grid cell in compound grid "Visualization 2" at row 3, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 4, 'Visualization 2').getText())
            .toBe('$34,893');    

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await vizPanelForGrid.selectContextMenuOptionFromElement("San Diego", "Go to Page: Page 1", "Visualization 1");
        await since('The grid cell in compound grid "Visualization 1" at row 2, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 2, 'Visualization 1').getText())
            .toBe('Southwest');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 2, 'Visualization 1').getText())
            .toBe('$668,989');
        await since('The grid cell in compound grid "Visualization 1" at row 4, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 2, 'Visualization 1').getText())
            .toBe('$117,142');
        await since('The grid cell in compound grid "Visualization 2" at row 1, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 4, 'Visualization 2').getText())
            .toBe('Books');
        await since('The grid cell in compound grid "Visualization 2" at row 1, col 7 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 7, 'Visualization 2').getText())
            .toBe('Music');
        await since('The grid cell in compound grid "Visualization 2" at row 3, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 2, 'Visualization 2').getText())
            .toBe('Southwest');
        await since('The grid cell in compound grid "Visualization 2" at row 3, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 3, 'Visualization 2').getText())
            .toBe('$668,989');    
        await since('The grid cell in compound grid "Visualization 2" at row 3, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 4, 'Visualization 2').getText())
            .toBe('$12,476');    
        await since('The grid cell in compound grid "Visualization 2" at row 3, col 7 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 7, 'Visualization 2').getText())
            .toBe('$3,753');    
        
        // Show Data
        await vizPanelForGrid.openShowDataDiagFromViz('Visualization 1');
        await browser.pause(2000);
        await since('An editor should show up with title "Show Data"')
            .expect(await dossierMojo.getMojoEditorWithTitle('Show Data').isDisplayed())
            .toBe(true);
        await since('It should show there are "24" rows of data in the show data dialog')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(24);
        await since('Show data grid at row 0 and column 0 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(0, 0).getText())
            .toBe('Region');
        await since('Show data grid at row 1 and column 2 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(1, 2).getText())
            .toBe('$1,097,333');
        await showDataDialog.clickShowDataCloseButton();

        // Keep Only/Exclude
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await vizPanelForGrid.keepOnly("Salt Lake City", "Visualization 1", false);
        await since('The attribute "Category" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Category", "Visualization 1"))
            .toBe(true);
        await since('The attribute "Sucategory" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Subcategory", "Visualization 1"))
            .toBe(true);
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 1 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 1, 'Visualization 1').getText())
            .toBe('Electronics');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 2, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 3, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 4, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 4, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 2, 'Visualization 1').getText())
            .toBe('Video Equipment');
        await since('The grid cell in compound grid "Visualization 1" at row 4, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 3, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 5, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 3, 'Visualization 1').getText())
            .toBe('Electronics: Video Equipment');
        await since('The grid cell in compound grid "Visualization 1" at row 5, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 4, 'Visualization 1').getText())
            .toBe('$87,807');
        await since('The grid cell in visualization "Visualization 1" at "5", "4" has style "background-color" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("5", "4", "Visualization 1").getCSSProperty("background-color")).value)
            .toContain('229,81,73');  
        await since('The grid cell in visualization "Visualization 1" at "5", "5" has style "background-color" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("5", "5", "Visualization 1").getCSSProperty("background-color")).value)
            .toContain('179,205,239');  
        await since('The grid cell in compound grid "Visualization 1" at row 5, col 6 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 6, 'Visualization 1').getText())
            .toBe('$107,458');
        await since('The grid cell in visualization "Visualization 1" at "5", "6" has style "background-color" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("5", "6", "Visualization 1").getCSSProperty("background-color")).value)
            .toContain('99,74,157');  
        await since('The grid cell in compound grid "Visualization 1" at row 5, col 7 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 7, 'Visualization 1').getText())
            .toBe('$4,477');        
        await since('The grid cell in compound grid "Visualization 1" at row 6, col 1 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 1, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 6, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 2, 'Visualization 1').getText())
            .toBe('Cameras');
        await since('The grid cell in compound grid "Visualization 1" at row 7, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(7, 4, 'Visualization 1').getText())
            .toBe('$87,717');   
        await since('The grid cell in visualization "Visualization 1" at "7", "4" has style "background-color" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("7", "4", "Visualization 1").getCSSProperty("background-color")).value)
            .toContain('243,132,75');   
        await since('The grid cell in compound grid "Visualization 1" at row 1, col 6 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 6, 'Visualization 1').getText())
            .toBe('Salt Lake City');          
        await since('The grid cell in visualization "Visualization 1" at "1", "6" has style "color" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("1", "6", "Visualization 1").getCSSProperty("color")).value)
            .toContain('204,153,255');  
        await since('The grid cell in compound grid "Visualization 1" at row 2, col 1 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Visualization 1').getText())
            .toBe('Revenue');          
        await since('The grid cell in visualization "Visualization 1" at "2", "1" has style "color" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("2", "1", "Visualization 1").getCSSProperty("color")).value)
            .toContain('2,143,148');  
        
        await vizPanelForGrid.excludeElement("$107,458", "Visualization 1", false);
        await since('The attribute "Category" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Category", "Visualization 1"))
            .toBe(true);
        await since('The attribute "Sucategory" is expanded, should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.confirmOutlineGridExpanded("Subcategory", "Visualization 1"))
            .toBe(true);
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 1 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 1, 'Visualization 1').getText())
            .toBe('Electronics');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 2, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 3, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 3, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 4, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 4, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 2, 'Visualization 1').getText())
            .toBe('Cameras');
        await since('The grid cell in compound grid "Visualization 1" at row 4, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 3, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 5, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 3, 'Visualization 1').getText())
            .toBe('Electronics: Cameras');
        await since('The grid cell in compound grid "Visualization 1" at row 5, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 4, 'Visualization 1').getText())
            .toBe('$87,717');
        await since('The grid cell in visualization "Visualization 1" at "5", "4" has style "background-color" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("5", "4", "Visualization 1").getCSSProperty("background-color")).value)
            .toContain('229,81,73');  
        await since('The grid cell in visualization "Visualization 1" at "5", "5" has style "background-color" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("5", "5", "Visualization 1").getCSSProperty("background-color")).value)
            .toContain('179,205,239');  
        await since('The grid cell in compound grid "Visualization 1" at row 5, col 6 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 6, 'Visualization 1').getText())
            .toBe('$106,961');
        await since('The grid cell in visualization "Visualization 1" at "5", "6" has style "background-color" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("5", "6", "Visualization 1").getCSSProperty("background-color")).value)
            .toContain('99,74,157');  
        await since('The grid cell in compound grid "Visualization 1" at row 5, col 7 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 7, 'Visualization 1').getText())
            .toBe('$8,913');        
        await since('The grid cell in compound grid "Visualization 1" at row 6, col 1 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 1, 'Visualization 1').getText())
            .toBe('');
        await since('The grid cell in compound grid "Visualization 1" at row 6, col 2 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 2, 'Visualization 1').getText())
            .toBe('Electronics - Miscellaneous');
        await since('The grid cell in compound grid "Visualization 1" at row 7, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(7, 4, 'Visualization 1').getText())
            .toBe('$76,880');   
        await since('The grid cell in visualization "Visualization 1" at "7", "4" has style "background-color" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("7", "4", "Visualization 1").getCSSProperty("background-color")).value)
            .toContain('243,132,75');      
        await since('The grid cell in compound grid "Visualization 1" at row 1, col 6 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 6, 'Visualization 1').getText())
            .toBe('Salt Lake City');          
        await since('The grid cell in visualization "Visualization 1" at "1", "6" has style "color" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("1", "6", "Visualization 1").getCSSProperty("color")).value)
            .toContain('204,153,255');  
        await since('The grid cell in compound grid "Visualization 1" at row 2, col 1 should be #{expected}, instead it is #{actual}')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Visualization 1').getText())
            .toBe('Revenue');          
        await since('The grid cell in visualization "Visualization 1" at "2", "1" has style "color" with value #{expected}, instead it is #{actual}')
            .expect((await vizPanelForGrid.getGridCellByPosition("2", "1", "Visualization 1").getCSSProperty("color")).value)
            .toContain('2,143,148');  
    });

});