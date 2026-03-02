import BasePage from '../base/BasePage.js';

export default class EmbedPromptEditor extends BasePage {
    // Element locator
    getPromptEditorContainer() {
        return this.$(`div.embeded-prompt-modal[role='dialog']`);
    }

    getPromptEditorHeader() {
        return this.getPromptEditorContainer().$('ant-modal-header');
    }

    getLoadingIndicatorInObjectBrowser() {
        return this.getPromptEditorContainer().$('.search-status.mstr-object-list-loading');
    }

    getPromptSummaryContainer() {
        return this.getPromptEditorContainer().$('.prompt-summary');
    }

    getPromptEditorFooter() {
        return this.getPromptEditorContainer().$('.ant-modal-footer');
    }

    getButtonsContainerInFooter() {
        return this.getPromptEditorFooter().$('.mstr-button-container');
    }

    getDoneButton() {
        return this.getButtonsContainerInFooter().$('.ant-btn-primary');
    }

    getCancelButton() {
        return this.getButtonsContainerInFooter().$('.ant-btn-default');
    }

    // Actions
    async waitForLoading() {
        await this.waitForElementInvisible(this.getLoadingIndicatorInObjectBrowser());
        await this.waitForElementVisible(this.getPromptSummaryContainer());
    }
    async clickDoneButton() {
        await this.click({ elem: this.getDoneButton() });
        await this.waitForElementInvisible(this.getPromptEditorContainer());
    }

    async clickCancelButton() {
        await this.click({ elem: this.getCancelButton() });
        await this.waitForElementInvisible(this.getPromptEditorContainer());
    }
}
