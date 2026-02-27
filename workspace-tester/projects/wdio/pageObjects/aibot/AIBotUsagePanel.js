import BasePage from '../base/BasePage.js';

export default class AIBotUsagePanel extends BasePage {
    constructor() {
        super();
    }

    // Element locator
    getUsagePanelHeader() {
        return this.$('.mstr-ai-chatbot-Header-label');
    }
    getUsageDateRangeDropdown() {
        return this.$('.mstr-ai-chatbot-PeriodDropdown-usageRecordsSelect');
    }

    getUsageContent() {
        return this.$('.mstr-ai-chatbot-Tabs-usage');
    }

    getUsageDateRange(text) {
        return this.$$('.mstr-ai-chatbot-Select-item').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === text;
        })[0];
    }

    getUsageTileName(text) {
        return this.$$('.mstr-ai-chatbot-TileItem-title').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === text;
        })[0];
    }

    getUsageTileValueByTitle(title) {
        const tileItemWrapper = this.$$('.mstr-ai-chatbot-TileItem-wrapper').filter(async (elem) => {
            const elemTitle = await elem.$('.mstr-ai-chatbot-TileItem-title').getText();
            return elemTitle === title;
        })[0];
        return tileItemWrapper.$('.mstr-ai-chatbot-TileItem-value');
    }

    getResponseTooltip() {
        return this.$('.mstr-ai-chatbot-TileItem-infoIconWrapper');
    }

    getUsageDownloadButton() {
        return this.$('.mstr-ai-chatbot-Header-download');
    }

    getUsageDownloadFailedMessage() {
        return this.$('.mstr-ai-chatbot-FailedDownloadDialog-msg');
    }

    getUsageDownloadFailedMessageDashboard() {
        return this.$('.mstrd-MessageBox-msg');
    }

    getErrorMessageArrow() {
        return this.$('.icon-submenu_arrow');
    }

    getUsageDownloadErrorDetails() {
        return this.$('#mstrd-MessageBox-detailsText-1 > div');
    }

    getUsageDownloadFailedOkButton() {
        return this.$('.mstr-ai-chatbot-Button');
    }

    getUsageDownloadFailedOkButtonDashboard() {
        return this.$('.mstrd-ActionLinkContainer-text');
    }

    getUsagePanelMessage() {
        return this.$('.mstr-ai-chatbot-UsagePanel-message');
    }

    getDashboardPropertiesTab(text) {
        return this.$$('.mstrmojo-DocProps-Editor-Tabs .item').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === text;
        })[0];
    }

    getEnableInterpretationButton() {
        return this.$(
            '.mstrmojo-DocProps-Editor .mstrmojo-Editor-content .mstrmojo-DocProps-Editor-Auto table td .mstrmojo-ui-Checkbox'
        );
    }

    getOkButton() {
        return this.$('.mstrmojo-Button-text=OK');
    }

    // Action helper
    async clickUsageDateRangeDropdown() {
        await this.click({ elem: this.getUsageDateRangeDropdown() });
    }

    async clickUsageDateRange(text) {
        const itemElement = this.getUsageDateRange(text);
        await this.waitForElementVisible(itemElement);
        await itemElement.click();
    }

    async hoverOnResponseTooltip() {
        await this.hover({ elem: this.getResponseTooltip() });
    }

    async clickUsageDownloadButton() {
        await this.click({ elem: this.getUsageDownloadButton() });
    }

    async clickUsageDownloadFailedOkButton() {
        const downloadButton = this.getUsageDownloadFailedOkButton();
        await this.waitForElementVisible(downloadButton);
        await downloadButton.click();
    }

    async clickUsageDownloadFailedOkButtonDashboard() {
        const downloadButton = this.getUsageDownloadFailedOkButtonDashboard();
        await this.waitForElementVisible(downloadButton);
        await downloadButton.click();
    }

    async clickErrorMessageArrow() {
        const errorMessageArrow = this.getErrorMessageArrow();
        await this.waitForElementVisible(errorMessageArrow);
        await errorMessageArrow.click();
    }

    async clickDashboardPropertiesTab(text) {
        const autoTab = this.getDashboardPropertiesTab(text);
        await this.waitForElementVisible(autoTab);
        await autoTab.click();
    }

    async clickInterpretationButton() {
        const interpretationButton = this.getEnableInterpretationButton();
        await this.waitForElementVisible(interpretationButton);
        await interpretationButton.click();
    }

    async enableInterpretation() {
        const isChecked = await this.isInterpretationEnabled();
        if (isChecked === 'false') {
            await this.clickInterpretationButton();
        }
    }

    async disableInterpretation() {
        const isChecked = await this.isInterpretationEnabled();
        if (isChecked === 'true') {
            await this.clickInterpretationButton();
        }
    }

    async clickOkButton() {
        const okButton = this.getOkButton();
        await this.waitForElementVisible(okButton);
        await okButton.click();
    }

    // Assertion helper
    async isResponseTooltipDisplayed() {
        return await this.getResponseTooltip().isDisplayed();
    }

    async isUsageTileValueDisplayed(title) {
        const tileValueElement = await this.getUsageTileValueByTitle(title);
        return await tileValueElement.isDisplayed();
    }

    async isUsageTileValueHidden(title) {
        try {
            const tileValueElement = await this.getUsageTileValueByTitle(title);
            return await tileValueElement.isDisplayed();
        } catch {
            return true;
        }
    }

    async isUsageTileValueCorrect(title, expectedValue) {
        const tileValueElement = await this.getUsageTileValueByTitle(title);
        const actualValue = await tileValueElement.getText();
        console.log(actualValue);
        return actualValue == expectedValue;
    }

    async isInterpretationEnabled() {
        const isChecked = (await this.getEnableInterpretationButton()).getAttribute('aria-checked');
        return isChecked;
    }
}
