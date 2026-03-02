import { Key } from 'webdriverio';

import BasePage from '../base/BasePage.js';
import AIBotChatPanel from './AIBotChatPanel.js';
import SnapshotCard from './SnapshotCard.js';
import SnapshotCategoryArea from './SnapshotCategoryArea.js';
import translations from '../../constants/translations.json' assert { type: 'json' };

export default class AIBotSnapshotsPanel extends BasePage {
    constructor() {
        super();
        this.aibotChatPanel = new AIBotChatPanel();
        this.language = 'en';
        this.translation = translations[this.language];
    }

    setLanguage(language) {
        this.language = language;
        this.translation = translations[this.language];
    }

    getSnapshotCardInSnapshotPanel(index = 0) {
        return this.$$('.mstr-ai-chatbot-SnapshotCard')[index];
    }

    getCopyButtonInSnapshot() {
        return this.getMySnapshotsPanel().$('.mstr-ai-chatbot-CopyButton');
    }

    getMaximizeButtonInTeams(index = 0) {
        return this.$$('.mstr-ai-chatbot-FocusSnapshotButton')[index];
    }

    getEmptySnapshotText() {
        return this.getEmptySnapshotPanel().getText();
    }

    getEmptySnapshotImage() {
        return this.$('.mstr-ai-chatbot-SnapshotsPanelEmptyContent-image');
    }

    getCloseSnapshotsPanelButton() {
        return this.$(`div[aria-label='${this.translation.close}'][role='button']`);
    }

    getSortButton() {
        return this.$('.mstr-ai-chatbot-SnapshotSortButton');
    }

    getSortMenu() {
        return this.$('.mstr-ai-chatbot-SnapshotSortButton-content');
    }

    getSortByCheckBox(sortBy) {
        return this.getSortMenu().$(`div[role="menuitemcheckbox"]=${sortBy}`);
    }

    isSortByChecked(sortBy) {
        return this.getSortByCheckBox(sortBy).getAttribute('aria-checked') === 'true';
    }

    getSearchInput() {
        return this.$(`input[aria-label='${this.translation.searchSnapshots}']`);
    }

    getSearchInputFocused() {
        return this.$(`input[aria-label='${this.translation.searchSnapshots}'][class*='focus-visible']`);
    }

    getClearSnapshotsButton() {
        return this.$('button[aria-label="Clear Snapshots"]');
    }

    getClearSnapshotsController() {
        return this.$('.mstr-ai-chatbot-SnapshotsPanelContent-controller');
    }

    getConfirmClearSnapshotsButton() {
        return this.$('.mstr-ai-chatbot-ConfirmationButton-confirm');
    }

    getSnapshotsLoadingIcon() {
        return this.$('.mstr-ai-chatbot-Spinner.mstr-ai-chatbot-Spinner--grey');
    }

    getSnapshotActionBar(index = 0) {
        return this.$$('.mstr-ai-chatbot-SnapshotCard-rightFooter')[index];
    }

    async searchByText(text) {
        await browser.waitUntil(
            async () => {
                await this.click({ elem: this.getSearchInput() });
                const focusedInput = await this.getSearchInputFocused();
                return focusedInput.isDisplayed();
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'Click on input no response',
            }
        );
        await this.typeKeyboard(text);
    }

    async clearSearch() {
        await this.click({ elem: this.getSearchInput() });
        await this.typeKeyboard([[Key.Ctrl, 'a'], Key.Backspace]);
    }

    getNumberOfDisplayedSnapshotCard() {
        return this.$$('.mstr-ai-chatbot-SnapshotCard-content').length;
    }

    getSnapshotCardByText(text, language = 'en') {
        return SnapshotCard.createByText(text, language);
    }

    getSnapshotCardByTextV2(text, language = 'en') {
        return SnapshotCard.createByTextV2(text, language);
    }

    getSnapshotCardByQuestion(text, language = 'en') {
        return SnapshotCard.createByQuestion(text, language);
    }

    getSnapshotCardByIndex(index = 0, language = 'en') {
        return SnapshotCard.createByIndex(index, language);
    }

    async isSnapshotCardDisplayed(text) {
        const el = this.getSnapshotCardByText(text);
        return el.getSnapshotContent().isDisplayed();
    }

    getSnapshotCategoryAreaByName(name, language = 'en') {
        return SnapshotCategoryArea.create(name, language);
    }

    getMySnapshotsPanel() {
        return this.$('.mstr-ai-chatbot-SnapshotsPanel');
    }

    getEmptySnapshotPanel() {
        return this.$('.mstr-ai-chatbot-SnapshotsPanelEmptyContent');
    }

    getSnapshotPanelHeader() {
        return this.$('.mstr-ai-chatbot-SnapshotsPanel-headerTitle');
    }

    getSnapshotPanelViz(index) {
        return this.getMySnapshotsPanel().$$('.mstrmojo-VIVizPanel-content ')[index];
    }

    getFocusSnapshotButton(index = 0) {
        return this.getMySnapshotsPanel().$$('.mstr-ai-chatbot-FocusSnapshotButton')[index];
    }

    getSortContent() {
        return this.$('.mstr-ai-chatbot-SnapshotSortButton-content');
    }

    getSnapshotFocusViewCloseButton() {
        return this.$('.mstr-ai-chatbot-SnapshotFocusView-close');
    }

    getCategoryListPanel() {
        return this.$('.mstr-ai-chatbot-Popover-content');
    }

    getCategoryCount() {
        return this.getCategoryListPanel().$$('.mstr-ai-chatbot-MoveSnapshotButton-category').length;
    }

