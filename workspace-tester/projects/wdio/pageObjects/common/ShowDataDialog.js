import BasePage from '../base/BasePage.js';
import PDFExportWindow from '../export/PDFExportWindow.js';
import { getAttributeValue } from '../../utils/getAttributeValue.js';
import { loadingDialog } from '../dossierEditor/components/LoadingDialog.js';
import { scrollElementToBottom, scrollElementToMiddle } from '../../utils/scroll.js';
import VizPanelForGrid from '../authoring/VizPanelForGrid.js';

export default class ShowDataDialog extends BasePage {
    constructor() {
        super();
        this.pdfExportWindow = new PDFExportWindow();
        this.vizPanelForGrid = new VizPanelForGrid();
    }

    getShowDataDialog() {
        return this.$('.mstrmojo-ViewDataDialog.modal');
    }

    getShowDataPopup() {
        return this.$('.mstrmojo-ViewDataDialog.mstrmojo-popup-widget-hosted');
    }

    getAddDataButton() {
        return this.getShowDataDialog().$('.item.add');
    }

    getAddDataContainer() {
        return this.getShowDataPopup().$('.datasetObjects');
    }

    getAddDataOkButton() {
        return this.getAddDataContainer().$$('.mstrmojo-Button.mstrmojo-WebButton.hot')[0];
    }

    getExportSpinner() {
        return this.getShowDataDialog().$('.mstrd-spinner-export');
    }

    getAddDataAttributesList() {
        return this.getAddDataContainer()
            .$$('.mstrmojo-VIPanel')
            .filter(async (elem) => {
                const elemText = await elem.$('.mstrmojo-EditableLabel').getText();
                return elemText === 'Attributes';
            })[0];
    }

    getAddDataMetricsList() {
        return this.getAddDataContainer()
            .$$('.mstrmojo-VIPanel')
            .filter(async (elem) => {
                const elemText = await elem.$('.mstrmojo-EditableLabel').getText();
                return elemText === 'Metrics';
            })[0];
    }

    getShowDataColumnBorder(colNum) {
        return this.$(
            `//div[contains(@class,'ViewData')]//div[contains(@class,'ag-header-cell') and contains(@class, 'ag-focus-managed') and @aria-colindex=${colNum}]//div[@class='ag-header-cell-resize']`
        );
    }

    getRowCount() {
        return this.$('.mstrmojo-ViewDataDialog .mstrmojo-rowcount');
    }

    getHeaderTitle() {
        return this.$(`//div[contains(@class, 'mstrmojo-Editor-title')]`);
    }

    async getAddDataElementCheckbox({ title, elem }) {
        let itemList;
        if (title === 'Attributes') {
            itemList = this.getAddDataAttributesList();
        } else {
            itemList = this.getAddDataMetricsList();
        }
        const xpathCommand = `.//div[contains(@class, 'item') and .//span[contains(text(),'${elem}')]]`;
        return itemList.$(`${xpathCommand}`);
    }

    getShowDataExportButton() {
        return this.getShowDataDialog().$('.btn-export-data');
    }

