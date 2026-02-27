import BasePage from '../base/BasePage.js';

export default class SaaSExternalLinkDialog extends BasePage {
    // Element locators
    getExternalLinkErrorBox() {
        return this.$('.mstrd-MessageBox-main');
    }

    async getExternalLinkErrorTitle() {
        return this.getExternalLinkErrorBox().$('.mstrd-MessageBox-title').getText();
    }

    async getExternalLinkErrorMsg() {
        return this.getExternalLinkErrorBox().$('.mstrd-MessageBox-msg').getText();
    }

    getExternalLinkErrorBoxButton(text) {
        return this.getExternalLinkErrorBox()
            .$$('.mstrd-ActionLinkContainer-text')
            .filter(async (elem) => {
                const buttonName = await elem.getText();
                return buttonName === text;
            })[0];
    }

    getExternalLinkCheckbox() {
        return this.getExternalLinkErrorBox().$('.mstrd-SimpleCheckbox .mstrd-SimpleCheckbox-shape');
    }

    // Action helpers

    async stayHere() {
        return this.click({ elem: this.getExternalLinkErrorBoxButton('Stay Here') });
    }

    async openLink() {
        return this.click({ elem: this.getExternalLinkErrorBoxButton('Open Link') });
    }

    async selectDontWarnMeAgain() {
        return this.click({ elem: this.getExternalLinkCheckbox() });
    }

    // Assertion helpers

    async isExternalLinkBoxPresent() {
        return this.getExternalLinkErrorBox().isDisplayed();
    }
}
