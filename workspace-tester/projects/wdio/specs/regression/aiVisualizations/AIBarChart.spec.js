import { browserWindowCustom } from '../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../config/setWindowSize.js';
import * as consts from '../../../constants/visualizations.js';

describe('AIBarChart', () => {
    const TestObject = {
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial Project',
        },
        Bot_BarChart: {
            id: '00A6000A0B48703E92233AA7F3FF6E1A',
            name: 'Bot_BarChart',
        },
        DDADossier: {
            id: '0FFDF6D4364258D67DCDE0ADBEA5035D',
            name: 'DDADossier',
        },
        StoreSales_Dossier: {
            id: 'A35C2C4A444E1361E30BC4B52C0C62F1',
            name: 'StoreSales_DossierCI',
        },
        DDADossier_CustomInstruction: {
            id: '7658956FB442F839549C6390A87110EB',
            name: 'DDADossier_CustomInstructons',
        },
        testName: 'AIBarChart',
    };

    let { loginPage, libraryPage, botVisualizations, aibotChatPanel, toc, aiAssistant, contentsPanel, autoDashboard } =
        browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(consts.vizUser.credentials);
        await setWindowSize(browserWindowCustom);
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC97847_1] Bot | Show the revenue distribution among categories for different years in a bar chart', async () => {
        await libraryPage.openBotByIdAndWait({ projectId: TestObject.project.id, botId: TestObject.Bot_BarChart.id });
        await aibotChatPanel.clearHistoryAndAskQuestion(
            'Show the revenue distribution among categories for different years in a bar chart'
        );
        await botVisualizations.checkVizByImageComparison('viz/AIBarChart/TC97847', '01_Bot_StackedBarChart');
    });

    it('[TC97847_2] Bot | Show the revenue distribution among categories for different years in a clustered bar chart', async () => {
        await aibotChatPanel.clearHistoryAndAskQuestion(
            'Show the revenue distribution among categories for different years in a clustered bar chart'
        );
        await botVisualizations.checkVizByImageComparison('viz/AIBarChart/TC97847', '02_Bot_ClusteredBarChart');
    });

    it('[TC97847_3] AutoAnswer | Show the revenue distribution among categories for different years in a bar chart', async () => {
        await libraryPage.openUrl(TestObject.project.id, TestObject.DDADossier.id);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await aiAssistant.open();
        await aiAssistant.clickMaxMinBtn();
        await aiAssistant.clearHistory();
        await aiAssistant.vizCreationByChat(
            'Show the revenue distribution among categories for different years in a bar chart'
        );
        await aiAssistant.checkChatbotVizByIndex(0, 'viz/AIBarChart/TC97847', '03_AutoAnswer_StackedBarChart');
    });

    it('[TC97847_4] AutoAnswer | Show the revenue distribution among categories for different years in a clustered bar chart', async () => {
        await aiAssistant.clearHistory();
        await aiAssistant.vizCreationByChat(
            'Show the revenue distribution among categories for different years in a clustered bar chart'
        );
        await aiAssistant.checkChatbotVizByIndex(0, 'viz/AIBarChart/TC97847', '04_AutoAnswer_ClusteredBarChart');
    });

    it('[TC97847_5]  AutoDashboard | Show the revenue distribution among categories for different years in a bar chart', async () => {
        await libraryPage.editDossierByUrl({
            projectId: TestObject.project.id,
            dossierId: TestObject.StoreSales_Dossier.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'gridPage',
        });
        await autoDashboard.openAutoDashboard();
        await autoDashboard.clearHistory();
        await autoDashboard.vizCreationByChat(
            'Show the revenue distribution among categories for different years in a bar chart'
        );
        await autoDashboard.checkVizInAutoDashboard(0, 'viz/AIBarChart/TC97847', '05_AutoDashboard_StackedBarChart');
    });

    it('[TC97847_6]  AutoDashboard | Show the revenue distribution among categories for different years in a clustered bar chart', async () => {
        await autoDashboard.clearHistory();
        await autoDashboard.vizCreationByChat(
            'Show the revenue distribution among categories for different years in a clustered bar chart'
        );
        await autoDashboard.checkVizInAutoDashboard(0, 'viz/AIBarChart/TC97847', '06_AutoDashboard_ClusteredBarChart');
    });

    it('[TC97847_7] AutoAnswer | Custom Instruction | Show revenue distribution over regions and categories.', async () => {
        await libraryPage.openUrl(TestObject.project.id, TestObject.DDADossier_CustomInstruction.id);
        await aiAssistant.open();
        await aiAssistant.clickMaxMinBtn();
        await aiAssistant.clearHistory();
        await aiAssistant.vizCreationByChat('Show revenue distribution over regions and categories.');
        await aiAssistant.checkChatbotVizByIndex(
            0,
            'viz/AIBarChart/TC97847',
            '07_AutoAnswer_HorizontalClusteredBarChart'
        );
    });

    it('[TC97847_8]  AutoDashboard | Custom Instruction | Show revenue distribution over regions and categories.', async () => {
        await libraryPage.editDossierByUrl({
            projectId: TestObject.project.id,
            dossierId: TestObject.DDADossier_CustomInstruction.id,
        });
        await autoDashboard.openAutoDashboard();
        await autoDashboard.clearHistory();
        await autoDashboard.vizCreationByChat('Show revenue distribution over regions and categories.');
        await autoDashboard.checkVizInAutoDashboard(
            0,
            'viz/AIBarChart/TC97847',
            '08_AutoDashboard_HorizontalClusteredBarChart'
        );
    });
});