    getShowDataCloseButton() {
        return this.getShowDataDialog()
            .$$('.mstrmojo-Button.mstrmojo-WebButton.hot.mstrmojo-Editor-button')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === 'Close';
            })[0];
    }

    getShowDataExportTypeContainer() {
        return this.$('.mstrmojo-ListBase.mstrmojo-ui-Menu');
    }

    getShowDataExportTypeButton(type) {
        return this.getShowDataExportTypeContainer()
            .$$('.item')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === type;
            })[0];
        //return this.getShowDataExportTypeContainer().element(by.cssContainingText('.item', `${type}`));
    }

    getDatasetContainer() {
        return this.getShowDataDialog().$('.mstrmojo-gridBox');
    }

    getDatasetHeaders() {
        return this.getShowDataDialog().$('.ag-header-container .ag-header-row-column').$$('.ag-header-cell');
    }

    getDatasetHeaderByName(headerName) {
        return this.getDatasetHeaders().filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === headerName;
        })[0];
    }

    getColumnEdge(index) {
        return this.getDatasetContainer().$$('.xrsz')[index];
    }

    getColumnSetDropDown() {
        return this.getShowDataDialog().$('.mstrmojo-columnset-pulldown');
    }

    getColumnSetOption(option) {
        const xpathCommand = this.getCSSContainingText('item', option);
        return this.getColumnSetDropDown().$(`${xpathCommand}`);
    }

    // action

    async clickAddDataButton() {
        await this.click({ elem: this.getAddDataButton() });
        return this.waitForElementVisible(this.getAddDataContainer());
    }

    async addElementToDataset({ title, elem }) {
        return this.click({ elem: await this.getAddDataElementCheckbox({ title, elem }) });
    }

    async clickAddDataOkButton() {
        await this.click({ elem: this.getAddDataOkButton() });
        return this.waitForElementInvisible(this.getAddDataContainer());
    }

    async clickShowDataExportButton() {
        await this.click({ elem: this.getShowDataExportButton() });
        return this.waitForElementVisible(this.getShowDataExportTypeContainer());
    }

    async clickShowDataExportButtonNoPrivilege() {
        await this.click({ elem: this.getShowDataExportButton() });
        //return this.waitForElementVisible(this.getShowDataExportTypeButton('Excel'));
    }

    async clickShowDataCloseButton() {
        await this.click({ elem: await this.getShowDataCloseButton() });
        await this.waitForElementStaleness(await this.getShowDataDialog());
        return this.waitForItemLoading();
    }

    async exportShowData(fileType) {
        await this.click({ elem: this.getShowDataExportTypeButton(fileType) });
        if (fileType === 'PDF') {
            await this.waitForElementVisible(this.pdfExportWindow.getMojoPDFExportSettingsEditor());
        } else {
            await this.waitForElementStaleness(this.getExportSpinner(), {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                msg: `Export ${fileType} takes too long`,
            });
        }
        return this.sleep(500);
    }

    async scrollDatasetToBottom() {
        await this.hover({ elem: this.getDatasetContainer() });
        const elem = this.getDatasetContainer().$('.ag-row-no-animation');
        const offset = await getAttributeValue(elem, 'scrollHeight');
        await this.scrollDown(elem, offset);
        // wait for animation to be completed
        return this.sleep(1000);
    }

    async sortByColumnHeader(headerName) {
        const header = await this.getDatasetHeaderByName(headerName);
        await this.click({ elem: header });
    }

    async selectColumnSetOption(option) {
        await this.clickAndNoWait({ elem: this.getColumnSetDropDown() });
        await this.click({ elem: this.getColumnSetOption(option) });
        await this.waitForElementVisible(this.getShowDataDialog());
    }

    // assertion helper

    async getDatasetRowCount() {
        await this.waitForElementVisible(this.getShowDataDialog());
        const count = await this.getShowDataDialog().$('.mstrmojo-rowcount').getText();
        return parseInt(count.split(' ')[0], 10);
    }

    async getColumnSetOptionText() {
        return this.getColumnSetDropDown().$('.mstrmojo-ui-Pulldown-text ').getText();
    }

    async isShowDataExportTypePresent(type) {
        return this.getShowDataExportTypeButton(type).isDisplayed();
    }

    async isShowDataExportButtonAvailable() {
        return this.getShowDataExportButton().isDisplayed();
    }

    async isShowDataDialogDisplayed() {
        const el = await this.getShowDataDialog();
        return await el.isDisplayed();
    }

    getObjectForShowDataGrid(objectName) {
        return this.getShowDataDialog().$(
            `(.//div[contains(@class,'mstrmojo-AgXtab-content')]//div[contains(@class,'ag-cell')]//span[text()="${objectName}"])[1]`
        );
    }

    async closeShowDataDialog(authoring = false) {
        const path = authoring
            ? `//div[contains(@class, 'mstrmojo-ViewDataDialog')]//div[contains(@class, 'mstrmojo-Editor-close')]`
            : '.mstrmojo-ViewDataDialog .mstrmojo-footerBox .mstrmojo-Button-text';
        const button = this.$(path);
        await this.clickOnElement(button);
    }

    get toolbar() {
        return this.getShowDataDialog().$$(`.//div[contains(@class, 'mstrmojo-toolBox')]`)[0];
    }

    get agGridColumnSetPulldown() {
        return this.toolbar.$(`.//div[contains(@class, 'mstrmojo-columnset-pulldown')]`);
    }

    get agGridColumnSetPulldownText() {
        return this.toolbar.$(
            `//div[contains(@class, 'mstrmojo-columnset-pulldown')]//div[contains(@class, 'mstrmojo-ui-Pulldown-text')]`
        );
    }

    getAgGridColumnSetFromColumnSetPullDown(columnSetName) {
        return this.$(
            `.//div[contains(@class, 'mstrmojo-Editor-content')]//div[contains(@class, 'mstrmojo-toolBox')]//div[contains(@class,mstrmojo-box)]//div[contains(@class, 'container')]//div[contains(@class, 'mstrmojo-PopupList')]//div[contains(@class, 'mstrmojo-popupList-scrollBar')]//div[contains(@class, 'item') and text() = '${columnSetName}']`
        );
    }

    async changeColumnSetInAgGrid(columnSetName) {
        await this.clickOnElement(this.agGridColumnSetPulldown);
        await this.clickOnElement(this.getAgGridColumnSetFromColumnSetPullDown(columnSetName));
    }

    getCellInshowDataGrid(row, col) {
        return this.getShowDataDialog().$(
            `.//div[contains(@class,'mstrmojo-AgXtab-content')]//div[@r='${row}' and @c='${col}']`
        );
    }

    async getHeadersInshowDataGrid() {
        await this.waitForDynamicElementLoading();
        const headers = await this.getDatasetHeaders();
        const headerText = await Promise.all(headers.map(async (cell) => cell.getText().then((text) => text.trim())));
        return headerText;
    }

    getObjectHeaderForShowDataSorting(objectName) {
        return this.$(
            `(//div[contains(@class,'mstrmojo-ViewDataDialog')]//div[contains(@class,'mstrmojo-AgXtab-content')]//span[text()='${objectName}'])`
        );
    }

    async sortShowDataGridbyClickingHeader(objectName) {
        const objectElement = await this.getObjectHeaderForShowDataSorting(objectName);
        await this.clickOnElement(objectElement);
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await browser.pause(1000);
    }

    get addDataButton() {
        return this.toolbar.$(`.//div[contains(@class, 'mstrmojo-WebButton')]`);
    }

    get addAsGridButton() {
        return this.toolbar.$(`.//div[contains(@class, 'mstrmojo-addGridButton')]`);
    }

    get addDataMenuPopup() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-ViewDataDialog')]//div[contains(@class, 'mstrmojo-ui-MenuPopup')]`
        );
    }

    async getAddDataList(title) {
        let addDataList = [];
        if (title === 'Attributes') {
            const attributesList = await this.getAddDataAttributesList().$$('.item');
            for (const item of attributesList) {
                const itemText = await item.getText();
                addDataList.push(itemText.trim());
            }
        } else if (title === 'Metrics') {
            const metricsList = await this.getAddDataMetricsList().$$('.item');
            for (const item of metricsList) {
                const itemText = await item.getText();
                addDataList.push(itemText.trim());
            }
        }
        return addDataList;
    }

    getAddDataPopupButtons(buttonName) {
        return this.addDataMenuPopup.$(
            `.//div[contains(@class, 'mstrmojo-Button-text ') and text() = '${buttonName}']`
        );
    }

    getUnitInUnitSelectionList(unitName) {
        return this.addDataMenuPopup.$(`.//span[text() = '${unitName}']`);
    }

    async addGridToViz() {
        await this.clickOnElement(this.addAsGridButton);
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed(30);
    }

    async selectUnitsInUnitSelectionPopup(objectNames) {
        await this.clickOnElement(this.addDataButton);
        const elements = objectNames.split(',');
        for (const element of elements) {
            await this.clickOnElement(this.getUnitInUnitSelectionList(element));
        }
    }

    async applyAndCloseUnitSelectionPopup() {
        await this.clickOnElement(this.getAddDataPopupButtons('OK'));
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed(120);
    }

    async cancelAndCloseUnitSelectionPopup() {
        await this.clickOnElement(this.getAddDataPopupButtons('Cancel'));
    }

    getHeaderInShowDataGrid(objectName) {
        return this.$(
            `//div[contains(@class,'mstrmojo-ViewDataDialog')]//div[contains(@class, 'ag-header-cell') and contains(@class, 'ag-focus-managed') and not(contains(@class,'invisible'))]//span[text()="${objectName}"]`
        );
    }

    getVerticalScrollContent() {
        return this.getShowDataDialog().$('.ag-body-viewport');
    }

    getHorizantalScrollContent() {
        return this.getShowDataDialog().$('.ag-body-horizontal-scroll-viewport');
    }

    async moveShowDataVerticalScrollBarToBottom(pos) {
        const content = await this.getVerticalScrollContent();

        if (pos === 'middle') {
            await scrollElementToMiddle(content);
        } else {
            await scrollElementToBottom(content);
        }
        await browser.pause(10000);
    }

    getGridCellByPosition(row, col) {
        return this.$(
            `//div[contains(@class,'mstrmojo-ViewDataDialog')]//div[contains(@class, 'ag-') and @r = '${row}' and @c = '${col}']`
        );
    }
    async moveObjectByColumnBorder(objectName, colNum) {
        let srcel = await this.getObjectHeaderForShowDataSorting(objectName);
        await this.waitForElementVisible(srcel);
        let columnBorder = await this.getShowDataColumnBorder(colNum);
        await this.waitForElementVisible(columnBorder);
        await this.dragAndDropForAuthoringWithOffset({
            fromElem: srcel,
            toElem: columnBorder,
            toOffset: { x: -2, y: 2 },
        });
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async dragCellToRowHeader(objectToDrag, position, targetHeader) {
        const headerEl = await this.getObjectHeaderForShowDataSorting(objectToDrag);
        const targetEl = await this.getObjectHeaderForShowDataSorting(targetHeader);
        const x = position === 'left' ? -12 : 12;
        await this.dragAndDropForAuthoringWithOffset({
            fromElem: headerEl,
            toElem: targetEl,
            toOffset: { x: x, y: 0 },
        });
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async dragCellToColHeader(objectToDrag, position, targetHeader) {
        const headerEl = await this.getObjectHeaderForShowDataSorting(objectToDrag);
        const y = position === 'top' ? -2 : 2;
        const targetEl = await this.getObjectHeaderForShowDataSorting(targetHeader);
        await this.dragAndDropForAuthoringWithOffset({
            fromElem: headerEl,
            toElem: targetEl,
            toOffset: { x: 0, y: y },
        });
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async isRowCountEqual(num) {
        const el = await this.getRowCount();
        await this.waitForElementVisible(el);
        let txt = await el.getText();
        console.log(parseInt(txt));
        return parseInt(txt) == parseInt(num);
    }

    async resizeColumnByMovingBorder(colNum, pixels, direction) {
        let columnBorder = await this.getShowDataColumnBorder(colNum),
            numOfPixels = direction.toLowerCase() === 'left' ? -pixels : pixels;

        await this.dragAndDropByPixel(columnBorder, numOfPixels, 0, true);
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }
}
