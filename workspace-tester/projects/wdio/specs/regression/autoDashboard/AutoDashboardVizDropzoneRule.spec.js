import { browserWindowCustom } from '../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../config/setWindowSize.js';
import * as consts from '../../../constants/visualizations.js';

describe('AutoDashboardVizDropzoneRule', () => {
    const testObjectInfo = {
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial Project',
        },
        StoreSales_Dossier: {
            id: 'A35C2C4A444E1361E30BC4B52C0C62F1',
            name: 'StoreSales_DossierCI',
        },
        testName: 'AutoDashboardVizDropzoneRule',
    };

    let { loginPage, libraryPage, autoDashboard, contentsPanel, botVisualizations, dossierEditorUtility } =
        browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(consts.vizUser.credentials);
        await loginPage.disableTutorial();
        await setWindowSize(browserWindowCustom);
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC93974_1]  E2E | vizSubtypeSQL_1 ', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.StoreSales_Dossier.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'gridPage',
        });
        await autoDashboard.openAutoDashboard();
        await botVisualizations.clearHistoryAndAskQuestion(
            'viz/AutoDashboardVizDropzoneRule/TC93974',
            'vizSubtypeSQL_1',
            'autoDashboard'
        );
    });

    it('[TC93974_2]  E2E | vizSubtypeSQL_2 ', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.StoreSales_Dossier.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'gridPage',
        });
        await autoDashboard.openAutoDashboard();
        await botVisualizations.clearHistoryAndAskQuestion(
            'viz/AutoDashboardVizDropzoneRule/TC93974',
            'vizSubtypeSQL_2',
            'autoDashboard'
        );
    });

    it('[TC93974_3]  E2E | vizSubtypeSQL_3 ', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.StoreSales_Dossier.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'gridPage',
        });
        await autoDashboard.openAutoDashboard();
        await botVisualizations.clearHistoryAndAskQuestion(
            'viz/AutoDashboardVizDropzoneRule/TC93974',
            'vizSubtypeSQL_3',
            'autoDashboard'
        );
    });

    it('[TC93974_4]  E2E | vizDropzoneSanity ', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.StoreSales_Dossier.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'gridPage',
        });
        await autoDashboard.openAutoDashboard();
        await botVisualizations.clearHistoryAndAskQuestion(
            'viz/AutoDashboardVizDropzoneRule/TC93974',
            'vizDropzoneSanity',
            'autoDashboard'
        );
    });

    it('[TC93974_5] E2E | CreatePageForProfitByQuarter ', async () => {
        // create page
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.StoreSales_Dossier.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'gridPage',
        });
        await autoDashboard.openAutoDashboard();
        await autoDashboard.clickPageCreationRecommendations();
        await autoDashboard.clickChatPanelAnalysesByName('Profit by Category');
        await dossierEditorUtility.checkVIVizPanel(
            'viz/AutoDashboardVizDropzoneRule/TC93974',
            'CreatePageForProfitByQuarter'
        );
    });
});
