import Utils from '../authoring/Utils.js';
import BasePage from '../base/BasePage.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
import DossierEditorUtility from '../dossierEditor/components/DossierEditorUtility.js';

export default class MicrochartConfigDialog extends BasePage {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        this.dossierEditorUtility = new DossierEditorUtility();
    }

    get windowRoot() {
        return this.$(`//div[contains(@class, 'mstrmojo-Editor') and contains(@class, 'microchart-container')]`);
    }

    get nameInputField() {
        return this.windowRoot.$(`.//div[contains(@class, 'ant-form-item') and contains(@class, 'name')]//input`);
    }

    getNameInputFieldWithText(txt) {
        return this.windowRoot.$(
            `.//div[contains(@class, 'ant-form-item') and contains(@class, 'name')]//input[@value = '${txt}']`
        );
    }

    get typePulldown() {
        return this.windowRoot.$(
            `(.//div[contains(@class, 'left-col')]//div[${Utils.containsExactClass(
                'ant-select'
            )}]/div[contains(@class, 'ant-select-selector')])[1]`
        );
    }

    get typePulldownSelection() {
        return this.typePulldown.$(`.//div[contains(@class, 'ant-select-selection-item')]/div`);
    }

    get okButton() {
        return this.windowRoot.$(
            `//div[contains(@class, 'microchart-footer')]//button[contains(@class, 'ant-btn-primary')]`
        );
    }

    get cancelButton() {
        return this.windowRoot.$(
            `//div[contains(@class, 'microchart-footer')]//button[contains(@class, 'ant-btn') and contains(@class, 'cancel')]`
        );
    }

    /**
     * Gets a given object pulldown with indexing starting at 1.
     * Indexing starts below the "Add Objects" header and does not include
     * the "Type" pulldown.
     *
     * @param {*} index
     * @returns
     */
    getObjectPulldown(index) {
        return this.windowRoot.$(
            `(.//div[contains(@class, 'left-col')]//div[${Utils.containsExactClass(
                'ant-select'
            )}]/div[contains(@class, 'ant-select-selector')])[${index + 1}]`
        );
    }

    getObjectPulldownSelection(index) {
        const pulldown = this.getObjectPulldown(index);
        return pulldown.$(`.//span[contains(@class, 'ant-select-selection-item')]/div`);
    }

    getPulldownOption(text) {
        return this.$(
            `//div[${Utils.containsExactClass(
                'ant-select-dropdown'
            )} and not(contains(@class, 'ant-select-dropdown-hidden'))]//div[contains(@class, 'ant-select-item-option-content')]/div[text()='${text}']//ancestor::div[@aria-label='${text}']`
        );
    }

    getPulldownOptionByIndex(index) {
        return this.$(
            `(//div[${Utils.containsExactClass(
                'ant-select-dropdown'
            )} and not(contains(@class, 'ant-select-dropdown-hidden'))]//div[contains(@class, 'select-dropdown-value')])[${index}]`
        );
    }

    async renameChart(name) {
        const nameField = await this.nameInputField;
        await this.dossierEditorUtility.doubleClickOnElementThenWaitLoadingData(nameField);
        await this.clear({ elem: nameField });
        await this.input(name);
        await this.enter();
    }

    /**
     * Select the given microchart type.
     *
     * @param {*} type
     */
    async selectType(type) {
        const pulldown = await this.typePulldown;
        await this.clickOnElement(pulldown);
        const option = await this.getPulldownOption(type);
        await this.waitForElementVisible(option);
        await this.clickOnElement(option);
    }

    /**
     * Select an attribute/metric from a given pulldown.
     *
     * @param {*} pulldownIndex
     * @param {*} optionText
     */
    async selectObject(pulldownIndex, optionText) {
        const pulldown = await this.getObjectPulldown(pulldownIndex);
        await this.clickOnElement(pulldown);
        const option = await this.getPulldownOption(optionText);
        await this.waitForElementVisible(option);
        await this.clickOnElementByInjectingScript(option);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async confirmDialog() {
        await this.clickOnElement(this.okButton);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async cancelDialog() {
        await this.clickOnElement(this.cancelButton);
    }
}
