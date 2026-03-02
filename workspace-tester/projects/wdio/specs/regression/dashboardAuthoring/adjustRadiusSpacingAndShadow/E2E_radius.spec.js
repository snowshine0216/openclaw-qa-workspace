import { dashboardsAutoCredentials } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';

//npm run regression -- --baseUrl=https://mci-o2fz9-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --spec 'specs/regression/dashboardAuthoring/adjustRadiusAndSpacing/E2E_radius.spec.js'
describe('radius E2E', () => {
    const dossier = {
        id: '3D893A46DF4D66260BB9698B4B50A5D4',
        name: 'Auto_Radius_E2E',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        width: 1920,
        height: 1080,
    };

    let { libraryPage, loginPage, contentsPanel, dossierAuthoringPage, baseContainer, tocContentsPanel, tocMenu, open_Canvas, layerPanel, dossierEditorUtility } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(dashboardsAutoCredentials);
        await setWindowSize(browserWindow);
    });

    it('[TC99550_1] The radius setting should be preserved during container manipulations', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });

        //Duplicate/Copy/Move
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Grid' });
        await baseContainer.openContextMenu('Visualization 1');
        await baseContainer.selectContextMenuOption('Copy to');
        await baseContainer.selectSecondaryContextMenuOption("New Page");

        let allPanels = await dossierAuthoringPage.getAllPanels();
        let currentPanel = allPanels[allPanels.length - 1];
        await takeScreenshotByElement(currentPanel, 'TC99550_1', 'Copy to Grid with Radius 40');

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Grid' });
        await baseContainer.openContextMenu('Visualization 2');
        await baseContainer.selectContextMenuOption('Duplicate');
        await takeScreenshotByElement(currentPanel, 'TC99550_2', 'Duplicate Grid with Radius 25');

        await baseContainer.openContextMenu('Visualization 2 copy');
        await baseContainer.selectContextMenuOption('Move to');
        await baseContainer.selectSecondaryContextMenuOption("Page 1");

        allPanels = await dossierAuthoringPage.getAllPanels();
        currentPanel = allPanels[allPanels.length - 1];
        await takeScreenshotByElement(currentPanel, 'TC99550_3', 'Move to Grid with Radius 25');
    });

    it('[TC99550_2] Copy/Paste Formatting', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Insight +' });
        await baseContainer.openContextMenu('Linear Trend Line Chart');
        await baseContainer.selectContextMenuOption('Copy Formatting');
        
        await baseContainer.openContextMenu('Forecast Line Chart');
        await baseContainer.selectContextMenuOption('Paste Formatting');

        // Comment out the validation until DE333862 gets fixed
        //let allPanels = await dossierAuthoringPage.getAllPanels();
        //let currentPanel = allPanels[allPanels.length - 1];
        //await takeScreenshotByElement(currentPanel, 'TC99550_4', 'Copy and Paste Formatting');
    });

    it('[TC99550_3] Delete and Undo', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
 
        // Delete individual visualizations
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'KPI' });
        await browser.pause(1000);
 
        let allPanels = await dossierAuthoringPage.getAllPanels();
        let currentPanel = allPanels[allPanels.length - 1];
        await takeScreenshotByElement(currentPanel, 'TC99550_5', 'Before Delete Normal KPI');
 
        await baseContainer.openContextMenu('Normal KPI');
        await baseContainer.selectContextMenuOption('Delete');
        await browser.pause(1000);
        await takeScreenshotByElement(currentPanel, 'TC99550_6', 'Delete Normal KPI');
 
        await baseContainer.openContextMenu('Comparison KPI');
        await baseContainer.selectContextMenuOption('Delete');
        await browser.pause(1000);
        await takeScreenshotByElement(currentPanel, 'TC99550_7', 'Delete Comparison KPI');
 
        await baseContainer.openContextMenu('Mult-Metric KPI');
        await baseContainer.selectContextMenuOption('Delete');
        await browser.pause(1000);
        await takeScreenshotByElement(currentPanel, 'TC99550_8', 'Delete Mult-Metric KPI');
 
        await baseContainer.openContextMenu('Guage');
        await baseContainer.selectContextMenuOption('Delete');
        await browser.pause(1000);
        await takeScreenshotByElement(currentPanel, 'TC99550_9', 'Gauge');
 
        await dossierAuthoringPage.actionOnToolbar("Undo");
        await browser.pause(1000);
        await takeScreenshotByElement(currentPanel, 'TC99550_10', 'Undo deleting Gauge');
 
        await dossierAuthoringPage.actionOnToolbar("Undo");
        await browser.pause(1000);
        await takeScreenshotByElement(currentPanel, 'TC99550_11', 'Undo deleting Mult-Metric KPI');
 
        await dossierAuthoringPage.actionOnToolbar("Undo");
        await browser.pause(1000);
        await takeScreenshotByElement(currentPanel, 'TC99550_12', 'Undo deleting Comparison KPI');
 
        await dossierAuthoringPage.actionOnToolbar("Undo");
        await browser.pause(1000);
        await takeScreenshotByElement(currentPanel, 'TC99550_13', 'Undo deleting Normal KPI');
 
        // Delete the entire page
        await tocContentsPanel.contextMenuOnPage('KPI', 'Chapter 1', 'Delete');
        await browser.pause(1000);
        allPanels = await dossierAuthoringPage.getAllPanels();
        currentPanel = allPanels[allPanels.length - 1];
        await takeScreenshotByElement(currentPanel, 'TC99550_14', 'Delete the entire KPI page');
 
        await dossierAuthoringPage.actionOnToolbar("Undo");
        await browser.pause(1000);
        allPanels = await dossierAuthoringPage.getAllPanels();
        currentPanel = allPanels[allPanels.length - 1];
        await takeScreenshotByElement(currentPanel, 'TC99550_15', 'Undo deleting the KPI page');
 
    });
 
    it('[TC99550_4] Change visualization types', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
 
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Grid' });
        await browser.pause(1000);
        let allPanels = await dossierAuthoringPage.getAllPanels();
        let currentPanel = allPanels[allPanels.length - 1];
        await takeScreenshotByElement(currentPanel, 'TC99550_16', 'Before changing viz types');
        await baseContainer.changeViz("Line Chart", "Visualization 1");
        await baseContainer.changeViz("Horizontal Bar Chart", "Visualization 2");
        await baseContainer.changeViz("Heat Map", "Visualization 3");
 
        allPanels = await dossierAuthoringPage.getAllPanels();
        currentPanel = allPanels[allPanels.length - 1];
        await takeScreenshotByElement(currentPanel, 'TC99550_17', 'After changing viz types');
    });

    it('[TC99550_5] Resize containers and groups', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
 
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Freeform layout - Fields' });
        await browser.pause(1000);
        let freeFormLayout = await dossierAuthoringPage.getFreeformLayoutPage();
        await takeScreenshotByElement(freeFormLayout, 'TC99550_18', 'Freeform lauout before resizing containers and groups');
        
        await baseContainer.resizeContainer("Text 1", "right", "-50px");
        await baseContainer.resizeContainer("Panel Selector 2", "bottom", "20px"); 
        await baseContainer.resizeContainer("Panel Selector 2", "top", "20px"); 
        await baseContainer.resizeContainer("Visualization 1 - Radius 10", "top", "-50px"); 
        await baseContainer.resizeContainer("Visualization 1 - Radius 10", "left", "-200px"); 
        await baseContainer.resizeContainer("Selector 1", "bottom", "-20px"); 
        await baseContainer.resizeContainer("Panel Stack 1", "right", "-250px"); 
        await open_Canvas.resizeGroup("Image 1","top","-20px");
        await open_Canvas.resizeGroup("Year Parameter","left","-50px");
        await open_Canvas.resizeGroup("Year Parameter","right","-50px");
        await takeScreenshotByElement(freeFormLayout, 'TC99550_19', 'Freeform lauout after resizing containers and groups');
    });

   it('[TC99550_6] Move containers', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
 
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Freeform layout - Fields' });
        await browser.pause(1000);
        let freeFormLayout = await dossierAuthoringPage.getFreeformLayoutPage();
        await takeScreenshotByElement(freeFormLayout, 'TC99550_20', 'Freeform lauout before moving containers');
        await baseContainer.moveContainerByOffset("Panel Stack 1", "5%", "5%");
        await baseContainer.moveContainerToTargetPosition("Month", "left", "50px");
        await baseContainer.moveContainerByOffset("Rich Text 2", "3%", "3%");
        await takeScreenshotByElement(freeFormLayout, 'TC99550_21', 'Freeform lauout after moving containers');    
    });

    it('[TC99550_7] Duplicate page + panel, Responsive Preview', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
 
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Freeform layout - Fields' });
        await browser.pause(1000);
        await dossierAuthoringPage.togglePanelBar.togglePanel('layout');
        await layerPanel.clickOnContainerFromLayersPanel("Panel Stack 1");
        await layerPanel.duplicateContainerFromLayersPanel("Panel 1");
        let freeFormLayout = await dossierAuthoringPage.getFreeformLayoutPage();
        await takeScreenshotByElement(freeFormLayout, 'TC99550_22', 'after duplicating Panel in Panel Stack 1');

        await tocMenu.duplicatePage("Freeform layout - Fields");
        await browser.pause(1000);

        freeFormLayout = await dossierEditorUtility.getRootViewContent();
        await takeScreenshotByElement(freeFormLayout, 'TC99550_23', 'after duplicating page');    

        await dossierAuthoringPage.actionOnToolbar("Responsive Preview");
        await takeScreenshotByElement(freeFormLayout, 'TC99550_24', 'in Responsive Preview');    
    });

});
