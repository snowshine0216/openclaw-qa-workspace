import BaseComponent from '../base/BaseComponent.js';
import SnapshotDialog from './SnapshotDialog.js';
import AIBotSnapshotsPanel from './AIBotSnapshotsPanel.js';
import translations from '../../constants/translations.json' assert { type: 'json' };

export default class SnapshotCard extends BaseComponent {
    constructor(container, locator = '.mstr-ai-chatbot-SnapshotCard', language = 'en') {
        super(container, locator, 'Snapshot Card');
        this.snapshotDialog = new SnapshotDialog();
        this.aiBotSnapshotsPanel = new AIBotSnapshotsPanel();
        this.translation = translations[language];
    }

    static createByText(text, language = 'en') {
        const el = new SnapshotCard(
            null,
            `//p[contains(normalize-space(.), '${text}')]/ancestor::section[@class="mstr-ai-chatbot-SnapshotCard"]`,
            language
        );
        return el;
    }

    static createByTextV2(text, language = 'en') {
        const el = new SnapshotCard(
            null,
            `//p[contains(text(), '${text}')]/ancestor::section[@class="mstr-ai-chatbot-SnapshotCard v2"]`,
            language
        );
        return el;
    }

    static createByQuestion(text, language = 'en') {
        const el = new SnapshotCard(
            null,
            `//div[@role="heading" and contains(normalize-space(.), '${text}')]/ancestor::section[@class="mstr-ai-chatbot-SnapshotCard"]`,
            language
        );
        return el;
    }

    static createByIndex(index, language = 'en') {
        const el = new SnapshotCard(null, $$('section.mstr-ai-chatbot-SnapshotCard')[index], language);
        return el;
    }

    getSnapshotContainer() {
        return this.$('.mstr-ai-chatbot-MainView-snapshotContainer');
    }

    getSnapshotContent() {
        return this.getElement().$('.mstr-ai-chatbot-SnapshotCard-content');
    }

    getMaximizeButton() {
        return this.getElement().$(`button[aria-label='${this.translation.maximize}']`);
    }

    getMoveButton() {
        return this.getElement().$(`button[aria-label='${this.translation.move}']`);
    }

    getCopyButton() {
        return this.getElement().$(`div[role="button"][aria-label='${this.translation.copy}']`);
    }

    getInterpretationButton() {
        return this.getElement().$(`div[role="button"][aria-label='${this.translation.interpretation}']`);
    }

    getCopiedIndicator() {
        return this.getElement().$('div[role="button"][aria-label="Copied"]');
    }

    getDownloadButton() {
        return this.getElement().$(`div[role='button'][aria-label='${this.translation.download}']`);
    }

    getDownloadedIndicator() {
        return this.getElement().$('div[role="button"][aria-label="Downloaded"]');
    }

    getDeleteButton() {
        return this.getElement().$(`button[aria-label='${this.translation.delete}']`);
    }

    getThumbdownIcon() {
        return this.getElement().$(`div[role="button"][aria-label='${this.translation.thumbdown}']`);
    }

    getMoveDialog() {
        return this.$('.mstr-ai-chatbot-MoveSnapshotButton-popover');
    }

    getSeeMoreButton() {
        return this.getElement().$(`button=${this.translation.seeMore}`);
    }

    getSeeLessButton() {
        return this.getElement().$(`button=${this.translation.seeLess}`);
    }

    isExisting() {
        return this.getElement().isExisting();
    }

    isDisplayed() {
        return this.getElement().isDisplayed();
    }

    getViewDetailsButton() {
        return this.getElement().$('button=View details');
    }

    getErrorMessageContent() {
        return this.getElement().$('.mstr-ai-chatbot-ErrorMessage-details-content');
    }

    getErrorMessageDialog() {
        return this.getElement().$('.mstr-ai-chatbot-ErrorMessage');
    }

    getInterpretationContent() {
        return this.getElement().$('.mstr-ai-chatbot-CIInterpretationWrapper');
    }

