import { browserWindowCustom } from '../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../config/setWindowSize.js';
import * as consts from '../../../constants/visualizations.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.js';

describe('ChatPanelVizFunction', () => {
    const aibots = {
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial Project',
        },
        botGrid: {
            id: '4EFAE6F08D4A7A8C4FD56D9CB438E89F',
            name: 'StoreSalesData_Bot_Grid',
        },
        botBar: {
            id: '2862813F434320AB30908B9AB0098499',
            name: 'HTML_Bar_Bot',
        },
        botPie: {
            id: 'F22A8A360547D2AB56004A94D9C2769B',
            name: 'StoreSalesData_Bot_PieChart',
        },
        botKPI: {
            id: 'C5C80B7B44462D876011ACB6E8D7F3D1',
            name: 'StoreSalesData_Bot_KPI',
        },
        botHeatmap: {
            id: '23C638587447BE8F80F2709325A8338C',
            name: 'StoreSalesData_Heatmap_Bot',
        },
        botMap: {
            id: 'ECE0D016F34C2D091BE59BB2BF077E61',
            name: 'StoreSalesData_Bot_Map',
        },
        botTrend: {
            id: '4193C3348E489A9DC45CC893DEDE81F3',
            name: 'StoreSalesData_Bot_Trend',
        },
        botKD: {
            id: '9BD82399354C49BD01DEBB8CFD2BE98C',
            name: 'HTML_KeyDriver_Bot',
        },
        botForecast: {
            id: '5B705608254DDFDE97E79FB07FC2CC08',
            name: 'HRData_Bot_Forecast',
        },
        botDataLimitGrid: {
            id: '32DE867265450D2C20EC7DAFB281660C',
            name: 'Store_1001_Grid',
        },
        botDataLimitBar: {
            id: 'E200CC5209431C48DF32E5B0C8692835',
            name: 'Store_1001_Bar',
        },
        botHistogram: {
            id: '955A7F219547C6A167CF01B219850BAC',
            name: 'StoreSalesData_Bot_Histogram',
        },
        botDataNotPublished: {
            id: 'EAE8FB18FE404458998D2A9B72C99855',
            name: 'Bot_WithCubeNotPublished',
        },
        botViz: {
            id: '38E44679A84BEE6ABF20A5BFC4277B65',
            name: 'StoreSalesData_Bot_Viz',
        },
        botDarkTheme: {
            id: '5BD5025B51496D1BA60035B32189C770',
            name: 'StoreSalesbot_DarkTheme',
        },
        botStoreRevenue10k: {
            id: 'A42041258A4FEBE2D94CA68B05576C03',
            name: 'StoreRevenue_10k_Bot',
        },
    };

    let { loginPage, libraryPage, botVisualizations, aibotSnapshotsPanel, aibotChatPanel } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(consts.vizUser.credentials);
        await setWindowSize(browserWindowCustom);
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC92475] Function | Display visualization inside AI bot - Cross Functions for Grid', async () => {
        // Check Tooltip, RMC context menu for Grid in Bot, Snapshot.
        await aibotChatPanel.openBotAndOpenSnapshot({ botId: aibots.botGrid.id });
        await botVisualizations.clickGridCell(6, 'bot');
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92475', 'Grid_Highlight');
        await botVisualizations.rightClickGridCell(10, 'bot');
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92475', 'Grid_NOContextMenu');
        await botVisualizations.checkVizInSnapshotPanel('viz/AIBotVisualizations/TC92475', 'Grid_SnapshotCard');
        await aibotSnapshotsPanel.clickFocusSnapshotButton();
        await botVisualizations.checkVizInSnapshotDialog('viz/AIBotVisualizations/TC92475', 'Grid_SnapshotDialog');
    });
    it('[TC92476] Function | Display visualization inside AI bot - Cross Functions for Bar', async () => {
        // Check Tooltip, RMC context menu for Bar in Bot, Snapshot.
        await aibotChatPanel.openBotAndOpenSnapshot({ botId: aibots.botBar.id });
        await botVisualizations.hoverOnFistRect('bot');
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92476', 'Bar_Tooltip');
        await botVisualizations.rightClickRect('bot');
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92476', 'Bar_NoContextMenu');
        await botVisualizations.rightClickRect('snapshot');
        await botVisualizations.checkVizInSnapshotPanel('viz/AIBotVisualizations/TC92476', 'Bar_SnapshotCard');
        await aibotSnapshotsPanel.clickFocusSnapshotButton();
        await botVisualizations.hoverOnFistRect('bot');
        await botVisualizations.checkVizInSnapshotDialog('viz/AIBotVisualizations/TC92476', 'Bar_SnapshotDialog');
    });
    it('[TC92477] Function | Display visualization inside AI bot - Cross Functions for Pie', async () => {
        // Check Tooltip, RMC context menu for Pie in Bot, Snapshot.
        await aibotChatPanel.openBotAndOpenSnapshot({ botId: aibots.botPie.id });
        await botVisualizations.hoverOnGMShape('bot');
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92477', 'Pie_Tooltip');
        await botVisualizations.rightClickGMShape('bot');
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92477', 'Pie_NoContextMenu');
        await botVisualizations.checkVizInSnapshotPanel('viz/AIBotVisualizations/TC92477', 'Pie_SnapshotCard');
        await aibotSnapshotsPanel.clickFocusSnapshotButton();
        await botVisualizations.checkVizInSnapshotDialog('viz/AIBotVisualizations/TC92477', 'Pie_SnapshotDialog');
    });
    it('[TC97547] Function | Display visualization inside AI bot - Cross Functions for KPI', async () => {
        // Check Tooltip, RMC context menu for KPI in Bot, Snapshot.
        await aibotChatPanel.openBotAndOpenSnapshot({ botId: aibots.botKPI.id });
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC97547', 'KPI_Bot');
        await botVisualizations.checkVizInSnapshotPanel('viz/AIBotVisualizations/TC97547', 'KPI_SnapshotCard');
        await aibotSnapshotsPanel.clickFocusSnapshotButton();
        await botVisualizations.checkVizInSnapshotDialog('viz/AIBotVisualizations/TC97547', 'KPI_SnapshotDialog');
    });
    it('[TC92478] Function | Display visualization inside AI bot - Cross Functions for Heatmap', async () => {
        // Check Tooltip, RMC context menu for Heatmap in Bot, Snapshot.
        await aibotChatPanel.openBotAndOpenSnapshot({ botId: aibots.botHeatmap.id });
        await botVisualizations.hoverOnHeatmap('bot');
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92478', 'Heatmap_Tooltip');
        await botVisualizations.rightClickOnHeatmap('bot');
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92478', 'Heatmap_NoContextMenu');
        await botVisualizations.checkVizInSnapshotPanel('viz/AIBotVisualizations/TC92478', 'Heatmap_SnapshotCard');
        await aibotSnapshotsPanel.clickFocusSnapshotButton();
        await botVisualizations.checkVizInSnapshotDialog('viz/AIBotVisualizations/TC92478', 'Heatmap_SnapshotDialog');
    });
    it('[TC92479] Function | Display visualization inside AI bot - Cross Functions for Map', async () => {
        // Check Tooltip, RMC context menu for Map in Bot, Snapshot.
        await aibotChatPanel.openBotAndOpenSnapshot({ botId: aibots.botMap.id });
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92479', '00_Map');
        await botVisualizations.hoverMapbox();
        await botVisualizations.clickMapZoomInButton('bot');
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92479', '01_Map_ZoomIn');
        await botVisualizations.hoverMapbox();
        await botVisualizations.clickMapZoomOutButton('bot');
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92479', '02_Map_ZoomOut');
        await botVisualizations.checkVizInSnapshotPanel('viz/AIBotVisualizations/TC92479', '03_Map_SnapshotCard');
        await botVisualizations.hoverMapbox(1);
        await botVisualizations.clickMapResetButton('snapshot');
        await botVisualizations.clickMapZoomInButton('snapshot');
        await botVisualizations.checkVizInSnapshotPanel(
            'viz/AIBotVisualizations/TC92479',
            '04_Map_SnapshotCard_ZoomIn'
        );
        await aibotSnapshotsPanel.clickFocusSnapshotButton();
        await botVisualizations.checkVizInSnapshotDialog('viz/AIBotVisualizations/TC92479', '05_Map_SnapshotDialog');
        await botVisualizations.hoverMapbox(2);
        await botVisualizations.clickMapZoomInButton();
        await botVisualizations.checkVizInSnapshotDialog(
            'viz/AIBotVisualizations/TC92479',
            '06_Map_SnapshotDialog_ZoomIn'
        );
    });
    it('[TC92482] Function | Display visualization inside AI bot - Cross Functions for Trend', async () => {
        // Check Tooltip, RMC context menu for Trend in Bot, Snapshot.
        await aibotChatPanel.openBotAndOpenSnapshot({ botId: aibots.botTrend.id });
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92482', 'Trend');
        await botVisualizations.checkVizInSnapshotPanel('viz/AIBotVisualizations/TC92482', 'Trend_SnapshotCard');
        // await botVisualizations.hoverInsightLineChartInfoIcon();
        // await checkElementByImageComparison(
        //     botVisualizations.getInsightLineIinfoWindow(),
        //     'TC92482',
        //     'Trend_InfoWindow'
        // );
        await botVisualizations.clickSnapshotViz();
        await aibotSnapshotsPanel.clickFocusSnapshotButton();
        await botVisualizations.checkVizInSnapshotDialog('viz/AIBotVisualizations/TC92482', 'Trend_SnapshotDialog');
    });
    it('[TC92483] Function | Display visualization inside AI bot - Cross Functions for Forecast', async () => {
        // Check Tooltip, RMC context menu for Forecast in Bot, Snapshot.
        await aibotChatPanel.openBotAndOpenSnapshot({ botId: aibots.botForecast.id });
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92483', 'Forecast');
        await botVisualizations.checkVizInSnapshotPanel('viz/AIBotVisualizations/TC92483', 'ForecastSnapshotCard');
        // await botVisualizations.hoverInsightLineChartInfoIcon();
        // await checkElementByImageComparison(
        //     botVisualizations.getInsightLineIinfoWindow(),
        //     'TC92483',
        //     'Forecast_InfoWindow'
        // );
        await botVisualizations.clickSnapshotViz();
        await aibotSnapshotsPanel.clickFocusSnapshotButton();
        await botVisualizations.checkVizInSnapshotDialog('viz/AIBotVisualizations/TC92483', 'Forecast_SnapshotDialog');
    });
    it('[TC92480] Function | Display visualization inside AI bot - Cross Functions for KeyDrivers', async () => {
        // Check Tooltip, RMC context menu for KD in Bot, Snapshot.
        await aibotChatPanel.openBotAndOpenSnapshot({ botId: aibots.botKD.id });
        await botVisualizations.hoverOnFistRect('bot');
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92480', 'KeyDriver_Tooltip');
        await botVisualizations.rightClickRect('bot');
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC92480', 'KeyDriver_NoContextMenu');
        await aibotChatPanel.clickBotName();
        await botVisualizations.hoverOnFistRect('snapshot');
        await botVisualizations.checkVizInSnapshotPanel('viz/AIBotVisualizations/TC92480', 'KeyDriver_SnapshotCard');
        await aibotSnapshotsPanel.clickFocusSnapshotButton();
        await botVisualizations.checkVizInSnapshotDialog('viz/AIBotVisualizations/TC92480', 'KeyDriver_SnapshotDialog');
    });
    it('[TC97548] Function | Display visualization inside AI bot - Cross Functions for Histogram', async () => {
        // Check Tooltip, RMC context menu for KD in Bot, Snapshot.
        await aibotChatPanel.openBotAndOpenSnapshot({ botId: aibots.botHistogram.id });
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC97548', 'Histogram');
        await botVisualizations.hoverOnFistRect('snapshot');
        await botVisualizations.checkVizInSnapshotPanel('viz/AIBotVisualizations/TC97548', 'Histogram_SnapshotCard');
        await aibotSnapshotsPanel.clickFocusSnapshotButton();
        await botVisualizations.checkVizInSnapshotDialog('viz/AIBotVisualizations/TC97548', 'Histogram_SnapshotDialog');
    });
    it('[TC91817] Function [Library Web]  Display visualization inside AI bot - Cross Functions', async () => {
        // Check the data limit hint for Grid
        await aibotChatPanel.openBotAndOpenSnapshot({ botId: aibots.botDataLimitGrid.id });
        await checkElementByImageComparison(
            botVisualizations.getVizDataLimitHint(0),
            'viz/AIBotVisualizations/TC91817',
            'Grid_DataLimit_Bot'
        );
        // Check the data limit hint for Bar
        await aibotChatPanel.openBotAndOpenSnapshot({ botId: aibots.botDataLimitBar.id });
        await checkElementByImageComparison(
            botVisualizations.getVizDataLimitHint(0),
            'viz/AIBotVisualizations/TC91817',
            'Bar_DataLimit_Bot'
        );
        await checkElementByImageComparison(
            botVisualizations.getVizDataLimitHint(1),
            'viz/AIBotVisualizations/TC91817',
            'Bar_DataLimit_Snapshot'
        );
        // DE281611: check UI of See more/less button in snapshot panel.
        await checkElementByImageComparison(
            aibotChatPanel.getSeeMoreLessBtnSnapshotPanel(),
            'viz/AIBotVisualizations/TC91817',
            'SeeMoreLessBtn'
        );
        await aibotSnapshotsPanel.clickFocusSnapshotButton();
        await checkElementByImageComparison(
            botVisualizations.getVizDataLimitHint(2),
            'viz/AIBotVisualizations/TC91817',
            'Bar_DataLimit_SnapshotFocus'
        );
        // // Check the Bot with cube unpublished
        // await libraryPage.editBotByUrl({ projectId: aibots.project.id, botId: aibots.botDataNotPublished.id });
        // await aibotChatPanel.clickOpenSnapshotPanelButton();
        // await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC91817', 'botDataNotPublished_Bar');
        // await botVisualizations.checkVizInSnapshotPanel(
        //     'viz/AIBotVisualizations/TC91817',
        //     'DataNotPublished_Grid_SnapshotCard'
        // );
        // await aibotSnapshotsPanel.clickFocusSnapshotButton();
        // await botVisualizations.checkVizInSnapshotDialog(
        //     'viz/AIBotVisualizations/TC91817',
        //     'DataNotPublished_Grid_SnapshotFocus'
        // );
        // Should not show scroll bar when only 2 rows of data in grid
        await aibotChatPanel.openBotAndOpenSnapshot({ botId: aibots.botViz.id });
        if (await aibotSnapshotsPanel.isClearSnapshotButtonDisplayed()) {
            await aibotSnapshotsPanel.clickClearSnapshots();
            await aibotSnapshotsPanel.clickConfirmClearSnapshotsButton();
        }
        await aibotChatPanel.clearHistoryAndAskQuestion(consts.SalesDataQuestions.gridOf2Row);
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC91817', 'GridOf2Row');
        // DE281253
        await aibotChatPanel.openBotAndOpenSnapshot({ botId: aibots.botDarkTheme.id });
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC91817', 'DarkTheme_Bar');
        await botVisualizations.hoverGMYaxisTitle();
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC91817', 'HoverYAxisTitle');
        await botVisualizations.clickGMYaxisTitle();
        await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC91817', 'ClickYAxisTitle');
        // Check the 5k limit for histogram in bot
        // await libraryPage.openBotByIdAndWait({ botId: aibots.botStoreRevenue10k.id });
        // await aibotChatPanel.clearHistoryAndAskQuestion('Show the revenue distribution among regions in a histogram');
        // await botVisualizations.checkVizByImageComparison('viz/AIBotVisualizations/TC91817', 'Histogram_5kLimit');
    });
});
