import BaseComponent from '../base/BaseComponent.js';

export default class ReportToolbar extends BaseComponent {
    /** *** Below methods used in first toolbar **** */
    constructor() {
        // There are 2 toolbars in the report. This component combine them together
        super(null, '#mstrWeb_dockTop', 'Report Toolbar component');
    }

    getFirstToolbar() {
        return this.$('#ribbonToolbarTabsListContainer');
    }

    getSecondToolbar() {
        return this.$('.mstrToolbar2[style*="block"]');
    }

    getMenuItem(menuItem) {
        return this.$$('.select-free.mstrFloatingMenu a').filter(async (elem) => {
            const elemText = await elem.getText();
            return this.escapeRegExp(elemText).includes(this.escapeRegExp(menuItem));
        })[0];
    }

    getTab(tabName) {
        return this.getFirstToolbar()
            .$$('tr')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(tabName);
            })[0];
    }

    getTabRightMenuIcon(tabName) {
        return this.getTab(tabName).$('.right.menu');
    }

    getFloatingMenu() {
        return this.$('.select-free.mstrFloatingMenu');
    }

    getCancelReport() {
        return this.locator.$('#tbCancelReport');
    }

    async openTab(tabName) {
        await this.click({ elem: this.getTab(tabName) });
    }

    getToolbarElement(buttonTitle) {
        return this.getSecondToolbar().$$(`.mstrToolbarButton span[title="${buttonTitle}"]`)[0];
    }

    async openFloatingMenu(tabName) {
        await this.click({ elem: this.getTabRightMenuIcon(tabName) });
        return this.waitForElementVisible(this.getFloatingMenu());
    }

    /**
     * Click the toolbar menu based on the menu paths passed in.
     * @param {string} tabName The name of tab
     * @param {string[]} menus The menu path of the toolbar menu in each tab
     */
    async select(tabName, menus) {
        // open tab dropdown menu
        await this.openFloatingMenu(tabName);
        for (const [level, menuItem] of menus.entries()) {
            const target = this.getMenuItem(menuItem);
            await this.sleep(1000); // wait for the menu to appear
            await this.waitForElementVisible(target);
            try {
                await this.waitForElementVisible(target);
            } catch (e) {
                throw new Error(`Toolbar menu for level ${level + 1} and ${menuItem} didn't appear.`);
            }
            await this.click({ elem: target });
        }
    }

    /** *** Below methods used in second toolbar **** */

    async clickButton(buttonTitle) {
        const button = this.$('.mstrToolbar2[style*="block"]').$$(`.mstrToolbarButton span[title="${buttonTitle}"]`)[0];
        await this.click({ elem: button });
        // After loading icon disappears, the UI may have an adjustment
        await this.sleep(1000);
    }

    /**
     * Open the toolbar menu. if already opened, no action taken
     * @param {string} tabName The name of tab
     * @param {string} menuItem The menu of the toolbar in each tab
     */
    async openToolsMenu(tabName, menuItem) {
        await this.openFloatingMenu(tabName);
        if (!(await this.isMenuItemSelected(menuItem))) {
            await this.click({ elem: this.getMenuItem(menuItem) });
        } else {
            await this.click({ elem: this.getTabRightMenuIcon(tabName) }); // click to close menu
        }
    }

    // Assertion helper

    async isButtonEnabled(buttonTitle) {
        await this.sleep(1000);
        const button = this.getSecondToolbar().$$(`span[title="${buttonTitle}"]`)[0];
        const buttonParent = await this.getParent(button);
        const buttonClass = await buttonParent.getAttribute('class');
        return buttonClass === 'mstrToolbarButton on';
    }

    async isButtonDisabled(buttonTitle) {
        const parent = await this.getParent(this.getToolbarElement(buttonTitle));
        return this.isDisabled(parent);
    }

    /**
     * Whether the menuitem is available in popup menu list
     * @param {String} menuItem name
     * @returns {Boolean} whether the item displayed
     */
    async isMenuItemDisplayed(menuItem) {
        await this.sleep(1000);
        return this.getMenuItem(menuItem).isDisplayed();
    }

    async isMenuItemSelected(menuItem) {
        const el = await this.getMenuItem(menuItem);
        return this.isSelected(el, 'pressed');
    }

    async cancelReport() {
        await this.click({ elem: this.getCancelReport() });
    }
}
