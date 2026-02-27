import { browserWindowCustom } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import * as consts from '../../../../constants/visualizations.js';

describe('AutoSummary_FUN', () => {
    const testObjectInfo = {
        project: {
            id: '235853DC4B79DABCE8C6FFB26B7D8DC3',
            name: 'MicroStrategy Tutorial Project',
        },
        dashboard: {
            id: '3F65F760DC4F66F338520D9F16FBBDAB',
            name: 'AutoSummary_FUN',
        },
        application: {
            id: 'config/E35F4003C5EE4B1CB5D36CAEC37F62F9/235853DC4B79DABCE8C6FFB26B7D8DC3',
            name: 'ABANoAutoSummary',
        },
        testName: 'AutoSummary_FUN',
    };

    let {
        loginPage,
        libraryPage,
        dossierPage,
        contentsPanel,
        dossierEditorUtility,
        toc,
        pieChart,
        autoNarratives,
        visualizationPanel,
        formatPanel,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(consts.autoUser.credentials);
        await loginPage.enableABAlocator();
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

    it('[F43676_1] FUN | Auto Summary Format & Refresh', async () => {
        // Open dashboard in edit mode
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.dashboard.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Format',
        });
        await autoNarratives.clickAutoSummaryIcon();
        await formatPanel.switchToFormatPanel();
        await formatPanel.selectFontType('Oleo Script');
        await formatPanel.setFontSize('18');
        await formatPanel.setFontColor(18); // Orange
        await formatPanel.setFontStyle(1); //Italic
        await formatPanel.setFontStyle(2); // Undenrline
        await formatPanel.setFontHorizontalAlignment(5); // Center
        await formatPanel.setFontVerticalAlignment(1); // Center
        await autoNarratives.verifySummaryStyleByPos(0, {
            color: 'rgba(215,99,34,1)',
            'font-size': '24px',
            'font-family': 'oleo script',
            'font-style': 'italic',
            'text-decoration': 'underline solid rgb(215, 99, 34)',
            'text-align': 'center',
        });
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('F43676_1', 'AutoSummary_FormatFont');
        await dossierEditorUtility.checkVIDoclayout('F43676_1', 'AutoSummary_FormatFont_Image');
        await autoNarratives.clickAutosizeCheckbox();
        await autoNarratives.verifySummaryStyleByPos(0, {
            color: 'rgba(215,99,34,1)',
            'font-size': '97.5px',
            'font-family': 'oleo script',
            'font-style': 'italic',
            'text-decoration': 'underline solid rgb(215, 99, 34)',
            'text-align': 'center',
        });
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('F43676_1', 'AutoSummary_AutoSize');
        await dossierEditorUtility.checkVIDoclayout('F43676_1', 'AutoSummary_AutoSize_Image');
        await since('Auto Summary should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Books');
        await pieChart.exclude({ title: 'PieChart', index: 1 });
        await autoNarratives.clickRefreshIcon();
        await autoNarratives.waitForNlgReady();
        await since('Auto Summary should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Books');
    });

    it('[F43676_2] FUN | Show/Not show Auto Summary in Library consumption & Refresh ', async () => {
        // Open dashboard in consumption mode
        await libraryPage.openUrl(testObjectInfo.project.id, testObjectInfo.dashboard.id);
        await dossierPage.resetDossierIfPossible();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'ConsumptionOn' });
        await autoNarratives.clickAutoSummaryIcon(true);
        await since('Auto Summary should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByVizTitle('Visualization 1'))
            .toContain('Music');
        await dossierPage.checkImageCompareForDocView('F43676_2', '01_AutoSummary_DisplayInConsumption_On');
        await pieChart.exclude({ title: 'PieChart', index: 0 });
        await autoNarratives.waitForNlgReady(1);
        await since('Auto Summary should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByVizTitle('Visualization 1'))
            .toContain('Movies');
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'ConsumptionOff' });
        await since('Auto Summary should not be displayed')
            .expect(await autoNarratives.isAutoSummaryExistInCanvas())
            .toBe(false);
        await dossierPage.checkImageCompareForDocView('F43676_2', '02_AutoSummary_DisplayInConsumption_Off');
    });

    it('[F43676_3] Auto Summary Application control to hide Auto Summary', async () => {
        // Open dashboard in consumption mode
        await libraryPage.openUrl(testObjectInfo.application.id, testObjectInfo.dashboard.id);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'ConsumptionOn' });
        await since('Auto Summary should not be displayed')
            .expect(await autoNarratives.isAutoSummaryExistInCanvas())
            .toBe(false);
        await dossierPage.checkImageCompareForDocView('F43676_3', '01_AutoSummary_ApplicationControl_HideAutoSummary');
    });
});
