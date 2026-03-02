import { browserWindowCustom } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import * as consts from '../../../../constants/visualizations.js';

describe('AutoNarratives_SmartMetrics_FunOff', () => {
    const testObjectInfo = {
        project: {
            id: '235853DC4B79DABCE8C6FFB26B7D8DC3',
            name: 'MicroStrategy Tutorial Project',
        },
        NLG: {
            id: 'CD61FDF35D403A3F246CFDAFA44CBD17',
            name: 'NLG_SmartMetricsFun_Off',
        },
        testName: 'AutoNarratives_SmartMetrics_FunOff',
    };

    let { loginPage, libraryPage, contentsPanel } = browsers.pageObj1;

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

    it('[SM_FUNOff_00] NLG_SmartMetrics_AGG | Page "00_SM(+)_AggMax" ', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 1', pageName: '00_SM(+)_AggMax' }, [
            'Web',
            '$62,594.05',
            'Central',
            '$53,767.78',
            'Northeast',
            '$53,442.89',
            'Southwest',
            '$40,540.73',
            'Northwest',
            '$19,943.50',
            'South',
            '$17,629.02',
            'Mid-Atlantic',
            '$12,155.68',
            'Southeast',
            '$1,000.00',
        ]);
    });

    it('[SM_FUNOff_01] NLG_SmartMetrics_AGG | Page "01_SM(-)_AggAverage" ', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 1', pageName: '01_SM(-)_AggAverage' }, [
            'Central',
            '$8,980.05',
            'Southwest',
            '$6,954.77',
            'Northeast',
            '$5,859.98',
            'Northwest',
            '$2,572.67',
            'South',
            '$2,087.59',
            'Web',
            '$1,311.90',
            'Mid-Atlantic',
            '$806.82',
            'Southeast',
            '-$1,000.00',
        ]);
    });

    it('[SM_FUNOff_02] NLG_SmartMetrics_AGG | Page "02_SM(/)_AggSum" ', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 1', pageName: '02_SM(/)_AggSum' }, [
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
            'Southeast',
        ]);
    });

    it('[SM_FUNOff_03] NLG_SmartMetrics_AGG | Page "03_SM(*)_AggCount" ', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 1', pageName: '03_SM(*)_AggCount' }, [
            'Central: 40',
            'Mid-Atlantic: 40',
            'Northeast: 40',
            'Northwest: 40',
            'South: 40',
            'Southeast: 40',
            'Southwest: 40',
            'Web: 40',
        ]);
    });

    it('[SM_FUNOff_04] NLG_SmartMetrics_AGG | Page "04_SM(*)_AggGeoMean" ', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 1', pageName: '04_SM(*)_AggGeoMean' }, [
            'Central: $29,192.39',
            'Southwest: $22,269.76',
            'Northeast: $16,512.35',
            'Northwest: $10,617.37',
            'South: $9,197.61',
            'Mid-Atlantic: $5,176.01',
            'Web: $2,913.87',
            'Southeast: $0.00',
        ]);
    });

    it('[SM_FUNOff_05] NLG_SmartMetrics_AGG | Page "05_SM(-)_AggMedianMin" ', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 1', pageName: '05_SM(-)_AggMedianMin' }, [
            'Central: 2,685',
            'Southwest: 2,077',
            'Northeast: 1,600',
            'Northwest: 951',
            'South: 919',
            'Mid-Atlantic: 550',
            'Web: 325',
            'Southeast: 0',
        ]);
    });

    it('[SM_FUNOff_06] NLG_SmartMetrics_AGG | Page "06_SM(/)_AggMode" ', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 1', pageName: '06_SM(/)_AggMode' }, [
            'Northeast: $33.68',
            'Central: $23.40',
            'Southwest: $14.97',
            'Northwest: $11.08',
            'South: $0.08',
            'Southeast: $0.00',
            'Mid-Atlantic: -$3.28',
            'Web: -$3.33',
        ]);
    });

    it('[SM_FUNOff_07] NLG_SmartMetrics_AGG | Page "07_SM(/)_AggProduct" ', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 1', pageName: '07_SM(/)_AggProduct' }, [
            'Northeast: $33.68',
            'Central: $23.40',
            'Southwest: $14.97',
            'Northwest: $11.08',
            'South: $0.08',
            'Southeast: $0.00',
            'Mid-Atlantic: -$3.28',
            'Web: -$3.33',
        ]);
    });

    it('[SM_FUNOff_08] NLG_SmartMetrics_AGG | Page "08_SM(*)_AggStandardDeviation" ', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.validatePageSummaryText(
            { chapterName: 'Chapter 1', pageName: '08_SM(*)_AggStandardDeviation' },
            [
                'Northeast',
                '69,002',
                'Central',
                '63,559',
                'Web',
                '56,358',
                'Southwest',
                '41,960',
                'Northwest',
                '23,442',
                'South',
                '20,813',
                'Mid-Atlantic',
                '13,213',
                'Southeast',
            ]
        );
    });

    it('[SM_FUNOff_09] NLG_SmartMetrics_AGG | Page "09_SM(/)_AggVariation" ', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 1', pageName: '09_SM(/)_AggVariation' }, [
            'Northeast: 1,321,410,678,134,150',
            'Central: 970,361,797,640,618',
            'Web: 556,651,775,641,080',
            'Southwest: 194,029,167,093,293',
            'Northwest: 17,676,960,746,092',
            'South: 11,314,057,827,825',
            'Mid-Atlantic: 1,730,748,355,917',
        ]);
    });
});
