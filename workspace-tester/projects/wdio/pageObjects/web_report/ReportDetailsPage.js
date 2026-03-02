import WebBasePage from '../base/WebBasePage.js';

export default class ReportDetailsPage extends WebBasePage {
    getCloseIcon() {
        return $('.mstrIconNoTextDecoration.mstrVerticalLine');
    }

    getAdvanvedBtn() {
        return $('.buttonbarRight .mstrButton');
    }

    getReportName() {
        return $('.mstrPanelTitleBar span').getText();
    }

    getDetails() {
        return $('.advancedDetails');
    }

    getSql() {
        return $('.sql');
    }

    getAdvancedDetails() {
        return $('#expandAdvancedDetails_div');
    }

    getAdvancedRows() {
        return this.getAdvancedDetails().$('.rows span');
    }

    getAdvancedCols() {
        return this.getAdvancedDetails().$('.cols span');
    }

    getReportDetails() {
        return $('.mstrTransform .reportDetails');
    }

    getReportDescription() {
        return this.getReportDetails().$('.description>span').getText();
    }

    getDescriptionFromAdvanced() {
        return this.getReportDetails().$('.divReportDetails>a').getText();
    }

    // Action helper

    async close() {
        return this.click({ elem: this.getCloseIcon() });
    }

    async clickAdvanvcedBtn() {
        return this.click({ elem: this.getAdvanvedBtn() });
    }

    async getAdvancedRowsNum() {
        return Number(await this.getAdvancedRows().getText());
    }

    async getAdvancedColsNum() {
        return Number(await this.getAdvancedCols().getText());
    }

    async waitForDetailsPageLoaded() {
        return this.waitForElementVisible(this.getDetails());
    }

    async waitForReportDetailsLoaded() {
        return this.waitForElementVisible(this.getReportDetails());
    }
}
