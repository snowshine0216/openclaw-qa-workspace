import BasePage from '../base/BasePage.js';
import LibraryAuthoringPage from '../library/LibraryAuthoringPage.js';
import BotAuthoring from './BotAuthoring.js';
import LibraryPage from '../library/LibraryPage.js';
import AIBotChatPanel from './AIBotChatPanel.js';
import SnapshotDialog from './SnapshotDialog.js';
import AIBotSnapshotsPanel from './AIBotSnapshotsPanel.js';
import AIAssistant from '../autoAnswers/AIAssistant.js';
import AutoDashboard from '../dossierEditor/AutoDashboard.js';
import { checkElementByImageComparison } from '../../utils/TakeScreenshot.js';
import * as consts from '../../constants/visualizations.js';

export default class BotVisualizations extends BasePage {
    constructor() {
        super();
        this.libraryAuthoringPage = new LibraryAuthoringPage();
        this.botAuthoring = new BotAuthoring();
        this.libraryPage = new LibraryPage();
        this.aibotChatPanel = new AIBotChatPanel();
        this.SnapshotDialog = new SnapshotDialog();
        this.aIBotSnapshotPanel = new AIBotSnapshotsPanel();
        this.aiAssistant = new AIAssistant();
        this.autoDashboard = new AutoDashboard();
    }

    // Element locator
    getMapbox(index) {
        return this.$$('.mapboxgl-canvas ')[index];
    }

    getPieElement() {
        return this.$('');
    }

    getKPIElement() {
        return this.$('');
    }

    getGridCellInBot(index) {
        return this.aibotChatPanel.getAnswerbyIndex(0).$(`.mstrmojo-XtabZone  td[ei='${index}']`);
    }

    getGridCellInSnapshot(index) {
        return this.aibotChatPanel.getSnapshotPanel().$(`.mstrmojo-XtabZone  td[ei='${index}']`);
    }

    getGridCellInFocusView(index) {
        return this.SnapshotDialog.getSnapshotDialog().$(`.mstrmojo-XtabZone  td[ei='${index}']`);
    }

    getVizDataLimitHint(index) {
        return this.$$('.mstr-ai-chatbot-VizDataLimitedHint')[index];
    }

    getFirstRectInBot() {
        return this.aibotChatPanel.getAnswerbyIndex(0).$(`.mstrmojo-VIPanel-content rect`);
    }

    getFirstRectInSnapshot() {
        return this.aibotChatPanel.getSnapshotPanel().$(`.mstrmojo-VIPanel-content rect`);
    }

    getFirstRectInFocusView() {
        return this.SnapshotDialog.getSnapshotDialog().$(`.mstrmojo-VIPanel-content rect`);
    }

    getHeatmapInBot() {
        return this.aibotChatPanel.getAnswerbyIndex(0).$(`.mstrmojo-VIPanel-content .heatmap-canvas-container`);
    }

    getHeatmapInSnapshot() {
        return this.aibotChatPanel.getSnapshotPanel().$(`.mstrmojo-VIPanel-content .heatmap-canvas-container`);
    }

    getHeatmapInFocusView() {
        return this.SnapshotDialog.getSnapshotDialog().$(`.mstrmojo-VIPanel-content .heatmap-canvas-container`);
    }

    getGMShapeInBot() {
        return this.aibotChatPanel.getAnswerbyIndex(0).$(`.mstrmojo-VIPanel-content [type='shape']`);
    }

    getGMShapeInBotInSnapshot() {
        return this.aibotChatPanel.getSnapshotPanel().$(`.mstrmojo-VIPanel-content [type='shape']`);
    }

    getGMShapeInBotInFocusView() {
        return this.SnapshotDialog.getSnapshotDialog().$(`.mstrmojo-VIPanel-content [type='shape']`);
    }

    getGMChartInBot() {
        return this.aibotChatPanel.getAnswerbyIndex(0).$(`.mstrmojo-VIPanel-content .gm-chart`);
    }

    getGMLineChartInBot() {
        return this.aibotChatPanel.getAnswerbyIndex(0).$(`.mstrmojo-VIPanel-content .gm-chart .gm-set-polyline`);
    }

    getInsightLineChartInfoIcon() {
        return this.$('.insightlinechart-info-icon');
    }

    getInsightLineIinfoWindow() {
        return this.$('.new-vis-tooltip-table');
    }

