import { browserWindowCustom } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import * as consts from '../../../../constants/visualizations.js';

describe('ResponsiveDashboard_InsightViz_Consume', () => {
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
        testName: 'ResponsiveDashboard_InsightViz_Consume',
    };

    let { loginPage, libraryPage, dossierPage, autoNarratives, keyDriver, toc } = browsers.pageObj1;

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

    it('[TC98568_1] Verify Auto Narratives, Key Driver, Insight Line and Insight Forecast in Responsive Dashboard_Custom1000*1000_FitToView', async () => {
        await libraryPage.openUrl(testObjectInfo.project.id, testObjectInfo.D1.id);
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'NLG' });
        await autoNarratives.waitForNlgReady(1);
        await dossierPage.takeScreenshotByDocView('TC98568_1', '01_FitToView_NLG');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'KeyDriver' });
        await dossierPage.takeScreenshotByDocView('TC98568_1', '02_FitToView_KeyDriver');
        await keyDriver.hoverOnDecreaseBar(0);
        await dossierPage.takeScreenshotByDocView('TC98568_1', '03_FitToView_KeyDriver_HoverOnBar');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'Trend' });
        await dossierPage.takeScreenshotByDocView('TC98568_1', '04_FitToView_Trend');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'Forecast' });
        await dossierPage.takeScreenshotByDocView('TC98568_1', '05_FitToView_Forecast');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'PanelStack' });
        await dossierPage.takeScreenshotByDocView('TC98568_1', '06_FitToView_PanelStack');
        //change view mode to fill the view
        await libraryPage.openUrl(testObjectInfo.project.id, testObjectInfo.D1.id);
        await dossierPage.switchViewMode('Fill the View');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'NLG' });
        await autoNarratives.waitForNlgReady(1);
        await dossierPage.takeScreenshotByDocView('TC98568_1', '07_FillTheView_NLG');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'KeyDriver' });
        await dossierPage.takeScreenshotByDocView('TC98568_1', '08_FillTheView_KeyDriver');
        await keyDriver.hoverOnDecreaseBar(0);
        await dossierPage.takeScreenshotByDocView('TC98568_1', '09_FillTheView_KeyDriver_HoverOnBar');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'Trend' });
        await dossierPage.takeScreenshotByDocView('TC98568_1', '10_FillTheView_Trend');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'Forecast' });
        await dossierPage.takeScreenshotByDocView('TC98568_1', '11_FillTheView_Forecast');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'PanelStack' });
        await dossierPage.takeScreenshotByDocView('TC98568_1', '12_FillTheView_PanelStack');
        //change view mode to zoom 100%
        await libraryPage.openUrl(testObjectInfo.project.id, testObjectInfo.D1.id);
        await dossierPage.switchViewMode('Zoom to 100%');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'NLG' });
        await autoNarratives.waitForNlgReady(1);
        await dossierPage.takeScreenshotByDocView('TC98568_1', '13_Zoom100_NLG');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'KeyDriver' });
        await dossierPage.takeScreenshotByDocView('TC98568_1', '14_Zoom100_KeyDriver');
        await keyDriver.hoverOnDecreaseBar(0);
        await dossierPage.takeScreenshotByDocView('TC98568_1', '15_Zoom100_KeyDriver_HoverOnBar');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'Trend' });
        await dossierPage.takeScreenshotByDocView('TC98568_1', '16_Zoom100_Trend');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'Forecast' });
        await dossierPage.takeScreenshotByDocView('TC98568_1', '17_Zoom100_Forecast');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'PanelStack' });
        await dossierPage.takeScreenshotByDocView('TC98568_1', '18_Zoom100_PanelStack');
    });

    it('[TC98568_2] Verify Auto Narratives, Key Driver, Insight Line and Insight Forecast in Responsive Dashboard_Screen16_9_FillTheView', async () => {
        await libraryPage.openUrl(testObjectInfo.project.id, testObjectInfo.D2.id);
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'NLG' });
        await autoNarratives.waitForNlgReady(1);
        await dossierPage.takeScreenshotByDocView('TC98568_2', '01_FillTheView_NLG');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'KeyDriver' });
        await dossierPage.takeScreenshotByDocView('TC98568_2', '02_FillTheView_KeyDriver');
        await keyDriver.hoverOnDecreaseBar(0);
        await dossierPage.takeScreenshotByDocView('TC98568_2', '03_FillTheView_KeyDriver_HoverOnBar');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'Trend' });
        await dossierPage.takeScreenshotByDocView('TC98568_2', '04_FillTheView_Trend');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'Forecast' });
        await dossierPage.takeScreenshotByDocView('TC98568_2', '05_FillTheView_Forecast');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'PanelStack' });
        await dossierPage.takeScreenshotByDocView('TC98568_2', '06_FillTheView_PanelStack');
    });

    it('[TC98568_3] Verify Auto Narratives, Key Driver, Insight Line and Insight Forecast in Responsive Dashboard_WideScreen_Zoom100', async () => {
        await libraryPage.openUrl(testObjectInfo.project.id, testObjectInfo.D3.id);
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'NLG' });
        await autoNarratives.waitForNlgReady(1);
        await dossierPage.takeScreenshotByDocView('TC98568_3', '01_Zoom100_NLG');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'KeyDriver' });
        await dossierPage.takeScreenshotByDocView('TC98568_3', '02_Zoom100_KeyDriver');
        await keyDriver.hoverOnDecreaseBar(0);
        await dossierPage.takeScreenshotByDocView('TC98568_3', '03_Zoom100_KeyDriver_HoverOnBar');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'Trend' });
        await dossierPage.takeScreenshotByDocView('TC98568_3', '04_Zoom100_Trend');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'Forecast' });
        await dossierPage.takeScreenshotByDocView('TC98568_3', '05_Zoom100_Forecast');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'PanelStack' });
        await dossierPage.takeScreenshotByDocView('TC98568_3', '06_Zoom100_PanelStack');
    });

    it('[TC98568_4] Verify Auto Narratives, Key Driver, Insight Line and Insight Forecast in Responsive Dashboard_Screen4_3_FitToView | Consumption', async () => {
        await libraryPage.openUrl(testObjectInfo.project.id, testObjectInfo.D4.id);
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'NLG' });
        await autoNarratives.waitForNlgReady(1);
        await dossierPage.takeScreenshotByDocView('TC98568_44', '01_FitToViewScreen43_NLG');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'KeyDriver' });
        await dossierPage.takeScreenshotByDocView('TC98568_44', '02_FitToViewScreen43_KeyDriver');
        await keyDriver.hoverOnDecreaseBar(0);
        await dossierPage.takeScreenshotByDocView('TC98568_44', '03_FitToViewScreen43_KeyDriver_HoverOnBar');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'Trend' });
        await dossierPage.takeScreenshotByDocView('TC98568_44', '04_FitToViewScreen43_Trend');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'Forecast' });
        await dossierPage.takeScreenshotByDocView('TC98568_44', '05_FitToViewScreen43_Forecast');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'PanelStack' });
        await dossierPage.takeScreenshotByDocView('TC98568_44', '06_FitToViewScreen43_PanelStack');
    });
});
