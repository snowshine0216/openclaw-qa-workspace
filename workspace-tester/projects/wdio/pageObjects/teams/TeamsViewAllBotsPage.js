import ModalDialog from './ModalDialog.js';
import { scrollElementToBottom, scrollElementToTop } from '../../utils/scroll.js';

export default class TeamsViewAllBotsPage extends ModalDialog {
    // locators
    getIframe() {
        return this.$('iframe');
    }

    getDialogLoader() {
        return this.getDialog().$(`div[role='progressbar']`);
    }

    getBotListContainer() {
        return this.$('.mstrd-ViewMorePage .mstrd-VirtualizedDossierList');
    }

    getBotItemByIndex(index) {
        return this.$(`(//div[@class='mstrd-DossierInfoContainer'])[${index}]`);
    }

    getTooltipContainer() {
        return this.$('.ant-popover .mstrd-DossierInfoContainer-popover:not(.ant-popover-hidden)');
    }

    // actions
    async closeViewAllBotsWindow() {
        await browser.switchToFrame(null);
        const isDialogVisible = await this.getDialog().isDisplayed();
        if (isDialogVisible) {
            await this.click({ elem: this.getCloseButtonInMessageExtension() });
        }
    }

    async waitForLoadingInViewAllBots() {
        const elem = this.getBotListContainer();
        await this.waitForElementVisible(this.getIframe());
        await this.waitForElementInvisible(this.getDialogLoader());
        await this.switchToLibraryIframe();
        await this.waitForElementVisible(elem);
    }

    async triggerTooltipOnBotItem(index = 1) {
        await this.click({ elem: this.getBotItemByIndex(index) });
        await this.sleep(1000); // wait for tooltip annimation
        await this.waitForElementVisible(this.getTooltipContainer());
    }

    async scrollToBottom() {
        await scrollElementToBottom(this.getBotListContainer());
    }

    async scrollToTop() {
        await scrollElementToTop(this.getBotListContainer());
    }
}
