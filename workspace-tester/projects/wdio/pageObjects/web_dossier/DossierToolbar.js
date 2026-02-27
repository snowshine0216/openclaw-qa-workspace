import BaseComponent from '../base/BaseComponent.js';

export default class DossierToolbar extends BaseComponent {
    constructor() {
        super(null, '.mstrmojo-RootView-toolbar', 'Dossier Toolbar component');
    }

    getShowNavigationBarButton() {
        return this.locator.$('.togglePathbar');
    }

    getMoreOptionInToolbar() {
        return this.locator.$('.item.mb.more');
    }

    getToolbarMenu() {
        return this.$('.vi-toolbarMenu');
    }

    getShowNavigationBarButtonInMoreOption() {
        return this.getToolbarMenu().$('.togglePathbar');
    }

    getCloseButton() {
        return this.locator.$('.item.btn.close');
    }

    async showNavigationBar() {
        await this.waitForElementVisible(this.locator);
        const isMoreOptionVisible = await this.getMoreOptionInToolbar().isDisplayed();
        if (isMoreOptionVisible) {
            console.log('More option is visible');
            await this.click({ elem: this.getMoreOptionInToolbar() });
            await this.waitForElementVisible(this.getToolbarMenu());
            await this.click({ elem: this.getShowNavigationBarButtonInMoreOption() });
            await this.waitForElementInvisible(this.getToolbarMenu());
        } else {
            await this.click({ elem: this.getShowNavigationBarButton() });
        }
    }
}
