import AgGridVisualization from '../agGrid/AgGridVisualization.js';
import Common from '../authoring/Common.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
import LibraryAuthoringPage from '../library/LibraryAuthoringPage.js';
import BulkEdit from './BulkEdit.js';

export default class AgGrid extends AgGridVisualization {
    constructor() {
        super();
        this.common = new Common();
        this.loadingDialog = new LoadingDialog();
        this.bulkEdit = new BulkEdit();
        this.LibraryAuthoringPage = new LibraryAuthoringPage();
    }

    FormatPanelContent = `//*[@id="reactFormatPanel"]//div[contains(@class, 'content')]`;

    getGridCell(elementName, visualizationName) {
        const path = `${this.getContainerPath(
            visualizationName
        )}//div[contains(@class, 'ag-cell')]//span[text()='${elementName}']/parent::div`;
        return $(path);
    }

    getEditableColHeaderCell(headerName, visualizationName) {
        return $(
            `${this.getContainerPath(
                visualizationName
            )}//div[contains(@class, 'ag-header-cell')]//span[text()='${headerName}']/parent::div/parent::div`
        );
    }

    async getHeaderPencilIcon(index) {
        const script = `return window.getComputedStyle(document.querySelector('div.ag-header-cell:nth-of-type(${index}) span'),':after').getPropertyValue('content')`;
        const content = await browser.execute(script);
        return content;
    }

    getReactTooltip(text) {
        return $(
            `//div[contains(@class, 'txn-tooltip-popover-content') and not(contains(@class, 'ant-popover-hidden'))]//span[text()='${text}']`
        );
    }

    getTooltip(text) {
        return $(
            `//div[contains(@class, 'mstrmojo-Tooltip')][contains(@style, 'display: block;')]//div[text()='${text}']`
        );
    }

    getErrorWindow() {
        return $(`//div[contains(@class, 'mstrmojo-error-content')]`);
    }

    getErrorWindowByText(message) {
        return $(`//div[contains(@class, 'error-content')]//div[text()='${message}']`);
    }

    getConfirmationPopup() {
        return $(`//div[contains(@class, 'txn-consumption-popup')]`);
    }

    getTransactionSlider() {
        return $(`//div[contains(@class, 'mstrmojo-PopupList ctrl-popup-list') and contains (@style, 'display: block')]`);
    }

    getGridCellTextWithBreak(row, col, visualizationName, text) {
        const parts = text.split(/<br>/);
        let newText = `contains(text(), '${parts[0]}')`;
        for (let i = 1; i < parts.length; i++) {
            newText += ` and contains(., '${parts[i]}')`;
        }
        const path =
            `${this.getContainerPath(
                visualizationName
            )}//div[contains(@class, 'ag-') and @r = '${row}' and @c = '${col}']//span[` +
            newText +
            `]`;
        return $(path);
    }

    get pulldownPopuplist() {
        return $(`//div[contains(@class,'mstrmojo-PopupList')][contains(@style,'display: block')]`);
    }

    getSearchableDropdownListContent() {
        return $(`//div[contains(@class,'mstrmojo-popupList-scrollBar')]`);
    }

    getSearchablePopupListItem(searchText, itemName) {
        const index = itemName.indexOf(searchText);
        let path;
        if (searchText !== itemName) {
            if (index >= 1) {
                const text1 = itemName.slice(0, index);
                const text3 = itemName.slice(index + searchText.length);
                path = `//div[contains(@class, 'mstrmojo-PopupList') and contains(@style, 'display: block;')]//div[contains(@class, 'mstrmojo-popupList-scrollBar') and contains(@class, 'mstrmojo-scrollNode')]//div[contains(@class,'item') and (text()='${
                    text1 + text3
                }' or text()='${text1}')]`;
            } else {
                const text = itemName.slice(searchText.length);
                path = `//div[contains(@class, 'mstrmojo-PopupList') and contains(@style, 'display: block;')]//div[contains(@class, 'mstrmojo-popupList-scrollBar') and contains(@class, 'mstrmojo-scrollNode')]//div[contains(@class,'item') and text()='${text}']`;
            }
        } else {
            path = `//div[contains(@class, 'mstrmojo-PopupList') and contains(@style, 'display: block;')]//div[contains(@class, 'mstrmojo-popupList-scrollBar') and contains(@class, 'mstrmojo-scrollNode')]//div[contains(@class,'item')]/span[text()='${searchText}']`;
        }
        return $$(path).first();
    }

    getAllSearchableDropdownOptions() {
        const dropdownEl = this.getSearchableDropdownListContent();
        const options = dropdownEl.$$(`./descendant::div[contains(@class,'item')]`);
        return options;
    }

    async waitForTransactionSliderDisplayed() {
        const slider = this.getTransactionSlider();
        await slider.waitForDisplayed({ timeout: 10000 });
    }

    async getSearchableDropdownAmplifier() {
        const script = `return window.getComputedStyle(document.querySelector('div.mstrmojo-ui-Pulldown-text'),':after').getPropertyValue('content')`;
        const content = await browser.execute(script);
        return content;
    }

    async selectDropdownOption(option) {
        const optionToSelect = this.common.getPopupListItem(option);
        await this.clickOnElement(optionToSelect);
    }

    async selectSearchableDropdownOption(searchText, option) {
        const optionToSelect = this.getSearchablePopupListItem(searchText, option);
        await this.clickOnElement(optionToSelect);
    }

    async getWarningTooltip(text) {
        return $(
            `//div[contains(@class, 'txn-tooltip-popover-content') and not(contains(@class, 'ant-popover-hidden'))]//span[text()='${text}']/preceding-sibling::span[contains(@class, 'icon-status-warning')]`
        );
    }

    async getAfterSubmissionText(text) {
        return $(`//div[contains(text(), "${text}")]`);
    }

    async getConfirmationPopupButton(option) {
        return $(
            `//div[contains(@class, 'txn-consumption-popup')][contains(@style, 'z-index: 1000;')]//div[text()='${option}']`
        );
    }

    async selectConfirmationPopupOption(option) {
        const button = await this.getConfirmationPopupButton(option);
        await this.clickOnElement(button);
    }

    async waitForConsumptionModeToRefresh() {
        await this.LibraryAuthoringPage.waitLibraryLoadingIsNotDisplayed({ timeout: 60 });
        await this.waitForCurtainDisappear();
    }

    async clickErrorWindowButton(text) {
        const button = $(
            `.//div[contains(@class, 'mstrmojo-alert')]//div[contains(@class, 'mstrmojo-Editor-button')]//div[text()='${text}']`
        );
        await this.clickOnElement(button);
    }

    async getPulldownOptionCount() {
        const el = this.pulldownPopuplist;
        await el.waitForDisplayed({ timeout: 10000 });
        return el.$$(`.//div[contains(@class, 'mstrmojo-popupList-scrollBar')]/div/div[contains(@class, 'item')]`)
            .length;
    }

    async getTransactionDialogText(containerName) {
        const changes = await this.bulkEdit.getTxnChangeText(containerName);
        const isDisplayed = await changes.isDisplayed();

        if (isDisplayed) {
            const text = await changes.getText();
            return text;
        }
        return ''; // Return an empty string if the dialog text is not displayed
    }

    async getTransactionDialogTextHeight(containerName, text) {
        let heightValue = await this.bulkEdit.getTxnNodesToChange(containerName, text).getCSSProperty('height');
        return heightValue.value;
    }

    async clickActiontoOpenTransactionEditor(actionName) {
        const action = $(`${this.FormatPanelContent}//div[text()='${actionName}']`);
        await this.clickOnElement(action);
    }
}
