import BasePage from '../base/BasePage.js';
import { getAttributeValue } from '../../utils/getAttributeValue.js';
import { checkElementByImageComparison } from '../../utils/TakeScreenshot.js';
import Panel from '../common/Panel.js';

export default class AIAssistant extends BasePage {
    constructor() {
        super();
        this.panel = new Panel();
    }

    // Element locator

    getAIIconContainer() {
        return this.$('.mstrd-ChatNavItemContainer');
    }

    getAIIcon() {
        return this.$('.mstr-nav-icon.icon-mstrd_tb_ai_assistant_a,.icon-mstrd_tb_ai_assistant_n');
    }

    getAssistantContainer() {
        return this.$('.mstrd-ChatDropdownMenuContainer');
    }

    getAssistantMainPanel() {
        return this.getAssistantContainer().$('.mstrd-DropdownMenu-main');
    }

    getAssistantWelcompage() {
        return this.$('.mstrd-ChatPanelContainer-welcome');
    }

    getWelcomeText() {
        return this.getAssistantWelcompage().$('.mstrd-ChatPanelContainer-welcome-text').getText();
    }

    getAssistantHeaderText() {
        return this.getAssistantContainer().$('.mstrd-DropdownMenu-headerTitle').getText();
    }

    getAIContext() {
        return this.$('.mstrd-ChatDropdownMenuContainer-panel span[data-test-chat-panel-viz-key]');
    }

    getCloseBtn() {
        return this.getAssistantContainer().$('.icon-pnl_close');
    }

    getClearBtn() {
        return this.getAssistantContainer().$('.icon-mstrd_ai_clear');
    }

    getClearConfirmationContainer() {
        return this.$('.mstrd-ConfirmationDialog');
    }

