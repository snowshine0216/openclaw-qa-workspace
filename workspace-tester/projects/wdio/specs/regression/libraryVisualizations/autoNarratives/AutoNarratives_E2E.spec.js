import { browserWindowCustom } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import * as consts from '../../../../constants/visualizations.js';
import { Key } from 'webdriverio';
import BasePage from '../../../../pageObjects/base/BasePage.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';

describe('AutoNarratives_E2E', () => {
    const testObjectInfo = {
        project: {
            id: '235853DC4B79DABCE8C6FFB26B7D8DC3',
            name: 'MicroStrategy Tutorial Project',
        },
        NLG: {
            id: '1E4F719C4B6CDEB991ECAAA8AA563E38',
            name: 'NLG',
        },
        PDM_Dashboard: {
            id: 'A28A034C2B410FF75C77B7BE190D3410',
            name: 'Glowify Sales Dashboard',
        },
        testName: 'AutoNarratives_E2E',
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

    it('[TC96061] E2E [Library Web] E2E test for Auto Narratives Viz in Library.', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Profit By Region',
        });
        await since('Page 1 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByVizTitle('NLGviz'))
            .toContain('299253');
        await autoNarratives.hoverOnFootnote(0);
        await since('NLG tooltip should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getTooltipText())
            .toContain('Visualization 1');
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'emptyPage',
        });
        await vizGallery.clickOnInsertVI();
        await vizGallery.clickOnVizCategory('Insight');
        await vizGallery.checkGallery('TC96061', '02_GalleryInsight');
        await vizGallery.hoverOnViz('Auto Narratives');
        await vizGallery.checkGallery('TC96061', '03_HoverAutoNarratives');
        await vizGallery.clickOnViz('Auto Narratives');
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC96061', '04_AddNLG_Editor');
        await visualizationPanel.takeScreenshotBySelectedViz('TC96061', '04_AddNLG_Viz');
        await autoNarratives.setInstruction([
            'Summarize @visualization',
            Key.Tab,
            'and  highlights in green and lowlights in black',
        ]);
        await autoNarratives.checkInstruction('TC96061', '05_instruction');
        await autoNarratives.waitForNlgReady();
        await since('Page 1 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByVizTitle('Visualization 2'))
            .toContain('store');

        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'createFromViz',
        });
        await autoNarratives.selectCreateAutoNarrativeOnVisualizationMenu('sourceVisualization');
        await autoNarratives.waitForNlgReady();
        await since('Page 3 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByVizTitle('Visualization 1'))
            .toContain('profit');
        await since('Page 3 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByVizTitle('Visualization 1'))
            .toContain('$27,16');
    });
    it('[TC96061_2] E2E [Library Web] E2E test for PDM case in Library.', async () => {
        await libraryPage.openUrl(testObjectInfo.project.id, testObjectInfo.PDM_Dashboard.id);
        await toc.openPageFromTocMenu({
            chapterName: 'Luxe Beauty Sales Analysis',
            pageName: 'Customer Segment Analysis',
        });
        await autoNarratives.waitForNlgReady(1);
        await since('Page - Customer Segment Analysis should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('actions');
        await dossierPage.checkImageCompareForDocView('TC96061_2', 'Page_CustomerSegmentAnalysis');
        // DE306080: attribute name alias with space, quotes.
        await toc.openPageFromTocMenu({
            chapterName: 'Luxe Beauty Sales Analysis',
            pageName: 'Sales Performance Overview',
        });
        await autoNarratives.waitForNlgReady(1);
        await since('Page - Sales Performance Overview should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Australia');
        await dossierPage.checkImageCompareForDocView('TC96061_2', 'Page_SalesPerformanceOverview');
        await toc.openPageFromTocMenu({
            chapterName: 'Luxe Beauty Sales Analysis',
            pageName: 'Product Performance',
        });
        await autoNarratives.waitForNlgReady(1);
        await since('Page - Product Performance should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('revenue');
        await dossierPage.checkImageCompareForDocView('TC96061_2', 'Page_ProductPerformance');
    });

    it('[TC96061_3] Automation for DE302498.', async () => {
        await libraryPage.openUrl(testObjectInfo.project.id, testObjectInfo.PDM_Dashboard.id);
        await dossierPage.resetDossierIfPossible();
        await toc.openPageFromTocMenu({
            chapterName: 'Luxe Beauty Sales Analysis',
            pageName: 'Sales Performance Overview',
        });
        await toc.openPageFromTocMenu({
            chapterName: 'Luxe Beauty Sales Analysis',
            pageName: 'DE302498',
        });
        await pieChart.keepOnly({ title: 'Visualization 1', index: 0 });
        await libraryPage.waitForItemLoading();
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC96061', '06_PieChartKeepOnly');
    });
});
