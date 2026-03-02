import BaseSearch from '../search/BaseSearch.js';
import { multiElements } from '../../utils/index.js';

export default class FilterOnSearch extends BaseSearch {
    constructor() {
        super();
    }

    // Element locator

    getSearchFilterNavItem() {
        return this.$('.mstrd-SearchFilterNavItemContainer');
    }

    getSearchFilterNavIcon() {
        return this.getSearchFilterNavItem().$('.icon-tb_filter_n,.icon-tb_filter_a');
    }

    getSearchFilterDropdownPanel() {
        return this.$('.mstrd-DropdownMenu-main,.mstrd-SearchFilterMenuItemContainer');
    }

    getFilterApplyBtn() {
        return this.getSearchFilterDropdownPanel().$('.mstrd-BaseFilterPanel-applyBtn');
    }

    getFilterClearBtn() {
        return this.getSearchFilterDropdownPanel().$('.mstrd-BaseFilterPanel-clearBtn');
    }

    getSearchFilterItems() {
        return this.getSearchFilterDropdownPanel().$$('.mstrd-BaseFilterItem');
    }
    // ----------------------
    getSearchFilterItem(type) {
        const typeRegExp = multiElements(type);
        return this.getSearchFilterDropdownPanel()
            .$$('.mstrd-BaseFilterItem-title')
            .filter(async (elem) => {
                const filterTitle = await elem.getText();
                return typeRegExp.test(filterTitle);
            })[0];
    }

    getFilterSummaryTexts(type) {
        return this.getParent(this.getSearchFilterItem(type)).$$('.ant-tag');
    }

    // ----------------------
    getFilterSummaryItem(type, item) {
        return this.getFilterSummaryTexts(type).filter(async (elem) => {
            const text = await elem.getText();
            return text.includes(item);
        })[0];
    }

    getFilterSummaryItemDeleteBtn(type, item) {
        return this.getFilterSummaryItem(type, item).$('.anticon.anticon-close');
    }

    getCertifyOnlySwitchBtn() {
        return this.getSearchFilterDropdownPanel().$('.mstrd-Switch');
    }

    getFilterDetailsPanel() {
        return this.$('.mstrd-BaseFilterDetailPanel');
    }

    getFilterDetailPanelCheckbox() {
        return this.getFilterDetailsPanel().$('.mstrd-FilterDetailPanelCheckbox');
    }

    // ----------------------
    getOptionInCheckboxDetailPanel(name) {
        return this.getFilterDetailPanelCheckbox()
            .$$('.mstrd-Checkbox-label')
            .filter(async (elem) => {
                return name === (await elem.getText());
            })[0];
    }

    getOptionsInCheckboxDetailPanel() {
        return this.getFilterDetailPanelCheckbox().$$('.mstrd-Checkbox-label');
    }

    getCheckboxOptionItems() {
        return this.getFilterDetailPanelCheckbox().$$('.mstrd-Checkbox-label');
    }

    getCheckboxFooter() {
        return this.getFilterDetailPanelCheckbox().$('.mstrd-FilterDetailPanelCheckbox-footer');
    }

    getCheckboxFooterBtns() {
        return this.getCheckboxFooter().$$('.mstrd-Button.mstrd-Button--clear');
    }

    getCheckboxOnlyBtn(name) {
        return this.getOptionInCheckboxDetailPanel(name).$('../..').$('.mstrd-Checkbox-keepOnly');
    }

    getFilterPanelCloseBtn() {
        return this.getSearchFilterDropdownPanel().$('.mstrd-DropdownMenu-headerIcon.icon-pnl_close');
    }

    getFilterSearchBox() {
        return this.getFilterDetailPanelCheckbox().$('.ant-input');
    }

    getClearBtnOnSearch() {
        return this.getFilterDetailPanelCheckbox().$('.ant-input-suffix .icon-clearsearch');
    }

    getViewSelectedBtn() {
        return this.getFilterDetailPanelCheckbox().$('.mstrd-Switch');
    }

    getCalendarFilterSummary() {
        const lastUpdatedString = [
            'Last Updated',
            'Laatst bijgewerkt',
            'Senest opdateret',
            'Zuletzt aktualisiert',
            'Dernière mise à jour',
            '마지막 업데이트',
            'Senast uppdaterad',
            'Ultimo aggiornamento',
            'Última actualización',
            '最終更新',
            'Última atualização',
            '上次更新',
            '上次更新',
            'Ostatnia aktualizacja',
            'Last Updated',
        ];
        return this.getFilterSummaryTexts(lastUpdatedString)[0].getText();
    }

    getBackInMobleView() {
        return this.$('.mstrd-MobileSliderOptionRow-menuOption--hasBackAction .mstrd-MobileSliderOptionRow-backArrow');
    }

    getFilterPanelInMobileView() {
        return this.$('.mstr-nav-icon.icon-tb_filter_n');
    }

