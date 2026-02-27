import BotAuthoring from './BotAuthoring.js';

export default class CacheManager extends BotAuthoring {
    constructor() {
        super();
    }

    // Element locators

    getCloseCacheManagerButton() {
        return this.$('.mstr-nav-icon.icon-pnl_close');
    }

    getCacheSettingBackdrop() {
        return this.$('.mstr-ai-chatbot-CacheSettingsDialog-backdrop');
    }

    getCacheSettingIcon() {
        return this.$('.mstr-ai-chatbot-CacheQuestionGroups-header-settings-icon');
    }

    getCacheSettingsDialog() {
        return this.$('.mstr-ai-chatbot-CacheSettingsDialog');
    }

    getCachingModeDropdownTrigger() {
        return this.getCacheSettingsDialog().$('.mstr-ai-chatbot-Select-selectTrigger');
    }

    getCachingModeDropdown() {
        return this.$('.mstr-ai-chatbot-Select-viewport');
    }

    getCachingModeOption(text) {
        return this.getCachingModeDropdown()
            .$$('.mstr-ai-chatbot-Select-item')
            .filter(async (item) => {
                const itemText = await item.getText();
                return itemText.includes(text);
            })[0];
    }

    getDeleteCachesButton() {
        return this.$('.mstr-ai-chatbot-CacheSettingsDialog-delete-button');
    }

    getBucketPanel() {
        return this.$('.mstr-ai-chatbot-CacheQuestionGroups');
    }

    getCachingBuckets() {
        return this.$$('.mstr-ai-chatbot-CacheQuestionCard');
    }

    getCachingBucketByName(name) {
        return this.getCachingBuckets().filter(async (bucket) => {
            const title = await bucket.$('.mstr-ai-chatbot-CacheQuestionCard-question-text').getText();
            return title === name;
        })[0];
    }

    getBucketsContextMenuIcon(index) {
        return this.getCachingBuckets()[index].$('.mstr-ai-chatbot-CacheQuestionCard-dropdown-trigger');
    }

    getBucketContextMenuContainer() {
        return this.$('.mstr-ai-chatbot-CacheQuestionCard-context-menu');
    }

    getBucketContextMenuOption(option) {
        return this.getBucketContextMenuContainer()
            .$$('.mstr-ai-chatbot-CacheQuestionCard-menu-item,.mstr-ai-chatbot-CacheQuestionCard-submenu-merge-trigger')
            .filter(async (item) => {
                const txt = await item.getText();
                return txt.includes(option);
            })[0];
    }

    getBucketGroupList() {
        return this.$('.mstr-ai-chatbot-CacheQuestionCard-submenu-merge-content');
    }

    getBucketGroupListItems(index) {
        return this.getBucketGroupList().$$('.mstr-chatbot-markdown')[index];
    }

    getBucketPinTitle() {
        return this.$('.mstr-ai-chatbot-CacheQuestionGroups-collapsible-title');
    }

    getQuestionPanel() {
        return this.$('.mstr-ai-chatbot-CacheQuestionsPanel');
    }

    getQuestionDetailsPanel() {
        return this.$('.mstr-ai-chatbot-CacheQuestionsPanel-caching-container');
    }

    getViewSQLLink() {
        return this.$('.mstr-ai-chatbot-CacheQuestionsPanel-sql-link');
    }

    getSQLDialog() {
        return this.$('.mstr-ai-chatbot-SQLDialog');
    }

    getSQLDialogHeader() {
        return this.getSQLDialog().$('.mstr-ai-chatbot-SQLDialog-code-editor-header');
    }

    getSQLDialogCloseBtn() {
        return this.getSQLDialog().$('.mstr-ai-chatbot-SQLDialog-header-close');
    }

    getVerifySQLBtn() {
        return this.getSQLDialog().$('.mstr-ai-chatbot-SQLDialog-verify-button');
    }

    getSQLOutputPanel() {
        return this.$('.mstr-ai-chatbot-SQLDialog-output-panel');
    }

    getSQLOutPutText() {
        return this.getSQLOutputPanel().$('.mstr-ai-chatbot-SQLDialog-output-panel-text').getText();
    }

    getSaveSQLBtn() {
        return this.getSQLDialog().$('.mstr-ai-chatbot-SQLDialog-save-button');
    }

    getQuestionRows() {
        return this.$$('.ag-center-cols-container .ag-row');
    }

    getQuestionRowByIndex(index) {
        return this.getQuestionRows()[index];
    }