    getClearConfirmationBtn(text) {
        return this.getClearConfirmationContainer()
            .$$('.mstrd-Button')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === text;
            })[0];
    }

    getRecommendationContainer() {
        return this.getAssistantContainer().$('.mstrd-Recommendations');
    }

    getRecommendationSkeleton() {
        return this.getRecommendationContainer().$$('.mstrd-ChatSkeleton')[0];
    }

    getRecommendationTitleText() {
        return this.getRecommendationContainer().$('.mstrd-Recommendations-refresh').getText();
    }

    getInputboxContainer() {
        return this.getAssistantContainer().$('.mstr-chatbot-chat-input__input-container');
    }

    getInputArea() {
        return this.getInputboxContainer().$('.mstr-chatbot-chat-input__textarea');
    }

    getInputText() {
        return this.getInputArea().getText();
    }

    getCapsule() {
        return this.getInputboxContainer().$('.mstr-design-capsule');
    }

    getCapsuleContext() {
        return this.getCapsule().$('context-text');
    }

    getContextDeleteBtn() {
        return this.getCapsule().$('.mstr-design-button');
    }

    getPinBtn() {
        return this.getAssistantContainer().$('.icon-pin');
    }

    getUnPinBtn() {
        return this.getAssistantContainer().$('.icon-unpin');
    }

    getMaxMinBtn() {
        return this.getAssistantContainer().$('.mstrd-ChatPanelHeaderFullscreenIcon');
    }

    getCopyQuestionIcon(index = 1) {
        return this.$$('.copyToIcon')[index - 1];
    }

    getChatBotVisualizations() {
        return this.$$('.mstrd-ChatPanelVisualization');
    }

    getChatBotVisualization(index = 0) {
        return this.getChatBotVisualizations()[index];
    }

    getChatBotLatestVisualization() {
        return this.$("(//div[@class='MessageList']/div)[last()]//div[@class='mstrmojo-VIDocLayout']");
    }

    getChatBotVisualizationMaximizeIcon(index) {
        return this.getChatBotVisualization(index).$('.mstrd-ChatPanelVisualizationExpandIcon');
    }

    getChatBotVizFocusModalCloseIcon() {
        return this.getChatBotVizFocusModal().$('.mstrd-bemChatPanelVisualizationFocusCopyIcon');
    }

    getChatBotVizFocusModal() {
        return this.$('.mstrd-ChatPanelVisualizationFocus-modal');
    }

    getChatBotVizFocusModalHeader() {
        return this.getChatBotVizFocusModal().$('.mstrd-ChatPanelVisualizationFocus-header');
    }

    getSeeMoreOrLessBtnOnVizFocusModal() {
        return this.getChatBotVizFocusModal().$('.mstrd-ChatPanelVisualizationFocus-textViewAll');
    }

    getChatBotVizFocusModalCopyIcon() {
        return this.getChatBotVizFocusModal().$('.mstrd-ChatPanelVisualizationCopyIcon');
    }

    getChatBotVizFocusModalInterpretationIcon() {
        return this.getChatBotVizFocusModal().$('.mstrd-ChatPanelInterpretationIcon');
    }

    getChatBotMaximizeVisualization() {
        return this.getChatBotVizFocusModal().$('.mstrmojo-DocPanel');
    }

    getRecommendationToggleButton() {
        return this.getRecommendationContainer().$('.mstrd-Recommendations-toggleButton');
    }

    getRecommendationRefreshBtn() {
        return this.getRecommendationContainer().$('.icon-mstrd_ai_regenerate');
    }

    getRecommendationContent() {
        return this.getRecommendationContainer().$('.mstrd-Recommendations-content');
    }

    getRecommendationItems() {
        return this.getRecommendationContent().$$('.mstrd-RecommendationItem');
    }

    async getRecommendationText(index = 1) {
        return this.getRecommendationItems()[index - 1].getText();
    }

    getCopyToQuetyBtn(index = 1) {
        return this.getRecommendationItems()[index - 1].$('.icon-mstrd_ai_copy_to_query');
    }

    getAnswerLoading() {
        return this.getAssistantContainer().$('.chat-bubble-loading-container');
    }

    getCancelQuestionBtn() {
        return this.getAnswerLoading().$('.chat-bubble-button');
    }

    getSendBtn() {
        return this.getAssistantContainer().$('.mstr-chatbot-chat-input__send-btn');
    }

    getStillWorkingBubble() {
        return this.$(`.Message.left[data-id='stillWorkingHard']`);
    }

    getAnswers() {
        return this.getAssistantContainer().$$(
            '.mstrd-ChatPanelVisualization,.mstrd-ChatPanelContainer-markdown-error-container'
        );
    }

    getCopyAnswerBtn(index = 1) {
        return this.getAnswers()[index - 1].$('.mstrd-ChatPanelVisualizationCopyIcon');
    }

    getSeeMoreOrLessBtn(index = 1, text) {
        return this.getAnswers()
            [index - 1].$$('.mstrd-ChatPanelVisualizationShowMore')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.toLocaleLowerCase() === text.toLocaleLowerCase();
            })[0];
    }

    getLoadingChatBubble() {
        return this.$('.single-loading-spinner');
    }

    getVizByIndex(index = 0) {
        return this.getAssistantContainer().$$('.mstrmojo-VIBox')[index];
    }

    async getLatestAnswer() {
        const index = await this.totalAnswers();
        return this.getAnswers()[index - 1];
    }

    async getLatestAnswerText() {
        const el = await this.getLatestAnswer();
        return this.getInnerText(el.$('.mstr-chatbot-markdown'));
    }

    getAnswerActionsContainer() {
        return this.getAssistantContainer().$('.chat-bubble-button-icons-container');
    }

    getQuotedMessageInInputBox() {
        return this.getAssistantContainer().$('.mstr-ai-chatbot-QuotedMessage--isRenderedInInputBox');
    }

    getMessageList() {
        return this.getAssistantContainer().$('.MessageList');
    }

    getMessageContents() {
        return this.getMessageList().$$('.Message-content');
    }

    getDataLimit(index = 1) {
        return this.getAnswers()[index - 1].$('.mstrd-ChatPanelVisualizationLimitedData');
    }

    getDataLimitText(index = 1) {
        return this.getDataLimit(index).getText();
    }

    async getLatestQuestion() {
        const questions = await this.getAssistantContainer().$$('.Message.right');
        return questions[questions.length - 1];
    }

    async getLatestQuotedMessage() {
        const quotedMessages = await this.getAssistantContainer().$$('.mstr-ai-chatbot-QuotedMessage');
        return quotedMessages[quotedMessages.length - 1];
    }

    async mockTimeInQuotedMessageInInputBox() {
        const quotedMessage = await this.getQuotedMessageInInputBox();
        const timeContainer = await quotedMessage.$('.mstr-ai-chatbot-QuotedMessage-time');
        const timeElement = await timeContainer.$('.Time');
        await this.executeScript('arguments[0].textContent = "12:00"', timeElement);
    }

    async mockTimeInQuotedMessage() {
        const quotedMessage = await this.getLatestQuotedMessage();
        const timeContainer = await quotedMessage.$('.mstr-ai-chatbot-QuotedMessage-time');
        const timeElement = await timeContainer.$('.Time');
        await this.executeScript('arguments[0].textContent = "12:00"', timeElement);
    }

    async isFollowUpBubbleExistInQuestion() {
        const quotedMessages = await this.getAssistantContainer().$$('.mstr-ai-chatbot-QuotedMessage');
        return quotedMessages.length > 0;
    }

    async isFollowUpBubbleExistInInputBox() {
        return await this.getAssistantContainer()
            .$('.mstr-ai-chatbot-QuotedMessage--isRenderedInInputBox')
            .isDisplayed();
    }

    async isFollowUpExistInActionButtons() {
        const answerActionsContainer = await this.getAnswerActionsContainer();
        return await answerActionsContainer.$('aria/Follow up').isDisplayed();
    }

    getMessageText(message) {
        if (!message) {
            return '';
        }

        if (message.type === 'visualization') {
            const text = message.content?.text;
            try {
                const textJson = JSON.parse(text);
                return textJson.textResult;
            } catch {
                return text;
            }
        } else {
            return message.content?.text;
        }
    }

    async getAnswerTextAndNuggetsCollectionsFromState(index = 1) {
        const pageUrl = await browser.getUrl();
        const pageKey = pageUrl.substr(1 + pageUrl.lastIndexOf('/'));
        const pageHistory = await browser.execute(function (pageKey) {
            return window.dossier.dossierCmd.fullState.autoAnswers.historyMessages[pageKey];
        }, pageKey);
        const answerMessage = pageHistory[index * 2 - 1];
        return {
            answerText: this.getMessageText(answerMessage),
            nuggetsCollections: answerMessage.content?.interpretationStash?.nuggetsCollections || [],
        };
    }

    async getQuestionId(index = 1) {
        const pageUrl = await browser.getUrl();
        const pageKey = pageUrl.substr(1 + pageUrl.lastIndexOf('/'));
        const pageHistory = await browser.execute(function (pageKey) {
            return window.dossier.dossierCmd.fullState.autoAnswers.historyMessages[pageKey];
        }, pageKey);
        return pageHistory[index * 2 - 1]?.questionId;
    }

    async getHistoryMessages() {
        const pageUrl = await browser.getUrl();
        const pageKey = pageUrl.substr(1 + pageUrl.lastIndexOf('/'));
        const messages = await browser.execute(function (pageKey) {
            return window.dossier.dossierCmd.getState().autoAnswers.historyMessages[pageKey];
        }, pageKey);
        return messages;
    }

    async waitForAllOpenEndedAnswers(alternatives) {
        await browser.waitUntil(
            async () => {
                const historyMessages = await this.getHistoryMessages();
                const allIncluded = alternatives.every((alternative) =>
                    historyMessages.some((message) => message.content?.openEndedQuestionText === alternative)
                );
                return allIncluded;
            },
            {
                timeout: 30000,
                timeoutMsg: 'waitForAllOpenEndedAnswers timeout in 30s',
            }
        );
    }

    getSuggestionPopup() {
        return this.$('.mstr-chatbot-suggestion-popup');
    }

    getSuggestionItems() {
        return this.getSuggestionPopup().$$('.mstr-design-list-item-content__text');
    }

    getVizByName(item) {
        return this.$(
            `//div[@class='mstrmojo-EditableLabel unselectable hasEditableText' and text()='${item}']/../../../..`
        );
    }

    async getDidYouMeanContainer() {
        const latestAnswer = await this.getLatestAnswer();
        return latestAnswer.$$('.mstr-ai-chatbot-DidYouMean-compact,.mstr-ai-chatbot-DidYouMean-regular')[0];
    }

    async getSmartSuggestionItem(index = 1) {
        const didYouMeanContainer = await this.getDidYouMeanContainer();
        return didYouMeanContainer.$$('.mstr-ai-chatbot-SuggestionItem')[index - 1];
    }

    getTooltip() {
        return this.$('.ant-tooltip .ant-tooltip-inner');
    }

    getLearnMoreIcon() {
        return this.getAssistantContainer().$('.icon-mstrd_learn_more');
    }

    //////////// Feedback and Learning ////////////
    getThumbDownIcon(index) {
        return this.getAnswers()[index - 1].$('.mstrd-ChatPanelThumbDownIcon');
    }

    getThumbDownIconSelected(index) {
        return this.getAnswers()[index - 1].$('.mstrd-ChatPanelThumbDownIconSelected');
    }

    getFeedbackContainer(index) {
        return this.getAnswers()[index - 1].$('.mstr-ai-chatbot-ChatPanelFeedback');
    }

    getFeedbackCategoryBtns(index, categoryIndex) {
        return this.getFeedbackContainer(index).$$('.mstr-ai-chatbot-ChatPanelFeedback-feedbackType')[
            categoryIndex - 1
        ];
    }

    getFeedbackInputArea(index) {
        return this.getFeedbackContainer(index).$('.mstr-ai-chatbot-ChatPanelFeedback-input');
    }

    getFeedbackInputAreaText(index) {
        return this.getFeedbackInputArea(index).getText();
    }

    getFeedbackSubmitBtn(index) {
        return this.getFeedbackContainer(index).$('.mstr-ai-chatbot-ChatPanelFeedback-submit');
    }

    getFeedbackCloseBtn(index) {
        return this.getFeedbackContainer(index).$('.mstr-ai-chatbot-ChatPanelFeedback-closeButton');
    }

    getLearningDialog(index) {
        return this.getAnswers()[index - 1].$('.mstr-ai-chatbot-ChatPanelFeedbackResults');
    }

    getLearningDialogHeaderTitle(index) {
        return this.getLearningDialog(index).$('.headerTitle');
    }

    getLearningDialogHeaderTitleText(index) {
        return this.getLearningDialog(index).$('.headerTitle').getText();
    }

    getLearningDialogForgetButton(index) {
        return this.getLearningDialog(index).$('.forgetButton');
    }

    getLearningDialogLoadingIcon(index) {
        return this.getAnswers()[index - 1].$('.mstr-ai-chatbot-ChatPanelFeedbackResults-spinner');
    }

    getShowErrorMessage() {
        return this.$('.mstr-design-collapse-header__title');
    }

    async getErrorDetailedMessage() {
        return this.$('.mstr-design-error-message-content__details-title').getText();
    }

    async clickShowErrorDetails() {
        const errorMessageElement = this.getShowErrorMessage();
        if (await errorMessageElement.isDisplayed()) {
            await this.click({ elem: errorMessageElement });
        }
    }

    async getVizInsideBot() {
        const el = await this.getLatestAnswer();
        return el.$('.mstrmojo-VIBox');
    }

    getDisclaimer() {
        return this.$('.mstr-chatbot-chat-panel__footnote');
    }

    getFilterIndicator(index = 1) {
        return this.getAnswers()[index - 1].$('.mstrd-ChatPanelFilteredResponseIndicator');
    }

    // Action helper
    async open() {
        if (!(await this.isAIAssistantPresent())) {
            await this.waitForElementClickable(this.getAIIcon());
            await this.click({ elem: this.getAIIcon() });
            await this.waitForCurtainDisappear();
            await this.waitForElementVisible(this.getAssistantContainer());
            await this.waitForElementStaleness(this.getRecommendationSkeleton());
        }
        await this.sleep(1000); // wait for AI assistant to be ready
    }

    async waitForAIReady() {
        await this.waitForElementVisible(this.getRecommendationContainer());
        await this.waitForElementStaleness(this.getRecommendationSkeleton());
        await this.sleep(1000); // wait for AI assistant to be ready
    }

    async openAndPin() {
        await this.open();
        await this.pin();
        return this.sleep(1000); // wait for AI assistant to be ready
    }

    async close(icon = 'close') {
        if (icon === 'close') {
            await this.click({ elem: this.getCloseBtn() });
        } else {
            await this.click({ elem: this.getAIIcon() });
        }
        return this.waitForCurtainDisappear();
    }

    async clickClearBtn() {
        return this.click({ elem: this.getClearBtn() });
    }

    async selectClearConfirmationBtn(text = 'Yes') {
        if (await this.getClearConfirmationBtn('Yes').isDisplayed()) {
            return this.click({ elem: this.getClearConfirmationBtn(text) });
        }
    }

    async clearHistory() {
        await this.clickClearBtn();
        await this.selectClearConfirmationBtn('Yes');
        return this.sleep(500); // wait for history to be cleared from GUI
    }

    async input(text) {
        const el = await this.getInputArea();
        await this.clearInput(el);
        await el.setValue(text);
    }

    async inputByPaste() {
        const el = await this.getInputArea();
        await this.clearInput(el);
        await this.paste();
    }

    async deleteContext() {
        return this.click({ elem: this.getContextDeleteBtn() });
    }

    async clearInput(el = this.getInputArea()) {
        await this.selectAll(el);
        return this.delete();
    }

    async pin() {
        if (await this.getPinBtn().isDisplayed()) {
            await this.click({ elem: this.getPinBtn() });
            return this.waitForCurtainDisappear();
        }
    }

    async unpin() {
        if (await this.getUnPinBtn().isDisplayed()) {
            await this.click({ elem: this.getUnPinBtn() });
            return this.waitForCurtainDisappear();
        }
    }

    async hoverLearMoreBtn() {
        await this.hover({ elem: this.getLearnMoreIcon() });
        return this.waitForElementVisible(this.getTooltip());
    }

    async expandRecommendation() {
        if (await this.isRecommendationCollapsed()) {
            await this.click({ elem: this.getRecommendationToggleButton() });
            return this.waitForElementVisible(this.getRecommendationContent());
        }
    }

    async collapseRecommendation() {
        if (!(await this.isRecommendationCollapsed())) {
            await this.click({ elem: this.getRecommendationToggleButton() });
            return this.waitForElementInvisible(this.getRecommendationContent());
        }
    }

    async sendQuestionByRecommendation(index = 1) {
        await this.click({ elem: this.getRecommendationItems()[index - 1] });
        await this.waitForElementInvisible(this.getAnswerLoading());
        return this.waitForElementInvisible(this.getStillWorkingBubble());
    }

    async sendQuestion() {
        await this.waitForElementClickable(this.getSendBtn());
        return this.getSendBtn().click();
    }

    async sendQuestionAndWaitForAnswer() {
        await this.sendQuestion();
        await this.waitForElementInvisible(this.getAnswerLoading());
        await this.waitForElementInvisible(this.getStillWorkingBubble());
        return this.sleep(1000); //wait GUI render
    }

    async inputAndSendQuestion(text) {
        await this.input(text);
        return this.sendQuestionAndWaitForAnswer();
    }

    async cancelQuestion() {
        if (await this.getCancelQuestionBtn().isDisplayed()) {
            return this.click({ elem: this.getCancelQuestionBtn() });
        }
    }

    async clickLatestVizInsideBot() {
        //sometimes GPT returned 'still working...'
        const el = await this.getVizInsideBot();
        const isAnswered = await el.isDisplayed();
        console.log('GPT returned the answer with viz:', isAnswered ? 'Yes' : 'No');
        if (isAnswered) {
            const size = await el.getSize();
            return this.click({
                elem: el,
                offset: { x: Math.round(size.width / 2), y: Math.round(size.height / 2) },
            });
        }
    }

    async copyAnswerAsImage(index) {
        await this.hover({ elem: this.getAnswers()[index - 1] });
        await this.click({ elem: this.getCopyAnswerBtn(index) });
        await browser.waitUntil(
            async () => {
                const successIcon = this.getAnswers()[index - 1].$('.mstrd-ChatPanelVisualizationCopyIcon--success');
                return await successIcon.isDisplayed();
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'Copy answer as image no response',
            }
        );
    }

    async copyImageFromLatestAnswer() {
        const index = await this.totalAnswers();
        return this.copyAnswerAsImage(index);
    }

    async hoverAnswer(index = 1) {
        await this.hover({ elem: this.getAnswers()[index - 1] });
    }

    async clickFollowUp(index = 1) {
        const targetAnswer = this.getAnswers()[index - 1];
        await targetAnswer.scrollIntoView();
        await this.hover({ elem: targetAnswer });
        await this.click({ elem: targetAnswer.$('aria/Follow up') });
    }

    async closeFollowUpBubble() {
        await this.click({ elem: this.getAssistantContainer().$('aria/delete quoted message') });
    }

    async clickAskAgainOnLatestQuestion() {
        await this.hover({ elem: await this.getLatestQuestion() });
        await this.click({ elem: (await this.getLatestQuestion()).$('.copyToIcon') });
    }

    async copyToQuetyFromRecommendation(index = 1) {
        await this.hover({ elem: this.getRecommendationItems()[index - 1] });
        await this.click({ elem: this.getCopyToQuetyBtn(index) });
        return this.sleep(500); // wait for GUI static change
    }

    async seeMoreFromLatestAnswer() {
        const index = await this.totalAnswers();
        if (await this.isSeeMoreBtnPresent()) {
            await this.click({ elem: this.getSeeMoreOrLessBtn(index, 'See more') });
            return this.sleep(500); // wait for GUI static change
        }
    }

    async seeLessFromLatestAnswer() {
        const index = await this.totalAnswers();
        if (await this.isSeeLessBtnPresent()) {
            await this.click({ elem: this.getSeeMoreOrLessBtn(index, 'See less') });
            return this.sleep(500); // wait for GUI static change
        }
    }

    async refreshRecommendation() {
        await this.click({ elem: this.getRecommendationRefreshBtn() });
        return this.waitForElementStaleness(this.getRecommendationSkeleton());
    }

    async clickMaxMinBtn() {
        await this.click({ elem: this.getMaxMinBtn() });
        return this.sleep(500); // wait for GUI static change
    }

    async maximizeChatbotVisualization(index = 0) {
        await this.hover({ elem: this.getChatBotVisualization(index) });
        await this.click({ elem: this.getChatBotVisualizationMaximizeIcon(index) });
        await this.waitForElementVisible(this.getChatBotMaximizeVisualization());
    }

    async maximizeLatestChatbotVisualization() {
        const count = await this.getChatBotVisualizations().length;
        return this.maximizeChatbotVisualization(count - 1);
    }

    async closeChatbotVizFocusModal() {
        await this.click({ elem: this.getChatBotVizFocusModalCloseIcon() });
        await this.waitForElementInvisible(this.getChatBotVizFocusModal());
    }

    async copyAsImageInVizFocusModal() {
        await this.click({ elem: this.getChatBotVizFocusModalCopyIcon() });
        await browser.waitUntil(
            async () => {
                const successIcon = this.getChatBotVizFocusModal().$('.mstrd-ChatPanelVisualizationCopyIcon--success');
                return await successIcon.isDisplayed();
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'Copy answer as image no response',
            }
        );
    }

    async showInterpretationInVizFocusModal() {
        await this.click({ elem: this.getChatBotVizFocusModalInterpretationIcon() });
        await browser.waitUntil(
            async () => {
                const interpretation = this.getChatBotVizFocusModal().$('.mstr-ai-chatbot-CIInterpretationWrapper');
                return await interpretation.isDisplayed();
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'Show interpretation no response',
            }
        );
    }

    async clickSeeMoreOrLessBtnOnVizFocusModal() {
        await this.click({ elem: this.getSeeMoreOrLessBtnOnVizFocusModal() });
    }

    async selectViz(vizName) {
        await this.getVizByName(vizName).click();
        console.log('\n***Set Viz Context: {}***\n'.replace('{}', vizName));
    }

    async sendQuestionWithTextAndObject(inputs) {
        await this.getInputArea().waitForDisplayed();
        await this.clearInput(this.getInputArea());
        for (let index = 0; index < inputs.length; index++) {
            let item = inputs[index];
            await this.inputQuestionWithTextAndObject(item);
        }
        await browser.keys('Enter');
        await this.waitForElementInvisible(this.getAnswerLoading());
        return this.sleep(1000); //wait GUI render
    }

    /*
        item = {
            "content":"the text to type in chatbot",
            "type":"object" //object for which needs to select auto-completion candidate,
            "order":0 //default as 0 choose first object
        }
    */
    async inputQuestionWithTextAndObject(item) {
        await this.getInputArea().click();
        await browser.keys('End');
        await browser.keys(item['content']);
        if (item['type'] == 'object') {
            await this.getSuggestionPopup().getText();
            if (Object.prototype.hasOwnProperty.call(item, 'order')) {
                for (let index = 0; index < item['order']; index++) {
                    await browser.keys('ArrowUp');
                }
            }

            await browser.keys('Enter');
        } else {
            await browser.keys('Space');
        }
    }

    async waitTillAnswerAppears() {
        await this.waitForElementInvisible(this.getAnswerLoading(), {
            timeout: 60 * 5000,
            msg: 'answer loading has not disappeared in 3 min',
        });
        return this.sleep(1000); //wait GUI render
    }

    async getSuggetionListTexts() {
        const items = await this.getSuggestionItems();
        let texts = [];
        for (let i = 0; i < items.length; i++) {
            texts.push(await items[i].getText());
        }
        return texts;
    }

    async hoverAIAssistantIcon() {
        await this.hover({ elem: this.getAIIcon() });
        return this.waitForElementVisible(this.getTooltip());
    }

    async hoverFilterIndicatorInAnswer(index = 1) {
        await this.hover({ elem: this.getFilterIndicator(index) });
        return this.waitForElementVisible(this.getTooltip());
    }

    // Assertion helper
    async isAIAssistantPresent() {
        return this.getAssistantContainer().isDisplayed();
    }

    async isAAPinned() {
        return await this.panel.isPanelDocked(this.getAssistantContainer());
    }

    async isCloseIconPresented() {
        return this.getCloseBtn().isDisplayed();
    }

    async isPinIconPresented() {
        return this.getPinBtn().isDisplayed();
    }

    async getContext() {
        const el = await this.getAIContext();
        return el.getAttribute('data-test-chat-panel-viz-name');
    }

    async isContextPresent() {
        return this.getCapsule().isDisplayed();
    }

    async isRecommendationCollapsed() {
        const el = await this.getRecommendationToggleButton();
        return !(await this.isExpanded(el));
    }

    async isRecommendationRefreshDisabled() {
        const el = await this.getRecommendationRefreshBtn();
        const name = await getAttributeValue(el, 'className');
        return name.includes('disabled');
    }

    async totalAnswers() {
        return this.getAnswers().length;
    }

    async isClearBtnDisabled() {
        const el = await this.getClearBtn();
        return this.isDisabled(el);
    }

    async isWelcomePagePresent() {
        return this.getAssistantWelcompage().isDisplayed();
    }

    async isAAMaximized() {
        const el = await this.getMaxMinBtn();
        return (await el.getAttribute('aria-label')) === 'Minimize';
    }

    async isSuggestionPresent() {
        return this.getSuggestionPopup().isDisplayed();
    }

    async getSuggestionCount() {
        await this.waitForElementVisible(this.getSuggestionPopup());
        return this.getSuggestionItems().length;
    }

    async isAnswerContainsOneOfKeywords(words, ignoreCase = true) {
        var res = await this.getLatestAnswerText();
        // check if contain any of the keywords
        var contain_res = false;
        res = ignoreCase ? res.toLowerCase() : res;
        await words.forEach(async (word) => {
            var wordToCheck = ignoreCase ? word.toLowerCase() : word;
            if (res.includes(wordToCheck)) {
                console.log('find keyword:' + wordToCheck + ' in the answer: ' + res);
                contain_res = true;
            }
        });
        // output error if not contain any of the keywords
        if (!contain_res) {
            console.log("didn't find any keywords of :" + words + ' in the answer: ' + res);
        }
        return contain_res;
    }

    async clickSmartSuggestion(index = 1) {
        await this.waitForElementVisible(await this.getDidYouMeanContainer(), {
            timeout: 60 * 5000,
            msg: 'did you mean container has not been displayed in 3 min',
        });
        await this.waitTillDidYouMeanDataReady();
        const smartSuggestionItem = await this.getSmartSuggestionItem(index);
        return this.click({ elem: smartSuggestionItem });
    }

    async copySmartSuggestionToQuery(index = 1) {
        const suggestionItem = await this.getSmartSuggestionItem(index);
        await this.hover({ elem: suggestionItem });
        return this.click({ elem: suggestionItem.$('.mstr-ai-chatbot-SuggestionItem-copyIcon') });
    }

    async closeDidYouMean() {
        const didYouMeanContainer = await this.getDidYouMeanContainer();
        return this.click({ elem: didYouMeanContainer.$('.mstr-ai-chatbot-DidYouMean-close-button') });
    }

    async waitTillDidYouMeanDataReady() {
        const didYouMeanContainer = await this.getDidYouMeanContainer();
        await this.waitForElementInvisible(didYouMeanContainer.$('.mstr-ai-chatbot-LoadingSkeleton'));
        await this.sleep(1000);
        const smartSuggestionItem = await this.getSmartSuggestionItem();
        await this.waitForElementVisible(smartSuggestionItem);
    }

    async getNumberOfSmartSuggestions() {
        const didYouMeanContainer = await this.getDidYouMeanContainer();
        const smartSuggestionItems = await didYouMeanContainer.$$('.mstr-ai-chatbot-SuggestionItem');
        return smartSuggestionItems.length;
    }

    async isDidYouMeanExisting() {
        const latestAnswer = await this.getLatestAnswer();
        const containerSize = await latestAnswer.$$(
            '.mstr-ai-chatbot-DidYouMean-compact,.mstr-ai-chatbot-DidYouMean-regular'
        ).length;
        return containerSize > 0;
    }

    async isTooltipPresent() {
        return this.getTooltip().isDisplayed();
    }

    async getTooltipText() {
        return this.getTooltip().getText();
    }

    async isRecommendationListContainsChinese() {
        const text = await this.getRecommendationText();
        // return /[\u4e00-\u9fa5]/.test(text);
        return this.containsChinese(text);
    }

    async isLatestAnswerContainsChinese() {
        const text = await this.getLatestAnswerText();
        return this.containsChinese(text);
    }

    async containsChinese(text) {
        return /[\u4e00-\u9fa5]/.test(text);
    }

    async getPlacehoderTextInInputArea() {
        const el = await this.getInputArea();
        return (await el.getAttribute('placeholder')).trim();
    }

    async isSeeMoreBtnPresent() {
        const index = await this.totalAnswers();
        return this.getSeeMoreOrLessBtn(index, 'See more').isDisplayed();
    }

    async isSeeLessBtnPresent() {
        const index = await this.totalAnswers();
        return this.getSeeMoreOrLessBtn(index, 'See less').isDisplayed();
    }

    async clickForgetLearningBtn(index) {
        return this.click({ elem: this.getLearningDialogForgetButton(index) });
    }

    async isLearningLoadingIconDisplayed(index) {
        const el = await this.getLearningDialogLoadingIcon(index);
        return el && el.isDisplayed();
    }

    async isLearningResultsDisplayed(index) {
        const el = await this.getLearningDialog(index);
        return el && el.isDisplayed();
    }

    async getDisclaimerText() {
        return this.getDisclaimer().getText();
    }

    async isDisclaimerPresent() {
        return this.getDisclaimer().isDisplayed();
    }

    async isAIAssistantDisabled() {
        const el = await this.getAIIconContainer();
        const status = await el.getAttribute('disabled');
        return status !== null;
    }

    async isDataLimitDisplayed(index = 1) {
        return (await this.getDataLimit(index)).isDisplayed();
    }

    async isFilterIndicatorDisplayedInAnswer(index) {
        return this.getFilterIndicator(index).isDisplayed();
    }

    async isMaxMinBtnDisplayed() {
        return this.getMaxMinBtn().isDisplayed();
    }

    async getAnswersWithVizCount() {
        return this.getChatBotVisualizations().length;
    }

    //////////// Feedback and Learning ////////////

    async isThumbDownButtonHighlighted(index) {
        const el = await this.getThumbDownIconSelected(index);
        return el.isDisplayed();
    }
    async isThumbDownButtonVisible(index) {
        const el = await this.getThumbDownIcon(index);
        return el.isDisplayed();
    }

    async isThumbDownButtonVisibleOnHover(index) {
        await this.hover({ elem: this.getAnswers()[index - 1] });
        const el = await this.getThumbDownIcon(index);
        return el.isDisplayed();
    }

    async isThumbDownButtonClickable(index) {
        const el = await this.getThumbDownIcon(index);
        return this.isActive(el);
    }

    async isFeedbackDialogVisible(index) {
        const el = await this.getFeedbackContainer(index);
        return el.isDisplayed();
    }

    async isFeedbackSubmitButtonClickable(index) {
        const el = await this.getFeedbackSubmitBtn(index);
        return this.isActive(el);
    }

    async isFeedbackSubmitButtonVisible(index) {
        const el = await this.getFeedbackSubmitBtn(index);
        return el.isDisplayed();
    }

    async isFeedbackSubmitButtonDisabled(index) {
        const el = await this.getFeedbackSubmitBtn(index);
        const isDisabled = await el.getAttribute('disabled');
        return isDisabled !== null;
    }

    async isFeedbackCategoryButtonSelected(index, categoryIndex) {
        const el = await this.getFeedbackCategoryBtns(index, categoryIndex);
        const className = await el.getAttribute('class');
        return className.includes('selected');
    }

    async isThanksForYourFeedbackVisible(index) {
        const el = await this.getLearningDialogHeaderTitle(index);
        return el.isDisplayed() && (await el.getText()) === 'Thanks for your feedback!';
    }

    async isLearningLoadingVisible(index) {
        const el = await this.getLearningDialogLoadingIcon(index);
        return el.isDisplayed();
    }

    async isFocusMaxIconVisible(index = 0) {
        return this.getChatBotVisualizationMaximizeIcon(index).isDisplayed();
    }

    async isFocuseModalPresent() {
        return this.getChatBotVizFocusModal().isDisplayed();
    }

    async isSeeMoreLessBtnExpandedOnFocusModal() {
        const el = await this.getSeeMoreOrLessBtnOnVizFocusModal();
        const clsName = await getAttributeValue(el, 'className');
        return clsName.includes('expanded');
    }

    async getMesseageCount() {
        if (await this.getMessageList().isDisplayed()) {
            return this.getMessageContents().length;
        } else {
            return 0;
        }
    }

    async clickThumbDown(index) {
        await this.hover({ elem: this.getAnswers()[index - 1] });
        return this.click({ elem: this.getThumbDownIcon(index) });
    }

    async clickThumbDownSelected(index) {
        await this.hover({ elem: this.getAnswers()[index - 1] });
        return this.click({ elem: this.getThumbDownIconSelected(index) });
    }

    async clickFeedbackTag(feedbackIndex, tagIndex) {
        return this.click({ elem: this.getFeedbackCategoryBtns(feedbackIndex, tagIndex) });
    }

    async inputFeedbackMessage(index, content) {
        const el = await this.getFeedbackInputArea(index);
        await this.clear({ elem: el });
        await el.setValue(content);
    }

    async submitFeedback(index) {
        return this.click({ elem: this.getFeedbackSubmitBtn(index) });
    }

    async closeFeedbackDialog(index) {
        return this.click({ elem: this.getFeedbackCloseBtn(index) });
    }

    async isTextInSuggestionList(text) {
        const texts = await this.getSuggetionListTexts();
        console.log('Suggestion List:', texts);
        return texts.includes(text);
    }

    async checkChatbotInputArea(testCase, imageName, tolerance) {
        await checkElementByImageComparison(this.getInputboxContainer(), testCase, imageName, tolerance);
    }

    async sendPrompt(text) {
        await this.click({ elem: this.getInputArea() });
        await this.typeKeyboard(text);
        await this.click({ elem: this.getSendBtn() });
    }

    async vizCreationByChat(pagePrompt) {
        await this.sendPrompt(pagePrompt);
        await this.waitForElementInvisible(this.getLoadingChatBubble(), { timeout: 300 * 1000 });
    }

    async clearHistoryVizCreationByChat(pagePrompt) {
        await this.clearHistory();
        await this.vizCreationByChat(pagePrompt);
    }

    async checkChatbotVizByIndex(index = 0, testCase, imageName, tolerance) {
        const viz = this.getVizByIndex(index);
        if (await viz.isDisplayed()) {
            await checkElementByImageComparison(viz, testCase, imageName, tolerance);
        } else {
            await this.clickShowErrorDetails();
            const ele = await this.getLatestAnswer();
            if (ele.isDisplayed()) {
                await checkElementByImageComparison(ele, testCase, imageName, tolerance);
            }
        }
    }

    async checkChatbotLatestViz(testCase, imageName, tolerance) {
        const latestViz = this.getChatBotLatestVisualization();
        if (await latestViz.isDisplayed()) {
            await checkElementByImageComparison(latestViz, testCase, imageName, tolerance);
        } else {
            await this.clickShowErrorDetails();
            const ele = await this.getLatestAnswer();
            if (ele.isDisplayed()) {
                await checkElementByImageComparison(ele, testCase, imageName, tolerance);
            }
        }
    }

    async checkChatbotMaximizeViz(testCase, imageName, tolerance) {
        await this.waitForElementVisible(this.getChatBotMaximizeVisualization());
        await checkElementByImageComparison(this.getChatBotMaximizeVisualization(), testCase, imageName, tolerance);
    }

    verifyQuotedQuestion(expected, actual) {
        // verify all fields in the expected object are included in the actual object
        for (const key in expected) {
            const expectedValue = expected[key];
            const actualValue = actual[key];
            if (Array.isArray(expectedValue) && Array.isArray(actualValue)) {
                if (!this.arraysEqual(expectedValue, actualValue)) {
                    return false;
                }
            } else {
                if (expectedValue !== actual[key]) {
                    return false;
                }
            }
        }
        return true;
    }

    arraysEqual(arr1, arr2) {
        // Check if the arrays have the same length
        if (arr1.length !== arr2.length) {
            return false;
        }

        // Iterate through the elements and compare each corresponding element
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }

        // If all elements are equal, return true
        return true;
    }
}
