import BasePage from '../base/BasePage.js';

export default class ExportToExcel extends BasePage {
    //////////////////////////////////////////////
    //////////// Element Locators ////////////////
    //////////////////////////////////////////////

    getExportExcelPanel() {
        return this.$('.mstrd-DossierExcelPanel');
    }

    getInfoWindowExportExcelButton() {
        return this.$('.mstrd-ExportPanelInLibrary-buttons').$('.mstrd-ExportPanelInLibrary-submitButton');
    }

    getExportExcelSettingsPanel() {
        return this.$('.mstrd-DossierExcelPanel');
    }

    getReportExportExcelSettingsPanel() {
        return this.$('.mstrd-ReportExcelPanel');
    }

    getExportExcelPanelContent() {
        return this.$('.mstrd-ExportPanelInLibrary-content');
    }

    getRSDExportExcelPanel() {
        return this.$('.mstrd-MenuPanel.mstrd-DocumentExcelPanel');
    }

    getGridList() {
        return this.getExportExcelPanel().$$('.mstrd-Checkbox');
    }

    _getGridButton(button) {
        return this.getGridList().filter(async (elem) => {
            // Filter out empty item containers
            const nameLocator = elem.$('.mstrd-Checkbox-label');
            const isItemPresent = await nameLocator.isDisplayed();
            if (isItemPresent) {
                const buttonName = await nameLocator.getText();
                return button === buttonName;
            }
        })[0];
    }

    getExportButton() {
        return this.$('//button[text()="Export"]');
    }

    getInfoWindowExportButton() {
        return this.$('//button[@type="button" and text()="Export"]');
    }

    getInfoWindowReportExportButton() {
        return this.$('.mstrd-ExportPanelInLibrary-submitButton');
    }

    getShareMenuExportButton() {
        return this.getExportExcelSettingsPanel().$('.mstrd-Button--primary');
    }

    getReportShareMenuExportButton() {
        return this.getReportExportExcelSettingsPanel().$('.mstrd-Button--primary');
    }

    getRSDExportButton() {
        return this.getRSDExportExcelPanel().$('.mstrd-Button--primary');
    }

    getExcelRangeSettings() {
        return this.$('.mstrd-ExcelExportPagesSetting');
    }

    _getDropDownContainer(elem) {
        return elem.$('.mstrd-Select');
    }

    _getDropDownlist(elem) {
        return this._getDropDownContainer(elem).$('.mstrd-Select-dropdown');
    }

    _getDropDownItems(elem) {
        return this._getDropDownlist(elem).$$('.mstrd-Option');
    }

    getDropDownSelectedItem(elem) {
        return this._getDropDownContainer(elem).$('.mstrd-DropDownButton-label');
    }

    getExcelContentsSetting() {
        return this.$('label=Contents').$('..').$('.mstrd-DropDownButton');
    }

    getExcelContents() {
        return this.$('label=Contents').$('..').$('.mstrd-DropDownButton-label');
    }

    getExcelRangeSetting() {
        return this.$('label=Range').$('..').$('.mstrd-DropDownButton');
    }

    getExcelRange() {
        return this.$('label=Range').$('..').$('.mstrd-DropDownButton-label');
    }

    getExcelDropDownContents() {
        return this.$('.mstrd-DropDown-content').$('.mstrd-DropDown-children');
    }

    getSelectedExcelContent(content) {
        return this.$(`//div[text()='${content}']`);
        //return this.$(`div[data-value='${content}']`);
    }

