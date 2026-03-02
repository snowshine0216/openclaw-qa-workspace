import BaseComponent from '../base/BaseComponent.js';
import InCanvasSelector from './InCanvasSelector.js';


export default class SelectorPanel extends BaseComponent {
    constructor(container) {
        super(container, '.mstrmojo-DocPanelStack-content', 'Selector Panel');
    }


    getInCanvasSelectorByAriaLabel(ariaLabel) {
        const el = new InCanvasSelector(this.getElement(), null, ariaLabel);
        return el;
    }

    // Locator
    getButtonByName(name) {
        return this.getElement().$$('.mstrmojo-ButtonBox').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText.includes(name);
        })[0];
    }

    getTooltip() {
        return $('.mstrmojo-Tooltip-content');
    }

    // Action helper
    async applySelection() {
        const btn = this.getButtonByName('Apply');
        await this.click({ elem: btn });
    }

   async cancelSelection() {
        const btn = this.getButtonByName('Cancel');
        await this.click({ elem: btn });
    }

    // Assertion helper
    async getApplyButtonTooltip() {
        const btn = this.getButtonByName('Apply');
        await this.hover({ elem: btn });
        await this.waitForElementVisible(this.getTooltip());
        return this.getTooltip().getText();
    }

    async getCancelButtonTooltip() {
        const btn = this.getButtonByName('Cancel');
        await this.hover({ elem: btn });
        await this.waitForElementVisible(this.getTooltip());
        return this.getTooltip().getText();
    }

    async isApplyButtonDisabled() {
        const btn = this.getButtonByName('Apply');
        const value = await this.isDisabled(btn);
        return value;
    }

}