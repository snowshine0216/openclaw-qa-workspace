import { browserWindowCustom } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import * as consts from '../../../../constants/visualizations.js';

describe('AutoNarratives_SmartMetrics_Regression', () => {
    const testObjectInfo = {
        project: {
            id: '235853DC4B79DABCE8C6FFB26B7D8DC3',
            name: 'MicroStrategy Tutorial Project',
        },
        NLG: {
            id: 'DB85517EBC4A32DE050F41B54326EBA8',
            name: 'NLG_SmartMetricsReg',
        },
        testName: 'AutoNarratives_SmartMetrics_Regression',
    };

    let { loginPage, libraryPage, contentsPanel } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(consts.autoUser.credentials);
        await loginPage.disableTutorial();
        await setWindowSize(browserWindowCustom);
    });

    afterEach(async () => {
        // await libraryPage.collectLineCoverageInfo(consts.codeCoverage.vizOutputFolder, testObjectInfo.testName);
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    // Chapter 1
    it('[SM_Reg1_01] NLG_SmartMetrics_DifferentSourceViz | Page "Chapter 1, Grid"', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });
        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 1', pageName: 'Grid' }, [
            'Web',
            '128.49308%',
            'Mid-Atlantic',
            '29.19322%',
            'Central',
            '26.24629%',
            'South',
            '22.78262%',
            'Northeast',
            '22.37422%',
            'Southwest',
            '20.69495%',
            'Northwest',
            '19.75703%',
        ]);
    });

    it('[SM_Reg1_02] NLG_SmartMetrics_DifferentSourceViz | Page "Chapter 1, CompoundGrid"', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });
        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 1', pageName: 'CompoundGrid' }, [
            'Web',
            '128.49308%',
            'Mid-Atlantic',
            '29.19322%',
            'Central',
            '26.24629%',
            'South',
            '22.78262%',
            'Northeast',
            '22.37422%',
            'Southwest',
            '20.69495%',
            'Northwest',
            '19.75703%',
        ]);
    });

    it('[SM_Reg1_03] NLG_SmartMetrics_DifferentSourceViz | Page "Chapter 1, AGGrid"', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });
        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 1', pageName: 'AGGrid' }, [
            'Web',
            '128.49308%',
            'Mid-Atlantic',
            '29.19322%',
            'Central',
            '26.24629%',
            'South',
            '22.78262%',
            'Northeast',
            '22.37422%',
            'Southwest',
            '20.69495%',
            'Northwest',
            '19.75703%',
        ]);
    });

    // Chapter 2
    it('[SM_Reg1_04] NLG_SmartMetrics_DifferentSourceViz | Page "Chapter 2, BarChart"', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });
        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 2', pageName: 'BarChart' }, [
            'Music',
            '57.55%',
            'Movies',
            '56.23%',
            'Electronics',
            '56.19%',
            'Books',
            '54.38%',
        ]);
    });

    it('[SM_Reg1_05] NLG_SmartMetrics_DifferentSourceViz | Page "Chapter 2, ComboChart"', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });
        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 2', pageName: 'ComboChart' }, [
            'Web',
            '128.49308%',
            'Mid-Atlantic',
            '29.19322%',
            'Central',
            '26.24629%',
            'South',
            '22.78262%',
            'Northeast',
            '22.37422%',
            'Southwest',
            '20.69495%',
            'Northwest',
            '19.75703%',
        ]);
    });

    it('[SM_Reg1_06] NLG_SmartMetrics_DifferentSourceViz | Page "Chapter 2, PieChart"', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });
        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 2', pageName: 'PieChart' }, [
            'Mid-Atlantic',
            '15.46%',
            'Northwest',
            '15.40%',
            'Southwest',
            '15.36%',
            'Central',
            '15.34%',
            'Northeast',
            '15.29%',
            'Web',
            '14.95%',
            'South',
            '14.82%',
        ]);
    });

    it('[SM_Reg1_07] NLG_SmartMetrics_DifferentSourceViz | Page "Chapter 2, BubbleChart"', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });
        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 2', pageName: 'BubbleChart' }, [
            'Web',
            '128.49308%',
            'Mid-Atlantic',
            '29.19322%',
            'Central',
            '26.24629%',
            'South',
            '22.78262%',
            'Northeast',
            '22.37422%',
            'Southwest',
            '20.69495%',
            'Northwest',
            '19.75703%',
        ]);
    });

    // Chapter 3
    it('[SM_Reg1_08] NLG_SmartMetrics_DifferentSourceViz | Page "Chapter 3, KPI"', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });
        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 3', pageName: 'KPI' }, [
            'Web',
            '128.49308%',
            'Mid-Atlantic',
            '29.19322%',
            'Central',
            '26.24629%',
            'South',
            '22.78262%',
            'Northeast',
            '22.37422%',
            'Southwest',
            '20.69495%',
            'Northwest',
            '19.75703%',
        ]);
    });

    it('[SM_Reg1_09] NLG_SmartMetrics_DifferentSourceViz | Page "Chapter 3, TimeSeries"', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });
        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 3', pageName: 'TimeSeries' }, [
            '2008',
            '47.45%',
            '2009',
            '61.60%',
        ]);
    });

    // Chapter 4
    it('[SM_Reg1_10] NLG_SmartMetrics_DifferentSourceViz | Page "Chapter 4, Waterfall"', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });
        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 4', pageName: 'Waterfall' }, [
            'Web',
            '128.49308%',
            'Mid-Atlantic',
            '29.19322%',
            'Central',
            '26.24629%',
            'South',
            '22.78262%',
            'Northeast',
            '22.37422%',
            'Southwest',
            '20.69495%',
            'Northwest',
            '19.75703%',
        ]);
    });

    it('[SM_Reg1_11] NLG_SmartMetrics_DifferentSourceViz | Page "Chapter 4, BoxPlot"', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });
        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 4', pageName: 'BoxPlot' }, [
            'Web',
            '128.49308%',
            'Mid-Atlantic',
            '29.19322%',
            'Central',
            '26.24629%',
            'South',
            '22.78262%',
            'Northeast',
            '22.37422%',
            'Southwest',
            '20.69495%',
            'Northwest',
            '19.75703%',
        ]);
    });

    // Chapter 5
    it('[SM_Reg1_12] NLG_SmartMetrics_DifferentSourceViz | Page "Chapter 5, Heatmap"', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });
        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 5', pageName: 'Heatmap' }, [
            'Web',
            '128.49308%',
            'Mid-Atlantic',
            '29.19322%',
            'Central',
            '26.24629%',
            'South',
            '22.78262%',
            'Northeast',
            '22.37422%',
            'Southwest',
            '20.69495%',
            'Northwest',
            '19.75703%',
        ]);
    });

    it('[SM_Reg1_13] NLG_SmartMetrics_DifferentSourceViz | Page "Chapter 5, Network"', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });
        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 5', pageName: 'Network' }, [
            'Web',
            '128.49308%',
            'Mid-Atlantic',
            '29.19322%',
            'Central',
            '26.24629%',
            'South',
            '22.78262%',
            'Northeast',
            '22.37422%',
            'Southwest',
            '20.69495%',
            'Northwest',
            '19.75703%',
        ]);
    });

    // Chapter 7
    it('[SM_Reg1_14] NLG_SmartMetrics_DifferentSourceViz | Page "Chapter 7, CustomGroup"', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });
        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 7', pageName: 'CustomGroup' }, [
            'Mid-Atlantic',
            '15.97%',
            'Northwest',
            '15.92%',
            'Southwest',
            '15.90%',
            'Central',
            '15.87%',
            'Northeast',
            '15.64%',
            'South',
            '15.36%',
            'Web',
            '15.21%',
        ]);
    });

    it('[SM_Reg1_15] NLG_SmartMetrics_DifferentSourceViz | Page "Chapter 7, Consolidation"', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });
        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 7', pageName: 'Consolidation' }, [
            'Northeast',
            '15.29%',
            'Web',
            '15.11%',
        ]);
    });
});
