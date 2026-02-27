import { browserWindowCustom } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import * as consts from '../../../../constants/visualizations.js';
import { botChnUser } from '../../../../constants/bot.js';
import { Key } from 'webdriverio';

describe('AutoNarratives_ML_Basic', () => {
    const testObjectInfo = {
        project: {
            id: '235853DC4B79DABCE8C6FFB26B7D8DC3',
            name: 'MicroStrategy Tutorial Project',
        },
        NLG: {
            id: '7DC99CA54357882AD7FC3C98DEAF7701',
            name: 'NLG_Calculation_ABA',
        },
        NLG2: {
            id: 'CAD8946C4DCFB21EB6F0A3A02D7A224A',
            name: 'NLG_Calculation_ABA_2',
        },
        testName: 'AutoNarratives_ML_Basic',
    };

    let {
        loginPage,
        libraryPage,
        vizGallery,
        contentsPanel,
        dossierEditorUtility,
        editorPanel,
        datasetsPanel,
        formatPanel,
        keyDriverFormatPanel,
        visualizationPanel,
        toolbar,
        keyDriver,
        autoNarratives,
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

    it('[TC96067_1] NLG_Calculation_ABA | Chapter 1 | Min', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: 'Min 1',
        });
        await since('page Min 1 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('minimum');
        await since('page Min 1 text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('$8,647,238');
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: 'Min 2',
        });
        await since('page Min 2 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('minimum');
        await since('page Min 2 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('$471,477');
    });

    it('[TC96067_2] NLG_Calculation_ABA | Chapter 2 | Max', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 2',
            pageName: 'Max 1',
        });
        await since('page Max 1 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('maximum');
        await since('page Max 1 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('$14,858,864');
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 2',
            pageName: 'Max 2',
        });
        await since('page Max 2 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('maximum');
        await since('page Max 2 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('$3,437,829');
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 2',
            pageName: 'Max 3',
        });
        await since('page Max 3 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('2009: $3,437,829');
        await since('page Max 3 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('2008: $2,870,291');
        await since('page Max 3 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('2007: $2,246,294');
    });

    it('[TC96067_3] NLG_Calculation_ABA | Chapter 3 | Mean', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 3',
            pageName: 'Mean 1',
        });
        await since('page Mean 1 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('$4,377,964');
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 3',
            pageName: 'Mean 2',
        });
        await since('page Mean 2 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('$1,459,321');
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 3',
            pageName: 'Mean 3',
        });
        await since('page Mean 3 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('2,851,472');
    });

    it('[TC96067_4] NLG_Calculation_ABA | Chapter 4 | Sum', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 4',
            pageName: 'Total 1',
        });
        await since('page Total 1 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('$35,023,708');
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 4',
            pageName: 'Total 2',
        });
        await since('page Total 2 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('$35,023,708');
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 4',
            pageName: 'Total 3',
        });
        await since('page Total 3 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('$2,239,951');
    });

    it('[TC96067_5] NLG_Calculation_ABA | Chapter 5 | First', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 5',
            pageName: 'First 1',
        });
        await since('page First 1 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('$5,029,366');
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 5',
            pageName: 'First 2',
        });
        await since('page First 2 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('$1,293,634');
    });

    it('[TC96067_6] NLG_Calculation_ABA | Chapter 6 | Last', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 6',
            pageName: 'Last 1',
        });
        await since('page Last 1 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('$3,902,762');
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 6',
            pageName: 'Last 2',
        });
        await since('page Last 2 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('$2,399,894');
    });

    it('[TC96067_7] NLG_Calculation_ABA2 | Chapter 7 | Median', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG2.id,
        });
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 7',
            pageName: 'Median 1',
        });
        await since('page Median 1 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('$4,177,689');
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 7',
            pageName: 'Median 2',
        });
        await since('page Median 2 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('$1,354,700');
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 7',
            pageName: 'Median 3',
        });
        await since('page Median 3 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('2,870,291');
    });

    it('[TC96067_8] NLG_Calculation_ABA2 | Chapter 8 | Standard', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG2.id,
        });

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 8',
            pageName: 'Std 1',
        });
        await since('page Std 1 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('$1,784,501');
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 8',
            pageName: 'Std 2',
        });
        await since('page Std 2 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('$660,803');
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 8',
            pageName: 'Std 3',
        });
        await since('page Std 3 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('$595,990');
    });

    it('[TC96067_9] NLG_Calculation_ABA2 | Chapter 9 | Variance', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG2.id,
        });

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 9',
            pageName: 'Var 1',
        });
        await since('page Var 1 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('$4,429,637,318,429');
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 9',
            pageName: 'Var 2',
        });
        await since('page Var 2 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('$607,042,210,973');
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 9',
            pageName: 'Var 3',
        });
        await since('page Var 3 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('$355,204,139,437');
    });

    it('[TC96067_10] NLG_Calculation_ABA2 | Chapter 10 | Count and Distinct Dount', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG2.id,
        });

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 10',
            pageName: 'Count 1',
        });
        await since('page Count 1 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('8');
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 10',
            pageName: 'Distinct 1',
        });
        await since('page Distinct 1 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('8');
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 10',
            pageName: 'Distinct 2',
        });
        await since('page Distinct 2 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('8');
    });

    it('[TC96067_11] NLG_Calculation_ABA2 | Chapter 11 | Mode', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG2.id,
        });

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 11',
            pageName: 'Mode 1',
        });
        await since('page Mode 1 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('4.62%');
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 11',
            pageName: 'Mode 2',
        });
        await since('page Mode 2 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('1');
    });

    it('[TC96067_12] NLG_Calculation_ABA2 | Chapter 12 | Production', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG2.id,
        });

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 12',
            pageName: 'Pro 1',
        });
        await since('page Pro 1 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('20,965,965,565,195,200');
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 12',
            pageName: 'Pro 2',
        });
        await since('page Pro 2 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('$58,718,908,430,507,600,000,000,000,000,000,000,000,000,000,000,000');
    });

    it('[TC96067_13] NLG_Calculation_ABA2 | Chapter 13 | Geo Mean', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG2.id,
        });

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 13',
            pageName: 'Geo Mean 1',
        });
        await since('page Geo Mean 1 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('3,945,456');
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 13',
            pageName: 'Geo Mean 2',
        });
        await since('page Geo Mean 2 summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('$1,265,105');
    });
});
