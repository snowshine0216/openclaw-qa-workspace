import BaseFilter from '../base/BaseFilter.js';

export default class DynamicFilter extends BaseFilter {
    // Element locator

    getHierarchyEleByName(name) {
        return this.$$('.mstrd-HierarchyCheckbox').filter(async (elem) => {
            const text = await elem.$('.mstrd-Checkbox-label').getText();
            return text === name;
        })[0];
    }

    getExpandButton(name) {
        return this.getHierarchyEleByName(name).$('.icon-plus');
    }

    getCollapseButton(name) {
        return this.getHierarchyEleByName(name).$('.icon-minus');
    }

    getBranchSelectionButton(name) {
        return this.getHierarchyEleByName(name).$('.mstrd-Checkbox-shape.icon-checkmark');
    }

    getSingleSelectionButton(name) {
        return this.getHierarchyEleByName(name).$('.icon-select');
    }

    getSingleDeselectionButton(name) {
        return this.getHierarchyEleByName(name).$('.icon-deselect');
    }

    getLevelInBranchButton(name) {
        return this.getHierarchyEleByName(name).$('.mstrd-LevelSelectionContextMenu-arrow.icon-checkboxes_f');
    }

    getDynamicStatusIcon(name) {
        return this.getHierarchyEleByName(name).$('.icon-auto');
    }

    getLevelIcon() {
        return this.$('.mstrd-AttrElemDetailsPanel-header').$(
            '.mstrd-LevelSelectionContextMenu-arrow.icon-checkboxes_f'
        );
    }

    getLockedLevelIcon() {
        return this.$('.mstrd-AttrElemDetailsPanel-header').$(
            '.mstrd-LevelSelectionContextMenu-arrow.mstrd-LevelSelectionContextMenu-locked'
        );
    }

    getLevelSelectionDropdown() {
        return this.$('.mstrd-LevelSelectionContextMenu-menu');
    }

    getLevelList() {
        return this.$('.ant-popover-content').$$('.mstrd-LevelSelectionItem');
    }

    getLevelByName(name) {
        return this.findOne(this.getLevelList(), async (elem) => {
            let text = await elem.getText();
            if (this.isSafari()) {
                // when run in safari, the getText() will return name+'only', which
                // is the text including all its children's string, we just need the string
                // on body
                const body = elem.$('.mstrd-Checkbox-body');
                text = await body.getAttribute('aria-label');
            }
            return text === name;
        });
    }

    getLevelCheckboxByName(name) {
        return this.getLevelSelectionDropdown()
            .$$('.mstrd-Checkbox-main')
            .filter(async (elem) => {
                const text = await elem.getText();
                return text === name;
            })[0];
    }

    getLoadingResults() {
        return this.$$('.mstrd-FilterItemsList-warn-msg').filter(async (elem) => {
            const text = await elem.getText();
            return text === 'Loading results...';
        })[0];
    }

    getClearSearchIcon() {
        return this.$('.icon-clearsearch.mstrd-FilterSearchBox-manual-search');
    }

    getCurrentSearchLevel() {
        return this.$('.mstrd-AttrElemDetailsPanel-LevelSearchBox').$('.rw-input');
    }

    getLockedSecondaryPanel() {
        return this.$('.mstrd-AttrElemDetailsPanel-locked');
    }

    getFilterSearchBox() {
        return this.$('.mstrd-FilterSearchBox-search-box');
    }

    getHierarchyCheckboxSpinner() {
        return this.$('.mstrd-Spinner.mstrd-HierarchyCheckbox-expandSpin');
    }

    getNthSearchLevel(n) {
        return this.$$('.rw-list-option')[n];
    }

    // Action helper
    async expandElement(name) {
        await this.click({ elem: this.getExpandButton(name) });
        await this.waitForElementInvisible(this.getHierarchyCheckboxSpinner(), {
            timeout: 10000,
            msg: 'Loading spinner does not disappear.',
        });
        await this.waitForElementVisible(this.getCollapseButton(name), {
            timeout: 10000,
            msg: 'Element has not been expanded.',
        });
    }

    async collapseElement(name) {
        await this.click({ elem: this.getCollapseButton(name) });
        await this.waitForElementVisible(this.getExpandButton(name), {
            timeout: 10000,
            msg: 'Element has not been collapsed.',
        });
    }

    async clickBranchSelectionButton(name) {
        await this.click({ elem: this.getBranchSelectionButton(name) });
        return this.sleep(1000); // this action can be either select or deselect, so use static wait
    }

    async hoverOnHierarchyElement(name) {
        await this.hover({ elem: this.getHierarchyEleByName(name) });
        return this.sleep(1000);
    }

    async singleSelectElement(name) {
        await this.hoverOnHierarchyElement(name);
        await this.click({ elem: this.getSingleSelectionButton(name) });
        return this.waitForElementInvisible(this.getSingleSelectionButton(name), {
            timeout: 5000,
            msg: 'Single selection does not work.',
        });
    }

