import BasePageDialog from '../base/BasePageDialog.js';

export default class MetricDialog extends BasePageDialog {
    constructor() {
        super(null, '.mstrmojo-Editor.mstrmojo-MetricIDE.modal', 'Create metric dialog');
    }

    // Action helper

    async close() {
        await super.close();
    }

    getSwitchToFormulaEditorBtn() {
        return this.$(`//div[contains(@class, 'mstrmojo-MetricIDE-editors-container')]//div[contains(@class, 'switch-to-formula')]`);
    }

    getSwitchToFormulaEditorDisabledBtn() {
        return this.$(`//div[contains(@class, 'mstrmojo-MetricIDE-editors-container')]//div[contains(@class, 'switch-to-formula') and contains(@class, 'disabled')]`);
    }

    getMetricNameInput() {
        return this.$(`//div[contains(@class, 'mstrmojo-MetricIDE-editors-container')]//input[contains(@class, 'mstrmojo-ME-nameInput')]`);
    }

    getFormulaEditor() {
        return this.$('.mstrmojo-TokenInputBox-edit');
    }

    getClearFormulaBtn() {
        return this.$('.mstrmojo-WebHoverButton.clear');
    }

    getSaveBtn() {
        return this.$('.me-save-button');
    }

    getSaveDisabledBtn() {
        return this.$('.me-save-button.disabled');
    }

    async waitDialogShown() {
        return this.waitForElementVisible(this.getElement());
    }

    async swtichToFormulaEditor() {
        await this.waitForElementVisible(this.getSwitchToFormulaEditorBtn());
        await this.waitForElementInvisible(this.getSwitchToFormulaEditorDisabledBtn());
        await this.getSwitchToFormulaEditorBtn().click();
    }

    // click on the metric name input
    // clear the input
    // type the new name
    async renameMetric(newName) {
        await this.waitForElementVisible(this.getMetricNameInput());
        await this.getMetricNameInput().click();
        await browser.pause(2000);
        await this.getMetricNameInput().clearValue();
        await this.getMetricNameInput().setValue(newName);
    }
    
    // click on the formula editor
    // clear the input
    // type the new formula
    async editFormula(newFormula) {
        await this.waitForElementVisible(this.getFormulaEditor());
        await this.getFormulaEditor().click();
        await browser.pause(1000);
        await this.getClearFormulaBtn().click();
        await this.getFormulaEditor().setValue(newFormula);
    }


    async save() {
        await this.waitForElementInvisible(this.getSaveDisabledBtn());
        await this.getSaveBtn().click();
    }
}
