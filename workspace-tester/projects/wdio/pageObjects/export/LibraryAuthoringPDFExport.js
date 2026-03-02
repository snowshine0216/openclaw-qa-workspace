import BasePage from '../base/BasePage.js';
export default class LibraryAuthoringPDFExport extends BasePage {
    //////////////////////////////////////////////
    //////////// Element Locators ////////////////
    //////////////////////////////////////////////

    getPDFSettings() {
        return this.$('.mstrmojo-DocProps-Editor-PdfSettings');
    }

    getPDFRangeSetting() {
        return this.$(`//div[@aria-label='Range']`).$('..').$('.mstrmojo-ui-Pulldown').$('.mstrmojo-ui-Pulldown-text');
        //return this.getPDFSettings().$(`//div[text()="This page"]`);
    }

    getPDFRangeOption(option) {
        //return this.$(`//div[text()='${option}']`);
        return this.$(
            `//div[contains(@class,'mstrmojo-popupList-scrollBar')]//div[@role='menuitem' and normalize-space(text())='${option}']`
        );
    }

    getPDFContentSetting() {
        //return this.getPDFSettings().$('.mstrmojo-DashboardPdfSettings').$(`//div[@aria-label='Contents']`).$('..').$('.mstrmojo-ui-Pulldown').$('.mstrmojo-ui-Pulldown-text');
        return this.getPDFSettings().$(`//div[@aria-label="All visualizations together"]`);
    }

    getPDFContentOption(option) {
        return this.$(`//div[text()='${option}']`);
    }

    getScaleToPageWidthRadio() {
        return this.$('//span[text()="Scale to page width"]').$('..').$('..');
    }

    getExtenColumnsOverPagesRadio() {
        return this.$('//span[text()="Extend columns over pages"]').$('..').$('..');
    }

    getRepeatColumnsCheckbox() {
        return this.$(`div[aria-label='Grid Settings']`).$('..').$('.mstrmojo-DashboardPdfSettings-subfield');
    }

    getPaperSizeSetting() {
        //return this.getPDFSettings().$('.mstrmojo-DashboardPdfSettings').$(`//div[@aria-label='More Settings']`).$('..').$('.mstrmojo-Box').$('.mstrmojo-DashboardPdfSettings-field').$('.mstrmojo-ui-Pulldown').$('.mstrmojo-ui-Pulldown-text');
        return this.getPDFSettings().$('//div[contains(text(), "Letter")]');
    }

    getDropdownOption(option) {
        return this.$(`//div[text()='${option}']`);
    }

    getPortraitButton() {
        return this.$('.mstrmojo-DashboardPdfSettings-portrait');
    }

    getLandscapeButton() {
        return this.$('.mstrmojo-DashboardPdfSettings-landscape');
    }

    getReactShowTableOfContentsCheckbox() {
        return this.$(`div[aria-label='Display Options']`)
            .$('..')
            .$$('.mstr-docprops-checkboxItem')[0]
            .$('input');
    }

    getShowHeaderCheckbox() {
        return this.$(`div[aria-label='Display Options']`)
            .$('..')
            .$('.mstrmojo-Box')
            .$$('.mstrmojo-CheckBox')[1]
            .$('label');
    }

    getShowPageNumbersCheckbox() {
        return this.$(`div[aria-label='Display Options']`)
            .$('..')
            .$('..')
            .$('.mstrmojo-Box')
            .$$('.mstrmojo-CheckBox')[2]
            .$('label');
    }

    getShowFiltersCheckbox() {
        return this.$(`div[aria-label='Display Options']`)
            .$('..')
            .$('.mstrmojo-Box')
            .$('.mstrmojo-Box')
            .$('.mstrmojo-CheckBox')
            .$('label');
    }

    getReactShowFilterDropdown() {
        return this.$('.mstr-docprops-container').$$('.mstr-docprops-select-col')[3].$('.mstr-docprops-shared-select-nolabel');
    }

