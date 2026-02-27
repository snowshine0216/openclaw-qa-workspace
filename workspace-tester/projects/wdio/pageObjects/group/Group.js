import BasePage from '../base/BasePage.js';

export default class Group extends BasePage {
    // locator
    getGroupDialog() {
        return this.$('.ant-modal-content');
    }

    getGroupInput() {
        return this.getGroupDialog().$('.mstrd-GroupInfoDialog-input');
    }

    getGroupColor(color) {
        return this.getGroupDialog().$(`.mstrd-ColorPicker .mstrd-ColorPicker-color[aria-label= ${color}]`);
    }

    getGroupSaveBtn() {
        return this.getGroupDialog().$('.mstrd-GroupInfoDialog-btnSave');
    }

    getGroupCancelBtn() {
        return this.getGroupDialog().$('.mstrd-GroupInfoDialog-btnCancel');
    }

    getGroupBar() {
        return this.$('.mstrd-MultiSelectionToolbar');
    }

    getGroupBarSelectAllBtn() {
        return this.getGroupBar().$('.mstrd-MultiSelectionToolbar-selectionIcon');
    }

    getGroupBarSelectionText() {
        return this.getGroupBar().$('.mstrd-MultiSelectionToolbar-selectionText').getText();
    }

    getGroupBarActionBtn() {
        return this.getGroupBar().$('.mstrd-ShortcutGroupAction-btn');
    }

    getGroupBarContextMenu() {
        return this.getGroupBar().$('.mstrd-ContextMenu-menu');
    }

    // to check
    getGroupBarContextMenuItem(item) {
        // const menuLocator = '.mstrd-ContextMenu-item,.ant-dropdown-menu-submenu-vertical';
        // return this.getGroupBarContextMenu().element(by.cssContainingText(menuLocator, item));
        return this.getGroupBarContextMenu()
            .$$('.mstrd-ContextMenu-item,.ant-dropdown-menu-submenu-vertical')
            .filter(async (elem) => {
                const text = await elem.getText();
                return text.includes(item);
            })[0];
    }

    getGroupBarSecondaryMenu() {
        return this.$('.ant-dropdown-menu-submenu-popup');
    }

    getGroupBarSecondaryMenuItem(item) {
        // return this.getGroupBarSecondaryMenu().element(by.cssContainingText('.mstrd-ContextMenu-item', item));
        return this.getGroupBarSecondaryMenu().$(`.mstrd-ContextMenu-item*=${item}`);
    }

    getGroupBarDoneBtn() {
        return this.getGroupBar().$('.mstrd-MultiSelectionToolbar-done');
    }

    getGroupError() {
        return this.getGroupDialog().$('.mstrd-GroupInfoDialog-error').getText();
    }

    // action
    async inputGroupName(name) {
        await this.clear({ elem: this.getGroupInput() });
        return this.getGroupInput().setValue(name);
    }

    async selectGroupColor(color) {
        return this.click({ elem: this.getGroupColor(color) });
    }

    async clickGroupSaveBtnNoWait() {
        await this.click({ elem: this.getGroupSaveBtn() });
        return this.sleep(1000); // wait validation msg returned
    }

    async clickGroupSaveBtn() {
        await this.clickGroupSaveBtnNoWait();
        await this.waitForElementInvisible(this.getGroupDialog());
        await this.sleep(this.DEFAULT_API_TIMEOUT); // wait response returned
    }

    async clickGroupCancelBtn() {
        await this.click({ elem: this.getGroupCancelBtn() });
        return this.waitForElementInvisible(this.getGroupDialog());
    }

    async clickGroupBarSelectAllBtn() {
        return this.click({ elem: this.getGroupBarSelectAllBtn() });
    }

    async clickGroupBarActionBtn() {
        return this.click({ elem: this.getGroupBarActionBtn() });
    }

    async selectGroupBarContextMenu(item1, item2 = '') {
        await this.click({ elem: this.getGroupBarContextMenuItem(item1) });
        if (item2 !== '') {
            await this.waitForElementVisible(this.getGroupBarSecondaryMenu());
            await this.click({ elem: this.getGroupBarSecondaryMenuItem(item2) });
        }
        return this.sleep(this.DEFAULT_API_TIMEOUT); //wait response returned
    }

    async hoverGroupBarContextMenu(item) {
        await this.hover({ elem: this.getGroupBarContextMenuItem(item) });
        return this.waitForElementVisible(this.getGroupBarSecondaryMenu());
    }

    async clickGroupBarDoneBtn() {
        return this.click({ elem: this.getGroupBarDoneBtn() });
    }

    // assertion
    async isGroupDialoguePresent() {
        return this.getGroupDialog().isDisplayed();
    }

    async isGroupColorSelected(color) {
        const el = await this.getGroupColor(color);
        return this.isSelected(el);
    }

    async isGroupColorPresent(color) {
        return this.getGroupColor(color).isDisplayed();
    }

    async isGroupBarPresent() {
        return this.getGroupBar().isDisplayed();
    }

    async isGroupBarActionBtnPresent() {
        return this.getGroupBarActionBtn().isDisplayed();
    }

    async getGroupBarSelectionCount() {
        await this.waitForCurtainDisappear();
        const text = await this.getGroupBarSelectionText();
        return Number(text.match(/\d+/g));
    }

    async isGroupNameInputFocused() {
        const elem = this.getGroupInput();
        const cls = await elem.getAttribute('class');
        return cls.includes('focus-visible');
    }

    async isColorFocused(color) {
        const elem = this.getGroupColor(color);
        const cls = await elem.getAttribute('class');
        return cls.includes('focus-visible');
    }

    async isSaveButtonFocused() {
        const elem = this.getGroupSaveBtn();
        const cls = await elem.getAttribute('class');
        return cls.includes('focus-visible');
    }
}
