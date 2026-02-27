import * as gridConstants from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { existingObjectsDialog } from '../../../pageObjects/dossierEditor/ExistingObjectsDialog.js';

describe('NormalGrid_AdvancedFilter', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        loginPage,
        libraryPage,
        advancedFilter,
        datasetsPanel,
        datasetPanel,
        dossierAuthoringPage,
        libraryAuthoringPage,
        dossierMojo,
        dossierPage,
        vizPanelForGrid,
        editorPanelForGrid,
        loadingDialog,
        baseContainer,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    it('[TC17730_1] Create 5 different types of advanced filter', async () => {
        // Edit dossier by its ID "2C30131411EA07D97A040080EFD53258"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > Normal Grid > advanced_filter_normal_grid
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.NormalGridAdvancedFilter.project.id,
            dossierId: gridConstants.NormalGridAdvancedFilter.id,
        });
        await browser.pause(3000);
        // And I open advanced filter editor for "Visualization 1" by clicking visualization context menu and clicking Edit Filter
        await advancedFilter.openAdvancedFilterEditor('Visualization 1');
        // And I click New Qualification Button to open New Qualification editor
        await advancedFilter.openNewQualificationEditor();
        // And I close Based On dropdown
        await advancedFilter.closeAllDropDown();
        // And I open Based On dropdown
        await advancedFilter.openBasedOnDropDown();
        // And I choose attribute "Supplier" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Supplier');
        // Then new Qualification Title should be changed to "Supplier"
        await advancedFilter.checkNewQualificationTitle('Supplier');
        // And Choose Elements By dropdown should exist
        await advancedFilter.checkChooseElementsByDropdown();

        // When I open Choose Elements By dropdown
        await advancedFilter.openChooseElementsByDropDown();
        // And I select "Selecting in list" from Choose Elements By dropdown
        await advancedFilter.doSelectionOnChooseElementsByDropdown('Selecting in list');
        // And I select elements "20th Century Fox,ACS Innovations,BMG" from the element list in the Advanced Filter Editor
        await advancedFilter.doElementSelectionForAttributeFilter('20th Century Fox,ACS Innovations,BMG'.split(','));
        // And I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
        // Then a new advanced filter by index "1" should be created
        await advancedFilter.checkAdvancedFilterByIndex(1);

        // When I click New Qualification Button to open New Qualification editor
        await advancedFilter.openNewQualificationEditor();
        // And I choose attribute "Supplier" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Supplier');
        // And I select "Not In List" radio button
        await advancedFilter.selectInListOrNotInList('Not In List');
        // And I select elements "20th Century Fox,ACS Innovations,BMG" from the element list in the Advanced Filter Editor
        await advancedFilter.doElementSelectionForAttributeFilter('20th Century Fox,ACS Innovations,BMG'.split(','));
        // And I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
        // Then a new advanced filter by index "2" should be created
        await advancedFilter.checkAdvancedFilterByIndex(2);

        // When I click New Qualification Button to open New Qualification editor
        await advancedFilter.openNewQualificationEditor();
        // And I choose attribute "Supplier" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Supplier');
        // And I open Choose Elements By dropdown
        await advancedFilter.openChooseElementsByDropDown();
        // And I select "Qualification on" from Choose Elements By dropdown
        await advancedFilter.doSelectionOnChooseElementsByDropdown('Qualification on');
        // And I select "Equals" as the attribute filter operator
        await advancedFilter.selectAttributeFilterOperator('Equals');
        // And I type " " for Value input
        await advancedFilter.typeValueInput(' ');
        // And I open Attribute dropdown
        await advancedFilter.openAttributeDropdown();
        // And I select "Supplier" for Attribute dropdown
        await advancedFilter.doSelectionOnAttributeDropdown('Supplier');
        // And I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
        // Then a new advanced filter by index "3" should be created
        await advancedFilter.checkAdvancedFilterByIndex(3);

        // When I click New Qualification Button to open New Qualification editor
        await advancedFilter.openNewQualificationEditor();
        // And I choose metric "Cost" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Cost');
        // And I open Output Level dropdown
        await advancedFilter.openOutputLevelDropdown();
        // And I select "Dataset level" from Output Level dropdown
        await advancedFilter.doSelectionOnOutputLevelDropDown('Dataset level');
        // And I select by value "Equals" as the metric filter operator
        await advancedFilter.selectMetricFilterOperatorByValue('Equals');
        // And I type " " for Value input
        await advancedFilter.typeValueInput(' ');
        // And I open Metric dropdown
        await advancedFilter.openMetricDropdown();
        // And I select "Revenue" for Metric dropdown
        await advancedFilter.doSelectionOnMetricDropdown('Revenue');
        // And I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
        // Then a new advanced filter by index "4" should be created
        await advancedFilter.checkAdvancedFilterByIndex(4);

        // When I click New Qualification Button to open New Qualification editor
        await advancedFilter.openNewQualificationEditor();
        // And I choose metric "Cost" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Cost');
        // And I open Output Level dropdown
        await advancedFilter.openOutputLevelDropdown();
        // And I select "Visualization level" from Output Level dropdown
        await advancedFilter.doSelectionOnOutputLevelDropDown('Visualization level');
        // And I open Operator dropdown
        await advancedFilter.openOperatorDropDown();
        await advancedFilter.openOperatorDropDown();
        // And I select "By Rank" from Operator dropdown
        await advancedFilter.doSelectionOnOperatorDropdown('By Rank');
        // And I select by rank "Highest" as the metric filter operator
        await advancedFilter.selectMetricFilterOperatorByRank('Highest');
        // And I type "10000" for Value input
        await advancedFilter.typeValueInput('10000');
        // And I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
        // Then a new advanced filter by index "5" should be created
        await advancedFilter.checkAdvancedFilterByIndex(5);
        await takeScreenshotByElement(advancedFilter.AdvancedFilterEditor, 'Advanced Filter Editor', 'TC17730_1_1');

        // When I click Save to save the change and close advanced filter editor
        await advancedFilter.clickSaveOnAdvancedFilterEditor();
        // Then The dossier's screenshot "Apply_Five_Filters" should match the baselines
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Apply_Five_Filters',
            'TC17730_1_2'
        );
    });

    it('[TC17730_2] Advanced filter sanity testing', async () => {
        // Edit dossier by its ID "2C30131411EA07D97A040080EFD53258"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > Normal Grid > advanced_filter_normal_grid
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.NormalGridAdvancedFilter.project.id,
            dossierId: gridConstants.NormalGridAdvancedFilter.id,
        });
        await browser.pause(3000);
        await baseContainer.clickContainerByScript('Visualization 1');

        // # create a new attribute advanced filter
        // And I open advanced filter editor for "Visualization 1" by clicking visualization context menu and clicking Edit Filter
        await advancedFilter.openAdvancedFilterEditor('Visualization 1');
        // And I click New Qualification Button to open New Qualification editor
        await advancedFilter.openNewQualificationEditor();
        // And I choose attribute "Item Category" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Item Category');
        // Then new Qualification Title should be changed to "Item Category"
        await advancedFilter.checkNewQualificationTitle('Item Category');
        // And Choose Elements By dropdown should exist
        await advancedFilter.checkChooseElementsByDropdown();

        // When I open Choose Elements By dropdown
        await advancedFilter.openChooseElementsByDropDown();
        // And I select "Selecting in list" from Choose Elements By dropdown
        await advancedFilter.doSelectionOnChooseElementsByDropdown('Selecting in list');
        // And I select elements "Action Movies,Alternative Movies,Cameras" from the element list in the Advanced Filter Editor
        await advancedFilter.doElementSelectionForAttributeFilter(
            'Action Movies,Alternative Movies,Cameras'.split(',')
        );
        // And I type "music" on New Qualification Editor search box
        await advancedFilter.typeOnSearchBox('music');
        // Then all results should contain "music"
        await advancedFilter.checkAttributeElement('music');
        // And I pause execution for 1 seconds
        await browser.pause(1000);

        // When I select elements "Country Music" from the element list in the Advanced Filter Editor
        await advancedFilter.doElementSelectionForAttributeFilter(['Country Music']);
        // And I toggle View Selected
        await advancedFilter.toggleViewSelected();
        // And I click on Clear All to clear all selections
        await advancedFilter.clickClearAllButton();
        // Then "Country Music" should be deselected
        await advancedFilter.checkDeselectedAttributeElement('Country Music');

        // When I clear search criteria
        await advancedFilter.clearSearchBox();
        // And I toggle View Selected
        await advancedFilter.toggleViewSelected();
        // And I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
        // Then a new advanced filter by index "1" should be created
        await advancedFilter.checkAdvancedFilterByIndex(1);

        // When I click Save to save the change and close advanced filter editor
        await advancedFilter.clickSaveOnAdvancedFilterEditor();
        // Then The dossier's screenshot "Item_Category_Filter" should match the baselines
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Item_Category_Filter',
            'TC17730_2_1'
        );

        // When I hover on "Visualization 1" container
        await vizPanelForGrid.hoverOnVisualizationContainer('Visualization 1');
        // And I click on the filter icon
        await advancedFilter.hoverAndClickFilterIcon();
        // And I click on Advanced Qualification to open the advanced filter editor
        await advancedFilter.clickAdvancedQualificationButton();
        // And I hover on the advanced filter by index "1"
        await advancedFilter.hoverOnFilterItemByIndex(1);
        // And I click on Create a Set button by index "1"
        await advancedFilter.clickCreateASetButtonByIndex(1);
        // And I select "Supplier" from Create a Set attribute list
        await advancedFilter.clickAttributeOnCreateASetAttributeList('Supplier');
        // And I click OK to save the set setting and close the dialog
        await advancedFilter.createASet();
        // And I click Save to save the change and close advanced filter editor
        await advancedFilter.clickSaveOnAdvancedFilterEditor();
        // Then The dossier's screenshot "Create_A_Set" should match the baselines
        await takeScreenshotByElement(vizPanelForGrid.getContainer('Visualization 1'), 'Create_A_Set', 'TC17730_2_2');

        // # create a new metric filter
        // When I hover on "Visualization 1" container
        await vizPanelForGrid.hoverOnVisualizationContainer('Visualization 1');
        // And I click on the filter icon
        await advancedFilter.hoverAndClickFilterIcon();
        // And I click on Advanced Qualification to open the advanced filter editor
        await advancedFilter.clickAdvancedQualificationButton();
        // And I click New Qualification Button to open New Qualification editor
        await advancedFilter.openNewQualificationEditor();
        // And I choose metric "Cost" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Cost');
        // And I select by value "Greater than" as the metric filter operator
        await advancedFilter.selectMetricFilterOperatorByValue('Greater than');
        // And I type "2000000" for Value input
        await advancedFilter.typeValueInput('2000000');
        // And I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
        // Then a new advanced filter by index "2" should be created
        await advancedFilter.checkAdvancedFilterByIndex(2);

        // When I click Save to save the change and close advanced filter editor
        await advancedFilter.clickSaveOnAdvancedFilterEditor();
        // Then The dossier's screenshot "Cost_Filter" should match the baselines
        await takeScreenshotByElement(vizPanelForGrid.getContainer('Visualization 1'), 'Cost_Filter', 'TC17730_2_3');

        // When I hover on "Visualization 1" container
        await vizPanelForGrid.hoverOnVisualizationContainer('Visualization 1');
        // And I click on the filter icon
        await advancedFilter.hoverAndClickFilterIcon();
        // And I click on Advanced Qualification to open the advanced filter editor
        await advancedFilter.clickAdvancedQualificationButton();
        // And I drag the advanced filter by index "2" and drop on the advanced filter by index "1"
        let movingElement = await advancedFilter.getFilterItemByIndex(2);
        let targetElement = await advancedFilter.getFilterItemByIndex(1);
        await advancedFilter.dragFilterAndWait(movingElement, targetElement);
        // And I click advanced filter by index "2" to edit it
        await advancedFilter.editAdvancedFilter(2);
        // And I open Operator dropdown
        await advancedFilter.openOperatorDropDown();
        // And I select "By Rank" from Operator dropdown
        await advancedFilter.doSelectionOnOperatorDropdown('By Rank');
        // And I select by rank "Highest" as the metric filter operator
        await advancedFilter.selectMetricFilterOperatorByRank('Highest');
        // And I clear Value input
        await advancedFilter.clearValueInput();
        // And I type "5" for Value input
        await advancedFilter.typeValueInput('5');
        // And I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
        // And I click Save to save the change and close advanced filter editor
        await advancedFilter.clickSaveOnAdvancedFilterEditor();
        // And I hover on "Visualization 1" container
        await vizPanelForGrid.hoverOnVisualizationContainer('Visualization 1');
        // And I click on the filter icon
        await advancedFilter.hoverAndClickFilterIcon();
        // And I click on Advanced Qualification to open the advanced filter editor
        await advancedFilter.clickAdvancedQualificationButton();
        // And I open logical operator dialog "1" and Change "AND" to "OR"
        await advancedFilter.openLogicalOperatorDialog(1, 'AND');
        await advancedFilter.changeLogicalOperatorBetweenFilters('OR');
        // And I click Save to save the change and close advanced filter editor
        await advancedFilter.clickSaveOnAdvancedFilterEditor();
        // Then The dossier's screenshot "Change_Metric_Filter" should match the baselines
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Change_Metric_Filter',
            'TC17730_2_4'
        );
    });

    it('[TC59997] DE150699 XSS for In/Not In operator', async () => {
        // Edit dossier by its ID "2C30131411EA07D97A040080EFD53258"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > Normal Grid > advanced_filter_normal_grid
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.NormalGridAdvancedFilter.project.id,
            dossierId: gridConstants.NormalGridAdvancedFilter.id,
        });
        await browser.pause(3000);
        await baseContainer.clickContainerByScript('Visualization 1');

        // # create a new attribute advanced filter
        // And I open advanced filter editor for "Visualization 1" by clicking visualization context menu and clicking Edit Filter
        await advancedFilter.openAdvancedFilterEditor('Visualization 1');
        // And I click New Qualification Button to open New Qualification editor
        await advancedFilter.openNewQualificationEditor();
        // And I open Based On dropdown
        await advancedFilter.openBasedOnDropDown();
        // And I choose attribute "Supplier" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Supplier');
        // Then new Qualification Title should be changed to "Supplier"
        await advancedFilter.checkNewQualificationTitle('Supplier');
        // And Choose Elements By dropdown should exist
        await advancedFilter.checkChooseElementsByDropdown();
        // When I open Choose Elements By dropdown
        await advancedFilter.openChooseElementsByDropDown();
        // And I select "Qualification on" from Choose Elements By dropdown
        await advancedFilter.doSelectionOnChooseElementsByDropdown('Qualification on');
        // And I select "In" as the attribute filter operator
        await advancedFilter.selectAttributeFilterOperator('In');
        // And I type "“><img src=x onerror=alert('PAWNED_BY_1080A;)') onclick=a>" for Value input
        await advancedFilter.typeValueInput("“><img src=x onerror=alert('PAWNED_BY_1080A;)' onclick=a>");
        // And I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
        // Then a new advanced filter by index "1" should be created
        await advancedFilter.checkAdvancedFilterByIndex(1);

        // # Not In
        // And I click New Qualification Button to open New Qualification editor
        await advancedFilter.openNewQualificationEditor();
        // And I close Based On dropdown
        // await advancedFilter.closeBasedOnDropDown();
        // And I open Based On dropdown
        await advancedFilter.openBasedOnDropDown();
        // And I choose attribute "Supplier" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Supplier');
        // Then new Qualification Title should be changed to "Supplier"
        await advancedFilter.checkNewQualificationTitle('Supplier');
        // And Choose Elements By dropdown should exist
        await advancedFilter.checkChooseElementsByDropdown();
        // When I open Choose Elements By dropdown
        await advancedFilter.openChooseElementsByDropDown();
        // And I select "Qualification on" from Choose Elements By dropdown
        await advancedFilter.doSelectionOnChooseElementsByDropdown('Qualification on');
        // And I select "Not In" as the attribute filter operator
        await advancedFilter.selectAttributeFilterOperator('Not In');
        // And I type "“><img src=x onerror=alert('PAWNED_BY_1080A;)') onclick=a>" for Value input
        await advancedFilter.typeValueInput("“><img src=x onerror=alert('PAWNED_BY_1080A;)' onclick=a>");
        // And I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
        // Then a new advanced filter by index "2" should be created
        await advancedFilter.checkAdvancedFilterByIndex(2);
    });

    it('[TC55955] Advanced Filter Editor in Dossier does not reflect attribute and metric alias names', async () => {
        // Edit dossier by its ID "2C30131411EA07D97A040080EFD53258"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > Normal Grid > advanced_filter_normal_grid
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.NormalGridAdvancedFilter.project.id,
            dossierId: gridConstants.NormalGridAdvancedFilter.id,
        });
        await browser.pause(3000);
        // When I rename "attribute" named "Item Category" from dataset "retail-sample-data.xls" as "Item Category Dataset Alias"
        await datasetsPanel.renameObject('Item Category', 'Item Category Dataset Alias');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then The datasets panel should have "attribute" named "Item Category Dataset Alias" in dataset "retail-sample-data.xls"
        await since(
            'The datasets panel should have "attribute" named "Item Category Dataset Alias" in dataset "retail-sample-data.xls"'
        )
            .expect(
                await datasetsPanel
                    .getObjectFromDataset('Item Category Dataset Alias', 'attribute', 'retail-sample-data.xls')
                    .isDisplayed()
            )
            .toBe(true);
        // And the grid cell in visualization "Visualization 1" at "1", "1" has text "Item Category Dataset Alias"
        await since(
            'the grid cell in visualization "Visualization 1" at "1", "1" has text "Item Category Dataset Alias", while we got #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellTextByPosition(1, 1, 'Visualization 1'))
            .toBe('Item Category Dataset Alias');

        // When I rename "attribute" named "Supplier" from dataset "retail-sample-data.xls" as "Supplier Dataset Alias"
        await datasetsPanel.renameObject('Supplier', 'Supplier Dataset Alias');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then The datasets panel should have "attribute" named "Supplier Dataset Alias" in dataset "retail-sample-data.xls"
        await since(
            'The datasets panel should have "attribute" named "Supplier Dataset Alias" in dataset "retail-sample-data.xls"'
        )
            .expect(
                await datasetsPanel
                    .getObjectFromDataset('Supplier Dataset Alias', 'attribute', 'retail-sample-data.xls')
                    .isDisplayed()
            )
            .toBe(true);
        // And the grid cell in visualization "Visualization 1" at "1", "2" has text "Supplier Dataset Alias"
        await since('the grid cell in visualization "Visualization 1" at "1", "2" has text "Supplier Dataset Alias"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(1, 2, 'Visualization 1'))
            .toBe('Supplier Dataset Alias');

        // When I rename "metric" named "Cost" from dataset "retail-sample-data.xls" as "Cost Dataset Alias"
        await datasetsPanel.renameObject('Cost', 'Cost Dataset Alias');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then The datasets panel should have "metric" named "Cost Dataset Alias" in dataset "retail-sample-data.xls"
        await since(
            'The datasets panel should have "metric" named "Cost Dataset Alias" in dataset "retail-sample-data.xls"'
        )
            .expect(
                await datasetsPanel
                    .getObjectFromDataset('Cost Dataset Alias', 'metric', 'retail-sample-data.xls')
                    .isDisplayed()
            )
            .toBe(true);
        // And the grid cell in visualization "Visualization 1" at "1", "3" has text "Cost Dataset Alias"
        await since('the grid cell in visualization "Visualization 1" at "1", "3" has text "Cost Dataset Alias"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(1, 3, 'Visualization 1'))
            .toBe('Cost Dataset Alias');

        // When I open advanced filter editor for "Visualization 1" by clicking visualization context menu and clicking Edit Filter
        await baseContainer.clickContainerByScript('Visualization 1');
        await advancedFilter.openAdvancedFilterEditor('Visualization 1');
        // And I click New Qualification Button to open New Qualification editor
        await advancedFilter.openNewQualificationEditor();
        // And I choose attribute "Item Category Dataset Alias" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Item Category Dataset Alias');
        // Then new Qualification Title should be changed to "Item Category Dataset Alias"
        await advancedFilter.checkNewQualificationTitle('Item Category Dataset Alias');
        // When I open Choose Elements By dropdown
        await advancedFilter.openChooseElementsByDropDown();
        // And I select "Selecting in list" from Choose Elements By dropdown
        await advancedFilter.doSelectionOnChooseElementsByDropdown('Selecting in list');
        // And I select "Not In List" radio button
        await advancedFilter.selectInListOrNotInList('Not In List');
        // And I select elements "Action Movies,Alternative Movies" from the element list in the Advanced Filter Editor
        await advancedFilter.doElementSelectionForAttributeFilter('Action Movies,Alternative Movies'.split(','));
        // And I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
        // Then a new advanced filter by index "1" should be created
        await advancedFilter.checkAdvancedFilterByIndex(1);
        // And The advanced filter condition by index "1" should display the first "attribute" as "Item Category Dataset Alias"
        let el = await advancedFilter.getConditionObject(1, 'attr', 'Item Category Dataset Alias');
        await expect(await el.isDisplayed()).toBe(true);

        // When I click New Qualification Button to open New Qualification editor
        await advancedFilter.openNewQualificationEditor();
        // And I choose attribute "Item Category Dataset Alias" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Item Category Dataset Alias');
        // Then new Qualification Title should be changed to "Item Category Dataset Alias"
        await advancedFilter.checkNewQualificationTitle('Item Category Dataset Alias');
        // When I open Choose Elements By dropdown
        await advancedFilter.openChooseElementsByDropDown();
        // And I select "Qualification on" from Choose Elements By dropdown
        await advancedFilter.doSelectionOnChooseElementsByDropdown('Qualification on');
        // And I select "Equals" as the attribute filter operator
        await advancedFilter.selectAttributeFilterOperator('Equals');
        // And I open Attribute dropdown
        await advancedFilter.openAttributeDropdown();
        // And I select "Supplier Dataset Alias" for Attribute dropdown
        await advancedFilter.doSelectionOnAttributeDropdown('Supplier Dataset Alias');
        // And I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
        // Then a new advanced filter by index "2" should be created
        await advancedFilter.checkAdvancedFilterByIndex(2);
        // And The advanced filter condition by index "2" should display the first "attribute" as "Item Category Dataset Alias"
        el = await advancedFilter.getConditionObject(2, 'attr', 'Supplier Dataset Alias');
        await expect(await el.isDisplayed()).toBe(
            true,
            `The advanced filter condition by index "2" should display the first "attribute" as "Item Category Dataset Alias"`
        );
        // And The advanced filter condition by index "2" should display the first "attribute" as "Supplier Dataset Alias"
        el = await advancedFilter.getConditionObject(2, 'attr', 'Item Category Dataset Alias');
        await expect(await el.isDisplayed()).toBe(
            true,
            `The advanced filter condition by index "2" should display the first "attribute" as "Supplier Dataset Alias"`
        );

        // When  I click New Qualification Button to open New Qualification editor
        await advancedFilter.openNewQualificationEditor();
        // And I choose attribute "Month" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Month');
        // Then new Qualification Title should be changed to "Month"
        await advancedFilter.checkNewQualificationTitle('Month');
        // And I select elements "Jan,Feb" from the element list in the Advanced Filter Editor
        await advancedFilter.doElementSelectionForAttributeFilter('Jan,Feb'.split(','));
        // And I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
        // Then a new advanced filter by index "3" should be created
        await advancedFilter.checkAdvancedFilterByIndex(3);

        // When I hover on the advanced filter by index "3"
        await advancedFilter.hoverOnFilterItemByIndex(3);
        // And I click on Create a Set button by index "3"
        await advancedFilter.clickCreateASetButtonByIndex(3);
        // And I select "Supplier Dataset Alias" from Create a Set attribute list
        await advancedFilter.clickAttributeOnCreateASetAttributeList('Supplier Dataset Alias');
        // And I click OK to save the set setting and close the dialog
        await advancedFilter.createASet();
        // Then The advanced filter condition by index "3" should display the first "attribute" as "Month"
        el = await advancedFilter.getConditionObject(3, 'attr', 'Month');
        await expect(await el.isDisplayed()).toBe(
            true,
            `The advanced filter condition by index "3" should display the first "attribute" as "Month"`
        );
        // And The set by index "3" should display as Set of "Supplier Dataset Alias"
        el = await advancedFilter.getSetObject(3, 'Supplier Dataset Alias'.replace(/ /g, '\u00A0'));
        await expect(await el.isDisplayed()).toBe(
            true,
            `The set by index "3" should display as Set of "Supplier Dataset Alias"`
        );

        // When I click New Qualification Button to open New Qualification editor
        await advancedFilter.openNewQualificationEditor();
        // And I choose metric "Cost Dataset Alias" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Cost Dataset Alias');
        // And I select by value "Greater than" as the metric filter operator
        await advancedFilter.selectMetricFilterOperatorByValue('Greater than');
        // And I open Output Level dropdown
        await advancedFilter.openOutputLevelDropdown();
        // And I select "Dataset level" from Output Level dropdown
        await advancedFilter.doSelectionOnOutputLevelDropDown('Dataset level');
        // And I type "10000" for Value input
        await advancedFilter.typeValueInput('10000');
        // And I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
        // Then a new advanced filter by index "4" should be created
        await advancedFilter.checkAdvancedFilterByIndex(4);
        // And The advanced filter condition by index "4" should display the first "metric" as "Cost Dataset Alias"
        el = await advancedFilter.getConditionObject(4, 'metric', 'Cost Dataset Alias');
        await expect(await el.isDisplayed()).toBe(
            true,
            `The advanced filter condition by index "4" should display the first "metric" as "Cost Dataset Alias"`
        );

        // When I click New Qualification Button to open New Qualification editor
        await advancedFilter.openNewQualificationEditor();
        // And I choose metric "Cost Dataset Alias" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Cost Dataset Alias');
        // And I open Output Level dropdown
        await advancedFilter.openOutputLevelDropdown();
        // And I select "Dataset level" from Output Level dropdown
        await advancedFilter.doSelectionOnOutputLevelDropDown('Visualization level');
        // And I select by value "Equals" as the metric filter operator
        await advancedFilter.selectMetricFilterOperatorByValue('Equals');
        // #And I type "" for Value input
        await advancedFilter.typeValueInput(' ');
        // And I open Metric dropdown
        await advancedFilter.openMetricDropdown();
        // And I select "Revenue" for Metric dropdown
        await advancedFilter.doSelectionOnMetricDropdown('Revenue');
        // And I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
        // Then a new advanced filter by index "5" should be created
        await advancedFilter.checkAdvancedFilterByIndex(5);
        // And The advanced filter condition by index "5" should display the first "metric" as "Cost Dataset Alias"
        el = await advancedFilter.getConditionObject(5, 'metric', 'Cost Dataset Alias');
        await expect(await el.isDisplayed()).toBe(
            true,
            `The advanced filter condition by index "5" should display the first "metric" as "Cost Dataset Alias"`
        );
        // And The advanced filter condition by index "5" should display the second "metric" as "Revenue"
        el = await advancedFilter.getConditionObject(5, 'm2', 'Revenue');
        await expect(await el.isDisplayed()).toBe(
            true,
            `The advanced filter condition by index "4" should display the second "metric" as "Revenue"`
        );

        // When I click New Qualification Button to open New Qualification editor
        await advancedFilter.openNewQualificationEditor();
        // And I choose metric "Revenue" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Revenue');
        // And I open Output Level dropdown
        await advancedFilter.openOutputLevelDropdown();
        // And I select "Visualization level" from Output Level dropdown
        await advancedFilter.doSelectionOnOutputLevelDropDown('Visualization level');
        // And I select by value "Equals" as the metric filter operator
        await advancedFilter.selectMetricFilterOperatorByValue('Equals');
        // #And I type "" for Value input
        await advancedFilter.typeValueInput(' ');
        // And I open Metric dropdown
        await advancedFilter.openMetricDropdown();
        // And I select "Cost Dataset Alias" for Metric dropdown
        await advancedFilter.doSelectionOnMetricDropdown('Cost Dataset Alias');
        // And I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
        // Then a new advanced filter by index "6" should be created
        await advancedFilter.checkAdvancedFilterByIndex(6);
        // And The advanced filter condition by index "6" should display the first "metric" as "Revenue"
        el = await advancedFilter.getConditionObject(6, 'metric', 'Revenue');
        await expect(await el.isDisplayed()).toBe(true);
        // And The advanced filter condition by index "6" should display the second "metric" as "Cost Dataset Alias"
        el = await advancedFilter.getConditionObject(6, 'm2', 'Cost Dataset Alias');
        await expect(await el.isDisplayed()).toBe(
            true,
            `The advanced filter condition by index "6" should display the second "metric" as "Cost Dataset Alias"`
        );

        // When I click New Qualification Button to open New Qualification editor
        await advancedFilter.openNewQualificationEditor();
        // And I choose metric "Revenue" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Revenue');
        // And I open Output Level dropdown
        await advancedFilter.openOutputLevelDropdown();
        // And I select "Visualization level" from Output Level dropdown
        await advancedFilter.doSelectionOnOutputLevelDropDown('Visualization level');
        // And I select by value "Less than" as the metric filter operator
        await advancedFilter.selectMetricFilterOperatorByValue('Less than');
        // And I type "2000000" for Value input
        await advancedFilter.typeValueInput('2000000');
        // And I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
        // Then a new advanced filter by index "7" should be created
        await advancedFilter.checkAdvancedFilterByIndex(7);
        // And The advanced filter condition by index "7" should display the first "metric" as "Revenue"
        el = await advancedFilter.getConditionObject(7, 'metric', 'Revenue');
        await expect(await el.isDisplayed()).toBe(true);

        // When I click Save to save the change and close advanced filter editor
        await advancedFilter.clickSaveOnAdvancedFilterEditor();

        // When I rename "attribute" named "Month" from dataset "retail-sample-data.xls" as "Month Dataset Alias"
        await datasetsPanel.renameObject('Month', 'Month Dataset Alias');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then The datasets panel should have "attribute" named "Month Dataset Alias" in dataset "retail-sample-data.xls"
        // await since(
        //     'The datasets panel should have "attribute" named "Month Dataset Alias" in dataset "retail-sample-data.xls"'
        // )
        //     .expect(
        //         await datasetsPanel
        //             .getObjectFromDataset('Month Dataset Alias', 'attribute', 'retail-sample-data.xls')
        //             .isDisplayed()
        //     )
        //     .toBe(true);

        // When I open advanced filter editor for "Visualization 1" by clicking visualization context menu and clicking Edit Filter
        await baseContainer.clickContainerByScript('Visualization 1');
        await advancedFilter.openAdvancedFilterEditor('Visualization 1');
        // take screenshot of advanced filter editor
        await takeScreenshotByElement(
            advancedFilter.AdvancedFilterEditor,
            'Advanced Filter Editor renamed from dataset panel',
            'TC55955_1'
        );

        // When I click Save to save the change and close advanced filter editor
        await advancedFilter.clickSaveOnAdvancedFilterEditor();
        // And I click on container "Visualization 1" to select it
        await baseContainer.clickContainerByScript('Visualization 1');
        // And I rename the "attribute" from "Item Category Dataset Alias" into "Item Category Template Alias" in the Editor Panel
        await editorPanelForGrid.renameObject(
            'Item Category Dataset Alias',
            'attribute',
            'Item Category Template Alias'
        );
        // And I rename the "attribute" from "Supplier Dataset Alias" into "Supplier Template Alias" in the Editor Panel
        await editorPanelForGrid.renameObject('Supplier Dataset Alias', 'attribute', 'Supplier Template Alias');
        // And I rename the "metric" from "Cost Dataset Alias" into "Cost Template Alias" in the Editor Panel
        await editorPanelForGrid.renameObject('Cost Dataset Alias', 'metric', 'Cost Template Alias');
        // And I rename the "metric" from "Revenue" into "Revenue Template Alias" in the Editor Panel
        await editorPanelForGrid.renameObject('Revenue', 'metric', 'Revenue Template Alias');
        // And I rename "attribute" named "Month Dataset Alias" from dataset "retail-sample-data.xls" as "Month Dataset New Alias"
        await datasetsPanel.renameObject('Month Dataset Alias', 'Month Dataset New Alias');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await baseContainer.clickContainerByScript('Visualization 1');
        // When I open advanced filter editor for "Visualization 1" by clicking visualization context menu and clicking Edit Filter
        await advancedFilter.openAdvancedFilterEditor('Visualization 1');
        // take screenshot of advanced filter editor
        await takeScreenshotByElement(
            advancedFilter.AdvancedFilterEditor,
            'Advanced Filter Editor Renamed from editor panel',
            'TC55955_2'
        );
    });

    it('[TC41285] Advanced Filtering in compound grid', async () => {
        // Edit dossier by its ID "3BD7E3C911EB12410DBE0080EF259CBB"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > Compound Grid > TC41285 Advanced Filter Testing in Compound Grid
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.CoumpoundGridAdvancedFilter.project.id,
            dossierId: gridConstants.CoumpoundGridAdvancedFilter.id,
        });
        // When I click on column set "Column Set 3" in Columns section
        await vizPanelForGrid.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await vizPanelForGrid.clickOnColumnSet('Column Set 3');
        // #Add advacned filter conditions on the existing column sets
        // And I open advanced filter editor for "Visualization 1" by clicking visualization context menu and clicking Edit Filter
        await advancedFilter.openAdvancedFilterEditor('Visualization 1');
        // And I click New Qualification Button to open New Qualification editor
        await advancedFilter.openNewQualificationEditor();
        // And I choose attribute "Region" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Region');
        // Then new Qualification Title should be changed to "Region"
        await advancedFilter.checkNewQualificationTitle('Region');
        // And Choose Elements By dropdown should exist
        await advancedFilter.checkChooseElementsByDropdown();
        // When I open Choose Elements By dropdown
        await advancedFilter.openChooseElementsByDropDown();
        // And I select "Selecting in list" from Choose Elements By dropdown
        await advancedFilter.doSelectionOnChooseElementsByDropdown('Selecting in list');
        // And I select "Not In List" radio button
        await advancedFilter.selectInListOrNotInList('Not In List');
        // And I select elements "Web" from the element list in the Advanced Filter Editor
        await advancedFilter.doElementSelectionForAttributeFilter('Web'.split(','));
        // And I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
        // Then a new advanced filter by index "1" should be created
        await advancedFilter.checkAdvancedFilterByIndex(1);
        // When I click Save to save the change and close advanced filter editor
        await advancedFilter.clickSaveOnAdvancedFilterEditor();
        // Then the grid cell in visualization "Visualization 1" at "17", "3" has text " "
        await since('the grid cell in visualization "Visualization 1" at "17", "3" has text " "')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(17, 3, 'Visualization 1'))
            .toBe(' ');
        // And the grid cell in visualization "Visualization 1" at "17", "4" has text "$150,912"
        await since('the grid cell in visualization "Visualization 1" at "17", "4" has text "$150,912"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(17, 4, 'Visualization 1'))
            .toBe('$150,912');
        // take secreenshot of "Visualization 1"
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Visualization 1 after advanced filter 1',
            'TC41285_1'
        );

        // When I open advanced filter editor for "Visualization 1" by clicking visualization context menu and clicking Edit Filter
        await advancedFilter.openAdvancedFilterEditor('Visualization 1');
        // And I click New Qualification Button to open New Qualification editor
        await advancedFilter.openNewQualificationEditor();
        // And I choose attribute "Call Center" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Call Center');
        // Then new Qualification Title should be changed to "Call Center"
        await advancedFilter.checkNewQualificationTitle('Call Center');
        // When I select elements "Atlanta,San Diego,San Francisco,Miami,Seattle,Boston,New York" from the element list in the Advanced Filter Editor
        await advancedFilter.doElementSelectionForAttributeFilter(
            'Atlanta,San Diego,San Francisco,Miami,Seattle,Boston,New York'.split(',')
        );
        // And I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
        // Then a new advanced filter by index "2" should be created
        await advancedFilter.checkAdvancedFilterByIndex(2);
        // When I click Save to save the change and close advanced filter editor
        await advancedFilter.clickSaveOnAdvancedFilterEditor();
        // Then the grid cell in visualization "Visualization 1" at "16", "2" has text " "
        await since('the grid cell in visualization "Visualization 1" at "16", "2" has text " "')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(16, 2, 'Visualization 1'))
            .toBe(' ');
        // And the grid cell in visualization "Visualization 1" at "16", "3" has text "$46,334"
        await since('the grid cell in visualization "Visualization 1" at "16", "3" has text "$46,334"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(16, 3, 'Visualization 1'))
            .toBe('$46,334');
        // And the grid cell in visualization "Visualization 1" at "3", "3" has text " "
        await since('the grid cell in visualization "Visualization 1" at "3", "3" has text " "')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 3, 'Visualization 1'))
            .toBe(' ');
        // And the grid cell in visualization "Visualization 1" at "3", "4" has text "$218,990"
        await since('the grid cell in visualization "Visualization 1" at "3", "4" has text "$218,990"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 4, 'Visualization 1'))
            .toBe('$218,990');
        // And the grid cell in visualization "Visualization 1" at "7", "3" has text "$224,495"
        await since('the grid cell in visualization "Visualization 1" at "7", "3" has text "$224,495"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(7, 3, 'Visualization 1'))
            .toBe('$224,495');
        // And the grid cell in visualization "Visualization 1" at "7", "4" has text "$74,560"
        await since('the grid cell in visualization "Visualization 1" at "7", "4" has text "$74,560"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(7, 4, 'Visualization 1'))
            .toBe('$74,560');
        // And the grid cell in visualization "Visualization 1" at "9", "3" has text "$156,330"
        await since('the grid cell in visualization "Visualization 1" at "9", "3" has text "$156,330"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(9, 3, 'Visualization 1'))
            .toBe('$156,330');
        // And the grid cell in visualization "Visualization 1" at "15", "3" has text "$449,553"
        await since('the grid cell in visualization "Visualization 1" at "15", "3" has text "$449,553"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(15, 3, 'Visualization 1'))
            .toBe('$449,553');
        // take secreenshot of "Visualization 1"
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Visualization 1 after advanced filter 2',
            'TC41285_2'
        );

        // When I open advanced filter editor for "Visualization 1" by clicking visualization context menu and clicking Edit Filter
        await advancedFilter.openAdvancedFilterEditor('Visualization 1');
        // And I click New Qualification Button to open New Qualification editor
        await advancedFilter.openNewQualificationEditor();
        // And I choose metric "Profit" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Profit');
        // And I select by value "Greater than" as the metric filter operator
        await advancedFilter.selectMetricFilterOperatorByValue('Greater than');
        // And I type "500000" for Value input
        await advancedFilter.typeValueInput('500000');
        // And I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
        // Then a new advanced filter by index "3" should be created
        await advancedFilter.checkAdvancedFilterByIndex(3);
        // When I click Save to save the change and close advanced filter editor
        await advancedFilter.clickSaveOnAdvancedFilterEditor();
        // Then the grid cell in visualization "Visualization 1" at "7", "3" has text " "
        await since('the grid cell in visualization "Visualization 1" at "7", "3" has text " "')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(7, 3, 'Visualization 1'))
            .toBe(' ');
        // And the grid cell in visualization "Visualization 1" at "7", "4" has text "$74,560"
        await since('the grid cell in visualization "Visualization 1" at "7", "4" has text "$74,560"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(7, 4, 'Visualization 1'))
            .toBe('$74,560');
        // And the grid cell in visualization "Visualization 1" at "8", "2" has text "$1,076,237"
        await since('the grid cell in visualization "Visualization 1" at "8", "2" has text "$1,076,237"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(8, 2, 'Visualization 1'))
            .toBe('$1,076,237');
        // And the grid cell in visualization "Visualization 1" at "9", "3" has text " "
        await since('the grid cell in visualization "Visualization 1" at "9", "3" has text " "')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(9, 3, 'Visualization 1'))
            .toBe(' ');
        // And the grid cell in visualization "Visualization 1" at "15", "3" has text " "
        await since('the grid cell in visualization "Visualization 1" at "15", "3" has text " "')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(15, 3, 'Visualization 1'))
            .toBe(' ');
        // take secreenshot of "Visualization 1"
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Visualization 1 after advanced filter 3',
            'TC41285_3'
        );

        // When I hover on "Visualization 1" container
        await vizPanelForGrid.hoverOnVisualizationContainer('Visualization 1');
        // And I click on the filter icon
        await advancedFilter.hoverAndClickFilterIcon();
        // And I click on Advanced Qualification to open the advanced filter editor
        await advancedFilter.openAdvancedFilterEditor('Visualization 1');
        // Then an advanced filter by index "1" should exist
        await advancedFilter.checkAdvancedFilterByIndex(1);
        // And an advanced filter by index "2" should exist
        await advancedFilter.checkAdvancedFilterByIndex(2);
        // And an advanced filter by index "3" should exist
        await advancedFilter.checkAdvancedFilterByIndex(3);
        // take secreenshot of "Visualization 1" advanced filter editor
        await takeScreenshotByElement(
            advancedFilter.AdvancedFilterEditor,
            'Advanced Filter Editor with 3 conditions',
            'TC41285_4'
        );

        // When I open "Column Set 1" advanced filter editor by clicking its button
        await advancedFilter.changeToAnotherColumnSetAdvancedFilterEditor('Column Set 1');
        // And I click New Qualification Button to open New Qualification editor
        await advancedFilter.openNewQualificationEditor();
        // And I choose metric "Cost" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Cost');
        // And I open Operator dropdown
        await advancedFilter.openOperatorDropDown();
        // And I select "By Rank" from Operator dropdown
        await advancedFilter.doSelectionOnOperatorDropdown('By Rank');
        // And I select by rank "Highest" as the metric filter operator
        await advancedFilter.selectMetricFilterOperatorByRank('Highest');
        // And I type "50" for Value input
        await advancedFilter.typeValueInput('50');
        // And I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
        // Then a new advanced filter by index "1" should be created
        await advancedFilter.checkAdvancedFilterByIndex(1);
        // When I click Save to save the change and close advanced filter editor
        await advancedFilter.clickSaveOnAdvancedFilterEditor();
        // Then the grid cell in visualization "Visualization 1" at "2", "2" has text "February"
        await since('the grid cell in visualization "Visualization 1" at "2", "2" has text "February"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('February');
        // And the grid cell in visualization "Visualization 1" at "3", "5" has text "$261,781"
        await since('the grid cell in visualization "Visualization 1" at "3", "5" has text "$261,781"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 5, 'Visualization 1'))
            .toBe('$261,781');
        // And the grid cell in visualization "Visualization 1" at "2", "4" has text "April"
        await since('the grid cell in visualization "Visualization 1" at "2", "4" has text "April"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(2, 4, 'Visualization 1'))
            .toBe('April');
        // And the grid cell in visualization "Visualization 1" at "5", "4" has text " "
        await since('the grid cell in visualization "Visualization 1" at "5", "4" has text " "')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(5, 4, 'Visualization 1'))
            .toBe(' ');
        // And the grid cell in visualization "Visualization 1" at "7", "6" has text " "
        await since('the grid cell in visualization "Visualization 1" at "7", "6" has text " "')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(7, 6, 'Visualization 1'))
            .toBe(' ');
        // And the grid cell in visualization "Visualization 1" at "8", "5" has text "$431,714"
        await since('the grid cell in visualization "Visualization 1" at "8", "5" has text "$431,714"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(8, 5, 'Visualization 1'))
            .toBe('$431,714');

        // take secreenshot of "Visualization 1"
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Visualization 1 after advanced filter 4',
            'TC41285_5'
        );

        // When I open advanced filter editor for "Visualization 1" by clicking visualization context menu and clicking Edit Filter
        await advancedFilter.openAdvancedFilterEditor('Visualization 1');
        // And I open "Column Set 1" advanced filter editor by clicking its button
        await advancedFilter.changeToAnotherColumnSetAdvancedFilterEditor('Column Set 1');
        // And I click New Qualification Button to open New Qualification editor
        await advancedFilter.openNewQualificationEditor();
        // And I choose attribute "Month of Year" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Month of Year');
        // Then new Qualification Title should be changed to "Month of Year"
        await advancedFilter.checkNewQualificationTitle('Month of Year');
        // When I select elements "January,March,May,August,October" from the element list in the Advanced Filter Editor
        await advancedFilter.doElementSelectionForAttributeFilter('January,March,May,August,October'.split(','));
        // And I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
        // Then a new advanced filter by index "1" should be created
        await advancedFilter.checkAdvancedFilterByIndex(1);
        // When I click Save to save the change and close advanced filter editor
        await advancedFilter.clickSaveOnAdvancedFilterEditor();
        // Then the grid cell in visualization "Visualization 1" at "2", "2" has text "March"
        await since('the grid cell in visualization "Visualization 1" at "2", "2" has text "March"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('March');
        // And the grid cell in visualization "Visualization 1" at "3", "5" has text "$264,210"
        await since('the grid cell in visualization "Visualization 1" at "3", "5" has text "$264,210"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 5, 'Visualization 1'))
            .toBe('$264,210');
        // And the grid cell in visualization "Visualization 1" at "2", "4" has text "August"
        await since('the grid cell in visualization "Visualization 1" at "2", "4" has text "August"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(2, 4, 'Visualization 1'))
            .toBe('August');
        // And the grid cell in visualization "Visualization 1" at "5", "5" has text "$193,660"
        await since('the grid cell in visualization "Visualization 1" at "5", "5" has text "$193,660"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(5, 5, 'Visualization 1'))
            .toBe('$193,660');
        // And the grid cell in visualization "Visualization 1" at "7", "6" has text "$96,208"
        await since('the grid cell in visualization "Visualization 1" at "7", "6" has text "$96,208"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(7, 6, 'Visualization 1'))
            .toBe('$96,208');
        // And the grid cell in visualization "Visualization 1" at "8", "5" has text "$506,555"
        await since('the grid cell in visualization "Visualization 1" at "8", "5" has text "$506,555"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(8, 5, 'Visualization 1'))
            .toBe('$506,555');

        // take secreenshot of "Visualization 1"
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Visualization 1 after advanced filter 5',
            'TC41285_6'
        );

        // When I open advanced filter editor for "Visualization 1" by clicking visualization context menu and clicking Edit Filter
        await advancedFilter.openAdvancedFilterEditor('Visualization 1');
        // And I open "Column Set 2" advanced filter editor by clicking its button
        await advancedFilter.changeToAnotherColumnSetAdvancedFilterEditor('Column Set 2');
        // And I click New Qualification Button to open New Qualification editor
        await advancedFilter.openNewQualificationEditor();
        // And I choose metric "Revenue" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Revenue');
        // And I select by value "Less than" as the metric filter operator
        await advancedFilter.selectMetricFilterOperatorByValue('Less than');
        // And I type "300000" for Value input
        await advancedFilter.typeValueInput('300000');
        // And I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
        // When I click Save to save the change and close advanced filter editor
        await advancedFilter.clickSaveOnAdvancedFilterEditor();
        // Then the grid cell in visualization "Visualization 1" at "3", "5" has text "$264,210"
        await since('the grid cell in visualization "Visualization 1" at "3", "5" has text "$264,210"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 5, 'Visualization 1'))
            .toBe('$264,210');
        // And the grid cell in visualization "Visualization 1" at "3", "9" has text " "
        await since('the grid cell in visualization "Visualization 1" at "3", "9" has text " "')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 9, 'Visualization 1'))
            .toBe(' ');
        // And the grid cell in visualization "Visualization 1" at "5", "5" has text "$193,660"
        await since('the grid cell in visualization "Visualization 1" at "5", "5" has text "$193,660"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(5, 5, 'Visualization 1'))
            .toBe('$193,660');
        // And the grid cell in visualization "Visualization 1" at "5", "9" has text "$235,588"
        await since('the grid cell in visualization "Visualization 1" at "5", "9" has text "$235,588"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(5, 9, 'Visualization 1'))
            .toBe('$235,588');
        // And the grid cell in visualization "Visualization 1" at "5", "10" has text " "
        await since('the grid cell in visualization "Visualization 1" at "5", "10" has text " "')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(5, 10, 'Visualization 1'))
            .toBe(' ');
        // And the grid cell in visualization "Visualization 1" at "8", "5" has text "$506,555"
        await since('the grid cell in visualization "Visualization 1" at "8", "5" has text "$506,555"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(8, 5, 'Visualization 1'))
            .toBe('$506,555');
        // And the grid cell in visualization "Visualization 1" at "8", "8" has text " "
        await since('the grid cell in visualization "Visualization 1" at "8", "8" has text " "')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(8, 8, 'Visualization 1'))
            .toBe(' ');

        // take secreenshot of "Visualization 1"
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Visualization 1 after advanced filter 6',
            'TC41285_7'
        );

        // #Add new column set in the compound grid
        // When I add a column set for the compound grid
        await vizPanelForGrid.addColumnSet();
        // Then I pause execution for 2 seconds
        await browser.pause(2000);
        // And I drag "attribute" named "Year" from dataset "New Dataset 1" to Column Set "Column Set 4" in compound grid
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ('Year', 'attribute', 'New Dataset 1', 'Column Set 4');
        // Then The editor panel should have "attribute" named "Year" on "Column Set 4" section
        await since('The editor panel should have "attribute" named "Year" on "Column Set 4" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Year', 'attribute', 'Column Set 4').isExisting())
            .toBe(true);
        // And I drag "metric" named "Gross Revenue" from dataset "New Dataset 1" to Column Set "Column Set 4" and drop it below "Year" in compound grid
        await vizPanelForGrid.dragDSObjectToColumnSetDZwithPosition(
            'Gross Revenue',
            'metric',
            'New Dataset 1',
            'Column Set 4',
            'below',
            'Year'
        );
        // Then The editor panel should have "metric" named "Gross Revenue" on "Column Set 4" section
        await since('The editor panel should have "metric" named "Gross Revenue" on "Column Set 4" section')
            .expect(
                await editorPanelForGrid.getObjectFromSection('Gross Revenue', 'metric', 'Column Set 4').isExisting()
            )
            .toBe(true);

        // When I open advanced filter editor for "Visualization 1" by clicking visualization context menu and clicking Edit Filter
        await advancedFilter.openAdvancedFilterEditor('Visualization 1');
        // And I open "Column Set 4" advanced filter editor by clicking its button
        await advancedFilter.changeToAnotherColumnSetAdvancedFilterEditor('Column Set 4');

        // When I click New Qualification Button to open New Qualification editor
        await advancedFilter.openNewQualificationEditor();
        // And I choose attribute "Year" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Year');
        // Then new Qualification Title should be changed to "Year"
        await advancedFilter.checkNewQualificationTitle('Year');
        // And Choose Elements By dropdown should exist
        await advancedFilter.checkChooseElementsByDropdown();
        // When I open Choose Elements By dropdown
        await advancedFilter.openChooseElementsByDropDown();
        // And I select "Selecting in list" from Choose Elements By dropdown
        await advancedFilter.doSelectionOnChooseElementsByDropdown('Selecting in list');
        // And I select "Not In List" radio button
        await advancedFilter.selectInListOrNotInList('Not In List');
        // And I select elements "2014" from the element list in the Advanced Filter Editor
        await advancedFilter.doElementSelectionForAttributeFilter('2014'.split(','));
        // And I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
        // Then a new advanced filter by index "1" should be created
        await advancedFilter.checkAdvancedFilterByIndex(1);

        // When I click New Qualification Button to open New Qualification editor
        await advancedFilter.openNewQualificationEditor();
        // And I choose metric "Gross Revenue" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Gross Revenue');
        // And I select by value "Between" as the metric filter operator
        await advancedFilter.selectMetricFilterOperatorByValue('Between');
        // And I type "500000" for Value input
        await advancedFilter.typeValueInput('500000');
        // And I type "1000000" for the second Value input
        await advancedFilter.typeAndInput('1000000');
        // And I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
        // Then a new advanced filter by index "2" should be created
        await advancedFilter.checkAdvancedFilterByIndex(2);

        // When I click Save to save the change and close advanced filter editor
        await advancedFilter.clickSaveOnAdvancedFilterEditor();
        // Then I pause execution for 3 seconds
        await browser.pause(3000);
        // #verify the other column sets are not affected by the new condition in column set 4
        // Then the grid cell in visualization "Visualization 1" at "3", "5" has text "$264,210"
        await since('the grid cell in visualization "Visualization 1" at "3", "5" has text "$264,210"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 5, 'Visualization 1'))
            .toBe('$264,210');
        // And the grid cell in visualization "Visualization 1" at "3", "9" has text " "
        await since('the grid cell in visualization "Visualization 1" at "3", "9" has text " "')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 9, 'Visualization 1'))
            .toBe(' ');
        // And the grid cell in visualization "Visualization 1" at "5", "5" has text "$193,660"
        await since('the grid cell in visualization "Visualization 1" at "5", "5" has text "$193,660"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(5, 5, 'Visualization 1'))
            .toBe('$193,660');
        // And the grid cell in visualization "Visualization 1" at "5", "9" has text "$235,588"
        await since('the grid cell in visualization "Visualization 1" at "5", "9" has text "$235,588"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(5, 9, 'Visualization 1'))
            .toBe('$235,588');
        // And the grid cell in visualization "Visualization 1" at "5", "10" has text " "
        await since('the grid cell in visualization "Visualization 1" at "5", "10" has text " "')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(5, 10, 'Visualization 1'))
            .toBe(' ');
        // And the grid cell in visualization "Visualization 1" at "8", "5" has text "$506,555"
        await since('the grid cell in visualization "Visualization 1" at "8", "5" has text "$506,555"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(8, 5, 'Visualization 1'))
            .toBe('$506,555');
        // And the grid cell in visualization "Visualization 1" at "8", "8" has text " "
        await since('the grid cell in visualization "Visualization 1" at "8", "8" has text " "')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(8, 8, 'Visualization 1'))
            .toBe(' ');
        // #verify column set 4 data
        // And the grid cell in visualization "Visualization 1" at "1", "12" has text "2015"
        await since('the grid cell in visualization "Visualization 1" at "1", "12" has text "2015"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(1, 12, 'Visualization 1'))
            .toBe('2015');
        // And the grid cell in visualization "Visualization 1" at "3", "12" has text " "
        await since('the grid cell in visualization "Visualization 1" at "3", "12" has text " "')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 12, 'Visualization 1'))
            .toBe(' ');
        // And the grid cell in visualization "Visualization 1" at "7", "12" has text "$524,181"
        await since('the grid cell in visualization "Visualization 1" at "7", "12" has text "$524,181"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(7, 12, 'Visualization 1'))
            .toBe('$524,181');
        // And the grid cell in visualization "Visualization 1" at "12", "12" has text "$851,942"
        await since('the grid cell in visualization "Visualization 1" at "12", "12" has text "$851,942"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(12, 12, 'Visualization 1'))
            .toBe('$851,942');

        // take secreenshot of "Visualization 1"
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Visualization 1 after advanced filter 7',
            'TC41285_8'
        );

        // #delete all the condition for one specific column set
        // When I open advanced filter editor for "Visualization 1" by clicking visualization context menu and clicking Edit Filter
        await advancedFilter.openAdvancedFilterEditor('Visualization 1');
        // And I close "Column Set 2" advanced filter editor
        await advancedFilter.closeColumnSetAdvancedFilterEditor('Column Set 2');
        // And I click Save to save the change and close advanced filter editor
        await advancedFilter.clickSaveOnAdvancedFilterEditor();

        // Then the grid cell in visualization "Visualization 1" at "2", "2" has text "March"
        await since('the grid cell in visualization "Visualization 1" at "2", "2" has text "March"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('March');
        // And the grid cell in visualization "Visualization 1" at "3", "5" has text "$264,210"
        await since('the grid cell in visualization "Visualization 1" at "3", "5" has text "$264,210"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 5, 'Visualization 1'))
            .toBe('$264,210');
        // And the grid cell in visualization "Visualization 1" at "2", "4" has text "August"
        await since('the grid cell in visualization "Visualization 1" at "2", "4" has text "August"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(2, 4, 'Visualization 1'))
            .toBe('August');
        // And the grid cell in visualization "Visualization 1" at "5", "5" has text "$193,660"
        await since('the grid cell in visualization "Visualization 1" at "5", "5" has text "$193,660"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(5, 5, 'Visualization 1'))
            .toBe('$193,660');
        // And the grid cell in visualization "Visualization 1" at "7", "6" has text "$96,208"
        await since('the grid cell in visualization "Visualization 1" at "7", "6" has text "$96,208"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(7, 6, 'Visualization 1'))
            .toBe('$96,208');
        // And the grid cell in visualization "Visualization 1" at "8", "5" has text "$506,555"
        await since('the grid cell in visualization "Visualization 1" at "8", "5" has text "$506,555"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(8, 5, 'Visualization 1'))
            .toBe('$506,555');
        // And the grid cell in visualization "Visualization 1" at "5", "9" has text "$235,588"
        await since('the grid cell in visualization "Visualization 1" at "5", "9" has text "$235,588"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(5, 9, 'Visualization 1'))
            .toBe('$235,588');
        // And the grid cell in visualization "Visualization 1" at "5", "10" has text "$2,193,709"
        await since('the grid cell in visualization "Visualization 1" at "5", "10" has text "$2,193,709"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(5, 10, 'Visualization 1'))
            .toBe('$2,193,709');
        // And the grid cell in visualization "Visualization 1" at "5", "12" has text "$342,383"
        await since('the grid cell in visualization "Visualization 1" at "5", "12" has text "$342,383"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(5, 12, 'Visualization 1'))
            .toBe('$342,383');
        // And the grid cell in visualization "Visualization 1" at "8", "8" has text "$533,459"
        await since('the grid cell in visualization "Visualization 1" at "8", "8" has text "$533,459"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(8, 8, 'Visualization 1'))
            .toBe('$533,459');
        // And the grid cell in visualization "Visualization 1" at "3", "9" has text "$313,177"
        await since('the grid cell in visualization "Visualization 1" at "3", "9" has text "$313,177"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 9, 'Visualization 1'))
            .toBe('$313,177');
        // And the grid cell in visualization "Visualization 1" at "1", "13" has text "2015"
        await since('the grid cell in visualization "Visualization 1" at "1", "13" has text "2015"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(1, 13, 'Visualization 1'))
            .toBe('2015');
        // And the grid cell in visualization "Visualization 1" at "3", "13" has text " "
        await since('the grid cell in visualization "Visualization 1" at "3", "13" has text " "')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 13, 'Visualization 1'))
            .toBe(' ');
        // And the grid cell in visualization "Visualization 1" at "7", "13" has text "$524,181"
        await since('the grid cell in visualization "Visualization 1" at "7", "13" has text "$524,181"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(7, 13, 'Visualization 1'))
            .toBe('$524,181');
        // And the grid cell in visualization "Visualization 1" at "12", "13" has text "$851,942"
        await since('the grid cell in visualization "Visualization 1" at "12", "13" has text "$851,942"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(12, 13, 'Visualization 1'))
            .toBe('$851,942');

        // take secreenshot of "Visualization 1"
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Visualization 1 after advanced filter 8',
            'TC41285_9'
        );

        // When I open advanced filter editor for "Visualization 1" by clicking visualization context menu and clicking Edit Filter
        await advancedFilter.openAdvancedFilterEditor('Visualization 1');
        // And I open "Column Set 2" advanced filter editor by clicking its button
        await advancedFilter.changeToAnotherColumnSetAdvancedFilterEditor('Column Set 2');
        // Then a new advanced filter by index "1" should not be created
        await advancedFilter.checkAdvancedFilterByIndexNotExist(1);

        // When I close "Column Set 4" advanced filter editor
        await advancedFilter.closeColumnSetAdvancedFilterEditor('Column Set 4');
        // Then a plus button should appear
        await advancedFilter.checkPlusButtonAppear();

        // When I click plus button to open column set context menu
        await advancedFilter.openColumnSetContextMenu();
        // And I click "Column Set 4" to open its advanced filter editor
        await advancedFilter.doSelectionOnPlusButtonContextMenu('Column Set 4');

        // When I click New Qualification Button to open New Qualification editor
        await advancedFilter.openNewQualificationEditor();
        // And I choose metric "Gross Revenue" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Gross Revenue');
        // And I select by value "Not Between" as the metric filter operator
        await advancedFilter.selectMetricFilterOperatorByValue('Not Between');
        // And I type "500000" for Value input
        await advancedFilter.typeValueInput('500000');
        // And I type "1000000" for the second Value input
        await advancedFilter.typeAndInput('1000000');
        // And I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
        // Then a new advanced filter by index "1" should be created
        await advancedFilter.checkAdvancedFilterByIndex(1);
        // When I click Save to save the change and close advanced filter editor
        await advancedFilter.clickSaveOnAdvancedFilterEditor();
        // Then the grid cell in visualization "Visualization 1" at "2", "2" has text "March"
        await since('the grid cell in visualization "Visualization 1" at "2", "2" has text "March"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('March');
        // And the grid cell in visualization "Visualization 1" at "3", "5" has text "$264,210"
        await since('the grid cell in visualization "Visualization 1" at "3", "5" has text "$264,210"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 5, 'Visualization 1'))
            .toBe('$264,210');
        // And the grid cell in visualization "Visualization 1" at "2", "4" has text "August"
        await since('the grid cell in visualization "Visualization 1" at "2", "4" has text "August"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(2, 4, 'Visualization 1'))
            .toBe('August');
        // And the grid cell in visualization "Visualization 1" at "5", "5" has text "$193,660"
        await since('the grid cell in visualization "Visualization 1" at "5", "5" has text "$193,660"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(5, 5, 'Visualization 1'))
            .toBe('$193,660');
        // And the grid cell in visualization "Visualization 1" at "7", "6" has text "$96,208"
        await since('the grid cell in visualization "Visualization 1" at "7", "6" has text "$96,208"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(7, 6, 'Visualization 1'))
            .toBe('$96,208');
        // And the grid cell in visualization "Visualization 1" at "8", "5" has text "$506,555"
        await since('the grid cell in visualization "Visualization 1" at "8", "5" has text "$506,555"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(8, 5, 'Visualization 1'))
            .toBe('$506,555');
        // And the grid cell in visualization "Visualization 1" at "5", "9" has text "$235,588"
        await since('the grid cell in visualization "Visualization 1" at "5", "9" has text "$235,588"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(5, 9, 'Visualization 1'))
            .toBe('$235,588');
        // And the grid cell in visualization "Visualization 1" at "5", "10" has text "$2,193,709"
        await since('the grid cell in visualization "Visualization 1" at "5", "10" has text "$2,193,709"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(5, 10, 'Visualization 1'))
            .toBe('$2,193,709');
        // And the grid cell in visualization "Visualization 1" at "5", "12" has text "$342,383"
        await since('the grid cell in visualization "Visualization 1" at "5", "12" has text "$342,383"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(5, 12, 'Visualization 1'))
            .toBe('$342,383');
        // And the grid cell in visualization "Visualization 1" at "8", "8" has text "$533,459"
        await since('the grid cell in visualization "Visualization 1" at "8", "8" has text "$533,459"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(8, 8, 'Visualization 1'))
            .toBe('$533,459');
        // And the grid cell in visualization "Visualization 1" at "3", "9" has text "$313,177"
        await since('the grid cell in visualization "Visualization 1" at "3", "9" has text "$313,177"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 9, 'Visualization 1'))
            .toBe('$313,177');
        // And the grid cell in visualization "Visualization 1" at "1", "13" has text "2014"
        await since('the grid cell in visualization "Visualization 1" at "1", "13" has text "2014"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(1, 13, 'Visualization 1'))
            .toBe('2014');
        // And the grid cell in visualization "Visualization 1" at "3", "13" has text "$1,095,275"
        await since('the grid cell in visualization "Visualization 1" at "3", "13" has text "$1,095,275"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 13, 'Visualization 1'))
            .toBe('$1,095,275');
        // And the grid cell in visualization "Visualization 1" at "7", "13" has text "$418,201"
        await since('the grid cell in visualization "Visualization 1" at "7", "13" has text "$418,201"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(7, 13, 'Visualization 1'))
            .toBe('$418,201');
        // And the grid cell in visualization "Visualization 1" at "7", "14" has text " "
        await since('the grid cell in visualization "Visualization 1" at "7", "14" has text " "')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(7, 14, 'Visualization 1'))
            .toBe(' ');
        // And the grid cell in visualization "Visualization 1" at "12", "13" has text " "
        await since('the grid cell in visualization "Visualization 1" at "12", "13" has text " "')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(12, 13, 'Visualization 1'))
            .toBe(' ');
        // And the grid cell in visualization "Visualization 1" at "12", "14" has text " "
        await since('the grid cell in visualization "Visualization 1" at "12", "14" has text " "')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(12, 14, 'Visualization 1'))
            .toBe(' ');
        // And the grid cell in visualization "Visualization 1" at "13", "15" has text "$418,769"
        await since('the grid cell in visualization "Visualization 1" at "13", "15" has text "$418,769"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(13, 15, 'Visualization 1'))
            .toBe('$418,769');
        // take secreenshot of "Visualization 1"
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Visualization 1 after advanced filter 9',
            'TC41285_10'
        );

        // #delete some specific condition
        // When I open advanced filter editor for "Visualization 1" by clicking visualization context menu and clicking Edit Filter
        await advancedFilter.openAdvancedFilterEditor('Visualization 1');
        // And I open "Column Set 3" advanced filter editor by clicking its button
        await advancedFilter.changeToAnotherColumnSetAdvancedFilterEditor('Column Set 3');
        // And I hover on the advanced filter by index "3"
        await advancedFilter.hoverOnFilterItemByIndex(3);
        // And I click on the delete button by index "3"
        await advancedFilter.clickDeleteButtonByIndex(3);
        // Then a new advanced filter by index "3" should not be created
        await advancedFilter.checkAdvancedFilterByIndexNotExist(3);

        // When I click Save to save the change and close advanced filter editor
        await advancedFilter.clickSaveOnAdvancedFilterEditor();
        // Then the grid cell in visualization "Visualization 1" at "7", "3" has text "$224,495"
        await since('the grid cell in visualization "Visualization 1" at "7", "3" has text "$224,495"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(7, 3, 'Visualization 1'))
            .toBe('$224,495');
        // And the grid cell in visualization "Visualization 1" at "8", "2" has text "$1,076,237"
        await since('the grid cell in visualization "Visualization 1" at "8", "2" has text "$1,076,237"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(8, 2, 'Visualization 1'))
            .toBe('$1,076,237');
        // And the grid cell in visualization "Visualization 1" at "9", "3" has text "$156,330"
        await since('the grid cell in visualization "Visualization 1" at "9", "3" has text "$156,330"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(9, 3, 'Visualization 1'))
            .toBe('$156,330');
        // And the grid cell in visualization "Visualization 1" at "15", "3" has text "$449,553"
        await since('the grid cell in visualization "Visualization 1" at "15", "3" has text "$449,553"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(15, 3, 'Visualization 1'))
            .toBe('$449,553');
        // And the grid cell in visualization "Visualization 1" at "16", "2" has text " "
        await since('the grid cell in visualization "Visualization 1" at "16", "2" has text " "')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(16, 2, 'Visualization 1'))
            .toBe(' ');
        // take secreenshot of "Visualization 1"
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Visualization 1 after advanced filter 10',
            'TC41285_11'
        );

        // #change existing condiiton, e.g create a set on top of an existing condition
        // When I open advanced filter editor for "Visualization 1" by clicking visualization context menu and clicking Edit Filter
        await advancedFilter.openAdvancedFilterEditor('Visualization 1');
        // And I open "Column Set 3" advanced filter editor by clicking its button
        await advancedFilter.changeToAnotherColumnSetAdvancedFilterEditor('Column Set 3');
        // And I hover on the advanced filter by index "2"
        await advancedFilter.hoverOnFilterItemByIndex(2);
        // And I click on Create a Set button by index "2"
        await advancedFilter.clickCreateASetButtonByIndex(2);
        // And I select "Region" from Create a Set attribute list
        await advancedFilter.clickAttributeOnCreateASetAttributeList('Region');
        // And I click OK to save the set setting and close the dialog
        await advancedFilter.createASet();
        // And I click Save to save the change and close advanced filter editor
        await advancedFilter.clickSaveOnAdvancedFilterEditor();

        // Then the grid cell in visualization "Visualization 1" at "7", "3" has text "$224,495"
        await since('the grid cell in visualization "Visualization 1" at "7", "3" has text "$224,495"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(7, 3, 'Visualization 1'))
            .toBe('$224,495');
        // And the grid cell in visualization "Visualization 1" at "8", "2" has text "$1,076,237"
        await since('the grid cell in visualization "Visualization 1" at "8", "2" has text "$1,076,237"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(8, 2, 'Visualization 1'))
            .toBe('$1,076,237');
        // And the grid cell in visualization "Visualization 1" at "9", "3" has text "$156,330"
        await since('the grid cell in visualization "Visualization 1" at "9", "3" has text "$156,330"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(9, 3, 'Visualization 1'))
            .toBe('$156,330');
        // And the grid cell in visualization "Visualization 1" at "15", "3" has text "$449,553"
        await since('the grid cell in visualization "Visualization 1" at "15", "3" has text "$449,553"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(15, 3, 'Visualization 1'))
            .toBe('$449,553');
        // And the grid cell in visualization "Visualization 1" at "16", "2" has text "$111,779"
        await since('the grid cell in visualization "Visualization 1" at "16", "2" has text "$111,779"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(16, 2, 'Visualization 1'))
            .toBe('$111,779');
        // take secreenshot of "Visualization 1"
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Visualization 1 after advanced filter 11',
            'TC41285_12'
        );

        // When I select "Save As..." from menu bar "FILE" on Web
        await dossierAuthoringPage.actionOnMenubarWithSubmenu('File', 'Save As...');
        await libraryAuthoringPage.saveInMyReport('TC41285_SaveAs');
        // Then Save As Dialog is displayed
        // When I enter "TC41285_SaveAs" as object name in Save As dialog
        // And I click OK button to save the object and confirm overwrite if the confirm overwrite dialog shows up
        // And I click "Run newly saved dashboard" button on Dossier Saved dialog
        await browser.pause(3000);
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Open the dossier in Presentation mode
        await libraryPage.openDossierById({
            projectId: gridConstants.CoumpoundGridAdvancedFilterSaveAs.project.id,
            dossierId: gridConstants.CoumpoundGridAdvancedFilterSaveAs.id,
        });
        // await libraryPage.openDossier('TC41285_SaveAs');
        await browser.pause(3000);
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then the grid cell in visualization "Visualization 1" at "7", "3" has text "$224,495"
        await since('the grid cell in visualization "Visualization 1" at "7", "3" has text "$224,495"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(7, 3, 'Visualization 1'))
            .toBe('$224,495');
        // And the grid cell in visualization "Visualization 1" at "8", "2" has text "$1,076,237"
        await since('the grid cell in visualization "Visualization 1" at "8", "2" has text "$1,076,237"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(8, 2, 'Visualization 1'))
            .toBe('$1,076,237');
        // And the grid cell in visualization "Visualization 1" at "9", "3" has text "$156,330"
        await since('the grid cell in visualization "Visualization 1" at "9", "3" has text "$156,330"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(9, 3, 'Visualization 1'))
            .toBe('$156,330');
        // And the grid cell in visualization "Visualization 1" at "15", "3" has text "$449,553"
        await since('the grid cell in visualization "Visualization 1" at "15", "3" has text "$449,553"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(15, 3, 'Visualization 1'))
            .toBe('$449,553');
        // And the grid cell in visualization "Visualization 1" at "16", "2" has text "$111,779"
        await since('the grid cell in visualization "Visualization 1" at "16", "2" has text "$111,779"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(16, 2, 'Visualization 1'))
            .toBe('$111,779');
        // And the grid cell in visualization "Visualization 1" at "2", "2" has text "March"
        await since('the grid cell in visualization "Visualization 1" at "2", "2" has text "March"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('March');
        // And the grid cell in visualization "Visualization 1" at "3", "5" has text "$264,210"
        await since('the grid cell in visualization "Visualization 1" at "3", "5" has text "$264,210"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 5, 'Visualization 1'))
            .toBe('$264,210');
        // And the grid cell in visualization "Visualization 1" at "2", "4" has text "August"
        await since('the grid cell in visualization "Visualization 1" at "2", "4" has text "August"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(2, 4, 'Visualization 1'))
            .toBe('August');

        // And the grid cell in visualization "Visualization 1" at "5", "5" has text "$193,660"
        await since('the grid cell in visualization "Visualization 1" at "5", "5" has text "$193,660"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(5, 5, 'Visualization 1'))
            .toBe('$193,660');
        // And the grid cell in visualization "Visualization 1" at "7", "6" has text "$96,208"
        await since('the grid cell in visualization "Visualization 1" at "7", "6" has text "$96,208"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(7, 6, 'Visualization 1'))
            .toBe('$96,208');
        // And the grid cell in visualization "Visualization 1" at "8", "5" has text "$506,555"
        await since('the grid cell in visualization "Visualization 1" at "8", "5" has text "$506,555"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(8, 5, 'Visualization 1'))
            .toBe('$506,555');
        // And the grid cell in visualization "Visualization 1" at "5", "9" has text "$235,588"
        await since('the grid cell in visualization "Visualization 1" at "5", "9" has text "$235,588"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(5, 9, 'Visualization 1'))
            .toBe('$235,588');
        // And the grid cell in visualization "Visualization 1" at "5", "10" has text "$2,193,709"
        await since('the grid cell in visualization "Visualization 1" at "5", "10" has text "$2,193,709"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(5, 10, 'Visualization 1'))
            .toBe('$2,193,709');
        // And the grid cell in visualization "Visualization 1" at "5", "12" has text "$342,383"
        await since('the grid cell in visualization "Visualization 1" at "5", "12" has text "$342,383"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(5, 12, 'Visualization 1'))
            .toBe('$342,383');
        // And the grid cell in visualization "Visualization 1" at "8", "8" has text "$533,459"
        await since('the grid cell in visualization "Visualization 1" at "8", "8" has text "$533,459"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(8, 8, 'Visualization 1'))
            .toBe('$533,459');
        // And the grid cell in visualization "Visualization 1" at "3", "9" has text "$313,177"
        await since('the grid cell in visualization "Visualization 1" at "3", "9" has text "$313,177"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 9, 'Visualization 1'))
            .toBe('$313,177');
        // And the grid cell in visualization "Visualization 1" at "1", "13" has text "2014"
        await since('the grid cell in visualization "Visualization 1" at "1", "13" has text "2014"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(1, 13, 'Visualization 1'))
            .toBe('2014');
        // And the grid cell in visualization "Visualization 1" at "3", "13" has text "$1,095,275"
        await since('the grid cell in visualization "Visualization 1" at "3", "13" has text "$1,095,275"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 13, 'Visualization 1'))
            .toBe('$1,095,275');
        // And the grid cell in visualization "Visualization 1" at "7", "13" has text "$418,201"
        await since('the grid cell in visualization "Visualization 1" at "7", "13" has text "$418,201"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(7, 13, 'Visualization 1'))
            .toBe('$418,201');
        // And the grid cell in visualization "Visualization 1" at "7", "14" has text " "
        await since('the grid cell in visualization "Visualization 1" at "7", "14" has text " "')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(7, 14, 'Visualization 1'))
            .toBe(' ');
        // And the grid cell in visualization "Visualization 1" at "12", "13" has text " "
        await since('the grid cell in visualization "Visualization 1" at "12", "13" has text " "')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(12, 13, 'Visualization 1'))
            .toBe(' ');
        // And the grid cell in visualization "Visualization 1" at "12", "14" has text " "
        await since('the grid cell in visualization "Visualization 1" at "12", "14" has text " "')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(12, 14, 'Visualization 1'))
            .toBe(' ');
        // And the grid cell in visualization "Visualization 1" at "13", "15" has text "$418,769"
        await since('the grid cell in visualization "Visualization 1" at "13", "15" has text "$418,769"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(13, 15, 'Visualization 1'))
            .toBe('$418,769');

        // take secreenshot of "Visualization 1"
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Visualization 1 in consumption mode',
            'TC41285_13'
        );
    });

    it('[TC73572] DE188175 Import of Data from existing Objects - Filter on large dimension with qualify on', async () => {
        // Edit dossier by its ID "755A8D3B614D64690297FB8DA4EAB5B9"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > AGGrid_CreateGrid_TC71081
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridCreate.project.id,
            dossierId: gridConstants.AGGridCreate.id,
        });
        await dossierAuthoringPage.addExistingObjects();
        // Then An editor shows up with title "Add Existing Objects"
        await since('An editor should show up with title "Add Existing Objects", instead we have')
            .expect(await dossierMojo.getMojoEditorWithTitle('Add Existing Objects').isDisplayed())
            .toBe(true);
        // When I expand the "Customers" folder
        await existingObjectsDialog.expandFolder('Customers');
        // And I double click on "Customer" from the object browse container
        await existingObjectsDialog.doubleClickOnObject('Customer');
        // Then Object "Customer" is added to the dataset container
        await since('Object "Customer" should be added to the dataset container, instead we have')
            .expect(await existingObjectsDialog.getObjectFromDatasetContainer('Customer').isDisplayed())
            .toBe(true);
        // When I select Metrics from the object explorer dropdown
        await existingObjectsDialog.selectMetricsFromDropdown();
        // When I expand the "32 metrics" folder
        await existingObjectsDialog.expandFolder('32 metrics');
        // And I double click on "Cost" from the object browse container
        await existingObjectsDialog.doubleClickOnObject('Cost');
        // Then Object "Cost" is added to the dataset container
        await since('Object "Cost" should be added to the dataset container, instead we have')
            .expect(await existingObjectsDialog.getObjectFromDatasetContainer('Cost').isDisplayed())
            .toBe(true);
        // When I open filter editor in Existing Objects Dialog
        await existingObjectsDialog.openFilterEditor();
        // Then I pause execution for 3 seconds
        await browser.pause(3000);
        // take screenshot of Existing Objects Dialog
        await takeScreenshotByElement(
            advancedFilter.AdvancedFilterEditor,
            'Existing Objects Dialog with Customer and Cost',
            'TC73572_1'
        );
        // And I choose attribute "Customer" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Customer');
        // Then I pause execution for 3 seconds
        // Then The error with title "Invalid Object" pops up
        // #And The error with message "This object is not available at this time." pops up
        // Then I click the button "Got it" in the pop up error
        await advancedFilter.openChooseElementsByDropDown();
        await advancedFilter.doSelectionOnChooseElementsByDropdown('Qualification on');
        // When I select "Last Name" radio button
        await advancedFilter.selectInListOrNotInList('Last Name');
        // And I select "Contains" as the attribute filter operator
        await advancedFilter.selectAttributeFilterOperator('Contains');
        // And I type "Abc" for Value input
        await advancedFilter.typeValueInput('Abc');
        // And I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();
        // When I click Save to save the change and close advanced filter editor
        await advancedFilter.clickSaveOnAdvancedFilterEditor();

        // When I click button "Add" on the existing objects dialog
        await existingObjectsDialog.clickOnBtn('Add');
        await browser.pause(2000);
        // Then The editor with title "Add Existing Objects" is closed
        const res = await dossierMojo.getMojoEditorWithTitle('Add Existing Objects').isDisplayed();
        await since('The editor with title "Add Existing Objects" should be closed').expect(res).toBe(false);
        // And The datasets panel should have dataset "New Dataset 1" after 15 seconds
        await since('The datasets panel should have dataset "New Dataset 1"')
            .expect(await datasetsPanel.getDatasetByName('New Dataset 1').isDisplayed())
            .toBe(true);
        // Then I pause execution for 5 seconds

        // When I add "attribute" named "Customer" from dataset "New Dataset 1" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Customer', 'attribute', 'New Dataset 1');
        // And I add "metric" named "Cost" from dataset "New Dataset 1" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'New Dataset 1');
        // Then the grid cell in visualization "Visualization 1" at "2", "1" has text "Arabchyan"
        await since('the grid cell in visualization "Visualization 1" at "2", "1" has text "Arabchyan"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('Arabchyan');
        // And the grid cell in visualization "Visualization 1" at "3", "1" has text "Babcock"
        await since('the grid cell in visualization "Visualization 1" at "3", "1" has text "Babcock"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Babcock');
    });
});
