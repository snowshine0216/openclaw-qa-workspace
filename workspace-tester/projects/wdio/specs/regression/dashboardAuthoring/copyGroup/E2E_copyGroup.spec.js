import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../../constants/index.js';
import * as consts from '../../../../constants/visualizations.js';
import setWindowSize from '../../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_sort') };
const { credentials } = specConfiguration;

//npm run regression -- --baseUrl=https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --spec 'specs/regression/dashboardAuthoring/copyGroup/E2E_copyGroup.spec.js'
describe('F43390 Copy Group E2E workflow', () => {
    const tutorialProject = {
        id: 'B628A31F11E7BD953EAE0080EF0583BD',
        name: 'MicroStrategy Tutorial',
    };

    const F43390_E2E = {
        id: '634A50446E4318D407A554B4C7EAE1E4',
        name: 'F43390 E2E',
        project: tutorialProject,
    };

    const F43390_E2ESaveAs1 = {
        id: '6582C141E14C45BED5D7C8B601C87352',
        name: 'F43390 E2E Auto to Auto Save As Copy',
        project: tutorialProject,
    };

    const F43390_E2ESaveAs2 = {
        id: '1DB13EA4F8461980361E5DB14DA1A48A',
        name: 'F43390 E2E Auto to Freeform Save As Copy',
        project: tutorialProject,
    };

    const F43390_E2ESaveAs3 = {
        id: '3207C5F18B4F8EFDDAB638A912F8B3B7',
        name: 'F43390 E2E Freeform to Auto Save As Copy',
        project: tutorialProject,
    };

    const F43390_E2ESaveAs4 = {
        id: 'D79C037DE24751A869C525BBB26FE238',
        name: 'F43390 E2E Freeform to Freeform Save As Copy',
        project: tutorialProject,
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let { libraryAuthoringPage, libraryPage, dossierPage, baseContainer, contentsPanel, dossierAuthoringPage, dossierMojo, loginPage, open_Canvas, layerPanel, toc} = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(consts.tqmsUser.credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC99449_01] F43390 Copy from Auto to Auto', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${F43390_E2E.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());
        await browser.pause(2000);

        // selecting the containers from layer panel if includes panel stack or html container which are difficult to select from the canvas
        await layerPanel.multiSelectContainers("Visualization 1,Visualization 2,Panel Stack 1,Rich Text 1");
        await open_Canvas.openAndTakeContextMenuByRMC("Visualization 1", "Copy to");
        await baseContainer.selectSecondaryContextMenuOption("New Page");
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99449_01',
           'F43390 E2E copy from Auto -> Original Page to new page from layer panel',
           {tolerance: 0.1 }
        );

        // Undo/Redo
        await dossierAuthoringPage.actionOnToolbar("Undo");
        await browser.pause(3000);
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99449_02',
           'F43390 E2E undo copy from Auto -> Original Page to new page from layer panel',
           {tolerance: 0.1 }
        );

        await dossierAuthoringPage.actionOnToolbar("Redo");
        await browser.pause(3000);
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99449_03',
           'F43390 E2E redo copy from Auto -> Original Page to new page from layer panel',
           {tolerance: 0.1 }
        );

        await contentsPanel.goToPage({ chapterName: 'Auto', pageName: 'Original Page' });
        await layerPanel.multiSelectContainers("Text 1,Image 1,HTML Container 1");
        await open_Canvas.openAndTakeContextMenuByRMC("Text 1", "Copy to");
        await baseContainer.selectSecondaryContextMenuOption("Page 1");
        await browser.pause(3000);
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99449_04',
           'F43390 E2E copy from Auto -> Original Page to existing page from layer panel',
           {tolerance: 0.1 }
        );
        
        await contentsPanel.goToPage({ chapterName: 'Auto', pageName: 'Original Page' });
        // use this to select the containers from the canvas and trigger the right mouse click menu directly 
        await open_Canvas.multiSelectContainerAndTakeCMOption("Image 1,Text 1,Rich Text 1,Visualization 1,Visualization 2", "Copy to");
        await baseContainer.selectSecondaryContextMenuOption("New Page");
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99449_05',
           'F43390 E2E copy from Auto -> Original Page to new page from Canvas',
           {tolerance: 0.1 }
        );

        await dossierAuthoringPage.actionOnToolbar("Undo");
        await browser.pause(3000);
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99449_06',
           'F43390 E2E undo copy from Auto -> Original Page to new page from Canvas',
           {tolerance: 0.1 }
        );

        await dossierAuthoringPage.actionOnToolbar("Redo");
        await browser.pause(3000);
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99449_07',
           'F43390 E2E redo copy from Auto -> Original Page to new page from Canvas',
           {tolerance: 0.1 }
        );

        //Save as the dashboard
        await contentsPanel.goToPage({ chapterName: 'Auto', pageName: 'Original Page' });
        await dossierAuthoringPage.actionOnMenubarWithSubmenu('File', 'Save As...');
        await libraryAuthoringPage.saveInMyReport('F43390 E2E Auto to Auto Save As Copy');
    });

    it('[TC99449_02] F43390 Copy from Auto to Freeform', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${F43390_E2E.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());
        await browser.pause(2000); 
        await open_Canvas.multiSelectContainerAndTakeCMOption("Image 1,Text 1,Rich Text 1,Visualization 1,Visualization 2", "Copy to");
        await baseContainer.selectSecondaryContextMenuOption("AutoCopyToFreeform");
        await dossierMojo.clickBtnOnMojoEditor("Yes");
        // Due to DE331077, the layout of the containers after copying into the freeform page is random. 
        // So we cannot compare the entire canvas. Compare the layout panel instead
        await takeScreenshotByElement(
            //dossierPage.getDossierView(),
            layerPanel.LayersPanelContent,
            'TC99449_08',
            'F43390 E2E copy from Auto -> Original Page to Freeform',
            {tolerance: 0.1 }
        );

        await dossierAuthoringPage.actionOnToolbar("Undo");
        await browser.pause(3000);
        await takeScreenshotByElement(
            layerPanel.LayersPanelContent,
           'TC99449_09',
           'F43390 E2E undo copy from Auto -> Original Page to Freeform',
           {tolerance: 0.1 }
        );

        await dossierAuthoringPage.actionOnToolbar("Redo");
        await browser.pause(3000);
        await takeScreenshotByElement(
            layerPanel.LayersPanelContent,
           'TC99449_10',
           'F43390 E2E redo copy from Auto -> Original Page to Freeform',
           {tolerance: 0.1 }
        );

        //Save as the dashboard
        await contentsPanel.goToPage({ chapterName: 'Auto', pageName: 'Original Page' });
        await dossierAuthoringPage.actionOnMenubarWithSubmenu('File', 'Save As...');
        await libraryAuthoringPage.saveInMyReport('F43390 E2E Auto to Freeform Save As Copy');
    });

    it('[TC99449_03] F43390 Copy from Freeform to Auto', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${F43390_E2E.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());
        await browser.pause(2000);

        await contentsPanel.goToPage({ chapterName: 'Freeform', pageName: 'Original Page' });
        await open_Canvas.multiSelectContainersFromCanvas("Visualization 1");
        await layerPanel.multiSelectContainers("Rectangle,Visualization 1");
        await open_Canvas.multiSelectContainersFromCanvas("Image 1,Text 1,Rich Text 1,Visualization 2");
        await open_Canvas.openAndTakeContextMenuByRMC("Visualization 2", "Copy to");
        await baseContainer.selectSecondaryContextMenuOption("New Page");
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99449_11',
           'F43390 E2E copy from Freeform -> Original Page to new page',
           {tolerance: 0.1 }
        );

        await dossierAuthoringPage.actionOnToolbar("Undo");
        await browser.pause(3000);
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99449_12',
           'F43390 E2E undo copy from Freeform -> Original Page to new page',
           {tolerance: 0.1 }
        );

        await dossierAuthoringPage.actionOnToolbar("Redo");
        await browser.pause(3000);
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99449_13',
           'F43390 E2E redo copy from Freeform -> Original Page to new page',
           {tolerance: 0.1 }
        );

        await contentsPanel.goToPage({ chapterName: 'Auto', pageName: 'Original Page' });
        await dossierAuthoringPage.actionOnMenubarWithSubmenu('File', 'Save As...');
        await libraryAuthoringPage.saveInMyReport('F43390 E2E Freeform to Auto Save As Copy');
    });

    it('[TC99449_04] F43390 Copy from Freeform to Freeform', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${F43390_E2E.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());
        await browser.pause(2000);

        await contentsPanel.goToPage({ chapterName: 'Freeform', pageName: 'Original Page' });
        await open_Canvas.multiSelectContainersFromCanvas("Visualization 1");
        await layerPanel.multiSelectContainers("Rectangle,Visualization 1");
        await open_Canvas.multiSelectContainersFromCanvas("Image 1,Text 1,Rich Text 1,Visualization 2");
        await open_Canvas.openAndTakeContextMenuByRMC("Visualization 2", "Copy to");
        await baseContainer.selectSecondaryContextMenuOption("FreeformCopyToFreeform");
        await dossierMojo.clickBtnOnMojoEditor("Yes");
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99449_14',
           'F43390 E2E copy from Freeform -> Original Page to Freeform',
           {tolerance: 0.1 }
        );

        await dossierAuthoringPage.actionOnToolbar("Undo");
        await browser.pause(3000);
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99449_15',
           'F43390 E2E undo copy from Freeform -> Original Page to Freeform',
           {tolerance: 0.1 }
        );

        await dossierAuthoringPage.actionOnToolbar("Redo");
        await browser.pause(3000);
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99449_16',
           'F43390 E2E redo copy from Freeform -> Original Page to Freeform',
           {tolerance: 0.1 }
        );

        await contentsPanel.goToPage({ chapterName: 'Auto', pageName: 'Original Page' });
        await dossierAuthoringPage.actionOnMenubarWithSubmenu('File', 'Save As...');
        await libraryAuthoringPage.saveInMyReport('F43390 E2E Freeform to Freeform Save As Copy');
    });

    // Open the saved copies in library consumption
    it('[TC99449_05] F43390 Check the copied containers in Consumption mode', async () => {
        let url = browser.options.baseUrl + `app/${tutorialProject.id}/${F43390_E2ESaveAs1.id}`;
        await libraryPage.openDossierByUrl(url.toString());
        await dossierPage.resetDossierIfPossible();
        await toc.openPageFromTocMenu({chapterName: 'Auto', pageName: 'Page 1'});
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99449_17',
           'F43390 E2E copy from Auto -> Original Page to New Page from layer panel in consumption',
           {tolerance: 0.1 }
        );
        await toc.openPageFromTocMenu({chapterName: 'Auto', pageName: 'Page 2'});
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99449_18',
           'F43390 E2E copy from Auto -> Original Page to New Page from canvas in consumption',
           {tolerance: 0.1 }
        );

        url = browser.options.baseUrl + `app/${tutorialProject.id}/${F43390_E2ESaveAs2.id}`;
        await libraryPage.openDossierByUrl(url.toString());
        await dossierPage.resetDossierIfPossible();
        await toc.openPageFromTocMenu({chapterName: 'AutoCopyToFreeform', pageName: 'Page 1'});
        // Comment out the screenshot comparison due to DE331077, the layout of the containers after copying into the freeform page is random.
        /*
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99449_19',
           'F43390 E2E copy from Auto -> Original Page to Freeform in consumption',
           {tolerance: 0.1 }
        );
        */

        url = browser.options.baseUrl + `app/${tutorialProject.id}/${F43390_E2ESaveAs3.id}`;
        await libraryPage.openDossierByUrl(url.toString());
        await dossierPage.resetDossierIfPossible();
        await toc.openPageFromTocMenu({chapterName: 'Freeform', pageName: 'Page 1'});
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99449_20',
           'F43390 E2E copy from Freeform -> Original Page to New Page in consumption',
           {tolerance: 0.1 }
        );

        url = browser.options.baseUrl + `app/${tutorialProject.id}/${F43390_E2ESaveAs4.id}`;
        await libraryPage.openDossierByUrl(url.toString());
        await dossierPage.resetDossierIfPossible();
        await toc.openPageFromTocMenu({chapterName: 'FreeformCopyToFreeform', pageName: 'Page 1'});
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'F43390_21',
           'F43390 E2E copy from Freeform -> Original Page to Freeform in consumption',
           {tolerance: 0.1 }
        );
    });

});
