import BasePreference from './BasePreference.js';

export default class ExportReportsPage extends BasePreference {
    // element locator
    getExportGridToExcelRadioButton() {
        return this.$('#exportFormatGrids_excelPlaintextIServer');
    }

    getExportGridToCsvRadioButton() {
        return this.$('#exportFormatGrids_csvIServer');
    }

    getExportGridToExcelWithFormattingRadioButton() {
        return this.$('#exportFormatGrids_excelFormattingGridsIServer');
    }

    getExportGridToHtmlRadioButton() {
        return this.$('#exportFormatGrids_htmlGrids');
    }

    getExportGridToPlainTextRadioButton() {
        return this.$('#exportFormatGrids_plaintextIServer');
    }

    getExportGraphToExcelRadioButton() {
        return this.$('#exportFormatGraphs_excelFormattingGraphsIServer');
    }

    getExportGraphToHtmlRadioButton() {
        return this.$('#exportFormatGraphs_htmlGraphs');
    }

    getExportHtmlToHtmlRadioButton() {
        return this.$('#exportFormatDocuments_htmlDocuments');
    }

    getExportHtmlToExcelRadioButton() {
        return this.$('#exportFormatDocuments_excelWithoutFormatting');
    }

    // action helper
    async setExportReportsDropdown(value, option) {
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

    async setExportGridToExcel() {
        return this.click({ elem: this.getExportGridToExcelRadioButton() });
    }

    async setExportGridToCsv() {
        return this.click({ elem: this.getExportGridToCsvRadioButton() });
    }

    async setExportGridToExcelWithFormatting() {
        return this.click({ elem: this.getExportGridToExcelWithFormattingRadioButton() });
    }

    async setExportGridToHtml() {
        return this.click({ elem: this.getExportGridToHtmlRadioButton() });
    }

    async setExportGridToPlainText() {
        return this.click({ elem: this.getExportGridToPlainTextRadioButton() });
    }

    async setExportGraphToExcel() {
        return this.click({ elem: this.getExportGraphToExcelRadioButton() });
    }

    async setExportGraphToHtml() {
        return this.click({ elem: this.getExportGraphToHtmlRadioButton() });
    }

    async setHtmlGraphToHtml() {
        return this.click({ elem: this.getExportHtmlToHtmlRadioButton() });
    }

    async setExportHtmlToExcel() {
        return this.click({ elem: this.getExportHtmlToExcelRadioButton() });
    }

    // assertion helper

    async isExportGridToExcelSelected() {
        return this.getExportGridToExcelRadioButton().isSelected();
    }

    async isExportGridToCsvSelected() {
        return this.getExportGridToCsvRadioButton().isSelected();
    }

    async isExportGridToExcelWithFormattingSelected() {
        return this.getExportGridToExcelWithFormattingRadioButton().isSelected();
    }

    async isExportGridToHtmlSelected() {
        return this.getExportGridToHtmlRadioButton().isSelected();
    }

    async isExportGridToPlainTextSelected() {
        return this.getExportGridToPlainTextRadioButton().isSelected();
    }

    async isExportGraphToExcelSelected() {
        return this.getExportGraphToExcelRadioButton().isSelected();
    }

    async isExportGraphToHtmlSelected() {
        return this.getExportGraphToHtmlRadioButton().isSelected();
    }

    async isExportHtmlToHtmlSelected() {
        return this.getExportHtmlToHtmlRadioButton().isSelected();
    }

    async isExportHtmlToExcelSelected() {
        return this.getExportHtmlToExcelRadioButton().isSelected();
    }
}
