import SubscriptionManagement from './Subscribe.js';
import Select from '../common/Select.js';
import LibraryNotification from '../common/LibraryNotification.js';
import { retryAsync } from '../../utils/retry-util.js';

// import { waitForFileToExist } from '../../config/folderManagement.js';
// import { filter } from 'lodash';
// import { browser } from 'protractor';

export default class SubscriptionDialog extends SubscriptionManagement {
    constructor() {
        super();
        this.libraryNotification = new LibraryNotification();
    }

    /**
     * This method is to get the STRING LABEL of send preview now in subscription panel
     * @returns {WebdriverIO.Element}
     */

    /**
     * This method is to get the CHECKBOX and String label container of send preview now in subscription panel
     * @returns {WebdriverIO.Element}
     */

    getSubscriptionPanel() {
        return this.$('.mstrd-SubscriptionDialog');
    }

    getContentPanel() {
        return this.$('.mstrd-Dialog-content');
    }

    getSubscriptionName() {
        return this.$('.mstrd-SubscriptionTopSettings-name .mstrd-Input');
    }

    getSubscriptionNameEditButton() {
        return this.$('.mstrd-SubscriptionTopSettings-name');
    }

    getBookmarkTextbox() {
        return this.$('.mstrd-SubscriptionContentSettings-newBookmarkName');
    }

    getContentSettingsSection() {
        return this.$('.mstrd-SubscriptionForm.mstrd-SubscriptionContentSettings');
    }

    getControllerBySectionName(sectionName) {
        return this.$(
            `//label[contains(text(),'${sectionName}')]//ancestor::div[@class='mstrd-SubscriptionForm-area']`
        );
    }

    getFormatPickerContainer() {
        return this.getControllerBySectionName('Format');
    }

    getSchedulePickerContainer() {
        return this.getControllerBySectionName('Schedule');
    }

    getBookmarkPickerContainer() {
        return this.$('.mstrd-SubscriptionContentSettings-bookmark');
    }

    getSelectedFormat() {
        return this.getFormatPickerContainer().$('.mstrd-Select-selected');
    }

    getSelectedSchedule() {
        return this.getSchedulePickerContainer().$('.mstrd-Select-selected');
    }

    getSelectedBookmark() {
        return this.getBookmarkPickerContainer().$('.mstrd-Select-selected');
    }

    getRecipientsSettingsSection() {
        return this.$('.mstrd-SubscriptionRecipientSettings');
    }

    getDeliverySettingsSection() {
        return this.$('.mstrd-SubscriptionDeliverySettings');
    }

    getContentFileNameTextbox() {
        return this.getContentSettingsSection().$('.mstrd-TextAssistant-textbox');
    }

    getDeliveryDialog() {
        return this.$('.mstrd-SubscriptionDeliverySettings');
    }

    getEmailSubjectTextbox() {
        return this.getDeliveryDialog()
            .$('.mstrd-SubscriptionForm-area')
            .$(`//label[contains(text(),'Email') or contains(text(),'电子邮件')]`)
            .$('..')
            .$('.mstrd-TextAssistant-textbox');
    }

    // Schedule section
    getScheduleField() {
        return this.getDeliveryDialog().$('.mstrd-ScheduleComboBox');
    }

    getScheduleLabel() {
        return this.getDeliveryDialog().$('.mstrd-SubscriptionForm-area:has(.mstrd-ScheduleComboBox) label');
    }

    getScheduleSelectorDropdown() {
        return this.$('.mstrd-CapsuleComboBox-popup');
    }

    getTimeScheduleTab() {
        return this.getScheduleSelectorDropdown().$('#schedule-time-tab');
    }

    getEventScheduleTab() {
        return this.getScheduleSelectorDropdown().$('#schedule-event-tab');
    }

    getScheduleOptions() {
        return this.getScheduleSelectorDropdown()
            .$('#schedule-time-panel:not([hidden]),#schedule-event-panel:not([hidden])')
            .$$('.mstrd-ScheduleComboBox-single-item');
    }

    getScheduleOption(option) {
        return this.getScheduleOptions().filter(async (elem) => {
            const text = await elem.getText();
            return option === text;
        });
    }

    getNoteTextbox() {
        return this.getDeliveryDialog()
            .$('.mstrd-SubscriptionForm-area')
            .$(`//label[contains(text(),'Note')]`)
            .$('..')
            .$('.mstrd-TextAssistant-textbox');
    }

