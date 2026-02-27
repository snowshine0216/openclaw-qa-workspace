import { browserWindowCustom } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import * as consts from '../../../../constants/visualizations.js';

describe('NLG_SmartMetricsACC_ComponentOn', () => {
    const testObjectInfo = {
        project: {
            id: '235853DC4B79DABCE8C6FFB26B7D8DC3',
            name: 'MicroStrategy Tutorial Project',
        },
        NLG: {
            id: '9FFCA5BAB44CC4165B6F6FBEBEE01DA7',
            name: 'NLG_SmartMetricsACC',
        },
        testName: 'NLG_SmartMetricsACC_ComponentOn',
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

    it('[SM_ACC01_00] NLG_SmartMetricsACC_ComponentOn | Page "Top / Bottom_0" ', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 1', pageName: 'Top / Bottom_0' }, [
            'Music',
            '57.55%',
        ]);
    });

    it('[SM_ACC01_01] NLG_SmartMetricsACC_ComponentOn | Page "Top / Bottom_1"', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 1', pageName: 'Top / Bottom_1' }, [
            'Mid-Atlantic',
            'Southwest',
            'Central',
            'Northeast',
            'Northwest',
            'South',
        ]);
    });

    it('[SM_ACC01_02] NLG_SmartMetricsACC_ComponentOn | Page "Top / Bottom_2"', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 1', pageName: 'Top / Bottom_2' }, [
            'Books',
            '21.52%',
        ]);
    });

    it('[SM_ACC01_03] NLG_SmartMetricsACC_ComponentOn | Page "Top / Bottom_3"', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 1', pageName: 'Top / Bottom_3' }, [
            'South',
            '14.82%',
        ]);
    });

    it('[SM_ACC01_04] NLG_SmartMetricsACC_ComponentOn | Page "Average"', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 1', pageName: 'Average' }, [
            'Mid-Atlantic',
            '15.46%',
            'Northwest',
            '15.40%',
            'Southwest',
            '15.36%',
            'Central',
            '15.34%',
        ]);
    });

    it('[SM_ACC01_05] NLG_SmartMetricsACC_ComponentOn | Page "Count"', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 1', pageName: 'Count' }, [
            'Mid-Atlantic: 15.46%',
            'Northwest: 15.40%',
            'Southwest: 15.36%',
            'Central: 15.34%',
            'Northeast: 15.29%',
        ]);
    });
});