    getMapZoomInButtonInBot() {
        return this.aibotChatPanel.getAnswerbyIndex(0).$('.mapboxgl-ctrl-zoom-in');
    }

    getMapZoomOutButtonInBot() {
        return this.aibotChatPanel.getAnswerbyIndex(0).$('.mapboxgl-ctrl-zoom-out');
    }

    getMapZoomInButtonInSnapshot() {
        return this.aibotChatPanel.getSnapshotPanel().$('.mapboxgl-ctrl-zoom-in');
    }

    getMapZoomInButtonInFocusView() {
        return this.SnapshotDialog.getSnapshotDialog().$('.mapboxgl-ctrl-zoom-in');
    }

    getMapResetButtonInBot() {
        return this.aibotChatPanel.getAnswerbyIndex(0).$('.mapboxgl-ctrl-reset');
    }

    getMapResetButtonInSnapshot() {
        return this.aibotChatPanel.getSnapshotPanel().$('.mapboxgl-ctrl-reset');
    }

    getMapResetButtonInFocusView() {
        return this.SnapshotDialog.getSnapshotDialog().$('.mapboxgl-ctrl-reset');
    }

    getGMYaxisTitleInBot() {
        return this.aibotChatPanel.getAnswerbyIndex(0).$('.gm-yaxis-cell .gm-textbody-unit');
    }

    getShowErrorMessage() {
        return this.$('.mstr-design-collapse-header__title');
    }

    // Action helper
    async clickShowErrorDetails() {
        const errorMessageElement = this.getShowErrorMessage();
        if (await errorMessageElement.isDisplayed()) {
            await this.click({ elem: errorMessageElement });
        }
    }

    async checkVizByImageComparison(testCase, imageName, index = 0) {
        const vizElement = this.aibotChatPanel.getVizAnswerByIndex(index);
        if (await vizElement.isDisplayed()) {
            await this.waitForElementVisible(vizElement, 60 * 1000);
            await checkElementByImageComparison(vizElement, testCase, imageName);
        } else {
            await this.clickShowErrorDetails();
            const answerBubbleElement = this.aibotChatPanel.getAnswerBubblebyIndex(index);
            if (await answerBubbleElement.isDisplayed()) {
                await checkElementByImageComparison(answerBubbleElement, testCase, imageName);
            }
        }
    }

    async checkVizInSnapshotPanel(testCase, imageName, index = 0) {
        await this.waitForElementVisible(this.aIBotSnapshotPanel.getSnapshotPanelViz(index));
        await checkElementByImageComparison(this.aIBotSnapshotPanel.getSnapshotPanelViz(index), testCase, imageName);
    }

    async checkVizInSnapshotDialog(testCase, imageName) {
        await this.waitForElementVisible(this.SnapshotDialog.getSnapshotDialogViz());
        await checkElementByImageComparison(this.SnapshotDialog.getSnapshotDialogViz(), testCase, imageName);
    }

    async checkMapByImageComparison(index, testCase, imageName) {
        await this.waitForElementVisible(this.getMapbox(index));
        await this.sleep(5000);
        await checkElementByImageComparison(this.getMapbox(index), testCase, imageName, 1.5);
    }

    async checkQueryMessageByImageComparison(testCase, imageName) {
        await checkElementByImageComparison(this.aibotChatPanel.getQueryMessageContentByIndex(0), testCase, imageName);
    }

    async rightClickGridCell(index, mode) {
        if (mode === 'bot') {
            await (await this.getGridCellInBot(index)).click({ button: 2 });
        } else if (mode === 'snapshot') {
            await (await this.getGridCellInSnapshot(index)).click({ button: 2 });
        } else {
            await (await this.getGridCellInFocusView(index)).click({ button: 2 });
        }
    }

    async clickGridCell(index, mode) {
        if (mode === 'bot') {
            await (await this.getGridCellInBot(index)).click();
        } else if (mode === 'snapshot') {
            await (await this.getGridCellInSnapshot(index)).click();
        } else {
            await (await this.getGridCellInFocusView(index)).click();
        }
    }

