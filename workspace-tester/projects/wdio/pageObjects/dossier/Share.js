import { waitForFileToExist } from '../../config/folderManagement.js';

import BasePage from '../base/BasePage.js';
import ExcelExportPanel from '../export/ExcelExportPanel.js';

export default class Share extends BasePage {
    constructor() {
        super();
        this.excelExportPanel = new ExcelExportPanel();
    }
    // Element locators

    getShareIcon() {
        return this.$('.mstr-nav-icon.icon-tb_share_n');
    }

    getSharePanel() {
        return this.$('.mstrd-ShareDropdownMenuContainer .mstrd-DropdownMenu-main');
    }

    // =========
    getShareDropdown() {
        // return this.getSharePanel().element(by.cssContainingText('.mstrd-DropdownMenu mstrd-DropdownMenu-headerTitle', "Share and Export"));
        return this.$(
            "//div[@class='mstrd-DropdownMenu-main']//div[@class='mstrd-DropdownMenu-headerTitle' and text()='Share and Export']//ancestor::div[@class='mstrd-DropdownMenu-main']"
        );
    }

    getInviteUser() {
        return this.getShareDropdown().$('.mstrd-InviteMenuItemContainer');
    }

    getShareViaEmail() {
        return this.getShareDropdown().$('.mstrd-EmailMenuItemContainer');
    }

    getSharePanelHeader() {
        return this.getSharePanel().$('.mstrd-DropdownMenu-header');
    }

    getCloseIcon() {
        return this.getSharePanelHeader().$('.mstrd-DropdownMenu-headerIcon.icon-pnl_close');
    }

    getShareDossierButton() {
        return this.getSharePanel().$('.mstrd-ShareDossierMenuItemContainer .focusable[role="button"]');
    }
    getShareBotButton() {
        return this.getSharePanel().$(
            '.mstrd-ShareDossierMenuItemContainer .focusable[role="button"][aria-label="Share Bot"]'
        );
    }

    getExportPDFButton() {
        return this.getSharePanel().$('.mstrd-ExportMenuItemContainer .focusable[role="button"]');
    }

    getExportCSVButton() {
        return this.getSharePanel().$('.mstrd-ExportCsvItemContainer .focusable[role="button"]');
    }

    getExportGoogleSheetsButton() {
        return this.getSharePanel().$('.mstrd-ExportGoogleSheetsItemContainer .focusable[role="button"]');
    }

    getExportExcelButton() {
        return this.getSharePanel().$('.mstrd-ExportExcelItemContainer .focusable[role="button"]');
    }

    getSubscribeButton() {
        return this.getSharePanel().$('.mstrd-SubscribeMenuItemContainer .focusable[role="button"]');
    }

    getExportExcelButtonDisabled() {
        return this.getSharePanel().$('.mstrd-ShareItemContainer--disabled.mstrd-ExportExcelItemContainer');
    }

    getDownloadDossierButton() {
        // Good luck figuring this one out
        return this.getSharePanel().$('.focusable[role="button"][aria-label="Download Dashboard"]');
    }

    getShareInTeamsButton() {
        return this.getSharePanel().$('.focusable[role="button"][aria-label="Share in Teams"]');
    }

    getPinInTeamsButton() {
        return this.getSharePanel().$('.focusable[role="button"][aria-label="Pin in Teams"]');
    }

    // Temporary method for new string, delete this and modify the getDownloadDossierButton() method when dashboard is available for all environments
    getDownloadDashboardButton() {
        return this.getSharePanel().$('.focusable[role="button"][aria-label="Download Dashboard"]');
    }

    _getSpinner(elem) {
        return elem.$('.mstrd-Spinner');
    }

    getDownloadDossierSpinner() {
        return this._getSpinner(this.getDownloadDossierButton());
    }

    getExportPDFSpinner() {
        return this._getSpinner(this.getExportPDFButton());
    }

    getExportExcelSpinner() {
        return this._getSpinner(this.getExportExcelButton());
    }