    getInterpretationContentTitle() {
        return this.getInterpretationContent().$('.mstr-ai-chatbot-CIInterpretedAs-title').getText();
    }

    getInterpretationContentText() {
        return this.getInterpretationContent().$('.mstr-ai-chatbot-CIInterpretedAs-text').$('span').getText();
    }

    getInterpretationComponents() {
        return this.getInterpretationContent().$('.mstr-ai-chatbot-CIComponents');
    }

    getAskAgainButton() {
        return this.getElement().$('.mstr-ai-chatbot-CIInterpretedAs-copy-query');
    }

    getUnreadIcon() {
        return this.$('.mstr-ai-chatbot-SnapshotCard-unread');
    }

    getUnreadIconV2() {
        return this.getElement().$('.mstr-ai-chatbot-SnapshotCard-unread');
    }

    getLearningIndicator() {
        return this.getElement().$('.mstr-ai-chatbot-AnswerBubbleLearningBadges');
    }

    getLearningTooltip() {
        return this.$('.mstr-ai-chatbot-AnswerBubbleLearningBadges-popover');
    }

    getInterpretationNuggets() {
        return this.getInterpretationContent().$('.mstr-ai-chatbot-CINuggetsContent');
    }

    getExportCSVButton() {
        return this.getElement().$('.mstr-ai-chatbot-ExportToCsvButton');
    }

    getExportExcelButton() {
        return this.getElement().$('.mstr-ai-chatbot-ExportToExcelButton');
    }

    getActionBar() {
        return this.getSnapshotContainer().$('.mstr-ai-chatbot-SnapshotCard-leftFooter');
    }

    async clickDownloadButton() {
        await this.click({ elem: this.getDownloadButton() });
        await browser.waitUntil(
            async () => {
                const downloadedIndicator = await this.getDownloadedIndicator().isDisplayed();
                return downloadedIndicator;
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'Download snapshot no response',
            }
        );
    }

    async clickExportCSVButton() {
        await this.click({ elem: this.getExportCSVButton() });
    }

    async clickExportExcelButton() {
        await this.click({ elem: this.getExportExcelButton() });
    }

    async clickCopyButton() {
        await this.click({ elem: this.getCopyButton() });
        await browser.waitUntil(
            async () => {
                const copiedIndicator = await this.getCopiedIndicator().isDisplayed();
                return copiedIndicator;
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'Copy snapshot no response',
            }
        );
    }

    async clickMoveButton() {
        await this.click({ elem: this.getMoveButton() });
        await browser.waitUntil(
            async () => {
                return this.getMoveDialog().isDisplayed();
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'Move snapshot no response',
            }
        );
    }

    async clickSeeMoreButton() {
        await this.click({ elem: this.getSeeMoreButton() });
        await browser.waitUntil(
            async () => {
                return this.getSeeLessButton().isDisplayed();
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'See more button no response',
            }
        );
    }

    async clickSeeLessButton() {
        await this.click({ elem: this.getSeeLessButton() });
        await browser.waitUntil(
            async () => {
                return this.getSeeMoreButton().isDisplayed();
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'See less button no response',
            }
        );
    }

    async selectMoveToCategory(categoryName) {
        const dialog = this.getMoveDialog();
        await this.click({ elem: dialog.$(`button=${categoryName}`) });
        await browser.waitUntil(
            async () => {
                return this.getMoveButton().getAttribute('disabled') !== 'true';
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'Move snapshot no response',
            }
        );
    }

    async clickDeleteButton() {
        await this.click({ elem: this.getDeleteButton() });
        await browser.waitUntil(
            async () => {
                return this.getConfirmDeleteDialog().isDisplayed();
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'Delete snapshot no response',
            }
        );
    }

    async clickMaximizeButton() {
        await this.click({ elem: this.getMaximizeButton() });
        await browser.waitUntil(
            async () => {
                return this.snapshotDialog.getSnapshotDialog().isDisplayed();
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'Move snapshot no response',
            }
        );
    }