    async rightClickRect(mode) {
        if (mode === 'bot') {
            await this.rightClick({ elem: this.getFirstRectInBot() });
            // (await this.getFirstRectInBot()).click({ button: 2 })
        } else if (mode === 'snapshot') {
            await this.rightClick({ elem: this.getFirstRectInSnapshot() });
            // (await this.getFirstRectInSnapshot()).click({ button: 2 })
        } else {
            await this.rightClick({ elem: this.getFirstRectInFocusView() });
            // (await this.getFirstRectInFocusView()).click({ button: 2 })
        }
    }

    async clickFistRect(mode) {
        if (mode === 'bot') {
            await this.click({ elem: this.getFirstRectInBot() });
            // (await this.getFirstRectInBot()).click()
        } else if (mode === 'snapshot') {
            await this.click({ elem: this.getFirstRectInSnapshot() });
            // (await this.getFirstRectInSnapshot()).click()
        } else {
            await this.click({ elem: this.getFirstRectInFocusView() });
            // (await this.getFirstRectInFocusView()).click()
        }
    }

    async hoverOnFistRect(mode) {
        if (mode === 'bot') {
            await this.hover({ elem: this.getFirstRectInBot() });
        } else if (mode === 'snapshot') {
            await this.hover({ elem: this.getFirstRectInSnapshot() });
        } else {
            await this.hover({ elem: this.getFirstRectInFocusView() });
        }
    }

    async hoverOnHeatmap(mode, offset = { x: 0, y: 0 }) {
        if (mode === 'bot') {
            await this.hover({ elem: this.getHeatmapInBot(), offset: { x: offset.x, y: offset.y } });
        } else if (mode === 'snapshot') {
            await this.hover({ elem: this.getHeatmapInSnapshot(), offset: { x: offset.x, y: offset.y } });
        } else {
            await this.hover({ elem: this.getHeatmapInFocusView(), offset: { x: offset.x, y: offset.y } });
        }
    }

    async rightClickOnHeatmap(mode, offset = { x: 0, y: 0 }) {
        if (mode === 'bot') {
            await this.rightClick({ elem: this.getHeatmapInBot(), offset: { x: offset.x, y: offset.y } });
        } else if (mode === 'snapshot') {
            await this.rightClick({ elem: this.getHeatmapInSnapshot(), offset: { x: offset.x, y: offset.y } });
        } else {
            await this.rightClick({ elem: this.getHeatmapInFocusView(), offset: { x: offset.x, y: offset.y } });
        }
    }

    async rightClickGMShape(mode) {
        if (mode === 'bot') {
            await this.rightClick({ elem: this.getGMShapeInBot() });
        } else if (mode === 'snapshot') {
            await this.rightClick({ elem: this.getGMShapeInBotInSnapshot() });
        } else {
            await this.rightClick({ elem: this.getGMShapeInBotInFocusView() });
        }
    }

    async clickGMShape(mode) {
        if (mode === 'bot') {
            await this.click({ elem: this.getGMShapeInBot() });
        } else if (mode === 'snapshot') {
            await this.click({ elem: this.getGMShapeInBotInSnapshot() });
        } else {
            await this.click({ elem: this.getGMShapeInBotInFocusView() });
        }
    }

    async hoverOnGMShape(mode) {
        if (mode === 'bot') {
            await this.hover({ elem: this.getGMShapeInBot() });
        } else if (mode === 'snapshot') {
            await this.hover({ elem: this.getGMShapeInBotInSnapshot() });
        } else {
            await this.hover({ elem: this.getGMShapeInBotInFocusView() });
        }
    }

    async hoverInsightLineChartInfoIcon() {
        await this.hover({ elem: this.getInsightLineChartInfoIcon() });
    }

    async clickSnapshotViz() {
        await this.click({ elem: this.aIBotSnapshotPanel.getSnapshotPanelViz(0) });
    }

    async clickMapZoomInButton(mode) {
        if (mode === 'bot') {
            await this.click({ elem: this.getMapZoomInButtonInBot() });
        } else if (mode === 'snapshot') {
            await this.click({ elem: this.getMapZoomInButtonInSnapshot() });
        } else {
            await this.click({ elem: this.getMapZoomInButtonInFocusView() });
        }
    }

    async clickMapResetButton(mode) {
        if (mode === 'bot') {
            await this.click({ elem: this.getMapResetButtonInBot() });
        } else if (mode === 'snapshot') {
            await this.click({ elem: this.getMapResetButtonInSnapshot() });
        } else {
            await this.click({ elem: this.getMapResetButtonInFocusView() });
        }
    }

