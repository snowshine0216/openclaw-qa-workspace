import BaseComponent from '../base/BaseComponent.js';

export default class Alert extends BaseComponent {
    constructor() {
        super(null, '.mstrd-SubscriptionSettings-conditionEditor', 'Condition Dialog');
    }

    // element locator
    getConditionDetails() {
        return this.getElement().$('.conditionBar');
    }

    getBasedOn() {
        return this.getElement().$('.mstrmojo-ui-Pulldown-text.hasEditableText');
    }

    getDropDown() {
        return this.getElement().$$('.mstrmojo-PopupList').filter(async (elem) => {
            const style = await elem.getAttribute('style');
            return style.includes('display: block');
        })[0];
    }

    getDropDownItems() {
        return this.getDropDown().$$('.item');
    }

    getElementsList() {
        return this.getElement().$('.elementsList');
    }

    getChooseElementBy() {
        return this.getElement().$(`.mstrmojo-ui-Pulldown.targetMethod .mstrmojo-ui-Pulldown-text`);;
    }

    getOperator() {
        return this.getElement().$$('.mstrmojo-ui-Pulldown-text').filter(async (elem) => {
            const text = await elem.getText();
            return text.includes('By Value') || text.includes('By Rank');
        })[0];
    }


    getConditionItemByName(name) {
        return this.getElement().$$('.item').filter(async (elem) => {
            const text = await elem.getText();
            return text.includes(name);
        })[0];
    }

    getSearchInput() {
        return this.getElement().$('.mstrmojo-Box.eb-box-search input');
    }

    getElementListItems() {
        return this.getElement().$('.mstrmojo-ui-CheckList.elementsList').$$('.item');
    }

    getElementListItemsByName(name) {
        return this.getElementListItems().filter(async (elem) => {
            const text = await elem.getText();
            return text.includes(name);
        })[0];
    }

    getClearAllButton() {
        return this.getElement().$('.mstrmojo-Button.eb-clearAll');
    }

    getViewSelectedToggle() {
        return this.getElement().$('.mstrmojo-ui-ToggleButton');
    }

    getFirstValueInput() {
        return this.getElement().$$('.mstrmojo-TextBox')[0];
    }

    getLastValueInput() {
        return this.getElement().$$('.mstrmojo-TextBox')[1];
    }

    getParameterLabel() {
        return this.getElement().$$('.conditionWalk-parameterPulldown .mstrmojo-ui-Pulldown-text')[0];
    }

    getMetricLabel() {
        return this.getElement().$$('.conditionWalk-attMxPd .mstrmojo-ui-Pulldown-text')[0];
    }

    getMojoDropDown() {
        return this.$$('.mstrmojo-PopupList.ctrl-popup-list').filter(async (elem) => {
            const style = await elem.getAttribute('style');
            return style.includes('display: block');
        })[0];
    }

    getButtonByName(name) {
        return this.getElement().$$('.mstrmojo-HBox .mstrmojo-WebButton').filter(async (elem) => {
            const text = await elem.$('.mstrmojo-Button-text ').getText();
            return text.includes(name);
        })[0];
    }

    getCloseButton() {
        return this.getElement().$('.mstrmojo-Editor-close');
    }


    // Action Helper
    async addAttributeCondition(attrName, conditionPaths, value1, value2) {
        await this.addAttributeConditionWithoutApply(attrName, conditionPaths, value1, value2);
        await this.applyCondition();
    }

    async addAttributeConditionWithoutApply(attrName, conditionPaths, value1, value2) {
        await this.click({ elem: this.getBasedOn() });
        await this.click({ elem: this.getConditionItemByName(attrName) });
        if(conditionPaths) {
            for (const conditionItem of conditionPaths) {
                if(conditionItem == 'Selecting in list' || conditionItem == 'Qualification on') {
                    const currentElementBy = await this.getChooseElementByText();
                    if(currentElementBy != conditionItem) {
                        await this.click({ elem: this.getChooseElementBy() });
                        await this.click({ elem: this.getConditionItemByName(conditionItem) });
                        // add sleep here to wait for condition list reloaded
                        await this.sleep(1000);
                        console.log('Switch to elementBy:', conditionItem);
                    }
                    continue;
                }
                // add sleep here to wait for element list reloaded
                await this.sleep(500);
                await this.click({ elem: this.getConditionItemByName(conditionItem) });
                if (conditionItem === 'In List' || conditionItem === 'Not In List') {
                    await this.waitForElementVisible(this.getElementsList());
                }
            }
        }
        if (value1) {
            await this.clear({ elem: this.getFirstValueInput() });
            await this.getFirstValueInput().setValue(value1);
        }
        if (value2) {
            await this.clear({ elem: this.getLastValueInput() });
            await this.getLastValueInput().setValue(value2);
        }
    }

    async addRAConditionWithoutBasedOn(Level1List, expandLevel1List, level2List, expandLevel2List, level3List) {
        await this.waitForElementVisible(this.getElementsList());
        const el = this.getElementsList().$$('.item')[0];
        await this.waitForElementVisible(el);
        for (const level1Item of Level1List) {
            await this.sleep(500);
            await this.click({ elem: this.getConditionItemByName(level1Item) });
        }
        if (expandLevel1List) {
            for (const expandlevel1Item of expandLevel1List) {
                await this.sleep(500);
                const item = this.getConditionItemByName(expandlevel1Item);
                const el = item.$('.triangle');
                await this.click({ elem: el });
                // add sleep here to wait for condition list reloaded after expand
                await this.sleep(1000);
            }
        }
        if (level2List) {
            for (const level2Item of level2List) {
                await this.sleep(500);
                await this.click({ elem: this.getConditionItemByName(level2Item) });
            }
        }

        if (expandLevel2List) {
            for (const expandlevel2Item of expandLevel2List) {
                await this.sleep(500);
                const item = this.getConditionItemByName(expandlevel2Item);
                const el = item.$('.triangle');
                await this.click({ elem: el });
                // add sleep here to wait for condition list reloaded after expand
                await this.sleep(1000);
            }
        }

        if (level3List) {
            for (const level3Item of level3List) {
                await this.sleep(500);
                await this.click({ elem: this.getConditionItemByName(level3Item) });
            }
        }
        await this.applyCondition();
    }

