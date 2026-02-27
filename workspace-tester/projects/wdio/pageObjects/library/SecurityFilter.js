import BaseLibrary from '../base/BaseLibrary.js';

export default class SecurityFilter extends BaseLibrary {
    constructor() {
        super();
    }
    // Element locator
    getSecurityFilterContainer() {
        return this.$('.data-model-security-filter-modal');
    }

    getSecurityFilterBtn(text) {
        return this.getSecurityFilterContainer()
            .$$('.mstr-button-container')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(text);
            })[0];
    }

    getNewIcon() {
        return this.getSecurityFilterContainer().$('.add-filter-icon');
    }

    getNewSecurityDialog() {
        return this.$('.mstr-security-filter-dialog');
    }

    getNewSecurityFooter() {
        return this.getNewSecurityDialog().$('.mstr-security-filter-dialog--footer');
    }

    getNewSecurityBtn(text) {
        return this.getNewSecurityFooter()
            .$$('.mstr-design-button')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(text);
            })[0];
    }

    getNewQualificaitonIcon() {
        return this.getNewSecurityDialog().$('.qualification-panel-header-buttons');
    }

    getNewQualificaitonEditor() {
        return this.getNewSecurityDialog().$('.mstr-qualification-editor');
    }

    getNewQualificaitonEditorBtn(text) {
        return this.getNewQualificaitonEditor()
            .$$('.mstr-button-container')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(text);
            })[0];
    }

    getCloseIcon() {
        return this.getSecurityFilterContainer().$('.mstr-design-modal-close');
    }

    getAGHeader() {
        return this.getSecurityFilterContainer().$('.ag-header-viewport');
    }

    // Action helper

    async clickNewIcon() {
        await this.click({ elem: this.getNewIcon() });
        return this.waitForElementVisible(this.getNewSecurityDialog());
    }

    async cancelSecurityFilterDialog() {
        await this.click({ elem: this.getSecurityFilterBtn('Cancel') });
        return this.waitForElementInvisible(this.getSecurityFilterContainer());
    }

    async saveSecurityFilterDialog() {
        await this.click({ elem: this.getSecurityFilterBtn('OK') });
        return this.waitForElementInvisible(this.getSecurityFilterContainer());
    }

    async saveNewSecurity() {
        await this.click({ elem: this.getNewSecurityBtn('OK') });
        return this.waitForElementInvisible(this.getNewSecurityDialog());
    }

    async cancelNewSecurity() {
        await this.click({ elem: this.getNewSecurityBtn('Cancel') });
        return this.waitForElementInvisible(this.getNewSecurityDialog());
    }

    async clickNewQualificaiton() {
        await this.click({ elem: this.getNewQualificaitonIcon() });
        return this.waitForElementVisible(this.getNewQualificaitonEditor());
    }

    async cancelNewQualification() {
        await this.click({ elem: this.getNewQualificaitonEditorBtn('Cancel') });
        return this.waitForElementInvisible(this.getNewQualificaitonEditor());
    }

    async closeDialogue() {
        await this.click({ elem: this.getCloseIcon() });
        return this.waitForElementInvisible(this.getSecurityFilterContainer());
    }

    async waitForSecurityFilterLoading() {
        await this.waitForCurtainDisappear();
        await this.waitForElementVisible(this.getNewIcon());
        await this.waitForElementPresence(this.getAGHeader());
        return this.sleep(500);
    }

    // Assertion helper

    async isSecurityFilterDialogPresent() {
        return this.getSecurityFilterContainer().isDisplayed();
    }

    async isNewSecurityDialogPresent() {
        return this.getNewSecurityDialog().isDisplayed();
    }

    async isNewQualificationEditorPresent() {
        return this.getNewQualificaitonEditor().isDisplayed();
    }
}