    getDownloadDossier() {
        return this.$("//span[text()='Download Dashboard']//ancestor::div[@aria-label='Download Dashboard']");
    }

    getExportToPDF() {
        return this.getShareDropdown().$('.mstrd-ExportMenuItemContainer');
    }

    getManageAccess() {
        return this.getSharePanel().$('.mstrd-ManageAccessMenuItemContainer');
    }

    //new get share dossier panel and get,copy link
    getShareDossierPanel() {
        return this.$('.mstrd-ShareDossierContainer-main');
    }

    getShareDossierPanelItems() {
        return this.getSharePanel().$$('.mstrd-ShareItemContainer');
    }

    getPinInTeamsDialog() {
        return this.$('.mstrd-PinToTeamsTabDialog-main');
    }

    getHeaderPinInTeamsDialog() {
        return this.$('.mstrd-PinToTeamsTabDialog-top');
    }

    getContentInPinInTeamsDialog() {
        return this.$('.mstrd-PinToTeamsTabDialog-content');
    }

    // pin in teams dialog
    getTeamSelector() {
        return this.$('.ant-select-show-search');
    }

    getChannelSelector() {
        return this.$$('.ant-select-show-search')[1];
    }

    getDisabledChannelSelector() {
        return this.$('.ant-select-disabled');
    }

