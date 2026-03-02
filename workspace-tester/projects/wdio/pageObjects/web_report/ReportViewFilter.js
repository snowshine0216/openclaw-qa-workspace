import BasePage from '../base/BasePage.js';
import BaseDialog from '../base/BaseDialog.js';
import ReportToolbar from './ReportToolbar.js';

export default class ReportViewFilter extends BasePage {
    constructor() {
        super('#vfep_pane', 'Report View Filter component');
        this.reportToolbar = new ReportToolbar();
        this.baseDialog = new BaseDialog();
    }

    // Locator
    getViewFilterContainer() {
        return this.$('#vfep_pane');
    }

    getFilterItem(item) {
        return this.$$('#vfe_pane_area tr').filter(async (elem) => {
            const text = await elem.$('.mstr-filter-object-name').getText();
            return text === item;
        })[0];
    }

    async getFilterRemoveButton(item) {
        const filter = await this.getFilterItem(item);
        return filter.$('input[title="Remove condition"]');
    }

    async getFilterShiftDownButton(item, orientation) {
        const filter = await this.getFilterItem(item);
        if (orientation === 'Down') {
            return filter.$('.mstrIconShiftDown');
        }

        return filter.$('.mstrIconShiftUp');
    }

    getApplyGroupButtonByIndex(index) {
        return this.locator.$$('.mstrIconShiftRight')[index - 1];
    }

    getCancelGroupButtonByIndex(index) {
        return this.locator.$$('.mstrIconShiftLeft')[index - 1];
    }

    getConditionDataTypeDropDown() {
        return this.locator.$('#formIDDatatypeNameCombo_vfb');
    }

    getConditionDataType(optionName) {
        return this.getConditionDataTypeDropDown().all(by.cssContainingText('option', optionName))[0];
    }

    getConditionFunctionTypeDropDown() {
        return this.$('#functionAndFunctionTypeCombo');
    }

