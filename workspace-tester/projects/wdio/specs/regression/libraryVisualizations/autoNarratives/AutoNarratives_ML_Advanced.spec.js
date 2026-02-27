import { browserWindowCustom } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import * as consts from '../../../../constants/visualizations.js';

describe('AutoNarratives_ML_Advanced', () => {
    const testObjectInfo = {
        project: {
            id: '235853DC4B79DABCE8C6FFB26B7D8DC3',
            name: 'MicroStrategy Tutorial Project',
        },
        NLG: {
            id: 'A33D903A47D103297E47D187D220FBB5',
            name: 'NLG_AdvancedML_ABA',
        },
        testName: 'AutoNarratives_ML_Advanced',
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

    it('[TC97089_1] NLG_AdvancedML_ABA | Chapter 1 | Trend ', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: 'Trend 1',
        });
        await since('page Trend 1 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('increase');
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: 'Trend 2',
        });
        await since('page Trend 2 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Books');
        await since('page Trend 2 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('increase');
    });

    it('[TC97089_2] NLG_AdvancedML_ABA | Chapter 1 | Forecast ', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 2',
            pageName: 'Forecast 1',
        });
        await since('page Forecast 1 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('200917');
        await since('page Forecast 1 text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('1,549,12');
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 2',
            pageName: 'Forecast 2',
        });
        await since('page Forecast 2 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('25,222');
        await since('page Forecast 2 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('6,003');
    });

    it('[TC97089_3] NLG_AdvancedML_ABA | Chapter 1 | KeyDriver ', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 3',
            pageName: 'KeyDriver 1',
        });
        await since('page KeyDriver 1 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('positive impact');
        await since('page KeyDriver 1 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('14.5%');
    });
});
