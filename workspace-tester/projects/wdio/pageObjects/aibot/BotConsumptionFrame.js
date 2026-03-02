import BasePage from '../base/BasePage.js';
import AIBotChatPanel from './AIBotChatPanel.js';

export default class BotConsumptionFrame extends BasePage {
    constructor() {
        super();
        this.aiBotChatPanel = new AIBotChatPanel();
    }
    // Element locator
    getAccountIconInToolbar() {
        return this.$('.icon-tb_profile_n');
    }

    getShareButtonInToolbar() {
        return this.$('.icon-tb_share_n');
    }

    getEditButton() {
        return this.$('.icon-info_edit');
    }

    getBotConsumptionContaniner() {
        return this.$('.mstrd-DossierViewContainer');
    }

    getBotConsumptionToolbar() {
        return this.$('.mstrd-DossierViewNavBarContainer');
    }

    getBotNameSegmentInToolbar() {
        return this.$('.mstrd-DossierTitle span');
    }

    getBotName() {
        return this.$('.mstrd-DossierTitle span').getText();
    }

    getMessageBox() {
        return this.$$('.mstrd-MessageBox-main.mstrd-MessageBox-main--modal')[0];
    }

    getCloseButtonInMessageBox() {
        return this.getMessageBox().$('.mstrd-MessageBox-actionContainer');
    }
    getMessageBoxTitle() {
        return this.getMessageBox().$('.mstrd-MessageBox-title');
    }

    getMessageBoxTitleText() {
        return this.getMessageBox().$('.mstrd-MessageBox-title').getText();
    }

    getOkButtonInNeedPermissionMessageBox() {
        return this.getMessageBox().$('.mstrd-MessageBox-actionContainer').$$('[role="button"]')[0];
    }

    getShowDetailsButton() {
        return this.getMessageBox().$('.mstrd-MessageBox-detailsBtn>span');
    }

    getDetailSectionInMessageBox() {
        return this.getMessageBox().$('.mstrd-MessageBox-errorDetails.show');
    }

    getEditAppearanceButton() {
        return this.$('.mstr-icons-lib-icon mstr-ai-chatbot-ConfigTabs-appearance');
    }

    // Inactive banner element locators
    getInactiveBanner() {
        return this.$('.mstrd-PageNotification-container--inactive');
    }

    getInactiveBannerMessage() {
        return this.$('.mstrd-PageNotification-msg--inactive');
    }

    // Action helper
    async clickEditButton() {
        await this.waitForElementVisible(this.getEditButton());
        await this.click({ elem: this.getEditButton() });
        if (await this.aiBotChatPanel.isRecommendationPanelPresent()) {
            await this.aiBotChatPanel.waitForRecommendationLoading();
        }
    }

    async clickCloseButtonInMessageBox() {
        await this.waitForElementVisible(this.getCloseButtonInMessageBox());
        await this.waitForElementEnabled(this.getCloseButtonInMessageBox());
        await this.clickAndNoWait({ elem: this.getCloseButtonInMessageBox() });
        return this.waitForElementInvisible(this.getMessageBox());
    }

    async clickOkButtonInNeedPermissionMessageBox() {
        await this.waitForElementVisible(this.getOkButtonInNeedPermissionMessageBox());
        await this.clickAndNoWait({ elem: this.getOkButtonInNeedPermissionMessageBox() });
        return this.waitForElementInvisible(this.getMessageBox());
    }

    async showDetail() {
        if (!(await this.getDetailSectionInMessageBox().isDisplayed())) {
            await this.clickAndNoWait({ elem: this.getShowDetailsButton() });
            await this.waitForElementVisible(this.getDetailSectionInMessageBox());
        }
    }

    async errorDetail() {
        return this.getMessageBox().$('.mstrd-MessageBox-errorDetails.show').getText();
    }

    async getInactiveBannerText() {
        await this.waitForElementVisible(this.getInactiveBannerMessage());
        return await this.getInactiveBannerMessage().getText();
    }

    // Assertion helper
    async isInactiveMsgDisplayed() {
        const isMsgBoxDisplayed = await this.getMessageBox().isDisplayed();
        if (!isMsgBoxDisplayed) {
            return false;
        }
        const isInActiveTextDisplayed =
            (await this.getMessageBox().$('.mstrd-MessageBox-title').getText()) === 'Inactive Bot';
        return isMsgBoxDisplayed && isInActiveTextDisplayed;
    }

    async isEditIconDisplayedInToolbar() {
        return await this.getEditButton().isDisplayed();
    }

    // Inactive banner assertion helpers
    async isInactiveBannerDisplayed() {
        return await this.getInactiveBanner().isDisplayed();
    }

}
