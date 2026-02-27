import BasePage from '../base/BasePage.js';
import LibraryPage from './LibraryPage.js';
// import { errorLog } from '../../config/consoleFormat.js';
import HamburgerMenu from '../common/HamburgerMenu.js';

export default class libraryConditionalDisplay extends BasePage {
    constructor() {
        super();
        this.hamburgerMenu = new HamburgerMenu();
        this.libraryPage = new LibraryPage();
    }

    // Element locator
    getLayerElementList() {
        return this.$('.ant-tree.ant-tree-directory');
    }

    getRightClickMenu() {
        return this.$('.mstrmojo-unit-container-menu');
    }

    getConditionalDisplayDialog() {
        return this.$('.cf-editor');
    }
    
    getElementByContent(option) {
        return this.$(`[aria-label = '${option}']`);
    }

    getConditionElement(option) {
        return this.getConditionalDisplayDialog().$(`//span[@title='${option}']`).$('..');
    }

    async getConditionTitle(option) {
        const conditionNode = this.getConditionalDisplayDialog().$(`//span[text()='${option}']`).$('..');
        await this.hover({ elem: conditionNode });
        return conditionNode.getAttribute('title');
    }
    getConditionElementDelete(option) {
        return this.getConditionElement(option).$('.mstrmojo-del');
    }

    getAddConditionButton() {
        return this.getConditionalDisplayDialog().$('.mstrmojo-add-cond');
    }

    getConditionalDisplayDialogCancelButton() {
       return this.getConditionalDisplayDialog().$('.mstrmojo-Button-text=Cancel');
    }

    getConditionalDisplayDialogApplyButton() {
        return this.getConditionalDisplayDialog().$('.mstrmojo-Button-text=Apply');
    }

    getConditionalDisplayDialogOKButton() {
        return this.getConditionalDisplayDialog().$('.mstrmojo-Button-text=OK');
    }
     
    getNewConditionDialog() {
        return this.$('.mstrmojo-vi-ui-ConditionEditor');
    }

    getNewConditionCancelButton() {
        return this.getNewConditionDialog().$('.mstrmojo-Button-text=Cancel');
    }

    getConditionDeleteButton() {
        return this.getConditionalDisplayDialog().$('.delete');
    }

/*
    getConditionRelationButtonByName(option) {
        //return this.getConditionalDisplayDialog().$('.mstrmojo-text.mstrmojo-andor');
        return this.getConditionalDisplayDialog().$(`//span[contains(@class, 'mstrmojo-text') and contains(text(), '${option}')]`);
    }
*/

    getConditionRelationMenu() {
      //  return this.getConditionalDisplayDialog().$('.mstrmojo-ListBase.mstrmojo-ui-Menu');
        return this.getConditionalDisplayDialog().$('.mstrmojo-ui-Menu-item-container');
    }

    getNewConditionDialog() {
        return this.$('.mstrmojo-vi-ui-ConditionEditor');
    }

    // Cannot work correctly
    getNewConditionElement(option) {
       // return this.getNewConditionDialog().$(`//div[contains(@class, ".item") and contains(text(), '${option})]`);
       //return this.getNewConditionDialog().$(`.item='${option}'`);
       return this.$(`//div[contains(@class, 'item') and contains(text(), '${option}')]`);
      // return this.$('//div[@role="menuitem" and contains(text(), "Your Text Content")]');
    }

    /*
    getElementInListByName(option) {
        //return this.$(`//span[contains(@class, 'text') and contains(text(), '${option}')]`);
        //return this.$(`.text='${option}'`);
        return this.getNewConditionDialog().$(`//span[contains(@class, 'text') and contains(text(), '${option}')]`);
    }

    */
   
    // Action helper
    async chooseElement(option) {
        await this.click({elem: this.getElementByContent(option)});
    }

    // Open conditional formatting menu by right click element.
    async OpenElementMenu(option) {
        await this.rightClick({elem: this.getElementByContent(option)});
        await this.waitForElementVisible(this.getElementByContent(option), {
            timeout: 5000,
            msg: 'Element Menu is not open.',
        });
    }

    async openConditionalDisplayDialog() {
        await this.click({elem: this.$('//div[contains(text(), "Conditional Display...")]')});
        await this.waitForElementVisible(this.$('.cf-editor'), {
            timeout: 5000,
            msg: 'Conditional Display Dialog is not open.',
        });
    }

    async closeConditionalDisplayDialog() {
        await this.click({elem: this.getConditionalDisplayDialogCancelButton()});
    }

    async applyConditionalDisplaySettings() {
        await this.click({elem: this.getConditionalDisplayDialogApplyButton()});
    }

    async clickConditionalDisplayOKButton() {
        await this.click({elem: this.getConditionalDisplayDialogOKButton()});
    }

    async hoverOnConditionName(option) {
        await this.hover({elem: this.getConditionElement(option)});
    }

    async IsConditionalDisplayDialogButtonEnabled(buttonName) {
        const buttonTextElem = await this.getConditionalDisplayDialog().$(`.mstrmojo-Button-text=${buttonName}`);
        const buttonDiv = await buttonTextElem.$('..');
        const className = await buttonDiv.getAttribute('class');
        return !className.includes('disabled');
    }
	
    async openNewConditionDialog(option) {
        await this.hover({elem: this.getConditionElement(option)});
        await this.waitForElementVisible(this.getAddConditionButton(), {
            timeout: 5000,
            msg: 'Add Condition Button does not appear.',
        });
        await this.click({elem: this.getAddConditionButton()});
        await this.waitForElementVisible(this.getNewConditionDialog(), {
            timeout: 5000,
            msg: 'New Condition Dialog does not appear.',
        });
    }

    async closeNewConditionDialog() {
        await this.click({elem: this.getNewConditionCancelButton()});
    }

    // Delete all conditions
    async deleteCondition() {
        await this.click({elem: this.getConditionDeleteButton()});
    }

    // Delete one of conditions by element name
    async deleteConditionByElement(option) {
        await this.hover({elem: this.getConditionElement(option)});
        await this.waitForElementVisible(this.getConditionElementDelete(option), {
            timeout: 5000,
            msg: 'Delete Button does not appear.',
        });
        await this.click({elem: this.getConditionElementDelete(option)});
    }

/*
    async openConditionalRelationDropdown(option) {
        await this.waitForElementVisible(this.getConditionRelationButtonByName(option), {
            timeout: 5000,
            msg: 'Condition relation button does not appear.',
        });
        await this.click({elem: this.getConditionRelationButtonByName(option)});
    }

    // Select condition relation: AND/OR/AND NOT/OR NOR
    async selectConditionRelation(option) {
        await this.waitForElementVisible(this.getConditionRelationMenu(), {
            timeout: 5000,
            msg: 'Condition relation menu does not appear.',
        });
        await this.click({elem: this.getConditionRelationMenu().$(`.mtxt='${option}'`)});
    }
*/

    async selectNewConditionElement(option) {
        await this.click({elem: this.getNewConditionElement(option)});
    }

/*    
    async selectElementInList(option) {
        await this.waitForElementVisible(this.getElementInListByName(option), {
            timeout: 5000,
            msg: 'Target element does not appear.',
        });
        await this.click({elem: this.getElementInListByName(option)});
    }
*/


}