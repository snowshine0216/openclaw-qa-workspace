import LibraryPage from '../library/LibraryPage.js';
import { getAttributeValue } from '../../utils/getAttributeValue.js';
import { scrollIntoView, scrollElement, scrollElementToBottom, scrollElementToTop } from '../../utils/scroll.js';
import ChatAnswer from './ChatAnswer.js';
import { Key } from 'webdriverio';
import DossierPage from '../dossier/DossierPage.js';
import BasePage from '../base/BasePage.js';
export default class AIBotChatPanel extends BasePage {
    constructor() {
        super();
        this.libraryPage = new LibraryPage();
        this.dossierPage = new DossierPage();
    }

    //Get elements

    getCloseButton() {
        return this.$('.icon-pnl_close');
    }

    getMainView() {
        return this.$('.mstr-ai-chatbot-MainView');
    }

    getChatPanel() {
        return this.$('.mstr-ai-chatbot-ChatPanel');
    }

    getLoadingHistoryText() {
        return this.$('.loading-text');
    }

    getLoadingHistorySpan() {
        return this.$('.loading-icon');
    }

    getTooltip() {
        return this.$('.mstr-ai-chatbot-Tooltip');
    }

    getTopicTooltip() {
        return this.$('.mstr-design-tooltip-inner');
    }

    getTitleBar() {
        return this.$('.mstr-ai-chatbot-TitleBar');
    }

    getTitleBarLeft() {
        return this.$('.mstr-ai-chatbot-TitleBar-left-bar');
    }

    getTitleBarBotLogo() {
        return this.$('.mstr-ai-chatbot-TitleBar-bot-logo-container');
    }

    getTitleBarBotName() {
        //return this.$('.mstr-ai-chatbot-TitleBar-bot-name');
        return this.$('#titlebar_bot_name');
    }

    getTitleBarBotNameTexts() {
        return this.getTitleBarBotName().getText();
    }

    getTitleBarExternalLinkContainer() {
        return this.$('.mstr-ai-chatbot-TitleBar-external-links-container');
    }

    getTitleBarExternalLinkItems() {
        return this.getTitleBarExternalLinkContainer().$$('.mstr-ai-chatbot-TitleBar-external-links-bar-link-button');
    }

    getTitleBarExternalLinkItemsByIndex(index) {
        return this.getTitleBarExternalLinkItems()[index];
    }

    getTitleBarExternalLinkByIndexForEscTest(index) {
        // Used for accessibility tests to check focus
        return this.getTitleBarExternalLinkItemsByIndex(index).$('.mstr-ai-chatbot-ExternalLinkButton-container');
    }

    getTitleBarExternalLinkTextFieldByIndex(index) {
        return this.getTitleBarExternalLinkItemsByIndex(index).$('.mstr-ai-chatbot-ExternalLinkButton-text');
    }

    getTitleBarExternalLinkTextByIndex(index) {
        return this.getTitleBarExternalLinkTextFieldByIndex(index).getText();
    }

    getTitleBarExternalLinkIconByIndex(index) {
        return this.getTitleBarExternalLinkItemsByIndex(index).$('.mstr-ai-chatbot-ExternalLinkButton-icon');
    }

    getTitleBarExternalLink() {
        return this.$('.mstr-ai-chatbot-TitleBar-external-link.mstr-ai-chatbot-TitleBar-external-link--style-icon');
    }

    getChatBotTitleBarExternalLinkContainer() {
        return this.$('.mstr-ai-chatbot-TitleBar-external-links-container');
    }

