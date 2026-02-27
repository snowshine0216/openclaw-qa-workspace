import BasePage from '../base/BasePage.js';
import Checkbox from './TXNSQLEditorCheckbox.js';

export default class DataSourceEditor extends BasePage {
    constructor() {
        super();
        this.checkbox = new Checkbox();
    }

    get dataSourceEditor() {
        return $(`//div[contains(@class, 'txn-whc-modal')]//div[@class='ant-modal-content']`);
    }

    getDataSourceEditorByText(text) {
        return $(`//div[@class='ant-modal-title'][text()='${text}']//ancestor::div[@class='ant-modal-content'][1]`);
    }

    get dataCatalog() {
        return this.dataSourceEditor.$(`.//div[contains(@class, 'txn-whc-datacatalog')]`);
    }

    get tablePreview() {
        return this.dataSourceEditor.$(`.//div[contains(@class, 'txn-whc-preview')]`);
    }

    get dataSourceFilter() {
        return $(
            `//div[contains(@class, 'mini-toolbar-filter-dropdown') and contains(@class, 'datasource-mini-toolbar-filter-dropdown')]`
        );
    }

    getDataSourceFilter(visible = true) {
        if (visible) {
            return this.dataSourceFilter.$(`./parent::div[not(contains(@class, 'ant-dropdown-hidden'))]`);
        } else {
            return this.dataSourceFilter.$(`./parent::div[contains(@class, 'ant-dropdown-hidden')]`);
        }
    }

    getDatasourceFilterTrigger() {
        return this.dataSourceEditor.$(`//a[@class='mini-toolbar-link']`);
    }

    getSelectAllCheckboxInDatasourceFilter() {
        return this.dataSourceFilter.$(
            `//div[contains(@class, 'mini-toolbar-filter-row')]//div[contains(@class, 'datasource-ds-name') and contains(@class, 'datasource-select-all') and text()='Select All']//preceding-sibling::label[contains(@class, 'mini-toolbar-filter-checkbox')]`
        );
    }

    getAllCheckboxInDatasourceFilter() {
        return this.dataSourceFilter.$$(
            `//div[@class='mini-toolbar-filter-row']//label[contains(@class, 'ant-checkbox-wrapper') and contains(@class, 'mini-toolbar-filter-checkbox')]`
        );
    }

    getAllSelectedCheckboxInDatasourceFilter() {
        return this.dataSourceFilter.$$(
            `//div[@class='mini-toolbar-filter-row']//label[contains(@class, 'ant-checkbox-wrapper') and contains(@class, 'mini-toolbar-filter-checkbox') and contains(@class, 'ant-checkbox-wrapper-checked')]`
        );
    }

    getDatasourceFilterSearchBox() {
        return this.dataSourceFilter.$(
            `//div[contains(@class, 'mini-toolbar-filter-searchbox')]//input[contains(@class, 'ant-select-selection-search-input')]`
        );
    }

    getDatasourceFilterSearchResultNodes() {
        return $$(
            `.//div[contains(@class, 'mini-toolbar-filter-dropdown') and contains(@class, 'datasource-mini-toolbar-filter-dropdown')]//div[contains(@class, 'mini-toolbar-filter-row')]//span[contains(@class, 'text-search-highlight') and contains(@class, 'datasource-ds-name')]`
        ).map(async (elm) => {
            return await elm.getText();
        });
    }

    getTablePreviewWithName(tableName) {
        return this.tablePreview.$(`.//div[contains(@class, 'preview-tablename')][text()='${tableName}']`);
    }

    getTablePreviewTitleByName(title) {
        return this.tablePreview.$(`.//div[contains(@class, 'preview-title')][string()='${title}']`);
    }

    getAllTablePreviewColumnRows() {
        return this.tablePreview.$$(`.//ul[contains(@class, 'ant-list-items')]/li[contains(@class, 'ant-list-item')]`);
    }

