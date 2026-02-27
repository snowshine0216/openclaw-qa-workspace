import BasePage from '../base/BasePage.js';

export default class HamburgerMenu extends BasePage {
    // Element locator

    getHamburgerIcon() {
        return this.$('.mstrd-HamburgerIconContainer');
    }

    getSliderMenuContainer() {
        return this.$('.mstrd-MobileSliderMenu-slider');
    }

    getSliderOptionContainer(option) {
        return this.$$('.mstrd-MobileSliderOptionRow-title').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === option;
        })[0];
    }

    getSliderMenuContainerTitle() {
        return this.getSliderMenuContainer().$('.mstrd-MobileSliderOptionRow-title');
    }

    getMenuOptions() {
        return this.getSliderMenuContainer().$$(
            '.mstrd-MobileSliderMenu-childrenContainer .mstrd-MobileSliderOptionRow-menuOption'
        );
    }

    getOption(option) {
        return this.$$('.mstrd-MobileSliderOptionRow-menuOption').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText.includes(option);
        })[0];
    }

    getCrossIcon() {
        return this.$('.mstrd-HamburgerIconContainer-icon--open');
    }

    _getButton(elem) {
        return this.$$('.mstrd-MobileSliderOptionRow-menuOption').filter(async (el) => {
            const elemText = await el.getText();
            return elemText === elem;
        })[0];
    }

    _getDropDownContainer(elem) {
        return elem.$('.mstrd-Select');
    }

    getLogOutButton() {
        return this.$('.mstrd-MobileAccountMenuItem-logout');
    }

    getExcelRangeSettings() {
        return this.$('.mstrd-ExcelExportPagesSetting');
    }

    getExportToExcelSettingsPanel() {
        return this.$('.mstrd-DossierExcelPanel');
    }

    getExportToCSVSettingsPanel() {
        return this.$('.mstrd-ExportPanel-options');
    }

    getExportToPDFSettingsPanel() {
        return this.$('.mstrd-ExportDetailsPanel');
    }

    getSubscribeToDashboardPanel() {
        return this.$('.mstrd-SubscribeDetailsPanel');
    }

    getDropDownSelectedItem(elem) {
        return this._getDropDownContainer(elem).$('.mstrd-DropDownButton-label');
    }

    _getDropDownlist(elem) {
        return this._getDropDownContainer(elem).$('.mstrd-Select-dropdown');
    }

    _getDropDownItems(elem) {
        return this._getDropDownlist(elem).$$('.mstrd-Option');
    }

    getFilterIcon() {
        return this.$('.mstrd-LibraryFilterContainer-button.icon-tb_sort-filter_n.mstr-nav-icon');
    }

    getFilterIconWhenPanelOpened() {
        return this.$(
            '.mstrd-LibraryFilterContainer-button.mstrd-LibraryFilterContainer-button--active.icon-tb_sort-filter_a.mstr-nav-icon'
        );
    }

    getSortAndFilterPanel() {
        return this.$('.mstrd-MobileSliderMenu-slider');
    }

    getSortByDropdown() {
        return this.getSortAndFilterPanel().$('.mstrd-SortBox');
    }

    getSortByDropdownList() {
        return this.getSortByDropdown().$('.mstrd-SortDropdown');
    }

    getTypesDropdown() {
        return this.getSortAndFilterPanel().$('.mstrd-DropDown.mstrd-Select.checkbox');
    }

    getTypesDropdownList() {
        return this.getTypesDropdown().$('.mstrd-Select-dropdown');
    }

    getCloseManageLibraryButton() {
        return this.$('.mstrd-MobileManageLibraryNavBarContainer-back.mstrd-Button.mstrd-Button--clear');
    }

    getUserNameInMobileView() {
        return this.$('.mstrd-MobileAccountMenuItem-option');
    }

    getButtonInMobileView(elem) {
        return this.$(`//div[@class="mstrd-MobileSliderOptionRow-menuTitle" and text()="${elem}"]`);
    }

    getFiltersListInMobileView(option) {
        return this.$$('.mstrd-BaseFilterItem, .mstrd-FilterItemContainer').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText.includes(option);
        })[0];
    }

    getAddFilterButtonInMobileView() {
        return this.$('.mstrd-MobileSliderOptionRow-addIcon.icon-pnl_add-new');
    }

    // action help

    getFilterPanelInMobileView() {
        return this.$('.mstrd-FilterPanel');
    }

    getFilterItems() {
        return this.$$('.mstrd-FilterItemContainer');
    }

    getFilterItemInMobileView(item) {
        const xpathCommand = this.getCSSContainingText('mstrd-FilterItemContainer', item);
        return this.getFilterPanelInMobileView().$(`${xpathCommand}`);
    }

    getTimezoneEditBtnInMobileView() {
        return this.$('.mstrd-TimezoneDetailsPanel-mine-edit');
    }

    getBackButtonInMobleView() {
        return this.$('.mstrd-MobileSliderOptionRow-menuOption--hasBackAction .mstrd-MobileSliderOptionRow-backArrow');
    }

    //action helper
    async openHamburgerMenu() {
        await this.click({ elem: this.getHamburgerIcon() });
        return this.waitForElementVisible(this.getSliderMenuContainer());
    }

    async closeHamburgerMenu() {
        await this.click({ elem: this.getCrossIcon() });
        return this.waitForElementInvisible(this.getSliderMenuContainer());
    }

    async clickOptionInMobileView(option) {
        await this.click({ elem: this.getOption(option) });
        await this.waitForDynamicElementLoading();
        await this.sleep(5000); // await for animation load
    }

    async openFilterDetailPanelInMobileView(item) {
        await this.click({ elem: this.getFilterItemInMobileView(item) });
        await this.waitForElementVisible(this.getSliderOptionContainer('Filter Details'));
        await this.waitForDynamicElementLoading();
        await this.sleep(5000); // await for animation load
    }

    async clickEditBtnInMobileView() {
        await this.click({ elem: this.getTimezoneEditBtnInMobileView() });
        await this.waitForDynamicElementLoading();
        await this.waitForElementVisible(this.getSliderOptionContainer('Preferences'));
        await this.sleep(5000); // await for animation load
    }

    async clickBackButtonInMobileView() {
        await this.click({ elem: this.getBackButtonInMobleView(), checkClickable: false });
    }

    async clickButton(option) {
        await this.clickAndNoWait({ elem: this._getButton(option) });
        return this.sleep(1000);
    }

    async clickShare() {
        await this.click({ elem: this._getButton('Share') });
    }

    async clickExportToExcel() {
        await this.click({ elem: this._getButton('Export to Excel') });
    }

    async clickExportToPDF() {
        await this.click({ elem: this._getButton('Export to PDF') });
    }

    async clickExportToCSV() {
        await this.click({ elem: this._getButton('Export to CSV') });
    } 

    async clickSubscribeToDashboard() {
        await this.click({ elem: this._getButton('Subscribe to Dashboard') });
    }

    async clickAutoAnswers() {
        await this.click({ elem: this._getButton('Auto Answers') });
    }

    async close() {
        await this.click({ elem: this.getHamburgerIcon() });
        return this.waitForDynamicElementLoading();
    }

    async _selectDropDownItemOption({ dropDownOption, dropDownItems }) {
        const dropdownItems = await dropDownItems();
        for (const dropDownItem of dropdownItems) {
            const name = await dropDownItem.getText();
            if (name === dropDownOption) {
                return dropDownItem.click();
            }
        }
        throw new Error(`Dropdown option '${dropDownOption}' was not found`);
    }

    async selectExcelRange(dropDownOption) {
        await this.waitForElementVisible(this.getExcelRangeSettings(), { msg: 'Cannot find Detail Level selector.' });
        await this.click({ elem: this.getDropDownSelectedItem(this.getExcelRangeSettings()) });
        await this.waitForElementVisible(this._getDropDownlist(this.getExcelRangeSettings()), {
            msg: 'Detail Level dropdown did not open.',
        });
        await this._selectDropDownItemOption({
            dropDownOption,
            dropDownItems: () => this._getDropDownItems(this.getExcelRangeSettings()),
        });
        return this.sleep(1000);
    }

    async clickFilterOptionInMobileView(option) {
        await this.click({ elem: this.getFiltersListInMobileView(option) });
        await this.waitForElementVisible(this.getSliderOptionContainer('Filter Details'));
        return this.waitForDynamicElementLoading();
    }

    async openLibraryFilterInMobileView() {
        if (await this.isMobileSliderMenuOpened()) {
            await this.closeHamburgerMenu();
        }
        await this.openHamburgerMenu();
        await this.clickOptionInMobileView('Filters');
        await this.waitForElementVisible(this.getSliderOptionContainer('Filters'));
        await this.waitForDynamicElementLoading();
        await this.sleep(500); // await for animation load
    }

    async openFilterPanelInMobileView() {
        if (await this.isMobileSliderMenuOpened()) {
            await this.closeHamburgerMenu();
        }
        await this.openHamburgerMenu();
        await this.clickOptionInMobileView('Filter');
        await this.waitForElementVisible(this.getSliderOptionContainer('Filter Data'));
        await this.waitForDynamicElementLoading();
        await this.sleep(500); // await for animation load
    }

    async closeFilterPanelInMobileView() {
        if (await this.isMobileSliderMenuOpened()) {
            await this.closeHamburgerMenu();
        }
    }

    async openSortByDropdownInMobileView() {
        if (await this.isMobileSliderMenuOpened()) {
            await this.closeHamburgerMenu();
        }
        await this.openHamburgerMenu();
        await this.clickOptionInMobileView('Sort');
        return this.waitForElementVisible(this.getSliderOptionContainer('Sort By'));
    }

    async closeSortByDropdownInMobileView() {
        if (await this.isMobileSliderMenuOpened()) {
            await this.closeHamburgerMenu();
        }
    }

    async openTypesDropdownInMobileView() {
        if (await this.isMobileSliderMenuOpened()) {
            await this.closeHamburgerMenu();
        }
        await this.openHamburgerMenu();
        await this.clickOptionInMobileView('Filters');
        await this.waitForElementVisible(this.getSliderOptionContainer('Filters'));
        await this.clickFilterOptionInMobileView('Type');
        await this.waitForElementVisible(this.getSliderOptionContainer('Filter Details'));
        await this.waitForDynamicElementLoading();
    }

    async closeTypesDropdownInMobileView() {
        await this.closeHamburgerMenu();
    }

    async closeManageLibrary() {
        return this.click({ elem: this.getCloseManageLibraryButton() });
    }

    async openAutoAnswersInMobileView() {
        if (await this.isMobileSliderMenuOpened()) {
            await this.closeHamburgerMenu();
        }
        await this.openHamburgerMenu();
        await this.clickOptionInMobileView('Auto Answers');
        await this.waitForElementVisible(this.getSliderOptionContainer('Auto Answers'));
        await this.waitForDynamicElementLoading();
        await this.sleep(500); // await for animation load
    }

    async isMobileSliderMenuOpened() {
        return this.getSliderMenuContainer().isDisplayed();
    }

    async getMenuOptionsCount() {
        return this.getMenuOptions().length;
    }

    async clickAddFilterButtonInMobileView() {
        await this.click({ elem: this.getAddFilterButtonInMobileView() });
        await this.waitForDynamicElementLoading();
        await this.sleep(500); // await for animation load
    }
}
