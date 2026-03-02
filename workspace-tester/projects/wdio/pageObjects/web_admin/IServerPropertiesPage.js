import WebBasePage from './../base/WebBasePage.js';

// TODO
// Test create trust relationship
// Test delete trust relationship
export default class IServerPropertiesPage extends WebBasePage {
    constructor() {
        super();
    }

    // element locator
    getSetupTrustRelationshipBtn() {
        return this.$('input[value="Setup..."]');
    }

    getCancelSaveTrustRelationshipBtn() {
        return this.$('input[id="60007"]');
    }

    getCreateTrustRelationshipBtn() {
        return this.$('input[id="60014"]');
    }

    getSavePropertiesBtn() {
        return this.$('input[id="60009"]');
    }

    getDeleteBtn() {
        return this.$('input[value="Delete"]');
    }

    get60015Btn() {
        // Set up or delete trust relationship button, they use same ID
        return this.$('input[id="60015"]');
    }

    getDeleteTrustRelationshipBtn() {
        return this.$('input[id="60016"]');
    }

    getUserNameTextField() {
        return this.$('input[id="userID"]');
    }

    getPasswordTextField() {
        return this.$('input[name="password"]');
    }

    getAlert() {
        return this.$('.serverProperties-error-desc');
    }

    // action helper

    /**
     * Click setup Trust relationship button to setup trust releationship
     * @param {String} username iServer username
     * @param {String} password iServer password
     */

    async createTrustRelationship(username, password) {
        await this.clickSetupCreateTrustRelationshipBtn();
        await this.waitForElementVisible(this.getUserNameTextField());
        await this.click({ elem: this.getUserNameTextField() });
        await this.clear({ elem: this.getUserNameTextField() });
        await this.getUserNameTextField().setValue(username);
        await this.waitForElementVisible(this.getPasswordTextField());
        await this.click({ elem: this.getPasswordTextField() });
        await this.clear({ elem: this.getPasswordTextField() });
        await this.getPasswordTextField().setValue(password);
        await this.clickCreateTrustRelationshipBtn();
        return this.clickSaveBtn();
    }

    async deleteTrustRelationship(username, password) {
        await this.clickDeleteBtn();
        await this.waitForElementVisible(this.getUserNameTextField());
        await this.click({ elem: this.getUserNameTextField() });
        await this.clear({ elem: this.getUserNameTextField() });
        await this.getUserNameTextField().setValue(username);
        await this.waitForElementVisible(this.getPasswordTextField());
        await this.click({ elem: this.getPasswordTextField() });
        await this.clear({ elem: this.getPasswordTextField() });
        await this.getPasswordTextField().setValue(password);
        await this.clickDeleteTrustRelationshipBtn();
        return this.clickSaveBtn();
    }

    async basicDeleteTrustRelationship(username, password) {
        await this.clickDeleteBtn();
        await this.waitForElementVisible(this.getUserNameTextField());
        await this.click({ elem: this.getUserNameTextField() });
        await this.clear({ elem: this.getUserNameTextField() });
        await this.getUserNameTextField().setValue(username);
        await this.waitForElementVisible(this.getPasswordTextField());
        await this.click({ elem: this.getPasswordTextField() });
        await this.clear({ elem: this.getPasswordTextField() });
        await this.getPasswordTextField().setValue(password);
        await this.clickDeleteTrustRelationshipBtn();
    }

    async isTrustedRelationshipExist() {
        return this.getDeleteBtn().isDisplayed();
    }

    async cancelCreateTrustRelationship() {
        await this.clickSetupCreateTrustRelationshipBtn();
        await this.clickCancelSaveTrustRelationshipBtn();
        return this.clickSaveBtn();
    }

    async clickSetupCreateTrustRelationshipBtn() {
        await this.waitForElementVisible(this.getSetupTrustRelationshipBtn());
        return this.click({ elem: this.getSetupTrustRelationshipBtn() });
    }

    async clickDeleteBtn() {
        await this.waitForElementVisible(this.getDeleteBtn());
        return this.click({ elem: this.getDeleteBtn() });
    }

    async clickDeleteTrustRelationshipBtn() {
        await this.waitForElementVisible(this.getDeleteTrustRelationshipBtn());
        return this.click({ elem: this.getDeleteTrustRelationshipBtn() });
    }

    async clickCancelSaveTrustRelationshipBtn() {
        await this.waitForElementVisible(this.getCancelSaveTrustRelationshipBtn());
        return this.click({ elem: this.getCancelSaveTrustRelationshipBtn() });
    }

    async clickCreateTrustRelationshipBtn() {
        await this.waitForElementVisible(this.getCreateTrustRelationshipBtn());
        return this.click({ elem: this.getCreateTrustRelationshipBtn() });
    }

    async clickSaveBtn() {
        await this.waitForElementVisible(this.getSavePropertiesBtn());
        return this.click({ elem: this.getSavePropertiesBtn() });
    }

    // assertion helper
    async trustRelationshipCreated() {
        return this.getDeleteBtn().isDisplayed();
    }

    async trustRelationshipNotCreated() {
        return this.getSetupTrustRelationshipBtn().isDisplayed();
    }

    async getBtnValue() {
        return this.get60015Btn().getAttribute('value');
    }

    async getAlertText() {
        await this.waitForElementVisible(this.getAlert());
        return this.getAlert().getText();
    }
}
