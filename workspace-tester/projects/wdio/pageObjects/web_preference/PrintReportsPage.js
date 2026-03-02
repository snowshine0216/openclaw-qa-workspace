import BasePreference from './BasePreference.js';

export default class PrintReportsPage extends BasePreference {
    // element locator
    getScalingSection() {
        return this.getPreferenceSection('Scaling');
    }

    getAdjustFontRadioButton() {
        return this.$$('#PDFScalingOption')[0];
    }

    getFitToRadioButton() {
        return this.$$('#PDFScalingOption')[1];
    }

    getOrientatioSection() {
        return this.getPreferenceSection('Orientation');
    }

    getPrintToPortraitRadioButton() {
        return this.getOrientatioSection().$$('#PDFPaperOrientationOption')[0];
    }

    getPrintToLandscapeRadioButton() {
        return this.getOrientatioSection().$$('#PDFPaperOrientationOption')[1];
    }

    getPrintCoverPageSection() {
        return this.getPreferenceSection('Print cover page');
    }

    getPrintWithFilterDetailsRadioButton() {
        return this.getPrintCoverPageSection().$$('#PDFCoverPageDetailsContents')[0];
    }

    getPrintWithReportDetailsRadioButton() {
        return this.getPrintCoverPageSection().$$('#PDFCoverPageDetailsContents')[1];
    }

    getCoverPageLocationSection() {
        return this.getPreferenceSection('Cover page location');
    }

    getCoverPageBeforeReportRadioButton() {
        return this.getPrintCoverPageSection().$$('#PDFCoverPageLocation')[0];
    }

    getCoverPageAfterReportRadioButton() {
        return this.getPrintCoverPageSection().$$('#PDFCoverPageLocation')[1];
    }

    getAdjustFontToInputbox() {
        return this.getInputboxItem('PDFShrinkFontPercentage');
    }

    getFitToPagesWideInputbox() {
        return this.getInputboxItem('PDFFitToPagesWide');
    }

    getFitToPagesTallInputbox() {
        return this.getInputboxItem('PDFFitToPagesTall');
    }

    // action helper
    async setAdjustFontTo(text) {
        await this.click({ elem: this.getAdjustFontToInputbox() });
        await this.clear({ elem: this.getAdjustFontToInputbox() });
        await this.getAdjustFontToInputbox().setValue(text);
    }

    async setFitToPagesWide(text) {
        await this.click({ elem: this.getFitToPagesWideInputbox() });
        await this.clear({ elem: this.getFitToPagesWideInputbox() });
        await this.getFitToPagesWideInputbox().setValue(text);
    }

    async setFitToPagesTall(text) {
        await this.click({ elem: this.getFitToPagesTallInputbox() });
        await this.clear({ elem: this.getFitToPagesTallInputbox() });
        await this.getFitToPagesTallInputbox().setValue(text);
    }

    async setAdjustFont() {
        await this.click({ elem: this.getAdjustFontRadioButton() });
    }

    async setFitTo() {
        await this.click({ elem: this.getFitToRadioButton() });
    }

    async setPrintToPortrait() {
        await this.click({ elem: this.getPrintToPortraitRadioButton() });
    }

    async setPrintToLandscape() {
        await this.click({ elem: this.getPrintToLandscapeRadioButton() });
    }

    async setPrintWithFilterDetails() {
        await this.click({ elem: this.getPrintWithFilterDetailsRadioButton() });
    }

    async setPrintWithReportDetails() {
        await this.click({ elem: this.getPrintWithReportDetailsRadioButton() });
    }

    async setCoverPageBeforeReport() {
        await this.click({ elem: this.getCoverPageBeforeReportRadioButton() });
    }

    async setCoverPageAfterReport() {
        await this.click({ elem: this.getCoverPageAfterReportRadioButton() });
    }

    async setPrintReportsDropdown(value, option) {
        await this.click({ elem: this.getDropdown(value) });
        const item = await this.getDropdown(value)
            .$$('option')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(option);
            })[0];
        await this.waitForElementVisible(item);
        await item.click();
    }

    // assertion helper

    async getAdjustFontToText() {
        return this.getAdjustFontToInputbox().$('option[selected]').getText();
    }

    async isSetAdjustFont() {
        return this.getAdjustFontRadioButton().isSelected();
    }

    async isSetFitTo() {
        return this.getFitToRadioButton().isSelected();
    }

    async isSetPrintToPortrait() {
        return this.getPrintToPortraitRadioButton().isSelected();
    }

    async isSetPrintToLandscape() {
        return this.getPrintToLandscapeRadioButton().isSelected();
    }

    async isSetPrintWithFilterDetails() {
        return this.getPrintWithFilterDetailsRadioButton().isSelected();
    }

    async isSetPrintWithReportDetails() {
        return this.getPrintWithReportDetailsRadioButton().isSelected();
    }

    async isSetCoverPageBeforeReport() {
        return this.getCoverPageBeforeReportRadioButton().isSelected();
    }

    async isSetCoverPageAfterReport() {
        return this.getCoverPageAfterReportRadioButton().isSelected();
    }
}
