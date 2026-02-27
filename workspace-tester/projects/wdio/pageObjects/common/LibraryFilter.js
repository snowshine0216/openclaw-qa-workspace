import BasePage from '../base/BasePage.js';
import { multiElements } from '../../utils/index.js';

export default class LibraryFilter extends BasePage {
    // Element locator

    getFilterIcon() {
        return this.$('.mstrd-LibraryFilterContainer-button');
    }

    getFilterContainer() {
        return this.$('.mstrd-LibraryFilterDropdown-filterPanel');
    }

    getFilterContentsContainer() {
        return this.getFilterContainer().$('.mstrd-DropdownMenu-main');
    }

    getBaseFilterContainer() {
        // For scrolling in responsive view
        return this.$('.mstrd-BaseFilterPanel-body');
    }

    getFilterOptionButton(option) {
        const xpathCommand = `//span//*[contains(text(),'${option}')]//ancestor::span`;
        return this.getFilterContainer().$(`${xpathCommand}`);
        //return this.getFilterContainer().element(by.cssContainingText('span', `${option}`));
    }

    getLibraryFilterItems() {
        return this.getFilterContainer().$$('.mstrd-BaseFilterItem');
    }

    getLibraryFilterItem(type, index = 0) {
        const typeRegExp = multiElements(type);
        return this.getFilterContainer()
            .$$('.mstrd-BaseFilterItem')
            .filter(async (elem) => {
                const filterTitle = await elem.getText();
                return typeRegExp.test(filterTitle);
            })[index];
    }

    getFilterTypesLabel() {
        return this.getFilterDetailsPanel().$('.mstrd-Checkbox-label');
    }

    getFilterCertifiedSwitch() {
        return this.getFilterContainer().$('.mstrd-Switch');
    }

    getFilterClearAllButton() {
        return this.getFilterContainer().$('.mstrd-BaseFilterPanel-clearBtn');
    }

    getFilterApplyButton() {
        return this.getFilterContainer().$('.mstrd-BaseFilterPanel-applyBtn');
    }

    getCurtain() {
        return this.$('.mstrd-LibraryViewCurtain--transparent');
    }

    getLibraryFilterApplyCount() {
        return this.$('.mstrd-LibraryFilterContainer-applyCount');
    }

    getFilterDetailsPanel() {
        return this.$('.mstrd-BaseFilterDetailPanel');
    }

    getFilterDetailsPanelItems() {
        return this.getFilterDetailsPanel().$$('.mstrd-Checkbox');
    }

    getFilterDetailsPanelItem(option) {
        return this.getFilterDetailsPanel()
            .$$('.mstrd-Checkbox')
            .filter(async (elem) => {
                const filterName = await elem.getText();
                return filterName.includes(option);
            })[0];
    }

    getFilterDetailsPanelButton(button) {
        return this.getFilterDetailsPanel()
            .$$('.mstrd-Button')
            .filter(async (elem) => {
                const buttonName = await elem.getText();
                return buttonName === button;
            })[0];
    }

    // Method may be removed with Library Filters new implementations
    getFilterTypesDropdown() {
        return this.getLibraryFilterItem('Type');
    }

    getFilterTypesDropdownButton() {
        return this.getFilterTypesDropdown().$('.mstrd-DropDownButton');
    }

    getFilterTypesItems() {
        return this.getFilterDetailsPanel().$$('.mstrd-Checkbox-label');
    }

    getFilterItemsTitle() {
        return this.$$('.mstrd-BaseFilterItem-title');
    }

    getFilterDetailPanelCheckbox() {
        return this.getFilterDetailsPanel().$('.mstrd-FilterDetailPanelCheckbox');
    }

    getOptionInCheckboxDetailPanel(name) {
        return this.getFilterDetailPanelCheckbox()
            .$$('.mstrd-Checkbox-main')
            .filter(async (elem) => {
                return name === (await elem.getText());
            })[0];
    }

    getFilterDetailPanelCheckboxItems() {
        return this.getFilterDetailPanelCheckbox().$$('.mstrd-Checkbox-main');
    }

    getOnlyButton(name) {
        const parent = this.getParent(this.getOptionInCheckboxDetailPanel(name));
        return parent.$('.mstrd-Checkbox-keepOnly');
    }

