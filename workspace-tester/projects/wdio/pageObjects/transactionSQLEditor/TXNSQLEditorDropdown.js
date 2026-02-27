//import DocAuthBasePage from '../base/DocAuthBasePage.js';
import BasePage from '../base/BasePage.js';

//} extends DocAuthBasePage {
export default class TXNSQLEditorDropdown extends BasePage {
    getCurrentSelection(rootElement, currentSelection) {
        return rootElement.$(
            `.//div[@class='ant-select-selector']//span[@class='ant-select-selection-item'][@title='${currentSelection}' or text()='${currentSelection}']`
        );
    }

    getCurrentSelectionWithIcon(rootElement, currentSelection) {
        return rootElement.$(
            `.//div[@class='ant-select-selector']//span[@class='ant-select-selection-item']/span[text()='${currentSelection}']`
        );
    }

    getCurrentSelectionForDatasetProperty(rootElement, label, currentSelection) {
        switch (label.toLowerCase()) {
            case 'source':
                return rootElement.$(
                    `.//div[@class='ant-select-selector']//span[@class='ant-select-selection-item']/span[contains(@class, 'dataset-source-icon')]/following-sibling::text()[contains(.,'${currentSelection}')]/parent::span`
                );
            case 'attribute':
                return rootElement.$(
                    `.//div[@class='ant-select-selector']//span[@class='ant-select-selection-item']/span[contains(@class, 'dataset-attribute-icon')]/following-sibling::span[text()='${currentSelection}']/parent::span`
                );
            default:
                return this.getCurrentSelection(rootElement, currentSelection);
        }
    }

    getDropdownOptionsForDatasetProperty(rootElement) {
        return rootElement.$$(`.//div[@class='ant-select-selector']//span[@class='ant-select-selection-item']`);
    }

    getDropdownForDatasetProperty(rootElement) {
        return rootElement.$(`.//div[contains(@class, 'txn-select-container')]`);
    }

    getCurrentSelectionForInputValue(rootElement, currentSelection) {
        if (currentSelection === 'placeholder') {
            return rootElement.$(
                `.//div[@class='ant-select-selector']//span[@class='ant-select-selection-placeholder']//parent::div[@class='ant-select-selector'][1]//input`
            );
        } else {
            return rootElement.$(
                `.//div[@class='ant-select-selector']//span[@class='ant-select-selection-item']/span[text()='${currentSelection}']`
            );
        }
    }

    getArrow(rootElement) {
        return rootElement.$(`.//span[@class='ant-select-arrow']`);
    }

    getDisabledDropdown(rootElement) {
        return rootElement.$(
            `.//div[contains(@class,'ant-select-disabled')]/div[@class='ant-select-selector']//span[@class='ant-select-selection-item']`
        );
    }

    getDropdownListContent() {
        return $(
            `//div[contains(@class,'ant-select-dropdown') and not(contains(@class,'hidden'))]//div[@class='rc-virtual-list']/div[@class='rc-virtual-list-holder']`
        );
    }

    getAllOptions() {
        return this.getDropdownListContent().$$(`.//div[contains(@class,'ant-select-item-option-content')]`);
    }

    getDropDownWholeList() {
        return this.getDropdownListContent().$(`./div`);
    }

    getSelection(option) {
        return this.getDropdownListContent().$(
            `.//div[contains(@class, 'ant-select-item-option-content')][text()='${option}']`
        );
    }

    getSelectionWithIcon(option) {
        return this.getDropdownListContent().$(
            `.//div[contains(@class, 'ant-select-item-option-content')]/span[text()='${option}']`
        );
    }

    getSelectionForInputValue(option) {
        return this.getDropdownListContent().$(
            `.//div[contains(@class, 'ant-select-item-option-content')]/span[text()='${option}']`
        );
    }

    async clickOnDropdown(rootElement, currentSelection) {
        const el = this.getCurrentSelection(rootElement, currentSelection);
        await this.clickOnElement(el);
    }

    async setSelection(rootElement, currentSelection, selection) {
        const el = this.getCurrentSelection(rootElement, currentSelection);
        await this.clickOnElement(el);
        const ddItem = this.getSelection(selection);
        await this.clickOption(ddItem);
    }

    async setSelectionWithIcon(rootElement, currentSelection, selection) {
        const el = this.getCurrentSelectionWithIcon(rootElement, currentSelection);
        await this.clickOnElement(el);
        const ddItem = this.getSelectionWithIcon(selection);
        await this.clickOption(ddItem);
    }

    async setSelectionWithError(rootElement, selection) {
        await this.clickOnElement(rootElement);
        const ddItem = this.getSelection(selection);
        await this.clickOption(ddItem);
    }

    async setSelectionForElement(currentSelectionElement, optionElement) {
        await this.clickOnElement(currentSelectionElement);
        await this.clickOption(optionElement);
    }

    async clickOption(ddItem, ContentWindow_Height = 150) {
        const ddListContent = this.getDropdownListContent();
        const ddWholeList = this.getDropDownWholeList();
        await this.scrollDownToTargetOption(ddListContent, ddWholeList, ddItem, ContentWindow_Height);
        await this.clickOnElement(ddItem);
    }

    async scrollAndCountOptions(ContentWindow_Height = 350) {
        let itemsArray = await this.getAllOptionNames();
        const ddListContent = this.getDropdownListContent();
        await browser.wait(EC.presenceOf(ddListContent), browser.params.timeout.waitDOMNodePresentTimeout5);
        const ddWholeList = this.getDropDownWholeList();
        await browser.wait(EC.presenceOf(ddWholeList), browser.params.timeout.waitDOMNodePresentTimeout5);
        const ddContentHeight = await this.getElementHeight(ddListContent);
        const ddWholeListHeight = await this.getElementHeight(ddWholeList);

        if (ddWholeListHeight > ddContentHeight) {
            let length;
            let currentItemsArray = [];
            for (let i = 0; i < ddWholeListHeight / ContentWindow_Height; i++) {
                length = ContentWindow_Height * (i + 1);
                await browser.executeScript('arguments[0].scrollTop = arguments[1];', ddListContent, length);
                await this.sleep(1000);
                currentItemsArray = await this.getAllOptionNames();
                const currentItemsCount = await currentItemsArray.length;
                for (let j = 0; j < currentItemsCount; j++) {
                    if (itemsArray.indexOf(currentItemsArray[j]) === -1) {
                        itemsArray.push(currentItemsArray[j]);
                    }
                }
            }
            await browser.executeScript('arguments[0].scrollBy(0, arguments[1]);', ddListContent, length * -1);
        }
        return itemsArray.length;
    }

    async getAllOptionNames() {
        const nodes = this.getAllOptions();
        await browser.wait(EC.presenceOf(nodes), browser.params.timeout.waitDOMNodePresentTimeout60);
        const count = await nodes.count();
        const names = [];
        for (let j = 0; j < count; j++) {
            const text = await nodes.get(j).getText();
            if (text.length) {
                names.push(text);
            }
        }
        return names;
    }

    async getDeleteButtonByRow(row) {
        return $$("//div[contains(@class, 'delete-column-container')]//button[contains(@class,'txn-insert-remove')]")[
            parseInt(row, 10) - 1
        ];
    }
}
