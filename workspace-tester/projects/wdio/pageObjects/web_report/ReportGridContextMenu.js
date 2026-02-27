import BasePage from '../base/BasePage.js';

const LOCATOR_PREFIX = '#UniqueReportID_GM';
const LOCATOR_MENUEDITOR = '.mstrmojo-ui-MenuEditor';
/**
 * The ContextMenu component used in the Report Grid
 */
export default class ReportGridContextMenu extends BasePage {
    /**
     * Click the context menu based on the menu paths passed in.
     * @param {string[]} menus The menu path of the context menu
     */
    async select(menus) {
        const LOCATOR_PREFIX = '#UniqueReportID_GM';
        for (const [level, menuItem] of menus.entries()) {
            await this.sleep(1000);
            const target = this.$$(`${LOCATOR_PREFIX + (level + 1)} td[align="LEFT"]`).filter(async (elem) => {
                const menuName = await elem.getText();
                return menuName.includes(menuItem);
            })[0];
            await this.click({ elem: target });
        }
    }

    getLevelMenu(level) {
        return this.$(LOCATOR_PREFIX + level);
    }

    getMenuEditorButtons() {
        return this.$(LOCATOR_MENUEDITOR).$$('.mstrmojo-Button');
    }

    async clickOk() {
        return this.click(this.getMenuEditorButtons()[0]);
    }

    async clickCancel() {
        return this.click(this.getMenuEditorButtons()[1]);
    }

    getSecondaryContextMenu() {
        return this.$$('.mstrContextMenuRight')[1];
    }

    getSecondaryDrillContextItems() {
        return this.getSecondaryContextMenu().$$('tbody tr');
    }

    getNthContextItemText(number) {
        return this.getSecondaryDrillContextItems()[number].getText();
    }

    /**
     * The MenuEditor menu will popup when open 'Show Totals'
     * @param {String[]} itemTexts the items to pick, ['Total', 'Average']
     */
    async selectMenuEditorItems(itemTexts) {
        itemTexts.forEach(async (itemText) => {
            const target = this.$(LOCATOR_MENUEDITOR).element(by.cssContainingText('.item', new RegExp(`^${itemText}$`)));
            await this.click({ elem: target });
        });
    }

    async isMenuPathPresent(menuPaths) {
        const menus = Array.isArray(menuPaths) ? menuPaths : [menuPaths];

        for (const [level, menuItem] of menus.entries()) {
            const target = element(
                by.cssContainingText(
                    `${LOCATOR_PREFIX + (level + 1)} td[align="LEFT"]`,
                    new RegExp(`^${this.escapeRegExp(menuItem)}\\s*$`)
                )
            );
            if (!(await target.isDisplayed())) {
                return false;
            }
        }
        return true;
    }
}
