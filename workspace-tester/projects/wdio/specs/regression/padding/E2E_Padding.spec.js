import { dashboardsAutoCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

//npm run regression -- --baseUrl=https://mci-u6btx-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --spec 'specs/regression/padding/E2E_Padding.spec.js'
describe('Padding E2E', () => {
    const dossier = {
        id: '37E25D0E4D49ACCAE2837087AF415BEC',
        name: 'Auto_Padding_E2E',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        width: 1920,
        height: 1080,
    };

    let { libraryPage, loginPage, dossierPage, contentsPanel, dossierAuthoringPage, baseContainer, tocContentsPanel, tocMenu, layerPanel, dossierEditorUtility, toc, newGalleryPanel, textField, toolbar } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(dashboardsAutoCredentials);
        await setWindowSize(browserWindow);
    });

    it('[TC99683_1] The padding setting should be preserved during container manipulations', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });

        // Duplicate/Copy/Move
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Existing page - empty padding' });
        await baseContainer.openContextMenu('Visualization 1');
        await baseContainer.selectContextMenuOption('Copy to');
        await baseContainer.selectSecondaryContextMenuOption("Existing page - with padding 20");
        await takeScreenshotByElement(dossierEditorUtility.getRootViewContent(), 'TC99683_1', 'Copy to existing page with padding 20');

        await baseContainer.openContextMenu('Visualization 2');
        await baseContainer.selectContextMenuOption('Duplicate');
        await takeScreenshotByElement(dossierEditorUtility.getRootViewContent(), 'TC99683_2', 'Duplicate Grid in existing page with padding 20');

        await baseContainer.openContextMenu('Visualization 2 copy');
        await baseContainer.selectContextMenuOption('Move to');
        await baseContainer.selectSecondaryContextMenuOption("Existing page - empty padding");
        await takeScreenshotByElement(dossierEditorUtility.getRootViewContent(), 'TC99683_3', 'Move to Existing page - empty padding');
    });

    it('[TC99683_2] Delete and Undo', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
 
        // Delete individual visualizations/containers
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Existing page - with padding 20' });
        await browser.pause(1000);
        await takeScreenshotByElement(dossierEditorUtility.getRootViewContent(), 'TC99683_4', 'Before Delete Visualization 1 in Existing page - with padding 20');
 
        await baseContainer.openContextMenu('Visualization 1');
        await baseContainer.selectContextMenuOption('Delete');
        await browser.pause(1000);
        await takeScreenshotByElement(dossierEditorUtility.getRootViewContent(), 'TC99683_5', 'Delete Visualization 1 in Existing page - with padding 20');

        await dossierAuthoringPage.actionOnToolbar("Undo");
        await browser.pause(1000);
        await takeScreenshotByElement(dossierEditorUtility.getRootViewContent(), 'TC99683_6', 'Undo deleting Visualization 1 in Existing page - with padding 20');
 
        await baseContainer.openContextMenu('Panel Stack 1');
        await baseContainer.selectContextMenuOption('Delete');
        await browser.pause(1000);
        await takeScreenshotByElement(dossierEditorUtility.getRootViewContent(), 'TC99683_7', 'Delete Panel Stack 1 in Existing page - with padding 20');
 
        await dossierAuthoringPage.actionOnToolbar("Undo");
        await browser.pause(1000);
        await takeScreenshotByElement(dossierEditorUtility.getRootViewContent(), 'TC99683_8', 'Undo deleting Panel Stack 1 in Existing page - with padding 20');
 
        await baseContainer.openContextMenu('Visualization 3');
        await baseContainer.selectContextMenuOption('Delete');
        await browser.pause(1000);
        await takeScreenshotByElement(dossierEditorUtility.getRootViewContent(), 'TC99683_9', 'Delete Visualization 3 in panel stack in Existing page - with padding 20');

        await dossierAuthoringPage.actionOnToolbar("Undo");
        await browser.pause(1000);
        await takeScreenshotByElement(dossierEditorUtility.getRootViewContent(), 'TC99683_10', 'Undo deleting Visualization 3 in panel stack in Existing page - with padding 20');
        
        // Delete the entire page
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Existing page - with padding 40' });
        await takeScreenshotByElement(dossierEditorUtility.getRootViewContent(), 'TC99683_11', 'switch to Page Existing page - with padding 40');

        await tocContentsPanel.contextMenuOnPage('Existing page - with padding 40', 'Chapter 1', 'Delete');
        await browser.pause(1000);
        await takeScreenshotByElement(dossierEditorUtility.getRootViewContent(), 'TC99683_12', 'Delete Existing page - with padding 40');
 
        await dossierAuthoringPage.actionOnToolbar("Undo");
        await browser.pause(1000);
        await takeScreenshotByElement(dossierEditorUtility.getRootViewContent(), 'TC99683_13', 'Undo deleting Existing page - with padding 40');
    });

    it('[TC99683_3] Insert containers', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
 
        // Insert individual visualizations/containers
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Existing page - with padding 40' });
        await browser.pause(1000);

        await baseContainer.clickContainer('Panel Stack');
        await dossierAuthoringPage.actionOnToolbar('Visualization');
        await newGalleryPanel.selectViz('Grid');
        await takeScreenshotByElement(dossierEditorUtility.getRootViewContent(), 'TC99683_14', 'Insert new viz container in Panel Stack in Existing page - with padding 40');

        await baseContainer.clickContainer('Visualization 2');
        await dossierAuthoringPage.actionOnToolbar('Text');
        await toolbar.selectOptionFromToolbarPulldown('Text');
        await browser.pause(2000);
        await textField.InputSimpleText("Padding Test", 'Text 14');
        await takeScreenshotByElement(dossierEditorUtility.getRootViewContent(), 'TC99683_15', 'Insert tex box in Existing page - with padding 40');

        await baseContainer.clickContainer('Visualization 2');
        await dossierAuthoringPage.actionOnToolbar('Visualization');
        await newGalleryPanel.selectViz('Grid');
        await takeScreenshotByElement(dossierEditorUtility.getRootViewContent(), 'TC99683_16', 'Insert new viz container in Existing page - with padding 40');
    });
 
    it('[TC99683_4] Change visualization types', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
 
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Existing page - with mixed padding' });
        await browser.pause(1000);
        await baseContainer.changeViz("Line Chart", "Visualization 1");
        await baseContainer.changeViz("Horizontal Bar Chart", "Visualization 2");
        await baseContainer.changeViz("KPI", "Visualization 3");
        await baseContainer.changeViz("Heat Map", "Visualization 5");
        // to dismiss the tooltips
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Existing page - with mixed padding' });
        await takeScreenshotByElement(dossierEditorUtility.getRootViewContent(), 'TC99683_17', 'After changing viz types');
    });

    it('[TC99683_5] Resize containers', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Existing page - with mixed padding' });
        await browser.pause(1000);
        await takeScreenshotByElement(dossierEditorUtility.getRootViewContent(), 'TC99683_18', 'Before resizing containers in Existing page - with mixed padding');
        await baseContainer.resizeContainer("Text 2", "bottom", "20px");
        await baseContainer.resizeContainer("Visualization 1", "right", "20px"); 
        await baseContainer.resizeContainer("Visualization 2", "bottom", "-30px"); 
        await takeScreenshotByElement(dossierEditorUtility.getRootViewContent(), 'TC99683_19', 'After Resizing containers in Existing page - with mixed padding');
    });

    it('[TC99683_6] Move containers', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
 
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Existing page - with mixed padding' });
        await browser.pause(1000);
        await takeScreenshotByElement(dossierEditorUtility.getRootViewContent(), 'TC99683_20', 'Before moving containers in Existing page - with mixed padding');
        await baseContainer.moveContainerByPosition('Visualization 1', 'Visualization 2', 'Right');
        await baseContainer.moveContainerByPosition('Visualization 5', 'Image 1', 'right');
        await baseContainer.moveContainerByPosition('Visualization 3', 'Visualization 4', 'Right');
        await takeScreenshotByElement(dossierEditorUtility.getRootViewContent(), 'TC99683_21', 'After moving containers in Existing page - with mixed padding');
    });

    it('[TC99683_7] Duplicate page + panel', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
 
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Existing page - with mixed padding' });
        await browser.pause(1000);
        await layerPanel.clickOnContainerFromLayersPanel("Panel Stack 1");
        await layerPanel.duplicateContainerFromLayersPanel("Panel 1");
        await takeScreenshotByElement(dossierEditorUtility.getRootViewContent(), 'TC99683_22', 'After duplicating Panel in Panel Stack 1');

        await tocMenu.duplicatePage("Existing page - with mixed padding");
        await browser.pause(1000);
        await takeScreenshotByElement(dossierEditorUtility.getRootViewContent(), 'TC99683_23', 'After duplicating page');    
    });

    it('[TC99683_8] Consumption mode', async () => {
        const url = browser.options.baseUrl + `app/${dossier.project.id}/${dossier.id}`;
        await libraryPage.openDossierByUrl(url.toString());
        await dossierPage.resetDossierIfPossible();

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Existing page - empty padding' });
        await browser.pause(2000);
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC99683_24', 'Existing page - empty padding in consumption mode');

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Existing page - with padding 20' });
        await browser.pause(2000);
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC99683_25', 'Existing page - with padding 20 in consumption mode');

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Existing page - with padding 40' });
        await browser.pause(2000);
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC99683_26', 'Existing page - with padding 40 in consumption mode');

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Existing page - with mixed padding' });
        await browser.pause(2000);
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC99683_27', 'Existing page - with mixed padding in consumption mode');  
    });
});
