import AIAssistant from './AIAssistant.js';

export default class Interpretation extends AIAssistant {
    // Element locator
    setChatIndex(index) {
        return this.getAnswers()[index - 1];
    }

    getInterpretationContents() {
        return this.getAssistantContainer().$$('.mstr-ai-chatbot-CILongContent');
    }

    getInterpretationContentInFocusModal() {
        return this.getChatBotVizFocusModal().$('.mstr-ai-chatbot-CILongContent');
    }

    setFocusMode() {
        return this.$('.mstrd-ChatPanelVisualizationFocus');
    }

    getInterpretationIcon(index) {
        return this.setChatIndex(index).$('.mstrd-ChatPanelInterpretationIcon');
    }

    getInterpretationIconInFocusMode() {
        return this.setFocusMode().$('.mstrd-ChatPanelInterpretationIcon');
    }

    getInterpretationSection(index) {
        return this.setChatIndex(index).$('.mstr-ai-chatbot-CIInterpretationWrapper');
    }

    getInterpretationSectionInFocus() {
        return this.setFocusMode().$('.mstr-ai-chatbot-CIInterpretationWrapper');
    }

    getInterpretationTitle(index) {
        return this.setChatIndex(index).$('.mstr-ai-chatbot-CIInterpretedAs-title');
    }

    getCIText(index) {
        return this.setChatIndex(index).$('.mstr-ai-chatbot-CIInterpretedAs-text').getText();
    }

    getComponentSection(index) {
        return this.setChatIndex(index).$('.mstr-ai-chatbot-CIComponents');
    }

    getComponentSectionInFocus() {
        return this.setFocusMode().$('.mstr-ai-chatbot-CIComponents');
    }

    getComponentSectionContent(index) {
        return this.setChatIndex(index).$('.mstr-ai-chatbot-CIComponents-content');
    }

    askAgainFromCI(index) {
        return this.setChatIndex(index).$('.mstr-ai-chatbot-CIInterpretedAs-copy-query');
    }

    copyLLMFromCI(index) {
        return this.setChatIndex(index).$('.mstr-ai-chatbot-CIComponents-header-right-copy');
    }

    getCopyLLMIconInFocus() {
        return this.setFocusMode().$('.mstr-ai-chatbot-CIComponents-header-right-copy-container');
    }

    getViewMore(index) {
        return this.setChatIndex(index).$('.mstr-ai-chatbot-CILongContent-button');
    }

    getComponentsHeader(index) {
        return this.setChatIndex(index).$('.mstr-ai-chatbot-CIComponents-header-left');
    }

    getViewMoreInFocus() {
        return this.setFocusMode().$('.mstr-ai-chatbot-CILongContent-button');
    }

    /**
     * Tooltip under Componenets only, not clickable
     * section begin
     */

    getInterpretationGenerating(index) {
        return this.setChatIndex(index).$('.mstr-ai-chatbot-CILoading');
    }

    getCopiedIcon(index) {
        return this.setChatIndex(index).$('.mstr-ai-chatbot-CIComponents-header-right-success');
    }

    getComponentIcon(index, iconIndex) {
        return this.$(
            `(//div[@class='MessageList']//div[@class='Message left'][${
                index - 1
            }]//div[@class='mstr-ai-chatbot-CIComponents-content']//*[name()='svg'])[${iconIndex - 1}]`
        );
    }

    getComponentTooltip() {
        return this.$(`//div[@class='mstr-ai-chatbot-Tooltip']/span[@role='tooltip']`);
    }

    getInterpretationAs(index) {
        return this.setChatIndex(index).$('.mstr-ai-chatbot-CIInterpretedAs');
    }

    getCILoadingSpinner() {
        return this.$('.mstr-ai-chatbot-CILoading-spinner');
    }

    getLearningNuggets(index = 1) {
        return this.setChatIndex(index).$('.mstr-ai-chatbot-CINuggetsContent');
    }

    getLearningNuggetsContents(answerIndex = 1, learningIndex = 1) {
        return this.getLearningNuggets(answerIndex).$$('.mstr-ai-chatbot-CINuggetsContent-nugget')[learningIndex - 1];
    }

    getLearningForgetBtn(answerIndex = 1, learningIndex = 1) {
        return this.getLearningNuggetsContents(answerIndex, learningIndex).$(
            '.mstr-ai-chatbot-CINuggetsContent-nugget-right-content-forget--visible'
        );
    }

