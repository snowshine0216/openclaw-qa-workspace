import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';
import * as gridConstants from '../../../constants/grid.js';

describe('LeftsidePanelControl', () => {
    let {
        datasetPanel,
        libraryPage,
        loginPage,
        editorPanel,
        toolbar,
        formatPanel,
        dossierCreator,
        dossierAuthoringPage,
        contentsPanel,
        layerPanel,
        themePanel,
        authoringFilters,
        existingObjectsDialog,
        dossierMojo,
        vizPanelForGrid,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.handleError();
    });

    it('[TC60259] Turn on/off panels', async () => {
        await dossierCreator.createNewDossier();
        await dossierCreator.clickCreateButton();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await dossierAuthoringPage.actionOnToolbar(
            `<b>Convert to Free-form Layout</b><br >Objects on the page can be independently positioned, sized, and layered.`
        );
        // Layers panel is hidden in auto, but displayed in freeform layout
        await since('Layers panel should be displayed #{expected} in freeform layout, instead we have #{actual}')
            .expect(await layerPanel.getLayersPanel().isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(dossierAuthoringPage.getToggleBar(), 'TC60259_1', 'ToggleBar_FreeformLayout_DefaultState');
        await dossierAuthoringPage.actionOnToolbar(
            `<b>Convert to Automatic Layout</b><br >Objects automatically fill the entire canvas and can be repositioned around each other.`
        );
        await since('Datasets panel should be displayed #{expected} in auto layout, instead we have #{actual}')
            .expect(await dossierAuthoringPage.datasetsPanel.getDatasetsPanel().isDisplayed())
            .toBe(true);
        await since('Editor panel should be displayed #{expected} in auto layout, instead we have #{actual}')
            .expect(await dossierAuthoringPage.editorPanel.getEditorPanel().isDisplayed())
            .toBe(true);
        await since('Layers panel should be displayed #{expected} in freeform layout, instead we have #{actual}')
            .expect(await layerPanel.getLayersPanel().isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            dossierAuthoringPage.getToggleBar(),
            'TC60259_2',
            'ToggleBar_AutoLayout_DefaultState'
        );

        // Turn off/on the panels from Toggle bar
        await browser.pause(100);
        await dossierAuthoringPage.togglePanelBar.togglePanel('dataset');
        await since('Datasets panel should be turned off')
            .expect(await dossierAuthoringPage.datasetsPanel.getDatasetsPanel().isDisplayed())
            .toBe(false);
        await since('Contents panel should display')
            .expect(await contentsPanel.getContentsPanel().isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            dossierAuthoringPage.getToggleBar(),
            'TC60259_3',
            'ToggleBar_TurnOff_DatasetPanel'
        );
        await dossierAuthoringPage.togglePanelBar.togglePanel('toc');
        await takeScreenshotByElement(
            dossierAuthoringPage.getToggleBar(),
            'TC60259_4',
            'ToggleBar_TurnOff_ContentsPanel'
        );
        await dossierAuthoringPage.togglePanelBar.togglePanel('edit');
        await since('Editor panel should be turned off')
            .expect(await dossierAuthoringPage.editorPanel.getEditorPanel().isDisplayed())
            .toBe(false);
        await takeScreenshotByElement(
            dossierAuthoringPage.getToggleBar(),
            'TC60259_5',
            'ToggleBar_TurnOff_EditorPanel'
        );
        await dossierAuthoringPage.togglePanelBar.togglePanel('filter');
        await since('Filter panel should be turned off')
            .expect(await authoringFilters.getFilterPanel().isDisplayed())
            .toBe(false);
        await takeScreenshotByElement(
            dossierAuthoringPage.getToggleBar(),
            'TC60259_6',
            'ToggleBar_TurnOff_FilterPanel'
        );
        await dossierAuthoringPage.togglePanelBar.togglePanel('format');
        await since('Format panel should be turned off')
            .expect(await formatPanel.getFormatPanel().isDisplayed())
            .toBe(false);
        await takeScreenshotByElement(
            dossierAuthoringPage.getToggleBar(),
            'TC60259_7',
            'ToggleBar_TurnOff_FormatPanel'
        );
        await dossierAuthoringPage.togglePanelBar.togglePanel('layout');
        await since('Layers panel should be turned off')
            .expect(await layerPanel.getLayersPanel().isDisplayed())
            .toBe(false);
        await takeScreenshotByElement(
            dossierAuthoringPage.getToggleBar(),
            'TC60259_8',
            'ToggleBar_TurnOff_LayersPanel'
        );
        await dossierAuthoringPage.togglePanelBar.togglePanel('theme');
        await since('Theme panel should be turned on')
            .expect(await themePanel.getThemePanel().isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(dossierAuthoringPage.getToggleBar(), 'TC60259_9', 'ToggleBar_TurnOn_ThemePanel');
        // Turn on the panels back
        await dossierAuthoringPage.togglePanelBar.togglePanel('dataset');
        await since('Datasets panel should be turned on')
            .expect(await dossierAuthoringPage.datasetsPanel.getDatasetsPanel().isDisplayed())
            .toBe(true);
        await dossierAuthoringPage.togglePanelBar.togglePanel('toc');
        await since('Contents panel should be turned on')
            .expect(await contentsPanel.getContentsPanel().isDisplayed())
            .toBe(true);
        await dossierAuthoringPage.togglePanelBar.togglePanel('edit');
        await since('Editor panel should be turned on')
            .expect(await dossierAuthoringPage.editorPanel.getEditorPanel().isDisplayed())
            .toBe(true);
        await dossierAuthoringPage.togglePanelBar.togglePanel('filter');
        await since('Filter panel should be turned on')
            .expect(await authoringFilters.getFilterPanel().isDisplayed())
            .toBe(true);
        await dossierAuthoringPage.togglePanelBar.togglePanel('format');
        await since('Format panel should be turned on')
            .expect(await formatPanel.getFormatPanel().isDisplayed())
            .toBe(true);
        await dossierAuthoringPage.togglePanelBar.togglePanel('layout');
        await since('Layers panel should be turned on')
            .expect(await layerPanel.getLayersPanel().isDisplayed())
            .toBe(true);
        await dossierAuthoringPage.togglePanelBar.togglePanel('theme');
        await since('Theme panel should be turned off')
            .expect(await themePanel.getThemePanel().isDisplayed())
            .toBe(false);
        await takeScreenshotByElement(
            dossierAuthoringPage.getToggleBar(),
            'TC60259_10',
            'ToggleBar_TurnOn_AllPanelsExceptThemes'
        );

        // Turn off Layers panel then convert to Freeform
        await dossierAuthoringPage.togglePanelBar.togglePanel('layout');
        await since('Layers panel should be turned off')
            .expect(await layerPanel.getLayersPanel().isDisplayed())
            .toBe(false);
        await takeScreenshotByElement(
            dossierAuthoringPage.getToggleBar(),
            'TC60259_11',
            'ToggleBar_TurnOff_LayersPanel'
        );
        await dossierAuthoringPage.actionOnToolbar(
            `<b>Convert to Free-form Layout</b><br >Objects on the page can be independently positioned, sized, and layered.`
        );
        await since('Layers panel should be automatically turned on in freeform layout')
            .expect(await layerPanel.getLayersPanel().isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            dossierAuthoringPage.getToggleBar(),
            'TC60259_12',
            'ToggleBar_FreeformLayout_LayersPanelAutoTurnedOn'
        );
    });

    it('[TC61678] Regression test on Panel Control', async () => {
        await dossierCreator.createNewDossier();
        await dossierCreator.clickCreateButton();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        // Turn off Contents Panel from Toggle Bar ---> Undo/Redo is not applied
        await dossierAuthoringPage.togglePanelBar.togglePanel('toc');
        await dossierAuthoringPage.togglePanelBar.togglePanel('dataset');
        await since('Dataset panel should be turned off')
            .expect(await dossierAuthoringPage.datasetsPanel.getDatasetsPanel().isDisplayed())
            .toBe(false);
        await takeScreenshotByElement(
            toolbar.getToolbar(),
            'TC61678_1',
            'UndoRedo_NotAppliedAfterTurnOffTOCDatasetPanel'
        );
        // Add page --> Contents Panel is turned on
        await dossierAuthoringPage.actionOnToolbar('Add Page');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await since('Contents panel should be turned on')
            .expect(await contentsPanel.getContentsPanel().isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            dossierAuthoringPage.getToggleBar(),
            'TC61678_2',
            'ContentsPanel_AutomaticallyTurnedOnAfterAddPage'
        );
        // Add dataset from toolbar ---> Datasets Panel is turned on
        await dossierAuthoringPage.addExistingObjects();
        await since('An editor should show up with title "Add Existing Objects", instead we have')
            .expect(await dossierMojo.getMojoEditorWithTitle('Add Existing Objects').isDisplayed())
            .toBe(true);
        await browser.pause(2000);
        await existingObjectsDialog.expandFolder('Customers');
        await existingObjectsDialog.doubleClickOnObject('Customer');
        await existingObjectsDialog.doubleClickOnObject('Customer Age');
        await existingObjectsDialog.clickOnBtn('Add');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await since('Datasets panel should be turned on')
            .expect(await dossierAuthoringPage.datasetsPanel.getDatasetsPanel().isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            dossierAuthoringPage.getToggleBar(),
            'TC61678_3',
            'DatasetsPanel_AutomaticallyTurnedOnAfterAddDataset'
        );
        // Turn off Editor Panel, add dataset objects to canvas ---> Editor Panel is still turned off
        await dossierAuthoringPage.togglePanelBar.togglePanel('edit');
        await since('Editor panel should be turned off')
            .expect(await dossierAuthoringPage.editorPanel.getEditorPanel().isDisplayed())
            .toBe(false);
        await datasetPanel.addObjectToVizByDoubleClick('Customer', 'attribute', 'New Dataset 1');
        await since('Editor panel should be turned off')
            .expect(await dossierAuthoringPage.editorPanel.getEditorPanel().isDisplayed())
            .toBe(false);
        // Turn on Editor Panel, Customer attribute should be added
        await dossierAuthoringPage.togglePanelBar.togglePanel('edit');
        await since('Editor panel should be turned on')
            .expect(await dossierAuthoringPage.editorPanel.getEditorPanel().isDisplayed())
            .toBe(true);
        await editorPanel.isObjectVisibleOnEditorPanel('Customer', 'attribute');
        //Add to filter ---> Filter Panel would be the current panel 
        await datasetPanel.actionOnObjectFromDataset('Customer', 'attribute', 'New Dataset 1', 'Add to Filter');
        await since('Filter panel should be displayed')
            .expect(await authoringFilters.getFilterPanel().isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            dossierAuthoringPage.getToggleBar(),
            'TC61678_4',
            'FilterPanel_DisplayedAfterAddFilter'
        );
        //Turn off Filter, add filter ---> Filter Panel would be turned off
        await dossierAuthoringPage.togglePanelBar.togglePanel('filter');
        await since('Filter panel should be turned off')
            .expect(await authoringFilters.getFilterPanel().isDisplayed())
            .toBe(false);
        await datasetPanel.actionOnObjectFromDataset('Customer Age', 'attribute', 'New Dataset 1', 'Add to Filter');
        await since('Filter panel should be displayed')
            .expect(await authoringFilters.getFilterPanel().isDisplayed())
            .toBe(true);
        //Format from container context menu ---> Format would be the current panel
        await vizPanelForGrid.openContextMenu('Visualization 1');
        await vizPanelForGrid.selectContextMenuOption('Format');
        await since('Format panel should be displayed')
            .expect(await formatPanel.getFormatPanel().isDisplayed())
            .toBe(true);
        //Turn off Format panel, format from context menu ---> Format Panel would be turned on
        await dossierAuthoringPage.togglePanelBar.togglePanel('format');
        await since('Format panel should be turned off')
            .expect(await formatPanel.getFormatPanel().isDisplayed())
            .toBe(false);
        await vizPanelForGrid.openContextMenu('Visualization 1');
        await vizPanelForGrid.selectContextMenuOption('Format');
        await since('Format panel should be displayed')
            .expect(await formatPanel.getFormatPanel().isDisplayed())
            .toBe(true);
        //Click on close button to close the editor, filter, format panel group
        await formatPanel.closeFormatPanel();
        await since('Format panel should be closed')
            .expect(await formatPanel.getFormatPanel().isDisplayed())
            .toBe(false);
        await since('Filter panel should be closed')
            .expect(await authoringFilters.getFilterPanel().isDisplayed())
            .toBe(false);
        await since('Editor panel should be closed')
            .expect(await dossierAuthoringPage.editorPanel.getEditorPanel().isDisplayed())
            .toBe(false);
        //x-fun in Pause Mode
        await dossierAuthoringPage.actionOnToolbar('Pause Data Retrieval');
        await since('Datasets panel should be turned on')
            .expect(await dossierAuthoringPage.datasetsPanel.getDatasetsPanel().isDisplayed())
            .toBe(true);
        await dossierAuthoringPage.togglePanelBar.togglePanel('dataset');
        await since('Datasets panel should be turned off')
            .expect(await dossierAuthoringPage.datasetsPanel.getDatasetsPanel().isDisplayed())
            .toBe(false);
        await takeScreenshotByElement(toolbar.getToolbar(), 'TC61678_5', 'UndoRedo_DisabledInPauseMode');
    });
});
