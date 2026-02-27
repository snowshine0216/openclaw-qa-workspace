import { browserWindowCustom } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import * as consts from '../../../../constants/visualizations.js';

describe('ResponsiveDashboard_InsightViz', () => {
    const testObjectInfo = {
        project: {
            id: '235853DC4B79DABCE8C6FFB26B7D8DC3',
            name: 'MicroStrategy Tutorial Project',
        },
        D1: {
            id: '233A301EA3414F3A8E76E8B17DBEE176',
            name: 'ResponsiveDashboard_Custom_FitToView',
        },
        D2: {
            id: '78DF68BE6F4C5F554A662ABECEE6BDFE',
            name: 'ResponsiveDashboard_Screen16_9_FillTheView',
        },
        D3: {
            id: '87256750724F8547B70C5CAAA8DB2585',
            name: 'ResponsiveDashboard_WideScreen_Zoom100',
        },
        D4: {
            id: '5BDDB7A5154AA042E1E35785CEBC2F27',
            name: 'ResponsiveDashboard_Screen4_3_FitToView',
        },
        testName: 'ResponsiveDashboard_InsightViz',
    };

    let { loginPage, libraryPage, dossierPage, dossierEditorUtility, autoNarratives, contentsPanel, keyDriver } =
        browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(consts.autoUser.credentials);
        await loginPage.disableTutorial();
        await loginPage.disablePendoTutorial();
        await setWindowSize(browserWindowCustom);
        // await libraryPage.openDebugMode(consts.codeCoverage.vizDebugBundles);
    });

    afterEach(async () => {
        // await libraryPage.collectLineCoverageInfo(consts.codeCoverage.vizOutputFolder, testObjectInfo.testName);
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC98569_1] Verify Auto Narratives, Key Driver, Insight Line and Insight Forecast in Responsive Dashboard_Custom1000*1000_FitToView | Authoring', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.D1.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'NLG',
        });
        await dossierPage.sleep(5000);
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98569_1', '01_FitToView_NLG');
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'KeyDriver',
        });
        await keyDriver.hoverOnBar(0);
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98569_1', '02_FitToView_KeyDriver_HoverOnBar');
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Trend',
        });
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98569_1', '03_FitToView_Trend');
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Forecast',
        });
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98569_1', '04_FitToView_Forecast');
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'PanelStack',
        });
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98569_1', '05_FitToView_PanelStack');
    });

    it('[TC98569_2] Verify Auto Narratives, Key Driver, Insight Line and Insight Forecast in Responsive Dashboard_Fill the view | Authoring', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.D2.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'NLG',
        });
        await autoNarratives.waitForNlgReady();
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98569_2', '01_FillTheView_NLG');
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'KeyDriver',
        });
        await keyDriver.hoverOnBar(0);
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98569_2', '02_FillTheView_KeyDriver_HoverOnBar');
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Trend',
        });
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98569_2', '03_FillTheView_Trend');
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Forecast',
        });
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98569_2', '04_FillTheView_Forecast');
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'PanelStack',
        });
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98569_2', '05_FillTheView_PanelStack');
    });

    it('[TC98569_3] Verify Auto Narratives, Key Driver, Insight Line and Insight Forecast in Responsive Dashboard_Zoom100 | Authoring', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.D3.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'NLG',
        });
        await autoNarratives.waitForNlgReady();
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98569_3', '01_Zoom100_NLG');
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'KeyDriver',
        });
        await keyDriver.hoverOnBar(0);
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98569_3', '02_Zoom100_KeyDriver_HoverOnBar');
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Trend',
        });
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98569_3', '03_Zoom100_Trend');
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Forecast',
        });
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98569_3', '04_Zoom100_Forecast');
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'PanelStack',
        });
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98569_3', '05_Zoom100_PanelStack');
    });

    it('[TC98569_4] Verify Auto Narratives, Key Driver, Insight Line and Insight Forecast in Responsive Dashboard_Screen4_3_FitToView | Authoring', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.D4.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'NLG',
        });
        await autoNarratives.waitForNlgReady();
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98569_4', '01_FitToViewScreen43_NLG');
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'KeyDriver',
        });
        await keyDriver.hoverOnBar(0);
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98569_4', '02_FitToViewScreen43_KeyDriver_HoverOnBar');
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Trend',
        });
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98569_4', '03_FitToViewScreen43_Trend');
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Forecast',
        });
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98569_4', '04_FitToViewScreen43_Forecast');
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'PanelStack',
        });
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98569_4', '05_FitToViewScreen43_PanelStack');
    });
});
