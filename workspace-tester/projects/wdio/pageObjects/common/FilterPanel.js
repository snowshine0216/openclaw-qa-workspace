import BasePage from '../base/BasePage.js';
import Panel from './Panel.js';
import DossierPage from '../dossier/DossierPage.js';
import { getAttributeValue } from '../../utils/getAttributeValue.js';
import { scrollElementToBottom, scrollIntoView } from '../../utils/scroll.js';

export default class FilterPanel extends BasePage {
    constructor() {
        super();
        this.panel = new Panel();
        this.dossierPage = new DossierPage();
    }

    // Element locator

    getFilterList() {
        return this.getFilterPanelContent().$$('.mstrd-FilterItemTitle-filterTitle');
    }

    getFilterByOrder(index) {
        return this.getFilterList()[index];
    }

    getFilterIcon() {
        return this.$('.mstr-nav-icon.icon-tb_filter_n');
    }

    getFilterIconOnLeft() {
        return this.$('.mstrd-NavBar-left .mstr-nav-icon.icon-tb_filter_n');
    }

    getOpenedFilterIconOnLeft() {
        return this.$('.mstrd-NavBar-left .mstr-nav-icon.icon-tb_filter_a');
    }

    getFilterIconOfOpenedFilterPanel() {
        return this.$('.mstr-nav-icon.icon-tb_filter_a');
    }

    getFilterPanel() {
        return this.$('.mstrd-FilterDropdownMenuContainer');
    }

    getFilterMainPanel() {
        return this.$('.mstrd-DropdownMenu-main, .mstrd-MobileSliderMenu-slider');
    }

    getFilterPanelDropdown() {
        return this.$('.mstrd-FilterDropdownMenuContainer .mstrd-DropdownMenu-content');
    }

    getFilterPanelByName(name) {
        const xpathCommand = this.getCSSContainingText('mstrd-FilterItemContainer', name);
        return this.getFilterPanelDropdown().$(`${xpathCommand}`);
    }

    getWarningMessage(name) {
        return this.getFilterPanelByName(name).$('.mstrd-FilterItemContainer-emptyWarning');
    }

    getInfoIcon(name) {
        return this.getFilterPanelByName(name).$('.mstrd-InfoIcon');
    }

    getFilterDetailsPanel() {
        return this.$('.mstrd-FilterDetailsPanel');
    }

    getFilterPanelWrapper() {
        return this.$('.mstrd-DropdownMenu-main');
    }

    getFilterPanelContent() {
        return this.$('.mstrd-FilterPanel-content');
    }

    getFilterPanelHeader() {
        return this.panel.getPanelHeader(this.getFilterPanel());
    }

    getFilterPanelFooter() {
        return this.$('.mstrd-FilterPanelFooterContainer');
    }

    getMoreSettingIcon() {
        return this.$('.mstrd-DropdownMenu-headerIcon.icon-pnl_more-options');
    }

    getDockPanel() {
        return this.panel.getDockPanel(this.getFilterPanel());
    }

    getDockIcon() {
        return this.panel.getDockIcon(this.getFilterPanel());
    }

    getCloseIcon() {
        return this.panel.getCloseIcon(this.getFilterPanel());
    }

    getUndockIcon() {
        return this.panel.getUndockIcon(this.getFilterPanel());
    }

    getApplyButton() {
        return this.$('.mstr-apply-button');
    }

    getDisabledApplyButton() {
        return this.$('.mstr-apply-button.apply-disabled');
    }

    getClearFilter() {
        if (this.isSafari()) {
            // clicking on <span> on safari is not supported, return a div element
            return this.$('.mstr-clear-text');
        } else {
            return this.$('.mstr-clear-text > span');
        }
    }

    getDisabledClearFilterButton() {
        return this.$('.mstr-clear-text.inactive');
    }

