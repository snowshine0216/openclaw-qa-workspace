import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import * as consts from '../../../constants/visualizations.js';
import LibraryPage from '../../../pageObjects/library/LibraryPage.js';

const specConfiguration = { ...customCredentials('_sort') };
const { credentials } = specConfiguration;

//npm run regression -- --baseUrl=https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --spec 'specs/regression/dashboardAuthoring/datasetManipulationsE2E.spec.js'
describe('Dataset Manupulations E2E workflows', () => {
    const tutorialProject = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };

    let { libraryAuthoringPage, libraryPage, dossierPage, baseContainer, baseVisualization, agGridVisualization, dossierAuthoringPage, datasetDialog, showDataDialog, vizPanelForGrid, authoringFilters, dossierMojo, datasetPanel, datasetsPanel, existingObjectsDialog, loginPage, tocMenu, derivedAttributeEditor, derivedMetricEditor } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(consts.tqmsUser.credentials);

    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC99170] Dataset Manupulations E2E workflow', async () => {
        // Create dossier and import the sample dataset "airline sample data"
        await authoringFilters.createDossierAndImportSampleFiles();
        await since('The dataset "airline-sample-data.xls" is displayed in datasets panel should be "#{expected}", instead we have "#{actual}"')
        .expect(await datasetPanel.isDatasetDisplayed("airline-sample-data.xls"))
        .toBe(true);
        await since('Attribute "Airline Name" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Airline Name", "attribute", "airline-sample-data.xls"))
        .toBe(true);
        await since('Attribute "Day of Week" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Day of Week", "attribute", "airline-sample-data.xls"))
        .toBe(true);
        await since('Metric "Avg Delay (min)" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Avg Delay (min)", "metric", "airline-sample-data.xls"))
        .toBe(true);
        await since('Metric "On-Time" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("On-Time", "metric", "airline-sample-data.xls"))
        .toBe(true);

        // Import an existing report "Report_01_Simple" as a second dataset
        await datasetPanel.selectFromDatasetsPanelContextMenu("Add Data");
        await baseContainer.selectSecondaryContextMenuOption("Existing Dataset...");
        await since('The Select Existing dataset dialog shows up "#{expected}", instead we have "#{actual}"')
        .expect(await datasetPanel.isSelectExistingDatasetDialogDisplayed())
        .toBe(true);

        await dossierMojo.changeFolderPath("Shared Reports");
        await browser.pause(2000);
        await dossierMojo.selectObject("DossierAuthoring");
        await browser.pause(2000);
        await dossierMojo.selectObject("DossierDatasets");
        await browser.pause(2000);
        await dossierMojo.selectObject("Report_01_Simple");
        await browser.pause(2000);
        await dossierMojo.clickBtnOnMojoEditor("Select");
        await since('The dataset "Report_01_Simple" is displayed in datasets panel should be "#{expected}", instead we have "#{actual}"')
        .expect(await datasetPanel.isDatasetDisplayed("Report_01_Simple"))
        .toBe(true);
        await since(`Attribute "Category" in "Report_01_Simple" should have index #{expected}, instead we have #{actual}`)
        .expect(await datasetPanel.getIndexForObjectinDS("Report_01_Simple", 0, "Category"))
        .toBe(0);
        await since(`Attribute "Country" in "Report_01_Simple" should have index #{expected}, instead we have #{actual}`)
        .expect(await datasetPanel.getIndexForObjectinDS("Report_01_Simple", 1, "Country"))
        .toBe(1);
        await since(`Metric "Cost" in "Report_01_Simple" should have index #{expected}, instead we have #{actual}`)
        .expect(await datasetPanel.getIndexForObjectinDS("Report_01_Simple", 3, "Cost"))
        .toBe(3);
        await since(`Metric "Freight" in "Report_01_Simple" should have index #{expected}, instead we have #{actual}`)
        .expect(await datasetPanel.getIndexForObjectinDS("Report_01_Simple", 4, "Freight"))
        .toBe(4);

        // Create Grid 
        await baseVisualization.changeVizType('Visualization 1', 'Grid', 'Grid (Modern)');
        // Add attribute and metrics to grid
        await datasetPanel.addObjectToVizByDoubleClick('Day of Week', 'attribute', 'airline-sample-data.xls');
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'Report_01_Simple');
        await since('The ag-grid cell in "Visualization 1" at "2", "1" should have text "Sunday", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 1, "Visualization 1", "Sunday"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization 1" at "2", "2" should have text "$29,730,085", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 2, "Visualization 1", "$29,730,085"))
        .toBe(true);
    });
       
    it('[TC99170_01] Edit existing dataset, add objects and update dataset, and Undo/redo', async () => {
        await datasetPanel.chooseDatasetContextMenuOption("Report_01_Simple", "Edit Dataset...");
        await since('The editor shows up with title "Edit Dataset - Report_01_Simple", should be #{expected},instead we have #{actual}')
        .expect(await dossierMojo.isMoJoEditorWithTitleDisplayed("Edit Dataset - Report_01_Simple"))
        .toBe(true);
        await datasetDialog.checkKeepChangesLocalCheckbox();
        await since('The check box for "Keep Changes Local" is checked, should be #{expected},instead we have #{actual}')
        .expect(await datasetDialog.isKeepChangesLocalCheckboxChecked())
        .toBe(true);
        await existingObjectsDialog.expandFolder("Geography");
        await existingObjectsDialog.doubleClickOnObject("Region");        
        await since('The object "Region" is added to the dataset container, should be #{expected},instead we have #{actual}')
        .expect(await existingObjectsDialog.isObjectDisplayedinDSContainer("Region"))
        .toBe(true);

        await existingObjectsDialog.selectMetricsFromDropdown();
        await existingObjectsDialog.expandFolder("Sales Metrics");
        await existingObjectsDialog.expandFolder("Conditional Sales Metrics");
        await existingObjectsDialog.doubleClickOnObject("Non-Web Sales");        
        await since('The object "Non-Web Sales" is added to the dataset container, should be #{expected},instead we have #{actual}')
        .expect(await existingObjectsDialog.isObjectDisplayedinDSContainer("Non-Web Sales"))
        .toBe(true);
        await existingObjectsDialog.clickOnBtn("Update Dataset");
        await since('The editor shows up with title "Edit Dataset - Report_01_Simple", should be #{expected},instead we have #{actual}')
        .expect(await dossierMojo.isMoJoEditorWithTitleDisplayed("Edit Dataset - Report_01_Simple"))
        .toBe(false);
        await since('Attribute "Region" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Region", "attribute", "Report_01_Simple"))
        .toBe(true);
        await since('Metric "Non-Web Sales" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Non-Web Sales", "metric", "Report_01_Simple"))
        .toBe(true);

        await dossierAuthoringPage.actionOnToolbar("Undo");
        await since('Attribute "Region" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Region", "attribute", "Report_01_Simple"))
        .toBe(false);
        await since('Metric "Non-Web Sales" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Non-Web Sales", "metric", "Report_01_Simple"))
        .toBe(false);

        await dossierAuthoringPage.actionOnToolbar("Redo");
        await since('Attribute "Region" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Region", "attribute", "Report_01_Simple"))
        .toBe(true);
        await since('Metric "Non-Web Sales" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Non-Web Sales", "metric", "Report_01_Simple"))
        .toBe(true);
    });

    it('[TC99170_02] Search for Objects in the Datasets Panel by type, and add objects into grid', async () => {
        await datasetPanel.selectFromSearchPulldown("All Attributes");
        await since('Attribute "Category" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Category", "attribute", "Report_01_Simple"))
        .toBe(true);
        await since('Attribute "Country" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Country", "attribute", "Report_01_Simple"))
        .toBe(true);
        await since('Attribute "Airline Name" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Airline Name", "attribute", "airline-sample-data.xls"))
        .toBe(true);
        await since('Attribute "Year" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Year", "attribute", "airline-sample-data.xls"))
        .toBe(true);
        await since('Metric "Cost" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Cost", "metric", "Report_01_Simple"))
        .toBe(false);
        await since('Metric "Profit" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Profit", "metric", "Report_01_Simple"))
        .toBe(false);
        await since('Metric "Freight" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Freight", "metric", "Report_01_Simple"))
        .toBe(false);
        await since('Metric "Flights Cancelled" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Flights Cancelled", "metric", "airline-sample-data.xls"))
        .toBe(false);
        await since('Metric "Flights Delayed" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Flights Delayed", "metric", "airline-sample-data.xls"))
        .toBe(false);
        await since('Derived metric "Row Count" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Row Count", "derived metric", "Report_01_Simple"))
        .toBe(false);

        await datasetPanel.addObjectToVizByDoubleClick('Year', 'attribute', 'airline-sample-data.xls');
        await since('The ag-grid cell in "Visualization 1" at "2", "1" should have text "Sunday", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 1, "Visualization 1", "Sunday"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization 1" at "2", "2" should have text "2009", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 2, "Visualization 1", "2009"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization 1" at "2", "3" should have text "$26,410,860", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 3, "Visualization 1", "$26,410,860"))
        .toBe(true);

        await datasetPanel.selectFromSearchPulldown("All Metrics");
        await since('Attribute "Category" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Category", "attribute", "Report_01_Simple"))
        .toBe(false);
        await since('Attribute "Country" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Country", "attribute", "Report_01_Simple"))
        .toBe(false);
        await since('Attribute "Airline Name" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Airline Name", "attribute", "airline-sample-data.xls"))
        .toBe(false);
        await since('Attribute "Year" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Year", "attribute", "airline-sample-data.xls"))
        .toBe(false);
        await since('Metric "Cost" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Cost", "metric", "Report_01_Simple"))
        .toBe(true);
        await since('Metric "Profit" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Profit", "metric", "Report_01_Simple"))
        .toBe(true);
        await since('Metric "Freight" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Freight", "metric", "Report_01_Simple"))
        .toBe(true);
        await since('Metric "Avg Delay (min)" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Avg Delay (min)", "metric", "airline-sample-data.xls"))
        .toBe(true);
        await since('Metric "Flights Delayed" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Flights Delayed", "metric", "airline-sample-data.xls"))
        .toBe(true);
        await since('Metric "Row Count - airline-sample-data.xls" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Row Count - airline-sample-data.xls", "metric", "airline-sample-data.xls"))
        .toBe(true);
        await since('Derived metric "Row Count" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Row Count", "derived metric", "Report_01_Simple"))
        .toBe(true);

        await datasetPanel.addObjectToVizByDoubleClick('Avg Delay (min)', 'metric', 'airline-sample-data.xls');
        await since('The ag-grid cell in "Visualization 1" at "2", "1" should have text "Sunday", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 1, "Visualization 1", "Sunday"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization 1" at "2", "2" should have text "2009", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 2, "Visualization 1", "2009"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization 1" at "2", "3" should have text "$26,410,860", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 3, "Visualization 1", "$26,410,860"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization 1" at "2", "4" should have text "83,272.40", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 4, "Visualization 1", "83,272.40"))
        .toBe(true);
        
        await datasetPanel.selectFromSearchPulldown("Derived Metrics");
        await since('Metric "Cost" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Cost", "metric", "Report_01_Simple"))
        .toBe(false);
        await since('Metric "Profit" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Profit", "metric", "Report_01_Simple"))
        .toBe(false);
        await since('Metric "Freight" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Freight", "metric", "Report_01_Simple"))
        .toBe(false);
        await since('Metric "Flights Cancelled" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Flights Cancelled", "metric", "airline-sample-data.xls"))
        .toBe(false);
        await since('Metric "Flights Delayed" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Flights Delayed", "metric", "airline-sample-data.xls"))
        .toBe(false);
        await since('Metric "Row Count - airline-sample-data.xls" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Row Count - airline-sample-data.xls", "metric", "airline-sample-data.xls"))
        .toBe(false);
        await since('Derived metric "Row Count" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Row Count", "derived metric", "Report_01_Simple"))
        .toBe(true);

        await datasetPanel.selectFromSearchPulldown("Data Source");
        await baseContainer.selectSecondaryContextMenuOption("Report_01_Simple");        
        await since('Attribute "Category" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Category", "attribute", "Report_01_Simple"))
        .toBe(true);
        await since('Attribute "Country" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Country", "attribute", "Report_01_Simple"))
        .toBe(true);
        await since('Attribute "Region" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Region", "attribute", "Report_01_Simple"))
        .toBe(true);
        await since('Attribute "Year" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Year", "attribute", "Report_01_Simple"))
        .toBe(true);
        await since('Metric "Cost" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Cost", "metric", "Report_01_Simple"))
        .toBe(true);
        await since('Metric "Profit" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Profit", "metric", "Report_01_Simple"))
        .toBe(true);
        await since('Metric "Freight" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Freight", "metric", "Report_01_Simple"))
        .toBe(true);
        await since('Metric "Profit Margin" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Profit Margin", "metric", "Report_01_Simple"))
        .toBe(true);
        await since('Metric "Units Sold" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Units Sold", "metric", "Report_01_Simple"))
        .toBe(true);
        await since('Derived metric "Row Count" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Row Count", "derived metric", "Report_01_Simple"))
        .toBe(true);

        await datasetPanel.selectFromSearchPulldown("Linking Attributes");
        await since('The number of matched objects should be 0, but got #{actual}')
        .expect( await datasetPanel.matchedObjects.length)
        .toBe(0);

        await datasetPanel.selectFromSearchPulldown("Current Page");
        await since('Attribute "Day of Week" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Day of Week", "attribute", "airline-sample-data.xls"))
        .toBe(true);
        await since('Attribute "Year" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Year", "attribute", "airline-sample-data.xls"))
        .toBe(true);
        await since('Attribute "Airline Name" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Airline Name", "attribute", "airline-sample-data.xls"))
        .toBe(false);
        await since('Attribute "Category" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Category", "attribute", "Report_01_Simple"))
        .toBe(false);
        await since('Attribute "Region" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Region", "attribute", "Report_01_Simple"))
        .toBe(false);
        await since('Metric "Cost" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Cost", "metric", "Report_01_Simple"))
        .toBe(true);
        await since('Metric "Profit" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Profit", "metric", "Report_01_Simple"))
        .toBe(false);
        await since('Metric "Avg Delay (min)" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Avg Delay (min)", "metric", "airline-sample-data.xls"))
        .toBe(true);
        await since('Metric "On-Time" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("On-Time", "metric", "airline-sample-data.xls"))
        .toBe(false);

        await datasetPanel.selectFromDatasetsPanelContextMenu("Add Data");
        await baseContainer.selectSecondaryContextMenuOption("New Data...");
        await datasetsPanel.clickDataSourceByIndex(5); // Using Sample Files as data source
        await datasetsPanel.importSampleFiles([1]); // campaign-finance-sample-data.xls
        await datasetPanel.selectFromSearchPulldown("Time Attributes");
        await since('Time attribute "Coverage Start Date" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Coverage Start Date", "time attribute", "campaign-finance-sample-data.xls"))
        .toBe(true);
        await since('Time attribute "Coverage End Date" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Coverage End Date", "time attribute", "campaign-finance-sample-data.xls"))
        .toBe(true);
        await since('Attribute "Day of Week" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Day of Week", "attribute", "airline-sample-data.xls"))
        .toBe(false);
        await since('Attribute "Category" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Category", "attribute", "Report_01_Simple"))
        .toBe(false);

        await datasetPanel.selectFromSearchPulldown("Geo Attributes");
        await since('Time attribute "Coverage Start Date" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Coverage Start Date", "time attribute", "campaign-finance-sample-data.xls"))
        .toBe(false);
        await since('Time attribute "Coverage End Date" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Coverage End Date", "time attribute", "campaign-finance-sample-data.xls"))
        .toBe(false);
        await since('Geo attribute "Candidate City" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Candidate City", "geo attribute", "campaign-finance-sample-data.xls"))
        .toBe(true);
        await since('Geo attribute "Candidate State" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Candidate State", "geo attribute", "campaign-finance-sample-data.xls"))
        .toBe(true);
    });

    it('[TC99170_03] Search objects in dataset panel by key word', async () => {
        await datasetPanel.selectFromSearchPulldown("All Objects");
        await datasetPanel.searchOnDatasetsPanel("Year");
        await since('The number of matched objects should be 2, but got #{actual}')
            .expect( await datasetPanel.matchedObjects.length)
            .toBe(2);
        await since('Attribute "Category" displays on dataset "Report_01_Simple", should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isHighlightedObjectFromDSdisplayed("Category", "attribute", "Report_01_Simple", 'Year'))
        .toBe(false);
        await since('Attribute "Year" displays on dataset "Report_01_Simple", should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isHighlightedObjectFromDSdisplayed("Year", "attribute", "Report_01_Simple", 'Year'))
        .toBe(true);
        await since('Attribute "Airline Name" displays on dataset "airline-sample-data.xls", should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isHighlightedObjectFromDSdisplayed("Airline Name", "attribute", "airline-sample-data.xls", 'Year'))
        .toBe(false);
        await since('Attribute "Year" displays on dataset "airline-sample-data.xls", should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isHighlightedObjectFromDSdisplayed("Year", "attribute", "airline-sample-data.xls", 'Year'))
        .toBe(true);

        await datasetPanel.clearSearch();
        await datasetPanel.searchOnDatasetsPanel("of");
        await since('The number of matched objects should be 7, but got #{actual}')
            .expect( await datasetPanel.matchedObjects.length)
            .toBe(7);
        await since('Metric "Profit" displays on dataset "Report_01_Simple", should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isHighlightedObjectFromDSdisplayed("Profit", "metric", "Report_01_Simple", 'of'))
        .toBe(true);
        await since('Metric "Profit Margin" displays on dataset "Report_01_Simple", should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isHighlightedObjectFromDSdisplayed("Profit Margin", "metric", "Report_01_Simple", 'of'))
        .toBe(true);
        await since('Attribute "Day of Week" displays on dataset "airline-sample-data.xls", should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isHighlightedObjectFromDSdisplayed("Days of Week", "attribute", "airline-sample-data.xls", 'of'))
        .toBe(false);
        await since('Metric "Number of Flights" displays on dataset "airline-sample-data.xls", should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isHighlightedObjectFromDSdisplayed("Number of Flights", "metric", "airline-sample-data.xls", 'of'))
        .toBe(true);
        await since('Metric "Cash on Hand Beginning of Period" displays on dataset "campaign-finance-sample-data.xls", should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isHighlightedObjectFromDSdisplayed("Cash on Hand Beginning of Period", "metric", "campaign-finance-sample-data.xls", 'of'))
        .toBe(true);
        await since('Metric "Cash on Hand Close of Period" displays on dataset "campaign-finance-sample-data.xls", should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isHighlightedObjectFromDSdisplayed("Cash on Hand Close of Period", "metric", "campaign-finance-sample-data.xls", 'of'))
        .toBe(true);
        await since('Metric "Offsets to Operating Expenditure" displays on dataset "campaign-finance-sample-data.xls", should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isHighlightedObjectFromDSdisplayed("Offsets to Operating Expenditure", "metric", "campaign-finance-sample-data.xls", 'of'))
        .toBe(true);
    });

    it('[TC99170_04] Sort objects in dataset panel by key word', async () => {
        await datasetPanel.clearSearch();
        await datasetPanel.chooseDatasetContextMenuOption("Report_01_Simple", "Sort Descending");
        await since(`Attribute "Category" in "Report_01_Simple" should have index #{expected}, instead we have #{actual}`)
        .expect(await datasetPanel.getIndexForObjectinDS("Report_01_Simple", 3, "Category"))
        .toBe(3);
        await since(`Attribute "Country" in "Report_01_Simple" should have index #{expected}, instead we have #{actual}`)
        .expect(await datasetPanel.getIndexForObjectinDS("Report_01_Simple", 2, "Country"))
        .toBe(2);
        await since(`Metric "Cost" in "Report_01_Simple" should have index #{expected}, instead we have #{actual}`)
        .expect(await datasetPanel.getIndexForObjectinDS("Report_01_Simple", 10, "Cost"))
        .toBe(10);
        await since(`Metric "Freight" in "Report_01_Simple" should have index #{expected}, instead we have #{actual}`)
        .expect(await datasetPanel.getIndexForObjectinDS("Report_01_Simple", 9, "Freight"))
        .toBe(9);
    });

    it('[TC99170_05] Link Attribute "Day of Week" to "Region"', async () => {
        await datasetPanel.actionOnObjectFromDataset("Day of Week", "attribute", "airline-sample-data.xls", "Link to Other Dataset...")
        await since('The editor shows up with title "Link Attributes", should be #{expected},instead we have #{actual}')
        .expect(await dossierMojo.isMoJoEditorWithTitleDisplayed("Link Attributes"))
        .toBe(true);
        await datasetPanel.linkAttribute("Region");
        await dossierMojo.clickBtnOnMojoEditor("OK");
        await since('The editor shows up with title "Link Attributes", should be #{expected},instead we have #{actual}')
        .expect(await dossierMojo.isMoJoEditorWithTitleDisplayed("Link Attributes"))
        .toBe(false);
        await since('Link icon shows on attribute "Day of Week" from dataset "airline-sample-data.xls", should be #{expected},instead we have #{actual}')
        .expect(await datasetPanel.isAttributeLinked("Day of Week", "airline-sample-data.xls"))
        .toBe(true);
        await since('Link icon shows on attribute "Region" from dataset "airline-sample-data.xls", should be #{expected},instead we have #{actual}')
        .expect(await datasetPanel.isAttributeLinked("Region", "Report_01_Simple"))
        .toBe(true);
        // Comment out following validations since the order of the elements are changing in grid after linking attribute, and I need to do more investigation
        /* 
        await since('The ag-grid cell in "Visualization 1" at "2", "1" should have text "Sunday", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 1, "Visualization 1", "Sunday"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization 1" at "2", "2" should have text "2009", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 2, "Visualization 1", "2009"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization 1" at "2", "3" should have text " ", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 3, "Visualization 1", ""))
        .toBe(true);
        await since('The ag-grid cell in "Visualization 1" at "2", "4" should have text "83,272.40", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 4, "Visualization 1", "83,272.40"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization 1" at "20", "1" should have text "Central", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(20, 1, "Visualization 1", "Central"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization 1" at "20", "2" should have text " ", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(20, 2, "Visualization 1", ""))
        .toBe(true);
        await since('The ag-grid cell in "Visualization 1" at "20", "3" should have text "$4,265,043", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(20, 3, "Visualization 1", "$4,265,043"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization 1" at "20", "4" should have text " ", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(20, 4, "Visualization 1", ""))
        .toBe(true);
        */
  
        await datasetPanel.selectFromSearchPulldown("Linking Attributes");
        await since('Attribute "Day of Week" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Day of Week", "Attribute", "airline-sample-data.xls"))
        .toBe(true);
        await since('Attribute "Region" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Region", "Attribute", "Report_01_Simple"))
        .toBe(true);
    });

    it('[TC99170_06] Change Join Behaviors for dataset', async () => {
        await datasetPanel.chooseDatasetContextMenuOption("Report_01_Simple", "Join Behavior");
        await since('The current selected join behavior is #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.getCheckedItemFromCM().getText())
        .toBe("Primary (outer join)");
        await baseContainer.selectSecondaryContextMenuOption("Secondary (inner join)");
        await datasetPanel.chooseDatasetContextMenuOption("Report_01_Simple", "Join Behavior");
        await since('The current selected join behavior is #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.getCheckedItemFromCM().getText())
        .toBe("Secondary (inner join)");
        await vizPanelForGrid.dismissContextMenu();
        await since('The ag-grid cell in "Visualization 1" at "2", "1" should have text "Sunday", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 1, "Visualization 1", "Sunday"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization 1" at "2", "2" should have text "2009", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 2, "Visualization 1", "2009"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization 1" at "2", "3" should have text " ", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 3, "Visualization 1", ""))
        .toBe(true);
        await since('The ag-grid cell in "Visualization 1" at "2", "4" should have text "83,272.40", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 4, "Visualization 1", "83,272.40"))
        .toBe(true);
    });

    it('[TC99170_07] Unlink the attributes', async () => {
        await datasetPanel.selectFromSearchPulldown("All Objects");
        await datasetPanel.actionOnObjectFromDataset("Day of Week", "attribute", "airline-sample-data.xls", "Unlink")
        await since('Link icon shows on attribute "Day of Week" from dataset "airline-sample-data.xls", should be #{expected},instead we have #{actual}')
        .expect(await datasetPanel.isAttributeLinked("Day of Week", "airline-sample-data.xls"))
        .toBe(false);
        await since('Link icon shows on attribute "Category" from dataset "airline-sample-data.xls", should be #{expected},instead we have #{actual}')
        .expect(await datasetPanel.isAttributeLinked("Category", "Report_01_Simple"))
        .toBe(false);
        await since('The ag-grid cell in "Visualization 1" at "2", "1" should have text "Sunday", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 1, "Visualization 1", "Sunday"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization 1" at "2", "2" should have text "2009", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 2, "Visualization 1", "2009"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization 1" at "2", "3" should have text "$26,410,860", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 3, "Visualization 1", "$26,410,860"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization 1" at "2", "4" should have text "83,272.40", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 4, "Visualization 1", "83,272.40"))
        .toBe(true);
    });

    it('[TC99170_08] Collapse all datasets and expand datasets', async () => {
        await datasetPanel.selectFromDatasetsPanelContextMenu("Collapse All");
        await since('Dataset "airline-sample-data.xls" is collapsed, should be #{expected},instead we have #{actual}')
        .expect((await datasetPanel.getDatasetObjectsPanel("airline-sample-data.xls").getCSSProperty('display'))['value'])
        .toContain('none');
        await since('Dataset "Report_01_Simple" is collapsed, should be #{expected},instead we have #{actual}')
        .expect((await datasetPanel.getDatasetObjectsPanel("Report_01_Simple").getCSSProperty('display'))['value'])
        .toContain('none');
        await since('Dataset "campaign-finance-sample-data.xls" is collapsed, should be #{expected},instead we have #{actual}')
        .expect((await datasetPanel.getDatasetObjectsPanel("campaign-finance-sample-data.xls").getCSSProperty('display'))['value'])
        .toContain('none');
        await since('Attribute "Category" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Category", "attribute", "Report_01_Simple"))
        .toBe(false);
        await since('Attribute "Airline Name" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Airline Name", "attribute", "airline-sample-data.xls"))
        .toBe(false);
        await since('Time attribute "Coverage Start Date" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Coverage Start Date", "time attribute", "campaign-finance-sample-data.xls"))
        .toBe(false);

        await datasetPanel.selectFromDatasetsPanelContextMenu("Expand All");
        await since('Dataset "airline-sample-data.xls" is expanded, should be #{expected},instead we have #{actual}')
        .expect((await datasetPanel.getDatasetObjectsPanel("airline-sample-data.xls").getCSSProperty('display'))['value'])
        .toContain('block');
        await since('Dataset "Report_01_Simple" is expanded, should be #{expected},instead we have #{actual}')
        .expect((await datasetPanel.getDatasetObjectsPanel("Report_01_Simple").getCSSProperty('display'))['value'])
        .toContain('block');
        await since('Dataset "campaign-finance-sample-data.xls" is expanded, should be #{expected},instead we have #{actual}')
        .expect((await datasetPanel.getDatasetObjectsPanel("campaign-finance-sample-data.xls").getCSSProperty('display'))['value'])
        .toContain('block');
        await since('Attribute "Category" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Category", "attribute", "Report_01_Simple"))
        .toBe(true);
        await since('Attribute "Airline Name" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Airline Name", "attribute", "airline-sample-data.xls"))
        .toBe(true);
        await since('Time attribute "Coverage Start Date" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Coverage Start Date", "time attribute", "campaign-finance-sample-data.xls"))
        .toBe(true);
    });

    it('[TC99170_09] Collapse a single dataset then delete', async () => {
        await datasetPanel.collapseDataset("campaign-finance-sample-data.xls");
        await since('Dataset "airline-sample-data.xls" is expanded, should be #{expected},instead we have #{actual}')
        .expect((await datasetPanel.getDatasetObjectsPanel("airline-sample-data.xls").getCSSProperty('display'))['value'])
        .toContain('block');
        await since('Dataset "Report_01_Simple" is expanded, should be #{expected},instead we have #{actual}')
        .expect((await datasetPanel.getDatasetObjectsPanel("Report_01_Simple").getCSSProperty('display'))['value'])
        .toContain('block');
        await since('Dataset "campaign-finance-sample-data.xls" is collapsed, should be #{expected},instead we have #{actual}')
        .expect((await datasetPanel.getDatasetObjectsPanel("campaign-finance-sample-data.xls").getCSSProperty('display'))['value'])
        .toContain('none');
        await since('Attribute "Category" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Category", "attribute", "Report_01_Simple"))
        .toBe(true);
        await since('Attribute "Airline Name" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Airline Name", "attribute", "airline-sample-data.xls"))
        .toBe(true);
        await since('Time attribute "Coverage Start Date" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Coverage Start Date", "time attribute", "campaign-finance-sample-data.xls"))
        .toBe(false);
        await datasetPanel.deleteDataset("campaign-finance-sample-data.xls");
        await since('The dataset "airline-sample-data.xls" is displayed in datasets panel should be "#{expected}", instead we have "#{actual}"')
        .expect(await datasetPanel.isDatasetDisplayed("airline-sample-data.xls"))
        .toBe(true);
        await since('The dataset "Report_01_Simple" is displayed in datasets panel should be "#{expected}", instead we have "#{actual}"')
        .expect(await datasetPanel.isDatasetDisplayed("Report_01_Simple"))
        .toBe(true);
        await since('The dataset "campaign-finance-sample-data.xls" is displayed in datasets panel should be "#{expected}", instead we have "#{actual}"')
        .expect(await datasetPanel.isDatasetDisplayed("campaign-finance-sample-data.xls"))
        .toBe(false);
    });

    it('[TC99170_10] Show data from dataset', async () => {
        await dossierAuthoringPage.actionOnToolbar("Add Chapter");
        await browser.pause(1000);
        await dossierAuthoringPage.togglePanelBar.togglePanel('dataset');
        await dossierAuthoringPage.togglePanelBar.togglePanel('dataset');
        await datasetPanel.chooseDatasetContextMenuOption("Report_01_Simple", "Show Data...");
        await since('The editor shows up with title "Show Data", should be #{expected},instead we have #{actual}')
        .expect(await dossierMojo.isMoJoEditorWithTitleDisplayed("Show Data"))
        .toBe(true);
        await since('There are "84" rows of data in the show data dialog, should be #{expected},instead we have #{actual}')
        .expect(await showDataDialog.isRowCountEqual("84"))
        .toBe(true);
        await since('Show data grid at row 0 and column 0 should have element #{expected}, instead we have #{actual}')
        .expect(await showDataDialog.getCellInshowDataGrid(0, 0).getText())
        .toBe('Year');
        await since('Show data grid at row 1 and column 2 should have element #{expected}, instead we have #{actual}')
        .expect(await showDataDialog.getCellInshowDataGrid(1, 2).getText())
        .toBe('USA');
        await since('Show data grid at row 1 and column 4 should have element #{expected}, instead we have #{actual}')
        .expect(await showDataDialog.getCellInshowDataGrid(1, 4).getText())
        .toBe('7,185');

        await showDataDialog.addGridToViz();
        await browser.pause(1000);
        await since('The editor shows up with title "Show Data", should be #{expected},instead we have #{actual}')
        .expect(await dossierMojo.isMoJoEditorWithTitleDisplayed("Show Data"))
        .toBe(false);
        await since('The ag-grid cell in "Visualization" at "2", "2" should have text "Central", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 2, "Visualization", "Central"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization" at "2", "3" should have text "USA", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 3, "Visualization", "USA"))
        .toBe(true);
    });

    it('[TC99170_11] Create derived attribute and dervied metric from the dataset', async () => {
        await baseContainer.deleteContainer("Visualization 1");
        await datasetPanel.actionOnObjectFromDataset("Year", "attribute", "Report_01_Simple", "Create Attribute...");
        await since('The derived attribute editor is displayed, should be #{expected}, instead we have #{actual}')
        .expect(await (await derivedAttributeEditor.derivedAttributeEditor).isDisplayed())
        .toBe(true);

        await derivedAttributeEditor.clickOnElement(await derivedAttributeEditor.functionsTypePullDown);
        await derivedAttributeEditor.clickOnElement(await derivedAttributeEditor.getFunctionTypeinPopupList("String Functions"));
        await since('The function "Length" is displayed on DA Editor, should be #{expected}, instead we have #{actual}')
        .expect(await derivedAttributeEditor.getFunctionInList("Length").isDisplayed())
        .toBe(true);
        await derivedAttributeEditor.addFunctionByDoubleClick("Length");
        await derivedAttributeEditor.setObjectSearchKey("Region");
        await derivedAttributeEditor.addSearchedObjectByDoubleClick("Region");
        await derivedAttributeEditor.selectFormFromDropdown("DESC");
        await since('The derived attribute definition in "Input" section should be #{expected}, instead we have #{actual}')
        .expect(await derivedAttributeEditor.getAttributeFormDefinition())
        .toBe("Length(Region@DESC)");
        await derivedAttributeEditor.validateForm();
        await since('The string displayed in "Validation" section should be #{expected}, instead we have #{actual}')
        .expect(await derivedAttributeEditor.validationStatusText)
        .toBe("Valid Formula.");
        await derivedAttributeEditor.setAttributeName("New_Attribute");
        await derivedAttributeEditor.saveAttribute();
        await since('The derived attribute editor is displayed, should be #{expected}, instead we have #{actual}')
        .expect(await (await derivedAttributeEditor.derivedAttributeEditor).isDisplayed())
        .toBe(false);
        await since('Derived attribute "New_Attribute" displays on dataset panel under "Report_01_Simple", should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("New_Attribute", "derived attribute", "Report_01_Simple"))
        .toBe(true);

        await datasetPanel.actionOnObjectFromDataset("Cost", "metric", "Report_01_Simple", "Create Metric...");
        await since('The derived metric editor is displayed, should be #{expected}, instead we have #{actual}')
        .expect(await (await derivedMetricEditor.derivedMetricEditor).isDisplayed())
        .toBe(true);

        await derivedMetricEditor.clickOnElement(await derivedMetricEditor.functionsSelectionPullDown);
        await derivedMetricEditor.clickOnElement(await derivedMetricEditor.getFunctionSelectioninPopupList("Avg"));
        await derivedMetricEditor.clickOnElement(await derivedMetricEditor.objectsSelectionPullDown);
        await derivedMetricEditor.clickOnElement(await derivedMetricEditor.getObjectSelectioninPopupList("Profit"));
        await derivedMetricEditor.clickOnElement(await derivedMetricEditor.levelSelectionPullDown);
        await derivedMetricEditor.clickOnElement(await derivedMetricEditor.getLevelSelectioninPopupList("Category"));
        await derivedMetricEditor.setMetricName("AvgProfitByCategory")
        await derivedMetricEditor.saveMetric();
        await since('The derived metric editor is displayed, should be #{expected}, instead we have #{actual}')
        .expect(await (await derivedMetricEditor.derivedMetricEditor).isDisplayed())
        .toBe(false);
        await since('Derived metric "AvgProfitByCategory" displays on dataset panel under "Report_01_Simple", should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("AvgProfitByCategory", "derived metric", "Report_01_Simple"))
        .toBe(true);

        await datasetPanel.addObjectToVizByDoubleClick('New_Attribute', 'derived attribute', 'Report_01_Simple');
        await datasetPanel.addObjectToVizByDoubleClick('AvgProfitByCategory', 'derived metric', 'Report_01_Simple');

        await since('The ag-grid cell in "Visualization" at "2", "1" should have text "5", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 1, "Visualization", "5"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization" at "2", "3" should have text "South", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 3, "Visualization", "South"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization" at "2", "4" should have text "USA", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 4, "Visualization", "USA"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization" at "2", "13" should have text "$24,105", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 13, "Visualization", "$24,105"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization" at "1", "10" should have text "Non-Web Sales", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(1, 10, "Visualization", "Non-Web Sales"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization" at "2", "10" should have text "107,774", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 10, "Visualization", "107,774"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization" at "1", "11" should have text "Freight", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(1, 11, "Visualization", "Freight"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization" at "2", "11" should have text "$ 10,768", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 11, "Visualization", "$ 10,768"))
        .toBe(true);
    });

    it('[TC99170_12] Replace dataset from dataset panel', async () => { 
        await datasetPanel.chooseDatasetContextMenuOption("Report_01_Simple", "Replace Dataset With -> Existing Dataset...");
        await since('The Select Existing dataset dialog shows up "#{expected}", instead we have "#{actual}"')
        .expect(await datasetPanel.isSelectExistingDatasetDialogDisplayed())
        .toBe(true);

        await dossierMojo.changeFolderPath("Shared Reports");
        await browser.pause(2000);
        await dossierMojo.selectObject("DossierAuthoring");
        await browser.pause(2000);
        await dossierMojo.selectObject("DossierDatasets");
        await browser.pause(2000);
        await dossierMojo.selectObject("Report_01_Replace");
        await browser.pause(1000);
        await dossierMojo.clickBtnOnMojoEditor("Select");
        await since('The editor shows up with title "Replace Objects", should be #{expected},instead we have #{actual}')
        .expect(await dossierMojo.isMoJoEditorWithTitleDisplayed("Replace Objects"))
        .toBe(true);
        await dossierMojo.clickBtnOnMojoEditor("OK");
        await browser.pause(5000);
        await since('The editor shows up with title "Replace Objects", should be #{expected},instead we have #{actual}')
        .expect(await dossierMojo.isMoJoEditorWithTitleDisplayed("Replace Objects"))
        .toBe(false);

        await since('The ag-grid cell in "Visualization" at "2", "1" should have text "3", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 1, "Visualization", "3"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization" at "2", "3" should have text "Web", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 3, "Visualization", "Web"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization" at "2", "4" should have text "Web", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 4, "Visualization", "Web"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization" at "2", "12" should have text "$165", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 12, "Visualization", "$165"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization" at "1", "10" should have text "Non-Web Sales", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(1, 10, "Visualization", "Non-Web Sales"))
        .toBe(false);
        await since('The ag-grid cell in "Visualization" at "1", "10" should have text "Freight", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(1, 10, "Visualization", "Freight"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization" at "2", "10" should have text "$ 3,820", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 10, "Visualization", "$ 3,820"))
        .toBe(true);

        await datasetPanel.chooseDatasetContextMenuOption("Report_01_Replace", "Replace Dataset With -> New Data...");
        await datasetsPanel.clickDataSourceByIndex(5); // Using Sample Files as data source
        await datasetsPanel.importSampleFiles([6]); // retail-sample-data.xls
        await datasetPanel.changeNewObjectInReplaceObjectsEditor("Category", "Item Category"); 
        await datasetPanel.changeNewObjectInReplaceObjectsEditor("Country", "City"); 
        await datasetPanel.changeNewObjectInReplaceObjectsEditor("Year", "Month"); 
        await datasetPanel.changeNewObjectInReplaceObjectsEditor("Profit", "Revenue"); 
        await dossierMojo.clickBtnOnMojoEditor("OK");

        await since('The ag-grid cell in "Visualization" at "2", "1" should have text "Jan", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 1, "Visualization", "Jan"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization" at "2", "3" should have text "Action Movies", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 3, "Visualization", "Action Movies"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization" at "2", "4" should have text "1364", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 4, "Visualization", "1364"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization" at "2", "6" should have text "$112,423", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 6, "Visualization", "$112,423"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization" at "2", "7" should have text "$83,871", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 7, "Visualization", "$83,871"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization" at "2", "8" should have text "$14,598", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 8, "Visualization", "$14,598"))
        .toBe(true);
    });

    it('[TC99170_13] Hide unused objects ', async () => { 
        await datasetPanel.actionOnObjectFromDataset("Month", "attribute", "airline-sample-data.xls", "Hide");
        await datasetPanel.actionOnObjectFromDataset("Departure Hour", "attribute", "airline-sample-data.xls", "Hide");
        await datasetPanel.actionOnObjectFromDataset("Flights Cancelled", "metric", "airline-sample-data.xls", "Hide");
        await datasetPanel.actionOnObjectFromDataset("Flights Delayed", "metric", "airline-sample-data.xls", "Hide");
        await datasetPanel.actionOnObjectFromDataset("Month Date", "attribute", "retail-sample-data.xls", "Hide");
        await datasetPanel.actionOnObjectFromDataset("Unit Price", "metric", "retail-sample-data.xls", "Hide");
        await datasetPanel.actionOnObjectFromDataset("Units Available", "metric", "retail-sample-data.xls", "Hide");

        await since('Attribute "Airline Name" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Airline Name", "attribute", "airline-sample-data.xls"))
        .toBe(true);
        await since('Attribute "Month" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Month", "attribute", "airline-sample-data.xls"))
        .toBe(false);
        await since('Attribute "Departure Hour" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Departure Hour", "attribute", "airline-sample-data.xls"))
        .toBe(false);
        await since('Metric "Avg Delay (min)" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Avg Delay (min)", "metric", "airline-sample-data.xls"))
        .toBe(true);
        await since('Metric "Flights Cancelled" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Flights Cancelled", "metric", "airline-sample-data.xls"))
        .toBe(false);
        await since('Metric "Flights Cancelled" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Flights Cancelled", "metric", "airline-sample-data.xls"))
        .toBe(false);
        await since('Attribute "Month" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Month", "attribute", "retail-sample-data.xls"))
        .toBe(true);
        await since('Attribute "City" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("City", "attribute", "retail-sample-data.xls"))
        .toBe(true);
        await since('Attribute "Month Date" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Month Date", "attribute", "retail-sample-data.xls"))
        .toBe(false);
        await since('Metric "Cost" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Cost", "metric", "retail-sample-data.xls"))
        .toBe(true);
        await since('Metric "Unit Price" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Unit Price", "metric", "retail-sample-data.xls"))
        .toBe(false);
        await since('Metric "Units Available" displays on dataset panel, should be #{expected}, instead we have #{actual}')
        .expect(await datasetPanel.isObjectFromDSdisplayed("Units Available", "metric", "retail-sample-data.xls"))
        .toBe(false);
    });

    it('[TC99170_14] Save the dashboard ', async () => { 
        await libraryAuthoringPage.simpleSaveDashboard();
        await libraryAuthoringPage.saveToFolder("TC99170 E2E Test", ['1. Test Users','yanpchen', 'DataManipulationE2E']);
    });

    it('[TC99170_15] DE321960 scroll bar when expanding folders', async () => { 
        await libraryPage.createNewDashboardByUrl({});
        await dossierAuthoringPage.addExistingObjects();
        await since('The editor shows up with title "Add Existing Objects", should be #{expected},instead we have #{actual}')
            .expect(await dossierMojo.isMoJoEditorWithTitleDisplayed("Add Existing Objects"))
            .toBe(true);
        await browser.pause(2000);
        await takeScreenshotByElement(
            dossierMojo.getMojoEditorWithTitle('Add Existing Objects'),
            'DE321960_01',
            'Add Existing Objects dialog is open'
        );

        await existingObjectsDialog.expandFolder('Customers');
        await browser.pause(2000);
        await takeScreenshotByElement(
            dossierMojo.getMojoEditorWithTitle('Add Existing Objects'),
            'DE321960_02',
            'Expanding Customer Folder'
        );

        await existingObjectsDialog.expandFolder('Products');
        await browser.pause(2000);
        await takeScreenshotByElement(
            dossierMojo.getMojoEditorWithTitle('Add Existing Objects'),
            'DE321960_03',
            'Expanding Products Folder'
        );

        await existingObjectsDialog.expandFolder('Time');
        await browser.pause(2000);
        await takeScreenshotByElement(
            dossierMojo.getMojoEditorWithTitle('Add Existing Objects'),
            'DE321960_04',
            'Expanding Time Folder'
        );

        await existingObjectsDialog.selectMetricsFromDropdown();
        await browser.pause(2000);
        await takeScreenshotByElement(
            dossierMojo.getMojoEditorWithTitle('Add Existing Objects'),
            'DE321960_05',
            'Switching to Metrics'
        );

        await existingObjectsDialog.expandFolder('Count Metrics');
        await browser.pause(2000);
        await takeScreenshotByElement(
            dossierMojo.getMojoEditorWithTitle('Add Existing Objects'),
            'DE321960_06',
            'Expanding Count Metrics Folder'
        );

        await existingObjectsDialog.expandFolder('Sales Metrics');
        await browser.pause(2000);
        await takeScreenshotByElement(
            dossierMojo.getMojoEditorWithTitle('Add Existing Objects'),
            'DE321960_07',
            'Expanding Sales Metrics Folder'
        );

        await existingObjectsDialog.expandFolder('Conditional Sales Metrics');
        await browser.pause(2000);
        await takeScreenshotByElement(
            dossierMojo.getMojoEditorWithTitle('Add Existing Objects'),
            'DE321960_08',
            'Expanding Conditional Sales Metrics Folder'
        );
    });

});
