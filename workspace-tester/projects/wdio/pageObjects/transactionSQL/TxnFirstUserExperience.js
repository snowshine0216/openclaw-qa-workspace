import DossierMojoEditor from '../authoring/DossierMojoEditor.js';
//import DocAuthBasePage from '../base/DocAuthBasePage.js';

export default class TxnFirstUserExperience extends DossierMojoEditor {
    constructor() {
        super();
        //this.docAuthBasePage = new DocAuthBasePage();
    }

    get txnFirstExperienceDialog() {
        return $(`//div[contains(@class, 'first-user-experience')]`);
    }

    getFirstExpString(expString) {
        return $(
            `//div[contains(@class, 'mstrmojo-Editor-content')]//div[contains(@class, 'txn-first-user-exp')][text()="${expString}"]`
        );
    }

    getButtonOnDialog(name) {
        if (name === 'Got it') {
            return this.txnFirstExperienceDialog.$(
                `.//div[contains(@class, 'first-exp-btns')]//div[contains(@class, 'mstrmojo-Button') and contains(@class, 'hot')]//div`
            );
        }
        return this.txnFirstExperienceDialog.$(
            `.//div[contains(@class, 'first-exp-btns')]//div[contains(@class, 'mstrmojo-Button-text')][text()='${name}']`
        );
    }

    async clickDialogButton(name) {
        const el = this.getButtonOnDialog(name);
        await this.clickOnElement(el);
    }

    async dismissDialogIfAppear() {
        const el = this.txnFirstExperienceDialog;
        const isPresent = await this.docAuthBasePage.isElementVisible(el, 500);
        if (isPresent) {
            await this.clickDialogButton('Got it');
        }
    }

    async getDeleteButtonByRow(row) {
        return $$("//div[contains(@class, 'delete-column-container')]//button[contains(@class,'txn-insert-remove')]")[
            parseInt(row, 10) - 1
        ];
    }
}