    getTablePreviewColumnRowByIndex(index) {
        return this.getAllTablePreviewColumnRows().get(index);
    }

    async getAllTablePreviewColumnRowNames(length) {
        let columnNames = [];
        for (let i = 0; i < length; i++) {
            let column = this.getTablePreviewColumnRowByIndex(i);
            await this.waitForElementVisible(column, browser.params.timeout.waitDOMNodePresentTimeout10);
            let columnNameElement = column.$(`.//span[contains(@class, 'column-row-name')]`);
            await this.waitForElementVisible(columnNameElement, browser.params.timeout.waitDOMNodePresentTimeout10);
            columnNames[i] = await columnNameElement.getText();
        }
        return columnNames;
    }

    getItem(type, itemName) {
        let xpathString;
        switch (type.toLowerCase()) {
            case 'db instance':
                xpathString = `.//div[contains(@class, 'ds-connection-name')][text()='${itemName}']`;
                break;
            case 'table':
                xpathString = `.//div[contains(@class, 'table-name')][text()='${itemName}']`;
                break;
            case 'column':
                xpathString = `.//div[contains(@class, 'column-row')]//div[contains(@class, 'ds-connection-name')][text()='${itemName}']`;
                break;
            default:
                throw 'Invalid item type in Data Catalog!';
        }
        let dataCatalogElement = this.dataSourceEditor.$(`.//div[contains(@class, 'txn-whc-datacatalog')]`);
        return dataCatalogElement.$(xpathString);
    }

    getItemInSuggestionList(type, stringType, itemNameString) {
        let rowText, subXpath;
        switch (type.toLowerCase()) {
            case 'db instance':
                rowText = 'datasource-row';
                break;
            case 'table':
                rowText = 'datasource-table-row';
                break;
            case 'column':
                rowText = 'column-row';
                break;
            default:
                throw 'Invalid item type in Data Catalog!';
        }
        switch (stringType.toLowerCase()) {
            case 'leftstring':
            case 'rightstring':
                subXpath = "span[text()='" + itemNameString + "']";
                break;
            case 'searchkey':
                subXpath = "mark[text()='" + itemNameString + "'][1]";
                break;
            default:
                throw 'Invalid string type!';
        }
        const els = this.dataCatalog
            .$$(
                `.//div[contains(@class, 'catalog-datasource-list')]//div[contains(@class, '${rowText}')]//span[contains(@class,'text-search-highlight')]/${subXpath}`
            );
        return els[0];
    }

    getItemRowCount(type) {
        let rowText;
        switch (type.toLowerCase()) {
            case 'db instance':
                rowText = 'datasource-row';
                break;
            case 'table':
                rowText = 'datasource-table-row';
                break;
            case 'column':
                rowText = 'column-row';
                break;
            default:
                throw 'Invalid item type in Data Catalog!';
        }
        return this.dataCatalog
            .$(`.//div[contains(@class, 'catalog-datasource-list')]//div[contains(@class, '${rowText}')]`)
            .count();
    }

    getNamespacePopup() {
        return this.dataCatalog.$(
            `.//div[contains(@class, 'ant-dropdown') and contains(@class, 'data-source-name') and not(contains(@class, 'ant-dropdown-hidden'))]`
        );
    }

    getDataCatalogTitleElementByText(text) {
        return this.dataSourceEditor.$(`.//div[contains(@class, 'panel-tab-title') and string()='${text}']`);
    }

    getNamespaceRefreshIcon() {
        return this.getNamespacePopup().$(`.//div[contains(@class, 'namespace-list-refresh')]`);
    }

    getNamespaceListButton(buttonName) {
        return this.getNamespacePopup().$(
            `.//div[contains(@class, 'namespace-list-buttons')]/button[text()='${buttonName}']`
        );
    }

    getAllNamespaceRows() {
        return this.getNamespacePopup().$$(
            `.//div[contains(@class, 'namespace-option-list')]/div[@class='namespace-list-show']//div[@class='mini-toolbar-filter-row']`
        );
    }

