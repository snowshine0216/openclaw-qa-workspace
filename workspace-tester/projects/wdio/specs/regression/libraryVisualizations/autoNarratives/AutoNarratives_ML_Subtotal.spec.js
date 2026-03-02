import { browserWindowCustom } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import * as consts from '../../../../constants/visualizations.js';

describe('AutoNarratives_ML_Subtotal', () => {
    const testObjectInfo = {
        project: {
            id: '235853DC4B79DABCE8C6FFB26B7D8DC3',
            name: 'MicroStrategy Tutorial Project',
        },
        NLG: {
            id: 'FD14CBBF490C36EA11CBE5BE13D744FB',
            name: 'NLG_Subtotal_ABA',
        },
        testName: 'AutoNarratives_Subtotal',
    };

    let { loginPage, libraryPage, contentsPanel, autoNarratives } = browsers.pageObj1;

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

    it('[TC97090_1] NLG_Subtotal_ABA | Chapter 1 | Sum', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: 'Sum 1',
        });
        await since('page Sum 1 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('total');
        await since('page Sum 1 text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('17.81%');
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: 'Sum 2',
        });
        await since('page Sum 2 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('total');
        await since('page Sum 2 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('27.49%');
    });

    it('[TC97090_2] NLG_Subtotal_ABA | Chapter 2 | Average ', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 2',
            pageName: 'Average 1',
        });
        await since('page Average 1 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('average');
        await since('page Average 1 text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('15.18%');
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 2',
            pageName: 'Average 2',
        });
        await since('page Average 2 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('average');
        await since('page Average 2 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('26.82%');
    });

    it('[TC97090_3] NLG_Subtotal_ABA | Chapter 3 | Average ', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 3',
            pageName: 'Geo Mean 1',
        });
        await since('page Geo Mean 1 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('geometric mean');
        await since('page Geo Mean 1 text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('10.46%');
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 3',
            pageName: 'Geo Mean 2',
        });
        await since('page Geo Mean 2 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('geometric mean');
        await since('page Geo Mean 2 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('26.57%');
    });

    it('[TC97090_4] NLG_Subtotal_ABA | Chapter 4 | Median ', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 4',
            pageName: 'Median 1',
        });
        await since('page Median 1 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('median');
        await since('page Median 1 text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('19.09%');
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 4',
            pageName: 'Median 2',
        });
        await since('page Median 2 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('median');
        await since('page Median 2 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('28.67%');
    });

    it('[TC97090_5] NLG_Subtotal_ABA | Chapter 5 | Production ', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 5',
            pageName: 'Prod 1',
        });
        await since('page Prod 1 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('product');
        await since('page Prod 1 text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('0.00%');
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 5',
            pageName: 'Prod 2',
        });
        await since('page Prod 2 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('0.04%');
    });

    it('[TC97090_6] NLG_Subtotal_ABA | Chapter 6 | Standard Deviation', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 6',
            pageName: 'StandardDeviation 1',
        });
        await since('page StandardDeviation 1 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('standard deviation');
        await since('page StandardDeviation 1 text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('10.03%');
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 6',
            pageName: 'StandardDeviation 2',
        });
        await since('page StandardDeviation 2 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('standard deviation');
        await since('page StandardDeviation 2 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('3.80%');
    });

    it('[TC97090_7] NLG_Subtotal_ABA | Chapter 7 | Variance', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 7',
            pageName: 'Variance 1',
        });
        await since('page StandardDeviation 1 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('variance');
        await since('page StandardDeviation 1 text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('1.01%');
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 7',
            pageName: 'Variance 2',
        });
        await since('page Variance 2 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('variance');
        await since('page Variance 2 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('0.14%');
    });
});