    getChatBotTitleBarExternalLinkText(text) {
        return this.getChatBotTitleBarExternalLinkContainer()
            .$$('.mstr-ai-chatbot-ExternalLinkButton-text')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === text;
            })[0];
    }

    getLinksPopoverButton() {
        return this.$('.mstr-ai-chatbot-TitleBar-external-links-popover-trigger-container').$(
            '.mstr-ai-chatbot-TitleBar-icon-container'
        );
    }

    getLinksPopoverContents() {
        return this.$('.mstr-ai-chatbot-TitleBar-external-links-popover-content');
    }

    getLinksPopoverItemsbyIndex(Index) {
        return this.getLinksPopoverContents().$$('.mstr-ai-chatbot-TitleBar-external-links-popover-link-button')[Index];
    }

    getTitleBarDivider() {
        return this.$('.mstr-ai-chatbot-TitleBar-divider');
    }

    getClearHistoryButton() {
        return this.$('.mstr-ai-chatbot-TitleBar-clear-history .mstr-ai-chatbot-IconButton');
    }

    getClearHistoryConfirmationDialog() {
        return this.$('.mstr-ai-chatbot-ConfirmationButton-dialog');
    }

    getClearHistoryYesButton() {
        return this.$(
            '.mstr-ai-chatbot-ConfirmationButton-confirm,.mstr-ai-chatbot-ConfirmationDialog-button--style-outline'
        );
    }

    getClearHistoryNoButton() {
        return this.$('.mstr-ai-chatbot-ConfirmationButton-cancel');
    }

    getNewChatButton() {
        return this.$('.mstr-ai-chatbot-TitleBar-new-chat');
    }

    getDisabledNewChatButton() {
        return this.$(`.mstr-ai-chatbot-TitleBar-new-chat[aria-disabled='true']`);
    }

    getHistoryPanelButton() {
        return this.$('.mstr-ai-chatbot-TitleBar-histories');
    }

    getOpenSnapshotPanelButton() {
        return this.$('.mstr-ai-chatbot-TitleBar-snapshots');
    }

    getDotInSnapshotPanelButton() {
        return this.$(`div[aria-label='You have new snapshots.'][role='img']`);
    }

    getDotInSnapshotPanelButtonV2() {
        return this.$(`svg[aria-label='You have new snapshots.'][role='img']`);
    }

    isDotInSnapshotPanelButtonV2() {
        return this.getDotInSnapshotPanelButtonV2().isExisting();
    }

    isSnapshotPanelClosed() {
        return this.getOpenSnapshotPanelButton().isExisting();
    }

    getCloseSnapshotButton() {
        return this.$('.mstr-ai-chatbot-SnapshotsPanel-close');
    }

    getWelcomePage() {
        return this.$('.mstr-ai-chatbot-WelcomePage');
    }

    getWelcomePageBotIcon() {
        return this.$('.mstr-ai-chatbot-WelcomePage-botIcon');
    }

    getWelcomePageBotImage() {
        return this.$('.mstr-ai-chatbot-WelcomePage-botImg');
    }

    getBot2WelcomePage() {
        return this.$('.mstr-ai-chatbot-WelcomePage.v2');
    }

    getWelcomePageMessage() {
        return this.$('.mstr-ai-chatbot-WelcomePage-message');
    }

    getWelcomePageMessageTexts() {
        return this.getWelcomePageMessage().getText();
    }

    getWelcomePageSeparator() {
        return this.$('.mstr-ai-chatbot-WelcomePage-separator');
    }

    getWelcomePageTitle() {
        return this.$('.mstr-ai-chatbot-WelcomePage-title');
    }

    getWelcomePageGreetingTitle() {
        return this.$('.mstr-ai-chatbot-WelcomePage-greetingTitle');
    }

    getWelcomePageTitleTexts() {
        return this.getWelcomePageTitle().getText();
    }

    getTopicSuggestions() {
        return this.getWelcomePage().$('.mstr-ai-chatbot-ChatPanelTopics');
    }

    getTopicSuggestionOptions() {
        return this.getTopicSuggestions().$$('.mstr-ai-chatbot-Clickable');
    }

    getTopicSuggestionOptionByIndexText(index) {
        return this.getTopicSuggestionOptions()[index].$('.mstr-ai-chatbot-ChatPanelTopicItem-description').getText();
    }

    getTopicSuggestionTitle() {
        return this.getWelcomePage().$('.mstr-ai-chatbot-ChatPanelTopics-title');
    }

    getTopicSuggestionByTitle(title) {
        return this.$$('.mstr-ai-chatbot-ChatPanelTopicItem-title').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === title;
        })[0];
    }

    getTopicSuggestionTitleTexts() {
        return this.getTopicSuggestionTitle().getText();
    }

    getChatPanelTopic() {
        return this.$('.mstr-ai-chatbot-ChatPanelTopics');
    }

    getRecommendationPanelIcon() {
        return this.$('div[data-feature-id="aibot-input-footer-suggestions-toggle-v2"]');
    }

    getRecommendations() {
        return this.$('.mstr-ai-chatbot-Recommendations');
    }

    getRecommendationTitle() {
        return this.$('.mstr-ai-chatbot-Recommendations-title');
    }

    getRecommendationList() {
        return this.$('.mstr-ai-chatbot-RecommendationItem-text');
    }

    getRecommendationTitleObjectName() {
        return this.$('.mstr-ai-chatbot-Recommendations-title-content-objectName').getText();
    }

    getRecommendationQuestionItems() {
        return this.getRecommendations().$$('.mstr-ai-chatbot-RecommendationItem');
    }

    getRecommendationFirstItem() {
        return this.getRecommendations().$('.mstr-ai-chatbot-RecommendationItem');
    }

    getRecommendationByIndex(Index) {
        return this.getRecommendations().$$('.mstr-ai-chatbot-RecommendationItem')[Index];
    }

    async getRecommendationTextByIndex(Index) {
        const recommendation = this.getRecommendationByIndex(Index);
        const text = await recommendation.getText();
        return text;
    }

    getRecommendationSuggestionSkeletons() {
        return this.getRecommendations().$$('.mstr-ai-chatbot-RecommendationSkeleton');
    }

    getRecommendataionSugestionSkeletonsByIndex(Index) {
        return this.getRecommendationSuggestionSkeletons()[Index];
    }

    getRecommendationTextsByIndex(Index) {
        return this.getRecommendations().$$('.mstr-ai-chatbot-RecommendationItem')[Index].getText();
    }

    getRelatedSuggestionArea() {
        return this.$('.mstr-chatbot-chat-input-inline__quick-replies');
    }

    getRelatedSuggestionTitle() {
        const xpathCommand = this.getCSSContainingText('mstr-ai-chatbot-Clickable', 'Related suggestions');
        return this.$(`${xpathCommand}`);
    }

    getRecommendationExpandStateBtn() {
        return this.$('.mstr-ai-chatbot-Recommendations-expandButton--expanded');
    }

    getRecommendationFoldStateBtn() {
        return this.$('.mstr-ai-chatbot-Recommendations-expandButton');
    }

    getDisabledRecommendationFoldStateBtn() {
        return this.$('.mstr-ai-chatbot-Recommendations-expandButton--disabled');
    }

    getRecommendationRefreshIcon() {
        return this.$('.mstr-ai-chatbot-Recommendations-refreshButton');
    }

    getResearchIcon() {
        return this.$('div[data-feature-id="aibot-input-footer-research-toggle-v2"]');
    }

    getWebSearchIcon() {
        return this.$('div[data-feature-id="aibot-input-footer-web-search-toggle-v2"]');
    }

    getTopicByIndex(Index) {
        return this.$('.mstr-ai-chatbot-Topics-contentWelcome').$$('.mstr-ai-chatbot-TopicItem')[Index];
    }

    getHighlightMessage() {
        return this.$('.highlight-message');
    }

    getTopicItemList() {
        return this.$$('.mstr-ai-chatbot-TopicItem');
    }

    async getTopicItemListLength() {
        await this.waitForElementClickable(this.getTopicSuggestions());
        return this.getTopicItemList().length;
    }

    getAskAbout() {
        return this.$('.mstr-ai-chatbot-TopicExploreMore');
    }

    getInputBox() {
        return this.$('.mstr-chatbot-chat-input-inline__textarea');
    }

    getInputBoxInTeams() {
        return this.$('.mstr-chatbot-chat-input-inline__textarea');
    }

    getInputBoxContainer() {
        return this.$('.mstr-chatbot-chat-input-inline__input-container');
    }

    getDisabledInputBoxContainer() {
        return this.$('.mstr-chatbot-chat-input-inline__input-container--disabled');
    }

    getInputBoxText() {
        return this.$('.mstr-chatbot-chat-input-inline__textarea').getText();
    }

    getHintText() {
        return this.getInputBox().getAttribute('placeholder');
    }

    getVIVizPanel(index = 0) {
        return this.$$('.mstrmojo-VIVizPanel-content')[index];
    }

    getVIVizDocPanel(index = 0) {
        return this.getVIVizPanel(index).$('.mstrmojo-DocPanel.mstrmojo-VIDocRelativePanel');
    }

    getQueryCount() {
        return this.getAnswerList().$$('.right').length;
    }

    getValidAnswerCount() {
        return this.getAnswerList().$$('.left .chat-bubble.Bubble.text').length;
    }

    getRecommendationCount() {
        return this.getRecommendations().$$('.mstr-ai-chatbot-RecommendationItem').length;
    }

    getMessageList() {
        return this.$('.MessageContainer');
    }

    getSendIcon() {
        return this.$('.mstr-chatbot-chat-input-inline__send-btn');
    }

    getChatBotSendIcon() {
        return this.$('.mstr-chatbot-chat-input-inline__send-btn');
    }

    getSendIconInTeams() {
        return this.$('.mstr-chatbot-chat-input-inline__input-right');
    }

    getDisabledSendIcon() {
        return this.$('.mstr-chatbot-chat-input-inline__send-btn--disabled');
    }

    getTopicSuggestinos() {
        return this.getWelcomePage().$('.mstr-ai-chatbot-ChatPanelTopics');
    }

    getChatPanelTopics() {
        return this.$('.mstr-ai-chatbot-ChatPanelTopics');
    }

    getChatPanelTopicsCount() {
        return this.$$('.mstr-ai-chatbot-ChatPanelTopics').length;
    }

    getChatPanelTopicItemByIndex(Index) {
        return this.$$('.mstr-ai-chatbot-ChatPanelTopicItem')[Index];
    }

    getChatPanelTopicItemCount() {
        return this.$$('.mstr-ai-chatbot-ChatPanelTopicItem').length;
    }

    getChatPanelTopicsTitle() {
        return this.$('.mstr-ai-chatbot-ChatPanelTopics-title');
    }

    getInputTopics() {
        return this.$('.mstr-chatbot-chat-input-inline__input-right').$('.mstr-design-button');
    }

    getChatBotMaxQuestionQuota() {
        return this.$('.mstr-chatbot-chat-input__footer-left').$('span.mstr-design-capsule-children-container');
    }

    getTopicsIcon() {
        return this.$('.mstr-chatbot-chat-input-inline__empty-btn');
    }

    getDisabledTopicsIcon() {
        return this.$('.mstr-chatbot-chat-input-inline__empty-btn--disabled');
    }

    getAutoCompleteArea() {
        return this.$('.mstr-chatbot-suggestion-popup');
    }

    getAutoCompleteHeader() {
        return this.$('.mstr-chatbot-suggestion-popup-header');
    }

    getTextOfAutoCompleteHeader() {
        return this.getAutoCompleteHeader().getText();
    }

    getAutoCompleteContent() {
        return this.$('.mstr-chatbot-suggestion-popup-content');
    }

    getAutoCompleteItemCount() {
        return this.getAutoCompleteContent().$$('.mstr-chatbot-suggestion-popup-item-row').length;
    }

    getAutoCompleteItembyIndex(Index) {
        return this.getAutoCompleteContent().$$('.mstr-chatbot-suggestion-popup-item-row')[Index];
    }

    getTextOfAutoCompleteionItem(index = 0) {
        return this.getAutoCompleteItembyIndex(index).$('.mstr-design-list-item-content__text').getText();
    }

    getHighlightedTextOfAutoCompleteionItem(index = 0) {
        return this.getAutoCompleteItembyIndex(index).$('.mstr-design-highlighter__highlight-mark').getText();
    }

    getBubbleLoadingIcon() {
        return this.$('.chat-bubble-loading');
    }

    getAnswerList() {
        return this.$('.MessageList');
    }

    getChatPanelContainer() {
        return this.$('.mstr-ai-chatbot-MainView-chatPanelContainer');
    }

    getChatBotVizByType(vizType, Index = 0) {
        return this.$$(`//div[contains(@class, 'mstrmojo-VIBox') and contains(@aria-roledescription,'${vizType}')]`)[
            Index
        ];
    }

    getCustomVizByType(vizType, Index = 0) {
        return this.$$(`//div[contains(@class,'custom-vis-layout ${vizType}')]`)[Index];
    }

    getMarkDownByIndex(Index) {
        return this.$$('.mstr-chatbot-markdown')[Index];
    }

    getMarkDownAnswerCount() {
        return this.$$('.mstr-chatbot-markdown').length;
    }

    getMarkdownByIndexTexts(Index) {
        return this.getMarkDownByIndex(Index).$$('p');
    }

    getChatBotPinIcon() {
        return this.$('.mstr-ai-chatbot-SnapshotButton-pin');
    }

    getChatBotPinIconByIndex(index = 0) {
        return this.getChatAnswerbyIndex(index).$('.mstr-ai-chatbot-SnapshotButton-pin');
    }

    getAnswerCount() {
        return this.$$('.mstr-chatbot-markdown').length;
    }

    getVizAnswerBubbleList() {
        return this.$('.mstr-ai-chatbot-VisualizationBubble');
    }

    getAnswerbyIndex(Index) {
        return this.getAnswerList().$$('.mstr-ai-chatbot-VisualizationBubble,.Message.left')[Index];
    }

    getChatAnswerbyIndex(Index) {
        return this.getAnswerList().$$('.chat-bubble.Bubble.text.full-message')[Index];
    }

    getAnswerBubblebyIndex(Index) {
        return this.getAnswerList().$$('.Message.left')[Index];
    }

    getChatAnswerNumber() {
        return this.getAnswerList().$$('.chat-bubble.Bubble.text.full-message').length;
    }

    getChatBotTextAnswerByIndex(Index) {
        return this.getAnswerList().$$('.mstr-ai-chatbot-VisualizationBubble-text')[Index];
    }

    async getNthParagraphOfTextAnswerFromEnd(Nth) {
        const nthChatBotAnswer = await this.getNthChatBotAnswerFromEnd(Nth);
        return nthChatBotAnswer.$('p');
    }

    async getNthParagraphOfTextAnswerFromEndV2(Nth) {
        const nthChatBotAnswer = await this.getNthChatBotAnswerFromEnd(Nth);
        const textContainer = nthChatBotAnswer.$('.mstr-ai-chatbot-VisualizationBubbleV2-text');
        
        // Try to find a paragraph first
        const p = textContainer.$('p');
        if (await p.isExisting()) {
            await p.scrollIntoView();
            return p;
        }
        
        // If no paragraph, get the first list item (li)
        const li = textContainer.$('li');
        await li.scrollIntoView();
        return li;
    }

    async getNthChatBotAnswerFromEnd(Nth) {
        const n = await this.getChatAnswerNumber();
        return this.getChatAnswerbyIndex(n - Nth);
    }

    getTextAnswerByIndex(Index) {
        return this.getAnswerList().$$('.mstr-ai-chatbot-VisualizationBubble-text')[Index];
    }

    getCountOfTextAnswer() {
        return this.getAnswerList().$$('.mstr-ai-chatbot-VisualizationBubble-text').length;
    }

    getAnswerBubbleButtonIconContainerbyIndex(Index) {
        return this.getAnswerbyIndex(Index).$('.chat-bubble-button-icons-container');
    }

    getAnswerBubbleButtonBarByIndex(index) {
        return this.getAnswers()[index].$('.chat-bubble-button-icons-container.bottom-container');
    }

    getBottomButtonIconContainerbyIndex(Index) {
        return this.$$('.bottom-container')[Index];
    }

    getVizAnswerByIndex(Index = 0) {
        return this.getAnswerbyIndex(Index).$('.mstrmojo-VIDocLayoutViewer ');
    }

    getInterpretationIcon() {
        return this.$$('.mstr-ai-chatbot-InterpretationButton .mstr-icons-lib-icon').filter(async (elem) => {
            return elem.isDisplayed();
        })[0];
    }

    getInterpretationIconbyIndex(index) {
        return this.getAnswers()[index].$('.mstr-ai-chatbot-InterpretationButton');
    }

    getAnswerWithoutCacheButton(index = 0) {
        return this.getAnswers()[index].$('.single-icon-chatbot-cached-answer');
    }

    getInterpretationSqlByIndex(index) {
        return this.getAnswers()[index].$('.mstr-ai-chatbot-CIInterpretedAs-sql');
    }

    getInterpretationTextByIndex(index) {
        return this.getAnswers()[index].$('mstr-ai-chatbot-CIInterpretedAs-text');
    }

    getInterpretationAdvancedBtnByIndex(index) {
        return this.getAnswers()[index].$('.mstr-ai-chatbot-CIInterpretedAs-advanced-button');
    }

    getInterpretationCopyToQueryIcon() {
        return this.$('.mstr-ai-chatbot-CIInterpretedAs-copy-query');
    }

    getInterpretationCopyToQueryDisableIcon() {
        return this.$('.mstr-ai-chatbot-CIInterpretedAs-copy-query--disabled');
    }

    getInterpretationCopyLLMInstructionsIcon() {
        return this.$('.mstr-ai-chatbot-CIComponents-header-right-copy-container');
    }

    getInterpretationComponent() {
        return this.$('.mstr-ai-chatbot-ChatInterpretationComponent');
    }

    getInterpretationIconInChatAnswerbyIndex(index) {
        return this.getChatAnswerbyIndex(index).$('.mstr-ai-chatbot-InterpretationButton').$('.mstr-icons-lib-icon');
    }

    getInterpretedAsText() {
        return this.$('.mstr-ai-chatbot-CIInterpretedAs-text').getText();
    }

    getInterpretationSeeMoreBtn() {
        return this.$('.mstr-ai-chatbot-TruncatedText-showMoreLessButton');
    }

    getInterpretationLoadingSpinner() {
        return this.$('.mstr-ai-chatbot-CILoading-spinner');
    }

    getInterpretationReloadButton() {
        return this.$('.mstr-ai-chatbot-CIError-reload');
    }

    getThumbUpIconbyIndex(index) {
        return this.getAnswers()[index].$('.mstr-ai-chatbot-ThumbButton-thumbUp');
    }

    getThumbDownIconbyIndex(index) {
        return this.getAnswers()[index].$(
            '.mstr-ai-chatbot-ThumbDownButton-thumbDown,.mstr-ai-chatbot-ThumbButton-thumbDown'
        );
    }

    getThumbDownClickedIconbyIndex(Index) {
        return this.$$('.mstr-ai-chatbot-ThumbDownButton-thumbDowned')[Index].$('.mstr-icons-lib-icon');
    }

    getThumbDownLoadingSpinner() {
        return this.$('.mstr-ai-chatbot-Spinner--grey');
    }

    getThumbDownCount() {
        return this.$$('.mstr-ai-chatbot-ThumbDownButton-thumbDown').length;
    }

    getFeedbackPanel(index = 0) {
        return this.getAnswers()[index].$('.mstr-ai-chatbot-ChatPanelFeedback');
    }

    getFollowUpIconbyIndex(index) {
        return this.getAnswers()[index].$('.mstr-ai-chatbot-FollowUpButton');
    }

    getFollowUpCount() {
        return this.$$('.mstr-ai-chatbot-FollowUpButton').length;
    }

    getQuotedQuestionInInpuxBox() {
        return this.$('.mstr-chatbot-chat-input-inline__quoted-messages');
    }

    getQuotedMessageInInpuxBox() {
        return this.$('.mstr-ai-chatbot-QuotedMessage--isRenderedInInputBox');
    }

    getCloseQuotedMessageIcon() {
        return this.$('.mstr-ai-chatbot-QuotedMessage-closeButton');
    }

    getQuotedMessageCount() {
        return this.$$('.Message.right .mstr-ai-chatbot-QuotedMessage').length;
    }

    getQuotedMessageByIndex(Index) {
        return this.$$('.mstr-ai-chatbot-QuotedMessage')[Index];
    }

    getQuotedMessageByQueryIndex(Index) {
        return this.getQueryByIndex(Index).$('.mstr-ai-chatbot-QuotedMessage');
    }

    getFeedbackTabByName(name, index = 0) {
        return this.getAnswers()
            [index].$$('.mstr-ai-chatbot-ChatPanelFeedback-feedbackType')
            .filter(async (elem) => {
                const text = await elem.getText();
                return text === name;
            })[0];
    }

    getFeedbackSubmitButton(index = 0) {
        return this.getAnswers()[index].$('.mstr-ai-chatbot-ChatPanelFeedback-submit');
    }

    getFeedbackInputArea(index = 0) {
        return this.getAnswers()[index].$('.mstr-ai-chatbot-ChatPanelFeedback-input');
    }

    getFeedbackCloseButtonbyIndex(index = 0) {
        return this.getAnswers()[index].$('.mstr-ai-chatbot-ChatPanelFeedback-closeButton').$('.mstr-icons-lib-icon');
    }

    getFeedbackResultPanel(index = 0) {
        return this.getAnswers()[index].$('.mstr-ai-chatbot-ChatPanelFeedbackResults');
    }

    getLearningCheckingText() {
        return this.$('.headerTitle').getText();
    }

    getFeedbackResults() {
        return this.$('.mstr-ai-chatbot-ChatPanelFeedbackResults-header');
    }

    getLearningIcon() {
        return this.$('.learningIcon');
    }

    getPinIconByIndex(index) {
        return this.getChatAnswerbyIndex(index).$('.mstr-ai-chatbot-SnapshotButton-pin').$('.mstr-icons-lib-icon');
    }

    getUnpinIcon() {
        return this.$('.mstr-ai-chatbot-SnapshotButton-unpin');
    }

    getTime() {
        return this.$('.Time');
    }

    getTimeText() {
        return this.$('.Time').getText();
    }

    getSeeMoreLessBtn() {
        return this.$('.mstr-ai-chatbot-TruncatedText-showMoreLessButton');
    }

    getQueryByIndex(Index) {
        return this.getAnswerList().$$('.right')[Index];
    }

    getAnswersByIndex(Index) {
        return this.getAnswerList().$$('.left')[Index];
    }

    getAnswerTextByIndex(Index) {
        return this.getAnswersByIndex(Index).$(
            '.chat-bubble>.mstr-chatbot-markdown, .mstr-ai-chatbot-VisualizationBubbleV2-text .mstr-chatbot-markdown, .mstr-design-error-message-content'
        );
    }

    async getIndexByAnswerText(text) {
        const answers = await this.getAnswers();
        for (let index = answers.length - 1; index >= 0; index--) {
            const answerText = await this.getAnswersTextByIndex(index);
            if (answerText.includes(text)) {
                return index;
            }
        }
        return -1;
    }

    getErrorByIndex(index = 0) {
        return this.getAnswersByIndex(index).$('.mstr-design-error-message');
    }

    getShowErrorMessage(index = 0) {
        return this.getAnswersByIndex(index).$('.mstr-design-collapse-header__title');
    }

    async getErrorDetailedMessage(index = 0) {
        return this.getAnswersByIndex(index).$('.mstr-design-error-message-content__details-title').getText();
    }

    getVizByIndex(Index) {
        return this.getAnswersByIndex(Index).$('.mstr-ai-chatbot-VisualizationBubbleV2-viz2');
    }

    getGridByIndex(Index) {
        return this.getAnswersByIndex(Index).$('.mstr-ai-chatbot-VisualizationBubbleV2-Grid');
    }

    getChartByIndex(Index) {
        return this.getAnswersByIndex(Index).$('.mstr-ai-chatbot-VisualizationBubbleV2-ChartJS');
    }

    getMultipleGridsByIndex(Index) {
        return this.getAnswersByIndex(Index).$$('.mstr-ai-chatbot-VisualizationBubbleV2-Grid');
    }

    getMultipleChartsByIndex(Index) {
        return this.getAnswersByIndex(Index).$$('.mstr-ai-chatbot-VisualizationBubbleV2-ChartJS');
    }

    getInsightByIndex(Index) {
        return this.getAnswersByIndex(Index).$('.mstr-ai-chatbot-ChatBubbleInsight-markdown .mstr-chatbot-markdown');
    }

    getErrorMessageByIndex(Index = 0) {
        return this.getAnswersByIndex(Index).$('.mstr-design-error-message');
    }

    getSnapshotPanelContainer() {
        return this.$('.mstr-ai-chatbot-SnapshotsPanel');
    }

    getQueryMessageContentByIndex(Index) {
        return this.getQueryByIndex(Index).$('.Message-content');
    }

    getCopyToQueryBtnByIndex(Index) {
        return this.getQueryByIndex(Index).$('.mstr-icons-lib-icon');
    }

    getCopyToQueryBtnByIndexForAscTest(Index) {
        // Used for accessibility tests to check focus
        return this.getQueryByIndex(Index).$('.mstr-ai-chatbot-CopyToButton');
    }

    getQueryTextByIndex(Index) {
        return this.getQueryByIndex(Index).$('.Bubble').getText();
    }

    getAnswersTextByIndex(Index) {
        return this.getInnerText(this.getAnswersByIndex(Index).$('.Bubble'));
    }

    getSnapshotItems() {
        return this.$('.mstr-ai-chatbot-SnapshotsPanelContent-items');
    }

    getSnapshotList() {
        return this.getSnapshotItems().$$('.mstr-ai-chatbot-SnapshotCard');
    }

    getSnapshotDeleteConfirmationButton() {
        return this.$('.mstr-ai-chatbot-ConfirmationButton-confirm');
    }

    getDeleteSnapshotButton(Index) {
        return this.getSnapshotItems().$$('.mstr-ai-chatbot-DeleteSnapshotButton')[Index];
    }

    getTimeInSnapshot() {
        return this.$('.mstr-ai-chatbot-SnapshotCard-date');
    }

    getNotificationSaveButton() {
        return this.$('.mstrmojo-WebButton');
    }

    getVizInChat(index = 0) {
        return this.getMessageList().$$('.gm-container')[index];
    }

    getColorInBarChart(index = 0) {
        return this.getMessageList().$$('.gm-container')[index].$$('.gm-shape-bar')[0].getAttribute('style');
    }

    getSnapshotPanel() {
        return this.$('.mstr-ai-chatbot-SnapshotsPanelContent-items');
    }

    getVizInSnapshot(index = 0) {
        return this.getSnapshotPanel().$$('.gm-container')[index];
    }

    getColorInBarChartOfSnapshot(index = 0) {
        return this.getSnapshotPanel().$$('.gm-container')[index].$$('.gm-shape-bar')[0].getAttribute('style');
    }

    getLibraryIcon() {
        return this.$('.mstr-nav-icon.icon-library');
    }

    getLoadingIconInClearHistory() {
        return this.$('.mstr-ai-chatbot-ConfirmationDialog-spinner');
    }

    getResizeHandlerOfConfigurationPanel() {
        return this.$('[class*=mstr-ai-chatbot-EditingLayout-separator]');
    }

    getminResizeHandlerOfConfigurationPanel() {
        return this.$(
            '.mstr-ai-chatbot-ResizeHandler.mstr-ai-chatbot-ResizeHandler--min.mstr-ai-chatbot-EditingLayout-separator'
        );
    }

    getResizeHandlerOfSnapshotPanel() {
        return this.$('.mstr-ai-chatbot-ResizeHandler');
    }

    getConfigTabsList() {
        return this.$('.mstr-ai-chatbot-ConfigTabs-list');
    }

    getVizLoadingSpinner() {
        return this.$('.single-loading-spinner');
    }

    getRecommendationCopyIconByIndex(Index) {
        return this.getRecommendations().$$('.mstr-ai-chatbot-RecommendationItem-copyIcon')[Index];
    }

    getQuestionCopyIconByIndex(Index) {
        return this.getAnswerList().$$('.mstr-ai-chatbot-CopyToButton')[Index];
    }

    getSuggestedTopicsByIndex() {
        return this.getAnswerList().$('.mstr-ai-chatbot-ChatPanelTopics-item-layout');
    }

    getContentDiscoveryBotByIndex(Index) {
        return this.$$('.mstrd-DossierItemRow-linkOverlay')[Index];
    }

    getSnapshotAddedSuccessToast() {
        return this.$('.mstr-ai-chatbot-Toast-viewport');
    }

    getTextLinkToBot() {
        return this.$('.vi-doc-tf-value-text');
    }

    getCancelLoadingAnswerButton() {
        return this.$('.mstr-design-bot-button');
    }

    getBot2CancelLoadingAnswerButton() {
        return this.$('.mstr-chatbot-chat-input-inline__cancel-btn');
    }

    getMobileHamburgerButton() {
        return this.$('.mstrd-MobileHamburgerContainer');
    }

    getMobileSliderMenu() {
        return this.$('.mstrd-MobileSliderMenu-slider');
    }

    getSnapshotSideMenu() {
        return this.$('//span[text()="Snapshots"]');
    }

    getAskAboutSideMenu() {
        return this.$('//span[text()="Ask About"]');
    }

    getAskAboutBtn() {
        return this.$('.mstr-ai-chatbot-TitleBar-topics');
    }

    getAskAboutPanel() {
        return this.$('.mstr-ai-chatbot-TopicsPanel');
    }

    getAskAboutPanelSearchBox() {
        return this.$('.mstr-ai-chatbot-SearchBox');
    }

    getAskAboutPanelSearchBoxInput() {
        return this.$('input[data-feature-id="aibot-topics-panel-search-input-v2"]');
    }

    getAskAboutPanelObjectList() {
        return this.$('.mstr-ai-chatbot-TopicsPanelContent-objectsList');
    }

    getTopicsObjectNamesFromAskAboutPanel() {
        return this.getAskAboutPanelObjectList().$$('.mstr-ai-chatbot-TopicsObject-name');
    }

    getAskAboutPanelObjectByName(name) {
        return this.getAskAboutPanelObjectList().$(
            `//div[@class = 'mstr-ai-chatbot-TopicsObject-name' and text()='${name}']`
        );
    }

    getCollapsibleArrowForAskAboutObjectByName(name) {
        const askAboutObject = this.getAskAboutPanelObjectByName(name);
        return askAboutObject.$('preceding-sibling::div[@class="mstr-ai-chatbot-Collapsible-arrow"]');
    }

    getAskAboutPanelObjectAliasesByObjectName(name) {
        const askAboutObject = this.getAskAboutPanelObjectByName(name);
        return askAboutObject.$(
            './ancestor::div[contains(@class,"mstr-ai-chatbot-TopicsObject")]//div[@class="mstr-ai-chatbot-TopicsObject-aliases" or @class="mstr-ai-chatbot-TopicsObject-bot-alias"]'
        );
    }

    getAskAboutPanelObjectAlias(objectName, alias) {
        const aliases = this.getAskAboutPanelObjectAliasesByObjectName(objectName);
        return aliases.$(`./span[text()='${alias}']`);
    }

    getAskAboutPanelObjectByIndex(index) {
        return this.$$('.mstr-ai-chatbot-TopicsObject')[index];
    }

    getAskAboutPanelObjectSampleElementListByIndex(index) {
        return this.getAskAboutPanelObjectByIndex(index).$$('.mstr-ai-chatbot-TopicsObject-sample-list-element');
    }

    getStartConversationBtn() {
        return this.$('.mstr-ai-chatbot-TopicsObject-startConversationButton');
    }

    getClearHistorySideMenu() {
        return this.$('//span[text()="Clear History"]');
    }

    getDisabledClearHistorySideMenu() {
        return this.$(
            '//span[text()="Clear History"]//ancestor::div[contains(@class,"mstrd-MobileSliderOptionRow-menuOption mstrd-MobileSliderOptionRow-menuOption--hasThumbnail") and @aria-disabled="true"]'
        );
    }

    getMobileCloseSnapshotButton() {
        return this.$('.mstr-nav-icon.icon-backarrow_rsd.mstr-nav-icon-color');
    }

    getMobileCloseAskAboutButton() {
        return this.$('.mstr-nav-icon.icon-backarrow_rsd.mstr-nav-icon-color');
    }

    getMobileViewClearHistoryYesButton() {
        return this.$('.mstrd-Button.mstrd-Button--round.mstrd-Button--primary.mstrd-ConfirmationDialog-button');
    }

    getMobileViewClearHistoryNoButton() {
        return this.$('.mstrd-Button.mstrd-Button--clear.mstrd-Button--primary.mstrd-ConfirmationDialog-button');
    }

    getLinksSideMenu() {
        return this.$$('.mstrd-MobileSliderOptionRow-menuOption--hasMoreIcon').filter(async (elem) => {
            const elemText = await elem.$('.mstrd-MobileSliderOptionRow-menuTitle').getText();
            return elemText === 'Links';
        })[0];
    }

    getMobileViewLinksContainer() {
        return this.$$(
            '.mstrd-MobileSliderMenu-childrenContainer.mstrd-MobileSliderMenu-childrenContainer--optionsOnly.mstrd-MobileSliderMenu-childrenContainer--hasHeader.mstrd-MenuOptionContainer'
        )[1];
    }

    getMobileViewLinksItemsbyIndex(Index) {
        return this.getMobileViewLinksContainer().$$('.mstrd-MobileSliderOptionRow-menuOption')[Index];
    }

    getSeeMoreLessBtnSnapshotPanel() {
        return this.getSnapshotPanel().$('.mstr-ai-chatbot-TruncatedText-showMoreLessButton');
    }

    getCloseSnapshotAddedButton() {
        return this.$('.mstr-ai-chatbot-Toast-closeBtn');
    }

    getContentLoadingIcon() {
        return this.$('.mstr-ai-chatbot-LoadingIcon-content--visible');
    }

    getChatBotLoadingIcon() {
        return this.$('.mstr-ai-chatbot-Spinner.mstr-ai-chatbot-Spinner--grey');
    }

    getDisclaimer() {
        return this.$('.mstr-chatbot-chat-panel__footnote');
    }

    getDidYouMeanPanel() {
        return this.$('.mstr-ai-chatbot-DidYouMean');
    }

    getDidYouMeanPanelByIndex(index) {
        return this.getAnswersByIndex(index).$('.mstr-ai-chatbot-DidYouMean');
    }

    getDidYouMeanCloseButton() {
        return this.$('.mstr-ai-chatbot-DidYouMean-close-button');
    }

    getSmartSuggestion(Index = 0) {
        return this.$$('.mstr-ai-chatbot-SuggestionItem')[Index];
    }

    getEnabledSmartSuggestion() {
        return this.$(`.mstr-ai-chatbot-SuggestionItem[aria-disabled='false']`);
    }

    getSmartSuggestionText(Index = 0) {
        return this.getSmartSuggestion(Index).getText();
    }

    getSmartSuggestionCopyIcon() {
        return this.$('.mstr-ai-chatbot-SuggestionItem-copyIcon');
    }

    getSmartSuggestionLoadingBar() {
        return this.$('.mstr-ai-chatbot-LoadingSkeleton-text');
    }

    getSmartSuggestionShowMoreBtn(Index = 0) {
        return this.$$('.mstr-ai-chatbot-CompactTruncateText-moreButton')[Index];
    }

    getSmartSuggestionShowLessBtn(Index = 0) {
        return this.$$('.mstr-ai-chatbot-CompactTruncateText-lessButton')[Index];
    }

    getLink(text) {
        return this.$(`//a[text()='${text}']`);
    }

    getBotEditLayout() {
        return this.$('.mstr-ai-chatbot-EditingLayout-rightPanel');
    }

    getButtonByName(name) {
        return this.$$('.mstrmojo-Button-text ').filter(async (elem) => {
            const buttonName = await elem.getText();
            return buttonName.includes(name);
        })[0];
    }

    getBotConfigTabByName(name) {
        return this.$$('.mstr-ai-chatbot-ConfigTabs-trigger').filter(async (elem) => {
            const tabName = await elem.$('.mstr-ai-chatbot-OverflowText-container').getText();
            return tabName.includes(name);
        })[0];
    }

    getMessageScrollComponent() {
        return this.$('.infinite-scroll-component__outerdiv');
    }

    getSnapshotsLoadingIcon() {
        return this.$('.mstr-ai-chatbot-Spinner.mstr-ai-chatbot-Spinner--grey');
    }

    getNuggetTriggerIcon() {
        return this.$('.mstr-ai-chatbot-CIInterpretedAs-nugget-trigger');
    }

    getInterpretationLearning() {
        return this.$('.mstr-ai-chatbot-CINuggetsContent');
    }

    getLearningForgetButtonbyIndex(Index) {
        return this.$$('.forgetButton')[Index];
    }

    //get all the topic items in the chatpanel
    getTopicItems() {
        return this.$$('.mstr-chatbot-chat-panel__chat-container .mstr-ai-chatbot-ChatPanelTopicItem');
    }

    //get all the topic summary questions and text answers array in the chatpanel
    getTopicSummaryArray() {
        return this.$$('.mstr-chatbot-markdown');
    }

    getInsights() {
        return this.$$('.mstr-ai-chatbot-ChatBubbleInsight-markdown');
    }

    getAgGrids() {
        return this.$$('.mstr-ai-chatbot-VisualizationBubbleV2-Grid');
    }

    getAgGridHeaderCellByIndex(index) {
        return this.getAgGrids()[0].$$('.ag-header-cell-text')[index];
    }

    getAgGridHeaderCellByText(gridIndex, text) {
        return this.getAgGrids()[gridIndex].$(`.ag-header-cell[col-id="${text}"] .ag-header-cell-comp-wrapper`);
    }

    getAgGridHeaderMenuIcon(gridIndex, text) {
        return this.getAgGridHeaderCellByText(gridIndex, text).$('.ag-header-cell-menu-button');
    }

    getAgColumnMenu() {
        return this.$('.ag-column-menu');
    }

    getAgColumnMenuItemByName(name) {
        return this.getAgColumnMenu().$(
            `.//div[contains(@class,"ag-menu-option")]//span[contains(@class,"ag-menu-option-text") and normalize-space(text())="${name}"]`
        );
    }

    getSubmenuItemForPin(subAction) {
        return this.$(
            `//div[@aria-label="SubMenu"]//span[contains(@class,"ag-menu-option-text") and normalize-space(text())="${subAction}"]`
        );
    }
    getAgColumnPickdialog() {
        return this.$('.ag-dialog.ag-popup-child');
    }

    getCheckBoxWrapperInAgColumnPickerByName(name) {
        return this.getAgColumnPickdialog().$(
            `.//span[@class="ag-column-select-column-label" and normalize-space(text())="${name}"]/preceding::div[contains(@class,"ag-checkbox-input-wrapper")][1]`
        );
    }

    getCheckBoxInAgColumnPickerByName(name) {
        return this.getCheckBoxWrapperInAgColumnPickerByName(name).$('input[type="checkbox"]');
    }

    getAgColumnPickerCloseButton() {
        return this.getAgColumnPickdialog().$('.ag-panel-title-bar-button');
    }

    getVizBubble() {
        return this.$('.mstr-ai-chatbot-VisualizationBubbleV2-viz2');
    }

    getVizLoadingCurtain() {
        return this.$('.mstr-ai-chatbot-VisualizationBubbleV2-loading');
    }

    getUnstructuredDataIndicatorSectionByIndex(answerIndex = 0) {
        return this.getAnswers()[answerIndex].$('.mstr-ai-chatbot-UnstructuredDataIndicators');
    }

    getUnstructuredDataIndicator(answerIndex = 0, indicatorIndex = 0) {
        return this.getUnstructuredDataIndicatorSectionByIndex(answerIndex).$$(
            '.mstr-ai-chatbot-UnstructuredDataIndicators-indicator'
        )[indicatorIndex];
    }

    getUnstructuredDataIndicatorCount(answerIndex = 0) {
        return this.getUnstructuredDataIndicatorSectionByIndex(answerIndex).$$(
            '.mstr-ai-chatbot-UnstructuredDataIndicators-indicator'
        ).length;
    }

    getUnstructuredDataTooltip() {
        return this.$('.mstr-ai-chatbot-UnstructuredDataIndicators-tooltip-content');
    }

    getUnstructuredDataNoAccessWarningIcon(index = 0) {
        return this.$$('.mstr-ai-chatbot-unstructured-data-item-unstructured-data-warning')[index];
    }

    getUnstructuredDataTooltipDownloadButton() {
        return this.$('.mstr-ai-chatbot-UnstructuredDataIndicators-download-button');
    }

    getUnstructuredDataTooltipDownloadSpinner() {
        return this.$('.mstr-ai-chatbot-UnstructuredDataIndicators-spinner');
    }

    getAnswers() {
        return this.$$('.Message.left');
    }

    getInterpretedAs() {
        return this.$('.mstr-ai-chatbot-CIInterpretedAs-text');
    }

    getDownloadButton() {
        return this.$('[data-feature-id="aibot-chat-message-item-download-v2"]');
    }

    getExportToCsvButton() {
        return this.$('.mstr-ai-chatbot-ExportToCsvButton');
    }

    getExportToCsvButtonByAnswer(index) {
        return this.getAnswerBubbleButtonIconContainerbyIndex(index).$('.mstr-ai-chatbot-ExportToCsvButton');
    }

    getFollowUpBtnByAnswer(index) {
        return this.getAnswerBubbleButtonIconContainerbyIndex(index).$('.mstr-ai-chatbot-FollowUpButton');
    }

    getExportToExcelButton() {
        return this.$('.mstr-ai-chatbot-ExportToExcelButton');
    }

    getExportToExcelButtonByAnswer(index) {
        return this.getAnswerBubbleButtonIconContainerbyIndex(index).$('.mstr-ai-chatbot-ExportToExcelButton');
    }

    getInterpretationAdvancedOption() {
        return this.$('div[data-feature-id="mstr-interpreted-advanced-toggle-v2"]');
    }

    getAiDiagnosticsButtonByAnswerIndex(index) {
        return this.getAnswers()[index].$(
            '.mstr-ai-chatbot-DiagnosticsButton, .mstr-ai-chatbot-AnswerActions-diagnostics'
        );
    }

    getAiDiagnosticsDialogCopyIcon() {
        return this.$('.mstr-ai-chatbot-DiagnosticsCopyIcon');
    }

    getAiDiagnosticsDialogExportIcon() {
        return this.$('.mstr-ai-chatbot-DiagnosticsTab-btns-export');
    }

    getAiDiagnosticsDialogCloseIcon() {
        return this.$('.mstr-ai-chatbot-DiagnosticsCloseIcon');
    }

    getToBottomBtn() {
        return this.$('.message-back-bottom');
    }

    getDatasetUsedText() {
        return this.$(
            `(//div[contains(@class, 'mstr-ai-chatbot-CIInterpretedAs-dividing-line')])[last()]/preceding-sibling::span[last()]`
        ).getText();
    }

    getObjectUsedText() {
        return this.$(
            `(//div[contains(@class, 'mstr-ai-chatbot-CIInterpretedAs-dividing-line')])[last()]/following-sibling::span[1]`
        ).getText();
    }

    getBotTitle() {
        return this.$('.mstrd-DossierTitle-segment');
    }

    getInterpretationSwitchBtn(index) {
        return this.getAnswers()[index].$('.mstr-ai-chatbot-CIInterpretedAs-switch-button');
    }

    async isToBottomBtnDisplayed() {
        return await this.getToBottomBtn().isDisplayed();
    }

    async clickToBottom() {
        return this.click({ elem: this.getToBottomBtn() });
    }

    async hoverOnUnstructuredDataIndicator(answerIndex = 0, indicatorIndex = 0) {
        const unstructuredDataIndicator = this.getUnstructuredDataIndicator(answerIndex, indicatorIndex);
        if (!(await unstructuredDataIndicator.isDisplayed())) {
            return Promise.reject('Unstructured data indicator is not displayed.');
        }
        await this.scrollChatPanelToBottom();
        await this.hover({ elem: unstructuredDataIndicator });
        return this.sleep(1500); //wait for tooltip to static render
    }

    async hoverOnLatestAnswer() {
        const answers = await this.getAnswers();
        if (answers.length === 0) {
            return Promise.reject('No answer found.');
        }
        await this.scrollChatPanelToBottom();
        await this.hover({ elem: answers[answers.length - 1].$('.Bubble') });
        await this.waitForElementVisible(this.getAnswerBubbleButtonBarByIndex(answers.length - 1));
        return this.sleep(500); //wait for buttons to static render
    }

    async clickSnapshotUnpinButton() {
        await this.getUnpinIcon().click();
    }

    async clickDownloadButton() {
        await this.getDownloadButton().click();
    }

    async clickExportToCsvButton() {
        await this.getExportToCsvButton().click();
    }

    async clickExportToExcelButton() {
        await this.getExportToExcelButton().click();
    }

    async clickInterpretationAdvancedOption() {
        await this.click({ elem: this.getInterpretationAdvancedOption() });
    }

    async clickInterpretationSwitchBtn(index) {
        await this.click({ elem: this.getInterpretationSwitchBtn(index) });
    }

    async clickAiDiagnosticsButtonByAnswerIndex(index) {
        await this.getAiDiagnosticsButtonByAnswerIndex(index).click();
    }

    async clickAiDiagnosticsDialogCopyIcon() {
        await this.getAiDiagnosticsDialogCopyIcon().click();
    }

    async clickAiDiagnosticsDialogExportIcon() {
        await this.getAiDiagnosticsDialogExportIcon().click();
    }

    async clickAiDiagnosticsDialogCloseIcon() {
        await this.getAiDiagnosticsDialogCloseIcon().click();
    }

    async isSnapshotButtonUnpinDisplayed() {
        return await this.getUnpinIcon().isDisplayed();
    }

    async isSnapshotButtonDisplayed() {
        return await this.getPinIconByIndex().isDisplayed();
    }

    //locate a dataset object button in the ask about panel
    GetObjectButtonInAskAboutPanel(objectname) {
        return this.$(
            `//div[@class='mstr-ai-chatbot-TopicsObject-name' and text()='${objectname}']/parent::button[@class='mstr-ai-chatbot-Collapsible-trigger']`
        );
    }

    //locate the start conversation button for a dataset object in the ask about panel
    GetStartConversionButtonInAskAboutPanel(objectname) {
        return this.$(
            `//div[@class='mstr-ai-chatbot-TopicsObject-name' and text()='${objectname}']/parent::button/following-sibling::div[1]/div`
        );
    }

    //locate the dataset object recommendations in the chatpanel
    getStartConversationRecommendation() {
        return this.$('.mstr-chatbot-chat-panel__input-container .mstr-ai-chatbot-RecommendationItem');
    }

    //locate the dataset object recommendations array in the chatpanel
    getStartConversationRecommendationItemArray() {
        return this.$$(
            '//div[@class="mstr-ai-chatbot-Recommendations-content"]/div[contains(@class, "mstr-ai-chatbot-Clickable") and contains(@class, "mstr-ai-chatbot-RecommendationItem")]'
        );
    }

    getObjectCountInAskAboutPanel() {
        return this.$$('.mstr-ai-chatbot-TopicsObject-name').length;
    }

    getToolBarMoreButtonByIndex(Index) {
        return this.getAnswers()[Index].$('.mstr-ai-chatbot-MoreButton');
    }

    getToolBarCopyAsImageIcon() {
        return this.$('.mstr-ai-chatbot-CopyButton');
    }

    getToolBarDownLoadIcon() {
        return this.$('.mstr-ai-chatbot-DownloadButton');
    }

    getToolBarMoreMenu() {
        return this.$('.more-menu-menu-container');
    }

    getQuotedMessageCloseButton() {
        return this.$('.mstr-ai-chatbot-QuotedMessage-closeButton');
    }

    getFollowUpError() {
        return this.$('.mstr-chatbot-chat-panel__empty-followup');
    }

    getFollowUpErrors() {
        return this.$$('.mstr-chatbot-chat-panel__empty-followup');
    }

    async getLatestFollowUpError() {
        const errors = await this.getFollowUpErrors();
        console.log(`Found ${errors.length} follow-up errors.`);
        return errors[errors.length - 1];
    }

    async getFollowUpErrorText() {
        return (await this.getLatestFollowUpError()).getText();
    }

    getNuggetsPopoverContentDatasetTitle() {
        return this.$('.mstr-ai-chatbot-CINuggetsPopoverContent-nugget-right-title');
    }

    getNuggetsPopoverContentDefinition() {
        return this.$('.mstr-ai-chatbot-CINuggetsPopoverContent-nugget-right .mstr-ai-chatbot-TruncatedText-content');
    }

    getEditAppearanceButton() {
        return this.$('.mstr-icons-lib-icon mstr-ai-chatbot-ConfigTabs-appearance');
    }

    getNuggetsPopoverContent() {
        return this.$$(
            `//div[contains(@class, 'mstr-ai-chatbot-CINuggetsPopoverContent-content')]//div[contains(@class, 'mstr-ai-chatbot-TruncatedText-content')]`
        );
    }

    getSeeMoreSeeLessButton() {
        return this.$(`//button[contains(@class, 'mstr-ai-chatbot-TruncatedText-showMoreLessButton')]`);
    }

    getRectsFromBarChart() {
        return this.$$(`//*[name()='rect' and contains(@class, 'gm-shape-bar')]`);
    }

    getTableRowNameFromTooltip() {
        return this.$$(
            `//div[contains(@class, 'mstrmojo-Box vis-tooltip vis-tooltip-gm')]//td[contains(@class, 'vis-tooltip-name vis-tooltip-td')]`
        );
    }

    getTableRowValueFromTooltip() {
        return this.$$(
            `//div[contains(@class, 'mstrmojo-Box vis-tooltip vis-tooltip-gm')]//td[contains(@class, 'vis-tooltip-value vis-tooltip-td')]`
        );
    }

    getNuggetContent() {
        return this.$('.mstr-ai-chatbot-CINuggetsPopoverContent-content');
    }

    getLearningIndicator(answerIndex = 0) {
        return this.getChatAnswerbyIndex(answerIndex).$('.mstr-ai-chatbot-AnswerBubbleLearningBadges');
    }

    getLearningIndicatorDialog() {
        return this.$('.mstr-ai-chatbot-AnswerBubbleLearningBadges-popover');
    }

    getLearningIndicatorHelpLink() {
        return this.$('.mstr-ai-chatbot-AnswerBubbleLearningBadges-help-link');
    }

    getLearningManagerIcon(Index = 0) {
        return this.$$('.mstr-ai-chatbot-CINuggetsContent-header-right')[Index];
    }

    getManageLearningOption() {
        return this.$('[data-feature-id="account-manage-my-learning"]');
    }

    getLearningManagerWindow() {
        return this.$('.mstr-ai-chatbot-CentralLearningManagerContent-main-dialog');
    }

    getLearningManagerNoDataWindow() {
        return this.$('.mstr-ai-chatbot-CLMNoData');
    }

    getLearningManagerContent(Index = 0) {
        return this.$$('.mstr-ai-chatbot-CLMHighlighter')[Index];
    }

    getAnswerLearning(answerIndex = 0) {
        return this.getChatAnswerbyIndex(answerIndex).$('.mstr-ai-chatbot-CINuggetsContent');
    }

    getAnswerLearningContents(answerIndex = 0, learningIndex = 0) {
        return this.getAnswerLearning(answerIndex).$$('.mstr-ai-chatbot-CINuggetsContent-nugget')[learningIndex];
    }

    getForgottenLearningContent(learningIndex = 0) {
        return this.$$('.mstr-ai-chatbot-CINuggetsContent-nugget-right-content-string--forgotten')[learningIndex];
    }

    getAnswerLearningText(answerIndex = 0, learningIndex = 0) {
        return this.getAnswerLearningContents(answerIndex, learningIndex)
            .$('.mstr-ai-chatbot-CINuggetsContent-nugget-right-content-string')
            .getText();
    }

    getLearningForgetBtn() {
        return this.$('.mstr-ai-chatbot-CINuggetsContent-nugget-right-content-forget--visible');
    }

    getConfirmationBtnOnForget(text) {
        return this.$$('.mstr-ai-chatbot-CINuggetsContent-nugget-popover-buttons .mstr-ai-chatbot-Button').filter(
            async (el) => {
                return (await el.getText()) === text;
            }
        )[0];
    }

    getCheckBox(Index = 0) {
        return this.$$('button.mstr-ai-chatbot-Checkbox-box')[Index];
    }

    getSwitch() {
        return this.$('.mstr-ai-chatbot-Switch-root');
    }

    //Forget user learning in interpretation
    getForgetUserLearningLoading() {
        return this.$('.mstr-ai-chatbot-Spinner-blade');
    }

    async getForgetUserLearningLoadingColor() {
        const property = await this.getForgetUserLearningLoading().getCSSProperty('background-color');
        return property.value; // Make sure to return just the value
    }

    getDialogCloseButton() {
        return this.$('.mstr-ai-chatbot-Dialog-closeButton');
    }

    getLearningForgottenIcon(answerIndex = 0, learningIndex = 0) {
        return this.getAnswerLearningContents(answerIndex, learningIndex).$(
            '.mstr-ai-chatbot-CINuggetsContent-nugget-right-content-forgotten'
        );
    }

    getForgottenTooltip() {
        return this.$('.mstr-ai-chatbot-CINuggetsContent-nugget-right-content-tooltip');
    }

    getInsightsContainer() {
        return this.$$('.mstr-ai-chatbot-VisualizationBubbleV2-insight');
    }

    getReportSection(index = 0) {
        return this.getAnswers()[index].$('.mstr-ai-chatbot-ReportSection');
    }

    getReportReadyText(index = 0) {
        return this.getReportSection(index).$('.mstr-ai-chatbot-ReportSection-ready-text').getText();
    }

    getReportDownloadButton(index = 0) {
        return this.getReportSection(index).$('.mstr-ai-chatbot-ReportSection-download-button');
    }

    async isInterpretedAsDisplayed() {
        return await this.getInterpretedAs().isDisplayed();
    }

    //Hover button
    async hoverOnBotLogo() {
        return this.hover({ elem: this.getTitleBarBotLogo() });
    }

    async hoverOnBotName() {
        return this.hover({ elem: this.getTitleBarBotName() });
    }

    async hoverOnLinkByIndex(index) {
        await this.hover({ elem: this.getTitleBarExternalLinkItemsByIndex(index) });
    }

    async hoverOnLinksPopoverBtn() {
        await this.hover({ elem: this.getLinksPopoverButton() });
    }

    async hoverOnLinksPopoverItemByIndex(Index) {
        await this.hover({ elem: this.getLinksPopoverItemsbyIndex(Index) });
    }

    async hoverOnClearHistoryBtn() {
        await this.hover({ elem: this.getClearHistoryButton() });
    }

    async hoverOnWelcomePageBotIcon() {
        await this.hover({ elem: this.getWelcomePageBotIcon() });
    }

    async hoverOnWelcomePageTitle() {
        await this.hover({ elem: this.getWelcomePageTitle() });
    }

    async hoverOnWelcomePageMessage() {
        await this.hover({ elem: this.getWelcomePageMessage() });
    }

    async hoverOnRecommendationByIndex(Index) {
        await this.hover({ elem: this.getRecommendationByIndex(Index) });
    }

    async hoverOnInputBox() {
        await this.hover({ elem: this.getInputBox() });
    }

    async hoverOnSendBtn() {
        await this.hover({ elem: this.getSendIcon() });
    }

    async hoverOnTopicsBtn() {
        await this.hover({ elem: this.getTopicsIcon() });
    }

    async hoverOnSeeMoreLessBtn() {
        await this.hover({ elem: this.getSeeMoreLessBtn() });
    }

    async hoverOnHistoryQuestion(index) {
        await this.hover({ elem: this.getQueryByIndex(index) });
    }

    async hoverOnCopyToQueryIcon() {
        await this.hover({ elem: this.getCopyToQueryBtnByIndex(0) });
    }

    async hoverOnHistoryAnswer(index) {
        await this.hover({ elem: this.getAnswerbyIndex(index) });
    }

    async hoverOnChatAnswer(index) {
        await this.hover({ elem: this.getChatAnswerbyIndex(index) });
    }

    async hoverOnRecommendationExpandStateBtn() {
        await this.hover({ elem: this.getRecommendationExpandStateBtn() });
    }

    async hoverOnRecommendationRefreshBtn() {
        await this.hover({ elem: this.getRecommendationRefreshIcon() });
    }

    async hoverOnInterpretationBtn(index) {
        return this.hover({ elem: this.getInterpretationIconbyIndex(index) });
    }

    async hoverOnInterpretationCopyToQueryBtn() {
        return this.hover({ elem: this.getInterpretationCopyToQueryIcon() });
    }

    async hoverOnInterpretationCopyLLMInstructionsBtn() {
        return this.hover({ elem: this.getInterpretationCopyLLMInstructionsIcon() });
    }

    async hoverOnDidYouMeanCloseButton() {
        return this.hover({ elem: this.getDidYouMeanCloseButton() });
    }

    async hoverOnSmartSuggestionCopyIcon() {
        return this.hover({ elem: this.getSmartSuggestionCopyIcon() });
    }

    async hoverOnSmartSuggestion(index) {
        return this.hover({ elem: this.getSmartSuggestion(index) });
    }

    async hoverOnToolBarMoreButtonByIndex(index) {
        return this.hover({ elem: this.getToolBarMoreButtonByIndex(index) });
    }

    async hoverOnFollowUpIconByIndex(index) {
        return this.hover({ elem: this.getFollowUpIconbyIndex(index) });
    }

    async hoverOnRectFromBarChart() {
        return this.hover({ elem: this.getRectsFromBarChart()[0] });
    }

    //Click button
    async clickSaveButton() {
        return this.click({ elem: this.getSaveButton() });
    }

    async clickCloseButton() {
        return this.click({ elem: this.getCloseButton() });
    }

    async clickBotName() {
        return this.click({ elem: this.getTitleBarBotName() });
    }

    async clickClearHistoryButton() {
        return this.click({ elem: this.getClearHistoryButton() });
    }

    async isTitleBarDisplayed() {
        return await this.getTitleBar().isDisplayed();
    }

    async clickClearHistoryYesButton() {
        if (await this.getClearHistoryYesButton().isDisplayed()) {
            return this.click({ elem: this.getClearHistoryYesButton() });
        }
    }

    async clickClearHistoryNoButton() {
        return this.click({ elem: this.getClearHistoryNoButton() });
    }

    async clickNewChatButton() {
        await this.click({ elem: this.getNewChatButton() });
        await this.waitForElementVisible(this.getWelcomePage());
        return this.waitForRecommendationSkeletonDisappear();
    }

    async clickHistoryChatButton() {
        await this.click({ elem: this.getHistoryPanelButton() });
        return this.sleep(1000); // Time buffer for animation
    }

    async clickOpenSnapshotPanelButton() {
        return this.click({ elem: this.getOpenSnapshotPanelButton() });
    }

    async openSnapshot() {
        var isClosed = await this.isSnapshotPanelClosed();
        if (isClosed) {
            await this.click({ elem: this.getOpenSnapshotPanelButton() });
            return this.sleep(1000); // Time buffer for animation
        }
    }

    async clickOpenSnapshotPanelButtonInResponsive() {
        return this.click({ elem: this.getOpenSnapshotPanelButton() });
    }

    async clickCloseSnapshotButton() {
        return this.click({ elem: this.getCloseSnapshotButton() });
    }

    async closeSnapshot() {
        var isClosed = await this.isSnapshotPanelClosed();
        if (!isClosed) {
            await this.click({ elem: this.getCloseSnapshotButton() });
        }
    }

    async clickCloseSnapshotButtonInResponsive() {
        return this.click({ elem: this.getCloseSnapshotButton() });
    }

    async clickRecommendationByContents(recommendation) {
        await this.click({ elem: this.getRecommendationByContents(recommendation) });
    }

    async clickRecommendationByIndex(Index) {
        await this.click({ elem: this.getRecommendationByIndex(Index) });
    }

    async clickTopicByIndex(Index) {
        await this.click({ elem: this.getTopicByIndex(Index) });
    }

    async clickTopicByTitle(title) {
        await this.click({ elem: this.getTopicSuggestionByTitle(title) });
        await this.waitForElementStaleness(this.getVizLoadingSpinner(), {
            timeout: 300 * 1000, // extend time out to 5min
            msg: 'Answer loading takes too long.',
        });
    }

    // Click a topic item, and cancel it while it's waiting
    async clickTopicByTitleAnWaitFordCancel(title) {
        await this.click({ elem: this.getTopicSuggestionByTitle(title) });
        await this.waitForElementVisible(this.getCancelLoadingAnswerButton());
    }

    async clickChatPanelTopicByIndex(Index) {
        await this.click({ elem: this.getChatPanelTopicItemByIndex(Index) });
    }

    async clickSeeMoreLessBtn() {
        await this.click({ elem: this.getSeeMoreLessBtn() });
    }

    async clickRefreshRecommendationIcon() {
        await this.click({ elem: this.getRecommendationRefreshIcon() });
    }

    async clickExpandRecommendation() {
        var isExpandState = await this.getRecommendationExpandStateBtn().isDisplayed();
        if (!isExpandState) {
            await this.click({ elem: this.getRecommendationFoldStateBtn() });
        }
    }

    async clickFoldRecommendation() {
        var isExpandState = await this.getRecommendationExpandStateBtn().isDisplayed();
        if (isExpandState) {
            await this.click({ elem: this.getRecommendationExpandStateBtn() });
        }
    }

    async clickDeleteSnapShotButton(Index) {
        await this.click({ elem: this.getDeleteSnapshotButton(Index) });
    }

    async clickNotificationSaveButton() {
        await this.click({ elem: this.getNotificationSaveButton() });
    }

    async clickSnapShotDeleteComfirmationButton() {
        await this.click({ elem: this.getSnapshotDeleteConfirmationButton() });
    }

    async clickLinksPopoverButton() {
        await this.click({ elem: this.getLinksPopoverButton() });
    }

    async clickLinksPopoverItemsbyIndex(Index) {
        await this.click({ elem: this.getLinksPopoverItemsbyIndex(Index) });
    }

    async clickCloseQuotedMessageIcon() {
        await this.click({ elem: this.getCloseQuotedMessageIcon() });
    }

    async clickSendBtn() {
        await this.click({ elem: this.getSendIcon() });
    }

    async clickTopicsBtn() {
        await this.click({ elem: this.getTopicsIcon() });
    }

    async clickContentDiscoveryBotByIndex(Index) {
        await this.click({ elem: this.getContentDiscoveryBotByIndex(Index) });
    }

    async clickTextLinkToBot() {
        await this.click({ elem: this.getTextLinkToBot() });
    }

    async clickDidYouMeanCloseButton() {
        await this.click({ elem: this.getDidYouMeanCloseButton() });
    }

    async clickSmartSuggestion(index) {
        await this.click({ elem: this.getSmartSuggestion(index) });
    }

    async clickSmartSuggestionCopyIcon() {
        await this.click({ elem: this.getSmartSuggestionCopyIcon() });
    }

    async clickSmartSuggestionShowMoreBtn(Index = 0) {
        await this.click({ elem: this.getSmartSuggestionShowMoreBtn(Index) });
    }

    async clickSmartSuggestionShowLessBtn(Index = 0) {
        await this.click({ elem: this.getSmartSuggestionShowLessBtn(Index) });
    }

    async clickThumbDownButtonbyIndex(Index) {
        await this.click({ elem: this.getThumbDownIconbyIndex(Index) });
    }

    async clickThumbDownClickedButtonbyIndex(Index) {
        await this.click({ elem: this.getThumbDownClickedIconbyIndex(Index) });
    }

    async clickFeedbackTabByName(name, index = 0) {
        await this.click({ elem: this.getFeedbackTabByName(name, index) });
    }

    async clickFeedbackSubmitButton(index = 0) {
        await this.click({ elem: this.getFeedbackSubmitButton(index) });
    }

    async clickFeedbackCloseButtonbyIndex(index = 0) {
        await this.click({ elem: this.getFeedbackCloseButtonbyIndex(index) });
    }

    async clickLink(text) {
        await this.click({ elem: this.getLink(text) });
    }

    async clickLearningForgetButtonbyIndex(Index) {
        await this.click({ elem: this.getLearningForgetButtonbyIndex(Index) });
    }
    async clickNuggetTriggerIcon() {
        await this.click({ elem: this.getNuggetTriggerIcon() });
    }

    async clickInterpretationReloadButton() {
        await this.click({ elem: this.getInterpretationReloadButton() });
    }

    async getInterpretationText() {
        return (await this.$('.mstr-ai-chatbot-CIComponents-header-right')).getAttribute('data-clipboard-text');
    }

    async clickToolBarMoreButtonByIndex(Index) {
        await this.click({ elem: this.getToolBarMoreButtonByIndex(Index) });
    }

    async clickToolBarCopyAsImageIcon() {
        await this.click({ elem: this.getToolBarCopyAsImageIcon() });
    }

    async clickToolBarDownloadIcon() {
        await this.click({ elem: this.getToolBarDownLoadIcon() });
    }

    async clickFollowUpIconbyIndex(Index) {
        await this.click({ elem: this.getFollowUpIconbyIndex(Index) });
    }

    async followUpByIndex(index) {
        await scrollIntoView(this.getAnswerBubbleButtonBarByIndex(index));
        // Hover is not able to trigger the follow-up icon sometines, so we click the answer to bring back the focus
        await this.click({ elem: this.getAnswers()[index] });
        await this.hover({ elem: this.getAnswerBubbleButtonBarByIndex(index) });
        await this.sleep(500);
        if (
            !(await this.getFollowUpIconbyIndex(index).isDisplayed()) &&
            (await this.getToolBarMoreButtonByIndex(index).isDisplayed())
        ) {
            await this.clickToolBarMoreButtonByIndex(index);
        }
        await this.clickFollowUpIconbyIndex(index);
    }

    async clickQuotedMessageCloseButton() {
        await this.click({ elem: this.getQuotedMessageCloseButton() });
        await this.waitForElementInvisible(this.getQuotedMessageInInpuxBox());
    }

    async clickQuotedMessageButtonByIndex(Index) {
        await this.click({ elem: this.getQuotedMessageByIndex(Index) });
    }

    async clickFollowUpError() {
        await this.click({ elem: this.getFollowUpError() });
    }

    async clickDownloadPDFReport(index = 0) {
        await this.click({ elem: this.getReportDownloadButton(index) });
    }

    async clickSeeMoreSeeLessButton() {
        return this.click({ elem: this.getSeeMoreSeeLessButton() });
    }

    async clickEditAppearanceButton() {
        return this.click({ elem: this.getEditAppearanceButton() });
    }

    async clickLearningIndicator() {
        return this.click({ elem: this.getLearningIndicator() });
    }

    async openManageLearning() {
        await this.click({ elem: this.getManageLearningOption() });
        await this.waitForElementVisible(this.getLearningManagerWindow());
    }

    async clickLearningManager(Index = 0) {
        return this.click({ elem: this.getLearningManagerIcon(Index) });
    }

    async clickCheckBox(Index = 0) {
        return this.click({ elem: this.getCheckBox(Index) });
    }

    async clickSwitch() {
        return this.click({ elem: this.getSwitch() });
    }

    async clickUnstructuredDataDownloadButton() {
        return this.click({ elem: this.getUnstructuredDataTooltipDownloadButton() });
    }

    async waitForAnswerLoading() {
        await this.waitForElementStaleness(this.getBubbleLoadingIcon(), {
            timeout: this.DEFAULT_LOADING_TIMEOUT,
            msg: 'Answer loading takes too long.',
        });
        await this.waitForAnswerSettled();
        return this.sleep(1000); // Time buffer for animation
    }

    async waitForTopicAnswerLoading() {
        //by default, chose topic will back 3 answers
        for (let i = 0; i < 3; i++) {
            await this.waitForElementStaleness(this.getBubbleLoadingIcon(), {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                msg: 'Answer loading takes too long.',
            });
            return this.sleep(1000); // Time buffer for animation
        }
    }

    async waitForInterpretationLoading() {
        await this.waitForElementStaleness(this.getInterpretationLoadingSpinner(), {
            timeout: this.DEFAULT_LOADING_TIMEOUT,
            msg: 'Interpretation loading takes too long.',
        });
        return this.sleep(1000); // Time buffer for animation
    }

    async waitForExportComplete() {
        await this.waitForElementStaleness(this.getChatBotLoadingIcon(), {
            timeout: this.DEFAULT_LOADING_TIMEOUT,
            msg: 'Exporting takes too long.',
        });
        return this.sleep(2000); // Time buffer for animation
    }

    async waitForForgetUserLearningLoading() {
        await this.waitForElementStaleness(this.getForgetUserLearningLoading(), {
            timeout: this.DEFAULT_LOADING_TIMEOUT,
            msg: 'Forget user learning loading takes too long.',
        });
        return this.sleep(1000); // Time buffer for animation
    }

    async waitForCheckLearningLoading() {
        await this.waitForElementStaleness(this.getThumbDownLoadingSpinner(), {
            timeout: this.DEFAULT_LOADING_TIMEOUT,
            msg: 'Thumb down loading takes too long.',
        });
        return this.sleep(1000); // Time buffer for animation
    }

    async openRecommendationPanel() {
        await this.click({ elem: this.getRecommendationPanelIcon() });
        await this.clickExpandRecommendation();
        await this.waitForElementVisible(this.getRecommendations());
        await this.waitForElementStaleness(this.getRecommendataionSugestionSkeletonsByIndex(0));
        await this.sleep(200); // Time buffer for animation
    }

    async waitForRecommendationSkeletonDisappear() {
        await this.waitForCurtainDisappear();
        await this.waitForElementStaleness(this.getRecommendataionSugestionSkeletonsByIndex(0));
    }

    async waitForRecommendationLoading() {
        await this.waitForRecommendationSkeletonDisappear();
        await this.waitForElementVisible(this.getRecommendations());
        await this.waitForElementStaleness(this.getRecommendataionSugestionSkeletonsByIndex(0));
    }

    async enableResearch() {
        if (!(await this.isResearchEnabled())) {
            await this.click({ elem: this.getResearchIcon() });
            await this.sleep(1000); // Time buffer to take effect
        }
    }

    async disableResearch() {
        if (await this.isResearchEnabled()) {
            await this.click({ elem: this.getResearchIcon() });
            await this.sleep(1000); // Time buffer to take effect
        }
    }

    async enableWebSearch() {
        if (!(await this.isWebSearchEnabled())) {
            await this.click({ elem: this.getWebSearchIcon() });
            await this.sleep(500); // Time buffer to take effect
        }
    }

    async disableWebSearch() {
        if (await this.isWebSearchEnabled()) {
            await this.click({ elem: this.getWebSearchIcon() });
            await this.sleep(500); // Time buffer to take effect
        }
    }

    async clearInputbox() {
        await this.click({ elem: this.getInputBox() });
        await browser.keys('Home');
        await browser.keys(['Shift', 'End']);
        await browser.keys('Delete');
    }

    async deleteByTimes(times = 1) {
        for (let i = 0; i < times; i++) {
            await this.delete();
        }
    }

    async waitForAnswerSettled(timeout = this.DEFAULT_LOADING_TIMEOUT, interval = 1000) {
        const answers = await this.getAnswers();
        if (answers.length > 0) {
            // get latest answer element
            const elem = answers[answers.length - 1];
            // wait text render until it settles
            let oldText = '';
            let settled = false;
            const start = Date.now();

            while (Date.now() - start < timeout) {
                const newText = await elem.getText();

                if (newText === oldText) {
                    // sometimes streaming is loaded slowly, we need to double check
                    await browser.pause(interval);
                    if (newText === oldText) {
                        settled = true;
                        console.log(`Answer is loaded completely.`);
                        break;
                    }
                }
                console.log(`Waiting for answer to settle...`);
                oldText = newText;
                await browser.pause(interval); // wait for a while before checking again
            }

            if (!settled) {
                throw new Error(`Answer didn't load within the timeout of ${timeout}ms.`);
            }
        }
    }

    async waitForInsightsSettled(timeout = this.DEFAULT_LOADING_TIMEOUT, interval = 1000) {
        const insights = await this.getInsightsContainer();
        if (insights.length > 0) {
            // get latest insight element
            const elem = insights[insights.length - 1];
            // wait text render until it settles
            let oldText = '';
            let settled = false;
            const start = Date.now();

            while (Date.now() - start < timeout) {
                const newText = await elem.getText();

                if (newText === oldText) {
                    settled = true;
                    console.log(`Insights is loaded completely.`);
                    break;
                }
                console.log(`Waiting for insight text to settle...`);
                oldText = newText;
                await browser.pause(interval); // wait for a while before checking again
            }

            if (!settled) {
                throw new Error(`Insight didn't load within the timeout of ${timeout}ms.`);
            }
        }
    }

    async waitForUnstructuredDataTooltipSpinnerDisappear() {
        await this.waitForElementStaleness(this.getUnstructuredDataTooltipDownloadSpinner(), {
            timeout: this.DEFAULT_LOADING_TIMEOUT,
            msg: 'Unstructured data tooltip spinner takes too long.',
        });
        return this.sleep(1000); // Time buffer for animation
    }

    async typeInChatBox(text) {
        await this.click({ elem: this.getInputBox() });
        await this.clearInputbox();
        await this.typeKeyboard(text);
        return this.sleep(1000);
    }

    async askQuestion(question, waitViz = false, options = { timeout: this.DEFAULT_LOADING_TIMEOUT }) {
        await this.waitForElementClickable(this.getInputBox());
        await this.getInputBox().addValue(question);
        await this.click({ elem: this.getSendIcon() });
        await this.waitForElementStaleness(this.getVizLoadingSpinner(), { timeout: options.timeout });
        if (waitViz) {
            await this.waitForElementStaleness(this.getVizLoadingCurtain());
            await this.waitForElementVisible(this.getVizBubble(), { timeout: options.timeout });
        }
        await this.waitForAnswerSettled();
        await browser.pause(1000);
    }

    async askQuestionNoWaitViz(question) {
        await this.waitForElementClickable(this.getInputBox());
        await this.getInputBox().addValue(question);
        await browser.pause(1000);
        await this.click({ elem: this.getSendIcon() });
        // Bot answers and insights are now streaming.
        await this.waitForAnswerLoading();
        // Waiting for the "new chat" icon to be enabled ensures the entire response has finished rendering.
        await this.waitForElementStaleness(this.getDisabledNewChatButton(), {
            timeout: 120 * 1000, // extend time out to 2min
            msg: 'Answer loading takes too long.',
        });
    }

    async askQuestionAndSend(question) {
        await this.waitForElementClickable(this.getInputBox());
        await this.getInputBox().addValue(question);
        await browser.pause(1000);
        await this.click({ elem: this.getSendIcon() });
    }

    async inputQuestionNotSend(question) {
        await this.waitForElementClickable(this.getInputBox());
        await this.getInputBox().addValue(question);
        await browser.pause(1000);
    }

    async askQuestionInTeams(question) {
        await this.waitForElementClickable(this.getInputBoxInTeams());
        await this.getInputBoxInTeams().addValue(question);
        await this.click({ elem: this.getSendIconInTeams() });
        await this.waitForElementStaleness(this.getVizLoadingSpinner());
        await this.closeDidYouMean();
    }

    async askQuestionByPaste(question) {
        await this.waitForElementClickable(this.getInputBox());
        await this.setTextToClipboard(question);
        await this.getInputBox().click();
        await this.paste();
        await this.click({ elem: this.getSendIcon() });
        await this.waitForElementStaleness(this.getBubbleLoadingIcon(), {
            timeout: 120 * 1000, // extend time out to 2min
            msg: 'Answer loading takes too long.',
        });
    }

    async askQuestionByPasteWithoutSending(question) {
        await this.waitForElementClickable(this.getInputBox());
        await this.setTextToClipboard(question);
        await this.getInputBox().click();
        await this.paste();
    }

    async clickSendIcon() {
        await this.click({ elem: this.getSendIcon() });
    }

    async clickCancelLoadingAnswerButton() {
        await this.click({ elem: this.getCancelLoadingAnswerButton() });
    }

    async clickBot2CancelLoadingAnswerButton() {
        await this.click({ elem: this.getBot2CancelLoadingAnswerButton() });
    }

    async dismissFocus() {
        return this.click({ elem: this.getBotTitle() });
    }

    async openBotClearHistoryAndAskQuestion({
        projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        appId,
        botId,
        question,
    }) {
        await this.libraryPage.openBotById({ projectId: projectId, appId: appId, botId: botId });
        await this.waitForElementClickable(this.getInputBox());
        await this.clearHistory();
        await this.waitForElementStaleness(this.getLoadingIconInClearHistory());
        await this.askQuestion(question);
    }

    async clearHistoryAndAskQuestion(question) {
        await this.waitForElementClickable(this.getInputBox());
        await this.clearHistory();
        await this.waitForElementStaleness(this.getLoadingIconInClearHistory());
        await this.waitForElementVisible(this.getWelcomePageBotIcon());
        await this.askQuestion(question);
    }

    async openBotAndAskQuestion(bot, question) {
        await this.libraryPage.openDossier(bot);
        await this.askQuestion(question);
    }

    async openBotAndOpenSnapshot({ botId: botId }) {
        await this.libraryPage.openBotByIdAndWait({ botId: botId });
        if (await this.isSnapshotPanelClosed()) {
            await this.clickOpenSnapshotPanelButton();
        }
    }

    async scrollChatPanelTo(position) {
        await this.click({ elem: this.getTitleBarBotName() });
        return scrollElement(this.getMessageList(), position);
    }

    async scrollChatPanelToTop() {
        await this.click({ elem: this.getTitleBarBotName() });
        return scrollIntoView(this.getMessageScrollComponent());
    }

    async scrollChatPanelToBottom() {
        await this.click({ elem: this.getTitleBarBotName() });
        return scrollElementToBottom(this.getMessageList());
    }

    async scrollChatPanelContainerToBottom() {
        return scrollElementToBottom(this.getChatPanelContainer());
    }

    async scrollSnapshotPanelTo(position) {
        await this.click({ elem: this.getTitleBarBotName() });
        return scrollElement(this.getSnapshotPanel(), position);
    }

    async scrollSnapshotPanelToTop() {
        await this.click({ elem: this.getTitleBarBotName() });
        return scrollElementToTop(this.getSnapshotPanel());
    }

    async scrollSnapshotPanelToBottom() {
        await this.click({ elem: this.getTitleBarBotName() });
        return scrollElementToBottom(this.getSnapshotPanel());
    }

    async goToLibrary() {
        await this.dossierPage.goToLibrary();
    }

    async openExternalLinkOnChatTitleBarByIndex(Index) {
        await this.click({ elem: this.getTitleBarExternalLinkItemsByIndex(Index) });
    }

    async resizeConfigurationPanel(offset = 200) {
        return this.dragAndDrop({
            fromElem: this.getResizeHandlerOfConfigurationPanel(),
            toElem: this.getResizeHandlerOfConfigurationPanel(),
            toOffset: { x: offset, y: 0 },
        });
    }

    async resizeSnapshotPanel(offset = -100) {
        return this.dragAndDrop({
            fromElem: this.getResizeHandlerOfSnapshotPanel(),
            toElem: this.getResizeHandlerOfSnapshotPanel(),
            toOffset: { x: offset, y: 0 },
        });
    }

    async closeDialogue() {
        if (await this.getDialogCloseButton().isDisplayed()) {
            await this.click({ elem: this.getDialogCloseButton() });
        }
    }

    async takeSnapshot(index = 0) {
        await this.hover({ elem: this.getChatAnswerbyIndex(index) });
        await this.click({ elem: this.getChatBotPinIconByIndex(index) });
    }

    async askAboutbyIndex(Index = 0) {
        if (await this.isAskAboutBtnDisplayed()) {
            await this.click({ elem: this.getAskAboutBtn() });
        }
        await this.click({ elem: this.getAskAboutPanelObjectByIndex(Index) });
        await this.click({ elem: this.getStartConversationBtn() });
        await this.waitForRecommendationLoading();
    }

    async searchInAskAbout(searchText) {
        const searchBox = await this.getAskAboutPanelSearchBoxInput();
        await searchBox.setValue(searchText);
        await this.enter();
        await this.sleep(1000);
    }

    async clearAskAboutSearch() {
        const cancelBtn = this.$('.mstr-ai-chatbot-SearchBox-clear');
        await this.click({ elem: cancelBtn });
        await this.sleep(1000);
    }

    async clickShowErrorDetails(index = 0) {
        const errorMessageElement = this.getShowErrorMessage(index);
        if (await errorMessageElement.isDisplayed()) {
            await this.click({ elem: errorMessageElement });
        }
    }

    //Display assertion helper
    async isTooltipDisplayed() {
        return await this.getTooltip().isDisplayed();
    }

    async isTitleBarBotLogoDisplayed() {
        return await this.getTitleBarBotLogo().isDisplayed();
    }

    async isChatPanelTopicsTitleDisplayed() {
        return await this.getChatPanelTopicsTitle().isDisplayed();
    }

    async isChatBotVizDisplayed(vizType, index = 0) {
        return await this.getChatBotVizByType(vizType, index).isDisplayed();
    }

    async isCustomVizDisplayedByType(vizType, index = 0) {
        return await this.getCustomVizByType(vizType, index).isDisplayed();
    }

    async isTitleBarBotNameDisplayed() {
        return await this.getTitleBarBotName().isDisplayed();
    }

    async isWelcomePageBotImageDisplayed() {
        return await this.getWelcomePageBotImage().isDisplayed();
    }

    async isBot2WelcomePageDisplayed() {
        return await this.getBot2WelcomePage().isDisplayed();
    }

    async isClearHistpryConfirmationDialogDisplayed() {
        return await this.getClearHistoryConfirmationDialog().isDisplayed();
    }

    async isQADisplayed() {
        return !(await this.getWelcomePageBotImage().isDisplayed());
    }

    async isWelcomePageMessageDisplayed() {
        return await this.getWelcomePageMessage().isDisplayed();
    }

    async isWelcomePageSeparatorDisplayed() {
        return await this.getWelcomePageSeparator().isDisplayed();
    }

    async isWelcomePageTitleDisplayed() {
        return await this.getWelcomePageTitle().isDisplayed();
    }

    async isWelcomePageGreetingTitleDisplayed() {
        return await this.getWelcomePageGreetingTitle().isDisplayed();
    }

    async isWelcomePageMessageRecommendationDisplayed() {
        return await this.getWelcomePageRecommendation().isDisplayed();
    }

    async isSendIconDisplayed() {
        return await this.getSendIcon().isDisplayed();
    }

    async isDisabledSendIconDisplayed() {
        return await this.getDisabledSendIcon().isDisplayed();
    }

    async isTopicsIconDisplayed() {
        return await this.getTopicsIcon().isDisplayed();
    }

    async isDisabledTopicsIconDisplayed() {
        return await this.getDisabledTopicsIcon().isDisplayed();
    }

    async isTimeDisplayed() {
        return await this.getTime().isDisplayed();
    }

    async isQueryByIndexDisplayed(Index) {
        return await this.getQueryByIndex(Index).$('.Bubble').isDisplayed();
    }

    async isVizAnswerDisplaed() {
        return await this.getVizAnswerBubbleList().isDisplayed();
    }

    async isTextAnswerByIndexDisplayed(Index) {
        await this.waitForElementVisible(this.getTextAnswerByIndex(Index), {
            timeout: 300 * 1000,
        });
        return await this.getTextAnswerByIndex(Index).$('.mstr-chatbot-markdown').isDisplayed();
    }

    async isMarkDownByIndexDisplayed(Index) {
        return await this.getMarkDownByIndex(Index).isDisplayed();
    }

    async isVizAnswerByIndexDisplayed(Index) {
        return await this.getVizAnswerByIndex(Index).$('.mstrmojo-VIDocLayout').isDisplayed();
    }

    async isRecommendationDisplayed() {
        return await this.getRecommendationList().isDisplayed();
    }

    async isRecommendationExpandStateBtnDisplayed() {
        return await this.getRecommendationExpandStateBtn().isDisplayed();
    }

    async isDisabledReccomendationFoldStateBtnDisplayed() {
        return await this.getDisabledRecommendationFoldStateBtn().isDisplayed();
    }

    async isRecommendationRefreshIconDisplayed() {
        return await this.getRecommendationRefreshIcon().isDisplayed();
    }

    async isRecommendationByIndexDisplayed(Index) {
        return await this.getRecommendationByIndex(Index).$('.mstr-ai-chatbot-RecommendationItem-text').isDisplayed();
    }

    async isClearHistoryButtonDisplayed() {
        return await this.getClearHistoryButton().isDisplayed();
    }

    async isDeleteSnapShotButtonDisplayed(Index) {
        return await this.getDeleteSnapshotButton(Index).isDisplayed();
    }

    async isChatAnswerByIndexDisplayed(Index) {
        return await this.getChatAnswerbyIndex(Index).isDisplayed();
    }

    async isAutoCompleteAreaDisplayed() {
        return await this.getAutoCompleteArea().isDisplayed();
    }

    async isContentDiscoveryBotByIndexDisplayed(Index) {
        return await this.getContentDiscoveryBotByIndex(Index).isDisplayed();
    }

    async isColorDisplayedInViz(color, VizIndex = 0) {
        const colorInViz = await this.getColorInBarChart(VizIndex);
        return color.some((color) => colorInViz.includes(color));
    }

    async isColorDisplayedInVizOfSnapshot(color, VizIndex = 0) {
        const colorInViz = await this.getColorInBarChartOfSnapshot(VizIndex);
        return colorInViz.includes(color);
    }

    async getCountOfInterpretation() {
        const icons = await this.$$('.mstr-ai-chatbot-InterpretationButton');
        return icons.length;
    }

    async isInterpretationIconDisplayedInAnswer(index = 0) {
        await this.hover({ elem: this.getChatAnswerbyIndex(index) });
        return await this.getInterpretationIconInChatAnswerbyIndex(index).isDisplayed();
    }

    async isInterpretationComponentDisplayed() {
        return await this.getInterpretationComponent().isDisplayed();
    }

    async isInterpretationCopyLLMInstructionsIconDisplayed() {
        return await this.getInterpretationCopyLLMInstructionsIcon().isDisplayed();
    }

    async isInterpretationCopyToQueryDisableIconDisplayed() {
        return await this.getInterpretationCopyToQueryDisableIcon().isDisplayed();
    }

    async isAskAboutDisplayed() {
        return await this.getAskAbout().isDisplayed();
    }

    async isAskAboutBtnDisplayed() {
        return await this.getAskAboutBtn().isDisplayed();
    }

    async isAskAboutPanelDisplayed() {
        return await this.getAskAboutPanel().isDisplayed();
    }

    async isChatPanelTopicDisplayed() {
        return await this.getChatPanelTopic().isDisplayed();
    }

    async isAskAboutPanelObjectListDisplayed() {
        return await this.getAskAboutPanelObjectList().isDisplayed();
    }

    async isErrorAnswerDisplayedByIndex(index = 0) {
        return await this.getErrorByIndex(index).isDisplayed();
    }

    async isAskAboutPanelSearchBoxDisplayed() {
        return await this.getAskAboutPanelSearchBox().isDisplayed();
    }

    async isRecommendationAboutDisplayed() {
        return await this.$(
            `//div[@class='mstr-ai-chatbot-Clickable']//span[text()='Related suggestions about ']`
        ).isDisplayed();
    }

    async isDisclaimerDisplayed() {
        return await this.getDisclaimer().isDisplayed();
    }

    async isDisabledInputContainerDisplayed() {
        return await this.getDisabledInputBoxContainer().isDisplayed();
    }

    async isDidYouMeanPanelDisplayed() {
        return await this.getDidYouMeanPanel().isDisplayed();
    }

    async isSmartSuggestionLoadingBarDisplayed() {
        return await this.getSmartSuggestionLoadingBar().isDisplayed();
    }

    async isDidYouMeanCloseButtonDisplayed() {
        return await this.getDidYouMeanCloseButton().isDisplayed();
    }

    async isQuotedQuestionDisplayedInInputBox() {
        return await this.getQuotedQuestionInInpuxBox().isDisplayed();
    }

    async isAskAboutPanelObjectByNameDisplayed(name) {
        return await this.getAskAboutPanelObjectByName(name).isDisplayed();
    }

    async isLearningForgetBtnExisting() {
        return await this.getLearningForgetBtn().isDisplayed();
    }

    async isRecommendationPanelPresent() {
        return this.getRecommendations().isDisplayed();
    }

    async isInsightsSectionDisplayed() {
        const insights = await this.getInsights();
        if (insights.length > 0) {
            return insights[0].isDisplayed();
        } else {
            return false;
        }
    }

    async isResearchEnabled() {
        const el = await this.getResearchIcon();
        return this.isActive(el);
    }

    async isResearchDisplayed() {
        return this.getResearchIcon().isDisplayed();
    }

    async isWebSearchEnabled() {
        const el = await this.getWebSearchIcon();
        return this.isActive(el);
    }

    async isWebSearchDisplayed() {
        return this.getWebSearchIcon().isDisplayed();
    }

    async getTitleBarExternalLinkCount() {
        return this.getTitleBarExternalLinkItems().length;
    }

    async getFeedbackResultsText(index = 0) {
        await this.waitForElementVisible(this.getFeedbackResultPanel(index));
        return this.getFeedbackResultPanel(index).getText();
    }

    async waitClearHistoryEnabled() {
        await browser.waitUntil(
            async () => {
                const ariaDisabled = await this.getClearHistoryButton().getAttribute('aria-disabled');
                return ariaDisabled === 'false';
            },
            {
                timeout: 10000,
                timeoutMsg: 'Clear history did not become enabled after 10s',
                interval: 500,
            }
        );
    }

    async isFollowUpBtnDisplayedByLatestAnswer() {
        const answers = await this.getAnswers();
        return this.getFollowUpBtnByAnswer(answers.length - 1).isDisplayed();
    }

    async isExportToCsvIconDisplayedByLatestAnswer() {
        const answers = await this.getAnswers();
        return this.getExportToCsvButtonByAnswer(answers.length - 1).isDisplayed();
    }

    async isExportToExcelIconDisplayedByLatestAnswer() {
        const answers = await this.getAnswers();
        return this.getExportToExcelButtonByAnswer(answers.length - 1).isDisplayed();
    }

    // Manipulation functions
    async clearHistory() {
        if (await this.isQADisplayed()) {
            await this.waitClearHistoryEnabled();
            await this.clickClearHistoryButton();
            await this.sleep(1000); //wait for the clear history yes button to show up and be more stable
            await this.clickClearHistoryYesButton();
            await this.waitForElementInvisible(this.getClearHistoryConfirmationDialog());
            await this.waitForElementVisible(this.getWelcomePageMessage());
        }
    }

    async createNewChat() {
        await this.clickNewChatButton();
        await this.waitForElementVisible(this.getWelcomePage());
    }

    async sendPrompt(text) {
        await this.click({ elem: this.getInputBox() });
        await this.typeKeyboard(text);
        await this.click({ elem: this.getSendIcon() });
    }

    async sendPromptWaitAnswerLoaded(text) {
        await this.sendPrompt(text);
        await this.sleep(500);
        await this.waitForElementInvisible(this.getVizLoadingSpinner());
        await this.sleep(500);
        await this.waitForElementVisible(this.getAnswerbyIndex(0));
    }

    async askQuestionByAutoComplete(text, autoCompletionIndex = 0) {
        await this.typeKeyboard(text);
        if (await this.getAutoCompleteArea().isDisplayed()) {
            await this.click({
                elem: this.getAutoCompleteItembyIndex(autoCompletionIndex),
            });
        }
    }

    async copyRecommendationToQuery(index) {
        await this.waitForElementVisible(this.getRecommendationByIndex(index));
        await this.getRecommendationByIndex(index).moveTo();
        const copyBtn = await this.getRecommendationCopyIconByIndex(index);
        await this.click({ elem: copyBtn });
    }

    async copyQuestionToQuery(index) {
        await this.getQueryByIndex(index).$('.Bubble').moveTo();
        const copyBtn = await this.getQuestionCopyIconByIndex(index);
        await this.click({ elem: copyBtn });
    }

    async getRecommendationByContents(recommendation) {
        return this.getRecommendations()
            .$$('.mstr-ai-chatbot-RecommendationItem')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === recommendation;
            })[0];
    }

    async openInterpretation(index = 0) {
        await this.hover({ elem: this.getMarkDownByIndex(index) });
        await this.click({ elem: this.getInterpretationIcon() });
        await this.waitForElementVisible(this.getInterpretationCopyToQueryIcon());
    }

    async clickInterpretation() {
        await this.click({ elem: this.getInterpretationIcon() });
    }

    async clickInterpretationbyIndex(index) {
        await scrollIntoView(this.getInterpretationIconbyIndex(index));
        await this.click({ elem: this.getAnswers()[index] });
        await this.hover({ elem: this.getAnswerBubbleButtonBarByIndex(index) });
        await this.click({ elem: this.getInterpretationIconbyIndex(index) });
    }

    async clickAnswerWithoutCacheButtonByIndex(index = 0) {
        await this.click({ elem: this.getAnswerWithoutCacheButton(index) });
        await this.waitForAnswerLoading();
    }

    async clickInterpretationCopyToQueryIcon() {
        await this.click({ elem: this.getInterpretationCopyToQueryIcon() });
    }

    async clickInterpretationCopyLLMInstructionsIcon() {
        await this.click({ elem: this.getInterpretationCopyLLMInstructionsIcon() });
    }

    async clickInterpretationSeeMoreBtn() {
        await this.click({ elem: this.getInterpretationSeeMoreBtn() });
    }

    async inputFeedbackContents(feedback, index = 0) {
        await this.waitForElementClickable(this.getFeedbackInputArea(index));
        await this.getFeedbackInputArea(index).addValue(feedback);
    }

    async clearFeedbackContents(index = 0) {
        await this.waitForElementClickable(this.getFeedbackInputArea(index));
        await this.click({ elem: this.getFeedbackInputArea(index) });
        await this.typeKeyboard([[Key.Command, 'a'], Key.Delete]);
    }

    async hoverTextOnlyChatAnswertoAddSnapshotbyIndex(Index) {
        await this.hover({ elem: this.getMarkDownByIndex(Index) });
        await this.click({ elem: this.getPinIconByIndex(Index) });
    }

    async hoverChatAnswertoAddSnapshotbyIndex(Index) {
        await this.hover({ elem: this.getAnswerbyIndex(Index) });
        await this.click({ elem: this.getPinIconByIndex(Index) });
    }

    async hoverChatAnswerToRemoveSnapshotByIndex(index) {
        await this.hover({ elem: this.getChatBotAnswerbyIndex(index) });
        await this.click({ elem: this.getChatBotUnpinIcon() });
    }

    async hoverNthChatAnswerFromEndtoAddSnapshot(Nth) {
        const chatBotAnswer = await this.getNthChatBotAnswerFromEnd(Nth);
        await chatBotAnswer.scrollIntoView();
        await this.click({ elem: chatBotAnswer });
        await this.click({
            elem: await chatBotAnswer.$('.mstr-ai-chatbot-SnapshotButton-pin').$('.mstr-icons-lib-icon'),
        });
    }

    async hoverNthChatAnswerFromEndtoClickThumbdown(Nth) {
        const chatBotAnswer = await this.getNthChatBotAnswerFromEnd(Nth);
        await chatBotAnswer.scrollIntoView();
        await this.hover({ elem: chatBotAnswer });
        await this.click({
            elem: await chatBotAnswer.$('.mstr-ai-chatbot-ThumbDownButton-thumbDown').$('.mstr-icons-lib-icon'),
        });
    }

    async ClickUnpinNthChatAnswerFromEnd(Nth) {
        await this.click({ elem: await this.getUnpinButtonOfNthChatAnswer(Nth) });
        return this.waitForElementVisible(await this.getPinButtonOfNthChatAnswer(Nth));
    }

    async hoverTextOnlyChatAnswer(Index) {
        await this.hover({ elem: this.getMarkDownByIndex(Index) });
    }

    async hoverVizPanel(Index) {
        await this.hover({ elem: this.getVIVizPanel(Index) });
    }

    async hoverThumbDownButtonbyIndex(Index) {
        await this.hover({ elem: this.getThumbDownIconbyIndex(Index) });
    }

    async hoverThumbDownClickedButtonbyIndex(Index) {
        await this.hover({ elem: this.getThumbDownClickedIconbyIndex(Index) });
    }

    async hoverTextOnlyChatAnswertoOpenInterpretationbyIndex(Index) {
        await this.hover({ elem: this.getMarkDownByIndex(Index) });
        await this.click({ elem: this.getInterpretationIconbyIndex(Index) });
    }

    async hoverTextOnlyChatAnswertoOpenThumbDownbyIndex(Index) {
        await this.hoverTextOnlyChatAnswer(Index);
        await this.clickThumbDownButtonbyIndex(0);
    }

    async hoverChatAnswertoClickThumbDownbyIndex(Index) {
        await this.hover({ elem: this.getMarkDownByIndex(Index) });
        await this.click({ elem: this.getThumbDownIconbyIndex(Index) });
    }

    async hoverChatBubbleToClickThumbDownByIndex({ index = 0 }) {
        await this.hover({ elem: this.getChatAnswerbyIndex(index) });
        await this.click({ elem: this.getThumbDownIconbyIndex(index) });
    }

    async hovertoClickThumbDownbyIndex(MarkDownIndex = 0, ThumbDownIndex = 0) {
        await this.hover({ elem: this.getMarkDownByIndex(MarkDownIndex) });
        await this.click({ elem: this.getThumbDownIconbyIndex(ThumbDownIndex) });
    }

    async hoverChatAnswertoClickFollowUpbyIndex(markDownIndex = 0, followUpIndex = 0) {
        await this.hover({ elem: this.getMarkDownByIndex(markDownIndex) });
        await this.click({ elem: this.getFollowUpIconbyIndex(followUpIndex) });
    }

    async thumbUpByIndex(index) {
        await scrollIntoView(this.getAnswers()[index]);
        await this.click({ elem: this.getAnswers()[index] });
        await this.hover({ elem: this.getAnswers()[index] });
        await this.sleep(500);
        if (
            !(await this.getThumbUpIconbyIndex(index).isDisplayed()) &&
            (await this.getToolBarMoreButtonByIndex(index).isDisplayed())
        ) {
            await this.clickToolBarMoreButtonByIndex(index);
        }
        await this.click({ elem: this.getThumbUpIconbyIndex(index) });
    }

    async thumbDownByIndex(index) {
        await scrollIntoView(this.getAnswers()[index]);
        await this.click({ elem: this.getAnswers()[index] });
        await this.hover({ elem: this.getAnswers()[index] });
        await this.sleep(500);
        if (
            !(await this.getThumbDownIconbyIndex(index).isDisplayed()) &&
            (await this.getToolBarMoreButtonByIndex(index).isDisplayed())
        ) {
            await this.clickToolBarMoreButtonByIndex(index);
        }
        await this.click({ elem: this.getThumbDownIconbyIndex(index) });
    }

    async hoverContentDiscoveryBotByIndex(Index) {
        await this.hover({ elem: this.getContentDiscoveryBotByIndex(Index) });
    }

    async hoverLearningManager(Index = 0) {
        await this.hover({ elem: this.getLearningManagerIcon(Index) });
    }

    async hoverLearningContent(answerIndex = 0, learningIndex = 0, offset = { x: 0, y: 0 }) {
        await this.hover({ elem: this.getAnswerLearningContents(answerIndex, learningIndex), offset });
    }

    async numberOfSnapshotsInChatbot() {
        return await this.getSnapshotList().length;
    }

    getChatAnswerByText(text, language = 'en') {
        return ChatAnswer.createByText(text, language);
    }

    async checkIfAnyCopyScreenshotButtonExisting() {
        return (await this.$('.mstr-ai-chatbot-CopyButton')).isDisplayed();
    }

    async checkIfCopyScreenshotButtonExisting(Nth) {
        const chatBotAnswer = await this.getNthChatBotAnswerFromEnd(Nth);
        await chatBotAnswer.scrollIntoView();
        await this.hover({ elem: chatBotAnswer });
        const moreBtn = await chatBotAnswer.$('.mstr-ai-chatbot-MoreButton');
        if (await moreBtn.isExisting()) {
            await this.click({ elem: moreBtn });
        }
        const copyBtn = await chatBotAnswer.$('.mstr-ai-chatbot-CopyButton');
        return await copyBtn.isExisting();
    }

    async checkIfDownloadButtonExisting(Nth) {
        const chatBotAnswer = await this.getNthChatBotAnswerFromEnd(Nth);
        await chatBotAnswer.scrollIntoView();
        await this.hover({ elem: chatBotAnswer });
        // const moreBtn = await chatBotAnswer.$('.mstr-ai-chatbot-MoreButton');
        // if (await moreBtn.isExisting()) {
        //     await this.click({ elem: moreBtn });
        // }
        const downloadBtn = await chatBotAnswer.$('.mstr-ai-chatbot-DownloadButton');
        return await downloadBtn.isExisting();
    }

    async checkIfSnapshotButtonExisting(Nth) {
        const chatBotAnswer = await this.getNthChatBotAnswerFromEnd(Nth);
        await chatBotAnswer.scrollIntoView();
        await this.hover({ elem: chatBotAnswer });
        return (await chatBotAnswer.$('.mstr-ai-chatbot-SnapshotButton-pin')).isExisting();
    }

    async hideTimeStampInChatAndSnapshot() {
        await this.waitForElementVisible(this.getTime());
        await this.waitForElementVisible(this.getTimeInSnapshot());
        await this.hideElement(this.getTime());
        await this.hideElement(this.getTimeInSnapshot());
    }

    async getPinButtonOfNthChatAnswer(Nth) {
        const chatBotAnswer = await this.getNthChatBotAnswerFromEnd(Nth);
        await chatBotAnswer.scrollIntoView();
        await this.hover({ elem: chatBotAnswer });
        return await chatBotAnswer.$('.mstr-ai-chatbot-SnapshotButton-pin');
    }

    async getUnpinButtonOfNthChatAnswer(Nth) {
        const chatBotAnswer = await this.getNthChatBotAnswerFromEnd(Nth);
        await chatBotAnswer.scrollIntoView();
        await this.hover({ elem: chatBotAnswer });
        return await chatBotAnswer.$('.mstr-ai-chatbot-SnapshotButton-unpin');
    }

    async clickMobileHamburgerButton() {
        await this.click({ elem: this.getMobileHamburgerButton() });
    }

    async openMobileHamburger() {
        if (!(await this.getMobileSliderMenu().isDisplayed())) {
            await this.click({ elem: this.getMobileHamburgerButton() });
            await this.waitForElementVisible(this.getMobileSliderMenu());
            return this.sleep(1000); // Time buffer for animation
        }
    }

    async closeMobileHamburger() {
        if (await this.getMobileSliderMenu().isDisplayed()) {
            await this.click({ elem: this.getMobileHamburgerButton() });
            await this.waitForElementInvisible(this.getMobileSliderMenu());
            return this.sleep(1000); // Time buffer for animation
        }
    }

    async openMobileViewSnapshotPanel() {
        await this.click({ elem: this.getSnapshotSideMenu() });
        await this.waitForElementInvisible(this.getContentLoadingIcon());
        await this.waitForElementInvisible(this.getChatBotLoadingIcon());
    }

    async closeMobileViewSnapshotPanel() {
        await this.click({ elem: this.getMobileCloseSnapshotButton() });
    }

    async openMobileViewAskAboutPanel() {
        await this.click({ elem: this.getAskAboutSideMenu() });
        await this.waitForElementInvisible(this.getContentLoadingIcon());
    }

    async closeMobileViewAskAboutPanel() {
        await this.click({ elem: this.getMobileCloseAskAboutButton() });
    }

    async clearMobileViewHistory() {
        if (await this.getClearHistorySideMenu().isDisplayed()) {
            await this.click({ elem: this.getClearHistorySideMenu() });
            await this.sleep(1000); //wait for the clear history yes button to show up and be more stable
            await this.clickMobileViewClearHistoryYesButton();
            await this.waitForElementInvisible(this.getMobileSliderMenu());
        }
        await this.closeMobileHamburger();
    }

    async clickMobileViewClearHistoryButton() {
        return this.click({ elem: this.getClearHistorySideMenu() });
    }

    async clickMobileViewClearHistoryYesButton() {
        return this.click({ elem: this.getMobileViewClearHistoryYesButton() });
    }

    async clickMobileViewClearHistoryNoButton() {
        return this.click({ elem: this.getMobileViewClearHistoryNoButton() });
    }

    async clickMobileViewLinksButton() {
        await this.click({ elem: this.getLinksSideMenu() });
        await this.waitForElementVisible(this.getMobileViewLinksContainer());
        return this.sleep(1000); // Time buffer for animation
    }

    async clickMobileViewLinksItemsbyIndex(Index) {
        await this.click({ elem: this.getMobileViewLinksItemsbyIndex(Index) });
    }

    async clickCloseSnapshotAddedButton() {
        await this.click({ elem: this.getCloseSnapshotAddedButton() });
    }

    async clickMarkDownByIndex(Index) {
        await this.click({ elem: this.getMarkDownByIndex(Index) });
    }

    async clickButton(name) {
        return this.click({ elem: this.getButtonByName(name) });
    }

    async isBotConfigByNameSelected(name) {
        return getAttributeValue(this.getBotConfigTabByName(name), 'ariaSelected');
    }

    async clickExternalLinkByText(text) {
        await this.click({ elem: this.getChatBotTitleBarExternalLinkText(text) });
    }

    async closeDidYouMean() {
        if (await this.getDidYouMeanCloseButton().isDisplayed()) {
            await this.click({ elem: this.getDidYouMeanCloseButton() });
        }
    }

    async getLastQueryText() {
        const length = await this.getQueryCount();
        return this.getQueryTextByIndex(length - 1);
    }

    async getTopicItemsInChatPanel() {
        return this.getTopicItems();
    }

    async openLearningManager(Index = 0) {
        await this.waitForElementVisible(this.getLearningManagerIcon(Index));
        await this.clickLearningManager(Index);
        await this.waitForLibraryLoading();
        await this.waitForElementVisible(this.getLearningManagerWindow());
        await this.waitForElementInvisible(this.getContentLoadingIcon());
    }

    async openInterpretationForgetUserLearning(answerIndex = 0, learningIndex = 0, waitLoading = true) {
        const interpretationOpened = await this.getInterpretationCopyToQueryIcon().isExisting();
        if (!interpretationOpened) {
            await this.hoverOnChatAnswer(answerIndex);
            await this.clickInterpretation();
            await this.waitForInterpretationLoading();
        }
        await this.hoverLearningContent(learningIndex);
        await this.click({ elem: this.getLearningForgetBtn() });
        await this.click({ elem: this.getConfirmationBtnOnForget('Yes') });
        if (waitLoading) {
            await this.waitForForgetUserLearningLoading();
        }
    }

    async verifyAskAboutObjectStateByIndex(index, expectedState) {
        const object = await this.getAskAboutPanelObjectByIndex(index);
        // Get the value of the "data-state" attribute
        const state = await object.getAttribute('data-state');

        // Verify if the state matches the expected value
        if (state === expectedState) {
            console.log(`Panel at index ${index} is in the expected state: ${expectedState}`);
        } else {
            console.log(
                `Panel at index ${index} is in an unexpected state. Expected: ${expectedState}, but got: ${state}`
            );
        }
        return state === expectedState;
    }

    async verifyAskAboutObjectElementList(index, expectedText) {
        const elementLists = await this.getAskAboutPanelObjectSampleElementListByIndex(index);

        for (const element of elementLists) {
            const text = await element.getText();

            if (text === expectedText) {
                return true;
            }
        }
        return false;
    }

    /**
     * Click the recommended topic by topic index, default is the first topic
     */
    async clickTopicInAIBotByIndex(topicIndex = 0) {
        await browser.pause(2000);
        try {
            let topics = await this.getTopicItemsInChatPanel();
            if (topicIndex >= 0 && topicIndex < topics.length) {
                if (topics[topicIndex].isClickable()) {
                    await this.click({ elem: topics[topicIndex] });
                    console.log('\n***Click topic: {}***\n'.replace('{}', topicIndex));
                } else {
                    console.log('The topic is not clickable.');
                }
            } else {
                console.log('The topic index is out of range.');
            }
        } catch (error) {
            console.error('Failed to click topic, error: ' + error);
        }
    }

    /**
     * Verify the topic summary contains expected number of summary results, and each summary has a quesiton.
     * If it meets the requirement, return the questions and answers as array.
     */
    async verifyTopicSummary(topicSummaryAccount = 3) {
        await browser.pause(2000);

        const topicSums = await this.getTopicSummaryArray();

        console.log('\n***Start verify the topic summary.***\n');

        if (topicSums.length != topicSummaryAccount) {
            console.log(
                'Number of topic summary questions is not expected, expected: {}, actual: {}.'
                    .replace('{}', topicSummaryAccount)
                    .replace('{}', topicSums.length)
            );
            return false;
        }
        if (!Array.isArray(topicSums) || topicSums.length === 0) {
            console.log('No topic summaries found.');
            return false;
        }

        try {
            //define a empty questions and answers array
            const questions = [];
            const answers = [];
            for (let i = 0; i < topicSums.length; i++) {
                const topicSum = topicSums[i];
                console.log('Start verify topic summary question {}'.replace('{}', i + 1));

                // Wait for the topic summary element to be displayed
                await topicSum.waitForDisplayed({ timeout: 60000 });

                // Find the first <p> element
                const firstPElement = await topicSum.$('p:first-of-type');

                // Verify the first <p> element has a <strong> tag
                const strongTagExists = await firstPElement.$('strong').isExisting();

                if (strongTagExists) {
                    // Extract text from the first <p> element
                    const questionText = await browser.execute((firstPElement) => {
                        return firstPElement.textContent;
                    }, firstPElement);
                    questions.push(questionText);

                    // Initialize answerText
                    let answerText = '';

                    // Extract text from all child elements except the first <p> element
                    const childElements = await topicSum.$$('p,li');
                    for (const element of childElements) {
                        // Check if the element is the first <p> element
                        const isFirstPElement = await browser.execute(
                            (elem1, elem2) => elem1.isSameNode(elem2),
                            element,
                            firstPElement
                        );

                        if (!isFirstPElement) {
                            // Extract text from the element using execute
                            const elementText = await browser.execute((el) => el.textContent, element);
                            answerText += elementText + ' ';
                        }
                    }

                    // Remove the extra space at the end of answerText
                    answerText = answerText.trim();
                    //print the question and answer text for each topic summary with index
                    console.log('Question {}: {}'.replace('{}', i + 1).replace('{}', questionText));
                    console.log('Answer {}: {}'.replace('{}', i + 1).replace('{}', answerText));

                    answers.push(answerText);
                } else {
                    console.log('The first <p> element does not meet the criteria.');
                }
            }

            console.log('Topic summary has expected number of questions and answers.');
            //return the questions array and answers array
            return [questions, answers];
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    }

    /**
     * Sometimes the generated topic summary result number is not constant for some cases, this function is used to verify the topic summary >=1 and <= topicSummaryAccount(default is 3).
     * If it meets the requirement, return the questions and answers as array.
     */
    async verifyUncertainTopicSummary(topicSummaryAccount = 3) {
        await browser.pause(2000);

        const topicSums = await this.getTopicSummaryArray();

        console.log('\n***Start verify the topic summary.***\n');
        //topic summary result length should >= 1 and <= topicSummaryAccount(default is 3)
        if (topicSums.length < 1 || topicSums.length > topicSummaryAccount) {
            console.log(
                'The topic summary does not have expected number of questions, actual{}. '.replace(
                    '{}',
                    topicSums.length
                )
            );
            return false;
        }

        if (!Array.isArray(topicSums)) {
            console.log('No topic summaries found.');
            return false;
        }

        try {
            //define a empty questions and answers array
            const questions = [];
            const answers = [];
            for (let i = 0; i < topicSums.length; i++) {
                const topicSum = topicSums[i];
                console.log('Start verify topic summary question {}'.replace('{}', i + 1));

                // Wait for the topic summary element to be displayed
                await topicSum.waitForDisplayed({ timeout: 60000 });

                // Find the first <p> element
                const firstPElement = await topicSum.$('p:first-of-type');

                // Verify the first <p> element has a <strong> tag
                const strongTagExists = await firstPElement.$('strong').isExisting();

                if (strongTagExists) {
                    // Extract text from the first <p> element
                    const questionText = await browser.execute((firstPElement) => {
                        return firstPElement.textContent;
                    }, firstPElement);
                    questions.push(questionText);

                    // Initialize answerText
                    let answerText = '';

                    // Extract text from all child elements except the first <p> element
                    const childElements = await topicSum.$$('p,li');
                    for (const element of childElements) {
                        // Check if the element is the first <p> element
                        const isFirstPElement = await browser.execute(
                            (elem1, elem2) => elem1.isSameNode(elem2),
                            element,
                            firstPElement
                        );

                        if (!isFirstPElement) {
                            // Extract text from the element using execute
                            const elementText = await browser.execute((el) => el.textContent, element);
                            answerText += elementText + ' ';
                        }
                    }

                    // Remove the extra space at the end of answerText
                    answerText = answerText.trim();
                    //print the question and answer text for each topic summary with index
                    console.log('Question {}: {}'.replace('{}', i + 1).replace('{}', questionText));
                    console.log('Answer {}: {}'.replace('{}', i + 1).replace('{}', answerText));

                    answers.push(answerText);
                } else {
                    console.log('The first <p> element does not meet the criteria.');
                }
            }

            console.log('Topic summary has expected number of questions and answers.');
            //return the questions array and answers array
            return [questions, answers];
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    }

    /**
     * Click the Ask about button to open the Ask About panel
     */
    async openAskAboutPanel() {
        try {
            // Wait for the Ask About button to be clickable and then click it
            await this.click({ elem: this.getAskAboutBtn() });
            console.log('\n***Open Ask About panel***\n');
        } catch (error) {
            // Add a log if fails to open Ask About panel
            console.error('Failed to openAsk About panel, error: ' + error);
        }
    }

    async expandAskAboutObjectByName(name) {
        return this.click({ elem: this.getAskAboutPanelObjectByName(name) });
    }

    /**
     * Click one dataset object in Ask About panel to start converstation
     * the input parameter is the dataset object name
     */
    async clickStartConversationInAskAboutPanel(objectName) {
        try {
            //find the object button in the ask about panel
            let objElement = await this.GetObjectButtonInAskAboutPanel(objectName);

            //click the object in the ask about panel
            await this.click({ elem: objElement });
            console.log('\n***Click object: {} in Ask About panel***\n'.replace('{}', objectName));

            //find the start conversation button for the object and click it
            await this.click({ elem: this.GetStartConversionButtonInAskAboutPanel(objectName) });

            console.log('\n***Click start conversation for Element: {}***\n'.replace('{}', objectName));
        } catch (error) {
            // Add a log if failes to start conversation
            console.error('Failed to start conversation , error: ' + error);
        }
    }

    /**
     * Click one dataset object in Ask About panel to start converstation in bot 2.0
     * the input parameter is the dataset object name
     */
    async clickStartConversationInAskAboutPanel2(objectName) {
        try {
            //find the object button in the ask about panel
            let objElement = await this.GetObjectButtonInAskAboutPanel(objectName);

            // Hover over the object instead of clicking
            await objElement.moveTo();
            console.log(`\n***Hover over object: ${objectName} in Ask About panel***\n`);

            // Wait until the start conversation button is displayed
            const startBtn = await this.GetStartConversionButtonInAskAboutPanel(objectName);
            await startBtn.waitForDisplayed({ timeout: 5000 });

            // Click the start conversation button
            await this.click({ elem: startBtn });
            console.log(`\n***Click start conversation for element: ${objectName}***\n`);
        } catch (error) {
            // Add a log if failes to start conversation
            console.error('Failed to start conversation , error: ' + error);
        }
    }

    /**
     * Retrieve recommended questions and return
     */
    async getAskAboutSuggestedQuestions() {
        try {
            let recommendations = await this.getStartConversationRecommendationItemArray();
            //retrieve all the text from this recommendations, and return the text array
            let recommendationTexts = [];
            for (let i = 0; i < recommendations.length; i++) {
                let recommendationText = await recommendations[i].getAttribute('aria-label');
                recommendationTexts.push(recommendationText);
            }
            //print the recommendation text array and then return it
            console.log('\n***Recommendation questions: {}***\n'.replace('{}', recommendationTexts));
            return recommendationTexts;
        } catch (error) {
            console.error('Failed to get the dataset object recommendations, error: ' + error);
        }
    }

    /**
     * Construct JSON object with input key/value, output key/value and return
     */
    async constructJSON(inputKey, inputValue, outputKey, outputValue) {
        try {
            //input key/value could be a string or a array
            let inputObj = {};

            if (Array.isArray(inputKey) && Array.isArray(inputValue)) {
                for (let i = 0; i < inputKey.length && i < inputValue.length; i++) {
                    inputObj[inputKey[i]] = inputValue[i];
                }
            } else {
                inputObj[inputKey] = inputValue;
            }

            return {
                input: inputObj,
                output: {
                    [outputKey]: outputValue,
                },
            };
        } catch (error) {
            console.error('Failed to construct JSON, error: ' + error);
        }
    }

    async isCustomSuggestionDisplayed(suggestion) {
        return this.$(`span=${suggestion}`).isDisplayed();
    }

    async verifyElementFont(element, expectedFont, elementName) {
        const fontFamily = await element.getCSSProperty('font-family');
        await since(`Font used for ${elementName} should be #{expected}, instead we have #{actual}.`)
            .expect(fontFamily.value.toString())
            .toBe(expectedFont);
    }

    async extractAGGridDataToMarkdown(answerIndex, gridIndex) {
        const gridElement = this.getMultipleGridsByIndex(answerIndex)[gridIndex];
        const headers = [];
        const headerCells = await gridElement.$$('.ag-header-cell-text');
        for (const header of headerCells) {
            headers.push((await this.getInnerText(header)).trim());
        }

        const rows = [];
        const dataRows = await gridElement.$$('.ag-center-cols-container [role="row"]');
        for (const row of dataRows) {
            const cells = await row.$$('[role="gridcell"]');
            const rowData = [];
            for (const cell of cells) {
                rowData.push((await this.getInnerText(cell)).trim());
            }
            rows.push(rowData);
        }

        let markdown = '| ' + headers.join(' | ') + ' |\n';
        markdown += '| ' + headers.map(() => '---').join(' | ') + ' |\n';
        rows.forEach((row) => {
            markdown += '| ' + row.join(' | ') + ' |\n';
        });

        console.log(markdown);
        return markdown;
    }

    async isAliasDispalyedForAskAboutObject(name, alias) {
        return await this.getAskAboutPanelObjectAlias(name, alias).isDisplayed();
    }

    async areTopicSuggestionsDisabled() {
        // Check if all topic items have the 'disabled' class or aria-disabled attribute
        const topicItems = await this.getTopicItems();
        for (const topicItem of topicItems) {
            const isAriaDisabled = await topicItem.getAttribute('aria-disabled');
            const classNames = await topicItem.getAttribute('class');

            // If any topic is not disabled, return false
            if (isAriaDisabled !== 'true' && (!classNames || !classNames.includes('disabled'))) {
                return false;
            }
        }
        return true; // All topics are disabled
    }

    async isButtonDisabled(elem) {
        const isAriaDisabled = await elem.getAttribute('aria-disabled');
        return isAriaDisabled === 'true';
    }

    async manipulationOnAgGrid(gridIndex, columnName, action, subAction = null) {
        const header = this.getAgGridHeaderCellByText(gridIndex, columnName);
        await this.rightMouseClickOnElement(header);
        await this.waitForElementVisible(this.getAgColumnMenu());
        const menuItem = await this.getAgColumnMenuItemByName(action);
        if (!(await menuItem.isExisting())) {
            throw new Error(`menu not found: '${action}'`);
        }
        if (!subAction) {
            await this.click({ elem: menuItem });
            return;
        }
        await menuItem.moveTo();
        const subMenuItem = await this.getSubmenuItemForPin(subAction);
        await this.waitForElementVisible(subMenuItem);
        await subMenuItem.moveTo();
        await this.click({ elem: subMenuItem });
    }

    // checked => true: select column; false: unselect column
    async selectUnselectColumnOnAgGrid(columnName, checked = true) {
        await this.waitForElementVisible(this.getAgColumnPickdialog());
        const checkboxWrapper = await this.getCheckBoxWrapperInAgColumnPickerByName(columnName);
        const checkbox = await this.getCheckBoxInAgColumnPickerByName(columnName);

        if (!(await checkboxWrapper.isExisting())) {
            throw new Error(`${columnName} checkbox is not found`);
        }
        const isChecked = await checkbox.isSelected();
        if (checked && !isChecked) {
            await this.click({ elem: checkboxWrapper });
        } else if (!checked && isChecked) {
            await this.click({ elem: checkboxWrapper });
        }
    }

    async closeAgColumnPickerDialog() {
        await this.click({ elem: this.getAgColumnPickerCloseButton() });
        await this.waitForElementInvisible(this.getAgColumnPickdialog());
    }
}
