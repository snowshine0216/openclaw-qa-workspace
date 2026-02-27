import BasePage from '../base/BasePage.js';

export default class RsdContextMenu extends BasePage {
    constructor(container) {
        super();
        this.container = container;
        this.locator = '.mstrmojo-Xtab';
    }

    async select(menuPaths) {
        const menus = Array.isArray(menuPaths) ? menuPaths : [menuPaths];
        const LOCATOR = '.mstrmojo-ui-Menu';
        for (const [level, menuItem] of menus.entries()) {
            await this.sleep(1000);
            const target = this.$$(LOCATOR)
                [level].$$(`${LOCATOR}-item`)
                .filter(async (elem) => {
                    const menuName = await elem.getText();
                    return menuName === menuItem;
                })[0];
            await this.click({ elem: target });
        }
    }

    async isMenuPathPresent(menuPaths) {
        const menus = Array.isArray(menuPaths) ? menuPaths : [menuPaths];
        const LOCATOR = '.mstrmojo-ui-Menu';
        for (const [level, menuItem] of menus.entries()) {
            const target = this.$$(LOCATOR)
                [level].$$(`${LOCATOR}-item`)
                .filter(async (elem) => {
                    const menuName = await elem.getText();
                    return menuName === menuItem;
                })[0];
            if (!(await target.isDisplayed())) {
                return false;
            }
        }
        return true;
    }
}