    getResetAllFiltersButton() {
        return this.getFilterMainPanel()
            .$$('.mstr-clear-text')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === 'Reset All Filters';
            })[0];
    }

    getClearAllFiltersButton() {
        return this.getFilterMainPanel()
            .$$('.mstr-clear-text')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === 'Clear All Filters';
            })[0];
    }

    getTooltip() {
        return this.$('.ant-tooltip-inner');
    }

    getFilterDisabledMessage() {
        return this.$('.mstrd-LockFilterMessageSection');
    }

    // GDDE specific

    getGDDEError() {
        return this.$('.mstrd-FilterItemTitle.mstrd-FilterItemTitle-gddeStatus');
    }

    getGDDEUpdate() {
        return this.$('.mstrd-FilterItemTitle-gddeStatus > .loading-spinner');
    }

    getRetryGDDE() {
        return this.$('.mstrd-FilterItemTitle-filterRetry');
    }

    getCancelGDDE() {
        return this.$('.mstrd-FilterItemTitle-filterCancel');
    }

    getGDDEWarningIcon() {
        return this.$('.icon-warning');
    }

    getLoadingSpinner() {
        return this.getFilterPanel().$('.mstrd-Spinner');
    }

    getLockedFilterItem() {
        return this.getFilterPanel().$('.mstrd-FilterItemContainer-locked');
    }

    getLockedFilterItems() {
        return this.getFilterPanel().$$('.mstrd-FilterItemContainer-locked');
    }

    getFilterItemContainerByName(name, index = 0) {
        return this.$$('.mstrd-FilterItemContainer').filter(async (elem) => {
            const text = await elem.getText();
            return text.includes(name);
        })[index];
    }

    getLockedFilterItemByName(name) {
        return this.getFilterItemContainerByName(name).$('.mstrd-FilterItemContainer-locked');
    }

    getLockedAttrFilterDetailsPanel(name) {
        return this.getFilterItemContainerByName(name).$('.mstrd-AttrElemDetailsPanel-locked');
    }

    getLockedVizFilterDetailsPanel(name) {
        return this.getFilterItemContainerByName(name).$('.mstrd-VisFilterDetailsPanel-locked');
    }

    getLockedCalFilterDetailsPanel(name) {
        return this.getFilterItemContainerByName(name).$('.mstrd-FilterItemContainer-locked');
    }

    getGlobalFilterIcon(name, index = 0) {
        return this.getFilterItemContainerByName(name, index).$('.mstrd-FilterItemTitle-icon');
    }

    getViewSelected() {
        return this.$('.mstrd-FilterViewSelected .mstrd-Switch');
    }

    getAddFilterButton() {
        return this.$('.mstrd-DropdownMenu-headerIcon.icon-pnl_add-new.addFilter');
    }

    getAddFilterContent() {
        return this.$(`.mstrd-FilterPanelAddFilter-popover-content`);
    }

    getAddFilterItemLabel(item) {
        const xpathCommand = this.getCSSContainingText('mstrd-FilterItemsList-itemContainer', item);
        return this.getAddFilterContent().$(`${xpathCommand}`);
    }

    getButtonInAddFilterContent(btnName){
        return this.getAddFilterContent().$(`//*[contains(@class,'mstrd-FilterPanelAddFilter-actions-section')]//*[contains(@class,'mstrd-Button') and text()='${btnName}']`);
    }

    getDisplayForm(formName) {
        return this.$(`//div[contains(@class,'displayForms')]//span[text()='${formName}']`);
    }

    getButton(buttonName) {
        return this.$(`//div[contains(@class, 'mstrmojo-ui-MenuEditor')]//div[text()='${buttonName}']`);
    }

    async getFilterPanelWrapperHeight() {
        const eleSize = await this.getFilterPanelWrapper().getSize('height');
        return eleSize;
    }

    async getFilterPanelContentHeight() {
        const eleSize = await this.getFilterPanelContent().getSize('height');
        return eleSize;
    }

    async getFilterPanelHeaderHeight() {
        const eleSize = await this.getFilterPanelHeader().getSize('height');
        return eleSize;
    }

    async getFilterPanelFooterHeight() {
        const eleSize = this.getFilterPanelFooter().getSize('height');
        return eleSize;
    }

    getAddFilterMenu() {
        return this.$('.mstrd-FilterPanelAddFilter-menu');
    }

    getFilterItem(name) {
        return this.getAddFilterMenu()
            .$$('.mstrd-Checkbox')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === name;
            })[0];
    }

    getAddFilterMenuButton(button) {
        return this.getAddFilterMenu()
            .$$('.mstrd-Button')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === button;
            })[0];
    }

    getEmptyFilter() {
        return this.$('.mstrd-FilterPanel-empty');
    }

    //Secondary filter panel
    getSecondaryFilterPanel() {
        return this.$('.mstrd-FilterDetailsPanel.mstrd-FilterDetailsPanel-filter-panel');
    }

    // Action method

    async openFilterPanel() {
        await this.click({ elem: this.getFilterIcon() });
        await this.waitForElementVisible(this.getFilterPanel(), {
            timeout: 5000,
            msg: 'Filter Panel is not open or clickable.',
        });
        await this.waitForDynamicElementLoading();
        await this.waitForElementStaleness(this.getLoadingSpinner());
        return this.sleep(2000);
    }

    async closeFilterPanel() {
        await this.getFilterIconOfOpenedFilterPanel().click();
        return this.waitForElementStaleness(this.getFilterPanel(), {
            timeout: 5000,
            msg: 'Filter Panel is still displayed after close.',
        });
    }

    async closeFilterPanelByCloseIcon() {
        return this.panel.closePanel(this.getFilterPanel());
    }

    async dockFilterPanel() {
        return this.panel.dockPanel(this.getFilterPanel());
    }

    async undockFilterPanel() {
        return this.panel.undockPanel(this.getFilterPanel());
    }

    async toggleFilterSummary() {
        await this.getMoreSettingIcon().click();
        await this.$('.mstrd-FilterPanelContextMenu-menu').$('li').click();
    }

    async apply() {
        await this.waitForGDDE();
        await this.click({ elem: this.getApplyButton() });
        await this.dossierPage.waitForDossierLoading();
        await this.waitForElementInvisible(this.getFilterPanel(), {
            timeout: 5000,
            msg: 'Filter Panel is still displayed after apply.',
        });
        await this.waitForDynamicElementLoading();
        return this.waitForElementInvisible(this.getLoadingSpinner());
    }

    async applyAndReopenPanel(optionalFilter) {
        await this.apply();
        const isPanelOpen = await this.isMainPanelOpen();
        if (!isPanelOpen) {
            await this.openFilterPanel();
        }
        if (optionalFilter) {
            await this.baseFilter.openSecondaryPanel(optionalFilter);
        }
        return this.sleep(100);
    }

    async applyWithoutWaiting(isWait = true) {
        await this.waitForElementInvisible(this.getDisabledApplyButton(), {
            timeout: 2000,
            msg: 'Apply button is not enabled.',
        });
        await this.getApplyButton().click();
        if (isWait) {
            // Wait for any tooltip animation
            await this.sleep(1500);
        }

    }

    


    async waitForGDDE() {
        await this.sleep(500);
        await this.waitForElementInvisible(this.getGDDEUpdate(), { timeout: 3000, msg: 'GDDE did not get resolved.' });
        return this.sleep(500);
    }

    async clearFilter() {
        await this.click({ elem: this.getClearFilter() });
        return await this.waitForElementClickable(this.getApplyButton());
    }

    async resetAllFilters() {
        await this.click({ elem: this.getResetAllFiltersButton() });
        return this.waitForElementClickable(this.getApplyButton());
    }

    async clearAllFilters() {
        await this.click({ elem: this.getClearAllFiltersButton() });
        return this.waitForElementClickable(this.getApplyButton());
    }

    async filterName({ index }) {
        return this.getFilterByOrder(index).getText();
    }

    async scrollFilterPanelContentToBottom() {
        return scrollElementToBottom(this.getFilterPanelContent());
    }

    async selectFilterItem(name) {
        let selected = await this.isChecked(this.getFilterItem(name));
        if (!selected) {
            await this.click({ elem: this.getFilterItem(name) });
        }
    }

    async selectFilterItems(nameList) {
        for (let name of nameList) {
            await this.selectFilterItem(name);
        }
    }

    async unselectFilterItem(name) {
        let selected = await this.isChecked(this.getFilterItem(name));
        if (selected) {
            await this.click({ elem: this.getFilterItem(name) });
        }
    }

    async clickAddFilterMenuButton(name) {
        await this.click({ elem: this.getAddFilterMenuButton(name) });
        await this.waitForDynamicElementLoading();
    }

    // Assertion helper

    async isMainPanelOpen() {
        return this.getFilterPanel().isDisplayed();
    }

    async isFilterIconPresent() {
        return this.getFilterIcon().isDisplayed();
    }

    async isMoreSettingPresent() {
        return this.getMoreSettingIcon().isDisplayed();
    }

    async isPanelCloseIconDisplayed() {
        return this.panel.isPanelCloseIconDisplayed(this.getFilterPanel());
    }

    async isDockIconDisplayed() {
        return this.panel.isDockIconDisplayed(this.getFilterPanel());
    }

    async isUndockIconDisplayed() {
        return this.panel.isUndockIconDisplayed(this.getFilterPanel());
    }

    async isLeftDocked() {
        return this.panel.isLeftDocked(this.getFilterPanel());
    }

    async isRightDocked() {
        return this.panel.isRightDocked(this.getFilterPanel());
    }

    async isPanelDocked() {
        return this.panel.isPanelDocked(this.getFilterPanel());
    }

    async isApplyEnabled() {
        const buttonColor = this.getApplyButton().getCSSProperty('background-color');
        return buttonColor === 'rgba(14, 111, 249, 1)';
    }

    async isClearFilterDisabled() {
        return this.getDisabledClearFilterButton().isDisplayed();
    }

    async isFilterContentOverlapsWithFooter() {
        //total height of the filter panel - height of filter header - height of footer >= height of content
        const wrapperHeight = await this.getFilterPanelWrapperHeight();
        const contentHeight = await this.getFilterPanelContentHeight();
        const headerHeight = await this.getFilterPanelHeaderHeight();
        const footerHeight = await this.getFilterPanelFooterHeight();
        return wrapperHeight - headerHeight - footerHeight >= contentHeight;
    }

    async isFilterItemLocked(name) {
        return (await this.getLockedFilterItemByName(name)).isExisting();
    }

    async isWarningMessagePresent(name) {
        return this.getWarningMessage(name).isDisplayed();
    }

    async warningMessageText(name) {
        return this.getWarningMessage(name).getText();
    }

    async isGlobalFilterIconExist(name, index = 0) {
        await this.waitForElementVisible(this.getFilterItemContainerByName(name, index));
        return this.getGlobalFilterIcon(name, index).isDisplayed();
    }

    async hoverFilterByName(name) {
        await this.hover({ elem: this.getFilterItemContainerByName(name) });
    }

    async getTooltipText() {
        await this.waitForElementVisible(this.getTooltip());
        return this.getTooltip().getText();
    }

    async clickFilterByName(name) {
        return this.getFilterPanelByName(name).click();
    }

    async isAttrFilterDetailsPanelLocked(name) {
        return this.getLockedAttrFilterDetailsPanel(name).isDisplayed();
    }

    async isVizFilterDetailsPanelLocked(name) {
        return this.getLockedVizFilterDetailsPanel(name).isDisplayed();
    }

    async isCalFilterDetailsPanelLocked(name) {
        return this.getLockedCalFilterDetailsPanel(name).isDisplayed();
    }

    async clickViewSelected() {
        return this.getViewSelected().click();
    }

    async isResetAllFiltersButtonPresent() {
        return this.getResetAllFiltersButton().isDisplayed();
    }

    async isResetAllFiltersButtonDisabled() {
        const name = await getAttributeValue(this.getResetAllFiltersButton(), 'className');
        return name.includes('inactive');
    }

    async getFilterDisabledMessageText() {
        return this.getFilterDisabledMessage().getText();
    }

    async isFilterIconDisabled() {
        return this.getFilterIcon().getAttribute('aria-disabled');
    }

    async isFilterDisplayedInFilterPanel(name) {
        return this.getFilterPanelByName(name).isDisplayed();
    }

    async isFilterInfoIconDisplayed(name) {
        await scrollIntoView(this.getFilterPanelByName(name));
        return this.getInfoIcon(name).isDisplayed();
    }

    async getDescriptionTooltipText(name) {
        await scrollIntoView(this.getFilterPanelByName(name));
        const filterTitle = this.$('.mstrd-DropdownMenu-headerTitle');
        await this.hover({ elem: filterTitle });
        await this.waitForElementInvisible(this.getTooltip());
        await this.hover({ elem: this.getInfoIcon(name) });
        const value = await this.getTooltipText();
        return this.getTooltipText();
    }

    async clickAddFilterButton() {
        await this.click({ elem: this.getAddFilterButton() });
        await this.waitForElementVisible(this.getAddFilterContent(), {
            timeout: 5000,
            msg: 'Add Filter content is not open.',
        });
    }
    

    async clickAttributeInAddFilter(attrName) {
        await this.click({ elem: this.getAddFilterItemLabel(attrName) });
        await this.waitForElementClickable(this.getButtonInAddFilterContent('Add'), {
            timeout: 2000,
            msg: 'Add button is not clickable.',
        });
    }

    async isAttributeDisplayedInAddFilter(attrName) {
        return this.getAddFilterItemLabel(attrName).isDisplayed();
    }

    async clickAddOrCancelButtonInAddFilter(btnName) {
        await this.click({ elem: this.getButtonInAddFilterContent(btnName) });
    }

    async filterItemText() {
        const items = await this.getAddFilterMenu().$$('.mstrd-Checkbox');
        const texts = [];
        for (const item of items) {
            const text = await item.getText();
            texts.push(text.trim());
        }
        return texts;
    }

    async switchToFilterPanel() {
        if (!(await this.getFilterPanel().isDisplayed())) {
            await this.click({ elem: this.getFilterPanelHeader() });
            await this.waitForElementVisible(this.getFilterPanel());
        }
    }

    async isFilterPanelEmpty() {
        return (await this.getEmptyFilter()).isDisplayed();
    }

    async hoverFilterPanelIcon() {
        await this.hover({ elem: this.getFilterIcon() });
    }
}
