import BaseComponent from './BaseComponent.js';

export default class BasePageDialog extends BaseComponent {
    // Element locator
    getOKButton() {
        return this.getElement().$('input[value="OK"]');
    }

    getCancelButton() {
        return this.getElement().$('input[value="Cancel"]');
    }

    getCloseButton() {
        return this.getElement().$('div[tooltip="Close"]');
    }

    // Action helper

    async confirm() {
        await this.click({ elem: this.getOKButton() });
    }

    async cancel() {
        await this.click({ elem: this.getCancelButton() });
    }

    async close() {
        await this.click({ elem: this.getCloseButton() });
    }

    // Assertion helper

    async isDialogPresent() {
        return this.getElement().isDisplayed();
    }
}
