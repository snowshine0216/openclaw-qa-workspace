import BasePreference from './BasePreference.js';

export default class FolderBrowsingPage extends BasePreference {
    // element locator
    getShowFooterPathCheckbox() {
        return this.$('#showFooterPath');
    }

    getHideMyReportsCheckbox() {
        return this.$('#hideMyReports');
    }

    // action helper
    async checkShowFooterPath() {
        await this.check(this.getShowFooterPathCheckbox());
    }

    async checkHideMyReports() {
        await this.check(this.getHideMyReportsCheckbox());
    }

    // assertion helper
    async isShowFooterPathChecked() {
        return this.getShowFooterPathCheckbox().isSelected();
    }

    async isHideMyReportsChecked() {
        return this.getHideMyReportsCheckbox().isSelected();
    }
}
