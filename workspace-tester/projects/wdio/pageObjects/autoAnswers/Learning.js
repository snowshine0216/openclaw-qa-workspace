import AIAssistant from './AIAssistant.js';

export default class Learning extends AIAssistant {
    constructor() {
        super();
        this.aiAssistant = new AIAssistant();
    }

    // Element locator

    async getLearningResult(index) {
        index = await this.getLastOrDefaultAnswerIndex(index);
        return this.aiAssistant.getLearningDialog(index);
    }

    async getLearningText(index) {
        index = await this.getLastOrDefaultAnswerIndex(index);
        const learningDialog = await this.aiAssistant.getLearningDialog(index);
        return learningDialog.$('.message').getText();
    }

    getLearningIndicator({ index = 1, focusMode = false }) {
        let container;
        if (focusMode) {
            container = this.getChatBotVizFocusModal();
        } else {
            container = this.getAnswers()[index - 1];
        }
        return container.$('.mstrd-ChatPanelUserLearningIndicator');
    }

    getLearnMoreLinkOnTooltip() {
        return this.getLearningTooltip().$('.learnMoreButton');
    }

    getLearningTooltip() {
        return this.$('.mstrd-ChatPanelUserLearningTooltip');
    }

    getLearningTooltipText() {
        return this.getLearningTooltip().$('.message').getText();
    }

    // Action helper

    async clickLearningIndicator({ index = 1, focusMode = false }) {
        await this.click({ elem: this.getLearningIndicator({ index, focusMode }) });
        return this.waitForElementVisible(this.getLearningTooltip());
    }

    async clickLearnMoreLinkOnTooltip() {
        await this.click({ elem: this.getLearnMoreLinkOnTooltip() });
    }

    // Assertion helper

    async isLearningSectionDisplayed(index) {
        index = await this.getLastOrDefaultAnswerIndex(index);
        return this.aiAssistant.getLearningDialog(index).isDisplayed();
    }

    async getChatAnwserCount() {
        return this.aiAssistant.getAnswers().length ?? 0;
    }

    // index starts with 1
    async getLastOrDefaultAnswerIndex(index) {
        return index ?? (await this.getChatAnwserCount());
    }

    async isLearningIndicatorDisplayed({ index = 1, focusMode = false }) {
        const el = await this.getLearningIndicator({ index, focusMode });
        return el && el.isDisplayed();
    }
}