    getNamespaceRow(namespaceName) {
        return this.getNamespacePopup().$(
            `.//div[contains(@class, 'namespace-option-list')]/div[@class='namespace-list-show']//span[text()='${namespaceName}']//ancestor::div[@class='mini-toolbar-filter-row']`
        );
    }

    getNamespaceCheckbox(namespaceName) {
        return this.checkbox.getCheckbox(this.getNamespaceRow(namespaceName));
    }

    getNamespaceCheckboxStatusNode(namespaceName, status) {
        return this.checkbox.getStatusNode(this.getNamespaceRow(namespaceName), status);
    }

    getNamespaceRowOnlyIcon(namespaceName) {
        return this.getNamespaceRow(namespaceName).$(`.//div[contains(@class, 'namespace-option-only')]`);
    }

    getSelectedNamespace(dbName, namespaceName, isSearchResult) {
        if (isSearchResult) {
            return this.getItemInSuggestionList('db instance', 'searchkey', dbName).$(
                `.//ancestor::div[contains(@class, 'datasource-row')][1]//following-sibling::div//div[contains(@class, 'namespace-list-container')]//div[@class='namespace-text'][text()='${namespaceName}']`
            );
        }
        return this.getItem('db instance', dbName).$(
            `.//ancestor::div[contains(@class, 'datasource-row')][1]//following-sibling::div//div[contains(@class, 'namespace-list-container')]//div[@class='namespace-text'][text()='${namespaceName}']`
        );
    }

    getSelectedNamespaceFromTable(dbName, namespaceName, isSearchResult) {
        if (isSearchResult) {
            return this.getItemInSuggestionList('table', 'searchkey', dbName).$(
                `.//ancestor::div[contains(@class, 'datasource-row')][1]//following-sibling::div//div[contains(@class, 'namespace-list-container')]//div[@class='namespace-text'][text()='${namespaceName}']`
            );
        }
        return this.getItem('table', dbName).$(
            `.//ancestor::div[contains(@class, 'datasource-row')][1]//following-sibling::div//div[contains(@class, 'namespace-list-container')]//div[@class='namespace-text'][text()='${namespaceName}']`
        );
    }

    getNamespaceToggleIcon(dbName, namespaceName) {
        return this.getItem('db instance', dbName).$(
            `.//ancestor::div[contains(@class, 'datasource-row')]//following-sibling::div//div[contains(@class, 'namespace-list-container')]//div[@class='namespace-text'][text()='${namespaceName}']//parent::div//preceding-sibling::div[contains(@class, 'ns-toggle-arrow')]`
        );
    }

    getTable(dbName, namespaceName, tableName) {
        return this.getItem('db instance', dbName).$(
            `.//ancestor::div[contains(@class, 'datasource-row')]//following-sibling::div//div[contains(@class, 'namespace-list-container')]//div[@class='namespace-text'][text()='${namespaceName}']//ancestor::div[contains(@class, 'namespace-row')]//following-sibling::div//div[contains(@class, 'table-name')][text()='${tableName}']`
        );
    }

    getTableToggleIcon(dbName, namespaceName, tableName) {
        return this.getTable(dbName, namespaceName, tableName).$(
            `.//parent::div//preceding-sibling::div[contains(@class, 'tl-toggle-arrow')]`
        );
    }

    getDataSourceToggleIcon(dbName) {
        return this.getItem('db instance', dbName).$(`.//ancestor::div[contains(@class, 'datasource-row')]`);
    }

    getTableColumns(dbName, namespaceName, tableName) {
        return this.getTable(dbName, namespaceName, tableName).$$(
            `.//ancestor::div[contains(@class, 'datasource-table-row')]//parent::div//div[contains(@class, 'column-row')]`
        );
    }

