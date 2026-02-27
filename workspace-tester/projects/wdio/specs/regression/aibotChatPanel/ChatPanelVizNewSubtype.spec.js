import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindowCustom } from '../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import * as consts from '../../../constants/visualizations.js';
import { botChnUser } from '../../../constants/bot.js';

describe('ChatPanelVizNewSubtype', () => {
    let { loginPage, libraryPage, botVisualizations, aibotChatPanel } = browsers.pageObj1;
    const aibots = {
        mapArea: {
            name: 'BotWithState',
            id: 'DDF357E7F344846C1BDC60A21365176F',
        },
        Topics_GridMapBar: {
            name: 'Topics_GridMapBar',
            id: '3DEBCBCD4F446FB3213D89A9232992BA',
        },
        Topics_HeatmapPieChartKPI: {
            name: 'Topics_HeatmapPieChartKPI',
            id: '264994509A4280C1E1822D85CCFAFB51',
        },
        bot: {
            name: 'StoreSalesData_Bot_CI',
            id: 'F5C27D280847198529C1D4B03DB37CBE',
        },
    };

    beforeAll(async () => {
        await setWindowSize(browserWindowCustom);
        await loginPage.login(consts.vizUser.credentials);
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC93979_1] ACC | vizSubtypeSQL_1', async () => {
        await libraryPage.openBotByIdAndWait({ botId: aibots.bot.id });
        await botVisualizations.clearHistoryAndAskQuestion('viz/ChatPanelVizNewSubtype/TC93979', 'vizSubtypeSQL_1');
    });

    it('[TC93979_2] ACC | vizSubtypeSQL_2', async () => {
        await libraryPage.openBotByIdAndWait({ botId: aibots.bot.id });
        await botVisualizations.clearHistoryAndAskQuestion('viz/ChatPanelVizNewSubtype/TC93979', 'vizSubtypeSQL_2');
    });

    it('[TC93979_3] ACC | vizSubtypeSQL_3', async () => {
        await libraryPage.openBotByIdAndWait({ botId: aibots.bot.id });
        await botVisualizations.clearHistoryAndAskQuestion('viz/ChatPanelVizNewSubtype/TC93979', 'vizSubtypeSQL_3');
    });

    it('[TC94945_1] ACC| vizSubtypeMultiPassSQL_1', async () => {
        await libraryPage.openBotByIdAndWait({ botId: aibots.bot.id });
        await botVisualizations.clearHistoryAndAskQuestion(
            'viz/ChatPanelVizNewSubtype/TC93979',
            'vizSubtypeMultiPassSQL_1'
        );
        await libraryPage.openBotByIdAndWait({ botId: aibots.mapArea.id });
        await botVisualizations.clearHistoryAndAskQuestion('viz/ChatPanelVizNewSubtype/TC93979', 'vizSubtypeMap');
    });

    it('[TC94945_2] ACC | vizSubtypeMultiPassSQL_2', async () => {
        await libraryPage.openBotByIdAndWait({ botId: aibots.bot.id });
        await botVisualizations.clearHistoryAndAskQuestion(
            'viz/ChatPanelVizNewSubtype/TC93979',
            'vizSubtypeMultiPassSQL_2'
        );
    });

    it('[TC94945_3] ACC | vizSubtypeMultiPassSQL_3', async () => {
        await libraryPage.openBotByIdAndWait({ botId: aibots.bot.id });
        await botVisualizations.clearHistoryAndAskQuestion(
            'viz/ChatPanelVizNewSubtype/TC93979',
            'vizSubtypeMultiPassSQL_3'
        );
    });

    it('[TC93972_1] E2E | e2EAQ_1', async () => {
        await libraryPage.openBotByIdAndWait({ botId: aibots.bot.id });
        await botVisualizations.clearHistoryAndAskQuestion('viz/ChatPanelVizNewSubtype/TC93972', 'e2EAQ_1');
    });

    it('[TC93972_2] E2E | e2EAQ_2', async () => {
        await libraryPage.openBotByIdAndWait({ botId: aibots.bot.id });
        await botVisualizations.clearHistoryAndAskQuestion('viz/ChatPanelVizNewSubtype/TC93972', 'e2EAQ_2');
    });

    it('[TC93982_1] i18N | i18NQA_1', async () => {
        await loginPage.relogin(botChnUser);
        await libraryPage.openBotByIdAndWait({ botId: aibots.bot.id });
        await botVisualizations.clearHistoryAndAskQuestion('viz/ChatPanelVizNewSubtype/TC93982', 'i18NQA_1');
    });

    it('[TC93982_2] i18N | i18NQA_2', async () => {
        await loginPage.relogin(botChnUser);
        await libraryPage.openBotByIdAndWait({ botId: aibots.bot.id });
        await botVisualizations.clearHistoryAndAskQuestion('viz/ChatPanelVizNewSubtype/TC93982', 'i18NQA_2');
    });

    // it('[TC93980_1] FUN | Follow up questions.', async () => {
    //     await libraryPage.openBotByIdAndWait({ botId: botId });
    //     await aibotChatPanel.clearHistory();
    //     await aibotChatPanel.askQuestion('Show me a graph for profit and category');
    //     await botVisualizations.checkVizByImageComparison('viz/ChatPanelVizNewSubtype/TC93980', 'GraphProfitCategory');
    //     await aibotChatPanel.askQuestion('swap axis');
    //     await botVisualizations.checkVizByImageComparison('viz/ChatPanelVizNewSubtype/TC93980', 'ProfitOnAxis', 1);
    //     await aibotChatPanel.askQuestion('convert to a line chart');
    //     await botVisualizations.checkVizByImageComparison('viz/ChatPanelVizNewSubtype/TC93980', 'ConvertLineChart', 2);
    //     await aibotChatPanel.askQuestion('SORT ASCENDING');
    //     await botVisualizations.checkVizByImageComparison('viz/ChatPanelVizNewSubtype/TC93980', 'SortAscending', 3);
    //     await aibotChatPanel.clearHistory();
    //     await aibotChatPanel.askQuestion('show me a combo chart with revenue on Right and profit on Left by region');
    //     await botVisualizations.checkVizByImageComparison(
    //         'viz/ChatPanelVizNewSubtype/TC93980',
    //         'ComboChartLProfitRRevenue'
    //     );
    // await aibotChatPanel.askQuestion('Swap axis');
    // await botVisualizations.checkVizByImageComparison(
    //     'viz/ChatPanelVizNewSubtype/TC93980',
    //     'ComboChartRProfitLRevenue',
    //     1
    // );
    // await aibotChatPanel.clearHistory();
    // await aibotChatPanel.askQuestion('show me a heatmap for region and revenue');
    // await botVisualizations.checkVizByImageComparison('viz/ChatPanelVizNewSubtype/TC93980', 'Heatmap');
    // await aibotChatPanel.askQuestion('show it in heatmap, color by revenue ');
    // await botVisualizations.checkVizByImageComparison(
    //     'viz/ChatPanelVizNewSubtype/TC93980',
    //     'HeatmapColorByRevenue',
    //     1
    // );
    // });
    it('[TC93980_2] FUN | Topic to show grid', async () => {
        // check visualization generated in topics
        await libraryPage.openBotByIdAndWait({ botId: aibots.Topics_GridMapBar.id });
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.clickTopicByTitle('Grid');
        await botVisualizations.checkVizByImageComparison('viz/ChatPanelVizNewSubtype/TC93980', 'TopicGrid');
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.clickTopicByTitle('Map');
        await botVisualizations.checkVizByImageComparison('viz/ChatPanelVizNewSubtype/TC93980', 'TopicMap');
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.clickTopicByTitle('BarChart');
        await botVisualizations.checkVizByImageComparison('viz/ChatPanelVizNewSubtype/TC93980', 'TopicBarChart');
        await libraryPage.openBotByIdAndWait({ botId: aibots.Topics_HeatmapPieChartKPI.id });
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.clickTopicByTitle('Heatmap');
        await botVisualizations.checkVizByImageComparison('viz/ChatPanelVizNewSubtype/TC93980', 'TopicHeatmap');
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.clickTopicByTitle('PieChart');
        await botVisualizations.checkVizByImageComparison('viz/ChatPanelVizNewSubtype/TC93980', 'TopicPieChart');
    });
});
