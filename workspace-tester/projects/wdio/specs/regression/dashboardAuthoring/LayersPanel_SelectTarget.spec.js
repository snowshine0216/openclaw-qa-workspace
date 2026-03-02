import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import * as consts from '../../../constants/visualizations.js';
import NewFormatPanelForGrid from '../../../pageObjects/authoring/format-panel/NewFormatPanelForGrid.js';
import InCanvasSelector_Authoring from '../../../pageObjects/authoring/InCanvasSelector_Authoring.js';
import setWindowSize from '../../../config/setWindowSize.js';
import HtmlContainer_Authoring from '../../../pageObjects/authoring/HtmlContainer_Authoring.js';
import { SelectTargetInLayersPanel } from '../../../pageObjects/authoring/SelectTargetInLayersPanel.js';
import GridValidators from '../../../pageObjects/authoring/grid/validators/GridValidators.js';
import DossierMojoEditor from '../../../pageObjects/authoring/DossierMojoEditor.js';

const specConfiguration = { ...customCredentials('_sort') };
const { credentials } = specConfiguration;

//npm run regression -- --baseUrl=https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --spec 'specs/regression/dashboardAuthoring/LayersPanel_SelectTarget.spec.js'
describe('Select targets action in container/LayerPanel, cover freeform and auto canvas', () => {
    // Test data constants
    const TUTORIAL_PROJECT = {
        id: 'B628A31F11E7BD953EAE0080EF0583BD',
        name: 'MicroStrategy Tutorial',
    };

    const SELECTTARGET_E2E_DOSSIER = {
        id: '0B74D644AB4ADD2C6A2446B8B18F0E18',
        name: 'SelectTargetAutomation_E2E',
        project: TUTORIAL_PROJECT,
    };

    const BROWSER_CONFIG = {
        width: 1600,
        height: 1200,
    };

    // Page objects destructuring
    let {
        libraryPage,
        dossierPage,
        baseContainer,
        contentsPanel,
        loginPage,
        layerPanel,
        inCanvasSelector_Authoring,
    } = browsers.pageObj1;

    const selectTargetInLayersPanel = new SelectTargetInLayersPanel();

    beforeAll(async () => {
        await loginPage.login(consts.tqmsUser.credentials);
        await setWindowSize(BROWSER_CONFIG);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    /**
     * Helper function to verify current page
     */
    async function verifyCurrentPage(chapterName, pageName) {
        const isPageDisplayed = await (await contentsPanel.getPage({ chapterName, pageName })).isDisplayed();
        await since(`Page "${pageName}" in chapter "${chapterName}" should be current - expected: true, actual: #{actual}`)
            .expect(isPageDisplayed)
            .toBe(true);
    }

    /**
     * Helper function to open dossier
     */
    async function openTestDossier() {
        const url = browser.options.baseUrl + `app/${TUTORIAL_PROJECT.id}/${SELECTTARGET_E2E_DOSSIER.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());
    }

    describe('Select targets by container', () => {
        it('[TC60401_01] Select Targets in auto canvas', async () => {
            await openTestDossier();

            //# 1.0 - One Viz targetting another Viz in a single page
            await contentsPanel.goToPage({ chapterName: 'Auto Canvas 1', pageName: 'Page 1' });
            // When I use the visualization "Visualization 1" as a filter
            await baseContainer.selectTargetVisualizations('Visualization 1');
            // Then A select source button appears on the Viz "Visualization 1"
            await selectTargetInLayersPanel.getSourceButton('Visualization 1').waitForDisplayed();
            // When I click on container "Visualization 2" to select it
            await baseContainer.clickContainer('Visualization 2');
            // Then A target button appears on the viz "Visualization 2"
            await selectTargetInLayersPanel.getTargetButton('Visualization 2').waitForDisplayed();
            // When I click on apply button
            await selectTargetInLayersPanel.applyButtonForSelectTarget();

            // # 1.1 - One viz in a page targetting another viz in different page withing the chapter
            // When I use the visualization "Visualization 3" as a filter
            await baseContainer.selectTargetVisualizations('Visualization 3');
            // Then A select source button appears on the Viz "Visualization 3"
            await selectTargetInLayersPanel.getSourceButton('Visualization 3').waitForDisplayed();
            // When I switch to page "Page 2" in chapter "Auto Canvas 1" from contents panel
            await contentsPanel.goToPage({ chapterName: 'Auto Canvas 1', pageName: 'Page 2' });
            // Then Page "Page 2" in chapter "Auto Canvas 1" is the current page
            await verifyCurrentPage('Auto Canvas 1', 'Page 2');
            // When I click on container "Visualization 1" to select it
            await baseContainer.clickContainer('Visualization 1');
            // Then A target button appears on the viz "Visualization 1"
            await selectTargetInLayersPanel.getTargetButton('Visualization 1').waitForDisplayed();
            // When I click on apply button
            await selectTargetInLayersPanel.applyButtonForSelectTarget();

            // # 1.3 - One Element/Value filter targeting a Viz in a single page 
            // Then A select target button appears on the selector "ORDERS"
            await inCanvasSelector_Authoring.checkPresenceOfSelectTrgtBtn('ORDERS');
            // When I select following visualization "Visualization 1" as targets for selector "ORDERS"
            // await inCanvasSelector_Authoring.selectTargetVizFromWithinSelector('Visualization 1', 'ORDERS');
            await selectTargetInLayersPanel.selectTargetButton('ORDERS');
            // Then I click on container "Visualization 1" to select it
            await baseContainer.clickContainer('Visualization 1');
            // And A target button appears on the viz "Visualization 1"
            await selectTargetInLayersPanel.getTargetButton('Visualization 1').waitForDisplayed();
            await selectTargetInLayersPanel.applyButtonForSelectTarget();

            // # 1.4 - One AM Selector filter targeting a Viz in a single page
            // Then A select target button appears on the selector "ITEM"
            await inCanvasSelector_Authoring.checkPresenceOfSelectTrgtBtn('Selector 1');
            // When I select following visualization "Visualization 1" as targets for selector "ITEM"
            await selectTargetInLayersPanel.selectTargetButton('Selector 1');
            // Then I click on container "Visualization 1" to select it
            await baseContainer.clickContainer('Visualization 1');
            // Then I click on Select an Attribute or Metrics from AM list of object to replace window and select "ITEM"
            await selectTargetInLayersPanel.objectToReplace('LOCATION');
            // When I click on apply button
            await selectTargetInLayersPanel.applyButtonForSelectTarget();

        });

        it('[TC60401_02] Select Targets in freeform layout', async () => {
            await openTestDossier();

            //# 2.0 - One Viz targetting another Viz in a single page
            await contentsPanel.goToPage({ chapterName: 'Free form Layout 1', pageName: 'Page 1' });
            // When I use the visualization "Visualization 1" as a filter
            await baseContainer.selectTargetVisualizations('Visualization 1');
            // Then A select source button appears on the Viz "Visualization 1"
            await selectTargetInLayersPanel.getSourceButton('Visualization 1').waitForDisplayed();
            // When I click on container "Visualization 2" to select it
            await baseContainer.clickContainer('Visualization 2');
            // Then A target button appears on the viz "Visualization 2"
            await selectTargetInLayersPanel.getTargetButton('Visualization 2').waitForDisplayed();
            // When I click on apply button
            await selectTargetInLayersPanel.applyButtonForSelectTarget();

            // # 2.1 - One viz in a page targetting another viz in different page withing the chapter
            // When I use the visualization "Visualization 2" as a filter
            await baseContainer.selectTargetVisualizations('Visualization 2');
            // Then A select source button appears on the Viz "Visualization 2"
            await selectTargetInLayersPanel.getSourceButton('Visualization 2').waitForDisplayed();
            // When I switch to page "Page 2" in chapter "Free form Layout 1" from contents panel
            await contentsPanel.goToPage({ chapterName: 'Free form Layout 1', pageName: 'Page 2' });
            // Then Page "Page 2" in chapter "Free form Layout 1" is the current page
            await verifyCurrentPage('Free form Layout 1', 'Page 2');
            // When I click on container "Visualization 1" to select it
            await baseContainer.clickContainer('Visualization 2');
            // Then A target button appears on the viz "Visualization 1"
            await selectTargetInLayersPanel.getTargetButton('Visualization 2').waitForDisplayed();
            // When I click on apply button
            await selectTargetInLayersPanel.applyButtonForSelectTarget();

            // # 2.3 - One Element/Value filter targeting a Viz in a single page 
            // Then A select target button appears on the selector "ORDERS"
            await inCanvasSelector_Authoring.checkPresenceOfSelectTrgtBtn('ORDERS');
            // When I select following visualization "Visualization 1" as targets for selector "ORDERS"
            await selectTargetInLayersPanel.selectTargetButton('ORDERS');
            // Then I click on container "Visualization 1" to select it
            await baseContainer.clickContainer('Visualization 1');
            // And A target button appears on the viz "Visualization 1"
            await selectTargetInLayersPanel.getTargetButton('Visualization 1').waitForDisplayed();
            await selectTargetInLayersPanel.applyButtonForSelectTarget();

            // # 2.4 - One AM Selector filter targeting a Viz in a single page
            // Then A select target button appears on the selector "Selector 1"
            await inCanvasSelector_Authoring.checkPresenceOfSelectTrgtBtn('Selector 1');
            // When I select following visualization "Visualization 1" as targets for selector "Selector 1"
            await selectTargetInLayersPanel.selectTargetButton('Selector 1');
            // Then I click on container "Visualization 1" to select it
            await baseContainer.clickContainer('Visualization 2');
            // Then I click on Select an Attribute or Metrics from AM list of object to replace window and select "LOCATION"
            await selectTargetInLayersPanel.objectToReplace('LOCATION');
            // When I click on apply button
            await selectTargetInLayersPanel.applyButtonForSelectTarget();
        });
    });

    describe('Manipulation in Layers panel for select target', () => {
        it('[TC60401_03] Select Targets in auto canvas', async () => {
            await openTestDossier();

            // # 3.1 - Modification from Layers panel to select target across the Viz
            // When I switch to page "Page 1" in chapter "Free form Layout 1" from contents panel
            await contentsPanel.goToPage({ chapterName: 'Free form Layout 1', pageName: 'Page 1' });
            // When I use the visualization "Visualization 3" as a filter
            await baseContainer.selectTargetVisualizations('Visualization 3');
            // Then A select source button appears on the Viz "Visualization 3"
            await selectTargetInLayersPanel.getSourceButton('Visualization 3').waitForDisplayed();
            // And A source icon appears on the viz "Visualization 3" in layers panel
            await since('A source icon appears on the viz "Visualization 3" in layers panel')
                .expect(await selectTargetInLayersPanel.getSourceIconInLayersPanel('Visualization 3').isDisplayed())
                .toBe(true);
            // When I click on container "Visualization 2" from layers panel
            await layerPanel.clickOnContainerFromLayersPanel('Visualization 2');
            // Then A target icon appears on the viz "Visualization 2" in layers panel
            await since('A target icon appears on the viz "Visualization 2" in layers panel, instead we have #{actual}')
                .expect(await selectTargetInLayersPanel.getTargetIconInLayersPanel('Visualization 2').isDisplayed())
                .toBe(true);
            // When I click on apply button
            await selectTargetInLayersPanel.applyButtonForSelectTarget();

            // # 3.2 - Free-form layout target selection in case of AM selector for edit target Visualization and selecting other visualization as target
            // Then A select target button appears on the selector "ORDERS"
            await inCanvasSelector_Authoring.checkPresenceOfSelectTrgtBtn('Selector 1');
            // When I click on select target as source for selector "ORDERS"
            await selectTargetInLayersPanel.selectTargetButton('Selector 1');
            // And A select source button appears on the Viz "ORDERS"
            await selectTargetInLayersPanel.getSourceButton('Selector 1').waitForDisplayed();
            // And A source icon appears on the viz "Selector 1" in layers panel
            await since('A source icon appears on the viz "Selector 1" in layers panel')
                .expect(await selectTargetInLayersPanel.getSourceIconInLayersPanel('Selector 1').isDisplayed())
                .toBe(true);
            // When I click on container "Visualization 1" from layers panel
            await layerPanel.clickOnContainerFromLayersPanel('Visualization 1');
            // Then I click on Select an Attribute or Metrics from AM list of object to replace window and select "ORDERS"
            await selectTargetInLayersPanel.selectAMSelectorListObject('Visualization 1', 'LOCATION');
            // And I click on apply button
            await selectTargetInLayersPanel.applyButtonForSelectTarget();

            // # 3.3 - Free-form layout target selection in case of Element/value filter
            // Then A select target button appears on the selector "ORDERS"
            await inCanvasSelector_Authoring.checkPresenceOfSelectTrgtBtn('ORDERS');
            // When I click on select target as source for selector "ORDERS"
            await selectTargetInLayersPanel.selectTargetButton('ORDERS');
            // And A source icon appears on the viz "ORDERS" in layers panel
            await since('A source icon appears on the viz "ORDERS" in layers panel')
                .expect(await selectTargetInLayersPanel.getSourceIconInLayersPanel('ORDERS').isDisplayed())
                .toBe(true);
            // When I click on container "Visualization 1" from layers panel
            await layerPanel.clickOnContainerFromLayersPanel('Visualization 1');
            // Then A target icon appears on the viz "Visualization 1" in layers panel
            await since('A target icon appears on the viz "Visualization 1" in layers panel, instead we have #{actual}')
                .expect(await selectTargetInLayersPanel.getTargetIconInLayersPanel('Visualization 1').isDisplayed())
                .toBe(true);
            // When I click on apply button
            await selectTargetInLayersPanel.applyButtonForSelectTarget();
        });

        it('[TC60401_04] select targets in group', async () => {
            await openTestDossier();

            // # 3.4 - Selecting targets in a group for visualization to visualization in a group - Viz to viz in a group
            // When I switch to page "Page 1" in chapter "Group" from contents panel
            await contentsPanel.goToPage({ chapterName: 'Group', pageName: 'Page 1' });
            // Then Page "Page 1" in chapter "Group" is the current page
            await verifyCurrentPage('Group', 'Page 1');
            // When I use the visualization "Visualization 3" as a filter
            await baseContainer.selectTargetVisualizations('Visualization 3');
            // Then A select source button appears on the Viz "Visualization 3"
            await selectTargetInLayersPanel.getSourceButton('Visualization 3').waitForDisplayed();
            // And A source icon appears on the viz "Visualization 3" in layers panel
            await since('A source icon appears on the viz "Visualization 3" in layers panel')
                .expect(await selectTargetInLayersPanel.getSourceIconInLayersPanel('Visualization 3').isDisplayed())
                .toBe(true);
            // When I expand group "Group2" from layers panel
            await layerPanel.expandORCollapseGroup('Group2', 'Expand');
            // When I click on container "Visualization 6" from layers panel
            await layerPanel.clickOnContainerFromLayersPanel('Visualization 6');
            // Then A target icon appears on the viz "Visualization 6" in layers panel
            await since('A target icon appears on the viz "Visualization 6" in layers panel, instead we have #{actual}')
                .expect(await selectTargetInLayersPanel.getTargetIconInLayersPanel('Visualization 6').isDisplayed())
                .toBe(true);
            // When I click on apply button
            await selectTargetInLayersPanel.applyButtonForSelectTarget();

            // # 3.5 - Selecting targets in a group for visualization in a group to visualization - Viz in a group to viz outside the group
            // And I use the visualization "Visualization 5" as a filter
            await baseContainer.selectTargetVisualizations('Visualization 5');
            // Then A select source button appears on the Viz "Visualization 5"
            await selectTargetInLayersPanel.getSourceButton('Visualization 5').waitForDisplayed();
            // And A source icon appears on the viz "Visualization 5" in layers panel
            await since('A source icon appears on the viz "Visualization 5" in layers panel')
                .expect(await selectTargetInLayersPanel.getSourceIconInLayersPanel('Visualization 5').isDisplayed())
                .toBe(true);
            // When I click on container "Visualization 2" from layers panel
            await layerPanel.clickOnContainerFromLayersPanel('Visualization 2');
            // And A target icon appears on the viz "Visualization 2" in layers panel
            await since('A target icon appears on the viz "Visualization 2" in layers panel, instead we have #{actual}')
                .expect(await selectTargetInLayersPanel.getTargetIconInLayersPanel('Visualization 2').isDisplayed())
                .toBe(true);
            // When I click on apply button
            await selectTargetInLayersPanel.applyButtonForSelectTarget();

            // # 3.6 - Selecting targets in a group for visualization to in a group to visualization - viz in a group to viz in another group
            // And I use the visualization "Visualization 4" as a filter
            await baseContainer.selectTargetVisualizations('Visualization 4');
            // Then A select source button appears on the Viz "Visualization 4"
            await selectTargetInLayersPanel.getSourceButton('Visualization 4').waitForDisplayed();
            // And A source icon appears on the viz "Visualization 4" in layers panel
            await since('A source icon appears on the viz "Visualization 4" in layers panel')
                .expect(await selectTargetInLayersPanel.getSourceIconInLayersPanel('Visualization 4').isDisplayed())
                .toBe(true);
            // When I expand group "Group3" from layers panel
            await layerPanel.expandORCollapseGroup('Group3', 'Expand');
            // When I click on container "Visualization 8" from layers panel
            await layerPanel.clickOnContainerFromLayersPanel('Visualization 8');
            // Then A target icon appears on the viz "Visualization 8" in layers panel
            await since('A target icon appears on the viz "Visualization 8" in layers panel, instead we have #{actual}')
                .expect(await selectTargetInLayersPanel.getTargetIconInLayersPanel('Visualization 8').isDisplayed())
                .toBe(true);
            // When I click on apply button
            await selectTargetInLayersPanel.applyButtonForSelectTarget();
        });
        it('[TC60401_05] select targets in group for filter', async () => {
            await openTestDossier();
            // When I switch to page "Page 1" in chapter "Group" from contents panel
            await contentsPanel.goToPage({ chapterName: 'Group', pageName: 'Page 1' });
            // Then Page "Page 1" in chapter "Group" is the current page
            await verifyCurrentPage('Group', 'Page 1');
            // # 3.7 - Select target for element/ value filter to select visualization in a group
            // Then A select target button appears on the selector "ORDERS"
            await inCanvasSelector_Authoring.checkPresenceOfSelectTrgtBtn('ORDERS');
            // When I click on select target as source for selector "ORDERS"
            await selectTargetInLayersPanel.selectTargetButton('ORDERS');
            // Then A select source button appears on the Viz "ORDERS"
            await selectTargetInLayersPanel.getSourceButton('ORDERS').waitForDisplayed();
            // When I expand group "Group3" from layers panel
            await layerPanel.expandORCollapseGroup('Group3', 'Expand');
            // When I click on container "Visualization 8" from layers panel
            await layerPanel.clickOnContainerFromLayersPanel('Visualization 8');
            // Then A target icon appears on the viz "Visualization 8" in layers panel
            await since('A target icon appears on the viz "Visualization 8" in layers panel, instead we have #{actual}')
                .expect(await selectTargetInLayersPanel.getTargetIconInLayersPanel('Visualization 8').isDisplayed())
                .toBe(true);
            // When I click on apply button
            await selectTargetInLayersPanel.applyButtonForSelectTarget();

            // # 3.8 - Select target for Attribute/Metric selector filter to select visualization in a group 
            // Then A select target button appears on the selector "Selector 1"
            await inCanvasSelector_Authoring.checkPresenceOfSelectTrgtBtn('Selector 1');
            // When I click on select target as source for selector "Selector 1"
            await selectTargetInLayersPanel.selectTargetButton('Selector 1');
            // Then A select source button appears on the Viz "Selector 1"
            await selectTargetInLayersPanel.getSourceButton('Selector 1').waitForDisplayed();
            // And A source icon appears on the viz "Selector 1" in layers panel
            await since('A source icon appears on the viz "Selector 1" in layers panel')
                .expect(await selectTargetInLayersPanel.getSourceIconInLayersPanel('Selector 1').isDisplayed())
                .toBe(true);
            // When I expand group "Group3" from layers panel
            // await layerPanel.expandORCollapseGroup('Group3', 'Expand');
            // When I click on container "Visualization 8" from layers panel
            await layerPanel.clickOnContainerFromLayersPanel('Visualization 8');
            // Then A target without default icon appears on the viz "Visualization 8" in layers panel
            await since('A target without default icon appears on the viz "Visualization 8" in layers panel, instead we have #{actual}')
                .expect(await selectTargetInLayersPanel.getTargetIconInLayersPanel('Visualization 8').isDisplayed())
                .toBe(true);
            // When I click on Select an Attribute or Metrics from AM list of object to replace window and select "SHIPMENTS"
            await selectTargetInLayersPanel.objectToReplace('SHIPMENTS');
            // When I click on apply button
            await selectTargetInLayersPanel.applyButtonForSelectTarget();
        });
        it('[TC60401_06] select entire group in layer panel', async () => {
            await openTestDossier();

            // When I switch to page "Page 1" in chapter "Group" from contents panel
            await contentsPanel.goToPage({ chapterName: 'Group', pageName: 'Page 1' });
            // Then Page "Page 1" in chapter "Group" is the current page
            await verifyCurrentPage('Group', 'Page 1');

            // # 3.10 - Select entire group for a Single visualizations in layers panel
            // # DE215876: Can't select a group by one click as target for viz/selector from layers panel
            // When I use the visualization "Visualization 1" as a filter
            await baseContainer.selectTargetVisualizations('Visualization 1');
            // When I click on group "Group2" from layers panel
            await layerPanel.clickOnContainerFromLayersPanel('Group2');
            // Then A target icon appears on the viz "Visualization 6" in layers panel
            await since('A target icon appears on the viz "Visualization 6" in layers panel, instead we have #{actual}')
                .expect(await selectTargetInLayersPanel.getTargetIconInLayersPanel('Visualization 6').isDisplayed())
                .toBe(true);
            // And A target icon appears on the viz "Visualization 5" in layers panel
            await since('A target icon appears on the viz "Visualization 5" in layers panel, instead we have #{actual}')
                .expect(await selectTargetInLayersPanel.getTargetIconInLayersPanel('Visualization 5').isDisplayed())
                .toBe(true);
            // And A target icon appears on the viz "Visualization 4" in layers panel
            await since('A target icon appears on the viz "Visualization 4" in layers panel, instead we have #{actual}')
                .expect(await selectTargetInLayersPanel.getTargetIconInLayersPanel('Visualization 4').isDisplayed())
                .toBe(true);
            // When I click on apply button
            await selectTargetInLayersPanel.applyButtonForSelectTarget();

            // # 3.11 - Select entire group for element-value filter in layers panel
            // Then A select target button appears on the selector "ORDERS"
            await inCanvasSelector_Authoring.checkPresenceOfSelectTrgtBtn('ORDERS');
            // When I click on select target as source for selector "ORDERS"
            await selectTargetInLayersPanel.selectTargetButton('ORDERS');
            // Then A select source button appears on the Viz "ORDERS"
            await selectTargetInLayersPanel.getSourceButton('ORDERS').waitForDisplayed();
            // And A source icon appears on the viz "ORDERS" in layers panel
            await since('A source icon appears on the viz "ORDERS" in layers panel')
                .expect(await selectTargetInLayersPanel.getSourceIconInLayersPanel('ORDERS').isDisplayed())
                .toBe(true);
            // # When I expand group "Group2" from layers panel
            // When I click on group "Group2" from layers panel
            await layerPanel.clickOnContainerFromLayersPanel('Group2');
            // Then A target icon appears on the viz "Visualization 6" in layers panel
            await since('A target icon appears on the viz "Visualization 6" in layers panel, instead we have #{actual}')
                .expect(await selectTargetInLayersPanel.getTargetIconInLayersPanel('Visualization 6').isDisplayed())
                .toBe(true);
            // And A target icon appears on the viz "Visualization 5" in layers panel
            await since('A target icon appears on the viz "Visualization 5" in layers panel, instead we have #{actual}')
                .expect(await selectTargetInLayersPanel.getTargetIconInLayersPanel('Visualization 5').isDisplayed())
                .toBe(true);
            // And A target icon appears on the viz "Visualization 4" in layers panel
            await since('A target icon appears on the viz "Visualization 4" in layers panel, instead we have #{actual}')
                .expect(await selectTargetInLayersPanel.getTargetIconInLayersPanel('Visualization 4').isDisplayed())
                .toBe(true);
            // When I click on apply button
            await selectTargetInLayersPanel.applyButtonForSelectTarget();
        });

        it('[TC60401_07] AM selector manipulation in layer panel', async () => {
            await openTestDossier();

            // When I switch to page "Page 1" in chapter "Group" from contents panel
            await contentsPanel.goToPage({ chapterName: 'Group', pageName: 'Page 1' });
            // Then Page "Page 1" in chapter "Group" is the current page
            await verifyCurrentPage('Group', 'Page 1');

            // # 3.12 - Select entire group for Attribute/metric selector in layers panel
            // Then A select target button appears on the selector "Selector 1"
            await inCanvasSelector_Authoring.checkPresenceOfSelectTrgtBtn('Selector 1');
            // When I click on select target as source for selector "Selector 1"
            await selectTargetInLayersPanel.selectTargetButton('Selector 1');
            // Then A select source button appears on the Viz "Selector 1"
            await selectTargetInLayersPanel.getSourceButton('Selector 1').waitForDisplayed();
            // And A source icon appears on the viz "Selector 1" in layers panel
            await since('A source icon appears on the viz "Selector 1" in layers panel')
                .expect(await selectTargetInLayersPanel.getSourceIconInLayersPanel('Selector 1').isDisplayed())
                .toBe(true);
            // When I click on group "Group2" from layers panel
            await layerPanel.clickOnContainerFromLayersPanel('Group2');
            // When I click on Select an Attribute or Metrics from AM list of object to replace window for "Visualization 4"
            await selectTargetInLayersPanel.selectAMSelectorListObject('Visualization 4', 'SHIPMENTS');
            // Then A target without default icon appears on the viz "Visualization 4" in layers panel
            await since('A target without default icon appears on the viz "Visualization 4" in layers panel, instead we have #{actual}')
                .expect(await selectTargetInLayersPanel.getTargetIconInLayersPanel('Visualization 4').isDisplayed())
                .toBe(true);
            // Then A target without default icon appears on the viz "Visualization 5" in layers panel
            await since('A target without default icon appears on the viz "Visualization 5" in layers panel, instead we have #{actual}')
                .expect(await selectTargetInLayersPanel.getTargetIconInLayersPanel('Visualization 5').isDisplayed())
                .toBe(true);
            // And I click on element "SHIPMENTS" for object to replace window for multiple groups
            await selectTargetInLayersPanel.selectAMSelectorListObject('Visualization 5', 'SHIPMENTS');
            // Then A target without default icon appears on the viz "Visualization 6" in layers panel
            await since('A target without default icon appears on the viz "Visualization 6" in layers panel, instead we have #{actual}')
                .expect(await selectTargetInLayersPanel.getTargetIconInLayersPanel('Visualization 6').isDisplayed())
                .toBe(true);
            // And I click on element "SEASON CODE" for object to replace window for multiple groups
            await selectTargetInLayersPanel.selectAMSelectorListObject('Visualization 6', 'SEASON CODE');
            // When I click on apply button
            await selectTargetInLayersPanel.applyButtonForSelectTarget();

            // # 3.13 - Edit target from AM selector to select another elements 
            // Open the context menu for "Selector 1"
            await baseContainer.openContextMenu('Selector 1');
            // Select the "Edit Targets" option from the context menu
            await baseContainer.selectContextMenuOption('Edit Targets');
            // Verify that a target with default icon appears on the viz "Visualization 6" in layers panel
            await since('A target with default icon appears on the viz "Visualization 6" in layers panel')
                .expect(await selectTargetInLayersPanel.getTargetIconInLayersPanel('Visualization 6').isDisplayed())
                .toBe(true);
            // Verify that a target with default icon appears on the viz "Visualization 5" in layers panel
            await since('A target with default icon appears on the viz "Visualization 5" in layers panel')
                .expect(await selectTargetInLayersPanel.getTargetIconInLayersPanel('Visualization 5').isDisplayed())
                .toBe(true);
            // Verify that a target with default icon appears on the viz "Visualization 4" in layers panel
            await since('A target with default icon appears on the viz "Visualization 4" in layers panel')
                .expect(await selectTargetInLayersPanel.getTargetIconInLayersPanel('Visualization 4').isDisplayed())
                .toBe(true);
            // Select "LOCATION NAME" from the dropdown for "Visualization 6" in layers panel
            await selectTargetInLayersPanel.dropDownForVisualizationInLayersPanelToSelectAnotherElement('Visualization 6', 'LOCATION NAME');
            // Select "VOLUME CODE" from the dropdown for "Visualization 5" in layers panel
            await selectTargetInLayersPanel.dropDownForVisualizationInLayersPanelToSelectAnotherElement('Visualization 5', 'VOLUME CODE');
            // Select "STORE TYPE" from the dropdown for "Visualization 4" in layers panel
            await selectTargetInLayersPanel.dropDownForVisualizationInLayersPanelToSelectAnotherElement('Visualization 4', 'STORE TYPE');
            // Click on the apply button to save the changes
            await selectTargetInLayersPanel.applyButtonForSelectTarget();
        });
    })

    describe('Defect Automation', () => {


        it('[TC65318] 11.2.2 DE161952/11.3EA DE164405: RMC on the target icon in select target mode' + 
            'from layers panel triggers error in console and user cannot continue the selection.', async () => {
            await openTestDossier();

           // When I switch to page "Page 1" in chapter "Free form Layout 1" from contents panel
            await contentsPanel.goToPage({ chapterName: 'Free form Layout 1', pageName: 'Page 1' });
            // Then Page "Page 1" in chapter "Free form Layout 1" is the current page
            await verifyCurrentPage('Free form Layout 1', 'Page 1');

            // When I use the visualization "Visualization 1" as a filter
            await baseContainer.selectTargetVisualizations('Visualization 1');
            // Then A select source button appears on the Viz "Visualization 1"
            await selectTargetInLayersPanel.getSourceButton('Visualization 1').waitForDisplayed();
            // When I click on container "Visualization 2" from layers panel
            await layerPanel.clickOnContainerFromLayersPanel('Visualization 2');
            // Then A target icon appears on the viz "Visualization 2" in layers panel
            await since('A target icon appears on the viz "Visualization 2" in layers panel')
                .expect(await selectTargetInLayersPanel.getTargetIconInLayersPanel('Visualization 2').isDisplayed())
                .toBe(true);
            // And I right click on target with default icon for container "Visualization 2" from layers panel
            await layerPanel.rightClickOnContainerFromLayersPanel('Visualization 2');
            // And I click on container "Visualization 3" from layers panel
            await layerPanel.clickOnContainerFromLayersPanel('Visualization 3');
            // Then A target icon appears on the viz "Visualization 3" in layers panel
            await since('A target icon appears on the viz "Visualization 3" in layers panel')
                .expect(await selectTargetInLayersPanel.getTargetIconInLayersPanel('Visualization 3').isDisplayed())
                .toBe(true);
            // And I right click on target with default icon for container "Visualization 3" from layers panel
            await layerPanel.rightClickOnContainerFromLayersPanel('Visualization 3');
            // When I click on apply button
            await selectTargetInLayersPanel.applyButtonForSelectTarget();
        });

        it('[TC60904] 11.2.1 DE153794: After select targets, though we are on layersControl panel, but the gallery panel shows', async () => {
            await openTestDossier();

            // When I switch to page "Page 1" in chapter "Free form Layout 1" from contents panel
            await contentsPanel.goToPage({ chapterName: 'Free form Layout 1', pageName: 'Page 1' });
            // Then Page "Page 1" in chapter "Free form Layout 1" is the current page
            await verifyCurrentPage('Free form Layout 1', 'Page 1');
            // When I use the visualization "Visualization 3" as a filter
            await baseContainer.selectTargetVisualizations('Visualization 3');
            // Then A select source button appears on the Viz "Visualization 3"
            await selectTargetInLayersPanel.getSourceButton('Visualization 3').waitForDisplayed();
            // And A source icon appears on the viz "Visualization 3" in layers panel
            await since('A source icon appears on the viz "Visualization 3" in layers panel')
                .expect(await selectTargetInLayersPanel.getSourceIconInLayersPanel('Visualization 3').isDisplayed())
                .toBe(true);
            // When I click on container "Visualization 2" from layers panel
            await layerPanel.clickOnContainerFromLayersPanel('Visualization 2');
            // Then A target icon appears on the viz "Visualization 2" in layers panel
            await since('A target icon appears on the viz "Visualization 2" in layers panel, instead we have #{actual}')
                .expect(await selectTargetInLayersPanel.getTargetIconInLayersPanel('Visualization 2').isDisplayed())
                .toBe(true);
            // When I click on apply button
            await selectTargetInLayersPanel.applyButtonForSelectTarget();

            //select context menu click on visualization 2 in layers panel to make sure the layer panel is active
            await layerPanel.rightClickOnContainerFromLayersPanel('Visualization 2');
            await layerPanel.contextMenuActionFromLayersPanel("Duplicate");
            await layerPanel.rightClickOnContainerFromLayersPanel('Visualization 2 copy');
        });

        it('[TC60904_2] 11.3.11 DE258037: Freeform group items inside of IW can be targeted from outside', async () => {
            await openTestDossier();

            // When I switch to page "infowindow" in chapter "Group" from contents panel
            await contentsPanel.goToPage({ chapterName: 'Group', pageName: 'infowindow' });
            // Then Page "Page 1" in chapter "Group" is the current page
            await verifyCurrentPage('Group', 'infowindow');
            //expand the info window and groups     
            await layerPanel.expandORCollapseGroup('Information Window 1', 'Expand');
            await layerPanel.expandORCollapseGroup('Panel 1', 'Expand');
            await layerPanel.expandORCollapseGroup('Group2', 'Expand');
            //dismiss info window
            await layerPanel.clickOnContainerFromLayersPanel('Visualization 1');
            // When I use the visualization "Visualization 1" as a filter
            await baseContainer.selectTargetVisualizations('Visualization 1');
            // Then A select source button appears on the Viz "Visualization 1"
            await selectTargetInLayersPanel.getSourceButton('Visualization 1').waitForDisplayed();
            // And A source icon appears on the viz "Visualization 1" in layers panel
            await since('A source icon appears on the viz "Visualization 1" in layers panel')
                .expect(await selectTargetInLayersPanel.getSourceIconInLayersPanel('Visualization 1').isDisplayed())
                .toBe(true);
            // check the Group2 is disalbed in layers panel
            await since('the Group2 is disalbed in layers panel')
                .expect(await layerPanel.getDisabledContainerFromLayersPanel('Group2').isDisplayed())
                .toBe(true);
            // check the KPI is disalbed in layers panel
            await since('the KPI is disalbed in layers panel')
                .expect(await layerPanel.getDisabledContainerFromLayersPanel('KPI').isDisplayed())
                .toBe(true);
            // check the Filter 2 is disalbed in layers panel
            await since('the Filter 2 is disalbed in layers panel')
                .expect(await layerPanel.getDisabledContainerFromLayersPanel('Filter 2').isDisplayed())
                .toBe(true);
            await selectTargetInLayersPanel.cancelButtonForSelectTarget();
            await contentsPanel.goToPage({ chapterName: 'Group', pageName: 'infowindow' });
            //check the same behavior for element/value selector
            await selectTargetInLayersPanel.selectTargetButton('ORDERS');
            // check the Group2 is disalbed in layers panel
            await since('the Group2 is disalbed in layers panel')
                .expect(await layerPanel.getDisabledContainerFromLayersPanel('Group2').isDisplayed())
                .toBe(true);
            // check the KPI is disalbed in layers panel
            await since('the KPI is disalbed in layers panel')
                .expect(await layerPanel.getDisabledContainerFromLayersPanel('KPI').isDisplayed())
                .toBe(true);
            // check the Filter 2 is disalbed in layers panel
            await since('the Filter 2 is disalbed in layers panel')
                .expect(await layerPanel.getDisabledContainerFromLayersPanel('Filter 2').isDisplayed())
                .toBe(true);
            await selectTargetInLayersPanel.cancelButtonForSelectTarget();
            
            
        });
    })


});
