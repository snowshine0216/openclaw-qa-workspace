import BasePage from './BasePage.js';
import FilterPanel from '../common/FilterPanel.js';
import FilterCapsule from '../common/FilterCapsule.js';
import { getAttributeValue } from '../../utils/getAttributeValue.js';

/**
 * Class representing the base of filter objects
 */
export default class BaseFilter extends BasePage {
    constructor() {
        super();
        this.filterPanel = new FilterPanel();
        this.capsule = new FilterCapsule();
    }

    // Element locator

    getFilterMainPanel() {
        return this.$('.mstrd-FilterPanel');
    }

    getFilterContainers() {
        return this.$$('.mstrd-FilterItemContainer');
    }

    getFilterContainer(name) {
        return this.$$('.mstrd-FilterItemContainer').filter(async (elem) => {
            const text = await elem.$('.mstrd-FilterItemTitle-filterTitle').getText();
            return text === name;
        })[0];
    }

    getSecondaryPanel() {
        return this.$('.mstrd-FilterDetailsPanel');
    }

    getContextMenuDots(name) {
        return this.getFilterContainer(name).$('.mstrd-FilterItemContextMenu-dots.icon-pnl_more-options');
    }

    getContextMenu() {
        return this.$('.mstrd-FilterItemContextMenu-menu');
    }

