import BasePage from '../base/BasePage.js';
import { waitForFileToExist } from '../../config/folderManagement.js';

export default class PDFExport extends BasePage {
    //////////////////////////////////////////////
    //////////// Element Locators ////////////////
    //////////////////////////////////////////////

    //Open MoreSettings

    getMoreSettingsButton() {
        return this.$('.mstrd-ExportDetailsPanel-moreSettingsTitle');
    }

    //dropdown list
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

    getDetailLevelSettings() {
        return this.$('.mstrd-ExportContentSetting');
    }

    getFilterSummarySettings() {
        return this.$('.mstrd-ExportFilterSummary');
    }

    getPageSizeSettings() {
        return this.$('.mstrd-ExportPagerSizeSetting');
    }

    getPDFRangeSetting() {
        return this.$('label=Range').$('..').$('.mstrd-DropDownButton');
    }

    getRangeDropDownContents() {
        return this.$('.mstrd-ExportDetailsPanel-options');
    }

    getRSDRangeDropDownContents() {
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

    async clickPDFRangeSetting() {
        await this.getPDFRangeSetting().click();
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

    async selectDetailLevel(dropDownOption) {
        await this.waitForElementVisible(this.getDetailLevelSettings(), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Cannot find Detail Level selector.',
        });
        await this.getDropDownSelectedItem(this.getDetailLevelSettings()).click();
        await this.sleep(500);
        await this.waitForElementVisible(this._getDropDownlist(this.getDetailLevelSettings()), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Detail Level dropdown did not open.',
        });
        await this._selectDropDownItemOption({
            dropDownOption,
            dropDownItems: () => this._getDropDownItems(this.getDetailLevelSettings()),
        });
        return this.sleep(1000);
    }