    async clickMapZoomOutButton() {
        await this.click({ elem: this.getMapZoomOutButtonInBot() });
    }

    async hoverMapbox(index = 0) {
        await this.hover({ elem: this.getMapbox(index) });
    }

    async hoverGMYaxisTitle() {
        await this.hover({ elem: this.getGMYaxisTitleInBot() });
    }

    async clickGMYaxisTitle() {
        await this.click({ elem: this.getGMYaxisTitleInBot() });
    }

    async clearHistoryAndAskQuestion(imageFolder, vizType, aiEntry = 'bot') {
        let questions;
        switch (vizType) {
            case 'barChart':
                questions = consts.BarDZRuleQuestions;
                break;
            case 'lineChart':
                questions = consts.LineDZRuleQuestions;
                break;
            case 'pieChart':
                questions = consts.PieDZRuleQuestions;
                break;
            case 'bubbleChart':
                questions = consts.BubbleChartDZRuleQuestions;
                break;
            case 'comboChart':
                questions = consts.ComboChartDZRuleQuestions;
                break;
            case 'map':
                questions = consts.MapBoxDZRuleQuestions;
                break;
            case 'heatmap':
                questions = consts.HeatMapDZRuleQuestions;
                break;
            case 'mmKPI':
                questions = consts.MultiMetricKPIDZRuleQuestions;
                break;
            case 'grid':
                questions = consts.GridDZRuleQuestions;
                break;
            case 'keyDriver':
                questions = consts.KeyDriverDZRuleQuestions;
                break;
            case 'trend':
                questions = consts.InsightLineTrendDZRuleQuestions;
                break;
            case 'forecast':
                questions = consts.InsightLineForecastDZRuleQuestions;
                break;
            case 'histograms':
                questions = consts.HistogramsQuestions;
                break;
            case 'vizSubtypeSQL_1':
                questions = consts.VizSubtypeSQL_1;
                break;
            case 'vizSubtypeSQL_2':
                questions = consts.VizSubtypeSQL_2;
                break;
            case 'vizSubtypeSQL_3':
                questions = consts.VizSubtypeSQL_3;
                break;
            case 'vizSubtypeMultiPassSQL_1':
                questions = consts.VizSubtypeMultiPassSQL_1;
                break;
            case 'vizSubtypeMultiPassSQL_2':
                questions = consts.VizSubtypeMultiPassSQL_2;
                break;
            case 'vizSubtypeMultiPassSQL_3':
                questions = consts.VizSubtypeMultiPassSQL_3;
                break;
            case 'vizSubtypeMap':
                questions = consts.VizSubtypeMap;
                break;
            case 'vizDropzoneSanity':
                questions = consts.VizDropzoneSanity;
                break;
            case 'e2EAQ_1':
                questions = consts.E2EAQ_1;
                break;
            case 'e2EAQ_2':
                questions = consts.E2EAQ_2;
                break;
            case 'i18NQA_1':
                questions = consts.I18NAQ_1;
                break;
            case 'i18NQA_2':
                questions = consts.I18NAQ_2;
                break;
            default:
                throw new Error('Invalid visualization type');
        }
        for (const key in questions) {
            if (Object.hasOwnProperty.call(questions, key)) {
                const question = questions[key];
                switch (aiEntry) {
                    case 'bot':
                        await this.aibotChatPanel.clearHistory();
                        await this.aibotChatPanel.askQuestion(question);
                        await this.checkVizByImageComparison(imageFolder, vizType + '_' + key);
                        break;
                    case 'autoAnswers':
                        await this.aiAssistant.clearHistory();
                        await this.aiAssistant.vizCreationByChat(question);
                        await this.aiAssistant.checkChatbotVizByIndex(0, imageFolder, vizType + '_' + key);
                        break;
                    case 'autoDashboard':
                        await this.autoDashboard.clearHistory();
                        await this.autoDashboard.vizCreationByChat(question);
                        await this.autoDashboard.checkVizInAutoDashboard(0, imageFolder, vizType + '_' + key);
                        break;
                    default:
                        throw new Error('Invalid AI entry');
                }
            }
        }
    }

    async isLineChartInBotExist() {
        return await this.getGMLineChartInBot().isDisplayed();
    }
}
