import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindowCustom } from '../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import * as consts from '../../../constants/visualizations.js';

describe('ChatPanelVizDropzoneRule', () => {
    let { loginPage, libraryPage, botVisualizations } = browsers.pageObj1;
    const aibots = {
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

    it('[TC94921] FUN | Validate the dropzone rules for Bar Chart inside AI Bot.', async () => {
        await libraryPage.openBotByIdAndWait({ botId: aibots.bot.id });
        await botVisualizations.clearHistoryAndAskQuestion('viz/ChatPanelVizDropzoneRule/TC94921', 'barChart');
    });

    it('[TC94922] FUN | Validate the dropzone rules for Line Chart inside AI Bot.', async () => {
        await libraryPage.openBotByIdAndWait({ botId: aibots.bot.id });
        await botVisualizations.clearHistoryAndAskQuestion('viz/ChatPanelVizDropzoneRule/TC94922', 'lineChart');
    });

    it('[TC94923] FUN | Validate the dropzone rules for Pie Chart inside AI Bot.', async () => {
        await libraryPage.openBotByIdAndWait({ botId: aibots.bot.id });
        await botVisualizations.clearHistoryAndAskQuestion('viz/ChatPanelVizDropzoneRule/TC94923', 'pieChart');
    });

    it('[TC94924] FUN | Validate the dropzone rules for Bubble Chart inside AI Bot.', async () => {
        await libraryPage.openBotByIdAndWait({ botId: aibots.bot.id });
        await botVisualizations.clearHistoryAndAskQuestion('viz/ChatPanelVizDropzoneRule/TC94924', 'bubbleChart');
    });

    it('[TC94925] FUN | Validate the dropzone rules for Combo Chart inside AI Bot.', async () => {
        await libraryPage.openBotByIdAndWait({ botId: aibots.bot.id });
        await botVisualizations.clearHistoryAndAskQuestion('viz/ChatPanelVizDropzoneRule/TC94925', 'comboChart');
    });

    it('[TC94926] FUN | Validate the dropzone rules for heatmap inside AI Bot.', async () => {
        await libraryPage.openBotByIdAndWait({ botId: aibots.bot.id });
        await botVisualizations.clearHistoryAndAskQuestion('viz/ChatPanelVizDropzoneRule/TC94926', 'heatmap');
    });

    it('[TC94927] FUN | Validate the dropzone rules for mm KPI inside AI Bot.', async () => {
        await libraryPage.openBotByIdAndWait({ botId: aibots.bot.id });
        await botVisualizations.clearHistoryAndAskQuestion('viz/ChatPanelVizDropzoneRule/TC94927', 'mmKPI');
    });

    it('[TC94940] FUN | Validate the dropzone rules for map inside AI Bot.', async () => {
        await libraryPage.openBotByIdAndWait({ botId: aibots.bot.id });
        await botVisualizations.clearHistoryAndAskQuestion('viz/ChatPanelVizDropzoneRule/TC94940', 'map');
    });

    it('[TC94941] FUN | Validate the dropzone rules for grid inside AI Bot.', async () => {
        await libraryPage.openBotByIdAndWait({ botId: aibots.bot.id });
        await botVisualizations.clearHistoryAndAskQuestion('viz/ChatPanelVizDropzoneRule/TC94941', 'grid');
    });

    it('[TC95923] ACC| Certification for Histograms in AI bot.', async () => {
        await libraryPage.openBotByIdAndWait({ botId: aibots.bot.id });
        await botVisualizations.clearHistoryAndAskQuestion('viz/ChatPanelVizDropzoneRule/TC95923', 'histograms');
    });

    it('[TC94529_1] ACC| Certification for InsightTrend in AI bot.', async () => {
        await libraryPage.openBotByIdAndWait({ botId: aibots.bot.id });
        await botVisualizations.clearHistoryAndAskQuestion('viz/ChatPanelVizDropzoneRule/TC94529', 'trend');
    });
    it('[TC94529_2] ACC| Certification for Forecast in AI bot.', async () => {
        await libraryPage.openBotByIdAndWait({ botId: aibots.bot.id });
        await botVisualizations.clearHistoryAndAskQuestion('viz/ChatPanelVizDropzoneRule/TC94529', 'forecast');
    });
});
