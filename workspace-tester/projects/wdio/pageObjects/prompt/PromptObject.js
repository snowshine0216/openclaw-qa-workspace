import BasePrompt from '../base/BasePrompt.js';
import CalendarStyle from './CalendarStyle.js';
import CheckboxStyle from './CheckboxStyle.js';
import PullDownStyle from './PullDownStyle.js';
import RadioButtonStyle from './RadioButtonStyle.js';
import ShoppingCartStyle from './ShoppingCartStyle.js';
import TextboxStyle from './TextboxStyle.js';
import TreeStyle from './TreeStyle.js';
import PromptSearchbox from '../common/PromptSearchbox.js';
import QualificationPullDownStyle from './QualificationPullDownStyle.js';
import PersonalAnswer from './PersonalAnswer.js';

export default class PromptObject extends BasePrompt {
    constructor() {
        super();
        Object.assign(this, {
            calendar: new CalendarStyle(),
            checkBox: new CheckboxStyle(),
            pulldown: new PullDownStyle(),
            qualPulldown: new QualificationPullDownStyle(),
            radioButton: new RadioButtonStyle(),
            shoppingCart: new ShoppingCartStyle(),
            textbox: new TextboxStyle(),
            tree: new TreeStyle(),
            searchbox: new PromptSearchbox(),
            personalAnswer: new PersonalAnswer(),
        });
    }

    getMessage(promptElement) {
        if (!this.isWeb()) {
            return promptElement.$('.mstrPromptQuestionMessage.icon-warning');
        } else {
            return promptElement.$('.mstrPromptQuestionMessage');
        }
    }

    async waitForMessage(promptElement) {
        return await this.waitForElementVisible(
            this.getMessage(promptElement),
            30000,
            'Warning message is not displayed.'
        );
    }

    async getWarningMsg(promptElement) {
        return this.getMessage(promptElement).getText();
    }

    async isMessagePresent(promptElement) {
        return this.getMessage(promptElement).isDisplayed();
    }

    async isInvalidAnswer(promptElement) {
        await this.sleep(4000); // Error msg appears after 3 seconds
        const msg = await this.getWarningMsg(promptElement);
        return msg.includes('invalid answer');
    }

    async getItemCountText(promptElement) {
        return promptElement.$('.mstrFetchControlText').getText();
    }

    async goToFirstPage(promptElement) {
        (
            await this.safeGetElement(promptElement.$('.mstrBGIcon_fetchFirst'), 'First button is not displayed.')
        ).click();
        await this.waitForElementInvisible(this.shoppingCart.getAvailableReadyState(promptElement));
        return this.sleep(1000);
    }

    async goToPreviousPage(promptElement) {
        (
            await this.safeGetElement(promptElement.$('.mstrBGIcon_fetchPrevious'), 'Previous button is not displayed.')
        ).click();
        await this.waitForElementInvisible(this.shoppingCart.getAvailableReadyState(promptElement));
        return this.sleep(1000);
    }

    async goToNextPage(promptElement) {
        (await this.safeGetElement(promptElement.$('.mstrBGIcon_fetchNext'), 'Next button is not displayed.')).click();
        await this.waitForElementInvisible(this.shoppingCart.getAvailableReadyState(promptElement));
        return this.sleep(3000);
    }

    async goToLastPage(promptElement) {
        (await this.safeGetElement(promptElement.$('.mstrBGIcon_fetchLast'), 'Last button is not displayed.')).click();
        await this.waitForElementInvisible(this.shoppingCart.getAvailableReadyState(promptElement));
        return this.sleep(3000);
    }

    async clickItemCountText(promptElement) {
        (await this.safeGetElement(promptElement.$('.mstrFetchControlText'), 'Control Text is not displayed.')).click();
        return this.sleep(3000);
    }
}
