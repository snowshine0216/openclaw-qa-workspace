import BasePrompt from '../base/BasePrompt.js';
import { getInputValue } from '../../utils/getAttributeValue.js';

export default class TextboxStyle extends BasePrompt {
    /****************************************************************
     * Element locator
     ****************************************************************/

    getTextBoxInput(promptElement) {
        return promptElement.$('.mstrCalendarAndTimePickerCellTextBox>input');
    }

    getTextPromptComplexAnswer(promptElement) {
        return promptElement.$('.mstrTextDivValue');
    }

    /****************************************************************
     * Action helper
     ****************************************************************/

    async clickTextBoxInput(promptElement) {
        await this.getTextBoxInput(promptElement).click();
        await this.sleep(3000); // wait for err msg show up
    }

    async inputText(promptElement, value) {
        await this.getTextBoxInput(promptElement).setValue(value);
        await this.sleep(1000);
    }

    async clearValue(promptElement, value) {
        await this.clear({ elem: this.getTextBoxInput(promptElement) }, true);
    }

    async clearAndInputText(promptElement, value) {
        await this.clear({ elem: this.getTextBoxInput(promptElement) }, true);
        await this.getTextBoxInput(promptElement).setValue(value);
        await this.enter();
        await this.sleep(1000);
    }

    /****************************************************************
     * Assertion helper
     ****************************************************************/

    async text(promptElement) {
        return getInputValue(this.getTextBoxInput(promptElement));
    }

    async checkTextPromptComplexAnswer(promptElement) {
        return this.getTextPromptComplexAnswer(promptElement).getText();
    }
}