    getQuestionExpandIcon(index) {
        return this.getQuestionRowByIndex(index).$('.ag-group-contracted:not(.ag-hidden)');
    }

    getQuestionOptionIcon(index) {
        return $$('span[data-feature-id="aibot-cache-questions-grid-options-v2"]')[index];
    }

    getQuestionContextMenu() {
        return this.$('.mstr-ai-chatbot-CacheQuestionsPanel-question-context-menu');
    }

    getQuestionContextMenuOption(option) {
        return this.getQuestionContextMenu()
            .$$('.mstr-ai-chatbot-CacheQuestionsPanel-question-menu-item')
            .filter(async (item) => {
                const txt = await item.getText();
                return txt.includes(option);
            })[0];
    }

    getDropdownQuestionList(index) {
        return this.$$('.mstr-ai-chatbot-QuestionGroupListItem-item')[index];
    }

    getCreateNewBucketOption() {
        return this.$('.mstr-ai-chatbot-MoveToDropdown-item--create');
    }

    getQuestionAnswerPanel() {
        return this.$('.mstr-ai-chatbot-CacheQuestionAnswer');
    }

    getColumnsButton() {
        return this.$$('.ag-side-buttons .ag-side-button').filter(async (ele) => {
            const title = await ele.getText();
            return title === 'Columns';
        })[0];
    }

    getColumnContainer() {
        return this.$('.ag-virtual-list-container.ag-column-select-virtual-list-container');
    }

    getColumns() {
        return this.$$('.ag-column-select-virtual-list-container .ag-virtual-list-item');
    }

    getColumnsByName(name) {
        return this.getColumns().filter(async (ele) => {
            const title = await ele.$('.ag-column-select-column-label').getText();
            return title === name;
        })[0];
    }

    getColumnCheckboxByName(name) {
        return this.getColumnsByName(name).$('.ag-column-select-checkbox .ag-checkbox-input-wrapper');
    }

    getToast() {
        return this.$('.mstr-ai-chatbot-Toast-viewport');
    }

    getBucketSearchBox() {
        return this.getBucketPanel().$('.mstr-ai-chatbot-SearchBox>input');
    }

    getBucketClearSearchIcon() {
        return this.getBucketPanel().$('.mstr-ai-chatbot-SearchBox-clear');
    }

    // Action methods
    async closeCacheManager() {
        await this.click({ elem: this.getCloseCacheManagerButton() });
        await this.waitForElementInvisible(this.getCacheManagerPage());
    }

    async openCacheSettings() {
        if (!(await this.isCacheSettingsDialogDisplayed())) {
            await this.click({ elem: this.getCacheSettingIcon() });
            await this.waitForElementVisible(this.getCacheSettingsDialog());
        }
    }

    async closeCacheSettings() {
        if (await this.isCacheSettingsDialogDisplayed()) {
            await this.getCacheSettingIcon().click();
            await this.waitForElementInvisible(this.getCacheSettingsDialog());
        }
    }
    async openCachingModeDropdown() {
        await this.click({ elem: this.getCachingModeDropdownTrigger() });
        return this.waitForElementVisible(this.getCachingModeDropdown());
    }

    async selectCachingMode(mode) {
        if (!(await this.getCurrentCachingMode()).includes(mode)) {
            await this.openCachingModeDropdown();
            await this.click({ elem: this.getCachingModeOption(mode) });
            await this.waitForElementInvisible(this.getCacheSettingsDialog());
        } else {
            await this.closeCacheSettings();
        }
    }

    async deleteCaches() {
        await this.click({ elem: this.getDeleteCachesButton() });
        await this.waitForElementInvisible(this.getAIBotEditLoading());
    }

    async openBucketContextMenu(index = 0) {
        await this.hover({ elem: (await this.getCachingBuckets())[index] });
        await this.click({ elem: this.getBucketsContextMenuIcon(index) });
        return this.waitForElementVisible(this.getBucketContextMenuContainer());
    }

    async selectBucketContextMenuOption(firstOption, secondOptionIndex) {
        await this.waitForElementVisible(this.getBucketContextMenuContainer());
        await this.click({ elem: this.getBucketContextMenuOption(firstOption) });
        if (secondOptionIndex !== undefined && secondOptionIndex !== null) {
            await browser.execute((el) => el.click(), await this.getBucketGroupListItems(secondOptionIndex));
        }
        await this.waitForPageLoading();
        return this.sleep(500); // Wait for animation to complete
    }

