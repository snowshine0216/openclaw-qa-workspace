import DossierPage from '../dossier/DossierPage.js';
import { getInputValue } from '../../utils/getAttributeValue.js';
import BaseComponent from '../base/BaseComponent.js';
import TitleBar from '../document/TitleBar.js';

export default class MetricQualification extends BaseComponent {
    constructor(container) {
        super(container, '.mstrmojo-Table.qs, .mstrmojo-vi-metric-qual, .Attr-Qual-InputBox');
        this.dossierPage = new DossierPage();
    }

    getTitle() {
        const plocator = this.getElement().$('../../../..').$('.mstrmojo-portlet-titlebar');
        const el = new TitleBar(plocator);
        return el;
    }

    // element locater
    getPatternBox() {
        return this.getElement().$('.mstrmojo-SelectBox');
    }

    getQualificationPattern() {
        return this.getPatternBox().$('option[selected=true]').getText();
    }

    getInputBox() {
        return this.getElement().$$('.mstrmojo-TextBox');
    }

    getInputBoxV1() {
        return this.getElement().$('.v1 input');
    }

    getInputBoxV2() {
        return this.getElement().$('.v2 input');
    }

    getDropdown() {
        return this.getElement().$$('.pulldown').filter(async (elem) => (await elem.isDisplayed()))[0];
    }

    getOperaterOption(name) {
        return this.$$('.mstrmojo-PopupList .item')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return this.escapeRegExp(elemText).includes(this.escapeRegExp(name));
            })[0];
    }

    getApplyIcon() {
        return this.getElement().$('.mstrmojo-Button.icn.apply');
    }

    getDropdownListItems() {
        return this.getPatternBox().$$('.mstrmojo-selectbox-item');
    }

    getSelectedPattern() {
        return this.getPatternBox().$('.mstrmojo-selectbox-item[selected]');
    }

    // action  helper

    async openPatternDropdown() {
        await this.getPatternBox().click();
        await this.waitForElementVisible(this.getDropdownListItems()[0]);
    }

    async selectDropdownOperation(name, iswait = true) {
        await this.click({ elem: this.getDropdown() });
        await this.click({ elem: this.getOperaterOption(name) });
        if (iswait) {
            await this.waitForElementInvisible(this.getDropdown());
        }
    }

    async openDropdownOperation() {
        await this.click({ elem: this.getDropdown() });

    }

    /**
     * @param {Number} index start from 1
     * @param {*} text reserved for better understanding for the item cliked
     */
    async selectNthItem(index, text) {
        await this.getDropdownListItems()[index - 1].click();
    }

    async inputValue(value, index = 1) {
        await this.clear({ elem: this.getInputBox()[index - 1] });
        await this.getInputBox()[index - 1].setValue(value);
        await this.click({ elem: this.getApplyIcon() });
    }

    async inputValueDirectly(value, index = 1) {
        await this.getInputBox()[index - 1].click();
        await this.clear({ elem: this.getInputBox()[index - 1] });
        await this.getInputBox()[index - 1].setValue(value);
        await this.enter();
    }

    async inputValueWithoutApply(value, index = 1) {
        const input = this.getInputBoxV1();
        await this.click({ elem: input });
        await this.clear({ elem: input });
        await input.setValue(value);
    }

    // assertion helper

    async getInputValue() {
        return getInputValue(this.getInputBox()[0]);
    }

    async apply() {
        await this.click({ elem: this.getApplyIcon() });
    }

    async getSelectedPatternText() {
        return this.getSelectedPattern().getText();
    }

    async getMQExpression() {
        const dropdownValue = await this.getDropdown().getText();
        let value = dropdownValue;
        if (await this.getInputBoxV1().isDisplayed()) {
            value = `${dropdownValue} ${await getInputValue(this.getInputBoxV1())}`;
        }
        if (await this.getInputBoxV2().isDisplayed()) {
            value = `${value} And ${await getInputValue(this.getInputBoxV2())}`;
        }
        return value;
    }

}
