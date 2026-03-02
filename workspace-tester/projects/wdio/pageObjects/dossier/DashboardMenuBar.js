import BasePage from '../base/BasePage.js';

export default class DashboardMenuBar extends BasePage {
    // Element locator
    getDashboardMenuBarContainer() {
        return this.$('.mstrmojo-RootView-menubar');
    }

    getSubMenuContainer() {
        return this.$('.mstrmojo-ui-Menu-item-container');
    }

    getMenuBarItemByName(name) {
        switch (name.toLowerCase()) {
            case 'library':
                return this.getDashboardMenuBarContainer().$('.library');
            case 'file':
                return this.getDashboardMenuBarContainer().$('.file');
            case 'insert':
                return this.getDashboardMenuBarContainer().$('.file');
            case 'format':
                return this.getDashboardMenuBarContainer().$('.style');
            case 'view':
                return this.getDashboardMenuBarContainer().$('.view');
            case 'help':
                return this.getDashboardMenuBarContainer().$('.help');
            default:
                throw new Error(`Does not support menu bar item with name: ${name}`);
        }
    }

    getSaveSuccessMessage() {
        return this.$('//span[text()="Saved Successfully"]');
    }

    getTitleContainer() {
        return this.getDashboardMenuBarContainer().$('.mstr-macro-texts');
    }

    getTemplateIconInTitle() {
        return this.getTitleContainer().$('.macro-template-icon');
    }

    getCertifiedIconInTitle() {
        return this.getTitleContainer().$('.macro-certified-icon');
    }

    // submenu item class locator, e.g. newVI/save/saveAs/setAsTemplate etc
    getMenuBarSubItemByName(subItemName) {
        return this.getSubMenuContainer().$(`.mstrmojo-ui-Menu-item.${subItemName}`);
    }

    // Action helper
    async clickDashboardMenuBar({ menu, subMenu, isClose = true }) {
        await this.waitForElementVisible(this.getDashboardMenuBarContainer());
        await this.click({ elem: this.getMenuBarItemByName(menu) });
        if (subMenu) {
            await this.click({ elem: this.getMenuBarSubItemByName(subMenu) });
            if (!isClose) return;
            await this.waitForElementInvisible(this.getSubMenuContainer());
        }
    }

    async toggleSetAsTemplate() {
        const isDisplayed = await this.getTemplateIconInTitle().isDisplayed();
        await this.clickDashboardMenuBar({ menu: 'file', subMenu: 'setAsTemplate' });
        if (isDisplayed) {
            await this.waitForElementInvisible(this.getTemplateIconInTitle());
        } else {
            await this.waitForElementVisible(this.getTemplateIconInTitle());
        }
    }

    async toggleCertify() {
        const isDisabled = await this.getCertifiedIconInTitle().isDisplayed();
        await this.clickDashboardMenuBar({ menu: 'file', subMenu: 'certify' });
        if (isDisabled) {
            await this.waitForElementInvisible(this.getCertifiedIconInTitle());
        } else {
            await this.waitForElementVisible(this.getCertifiedIconInTitle());
        }
    }

    async openFileMenu() {
        await this.clickDashboardMenuBar({ menu: 'file' });
    }

    async clickSaveInMenuBar() {
        await this.clickDashboardMenuBar({ menu: 'file', subMenu: 'save' });
    }

    async isTemplateIconDisplayedInTitleBar() {
        return this.getTemplateIconInTitle().isDisplayed();
    }

    async isCertifiedIconDisplayedInTitleBar() {
        return this.getCertifiedIconInTitle().isDisplayed();
    }
}
