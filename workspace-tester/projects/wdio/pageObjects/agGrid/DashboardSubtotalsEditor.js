import BasePage from '../base/BasePage.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
import { scrollIntoView } from '../../utils/scroll.js';

export default class DashboardSubtotalsEditor extends BasePage {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
    }

    // Element locator
    getSubtotalEditorDialog(){
        return this.$("//div[contains(@class,'subtotals-editor')]");
    }

    getCustomSubtotalEditorDialog(){
        return this.$("//div[contains(@class,'subtotals-editor--custom')]");
    }

    getButton(label) {
        return this.$(`//button[contains(@class, 'mstr-rc-button')]//div[text() = '${label}']`);
    }

    getCustomButton(label) {
         return this.$(
             `//div[contains(@class,'subtotals-editor--custom')]//button[contains(@class, 'mstr-rc-button')]//div[text() = '${label}']`
         );
    }

    getTypeCheckbox(type) {
     return this.$(
         `//div[@class='subtotal-grid-container']//div[contains(@class, 'subtotal-checkbox')]//div[text()='${type}']/../preceding-sibling::div[contains(@class, 'mstr-rc-selector')]`
     );
    }

    getAccrossLevelSelector(type) {
        return this.$(`//div[contains(@class, 'subtotal-checkbox') and .//div[text()='${type}']]/following-sibling::div[contains(@class, 'second-select')][1]`);
    }

    getAcrossLevelAttribute(attribute) {
        return this.getSubtotalEditorDialog().$(`//li[@aria-label="${attribute}" and contains(@class, "mstr-rc-mstr-dropdown__option")]`);
    }

    get editCustomButton() {
        return this.$(`.custom-subtotal-edit-icon-button`);
}

    get removeCustomButton() {
        return this.$(`.custom-subtotal-remove-icon-button`);
    }

    get addCustomSubtotalButton() {
        return this.getSubtotalEditorDialog().$(`//button[contains(@class, 'mstr-rc-text-button')]`);
    }

    get renameCustomSubtotalInput() {
        return this.$(`//div[contains(@class,'custom-subtotal__name_section')]//div[contains(@class,'mstr-rc-input__container')]//input`);
    }

    getSubtotalsSelector(metricName) {
        return this.$(`(//div[text()='${metricName}']/../..//following-sibling::div)[1]`);
    }

    getSubTotalDropdown(){
        return this.$(`//div[contains(@class,'subtotals-editor-select-dropdown')]`);
    }

    getSubtotalType(subtotalType) {
     return this.$(
         `//div[contains(@class, 'subtotals-editor-select-dropdown')]//span[text()='${subtotalType}']`
     );
    }

    // Actions
    async clickButton(label) {
     const button = this.getButton(label);
     await this.click({ elem: button });
    }

    async closeSubtotalEditorByCancel() {
        await this.clickButton('Cancel');
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async saveAndCloseSubtotalEditor() {
        await this.clickButton('OK');
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectTypeCheckbox(type) {
        const checkbox = this.getTypeCheckbox(type);
        await this.click({ elem: checkbox });
    }

    async expandAcrossLevelSelector(type) {
        const attributeSelector = this.getAccrossLevelSelector(type);
        await this.click({ elem: attributeSelector });
    }

    async selectAttributeAcrossLevel(attribute) {
        const attributes = this.getAcrossLevelAttribute(attribute);
        await this.click({ elem: attributes });
    }

    async selectAllAttributesAcrossLevel() {
        const attributes = this.getAcrossLevelAttribute('All Attributes');
        await this.click({ elem: attributes });
    }

    async waitForSubtotalEditorVisible() {
        await this.waitForElementVisible(this.getSubtotalEditorDialog());
    }

    async clickAddCustomSubtotalButton() {
        const el = await this.addCustomSubtotalButton;
        await this.waitForElementVisible(el);
        await this.click({ elem: el });
        await this.waitForElementVisible(this.getCustomSubtotalEditorDialog());
    }

    async renameCustomSubtotalsName(newName) {
        const el = await this.renameCustomSubtotalInput;
        await this.clear({ elem: el });
        await el.setValue(newName);
    }

    async customSubtotalsClickButton(label) {
        const el = await this.getCustomButton(label);
        await this.waitForElementVisible(el);
        await this.click({ elem: el });
        await this.waitForElementInvisible(this.getCustomSubtotalEditorDialog());
        await browser.pause(500);
    }

    async editCustomSubtotal() {
        const el = await this.editCustomButton;
        await this.waitForElementVisible(el);
        await this.click({ elem: el });
        await this.waitForElementVisible(this.getCustomSubtotalEditorDialog());
    }

    async removeCustomSubtotal() {
        const el = await this.removeCustomButton;
        await this.waitForElementVisible(el);
        await this.click({ elem: el });
        await browser.pause(500);
    }

    async hoverOverCustomSubtotalOptions(customSubtotalName) {
        await scrollIntoView(this.getAccrossLevelSelector(customSubtotalName));
        await this.hover({ elem: this.getAccrossLevelSelector(customSubtotalName) });
        await browser.pause(500);
    }

    async clickSubtotalSelector(metricName) {
        const el = await this.getSubtotalsSelector(metricName);
        await this.waitForElementVisible(el);
        await this.click({ elem: el });
    }

    async setSubtotalTypeTo(metricName, subtotalType) {
        const isDropdownVisible = await this.getSubTotalDropdown().isDisplayed();
        if (!isDropdownVisible) {
            await this.clickSubtotalSelector(metricName);
            await this.waitForElementVisible(this.getSubTotalDropdown());

        }
        const subtotalTypeElement = await this.getSubtotalType(subtotalType);
        await this.waitForElementVisible(subtotalTypeElement);
        await this.click({ elem: subtotalTypeElement });
        await this.waitForElementInvisible(this.getSubTotalDropdown());
    }
}
