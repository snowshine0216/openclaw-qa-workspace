import BasePreference from './BasePreference.js';

export default class OfficePage extends BasePreference {
    // element locator
    getPreferenceList() {
        return this.$('.preferenceList tbody td table');
    }

    getRefreshDocumentCheckbox() {
        return this.$(`input[name='officeExportRefresh']`);
    }

    getRefreshReportCheckbox() {
        return this.$('#exportReportOfficeRefresh');
    }

    // action helper
    async uncheckRefreshDocument() {
        await this.uncheck(this.getRefreshDocumentCheckbox());
    }

    async checkRefreshReport() {
        await this.check(this.getRefreshReportCheckbox());
    }

    // assertion helper
    async isRefreshDocumentChecked() {
        return this.getRefreshDocumentCheckbox().isSelected();
    }

    async isRefreshReportChecked() {
        return this.getRefreshReportCheckbox().isSelected();
    }
}
