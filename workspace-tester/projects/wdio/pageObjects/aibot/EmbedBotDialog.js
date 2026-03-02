import BasePage from '../base/BasePage.js';
import InfoWindow from '../library/InfoWindow.js';

export default class EmbedBotDialog extends BasePage {
    constructor() {
        super();
        this.infoWindow = new InfoWindow();
    }

    // Element Selectors
    getEmbedBotFromShareMenu(text = 'Embed Agent') {
        return this.$(`//span[text()='${text}']//ancestor::div[@aria-label='${text}']`);
    }

    getEmbedBotDialogContainer() {
        return this.$('.mstrd-EmbedBotContainer-main');
    }

    getEmbedBotDialogClose() {
        return this.getEmbedBotDialogContainer().$('.icon-pnl_close');
    }

    getEmbedBotDialogDownloadSnippet() {
        return this.getEmbedBotDialogContainer().$('.mstrd-Button');
    }

    getEmbedBotDialogHideSnapshotsToggle() {
        return this.getEmbedBotDialogContainer().$('.mstrd-EmbedBotContainer-checkBox');
    }

    getEmbedBotHideEntry() {
        return this.getEmbedBotDialogContainer().$('//div[text()="Select panels"]//ancestor::div[@role="combobox"]');
    }

    getEmbedBotHideDropDownOption(name) {
        return this.getEmbedBotDialogContainer().$(`//div[@role="option" and text()="${name}"]`);
    }

    getEmbedBotDialogLearnMore() {
        return this.getEmbedBotDialogContainer().$('.mstrd-EmbedBotContainer-contentLink');
    }

    getNameAndTime() {
        return this.getEmbedBotDialogContainer().$('.mstrd-EmbedBotContainer-nameAndTime');
    }

    // Action Methods
    async openEmbedBotFromShareMenu(text = 'Embed Agent') {
        await this.click({ elem: this.getEmbedBotFromShareMenu(text) });
        await this.waitForElementVisible(this.getEmbedBotDialogContainer());
    }

    async openEmbedBotFromInfoWindow() {
        await this.click({ elem: this.infoWindow.getEmbeddedBotButton() });
        await this.waitForElementVisible(this.getEmbedBotDialogContainer());
    }

    async closeEmbedBotDialog() {
        await this.click({ elem: this.getEmbedBotDialogClose() });
        await this.waitForElementInvisible(this.getEmbedBotDialogContainer());
    }

    async downloadEmbedBotSnippet() {
        await this.click({ elem: this.getEmbedBotDialogDownloadSnippet() });
        await this.waitForElementInvisible(this.getEmbedBotDialogContainer());
    }

    async toggleHideSnapshots() {
        await this.click({ elem: this.getEmbedBotDialogHideSnapshotsToggle() });
    }

    async openHideDropdown() {
        await this.click({ elem: this.getEmbedBotHideEntry() });
        await this.waitForElementVisible(this.getEmbedBotHideDropDownOption('My Snapshots'));
    }

    async selectHideOption(name) {
        await this.click({ elem: this.getEmbedBotHideDropDownOption(name) });
    }

    async openEmbedBotLearnMoreLink() {
        await this.click({ elem: this.getEmbedBotDialogLearnMore() });
    }

    async hideNameAndTime() {
        await this.hideElement(this.getNameAndTime());
    }

    // Assertion Helpers
}
