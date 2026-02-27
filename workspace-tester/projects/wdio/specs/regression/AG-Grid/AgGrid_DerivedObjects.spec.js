import * as gridConstants from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('Derived objects for AG-grid', () => {
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
        dossierAuthoringPage,
        dossierMojo,
        reportGridView,
        ngmeditorPanel,
        microchartConfigDialog,
        toolbar,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    it('[TC73484] Advanced sort to attribute calculation DE does not cause errors', async () => {
        // Edit dossier by its ID "6E29176F11EB2071F7F60080EF7553E9"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Derived Attribute > Airline sample dataset Dossier
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridDerivedAttribute.project.id,
            dossierId: gridConstants.AGGridDerivedAttribute.id,
        });

        // # step 1
        // When I change visualization "Visualization 1" to "Grid (Modern)" from context menu
        await baseVisualization.changeVizType('Visualization 1', 'Grid', 'Grid (Modern)');
        // And I click on container "Visualization 1" to select it
        // And I switch to Editor Panel tab
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
        // And The editor panel should not have "metric" named "Revenue" on "Rows" section
        await since('The editor panel should not have "metric" named "Avg Delay (min)" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Avg Delay (min)', 'metric', 'Rows').isExisting())
            .toBe(false);

        // # step 2
        // When I right click on element "2009" and select "Calculation" from ag-grid "Visualization 1"
        await agGridVisualization.openMenuItem('2009', 'Calculation', 'Visualization 1');
        // Then The submenu should have "Absolute"
        await since('The submenu should have "Absolute"')
            .expect(await dossierAuthoringPage.getSubOptionFromMenubar('Absolute').isExisting())
            .toBe(true);
        // When I select "Absolute" from submenu
        await derivedMetricEditor.clickOnElement(await dossierAuthoringPage.getSubOptionFromMenubar('Absolute'));
        // When I click on the "Save" button on the popup editor
        await dossierMojo.clickBtnOnMojoEditor('Save');
        // Then The editor panel should have "new derived element" named "Year(Group)" on "Columns" section
        await since('The editor panel should have "new derived element" named "Year(Group)" on "Columns" section')
            .expect(
                await editorPanelForGrid
                    .getObjectFromSection('Year(Group)', 'new derived element', 'Columns')
                    .isExisting()
            )
            .toBe(true);
        // And the grid cell in ag-grid "Visualization 1" at "2", "0" has text "AirTran Airways Corporation"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toEqual('AirTran Airways Corporation');
        // And the grid cell in ag-grid "Visualization 1" at "2", "1" has text "68,257.42"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 1))
            .toEqual('68,257.42');
        // And the grid cell in ag-grid "Visualization 1" at "2", "2" has text "68,257.42"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 2))
            .toEqual('68,257.42');
        // And the grid cell in ag-grid "Visualization 1" at "2", "3" has text "67,036.68"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toEqual('67,036.68');
        // And the grid cell in ag-grid "Visualization 1" at "2", "4" has text "5,755.90"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "4" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 4))
            .toEqual('5,755.90');

        // # step 3
        // When I open Advanced Sort for the "new derived element" named "Year(Group)" in the Grid Editor Panel
        await editorPanelForGrid.openAdvancedSortEditor('Year(Group)', 'new derived element');
        // # step 4
        // And I switch from "Columns" to "Rows" in the Advanced Sort Editor
        await vizPanelForGrid.switchRowColumnInSortEditor('Rows');
        // And I set row "1" to use object "2009; Avg Delay (min)" sort "Descending" in the Advanced Sort Editor
        await vizPanelForGrid.addAdvancedSortParameter('1', '2009; Avg Delay (min)', 'Descending');
        // And I click "OK" button to save and close the Advanced Sort Editor
        await vizPanelForGrid.saveAndCloseSortEditor();
        // Then the grid cell in ag-grid "Visualization 1" at "2", "0" has text "United Air Lines Inc."
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toEqual('United Air Lines Inc.');
        // And the grid cell in ag-grid "Visualization 1" at "2", "1" has text "82,087.27"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 1))
            .toEqual('82,087.27');
        // And the grid cell in ag-grid "Visualization 1" at "2", "2" has text "82,087.27"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 2))
            .toEqual('82,087.27');
        // And the grid cell in ag-grid "Visualization 1" at "2", "3" has text "77,885.83"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toEqual('77,885.83');
        // And the grid cell in ag-grid "Visualization 1" at "2", "4" has text "4,855.81"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "4" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 4))
            .toEqual('4,855.81');

        // # step 5
        // When I open Advanced Sort for the "new derived element" named "Year(Group)" in the Grid Editor Panel
        await editorPanelForGrid.openAdvancedSortEditor('Year(Group)', 'new derived element');
        // And I set row "1" to use object "Year(Group)" sort "Descending" in the Advanced Sort Editor
        await vizPanelForGrid.addAdvancedSortParameter('1', 'Year(Group)', 'Descending');
        // And I click "OK" button to save and close the Advanced Sort Editor
        await vizPanelForGrid.saveAndCloseSortEditor();
        // # now should be Airline Name, Calculation 1, 2011, 2010, 2009
        // Then the grid cell in ag-grid "Visualization 1" at "2", "0" has text "United Air Lines Inc."
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toEqual('United Air Lines Inc.');
        // And the grid cell in ag-grid "Visualization 1" at "2", "1" has text "82,087.27"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 1))
            .toEqual('82,087.27');
        // And the grid cell in ag-grid "Visualization 1" at "2", "2" has text "4,855.81"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 2))
            .toEqual('4,855.81');
        // And the grid cell in ag-grid "Visualization 1" at "2", "3" has text "77,885.83"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toEqual('77,885.83');
        // And the grid cell in ag-grid "Visualization 1" at "2", "4" has text "82,087.27"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "4" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 4))
            .toEqual('82,087.27');
    });

    it('[TC71124] Functional validation of derived metrics in Modern(AG) Grid Microcharts authoring and consumption modes', async () => {
        // Edit dossier by its ID "5EA69F4D3244D1D2124A22AE610F9E1B"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Derived Objects > TC71124
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridDerivedObjects.project.id,
            dossierId: gridConstants.AGGridDerivedObjects.id,
        });
        // And the grid cell in ag-grid "Visualization 1" at "2", "1" has text "Action Movies"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 1, 'Visualization 1'))
            .toEqual('Action Movies');
        // And the grid cell in ag-grid "Visualization 1" at "2", "2" has text "$1,120,886"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 2, 'Visualization 1'))
            .toEqual('$1,120,886');
        // And the grid cell in ag-grid "Visualization 1" at "2", "3" has text "$760,697"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 3, 'Visualization 1'))
            .toEqual('$760,697');
        // # create a shortcut metric via 'Aggregate By...'
        // When I create Aggregate By "Average" for "metric" named "Revenue" from Grid Editor Panel
        await editorPanelForGrid.secondaryMenuOnEditorObject('Revenue', 'metric', 'Aggregate By', 'Average');
        // Then The editor panel should have "derived metric" named "Avg (Revenue)" on "Column Set 1" section
        await since('The editor panel should have "derived metric" named "Avg (Revenue)" on "Column Set 1" section')
            .expect(
                await editorPanelForGrid
                    .getObjectFromSection('Avg (Revenue)', 'derived metric', 'Column Set 1')
                    .isExisting()
            )
            .toBe(true);
        // And the grid cell in ag-grid "Visualization 1" at "2", "3" has text "$14,011"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 3, 'Visualization 1'))
            .toEqual('$14,011');
        // And the grid cell in ag-grid "Visualization 1" at "0", "3" has text "Avg (Revenue)"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "0", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3, 'Visualization 1'))
            .toEqual('Avg (Revenue)');

        // # sort the grid
        // When I sort the "metric" named "Revenue" in "Sort Within" in Editor Panel
        await editorPanelForGrid.simpleSort('Revenue', 'Sort Within');
        // Then the grid cell in ag-grid "Visualization 1" at "2", "2" has text "$1,366,053"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 2, 'Visualization 1'))
            .toEqual('$1,366,053');
        // And the grid cell in ag-grid "Visualization 1" at "2", "3" has text "$21,016"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 3, 'Visualization 1'))
            .toEqual('$21,016');
        // And the grid cell in ag-grid "Visualization 1" at "3", "2" has text "$1,353,636"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "3", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 2, 'Visualization 1'))
            .toEqual('$1,353,636');

        // # create calculation metric
        // When I open Calculation editor for "Revenue" in the Grid Editor Panel and "Subtract" "Cost"
        await editorPanelForGrid.createCalculationFromEditorPanel('Revenue', 'Subtract', 'Cost');
        // Then The editor panel should have "derived metric" named "(Revenue-Cost)" on "Column Set 1" section
        await since('The editor panel should have "derived metric" named "(Revenue-Cost)" on "Column Set 1" section')
            .expect(
                await editorPanelForGrid
                    .getObjectFromSection('(Revenue-Cost)', 'derived metric', 'Column Set 1')
                    .isExisting()
            )
            .toBe(true);
        // When I rename "derived metric" named "(Revenue-Cost)" from dataset "retail-sample-data.xls" as "Profit"
        await editorPanelForGrid.renameObject('(Revenue-Cost)', 'derived metric', 'Profit');
        // Then the grid cell in ag-grid "Visualization 1" at "0", "3" has text "Profit"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "0", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3, 'Visualization 1'))
            .toEqual('Profit');
        // And the grid cell in ag-grid "Visualization 1" at "2", "3" has text "$425,183"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "3" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 3, 'Visualization 1'))
            .toEqual('$425,183');

        // # enable subtotals
        // When I toggle totals from editor panel
        await editorPanelForGrid.showTotal();
        // Then the grid cell in ag-grid "Visualization 1" at "2", "0" has text "Total"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 0, 'Visualization 1'))
            .toEqual('Total');
        // And the grid cell in ag-grid "Visualization 1" at "2", "2" has text "$246,389,148"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 2, 'Visualization 1'))
            .toEqual('$246,389,148');
        // And the grid cell in ag-grid "Visualization 1" at "3", "1" has text "Total"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "3", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 1, 'Visualization 1'))
            .toEqual('Total');
        // And the grid cell in ag-grid "Visualization 1" at "3", "2" has text "$18,091,154"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "3", "2" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 2, 'Visualization 1'))
            .toEqual('$18,091,154');

        // # keep only / exculde
        // When I right click on value "Annapolis" and select "Exclude" from ag-grid "Visualization 1"
        await agGridVisualization.openContextMenuItemForValue('Annapolis', 'Exclude', 'Visualization 1');
        // Then the grid cell in ag-grid "Visualization 1" at "3", "0" has text "Baltimore"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "3", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 0, 'Visualization 1'))
            .toEqual('Baltimore');
        // And the grid cell in ag-grid "Visualization 1" at "4", "1" has text "Action Movies"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "4", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(4, 1, 'Visualization 1'))
            .toEqual('Action Movies');
        // When I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        await toolbar.waitForElementInvisible(dossierAuthoringPage.getMojoLoadingIndicator());
        // Then the grid cell in ag-grid "Visualization 1" at "3", "0" has text "Annapolis"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "3", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 0, 'Visualization 1'))
            .toEqual('Annapolis');
        // And the grid cell in ag-grid "Visualization 1" at "4", "1" has text "Horror Movies"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "4", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(4, 1, 'Visualization 1'))
            .toEqual('Horror Movies');

        // When I right click on value "Horror Movies" and select "Keep Only" from ag-grid "Visualization 1"
        await agGridVisualization.openContextMenuItemForValue('Horror Movies', 'Keep Only', 'Visualization 1');
        // Then the grid cell in ag-grid "Visualization 1" at "3", "1" has text "Total"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "3", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 1, 'Visualization 1'))
            .toEqual('Total');
        // And the grid cell in ag-grid "Visualization 1" at "20", "1" has text "Horror Movies"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "20", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(20, 1, 'Visualization 1'))
            .toEqual('Horror Movies');
        // And the grid cell in ag-grid "Visualization 1" at "21", "1" has text "Horror Movies"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "21", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(21, 1, 'Visualization 1'))
            .toEqual('Horror Movies');
        // When I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        // Then the grid cell in ag-grid "Visualization 1" at "3", "0" has text "Annapolis"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "3", "0" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 0, 'Visualization 1'))
            .toEqual('Annapolis');
        // And the grid cell in ag-grid "Visualization 1" at "4", "1" has text "Horror Movies"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "4", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(4, 1, 'Visualization 1'))
            .toEqual('Horror Movies');
        // # create a new metric
        // When I right click on "metric" named "Cost" from dataset "retail-sample-data.xls" and select "Create Metric..."
        await datasetPanel.actionOnObjectFromDataset('Cost', 'metric', 'retail-sample-data.xls', 'Create Metric...');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await browser.pause(5000);
        // Then The Metric Editor should be "displayed"
        await since('The Metric Editor should be "displayed"')
            .expect(await derivedMetricEditor.derivedMetricEditor.isExisting())
            .toBe(true);
        // When I click on the Switch to "Formula" Editor button of DM Editor
        await derivedMetricEditor.switchMode('Formula');
        // And "Sum(Cost){~+}" is displayed on the "Input" section of the Metrics panel
        await since('"Sum(Cost){~+}" is displayed on the "Input" section of the Metrics panel')
            .expect(await derivedMetricEditor.getMetricDefinition())
            .toEqual('Sum(Cost){~+}');
        // When I click on the "Clear" button of DM Editor
        await derivedMetricEditor.clearMetric();
        // Then "" is displayed on the "Input" section of the Metrics panel
        await since('"" is displayed on the "Input" section of the Metrics panel')
            .expect(await derivedMetricEditor.getMetricDefinition())
            .toEqual('');
        // When I type "Cost/Revenue" in the Formula input box section of DM Editor
        await derivedMetricEditor.setMetricDefinition('Cost/Revenue');
        // And I set the Metric Name value to "Cost Revenue Ratio"
        await derivedMetricEditor.setMetricName('Cost Revenue Ratio');
        // And I click on the "Validate" button of DM Editor
        await derivedMetricEditor.validateMetric();
        // Then "Valid metric formula." is displayed on the "Validation" section of the Metrics panel
        await since('"Valid metric formula." is displayed on the "Validation" section of the Metrics panel')
            .expect(await derivedMetricEditor.validationStatusText)
            .toEqual('Valid metric formula.');
        // When I click on the "Save" button of DM Editor
        await derivedMetricEditor.saveMetric();
        // Then The Metric Editor should be "hidden"
        await since('The Metric Editor should be "hidden"')
            .expect(await derivedMetricEditor.derivedMetricEditor.isExisting())
            .toBe(false);

        // # replace
        // When I replace the "attribute" named "Item Category" with the "attribute" named "Supplier" in the Grid Editor Panel
        await editorPanelForGrid.replaceObjectByName('Item Category', 'attribute', 'Supplier', 'attribute');
        // Then the editor panel should have the items "Supplier" in the "Rows" zone
        await since('The editor panel should have the items "Supplier" in the "Rows" zone')
            .expect(await editorPanelForGrid.getObjectFromSection('Supplier', 'attribute', 'Rows').isExisting())
            .toBe(true);
        // And the grid cell in ag-grid "Visualization 1" at "3", "1" has text "Virgin Records"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "3", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 1, 'Visualization 1'))
            .toEqual('Virgin Records');
        // And the grid cell in ag-grid "Visualization 1" at "0", "1" has text "Supplier"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "0", "1" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1, 'Visualization 1'))
            .toEqual('Supplier');
        // When I replace the "derived metric" named "Avg (Revenue)" in column set "Column Set 1" with the "metric" named "Units Sold" in the Compound Grid Editor Panel
        await editorPanelForGrid.replaceObjectByName('Avg (Revenue)', 'derived metric', 'Units Sold', 'metric');
        // Then the grid cell in ag-grid "Visualization 1" at "0", "4" has text "Units Sold"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "0", "4" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 4, 'Visualization 1'))
            .toEqual('Units Sold');
        // And the grid cell in ag-grid "Visualization 1" at "3", "4" has text "21018"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "3", "4" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 4, 'Visualization 1'))
            .toEqual('21018');
        // # use derived metric to create microcharts
        // When I add a new microchart set to the ag-grid
        await agGridVisualization.addMicrochartSet();
        // And I select the object named "Cost Revenue Ratio" from pulldown at position "1" in the microchart config dialog
        await microchartConfigDialog.selectObject(1, 'Cost Revenue Ratio');
        // And I select the object named "Month" from pulldown at position "2" in the microchart config dialog
        await microchartConfigDialog.selectObject(2, 'Month');
        // Then the object named "Cost Revenue Ratio" is selected from pulldown at position "1" in the microchart config dialog
        await since(
            'The object named "#{expected}" is selected from pulldown at position "1" in the microchart config dialog, but got "#{actual}"'
        )
            .expect(await microchartConfigDialog.getObjectPulldownSelection(1).getText())
            .toEqual('Cost Revenue Ratio');
        // And the object named "Month" is selected from pulldown at position "2" in the microchart config dialog
        await since(
            'The object named "#{expected}" is selected from pulldown at position "2" in the microchart config dialog, but got "#{actual}"'
        )
            .expect(await microchartConfigDialog.getObjectPulldownSelection(2).getText())
            .toEqual('Month');
        // And the microchart is named "Cost Revenue Ratio Trend by Month" in the microchart config dialog
        await microchartConfigDialog.getNameInputFieldWithText('Cost Revenue Ratio Trend by Month').waitForDisplayed();
        // When I confirm the microchart config dialog
        await microchartConfigDialog.confirmDialog();
        // Then The editor panel should have microchart with type "Sparkline" named "Cost Revenue Ratio Trend by Month" on "Cost Revenue Ratio Trend by Month" section
        await since(
            'The editor panel should have microchart with type "Trend Bars" named "Cost Revenue Ratio Trend by Month" on "Cost Revenue Ratio Trend by Month" section'
        )
            .expect(
                await editorPanel
                    .getObjectFromSection(
                        'Cost Revenue Ratio Trend by Month',
                        'mc mc-sparkline',
                        'Cost Revenue Ratio Trend by Month'
                    )
                    .isDisplayed()
            )
            .toBe(true);
        // And the grid cell in ag-grid "Visualization 1" at "0", "6" has text "Cost Revenue Ratio Trend by Month"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "0", "6" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 6, 'Visualization 1'))
            .toEqual('Cost Revenue Ratio Trend by Month');

        // When I add a new microchart set to the ag-grid
        await agGridVisualization.addMicrochartSet();
        // And I select the microchart type "Trend Bars" in the microchart config dialog
        await microchartConfigDialog.selectType('Trend Bars');
        // And I select the object named "Avg (Revenue)" from pulldown at position "1" in the microchart config dialog
        await microchartConfigDialog.selectObject(1, 'Avg (Revenue)');
        // Then the object named "Avg (Revenue)" is selected from pulldown at position "1" in the microchart config dialog
        await since(
            'The object named "#{expected}" is selected from pulldown at position "1" in the microchart config dialog, but got "#{actual}"'
        )
            .expect(await microchartConfigDialog.getObjectPulldownSelection(1).getText())
            .toEqual('Avg (Revenue)');
        // When I select the object named "Item Category" from pulldown at position "2" in the microchart config dialog
        await microchartConfigDialog.selectObject(2, 'Item Category');
        // Then the object named "Item Category" is selected from pulldown at position "2" in the microchart config dialog
        await since(
            'The object named "#{expected}" is selected from pulldown at position "2" in the microchart config dialog, but got "#{actual}"'
        )
            .expect(await microchartConfigDialog.getObjectPulldownSelection(2).getText())
            .toEqual('Item Category');
        // Then the microchart is named "Avg (Revenue) Comparison by Item Category" in the microchart config dialog
        await microchartConfigDialog
            .getNameInputFieldWithText('Avg (Revenue) Comparison by Item Category')
            .waitForDisplayed();
        // When I confirm the microchart config dialog
        await microchartConfigDialog.confirmDialog();
        // Then The editor panel should have microchart with type "Trend Bars" named "Avg (Revenue) Comparison by Item Category" on "Avg (Revenue)Comparison by Item Category" section
        await since(
            'The editor panel should have microchart with type "Trend Bars" named "Avg (Revenue) Comparison by Item Category" on "Avg (Revenue)Comparison by Item Category" section'
        )
            .expect(
                await editorPanel
                    .getObjectFromSection(
                        'Avg (Revenue) Comparison by Item Category',
                        'mc mc-trendBar',
                        'Avg (Revenue) Comparison by Item Category'
                    )
                    .isDisplayed()
            )
            .toBe(true);
        // And the grid cell in ag-grid "Visualization 1" at "0", "18" has text "Avg (Revenue) Comparison by Item Category"
        await since(
            'The grid cell in ag-grid "Visualization 1" at "0", "18" has text "#{expected}", but got "#{actual}"'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 18, 'Visualization 1'))
            .toEqual('Avg (Revenue) Comparison by Item Category');
    });
});
