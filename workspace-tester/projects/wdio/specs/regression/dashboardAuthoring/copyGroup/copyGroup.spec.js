import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../../constants/index.js';
import * as consts from '../../../../constants/visualizations.js';
import setWindowSize from '../../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_sort') };
const { credentials } = specConfiguration;

//npm run regression -- --baseUrl=https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --spec 'specs/regression/dashboardAuthoring/copyGroup/copyGroup.spec.js'
describe('F43390 Copy Group workflow', () => {
    const tutorialProject = {
        id: 'B628A31F11E7BD953EAE0080EF0583BD',
        name: 'MicroStrategy Tutorial',
    };

    const F43390_E2E = {
        id: 'BEF066F69E4727412B0AAA91210FD08E',
        name: 'F43390',
        project: tutorialProject,
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {libraryPage, dossierPage, baseContainer, contentsPanel, dossierAuthoringPage, dossierMojo, loginPage, open_Canvas, layerPanel, toc} = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(consts.tqmsUser.credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC99450_01] F43390 Copy from Auto to NewPage/NewChapter/OtherPage', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${F43390_E2E.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());
        await browser.pause(2000);

        // selecting the containers from layer panel if includes panel stack or html container which are difficult to select from the canvas
        await layerPanel.multiSelectContainers("Visualization 1,Visualization 2,Panel Stack 1,Rich Text 1");
        await open_Canvas.openAndTakeContextMenuByRMC("Visualization 1", "Copy to");
        await baseContainer.selectSecondaryContextMenuOption("New Page");
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99450_01',
           'F43390 copy from Auto -> Original Page to new page from layer panel',
           {tolerance: 0.1 }
        );

        await contentsPanel.goToPage({ chapterName: 'Auto', pageName: 'Original Page' });
        await layerPanel.multiSelectContainers("Visualization 1,Visualization 2,Panel Stack 1,Rich Text 1");
        await open_Canvas.openAndTakeContextMenuByRMC("Visualization 1", "Copy to");
        await baseContainer.selectSecondaryContextMenuOption("New Chapter");
        await dossierMojo.clickBtnOnMojoEditor("Yes");
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99450_02',
           'F43390 copy from Auto -> Original Page to new chapter from layer panel',
           {tolerance: 0.1 }
        );

        await contentsPanel.goToPage({ chapterName: 'Auto', pageName: 'Original Page' });
        await layerPanel.multiSelectContainers("Visualization 1,Visualization 2,Panel Stack 1,Rich Text 1");
        await open_Canvas.openAndTakeContextMenuByRMC("Visualization 1", "Copy to");
        await baseContainer.selectSecondaryContextMenuOption("Auto copy with dependencies");
        await dossierMojo.clickBtnOnMojoEditor("Yes");
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99450_03',
           'F43390 copy from Auto -> Original Page to new chapter from layer panel',
           {tolerance: 0.1 }
        );
    });

    it('[TC99450_02] F43390 Copy from Freeform to NewPage/NewChapter/OtherPage', async () => {
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
           'TC99450_04',
           'F43390 copy from Freeform -> Original Page to new page',
           {tolerance: 0.1 }
        );

        await contentsPanel.goToPage({ chapterName: 'Freeform', pageName: 'Original Page' });
        await open_Canvas.multiSelectContainersFromCanvas("Visualization 1");
        await layerPanel.multiSelectContainers("Rectangle,Visualization 1");
        await open_Canvas.multiSelectContainersFromCanvas("Image 1,Text 1,Rich Text 1,Visualization 2");
        await open_Canvas.openAndTakeContextMenuByRMC("Visualization 2", "Copy to");
        await baseContainer.selectSecondaryContextMenuOption("New Chapter");
        await dossierMojo.clickBtnOnMojoEditor("Yes");
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99450_05',
           'F43390 copy from Freeform -> Original Page to new chapter',
           {tolerance: 0.1 }
        );

        await contentsPanel.goToPage({ chapterName: 'Freeform', pageName: 'Original Page' });
        await open_Canvas.multiSelectContainersFromCanvas("Visualization 1");
        await layerPanel.multiSelectContainers("Rectangle,Visualization 1");
        await open_Canvas.multiSelectContainersFromCanvas("Image 1,Text 1,Rich Text 1,Visualization 2");
        await open_Canvas.openAndTakeContextMenuByRMC("Visualization 2", "Copy to");
        await baseContainer.selectSecondaryContextMenuOption("FreeformCopyToFreeform");
        await dossierMojo.clickBtnOnMojoEditor("Yes");
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99450_06',
           'F43390 copy from Freeform -> Original Page to new chapter',
           {tolerance: 0.1 }
        );
    });

    it('[TC99450_03] Invalid multi-selections copy', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${F43390_E2E.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());
        await browser.pause(2000);

        await contentsPanel.goToPage({ chapterName: 'Freeform', pageName: 'Original Page' });
        await open_Canvas.multiSelectContainersFromCanvas("Visualization 1");
        await layerPanel.multiSelectContainers("Rectangle,Visualization 1");
        await open_Canvas.multiSelectContainersFromCanvas("Image 1,Text 1,Rich Text 1,Visualization 2,Selector 1");
        await open_Canvas.openContextMenuByRMC("Visualization 2");
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'TC99450_07',
           'F43390 copy with invalid selections',
           {tolerance: 0.1 }
        );
    });
});
