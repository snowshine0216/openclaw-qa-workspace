import { browserWindowCustom } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import * as consts from '../../../../constants/visualizations.js';

describe('AutoNarratives_SmartMetrics_FunOn', () => {
    const testObjectInfo = {
        project: {
            id: '235853DC4B79DABCE8C6FFB26B7D8DC3',
            name: 'MicroStrategy Tutorial Project',
        },
        NLG: {
            id: 'BE240B50C94F040A31FE4DBF70744137',
            name: 'NLG_SmartMetricsFun_On',
        },
        testName: 'AutoNarratives_SmartMetrics_FunOn',
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

    it('[SM_FUNOn_00] NLG_SmartMetrics_AGG | Page "00_SM(+)_AggMax" ', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 1', pageName: '00_SM(+)_AggMax' }, [
            'Web: $62,594.05',
            'Central: $53,767.78',
            'Northeast: $53,442.89',
            'Southwest: $40,540.73',
            'Northwest: $19,943.50',
            'South: $17,629.02',
            'Mid-Atlantic: $12,155.68',
            'Southeast: $1,000.00',
        ]);
    });

    it('[SM_FUNOn_01] NLG_SmartMetrics_AGG | Page "01_SM(-)_AggAverage" ', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 1', pageName: '01_SM(-)_AggAverage' }, [
            'Central: $8,980.05',
            'Southwest: $6,954.77',
            'Northeast: $5,859.98',
            'Northwest: $2,572.67',
            'South: $2,087.59',
            'Web: $1,311.90',
            'Mid-Atlantic: $806.82',
            'Southeast: -$1,000.00',
        ]);
    });

    it('[SM_FUNOn_02] NLG_SmartMetrics_AGG | Page "02_SM(/)_AggSum" ', async () => {
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
        ]);
    });

    it('[SM_FUNOn_03] NLG_SmartMetrics_AGG | Page "03_SM(*)_AggCount" ', async () => {
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
});
