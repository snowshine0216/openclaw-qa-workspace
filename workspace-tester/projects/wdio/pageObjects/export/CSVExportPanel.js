import BasePage from '../base/BasePage.js';

export default class ExportToCSV extends BasePage {
    getExportCSVPanel() {
        return this.$('.mstrd-DossierCsvPanel');
    }

    getReportCsvPanel() {
        return this.$('.mstrd-ReportCsvPanel');
    }

    getExportButton() {
        return this.getExportCSVPanel().$('.mstrd-Button--primary');
    }

    getReportExportButton() {
        return this.getReportCsvPanel().$('.mstrd-Button--primary');
    }

    getCSVRangeSetting() {
        return this.$('label=Range').$('..').$('.mstrd-DropDownButton');
    }

    getRangeDropDownContents() {
        return this.$('.mstrd-DropDown-content');
    }

    getRangeAll() {
        return this.$('.mstrd-Tree-all .mstrd-TriStateCheckbox');
    }

    getArrowByChapterName(name) {
        return this.$(`//div[text()='${name}']`).$('..').$('..').$('..').$('.icon-menu-arrow');
    }

    getCheckboxByPageName(name) {
        return this.$(`//div[text()='${name}']`).$('..');
    }

    getCheckboxByChapterName(name) {
        return this.$(`//div[text()='${name}']`).$('..');
    }

    getPageByName(name) {
        return this.$(`//div[text()='${name}']`).$('..').$('..').$('..').$('..');
    }

    getOnlyButtonByPageName(name) {
        return this.$(`//div[text()='${name}']`).$('..').$('..').$('.mstrd-TreeOption-keepOnly');
    }

    getOnlyButtonByChapterName(name) {
        return this.$(`//div[text()='${name}']`).$('..').$('..').$('.mstrd-TreeOption-keepOnly');
    }

    getChapterByName(name) {
        return this.$(`//div[text()='${name}']`).$('..').$('..');
    }

    getInfoWindowExportButton() {
        return this.$('.mstrd-ExportPanelInLibrary-submitButton');
    }

    getCSVDelimiterDropdown() {
        return this.$('label=Delimiter').$('..').$('.icon-menu-arrow');
    }

    getDelimiterOption(option) {
       // return this.$('label=Delimiter').$('..').$(`//div[contains(text(), '${option}}')]`);
        return this.$(`//div[text()='${option}']`);
    }

    getDelimiterInput() {
        return this.$('.mstrd-ExportPanel-options').$('.mstrd-Input');
    }

    getInfoWindowCSVExportDialog() {
        return this.$('.mstrd-ExportPanelInLibrary-content');
    }
    
    getExportPageByInfoCheckbox() {
        return this.$(`//div[contains(text(), 'information')]`);
    }

    getExpandPageByCheckbox() {
        return this.$(`//div[contains(text(), 'Expand')]`);
    }

    getIWExportCSVButton() {
        return this.$('.mstr-menu-icon.icon-share_csv');
    }

    getContextMenu() {
        return this.$('.mstrd-ContextMenu.mstrd-DossierContextMenu');
    }

    getContextMenuShareItem() {
        return this.getContextMenu().$('.mstrd-DossierContextMenu-submenu--share');
    }

    getContextMenuExportCsvItem() {
        //return this.$('//span[contains(@class, 'ant-dropdown-menu-title-content') and contains(text(),"CSV")]').$('..');
        return this.$(`//span[contains(@class, 'ant-dropdown-menu-title-content') and text()='Export to CSV']`);
    }

    async inputDelimiter(option) {
        (await this.getDelimiterInput()).setValue(option);
        return this.sleep(500);
    }

    async clickCSVDelimiterDropdown() {
        await this.getCSVDelimiterDropdown().click();
    }

    async clickDelimiterOption(option) {
        await this.getDelimiterOption(option).click();
    }

    async clickCSVRangeSetting() {
        await this.getCSVRangeSetting().click();
    }

    async clickExportButton() {
        await this.waitForElementVisible(this.getExportButton());
        return this.getExportButton().click();
    }

    async clickRangeDropdown() {
        const range = this.$('.mstrd-TreeSelect').$('.icon-menu-arrow');
        await this.waitForElementVisible(range);
        await range.click();
    }

    async clickRangeAll() {
        await this.getRangeAll().click();
    }

    async clickArrowByChapterName(name) {
        await this.getArrowByChapterName(name).click();
    }

    async clickCheckboxByPageName(name) {
        await this.getCheckboxByPageName(name).click();
    }

    async clickCheckboxByChapterName(name) {
        await this.getCheckboxByChapterName(name).click();
    }

    async clickOnlyByPageName(name) {
        await this.hover({ elem: this.getPageByName(name) });
        await this.getOnlyButtonByPageName(name).click();
    }

    async clickOnlyByChapterName(name) {
        await this.hover({ elem: this.getChapterByName(name) });
        await this.getOnlyButtonByChapterName(name).click();
    }

    async clickInfoWindowExportButton() {
        await this.getInfoWindowExportButton().click();
    }

    async clickExportPageByInfoCheckbox() {
        await this.getExportPageByInfoCheckbox().click();
    }

    async clickExpandPageByCheckbox() {
        await this.getExpandPageByCheckbox().click();
    }

    async clickReportExportButton() {
        await this.waitForElementVisible(this.getReportExportButton());
        return this.getReportExportButton().click();
    }

    async clickExportCSVButton() {
        await this.getIWExportCSVButton().click();
    }

    async hoverOnContextMenuShareItem() {
        await this.hover({elem: this.getContextMenuShareItem()});
    }

    async clickExportToCsvItemInContextMenu() {
        await this.getContextMenuExportCsvItem().click();
    }

    async clickTitlebarExportCSVButton(vizName) {
        const elem = await $(`//div[@aria-label='${vizName}']`);
        const exportButton = await elem.$('//div[contains(@class,"mstrmojo-Button-text") and text()="Export"]');
        await exportButton.click();
        await this.sleep(500);
        const pdfButton = await $('//div[@class="mtxt" and text()="Data"]');
        await pdfButton.click();
    }
}