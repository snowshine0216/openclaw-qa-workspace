import BasePage from '../base/BasePage.js';

export default class KpiEditor extends BasePage {
    // Element locator

    getKpiEdtorContainer() {
        return this.$('.mstrd-KpiEditor');
    }

    getSaveButton() {
        return this.getKpiEdtorContainer().$('.mstrd-KpiEditor-btnSave');
    }

    getNameInput() {
        return this.getKpiEdtorContainer().$('.editor-row__name-input');
    }

    getInfoIcon() {
        return this.getKpiEdtorContainer().$('.editor-row__info-icon');
    }

    getReverseButton() {
        return this.getKpiEdtorContainer().$('.color-indicator__switch-icon');
    }

    getCloseButton() {
        return this.getKpiEdtorContainer().$('.mstrd-KpiEditor-btnClose');
    }

    // Action method

    async clickSaveButton() {
        await this.click({ elem: this.getSaveButton() });
    }

    async renameInsight(name) {
        const el = await this.getNameInput();
        await this.clear({ elem: el });
        await el.setValue(name);
    }

    async clickCloseButton() {
        await this.click({ elem: this.getCloseButton() });
    }
}