    getContextMenuOption(menuName) {
        return this.getContextMenu()
            .$$('li')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(menuName);
            })[0];
    }

    getFilterTitle(name) {
        return this.getFilterContainer(name).$('.mstrd-FilterItemTitle-filterTitle');
    }

    getGlobalFilterIcon(name) {
        return this.getFilterContainer(name).$('.mstrd-FilterItemTitle-icon');
    }

    getFilterWarning(name) {
        return this.getFilterContainer(name).$('.mstrd-FilterItemContainer-emptyWarning');
    }

    getFilterDateRangeWarning(name) {
        return this.getFilterContainer(name).$('.mstrd-CalStyleFilterItemContainer-dateRangeWarning');
    }

    getCircularLoopIcon(filterName) {
        return this.getFilterContainer(filterName).$('.mstrd-FilterItemTitle-circularLoop.icon-info');
    }

    getDotIcon(filterName) {
        return this.getFilterContainer(filterName).$('.mstrd-DotLineContainer-dot');
    }

    getMendatoryIconByName(filterName) {
        return this.getFilterContainer(filterName).$('.mstrd-FilterItemTitle-filterMandatoryIcon');
    }

    getErrorTooltip() {
        return this.$('.ant-tooltip-content');
    }

    // Action helper

    async openSecondaryPanel(filterName) {
        await this.waitForElementVisible(this.getFilterContainer(filterName), {
            timeout: 5000,
            msg: filterName + ' in filter panel is not present',
        });
        await this.getFilterTitle(filterName).click();
        await this.waitForElementVisible(this.getSecondaryPanel(), {
            timeout: 5000,
            msg: 'Filter Secondary Panel is not open.',
        });
        return this.sleep(2000);
    }

    async closeSecondaryPanel(filterName) {
        await this.getFilterContainer(filterName).click();
        return this.waitForElementInvisible(this.getSecondaryPanel(), {
            timeout: 5000,
            msg: 'Filter Secondary Panel is not closed.',
        });
    }

    //TODO: add offset in the second .mouseMove() to fix the problem that sometimes context menu arrow doesn't show up; need revisit
    async openContextMenu(filterName) {
        await this.waitForElementVisible(this.getFilterContainer(filterName));
        await this.hover({ elem: this.getFilterContainer(filterName) });
        const isContextMenuArrowPresent = await this.getContextMenuDots(filterName).isDisplayed();
        if (!isContextMenuArrowPresent) {
            await this.waitForElementVisible(this.getContextMenuDots(filterName), {
                timeout: 5000,
                msg: 'Context menu Dots is not displayed',
            });
        }

        await this.sleep(1000); // Wait for animation to complete
        await this.getContextMenuDots(filterName).click();

        const isContextMenuPresent = await this.getContextMenu().isDisplayed();
        if (!isContextMenuPresent) {
            await this.waitForElementVisible(this.getContextMenu(), {
                timeout: 5000,
                msg: 'Context menu is not displayed',
            });
        }

        await this.sleep(2000); // Wait for animation to complete
        return this.filterPanel.waitForGDDE();
    }

    async selectContextMenuOption(filterName, menuName) {
        await this.click({ elem: this.getContextMenuOption(menuName) });
        const className = await getAttributeValue(this.getFilterContainer(filterName), 'className');
        if (className.indexOf('filterSelected') === -1) {
            await this.waitForElementInvisible(this.getContextMenu(), {
                timeout: 5000,
                msg: 'Context Menu is not dismissed.',
            });
        }
        return this.sleep(1000); // Wait for animation to complete
    }

    async hoverOnCircularIcon(filterName) {
        await this.hover({ elem: this.getCircularLoopIcon(filterName) });
        return this.sleep(1000);
    }

    async hoverOnFilterName(filterName) {
        return this.hover({ elem: this.getFilterTitle(filterName) });
    }

    async removeCapsuleByName({ filterName, capsuleName }) {
        return this.capsule.removeCapsuleByName({
            filterElementFinder: this.getFilterContainer(filterName),
            name: capsuleName,
        });
    }

    // Assertion helper
    async isCapsuleExcluded({ filterName, capsuleName }) {
        return this.capsule.isCapsuleExcluded({
            filterElementFinder: this.getFilterContainer(filterName),
            name: capsuleName,
        });
    }

    async isCapsuleHighlighted(filterName, capsuleName) {
        return this.capsule.isCapsuleHighlighted({
            filterElementFinder: this.getFilterContainer(filterName),
            name: capsuleName,
        });
    }

    async capsuleCount(filterName) {
        return this.capsule.capsuleCount(this.getFilterContainer(filterName));
    }

    async filterSelectionInfo(name) {
        return this.getFilterContainer(name).$('.mstrd-FilterItemTitle-filterSelectionInfo').getText();
    }

    async capsuleName(filterName, index = 0) {
        return this.capsule.capsuleName({
            filterElementFinder: this.getFilterContainer(filterName),
            index: index,
        });
    }

    async isCapsulePresent({ filterName, capsuleName }) {
        return this.capsule.isCapsulePresent({
            filterElementFinder: this.getFilterContainer(filterName),
            name: capsuleName,
        });
    }

    async isSecondaryPanelPresent() {
        return this.getSecondaryPanel().isDisplayed();
    }

    async isCircularFilterIconPresent(filterName) {
        return this.getCircularLoopIcon(filterName).isDisplayed();
    }

    async isDotLineHighlighted(filterName) {
        const buttonColor = await this.getDotIcon(filterName).getCSSProperty('color');
        return buttonColor.value === 'rgba(85,85,85,1)';
    }

    async isResetOptionPresent() {
        return this.getContextMenuOption('Reset').isDisplayed();
    }

    async appliedFilterCount() {
        return this.$('.mstr-nav-filter-number').getText();
    }

    async isContextMenuOptionPresent(option) {
        return this.getContextMenuOption(option).isDisplayed();
    }

    async isContextMenuOptionDisabled(option) {
        const value = await this.getContextMenuOption(option).isEnabled();
        return !value;
    }

    async isContextMenuDotsPresent(filterName) {
        return this.getContextMenuDots(filterName).isDisplayed();
    }

    async isMendatoryIconByNameDisplayed(filterName) {
        return this.getMendatoryIconByName(filterName).isDisplayed();
    }

    async filterContainers() {
        const count = await this.getFilterContainers().length;
        if (count === 0) {
            return [];
        }
        const value = await this.getFilterContainers().map((item) =>
            item.$('.mstrd-FilterItemTitle-filterTitle').getText()
        );
        return value;
    }

    async isGlobalFilterIconPresent(filterName) {
        return this.getGlobalFilterIcon(filterName).isDisplayed();
    }

    async getFilterWarningText(name) {
        return this.getFilterWarning(name).getText();
    }

    async getFilterErrorTooltipText() {
        return this.getErrorTooltip().getText();
    }

    async getFilterDateRangeWarningText(name) {
        const text = await this.getFilterDateRangeWarning(name).getText();
        return text.replace(/['’`]/g, "'");
    }

    async isFilterDateRangeWarningDisplayed(name) {
        return this.getFilterDateRangeWarning(name).isDisplayed();
    }
}
