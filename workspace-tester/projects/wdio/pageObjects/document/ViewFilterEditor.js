import BasePage from '../base/BasePage.js';

/* View filter editor  */
export default class ViewFilterEditor extends BasePage {
    constructor() {
        super('.mstrmojo-Editor.mstrmojo-charcoalboxe.mstrmojo-FE.modal', 'View filter editor');
    }

    getViewFilter() {
        return this.$('.mstrmojo-Editor.mstrmojo-charcoalboxe.mstrmojo-FE.modal');
    }

    // Element locaters

    getAddConditionButton() {
        return this.getViewFilter()
            .$$('.mstrmojo-Button')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return this.escapeRegExp(elemText) === this.escapeRegExp('Add Condition');
            })[0];
    }

    getConditionContent() {
        return this.getViewFilter().$('.walk');
    }

    getApplyToolbar() {
        return this.getViewFilter().$('.apply');
    }

    getInputBox() {
        return this.getConditionContent().$$('.mstrmojo-TextBox')[0];
    }

    getApplyButton() {
        return this.getApplyToolbar().$('.mstrmojo-Button.okBtn');
    }

    getCancelConditionButton() {
        return this.getApplyToolbar().$('mstrmojo-Button.cancelBtn');
    }

    getSaveButton() {
        return this.getViewFilter()
            .$$('.mstrmojo-HBox.mstrmojo-Editor-buttonBar .mstrmojo-Button-text')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return this.escapeRegExp(elemText) === this.escapeRegExp('Save');
            })[0];
    }

    getCancelViewFilterButton() {
        return this.locator.element(
            by.cssContainingText(
                '.mstrmojo-HBox.mstrmojo-Editor-buttonBar .mstrmojo-Button-text',
                new RegExp('^Cancel$')
            )
        );
    }

    getAllConditionTextSet() {
        return this.locator.$$('.mstrmojo-textset.mstrmojo-cond-text, .mstrmojo-dynamicNode-info');
    }

    getConditionTextSet(conditionName) {
        return this.findOne(this.getAllConditionTextSet(), async (elem) => {
            const text = await elem.$('.mstrmojo-attr, .mstrmojo-metric, .mstrmojo-textset').getText();
            return text === conditionName;
        });
    }

    getNthConditionPrefix(index) {
        return this.locator
            .$$('.mstrmojo-cond-prefix,.mstrmojo-andor-prefix')
            .filter((element) => element.isDisplayed())[index - 1];
    }

    getNthGroupOperator(index) {
        return this.getNthConditionPrefix(index).$('.mstrmojo-cond-prefix-text,.mstrmojo-andor-prefix-text');
    }

    getNthGroupIndent(index) {
        return this.getNthConditionPrefix(index).$('.mstrmojo-indent');
    }

    getNthGroupOutdent(index) {
        return this.getNthConditionPrefix(index).$('.mstrmojo-outdent');
    }

    getGroupSelector() {
        return this.locator.$$('.mstrmojo-Editor-content').filter((element) => element.isDisplayed())[0];
    }

    getGroupSelectorOption(option) {
        return this.getGroupSelector().element(by.cssContainingText('.mstrmojo-itemwrap', option));
    }

    getCreateSetButton() {
        return this.locator.$$('.mstrmojo-create-set-text').filter((element) => element.isDisplayed())[0];
    }

    getConditionRemoveButton() {
        return this.locator.$$('.mstrmojo-del').filter((element) => element.isDisplayed())[0];
    }

    getSetItemInCreateSetPanel(item) {
        return this.locator
            .$('.CreateSet-Editor.modal .scroll-container.mstrmojo-scrollNode')
            .element(by.cssContainingText('.item', item));
    }

    getRelatedByDropDown() {
        return this.locator.$('.CreateSet-Editor.modal .mstrmojo-ui-Pulldown');
    }

    getRelatedByDropDownItem(item) {
        return this.getRelatedByDropDown().element(by.cssContainingText('.item', item));
    }

    getOKButtonInCreateSetPanel() {
        return this.locator.$$('.CreateSet-Editor.modal .mstrmojo-WebButton')[0];
    }

    getConditionSwitchButton() {
        return this.locator.$('.mstrmojo-StatusButton.mstrmojo-FE-addCondition .menuButton');
    }

    getConditionTypeButton(buttonText) {
        return this.locator
            .$('.mstrmojo-StatusButton.mstrmojo-FE-addCondition .mstrmojo-ui-Menu')
            .element(by.cssContainingText('.item', buttonText));
    }

    getRenameButtonInDynamicCondition() {
        return this.locator.$$('.mstrmojo-textset.mstrmojo-rename-text').filter((element) => element.isDisplayed())[0];
    }

    getBrowseElementsButton() {
        return this.locator
            .$$('.mstrmojo-Label.mstrmojo-walkstep-browse')
            .filter((element) => element.isDisplayed())[0];
    }

    getBrowseElementsPopup() {
        return this.$('.mstrmojo-ElementsEditor.modal');
    }

    getBrowseElementSearchInput() {
        return this.getBrowseElementsPopup().$('.mstrmojo-SearchBox-input');
    }

    getBrowseElementSearchedItems(item) {
        return this.getBrowseElementsPopup().all(by.cssContainingText('.mstrmojo-itemwrap', item))[0];
    }

    getBrowseElementConfirmButton() {
        return this.getBrowseElementsPopup().element(by.cssContainingText('.mstrmojo-Button', 'OK'));
    }

    // Action Helper

    /**
     * Find the condition by cell text
     * @param {string} cellText The cell text
     * @returns {ElementFinder} The cell
     */
    findCondition(cellText) {
        // return this.locator.element(by.cssContainingText('.walk .item', new RegExp(`^${cellText}$`)));
        return this.getViewFilter()
            .$$('.walk .item')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === cellText;
            })[0];
    }

    /**
     * add new condition
     */
    async addNewCondition() {
        await this.click({ elem: this.getAddConditionButton() });
    }

    async switchConditionCreateType(buttonText) {
        await this.click({ elem: this.getConditionSwitchButton() });
        await this.click({ elem: this.getConditionTypeButton(buttonText) });
    }

    /**
     * select condition by path.
     * @param {string[]} conditionPaths The condition path
     */
    async addCondition(conditionPaths) {
        // await this.waitForElementVisible(this.getViewFilter());
        await this.addNewCondition();
        for (const conditionItem of conditionPaths) {
            await this.sleep(1000);
            const el = this.findCondition(conditionItem);
            await this.click({ elem: el });
        }
    }

    async editCurrentCondition(conditionPaths) {
        for (const conditionItem of conditionPaths) {
            const el = this.findCondition(conditionItem);
            await this.click({ elem: el });
        }
    }

    /**
     * apply condition
     */
    async applyCondition() {
        await this.click({ elem: this.getApplyButton() });
    }

    // cancel condition
    async cancelCondition() {
        await this.click({ elem: this.getCancelConditionButton() });
    }

    /**
     * input condition value
     * @param {string} value The condition value input
     */
    async inputValue(value) {
        await this.waitForElementVisible(this.getInputBox());
        await this.clear({ elem: this.getInputBox() });
        await this.getInputBox().setValue(value);
    }

    async saveViewFilter() {
        await this.click({ elem: this.getSaveButton() });
    }

    async cancelViewFilter() {
        await this.click({ elem: this.getCancelViewFilterButton() });
    }

    async openConditon(conditionName) {
        const condition = await this.getConditionTextSet(conditionName);
        await this.click({ elem: condition });
    }

    async removeCondition(condition) {
        await this.hover({ elem: await this.getConditionTextSet(condition) });
        await this.click({ elem: await this.getConditionRemoveButton() });
    }

    async removeAllConditions() {
        const total = await this.getAllConditionTextSet().length;
        if (total > 0) {
            for (const el of await this.getAllConditionTextSet()) {
                await this.hover({ elem: el });
                await this.click({ elem: await this.getConditionRemoveButton() });
            }
        }
    }

    async switchNthGroupOperator(index) {
        await this.hover({ elem: await this.getNthGroupOperator(index) });
        await this.click({ elem: await this.getNthGroupIndent(index) });
    }

    async selectNthGroupOperator(index, option) {
        await this.click({ elem: await this.getNthGroupOperator(index) });
        await this.click({ elem: await this.getGroupSelectorOption(option) });
    }

    async openConditionCreateSetPanel(condition) {
        await this.hover({ elem: await this.getConditionTextSet(condition) });
        await this.click({ elem: await this.getCreateSetButton() });
    }

    async selectItemInCreateSetPanel(items) {
        for (const item of items) {
            await this.click({ elem: this.getSetItemInCreateSetPanel(item) });
        }
        await this.click({ elem: this.getOKButtonInCreateSetPanel() });
    }

    async selectRelatedByItem(item) {
        await this.click({ elem: this.getRelatedByDropDown() });
        await this.click({ elem: this.getRelatedByDropDownItem(item) });
    }

    async renameDynamicCondition(originName, newName) {
        await this.hover({ elem: await this.getConditionTextSet(originName) });
        await this.click({ elem: this.getRenameButtonInDynamicCondition() });
        await browser.actions().setValue(newName).perform();
    }

    /**
     * Browse element in attribute filter
     * @param searchText the text you input in browse elements popup
     * @param selectItems searched elements, which would be all selected
     */
    async searchAndSelectElements(searchText, selectItems) {
        await this.click({ elem: this.getBrowseElementsButton() });
        await this.getBrowseElementSearchInput().setValue(searchText);
        await this.click({ elem: this.getBrowseElementSearchInput() });
        await this.enter();
        for (const item of selectItems) {
            await this.click({ elem: this.getBrowseElementSearchedItems(item) });
        }
        await this.click({ elem: this.getBrowseElementConfirmButton() });
    }

    // Assertion helper

    /**
     * Get current condition in editor
     * @returns {Number} the number of conditions
     */
    async getConditionCount() {
        return this.getAllConditionTextSet().length;
    }

    async isConditionItemPresent(item) {
        return this.findCondition(item).isDisplayed();
    }

    /**
     * Whether is the Nth Group Operator set grouped
     * @param index of group operator
     * @returns {Boolean} is the Nth Group Operator set grouped
     */
    async isNthOperatorGrouped(index) {
        await this.hover({ elem: await this.getNthGroupOperator(index) });
        return this.getNthGroupOutdent(index).isDisplayed();
    }
}