    getConditionFunctionType(optionName) {
        return this.getConditionFunctionTypeDropDown()
            .$$('option')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === optionName;
            })[0];
    }

    getPanelTitleOptions() {
        return this.locator.$('.mstrPanelTitleOptions');
    }

    getAddConditionButton() {
        return this.getPanelTitleOptions().element(by.cssContainingText('a', 'Add Condition'));
    }

    getClearAllButton() {
        return this.getPanelTitleOptions().element(by.cssContainingText('span', 'Clear All'));
    }

    getAutoApplyButton() {
        return this.getPanelTitleOptions().element(by.cssContainingText('span', 'Auto-Apply changes'));
    }

    getFilterObjectSelection() {
        return this.locator.$('#objectIDTypeNameCombo');
    }

    getFilterObjectSelectionOption(optionName) {
        return this.getFilterObjectSelection().element(by.cssContainingText('option', optionName));
    }

    getFilterActionTypeRadio(typeName) {
        return this.locator.element(by.cssContainingText('.mstrFilterActionType', typeName)).$('input');
    }

    getQualifyValueInput() {
        return this.locator.$('#constantValue');
    }

    getApplyButton() {
        return this.locator.$('#acceptButton');
    }

    getApplyChangesButton() {
        return this.locator.$('#mstrForm input[value="Apply"]');
    }

    getCartAvailableList() {
        return this.locator.$('.mstrCartAvailable select');
    }

    getCartAvailableListOptions() {
        return this.getCartAvailableList().all(by.css('option'));
    }

    getAvailableOption(optionName) {
        return this.getCartAvailableList().element(by.cssContainingText('option', optionName));
    }

    getSelectedList() {
        return this.locator.$('.mstrCartSelected select');
    }

    getSelectedListOptions() {
        return this.getSelectedList().all(by.css('option'));
    }

    getSelectedOption(optionName) {
        return this.getSelectedList().element(by.cssContainingText('option', optionName));
    }

    getAddSelectionButton() {
        return this.locator.$('.mstrCartButtons [title="Add to selections"]');
    }

    getRemoveSelectionButton() {
        return this.locator.$('.mstrCartButtons [title="Remove from selections"]');
    }

    getAddAllSelectionButton() {
        return this.locator.$('.mstrCartButtons [title="Add all elements to selections"]');
    }

    getRemoveAllSelectionButton() {
        return this.locator.$('.mstrCartButtons [title="Remove all elements from selections"]');
    }

    getSelectSearchDiv() {
        return this.locator.$('.mstrSearchDiv input[name="namePattern"]');
    }

    getFilterCalendarIcon() {
        return this.locator.$('#calendar_button');
    }

    getFilterCalendarDay(day) {
        return this.$('#CalendarTable').element(by.cssContainingText('.day', day));
    }

    getPanelCloseButton() {
        return this.locator.$('.mstrPanelTitleButtonBar img[title="Close"]');
    }

    // Action helper

    async openFilterEditPanel(item) {
        const filter = await this.getFilterItem(item);
        await this.click({ elem: filter.$('.mstr-filter-text-editable') });
    }

    async applyFilter() {
        await this.click({ elem: this.$('#vfep_pane').$('input[value="Apply"]') });
    }

    async removeFilter(item) {
        await this.click({ elem: await this.getFilterRemoveButton(item) });
    }

    async addCondition() {
        await this.click({ elem: this.getAddConditionButton() });
    }

    async selectFilterOption(optionName) {
        await this.click({ elem: this.getFilterObjectSelection() });
        await this.click({ elem: this.getFilterObjectSelectionOption(optionName) });
    }

    async selectFilterActionType(typeName) {
        await this.click({ elem: this.getFilterActionTypeRadio(typeName) });
    }

    async selectConditionDataType(optionName) {
        await this.click({ elem: this.getConditionDataTypeDropDown() });
        await this.click({ elem: this.getConditionDataType(optionName) });
    }

    async selectConditionFunctionType(optionName) {
        await this.click({ elem: this.getConditionFunctionTypeDropDown() });
        await this.waitForElementVisible(this.getConditionFunctionType(optionName));
        // await this.click({ elem: this.getConditionFunctionType(optionName) });
        await this.getConditionFunctionType(optionName).click();
        await this.waitForCurtainDisappear();
    }

    async inputValueForQualify(value) {
        await this.clear({ elem: this.getQualifyValueInput() });
        await this.getQualifyValueInput().setValue(value);
    }

    async applyCondition() {
        await this.click({ elem: this.getApplyButton() });
    }

    async clearAllFilter() {
        if (await this.isClearAllBtnPresent()) {
            await this.click({ elem: this.getClearAllButton() });
        }
    }

    async clearAllFilterAndSave() {
        if (await this.isClearAllBtnPresent()) {
            await this.click({ elem: this.getClearAllButton() });
            await this.reportToolbar.clickButton('Save');
            await this.baseDialog.apply();
        }
    }

    async selectAvailableOption(optionName) {
        await this.click({ elem: this.getAvailableOption(optionName) });
        await this.click({ elem: this.getAddSelectionButton() });
    }

    async removeSelectedOption(optionName) {
        await this.click({ elem: this.getSelectedOption(optionName) });
        await this.click({ elem: this.getRemoveSelectionButton() });
    }

    async inputSearchText(text) {
        await this.clear({ elem: this.getSelectSearchDiv() });
        await this.getSelectSearchDiv().setValue(text);
        await this.enter();
        await this.waitForCurtainDisappear();
    }

    async getAvailableOptionText() {
        return this.getCartAvailableListOptions().getText();
    }

    async getSelectOptionText() {
        return this.getSelectedListOptions().getText();
    }

    async multiSelectAvailableOptions(options) {
        for (let i = 0; i < options.length; i++) {
            const option = this.getAvailableOption(options[i]);
            await this.click({ elem: option });
        }
        await this.click({ elem: this.getAddSelectionButton() });
    }

    async multiRemoveSelectedOptions(options) {
        for (let i = 0; i < options.length; i++) {
            await this.click({ elem: this.getSelectedOption(options[i]) });
        }
        await this.click({ elem: this.getRemoveSelectionButton() });
    }

    async addAllSelections() {
        await this.click({ elem: this.getAddAllSelectionButton() });
    }

    async removeAllSelections() {
        await this.click({ elem: this.getRemoveAllSelectionButton() });
    }

    async clickAutoApplyButton() {
        await this.click({ elem: this.getAutoApplyButton() });
    }

    async clickApplyChangesButton() {
        await this.click({ elem: this.getApplyChangesButton() });
    }

    async shiftFilter(filterName, orientation) {
        await this.click({ elem: await this.getFilterShiftDownButton(filterName, orientation) });
    }

    async applyGroupByIndex(index) {
        await this.click({ elem: this.getApplyGroupButtonByIndex(index) });
    }

    async cancelGroupByIndex(index) {
        await this.click({ elem: this.getCancelGroupButtonByIndex(index) });
    }

    async openCalendarTable() {
        await this.click({ elem: this.getFilterCalendarIcon() });
    }

    async SelectDayInCalendar(day) {
        await this.openCalendarTable();
        await this.click({ elem: this.getFilterCalendarDay(day) });
    }

    async closeViewFilterPanel() {
        await this.click({ elem: this.getPanelCloseButton() });
    }

    // Assertion helper

    isViewFilterContainerDisplayed() {
        return this.locator.isDisplayed();
    }

    getFilterActionCount() {
        return this.locator.$$('.mstrFilterActionType').length;
    }

    isClearAllBtnPresent() {
        return this.getClearAllButton().isDisplayed();
    }
}
