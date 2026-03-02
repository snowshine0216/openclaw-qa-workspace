import { $ } from '@wdio/globals';
import ConditionEditor from './condition.editor.js';
import BasePage from '../../base/BasePage.js';

export default class ConditionalFormatEditor extends BasePage{
    root: any;
    constructor( conditionalFormatEditorElement: any ) {
        super();
        this.root = conditionalFormatEditorElement;
    }

    public getElement() {
        return this.root;
    }

    public async getNewConditionLabel() {
        return this.root.$('.mstrmojo-Editor-content .content .mstrmojo-scrollNode .mstrmojo-Label');
    }

    public async getThresholdRow() {
        return this.root.$('.mstrmojo-Editor-content .content .mstrmojo-scrollNode .mstrmojo-thresholdRow');
    }

    public async getThresholdDeleteButton() {
        const thresholdRow = await this.getThresholdRow();
        return thresholdRow.$('.delete');
    }

    public async getConditionContainer() {
        const thresholdRow = await this.getThresholdRow();
        return thresholdRow.$('.container').$('.mstrmojo-add-cond').$('..');
    }

    public getAddConditionButton() {
        return this.root.$('.mstrmojo-add-cond');
    }

    public getTooltip() {
        return this.$('.mstrmojo-Tooltip-content');
    }

    async isTooltipPresent() {
        const tmp1 = this.getTooltip()
        return tmp1.isDisplayed();
    }
    
    public async clickNewCondition() {
        const newConditionLabel = await this.getNewConditionLabel();
        await newConditionLabel.click();
    }

    public async clickAddCondition() {
        const container = await this.getConditionContainer();
        await container.click();
        const addConditionButton = await this.getAddConditionButton();
        await addConditionButton.click();
    }

    public async clickExistingCondition() {

    }

    public async clickThresholdDeleteButton() {
        const thresholdDeleteButton = await this.getThresholdDeleteButton();
        await thresholdDeleteButton.click();
    }

    public async checkExistingCondition() {
        const newConditionLabel = await this.getNewConditionLabel();
        if (await newConditionLabel.isDisplayed()) {
            console.log('no existing condition');
            return 0;
        }
        else
            return 1;
    }

    public async getConditionEditor() {
        const editorElement = await this.$('.mstrmojo-vi-ui-ConditionEditor');
        return new ConditionEditor(editorElement);
    }

    public async saveConditionalFormat() {
        const saveButton = await this.root.$$('.mstrmojo-Button')[1];
        await saveButton.click();
        //await $('.mstrWaitBox').waitForDisplayed();
        await this.$('.mstrWaitBox').waitForDisplayed({
            reverse: true,
            timeout: 30*1000,
            timeoutMsg: 'timeout on saving conditional format',
        });
    }

    public async cancelConditionalFormat() {
        const cancelButton = await this.root.$('.mstrmojo-Button-text=Cancel');
        await cancelButton.click();
    }

    public async hoveConditionalDisplayOkButton() {
        const okButton = await this.root.$$('.mstrmojo-Button')[1];
        await okButton.moveTo();
    }
    
}