import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import * as gridConstants from '../../../constants/grid.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_sort') };
const { credentials } = specConfiguration;

//npm run regression -- --baseUrl=https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --spec 'specs/regression/classicGrid/NormalGrid_DerivedObject.spec.js'
describe('Normal Grid Derived Object', () => {
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
        editorPanelForGrid,
        derivedMetricEditor,
        derivedAttributeEditor,
        loginPage,
        dossierPage,
    } = browsers.pageObj1;

    it('[TC75245] Editing derived elements in normal grid', async () => {
         // Edit dossier by its ID "D8FC8951254866309A0301BC0364C3C5"
         // New MicroStrategy Tutorials > Shared Reports > Automation Objects > Normal Grid > DerivedObjec_TC75245
         await libraryPage.editDossierByUrl({
             projectId: gridConstants.Grid_Derived_Object.project.id,
             dossierId: gridConstants.Grid_Derived_Object.id,
         });
        //  When I right click on element "Percentile Rank (Avg Delay (min))" and select "Edit..." from visualization "Simple"
        await vizPanelForGrid.selectContextMenuOptionFromElement(
            "Percentile Rank (Avg Delay (min))",
            "Edit...",
            "Simple"
        );
        await derivedMetricEditor.waitForLoadingFinish();
        await takeScreenshotByElement(
            derivedMetricEditor.derivedMetricEditor,
            'TC75245_1',
            'Derived Metric Editor is displayed with functions panel'
        );
        //  When I set the Metric Name value to "NewDM1" in the simple DM editor open from Edit
        await derivedMetricEditor.setMetricNameOpenFromEdit('NewDM1');
        //  And I click on the "Save" button of DM Editor when the Editor is triggered from "Edit..."
        await derivedMetricEditor.saveMetricEditorOpenFromEdit();
        //  Then The editor panel should have "metric" named "NewDM1" on "Metrics" section
        await since('The editor panel should have "metric" named "NewDM1" on "Metrics" section')
            .expect(await editorPanelForGrid.getObjectFromSection('NewDM1', 'metric', 'Metrics').isExisting())
            .toBe(true);
        //  When I right click on element "NewDM1" and select "Edit..." from visualization "Simple"
        await vizPanelForGrid.selectContextMenuOptionFromElement(
            "NewDM1",
            "Edit...",
            "Simple"
        );
        await browser.pause(2000);
        //  Then The Metric Editor should be "displayed"
        //  And The dossier's screenshot "NewDM1MetricEditor" should match the baselines
        await takeScreenshotByElement(
            derivedMetricEditor.derivedMetricEditor,
            'TC75245_2',
            "The Metric Editor is displayed when editing 'NewDM1'"
        );
        //  And I click on the "Save" button of DM Editor when the Editor is triggered from "Edit..."
        await derivedMetricEditor.saveMetricEditorOpenFromEdit();

        // When I right click on element "New Metric" and select "Edit..." from visualization "Simple"
        await vizPanelForGrid.selectContextMenuOptionFromElement(
            "New Metric",
            "Edit...",
            "Simple"
        );
        // Then The Metric Editor should be "displayed"
        // When I set the Metric Name value to "NewDM2" in the formula DM editor
        await derivedMetricEditor.setFormulaMetricName('NewDM2');
        // And I click on the "Save" button in formula DM Editor
        await derivedMetricEditor.saveFormulaMetric();
        // Then The editor panel should have "metric" named "NewDM2" on "Metrics" section
        await since('The editor panel should have "metric" named "NewDM2" on "Metrics" section')
            .expect(await editorPanelForGrid.getObjectFromSection('NewDM2', 'metric', 'Metrics').isExisting())
            .toBe(true);
        // When I right click on element "NewDM2" and select "Edit..." from visualization "Simple"
        await vizPanelForGrid.selectContextMenuOptionFromElement(
            "NewDM2",
            "Edit...",
            "Simple"
        );
        await browser.pause(2000);
        // And The dossier's screenshot "NewDM2MetricEditor" should match the baselines
        await takeScreenshotByElement(
            derivedMetricEditor.derivedMetricEditor,
            'TC75245_3',
            "The Metric Editor is displayed when editing 'NewDM2'"
        );
        // And I click on the "Save" button in formula DM Editor
        await derivedMetricEditor.saveFormulaMetric();

        // #edit derived attribute from grid
        // When I right click on element "New attribute" and select "Edit..." from visualization "Simple" 
        await vizPanelForGrid.selectContextMenuOptionFromElement(
            "New attribute",
            "Edit...",
            "Simple"
        );
        await browser.pause(2000);
        // Then The Attribute Editor should be "displayed"
        await takeScreenshotByElement(
            derivedAttributeEditor.derivedAttributeEditor,
            'TC75245_4',
            'Derived Attribute Editor is displayed'
        );
        // When I set the Attribute Name value to "NewDA1"
        await derivedAttributeEditor.setAttributeName('NewDA1');
        // And I click on the "Save" button of DA Editor
        await derivedAttributeEditor.saveAttribute();
        // Then The Attribute Editor should be "hidden"
        // Then The editor panel should have "derived attribute" named "NewDA1" on "Rows" section
        await since('The editor panel should have "derived attribute" named "NewDA1" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSection('NewDA1', 'derived attribute', 'Rows').isExisting())
            .toBe(true);
        // When I right click on element "NewDA1" and select "Edit..." from visualization "Simple"
        await vizPanelForGrid.selectContextMenuOptionFromElement(
            "NewDA1",
            "Edit...",
            "Simple"
        );
        await browser.pause(2000);
        // And The dossier's screenshot "NewDA1AttrEditor" should match the baselines
        await takeScreenshotByElement(
            derivedAttributeEditor.derivedAttributeEditor,
            'TC75245_5',
            "The Attribute Editor is displayed when editing 'NewDA1'"
        );
        // And I click on the "Save" button of DA Editor
        await derivedAttributeEditor.saveAttribute();
    
    });
});
