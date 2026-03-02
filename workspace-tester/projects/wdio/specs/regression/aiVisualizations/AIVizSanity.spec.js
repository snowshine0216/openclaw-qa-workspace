import { browserWindowCustom } from '../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { languageIdMap } from '../../../constants/bot.js';

describe('AIVizSanity', () => {
    let botId, dossierId, projectID;

    let {
        loginPage,
        libraryPage,
        botVisualizations,
        aibotChatPanel,
        aiAssistant,
        autoDashboard,
        libraryAuthoringPage,
        botAuthoring,
        dossierPage,
        datasetsPanel,
        dossierAuthoringPage,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(browsers.params.credentials);
        await loginPage.disableTutorial();
        await loginPage.disablePendoTutorial();
        await setWindowSize(browserWindowCustom);
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC93972_1] Bot | Sanit test visualizations on bot', async () => {
        await libraryAuthoringPage.createBotWithNewDataInDefaultProject();
        await botAuthoring.addSampleData(languageIdMap.EnglishUnitedStates, 'Retail Sample Data');
        await botAuthoring.saveAsBotInMyReports('NewBotForVisualizations');
        await dossierPage.sleep(2000);
        botId = await botAuthoring.getBotIdFromUrl();
        projectID = await botAuthoring.getProjectIdFromUrl();
        await botAuthoring.exitBotAuthoring();
        await dossierPage.goToLibrary();
        await libraryPage.openBotById({ projectId: projectID, botId });
        await aibotChatPanel.clearHistoryAndAskQuestion('Show in a bar chart for revenue and cost over City');
        await botVisualizations.checkVizByImageComparison('viz/AIVizSanity/TC93972_1', '01_Bot_BarChart');
        await aibotChatPanel.clearHistoryAndAskQuestion('Show in a Line chart for revenue and cost over City');
        await botVisualizations.checkVizByImageComparison('viz/AIVizSanity/TC93972_1', '02_Bot_LineChart');
        await aibotChatPanel.clearHistoryAndAskQuestion('Show in a Pie chart for revenue over City');
        await botVisualizations.checkVizByImageComparison('viz/AIVizSanity/TC93972_1', '03_Bot_PieChart');
        await aibotChatPanel.clearHistoryAndAskQuestion('Show in a Heatmap for revenue over City');
        await botVisualizations.checkVizByImageComparison('viz/AIVizSanity/TC93972_1', '04_Bot_Heatmap');
        await aibotChatPanel.clearHistoryAndAskQuestion('Show in a map for revenue over City');
        await botVisualizations.checkVizByImageComparison('viz/AIVizSanity/TC93972_1', '05_Bot_Map');
        await aibotChatPanel.clearHistoryAndAskQuestion('Show in a combo chart for revenue and cost over City');
        await botVisualizations.checkVizByImageComparison('viz/AIVizSanity/TC93972_1', '06_Bot_ComboChart');
        await aibotChatPanel.clearHistoryAndAskQuestion('Show in a Bubble Chart for revenue and cost over City');
        await botVisualizations.checkVizByImageComparison('viz/AIVizSanity/TC93972_1', '07_Bot_BubbleChart');
        await aibotChatPanel.clearHistoryAndAskQuestion('Show in a histogram for revenue over City');
        await botVisualizations.checkVizByImageComparison('viz/AIVizSanity/TC93972_1', '08_Bot_Histogram');
        await aibotChatPanel.clearHistoryAndAskQuestion('Show the key driver for revenue over suppliers');
        await botVisualizations.checkVizByImageComparison('viz/AIVizSanity/TC93972_1', '09_Bot_KeyDriver');
        await aibotChatPanel.clearHistoryAndAskQuestion('Show the trend for revenue over Month Date');
        await botVisualizations.checkVizByImageComparison('viz/AIVizSanity/TC93972_1', '10_Bot_Trend');
        await aibotChatPanel.clearHistoryAndAskQuestion('Show the forecast for revenue over Month Date');
        await botVisualizations.checkVizByImageComparison('viz/AIVizSanity/TC93972_1', '11_Bot_Forecast');
        await aibotChatPanel.clearHistoryAndAskQuestion('Show the total revenue using KPI');
        await botVisualizations.checkVizByImageComparison('viz/AIVizSanity/TC93972_1', '12_Bot_KPI');
        await aibotChatPanel.clearHistoryAndAskQuestion('Show in a Grid for revenue and cost over City');
        await botVisualizations.checkVizByImageComparison('viz/AIVizSanity/TC93972_1', '13_Bot_Grid');
    });

    it('[TC93972_2] AutoAnswer | Sanit test visualizations on Auto Answer', async () => {
        await dossierPage.goToLibrary();
        await libraryAuthoringPage.createBlankDashboardFromLibrary();
        // Import a dataset from sample files
        await dossierAuthoringPage.addNewSampleData(6); // The 7th file in the list 'retail-sample-data'
        await datasetsPanel.doubleClickAttributeMetricByName('City');
        await datasetsPanel.doubleClickAttributeMetricByName('Date');
        await datasetsPanel.doubleClickAttributeMetricByName('Supplier');
        await datasetsPanel.doubleClickAttributeMetricByName('Cost');
        await datasetsPanel.doubleClickAttributeMetricByName('Revenue');
        await libraryAuthoringPage.saveDashboardInMyReports('NewDashboardForAutoAnswer');
        await dossierPage.sleep(2000);
        dossierId = await botAuthoring.getDossierIdFromUrl();
        projectID = await botAuthoring.getProjectIdFromUrl();
        await libraryAuthoringPage.goToHome();
        await libraryPage.openUrl(projectID, dossierId);
        await aiAssistant.open();
        await aiAssistant.clickMaxMinBtn();
        await aiAssistant.clearHistoryVizCreationByChat('Show in a bar chart for revenue and cost over City');
        await aiAssistant.checkChatbotVizByIndex(0, 'viz/AIVizSanity/TC93972_2', '01_AutoAnswer_BarChart');
        await aiAssistant.clearHistoryVizCreationByChat('Show in a Line chart for revenue and cost over City');
        await aiAssistant.checkChatbotVizByIndex(0, 'viz/AIVizSanity/TC93972_2', '02_AutoAnswer_LineChart');
        await aiAssistant.clearHistoryVizCreationByChat('Show in a Pie chart for revenue over City');
        await aiAssistant.checkChatbotVizByIndex(0, 'viz/AIVizSanity/TC93972_2', '03_AutoAnswer_PieChart');
        await aiAssistant.clearHistoryVizCreationByChat('Show in a Heatmap for revenue over City');
        await aiAssistant.checkChatbotVizByIndex(0, 'viz/AIVizSanity/TC93972_2', '04_AutoAnswer_Heatmap');
        await aiAssistant.clearHistoryVizCreationByChat('Show in a map for revenue over City');
        await aiAssistant.checkChatbotVizByIndex(0, 'viz/AIVizSanity/TC93972_2', '05_AutoAnswer_Map');
        await aiAssistant.clearHistoryVizCreationByChat('Show in a combo chart for revenue and cost over City');
        await aiAssistant.checkChatbotVizByIndex(0, 'viz/AIVizSanity/TC93972_2', '06_AutoAnswer_ComboChart');
        await aiAssistant.clearHistoryVizCreationByChat('Show in a Bubble Chart for revenue and cost over City');
        await aiAssistant.checkChatbotVizByIndex(0, 'viz/AIVizSanity/TC93972_2', '07_AutoAnswer_BubbleChart');
        await aiAssistant.clearHistoryVizCreationByChat('Show in a histogram for revenue over City');
        await aiAssistant.checkChatbotVizByIndex(0, 'viz/AIVizSanity/TC93972_2', '08_AutoAnswer_Histogram');
        await aiAssistant.clearHistoryVizCreationByChat('Show the key driver for revenue over suppliers');
        await aiAssistant.checkChatbotVizByIndex(0, 'viz/AIVizSanity/TC93972_2', '09_AutoAnswer_KeyDriver');
        await aiAssistant.clearHistoryVizCreationByChat('Show the trend for revenue over Month Date');
        await aiAssistant.checkChatbotVizByIndex(0, 'viz/AIVizSanity/TC93972_2', '10_AutoAnswer_Trend');
        await aiAssistant.clearHistoryVizCreationByChat('Show the forecast for revenue over Month Date');
        await aiAssistant.checkChatbotVizByIndex(0, 'viz/AIVizSanity/TC93972_2', '11_AutoAnswer_Forecast');
        await aiAssistant.clearHistoryVizCreationByChat('Show the total revenue using KPI');
        await aiAssistant.checkChatbotVizByIndex(0, 'viz/AIVizSanity/TC93972_2', '12_AutoAnswer_KPI');
        await aiAssistant.clearHistoryVizCreationByChat('Show in a Grid for revenue and cost over City');
        await aiAssistant.checkChatbotVizByIndex(0, 'viz/AIVizSanity/TC93972_2', '13_AutoAnswer_Grid');
        await dossierPage.goToLibrary();
    });

    it('[TC93972_3]  AutoDashboard | Sanit test visualizations on Auto Dashboard', async () => {
        await dossierPage.goToLibrary();
        await libraryAuthoringPage.createBlankDashboardFromLibrary();
        // Import a dataset from sample files
        await dossierAuthoringPage.addNewSampleData(6); // The 7th file in the list 'retail-sample-data'
        await datasetsPanel.doubleClickAttributeMetricByName('City');
        await datasetsPanel.doubleClickAttributeMetricByName('Date');
        await datasetsPanel.doubleClickAttributeMetricByName('Supplier');
        await datasetsPanel.doubleClickAttributeMetricByName('Cost');
        await datasetsPanel.doubleClickAttributeMetricByName('Revenue');
        await libraryAuthoringPage.saveDashboardInMyReports('NewDashboardForAutoDashboard');
        await autoDashboard.openAutoDashboard();
        await autoDashboard.clearHistoryVizCreationByChat('Show in a bar chart for revenue and cost over City');
        await autoDashboard.checkVizInAutoDashboard(0, 'viz/AIVizSanity/TC93972_3', '01_AutoDashboard_BarChart');
        await autoDashboard.clearHistoryVizCreationByChat('Show in a Line chart for revenue and cost over City');
        await autoDashboard.checkVizInAutoDashboard(0, 'viz/AIVizSanity/TC93972_3', '02_AutoDashboard_LineChart');
        await autoDashboard.clearHistoryVizCreationByChat('Show in a Pie chart for revenue over City');
        await autoDashboard.checkVizInAutoDashboard(0, 'viz/AIVizSanity/TC93972_3', '03_AutoDashboard_PieChart');
        await autoDashboard.clearHistoryVizCreationByChat('Show in a Heatmap for revenue over City');
        await autoDashboard.checkVizInAutoDashboard(0, 'viz/AIVizSanity/TC93972_3', '04_AutoDashboard_Heatmap');
        await autoDashboard.clearHistoryVizCreationByChat('Show in a map for revenue over City');
        await autoDashboard.checkVizInAutoDashboard(0, 'viz/AIVizSanity/TC93972_3', '05_AutoDashboard_Map');
        await autoDashboard.clearHistoryVizCreationByChat('Show in a combo chart for revenue and cost over City');
        await autoDashboard.checkVizInAutoDashboard(0, 'viz/AIVizSanity/TC93972_3', '06_AutoDashboard_ComboChart');
        await autoDashboard.clearHistoryVizCreationByChat('Show in a Bubble Chart for revenue and cost over City');
        await autoDashboard.checkVizInAutoDashboard(0, 'viz/AIVizSanity/TC93972_3', '07_AutoDashboard_BubbleChart');
        await autoDashboard.clearHistoryVizCreationByChat('Show in a histogram for revenue over City');
        await autoDashboard.checkVizInAutoDashboard(0, 'viz/AIVizSanity/TC93972_3', '08_AutoDashboard_Histogram');
        await autoDashboard.clearHistoryVizCreationByChat('Show the key driver for revenue over suppliers');
        await autoDashboard.checkVizInAutoDashboard(0, 'viz/AIVizSanity/TC93972_3', '09_AutoDashboard_KeyDriver');
        await autoDashboard.clearHistoryVizCreationByChat('Show the trend for revenue over Month Date');
        await autoDashboard.checkVizInAutoDashboard(0, 'viz/AIVizSanity/TC93972_3', '10_AutoDashboard_Trend');
        await autoDashboard.clearHistoryVizCreationByChat('Show the forecast for revenue over Month Date');
        await autoDashboard.checkVizInAutoDashboard(0, 'viz/AIVizSanity/TC93972_3', '11_AutoDashboard_Forecast');
        await autoDashboard.clearHistoryVizCreationByChat('Show the total revenue using KPI');
        await autoDashboard.checkVizInAutoDashboard(0, 'viz/AIVizSanity/TC93972_3', '12_AutoDashboard_KPI');
        await autoDashboard.clearHistoryVizCreationByChat('Show in a Grid for revenue and cost over City');
        await autoDashboard.checkVizInAutoDashboard(0, 'viz/AIVizSanity/TC93972_3', '13_AutoDashboard_Grid');
    });
});