    getItemInDropdownList(name) {
        return this.$$('.ant-select-item-option-content').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === name;
        })[0];
    }

    getPinInPinToTeamDialog() {
        return this.$('button.mstrd-PinToTeamsTabDialog-pinBtn');
    }

    getPinBotToast() {
        return this.$('.ant-message-notice-content');
    }

    getViewInTabButton() {
        return this.$('.mstrd-PinToTeamsTabSuccessMessage-goToTab');
    }

    getCoverImage() {
        return this.$('.mstrd-ShareDossierContainer-imageHolder');
    }

    async selectChannelToPinBot({ team: teamName, channel: channelName }) {
        await this.click({ elem: this.getTeamSelector() });
        await this.click({ elem: this.getItemInDropdownList(teamName) });
        await this.waitForElementStaleness(this.getDisabledChannelSelector());
        await this.click({ elem: this.getChannelSelector() });
        await this.click({ elem: this.getItemInDropdownList(channelName) });
    }

    async dismissCursorInSelector() {
        await this.click({ elem: this.getHeaderPinInTeamsDialog() });
    }

    async pinBot() {
        await this.click({ elem: this.getPinInPinToTeamDialog() });
        await this.waitForElementVisible(this.getPinBotToast());
    }

    async selectChannelAndPinBot({ team: teamName, channel: channelName }) {
        await this.waitForElementClickable(this.getTeamSelector());
        await this.click({ elem: this.getTeamSelector() });
        await this.click({ elem: this.getItemInDropdownList(teamName) });
        await this.waitForElementClickable(this.getChannelSelector());
        await this.click({ elem: this.getChannelSelector() });
        await this.click({ elem: this.getItemInDropdownList(channelName) });
        await this.click({ elem: this.getPinInPinToTeamDialog() });
        await this.waitForElementVisible(this.getPinBotToast());
    }

    async viewPinnedObjectInTab() {
        await this.click({ elem: this.getViewInTabButton() });
    }

    getShareViaLink() {
        return this.getShareDossierPanel().$('.mstrd-LinkSection-link').getText();
    }

    getCopyButton() {
        return this.getShareDossierPanel().$('.mstrd-LinkSection-copyBtn');
    }

    getCloseShareDossierPanelIcon() {
        return this.getShareDossierPanel().$('.mstrd-ShareDossierContainer-headerIcons');
    }

    async closeShareDossierPanel() {
        return this.getCloseShareDossierPanelIcon().click();
    }

    getInviteSearchBox() {
        return this.$('.mstrd-InviteSearchBox-input');
    }

    getInviteDetailPanel() {
        return this.$('.mstrd-InviteListDetailsPanel');
    }

    getInviteListPanel() {
        return this.getInviteDetailPanel().$('.mstrd-InviteListDetailsPanel-inviteList');
    }

    getInviteLIstSearchResults() {
        return this.$('.mstrd-InviteListSearchResults');
    }
    getFrequentlyInvitedPanel() {
        return this.$('.mstrd-InviteListFreqItems');
    }

    /**
     * Retrieve the suggestion item (option: UserName, LoginName, Index)
     * @param {string} option - Options to retrieve the suggestion item
     * @param {string|number} param - Parameter corresponding to the option
     * @returns {Promise.<ElementFinder>} - ElementFinder of the specified suggestion item
     */
    getSuggestionUser(option, param) {
        const className =
            option.toLowerCase() === 'fullname'
                ? '.mstrd-InviteUser-fullName'
                : option.toLowerCase() === 'loginname'
                  ? '.mstrd-InviteUser-loginName'
                  : option.toLocaleLowerCase() === 'groupname'
                    ? '.mstrd-InviteGroup-name'
                    : option;
        switch (className) {
            case '.mstrd-InviteUser-fullName':
            case '.mstrd-InviteUser-loginName':
                return this.getInviteLIstSearchResults()
                    .$$('.mstrd-InviteUser')
                    .filter(async (elem) => {
                        const value = await elem.$(`${className}`).getText();
                        return param === value;
                    });
            case '.mstrd-InviteGroup-name':
                return this.getInviteLIstSearchResults()
                    .$$('mstrd-InviteGroup-inner')
                    .filter(async (elem) => {
                        const value = await elem.$(`${className}`).getText();
                        return param === value;
                    });
            case 'index':
            default:
                return this.$$('.mstrd-InviteUser')[param];
        }
    }

    getInviteButton() {
        // return this.getInviteDetailPanel().element(
        //     by.cssContainingText('.mstrd-Button', 'Invite')
        // );
        return this.getInviteDetailPanel().$('.mstrd-Button*=Invite');
    }

    getCopyLink() {
        return this.getShareDropdown().$('.mstrd-LinkMenuItemContainer');
    }

    getNameAndTimeInShareDossierDialog() {
        return this.$('.mstrd-ShareDossierContainer-nameAndTime');
    }

    getUserTimeStampInfo() {
        return this.getNameAndTimeInShareDossierDialog().getText();
    }

    getShareButtonInShareInTeamsPanel() {
        return this.$$('.mstrd-Button').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === 'Share';
        })[0];
    }

    getSubscribeDetailsPanel() {
        return this.$('.mstrd-SubscriptionDialog');
    }

    getGroupDropdownButton() {
        return this.$$('.ant-select-show-search')[1];
    }

    // Action helpers

    /**
     * Select a suggestion item (option: UserName, LoginName, Index)
     * @param {string} option - Options to retrieve the suggestion item
     * @param {string|number} param - Parameter corresponding to the option
     */
    async selectSuggestionItem(option, param) {
        await this.getSuggestionUser(option, param).click();
        //check if get checked
        await this.EC.and(this.getSuggestionUser(option, param).isSelected(), this.DEFAULT_TIMEOUT);
        return this.sleep(1000);
    }

    //new click copy button
    async clickCopyButton() {
        await this.waitForElementVisible(this.getCopyButton(), {
            time: this.DEFAULT_TIMEOUT,
            msg: 'Copy button did not present',
        });
        // await this.wait(this.EC.presenceOf(this.getCopyButton()), this.DEFAULT_TIMEOUT, 'Copy button did not present');
        await this.getCopyButton().click();
        return this.sleep(500);
    }

    async closeSharePanel() {
        await this.click({ elem: this.getCloseIcon() });
        return this.waitForElementInvisible(this.getSharePanel());
    }

    async openExportPDFSettingsWindow() {
        await this.click({ elem: this.getExportPDFButton() });
        return this.waitForDynamicElementLoading();
    }

    async openExportCSVSettingsWindow() {
        await this.click({ elem: this.getExportCSVButton() });
        return this.waitForDynamicElementLoading();
    }

    async clickExportToExcel() {
        await this.click({ elem: this.getExportExcelButton() });
        // const gridList = this.EC.presenceOf(this.$('.mstrd-MenuPanel.mstrd-DossierExcelPanel'));
        // const downloadSpinner = this.EC.presenceOf(this.getExportExcelSpinner());
        // return this.wait(this.EC.or(gridList, downloadSpinner), this.DEFAULT_TIMEOUT, 'Export to Excel no response');
        await browser.waitUntil(
            async () => {
                const exportButton = await this.excelExportPanel.getExportButton();
                const gridList = await this.$('.mstrd-MenuPanel.mstrd-DossierExcelPanel').isDisplayed();
                const rsdGridList = await this.$('.mstrd-MenuPanel.mstrd-DocumentExcelPanel').isDisplayed();
                const downloadSpinner = await this.getExportExcelSpinner().isDisplayed();
                return gridList || rsdGridList || downloadSpinner || exportButton;
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'Export to Excel no response',
            }
        );
    }

    async clickReportExportToExcel() {
        await this.click({ elem: this.getExportExcelButton() });
    }

    async openSubscribeSettingsWindow() {
        await this.click({ elem: this.getSubscribeButton() });
        await this.waitForElementVisible(this.getSubscribeDetailsPanel(), { msg: 'Subscribe Settings did not open' });
        return this.waitForDynamicElementLoading();
    }

    async closeExportPDFSettingsWindow() {
        await this.click({ elem: this.getExportPDFButton() });
        return this.waitForDynamicElementLoading();
    }

    async downloadDossier() {
        await this.click({ elem: this.getDownloadDossierButton() });
    }

    async waitForDownloadComplete({ name, fileType }) {
        if (!name || !fileType) {
            return new Error('The name and/or fileType object parameters must be provided.');
        }

        if (fileType === '.pdf') {
            // await this.wait(this.EC.stalenessOf(this.getExportPDFSpinner()), this.DEFAULT_LOADING_TIMEOUT, 'Export PDF takes too long');
            await this.waitForElementStaleness(this.getExportPDFSpinner(), {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                msg: 'Export PDF takes too long',
            });
        } else if (fileType === '.mstr') {
            // await this.wait(this.EC.stalenessOf(this.getDownloadDossierSpinner()), this.DEFAULT_LOADING_TIMEOUT, 'Downloading mstr file takes too long');
            await this.waitForElementStaleness(this.getDownloadDossierSpinner(), {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                msg: 'Downloading mstr file takes too long',
            });
        } else if (fileType === '.xlsx') {
            // await this.wait(this.EC.stalenessOf(this.getExportExcelSpinner()), this.DEFAULT_LOADING_TIMEOUT, 'Export Excel takes too long');
            await this.waitForElementStaleness(this.getExportExcelSpinner(), {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                msg: 'Export Excel takes too long',
            });
        } else {
            return new Error('The provided fileType object parameter is not supported.');
        }

        // Wait the file to be completely generated after the download spinner disappears
        return waitForFileToExist({ name, fileType });
    }

    async openManageAccessDialog() {
        return await this.click({ elem: this.getManageAccess() });
    }

    async openSharePanel() {
        await this.click({ elem: this.getShareIcon() });
        await this.waitForElementVisible(this.getSharePanel());
        await this.waitForDynamicElementLoading();
    }

    async clickShareInTeams() {
        await this.openSharePanel();
        if (!(await this.getSharePanel().isDisplayed())) {
            await this.openSharePanel();
        }
        await this.click({ elem: this.getShareInTeamsButton() });
    }

    async clickPinInTeams() {
        await this.openSharePanel();
        if (!(await this.getSharePanel().isDisplayed())) {
            await this.openSharePanel();
        }
        await this.click({ elem: this.getPinInTeamsButton() });
    }

    // [Share in teams] share icon in include bookmark panel
    async shareInTeams() {
        return await this.click({ elem: this.getShareButtonInShareInTeamsPanel() });
    }

    async openPinInTeamsDialog() {
        await this.click({ elem: this.getPinInTeamsButton() });
    }

    async openShareDossierDialog() {
        return await this.click({ elem: this.getShareDossierButton() });
    }

    async openShareBotDialog() {
        return await this.click({ elem: this.getShareBotButton() });
    }

    async clickInviteUser() {
        await this.waitForElementVisible(this.getInviteUser());
        await this.getInviteUser().click();
        await this.waitForElementVisible(this.waitForElementVisible(this.getInviteDetailPanel()));
    }

    /**
     * Select a suggestion item (option: UserName, LoginName, Index)
     * @param {string} option - Options to retrieve the suggestion item
     * @param {string|number} param - Parameter corresponding to the option
     */
    async inviteUser(option, param) {
        await this.getInviteSearchBox().click();
        await this.getInviteSearchBox().setValue(param);
        await this.sleep(1000);
        await this.selectSuggestionItem(option, param);
        await this.waitForElementEnabled(this.getInviteButton());
        // await this.EC.and(this.isInviteEnabled(),this.DEFAULT_TIMEOUT);
        return this.sleep(1000); // Wait for animation to complete
    }

    async clickInviteButton() {
        await this.getInviteButton().click();
        await this.sleep(3000);
        return this.waitForElementVisible(this.getFrequentlyInvitedPanel());
    }

    async hideOwnerAndTimestampInShareDashboardDialog() {
        await this.waitForElementVisible(this.getNameAndTimeInShareDossierDialog());
        await this.hideElement(this.getNameAndTimeInShareDossierDialog());
    }

    // Assertion helpers

    async isInviteEnabled() {
        await this.getInviteButton().isEnabled();
    }

    async isGetLinkPresent() {
        return this.getCopyLink().isDisplayed();
    }

    async isSendEmailPresent() {
        return this.getShareViaEmail().isDisplayed();
    }

    async isExportPDFEnabled() {
        return this.getExportPDFButton().isDisplayed();
    }

    async isDownloadDossierEnabled() {
        return this.getDownloadDossierButton().isDisplayed();
    }

    async isShareIconPresent() {
        return this.getShareIcon().isDisplayed();
    }

    async isShareIconDisabled() {
        return this.isAriaDisabled(this.getShareIcon());
    }

    async isInviteUserPresent() {
        return this.getInviteUser().isDisplayed();
    }

    //new
    async isShareDossierPresent() {
        return this.getShareDossierButton().isDisplayed();
    }
    async isShareBotPresent() {
        return this.getShareBotButton().isDisplayed();
    }
    async isSharePanelItemExisted(name) {
        const el = await this.getShareDossierPanelItems();
        return this.isExisted(name, el, 'text');
    }

    // async isSendEmailPresent() {
    //     return this.getShareViaEmail().isDisplayed();
    // }

    async isDownloadDossierPresent() {
        return this.getDownloadDossier().isDisplayed();
    }

    async isExportPDFPresent() {
        return this.getExportToPDF().isDisplayed();
    }

    async isExportExcelDisable() {
        // await this.wait(this.EC.presenceOf(this.getExportExcelButton()), this.DEFAULT_TIMEOUT, 'Share Panel did not open');
        await this.waitForElementVisible(this.getExportExcelButton(), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Share Panel did not open',
        });
        return this.getExportExcelButtonDisabled().isDisplayed();
    }

    async isCoverImageBlank() {
        const coverImage = await this.getCoverImage();
        return !(await coverImage.$('img').isExisting());
    }

    async getShareButtonText() {
        return this.getShareDossierButton().getText();
    }

    async isManageAccessPresent() {
        return this.getManageAccess().isDisplayed();
    }

    async getShareDossierPanelItemsName() {
        return this.getShareDossierPanelItems().map(async (elem) => {
            const value = await elem.getText();
            return elem.getText();
        });
    }

    async openExportToGoogleSheetsDialog() {
        await this.click({ elem: this.getExportGoogleSheetsButton() });
        return this.waitForDynamicElementLoading();
    }
}