    getMessageTextbox() {
        return this.getDeliveryDialog()
            .$('.mstrd-SubscriptionForm-area')
            .$(`//label[contains(text(),'Message')]`)
            .$('..')
            .$('.mstrd-TextAssistant-textbox');
    }

    getFileNameDelimiterTextbox() {
        return this.getDeliveryDialog()
            .$('.mstrd-SubscriptionForm-area')
            .$(`//label[contains(text(),'Delimiter')]`)
            .$('..')
            .$('.mstrd-Input');
    }

    getDataDelimiterTextbox() {
        return this.getContentSettingsSection()
            .$('.mstrd-ReportPlainTextForm')
            .$(`//label[contains(text(),'Data Delimiter')]`)
            .$('..')
            .$('.mstrd-Input');
    }
    /*
    getScheduleDropdown() {
        return this.getDeliveryDialog().$('.mstrd-SubscriptionForm-area').$(`//label[contains(text(),'Schedule')]`).$('..').$('.mstrd-DropDownButton-label');
    }
*/
    getScheduleSelector() {
        return this.getDeliveryDialog()
            .$('.mstrd-SubscriptionForm-area')
            .$(`//label[contains(text(),'Schedule') or contains(text(),'时间表')]`)
            .$('..')
            .$('.mstrd-Select');
    }

    getSubscribeButton() {
        return this.$('.mstrd-Dialog-buttonArea').$(`//button[text()='Subscribe' or text()='订阅']`);
    }

    getLoadingButton() {
        return this.$('.mstrd-Spinner-blade');
    }

    getAllowUnsubscribeCheckbox() {
        return this.$(`//div[contains(text(), 'Allow')]`);
    }

    getSendNowCheckbox() {
        return this.$(`//div[contains(text(), 'preview') or contains(text(), '预览')]`);
    }

    getCustomizeHeaderFooter() {
        return this.$(`//div[contains(text(), 'Customize header and footer')]`);
    }

    getExpandAllPageByFields() {
        return this.$(`//div[contains(text(), 'Expand all Page-By fields')]`);
    }

    getExportPageByInformation() {
        return this.$(`//div[contains(text(), 'Export Page-By information')]`);
    }

    getExportReportTitle() {
        return this.$(`//div[contains(text(), 'Export report title')]`);
    }

    getExportFilterDetails() {
        return this.$(`//div[contains(text(), 'Export filter details')]`);
    }

    getSendNowCheckboxInReport() {
        // Find the checkbox with "Send preview now to all recipients" text
        return this.$(
            '//div[contains(text(), "Send preview now to all recipients")]/..//span[@class="mstrd-Checkbox-shape icon-checkmark"]'
        );
    }
    async enableSendNowInReport() {
        const checkbox = this.getSendNowCheckboxInReport();
        const isChecked = await checkbox.parentElement().getAttribute('aria-checked');
        if (isChecked !== 'true') await checkbox.click();
    }

    async disableSendNowInReport() {
        const checkbox = this.getSendNowCheckboxInReport();
        const isChecked = await checkbox.parentElement().getAttribute('aria-checked');
        if (isChecked === 'true') await checkbox.click();
    }

    getSaveButton() {
        return this.$(`//button[contains(text(), 'Save')]`);
    }

    getApplyButton() {
        return this.$(`//button[contains(text(), 'Apply')]`);
    }

    getInfoWindowSubscriptionPanel() {
        return this.$('.mstrd-SubscriptionInfo');
    }

    getInfoWindowEdit() {
        return this.$('.mstr-menu-icon.icon-subscrip_edit');
    }

    getInfoWindowEditButtonContainer() {
        return this.$(`//span[contains(@class,'icon-subscrip_edit')]//ancestor::div[@role='button']`);
    }