    async selectPageSize(dropDownOption) {
        await this.waitForElementVisible(this.getPageSizeSettings(), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Cannot find Page size selector.',
        });
        await this.getDropDownSelectedItem(this.getPageSizeSettings()).click();
        await this.sleep(500);
        await this.waitForElementVisible(this._getDropDownlist(this.getPageSizeSettings()), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Detail Level dropdown did not open.',
        });
        await this._selectDropDownItemOption({
            dropDownOption,
            dropDownItems: () => this._getDropDownItems(this.getPageSizeSettings()),
        });
        return this.sleep(1000);
    }

    async selectFilterSummary(dropDownOption) {
        await this.waitForElementVisible(this.getFilterSummarySettings(), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Cannot find Filter Summary selector.',
        });
        await this.getDropDownSelectedItem(this.getFilterSummarySettings()).click();
        await this.sleep(500);
        await this.waitForElementVisible(this._getDropDownlist(this.getFilterSummarySettings()), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Detail Level dropdown did not open.',
        });
        await this._selectDropDownItemOption({
            dropDownOption,
            dropDownItems: () => this._getDropDownItems(this.getFilterSummarySettings()),
        });
        return this.sleep(1000);
    }

    async _selectDropDownItemOption({ dropDownOption, dropDownItems }) {
        const dropdownItems = await dropDownItems();
        for (const dropDownItem of dropdownItems) {
            const name = await dropDownItem.getText();
            if (name.includes(dropDownOption)) {
                return dropDownItem.click();
            }
        }
        throw new Error(`Dropdown option '${dropDownOption}' was not found`);
    }

    //radio button

    getGridSettings() {
        return this.$('.mstrd-ExportGrid');
    }

    _getGridButton(button) {
        return this.getGridSettings()
            .$$('.mstrd-RadioButton')
            .filter(async (elem) => {
                // Filter out empty item containers
                const nameLocator = elem.$('.mstrd-RadioButton-label');
                const isItemPresent = await nameLocator.isDisplayed();
                if (isItemPresent) {
                    const buttonName = await nameLocator.getText();
                    return button === buttonName;
                }
            })[0];
    }

    async selectGridSettings(buttonName) {
        await this.waitForElementClickable(this._getGridButton(buttonName), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Grid setting is not ',
        });
        await this._getGridButton(buttonName).click();
        return this.sleep(2000);
    }

    async isRepeatAttributeColumnsEnabled() {
        return this.$('.mstrd-ExportGrid-item-repeatColumn--disabled').isDisplayed();
    }

    //check box

    _getCheckBoxContatiner(elem) {
        return elem.$('.mstrd-Checkbox');
    }

    getTableofContentsCheckBox() {
        return this.$('.mstrd-ExportPageInfo').$$('.mstrd-Checkbox-main')[0];
    }

    getHeaderCheckBox() {
        return this.$('.mstrd-ExportPageInfo').$$('.mstrd-Checkbox-main')[1];
    }

    getPageNumbersCheckBox() {
        return this.$('.mstrd-ExportPageInfo').$$('.mstrd-Checkbox-main')[2];
    }

    getFilterSummaryCheckBox() {
        return this.$(`.mstrd-ExportFilterSummary-item`);
    }

    getRepeatAttributeColumnsCheckBox() {
        return this._getCheckBoxContatiner(this.$('.mstrd-ExportGrid-item-repeatColumn'));
    }

    getExpandAllGridDataCheckBox() {
        return this._getCheckBoxContatiner(this.$('.mstrd-ExportGrid-item-expandGrid'));
    }

    async toggleHeaderCheckBox() {
        await this.waitForElementClickable(this.getHeaderCheckBox(), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Checkbox did not appear.',
        });
        return this.getHeaderCheckBox().click();
    }

    async togglePageNumbersCheckBox() {
        await this.waitForElementClickable(this.getPageNumbersCheckBox(), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Checkbox did not appear.',
        });
        return this.getPageNumbersCheckBox().click();
    }

    async toggleFilterSummaryCheckBox() {
        await this.waitForElementClickable(this.getFilterSummaryCheckBox(), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Checkbox did not appear.',
        });
        return this.getFilterSummaryCheckBox().click();
    }

    async toggleRepeatAttributeColumnsCheckBox() {
        await this.waitForElementClickable(this.getRepeatAttributeColumnsCheckBox(), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Checkbox did not appear.',
        });
        return this.getRepeatAttributeColumnsCheckBox().click();
    }

    async toggleExpandAllGridDataCheckBox() {
        await this.waitForElementClickable(this.getExpandAllGridDataCheckBox(), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Detail Level dropdown did not open.',
        });
        return this.getExpandAllGridDataCheckBox().click();
    }

    async toggleTableofContentsCheckBox() {
        await this.waitForElementClickable(this.getTableofContentsCheckBox(), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Table of contents is not clickable.',
        });
        await this.getTableofContentsCheckBox().click();
    }
    // button

    getOrientation() {
        return this.$('.mstrd-ExportOrientationSetting-body');
    }

    _getOrientationButton(buttonName) {
        return this.getOrientation().$(`button[data-text=${buttonName}]`);
    }

    getAutoOrientationButton() {
        return this._getOrientationButton('AUTO');
    }

    getPortraitOrientationButton() {
        return this._getOrientationButton('portrait');
    }

    getLandScapeOrientationButton() {
        return this._getOrientationButton('landscape');
    }

    //mojo

    getMojoPDFExportCancelButton() {
        //return this.element(by.cssContainingText('.mstrmojo-Button-text ', 'Cancel'));
        return this.$$('.mstrmojo-Button-text').filter(async (elem) => {
            const text = await elem.getText();
            return text === 'Cancel';
        })[0];
    }

    _getMojoDropDownContainer(option) {
        //return this.element(by.cssContainingText('.mstrmojo-Label', elem)).$('following-sibling::div');
        /*return this.$$('.mstrmojo-Label').filter(async (elem) => {
                                         const elemText = await elem.getText();
                                        return elemText.includes(option);
                                     })[0].$('..').$('.mstrmojo-ui-Pulldown').$('.mstrmojo-ui-Pulldown-text');*/
        return this.$(`//div[@aria-label='${option}']`).$('..').$('.mstrmojo-ui-Pulldown');
    }

    _getMojoDropDownSelectedItem(elem) {
        return this._getMojoDropDownContainer(elem).$('.mstrmojo-ui-Pulldown-text');
    }

    _getMojoDropDownlist(elem) {
        return this._getMojoDropDownContainer(elem).$('.mstrmojo-PopupList');
    }

    _getMojoDropDownItems(elem) {
        return this._getMojoDropDownlist(elem).$$('.item');
    }

    getMojoPortraitOrientationButton() {
        return this.$('span[role="radio"][aria-label="Portrait"]');
    }

    getMojoLandscapeOrientationButton() {
        return this.$('span[role="radio"][aria-label="Landscape"]');
    }

    getMojoGridSettings(option) {
        return this.$(`//span[normalize-space(text())='${option}']/parent::span/preceding-sibling::div//input[@type='radio']`);
    }

    getMojoGridRepeatColumns() {
        return this.$('.mstr-export-PDF-editor-repeat-attribute input[type="checkbox"]');
    }

    getMojoShowHearderCheckBox() {
        return this.$(`//span[normalize-space()="Show header"]/preceding-sibling::div//input[@type="checkbox"]`);
    }

    getMojoShowPageNumberCheckBox() {
        return this.$(`//span[normalize-space()="Show footer"]/preceding-sibling::div//input[@type="checkbox"]`);
    }

    getVisualizationByTitle(title) {
        return this.$('.mstrmojo-VIPanel-content').$$('.mstrmojo-VIBox').filter(async (elem) => {
            const elemText = await elem.$('.mstrmojo-EditableLabel').getText();
            return elemText === title;
        })[0];
        //return this.$('.mstrmojo-VIPanel-content').$$('.mstrmojo-VIBox')[2];
    }

    getContextMenuOption({ level, option }) {
        if (option.includes('Quick Sort')) {
            if (option.includes('Ascending')) {
                return this.$('.item.asc.mstrmojo-ui-Menu-item');
            } else {
                return this.$('.item.desc.mstrmojo-ui-Menu-item');
            }
        } else {
            return this.getContextMenuByLevel(level)
                .$$('.item.mstrmojo-ui-Menu-item')
                .filter(async (item) => {
                    let itemText;
                    itemText = await item.getText();
                    if (!itemText) {
                        console.log('warning: failed to get text. try again');
                        await this.sleep(1000); //wait for menu list to be stable, especially when there is scrollbar
                        await this.waitForElementVisible(item);
                        itemText = await item.getText();
                    }
                    if (itemText != null && itemText != '') {
                        return itemText.includes(option);
                    }
                })[0];
        }
    }

    getContextMenuByLevel(level) {
        return this.$$('.mstrmojo-ui-Menu')[level];
    }

    getVisualizationMenuButton(title) {
        return this.getVisualizationByTitle(title).$('.hover-menu-btn');
    }

    async openVisualizationMenu({ elem, offset }) {
        await this.click({ elem, offset });
        const el = this.getContextMenuByLevel(0);
        await this.waitForElementVisible(this.getContextMenuByLevel(0));
        return this.sleep(500);
    }

    async selectVisualizationMenuOptions({ elem, offset, firstOption, secondOption, thirdOption }) {
        await this.openVisualizationMenu({ elem, offset });
        await this.clickMenuOptionInLevel({ level: 0, option: firstOption });
        if (secondOption) {
            await this.waitForElementVisible(this.getContextMenuByLevel(1));
            await this.clickMenuOptionInLevel({ level: 1, option: secondOption });
        }
        if (thirdOption) {
            await this.waitForElementVisible(this.getContextMenuByLevel(2));
            await this.clickMenuOptionInLevel({ level: 2, option: thirdOption });
        }
    }

    async clickContextMenu(el, prompted = false) {
        if (prompted) {
            return this.clickAndNoWait({ elem: el }); // cannot use this.click() due to prompt window might appear after click
        } else {
            return this.click({ elem: el });
        }
    }

    async clickMenuOptionInLevel({ level, option }, prompted = false) {
        const elem = await this.getContextMenuOption({ level, option });
        return this.clickContextMenu(elem, prompted);
    }

    async selectExportToPDFOnVisualizationMenu(title) {
        await this.hover({ elem: this.getVisualizationByTitle(title) });
        return this.selectVisualizationMenuOptions({
            elem: this.getVisualizationMenuButton(title),
            firstOption: 'Export',
            secondOption: 'PDF',
        });
    }

    async selectMojoFilterSummary(dropDownOption) {
        const filterDropdown = await $('.mstr-export-PDF-editor-form-select.mstr-export-PDF-editor-filterSelection');
        await filterDropdown.click();
        const option = await $(`//div[@role="option" and .//span[normalize-space()="${dropDownOption}"]]`);
        await option.waitForClickable();
        await option.click();
        await this.sleep(1000);
    }

    async selectMojoPageSize(dropDownOption) {
        const dropdown = await $('.mstr-export-PDF-editor-form-group-paperSize');
        await dropdown.click();
        const option = await $(`//div[contains(@class,"paperSize-dropdown__option") and .//span[normalize-space()='${dropDownOption}']]`);
        await option.waitForClickable();
        await option.click();
        return this.sleep(1000);
    }

    async selectMojoOrientation(option) {
        if (option == 'Portrait') {
            await this.getMojoPortraitOrientationButton().click();
        } else {
            await this.getMojoLandscapeOrientationButton().click();
        }
        return this.sleep(1000);
    }

    async toggleMojoGridSettings(option) {
        await this.getMojoGridSettings(option).click();
    }

    async toggleMojoGridRepeatColumns() {
        await this.getMojoGridRepeatColumns().click();
    }

    async toggleMojoShowHeader() {
        await this.getMojoShowHearderCheckBox().click();
    }

    async toggleMojoShowPageNumber() {
        await this.getMojoShowPageNumberCheckBox().click();
    }

    //Export notification
    getShareSpinningIcon() {
        return this.$('.mstrd-spinner-export');
    }

    getMenuContent(elem) {
        return elem.$('.mstr-menu-content').getText();
    }

    getPDFExportIcon() {
        return this.$('.mstr-menu-icon.icon-share_pdf');
    }

    getExcelExportIcon() {
        return this.$('.icon-share_excel.mstr-menu-icon');
    }

    getCSVExportIcon() {
        return this.$('.icon-share_csv.mstr-menu-icon');
    }

    getGoogleSheetsExportIcon() {
        return this.$('.icon-share_google_sheets.mstr-menu-icon');
    }

    getExportLoadingSpinner() {
        return this.$('.mstrd-Spinner');
    }

    getExportIsCompleteNotification() {
        return this.$('.ant-notification.ant-notification-bottomRight');
    }

    async waitForExportComplete({ name, fileType }) {
        if (!name || !fileType) {
            return new Error('The name and/or fileType object parameters must be provided.');
        }

        if (fileType === '.pdf') {
            await this.waitForElementStaleness(this.getShareSpinningIcon(), {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                msg: 'Export PDF takes too long',
            });
        } else if (fileType === '.xlsx') {
            await this.waitForElementStaleness(this.getShareSpinningIcon(), {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                msg: 'Export Excel takes too long',
            });
        } else {
            return new Error('The provided fileType object parameter is not supported.');
        }

        // Wait the file to be completely generated after the download spinner disappears
        return waitForFileToExist({ name, fileType });
    }

    getMojoPDFExportSettingsEditor() {
        return this.$('.mstrmojo-ExportPDFEditor');
    }

    getMojoPDFExportDisplayOption() {
        return this.$('.mstrmojo-Box.displayOption');
    }

    getMojoPDFExportButton() {
        return this.getMojoPDFExportSettingsEditor().$$('.mstrmojo-Editor-buttons').filter(async (elem) => ((await elem.getText()).includes('Export')))[0];
    }

    getMojoPDFExportHeaderInfoIcon() {
        return this.$$('.msmojo-IconLabel .info-icon').last();
    }

    getTooltipMojoPDFExportHeaderInfoIcon() {
        return this.$$('.mstrmojo-IconLabel').last().getAttribute('ttp');
    }

    getLibraryExportPDFWindow() {
        return this.$('.mstrd-ExportDetailsPanelInLibrary');
    }

    getDossierExportPDFPanel() {
        return this.$('.mstrd-ExportDetailsPanel');
    }

    getExportPageInfo() {
        return this.$('.mstrd-ExportPageInfo');
    }

    getReportExportPDFPanel() {
        return this.$('.mstrd-MenuPanel.mstrd-ReportPdfPanel');
    }

    getReportShareMenuExportButton() {
        return this.getReportExportPDFPanel().$('.mstrd-Button--primary');
    }

    getPDFRange() {
        return this.$('label=Range').$('..').$('.mstrd-DropDownButton-label');
    }

    _getExportButtonHeaderTab(tabName) {
        return this.$(`.mstrd-ExportSectionHeader > button[data-text='${tabName}']`);
    }

    getLayoutTab() {
        return this._getExportButtonHeaderTab('Layout');
    }

    getFilterSummaryTab() {
        return this._getExportButtonHeaderTab('Filter Summary');
    }

    getFilterSummaryTabOptionsView() {
        return this.$('.mstrd-ExportFilterSummary');
    }

    getAdvancedSettingsButton() {
        return this.$('.mstrd-ExportDetailsPanel-advancedSettingBarText');
    }

    getAdvancedSettingsPanel() {
        return this.$('.mstrd-ExportDetailsPanel-advancedSettingsPanel');
    }

    getPaperSizeDropDownButton() {
        return this.$('.mstrd-ExportPagerSizeSetting-dropdown .mstrd-DropDownBox-selected');
    }

    getPaperSizeDropDownSelectedOption() {
        return this._getDropDownSelectedItem(this.getPaperSizeDropDownButton());
    }

    openPaperSizeDropDown() {
        return this.getPaperSizeDropDownButton().click();
    }

    _getPaperSizeDropDownItems() {
        return this.$$('.mstrd-ExportPagerSizeSetting-dropdown.mstrd-DropDownMenu-view .mstrd-DropDownMenu-item');
    }

    _getCheckBox(selector) {
        return this.$(selector).$('.mstrd-Checkbox-body');
    }

    getExportIndvlVizsCheckBox() {
        return this._getCheckBox(`.mstrd-ExportPageInfo-item--viz`);
    }

    getOnEveryPageCheckBox() {
        return this._getCheckBox(`.mstrd-ExportFilterSummary-item--page`);
    }

    getAfterEveryChapterCheckBox() {
        return this._getCheckBox(`.mstrd-ExportFilterSummary-item--chapter`);
    }

    getFocusableCheckboxElement(elem) {
        return elem.$('.mstrd-Checkbox-label');
    }

    _getExportButtonContainer() {
        return this.$('.mstrd-ExportDetailsPanel-buttonContainer, .mstrd-ExportDetailsPanelInLibrary-buttons');
    }

    getCancelButton() {
        return this._getExportButtonContainer().$(`button[type='button']`);
    }

    getExportButton() {
        return this._getExportButtonContainer().$(`button[type='submit']`);
    }

    _getInfoIcon(selector) {
        return this.$(selector).$('.mstrd-ExportPageInfo-dossierIcon');
    }

    getExportIndvlInfoIcon() {
        return this._getInfoIcon(`.mstrd-ExportPageInfo-item--viz`);
    }

    getHeaderInfoIcon() {
        return this._getInfoIcon(`.mstrd-ExportPageInfo-item--header`);
    }

    getDocumentTitleBox(title) {
        return this.$$('.mstrmojo-portlet-titlebar.dark').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText.includes(title);
        })[0];
    }

    getDocumentVisualizationMenuButton(title) {
        return this.getDocumentTitleBox(title).$('.mstrmojo-Button.mstrmojo-oivmSprite.tbDown');
    }

    getDocumentSingleVizExportButton(type) {
        return this.$$('.mstrmojo-itemwrap').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText.includes(type);
        })[0];
    }

    getRSDExportDialog() {
        return this.$('.mstrd-MenuPanel.mstrd-ExportDetailsPanel');
    }

    getRSDExportRange(option) {
        return this.$$('.mstrd-Option')
        .filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText.includes(option);
        })[0];
    }

    getRSDVisualizationMenu() {
        return this.$('.mstrmojo-Button.mstrmojo-oivmSprite.tbDown');
    }

    getExpandPageBy() {
        return this.$(`//div[text()='Expand all Page-By fields']`);
    }

    getAdjuectMarginCheckbox() {
        return this.$('//div[contains(text(), "Adjust")]');
    }

    getMarginOption() {
        return this.$('.mstrd-ExportMarginOptions');
    }
    
    getMarginLeftTextbox() { 
        return this.$(`//input[@aria-label='Left Margin']`);
    }

    getMarginRightTextbox() {
        return this.$(`//input[@aria-label='Right Margin']`);
    }

    getMarginTopTextbox() {
        return this.$(`//input[@aria-label='Top Margin']`);
    }

    getMarginBottomTextbox() {
        return this.$(`//input[@aria-label='Bottom Margin']`);
    }

    
    getExpandGridCheckbox() {
        return this.$('//div[contains(text(), "Expand")]');
    }

    getScaleGridCheckbox() {
        return this.$('//div[contains(text(), "Scale")]');
    }

    getVizPDFExportButton() {
        return this.$('//div[text()="Export"]');
    }
    //////////////////////////////////////////////
    ////////////  Action Helper  /////////////////
    //////////////////////////////////////////////

    async close() {
        await this.getCancelButton().click();
        await this.waitForElementStaleness(this.getLibraryExportPDFWindow(), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'PDF settings window was not closed.',
        });
    }

    async cancelExportSettingsVisualization() {
        const button = await $('//button[.//span[normalize-space()="Cancel"]]'); 
        await button.click();
        return this.sleep(1000);
    }

    async exportSubmitPrompt() {
        await this.getExportButton().click();
        await this.waitForElementVisible(this.promptEditor.getPromptEditor(), {
            timeout: this.DEFAULT_LOADING_TIMEOUT,
            msg: 'Prompt editor did not open.',
        });
    }

    async exportSubmitLibrary() {
        await this.waitForElementVisible(this.getExportButton(), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'PDF settings window was not closed.',
        });
        await this.getExportButton().click();
        await this.waitForElementStaleness(this.infoWindow.getExportPDFSpinner(), {
            timeout: this.DEFAULT_LOADING_TIMEOUT,
            msg: 'PDF download did not complete.',
        });
    }

    async exportByTab() {
        await this.tabToElement(this.getExportButton());
        await this.enter();
        await this.waitForElementStaleness(this.infoWindow.getExportPDFSpinner(), {
            timeout: this.DEFAULT_LOADING_TIMEOUT,
            msg: 'PDF download did not complete.',
        });
    }

    async exportSubmitDossier() {
        await this.getExportButton().click();
        await this.waitForElementStaleness(this.share.getExportPDFSpinner(), {
            timeout: this.DEFAULT_LOADING_TIMEOUT,
            msg: 'PDF download did not complete.',
        });
        // return this.wait(this.EC.presenceOf(this.share.getExportPDFCheckMark()), this.DEFAULT_TIMEOUT, 'PDF download did not complete.');
    }

    async exportSubmitVisualization() {
        await this.waitForElementVisible(this.getMojoPDFExportSettingsEditor(), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'PDF export settings editor did not open.',
        });
        await this.getMojoPDFExportButton().click();
        await this.waitForElementStaleness(this.getMojoPDFExportSettingsEditor(), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'PDF export settings editor did not close.',
        });
        return this.sleep(this.DEFAULT_TIMEOUT / 10);
    }

    async openAdvancedSettingsPanel() {
        await this.waitForElementVisible(this.getDossierExportPDFPanel(), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Export panel did not open.',
        });
        await this.getAdvancedSettingsButton().click();
        await this.waitForElementVisible(this.getAdvancedSettingsPanel(), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Advanced settings panel did not open.',
        });
    }

    // async selectContentDropDownItemOption(dropDownOption) {
    //     await this.getContentSelectorButton().click();
    //     await this.sleep(500);
    //     await this.wait(this.EC.presenceOf(this.getContentSelectorDropDown()), this.DEFAULT_TIMEOUT, 'Content select dropdown did not open.');
    //     await this._selectDropDownItemOption({
    //         dropDownOption,
    //         dropDownItems: () => this._getContentDropDownItems()
    //     });
    //     return this.sleep(500);
    // }

    selectLayoutTab() {
        return this.getLayoutTab().click();
    }

    selectFilterSummaryTab() {
        return this.getFilterSummaryTab().click();
    }

    selectAutoOrientation() {
        return this.getAutoOrientationButton().click();
    }

    selectPortraitOrientation() {
        return this.getPortraitOrientationButton().click();
    }

    selectLandscapeOrientation() {
        return this.getLandScapeOrientationButton().click();
    }

    async selectPaperSizeDropDownItemOption(dropDownOption) {
        await this.openPaperSizeDropDown();
        await this.sleep(500);
        await this.waitForElementVisible(this.getPaperSizeDropDownButton(), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Paper size select dropdown did not open.',
        });
        await this._selectDropDownItemOption({
            dropDownOption,
            dropDownItems: () => this._getPaperSizeDropDownItems(),
        });
        return this.sleep(1000);
    }

    async selectCheckBox(elem, shouldDeselect = false) {
        const isElemCurrentlySelected = await this._isCheckBoxSelected(elem);
        if ((!isElemCurrentlySelected && !shouldDeselect) || (isElemCurrentlySelected && shouldDeselect)) {
            return this.getFocusableCheckboxElement(elem).click();
        }
    }

    async deselectCheckBox(elem) {
        return this.selectCheckBox(elem, true);
    }

    async _clickCheckbox(elem) {
        return this.click({ elem: this.getFocusableCheckboxElement(elem) });
    }

    async OpenDocumentSingleVisualizationMenuButton(title) {
        return this.click({ elem: this.getDocumentVisualizationMenuButton(title) });
    }

    async ExportDocumentSingleVisualization(type) {
        return this.click({ elem: this.getDocumentSingleVizExportButton(type) });
    }

    //////////////////////////////////////////////
    ///////////  Assertion Helpers  //////////////
    //////////////////////////////////////////////

    async clickMoreSettings() {
        await this.waitForElementVisible(this.getMoreSettingsButton(), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'MoreSettings did not open.',
        });
        return this.getMoreSettingsButton().click();
    }

    async detailLevelSelectedItem() {
        return this.getDropDownSelectedItem(this.getDetailLevelSettings()).getText();
    }

    async pageSizeSelectedItem() {
        return this.getDropDownSelectedItem(this.getPageSizeSettings()).getText();
    }

    async FilterSummarySelectedItem() {
        return this.getDropDownSelectedItem(this.getFilterSummarySettings()).getText();
    }

    async _isOrientationButtonSelected(orientationButton) {
        const orientationBtnClasses = await orientationButton.getAttribute('class');
        return orientationBtnClasses.includes('hot');
    }

    async _isDropDownListOpen(elem) {
        return this._getDropDownlist(elem).isDisplayed();
    }

    async isRangeDropDownListOpen() {
        return this._isDropDownListOpen(this.getRangeDropDownContents());
    }

    async isRSDRangeDropDownListOpen() {
        return  this.getRSDRangeDropDownContents().isDisplayed();
    }

    async isLayoutTabSelected() {
        const layoutTabClass = await this.getLayoutTab().getAttribute('class');
        return layoutTabClass.includes('hot');
    }

    async isFilterSummaryTabSelected() {
        const filterSummaryTabClass = await this.getFilterSummaryTab().getAttribute('class');
        return filterSummaryTabClass.includes('hot');
    }

    async isLibraryExportPDFSettingsWindowOpen() {
        return this.getLibraryExportPDFWindow().isDisplayed();
    }

    async isDossierExportPDFSettingsWindowOpen() {
        return this.getDossierExportPDFPanel().isDisplayed();
    }

    async isVisExportPDFSettingsWindowOpen() {
        return this.getMojoPDFExportSettingsEditor().isDisplayed();
    }

    async isAutoOrientationButtonSelected() {
        return this._isOrientationButtonSelected(this.getAutoOrientationButton());
    }

    async isPortraitOrientationButtonSelected() {
        return this._isOrientationButtonSelected(this.getPortraitOrientationButton());
    }

    async isLandScapeOrientationButtonSelected() {
        return this._isOrientationButtonSelected(this.getLandScapeOrientationButton());
    }

    async _isCheckBoxSelected(elem) {
        return elem.$(`input[type='checkbox']`).isSelected();
    }

    async isExportIndvlVizsCheckBoxSelected() {
        return this._isCheckBoxSelected(this.getExportIndvlVizsCheckBox());
    }

    async isHeaderCheckBoxSelected() {
        return this._isCheckBoxSelected(this.getHeaderCheckBox());
    }

    async isPageNumbersCheckBoxSelected() {
        return this._isCheckBoxSelected(this.getPageNumbersCheckBox());
    }

    async isExportLoadingSpinnerPresent() {
        return this.getExportLoadingSpinner().isDisplayed();
    }

    async isExportCompleteNotificationPresent() {
        return this.getExportIsCompleteNotification().isDisplayed();
    }

    async closeExportCompleteNotification() {
        await this.$('.anticon.anticon-close.ant-notification-close-icon').click();
    }

    async isExporttoPDFPresent() {
        return this.getPDFExportIcon().isDisplayed();
    }

    async isExporttoExcelPresent() {
        return this.getExcelExportIcon().isDisplayed();
    }

    async isExporttoCSVPresent() {
        return this.getCSVExportIcon().isDisplayed();
    }

    async isExporttoGoogleSheetsPresent() {
        return this.getGoogleSheetsExportIcon().isDisplayed();
    }

    async isRSDExportTypePresent(type) {
        return this.getDocumentSingleVizExportButton(type).isDisplayed();
    }

    async isRSDExportButtonPresent(title) {
        return this.getDocumentVisualizationMenuButton(title).isDisplayed();
    }

    async selectRange(option) {
        await this.getPDFRangeSetting().click();
        await this.getRSDExportRange(option).click();

    }

    async openRangeDialog() {
        await this.getPDFRangeSetting().click();

    }

    async openRSDVisualizationMenu() {
        await this.getRSDVisualizationMenu().click();
    }

    async clickReportShareMenuExportButton() {
        await this.waitForElementVisible(this.getReportShareMenuExportButton());
        return this.getReportShareMenuExportButton().click();
    }

    async clickExpandPageBy() {
        await this.getExpandPageBy().click();
    }

    async clickAdjuectMarginCheckbox() {
        await this.click({ elem: this.getAdjuectMarginCheckbox() });
    }

    async setMarginLeft(marginLeft) {
        await this.getMarginLeftTextbox().setValue(marginLeft);
    }

    async setMarginRight(marginRight) {
        await this.getMarginRightTextbox().setValue(marginRight);
    }

    async setMarginTop(marginTop) {
        await this.getMarginTopTextbox().setValue(marginTop);
    }

    async setMarginBottom(marginBottom) {
        await this.getMarginBottomTextbox().setValue(marginBottom);
    }

    async isHeaderCheckBoxEnabled() {
        return this.getHeaderCheckBox().isEnabled();
    }

    async isFooterCheckBoxEnabled() {
        return this.getPageNumbersCheckBox().isEnabled();
    }

    async clickExpandGridCheckbox() {
        await this.getExpandGridCheckbox().click();
    }

    async clickScaleGridCheckbox() {
        await this.getScaleGridCheckbox().click();
    }

    async clickVizExportButton() {
        const exportBtn = await $('//button[.//span[normalize-space()="Export"]]');
        await exportBtn.click();

    }

    async clickTitlebarExportPDFButton(vizName) {
        const elem = await $(`//div[@aria-label='${vizName}']`);
        const exportButton = await elem.$('//div[contains(@class,"mstrmojo-Button-text") and text()="Export"]');
        await exportButton.click();
        await this.sleep(500);
        const pdfButton = await $('//div[@class="mtxt" and text()="PDF"]');
        await pdfButton.click();
    }

}