    getVizList() {
        return this.$('.mstrd-DossierExcelForm-vizList');
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

    getChapterByName(name) {
        return this.$(`//div[text()='${name}']`).$('..').$('..');
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

    getLibraryExportExcelWindow() {
        return this.$(
            '.mstrd-DossierExcelPanel,.mstrd-DossierExcelPanelInLibrary,.mstrd-DocumentExcelPanel,.mstrd-ReportExcelPanel'
        );
    }

    getLibraryExportButton() {
        return this.getLibraryExportExcelWindow().$('.mstrd-Button--primary');
    }

    getVizualizationExportExcelDialog() {
        return this.$('.mstrd-ExportExcelDialog');
    }

    getVisualizationExportButton() {
        return this.getVizualizationExportExcelDialog().$('.mstrd-Button--primary');
    }

    getReportMoreSettingsArrow() {
        return this.$('.mstrd-ExportPanel-options .mstrd-ExportForm-collapsibleArea .icon-menu-arrow');
    }

    getReportExportToExcelDialog() {
        return this.$('.mstrd-ReportExcelPanel');
    }

    getReportExportPageByInfoCheckbox() {
        return this.$(`//div[text()='Export Page-By information']`);
    }

    getExportReportTitleCheckbox() {
        return this.$(`//div[text()='Export report title']`);
    }

    getReportIWExportCancel() {
        return this.$('.mstrd-ReportExcelPanelInLibrary').$(`//button[text()='Cancel']`);
    }

    getShowFiltersCheckbox() {
        return this.$('.mstrd-Checkbox-shape.icon-checkmark');
    }

    getLoadingButton() {
        return this.$('.mstrd-Spinner-blade');
    }

    //////////////////////////////////////////////
    ////////////// Action Helper /////////////////
    //////////////////////////////////////////////

    async clickVisualizationExportButton() {
        await this.waitForElementVisible(this.getVisualizationExportButton());
        return this.getVisualizationExportButton().click();
    }

    async isVizualizationExportExcelDialogwOpen() {
        return this.getVizualizationExportExcelDialog().isDisplayed();
    }

    async clickLibraryExportButton() {
        await this.waitForElementVisible(this.getLibraryExportButton());
        return this.getLibraryExportButton().click();
    }

    async isLibraryExportExcelWindowOpen() {
        return this.getLibraryExportExcelWindow().isDisplayed();
    }

    async openExcelRangeSetting() {
        await this.getExcelRangeSetting().click();
    }

    async openExcelContentsSetting() {
        await this.getExcelContentsSetting().click();
    }

    async selectExcelContents(content) {
        await this.getExcelContentsSetting().click();
        await this.waitForElementInvisible(this.getExcelDropDownContents());
        await this.getSelectedExcelContent(content).click();
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

    async clickOnlyByChapterName(name) {
        await this.hover({ elem: this.getChapterByName(name) });
        await this.getOnlyButtonByChapterName(name).click();
    }

    async clickOnlyByPageName(name) {
        await this.hover({ elem: this.getPageByName(name) });
        await this.getOnlyButtonByPageName(name).click();
    }

    async selectGrid(gridName) {
        await this._getGridButton(gridName).click();
        return this.sleep(1000);
    }

    async hoverOnGrid(gridName) {
        await this.waitForElementClickable(this._getGridButton(gridName));
        await this.hover({ elem: this._getGridButton(gridName) });
        return this.sleep(1000);
    }

    async clickExportButton() {
        await this.waitForElementVisible(this.getExportButton());
        return this.getExportButton().click();
    }

    async clickInfoWindowExportButton() {
        await this.waitForElementVisible(this.getInfoWindowExportButton());
        return this.getInfoWindowExportButton().click();
    }

    async clickInfoWindowReportExportButton() {
        await this.waitForElementVisible(this.getInfoWindowReportExportButton());
        return (await this.getInfoWindowReportExportButton()).click();
    }

    async clickShareMenuExportButton() {
        await this.waitForElementVisible(this.getShareMenuExportButton());
        return this.getShareMenuExportButton().click();
    }

    async clickReportShareMenuExportButton() {
        await this.waitForElementVisible(this.getReportShareMenuExportButton());
        return this.getReportShareMenuExportButton().click();
    }

    async clickRSDExportButton() {
        await this.waitForElementVisible(this.getRSDExportButton());
        return this.getRSDExportButton().click();
    }

    async selectGridOnly(gridName) {
        let gridButton = await this._getGridButton(gridName);
        await this.hover({ elem: gridButton });
        let gridOnly = await gridButton.$('.mstrd-Checkbox-keepOnly');
        await gridOnly.click();
        return this.sleep(1000);
    }

    async _selectDropDownItemOption({ dropDownOption, dropDownItems }) {
        const dropdownItems = await dropDownItems();
        for (const dropDownItem of dropdownItems) {
            const name = await dropDownItem.getText();
            if (name === dropDownOption) {
                return dropDownItem.click();
            }
        }
        throw new Error(`Dropdown option '${dropDownOption}' was not found`);
    }

    async selectExcelRange(dropDownOption) {
        await this.waitForElementVisible(this.getExcelRangeSettings());
        //await this.waitForElementVisible(this.getExcelRangeSettings(), { msg: 'Cannot find Detail Level selector.' });
        await this.getDropDownSelectedItem(this.getExcelRangeSettings()).click();
        await this.sleep(500);
        await this.waitForElementVisible(this.getExcelRangeSettings());
        /*
        await this.waitForElementVisible(
            this._getDropDownlist(this.getExcelRangeSettings(), { msg: 'Detail Level dropdown did not open.' })
        );
        */
        await this._selectDropDownItemOption({
            dropDownOption,
            dropDownItems: () => this._getDropDownItems(this.getExcelRangeSettings()),
        });
        return this.sleep(1000);
    }

    //////////////////////////////////////////////
    //////////// Assertion Helper ////////////////
    //////////////////////////////////////////////

    async isExportDisabled() {
        return this.getExportExcelPanel().$('.mstrd-Button--primary[disabled]').isDisplayed();
    }

    async clickReportMoreSettings() {
        await this.getReportMoreSettingsArrow().click();
    }

    async clickReportExportPageByInfoCheckbox() {
        await this.getReportExportPageByInfoCheckbox().click();
    }

    async clickExportReportTitleCheckbox() {
        await this.getExportReportTitleCheckbox().click();
    }
    async clickReportIWExportCancelButton() {
        await this.getReportIWExportCancel().click();
    }

    async clickShowFiltersCheckbox() {
        await this.getShowFiltersCheckbox().click();
    }

    async waitForExportLoadingButtonToDisappear(timeout = 60000) {
        const loadingButton = this.getLoadingButton();
        await browser.waitUntil(async () => {
            if (await loadingButton.isExisting()) {
                return !(await loadingButton.isDisplayed());
            }
            // If element doesn't exist at all, also treat as invisible
            return true;
        }, {
            timeout,
            timeoutMsg: 'Loading Button still exists after 60000 ms'
        });
    }

    async clickTitlebarExportExcelButton(vizName) {
        const elem = await $(`//div[@aria-label='${vizName}']`);
        const exportButton = await elem.$('//div[contains(@class,"mstrmojo-Button-text") and text()="Export"]');
        await exportButton.click();
        await this.sleep(500);
        const pdfButton = await $('//div[@class="mtxt" and text()="Excel"]');
        await pdfButton.click();
    }

    async waitForExportComplete(appearTimeout = 10000) {
        const notificationSelector = 'div.ant-notification.ant-notification-bottomRight';
        // Wait for the notification to appear
        await browser.waitUntil(async () => {
            const elem = await $(notificationSelector);
            return await elem.isDisplayed();
        }, {
            timeout: appearTimeout,
            timeoutMsg: 'Notification did not appear in time'
        });
    }

    /**
     * Check if googleSheetsURL starts with 'https://docs.google.com/spreadsheets'.
     * @param {string} googleSheetsURL - The URL to check.
     * @returns {boolean} True if starts with the expected prefix, else false.
     */
    checkGoogleSheetsURLPrefix(googleSheetsURL) {
        const prefix = 'https://docs.google.com/spreadsheets';
        return typeof googleSheetsURL === 'string' && googleSheetsURL.startsWith(prefix);
    }

}