    getViewSelectedButton() {
        return this.getFilterDetailsPanel().$('.mstrd-Switch');
    }

    getFilterCapsule(name) {
        return this.getFilterContainer()
            .$$('.mstrd-FilterItemContentCheckbox-text')
            .filter(async (elem) => {
                const text = await elem.getText();
                return name === text;
            })[0];
    }

    getFilterCount() {
        return this.$('.mstrd-LibraryFilterContainer-applyCount');
    }

    getSearchInput() {
        return this.getFilterDetailsPanel().$('.ant-input');
    }

    getSearchClearButton() {
        return this.getFilterDetailsPanel().$('.icon-clearsearch');
    }

    getNoElementFound() {
        return this.getFilterDetailsPanel().$('.mstrd-FilterDetailPanelCheckbox-empty');
    }

    // Action helper

    async hoverFilter() {
        await this.hover({ elem: this.getFilterIcon() });
        await this.waitForElementVisible(this.getTooltipContainer(), { msg: 'Tooltip is not displayed.' });
        return this.sleep(1000); // Wait for animation to complete
    }

    async clickFilterIcon() {
        let flag = false;
        for (let i = 1; i < 3 && !flag; i++) {
            await this.click({ elem: this.getFilterIcon() });
            try {
                await this.waitForElementVisible(this.getFilterContainer());
                await this.sleep(1000);
                flag = await this.getFilterContainer().isDisplayed();
            } catch (e) {
                await this.sleep(1000);
                continue;
            }
        }
        return this.waitForElementVisible(this.getFilterContainer(), {
            msg: 'Filter container did not open after 3 times click',
        });
    }

    async closeFilterPanel() {
        await this.clickApplyButton();
    }

    async openFilterTypeDropdown() {
        let flag = await (await this.getFilterDetailsPanel()).isDisplayed();
        let attr = await this.getLibraryFilterItem('Type').getAttribute('class');
        let selected = attr.includes('mstrd-BaseFilterItem--selected');
        if (!(flag && selected)) {
            await this.openFilterDetailPanel('Type');
        }
    }

    async openFilterDetailPanel(type, index = 0) {
        await this.waitForElementVisible(this.getFilterContainer());
        await this.click({ elem: this.getLibraryFilterItem(type, index) });
        return this.sleep(1000); // wait filter detail panel to render
    }

    async checkFilterType(option) {
        await this.waitForElementVisible(this.getFilterDetailsPanel());
        const checked = await this.isFilterTypeChecked(option);
        if (!checked) {
            await this.click({ elem: this.getFilterDetailsPanelItem(option) });
        }
        await this.clickApplyButton();
        await this.clickFilterIcon();
    }

    async selectFilterOptionButton(option) {
        let flag = await (await this.getFilterDetailsPanel()).isDisplayed();
        let attr = await this.getLibraryFilterItem('Status').getAttribute('class');
        let selected = attr.includes('mstrd-BaseFilterItem--selected');
        if (!(flag && selected)) {
            await this.openFilterDetailPanel('Status');
        }
        const checked = await this.isFilterTypeChecked(option);
        if (!checked) {
            await this.click({ elem: this.getFilterDetailsPanelItem(option) });
        }
        await this.clickApplyButton();
        await this.clickFilterIcon();
        await this.openFilterDetailPanel('Status');
    }

    async uncheckFilterType(option) {
        const checked = await this.isFilterTypeChecked(option);
        if (checked) {
            await this.click({ elem: this.getFilterDetailsPanelItem(option) });
        }
        await this.clickApplyButton();
        await this.clickFilterIcon();
    }

    async selectFilter(path , index = 0) {
        await this.openFilterDetailPanel(path[0], index);
        await this.selectFilterDetailsPanelItem(path[1]);
    }

    async selectFilterDetailsPanelItem(option) {
        await this.click({ elem: this.getFilterDetailsPanelItem(option) });
    }

    async isFilterTypeItemPresent(option) {
        const elem = await this.getOptionInCheckboxDetailPanel(option);
        return elem.isDisplayed();
    }

    async selectCertifiedOnly() {
        return this.click({ elem: this.getFilterCertifiedSwitch() });
    }