    getInterpretationFromSnapshot() {
        return this.$(
            `div[class='mstr-ai-chatbot-Clickable mstr-ai-chatbot-IconButton mstr-ai-chatbot-InterpreteButton']`
        );
    }

    getMaximizeButtonFromSnapshot() {
        return this.$('.mstr-ai-chatbot-FocusSnapshotButton');
    }

    getSnapshotNuggetTriggerIcon() {
        return this.$(
            `//div[contains(@class, 'mstr-ai-chatbot-SnapshotsPanel')]//following-sibling::div[contains(@class, 'mstr-ai-chatbot-CIInterpretedAs-nugget-trigger')]`
        );
    }

    getSnapshotNuggetsPopoverContentDatasetTitle() {
        return this.$('.mstr-ai-chatbot-CINuggetsPopoverContent-nugget-right-title');
    }

    getSnapshotNuggetsPopoverContentDefinition() {
        return this.$(
            `//div[contains(@class, 'mstr-ai-chatbot-CINuggetsPopoverContent-nugget-right')]//div[contains(@class, 'mstr-ai-chatbot-TruncatedText-content')]`
        );
    }

    getInterpretationFromMaximizeView() {
        return this.$(
            `//div[contains(@class, 'mstr-ai-chatbot-SnapshotFocusView-rightHeader')]//div[contains(@class, 'mstr-ai-chatbot-InterpreteButton')]`
        );
    }

    getNuggetTriggerIconFromMaximizeView() {
        return this.$(
            `//div[contains(@class, 'mstr-ai-chatbot-SnapshotFocusView-content')]//div[contains(@class, 'mstr-ai-chatbot-Clickable mstr-ai-chatbot-CIInterpretedAs-nugget-trigger')]`
        );
    }

    getNuggetsPopoverContentDatasetTitleFromMaximizeView() {
        return this.$(`//div[contains(@class, 'mstr-ai-chatbot-CINuggetsPopoverContent-nugget-right-title')]`);
    }

    getNuggetsPopoverContentDefinitionFromMaximizeView() {
        return this.$(
            `//div[contains(@class, 'mstr-ai-chatbot-SnapshotFocusView-content')]//div[contains(@class, 'mstr-ai-chatbot-CINuggetsPopoverContent-nugget')]//div[contains(@class, 'mstr-ai-chatbot-TruncatedText-content')]`
        );
    }

    async clickNuggetTriggerIconFromMaximizeView() {
        await this.click({ elem: this.getNuggetTriggerIconFromMaximizeView() });
    }

    async clickInterpretationFromMaximizeView() {
        await this.click({ elem: this.getInterpretationFromMaximizeView() });
    }

    async clickSnapshotNuggetTriggerIcon() {
        await this.click({ elem: this.getSnapshotNuggetTriggerIcon() });
    }

    async clickInterpretationFromSnapshot() {
        await this.click({ elem: this.getInterpretationFromSnapshot() });
    }

    async clickMaximizeButtonFromSnapshot() {
        await this.click({ elem: this.getMaximizeButtonFromSnapshot() });
    }

    async clickMaximizeButton(index = 0) {
        await this.click({ elem: this.getMaximizeButtonInTeams(index) });
    }

    async clickSortButton() {
        await this.click({ elem: this.getSortButton() });
        await browser.waitUntil(
            async () => {
                return this.getSortContent().isDisplayed();
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'Copy snapshot no response',
            }
        );
    }

    async setSortBy(sortBy) {
        await this.clickSortButton();
        await this.click({ elem: this.$(`div=${sortBy}`) });
    }

    async setSnapshotTimeForAll(value) {
        await browser.execute((value) => {
            const snapshotTimes = document.querySelectorAll('.mstr-ai-chatbot-SnapshotCard-date');
            snapshotTimes.forEach((snapshotTime) => {
                snapshotTime.textContent = value;
            });
        }, value);
    }

    async clickFocusSnapshotButton(index = 0) {
        await this.getFocusSnapshotButton(index).click();
    }

    async clickCloseFocusViewButton() {
        await this.click({ elem: this.getSnapshotFocusViewCloseButton() });
    }

    async isClearSnapshotButtonDisplayed() {
        return await this.getClearSnapshotsButton().isDisplayed();
    }

    async clickClearSnapshots() {
        await this.click({ elem: this.getClearSnapshotsButton() });
    }

    async clickConfirmClearSnapshotsButton() {
        await this.click({ elem: this.getConfirmClearSnapshotsButton() });
        await this.waitForElementInvisible(this.getSnapshotsLoadingIcon());
    }

    async clearSnapshot() {
        if (await this.isClearSnapshotButtonDisplayed()) {
            await this.clickClearSnapshots();
            await this.clickConfirmClearSnapshotsButton();
        }
    }

    async clickBackToChatPanel() {
        await this.click({ elem: this.getBackButton() });
    }

    async closeSnapshotsPanel() {
        await this.click({ elem: this.getCloseSnapshotsPanelButton() });
    }

    async isEmptySnapshotPanelDisplayed() {
        return await this.getEmptySnapshotPanel().isDisplayed();
    }

    async waitForSnapshotCardLoaded(index = 0) {
        await this.waitForElementVisible(this.getSnapshotCardInSnapshotPanel(index));
    }

    async waitForExportComplete() {
        await this.waitForElementStaleness(this.getSnapshotsLoadingIcon(), {
            timeout: this.DEFAULT_LOADING_TIMEOUT,
            msg: 'Exporting takes too long.',
        });
        return this.sleep(2000); // Time buffer for animation
    }
}
