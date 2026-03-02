import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindowCustom } from '../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { createBotByAPI, publishBotByAPI } from '../../../api/bot/index.js';
import deleteBotList from '../../../api/bot/deleteBot.js';
import * as consts from '../../../constants/visualizations.js';

describe('ChatPanelVizTheme', () => {
    let {
        loginPage,
        libraryPage,
        libraryAuthoringPage,
        aibotChatPanel,
        botAuthoring,
        botAppearance,
        botVisualizations,
        aibotSnapshotsPanel,
    } = browsers.pageObj1;
    let botId;

    beforeAll(async () => {
        await setWindowSize(browserWindowCustom);
        await loginPage.login(consts.vizUser.credentials);
    });

    beforeEach(async () => {
        botId = await createBotByAPI({ credentials: consts.vizUser.credentials, botInfo: consts.vizBotHRData });
        consts.publishInfoViz.id = botId;
        console.log(consts.publishInfoViz);
        await publishBotByAPI({
            credentials: consts.vizUser.credentials,
            publishInfo: consts.publishInfoViz,
        });
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await deleteBotList({
            credentials: consts.vizUser.credentials,
            botList: [botId],
            projectId: consts.vizBotHRData.project.id,
        });
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    // check visualization theme(Red) and color palette (Harvest)
    it('[TC92027] Acceptance [Library Web] Verify the key function of visualization theming in AI bot. ', async () => {
        //create a new bot, default theme and color palette
        await libraryPage.openBotById({ projectId: consts.vizBotHRData.project.id, botId: botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        // change theme to Red
        await botAuthoring.selectBotConfigTabByName('Appearance');
        await botAppearance.changeThemeTo('Red');
        await botAppearance.changeThemeTo('Custom');
        await botAppearance.changeThemeItemColor('Background', '#193B67');
        await botAppearance.changeThemeItemColor('Text', '#C1292F');
        await botAppearance.changePaletteTo('Harvest');
        await botAuthoring.saveBotWithConfirm();
        await botAuthoring.exitBotAuthoring();
        // reopen bot, ask question to show visualizations.
        await aibotChatPanel.clearHistoryAndAskQuestion(consts.HRDataQuestions.grid);
        await botVisualizations.checkQueryMessageByImageComparison('viz/AIBotVisualizations/TC92027', 'question');
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92027', 'Grid');
        await aibotChatPanel.clearHistoryAndAskQuestion(consts.HRDataQuestions.barChart);
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92027', 'BarChart');
        await aibotChatPanel.clearHistoryAndAskQuestion(consts.HRDataQuestions.lineChart);
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92027', 'LineChart');
        await aibotChatPanel.clearHistoryAndAskQuestion(consts.HRDataQuestions.pieChart);
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92027', 'PieChart');
        await aibotChatPanel.clearHistoryAndAskQuestion(consts.HRDataQuestions.multiMetricKPI);
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92027', 'MultiMetricKPI');
        await aibotChatPanel.clearHistoryAndAskQuestion(consts.HRDataQuestions.heatMap);
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92027', 'HeatMap');
        await aibotChatPanel.clearHistoryAndAskQuestion(consts.HRDataQuestions.mapBox);
        await botVisualizations.checkMapByImageComparison(0, 'viz/AIBotVisualizations/TC92027', 'MapBox');
        await aibotChatPanel.clearHistoryAndAskQuestion(consts.HRDataQuestions.insightLineChartTrend);
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92027', 'InsightLineChartTrend');
        await aibotChatPanel.clearHistoryAndAskQuestion(consts.HRDataQuestions.insightLineChartForecast);
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92027', 'InsightLineChartForecast');
        await aibotChatPanel.clearHistoryAndAskQuestion(consts.HRDataQuestions.keyDriver);
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92027', 'keyDriver');
        await aibotChatPanel.clearHistoryAndAskQuestion(consts.HRDataQuestions.histograms);
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92027', 'histograms');
    });

    //check visualization theme(Dark) and color palette (Classic 2)
    it('[TC92028] Acceptance [Library Web] Verify the key function of visualization theming in AI bot_DarkTheme. ', async () => {
        //create a new bot, default theme and color palette
        await libraryPage.openBotById({ projectId: consts.vizBotHRData.project.id, botId: botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        // change theme to Dark and color palette to Harvest
        await botAuthoring.selectBotConfigTabByName('Appearance');
        await botAppearance.changeThemeTo('Dark');
        await botAppearance.changePaletteTo('Classic 2');
        await botAuthoring.saveBotWithConfirm();
        await botAuthoring.exitBotAuthoring();
        // reopen bot, ask question to show visualizations.
        await aibotChatPanel.clearHistoryAndAskQuestion(consts.HRDataQuestions.grid);
        await botVisualizations.checkQueryMessageByImageComparison('viz/AIBotVisualizations/TC92028', 'question');
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92028', 'Grid');
        await aibotChatPanel.clearHistoryAndAskQuestion(consts.HRDataQuestions.barChart);
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92028', 'BarChart');
        await aibotChatPanel.clearHistoryAndAskQuestion(consts.HRDataQuestions.lineChart);
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92028', 'LineChart');
        await aibotChatPanel.clearHistoryAndAskQuestion(consts.HRDataQuestions.pieChart);
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92028', 'PieChart');
        await aibotChatPanel.clearHistoryAndAskQuestion(consts.HRDataQuestions.multiMetricKPI);
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92028', 'MultiMetricKPI');
        await aibotChatPanel.clearHistoryAndAskQuestion(consts.HRDataQuestions.heatMap);
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92028', 'HeatMap');
        await aibotChatPanel.clearHistoryAndAskQuestion(consts.HRDataQuestions.mapBox);
        await botVisualizations.checkMapByImageComparison(0, 'viz/AIBotVisualizations/TC92028', 'MapBox');
        await aibotChatPanel.clearHistoryAndAskQuestion(consts.HRDataQuestions.insightLineChartTrend);
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92028', 'InsightLineChartTrend');
        await aibotChatPanel.clearHistoryAndAskQuestion(consts.HRDataQuestions.insightLineChartForecast);
        await botVisualizations.checkVizByImageComparison(
            'viz/AIBotVisualizations/TC92028',
            'InsightLineChartForecast'
        );
        await aibotChatPanel.clearHistoryAndAskQuestion(consts.HRDataQuestions.keyDriver);
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92028', 'KeyDriver');
        await aibotChatPanel.clearHistoryAndAskQuestion(consts.HRDataQuestions.histograms);
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92028', 'Histograms');
    });
    it('[TC92388] Function [Library Web] Verify the cross function of visualization theming in AI bot.', async () => {
        // Check Tooltip, RMC context menu for Grid in Bot, Snapshot.
        await libraryPage.openBotById({ projectId: consts.vizBotHRData.project.id, botId: botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await aibotChatPanel.clickOpenSnapshotPanelButton();
        // change theme to Dark and color palette to Classic 2
        await botAuthoring.selectBotConfigTabByName('Appearance');
        await botAppearance.changeThemeTo('Red');
        await botAppearance.changePaletteTo('Classic 2');
        await botAuthoring.saveBotWithConfirm();
        await aibotChatPanel.clearHistoryAndAskQuestion(consts.HRDataQuestions.barChart);
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92388', '00_Bar');
        await aibotChatPanel.takeSnapshot();
        await botVisualizations.checkVizInSnapshotPanel('viz/AIBotVisualizations/TC92388', '01_Bar_Snapshot');
        await aibotSnapshotsPanel.clickFocusSnapshotButton();
        await botVisualizations.checkVizInSnapshotDialog('viz/AIBotVisualizations/TC92388', '02_Bar_SnapshotFocus');
        await aibotSnapshotsPanel.clickCloseFocusViewButton();
        // change color palette to Harvest
        await botAppearance.changePaletteTo('Harvest');
        await botAuthoring.saveBotWithConfirm();
        await aibotChatPanel.askQuestion(consts.HRDataQuestions.heatMap);
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92388', '03_HeatMap', 1);
        await aibotChatPanel.takeSnapshot(1);
        await botVisualizations.checkVizInSnapshotPanel('viz/AIBotVisualizations/TC92388', '04_Heatmap_Snapshot');
        await botAuthoring.exitBotAuthoring();
        // check color palette in bot consumption mode.
        await botVisualizations.checkVizByImageComparison(
            'viz/AIBotVisualizations/TC92388',
            '05_Heatmap_botConsumption',
            1
        );
        await aibotChatPanel.scrollChatPanelToTop();
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92388', '06_Bar_BotConsumption');
        await botVisualizations.checkVizInSnapshotPanel(
            'viz/AIBotVisualizations/TC92388',
            '07_Bar_Snapshot_Consumption',
            1
        );
        await botVisualizations.checkVizInSnapshotPanel(
            'viz/AIBotVisualizations/TC92388',
            '08_HeatMap_Snapshot_Consumption'
        );
        // check color palette by rerunnning an existing bot.
        await libraryPage.openBotById({ projectId: consts.vizBotHRData.project.id, botId: botId });
        await aibotChatPanel.clickOpenSnapshotPanelButton();
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92388', '09_Heatmap_Rerun', 1);
        await aibotChatPanel.scrollChatPanelToTop();
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92388', '10_Bar_Rerun');
        await botVisualizations.checkVizInSnapshotPanel('viz/AIBotVisualizations/TC92388', '11_Bar_Snapshot_Rerun', 1);
        await botVisualizations.checkVizInSnapshotPanel('viz/AIBotVisualizations/TC92388', '12_HeatMap_Snapshot_Rerun');
    });
});
