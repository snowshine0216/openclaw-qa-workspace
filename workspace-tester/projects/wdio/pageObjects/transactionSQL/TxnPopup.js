import DossierMojoEditor from '../authoring/DossierMojoEditor.js';

export default class TxnPopup extends DossierMojoEditor {
    getTransactionPausedPopup() {
        return this.$('.data-pause-alert:not([style*="display: none"])');
    }

    getTransactionPausedPopupMsg() {
        return this.getTransactionPausedPopup().$('.data-pause-msg');
    }

    getTransactionPausedPopupButton(option) {
        return this.getTransactionPausedPopup().$(`.mstrmojo-Button-text:contains('${option}')`);
    }

    getCheckboxWithTitle(title) {
        return this.$(`.mstrmojo-Label strong:contains('${title}')`)
            .closest('.mstrmojo-Editor-content')
            .next('.mstrmojo-Editor-buttons')
            .$('.mstrmojo-CheckBox');
    }

    async selectTransactionPausePopupOption(option) {
        const button = await this.getTransactionPausedPopupButton(option);
        await this.clickOnElement(button);
    }

    async clickOnCheckboxWithTitle(title) {
        const el = await this.getCheckboxWithTitle(title);
        await browser.wait(EC.visibilityOf(el));
        await this.clickOnElement(el);
    }

    async getDeleteButtonByRow(row) {
        return $$("//div[contains(@class, 'delete-column-container')]//button[contains(@class,'txn-insert-remove')]")[
            parseInt(row, 10) - 1
        ];
    }
}
