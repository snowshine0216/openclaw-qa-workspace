import BasePreference from './BasePreference.js';
import { Key } from 'webdriverio';

export default class ColorPalettePage extends BasePreference {
    // element locator
    getPaletteList() {
        return this.$('.mstrmojo-Box.mstrmojo-PaletteList');
    }

    getEditablePaletteList() {
        return this.getPaletteList().$$(
            '.item.cf.paletteEditable, .item.cf.belongLightTheme.paletteEditable, .item.cf.belongLightTheme.paletteEditable.first, item.cf.paletteEditable.first'
        );
    }

    getPaletteContainer(parent) {
        return parent.$('.paletteColorsContainer .paletteColors');
    }

    getEditablePaletteContainer(index) {
        return this.getPaletteContainer(this.getEditablePaletteList()[index]);
    }

    getAddAPaletteButton() {
        return this.$('.mstrmojo-Label.newPalette');
    }

    getColorEditor() {
        return '.mstrmojo-Editor.mstrmojo-MultipleColorsPicker.modal';
    }

    getPaletteEditorNameInputBox() {
        return this.$('.mstrmojo-TextBoxWithLabel.paletteName .mstrmojo-TextBox');
    }

    getColorPickerSwatchBtn() {
        return this.$('.acpBtn.acpSwatchBtn');
    }

    getColorPickerPaletteBtn() {
        return this.$('.acpBtn.acpPaletteBtn');
    }

    getColorList() {
        return this.$('.mstrmojo-ListBase.mstrmojo-ui-ColorList');
    }

    getColorWheel() {
        return this.$('.mstrmojo-ui-ColorWheel');
    }

    getColorHandle() {
        return this.$('.cwHandle');
    }

    getColorHEXInputBox() {
        return this.$('.mstrmojo-TextBoxWithLabel.on .mstrmojo-TextBox');
    }

    getColorItemFromColorList(color) {
        return this.getColorList().$(`div[style="background-color:${color}"]`);
    }

    getSelectedColorList() {
        return this.$('.mstrmojo-ListBase.mstrmojo-PaletteColorList.mstrmojo-ui-ColorList .ColorsContainer');
    }

    getSelectedColorItem(color) {
        return this.getSelectedColorList().$(`div[style="background-color:${color}"]`);
    }

    getOkButtonFromColorEditor() {
        return this.$('.mstrmojo-Button.mstrmojo-WebButton.hot.mstrmojo-Editor-button .mstrmojo-Button-text');
    }

    getSpecifiedColorPalette(text) {
        return this.getPaletteList()
            .$$('.item.cf')
            .filter(async (elem) => {
                const elemText = await elem.$('.paletteLabel').getText();
                return elemText === text;
            })[0];
    }

    getSpecifiedEditableLable(text) {
        return this.getSpecifiedColorPalette(text).$('.mstrmojo-EditableLabel.hasEditableText');
    }

    getSpecifiedColorPaletteLable(text) {
        return this.getSpecifiedColorPalette(text).$('.paletteLabel');
    }

    getSpecifiedPaletteContainer(text) {
        return this.getSpecifiedColorPalette(text).$('.paletteColorsContainer .paletteColors');
    }

    getSpecifiedPaletteCheckbox(text) {
        return this.getSpecifiedColorPalette(text).$('.themeMarker.light .lightToggler');
    }

    getPaletteContainerMenu() {
        return this.$('.mstrmojo-ui-Menu-item-container');
    }