    getSubscriptionInSidebar(name, index = 1) {
        return this.$$(`.mstrd-SubscriptionListContainer-row`).filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText.includes(name);
        })[index - 1];
    }

    getSubscriptionSortByOption(name) {
        return this.$(`//div[contains(text(), '${name}')]`);
    }

    getFilterDropdownMainDialg() {
        return this.$(`div[aria-label='Filters']`);
    }

    getFilterContent() {
        return this.getFilterDropdownMainDialg().$(`//div[contains(text(),'Content')]`);
    }

    getFilterType() {
        return this.getFilterDropdownMainDialg().$(`//div[contains(text(),'Type')]`);
    }

    getFilterOptionCheckbox(name) {
        return this.$('.mstrd-FilterDetailPanelCheckbox').$(`//div[contains(text(),'${name}')]`);
    }

    getFilterContentOptionOnly(name) {
        return this.$('.mstrd-FilterDetailPanelCheckbox')
            .$(`//div[contains(text(),'${name}')]`)
            .$('..')
            .$('..')
            .$('.mstrd-Checkbox-keepOnly');
    }

    getFiltersApplyButton() {
        return this.$('.mstrd-BaseFilterPanel-applyBtn');
    }

    getClearAllFiltersButton() {
        return this.$('.mstrd-BaseFilterPanel-clearBtn');
    }

    getClearAllButton() {
        return this.getFilterDropdownMainDialg()
            .$$('.mstrd-Button')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes('Clear All');
            })[0];
    }

    getSelectAllButton() {
        return this.getFilterDropdownMainDialg()
            .$$('.mstrd-Button')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes('Select All');
            })[0];
    }

    getCheckboxByPageName(name) {
        return this.$(`//div[text()='${name}']`).$('..');
    }

    getOnlyButtonByChapterName(name) {
        return this.$(`//div[text()='${name}']`).$('..').$('..').$('.mstrd-TreeOption-keepOnly');
    }

    getChapterByName(name) {
        return this.$(`//div[text()='${name}']`).$('..').$('..');
    }

    getCheckboxByChapterName(name) {
        return this.$(`//div[text()='${name}']`).$('..');
    }

    getArrowByChapterName(name) {
        return this.$(`//div[text()='${name}']`).$('..').$('..').$('..').$('.icon-menu-arrow');
    }

    getRecipientTextbox() {
        return this.$('.mstrd-CapsuleComboBox-value');
    }

    getCustomizeHeaderTextbox() {
        return this.$("//label[normalize-space(.)='Header']/following::div[@role='textbox'][1]");
    }

    getCustomizeFooterTextbox() {
        return this.$("//label[normalize-space(.)='Footer']/following::div[@role='textbox'][1]");
    }

    getRecipientName(name) {
        return this.$(`//div[contains(@class, "mstrd-RecipientComboBox-name") and normalize-space()='${name}']`);
    }

    getSubscriptionInSidebar(name, index = 1) {
        return this.$$(`.mstrd-SubscriptionListContainer-row`).filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText.includes(name);
        })[index - 1];
    }

    getSubscriptionEmptyContent() {
        return this.$('.mstrd-EmptyContent');
    }

    getAdvancedSettingsButton() {
        return this.$(`div[aria-label='Advanced Settings']`);
    }

    getAdvancedSettingsDialog() {
        return this.$('.mstrd-SubscriptionAdvancedSettings-main ');
    }

    getCompressZipCheckbox() {
        return this.$('.mstrd-SubscriptionAdvancedCompressionSettings').$('.mstrd-Checkbox-shape');
    }

    getCompressZipFileNameTextbox() {
        return this.$(`//label[contains(text(),'file')]`).$('..').$('.mstrd-Input');
    }

    getCompressZipFilePWTextbox() {
        return this.$(`//label[contains(text(),'Password')]`).$('..').$('.mstrd-Input');
    }

    getDoNotDeliveryCheckbox() {
        return this.$(`//div[contains(text(),'delivery')]`).$('..').$('.mstrd-Checkbox-shape');
    }

    getBackButton() {
        return this.$(`//button[text()='Back']`);
    }

    getExpandLayoutsCheckbox() {
        return this.$(`//div[contains(text(),'layouts')]`).$('..').$('.mstrd-Checkbox-shape');
    }

    getExpandPageByCheckbox() {
        return this.$(`//div[contains(text(),'Expand')]`).$('..').$('.mstrd-Checkbox-shape');
    }

    getAllowChangeDeliveryCheckbox() {
        return this.$(`//div[contains(text(),'delivery')]`).$('..').$('.mstrd-Checkbox-shape');
    }

    getAllowChangePersonalizationCheckbox() {
        return this.$(`//div[contains(text(),'personalization')]`).$('..').$('.mstrd-Checkbox-shape');
    }

    getContentSubscriptionByOrder(i) {
        // return this.$(`//div[contains(text(), '${name}')]`).$('..').$('.mstrd-SubscriptionContentSettings-settings').$('.mstr-icons-lib-icon');
        return this.$('.mstrd-SubscriptionContentSettings-list').$$('.mstr-icons-lib-icon')[i];
    }

    getEditContentArrow() {
        return this.getContentSettingsSection().$('.mstrd-SubscriptionForm-header').$('.mstr-icons-lib-icon');
    }

    getCloseButton() {
        return this.getContentPanel().$('.mstrd-Dialog-closeButton');
    }

    getPromptButton() {
        return this.$('.mstrd-SubscriptionForm-enterButton');
    }

    getPromptDialog() {
        return this.$('.mstrd-SubscriptionDialog--prompt');
    }

    getViewSummaryToggle() {
        return this.$('.mstrPromptEditorSwitchSummary > label');
    }

    getAddNewAddressButton() {
        return this.$('.mstrd-RecipientComboBox-addNew');
    }

    getAddressNameTextBox() {
        return this.$('.mstrd-PersonalAddressEditor .mstrd-Input:not([type])');
    }

    getEmailAddressTextBox() {
        return this.$('.mstrd-PersonalAddressEditor .mstrd-Input[type="email"]');
    }

    getAddressCancelButton() {
        return this.$('.mstrd-PersonalAddressEditor .mstrd-Button--secondary');
    }

    getFormatOptionDropdown() {
        return this.$('label=Format').$('..').$('.mstrd-DropDown-content');
    }

    getDialogPanel() {
        return this.$('.mstrd-SubscriptionDialog-panel');
    }

    getExpandGridCheckbox() {
        return this.$('//div[contains(text(), "Expand")]');
    }

    getScaleGridCheckbox() {
        return this.$('//div[contains(text(), "Scale")]');
    }

    getSendNotificationCheckbox() {
        return this.$(`//div[contains(text(), 'notification')]`);
    }

    getFTPSettingsDialog() {
        return this.$('.mstrd-SubscriptionForm.mstrd-SubscriptionFTPSettings');
    }

    getScheduleOptionsDialog() {
        return this.$('.mstrd-SubscriptionDeliverySettings-schedule').$('.mstrd-CapsuleComboBox-popup');
    }

    async getFormatDropdown() {
        const select = await this.$(`//label[contains(text(),'Format') or contains(text(),'格式')]`)
            .$('..')
            .$('.mstrd-Select');
        return new Select(select);
    }

    async getTypeDropdown() {
        const select = await this.$(`//label[contains(text(),'Type') or contains(text(),'类型')]`)
            .$('..')
            .$('.mstrd-Select');
        return new Select(select);
    }

    async getDeviceDropdown() {
        const select = await this.$(`//label[contains(text(),'Device') or contains(text(),'设备')]`)
            .$('..')
            .$('.mstrd-Select');
        return new Select(select);
    }

    async getDataDelimiterDropdown() {
        const select = await this.$(`//label[contains(text(),'Data Delimiter')]`).$('..').$('.mstrd-Select');
        return new Select(select);
    }

    async getExcelExpandAllPagebyDropdown() {
        const select = await this.$(`//label[contains(text(),'Range')]`).$('..').$('.mstrd-Select');
        return new Select(select);
    }

    async waitForSelectedFormatLoaded() {
        const selectedFormat = this.getFormatPickerContainer().$('.mstrd-DropDownButton-label');
        // wait for the innerHTML of selectedFormat to be not empty
        await browser.waitUntil(
            async () => {
                const innerHTML = await selectedFormat.getText();
                return innerHTML && innerHTML.trim() !== '';
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'Selected format did not load within the expected time',
            }
        );
    }

    async waitForSelectedScheduleLoaded() {
        const selectedSchedule = this.getSchedulePickerContainer().$('.mstrd-DropDownButton-label');
        // wait for the innerHTML of selectedSchedule to be not empty
        await browser.waitUntil(
            async () => {
                const innerHTML = await selectedSchedule.getText();
                return innerHTML && innerHTML.trim() !== '';
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'Selected schedule did not load within the expected time',
            }
        );
    }

    async waitForSelectedBookmarkLoaded() {
        const selectedBookmark = this.getBookmarkPickerContainer().$('.mstrd-DropDownButton-label');
        // wait for the innerHTML of selectedBookmark to be not empty
        await browser.waitUntil(
            async () => {
                const innerHTML = await selectedBookmark.getText();
                return innerHTML && innerHTML.trim() !== '';
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'Selected bookmark did not load within the expected time',
            }
        );
    }

    async getFormatDropdownOptionValues() {
        const dropdown = await this.getFormatDropdown();
        await dropdown.open();
        return dropdown.getOptionsItemValues();
    }

    async getScheduleDropdownOptionValues() {
        await this.openScheduleDropdown();
        return this.getScheduleOptions().map(async (elem) => {
            return await elem.getText();
        });
    }

    async inputSubscriptionName(text) {
        (await this.getSubscriptionName()).setValue(text);
        return this.sleep(500);
    }

    async updateSubscriptionName(name) {
        await this.clickSubscriptionNameEditButton();
        await this.waitForElementVisible(this.getSubscriptionName());
        await this.clear({ elem: this.getSubscriptionName() });
        await this.getSubscriptionName().setValue(name);
        await this.enter();
        await this.sleep(500);
    }

    async clickSubscriptionNameEditButton() {
        await this.click({ elem: this.getSubscriptionName() });
    }

    async inputFileName(name) {
        await this.getContentFileNameTextbox().setValue(name);
    }

    async inputBookmarkName(name) {
        await this.getBookmarkTextbox().setValue(name);
    }

    async inputEmailSubject(subject) {
        await this.getEmailSubjectTextbox().setValue(subject);
    }

    async inputNote(note) {
        await this.getNoteTextbox().setValue(note);
    }

    async inputMessage(note) {
        await this.getMessageTextbox().setValue(note);
    }

    async inputFileNameDelimiter(character) {
        await this.getFileNameDelimiterTextbox().setValue(character);
    }

    async inputDataDelimiter(Delimiter) {
        await this.getDataDelimiterTextbox().setValue(Delimiter);
    }

    async createSubscription() {
        await this.getSubscribeButton().click();
    }

    async getScheduleDropdown() {
        await this.waitForElementVisible(this.getScheduleSelector());
        const select = await this.getScheduleSelector();
        return new Select(select);
    }

    async openScheduleDropdown() {
        await retryAsync(async () => {
            const isOpen = await this.getScheduleSelectorDropdown().isDisplayed();
            if (!isOpen) {
                await this.click({ elem: this.getScheduleField() });
                await this.getScheduleSelectorDropdown().waitForDisplayed({ timeout: 3000 });
            }
        });
    }

    async selectSchedule(dropDownOption) {
        await this.openScheduleDropdown();
        let options = await this.getScheduleOption(dropDownOption);
        if (options.length === 0) {
            await this.toggleScheduleTab();
            options = await this.getScheduleOption(dropDownOption);
        }
        await this.click({ elem: options[0] });
        await this.click({ elem: this.getScheduleLabel() });
        await this.waitForElementInvisible(this.getScheduleSelectorDropdown());
    }

    async toggleScheduleTab() {
        const isTimeSchedule = await this.getScheduleSelectorDropdown()
            .$('#schedule-time-tab[aria-selected="true"]')
            .isDisplayed();
        if (isTimeSchedule) {
            await this.click({ elem: this.getEventScheduleTab() });
        } else {
            await this.click({ elem: this.getTimeScheduleTab() });
        }
    }

    async selectFormat(dropDownOption) {
        const dropdown = await this.getFormatDropdown();
        await dropdown.open();
        const option = dropdown.getOption(dropDownOption);
        await option.click();
        return this.sleep(1000);
    }

    async selectDataDelimiter(dropDownOption) {
        const dropdown = await this.getDataDelimiterDropdown();
        await dropdown.open();
        const option = dropdown.getOption(dropDownOption);
        await option.click();
        return this.sleep(1000);
    }

    async selectExcelExpandAllPageby(dropDownOption) {
        const dropdown = await this.getExcelExpandAllPagebyDropdown();
        await dropdown.open();
        const option = dropdown.getOption(dropDownOption);
        await option.click();
        return this.sleep(1000);
    }

    async waitForLoadingButtonToDisappear(timeout = 60000) {
        const loadingButton = this.getLoadingButton();
        await browser.waitUntil(
            async () => {
                if (await loadingButton.isExisting()) {
                    return !(await loadingButton.isDisplayed());
                }
                // If element doesn't exist at all, also treat as invisible
                return true;
            },
            {
                timeout,
                timeoutMsg: 'Loading Button still exists after 60000 ms',
            }
        );
    }

    async clickAllowUnsubscribeCheckbox() {
        (await this.getAllowUnsubscribeCheckbox()).click();
    }

    async clickCustomizeHeaderFooter() {
        (await this.getCustomizeHeaderFooter()).click();
    }

    async clickExpandAllPageByFields() {
        (await this.getExpandAllPageByFields()).click();
    }

    async clickExportPageByInformation() {
        (await this.getExportPageByInformation()).click();
    }

    async clickExportReportTitle() {
        (await this.getExportReportTitle()).click();
    }

    async clickExportFilterDetails() {
        (await this.getExportFilterDetails()).click();
    }

    async clickSendNowCheckbox() {
        (await this.getSendNowCheckbox()).click();
    }

    async clickSave() {
        const save = await this.getSaveButton();
        await save.click();
    }

    async waitForSubscriptionActionButtonsTobeEnabled(elem) {
        await browser.waitUntil(
            async () => {
                // const className = await elem.getAttribute('class');
                // return !className.includes('disabled');
                const isDisabled = await this.isDisabled(elem);
                return !isDisabled;
            },
            { timeout: this.DEFAULT_LOADING_TIMEOUT, msg: 'Wait for subscription action button time out!' }
        );
    }

    async clickInfoWindowEdit(isValid = true) {
        await this.waitForElementVisible(this.getInfoWindowEdit(), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Cannot find subscription edit button.',
        });
        await this.waitForSubscriptionActionButtonsTobeEnabled(this.getInfoWindowEditButtonContainer());
        await this.getInfoWindowEdit().click();
        await this.waitForElementVisible(this.getContentPanel());
        if (isValid) await this.waitForElementEnabled(this.getSaveButton());
    }

    async closeSubscribe() {
        const close = await this.$('.mstrd-RecommendationsContainer-main>.icon-clearsearch');
        await close.click();
    }

    async hoverSubscription(name) {
        await this.hover({ elem: this.getSubscriptionInSidebar(name) });
    }

    async editPromptInSubscription(name) {
        await this.hoverSubscription(name);
        await this.clickEditButtonInSidebar(name);
        await this.clickPromptButton();
        return this.sleep(2000);
    }

    async clickEditButtonInSidebar(name, index = 1) {
        const subscription = this.getSubscriptionInSidebar(name, index);
        await this.click({ elem: subscription });
        await this.hover({ elem: subscription });
        const editButton = subscription.$('.icon-subscrip_edit');
        await this.click({ elem: editButton });
    }

    async clickSidebarUnsubscribe(name) {
        const tmp1 = this.$$('.mstrd-SubscriptionListContainer-row').filter(async (elem) => {
            return (await elem.getText()).includes(name);
        })[0];
        const edit = await tmp1.$('.icon-subscrip_unsubscribe');
        const tmp2 = await tmp1.$('.mstr-menu-icon.icon-subscrip_unsubscribe.disabled');
        for (let i = 0; i < 10000; i++) {
            const tag = await tmp2.isDisplayed();
            if (!tag) {
                break;
            }
        }
        await edit.click();
    }

    async clickUnsubscribeYes() {
        const unsubscribeYes = await this.$$('.mstrd-ConfirmationDialog-button').filter(async (elem) => {
            return 'Yes' === (await elem.getText());
        })[0];
        await unsubscribeYes.click();
    }

    async clickSubscriptionSortByOption(name) {
        await this.hover({ elem: this.getSubscriptionSortByOption(name) });
        await this.click({
            elem: this.getSubscriptionSortByOption(name).$('..').$('.mstrd-SubscriptionListContainer-sortIcon'),
        });
    }

    async clickSubscriptionFilter() {
        const filter = await this.$('.mstrd-LibraryFilterContainer-button');
        await filter.click();
    }

    async clickFilterContent() {
        await this.getFilterContent().click();
    }

    async clickFilterType() {
        await this.getFilterType().click();
    }

    async clickFilterOption(name) {
        await this.getFilterOptionCheckbox(name).click();
    }

    async clickFiltersApplyButton() {
        await this.getFiltersApplyButton().click();
    }

    async clickClearAllFiltersButton() {
        (await this.getClearAllFiltersButton()).click();
    }

    async clickFilterOptionOnly(name) {
        await this.hover({ elem: this.getFilterOptionCheckbox(name) });
        await this.getFilterContentOptionOnly(name).click();
    }

    async clickFiltersOption(option) {
        await this.getFilterCheckboxOption(option).click();
    }

    async clickFiltersOptionOnly(option) {
        await this.getFilterOptionOnly(option).click();
    }

    async clickSubscriptionFilterApply() {
        await this.getSubscriptionFilterApplyButton().click();
    }

    async clickClearAllButton() {
        await this.getClearAllButton().click();
    }

    async clickSelectAllButton() {
        await this.getSelectAllButton().click();
    }

    async clickRangeDropdown() {
        const range = await this.$('.mstrd-TreeSelect').$('.icon-menu-arrow');
        //await this.waitForElementVisible(range);
        // await this.wait(() => range.isDisplayed());
        await this.click({ elem: range });
    }

    async clickRangeAll() {
        const all = await this.$('.mstrd-Tree-all');
        await all.click();
    }

    async clickCheckboxByPageName(name) {
        await this.getCheckboxByPageName(name).click();
    }

    async getRangeCheckboxStatus(name) {
        //const status = await this.element(by.cssContainingText('.mstrd-TreeOption-label',name)).getAttribute('aria-checked');
        const status = await this.$$('.mstrd-TreeOption-label')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(name);
            })[0]
            .getAttribute('aria-checked');
        return status;
    }

    async clickCheckboxByChapterName(name) {
        await this.getCheckboxByChapterName(name).click();
    }

    async clickArrowByChapterName(name) {
        await this.getArrowByChapterName(name).click();
    }

    async clickCheckboxByPageName(name) {
        await this.getCheckboxByPageName(name).click();
    }

    async getAllCheckboxStatus() {
        const status = await this.$('.mstrd-Tree-all').getAttribute('aria-checked');
        return status;
    }

    async inputRecipient(name) {
        await this.click({ elem: this.getRecipientTextbox() });
        await this.input(name);
    }

    async addRecipient(name) {
        await this.click({ elem: this.getRecipientTextbox() });
        await this.tabForward(1);
        await this.input(name);
    }

    async inputCustomizeHeader(name) {
        await this.click({ elem: this.getCustomizeHeaderTextbox() });
        await this.input(name);
    }

    async inputCustomizeFooter(name) {
        await this.click({ elem: this.getCustomizeFooterTextbox() });
        await this.input(name);
    }

    async selectRecipient(name) {
        await this.waitForElementVisible(this.getRecipientName(name));
        await this.getRecipientName(name).click();
    }

    async getBookmarkDropdown() {
        const select = await this.$('.mstrd-SubscriptionContentSettings-bookmark').$('.mstrd-Select');
        return new Select(select);
    }

    async selectBookmark(dropDownOption) {
        const dropdown = await this.getBookmarkDropdown();
        await dropdown.open();
        // await this.sleep(1000);
        const option = dropdown.getOption(dropDownOption);
        // await option.click();
        await this.click({ elem: option });
        return this.sleep(1000);
    }

    async clickSwitchRight() {
        const switchRight = await this.$('.mstrd-SubscriptionInfo-switchIcon--right');
        await switchRight.click();
    }

    async clickUnsubscribe() {
        const unsubscribe = await this.$('.mstrd-SubscriptionInfo-action .mstr-menu-icon.icon-subscrip_unsubscribe');
        await unsubscribe.click();
    }

    async clickUnsubscribeYes() {
        const unsubscribeYes = await this.$$('.mstrd-ConfirmationDialog-button').filter(async (elem) => {
            return 'Yes' === (await elem.getText());
        })[0];
        await unsubscribeYes.click();
    }

    async clickSidebarSave() {
        const save = await this.$('.mstrd-Dialog-buttonArea').$(`//button[text()='Save']`);
        // await save.click();
        await this.click({ elem: save });
    }

    async hoverSubscription(name) {
        await this.hover({ elem: this.getSubscriptionInSidebar(name) });
    }

    async clickSidebarCancel() {
        const tmp = await this.$('.mstrd-Dialog-buttonArea').$(`//button[text()='Cancel']`);
        await tmp.click();
    }

    async isSubscriptionEmptyContentPresent() {
        return this.getSubscriptionEmptyContent().isDisplayed();
    }

    async clickAdvancedSettingsButton() {
        await this.click({ elem: this.getAdvancedSettingsButton() });
    }

    async clickCompressZipFileCheckbox() {
        await this.click({ elem: this.getCompressZipCheckbox() });
    }

    async inputZipFileName(text) {
        (await this.getCompressZipFileNameTextbox()).setValue(text);
        return this.sleep(500);
    }

    async inputZipFilePW(text) {
        (await this.getCompressZipFilePWTextbox()).setValue(text);
        return this.sleep(500);
    }

    async clickBackButton() {
        await this.click({ elem: this.getBackButton() });
    }

    async clickExpandLayoutsCheckbox() {
        await this.click({ elem: this.getExpandLayoutsCheckbox() });
    }

    async clickExpandPageByCheckbox() {
        await this.click({ elem: this.getExpandPageByCheckbox() });
    }

    async clickAllowChangeDeliveryCheckbox() {
        await this.click({ elem: this.getAllowChangeDeliveryCheckbox() });
    }

    async clickAllowChangePersonalizationCheckbox() {
        await this.click({ elem: this.getAllowChangePersonalizationCheckbox() });
    }

    async openContentByOrder(i) {
        await this.click({ elem: this.getContentSubscriptionByOrder(i) });
    }

    async clickEditContentArrow() {
        await this.click({ elem: this.getEditContentArrow() });
    }

    async clickCloseButton() {
        await this.click({ elem: this.getCloseButton() });
    }

    async isSendNowPresent() {
        return this.getSendNowCheckbox().isDisplayed();
    }

    async clickPromptButton() {
        return this.getPromptButton().click();
    }

    async clickViewPromptToggle() {
        return (await this.getViewSummaryToggle()).click();
    }

    async clickApplyButton() {
        await this.click({ elem: this.getApplyButton() });
    }

    async clickAddNewAddressButton() {
        return this.getAddNewAddressButton().click();
    }

    async clickAddressNameTextBox() {
        return this.getAddressNameTextBox().click();
    }

    async clickEmailAddressTextBox() {
        return this.getEmailAddressTextBox().click();
    }

    async clickAddressCancelButton() {
        return this.getAddressCancelButton().click();
    }

    async clickFormatDropdown() {
        const dropdown = await this.getFormatDropdown();
        await dropdown.open();
    }

    async clickExpandGridCheckbox() {
        await this.getExpandGridCheckbox().click();
    }

    async clickScaleGridCheckbox() {
        await this.getScaleGridCheckbox().click();
    }

    async clickUseTimezonesCheckbox() {
        const elem = this.$(`//div[contains(text(), 'time zones')]`);
        await elem.click();
    }

    async isUseTimezonesCheckboxChecked() {
        const elem = await this.$(`//div[contains(text(), 'time zones')]`).$('..');
        const ariaChecked = await elem.getAttribute('aria-checked');
        if (ariaChecked !== null) {
            return ariaChecked === 'true';
        }
        return false;
    }

    async getTypeDropdown() {
        const select = await this.$(`//label[contains(text(),'Type') or contains(text(),'类型')]`)
            .$('..')
            .$('.mstrd-Select');
        return new Select(select);
    }

    async selectType(dropDownOption) {
        const dropdown = await this.getTypeDropdown();
        await dropdown.open();
        const option = dropdown.getOption(dropDownOption);
        await option.click();
        return this.sleep(1000);
    }

    async clickSendNotificationCheckbox() {
        (await this.getSendNotificationCheckbox()).click();
    }

    async clickUsersRadioButton() {
        const elem = await this.$('[data-feature-id="library-subscription-ftp-locations-from-user-option"]');
        await elem.click();
    }

    async clickSubFolderRadioButton() {
        const elem = await this.$('[data-feature-id="library-subscription-ftp-locations-from-subfolder-option"]');
        await elem.click();
    }

    async selectSubscriptionDevice(dropDownOption) {
        const dropdown = await this.getDeviceDropdown();
        await dropdown.open();
        const option = dropdown.getOption(dropDownOption);
        await option.click();
        return this.sleep(1000);
    }

    async inputDeviceSubFolder(text) {
        const subFolderInput = $('[data-feature-id="library-subscription-ftp-subfolder-input"]');
        await subFolderInput.setValue(text);
        return this.sleep(500);
    }

    async isSubFolderRadioAvailable() {
        const radio = await this.$('[data-feature-id="library-subscription-ftp-locations-from-subfolder-option"]');

        const ariaDisabled = await radio.getAttribute('aria-disabled');
        const classAttr = await radio.getAttribute('class');

        return ariaDisabled === 'false' && !classAttr.includes('mstrd-RadioButton--disabled');
    }

    async OpenScheduleOptions() {
        const schedule = $('.mstrd-CapsuleComboBox.mstrd-ScheduleComboBox')
        await schedule.click();
        return this.sleep(500);
    }

    async clickEventScheduleOptions(options) {
        const scheduleEventTab = $('[role="tab"][aria-controls="schedule-event-panel"]');
        await scheduleEventTab.click();
        for (const label of options) {
            const option = this.$(`//div[contains(@class,"mstrd-ScheduleComboBox-item-label") and contains(normalize-space(.), "${label}")]`);
            await option.click();
        }
        return this.sleep(1000);
    }

    async clickTimeScheduleOptions(options) {
        const scheduleTimeTab = $('[role="tab"][aria-controls="schedule-time-panel"]');
        await scheduleTimeTab.click();
        for (const label of options) {
            const option = this.$(`//div[contains(@class,"mstrd-ScheduleComboBox-item-label") and contains(normalize-space(.), "${label}")]`);
            await option.click();
        }
        return this.sleep(1000);
    }

    async clickScheduleOKButton() {
        const okButton = $('.mstrd-Button--primary.mstrd-ScheduleComboBox-okBtn');
        await okButton.click();
        return this.sleep(1000);

    }
}
