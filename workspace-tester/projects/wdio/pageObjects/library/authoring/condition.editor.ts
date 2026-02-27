import { $ } from '@wdio/globals';
import { ExpressionType, FunctionName } from './utils/model.js';
//import { ExpressionTypeMappping, FunctionNameMapping } from './utils/constants/index.js';
import { ExpressionTypeMappping, FunctionNameMapping } from './utils/constants.js';

export default class ConditionEditor {
    root: WebdriverIO.Element;

    constructor( conditionEditorElement:  WebdriverIO.Element ) {
        this.root = conditionEditorElement;
    }

    public getElement() {
        return this.root;
    }

    public async selectTarget(text: string) {
        const targets = await this.root.$$('.conditionWalk-target .item.unit');

        for (const target of targets) {
            const targetText = await target.getText();
            if (targetText === text) {
                await target.click();
                break;
            }
        }
    }

    public async openExpressionTypePulldown() {
        const targetMethod = await this.root.$('.targetMethod');
        await targetMethod.click();
    }

    public async selectExpressionType(type: ExpressionType) {
        const typeText = ExpressionTypeMappping[type];
        if (!typeText) throw new Error(`Invalid expression type: ${type}`);

        await this.openExpressionTypePulldown();

        const targetMethods = await this.root.$$('.targetMethod .item');
        for (const targetMethod of targetMethods) {
            const targetMethodText = await targetMethod.getText();
            if (targetMethodText === typeText) {
                await targetMethod.click();
                break;
            }
        }
    }

    public async selectFunction(FunctionName: FunctionName) {
        const functionNameText = FunctionNameMapping[FunctionName];
        if (!functionNameText) throw new Error(`Invalid function name: ${FunctionName}`);

        const functions = await this.root.$$('.mstrmojo-fm .item.fn');
        for (const fn of functions) {
            const fnText = await fn.getText();
            if (fnText === functionNameText) {
                await fn.click();
                break;
            }
        }
    }

    // use click in method name, instead of select, because they are checkboxs, click is toggling selection
    public async clickElements(elements: string[]) {
        const elementItems = await this.root.$$('.elementsList .item');

        for (const elementItem of elementItems) {
            const elementText = await elementItem.getText();
            if (elements.includes(elementText)) {
                await elementItem.click();
            }
        }
    }

    public async selectMetricOperator(element: string) {
        const operator = await this.root.$(`.text=${element}`);
        await operator.click();
    }

    public async inputOperatorValue(value: string) {
        const input = await this.root.$('.mstrmojo-TextBox');
        await input.setValue(value);
    }

    public async selectOperatorMetric(text: string) {
        const operator = await this.root.$('.mstrmojo-ui-Pulldown.conditionWalk-attMxPd .mstrmojo-ui-Pulldown-text ');
        await operator.click();
        const targets = await this.root.$$('.conditionWalk-attMxPd .item.unit');
        for (const target of targets) {
            const targetText = await target.getText();
            if (targetText === text) {
                await target.click();
                break;
            }
        }
    }

    public async saveCondition() {
        const saveButton = await this.root.$('.mstrmojo-Button-text=OK');
        await saveButton.click();
    }

    public async cancelCondition() {
        const cancelButton = await this.root.$('.mstrmojo-Button-text=Cancel');
        await cancelButton.click();
    }

}