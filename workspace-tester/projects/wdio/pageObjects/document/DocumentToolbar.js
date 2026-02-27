import BaseComponent from '../base/BaseComponent.js';

// Document Tool bar in document design mode
export default class DocumentToolbar extends BaseComponent {
    constructor() {
        // There are 2 toolbars in the report. This component combine them together
        super(null, '#mstrWeb_dockTop', 'Document Toolbar component');
    }

    /** *** Below methods used in first toolbar **** */

    getTab(tabName) {
        return this.$('#ribbonToolbarTabsListContainer')
            .$$('tr')
            .filter(async (elem) => {
                const text = await elem.getText();
                return text === tabName;
            })[0];
    }

    async openTab(tabName) {
        await this.click({ elem: await this.getTab(tabName) });
    }

    /**
     * Click the toolbar menu based on the menu paths passed in.
     * @param {string} tabName The name of tab
     * @param {string[]} menus The menu path of the toolbar menu in each tab
     */
    async select(tabName, menus) {
        // open tab dropdown menu
        const tab = await this.getTab(tabName);
        await this.click({ elem: tab.$('.right.menu') });

        for (const [level, menuItem] of menus.entries()) {
            const target = this.$$(`.select-free.mstrFloatingMenu a`).filter(async (elem) => {
                const text = await elem.getText();
                return text === menuItem;
            })[level];
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
        const button = await this.secondToolbar.$$(`.mstrToolbarButton span[title="${buttonTitle}"]`)[0];
        await this.click({ elem: button });
        // After loading icon disappears, the UI may have a adjustment
        await browser.sleep(1000);
    }
}
