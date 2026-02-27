import { browserWindowCustom } from '../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../config/setWindowSize.js';
import * as consts from '../../../constants/visualizations.js';
import { botChnUser } from '../../../constants/bot.js';

describe('ChatPanelVizI18N', () => {
    const aibots = {
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial Project',
        },
        BotChn_Viz: {
            id: '260E54585649C337F5744283993424EE',
            name: 'BotChn_Viz',
        },
        BotChn_Bar: {
            id: '1EDD2F748A426BCD4C6695AEE610CFD6',
            name: 'BotChn_Bar',
        },
        botStoreRevenue10k: {
            id: 'A42041258A4FEBE2D94CA68B05576C03',
            name: 'StoreRevenue_10k_Bot',
        },
    };

    let { loginPage, botVisualizations, aibotSnapshotsPanel, aibotChatPanel, libraryPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(botChnUser);
        await setWindowSize(browserWindowCustom);
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC91818] i18N | Display visualization inside AI bot - UI translation and the e2e workflow in multiple languages.', async () => {
        // Check the Bar graph in Bot, Snapshot.
        await aibotChatPanel.openBotAndOpenSnapshot({ botId: aibots.BotChn_Bar.id });
        await botVisualizations.hoverOnFistRect('bot');
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC91818', 'BarChart_Tooltip');
        await botVisualizations.checkVizInSnapshotPanel('viz/AIBotVisualizations/TC91818', 'BarChart_SnapshotCard');
        await aibotSnapshotsPanel.clickFocusSnapshotButton();
        await botVisualizations.checkVizInSnapshotDialog('viz/AIBotVisualizations/TC91818', 'BarChart_SnapshotDialog');
        // Ask question to show visualizations.
        await aibotChatPanel.openBotAndOpenSnapshot({ botId: aibots.BotChn_Viz.id });
        await aibotChatPanel.clearHistoryAndAskQuestion(consts.CHNDataQuestions.grid);
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC91818', 'Grid');
        await aibotChatPanel.clearHistoryAndAskQuestion(consts.CHNDataQuestions.barChart);
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC91818', 'BarChart');
        await aibotChatPanel.clearHistoryAndAskQuestion(consts.CHNDataQuestions.lineChart);
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC91818', 'LineChart');
        await aibotChatPanel.clearHistoryAndAskQuestion(consts.CHNDataQuestions.pieChart);
        await botVisualizations.hoverOnGMShape('bot');
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC91818', 'PieChart');
        await aibotChatPanel.clearHistoryAndAskQuestion(consts.CHNDataQuestions.multiMetricKPI);
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC91818', 'KPI');
        await aibotChatPanel.clearHistoryAndAskQuestion(consts.CHNDataQuestions.heatMap);
        await botVisualizations.hoverOnHeatmap('bot');
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC91818', 'HeatMap');
        await aibotChatPanel.clearHistoryAndAskQuestion(consts.CHNDataQuestions.insightLineChartTrend);
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC91818', 'InsightLineChartTrend');
        await aibotChatPanel.clearHistoryAndAskQuestion(consts.CHNDataQuestions.insightLineChartForecast);
        await botVisualizations.checkVizByImageComparison(
            'viz/AIBotVisualizations/TC91818',
            'InsightLineChartForecast'
        );
        await aibotChatPanel.clearHistoryAndAskQuestion(consts.CHNDataQuestions.keyDriver);
        await botVisualizations.hoverOnFistRect('bot');
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC91818', 'KeyDriver');
        // Check the 5k limit for histogram in bot
        // await libraryPage.openBotByIdAndWait({ botId: aibots.botStoreRevenue10k.id });
        // await aibotChatPanel.clearHistoryAndAskQuestion('Show the revenue distribution among regions in a histogram');
        // await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC91818', 'Histogram_5kLimit');
    });
});