    async showInterpretationContent() {
        await this.click({ elem: this.getInterpretationButton() });
        await browser.waitUntil(
            async () => {
                return this.getInterpretationContent().isDisplayed();
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'Get interpretation no response',
            }
        );
    }

    async closeInterpretationButton() {
        await this.click({ elem: this.getInterpretationButton() });
    }

    async clickAskAgainButton() {
        await this.click({ elem: this.getAskAgainButton() });
    }

    getConfirmDeleteDialog() {
        return this.$('.mstr-ai-chatbot-ConfirmationButton-dialog');
    }

    async confirmDelete() {
        await this.click({ elem: this.getConfirmDeleteDialog().$(`button=${this.translation.yes}`) });
        await browser.waitUntil(
            async () => {
                const cardNumber = await this.aiBotSnapshotsPanel.getNumberOfDisplayedSnapshotCard();
                const sortButton = await this.aiBotSnapshotsPanel.getSortButton();
                return !cardNumber || !(await sortButton.getAttribute('disabled'));
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'Confirm delete snapshot no response',
            }
        );
    }

    async cancelDelete() {
        await this.click({ elem: this.getConfirmDeleteDialog().$(`button=${this.translation.no}`) });
        await browser.waitUntil(
            async () => {
                return !(await (await this.getConfirmDeleteDialog()).isExisting());
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'Cancel delete snapshot no response',
            }
        );
    }

    async hoverAndGetTooltip(e) {
        await this.hover({ elem: await this.getElement() });
        await this.hover({ elem: e });
        const tooltip = await this.getChatbotToolTip();
        await this.waitForElementVisible(tooltip);
        return tooltip;
    }

    async clickAndGetTooltip(e) {
        await this.click({ elem: await this.getElement() });
        await this.click({ elem: e });
        const tooltip = await this.getChatbotToolTip();
        await this.waitForElementVisible(tooltip);
        return tooltip;
    }

    async clickViewDetailsButton() {
        await this.click({ elem: this.getViewDetailsButton() });
        await browser.waitUntil(
            async () => {
                return this.getErrorMessageContent().isDisplayed();
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'Error message no response',
            }
        );
    }

    getSnapshotOperations() {
        return this.getElement().$('.mstr-ai-chatbot-SnapshotQuestion');
    }

    getRenameSnapshotTitleButton() {
        return this.getElement().$('div[role="button"][aria-label="Rename"]');
    }

    getCopySnapshotTitleButton() {
        return this.getElement().$('div[role="button"][aria-label="Ask again"]');
    }

    async hoverSnapshotOperations() {
        await this.hover({ elem: this.getSnapshotOperations() });
    }

    async clickSnapshotOperations() {
        await this.click({ elem: this.getSnapshotOperations() });
    }

    async clickRenameSnapshotTitleButton() {
        await this.click({ elem: this.getRenameSnapshotTitleButton() });
    }

    async renameSnapshotTitle(newName) {
        await this.hover({ elem: this.getSnapshotOperations() });
        await this.click({ elem: this.getRenameSnapshotTitleButton() });
        await this.typeKeyboard(newName);
        await browser.keys('Enter');
    }

    async getSnapshotTitle() {
        return this.getElement().$('.mstr-ai-chatbot-SnapshotQuestion').getText();
    }

    async copySnapshotTitle() {
        await this.hover({ elem: this.getSnapshotOperations() });
        await this.click({ elem: this.getCopySnapshotTitleButton() });
    }

    async clickLearningIndicator() {
        await this.click({ elem: this.getLearningIndicator() });
        await browser.waitUntil(
            async () => {
                return this.getLearningTooltip().isDisplayed();
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'Learning tooltip no response',
            }
        );
    }

    async setInterpretationText(value) {
        await browser.execute((value) => {
            const InterpretationText = document.querySelector('.mstr-ai-chatbot-CIInterpretedAs-text > span');
            InterpretationText.textContent = value;
        }, value);
    }

    async hideSnapshotContent() {
        await this.hideElement(this.getSnapshotContent());
    }
}
