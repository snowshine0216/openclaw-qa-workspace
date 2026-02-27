import * as gridConstants from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('Derived attribute for AG-grid', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        loginPage,
        libraryPage,
        editorPanelForGrid,
        editorPanel,
        vizPanelForGrid,
        datasetPanel,
        baseVisualization,
        agGridVisualization,
        loadingDialog,
        derivedAttributeEditor,
        derivedMetricEditor,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    it('[TC71123_01] Grid 1 with attributes in rows and metrics and attributes in column sets (more than one)', async () => {
        // Edit dossier by its ID "6E29176F11EB2071F7F60080EF7553E9"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Derived Attribute > Airline sample dataset Dossier
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridDerivedAttribute.project.id,
            dossierId: gridConstants.AGGridDerivedAttribute.id,
        });

        await baseVisualization.changeVizType('Visualization 1', 'Grid', 'Grid (Modern)');

        // # Step 2 Create Grid
        // # Grid 1 with attributes in rows and metrics and attributes in column sets (more than one)
        // And I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // When I add "attribute" named "Airline Name" from dataset "Airline sample dataset" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Airline Name', 'attribute', 'Airline sample dataset');
        // And I add "metric" named "On-Time" from dataset "Airline sample dataset" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('On-Time', 'metric', 'Airline sample dataset');
        // And I drag "attribute" named "Month" from dataset "Airline sample dataset" to dropzone "Columns" and drop it above "On-Time"
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Month',
            'attribute',
            'Airline sample dataset',
            'Columns',
            'above',
            'On-Time'
        );
        // Then The editor panel should have "attribute" named "Airline Name" on "Rows" section
        await since('The editor panel should have "attribute" named "Airline Name" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Airline Name', 'attribute', 'Rows').isExisting())
            .toBe(true);
        // And The editor panel should have "attribute" named "Month" on "Columns" section
        await since('The editor panel should have "attribute" named "Month" on "Columns" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Month', 'attribute', 'Columns').isExisting())
            .toBe(true);
        // And The editor panel should have "metric" named "On-Time" on "Columns" section
        await since('The editor panel should have "metric" named "On-Time" on "Columns" section')
            .expect(await editorPanelForGrid.getObjectFromSection('On-Time', 'metric', 'Columns').isExisting())
            .toBe(true);
        // And The editor panel should not have "metric" named "On-Time" on "Rows" section
        await since('The editor panel should not have "metric" named "On-Time" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSection('On-Time', 'metric', 'Rows').isExisting())
            .toBe(false);
        // When I add a new column set to the ag-grid
        await agGridVisualization.addColumnSet();
        // And I drag "attribute" named "Year" from dataset "Airline sample dataset" to Column Set "Column Set 2" in ag-grid
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ(
            'Year',
            'attribute',
            'Airline sample dataset',
            'Column Set 2'
        );
        // And I drag "metric" named "Flights Delayed" from dataset "Airline sample dataset" to Column Set "Column Set 2" and drop it below "Year" in ag-grid
        await vizPanelForGrid.dragDSObjectToColumnSetDZwithPosition(
            'Flights Delayed',
            'metric',
            'Airline sample dataset',
            'Column Set 2',
            'below',
            'Year'
        );
        // # Step 3 Create Derived Attribute
        // When I right click on element "Airline Name" and select "Create Attribute..." from ag-grid "Visualization 1"
        await agGridVisualization.openMenuItem('Airline Name', 'Create Attribute...', 'Visualization 1');
        // Then The Attribute Editor should be "displayed"
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await browser.pause(5000);
        // to dismiss tooltip
        await editorPanel.moveToPosition({ x: 0, y: 0 });
        await since('The Attribute Editor should be "displayed"')
            .expect(await derivedAttributeEditor.derivedAttributeEditor.isExisting())
            .toBe(true);
        // take screenshot of derived attribute editor
        await takeScreenshotByElement(
            derivedAttributeEditor.derivedAttributeEditor,
            'TC71123_01_01',
            'Create Derived Attribute'
        );
        // And The Attribute Editor should have a panel for "functions"
        // And The Attribute Editor should have a panel for "objects"
        // And The Attribute Editor should have a panel for "attribute"

        // When I double click on "attribute" named "Airline Name" on the "Objects" panel of DA Editor
        await derivedAttributeEditor.addObjectByDoubleClick('Airline Name');
        // Then "[Airline Name]@ID" is displayed on the "Input" section of the Attribute Forms panel
        await since('[Airline Name]@ID is displayed on the "Input" section of the Attribute Forms panel')
            .expect(await derivedAttributeEditor.getAttributeFormDefinition())
            .toEqual('[Airline Name]@ID');
        // When I click on the "Validate" button of DA Editor
        await derivedAttributeEditor.validateForm();
        // Then "Valid Formula." is displayed on the "Validation" section of the Attribute Forms panel
        await since('Valid Formula. is displayed on the "Validation" section of the Attribute Forms panel')
            .expect(await derivedAttributeEditor.validationStatusText)
            .toEqual('Valid Formula.');

        // Add new form and derived attribute formula
        // When I click on the "Add attribute form" button of DA Editor
        await derivedAttributeEditor.addBlankAttrForm();
        // Then A new tab with title "DESC" should be added to the Attribute Forms panel
        await since('A new tab with title "DESC" should be added to the Attribute Forms panel')
            .expect(await derivedAttributeEditor.getAttributeForm('DESC').isExisting())
            .toBe(true);
        // When I double click on "function" named "Length" on the "Functions" panel of DA Editor
        await derivedAttributeEditor.addFunctionByDoubleClick('Length');
        // Then "Length()" is displayed on the "Input" section of the Attribute Forms panel
        await since('Length() is displayed on the "Input" section of the Attribute Forms panel')
            .expect(await derivedAttributeEditor.getAttributeFormDefinition())
            .toEqual('Length()');
        // When I double click on "attribute" named "Airline Name" on the "Objects" panel of DA Editor
        await derivedAttributeEditor.addObjectByDoubleClick('Airline Name');
        // Then "Length([Airline Name]@ID)" is displayed on the "Input" section of the Attribute Forms panel
        await since('Length([Airline Name]@ID) is displayed on the "Input" section of the Attribute Forms panel')
            .expect(await derivedAttributeEditor.getAttributeFormDefinition())
            .toEqual('Length([Airline Name]@ID)');
        // When I click on the "Validate" button of DA Editor
        await derivedAttributeEditor.validateForm();
        // Then "Valid Formula." is displayed on the "Validation" section of the Attribute Forms panel
        await since('Valid Formula. is displayed on the "Validation" section of the Attribute Forms panel')
            .expect(await derivedAttributeEditor.validationStatusText)
            .toEqual('Valid Formula.');

        // And I click on the "Save" button of DA Editor
        await derivedAttributeEditor.saveAttribute();

        // # verify New derived attribute should be displayed
        // Then The datasets panel should have "derived attribute" named "New attribute" in dataset "Airline sample dataset"
        await since(
            'The datasets panel should have "derived attribute" named "New attribute" in dataset "Airline sample dataset"'
        )
            .expect(
                await datasetPanel
                    .getObjectFromDataset('New attribute', 'derived attribute', 'Airline sample dataset')
                    .isExisting()
            )
            .toBe(true);
        // And the header cell "New attribute" in ag-grid "Visualization 1" is present
        await since('The header cell "New attribute" in ag-grid "Visualization 1" is present')
            .expect(await agGridVisualization.getGroupHeaderCell('New attribute', 'Visualization 1').isExisting())
            .toBe(true);

        // # Step 5 Edit Derived Attribute
        // When I right click on element "New attribute" and select "Edit..." from ag-grid "Visualization 1"
        await agGridVisualization.openMenuItem('New attribute', 'Edit...', 'Visualization 1');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await browser.pause(5000);
        // to dismiss tooltip
        await editorPanel.moveToPosition({ x: 0, y: 0 });
        // Then The Attribute Editor should be "displayed"
        await since('The Attribute Editor should be "displayed"')
            .expect(await derivedAttributeEditor.derivedAttributeEditor.isExisting())
            .toBe(true);
        // And The Attribute Editor should have a panel for "functions"
        // And The Attribute Editor should have a panel for "objects"
        // And The Attribute Editor should have a panel for "attribute"
        // take screenshot of derived attribute editor
        await takeScreenshotByElement(
            derivedAttributeEditor.derivedAttributeEditor,
            'TC71123_01_02',
            'Edit Derived Attribute'
        );

        // When I set the Attribute Name value to "LengthOfID"
        await derivedAttributeEditor.setAttributeName('LengthOfID');
        // And I click on the "Save" button of DA Editor
        await derivedAttributeEditor.saveAttribute();

        // # verify Derived attribute changes should be saved correctly
        // Then The editor panel should have "derived attribute" named "LengthOfID" on "Rows" section
        await since('The editor panel should have "derived attribute" named "LengthOfID" on "Rows" section')
            .expect(
                await editorPanelForGrid.getObjectFromSection('LengthOfID', 'derived attribute', 'Rows').isExisting()
            )
            .toBe(true);
        // And the header cell "LengthOfID" in ag-grid "Visualization 1" is present
        await since('The header cell "LengthOfID" in ag-grid "Visualization 1" is present')
            .expect(await agGridVisualization.getGroupHeaderCell('LengthOfID', 'Visualization 1').isExisting())
            .toBe(true);

        // # Step 4 Create Derived Metric
        // When I right click on element "Flights Delayed" and select "Create Metric..." from ag-grid "Visualization 1"
        await agGridVisualization.openMenuItem('Flights Delayed', 'Create Metric...', 'Visualization 1');
        // Then The Metric Editor should be "displayed"
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await browser.pause(5000);
        // to dismiss tooltip
        await editorPanel.moveToPosition({ x: 0, y: 0 });
        await since('The Metric Editor should be "displayed"')
            .expect(await derivedMetricEditor.derivedMetricEditor.isExisting())
            .toBe(true);
        // And The Metric Editor should "have" a panel for "functions"
        // And The Metric Editor should "have" a panel for "simpleMetric"
        // take screenshot of derived metric editor
        await takeScreenshotByElement(
            derivedMetricEditor.derivedMetricEditor,
            'TC71123_01_03',
            'Create Derived Metric'
        );

        // And I click on the "Functions Selection" dropdown of DM Editor
        await derivedMetricEditor.clickOnElement(await derivedMetricEditor.functionsSelectionPullDown);
        // Then The "Functions Selection" popup should be displayed on DM Editor
        await since('The "Functions Selection" popup should be displayed on DM Editor')
            .expect(await derivedMetricEditor.functionsSelectionList.isExisting())
            .toBe(true);
        // When I select the "Avg" function from the Functions Selection list of DM Editor
        await derivedMetricEditor.clickOnElement(await derivedMetricEditor.getFunctionSelectioninPopupList('Avg'));
        // And I click on the "Objects Selection" dropdown of DM Editor
        await derivedMetricEditor.clickOnElement(await derivedMetricEditor.objectsSelectionPullDown);
        // Then The "Objects Selection" popup should be displayed on DM Editor
        await since('The "Objects Selection" popup should be displayed on DM Editor')
            .expect(await derivedMetricEditor.objectsSelectionList.isExisting())
            .toBe(true);
        // When I select the "On-Time" object from the Objects list of DM Editor
        await derivedMetricEditor.clickOnElement(await derivedMetricEditor.getObjectSelectioninPopupList('On-Time'));

        // And I click on the "Level Selection" dropdown of DM Editor
        await derivedMetricEditor.clickOnElement(await derivedMetricEditor.levelSelectionPullDown);
        // Then The "Level Selection" popup should be displayed on DM Editor
        await since('The "Level Selection" popup should be displayed on DM Editor')
            .expect(await derivedMetricEditor.levelSelectionList.isExisting())
            .toBe(true);
        // When I select the "Month" "level" object from the Objects list of DM Editor
        await derivedMetricEditor.clickOnElement(await derivedMetricEditor.getLevelSelectioninPopupList('Month'));
        // And I click on the "Save" button of DM Editor
        await derivedMetricEditor.saveMetric();

        // # verify New metric is created and displayed correctly
        // Then The datasets panel should have "derived metric" named "New Metric" in dataset "Airline sample dataset"
        await since(
            'The datasets panel should have "derived metric" named "New Metric" in dataset "Airline sample dataset"'
        )
            .expect(
                await datasetPanel
                    .getObjectFromDataset('New Metric', 'derived metric', 'Airline sample dataset')
                    .isExisting()
            )
            .toBe(true);
        // And the header cell "New Metric" in ag-grid "Visualization 1" is present
        await since('The header cell "New Metric" in ag-grid "Visualization 1" is present')
            .expect(await agGridVisualization.getGroupHeaderCell('New Metric', 'Visualization 1').isExisting())
            .toBe(true);

        // # Step 6 Edit Derived Metric
        // When I right click on element "New Metric" and select "Edit..." from ag-grid "Visualization 1"
        await agGridVisualization.openMenuItem('New Metric', 'Edit...', 'Visualization 1');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await browser.pause(5000);
        // to dismiss tooltip
        await editorPanel.moveToPosition({ x: 0, y: 0 });
        // Then The Metric Editor should be "displayed"
        await since('The Metric Editor should be "displayed"')
            .expect(await derivedMetricEditor.derivedMetricEditor.isExisting())
            .toBe(true);
        // And The Metric Editor should "not have" a panel for "functions"
        // And The Metric Editor should "have" a panel for "simpleMetric"
        await takeScreenshotByElement(derivedMetricEditor.derivedMetricEditor, 'TC71123_01_04', 'Edit Derived Metric');
        // When I set the Metric Name value to "Sum(On-Time)"
        await derivedMetricEditor.setMetricName('Sum(On-Time)');
        // And I click on the "Save" button of DM Editor
        await derivedMetricEditor.saveMetric();

        // # verify Derived metric updates should be applied correctly
        // Then The Metric Editor should be "hidden"
        await since('The Metric Editor should be "hidden"')
            .expect(await derivedMetricEditor.derivedMetricEditor.isExisting())
            .toBe(false);
        // And The editor panel should have "derived metric" named "Sum(On-Time)" on "Columns" section
        await since('The editor panel should have "derived metric" named "Sum(On-Time)" on "Columns" section')
            .expect(
                await editorPanelForGrid.getObjectFromSection('Sum(On-Time)', 'derived metric', 'Columns').isExisting()
            )
            .toBe(true);
        // And the header cell "Sum(On-Time)" in ag-grid "Visualization 1" is present
        await since('The header cell "Sum(On-Time)" in ag-grid "Visualization 1" is present')
            .expect(await agGridVisualization.getGroupHeaderCell('Sum(On-Time)', 'Visualization 1').isExisting())
            .toBe(true);
    });

    it('[TC71123_02] Grid 4 Attributes in rows and metrics only in column sets', async () => {
        // Edit dossier by its ID "6E29176F11EB2071F7F60080EF7553E9"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Derived Attribute > Airline sample dataset Dossier
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridDerivedAttribute.project.id,
            dossierId: gridConstants.AGGridDerivedAttribute.id,
        });

        await baseVisualization.changeVizType('Visualization 1', 'Grid', 'Grid (Modern)');

        // # Step 2 Create Grid
        // # Grid 4 Attributes in rows and metrics only in column sets
        await editorPanel.switchToEditorPanel();
        // When I add "attribute" named "Airline Name" from dataset "Airline sample dataset" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Airline Name', 'attribute', 'Airline sample dataset');
        // And I add "metric" named "Avg Delay (min)" from dataset "Airline sample dataset" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Avg Delay (min)', 'metric', 'Airline sample dataset');
        // And I drag "attribute" named "Year" from dataset "Airline sample dataset" to dropzone "Columns" and drop it above "Avg Delay (min)"
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Year',
            'attribute',
            'Airline sample dataset',
            'Columns',
            'above',
            'Avg Delay (min)'
        );
        // Then The editor panel should have "attribute" named "Airline Name" on "Rows" section
        await since('The editor panel should have "attribute" named "Airline Name" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Airline Name', 'attribute', 'Rows').isExisting())
            .toBe(true);
        // And The editor panel should have "attribute" named "Year" on "Columns" section
        await since('The editor panel should have "attribute" named "Year" on "Columns" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Year', 'attribute', 'Columns').isExisting())
            .toBe(true);
        // And The editor panel should have "metric" named "Avg Delay (min)" on "Columns" section
        await since('The editor panel should have "metric" named "Avg Delay (min)" on "Columns" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Avg Delay (min)', 'metric', 'Columns').isExisting())
            .toBe(true);
        // And The editor panel should not have "metric" named "Avg Delay (min)" on "Rows" section
        await since('The editor panel should not have "metric" named "Avg Delay (min)" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Avg Delay (min)', 'metric', 'Rows').isExisting())
            .toBe(false);
        // # Step 3 Create Derived Attribute
        // When I right click on element "Airline Name" and select "Create Attribute..." from ag-grid "Visualization 1"
        await agGridVisualization.openMenuItem('Airline Name', 'Create Attribute...', 'Visualization 1');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await browser.pause(5000);
        // Then The Attribute Editor should be "displayed"
        await since('The Attribute Editor should be "displayed"')
            .expect(await derivedAttributeEditor.derivedAttributeEditor.isExisting())
            .toBe(true);
        // And The Attribute Editor should have a panel for "functions"
        await since('The Attribute Editor should have a panel for "functions"')
            .expect(await derivedAttributeEditor.functionsPanel.isExisting())
            .toBe(true);
        // And The Attribute Editor should have a panel for "objects"
        await since('The Attribute Editor should have a panel for "objects"')
            .expect(await derivedAttributeEditor.objectsPanel.isExisting())
            .toBe(true);
        // And The Attribute Editor should have a panel for "attribute"
        await since('The Attribute Editor should have a panel for "attribute"')
            .expect(await derivedAttributeEditor.attributePanel.isExisting())
            .toBe(true);

        // When I double click on "attribute" named "Airline Name" on the "Objects" panel of DA Editor
        await derivedAttributeEditor.addObjectByDoubleClick('Airline Name');
        // Then "[Airline Name]@ID" is displayed on the "Input" section of the Attribute Forms panel
        await since('[Airline Name]@ID is displayed on the "Input" section of the Attribute Forms panel')
            .expect(await derivedAttributeEditor.getAttributeFormDefinition())
            .toEqual('[Airline Name]@ID');
        // When I click on the "Validate" button of DA Editor
        await derivedAttributeEditor.validateForm();
        // Then "Valid Formula." is displayed on the "Validation" section of the Attribute Forms panel
        await since('Valid Formula. is displayed on the "Validation" section of the Attribute Forms panel')
            .expect(await derivedAttributeEditor.validationStatusText)
            .toEqual('Valid Formula.');

        // # Add new form and derived attribute formula
        // When I click on the "Add attribute form" button of DA Editor
        await derivedAttributeEditor.addBlankAttrForm();
        // Then A new tab with title "DESC" should be added to the Attribute Forms panel
        await since('A new tab with title "DESC" should be added to the Attribute Forms panel')
            .expect(await derivedAttributeEditor.getAttributeForm('DESC').isExisting())
            .toBe(true);

        // When I double click on "function" named "Length" on the "Functions" panel of DA Editor
        await derivedAttributeEditor.addFunctionByDoubleClick('Length');
        // Then "Length()" is displayed on the "Input" section of the Attribute Forms panel
        await since('Length() is displayed on the "Input" section of the Attribute Forms panel')
            .expect(await derivedAttributeEditor.getAttributeFormDefinition())
            .toEqual('Length()');
        // When I double click on "attribute" named "Airline Name" on the "Objects" panel of DA Editor
        await derivedAttributeEditor.addObjectByDoubleClick('Airline Name');
        // Then "Length([Airline Name]@ID)" is displayed on the "Input" section of the Attribute Forms panel
        await since('Length([Airline Name]@ID) is displayed on the "Input" section of the Attribute Forms panel')
            .expect(await derivedAttributeEditor.getAttributeFormDefinition())
            .toEqual('Length([Airline Name]@ID)');
        // When I click on the "Validate" button of DA Editor
        await derivedAttributeEditor.validateForm();
        // Then "Valid Formula." is displayed on the "Validation" section of the Attribute Forms panel
        await since('Valid Formula. is displayed on the "Validation" section of the Attribute Forms panel')
            .expect(await derivedAttributeEditor.validationStatusText)
            .toEqual('Valid Formula.');

        // And I click on the "Save" button of DA Editor
        await derivedAttributeEditor.saveAttribute();
        // wait for animation
        await browser.pause(1000);

        // # verify New derived attribute should be displayed
        // And The datasets panel should have "derived attribute" named "New attribute" in dataset "Airline sample dataset"
        await since(
            'The datasets panel should have "derived attribute" named "New attribute" in dataset "Airline sample dataset"'
        )
            .expect(
                await datasetPanel
                    .getObjectFromDataset('New attribute', 'derived attribute', 'Airline sample dataset')
                    .isExisting()
            )
            .toBe(true);
        // And the header cell "New attribute" in ag-grid "Visualization 1" is present
        await since('The header cell "New attribute" in ag-grid "Visualization 1" is present')
            .expect(await agGridVisualization.getGroupHeaderCell('New attribute', 'Visualization 1').isExisting())
            .toBe(true);
        // # Step 5 Edit Derived Attribute
        // When I right click on element "New attribute" and select "Edit..." from ag-grid "Visualization 1"
        await agGridVisualization.openMenuItem('New attribute', 'Edit...', 'Visualization 1');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await browser.pause(5000);
        // Then The Attribute Editor should be "displayed"
        await since('The Attribute Editor should be "displayed"')
            .expect(await derivedAttributeEditor.derivedAttributeEditor.isExisting())
            .toBe(true);
        // And The Attribute Editor should have a panel for "functions"
        await since('The Attribute Editor should have a panel for "functions"')
            .expect(await derivedAttributeEditor.functionsPanel.isExisting())
            .toBe(true);
        // And The Attribute Editor should have a panel for "objects"
        await since('The Attribute Editor should have a panel for "objects"')
            .expect(await derivedAttributeEditor.objectsPanel.isExisting())
            .toBe(true);
        // And The Attribute Editor should have a panel for "attribute"
        await since('The Attribute Editor should have a panel for "attribute"')
            .expect(await derivedAttributeEditor.attributePanel.isExisting())
            .toBe(true);
        // When I set the Attribute Name value to "LengthOfID"
        await derivedAttributeEditor.setAttributeName('LengthOfID');
        // And I click on the "Save" button of DA Editor
        await derivedAttributeEditor.saveAttribute();

        // # verify Derived attribute changes should be saved correctly
        // Then The editor panel should have "derived attribute" named "LengthOfID" on "Rows" section
        await since('The editor panel should have "derived attribute" named "LengthOfID" on "Rows" section')
            .expect(
                await editorPanelForGrid.getObjectFromSection('LengthOfID', 'derived attribute', 'Rows').isExisting()
            )
            .toBe(true);
        // And the header cell "LengthOfID" in ag-grid "Visualization 1" is present
        await since('The header cell "LengthOfID" in ag-grid "Visualization 1" is present')
            .expect(await agGridVisualization.getGroupHeaderCell('LengthOfID', 'Visualization 1').isExisting())
            .toBe(true);

        // # Step 4 Create Derived Metric
        // When I right click on element "Avg Delay (min)" and select "Create Metric..." from ag-grid "Visualization 1"
        await agGridVisualization.openMenuItem('Avg Delay (min)', 'Create Metric...', 'Visualization 1');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await browser.pause(5000);
        // Then The Metric Editor should be "displayed"
        await since('The Metric Editor should be "displayed"')
            .expect(await derivedMetricEditor.derivedMetricEditor.isExisting())
            .toBe(true);
        // And The Metric Editor should "have" a panel for "functions"
        await since('The Metric Editor should "have" a panel for "functions"')
            .expect(await derivedMetricEditor.functionsPanel.isExisting())
            .toBe(true);
        // And The Metric Editor should "have" a panel for "simpleMetric"
        await since('The Metric Editor should "have" a panel for "simpleMetric"')
            .expect(await derivedMetricEditor.simpleMetricPanel.isExisting())
            .toBe(true);

        // And I click on the "Functions Selection" dropdown of DM Editor
        await derivedMetricEditor.clickOnElement(await derivedMetricEditor.functionsSelectionPullDown);
        // Then The "Functions Selection" popup should be displayed on DM Editor
        await since('The "Functions Selection" popup should be displayed on DM Editor')
            .expect(await derivedMetricEditor.functionsSelectionList.isExisting())
            .toBe(true);
        // When I select the "Avg" function from the Functions Selection list of DM Editor
        await derivedMetricEditor.clickOnElement(await derivedMetricEditor.getFunctionSelectioninPopupList('Avg'));
        // And I click on the "Objects Selection" dropdown of DM Editor
        await derivedMetricEditor.clickOnElement(await derivedMetricEditor.objectsSelectionPullDown);
        // Then The "Objects Selection" popup should be displayed on DM Editor
        await since('The "Objects Selection" popup should be displayed on DM Editor')
            .expect(await derivedMetricEditor.objectsSelectionList.isExisting())
            .toBe(true);
        // When I select the "On-Time" object from the Objects list of DM Editor
        await derivedMetricEditor.clickOnElement(await derivedMetricEditor.getObjectSelectioninPopupList('On-Time'));

        // And I click on the "Level Selection" dropdown of DM Editor
        await derivedMetricEditor.clickOnElement(await derivedMetricEditor.levelSelectionPullDown);
        // Then The "Level Selection" popup should be displayed on DM Editor
        await since('The "Level Selection" popup should be displayed on DM Editor')
            .expect(await derivedMetricEditor.levelSelectionList.isExisting())
            .toBe(true);
        // When I select the "Month" "level" object from the Objects list of DM Editor
        await derivedMetricEditor.clickOnElement(await derivedMetricEditor.getLevelSelectioninPopupList('Month'));
        // And I click on the "Save" button of DM Editor
        await derivedMetricEditor.saveMetric();

        // # verify New metric is created and displayed correctly
        // Then The datasets panel should have "derived metric" named "New Metric" in dataset "Airline sample dataset"
        await since(
            'The datasets panel should have "derived metric" named "New Metric" in dataset "Airline sample dataset"'
        )
            .expect(
                await datasetPanel
                    .getObjectFromDataset('New Metric', 'derived metric', 'Airline sample dataset')
                    .isExisting()
            )
            .toBe(true);
        // And the header cell "New Metric" in ag-grid "Visualization 1" is present
        await since('The header cell "New Metric" in ag-grid "Visualization 1" is present')
            .expect(await agGridVisualization.getGroupHeaderCell('New Metric', 'Visualization 1').isExisting())
            .toBe(true);

        // # Step 6 Edit Derived Metric
        // When I right click on element "New Metric" and select "Edit..." from ag-grid "Visualization 1"
        await agGridVisualization.openMenuItem('New Metric', 'Edit...', 'Visualization 1');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await browser.pause(5000);
        // Then The Metric Editor should be "displayed"
        await since('The Metric Editor should be "displayed"')
            .expect(await derivedMetricEditor.derivedMetricEditor.isExisting())
            .toBe(true);

        // When I set the Metric Name value to "Sum(On-Time)"
        await derivedMetricEditor.setMetricName('Sum(On-Time)');
        // And I click on the "Save" button of DM Editor
        await derivedMetricEditor.saveMetric();

        // # verify Derived metric updates should be applied correctly
        // Then The Metric Editor should be "hidden"
        await since('The Metric Editor should be "hidden"')
            .expect(await derivedMetricEditor.derivedMetricEditor.isExisting())
            .toBe(false);
        // Then The editor panel should have "derived metric" named "Sum(On-Time)" on "Columns" section
        await since('The editor panel should have "derived metric" named "Sum(On-Time)" on "Columns" section')
            .expect(
                await editorPanelForGrid.getObjectFromSection('Sum(On-Time)', 'derived metric', 'Columns').isExisting()
            )
            .toBe(true);
        // And the header cell "Sum(On-Time)" in ag-grid "Visualization 1" is present
        await since('The header cell "Sum(On-Time)" in ag-grid "Visualization 1" is present')
            .expect(await agGridVisualization.getGroupHeaderCell('Sum(On-Time)', 'Visualization 1').isExisting())
            .toBe(true);
    });
});
