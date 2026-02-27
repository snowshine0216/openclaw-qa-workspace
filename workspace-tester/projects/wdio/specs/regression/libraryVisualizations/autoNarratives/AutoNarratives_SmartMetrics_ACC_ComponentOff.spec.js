import { browserWindowCustom } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import * as consts from '../../../../constants/visualizations.js';

describe('NLG_SmartMetricsACC_ComponentOff', () => {
    const testObjectInfo = {
        project: {
            id: '235853DC4B79DABCE8C6FFB26B7D8DC3',
            name: 'MicroStrategy Tutorial Project',
        },
        NLG: {
            id: '27956FD9D94144704EB0D98A8833D92D',
            name: 'NLG_SmartMetricsACC_ComponentOff',
        },
        testName: 'NLG_SmartMetricsACC_ComponentOff',
    };

    let { loginPage, libraryPage, contentsPanel, autoNarratives } = browsers.pageObj1;

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

    it('[SM_ACC02_00] NLG_SmartMetricsACC_ComponentOff | Page "Top / Bottom_0" ', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 1', pageName: 'Top / Bottom_0' }, [
            'Music',
            '57.55%',
        ]);
    });

    it('[SM_ACC02_01] NLG_SmartMetricsACC_ComponentOff | Page "Top / Bottom_1"', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 1', pageName: 'Top / Bottom_1' }, [
            'Books',
            '54.38%',
            'Electronics',
            '56.19%',
        ]);
    });

    it('[SM_ACC02_02] NLG_SmartMetricsACC_ComponentOff | Page "Top / Bottom_2"', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 1', pageName: 'Top / Bottom_2' }, [
            'South',
            '14.82%',
        ]);
    });

    it('[SM_ACC02_03] NLG_SmartMetricsACC_ComponentOff | Page "Average" ', async () => {
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
            'Northeast',
            '15.29%',
        ]);
    });

    it('[SM_ACC02_04] NLG_SmartMetricsACC_ComponentOff | Page "Count"', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 1', pageName: 'Count' }, ['Web', '14.95%']);
    });

    it('[SM_ACC02_05] NLG_SmartMetricsACC_ComponentOff | Page "General"', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.validatePageSummaryText({ chapterName: 'Chapter 1', pageName: 'General' }, [
            'Region: Central',
            'Top 2 products',
            'Art & Architecture',
            '23.00%',
            'Science & Technology',
            '22.62%',
            'Bottom 2 products',
            'Alternative',
            '1.32%',
            'Country',
            '1.04%',
            'Region: Mid-Atlantic',
            'Top 2 products',
            'Science & Technology',
            '22.98%',
            'Art & Architecture',
            '22.66%',
            'Bottom 2 products',
            'Alternative',
            '1.29%',
            'Country',
            '1.04%',
        ]);
    });
});
