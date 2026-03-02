import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../../constants/index.js';
import * as consts from '../../../../constants/visualizations.js';
import setWindowSize from '../../../../config/setWindowSize.js';
const specConfiguration = { ...customCredentials('_sort') };
const { credentials } = specConfiguration;

//npm run regression -- --baseUrl=https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --spec 'specs/regression/dashboardAuthoring/resizeGroup/E2E_resizeGroup.spec.js'
describe('F43366 Resize Group E2E workflow', () => {
    const tutorialProject = {
        id: 'B628A31F11E7BD953EAE0080EF0583BD',
        name: 'MicroStrategy Tutorial',
    };

    const F43366_E2E = {
        id: '402444EB554C71D575D987BD0ADC752D',
        name: 'F43366 E2E',
        project: tutorialProject,
    };

    const F43366_E2ESaveAs = {
        id: 'EAB2D38F384080C4DC2B6FAA84A6F773',
        name: 'F43366 E2E Save As Copy',
        project: tutorialProject,
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let { libraryAuthoringPage, libraryPage, dossierPage, baseContainer, dossierAuthoringPage, loginPage, open_Canvas, layerPanel} = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(consts.tqmsUser.credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC99454_01] F43366 Resize a group of containers in authoring mode', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${F43366_E2E.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());
        await browser.pause(2000);

        await open_Canvas.resizeGroup("Rich Text 1","left","-50px");
        await open_Canvas.resizeGroup("Rich Text 1","right","-50px");
        await open_Canvas.resizeGroup("Rich Text 1","top","50px");
        await open_Canvas.resizeGroup("Rich Text 1","bottom","-50px");

        // selecting the containers from layer panel if includes panel stack or html container which are difficult to select from the canvas
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99454_01',
           'F43366 E2E Resize a group',
           {tolerance: 0.1 }
        );

        // Undo/Redo
        await dossierAuthoringPage.actionOnToolbar("Undo");
        await browser.pause(1000);
        await dossierAuthoringPage.actionOnToolbar("Undo");
        await browser.pause(1000);
        await dossierAuthoringPage.actionOnToolbar("Undo");
        await browser.pause(1000);
        await dossierAuthoringPage.actionOnToolbar("Undo");
        await browser.pause(3000);
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99454_02',
           'F43366 E2E undo resize a group',
           {tolerance: 0.1 }
        );

        await dossierAuthoringPage.actionOnToolbar("Redo");
        await browser.pause(1000);
        await dossierAuthoringPage.actionOnToolbar("Redo");
        await browser.pause(1000);
        await dossierAuthoringPage.actionOnToolbar("Redo");
        await browser.pause(1000);
        await dossierAuthoringPage.actionOnToolbar("Redo");
        await browser.pause(3000);
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99454_03',
           'F43366 E2E redo resize a group',
           {tolerance: 0.1 }
        );

        // Resize a container in the group
        await open_Canvas.doubleClickContainer("Visualization 2");
        await browser.pause("3000");
        await baseContainer.resizeContainer("Visualization 2", "right", "150px");
        await baseContainer.resizeContainer("Visualization 2", "bottom", "50px");
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99454_04',
           'F43366 E2E Resize a container in the group',
           {tolerance: 0.1 }
        );

        // Resize the group bbehind another group
        await open_Canvas.resizeGroup("Panel Stack 1","right","-50px");
        await open_Canvas.resizeGroup("Panel Stack 1","bottom","-50px");
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99454_05',
           'F43366 E2E Resize a group behind another group',
           {tolerance: 0.1 }
        );

        // Resize the groups with overlapped containers
        await open_Canvas.resizeGroup("Rectangle","right","50px");
        await open_Canvas.resizeGroup("Visualization 1","top","-100px");
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99454_06',
           'F43366 E2E Resize a group with shape in the back',
           {tolerance: 0.1 }
        );

        // Bring the group to the front and resize again
        await open_Canvas.GroupContextMenuAction("Rectangle", "Bring to Front");
        await open_Canvas.resizeGroup("Rectangle","right","-50px");
        await open_Canvas.resizeGroup("Rectangle","left","-50px");
        await open_Canvas.resizeGroup("Visualization 1","top","100px");
        await open_Canvas.resizeGroup("Visualization 1","bottom","-50px");
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99454_07',
           'F43366 E2E Resize a group after bringing to front',
           {tolerance: 0.1 }
        );

        // Send the group to back and resize again
        await open_Canvas.GroupContextMenuAction("Rich Text 1", "Send to Back");
        await open_Canvas.resizeGroup("Panel Stack 1","left","-80px");
        await open_Canvas.resizeGroup("Visualization 2","left","-50px");
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99454_08',
           'F43366 E2E Resize groups after sending to back',
           {tolerance: 0.1 }
        );

        // Resize a group wih text box, image container, html container, and overlapped with another container 
        await open_Canvas.resizeGroup("Text 1","left","-50px");
        await open_Canvas.resizeGroup("Text 1","bottom","-50px");
        // wait for the html container to complete rendering
        await browser.pause(3000);
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99454_09',
           'F43366 E2E Resize a group wih text box, image container, html container, and overlapped with another container',
           {tolerance: 0.1 }
        );

        // Resize the text box inside of the group
        await open_Canvas.doubleClickContainer("Text 1");
        await browser.pause(1000);
        await baseContainer.resizeContainer("Text 1", "bottom", "50px");
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99454_10',
           'F43366 E2E Resize the text box inside of the group',
           {tolerance: 0.1 }
        );

        // Resize a group after removing a container from it
        await open_Canvas.resizeGroup("Call Center","right","-50px");
        await open_Canvas.resizeGroup("Call Center","bottom","-50px");
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99454_11',
           'F43366 E2E Resize a group before removing a container from it',
           {tolerance: 0.1 }
        );

        await open_Canvas.doubleClickContainer("Cost");
        await open_Canvas.openAndTakeContextMenuByRMC("Cost","Remove from group")
        await browser.pause(1000);
        await layerPanel.clickOnContainerFromLayersPanel("Call Center")
        await open_Canvas.resizeGroup("Call Center","left","-50px");
        await open_Canvas.resizeGroup("Call Center","bottom","30px");
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99454_12',
           'F43366 E2E Resize a group after removing a container from it',
           {tolerance: 0.1 }
        );

        // Switch to Auto layout and switch back to freeform layout
        await open_Canvas.clickOnAutoCanvasButton();
        await browser.pause(3000);
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99454_13',
           'F43366 E2E switching to auto layout',
           {tolerance: 0.1 }
        );

        await dossierAuthoringPage.actionOnToolbar("Undo");
        await browser.pause(3000);
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99454_14',
           'F43366 E2E undo and convert back to freeform layout',
           {tolerance: 0.1 }
        );

        // Save the dashboard
        await dossierAuthoringPage.actionOnMenubarWithSubmenu('File', 'Save As...');
        await libraryAuthoringPage.saveInMyReport('F43366 E2E Save As Copy');
    });

    it('[TC99454_02] F43366 Check the resized groups in Consumption mode', async () => {
        let url = browser.options.baseUrl + `app/${tutorialProject.id}/${F43366_E2ESaveAs.id}`;
        await libraryPage.openDossierByUrl(url.toString());
        await dossierPage.resetDossierIfPossible();

        await takeScreenshotByElement(
            dossierPage.getDossierView(),
            'TC99454_15',
            'F43366 E2E Check the resized groups in consumption mode',
            {tolerance: 0.1 }
        );
    });    

});