    getApplyBtnInMobileView() {
        return this.$('.mstrd-BaseFilterPanel-applyTxt');
    }

    getApplyCount() {
        return this.$('.mstrd-SearchFilterNavItemContainer-applyCount');
    }

    // Action  helper

    async openSearchFilterPanel() {
        await this.click({ elem: this.getSearchFilterNavIcon() });
    }

    async openFilterInMobileView() {
        await this.click({ elem: this.getFilterPanelInMobileView() });
        return this.waitForElementVisible(this.getSearchFilterDropdownPanel());
    }

    async openFilterDetailPanel(type) {
        await this.waitForElementVisible(this.getSearchFilterDropdownPanel());
        await this.click({ elem: this.getSearchFilterItem(type) });
        return this.sleep(1000); // wait filter detail panel to render
    }

    async applyFilterChanged() {
        await this.click({ elem: this.getFilterApplyBtn() });
    }

    async clearAllFilters() {
        await this.click({ elem: this.getFilterClearBtn() });
    }

    async selectOptionInCheckbox(name) {
        await this.click({ elem: this.getOptionInCheckboxDetailPanel(name) });
    }

    async clickCertifiedOnlyBtn() {
        return this.click({ elem: this.getCertifyOnlySwitchBtn() });
    }

    async selectAll() {
        return this.click({ elem: this.getCheckboxFooterBtns()[0] });
    }

    async clearAll() {
        return this.click({ elem: this.getCheckboxFooterBtns()[1] });
    }

    async keepOnly(name) {
        await this.waitForElementVisible(this.getOptionInCheckboxDetailPanel(name));
        await this.hover({ elem: this.getOptionInCheckboxDetailPanel(name) });
        return this.click({ elem: this.getCheckboxOnlyBtn(name) });
    }

    async deleteFilterSummaryItem(type, item) {
        return this.click({ elem: this.getFilterSummaryItemDeleteBtn(type, item) });
    }

    async closeFilterPanel() {
        return this.click({ elem: this.getFilterPanelCloseBtn() });
    }

    async searchOnFilter(text) {
        await this.getFilterSearchBox().setValue(text);
        await this.sleep(1000); // wait search results to render
    }

    async clearSearchBox() {
        await this.click({ elem: this.getClearBtnOnSearch() });
        return this.sleep(500); // wait search reuslts to render
    }

    async toggleViewSelected() {
        await this.click({ elem: this.getViewSelectedBtn() });
        return this.sleep(500); // wait search reuslts to render
    }

    async backInMobileView() {
        await this.click({ elem: this.getBackInMobleView() });
        return this.waitForElementVisible(this.getSearchFilterDropdownPanel());
    }

    async applyInMobileView() {
        await this.click({ elem: this.getApplyBtnInMobileView() });
        return this.waitForElementInvisible(this.getSearchFilterDropdownPanel());
    }

    // Assertion helper
    async isSummaryTextExisted(type, text) {
        const el = await this.getFilterSummaryTexts(type);
        return this.isExisted(text, el, 'text');
    }

    async isFilterPresent(type) {
        return this.getSearchFilterItem(type).isDisplayed();
    }

    async isCerififiedOnlyChecked() {
        return this.isChecked(this.getCertifyOnlySwitchBtn());
    }

    async isViewSelectedChecked() {
        return this.isChecked(this.getViewSelectedBtn());
    }

    async isClearAllDisabled() {
        return this.isDisabled(this.getFilterClearBtn());
    }

    async getCheckboxItemCount() {
        return this.getCheckboxOptionItems().length;
    }

    async isFilterDisabled() {
        return this.isDisabled(this.getSearchFilterNavItem());
    }

    async isWarningDisplayOnApply() {
        const classText = await this.getFilterApplyBtn().getAttribute('class');
        return String(classText).includes('icon-warning');
    }

    async getSearchFilterItemsCount() {
        return this.getSearchFilterItems().length;
    }

    async isFilterSummaryPresent(type) {
        const els = await this.getFilterSummaryTexts(type);
        return els.length > 0;
    }

    async isCheckboxOptionItemsPresent() {
        const els = await this.getCheckboxOptionItems();
        return els.length > 0;
    }

    async getSearchFilterItemsName() {
        return this.getSearchFilterItems().map(async (elem) => {
            return elem.getText();
        });
    }

    async getOptionsInCheckboxDetailPanelName() {
        return this.getOptionsInCheckboxDetailPanel().map(async (elem) => {
            return elem.getText();
        });
    }

    async getFilterCount() {
        return parseInt(await this.getApplyCount().getText());
    }

    async isFilterCountPresent() {
        return this.getApplyCount().isDisplayed();
    }

    async isOptionPresentInCheckboxPanel(name) {
        return this.getOptionInCheckboxDetailPanel(name).isDisplayed();
    }
}