    async selectOptionInCheckbox(name) {
        await this.click({ elem: this.getOptionInCheckboxDetailPanel(name) });
    }

    async clickClearAllButton() {
        await this.click({ elem: this.getFilterClearAllButton() });
        await this.clickApplyButton();
        await this.clickFilterIcon();
    }

    async clickApplyButton() {
        if (await this.isApplyButtonEnable()) {
            await this.click({ elem: this.getFilterApplyButton() });
            return this.waitForElementInvisible(this.getFilterContainer());
        } else {
            await this.click({ elem: this.getFilterIcon() });
        }
        await this.waitForDynamicElementLoading();
        await this.waitForLibraryLoading();
    }

    async keepOnlyOption(name) {
        await this.hover({ elem: this.getOptionInCheckboxDetailPanel(name) });
        await this.click({ elem: this.getOnlyButton(name) });
    }

    async clickFilterDetailsPanelButton(button) {
        await this.click({ elem: this.getFilterDetailsPanelButton(button) });
    }

    async toggleViewSelected() {
        await this.click({ elem: this.getViewSelectedButton() });
    }

    async searchFilterItem(name) {
        await this.click({ elem: this.getSearchInput() });
        await this.getSearchInput().setValue(name);
        await this.waitForDynamicElementLoading();
    }

    async clearSearch() {
        await this.click({ elem: this.getSearchClearButton() });
    }

    // Assertion helper

    async isDossierSelected() {
        return this.getFilterCapsule('Dashboard').isDisplayed();
    }

    async isDocumentSelected() {
        return this.isFilterTypeChecked('Document');
    }

    async isFilterTypeChecked(option) {
        return this.getFilterCapsule(option).isDisplayed();
    }

    async isNewtSelected() {
        const elem = this.getFilterOptionButton('New');
        return elem.getAttribute('aria-checked');
    }

    async isUpdatedSelected() {
        const elem = this.getFilterOptionButton('Updated');
        return elem.getAttribute('aria-checked');
    }

    async isCertifiedSelected() {
        const elem = this.getFilterOptionButton('Certified');
        return elem.getAttribute('aria-checked');
    }

    async filterTypes() {
        await this.waitForElementVisible(this.getFilterTypesLabel());
        return this.getFilterTypesLabel().getText();
    }

    async filterApplyCount() {
        const present = await (await this.getLibraryFilterApplyCount()).isDisplayed();
        if (present) {
            return this.getLibraryFilterApplyCount().getText();
        } else {
            return '0';
        }
    }

    async getFilterDropdownOptionsNames() {
        return this.getFilterItemsTitle().map(async (elem) => {
            return elem.getText();
        });
    }

    async getFilterOptions() {
        return this.getLibraryFilterItems().map(async (elem) => {
            return elem.getText();
        });
    }

    async getFilterTypeItemsNames() {
        return this.getFilterTypesItems().map(async (elem) => {
            return elem.getText();
        });
    }

    async isFilterOpen() {
        return this.getFilterContainer().isDisplayed();
    }

    async isCertifiedSwitchFocused() {
        const elem = this.getFilterCertifiedSwitch();
        return (await elem.getAttribute('data-focus-visible-added')) === '';
    }

    async isApplyButtonEnable() {
        return this.getFilterApplyButton().isEnabled();
    }

    async getDetailsPanelItemsCount() {
        return this.getFilterDetailsPanelItems().length;
    }

    async changeTypesTo(option) {
        await this.clickFilterIcon();
        await this.openFilterTypeDropdown();
        await this.checkFilterType(option);
        await this.clickApplyButton();
    }

    async clearTypesSelection() {
        await this.clickFilterIcon();
        await this.openFilterTypeDropdown();
        await this.clickClearAllButton();
        await this.clickApplyButton();
    }

    async clearAllFilters() {
        await this.clickFilterIcon();
        await this.clickClearAllButton();
    }

    async filterCount() {
        return this.getFilterCount().getText();
    }

    async isFilterCountDisplayed() {
        return this.getFilterCount().isDisplayed();
    }

    async noElementText() {
        return this.getNoElementFound().getText();
    }

    async isLibraryFilterDisplay() {
        return this.getFilterIcon().isDisplayed();
    }
}