    async addRACondition(basedOnName, Level1List, expandLevel1List, level2List, expandLevel2List, level3List) {
        await this.click({ elem: this.getBasedOn() });
        await this.click({ elem: this.getConditionItemByName(basedOnName) });
        await this.addRAConditionWithoutBasedOn(Level1List, expandLevel1List, level2List, expandLevel2List, level3List);
        
    }

    async addMetricCondition(metricName, conditionPaths, value1, value2) {
        await this.addMetricConditionWithoutApply(metricName, conditionPaths, value1, value2);
        await this.applyCondition();
    }

    async addMetricConditionWithoutApply(metricName, conditionPaths, value1, value2) {
        await this.click({ elem: this.getBasedOn() });
        await this.click({ elem: this.getConditionItemByName(metricName) });
        if (conditionPaths) {
            for (const conditionItem of conditionPaths) {
                if(conditionItem == 'By Rank' || conditionItem == 'By Value') {
                    const currentOperator = await this.getCurrentOperatorText();
                    if(currentOperator != conditionItem) {
                        // product issue here
                        await this.click({ elem: this.getOperator() });
                        const isOperatorDropDownVisible = await this.getConditionItemByName(conditionItem).isDisplayed();
                        if (!isOperatorDropDownVisible) {
                            console.log('Operator dropdown is not visible, click operator again');
                            await this.click({ elem: this.getOperator() });
                        }
                        await this.click({ elem: this.getConditionItemByName(conditionItem) });
                        // add sleep here to wait for condition list reloaded
                        await this.sleep(1000);
                        console.log('Switch to operator:', conditionItem);
                    }
                    continue;
                }
                await this.click({ elem: this.getConditionItemByName(conditionItem) });
                await this.sleep(500); 
            }
        }
        
        if (value1) {
            await this.getFirstValueInput().click();
            await this.clear({ elem: this.getFirstValueInput() });
            await this.getFirstValueInput().setValue(value1);
        }
        if (value2) {
            await this.getLastValueInput().click();
            await this.clear({ elem: this.getLastValueInput() });
            await this.getLastValueInput().setValue(value2);
        }
    }

    async selectParameter(parameterName) {
        await this.click({ elem: this.getParameterLabel() });
        await this.waitForElementVisible(this.getMojoDropDown());
        await this.click({ elem: this.getConditionItemByName(parameterName) });
        await this.waitForElementInvisible(this.getMojoDropDown());
    }

    async selectMetric(metricName) {
        await this.click({ elem: this.getMetricLabel() });
        await this.waitForElementVisible(this.getMojoDropDown());
        await this.click({ elem: this.getConditionItemByName(metricName) });
        await this.waitForElementInvisible(this.getMojoDropDown());
    }

    async selectParameter(parameterName) {
        await this.click({ elem: this.getParameterLabel() });
        await this.waitForElementVisible(this.getMojoDropDown());
        await this.click({ elem: this.getConditionItemByName(parameterName) });
        await this.waitForElementInvisible(this.getMojoDropDown());
    }

    async selectAttribute(attributeName) {
        await this.click({ elem: this.getMetricLabel() });
        await this.waitForElementVisible(this.getMojoDropDown());
        await this.click({ elem: this.getConditionItemByName(attributeName) });
        await this.waitForElementInvisible(this.getMojoDropDown());
    }


    async clickOnButtonByName(name) {
        await this.click({ elem: this.getButtonByName(name) });
        await this.waitForElementInvisible(this.getElement());
    }

    async applyCondition() {
        await this.clickOnButtonByName('OK');
    }

    async cancelCondition() {
        await this.clickOnButtonByName('Cancel');
    }

    async openBasedOnDropDown() {
        await this.click({ elem: this.getBasedOn() });
    }

    async chooseViewSelected(checked) {
        const isChecked = await this.isChecked(this.getViewSelectedToggle());
        if (isChecked !== checked) {
            await this.click({ elem: this.getViewSelectedToggle() });
        }

    }

    async closeConditionDialog() {
        const isOpened = await this.getElement().isDisplayed();
        if (isOpened) {
            await this.click({ elem: this.getCloseButton() });
        }
    }


    

    // asserison helper
    async getChooseElementByText() {
        return await this.getChooseElementBy().getText();
    }

    async getBasedOnDropDownElementsText() {
        const els = this.getDropDownItems();
        const text = await els.map((cell) => cell.getText());
        const rowText = await text.map((cell) => cell.trim());
        return rowText;
    }

    async getSelectedElementListItems() {
        const els = this.getElementListItems();
        if (els.length === 0) {
            return [];
        }
        const text = await els.map((cell) => cell.getText());
        const rowText = await text.map((cell) => cell.trim());
        return rowText;
    }

    async getConditionExpression() {
        const value = await this.getTitle(this.getConditionDetails());  
        return value
    }

    async getCurrentOperatorText() {
        return this.getOperator().getText();
    }
}