    getEditBtn() {
        return this.getPaletteContainerMenu()
            .$$('.item.mstrmojo-ui-Menu-item')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === 'Edit';
            })[0];
    }

    getDeleteBtn() {
        return this.getPaletteContainerMenu()
            .$$('.item.mstrmojo-ui-Menu-item')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === 'Delete';
            })[0];
    }

    getConfirmDeleteDialog() {
        return this.$('.mstrmojo-Editor.mstrmojo-alert.modal');
    }

    getConfirmDeleteBtn() {
        return this.getConfirmDeleteDialog().$(
            '.mstrmojo-Button.mstrmojo-WebButton.hot.mstrmojo-Editor-button .mstrmojo-Button-text '
        );
    }

    getSelectedColorTooltip() {
        return this.$('.mstrmojo-Tooltip-content.mstrmojo-scrollNode');
    }

    getSelectDefaultPaletteDropdown() {
        return this.$('.mstrmojo-ui-PreviewButton .cf .btn');
    }

    getPaletteDropdownList() {
        return this.$('.mstrmojo-popupList-scrollBar.mstrmojo-scrollNode');
    }

    getSpecifiedPaletteFromDropdownList(text) {
        return this.getPaletteDropdownList().$(`div[title="${text}"]`);
    }

    getDefaultPalette() {
        return this.$('.mstrmojo-ui-PreviewButton .cf .preview .paletteColors');
    }

    getStateIndicator(text) {
        return this.getSpecifiedColorPalette(text).$('.mstrmojo-StateIndicator');
    }

    getNoprivilegeAlert() {
        return this.getAlertDialog().$('.mstrmojo-Label');
    }

    getOkButtonOnAlertDialog() {
        return this.getAlertDialog()
            .$$('.mstrmojo-Button-text')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === 'OK';
            })[0];
    }

    // action helper
    async addPalette(name, colorlist, colorwheel) {
        await this.click({ elem: this.getAddAPaletteButton() });
        await this.scrollPageToBottom();
        await this.renamePaletteInPaletteEditor(name);
        await this.addColorFromColorList(colorlist);
        await this.addColorFromColorWheel(colorwheel);
        await this.savePalette();
        await this.waitForCircleDisappear(name);
    }

    async renamePaletteInPaletteEditor(text) {
        await this.click({ elem: this.getPaletteEditorNameInputBox() });
        await this.clear({ elem: this.getPaletteEditorNameInputBox() });
        await this.getPaletteEditorNameInputBox().setValue(text);
    }

    async addColorFromColorList(colorlist) {
        for (const el of colorlist) {
            const exist = await this.getColorWheel().isDisplayed();
            if (exist === true) {
                await this.click({ elem: this.getColorPickerSwatchBtn() });
            }
            await this.click({ elem: this.getColorItemFromColorList(el) });
        }
    }

    async addColorFromColorWheel(colorwheel) {
        for (const el of colorwheel) {
            const exist = await this.getColorList().isDisplayed();
            if (exist === true) {
                await this.click({ elem: this.getColorPickerPaletteBtn() });
            }
            // await this.getColorHEXInputBox().clear().setValue(el);
            await this.click({ elem: this.getColorHEXInputBox() });
            await this.clear({ elem: this.getColorHEXInputBox() });
            await this.getColorHEXInputBox().setValue(el);
            await this.scrollPageToBottom();
            await this.doubleClick({ elem: this.getColorHandle() });
        }
    }

    async removeColorFromSelectedColorList(color) {
        await this.click({ elem: this.getSelectedColorItem(color) });
    }

    async renamePaletteInPaletteListPage(text1, text2) {
        await this.click({ elem: this.getSpecifiedColorPaletteLable(text1) });
        await browser.keys(Key.Delete);
        await browser.keys(text2);
        await this.enter();
    }

    async savePalette() {
        await this.click({ elem: this.getOkButtonFromColorEditor() });
        const title = this.getPaletteEditorNameInputBox().getText();
        await this.waitForCircleDisappear(title);
    }

    async openPaletteEditor(text) {
        await this.click({ elem: this.getSpecifiedPaletteContainer(text) });
    }

    async deletePalette(palettelist) {
        for (const el of palettelist) {
            await this.rightClick({ elem: this.getSpecifiedPaletteContainer(el) });
            await this.click({ elem: this.getDeleteBtn() });
            const exist = await this.getConfirmDeleteBtn().isDisplayed();
            if (exist === true) {
                await this.click({ elem: this.getConfirmDeleteBtn() });
            }
            await this.waitForCircleDisappear(el);
        }
    }

    async waitForCircleDisappear(text) {
        return this.waitForElementInvisible(this.getStateIndicator(text), this.defaultWaitTimeout, 'Time Out');
    }

    async waitForPaletteDisappear(palette) {
        return this.waitForElementInvisible(
            this.getSpecifiedPaletteContainer(palette),
            this.defaultWaitTimeout,
            'Time Out'
        );
    }

    async checkSpecifiedPaletteCheckbox(text) {
        await this.click({ elem: this.getSpecifiedPaletteCheckbox(text) });
        await this.waitForCircleDisappear(text);
    }

    async uncheckSpecifiedPaletteCheckbox(text) {
        await this.waitForElementVisible(this.getPreferencePanel());
        const exist = await this.isSpecifiedColorPaletteCheckboxChecked(text);
        if (exist === true) {
            await this.click({ elem: this.getSpecifiedPaletteCheckbox(text) });
            await this.waitForCircleDisappear(text);
        }
    }

    async selectDefaultPalette(text) {
        await this.click({ elem: this.getSelectDefaultPaletteDropdown() });
        await this.click({ elem: this.getSpecifiedPaletteFromDropdownList(text) });
        await this.sleep(1000); // wait for default palette setting
    }

    async deleteAllEditablePalettes() {
        const palettesLength = await this.getEditablePaletteList().length;
        for (let i = 0; i < palettesLength; i++) {
            await this.moveToElement(this.getEditablePaletteList()[0]);
            await this.rightClick({ elem: this.getEditablePaletteContainer(0) });
            await this.click({ elem: this.getDeleteBtn() });
            const exist = await this.getConfirmDeleteBtn().isDisplayed();
            if (exist === true) {
                await this.click({ elem: this.getConfirmDeleteBtn() });
            }
            await this.sleep(1000); // wait for palette delete
        }
    }

    async addPaletteWithAlert(colorlist) {
        await this.click({ elem: this.getAddAPaletteButton() });
        await this.scrollPageToBottom();
        await this.addColorFromColorList(colorlist);
        await this.click({ elem: this.getOkButtonFromColorEditor() });
        await this.waitForElementVisible(this.getAlertDialog());
    }

    async clickOkOnAlertDialog() {
        await this.click({ elem: this.getOkButtonOnAlertDialog() });
        await this.waitForElementInvisible(this.getAlertDialog());
    }

    // assertion helper
    async isSpecifiedColorPaletteExist(text) {
        return this.getSpecifiedColorPalette(text).isDisplayed();
    }

    async isSpecifiedColorPaletteCheckboxChecked(text) {
        await this.waitForCircleDisappear(text);
        const available = await this.getSpecifiedColorPalette(text).$('.lightToggler');
        const css = await available.getCSSProperty('background-position');
        if (css.value === '50% -3px') {
            return true;
        }
        return false;
    }

    async getDefaultPaletteTitle() {
        return this.getDefaultPalette().getAttribute('title');
    }

    async numberOfEditablePalettes() {
        return this.getEditablePaletteList().length;
    }

    async getNoprivilegeAlertText() {
        return this.getNoprivilegeAlert().getText();
    }
}