    getReactFilterOption(option) {
        return this.$('.mstr-docprops-shared-select-nolabel-dropdown__dropdown-list')
            .$$('span')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === option;
            })[0];
    }

    getPaperSizeOption(option) {
        return this.$(`//div[@aria-label='More Settings']`)
            .$('..')
            .$('.mstrmojo-Box')
            .$('.mstrmojo-DashboardPdfSettings-field')
            .$('.mstrmojo-ui-Pulldown')
            .$$('.item')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === option;
            })[0];
    }

    getOKButton() {
        return this.$(`//button[text()='OK']`);
    }

    getReactAdjustMarginCheckbox() {
        return this.$('//label[contains(text(), "Adjust")]').$('..').$('.mstr-docprops-checkbox').$('input');
    }

    getReactMarginLeftTextbox() {
        return this.$('.mstr-docprops-shared-customMargin').$$('input')[0];
    }

    getReactMarginRightTextbox() {
        return this.$('.mstr-docprops-shared-customMargin').$$('input')[2];
    }

    getReactMarginTopTextbox() {
        return this.$('.mstr-docprops-shared-customMargin').$$('input')[1];
    }

    getReactMarginBottomTextbox() {
        return this.$('.mstr-docprops-shared-customMargin').$$('input')[3];
    }

    getZoomInputBox() {
        return this.$('.mstrmojo-vi-ui-DashboardExportPanel-scaleControl .mstrmojo-TextBox');
    }

    getZoomInIcon() {
        return this.$('.mstrmojo-vi-ui-DashboardExportPanel-zoomIn');
    }

    getZoomOutIcon() {
        return this.$('.mstrmojo-vi-ui-DashboardExportPanel-zoomOut');
    }

    getZoomSliderIcon() {
        return this.$('.sd .t2');
    }

    // Show header/footer
    getCustomizedSetting(option) {
        return this.$(`//div[@aria-label='${option}']`);
    }

    getLeftCustomizedOptions(option1, option2) {
        return this.$(`//div[@aria-label='${option1}']`)
            .$('.mstrmojo-DashboardPdfSettings-alignment.left')
            .$('..')
            .$(`//div[text()='${option2}']`);
    }

    getCenterCustomizedDropdown(option) {
        return this.$(`//div[@aria-label='${option}']`)
            .$('.mstrmojo-DashboardPdfSettings-alignment.center')
            .$('..')
            .$('.mstrmojo-ui-Pulldown-text');
    }

    getCenterCustomizedOptions(option1, option2) {
        return this.$(`//div[@aria-label='${option1}']`)
            .$('.mstrmojo-DashboardPdfSettings-alignment.center')
            .$('..')
            .$(`//div[text()='${option2}']`);
    }

    getRightCustomizedTextbox(option) {
        return this.$(`//label[normalize-space(text())='${option}']`).$('..').$('..').$$('.mstr-docprops-shared-custom')[2].$('.mstr-docprops-shared-custom-input').$('input');
    }

    getFooterRightCustomizedTextbox(option) {
        return this.$(`//label[normalize-space(text())='${option}']`).$('..').$('..').$$('.mstr-docprops-shared-custom')[5].$('.mstr-docprops-shared-custom-input').$('input');
    }

    getRightCustomizedImagebox(option) {
        return this.$(`//label[normalize-space(text())='${option}']`).$('..').$('..').$$('.mstr-docprops-shared-custom')[2].$('.mstr-docprops-shared-custom-input').$('input');
    }

    getRightCustomizedDropdown(option) {
        return this.$(`//label[normalize-space(text())='${option}']`).$('..').$('..').$$('.mstr-docprops-shared-custom')[2].$('.mstr-docprops-select');
    }

    getRightCustomizedOptions(option1, option2) {
        return this.$(`//div[@aria-label='${option1}']`)
            .$('.mstrmojo-DashboardPdfSettings-alignment.right')
            .$('..')
            .$(`//div[text()='${option2}']`);
    }

    getReactLockButton(option) {
        return this.$(`//label[contains(text(), '${option}')]`)
            .$('..')
            .$('.mstr-docprops-shared-icon');
    }

    getExpandGridCheckBox() {
        return this.$('//label[contains(text(), "Expand")]');
    }

    getScaleGridCheckbox() {
        return this.$('//label[contains(text(), "Scale")]');
    }

    getMojoPdfExportSettings() {
        return this.$('.mstrmojo-RootView-exportControl');
    }

    getExportPreview() {
        return this.$('.mstrmojo-vi-ui-rw-DashboardPrintLayout-page');
    }

    getHeaderFooterTextbox(index = 0) {
        return this.$$(
            '.mstrmojo-vi-ui-rw-DashboardLandmarkEditor .mstrmojo-ui-TextAssistant .mstrmojo-ui-TextAssistant-textbox'
        )[index];
    }

    //textbox or image
    getFormatSegmentControl(option) {
        return this.$(`.segment-control-icons.${option}`);
    }

    getFormatImageInputBox() {
        return this.$('.ant-input');
    }

    getFormatImageOKBtn() {
        return this.$('.abaloc-button-editurl .ant-btn');
    }

    getFormatFontStyle(index) {
        return this.$$('.mstr-editor-toggle')[index];
    }

    getFormatFontSizeInput() {
        return this.$('.ant-input-number-input');
    }

    getFormatColorPicker() {
        return this.$('.color-picker-arrow-button');
    }

    getFormatColorOption(index) {
        return this.$$('.color-cell')[index];
    }

    getFormatHorizontalAlignmentButton(index) {
        return this.$$('.abaloc-radio-alh .font-style-icons')[index];
    }

    getFormatVerticalAlignmentButton(index) {
        return this.$$('.abaloc-radio-alv .vertical-align-icons')[index];
    }

    getShowTableOfContentsCheckbox() {
        return this.$(`div[aria-label='Display Options']`)
            .$('..')
            .$('.mstrmojo-Box')
            .$$('.mstrmojo-CheckBox')[0]
            .$('label');
    }

    getShowFilterDropdown() {
        return this.$(`div[aria-label='Display Options']`)
            .$('..')
            .$('.mstrmojo-Box > * > .mstrmojo-DashboardPdfSettings-subfield')
            .$('.mstrmojo-ui-Pulldown-text');
    }

    getFilterOption(option) {
        return this.$(`div[aria-label='Display Options']`)
            .$('..')
            .$('.mstrmojo-Box > * > .mstrmojo-DashboardPdfSettings-subfield')
            .$$('.item')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === option;
            })[0];
    }

    getAdjustMarginCheckbox() {
        return this.$('//label[contains(text(), "Adjust")]');
    }

    getMarginLeftTextbox() {
        return this.$('.mstrmojo-DashboardPdfSettings-marginIconLeft').$('..').$('.mstrmojo-TextBox');
    }

    getMarginRightTextbox() {
        return this.$('.mstrmojo-DashboardPdfSettings-marginIconRight').$('..').$('.mstrmojo-TextBox');
    }

    getMarginTopTextbox() {
        return this.$('.mstrmojo-DashboardPdfSettings-marginIconTop').$('..').$('.mstrmojo-TextBox');
    }

    getMarginBottomTextbox() {
        return this.$('.mstrmojo-DashboardPdfSettings-marginIconBottom').$('..').$('.mstrmojo-TextBox');
    }
    
    getCustomizedDropdown(option) {
        return this.$(`//div[@aria-label='${option}']`)
            .$('.mstrmojo-DashboardPdfSettings-fieldCustomize')
            .$('.mstrmojo-ui-Pulldown-text');
    }

    getCustomizeDropdownSetting(option) {
        return this.$('.mstrmojo-PopupList').$(`//div[text()='${option}']`);
    }

    getLockButton(option) {
        return this.$(`//label[contains(text(), '${option}')]`)
            .$('..')
            .$('..')
            .$('.mstrmojo-DashboardPdfSettings-landmark');
    }

    async clickReactAdjustMarginCheckbox() {
        await this.click({ elem: this.getReactAdjustMarginCheckbox() });
    }

    async setReactMarginLeft(marginLeft) {
        await this.getReactMarginLeftTextbox().setValue(marginLeft);
    }

    async setReactMarginRight(marginRight) {
        await this.getReactMarginRightTextbox().setValue(marginRight);
    }

    async setReactMarginTop(marginTop) {
        await this.getReactMarginTopTextbox().setValue(marginTop);
    }

    async setReactMarginBottom(marginBottom) {
        await this.getReactMarginBottomTextbox().setValue(marginBottom);
    }

    async inputZoomValue(value) {
        const input = await this.getZoomInputBox();
        await this.clear({ elem: input });
        await input.setValue(value);
        await this.enter();
        await this.clickTopLeftCorner();
    }

    async clickZoomInIcon() {
        await this.click({ elem: this.getZoomInIcon() });
    }

    async clickZoomOutIcon() {
        await this.click({ elem: this.getZoomOutIcon() });
    }

    /**
     * Move horizontal scroll bar
     *
     * @param {"left"|"right"} direction moving direction
     * @param {int} pixels number of pixels to move
     */
    async dragZoomSlider(direction, pixels) {
        direction = direction.toLowerCase();
        let scrollbar = await this.getZoomSliderIcon(),
            numOfPixels = direction === 'left' ? -pixels : pixels;
        await this.dragAndDropByPixel(scrollbar, numOfPixels, 0, true);
        await this.sleep(500); // wait for the scroll bar to settle
    }

    async openRangeDropdown() {
        const pulldowns = await $$("//div[@aria-label='Range']/..//div[contains(@class,'mstrmojo-ui-Pulldown-text')]");

        let visiblePulldown;
        for (const el of pulldowns) {
            if (await el.isDisplayed()) {
                visiblePulldown = el;
                break;
            }
        }

        if (!visiblePulldown) {
            throw new Error('No visible Range pulldown found');
        }

        await visiblePulldown.scrollIntoView();
        await visiblePulldown.waitForClickable({ timeout: 5000 });
        await visiblePulldown.click();
    }

    async openContentDropdown() {
        await this.click({ elem: this.getPDFContentSetting() });
    }

    async selectPDFRange(option) {
        await this.click({ elem: this.getPDFRangeOption(option) });
    }

    async selectPDFContent(option) {
        await this.click({ elem: this.getPDFContentOption(option) });
    }

    async clickScaleToPageWidthRadio() {
        await this.click({ elem: this.getScaleToPageWidthRadio() });
    }

    async clickExtenColumnsOverPagesRadio() {
        await this.click({ elem: this.getExtenColumnsOverPagesRadio() });
    }

    async clickRepeatColumnsCheckbox() {
        await this.click({ elem: this.getRepeatColumnsCheckbox() });
    }

    async openPaperSizeDropdown() {
        await this.click({ elem: this.getPaperSizeSetting() });
    }

    async selectPaperSize(option) {
        await this.click({ elem: this.getPaperSizeOption(option) });
    }

    async clickPortraitButton() {
        await this.click({ elem: this.getPortraitButton() });
    }

    async clickLandscapeButton() {
        await this.click({ elem: this.getLandscapeButton() });
    }

    async clickReactShowTableOfContentsCheckbox() {
        await this.click({ elem: this.getReactShowTableOfContentsCheckbox() });
    }

    async clickShowHeaderCheckbox() {
        await this.click({ elem: this.getShowHeaderCheckbox() });
    }

    async clickShowPageNumbersCheckbox() {
        await this.click({ elem: this.getShowPageNumbersCheckbox() });
    }

    async clickShowFiltersCheckbox() {
        await this.click({ elem: this.getShowFiltersCheckbox() });
    }

    async openReactShowFilterDropdown() {
        await this.click({ elem: this.getReactShowFilterDropdown() });
    }

    async selectReactFilteroption(option) {
        await this.click({ elem: this.getReactFilterOption(option) });
    }

    async clickOKButton() {
        await this.click({ elem: this.getOKButton() });
    }

    async clickCustomizedDropdown(option) {
        await this.click({ elem: this.getCustomizedDropdown(option) });
    }

    async clickFooterCustomizedDropdown(option) {
        await this.click({ elem: this.getFooterCustomizedDropdown(option) });
    }

    // Show header/footer, option: Default, Customize
    async selectCustomizedSetting(option) {
        await this.click({ elem: this.getCustomizeDropdownSetting(option) });
    }

    // option1: show header/footer, option2: text/image
    async selectLeftCustomizedOptions(option1, option2) {
        await this.click({ elem: this.getLeftCustomizedDropdown(option1) });
        await this.click({ elem: this.getLeftCustomizedOptions(option1, option2) });
    }

    async selectLeftCustomizedDropdown(option) {
        await this.click({ elem: this.getLeftCustomizedDropdown(option) });
    }

    async setLeftCustomizedText(option, text) {
        await this.getLeftCustomizedTextbox(option).setValue(text);
    }

    async setFooterLeftCustomizedText(option, text) {
        await this.getFooterLeftCustomizedTextbox(option).setValue(text);
    }

    async setLeftCustomizedImage(option, image) {
        await this.getLeftCustomizedImagebox(option).setValue(image);
    }

    // option1: show header/footer, option2: text/image
    async selectCenterCustomizedOptions(option1, option2) {
        await this.click({ elem: this.getCenterCustomizedDropdown(option1) });
        await this.click({ elem: this.getCenterCustomizedOptions(option1, option2) });
    }

    async setCenterCustomizedText(option, text) {
        await this.getCenterCustomizedTextbox(option).setValue(text);
    }

    async setFooterCenterCustomizedText(option, text) {
        await this.getFooterCenterCustomizedTextbox(option).setValue(text);
    }

    async setCenterCustomizedImage(option, image) {
        await this.getCenterCustomizedImagebox(option).setValue(image);
    }

    // option1: show header/footer, option2: text/image
    async selectRightCustomizedOptions(option1, option2) {
        await this.click({ elem: this.getRightCustomizedDropdown(option1) });
        await this.click({ elem: this.getRightCustomizedOptions(option1, option2) });
    }

    async setRightCustomizedText(option, text) {
        await this.getRightCustomizedTextbox(option).setValue(text);
    }

    async setFooterRightCustomizedText(option, text) {
        await this.getFooterRightCustomizedTextbox(option).setValue(text);
    }

    async setRightCustomizedImage(option, image) {
        await this.getRightCustomizedImagebox(option).setValue(image);
    }

    async clickReactLockButton(option) {
        await this.click({ elem: this.getReactLockButton(option) });
    }

    async clickExpandGridCheckbox() {
        await this.click({ elem: this.getExpandGridCheckBox() });
    }

    async clickScaleGridCheckbox() {
        await this.click({ elem: this.getScaleGridCheckbox() });
    }

    /**
     * Click dropDown Option
     * @param {string} dropdownLabel - aria-label of gropDown, e.g. "Range"
     * @param {string} optionText    - dropDown option, e.g. "Entire dashboard"
     */
    async clickReactDropdownOption(dropdownLabel, optionText) {
        const dropdown = await $$(
            `//label[normalize-space(text())='${dropdownLabel}']/..//div[contains(@class,'mstr-docprops-shared-select-withlabel')]`
        );
        let visiblePulldown;
        for (const el of dropdown) {
            if (await el.isDisplayed()) {
                visiblePulldown = el;
                break;
            }
        }

        if (!visiblePulldown) {
            throw new Error('No visible pulldown found');
        }

        await visiblePulldown.scrollIntoView();
        await visiblePulldown.waitForClickable({ timeout: 5000 });
        await visiblePulldown.click();

        const optionSelector = `//div[contains(@class,'mstr-docprops-shared-select-withlabel-dropdown__dropdown-list')]//div[contains(@class,'mstr-rc-base-dropdown__option-text')and .//span[normalize-space(.)='${optionText}']]`;

        await browser.waitUntil(
            async () => {
                const elems = await $$(optionSelector);
                return elems.length > 0;
            },
            { timeout: 5000, timeoutMsg: `Option "${optionText}" not found` }
        );

        const options = await $$(optionSelector);
        for (const opt of options) {
            if (await opt.isDisplayed()) {
                try {
                    await opt.scrollIntoView();
                    await opt.click();
                    return;
                } catch (err) {
                    await browser.execute((el) => {
                        el.scrollIntoView({ block: 'center' });
                        el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                        el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                        el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    }, opt);
                    return;
                }
            }
        }

        throw new Error(`Visible option "${optionText}" not found in dropdown "${dropdownLabel}"`);
    }

    async clickReactPaperSizeDropdownOption(dropdownLabel, optionText) {
        const dropdown = await $$(
            `//label[normalize-space(text())='${dropdownLabel}']/..//div[contains(@class,'mstr-docprops-shared-select-withlabel')]`
        );
        let visiblePulldown;
        for (const el of dropdown) {
            if (await el.isDisplayed()) {
                visiblePulldown = el;
                break;
            }
        }

        if (!visiblePulldown) {
            throw new Error('No visible pulldown found');
        }

        await visiblePulldown.scrollIntoView();
        await visiblePulldown.waitForClickable({ timeout: 5000 });
        await visiblePulldown.click();

        const optionSelector = `//div[contains(@class,'mstr-docprops-shared-paperSize-dropdown__dropdown-list')]//div[contains(@class,'mstr-rc-base-dropdown__option-text')and .//span[normalize-space(.)='${optionText}']]`;

        await browser.waitUntil(
            async () => {
                const elems = await $$(optionSelector);
                return elems.length > 0;
            },
            { timeout: 5000, timeoutMsg: `Option "${optionText}" not found` }
        );

        const options = await $$(optionSelector);
        for (const opt of options) {
            if (await opt.isDisplayed()) {
                try {
                    await opt.scrollIntoView();
                    await opt.click();
                    return;
                } catch (err) {
                    await browser.execute((el) => {
                        el.scrollIntoView({ block: 'center' });
                        el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                        el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                        el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    }, opt);
                    return;
                }
            }
        }

        throw new Error(`Visible option "${optionText}" not found in dropdown "${dropdownLabel}"`);
    }

    async clickReactAdvanceMode() {
        const elem = await $("//a[contains(., 'Configure Header and Footer')]");
        await elem.click();
    }

    async customizeHeaderFooterWithText(index, text) {
        const textbox = await this.getHeaderFooterTextbox(index);
        await textbox.click();
        await this.clear({ elem: textbox });
        await textbox.setValue(text);
    }

    async customizeHeaderFooterWithImage(index) {
        const textbox = await this.getHeaderFooterTextbox(index);
        await textbox.click();
        await this.selectFormatSegmentControl('image');
        await this.getFormatImageInputBox().setValue(
            'https://images.contentstack.io/v3/assets/bltb564490bc5201f31/bltfca3027a7e89bc13/6787e4768c6f504919511797/strategy_logo_black.svg'
        );
        await this.click({ elem: this.getFormatImageOKBtn() });
    }

    async selectFormatSegmentControl(option) {
        await this.click({ elem: this.getFormatSegmentControl(option) });
    }

    async setFontStyle(index) {
        await this.click({ elem: this.getFormatFontStyle(index) });
    }

    async setFontSize(value) {
        const input = await this.getFormatFontSizeInput();
        await this.clear({ elem: input });
        await input.setValue(value);
        await this.enter();
    }

    async setFontColor(index) {
        await this.click({ elem: this.getFormatColorPicker() });
        const colorOption = await this.getFormatColorOption(index);
        await colorOption.waitForDisplayed({ timeout: 5000 });
        await colorOption.click();
        await this.selectFormatSegmentControl('textbox');
    }

    async setFontHorizontalAlignment(index) {
        await this.click({ elem: this.getFormatHorizontalAlignmentButton(index) });
    }

    async setFontVerticalAlignment(index) {
        await this.click({ elem: this.getFormatVerticalAlignmentButton(index) });
    }

    async clickAdvanceModeOkButton() {
        const btn = await $("//div[@class='btn' and .//span[normalize-space(text())='OK']]");
        await btn.click();
    }

    async clickAdvanceModeCancelButton() {
        const btn = await $("//div[@class='btn' and .//span[normalize-space(text())='Cancel']]");
        await btn.click();
    }

    async selectExportToPDFOnVisualizationMenu(title) {
        const elem = await $(`//div[@aria-label='${title}']`).$('//div[@aria-label="Visualization Options"]');
        await this.hover({ elem: elem });
        await elem.click();
        await this.sleep(1000);
        const exportBtn = await $('//div[@class="mtxt" and text()="Export"]');
        await exportBtn.click();
        const pdfBtn = await $('//div[@class="mtxt" and text()="PDF"]');
        await pdfBtn.click();
    }

    async clickReactVizExportButton() {
        const buttons = await $$('//button[.//span[normalize-space()="Export"]]');

        const visibleButton = await buttons.find(async (b) => await b.isDisplayed());

        if (!visibleButton) {
            throw new Error('No visible Export button found');
        }

        await visibleButton.scrollIntoView();
        await visibleButton.waitForClickable({ timeout: 5000 });
        await visibleButton.click();
    }

    async clickDropdownOption(dropdownLabel, optionText) {
        const dropdown = await $$(
            `//div[@aria-label='${dropdownLabel}']/..//div[contains(@class,'mstrmojo-ui-Pulldown')]`
        );
        let visiblePulldown;
        for (const el of dropdown) {
            if (await el.isDisplayed()) {
                visiblePulldown = el;
                break;
            }
        }
        if (!visiblePulldown) {
            throw new Error('No visible pulldown found');
        }
        await visiblePulldown.scrollIntoView();
        await visiblePulldown.waitForClickable({ timeout: 5000 });
        await visiblePulldown.click();

        const optionSelector = `//div[contains(@class,'mstrmojo-popupList-scrollBar')]//div[@role='menuitem' and normalize-space(text())='${optionText}']`;

        await browser.waitUntil(
            async () => {
                const elems = await $$(optionSelector);
                return elems.length > 0;
            },
            { timeout: 5000, timeoutMsg: `Option "${optionText}" not found` }
        );
        const options = await $$(optionSelector);
        for (const opt of options) {
            if (await opt.isDisplayed()) {
                try {
                    await opt.scrollIntoView();
                    await opt.click();
                    return;
                } catch (err) {
                    await browser.execute((el) => {
                        el.scrollIntoView({ block: 'center' });
                        el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                        el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                        el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    }, opt);
                    return;
                }
            }
        }
        throw new Error(`Visible option "${optionText}" not found in dropdown "${dropdownLabel}"`);
    }

    async clickShowTableOfContentsCheckbox() {
        await this.getShowTableOfContentsCheckbox().click();
    }

    async clickLockButton(option) {
        await this.getLockButton(option).click();
    }

    async openShowFilterDropdown() {
        await this.getShowFilterDropdown().click();
    }

    async selectFilteroption(option) {
        await this.click({ elem: this.getFilterOption(option) });
    }

    async clickAdjustMarginCheckbox() {
        await this.click({ elem: this.getAdjustMarginCheckbox() });
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

    async clickReactPortraitButton() {
        const btn = await $('//button[@role="radio" and @aria-label="Portrait"]');
        await btn.click();
    }

    async clickReactLandscapeButton() {
        const btn = await $('//button[@role="radio" and @aria-label="Landscape"]');
        await btn.click();
    }

    async clickReactExpandGridCheckbox() {
        const checkbox = await $('//label[contains(text(),"Expand")]/ancestor::*[1]//input');
       await checkbox.click();
    }

    async clickReactScaleGridCheckbox() {
        const checkbox = await $('//label[contains(text(),"Scale")]/ancestor::*[1]//input');
       await checkbox.click();
    }

}
