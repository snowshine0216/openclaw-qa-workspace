import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { autoAnswerUser } from '../../../constants/autoAnswer.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('Auto Answers General Viz', () => {
    const project = {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    };
    const AA_Viz = {
        id: '813BB3F7114333FFE0892FB0B81EDD2A',
        name: 'AutoAnswers_Viz',
        project,
    };
    const AA_Viz_Customized = {
        id: 'B4555EE5C94BD96888C68E8595CAB583',
        name: 'AutoAnswers_Viz_CustomizedDashboardFormat',
        project,
    };
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const { loginPage, dossierPage, libraryPage, toc, aiAssistant, interpretation, aiViz } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        if (!(await loginPage.isLoginPageDisplayed())) {
            await browser.url(new URL('auth/ui/loginPage', browser.options.baseUrl).toString(), 100000);
        }
        await loginPage.login(autoAnswerUser);
    });

    beforeEach(async () => {
        // open auto answers
        await resetDossierState({
            credentials: autoAnswerUser,
            dossier: AA_Viz,
        });
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC90175_01] Auto Answer Viz - Sanity Forecast Trend Line', async () => {
        const question1 = 'what is the trend of Revenue ($K) by year';
        const question2 = 'show the forecast visulizaiton of Revenue ($K) by year';

        await libraryPage.openDossier(AA_Viz.name);
        await toc.openPageFromTocMenu({ chapterName: 'Overview', pageName: 'Overview' });
        await aiAssistant.openAndPin();

        // trendline
        await aiAssistant.inputAndSendQuestion(question1);
        await since('Insight linechart count should be #{expected}, while we get #{actual}')
            .expect(await aiViz.getInsightLinechartCount())
            .toBe(1);
        await takeScreenshotByElement(aiViz.getInsightLinechartContainerByIndex(1), 'TC90175_01', 'Forcast_TrendLine1');

        // forcast
        await aiAssistant.inputAndSendQuestion(question2);
        await since('Ask again, Insight linechart count should be #{expected}, while we get #{actual}')
            .expect(await aiViz.getInsightLinechartCount())
            .toBe(2);

        // maximum
        await aiAssistant.clickMaxMinBtn();
        await takeScreenshotByElement(aiViz.getInsightLinechartContainerByIndex(2), 'TC90175_01', 'Forcast_TrendLine2');
        await aiAssistant.clickMaxMinBtn();

        // interpretation
        await interpretation.generateCIFromLatestAnswer();
        await since('Interpretation, the content should match #{expected}, while we get #{actual}')
            .expect((await interpretation.getContentInComponents()).toLocaleLowerCase())
            .toMatch(/(trend|forecast)/);

        // focus mode
        await aiAssistant.maximizeChatbotVisualization(1);
        await since('Click, focus modal present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFocuseModalPresent())
            .toBe(true);
        await takeScreenshotByElement(aiAssistant.getChatBotVizFocusModalHeader(), 'TC90175_01', 'FocusMode_Header');

        // close
        await aiAssistant.closeChatbotVizFocusModal();
        await since('close, focus modal present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFocuseModalPresent())
            .toBe(false);

        // info icon
        await aiViz.hoverLatestInfoIconInLinechart();
        await since('Hover info icon, tooltip popup present should be #{expected}, while we get #{actual}')
            .expect(await aiViz.isInsightLinechartInfoTooltipPresent())
            .toBe(true);
    });

    it('[TC90175_02] Auto Answer Viz - Sanity Heatmap', async () => {
        const question1 = 'what is the Category, sized by Revenue ($K), show in heat map';
        const question2 = 'Show Category and Description, sized by Revenue ($K) in a heat map';

        await libraryPage.openDossier(AA_Viz.name);
        await toc.openPageFromTocMenu({ chapterName: 'Analysis', pageName: 'Cost/Revenue' });
        await aiAssistant.openAndPin();

        // heat map
        await aiAssistant.inputAndSendQuestion(question1);
        await since('Heat map count should be #{expected}, while we get #{actual}')
            .expect(await aiViz.getHeatMapCount())
            .toBe(1);
        await takeScreenshotByElement(aiViz.getHeatMapContainersByIndex(1), 'TC90175_02', 'HeatMap');

        await aiAssistant.inputAndSendQuestion(question2);
        await since('Ask again, Heat map count should be #{expected}, while we get #{actual}')
            .expect(await aiViz.getHeatMapCount())
            .toBe(2);

        // focus mode
        await aiAssistant.maximizeChatbotVisualization(1);
        await since('Focus modal present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFocuseModalPresent())
            .toBe(true);
        await takeScreenshotByElement(aiAssistant.getChatBotVizFocusModalHeader(), 'TC90175_02', 'FocusMode');
        await aiAssistant.closeChatbotVizFocusModal();
    });

    it('[TC90175_03] Auto Answer Viz - Sanity KPI', async () => {
        const question = 'what is the revenue over quarter, show in KPI';
        await libraryPage.openDossier(AA_Viz.name);
        await toc.openPageFromTocMenu({ chapterName: 'Overview', pageName: 'Overview' });
        await aiAssistant.openAndPin();

        // KPI
        await aiAssistant.inputAndSendQuestion(question);
        await since('KPI count should be #{expected}, while we get #{actual}')
            .expect(await aiViz.getKPICount())
            .toBe(1);
        await takeScreenshotByElement(aiViz.getKPIContainerByIndex(), 'TC90175_03', 'KPI');

        // focus mode
        await aiAssistant.maximizeChatbotVisualization();
        await since('Click, focus modal present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFocuseModalPresent())
            .toBe(true);
        await since('Focus mode, KPI count should be #{expected}, while we get #{actual}')
            .expect(await aiViz.getKPICount(true))
            .toBe(1);
        await aiAssistant.closeChatbotVizFocusModal();
    });

    it('[TC90175_04] Auto Answer Viz - Sanity Barchart', async () => {
        const question = 'what is the revenue by year, show in bar chart';
        await libraryPage.openDossier(AA_Viz.name);
        await toc.openPageFromTocMenu({ chapterName: 'Overview', pageName: 'Overview' });
        await aiAssistant.openAndPin();

        // KPI
        await aiAssistant.inputAndSendQuestion(question);
        await since('Bar chart count should be #{expected}, while we get #{actual}')
            .expect(await aiViz.getGMVizCount())
            .toBe(1);
        await takeScreenshotByElement(aiViz.getGMVizContainerByIndex(1), 'TC90175_04', 'Barchart');

        // focus mode
        await aiAssistant.maximizeChatbotVisualization();
        await since('Click, focus modal present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFocuseModalPresent())
            .toBe(true);
        await since('Focus mode, barchart count should be #{expected}, while we get #{actual}')
            .expect(await aiViz.getGMVizCount(true))
            .toBe(1);
        await aiAssistant.closeChatbotVizFocusModal();
    });

    it('[TC90175_05] Auto Answer Viz - Sanity Mapbox', async () => {
        const question = 'Show United States on mapBox';
        await libraryPage.openDossier(AA_Viz.name);
        await toc.openPageFromTocMenu({ chapterName: 'Analysis', pageName: 'Location' });
        await aiAssistant.openAndPin();

        // Mapbox
        await aiAssistant.inputAndSendQuestion(question);
        await since('Bar chart count should be #{expected}, while we get #{actual}')
            .expect(await aiViz.getMapboxCount())
            .toBe(1);

        // hover
        await aiViz.hoverMapbox();
        await since('click mapbox, the box present should be #{expected}, while we get #{actual}')
            .expect(await aiViz.isRightBoxOnMapboxPresent())
            .toBe(true);

        // focus mode
        await aiAssistant.maximizeChatbotVisualization();
        await since('Click, focus modal present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFocuseModalPresent())
            .toBe(true);
        await since('Focus mode, mapbox count should be #{expected}, while we get #{actual}')
            .expect(await aiViz.getMapboxCount(true))
            .toBe(1);
        await aiAssistant.closeChatbotVizFocusModal();
    });

    it('[TC91995] Auto Answer Viz - Viz style is not impacted by customized dashboard theme and format ', async () => {
        await resetDossierState({
            credentials: autoAnswerUser,
            dossier: AA_Viz_Customized,
        });
        await libraryPage.openDossier(AA_Viz_Customized.name);
        await toc.openPageFromTocMenu({ chapterName: 'Overview', pageName: 'Overview' });
        await aiAssistant.openAndPin();

        // Targeted visualizations background (DE275307)
        await aiAssistant.selectViz('Revenue Detail');
        await aiAssistant.inputAndSendQuestion('Show Category (Income Statement) and Cost ($K) in a barChart');
        await since('Select viz, targeting indicator present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFilterIndicatorDisplayedInAnswer(1))
            .toBe(true);
        await since('Viz background color should be #{expected}, while we get #{actual}')
            .expect(await aiViz.getVizBackgroundColor())
            .toContain('rgb(255, 255, 255)');

        // Forecast axis labels default font (DE278313)
        await aiAssistant.clearHistory();
        await aiAssistant.inputAndSendQuestion('show the trend for Revenue ($K) over Year');
        await since('Insight linechart count should be #{expected}, while we get #{actual}')
            .expect(await aiViz.getInsightLinechartCount())
            .toBe(1);
        await takeScreenshotByElement(aiViz.getInsightLineChartVeticalLabel(), 'TC91995', 'LableFont');
    });

    it('[TC91993] DE275563 - Negative values in forecast visualization', async () => {
        const question = 'what is the forecast for cost by year';

        await libraryPage.openDossier(AA_Viz.name);
        await toc.openPageFromTocMenu({ chapterName: 'Forcast', pageName: 'TrendLine' });
        await aiAssistant.openAndPin();

        // forcast
        await aiAssistant.inputAndSendQuestion(question);
        await since('Insight linechart count should be #{expected}, while we get #{actual}')
            .expect(await aiViz.getInsightLinechartCount())
            .toBe(1);
        await since('Chart lable should contain negative symbol #{expected}, while we get #{actual}')
            .expect(await aiViz.getInsightLineChartVeticalLabelText())
            .toContain('-');

        // focus mode
        await aiAssistant.maximizeChatbotVisualization();
        await since('Click, focus modal present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFocuseModalPresent())
            .toBe(true);
        await since('Focus mode, chart lable should contain negative symbol #{expected}, while we get #{actual}')
            .expect(await aiViz.getInsightLineChartVeticalLabelText(1, true))
            .toContain('($');

        // close
        await aiAssistant.closeChatbotVizFocusModal();
        await since('close, focus modal present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFocuseModalPresent())
            .toBe(false);
    });

    it('[TC92051] DE276241 - Indefinite loading visulization after bar charts', async () => {
        const question = 'show the Revenue ($K) by year in a bar chart';

        await libraryPage.openDossier(AA_Viz.name);
        await toc.openPageFromTocMenu({ chapterName: 'Overview', pageName: 'Overview' });
        await aiAssistant.openAndPin();

        // generate bar chart
        await aiAssistant.inputAndSendQuestion(question);
        await since('GM Viz count should be #{expected}, while we get #{actual}')
            .expect(await aiViz.getGMVizCount())
            .toBe(1);

        // generate other viz - grid
        await aiAssistant.inputAndSendQuestion('show  the Revenue ($K) by year in a grid');
        await since('Answer with Viz count should be #{expected}, while we get #{actual}')
            .expect(await aiViz.getAnswersWithVizCount())
            .toBe(2);

        // generate other viz - - pie chart
        await aiAssistant.clickFollowUp(2);
        await aiAssistant.inputAndSendQuestion('show in a pie chart');
        await since('GM Viz count should be #{expected}, while we get #{actual}')
            .expect(await aiViz.getGMVizCount())
            .toBe(2);
        await since('Answer with Viz count should be #{expected}, while we get #{actual}')
            .expect(await aiViz.getAnswersWithVizCount())
            .toBe(3);
    });

    it('[TC92896] DE278236 - Data labels check % for Pie Chart ', async () => {
        const question = 'what is the Revenue ($K) by year in percentage, show in pie chart';

        await libraryPage.openDossier(AA_Viz.name);
        await toc.openPageFromTocMenu({ chapterName: 'Overview', pageName: 'Overview' });
        await aiAssistant.openAndPin();

        // pie chart
        await aiAssistant.inputAndSendQuestion(question);
        await since('GM Viz count should be #{expected}, while we get #{actual}')
            .expect(await aiViz.getGMVizCount())
            .toBe(1);
        await since('Pie chart text should contain #{expected}, while we get #{actual}')
            .expect(await aiViz.getFirstTextInPieChart())
            .toContain('%');

        // focus mode
        await aiAssistant.maximizeChatbotVisualization();
        await since('Click, focus modal present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFocuseModalPresent())
            .toBe(true);
        await aiAssistant.closeChatbotVizFocusModal();
    });
});
