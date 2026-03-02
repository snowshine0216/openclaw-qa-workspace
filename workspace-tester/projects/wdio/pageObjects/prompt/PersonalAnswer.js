import BasePrompt from '../base/BasePrompt.js';
import { switchToMainWindow } from '../../utils/index.js';

export default class PersonalAnswer extends BasePrompt {
    /** * Single personal answer */
    getSaveOneAnswerCheckbox(promptElement) {
        return promptElement.$('.mstrPromptSaveOneAnswerCheckbox');
    }

    async clickRememberThisAnswer(promptElement) {
        // either check or uncheck
        return this.getSaveOneAnswerCheckbox(promptElement).click();
    }

    /** * Multiple personal answers */

    getSaveManyAnswersCheckbox(promptElement) {
        return promptElement.$('.mstrPromptSaveManyAnswersCheckbox');
    }

    getNameInput(promptElement) {
        return promptElement.$('input[type="textbox"]');
    }

    getLoadAnswersIcon(promptElement) {
        return promptElement.$('.mstrPromptSaveManyAnswers').$('.mstrListPulldown');
    }

    getPersonalAnswerPopup(promptElement) {
        return promptElement.$('#PromptSavedAnswersSimplePopup');
    }

    getAnswerList(promptElement) {
        return this.getPersonalAnswerPopup(promptElement).$$('.mstrListBlockItemName');
    }


    getPersonalAnswerInList(promptElement, name) {
        const allAnswer = this.getAnswerList(promptElement);
        return allAnswer.filter(async (elem) => {
            const text = await elem.getText();
            return text === name;
        })[0];
    }

    getSavedAnswersPopup(promptElement) {
        return promptElement.$('.mstrPromptSavedAnswersPopup.mstrAsPopup');
    }

    getAnswerInSavedAnswersPopup(promptElement, name) {
        const savedAnswer = this.getSavedAnswersPopup(promptElement).$$('.mstrListBlockItemName');
        return savedAnswer.filter(async (elem) => {
            const text = await elem.getText();
            return text === name;
        })[0];
    }

    getButton(promptElement, name) {
        return promptElement.$(`.mstrToolButtonRounded>img[title="${name}"]`);
    }

    async addPersonalAnswer(promptElement, answerName) {
        await this.click({ elem: this.getSaveManyAnswersCheckbox(promptElement) });
        await this.clear({ elem: this.getNameInput(promptElement) }, true);
        await this.getNameInput(promptElement).setValue(answerName);
    }

    async openPersonalAnswers(promptElement) {
        await this.getLoadAnswersIcon(promptElement).click();
        return this.waitForElementPresence(this.getPersonalAnswerPopup(promptElement));
    }

    async loadPersonalAnswer(promptElement, name) {
        await this.getPersonalAnswerInList(promptElement, name).click();
    }

    async openSavedAnswersPopup(promptElement) {
        await this.openPersonalAnswers(promptElement);
        await this.getLink(promptElement, 'More options...').click();
        await this.waitForElementPresence(this.getSavedAnswersPopup(promptElement));
    }

    async renamePersonalAnswer(promptElement, oldName, newName) {
        await this.getAnswerInSavedAnswersPopup(promptElement, oldName).click();
        const elem = this.getButton(promptElement, 'Rename');
        while (!(await browser.isAlertOpen())) {
            await elem.click();
            await browser.pause(2000);
        }

        await browser.sendAlertText(newName);
        await this.sleep(2000);

        if (browser.isAlertOpen()) {
            browser.acceptAlert();
        }
        await switchToMainWindow();
    }

    async deletePersonalAnswer(promptElement, name) {
        await this.getAnswerInSavedAnswersPopup(promptElement, name).click();
        const elem = this.getButton(promptElement, 'Delete');
        while (!(await browser.isAlertOpen())) {
            await elem.click();
            await this.sleep(2000);
        }

        if (browser.isAlertOpen()) {
            browser.acceptAlert();
        }
        await switchToMainWindow();
        return this.sleep(2000); // wait for delete to complete
    }

    // assertion helper
    async personalAnswerCount(promptElement) {
        await this.openPersonalAnswers(promptElement);
        return this.getAnswerList(promptElement).length;
    }

    async isPersonalAnswerPresent(promptElement) {
        return this.getSaveOneAnswerCheckbox(promptElement).isDisplayed();
    }
}
