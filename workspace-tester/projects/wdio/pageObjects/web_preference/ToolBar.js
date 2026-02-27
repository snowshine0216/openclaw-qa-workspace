import BaseComponent from '../base/BaseComponent.js';

export default class ToolBar extends BaseComponent {
    // element locator
    getNavigationBar() {
        return this.$('#preferencesToolbar');
    }

    getApplyBtnOnToolBar() {
        return this.getNavigationBar().$('#tbSave');
    }

    getApplyToDropdown() {
        return this.$('#projectLevel');
    }

    getCloseBtn() {
        return this.$('.mstrIconNoTextDecoration.mstrVerticalLine');
    }

    // action helper
    async applyChanges() {
        await this.click({ elem: this.getApplyBtnOnToolBar() });
    }

    async close() {
        await this.click({ elem: this.getCloseBtn() });
    }
}
