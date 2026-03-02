import BasePage from '../base/BasePage.js';

export default class PanelSelector extends BasePage {
    constructor() {
        super('.mstrmojo-ListBox-table', 'Panel Selector');
    }

    // element locator
    getPanelByName(name) {
        return this.$$('.mstrmojo-LinkListHoriz-item').filter(async (elem) => {
            const text = await this.getInputValue(elem);
            const newText = this.escapeRegExp(text);
            const newName = this.escapeRegExp(name);
            return newText === newName;
        })[0];
    }

    async selectPanelByName(name) {
        // const { key, name } = option;
        // this.setContainer(`[k=${key}]`);
        await this.click({ elem: this.getPanelByName(name) });
    }

    async hoverToPanelByName(name) {
        await this.moveToElement(this.getPanelByName(name));
    }

    // Assersion helper

    async getPanelBackgroundColorByName(name) {
        return this.getPanelByName(name).getCSSProperty('background-color');
    }
}
