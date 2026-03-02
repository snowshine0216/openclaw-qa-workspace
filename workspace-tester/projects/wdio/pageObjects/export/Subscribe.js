import BasePage from '../base/BasePage.js';
import Select from '../common/Select.js';
import LibraryNotification from '../common/LibraryNotification.js';
import { retryAsync } from '../../utils/retry-util.js';

// import { waitForFileToExist } from '../../config/folderManagement.js';
// import { filter } from 'lodash';
// import { browser } from 'protractor';

export default class SubscriptionManagement extends BasePage {
    constructor() {
        super();
        this.libraryNotification = new LibraryNotification();
    }

    getSubscriptionEditor() {
        return this.$('.mstrd-SubscriptionEditor');
    }

    getSubscriptionContainerHeader(name) {
            return this.$$(`.mstrd-SubscriptionListContainer-header`).filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(name);
            })[0];
    }

    getContainerHeaderBorder(name) {
        const parent = this.getParent(this.getSubscriptionContainerHeader(name));
        return parent.$('.mstrd-resizable-handler');
    }

    async dragHeaderWidth(name, offset) {
        return this.dragAndDrop({
            fromElem: this.getContainerHeaderBorder(name),
            toElem: this.getContainerHeaderBorder(name),
            toOffset: { x: offset, y: 0 },
        });
    }

    getScheduleSettings() {
        return this.$('.mstrd-SubscriptionSettings-schedule');
    }

    getContentSettings() {
        return this.$('.mstrd-SubscriptionSettings-content');
    }

    getFormatSettings() {
        return this.$('.mstrd-SubscriptionSettings-format .mstrd-Select-selected');
    }

    getBookmarkSettings() {
        return this.$('.mstrd-SubscriptionSettings-content .mstrd-Select-selected');
    }

    getDropDownSelectedItem(elem) {
        return this._getDropDownContainer(elem).$('.mstrd-DropDownBox-selected');
    }

    getSortDropdown() {
        return this.$('.mstrd-SortDropdown');
    }

    _getDropDownContainer(elem) {
        return elem.$('.mstrd-DropDownContainer');
    }

    _getDropDownlist(elem) {
        return this._getDropDownContainer(elem).$('.mstrd-DropDownMenu-list');
    }

    _getDropDownItems(elem) {
        return this._getDropDownlist(elem).$$('.mstrd-DropDownMenu-item');
    }

    getBookmarkLabel() {
        return this.$('.mstrd-SubscriptionSettings-content').$('.mstrd-Select')
    }

    getScheduleSelector() {
        return this.$('.mstrd-SubscriptionSettings-schedule').$('.mstrd-Select');
    }

    getSubscriptionPanel() {
        return this.$('.mstrd-SubscribeDetailsPanel');
    }

    getSubscribeButton() {
        return this.$('.mstrd-MenuPanel-buttonArea').$(`button[type='submit']`);
    }

    getInfoWindowSubscriptionPanel() {
        return this.$('.mstrd-SubscriptionInfo');
    }

    getSharePanel() {
        return this.$('.mstrd-DropdownMenu-main');
    }

    getInfoWindowEdit() {
        return this.$('.mstr-menu-icon.icon-subscrip_edit');
    }

    getInfoWindowEditButtonContainer() {
        return this.$(`//span[contains(@class,'icon-subscrip_edit')]//ancestor::div[@role='button']`);
    }

    getInfoWindowRunowButtonContainer() {
        return this.$(`//span[contains(@class,'icon-subscrip_run')]//ancestor::div[@role='button']`);
    }

    getSubscriptionRunNowButton() {
        return this.$('.icon-subscrip_run');
    }

    getSubscriptionEditButton() {
        return this.$('.icon-subscrip_edit');
    }

    getUnsubscribeButton() {
        return this.$('.icon-subscrip_unsubscribe');
    }

    getSubscribeIcon() {
        return this.$('.icon-group_recents.mstr-menu-icon');
    }

    getSubscriptionNoteButton() {
        return this.$('.icon-subscrip_notes');
    }

    /**
     * This method is to get the STRING LABEL of send preview now in subscription panel
     * @returns {WebdriverIO.Element}
     */
    getSendNowCheckbox() {
        return this.$('.mstrd-SubscriptionSettings-sendNow .mstrd-Checkbox-label');
    }

    /**
     * This method is to get the CHECKBOX and String label container of send preview now in subscription panel
     * @returns {WebdriverIO.Element}
     */
    getSendPreviewNowCheckbox() {
        return this.$('.mstrd-SubscriptionSettings-sendNow [role=checkbox]');
    }

    getSubscriptionFilterContainer() {
        return this.$('.mstrd-SubscriptionFilterDropdown');
    }

    getUnsubscribeDisabled() {
        return this.$('.mstr-menu-icon.icon-subscrip_unsubscribe.disabled');
    }

    getPDFSettingsPanel() {
        return this.$('.mstrd-MenuPanel.mstrd-ExportDetailsPanel');
    }

    getInfoWindowPDFSettingsPanel() {
        return this.$('.mstrd-ExportDetailsPanelInLibrary');
    }

    getInfoWindowEditPanel() {
        return this.$('.mstrd-RecommendationsContainer-content');
    }

    getEditorItems() {
        return this.$$('.mstrd-SubscriptionEditor-item');
    }

    getSubscriptionInfoIcon() {
        return this.$('.mstrd-SubscriptionEditor-title .mstrd-InfoIcon');
    }

    getEditorItemByName(name) {
        return this.getEditorItems().filter(async (elem) => {
            const text = await elem.getText();
            return text.includes(name)
        })[0];
    }

    getSidebarPDFSettingsPanel() {
        return this.$('.mstrd-SubscriptionEditDialog-main');
    }

    getRecipientSearchBox() {
        return this.$('.mstrd-RecipientSearchSection .mstrd-RecipientSearchSection-searchBox');
    }


    getSearchList() {
        return this.getSubscriptionPanel().$('.mstrd-RecipientSearchResults');
    }

    getSearchListLoadingIcon() {
        return this.getSearchList().$('.mstrd-RecipientSearchResults-loadingSpinner');
    }

    getRecipientByName(name) {
        return this.getRecipientSearchBox()
            .$$('.mstrd-RecipientCapsule')
            .filter(async (elem) => {
                const elemName = await elem.getText();
                return elemName.includes(name);
            })[0];
    }

    getRecipientSearchSection() {
        return this.$('.mstrd-RecipientSearchSection');
    }

    getRangePanel() {
        return this.$('.mstrd-SubscriptionSettings-rangeSetting .mstrd-DropDown-content');
    }

    getSubscriptionListCount() {
        return this.$$('.ReactVirtualized__Table__row.mstrd-SubscriptionListContainer-row').length;
    }

    getSubscriptionName() {
        return this.$('.mstrd-SubscriptionSettings-name');
    }

    getSubscriptionListNames() {
        return this.$$('.mstrd-SubscriptionListContainer-subscription--nameColumn');
    }

    getSubscriptionSidebarList() {
        return this.$('.mstrd-SubscriptionListContainer');
    }

    getSubscriptionSidebarEditDialog() {
        return this.$('.mstrd-SubscriptionEditDialog-main');
    }

    getSubscriptionSidebarResipientList() {
        return this.$('.mstrd-SubscriptionEditDialog-main .mstrd-RecipientSearchSection-searchList');
    }

    getSubscriptionShareResipientList() {
        return this.$('.mstrd-RecipientSearchSection-searchList');
    }


    getSubscriptionEmptyContent() {
        return this.$('.mstrd-EmptyContent');
    }

    getExcelContentsSetting() {
        return this.$('label=Contents').$('..').$('.mstrd-DropDownButton').$('.icon-menu-arrow');
    }

    getExcelRangeSetting() {
        return this.$('label=Range').$('..').$('.mstrd-DropDownButton').$('.icon-menu-arrow');
    }

    getContentsSetting() {
        return this.$('.mstrd-SubscriptionSettings-excelContent').$('.mstrd-DropDownButton-label');
    }

    getExcelDropDownContents() {
        return this.$('.mstrd-DropDown-content').$('.mstrd-DropDown-children');
    }

    getSelectedExcelContent(content) {
        return this.$(`div[data-value='${content}']`);
    }

    getRecipientGroupByName(name) {
        return this.getSearchList()
            .$$('.mstrd-RecipientGroup-name')
            .filter(async (elem) => {
                const elemName = await elem.getText();
                return elemName.includes(name);
            })[0];
    }

    getExpandRecipientGroupIconByName(name) {
        return this.getParent(this.getRecipientGroupByName(name)).$('.icon-menu-arrow');
    }

    getRecipientGroupMemberByName(name) {
        return this.getParent(this.getRecipientGroupByName(name)).$('.mstrd-RecipientGroup-count');
    }

    getSingleRecipientByName(name) {
        return this.getParent(
            this.getSearchList()
                .$$('.mstrd-RecipientUser-name .mstrd-RecipientUser-loginName')
                .filter(async (elem) => {
                    const elemText = await elem.getText();
                    return elemText === name;
                })[0]
        );
    }

    getSidebarSingleRecipientByName(name) {
        return this.getParent(
            this.getSubscriptionSidebarResipientList()
                .$$('.mstrd-RecipientUser-name .mstrd-RecipientUser-loginName')
                .filter(async (elem) => {
                    const elemText = await elem.getText();
                    return elemText === name;
                })[0]
        );
    }

    getRecipientSearchMsg() {
        return this.getSearchList().$('.mstrd-RecipientSearchResults-msg');
    }

    getSearchLoadingSpinner() {
        return this.$('.mstrd-RecipientSearchResults-loadingSpinner');
    }

    getRecipientInput() {
        return this.getSubscriptionPanel().$(
            '.mstrd-RecipientSearchSection .mstrd-RecipientSearchSection-searchBox .mstrd-RecipientSearchSection-input'
        );
    }

    getSubscriptionInSidebar(name, index = 1) {
        return this.$$(`.mstrd-SubscriptionListContainer-row`).filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText.includes(name);
        })[index - 1];
    }

    getSubscriptionPropertyByIndex(subscriptionName, index) {
        const subscriptionItem = this.getSubscriptionInSidebar(subscriptionName);
        return subscriptionItem.$$('[role=gridcell]')[index];
    }

    async getSubscriptionPropertyBySubscriptionName(subscriptionName, propertyName) {
        const headers = await this.getSubscriptionSidebarList()
            .$$('[role=columnheader]')
            .map(async (elem) => {
                return await elem.getText();
            });
        const index = headers.indexOf(propertyName);
        const gridCell = this.getSubscriptionPropertyByIndex(subscriptionName, index);
        return gridCell.getText();
    }

    getEditButtonInSidebar(name) {
        return this.getSubscriptionInSidebar(name).$('span[role="button"][aria-label="Edit"]');
    }

    getRunNowButtonInSidebar(name, index = 1) {
        return this.getSubscriptionInSidebar(name, index).$('.icon-subscrip_run');
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

    getRangeItem(name) {
        return this.$$(`.mstrd-TreeOption-label`).filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText.includes(name);
        })[0];
    }

    getCheckboxByPageName(name) {
        return this.$(`//div[text()='${name}']`).$('..');
    }

    getFilterCheckboxOption(option) {
        return this.getSubscriptionFilterContainer().$$('.mstrd-Checkbox-label')
                                                    .filter(async (elem) => {
                                                        const elemText = await elem.getText();
                                                        return elemText.includes(option);
                                                    })[0];
    }

    getSubscriptionFilterApplyButton() {
        return this.getSubscriptionFilterContainer().$$('.mstrd-SubscriptionFilterDropdown-categoryButton')
                                                    .filter(async (elem) => {
                                                        const elemText = await elem.getText();
                                                        return elemText.includes('Apply');
                                                    })[0];
    }

    getFilterOptionOnly(option) {
        return this.getSubscriptionFilterContainer().$$('.mstrd-Checkbox')
                                                    .filter(async (elem) => {
                                                        const elemText = await elem.getText();
                                                        return elemText.includes(option);
                                                    })[0].$('.mstrd-Checkbox-keepOnly');
    }

    getSubscriptionClearFiltersButton() {
        return this.getSubscriptionFilterContainer().$$('.mstrd-SubscriptionFilterDropdown-categoryButton')
                                                    .filter(async (elem) => {
                                                        const elemText = await elem.getText();
                                                        return elemText.includes('Clear Filters');
                                                    })[0];
    }

    getClearAll() {
        return this.getSubscriptionFilterContainer().$$('.mstrd-Button')
                                                    .filter(async (elem) => {
                                                        const elemText = await elem.getText();
                                                        return elemText.includes('Clear All');
                                                    })[0];
    }

    getClearAllButton() {
        return this.getFilterDropdownMainDialg().$$('.mstrd-Button')
                                                    .filter(async (elem) => {
                                                        const elemText = await elem.getText();
                                                        return elemText.includes('Clear All');
                                                    })[0];
    }

    getFiltersType() {
        return this.getSubscriptionFilterContainer().$$('.mstrd-SubscriptionFilterDropdown-category')
                                                    .filter(async (elem) => {
                                                        const elemText = await elem.getText();
                                                        return elemText.includes('Type');
                                                    })[0];
    }

    getSelectAll() {
        return this.getSubscriptionFilterContainer().$$('.mstrd-Button')
                                                    .filter(async (elem) => {
                                                        const elemText = await elem.getText();
                                                        return elemText.includes('Select All');
                                                    })[0];
    }

    getSelectAllButton() {
        return this.getFilterDropdownMainDialg().$$('.mstrd-Button')
                                                    .filter(async (elem) => {
                                                        const elemText = await elem.getText();
                                                        return elemText.includes('Select All');
                                                    })[0];
    }

    getSaveButtonWhenEditSubscription() {
        return this.$('.mstrd-SubscriptionEditor-saveButton');
    }

    getAllowUnsubscribe() {
       return this.$('.mstrd-SubscriptionSettings-unsubscribe .mstrd-Checkbox-label');
    }
   
    getSidebarContainer() {
        return this.$('.mstrd-SidebarContainer');
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
        return this.$('.mstrd-FilterDetailPanelCheckbox').$(`//div[contains(text(),'${name}')]`).$('..').$('..').$('.mstrd-Checkbox-keepOnly');
    }

    getFiltersApplyButton() {
        return this.$('.mstrd-BaseFilterPanel-applyBtn');
    }

    getClearAllFiltersButton() {
        return this.$('.mstrd-BaseFilterPanel-clearBtn');
    }

    getSnapshotByName(name) {
        return this.$('.mstrd-SnapshotItem-text-container').$(`//span[text()='${name}']`);
    }

    getLoadingButton() {
        return this.$('.mstrd-Spinner-blade');
    }

    async openSubscriptionSnapshotByName(name) {
        await this.click({elem: this.getSnapshotByName(name)});
    }

    async clickSubscriptionSortByOption(name) {
        await this.hover({ elem: this.getSubscriptionSortByOption(name) });
        await this.click({ elem: this.getSubscriptionSortByOption(name).$('..').$('.mstrd-SubscriptionListContainer-sortIcon') });
    }

    async isGetAllowUnsubscribePresent() {
        return this.getAllowUnsubscribe().isDisplayed();
    }

    async hoverSubscription(name) {
        await this.hover({ elem: this.getSubscriptionInSidebar(name) });
    }

    async clickEditButtonInSidebar(name, index = 1) {
        const subscription = this.getSubscriptionInSidebar(name, index);
        await this.click({ elem: subscription });
        await this.hover({ elem: subscription });
        const editButton = subscription.$('.icon-subscrip_edit');
        await this.click({ elem: editButton });
    }
    async getGroupMemberCount(name) {
        await this.waitForElementVisible(this.getRecipientGroupMemberByName(name));
        return this.getRecipientGroupMemberByName(name).getText();
    }

    async searchRecipientByName(searchKey) {
        await this.click({ elem: this.getRecipientInput() });
        await this.input(searchKey);
        await this.waitForElementVisible(this.getSearchList());
        await this.waitForElementStaleness(this.getSearchListLoadingIcon());
    }

    async selectRecipients(userList, groupName = 'None') {
        if (groupName !== 'None') {
            //expand user group first if hasn't
            if (this.getGroupMemberCount(groupName) !== '') {
                await this.click({ elem: this.getExpandRecipientGroupIconByName(groupName) });
            }
            //add group members
            for (const user of userList) {
                await this.click({ elem: this.getSingleRecipientByName(user) });
            }
            //click expand icon again to collapse user group
            await this.clickByForce({ elem: this.getExpandRecipientGroupIconByName(groupName) });
        } else {
            for (const user of userList) {
                await this.click({ elem: this.getSingleRecipientByName(user) });
            }
        }
    }

    async selectRecipientGroup(groupName) {
        await this.click({ elem: this. getRecipientGroupByName(groupName) });
    }

    async selectSidebarRecipients(userList, groupName = 'None') {
        if (groupName !== 'None') {
            //expand user group first if hasn't
            if (this.getGroupMemberCount(groupName) !== '') {
                await this.click({ elem: this.getExpandRecipientGroupIconByName(groupName) });
            }
            //add group members
            for (const user of userList) {
                await this.click({ elem: this.getSingleRecipientByName(user) });
            }
            //click expand icon again to collapse user group
            await this.clickByForce({ elem: this.getExpandRecipientGroupIconByName(groupName) });
        } else {
            for (const user of userList) {
                await this.click({ elem: this.getSidebarSingleRecipientByName(user) });
            }
        }
    }
    async openExcelContentsSetting() {
        await this.getExcelContentsSetting().click();
    }

    async selectExcelContents(content) {
        // await this.getExcelContentsSetting().click();
        await this.click({ elem: this.getExcelContentsSetting() });
        await this.waitForElementInvisible(this.getExcelDropDownContents());
        await this.getSelectedExcelContent(content).click();
    }

    async getFormatDropdown() {
        const select = await this.$('.mstrd-SubscriptionSettings-format').$('.mstrd-Select');
        return new Select(select);
    }

    async selectFormat(dropDownOption) {
        const dropdown = await this.getFormatDropdown();
        await dropdown.open();
        const option = dropdown.getOption(dropDownOption);
        await option.click();
        return this.sleep(1000);
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

    async clickRangeItem(name) {
        await this.click({ elem: this.getRangeItem(name) });
    }

    async clickItemOnly() {
        const item = await this.$('.mstrd-TreeOption-keepOnly');
        await item.click();
    }


    async clickEdit(name) {
        // const tmp = await this.element(by.cssContainingText('.mstrd-SubscriptionListContainer-row',name));
        // const edit = await tmp.$('.icon-subscrip_edit');
        // await edit.click();
        await this.waitForSubscriptionActionButtonsTobeEnabled(this.getEditButtonInSidebar(name));
        await this.click({ elem: this.getEditButtonInSidebar(name) });
        await this.waitForBookmarkLoaded();
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

    async waitForBookmarkLoaded() {
        await this.waitForElementVisible(this.getBookmarkSettings());
    }

    async clickRunNowInSubscriptionListByName(name, index = 1) {
        const subscription = this.getSubscriptionInSidebar(name, index);
        await this.click({ elem: subscription });
        await this.hover({ elem: subscription });
        await this.click({ elem: this.getRunNowButtonInSidebar(name, index) });
        await this.waitForElementVisible(this.getRunNowButtonInSidebar(name, index));
    }

    async getAllCheckboxStatus() {
        const status = await this.$('.mstrd-Tree-all').getAttribute('aria-checked');
        return status;
    }

    async getScheduleDropdown() {
        await this.waitForElementVisible(this.getScheduleSelector());
        const select = await this.getScheduleSelector();
        return new Select(select);
    }

    async selectSchedule(dropDownOption) {
        const dropdown = await this.getScheduleDropdown();
        await dropdown.open();
        // await this.sleep(1000);
        const option = dropdown.getOption(dropDownOption);
        await option.click();
        return this.sleep(1000);
    }

    async getBookmarkDropdown() {
        const select = await this.$('.mstrd-SubscriptionSettings-content').$('.mstrd-Select');
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

    async inputName(text) {
        // await this.getSubscriptionName().clear();
        await (await this.getSubscriptionName()).setValue(text);
        return this.sleep(500);
    }

    async inputBookmark(text) {
        // await this.$('.mstrd-SubscriptionSettings-bmName').clear();
        await (await this.$('.mstrd-SubscriptionSettings-bmName')).setValue(text);
        return this.sleep(500);
    }

    async inputNote(text) {
        // await this.$('.mstrd-SubscriptionSettings-note').clear();
        await (await this.$('.mstrd-SubscriptionSettings-note')).setValue(text);
        return this.sleep(500);
    }

    async clickSend() {
        const sendNow = await this.$('.mstrd-SubscriptionSettings-sendNow .mstrd-Checkbox-label');
        await sendNow.click();
        return this.sleep(500);
    }

    async createSubscription() {
        await this.getSubscribeButton().click();
    }

    async waitForSubscriptionCreated() {
        await this.waitForElementVisible(this.libraryNotification.getFloatNotification());
        await this.waitForElementInvisible(this.libraryNotification.getFloatNotification());
    }

    async toggleSendPreviewNow(toggleOn = true) {
        const isChecked = await this.isAriaChecked(this.getSendPreviewNowCheckbox());
        if (isChecked !== toggleOn) {
            await this.click({ elem: this.getSendNowCheckbox() });
        }
    }

    async clickInfoWindowEdit(isValid = true) {
        await this.waitForElementVisible(this.getInfoWindowEdit(), {
            msg: 'Cannot find subscription edit button.',
        });
        await this.waitForSubscriptionActionButtonsTobeEnabled(this.getInfoWindowEditButtonContainer());
        // await this.wait(
        //     this.EC.presenceOf(this.getInfoWindowEdit()),
        //     this.DEFAULT_TIMEOUT,
        //     'Cannot find subscription edit button.'
        // );
        await this.getInfoWindowEdit().click();
        //await this.waitForElementVisible(this.getSubscriptionEditor());
        // await this.getInfoWindowEdit().click();
        //if (isValid) await this.waitForElementEnabled(this.getSaveButtonWhenEditSubscription());
    }

    async clickInWindowRunNow() {
        await retryAsync(async () => {
            await this.waitForElementVisible(this.getSubscriptionRunNowButton(), {
                timeout: this.DEFAULT_TIMEOUT,
                msg: 'Cannot find subscription run now button.',
            });
        }, 3);
        await this.waitForSubscriptionActionButtonsTobeEnabled(this.getInfoWindowRunowButtonContainer());
        await this.click({ elem: this.getSubscriptionRunNowButton() });
        await this.waitForElementVisible(this.getSubscriptionRunNowButton());
    }

    async clickSave() {
        const save = await this.getSaveButtonWhenEditSubscription();
        await save.click();
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

    async clickSwitchRight() {
        const switchRight = await this.$('.mstrd-SubscriptionInfo-switchIcon--right');
        await switchRight.click();
    }

    async clickSwitchLeft() {
        const switchLeft = await this.$('.mstrd-SubscriptionInfo-switchIcon[aria-label="Previous"]');
        await switchLeft.click();
    }

    async closeSubscribe() {
        const close = await this.$('.mstrd-RecommendationsContainer-main>.icon-clearsearch');
        await close.click();
    }

    getRecipientInListByName(name) {
        return this.getSearchList().$$('.mstrd-RecipientUser-fullName').filter(async (elem) => {    
            return (await elem.getText()).includes(name);
        }
        )[0];
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

    async clickSidebarSave() {
        const save = await this.$('.mstrd-SubscriptionEditDialog-save');
        // await save.click();
        await this.click({ elem: save });
    }

    async isUnsubscribeDisabledPresent() {
        return this.getUnsubscribeDisabled().isDisplayed();
    }

    async isSubscriptionRunNowPresent() {
        return this.getSubscriptionRunNowButton().isDisplayed();
    }

    async isSubscriptionEditPresent() {
        return this.getSubscriptionEditButton().isDisplayed();
    }

    async isUnSubscribePresent() {
        return this.getUnsubscribeButton().isDisplayed();
    }

    async isSubscribePresent() {
        return this.getSubscribeIcon().isDisplayed();
    }

    async isSubscriptionNotePresent() {
        return this.getSubscriptionNoteButton().isDisplayed();
    }

    async isSendNowPresent() {
        return this.getSendNowCheckbox().isDisplayed();
    }

    async isSubscriptionEmptyContentPresent() {
        return this.getSubscriptionEmptyContent().isDisplayed();
    }

    async isSidebarContainerPrenent() {
        return this.getSidebarContainer().isDisplayed();
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
        await this.hover({elem: this.getFilterOptionCheckbox(name)})
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

    async clickClearAll() {
        await this.getClearAll().click();
    }

    async clickSelectAllButton() {
        await this.getSelectAllButton().click();
    }

    async clickClearAllButton() {
        await this.getClearAllButton().click();
    }

    async clickSelectAll() {
        await this.getSelectAll().click();
    }

    async clickFiltersType() {
        await this.getFiltersType().click();
    }

    async clickSubscriptionClearFilters() {
        await this.getSubscriptionClearFiltersButton().click();
    }

    async clickSortByDropdown() {
        const sort = await this.$('.mstrd-SortBox-arrow');
        await sort.click();
    }

    async openPDFSettingsMenu() {
        const tmp = await this.$('.mstrd-SubscriptionSettings-pdfSettings');
        await tmp.click();
    }

    async exitPDFSettingsMenu() {
        const tmp = await this.$('.mstrd-ExportDetailsPanel-backIcon.icon-backarrow');
        await tmp.click();
    }

    async exitInfoWindowPDFSettingsMenu() {
        const tmp = await this.$('.mstrd-SubscriptionInfo-back');
        await tmp.click();
    }

    async clickSidebarCancel() {
        const tmp = await this.$('.mstrd-SubscriptionEditDialog-cancel');
        await tmp.click();
    }

    async searchRecipient(name) {
        const searchBox = this.getRecipientSearchBox();
        await this.click({ elem: searchBox });
        if (this.isSafari()) {
            // safari doesn't support send keys to active element in else block
            await searchBox.setValue(name);
        } else {
            await this.input(name);
        }
        await this.waitForElementVisible(this.getSearchList());
    }

    async searchSidebarRecipient(name) {
        const searchBox = this.getRecipientSearchBox();
        await this.click({ elem: searchBox });
        if (this.isSafari()) {
            // safari doesn't support send keys to active element in else block
            await searchBox.setValue(name);
        } else {
            await this.input(name);
        }
        await this.waitForElementVisible(this.getSubscriptionSidebarResipientList());
    }

    async selectRecipient(name) {
        await this.waitForElementVisible(this.getRecipientInListByName(name), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Cannot find the target recipient.',
        });
        // await this.wait(
        //     this.EC.presenceOf(this.getRecipientInListByName(name)),
        //     this.DEFAULT_TIMEOUT,
        //     'Cannot find the target recipient.'
        // );
        const tmp = await this.getRecipientInListByName(name);
        await tmp.click();
    }

    async deleteRecipient(name) {
        const tmp = await this.getRecipientByName(name).$('.icon-pnl_delete-capsule');
        await tmp.click();
    }

    async clickAllowUnsubscribe() {
        const tmp = await this.$('.mstrd-SubscriptionSettings-unsubscribe .mstrd-Checkbox-label');
        await tmp.click();
    }

    async getSubscriptionNameText() {
        return this.getSubscriptionName().getText();
    }

    async isSubscriptionExisted(name) {
        const els = await this.getSubscriptionListNames();
        return this.isExisted(name, els, 'text');
    }

    async getScheduleItem() {
        const dropdown = await this.getScheduleDropdown();
        return dropdown.$('.mstrd-DropDownButton-label').getText();
    }

    async getFormatItem() {
        const dropdown = await this.getFormatDropdown();
        return dropdown.$('.mstrd-DropDownButton-label').getText();
    }

    async getFormatDropdownOptionValues() {
        const dropdown = await this.getFormatDropdown();
        await dropdown.open();
        return dropdown.getOptionsItemValues();
    }

    async getScheduleDropdownOptionValues() {
        const dropdown = await this.getScheduleDropdown();
        await dropdown.open();
        return dropdown.getOptionsItemValues();
    }

    async clickOnlyByChapterName(name) {
        await this.hover({ elem: this.getChapterByName(name) });
        await this.getOnlyButtonByChapterName(name).click();
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

    async isUnSubscribePresentByName(name) {
        const tmp1 = this.getSubscriptionInSidebar(name)
        const tmp2 = await tmp1.$('.icon-subscrip_unsubscribe');
        return tmp2.isDisplayed();
    }

    async isSidebarEditPresentByName(name) {
        const tmp1 = this.getSubscriptionInSidebar(name)
        const tmp2 = await tmp1.$('.icon-subscrip_edit');
        return tmp2.isDisplayed();
    }
    
    async isSidebarRunNowPresentByName(name) {
        const tmp1 = this.getSubscriptionInSidebar(name)
        const tmp2 = await tmp1.$('.icon-subscrip_run');
        return tmp2.isDisplayed();
    }

    async selectSortDirection(dir) {
        const tmp = await this.$$('.mstrd-SortDropdown-direction')
                                .filter(async (elem) => {
                                    const elemText = await elem.getText();
                                    return elemText.includes(dir);
                                })[0];
        await tmp.click();
    }

    async getCurrentBookmarkSelection() {
        return this.getBookmarkLabel().getText();
    }

    async getConditionTooltipText() {
        const el = this.getSubscriptionInfoIcon();
        await this.hover({ elem: el });
        const tooltip = this.$('.ant-tooltip-content');
        await this.waitForElementVisible(tooltip);
        return tooltip.getText();
    }
 
    async waitForLoadingButtonToDisappear(timeout = 60000) {
        const loadingButton = this.getLoadingButton();
        await browser.waitUntil(async () => {
            if (await loadingButton.isExisting()) {
                return !(await loadingButton.isDisplayed());
            }
            // If element doesn't exist at all, also treat as invisible
            return true;
        }, {
            timeout,
            timeoutMsg: 'Loading Button still exists after 60000 ms'
        });
    }

}
