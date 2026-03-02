import BasePage from '../base/BasePage.js';

export default class KpiTile extends BasePage {
    // Element locator

    getKpiTile(name) {
        return this.$(
            `//span[contains(@class, "kpi-tile__name") and contains(text(), "${name}")]//ancestor::div[contains(@class, "kpi-tile")]`
        );
    }

    getInfoPane() {
        return this.$('.info-pane-container');
    }

    getDeleteButton() {
        return this.getInfoPane().$('.mstrd-WatchCardList-deleteIcon');
    }

    getEditButton() {
        return this.getInfoPane().$('.mstr-info-edit-icon');
    }

    getRemoveConfirmationDialog() {
        return this.getInfoPane().$('.mstrd-SliderConfirmDialog-content');
    }

    getRemoveConfirmationDialogYesButton() {
        return this.getRemoveConfirmationDialog().$('//button[contains(text(), "Yes")]');
    }

    getInsightsNotificationButton() {
        return this.$('.mstr-insights-icon');
    }

    getKpiInsightsNotificationButton() {
        return this.$('.mstr-insights-icon.mstr-insights-icon--in-kpi-grid-view');
    }

    getOpenDossierButton() {
        return this.$('.mstr-open-dossier-icon.mstr-open-dossier-icon--in-kpi-grid-view');
    }

    getOpenDossierButtonFromInfoPane() {
        return this.getInfoPane().$('.mstr-open-dossier-icon');
    }

    // Action method

    async clickKpiTile(name) {
        await this.click({ elem: this.getKpiTile(name) });
    }

    async clickEditButton() {
        await this.click({ elem: this.getEditButton() });
    }

    async deleteInsight() {
        await this.click({ elem: this.getDeleteButton() });
        await this.click({ elem: this.getRemoveConfirmationDialogYesButton() });
    }
}
