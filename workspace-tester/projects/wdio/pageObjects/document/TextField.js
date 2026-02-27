import BaseComponent from '../base/BaseComponent.js';

/**
 * There might be many TextFields
 * To use this component, user can new an object and pass TextField text as parameter to all related functions
 * then we can identically locate element using getTextFieldByText(*)
 */
export default class TextField extends BaseComponent {
    constructor(){
        super();
    }

    getTextFields() {
        return this.$('body').$$('.mstrmojo-DocTextfield');
    }

    /**
     * There might be many TextField
     * We can't identically locate the element using 'BaseComponent' locator and container without using 'key'
     * To avoid using key to locate the TextField, we can only use TextField text to identically locate it
     * @param {String} text TextField text
     * @returns {ElementFinder} located element
     */
    getTextFieldByText(text) {
        const locators = this.$('body').$$('.mstrmojo-DocTextfield');
        const target = locators.filter(async (locator) => {
            const tmpText = await locator.getText();
            return tmpText === text;
        })[0];
        return target;
    }

    getFiledText() {
        return this.getTextFields()[0].getText();
    }

    getTextFieldByKey(key) {
        return this.$(`.mstrmojo-DocTextfield[k='${key}']`);
    }

    async getHeight(textFieldText) {
        const size = await this.getTextFieldByText(textFieldText).getSize();
        return size.height;
    }

    static createByText(text) {
        return new TextField(by.cssContainingText('.mstrmojo-DocTextfield', text));
    }

    async clickTextField(textFieldText) {
        return this.click(this.getTextFieldByText(textFieldText));
    }

    async clickTextFieldByKey(key, checkDocumentLoaded = true) {
        await this.click({ elem: this.getTextFieldByKey(key) });
        if (checkDocumentLoaded) {
            await this.waitForItemLoading();
        }
    }

    async getTextFiledTitle(text) {
        const el = await this.getTextFieldByText(text);
        return el.getAttribute('title');
    }

    // assertion
    async isTextPresent(text) {
        return this.getTextFieldByText(text).isDisplayed();
    }
}
