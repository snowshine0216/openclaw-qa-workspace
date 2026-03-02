import BasePage from './BasePage.js';
import PromptEditor from '../common/PromptEditor.js';

export default class BasePrompt extends BasePage {
    constructor() {
        super();
        this.promptEditor = new PromptEditor();
    }

    // Element locator

    //--------------------Prompt List-----------------------------

    getTitle(questionFinder) {
        return questionFinder.$('.mstrPromptQuestionTitleBarTitle');
    }

    getIndex(questionFinder) {
        return questionFinder.$('.mstrPromptQuestionTitleBarIndex');
    }

    // async getPromptByName(promptName) {
    //     return this.findOne(
    //         this.promptEditor.getPromptContainer().$$("div.mstrPromptQuestion"),
    //         async (elem) => {
    //             const name = await this.getTitle(elem).getText();
    //             return name === promptName;
    //         }
    //     );
    // }

    getPromptByName(promptName) {
        const allPromptName = this.$$('div.mstrPromptQuestion');
        return allPromptName.filter(async (elem) => {
            const name = await this.getTitle(elem).getText();
            return name.trim() === promptName.trim();
        })[0];
    }

    getItemByTextOfGivenItemList(itemList, text) {
        return itemList.filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === text;
        })[0];
    }

    // AQ: Get 'Browse values...'
    // MQ: Get 'Choose attributes...'
    getLink(promptElement, linkText) {
        return promptElement.$$('.mstrTextLinkAnchor').filter(async (elem) => {
            const text = await elem.getText();
            return text === linkText;
        })[0];
    }

    //--------------------Prompt Index-----------------------------

    getPrompts() {
        return this.promptEditor
            .getIndexTable()
            .$$('tr[class^=mstrPromptTOCListItem]');
    }

    getPromptByIndex(index) {
        return this.promptEditor
            .getIndexTable()
            .$$('tr[class^=mstrPromptTOCListItem]')
            .filter(async (elem) => {
                const id = await elem.$('td.mstrPromptTOCListItemIndex').getText();
                return id === index;
            })[0];
    }

    getPromptByTitle(title) {
        return this.promptEditor
            .getIndexTable()
            .$$('tr[class^=mstrPromptTOCListItem]')
            .filter(async (elem) => {
                const text = await elem.$('.mstrPromptTOCListItemTitle').getText();
                console.log('Prompt title found: ' + text);
                return text === title;
            })[0];
    }

    getPromptTitleByIndex(index) {
        return this.getPromptByIndex(index).$('.mstrPromptTOCListItemTitle');
    }

    getPromptRequiredStatusByIndex(index) {
        return this.getPromptByIndex(index).$('.mstrPromptTOCListItemTitleRequiredLabel');
    }

    // Action helper

    async waitForPromptDetail(promptName) {
        const prompt = await this.getPromptByName(promptName);
        await this.waitForElementVisible(prompt, {
            timeout: this.DEFAULT_LOADING_TIMEOUT,
            msg: 'Prompt Question was not displayed.',
        });
        return this.sleep(1000);
    }

    async selectPromptByIndex({ index, promptName }) {
        let element = this.getPromptByIndex(index);
        if (this.isSafari()) {
            element = this.getPromptTitleByIndex(index);
        }
        // tr tag doesn't has click() on safari
        await element.click();
        await this.sleep(2000); // wait page scroll
        return this.waitForPromptDetail(promptName);
    }

    async selectPromptByTitle(promptTitle) {
        let element = this.getPromptByTitle(promptTitle);
        if (this.isSafari()) {
            element = element.$('.mstrPromptTOCListItemTitle');
        }
        // tr tag doesn't has click() on safari
        await element.click();
        await this.sleep(2000); // wait page scroll
        return this.waitForPromptDetail(promptTitle);
    }

    // Assertion helper

    async isAnswerRequired(index) {
        return (await this.getPromptRequiredStatusByIndex(index).getText()) === '*';
    }

    async errorMsg(promptElement) {
        const el = promptElement.$('.mstrPromptQuestionMessage');
        return el.getText();
    }

    async isErrorDisplayed(promptElement) {
        const el = promptElement.$('.mstrPromptQuestionMessage');
        return el.isDisplayed();
    }

    async getPromptsNumber() {
        await this.waitForElementVisible(this.promptEditor.getPromptEditor());
        const prompts = await this.getPrompts();
        return prompts.length;
    }
}