    getConfirmationBtnOnForget(text) {
        return this.$$('.mstr-ai-chatbot-CINuggetsContent-nugget-popover-buttons .mstr-ai-chatbot-Button').filter(
            async (el) => {
                return (await el.getText()) === text;
            }
        )[0];
    }

    getLearningForgottenIcon(answerIndex, learningIndex = 1) {
        return this.getLearningNuggetsContents(answerIndex, learningIndex).$(
            '.mstr-ai-chatbot-CINuggetsContent-nugget-right-content-forgotten'
        );
    }

    // Action helper
    async getMessageCount() {
        let responses = await this.$$("//div[@class='MessageList']//div[@class='Message left']");
        let count = responses.length;
        return count;
    }

    async getLatestInterpretation() {
        const index = await this.getCIContentsCount();
        return this.setChatIndex(index);
    }

    async getLatestCIIcon() {
        const index = await this.getCIContentsCount();
        return this.getInterpretationIcon(index);
    }

    async getContentInComponents(index = 1) {
        if (index == 1) {
            index = await this.getMessageCount();
        }
        let componentContent = await this.getComponentSectionContent(index);
        let content = '';
        content = await browser.execute('return arguments[0].textContent;', componentContent);
        console.log(`***** the components to validate ${content} *******`);
        return content;
    }

    async clickCIFromAnswer(index, turnOn = true) {
        await this.hover({ elem: this.getAnswers()[index - 1] });
        const active = await this.isCIBtnActive(index);
        // when turnOn is true, and interpretation is inactive, then open it
        // when turnOn is false, and interpretation is active, then close it
        if ((turnOn && !active) || (!turnOn && active)) {
            await this.click({ elem: this.getInterpretationIcon(index) });
            return this.waitForElementInvisible(this.getCILoadingSpinner());
        }
    }

    async generateCIFromLatestAnswer() {
        const index = await this.getAnswers().length;
        return this.clickCIFromAnswer(index, true);
    }

    async closeLatestCI() {
        const index = await this.getAnswers().length;
        return this.clickCIFromAnswer(index, false);
    }

    async askAgainFromLatestCI() {
        const index = await this.getCIContentsCount();
        await this.click({ elem: this.askAgainFromCI(index) });
        return this.sleep(500); // wait copy text to render
    }

    async copyLLMFromLatestCI() {
        const index = await this.getCIContentsCount();
        await this.click({ elem: this.copyLLMFromCI(index) });
    }

    async getLatestCIText() {
        const index = await this.getCIContentsCount();
        return this.getCIText(index);
    }

    async hideInterpretationInVizFocusModal() {
        if (await this.isInterPretationPresentInFocusModal()) {
            await this.click({ elem: this.getInterpretationIconInFocusMode() });
        }
    }

    async hoverLearningContent(answerIndex = 1, learningIndex = 1) {
        await this.hover({ elem: this.getLearningNuggetsContents(answerIndex, learningIndex) });
        return this.waitForElementVisible(this.getLearningForgetBtn(answerIndex, learningIndex));
    }

    async forgetLearningContent(answerIndex = 1, learningIndex = 1) {
        await this.hoverLearningContent(answerIndex, learningIndex);
        await this.click({ elem: this.getLearningForgetBtn(answerIndex, learningIndex) });
        await this.click({ elem: this.getConfirmationBtnOnForget('Yes') });
        return this.waitForElementVisible(this.getLearningForgottenIcon(answerIndex, learningIndex));
    }

    async waitForLearningInfoVisible(index = 1) {
        return this.waitForElementVisible(this.getLearningNuggets(index));
    }

    // Assertion helper
    async isCIBtnActive(index) {
        const el = await this.getInterpretationIcon(index);
        return this.isActive(el);
    }

    async isLatestCIBtnActive() {
        const index = await this.getAnswers().length;
        return this.isCIBtnActive(index);
    }

    async getCIContentsCount() {
        return this.getInterpretationContents().length;
    }

    async isInterpretationSectionVisible(index = 1) {
        const interpretationSection = await this.getInterpretationSection(index);
        return interpretationSection.isDisplayed();
    }

    async isInterPretationPresentInFocusModal() {
        return this.getInterpretationSectionInFocus().isDisplayed();
    }

    async isLearningInfoDisplayed(index = 1) {
        return this.getLearningNuggets(index).isDisplayed();
    }
}
