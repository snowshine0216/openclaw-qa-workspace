import BasePage from '../base/BasePage.js';
import { scrollElementToBottom, scrollElementToTop } from '../../utils/scroll.js';

export default class BaseBotConfigTab extends BasePage {
    // Element locator

    getTooltip() {
        return this.$('.mstr-ai-chatbot-Tooltip');
    }

    getTooltipFull() {
        return this.getTooltip().$('span[role=tooltip]');
    }

    getCurrentTabContainer() {
        return this.$(`[data-state='active'].mstr-ai-chatbot-ConfigTabs-content`);
    }

    getBotTitle() {
        return this.$('.mstrd-DossierTitle-segment');
    }

    // Action helper

    async getTooltipFullText() {
        return this.getTooltipFull().getText();
    }

    async getTooltipDisplayedText() {
        const innerHtmlText = await this.getTooltip().getText();
        return innerHtmlText.split('\n')[0];
    }

    async waitForTooltipDisplayed() {
        await this.waitForElementVisible(this.getTooltip());
    }

    async scrollToBottom() {
        await scrollElementToBottom(this.getCurrentTabContainer());
    }

    async scrollToTop() {
        await scrollElementToTop(this.getCurrentTabContainer());
    }

    async resetInput({ elem }) {
        await this.waitForElementVisible(elem);
        await this.click({ elem });
        await this.ctrlA();
        await this.delete();
        await this.tabForward();
    }

    async dismissFocus() {
        return this.click({ elem: this.getBotTitle() });
    }
}
