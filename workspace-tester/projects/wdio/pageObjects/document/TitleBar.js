import BaseComponent from '../base/BaseComponent.js';

export default class TitleBar extends BaseComponent {
    constructor(locator = '.mstrmojo-portlet-titlebar') {
        super(null, locator);
    }

    async getTitleText() {
        const el = await this.getElement().$('.mstrmojo-portlet-title');
        return el.getText();
    }

    getTriageButton() {
        return this.getElement().$('.mstrmojo-portlet-slot-toolbar .mstrmojo-Button-text');
    }

    getSelectorMenu() {
        return this.$('#mstrSelectorMenu');
    }

    getQualificationItembyText(text) {
        return this.getSelectorMenu()
            .$$('.mstrmojo-MenuItem')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(text);
            })[0];
    }

    getLeftArrow() {
        return this.getElement().$('.mstrmojo-portlet-slot-toolbar-left');
    }

    getRightArrow() {
        return this.getElement().$('.mstrmojo-portlet-slot-toolbar.pst-r div.mstrmojo-Button.tbNext');
    }

    // action helper
    async clickTriageButton() {
        await this.click({ elem: this.getTriageButton() });
        await this.waitForElementVisible(this.getSelectorMenu());
    }

    async clickMenuItem(text) {
        await this.click({ elem: this.getQualificationItembyText(text) });
        await this.waitForElementInvisible(this.getSelectorMenu());
    }

    async clickTitle() {
        await this.click({ elem: this.getElement() });
    }

    async clickLeftArrow() {
        await this.click({ elem: this.getLeftArrow() });
    }

    async clickRightArrow() {
        await this.click({ elem: this.getRightArrow() });
    }

    // assertion helper
    async isItemSelected(text) {
        return this.isSelected(this.getQualificationItembyText(text), 'pressed');
    }
}