    async openBucketByIndex(index = 0) {
        await this.click({ elem: this.getCachingBuckets()[index] });
        await this.waitForElementVisible(this.getQuestionPanel());
        await this.waitForPageLoading();
        await this.waitForElementVisible(this.getQuestionRowByIndex(0));
        return this.sleep(1000); // Wait for animation to complete
    }

    async openBucketByName(text) {
        await this.click({ elem: this.getCachingBucketByName(text) });
        await this.waitForElementVisible(this.getQuestionPanel());
        await this.waitForPageLoading();
        await this.waitForElementVisible(this.getQuestionRowByIndex(0));
        return this.sleep(1000); // Wait for animation to complete
    }

    async openViewSQL() {
        await this.click({ elem: this.getViewSQLLink() });
        await this.waitForElementVisible(this.getSQLDialog());
    }

    async verifySQL() {
        await this.click({ elem: this.getVerifySQLBtn() });
        await this.waitForPageLoading();
        await this.waitForElementVisible(this.getSQLOutputPanel());
    }

    async saveSQL() {
        await this.click({ elem: this.getSaveSQLBtn() });
        await this.waitForPageLoading();
    }

    async closeViewSQL() {
        await this.click({ elem: this.getSQLDialogCloseBtn() });
        await this.waitForElementInvisible(this.getSQLDialog());
    }

    async expandQuestion(index = 0) {
        await this.click({ elem: await this.getQuestionExpandIcon(index) });
        await this.waitForPageLoading();
        await this.waitForElementVisible(this.getQuestionAnswerPanel());
    }

    async openQuestionContextMenu(index = 0) {
        console.log(`log: open context menu for the ${index + 1} question `);
        await this.click({ elem: await this.getQuestionOptionIcon(index) });
        await this.waitForElementVisible(this.getQuestionContextMenu());
    }

    async selectQuestionContextMenuOption(firstOption, secondOption) {
        await this.waitForElementVisible(this.getQuestionContextMenu());
        await this.click({ elem: this.getQuestionContextMenuOption(firstOption) });
        if (secondOption !== undefined && secondOption !== null) {
            // if it is index, then click by index, otherwise click by text
            if (typeof secondOption === 'number') {
                await browser.execute((el) => el.click(), await this.getDropdownQuestionList(secondOption));
            }
            if (secondOption === 'Create New Bucket') {
                console.log('log: move to New Bucket');
                await browser.execute((el) => el.click(), await this.getCreateNewBucketOption());
                await this.sleep(1000); // Wait for loading to begins
            }
            await this.waitForPageLoading();
        }
        await this.waitForPageLoading();
        return this.sleep(500); // Wait for animation to complete
    }

    async expandColumns() {
        if (!(await this.getColumns()[0].isDisplayed())) {
            await this.click({ elem: this.getColumnsButton() });
            await this.waitForElementVisible(this.getColumns()[0]);
        }
    }

    async collapseColumns() {
        if (await this.getColumns()[0].isDisplayed()) {
            await this.click({ elem: this.getColumnsButton() });
            await this.waitForElementInvisible(this.getColumns()[0]);
        }
    }

    async selectColumnByName(text) {
        if (!(await this.isColumnCheckedByName(text))) {
            await this.click({ elem: await this.getColumnCheckboxByName(text) });
        }
    }

    async waitForToastGone() {
        await this.waitForElementAppearAndGone(this.getToast());
    }

    async searchBuckets(text) {
        await this.clear({ elem: this.getBucketSearchBox() });
        await this.getBucketSearchBox().setValue(text);
        await this.waitForPageLoading();
    }

    async clearSearch() {
        await this.click({ elem: this.getBucketClearSearchIcon() });
        await this.waitForPageLoading();
    }

    // Assertion methods
    async isCacheSettingsDialogDisplayed() {
        return this.getCacheSettingsDialog().isDisplayed();
    }

    async getCurrentCachingMode() {
        return this.getCachingModeDropdownTrigger().getText();
    }

    async isDeleteCachesButtonDisplayed() {
        return this.getDeleteCachesButton().isDisplayed();
    }

    async getCachingBucketsCount() {
        const buckets = await this.getCachingBuckets();
        return buckets ? buckets.length : 0;
    }

    async getQuestionListCount() {
        const questions = await this.getQuestionRows();
        return questions ? questions.length : 0;
    }

    async getBucketPinCount() {
        const text = await this.getBucketPinTitle().getText();
        const match = text.match(/\((\d+)\)/);
        return match ? parseInt(match[1], 10) : 0;
    }

    async isColumnCheckedByName(name) {
        const className = await this.getColumnCheckboxByName(name).getAttribute('class');
        return className.includes('ag-checked');
    }
}