    getTableColumnByIndex(index, dbName, namespaceName, tableName) {
        return this.getTableColumns(dbName, namespaceName, tableName).get(index);
    }

    get searchBox() {
        return this.dataCatalog.$(
            `.//div[contains(@class, 'whc-search-box')][contains(@class, 'mini-toolbar-searchbox')]//input[contains(@class, 'ant-select-selection-search-input')]`
        );
    }

    getButtonOnFooter(name) {
        return this.dataSourceEditor.$(
            `.//div[contains(@class, 'ant-modal-footer')]//span[text()='${name}']/parent::button`
        );
    }

    getDatasourceFilterSearchResult() {
        let searchResult = this.getDatasourceFilterSearchResultNodes();
        return searchResult;
    }

    getDatasourceListContainer() {
        return this.dataSourceEditor.$(`.//div[contains(@class, 'datasource-list-container')]`);
    }

    async selectDataSourceItem(dbName) {
        let el = this.getDataSourceItem(dbName);
        await this.clickOnElement(el);
    }

    async selectItem(type, itemName) {
        let el = this.getItem(type, itemName);
        await this.clickOnElement(el);
    }

    async scrollAndSelectItem(type, itemName) {
        let el = await this.getItem(type, itemName);
        let isPresent = await el.isExisting();

        if (isPresent) {
            await this.clickOnElement(el);
        } else {
            let dataSourceContainer = this.dataCatalog;
            await dataSourceContainer.waitForClickable({ timeout: 60000 });

            let containerHeight;
            const size = await dataSourceContainer.getSize();
            containerHeight = size.height;

            let dataSourceListContainer = this.getDatasourceListContainer();
            await dataSourceListContainer.waitForClickable({ timeout: 60000 });

            let containerContentHeight = await dataSourceListContainer.getAttribute('scrollHeight');
            console.log('containerContentHeight: ' + containerContentHeight);
            console.log('containerHeight: ' + containerHeight);

            let i = 0;
            if (containerContentHeight > containerHeight) {
                do {
                    i++;
                    await browser.executeScript(
                        'arguments[0].scrollTop = arguments[1];',
                        dataSourceListContainer,
                        200 * i
                    );
                    await this.sleep(2000);

                    el = await this.getItem(type, itemName);
                    isPresent = await el.isExisting();
                    if (isPresent) {
                        await this.clickOnElement(el);
                        break;
                    }
                    containerContentHeight = await dataSourceListContainer.getAttribute('scrollHeight');
                } while (containerContentHeight > containerHeight + 200 * i);
            }
        }
    }

    async selectItemInSuggestionList(type, searchKey, stringType) {
        let el = this.getItemInSuggestionList(type, stringType, searchKey);
        await this.clickOnElement(el);
    }

    async clickNamespaceListButton(buttonName) {
        let el = this.getNamespaceListButton(buttonName);
        await this.clickOnElement(el);
    }

    async setNamespaceCheckbox(namespaceName, isActionCheck) {
        await this.waitForElementVisible(this.getNamespaceRow(namespaceName));
        await this.checkbox.setCheckbox(this.getNamespaceRow(namespaceName), isActionCheck);
    }

    async typeParameterToInputField(el, parameter) {
        const tagName = await el.getTagName();
        if (tagName !== 'input') {
            throw new Error('Element not an input field. Cannot sendKeys.');
        }

        await el.setValue('');
        await browser.pause(300); 
        await el.setValue(parameter.toString());
    }
    
    async searchForObject(objectName) {
        let searchField = this.searchBox;
        await this.typeParameterToInputField(searchField, objectName);
        await this.sleep(2000);
    }

    async clearSearchForObject() {
        let searchField = this.searchBox;
        await this.clearTextByBackSpace(searchField);
        await this.sleep(1);
    }

    async clickButtonOnFooter(name) {
        let el = this.getButtonOnFooter(name);
        await this.clickOnElement(el);
    }