    async singleDeselectElement(name) {
        await this.hoverOnHierarchyElement(name);
        await this.click({ elem: this.getSingleDeselectionButton(name) });
        return this.waitForElementInvisible(this.getSingleDeselectionButton(name), {
            timeout: 5000,
            msg: 'Single deselection does not work.',
        });
    }

    async clickLevelIcon() {
        // this method can either open level panel or close level panel
        await this.click({ elem: this.getLevelIcon() });
        return this.sleep(1000);
    }

    async isLevelSelected(name) {
        const checked = await this.getLevelCheckboxByName(name).getAttribute('aria-checked');
        return checked === 'true';
    }

    async selectLevelByName(name) {
        const isSelected = await this.isLevelSelected(name);
        if (!isSelected) {
            await this.click({ elem: this.getLevelCheckboxByName(name) });
        }
    }

    async clearLevelByName(name) {
        const isSelected = await this.isLevelSelected(name);
        if (isSelected) {
            await this.click({ elem: this.getLevelCheckboxByName(name) });
        }
    }

    async clickLevelInBranchButton(name) {
        // this method can either open level in branch panel or close it
        await this.hoverOnHierarchyElement(name);
        await this.click({ elem: this.getLevelInBranchButton(name) });
        return this.sleep(1000);
    }

    async closeLevelInBranchContextMenu(name) {
        await this.hoverOnHierarchyElement(name);
        const isLevelInBranchContectMenuPresent = await this.$('.mstrd-LevelSelectionContextMenu-menu').isDisplayed();
        if (isLevelInBranchContectMenuPresent) {
            await this.click({ elem: this.getLevelInBranchButton(name) });
            await this.waitForElementInvisible(this.getLevelSelectionDropdown(), {
                timeout: 5000,
                msg: 'Level in branch context menu does not close.',
            });
        }
        return this.sleep(1000);
    }

    async selectAll() {
        return this.filterElement.selectAll();
    }

    async clearAll() {
        return this.filterElement.clearAll();
    }

    async inputSearch(text) {
        await this.$('.mstrd-FilterSearchBox-search-box').setValue(text);
        return this.sleep(500);
    }

    async searchByClick(text) {
        await this.inputSearch(text);
        await this.$('.icon-searchfilter').click();
        await this.waitForElementStaleness(this.getLoadingResults(), {
            timeout: 10000,
            msg: 'Results loading takes too long.',
        });
    }

    async searchByEnter(text) {
        await this.inputSearch(text);
        await this.enter();
        await this.waitForElementStaleness(this.getLoadingResults(), {
            timeout: 10000,
            msg: 'Results loading takes too long.',
        });
    }

    async clearSearch() {
        await this.click({ elem: this.getClearSearchIcon() });
        await this.waitForElementInvisible(this.getClearSearchIcon(), {
            timeout: 5000,
            msg: 'Clearing search takes too long.',
        });
    }

    async selectNthSearchLevel(n) {
        await this.click({ elem: this.getCurrentSearchLevel() });
        await this.click({ elem: this.getNthSearchLevel(n) });
        return this.sleep(500);
    }

    async expandFullScreen() {
        await this.$('.mstrd-FilterFullScreen-icon.icon-expand').click();
        return this.sleep(500);
    }

    async contractFullScreen() {
        await this.$('.mstrd-FilterFullScreen-icon.icon-contract').click();
        return this.sleep(500);
    }

    // Assertion helper

    async isDynamic(name) {
        return this.getDynamicStatusIcon(name).isDisplayed();
    }

    async isSelected(name) {
        await this.hoverOnHierarchyElement(name);
        return this.getHierarchyEleByName(name).$('.icon-deselect').isDisplayed();
    }

    async searchResultCount() {
        return this.$$('.mstrd-HierarchyCheckbox').length;
    }

    async selectedResultCount() {
        return this.$$('.icon-deselect').length;
    }

    async isExpanded(name) {
        return this.getCollapseButton(name).isDisplayed();
    }

    async isCollapsed(name) {
        return this.getExpandButton(name).isDisplayed();
    }

    async currentSearchLevel() {
        return this.getCurrentSearchLevel().getText();
    }

    async isCapsuleExcluded(filterName, capsuleName) {
        return this.filterCapsule.isCapsuleExcluded(this.getFilterContainer(filterName), capsuleName);
    }

    async capsuleCount(filterName) {
        return this.filterCapsule.capsuleCount(this.getFilterContainer(filterName));
    }

    async capsuleName(filterName, index) {
        return this.filterCapsule.capsuleName(this.getFilterContainer(filterName), index);
    }

    async isSecondaryPanelLocked() {
        return this.getLockedSecondaryPanel().isDisplayed();
    }

    async isLevelSelectIconLocked() {
        return this.getLockedLevelIcon().isDisplayed();
    }

    async isBranchSelectionButtonDisabled(name) {
        return this.getHierarchyEleByName(name).$('.mstrd-HierarchyCheckbox-content--disabled').isDisplayed();
    }

    async isLevelInBranchButtonPresent(name) {
        return this.getLevelInBranchButton(name).isDisplayed();
    }
}
