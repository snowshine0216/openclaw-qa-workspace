import { browserWindowCustom } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import * as consts from '../../../../constants/visualizations.js';
import { Key } from 'webdriverio';
import BasePage from '../../../../pageObjects/base/BasePage.js';
import { checkElementByImageComparison } from '../../../../utils/TakeScreenshot.js';

describe('AutoNarratives_SmartMetrics_Reg2', () => {
    const testObjectInfo = {
        project: {
            id: '235853DC4B79DABCE8C6FFB26B7D8DC3',
            name: 'MicroStrategy Tutorial Project',
        },
        NLG: {
            id: 'ABD6AAAADF4061935B10A782DD55710E',
            name: 'NLG',
        },
        testName: 'AutoNarratives_SmartMetrics_Reg',
    };

    let {
        loginPage,
        libraryPage,
        vizGallery,
        contentsPanel,
        dossierEditorUtility,
        autoNarratives,
        visualizationPanel,
        toc,
        pieChart,
        dossierPage,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(consts.autoUser.credentials);
        await loginPage.disableTutorial();
        await setWindowSize(browserWindowCustom);
        // await libraryPage.openDebugMode(consts.codeCoverage.vizDebugBundles);
    });

    afterEach(async () => {
        // await libraryPage.collectLineCoverageInfo(consts.codeCoverage.vizOutputFolder, testObjectInfo.testName);
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[SM_Reg2_00] Reg | Skip Calculation for AG Grid', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });
        //AG Grid
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Page 1',
        });
        await vizGallery.clickOnInsertVI();
        await vizGallery.clickOnVizCategory('Insight');
        await vizGallery.clickOnViz('Auto Narratives');
        await autoNarratives.setInstruction(['Summarize @Visualization 1', Key.Tab]);
        await autoNarratives.waitForNlgReady();
        const actual = await autoNarratives.getSummaryTextByIndex();
        // const expected = ['Category', 'region', 'year'];
        await autoNarratives.validateSummaryTextContains(actual, ['categor', 'region', 'year']);
        await visualizationPanel.takeScreenshotByVizTitle('SM_Reg2_00', '01_AGGridAsSource', 'Visualization 1');
        //Normal Grid
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Page 2',
        });
        await autoNarratives.selectCreateAutoNarrativeOnVisualizationMenu('Visualization 1');
        await autoNarratives.waitForNlgReady();
        const actual2 = await autoNarratives.getSummaryTextByIndex();
        await autoNarratives.validateSummaryTextContains(actual2, ['categor', 'region', 'year']);
        await visualizationPanel.takeScreenshotByVizTitle('SM_Reg2_00', '01_NormalGridAsSource', 'Visualization 1');
    });

    it('[SM_Reg2_01] Reg | Require Calculation for AG Grid', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });
        //AG Grid
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Page 1',
        });
        await vizGallery.clickOnInsertVI();
        await vizGallery.clickOnVizCategory('Insight');
        await vizGallery.clickOnViz('Auto Narratives');
        await autoNarratives.setInstruction(['Summarize @Visualization 1, show top 1 region by Profit Margin']);
        await autoNarratives.waitForNlgReady();
        const actual = await autoNarratives.getSummaryTextByIndex();
        await autoNarratives.validateSummaryTextContains(actual, ['Mid-Atlantic', '15.46%']);
        await visualizationPanel.takeScreenshotByVizTitle('SM_Reg2', '01_AGGridAsSource', 'Visualization 1');
        //Normal Grid
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Page 2',
        });
        //repeat  for Normal Grid
        await vizGallery.clickOnInsertVI();
        await vizGallery.clickOnVizCategory('Insight');
        await vizGallery.clickOnViz('Auto Narratives');
        await autoNarratives.setInstruction(['Summarize @Visualization 1, show top 1 region by Profit Margin']);
        await autoNarratives.waitForNlgReady();
        const actual2 = await autoNarratives.getSummaryTextByIndex();
        await autoNarratives.validateSummaryTextContains(actual2, ['Mid-Atlantic', '15.46%']);
        await visualizationPanel.takeScreenshotByVizTitle('SM_Reg2', '01_NormalGridAsSource', 'Visualization 1');
    });
});