    async validateNamespaceCheckbox(namespaceName, expectedStatus) {
        let isChecked = expectedStatus.toLowerCase() === 'checked';
        let el = this.getNamespaceCheckboxStatusNode(namespaceName, expectedStatus.toLowerCase());
        expect(await this.checkVisibility(el, isChecked)).equal(true);
    }

    async openDatasourceFilter() {
        let el = this.getDatasourceFilterTrigger();
        await this.clickOnElement(el);
    }

    async clickSelectAllFilter() {
        let el = this.getSelectAllCheckboxInDatasourceFilter();
        await this.clickOnElement(el);
    }

    async setCheckboxForSelectAll(isActionCheck) {
        await this.checkbox.setCheckbox(this.getSelectAllCheckboxInDatasourceFilter(), isActionCheck);
    }

    async searchDatasource(searchText) {
        let searchBox = this.getDatasourceFilterSearchBox();
        await this.typeParameterToInputField(searchBox, searchText);
        await this.sleep(1);
    }

    async clickDatasourceFilterCheckbox(index) {
        let el = this.getAllCheckboxInDatasourceFilter();
        await this.clickOnElement(el.get(index));
    }

    async getSelectedDatasourceFilterCheckboxCount() {
        let el = this.getAllSelectedCheckboxInDatasourceFilter();
        return await el.count();
    }

    async validatePreviewColumn(index, iconType, columnName, typeName) {
        let dsColumn = this.getTablePreviewColumnRowByIndex(index);
        await this.waitForElementVisible(dsColumn, browser.params.timeout.waitDOMNodePresentTimeout10);
        let dsIconType = dsColumn.$(`.//div[contains(@class, 'data-type-icon') and contains(@class, '${iconType}')]`);
        let dsColumnName = dsColumn.$(`.//span[contains(@class, 'column-row-name') and text()='${columnName}']`);
        let dsTypeName = await dsColumn.$(`.//span[contains(@class, 'column-row-type')]`).getAttribute('innerText');
        expect(await this.checkVisibility(dsIconType, true)).equal(true);
        expect(await this.checkVisibility(dsColumnName, true)).equal(true);
        expect(dsTypeName).equal(typeName);
    }

    async validatePreviewColumnWIOOrder(length, iconType, columnName, typeName) {
        const names = await this.getAllTablePreviewColumnRowNames(length);
        const index = names.indexOf(columnName);
        const dsColumn = this.getTablePreviewColumnRowByIndex(index);
        await this.waitForElementVisible(dsColumn, browser.params.timeout.waitDOMNodePresentTimeout10);
        const dsIconType = dsColumn.$(`.//div[contains(@class, 'data-type-icon') and contains(@class, '${iconType}')]`);
        const dsTypeName = await dsColumn.$(`.//span[contains(@class, 'column-row-type')]`).getAttribute('innerText');
        expect(await this.checkVisibility(dsIconType, true)).to.equal(true);
        expect(dsTypeName).to.equal(typeName);
    }

    async validateTableColumn(index, iconType, columnName, dbName, namespaceName, tableName) {
        const column = this.getTableColumnByIndex(index, dbName, namespaceName, tableName);
        const dsIconNode = column.$(`.//div[contains(@class, 'column-type-icon')]`);
        await this.waitForElementVisible(dsIconNode, browser.params.timeout.waitDOMNodePresentTimeout5);
        const iconClass = await dsIconNode.getAttribute('class');
        const iconClassArray = iconClass.split(' ');
        const hasIcon = iconClassArray.includes('single-icon-functions-' + iconType);
        expect(hasIcon).to.equal(true);

        const dsColumnNameNode = column.$(`.//div[contains(@class, 'ds-connection-name')]`);
        await this.waitForElementVisible(dsColumnNameNode, browser.params.timeout.waitDOMNodePresentTimeout5);
        const dsColumnName = await dsColumnNameNode.getText();
        expect(dsColumnName).to.equal(columnName);
    }
}
