import { dashboardsAutoCredentials } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';

//npm run regression -- --baseUrl=https://mci-u6btx-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --spec 'specs/regression/dashboardAuthoring/adjustRadiusSpacingAndShadow/E2E_shadow.spec.js'
describe('Shadow E2E', () => {
    const dossier = {
        id: 'B06EFDAFDD49374E6B93CAA34273E47D',
        name: 'Auto_Shadow_E2E',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        width: 1920,
        height: 1080,
    };

    let { libraryPage, loginPage, contentsPanel, dossierAuthoringPage, baseContainer, tocContentsPanel, tocMenu, toc, open_Canvas, layerPanel, dossierEditorUtility, dossierPage} = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(dashboardsAutoCredentials);
        await setWindowSize(browserWindow);
    });

    it('[TC99550_8] The shadow setting should be preserved during container manipulations', async () => {
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
        await takeScreenshotByElement(currentPanel, 'BCDA-612_1', 'Copy to Grid Visualization 1');

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Grid' });
        await baseContainer.openContextMenu('Visualization 2');
        await baseContainer.selectContextMenuOption('Duplicate');
        allPanels = await dossierAuthoringPage.getAllPanels();
        currentPanel = allPanels[allPanels.length - 1];
        await takeScreenshotByElement(currentPanel, 'BCDA-612_2', 'Duplicate Grid Visualization 2');

        await baseContainer.openContextMenu('Visualization 2 copy');
        await baseContainer.selectContextMenuOption('Move to');
        await baseContainer.selectSecondaryContextMenuOption("Page 1");

        allPanels = await dossierAuthoringPage.getAllPanels();
        currentPanel = allPanels[allPanels.length - 1];
        await takeScreenshotByElement(currentPanel, 'BCDA-612_3', 'Move to Grid Visualization 2 copy');
    });

    it('[TC99550_9] Copy/Paste Formatting', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Insight +' });
        await baseContainer.openContextMenu('Linear Trend Line Chart');
        await baseContainer.selectContextMenuOption('Copy Formatting');
        await browser.pause(2000);
        await baseContainer.openContextMenu('Forecast Line Chart');
        await baseContainer.selectContextMenuOption('Paste Formatting');

        let allPanels = await dossierAuthoringPage.getAllPanels();
        let currentPanel = allPanels[allPanels.length - 1];
        await takeScreenshotByElement(currentPanel, 'BCDA-612_4', 'Copy and Paste Formatting from Linear Trend Line Chart to Forecast Line Chart');

        await baseContainer.openContextMenu('Key Driver');
        await baseContainer.selectContextMenuOption('Copy Formatting');
        await browser.pause(2000);
        await baseContainer.openContextMenu('Linear Trend Line Chart');
        await baseContainer.selectContextMenuOption('Paste Formatting');
        await takeScreenshotByElement(currentPanel, 'BCDA-612_5', 'Copy and Paste Formatting from Key Driver to Linear Trend Line Chart');

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'KPI' });
        await baseContainer.openContextMenu('Mult-Metric KPI');
        await baseContainer.selectContextMenuOption('Copy Formatting');
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Grid' });
        await browser.pause(2000);
        await baseContainer.openContextMenu('Visualization 1');
        await baseContainer.selectContextMenuOption('Paste Formatting');
        allPanels = await dossierAuthoringPage.getAllPanels();
        currentPanel = allPanels[allPanels.length - 1];
        await takeScreenshotByElement(currentPanel, 'BCDA-612_6', 'Copy and Paste Formatting from Mult-Metric KPI to Visualization 1');

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'More: Sankey and Time series' });
        await baseContainer.openContextMenu('Sankey Diagram');
        await baseContainer.selectContextMenuOption('Copy Formatting');
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Mapbox and Map' });
        await browser.pause(2000);
        await baseContainer.openContextMenu('Map2');
        await baseContainer.selectContextMenuOption('Paste Formatting');
        await browser.pause(2000);
        allPanels = await dossierAuthoringPage.getAllPanels();
        currentPanel = allPanels[allPanels.length - 1];
        await takeScreenshotByElement(currentPanel, 'BCDA-612_7', 'Copy and Paste Formatting from More: Sankey and Time series from Mult-Metric KPI to Map2');
    });

    it('[TC99550_10] Delete and Undo', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
 
        // Delete individual visualizations
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'KPI' });
        await browser.pause(1000);
 
        let allPanels = await dossierAuthoringPage.getAllPanels();
        let currentPanel = allPanels[allPanels.length - 1];
        await takeScreenshotByElement(currentPanel, 'BCDA-612_8', 'Before Delete Normal KPI');
 
        await baseContainer.openContextMenu('Normal KPI');
        await baseContainer.selectContextMenuOption('Delete');
        await browser.pause(1000);
        await takeScreenshotByElement(currentPanel, 'BCDA-612_9', 'Delete Normal KPI');
 
        await baseContainer.openContextMenu('Comparison KPI');
        await baseContainer.selectContextMenuOption('Delete');
        await browser.pause(1000);
        await takeScreenshotByElement(currentPanel, 'BCDA-612_10', 'Delete Comparison KPI');
 
        await baseContainer.openContextMenu('Mult-Metric KPI');
        await baseContainer.selectContextMenuOption('Delete');
        await browser.pause(1000);
        await takeScreenshotByElement(currentPanel, 'BCDA-612_11', 'Delete Mult-Metric KPI');
 
        await baseContainer.openContextMenu('Guage');
        await baseContainer.selectContextMenuOption('Delete');
        await browser.pause(1000);
        await takeScreenshotByElement(currentPanel, 'BCDA-612_12', 'Gauge');
 
        await dossierAuthoringPage.actionOnToolbar("Undo");
        await browser.pause(1000);
        await takeScreenshotByElement(currentPanel, 'BCDA-612_13', 'Undo deleting Gauge');
 
        await dossierAuthoringPage.actionOnToolbar("Undo");
        await browser.pause(1000);
        await takeScreenshotByElement(currentPanel, 'BCDA-612_14', 'Undo deleting Mult-Metric KPI');
 
        await dossierAuthoringPage.actionOnToolbar("Undo");
        await browser.pause(1000);
        await takeScreenshotByElement(currentPanel, 'BCDA-612_15', 'Undo deleting Comparison KPI');
 
        await dossierAuthoringPage.actionOnToolbar("Undo");
        await browser.pause(1000);
        await takeScreenshotByElement(currentPanel, 'BCDA-612_16', 'Undo deleting Normal KPI');
 
        // Delete the entire page
        await tocContentsPanel.contextMenuOnPage('KPI', 'Chapter 1', 'Delete');
        await browser.pause(1000);
        allPanels = await dossierAuthoringPage.getAllPanels();
        currentPanel = allPanels[allPanels.length - 1];
        await takeScreenshotByElement(currentPanel, 'BCDA-612_17', 'Delete the entire KPI page');
 
        await dossierAuthoringPage.actionOnToolbar("Undo");
        await browser.pause(1000);
        allPanels = await dossierAuthoringPage.getAllPanels();
        currentPanel = allPanels[allPanels.length - 1];
        await takeScreenshotByElement(currentPanel, 'BCDA-612_18', 'Undo deleting the KPI page');
 
    });
 
    it('[TC99550_11] Change visualization types', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
 
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Grid' });
        await browser.pause(1000);
        let allPanels = await dossierAuthoringPage.getAllPanels();
        let currentPanel = allPanels[allPanels.length - 1];
        await takeScreenshotByElement(currentPanel, 'BCDA-612_19', 'Before changing viz types');
        await baseContainer.changeViz("Line Chart", "Visualization 1");
                await browser.pause(1000);

        await baseContainer.changeViz("Horizontal Bar Chart", "Visualization 2");
                await browser.pause(1000);

        await baseContainer.changeViz("Heat Map", "Visualization 3");
                await browser.pause(1000);

 
        allPanels = await dossierAuthoringPage.getAllPanels();
        currentPanel = allPanels[allPanels.length - 1];
        await takeScreenshotByElement(currentPanel, 'BCDA-612_20', 'After changing viz types');
    });

    it('[TC99550_12] Resize containers and groups', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
 
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Freeform layout - Fields' });
        await browser.pause(1000);
        let freeFormLayout = await dossierAuthoringPage.getFreeformLayoutPage();
        await takeScreenshotByElement(freeFormLayout, 'BCDA-612_21', 'Freeform layout before resizing containers and groups');
        
        await baseContainer.resizeContainer("Text 1", "right", "-50px");
        await baseContainer.resizeContainer("Panel Selector 2", "bottom", "20px"); 
        await baseContainer.resizeContainer("Panel Selector 2", "top", "20px"); 
        await baseContainer.resizeContainer("Visualization 1 - Shadow 20", "top", "-50px"); 
        await baseContainer.resizeContainer("Visualization 1 - Shadow 20", "left", "-100px"); 
        await baseContainer.resizeContainer("Selector 1", "bottom", "20px"); 
        await baseContainer.resizeContainer("Panel Stack 1", "right", "-250px"); 
        await open_Canvas.resizeGroup("Image 1","top","-20px");
        await open_Canvas.resizeGroup("Year Parameter","left","-50px");
        await open_Canvas.resizeGroup("Year Parameter","right","-50px");
        await takeScreenshotByElement(freeFormLayout, 'BCDA-612_22', 'Freeform layout after resizing containers and groups');
    });

   it('[TC99550_13] Move containers', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
 
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Freeform layout - Fields' });
        await browser.pause(1000);
        let freeFormLayout = await dossierAuthoringPage.getFreeformLayoutPage();
        await takeScreenshotByElement(freeFormLayout, 'BCDA-612_23', 'Freeform layout before moving containers');
        await baseContainer.moveContainerByOffset("Panel Stack 1", "5%", "5%");
        await baseContainer.moveContainerToTargetPosition("Month", "left", "50px");
        await baseContainer.moveContainerByOffset("Rich Text 2", "3%", "3%");
        await takeScreenshotByElement(freeFormLayout, 'BCDA-612_24', 'Freeform layout after moving containers');    
    });

    it('[TC99550_14] Duplicate page + panel, Responsive Preview', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
 
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Freeform layout - Fields' });
        await browser.pause(1000);
        //await dossierAuthoringPage.togglePanelBar.togglePanel('layout');
        await layerPanel.clickOnContainerFromLayersPanel("Panel Stack 1");
        await layerPanel.duplicateContainerFromLayersPanel("Panel 1");
        let freeFormLayout = await dossierAuthoringPage.getFreeformLayoutPage();
        await takeScreenshotByElement(freeFormLayout, 'BCDA-612_25', 'after duplicating Panel in Panel Stack 1');

        await tocMenu.duplicatePage("Freeform layout - Fields");
        await browser.pause(1000);

        freeFormLayout = await dossierEditorUtility.getRootViewContent();
        await takeScreenshotByElement(freeFormLayout, 'BCDA-612_26', 'after duplicating page');    

        await dossierAuthoringPage.actionOnToolbar("Responsive Preview");
        await takeScreenshotByElement(freeFormLayout, 'BCDA-612_27', 'in Responsive Preview');    
    });

    it('[TC99550_15] Library Consumption Mode', async () => {
        const url = browser.options.baseUrl + `app/${dossier.project.id}/${dossier.id}`;
        await libraryPage.openDossierByUrl(url.toString());
        await dossierPage.resetDossierIfPossible();
 
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Insight +' });
        await browser.pause(2000);
        await takeScreenshotByElement(dossierPage.getDossierView(), 'BCDA-612_28', 'Insight + page in consumption mode');

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Grid' });
        await browser.pause(2000);
        await takeScreenshotByElement(dossierPage.getDossierView(), 'BCDA-612_29', 'Grid page in consumption mode');

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'KPI' });
        await browser.pause(2000);
        await takeScreenshotByElement(dossierPage.getDossierView(), 'BCDA-612_30', 'KPI page in consumption mode');

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Line and bar, Pie' });
        await browser.pause(2000);
        await takeScreenshotByElement(dossierPage.getDossierView(), 'BCDA-612_31', 'Line and bar, Pie page in consumption mode');

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Mapbox and Map' });
        await browser.pause(3000);
        await takeScreenshotByElement(dossierPage.getDossierView(), 'BCDA-612_32', 'Mapbox and Map page in consumption mode');

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'More: Sankey and Time series' });
        await browser.pause(2000);
        await takeScreenshotByElement(dossierPage.getDossierView(), 'BCDA-612_33', 'More: Sankey and Time series page in consumption mode');
            
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'Freeform layout - Fields' });
        await browser.pause(2000);
        await takeScreenshotByElement(dossierPage.getDossierView(), 'BCDA-612_34', 'Freeform layout - Fields page in consumption mode');
    });

});
